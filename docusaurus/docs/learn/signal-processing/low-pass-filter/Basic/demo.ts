import * as SciChart from "scichart";

const SAMPLE_RATE = 500; // samples per second (Hz)
const DURATION = 2; // seconds of signal
const HUM_FREQUENCY = 50; // Hz: mains hum, one of the things the filter should remove

// The controls and the two charts each need an element. This splits the page's div into two control bars,
// a time chart and a frequency-response chart; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const barStyle =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const inputStyle = "font:inherit; width:5em; vertical-align:middle";
    const filterBar = document.createElement("div");
    filterBar.style.cssText = barStyle;
    filterBar.innerHTML =
        `<label>Filter <select style="font:inherit">` +
        `<option value="moving-average">Moving average (FIR)</option>` +
        `<option value="windowed-sinc">Windowed-sinc (FIR)</option>` +
        `<option value="single-pole">Single-pole (IIR, like an RC circuit)</option></select></label>` +
        `<label>Cutoff <input type="range" min="0" max="100" step="0.1" value="39.3" ` +
        `style="vertical-align:middle; width:150px"> <output></output></label>` +
        `<span aria-live="polite" style="color:#c8d3e8"></span>`;
    const rcBar = document.createElement("div");
    rcBar.style.cssText = barStyle + "padding-top:0; color:#c8d3e8;";
    rcBar.innerHTML =
        `<span>RC calculator:</span>` +
        `<label>R <input type="number" min="0.001" step="any" value="10" style="${inputStyle}"> kΩ</label>` +
        `<label>C <input type="number" min="0.001" step="any" value="1.5" style="${inputStyle}"> µF</label>` +
        `<span>f<sub>c</sub> = 1 / (2πRC) = <output></output></span>` +
        `<button type="button" style="font:inherit">Use as cutoff</button>`;
    const timeDiv = document.createElement("div");
    timeDiv.id = divElementId + "-time";
    timeDiv.style.cssText = "flex:3; min-height:0;";
    const responseDiv = document.createElement("div");
    responseDiv.id = divElementId + "-response";
    responseDiv.style.cssText = "flex:2; min-height:0;";
    root.append(filterBar, rcBar, timeDiv, responseDiv);
    const [rInput, cInput] = rcBar.querySelectorAll("input");
    return {
        timeDiv,
        responseDiv,
        typeSelect: filterBar.querySelector("select"),
        cutoffInput: filterBar.querySelector("input"),
        cutoffOutput: filterBar.querySelector("output"),
        summary: filterBar.querySelector("span"),
        rInput,
        cInput,
        rcOutput: rcBar.querySelector("output"),
        rcButton: rcBar.querySelector("button")
    };
}

async function lowPassFilterChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // An interactive low-pass filter: filter a noisy signal and chart it with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        XyDataSeries,
        XyCustomFilter,
        FastLineRenderableSeries,
        VerticalLineAnnotation,
        HorizontalLineAnnotation,
        ELabelPlacement,
        ENumericFormat,
        LegendModifier,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- 1. The test signal: a slow wave, plus mains hum and random noise ---
    // A seeded random generator, so the noise is the same every time the chart loads
    let seed = 2024;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    // Gaussian (bell-curve) noise from two uniform random numbers: the Box-Muller method
    const gaussian = () => Math.sqrt(-2 * Math.log(random() || 1e-12)) * Math.cos(2 * Math.PI * random());

    const time = [];
    const slow = []; // what we want to keep: 1.5 Hz and 4 Hz sine waves
    const noisy = []; // what we measured: the slow wave + 50 Hz hum + noise
    for (let n = 0; n < SAMPLE_RATE * DURATION; n++) {
        const t = n / SAMPLE_RATE;
        const wanted = Math.sin(2 * Math.PI * 1.5 * t) + 0.5 * Math.sin(2 * Math.PI * 4 * t);
        time.push(t);
        slow.push(wanted);
        noisy.push(wanted + 0.3 * Math.sin(2 * Math.PI * HUM_FREQUENCY * t) + 0.3 * gaussian());
    }

    // --- 2. Digital low-pass filters ---
    // Every filter here is a difference equation: y[n] = b[0]x[n] + b[1]x[n-1] + ... + a1 * y[n-1].
    // FIR (finite impulse response) filters use only past inputs, so a1 = 0 and b is the "kernel".
    // The single-pole IIR (infinite impulse response) filter also feeds back its last output.
    //
    // SciChart.js runs it on the chart's data with an XyCustomFilter, which calls filterFunction(index, y)
    // for each point in index order: from 0 when it recalculates everything, and only for the new points
    // when data is appended. So the function reads earlier inputs from the source series and keeps the
    // last output for the feedback term.
    function lowPassFilterFunction(sourceSeries, { b, a1 }) {
        let previousOutput = 0;
        return (index, y) => {
            const inputs = sourceSeries.getNativeYValues(); // the source series' y values
            if (index === 0) previousOutput = y; // start as if the signal had always been at its first value
            let sum = a1 * previousOutput;
            for (let k = 0; k < b.length; k++) {
                sum += b[k] * inputs.get(Math.max(0, index - k)); // before the first sample, repeat the first sample
            }
            previousOutput = sum;
            return sum;
        };
    }

    // The filter's gain at frequency f, in decibels (dB): 0 dB passes unchanged, -3 dB is about 71% amplitude,
    // -20 dB is 10% and -40 dB is 1%. H(f) = sum of b[k] e^(-i w k) / (1 - a1 e^(-i w)), with w = 2 pi f / sampleRate.
    function gainDb({ b, a1 }, f) {
        const w = (2 * Math.PI * f) / SAMPLE_RATE;
        let re = 0;
        let im = 0;
        for (let k = 0; k < b.length; k++) {
            re += b[k] * Math.cos(w * k);
            im -= b[k] * Math.sin(w * k);
        }
        const magnitude = Math.hypot(re, im) / Math.hypot(1 - a1 * Math.cos(w), a1 * Math.sin(w));
        return 20 * Math.log10(Math.max(magnitude, 1e-5)); // floor at -100 dB, where a moving average has a null
    }

    // Moving average: M equal weights of 1/M. Its -3 dB cutoff is close to 0.443 * sampleRate / M
    function movingAverage(cutoff) {
        const length = Math.max(1, Math.round((0.443 * SAMPLE_RATE) / cutoff));
        return { b: new Array(length).fill(1 / length), a1: 0, label: `${length}-point moving average` };
    }

    // Windowed-sinc: the ideal low-pass impulse response (a sinc function), cut to a fixed length and tapered
    // with a Blackman window. fc is the half-amplitude (-6 dB) frequency as a fraction of the sample rate.
    function windowedSincKernel(fc, taps) {
        const M = taps - 1;
        const h = [];
        for (let i = 0; i <= M; i++) {
            const k = i - M / 2;
            const sinc = k === 0 ? 2 * Math.PI * fc : Math.sin(2 * Math.PI * fc * k) / k;
            const blackman = 0.42 - 0.5 * Math.cos((2 * Math.PI * i) / M) + 0.08 * Math.cos((4 * Math.PI * i) / M);
            h.push(sinc * blackman);
        }
        const total = h.reduce((sum, v) => sum + v, 0);
        return h.map((v) => v / total); // normalise, so the gain at 0 Hz is exactly 1 (0 dB)
    }
    function windowedSinc(cutoff) {
        // The transition band is about 4 / M of the sample rate: make it about as wide as the cutoff, up to 301 taps
        const taps = Math.min(300, 2 * Math.round((2 * SAMPLE_RATE) / cutoff)) + 1;
        const transition = (4 * SAMPLE_RATE) / (taps - 1);
        // Find the design frequency that puts the -3 dB point exactly on the cutoff (a bisection search)
        let low = cutoff / SAMPLE_RATE;
        let high = Math.min(0.5, (cutoff + transition) / SAMPLE_RATE);
        for (let i = 0; i < 30; i++) {
            const middle = (low + high) / 2;
            if (gainDb({ b: windowedSincKernel(middle, taps), a1: 0 }, cutoff) < -3.0103) low = middle;
            else high = middle;
        }
        return { b: windowedSincKernel(high, taps), a1: 0, label: `${taps}-tap windowed-sinc` };
    }

    // Single-pole IIR (exponential smoothing): y[n] = y[n-1] + alpha * (x[n] - y[n-1]).
    // The digital twin of an RC circuit. alpha is chosen so the gain is exactly -3 dB at the cutoff.
    function singlePole(cutoff) {
        const c = Math.cos((2 * Math.PI * cutoff) / SAMPLE_RATE);
        const feedback = 2 - c - Math.sqrt((2 - c) * (2 - c) - 1); // a1 = 1 - alpha
        const alpha = 1 - feedback;
        return { b: [alpha], a1: feedback, label: `single pole, α = ${alpha.toFixed(3)}` };
    }

    // How long the filter delays slow signals, in samples. A symmetric FIR kernel delays every frequency
    // by half its length. A single pole delays low frequencies by a1 / (1 - a1) samples.
    const delaySamples = ({ b, a1 }) => (a1 ? a1 / (1 - a1) : (b.length - 1) / 2);

    // Frequencies for the response chart: 400 steps, evenly spaced on a log scale, up to half the sample rate
    const frequencies = Array.from({ length: 400 }, (_, i) => 0.5 * Math.pow(SAMPLE_RATE / 2 / 0.5, i / 399));

    // --- 3. Chart 1: the signal in time, before and after the filter ---
    const timeChart = await SciChartSurface.create(ui.timeDiv, { theme: new SciChartJsNavyTheme() });
    timeChart.sciChartSurface.xAxes.add(new NumericAxis(timeChart.wasmContext, { axisTitle: "Time (s)" }));
    timeChart.sciChartSurface.yAxes.add(
        new NumericAxis(timeChart.wasmContext, {
            axisTitle: "Amplitude",
            visibleRange: new NumberRange(-3, 3)
        })
    );
    // The measured data, and the filtered output: an XyCustomFilter that recalculates itself from the
    // noisy series whenever its filter function changes or new data is appended to the noisy series
    const noisySeries = new XyDataSeries(timeChart.wasmContext, {
        xValues: time,
        yValues: noisy,
        dataSeriesName: "Noisy input"
    });
    const filteredSeries = new XyCustomFilter(noisySeries, { dataSeriesName: "Filtered output" });
    timeChart.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(timeChart.wasmContext, {
            dataSeries: noisySeries,
            stroke: "#50C7E077",
            strokeThickness: 1
        }),
        new FastLineRenderableSeries(timeChart.wasmContext, {
            dataSeries: new XyDataSeries(timeChart.wasmContext, {
                xValues: time,
                yValues: slow,
                dataSeriesName: "Slow wave (before noise)"
            }),
            stroke: "#FFFFFFAA",
            strokeThickness: 1.5,
            strokeDashArray: [6, 4]
        }),
        new FastLineRenderableSeries(timeChart.wasmContext, {
            dataSeries: filteredSeries,
            stroke: "#F48420",
            strokeThickness: 3
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

    // --- 4. Chart 2: the filter's frequency response (gain in dB against frequency, on a log scale) ---
    const responseChart = await SciChartSurface.create(ui.responseDiv, { theme: new SciChartJsNavyTheme() });
    responseChart.sciChartSurface.xAxes.add(
        new LogarithmicAxis(responseChart.wasmContext, {
            axisTitle: "Frequency (Hz)",
            logBase: 10,
            labelFormat: ENumericFormat.SignificantFigures,
            labelPrecision: 2,
            autoTicks: false, // a labelled gridline at 1, 10 and 100 Hz, and minor gridlines between
            majorDelta: 1,
            minorDelta: 1,
            visibleRange: new NumberRange(0.5, SAMPLE_RATE / 2)
        })
    );
    responseChart.sciChartSurface.yAxes.add(
        new NumericAxis(responseChart.wasmContext, { axisTitle: "Gain (dB)", visibleRange: new NumberRange(-80, 6) })
    );
    const responseSeries = new XyDataSeries(responseChart.wasmContext, { dataSeriesName: "Gain" });
    responseChart.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(responseChart.wasmContext, {
            dataSeries: responseSeries,
            stroke: "#50C7E0",
            strokeThickness: 2
        })
    );
    // Mark the cutoff, the -3 dB level and the 50 Hz hum
    const cutoffLine = new VerticalLineAnnotation({
        x1: 10,
        stroke: "#F48420",
        strokeDashArray: [6, 4],
        showLabel: true,
        labelPlacement: ELabelPlacement.TopRight,
        axisLabelFill: "#F48420"
    });
    responseChart.sciChartSurface.annotations.add(
        cutoffLine,
        new HorizontalLineAnnotation({
            y1: -3,
            stroke: "#FFFFFF88",
            strokeDashArray: [2, 4],
            showLabel: true,
            labelValue: "-3 dB",
            labelPlacement: ELabelPlacement.TopLeft
        }),
        new VerticalLineAnnotation({
            x1: HUM_FREQUENCY,
            stroke: "#FFFFFF55",
            strokeDashArray: [2, 4],
            showLabel: true,
            labelValue: "50 Hz hum",
            labelPlacement: ELabelPlacement.BottomRight
        })
    );
    responseChart.sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- 5. Re-run the filter whenever a control changes ---
    const designs = { "moving-average": movingAverage, "windowed-sinc": windowedSinc, "single-pole": singlePole };
    // The slider runs from 2 Hz to 120 Hz on a log scale, so the low cutoffs get as much room as the high ones
    const sliderToCutoff = (value) => 2 * Math.pow(60, value / 100);
    const cutoffToSlider = (cutoff) => (100 * Math.log(cutoff / 2)) / Math.log(60);

    function update() {
        const cutoff = sliderToCutoff(Number(ui.cutoffInput.value));
        const filter = designs[ui.typeSelect.value](cutoff);

        // Setting filterFunction makes the XyCustomFilter recalculate every point
        filteredSeries.filterFunction = lowPassFilterFunction(noisySeries, filter);
        responseSeries.clear();
        responseSeries.appendRange(
            frequencies,
            frequencies.map((f) => gainDb(filter, f))
        );
        cutoffLine.x1 = cutoff;
        cutoffLine.labelValue = `cutoff ${cutoff.toFixed(1)} Hz`;

        // Read the real -3 dB point off the response (the moving average can only get close)
        let measured = 0;
        while (measured < SAMPLE_RATE / 2 && gainDb(filter, measured) > -3.0103) measured += 0.05;
        const delayMs = (1000 * delaySamples(filter)) / SAMPLE_RATE;
        ui.cutoffOutput.textContent = `${cutoff.toFixed(1)} Hz`;
        ui.cutoffInput.setAttribute("aria-valuetext", `${cutoff.toFixed(1)} hertz`);
        ui.summary.textContent = `${filter.label} · -3 dB at ${measured.toFixed(1)} Hz · delay ${delayMs.toFixed(0)} ms`;
    }

    // The RC calculator: the cutoff of an analogue RC low-pass filter, f = 1 / (2 pi R C)
    function rcCutoff() {
        const ohms = Number(ui.rInput.value) * 1e3;
        const farads = Number(ui.cInput.value) * 1e-6;
        return 1 / (2 * Math.PI * ohms * farads);
    }
    function updateRc() {
        const f = rcCutoff();
        ui.rcOutput.textContent = isFinite(f) && f > 0 ? `${f.toPrecision(4)} Hz` : "-";
    }

    ui.typeSelect.addEventListener("change", update);
    ui.cutoffInput.addEventListener("input", update);
    ui.rInput.addEventListener("input", updateRc);
    ui.cInput.addEventListener("input", updateRc);
    ui.rcButton.addEventListener("click", () => {
        const f = rcCutoff();
        if (!isFinite(f) || f <= 0) return;
        // The slider covers 2 to 120 Hz, so cutoffs outside that range are clamped
        ui.cutoffInput.value = Math.min(100, Math.max(0, cutoffToSlider(f))).toFixed(1);
        update();
    });
    update();
    updateRc();
    // #region_A_end
}

lowPassFilterChart("scichart-root");
