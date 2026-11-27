import * as SciChart from "scichart";

// A simulated RF spectrum analyser: a live spectrum (power in dBm against frequency) above a scrolling waterfall
// (frequency across, time down, colour = power), both on the same frequency axis.
// The band is synthetic and generic: a strong steady carrier with a weaker neighbour, a weak carrier near the noise
// floor, an FM-like signal, a wideband digital channel, a burst transmitter and a frequency hopper.
// The simulation works out what an analyser with a Gaussian resolution bandwidth (RBW) filter would display, so the
// span, RBW and reference level controls change the picture the way they do on a real instrument:
// - a wider RBW raises the noise floor by 10 log10(RBW ratio) dB, merges close signals, and lowers the displayed level
//   of a wideband signal, but not of a carrier;
// - a higher reference level adds input attenuation, which raises the noise floor dB for dB;
// - too little attenuation overloads the first mixer, which makes false intermodulation peaks inside the analyser.
const CENTRE_MHZ = 500;
const SPANS_MHZ = [2, 5, 10, 20, 40];
const RBWS_KHZ = [10, 30, 100, 300, 1000];
const REF_LEVELS_DBM = [0, -10, -20, -30, -40];
const THERMAL_NOISE_DBM_PER_HZ = -174; // kTB at 290 K, per hertz of bandwidth
const NOISE_FIGURE_DB = 20; // the analyser's own noise, above thermal
const GAUSSIAN_ENBW = 1.0645; // noise bandwidth of a Gaussian filter, as a multiple of its 3 dB bandwidth
const MIXER_TOI_DBM = 0; // third-order intercept of the first mixer
const MIN_BINS = 2048;
const MAX_BINS = 8192;
const SPECTRUM_UPDATES_PER_SECOND = 60; // the trace is cheap to redraw
const HEATMAP_UPDATES_PER_SECOND = 30; // a new waterfall row; see the animation loop for why it is capped
const WATERFALL_ROWS = 300; // 10 seconds of history at 30 rows a second
const MAX_WATERFALL_COLUMNS = 2048; // bins are combined by their peak, as a display does with pixels
const AVERAGE_COUNT = 20; // the average trace settles over 20 spectra

// Input attenuation follows the reference level, as with "auto" attenuation on an analyser
const attenuationFor = (refDbm) => Math.min(40, Math.max(0, refDbm + 30));

// Seeded random numbers, so the band looks the same every time the page loads
function makeUniform(seed) {
    let state = seed;
    return () => {
        state = (state * 16807) % 2147483647;
        return (state - 0.5) / 2147483647;
    };
}
// A table of Gaussian (normal) random numbers, read from a random start each spectrum, for fast noise
const GAUSS_SIZE = 1 << 18;
const GAUSS = (() => {
    const uniform = makeUniform(12345);
    const table = new Float32Array(GAUSS_SIZE);
    for (let i = 0; i < GAUSS_SIZE; i++) table[i] = Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform());
    return table;
})();
const pickUniform = makeUniform(777);

// The normal cumulative distribution, from the Abramowitz and Stegun approximation of erf (error below 1.5e-7)
function normalCdf(z) {
    const x = Math.abs(z) / Math.SQRT2;
    const t = 1 / (1 + 0.3275911 * x);
    const erf = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return z >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
}
const dbmToMw = (dbm) => Math.pow(10, dbm / 10);

// The synthetic band. Frequencies in MHz, power in dBm at the analyser's input.
const CARRIER = { name: "steady carrier (CW)", f: 500.3, dbm: -20 };
const FM = { name: "FM-like signal", f: 497.0, dbm: -40 };
const STEADY = [
    CARRIER,
    { name: "weaker carrier 60 kHz above the strong one", f: 500.36, dbm: -45 },
    { name: "weak carrier near the noise floor", f: 502.2, dbm: -85 },
    { name: "distant carrier", f: 514.0, dbm: -70 }
];
const WIDEBAND = { name: "wideband digital channel (4 MHz)", f: 507.0, width: 4, dbm: -40 };
const BURST = { name: "burst transmitter", f: 499.4, width: 0.25, dbm: -50 };
const HOPPER = { name: "frequency hopper", first: 490.5, step: 0.2, channels: 16, width: 0.04, dbm: -55, dwell: 0.1 };
// FM-like signal: constant power, and a width that breathes with its (simulated) audio, by Carson's rule
const fmWidth = (t) => {
    const loudness = Math.abs(0.6 * Math.sin(2 * Math.PI * 0.37 * t) + 0.4 * Math.sin(2 * Math.PI * 1.13 * t + 1));
    const deviation = 0.02 + 0.05 * loudness; // peak deviation, MHz
    return 2 * (deviation + 0.015); // Carson's rule: 2 x (deviation + highest audio frequency)
};
// Bursts: a fixed, seeded schedule that repeats every 60 s
const BURSTS = (() => {
    const uniform = makeUniform(4242);
    const list = [];
    for (let t = 0.3; t < 60; ) {
        const length = 0.12 + 0.35 * uniform();
        list.push([t, t + length]);
        t += length + 0.8 + 2.4 * uniform();
    }
    return list;
})();
const burstOn = (t) => {
    const local = ((t % 60) + 60) % 60;
    return BURSTS.some(([start, end]) => local >= start && local < end);
};
// The hopper's channel at time t: a new pseudo-random channel every dwell
const hopChannel = (t) => {
    const slot = Math.floor(t / HOPPER.dwell);
    const hash = Math.imul(slot ^ 0x5bd1e995, 0x27d4eb2d) >>> 0;
    return HOPPER.first + HOPPER.step * ((hash >>> 7) % HOPPER.channels);
};
// Third-order intermodulation made in an overloaded mixer, at 2f1 - f2 and 2f2 - f1 (levels at the input, in dBm)
function mixerSpurs(attenuation) {
    const carrierAtMixer = CARRIER.dbm - attenuation;
    const fmAtMixer = FM.dbm - attenuation;
    return [
        { name: "intermodulation spur made inside the analyser (2 x 500.3 - 497.0)", f: 2 * CARRIER.f - FM.f, widthScale: 1,
            dbm: 2 * carrierAtMixer + fmAtMixer - 2 * MIXER_TOI_DBM + attenuation },
        { name: "intermodulation spur made inside the analyser (2 x 497.0 - 500.3)", f: 2 * FM.f - CARRIER.f, widthScale: 2,
            dbm: 2 * fmAtMixer + carrierAtMixer - 2 * MIXER_TOI_DBM + attenuation }
    ];
}

// What the analyser is set to, and the numbers that follow from it
function makeConfig(spanMhz, rbwKhz, refDbm) {
    const rbwMhz = rbwKhz / 1000;
    let bins = MIN_BINS;
    while (bins < MAX_BINS && bins < (8 * spanMhz) / rbwMhz) bins *= 2; // at least ~8 bins per RBW, if we can
    const attenuation = attenuationFor(refDbm);
    const floorDbm = THERMAL_NOISE_DBM_PER_HZ + NOISE_FIGURE_DB + attenuation + 10 * Math.log10(GAUSSIAN_ENBW * rbwKhz * 1000);
    const binMhz = spanMhz / bins;
    // Noise is smoothed over about one RBW, by two passes of a box filter this many bins long
    const box = Math.max(1, Math.round(rbwMhz / binMhz));
    const kernel = new Float64Array(2 * box - 1);
    for (let i = 0; i < box; i++) for (let j = 0; j < box; j++) kernel[i + j] += 1 / (box * box);
    const kernelPower = kernel.reduce((sum, w) => sum + w * w, 0);
    return {
        spanMhz, rbwKhz, refDbm, attenuation, floorDbm, bins, binMhz, box,
        noiseScale: 1 / Math.sqrt(2 * kernelPower), // so the smoothed complex noise has a mean power of 1
        startMhz: CENTRE_MHZ - spanMhz / 2,
        sigma: rbwMhz / (2 * Math.sqrt(2 * Math.LN2)), // Gaussian filter: -3 dB at +-RBW/2
        columns: Math.min(bins, MAX_WATERFALL_COLUMNS),
        spurs: mixerSpurs(attenuation)
    };
}

// One spectrum at time t (seconds), in dBm per bin, written into out
function createSpectrumEngine() {
    let cfg = null;
    let steady, noisy, re, im, tmp;
    // Add a carrier: its power times the RBW filter's response
    const addLine = (target, f, mw) => {
        const reach = 6 * cfg.sigma;
        const first = Math.max(0, Math.floor((f - reach - cfg.startMhz) / cfg.binMhz));
        const last = Math.min(cfg.bins - 1, Math.ceil((f + reach - cfg.startMhz) / cfg.binMhz));
        for (let k = first; k <= last; k++) {
            const d = (cfg.startMhz + (k + 0.5) * cfg.binMhz - f) / cfg.sigma;
            target[k] += mw * Math.exp(-0.5 * d * d);
        }
    };
    // Add a flat-topped signal of total power mw spread over width MHz: its power density times the area of the RBW
    // filter that overlaps it. Narrower than the RBW it reads like a carrier; wider, it reads lower by 10 log(width/RBW).
    const addBlock = (target, f, width, mw) => {
        const a = f - width / 2;
        const b = f + width / 2;
        const reach = 6 * cfg.sigma;
        const first = Math.max(0, Math.floor((a - reach - cfg.startMhz) / cfg.binMhz));
        const last = Math.min(cfg.bins - 1, Math.ceil((b + reach - cfg.startMhz) / cfg.binMhz));
        const density = (mw / width) * cfg.sigma * Math.sqrt(2 * Math.PI);
        for (let k = first; k <= last; k++) {
            const x = cfg.startMhz + (k + 0.5) * cfg.binMhz;
            target[k] += density * (normalCdf((b - x) / cfg.sigma) - normalCdf((a - x) / cfg.sigma));
        }
    };
    // Running-sum box filter over a circular buffer
    const boxFilter = (src, dst, n, length) => {
        const half = Math.floor(length / 2);
        let sum = 0;
        for (let j = -half; j < length - half; j++) sum += src[(j + n) % n];
        for (let k = 0; k < n; k++) {
            dst[k] = sum / length;
            sum += src[(k + length - half) % n] - src[(k - half + n) % n];
        }
    };
    return {
        configure(newCfg) {
            cfg = newCfg;
            steady = new Float64Array(cfg.bins);
            noisy = new Float64Array(cfg.bins);
            re = new Float64Array(cfg.bins);
            im = new Float64Array(cfg.bins);
            tmp = new Float64Array(cfg.bins);
        },
        compute(t, out) {
            const n = cfg.bins;
            steady.fill(0);
            noisy.fill(dbmToMw(cfg.floorDbm));
            // Steady carriers and the FM-like signal are deterministic; digital signals are noise-like
            for (const s of STEADY) addLine(steady, s.f, dbmToMw(s.dbm));
            addBlock(steady, FM.f, fmWidth(t), dbmToMw(FM.dbm));
            addBlock(noisy, WIDEBAND.f, WIDEBAND.width, dbmToMw(WIDEBAND.dbm));
            if (burstOn(t)) addBlock(noisy, BURST.f, BURST.width, dbmToMw(BURST.dbm));
            addBlock(steady, hopChannel(t), HOPPER.width, dbmToMw(HOPPER.dbm));
            for (const spur of cfg.spurs) addBlock(steady, spur.f, spur.widthScale * fmWidth(t), dbmToMw(spur.dbm));
            // Complex Gaussian noise, smoothed over about one RBW so neighbouring bins are related, as on an analyser
            let g = Math.floor(pickUniform() * (GAUSS_SIZE - 2 * n));
            for (let k = 0; k < n; k++) {
                re[k] = GAUSS[g++];
                im[k] = GAUSS[g++];
            }
            if (cfg.box > 1) {
                boxFilter(re, tmp, n, cfg.box);
                boxFilter(tmp, re, n, cfg.box);
                boxFilter(im, tmp, n, cfg.box);
                boxFilter(tmp, im, n, cfg.box);
            }
            // Displayed power = |signal amplitude + noise amplitude|^2, in dBm
            const scale = cfg.box > 1 ? cfg.noiseScale : Math.SQRT1_2;
            for (let k = 0; k < n; k++) {
                const noiseAmplitude = Math.sqrt(noisy[k]) * scale;
                const a = Math.sqrt(steady[k]) + noiseAmplitude * re[k];
                const b = noiseAmplitude * im[k];
                out[k] = 10 * Math.log10(a * a + b * b + 1e-30);
            }
        },
        // Name whatever occupies frequency f at time t
        describe(f, t) {
            const near = (centre, width) => Math.abs(f - centre) <= Math.max(width / 2, 0) + 1.5 * cfg.sigma;
            const floor = cfg.floorDbm;
            const visible = (dbm) => dbm > floor - 6;
            for (const spur of cfg.spurs) if (visible(spur.dbm) && near(spur.f, spur.widthScale * fmWidth(t))) return spur.name;
            for (const s of STEADY) if (near(s.f, 0)) return s.name;
            if (near(FM.f, fmWidth(t))) return FM.name;
            if (near(WIDEBAND.f, WIDEBAND.width)) return WIDEBAND.name;
            if (near(BURST.f, BURST.width)) return burstOn(t) ? `${BURST.name}, transmitting` : `${BURST.name}'s frequency, silent now`;
            if (f >= HOPPER.first - 0.1 && f <= HOPPER.first + HOPPER.step * HOPPER.channels) {
                return near(hopChannel(t), HOPPER.width) ? `${HOPPER.name}, on this channel now` : `${HOPPER.name}'s channels`;
            }
            return "noise";
        }
    };
}

// The page layout: controls, a status line and a readout above the two charts. In your app these can be ordinary HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#17243d; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;";
    const controls = document.createElement("div");
    controls.style.cssText = "display:flex; flex-wrap:wrap; gap:6px 16px; align-items:center; padding:8px 12px 4px;";
    const status = document.createElement("div");
    status.style.cssText = "padding:0 12px 2px; color:#c8d3e6; min-height:2.6em;";
    status.setAttribute("aria-live", "polite");
    const readout = document.createElement("div");
    readout.style.cssText = "padding:0 12px 4px; color:#F2D24B; min-height:1.4em;";
    const spectrumDiv = document.createElement("div");
    spectrumDiv.id = `${divElementId}-spectrum`; // SciChart tells its charts apart by their div's id
    spectrumDiv.style.cssText = "flex:1 1 0; min-height:0;";
    const waterfallDiv = document.createElement("div");
    waterfallDiv.id = `${divElementId}-waterfall`;
    waterfallDiv.style.cssText = "flex:1.15 1 0; min-height:0;";
    root.append(controls, status, readout, spectrumDiv, waterfallDiv);
    const addSelect = (id, labelText, options, value, onChange) => {
        const wrap = document.createElement("span");
        wrap.style.cssText = "display:inline-flex; align-items:center; gap:6px;";
        const label = document.createElement("label");
        label.htmlFor = `${divElementId}-${id}`;
        label.textContent = labelText;
        label.style.fontWeight = "600";
        const select = document.createElement("select");
        select.id = `${divElementId}-${id}`;
        select.style.cssText = "font:inherit; background:#22365B; color:#ffffff; border:1px solid #50C7E0; border-radius:6px; padding:2px 6px;";
        for (const [optionValue, text] of options) {
            const option = document.createElement("option");
            option.value = String(optionValue);
            option.textContent = text;
            select.append(option);
        }
        select.value = String(value);
        select.addEventListener("input", () => onChange(select.value));
        wrap.append(label, select);
        controls.append(wrap);
    };
    const pauseButton = document.createElement("button");
    pauseButton.type = "button";
    pauseButton.textContent = "Pause";
    pauseButton.style.cssText =
        "font:inherit; font-weight:600; color:#ffffff; background:#22365B; border:1px solid #F48420; border-radius:6px; padding:3px 12px; cursor:pointer;";
    return { controls, status, readout, spectrumDiv, waterfallDiv, addSelect, pauseButton };
}

async function rfSpectrumAnalyzer(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A live RF spectrum above a scrolling waterfall that shares its frequency axis, charted with SciChart.js.
    // The spectrum engine above supplies one spectrum (dBm per frequency bin) per call; swap in your own receiver data.
    const {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        XyDataSeries,
        FastLineRenderableSeries,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        HorizontalLineAnnotation,
        VerticalLineAnnotation,
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

    const settings = { spanMhz: 20, rbwKhz: 30, refDbm: -10, trace: "clear" };
    let cfg = makeConfig(settings.spanMhz, settings.rbwKhz, settings.refDbm);
    const engine = createSpectrumEngine();
    engine.configure(cfg);

    // --- 1. The spectrum: power in dBm against frequency, 10 dB per division below the reference level ---
    const theme = new SciChartJsNavyTheme();
    const { sciChartSurface: spectrum, wasmContext } = await SciChartSurface.create(ui.spectrumDiv, { theme });
    const frequencyAxisOptions = {
        autoRange: EAutoRange.Never,
        labelPrecision: 1,
        majorGridLineStyle: { color: "#FFFFFF30" },
        minorGridLineStyle: { color: "#FFFFFF10" }
    };
    const spectrumX = new NumericAxis(wasmContext, { ...frequencyAxisOptions, drawLabels: true });
    const powerAxis = new NumericAxis(wasmContext, {
        axisTitle: "Power (dBm)",
        axisAlignment: EAxisAlignment.Left,
        autoRange: EAutoRange.Never, // the reference level fixes the top of the screen
        autoTicks: false,
        majorDelta: 10, // 10 dB per division
        minorDelta: 5,
        labelPrecision: 0
    });
    spectrum.xAxes.add(spectrumX);
    spectrum.yAxes.add(powerAxis);

    const liveData = new XyDataSeries(wasmContext, { dataSeriesName: "Live (clear-write)", dataIsSortedInX: true, containsNaN: false });
    const traceData = new XyDataSeries(wasmContext, { dataSeriesName: "Trace", dataIsSortedInX: true, containsNaN: false });
    const liveLine = new FastLineRenderableSeries(wasmContext, { dataSeries: liveData, stroke: "#50C7E0", strokeThickness: 1 });
    const traceLine = new FastLineRenderableSeries(wasmContext, { dataSeries: traceData, stroke: "#F48420", strokeThickness: 2 });
    spectrum.renderableSeries.add(liveLine, traceLine);
    const floorLine = new HorizontalLineAnnotation({
        y1: cfg.floorDbm,
        stroke: "#F2D24B",
        strokeDashArray: [6, 4],
        strokeThickness: 1,
        showLabel: true,
        labelPlacement: ELabelPlacement.TopRight,
        labelValue: "Noise floor"
    });
    spectrum.annotations.add(floorLine);

    // --- 2. The waterfall: frequency across, time down (newest at the top), colour = power ---
    const { sciChartSurface: waterfall } = await SciChartSurface.create(ui.waterfallDiv, { theme });
    const waterfallX = new NumericAxis(wasmContext, { ...frequencyAxisOptions, axisTitle: "Frequency (MHz)" });
    const timeAxis = new NumericAxis(wasmContext, {
        axisTitle: "Seconds ago",
        axisAlignment: EAxisAlignment.Left,
        flippedCoordinates: true, // newest row at the top
        autoRange: EAutoRange.Never,
        visibleRange: new NumberRange(0, WATERFALL_ROWS / HEATMAP_UPDATES_PER_SECOND),
        labelPrecision: 0
    });
    waterfall.xAxes.add(waterfallX);
    waterfall.yAxes.add(timeAxis);
    const colorMap = new HeatmapColorMap({
        gradientStops: [
            { offset: 0, color: "#050B1E" },
            { offset: 0.2, color: "#0C2361" },
            { offset: 0.4, color: "#1F6FD1" },
            { offset: 0.55, color: "#36C2CE" },
            { offset: 0.7, color: "#F2D24B" },
            { offset: 0.85, color: "#F48420" },
            { offset: 1, color: "#FFF4E6" }
        ]
    });
    const waterfallData = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1 / HEATMAP_UPDATES_PER_SECOND,
        zValues: [[0]]
    });
    waterfall.renderableSeries.add(
        new UniformHeatmapRenderableSeries(wasmContext, { dataSeries: waterfallData, colorMap, fillValuesOutOfRange: true })
    );

    // Line up the two charts' plot areas, and keep their frequency axes in step when either is zoomed or panned
    const group = new SciChartVerticalGroup();
    group.addSurfaceToGroup(spectrum);
    group.addSurfaceToGroup(waterfall);
    let syncing = false;
    const follow = (from, to) =>
        from.visibleRangeChanged.subscribe((args) => {
            if (syncing) return;
            syncing = true;
            to.visibleRange = args.visibleRange;
            syncing = false;
        });
    follow(spectrumX, waterfallX);
    follow(waterfallX, spectrumX);
    for (const surface of [spectrum, waterfall]) {
        surface.chartModifiers.add(
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
    }

    // --- State: the latest spectrum, the trace (clear-write, max-hold or average) and the waterfall rows ---
    let simTime = 30; // seconds; the band runs on simulated time, so Pause freezes it
    let frequencies, live, trace, averageMw, averaged, rows, rowTimes;
    const decimate = (src, dst) => {
        // Each waterfall column takes the peak of the bins it covers, so narrow signals don't vanish
        const factor = cfg.bins / cfg.columns;
        for (let c = 0; c < cfg.columns; c++) {
            let peak = -Infinity;
            for (let k = c * factor; k < (c + 1) * factor; k++) peak = Math.max(peak, src[k]);
            dst[c] = peak;
        }
    };
    const resetTrace = () => {
        trace.set(live);
        averageMw.fill(0);
        averaged = 0;
    };

    // Apply the span, RBW and reference level: new bins, new axes, and a waterfall history rebuilt for them
    const configure = () => {
        cfg = makeConfig(settings.spanMhz, settings.rbwKhz, settings.refDbm);
        engine.configure(cfg);
        frequencies = Float64Array.from({ length: cfg.bins }, (_, k) => cfg.startMhz + (k + 0.5) * cfg.binMhz);
        live = new Float64Array(cfg.bins);
        trace = new Float64Array(cfg.bins);
        averageMw = new Float64Array(cfg.bins);
        engine.compute(simTime, live);
        resetTrace();
        const range = new NumberRange(cfg.startMhz, cfg.startMhz + cfg.spanMhz);
        spectrumX.visibleRange = range;
        waterfallX.visibleRange = range;
        spectrumX.labelProvider.precision = settings.spanMhz <= 5 ? 2 : 1;
        waterfallX.labelProvider.precision = settings.spanMhz <= 5 ? 2 : 1;
        powerAxis.visibleRange = new NumberRange(settings.refDbm - 100, settings.refDbm);
        floorLine.y1 = cfg.floorDbm;
        colorMap.minimum = settings.refDbm - 100;
        colorMap.maximum = settings.refDbm;
        // The band is a function of time, so the last 10 seconds can be recomputed for the new settings
        const scratch = new Float64Array(cfg.bins);
        rows = [];
        rowTimes = [];
        for (let r = 0; r < WATERFALL_ROWS; r++) {
            const t = simTime - r / HEATMAP_UPDATES_PER_SECOND;
            engine.compute(t, scratch);
            const row = new Float64Array(cfg.columns);
            decimate(scratch, row);
            rows.push(row);
            rowTimes.push(t);
        }
        waterfallData.xStart = cfg.startMhz;
        waterfallData.xStep = cfg.spanMhz / cfg.columns;
        waterfallData.setZValues(rows);
        drawSpectrum();
        describeSettings();
    };

    const drawSpectrum = () => {
        liveData.clear();
        liveData.appendRange(frequencies, live);
        traceData.clear();
        if (settings.trace !== "clear") traceData.appendRange(frequencies, trace);
    };

    // One new spectrum: update the trace (max-hold keeps the highest value per bin; average is a power average)
    const step = () => {
        engine.compute(simTime, live);
        if (settings.trace === "max") {
            for (let k = 0; k < cfg.bins; k++) if (live[k] > trace[k]) trace[k] = live[k];
        } else if (settings.trace === "average") {
            averaged = Math.min(averaged + 1, AVERAGE_COUNT);
            for (let k = 0; k < cfg.bins; k++) {
                averageMw[k] += (Math.pow(10, live[k] / 10) - averageMw[k]) / averaged;
                trace[k] = 10 * Math.log10(averageMw[k]);
            }
        }
        drawSpectrum();
    };
    // One new waterfall row at the top; the oldest row's buffer is reused for it
    const addWaterfallRow = () => {
        const row = rows.pop();
        rowTimes.pop();
        decimate(live, row);
        rows.unshift(row);
        rowTimes.unshift(simTime);
        waterfallData.setZValues(rows);
    };

    // --- Readout: frequency, power and what is there, under the mouse on either chart ---
    let hover = null;
    const marker = (surface) => {
        const line = new VerticalLineAnnotation({ x1: CENTRE_MHZ, stroke: "#FFFFFF99", strokeThickness: 1, isHidden: true });
        surface.annotations.add(line);
        return line;
    };
    const markers = [marker(spectrum), marker(waterfall)];
    const showReadout = () => {
        if (!hover) {
            markers.forEach((m) => (m.isHidden = true));
            ui.readout.textContent = "Hover over either chart to read frequency, power and (on the waterfall) time.";
            return;
        }
        markers.forEach((m) => {
            m.x1 = hover.f;
            m.isHidden = false;
        });
        const bin = Math.min(cfg.bins - 1, Math.max(0, Math.floor((hover.f - cfg.startMhz) / cfg.binMhz)));
        if (hover.chart === "spectrum") {
            const shown = settings.trace === "clear" ? live : trace;
            ui.readout.textContent = `${hover.f.toFixed(3)} MHz, ${shown[bin].toFixed(1)} dBm: ${engine.describe(hover.f, simTime)}.`;
        } else {
            const row = Math.min(WATERFALL_ROWS - 1, Math.max(0, Math.floor(hover.secondsAgo * HEATMAP_UPDATES_PER_SECOND)));
            const column = Math.min(cfg.columns - 1, Math.floor((bin * cfg.columns) / cfg.bins));
            ui.readout.textContent =
                `${hover.f.toFixed(3)} MHz, ${(row / HEATMAP_UPDATES_PER_SECOND).toFixed(1)} s ago, ` +
                `${rows[row][column].toFixed(1)} dBm: ${engine.describe(hover.f, rowTimes[row])}.`;
        }
    };
    class ReadoutModifier extends CustomChartModifier2D {
        modifierMouseMove(args) {
            super.modifierMouseMove(args);
            const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            hover = null;
            if (point) {
                const f = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(point.x);
                const y = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator().getDataValue(point.y);
                const inSpan = f >= cfg.startMhz && f <= cfg.startMhz + cfg.spanMhz;
                if (inSpan) hover = this.parentSurface === spectrum ? { chart: "spectrum", f } : { chart: "waterfall", f, secondsAgo: y };
            }
            showReadout();
        }
        modifierMouseLeave(args) {
            super.modifierMouseLeave(args);
            hover = null;
            showReadout();
        }
    }
    spectrum.chartModifiers.add(new ReadoutModifier());
    waterfall.chartModifiers.add(new ReadoutModifier());

    // --- Controls ---
    const describeSettings = () => {
        const binKhz = cfg.binMhz * 1000;
        let text =
            `Centre ${CENTRE_MHZ} MHz, span ${cfg.spanMhz} MHz, RBW ${cfg.rbwKhz} kHz, ${cfg.bins.toLocaleString("en-US")} bins ` +
            `(${binKhz.toFixed(1)} kHz apart), reference level ${cfg.refDbm} dBm with ${cfg.attenuation} dB attenuation, ` +
            `noise floor ${cfg.floorDbm.toFixed(0)} dBm. Simulated data.`;
        if (CARRIER.dbm > cfg.refDbm) text += ` The ${CARRIER.dbm} dBm carrier is above the reference level and off the top of the screen.`;
        const spur = cfg.spurs.find((s) => s.dbm > cfg.floorDbm);
        if (spur) text += ` Too little attenuation: the mixer is overloaded and makes false peaks.`;
        ui.status.textContent = text;
    };
    ui.addSelect("span", "Span", SPANS_MHZ.map((s) => [s, `${s} MHz`]), settings.spanMhz, (v) => {
        settings.spanMhz = Number(v);
        configure();
    });
    ui.addSelect("rbw", "RBW", RBWS_KHZ.map((r) => [r, r >= 1000 ? `${r / 1000} MHz` : `${r} kHz`]), settings.rbwKhz, (v) => {
        settings.rbwKhz = Number(v);
        configure();
    });
    ui.addSelect("ref", "Reference level", REF_LEVELS_DBM.map((r) => [r, `${r} dBm`]), settings.refDbm, (v) => {
        settings.refDbm = Number(v);
        configure();
    });
    const traces = [
        ["clear", "Clear-write"],
        ["max", "Max-hold"],
        ["average", "Average"]
    ];
    ui.addSelect("trace", "Trace", traces, settings.trace, (v) => {
        settings.trace = v;
        traceLine.stroke = v === "max" ? "#F48420" : "#7BE07B";
        liveLine.opacity = v === "clear" ? 1 : 0.45;
        resetTrace();
        drawSpectrum();
        showReadout();
    });
    let paused = false;
    ui.pauseButton.addEventListener("click", () => {
        paused = !paused;
        ui.pauseButton.textContent = paused ? "Play" : "Pause";
    });
    ui.controls.append(ui.pauseButton);

    configure();
    showReadout();

    // --- The animation: the spectrum redraws up to 60 times a second, the waterfall gains a row 30 times a second ---
    // Performance: every heatmap update makes SciChart re-process the whole grid (here up to 2,048 x 300 cells),
    // however little changed, so waterfall rows are capped at HEATMAP_UPDATES_PER_SECOND. The spectrum line is cheap.
    let lastFrame = 0;
    let sinceRow = 0;
    let handle = 0;
    const animate = (now) => {
        if (spectrum.isDeleted || waterfall.isDeleted) return; // stop when the charts are deleted
        const dt = lastFrame ? Math.min(now - lastFrame, 100) : 0;
        if (dt >= 1000 / SPECTRUM_UPDATES_PER_SECOND - 2 || !lastFrame) {
            lastFrame = now;
            if (!paused) {
                simTime += dt / 1000;
                sinceRow += dt;
                step();
                if (sinceRow >= 1000 / HEATMAP_UPDATES_PER_SECOND - 2) {
                    sinceRow = 0;
                    addWaterfallRow();
                }
                if (hover) showReadout();
            }
        }
        handle = requestAnimationFrame(animate);
    };
    handle = requestAnimationFrame(animate);
    spectrum.addDeletable({ delete: () => cancelAnimationFrame(handle) });
    // #region_A_end
}

rfSpectrumAnalyzer("scichart-root");
