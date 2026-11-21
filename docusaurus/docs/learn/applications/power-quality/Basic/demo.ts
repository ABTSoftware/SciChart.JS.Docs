import * as SciChart from "scichart";

const SAMPLES_PER_CYCLE = 256; // 12.8 kHz on a 50 Hz supply, 15.36 kHz on 60 Hz
const RECORD_CYCLES = 30; // 0.6 s at 50 Hz, 0.5 s at 60 Hz
const EVENT_START_CYCLE = 15.3; // the event starts part-way through cycle 16
const EVENT_CYCLES = 5; // how long a sag, swell or interruption lasts
const RATED_CURRENT = 40; // A RMS of fundamental per phase at full load
// The supply's impedance, as the voltage drop it causes per unit of rated current: its resistance is the same
// at every frequency, its reactance grows with frequency (h times higher at harmonic h)
const SOURCE_RESISTANCE = 0.012;
const SOURCE_REACTANCE = 0.012;

// Typical current harmonics of each kind of load, in % of the fundamental current (sample values for this guide,
// not measurements). The 3rd, 5th and 7th set the sliders when the load is chosen; the rest stay fixed.
// "sign" puts each harmonic in the phase that gives the load's typical current shape: flat-topped blocks
// for a six-pulse drive, narrow pulses at the voltage peaks for LED drivers and other single-phase rectifiers.
const LOADS = {
    resistive: { label: "Resistive (heaters)", harmonics: {}, sign: {}, displacementDeg: 0 },
    vfd: {
        label: "Six-pulse drive (VFD)",
        harmonics: { 5: 35, 7: 12, 11: 7, 13: 5, 17: 3, 19: 2 },
        sign: { 3: -1, 5: -1, 7: -1, 11: 1, 13: 1, 17: -1, 19: -1 },
        displacementDeg: -8 // current lags the voltage slightly
    },
    led: {
        label: "LED drivers (single-phase rectifiers)",
        harmonics: { 3: 80, 5: 55, 7: 30, 9: 15, 11: 8, 13: 5 },
        sign: { 3: -1, 5: 1, 7: -1, 9: 1, 11: -1, 13: 1 },
        displacementDeg: 12 // the input capacitor makes the current lead
    }
};

// A small background distortion that is already on the supply, in % of the nominal voltage
const BACKGROUND_VOLTAGE = { 3: 0.4, 5: 1.0, 7: 0.6 };

// Sample data: a simulated three-phase, four-wire supply feeding one kind of load. The supply has a small
// reactance, so each current harmonic h drops a voltage harmonic of h times the reactance at the load.
// Events change the supply voltage for a few cycles: a sag on L1, a swell on L2 and L3 (as during a fault from
// L1 to earth), an interruption of all three phases, or a capacitor-switching transient.
function simulateSupply({ mainsHz, loadType, h3, h5, h7, l3Load, event }) {
    const nominal = mainsHz === 50 ? 230 : 120; // phase-to-neutral volts RMS
    const n = RECORD_CYCLES * SAMPLES_PER_CYCLE;
    const load = LOADS[loadType];
    const current = { ...load.harmonics };
    if (loadType !== "resistive") Object.assign(current, { 3: h3, 5: h5, 7: h7 });
    const time = new Float64Array(n);
    const voltage = [0, 1, 2].map(() => new Float64Array(n));
    const amps = [0, 1, 2].map(() => new Float64Array(n));
    const phi = (load.displacementDeg * Math.PI) / 180;
    for (let i = 0; i < n; i++) {
        const cycles = i / SAMPLES_PER_CYCLE;
        time[i] = cycles / mainsHz;
        const inEvent = cycles >= EVENT_START_CYCLE && cycles < EVENT_START_CYCLE + EVENT_CYCLES;
        for (let p = 0; p < 3; p++) {
            const theta = 2 * Math.PI * cycles - (2 * Math.PI * p) / 3; // each phase 120 degrees behind the one before
            let scale = 1;
            if (inEvent && event === "sag" && p === 0) scale = 0.6;
            if (inEvent && event === "swell" && p > 0) scale = 1.15;
            if (inEvent && event === "interruption") scale = 0.02;
            const loadScale = (p === 2 ? l3Load : 1) * scale; // a constant-impedance load follows the voltage
            // Supply voltage: the fundamental plus the background harmonics
            let v = Math.SQRT2 * nominal * Math.sin(theta);
            for (const [h, pct] of Object.entries(BACKGROUND_VOLTAGE)) v += (Math.SQRT2 * nominal * pct) / 100 * Math.sin(Number(h) * theta);
            v *= scale;
            // Load current: the fundamental at the displacement angle plus the load's harmonics
            const iPeak = Math.SQRT2 * RATED_CURRENT * loadScale;
            let i1 = iPeak * Math.sin(theta + phi);
            if (loadType === "resistive") i1 = (v / nominal) * RATED_CURRENT * (p === 2 ? l3Load : 1);
            let iTotal = i1;
            for (const [hText, value] of Object.entries(current)) {
                const h = Number(hText);
                const pct = Number(value);
                if (!pct) continue;
                const sign = load.sign[h] || 1;
                const angle = h * (theta + phi);
                iTotal += (sign * iPeak * pct) / 100 * Math.sin(angle);
                // each current harmonic drops a voltage harmonic across the supply impedance (R + j h X)
                const drop = (sign * Math.SQRT2 * nominal * pct * loadScale) / 100;
                v -= drop * (SOURCE_RESISTANCE * Math.sin(angle) + SOURCE_REACTANCE * h * Math.cos(angle));
            }
            voltage[p][i] = v;
            amps[p][i] = iTotal;
        }
    }
    if (event === "transient") {
        // Switching in a capacitor bank near the peak of L1: a decaying 700 Hz ring on all three phases
        const t0 = (EVENT_START_CYCLE + 0.2) / mainsHz;
        const first = Math.ceil(t0 * mainsHz * SAMPLES_PER_CYCLE);
        // the uncharged capacitor pulls each phase's voltage towards 0, then it rings
        const steps = voltage.map((v) => -v[first]);
        for (let i = first; i < n && time[i] - t0 < 0.02; i++) {
            const t = time[i] - t0;
            for (let p = 0; p < 3; p++) voltage[p][i] += 0.9 * steps[p] * Math.exp(-t / 0.003) * Math.cos(2 * Math.PI * 700 * t);
        }
    }
    const neutral = new Float64Array(n);
    for (let i = 0; i < n; i++) neutral[i] = amps[0][i] + amps[1][i] + amps[2][i];
    return { time, voltage, amps, neutral, nominal };
}

// The controls, the readout and the five charts each need an element. This splits the page's div into them;
// in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const bar = document.createElement("div");
    bar.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const slider = (id, label, max, value) =>
        `<label>${label} <input data-id="${id}" type="range" min="0" max="${max}" value="${value}" ` +
        `style="vertical-align:middle; width:90px"> <output data-id="${id}"></output></label>`;
    bar.innerHTML =
        `<label>Load <select data-id="load" style="font:inherit">` +
        Object.entries(LOADS)
            .map(([key, load]) => `<option value="${key}"${key === "led" ? " selected" : ""}>${load.label}</option>`)
            .join("") +
        `</select></label>` +
        slider("h3", "3rd", 100, 80) +
        slider("h5", "5th", 80, 55) +
        slider("h7", "7th", 50, 30) +
        `<label>L3 load <input data-id="l3" type="range" min="0" max="100" value="100" ` +
        `style="vertical-align:middle; width:90px"> <output data-id="l3"></output></label>` +
        `<label>Mains <select data-id="mains" style="font:inherit"><option value="50">50 Hz, 230 V</option>` +
        `<option value="60">60 Hz, 120 V</option></select></label>` +
        `<label>Inject event <select data-id="event" style="font:inherit"><option value="none">None</option>` +
        `<option value="sag" selected>Sag on L1 (to 60%)</option><option value="swell">Swell on L2, L3 (to 115%)</option>` +
        `<option value="interruption">Interruption</option><option value="transient">Capacitor-switching transient</option>` +
        `</select></label>` +
        `<span data-id="summary" aria-live="polite" style="flex-basis:100%; color:#c8d3e8"></span>`;
    const row = (heightFlex, columns) => {
        const div = document.createElement("div");
        div.style.cssText = `flex:${heightFlex}; min-height:0; display:flex; gap:4px;`;
        root.append(div);
        return columns.map(([name, flex]) => {
            const cell = document.createElement("div");
            cell.id = `${divElementId}-${name}`;
            cell.style.cssText = `flex:${flex}; min-width:0;`;
            div.append(cell);
            return cell;
        });
    };
    root.append(bar);
    const [voltageDiv, phasorDiv] = row(1, [["voltage", 2], ["phasor", 1]]);
    const [currentDiv, eventDiv] = row(1, [["current", 2], ["event", 1]]);
    const [spectrumDiv] = row(1, [["spectrum", 1]]);
    const get = (selector) => bar.querySelector(selector);
    const sliderPair = (id) => ({ input: get(`input[data-id="${id}"]`), output: get(`output[data-id="${id}"]`) });
    return {
        voltageDiv,
        phasorDiv,
        currentDiv,
        eventDiv,
        spectrumDiv,
        loadSelect: get('select[data-id="load"]'),
        h3: sliderPair("h3"),
        h5: sliderPair("h5"),
        h7: sliderPair("h7"),
        l3: sliderPair("l3"),
        mainsSelect: get('select[data-id="mains"]'),
        eventSelect: get('select[data-id="event"]'),
        summary: get('span[data-id="summary"]')
    };
}

async function powerQualityChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A power quality analyser view with SciChart.js: three-phase voltage and current waveforms, a phasor
    // diagram, an RMS event plot and a harmonic spectrum, all recomputed when the load or the supply changes
    const {
        SciChartSurface,
        SciChartPolarSurface,
        NumericAxis,
        PolarNumericAxis,
        EPolarAxisMode,
        EAxisAlignment,
        NumberRange,
        EAutoRange,
        EXyDirection,
        ELabelPlacement,
        FastLineRenderableSeries,
        FastColumnRenderableSeries,
        PolarLineRenderableSeries,
        XyDataSeries,
        HorizontalLineAnnotation,
        BoxAnnotation,
        ECoordinateMode,
        NativeTextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        ELegendOrientation,
        ELegendPlacement,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Analysis helpers (plain JavaScript, no library needed) ---

    // Mixed-radix FFT for any length (here 2,560 or 3,072 samples), recursive and short rather than fast
    function fft(re, im) {
        const n = re.length;
        if (n === 1) return;
        let p = 2;
        while (n % p !== 0) p++; // the smallest factor of n
        const m = n / p;
        const parts = [];
        for (let j = 0; j < p; j++) {
            const r = new Float64Array(m);
            const i = new Float64Array(m);
            for (let k = 0; k < m; k++) {
                r[k] = re[k * p + j];
                i[k] = im[k * p + j];
            }
            fft(r, i);
            parts.push([r, i]);
        }
        for (let k = 0; k < n; k++) {
            let sumRe = 0;
            let sumIm = 0;
            for (let j = 0; j < p; j++) {
                const angle = (-2 * Math.PI * j * k) / n;
                const [r, i] = parts[j];
                const c = Math.cos(angle);
                const s = Math.sin(angle);
                sumRe += r[k % m] * c - i[k % m] * s;
                sumIm += r[k % m] * s + i[k % m] * c;
            }
            re[k] = sumRe;
            im[k] = sumIm;
        }
    }

    // Harmonics of one channel over a window of whole cycles, as IEC 61000-4-7 does: 10 cycles on 50 Hz and
    // 12 on 60 Hz (about 200 ms, 5 Hz between lines). Because the window holds whole cycles, every harmonic
    // falls exactly on a line, so a rectangular window (no taper) gives exact amplitudes with no leakage.
    // Returns the RMS amplitude and phase of harmonics 0 to maxOrder.
    function harmonics(values, start, cycles, maxOrder) {
        const n = cycles * SAMPLES_PER_CYCLE;
        const re = Float64Array.from(values.subarray(start, start + n));
        const im = new Float64Array(n);
        fft(re, im);
        const result = [];
        for (let h = 0; h <= maxOrder; h++) {
            const k = h * cycles; // the line for harmonic h
            const scale = h === 0 ? 1 / n : Math.SQRT2 / n; // peak 2|X|/n, RMS = peak / sqrt 2
            result.push({ rms: Math.hypot(re[k], im[k]) * scale, phase: Math.atan2(im[k], re[k]) });
        }
        return result;
    }

    // THD: the RMS of all harmonics 2 to 50, divided by the fundamental
    function thd(spectrum) {
        let sum = 0;
        for (let h = 2; h < spectrum.length; h++) sum += spectrum[h].rms ** 2;
        return Math.sqrt(sum) / spectrum[1].rms;
    }

    function rms(values, start, n) {
        let sum = 0;
        for (let i = start; i < start + n; i++) sum += values[i] * values[i];
        return Math.sqrt(sum / n);
    }

    // Urms(1/2) from IEC 61000-4-30, used to detect dips and swells: the RMS over one cycle, refreshed every half cycle
    function halfCycleRms(values) {
        const half = SAMPLES_PER_CYCLE / 2;
        const out = [];
        for (let end = SAMPLES_PER_CYCLE; end <= values.length; end += half) {
            out.push({ index: end - 1, value: rms(values, end - SAMPLES_PER_CYCLE, SAMPLES_PER_CYCLE) });
        }
        return out;
    }

    // Classify an event from the three phases' Urms(1/2), as % of nominal: a dip starts when any phase falls
    // below 90% and ends when all are back above 92% (2% hysteresis); swells use 110% and 108%;
    // an interruption is all three phases below 10%
    function detectEvent(urms, mainsHz) {
        const steps = urms[0].length;
        const halfCycleMs = 1000 / mainsHz / 2;
        const events = [];
        const find = (name, isIn, isOut, extreme, pick) => {
            let start = -1;
            let worst = extreme;
            for (let k = 0; k < steps; k++) {
                const values = urms.map((phase) => phase[k].value);
                if (start < 0 && isIn(values)) start = k;
                if (start >= 0) {
                    worst = pick(worst, ...values);
                    if (isOut(values) || k === steps - 1) {
                        events.push({ name, durationMs: (k - start) * halfCycleMs, extreme: worst });
                        start = -1;
                        worst = extreme;
                    }
                }
            }
        };
        find("Interruption", (v) => v.every((x) => x < 10), (v) => v.some((x) => x >= 12), 100, Math.min);
        if (!events.length) find("Dip", (v) => v.some((x) => x < 90), (v) => v.every((x) => x >= 92), 100, Math.min);
        find("Swell", (v) => v.some((x) => x > 110), (v) => v.every((x) => x <= 108), 100, Math.max);
        return events;
    }

    // --- Charts ---
    const font = { fontSize: 13 };
    async function createWaveChart(div, title, yTitle, legendPlacement) {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(div, {
            theme: new SciChartJsNavyTheme(),
            title,
            titleStyle: { fontSize: 14 }
        });
        const xAxis = new NumericAxis(wasmContext, { axisTitle: "Time (ms)", axisTitleStyle: font, labelPrecision: 0 });
        const yAxis = new NumericAxis(wasmContext, {
            axisTitle: yTitle,
            axisTitleStyle: font,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            labelPrecision: 0
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true, showYLine: false }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
            new LegendModifier({ showCheckboxes: false, orientation: ELegendOrientation.Horizontal, placement: legendPlacement })
        );
        return { sciChartSurface, wasmContext, xAxis, yAxis };
    }
    function addLine(chart, name, colour, dashed) {
        const dataSeries = new XyDataSeries(chart.wasmContext, { dataSeriesName: name, dataIsSortedInX: true, containsNaN: false });
        chart.sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(chart.wasmContext, {
                dataSeries,
                stroke: colour,
                strokeThickness: dashed ? 1.5 : 2,
                strokeDashArray: dashed ? [6, 4] : undefined
            })
        );
        return dataSeries;
    }

    const PHASE_COLOURS = ["#F48420", "#50C7E0", "#E36FD8"];
    const PHASES = ["L1", "L2", "L3"];

    // 1. Voltage waveforms, with the harmonic analysis window shaded
    const voltageChart = await createWaveChart(ui.voltageDiv, "Phase voltages", "Volts", ELegendPlacement.TopRight);
    const voltageSeries = PHASES.map((name, p) => addLine(voltageChart, name, PHASE_COLOURS[p], false));
    const windowBox = new BoxAnnotation({ x1: 0, x2: 200, y1: 0, y2: 1, yCoordinateMode: ECoordinateMode.Relative, fill: "#FFFFFF12", strokeThickness: 0 });
    const windowLabel = new NativeTextAnnotation({ x1: 200, y1: 0.02, yCoordinateMode: ECoordinateMode.Relative, text: "harmonic analysis window ", fontSize: 12, textColor: "#C8D3E8", horizontalAnchorPoint: EHorizontalAnchorPoint.Right, verticalAnchorPoint: EVerticalAnchorPoint.Top });
    voltageChart.sciChartSurface.annotations.add(windowBox, windowLabel);

    // 2. Current waveforms and the neutral current
    const currentChart = await createWaveChart(ui.currentDiv, "Phase and neutral currents", "Amps", ELegendPlacement.TopLeft);
    const currentSeries = PHASES.map((name, p) => addLine(currentChart, name, PHASE_COLOURS[p], false));
    const neutralSeries = addLine(currentChart, "Neutral", "#FFFFFF", true);

    // 3. Urms(1/2) event plot, with the dip and swell thresholds
    const eventChart = await createWaveChart(ui.eventDiv, "RMS per half cycle (% of nominal)", "%", ELegendPlacement.BottomLeft);
    eventChart.yAxis.autoRange = EAutoRange.Never;
    eventChart.yAxis.visibleRange = new NumberRange(0, 130);
    const eventSeries = PHASES.map((name, p) => addLine(eventChart, name, PHASE_COLOURS[p], false));
    for (const { y, label } of [{ y: 90, label: "dip 90%" }, { y: 110, label: "swell 110%" }]) {
        eventChart.sciChartSurface.annotations.add(
            new HorizontalLineAnnotation({ y1: y, stroke: "#C8D3E8", strokeDashArray: [4, 4], strokeThickness: 1, showLabel: true, labelValue: label, labelPlacement: ELabelPlacement.TopRight, axisLabelFill: "#C8D3E8", axisFontSize: 11 })
        );
    }

    // Zooming or panning one waveform chart moves the other; the RMS plot keeps the whole recording in view
    const timeAxes = [voltageChart.xAxis, currentChart.xAxis];
    for (const axis of timeAxes) {
        axis.visibleRangeChanged.subscribe(({ visibleRange }) => {
            for (const other of timeAxes) {
                if (other !== axis && !other.visibleRange.equals(visibleRange)) other.visibleRange = visibleRange;
            }
        });
    }

    // 4. Harmonic spectrum of L1: voltage and current side by side, in % of their fundamentals
    const spectrum = await SciChartSurface.create(ui.spectrumDiv, {
        theme: new SciChartJsNavyTheme(),
        title: "Harmonic spectrum of L1 (% of fundamental)",
        titleStyle: { fontSize: 14 }
    });
    spectrum.sciChartSurface.xAxes.add(
        new NumericAxis(spectrum.wasmContext, {
            axisTitle: "Harmonic order",
            axisTitleStyle: font,
            visibleRange: new NumberRange(1.2, 25.8),
            autoRange: EAutoRange.Never,
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            labelPrecision: 0
        })
    );
    spectrum.sciChartSurface.yAxes.add(
        new NumericAxis(spectrum.wasmContext, { id: "v", axisTitle: "Voltage (%)", axisTitleStyle: { ...font, color: "#50C7E0" }, autoRange: EAutoRange.Never, labelPrecision: 1, axisAlignment: EAxisAlignment.Left }),
        new NumericAxis(spectrum.wasmContext, { id: "i", axisTitle: "Current (%)", axisTitleStyle: { ...font, color: "#F5E663" }, autoRange: EAutoRange.Never, labelPrecision: 0, axisAlignment: EAxisAlignment.Right, drawMajorGridLines: false })
    );
    const spectrumSeries = [
        { name: "Voltage", axis: "v", offset: -0.18, fill: "#50C7E0CC", stroke: "#50C7E0" },
        { name: "Current", axis: "i", offset: 0.18, fill: "#F5E663CC", stroke: "#F5E663" }
    ].map(({ name, axis, offset, fill, stroke }) => {
        const dataSeries = new XyDataSeries(spectrum.wasmContext, { dataSeriesName: name });
        spectrum.sciChartSurface.renderableSeries.add(
            new FastColumnRenderableSeries(spectrum.wasmContext, { dataSeries, yAxisId: axis, fill, stroke, dataPointWidth: 0.34, cornerRadius: 4 })
        );
        return { dataSeries, offset };
    });
    // IEEE 519's limit for any single voltage harmonic on systems up to 1 kV
    spectrum.sciChartSurface.annotations.add(
        new HorizontalLineAnnotation({ y1: 5, yAxisId: "v", stroke: "#50C7E0", strokeDashArray: [4, 4], strokeThickness: 1, showLabel: true, labelValue: "IEEE 519 single-harmonic voltage limit, 5%", labelPlacement: ELabelPlacement.TopRight, axisLabelFill: "#50C7E0", axisFontSize: 11 })
    );
    spectrum.sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showYLine: false }),
        new LegendModifier({ showCheckboxes: false, orientation: ELegendOrientation.Horizontal, placement: ELegendPlacement.BottomRight })
    );

    // 5. Phasor diagram: each phase's fundamental voltage and current as an arrow (length in % of nominal,
    // angle measured from L1's voltage, anticlockwise)
    const phasor = await SciChartPolarSurface.create(ui.phasorDiv, {
        theme: new SciChartJsNavyTheme(),
        title: "Phasors (fundamental)",
        titleStyle: { fontSize: 14 }
    });
    phasor.sciChartSurface.xAxes.add(
        new PolarNumericAxis(phasor.wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            visibleRange: new NumberRange(0, 360),
            autoTicks: false,
            majorDelta: 30,
            labelPrecision: 0,
            labelPostfix: "°",
            drawMinorGridLines: false,
            drawMajorBands: false
        })
    );
    phasor.sciChartSurface.yAxes.add(
        new PolarNumericAxis(phasor.wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            axisAlignment: EAxisAlignment.Right,
            visibleRange: new NumberRange(0, 125),
            autoTicks: false,
            majorDelta: 25,
            drawLabels: false,
            drawMinorGridLines: false,
            drawMajorBands: false
        })
    );
    // An arrow from the centre to (angle, length), with a head drawn as two short barbs
    function arrowPoints(angleDeg, length) {
        const toXy = (a, r) => [r * Math.cos((a * Math.PI) / 180), r * Math.sin((a * Math.PI) / 180)];
        const toPolar = ([x, y]) => [((Math.atan2(y, x) * 180) / Math.PI + 360) % 360, Math.hypot(x, y)];
        const [tx, ty] = toXy(angleDeg, length);
        const barb = (side) => toPolar([tx + 8 * Math.cos(((angleDeg + 180 + side) * Math.PI) / 180), ty + 8 * Math.sin(((angleDeg + 180 + side) * Math.PI) / 180)]);
        const tip = [angleDeg, length];
        const points = [[angleDeg, 0], tip, barb(25), tip, barb(-25)];
        return { x: points.map((pt) => pt[0]), y: points.map((pt) => pt[1]) };
    }
    const phasorArrows = [];
    for (const kind of ["V", "I"]) {
        PHASES.forEach((name, p) => {
            const dataSeries = new XyDataSeries(phasor.wasmContext, { dataSeriesName: `${kind}${p + 1}` });
            phasor.sciChartSurface.renderableSeries.add(
                new PolarLineRenderableSeries(phasor.wasmContext, {
                    dataSeries,
                    stroke: PHASE_COLOURS[p],
                    strokeThickness: kind === "V" ? 3 : 2,
                    strokeDashArray: kind === "I" ? [5, 3] : undefined,
                    interpolateLine: false // straight arrows, not arcs
                })
            );
            const label = new NativeTextAnnotation({ x1: 0, y1: 0, text: `${kind}${p + 1}`, fontSize: 12, textColor: PHASE_COLOURS[p], horizontalAnchorPoint: EHorizontalAnchorPoint.Center, verticalAnchorPoint: EVerticalAnchorPoint.Center });
            phasor.sciChartSurface.annotations.add(label);
            phasorArrows.push({ kind, p, dataSeries, label });
        });
    }

    function setData(dataSeries, x, y) {
        dataSeries.clear();
        dataSeries.appendRange(Array.from(x), Array.from(y));
    }

    // --- The controls: every change re-simulates the supply, reruns the analysis and redraws ---
    let lastMains = 0;
    function update(event) {
        const loadType = ui.loadSelect.value;
        if (event && event.target === ui.loadSelect) {
            // choosing a load sets the sliders to its typical 3rd, 5th and 7th harmonics
            const preset = LOADS[loadType].harmonics;
            ui.h3.input.value = String(preset[3] || 0);
            ui.h5.input.value = String(preset[5] || 0);
            ui.h7.input.value = String(preset[7] || 0);
        }
        const resistive = loadType === "resistive";
        for (const s of [ui.h3, ui.h5, ui.h7]) {
            s.input.disabled = resistive;
            s.output.textContent = resistive ? "–" : `${s.input.value}%`;
        }
        ui.l3.output.textContent = `${ui.l3.input.value}%`;
        const mainsHz = Number(ui.mainsSelect.value);
        const settings = {
            mainsHz,
            loadType,
            h3: Number(ui.h3.input.value),
            h5: Number(ui.h5.input.value),
            h7: Number(ui.h7.input.value),
            l3Load: Number(ui.l3.input.value) / 100,
            event: ui.eventSelect.value
        };
        const supply = simulateSupply(settings);
        const ms = Array.from(supply.time, (t) => t * 1000);

        PHASES.forEach((_, p) => {
            setData(voltageSeries[p], ms, supply.voltage[p]);
            setData(currentSeries[p], ms, supply.amps[p]);
        });
        setData(neutralSeries, ms, supply.neutral);

        // Urms(1/2) per phase, as % of nominal, plotted at the end of each one-cycle window
        const urms = supply.voltage.map((v) => halfCycleRms(v).map(({ index, value }) => ({ index, value: (100 * value) / supply.nominal })));
        urms.forEach((phase, p) => setData(eventSeries[p], phase.map((u) => ms[u.index]), phase.map((u) => u.value)));

        // Harmonic analysis over the first 10 cycles (50 Hz) or 12 cycles (60 Hz), before the event
        const cycles = mainsHz === 50 ? 10 : 12;
        const windowMs = (1000 * cycles) / mainsHz;
        windowBox.x2 = windowMs;
        windowLabel.x1 = windowMs;
        const vSpectra = supply.voltage.map((v) => harmonics(v, 0, cycles, 50));
        const iSpectra = supply.amps.map((i) => harmonics(i, 0, cycles, 50));
        const orders = Array.from({ length: 24 }, (_, k) => k + 2);
        spectrumSeries.forEach(({ dataSeries, offset }, s) => {
            const lines = s === 0 ? vSpectra[0] : iSpectra[0];
            const percent = orders.map((h) => (100 * lines[h].rms) / lines[1].rms);
            setData(dataSeries, orders.map((h) => h + offset), percent);
            // both axes start at 0; the voltage axis always shows the 5% limit line
            const top = Math.max(s === 0 ? 6 : 10, 1.2 * Math.max(...percent));
            spectrum.sciChartSurface.yAxes.get(s).visibleRange = new NumberRange(0, top);
        });

        // Phasors, rotated so that L1's voltage points to 0 degrees
        const reference = vSpectra[0][1].phase;
        for (const { kind, p, dataSeries, label } of phasorArrows) {
            const line = (kind === "V" ? vSpectra : iSpectra)[p][1];
            const length = (100 * line.rms) / (kind === "V" ? supply.nominal : RATED_CURRENT);
            const angle = ((((line.phase - reference) * 180) / Math.PI) % 360 + 360) % 360;
            const arrow = arrowPoints(angle, length);
            setData(dataSeries, arrow.x, arrow.y);
            // voltage labels sit beyond the arrow tips; current labels just off their arrows
            label.x1 = kind === "V" ? angle : (angle + 10) % 360;
            label.y1 = kind === "V" ? length + 12 : length * 0.6;
        }

        // Readout for the analysis window: RMS, THD, crest factor and power factor
        const n = cycles * SAMPLES_PER_CYCLE;
        let activePower = 0;
        let apparentPower = 0;
        for (let p = 0; p < 3; p++) {
            let sum = 0;
            for (let i = 0; i < n; i++) sum += supply.voltage[p][i] * supply.amps[p][i];
            activePower += sum / n;
            apparentPower += rms(supply.voltage[p], 0, n) * rms(supply.amps[p], 0, n);
        }
        const v1 = rms(supply.voltage[0], 0, n);
        const i1 = rms(supply.amps[0], 0, n);
        let peak = 0;
        for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(supply.amps[0][i]));
        const truePf = activePower / apparentPower;
        const displacementPf = Math.cos(iSpectra[0][1].phase - vSpectra[0][1].phase);
        const neutralRms = rms(supply.neutral, 0, n);
        const thdV = 100 * thd(vSpectra[0]);
        const thdI = 100 * thd(iSpectra[0]);
        const events = detectEvent(urms, mainsHz);
        let eventText = settings.event === "transient" ? "Transient: peak " : "No dip, swell or interruption";
        if (settings.event === "transient") {
            let vPeak = 0;
            for (const v of supply.voltage) for (const x of v) vPeak = Math.max(vPeak, Math.abs(x));
            eventText += `${(vPeak / (Math.SQRT2 * supply.nominal)).toFixed(2)} × nominal peak, RMS barely moves`;
        } else if (events.length) {
            eventText = events.map((e) => `${e.name}: ${e.name === "Swell" ? "max" : "residual"} ${e.extreme.toFixed(0)}% for ${e.durationMs.toFixed(0)} ms`).join("; ");
        }
        const thdColour = thdV > 8 ? "#FF4D4D" : thdV > 5 ? "#F5A623" : "#2ECC71";
        ui.summary.innerHTML =
            `L1: ${v1.toFixed(1)} V, ${i1.toFixed(1)} A RMS · ` +
            `<span style="color:${thdColour}; font-weight:600">THD<sub>V</sub> ${thdV.toFixed(1)}%</span> · THD<sub>I</sub> ${thdI.toFixed(0)}% · ` +
            `current crest factor ${(peak / i1).toFixed(2)} · power factor ${truePf.toFixed(2)} (displacement ${displacementPf.toFixed(2)}) · ` +
            `neutral ${neutralRms.toFixed(1)} A · ${eventText}`;

        // The waveforms open on cycles 6 to 22: the end of the analysis window and the whole event.
        // Double-click to see the whole recording.
        if (mainsHz !== lastMains) {
            const cycleMs = 1000 / mainsHz;
            for (const axis of timeAxes) axis.visibleRange = new NumberRange(6 * cycleMs, 22 * cycleMs);
            eventChart.xAxis.visibleRange = new NumberRange(0, ms[ms.length - 1]);
            lastMains = mainsHz;
        }
    }

    for (const s of [ui.h3, ui.h5, ui.h7, ui.l3]) s.input.addEventListener("input", update);
    for (const select of [ui.loadSelect, ui.mainsSelect, ui.eventSelect]) select.addEventListener("change", update);
    update(null);
    // #region_A_end
}

powerQualityChart("scichart-root");
