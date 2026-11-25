import * as SciChart from "scichart";

const DURATION = 1; // seconds of signal shown in the time chart
const MAX_FREQUENCY = 60; // Hz: the top of the signal frequency slider and of the spectrum chart

// The controls and the two charts each need an element. This splits the page's div into a control bar,
// a status line, a time chart and a spectrum chart; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const controls = document.createElement("div");
    controls.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    const sliderStyle = "vertical-align:middle; width:150px; accent-color:#F48420";
    controls.innerHTML =
        `<label>Signal frequency <input type="range" min="0.5" max="${MAX_FREQUENCY}" step="0.1" value="9" ` +
        `style="${sliderStyle}"> <output></output></label>` +
        `<label>Sample rate <input type="range" min="4" max="${MAX_FREQUENCY}" step="1" value="10" ` +
        `style="${sliderStyle}"> <output></output></label>` +
        `<label>Anti-aliasing filter <select style="font:inherit">` +
        `<option value="off">Off</option>` +
        `<option value="on">On (8th-order low-pass at 0.4 × sample rate)</option></select></label>` +
        `<button type="button" style="font:inherit">Sweep the frequency</button>`;
    const status = document.createElement("div");
    status.setAttribute("aria-live", "polite");
    status.style.cssText = "padding:0 12px 6px; color:#c8d3e8; min-height:1.3em;" + font;
    const timeDiv = document.createElement("div");
    timeDiv.id = divElementId + "-time"; // SciChart tells its charts apart by their div's id
    timeDiv.style.cssText = "flex:1; min-height:0;";
    const spectrumDiv = document.createElement("div");
    spectrumDiv.id = divElementId + "-spectrum";
    spectrumDiv.style.cssText = "flex:1; min-height:0;";
    root.append(controls, status, timeDiv, spectrumDiv);
    const [frequencyInput, rateInput] = controls.querySelectorAll("input");
    const [frequencyOutput, rateOutput] = controls.querySelectorAll("output");
    return {
        timeDiv,
        spectrumDiv,
        status,
        frequencyInput,
        frequencyOutput,
        rateInput,
        rateOutput,
        filterSelect: controls.querySelector("select"),
        sweepButton: controls.querySelector("button")
    };
}

async function aliasingExplorer(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // An interactive aliasing explorer: sample a sine wave, see the frequency it appears to have, and chart it
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        FastLineRenderableSeries,
        FastImpulseRenderableSeries,
        EllipsePointMarker,
        BoxAnnotation,
        VerticalLineAnnotation,
        LineArrowAnnotation,
        EArrowHeadPosition,
        ECoordinateMode,
        ELabelPlacement,
        ELegendOrientation,
        LegendModifier,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- 1. The maths of sampling ---
    const PHASE = 0.6; // radians. A non-zero start phase, so a tone exactly at the Nyquist frequency isn't sampled as all zeros
    const POINTS = 6000; // points used to draw the "continuous" (analogue) signal

    // Where a tone at frequency f lands after sampling at sampleRate: subtract the nearest whole multiple of the
    // sample rate. The result lies between -sampleRate/2 and +sampleRate/2; its size is the apparent frequency.
    // A negative value means the alias runs "backwards" (its phase is mirrored), like a wagon wheel on film.
    function aliasOf(f, sampleRate) {
        const k = Math.round(f / sampleRate);
        const signed = f - k * sampleRate;
        return { k, signed, apparent: Math.abs(signed) };
    }

    // The gain of an ideal Butterworth low-pass filter of the given order: 1 / sqrt(1 + (f / cutoff)^(2 * order)).
    // It stands in for the analogue anti-aliasing filter in front of an analogue-to-digital converter (ADC).
    function butterworthGain(f, cutoff, order) {
        return 1 / Math.sqrt(1 + Math.pow(f / cutoff, 2 * order));
    }

    // Everything the charts show, for one signal frequency, sample rate and filter setting
    function simulate(f, sampleRate, filterOn) {
        const cutoff = 0.4 * sampleRate; // the filter is designed for this sample rate, as it would be in an ADC
        const amplitude = filterOn ? butterworthGain(f, cutoff, 8) : 1; // (only the gain; a real filter also delays the wave a little)
        const { k, signed, apparent } = aliasOf(f, sampleRate);

        // The analogue signal reaching the ADC: amplitude * sin(2 pi f t + phase)
        const time = [];
        const analogue = [];
        const reconstructed = []; // the lowest-frequency sine through every sample: what an ideal DAC would play back
        for (let i = 0; i <= POINTS; i++) {
            const t = (i / POINTS) * DURATION;
            time.push(t);
            analogue.push(amplitude * Math.sin(2 * Math.PI * f * t + PHASE));
            reconstructed.push(amplitude * Math.sin(2 * Math.PI * signed * t + PHASE));
        }
        // The samples: the same sine, read only at t = n / sampleRate
        const sampleTimes = [];
        const sampleValues = [];
        for (let n = 0; n / sampleRate <= DURATION + 1e-9; n++) {
            sampleTimes.push(n / sampleRate);
            sampleValues.push(amplitude * Math.sin((2 * Math.PI * f * n) / sampleRate + PHASE));
        }

        // The spectrum after sampling repeats every sampleRate: lines at m * sampleRate +/- apparent.
        // The one between 0 and sampleRate/2 is the frequency you measure; the rest are its images.
        const imageFrequencies = [];
        for (let m = 0; m * sampleRate - apparent <= MAX_FREQUENCY; m++) {
            for (const image of [m * sampleRate - apparent, m * sampleRate + apparent]) {
                const isBaseband = Math.abs(image - apparent) < 1e-9;
                const isDuplicate = imageFrequencies.some((x) => Math.abs(x - image) < 1e-9);
                if (image >= 0 && image <= MAX_FREQUENCY && !isBaseband && !isDuplicate) imageFrequencies.push(image);
            }
        }
        imageFrequencies.sort((a, b) => a - b);

        return { cutoff, amplitude, k, signed, apparent, time, analogue, reconstructed, sampleTimes, sampleValues, imageFrequencies };
    }

    // --- 2. Chart 1: the signal in time, its samples, and the wave the samples appear to show ---
    const timeChart = await SciChartSurface.create(ui.timeDiv, { theme: new SciChartJsNavyTheme() });
    const timeSurface = timeChart.sciChartSurface;
    timeSurface.xAxes.add(
        new NumericAxis(timeChart.wasmContext, {
            axisTitle: "Time (s)",
            visibleRange: new NumberRange(0, DURATION),
            growBy: new NumberRange(0.01, 0.01)
        })
    );
    timeSurface.yAxes.add(
        new NumericAxis(timeChart.wasmContext, { axisTitle: "Amplitude", visibleRange: new NumberRange(-1.25, 1.75) }) // headroom for the legend
    );
    const analogueSeries = new XyDataSeries(timeChart.wasmContext, { dataSeriesName: "Analogue signal", dataIsSortedInX: true });
    const sampleSeries = new XyDataSeries(timeChart.wasmContext, { dataSeriesName: "Samples", dataIsSortedInX: true });
    const apparentSeries = new XyDataSeries(timeChart.wasmContext, { dataSeriesName: "What the samples show", dataIsSortedInX: true });
    timeSurface.renderableSeries.add(
        new FastLineRenderableSeries(timeChart.wasmContext, { dataSeries: analogueSeries, stroke: "#50C7E0", strokeThickness: 1.5 }),
        new FastLineRenderableSeries(timeChart.wasmContext, { dataSeries: apparentSeries, stroke: "#F48420", strokeThickness: 3 }),
        // Each sample as a stem and a dot: an impulse (stem) series
        new FastImpulseRenderableSeries(timeChart.wasmContext, {
            dataSeries: sampleSeries,
            fill: "#FFFFFF",
            strokeThickness: 2,
            size: 10,
            pointMarker: new EllipsePointMarker(timeChart.wasmContext)
        })
    );
    // Hover for values, scroll to zoom, drag to pan, double-click to reset
    timeSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true, orientation: ELegendOrientation.Horizontal }),
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- 3. Chart 2: the spectrum, before and after sampling ---
    const spectrumChart = await SciChartSurface.create(ui.spectrumDiv, { theme: new SciChartJsNavyTheme() });
    const spectrumSurface = spectrumChart.sciChartSurface;
    spectrumSurface.xAxes.add(
        new NumericAxis(spectrumChart.wasmContext, {
            axisTitle: "Frequency (Hz)",
            visibleRange: new NumberRange(0, MAX_FREQUENCY),
            growBy: new NumberRange(0.01, 0.03)
        })
    );
    spectrumSurface.yAxes.add(
        new NumericAxis(spectrumChart.wasmContext, { axisTitle: "Amplitude", visibleRange: new NumberRange(0, 1.5) }) // headroom for the legend
    );
    const trueToneSeries = new XyDataSeries(spectrumChart.wasmContext, { dataSeriesName: "True tone" });
    const measuredSeries = new XyDataSeries(spectrumChart.wasmContext, { dataSeriesName: "Measured (0 to fs/2)" });
    const imagesSeries = new XyDataSeries(spectrumChart.wasmContext, { dataSeriesName: "Images (every fs)", dataIsSortedInX: true });
    const filterSeries = new XyDataSeries(spectrumChart.wasmContext, { dataSeriesName: "Filter gain", dataIsSortedInX: true });
    const marker = () => new EllipsePointMarker(spectrumChart.wasmContext);
    spectrumSurface.renderableSeries.add(
        new FastLineRenderableSeries(spectrumChart.wasmContext, {
            dataSeries: filterSeries,
            stroke: "#68BCAE",
            strokeThickness: 2,
            strokeDashArray: [6, 4]
        }),
        new FastImpulseRenderableSeries(spectrumChart.wasmContext, {
            dataSeries: imagesSeries,
            fill: "#F4842066",
            strokeThickness: 2,
            size: 8,
            pointMarker: marker()
        }),
        new FastImpulseRenderableSeries(spectrumChart.wasmContext, {
            dataSeries: trueToneSeries,
            fill: "#50C7E0",
            strokeThickness: 3,
            size: 12,
            pointMarker: marker()
        }),
        new FastImpulseRenderableSeries(spectrumChart.wasmContext, {
            dataSeries: measuredSeries,
            fill: "#F48420",
            strokeThickness: 4,
            size: 14,
            pointMarker: marker()
        })
    );
    // Shade the band you can measure (0 to fs/2), mark the Nyquist frequency and the sample rate,
    // and draw an arrow from the true tone to where it lands
    const nyquistBand = new BoxAnnotation({
        x1: 0,
        x2: 5,
        y1: 0,
        y2: 1,
        yCoordinateMode: ECoordinateMode.Relative,
        fill: "#50C7E018",
        strokeThickness: 0
    });
    const nyquistLine = new VerticalLineAnnotation({
        x1: 5,
        stroke: "#FFFFFFAA",
        strokeDashArray: [6, 4],
        showLabel: true,
        labelPlacement: ELabelPlacement.Axis, // the label sits on the frequency axis
        axisLabelFill: "#50C7E0"
    });
    const sampleRateLine = new VerticalLineAnnotation({
        x1: 10,
        stroke: "#FFFFFF55",
        strokeDashArray: [2, 4],
        showLabel: true,
        labelPlacement: ELabelPlacement.Axis,
        axisLabelFill: "#FFFFFF88"
    });
    const foldArrow = new LineArrowAnnotation({
        x1: 9,
        x2: 1,
        y1: 1.12,
        y2: 1.12,
        stroke: "#F48420",
        strokeThickness: 2,
        arrowHeadPosition: EArrowHeadPosition.End,
        arrowStyle: { headLength: 12, headWidth: 10, fill: "#F48420", stroke: "#F48420" }
    });
    spectrumSurface.annotations.add(nyquistBand, nyquistLine, sampleRateLine, foldArrow);
    spectrumSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true, orientation: ELegendOrientation.Horizontal }),
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- 4. Redraw both charts whenever a control changes ---
    function update() {
        const f = Number(ui.frequencyInput.value);
        const sampleRate = Number(ui.rateInput.value);
        const filterOn = ui.filterSelect.value === "on";
        const result = simulate(f, sampleRate, filterOn);
        const nyquist = sampleRate / 2;

        analogueSeries.clear();
        analogueSeries.appendRange(result.time, result.analogue);
        sampleSeries.clear();
        sampleSeries.appendRange(result.sampleTimes, result.sampleValues);
        apparentSeries.clear();
        apparentSeries.appendRange(result.time, result.reconstructed);

        trueToneSeries.clear();
        trueToneSeries.append(f, result.amplitude);
        measuredSeries.clear();
        measuredSeries.append(result.apparent, result.amplitude);
        imagesSeries.clear();
        imagesSeries.appendRange(
            result.imageFrequencies,
            result.imageFrequencies.map(() => result.amplitude)
        );
        filterSeries.clear();
        if (filterOn) {
            const frequencies = Array.from({ length: 601 }, (_, i) => (i / 600) * MAX_FREQUENCY);
            filterSeries.appendRange(
                frequencies,
                frequencies.map((x) => butterworthGain(x, result.cutoff, 8))
            );
        }

        nyquistBand.x2 = nyquist;
        nyquistLine.x1 = nyquist;
        nyquistLine.labelValue = "fs/2"; // the Nyquist frequency
        sampleRateLine.x1 = sampleRate;
        sampleRateLine.labelValue = "fs";
        const aliased = Math.abs(f - result.apparent) > 1e-9;
        foldArrow.isHidden = !aliased;
        foldArrow.x1 = f;
        foldArrow.x2 = result.apparent;

        // The readout under the controls
        ui.frequencyOutput.textContent = `${f.toFixed(1)} Hz`;
        ui.frequencyInput.setAttribute("aria-valuetext", `${f.toFixed(1)} hertz`);
        ui.rateOutput.textContent = `${sampleRate} Hz`;
        ui.rateInput.setAttribute("aria-valuetext", `${sampleRate} samples per second`);
        let text =
            `True frequency ${f.toFixed(1)} Hz · apparent frequency ${result.apparent.toFixed(1)} Hz · ` +
            `Nyquist frequency ${nyquist} Hz (fs/2). `;
        if (!aliased) text += `Below the Nyquist frequency: no aliasing (this tone needs fs > ${(2 * f).toFixed(1)} Hz).`;
        else text += `Aliased: |${f.toFixed(1)} − ${result.k} × ${sampleRate}| = ${result.apparent.toFixed(1)} Hz.`;
        if (filterOn) {
            const db = 20 * Math.log10(result.amplitude);
            text += ` The filter leaves ${(100 * result.amplitude).toPrecision(2)}% of the tone (${db.toFixed(0).replace("-", "−")} dB).`;
        }
        ui.status.textContent = text;
    }

    // "Sweep the frequency" raises the signal frequency from 0.5 Hz to 2.5 times the sample rate, so you can watch
    // the apparent frequency rise to fs/2, fall to zero at fs, and rise again
    let sweepTimer; // the timer while a sweep is running
    function stopSweep() {
        clearInterval(sweepTimer);
        sweepTimer = undefined;
        ui.sweepButton.textContent = "Sweep the frequency";
    }
    function startSweep() {
        const end = Math.min(MAX_FREQUENCY, 2.5 * Number(ui.rateInput.value));
        let f = 0.5;
        ui.sweepButton.textContent = "Stop";
        sweepTimer = setInterval(() => {
            f += end / 250; // about 10 seconds from start to end
            if (f > end) return stopSweep();
            ui.frequencyInput.value = String(f);
            update();
        }, 40);
    }
    ui.sweepButton.addEventListener("click", () => (sweepTimer ? stopSweep() : startSweep()));
    timeSurface.addDeletable({ delete: stopSweep }); // stop the timer if the chart is deleted

    ui.frequencyInput.addEventListener("input", () => {
        stopSweep();
        update();
    });
    ui.rateInput.addEventListener("input", update);
    ui.filterSelect.addEventListener("change", update);
    update();
    // #region_A_end
}

aliasingExplorer("scichart-root");
