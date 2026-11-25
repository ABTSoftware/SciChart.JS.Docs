import * as SciChart from "scichart";

// #region_A_start
// Autocorrelation and cross-correlation: find a signal's period, or the delay between two signals,
// and chart the correlation against lag with SciChart.js.
// The correlation helpers below are plain JavaScript with no dependencies, so you can use them anywhere.

const SAMPLE_RATE = 8000; // samples per second, so one sample is 0.125 ms
const N = 1000; // samples in each signal (125 ms)
const MAX_ACF_LAG = 500; // autocorrelation lags shown: 0 to 500 samples (62.5 ms)
const TEMPLATE_LENGTH = 200; // the reference chirp: 200 samples (25 ms)

// Subtract the average, so the correlation measures how the signal varies, not its offset
function removeMean(values) {
    let mean = 0;
    for (let i = 0; i < values.length; i++) mean += values[i];
    mean /= values.length;
    return values.map((v) => v - mean);
}

// Sample autocorrelation r[k] for lags 0 to maxLag, normalised so r[0] = 1.
// Biased: divide every lag's sum by N (the usual ACF estimate; it tapers towards zero at large lags).
// Unbiased: divide by N - k, the number of products actually summed (no taper, but noisier at large lags).
function autocorrelation(values, maxLag, unbiased) {
    const n = values.length;
    const x = removeMean(values);
    const r = new Float64Array(maxLag + 1);
    for (let k = 0; k <= maxLag; k++) {
        let sum = 0;
        for (let i = 0; i + k < n; i++) sum += x[i] * x[i + k]; // the signal times a copy shifted by k
        r[k] = unbiased ? sum / (n - k) : sum / n;
    }
    const r0 = r[0] || 1;
    return r.map((v) => v / r0);
}

// Normalised cross-correlation for finding a short template in a longer signal. For each lag, the template
// is lined up with signal[lag ... lag + M - 1] and the two are compared with the Pearson correlation
// coefficient: 1 is a perfect match, 0 no relationship, -1 a perfect inverted match.
function slidingCorrelation(template, signal) {
    const m = template.length;
    const t = removeMean(template);
    let tEnergy = 0;
    for (let j = 0; j < m; j++) tEnergy += t[j] * t[j];
    const lags = signal.length - m + 1; // only lags where the template lies wholly inside the signal
    const r = new Float64Array(lags);
    for (let lag = 0; lag < lags; lag++) {
        let mean = 0;
        for (let j = 0; j < m; j++) mean += signal[lag + j];
        mean /= m;
        let sum = 0;
        let sEnergy = 0;
        for (let j = 0; j < m; j++) {
            const s = signal[lag + j] - mean;
            sum += t[j] * s;
            sEnergy += s * s;
        }
        const denominator = Math.sqrt(tEnergy * sEnergy);
        r[lag] = denominator > 1e-12 ? sum / denominator : 0;
    }
    return r;
}

// Fit a parabola through a peak and its two neighbours, for a lag finer than one sample
function refinePeak(r, i) {
    if (i <= 0 || i >= r.length - 1) return i;
    const a = r[i - 1];
    const b = r[i];
    const c = r[i + 1];
    const curvature = a - 2 * b + c;
    return curvature < 0 ? i + (0.5 * (a - c)) / curvature : i;
}

// The period is the first autocorrelation peak, after the curve first drops below zero, that comes within
// 90% of the highest one. Skipping the first lobe stops lag 0 (where every signal matches itself) from
// winning; taking the first near-highest peak stops a repeat at 2 or 3 periods being picked by mistake.
function findPeriod(acf) {
    let start = 1;
    while (start < acf.length && acf[start] > 0) start++;
    if (start >= acf.length - 1) return null;
    let highest = -Infinity;
    for (let k = start; k < acf.length; k++) highest = Math.max(highest, acf[k]);
    for (let k = start + 1; k < acf.length - 1; k++) {
        const isPeak = acf[k] >= acf[k - 1] && acf[k] >= acf[k + 1];
        if (isPeak && acf[k] >= 0.9 * highest) return refinePeak(acf, k);
    }
    return null;
}

// The index of the largest value: the best-matching lag
function findPeak(r) {
    let best = 0;
    for (let i = 1; i < r.length; i++) if (r[i] > r[best]) best = i;
    return best;
}

// Seeded random numbers, so the noise is the same every time. gaussian() has mean 0 and standard deviation 1.
function makeNoise(count, seed) {
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const noise = new Float64Array(count);
    for (let i = 0; i < count; i++) {
        // Box-Muller: two uniform numbers to one normally distributed number
        noise[i] = Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    }
    return noise;
}
const NOISE = makeNoise(N, 12345);

// A voice-like periodic wave: a fundamental of pitchHz plus two harmonics, with added noise
function makeVoicedSignal(pitchHz, noiseLevel) {
    const values = new Float64Array(N);
    for (let i = 0; i < N; i++) {
        const phase = (2 * Math.PI * pitchHz * i) / SAMPLE_RATE;
        values[i] = Math.sin(phase) + 0.6 * Math.sin(2 * phase + 0.8) + 0.3 * Math.sin(3 * phase + 1.7) + noiseLevel * NOISE[i];
    }
    return values;
}

// A chirp (a tone sweeping from 300 Hz to 1,500 Hz) with smooth Hann-shaped ends, like a sonar or radar ping
function makeChirp() {
    const chirp = new Float64Array(TEMPLATE_LENGTH);
    const duration = TEMPLATE_LENGTH / SAMPLE_RATE;
    for (let i = 0; i < TEMPLATE_LENGTH; i++) {
        const t = i / SAMPLE_RATE;
        const envelope = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (TEMPLATE_LENGTH - 1));
        chirp[i] = envelope * Math.sin(2 * Math.PI * (300 * t + ((1500 - 300) * t * t) / (2 * duration)));
    }
    return chirp;
}
const CHIRP = makeChirp();

// The echo: the chirp delayed by delaySamples, at 80% strength, buried in noise
function makeEcho(delaySamples, noiseLevel) {
    const values = new Float64Array(N);
    for (let i = 0; i < N; i++) {
        const j = i - delaySamples;
        values[i] = (j >= 0 && j < TEMPLATE_LENGTH ? 0.8 * CHIRP[j] : 0) + noiseLevel * NOISE[i];
    }
    return values;
}

async function createCorrelationCharts(signalDiv, correlationDiv) {
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
        ELabelPlacement,
        ELegendPlacement,
        FastLineRenderableSeries,
        XyDataSeries,
        VerticalLineAnnotation,
        HorizontalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const toMs = (samples) => (samples * 1000) / SAMPLE_RATE;
    const xZoom = () => [
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    ];

    // Top chart: the signal, and a copy shifted by the chosen lag
    const top = await SciChartSurface.create(signalDiv, { theme: new SciChartJsNavyTheme() });
    const timeAxis = new NumericAxis(top.wasmContext, { axisTitle: "Time (ms)", labelPrecision: 0 });
    top.sciChartSurface.xAxes.add(timeAxis);
    top.sciChartSurface.yAxes.add(
        new NumericAxis(top.wasmContext, { axisTitle: "Signal", autoRange: EAutoRange.Always, growBy: new NumberRange(0.1, 0.1), labelPrecision: 1 })
    );
    const signalSeries = new XyDataSeries(top.wasmContext, { dataSeriesName: "Signal", dataIsSortedInX: true });
    const shiftedSeries = new XyDataSeries(top.wasmContext, { dataSeriesName: "Shifted copy", dataIsSortedInX: true });
    top.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(top.wasmContext, { dataSeries: signalSeries, stroke: "#50C7E0", strokeThickness: 1.5 }),
        new FastLineRenderableSeries(top.wasmContext, { dataSeries: shiftedSeries, stroke: "#F48420", strokeThickness: 2.5 })
    );
    const topLegend = new LegendModifier({ showCheckboxes: false });
    top.sciChartSurface.chartModifiers.add(topLegend, ...xZoom());

    // Bottom chart: the correlation at every lag, from -1 to 1
    const bottom = await SciChartSurface.create(correlationDiv, { theme: new SciChartJsNavyTheme() });
    const lagAxis = new NumericAxis(bottom.wasmContext, { axisTitle: "Lag (ms)", labelPrecision: 0 });
    bottom.sciChartSurface.xAxes.add(lagAxis);
    bottom.sciChartSurface.yAxes.add(
        new NumericAxis(bottom.wasmContext, { axisTitle: "Correlation", visibleRange: new NumberRange(-1.1, 1.1), labelPrecision: 1 })
    );
    const correlationSeries = new XyDataSeries(bottom.wasmContext, { dataSeriesName: "Autocorrelation", dataIsSortedInX: true });
    bottom.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(bottom.wasmContext, { dataSeries: correlationSeries, stroke: "#50C7E0", strokeThickness: 2 })
    );
    // The detected peak (green), the lag shown in the top chart (orange), and the 95% band for white noise
    const peakLine = new VerticalLineAnnotation({
        stroke: "#3BD16F",
        strokeThickness: 2,
        showLabel: true,
        labelPlacement: ELabelPlacement.TopRight,
        axisLabelFill: "#3BD16F"
    });
    const lagLine = new VerticalLineAnnotation({ stroke: "#F48420", strokeDashArray: [6, 4], strokeThickness: 2 });
    const band = 1.96 / Math.sqrt(N); // white noise stays inside +-1.96 / sqrt(N) at 95% of lags
    const bandLines = [band, -band].map(
        (y) =>
            new HorizontalLineAnnotation({
                y1: y,
                stroke: "#FFFFFF88",
                strokeDashArray: [2, 4],
                showLabel: y > 0,
                labelValue: "95% band for noise",
                axisLabelStroke: "#C8D3E6",
                labelPlacement: ELabelPlacement.TopLeft
            })
    );
    bottom.sciChartSurface.annotations.add(peakLine, lagLine, ...bandLines);
    const bottomLegend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight });
    bottom.sciChartSurface.chartModifiers.add(
        bottomLegend,
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            tooltipDataTemplate: (infos) => infos.map((info) => `Lag ${info.formattedXValue} ms: r = ${info.yValue.toFixed(3)}`)
        }),
        ...xZoom()
    );

    // Recompute everything from the settings: { mode, pitchHz, delayMs, noise, unbiased, lagMs }
    const update = (s) => {
        const lag = Math.round((s.lagMs * SAMPLE_RATE) / 1000); // the lag in samples
        const times = Array.from({ length: N }, (_, i) => toMs(i));
        signalSeries.clear();
        shiftedSeries.clear();
        correlationSeries.clear();
        let result;

        if (s.mode === "auto") {
            // Autocorrelation: compare the signal with itself, delayed by each lag in turn
            const x = makeVoicedSignal(s.pitchHz, s.noise);
            const acf = autocorrelation(x, MAX_ACF_LAG, s.unbiased);
            // Detect the period on the biased ACF: its taper makes the first repeat the highest peak
            const periodSamples = findPeriod(s.unbiased ? autocorrelation(x, MAX_ACF_LAG, false) : acf);
            signalSeries.appendRange(times, x);
            shiftedSeries.appendRange(times.slice(lag), x.slice(0, N - lag)); // x[n - lag], drawn at n
            correlationSeries.appendRange(Array.from(acf, (_, k) => toMs(k)), acf);
            result = { peakMs: periodSamples === null ? null : toMs(periodSamples), rAtLag: acf[Math.min(lag, MAX_ACF_LAG)] };
        } else {
            // Cross-correlation: slide the reference chirp along the received signal
            const y = makeEcho(Math.round((s.delayMs * SAMPLE_RATE) / 1000), s.noise);
            const r = slidingCorrelation(CHIRP, y);
            const best = findPeak(r);
            signalSeries.appendRange(times, y);
            shiftedSeries.appendRange(times.slice(lag, lag + TEMPLATE_LENGTH), CHIRP.slice(0, N - lag)); // the template at this lag
            correlationSeries.appendRange(Array.from(r, (_, k) => toMs(k)), r);
            result = { peakMs: toMs(best), peakValue: r[best], rAtLag: r[Math.min(lag, r.length - 1)] };
        }

        const auto = s.mode === "auto";
        signalSeries.dataSeriesName = auto ? "Signal" : "Received signal";
        shiftedSeries.dataSeriesName = auto ? `Signal delayed by ${s.lagMs} ms` : `Reference chirp at lag ${s.lagMs} ms`;
        correlationSeries.dataSeriesName = auto
            ? `Autocorrelation (${s.unbiased ? "unbiased" : "biased"})`
            : "Normalised cross-correlation";
        // The legends don't watch series names, so ask them to redraw with the new ones
        topLegend.sciChartLegend?.invalidateLegend();
        bottomLegend.sciChartLegend?.invalidateLegend();
        timeAxis.visibleRange = new NumberRange(0, auto ? 40 : toMs(N));
        lagAxis.visibleRange = new NumberRange(0, toMs(auto ? MAX_ACF_LAG : N - TEMPLATE_LENGTH));
        bandLines.forEach((line) => (line.isHidden = !auto));
        peakLine.isHidden = result.peakMs === null;
        if (result.peakMs !== null) {
            peakLine.x1 = result.peakMs;
            peakLine.labelValue = `${auto ? "Period" : "Delay"} ${result.peakMs.toFixed(2)} ms`;
        }
        lagLine.x1 = s.lagMs;
        return result;
    };
    return { update, maxLagMs: { auto: toMs(MAX_ACF_LAG), cross: toMs(N - TEMPLATE_LENGTH) } };
}
// #region_A_end

// The page layout: a row of controls and a results line above the two charts. In your app these can be ordinary HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#17243d; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;";
    const controls = document.createElement("div");
    controls.style.cssText = "display:flex; flex-wrap:wrap; gap:6px 18px; align-items:center; padding:8px 12px 4px;";
    const status = document.createElement("div");
    status.style.cssText = "padding:0 12px 6px; color:#c8d3e6; min-height:2.6em;";
    status.setAttribute("aria-live", "polite");
    const signalDiv = document.createElement("div");
    signalDiv.id = divElementId + "-signal"; // SciChart tells its charts apart by their div's id
    signalDiv.style.cssText = "flex:2; min-height:0;";
    const correlationDiv = document.createElement("div");
    correlationDiv.id = divElementId + "-correlation";
    correlationDiv.style.cssText = "flex:3; min-height:0;";
    root.append(controls, status, signalDiv, correlationDiv);
    return { controls, status, signalDiv, correlationDiv };
}

// A labelled <select> or slider that calls onChange with its new value
function addControl(parent, id, labelText, element, onChange) {
    const wrap = document.createElement("span");
    wrap.style.cssText = "display:inline-flex; align-items:center; gap:6px;";
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;
    label.style.fontWeight = "600";
    element.id = id;
    element.style.cssText += "font:inherit; accent-color:#F48420;";
    element.addEventListener("input", () => onChange(element.value));
    wrap.append(label, element);
    parent.append(wrap);
    return { wrap, label, element };
}
function makeSelect(options, value) {
    const select = document.createElement("select");
    select.style.cssText = "background:#22365B; color:#ffffff; border:1px solid #50C7E0; border-radius:6px; padding:2px 6px;";
    for (const [optionValue, text] of options) {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = text;
        select.append(option);
    }
    select.value = value;
    return select;
}
function makeSlider(min, max, step, value) {
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = String(min);
    slider.max = String(max);
    slider.step = String(step);
    slider.value = String(value);
    slider.style.width = "120px";
    return slider;
}

async function correlationDemo(divElementId) {
    const { controls, status, signalDiv, correlationDiv } = createLayout(divElementId);
    const { update, maxLagMs } = await createCorrelationCharts(signalDiv, correlationDiv);
    const settings = { mode: "auto", pitchHz: 125, delayMs: 40, noise: 0.3, unbiased: false, lagMs: 3 };
    const id = (name) => `${divElementId}-${name}`;

    const refresh = () => {
        const result = update(settings);
        const rText = `At the orange lag (${settings.lagMs.toFixed(3)} ms), r = ${result.rAtLag.toFixed(3)}.`;
        if (settings.mode === "auto") {
            const truePeriod = 1000 / settings.pitchHz;
            status.textContent =
                result.peakMs === null
                    ? `No repeat found within ${maxLagMs.auto} ms. ${rText}`
                    : `Detected period ${result.peakMs.toFixed(2)} ms, so the pitch is ${(1000 / result.peakMs).toFixed(1)} Hz ` +
                      `(true: ${truePeriod.toFixed(2)} ms, ${settings.pitchHz} Hz). ${rText} Move the lag to the green line and the copies line up.`;
        } else {
            const correct = Math.abs(result.peakMs - settings.delayMs) < 0.2;
            status.textContent =
                `Estimated delay ${result.peakMs.toFixed(3)} ms (true: ${settings.delayMs.toFixed(3)} ms), peak r = ${result.peakValue.toFixed(2)}. ` +
                (correct ? "Correct. " : "Wrong: a noise peak beat the real echo. ") +
                rText;
        }
    };

    const modes = [
        ["auto", "Autocorrelation: find the period"],
        ["cross", "Cross-correlation: find the delay"]
    ];
    const pitch = addControl(controls, id("pitch"), `Pitch: ${settings.pitchHz} Hz`, makeSlider(80, 400, 1, settings.pitchHz), (v) => {
        settings.pitchHz = Number(v);
        pitch.label.textContent = `Pitch: ${v} Hz`;
        refresh();
    });
    const delay = addControl(controls, id("delay"), `Delay: ${settings.delayMs} ms`, makeSlider(0, maxLagMs.cross, 0.125, settings.delayMs), (v) => {
        settings.delayMs = Number(v);
        delay.label.textContent = `Delay: ${Number(v).toFixed(1)} ms`;
        refresh();
    });
    const noise = addControl(controls, id("noise"), `Noise: ${settings.noise}`, makeSlider(0, 2, 0.05, settings.noise), (v) => {
        settings.noise = Number(v);
        noise.label.textContent = `Noise: ${Number(v).toFixed(2)}`;
        refresh();
    });
    const estimators = [
        ["biased", "Biased (divide by N)"],
        ["unbiased", "Unbiased (divide by N - k)"]
    ];
    const estimator = addControl(controls, id("estimator"), "Estimate", makeSelect(estimators, "biased"), (v) => {
        settings.unbiased = v === "unbiased";
        refresh();
    });
    const lag = addControl(controls, id("lag"), `Lag: ${settings.lagMs} ms`, makeSlider(0, maxLagMs.auto, 0.125, settings.lagMs), (v) => {
        settings.lagMs = Number(v);
        lag.label.textContent = `Lag: ${Number(v).toFixed(1)} ms`;
        refresh();
    });
    const mode = addControl(controls, id("mode"), "Mode", makeSelect(modes, settings.mode), (v) => {
        settings.mode = v;
        const auto = v === "auto";
        pitch.wrap.style.display = auto ? "inline-flex" : "none";
        estimator.wrap.style.display = auto ? "inline-flex" : "none";
        delay.wrap.style.display = auto ? "none" : "inline-flex";
        settings.lagMs = auto ? 3 : 15;
        lag.element.max = String(auto ? maxLagMs.auto : maxLagMs.cross);
        lag.element.value = String(settings.lagMs);
        lag.label.textContent = `Lag: ${settings.lagMs.toFixed(1)} ms`;
        refresh();
    });
    controls.prepend(mode.wrap); // the mode comes first
    delay.wrap.style.display = "none";
    refresh();
}

correlationDemo("scichart-root");
