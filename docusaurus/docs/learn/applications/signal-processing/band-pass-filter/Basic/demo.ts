import * as SciChart from "scichart";

const SAMPLE_RATE = 250; // samples per second (Hz), a common rate for EEG recordings
const DURATION = 6; // seconds of signal
// The test signal: one tone in each of three EEG bands, plus 50 Hz mains hum and broadband noise
const TONES = [
    { frequency: 2, amplitude: 1.0, name: "2 Hz (delta)" },
    { frequency: 10, amplitude: 0.7, name: "10 Hz (alpha)" },
    { frequency: 22, amplitude: 0.45, name: "22 Hz (beta)" },
    { frequency: 50, amplitude: 0.35, name: "50 Hz hum" }
];
// Preset bands: [low edge, high edge] in Hz
const PRESETS = [
    { label: "Delta 1–4 Hz", fL: 1, fH: 4 },
    { label: "Alpha 8–13 Hz", fL: 8, fH: 13 },
    { label: "Beta 14–30 Hz", fL: 14, fH: 30 },
    { label: "Narrow: 10 Hz, Q 10", f0: 10, q: 10 }
];

// The controls and the two charts each need an element. This splits the page's div into two control bars,
// a time chart and a frequency-response chart; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const barStyle =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const sliderStyle = "vertical-align:middle; width:130px";
    const filterBar = document.createElement("div");
    filterBar.style.cssText = barStyle;
    filterBar.innerHTML =
        `<label>Filter <select style="font:inherit">` +
        `<option value="biquad">2nd-order biquad (IIR)</option>` +
        `<option value="butterworth">High-pass + low-pass Butterworth (IIR)</option>` +
        `<option value="fir">Windowed-sinc (FIR)</option></select></label>` +
        `<label>Order <select style="font:inherit"></select></label>` +
        `<label>Centre f<sub>0</sub> <input type="range" min="0" max="100" step="0.1" style="${sliderStyle}"> ` +
        `<output></output></label>` +
        `<label>Q <input type="range" min="0" max="100" step="0.1" style="${sliderStyle}"> <output></output></label>`;
    const presetBar = document.createElement("div");
    presetBar.style.cssText = barStyle + "padding-top:0; color:#c8d3e8;";
    presetBar.innerHTML =
        `<span>Presets:</span>` +
        PRESETS.map((p, i) => `<button type="button" data-preset="${i}" style="font:inherit">${p.label}</button>`).join("");
    const readout = document.createElement("div");
    readout.style.cssText = barStyle + "padding-top:0; color:#c8d3e8;";
    readout.setAttribute("aria-live", "polite");
    const timeDiv = document.createElement("div");
    timeDiv.id = divElementId + "-time";
    timeDiv.style.cssText = "flex:3; min-height:0;";
    const responseDiv = document.createElement("div");
    responseDiv.id = divElementId + "-response";
    responseDiv.style.cssText = "flex:2; min-height:0;";
    root.append(filterBar, presetBar, readout, timeDiv, responseDiv);
    const [typeSelect, orderSelect] = filterBar.querySelectorAll("select");
    const [centreInput, qInput] = filterBar.querySelectorAll("input");
    const [centreOutput, qOutput] = filterBar.querySelectorAll("output");
    return {
        timeDiv,
        responseDiv,
        typeSelect,
        orderSelect,
        centreInput,
        centreOutput,
        qInput,
        qOutput,
        presetButtons: presetBar.querySelectorAll("button"),
        readout
    };
}

async function bandPassFilterChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // An interactive band-pass filter: isolate one band of a noisy signal and chart it with SciChart.js
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

    // --- 1. The test signal: tones at 2, 10, 22 and 50 Hz, plus random noise ---
    // A seeded random generator, so the noise is the same every time the chart loads
    let seed = 1984;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    // Gaussian (bell-curve) noise from two uniform random numbers: the Box-Muller method
    const gaussian = () => Math.sqrt(-2 * Math.log(random() || 1e-12)) * Math.cos(2 * Math.PI * random());

    const time = [];
    const input = [];
    for (let n = 0; n < SAMPLE_RATE * DURATION; n++) {
        const t = n / SAMPLE_RATE;
        let value = 0.3 * gaussian(); // broadband noise: spread evenly over every frequency
        for (const tone of TONES) value += tone.amplitude * Math.sin(2 * Math.PI * tone.frequency * t);
        time.push(t);
        input.push(value);
    }
    // The sum of the clean tones inside a band, to compare with the filter's output
    const tonesInBand = (fL, fH) =>
        time.map((t) =>
            TONES.filter((tone) => tone.frequency >= fL && tone.frequency <= fH).reduce(
                (sum, tone) => sum + tone.amplitude * Math.sin(2 * Math.PI * tone.frequency * t),
                0
            )
        );

    // --- 2. Band-pass filter design (plain JavaScript, no library needed) ---
    // Every filter here is a chain of sections. Each section is a difference equation with feed-forward
    // weights b and feedback weights a (a[0] = 1): y[n] = b0 x[n] + b1 x[n-1] + ... - a1 y[n-1] - a2 y[n-2] ...

    // The two -3 dB frequencies of a band with centre f0 and quality factor Q.
    // They sit symmetrically around f0 on a log scale: fL * fH = f0^2, and fH - fL = f0 / Q.
    function bandEdges(f0, q) {
        const half = 1 / (2 * q);
        const root = Math.sqrt(1 + half * half);
        return { fL: f0 * (root - half), fH: f0 * (root + half) };
    }

    // (a) Second-order band-pass biquad: the bilinear transform of H(s) = (w0/Q)s / (s^2 + (w0/Q)s + w0^2),
    // as in R. Bristow-Johnson's Audio EQ Cookbook (the band-pass with a 0 dB peak). One section, order 2.
    function biquadBandPass(f0, q) {
        const w0 = (2 * Math.PI * f0) / SAMPLE_RATE;
        const alpha = Math.sin(w0) / (2 * q);
        const a0 = 1 + alpha;
        return [{ b: [alpha / a0, 0, -alpha / a0], a: [1, (-2 * Math.cos(w0)) / a0, (1 - alpha) / a0] }];
    }

    // (b) A Butterworth high-pass at fL followed by a Butterworth low-pass at fH, each of order n (1, 2 or 4),
    // built from second-order sections (or one first-order section when n = 1)
    function butterworthSections(kind, fc, n) {
        const w0 = (2 * Math.PI * fc) / SAMPLE_RATE;
        if (n === 1) {
            const k = Math.tan(w0 / 2); // first-order bilinear transform, pre-warped so the cutoff lands on fc
            const b = kind === "low" ? [k / (1 + k), k / (1 + k)] : [1 / (1 + k), -1 / (1 + k)];
            return [{ b, a: [1, (k - 1) / (k + 1)] }];
        }
        const sections = [];
        for (let i = 0; i < n / 2; i++) {
            // Each pair of Butterworth poles has Q = 1 / (2 cos((2i + 1) pi / 2n))
            const q = 1 / (2 * Math.cos(((2 * i + 1) * Math.PI) / (2 * n)));
            const alpha = Math.sin(w0) / (2 * q);
            const c = Math.cos(w0);
            const a0 = 1 + alpha;
            const b =
                kind === "low"
                    ? [(1 - c) / 2 / a0, (1 - c) / a0, (1 - c) / 2 / a0]
                    : [(1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0];
            sections.push({ b, a: [1, (-2 * c) / a0, (1 - alpha) / a0] });
        }
        return sections;
    }
    const cascadedButterworth = (fL, fH, n) => [
        ...butterworthSections("high", fL, n),
        ...butterworthSections("low", fH, n)
    ];

    // (c) Windowed-sinc FIR band-pass: a low-pass kernel at fH minus a low-pass kernel at fL. Each is a sinc
    // tapered by a Blackman window and scaled to a gain of 1 at 0 Hz, so their difference passes fL to fH.
    // A windowed-sinc edge is at half amplitude (-6 dB). order = number of taps - 1, and must be even.
    function lowPassKernel(fc, order) {
        const fraction = fc / SAMPLE_RATE;
        const h = [];
        let sum = 0;
        for (let i = 0; i <= order; i++) {
            const k = i - order / 2;
            const sinc = k === 0 ? 2 * Math.PI * fraction : Math.sin(2 * Math.PI * fraction * k) / k;
            const blackman = 0.42 - 0.5 * Math.cos((2 * Math.PI * i) / order) + 0.08 * Math.cos((4 * Math.PI * i) / order);
            h.push(sinc * blackman);
            sum += sinc * blackman;
        }
        return h.map((v) => v / sum);
    }
    function windowedSincBandPass(fL, fH, order) {
        const upper = lowPassKernel(fH, order);
        const lower = lowPassKernel(fL, order);
        return [{ b: upper.map((v, i) => v - lower[i]), a: [1] }];
    }

    // The gain in dB of a chain of sections at frequency f: the sum, over the sections, of
    // 20 log10(|sum(b[k] e^(-iwk))| / |sum(a[k] e^(-iwk))|), with w = 2 pi f / sampleRate
    function gainDb(sections, f) {
        const w = (2 * Math.PI * f) / SAMPLE_RATE;
        const power = (c) => {
            let re = 0;
            let im = 0;
            for (let k = 0; k < c.length; k++) {
                re += c[k] * Math.cos(w * k);
                im -= c[k] * Math.sin(w * k);
            }
            return re * re + im * im;
        };
        let db = 0;
        for (const s of sections) db += 10 * Math.log10(Math.max(power(s.b) / power(s.a), 1e-30));
        return Math.max(db, -200);
    }

    // --- 3. Run the filter on the chart's data with an XyCustomFilter ---
    // XyCustomFilter calls filterFunction(index, y) for each point in index order: from 0 when it recalculates
    // everything (when it's created or filterFunction is set), and only for new points when data is appended.
    // So an IIR filter can keep its state between calls. The FIR is centred on each sample (offline, no delay),
    // so it reads its neighbours from the source series; if your data changes in place, set filterFunction
    // again to recalculate everything.
    let sections = biquadBandPass(10, 2);
    let isFir = false;
    let source = []; // the input values, read once per pass
    let state = []; // IIR memory: the last two inputs and outputs of each section

    function bandPassAt(sourceSeries) {
        return (index, value) => {
            if (index === 0 || index >= source.length) {
                const values = sourceSeries.getNativeYValues();
                source = [];
                for (let i = 0; i < sourceSeries.count(); i++) source.push(values.get(i));
            }
            if (isFir) {
                const b = sections[0].b;
                const half = (b.length - 1) / 2;
                let sum = 0;
                for (let k = 0; k < b.length; k++) {
                    const i = index + half - k;
                    if (i >= 0 && i < source.length) sum += b[k] * source[i]; // zero beyond the ends
                }
                return sum;
            }
            if (index === 0) state = sections.map(() => ({ x1: 0, x2: 0, y1: 0, y2: 0 }));
            let x = value;
            sections.forEach(({ b, a }, s) => {
                const m = state[s];
                const y = b[0] * x + (b[1] || 0) * m.x1 + (b[2] || 0) * m.x2 - (a[1] || 0) * m.y1 - (a[2] || 0) * m.y2;
                m.x2 = m.x1;
                m.x1 = x;
                m.y2 = m.y1;
                m.y1 = y;
                x = y; // the output of one section is the input of the next
            });
            return x;
        };
    }

    // --- 4. Chart 1: the signal in time, before and after the filter ---
    const timeChart = await SciChartSurface.create(ui.timeDiv, { theme: new SciChartJsNavyTheme() });
    // Open on the first 2 seconds, so single cycles and the filter's start-up are visible (double-click shows all 6)
    timeChart.sciChartSurface.xAxes.add(
        new NumericAxis(timeChart.wasmContext, { axisTitle: "Time (s)", visibleRange: new NumberRange(0, 2) })
    );
    timeChart.sciChartSurface.yAxes.add(
        new NumericAxis(timeChart.wasmContext, { axisTitle: "Amplitude", visibleRange: new NumberRange(-3.5, 3.5) })
    );
    const inputSeries = new XyDataSeries(timeChart.wasmContext, {
        xValues: time,
        yValues: input,
        dataSeriesName: "Input: tones + noise",
        dataIsSortedInX: true,
        dataEvenlySpacedInX: true
    });
    const referenceSeries = new XyDataSeries(timeChart.wasmContext, { dataSeriesName: "Clean tones inside the band" });
    const outputSeries = new XyCustomFilter(inputSeries, {
        dataSeriesName: "Band-pass output",
        filterFunction: bandPassAt(inputSeries)
    });
    timeChart.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(timeChart.wasmContext, {
            dataSeries: inputSeries,
            stroke: "#50C7E077",
            strokeThickness: 1
        }),
        new FastLineRenderableSeries(timeChart.wasmContext, {
            dataSeries: referenceSeries,
            stroke: "#FFFFFFAA",
            strokeThickness: 1.5,
            strokeDashArray: [6, 4]
        }),
        new FastLineRenderableSeries(timeChart.wasmContext, {
            dataSeries: outputSeries,
            stroke: "#F48420",
            strokeThickness: 2.5
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

    // --- 5. Chart 2: the frequency response (gain in dB against frequency on a log scale) ---
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
        new NumericAxis(responseChart.wasmContext, { axisTitle: "Gain (dB)", visibleRange: new NumberRange(-60, 6) })
    );
    const responseSeries = new XyDataSeries(responseChart.wasmContext, { dataSeriesName: "Gain" });
    responseChart.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(responseChart.wasmContext, {
            dataSeries: responseSeries,
            stroke: "#50C7E0",
            strokeThickness: 2
        })
    );
    // Mark the two -3 dB edges, the centre frequency, the -3 dB level and the tones in the test signal
    const edgeLine = (placement) =>
        new VerticalLineAnnotation({
            x1: 10,
            stroke: "#F48420",
            strokeDashArray: [6, 4],
            showLabel: true,
            labelPlacement: placement,
            axisLabelFill: "#F48420"
        });
    const lowEdgeLine = edgeLine(ELabelPlacement.TopLeft);
    const highEdgeLine = edgeLine(ELabelPlacement.TopRight);
    const centreLine = new VerticalLineAnnotation({
        x1: 10,
        stroke: "#FFFFFF",
        strokeThickness: 1.5,
        showLabel: true,
        labelPlacement: ELabelPlacement.BottomRight
    });
    responseChart.sciChartSurface.annotations.add(
        ...TONES.map(
            (tone) =>
                new VerticalLineAnnotation({
                    x1: tone.frequency,
                    stroke: "#FFFFFF44",
                    strokeDashArray: [2, 4]
                })
        ),
        lowEdgeLine,
        highEdgeLine,
        centreLine,
        new HorizontalLineAnnotation({
            y1: -3,
            stroke: "#FFFFFF88",
            strokeDashArray: [2, 4],
            showLabel: true,
            labelValue: "-3 dB",
            labelPlacement: ELabelPlacement.BottomLeft
        })
    );
    responseChart.sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- 6. Re-run the filter whenever a control changes ---
    // Sliders on a log scale: centre frequency from 1 to 40 Hz, Q from 0.5 to 20
    const sliderToCentre = (v) => 1 * Math.pow(40, v / 100);
    const centreToSlider = (f) => (100 * Math.log(f)) / Math.log(40);
    const sliderToQ = (v) => 0.5 * Math.pow(40, v / 100);
    const qToSlider = (q) => (100 * Math.log(q / 0.5)) / Math.log(40);
    const orders = {
        biquad: [2],
        butterworth: [2, 4, 8], // overall order: half for the high-pass edge, half for the low-pass edge
        fir: [128, 256, 512] // FIR order = taps - 1
    };
    const frequencies = Array.from({ length: 500 }, (_, i) => 0.5 * Math.pow(SAMPLE_RATE / 2 / 0.5, i / 499));

    function fillOrders() {
        const type = ui.typeSelect.value;
        ui.orderSelect.innerHTML = orders[type]
            .map((o) => `<option value="${o}">${type === "fir" ? `${o} (${o + 1} taps)` : o}</option>`)
            .join("");
        ui.orderSelect.value = String(orders[type][Math.min(1, orders[type].length - 1)]);
        ui.orderSelect.disabled = orders[type].length === 1;
    }

    // The current band. The sliders set it; a preset sets it exactly and moves the sliders to match
    let f0 = 10;
    let q = 2;

    function update() {
        const { fL, fH } = bandEdges(f0, q);
        const order = Number(ui.orderSelect.value);
        const type = ui.typeSelect.value;
        sections =
            type === "biquad"
                ? biquadBandPass(f0, q)
                : type === "butterworth"
                  ? cascadedButterworth(fL, fH, order / 2)
                  : windowedSincBandPass(fL, fH, order);
        isFir = type === "fir";

        // Setting filterFunction makes the XyCustomFilter recalculate every point
        outputSeries.filterFunction = bandPassAt(inputSeries);
        referenceSeries.clear();
        referenceSeries.appendRange(time, tonesInBand(fL, fH));
        const gains = frequencies.map((f) => gainDb(sections, f));
        responseSeries.clear();
        responseSeries.appendRange(frequencies, gains);

        lowEdgeLine.x1 = fL;
        lowEdgeLine.labelValue = `fL ${fL.toFixed(1)} Hz`;
        highEdgeLine.x1 = fH;
        highEdgeLine.labelValue = `fH ${fH.toFixed(1)} Hz`;
        centreLine.x1 = f0;
        centreLine.labelValue = `f0 ${f0.toFixed(1)} Hz`;

        ui.centreOutput.textContent = `${f0.toFixed(1)} Hz`;
        ui.centreInput.setAttribute("aria-valuetext", `${f0.toFixed(1)} hertz`);
        ui.qOutput.textContent = q.toFixed(2);
        ui.qInput.setAttribute("aria-valuetext", q.toFixed(2));

        // What the filter really does: its peak gain, and where it crosses -3 dB below its 0 dB target
        const peak = Math.max(...gains);
        const passing = frequencies.filter((f, i) => gains[i] >= -3.0103);
        const low = passing[0];
        const high = passing[passing.length - 1];
        const measured = low
            ? `−3 dB band ${low.toFixed(1)}–${high.toFixed(1)} Hz`
            : "never reaches −3 dB: the edges are too close for this filter";
        const peakText = Math.abs(peak) < 0.05 ? "0.0" : peak.toFixed(1);
        ui.readout.textContent =
            `Design: fL ${fL.toFixed(2)} Hz · fH ${fH.toFixed(2)} Hz · f0 = √(fL·fH) = ${f0.toFixed(2)} Hz · ` +
            `bandwidth ${(fH - fL).toFixed(2)} Hz · Q = f0 / BW = ${q.toFixed(2)}. ` +
            `Actual filter: peak ${peakText} dB, ${measured}.`;
    }

    function setBand(centre, quality) {
        f0 = centre;
        q = quality;
        ui.centreInput.value = Math.min(100, Math.max(0, centreToSlider(f0))).toFixed(1);
        ui.qInput.value = Math.min(100, Math.max(0, qToSlider(q))).toFixed(1);
        update();
    }

    ui.typeSelect.addEventListener("change", () => {
        fillOrders();
        update();
    });
    ui.orderSelect.addEventListener("change", update);
    ui.centreInput.addEventListener("input", () => {
        f0 = sliderToCentre(Number(ui.centreInput.value));
        update();
    });
    ui.qInput.addEventListener("input", () => {
        q = sliderToQ(Number(ui.qInput.value));
        update();
    });
    ui.presetButtons.forEach((button) =>
        button.addEventListener("click", () => {
            const p = PRESETS[Number(button.dataset.preset)];
            // A band given by its edges: the centre is their geometric mean, and Q = centre / width
            const f0 = p.f0 || Math.sqrt(p.fL * p.fH);
            setBand(f0, p.q || f0 / (p.fH - p.fL));
        })
    );
    fillOrders();
    setBand(Math.sqrt(8 * 13), Math.sqrt(8 * 13) / 5); // start on the alpha band, 8 to 13 Hz
    // #region_A_end
}

bandPassFilterChart("scichart-root");
