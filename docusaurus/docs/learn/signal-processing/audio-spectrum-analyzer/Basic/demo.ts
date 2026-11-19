import * as SciChart from "scichart";

// #region_A_start
// Real-time audio spectrum analyser in JavaScript with SciChart.js: test signals or your microphone,
// windowed FFT, averaging, peak hold, FFT bins or 1/3-octave bands, on a log or linear frequency axis.
// The signal and FFT functions below are plain JavaScript with no dependencies, so you can use them anywhere.

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

// Seeded random numbers, so the noise is the same every time the page loads.
// Box-Muller turns two uniform numbers into one Gaussian (normal) number with mean 0 and standard deviation 1.
function makeRandom(seed) {
    let state = seed;
    const uniform = () => {
        state = (state * 16807) % 2147483647;
        return (state - 0.5) / 2147483647; // strictly between 0 and 1
    };
    return () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform());
}

// A loop of pink noise (equal power in every octave): shape white noise in the frequency domain by scaling
// each bin's amplitude by 1/sqrt(f), then transform back. The loop repeats seamlessly. count is a power of 2.
function makePinkNoiseLoop(count, rms, seed) {
    const gaussian = makeRandom(seed);
    const re = new Float64Array(count);
    const im = new Float64Array(count);
    for (let i = 0; i < count; i++) re[i] = gaussian();
    fft(re, im);
    re[0] = 0; // no DC
    im[0] = 0;
    for (let k = 1; k < count; k++) {
        const scale = 1 / Math.sqrt(Math.min(k, count - k)); // the same for bin k and its mirror, count - k
        re[k] *= scale;
        im[k] *= scale;
    }
    for (let k = 0; k < count; k++) im[k] = -im[k]; // inverse FFT: conjugate, transform, take the real part
    fft(re, im);
    let sumSquares = 0;
    for (let i = 0; i < count; i++) sumSquares += re[i] * re[i];
    const scale = rms / Math.sqrt(sumSquares / count);
    return Float32Array.from(re, (v) => v * scale);
}

// Test signals, in digital full scale: 1.0 is the largest sample value, so a sine of amplitude 1 reads 0 dBFS.
// next() returns one sample at a time and keeps each oscillator's phase, so the sound runs on without clicks.
let pinkLoop = null; // made once, on first use
function createTestSignal(kind, sampleRate) {
    pinkLoop = pinkLoop ?? makePinkNoiseLoop(131072, 1, 7);
    const pink = pinkLoop;
    let pinkIndex = 0;
    const pinkSample = () => pink[pinkIndex++ & 131071];
    const TWO_PI = 2 * Math.PI;
    const tones = []; // [frequency in Hz, amplitude]
    let noiseLevel = 0.0003; // a little background noise, about -70 dBFS
    if (kind === "chord") {
        // A major chord (A3, C#4, E4), each note with eight harmonics that get quieter, like a soft organ
        for (const note of [220, 277.18, 329.63]) {
            for (let h = 1; h <= 8; h++) tones.push([note * h, 0.15 / h]);
        }
    } else if (kind === "hum") {
        // 50 Hz mains hum and a series of its harmonics, under a 1 kHz test tone
        const harmonics = [0.25, 0.04, 0.1, 0.02, 0.06, 0.01, 0.035, 0.008, 0.02, 0.005, 0.012, 0.004, 0.008];
        harmonics.forEach((amplitude, i) => tones.push([50 * (i + 1), amplitude]));
        tones.push([1000, 0.1]);
    } else if (kind === "close") {
        // Two tones 20 Hz apart: an FFT of 4,096 points or fewer shows one peak, 8,192 or more shows two
        tones.push([1000, 0.3], [1020, 0.3]);
    } else if (kind === "pink") {
        noiseLevel = 0.1; // pink noise at 0.1 RMS (-17 dB below a full-scale sine)
    }
    const phases = tones.map(() => 0);
    // A logarithmic sine sweep from 20 Hz to 20 kHz every 6 seconds: each octave takes the same time
    const SWEEP_SECONDS = 6;
    let sweepTime = 0;
    let sweepPhase = 0;
    return function next() {
        let value = noiseLevel * pinkSample();
        if (kind === "sweep") {
            const frequency = 20 * Math.pow(1000, sweepTime / SWEEP_SECONDS);
            sweepPhase = (sweepPhase + (TWO_PI * frequency) / sampleRate) % TWO_PI;
            sweepTime = (sweepTime + 1 / sampleRate) % SWEEP_SECONDS;
            value += 0.5 * Math.sin(sweepPhase);
        }
        for (let t = 0; t < tones.length; t++) {
            phases[t] = (phases[t] + (TWO_PI * tones[t][0]) / sampleRate) % TWO_PI;
            value += tones[t][1] * Math.sin(phases[t]);
        }
        return value;
    };
}

// 1/3-octave bands with base-10 centres, 1000 * 10^(n/10) Hz, from 25 Hz to 20 kHz.
// Each band runs from centre / 10^(1/20) to centre * 10^(1/20). Labels use the usual rounded (preferred) names.
const BAND_NAMES = ["25", "31.5", "40", "50", "63", "80", "100", "125", "160", "200", "250", "315", "400", "500", "630",
    "800", "1k", "1.25k", "1.6k", "2k", "2.5k", "3.15k", "4k", "5k", "6.3k", "8k", "10k", "12.5k", "16k", "20k"];
const BANDS = BAND_NAMES.map((name, i) => {
    const centre = 1000 * Math.pow(10, (i - 16) / 10);
    return { name, centre, low: centre / Math.pow(10, 1 / 20), high: centre * Math.pow(10, 1 / 20) };
});

// The analyser: Hann window, FFT, power per bin, exponential averaging and peak hold.
// Levels are in dBFS, scaled so a full-scale sine reads 0 dBFS in its FFT bin and in its 1/3-octave band.
function createAnalyser(size) {
    const window = new Float64Array(size);
    let windowSum = 0;
    let windowSumSquares = 0;
    for (let i = 0; i < size; i++) {
        window[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / size); // periodic Hann
        windowSum += window[i];
        windowSumSquares += window[i] * window[i];
    }
    const re = new Float64Array(size);
    const im = new Float64Array(size);
    const bins = size / 2; // bins 1 to size/2 - 1 are drawn; bin 0 is DC, which a log axis can't show
    const power = new Float64Array(bins); // averaged |X[k]|^2
    let first = true;
    const floorDb = -200;
    const toDb = (p) => 10 * Math.log10(Math.max(p, 1e-20));

    return {
        size,
        // samples: the newest `size` samples. smoothing: 0 (none) to 0.99 (heavy), like AnalyserNode.smoothingTimeConstant
        analyse(samples, smoothing) {
            for (let i = 0; i < size; i++) {
                re[i] = samples[i] * window[i];
                im[i] = 0;
            }
            fft(re, im);
            const keep = first ? 0 : smoothing; // exponential average of power: new = keep * old + (1 - keep) * latest
            for (let k = 1; k < bins; k++) {
                power[k] = keep * power[k] + (1 - keep) * (re[k] * re[k] + im[k] * im[k]);
            }
            first = false;
        },
        // Level of each FFT bin: a sine's amplitude A shows as 20 log10(A) dBFS
        binLevels(out) {
            const scale = 4 / (windowSum * windowSum);
            for (let k = 1; k < bins; k++) out[k - 1] = Math.max(toDb(power[k] * scale), floorDb);
        },
        // Level of each 1/3-octave band: the power of every bin inside it, added up (NaN if no bin falls inside)
        bandLevels(sampleRate, out) {
            const binWidth = sampleRate / size;
            const scale = 4 / (size * windowSumSquares); // mean square of the band, relative to a full-scale sine (0.5)
            BANDS.forEach((band, b) => {
                const first = Math.max(1, Math.ceil(band.low / binWidth));
                const last = Math.min(bins - 1, Math.ceil(band.high / binWidth) - 1);
                let sum = 0;
                for (let k = first; k <= last; k++) sum += power[k];
                out[b] = last >= first ? Math.max(toDb(sum * scale), floorDb) : NaN;
            });
        }
    };
}

// Optional microphone input. Asks for permission only when called, which must be from a click.
// Returns { sampleRate, read(buffer), stop() }; read() fills buffer with the newest samples (-1 to 1).
async function openMicrophone(size) {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("the browser only allows the microphone on pages served over HTTPS");
    }
    // Turn off the voice-call processing, which would change the spectrum
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
    });
    const audioContext = new AudioContext();
    await audioContext.resume();
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = size; // here only a buffer of the newest samples: the FFT is ours
    audioContext.createMediaStreamSource(stream).connect(analyserNode);
    return {
        sampleRate: audioContext.sampleRate,
        read: (buffer) => analyserNode.getFloatTimeDomainData(buffer),
        stop: () => {
            stream.getTracks().forEach((track) => track.stop());
            audioContext.close();
        }
    };
}

async function createSpectrumAnalyser(chartDiv) {
    const {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        ENumericFormat,
        EAutoRange,
        FastMountainRenderableSeries,
        FastLineRenderableSeries,
        FastRectangleRenderableSeries,
        XyDataSeries,
        XyxyDataSeries,
        EColumnMode,
        EColumnYMode,
        GradientParams,
        Point,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        ELegendPlacement,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const MAX_SIZE = 16384;
    const FLOOR_DB = -120; // bottom of the level axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(chartDiv, { theme: new SciChartJsNavyTheme() });

    // Frequency axis: logarithmic (each octave the same width, as the ear hears it) or linear (each FFT bin the same width)
    const makeFrequencyAxis = (isLog) => {
        const options = {
            axisTitle: isLog ? "Frequency (Hz, log scale)" : "Frequency (Hz)",
            labelFormat: ENumericFormat.Engineering, // 100, 1K, 10K
            labelPrecision: 0,
            visibleRange: isLog ? new NumberRange(20, 20000) : new NumberRange(0, 20000),
            majorGridLineStyle: { color: "#50C7E055" },
            minorGridLineStyle: { color: "#50C7E01F" }
        };
        return isLog
            ? new LogarithmicAxis(wasmContext, { ...options, logBase: 10, autoTicks: false, majorDelta: 1, minorDelta: 1 })
            : new NumericAxis(wasmContext, options);
    };
    sciChartSurface.xAxes.add(makeFrequencyAxis(true));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Level (dBFS)",
            autoRange: EAutoRange.Never, // a fixed dB range stops the axis jumping with every frame
            visibleRange: new NumberRange(FLOOR_DB, 5),
            labelPrecision: 0
        })
    );

    // FFT view: the live spectrum as a mountain, and a peak-hold line on top
    const liveSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Live spectrum", dataIsSortedInX: true });
    const peakSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Peak hold", dataIsSortedInX: true });
    const liveMountain = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: liveSeries,
        stroke: "#50C7E0",
        strokeThickness: 2,
        zeroLineY: FLOOR_DB - 100, // fill down past the bottom of the axis
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#50C7E0AA", offset: 0 },
            { color: "#50C7E011", offset: 1 }
        ])
    });
    const peakLine = new FastLineRenderableSeries(wasmContext, { dataSeries: peakSeries, stroke: "#F48420", strokeThickness: 2 });

    // 1/3-octave view: one bar per band (x = band edges, y = floor to level), and a thin peak-hold cap above each bar
    const bandSeries = new XyxyDataSeries(wasmContext, { dataSeriesName: "1/3-octave bands" });
    const bandPeakSeries = new XyxyDataSeries(wasmContext, { dataSeriesName: "Peak hold" });
    const barOptions = { columnXMode: EColumnMode.StartEnd, columnYMode: EColumnYMode.TopBottom };
    const bandBars = new FastRectangleRenderableSeries(wasmContext, {
        ...barOptions,
        dataSeries: bandSeries,
        fill: "#50C7E0CC",
        stroke: "#50C7E0",
        strokeThickness: 1,
        topCornerRadius: 4
    });
    const bandPeaks = new FastRectangleRenderableSeries(wasmContext, {
        ...barOptions,
        dataSeries: bandPeakSeries,
        fill: "#F48420",
        stroke: "#F48420",
        strokeThickness: 1
    });

    // Hover to read a level, scroll to zoom, drag to pan, double-click to reset
    const describe = (info) => {
        const x = info.xValue;
        const band = BANDS.find((b) => x >= b.low * 0.98 && x <= b.high);
        const isBar = info.renderableSeries instanceof FastRectangleRenderableSeries;
        const where = isBar && band ? `${band.name} Hz band` : `${x.toFixed(x < 100 ? 1 : 0)} Hz`;
        // A bar's level is its top: read it from the band levels (the bars themselves start below the axis)
        const bandIndex = BANDS.indexOf(band);
        const level = isBar && band ? (info.renderableSeries === bandPeaks ? bandPeakLevels : bandLevels)[bandIndex] : info.yValue;
        return `${info.seriesName}: ${where}, ${Number(level).toFixed(1)} dBFS`;
    };
    const legend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight });
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false, tooltipDataTemplate: (infos) => infos.map(describe) }),
        legend,
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    );

    // State: { source, size, smoothing, peakHold, display: "fft" | "bands", logX }
    let settings = null;
    let configuredRate = 0;
    let analyser = null;
    let microphone = null;
    let nextSample = null; // the test signal generator
    let sampleRate = 48000;
    const history = new Float32Array(MAX_SIZE); // the newest samples, oldest first
    const block = new Float32Array(MAX_SIZE);
    let frequencies, levels, peaks;
    const bandLevels = new Float64Array(BANDS.length);
    const bandPeakLevels = new Float64Array(BANDS.length);
    // Leave a small gap between bars: shrink each band by 6% of its width at each end (in log terms)
    const barStart = BANDS.map((b) => b.low * Math.pow(b.high / b.low, 0.06));
    const barEnd = BANDS.map((b) => b.high / Math.pow(b.high / b.low, 0.06));

    // All four series stay on the chart; show only the ones the current view needs, and list only those in the legend
    const allSeries = [liveMountain, peakLine, bandBars, bandPeaks];
    sciChartSurface.renderableSeries.add(...allSeries);
    const setSeries = (list) => {
        for (const rs of allSeries) {
            rs.isVisible = list.includes(rs);
            legend.includeSeries(rs, rs.isVisible);
        }
    };

    // Apply new settings. Anything that changes the meaning of the averages or peaks starts them again.
    const configure = (newSettings) => {
        const old = settings ?? {};
        settings = { ...newSettings };
        const rateChanged = configuredRate !== sampleRate;
        configuredRate = sampleRate;
        if (settings.source !== "mic" && (settings.source !== old.source || rateChanged)) {
            nextSample = createTestSignal(settings.source, sampleRate);
        }
        if (!analyser || analyser.size !== settings.size || settings.source !== old.source || rateChanged) {
            analyser = createAnalyser(settings.size);
            const bins = settings.size / 2 - 1;
            frequencies = Float64Array.from({ length: bins }, (_, i) => ((i + 1) * sampleRate) / settings.size);
            levels = new Float64Array(bins);
            peaks = new Float64Array(bins).fill(-Infinity);
            bandPeakLevels.fill(-Infinity);
        }
        if (!settings.peakHold || settings.display !== old.display) {
            peaks.fill(-Infinity);
            bandPeakLevels.fill(-Infinity);
        }
        if (settings.logX !== old.logX) {
            const oldAxis = sciChartSurface.xAxes.get(0);
            sciChartSurface.xAxes.remove(oldAxis, true);
            sciChartSurface.xAxes.add(makeFrequencyAxis(settings.logX));
        }
        if (settings.logX !== old.logX || (settings.source === "close") !== (old.source === "close")) {
            // Zoom in around 1 kHz for the two close tones, which are only a few pixels apart on the full range
            sciChartSurface.xAxes.get(0).visibleRange =
                settings.source === "close" ? new NumberRange(940, 1080) : settings.logX ? new NumberRange(20, 20000) : new NumberRange(0, 20000);
        }
        const fftView = settings.display === "fft";
        setSeries(fftView ? (settings.peakHold ? [liveMountain, peakLine] : [liveMountain]) : settings.peakHold ? [bandBars, bandPeaks] : [bandBars]);
        return { sampleRate, emptyBands: BANDS.filter((b) => Math.ceil(b.low / (sampleRate / settings.size)) > Math.ceil(b.high / (sampleRate / settings.size)) - 1) };
    };

    // One frame: take in the samples that "arrived" since the last frame, analyse the newest block and redraw
    let lastTime = 0;
    let owed = 0;
    const frame = (now) => {
        const size = settings.size;
        if (microphone) {
            microphone.read(history); // the newest MAX_SIZE samples
        } else {
            const seconds = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : MAX_SIZE / sampleRate;
            owed += seconds * sampleRate;
            const count = Math.min(Math.floor(owed), MAX_SIZE);
            owed -= Math.floor(owed);
            history.copyWithin(0, count); // drop the oldest samples, append the new ones
            for (let i = MAX_SIZE - count; i < MAX_SIZE; i++) history[i] = nextSample();
        }
        block.set(history.subarray(MAX_SIZE - size)); // the newest `size` samples
        lastTime = now;
        analyser.analyse(block, settings.smoothing);

        if (settings.display === "fft") {
            analyser.binLevels(levels);
            liveSeries.clear();
            liveSeries.appendRange(frequencies, levels);
            if (settings.peakHold) {
                for (let i = 0; i < levels.length; i++) peaks[i] = Math.max(peaks[i], levels[i]);
                peakSeries.clear();
                peakSeries.appendRange(frequencies, peaks);
            }
        } else {
            analyser.bandLevels(sampleRate, bandLevels);
            const x = [], x1 = [], y = [], y1 = [], px = [], px1 = [], py = [], py1 = [];
            BANDS.forEach((band, b) => {
                if (Number.isNaN(bandLevels[b])) return; // narrower than one FFT bin: nothing to show
                x.push(barStart[b]);
                x1.push(barEnd[b]);
                y.push(FLOOR_DB - 100);
                y1.push(bandLevels[b]);
                bandPeakLevels[b] = Math.max(bandPeakLevels[b], bandLevels[b]);
                px.push(barStart[b]);
                px1.push(barEnd[b]);
                py.push(bandPeakLevels[b] - 0.8);
                py1.push(bandPeakLevels[b]);
            });
            bandSeries.clear();
            bandSeries.appendRange(x, y, x1, y1);
            if (settings.peakHold) {
                bandPeakSeries.clear();
                bandPeakSeries.appendRange(px, py, px1, py1);
            }
        }
    };

    // Animate with requestAnimationFrame at up to 30 updates a second, and stop when the chart is deleted
    let handle = 0;
    let lastDraw = 0;
    const loop = (now) => {
        if (sciChartSurface.isDeleted) return;
        if (now - lastDraw >= 1000 / 30 - 2) {
            lastDraw = now;
            frame(now);
        }
        handle = requestAnimationFrame(loop);
    };
    const stopMicrophone = () => {
        microphone?.stop();
        microphone = null;
    };
    sciChartSurface.addDeletable({
        delete: () => {
            cancelAnimationFrame(handle);
            stopMicrophone();
        }
    });

    return {
        start: (initialSettings) => {
            const info = configure(initialSettings);
            handle = requestAnimationFrame(loop);
            return info;
        },
        configure,
        // Switch to the microphone (call it from a click) or back to the test signals, then call configure()
        useMicrophone: async (on) => {
            if (on) {
                const opened = await openMicrophone(MAX_SIZE); // throws if refused or not available
                stopMicrophone();
                microphone = opened;
                sampleRate = opened.sampleRate;
            } else {
                stopMicrophone();
                sampleRate = 48000;
            }
            history.fill(0);
        }
    };
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
    chartDiv.id = divElementId + "-spectrum"; // SciChart tells its charts apart by their div's id
    chartDiv.style.cssText = "flex:1; min-height:0;";
    root.append(controls, status, chartDiv);
    return { controls, status, chartDiv };
}

// A labelled <select> that calls onChange with its new value
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

async function audioSpectrumAnalyserDemo(divElementId) {
    const { controls, status, chartDiv } = createLayout(divElementId);
    const analyser = await createSpectrumAnalyser(chartDiv);
    const settings = { source: "chord", size: 4096, smoothing: 0.8, peakHold: true, display: "fft", logX: true };
    const sourceNames = {
        chord: "an A major chord",
        sweep: "a sine sweep from 20 Hz to 20 kHz",
        pink: "pink noise",
        hum: "50 Hz hum and its harmonics under a 1 kHz tone",
        close: "two tones at 1,000 and 1,020 Hz",
        mic: "your microphone"
    };

    const describe = ({ sampleRate, emptyBands }) => {
        const binWidth = sampleRate / settings.size;
        const blockMs = (1000 * settings.size) / sampleRate;
        let text =
            `Analysing ${sourceNames[settings.source]}. ${sampleRate.toLocaleString("en-US")} samples/s, FFT size ` +
            `${settings.size.toLocaleString("en-US")}: bins ${binWidth.toFixed(1)} Hz apart, each block ${blockMs.toFixed(0)} ms long.`;
        if (settings.display === "bands" && emptyBands.length) {
            const count = emptyBands.length === 1 ? "One band contains" : `${emptyBands.length} bands contain`;
            text += ` ${count} no FFT bin (up to ${emptyBands[emptyBands.length - 1].name} Hz), so nothing is drawn there: use a bigger FFT.`;
        }
        status.textContent = text;
    };
    const apply = () => describe(analyser.configure(settings));

    const sources = [
        ["chord", "Chord"],
        ["sweep", "Sine sweep"],
        ["pink", "Pink noise"],
        ["hum", "50 Hz hum"],
        ["close", "Two close tones"]
    ];
    const sourceSelect = addControl(controls, divElementId + "-source", "Signal", makeSelect(sources, settings.source), (v) => {
        settings.source = v;
        apply();
    }).element;
    const sizes = [1024, 2048, 4096, 8192, 16384].map((n) => [String(n), n.toLocaleString("en-US")]);
    addControl(controls, divElementId + "-size", "FFT size", makeSelect(sizes, String(settings.size)), (v) => {
        settings.size = Number(v);
        apply();
    });
    const smoothing = [
        ["0", "Off"],
        ["0.5", "Light (0.5)"],
        ["0.8", "Medium (0.8)"],
        ["0.95", "Heavy (0.95)"]
    ];
    addControl(controls, divElementId + "-avg", "Averaging", makeSelect(smoothing, String(settings.smoothing)), (v) => {
        settings.smoothing = Number(v);
        apply();
    });
    addControl(controls, divElementId + "-peak", "Peak hold", makeSelect([["on", "On"], ["off", "Off"]], "on"), (v) => {
        settings.peakHold = v === "on";
        apply();
    });
    const displays = [
        ["fft", "FFT bins"],
        ["bands", "1/3-octave bands"]
    ];
    addControl(controls, divElementId + "-display", "Display", makeSelect(displays, settings.display), (v) => {
        settings.display = v;
        apply();
    });
    addControl(controls, divElementId + "-scale", "Frequency axis", makeSelect([["log", "Log"], ["linear", "Linear"]], "log"), (v) => {
        settings.logX = v === "log";
        apply();
    });

    // The microphone asks for permission only when this button is clicked
    const micButton = document.createElement("button");
    micButton.type = "button";
    micButton.textContent = "Use my microphone";
    micButton.style.cssText =
        "font:inherit; font-weight:600; color:#ffffff; background:#22365B; border:1px solid #F48420; border-radius:6px; padding:3px 10px; cursor:pointer;";
    controls.append(micButton);
    let micOn = false;
    micButton.addEventListener("click", async () => {
        micButton.disabled = true;
        try {
            await analyser.useMicrophone(!micOn);
            micOn = !micOn;
            settings.source = micOn ? "mic" : sourceSelect.value;
            sourceSelect.disabled = micOn;
            micButton.textContent = micOn ? "Stop microphone" : "Use my microphone";
            apply();
        } catch (error) {
            status.textContent = `The microphone isn't available here (${error.message || error.name}). The test signals still work.`;
        }
        micButton.disabled = false;
    });

    describe(analyser.start(settings));
}

audioSpectrumAnalyserDemo("scichart-root");
