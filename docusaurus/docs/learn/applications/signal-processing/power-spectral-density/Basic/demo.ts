import * as SciChart from "scichart";

// #region_A_start
// Power spectral density (PSD) with Welch's method, in JavaScript with SciChart.js.
// The FFT, window, noise and PSD functions below are plain JavaScript with no dependencies, so you can use them anywhere.

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
    // 2. Combine pairs of smaller DFTs into bigger ones with butterflies: a + w*b and a - w*b
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

// Window functions (periodic form). They taper each segment towards zero at both ends to reduce leakage.
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

// Welch's method: cut the record into overlapping segments, window each one, take its periodogram
// (|FFT|^2 scaled to a density) and average them. Units: (signal units)^2 per Hz, one-sided.
//   segmentLength: samples per segment (a power of 2). It sets the bin width, sampleRate / segmentLength.
//   overlap: fraction of each segment shared with the next, e.g. 0, 0.5 or 0.75.
//   maxSegments: average at most this many segments (1 gives a single periodogram).
// Returns the frequencies, the averaged PSD, the first segment's periodogram on its own, and bookkeeping.
function welchPsd(samples, sampleRate, segmentLength, overlap, windowType, maxSegments) {
    const window = makeWindow(windowType, segmentLength);
    let windowPower = 0; // sum of w^2: corrects for the power the window removes
    let windowSum = 0;
    for (let i = 0; i < segmentLength; i++) {
        windowPower += window[i] * window[i];
        windowSum += window[i];
    }
    const hop = Math.max(1, Math.round(segmentLength * (1 - overlap)));
    const available = Math.floor((samples.length - segmentLength) / hop) + 1;
    const segments = Math.max(1, Math.min(available, maxSegments));
    const bins = segmentLength / 2 + 1; // 0 Hz up to the Nyquist frequency, sampleRate / 2
    const psd = new Float64Array(bins);
    const single = new Float64Array(bins);
    const re = new Float64Array(segmentLength);
    const im = new Float64Array(segmentLength);
    for (let s = 0; s < segments; s++) {
        const start = s * hop;
        for (let i = 0; i < segmentLength; i++) {
            re[i] = samples[start + i] * window[i];
            im[i] = 0;
        }
        fft(re, im);
        for (let k = 0; k < bins; k++) {
            // Periodogram scaling: |X|^2 / (sampleRate * sum of w^2). Bins other than 0 Hz and Nyquist are
            // doubled to fold the negative frequencies in, so the one-sided PSD holds all the power.
            const oneSided = k === 0 || k === bins - 1 ? 1 : 2;
            const density = (oneSided * (re[k] * re[k] + im[k] * im[k])) / (sampleRate * windowPower);
            psd[k] += density / segments;
            if (s === 0) single[k] = density;
        }
    }
    const frequencies = new Float64Array(bins);
    for (let k = 0; k < bins; k++) frequencies[k] = (k * sampleRate) / segmentLength;
    return {
        frequencies,
        psd,
        single,
        segments,
        available,
        samplesUsed: (segments - 1) * hop + segmentLength,
        binWidth: sampleRate / segmentLength,
        // Equivalent noise bandwidth of the window, in bins: 1 for rectangular, 1.5 for Hann
        noiseBandwidthBins: (segmentLength * windowPower) / (windowSum * windowSum)
    };
}

// Parseval's theorem: the area under a PSD is the signal's mean square, so its square root is the RMS
function rmsFromPsd(psd, binWidth) {
    let area = 0;
    for (let k = 0; k < psd.length; k++) area += psd[k] * binWidth;
    return Math.sqrt(area);
}
function rmsOfSamples(samples, count) {
    let sum = 0;
    for (let i = 0; i < count; i++) sum += samples[i] * samples[i];
    return Math.sqrt(sum / count);
}

// Seeded random numbers, so the noise is the same every time the page loads
function makeRandom(seed) {
    let state = seed;
    const uniform = () => {
        state = (state * 16807) % 2147483647;
        return (state - 0.5) / 2147483647; // strictly between 0 and 1
    };
    // Box-Muller: two uniform numbers make one Gaussian (normal) number with mean 0 and standard deviation 1
    return () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform());
}

// White noise has a flat PSD. Pink noise has a PSD proportional to 1/f (3 dB less per octave): make it by
// shaping white noise in the frequency domain (scale each bin's amplitude by 1/sqrt(f)), then transforming back.
// count must be a power of 2. Both are scaled to the requested RMS.
function makeNoise(count, kind, rms, seed) {
    const gaussian = makeRandom(seed);
    const re = new Float64Array(count);
    const im = new Float64Array(count);
    for (let i = 0; i < count; i++) re[i] = gaussian();
    if (kind === "pink") {
        fft(re, im);
        re[0] = 0; // no DC
        im[0] = 0;
        for (let k = 1; k < count; k++) {
            const scale = 1 / Math.sqrt(Math.min(k, count - k)); // the same for bin k and its mirror, N - k
            re[k] *= scale;
            im[k] *= scale;
        }
        // Inverse FFT by conjugating, transforming and conjugating again; the result is real
        for (let k = 0; k < count; k++) im[k] = -im[k];
        fft(re, im);
    }
    const scale = rms / rmsOfSamples(re, count);
    for (let i = 0; i < count; i++) re[i] *= scale;
    return re;
}

// Test signal in volts: a strong 128.7 Hz tone (amplitude 1 V), a weak 330 Hz tone (0.08 V) and 0.5 V RMS of noise
function makeTestSignal(count, sampleRate, noise) {
    const values = new Float64Array(count);
    for (let i = 0; i < count; i++) {
        const t = i / sampleRate;
        values[i] = Math.sin(2 * Math.PI * 128.7 * t) + 0.08 * Math.sin(2 * Math.PI * 330 * t) + noise[i];
    }
    return values;
}

async function createPsdChart(chartDiv) {
    const {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        EAutoRange,
        ENumericFormat,
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

    const SAMPLE_RATE = 2048; // samples per second, so the PSD runs from 0 Hz to the Nyquist frequency, 1,024 Hz
    const RECORD_LENGTH = 65536; // 32 seconds of signal

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(chartDiv, { theme: new SciChartJsNavyTheme() });

    // The frequency axis can be linear or logarithmic; this makes either kind
    const makeFrequencyAxis = (isLog, minimum) =>
        isLog
            ? new LogarithmicAxis(wasmContext, {
                  axisTitle: "Frequency (Hz, log scale)",
                  logBase: 10,
                  labelFormat: ENumericFormat.SignificantFigures,
                  labelPrecision: 4,
                  // A labelled gridline at each power of ten (1, 10, 100, 1000), minor gridlines at 2, 3 ... 9 times each
                  autoTicks: false,
                  majorDelta: 1,
                  minorDelta: 1,
                  visibleRange: new NumberRange(minimum, SAMPLE_RATE / 2)
              })
            : new NumericAxis(wasmContext, {
                  axisTitle: "Frequency (Hz)",
                  labelPrecision: 0,
                  visibleRange: new NumberRange(0, SAMPLE_RATE / 2)
              });
    let logFrequency = false;
    sciChartSurface.xAxes.add(makeFrequencyAxis(false, 1));
    // PSD in decibels relative to 1 V^2/Hz: 10 * log10(PSD). A fixed range stops the axis jumping as settings change
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "PSD (dB re 1 V²/Hz)",
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(-80, 10),
            labelPrecision: 0
        })
    );

    const singleSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Single periodogram", dataIsSortedInX: true });
    const welchSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Welch average", dataIsSortedInX: true });
    const singleLine = new FastLineRenderableSeries(wasmContext, { dataSeries: singleSeries, stroke: "#F48420AA", strokeThickness: 1 });
    const welchLine = new FastLineRenderableSeries(wasmContext, { dataSeries: welchSeries, stroke: "#50C7E0", strokeThickness: 2 });
    sciChartSurface.renderableSeries.add(singleLine, welchLine);

    // Hover to read a bin, scroll to zoom into a frequency range, drag to pan, double-click to reset
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos.map((info) => `${info.seriesName}: ${info.formattedYValue} dB/Hz at ${info.formattedXValue} Hz`)
        }),
        new LegendModifier({ showCheckboxes: true }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    );

    // The noise is made once per kind and reused, so changing the analysis settings doesn't change the signal
    const signals = {};
    const getSignal = (noiseKind) => {
        if (!signals[noiseKind]) {
            const noise = makeNoise(RECORD_LENGTH, noiseKind, 0.5, 7);
            signals[noiseKind] = makeTestSignal(RECORD_LENGTH, SAMPLE_RATE, noise);
        }
        return signals[noiseKind];
    };

    const toDecibels = (values) => values.map((p) => 10 * Math.log10(Math.max(p, 1e-20)));

    // Recompute everything from the settings: { noise, segmentLength, overlap, windowType, maxSegments, show, logFrequency }
    const update = (settings) => {
        const samples = getSignal(settings.noise);
        const result = welchPsd(samples, SAMPLE_RATE, settings.segmentLength, settings.overlap, settings.windowType, settings.maxSegments);
        // A log axis can't show 0 Hz, so start from the first bin above it
        const first = settings.logFrequency ? 1 : 0;
        const frequencies = result.frequencies.subarray(first);
        welchSeries.clear();
        welchSeries.appendRange(frequencies, toDecibels(result.psd.subarray(first)));
        singleSeries.clear();
        singleSeries.appendRange(frequencies, toDecibels(result.single.subarray(first)));
        welchLine.isVisible = settings.show !== "single";
        singleLine.isVisible = settings.show !== "welch";

        if (settings.logFrequency !== logFrequency) {
            logFrequency = settings.logFrequency;
            const oldAxis = sciChartSurface.xAxes.get(0);
            sciChartSurface.xAxes.remove(oldAxis, true);
            sciChartSurface.xAxes.add(makeFrequencyAxis(logFrequency, result.binWidth));
        } else if (logFrequency) {
            sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(result.binWidth, SAMPLE_RATE / 2);
        }

        return {
            ...result,
            psdRms: rmsFromPsd(result.psd, result.binWidth),
            timeRms: rmsOfSamples(samples, result.samplesUsed),
            sampleRate: SAMPLE_RATE
        };
    };
    return { update, sampleRate: SAMPLE_RATE, recordLength: RECORD_LENGTH };
}
// #region_A_end

// The page layout: a row of controls and a status line above the chart. In your app these can be ordinary HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#17243d; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;";
    const controls = document.createElement("div");
    controls.style.cssText = "display:flex; flex-wrap:wrap; gap:6px 18px; align-items:center; padding:8px 12px 4px;";
    const status = document.createElement("div");
    status.style.cssText = "padding:0 12px 6px; color:#c8d3e6; min-height:2.6em;";
    status.setAttribute("aria-live", "polite");
    const chartDiv = document.createElement("div");
    chartDiv.id = divElementId + "-psd"; // SciChart tells its charts apart by their div's id
    chartDiv.style.cssText = "flex:1; min-height:0;";
    root.append(controls, status, chartDiv);
    return { controls, status, chartDiv };
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

async function psdDemo(divElementId) {
    const { controls, status, chartDiv } = createLayout(divElementId);
    const { update, recordLength } = await createPsdChart(chartDiv);
    const settings = {
        noise: "white",
        segmentLength: 1024,
        overlap: 0.5,
        windowType: "hann",
        maxSegments: Infinity, // average every segment that fits
        show: "both",
        logFrequency: false
    };
    const format = (value, digits) => value.toLocaleString("en-US", { maximumFractionDigits: digits });

    // The averages slider runs from 1 to the number of segments that fit; "all" follows that maximum
    const averages = document.createElement("input");
    averages.type = "range";
    averages.min = "1";
    averages.step = "1";
    averages.style.width = "140px";
    let useAll = true;

    const refresh = () => {
        const r = update(settings);
        averages.max = String(r.available);
        averages.value = String(r.segments);
        averagesControl.label.textContent = `Averages: ${r.segments}${useAll ? " (all)" : ""}`;
        status.textContent =
            `Segment ${format(settings.segmentLength, 0)} samples (${format(settings.segmentLength / r.sampleRate, 3)} s): ` +
            `bin width ${format(r.binWidth, 3)} Hz, noise bandwidth ${format(r.binWidth * r.noiseBandwidthBins, 3)} Hz. ` +
            `${r.segments} of ${r.available} segments averaged, using ${format(r.samplesUsed / r.sampleRate, 2)} s of the ${format(recordLength / r.sampleRate, 0)} s record. ` +
            `RMS from the area under the Welch PSD: ${r.psdRms.toFixed(3)} V. RMS of the same samples in time: ${r.timeRms.toFixed(3)} V.`;
    };

    const noises = [
        ["white", "White (flat)"],
        ["pink", "Pink (1/f)"]
    ];
    addControl(controls, divElementId + "-noise", "Noise", makeSelect(noises, settings.noise), (v) => {
        settings.noise = v;
        refresh();
    });
    const lengths = [256, 512, 1024, 2048, 4096, 8192].map((n) => [String(n), n.toLocaleString("en-US")]);
    addControl(controls, divElementId + "-segment", "Segment length", makeSelect(lengths, String(settings.segmentLength)), (v) => {
        settings.segmentLength = Number(v);
        if (useAll) settings.maxSegments = Infinity;
        refresh();
    });
    const overlaps = [
        ["0", "0%"],
        ["0.5", "50%"],
        ["0.75", "75%"]
    ];
    addControl(controls, divElementId + "-overlap", "Overlap", makeSelect(overlaps, String(settings.overlap)), (v) => {
        settings.overlap = Number(v);
        if (useAll) settings.maxSegments = Infinity;
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
    const averagesControl = addControl(controls, divElementId + "-averages", "Averages", averages, (v) => {
        useAll = Number(v) === Number(averages.max);
        settings.maxSegments = useAll ? Infinity : Number(v);
        refresh();
    });
    const shows = [
        ["both", "Both"],
        ["welch", "Welch average"],
        ["single", "Single periodogram"]
    ];
    addControl(controls, divElementId + "-show", "Show", makeSelect(shows, settings.show), (v) => {
        settings.show = v;
        refresh();
    });
    const scales = [
        ["linear", "Linear"],
        ["log", "Log"]
    ];
    addControl(controls, divElementId + "-scale", "Frequency axis", makeSelect(scales, "linear"), (v) => {
        settings.logFrequency = v === "log";
        refresh();
    });
    refresh();
}

psdDemo("scichart-root");
