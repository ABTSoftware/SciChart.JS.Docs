import * as SciChart from "scichart";

// A simulated pumping station: a tank filled by an inlet flow and emptied by a pump that starts and stops on level.
// One reading per second for each tag. A seeded random generator makes the data the same every time the page loads.
// Upsets (an inlet surge, a pressure spike, a temperature excursion) happen now and then, so alarms appear.
function createProcess() {
    let seed = 20261120;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const noise = (size) => (random() - 0.5) * 2 * size;

    let t = 0; // seconds since the simulation started
    let level = 45; // tank level (%)
    let pumpOn = false;
    let startAt = 84; // the level controller starts the pump here...
    let stopAt = 28; // ...and stops it here (both vary from cycle to cycle)
    let pressure = 1.2; // pump discharge pressure (bar)
    let drift = 0; // slow random drift of the inlet flow
    let tempDrift = 0;
    let upset = { kind: "", until: 0 };

    // Returns one reading per tag: [level %, inlet flow m3/h, discharge pressure bar, temperature degC]
    return function nextReading() {
        t++;
        if (!upset.kind && random() < 1 / 300) {
            const kinds = ["surge", "pressure", "temperature"];
            upset = { kind: kinds[Math.floor(random() * 3)], until: t + 60 + random() * 120 };
        }
        if (upset.kind && t > upset.until) upset = { kind: "", until: 0 };

        drift = Math.max(-25, Math.min(25, drift + noise(1.5)));
        const inlet = 115 + 20 * Math.sin((2 * Math.PI * t) / 1500) + drift + (upset.kind === "surge" ? 55 : 0);
        const outlet = pumpOn ? 210 : 15;
        level += ((inlet - outlet) / 3600) * 10; // a 10 m3 tank: 1 m3 = 10 % of its level
        if (!pumpOn && level >= startAt) {
            pumpOn = true;
            stopAt = 16 + random() * 16;
        } else if (pumpOn && level <= stopAt) {
            pumpOn = false;
            startAt = 76 + random() * 16;
        }
        const target = (pumpOn ? 5.4 + 0.02 * level : 1.2) + (upset.kind === "pressure" && pumpOn ? 2.2 : 0);
        pressure += (target - pressure) / 6; // the pressure settles over a few seconds
        tempDrift = Math.max(-6, Math.min(6, tempDrift + noise(0.3)));
        const temperature =
            58 + 8 * Math.sin((2 * Math.PI * t) / 2400) + tempDrift + (upset.kind === "temperature" ? 13 : 0);
        return [level + noise(0.5), inlet + noise(3), pressure + noise(0.12), temperature + noise(1.2)];
    };
}

// The control bar, the chart and the alarm list each need an element. This splits the page's div into them;
// in your app they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    const font = "14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const bar = document.createElement("div");
    bar.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff; font:" + font;
    bar.innerHTML =
        `<label>Style <select data-id="style" style="font:inherit">` +
        `<option value="colour">Colourful</option><option value="grey">High-performance (grey)</option></select></label>` +
        `<label>Time span <select data-id="span" style="font:inherit">` +
        `<option value="120">2 min</option><option value="600" selected>10 min</option>` +
        `<option value="3600">60 min (history)</option></select></label>` +
        `<label>Deadband <select data-id="deadband" style="font:inherit">` +
        `<option value="0">None</option><option value="0.02" selected>2% of range</option>` +
        `<option value="0.05">5% of range</option></select></label>` +
        `<button data-id="pause" style="font:inherit; padding:2px 12px; cursor:pointer">Pause</button>` +
        `<span style="color:#c8d3e8">Drag a HI or LO line to change a limit</span>`;
    const row = document.createElement("div");
    row.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const chartDiv = document.createElement("div");
    chartDiv.id = divElementId + "-trend";
    chartDiv.style.cssText = "flex:1 1 420px; min-height:300px;";
    const panel = document.createElement("div");
    panel.style.cssText =
        "flex:0 1 250px; min-width:200px; max-height:100%; overflow:auto; padding:8px 10px; box-sizing:border-box;" +
        "font:13px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    panel.innerHTML =
        `<div data-id="heading" style="font-weight:700; margin-bottom:6px">Alarms</div>` +
        `<ol data-id="alarms" aria-live="polite" style="list-style:none; margin:0; padding:0"></ol>`;
    row.append(chartDiv, panel);
    root.append(bar, row);
    const [styleSelect, spanSelect, deadbandSelect] = Array.from(bar.querySelectorAll("select"));
    return {
        chartDiv,
        panel,
        heading: panel.querySelector('[data-id="heading"]'),
        alarmList: panel.querySelector('[data-id="alarms"]'),
        styleSelect,
        spanSelect,
        deadbandSelect,
        pauseButton: bar.querySelector("button")
    };
}

async function hmiTrendChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // An HMI trend display with SciChart.js: four process tags on stacked axes, streaming live,
    // with draggable HI and LO alarm limits, a deadband, an alarm list and a grey high-performance style.
    // Each pen changes colour exactly where it crosses a limit, and the part beyond the limit is shaded.
    const {
        SciChartSurface,
        DateTimeNumericAxis,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EXyDirection,
        ELabelPlacement,
        EStrokePaletteMode,
        FastLineRenderableSeries,
        FastBandRenderableSeries,
        XyDataSeries,
        XyyDataSeries,
        XyBaseRenderDataTransform,
        XyyBaseRenderDataTransform,
        HorizontalLineAnnotation,
        LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
        parseColorToUIntArgb,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const START = Date.UTC(2026, 0, 12, 7, 0, 0) / 1000; // the trend's clock, in seconds (shown as UTC)
    const HISTORY = 3600; // seconds of history loaded before the live data starts
    const CAPACITY = 7200; // readings kept per tag (two hours at one per second)
    const ALARM_RED = "#E53935"; // the colour of a pen beyond its limit
    const ALARM_FILL = "#E5393566"; // the translucent shading between the pen and the limit it crossed

    // One pen per process tag, each with its own axis range and alarm limits (engineering units)
    const pens = [
        { tag: "LT-101", name: "Tank level", unit: "%", min: 0, max: 100, lo: 20, hi: 75, color: "#50C7E0" },
        { tag: "FT-102", name: "Inlet flow", unit: "m³/h", min: 0, max: 250, lo: 60, hi: 175, color: "#3BD16F" },
        { tag: "PT-103", name: "Discharge pressure", unit: "bar", min: 0, max: 10, lo: 0.5, hi: 7.5, color: "#F6E05E" },
        { tag: "TT-104", name: "Temperature", unit: "°C", min: 0, max: 100, lo: 30, hi: 72, color: "#C3B4F0" }
    ].map((pen, index) => ({
        ...pen,
        axisId: `pen${index}`,
        inAlarm: "", // "", "HI" or "LO"
        axis: null, // filled in below: its y-axis, data series, line and limit lines
        data: null,
        line: null,
        fillData: null,
        fill: null,
        hiLine: null,
        loLine: null
    }));

    const theme = new SciChartJsNavyTheme();
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(ui.chartDiv, { theme });

    const xAxis = new DateTimeNumericAxis(wasmContext, { autoRange: EAutoRange.Never });
    sciChartSurface.xAxes.add(xAxis);

    // Stack the y-axes top to bottom, so each tag gets its own lane, like the pens of a strip chart recorder
    sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy = new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();

    // --- Splitting each pen at its limits, with the Render Data Transforms API ---
    // A line segment that crosses a limit is drawn in one colour from end to end. To change colour exactly at
    // the limit, the transforms below add a point wherever a segment crosses LO or HI, just before drawing.
    // The data series isn't changed, so tooltips and the alarm logic still see the real readings.
    function splitAtLimits(pointSeries, from, to, lo, hi, add) {
        const xs = pointSeries.xValues;
        const ys = pointSeries.yValues;
        let lastX = xs.get(from);
        let lastY = ys.get(from);
        add(lastX, lastY, from);
        for (let i = from + 1; i <= to; i++) {
            const x = xs.get(i);
            const y = ys.get(i);
            const crossings = [];
            for (const limit of [lo, hi]) {
                if ((lastY - limit) * (y - limit) < 0) crossings.push({ f: (limit - lastY) / (y - lastY), limit });
            }
            crossings.sort((a, b) => a.f - b.f); // a steep segment can cross both limits
            for (const { f, limit } of crossings) add(lastX + (x - lastX) * f, limit, i);
            add(x, y, i);
            lastX = x;
            lastY = y;
        }
    }
    const indexRangeOf = (renderPassData) => {
        const input = renderPassData.pointSeries;
        return input.resampled
            ? { from: 0, to: input.xValues.size() - 1 }
            : { from: renderPassData.indexRange.min, to: renderPassData.indexRange.max };
    };

    // For the line: the readings plus the crossing points
    class LimitSplitTransform extends XyBaseRenderDataTransform {
        pen;
        constructor(series, context, pen) {
            super(series, context, [series.drawingProviders[0]]); // the line only
            this.pen = pen;
        }
        runTransformInternal(renderPassData) {
            const { xValues, yValues, indexes } = this.pointSeries;
            xValues.clear();
            yValues.clear();
            indexes.clear();
            const { from, to } = indexRangeOf(renderPassData);
            if (to >= from) {
                splitAtLimits(renderPassData.pointSeries, from, to, this.pen.lo, this.pen.hi, (x, y, i) => {
                    xValues.push_back(x);
                    yValues.push_back(y);
                    indexes.push_back(i);
                });
            }
            return this.pointSeries;
        }
    }

    // For the shading: a band from each reading (y) to the same reading held inside the limits (y1).
    // The two are equal while the value is normal, so the band only has area beyond a limit.
    class LimitFillTransform extends XyyBaseRenderDataTransform {
        pen;
        constructor(series, context, pen) {
            super(series, context, series.drawingProviders);
            this.pen = pen;
        }
        runTransformInternal(renderPassData) {
            const { xValues, yValues, y1Values, indexes } = this.pointSeries;
            xValues.clear();
            yValues.clear();
            y1Values.clear();
            indexes.clear();
            const { lo, hi } = this.pen;
            const { from, to } = indexRangeOf(renderPassData);
            if (to >= from) {
                splitAtLimits(renderPassData.pointSeries, from, to, lo, hi, (x, y, i) => {
                    xValues.push_back(x);
                    yValues.push_back(y);
                    y1Values.push_back(Math.min(Math.max(y, lo), hi));
                    indexes.push_back(i);
                });
            }
            return this.pointSeries;
        }
    }

    // A palette provider colours each line segment. The transform has split the line at the limits, so a
    // segment is beyond a limit exactly when its midpoint is. (A segment's colour is set at its end point.)
    const alarmArgb = parseColorToUIntArgb(ALARM_RED);
    function makeAlarmPalette(pen) {
        let lastY = NaN;
        return {
            strokePaletteMode: EStrokePaletteMode.SOLID,
            onAttached: () => {},
            onDetached: () => {},
            shouldUpdatePalette: () => true, // the limits can move, so re-check on every draw
            overrideStrokeArgb: (x, y) => {
                const middle = (y + lastY) / 2;
                lastY = y;
                return middle > pen.hi || middle < pen.lo ? alarmArgb : undefined; // undefined = the pen's colour
            }
        };
    }

    pens.forEach((pen) => {
        pen.axis = new NumericAxis(wasmContext, {
            id: pen.axisId,
            axisAlignment: EAxisAlignment.Left,
            axisTitle: `${pen.tag} (${pen.unit})`,
            axisTitleStyle: { fontSize: 13 },
            autoRange: EAutoRange.Never, // fixed ranges: a trend that rescales itself hides how big a change is
            visibleRange: new NumberRange(pen.min, pen.max),
            maxAutoTicks: 3,
            drawMinorGridLines: false
        });
        sciChartSurface.yAxes.add(pen.axis);

        // fifoCapacity keeps the newest readings and discards the oldest
        pen.data = new XyDataSeries(wasmContext, {
            dataSeriesName: `${pen.tag} ${pen.name}`,
            fifoCapacity: CAPACITY,
            isSorted: true,
            containsNaN: false
        });
        // The band series needs x, y and y1 values; the transform replaces y1, so y1 is just a placeholder
        pen.fillData = new XyyDataSeries(wasmContext, { fifoCapacity: CAPACITY, isSorted: true, containsNaN: false });

        // The shading, drawn first so it sits behind the line: fill where y > y1 (above HI), fillY1 where y < y1 (below LO)
        pen.fill = new FastBandRenderableSeries(wasmContext, {
            dataSeries: pen.fillData,
            yAxisId: pen.axisId,
            fill: ALARM_FILL,
            fillY1: ALARM_FILL,
            stroke: "#00000000",
            strokeY1: "#00000000",
            strokeThickness: 0
        });
        pen.fill.renderDataTransform = new LimitFillTransform(pen.fill, wasmContext, pen);

        pen.line = new FastLineRenderableSeries(wasmContext, {
            dataSeries: pen.data,
            yAxisId: pen.axisId,
            stroke: pen.color,
            strokeThickness: 2,
            paletteProvider: makeAlarmPalette(pen)
        });
        pen.line.renderDataTransform = new LimitSplitTransform(pen.line, wasmContext, pen);
        sciChartSurface.renderableSeries.add(pen.fill, pen.line);

        // Draggable HI and LO limit lines. Dragging one changes the alarm limit straight away.
        const makeLimit = (which) =>
            new HorizontalLineAnnotation({
                yAxisId: pen.axisId,
                y1: pen[which],
                isEditable: true,
                stroke: which === "hi" ? "#EF5350" : "#F48420",
                strokeThickness: 2,
                strokeDashArray: [6, 4],
                showLabel: true,
                labelPlacement: which === "hi" ? ELabelPlacement.TopLeft : ELabelPlacement.BottomLeft,
                labelValue: `${which.toUpperCase()} ${pen[which]}`,
                onDrag: () => setLimit(pen, which)
            });
        pen.hiLine = makeLimit("hi");
        pen.loLine = makeLimit("lo");
        sciChartSurface.annotations.add(pen.hiLine, pen.loLine);
    });

    // Keep HI above LO and inside the axis range, then show the new value on the line's label
    function setLimit(pen, which) {
        const line = which === "hi" ? pen.hiLine : pen.loLine;
        const span = pen.max - pen.min;
        const gap = span * 0.05;
        let value = line.y1;
        value = which === "hi" ? Math.min(pen.max, Math.max(pen.lo + gap, value)) : Math.max(pen.min, Math.min(pen.hi - gap, value));
        value = Number(value.toFixed(span > 20 ? 0 : 1));
        pen[which] = value;
        line.y1 = value;
        line.labelValue = `${which.toUpperCase()} ${value}`;
        // The transforms depend on the limits as well as the data, so ask them to run again
        pen.line.renderDataTransform.requiresTransform = true;
        pen.fill.renderDataTransform.requiresTransform = true;
    }

    // --- Alarms: raise when a value crosses a limit; clear only when it is back inside by the deadband ---
    const alarmLog = []; // newest first
    function checkAlarms(pen, time, value) {
        const deadband = Number(ui.deadbandSelect.value) * (pen.max - pen.min);
        let state = pen.inAlarm;
        if (value > pen.hi) state = "HI";
        else if (value < pen.lo) state = "LO";
        else if (state === "HI" && value < pen.hi - deadband) state = "";
        else if (state === "LO" && value > pen.lo + deadband) state = "";
        if (state === pen.inAlarm) return;
        const unit = pen.unit === "%" ? "%" : " " + pen.unit;
        const text = state
            ? `${state} alarm: ${value.toFixed(1)}${unit} (limit ${pen[state.toLowerCase()]})`
            : `Back to normal: ${value.toFixed(1)}${unit}`;
        alarmLog.unshift({ time, tag: pen.tag, text, active: !!state });
        alarmLog.length = Math.min(alarmLog.length, 60);
        pen.inAlarm = state;
    }

    // --- The trend's clock and data ---
    const nextReading = createProcess();
    let now = START;
    function addReading() {
        now += 1;
        const values = nextReading();
        pens.forEach((pen, i) => {
            pen.data.append(now, values[i]);
            pen.fillData.append(now, values[i], values[i]);
            checkAlarms(pen, now, values[i]);
        });
    }
    for (let i = 0; i < HISTORY; i++) addReading(); // an hour of history, as a historian would supply

    // Live mode: the time window follows the newest reading. Zooming or panning pauses it.
    let isPaused = false;
    let movingWindow = false;
    function showLatest() {
        const span = Number(ui.spanSelect.value);
        movingWindow = true;
        xAxis.visibleRange = new NumberRange(now - span, now);
        movingWindow = false;
    }
    xAxis.visibleRangeChanged.subscribe(() => {
        if (!movingWindow && !isPaused) setPaused(true); // the user zoomed or panned
    });
    function setPaused(paused) {
        isPaused = paused;
        ui.pauseButton.textContent = paused ? "Resume live" : "Pause";
        if (!paused) showLatest();
    }

    // The simulation runs ten times faster than real time: one reading per tag every 100 ms
    const timer = setInterval(() => {
        addReading();
        if (!isPaused) showLatest();
        renderAlarms();
    }, 100);
    sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });

    // --- Styles: colourful, or grey with colour kept for alarms (high-performance HMI) ---
    function applyStyle(style) {
        const grey = style === "grey";
        sciChartSurface.background = grey ? "#D3D6DA" : theme.sciChartBackground;
        const text = grey ? "#2B3240" : theme.tickTextBrush;
        for (const axis of [xAxis, ...pens.map((pen) => pen.axis)]) {
            axis.labelStyle = { ...axis.labelStyle, color: text };
            axis.axisTitleStyle = { ...axis.axisTitleStyle, color: grey ? text : theme.axisTitleColor };
            axis.majorGridLineStyle = { ...axis.majorGridLineStyle, color: grey ? "#C0C4CA" : theme.majorGridLineBrush };
            axis.minorGridLineStyle = { ...axis.minorGridLineStyle, color: grey ? "#CACDD2" : theme.minorGridLineBrush };
            axis.drawMajorBands = !grey;
        }
        pens.forEach((pen) => {
            pen.line.stroke = grey ? "#3B4350" : pen.color;
            pen.hiLine.stroke = pen.hiLine.axisLabelFill = grey ? "#4A5361" : "#EF5350"; // line and label colour
            pen.loLine.stroke = pen.loLine.axisLabelFill = grey ? "#4A5361" : "#F48420";
        });
        ui.panel.style.background = grey ? "#C7CBD0" : "#1C2C4A";
        ui.panel.style.color = grey ? "#1B2433" : "#ffffff";
        renderAlarms();
    }

    // The alarm list: active alarms first in red, then the history of alarms and returns to normal
    let shown = "";
    function renderAlarms() {
        const grey = ui.styleSelect.value === "grey";
        const active = pens.filter((pen) => pen.inAlarm).length;
        const key = `${alarmLog.length}|${alarmLog[0]?.time}|${active}|${grey}`;
        if (key === shown) return;
        shown = key;
        ui.heading.textContent = `Alarms · ${active} active`;
        const clock = (seconds) => new Date(seconds * 1000).toISOString().slice(11, 19);
        ui.alarmList.innerHTML = alarmLog
            .map((entry) => {
                const color = entry.active ? (grey ? "#B71C1C" : "#FF8A80") : grey ? "#3B4350" : "#C8D3E8";
                return (
                    `<li style="padding:3px 0; border-bottom:1px solid ${grey ? "#B5BAC1" : "#2E4572"}; color:${color}">` +
                    `${clock(entry.time)} <b>${entry.tag}</b><br>${entry.text}</li>`
                );
            })
            .join("");
    }

    ui.styleSelect.addEventListener("change", () => applyStyle(ui.styleSelect.value));
    ui.spanSelect.addEventListener("change", () => setPaused(false));
    ui.pauseButton.addEventListener("click", () => setPaused(!isPaused));

    // Hover for values. Scroll to zoom in time, drag to pan, double-click to see all the history.
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showYLine: false,
            // One line per pen (the shading bands are left out)
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos
                    .filter((info) => info.renderableSeries instanceof FastLineRenderableSeries)
                    .map((info) => `${info.seriesName}: ${info.formattedYValue}`)
        }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    );

    applyStyle("colour");
    showLatest();
    // #region_A_end
}

hmiTrendChart("scichart-root");
