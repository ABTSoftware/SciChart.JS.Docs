import * as SciChart from "scichart";

const POINTS_PER_CLASS = 100; // training points in each class; the test set has the same size

// Sample data: three seeded synthetic datasets with two classes, labelled -1 and +1. The same seed always gives
// the same points, so the chart looks the same every time. A second seed gives a held-out test set.
function makeDataset(name, seed) {
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const x = [];
    const y = [];
    const label = [];
    for (let i = 0; i < 2 * POINTS_PER_CLASS; i++) {
        const c = i < POINTS_PER_CLASS ? -1 : 1;
        let px;
        let py;
        if (name === "linear") {
            // Two overlapping clouds: a straight line separates most, but not all, of the points
            px = 0.75 * c + 0.5 * gaussian();
            py = 0.5 * c + 0.5 * gaussian();
        } else if (name === "circles") {
            // A ring (class -1, radius 1) around a disc (class +1, radius 0.5): no straight line separates them
            const angle = 2 * Math.PI * random();
            const radius = (c < 0 ? 1 : 0.5) + 0.08 * gaussian();
            px = radius * Math.cos(angle);
            py = radius * Math.sin(angle);
        } else {
            // Two interleaved half-circles ("moons"), centred on the origin
            const t = Math.PI * random();
            px = (c < 0 ? Math.cos(t) : 1 - Math.cos(t)) - 0.5 + 0.12 * gaussian();
            py = (c < 0 ? Math.sin(t) : 0.5 - Math.sin(t)) - 0.25 + 0.12 * gaussian();
        }
        x.push(px);
        y.push(py);
        label.push(c);
    }
    const extent = { linear: 2.2, circles: 1.5, moons: 1.8 }[name]; // the charts show -extent to +extent
    return { x, y, label, extent };
}

// The controls and the charts each need an element. This splits the page's div into a control bar, the 2D and
// 3D charts side by side, and a results line; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    const slider = (id, min, max, step, value, width) =>
        `<input data-id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" ` +
        `style="vertical-align:middle; width:${width}px"> <output data-id="${id}"></output>`;
    bar.innerHTML =
        `<label>Dataset <select data-id="dataset" style="font:inherit"><option value="linear">Linear</option>` +
        `<option value="circles" selected>Circles</option><option value="moons">Moons</option></select></label>` +
        `<label>Kernel <select data-id="kernel" style="font:inherit"><option value="linear">Linear</option>` +
        `<option value="polynomial">Polynomial</option><option value="rbf" selected>RBF</option></select></label>` +
        `<label>Degree <select data-id="degree" style="font:inherit"><option>2</option><option selected>3</option>` +
        `<option>4</option></select></label>` +
        // C and gamma move on a log scale: the slider holds the power of ten
        `<label>C ${slider("c", -2, 3, 0.1, 0, 110)}</label>` +
        `<label>Gamma ${slider("gamma", -2, 2, 0.1, 0, 110)}</label>` +
        `<label>Lift ${slider("lift", 0, 1, 0.01, 1, 90)}</label>` +
        `<button data-id="animate" type="button" style="font:inherit">Animate lift</button>`;
    const charts = document.createElement("div");
    charts.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const chart2dDiv = document.createElement("div");
    chart2dDiv.id = divElementId + "-2d"; // each chart's div needs its own id
    chart2dDiv.style.cssText = "flex:1 1 380px; min-height:320px;";
    const chart3dDiv = document.createElement("div");
    chart3dDiv.id = divElementId + "-3d";
    chart3dDiv.style.cssText = "flex:1 1 380px; min-height:320px;";
    charts.append(chart2dDiv, chart3dDiv);
    const panel = document.createElement("div");
    panel.setAttribute("aria-live", "polite");
    panel.style.cssText = "display:flex; flex-wrap:wrap; gap:4px 24px; padding:6px 12px; color:#ffffff; font-size:13px;" + font;
    root.append(bar, charts, panel);
    const get = (selector) => bar.querySelector(selector);
    return {
        chart2dDiv,
        chart3dDiv,
        panel,
        datasetSelect: get('select[data-id="dataset"]'),
        kernelSelect: get('select[data-id="kernel"]'),
        degreeSelect: get('select[data-id="degree"]'),
        cInput: get('input[data-id="c"]'),
        cOutput: get('output[data-id="c"]'),
        gammaInput: get('input[data-id="gamma"]'),
        gammaOutput: get('output[data-id="gamma"]'),
        liftInput: get('input[data-id="lift"]'),
        liftOutput: get('output[data-id="lift"]'),
        animateButton: get('button[data-id="animate"]')
    };
}

async function supportVectorMachineChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A support vector machine trained in the browser: its decision function as a heatmap with the boundary and
    // margins as contours (2D), and the kernel trick as points lifted onto a paraboloid cut by a plane (3D)
    const {
        SciChartSurface,
        SciChart3DSurface,
        NumericAxis,
        NumericAxis3D,
        NumberRange,
        EAxisAlignment,
        Vector3,
        XyDataSeries,
        XyzDataSeries3D,
        UniformHeatmapDataSeries,
        UniformGridDataSeries3D,
        UniformHeatmapRenderableSeries,
        UniformContoursRenderableSeries,
        HeatmapColorMap,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        ScatterRenderableSeries3D,
        SpherePointMarker3D,
        SurfaceMeshRenderableSeries3D,
        PointLineRenderableSeries3D,
        GradientColorPalette,
        EDrawMeshAs,
        LegendModifier,
        ELegendPlacement,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- SVM maths (plain JavaScript, no library needed) ---

    // Kernels: each one returns the dot product of two points in some feature space, without building that space.
    // Points are arrays of numbers, so the same code works for 2D points and for the lifted 3D points.
    const dot = (a, b) => a.reduce((sum, v, k) => sum + v * b[k], 0);
    function makeKernel(kind, gamma, degree) {
        if (kind === "linear") return dot;
        if (kind === "polynomial") return (a, b) => Math.pow(gamma * dot(a, b) + 1, degree);
        return (a, b) => Math.exp(-gamma * a.reduce((sum, v, k) => sum + (v - b[k]) * (v - b[k]), 0)); // RBF
    }

    // Train a soft-margin SVM with sequential minimal optimisation (SMO), as in LIBSVM: solve the dual problem
    //   minimise ½ Σ Σ αi αj yi yj K(xi, xj) − Σ αi, subject to 0 ≤ αi ≤ C and Σ αi yi = 0,
    // by repeatedly picking the pair of α values that most violates the optimality conditions (second-order
    // working-set selection, Fan, Chen and Lin 2005) and solving for that pair exactly.
    function trainSvm(points, y, kernel, C, tolerance = 1e-3, maxSteps = 50000) {
        const n = points.length;
        const K = new Float64Array(n * n); // the kernel matrix, computed once
        for (let i = 0; i < n; i++) {
            for (let j = i; j < n; j++) K[i * n + j] = K[j * n + i] = kernel(points[i], points[j]);
        }
        const alpha = new Float64Array(n);
        const grad = new Float64Array(n).fill(-1); // gradient of the dual objective; at α = 0 every entry is −1
        const inUp = (t) => (y[t] > 0 ? alpha[t] < C : alpha[t] > 0);
        const inLow = (t) => (y[t] > 0 ? alpha[t] > 0 : alpha[t] < C);
        let steps = 0;
        for (; steps < maxSteps; steps++) {
            let i = -1;
            let gMax = -Infinity;
            for (let t = 0; t < n; t++) {
                if (inUp(t) && -y[t] * grad[t] >= gMax) {
                    gMax = -y[t] * grad[t];
                    i = t;
                }
            }
            let j = -1;
            let gMin = Infinity;
            let best = Infinity;
            for (let t = 0; t < n && i >= 0; t++) {
                if (!inLow(t)) continue;
                const v = -y[t] * grad[t];
                gMin = Math.min(gMin, v);
                const b = gMax - v;
                if (b > 0) {
                    const a = Math.max(K[i * n + i] + K[t * n + t] - 2 * K[i * n + t], 1e-12);
                    if (-(b * b) / a <= best) {
                        best = -(b * b) / a;
                        j = t;
                    }
                }
            }
            if (i < 0 || j < 0 || gMax - gMin < tolerance) break; // optimal, to within the tolerance
            const oldI = alpha[i];
            const oldJ = alpha[j];
            const a = Math.max(K[i * n + i] + K[j * n + j] - 2 * K[i * n + j], 1e-12);
            if (y[i] !== y[j]) {
                const delta = (-grad[i] - grad[j]) / a;
                const diff = alpha[i] - alpha[j]; // stays constant, so Σ αi yi stays 0
                alpha[i] += delta;
                alpha[j] += delta;
                if (diff > 0 && alpha[j] < 0) [alpha[j], alpha[i]] = [0, diff];
                if (diff <= 0 && alpha[i] < 0) [alpha[i], alpha[j]] = [0, -diff];
                if (diff > 0 && alpha[i] > C) [alpha[i], alpha[j]] = [C, C - diff];
                if (diff <= 0 && alpha[j] > C) [alpha[j], alpha[i]] = [C, C + diff];
            } else {
                const delta = (grad[i] - grad[j]) / a;
                const sum = alpha[i] + alpha[j]; // stays constant
                alpha[i] -= delta;
                alpha[j] += delta;
                if (sum > C && alpha[i] > C) [alpha[i], alpha[j]] = [C, sum - C];
                if (sum <= C && alpha[j] < 0) [alpha[j], alpha[i]] = [0, sum];
                if (sum > C && alpha[j] > C) [alpha[j], alpha[i]] = [C, sum - C];
                if (sum <= C && alpha[i] < 0) [alpha[i], alpha[j]] = [0, sum];
            }
            const dI = alpha[i] - oldI;
            const dJ = alpha[j] - oldJ;
            for (let t = 0; t < n; t++) grad[t] += y[t] * (y[i] * K[t * n + i] * dI + y[j] * K[t * n + j] * dJ);
        }
        // The offset: averaged over the "free" support vectors (0 < α < C), which lie exactly on the margin
        let sum = 0;
        let free = 0;
        let upper = Infinity;
        let lower = -Infinity;
        for (let t = 0; t < n; t++) {
            const yg = y[t] * grad[t];
            if (alpha[t] > 0 && alpha[t] < C) {
                sum += yg;
                free++;
            } else if ((alpha[t] >= C) === (y[t] < 0)) upper = Math.min(upper, yg);
            else lower = Math.max(lower, yg);
        }
        const rho = free > 0 ? sum / free : (upper + lower) / 2;
        const support = [];
        for (let t = 0; t < n; t++) if (alpha[t] > 1e-8) support.push(t);
        // f(x) = Σ αi yi K(xi, x) − ρ: positive on the +1 side, 0 on the boundary, ±1 on the margins
        const decision = (p) => support.reduce((s, t) => s + alpha[t] * y[t] * kernel(points[t], p), 0) - rho;
        return { alpha, rho, support, steps, converged: steps < maxSteps, decision };
    }

    // For a linear kernel the weights can be written out: w = Σ αi yi xi, and the margin is 2 / ‖w‖ wide
    const weights = (model, points, y) =>
        points[0].map((_, k) => model.support.reduce((s, t) => s + model.alpha[t] * y[t] * points[t][k], 0));

    // The kernel trick made explicit: lift (x1, x2) to (x1, x2, x1² + x2²)
    const lift = (p) => [p[0], p[1], p[0] * p[0] + p[1] * p[1]];

    // Where a plane w1 x1 + w2 x2 + w3 z = ρ meets the paraboloid z = x1² + x2²: completing the square gives
    // a circle in 2D. Returns null when there is no such circle inside the view.
    function planeCircle(w, rho, extent) {
        if (Math.abs(w[2]) < 1e-9) return null;
        const cx = -w[0] / (2 * w[2]);
        const cy = -w[1] / (2 * w[2]);
        const r2 = rho / w[2] + cx * cx + cy * cy;
        if (r2 <= 0) return null;
        const r = Math.sqrt(r2);
        return Math.abs(cx) + r <= extent && Math.abs(cy) + r <= extent ? { cx, cy, r } : null;
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const COLOUR_NEG = "#50C7E0";
    const COLOUR_POS = "#F48420";
    const GRID = 121; // heatmap cells per side
    const MESH = 41; // 3D surface cells per side

    // 1. The 2D chart: decision-function heatmap, boundary and margin contours, training points, support vectors
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.chart2dDiv, { theme });
    const xAxis = new NumericAxis(wasmContext, { axisTitle: "Feature 1", labelPrecision: 1 });
    const yAxis = new NumericAxis(wasmContext, { axisTitle: "Feature 2", axisAlignment: EAxisAlignment.Left, labelPrecision: 1 });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
    const zEmpty = () => Array.from({ length: GRID }, () => new Array(GRID).fill(0));
    const heatmapData = new UniformHeatmapDataSeries(wasmContext, { xStart: 0, xStep: 1, yStart: 0, yStep: 1, zValues: zEmpty() });
    const contourData = new UniformHeatmapDataSeries(wasmContext, { xStart: 0, xStep: 1, yStart: 0, yStep: 1, zValues: zEmpty() });
    const heatmap = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: heatmapData,
        opacity: 0.85,
        // f(x) from −2 (deep blue, the −1 side) through 0 (navy) to +2 (deep orange, the +1 side)
        colorMap: new HeatmapColorMap({
            minimum: -2,
            maximum: 2,
            gradientStops: [
                { offset: 0, color: "#156B87" },
                { offset: 0.5, color: "#253556" },
                { offset: 1, color: "#B8601A" }
            ]
        })
    });
    const contour = (levels, color, strokeThickness) =>
        new UniformContoursRenderableSeries(wasmContext, {
            dataSeries: contourData,
            zLevels: levels,
            majorLineStyle: { color, strokeThickness },
            minorLineStyle: { color, strokeThickness },
            stroke: color,
            strokeThickness
        });
    const boundary = contour([0], "#FFFFFF", 3);
    const margins = contour([-1, 1], "#FFFFFFAA", 1.5);
    const negativeData = new XyDataSeries(wasmContext, { dataSeriesName: "Class −1" });
    const positiveData = new XyDataSeries(wasmContext, { dataSeriesName: "Class +1" });
    const supportData = new XyDataSeries(wasmContext, { dataSeriesName: "Support vectors" });
    const scatter = (dataSeries, fill) =>
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries,
            stroke: fill, // the legend shows this colour
            pointMarker: new EllipsePointMarker(wasmContext, { width: 8, height: 8, fill, stroke: "#0B1A33", strokeThickness: 1 })
        });
    const negatives = scatter(negativeData, COLOUR_NEG);
    const positives = scatter(positiveData, COLOUR_POS);
    const supportRings = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: supportData,
        stroke: "#FFFFFF",
        pointMarker: new EllipsePointMarker(wasmContext, { width: 15, height: 15, fill: "#00000000", stroke: "#FFFFFF", strokeThickness: 2 })
    });
    sciChartSurface.renderableSeries.add(heatmap, margins, boundary, negatives, positives, supportRings);
    const legend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopLeft });
    const cursor = new CursorModifier({ showTooltip: true, showAxisLabels: false });
    sciChartSurface.chartModifiers.add(legend, cursor, new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
    for (const series of [heatmap, boundary, margins]) legend.includeSeries(series, false);
    for (const series of [boundary, margins, supportRings]) cursor.includeSeries(series, false);

    // 2. The 3D chart: points lifted onto the paraboloid z = x1² + x2², and the plane a linear SVM finds there.
    // In SciChart.js 3D, Y is up, so the lifted value z goes on the Y axis and Feature 2 on the Z axis.
    const chart3d = await SciChart3DSurface.create(ui.chart3dDiv, {
        theme,
        worldDimensions: new Vector3(300, 200, 300),
        cameraOptions: { position: new Vector3(-400, 300, -460), target: new Vector3(0, 30, 0) }
    });
    const surface3d = chart3d.sciChart3DSurface;
    const wasm3d = chart3d.wasmContext;
    surface3d.xAxis = new NumericAxis3D(wasm3d, { axisTitle: "Feature 1", labelPrecision: 1 });
    surface3d.yAxis = new NumericAxis3D(wasm3d, { axisTitle: "z = x1² + x2²", labelPrecision: 1 });
    surface3d.zAxis = new NumericAxis3D(wasm3d, { axisTitle: "Feature 2", labelPrecision: 1 });
    const gridSeries = () => new UniformGridDataSeries3D(wasm3d, { yValues: [[0, 0], [0, 0]], xStart: 0, xStep: 1, zStart: 0, zStep: 1 });
    const paraboloidData = gridSeries();
    const planeData = gridSeries();
    const paraboloid = new SurfaceMeshRenderableSeries3D(wasm3d, {
        dataSeries: paraboloidData,
        drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME,
        stroke: "#C8D3E8",
        strokeThickness: 1,
        opacity: 0.35,
        drawSkirt: false,
        meshColorPalette: new GradientColorPalette(wasm3d, {
            gradientStops: [
                { offset: 0, color: "#264B93" },
                { offset: 1, color: "#8E6CD8" }
            ]
        })
    });
    const plane = new SurfaceMeshRenderableSeries3D(wasm3d, {
        dataSeries: planeData,
        drawMeshAs: EDrawMeshAs.SOLID_MESH,
        opacity: 0.6,
        drawSkirt: false,
        meshColorPalette: new GradientColorPalette(wasm3d, {
            gradientStops: [
                { offset: 0, color: "#3BD16F" },
                { offset: 1, color: "#3BD16F" }
            ]
        })
    });
    const liftedData = new XyzDataSeries3D(wasm3d, { dataSeriesName: "Lifted points" });
    const circleData = new XyzDataSeries3D(wasm3d, { dataSeriesName: "Plane meets paraboloid" });
    const lifted = new ScatterRenderableSeries3D(wasm3d, {
        dataSeries: liftedData,
        pointMarker: new SpherePointMarker3D(wasm3d, { size: 7, fill: "#FFFFFF" })
    });
    const circle = new PointLineRenderableSeries3D(wasm3d, {
        dataSeries: circleData,
        stroke: "#FFFFFF",
        strokeThickness: 4
    });
    surface3d.renderableSeries.add(paraboloid, plane, lifted, circle);
    surface3d.chartModifiers.add(new OrbitModifier3D(), new MouseWheelZoomModifier3D(), new ResetCamera3DModifier());

    // --- Training and redrawing ---
    const argb = (hex) => (0xff000000 | parseInt(hex.slice(1), 16)) >>> 0; // vertex colours are ARGB numbers
    let data;
    let points;
    let liftedModel;
    let liftedW;

    // Retrain both models and redraw: runs when the dataset, kernel, degree, C or gamma changes
    function onModelChanged() {
        const C = Math.pow(10, Number(ui.cInput.value));
        const gamma = Math.pow(10, Number(ui.gammaInput.value));
        const kind = ui.kernelSelect.value;
        const degree = Number(ui.degreeSelect.value);
        ui.cOutput.textContent = C < 1 ? C.toFixed(2) : C.toPrecision(2).replace(/\.0$/, "");
        ui.gammaOutput.textContent = gamma < 1 ? gamma.toFixed(2) : gamma.toPrecision(2).replace(/\.0$/, "");
        ui.gammaInput.disabled = kind === "linear";
        ui.degreeSelect.disabled = kind !== "polynomial";

        const name = ui.datasetSelect.value;
        data = makeDataset(name, 11);
        const test = makeDataset(name, 4242);
        points = data.x.map((x, i) => [x, data.y[i]]);
        const kernel = makeKernel(kind, gamma, degree);
        const model = trainSvm(points, data.label, kernel, C);

        // Decision function on a grid, for the heatmap and the contours
        const e = data.extent;
        const step = (2 * e) / GRID;
        const z = [];
        for (let r = 0; r < GRID; r++) {
            const row = new Array(GRID);
            for (let c = 0; c < GRID; c++) row[c] = model.decision([-e + (c + 0.5) * step, -e + (r + 0.5) * step]);
            z.push(row);
        }
        for (const series of [heatmapData, contourData]) {
            series.xStart = -e;
            series.yStart = -e;
            series.xStep = step;
            series.yStep = step;
            series.setZValues(z);
        }
        xAxis.visibleRange = new NumberRange(-e, e);
        yAxis.visibleRange = new NumberRange(-e, e);

        for (const { dataSeries, c } of [{ dataSeries: negativeData, c: -1 }, { dataSeries: positiveData, c: 1 }]) {
            const idx = data.label.map((l, i) => (l === c ? i : -1)).filter((i) => i >= 0);
            dataSeries.clear();
            dataSeries.appendRange(idx.map((i) => data.x[i]), idx.map((i) => data.y[i]));
        }
        supportData.clear();
        supportData.appendRange(model.support.map((i) => data.x[i]), model.support.map((i) => data.y[i]));

        const accuracy = (set) => {
            let right = 0;
            for (let i = 0; i < set.x.length; i++) if (Math.sign(model.decision([set.x[i], set.y[i]])) === set.label[i]) right++;
            return (100 * right) / set.x.length;
        };
        let marginText = "";
        if (kind === "linear") {
            const w = weights(model, points, data.label);
            marginText = ` · margin width 2/‖w‖ = ${(2 / Math.hypot(w[0], w[1])).toFixed(2)}`;
        }

        // The 3D view: a linear SVM on the lifted points (x1, x2, x1² + x2²), with the same C
        const liftedPoints = points.map(lift);
        liftedModel = trainSvm(liftedPoints, data.label, dot, C);
        liftedW = weights(liftedModel, liftedPoints, data.label);
        const liftedRight = liftedPoints.filter((p, i) => Math.sign(liftedModel.decision(p)) === data.label[i]).length;

        const kernelName = { linear: "Linear", polynomial: `Polynomial (degree ${degree})`, rbf: "RBF" }[kind];
        const ring = planeCircle(liftedW, liftedModel.rho, data.extent);
        ui.panel.innerHTML =
            `<div>2D: ${kernelName} kernel · ${model.support.length} support vectors · training accuracy ` +
            `${accuracy(data).toFixed(1)}% · test accuracy ${accuracy(test).toFixed(1)}%${marginText}` +
            (model.converged ? "" : " · stopped at the step limit (try a smaller gamma)") +
            `</div>` +
            `<div>3D: linear SVM on (x1, x2, x1² + x2²) · accuracy ${((100 * liftedRight) / points.length).toFixed(1)}%` +
            (ring
                ? ` · back in 2D, a circle of radius ${ring.r.toFixed(2)} centred at (${ring.cx.toFixed(2)}, ${ring.cy.toFixed(2)})`
                : " · no circle inside the view separates these classes") +
            `</div>`;
        onLiftChanged();
    }

    // Move the points, the paraboloid, the plane and their intersection: runs when the lift slider moves.
    // At lift 0 everything lies flat on the floor; at lift 1, z = x1² + x2².
    function onLiftChanged() {
        const t = Number(ui.liftInput.value);
        ui.liftOutput.textContent = t.toFixed(2);
        const e = data.extent;
        const top = e * e * 1.05; // the paraboloid is cut off at radius e
        surface3d.xAxis.visibleRange = new NumberRange(-e, e);
        surface3d.zAxis.visibleRange = new NumberRange(-e, e);
        surface3d.yAxis.visibleRange = new NumberRange(0, top);
        const clamp = (v) => Math.max(0, Math.min(top, v));
        const step = (2 * e) / (MESH - 1);
        const [w1, w2, w3] = liftedW;
        const bowl = [];
        const flat = [];
        for (let r = 0; r < MESH; r++) {
            const b = [];
            const f = [];
            for (let c = 0; c < MESH; c++) {
                const x1 = -e + c * step;
                const x2 = -e + r * step;
                b.push(clamp(t * (x1 * x1 + x2 * x2)));
                // The plane w·(x1, x2, z) = ρ, solved for z, and scaled by the lift like everything else
                f.push(clamp((t * (liftedModel.rho - w1 * x1 - w2 * x2)) / w3));
            }
            bowl.push(b);
            flat.push(f);
        }
        for (const { series, values } of [{ series: paraboloidData, values: bowl }, { series: planeData, values: flat }]) {
            series.xStart = -e;
            series.zStart = -e;
            series.xStep = step;
            series.zStep = step;
            series.setYValues(values);
        }
        const xs = [];
        const ys = [];
        const zs = [];
        const meta = [];
        points.forEach((p, i) => {
            xs.push(p[0]);
            ys.push(t * (p[0] * p[0] + p[1] * p[1]));
            zs.push(p[1]);
            meta.push({ vertexColor: argb(data.label[i] < 0 ? COLOUR_NEG : COLOUR_POS) });
        });
        liftedData.clear();
        liftedData.appendRange(xs, ys, zs, meta);

        // Where the plane meets the paraboloid: x1² + x2² = (ρ − w1 x1 − w2 x2) / w3, a circle in 2D
        circleData.clear();
        const ring = planeCircle(liftedW, liftedModel.rho, e);
        if (ring) {
            const cxs = [];
            const cys = [];
            const czs = [];
            for (let k = 0; k <= 120; k++) {
                const a = (2 * Math.PI * k) / 120;
                const x1 = ring.cx + ring.r * Math.cos(a);
                const x2 = ring.cy + ring.r * Math.sin(a);
                cxs.push(x1);
                cys.push(t * (x1 * x1 + x2 * x2));
                czs.push(x2);
            }
            circleData.appendRange(cxs, cys, czs);
        }
    }

    // Retrain at most once per frame while a slider is dragged
    let pending = false;
    const retrain = () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            pending = false;
            onModelChanged();
        });
    };
    for (const element of [ui.datasetSelect, ui.kernelSelect, ui.degreeSelect]) element.addEventListener("change", retrain);
    for (const element of [ui.cInput, ui.gammaInput]) element.addEventListener("input", retrain);
    ui.liftInput.addEventListener("input", onLiftChanged);
    ui.animateButton.addEventListener("click", () => {
        const start = performance.now();
        const frame = (now) => {
            const t = Math.min(1, (now - start) / 2500);
            ui.liftInput.value = String(t);
            onLiftChanged();
            if (t < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    });
    onModelChanged();
    // #region_A_end
}

supportVectorMachineChart("scichart-root");
