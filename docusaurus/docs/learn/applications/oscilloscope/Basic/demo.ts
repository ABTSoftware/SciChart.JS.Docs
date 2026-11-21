import * as SciChart from "scichart";

// A software oscilloscope: a built-in signal generator feeds a simulated acquisition (100 samples per division),
// and the scope triggers, measures and draws it on a 10 × 8 division screen. A seeded random generator adds the
// noise, so the demo looks the same every time it loads.
const DIVS_X = 10; // horizontal divisions
const DIVS_Y = 8; // vertical divisions
const POINTS_PER_DIV = 100; // record length: 1,000 points on screen, so the sample rate is 100 / (time per division)
const TIME_PER_DIV = [10e-6, 20e-6, 50e-6, 100e-6, 200e-6, 500e-6, 1e-3, 2e-3, 5e-3, 10e-3, 20e-3, 50e-3]; // s
const VOLTS_PER_DIV = [0.1, 0.2, 0.5, 1, 2, 5]; // V
const PULSE_DUTY = 0.25; // the noisy pulse is high for a quarter of each period
const PULSE_EDGE = 0.03; // and its edges take 3% of a period

let seed = 20261120;
function random() {
    seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
}
// Roughly Gaussian noise with a standard deviation of 1
const gaussian = () => (random() + random() + random() - 1.5) * 2;

// The signal generator's waveforms, as a function of the phase p (0 to 1 within a period), between -1 and +1
function unitWave(shape, p, width) {
    if (shape === "sine") return Math.sin(2 * Math.PI * p);
    if (shape === "square") return p < 0.5 ? 1 : -1;
    if (shape === "triangle") return p < 0.5 ? -1 + 4 * p : 3 - 4 * p;
    // pulse: a rising edge, a flat top until `width`, a falling edge, then low
    if (p < PULSE_EDGE) return -1 + (2 * p) / PULSE_EDGE;
    if (p < width) return 1;
    if (p < width + PULSE_EDGE) return 1 - (2 * (p - width)) / PULSE_EDGE;
    return -1;
}

// The waveform's average value, which AC coupling removes
function waveMean(shape, settings) {
    if (shape !== "pulse") return settings.offset;
    let sum = 0;
    for (let i = 0; i < 1000; i++) sum += unitWave(shape, (i + 0.5) / 1000, PULSE_DUTY);
    return settings.offset + (settings.vpp / 2) * (sum / 1000);
}

// Acquires one record of `count` samples, `dt` seconds apart, starting at time t0
function acquire(settings, t0, dt, count) {
    const { shape, frequency, vpp, offset, coupling } = settings;
    const noisy = shape === "pulse";
    const width = PULSE_DUTY + (noisy ? (random() - 0.5) * 0.02 : 0); // the pulse width jitters a little
    const dc = coupling === "AC" ? waveMean(shape, settings) : 0;
    const ys = new Array(count);
    for (let i = 0; i < count; i++) {
        const t = t0 + i * dt;
        const p = t * frequency - Math.floor(t * frequency);
        const noise = noisy ? 0.04 * (vpp / 2) * gaussian() : 0.004 * (vpp / 2) * gaussian();
        ys[i] = offset + (vpp / 2) * unitWave(shape, p, width) + noise - dc;
    }
    return ys;
}

// Edge trigger: the first sample in [from, to) where the signal crosses `level` in the chosen direction,
// after first moving `hysteresis` volts away from it on the other side. Returns a fractional index, or -1.
function findTrigger(ys, level, edge, hysteresis, from, to) {
    const sign = edge === "rising" ? 1 : -1;
    let armed = false;
    for (let i = 1; i < to; i++) {
        const v = sign * (ys[i] - level);
        if (v < -hysteresis) armed = true;
        const before = sign * (ys[i - 1] - level);
        if (armed && i >= from && before < 0 && v >= 0) return i - 1 + before / (before - v);
    }
    return -1;
}

// Automatic measurements on the trace on screen, as a scope's "Measure" menu does
function measure(xs, ys) {
    const sorted = Float64Array.from(ys).sort();
    const max = sorted[sorted.length - 1];
    const min = sorted[0];
    const top = sorted[Math.floor(sorted.length * 0.98)];
    const base = sorted[Math.floor(sorted.length * 0.02)];
    const amplitude = top - base;
    const result = { vpp: max - min, frequency: NaN, duty: NaN, riseTime: NaN };
    if (amplitude <= 0) return result;
    const mid = base + amplitude / 2;
    const low = base + 0.1 * amplitude;
    const high = base + 0.9 * amplitude;
    const at = (i, level) => xs[i - 1] + ((level - ys[i - 1]) / (ys[i] - ys[i - 1])) * (xs[i] - xs[i - 1]);
    // Mid-level crossings, with hysteresis so noise doesn't add false edges
    const rises = [];
    const falls = [];
    let state = ys[0] > mid ? 1 : -1;
    for (let i = 1; i < ys.length; i++) {
        if (state < 0 && ys[i] > mid + 0.1 * amplitude) {
            let j = i;
            while (j > 1 && ys[j - 1] > mid) j--;
            rises.push({ index: j, time: at(j, mid) });
            state = 1;
        } else if (state > 0 && ys[i] < mid - 0.1 * amplitude) {
            let j = i;
            while (j > 1 && ys[j - 1] < mid) j--;
            falls.push(at(j, mid));
            state = -1;
        }
    }
    // Period and duty cycle from whole periods on screen: rising edge to rising edge, or else falling to falling
    const riseTimesOnly = rises.map((r) => r.time);
    const useRises = riseTimesOnly.length >= 2;
    const edges = useRises ? riseTimesOnly : falls;
    const others = useRises ? falls : riseTimesOnly;
    if (edges.length >= 2) {
        const span = edges[edges.length - 1] - edges[0];
        result.frequency = (edges.length - 1) / span;
        let high = 0;
        for (let k = 0; k < edges.length - 1; k++) {
            const other = others.find((t) => t > edges[k] && t < edges[k + 1]);
            if (other !== undefined) high += useRises ? other - edges[k] : edges[k + 1] - other;
        }
        result.duty = high / span;
    }
    // Rise time: from 10% to 90% of the amplitude on each rising edge, averaged
    const riseTimes = [];
    for (const { index } of rises) {
        let a = index;
        while (a > 1 && ys[a - 1] > low) a--;
        let b = index;
        while (b < ys.length - 1 && ys[b] < high) b++;
        if (a > 1 && b < ys.length - 1 && ys[a - 1] <= low && ys[b] >= high) riseTimes.push(at(b, high) - at(a, low));
    }
    if (riseTimes.length) result.riseTime = riseTimes.reduce((s, v) => s + v, 0) / riseTimes.length;
    return result;
}

// Formats a value with an SI prefix: 0.0012 → "1.20 m"
function si(value, unit) {
    if (!isFinite(value)) return "–";
    const prefixes = [
        { scale: 1e6, prefix: "M" },
        { scale: 1e3, prefix: "k" },
        { scale: 1, prefix: "" },
        { scale: 1e-3, prefix: "m" },
        { scale: 1e-6, prefix: "µ" },
        { scale: 1e-9, prefix: "n" }
    ];
    const { scale, prefix } = prefixes.find((p) => Math.abs(value) >= p.scale * 0.9995) ?? prefixes[prefixes.length - 1];
    const scaled = value / scale;
    return `${scaled.toFixed(Math.abs(scaled) >= 100 ? 0 : Math.abs(scaled) >= 10 ? 1 : 2)} ${prefix}${unit}`;
}

// The signal generator and scope controls, the measurement readouts and the chart each need an element.
// In your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const row = "display:flex; flex-wrap:wrap; align-items:center; gap:4px 14px; margin-bottom:4px";
    const tag = "font-size:12px; color:#9fb3d6; font-weight:600";
    const options = (values, format, selected) =>
        values.map((v) => `<option value="${v}"${v === selected ? " selected" : ""}>${format(v)}</option>`).join("");
    const header = document.createElement("div");
    header.style.cssText = "padding:6px 12px 2px; color:#ffffff;" + font;
    header.innerHTML =
        `<div style="${row}"><span style="${tag}">Signal generator</span>` +
        `<label>Waveform <select data-id="shape" style="font:inherit">` +
        `<option value="sine">Sine</option><option value="square">Square</option>` +
        `<option value="triangle">Triangle</option><option value="pulse" selected>Noisy pulse</option></select></label>` +
        `<label>Frequency <input data-id="frequency" type="range" min="1" max="4" step="0.01" value="3" ` +
        `style="vertical-align:middle; width:90px"> <output data-id="frequency"></output></label>` +
        `<label>Amplitude <input data-id="vpp" type="range" min="0.2" max="8" step="0.1" value="4" ` +
        `style="vertical-align:middle; width:90px"> <output data-id="vpp"></output></label>` +
        `<label>DC offset <input data-id="offset" type="range" min="-2" max="2" step="0.1" value="0" ` +
        `style="vertical-align:middle; width:80px"> <output data-id="offset"></output></label></div>` +
        `<div style="${row}"><span style="${tag}">Oscilloscope</span>` +
        `<label>Volts/div <select data-id="vdiv" style="font:inherit">${options(VOLTS_PER_DIV, (v) => si(v, "V"), 1)}</select></label>` +
        `<label>Time/div <select data-id="tdiv" style="font:inherit">${options(TIME_PER_DIV, (v) => si(v, "s"), 200e-6)}</select></label>` +
        `<label>Coupling <select data-id="coupling" style="font:inherit"><option>DC</option><option>AC</option></select></label>` +
        `<label><input data-id="trigger" type="checkbox" checked> Trigger</label>` +
        `<label>Edge <select data-id="edge" style="font:inherit"><option value="rising">Rising</option>` +
        `<option value="falling">Falling</option></select></label>` +
        `<label>Level <input data-id="level" type="range" min="-4" max="4" step="0.05" value="0" ` +
        `style="vertical-align:middle; width:90px"> <output data-id="level"></output></label>` +
        `<label><input data-id="persistence" type="checkbox" checked> Persistence</label>` +
        `<button data-id="run" style="font:inherit; min-width:64px; padding:1px 10px; cursor:pointer">Stop</button></div>`;
    const chart = document.createElement("div");
    chart.id = `${divElementId}-chart`;
    chart.style.cssText = "flex:1; min-height:0;";
    // The measurement readouts sit in the header, under the controls
    const readoutRow = document.createElement("div");
    readoutRow.setAttribute("aria-live", "off");
    readoutRow.style.cssText = "display:flex; flex-wrap:wrap; gap:6px; margin:2px 0 4px;";
    header.append(readoutRow);
    root.append(header, chart);
    const get = (selector) => header.querySelector(selector);
    return {
        chart,
        readoutRow,
        shape: get('select[data-id="shape"]'),
        frequency: get('input[data-id="frequency"]'),
        frequencyOut: get('output[data-id="frequency"]'),
        vpp: get('input[data-id="vpp"]'),
        vppOut: get('output[data-id="vpp"]'),
        offset: get('input[data-id="offset"]'),
        offsetOut: get('output[data-id="offset"]'),
        vdiv: get('select[data-id="vdiv"]'),
        tdiv: get('select[data-id="tdiv"]'),
        coupling: get('select[data-id="coupling"]'),
        trigger: get('input[data-id="trigger"]'),
        edge: get('select[data-id="edge"]'),
        level: get('input[data-id="level"]'),
        levelOut: get('output[data-id="level"]'),
        persistence: get('input[data-id="persistence"]'),
        run: get('button[data-id="run"]')
    };
}

async function softwareOscilloscope(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A software oscilloscope with SciChart.js: a 10 × 8 division screen, edge triggering, a draggable trigger
    // level, persistence (fading older traces) and automatic measurements
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        ELabelPlacement,
        FastLineRenderableSeries,
        XyDataSeries,
        HorizontalLineAnnotation,
        VerticalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const TRACE_COLOUR = "#F6E05E"; // channel 1 is traditionally yellow
    const GHOSTS = 12; // how many older acquisitions persistence keeps on screen

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.chart, {
        theme: new SciChartJsNavyTheme()
    });

    // The graticule: fixed ranges with one major gridline per division, so the grid is 10 × 8 divisions
    const gridLine = { color: "#5C7299", strokeThickness: 1 };
    const xAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Never,
        autoTicks: false,
        drawMinorGridLines: false,
        drawMajorBands: false,
        majorGridLineStyle: gridLine
    });
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "Voltage (V)",
        axisAlignment: EAxisAlignment.Left,
        autoRange: EAutoRange.Never,
        autoTicks: false,
        drawMinorGridLines: false,
        drawMajorBands: false,
        majorGridLineStyle: gridLine
    });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Persistence: older acquisitions stay on screen as fading "ghost" traces. The live trace is added last, on top.
    const ghosts = [];
    for (let i = 0; i < GHOSTS; i++) {
        const dataSeries = new XyDataSeries(wasmContext, { isSorted: true, containsNaN: false });
        const line = new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: TRACE_COLOUR, strokeThickness: 1 });
        sciChartSurface.renderableSeries.add(line);
        ghosts.push({ dataSeries, line });
    }
    const trace = new XyDataSeries(wasmContext, { dataSeriesName: "Channel 1", isSorted: true, containsNaN: false });
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, { dataSeries: trace, stroke: TRACE_COLOUR, strokeThickness: 2 })
    );

    // The trigger: a draggable level line, and a marker at the trigger point (time zero)
    const levelLine = new HorizontalLineAnnotation({
        y1: Number(ui.level.value),
        stroke: "#FF8A3D",
        strokeThickness: 1,
        strokeDashArray: [6, 4],
        isEditable: true, // drag the line to move the trigger level
        showLabel: true,
        labelPlacement: ELabelPlacement.Axis,
        axisLabelFill: "#FF8A3D"
    });
    const triggerPoint = new VerticalLineAnnotation({
        x1: 0,
        stroke: "#FF8A3D88",
        strokeThickness: 1,
        strokeDashArray: [2, 4]
    });
    sciChartSurface.annotations.add(triggerPoint, levelLine);

    // Hover for the time and voltage under the cursor; scroll to zoom, drag to pan, double-click to reset
    let setScreen = () => {};
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier({
            onZoomExtents: () => {
                setScreen();
                return false; // go back to the 10 × 8 division screen, not to the data
            }
        })
    );

    // Reads the controls into one settings object
    const settings = {
        shape: "pulse",
        frequency: 1000,
        vpp: 4,
        offset: 0,
        vdiv: 1,
        tdiv: 200e-6,
        coupling: "DC",
        trigger: true,
        edge: "rising",
        level: 0,
        persistence: true
    };
    function readControls() {
        Object.assign(settings, {
            shape: ui.shape.value,
            frequency: Math.pow(10, Number(ui.frequency.value)),
            vpp: Number(ui.vpp.value),
            offset: Number(ui.offset.value),
            vdiv: Number(ui.vdiv.value),
            tdiv: Number(ui.tdiv.value),
            coupling: ui.coupling.value,
            trigger: ui.trigger.checked,
            edge: ui.edge.value,
            level: Number(ui.level.value),
            persistence: ui.persistence.checked
        });
        ui.frequencyOut.textContent = si(settings.frequency, "Hz");
        ui.vppOut.textContent = `${settings.vpp.toFixed(1)} Vpp`;
        ui.offsetOut.textContent = `${settings.offset.toFixed(1)} V`;
        ui.levelOut.textContent = `${settings.level.toFixed(2)} V`;
    }

    // Time on screen in µs below 1 ms/div, otherwise in ms
    const timeUnit = () => (settings.tdiv < 1e-3 ? { scale: 1e6, name: "µs" } : { scale: 1e3, name: "ms" });
    setScreen = () => {
        const { scale, name } = timeUnit();
        const halfWidth = (DIVS_X / 2) * settings.tdiv * scale;
        xAxis.axisTitle = `Time from trigger (${name})`;
        xAxis.majorDelta = settings.tdiv * scale;
        xAxis.labelProvider.precision = settings.tdiv * scale < 1 ? 1 : 0;
        xAxis.visibleRange = new NumberRange(-halfWidth, halfWidth);
        yAxis.majorDelta = settings.vdiv;
        yAxis.labelProvider.precision = settings.vdiv < 1 ? 1 : 0;
        yAxis.visibleRange = new NumberRange((-DIVS_Y / 2) * settings.vdiv, (DIVS_Y / 2) * settings.vdiv);
    };

    // --- Acquisition: every 50 ms, take a record of 20 divisions, trigger on it and show the 10 around the trigger ---
    let clock = 0; // the signal generator's time (s)
    let running = true;
    let newest = 0; // which ghost holds the newest old trace
    let previous = null; // the last trace drawn, which becomes a ghost
    let status = "";
    let lastMeasured = 0;

    function acquireAndDraw() {
        const dt = settings.tdiv / POINTS_PER_DIV;
        const count = 2 * DIVS_X * POINTS_PER_DIV;
        const ys = acquire(settings, clock, dt, count);
        const half = (DIVS_X / 2) * POINTS_PER_DIV;
        // Look for the trigger in the middle of the record, so there are 5 divisions before and after it
        let centre = settings.trigger
            ? findTrigger(ys, settings.level, settings.edge, 0.15 * settings.vdiv, half, count - half)
            : -1;
        status = !settings.trigger ? "Trigger off: free-running" : centre >= 0 ? "Triggered" : "Auto: no trigger found";
        if (centre < 0) centre = count / 2; // free-run: show the middle of the record wherever the signal happens to be
        triggerPoint.isHidden = !settings.trigger;

        const { scale } = timeUnit();
        const xs = [];
        const shown = [];
        for (let i = Math.ceil(centre - half); i <= Math.floor(centre + half); i++) {
            xs.push((i - centre) * dt * scale);
            shown.push(ys[i]);
        }
        // Persistence: the trace drawn last time becomes the newest ghost; older ghosts fade
        if (settings.persistence && previous) {
            newest = (newest + 1) % GHOSTS;
            ghosts[newest].dataSeries.clear();
            ghosts[newest].dataSeries.appendRange(previous.xs, previous.ys);
            ghosts.forEach((ghost, k) => {
                const age = (newest - k + GHOSTS) % GHOSTS; // 0 = newest
                ghost.line.opacity = 0.45 * (1 - age / GHOSTS);
            });
        }
        previous = { xs, ys: shown };
        trace.clear();
        trace.appendRange(xs, shown);

        const now = performance.now();
        if (now - lastMeasured > 300) {
            lastMeasured = now;
            showMeasurements(xs.map((x) => x / scale), shown);
        }
    }

    // --- Measurement readouts ---
    const readouts = ["Status", "Vpp", "Frequency", "Period", "Duty cycle", "Rise time (10–90%)", "Sample rate"].map(
        (label) => {
            const tile = document.createElement("div");
            tile.style.cssText = "padding:2px 10px; border-radius:6px; background:#14233C; min-width:88px;";
            tile.innerHTML = `<div style="font-size:11px; color:#c8d3e8">${label}</div><div style="font-size:15px; font-weight:600">–</div>`;
            ui.readoutRow.append(tile);
            return tile.lastElementChild;
        }
    );
    function showMeasurements(times, volts) {
        const m = measure(times, volts);
        const values = [
            running ? status : "Stopped",
            si(m.vpp, "V"),
            si(m.frequency, "Hz"),
            si(1 / m.frequency, "s"),
            isFinite(m.duty) ? `${(m.duty * 100).toFixed(1)} %` : "–",
            si(m.riseTime, "s"),
            si(POINTS_PER_DIV / settings.tdiv, "S/s")
        ];
        values.forEach((text, k) => (readouts[k].textContent = text));
    }

    function clearGhosts() {
        ghosts.forEach((ghost) => ghost.dataSeries.clear());
        previous = null;
    }

    let lastTick = performance.now();
    const timer = setInterval(() => {
        const now = performance.now();
        clock += Math.min(now - lastTick, 250) / 1000; // the generator keeps running in real time
        lastTick = now;
        if (running) acquireAndDraw();
    }, 50);
    sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });

    // --- Controls ---
    const redraw = (rescale) => {
        readControls();
        levelLine.y1 = settings.level;
        if (rescale) {
            clearGhosts();
            setScreen();
        }
        if (!settings.persistence) clearGhosts();
        acquireAndDraw();
    };
    for (const input of [ui.frequency, ui.vpp, ui.offset, ui.level]) input.addEventListener("input", () => redraw(false));
    for (const select of [ui.shape, ui.coupling, ui.edge, ui.trigger, ui.persistence]) {
        select.addEventListener("change", () => redraw(false));
    }
    for (const select of [ui.vdiv, ui.tdiv]) select.addEventListener("change", () => redraw(true));
    levelLine.dragDelta.subscribe(() => {
        ui.level.value = String(Math.max(-4, Math.min(4, levelLine.y1)));
        readControls();
    });
    ui.run.addEventListener("click", () => {
        running = !running;
        ui.run.textContent = running ? "Stop" : "Run";
        if (!running) readouts[0].textContent = "Stopped";
    });

    readControls();
    setScreen();
    acquireAndDraw();
    // #region_A_end
}

softwareOscilloscope("scichart-root");
