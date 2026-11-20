import * as SciChart from "scichart";

const SAMPLE_RATE = 250; // samples per second, typical for an ECG
const DURATION = 8; // seconds
const FIR_TAPS = 1001; // length of the windowed-sinc kernel (odd, so it has a centre tap)

// Sample data: an ECG-like trace (a beat every 0.8 s) riding on baseline wander: a DC offset plus slow drift,
// such as breathing and electrode movement cause, and a little noise from a seeded random generator,
// so the chart looks the same every time.
let seed = 7;
const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
};
function makeEcgWithDrift() {
    const x = [];
    const y = [];
    const bump = (t, centre, width, height) => height * Math.exp(-0.5 * ((t - centre) / width) ** 2);
    for (let n = 0; n < SAMPLE_RATE * DURATION; n++) {
        const t = n / SAMPLE_RATE;
        const beat = (t % 0.8) - 0.3; // time since this beat's R peak
        const ecg =
            bump(beat, -0.2, 0.025, 0.15) + // P wave
            bump(beat, -0.035, 0.008, -0.12) + // Q
            bump(beat, 0, 0.01, 1.0) + // R
            bump(beat, 0.03, 0.01, -0.25) + // S
            bump(beat, 0.25, 0.04, 0.3); // T wave
        const drift = 1.2 + 0.5 * Math.sin(2 * Math.PI * 0.12 * t) + 0.25 * Math.sin(2 * Math.PI * 0.31 * t + 1);
        x.push(t);
        y.push(ecg + drift + (random() - 0.5) * 0.04);
    }
    return { x, y };
}

// The controls and the two charts each need an element. This splits the page's div into a control bar,
// a time chart and a frequency-response chart; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const bar = document.createElement("div");
    bar.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:8px 20px; padding:8px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    bar.innerHTML =
        `<label>Cutoff <input type="range" min="0" max="100" value="50" ` +
        `style="vertical-align:middle; width:160px"> <output></output></label>` +
        `<label>Filter <select style="font:inherit">` +
        `<option value="iir">First-order IIR (RC, DC blocker)</option>` +
        `<option value="fir">Windowed-sinc FIR (${FIR_TAPS} taps)</option></select></label>`;
    const timeDiv = document.createElement("div");
    timeDiv.id = divElementId + "-time";
    timeDiv.style.cssText = "flex:3; min-height:0;";
    const responseDiv = document.createElement("div");
    responseDiv.id = divElementId + "-response";
    responseDiv.style.cssText = "flex:2; min-height:0;";
    root.append(bar, timeDiv, responseDiv);
    return {
        timeDiv,
        responseDiv,
        cutoffInput: bar.querySelector("input"),
        cutoffOutput: bar.querySelector("output"),
        typeSelect: bar.querySelector("select")
    };
}

async function highPassFilterChart(divElementId) {
    const { timeDiv, responseDiv, cutoffInput, cutoffOutput, typeSelect } = createLayout(divElementId);

    // #region_A_start
    // Remove drift with a high-pass filter, and chart the result with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        EAutoRange,
        ENumericFormat,
        FastLineRenderableSeries,
        XyDataSeries,
        XyCustomFilter,
        VerticalLineAnnotation,
        HorizontalLineAnnotation,
        ELabelPlacement,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- High-pass filter helpers (plain JavaScript, no library needed) ---

    // First-order IIR high-pass: the digital version of an RC circuit, often called a DC blocker.
    // y[n] = alpha * (y[n-1] + x[n] - x[n-1]), with alpha = RC / (RC + dt) and RC = 1 / (2 * pi * cutoff).
    function firstOrderAlpha(cutoffHz, sampleRate) {
        const rc = 1 / (2 * Math.PI * cutoffHz);
        return rc / (rc + 1 / sampleRate);
    }

    // Windowed-sinc FIR high-pass: design a low-pass kernel (a sinc shaped by a Blackman window), scale it to a
    // gain of 1 at 0 Hz, then use spectral inversion: negate every tap and add 1 to the centre tap. The result
    // passes what the low-pass would remove. Its cutoff is where the gain is 0.5 (-6 dB).
    function designHighPassFir(cutoffHz, sampleRate, numTaps) {
        const fc = cutoffHz / sampleRate; // cutoff as a fraction of the sample rate
        const M = numTaps - 1;
        const h = [];
        let sum = 0;
        for (let i = 0; i <= M; i++) {
            const k = i - M / 2;
            const sinc = k === 0 ? 2 * Math.PI * fc : Math.sin(2 * Math.PI * fc * k) / k;
            const blackman = 0.42 - 0.5 * Math.cos((2 * Math.PI * i) / M) + 0.08 * Math.cos((4 * Math.PI * i) / M);
            h.push(sinc * blackman);
            sum += sinc * blackman;
        }
        for (let i = 0; i <= M; i++) h[i] = -h[i] / sum; // normalise the low-pass, and negate it
        h[M / 2] += 1; // ...then add an impulse: high-pass = original - low-pass
        return h;
    }

    // Gain in decibels of a filter with coefficients b and a at frequency f:
    // |H| = |sum(b[k] e^(-jwk))| / |sum(a[k] e^(-jwk))|, with w = 2 * pi * f / sampleRate.
    function gainDb(b, a, f, sampleRate) {
        const w = (2 * Math.PI * f) / sampleRate;
        const sumAt = (c) => {
            let re = 0;
            let im = 0;
            c.forEach((value, k) => {
                re += value * Math.cos(w * k);
                im -= value * Math.sin(w * k);
            });
            return re * re + im * im;
        };
        return 10 * Math.log10(Math.max(sumAt(b) / sumAt(a), 1e-12));
    }

    // --- Chart 1: the raw signal and the high-passed signal over time ---
    const time = await SciChartSurface.create(timeDiv, { theme: new SciChartJsNavyTheme() });
    time.sciChartSurface.xAxes.add(new NumericAxis(time.wasmContext, { axisTitle: "Time (s)" }));
    time.sciChartSurface.yAxes.add(
        new NumericAxis(time.wasmContext, {
            axisTitle: "Signal (mV)",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.05, 0.05)
        })
    );

    const { x, y } = makeEcgWithDrift(); // your data: evenly spaced samples
    const rawSeries = new XyDataSeries(time.wasmContext, {
        xValues: x,
        yValues: y,
        dataSeriesName: "Raw: ECG with baseline drift",
        dataIsSortedInX: true,
        dataEvenlySpacedInX: true
    });
    // --- The high-pass filter, applied by SciChart.js with an XyCustomFilter ---
    // XyCustomFilter calls filterFunction(index, y) once per sample, in index order: from index 0 on a full
    // recompute (when the filter is created or its function is set), and from the first new index when data
    // is appended. Because it gets the index, the function can read neighbouring samples from the source
    // series, and it keeps the IIR's previous output between calls.
    let filterType = "iir";
    let alpha = 1; // IIR coefficient
    let kernel = [1]; // FIR taps
    let coefficients = { b: [1], a: [1] }; // b: feed-forward, a: feedback, for the frequency response
    let source = []; // the raw values, read from the source series once per pass
    let previousOutput = 0; // IIR state: y[n-1]

    function highPassAt(index, value) {
        // Read the raw values on a full recompute (index 0), or when new samples have been appended
        if (index === 0 || index >= source.length) {
            const values = rawSeries.getNativeYValues();
            source = [];
            for (let i = 0; i < rawSeries.count(); i++) source.push(values.get(i));
        }
        if (filterType === "fir") {
            // Convolution centred on this sample, so the output isn't delayed. Past the ends of the data,
            // repeat the first and last samples, so a DC offset doesn't cause a jump. (With live data, the
            // last few outputs are computed before the samples after them arrive.)
            const half = (kernel.length - 1) / 2;
            let acc = 0;
            for (let k = 0; k < kernel.length; k++) {
                const i = Math.min(source.length - 1, Math.max(0, index + half - k));
                acc += kernel[k] * source[i];
            }
            return acc;
        }
        // First-order IIR. Start at 0, as if the input had always been at its first value (no start-up jump)
        previousOutput = index === 0 ? 0 : alpha * (previousOutput + value - source[index - 1]);
        return previousOutput;
    }

    // Sets the filter type and cutoff, and the coefficients for the frequency response chart
    function configureFilter(cutoffHz, type) {
        filterType = type;
        if (type === "fir") {
            kernel = designHighPassFir(cutoffHz, SAMPLE_RATE, FIR_TAPS);
            coefficients = { b: kernel, a: [1] };
        } else {
            alpha = firstOrderAlpha(cutoffHz, SAMPLE_RATE);
            coefficients = { b: [alpha, -alpha], a: [1, -alpha] };
        }
    }
    configureFilter(0.5, "iir");

    // The filtered series: SciChart.js keeps it in step with rawSeries
    const highPassed = new XyCustomFilter(rawSeries, {
        dataSeriesName: "High-pass filtered",
        filterFunction: highPassAt
    });

    time.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(time.wasmContext, { dataSeries: rawSeries, stroke: "#F48420", strokeThickness: 1.5 }),
        new FastLineRenderableSeries(time.wasmContext, { dataSeries: highPassed, stroke: "#50C7E0", strokeThickness: 2 })
    );
    time.sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new LegendModifier({ showCheckboxes: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- Chart 2: the filter's frequency response (a Bode magnitude plot), log frequency vs gain in dB ---
    const response = await SciChartSurface.create(responseDiv, { theme: new SciChartJsNavyTheme() });
    response.sciChartSurface.xAxes.add(
        new LogarithmicAxis(response.wasmContext, {
            axisTitle: "Frequency (Hz)",
            logBase: 10,
            maxAutoTicks: 6, // one label per decade: 0.01, 0.1, 1, 10, 100
            labelFormat: ENumericFormat.SignificantFigures,
            labelPrecision: 2,
            visibleRange: new NumberRange(0.01, 100)
        })
    );
    response.sciChartSurface.yAxes.add(
        new NumericAxis(response.wasmContext, {
            axisTitle: "Gain (dB)",
            visibleRange: new NumberRange(-60, 6),
            labelPrecision: 0
        })
    );
    const responseSeries = new XyDataSeries(response.wasmContext, { dataSeriesName: "Gain" });
    response.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(response.wasmContext, {
            dataSeries: responseSeries,
            stroke: "#50C7E0",
            strokeThickness: 2
        })
    );
    // Mark the cutoff frequency and the -3 dB level
    const cutoffLine = new VerticalLineAnnotation({
        x1: 0.5,
        stroke: "#F48420",
        strokeDashArray: [6, 4],
        showLabel: true,
        labelPlacement: ELabelPlacement.TopRight,
        axisLabelFill: "#F48420"
    });
    response.sciChartSurface.annotations.add(
        cutoffLine,
        new HorizontalLineAnnotation({
            y1: -3,
            stroke: "#FFFFFF88",
            strokeDashArray: [2, 4],
            showLabel: true,
            labelValue: "-3 dB",
            labelPlacement: ELabelPlacement.TopLeft
        })
    );
    response.sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // Redraw the frequency response from the filter's coefficients: 300 frequencies, evenly spaced on a log scale
    function updateResponse(cutoffHz) {
        const freqs = [];
        const gains = [];
        for (let i = 0; i < 300; i++) {
            const f = 0.01 * Math.pow(100 / 0.01, i / 299); // 0.01 Hz to 100 Hz
            freqs.push(f);
            gains.push(gainDb(coefficients.b, coefficients.a, f, SAMPLE_RATE));
        }
        responseSeries.clear();
        responseSeries.appendRange(freqs, gains);
        cutoffLine.x1 = cutoffHz;
        cutoffLine.labelValue = `cutoff ${cutoffHz.toFixed(2)} Hz`;
    }

    // --- The controls: the slider sets the cutoff from 0.05 Hz to 5 Hz on a log scale ---
    function onControlsChanged() {
        const cutoffHz = 0.05 * Math.pow(100, Number(cutoffInput.value) / 100);
        cutoffOutput.textContent = `${cutoffHz.toFixed(2)} Hz`;
        configureFilter(cutoffHz, typeSelect.value);
        highPassed.filterFunction = highPassAt; // setting the function reruns the filter over all the data
        updateResponse(cutoffHz);
    }
    cutoffInput.addEventListener("input", onControlsChanged);
    typeSelect.addEventListener("change", onControlsChanged);
    onControlsChanged();
    // #region_A_end
}

highPassFilterChart("scichart-root");
