import * as SciChart from "scichart";

const SAMPLE_RATE = 1000; // samples per second (Hz)

// The controls and the four charts each need an element. This splits the page's div into a control bar,
// two readout lines and a 2 × 2 grid of charts; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const slider = "vertical-align:middle; width:120px";
    const bar = document.createElement("div");
    bar.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Response <select style="font:inherit">` +
        `<option value="low-pass">Low-pass</option>` +
        `<option value="high-pass">High-pass</option>` +
        `<option value="band-pass">Band-pass (fc to 2 fc)</option></select></label>` +
        `<label>Cutoff fc <input type="range" min="0" max="100" step="0.1" value="53.72" style="${slider}"> <output></output></label>` +
        `<label>FIR taps <input type="range" min="11" max="301" step="2" value="101" style="${slider}"> <output></output></label>` +
        `<label>Window <select style="font:inherit">` +
        `<option value="rectangular">Rectangular (none)</option>` +
        `<option value="hamming">Hamming</option>` +
        `<option value="blackman" selected>Blackman</option></select></label>` +
        `<label>Butterworth order <input type="range" min="1" max="8" step="1" value="4" style="${slider}"> <output></output></label>`;
    // Two readout lines, one per filter, announced to screen readers when they change
    const [firStatus, iirStatus] = ["#50C7E0", "#F48420"].map((colour) => {
        const line = document.createElement("div");
        line.setAttribute("aria-live", "polite");
        line.style.cssText = `padding:0 12px 4px; color:${colour};` + font;
        return line;
    });
    const grid = document.createElement("div");
    grid.style.cssText =
        "flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; gap:2px;";
    const divs = ["magnitude", "delay", "impulse", "signal"].map((name) => {
        const div = document.createElement("div");
        div.id = `${divElementId}-${name}`;
        div.style.cssText = "min-width:0; min-height:0;";
        grid.append(div);
        return div;
    });
    root.append(bar, firStatus, iirStatus, grid);
    const [responseSelect, windowSelect] = bar.querySelectorAll("select");
    const [cutoffInput, tapsInput, orderInput] = bar.querySelectorAll("input");
    const [cutoffOutput, tapsOutput, orderOutput] = bar.querySelectorAll("output");
    return {
        magnitudeDiv: divs[0],
        delayDiv: divs[1],
        impulseDiv: divs[2],
        signalDiv: divs[3],
        responseSelect,
        windowSelect,
        cutoffInput,
        tapsInput,
        orderInput,
        cutoffOutput,
        tapsOutput,
        orderOutput,
        firStatus,
        iirStatus
    };
}

async function firVsIirFiltersChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // FIR vs IIR: a windowed-sinc FIR filter and a Butterworth IIR filter with the same cutoff, side by side
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
        EAutoRange,
        LegendModifier,
        ELegendPlacement,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- 1. FIR design: the windowed-sinc recipe ---
    // The ideal low-pass filter's impulse response is a sinc function. Cut it to M + 1 taps, centre it on
    // i = M/2, taper it with a window and scale it so the taps add up to 1 (a gain of exactly 1 at 0 Hz).
    // fc is a fraction of the sample rate, and it is the half-amplitude (-6 dB) point of the result.
    function windowValue(name, i, M) {
        if (name === "hamming") return 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / M);
        if (name === "blackman") {
            return 0.42 - 0.5 * Math.cos((2 * Math.PI * i) / M) + 0.08 * Math.cos((4 * Math.PI * i) / M);
        }
        return 1; // rectangular: plain truncation
    }
    function windowedSincLowPass(fc, taps, windowName) {
        const M = taps - 1;
        const h = [];
        for (let i = 0; i <= M; i++) {
            const k = i - M / 2;
            const sinc = k === 0 ? 2 * Math.PI * fc : Math.sin(2 * Math.PI * fc * k) / k; // the centre tap is the limit, 2 pi fc
            h.push(sinc * windowValue(windowName, i, M));
        }
        const total = h.reduce((sum, v) => sum + v, 0);
        return h.map((v) => v / total);
    }
    // High-pass by spectral inversion: an impulse minus the low-pass (negate every tap, add 1 to the centre)
    function spectralInversion(h) {
        const inverted = h.map((v) => -v);
        inverted[(h.length - 1) / 2] += 1;
        return inverted;
    }
    function designFir(type, fc, taps, windowName) {
        if (type === "low-pass") return windowedSincLowPass(fc, taps, windowName);
        if (type === "high-pass") return spectralInversion(windowedSincLowPass(fc, taps, windowName));
        // Band-pass from fc to 2 fc: a low-pass at 2 fc minus a low-pass at fc
        const upper = windowedSincLowPass(2 * fc, taps, windowName);
        const lower = windowedSincLowPass(fc, taps, windowName);
        return upper.map((v, i) => v - lower[i]);
    }

    // --- 2. IIR design: a Butterworth filter as a chain of second-order sections (biquads) ---
    // The analogue Butterworth poles sit evenly round a half circle. Each pair becomes one biquad with quality
    // factor Q, and an odd order adds a first-order section. The bilinear transform maps each section to a
    // digital one; K = tan(pi fc / fs) "prewarps" the cutoff so the digital filter is -3 dB exactly at fc.
    // Each section is { b: [b0, b1, b2], a: [1, a1, a2] }, for y[n] = b0 x[n] + b1 x[n-1] + b2 x[n-2] - a1 y[n-1] - a2 y[n-2].
    function butterworthSections(kind, fc, order) {
        const K = Math.tan(Math.PI * fc);
        const sections = [];
        for (let k = 1; k <= Math.floor(order / 2); k++) {
            const theta = (Math.PI * (2 * k + order - 1)) / (2 * order); // angle of the k-th analogue pole
            const Q = -1 / (2 * Math.cos(theta));
            const norm = 1 / (1 + K / Q + K * K);
            const a = [1, 2 * (K * K - 1) * norm, (1 - K / Q + K * K) * norm];
            const b = kind === "low-pass" ? [K * K * norm, 2 * K * K * norm, K * K * norm] : [norm, -2 * norm, norm];
            sections.push({ b, a });
        }
        if (order % 2 === 1) {
            const norm = 1 / (1 + K);
            const a = [1, (K - 1) * norm, 0];
            const b = kind === "low-pass" ? [K * norm, K * norm, 0] : [norm, -norm, 0];
            sections.push({ b, a });
        }
        return sections;
    }
    function designIir(type, fc, order) {
        if (type === "band-pass") {
            // A Butterworth high-pass at fc followed by a Butterworth low-pass at 2 fc
            return [...butterworthSections("high-pass", fc, order), ...butterworthSections("low-pass", 2 * fc, order)];
        }
        return butterworthSections(type, fc, order);
    }

    // --- 3. Frequency response and group delay of any filter given as sections ---
    // An FIR filter is a single section with b = the taps and a = [1]. At w = 2 pi f / fs, a polynomial
    // p gives P = sum of p[k] e^(-i w k). The group delay (how long each frequency is held up, in samples)
    // is the real part of sum(k p[k] e^(-i w k)) / P, for b minus for a, summed over the sections.
    function polynomialAt(p, w) {
        let re = 0;
        let im = 0;
        let dRe = 0;
        let dIm = 0;
        for (let k = 0; k < p.length; k++) {
            const c = Math.cos(w * k);
            const s = -Math.sin(w * k);
            re += p[k] * c;
            im += p[k] * s;
            dRe += k * p[k] * c;
            dIm += k * p[k] * s;
        }
        const magnitudeSquared = re * re + im * im;
        return { magnitude: Math.sqrt(magnitudeSquared), delay: (dRe * re + dIm * im) / (magnitudeSquared || 1e-300) };
    }
    function responseAt(sections, f) {
        const w = (2 * Math.PI * f) / SAMPLE_RATE;
        let gain = 1;
        let delay = 0;
        for (const { b, a } of sections) {
            const top = polynomialAt(b, w);
            const bottom = polynomialAt(a, w);
            gain *= top.magnitude / bottom.magnitude;
            delay += top.delay - bottom.delay;
        }
        return { gainDb: 20 * Math.log10(Math.max(gain, 1e-6)), delaySamples: delay }; // floor at -120 dB
    }

    // --- 4. Running the filters on data ---
    // SciChart.js runs each filter with an XyCustomFilter, which calls filterFunction(index, y) for each point
    // in index order: from 0 when it recalculates everything (on creation, or when filterFunction is set).
    // The FIR filter reads earlier inputs from the source series; the IIR filter keeps each section's last two
    // inputs and outputs as its state, and clears it at index 0. (If you update a single point of the source,
    // set filterFunction again so the whole output is recalculated.)
    function firFilterFunction(sourceSeries, taps) {
        return (index) => {
            const x = sourceSeries.getNativeYValues();
            let sum = 0;
            for (let k = 0; k < taps.length && k <= index; k++) sum += taps[k] * x.get(index - k);
            return sum;
        };
    }
    function iirFilterFunction(sections) {
        let state = [];
        return (index, y) => {
            if (index === 0 || !state.length) state = sections.map(() => ({ x1: 0, x2: 0, y1: 0, y2: 0 }));
            let value = y;
            sections.forEach(({ b, a }, s) => {
                const z = state[s];
                const out = b[0] * value + b[1] * z.x1 + b[2] * z.x2 - a[1] * z.y1 - a[2] * z.y2;
                z.x2 = z.x1;
                z.x1 = value;
                z.y2 = z.y1;
                z.y1 = out;
                value = out;
            });
            return value;
        };
    }
    // The IIR filter's impulse response: feed it a single 1 followed by zeros
    function iirImpulseResponse(sections, length) {
        const step = iirFilterFunction(sections);
        return Array.from({ length }, (_, n) => step(n, n === 0 ? 1 : 0));
    }

    // --- 5. The test signal: a rectangular pulse with a little noise (a seeded random generator) ---
    let seed = 1977;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(random() || 1e-12)) * Math.cos(2 * Math.PI * random());
    const time = [];
    const pulse = [];
    for (let n = 0; n < SAMPLE_RATE; n++) {
        const t = n / SAMPLE_RATE;
        time.push(1000 * t); // milliseconds
        pulse.push((t >= 0.3 && t < 0.6 ? 1 : 0) + 0.05 * gaussian());
    }

    // --- 6. The four charts ---
    const theme = new SciChartJsNavyTheme();
    const FIR_COLOUR = "#50C7E0";
    const IIR_COLOUR = "#F48420";
    const addModifiers = (surface, legend = undefined) => {
        surface.chartModifiers.add(
            new CursorModifier({ showTooltip: true, showAxisLabels: false }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        if (legend) surface.chartModifiers.add(new LegendModifier({ showCheckboxes: true, placement: legend }));
    };
    const logFrequencyAxis = (wasmContext) =>
        new LogarithmicAxis(wasmContext, {
            axisTitle: "Frequency (Hz)",
            logBase: 10,
            labelFormat: ENumericFormat.SignificantFigures,
            labelPrecision: 2,
            autoTicks: false, // a labelled gridline at 1, 10 and 100 Hz, and minor gridlines between
            majorDelta: 1,
            minorDelta: 1,
            visibleRange: new NumberRange(1, SAMPLE_RATE / 2)
        });
    const line = (wasmContext, dataSeries, stroke, thickness = 2) =>
        new FastLineRenderableSeries(wasmContext, { dataSeries, stroke, strokeThickness: thickness });

    // Chart 1: magnitude response in dB on a log frequency axis
    const magnitude = await SciChartSurface.create(ui.magnitudeDiv, { theme, title: "Magnitude", titleStyle: { fontSize: 16 } });
    magnitude.sciChartSurface.xAxes.add(logFrequencyAxis(magnitude.wasmContext));
    magnitude.sciChartSurface.yAxes.add(
        new NumericAxis(magnitude.wasmContext, { axisTitle: "Gain (dB)", visibleRange: new NumberRange(-100, 6) })
    );
    const firGain = new XyDataSeries(magnitude.wasmContext, { dataSeriesName: "FIR (windowed-sinc)" });
    const iirGain = new XyDataSeries(magnitude.wasmContext, { dataSeriesName: "IIR (Butterworth)" });
    magnitude.sciChartSurface.renderableSeries.add(
        line(magnitude.wasmContext, firGain, FIR_COLOUR),
        line(magnitude.wasmContext, iirGain, IIR_COLOUR)
    );
    const cutoffLines = [0, 1].map(
        () =>
            new VerticalLineAnnotation({
                x1: 50,
                stroke: "#FFFFFF88",
                strokeDashArray: [6, 4],
                showLabel: true,
                labelPlacement: ELabelPlacement.TopRight
            })
    );
    magnitude.sciChartSurface.annotations.add(
        ...cutoffLines,
        new HorizontalLineAnnotation({
            y1: -3,
            stroke: "#FFFFFF66",
            strokeDashArray: [2, 4],
            showLabel: true,
            labelValue: "-3 dB",
            labelPlacement: ELabelPlacement.BottomLeft
        })
    );
    addModifiers(magnitude.sciChartSurface, ELegendPlacement.BottomLeft);

    // Chart 2: group delay in milliseconds: flat for the FIR filter, frequency-dependent for the IIR filter
    const delay = await SciChartSurface.create(ui.delayDiv, { theme, title: "Group delay", titleStyle: { fontSize: 16 } });
    delay.sciChartSurface.xAxes.add(logFrequencyAxis(delay.wasmContext));
    delay.sciChartSurface.yAxes.add(
        new NumericAxis(delay.wasmContext, {
            axisTitle: "Delay (ms)",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.05, 0.1)
        })
    );
    const firDelay = new XyDataSeries(delay.wasmContext, { dataSeriesName: "FIR delay" });
    const iirDelay = new XyDataSeries(delay.wasmContext, { dataSeriesName: "IIR delay" });
    delay.sciChartSurface.renderableSeries.add(
        line(delay.wasmContext, firDelay, FIR_COLOUR),
        line(delay.wasmContext, iirDelay, IIR_COLOUR)
    );
    addModifiers(delay.sciChartSurface);

    // Chart 3: impulse responses: the FIR filter's taps end; the IIR filter's response decays for ever
    const IMPULSE_LENGTH = 400; // samples
    const impulse = await SciChartSurface.create(ui.impulseDiv, { theme, title: "Impulse response", titleStyle: { fontSize: 16 } });
    impulse.sciChartSurface.xAxes.add(
        new NumericAxis(impulse.wasmContext, {
            axisTitle: "Time (ms)",
            labelPrecision: 0,
            visibleRange: new NumberRange(0, IMPULSE_LENGTH)
        })
    );
    impulse.sciChartSurface.yAxes.add(
        new NumericAxis(impulse.wasmContext, {
            axisTitle: "Amplitude",
            labelPrecision: 2,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1)
        })
    );
    const firImpulse = new XyDataSeries(impulse.wasmContext, { dataSeriesName: "FIR taps" });
    const iirImpulse = new XyDataSeries(impulse.wasmContext, { dataSeriesName: "IIR impulse response" });
    impulse.sciChartSurface.renderableSeries.add(
        line(impulse.wasmContext, iirImpulse, IIR_COLOUR),
        line(impulse.wasmContext, firImpulse, FIR_COLOUR)
    );
    const firEndLine = new VerticalLineAnnotation({
        x1: 100,
        stroke: FIR_COLOUR,
        strokeDashArray: [4, 4],
        showLabel: true,
        labelValue: "FIR ends",
        labelPlacement: ELabelPlacement.TopLeft,
        axisLabelFill: FIR_COLOUR
    });
    impulse.sciChartSurface.annotations.add(firEndLine);
    addModifiers(impulse.sciChartSurface);

    // Chart 4: a noisy pulse through both filters. The XyCustomFilters recalculate when filterFunction is set
    const signal = await SciChartSurface.create(ui.signalDiv, { theme, title: "Filtered pulse", titleStyle: { fontSize: 16 } });
    signal.sciChartSurface.xAxes.add(new NumericAxis(signal.wasmContext, { axisTitle: "Time (ms)", labelPrecision: 0 }));
    signal.sciChartSurface.yAxes.add(
        new NumericAxis(signal.wasmContext, { axisTitle: "Amplitude", visibleRange: new NumberRange(-1.2, 1.5) })
    );
    const input = new XyDataSeries(signal.wasmContext, { xValues: time, yValues: pulse, dataSeriesName: "Input" });
    const firOutput = new XyCustomFilter(input, { dataSeriesName: "FIR output" });
    const iirOutput = new XyCustomFilter(input, { dataSeriesName: "IIR output" });
    signal.sciChartSurface.renderableSeries.add(
        line(signal.wasmContext, input, "#FFFFFF66", 1),
        line(signal.wasmContext, firOutput, FIR_COLOUR),
        line(signal.wasmContext, iirOutput, IIR_COLOUR)
    );
    addModifiers(signal.sciChartSurface, ELegendPlacement.TopRight);

    // --- 7. Re-design and re-run both filters whenever a control changes ---
    // Frequencies for the response charts: 500 steps, evenly spaced on a log scale from 1 Hz to fs / 2
    const frequencies = Array.from({ length: 500 }, (_, i) => Math.pow(SAMPLE_RATE / 2, i / 499));
    // The cutoff slider runs from 10 Hz to 200 Hz on a log scale
    const sliderToCutoff = (value) => 10 * Math.pow(20, value / 100);

    // Where the gain crosses -3 dB: step through in 0.5 Hz steps, then interpolate between the two steps
    function minus3dBPoints(sections) {
        const points = [];
        let previous = responseAt(sections, 0.5).gainDb + 3.0103;
        for (let f = 1; f < SAMPLE_RATE / 2; f += 0.5) {
            const current = responseAt(sections, f).gainDb + 3.0103;
            if (current > 0 !== previous > 0) points.push((f - 0.5 + (0.5 * previous) / (previous - current)).toFixed(1));
            previous = current;
        }
        if (points.length) return "-3 dB at " + points.join(" and ") + " Hz";
        const peak = Math.max(...frequencies.map((f) => responseAt(sections, f).gainDb));
        return `gain peaks at ${peak.toFixed(1)} dB (too few taps for this band)`;
    }
    // Multiplications per output sample: one per tap for FIR; 5 per biquad and 3 per first-order section for IIR
    const iirMultiplies = (sections) => sections.reduce((sum, s) => sum + (s.a[2] === 0 ? 3 : 5), 0);

    function update() {
        const type = ui.responseSelect.value;
        const cutoff = sliderToCutoff(Number(ui.cutoffInput.value));
        const taps = Number(ui.tapsInput.value);
        const order = Number(ui.orderInput.value);
        const fc = cutoff / SAMPLE_RATE;
        const fir = designFir(type, fc, taps, ui.windowSelect.value);
        const firSections = [{ b: fir, a: [1] }];
        const iirSections = designIir(type, fc, order);

        // Charts 1 and 2: magnitude and group delay
        const firResponse = frequencies.map((f) => responseAt(firSections, f));
        const iirResponse = frequencies.map((f) => responseAt(iirSections, f));
        firGain.clear();
        firGain.appendRange(frequencies, firResponse.map((r) => r.gainDb));
        iirGain.clear();
        iirGain.appendRange(frequencies, iirResponse.map((r) => r.gainDb));
        const toMs = (samples) => (1000 * samples) / SAMPLE_RATE;
        firDelay.clear();
        // A symmetric kernel delays every frequency by exactly (taps - 1) / 2 samples
        firDelay.appendRange(frequencies, frequencies.map(() => toMs((taps - 1) / 2)));
        iirDelay.clear();
        iirDelay.appendRange(frequencies, iirResponse.map((r) => toMs(r.delaySamples)));
        cutoffLines[0].x1 = cutoff;
        cutoffLines[0].labelValue = `fc ${cutoff.toFixed(0)} Hz`;
        cutoffLines[1].x1 = 2 * cutoff;
        cutoffLines[1].labelValue = `2 fc`;
        cutoffLines[1].isHidden = type !== "band-pass";

        // Chart 3: impulse responses
        const sampleTimes = Array.from({ length: IMPULSE_LENGTH }, (_, n) => toMs(n));
        firImpulse.clear();
        firImpulse.appendRange(sampleTimes.slice(0, taps), fir);
        iirImpulse.clear();
        iirImpulse.appendRange(sampleTimes, iirImpulseResponse(iirSections, IMPULSE_LENGTH));
        firEndLine.x1 = toMs(taps - 1);

        // Chart 4: setting filterFunction makes each XyCustomFilter recalculate every point
        firOutput.filterFunction = firFilterFunction(input, fir);
        iirOutput.filterFunction = iirFilterFunction(iirSections);

        // The readout: cost, delay and the measured -3 dB points
        const passband = iirResponse.filter((r) => r.gainDb > -3.0103).map((r) => toMs(r.delaySamples));
        const iirDelayText = passband.length
            ? `${Math.min(...passband).toFixed(1)} to ${Math.max(...passband).toFixed(1)} ms in the passband`
            : "-";
        ui.cutoffOutput.textContent = `${cutoff.toFixed(0)} Hz`;
        ui.cutoffInput.setAttribute("aria-valuetext", `${cutoff.toFixed(0)} hertz`);
        ui.tapsOutput.textContent = String(taps);
        ui.orderOutput.textContent = String(order);
        ui.firStatus.textContent =
            `FIR: ${taps} taps, ${taps} multiplies per sample, ` +
            `delay ${toMs((taps - 1) / 2).toFixed(1)} ms at every frequency, ${minus3dBPoints(firSections)}`;
        ui.iirStatus.textContent =
            `IIR: order ${order}${type === "band-pass" ? " high-pass + order " + order + " low-pass" : ""}, ` +
            `${iirSections.length} section${iirSections.length > 1 ? "s" : ""}, ${iirMultiplies(iirSections)} multiplies per sample, ` +
            `delay ${iirDelayText}, ${minus3dBPoints(iirSections)}`;
    }

    for (const control of [ui.responseSelect, ui.windowSelect]) control.addEventListener("change", update);
    for (const control of [ui.cutoffInput, ui.tapsInput, ui.orderInput]) control.addEventListener("input", update);
    update();
    // #region_A_end
}

firVsIirFiltersChart("scichart-root");
