import * as SciChart from "scichart";

// The controls and the two charts each need an element. This splits the page's div into a control bar,
// a magnitude chart and a phase chart; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const bar = document.createElement("div");
    bar.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    bar.innerHTML =
        `<label>System <select style="font:inherit">` +
        `<option value="low-pass-1">1st-order low-pass (RC)</option>` +
        `<option value="high-pass-1">1st-order high-pass</option>` +
        `<option value="low-pass-2" selected>2nd-order low-pass</option>` +
        `<option value="band-pass">Band-pass</option>` +
        `<option value="notch">Notch (band-stop)</option>` +
        `<option value="lead">Zero and pole (lead network)</option>` +
        `<option value="loop">Control loop: 3 poles and gain K</option></select></label>` +
        `<label>Corner <input type="range" min="0" max="100" step="0.1" value="66.7" ` +
        `style="vertical-align:middle; width:140px"> <output></output></label>` +
        `<label><span></span> <input type="range" min="0" max="100" step="0.1" ` +
        `style="vertical-align:middle; width:140px"> <output></output></label>` +
        `<span aria-live="polite" style="color:#c8d3e8"></span>`;
    const magnitudeDiv = document.createElement("div");
    magnitudeDiv.id = divElementId + "-magnitude";
    magnitudeDiv.style.cssText = "flex:1; min-height:0;";
    const phaseDiv = document.createElement("div");
    phaseDiv.id = divElementId + "-phase";
    phaseDiv.style.cssText = "flex:1; min-height:0;";
    root.append(bar, magnitudeDiv, phaseDiv);
    const [cornerLabel, shapeLabel] = bar.querySelectorAll("label:not(:first-child)");
    return {
        magnitudeDiv,
        phaseDiv,
        systemSelect: bar.querySelector("select"),
        cornerInput: cornerLabel.querySelector("input"),
        cornerOutput: cornerLabel.querySelector("output"),
        shapeName: shapeLabel.querySelector("span"),
        shapeInput: shapeLabel.querySelector("input"),
        shapeOutput: shapeLabel.querySelector("output"),
        summary: bar.querySelector(":scope > span")
    };
}

async function bodePlotChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // An interactive Bode plot generator: magnitude and phase of a system on a shared log frequency axis
    const {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        XyDataSeries,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        VerticalLineAnnotation,
        HorizontalLineAnnotation,
        ELabelPlacement,
        ENumericFormat,
        EXyDirection,
        LegendModifier,
        ELegendPlacement,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- 1. A system is a product of standard factors, H(f) = factor1 × factor2 × ... ---
    // Each factor works on x = f / (its corner frequency), with s = j x:
    //   gain k        a constant
    //   s^n           (j x)^n: a differentiator (n = 1) or integrator (n = -1), 0 dB at its corner
    //   zero1, pole1  (1 + j x) and 1 / (1 + j x): a real zero or pole
    //   zero2, pole2  (1 - x² + j 2ζ x) and its inverse: a pair of complex zeros or poles with damping ratio ζ
    // On a Bode plot, multiplying factors means adding their dB and their degrees. Adding the phases of the
    // factors (rather than taking the angle of the product) also gives a phase that never wraps at ±180°.
    const toDegrees = (radians) => (radians * 180) / Math.PI;

    // The exact gain (dB) and phase (degrees) of one factor at frequency f
    function factorExact(factor, f) {
        const x = f / factor.f;
        switch (factor.type) {
            case "gain":
                return { db: 20 * Math.log10(factor.k), deg: 0 };
            case "s":
                return { db: 20 * factor.n * Math.log10(x), deg: 90 * factor.n };
            case "zero1":
                return { db: 10 * Math.log10(1 + x * x), deg: toDegrees(Math.atan(x)) };
            case "pole1":
                return { db: -10 * Math.log10(1 + x * x), deg: -toDegrees(Math.atan(x)) };
            default: {
                // zero2 or pole2: the complex number 1 - x² + j 2ζx
                const re = 1 - x * x;
                const im = 2 * factor.zeta * x;
                const sign = factor.type === "zero2" ? 1 : -1;
                return {
                    db: sign * 10 * Math.log10(Math.max(re * re + im * im, 1e-12)), // floor where a notch reaches zero
                    deg: sign * toDegrees(Math.atan2(im, re))
                };
            }
        }
    }

    // The straight-line (asymptotic) approximation of the same factor, the one you draw by hand:
    // flat up to the corner then ±20 dB per decade for a real pole or zero, ±40 dB per decade for a pair.
    // Phase: a real pole or zero ramps by ±90° from a decade below the corner to a decade above it;
    // a pair ramps by ±180° over 10^-ζ to 10^+ζ times the corner (a sudden step when ζ = 0).
    function factorAsymptote(factor, f) {
        const decades = Math.log10(f / factor.f); // how many decades above the corner
        const ramp = (from, to) => (from === to ? (decades < 0 ? 0 : 1) : Math.min(1, Math.max(0, (decades - from) / (to - from))));
        switch (factor.type) {
            case "gain":
                return { db: 20 * Math.log10(factor.k), deg: 0 };
            case "s":
                return { db: 20 * factor.n * decades, deg: 90 * factor.n };
            case "zero1":
                return { db: Math.max(0, 20 * decades), deg: 90 * ramp(-1, 1) };
            case "pole1":
                return { db: Math.min(0, -20 * decades), deg: -90 * ramp(-1, 1) };
            case "zero2":
                return { db: Math.max(0, 40 * decades), deg: 180 * ramp(-factor.zeta, factor.zeta) };
            default: // pole2
                return { db: Math.min(0, -40 * decades), deg: -180 * ramp(-factor.zeta, factor.zeta) };
        }
    }

    // Add up the factors at every frequency
    function bode(factors, frequencies, factorFunction) {
        const db = [];
        const deg = [];
        for (const f of frequencies) {
            let sumDb = 0;
            let sumDeg = 0;
            for (const factor of factors) {
                const r = factorFunction(factor, f);
                sumDb += r.db;
                sumDeg += r.deg;
            }
            db.push(sumDb);
            deg.push(sumDeg);
        }
        return { db, deg };
    }

    // The frequencies where values cross a target level, interpolated on the log frequency scale
    function crossings(frequencies, values, target) {
        const found = [];
        for (let i = 1; i < values.length; i++) {
            const a = values[i - 1] - target;
            const b = values[i] - target;
            if (a === 0 || a * b < 0) {
                const t = a === 0 ? 0 : a / (a - b);
                found.push(frequencies[i - 1] * Math.pow(frequencies[i] / frequencies[i - 1], t));
            }
        }
        return found;
    }
    const valueAt = (factors, f) => bode(factors, [f], factorExact);

    // The systems in the menu. fc is the corner (or natural) frequency in Hz; shape is ζ, or K for the loop.
    const systems = {
        "low-pass-1": { shape: null, factors: (fc) => [{ type: "pole1", f: fc }] },
        "high-pass-1": {
            shape: null,
            factors: (fc) => [
                { type: "s", n: 1, f: fc },
                { type: "pole1", f: fc }
            ]
        },
        "low-pass-2": { shape: "zeta", factors: (fc, zeta) => [{ type: "pole2", f: fc, zeta }] },
        "band-pass": {
            shape: "zeta",
            factors: (fc, zeta) => [
                { type: "gain", k: 2 * zeta }, // scales the peak to exactly 0 dB at fc
                { type: "s", n: 1, f: fc },
                { type: "pole2", f: fc, zeta }
            ]
        },
        notch: {
            shape: "zeta",
            factors: (fc, zeta) => [
                { type: "zero2", f: fc, zeta: 0 },
                { type: "pole2", f: fc, zeta }
            ]
        },
        lead: {
            shape: null,
            factors: (fc) => [
                { type: "zero1", f: fc },
                { type: "pole1", f: 10 * fc }
            ]
        },
        loop: {
            shape: "gain",
            factors: (fc, k) => [
                { type: "gain", k },
                { type: "pole1", f: fc },
                { type: "pole1", f: fc },
                { type: "pole1", f: fc }
            ]
        }
    };

    // 1,000 frequencies from 1 Hz to 1 MHz, evenly spaced on a log scale (six decades)
    const frequencies = Array.from({ length: 1000 }, (_, i) => Math.pow(10, (6 * i) / 999));

    // --- 2. Two charts, magnitude above phase, with the same logarithmic frequency axis ---
    const theme = new SciChartJsNavyTheme();
    const magnitudeChart = await SciChartSurface.create(ui.magnitudeDiv, { theme });
    const phaseChart = await SciChartSurface.create(ui.phaseDiv, { theme });
    const frequencyAxisOptions = {
        logBase: 10,
        labelFormat: ENumericFormat.Engineering, // 1, 10, 100, 1K, 10K ...
        autoTicks: false, // a labelled gridline every decade, and minor gridlines between
        majorDelta: 1,
        minorDelta: 1,
        visibleRange: new NumberRange(1, 1e6),
        cursorLabelFormat: ENumericFormat.Engineering,
        cursorLabelPrecision: 3
    };
    const magnitudeXAxis = new LogarithmicAxis(magnitudeChart.wasmContext, { ...frequencyAxisOptions, drawLabels: false });
    const phaseXAxis = new LogarithmicAxis(phaseChart.wasmContext, { ...frequencyAxisOptions, axisTitle: "Frequency (Hz)" });
    magnitudeChart.sciChartSurface.xAxes.add(magnitudeXAxis);
    phaseChart.sciChartSurface.xAxes.add(phaseXAxis);
    magnitudeChart.sciChartSurface.yAxes.add(
        new NumericAxis(magnitudeChart.wasmContext, {
            axisTitle: "Magnitude (dB)",
            visibleRange: new NumberRange(-80, 40),
            labelPrecision: 0,
            cursorLabelPrecision: 1 // tooltips show one decimal place
        })
    );
    const phaseYAxis = new NumericAxis(phaseChart.wasmContext, {
        axisTitle: "Phase (°)",
        labelPrecision: 0,
        cursorLabelPrecision: 1,
        autoTicks: false,
        majorDelta: 45,
        minorDelta: 15
    });
    phaseChart.sciChartSurface.yAxes.add(phaseYAxis);

    // Keep the two frequency axes in step when either chart is zoomed or panned,
    // and give both charts the same y axis width, so their frequencies line up
    magnitudeXAxis.visibleRangeChanged.subscribe((args) => (phaseXAxis.visibleRange = args.visibleRange));
    phaseXAxis.visibleRangeChanged.subscribe((args) => (magnitudeXAxis.visibleRange = args.visibleRange));
    const verticalGroup = new SciChartVerticalGroup();
    verticalGroup.addSurfaceToGroup(magnitudeChart.sciChartSurface);
    verticalGroup.addSurfaceToGroup(phaseChart.sciChartSurface);

    // On each chart: the exact response, the straight-line asymptotes, and markers for the key points
    function addSeries(chart, name) {
        const exact = new XyDataSeries(chart.wasmContext, { dataSeriesName: name });
        const asymptote = new XyDataSeries(chart.wasmContext, { dataSeriesName: "Straight-line asymptotes" });
        const points = new XyDataSeries(chart.wasmContext, { dataSeriesName: "Key points" });
        chart.sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(chart.wasmContext, { dataSeries: exact, stroke: "#50C7E0", strokeThickness: 3 }),
            new FastLineRenderableSeries(chart.wasmContext, {
                dataSeries: asymptote,
                stroke: "#F48420",
                strokeThickness: 2,
                strokeDashArray: [8, 5]
            }),
            new XyScatterRenderableSeries(chart.wasmContext, {
                dataSeries: points,
                pointMarker: new EllipsePointMarker(chart.wasmContext, {
                    width: 11,
                    height: 11,
                    fill: "#FFFFFF",
                    stroke: "#F48420",
                    strokeThickness: 2
                })
            })
        );
        return { exact, asymptote, points };
    }
    const magnitude = addSeries(magnitudeChart, "Exact magnitude");
    const phase = addSeries(phaseChart, "Exact phase");

    // Mark the corner frequency on both charts, -3 dB and 0 dB on the magnitude chart, and -180° on the phase chart
    const cornerLines = [magnitudeChart, phaseChart].map((chart) => {
        const line = new VerticalLineAnnotation({
            x1: 1000,
            stroke: "#FFFFFF88",
            strokeDashArray: [2, 4],
            showLabel: chart === magnitudeChart,
            labelPlacement: ELabelPlacement.TopRight
        });
        chart.sciChartSurface.annotations.add(line);
        return line;
    });
    const minus3dB = new HorizontalLineAnnotation({
        y1: -3,
        stroke: "#FFFFFF66",
        strokeDashArray: [2, 4],
        showLabel: true,
        labelValue: "-3 dB",
        labelPlacement: ELabelPlacement.BottomRight
    });
    const zeroDb = new HorizontalLineAnnotation({ y1: 0, stroke: "#FFFFFF66", strokeDashArray: [2, 4] });
    const minus180 = new HorizontalLineAnnotation({
        y1: -180,
        stroke: "#FFFFFF66",
        strokeDashArray: [2, 4],
        showLabel: true,
        labelValue: "-180°",
        labelPlacement: ELabelPlacement.TopLeft
    });
    magnitudeChart.sciChartSurface.annotations.add(minus3dB, zeroDb);
    phaseChart.sciChartSurface.annotations.add(minus180);

    // Hover for values on both charts at once, scroll to zoom the frequency axis, drag to pan, double-click to reset
    for (const chart of [magnitudeChart, phaseChart]) {
        chart.sciChartSurface.chartModifiers.add(
            new CursorModifier({ modifierGroup: "bode", showTooltip: true, showAxisLabels: false }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
    }
    magnitudeChart.sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true, placement: ELegendPlacement.TopLeft })
    );

    // --- 3. Recalculate and redraw whenever a control changes ---
    // The corner slider runs from 10 Hz to 10 kHz on a log scale; ζ from 0.05 to 1.5; K from 1 to 20
    const sliderToCorner = (value) => 10 * Math.pow(1000, value / 100);
    const shapes = {
        zeta: { name: "Damping ζ", from: 0.05, to: 1.5, start: 0.2 },
        gain: { name: "Loop gain K", from: 1, to: 20, start: 4 }
    };
    const sliderToShape = (shape, value) => shape.from * Math.pow(shape.to / shape.from, value / 100);
    const shapeToSlider = (shape, x) => (100 * Math.log(x / shape.from)) / Math.log(shape.to / shape.from);
    const hz = (f) => (f >= 1000 ? `${(f / 1000).toPrecision(3)} kHz` : `${f.toPrecision(3)} Hz`);

    function setUpShapeSlider() {
        const shape = shapes[systems[ui.systemSelect.value].shape];
        ui.shapeInput.disabled = !shape;
        ui.shapeInput.parentElement.style.opacity = shape ? "1" : "0.4";
        ui.shapeName.textContent = shape ? shape.name : "Damping ζ";
        if (shape) ui.shapeInput.value = shapeToSlider(shape, shape.start).toFixed(1);
    }

    function update() {
        const name = ui.systemSelect.value;
        const system = systems[name];
        const fc = sliderToCorner(Number(ui.cornerInput.value));
        const shape = shapes[system.shape];
        const shapeValue = shape ? sliderToShape(shape, Number(ui.shapeInput.value)) : 0;
        const factors = system.factors(fc, shapeValue);

        // Add the corner itself, so the curve passes exactly through it (and a notch reaches its true depth)
        const fs = frequencies.filter((f) => f !== fc).concat(fc).sort((a, b) => a - b);
        const exact = bode(factors, fs, factorExact);
        const asymptote = bode(factors, fs, factorAsymptote);
        magnitude.exact.clear();
        magnitude.exact.appendRange(fs, exact.db);
        magnitude.asymptote.clear();
        magnitude.asymptote.appendRange(fs, asymptote.db);
        phase.exact.clear();
        phase.exact.appendRange(fs, exact.deg);
        phase.asymptote.clear();
        phase.asymptote.appendRange(fs, asymptote.deg);

        // Fit the phase axis to the curves, in steps of 45°
        const allPhases = exact.deg.concat(asymptote.deg);
        const low = Math.floor(Math.min(...allPhases) / 45) * 45 - 15;
        const high = Math.ceil(Math.max(...allPhases) / 45) * 45 + 15;
        phaseYAxis.visibleRange = new NumberRange(low, high);

        // The key points and the summary line
        let points = [];
        let text = "";
        if (name === "loop") {
            // Gain margin: how far below 0 dB the gain is where the phase reaches -180°.
            // Phase margin: how far above -180° the phase is where the gain crosses 0 dB.
            const gainCrossover = crossings(fs, exact.db, 0)[0];
            const phaseCrossover = crossings(fs, exact.deg, -180)[0];
            points = [gainCrossover, phaseCrossover].filter((f) => f !== undefined);
            const gainMargin = phaseCrossover === undefined ? Infinity : -valueAt(factors, phaseCrossover).db[0];
            const phaseMargin = gainCrossover === undefined ? Infinity : 180 + valueAt(factors, gainCrossover).deg[0];
            text =
                `gain margin ${gainMargin.toFixed(1)} dB · phase margin ${phaseMargin.toFixed(1)}°` +
                (gainMargin > 0 && phaseMargin > 0 ? " · stable when the loop is closed" : " · unstable when the loop is closed");
        } else if (name === "lead") {
            const fMax = Math.sqrt(10) * fc; // the most phase lead is midway between the zero and the pole
            points = [fMax];
            text = `zero at ${hz(fc)}, pole at ${hz(10 * fc)} · most phase lead ${valueAt(factors, fMax).deg[0].toFixed(1)}° at ${hz(fMax)}`;
        } else {
            points = crossings(fs, exact.db, -3.0103); // the -3 dB (half-power) points
            const at = points.map((f) => `${hz(f)} (${valueAt(factors, f).deg[0].toFixed(1)}°)`);
            text = `-3 dB at ${at.join(" and ")}`;
            if (points.length === 2) text += ` · bandwidth ${hz(points[1] - points[0])}`;
            if (name === "low-pass-2") {
                const peak = Math.max(...exact.db);
                text += ` · Q = ${(1 / (2 * shapeValue)).toFixed(2)}` + (peak > 0.05 ? ` · peak +${peak.toFixed(1)} dB` : "");
            }
        }
        const pointValues = bode(factors, points, factorExact);
        magnitude.points.clear();
        magnitude.points.appendRange(points, pointValues.db);
        phase.points.clear();
        phase.points.appendRange(points, pointValues.deg);
        ui.summary.textContent = text;

        // Annotations for this system
        for (const line of cornerLines) {
            line.x1 = fc;
            line.labelValue = `corner ${hz(fc)}`;
        }
        minus3dB.isHidden = name === "loop" || name === "lead";
        zeroDb.isHidden = name !== "loop";
        minus180.isHidden = name !== "loop";

        ui.cornerOutput.textContent = hz(fc);
        ui.cornerInput.setAttribute("aria-valuetext", hz(fc).replace("Hz", "hertz"));
        ui.shapeOutput.textContent = !shape ? "-" : system.shape === "zeta" ? `${shapeValue.toFixed(2)} (Q = ${(1 / (2 * shapeValue)).toFixed(2)})` : shapeValue.toFixed(1);
    }

    ui.systemSelect.addEventListener("change", () => {
        setUpShapeSlider();
        update();
    });
    ui.cornerInput.addEventListener("input", update);
    ui.shapeInput.addEventListener("input", update);
    setUpShapeSlider();
    update();
    // #region_A_end
}

bodePlotChart("scichart-root");
