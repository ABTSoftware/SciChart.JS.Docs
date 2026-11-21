import * as SciChart from "scichart";

const MAX_K = 8; // the k slider and the elbow and silhouette charts go from 1 to 8 clusters
const GRID = 200; // the Voronoi regions are shaded on a GRID x GRID heatmap

// A seeded random generator (Park-Miller), so the data and every "random" start are the same on each visit
function seededRandom(seed) {
    let state = seed % 2147483647 || 1;
    return () => {
        state = (state * 16807) % 2147483647;
        return (state - 1) / 2147483646;
    };
}

// Sample data: four synthetic 2D datasets, made with a fixed seed. Each point is [feature 1, feature 2].
function makeDataset(name) {
    const random = seededRandom(1957);
    const gaussian = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const blob = (cx, cy, sx, sy, n) => Array.from({ length: n }, () => [cx + sx * gaussian(), cy + sy * gaussian()]);
    if (name === "blobs") {
        // Four round groups of 75 points with the same spread: the case k-means is built for
        return [...blob(-4, -3, 1.1, 1.1, 75), ...blob(3.5, -3.5, 1.1, 1.1, 75), ...blob(-2.5, 4, 1.1, 1.1, 75), ...blob(4, 3, 1.1, 1.1, 75)];
    }
    if (name === "uneven") {
        // One large, wide group and two small, tight ones: k-means moves the boundary into the large group
        return [...blob(-2.5, 0, 2.2, 2.2, 220), ...blob(4, 3, 0.45, 0.45, 40), ...blob(4.5, -2.5, 0.45, 0.45, 40)];
    }
    if (name === "moons") {
        // Two interleaved half-rings: clusters that are not round, so k-means cuts them in the wrong place
        return Array.from({ length: 300 }, (_, i) => {
            const t = Math.PI * random();
            const upper = i % 2 === 0;
            const x = upper ? Math.cos(t) : 1 - Math.cos(t);
            const y = upper ? Math.sin(t) : 0.5 - Math.sin(t);
            return [4 * x - 2 + 0.35 * gaussian(), 4 * y - 1 + 0.35 * gaussian()];
        });
    }
    if (name === "circles") {
        // A ring around a disc: the two groups share a centre, so no straight boundary can separate them
        return Array.from({ length: 300 }, (_, i) => {
            const t = 2 * Math.PI * random();
            const r = i % 2 === 0 ? 1.5 : 5;
            return [r * Math.cos(t) + 0.35 * gaussian(), r * Math.sin(t) + 0.35 * gaussian()];
        });
    }
    // "scales": four groups, two apart in feature 1 (measured in large units) and two apart in feature 2 (small units).
    // Unstandardised, distances are dominated by feature 1 and k-means splits along it; standardised, all four separate.
    return [...blob(-20, -1, 6, 0.3, 75), ...blob(-20, 1, 6, 0.3, 75), ...blob(20, -1, 6, 0.3, 75), ...blob(20, 1, 6, 0.3, 75)];
}

// The controls and the charts each need an element. This splits the page's div into a control bar, a status line,
// the main chart and two side charts; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Dataset <select data-id="dataset" style="font:inherit">` +
        `<option value="blobs" selected>Four blobs</option><option value="uneven">Uneven sizes</option>` +
        `<option value="moons">Moons</option><option value="circles">Circles</option>` +
        `<option value="scales">Unscaled features</option></select></label>` +
        `<label>k <input data-id="k" type="range" min="1" max="${MAX_K}" step="1" value="4" style="vertical-align:middle; width:110px"> ` +
        `<output data-id="k"></output></label>` +
        `<label>Start <select data-id="init" style="font:inherit">` +
        `<option value="plusplus" selected>k-means++</option><option value="random">Random points</option></select></label>` +
        `<label><input data-id="scale" type="checkbox"> Standardise features</label>` +
        `<button data-id="step" type="button" style="font:inherit">Step</button>` +
        `<button data-id="run" type="button" style="font:inherit">Run</button>` +
        `<button data-id="restart" type="button" style="font:inherit">New start</button>` +
        `<button data-id="reset" type="button" style="font:inherit">Reset points</button>`;
    const status = document.createElement("div");
    status.setAttribute("aria-live", "polite");
    status.style.cssText = "padding:2px 12px 6px; color:#C8D3E8;" + font;
    const charts = document.createElement("div");
    charts.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const mainDiv = document.createElement("div");
    mainDiv.id = divElementId + "-main"; // each chart's div needs its own id
    mainDiv.style.cssText = "flex:2 1 460px; min-height:400px;";
    const side = document.createElement("div");
    side.style.cssText = "flex:1 1 300px; display:flex; flex-direction:column;";
    const elbowDiv = document.createElement("div");
    elbowDiv.id = divElementId + "-elbow";
    elbowDiv.style.cssText = "flex:1; min-height:200px;";
    const silhouetteDiv = document.createElement("div");
    silhouetteDiv.id = divElementId + "-silhouette";
    silhouetteDiv.style.cssText = "flex:1; min-height:200px;";
    side.append(elbowDiv, silhouetteDiv);
    charts.append(mainDiv, side);
    root.append(bar, status, charts);
    const get = (selector) => bar.querySelector(selector);
    return {
        root,
        mainDiv,
        elbowDiv,
        silhouetteDiv,
        status,
        datasetSelect: get('select[data-id="dataset"]'),
        kInput: get('input[data-id="k"]'),
        kOutput: get('output[data-id="k"]'),
        initSelect: get('select[data-id="init"]'),
        scaleCheckbox: get('input[data-id="scale"]'),
        stepButton: get('button[data-id="step"]'),
        runButton: get('button[data-id="run"]'),
        restartButton: get('button[data-id="restart"]'),
        resetButton: get('button[data-id="reset"]')
    };
}

async function kMeansChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // K-means clustering, step by step: points coloured by cluster, centroids and their paths, and the Voronoi
    // regions as a heatmap, with an elbow plot and a silhouette plot computed live. Charted with SciChart.js.
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        XyDataSeries,
        XyScatterRenderableSeries,
        FastLineRenderableSeries,
        EllipsePointMarker,
        MetadataPaletteProvider,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        CustomChartModifier2D,
        translateFromCanvasToSeriesViewRect,
        LegendModifier,
        ELegendPlacement,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- K-means maths (plain JavaScript, no library needed). A point is [x, y]. ---

    const squaredDistance = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

    // Index of the centroid nearest to point p
    function nearest(p, centroids) {
        let best = 0;
        let bestDistance = Infinity;
        for (let c = 0; c < centroids.length; c++) {
            const d = squaredDistance(p, centroids[c]);
            if (d < bestDistance) {
                bestDistance = d;
                best = c;
            }
        }
        return best;
    }

    // Starting centroids. "random": k distinct data points picked at random (Forgy's method).
    // "plusplus": k-means++ (Arthur and Vassilvitskii, 2007): the first centre is a random point; each next one is a
    // point picked with probability proportional to its squared distance from the nearest centre chosen so far.
    function initialCentroids(points, k, method, random) {
        if (method === "random") {
            const chosen = [];
            while (chosen.length < Math.min(k, points.length)) {
                const i = Math.floor(random() * points.length);
                if (!chosen.includes(i)) chosen.push(i);
            }
            return chosen.map((i) => [...points[i]]);
        }
        const centroids = [[...points[Math.floor(random() * points.length)]]];
        const d2 = points.map((p) => squaredDistance(p, centroids[0]));
        while (centroids.length < k) {
            const total = d2.reduce((sum, d) => sum + d, 0);
            let target = random() * total;
            let pick = 0;
            while (pick < points.length - 1 && target > d2[pick]) target -= d2[pick++];
            centroids.push([...points[pick]]);
            for (let i = 0; i < points.length; i++) d2[i] = Math.min(d2[i], squaredDistance(points[i], points[pick]));
        }
        return centroids;
    }

    // Step 1, assignment: give every point the label of its nearest centroid. Returns how many labels changed.
    function assignPoints(points, centroids, labels) {
        let changed = 0;
        for (let i = 0; i < points.length; i++) {
            const c = nearest(points[i], centroids);
            if (labels[i] !== c) changed++;
            labels[i] = c;
        }
        return changed;
    }

    // Step 2, update: move each centroid to the mean of its points. A centroid with no points stays where it is.
    function updateCentroids(points, labels, centroids) {
        const sums = centroids.map(() => [0, 0, 0]);
        for (let i = 0; i < points.length; i++) {
            const s = sums[labels[i]];
            s[0] += points[i][0];
            s[1] += points[i][1];
            s[2]++;
        }
        return centroids.map((c, j) => (sums[j][2] > 0 ? [sums[j][0] / sums[j][2], sums[j][1] / sums[j][2]] : c));
    }

    // The objective k-means minimises: inertia, the within-cluster sum of squared distances to the centroids
    function inertia(points, labels, centroids) {
        let sum = 0;
        for (let i = 0; i < points.length; i++) sum += squaredDistance(points[i], centroids[labels[i]]);
        return sum;
    }

    // Lloyd's algorithm to convergence: assign, update, repeat until no label changes
    function kMeans(points, k, method, random, maxIterations = 100) {
        let centroids = initialCentroids(points, k, method, random);
        const labels = new Array(points.length).fill(-1);
        for (let it = 0; it < maxIterations; it++) {
            if (assignPoints(points, centroids, labels) === 0) break;
            centroids = updateCentroids(points, labels, centroids);
        }
        return { centroids, labels, inertia: inertia(points, labels, centroids) };
    }

    // Mean silhouette score. For point i: a = mean distance to the other points in its cluster, b = the smallest mean
    // distance to the points of another cluster, s = (b - a) / max(a, b). A point alone in its cluster scores 0.
    function meanSilhouette(points, labels, k) {
        if (k < 2) return NaN;
        const sizes = new Array(k).fill(0);
        labels.forEach((c) => sizes[c]++);
        let total = 0;
        const sumTo = new Array(k);
        for (let i = 0; i < points.length; i++) {
            sumTo.fill(0);
            for (let j = 0; j < points.length; j++) {
                if (j !== i) sumTo[labels[j]] += Math.sqrt(squaredDistance(points[i], points[j]));
            }
            const own = labels[i];
            if (sizes[own] < 2) continue; // s = 0
            const a = sumTo[own] / (sizes[own] - 1);
            let b = Infinity;
            for (let c = 0; c < k; c++) if (c !== own && sizes[c] > 0) b = Math.min(b, sumTo[c] / sizes[c]);
            if (Number.isFinite(b)) total += (b - a) / Math.max(a, b);
        }
        return total / points.length;
    }

    // Standardise each feature to mean 0 and standard deviation 1 (z-scores), so both count equally in distances
    function scaler(points, on) {
        const n = points.length;
        const mean = [0, 1].map((d) => points.reduce((s, p) => s + p[d], 0) / n);
        const sd = [0, 1].map((d) => Math.sqrt(points.reduce((s, p) => s + (p[d] - mean[d]) ** 2, 0) / n) || 1);
        return {
            forward: (p) => (on ? [(p[0] - mean[0]) / sd[0], (p[1] - mean[1]) / sd[1]] : p),
            back: (p) => (on ? [p[0] * sd[0] + mean[0], p[1] * sd[1] + mean[1]] : p)
        };
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const COLOURS = ["#50C7E0", "#F48420", "#3BD16F", "#E36FD4", "#FFE066", "#9B8AFB", "#EF5350", "#C8D3E8"];
    const zoom = () => [new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier()];

    // 1. The main chart: Voronoi regions (heatmap), points coloured by cluster, centroid paths and centroids
    const main = await SciChartSurface.create(ui.mainDiv, { theme });
    const xAxis = new NumericAxis(main.wasmContext, { axisTitle: "Feature 1", autoRange: EAutoRange.Never, drawMinorGridLines: false });
    const yAxis = new NumericAxis(main.wasmContext, {
        axisTitle: "Feature 2",
        axisAlignment: EAxisAlignment.Left,
        autoRange: EAutoRange.Never,
        drawMinorGridLines: false
    });
    main.sciChartSurface.xAxes.add(xAxis);
    main.sciChartSurface.yAxes.add(yAxis);

    // Each heatmap cell holds the index of its nearest centroid; the colour map gives cluster c the colour COLOURS[c]
    const regionData = new UniformHeatmapDataSeries(main.wasmContext, {
        zValues: Array.from({ length: GRID }, () => new Array(GRID).fill(NaN)),
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1
    });
    main.sciChartSurface.renderableSeries.add(
        new UniformHeatmapRenderableSeries(main.wasmContext, {
            dataSeries: regionData,
            opacity: 0.3,
            colorMap: new HeatmapColorMap({
                minimum: 0,
                maximum: MAX_K - 1,
                gradientStops: COLOURS.map((color, c) => ({ offset: c / (MAX_K - 1), color }))
            })
        })
    );
    // All points in one scatter series; each point's colour comes from its metadata (MetadataPaletteProvider)
    const pointData = new XyDataSeries(main.wasmContext, { dataSeriesName: "Points" });
    main.sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(main.wasmContext, {
            dataSeries: pointData,
            pointMarker: new EllipsePointMarker(main.wasmContext, { width: 7, height: 7, strokeThickness: 1, fill: "#FFFFFF", stroke: "#0B1A33" }),
            paletteProvider: new MetadataPaletteProvider()
        })
    );
    // One line per centroid, tracing where it has moved
    const pathData = COLOURS.map(() => new XyDataSeries(main.wasmContext));
    pathData.forEach((dataSeries, c) =>
        main.sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(main.wasmContext, { dataSeries, stroke: COLOURS[c], strokeThickness: 2, strokeDashArray: [4, 3] })
        )
    );
    const centroidData = new XyDataSeries(main.wasmContext, { dataSeriesName: "Centroids" });
    main.sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(main.wasmContext, {
            dataSeries: centroidData,
            pointMarker: new EllipsePointMarker(main.wasmContext, { width: 20, height: 20, strokeThickness: 3, fill: "#FFFFFF", stroke: "#FFFFFF" }),
            paletteProvider: new MetadataPaletteProvider()
        })
    );

    // Click (without dragging) on the main chart to add a point there
    class AddPointModifier extends CustomChartModifier2D {
        downPoint = undefined;
        modifierMouseDown(args) {
            super.modifierMouseDown(args);
            this.downPoint = args.mousePoint;
        }
        modifierMouseUp(args) {
            super.modifierMouseUp(args);
            const down = this.downPoint;
            if (!down || Math.hypot(args.mousePoint.x - down.x, args.mousePoint.y - down.y) > 5) return;
            const p = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            if (!p) return;
            addPoint([xAxis.getCurrentCoordinateCalculator().getDataValue(p.x), yAxis.getCurrentCoordinateCalculator().getDataValue(p.y)]);
        }
    }
    main.sciChartSurface.chartModifiers.add(new AddPointModifier(), ...zoom());

    // 2 and 3. Elbow plot (inertia against k) and silhouette plot (mean silhouette against k): a line for the best of
    // several k-means++ starts at each k, and a large marker for the run on the main chart
    async function scoreChart(div, yTitle, colour, labelPrecision) {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(div, { theme });
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Number of clusters k",
                visibleRange: new NumberRange(0.5, MAX_K + 0.5),
                autoTicks: false,
                majorDelta: 1,
                minorDelta: 1,
                labelPrecision: 0
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: yTitle,
                axisAlignment: EAxisAlignment.Left,
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0.1, 0.6), // headroom for the legend
                labelPrecision
            })
        );
        const best = new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { dataSeriesName: "Best of 10 starts", dataIsSortedInX: true }),
            stroke: colour,
            strokeThickness: 2.5,
            pointMarker: new EllipsePointMarker(wasmContext, { width: 8, height: 8, fill: colour, stroke: colour })
        });
        const run = new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { dataSeriesName: "This run" }),
            pointMarker: new EllipsePointMarker(wasmContext, { width: 16, height: 16, fill: "#FFFFFF00", stroke: "#FFFFFF", strokeThickness: 2.5 })
        });
        sciChartSurface.renderableSeries.add(best, run);
        const legend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight });
        sciChartSurface.chartModifiers.add(
            legend,
            new CursorModifier({ showTooltip: true, showAxisLabels: false }),
            ...zoom()
        );
        return { best, run, legend };
    }
    const elbow = await scoreChart(ui.elbowDiv, "Inertia", "#50C7E0", 0);
    const silhouette = await scoreChart(ui.silhouetteDiv, "Mean silhouette", "#F48420", 2);

    const setXy = (dataSeries, x, y, metadata = undefined) => {
        dataSeries.clear();
        dataSeries.appendRange(x, y, metadata);
    };

    // --- State and controls ---
    let points = []; // the data, in chart units
    let work = []; // the data the algorithm sees: standardised or not
    let scale = scaler([[0, 0]], false);
    let centroids = []; // in work units
    let labels = [];
    let iteration = 0;
    let nextStep = "update"; // the algorithm alternates: assign points, then move centroids
    let converged = false;
    let lastChanged = 0;
    let startSeed = 1;
    let timer;
    let scoresTimer;

    const k = () => Number(ui.kInput.value);

    // Shade the Voronoi cells: each grid cell gets the index of the centroid nearest to its centre
    function drawRegions() {
        const xr = xAxis.visibleRange;
        const yr = yAxis.visibleRange;
        const xStep = (xr.max - xr.min) / GRID;
        const yStep = (yr.max - yr.min) / GRID;
        const z = [];
        for (let row = 0; row < GRID; row++) {
            const line = new Array(GRID);
            for (let col = 0; col < GRID; col++) {
                line[col] = nearest(scale.forward([xr.min + (col + 0.5) * xStep, yr.min + (row + 0.5) * yStep]), centroids);
            }
            z.push(line);
        }
        regionData.xStart = xr.min;
        regionData.xStep = xStep;
        regionData.yStart = yr.min;
        regionData.yStep = yStep;
        regionData.setZValues(z);
    }

    function draw() {
        const meta = labels.map((c) => {
            const colour = c >= 0 ? COLOURS[c] : "#FFFFFF";
            return { isSelected: false, fill: colour, stroke: "#0B1A33" };
        });
        setXy(pointData, points.map((p) => p[0]), points.map((p) => p[1]), meta);
        const shown = centroids.map(scale.back);
        setXy(
            centroidData,
            shown.map((c) => c[0]),
            shown.map((c) => c[1]),
            shown.map((_, c) => ({ isSelected: false, fill: COLOURS[c], stroke: "#FFFFFF" }))
        );
        shown.forEach((c, j) => pathData[j].append(c[0], c[1]));
        drawRegions();
        const currentInertia = inertia(work, labels, centroids);
        const currentSilhouette = meanSilhouette(work, labels, k());
        setXy(elbow.run.dataSeries, [k()], [currentInertia]);
        setXy(silhouette.run.dataSeries, Number.isFinite(currentSilhouette) ? [k()] : [], Number.isFinite(currentSilhouette) ? [currentSilhouette] : []);
        const phase = nextStep === "update" ? `points assigned to the nearest centroid (${lastChanged} changed)` : "centroids moved to the mean of their points";
        ui.status.textContent =
            `Iteration ${iteration}: ${converged ? "converged, no point changed cluster" : phase} · ` +
            `inertia ${currentInertia.toFixed(1)} · silhouette ${Number.isFinite(currentSilhouette) ? currentSilhouette.toFixed(3) : "– (needs k ≥ 2)"} · ` +
            `${points.length} points`;
    }

    // One half-step of Lloyd's algorithm
    function step() {
        if (converged) return;
        if (nextStep === "update") {
            centroids = updateCentroids(work, labels, centroids);
            nextStep = "assign";
        } else {
            iteration++;
            lastChanged = assignPoints(work, centroids, labels);
            converged = lastChanged === 0;
            nextStep = "update";
        }
        draw();
        if (converged) stop();
    }

    function stop() {
        clearInterval(timer);
        timer = undefined;
        ui.runButton.textContent = "Run";
    }
    function run() {
        if (timer) return stop();
        if (converged) restart();
        ui.runButton.textContent = "Pause";
        timer = setInterval(step, 350);
    }

    // Place new starting centroids (seeded, so "New start" gives a different but repeatable start) and assign
    function restart() {
        stop();
        centroids = initialCentroids(work, k(), ui.initSelect.value, seededRandom(startSeed * 7919));
        labels = new Array(work.length).fill(-1);
        lastChanged = assignPoints(work, centroids, labels);
        iteration = 0;
        nextStep = "update";
        converged = false;
        pathData.forEach((d) => d.clear());
        draw();
    }

    // Elbow and silhouette curves: best of 10 k-means++ starts for k = 1 to MAX_K (debounced while clicking points)
    function updateScores() {
        clearTimeout(scoresTimer);
        scoresTimer = setTimeout(() => {
            const ks = [];
            const inertias = [];
            const silhouettes = [];
            for (let kk = 1; kk <= MAX_K; kk++) {
                const random = seededRandom(kk * 101);
                let best;
                for (let s = 0; s < 10; s++) {
                    const result = kMeans(work, kk, "plusplus", random);
                    if (!best || result.inertia < best.inertia) best = result;
                }
                ks.push(kk);
                inertias.push(best.inertia);
                silhouettes.push(meanSilhouette(work, best.labels, kk));
            }
            setXy(elbow.best.dataSeries, ks, inertias);
            setXy(silhouette.best.dataSeries, ks.slice(1), silhouettes.slice(1));
            const bestK = ks.slice(1)[silhouettes.slice(1).indexOf(Math.max(...silhouettes.slice(1)))];
            silhouette.best.dataSeries.dataSeriesName = `Best of 10 starts (peak at k = ${bestK})`;
            silhouette.legend.sciChartLegend?.setRenderableSeriesArray([silhouette.best, silhouette.run]); // show the new name
        }, 120);
    }

    // Work in the scaled or unscaled space, and fit the axes and the heatmap to the data
    function prepareData() {
        scale = scaler(points, ui.scaleCheckbox.checked);
        work = points.map(scale.forward);
        const xs = points.map((p) => p[0]);
        const ys = points.map((p) => p[1]);
        const pad = (min, max) => new NumberRange(min - 0.08 * (max - min), max + 0.08 * (max - min));
        xAxis.visibleRange = pad(Math.min(...xs), Math.max(...xs));
        yAxis.visibleRange = pad(Math.min(...ys), Math.max(...ys));
        updateScores();
    }

    function loadDataset() {
        points = makeDataset(ui.datasetSelect.value);
        prepareData();
        restart();
    }

    // A clicked point joins the nearest cluster; the algorithm carries on from the current centroids
    function addPoint(p) {
        points.push(p);
        work.push(scale.forward(p));
        labels.push(nearest(work[work.length - 1], centroids));
        lastChanged = 1; // the new point
        converged = false;
        nextStep = "update";
        updateScores();
        draw();
    }

    ui.kOutput.textContent = String(k());
    ui.kInput.addEventListener("input", () => {
        ui.kOutput.textContent = String(k());
        restart();
    });
    ui.datasetSelect.addEventListener("change", loadDataset);
    ui.initSelect.addEventListener("change", restart);
    ui.scaleCheckbox.addEventListener("change", () => {
        prepareData();
        restart();
    });
    ui.stepButton.addEventListener("click", () => {
        stop();
        if (converged) restart();
        else step();
    });
    ui.runButton.addEventListener("click", run);
    ui.restartButton.addEventListener("click", () => {
        startSeed++;
        restart();
    });
    ui.resetButton.addEventListener("click", loadDataset);
    // Re-shade the regions after zooming or panning, so they always fill the view
    xAxis.visibleRangeChanged.subscribe(() => centroids.length && drawRegions());
    yAxis.visibleRangeChanged.subscribe(() => centroids.length && drawRegions());

    loadDataset();
    // Play the first run once the chart scrolls into view
    const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
            observer.disconnect();
            run();
        }
    });
    observer.observe(ui.root);
    // #region_A_end
}

kMeansChart("scichart-root");
