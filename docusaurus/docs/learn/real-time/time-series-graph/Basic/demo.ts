import * as SciChart from "scichart";

// A simulated electricity meter for an office building: one reading of power demand (kW) every 15 minutes.
// Each reading is the sum of separate components, so the demo can switch them on and off: a slow upward trend,
// a daily and weekly cycle (busy weekday afternoons, quiet nights and weekends), noise with the odd outlier,
// a level shift when an energy-saving retrofit goes live, and meter outages (gaps). A seeded random generator
// makes the noise the same every time. These are illustrative numbers, not data from a real building.
const STEP_SECONDS = 15 * 60; // one reading every 15 minutes
const READINGS_PER_DAY = 96;
const WINDOW_DAYS = 21;
const WINDOW_READINGS = WINDOW_DAYS * READINGS_PER_DAY; // the chart holds the newest 2,016 readings
const START_TIME = Date.UTC(2026, 2, 2) / 1000; // Monday 2 March 2026, 00:00 UTC, in Unix seconds
const BASE_LOAD = 55; // kW, what the building draws with everything else switched off
const RETROFIT_INDEX = 13 * READINGS_PER_DAY; // Sunday 15 March 2026, 00:00 UTC

function makeMeter() {
    let seed = 20261120;
    const random = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());

    // Noise is generated in order and kept, so reading i always gets the same noise, however far the series runs
    const noise = [];
    let state = 0;
    const noiseAt = (i) => {
        while (noise.length <= i) {
            state = 0.6 * state + 2.5 * gaussian(); // each reading's noise is a little like the last one's
            noise.push(state);
        }
        return noise[i];
    };

    const timeAt = (i) => START_TIME + i * STEP_SECONDS;
    const components = (i) => {
        const day = Math.floor(i / READINGS_PER_DAY);
        const hour = (i % READINGS_PER_DAY) / 4;
        const weekend = day % 7 >= 5; // day 0 is a Monday
        const occupied = hour > 6 && hour < 20 ? Math.sin((Math.PI * (hour - 6)) / 14) : 0;
        const k = i % 1100;
        return {
            trend: (0.6 * i) / READINGS_PER_DAY, // +0.6 kW a day
            cycle: (weekend ? 6 : 32) * occupied, // peaks at 13:00
            noise: noiseAt(i) + (i % 1300 === 530 ? 40 : 0), // plus a one-reading spike now and then
            shift: i >= RETROFIT_INDEX ? -12 : 0, // the retrofit cuts demand by 12 kW
            missing: (k >= 808 && k < 832) || (k >= 1000 && k < 1004) // a 6-hour and a 1-hour outage every 1,100 readings
        };
    };
    return { timeAt, components };
}

// The controls and the chart each need an element. This splits the page's div into a control bar and a chart;
// in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const bar = document.createElement("div");
    bar.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const box = (id, text) => `<label><input type="checkbox" data-id="${id}" checked> ${text}</label>`;
    bar.innerHTML =
        `<span>Components:</span>` +
        box("trend", "Trend") +
        box("cycle", "Daily and weekly cycle") +
        box("noise", "Noise and outliers") +
        box("shift", "Level shift") +
        box("gaps", "Outages") +
        `<label>At gaps <select data-id="join" style="font:inherit">` +
        `<option value="break">break the line</option><option value="join">join the points</option></select></label>` +
        `<label>Moving average <input data-id="window" type="range" min="0" max="48" step="1" value="24" ` +
        `style="vertical-align:middle; width:110px"> <output data-id="window"></output></label>` +
        `<select data-id="centre" aria-label="Moving average type" style="font:inherit">` +
        `<option value="trailing">trailing</option><option value="centred">centred</option></select>` +
        `<button data-id="live" style="font:inherit; min-width:84px; padding:2px 10px; cursor:pointer">Go live</button>`;
    const chart = document.createElement("div");
    chart.id = `${divElementId}-chart`;
    chart.style.cssText = "flex:1; min-height:0;";
    root.append(bar, chart);
    const get = (selector) => bar.querySelector(selector);
    return {
        chart,
        checkboxes: {
            trend: get('input[data-id="trend"]'),
            cycle: get('input[data-id="cycle"]'),
            noise: get('input[data-id="noise"]'),
            shift: get('input[data-id="shift"]'),
            gaps: get('input[data-id="gaps"]')
        },
        joinSelect: get('select[data-id="join"]'),
        windowInput: get('input[data-id="window"]'),
        windowOutput: get('output[data-id="window"]'),
        centreSelect: get('select[data-id="centre"]'),
        liveButton: get('button[data-id="live"]')
    };
}

async function timeSeriesExplorer(divElementId) {
    const ui = createLayout(divElementId);
    const meter = makeMeter();

    // #region_A_start
    // A time series graph with SciChart.js: a date-time x-axis, gaps drawn as gaps, a moving average,
    // event and outage annotations, and a live mode that appends readings to a fixed-size (FIFO) window
    const {
        SciChartSurface,
        DateTimeNumericAxis,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
        ELineDrawMode,
        ECoordinateMode,
        ELabelPlacement,
        FastLineRenderableSeries,
        XyDataSeries,
        BoxAnnotation,
        VerticalLineAnnotation,
        SciChartJsNavyTheme,
        LegendModifier,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.chart, {
        theme: new SciChartJsNavyTheme()
    });

    // Time values are Unix timestamps in seconds. The labels are in UTC and adapt as you zoom (days, hours, minutes).
    const xAxis = new DateTimeNumericAxis(wasmContext, {
        axisTitle: "Time (UTC)",
        autoRange: EAutoRange.Never // set below; zoom and pan freely, double-click to see the whole window
    });
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "Power demand (kW)",
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0.1, 0.1),
        labelPrecision: 0
    });
    // The tooltip shows the full date and time, also in UTC, written the ISO 8601 way
    xAxis.labelProvider.formatCursorLabel = (value) =>
        new Date(value * 1000).toISOString().slice(0, 16).replace("T", " ") + " UTC";
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // fifoCapacity: once the series holds 2,016 readings (21 days), each new reading pushes out the oldest.
    // containsNaN: a missing reading is stored as NaN, so the line can break there.
    const readings = new XyDataSeries(wasmContext, {
        dataSeriesName: "Demand (15-minute readings)",
        fifoCapacity: WINDOW_READINGS,
        isSorted: true,
        containsNaN: true
    });
    const average = new XyDataSeries(wasmContext, {
        dataSeriesName: "Moving average",
        isSorted: true,
        containsNaN: true
    });
    const readingsLine = new FastLineRenderableSeries(wasmContext, {
        dataSeries: readings,
        stroke: "#50C7E0",
        strokeThickness: 1.5,
        drawNaNAs: ELineDrawMode.DiscontinuousLine // lift the pen at missing readings; PolyLine would join across them
    });
    const averageLine = new FastLineRenderableSeries(wasmContext, {
        dataSeries: average,
        stroke: "#F48420",
        strokeThickness: 3,
        drawNaNAs: ELineDrawMode.DiscontinuousLine
    });
    sciChartSurface.renderableSeries.add(readingsLine, averageLine);

    // An event marker for the level shift
    const retrofitLine = new VerticalLineAnnotation({
        x1: meter.timeAt(RETROFIT_INDEX),
        stroke: "#F6E05E",
        strokeThickness: 2,
        strokeDashArray: [6, 4],
        showLabel: true,
        labelPlacement: ELabelPlacement.TopRight,
        labelValue: "Retrofit",
        axisLabelFill: "#F6E05E",
        axisFontSize: 13
    });
    sciChartSurface.annotations.add(retrofitLine);

    sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: false }),
        new CursorModifier({ showTooltip: true, showYLine: false }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    );

    // --- The series: which readings are on the chart, and their values with the chosen components ---
    let first = 0; // index of the oldest reading on the chart
    let end = WINDOW_READINGS; // one past the newest reading
    const on = (name) => ui.checkboxes[name].checked;
    const valueAt = (i) => {
        const c = meter.components(i);
        if (on("gaps") && c.missing) return NaN;
        return (
            BASE_LOAD +
            (on("trend") ? c.trend : 0) +
            (on("cycle") ? c.cycle : 0) +
            (on("noise") ? c.noise : 0) +
            (on("shift") ? c.shift : 0)
        );
    };
    const showWholeWindow = () => (xAxis.visibleRange = new NumberRange(meter.timeAt(first), meter.timeAt(end - 1)));

    // Moving average over the last `hours` (trailing) or centred on each reading. Missing readings are skipped,
    // and a point is drawn only if at least half its window has data. A centred average needs readings after
    // each point, so it stops half a window before the newest reading.
    function updateAverage() {
        const width = Number(ui.windowInput.value) * 4; // readings in the window
        ui.windowOutput.textContent = width ? `${width / 4} h` : "off";
        average.clear();
        averageLine.isVisible = width > 0;
        if (!width) return;
        const centred = ui.centreSelect.value === "centred";
        const from = Math.max(0, first - width);
        const sum = [0];
        const count = [0];
        for (let i = from; i < end; i++) {
            const v = valueAt(i);
            sum.push(sum[sum.length - 1] + (isNaN(v) ? 0 : v));
            count.push(count[count.length - 1] + (isNaN(v) ? 0 : 1));
        }
        const xs = [];
        const ys = [];
        for (let i = first; i < end; i++) {
            const lo = centred ? i - Math.floor(width / 2) : i - width + 1; // window [lo, lo + width - 1]
            const hi = lo + width - 1;
            let y = NaN;
            if (lo >= from && hi < end) {
                const n = count[hi - from + 1] - count[lo - from];
                if (n >= width / 2) y = (sum[hi - from + 1] - sum[lo - from]) / n;
            }
            xs.push(meter.timeAt(i));
            ys.push(y);
        }
        average.appendRange(xs, ys);
    }

    // Shade each outage, so the gap is explained (and, when the points are joined, shows where the line is invented)
    let outageBoxes = [];
    function updateOutages() {
        outageBoxes.forEach((box) => sciChartSurface.annotations.remove(box, true));
        outageBoxes = [];
        retrofitLine.isHidden = !on("shift");
        if (!on("gaps")) return;
        for (let i = first; i < end; i++) {
            if (!meter.components(i).missing || (i > first && meter.components(i - 1).missing)) continue;
            let j = i;
            while (j < end && meter.components(j).missing) j++;
            outageBoxes.push(
                new BoxAnnotation({
                    x1: meter.timeAt(i) - STEP_SECONDS / 2,
                    x2: meter.timeAt(j - 1) + STEP_SECONDS / 2,
                    yCoordinateMode: ECoordinateMode.Relative,
                    y1: 0,
                    y2: 1,
                    fill: "#FF4D4D33",
                    strokeThickness: 0
                })
            );
        }
        sciChartSurface.annotations.add(...outageBoxes);
    }

    // Rebuild everything on the chart, e.g. after a component is switched on or off
    function redraw() {
        const xs = [];
        const ys = [];
        for (let i = first; i < end; i++) {
            xs.push(meter.timeAt(i));
            ys.push(valueAt(i));
        }
        readings.clear();
        readings.appendRange(xs, ys);
        updateAverage();
        updateOutages();
    }

    // --- Live mode: append two readings (30 simulated minutes) every 100 ms ---
    let timer = undefined;
    function appendReadings() {
        const xs = [];
        const ys = [];
        for (let k = 0; k < 2; k++, end++) {
            xs.push(meter.timeAt(end));
            ys.push(valueAt(end));
        }
        readings.appendRange(xs, ys); // the FIFO drops the oldest readings for you
        first = Math.max(0, end - WINDOW_READINGS);
        updateAverage();
        updateOutages();
        showWholeWindow();
    }
    function setLive(live) {
        clearInterval(timer);
        timer = live ? setInterval(appendReadings, 100) : undefined;
        ui.liveButton.textContent = live ? "Stop" : "Go live";
    }
    sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });

    // --- Controls ---
    Object.values(ui.checkboxes).forEach((box) => box.addEventListener("change", redraw));
    ui.joinSelect.addEventListener("change", () => {
        readingsLine.drawNaNAs =
            ui.joinSelect.value === "join" ? ELineDrawMode.PolyLine : ELineDrawMode.DiscontinuousLine;
    });
    ui.windowInput.addEventListener("input", updateAverage);
    ui.centreSelect.addEventListener("change", updateAverage);
    ui.liveButton.addEventListener("click", () => setLive(timer === undefined));

    redraw();
    showWholeWindow();
    // #region_A_end
}

timeSeriesExplorer("scichart-root");
