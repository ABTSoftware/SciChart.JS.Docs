import * as SciChart from "scichart";

// #region_A_start
// FFT spectrum analyser: a test signal and its FFT magnitude spectrum, in JavaScript with SciChart.js.
// The FFT and window functions below are plain JavaScript with no dependencies, so you can use them anywhere.

// Iterative radix-2 Cooley-Tukey FFT, in place. re and im hold the real and imaginary parts;
// their length must be a power of 2. Afterwards, re[k] and im[k] hold frequency bin k.
function fft(re, im) {
    const n = re.length;
    if ((n & (n - 1)) !== 0) throw new Error("FFT length must be a power of 2");
    // 1. Reorder the samples by bit-reversed index (for n = 8, index 1 = 001 swaps with 4 = 100)
    for (let i = 1, j = 0; i < n; i++) {
        let bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) {
            [re[i], re[j]] = [re[j], re[i]];
            [im[i], im[j]] = [im[j], im[i]];
        }
    }
    // 2. Combine pairs of smaller DFTs into bigger ones: sizes 2, 4, 8 ... n (log2(n) stages).
    // Each "butterfly" turns a and b into a + w*b and a - w*b, where w is a twiddle factor e^(-2*pi*i*k/size).
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

// Window functions (the periodic form used for spectrum analysis). They taper the ends of the block
// towards zero, so a tone that doesn't fit a whole number of cycles leaks less into other bins.
function makeWindow(type, n) {
    const w = new Float64Array(n);
    for (let i = 0; i < n; i++) {
        const x = (2 * Math.PI * i) / n;
        if (type === "hann") w[i] = 0.5 - 0.5 * Math.cos(x);
        else if (type === "hamming") w[i] = 0.54 - 0.46 * Math.cos(x);
        else if (type === "blackman") w[i] = 0.42 - 0.5 * Math.cos(x) + 0.08 * Math.cos(2 * x);
        else w[i] = 1; // rectangular: no window
    }
    return w;
}

// One-sided amplitude spectrum: window the samples, zero pad, FFT, and scale so a sine of amplitude A
// centred on a bin reads A. Returns the frequency of each bin (0 to sampleRate / 2) and its amplitude.
function amplitudeSpectrum(samples, sampleRate, windowType, padFactor) {
    const n = samples.length;
    const size = n * padFactor; // zero padding: extra zeros after the samples
    const window = makeWindow(windowType, n);
    const re = new Float64Array(size);
    const im = new Float64Array(size);
    let windowSum = 0;
    for (let i = 0; i < n; i++) {
        re[i] = samples[i] * window[i];
        windowSum += window[i];
    }
    fft(re, im);
    const bins = size / 2 + 1; // bins above sampleRate / 2 mirror these, so drop them
    const frequencies = new Float64Array(bins);
    const amplitudes = new Float64Array(bins);
    for (let k = 0; k < bins; k++) {
        frequencies[k] = (k * sampleRate) / size;
        const oneSided = k === 0 || k === size / 2 ? 1 : 2; // fold the negative frequencies in
        amplitudes[k] = (oneSided * Math.hypot(re[k], im[k])) / windowSum;
    }
    return { frequencies, amplitudes };
}

// Test signal: three sine tones plus a little seeded random noise, so it looks the same every time.
// 50 Hz (amplitude 1), a tone you can move (amplitude 0.5) and a weak 160 Hz tone (0.003, about -50 dB).
function makeTestSignal(count, sampleRate, movingToneHz) {
    let seed = 11;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const time = new Float64Array(count);
    const values = new Float64Array(count);
    for (let i = 0; i < count; i++) {
        const t = i / sampleRate;
        const noise = (random() + random() + random() + random() + random() + random() - 3) * 0.007;
        time[i] = t;
        values[i] =
            Math.sin(2 * Math.PI * 50 * t) +
            0.5 * Math.sin(2 * Math.PI * movingToneHz * t) +
            0.003 * Math.sin(2 * Math.PI * 160 * t) +
            noise;
    }
    return { time, values };
}

async function createFftCharts(timeDiv, spectrumDiv) {
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        NumericLabelProvider,
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

    const SAMPLE_RATE = 1024; // samples per second, so the highest frequency shown (Nyquist) is 512 Hz

    // Top chart: the samples going into the FFT, before and after the window
    const timeChart = await SciChartSurface.create(timeDiv, { theme: new SciChartJsNavyTheme() });
    const timeSurface = timeChart.sciChartSurface;
    const timeXAxis = new NumericAxis(timeChart.wasmContext, { axisTitle: "Time (s)", labelPrecision: 2 });
    timeSurface.xAxes.add(timeXAxis);
    timeSurface.yAxes.add(
        new NumericAxis(timeChart.wasmContext, { axisTitle: "Signal", visibleRange: new NumberRange(-2, 2), labelPrecision: 1 })
    );
    const rawSeries = new XyDataSeries(timeChart.wasmContext, { dataSeriesName: "Samples" });
    const windowedSeries = new XyDataSeries(timeChart.wasmContext, { dataSeriesName: "After the window" });
    timeSurface.renderableSeries.add(
        new FastLineRenderableSeries(timeChart.wasmContext, { dataSeries: rawSeries, stroke: "#50C7E088" }),
        new FastLineRenderableSeries(timeChart.wasmContext, { dataSeries: windowedSeries, stroke: "#F48420" })
    );
    timeSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: false }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    );

    // Bottom chart: the FFT magnitude spectrum, from 0 Hz to the Nyquist frequency
    const spectrumChart = await SciChartSurface.create(spectrumDiv, { theme: new SciChartJsNavyTheme() });
    const spectrumSurface = spectrumChart.sciChartSurface;
    spectrumSurface.xAxes.add(
        new NumericAxis(spectrumChart.wasmContext, {
            axisTitle: "Frequency (Hz)",
            visibleRange: new NumberRange(0, SAMPLE_RATE / 2),
            labelPrecision: 0
        })
    );
    const levelLabels = new NumericLabelProvider({ labelPrecision: 0 });
    const levelAxis = new NumericAxis(spectrumChart.wasmContext, { autoRange: EAutoRange.Never, labelProvider: levelLabels });
    let unit = "dB";
    spectrumSurface.yAxes.add(levelAxis);
    const spectrumSeries = new XyDataSeries(spectrumChart.wasmContext, { dataSeriesName: "Spectrum", dataIsSortedInX: true });
    spectrumSurface.renderableSeries.add(
        new FastLineRenderableSeries(spectrumChart.wasmContext, { dataSeries: spectrumSeries, stroke: "#50C7E0", strokeThickness: 2 })
    );
    // Hover to read a bin, scroll to zoom into a frequency range, drag to pan, double-click to reset
    spectrumSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos.map((info) => `${info.formattedXValue} Hz: ${info.formattedYValue} ${unit}`)
        }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    );

    // Recompute everything from the settings: { toneHz, windowType, size, padFactor, decibels }
    const update = (settings) => {
        const { time, values } = makeTestSignal(settings.size, SAMPLE_RATE, settings.toneHz);
        const window = makeWindow(settings.windowType, settings.size);
        rawSeries.clear();
        rawSeries.appendRange(time, values);
        windowedSeries.clear();
        windowedSeries.appendRange(time, values.map((v, i) => v * window[i]));
        timeXAxis.visibleRange = new NumberRange(0, settings.size / SAMPLE_RATE);

        const { frequencies, amplitudes } = amplitudeSpectrum(values, SAMPLE_RATE, settings.windowType, settings.padFactor);
        // Decibels relative to an amplitude of 1: 20 * log10(amplitude). A floor avoids log10(0) = -Infinity
        const levels = settings.decibels ? amplitudes.map((a) => 20 * Math.log10(Math.max(a, 1e-10))) : amplitudes;
        spectrumSeries.clear();
        spectrumSeries.appendRange(frequencies, levels);
        unit = settings.decibels ? "dB" : "";
        levelAxis.axisTitle = settings.decibels ? "Amplitude (dB)" : "Amplitude";
        levelLabels.precision = settings.decibels ? 0 : 2;
        levelAxis.visibleRange = settings.decibels ? new NumberRange(-100, 5) : new NumberRange(0, 1.1);
        spectrumSeries.dataSeriesName = `Spectrum, bin width ${SAMPLE_RATE / settings.size} Hz`;
    };
    return { update, sampleRate: SAMPLE_RATE };
}
// #region_A_end

// The page layout: a row of controls above the two charts. In your app these can be ordinary HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#17243d; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;";
    const controls = document.createElement("div");
    controls.style.cssText = "display:flex; flex-wrap:wrap; gap:6px 18px; align-items:center; padding:8px 12px 4px;";
    const status = document.createElement("div");
    status.style.cssText = "padding:0 12px 6px; color:#c8d3e6; min-height:1.3em;";
    status.setAttribute("aria-live", "polite");
    const timeDiv = document.createElement("div");
    timeDiv.id = divElementId + "-time"; // SciChart tells its charts apart by their div's id
    timeDiv.style.cssText = "flex:2; min-height:0;";
    const spectrumDiv = document.createElement("div");
    spectrumDiv.id = divElementId + "-spectrum";
    spectrumDiv.style.cssText = "flex:3; min-height:0;";
    root.append(controls, status, timeDiv, spectrumDiv);
    return { controls, status, timeDiv, spectrumDiv };
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

async function fftDemo(divElementId) {
    const { controls, status, timeDiv, spectrumDiv } = createLayout(divElementId);
    const { update, sampleRate } = await createFftCharts(timeDiv, spectrumDiv);
    const settings = { toneHz: 120.5, windowType: "hann", size: 1024, padFactor: 1, decibels: true };

    const refresh = () => {
        update(settings);
        const binWidth = sampleRate / settings.size;
        const binPosition = settings.toneHz / binWidth;
        const onBin = Math.abs(binPosition - Math.round(binPosition)) < 1e-9;
        const where = onBin
            ? `exactly on bin ${Math.round(binPosition)}, so it shows as one sharp line`
            : `between bins ${Math.floor(binPosition)} and ${Math.ceil(binPosition)}, so it leaks into nearby bins`;
        status.textContent =
            `N = ${settings.size.toLocaleString("en-US")} samples at ${sampleRate.toLocaleString("en-US")} Hz: bin width ${binWidth} Hz. ` +
            `The ${settings.toneHz} Hz tone sits ${where}.` +
            (settings.padFactor > 1 ? ` Zero padding draws a point every ${binWidth / settings.padFactor} Hz; resolution is still ${binWidth} Hz.` : "");
    };

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "100";
    slider.max = "140";
    slider.step = "0.1";
    slider.value = String(settings.toneHz);
    slider.style.width = "140px";
    const tone = addControl(controls, divElementId + "-tone", `Moving tone: ${settings.toneHz} Hz`, slider, (v) => {
        settings.toneHz = Number(v);
        tone.label.textContent = `Moving tone: ${settings.toneHz.toFixed(1)} Hz`;
        refresh();
    });
    const windows = [
        ["rectangular", "Rectangular (none)"],
        ["hann", "Hann"],
        ["hamming", "Hamming"],
        ["blackman", "Blackman"]
    ];
    addControl(controls, divElementId + "-window", "Window", makeSelect(windows, settings.windowType), (v) => {
        settings.windowType = v;
        refresh();
    });
    const sizes = [
        ["256", "256"],
        ["1024", "1,024"],
        ["4096", "4,096"]
    ];
    addControl(controls, divElementId + "-size", "N", makeSelect(sizes, String(settings.size)), (v) => {
        settings.size = Number(v);
        refresh();
    });
    const padding = [
        ["1", "None"],
        ["4", "4 x"]
    ];
    addControl(controls, divElementId + "-pad", "Zero padding", makeSelect(padding, "1"), (v) => {
        settings.padFactor = Number(v);
        refresh();
    });
    const scales = [
        ["db", "dB"],
        ["linear", "Linear"]
    ];
    addControl(controls, divElementId + "-scale", "Scale", makeSelect(scales, "db"), (v) => {
        settings.decibels = v === "db";
        refresh();
    });
    refresh();
}

fftDemo("scichart-root");
