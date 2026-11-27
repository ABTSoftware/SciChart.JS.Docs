import * as SciChart from "scichart";

// A simulated SIGINT dashboard: one wideband receiver watching a 20 MHz span, and five linked views of what it hears.
// 1. the live spectrum (power against frequency), with a max-hold trace and the detection threshold;
// 2. a waterfall under it: one spectrum per row, newest at the top, colour for power;
// 3. an emitter list, built by a simple threshold detector and tracker;
// 4. a direction-finding (DF) plot: the bearings measured for the selected emitter;
// 5. an activity timeline: when each emitter was transmitting.
// The emitters are generic and synthetic: a steady carrier, a push-to-talk transmitter, a frequency hopper, a scanning
// pulsed emitter (radar-like), a wideband data signal and a weak carrier near the noise. Frequencies are offsets from
// the receiver's tuned centre, not real channels. A seeded generator makes the scene the same on every load.
const SPAN_MHZ = 20; // the receiver sees -10 to +10 MHz around its tuned centre
const BINS = 4096; // frequency bins per spectrum, about 4.9 kHz each
const BIN_MHZ = SPAN_MHZ / BINS;
const F_START = -SPAN_MHZ / 2;
const ROWS_PER_SECOND = 20; // spectra per second
const ROW_SECONDS = 1 / ROWS_PER_SECOND;
const WATERFALL_ROWS = 200; // 10 seconds of history in the waterfall
const NOISE_DB = -100; // receiver noise floor per bin, dB relative to full scale (dBFS)
const THRESHOLD_DB = 10; // a bin is "on" when it is this far above the estimated noise floor
const TIMELINE_SECONDS = 60;
const PREFILL_SECONDS = 45; // run the scene this long before the first draw, so every view starts full

// The true scene. The detector never sees this table: it only sees the spectra and the DF bearings.
const EMITTERS = [
    { kind: "carrier", f: -6.2, bw: 0.025, level: -62, bearing: 48 },
    { kind: "burst", f: 2.35, bw: 0.0125, level: -66, bearing: 132 },
    { kind: "hopper", fLow: 4.0, fHigh: 9.0, channels: 41, dwell: 0.1, bw: 0.1, level: -70, bearing: 285 },
    { kind: "scanning", f: -2.0, lobe: 1.0, level: -50, bearing: 210, period: 4.0, beamSigma: 0.08 },
    { kind: "wideband", f: -8.6, bw: 1.2, level: -78, bearing: 12 },
    { kind: "weak", f: 1.4, bw: 0.02, level: -85, bearing: 165 }
];

// A small seeded random number generator (mulberry32), so the scene is repeatable
function makeRandom(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const random = makeRandom(20261127);
const gaussianRandom = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
const hash01 = (n) => {
    let h = Math.imul(n + 1, 2654435761) ^ 0x5bd1e995;
    h = Math.imul(h ^ (h >>> 15), 2246822519);
    return ((h ^ (h >>> 13)) >>> 0) / 4294967296;
};
const dbToLin = (db) => Math.pow(10, db / 10);
const angleDiff = (a, b) => ((((a - b + 180) % 360) + 360) % 360) - 180;

// The push-to-talk transmitter's on and off times: talk for 1.5 to 5 s, then wait 2 to 8 s
const BURST_SCHEDULE = [];
for (let t = 1, i = 0; t < 3600; i++) {
    const on = 1.5 + 3.5 * hash01(i * 3 + 1);
    BURST_SCHEDULE.push([t, t + on]);
    t += on + 2 + 6 * hash01(i * 3 + 2);
}
const burstOn = (t) => BURST_SCHEDULE.some(([s, e]) => t >= s && t < e);

// Where each emitter is in frequency at time t, and its power (linear) in a bin at offset df MHz from that frequency
function emitterState(e, t) {
    if (e.kind === "burst") return burstOn(t) ? { f: e.f, gain: 1 } : null;
    if (e.kind === "hopper") {
        const hop = Math.floor(t / e.dwell);
        const channel = Math.floor(hash01(hop + 7919) * e.channels);
        return { f: e.fLow + (channel * (e.fHigh - e.fLow)) / (e.channels - 1), gain: 1 };
    }
    if (e.kind === "scanning") {
        // The emitter's beam sweeps past the receiver once per period; between passes only its weak sidelobes arrive
        const phase = (t % e.period) - e.period / 2;
        const mainBeam = Math.exp(-0.5 * (phase / e.beamSigma) ** 2);
        return { f: e.f, gain: Math.max(mainBeam, dbToLin(-45)) * (0.75 + 0.25 * random()) };
    }
    return { f: e.f, gain: 1 };
}
function spectralShape(e, df) {
    if (e.kind === "scanning") {
        // Short pulses spread power over a wide sinc² shape, with nulls every 1/(pulse width)
        const x = df / e.lobe;
        if (x === 0) return 1;
        if (Math.abs(df) > 3) return 0; // the receiver's filters and the emitter's own filtering cut the far sidelobes
        const s = Math.sin(Math.PI * x) / (Math.PI * x);
        return s * s;
    }
    if (e.kind === "wideband" || e.kind === "hopper") return 1 / (1 + Math.pow(Math.abs(df) / (e.bw / 2), 12)); // flat top, steep skirts
    const sigma = e.bw / 2.355; // narrowband: a Gaussian whose -3 dB width is bw
    return Math.exp(-0.5 * (df / sigma) ** 2);
}

// One spectrum (dBFS per bin) at time t: averaged receiver noise plus every emitter that is on
const linear = new Float64Array(BINS);
function simulateSpectrum(t, out) {
    const noise = dbToLin(NOISE_DB);
    for (let i = 0; i < BINS; i++) {
        // Each bin is the average of 4 FFTs, so the noise power is the mean of 4 exponential samples
        const p = -Math.log(1 - random()) - Math.log(1 - random()) - Math.log(1 - random()) - Math.log(1 - random());
        linear[i] = (noise * p) / 4;
    }
    for (const e of EMITTERS) {
        const state = emitterState(e, t);
        if (!state) continue;
        const reach = e.kind === "scanning" ? 3 : e.kind === "wideband" ? e.bw * 1.5 : Math.max(e.bw * 3, 0.03);
        const from = Math.max(0, Math.floor((state.f - reach - F_START) / BIN_MHZ));
        const to = Math.min(BINS - 1, Math.ceil((state.f + reach - F_START) / BIN_MHZ));
        const peak = dbToLin(e.level) * state.gain;
        for (let i = from; i <= to; i++) linear[i] += peak * spectralShape(e, F_START + (i + 0.5) * BIN_MHZ - state.f);
    }
    for (let i = 0; i < BINS; i++) out[i] = 10 * Math.log10(linear[i]);
}

// The DF receiver: the bearing it measures for a signal at frequency f. Weak signals give noisier bearings.
function measureBearing(f, snrDb, t) {
    // The DF reports the bearing of whichever signal is strongest at this frequency
    let best = null;
    let bestPower = 0;
    for (const e of EMITTERS) {
        const state = emitterState(e, t);
        if (!state) continue;
        const power = dbToLin(e.level) * state.gain * spectralShape(e, f - state.f);
        if (power > bestPower) {
            bestPower = power;
            best = e;
        }
    }
    const sigma = 1 + 30 / Math.max(snrDb, 5);
    const truth = best && bestPower > dbToLin(NOISE_DB) ? best.bearing : 360 * random();
    return (((truth + sigma * gaussianRandom()) % 360) + 360) % 360;
}

// --- Detection: find the signals in one spectrum ---
// Estimate the noise floor as the median of a sample of bins, mark bins THRESHOLD_DB above it, and join runs of
// marked bins (bridging small gaps, so one wide signal's sidelobes stay one detection)
const MERGE_GAP_BINS = 40; // about 200 kHz
function detect(spectrum, t) {
    const sample = [];
    for (let i = 0; i < BINS; i += 8) sample.push(spectrum[i]);
    sample.sort((a, b) => a - b);
    const floor = sample[sample.length >> 1];
    const threshold = floor + THRESHOLD_DB;
    const runs = [];
    let run = null;
    for (let i = 0; i < BINS; i++) {
        if (spectrum[i] < threshold) continue;
        if (run && i - run.end <= MERGE_GAP_BINS) run.end = i;
        else runs.push((run = { start: i, end: i }));
    }
    const detections = [];
    for (const r of runs) {
        if (r.end - r.start < 1) continue; // a single bin is usually a noise spike
        let peak = -Infinity;
        let power = 0;
        let moment = 0;
        for (let i = r.start; i <= r.end; i++) {
            peak = Math.max(peak, spectrum[i]);
            const p = dbToLin(spectrum[i]);
            power += p;
            moment += p * i;
        }
        // Bandwidth: the span of bins within 10 dB of the peak
        let lo = r.start;
        let hi = r.end;
        while (spectrum[lo] < peak - 10) lo++;
        while (spectrum[hi] < peak - 10) hi--;
        const f = F_START + (moment / power + 0.5) * BIN_MHZ;
        const snr = peak - floor;
        detections.push({ f, bw: Math.max(1, hi - lo + 1) * BIN_MHZ, peak, snr, bearing: measureBearing(f, snr, t) });
    }
    // A strong signal's sidelobes can show as separate detections nearby. They arrive from the same bearing at the
    // same moment, so keep only the strongest detection within 4 MHz on any one bearing.
    detections.sort((a, b) => b.peak - a.peak);
    const kept = detections.filter(
        (d, i) => !detections.slice(0, i).some((s) => Math.abs(s.f - d.f) < 4 && Math.abs(angleDiff(s.bearing, d.bearing)) < 8)
    );
    return { detections: kept, floor, threshold };
}

// --- Tracking: group detections over time into emitters ---
// A detection joins a track on the same frequency. If none matches, it may be the next hop of a frequency hopper:
// a track heard in the last 0.6 s with the same bandwidth and the same DF bearing. Otherwise it starts a new track.
const tracks = [];
let nextTrackId = 1;
function updateTracks(detections, t) {
    const used = new Set();
    detections.sort((a, b) => b.snr - a.snr);
    for (const d of detections) {
        let match = null;
        let matchDistance = Infinity;
        for (const tr of tracks) {
            if (used.has(tr) || t - tr.lastSeen > 30) continue;
            const distance = Math.abs(d.f - tr.f);
            if (distance < Math.max(tr.bw, d.bw) / 2 + 0.02 && distance < matchDistance) {
                match = tr;
                matchDistance = distance;
            }
        }
        let hopped = false;
        if (!match) {
            for (const tr of tracks) {
                if (used.has(tr) || t - tr.lastSeen > 0.6) continue;
                const similarWidth = Math.abs(d.bw - tr.bw) < 0.4 * Math.max(d.bw, tr.bw);
                if (similarWidth && Math.abs(angleDiff(d.bearing, tr.bearing)) < 8 && Math.abs(d.f - tr.f) < 6) {
                    match = tr;
                    hopped = true;
                    break;
                }
            }
        }
        if (!match) {
            match = {
                id: `E${String(nextTrackId++).padStart(2, "0")}`,
                f: d.f,
                fMin: d.f,
                fMax: d.f,
                bw: d.bw,
                peak: d.peak,
                bearing: d.bearing,
                bearings: [],
                firstSeen: t,
                lastSeen: t,
                rowsOn: 0,
                hops: 0,
                intervals: [],
                type: "new"
            };
            tracks.push(match);
        }
        used.add(match);
        if (hopped) match.hops++;
        match.f = d.f;
        match.fMin = Math.min(match.fMin, d.f);
        match.fMax = Math.max(match.fMax, d.f);
        match.bw = match.rowsOn === 0 ? d.bw : 0.9 * match.bw + 0.1 * d.bw;
        match.peak = d.peak;
        match.lastSeen = t;
        match.rowsOn++;
        match.bearings.push(d.bearing);
        if (match.bearings.length > 200) match.bearings.shift();
        match.bearing = circularMean(match.bearings.slice(-40));
        const last = match.intervals[match.intervals.length - 1];
        if (last && t - last[1] <= 0.3) last[1] = t + ROW_SECONDS;
        else match.intervals.push([t, t + ROW_SECONDS]);
        while (match.intervals.length && match.intervals[0][1] < t - TIMELINE_SECONDS) match.intervals.shift();
    }
    // Forget one-off detections (noise) after a while
    for (let i = tracks.length - 1; i >= 0; i--) if (tracks[i].rowsOn < 3 && t - tracks[i].lastSeen > 5) tracks.splice(i, 1);
}
function circularMean(degrees) {
    let s = 0;
    let c = 0;
    for (const d of degrees) {
        s += Math.sin((d * Math.PI) / 180);
        c += Math.cos((d * Math.PI) / 180);
    }
    return (((Math.atan2(s, c) * 180) / Math.PI) + 360) % 360;
}
// A first guess at what kind of emitter each track is, from its behaviour alone
function classify(tr, now) {
    const duty = tr.rowsOn / Math.max(1, (now - tr.firstSeen) / ROW_SECONDS + 1);
    if (tr.hops >= 3) return "Frequency hopper";
    if (tr.bw > 0.5) return duty < 0.35 ? "Pulsed, scanning" : "Wideband data";
    if (duty > 0.75) return "Continuous carrier";
    return "Burst (push-to-talk)";
}

// The controls, readouts, table and charts each need an element. This splits the page's div into them;
// in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#22365B; color:#ffffff; overflow:auto;" +
        "font:13px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const button = (id, text) =>
        `<button type="button" data-id="${id}" style="font:inherit; padding:2px 12px; border-radius:12px; border:1px solid #ffffff66; background:#ffffff14; color:#fff; cursor:pointer">${text}</button>`;
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px;";
    bar.innerHTML =
        button("pause", "Pause") +
        button("reset", "Reset max hold") +
        `<span>Power: weak <span style="display:inline-block; width:90px; height:10px; vertical-align:middle; background:linear-gradient(90deg,#0B1533,#1B3F8B,#1FA3B8,#7CE07A,#F2D24B,#FFF4E6)"></span> strong</span>` +
        `<span><span style="color:#50C7E0">━</span> live <span style="color:#C8A2FF">━</span> max hold <span style="color:#FF8A3D">▮</span> selected</span>` +
        `<span>Simulated data</span>` +
        `<span data-id="readout" aria-live="polite" style="flex-basis:100%; min-height:1.4em; color:#c8d3e8"></span>`;
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const column = (flex) => {
        const div = document.createElement("div");
        div.style.cssText = `flex:${flex}; min-width:0; min-height:0; display:flex; flex-direction:column;`;
        body.append(div);
        return div;
    };
    // Each panel takes a share of its column's height (grow), and never less than minHeight pixels
    const panel = (parent, title, grow, minHeight, id) => {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = `flex:${grow} 1 0; min-height:${minHeight}px; display:flex; flex-direction:column;`;
        const heading = document.createElement("div");
        heading.textContent = title;
        heading.style.cssText = "padding:4px 12px 0; font-weight:600;";
        const content = document.createElement("div");
        content.style.cssText = "flex:1; min-height:0;";
        content.id = `${divElementId}-${id}`;
        wrapper.append(heading, content);
        parent.append(wrapper);
        return { heading, content };
    };
    const left = column("2 1 520px");
    const right = column("1.2 1 380px");
    const spectrum = panel(left, "Spectrum: power against frequency", 26, 150, "spectrum");
    const waterfall = panel(left, "Waterfall: the last 10 seconds of spectra, newest at the top", 30, 170, "waterfall");
    const timeline = panel(left, "Activity timeline: when each emitter was on", 22, 130, "timeline");
    const list = panel(right, "Emitter list (click a row to select)", 40, 200, "list");
    list.content.style.cssText += "overflow:auto; padding:0 8px;";
    const df = panel(right, "Direction finding: bearings of the selected emitter", 50, 260, "df");
    root.append(bar, body);
    return {
        spectrumDiv: spectrum.content,
        waterfallDiv: waterfall.content,
        timelineDiv: timeline.content,
        dfDiv: df.content,
        dfHeading: df.heading,
        list: list.content,
        pauseButton: bar.querySelector('button[data-id="pause"]'),
        resetButton: bar.querySelector('button[data-id="reset"]'),
        readout: bar.querySelector('span[data-id="readout"]')
    };
}

async function sigintDashboard(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A SIGINT dashboard: a live spectrum and a scrolling waterfall that share one frequency axis, an emitter list,
    // a polar direction-finding plot and an activity timeline, all linked by one selected emitter. Charted with SciChart.js
    const {
        SciChartSurface,
        SciChartPolarSurface,
        SciChartVerticalGroup,
        NumericAxis,
        PolarNumericAxis,
        EPolarAxisMode,
        EPolarLabelMode,
        EAxisAlignment,
        NumberRange,
        EAutoRange,
        XyDataSeries,
        XyxDataSeries,
        XyxyDataSeries,
        FastLineRenderableSeries,
        FastRectangleRenderableSeries,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        PolarColumnRenderableSeries,
        PolarLineRenderableSeries,
        PolarXyScatterRenderableSeries,
        EllipsePointMarker,
        XyTextDataSeries,
        PolarTextRenderableSeries,
        EHorizontalTextPosition,
        EVerticalTextPosition,
        EColumnMode,
        EColumnYMode,
        BoxAnnotation,
        HorizontalLineAnnotation,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        ELabelPlacement,
        CustomChartModifier2D,
        translateFromCanvasToSeriesViewRect,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const SELECTED = "#FF8A3D";
    const theme = new SciChartJsNavyTheme();
    const frequencies = Float64Array.from({ length: BINS }, (_, i) => F_START + (i + 0.5) * BIN_MHZ);
    const xyZoom = () => [
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    ];
    const frequencyAxis = (wasmContext, options) =>
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(F_START, -F_START),
            autoRange: EAutoRange.Never,
            labelPrecision: 0,
            ...options
        });

    // --- 1. The spectrum: live trace, max hold, detection threshold ---
    const { sciChartSurface: spectrum, wasmContext } = await SciChartSurface.create(ui.spectrumDiv, { theme });
    spectrum.xAxes.add(frequencyAxis(wasmContext, { drawLabels: false }));
    spectrum.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "dBFS",
            axisTitleStyle: { fontSize: 13 },
            axisAlignment: EAxisAlignment.Left,
            visibleRange: new NumberRange(-108, -40),
            autoRange: EAutoRange.Never
        })
    );
    const liveData = new XyDataSeries(wasmContext, { isSorted: true, containsNaN: false });
    const maxHoldData = new XyDataSeries(wasmContext, { isSorted: true, containsNaN: false });
    spectrum.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, { dataSeries: maxHoldData, stroke: "#C8A2FF", strokeThickness: 1, opacity: 0.7 }),
        new FastLineRenderableSeries(wasmContext, { dataSeries: liveData, stroke: "#50C7E0", strokeThickness: 1 })
    );
    const thresholdLine = new HorizontalLineAnnotation({
        y1: NOISE_DB + THRESHOLD_DB,
        stroke: "#FFFFFFAA",
        strokeThickness: 1,
        strokeDashArray: [6, 4],
        showLabel: true,
        labelPlacement: ELabelPlacement.TopRight,
        axisLabelFill: "#00000000",
        labelValue: "detection threshold"
    });
    // The selected emitter: a band over its frequency (or, for a hopper, the span it hops over)
    const selectionBand = () =>
        new BoxAnnotation({
            yCoordinateMode: ECoordinateMode.Relative,
            y1: 0,
            y2: 1,
            x1: 0,
            x2: 0,
            fill: SELECTED + "26",
            stroke: SELECTED,
            strokeThickness: 1,
            isHidden: true
        });
    const spectrumBand = selectionBand();
    spectrum.annotations.add(spectrumBand, thresholdLine);
    spectrum.chartModifiers.add(...xyZoom());

    // --- 2. The waterfall: a heatmap of the last WATERFALL_ROWS spectra, newest at the top ---
    const { sciChartSurface: waterfall } = await SciChartSurface.create(ui.waterfallDiv, { theme });
    waterfall.xAxes.add(frequencyAxis(wasmContext, { axisTitle: "Frequency offset from the tuned centre (MHz)", axisTitleStyle: { fontSize: 13 } }));
    waterfall.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Seconds ago",
            axisTitleStyle: { fontSize: 13 },
            axisAlignment: EAxisAlignment.Left,
            flippedCoordinates: true, // newest row at the top
            visibleRange: new NumberRange(0, WATERFALL_ROWS * ROW_SECONDS),
            autoRange: EAutoRange.Never,
            labelPrecision: 0
        })
    );
    const rows = Array.from({ length: WATERFALL_ROWS }, () => new Float64Array(BINS).fill(NOISE_DB));
    const waterfallData = new UniformHeatmapDataSeries(wasmContext, {
        xStart: F_START,
        xStep: BIN_MHZ,
        yStart: 0,
        yStep: ROW_SECONDS,
        zValues: rows
    });
    waterfall.renderableSeries.add(
        new UniformHeatmapRenderableSeries(wasmContext, {
            dataSeries: waterfallData,
            fillValuesOutOfRange: true,
            colorMap: new HeatmapColorMap({
                minimum: NOISE_DB - 2,
                maximum: -48,
                gradientStops: [
                    { offset: 0, color: "#0B1533" },
                    { offset: 0.2, color: "#1B3F8B" },
                    { offset: 0.4, color: "#1FA3B8" },
                    { offset: 0.6, color: "#7CE07A" },
                    { offset: 0.8, color: "#F2D24B" },
                    { offset: 1, color: "#FFF4E6" }
                ]
            })
        })
    );
    const waterfallBand = selectionBand();
    waterfallBand.fill = "#00000000";
    waterfall.annotations.add(waterfallBand);
    waterfall.chartModifiers.add(...xyZoom());

    // Zooming or panning either chart's frequency axis moves the other
    const [spectrumX, waterfallX] = [spectrum.xAxes.get(0), waterfall.xAxes.get(0)];
    spectrumX.visibleRangeChanged.subscribe(({ visibleRange }) => {
        if (!waterfallX.visibleRange.equals(visibleRange)) waterfallX.visibleRange = visibleRange;
    });
    waterfallX.visibleRangeChanged.subscribe(({ visibleRange }) => {
        if (!spectrumX.visibleRange.equals(visibleRange)) spectrumX.visibleRange = visibleRange;
    });

    // --- 3. The activity timeline: one row per emitter, a bar for each time it was on ---
    const { sciChartSurface: timeline } = await SciChartSurface.create(ui.timelineDiv, { theme });
    timeline.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Seconds ago",
            axisTitleStyle: { fontSize: 13 },
            visibleRange: new NumberRange(-TIMELINE_SECONDS, 0),
            autoRange: EAutoRange.Never,
            labelPrecision: 0
        })
    );
    const timelineY = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        flippedCoordinates: true, // the first emitter found at the top
        autoRange: EAutoRange.Never,
        visibleRange: new NumberRange(-0.5, 5.5),
        autoTicks: false,
        majorDelta: 1,
        drawMinorGridLines: false,
        drawMinorTickLines: false
    });
    timeline.xAxes.get(0).labelProvider.formatLabel = (value) => (-value).toFixed(0);
    timeline.yAxes.add(timelineY);
    const activityData = new XyxyDataSeries(wasmContext);
    const selectedActivityData = new XyxyDataSeries(wasmContext);
    const bars = (dataSeries, fill) =>
        new FastRectangleRenderableSeries(wasmContext, {
            dataSeries,
            columnXMode: EColumnMode.StartEnd, // x to x1: when the emitter started and stopped
            columnYMode: EColumnYMode.TopBottom, // y to y1: the emitter's row
            fill,
            strokeThickness: 0
        });
    timeline.renderableSeries.add(bars(activityData, "#50C7E0AA"), bars(selectedActivityData, SELECTED));
    timeline.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }), new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }));

    // Line up the left axes of the three stacked charts
    const group = new SciChartVerticalGroup();
    [spectrum, waterfall, timeline].forEach((surface) => group.addSurfaceToGroup(surface));

    // --- 4. Direction finding: a compass rose with the bearings measured for the selected emitter ---
    const { sciChartSurface: df } = await SciChartPolarSurface.create(ui.dfDiv, { theme });
    const compass = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, 360),
        autoRange: EAutoRange.Never,
        startAngle: Math.PI / 2, // 000° at the top
        flippedCoordinates: true, // bearings increase clockwise
        autoTicks: false,
        majorDelta: 45,
        polarLabelMode: EPolarLabelMode.Horizontal,
        drawMinorGridLines: false,
        drawMajorBands: false
    });
    compass.labelProvider.formatLabel = (value) => (value >= 359.5 ? "" : `${Math.round(value).toString().padStart(3, "0")}°`);
    df.xAxes.add(compass);
    df.yAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            visibleRange: new NumberRange(0, 1.05),
            autoRange: EAutoRange.Never,
            startAngle: Math.PI / 2,
            drawLabels: false,
            drawMinorGridLines: false,
            drawMajorBands: false
        })
    );
    // A histogram of bearing cuts in 2° slices: its spread shows how precise the DF is for this signal
    const BEARING_SLICE = 2;
    const histogramData = new XyxDataSeries(wasmContext);
    const meanBearingData = new XyDataSeries(wasmContext);
    const otherEmittersData = new XyDataSeries(wasmContext); // the other emitters' mean bearings, round the rim
    const otherLabelData = new XyTextDataSeries(wasmContext);
    df.renderableSeries.add(
        new PolarColumnRenderableSeries(wasmContext, {
            dataSeries: histogramData,
            columnXMode: EColumnMode.StartEnd,
            fill: SELECTED + "CC",
            strokeThickness: 0
        }),
        new PolarLineRenderableSeries(wasmContext, { dataSeries: meanBearingData, stroke: SELECTED, strokeThickness: 2 }),
        new PolarXyScatterRenderableSeries(wasmContext, {
            dataSeries: otherEmittersData,
            pointMarker: new EllipsePointMarker(wasmContext, { width: 9, height: 9, fill: "#50C7E0", stroke: "#FFFFFF", strokeThickness: 1 })
        }),
        new PolarTextRenderableSeries(wasmContext, {
            dataSeries: otherLabelData,
            dataLabels: {
                style: { fontSize: 12, fontFamily: "Arial" },
                color: "#E6F0FF",
                horizontalTextPosition: EHorizontalTextPosition.Center,
                verticalTextPosition: EVerticalTextPosition.Below
            }
        })
    );

    // --- Selection: one emitter is highlighted in every view ---
    let selectedId = null;
    const labels = new Map(); // emitter id -> its label on the spectrum
    const visibleTracks = () => tracks.filter((tr) => tr.rowsOn >= 3);
    function select(id) {
        selectedId = id;
        refreshViews();
    }

    // --- Running the receiver: one spectrum every ROW_SECONDS ---
    const maxHold = new Float64Array(BINS).fill(-200);
    let simTime = 0;
    let lastDetection = { detections: [], floor: NOISE_DB, threshold: NOISE_DB + THRESHOLD_DB };
    function nextSpectrum() {
        const row = rows.pop(); // reuse the oldest row's array for the newest spectrum
        simulateSpectrum(simTime, row);
        rows.unshift(row);
        lastDetection = detect(row, simTime);
        updateTracks(lastDetection.detections, simTime);
        for (let i = 0; i < BINS; i++) if (row[i] > maxHold[i]) maxHold[i] = row[i];
        simTime += ROW_SECONDS;
    }
    // The fast views: the spectrum traces and the waterfall
    function drawSpectra() {
        liveData.clear();
        liveData.appendRange(frequencies, rows[0]);
        maxHoldData.clear();
        maxHoldData.appendRange(frequencies, maxHold);
        thresholdLine.y1 = lastDetection.threshold;
        waterfallData.setZValues(rows);
    }
    // The slower views: emitter list, labels, timeline and DF, a few times a second
    function refreshViews() {
        const now = simTime;
        const shown = visibleTracks();
        shown.forEach((tr) => (tr.type = classify(tr, now)));
        if (!shown.some((tr) => tr.id === selectedId)) {
            const hopper = shown.find((tr) => tr.type === "Frequency hopper");
            selectedId = hopper ? hopper.id : shown.length ? shown[0].id : null;
        }
        const selected = shown.find((tr) => tr.id === selectedId);

        // Emitter labels on the spectrum
        for (const tr of shown) {
            let label = labels.get(tr.id);
            if (!label) {
                label = new TextAnnotation({
                    text: tr.id,
                    xCoordinateMode: ECoordinateMode.DataValue,
                    yCoordinateMode: ECoordinateMode.Relative,
                    y1: 0.02,
                    fontSize: 12,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Top
                });
                labels.set(tr.id, label);
                spectrum.annotations.add(label);
            }
            label.x1 = tr.hops >= 3 ? (tr.fMin + tr.fMax) / 2 : tr.f;
            label.textColor = tr.id === selectedId ? SELECTED : "#E6F0FF";
        }

        for (const [id, label] of labels) {
            if (!shown.some((tr) => tr.id === id)) {
                spectrum.annotations.remove(label);
                labels.delete(id);
            }
        }

        // The selection band on the spectrum and waterfall
        for (const band of [spectrumBand, waterfallBand]) {
            band.isHidden = !selected;
            if (selected) {
                const half = Math.max(selected.bw, 0.05) / 2;
                const hopping = selected.hops >= 3;
                band.x1 = (hopping ? selected.fMin : selected.f) - half;
                band.x2 = (hopping ? selected.fMax : selected.f) + half;
            }
        }

        // The timeline: x is seconds before now, y is the emitter's row
        const all = { x: [], y: [], x1: [], y1: [] };
        const sel = { x: [], y: [], x1: [], y1: [] };
        shown.forEach((tr, row) => {
            const target = tr.id === selectedId ? sel : all;
            for (const [start, end] of tr.intervals) {
                target.x.push(start - now);
                target.x1.push(Math.max(end - now, start - now + 0.15)); // at least wide enough to see
                target.y.push(row - 0.32);
                target.y1.push(row + 0.32);
            }
        });
        activityData.clear();
        activityData.appendRange(all.x, all.y, all.x1, all.y1);
        selectedActivityData.clear();
        selectedActivityData.appendRange(sel.x, sel.y, sel.x1, sel.y1);
        timelineY.labelProvider.formatLabel = (value) => (shown[Math.round(value)] ? shown[Math.round(value)].id : "");
        timelineY.visibleRange = new NumberRange(-0.5, Math.max(shown.length, 5) - 0.5);

        // Direction finding: the histogram of the selected emitter's bearing cuts, and the others' mean bearings
        histogramData.clear();
        meanBearingData.clear();
        otherEmittersData.clear();
        otherLabelData.clear();
        if (selected) {
            const counts = new Float64Array(360 / BEARING_SLICE);
            for (const b of selected.bearings) counts[Math.floor(b / BEARING_SLICE) % counts.length]++;
            const most = Math.max(...counts);
            const x = [];
            const x1 = [];
            const y = [];
            counts.forEach((c, i) => {
                if (c === 0) return;
                x.push(i * BEARING_SLICE);
                x1.push((i + 1) * BEARING_SLICE);
                y.push((0.9 * c) / most);
            });
            histogramData.appendRange(x, y, x1);
            meanBearingData.appendRange([selected.bearing, selected.bearing], [0, 1]);
            const spread = Math.sqrt(
                selected.bearings.reduce((sum, b) => sum + angleDiff(b, selected.bearing) ** 2, 0) / selected.bearings.length
            );
            ui.dfHeading.textContent = `Direction finding: ${selected.id} on ${Math.round(selected.bearing)
                .toString()
                .padStart(3, "0")}° (spread ±${spread.toFixed(1)}°, ${selected.bearings.length} cuts)`;
        }
        const others = shown.filter((tr) => tr !== selected);
        otherEmittersData.appendRange(
            others.map((tr) => tr.bearing),
            others.map(() => 0.97)
        );
        otherLabelData.appendRange(
            others.map((tr) => tr.bearing),
            others.map(() => 0.9),
            others.map((tr) => tr.id)
        );

        // The emitter list
        const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(0).padStart(2, "0")}`;
        const cell = "padding:2px 4px; font-size:12px; border-bottom:1px solid #ffffff22; white-space:nowrap;";
        ui.list.innerHTML =
            `<table style="border-collapse:collapse; width:100%;"><thead><tr style="text-align:left; color:#c8d3e8">` +
            ["ID", "Centre MHz", "Width kHz", "Type guess", "Bearing", "Seen"].map((h) => `<th style="${cell}">${h}</th>`).join("") +
            `</tr></thead><tbody>` +
            shown
                .map((tr) => {
                    const centre = tr.hops >= 3 ? `${tr.fMin.toFixed(2)} to ${tr.fMax.toFixed(2)}` : tr.f.toFixed(3);
                    const style = tr.id === selectedId ? `background:${SELECTED}33; color:#fff;` : "";
                    return (
                        `<tr data-id="${tr.id}" style="cursor:pointer; ${style}">` +
                        [tr.id, centre, (tr.bw * 1000).toFixed(0), tr.type, `${Math.round(tr.bearing).toString().padStart(3, "0")}°`, `${fmt(tr.firstSeen)}–${fmt(tr.lastSeen)}`]
                            .map((v, i) => `<td style="${cell}${i === 3 ? " white-space:normal;" : ""}">${v}</td>`) // the type guess may wrap
                            .join("") +
                        `</tr>`
                    );
                })
                .join("") +
            `</tbody></table><div style="padding:4px 6px; color:#c8d3e8">Seen: first and last detection, in mm:ss since the receiver started. Width is measured 10 dB below the peak. Type guesses come from bandwidth, duty cycle and hopping alone.</div>`;
    }
    ui.list.addEventListener("click", (e) => {
        const row = e.target instanceof Element ? e.target.closest("tr[data-id]") : null;
        if (row) select(row.getAttribute("data-id"));
    });

    // --- Hover readouts and click-to-select on the three Cartesian charts ---
    function trackAtFrequency(f) {
        let best = null;
        let bestDistance = Infinity;
        for (const tr of visibleTracks()) {
            const lo = (tr.hops >= 3 ? tr.fMin : tr.f) - Math.max(tr.bw, 0.05);
            const hi = (tr.hops >= 3 ? tr.fMax : tr.f) + Math.max(tr.bw, 0.05);
            const distance = f < lo ? lo - f : f > hi ? f - hi : 0;
            if (distance < bestDistance && distance < 0.1) {
                best = tr;
                bestDistance = distance;
            }
        }
        return best;
    }
    function describe(kind, x, y) {
        if (kind === "timeline") {
            const tr = visibleTracks()[Math.round(y)];
            if (!tr) return "";
            const t = simTime + x;
            const on = tr.intervals.some(([s, e]) => t >= s && t <= e);
            return `${tr.id}, ${tr.type.toLowerCase()}: ${on ? "transmitting" : "silent"} ${(-x).toFixed(1)} s ago. Click to select it.`;
        }
        const bin = Math.floor((x - F_START) / BIN_MHZ);
        if (bin < 0 || bin >= BINS) return "";
        const tr = trackAtFrequency(x);
        const what = tr ? ` Near ${tr.id} (${tr.type.toLowerCase()}): click to select it.` : " No tracked emitter here.";
        if (kind === "spectrum") {
            return `Frequency ${x >= 0 ? "+" : ""}${x.toFixed(3)} MHz: now ${rows[0][bin].toFixed(0)} dBFS, max hold ${maxHold[bin].toFixed(0)} dBFS.${what}`;
        }
        const row = Math.floor(y / ROW_SECONDS);
        if (row < 0 || row >= WATERFALL_ROWS) return "";
        return `Frequency ${x >= 0 ? "+" : ""}${x.toFixed(3)} MHz, ${y.toFixed(1)} s ago: ${rows[row][bin].toFixed(0)} dBFS.${what}`;
    }
    let hover = null;
    const defaultText = "Hover over the spectrum, waterfall or timeline to read values. Click a signal or a list row to select an emitter.";
    function showReadout() {
        ui.readout.textContent = (hover && describe(hover.kind, hover.x, hover.y)) || defaultText;
    }
    function createReadoutModifier(kind) {
        class ReadoutModifier extends CustomChartModifier2D {
            downAt = null; // where the mouse button went down, to tell a click from a drag
            toData(args) {
                const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
                if (!point) return null;
                return {
                    x: this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(point.x),
                    y: this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator().getDataValue(point.y)
                };
            }
            modifierMouseMove(args) {
                super.modifierMouseMove(args);
                const p = this.toData(args);
                hover = p ? { kind, ...p } : null;
                showReadout();
            }
            modifierMouseDown(args) {
                super.modifierMouseDown(args);
                this.downAt = args.mousePoint;
            }
            // A click (not a drag, which pans) selects the emitter under the mouse
            modifierMouseUp(args) {
                super.modifierMouseUp(args);
                const moved = this.downAt ? Math.hypot(args.mousePoint.x - this.downAt.x, args.mousePoint.y - this.downAt.y) : 99;
                const p = moved < 5 ? this.toData(args) : null;
                if (!p) return;
                const tr = kind === "timeline" ? visibleTracks()[Math.round(p.y)] : trackAtFrequency(p.x);
                if (tr) select(tr.id);
            }
            modifierMouseLeave(args) {
                super.modifierMouseLeave(args);
                hover = null;
                showReadout();
            }
        }
        return new ReadoutModifier();
    }
    spectrum.chartModifiers.add(createReadoutModifier("spectrum"));
    waterfall.chartModifiers.add(createReadoutModifier("waterfall"));
    timeline.chartModifiers.add(createReadoutModifier("timeline"));
    showReadout();

    // --- Start with full views, then run in real time ---
    for (let i = 0; i < PREFILL_SECONDS * ROWS_PER_SECOND; i++) nextSpectrum();
    drawSpectra();
    refreshViews();

    let paused = false;
    ui.pauseButton.addEventListener("click", () => {
        paused = !paused;
        ui.pauseButton.textContent = paused ? "Play" : "Pause";
    });
    ui.resetButton.addEventListener("click", () => {
        maxHold.fill(-200);
        drawSpectra();
    });
    // Performance: every waterfall update makes SciChart re-process the whole grid (here 4,096 × 200 = 819,200 cells),
    // however little changed. So new spectra are simulated as they fall due, but the charts are sent at most
    // HEATMAP_UPDATES_PER_SECOND times a second, and the list, timeline and DF plot only four times a second.
    const HEATMAP_UPDATES_PER_SECOND = 20;
    let lastTime = performance.now();
    let due = 0;
    let sinceDraw = 0;
    let sinceViews = 0;
    function animate(now) {
        // Stop when any chart is deleted (for example when a React component unmounts)
        if ([spectrum, waterfall, timeline, df].some((surface) => surface.isDeleted)) return;
        const dt = Math.min(now - lastTime, 250);
        lastTime = now;
        if (!paused) {
            due += dt / 1000 / ROW_SECONDS;
            sinceDraw += dt;
            sinceViews += dt;
            let made = 0;
            while (due >= 1 && made < 5) {
                nextSpectrum();
                due--;
                made++;
            }
            due = Math.min(due, 1);
            if (sinceDraw >= 1000 / HEATMAP_UPDATES_PER_SECOND) {
                sinceDraw = 0;
                drawSpectra();
                if (hover) showReadout();
            }
            if (sinceViews >= 250) {
                sinceViews = 0;
                refreshViews();
            }
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    // #region_A_end
}

sigintDashboard("scichart-root");
