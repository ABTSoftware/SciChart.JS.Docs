import * as SciChart from "scichart";

// Simulated heart rate variability. Sample data only: the heartbeats come from a simple model, not from a person,
// and the demo is for learning how HRV is measured and charted, not for judging anyone's health.
//
// The model: each RR interval (the time from one heartbeat to the next, in ms) is a resting value plus three slow
// waves and a little noise:
// - respiratory sinus arrhythmia: the heart speeds up as you breathe in and slows as you breathe out;
// - a wave near 0.1 Hz (about every 10 s) from the blood-pressure reflex (the baroreflex);
// - a very slow drift;
// - random beat-to-beat noise.
// Each beat is drawn as an ECG-like trace. A seeded random generator makes the demo look the same every time it loads.
const ECG_RATE = 250; // ECG samples per second
const ECG_SECONDS = 5; // seconds of ECG on screen
const TACHOGRAM_SECONDS = 120; // seconds of RR intervals on screen
const WINDOW_SECONDS = 60; // the analysis window. The standard short-term recording is 5 minutes; 1 minute keeps the demo quick
const RESAMPLE_HZ = 4; // the RR series is resampled evenly at 4 Hz before its spectrum is taken

// The three states. rr: resting RR interval (ms); breath: breaths per minute; resp, baro, drift, noise: sizes (ms)
const STATES = {
    rest: { label: "Rest", rr: 850, breath: 15, resp: 38, baro: 32, drift: 22, noise: 9 },
    exercise: { label: "Exercise", rr: 480, breath: 21, resp: 4, baro: 3, drift: 5, noise: 2.5 },
    slow: { label: "Slow breathing (6/min)", rr: 830, breath: 6, resp: 130, baro: 8, drift: 18, noise: 9 }
};

let seed = 20261127;
function random() {
    seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
}
// Roughly Gaussian noise with a standard deviation of 1
const gaussian = () => (random() + random() + random() - 1.5) * 2;

// --- The heartbeat generator: beat times and RR intervals, easing smoothly from one state to the next ---
function createHeart() {
    const params = { ...STATES.rest };
    let target = STATES.rest;
    let respPhase = 0; // the breathing cycle, in turns
    let baroPhase = 0.3;
    let noise = 0;
    let lastBeat = 0;
    let ectopicQueued = false;
    const beats = []; // { t: R-peak time (s), rr: interval before it (ms), ectopic: boolean }
    return {
        beats,
        setState(name) {
            target = STATES[name];
        },
        queueEctopic() {
            ectopicQueued = true;
        },
        // Adds beats until the last one is after time `until` (s)
        extend(until) {
            while (lastBeat < until) {
                const rrSeconds = params.rr / 1000;
                // Ease each parameter towards the chosen state, with a time constant of about 4 s
                const k = 1 - Math.exp(-rrSeconds / 4);
                for (const key of ["rr", "breath", "resp", "baro", "drift", "noise"]) {
                    params[key] += (target[key] - params[key]) * k;
                }
                respPhase += (params.breath / 60) * rrSeconds;
                baroPhase += 0.1 * rrSeconds * (1 + 0.05 * gaussian());
                noise = 0.5 * noise + params.noise * gaussian();
                // The interval just ending was timed by the breathing cycle at its start, so the RR wave lags slightly
                const rr =
                    params.rr +
                    params.resp * Math.sin(2 * Math.PI * respPhase) +
                    params.baro * Math.sin(2 * Math.PI * baroPhase) +
                    params.drift * Math.sin((2 * Math.PI * lastBeat) / 47) +
                    noise;
                if (ectopicQueued) {
                    // A premature beat comes early, and the pause after it makes up the time (a compensatory pause)
                    ectopicQueued = false;
                    const early = Math.round(rr * 0.62);
                    beats.push({ t: lastBeat + early / 1000, rr: early, ectopic: true });
                    beats.push({ t: lastBeat + (2 * rr) / 1000, rr: Math.round(2 * rr - early), ectopic: false });
                    lastBeat += (2 * rr) / 1000;
                } else {
                    lastBeat += rr / 1000;
                    beats.push({ t: lastBeat, rr: Math.round(rr), ectopic: false });
                }
            }
            // Forget beats older than the tachogram
            while (beats.length && beats[0].t < until - TACHOGRAM_SECONDS - 10) beats.shift();
        },
        breathsPerMinute: () => params.breath
    };
}

// --- The ECG-like trace: each beat is a few bell-shaped waves around its R peak ---
const wave = (dt, centre, width, height) => height * Math.exp(-0.5 * ((dt - centre) / width) ** 2);
function ecgAt(beats, t) {
    let v = 0;
    for (let i = beats.length - 1; i >= 0; i--) {
        const beat = beats[i];
        const dt = t - beat.t;
        if (dt > 0.7) break;
        if (dt < -0.3) continue;
        if (beat.ectopic) {
            // A premature ventricular beat: no P wave, a wide QRS and a T wave the other way
            v += wave(dt, 0, 0.03, 1.25) + wave(dt, 0.06, 0.03, -0.45) + wave(dt, 0.3, 0.07, -0.35);
        } else {
            const qt = 0.27 * Math.sqrt(Math.max(beat.rr, 400) / 1000); // the T wave comes sooner at faster rates
            v +=
                wave(dt, -0.16, 0.025, 0.12) + // P
                wave(dt, -0.025, 0.008, -0.1) + // Q
                wave(dt, 0, 0.011, 1.1) + // R
                wave(dt, 0.028, 0.01, -0.25) + // S
                wave(dt, qt, 0.05, 0.3); // T
        }
    }
    return v;
}

// --- HRV measures from a list of beats ---
// Flags each interval that differs from the one before it by more than 20%, a common simple rule for finding
// ectopic beats and missed or extra detections. An ectopic beat flags the short interval, the long pause after it
// and the first normal interval after that.
function flagArtefacts(beats) {
    const flags = new Array(beats.length).fill(false);
    for (let i = 1; i < beats.length; i++) {
        if (Math.abs(beats[i].rr - beats[i - 1].rr) > 0.2 * beats[i - 1].rr) flags[i] = true;
    }
    return flags;
}

function hrvMeasures(beats, flags, clean) {
    const keep = beats.filter((_, i) => !(clean && flags[i]));
    const rr = keep.map((b) => b.rr);
    const n = rr.length;
    if (n < 3) return null;
    const mean = rr.reduce((s, x) => s + x, 0) / n;
    const sdnn = Math.sqrt(rr.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1));
    // Successive differences only between beats that were next to each other in the recording
    const diffs = [];
    for (let i = 1; i < beats.length; i++) {
        if (clean && (flags[i] || flags[i - 1])) continue;
        diffs.push(beats[i].rr - beats[i - 1].rr);
    }
    const rmssd = Math.sqrt(diffs.reduce((s, d) => s + d * d, 0) / Math.max(diffs.length, 1));
    const pnn50 = (100 * diffs.filter((d) => Math.abs(d) > 50).length) / Math.max(diffs.length, 1);
    return { meanHr: 60000 / mean, meanRR: mean, sdnn, rmssd, pnn50 };
}

// Power spectrum of the RR series (ms²/Hz) from 0 to 0.5 Hz: resample evenly, remove the mean, taper, transform
function rrSpectrum(beats, flags, clean, fromT, toT) {
    // Cleaning replaces flagged intervals by interpolating between good neighbours
    const points = beats.filter((_, i) => !(clean && flags[i])).map((b) => [b.t, b.rr]);
    const count = Math.floor((toT - fromT) * RESAMPLE_HZ);
    const samples = new Float64Array(count);
    let j = 0;
    for (let i = 0; i < count; i++) {
        const t = fromT + i / RESAMPLE_HZ;
        while (j < points.length - 2 && points[j + 1][0] < t) j++;
        const [t0, y0] = points[j];
        const [t1, y1] = points[j + 1];
        samples[i] = y0 + ((y1 - y0) * Math.min(Math.max(t - t0, 0), t1 - t0)) / (t1 - t0);
    }
    const mean = samples.reduce((s, x) => s + x, 0) / count;
    let windowPower = 0;
    for (let i = 0; i < count; i++) {
        const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (count - 1)); // Hann window
        samples[i] = (samples[i] - mean) * w;
        windowPower += w * w;
    }
    const step = 0.0025;
    const freqs = new Float64Array(201);
    const psd = new Float64Array(201);
    for (let k = 0; k < freqs.length; k++) {
        const f = k * step;
        let re = 0;
        let im = 0;
        for (let i = 0; i < count; i++) {
            const angle = (2 * Math.PI * f * i) / RESAMPLE_HZ;
            re += samples[i] * Math.cos(angle);
            im -= samples[i] * Math.sin(angle);
        }
        freqs[k] = f;
        psd[k] = (2 * (re * re + im * im)) / (RESAMPLE_HZ * windowPower); // one-sided density
    }
    const bandPower = (lo, hi) => {
        let p = 0;
        for (let k = 0; k < freqs.length; k++) if (freqs[k] >= lo && freqs[k] < hi) p += psd[k] * step;
        return p;
    };
    return { freqs, psd, lf: bandPower(0.04, 0.15), hf: bandPower(0.15, 0.4) };
}

// The controls, the readouts and the four charts each need an element. In your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#22365B; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const button = (id, text) =>
        `<button type="button" data-id="${id}" style="font:inherit; padding:2px 12px; border-radius:12px; ` +
        `border:1px solid #ffffff66; background:#ffffff14; color:#fff; cursor:pointer">${text}</button>`;
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 10px; padding:6px 12px 2px;";
    bar.innerHTML =
        `<span>State:</span>` +
        Object.entries(STATES)
            .map(([key, state]) => button(`state-${key}`, state.label))
            .join("") +
        `<span style="width:8px"></span>` +
        button("ectopic", "Add ectopic beat") +
        `<label><input data-id="clean" type="checkbox"> Remove ectopic beats</label>` +
        button("pause", "Pause") +
        `<span style="color:#c8d3e8">Simulated data</span>`;
    const readoutRow = document.createElement("div");
    readoutRow.setAttribute("role", "status");
    readoutRow.setAttribute("aria-live", "off");
    readoutRow.style.cssText = "display:flex; flex-wrap:wrap; gap:6px; padding:4px 12px 4px;";
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1.2fr 1.6fr;";
    const panel = (title, gridColumn) => {
        const div = document.createElement("div");
        div.style.cssText = `grid-column:${gridColumn}; min-width:0; min-height:0; display:flex; flex-direction:column;`;
        const heading = document.createElement("div");
        heading.textContent = title;
        heading.style.cssText = "padding:2px 12px; font-size:13px; font-weight:600;";
        const chart = document.createElement("div");
        chart.style.cssText = "flex:1; min-height:0;";
        div.append(heading, chart);
        body.append(div);
        return chart;
    };
    const ecgDiv = panel("ECG with R peaks: each RR interval is one point on the tachogram", "1 / 3");
    const tachogramDiv = panel("RR tachogram: RR interval for each beat", "1 / 3");
    const poincareDiv = panel("Poincaré plot: each RR interval against the next", "1 / 2");
    const spectrumDiv = panel("Frequency spectrum of the RR intervals", "2 / 3");
    // Each chart needs its own element id
    ecgDiv.id = `${divElementId}-ecg`;
    tachogramDiv.id = `${divElementId}-tachogram`;
    poincareDiv.id = `${divElementId}-poincare`;
    spectrumDiv.id = `${divElementId}-spectrum`;
    root.append(bar, readoutRow, body);
    const get = (selector) => bar.querySelector(selector);
    return {
        ecgDiv,
        tachogramDiv,
        poincareDiv,
        spectrumDiv,
        readoutRow,
        stateButtons: Object.keys(STATES).map((key) => ({ key, el: get(`button[data-id="state-${key}"]`) })),
        ectopic: get('button[data-id="ectopic"]'),
        clean: get('input[data-id="clean"]'),
        pause: get('button[data-id="pause"]')
    };
}

async function heartRateVariability(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Heart rate variability from one heartbeat stream, charted with SciChart.js: an ECG strip with the RR interval
    // marked, a scrolling RR tachogram, a Poincaré plot with its SD1/SD2 ellipse and the RR spectrum with LF and HF bands
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        FastLineRenderableSeries,
        FastMountainRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        BoxAnnotation,
        TextAnnotation,
        LineArrowAnnotation,
        EArrowHeadPosition,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const ECG_COLOUR = "#3BD16F";
    const RR_COLOUR = "#50C7E0";
    const ECTOPIC_COLOUR = "#FF8A3D";
    const LF_COLOUR = "#F6E05E";
    const HF_COLOUR = "#B57EDC";
    const theme = new SciChartJsNavyTheme();
    const axisFont = { fontSize: 12 };
    const titleFont = { fontSize: 13 };
    const createChart = async (div, xTitle, yTitle) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(div, { theme });
        const xAxis = new NumericAxis(wasmContext, {
            axisTitle: xTitle,
            labelStyle: axisFont,
            axisTitleStyle: titleFont,
            labelPrecision: 0
        });
        const yAxis = new NumericAxis(wasmContext, {
            axisTitle: yTitle,
            labelStyle: axisFont,
            axisTitleStyle: titleFont,
            labelPrecision: 0,
            growBy: new NumberRange(0.1, 0.1)
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);
        return { sciChartSurface, wasmContext, xAxis, yAxis };
    };

    // --- 1. ECG strip: a scrolling trace (FIFO buffer), R-peak markers and an arrow for the latest RR interval ---
    const ecg = await createChart(ui.ecgDiv, "Time (s)", "mV");
    ecg.xAxis.autoRange = EAutoRange.Never;
    ecg.yAxis.autoRange = EAutoRange.Never;
    ecg.yAxis.visibleRange = new NumberRange(-0.6, 1.9);
    ecg.yAxis.drawLabels = false;
    ecg.xAxis.labelProvider.precision = 1;
    const ecgData = new XyDataSeries(ecg.wasmContext, {
        dataSeriesName: "ECG",
        fifoCapacity: ECG_SECONDS * ECG_RATE + 50,
        isSorted: true,
        containsNaN: false
    });
    const rPeaks = new XyDataSeries(ecg.wasmContext, { dataSeriesName: "R peaks", fifoCapacity: 30 });
    ecg.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(ecg.wasmContext, { dataSeries: ecgData, stroke: ECG_COLOUR, strokeThickness: 1.5 }),
        new XyScatterRenderableSeries(ecg.wasmContext, {
            dataSeries: rPeaks,
            pointMarker: new EllipsePointMarker(ecg.wasmContext, { width: 9, height: 9, fill: "#FFFFFF", stroke: RR_COLOUR })
        })
    );
    const rrArrow = new LineArrowAnnotation({
        x1: 0,
        x2: 0,
        y1: 1.45,
        y2: 1.45,
        stroke: "#FFFFFF",
        strokeThickness: 1.5,
        arrowHeadPosition: EArrowHeadPosition.StartEnd,
        arrowStyle: { headLength: 8, headWidth: 6, fill: "#FFFFFF", stroke: "#FFFFFF" },
        isHidden: true
    });
    const rrLabel = new TextAnnotation({
        x1: 0,
        y1: 1.5,
        text: "",
        textColor: "#FFFFFF",
        fontSize: 13,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        isHidden: true
    });
    ecg.sciChartSurface.annotations.add(rrArrow, rrLabel);

    // --- 2. RR tachogram: one point per beat, scrolling, with ectopic beats in orange ---
    const tach = await createChart(ui.tachogramDiv, "Time (s)", "RR (ms)");
    tach.xAxis.autoRange = EAutoRange.Never;
    tach.yAxis.autoRange = EAutoRange.Always;
    const tachData = new XyDataSeries(tach.wasmContext, { dataSeriesName: "RR interval", fifoCapacity: 400 });
    const tachEctopic = new XyDataSeries(tach.wasmContext, { dataSeriesName: "Flagged beats", fifoCapacity: 60 });
    tach.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(tach.wasmContext, {
            dataSeries: tachData,
            stroke: RR_COLOUR,
            strokeThickness: 1.5,
            pointMarker: new EllipsePointMarker(tach.wasmContext, { width: 5, height: 5, fill: RR_COLOUR, strokeThickness: 0 })
        }),
        new XyScatterRenderableSeries(tach.wasmContext, {
            dataSeries: tachEctopic,
            pointMarker: new EllipsePointMarker(tach.wasmContext, { width: 10, height: 10, fill: ECTOPIC_COLOUR, strokeThickness: 0 })
        })
    );
    // The analysis window: the last minute, shaded
    const windowBox = new BoxAnnotation({
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 1,
        yCoordinateMode: ECoordinateMode.Relative,
        fill: "#FFFFFF10",
        strokeThickness: 0
    });
    tach.sciChartSurface.annotations.add(windowBox);

    // --- 3. Poincaré plot: RR(n) against RR(n+1), with the SD1/SD2 ellipse ---
    const poin = await createChart(ui.poincareDiv, "RR(n) (ms)", "RR(n+1) (ms)");
    poin.xAxis.autoRange = EAutoRange.Never;
    poin.yAxis.autoRange = EAutoRange.Never;
    const poinData = new XyDataSeries(poin.wasmContext, { dataSeriesName: "Beat pairs" });
    const poinFlagged = new XyDataSeries(poin.wasmContext, { dataSeriesName: "Pairs with a flagged beat" });
    const identityData = new XyDataSeries(poin.wasmContext, { dataSeriesName: "Line of identity" });
    const ellipseData = new XyDataSeries(poin.wasmContext, { dataSeriesName: "SD1/SD2 ellipse" });
    const sd1Data = new XyDataSeries(poin.wasmContext, { dataSeriesName: "SD1" });
    const sd2Data = new XyDataSeries(poin.wasmContext, { dataSeriesName: "SD2" });
    poin.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(poin.wasmContext, { dataSeries: identityData, stroke: "#FFFFFF55", strokeDashArray: [4, 4] }),
        new XyScatterRenderableSeries(poin.wasmContext, {
            dataSeries: poinData,
            pointMarker: new EllipsePointMarker(poin.wasmContext, { width: 7, height: 7, fill: RR_COLOUR + "CC", strokeThickness: 0 })
        }),
        new XyScatterRenderableSeries(poin.wasmContext, {
            dataSeries: poinFlagged,
            pointMarker: new EllipsePointMarker(poin.wasmContext, { width: 9, height: 9, fill: ECTOPIC_COLOUR, strokeThickness: 0 })
        }),
        new FastLineRenderableSeries(poin.wasmContext, { dataSeries: ellipseData, stroke: "#FFFFFF", strokeThickness: 2 }),
        new FastLineRenderableSeries(poin.wasmContext, { dataSeries: sd1Data, stroke: HF_COLOUR, strokeThickness: 3 }),
        new FastLineRenderableSeries(poin.wasmContext, { dataSeries: sd2Data, stroke: LF_COLOUR, strokeThickness: 3 })
    );
    const sdLabel = new TextAnnotation({
        x1: 0.03,
        y1: 0.03,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        text: "",
        textColor: "#FFFFFF",
        fontSize: 13
    });
    poin.sciChartSurface.annotations.add(sdLabel);

    // --- 4. Spectrum of the RR intervals, with the LF and HF bands shaded ---
    const spec = await createChart(ui.spectrumDiv, "Frequency (Hz)", "Power (ms²/Hz)");
    spec.xAxis.autoRange = EAutoRange.Never;
    spec.xAxis.visibleRange = new NumberRange(0, 0.5);
    spec.xAxis.autoTicks = false;
    spec.xAxis.majorDelta = 0.05;
    spec.xAxis.minorDelta = 0.01;
    spec.xAxis.labelProvider.precision = 2;
    spec.xAxis.labelProvider.cursorPrecision = 3;
    spec.yAxis.autoRange = EAutoRange.Always;
    spec.yAxis.growBy = new NumberRange(0, 0.15);
    const specData = new XyDataSeries(spec.wasmContext, { dataSeriesName: "RR spectrum", isSorted: true });
    spec.sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(spec.wasmContext, {
            dataSeries: specData,
            stroke: "#FFFFFF",
            strokeThickness: 2,
            fill: "#FFFFFF30"
        })
    );
    const band = (x1, x2, colour, text) => [
        new BoxAnnotation({ x1, x2, y1: 0, y2: 1, yCoordinateMode: ECoordinateMode.Relative, fill: colour + "30", strokeThickness: 0 }),
        new TextAnnotation({
            x1: (x1 + x2) / 2,
            y1: 0.04,
            yCoordinateMode: ECoordinateMode.Relative,
            text,
            textColor: colour,
            fontSize: 13,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center
        })
    ];
    spec.sciChartSurface.annotations.add(
        ...band(0.04, 0.15, LF_COLOUR, "LF 0.04–0.15 Hz"),
        ...band(0.15, 0.4, HF_COLOUR, "HF 0.15–0.4 Hz")
    );

    // Hover for values. Pause, then scroll to zoom, drag to pan and double-click to reset
    const charts = [ecg, tach, poin, spec];
    for (const chart of charts) {
        chart.sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true, tooltipContainerBackground: "#14233CDD" }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
    }

    // --- Readouts ---
    const readoutNames = ["Mean HR", "SDNN", "RMSSD", "pNN50", "LF/HF", "Breathing", "Flagged beats"];
    const readouts = readoutNames.map((name) => {
        const tile = document.createElement("div");
        tile.style.cssText = "padding:2px 10px; border-radius:6px; background:#14233C; min-width:70px;";
        tile.innerHTML = `<div style="font-size:11px; color:#c8d3e8">${name}</div><div style="font-size:15px; font-weight:600">–</div>`;
        ui.readoutRow.append(tile);
        return tile.lastElementChild;
    });

    // --- The live stream ---
    const heart = createHeart();
    // Start two minutes in, with the beats so far already recorded, so every chart begins full
    let now = TACHOGRAM_SECONDS + 1; // simulated time (s)
    let ecgTime = now - ECG_SECONDS; // the last ECG sample drawn
    let lastSentT = -Infinity;
    let running = true;
    let state = "rest";

    // Adds the ECG samples and beats up to the current time, in one batch per frame
    function advance() {
        heart.extend(now + 1);
        const count = Math.floor((now - ecgTime) * ECG_RATE);
        if (count > 0) {
            const xs = new Float64Array(count);
            const ys = new Float64Array(count);
            for (let i = 0; i < count; i++) {
                const t = ecgTime + (i + 1) / ECG_RATE;
                xs[i] = t;
                ys[i] = ecgAt(heart.beats, t) + 0.015 * gaussian() + 0.04 * Math.sin(2 * Math.PI * 0.25 * t);
            }
            ecgTime += count / ECG_RATE;
            ecgData.appendRange(xs, ys);
        }
        // New beats since the last frame
        const fresh = heart.beats.filter((b) => b.t <= now && b.t > lastSentT);
        if (fresh.length) {
            lastSentT = fresh[fresh.length - 1].t;
            const visible = fresh.filter((b) => b.t > now - ECG_SECONDS - 1);
            if (visible.length) {
                rPeaks.appendRange(
                    visible.map((b) => b.t),
                    visible.map((b) => ecgAt(heart.beats, b.t))
                );
            }
            tachData.appendRange(
                fresh.map((b) => b.t),
                fresh.map((b) => b.rr)
            );
        }
        ecg.xAxis.visibleRange = new NumberRange(now - ECG_SECONDS, now);
        tach.xAxis.visibleRange = new NumberRange(now - TACHOGRAM_SECONDS, now + 2);
        windowBox.x1 = now - WINDOW_SECONDS;
        windowBox.x2 = now;
        // The arrow spans the latest RR interval on the ECG
        const done = heart.beats.filter((b) => b.t <= now);
        if (done.length > 1) {
            const a = done[done.length - 2];
            const b = done[done.length - 1];
            rrArrow.x1 = a.t;
            rrArrow.x2 = b.t;
            rrLabel.x1 = (a.t + b.t) / 2;
            rrLabel.text = `RR ${b.rr} ms`;
            rrArrow.isHidden = false;
            rrLabel.isHidden = false;
        }
    }

    // Recomputes the measures, the Poincaré plot and the spectrum over the analysis window
    function analyse() {
        const inWindow = heart.beats.filter((b) => b.t > now - WINDOW_SECONDS && b.t <= now);
        if (inWindow.length < 10) return;
        const flags = flagArtefacts(inWindow);
        const clean = ui.clean.checked;
        const m = hrvMeasures(inWindow, flags, clean);
        const spectrum = rrSpectrum(inWindow, flags, clean, now - WINDOW_SECONDS + 1, now);
        // Flagged beats on the tachogram (rebuilt from all the beats on screen)
        const onScreen = heart.beats.filter((b) => b.t <= now && b.t > now - TACHOGRAM_SECONDS - 5);
        const screenFlags = flagArtefacts(onScreen);
        const flagged = onScreen.filter((_, i) => screenFlags[i]);
        tachEctopic.clear();
        tachEctopic.appendRange(
            flagged.map((b) => b.t),
            flagged.map((b) => b.rr)
        );

        // Poincaré pairs
        const xs = [];
        const ys = [];
        const fx = [];
        const fy = [];
        for (let i = 1; i < inWindow.length; i++) {
            const isFlagged = flags[i] || flags[i - 1];
            if (isFlagged && clean) continue;
            (isFlagged ? fx : xs).push(inWindow[i - 1].rr);
            (isFlagged ? fy : ys).push(inWindow[i].rr);
        }
        poinData.clear();
        poinData.appendRange(xs, ys);
        poinFlagged.clear();
        poinFlagged.appendRange(fx, fy);
        // SD1: spread across the line of identity; SD2: spread along it
        const allX = xs.concat(fx);
        const allY = ys.concat(fy);
        const across = allX.map((x, i) => (allY[i] - x) / Math.SQRT2);
        const along = allX.map((x, i) => (allY[i] + x) / Math.SQRT2);
        const sd = (v) => {
            const mean = v.reduce((s, x) => s + x, 0) / v.length;
            return Math.sqrt(v.reduce((s, x) => s + (x - mean) ** 2, 0) / (v.length - 1));
        };
        const sd1 = sd(across);
        const sd2 = sd(along);
        const centre = allX.reduce((s, x) => s + x, 0) / allX.length;
        const ex = new Float64Array(73);
        const ey = new Float64Array(73);
        for (let k = 0; k < 73; k++) {
            const a = (2 * Math.PI * k) / 72;
            const u = sd2 * Math.cos(a); // along the line of identity
            const v = sd1 * Math.sin(a); // across it
            ex[k] = centre + (u - v) / Math.SQRT2;
            ey[k] = centre + (u + v) / Math.SQRT2;
        }
        ellipseData.clear();
        ellipseData.appendRange(ex, ey);
        sd1Data.clear();
        sd1Data.appendRange([centre, centre - sd1 / Math.SQRT2], [centre, centre + sd1 / Math.SQRT2]);
        sd2Data.clear();
        sd2Data.appendRange([centre, centre + sd2 / Math.SQRT2], [centre, centre + sd2 / Math.SQRT2]);
        sdLabel.text = `SD1 ${sd1.toFixed(0)} ms (purple)   SD2 ${sd2.toFixed(0)} ms (yellow)`;
        // Equal x and y ranges, so the line of identity runs at 45°
        const lo = Math.min(...allX, ...allY);
        const hi = Math.max(...allX, ...allY);
        const pad = Math.max(30, 0.12 * (hi - lo));
        const range = new NumberRange(lo - pad, hi + pad);
        if (running) {
            poin.xAxis.visibleRange = range;
            poin.yAxis.visibleRange = range;
        }
        identityData.clear();
        identityData.appendRange([0, 3000], [0, 3000]);

        specData.clear();
        specData.appendRange(spectrum.freqs, spectrum.psd);

        const values = [
            `${m.meanHr.toFixed(0)} bpm`,
            `${m.sdnn.toFixed(0)} ms`,
            `${m.rmssd.toFixed(0)} ms`,
            `${m.pnn50.toFixed(0)}%`,
            spectrum.hf > 0 ? (spectrum.lf / spectrum.hf).toFixed(1) : "–",
            `${heart.breathsPerMinute().toFixed(0)} /min`,
            `${flags.filter(Boolean).length}${clean ? " (removed)" : ""}`
        ];
        values.forEach((text, k) => (readouts[k].textContent = text));
    }

    // --- Animation: requestAnimationFrame moves time on; the analysis runs twice a second ---
    let lastFrame = performance.now();
    let sinceAnalysis = 1000;
    function animate(frameTime) {
        // Stop when a chart is deleted (for example when a React component unmounts)
        if (charts.some((c) => c.sciChartSurface.isDeleted)) return;
        const dt = Math.min(frameTime - lastFrame, 100);
        lastFrame = frameTime;
        if (running) {
            now += dt / 1000;
            advance();
            sinceAnalysis += dt;
            if (sinceAnalysis >= 500) {
                sinceAnalysis = 0;
                analyse();
            }
        }
        requestAnimationFrame(animate);
    }

    // --- Controls ---
    const showState = () =>
        ui.stateButtons.forEach(({ key, el }) => {
            el.style.background = key === state ? "#50C7E0" : "#ffffff14";
            el.style.color = key === state ? "#14233C" : "#ffffff";
        });
    ui.stateButtons.forEach(({ key, el }) =>
        el.addEventListener("click", () => {
            state = key;
            heart.setState(key);
            showState();
        })
    );
    ui.ectopic.addEventListener("click", () => heart.queueEctopic());
    ui.clean.addEventListener("change", analyse);
    const setRunning = (value) => {
        running = value;
        ui.pause.textContent = running ? "Pause" : "Resume";
    };
    ui.pause.addEventListener("click", () => setRunning(!running));
    // Zooming or panning pauses the stream, so the live update doesn't undo it
    for (const div of [ui.ecgDiv, ui.tachogramDiv, ui.poincareDiv, ui.spectrumDiv]) {
        div.addEventListener("wheel", () => running && setRunning(false));
        div.addEventListener("pointerdown", () => running && setRunning(false));
    }

    showState();
    advance();
    analyse();
    requestAnimationFrame(animate);
    // #region_A_end
}

heartRateVariability("scichart-root");
