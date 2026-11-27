import * as SciChart from "scichart";

// A simulated 19-channel scalp EEG on the international 10-20 system. It is generated, not recorded: no patient data.
// The background is band-limited noise with more power at low frequencies (roughly 1/f), spread over neighbouring
// electrodes so they are correlated, plus an alpha rhythm of about 10 Hz over the back of the head that appears when
// the eyes close, small beta and theta rhythms, and artefacts you can add (blink, muscle, electrode pop, mains hum).
// A seeded random generator makes the trace look the same every time.

// Electrodes in display order, front to back and left to right, with approximate positions on a flat head map
// (x: left -1 to right +1, y: back -1 to front +1). T7, T8, P7 and P8 were called T3, T4, T5 and T6 in the original 10-20 system.
const ELECTRODES = [
    { name: "Fp1", x: -0.25, y: 0.76 },
    { name: "Fp2", x: 0.25, y: 0.76 },
    { name: "F7", x: -0.65, y: 0.47 },
    { name: "F3", x: -0.33, y: 0.4 },
    { name: "Fz", x: 0, y: 0.38 },
    { name: "F4", x: 0.33, y: 0.4 },
    { name: "F8", x: 0.65, y: 0.47 },
    { name: "T7", x: -0.8, y: 0 },
    { name: "C3", x: -0.4, y: 0 },
    { name: "Cz", x: 0, y: 0 },
    { name: "C4", x: 0.4, y: 0 },
    { name: "T8", x: 0.8, y: 0 },
    { name: "P7", x: -0.65, y: -0.47 },
    { name: "P3", x: -0.33, y: -0.4 },
    { name: "Pz", x: 0, y: -0.38 },
    { name: "P4", x: 0.33, y: -0.4 },
    { name: "P8", x: 0.65, y: -0.47 },
    { name: "O1", x: -0.25, y: -0.76 },
    { name: "O2", x: 0.25, y: -0.76 }
];
const ELECTRODE_NAMES = ELECTRODES.map((electrode) => electrode.name);

// How strongly each source reaches each electrode (0 to 1)
const WEIGHTS = {
    // Alpha: strongest over the occipital and parietal electrodes
    alpha: { Fp: 0.06, F7: 0.1, F8: 0.1, F: 0.12, T7: 0.25, T8: 0.25, C: 0.3, P7: 0.6, P8: 0.6, P: 0.75, O: 1 },
    // Beta and theta: low-amplitude, central and frontal
    beta: { Fp: 0.5, F: 0.8, T: 0.5, C: 1, P: 0.6, O: 0.4 },
    theta: { Fz: 1, Cz: 0.9, F: 0.6, C: 0.6, Fp: 0.3, T: 0.3, P: 0.4, O: 0.3 },
    // A blink is picked up mainly by the electrodes just above the eyes
    blink: { Fp: 1, F7: 0.3, F8: 0.3, F: 0.25, T: 0.04, C: 0.05, P: 0.02, O: 0.01 },
    // Muscle: the jaw and forehead muscles under the temporal and frontal electrodes
    muscle: { T7: 1, T8: 1, F7: 0.9, F8: 0.9, Fp: 0.45, P7: 0.45, P8: 0.45, F: 0.25, Fz: 0.15, C: 0.15, P: 0.08, O: 0.08 }
};
// Looks up a weight by full name ("T7"), then by the letters of the name ("Fp", "F", "C", "P", "O", "T")
const weightOf = (table, name) => table[name] ?? table[name.replace(/[0-9z]+$/, "")] ?? table[name[0]] ?? 0;

function createEegSimulator(sampleRate, initial) {
    let seed = 20261127;
    const random = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());

    // A narrow-band rhythm: white noise through a two-pole resonator, scaled to unit RMS.
    // It waxes and wanes by itself, as real alpha does.
    const resonator = (frequency, bandwidth) => {
        const r = Math.exp((-Math.PI * bandwidth) / sampleRate);
        const a1 = 2 * r * Math.cos((2 * Math.PI * frequency) / sampleRate);
        const a2 = -r * r;
        const variance = (1 - a2) / ((1 + a2) * ((1 - a2) * (1 - a2) - a1 * a1));
        const scale = 1 / Math.sqrt(variance);
        let y1 = 0;
        let y2 = 0;
        return () => {
            const y = a1 * y1 + a2 * y2 + gaussian();
            y2 = y1;
            y1 = y;
            return y * scale;
        };
    };

    // Background: for each electrode site, white noise through one-pole low-pass filters at 1, 3, 9 and 27 Hz,
    // weighted towards the low ones, gives a spectrum that falls with frequency like real EEG
    const CORNERS = [1, 3, 9, 27];
    const CORNER_WEIGHTS = [0.55, 0.8, 0.6, 0.35];
    const poles = CORNERS.map((fc) => Math.exp((-2 * Math.PI * fc) / sampleRate));
    const poleScales = poles.map((a) => Math.sqrt((1 + a) / (1 - a)));
    const norm = 1 / Math.sqrt(CORNER_WEIGHTS.reduce((sum, w) => sum + w * w, 0));
    const lowPassState = ELECTRODES.map(() => CORNERS.map(() => 0));

    // Neighbouring electrodes see overlapping patches of cortex, so mix each site's noise into its neighbours
    const mixing = ELECTRODES.map((a) => {
        const row = ELECTRODES.map((b) => Math.exp(-((a.x - b.x) ** 2 + (a.y - b.y) ** 2) / (2 * 0.3 * 0.3)));
        const length = Math.sqrt(row.reduce((sum, w) => sum + w * w, 0));
        return row.map((w) => w / length);
    });

    const alphaCommon = resonator(10, 1.2);
    const alphaLeft = resonator(10, 1.2);
    const alphaRight = resonator(10, 1.2);
    const beta = resonator(20, 5);
    const theta = resonator(6, 2);
    const weights = Object.fromEntries(
        Object.keys(WEIGHTS).map((key) => [key, ELECTRODE_NAMES.map((name) => weightOf(WEIGHTS[key], name))])
    );
    const side = ELECTRODES.map((e) => Math.sign(e.x)); // -1 left, 0 midline, +1 right

    // Mains hum: the same on every electrode (the amplifier rejects most of it), plus a little that differs
    // between electrodes, and much more on one electrode with poor contact (T7)
    const mainsCommon = 20;
    const mainsLocal = ELECTRODE_NAMES.map((name) => (name === "T7" ? 25 : 2 + 2 * random()));
    const mainsPhase = ELECTRODE_NAMES.map(() => random() * 0.6);

    const state = {
        sample: 0,
        eyesClosed: initial.eyesClosed,
        alphaGain: initial.eyesClosed ? 1 : 0.2,
        mains: initial.mains, // Hz, 0 = off
        notch: initial.notch,
        events: []
    };

    // A second-order notch filter at the mains frequency, one per electrode
    let notch = null;
    const makeNotch = () => {
        const f0 = state.mains || 50;
        const w0 = (2 * Math.PI * f0) / sampleRate;
        const alpha = Math.sin(w0) / (2 * 30); // Q = 30: about 2 Hz wide at 50 or 60 Hz
        const a0 = 1 + alpha;
        notch = {
            b0: 1 / a0,
            b1: (-2 * Math.cos(w0)) / a0,
            b2: 1 / a0,
            a1: (-2 * Math.cos(w0)) / a0,
            a2: (1 - alpha) / a0,
            x1: new Float64Array(ELECTRODES.length),
            x2: new Float64Array(ELECTRODES.length),
            y1: new Float64Array(ELECTRODES.length),
            y2: new Float64Array(ELECTRODES.length)
        };
    };
    makeNotch();

    const background = new Float64Array(ELECTRODES.length);
    return {
        sampleRate,
        get time() {
            return state.sample / sampleRate;
        },
        setEyesClosed(closed) {
            if (closed === state.eyesClosed) return;
            state.eyesClosed = closed;
            // Closing or opening the eyes moves the eyeballs, which the frontal electrodes pick up
            state.events.push({ type: "eye", start: state.sample, size: closed ? 90 : -60, width: 0.2 });
        },
        blink() {
            state.events.push({ type: "eye", start: state.sample, size: 140, width: 0.11 });
        },
        muscle() {
            state.events.push({ type: "muscle", start: state.sample, end: state.sample + 2 * sampleRate });
        },
        pop(name) {
            state.events.push({ type: "pop", start: state.sample, electrode: ELECTRODE_NAMES.indexOf(name), size: 160 });
        },
        setMains(hz) {
            state.mains = hz;
            makeNotch();
        },
        setNotch(on) {
            state.notch = on;
            makeNotch();
        },
        // Writes the next `count` samples of each electrode, in µV, into out[electrode][offset ...]
        generate(count, out, offset) {
            for (let i = 0; i < count; i++) {
                const n = state.sample++;
                const t = n / sampleRate;
                // Alpha fades in over about half a second when the eyes close, and is blocked faster when they open
                const target = state.eyesClosed ? 1 : 0.2;
                const tau = state.eyesClosed ? 0.5 : 0.15;
                state.alphaGain += (target - state.alphaGain) * (1 - Math.exp(-1 / (tau * sampleRate)));

                for (let e = 0; e < ELECTRODES.length; e++) {
                    const s = lowPassState[e];
                    let value = 0;
                    for (let k = 0; k < CORNERS.length; k++) {
                        s[k] = poles[k] * s[k] + (1 - poles[k]) * gaussian();
                        value += CORNER_WEIGHTS[k] * s[k] * poleScales[k];
                    }
                    background[e] = value * norm;
                }
                const ac = alphaCommon();
                const left = 0.75 * ac + 0.66 * alphaLeft();
                const right = 0.75 * ac + 0.66 * alphaRight();
                const b = beta() * (state.eyesClosed ? 3.5 : 4.5);
                const th = theta() * 2;

                // Artefacts active at this sample
                let eye = 0;
                let muscleEnvelope = 0;
                const pops = [];
                for (const event of state.events) {
                    const dt = (n - event.start) / sampleRate;
                    if (event.type === "eye") eye += event.size * (dt / event.width) * Math.exp(1 - dt / event.width);
                    else if (event.type === "muscle" && n < event.end)
                        muscleEnvelope = Math.max(muscleEnvelope, Math.min(1, dt / 0.15, (event.end - n) / sampleRate / 0.15));
                    else if (event.type === "pop") pops.push([event.electrode, event.size * Math.exp(-dt / 0.25)]);
                }
                if (n % sampleRate === 0) state.events = state.events.filter((event) => (n - event.start) / sampleRate < 3);
                const mainsWave = state.mains ? Math.sin(2 * Math.PI * state.mains * t) : 0;

                for (let e = 0; e < ELECTRODES.length; e++) {
                    let background_e = 0;
                    const row = mixing[e];
                    for (let k = 0; k < ELECTRODES.length; k++) background_e += row[k] * background[k];
                    const alpha = side[e] < 0 ? left : side[e] > 0 ? right : 0.5 * (left + right);
                    let v =
                        6 * background_e +
                        15 * state.alphaGain * weights.alpha[e] * alpha +
                        weights.beta[e] * b +
                        weights.theta[e] * th +
                        weights.blink[e] * eye;
                    if (muscleEnvelope > 0) v += 20 * muscleEnvelope * weights.muscle[e] * gaussian();
                    for (const [electrode, size] of pops) if (electrode === e) v += size;
                    if (state.mains) {
                        v += mainsCommon * mainsWave;
                        v += mainsLocal[e] * Math.sin(2 * Math.PI * state.mains * t + mainsPhase[e]);
                    }
                    if (state.notch) {
                        const f = notch;
                        const y = f.b0 * v + f.b1 * f.x1[e] + f.b2 * f.x2[e] - f.a1 * f.y1[e] - f.a2 * f.y2[e];
                        f.x2[e] = f.x1[e];
                        f.x1[e] = v;
                        f.y2[e] = f.y1[e];
                        f.y1[e] = y;
                        v = y;
                    }
                    out[e][offset + i] = v;
                }
            }
        }
    };
}

// Relative power in each frequency band, from the last 2 seconds of one channel (Hann window and an FFT)
const BANDS = [
    { name: "Delta", symbol: "δ", low: 0.5, high: 4 },
    { name: "Theta", symbol: "θ", low: 4, high: 8 },
    { name: "Alpha", symbol: "α", low: 8, high: 13 },
    { name: "Beta", symbol: "β", low: 13, high: 30 },
    { name: "Gamma", symbol: "γ", low: 30, high: 45 }
];
function bandPowers(signal, sampleRate) {
    const n = signal.length; // a power of 2
    const re = new Float64Array(n);
    const im = new Float64Array(n);
    let mean = 0;
    for (let i = 0; i < n; i++) mean += signal[i] / n;
    for (let i = 0; i < n; i++) re[i] = (signal[i] - mean) * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1)));
    for (let i = 1, j = 0; i < n; i++) {
        let bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) {
            [re[i], re[j]] = [re[j], re[i]];
        }
    }
    for (let size = 2; size <= n; size <<= 1) {
        const angle = (-2 * Math.PI) / size;
        for (let start = 0; start < n; start += size) {
            for (let k = 0; k < size / 2; k++) {
                const wr = Math.cos(angle * k);
                const wi = Math.sin(angle * k);
                const a = start + k;
                const b = a + size / 2;
                const tr = re[b] * wr - im[b] * wi;
                const ti = re[b] * wi + im[b] * wr;
                re[b] = re[a] - tr;
                im[b] = im[a] - ti;
                re[a] += tr;
                im[a] += ti;
            }
        }
    }
    const powers = BANDS.map(() => 0);
    let total = 0;
    for (let k = 1; k < n / 2; k++) {
        const f = (k * sampleRate) / n;
        const p = re[k] * re[k] + im[k] * im[k];
        BANDS.forEach((band, index) => {
            if (f >= band.low && f < band.high) {
                powers[index] += p;
                total += p;
            }
        });
    }
    return powers.map((p) => (total > 0 ? (100 * p) / total : 0));
}

// The page's div holds two rows of controls, a note, the EEG chart and a side panel with live figures
// and a band-power chart. In your app these can be any HTML elements.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#0E1A2E;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const barStyle = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 14px; padding:5px 12px; color:#ffffff; background:#22365B;" + font;
    const select = (id, label, options, value) =>
        `<label>${label} <select data-id="${id}" style="font:inherit">` +
        options.map(([v, text]) => `<option value="${v}"${v === value ? " selected" : ""}>${text}</option>`).join("") +
        `</select></label>`;
    const button = (id, text) =>
        `<button data-id="${id}" type="button" style="font:inherit; padding:2px 12px; border-radius:12px; border:1px solid #50C7E0; ` +
        `background:transparent; color:#ffffff; cursor:pointer">${text}</button>`;

    const bar1 = document.createElement("div");
    bar1.style.cssText = barStyle;
    bar1.innerHTML =
        select("montage", "Montage", [["referential", "Referential (average)"], ["bipolar", "Bipolar (double banana)"]], "referential") +
        select("mode", "Display", [["scroll", "Scroll"], ["sweep", "Sweep"]], "scroll") +
        select("rate", "Sample rate", [["256", "256 Hz"], ["500", "500 Hz"], ["1000", "1,000 Hz"]], "256") +
        select("seconds", "Time base", [["5", "5 s/page"], ["10", "10 s/page"], ["20", "20 s/page"]], "10") +
        select("sensitivity", "Sensitivity", [["3", "3 µV/mm"], ["5", "5 µV/mm"], ["7", "7 µV/mm"], ["10", "10 µV/mm"], ["15", "15 µV/mm"], ["20", "20 µV/mm"]], "7");
    const bar2 = document.createElement("div");
    bar2.style.cssText = barStyle + "border-top:1px solid #2F4670;";
    bar2.innerHTML =
        button("eyes", "Close eyes") +
        `<span>Artefact</span>` +
        button("blink", "Blink") +
        button("muscle", "Muscle") +
        button("pop", "Electrode pop") +
        select("mains", "Mains hum", [["0", "Off"], ["50", "50 Hz"], ["60", "60 Hz"]], "0") +
        `<label><input data-id="notch" type="checkbox"> Notch filter</label>` +
        button("pause", "Pause");
    const note = document.createElement("div");
    note.setAttribute("aria-live", "polite");
    note.style.cssText = "padding:4px 12px; color:#C8D3E8; min-height:20px; background:#22365B; border-top:1px solid #2F4670;" + font + "font-size:13px;";
    note.textContent = "Simulated EEG, not a patient recording. Eyes open: low-voltage, mixed-frequency activity.";

    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const chartDiv = document.createElement("div");
    chartDiv.id = divElementId + "-eeg";
    chartDiv.style.cssText = "flex:1 1 480px; min-height:480px;";
    const panel = document.createElement("div");
    panel.style.cssText = "flex:0 1 240px; display:flex; flex-direction:column; padding:8px 10px; gap:6px; color:#ffffff;" + font + "font-size:13px;";
    const stats = document.createElement("div");
    stats.setAttribute("role", "status");
    stats.style.cssText = "line-height:1.5;";
    const bandLabel = document.createElement("div");
    bandLabel.innerHTML = select("bandChannel", "Band power", [], "");
    const bandDiv = document.createElement("div");
    bandDiv.id = divElementId + "-bands";
    bandDiv.style.cssText = "flex:1; min-height:200px;";
    panel.append(stats, bandLabel, bandDiv);
    body.append(chartDiv, panel);
    root.append(bar1, bar2, note, body);

    const get = (selector) => root.querySelector(selector);
    return {
        chartDiv,
        bandDiv,
        note,
        stats,
        controls: Object.fromEntries(
            ["montage", "mode", "rate", "seconds", "sensitivity", "eyes", "blink", "muscle", "pop", "mains", "notch", "pause", "bandChannel"].map(
                (id) => [id, get(`[data-id="${id}"]`)]
            )
        )
    };
}

// A small column chart of the relative power in each band
async function createBandPowerChart(div) {
    const { SciChartSurface, NumericAxis, FastColumnRenderableSeries, XyDataSeries, NumberRange, EAutoRange, SciChartJsNavyTheme } = SciChart;
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(div, { theme: new SciChartJsNavyTheme() });
    const xAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Never,
        visibleRange: new NumberRange(-0.6, BANDS.length - 0.4),
        autoTicks: false,
        majorDelta: 1,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        labelStyle: { fontSize: 16 }
    });
    xAxis.labelProvider.formatLabel = (value) => BANDS[Math.round(value)]?.symbol ?? "";
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(0, 100),
            axisTitle: "% of power",
            axisTitleStyle: { fontSize: 12 },
            labelStyle: { fontSize: 11 },
            labelPrecision: 0,
            maxAutoTicks: 5,
            drawMinorGridLines: false
        })
    );
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: BANDS.map((_, i) => i),
        yValues: BANDS.map(() => 0)
    });
    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            dataSeries,
            fill: "#50C7E0CC",
            stroke: "#50C7E0",
            cornerRadius: 4,
            dataPointWidth: 0.7,
            dataLabels: { style: { fontSize: 15 }, color: "#ffffff", precision: 0 }
        })
    );
    return {
        sciChartSurface,
        update: (values) => values.forEach((value, index) => dataSeries.update(index, value))
    };
}

async function eegChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A live 19-channel EEG with SciChart.js: every channel on one chart, each in its own lane on a vertically
    // stacked y-axis, all sharing one time axis. New samples are appended to FIFO data series every frame.
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        VerticalLineAnnotation,
        ELabelPlacement,
        NumberRange,
        Thickness,
        EAutoRange,
        EAxisAlignment,
        EXyDirection,
        LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const MAX_SECONDS = 20; // longest time base offered
    const PX_PER_MM = 96 / 25.4; // CSS pixels per millimetre, to turn µV/mm into an axis range

    // A montage is the list of channels: each one is the voltage of one electrode minus another,
    // or minus the average of all electrodes ("Avg")
    const MONTAGES = {
        referential: ELECTRODE_NAMES.map((name) => [name, "Avg"]),
        // Longitudinal bipolar ("double banana"): chains from front to back, left temporal, left parasagittal,
        // midline, right parasagittal, right temporal
        bipolar: [
            ["Fp1", "F7"], ["F7", "T7"], ["T7", "P7"], ["P7", "O1"],
            ["Fp1", "F3"], ["F3", "C3"], ["C3", "P3"], ["P3", "O1"],
            ["Fz", "Cz"], ["Cz", "Pz"],
            ["Fp2", "F4"], ["F4", "C4"], ["C4", "P4"], ["P4", "O2"],
            ["Fp2", "F8"], ["F8", "T8"], ["T8", "P8"], ["P8", "O2"]
        ]
    };
    const COLORS = { left: "#50C7E0", midline: "#E2E8F0", right: "#F6AD55" };
    const sideOf = ([a, b]) => {
        const digits = (a + b).replace(/[^0-9]/g, "");
        if (!digits) return "midline";
        return Number(digits[digits.length - 1]) % 2 === 1 ? "left" : "right"; // odd numbers are on the left
    };

    const settings = { montage: "referential", sweeping: false, sampleRate: 256, seconds: 10, sensitivity: 7, eyesClosed: false, mains: 0, notch: false };

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(ui.chartDiv, {
        theme: new SciChartJsNavyTheme(),
        padding: new Thickness(8, 16, 4, 4)
    });

    // One shared time axis, with a gridline every second as on an EEG page
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "Time (s)",
        autoRange: EAutoRange.Never,
        autoTicks: false,
        majorDelta: 1,
        minorDelta: 0.2,
        drawMajorBands: false,
        labelPrecision: 0,
        cursorLabelPrecision: 2,
        majorGridLineStyle: { color: "#FFFFFF30", strokeThickness: 1 },
        minorGridLineStyle: { color: "#FFFFFF12", strokeThickness: 1 }
    });
    sciChartSurface.xAxes.add(xAxis);

    // Stack the y-axes down the left side: each channel gets an equal-height lane
    sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy = new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();

    let channels = []; // { plus, minus, label, line, dataSeries }
    let simulator;
    let history; // the last MAX_SECONDS of every electrode, so a new montage or time base can redraw at once
    let historySize = 0;
    let total = 0; // samples generated so far
    let sweepStart = 0; // sample at the left edge of the first sweep
    let scratchX = new Float64Array(0);
    let scratchY = new Float64Array(0);
    let scratchAvg = new Float64Array(0);

    // One y-axis and one line per channel. EEG is drawn with negative voltage upwards, by convention.
    function buildChannels() {
        sciChartSurface.renderableSeries.clear(true);
        sciChartSurface.yAxes.clear(true);
        channels = MONTAGES[settings.montage].map(([plus, minus], index) => {
            const color = COLORS[sideOf([plus, minus === "Avg" ? "" : minus])];
            const yAxis = new NumericAxis(wasmContext, {
                id: `ch${index}`,
                axisAlignment: EAxisAlignment.Left,
                axisTitle: `${plus}-${minus}`,
                axisTitleStyle: { color, fontSize: 12, rotation: 0 },
                autoRange: EAutoRange.Never,
                flippedCoordinates: true, // negative up
                drawLabels: false,
                drawMajorTickLines: false,
                drawMinorTickLines: false,
                drawMajorGridLines: false,
                drawMinorGridLines: false,
                drawMajorBands: false
            });
            sciChartSurface.yAxes.add(yAxis);
            const line = new FastLineRenderableSeries(wasmContext, { yAxisId: yAxis.id, stroke: color, strokeThickness: 1 });
            sciChartSurface.renderableSeries.add(line);
            return { plus: ELECTRODE_NAMES.indexOf(plus), minus: minus === "Avg" ? -1 : ELECTRODE_NAMES.indexOf(minus), label: `${plus}-${minus}`, line, yAxis };
        });
        applySensitivity();
    }

    // Sensitivity in µV/mm: a lane h mm tall shows h × sensitivity µV, centred on zero
    function applySensitivity() {
        const laneMm = (ui.chartDiv.clientHeight - 50) / Math.max(1, channels.length) / PX_PER_MM; // 50 px: time axis and padding
        const half = (laneMm * settings.sensitivity) / 2;
        channels.forEach((channel) => (channel.yAxis.visibleRange = new NumberRange(-half, half)));
    }

    // New FIFO data series for every channel. fifoCapacity keeps one page of samples and discards older ones;
    // fifoSweeping wraps round and overwrites from the left, like a patient monitor.
    function startSeries() {
        const capacity = settings.seconds * settings.sampleRate;
        sweepStart = total - capacity;
        channels.forEach((channel) => {
            const old = channel.line.dataSeries;
            channel.line.dataSeries = new XyDataSeries(wasmContext, {
                dataSeriesName: channel.label,
                fifoCapacity: capacity,
                fifoSweeping: settings.sweeping,
                fifoSweepingGap: settings.sweeping ? Math.round(capacity / 50) : undefined,
                isSorted: !settings.sweeping,
                containsNaN: false
            });
            old?.delete();
        });
        pushToChart(total - capacity, total); // redraw the last page at once
        showWindow();
    }

    // Append samples [from, to) of every channel, as typed arrays, in one call per channel
    function pushToChart(from, to) {
        const count = to - from;
        const capacity = settings.seconds * settings.sampleRate;
        const x = scratchX.subarray(0, count);
        const avg = scratchAvg.subarray(0, count);
        for (let i = 0; i < count; i++) {
            const n = from + i;
            x[i] = settings.sweeping ? ((n - sweepStart) % capacity) / settings.sampleRate : n / settings.sampleRate;
            let sum = 0;
            for (let e = 0; e < history.length; e++) sum += history[e][n % historySize];
            avg[i] = sum / history.length;
        }
        const y = scratchY.subarray(0, count);
        for (const channel of channels) {
            const plus = history[channel.plus];
            const minus = channel.minus >= 0 ? history[channel.minus] : null;
            for (let i = 0; i < count; i++) {
                const j = (from + i) % historySize;
                y[i] = plus[j] - (minus ? minus[j] : avg[i]);
            }
            channel.line.dataSeries.appendRange(x, y);
        }
    }

    // Scroll: the window follows the newest sample. Sweep: it stays still and the trace wraps round.
    function showWindow() {
        const now = total / settings.sampleRate;
        xAxis.visibleRange = settings.sweeping
            ? new NumberRange(0, settings.seconds)
            : new NumberRange(now - settings.seconds, now);
    }

    // Generate (or, in your app, receive) samples and keep them in the history ring buffer
    function addSamples(count) {
        const offset = total % historySize;
        const first = Math.min(count, historySize - offset);
        simulator.generate(first, history, offset);
        if (count > first) simulator.generate(count - first, history, 0);
        total += count;
    }

    // A new sample rate starts a new recording
    function start(sampleRate) {
        settings.sampleRate = sampleRate;
        simulator = createEegSimulator(sampleRate, settings);
        historySize = MAX_SECONDS * sampleRate;
        history = ELECTRODE_NAMES.map(() => new Float64Array(historySize));
        scratchX = new Float64Array(historySize);
        scratchY = new Float64Array(historySize);
        scratchAvg = new Float64Array(historySize);
        total = 0;
        addSamples(historySize); // start with a full history, so every time base opens on a full page
        clearMarkers();
        startSeries();
    }

    // Event markers, as an EEG technologist adds them: a labelled line at the moment of each event
    let markers = [];
    function addMarker(text) {
        const annotation = new VerticalLineAnnotation({
            yAxisId: "ch0",
            stroke: "#FFFFFF90",
            strokeDashArray: [4, 4],
            strokeThickness: 1,
            showLabel: true,
            labelPlacement: ELabelPlacement.Axis,
            labelValue: text,
            axisLabelFill: "#22365B",
            axisLabelStroke: "#FFFFFF"
        });
        markers.push({ sample: total, annotation });
        sciChartSurface.annotations.add(annotation);
        placeMarkers();
    }
    function placeMarkers() {
        const capacity = settings.seconds * settings.sampleRate;
        markers = markers.filter((marker) => {
            const keep = total - marker.sample < capacity;
            if (!keep) sciChartSurface.annotations.remove(marker.annotation, true);
            return keep;
        });
        for (const marker of markers) {
            const n = marker.sample;
            marker.annotation.x1 = settings.sweeping ? ((n - sweepStart) % capacity) / settings.sampleRate : n / settings.sampleRate;
        }
    }
    function clearMarkers() {
        markers.forEach((marker) => sciChartSurface.annotations.remove(marker.annotation, true));
        markers = [];
    }

    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showYLine: false,
            tooltipDataTemplate: (seriesInfos) => seriesInfos.map((info) => `${info.seriesName}: ${info.yValue.toFixed(0)} µV`)
        }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    );

    buildChannels();
    start(settings.sampleRate);

    // The update loop: once per animation frame, add the samples that have arrived since the last frame
    let isPaused = false;
    let lastTime = performance.now();
    let carry = 0;
    let frameId = 0;
    const perf = { appendMs: 0, frames: 0, redraws: 0, since: performance.now() };
    sciChartSurface.rendered.subscribe(() => perf.redraws++);
    const onFrame = (time) => {
        frameId = requestAnimationFrame(onFrame);
        const due = Math.min((Math.max(0, time - lastTime) * settings.sampleRate) / 1000, settings.sampleRate / 4) + carry;
        lastTime = time;
        if (isPaused) return;
        const count = Math.floor(due);
        carry = due - count;
        if (count <= 0) return;
        const t0 = performance.now();
        addSamples(count);
        sciChartSurface.suspendUpdates(); // one redraw for all channels
        pushToChart(total - count, total);
        showWindow();
        placeMarkers();
        sciChartSurface.resumeUpdates();
        perf.appendMs += performance.now() - t0;
        perf.frames++;
    };
    frameId = requestAnimationFrame(onFrame);
    sciChartSurface.addDeletable({ delete: () => cancelAnimationFrame(frameId) });
    // #region_A_end

    // --- Controls, live figures and the band-power chart ---
    const c = ui.controls;
    const bands = await createBandPowerChart(ui.bandDiv);
    sciChartSurface.addDeletable({ delete: () => bands.sciChartSurface.delete() });

    const fillBandChannels = (preferred) => {
        c.bandChannel.innerHTML = channels.map((channel, i) => `<option value="${i}">${channel.label}</option>`).join("");
        const index = channels.findIndex((channel) => channel.label === preferred);
        c.bandChannel.value = String(index >= 0 ? index : 0);
    };
    fillBandChannels("O1-Avg");

    const setNote = (text) => (ui.note.textContent = text);
    c.montage.onchange = () => {
        settings.montage = c.montage.value;
        buildChannels();
        startSeries();
        fillBandChannels(settings.montage === "bipolar" ? "P3-O1" : "O1-Avg");
        setNote(
            settings.montage === "bipolar"
                ? "Bipolar: each channel is one electrode minus the next one back. A local event deflects two neighbouring channels in opposite directions (phase reversal)."
                : "Referential: each channel is one electrode minus the average of all 19. A local event is largest in its own channel."
        );
    };
    c.mode.onchange = () => {
        settings.sweeping = c.mode.value === "sweep";
        startSeries();
        placeMarkers();
    };
    c.rate.onchange = () => {
        start(Number(c.rate.value));
        updateStats();
    };
    c.seconds.onchange = () => {
        settings.seconds = Number(c.seconds.value);
        startSeries();
        placeMarkers();
        updateStats();
    };
    c.sensitivity.onchange = () => {
        settings.sensitivity = Number(c.sensitivity.value);
        applySensitivity();
    };
    c.eyes.onclick = () => {
        const eyesClosed = (settings.eyesClosed = !settings.eyesClosed);
        simulator.setEyesClosed(eyesClosed);
        c.eyes.textContent = eyesClosed ? "Open eyes" : "Close eyes";
        c.eyes.style.background = eyesClosed ? "#50C7E0" : "transparent";
        c.eyes.style.color = eyesClosed ? "#14233C" : "#ffffff";
        addMarker(eyesClosed ? "Eyes closed" : "Eyes open");
        setNote(
            eyesClosed
                ? "Eyes closed: a 10 Hz alpha rhythm builds up over the back of the head (O1, O2, P3, P4) within a second."
                : "Eyes open: the alpha rhythm is blocked (attenuated). Reactivity like this is a sign of a normal background."
        );
    };
    c.blink.onclick = () => {
        simulator.blink();
        addMarker("Blink");
        setNote("Blink: a large, slow wave at Fp1 and Fp2 (the eyeball is a dipole that rolls upwards), fading fast towards the back.");
    };
    c.muscle.onclick = () => {
        simulator.muscle();
        addMarker("Muscle");
        setNote("Muscle: 2 s of fast, spiky activity at the temporal and frontal electrodes (F7, F8, T7, T8), as when clenching the jaw.");
    };
    const POP_ELECTRODES = ["T8", "C3", "O2", "F4"];
    let popCount = 0;
    c.pop.onclick = () => {
        const name = POP_ELECTRODES[popCount++ % POP_ELECTRODES.length];
        simulator.pop(name);
        addMarker(`Pop ${name}`);
        setNote(`Electrode pop at ${name}: a sudden step that fades away, only in channels that use ${name}. No field spreads to its neighbours.`);
    };
    c.mains.onchange = () => {
        const hz = (settings.mains = Number(c.mains.value));
        simulator.setMains(hz);
        setNote(
            hz
                ? `${hz} Hz mains hum: a fine, even thickening of the trace, worst in channels that use T7, which has a poor contact here. Hum common to all electrodes cancels.`
                : "Mains hum off."
        );
    };
    c.notch.onchange = () => {
        settings.notch = c.notch.checked;
        simulator.setNotch(settings.notch);
        setNote(c.notch.checked ? "Notch filter on: removes a narrow band around the mains frequency, and leaves the EEG almost untouched." : "Notch filter off.");
    };
    const showPaused = () => {
        c.pause.textContent = isPaused ? "Resume" : "Pause";
        c.pause.style.background = isPaused ? "#50C7E0" : "transparent";
        c.pause.style.color = isPaused ? "#14233C" : "#ffffff";
    };
    c.pause.onclick = () => {
        isPaused = !isPaused;
        if (!isPaused) showWindow();
        showPaused();
    };
    // Zooming or panning pauses the chart, so the live update doesn't undo it
    const pauseForZoom = () => {
        if (isPaused) return;
        isPaused = true;
        showPaused();
    };
    ui.chartDiv.addEventListener("wheel", pauseForZoom);
    ui.chartDiv.addEventListener("pointerdown", pauseForZoom);

    // Keep µV/mm true when the chart is resized
    const resizeObserver = new ResizeObserver(() => applySensitivity());
    resizeObserver.observe(ui.chartDiv);
    sciChartSurface.addDeletable({ delete: () => resizeObserver.disconnect() });

    // Live figures, and the band powers four times a second
    const format = (value) => Math.round(value).toLocaleString("en");
    function updateStats() {
        const seconds = (performance.now() - perf.since) / 1000;
        const pointsPerSecond = channels.length * settings.sampleRate;
        ui.stats.innerHTML =
            `<div><b>${format(pointsPerSecond)}</b> points/s</div>` +
            `<div style="opacity:0.8">${channels.length} channels × ${format(settings.sampleRate)} Hz</div>` +
            `<div><b>${format(pointsPerSecond * settings.seconds)}</b> points on screen</div>` +
            `<div><b>${format(perf.redraws / seconds)}</b> redraws/s · append ${(perf.appendMs / Math.max(1, perf.frames)).toFixed(2)} ms</div>`;
        perf.redraws = 0;
        perf.frames = 0;
        perf.appendMs = 0;
        perf.since = performance.now();
    }
    const statsTimer = setInterval(updateStats, 1000);
    const fftSize = () => 1 << Math.ceil(Math.log2(2 * settings.sampleRate));
    const bandTimer = setInterval(() => {
        if (isPaused) return;
        const channel = channels[Number(c.bandChannel.value)] ?? channels[0];
        const n = fftSize();
        const signal = new Float64Array(n);
        for (let i = 0; i < n; i++) {
            const j = (total - n + i) % historySize;
            let reference = 0;
            if (channel.minus >= 0) reference = history[channel.minus][j];
            else {
                for (let e = 0; e < history.length; e++) reference += history[e][j];
                reference /= history.length;
            }
            signal[i] = history[channel.plus][j] - reference;
        }
        bands.update(bandPowers(signal, settings.sampleRate));
    }, 250);
    sciChartSurface.addDeletable({
        delete: () => {
            clearInterval(statsTimer);
            clearInterval(bandTimer);
        }
    });
    updateStats();
}

eegChart("scichart-root");
