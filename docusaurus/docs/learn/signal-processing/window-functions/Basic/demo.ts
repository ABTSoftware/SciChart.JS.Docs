import * as SciChart from "scichart";

// #region_A_start
// Spectral leakage explorer: one strong tone, an optional weak tone and noise, windowed and transformed with an FFT,
// in JavaScript with SciChart.js. The FFT and window functions below are plain JavaScript with no dependencies.

// Iterative radix-2 Cooley-Tukey FFT, in place. re and im hold the real and imaginary parts;
// their length must be a power of 2. Afterwards, re[k] and im[k] hold frequency bin k.
function fft(re, im) {
    const n = re.length;
    if ((n & (n - 1)) !== 0) throw new Error("FFT length must be a power of 2");
    // 1. Reorder the samples by bit-reversed index
    for (let i = 1, j = 0; i < n; i++) {
        let bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) {
            [re[i], re[j]] = [re[j], re[i]];
            [im[i], im[j]] = [im[j], im[i]];
        }
    }
    // 2. Combine pairs of smaller DFTs with butterflies: a + w*b and a - w*b
    for (let size = 2; size <= n; size *= 2) {
        const half = size / 2;
        const step = (-2 * Math.PI) / size;
        for (let start = 0; start < n; start += size) {
            for (let k = 0; k < half; k++) {
                const wr = Math.cos(step * k);
                const wi = Math.sin(step * k);
                const a = start + k;
                const b = a + half;
                const tr = re[b] * wr - im[b] * wi;
                const ti = re[b] * wi + im[b] * wr;
                re[b] = re[a] - tr;
                im[b] = im[a] - ti;
                re[a] += tr;
                im[a] += ti;
            }
        }
    }
}

// Every window here is a cosine sum: w[i] = a0 - a1 cos(x) + a2 cos(2x) - a3 cos(3x) + a4 cos(4x),
// with x = 2 pi i / N (periodic form, for spectrum analysis) or 2 pi i / (N - 1) (symmetric form, for filter design).
const WINDOW_COEFFICIENTS = {
    rectangular: [1],
    hann: [0.5, 0.5],
    hamming: [0.54, 0.46],
    blackman: [0.42, 0.5, 0.08],
    blackmanHarris: [0.35875, 0.48829, 0.14128, 0.01168], // 4-term, -92 dB side lobes
    flatTop: [0.21557895, 0.41663158, 0.277263158, 0.083578947, 0.006947368] // 5-term flat top
};

function makeWindow(type, n, symmetric = false) {
    const a = WINDOW_COEFFICIENTS[type];
    const w = new Float64Array(n);
    const period = symmetric ? n - 1 : n;
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let k = 0; k < a.length; k++) sum += (k % 2 === 0 ? 1 : -1) * a[k] * Math.cos((2 * Math.PI * k * i) / period);
        w[i] = sum;
    }
    return w;
}

// Figures of merit: coherent gain (the window's mean, which scales a tone's peak) and equivalent noise bandwidth
// (how many bins wide the window's filter is for noise; 1 for rectangular, 1.5 for Hann)
function windowFigures(w) {
    let sum = 0;
    let sumSquares = 0;
    for (const v of w) {
        sum += v;
        sumSquares += v * v;
    }
    return { coherentGain: sum / w.length, enbwBins: (w.length * sumSquares) / (sum * sum) };
}

// One-sided amplitude spectrum in dB: window, FFT, and divide by the window's sum so a tone of amplitude A
// centred on a bin reads 20 log10(A). Bin k is at k cycles per record.
function spectrumDb(samples, w) {
    const n = samples.length;
    const re = new Float64Array(n);
    const im = new Float64Array(n);
    let windowSum = 0;
    for (let i = 0; i < n; i++) {
        re[i] = samples[i] * w[i];
        windowSum += w[i];
    }
    fft(re, im);
    const bins = n / 2 + 1;
    const levels = new Float64Array(bins);
    for (let k = 0; k < bins; k++) {
        const oneSided = k === 0 || k === n / 2 ? 1 : 2;
        levels[k] = 20 * Math.log10(Math.max((oneSided * Math.hypot(re[k], im[k])) / windowSum, 1e-12)); // floor at -240 dB
    }
    return levels;
}

// The window's own frequency response: zero pad it 16 times so the main lobe and side lobes are drawn smoothly.
// Returns dB relative to the peak, from -spanBins to +spanBins, and the highest side lobe.
function windowResponse(type, spanBins) {
    const length = 1024;
    const pad = 16;
    const size = length * pad;
    const re = new Float64Array(size);
    const im = new Float64Array(size);
    re.set(makeWindow(type, length));
    fft(re, im);
    const peak = Math.hypot(re[0], im[0]);
    const half = spanBins * pad;
    const offsets = [];
    const levels = [];
    for (let k = -half; k <= half; k++) {
        const index = (k + size) % size; // negative frequencies wrap to the end of the FFT
        offsets.push(k / pad);
        levels.push(20 * Math.log10(Math.max(Math.hypot(re[index], im[index]) / peak, 1e-12)));
    }
    // Highest side lobe: the largest level beyond the first null (the first dip below -20 dB that turns back up;
    // a flat-top window's main lobe ripples near 0 dB, so a plain "first minimum" would stop too early)
    let i = half + 1;
    while (i < levels.length - 1 && (levels[i] > -20 || levels[i + 1] < levels[i])) i++;
    let highestSideLobe = -Infinity;
    for (; i < levels.length; i++) highestSideLobe = Math.max(highestSideLobe, levels[i]);
    return { offsets, levels, highestSideLobe };
}

// Test signal: a strong tone (amplitude 1, 0 dB), an optional weak tone (amplitude 0.001, -60 dB) and seeded noise.
// Frequencies are in bins (cycles per record), so 40.0 fits the record exactly and 40.5 is the worst case.
function makeSignal(n, toneBins, weakOn, weakOffsetBins, noiseRms) {
    let seed = 7;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const strong = new Float64Array(n);
    const values = new Float64Array(n);
    for (let i = 0; i < n; i++) {
        strong[i] = Math.sin((2 * Math.PI * toneBins * i) / n + 0.3);
        const weak = weakOn ? 0.001 * Math.sin((2 * Math.PI * (toneBins + weakOffsetBins) * i) / n) : 0;
        const noise = (random() + random() + random() + random() + random() + random() - 3) * Math.SQRT2 * noiseRms; // about Gaussian
        values[i] = strong[i] + weak + noise;
    }
    return { strong, values };
}

async function createLeakageCharts(timeDiv, responseDiv, spectrumDiv) {
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
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

    const zoomModifiers = () => [
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    ];

    // Top left: the record, the window and the windowed record
    const timeChart = await SciChartSurface.create(timeDiv, { theme: new SciChartJsNavyTheme() });
    const timeSurface = timeChart.sciChartSurface;
    const timeXAxis = new NumericAxis(timeChart.wasmContext, { axisTitle: "Sample", labelPrecision: 0 });
    timeSurface.xAxes.add(timeXAxis);
    timeSurface.yAxes.add(
        new NumericAxis(timeChart.wasmContext, { autoRange: EAutoRange.Never, visibleRange: new NumberRange(-1.25, 1.25), labelPrecision: 1 })
    );
    const signalSeries = new XyDataSeries(timeChart.wasmContext, { dataSeriesName: "Signal", dataIsSortedInX: true });
    const windowSeries = new XyDataSeries(timeChart.wasmContext, { dataSeriesName: "Window", dataIsSortedInX: true });
    const windowedSeries = new XyDataSeries(timeChart.wasmContext, { dataSeriesName: "Windowed", dataIsSortedInX: true });
    timeSurface.renderableSeries.add(
        new FastLineRenderableSeries(timeChart.wasmContext, { dataSeries: signalSeries, stroke: "#50C7E066" }),
        new FastLineRenderableSeries(timeChart.wasmContext, { dataSeries: windowedSeries, stroke: "#F48420" }),
        new FastLineRenderableSeries(timeChart.wasmContext, { dataSeries: windowSeries, stroke: "#FFD866", strokeThickness: 3 })
    );
    timeSurface.chartModifiers.add(new LegendModifier({ showCheckboxes: false }), ...zoomModifiers());

    // Top right: the window's own frequency response (main lobe and side lobes)
    const responseChart = await SciChartSurface.create(responseDiv, { theme: new SciChartJsNavyTheme() });
    const responseSurface = responseChart.sciChartSurface;
    responseSurface.xAxes.add(
        new NumericAxis(responseChart.wasmContext, { axisTitle: "Bins from the tone", labelPrecision: 0 })
    );
    responseSurface.yAxes.add(
        new NumericAxis(responseChart.wasmContext, { autoRange: EAutoRange.Never, visibleRange: new NumberRange(-140, 5), labelPrecision: 0 })
    );
    const responseSeries = new XyDataSeries(responseChart.wasmContext, { dataSeriesName: "Window response (dB)", dataIsSortedInX: true });
    responseSurface.renderableSeries.add(
        new FastLineRenderableSeries(responseChart.wasmContext, { dataSeries: responseSeries, stroke: "#FFD866", strokeThickness: 2 })
    );
    responseSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: false }),
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            tooltipDataTemplate: (infos) => infos.map((info) => `${info.formattedXValue} bins: ${info.formattedYValue} dB`)
        }),
        ...zoomModifiers()
    );

    // Bottom: the spectrum in dB, so leakage skirts and the weak tone are both visible
    const spectrumChart = await SciChartSurface.create(spectrumDiv, { theme: new SciChartJsNavyTheme() });
    const spectrumSurface = spectrumChart.sciChartSurface;
    const spectrumXAxis = new NumericAxis(spectrumChart.wasmContext, { axisTitle: "Frequency (bins)", labelPrecision: 0 });
    spectrumSurface.xAxes.add(spectrumXAxis);
    spectrumSurface.yAxes.add(
        new NumericAxis(spectrumChart.wasmContext, {
            axisTitle: "Amplitude (dB)",
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(-160, 5),
            labelPrecision: 0
        })
    );
    const spectrumSeries = new XyDataSeries(spectrumChart.wasmContext, { dataSeriesName: "Spectrum", dataIsSortedInX: true });
    const leakageSeries = new XyDataSeries(spectrumChart.wasmContext, { dataSeriesName: "Strong tone alone", dataIsSortedInX: true });
    spectrumSurface.renderableSeries.add(
        new FastLineRenderableSeries(spectrumChart.wasmContext, { dataSeries: leakageSeries, stroke: "#F4842088", strokeDashArray: [4, 4] }),
        new FastLineRenderableSeries(spectrumChart.wasmContext, { dataSeries: spectrumSeries, stroke: "#50C7E0", strokeThickness: 2 })
    );
    spectrumSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true }),
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            tooltipDataTemplate: (infos) => infos.map((info) => `Bin ${info.formattedXValue}: ${info.formattedYValue} dB`)
        }),
        ...zoomModifiers()
    );

    // Recompute everything from the settings: { windowType, toneBins, weakOn, weakOffsetBins, size, noiseRms }
    const update = (s) => {
        const w = makeWindow(s.windowType, s.size);
        const { strong, values } = makeSignal(s.size, s.toneBins, s.weakOn, s.weakOffsetBins, s.noiseRms);
        const index = Array.from({ length: s.size }, (_, i) => i);
        signalSeries.clear();
        signalSeries.appendRange(index, values);
        windowSeries.clear();
        windowSeries.appendRange(index, Array.from(w));
        windowedSeries.clear();
        windowedSeries.appendRange(index, values.map((v, i) => v * w[i]));
        timeXAxis.visibleRange = new NumberRange(0, s.size - 1);

        const levels = spectrumDb(values, w);
        const leakage = spectrumDb(strong, w); // the strong tone on its own: what can hide the weak one
        const background = spectrumDb(makeSignal(s.size, s.toneBins, false, 0, s.noiseRms).values, w); // everything but the weak tone
        const bins = Array.from({ length: levels.length }, (_, k) => k);
        spectrumSeries.clear();
        spectrumSeries.appendRange(bins, Array.from(levels));
        leakageSeries.clear();
        leakageSeries.appendRange(bins, Array.from(leakage));
        spectrumXAxis.visibleRange = new NumberRange(Math.max(0, s.toneBins - 30), Math.min(s.size / 2, s.toneBins + 40));

        const response = windowResponse(s.windowType, 16);
        responseSeries.clear();
        responseSeries.appendRange(response.offsets, response.levels);

        // Readout: how far the peak reads below the true 0 dB, and how far the weak tone stands above the leakage
        const k0 = Math.round(s.toneBins);
        const peakDb = Math.max(leakage[k0 - 1], leakage[k0], leakage[k0 + 1]);
        const weakBin = Math.round(s.toneBins + s.weakOffsetBins);
        return {
            peakErrorDb: peakDb,
            highestSideLobeDb: response.highestSideLobe,
            ...windowFigures(w),
            weakMarginDb: levels[weakBin] - background[weakBin]
        };
    };
    return { update };
}
// #region_A_end

// The page layout: controls and a readout above the charts. In your app these can be ordinary HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#17243d; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;";
    const controls = document.createElement("div");
    controls.style.cssText = "display:flex; flex-wrap:wrap; gap:6px 18px; align-items:center; padding:8px 12px 4px;";
    const status = document.createElement("div");
    status.style.cssText = "padding:0 12px 6px; color:#c8d3e6; min-height:2.6em;";
    status.setAttribute("aria-live", "polite");
    const topRow = document.createElement("div");
    topRow.style.cssText = "flex:2; min-height:0; display:flex; gap:4px;";
    const timeDiv = document.createElement("div");
    timeDiv.id = divElementId + "-time"; // SciChart tells its charts apart by their div's id
    timeDiv.style.cssText = "flex:3; min-width:0;";
    const responseDiv = document.createElement("div");
    responseDiv.id = divElementId + "-response";
    responseDiv.style.cssText = "flex:2; min-width:0;";
    topRow.append(timeDiv, responseDiv);
    const spectrumDiv = document.createElement("div");
    spectrumDiv.id = divElementId + "-spectrum";
    spectrumDiv.style.cssText = "flex:3; min-height:0; margin-top:4px;";
    root.append(controls, status, topRow, spectrumDiv);
    return { controls, status, timeDiv, responseDiv, spectrumDiv };
}

// A labelled control (select, slider or checkbox) that calls onChange with the element
function addControl(parent, id, labelText, element, onChange) {
    const wrap = document.createElement("span");
    wrap.style.cssText = "display:inline-flex; align-items:center; gap:6px;";
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;
    label.style.fontWeight = "600";
    element.id = id;
    element.style.cssText += "font:inherit; accent-color:#F48420;";
    element.addEventListener("input", () => onChange(element));
    if (element.type === "checkbox") wrap.append(element, label);
    else wrap.append(label, element);
    parent.append(wrap);
    return { label, element };
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
    slider.style.width = "130px";
    return slider;
}

async function windowFunctionsDemo(divElementId) {
    const { controls, status, timeDiv, responseDiv, spectrumDiv } = createLayout(divElementId);
    const { update } = await createLeakageCharts(timeDiv, responseDiv, spectrumDiv);
    const settings = { windowType: "hann", toneBins: 40.5, weakOn: true, weakOffsetBins: 12, size: 1024, noiseRms: 1e-6 };
    const names = {
        rectangular: "rectangular",
        hann: "Hann",
        hamming: "Hamming",
        blackman: "Blackman",
        blackmanHarris: "Blackman-Harris",
        flatTop: "flat-top"
    };

    const refresh = () => {
        const r = update(settings);
        const fraction = Math.abs(settings.toneBins - Math.round(settings.toneBins));
        const where = fraction < 1e-9 ? "exactly on a bin" : `${fraction.toFixed(1)} of a bin off a bin centre`;
        const weak = !settings.weakOn
            ? "Weak tone off."
            : r.weakMarginDb > 6
              ? `The -60 dB tone stands ${r.weakMarginDb.toFixed(0)} dB above what's around it: visible.`
              : "The -60 dB tone is hidden under the strong tone's leakage or the noise.";
        status.textContent =
            `${names[settings.windowType]} window. Tone ${where}: its peak reads ${(Math.abs(r.peakErrorDb) < 0.005 ? 0 : r.peakErrorDb).toFixed(2)} dB (true level 0 dB). ` +
            `Highest side lobe ${r.highestSideLobeDb.toFixed(1)} dB, ENBW ${r.enbwBins.toFixed(2)} bins, coherent gain ${r.coherentGain.toFixed(3)}. ${weak}`;
    };

    const windows = [
        ["rectangular", "Rectangular (none)"],
        ["hann", "Hann"],
        ["hamming", "Hamming"],
        ["blackman", "Blackman"],
        ["blackmanHarris", "Blackman-Harris"],
        ["flatTop", "Flat top"]
    ];
    addControl(controls, divElementId + "-window", "Window", makeSelect(windows, settings.windowType), (el) => {
        settings.windowType = el.value;
        refresh();
    });
    const tone = addControl(controls, divElementId + "-tone", "Tone: bin 40.5", makeSlider(40, 42, 0.1, settings.toneBins), (el) => {
        settings.toneBins = Number(el.value);
        tone.label.textContent = `Tone: bin ${settings.toneBins.toFixed(1)}`;
        refresh();
    });
    const weakBox = document.createElement("input");
    weakBox.type = "checkbox";
    weakBox.checked = settings.weakOn;
    addControl(controls, divElementId + "-weak", "Weak tone (-60 dB)", weakBox, (el) => {
        settings.weakOn = el.checked;
        refresh();
    });
    const offset = addControl(controls, divElementId + "-offset", "Offset: 12 bins", makeSlider(3, 25, 1, settings.weakOffsetBins), (el) => {
        settings.weakOffsetBins = Number(el.value);
        offset.label.textContent = `Offset: ${settings.weakOffsetBins} bins`;
        refresh();
    });
    const sizes = [
        ["256", "256"],
        ["1024", "1,024"],
        ["4096", "4,096"]
    ];
    addControl(controls, divElementId + "-size", "FFT size", makeSelect(sizes, String(settings.size)), (el) => {
        settings.size = Number(el.value);
        refresh();
    });
    const noise = [
        ["0", "None"],
        ["1e-6", "Low"],
        ["1e-4", "High"]
    ];
    addControl(controls, divElementId + "-noise", "Noise", makeSelect(noise, "1e-6"), (el) => {
        settings.noiseRms = Number(el.value);
        refresh();
    });
    refresh();
}

windowFunctionsDemo("scichart-root");
