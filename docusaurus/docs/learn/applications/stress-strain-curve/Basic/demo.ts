import * as SciChart from "scichart";

// Typical room-temperature tensile properties (stress in MPa). Real values vary with grade, heat treatment,
// specimen and test speed; these are typical handbook figures, used to simulate the curves below.
const MATERIALS = {
    steel: {
        label: "Mild steel (1020, hot rolled)",
        shape: "yield-point", // upper and lower yield point, then a flat yield plateau
        E: 207000,
        upperYield: 228,
        yieldStrength: 210,
        plateauEnd: 0.015, // strain where the yield plateau ends and strain hardening starts
        uts: 380,
        uniformStrain: 0.17, // strain at the ultimate tensile strength, where necking starts
        fractureStrain: 0.25,
        fractureStress: 300,
        noise: 0.6,
        zoomStrain: 1.0 // % strain shown in the "start of the curve" chart
    },
    aluminium: {
        label: "Aluminium alloy 6061-T6",
        shape: "rounded", // no yield point: the curve bends smoothly away from the straight line
        E: 69000,
        yieldStrength: 276,
        uts: 310,
        uniformStrain: 0.08,
        fractureStrain: 0.12,
        fractureStress: 270,
        noise: 0.5,
        zoomStrain: 1.2
    },
    castIron: {
        label: "Grey cast iron (class 30)",
        shape: "brittle", // curved from the start, breaks with almost no plastic strain
        E: 90000, // initial slope
        uts: 207,
        fractureStrain: 0.0046,
        noise: 0.4,
        zoomStrain: 0.6
    },
    polycarbonate: {
        label: "Polycarbonate",
        shape: "polymer", // yield peak, a drop as the neck forms, cold drawing, then hardening to break
        E: 2380,
        yieldStrength: 62,
        yieldStrain: 0.06,
        drawStress: 50,
        drawEnd: 0.85,
        uts: 66,
        fractureStrain: 1.1,
        noise: 0.15,
        zoomStrain: 12
    }
};

// Sample data: a simulated tensile test, engineering stress against engineering strain, with a little load-cell
// noise from a seeded random generator. Strain points are closer together at the start, as a test machine slows
// down through the elastic region.
function simulateTensileTest(m) {
    let seed = 1020;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    const smoothStep = (u) => u * u * (3 - 2 * u);

    // Aluminium: Ramberg-Osgood, strain = stress / E + 0.002 (stress / yield)^n, with n set so the curve reaches
    // the UTS at the uniform strain. Solved for stress by bisection.
    const n = m.shape === "rounded"
        ? Math.log((m.uniformStrain - m.uts / m.E) / 0.002) / Math.log(m.uts / m.yieldStrength)
        : 0;
    const rambergOsgood = (strain) => {
        let lo = 0;
        let hi = m.uts * 1.5;
        for (let k = 0; k < 60; k++) {
            const mid = (lo + hi) / 2;
            if (mid / m.E + 0.002 * Math.pow(mid / m.yieldStrength, n) < strain) lo = mid;
            else hi = mid;
        }
        return lo;
    };
    // Grey cast iron: stress = A (1 - exp(-strain / e0)), with initial slope A / e0 = E, through (fracture strain, UTS)
    let castA = m.uts;
    if (m.shape === "brittle") {
        for (let k = 0; k < 60; k++) castA = m.uts / (1 - Math.exp(-(m.fractureStrain * m.E) / castA));
    }
    // After the UTS the engineering stress falls as the neck thins, until the specimen breaks
    const necking = (strain) => {
        const u = (strain - m.uniformStrain) / (m.fractureStrain - m.uniformStrain);
        return m.uts - (m.uts - m.fractureStress) * u * u;
    };

    const stressAt = (e) => {
        switch (m.shape) {
            case "yield-point": {
                const eUpper = m.upperYield / m.E;
                if (e <= eUpper) return m.E * e;
                if (e <= eUpper + 0.0005) return m.upperYield - (m.upperYield - m.yieldStrength) * smoothStep((e - eUpper) / 0.0005);
                if (e <= m.plateauEnd) return m.yieldStrength + 2.5 * Math.sin(e * 2600); // small serrations as the yield band moves
                if (e <= m.uniformStrain) {
                    const u = (e - m.plateauEnd) / (m.uniformStrain - m.plateauEnd);
                    return m.yieldStrength + (m.uts - m.yieldStrength) * (1 - Math.pow(1 - u, 2.2));
                }
                return necking(e);
            }
            case "rounded":
                return e <= m.uniformStrain ? rambergOsgood(e) : necking(e);
            case "brittle":
                return castA * (1 - Math.exp(-(e * m.E) / castA));
            default: {
                // polymer
                if (e <= m.yieldStrain) {
                    const u = e / m.yieldStrain;
                    const a = (m.E * m.yieldStrain) / m.yieldStrength; // slope at the origin is E
                    return m.yieldStrength * (a * u + (3 - 2 * a) * u * u + (a - 2) * u * u * u);
                }
                if (e <= 2 * m.yieldStrain) return m.yieldStrength - (m.yieldStrength - m.drawStress) * smoothStep((e - m.yieldStrain) / m.yieldStrain);
                if (e <= m.drawEnd) return m.drawStress + 2 * ((e - 2 * m.yieldStrain) / (m.drawEnd - 2 * m.yieldStrain));
                const u = (e - m.drawEnd) / (m.fractureStrain - m.drawEnd);
                return m.drawStress + 2 + (m.uts - m.drawStress - 2) * u * u;
            }
        }
    };

    const count = 2500;
    const strain = [];
    const stress = [];
    for (let i = 0; i <= count; i++) {
        const e = m.fractureStrain * Math.pow(i / count, 2);
        strain.push(e);
        stress.push(i === 0 ? 0 : stressAt(e) + m.noise * gaussian());
    }
    // The break: the load falls to zero
    strain.push(m.fractureStrain);
    stress.push(0);
    // Necking starts at the first load maximum: the UTS for metals, the yield peak for polycarbonate
    const neckingStrain = m.shape === "polymer" ? m.yieldStrain : m.shape === "brittle" ? m.fractureStrain : m.uniformStrain;
    return { strain, stress, neckingStrain };
}

// The controls, the readout and the two charts each need an element. This splits the page's div into them;
// in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Material <select data-id="material" style="font:inherit">` +
        Object.entries(MATERIALS).map(([key, m]) => `<option value="${key}">${m.label}</option>`).join("") +
        `</select></label>` +
        `<label>Curve <select data-id="curve" style="font:inherit">` +
        `<option value="engineering">Engineering</option><option value="true">True</option>` +
        `<option value="both">Both</option></select></label>` +
        `<label><input data-id="offset" type="checkbox" checked> 0.2% offset construction</label>` +
        `<label><input data-id="areas" type="checkbox"> Shade resilience and toughness</label>` +
        `<button data-id="run" type="button" style="font:inherit; padding:2px 12px; cursor:pointer">Run test</button>`;
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:2px 12px 6px; color:#c8d3e8; font-size:13px;" + font;
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const mainDiv = document.createElement("div");
    mainDiv.id = divElementId + "-main";
    mainDiv.style.cssText = "flex:2 1 460px; min-height:300px;";
    const zoomDiv = document.createElement("div");
    zoomDiv.id = divElementId + "-zoom";
    zoomDiv.style.cssText = "flex:1 1 260px; min-height:300px;";
    body.append(mainDiv, zoomDiv);
    root.append(bar, readout, body);
    const get = (selector) => bar.querySelector(selector);
    return {
        mainDiv,
        zoomDiv,
        readout,
        materialSelect: get('select[data-id="material"]'),
        curveSelect: get('select[data-id="curve"]'),
        offsetCheckbox: get('input[data-id="offset"]'),
        areasCheckbox: get('input[data-id="areas"]'),
        runButton: get('button[data-id="run"]')
    };
}

async function stressStrainCurve(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Read Young's modulus, yield strength (0.2% offset), UTS and elongation from a tensile test, and chart it with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        FastLineRenderableSeries,
        FastMountainRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        TextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        SciChartJsNavyTheme,
        LegendModifier,
        ELegendPlacement,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Tensile test analysis (plain JavaScript, no library needed). Strain is a fraction, stress in MPa ---

    // Young's modulus: the slope of a least-squares straight line through the points in the fitting range
    function fitModulus(strain, stress, inFitRange) {
        let n = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
        for (let i = 0; i < strain.length; i++) {
            if (!inFitRange(strain[i], stress[i]) || strain[i] > 0.05) continue;
            n++;
            sx += strain[i];
            sy += stress[i];
            sxx += strain[i] * strain[i];
            sxy += strain[i] * stress[i];
        }
        const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
        return { E: slope, intercept: (sy - slope * sx) / n };
    }

    // 0.2% offset yield strength: where the curve meets a line of slope E shifted 0.002 along the strain axis
    function offsetYield(strain, stress, fit, offset = 0.002) {
        const shift = offset - fit.intercept / fit.E; // the elastic line starts where the fitted line crosses zero stress
        const gap = (i) => stress[i] - fit.E * (strain[i] - shift);
        for (let i = 1; i < strain.length; i++) {
            if (strain[i] > shift && gap(i) <= 0 && gap(i - 1) > 0) {
                const t = gap(i - 1) / (gap(i - 1) - gap(i));
                return { strain: strain[i - 1] + t * (strain[i] - strain[i - 1]), stress: stress[i - 1] + t * (stress[i] - stress[i - 1]), shift };
            }
        }
        return null; // broke before yielding
    }

    // Area under the curve (trapezium rule) up to a strain. MPa x strain = MJ/m³
    function areaUnder(strain, stress, upTo) {
        let area = 0;
        for (let i = 1; i < strain.length && strain[i - 1] < upTo; i++) {
            const e1 = Math.min(strain[i], upTo);
            const s1 = stress[i - 1] + ((stress[i] - stress[i - 1]) * (e1 - strain[i - 1])) / (strain[i] - strain[i - 1] || 1);
            area += ((stress[i - 1] + s1) / 2) * (e1 - strain[i - 1]);
        }
        return area;
    }

    // True stress and strain, valid while the specimen stretches evenly (up to the start of necking)
    function toTrue(strain, stress, upTo) {
        const e = [];
        const s = [];
        for (let i = 0; i < strain.length - 1 && strain[i] <= upTo; i++) { // the last point is the break
            e.push(Math.log(1 + strain[i]));
            s.push(stress[i] * (1 + strain[i]));
        }
        return { strain: e, stress: s };
    }

    // --- Two charts: the whole curve, and the start of the curve, where the modulus and yield are read ---
    async function createChart(div, title) {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(div, {
            theme: new SciChartJsNavyTheme(),
            title,
            titleStyle: { fontSize: 15 }
        });
        const xAxis = new NumericAxis(wasmContext, { axisTitle: "Strain (%)", labelPrecision: 1 });
        const yAxis = new NumericAxis(wasmContext, { axisTitle: "Stress (MPa)", autoRange: EAutoRange.Always, growBy: new NumberRange(0, 0.12), labelPrecision: 0 });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);
        const add = (series) => series; // added to the chart in draw(), when shown
        const data = (name) => new XyDataSeries(wasmContext, { dataSeriesName: name });
        const series = {
            toughness: add(new FastMountainRenderableSeries(wasmContext, { dataSeries: data("Toughness (area to fracture)"), fill: "#50C7E044", stroke: "#50C7E088", strokeThickness: 1 })),
            resilience: add(new FastMountainRenderableSeries(wasmContext, { dataSeries: data("Resilience (elastic energy to yield)"), fill: "#F48420AA", stroke: "#F48420", strokeThickness: 1 })),
            engineering: add(new FastLineRenderableSeries(wasmContext, { dataSeries: data("Engineering stress-strain"), stroke: "#50C7E0", strokeThickness: 2.5 })),
            trueCurve: add(new FastLineRenderableSeries(wasmContext, { dataSeries: data("True stress-strain (to necking)"), stroke: "#F5E663", strokeThickness: 2.5 })),
            offsetLine: add(new FastLineRenderableSeries(wasmContext, { dataSeries: data("0.2% offset line"), stroke: "#EC0F6C", strokeThickness: 2, strokeDashArray: [6, 4] })),
            points: add(new XyScatterRenderableSeries(wasmContext, {
                dataSeries: data("Yield, UTS and fracture"),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "#FFFFFF", stroke: "#EC0F6C", strokeThickness: 2 })
            }))
        };
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true, showAxisLabels: false }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface, xAxis, yAxis, series, shown: "" };
    }

    // Show only the series that are switched on, so the legend lists just those. Re-adding in a fixed order keeps
    // the shaded areas behind the lines.
    function showSeries(chart, visible) {
        const key = Object.keys(chart.series).filter((name) => visible[name]).join();
        if (key === chart.shown) return;
        chart.shown = key;
        chart.sciChartSurface.renderableSeries.clear(false);
        for (const name of Object.keys(chart.series)) if (visible[name]) chart.sciChartSurface.renderableSeries.add(chart.series[name]);
    }
    const main = await createChart(ui.mainDiv, "Tensile test");
    const zoom = await createChart(ui.zoomDiv, "Start of the curve");
    zoom.yAxis.autoRange = EAutoRange.Never; // its range is set in draw(), from the part of the curve it shows
    main.sciChartSurface.chartModifiers.add(
        new LegendModifier({ placement: ELegendPlacement.BottomRight, showCheckboxes: false, backgroundColor: "#14233CCC" })
    );

    const setData = (series, xs, ys) => {
        series.dataSeries.clear();
        series.dataSeries.appendRange(xs.map((v) => v * 100), ys); // strain as a percentage
    };

    let test; // the current material's results
    let animation = 0; // id of the running "test", so a new one cancels the old

    function analyse() {
        const m = MATERIALS[ui.materialSelect.value];
        const { strain, stress, neckingStrain } = simulateTensileTest(m);
        const peak = stress.reduce((best, s, i) => (s > stress[best] ? i : best), 0);
        // Metals: fit between 10% and 40% of the yield strength (UTS for cast iron). Plastics (ISO 527): 0.05% to 0.25% strain
        const reference = m.yieldStrength || m.uts;
        const fit = m.shape === "polymer"
            ? fitModulus(strain, stress, (e) => e >= 0.0005 && e <= 0.0025)
            : fitModulus(strain, stress, (e, s) => s >= 0.1 * reference && s <= 0.4 * reference);
        let yieldPoint = null;
        let yieldMethod = "";
        if (m.shape === "polymer") {
            // Plastics (ISO 527): the yield point is the first maximum, where the stress stops rising
            // (the highest point before the stress has fallen 5% below it)
            let best = strain.findIndex((e) => e > 0.01);
            for (let i = best; i < stress.length && stress[i] > 0.95 * stress[best]; i++) if (stress[i] > stress[best]) best = i;
            yieldPoint = { strain: strain[best], stress: stress[best] };
            yieldMethod = "first maximum";
        } else if (m.shape !== "brittle") {
            yieldPoint = offsetYield(strain, stress, fit);
            yieldMethod = "0.2% offset";
        }
        const fractureIndex = stress.length - 2; // the last point before the load falls to zero
        test = {
            m, strain, stress, fit, yieldPoint, yieldMethod, neckingStrain,
            uts: { strain: strain[peak], stress: stress[peak] },
            fracture: { strain: strain[fractureIndex], stress: stress[fractureIndex] },
            elongation: strain[fractureIndex] - stress[fractureIndex] / fit.E, // permanent strain after the break
            // Modulus of resilience: the elastic energy stored up to yield, the triangle under the straight line, yield² / 2E
            resilience: yieldPoint ? (yieldPoint.stress * yieldPoint.stress) / (2 * fit.E) : NaN,
            toughness: areaUnder(strain, stress, strain[fractureIndex])
        };
    }

    function draw(upToStrain) {
        const { m, strain, stress, fit, yieldPoint, uts, fracture } = test;
        const finished = upToStrain >= m.fractureStrain;
        const curve = ui.curveSelect.value;
        const visibleCount = finished ? strain.length : strain.findIndex((e) => e > upToStrain);
        const xs = strain.slice(0, visibleCount);
        const ys = stress.slice(0, visibleCount);
        const trueCurve = toTrue(strain, stress, Math.min(test.neckingStrain, upToStrain));

        for (const chart of [main, zoom]) {
            const s = chart.series;
            setData(s.engineering, xs, ys);
            setData(s.trueCurve, trueCurve.strain, trueCurve.stress);
            const showOffset = finished && ui.offsetCheckbox.checked && test.yieldMethod === "0.2% offset";
            if (showOffset) {
                const end = yieldPoint.strain + 0.4 * (yieldPoint.strain - yieldPoint.shift);
                setData(s.offsetLine, [yieldPoint.shift, end], [0, fit.E * (end - yieldPoint.shift)]);
            }
            const areas = finished && ui.areasCheckbox.checked && curve !== "true";
            if (areas) {
                setData(s.toughness, strain.slice(0, -1), stress.slice(0, -1));
                if (yieldPoint) setData(s.resilience, [0, yieldPoint.stress / fit.E], [0, yieldPoint.stress]);
            }
            const keyPoints = finished ? [yieldPoint, uts, fracture].filter(Boolean) : [];
            showSeries(chart, {
                toughness: areas,
                resilience: areas && !!yieldPoint,
                engineering: curve !== "true",
                trueCurve: curve !== "engineering",
                offsetLine: showOffset,
                points: finished && curve !== "true"
            });
            setData(s.points, keyPoints.map((p) => p.strain), keyPoints.map((p) => p.stress));

            chart.sciChartSurface.annotations.clear();
            if (finished && curve !== "true") {
                // Labels on the right of a point, or on its left near the end of the strain axis
                const label = (p, text, below) => {
                    const left = p.strain > 0.75 * m.fractureStrain && chart === main;
                    return new TextAnnotation({
                        x1: p.strain * 100,
                        y1: p.stress,
                        text,
                        fontSize: 13,
                        textColor: "#FFFFFF",
                        horizontalAnchorPoint: left ? EHorizontalAnchorPoint.Right : EHorizontalAnchorPoint.Left,
                        verticalAnchorPoint: below ? EVerticalAnchorPoint.Top : EVerticalAnchorPoint.Bottom,
                        xCoordShift: left ? -8 : 8,
                        yCoordShift: below ? 8 : -6
                    });
                };
                if (yieldPoint) chart.sciChartSurface.annotations.add(label(yieldPoint, `Yield ${yieldPoint.stress.toFixed(0)} MPa`, m.shape !== "polymer"));
                if (chart === main) {
                    chart.sciChartSurface.annotations.add(label(uts, `UTS ${uts.stress.toFixed(0)} MPa`, false));
                    chart.sciChartSurface.annotations.add(label(fracture, "Fracture", true));
                }
            }
        }
        // Fixed x-ranges, so the curve grows across the chart during a test
        main.xAxis.visibleRange = new NumberRange(0, m.fractureStrain * 100 * 1.05);
        main.xAxis.labelProvider.precision = m.fractureStrain < 0.05 ? 2 : 0;
        zoom.xAxis.visibleRange = new NumberRange(0, m.zoomStrain);
        let zoomTop = 0;
        for (let i = 0; i < strain.length && strain[i] * 100 <= m.zoomStrain; i++) zoomTop = Math.max(zoomTop, stress[i] * (curve === "engineering" ? 1 : 1 + strain[i]));
        zoom.yAxis.visibleRange = new NumberRange(0, zoomTop * 1.2);

        const fmt = (v, digits) => (Number.isFinite(v) ? v.toFixed(digits) : "–");
        if (!finished) {
            const last = visibleCount - 1;
            ui.readout.textContent = `Testing… strain ${fmt(strain[last] * 100, 2)}%, stress ${fmt(stress[last], 0)} MPa`;
            return;
        }
        ui.readout.textContent =
            `E ${fmt(fit.E / 1000, fit.E < 10000 ? 1 : 0)} GPa · ` +
            (yieldPoint ? `Yield (${test.yieldMethod}) ${fmt(yieldPoint.stress, 0)} MPa · ` : "No yield: breaks first · ") +
            `UTS ${fmt(uts.stress, 0)} MPa · Elongation after fracture ${fmt(test.elongation * 100, 1)}% · ` +
            (yieldPoint ? `Resilience ${fmt(test.resilience, 2)} MJ/m³ · ` : "") +
            `Toughness ${fmt(test.toughness, test.toughness < 10 ? 2 : 0)} MJ/m³`;
    }

    // "Run test": draw the curve as a test machine would, slowly through the elastic region and faster after it
    function runTest() {
        const id = ++animation;
        const started = performance.now();
        const duration = 6000; // ms
        const step = () => {
            if (id !== animation || main.sciChartSurface.isDeleted) return;
            const t = Math.min(1, (performance.now() - started) / duration);
            draw(t >= 1 ? Infinity : test.m.fractureStrain * t * t);
            if (t < 1) requestAnimationFrame(step);
        };
        step();
    }

    function onMaterialChanged() {
        animation++; // stop any test in progress
        analyse();
        draw(Infinity);
    }
    ui.materialSelect.addEventListener("change", onMaterialChanged);
    for (const control of [ui.curveSelect, ui.offsetCheckbox, ui.areasCheckbox]) {
        control.addEventListener("change", () => {
            animation++;
            draw(Infinity);
        });
    }
    ui.runButton.addEventListener("click", runTest);
    onMaterialChanged();
    // #region_A_end
}

stressStrainCurve("scichart-root");
