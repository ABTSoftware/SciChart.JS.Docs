import * as SciChart from "scichart";

const SAMPLE_SIZE = 100; // points per dataset, half in each class
const TEST_SHARE = 0.4; // 40% of the points are held out to measure accuracy
const DATASETS = [
    { key: "moons", name: "Moons" },
    { key: "circles", name: "Circles" },
    { key: "linear", name: "Linear" }
];

// A small seeded random generator, so the data is the same on every visit
function seededRandom(seed) {
    let state = seed % 2147483647;
    if (state <= 0) state += 2147483646;
    return () => {
        state = (state * 16807) % 2147483647;
        return (state - 1) / 2147483646;
    };
}

// Sample data: three synthetic two-class datasets, each point {x, y, label} with label 0 (red) or 1 (blue).
// moons: two interleaved half circles; circles: a ring around a smaller ring; linear: two overlapping round clusters.
// noise is the standard deviation of the jitter added to each point (two thirds of it for circles; for linear it
// widens the clusters). The points are shuffled, split into training and test sets and standardised with the
// training set's mean and standard deviation, as you would before fitting a model.
function makeDataset(kind, noise, seed) {
    const random = seededRandom(seed);
    const gaussian = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const points = [];
    const half = SAMPLE_SIZE / 2;
    for (let i = 0; i < half; i++) {
        if (kind === "moons") {
            const t = (Math.PI * i) / (half - 1);
            points.push({ x: Math.cos(t) + noise * gaussian(), y: Math.sin(t) + noise * gaussian(), label: 0 });
            points.push({ x: 1 - Math.cos(t) + noise * gaussian(), y: 0.5 - Math.sin(t) + noise * gaussian(), label: 1 });
        } else if (kind === "circles") {
            const t = (2 * Math.PI * i) / half;
            const s = (noise * 2) / 3;
            points.push({ x: Math.cos(t) + s * gaussian(), y: Math.sin(t) + s * gaussian(), label: 0 });
            points.push({ x: 0.5 * Math.cos(t) + s * gaussian(), y: 0.5 * Math.sin(t) + s * gaussian(), label: 1 });
        } else {
            const s = 0.5 + 1.5 * noise;
            points.push({ x: -1 + s * gaussian(), y: -1 + s * gaussian(), label: 0 });
            points.push({ x: 1 + s * gaussian(), y: 1 + s * gaussian(), label: 1 });
        }
    }
    for (let i = points.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [points[i], points[j]] = [points[j], points[i]];
    }
    const nTest = Math.round(points.length * TEST_SHARE);
    const train = points.slice(nTest);
    const test = points.slice(0, nTest);
    const mean = (key) => train.reduce((sum, p) => sum + p[key], 0) / train.length;
    const sd = (key, m) => Math.sqrt(train.reduce((sum, p) => sum + (p[key] - m) ** 2, 0) / train.length);
    const mx = mean("x");
    const my = mean("y");
    const sx = sd("x", mx);
    const sy = sd("y", my);
    for (const p of points) {
        p.x = (p.x - mx) / sx;
        p.y = (p.y - my) / sy;
    }
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const range = {
        xMin: Math.min(...xs) - 0.5,
        xMax: Math.max(...xs) + 0.5,
        yMin: Math.min(...ys) - 0.5,
        yMax: Math.max(...ys) + 0.5
    };
    return { train, test, range };
}

// The controls and the charts each need an element. This splits the page's div into a control bar, a grid of
// panels (one per dataset and classifier) and a status line; in your app, they can be elements in your HTML.
function createLayout(divElementId, classifierNames) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Dataset <select data-id="dataset" style="font:inherit"><option value="all" selected>All three</option>` +
        DATASETS.map((d) => `<option value="${d.key}">${d.name}</option>`).join("") +
        `</select></label>` +
        `<label>Noise <input data-id="noise" type="range" min="0" max="0.6" step="0.05" value="0.3" ` +
        `style="vertical-align:middle; width:100px"> <output data-id="noise"></output></label>` +
        `<button data-id="sample" type="button" style="font:inherit">New sample</button>` +
        `<label>Tune <select data-id="tune" style="font:inherit">` +
        `<option value="k" selected>Nearest neighbours: k</option><option value="lrC">Logistic regression: C</option>` +
        `<option value="depth">Decision tree: max depth</option><option value="trees">Random forest: trees</option>` +
        `<option value="gamma">RBF SVM: gamma</option><option value="svmC">RBF SVM: C</option></select></label>` +
        `<label><input data-id="value" type="range" style="vertical-align:middle; width:120px"> <output data-id="value"></output></label>` +
        `<label>Click adds <select data-id="clickClass" style="font:inherit">` +
        `<option value="0">red points</option><option value="1">blue points</option></select></label>`;
    const grid = document.createElement("div");
    grid.style.cssText = "flex:1; min-height:0; display:grid; gap:6px; padding:4px 8px; color:#E8EDF5; overflow-x:auto;" + font;
    const rowLabels = DATASETS.map((d) => {
        const label = document.createElement("div");
        label.textContent = d.name;
        label.style.cssText = "align-self:center; font-size:13px; padding-right:2px;";
        grid.append(label);
        return label;
    });
    // cells[dataset][classifier]: a caption above a chart div
    const cells = DATASETS.map((d, row) =>
        classifierNames.map((_, col) => {
            const cell = document.createElement("div");
            cell.style.cssText = "display:flex; flex-direction:column; min-width:0; min-height:0; border-radius:4px;";
            const caption = document.createElement("div");
            caption.style.cssText = "font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding:1px 2px;";
            const chartDiv = document.createElement("div");
            chartDiv.id = `${divElementId}-${row}-${col}`; // each chart's div needs its own id
            chartDiv.style.cssText = "flex:1; min-height:60px;";
            cell.append(caption, chartDiv);
            grid.append(cell);
            return { cell, caption, chartDiv };
        })
    );
    const status = document.createElement("div");
    status.setAttribute("aria-live", "polite");
    status.style.cssText = "padding:4px 12px 6px; color:#C8D3E8; font-size:13px; min-height:18px;" + font;
    root.append(bar, grid, status);
    const get = (selector) => bar.querySelector(selector);
    return {
        grid,
        rowLabels,
        cells,
        status,
        datasetSelect: get('select[data-id="dataset"]'),
        noiseInput: get('input[data-id="noise"]'),
        noiseOutput: get('output[data-id="noise"]'),
        sampleButton: get('button[data-id="sample"]'),
        tuneSelect: get('select[data-id="tune"]'),
        valueInput: get('input[data-id="value"]'),
        valueOutput: get('output[data-id="value"]'),
        clickClassSelect: get('select[data-id="clickClass"]')
    };
}

async function decisionBoundaryChart(divElementId) {
    // #region_A_start
    // Decision boundaries of six classifiers on three datasets, trained in the browser and charted with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        Thickness,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        UniformContoursRenderableSeries,
        HeatmapColorMap,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        CustomChartModifier2D,
        translateFromCanvasToSeriesViewRect,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Classifiers (plain JavaScript, no library needed) ---
    // Each one trains on points {x, y, label} and returns predict(x, y): the probability of class 1 (blue).

    // k-nearest neighbours: the share of the k closest training points that are blue
    function trainKnn(train, k) {
        const kk = Math.max(1, Math.min(k, train.length));
        return (x, y) => {
            const best = []; // the kk smallest squared distances so far, in order, with their labels
            for (const p of train) {
                const d = (p.x - x) ** 2 + (p.y - y) ** 2;
                if (best.length === kk && d >= best[kk - 1].d) continue;
                let j = best.length < kk ? best.length : kk - 1;
                while (j > 0 && best[j - 1].d > d) {
                    best[j] = best[j - 1];
                    j--;
                }
                best[j] = { d, label: p.label };
            }
            return best.reduce((sum, b) => sum + b.label, 0) / kk;
        };
    }

    // Logistic regression with an L2 penalty: minimise ½|w|² + C × (log loss), fitted with Newton's method.
    // The boundary w0 + w1·x + w2·y = 0 is always a straight line.
    function trainLogistic(train, C) {
        let w = [0, 0, 0];
        for (let iteration = 0; iteration < 50; iteration++) {
            const gradient = [0, w[1], w[2]]; // the penalty's gradient (the intercept w0 isn't penalised)
            const hessian = [[1e-9, 0, 0], [0, 1, 0], [0, 0, 1]];
            for (const p of train) {
                const f = [1, p.x, p.y];
                const prob = 1 / (1 + Math.exp(-(w[0] + w[1] * p.x + w[2] * p.y)));
                for (let a = 0; a < 3; a++) {
                    gradient[a] += C * (prob - p.label) * f[a];
                    for (let b = 0; b < 3; b++) hessian[a][b] += C * prob * (1 - prob) * f[a] * f[b];
                }
            }
            const step = solve3(hessian, gradient);
            w = w.map((value, a) => value - step[a]);
            if (Math.max(...step.map(Math.abs)) < 1e-10) break;
        }
        return (x, y) => 1 / (1 + Math.exp(-(w[0] + w[1] * x + w[2] * y)));
    }

    // Solve a 3 × 3 linear system by Gaussian elimination with partial pivoting
    function solve3(A, b) {
        const m = A.map((row, i) => [...row, b[i]]);
        for (let c = 0; c < 3; c++) {
            let pivot = c;
            for (let r = c + 1; r < 3; r++) if (Math.abs(m[r][c]) > Math.abs(m[pivot][c])) pivot = r;
            [m[c], m[pivot]] = [m[pivot], m[c]];
            for (let r = c + 1; r < 3; r++) {
                const factor = m[r][c] / m[c][c];
                for (let k = c; k < 4; k++) m[r][k] -= factor * m[c][k];
            }
        }
        const out = [0, 0, 0];
        for (let r = 2; r >= 0; r--) {
            let sum = m[r][3];
            for (let k = r + 1; k < 3; k++) sum -= m[r][k] * out[k];
            out[r] = sum / m[r][r];
        }
        return out;
    }

    // Decision tree (CART): split on x or y at the threshold that minimises the Gini impurity of the two halves,
    // until maxDepth or until a node is pure. Each leaf predicts the share of blue training points in it.
    // With random (a random forest), each split tries one feature chosen at random, and the other only if
    // the first can't split the node.
    function buildTree(points, depth, maxDepth, random) {
        const ones = points.reduce((sum, p) => sum + p.label, 0);
        const leaf = { p: ones / points.length };
        if (depth >= maxDepth || ones === 0 || ones === points.length) return leaf;
        const features = random && random() < 0.5 ? ["y", "x"] : ["x", "y"];
        const gini = (n, k) => (n === 0 ? 0 : n * (1 - (k / n) ** 2 - (1 - k / n) ** 2)); // n × impurity
        let best;
        for (const feature of features) {
            if (random && best) break;
            const sorted = points.slice().sort((a, b) => a[feature] - b[feature]);
            let leftN = 0;
            let leftOnes = 0;
            for (let i = 0; i < sorted.length - 1; i++) {
                leftN++;
                leftOnes += sorted[i].label;
                if (sorted[i][feature] === sorted[i + 1][feature]) continue; // can't split between equal values
                const score = gini(leftN, leftOnes) + gini(sorted.length - leftN, ones - leftOnes);
                if (!best || score < best.score) best = { feature, threshold: (sorted[i][feature] + sorted[i + 1][feature]) / 2, score };
            }
        }
        if (!best) return leaf;
        const left = points.filter((p) => p[best.feature] <= best.threshold);
        const right = points.filter((p) => p[best.feature] > best.threshold);
        return {
            feature: best.feature,
            threshold: best.threshold,
            left: buildTree(left, depth + 1, maxDepth, random),
            right: buildTree(right, depth + 1, maxDepth, random)
        };
    }
    function predictTree(node, point) {
        while (node.feature) node = point[node.feature] <= node.threshold ? node.left : node.right;
        return node.p;
    }
    function trainTree(train, maxDepth) {
        const tree = buildTree(train, 0, maxDepth, undefined); // no random: every split tries both features
        return (x, y) => predictTree(tree, { x, y });
    }

    // Random forest: nTrees trees of depth 5, each grown on a bootstrap sample (n points drawn with replacement)
    // with a random feature per split. The prediction is the average of the trees' leaf probabilities.
    // Tree t always uses the same seed, so adding trees keeps the earlier ones.
    function trainForest(train, nTrees) {
        const trees = [];
        for (let t = 0; t < nTrees; t++) {
            const random = seededRandom(1000 + 7919 * t);
            const sample = train.map(() => train[Math.floor(random() * train.length)]);
            trees.push(buildTree(sample, 0, 5, random));
        }
        return (x, y) => trees.reduce((sum, tree) => sum + predictTree(tree, { x, y }), 0) / trees.length;
    }

    // Gaussian naive Bayes: each class is modelled as a normal distribution per feature, with the features
    // assumed independent. Bayes' rule turns the two likelihoods and the class shares into a probability.
    function trainNaiveBayes(train) {
        const stats = [0, 1].map((label) => {
            const pts = train.filter((p) => p.label === label);
            const mean = (key) => pts.reduce((sum, p) => sum + p[key], 0) / pts.length;
            const mx = mean("x");
            const my = mean("y");
            const vx = pts.reduce((sum, p) => sum + (p.x - mx) ** 2, 0) / pts.length + 1e-9;
            const vy = pts.reduce((sum, p) => sum + (p.y - my) ** 2, 0) / pts.length + 1e-9;
            return { mx, my, vx, vy, logPrior: Math.log(pts.length / train.length) };
        });
        const logLikelihood = (s, x, y) =>
            s.logPrior - 0.5 * (Math.log(2 * Math.PI * s.vx) + (x - s.mx) ** 2 / s.vx + Math.log(2 * Math.PI * s.vy) + (y - s.my) ** 2 / s.vy);
        return (x, y) => 1 / (1 + Math.exp(logLikelihood(stats[0], x, y) - logLikelihood(stats[1], x, y)));
    }

    // Support vector machine with an RBF kernel K(a, b) = exp(−gamma × |a − b|²), trained with SMO
    // (sequential minimal optimisation: repeatedly optimise the pair of points that most violates the
    // optimality conditions, as LIBSVM does). The decision function is f = Σ αᵢ yᵢ K(xᵢ, x) − ρ.
    // An SVM gives a signed distance, not a probability: the shading is 1 / (1 + e^(−2f)), so the margins
    // (f = ±1) are at 0.12 and 0.88.
    function trainRbfSvm(train, C, gamma) {
        const n = train.length;
        const y = train.map((p) => (p.label === 1 ? 1 : -1));
        const K = new Float64Array(n * n);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) K[i * n + j] = Math.exp(-gamma * ((train[i].x - train[j].x) ** 2 + (train[i].y - train[j].y) ** 2));
        }
        const alpha = new Float64Array(n);
        const G = new Float64Array(n).fill(-1); // gradient of the dual objective
        for (let iteration = 0; iteration < 100000; iteration++) {
            // The maximal violating pair: i can move up, j can move down
            let i = -1;
            let j = -1;
            let gMax = -Infinity;
            let gMin = Infinity;
            for (let t = 0; t < n; t++) {
                const v = -y[t] * G[t];
                if ((y[t] === 1 && alpha[t] < C) || (y[t] === -1 && alpha[t] > 0)) {
                    if (v > gMax) [gMax, i] = [v, t];
                }
                if ((y[t] === 1 && alpha[t] > 0) || (y[t] === -1 && alpha[t] < C)) {
                    if (v < gMin) [gMin, j] = [v, t];
                }
            }
            if (gMax - gMin < 1e-3) break; // optimal to within the tolerance
            const quad = Math.max(K[i * n + i] + K[j * n + j] - 2 * K[i * n + j], 1e-12);
            const oldI = alpha[i];
            const oldJ = alpha[j];
            if (y[i] !== y[j]) {
                const delta = (-G[i] - G[j]) / quad;
                const diff = alpha[i] - alpha[j];
                alpha[i] += delta;
                alpha[j] += delta;
                if (diff > 0 && alpha[j] < 0) [alpha[j], alpha[i]] = [0, diff];
                if (diff <= 0 && alpha[i] < 0) [alpha[i], alpha[j]] = [0, -diff];
                if (diff > 0 && alpha[i] > C) [alpha[i], alpha[j]] = [C, C - diff];
                if (diff <= 0 && alpha[j] > C) [alpha[j], alpha[i]] = [C, C + diff];
            } else {
                const delta = (G[i] - G[j]) / quad;
                const sum = alpha[i] + alpha[j];
                alpha[i] -= delta;
                alpha[j] += delta;
                if (sum > C && alpha[i] > C) [alpha[i], alpha[j]] = [C, sum - C];
                if (sum <= C && alpha[j] < 0) [alpha[j], alpha[i]] = [0, sum];
                if (sum > C && alpha[j] > C) [alpha[j], alpha[i]] = [C, sum - C];
                if (sum <= C && alpha[i] < 0) [alpha[i], alpha[j]] = [0, sum];
            }
            const dI = alpha[i] - oldI;
            const dJ = alpha[j] - oldJ;
            for (let k = 0; k < n; k++) G[k] += y[k] * (y[i] * K[i * n + k] * dI + y[j] * K[j * n + k] * dJ);
        }
        // The offset ρ: the average of yᵢGᵢ over the free support vectors (0 < α < C)
        let nFree = 0;
        let sumFree = 0;
        let upper = Infinity;
        let lower = -Infinity;
        for (let t = 0; t < n; t++) {
            const yG = y[t] * G[t];
            if (alpha[t] > 0 && alpha[t] < C) {
                nFree++;
                sumFree += yG;
            } else if ((alpha[t] >= C) === (y[t] === -1)) upper = Math.min(upper, yG);
            else lower = Math.max(lower, yG);
        }
        const rho = nFree > 0 ? sumFree / nFree : (upper + lower) / 2;
        const supportVectors = train.map((p, t) => ({ p, coef: alpha[t] * y[t] })).filter((s) => s.coef !== 0);
        return (x, yValue) => {
            let f = -rho;
            for (const s of supportVectors) f += s.coef * Math.exp(-gamma * ((s.p.x - x) ** 2 + (s.p.y - yValue) ** 2));
            return 1 / (1 + Math.exp(-2 * f));
        };
    }

    // The classifiers, in panel order, with their tunable settings
    const settings = { k: 5, lrC: 1, depth: 5, trees: 30, gamma: 2, svmC: 1 };
    const CLASSIFIERS = [
        { name: "Nearest neighbours", tunes: ["k"], caption: () => `k-NN, k = ${settings.k}`, train: (t) => trainKnn(t, settings.k) },
        { name: "Logistic regression", tunes: ["lrC"], caption: () => `Logistic, C = ${fmt(settings.lrC)}`, train: (t) => trainLogistic(t, settings.lrC) },
        { name: "Decision tree", tunes: ["depth"], caption: () => `Tree, depth ${settings.depth}`, train: (t) => trainTree(t, settings.depth) },
        { name: "Random forest", tunes: ["trees"], caption: () => `Forest, ${settings.trees} trees`, train: (t) => trainForest(t, settings.trees) },
        { name: "Naive Bayes", tunes: [], caption: () => "Naive Bayes", train: (t) => trainNaiveBayes(t) },
        {
            name: "RBF SVM",
            tunes: ["gamma", "svmC"],
            caption: () => `RBF SVM, γ ${fmt(settings.gamma)}, C ${fmt(settings.svmC)}`,
            train: (t) => trainRbfSvm(t, settings.svmC, settings.gamma)
        }
    ];
    // Slider ranges for each setting; C and gamma use a log scale
    const TUNING = {
        k: { min: 1, max: 30, step: 1, log: false },
        lrC: { min: -2, max: 2, step: 0.1, log: true },
        depth: { min: 1, max: 12, step: 1, log: false },
        trees: { min: 1, max: 100, step: 1, log: false },
        gamma: { min: -1, max: 2, step: 0.1, log: true },
        svmC: { min: -2, max: 3, step: 0.1, log: true }
    };
    function fmt(v) {
        return v >= 10 ? v.toFixed(0) : v >= 1 ? String(Number(v.toFixed(1))) : String(Number(v.toPrecision(2)));
    }

    const ui = createLayout(divElementId, CLASSIFIERS.map((c) => c.name));

    // --- The charts: one SciChartSurface per panel, holding a probability heatmap, the 0.5 contour and the points ---
    const GRID = 100; // the model is evaluated on a 100 × 100 grid per panel
    const RED = "#FF5A5F";
    const BLUE = "#4FA3FF";
    const theme = new SciChartJsNavyTheme();
    // Diverging colour map: red (P = 0) through pale grey at the boundary (P = 0.5) to blue (P = 1)
    const colorMap = new HeatmapColorMap({
        minimum: -0.01, // a little beyond 0 to 1, so cells at exactly 0 or 1 always get the end colours
        maximum: 1.01,
        gradientStops: [
            { offset: 0, color: "#7A1424" },
            { offset: 0.3, color: "#C2505A" },
            { offset: 0.5, color: "#E6E6EA" },
            { offset: 0.7, color: "#4C86C6" },
            { offset: 1, color: "#123A7A" }
        ]
    });

    let noise = 0.3;
    let sampleSeed = 1;
    const datasets = DATASETS.map((d, row) => ({ ...makeDataset(d.key, noise, sampleSeed + 10 * row), added: [] }));
    const panels = [];

    // Click on a panel to add a training point; hover to read the model's probability
    class PanelModifier extends CustomChartModifier2D {
        row = 0;
        col = 0;
        downPoint = undefined;
        toData(args) {
            const surface = this.parentSurface;
            const p = translateFromCanvasToSeriesViewRect(args.mousePoint, surface.seriesViewRect);
            if (!p) return undefined;
            return {
                x: surface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(p.x),
                y: surface.yAxes.get(0).getCurrentCoordinateCalculator().getDataValue(p.y)
            };
        }
        modifierMouseDown(args) {
            super.modifierMouseDown(args);
            this.downPoint = args.mousePoint;
        }
        modifierMouseUp(args) {
            super.modifierMouseUp(args);
            const down = this.downPoint;
            this.downPoint = undefined;
            if (!down || Math.hypot(args.mousePoint.x - down.x, args.mousePoint.y - down.y) > 5) return; // a drag, not a click
            const point = this.toData(args);
            if (!point) return;
            datasets[this.row].added.push({ x: point.x, y: point.y, label: Number(ui.clickClassSelect.value) });
            for (let col = 0; col < CLASSIFIERS.length; col++) updatePanel(this.row, col);
        }
        modifierMouseMove(args) {
            super.modifierMouseMove(args);
            const point = this.toData(args);
            const panel = panels[this.row][this.col];
            if (!point || !panel.predict) return;
            const p = panel.predict(point.x, point.y);
            ui.status.textContent =
                `${DATASETS[this.row].name}, ${CLASSIFIERS[this.col].name}: P(blue) = ${p.toFixed(2)} at ` +
                `(${point.x.toFixed(2)}, ${point.y.toFixed(2)}), predicted ${p >= 0.5 ? "blue" : "red"}`;
        }
    }

    async function createPanel(row, col) {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.cells[row][col].chartDiv, {
            theme,
            padding: new Thickness(0, 0, 0, 0)
        });
        const axisOptions = { isVisible: false, drawMajorGridLines: false, drawMinorGridLines: false, drawMajorBands: false };
        const xAxis = new NumericAxis(wasmContext, axisOptions);
        const yAxis = new NumericAxis(wasmContext, axisOptions);
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);
        const heatmapData = new UniformHeatmapDataSeries(wasmContext, { xStart: 0, xStep: 1, yStart: 0, yStep: 1, zValues: [[0.5]] });
        // The decision boundary itself: the contour where the probability crosses 0.5
        const contour = new UniformContoursRenderableSeries(wasmContext, {
            dataSeries: heatmapData,
            zLevels: [0.5], // a single contour at P = 0.5
            majorLineStyle: { color: "#FFFFFF", strokeThickness: 1.5 }
        });
        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, { dataSeries: heatmapData, colorMap, opacity: 0.9, fillValuesOutOfRange: true }),
            contour
        );
        // Training points are solid with a white edge; held-out test points are paler
        const scatter = (fill, stroke, size) => {
            const dataSeries = new XyDataSeries(wasmContext);
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries,
                    pointMarker: new EllipsePointMarker(wasmContext, { width: size, height: size, fill, stroke, strokeThickness: 1 })
                })
            );
            return dataSeries;
        };
        const points = {
            train: [scatter(RED, "#FFFFFF", 8), scatter(BLUE, "#FFFFFF", 8)],
            test: [scatter(RED + "80", RED, 7), scatter(BLUE + "80", BLUE, 7)]
        };
        // Accuracy on the held-out test points, in the corner as in the classic comparison grid
        const accuracy = new TextAnnotation({
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            x1: 0.98,
            y1: 0.98,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
            text: "",
            fontSize: 13,
            textColor: "#FFFFFF",
            background: "#14233CCC",
            padding: new Thickness(1, 4, 1, 4)
        });
        sciChartSurface.annotations.add(accuracy);
        const modifier = new PanelModifier();
        modifier.row = row;
        modifier.col = col;
        sciChartSurface.chartModifiers.add(modifier, new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
        return { sciChartSurface, xAxis, yAxis, heatmapData, contour, points, accuracy, predict: undefined };
    }

    // Train one classifier on one dataset, evaluate it on the grid, and redraw its panel
    function updatePanel(row, col) {
        const panel = panels[row][col];
        const data = datasets[row];
        const train = data.train.concat(data.added);
        const predict = CLASSIFIERS[col].train(train);
        panel.predict = predict;
        const { xMin, xMax, yMin, yMax } = data.range;
        const xStep = (xMax - xMin) / GRID;
        const yStep = (yMax - yMin) / GRID;
        const zValues = [];
        for (let j = 0; j < GRID; j++) {
            const line = new Array(GRID);
            // The 1e-5 × i slope (at most 0.001) is invisible, but keeps flat regions (k-NN, trees) from being exactly flat,
            // which software (non-GPU) WebGL renderers can otherwise draw as contour line
            for (let i = 0; i < GRID; i++) line[i] = predict(xMin + (i + 0.5) * xStep, yMin + (j + 0.5) * yStep) + 1e-5 * i;
            zValues.push(line);
        }
        panel.heatmapData.xStart = xMin;
        panel.heatmapData.xStep = xStep;
        panel.heatmapData.yStart = yMin;
        panel.heatmapData.yStep = yStep;
        panel.heatmapData.setZValues(zValues);
        panel.contour.dataSeries = panel.heatmapData; // re-attach so the contour is traced again on the new values
        panel.xAxis.visibleRange = new NumberRange(xMin, xMax);
        panel.yAxis.visibleRange = new NumberRange(yMin, yMax);
        for (const label of [0, 1]) {
            const own = (list) => list.filter((p) => p.label === label);
            panel.points.train[label].clear();
            panel.points.train[label].appendRange(own(train).map((p) => p.x), own(train).map((p) => p.y));
            panel.points.test[label].clear();
            panel.points.test[label].appendRange(own(data.test).map((p) => p.x), own(data.test).map((p) => p.y));
        }
        const correct = data.test.filter((p) => (predict(p.x, p.y) >= 0.5 ? 1 : 0) === p.label).length;
        panel.accuracy.text = `${Math.round((100 * correct) / data.test.length)}%`;
        ui.cells[row][col].caption.textContent = CLASSIFIERS[col].caption();
    }

    for (let row = 0; row < DATASETS.length; row++) {
        panels.push([]);
        for (let col = 0; col < CLASSIFIERS.length; col++) panels[row].push(await createPanel(row, col));
    }

    // --- The controls ---
    function showLayout() {
        const choice = ui.datasetSelect.value;
        const all = choice === "all";
        ui.grid.style.gridTemplateColumns = all ? `auto repeat(${CLASSIFIERS.length}, minmax(96px, 1fr))` : "repeat(3, minmax(120px, 1fr))";
        ui.grid.style.gridTemplateRows = all ? `repeat(${DATASETS.length}, 1fr)` : "repeat(2, 1fr)";
        DATASETS.forEach((d, row) => {
            ui.rowLabels[row].style.display = all ? "" : "none";
            ui.rowLabels[row].style.gridArea = `${row + 1} / 1`;
            ui.cells[row].forEach(({ cell }, col) => {
                const shown = all || d.key === choice;
                cell.style.display = shown ? "flex" : "none";
                cell.style.gridArea = all ? `${row + 1} / ${col + 2}` : `${Math.floor(col / 3) + 1} / ${(col % 3) + 1}`;
            });
        });
    }
    function showTuning() {
        const key = ui.tuneSelect.value;
        const t = TUNING[key];
        ui.valueInput.min = String(t.min);
        ui.valueInput.max = String(t.max);
        ui.valueInput.step = String(t.step);
        ui.valueInput.value = String(t.log ? Math.log10(settings[key]) : settings[key]);
        ui.valueInput.setAttribute("aria-label", ui.tuneSelect.selectedOptions[0].textContent);
        ui.valueOutput.textContent = fmt(settings[key]);
        // Outline the panels of the classifier being tuned
        CLASSIFIERS.forEach((c, col) => {
            for (const cells of ui.cells) cells[col].cell.style.outline = c.tunes.includes(key) ? "2px solid #FFD54F" : "none";
        });
    }
    function updateAll() {
        for (let row = 0; row < DATASETS.length; row++) for (let col = 0; col < CLASSIFIERS.length; col++) updatePanel(row, col);
    }
    function regenerate() {
        noise = Number(ui.noiseInput.value);
        ui.noiseOutput.textContent = noise.toFixed(2);
        DATASETS.forEach((d, row) => (datasets[row] = { ...makeDataset(d.key, noise, sampleSeed + 10 * row), added: [] }));
        updateAll();
    }

    ui.datasetSelect.addEventListener("change", showLayout);
    ui.noiseInput.addEventListener("input", regenerate);
    ui.sampleButton.addEventListener("click", () => {
        sampleSeed += 1;
        regenerate();
    });
    ui.tuneSelect.addEventListener("change", showTuning);
    ui.valueInput.addEventListener("input", () => {
        const key = ui.tuneSelect.value;
        const raw = Number(ui.valueInput.value);
        settings[key] = TUNING[key].log ? Number((10 ** raw).toPrecision(2)) : raw;
        ui.valueOutput.textContent = fmt(settings[key]);
        const col = CLASSIFIERS.findIndex((c) => c.tunes.includes(key));
        for (let row = 0; row < DATASETS.length; row++) updatePanel(row, col);
    });
    showLayout();
    showTuning();
    regenerate();
    ui.status.textContent = "Hover over a panel to read the probability; click to add a training point.";
    // #region_A_end
}

decisionBoundaryChart("scichart-root");
