import * as SciChart from "scichart";

// A seeded random generator, so the dashboard looks the same every time it loads
function createRandom(seed) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

// A simulated production line, standing in for a message stream (WebSocket, MQTT, server-sent events).
// Fast channels (three motor currents and a vibration sensor) are sampled at any rate you choose;
// slow values (line speed, output per station, utilities, oven zone temperatures) arrive four times a second.
// Illustrative values only.
function createPlantSource() {
    const random = createRandom(20261120);
    const noise = (size) => (random() + random() + random() - 1.5) * size;
    const TAU = 2 * Math.PI;

    // Motor 1 jams briefly every 17 s; the vibration sensor sees an impact every 13 s
    const jam = (t) => (t % 17 > 14 ? 7 * Math.sin((Math.PI * (t % 17 - 14)) / 3) : 0);
    const impact = (t) => {
        const since = t % 13;
        return 7 * Math.exp(-since / 0.12) * Math.sin(TAU * 38 * since);
    };
    const fast = (t) => [
        12 + 3 * Math.sin((TAU * t) / 8) + jam(t) + noise(0.5),
        9 + 2 * Math.sin((TAU * t) / 11 + 1) + noise(0.4),
        16 + 1.5 * Math.sin((TAU * t) / 5) + noise(0.6),
        1.8 * Math.sin(TAU * 6.3 * t) + 0.7 * Math.sin(TAU * 17.5 * t) + impact(t) + noise(0.3)
    ];

    // Slow values: random walks pulled back towards a normal level
    const walk = (value, normal, pull, step) => value + (normal - value) * pull + noise(step);
    let lineSpeed = 86;
    let stations = [20, 21, 19, 22, 20, 21];
    let utilities = [44, 1.4, 6.2, 24];
    let zones = [182, 195, 205, 210, 210, 205, 195, 182];
    const slow = (t) => {
        const dip = t % 41 > 36; // a short stoppage every 41 s
        lineSpeed = walk(lineSpeed, dip ? 45 : 86, 0.15, 2);
        stations = stations.map((value, i) => walk(value, dip ? 12 : 20 + (i % 3) - 1, 0.1, 0.6));
        utilities = utilities.map((value, i) => walk(value, [44, 1.4, 6.2, 24][i], 0.05, [1.2, 0.08, 0.04, 0.5][i]));
        // Zone 5 slowly overheats and recovers, which shows up on the heatmap
        const hotSpot = 14 * Math.max(0, Math.sin((TAU * t) / 60));
        zones = zones.map((value, i) => walk(value, [182, 195, 205, 210, 210, 205, 195, 182][i] + (i === 4 ? hotSpot : 0), 0.1, 0.8));
        return { lineSpeed, stations: stations.slice(), utilities: utilities.slice(), zones: zones.slice() };
    };
    return { fast, slow, SLOW_STEP: 0.25 };
}

// The controls, the readout and the panel grid. In your app these are just elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#1B2438;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const header = document.createElement("div");
    header.style.cssText = "padding:6px 12px; color:#ffffff;" + font;
    const select = (id, label, options, selected) =>
        `<label>${label} <select data-id="${id}" style="font:inherit">` +
        options.map(([value, text]) => `<option value="${value}"${value === selected ? " selected" : ""}>${text}</option>`).join("") +
        `</select></label>`;
    header.innerHTML =
        `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px">` +
        select("update", "Update rate", [["1", "1 Hz"], ["10", "10 Hz"], ["60", "60 Hz"]], "60") +
        select("data", "Data rate", [["100", "100 points/s"], ["1000", "1,000 points/s"], ["10000", "10,000 points/s"]], "1000") +
        select("panels", "Panels", [["2", "2"], ["4", "4"], ["6", "6"]], "6") +
        `<button data-id="pause" style="font:inherit; min-width:76px; padding:2px 10px; cursor:pointer">Pause</button></div>` +
        `<div data-id="readout" aria-live="off" style="margin-top:4px; color:#c8d3e8; font-variant-numeric:tabular-nums"></div>`;
    const grid = document.createElement("div");
    grid.style.cssText = "flex:1; min-height:0; display:grid; gap:6px; padding:0 6px 6px;";
    const cell = (area) => {
        const div = document.createElement("div");
        div.id = `${divElementId}-${area}`; // each chart needs its own element id
        div.style.cssText = `grid-area:${area}; min-width:0; min-height:0; position:relative;`;
        grid.append(div);
        return div;
    };
    const cells = { strip1: cell("s1"), strip2: cell("s2"), gauge: cell("g"), bars: cell("b"), sparklines: cell("sp"), heatmap: cell("hm") };
    cells.sparklines.style.cssText += "display:grid; grid-template-columns:repeat(2, 1fr); gap:6px;";
    const sparklineCells = [0, 1, 2, 3].map((i) => {
        const div = document.createElement("div");
        div.id = `${divElementId}-spark${i}`;
        div.style.cssText = "min-width:0; min-height:0;";
        cells.sparklines.append(div);
        return div;
    });
    root.append(header, grid);

    // 2 panels: the strip charts. 4: add the gauge and bars. 6: add the sparklines and heatmap.
    const layouts = {
        2: { areas: '"s1" "s2"', columns: "1fr", shown: ["strip1", "strip2"] },
        4: { areas: '"s1 g" "s2 b"', columns: "2fr 1fr", shown: ["strip1", "strip2", "gauge", "bars"] },
        6: { areas: '"s1 g" "s2 b" "sp hm"', columns: "2fr 1fr", shown: Object.keys(cells) }
    };
    const showPanels = (count) => {
        const layout = layouts[count];
        grid.style.gridTemplateAreas = layout.areas;
        grid.style.gridTemplateColumns = layout.columns;
        grid.style.gridTemplateRows = `repeat(${layout.areas.split('"').filter((s) => s.trim()).length}, 1fr)`;
        for (const [name, div] of Object.entries(cells)) div.style.display = !layout.shown.includes(name) ? "none" : name === "sparklines" ? "grid" : "block";
    };
    const get = (selector) => header.querySelector(selector);
    showPanels(Number(get('select[data-id="panels"]').value));
    return {
        cells,
        sparklineCells,
        showPanels,
        updateSelect: get('select[data-id="update"]'),
        dataSelect: get('select[data-id="data"]'),
        panelsSelect: get('select[data-id="panels"]'),
        pauseButton: get('button[data-id="pause"]'),
        readout: get('div[data-id="readout"]')
    };
}

async function realTimeDashboard(divElementId) {
    const ui = createLayout(divElementId);
    const plant = createPlantSource();

    // #region_A_start
    // A real-time dashboard with SciChart.js: two strip charts with synchronised time axes, a gauge,
    // a live bar chart, a row of sparklines and a scrolling heatmap, all fed from one data stream
    const {
        SciChartSurface,
        SciChartPolarSurface,
        SciChartVerticalGroup,
        NumericAxis,
        PolarNumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EPolarAxisMode,
        EXyDirection,
        ETextAlignment,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        ECoordinateMode,
        EColumnDataLabelPosition,
        FastLineRenderableSeries,
        FastColumnRenderableSeries,
        UniformHeatmapRenderableSeries,
        XyDataSeries,
        UniformHeatmapDataSeries,
        HeatmapColorMap,
        PolarArcAnnotation,
        NativeTextAnnotation,
        HorizontalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        LegendModifier,
        ELegendOrientation,
        ELegendPlacement
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const WINDOW = 30; // seconds of history on the strip charts, sparklines and heatmap
    const SLOW_POINTS = WINDOW / plant.SLOW_STEP; // slow values kept: 120
    const startClock = Date.now() / 1000 - WINDOW; // time 0 on the x-axis, as a clock time
    const clock = (t) => new Date((startClock + t) * 1000).toLocaleTimeString("en-GB");
    // Each chart gets a small title; freezeWhenOutOfView stops drawing charts scrolled off screen
    const surfaceOptions = (title) => ({
        theme: new SciChartJsNavyTheme(),
        title,
        titleStyle: { fontSize: 14, color: "#E8EDF5", alignment: ETextAlignment.Left, placeWithinChart: false },
        freezeWhenOutOfView: true
    });

    // ---- Strip charts: fast channels, one shared time window ----
    const stripSpecs = [
        { div: ui.cells.strip1, title: "Motor current (A)", range: new NumberRange(0, 40), tickStep: 10, legend: true,
          channels: [{ name: "Motor 1", colour: "#50C7E0" }, { name: "Motor 2", colour: "#F6E05E" }, { name: "Motor 3", colour: "#C3B4F0" }] },
        { div: ui.cells.strip2, title: "Vibration (mm/s)", range: new NumberRange(-12, 12), tickStep: 6,
          channels: [{ name: "Pump vibration", colour: "#3BD16F" }] }
    ];
    const group = new SciChartVerticalGroup(); // lines up the y-axes, so the two time axes match exactly
    const strips = [];
    for (const spec of stripSpecs) {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(spec.div, surfaceOptions(spec.title));
        const xAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Never, maxAutoTicks: 6, drawMinorGridLines: false });
        xAxis.labelProvider.formatLabel = (t) => clock(t); // show clock time
        xAxis.labelProvider.formatCursorLabel = (t) => clock(t);
        sciChartSurface.xAxes.add(xAxis);
        // A fixed y-range: an axis that rescales on every update makes the lines jump about
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { autoRange: EAutoRange.Never, visibleRange: spec.range, autoTicks: false, majorDelta: spec.tickStep, minorDelta: spec.tickStep / 2, labelPrecision: 0, drawMinorGridLines: false })
        );
        const lines = spec.channels.map((channel) => {
            const line = new FastLineRenderableSeries(wasmContext, { stroke: channel.colour, strokeThickness: 1.5 });
            sciChartSurface.renderableSeries.add(line);
            return line;
        });
        // Hover on either chart: the cursor and tooltip follow on both (modifierGroup)
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ modifierGroup: "strips", showTooltip: true, showYLine: false }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        group.addSurfaceToGroup(sciChartSurface);
        strips.push({ sciChartSurface, wasmContext, xAxis, lines, channels: spec.channels, legend: spec.legend, dataSeries: [] });
    }
    const wasmContext = strips[0].wasmContext;
    // Zooming or panning one strip chart moves the other
    for (const strip of strips) {
        strip.xAxis.visibleRangeChanged.subscribe(({ visibleRange }) => {
            for (const other of strips) {
                if (other !== strip && !other.xAxis.visibleRange.equals(visibleRange)) other.xAxis.visibleRange = visibleRange;
            }
        });
    }

    // fifoCapacity makes each series a circular buffer: it keeps the newest points and drops the oldest,
    // so memory stays flat however long the dashboard runs. Changing the data rate changes the capacity.
    let dataRate = Number(ui.dataSelect.value); // points per second, per channel
    let now = WINDOW; // seconds since time 0, of the newest data received
    function createFastSeries() {
        const capacity = dataRate * WINDOW;
        const count = capacity;
        const xValues = new Float64Array(count);
        const yValues = [0, 1, 2, 3].map(() => new Float64Array(count));
        for (let i = 0; i < count; i++) {
            const t = now - WINDOW + (i + 1) / dataRate;
            xValues[i] = t;
            plant.fast(t).forEach((v, c) => (yValues[c][i] = v));
        }
        let channel = 0;
        for (const strip of strips) {
            const old = strip.dataSeries;
            strip.dataSeries = strip.lines.map((line, i) => {
                const series = new XyDataSeries(wasmContext, {
                    dataSeriesName: strip.channels[i].name,
                    fifoCapacity: capacity,
                    isSorted: true,
                    containsNaN: false
                });
                series.appendRange(xValues, yValues[channel++]);
                line.dataSeries = series;
                return series;
            });
            old.forEach((series) => series.delete());
        }
    }
    createFastSeries();
    // A legend names the lines, so colour isn't the only clue
    for (const strip of strips.filter((s) => s.legend)) {
        strip.sciChartSurface.chartModifiers.add(
            new LegendModifier({ showCheckboxes: false, orientation: ELegendOrientation.Horizontal, placement: ELegendPlacement.TopRight })
        );
    }

    // ---- The other panels: created and deleted as the Panels setting changes ----
    const panelBuilders = {
        // A gauge for the one number people check first
        async gauge() {
            const MIN = 0, MAX = 120, SWEEP = (240 * Math.PI) / 180;
            const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(ui.cells.gauge, surfaceOptions("Line speed (units/min)"));
            sciChartSurface.xAxes.add(
                new PolarNumericAxis(wasmContext, {
                    polarAxisMode: EPolarAxisMode.Angular,
                    visibleRange: new NumberRange(MIN, MAX),
                    totalAngle: SWEEP,
                    startAngle: (Math.PI - SWEEP) / 2,
                    flippedCoordinates: true,
                    autoTicks: false,
                    majorDelta: 20,
                    drawMajorGridLines: false,
                    drawMinorGridLines: false,
                    drawMajorBands: false,
                    labelStyle: { fontSize: 12, color: "#C8D2E0" },
                    labelPrecision: 0
                })
            );
            sciChartSurface.yAxes.add(new PolarNumericAxis(wasmContext, { polarAxisMode: EPolarAxisMode.Radial, visibleRange: new NumberRange(0, 10), isVisible: false }));
            const arc = (x1, x2, fill, inner = 7, outer = 9.5) =>
                new PolarArcAnnotation({ x1, x2, y1: outer, y2: inner, fill, stroke: "#00000000", strokeThickness: 0 });
            // Thin bands mark low and high speed; the thick arc fills up to the current value
            sciChartSurface.annotations.add(
                arc(MIN, MAX, "#FFFFFF14"),
                arc(MIN, 60, "#E8505B", 9.7, 10),
                arc(60, 110, "#3CBF7E", 9.7, 10),
                arc(110, MAX, "#F5B83D", 9.7, 10)
            );
            const valueArc = arc(MIN, MIN, "#50C7E0");
            const straightDown = MAX + (MAX - MIN) * 0.25; // past the end of the scale, so the text sits in the gap
            const readout = new NativeTextAnnotation({
                x1: straightDown, y1: 1.5, fontSize: 30, textColor: "#FFFFFF",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center, verticalAnchorPoint: EVerticalAnchorPoint.Center
            });
            sciChartSurface.annotations.add(valueArc, readout);
            return {
                surfaces: [sciChartSurface],
                points: () => 1,
                update: (records) => {
                    const speed = records[records.length - 1].lineSpeed;
                    valueArc.x2 = Math.min(MAX, Math.max(MIN, speed));
                    valueArc.fill = speed < 60 ? "#E8505B" : speed > 110 ? "#F5B83D" : "#50C7E0";
                    readout.text = speed.toFixed(0);
                }
            };
        },
        // Bars for current values that are compared with each other
        async bars() {
            const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.cells.bars, surfaceOptions("Output by station (units/min)"));
            const xAxis = new NumericAxis(wasmContext, { autoTicks: false, majorDelta: 1, drawMajorGridLines: false, drawMinorGridLines: false, visibleRange: new NumberRange(0.4, 6.6) });
            xAxis.labelProvider.formatLabel = (x) => `S${x}`;
            sciChartSurface.xAxes.add(xAxis);
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Never, visibleRange: new NumberRange(0, 30), autoTicks: false, majorDelta: 10, minorDelta: 5, labelPrecision: 0, drawMinorGridLines: false }));
            const dataSeries = new XyDataSeries(wasmContext, { xValues: [1, 2, 3, 4, 5, 6], yValues: [20, 21, 19, 22, 20, 21], dataSeriesName: "Output", isSorted: true, containsNaN: false });
            sciChartSurface.renderableSeries.add(
                new FastColumnRenderableSeries(wasmContext, {
                    dataSeries,
                    fill: "#50C7E0CC",
                    stroke: "#50C7E0",
                    strokeThickness: 2,
                    dataPointWidth: 0.7,
                    cornerRadius: 8,
                    dataLabels: { color: "#FFFFFF", style: { fontSize: 15, fontFamily: "Arial" }, precision: 0, positionMode: EColumnDataLabelPosition.Inside }
                })
            );
            // The target, so each bar is read against it
            sciChartSurface.annotations.add(
                new HorizontalLineAnnotation({ y1: 18, stroke: "#F6E05E", strokeThickness: 2, strokeDashArray: [6, 4], showLabel: true, labelValue: "Target 18", axisLabelFill: "#F6E05E" })
            );
            return {
                surfaces: [sciChartSurface],
                points: () => 6,
                update: (records) => records[records.length - 1].stations.forEach((value, i) => dataSeries.update(i, value))
            };
        },
        // Sparklines: trend and latest value, no axes
        async sparklines() {
            const specs = [
                { title: "Power (kW)", range: new NumberRange(36, 52), digits: 1 },
                { title: "Reject rate (%)", range: new NumberRange(0.5, 2.5), digits: 2 },
                { title: "Air pressure (bar)", range: new NumberRange(5.9, 6.5), digits: 2 },
                { title: "Coolant flow (L/min)", range: new NumberRange(20, 28), digits: 1 }
            ];
            const sparks = [];
            for (const [i, spec] of specs.entries()) {
                const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.sparklineCells[i], surfaceOptions(spec.title));
                sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false, autoRange: EAutoRange.Always }));
                sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false, autoRange: EAutoRange.Never, visibleRange: spec.range }));
                const dataSeries = new XyDataSeries(wasmContext, { fifoCapacity: SLOW_POINTS, isSorted: true, containsNaN: false });
                sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0", strokeThickness: 2 }));
                const latest = new NativeTextAnnotation({
                    xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative,
                    x1: 1, y1: 0, fontSize: 18, textColor: "#FFFFFF",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Right, verticalAnchorPoint: EVerticalAnchorPoint.Top
                });
                sciChartSurface.annotations.add(latest);
                sparks.push({ sciChartSurface, dataSeries, latest, spec });
            }
            return {
                surfaces: sparks.map((s) => s.sciChartSurface),
                points: () => sparks.reduce((sum, s) => sum + s.dataSeries.count(), 0),
                update: (records) => {
                    sparks.forEach((spark, i) => {
                        spark.dataSeries.appendRange(records.map((r) => r.t), records.map((r) => r.utilities[i]));
                        spark.latest.text = records[records.length - 1].utilities[i].toFixed(spark.spec.digits);
                    });
                }
            };
        },
        // A heatmap: many sensors over time, in one picture
        async heatmap() {
            const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.cells.heatmap, surfaceOptions("Oven zones (°C), last 30 s"));
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-WINDOW, 0), maxAutoTicks: 4, drawMajorGridLines: false, drawMinorGridLines: false, axisTitle: "Seconds ago", axisTitleStyle: { fontSize: 12 } }));
            const yAxis = new NumericAxis(wasmContext, { visibleRange: new NumberRange(0.5, 8.5), autoTicks: false, majorDelta: 1, drawMajorGridLines: false, drawMinorGridLines: false });
            yAxis.labelProvider.formatLabel = (y) => `Z${y}`;
            sciChartSurface.yAxes.add(yAxis);
            const zValues = Array.from({ length: 8 }, () => new Array(SLOW_POINTS).fill(NaN)); // [zone][time]
            const dataSeries = new UniformHeatmapDataSeries(wasmContext, { xStart: -WINDOW, xStep: plant.SLOW_STEP, yStart: 1, yStep: 1, zValues });
            sciChartSurface.renderableSeries.add(
                new UniformHeatmapRenderableSeries(wasmContext, {
                    dataSeries,
                    colorMap: new HeatmapColorMap({
                        minimum: 175,
                        maximum: 230,
                        gradientStops: [
                            { offset: 0, color: "#14233C" },
                            { offset: 0.35, color: "#1F6F94" },
                            { offset: 0.65, color: "#50C7E0" },
                            { offset: 0.85, color: "#F6E05E" },
                            { offset: 1, color: "#EF5350" }
                        ]
                    })
                })
            );
            return {
                surfaces: [sciChartSurface],
                points: () => 8 * SLOW_POINTS,
                update: (records) => {
                    // Scroll every row left by the new columns, and add the new readings at the right
                    for (const record of records) {
                        zValues.forEach((row, zone) => {
                            row.shift();
                            row.push(record.zones[zone]);
                        });
                    }
                    dataSeries.setZValues(zValues);
                }
            };
        }
    };
    const panels = new Map(); // the panels currently on screen, by name
    let slowHistory = []; // the last 30 s of slow values, to fill a panel when it is added
    async function setPanels(count) {
        ui.showPanels(count);
        const wanted = { 2: [], 4: ["gauge", "bars"], 6: ["gauge", "bars", "sparklines", "heatmap"] }[count];
        for (const [name, panel] of panels) {
            if (!wanted.includes(name)) {
                panel.surfaces.forEach((surface) => surface.delete());
                panels.delete(name);
            }
        }
        for (const name of wanted) {
            if (panels.has(name)) continue;
            const panel = await panelBuilders[name]();
            if (slowHistory.length) panel.update(slowHistory);
            panels.set(name, panel);
        }
    }

    // ---- The data path: arrivals go into a buffer; the dashboard drains it at the update rate ----
    // Fast readings arrive in small batches, as they would from a WebSocket. Typed arrays keep them compact.
    let buffer = []; // batches of { x, y: [4 channels] } not yet drawn
    let buffered = 0;
    let slowBuffer = [];
    let nextSlow = WINDOW; // time of the next slow reading
    let lastArrival = performance.now();
    for (let t = 0; t < WINDOW; t += plant.SLOW_STEP) slowHistory.push({ t, ...plant.slow(t) }); // 30 s of history
    function receive() {
        const wall = performance.now();
        const elapsed = Math.min(wall - lastArrival, 250) / 1000; // capped if the tab was hidden
        lastArrival = wall;
        const count = Math.round(elapsed * dataRate);
        if (count > 0) {
            const x = new Float64Array(count);
            const y = [0, 1, 2, 3].map(() => new Float64Array(count));
            for (let i = 0; i < count; i++) {
                const t = now + (i + 1) / dataRate;
                x[i] = t;
                plant.fast(t).forEach((v, c) => (y[c][i] = v));
            }
            buffer.push({ x, y });
            buffered += count;
            // While paused, keep only the newest window of data: older points would scroll off anyway
            while (buffered - buffer[0].x.length >= dataRate * WINDOW) buffered -= buffer.shift().x.length;
        }
        now += count / dataRate;
        for (; nextSlow <= now; nextSlow += plant.SLOW_STEP) {
            slowBuffer.push({ t: nextSlow, ...plant.slow(nextSlow) });
            if (slowBuffer.length > SLOW_POINTS) slowBuffer.shift();
        }
    }

    // One update: append everything received since the last one, in one appendRange per series, then scroll
    let isPaused = false;
    let lastUpdateTime = Date.now();
    let drawnUpTo = WINDOW;
    function update() {
        if (isPaused) return;
        if (buffered > 0) {
            const x = new Float64Array(buffered);
            const y = [0, 1, 2, 3].map(() => new Float64Array(buffered));
            let offset = 0;
            for (const batch of buffer) {
                x.set(batch.x, offset);
                batch.y.forEach((values, c) => y[c].set(values, offset));
                offset += batch.x.length;
            }
            let channel = 0;
            strips.forEach((strip) => strip.dataSeries.forEach((series) => series.appendRange(x, y[channel++])));
            drawnUpTo = x[x.length - 1];
            buffer = [];
            buffered = 0;
        }
        if (slowBuffer.length) {
            panels.forEach((panel) => panel.update(slowBuffer));
            slowHistory = slowHistory.concat(slowBuffer).slice(-SLOW_POINTS);
            slowBuffer = [];
        }
        const range = new NumberRange(drawnUpTo - WINDOW, drawnUpTo);
        strips.forEach((strip) => (strip.xAxis.visibleRange = range));
        lastUpdateTime = Date.now();
    }

    const arrivalTimer = setInterval(receive, 16);
    let updateTimer = setInterval(update, 1000 / Number(ui.updateSelect.value));

    // ---- Controls ----
    const setPaused = (paused) => {
        isPaused = paused;
        ui.pauseButton.textContent = paused ? "Resume" : "Pause";
        if (!paused) update(); // catch up with the live data
    };
    ui.pauseButton.addEventListener("click", () => setPaused(!isPaused));
    // Zooming or panning a strip chart pauses the dashboard, so the next update doesn't undo it
    for (const strip of strips) {
        strip.sciChartSurface.domChartRoot.addEventListener("wheel", () => !isPaused && setPaused(true));
        strip.sciChartSurface.domChartRoot.addEventListener("pointerdown", () => !isPaused && setPaused(true));
    }
    ui.updateSelect.addEventListener("change", () => {
        clearInterval(updateTimer);
        updateTimer = setInterval(update, 1000 / Number(ui.updateSelect.value));
    });
    ui.dataSelect.addEventListener("change", () => {
        dataRate = Number(ui.dataSelect.value);
        buffer = [];
        buffered = 0;
        createFastSeries(); // new buffers sized for the new rate, filled with the last 30 s
        drawnUpTo = now;
        update();
    });
    ui.panelsSelect.addEventListener("change", () => setPanels(Number(ui.panelsSelect.value)));

    // ---- Readout: frame time, points drawn and when the data was last updated ----
    let frames = 0;
    let frameStart = performance.now();
    let frameTime = 0;
    let animationFrame = requestAnimationFrame(function countFrame() {
        frames++;
        animationFrame = requestAnimationFrame(countFrame);
    });
    const readoutTimer = setInterval(() => {
        const wall = performance.now();
        frameTime = (wall - frameStart) / Math.max(frames, 1);
        frames = 0;
        frameStart = wall;
        const fastPoints = strips.reduce((sum, strip) => sum + strip.dataSeries.reduce((s, series) => s + series.count(), 0), 0);
        const points = fastPoints + [...panels.values()].reduce((sum, panel) => sum + panel.points(), 0);
        const charts = strips.length + [...panels.values()].reduce((sum, panel) => sum + panel.surfaces.length, 0);
        const behind = Math.round((Date.now() - lastUpdateTime) / 1000);
        ui.readout.textContent =
            `Frame time ${frameTime.toFixed(1)} ms · ${points.toLocaleString("en")} points drawn on ${charts} charts · ` +
            `${(dataRate * 4).toLocaleString("en")} points/s in · ` +
            (isPaused ? `Paused, ${behind} s behind live` : `Updated ${new Date(lastUpdateTime).toLocaleTimeString("en-GB")}`);
    }, 500);

    strips[0].sciChartSurface.addDeletable({
        delete: () => {
            clearInterval(arrivalTimer);
            clearInterval(updateTimer);
            clearInterval(readoutTimer);
            cancelAnimationFrame(animationFrame);
        }
    });

    await setPanels(Number(ui.panelsSelect.value));
    update();
    // #region_A_end
}

realTimeDashboard("scichart-root");
