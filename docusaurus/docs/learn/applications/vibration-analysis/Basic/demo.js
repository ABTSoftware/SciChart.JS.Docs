import * as SciChart from "scichart";

const SAMPLE_RATE = 12800; // samples per second, a common rate for machine vibration data collectors
const SAMPLE_COUNT = 16384; // 1.28 s of data; a power of two, so a radix-2 FFT can be used

// The bearing in the simulated machine: a 6205-size deep-groove ball bearing
// (9 balls of 7.94 mm on a 39.04 mm pitch circle, contact angle 0)
const BEARING = { balls: 9, ballDiameter: 7.94, pitchDiameter: 39.04, contactAngleDeg: 0 };

// Sample data: one accelerometer on the bearing housing of a simulated motor, in g.
// Each fault adds the pattern it is known for. Shaft-rate components are given as velocity (mm/s RMS)
// at a multiple ("order") of the shaft speed; the bearing fault adds a short ring of a 3.2 kHz housing
// resonance each time a ball rolls over the damaged spot. A seeded random generator makes the data the
// same every time for the same settings.
function simulateMachine(rpm, fault, severity, noiseLevel) {
    let seed = 20816;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    const shaftHz = rpm / 60;
    const s = fault === "healthy" ? 0 : severity;

    // Velocity at each order, in mm/s RMS. Every machine has a little residual imbalance and misalignment.
    const orders = new Map([
        [1, 0.9],
        [2, 0.3],
        [3, 0.15]
    ]);
    const add = (order, velocity) => orders.set(order, (orders.get(order) || 0) + velocity);
    if (fault === "imbalance") add(1, 9 * s); // a strong 1x, little else
    if (fault === "misalignment") {
        add(1, 2.5 * s);
        add(2, 6 * s); // 2x as high as or higher than 1x
        add(3, 1.5 * s);
    }
    if (fault === "looseness") {
        for (let k = 1; k <= 12; k++) add(k, 3 * s * Math.pow(0.8, k - 1)); // a long row of harmonics
        for (let k = 0; k < 8; k++) add(k + 0.5, 1.2 * s * s * Math.pow(0.75, k)); // and half orders when severe
    }

    const g = 9.80665;
    const x = new Float64Array(SAMPLE_COUNT);
    const y = new Float64Array(SAMPLE_COUNT);
    for (const [order, velocity] of orders) {
        const f = order * shaftHz;
        // velocity v (RMS) at frequency f is an acceleration of peak sqrt(2) * v * 2 pi f
        const peakG = (Math.SQRT2 * velocity * 2 * Math.PI * f) / 1000 / g;
        const phase = 2 * Math.PI * random();
        for (let i = 0; i < SAMPLE_COUNT; i++) y[i] += peakG * Math.sin((2 * Math.PI * f * i) / SAMPLE_RATE + phase);
    }

    if (fault === "outer-race" && s > 0) {
        const ratio = (BEARING.ballDiameter / BEARING.pitchDiameter) * Math.cos((BEARING.contactAngleDeg * Math.PI) / 180);
        const bpfo = (BEARING.balls / 2) * shaftHz * (1 - ratio);
        const resonanceHz = 3200;
        const decay = 0.0006; // seconds for the ring to fall to 1/e
        const impactG = 5 * s;
        // Balls slip a little, so the impacts are not exactly evenly spaced (about 1% jitter)
        for (let t0 = 0.002; t0 < SAMPLE_COUNT / SAMPLE_RATE; t0 += (1 + 0.01 * gaussian()) / bpfo) {
            const height = impactG * (0.8 + 0.4 * random());
            const first = Math.ceil(t0 * SAMPLE_RATE);
            const last = Math.min(SAMPLE_COUNT, first + Math.ceil(8 * decay * SAMPLE_RATE));
            for (let i = first; i < last; i++) {
                const t = i / SAMPLE_RATE - t0;
                y[i] += height * Math.exp(-t / decay) * Math.sin(2 * Math.PI * resonanceHz * t);
            }
        }
    }

    for (let i = 0; i < SAMPLE_COUNT; i++) {
        x[i] = i / SAMPLE_RATE;
        y[i] += 0.15 * noiseLevel * gaussian(); // broadband noise from the machine and the sensor
    }
    return { x, y };
}

// The controls, the readout and the three charts each need an element. This splits the page's div into them;
// in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const bar = document.createElement("div");
    bar.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    bar.innerHTML =
        `<label>Shaft speed <input data-id="rpm" type="range" min="900" max="3600" step="30" value="1800" ` +
        `style="vertical-align:middle; width:110px"> <output data-id="rpm"></output></label>` +
        `<label>Fault <select data-id="fault" style="font:inherit">` +
        `<option value="healthy">Healthy</option><option value="imbalance">Imbalance</option>` +
        `<option value="misalignment">Misalignment</option>` +
        `<option value="outer-race" selected>Outer-race bearing fault</option>` +
        `<option value="looseness">Mechanical looseness</option></select></label>` +
        `<label>Severity <input data-id="severity" type="range" min="0" max="100" value="60" ` +
        `style="vertical-align:middle; width:100px"> <output data-id="severity"></output></label>` +
        `<label>Noise <input data-id="noise" type="range" min="0" max="100" value="30" ` +
        `style="vertical-align:middle; width:100px"> <output data-id="noise"></output></label>` +
        `<label>ISO 20816-3 limits <select data-id="iso" style="font:inherit">` +
        `<option value="2r">Group 2 (15–300 kW), rigid</option><option value="2f">Group 2, flexible</option>` +
        `<option value="1r">Group 1 (300 kW–50 MW), rigid</option><option value="1f">Group 1, flexible</option>` +
        `</select></label>` +
        `<span data-id="summary" aria-live="polite" style="flex-basis:100%; color:#c8d3e8"></span>`;
    const makeDiv = (name) => {
        const div = document.createElement("div");
        div.id = `${divElementId}-${name}`;
        div.style.cssText = "flex:1; min-height:0;";
        return div;
    };
    const waveformDiv = makeDiv("waveform");
    const spectrumDiv = makeDiv("spectrum");
    const envelopeDiv = makeDiv("envelope");
    root.append(bar, waveformDiv, spectrumDiv, envelopeDiv);
    const get = (selector) => bar.querySelector(selector);
    return {
        waveformDiv,
        spectrumDiv,
        envelopeDiv,
        rpmInput: get('input[data-id="rpm"]'),
        rpmOutput: get('output[data-id="rpm"]'),
        faultSelect: get('select[data-id="fault"]'),
        severityInput: get('input[data-id="severity"]'),
        severityOutput: get('output[data-id="severity"]'),
        noiseInput: get('input[data-id="noise"]'),
        noiseOutput: get('output[data-id="noise"]'),
        isoSelect: get('select[data-id="iso"]'),
        summary: get('span[data-id="summary"]')
    };
}

async function vibrationAnalysisChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Vibration analysis of a rotating machine: time waveform, velocity spectrum with order markers,
    // and envelope spectrum with bearing defect frequencies, charted with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
        ELabelPlacement,
        FastLineRenderableSeries,
        FastMountainRenderableSeries,
        XyDataSeries,
        VerticalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
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

    // Amplitude spectrum with a Hann window, scaled so a sine of RMS value A shows a peak of about A.
    // Returns one RMS amplitude per frequency bin, from 0 Hz to half the sample rate.
    function rmsSpectrum(values) {
        const n = values.length;
        const re = new Float64Array(n);
        const im = new Float64Array(n);
        const mean = values.reduce((sum, v) => sum + v, 0) / n;
        let windowSum = 0;
        for (let i = 0; i < n; i++) {
            const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n);
            windowSum += w;
            re[i] = (values[i] - mean) * w;
        }
        fft(re, im);
        const amplitudes = new Float64Array(n / 2 + 1);
        for (let k = 1; k <= n / 2; k++) amplitudes[k] = (2 * Math.hypot(re[k], im[k])) / windowSum / Math.SQRT2;
        return amplitudes;
    }

    // Acceleration spectrum (g RMS) to velocity spectrum (mm/s RMS): divide each line by 2 pi f.
    // Lines below 5 Hz are left out, where dividing by a small f would only magnify noise.
    function toVelocity(accelerationG, binHz) {
        return accelerationG.map((a, k) => (k * binHz < 5 ? 0 : (a * 9.80665 * 1000) / (2 * Math.PI * k * binHz)));
    }

    // Overall vibration: the RMS of all lines from 10 to 1000 Hz (the band ISO 20816-3 uses for machines
    // above 600 r/min). Dividing by 1.5 removes the Hann window's spreading of each line over about 1.5 bins.
    function overallRms(velocity, binHz) {
        let sum = 0;
        for (let k = 0; k < velocity.length; k++) {
            const f = k * binHz;
            if (f >= 10 && f <= 1000) sum += velocity[k] * velocity[k];
        }
        return Math.sqrt(sum / 1.5);
    }

    // Envelope analysis for bearing faults: keep only a band around the housing resonance that the impacts
    // excite, take the envelope (the magnitude of the analytic signal, via the Hilbert transform), then take
    // the spectrum of the envelope. The impacts' repetition rate shows up as clean lines.
    function envelopeSpectrum(values, lowHz, highHz) {
        const n = values.length;
        const re = Float64Array.from(values);
        const im = new Float64Array(n);
        fft(re, im);
        for (let k = 0; k < n; k++) {
            const f = (k * SAMPLE_RATE) / n;
            // positive frequencies inside the band are doubled; everything else, negative frequencies included, is zeroed
            const keep = k < n / 2 && f >= lowHz && f <= highHz ? 2 : 0;
            re[k] *= keep;
            im[k] *= keep;
        }
        // Inverse FFT with the forward one: conjugate, FFT, conjugate again and divide by n
        for (let k = 0; k < n; k++) im[k] = -im[k];
        fft(re, im);
        const envelope = new Float64Array(n);
        for (let i = 0; i < n; i++) envelope[i] = Math.hypot(re[i], im[i]) / n;
        return rmsSpectrum(envelope);
    }

    // Bearing defect frequencies, as multiples of the shaft speed (orders)
    function bearingOrders({ balls, ballDiameter, pitchDiameter, contactAngleDeg }) {
        const r = (ballDiameter / pitchDiameter) * Math.cos((contactAngleDeg * Math.PI) / 180);
        return {
            FTF: 0.5 * (1 - r), // cage (fundamental train)
            BSF: (pitchDiameter / (2 * ballDiameter)) * (1 - r * r), // ball spin
            BPFO: (balls / 2) * (1 - r), // ball pass, outer race
            BPFI: (balls / 2) * (1 + r) // ball pass, inner race
        };
    }

    // ISO 20816-3 zone boundaries A/B, B/C and C/D, velocity in mm/s RMS
    const isoLimits = {
        "2r": [1.4, 2.8, 4.5],
        "2f": [2.3, 4.5, 7.1],
        "1r": [2.3, 4.5, 7.1],
        "1f": [3.5, 7.1, 11.0]
    };
    const zones = [
        { name: "A", meaning: "as new", colour: "#2ECC71" },
        { name: "B", meaning: "acceptable long term", colour: "#C6E05A" },
        { name: "C", meaning: "unsatisfactory: plan a repair", colour: "#F5A623" },
        { name: "D", meaning: "damage likely", colour: "#FF4D4D" }
    ];

    // --- Three charts, one above the other ---
    async function createChart(div, title, xTitle, yTitle, xPrecision) {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(div, {
            theme: new SciChartJsNavyTheme(),
            title,
            titleStyle: { fontSize: 14 }
        });
        const axisTitleStyle = { fontSize: 14 };
        const xAxis = new NumericAxis(wasmContext, {
            axisTitle: xTitle,
            axisTitleStyle,
            autoRange: EAutoRange.Never,
            labelPrecision: xPrecision
        });
        sciChartSurface.xAxes.add(xAxis);
        const yAxis = new NumericAxis(wasmContext, {
            axisTitle: yTitle,
            axisTitleStyle,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.05, 0.1),
            labelPrecision: 2
        });
        sciChartSurface.yAxes.add(yAxis);
        const dataSeries = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });
        const chart = { sciChartSurface, wasmContext, xAxis, yAxis, dataSeries, defaultRange: new NumberRange(0, 1) };
        // Scroll to zoom, drag to pan (both along x); double-click to go back to the default range
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true, showYLine: false }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({
                xyDirection: EXyDirection.XDirection,
                onZoomExtents: () => {
                    xAxis.visibleRange = chart.defaultRange;
                    return false;
                }
            })
        );
        return chart;
    }

    const waveform = await createChart(ui.waveformDiv, "Time waveform (acceleration)", "Time (s)", "Accel. (g)", 2);
    waveform.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(waveform.wasmContext, {
            dataSeries: waveform.dataSeries,
            stroke: "#50C7E0",
            strokeThickness: 1
        })
    );

    const spectrum = await createChart(ui.spectrumDiv, "Velocity spectrum (RMS)", "Frequency (Hz)", "Velocity (mm/s)", 0);
    const envelope = await createChart(
        ui.envelopeDiv,
        "Envelope spectrum (2–5 kHz band)",
        "Frequency (Hz)",
        "Envelope (g)",
        0
    );
    envelope.yAxis.autoRange = EAutoRange.Never; // set in update()
    for (const chart of [spectrum, envelope]) {
        chart.sciChartSurface.renderableSeries.add(
            new FastMountainRenderableSeries(chart.wasmContext, {
                dataSeries: chart.dataSeries,
                stroke: "#50C7E0",
                strokeThickness: 2,
                fill: "#50C7E033"
            })
        );
    }

    // Frequency markers: a dashed vertical line with a label, moved whenever the shaft speed changes
    function addMarker(chart, label, colour, placement) {
        const marker = new VerticalLineAnnotation({
            x1: 0,
            stroke: colour,
            strokeThickness: 1,
            strokeDashArray: [4, 4],
            showLabel: true,
            labelPlacement: placement,
            labelValue: label,
            axisLabelFill: colour, // the label text colour when the label sits beside the line
            axisFontSize: 12
        });
        chart.sciChartSurface.annotations.add(marker);
        return marker;
    }
    const bearing = bearingOrders(BEARING);
    const orderGrey = "#C8D3E8";
    const spectrumMarkers = [1, 2, 3, 4, 5, 6, 7, 8].map((order) => ({
        order,
        marker: addMarker(spectrum, `${order}×`, orderGrey, ELabelPlacement.TopRight)
    }));
    spectrumMarkers.push({
        order: bearing.BPFO,
        marker: addMarker(spectrum, "BPFO", "#F48420", ELabelPlacement.BottomRight)
    });
    const envelopeMarkers = [
        { order: 1, marker: addMarker(envelope, "1×", orderGrey, ELabelPlacement.TopRight) },
        { order: bearing.BSF, marker: addMarker(envelope, "BSF", "#F5E663", ELabelPlacement.TopRight) },
        { order: bearing.BPFO, marker: addMarker(envelope, "BPFO", "#F48420", ELabelPlacement.TopRight) },
        { order: bearing.BPFI, marker: addMarker(envelope, "BPFI", "#E36FD8", ELabelPlacement.TopRight) },
        { order: 2 * bearing.BPFO, marker: addMarker(envelope, "2×BPFO", "#F48420", ELabelPlacement.TopRight) },
        { order: 3 * bearing.BPFO, marker: addMarker(envelope, "3×BPFO", "#F48420", ELabelPlacement.TopRight) }
    ];

    // Replace a data series' values
    function setData(dataSeries, x, y) {
        dataSeries.clear();
        dataSeries.appendRange(Array.from(x), Array.from(y));
    }

    // --- The controls: every change re-simulates the machine, reruns the analysis and redraws ---
    let lastRpm = 0;
    function update() {
        const rpm = Number(ui.rpmInput.value);
        const fault = ui.faultSelect.value;
        const severity = Number(ui.severityInput.value) / 100;
        const noiseLevel = Number(ui.noiseInput.value) / 100;
        const shaftHz = rpm / 60;
        ui.rpmOutput.textContent = `${rpm} rpm (${shaftHz.toFixed(1)} Hz)`;
        ui.severityOutput.textContent = `${Math.round(severity * 100)}%`;
        ui.noiseOutput.textContent = `${Math.round(noiseLevel * 100)}%`;
        ui.severityInput.disabled = fault === "healthy";

        // 1. The time waveform, in g
        const { x, y } = simulateMachine(rpm, fault, severity, noiseLevel);
        setData(waveform.dataSeries, x, y);

        // 2. The velocity spectrum, from 0 to half the sample rate (zoom out to see it all)
        const binHz = SAMPLE_RATE / SAMPLE_COUNT;
        const frequencies = Array.from({ length: SAMPLE_COUNT / 2 + 1 }, (_, k) => k * binHz);
        const velocity = toVelocity(rmsSpectrum(y), binHz);
        setData(spectrum.dataSeries, frequencies, velocity);

        // 3. The envelope spectrum of the 2 to 5 kHz band. Its y-axis never shrinks below 0.05 g, so the
        // noise floor of a machine without impacts stays flat instead of being scaled up to fill the chart.
        const envelopeValues = envelopeSpectrum(y, 2000, 5000);
        setData(envelope.dataSeries, frequencies, envelopeValues);
        let envelopeMax = 0.05;
        for (let k = 1; k * binHz < 15 * shaftHz; k++) envelopeMax = Math.max(envelopeMax, envelopeValues[k]);
        envelope.yAxis.visibleRange = new NumberRange(0, 1.15 * envelopeMax);

        // Markers follow the shaft speed; the default views show the first 10 and 12 orders
        for (const { order, marker } of spectrumMarkers) marker.x1 = order * shaftHz;
        for (const { order, marker } of envelopeMarkers) marker.x1 = order * shaftHz;
        waveform.defaultRange = new NumberRange(0, 0.25);
        spectrum.defaultRange = new NumberRange(0, 10 * shaftHz);
        envelope.defaultRange = new NumberRange(0, 12 * shaftHz);
        if (rpm !== lastRpm) {
            for (const chart of [waveform, spectrum, envelope]) chart.xAxis.visibleRange = chart.defaultRange;
            lastRpm = rpm;
        }

        // The readout: overall level and its ISO zone, peak acceleration and crest factor
        const overall = overallRms(velocity, binHz);
        const limits = isoLimits[ui.isoSelect.value];
        const zone = zones[limits.filter((limit) => overall >= limit).length];
        let peak = 0;
        let squares = 0;
        for (const value of y) {
            peak = Math.max(peak, Math.abs(value));
            squares += value * value;
        }
        const crestFactor = peak / Math.sqrt(squares / y.length);
        ui.summary.innerHTML =
            `Overall velocity <b>${overall.toFixed(2)} mm/s RMS</b> (10–1000 Hz): ` +
            `<span style="color:${zone.colour}; font-weight:600">zone ${zone.name}, ${zone.meaning}</span>` +
            ` · Peak ${peak.toFixed(2)} g · Crest factor ${crestFactor.toFixed(1)}` +
            ` · 1× = ${shaftHz.toFixed(1)} Hz · BPFO = ${(bearing.BPFO * shaftHz).toFixed(1)} Hz`;
    }

    for (const input of [ui.rpmInput, ui.severityInput, ui.noiseInput]) input.addEventListener("input", update);
    for (const select of [ui.faultSelect, ui.isoSelect]) select.addEventListener("change", update);
    update();
    // #region_A_end
}

vibrationAnalysisChart("scichart-root");
