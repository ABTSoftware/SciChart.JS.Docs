import * as SciChart from "scichart";

const SAMPLE_RATE = 4000; // samples per second
const SAMPLE_COUNT = 4096; // about 1 second; a power of two, so the Hilbert transform can use a radix-2 FFT

// Sample data: three test signals whose true envelope (and, for the chirp, frequency) we know exactly, so the
// chart can show how far each envelope method is from the truth. Noise comes from a seeded random generator,
// so the chart looks the same every time.
//  - "am": an AM tone, a 200 Hz carrier whose amplitude follows a 3 Hz message
//  - "echo": a train of short 300 Hz bursts that fade, like echoes in ultrasound or sonar ranging
//  - "chirp": a linear chirp sweeping from 100 Hz to 800 Hz, with a slow rise and fall in amplitude
function makeSignal(kind, depth, noiseLevel) {
    let seed = 11;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    const duration = SAMPLE_COUNT / SAMPLE_RATE;
    const echoes = [
        { time: 0.12, height: 1.0 },
        { time: 0.36, height: 0.6 },
        { time: 0.57, height: 0.35 },
        { time: 0.8, height: 0.2 }
    ];
    // The carrier frequencies each signal covers, for the optional band-pass before the Hilbert transform
    const carrierRange = kind === "am" ? [200, 200] : kind === "echo" ? [300, 300] : [100, 800];
    const x = [];
    const y = [];
    const envelope = [];
    const frequency = [];
    for (let n = 0; n < SAMPLE_COUNT; n++) {
        const t = n / SAMPLE_RATE;
        let env;
        let phase;
        let freq;
        if (kind === "am") {
            env = 1 + depth * Math.cos(2 * Math.PI * 3 * t);
            freq = 200;
            phase = 2 * Math.PI * freq * t;
        } else if (kind === "echo") {
            env = 0;
            for (const echo of echoes) env += echo.height * Math.exp(-0.5 * ((t - echo.time) / 0.008) ** 2);
            freq = 300;
            phase = 2 * Math.PI * freq * t;
        } else {
            const sweep = (800 - 100) / duration; // Hz per second
            env = 0.4 + 0.6 * Math.sin((Math.PI * t) / duration);
            freq = 100 + sweep * t;
            phase = 2 * Math.PI * (100 * t + 0.5 * sweep * t * t);
        }
        x.push(t);
        y.push(env * Math.sin(phase) + noiseLevel * gaussian());
        envelope.push(env);
        frequency.push(freq);
    }
    return { x, y, envelope, frequency, carrierRange };
}

// The controls and the two charts each need an element. This splits the page's div into a control bar,
// a signal chart and a second chart; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const bar = document.createElement("div");
    bar.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    bar.innerHTML =
        `<label>Signal <select data-id="signal" style="font:inherit">` +
        `<option value="am">AM tone</option><option value="echo">Echo train (ranging)</option>` +
        `<option value="chirp">Linear chirp</option></select></label>` +
        `<label>Modulation depth <input data-id="depth" type="range" min="0" max="100" value="80" ` +
        `style="vertical-align:middle; width:100px"> <output data-id="depth"></output></label>` +
        `<label>Noise <input data-id="noise" type="range" min="0" max="30" value="3" ` +
        `style="vertical-align:middle; width:100px"> <output data-id="noise"></output></label>` +
        `<label>Method <select data-id="method" style="font:inherit">` +
        `<option value="both">Both</option><option value="rectify">Rectify + low-pass</option>` +
        `<option value="hilbert">Hilbert magnitude</option></select></label>` +
        `<label><input data-id="band" type="checkbox" checked> Band-pass before Hilbert</label>` +
        `<label>Low-pass cutoff <input data-id="cutoff" type="range" min="0" max="100" value="50" ` +
        `style="vertical-align:middle; width:120px"> <output data-id="cutoff"></output></label>` +
        `<span data-id="summary" aria-live="polite" style="flex-basis:100%; color:#c8d3e8"></span>`;
    const signalDiv = document.createElement("div");
    signalDiv.id = divElementId + "-signal";
    signalDiv.style.cssText = "flex:3; min-height:0;";
    const lowerDiv = document.createElement("div");
    lowerDiv.id = divElementId + "-lower";
    lowerDiv.style.cssText = "flex:2; min-height:0;";
    root.append(bar, signalDiv, lowerDiv);
    const get = (selector) => bar.querySelector(selector);
    return {
        signalDiv,
        lowerDiv,
        signalSelect: get('select[data-id="signal"]'),
        depthInput: get('input[data-id="depth"]'),
        depthOutput: get('output[data-id="depth"]'),
        noiseInput: get('input[data-id="noise"]'),
        noiseOutput: get('output[data-id="noise"]'),
        methodSelect: get('select[data-id="method"]'),
        bandCheckbox: get('input[data-id="band"]'),
        cutoffInput: get('input[data-id="cutoff"]'),
        cutoffOutput: get('output[data-id="cutoff"]'),
        summary: get('span[data-id="summary"]')
    };
}

async function envelopeDetectionChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Envelope detection two ways (rectify + low-pass, and the Hilbert transform), charted with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
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

    // --- DSP helpers (plain JavaScript, no library needed) ---

    // In-place radix-2 FFT (re and im have a power-of-two length)
    function fft(re, im) {
        const n = re.length;
        for (let i = 1, j = 0; i < n; i++) {
            let bit = n >> 1;
            for (; j & bit; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) {
                [re[i], re[j]] = [re[j], re[i]];
                [im[i], im[j]] = [im[j], im[i]];
            }
        }
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

    // The analytic signal z = x + i H{x}, by the FFT method:
    // 1. remove the mean (DC) and zero pad to at least twice the length, so the end doesn't wrap onto the start;
    // 2. FFT; 3. double the positive-frequency bins, keep bin 0 (DC) and bin size/2 (Nyquist) once,
    //    and zero the negative-frequency bins; 4. inverse FFT.
    // The real part of z is the signal; the imaginary part is its Hilbert transform.
    // Optional band = { low, high, taper } in Hz: while in the frequency domain, also remove the bins outside
    // the band, a free band-pass filter that keeps broadband noise out of the envelope.
    function analyticSignal(values, sampleRate, band) {
        const n = values.length;
        let size = 1;
        while (size < 2 * n) size *= 2;
        const re = new Float64Array(size);
        const im = new Float64Array(size);
        const mean = values.reduce((sum, v) => sum + v, 0) / n;
        for (let i = 0; i < n; i++) re[i] = values[i] - mean;
        fft(re, im);
        for (let k = 1; k < size / 2; k++) {
            re[k] *= 2;
            im[k] *= 2;
        }
        for (let k = size / 2 + 1; k < size; k++) {
            re[k] = 0;
            im[k] = 0;
        }
        if (band) {
            for (let k = 0; k <= size / 2; k++) {
                const f = (k * sampleRate) / size;
                // Full gain inside the band, then a smooth (raised-cosine) roll-off to zero over band.taper Hz,
                // which rings far less than cutting the bins off sharply
                const outside = Math.max(band.low - f, f - band.high, 0) / band.taper;
                const gain = outside >= 1 ? 0 : 0.5 + 0.5 * Math.cos(Math.PI * outside);
                re[k] *= gain;
                im[k] *= gain;
            }
        }
        // Inverse FFT with the forward one: conjugate, FFT, conjugate again and divide by size
        for (let k = 0; k < size; k++) im[k] = -im[k];
        fft(re, im);
        const zRe = new Float64Array(n);
        const zIm = new Float64Array(n);
        for (let i = 0; i < n; i++) {
            zRe[i] = re[i] / size;
            zIm[i] = -im[i] / size;
        }
        return { re: zRe, im: zIm };
    }

    // Instantaneous frequency: how fast the analytic signal's phase turns, divided by 2 pi.
    // The angle of z[i+1] times the conjugate of z[i-1] is the phase step over two samples, with no unwrapping.
    function instantaneousFrequency(z, sampleRate) {
        const n = z.re.length;
        const f = new Float64Array(n);
        for (let i = 1; i < n - 1; i++) {
            const re = z.re[i + 1] * z.re[i - 1] + z.im[i + 1] * z.im[i - 1];
            const im = z.im[i + 1] * z.re[i - 1] - z.re[i + 1] * z.im[i - 1];
            f[i] = (Math.atan2(im, re) * sampleRate) / (4 * Math.PI);
        }
        f[0] = f[1];
        f[n - 1] = f[n - 2];
        return f;
    }

    // Second-order Butterworth low-pass filter (a biquad), run forwards in time like an analogue circuit,
    // so its delay shows. Its delay at low frequencies is about sqrt(2) / (2 pi cutoff) seconds.
    function lowPass(values, cutoffHz, sampleRate) {
        const w0 = (2 * Math.PI * cutoffHz) / sampleRate;
        const alpha = Math.sin(w0) / (2 * Math.SQRT1_2); // Q = 1 / sqrt(2): Butterworth
        const cos = Math.cos(w0);
        const a0 = 1 + alpha;
        const b0 = (1 - cos) / 2 / a0;
        const b1 = (1 - cos) / a0;
        const a1 = (-2 * cos) / a0;
        const a2 = (1 - alpha) / a0;
        const out = new Float64Array(values.length);
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        for (let i = 0; i < values.length; i++) {
            const y = b0 * values[i] + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2;
            x2 = x1;
            x1 = values[i];
            y2 = y1;
            y1 = y;
            out[i] = y;
        }
        return out;
    }

    // Method 1, the classic: full-wave rectify, then low-pass filter away the carrier ripple.
    // The average of |sin| is 2/pi of its peak, so scale by pi/2 to read the envelope's height.
    function rectifyEnvelope(values, cutoffHz, sampleRate) {
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        return lowPass(values.map((v) => (Math.abs(v - mean) * Math.PI) / 2), cutoffHz, sampleRate);
    }

    // Method 2: the magnitude of the analytic signal, |z| = sqrt(x^2 + H{x}^2)
    function hilbertEnvelope(z) {
        return z.re.map((re, i) => Math.hypot(re, z.im[i]));
    }

    // How far an envelope estimate is behind the true envelope (the shift, up to maxLagSeconds, that
    // lines them up best), and the RMS error left once that delay is removed (carrier ripple plus noise).
    // Ignores the first and last 10%, where the edge effects are.
    function compareWithTruth(estimate, truth, sampleRate, maxLagSeconds) {
        const n = truth.length;
        const from = Math.floor(n * 0.1);
        const to = Math.floor(n * 0.9);
        const maxLag = Math.floor(maxLagSeconds * sampleRate);
        const mean = truth.reduce((sum, v) => sum + v, 0) / n;
        let bestLag = 0;
        let best = -Infinity;
        for (let lag = -maxLag; lag <= maxLag; lag++) {
            let sum = 0;
            for (let i = from; i < to; i++) sum += (estimate[i + lag] - mean) * (truth[i] - mean);
            if (sum > best) {
                best = sum;
                bestLag = lag;
            }
        }
        let squares = 0;
        for (let i = from; i < to; i++) squares += (estimate[i + bestLag] - truth[i]) ** 2;
        return { lagMs: (1000 * bestLag) / sampleRate, rmsError: Math.sqrt(squares / (to - from)) };
    }

    // --- Chart 1: the signal and its envelopes ---
    const top = await SciChartSurface.create(ui.signalDiv, { theme: new SciChartJsNavyTheme() });
    top.sciChartSurface.xAxes.add(new NumericAxis(top.wasmContext, { axisTitle: "Time (s)" }));
    top.sciChartSurface.yAxes.add(
        new NumericAxis(top.wasmContext, {
            axisTitle: "Signal",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.05, 0.05)
        })
    );
    const signalSeries = new XyDataSeries(top.wasmContext, { dataSeriesName: "Signal", dataIsSortedInX: true });
    const trueSeries = new XyDataSeries(top.wasmContext, { dataSeriesName: "True envelope", dataIsSortedInX: true });
    const rectifySeries = new XyDataSeries(top.wasmContext, {
        dataSeriesName: "Rectify + low-pass",
        dataIsSortedInX: true
    });
    const hilbertSeries = new XyDataSeries(top.wasmContext, {
        dataSeriesName: "Hilbert envelope ±|z|",
        dataIsSortedInX: true
    });
    const hilbertLowerSeries = new XyDataSeries(top.wasmContext, {
        dataSeriesName: "Hilbert envelope −|z|",
        dataIsSortedInX: true
    });
    const signalLine = new FastLineRenderableSeries(top.wasmContext, {
        dataSeries: signalSeries,
        stroke: "#3E8FC0",
        strokeThickness: 1
    });
    const trueLine = new FastLineRenderableSeries(top.wasmContext, {
        dataSeries: trueSeries,
        stroke: "#FFFFFF",
        strokeThickness: 1.5,
        strokeDashArray: [6, 4]
    });
    const rectifyLine = new FastLineRenderableSeries(top.wasmContext, {
        dataSeries: rectifySeries,
        stroke: "#F48420",
        strokeThickness: 3
    });
    const hilbertLine = new FastLineRenderableSeries(top.wasmContext, {
        dataSeries: hilbertSeries,
        stroke: "#F5E663",
        strokeThickness: 2.5
    });
    const hilbertLowerLine = new FastLineRenderableSeries(top.wasmContext, {
        dataSeries: hilbertLowerSeries,
        stroke: "#F5E663",
        strokeThickness: 2.5
    });
    top.sciChartSurface.renderableSeries.add(signalLine, trueLine, rectifyLine, hilbertLine, hilbertLowerLine);
    const topLegend = new LegendModifier({ showCheckboxes: true });
    top.sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        topLegend,
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- Chart 2: each method's error against the true envelope, or (for the chirp) instantaneous frequency ---
    const lower = await SciChartSurface.create(ui.lowerDiv, { theme: new SciChartJsNavyTheme() });
    lower.sciChartSurface.xAxes.add(new NumericAxis(lower.wasmContext, { axisTitle: "Time (s)" }));
    const lowerYAxis = new NumericAxis(lower.wasmContext, {
        axisTitle: "Envelope error",
        autoRange: EAutoRange.Never // set in update()
    });
    lower.sciChartSurface.yAxes.add(lowerYAxis);
    const rectifyErrorSeries = new XyDataSeries(lower.wasmContext, {
        dataSeriesName: "Rectify + low-pass error",
        dataIsSortedInX: true
    });
    const hilbertErrorSeries = new XyDataSeries(lower.wasmContext, {
        dataSeriesName: "Hilbert error",
        dataIsSortedInX: true
    });
    const trueFrequencySeries = new XyDataSeries(lower.wasmContext, {
        dataSeriesName: "True frequency",
        dataIsSortedInX: true
    });
    const hilbertFrequencySeries = new XyDataSeries(lower.wasmContext, {
        dataSeriesName: "Instantaneous frequency (Hilbert)",
        dataIsSortedInX: true
    });
    const rectifyErrorLine = new FastLineRenderableSeries(lower.wasmContext, {
        dataSeries: rectifyErrorSeries,
        stroke: "#F48420",
        strokeThickness: 2
    });
    const hilbertErrorLine = new FastLineRenderableSeries(lower.wasmContext, {
        dataSeries: hilbertErrorSeries,
        stroke: "#F5E663",
        strokeThickness: 1.5
    });
    const trueFrequencyLine = new FastLineRenderableSeries(lower.wasmContext, {
        dataSeries: trueFrequencySeries,
        stroke: "#FFFFFF",
        strokeThickness: 1.5,
        strokeDashArray: [6, 4]
    });
    const hilbertFrequencyLine = new FastLineRenderableSeries(lower.wasmContext, {
        dataSeries: hilbertFrequencySeries,
        stroke: "#F5E663",
        strokeThickness: 1.5
    });
    lower.sciChartSurface.renderableSeries.add(
        rectifyErrorLine,
        hilbertErrorLine,
        hilbertFrequencyLine,
        trueFrequencyLine
    );
    const lowerLegend = new LegendModifier({ showCheckboxes: true });
    lower.sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        lowerLegend,
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // Replace a data series' values
    function setData(dataSeries, x, y) {
        dataSeries.clear();
        dataSeries.appendRange(x, Array.from(y));
    }

    // --- The controls: every change reruns the DSP and redraws ---
    function update() {
        const kind = ui.signalSelect.value;
        const depth = Number(ui.depthInput.value) / 100;
        const noiseLevel = Number(ui.noiseInput.value) / 100;
        const cutoffHz = 2 * Math.pow(100, Number(ui.cutoffInput.value) / 100); // log scale, 2 to 200 Hz
        const method = ui.methodSelect.value;
        ui.depthInput.disabled = kind !== "am";
        const useBand = ui.bandCheckbox.checked;
        ui.cutoffInput.disabled = method === "hilbert" && !useBand;
        ui.bandCheckbox.disabled = method === "rectify";
        ui.depthOutput.textContent = `${Math.round(depth * 100)}%`;
        ui.noiseOutput.textContent = noiseLevel.toFixed(2);
        ui.cutoffOutput.textContent = `${cutoffHz < 10 ? cutoffHz.toFixed(1) : cutoffHz.toFixed(0)} Hz`;

        const { x, y, envelope, frequency, carrierRange } = makeSignal(kind, depth, noiseLevel);
        const rectified = rectifyEnvelope(y, cutoffHz, SAMPLE_RATE);
        // The band-pass keeps the carrier range and rolls off to half gain at the cutoff on either side,
        // so both methods pass about the same envelope bandwidth
        const band = useBand
            ? { low: carrierRange[0] - cutoffHz / 2, high: carrierRange[1] + cutoffHz / 2, taper: cutoffHz }
            : null;
        const z = analyticSignal(y, SAMPLE_RATE, band);
        const hilbert = hilbertEnvelope(z);

        setData(signalSeries, x, y);
        setData(trueSeries, x, envelope);
        setData(rectifySeries, x, rectified);
        setData(hilbertSeries, x, hilbert);
        setData(hilbertLowerSeries, x, hilbert.map((v) => -v));
        setData(rectifyErrorSeries, x, rectified.map((v, i) => v - envelope[i]));
        setData(hilbertErrorSeries, x, hilbert.map((v, i) => v - envelope[i]));
        setData(trueFrequencySeries, x, frequency);
        const frequencies = instantaneousFrequency(z, SAMPLE_RATE);
        setData(hilbertFrequencySeries, x, frequencies);

        // Show only the series that apply to this signal and method, in the charts and in their legends
        // (once includeSeries has been called, a legend lists only the series included)
        topLegend.includeSeries(signalLine, true);
        topLegend.includeSeries(trueLine, true);
        const showRectify = method !== "hilbert";
        const showHilbert = method !== "rectify";
        const chirp = kind === "chirp";
        const show = (series, legend, visible) => {
            series.isVisible = visible;
            legend.includeSeries(series, visible);
        };
        show(rectifyLine, topLegend, showRectify);
        show(hilbertLine, topLegend, showHilbert);
        hilbertLowerLine.isVisible = showHilbert;
        topLegend.includeSeries(hilbertLowerLine, false); // one legend entry is enough for +|z| and -|z|
        show(rectifyErrorLine, lowerLegend, showRectify && !chirp);
        show(hilbertErrorLine, lowerLegend, showHilbert && !chirp);
        show(trueFrequencyLine, lowerLegend, chirp);
        show(hilbertFrequencyLine, lowerLegend, chirp);

        // The lower chart's y-axis: the frequency range for the chirp; otherwise scaled to the errors away from
        // the ends of the block, so the start-up and edge errors don't squash the rest
        lowerYAxis.axisTitle = chirp ? "Frequency (Hz)" : "Envelope error";
        lowerYAxis.labelProvider.precision = chirp ? 0 : 2;
        if (chirp) {
            lowerYAxis.visibleRange = new NumberRange(0, 1000);
        } else {
            let largest = 0.05;
            for (let i = Math.floor(SAMPLE_COUNT / 10); i < Math.floor((SAMPLE_COUNT * 9) / 10); i++) {
                if (showRectify) largest = Math.max(largest, Math.abs(rectified[i] - envelope[i]));
                if (showHilbert) largest = Math.max(largest, Math.abs(hilbert[i] - envelope[i]));
            }
            lowerYAxis.visibleRange = new NumberRange(-1.2 * largest, 1.2 * largest);
        }

        // The readout. The chirp's envelope changes too slowly to measure a lag, so it reports the
        // instantaneous frequency error instead.
        const parts = [];
        const maxLagSeconds = chirp ? 0 : 0.1;
        const describe = (name, estimate) => {
            const { lagMs, rmsError } = compareWithTruth(estimate, envelope, SAMPLE_RATE, maxLagSeconds);
            const lag = chirp ? "" : `lag ${Math.round(lagMs) || 0} ms, `; // || 0 turns -0 into 0
            parts.push(`${name}: ${lag}ripple and noise ${rmsError.toFixed(3)} RMS`);
        };
        if (showRectify) describe("Rectify + low-pass", rectified);
        if (showHilbert) describe("Hilbert", hilbert);
        if (chirp) {
            const error = frequencies
                .map((f, i) => f - frequency[i])
                .slice(Math.floor(SAMPLE_COUNT / 10), Math.floor((SAMPLE_COUNT * 9) / 10));
            const rms = Math.sqrt(error.reduce((sum, e) => sum + e * e, 0) / error.length);
            parts.push(`instantaneous frequency error ${rms.toFixed(1)} Hz RMS`);
        }
        ui.summary.textContent = parts.join(" · ");
    }

    for (const input of [ui.depthInput, ui.noiseInput, ui.cutoffInput]) input.addEventListener("input", update);
    for (const select of [ui.signalSelect, ui.methodSelect, ui.bandCheckbox]) select.addEventListener("change", update);
    update();
    // #region_A_end
}

envelopeDetectionChart("scichart-root");
