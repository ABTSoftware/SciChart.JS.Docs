import * as SciChart from "scichart";

// #region_A_start
// Fourier series grapher: a periodic waveform, its partial sum with N harmonics and its harmonic spectrum,
// in JavaScript with SciChart.js. The Fourier series functions below are plain JavaScript with no dependencies.

// Every waveform here has period T = 1 s, so the fundamental is f0 = 1 Hz and harmonic n is n Hz.
// The series is f(t) = a0/2 + sum over n of (a[n] cos(2 pi n t) + b[n] sin(2 pi n t)).

// Fourier coefficients a[n] and b[n] for n = 0 ... nMax, worked out from the coefficient integrals.
// duty is the fraction of each period a pulse train is high (0 to 1).
function fourierCoefficients(waveform, nMax, duty) {
    const a = new Float64Array(nMax + 1);
    const b = new Float64Array(nMax + 1);
    for (let n = 1; n <= nMax; n++) {
        const odd = n % 2 === 1;
        if (waveform === "square") {
            b[n] = odd ? 4 / (Math.PI * n) : 0; // odd function: sines only; odd harmonics only; 1/n
        } else if (waveform === "sawtooth") {
            b[n] = ((odd ? 1 : -1) * 2) / (Math.PI * n); // odd function: sines only; every harmonic; 1/n
        } else if (waveform === "triangle") {
            a[n] = odd ? 8 / (Math.PI * Math.PI * n * n) : 0; // even function: cosines only; odd harmonics; 1/n^2
        } else {
            // pulse train centred on t = 0: zero when n * duty is a whole number (rounding would leave ~1e-16)
            const s = Math.sin(Math.PI * n * duty);
            a[n] = Math.abs(s) < 1e-9 ? 0 : (2 * s) / (Math.PI * n);
        }
    }
    a[0] = waveform === "pulse" ? 2 * duty : 0; // a0/2 is the average value
    return { a, b };
}

// The waveform itself. At a jump it returns the midpoint, which is the value the series converges to.
function targetWaveform(waveform, t, duty) {
    const x = t - Math.round(t); // position within the period, from -0.5 to 0.5
    if (waveform === "square") {
        if (x === 0 || Math.abs(x) === 0.5) return 0;
        return x > 0 ? 1 : -1;
    }
    if (waveform === "sawtooth") return Math.abs(x) === 0.5 ? 0 : 2 * x;
    if (waveform === "triangle") return 1 - 4 * Math.abs(x);
    const distance = Math.abs(x);
    if (Math.abs(distance - duty / 2) < 1e-12) return 0.5;
    return distance < duty / 2 ? 1 : 0;
}

// Lanczos sigma factor for harmonic n of an N-harmonic sum: sinc(n / (N + 1)).
// Multiplying each term by it smooths the ripple near a jump (Gibbs overshoot) at the cost of a softer edge.
function lanczosSigma(n, N) {
    const x = (Math.PI * n) / (N + 1);
    return Math.sin(x) / x;
}

// One term of the series, harmonic n at time t (with its sigma factor, if smoothing is on)
function harmonicTerm(coefficients, n, t, weight) {
    const angle = 2 * Math.PI * n * t;
    return weight * (coefficients.a[n] * Math.cos(angle) + coefficients.b[n] * Math.sin(angle));
}

// The partial sum S_N(t): the average plus harmonics 1 to N
function partialSum(coefficients, N, t, smooth) {
    let sum = coefficients.a[0] / 2;
    for (let n = 1; n <= N; n++) {
        if (coefficients.a[n] === 0 && coefficients.b[n] === 0) continue;
        sum += harmonicTerm(coefficients, n, t, smooth ? lanczosSigma(n, N) : 1);
    }
    return sum;
}

// The 1/n or 1/n^2 curve each waveform's harmonic amplitudes follow
const ENVELOPES = {
    square: { label: "4/(πn)", at: (n) => 4 / (Math.PI * n) },
    sawtooth: { label: "2/(πn)", at: (n) => 2 / (Math.PI * n) },
    triangle: { label: "8/(π²n²)", at: (n) => 8 / (Math.PI * Math.PI * n * n) },
    pulse: { label: "2/(πn)", at: (n) => 2 / (Math.PI * n) }
};

const MAX_HARMONIC = 100;
const POINTS_PER_PERIOD = 2500;
const MAX_TERMS_DRAWN = 8; // individual harmonics drawn when "Show harmonics" is on

async function createFourierSeriesCharts(timeDiv, spectrumDiv) {
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
        XyDataSeries,
        FastLineRenderableSeries,
        FastImpulseRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        LegendModifier,
        ELegendOrientation,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Top chart: the target waveform, the partial sum and (optionally) the harmonics being added up
    const time = await SciChartSurface.create(timeDiv, { theme: new SciChartJsNavyTheme() });
    time.sciChartSurface.xAxes.add(
        new NumericAxis(time.wasmContext, { axisTitle: "Time (s), two periods", labelPrecision: 1 })
    );
    const valueAxis = new NumericAxis(time.wasmContext, { axisTitle: "Value", labelPrecision: 1 });
    time.sciChartSurface.yAxes.add(valueAxis);
    const termsData = new XyDataSeries(time.wasmContext, { dataSeriesName: `Harmonics (first ${MAX_TERMS_DRAWN} terms)`, isSorted: false, containsNaN: true });
    const targetData = new XyDataSeries(time.wasmContext, { dataSeriesName: "Target waveform", dataIsSortedInX: true });
    const sumData = new XyDataSeries(time.wasmContext, { dataSeriesName: "Partial sum S_N(t)", dataIsSortedInX: true });
    const termsLine = new FastLineRenderableSeries(time.wasmContext, { dataSeries: termsData, stroke: "#F4842099", strokeThickness: 1 });
    time.sciChartSurface.renderableSeries.add(
        termsLine,
        new FastLineRenderableSeries(time.wasmContext, { dataSeries: targetData, stroke: "#F5E663", strokeThickness: 1.5 }),
        new FastLineRenderableSeries(time.wasmContext, { dataSeries: sumData, stroke: "#50C7E0", strokeThickness: 2.5 })
    );
    time.sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true, orientation: ELegendOrientation.Horizontal }),
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier()
    );

    // Bottom chart: the amplitude of each harmonic, the ones in the sum and the ones left out
    const spectrum = await SciChartSurface.create(spectrumDiv, { theme: new SciChartJsNavyTheme() });
    const harmonicAxis = new NumericAxis(spectrum.wasmContext, { axisTitle: "Harmonic number n (frequency = n × f0)", labelPrecision: 0 });
    spectrum.sciChartSurface.xAxes.add(harmonicAxis);
    spectrum.sciChartSurface.yAxes.add(
        new NumericAxis(spectrum.wasmContext, {
            axisTitle: "Amplitude",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0, 0.45), // room at the top for the legend
            labelPrecision: 2
        })
    );
    const includedData = new XyDataSeries(spectrum.wasmContext, { dataSeriesName: "In the sum (n ≤ N)" });
    const omittedData = new XyDataSeries(spectrum.wasmContext, { dataSeriesName: "Left out (n > N)" });
    const envelopeData = new XyDataSeries(spectrum.wasmContext, { dataSeriesName: "Envelope (1/n or 1/n²)", dataIsSortedInX: true });
    spectrum.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(spectrum.wasmContext, {
            dataSeries: envelopeData,
            stroke: "#F5E663",
            strokeThickness: 1.5,
            strokeDashArray: [6, 4]
        }),
        new FastImpulseRenderableSeries(spectrum.wasmContext, {
            dataSeries: omittedData,
            stroke: "#A9B6CCAA",
            fill: "#A9B6CCAA",
            strokeThickness: 2,
            size: 6,
            pointMarker: new EllipsePointMarker(spectrum.wasmContext)
        }),
        new FastImpulseRenderableSeries(spectrum.wasmContext, {
            dataSeries: includedData,
            stroke: "#F48420",
            fill: "#F48420",
            strokeThickness: 3,
            size: 8,
            pointMarker: new EllipsePointMarker(spectrum.wasmContext)
        })
    );
    spectrum.sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true, orientation: ELegendOrientation.Horizontal }),
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos
                    .filter((info) => info.isHit && !info.seriesName.startsWith("Envelope"))
                    .map((info) => `n = ${info.xValue} (${info.xValue} Hz): amplitude ${info.yValue.toFixed(4)}`)
        }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier()
    );

    // Recompute everything from the settings: { waveform, duty, N, showTerms, smooth }.
    // Returns the number of non-zero terms, the envelope formula, the Gibbs overshoot (as a % of the jump) and the RMS error of the partial sum.
    const update = (settings) => {
        const { waveform, duty, N, showTerms, smooth } = settings;
        const coefficients = fourierCoefficients(waveform, MAX_HARMONIC, duty);

        // Time domain: t from -1 s to 1 s
        const xs = [];
        const target = [];
        const sum = [];
        for (let i = -POINTS_PER_PERIOD; i <= POINTS_PER_PERIOD; i++) {
            const t = i / POINTS_PER_PERIOD;
            xs.push(t);
            target.push(targetWaveform(waveform, t, duty));
            sum.push(partialSum(coefficients, N, t, smooth));
        }
        targetData.clear();
        targetData.appendRange(xs, target);
        sumData.clear();
        sumData.appendRange(xs, sum);
        valueAxis.visibleRange = waveform === "pulse" ? new NumberRange(-0.6, 1.9) : new NumberRange(-1.5, 2.1); // room at the top for the legend

        // The individual harmonics (the first few non-zero ones), separated by NaN gaps in one series
        termsData.clear();
        let drawn = 0;
        for (let n = 1; n <= N && showTerms && drawn < MAX_TERMS_DRAWN; n++) {
            if (coefficients.a[n] === 0 && coefficients.b[n] === 0) continue;
            const weight = smooth ? lanczosSigma(n, N) : 1;
            termsData.appendRange(xs, xs.map((t) => harmonicTerm(coefficients, n, t, weight)));
            termsData.append(NaN, NaN);
            drawn++;
        }
        termsLine.isVisible = showTerms;

        // Harmonic spectrum: amplitude A_n = sqrt(a_n^2 + b_n^2), and |a0/2| at n = 0
        const limit = Math.min(MAX_HARMONIC, Math.max(20, N + 10));
        const amplitude = (n) => (n === 0 ? Math.abs(coefficients.a[0] / 2) : Math.hypot(coefficients.a[n], coefficients.b[n]));
        const inX = [];
        const inY = [];
        const outX = [];
        const outY = [];
        for (let n = 0; n <= limit; n++) {
            const value = amplitude(n) * (smooth && n > 0 && n <= N ? lanczosSigma(n, N) : 1);
            if (value < 1e-12) continue; // skip the harmonics that are exactly zero
            if (n <= N) {
                inX.push(n);
                inY.push(value);
            } else {
                outX.push(n);
                outY.push(value);
            }
        }
        includedData.clear();
        includedData.appendRange(inX, inY);
        omittedData.clear();
        omittedData.appendRange(outX, outY);
        const envelope = ENVELOPES[waveform];
        const envX = [];
        for (let x = 1; x <= limit; x += 0.25) envX.push(x);
        envelopeData.clear();
        envelopeData.appendRange(envX, envX.map(envelope.at));
        harmonicAxis.visibleRange = new NumberRange(-0.5, limit + 0.5);

        // Gibbs overshoot: how far the partial sum rises above the waveform's top, as a % of the jump.
        // RMS error: the root-mean-square gap between the partial sum and the waveform over one period.
        let top = -Infinity;
        let bottom = Infinity;
        let peak = -Infinity;
        let squaredError = 0;
        let count = 0;
        for (let i = 0; i < xs.length; i++) {
            top = Math.max(top, target[i]);
            bottom = Math.min(bottom, target[i]);
            peak = Math.max(peak, sum[i]);
            if (xs[i] >= 0 && xs[i] < 1) {
                squaredError += (sum[i] - target[i]) ** 2;
                count++;
            }
        }
        let nonZeroTerms = 0;
        for (let n = 1; n <= N; n++) if (coefficients.a[n] !== 0 || coefficients.b[n] !== 0) nonZeroTerms++;
        return {
            nonZeroTerms,
            envelopeLabel: envelope.label,
            overshootPercent: (100 * (peak - top)) / (top - bottom),
            rmsError: Math.sqrt(squaredError / count),
            hasJump: waveform !== "triangle"
        };
    };
    return { update };
}
// #region_A_end

// The page layout: a row of controls and a status line above the two charts. In your app these can be ordinary HTML.
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
    timeDiv.style.cssText = "flex:3; min-height:0;";
    const spectrumDiv = document.createElement("div");
    spectrumDiv.id = divElementId + "-spectrum";
    spectrumDiv.style.cssText = "flex:2; min-height:0;";
    root.append(controls, status, timeDiv, spectrumDiv);
    return { controls, status, timeDiv, spectrumDiv };
}

// A labelled control that calls onChange with the element when it changes
function addControl(parent, id, labelText, element, onChange, labelAfter = false) {
    const wrap = document.createElement("span");
    wrap.style.cssText = "display:inline-flex; align-items:center; gap:6px;";
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;
    label.style.fontWeight = "600";
    element.id = id;
    element.style.cssText += "font:inherit; accent-color:#F48420;";
    element.addEventListener("input", () => onChange(element));
    if (labelAfter) wrap.append(element, label);
    else wrap.append(label, element);
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
function makeSlider(min, max, step, value, width) {
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = String(min);
    slider.max = String(max);
    slider.step = String(step);
    slider.value = String(value);
    slider.style.width = width;
    return slider;
}
function makeCheckbox(checked) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    return checkbox;
}

async function fourierSeriesDemo(divElementId) {
    const { controls, status, timeDiv, spectrumDiv } = createLayout(divElementId);
    const { update } = await createFourierSeriesCharts(timeDiv, spectrumDiv);
    const settings = { waveform: "square", duty: 0.25, N: 15, showTerms: false, smooth: false };
    const names = { square: "square wave", sawtooth: "sawtooth wave", triangle: "triangle wave", pulse: "pulse train" };

    const refresh = () => {
        const { nonZeroTerms, envelopeLabel, overshootPercent, rmsError, hasJump } = update(settings);
        const overshoot = !hasJump
            ? "no jumps, so no Gibbs overshoot"
            : overshootPercent > 0.05
              ? `overshoot at each jump ${overshootPercent.toFixed(1)}% of the jump`
              : "no overshoot above the waveform";
        status.textContent =
            `${names[settings.waveform]}, harmonics 1 to ${settings.N} (${nonZeroTerms} non-zero terms), amplitudes within ${envelopeLabel}: ` +
            `${overshoot} · RMS error ${rmsError.toFixed(4)}`;
    };

    const waveforms = [
        ["square", "Square"],
        ["sawtooth", "Sawtooth"],
        ["triangle", "Triangle"],
        ["pulse", "Pulse train"]
    ];
    addControl(controls, divElementId + "-waveform", "Waveform", makeSelect(waveforms, settings.waveform), (el) => {
        settings.waveform = el.value;
        duty.element.disabled = settings.waveform !== "pulse";
        duty.wrap.style.opacity = settings.waveform === "pulse" ? "1" : "0.5";
        refresh();
    });
    const duty = addControl(controls, divElementId + "-duty", "Duty cycle: 25%", makeSlider(5, 95, 5, 25, "100px"), (el) => {
        settings.duty = Number(el.value) / 100;
        duty.label.textContent = `Duty cycle: ${el.value}%`;
        refresh();
    });
    duty.element.disabled = true;
    duty.wrap.style.opacity = "0.5";
    const harmonics = addControl(controls, divElementId + "-n", `Harmonics N: ${settings.N}`, makeSlider(1, MAX_HARMONIC, 1, settings.N, "160px"), (el) => {
        settings.N = Number(el.value);
        harmonics.label.textContent = `Harmonics N: ${settings.N}`;
        refresh();
    });
    addControl(controls, divElementId + "-terms", "Show harmonics", makeCheckbox(settings.showTerms), (el) => {
        settings.showTerms = el.checked;
        refresh();
    }, true);
    addControl(controls, divElementId + "-sigma", "Lanczos σ smoothing", makeCheckbox(settings.smooth), (el) => {
        settings.smooth = el.checked;
        refresh();
    }, true);
    refresh();
}

fourierSeriesDemo("scichart-root");
