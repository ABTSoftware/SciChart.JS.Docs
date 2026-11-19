import * as SciChart from "scichart";

// #region_A_start
// Build a signal from sine waves, then recover its ingredients with a discrete Fourier transform (DFT).
// The DSP helpers below are plain JavaScript with no dependencies: copy them into your app as they are.

const SAMPLE_RATE = 1024; // samples per second
const N = 1024; // samples in the signal: exactly one second, so every whole-number frequency lands on a bin
const MAX_FREQUENCY_SHOWN = 60; // Hz, the right-hand end of the spectrum chart

// A seeded random number generator, so the noise looks the same every time the chart redraws
function createRandom(seed) {
    let state = seed;
    return () => {
        state = (state * 16807) % 2147483647;
        return (state - 1) / 2147483646;
    };
}

// The signal: a sum of sine waves, each { frequency (Hz), amplitude }, plus optional random noise.
// A negative amplitude is the same sine wave turned upside down: a phase shift of 180 degrees.
function buildSignal(components, noiseLevel) {
    const random = createRandom(42);
    const time = new Array(N);
    const signal = new Array(N);
    for (let n = 0; n < N; n++) {
        const t = n / SAMPLE_RATE;
        let value = 0;
        for (const { frequency, amplitude } of components) {
            value += amplitude * Math.sin(2 * Math.PI * frequency * t);
        }
        time[n] = t;
        signal[n] = value + noiseLevel * (random() * 2 - 1);
    }
    return { time, signal };
}

// The discrete Fourier transform, written exactly as the formula reads:
//   X[k] = sum over n of x[n] * e^(-i 2 pi k n / N)
//        = sum over n of x[n] * (cos(2 pi k n / N) - i sin(2 pi k n / N))
// It returns the real and imaginary parts of X[k] for k = 0 .. maxBin.
// This direct version does about N x N multiplications. An FFT gives the same numbers far faster;
// see the FFT guide (/learn/signal-processing/fast-fourier-transform/).
function dft(x, maxBin) {
    const length = x.length;
    const re = new Array(maxBin + 1).fill(0);
    const im = new Array(maxBin + 1).fill(0);
    for (let k = 0; k <= maxBin; k++) {
        for (let n = 0; n < length; n++) {
            const angle = (2 * Math.PI * ((k * n) % length)) / length;
            re[k] += x[n] * Math.cos(angle);
            im[k] -= x[n] * Math.sin(angle);
        }
    }
    return { re, im };
}

// Turn the complex DFT output into what a chart shows: the amplitude and phase of each frequency.
// Scaling by 2/N makes a sine wave of amplitude A show as a bar of height A (the DC bin, k = 0, uses 1/N).
// The phase is in degrees: a sine wave starting at zero and rising has a phase of -90 degrees.
function amplitudeAndPhase({ re, im }, length) {
    const amplitude = re.map((r, k) => (k === 0 ? 1 : 2) * Math.hypot(r, im[k]) / length);
    const phase = re.map((r, k) => (Math.atan2(im[k], r) * 180) / Math.PI);
    return { amplitude, phase };
}

async function fourierTransformCharts(timeDiv, spectrumDiv) {
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

    // Chart 1, the time domain: the sine waves (the ingredients) and their sum (the signal)
    const time = await SciChartSurface.create(timeDiv, { theme: new SciChartJsNavyTheme() });
    time.sciChartSurface.xAxes.add(
        new NumericAxis(time.wasmContext, { axisTitle: "Time (s)", visibleRange: new NumberRange(0, 1) })
    );
    time.sciChartSurface.yAxes.add(
        new NumericAxis(time.wasmContext, {
            axisTitle: "Value",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.4) // extra room at the top for the legend
        })
    );
    // All the sine waves go in one series, separated by NaN gaps, so they share one legend entry
    const wavesData = new XyDataSeries(time.wasmContext, {
        dataSeriesName: "Sine waves (ingredients)",
        isSorted: false,
        containsNaN: true
    });
    const sumData = new XyDataSeries(time.wasmContext, { dataSeriesName: "Their sum (the signal)" });
    time.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(time.wasmContext, { dataSeries: wavesData, stroke: "#F4842099", strokeThickness: 1.5 }),
        new FastLineRenderableSeries(time.wasmContext, { dataSeries: sumData, stroke: "#50C7E0", strokeThickness: 3 })
    );
    time.sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true, orientation: ELegendOrientation.Horizontal }),
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier()
    );

    // Chart 2, the frequency domain: the DFT's amplitude at each frequency, drawn as stems
    const spectrum = await SciChartSurface.create(spectrumDiv, { theme: new SciChartJsNavyTheme() });
    spectrum.sciChartSurface.xAxes.add(
        new NumericAxis(spectrum.wasmContext, {
            axisTitle: "Frequency (Hz)",
            visibleRange: new NumberRange(0, MAX_FREQUENCY_SHOWN),
            labelPrecision: 0
        })
    );
    spectrum.sciChartSurface.yAxes.add(
        new NumericAxis(spectrum.wasmContext, {
            axisTitle: "Amplitude",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0, 0.15)
        })
    );
    const spectrumData = new XyDataSeries(spectrum.wasmContext, { dataSeriesName: "Fourier transform (amplitude)" });
    spectrum.sciChartSurface.renderableSeries.add(
        new FastImpulseRenderableSeries(spectrum.wasmContext, {
            dataSeries: spectrumData,
            stroke: "#F48420",
            fill: "#F48420",
            strokeThickness: 3,
            size: 9,
            pointMarker: new EllipsePointMarker(spectrum.wasmContext)
        })
    );
    let phases = [];
    spectrum.sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos
                    .filter((info) => info.isHit)
                    .map((info) => {
                        const amplitude = info.yValue;
                        const phase = phases[Math.round(info.xValue)];
                        return amplitude < 0.005
                            ? `${info.xValue} Hz: none`
                            : `${info.xValue} Hz: amplitude ${amplitude.toFixed(2)}, phase ${phase.toFixed(0)}°`;
                    })
        }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier()
    );

    // Rebuild the signal, transform it and redraw both charts. Call this whenever the ingredients change.
    function update(components, noiseLevel) {
        const { time: t, signal } = buildSignal(components, noiseLevel);
        sumData.clear();
        sumData.appendRange(t, signal);

        wavesData.clear();
        for (const { frequency, amplitude } of components) {
            const ys = t.map((tn) => amplitude * Math.sin(2 * Math.PI * frequency * tn));
            wavesData.appendRange(t, ys);
            wavesData.append(NaN, NaN); // a gap before the next sine wave
        }

        // The transform only looks at the summed signal: it never sees the list of ingredients
        const { amplitude, phase } = amplitudeAndPhase(dft(signal, MAX_FREQUENCY_SHOWN), N);
        phases = phase;
        // Plot a stem for every frequency the transform found (bin k is k Hz here, as N = SAMPLE_RATE)
        const frequencies = [];
        const amplitudes = [];
        amplitude.forEach((a, k) => {
            if (a > 1e-9) {
                frequencies.push((k * SAMPLE_RATE) / N);
                amplitudes.push(a);
            }
        });
        spectrumData.clear();
        spectrumData.appendRange(frequencies, amplitudes);
    }

    return { update };
}
// #region_A_end

// The page layout for this example: a row of controls above the two charts.
// In your app, these can simply be divs and inputs in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.display = "flex";
    root.style.flexDirection = "column";
    root.style.background = "#14233C";
    const controls = document.createElement("div");
    controls.style.cssText =
        "display:flex;flex-wrap:wrap;gap:6px 18px;align-items:center;padding:8px 12px;color:#E0E6F0;font:inherit;font-size:13px";
    const charts = [0, 1].map((i) => {
        const div = document.createElement("div");
        div.id = `${divElementId}-chart${i}`; // SciChart tells its charts apart by their div's id
        div.style.cssText = "flex:1;min-height:0";
        return div;
    });
    root.append(controls, ...charts);
    return { controls, timeDiv: charts[0], spectrumDiv: charts[1] };
}

// Ready-made recipes: the first four terms of each wave's Fourier series, with a 5 Hz fundamental.
const FUNDAMENTAL = 5;
const PRESETS = {
    // Square wave: odd harmonics only, amplitude 4 / (pi k)
    square: [1, 3, 5, 7].map((k) => ({ frequency: FUNDAMENTAL * k, amplitude: 4 / (Math.PI * k) })),
    // Sawtooth wave: every harmonic, amplitude 2 / (pi k), alternating in sign
    sawtooth: [1, 2, 3, 4].map((k) => ({ frequency: FUNDAMENTAL * k, amplitude: ((k % 2 ? 2 : -2) / (Math.PI * k)) })),
    // Triangle wave: odd harmonics only, amplitude 8 / (pi^2 k^2), alternating in sign
    triangle: [1, 3, 5, 7].map((k, i) => ({
        frequency: FUNDAMENTAL * k,
        amplitude: ((i % 2 ? -8 : 8) / (Math.PI * Math.PI * k * k))
    })),
    // One pure sine wave: the transform finds a single frequency
    sine: [1, 3, 5, 7].map((k) => ({ frequency: FUNDAMENTAL * k, amplitude: k === 1 ? 1 : 0 }))
};

// Sliders for the four sine waves and the noise, and a select for the recipes
function createControls(container, idPrefix, onChange) {
    const add = (html) => {
        const span = document.createElement("span");
        span.style.cssText = "display:inline-flex;align-items:center;gap:6px;white-space:nowrap";
        span.innerHTML = html;
        container.append(span);
        return span;
    };
    const presetBox = add(
        `<label for="${idPrefix}-preset">Signal</label>` +
            `<select id="${idPrefix}-preset" style="font:inherit">` +
            `<option value="square">Square wave</option><option value="sawtooth">Sawtooth wave</option>` +
            `<option value="triangle">Triangle wave</option><option value="sine">Single sine wave</option>` +
            `<option value="custom">Custom</option></select>`
    );
    const preset = presetBox.querySelector("select");
    const noiseBox = add(
        `<label for="${idPrefix}-noise">Noise</label>` +
            `<input id="${idPrefix}-noise" type="range" min="0" max="1" step="0.05" value="0" style="width:80px">` +
            `<output style="min-width:2.5em"></output>`
    );
    const noise = noiseBox.querySelector("input");
    const rows = [0, 1, 2, 3].map((i) => {
        const box = add(
            `<b style="color:#F48420">Wave ${i + 1}</b>` +
                `<label for="${idPrefix}-f${i}">Hz</label>` +
                `<input id="${idPrefix}-f${i}" type="range" min="1" max="50" step="1" style="width:70px">` +
                `<output style="min-width:1.6em"></output>` +
                `<label for="${idPrefix}-a${i}">amp.</label>` +
                `<input id="${idPrefix}-a${i}" type="range" min="-1.5" max="1.5" step="0.01" style="width:70px">` +
                `<output style="min-width:2.8em"></output>`
        );
        const [frequency, amplitude] = box.querySelectorAll("input");
        const [frequencyText, amplitudeText] = box.querySelectorAll("output");
        return { frequency, amplitude, frequencyText, amplitudeText };
    });
    const output = noiseBox.querySelector("output");

    const read = () => {
        rows.forEach((r) => {
            r.frequencyText.textContent = r.frequency.value;
            r.amplitudeText.textContent = Number(r.amplitude.value).toFixed(2);
        });
        output.textContent = Number(noise.value).toFixed(2);
        onChange(
            rows.map((r) => ({ frequency: Number(r.frequency.value), amplitude: Number(r.amplitude.value) })),
            Number(noise.value)
        );
    };
    const applyPreset = (name) => {
        PRESETS[name].forEach((c, i) => {
            rows[i].frequency.value = String(c.frequency);
            rows[i].amplitude.value = String(c.amplitude);
        });
        read();
    };
    preset.addEventListener("change", () => {
        if (preset.value !== "custom") applyPreset(preset.value);
    });
    noise.addEventListener("input", read);
    rows.forEach((r) =>
        [r.frequency, r.amplitude].forEach((input) =>
            input.addEventListener("input", () => {
                preset.value = "custom";
                read();
            })
        )
    );
    applyPreset("square");
}

async function fourierTransformExample(divElementId) {
    const { controls, timeDiv, spectrumDiv } = createLayout(divElementId);
    const { update } = await fourierTransformCharts(timeDiv, spectrumDiv);
    createControls(controls, divElementId, update);
}

fourierTransformExample("scichart-root");
