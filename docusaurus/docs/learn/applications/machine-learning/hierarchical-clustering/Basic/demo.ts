import * as SciChart from "scichart";

// Sample data: four seeded 2D datasets of 180 to 250 points. Each point keeps the group it was drawn from, so the
// demo can score how well a clustering recovers the groups. The seed is fixed, so the data is the same every time.
function makeDataset(name) {
    let seed = 1996;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const x = [];
    const y = [];
    const group = [];
    const add = (px, py, g) => {
        x.push(px);
        y.push(py);
        group.push(g);
    };
    if (name === "blobs" || name === "outliers") {
        // Four round groups of different sizes and spreads
        const blobs = [
            { cx: -1.3, cy: 0.9, spread: 0.28, count: 50 },
            { cx: 0.9, cy: 1.3, spread: 0.22, count: 40 },
            { cx: -0.2, cy: -1.0, spread: 0.32, count: 55 },
            { cx: 1.6, cy: -0.6, spread: 0.2, count: 35 }
        ];
        blobs.forEach((b, g) => {
            for (let i = 0; i < b.count; i++) add(b.cx + b.spread * gaussian(), b.cy + b.spread * gaussian(), g);
        });
        if (name === "outliers") {
            // A thin trail of 10 points from the left blob to the bottom one, and 10 outliers scattered at random
            for (let i = 1; i <= 10; i++) add(-1.3 + (1.1 * i) / 11 + 0.04 * gaussian(), 0.9 - (1.9 * i) / 11 + 0.04 * gaussian(), 4);
            for (let i = 0; i < 10; i++) add(-2.6 + 5.2 * random(), -2.2 + 4.4 * random(), 4);
        }
    } else if (name === "moons") {
        // Two interleaved half circles
        for (let i = 0; i < 240; i++) {
            const upper = i < 120;
            const t = Math.PI * random();
            const px = upper ? Math.cos(t) : 1 - Math.cos(t);
            const py = upper ? Math.sin(t) : 0.5 - Math.sin(t);
            add(1.6 * (px - 0.5) + 0.09 * gaussian(), 1.6 * (py - 0.25) + 0.09 * gaussian(), upper ? 0 : 1);
        }
    } else {
        // Two rings, one inside the other
        for (let i = 0; i < 250; i++) {
            const inner = i < 80;
            const t = 2 * Math.PI * random();
            const r = inner ? 0.6 : 1.6;
            add(r * Math.cos(t) + 0.08 * gaussian(), r * Math.sin(t) + 0.08 * gaussian(), inner ? 0 : 1);
        }
    }
    const groups = name === "blobs" || name === "outliers" ? 4 : 2; // the trail and the outliers aren't a cluster
    return { x, y, group, groups };
}

// The controls and the charts each need an element. This splits the page's div into a control bar, a readout,
// and the scatter and dendrogram charts side by side; in your app, they can be elements in your HTML.
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
        `<label>Method <select data-id="method" style="font:inherit">` +
        `<option value="tree">Hierarchical</option><option value="dbscan">DBSCAN</option></select></label>` +
        `<label>Dataset <select data-id="dataset" style="font:inherit">` +
        `<option value="blobs">Four blobs</option><option value="outliers">Blobs with outliers</option>` +
        `<option value="moons">Two moons</option><option value="circles">Two rings</option></select></label>` +
        `<label data-mode="tree">Linkage <select data-id="linkage" style="font:inherit">` +
        `<option value="single">Single</option><option value="complete">Complete</option>` +
        `<option value="average">Average</option><option value="ward" selected>Ward</option></select></label>` +
        `<label data-mode="tree">Clusters ${slider("clusters", 1, 12, 1, 4, 110)}</label>` +
        `<label data-mode="dbscan">eps ${slider("eps", 0.05, 0.8, 0.01, 0.35, 120)}</label>` +
        `<label data-mode="dbscan">minPts ${slider("minPts", 2, 15, 1, 5, 100)}</label>`;
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:0 12px 6px; color:#C8D3E8; font-size:13px;" + font;
    const charts = document.createElement("div");
    charts.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const scatterDiv = document.createElement("div");
    scatterDiv.id = divElementId + "-scatter"; // each chart's div needs its own id
    scatterDiv.style.cssText = "flex:1 1 380px; min-height:300px;";
    const treeDiv = document.createElement("div");
    treeDiv.id = divElementId + "-tree";
    treeDiv.style.cssText = "flex:1 1 380px; min-height:300px;";
    charts.append(scatterDiv, treeDiv);
    root.append(bar, readout, charts);
    const get = (selector) => bar.querySelector(selector);
    return {
        scatterDiv,
        treeDiv,
        readout,
        modeGroups: bar.querySelectorAll("[data-mode]"),
        methodSelect: get('select[data-id="method"]'),
        datasetSelect: get('select[data-id="dataset"]'),
        linkageSelect: get('select[data-id="linkage"]'),
        clustersInput: get('input[data-id="clusters"]'),
        clustersOutput: get('output[data-id="clusters"]'),
        epsInput: get('input[data-id="eps"]'),
        epsOutput: get('output[data-id="eps"]'),
        minPtsInput: get('input[data-id="minPts"]'),
        minPtsOutput: get('output[data-id="minPts"]')
    };
}

async function hierarchicalClusteringChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Hierarchical clustering with a dendrogram, and DBSCAN with a k-distance plot, charted with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        FastLineRenderableSeries,
        FastLineSegmentRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        CrossPointMarker,
        XyDataSeries,
        XyxyDataSeries,
        HorizontalLineAnnotation,
        ELabelPlacement,
        EStrokePaletteMode,
        parseColorToUIntArgb,
        LegendModifier,
        ELegendPlacement,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Clustering maths (plain JavaScript, no library needed) ---

    // Agglomerative clustering. Start with every point as its own cluster, then merge the closest pair of clusters
    // n - 1 times. After each merge, the distance from the new cluster to every other cluster comes from the
    // Lance-Williams update for the chosen linkage. Returns the merges in order: the two clusters joined (ids 0 to n-1
    // are points, n + s is the cluster made at step s), the merge height (distance) and the new cluster's size.
    function agglomerate(x, y, linkage) {
        const n = x.length;
        const d = new Float64Array(n * n); // distance matrix, kept symmetric
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) d[i * n + j] = d[j * n + i] = Math.hypot(x[i] - x[j], y[i] - y[j]);
        }
        const size = new Array(n).fill(1);
        const id = Array.from({ length: n }, (_, i) => i); // which cluster each row of the matrix holds now
        const active = new Array(n).fill(true);
        const merges = [];
        for (let step = 0; step < n - 1; step++) {
            let best = Infinity;
            let a = -1;
            let b = -1;
            for (let i = 0; i < n; i++) {
                if (!active[i]) continue;
                for (let j = i + 1; j < n; j++) {
                    if (active[j] && d[i * n + j] < best) {
                        best = d[i * n + j];
                        a = i;
                        b = j;
                    }
                }
            }
            const na = size[a];
            const nb = size[b];
            for (let k = 0; k < n; k++) {
                if (!active[k] || k === a || k === b) continue;
                const dka = d[k * n + a];
                const dkb = d[k * n + b];
                let dist;
                if (linkage === "single") dist = Math.min(dka, dkb); // nearest pair of points
                else if (linkage === "complete") dist = Math.max(dka, dkb); // farthest pair of points
                else if (linkage === "average") dist = (na * dka + nb * dkb) / (na + nb); // mean over all pairs
                else {
                    // Ward: the increase in within-cluster sum of squares, on the same scale as a distance
                    const nk = size[k];
                    dist = Math.sqrt(((na + nk) * dka * dka + (nb + nk) * dkb * dkb - nk * best * best) / (na + nb + nk));
                }
                d[k * n + a] = d[a * n + k] = dist;
            }
            merges.push({ a: id[a], b: id[b], height: best, size: na + nb });
            active[b] = false; // row a now holds the merged cluster
            size[a] = na + nb;
            id[a] = n + step;
        }
        return merges;
    }

    // Place the dendrogram: walk the tree from the top so each cluster's points sit side by side, give each point
    // an x position in that order, and put each merge midway between its two children at its merge height
    function dendrogramLayout(merges, n) {
        const xPos = new Array(2 * n - 1);
        const height = new Array(2 * n - 1).fill(0);
        const order = [];
        const visit = (node) => {
            if (node < n) {
                xPos[node] = order.length;
                order.push(node);
                return;
            }
            const m = merges[node - n];
            visit(m.a);
            visit(m.b);
            xPos[node] = (xPos[m.a] + xPos[m.b]) / 2;
            height[node] = m.height;
        };
        visit(2 * n - 2); // the root
        return { xPos, height, order };
    }

    // Cut the tree into k clusters: undo the last k - 1 merges. Clusters are numbered left to right along the
    // dendrogram. Returns a label for each point, and for each merge its cluster (or -1 if it is above the cut).
    function cutTree(merges, n, k, order) {
        const parent = Array.from({ length: n }, (_, i) => i);
        const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
        const leafOf = Array.from({ length: n }, (_, i) => i); // one point inside each cluster
        merges.forEach((m, s) => {
            leafOf[n + s] = leafOf[m.a];
            if (s < n - k) parent[find(leafOf[m.b])] = find(leafOf[m.a]);
        });
        const number = new Map();
        for (const leaf of order) if (!number.has(find(leaf))) number.set(find(leaf), number.size);
        const labels = Array.from({ length: n }, (_, i) => number.get(find(i)));
        const mergeLabels = merges.map((m, s) => (s < n - k ? labels[leafOf[n + s]] : -1));
        return { labels, mergeLabels };
    }

    // The height to draw the cut line at for k clusters: halfway between the merges either side of the cut
    function cutHeight(merges, k) {
        const n = merges.length + 1;
        const above = k > 1 ? merges[n - k].height : merges[n - 2].height * 1.1;
        const below = k < n ? merges[n - k - 1].height : 0;
        return k > 1 ? (above + below) / 2 : above;
    }

    // DBSCAN (Ester et al., 1996). A core point has at least minPts points (itself included) within eps.
    // Clusters grow from core points through their neighbours; a border point is in reach of a core point but is
    // not core itself; noise is everything else (label -1).
    function dbscan(x, y, eps, minPts) {
        const n = x.length;
        const neighbours = [];
        for (let i = 0; i < n; i++) {
            const list = [];
            for (let j = 0; j < n; j++) if (Math.hypot(x[i] - x[j], y[i] - y[j]) <= eps) list.push(j);
            neighbours.push(list);
        }
        const core = neighbours.map((list) => list.length >= minPts);
        const labels = new Array(n).fill(-1);
        let clusters = 0;
        for (let i = 0; i < n; i++) {
            if (!core[i] || labels[i] !== -1) continue;
            labels[i] = clusters;
            const queue = [i];
            while (queue.length > 0) {
                const p = queue.shift();
                if (!core[p]) continue; // border points join the cluster but don't extend it
                for (const q of neighbours[p]) {
                    if (labels[q] === -1) {
                        labels[q] = clusters;
                        queue.push(q);
                    }
                }
            }
            clusters++;
        }
        return { labels, core, clusters };
    }

    // The k-distance of each point: the distance to its (minPts - 1)th nearest other point, sorted. A point is a
    // DBSCAN core point exactly when its k-distance is at most eps, and the bend in this curve suggests an eps.
    function kDistances(x, y, minPts) {
        const n = x.length;
        const result = [];
        for (let i = 0; i < n; i++) {
            const dist = [];
            for (let j = 0; j < n; j++) if (j !== i) dist.push(Math.hypot(x[i] - x[j], y[i] - y[j]));
            dist.sort((p, q) => p - q);
            result.push(dist[minPts - 2]);
        }
        return result.sort((p, q) => p - q);
    }

    // Adjusted Rand index: agreement between two labellings of the same points, 1 = identical groups, about 0 = chance
    function adjustedRandIndex(a, b) {
        const pairs = (m) => (m * (m - 1)) / 2;
        const cells = new Map();
        const rows = new Map();
        const cols = new Map();
        for (let i = 0; i < a.length; i++) {
            const key = a[i] + "," + b[i];
            cells.set(key, (cells.get(key) || 0) + 1);
            rows.set(a[i], (rows.get(a[i]) || 0) + 1);
            cols.set(b[i], (cols.get(b[i]) || 0) + 1);
        }
        const sum = (map) => [...map.values()].reduce((s, m) => s + pairs(m), 0);
        const index = sum(cells);
        const expected = (sum(rows) * sum(cols)) / pairs(a.length);
        const max = (sum(rows) + sum(cols)) / 2;
        return max === expected ? 1 : (index - expected) / (max - expected);
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const COLOURS = ["#50C7E0", "#F48420", "#3BD16F", "#E36FD4", "#F6E05E", "#9B8CFF", "#FF6B6B", "#2EC4B6", "#C9A227", "#7FB2FF", "#FF9FB2", "#A3E635"];
    const ABOVE_CUT = "#8A9BB8";
    const NOISE = "#C8D3E8";
    const BACKGROUND = "#22365B";

    // 1. The scatter plot, coloured by cluster. A palette provider gives each point its own colour, so one series
    // draws every cluster. DBSCAN border points are drawn as rings and noise as crosses.
    const scatter = await SciChartSurface.create(ui.scatterDiv, { theme });
    const xAxis = new NumericAxis(scatter.wasmContext, { axisTitle: "Feature 1", labelPrecision: 1 });
    const yAxis = new NumericAxis(scatter.wasmContext, { axisTitle: "Feature 2", labelPrecision: 1 });
    scatter.sciChartSurface.xAxes.add(xAxis);
    scatter.sciChartSurface.yAxes.add(yAxis);
    function colouredScatter(name, size, hollow) {
        const colours = []; // one colour per point, in the order the points are appended
        const paletteProvider = {
            strokePaletteMode: EStrokePaletteMode.SOLID,
            onAttached: () => {},
            onDetached: () => {},
            overridePointMarkerArgb: (px, py, index) => {
                const argb = parseColorToUIntArgb(colours[index] || NOISE);
                return { stroke: argb, fill: hollow ? parseColorToUIntArgb(BACKGROUND) : argb };
            }
        };
        const series = new XyScatterRenderableSeries(scatter.wasmContext, {
            dataSeries: new XyDataSeries(scatter.wasmContext, { dataSeriesName: name }),
            pointMarker: new EllipsePointMarker(scatter.wasmContext, { width: size, height: size, strokeThickness: hollow ? 2 : 1, fill: hollow ? BACKGROUND : "#50C7E0", stroke: "#50C7E0" }),
            paletteProvider
        });
        scatter.sciChartSurface.renderableSeries.add(series);
        return { series, colours };
    }
    const corePoints = colouredScatter("Points", 9, false);
    const borderPoints = colouredScatter("Border points", 9, true);
    const noisePoints = new XyScatterRenderableSeries(scatter.wasmContext, {
        dataSeries: new XyDataSeries(scatter.wasmContext, { dataSeriesName: "Noise" }),
        pointMarker: new CrossPointMarker(scatter.wasmContext, { width: 9, height: 9, stroke: NOISE, strokeThickness: 2 })
    });
    scatter.sciChartSurface.renderableSeries.add(noisePoints);
    const scatterLegend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopLeft });
    scatter.sciChartSurface.chartModifiers.add(
        scatterLegend,
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // 2. The dendrogram. SciChart.js has no dendrogram series, so each merge is drawn as three line segments
    // (up, across, down) in a FastLineSegmentRenderableSeries: one series per cluster colour, and one for the
    // merges above the cut. The same chart shows the k-distance plot in DBSCAN mode.
    const tree = await SciChartSurface.create(ui.treeDiv, { theme });
    const treeXAxis = new NumericAxis(tree.wasmContext, { axisTitle: "Points, in dendrogram order", drawLabels: false, drawMajorTickLines: false, drawMinorTickLines: false });
    const treeYAxis = new NumericAxis(tree.wasmContext, { axisTitle: "Merge height (distance)", autoRange: EAutoRange.Always, growBy: new NumberRange(0.1, 0.08), labelPrecision: 2 });
    tree.sciChartSurface.xAxes.add(treeXAxis);
    tree.sciChartSurface.yAxes.add(treeYAxis);
    const linkSeries = [...COLOURS, ABOVE_CUT].map((colour) => {
        const segments = new XyxyDataSeries(tree.wasmContext); // x1, y1, x2, y2 for each segment
        const series = new FastLineSegmentRenderableSeries(tree.wasmContext, {
            dataSeries: segments,
            stroke: colour,
            strokeThickness: colour === ABOVE_CUT ? 2 : 1.5
        });
        tree.sciChartSurface.renderableSeries.add(series);
        return { series, segments };
    });
    const kDistanceLine = new FastLineRenderableSeries(tree.wasmContext, {
        dataSeries: new XyDataSeries(tree.wasmContext, { dataSeriesName: "k-distance" }),
        stroke: "#50C7E0",
        strokeThickness: 2.5
    });
    tree.sciChartSurface.renderableSeries.add(kDistanceLine);
    const cutLine = new HorizontalLineAnnotation({
        y1: 1,
        stroke: "#FFFFFF",
        strokeThickness: 2,
        strokeDashArray: [6, 4],
        isEditable: true, // drag the line to cut the tree (or to set eps)
        showLabel: true,
        labelPlacement: ELabelPlacement.Axis,
        axisLabelFill: "#FFFFFF",
        axisLabelStroke: BACKGROUND
    });
    tree.sciChartSurface.annotations.add(cutLine);
    // No ZoomPanModifier here, so a drag always moves the cut line
    tree.sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomExtentsModifier());

    const setPoints = (series, x, y) => {
        series.dataSeries.clear();
        series.dataSeries.appendRange(x, y);
    };

    // --- The controls ---
    let data;
    let merges;
    let layout;

    // New dataset or linkage: recluster, redraw the points and fit the axes
    function onDataChanged() {
        data = makeDataset(ui.datasetSelect.value);
        merges = agglomerate(data.x, data.y, ui.linkageSelect.value);
        layout = dendrogramLayout(merges, data.x.length);
        const pad = 0.3;
        xAxis.visibleRange = new NumberRange(Math.min(...data.x) - pad, Math.max(...data.x) + pad);
        yAxis.visibleRange = new NumberRange(Math.min(...data.y) - pad, Math.max(...data.y) + 3 * pad); // room for the legend
        treeXAxis.visibleRange = new NumberRange(-0.08 * data.x.length, data.x.length + 1); // room for the watermark
        onSettingsChanged();
    }

    // Method, cluster count, eps or minPts changed: recolour without reclustering
    function onSettingsChanged(fromDrag = false) {
        const isTree = ui.methodSelect.value === "tree";
        ui.modeGroups.forEach((el) => el.toggleAttribute("hidden", (el.getAttribute("data-mode") === "tree") !== isTree));
        for (const link of linkSeries) link.series.isVisible = isTree;
        kDistanceLine.isVisible = !isTree;
        borderPoints.series.isVisible = !isTree;
        noisePoints.isVisible = !isTree;
        corePoints.series.dataSeries.dataSeriesName = isTree ? "Points" : "Core points";
        scatterLegend.sciChartLegend?.setRenderableSeriesArray(isTree ? [] : [corePoints.series, borderPoints.series, noisePoints]);
        if (isTree) drawTree(fromDrag);
        else drawDbscan(fromDrag);
    }

    function drawTree(fromDrag) {
        const n = data.x.length;
        const k = Number(ui.clustersInput.value);
        ui.clustersOutput.textContent = String(k);
        treeXAxis.axisTitle = "Points, in dendrogram order";
        treeYAxis.axisTitle = "Merge height (distance)";
        if (!fromDrag) cutLine.y1 = cutHeight(merges, k);
        cutLine.labelValue = `${k} cluster${k > 1 ? "s" : ""}`;
        const { labels, mergeLabels } = cutTree(merges, n, k, layout.order);

        // Three segments per merge, into the series for its cluster's colour (or the grey one above the cut)
        const segments = linkSeries.map(() => ({ x1: [], y1: [], x2: [], y2: [] }));
        merges.forEach((m, s) => {
            const into = segments[mergeLabels[s] === -1 ? COLOURS.length : mergeLabels[s] % COLOURS.length];
            const xa = layout.xPos[m.a];
            const xb = layout.xPos[m.b];
            const ha = layout.height[m.a];
            const hb = layout.height[m.b];
            for (const [x1, y1, x2, y2] of [[xa, ha, xa, m.height], [xa, m.height, xb, m.height], [xb, m.height, xb, hb]]) {
                into.x1.push(x1);
                into.y1.push(y1);
                into.x2.push(x2);
                into.y2.push(y2);
            }
        });
        linkSeries.forEach((link, i) => {
            link.segments.clear();
            link.segments.appendRange(segments[i].x1, segments[i].y1, segments[i].x2, segments[i].y2);
        });

        corePoints.colours.length = 0;
        labels.forEach((label) => corePoints.colours.push(COLOURS[label % COLOURS.length]));
        setPoints(corePoints.series, data.x, data.y);
        corePoints.series.dataSeries.dataSeriesName = "Points";
        setPoints(borderPoints.series, [], []);
        setPoints(noisePoints, [], []);

        const sizes = new Array(k).fill(0);
        labels.forEach((label) => sizes[label]++);
        const truth = data.group.map((g) => (g >= data.groups ? data.groups : g)); // outliers count as one group
        ui.readout.textContent =
            `${k} cluster${k > 1 ? "s" : ""}, cut between merge heights ${(k < n ? merges[n - k - 1].height : 0).toFixed(2)} ` +
            `and ${(k > 1 ? merges[n - k].height : Infinity).toFixed(2)} · sizes ${sizes.join(", ")} · ` +
            `agreement with the true groups (adjusted Rand index) ${adjustedRandIndex(labels, truth).toFixed(2)}`;
    }

    function drawDbscan(fromDrag) {
        const eps = Number(ui.epsInput.value);
        const minPts = Number(ui.minPtsInput.value);
        ui.epsOutput.textContent = eps.toFixed(2);
        ui.minPtsOutput.textContent = String(minPts);
        treeXAxis.axisTitle = "Points, sorted by k-distance";
        treeYAxis.axisTitle = `Distance to neighbour no. ${minPts - 1}`;
        const kd = kDistances(data.x, data.y, minPts);
        setPoints(kDistanceLine, kd.map((_, i) => i), kd);
        if (!fromDrag) cutLine.y1 = eps;
        cutLine.labelValue = `eps ${eps.toFixed(2)}`;

        const { labels, core, clusters } = dbscan(data.x, data.y, eps, minPts);
        const coreXy = { x: [], y: [] };
        const borderXy = { x: [], y: [] };
        const noiseXy = { x: [], y: [] };
        corePoints.colours.length = 0;
        borderPoints.colours.length = 0;
        labels.forEach((label, i) => {
            if (label === -1) {
                noiseXy.x.push(data.x[i]);
                noiseXy.y.push(data.y[i]);
            } else if (core[i]) {
                coreXy.x.push(data.x[i]);
                coreXy.y.push(data.y[i]);
                corePoints.colours.push(COLOURS[label % COLOURS.length]);
            } else {
                borderXy.x.push(data.x[i]);
                borderXy.y.push(data.y[i]);
                borderPoints.colours.push(COLOURS[label % COLOURS.length]);
            }
        });
        setPoints(corePoints.series, coreXy.x, coreXy.y);
        setPoints(borderPoints.series, borderXy.x, borderXy.y);
        setPoints(noisePoints, noiseXy.x, noiseXy.y);

        const truth = data.group.map((g) => (g >= data.groups ? data.groups : g));
        ui.readout.textContent =
            `${clusters} cluster${clusters === 1 ? "" : "s"} · ${coreXy.x.length} core, ${borderXy.x.length} border, ` +
            `${noiseXy.x.length} noise points · adjusted Rand index ${adjustedRandIndex(labels, truth).toFixed(2)} ` +
            `(noise counted as one group)`;
    }

    // Dragging the cut line sets the number of clusters (or eps); the line snaps to a clean cut when you let go
    function onCutDragged() {
        if (ui.methodSelect.value === "tree") {
            const n = data.x.length;
            const below = merges.filter((m) => m.height <= cutLine.y1).length;
            ui.clustersInput.value = String(Math.max(1, Math.min(12, n - below)));
        } else {
            ui.epsInput.value = String(Math.max(0.05, Math.min(0.8, cutLine.y1)));
        }
        onSettingsChanged(true);
    }
    cutLine.dragDelta.subscribe(onCutDragged);
    cutLine.dragEnded.subscribe(() => onSettingsChanged());

    ui.datasetSelect.addEventListener("change", () => {
        ui.clustersInput.value = String(makeDataset(ui.datasetSelect.value).groups);
        onDataChanged();
    });
    ui.linkageSelect.addEventListener("change", onDataChanged);
    ui.methodSelect.addEventListener("change", () => onSettingsChanged());
    for (const input of [ui.clustersInput, ui.epsInput, ui.minPtsInput]) input.addEventListener("input", () => onSettingsChanged());
    onDataChanged();
    // #region_A_end
}

hierarchicalClusteringChart("scichart-root");
