import * as SciChart from "scichart";

const SAMPLES_PER_CYCLE = 40; // time steps per carrier cycle: fine enough to catch each carrier peak
const MESSAGE_PERIODS = 2; // how many cycles of the message (audio) tone to show
const E12 = [1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2]; // standard resistor and capacitor values
const MESSAGE_HZ = [500, 700, 1000, 1500, 2000, 3000, 4000, 5000, 7000, 10000]; // message (audio) tone choices

// Sample data: an AM signal, a carrier whose amplitude follows a sine-wave message (the audio). Both start
// at a peak, so the detector charges on the first sample.
// amplitude is the unmodulated carrier's peak in volts, depth the modulation depth m (0 to 1).
// Optional noise comes from a seeded random generator, so the chart looks the same every time.
function makeAmSignal(carrierHz, messageHz, depth, amplitude, noiseLevel) {
    let seed = 5;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    const dt = 1 / (carrierHz * SAMPLES_PER_CYCLE);
    const count = Math.round((MESSAGE_PERIODS / messageHz) / dt);
    const t = [];
    const input = [];
    const envelope = [];
    for (let n = 0; n < count; n++) {
        const time = n * dt;
        const env = amplitude * (1 + depth * Math.cos(2 * Math.PI * messageHz * time));
        t.push(time);
        envelope.push(env);
        input.push(env * Math.cos(2 * Math.PI * carrierHz * time) + noiseLevel * amplitude * gaussian());
    }
    return { t, input, envelope, dt };
}

// The controls and the two charts each need an element. This splits the page's div into a control bar,
// a signal chart and an error chart; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const bar = document.createElement("div");
    bar.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const slider = (id, label, min, max, value, width) =>
        `<label>${label} <input data-id="${id}" type="range" min="${min}" max="${max}" value="${value}" ` +
        `style="vertical-align:middle; width:${width}px"> <output data-id="${id}"></output></label>`;
    bar.innerHTML =
        `<label>Carrier <select data-id="carrier" style="font:inherit">` +
        `<option value="100000">100 kHz</option><option value="455000">455 kHz (AM radio IF)</option>` +
        `<option value="1000000" selected>1 MHz</option></select></label>` +
        slider("message", "Message frequency", 0, 9, 7, 90) +
        slider("depth", "Modulation depth", 0, 100, 80, 100) +
        `<label>Amplitude <select data-id="amplitude" style="font:inherit">` +
        `<option value="0.5">0.5 V</option><option value="1" selected>1 V</option>` +
        `<option value="2">2 V</option><option value="5">5 V</option></select></label>` +
        slider("r", "R", 0, 24, 12, 100) +
        slider("c", "C", 0, 36, 16, 110) +
        `<label>Diode <select data-id="diode" style="font:inherit">` +
        `<option value="0" selected>Ideal (0 V)</option><option value="0.3">Schottky or germanium (0.3 V)</option>` +
        `<option value="0.7">Silicon (0.7 V)</option></select></label>` +
        slider("noise", "Noise", 0, 20, 0, 90) +
        `<span data-id="summary" aria-live="polite" style="flex-basis:100%; color:#c8d3e8"></span>`;
    const signalDiv = document.createElement("div");
    signalDiv.id = divElementId + "-signal";
    signalDiv.style.cssText = "flex:3; min-height:0;";
    const errorDiv = document.createElement("div");
    errorDiv.id = divElementId + "-error";
    errorDiv.style.cssText = "flex:2; min-height:0;";
    root.append(bar, signalDiv, errorDiv);
    const get = (selector) => bar.querySelector(selector);
    const pair = (id) => ({ input: get(`input[data-id="${id}"]`), output: get(`output[data-id="${id}"]`) });
    return {
        signalDiv,
        errorDiv,
        carrierSelect: get('select[data-id="carrier"]'),
        message: pair("message"),
        depth: pair("depth"),
        amplitudeSelect: get('select[data-id="amplitude"]'),
        r: pair("r"),
        c: pair("c"),
        diodeSelect: get('select[data-id="diode"]'),
        noise: pair("noise"),
        summary: get('span[data-id="summary"]')
    };
}

async function envelopeDetectorChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Simulate a diode envelope detector (diode, then R and C in parallel) and chart it with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Circuit simulation (plain JavaScript, no library needed) ---

    // The diode detector, one time step dt at a time. The diode conducts only while the input is more than
    // one diode drop above the capacitor voltage; then it charges C up to (input - drop). This model treats the
    // diode and the source as having no resistance, so C charges instantly. Otherwise the diode is off and C
    // discharges through R: the voltage falls by a factor exp(-dt / RC) each step.
    // Returns the output voltage at each step, and whether the diode conducted then.
    function diodeDetector(input, dt, rc, diodeDrop) {
        const decay = Math.exp(-dt / rc);
        const output = new Array(input.length);
        const conducting = new Array(input.length);
        let v = 0; // capacitor voltage, starting discharged
        for (let n = 0; n < input.length; n++) {
            const held = v * decay;
            const charged = input[n] - diodeDrop;
            conducting[n] = charged > held;
            v = conducting[n] ? charged : held;
            output[n] = v;
        }
        return { output, conducting };
    }

    // Measure the result: the carrier ripple (how far C droops between two charging pulses) and the
    // diagonal clipping (how far the output stays above the true envelope because C can't discharge fast enough)
    function measure(output, conducting, envelope, diodeDrop, amplitude) {
        let rippleVolts = 0;
        let ripplePercent = 0;
        let clipVolts = 0;
        let segmentStart = -1;
        for (let n = 1; n < output.length; n++) {
            // Diagonal clipping: the output sits above the envelope less the diode drop (ignoring the troughs
            // that fall below the diode drop, where the output simply drops out)
            const target = envelope[n] - diodeDrop;
            if (target > 0.05 * amplitude) clipVolts = Math.max(clipVolts, output[n] - target);
            // Ripple: each stretch with the diode off, if it lasts no more than about one carrier cycle
            if (!conducting[n] && conducting[n - 1]) segmentStart = n - 1;
            if (conducting[n] && !conducting[n - 1] && segmentStart >= 0) {
                const length = n - 1 - segmentStart;
                const peak = output[segmentStart];
                if (length <= 1.5 * SAMPLES_PER_CYCLE && peak > 0.05 * amplitude) {
                    const droop = peak - output[n - 1];
                    rippleVolts = Math.max(rippleVolts, droop);
                    ripplePercent = Math.max(ripplePercent, (100 * droop) / peak);
                }
                segmentStart = -1;
            }
        }
        return { rippleVolts, ripplePercent, clipVolts };
    }

    // The largest RC that still follows a sine message of depth m at messageHz:
    // RC <= sqrt(1 - m^2) / (2 pi f m). Above it, the output cuts across the troughs (diagonal clipping).
    // A diode drop lowers the output by the same amount at the peaks and the troughs, which makes the
    // modulation the capacitor has to follow deeper: m becomes m A / (A - drop), so the limit gets tighter.
    function diagonalClippingLimit(messageHz, depth, amplitude, diodeDrop) {
        const m = amplitude > diodeDrop ? Math.min((depth * amplitude) / (amplitude - diodeDrop), 1) : 1;
        return m > 0 ? Math.sqrt(1 - m * m) / (2 * Math.PI * messageHz * m) : Infinity;
    }

    // --- Chart 1: the AM input, the true envelope and the detector output ---
    const top = await SciChartSurface.create(ui.signalDiv, { theme: new SciChartJsNavyTheme() });
    top.sciChartSurface.xAxes.add(new NumericAxis(top.wasmContext, { axisTitle: "Time (µs)" }));
    top.sciChartSurface.yAxes.add(
        new NumericAxis(top.wasmContext, {
            axisTitle: "Voltage (V)",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.05, 0.05)
        })
    );
    const inputSeries = new XyDataSeries(top.wasmContext, { dataSeriesName: "AM input", dataIsSortedInX: true });
    const envelopeSeries = new XyDataSeries(top.wasmContext, { dataSeriesName: "True envelope", dataIsSortedInX: true });
    const outputSeries = new XyDataSeries(top.wasmContext, { dataSeriesName: "Detector output", dataIsSortedInX: true });
    top.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(top.wasmContext, { dataSeries: inputSeries, stroke: "#50C7E0", strokeThickness: 1 }),
        new FastLineRenderableSeries(top.wasmContext, {
            dataSeries: envelopeSeries,
            stroke: "#FFFFFF",
            strokeThickness: 1.5,
            strokeDashArray: [6, 4]
        }),
        new FastLineRenderableSeries(top.wasmContext, { dataSeries: outputSeries, stroke: "#F48420", strokeThickness: 2.5 })
    );
    top.sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new LegendModifier({ showCheckboxes: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- Chart 2: the output minus the true envelope (the detector's error), in millivolts ---
    const lower = await SciChartSurface.create(ui.errorDiv, { theme: new SciChartJsNavyTheme() });
    lower.sciChartSurface.xAxes.add(new NumericAxis(lower.wasmContext, { axisTitle: "Time (µs)" }));
    lower.sciChartSurface.yAxes.add(
        new NumericAxis(lower.wasmContext, {
            axisTitle: "Error (mV)",
            autoRange: EAutoRange.Always,
            labelPrecision: 0,
            growBy: new NumberRange(0.1, 0.1)
        })
    );
    const errorSeries = new XyDataSeries(lower.wasmContext, {
        dataSeriesName: "Output minus true envelope",
        dataIsSortedInX: true
    });
    lower.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(lower.wasmContext, { dataSeries: errorSeries, stroke: "#F5E663", strokeThickness: 1.5 })
    );
    lower.sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new LegendModifier(),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- The controls ---
    const e12Value = (index, decadeStart) => E12[index % 12] * decadeStart * Math.pow(10, Math.floor(index / 12));
    const formatUnit = (value, units) => {
        for (const [scale, prefix] of units) {
            if (value >= scale * 0.9999) {
                const scaled = value / scale;
                return `${scaled < 10 ? Number(scaled.toPrecision(2)) : Math.round(scaled)} ${prefix}`;
            }
        }
        return `${value}`;
    };
    const ohms = (value) => formatUnit(value, [[1e3, "kΩ"], [1, "Ω"]]);
    const farads = (value) => formatUnit(value, [[1e-6, "µF"], [1e-9, "nF"], [1e-12, "pF"]]);
    const seconds = (value) => formatUnit(value, [[1e-3, "ms"], [1e-6, "µs"], [1e-9, "ns"]]);
    const hertz = (value) => formatUnit(value, [[1e6, "MHz"], [1e3, "kHz"], [1, "Hz"]]);

    function update() {
        const carrierHz = Number(ui.carrierSelect.value);
        const messageHz = MESSAGE_HZ[Number(ui.message.input.value)];
        const depth = Number(ui.depth.input.value) / 100;
        const amplitude = Number(ui.amplitudeSelect.value);
        const r = e12Value(Number(ui.r.input.value), 1000); // 1 kΩ to 100 kΩ
        const c = e12Value(Number(ui.c.input.value), 1e-10); // 100 pF to 100 nF
        const rc = r * c;
        const diodeDrop = Number(ui.diodeSelect.value);
        const noiseLevel = Number(ui.noise.input.value) / 100;
        ui.message.output.textContent = hertz(messageHz);
        ui.depth.output.textContent = `${Math.round(depth * 100)}%`;
        ui.r.output.textContent = ohms(r);
        ui.c.output.textContent = farads(c);
        ui.noise.output.textContent = noiseLevel > 0 ? `${Math.round(noiseLevel * 100)}%` : "off";

        const { t, input, envelope, dt } = makeAmSignal(carrierHz, messageHz, depth, amplitude, noiseLevel);
        const { output, conducting } = diodeDetector(input, dt, rc, diodeDrop);
        const micros = t.map((time) => time * 1e6);
        inputSeries.clear();
        inputSeries.appendRange(micros, input);
        envelopeSeries.clear();
        envelopeSeries.appendRange(micros, envelope);
        outputSeries.clear();
        outputSeries.appendRange(micros, output);
        errorSeries.clear();
        errorSeries.appendRange(
            micros,
            output.map((v, n) => (v - envelope[n]) * 1000)
        );
        top.sciChartSurface.zoomExtents();
        lower.sciChartSurface.zoomExtents();

        // The readout: RC against its two limits, what the simulation measured, and a verdict
        const limit = diagonalClippingLimit(messageHz, depth, amplitude, diodeDrop);
        // Measured on the same signal without noise, so noise peaks don't count as ripple or clipping
        const clean = noiseLevel > 0 ? makeAmSignal(carrierHz, messageHz, depth, amplitude, 0) : null;
        const sim = clean ? diodeDetector(clean.input, dt, rc, diodeDrop) : { output, conducting };
        const { rippleVolts, ripplePercent, clipVolts } = measure(sim.output, sim.conducting, envelope, diodeDrop, amplitude);
        let verdict;
        if (diodeDrop > 0 && amplitude * (1 - depth) < diodeDrop)
            verdict = "Diode drop too large: the troughs fall below it, so the output drops out";
        else if (limit === 0) verdict = "100% modulation: the output always clips close to the troughs";
        else if (clipVolts > 0.01 * amplitude) verdict = "RC too long: diagonal clipping (the output misses the troughs)";
        else if (ripplePercent > 10) verdict = "RC too short: large carrier ripple";
        else verdict = "OK: the output follows the envelope";
        ui.summary.textContent =
            `RC = ${seconds(rc)} · 1/fc = ${seconds(1 / carrierHz)} · ` +
            `diagonal-clipping limit ${limit === Infinity ? "none (no modulation)" : limit === 0 ? "0 (any RC clips)" : seconds(limit)} · ` +
            `ripple ${(rippleVolts * 1000).toFixed(0)} mV p-p (${ripplePercent.toFixed(1)}%) · ` +
            `clipping ${(Math.max(clipVolts, 0) * 1000).toFixed(0)} mV${noiseLevel > 0 ? " (measured without noise)" : ""} · ${verdict}`;
    }

    ui.carrierSelect.addEventListener("change", update);
    ui.amplitudeSelect.addEventListener("change", update);
    ui.diodeSelect.addEventListener("change", update);
    for (const control of [ui.message, ui.depth, ui.r, ui.c, ui.noise]) control.input.addEventListener("input", update);
    update();
    // #region_A_end
}

envelopeDetectorChart("scichart-root");
