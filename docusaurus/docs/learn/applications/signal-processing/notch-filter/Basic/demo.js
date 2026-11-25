import * as SciChart from "scichart";

const SAMPLE_RATE = 1000; // samples per second
const SAMPLE_COUNT = 4096; // about 4.1 seconds; a power of two, so the spectrum can use a radix-2 FFT
const HUM_OFFSET = 0.2; // Hz: real mains frequency wanders, so this hum sits 0.2 Hz above the nominal 50 or 60 Hz
const HUM_AMPLITUDES = [0.25, 0.04, 0.1, 0.02, 0.05]; // mV at 1x, 2x, 3x, 4x and 5x the mains frequency
const HUM_PHASES = [0.3, 1.9, 4.0, 2.6, 5.1];
const STEP_TIME = 2.5; // seconds: when the optional electrode "pop" happens

// Sample data: an ECG-like trace (a beat every 0.8 s) picked up together with mains hum and its harmonics,
// plus a little noise from a seeded random generator, so the chart looks the same every time.
// Optionally, a sudden step that decays slowly, like an electrode pop, to show a notch filter ringing.
function makeEcgWithHum(mainsHz, withStep) {
    let seed = 7;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const bump = (t, centre, width, height) => height * Math.exp(-0.5 * ((t - centre) / width) ** 2);
    const humHz = mainsHz + HUM_OFFSET;
    const x = [];
    const y = [];
    for (let n = 0; n < SAMPLE_COUNT; n++) {
        const t = n / SAMPLE_RATE;
        const beat = (t % 0.8) - 0.3; // time since this beat's R peak
        const ecg =
            bump(beat, -0.2, 0.025, 0.15) + // P wave
            bump(beat, -0.035, 0.008, -0.12) + // Q
            bump(beat, 0, 0.01, 1.0) + // R
            bump(beat, 0.03, 0.01, -0.25) + // S
            bump(beat, 0.25, 0.04, 0.3); // T wave
        let hum = 0;
        HUM_AMPLITUDES.forEach((amplitude, k) => {
            hum += amplitude * Math.sin(2 * Math.PI * (k + 1) * humHz * t + HUM_PHASES[k]);
        });
        const step = withStep && t >= STEP_TIME ? 0.6 * Math.exp(-(t - STEP_TIME) / 0.8) : 0;
        x.push(t);
        y.push(ecg + hum + step + (random() - 0.5) * 0.02);
    }
    return { x, y };
}

// The controls and the two charts each need an element. This splits the page's div into a control bar,
// a time chart and a spectrum chart; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const bar = document.createElement("div");
    bar.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    bar.innerHTML =
        `<label>Mains <select data-id="mains" style="font:inherit">` +
        `<option value="50">50 Hz</option><option value="60">60 Hz</option></select></label>` +
        `<label>Notch centre <input data-id="centre" type="range" min="40" max="70" step="0.1" value="50" ` +
        `style="vertical-align:middle; width:130px"> <output data-id="centre"></output></label>` +
        `<label>Q <input data-id="q" type="range" min="0" max="100" value="50" ` +
        `style="vertical-align:middle; width:110px"> <output data-id="q"></output></label>` +
        `<label>Notches <select data-id="harmonics" style="font:inherit">` +
        `<option value="1">1 (fundamental only)</option><option value="2">2</option><option value="3">3</option>` +
        `<option value="4">4</option><option value="5" selected>5 (up to 5th harmonic)</option></select></label>` +
        `<label>Show <select data-id="show" style="font:inherit">` +
        `<option value="both">Before and after</option><option value="before">Before</option>` +
        `<option value="after">After</option></select></label>` +
        `<label><input data-id="step" type="checkbox"> Add a step (electrode pop)</label>` +
        `<span data-id="summary" aria-live="polite" style="color:#c8d3e8"></span>`;
    const timeDiv = document.createElement("div");
    timeDiv.id = divElementId + "-time";
    timeDiv.style.cssText = "flex:1; min-height:0;";
    const spectrumDiv = document.createElement("div");
    spectrumDiv.id = divElementId + "-spectrum";
    spectrumDiv.style.cssText = "flex:1; min-height:0;";
    root.append(bar, timeDiv, spectrumDiv);
    const get = (selector) => bar.querySelector(selector);
    return {
        timeDiv,
        spectrumDiv,
        mainsSelect: get('select[data-id="mains"]'),
        centreInput: get('input[data-id="centre"]'),
        centreOutput: get('output[data-id="centre"]'),
        qInput: get('input[data-id="q"]'),
        qOutput: get('output[data-id="q"]'),
        harmonicsSelect: get('select[data-id="harmonics"]'),
        showSelect: get('select[data-id="show"]'),
        stepCheckbox: get('input[data-id="step"]'),
        summary: get('span[data-id="summary"]')
    };
}

async function notchFilterChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Remove mains hum with a notch filter, and chart the signal and its spectrum with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        FastLineRenderableSeries,
        XyDataSeries,
        XyCustomFilter,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Notch filter helpers (plain JavaScript, no library needed) ---

    // A second-order IIR notch (a "biquad"), from the analogue H(s) = (s^2 + w0^2) / (s^2 + (w0/Q) s + w0^2)
    // by the bilinear transform (the widely used Audio EQ Cookbook form). Its two zeros sit on the unit circle
    // at the notch frequency, so that frequency is removed completely; its two poles sit just inside, at the
    // same angle, so the gain returns to 1 (0 dB) a little way either side. Higher Q = poles closer = narrower.
    function designNotch(centreHz, q, sampleRate) {
        const w0 = (2 * Math.PI * centreHz) / sampleRate;
        const alpha = Math.sin(w0) / (2 * q);
        const a0 = 1 + alpha;
        return {
            b: [1 / a0, (-2 * Math.cos(w0)) / a0, 1 / a0], // feed-forward: the zeros
            a: [1, (-2 * Math.cos(w0)) / a0, (1 - alpha) / a0], // feedback: the poles
            alpha
        };
    }

    // One notch at the mains frequency and, optionally, one at each harmonic (2x, 3x...): a comb of notches.
    // Each notch has the same Q, so the higher ones are proportionally wider.
    function designNotchComb(centreHz, q, count, sampleRate) {
        const sections = [];
        for (let k = 1; k <= count && k * centreHz < sampleRate / 2; k++) {
            sections.push(designNotch(k * centreHz, q, sampleRate));
        }
        return sections;
    }

    // Run the samples through each biquad in turn (Direct Form I):
    // y[n] = b0 x[n] + b1 x[n-1] + b2 x[n-2] - a1 y[n-1] - a2 y[n-2]
    function applyNotches(sections, input) {
        let signal = input;
        for (const { b, a } of sections) {
            const output = new Array(signal.length);
            let x1 = 0, x2 = 0, y1 = 0, y2 = 0; // the filter starts from rest
            for (let n = 0; n < signal.length; n++) {
                const y = b[0] * signal[n] + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2;
                x2 = x1;
                x1 = signal[n];
                y2 = y1;
                y1 = y;
                output[n] = y;
            }
            signal = output;
        }
        return signal;
    }

    // Gain in dB of the whole comb at frequency f: the sum of each section's
    // |B(e^jw)|^2 / |A(e^jw)|^2 in dB, with w = 2 pi f / sampleRate
    function combGainDb(sections, f, sampleRate) {
        const w = (2 * Math.PI * f) / sampleRate;
        const power = (c) => {
            const re = c[0] + c[1] * Math.cos(w) + c[2] * Math.cos(2 * w);
            const im = -c[1] * Math.sin(w) - c[2] * Math.sin(2 * w);
            return re * re + im * im;
        };
        let db = 0;
        for (const { b, a } of sections) db += 10 * Math.log10(Math.max(power(b) / power(a), 1e-12));
        return db;
    }

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
            const step = (-2 * Math.PI) / size;
            for (let start = 0; start < n; start += size) {
                for (let k = 0; k < size / 2; k++) {
                    const cos = Math.cos(step * k);
                    const sin = Math.sin(step * k);
                    const p = start + k;
                    const q = p + size / 2;
                    const tr = re[q] * cos - im[q] * sin;
                    const ti = re[q] * sin + im[q] * cos;
                    re[q] = re[p] - tr;
                    im[q] = im[p] - ti;
                    re[p] += tr;
                    im[p] += ti;
                }
            }
        }
    }

    // Amplitude spectrum in dB (0 dB = a 1 mV sine), with a Hann window to limit spectral leakage
    function amplitudeSpectrumDb(values, sampleRate) {
        const n = values.length;
        const re = new Array(n);
        const im = new Array(n).fill(0);
        let windowSum = 0;
        for (let i = 0; i < n; i++) {
            const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n);
            re[i] = values[i] * w;
            windowSum += w;
        }
        fft(re, im);
        const freqs = [];
        const db = [];
        for (let k = 0; k <= n / 2; k++) {
            freqs.push((k * sampleRate) / n);
            const amplitude = (2 * Math.hypot(re[k], im[k])) / windowSum;
            db.push(20 * Math.log10(Math.max(amplitude, 1e-6)));
        }
        return { freqs, db };
    }

    // --- Chart 1: the signal before and after the notch filter, over time ---
    const time = await SciChartSurface.create(ui.timeDiv, { theme: new SciChartJsNavyTheme() });
    time.sciChartSurface.xAxes.add(new NumericAxis(time.wasmContext, { axisTitle: "Time (s)" }));
    time.sciChartSurface.yAxes.add(
        new NumericAxis(time.wasmContext, {
            axisTitle: "Signal (mV)",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.05, 0.05)
        })
    );

    const rawSeries = new XyDataSeries(time.wasmContext, {
        dataSeriesName: "Before: ECG with mains hum",
        dataIsSortedInX: true,
        dataEvenlySpacedInX: true
    });

    // --- The notch filter, applied by SciChart.js with an XyCustomFilter ---
    // XyCustomFilter calls filterFunction(index, y) for each sample. An IIR filter depends on every earlier
    // sample, so on a full recompute (index 0) or when data is appended, this filters the whole series once
    // and caches the result; each call then returns one cached value.
    let sections = [];
    let filtered = [];
    function notchAt(index) {
        if (index === 0 || index >= filtered.length) {
            const values = rawSeries.getNativeYValues();
            const source = [];
            for (let i = 0; i < rawSeries.count(); i++) source.push(values.get(i));
            filtered = applyNotches(sections, source);
        }
        return filtered[index];
    }
    const cleanSeries = new XyCustomFilter(rawSeries, {
        dataSeriesName: "After: notch filtered",
        filterFunction: notchAt
    });

    const rawLine = new FastLineRenderableSeries(time.wasmContext, {
        dataSeries: rawSeries,
        stroke: "#F48420",
        strokeThickness: 1.5
    });
    const cleanLine = new FastLineRenderableSeries(time.wasmContext, {
        dataSeries: cleanSeries,
        stroke: "#50C7E0",
        strokeThickness: 2
    });
    time.sciChartSurface.renderableSeries.add(rawLine, cleanLine);
    time.sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new LegendModifier({ showCheckboxes: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- Chart 2: the spectrum before and after (left axis), and the notch filter's gain (right axis) ---
    const spectrum = await SciChartSurface.create(ui.spectrumDiv, { theme: new SciChartJsNavyTheme() });
    spectrum.sciChartSurface.xAxes.add(
        new NumericAxis(spectrum.wasmContext, {
            axisTitle: "Frequency (Hz)",
            visibleRange: new NumberRange(0, 320)
        })
    );
    spectrum.sciChartSurface.yAxes.add(
        new NumericAxis(spectrum.wasmContext, {
            axisTitle: "Amplitude (dB re 1 mV)",
            axisAlignment: EAxisAlignment.Left,
            visibleRange: new NumberRange(-100, 0),
            labelPrecision: 0
        }),
        new NumericAxis(spectrum.wasmContext, {
            id: "gain",
            axisTitle: "Filter gain (dB)",
            axisAlignment: EAxisAlignment.Right,
            visibleRange: new NumberRange(-60, 5),
            labelPrecision: 0
        })
    );
    const rawSpectrum = new XyDataSeries(spectrum.wasmContext, { dataSeriesName: "Spectrum before" });
    const cleanSpectrum = new XyDataSeries(spectrum.wasmContext, { dataSeriesName: "Spectrum after" });
    const gainSeries = new XyDataSeries(spectrum.wasmContext, { dataSeriesName: "Notch filter gain" });
    const rawSpectrumLine = new FastLineRenderableSeries(spectrum.wasmContext, {
        dataSeries: rawSpectrum,
        stroke: "#F48420",
        strokeThickness: 1.5
    });
    const cleanSpectrumLine = new FastLineRenderableSeries(spectrum.wasmContext, {
        dataSeries: cleanSpectrum,
        stroke: "#50C7E0",
        strokeThickness: 1.5
    });
    spectrum.sciChartSurface.renderableSeries.add(
        // the gain first, so it's drawn behind the two spectra
        new FastLineRenderableSeries(spectrum.wasmContext, {
            dataSeries: gainSeries,
            yAxisId: "gain",
            stroke: "#F5E663",
            strokeThickness: 1.5
        }),
        rawSpectrumLine,
        cleanSpectrumLine
    );
    spectrum.sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new LegendModifier({ showCheckboxes: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // The filter's gain on a fine grid, plus extra points close to each notch so its depth shows
    function updateGain(centreHz, q) {
        const freqs = [];
        for (let f = 0; f <= SAMPLE_RATE / 2; f += 0.25) freqs.push(f);
        sections.forEach((_, k) => {
            const width = ((k + 1) * centreHz) / q;
            for (let i = -40; i <= 40; i++) freqs.push((k + 1) * centreHz + (i / 20) * width);
        });
        freqs.sort((f1, f2) => f1 - f2);
        gainSeries.clear();
        gainSeries.appendRange(
            freqs,
            freqs.map((f) => combGainDb(sections, f, SAMPLE_RATE))
        );
    }

    // --- The controls ---
    function loadData() {
        const { x, y } = makeEcgWithHum(Number(ui.mainsSelect.value), ui.stepCheckbox.checked);
        rawSeries.clear();
        rawSeries.appendRange(x, y);
        const before = amplitudeSpectrumDb(y, SAMPLE_RATE);
        rawSpectrum.clear();
        rawSpectrum.appendRange(before.freqs, before.db);
    }

    function onControlsChanged() {
        const centreHz = Number(ui.centreInput.value);
        const q = Math.pow(10, Number(ui.qInput.value) / 50); // the slider runs from Q = 1 to Q = 100, on a log scale
        ui.centreOutput.textContent = `${centreHz.toFixed(1)} Hz`;
        ui.qOutput.textContent = q < 10 ? q.toFixed(1) : q.toFixed(0);

        sections = designNotchComb(centreHz, q, Number(ui.harmonicsSelect.value), SAMPLE_RATE);
        cleanSeries.filterFunction = notchAt; // setting the function reruns the filter over all the data
        const after = amplitudeSpectrumDb(filtered, SAMPLE_RATE);
        cleanSpectrum.clear();
        cleanSpectrum.appendRange(after.freqs, after.db);
        updateGain(centreHz, q);

        // How much hum power the filter removes, over all the harmonics present in the signal
        const humHz = Number(ui.mainsSelect.value) + HUM_OFFSET;
        let humIn = 0;
        let humOut = 0;
        HUM_AMPLITUDES.forEach((amplitude, k) => {
            humIn += amplitude ** 2;
            humOut += amplitude ** 2 * Math.pow(10, combGainDb(sections, (k + 1) * humHz, SAMPLE_RATE) / 10);
        });
        // The first notch's -3 dB width, from tan(width / 2) = alpha (in radians per sample), and how long it
        // rings: its poles have radius r = sqrt((1 - alpha) / (1 + alpha)), so ringing decays by 1/e in
        // -1 / ln(r) samples. Narrower notch = longer ringing: width (Hz) x time constant (s) is about 1/pi.
        const alpha = sections[0].alpha;
        const widthHz = (SAMPLE_RATE / Math.PI) * Math.atan(alpha);
        const ringMs = (-1000 / SAMPLE_RATE) / Math.log(Math.sqrt((1 - alpha) / (1 + alpha)));
        ui.summary.textContent =
            `Hum at ${humHz.toFixed(1)} Hz reduced by ${(-10 * Math.log10(humOut / humIn)).toFixed(1)} dB` +
            ` · notch width ${widthHz < 1 ? widthHz.toFixed(2) : widthHz.toFixed(1)} Hz at -3 dB` +
            ` · rings for about ${ringMs.toFixed(0)} ms`;
    }

    ui.mainsSelect.addEventListener("change", () => {
        ui.centreInput.value = ui.mainsSelect.value; // centre the notch on the new nominal frequency
        loadData();
        onControlsChanged();
    });
    ui.stepCheckbox.addEventListener("change", () => {
        loadData();
        onControlsChanged();
    });
    ui.centreInput.addEventListener("input", onControlsChanged);
    ui.qInput.addEventListener("input", onControlsChanged);
    ui.harmonicsSelect.addEventListener("change", onControlsChanged);
    ui.showSelect.addEventListener("change", () => {
        const show = ui.showSelect.value;
        rawLine.isVisible = rawSpectrumLine.isVisible = show !== "after";
        cleanLine.isVisible = cleanSpectrumLine.isVisible = show !== "before";
    });
    loadData();
    onControlsChanged();
    // #region_A_end
}

notchFilterChart("scichart-root");
