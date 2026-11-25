import * as SciChart from "scichart";

// #region_A_start
// A signal-to-noise ratio (SNR) lab in JavaScript with SciChart.js: bury a signal in noise, then win it back
// by averaging repeated sweeps and by narrowing the bandwidth with a low-pass filter. The DSP functions below are
// plain JavaScript with no dependencies, so you can use them anywhere.

const SAMPLE_RATE = 1024; // samples per second, so the spectrum runs from 0 Hz to the Nyquist frequency, 512 Hz
const SWEEP_LENGTH = 1024; // samples per sweep (1 second), a power of 2 for the FFT. Bin width = 1 Hz
const MAX_SWEEPS = 256; // the most sweeps the demo averages
const SINE_FREQUENCY = 20; // Hz, exactly on an FFT bin, so the sine's power sits in one bin

// Iterative radix-2 Cooley-Tukey FFT, in place. re and im hold the real and imaginary parts;
// their length must be a power of 2. Afterwards, re[k] and im[k] hold frequency bin k.
function fft(re, im) {
    const n = re.length;
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

// The clean signal, with a peak amplitude of 1: a sine wave, or a short Gaussian pulse in the middle of the sweep
function makeCleanSignal(kind) {
    const values = new Float64Array(SWEEP_LENGTH);
    for (let i = 0; i < SWEEP_LENGTH; i++) {
        const t = i / SAMPLE_RATE;
        values[i] = kind === "pulse" ? Math.exp(-0.5 * Math.pow((t - 0.5) / 0.01, 2)) : Math.sin(2 * Math.PI * SINE_FREQUENCY * t);
    }
    return values;
}

// MAX_SWEEPS sweeps of white Gaussian noise with an RMS of 1. Each sweep gets fresh, independent noise,
// as it would if you triggered a measurement again and again on a repeating signal.
function makeNoiseSweeps(seed) {
    const gaussian = makeRandom(seed);
    const sweeps = [];
    for (let s = 0; s < MAX_SWEEPS; s++) {
        const sweep = new Float64Array(SWEEP_LENGTH);
        for (let i = 0; i < SWEEP_LENGTH; i++) sweep[i] = gaussian();
        sweeps.push(sweep);
    }
    return sweeps;
}

// Coherent averaging: the mean of the first `count` noise sweeps, scaled to the noise RMS. The signal is the same
// in every sweep, so averaging leaves it unchanged; uncorrelated noise shrinks to 1/sqrt(count) of its RMS.
function averageNoise(noiseSweeps, count, noiseRms) {
    const average = new Float64Array(SWEEP_LENGTH);
    for (let s = 0; s < count; s++) {
        const sweep = noiseSweeps[s];
        for (let i = 0; i < SWEEP_LENGTH; i++) average[i] += sweep[i];
    }
    for (let i = 0; i < SWEEP_LENGTH; i++) average[i] *= noiseRms / count;
    return average;
}

// An ideal ("brick-wall") low-pass filter, applied offline in the frequency domain: FFT, set every bin above the
// cutoff to zero, inverse FFT. With 1 Hz bins it keeps exactly the noise between 0 Hz and the cutoff.
function idealLowPass(samples, cutoffHz) {
    const n = samples.length;
    const lastBin = Math.round((cutoffHz * n) / SAMPLE_RATE);
    const re = Float64Array.from(samples);
    const im = new Float64Array(n);
    fft(re, im);
    for (let k = lastBin + 1; k < n - lastBin; k++) {
        re[k] = 0; // bin k and its mirror image, n - k (the negative frequency)
        im[k] = 0;
    }
    // Inverse FFT by conjugating, transforming and conjugating again, then dividing by n; the result is real
    for (let k = 0; k < n; k++) im[k] = -im[k];
    fft(re, im);
    for (let i = 0; i < n; i++) re[i] /= n;
    return re;
}

// The fraction of white noise's power a cutoff lets through: (2K + 1) of the n two-sided bins, about cutoff / (fs/2)
function noiseFractionKept(cutoffHz) {
    const lastBin = Math.min(SWEEP_LENGTH / 2, Math.round((cutoffHz * SWEEP_LENGTH) / SAMPLE_RATE));
    return lastBin >= SWEEP_LENGTH / 2 ? 1 : (2 * lastBin + 1) / SWEEP_LENGTH;
}

// Mean square = power, in (signal units)^2. Its square root is the RMS.
function meanSquare(values) {
    let sum = 0;
    for (let i = 0; i < values.length; i++) sum += values[i] * values[i];
    return sum / values.length;
}

// SNR from two powers: as a ratio, and in decibels, 10 log10(Ps / Pn)
const snrDb = (signalPower, noisePower) => 10 * Math.log10(signalPower / noisePower);

// One-sided power spectrum with no window: the power in each 1 Hz bin. A sine of amplitude A on a bin shows as
// A^2 / 2; white noise of power P spreads over the n/2 bins, so each bin holds about P / (n/2). (Parseval's theorem:
// the bins add up to the mean square.)
function powerSpectrum(samples) {
    const n = samples.length;
    const re = Float64Array.from(samples);
    const im = new Float64Array(n);
    fft(re, im);
    const power = new Float64Array(n / 2 + 1);
    for (let k = 0; k <= n / 2; k++) {
        const oneSided = k === 0 || k === n / 2 ? 1 : 2; // fold the negative frequencies in
        power[k] = (oneSided * (re[k] * re[k] + im[k] * im[k])) / (n * n);
    }
    return power;
}

async function createSnrCharts(timeDiv, spectrumDiv) {
    const {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        EAutoRange,
        ENumericFormat,
        ELabelPlacement,
        XyDataSeries,
        FastLineRenderableSeries,
        HorizontalLineAnnotation,
        VerticalLineAnnotation,
        LegendModifier,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const toDb = (power) => 10 * Math.log10(Math.max(power, 1e-15));
    const time = Array.from({ length: SWEEP_LENGTH }, (_, i) => i / SAMPLE_RATE);
    const frequencies = Array.from({ length: SWEEP_LENGTH / 2 }, (_, k) => k + 1); // bins 1 to 512 Hz (a log axis can't show 0 Hz)

    // --- Chart 1: the signal in time. One raw sweep, the averaged and filtered result, and the clean signal ---
    const timeChart = await SciChartSurface.create(timeDiv, { theme: new SciChartJsNavyTheme() });
    timeChart.sciChartSurface.xAxes.add(new NumericAxis(timeChart.wasmContext, { axisTitle: "Time (s)", labelPrecision: 1 }));
    const amplitudeAxis = new NumericAxis(timeChart.wasmContext, { axisTitle: "Amplitude", autoRange: EAutoRange.Never });
    timeChart.sciChartSurface.yAxes.add(amplitudeAxis);
    const rawSeries = new XyDataSeries(timeChart.wasmContext, { dataSeriesName: "One raw sweep", dataIsSortedInX: true });
    const outputSeries = new XyDataSeries(timeChart.wasmContext, { dataSeriesName: "Averaged + filtered", dataIsSortedInX: true });
    const cleanSeries = new XyDataSeries(timeChart.wasmContext, { dataSeriesName: "Clean signal", dataIsSortedInX: true });
    timeChart.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(timeChart.wasmContext, { dataSeries: rawSeries, stroke: "#50C7E066", strokeThickness: 1 }),
        new FastLineRenderableSeries(timeChart.wasmContext, { dataSeries: outputSeries, stroke: "#F48420", strokeThickness: 2 }),
        new FastLineRenderableSeries(timeChart.wasmContext, {
            dataSeries: cleanSeries,
            stroke: "#FFFFFFCC",
            strokeThickness: 1.5,
            strokeDashArray: [6, 4]
        })
    );
    // Hover for values, scroll to zoom, drag to pan, double-click to reset
    timeChart.sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true }),
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- Chart 2: the power spectrum in dB, on a log frequency axis, with the noise floor and signal peak marked ---
    const spectrumChart = await SciChartSurface.create(spectrumDiv, { theme: new SciChartJsNavyTheme() });
    spectrumChart.sciChartSurface.xAxes.add(
        new LogarithmicAxis(spectrumChart.wasmContext, {
            axisTitle: "Frequency (Hz)",
            logBase: 10,
            labelFormat: ENumericFormat.SignificantFigures,
            labelPrecision: 3,
            autoTicks: false, // a labelled gridline at 1, 10 and 100 Hz, and minor gridlines between
            majorDelta: 1,
            minorDelta: 1,
            visibleRange: new NumberRange(1, SAMPLE_RATE / 2)
        })
    );
    spectrumChart.sciChartSurface.yAxes.add(
        new NumericAxis(spectrumChart.wasmContext, {
            axisTitle: "Power per bin (dB)",
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(-90, 10),
            labelPrecision: 0
        })
    );
    const rawSpectrum = new XyDataSeries(spectrumChart.wasmContext, { dataSeriesName: "One raw sweep", dataIsSortedInX: true });
    const outputSpectrum = new XyDataSeries(spectrumChart.wasmContext, { dataSeriesName: "Averaged + filtered", dataIsSortedInX: true });
    spectrumChart.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(spectrumChart.wasmContext, { dataSeries: rawSpectrum, stroke: "#50C7E066", strokeThickness: 1 }),
        new FastLineRenderableSeries(spectrumChart.wasmContext, { dataSeries: outputSpectrum, stroke: "#F48420", strokeThickness: 2 })
    );
    const peakLine = new HorizontalLineAnnotation({
        y1: 0,
        stroke: "#FFFFFFAA",
        strokeDashArray: [6, 4],
        showLabel: true,
        labelPlacement: ELabelPlacement.TopRight
    });
    const floorLine = new HorizontalLineAnnotation({
        y1: -60,
        stroke: "#68BCAE",
        strokeDashArray: [6, 4],
        showLabel: true,
        labelPlacement: ELabelPlacement.BottomLeft, // below the line, where the log axis leaves room
        axisLabelFill: "#68BCAE"
    });
    const cutoffLine = new VerticalLineAnnotation({
        x1: SAMPLE_RATE / 2,
        stroke: "#F48420",
        strokeDashArray: [2, 4],
        showLabel: true,
        labelPlacement: ELabelPlacement.TopLeft,
        axisLabelFill: "#F48420"
    });
    spectrumChart.sciChartSurface.annotations.add(peakLine, floorLine, cutoffLine);
    spectrumChart.sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true }),
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // The noise is made once and reused, so moving a slider changes only what you asked it to
    const noiseSweeps = makeNoiseSweeps(42);
    const cleanSignals = { sine: makeCleanSignal("sine"), pulse: makeCleanSignal("pulse") };

    // Recompute everything from the settings: { signal, amplitude, noiseRms, averages, cutoff }
    // cutoff is in Hz; SAMPLE_RATE / 2 means no filter. Returns the SNRs for the readout.
    const update = (settings) => {
        const { amplitude, noiseRms, averages, cutoff } = settings;
        const clean = cleanSignals[settings.signal].map((v) => v * amplitude);
        const filtered = cutoff < SAMPLE_RATE / 2;

        // One raw sweep: signal + noise, no averaging, no filter
        const raw = clean.map((v, i) => v + noiseRms * noiseSweeps[0][i]);
        // The processed result. Averaging and filtering are linear, so the signal part and the noise part can be
        // processed separately and added: that's also how you measure the noise, with the signal switched off.
        const signalPart = filtered ? idealLowPass(clean, cutoff) : clean;
        const averagedNoise = averageNoise(noiseSweeps, averages, noiseRms);
        const noisePart = filtered ? idealLowPass(averagedNoise, cutoff) : averagedNoise;
        const output = signalPart.map((v, i) => v + noisePart[i]);

        // Measured SNRs, from the samples
        const signalPower = meanSquare(signalPart);
        const rawSnr = meanSquare(clean) / meanSquare(raw.map((v, i) => v - clean[i]));
        const measuredSnr = signalPower / meanSquare(noisePart);
        // Predicted SNR: noise power falls by the number of averages, and by the share of the bandwidth kept
        const predictedNoisePower = ((noiseRms * noiseRms) / averages) * noiseFractionKept(cutoff);
        const predictedSnr = signalPower / predictedNoisePower;

        // Update the charts
        rawSeries.clear();
        rawSeries.appendRange(time, Array.from(raw));
        outputSeries.clear();
        outputSeries.appendRange(time, Array.from(output));
        cleanSeries.clear();
        cleanSeries.appendRange(time, Array.from(clean));
        const range = amplitude + 3 * noiseRms;
        amplitudeAxis.visibleRange = new NumberRange(-range, range);

        rawSpectrum.clear();
        rawSpectrum.appendRange(frequencies, Array.from(powerSpectrum(raw).subarray(1), toDb));
        outputSpectrum.clear();
        outputSpectrum.appendRange(frequencies, Array.from(powerSpectrum(output).subarray(1), toDb));
        // The signal's highest bin, and the noise floor: the noise power expected in each 1 Hz bin
        const peakDb = toDb(Math.max(...powerSpectrum(signalPart)));
        const floorDb = toDb((noiseRms * noiseRms) / averages / (SWEEP_LENGTH / 2));
        peakLine.y1 = peakDb;
        peakLine.labelValue = `Signal peak ${peakDb.toFixed(1)} dB`;
        floorLine.y1 = floorDb;
        floorLine.labelValue = `Noise floor per bin ${floorDb.toFixed(1)} dB`;
        cutoffLine.isHidden = !filtered;
        cutoffLine.x1 = cutoff;
        cutoffLine.labelValue = `Low-pass ${cutoff} Hz`;

        return { rawSnr, measuredSnr, predictedSnr };
    };
    return { update };
}
// #region_A_end

// The page layout: a row of controls, a readout line and two charts. In your app these can be ordinary HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#17243d; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;";
    const controls = document.createElement("div");
    controls.style.cssText = "display:flex; flex-wrap:wrap; gap:6px 18px; align-items:center; padding:8px 12px 4px;";
    const readout = document.createElement("div");
    readout.style.cssText = "padding:0 12px 6px; color:#c8d3e6; min-height:2.6em;";
    readout.setAttribute("aria-live", "polite");
    const timeDiv = document.createElement("div");
    timeDiv.id = divElementId + "-time"; // SciChart tells its charts apart by their div's id
    timeDiv.style.cssText = "flex:1; min-height:0;";
    const spectrumDiv = document.createElement("div");
    spectrumDiv.id = divElementId + "-spectrum";
    spectrumDiv.style.cssText = "flex:1; min-height:0;";
    root.append(controls, readout, timeDiv, spectrumDiv);
    return { controls, readout, timeDiv, spectrumDiv };
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

async function snrDemo(divElementId) {
    const { controls, readout, timeDiv, spectrumDiv } = createLayout(divElementId);
    const { update } = await createSnrCharts(timeDiv, spectrumDiv);
    const settings = { signal: "sine", amplitude: 0.5, noiseRms: 1, averages: 16, cutoff: SAMPLE_RATE / 2 };

    const ratio = (snr) => (snr >= 10 ? Math.round(snr).toLocaleString("en-US") : snr.toPrecision(2));
    const describe = (snr) => `${snrDb(snr, 1).toFixed(1)} dB (${ratio(snr)} : 1)`;
    const refresh = () => {
        const r = update(settings);
        amplitudeControl.label.textContent = `Signal amplitude: ${settings.amplitude.toFixed(2)}`;
        noiseControl.label.textContent = `Noise RMS: ${settings.noiseRms.toFixed(2)}`;
        averagesControl.label.textContent = `Averages: ${settings.averages}`;
        averagesControl.element.setAttribute("aria-valuetext", `${settings.averages} averages`);
        const filterGain = settings.cutoff < SAMPLE_RATE / 2 ? 10 * Math.log10(SAMPLE_RATE / 2 / settings.cutoff) : 0;
        readout.textContent =
            `One raw sweep: SNR ${describe(r.rawSnr)}. ` +
            `After ${settings.averages} average${settings.averages > 1 ? "s" : ""}` +
            `${settings.cutoff < SAMPLE_RATE / 2 ? ` and a ${settings.cutoff} Hz low-pass filter` : ""}: ` +
            `measured ${describe(r.measuredSnr)}, predicted ${describe(r.predictedSnr)} ` +
            `(averaging +${(10 * Math.log10(settings.averages)).toFixed(1)} dB, filter +${filterGain.toFixed(1)} dB).`;
    };

    const signals = [
        ["sine", `Sine wave, ${SINE_FREQUENCY} Hz`],
        ["pulse", "Pulse (10 ms Gaussian)"]
    ];
    addControl(controls, divElementId + "-signal", "Signal", makeSelect(signals, settings.signal), (v) => {
        settings.signal = v;
        refresh();
    });
    const amplitudeControl = addControl(controls, divElementId + "-amplitude", "Signal amplitude", makeSlider(0.05, 2, 0.05, settings.amplitude), (v) => {
        settings.amplitude = Number(v);
        refresh();
    });
    const noiseControl = addControl(controls, divElementId + "-noise", "Noise RMS", makeSlider(0.1, 2, 0.05, settings.noiseRms), (v) => {
        settings.noiseRms = Number(v);
        refresh();
    });
    // The averages slider steps through powers of 2: 1, 2, 4 ... 256
    const averagesControl = addControl(controls, divElementId + "-averages", "Averages", makeSlider(0, 8, 1, Math.log2(settings.averages)), (v) => {
        settings.averages = Math.pow(2, Number(v));
        refresh();
    });
    const cutoffs = [
        [String(SAMPLE_RATE / 2), `Off (full ${SAMPLE_RATE / 2} Hz)`],
        ["200", "200 Hz"],
        ["100", "100 Hz"],
        ["50", "50 Hz"],
        ["25", "25 Hz"]
    ];
    addControl(controls, divElementId + "-cutoff", "Low-pass filter", makeSelect(cutoffs, String(settings.cutoff)), (v) => {
        settings.cutoff = Number(v);
        refresh();
    });
    refresh();
}

snrDemo("scichart-root");
