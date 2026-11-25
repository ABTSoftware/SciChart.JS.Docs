import * as SciChart from "scichart";

const PER_DAY = 144; // one reading every 10 minutes
const HISTORY_DAYS = 14; // clean history the detectors learn from before the stream starts
const DAYS = 28; // history plus 14 streamed days
const VISIBLE_DAYS = 6; // width of the scrolling window

// Sample data: a simulated power reading (kW) from an industrial site, with a daily cycle, a slow upward trend and
// correlated noise. After the history, seven anomalies are injected; their times are the ground truth that the
// detectors are scored against. A seeded random generator makes the data the same every time.
function simulateSensor() {
    let seed = 20081215;
    const random = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const events = [
        { type: "Spike", start: 15.35, end: 15.35 + 1 / PER_DAY, add: () => 14 },
        { type: "Level shift", start: 17, end: 18.5, add: () => 7 },
        { type: "Contextual", start: 19.1, end: 19.2, add: () => 22 }, // a daytime level at 2 a.m.
        { type: "Spike", start: 20.62, end: 20.62 + 1 / PER_DAY, add: () => -13 },
        { type: "Drift", start: 22, end: 24, add: (day) => (9 * (day - 22)) / 2 },
        { type: "Spike", start: 24.7, end: 24.7 + 1 / PER_DAY, add: () => 12 },
        { type: "Flat day", start: 26, end: 27, add: null } // collective: the daily cycle stops for a day
    ];
    const n = DAYS * PER_DAY;
    const x = new Array(n);
    const value = new Array(n);
    const truth = new Array(n).fill(0);
    let noise = 0;
    for (let i = 0; i < n; i++) {
        const day = i / PER_DAY;
        const hour = (day % 1) * 24;
        const cycle = Math.sin((2 * Math.PI * (hour - 9)) / 24) + 0.35 * Math.sin((4 * Math.PI * (hour - 6)) / 24);
        noise = 0.6 * noise + gaussian(); // AR(1) noise: neighbouring readings are correlated
        const level = 50 + 0.15 * day;
        let v = level + 14 * cycle + 1.2 * noise;
        for (const e of events) {
            if (day >= e.start && day < e.end) {
                truth[i] = 1;
                v = e.add ? v + e.add(day) : level + 1.2 * noise;
            }
        }
        x[i] = day;
        value[i] = v;
    }
    return { x, value, truth, events };
}

// The controls and the charts each need an element. This splits the page's div into a control bar, the signal
// and score charts on the left, and the isolation forest chart and a readout on the right. In your app, they can
// be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Detector <select data-id="detector" style="font:inherit">` +
        `<option value="zscore">Rolling z-score (6 h)</option>` +
        `<option value="seasonal" selected>Seasonal baseline</option>` +
        `<option value="forest">Isolation forest</option></select></label>` +
        `<label>Threshold <input data-id="threshold" type="range" style="vertical-align:middle; width:140px"> ` +
        `<output data-id="threshold"></output></label>` +
        `<label>Speed <select data-id="speed" style="font:inherit">` +
        `<option value="1">Slow</option><option value="4" selected>Normal</option><option value="12">Fast</option></select></label>` +
        `<button data-id="pause" type="button" style="font:inherit">Pause</button>` +
        `<button data-id="restart" type="button" style="font:inherit">Restart</button>`;
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const left = document.createElement("div");
    left.style.cssText = "flex:2 1 480px; min-height:420px; display:flex; flex-direction:column;";
    const signalDiv = document.createElement("div");
    signalDiv.id = divElementId + "-signal"; // each chart's div needs its own id
    signalDiv.style.cssText = "flex:3; min-height:240px;";
    const scoreDiv = document.createElement("div");
    scoreDiv.id = divElementId + "-score";
    scoreDiv.style.cssText = "flex:2; min-height:170px;";
    left.append(signalDiv, scoreDiv);
    const right = document.createElement("div");
    right.style.cssText = "flex:1 1 300px; min-height:360px; display:flex; flex-direction:column;";
    const forestDiv = document.createElement("div");
    forestDiv.id = divElementId + "-forest";
    forestDiv.style.cssText = "flex:1; min-height:260px;";
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:6px 12px; color:#ffffff; font-size:13px; line-height:1.5;" + font;
    right.append(forestDiv, readout);
    body.append(left, right);
    root.append(bar, body);
    const get = (selector) => bar.querySelector(selector);
    return {
        signalDiv,
        scoreDiv,
        forestDiv,
        readout,
        detectorSelect: get('select[data-id="detector"]'),
        thresholdInput: get('input[data-id="threshold"]'),
        thresholdOutput: get('output[data-id="threshold"]'),
        speedSelect: get('select[data-id="speed"]'),
        pauseButton: get('button[data-id="pause"]'),
        restartButton: get('button[data-id="restart"]')
    };
}

async function anomalyDetectionChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Streaming anomaly detection on a sensor signal: three detectors, a live score, and an isolation forest view
    const {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAxisAlignment,
        FastLineRenderableSeries,
        FastBandRenderableSeries,
        XyScatterRenderableSeries,
        UniformHeatmapRenderableSeries,
        UniformHeatmapDataSeries,
        HeatmapColorMap,
        EllipsePointMarker,
        XyDataSeries,
        XyyDataSeries,
        BoxAnnotation,
        TextAnnotation,
        HorizontalLineAnnotation,
        ECoordinateMode,
        EVerticalAnchorPoint,
        ELabelPlacement,
        LegendModifier,
        ELegendPlacement,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Detector maths (plain JavaScript, no library needed) ---

    const median = (values) => {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = sorted.length >> 1;
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    // Rolling z-score: how many standard deviations a reading is from the mean of the previous `window` readings
    function rollingZScore(values, i, window) {
        let sum = 0;
        let sumSq = 0;
        for (let k = i - window; k < i; k++) {
            sum += values[k];
            sumSq += values[k] * values[k];
        }
        const mean = sum / window;
        const sd = Math.sqrt(Math.max(sumSq / window - mean * mean, 1e-9));
        return { centre: mean, spread: sd, score: Math.abs(values[i] - mean) / sd };
    }

    // Seasonal baseline: the median of the readings at the same time of day on each of the previous 7 days
    function seasonalBaseline(values, i) {
        const sameTime = [];
        for (let d = 1; d <= 7; d++) sameTime.push(values[i - d * PER_DAY]);
        return median(sameTime);
    }

    // Isolation forest (Liu, Ting and Zhou, 2008). Each tree splits a random sample of points on a random feature
    // at a random value until every point is alone or the depth limit is reached. Anomalies are few and different,
    // so they are isolated after fewer splits: a short average path length means a high anomaly score.
    const EULER_GAMMA = 0.5772156649;
    // c(n): the average path length of an unsuccessful search in a binary search tree of n points
    const c = (n) => (n > 2 ? 2 * (Math.log(n - 1) + EULER_GAMMA) - (2 * (n - 1)) / n : n === 2 ? 1 : 0);

    function buildIsolationForest(points, random, trees = 100, sampleSize = 256) {
        const psi = Math.min(sampleSize, points.length);
        const depthLimit = Math.ceil(Math.log2(psi));
        const grow = (rows, depth) => {
            if (depth >= depthLimit || rows.length <= 1) return { size: rows.length };
            const feature = Math.floor(random() * points[0].length);
            let lo = Infinity;
            let hi = -Infinity;
            for (const p of rows) {
                lo = Math.min(lo, p[feature]);
                hi = Math.max(hi, p[feature]);
            }
            if (lo === hi) return { size: rows.length };
            const split = lo + random() * (hi - lo);
            return {
                feature,
                split,
                left: grow(rows.filter((p) => p[feature] < split), depth + 1),
                right: grow(rows.filter((p) => p[feature] >= split), depth + 1)
            };
        };
        const forest = [];
        for (let t = 0; t < trees; t++) {
            const sample = [];
            for (let k = 0; k < psi; k++) sample.push(points[Math.floor(random() * points.length)]);
            forest.push(grow(sample, 0));
        }
        return { forest, psi };
    }

    // s(x) = 2^(-E[h(x)] / c(psi)): near 1 for anomalies, about 0.5 or less for normal points
    function isolationScore({ forest, psi }, point) {
        let total = 0;
        for (const tree of forest) {
            let node = tree;
            let depth = 0;
            while (node.left) {
                node = point[node.feature] < node.split ? node.left : node.right;
                depth++;
            }
            total += depth + c(node.size); // a leaf that still holds several points adds their expected depth
        }
        return Math.pow(2, -total / forest.length / c(psi));
    }

    // --- Streaming state ---
    const data = simulateSensor();
    const START = HISTORY_DAYS * PER_DAY; // first streamed reading; detection is scored from here on
    const ROLLING_WINDOW = 36; // 6 hours
    const DETECTORS = {
        zscore: { min: 1.5, max: 8, step: 0.1, value: 3, digits: 1, scoreRange: new NumberRange(0, 10), title: "|z|" },
        seasonal: { min: 1.5, max: 8, step: 0.1, value: 3.5, digits: 1, scoreRange: new NumberRange(0, 10), title: "|robust z|" },
        forest: { min: 0.45, max: 0.85, step: 0.005, value: 0.6, digits: 3, scoreRange: new NumberRange(0.3, 0.85), title: "Isolation score" }
    };
    let cursor; // index of the next reading to stream
    let scores; // per detector: score, band centre and band spread for every streamed reading
    let residual; // reading minus seasonal baseline
    let features; // isolation forest features: [difference from seasonal baseline, change over the last hour]
    let robustScale; // 1.4826 × MAD of the residuals over the history: a robust standard deviation
    let forestModel;
    let forestRandom;

    function computeFeatures(i) {
        residual[i] = data.value[i] - seasonalBaseline(data.value, i);
        let recent = 0;
        for (let k = i - 6; k < i; k++) recent += data.value[k];
        features[i] = [residual[i], data.value[i] - recent / 6];
    }

    // Retrain the forest on the last 7 days of feature vectors (done once per simulated day)
    function retrainForest(i) {
        forestModel = buildIsolationForest(features.slice(i - 7 * PER_DAY, i), forestRandom);
    }

    // Score reading i with all three detectors, using only readings before it (as a live system must)
    function scoreReading(i) {
        computeFeatures(i);
        if (i > START && (i - START) % PER_DAY === 0) {
            retrainForest(i); // a new day: retrain on the last 7 days and repaint the score map
            updateHeatmap();
        }
        const z = rollingZScore(data.value, i, ROLLING_WINDOW);
        scores.zscore.score[i] = z.score;
        scores.zscore.centre[i] = z.centre;
        scores.zscore.spread[i] = z.spread;
        scores.seasonal.score[i] = Math.abs(residual[i]) / robustScale;
        scores.seasonal.centre[i] = data.value[i] - residual[i];
        scores.seasonal.spread[i] = robustScale;
        scores.forest.score[i] = isolationScore(forestModel, features[i]);
    }

    function reset() {
        const n = data.value.length;
        const empty = () => ({ score: new Array(n).fill(NaN), centre: new Array(n).fill(NaN), spread: new Array(n).fill(NaN) });
        scores = { zscore: empty(), seasonal: empty(), forest: empty() };
        residual = new Array(n).fill(0);
        features = new Array(n);
        let seed = 42;
        forestRandom = () => {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        };
        // Learn from the clean history: seasonal residuals from day 7 on, and their robust scale
        for (let i = 7 * PER_DAY; i < START; i++) computeFeatures(i);
        const history = residual.slice(7 * PER_DAY, START);
        const middle = median(history);
        robustScale = 1.4826 * median(history.map((r) => Math.abs(r - middle)));
        cursor = START;
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const COLOUR_SIGNAL = "#50C7E0";
    const COLOUR_FLAG = "#FF4D4D";
    const COLOUR_BAND = "#F5E663";
    const group = new SciChartVerticalGroup(); // lines up the signal and score charts' y-axes

    // 1. The signal, the detector's expected range, flagged readings and the injected anomalies
    const signal = await SciChartSurface.create(ui.signalDiv, { theme });
    const signalX = new NumericAxis(signal.wasmContext, { axisTitle: "Time (days)", labelPrecision: 0, drawMinorGridLines: false });
    signal.sciChartSurface.xAxes.add(signalX);
    signal.sciChartSurface.yAxes.add(
        new NumericAxis(signal.wasmContext, { axisTitle: "Power (kW)", axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(20, 92) })
    );
    const bandData = new XyyDataSeries(signal.wasmContext, { dataSeriesName: "Expected range", dataIsSortedInX: true });
    const signalData = new XyDataSeries(signal.wasmContext, { dataSeriesName: "Reading", dataIsSortedInX: true });
    const flaggedData = new XyDataSeries(signal.wasmContext, { dataSeriesName: "Flagged", dataIsSortedInX: true });
    const band = new FastBandRenderableSeries(signal.wasmContext, {
        dataSeries: bandData,
        fill: COLOUR_BAND + "22",
        fillY1: COLOUR_BAND + "22",
        stroke: COLOUR_BAND + "88",
        strokeY1: COLOUR_BAND + "88",
        strokeThickness: 1
    });
    const signalLine = new FastLineRenderableSeries(signal.wasmContext, { dataSeries: signalData, stroke: COLOUR_SIGNAL, strokeThickness: 1.5 });
    const flaggedMarkers = new XyScatterRenderableSeries(signal.wasmContext, {
        dataSeries: flaggedData,
        stroke: COLOUR_FLAG, // the legend marker's colour
        pointMarker: new EllipsePointMarker(signal.wasmContext, { width: 8, height: 8, fill: COLOUR_FLAG, stroke: COLOUR_FLAG })
    });
    signal.sciChartSurface.renderableSeries.add(band, signalLine, flaggedMarkers);
    // The ground truth: a shaded box and a label for each injected anomaly
    for (const e of data.events) {
        signal.sciChartSurface.annotations.add(
            new BoxAnnotation({
                x1: e.start - 0.02,
                x2: e.end + 0.02,
                y1: 0,
                y2: 1,
                yCoordinateMode: ECoordinateMode.Relative,
                fill: "#FFFFFF18",
                strokeThickness: 0
            }),
            new TextAnnotation({
                x1: e.start,
                y1: 0.02,
                yCoordinateMode: ECoordinateMode.Relative,
                verticalAnchorPoint: EVerticalAnchorPoint.Top,
                text: e.type,
                fontSize: 13,
                textColor: "#FFFFFFCC"
            })
        );
    }
    const signalLegend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopLeft });
    signal.sciChartSurface.chartModifiers.add(
        signalLegend,
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    group.addSurfaceToGroup(signal.sciChartSurface);

    // 2. The selected detector's anomaly score over time, with a draggable threshold line
    const scoreChart = await SciChartSurface.create(ui.scoreDiv, { theme });
    const scoreX = new NumericAxis(scoreChart.wasmContext, { axisTitle: "Time (days)", labelPrecision: 0, drawMinorGridLines: false });
    const scoreY = new NumericAxis(scoreChart.wasmContext, { axisTitle: "Score", axisAlignment: EAxisAlignment.Left, labelPrecision: 1 });
    scoreChart.sciChartSurface.xAxes.add(scoreX);
    scoreChart.sciChartSurface.yAxes.add(scoreY);
    const scoreData = new XyDataSeries(scoreChart.wasmContext, { dataSeriesName: "Score", dataIsSortedInX: true });
    scoreChart.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(scoreChart.wasmContext, { dataSeries: scoreData, stroke: "#B48EF0", strokeThickness: 1.5 })
    );
    const thresholdLine = new HorizontalLineAnnotation({
        y1: 3,
        stroke: COLOUR_FLAG,
        strokeThickness: 2,
        strokeDashArray: [6, 4],
        isEditable: true, // drag the line to change the threshold
        showLabel: true,
        labelPlacement: ELabelPlacement.Axis,
        axisLabelFill: COLOUR_FLAG
    });
    scoreChart.sciChartSurface.annotations.add(thresholdLine);
    scoreChart.sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true, showAxisLabels: false }));
    group.addSurfaceToGroup(scoreChart.sciChartSurface);

    // 3. Isolation forest on two features: the anomaly score as a heatmap, with the last 7 days of readings on top
    const FEATURE_X = new NumberRange(-15, 30);
    const FEATURE_Y = new NumberRange(-20, 20);
    const GRID = 50;
    const forestChart = await SciChartSurface.create(ui.forestDiv, { theme });
    forestChart.sciChartSurface.xAxes.add(
        new NumericAxis(forestChart.wasmContext, { axisTitle: "Difference from baseline (kW)", visibleRange: FEATURE_X, labelPrecision: 0 })
    );
    forestChart.sciChartSurface.yAxes.add(
        new NumericAxis(forestChart.wasmContext, { axisTitle: "Change over 1 h (kW)", axisAlignment: EAxisAlignment.Left, visibleRange: FEATURE_Y, labelPrecision: 0 })
    );
    const heatmapData = new UniformHeatmapDataSeries(forestChart.wasmContext, {
        zValues: Array.from({ length: GRID }, () => new Array(GRID).fill(0.4)),
        xStart: FEATURE_X.min,
        xStep: (FEATURE_X.max - FEATURE_X.min) / GRID,
        yStart: FEATURE_Y.min,
        yStep: (FEATURE_Y.max - FEATURE_Y.min) / GRID
    });
    const pointsData = new XyDataSeries(forestChart.wasmContext, { dataSeriesName: "Last 7 days" });
    const forestFlagData = new XyDataSeries(forestChart.wasmContext, { dataSeriesName: "Flagged" });
    const latestData = new XyDataSeries(forestChart.wasmContext, { dataSeriesName: "Latest" });
    const scoreMap = new UniformHeatmapRenderableSeries(forestChart.wasmContext, {
        dataSeries: heatmapData,
        colorMap: new HeatmapColorMap({
            minimum: 0.4,
            maximum: 0.85,
            gradientStops: [
                { offset: 0, color: "#14233C" },
                { offset: 0.4, color: "#1E3F7A" },
                { offset: 0.65, color: "#5E3A8F" },
                { offset: 0.85, color: "#A3456F" },
                { offset: 1, color: "#D9704A" }
            ]
        })
    });
    forestChart.sciChartSurface.renderableSeries.add(
        scoreMap,
        new XyScatterRenderableSeries(forestChart.wasmContext, {
            dataSeries: pointsData,
            stroke: COLOUR_SIGNAL,
            pointMarker: new EllipsePointMarker(forestChart.wasmContext, { width: 4, height: 4, fill: COLOUR_SIGNAL + "AA", stroke: COLOUR_SIGNAL, strokeThickness: 0 })
        }),
        new XyScatterRenderableSeries(forestChart.wasmContext, {
            dataSeries: forestFlagData,
            stroke: COLOUR_FLAG,
            pointMarker: new EllipsePointMarker(forestChart.wasmContext, { width: 7, height: 7, fill: COLOUR_FLAG, stroke: COLOUR_FLAG, strokeThickness: 0 })
        }),
        new XyScatterRenderableSeries(forestChart.wasmContext, {
            dataSeries: latestData,
            stroke: "#FFFFFF",
            pointMarker: new EllipsePointMarker(forestChart.wasmContext, { width: 14, height: 14, fill: "#FFFFFF00", stroke: "#FFFFFF", strokeThickness: 2 })
        })
    );
    const forestLegend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight });
    forestChart.sciChartSurface.chartModifiers.add(
        forestLegend,
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    forestLegend.includeSeries(scoreMap, false); // the heatmap is the background, not a legend entry

    // Paint the forest's score over the feature grid (after each retrain)
    function updateHeatmap() {
        const xStep = (FEATURE_X.max - FEATURE_X.min) / GRID;
        const yStep = (FEATURE_Y.max - FEATURE_Y.min) / GRID;
        const z = [];
        for (let row = 0; row < GRID; row++) {
            const line = [];
            for (let col = 0; col < GRID; col++) {
                line.push(isolationScore(forestModel, [FEATURE_X.min + (col + 0.5) * xStep, FEATURE_Y.min + (row + 0.5) * yStep]));
            }
            z.push(line);
        }
        heatmapData.setZValues(z);
    }

    // --- Drawing and scoring the streamed readings ---
    const detector = () => ui.detectorSelect.value;
    const threshold = () => DETECTORS[detector()].value;
    const isFlagged = (i) => scores[detector()].score[i] > threshold();

    // Redraw everything that depends on the detector or threshold, for all readings streamed so far
    function redrawDetections() {
        const name = detector();
        const k = threshold();
        const s = scores[name];
        const xs = [];
        const lower = [];
        const upper = [];
        const scoreValues = [];
        const flagX = [];
        const flagY = [];
        for (let i = START; i < cursor; i++) {
            xs.push(data.x[i]);
            lower.push(s.centre[i] - k * s.spread[i]);
            upper.push(s.centre[i] + k * s.spread[i]);
            scoreValues.push(s.score[i]);
            if (s.score[i] > k) {
                flagX.push(data.x[i]);
                flagY.push(data.value[i]);
            }
        }
        bandData.dataSeriesName = `Expected range (± ${k.toFixed(1)})`;
        bandData.clear();
        if (name !== "forest") bandData.appendRange(xs, upper, lower);
        band.isVisible = name !== "forest"; // the forest scores features, so it has no band in kW
        signalLegend.sciChartLegend?.setRenderableSeriesArray(name === "forest" ? [signalLine, flaggedMarkers] : [band, signalLine, flaggedMarkers]);
        scoreData.clear();
        scoreData.appendRange(xs, scoreValues);
        flaggedData.clear();
        flaggedData.appendRange(flagX, flagY);
        thresholdLine.y1 = k;
        thresholdLine.labelValue = k.toFixed(DETECTORS[name].digits);
        scoreY.visibleRange = DETECTORS[name].scoreRange;
        scoreY.axisTitle = DETECTORS[name].title;
        ui.thresholdOutput.textContent = k.toFixed(DETECTORS[name].digits);
        updateReadout();
        updateFeatureView();
    }

    // Append the newest readings without redrawing the history
    function drawReading(i) {
        const name = detector();
        const k = threshold();
        const s = scores[name];
        signalData.append(data.x[i], data.value[i]);
        if (name !== "forest") bandData.append(data.x[i], s.centre[i] + k * s.spread[i], s.centre[i] - k * s.spread[i]);
        scoreData.append(data.x[i], s.score[i]);
        if (s.score[i] > k) flaggedData.append(data.x[i], data.value[i]);
    }

    // The last 7 days in feature space; red where the selected detector flagged them
    function updateFeatureView() {
        const from = Math.max(START - 7 * PER_DAY, cursor - 7 * PER_DAY);
        const px = [];
        const py = [];
        const fx = [];
        const fy = [];
        for (let i = from; i < cursor; i++) {
            const [a, b] = features[i];
            if (i >= START && isFlagged(i)) {
                fx.push(a);
                fy.push(b);
            } else {
                px.push(a);
                py.push(b);
            }
        }
        pointsData.clear();
        pointsData.appendRange(px, py);
        forestFlagData.clear();
        forestFlagData.appendRange(fx, fy);
        latestData.clear();
        if (cursor > START) latestData.append(features[cursor - 1][0], features[cursor - 1][1]);
    }

    // Precision and recall against the injected anomalies, counted reading by reading, plus events caught
    function updateReadout() {
        let tp = 0;
        let fp = 0;
        let fn = 0;
        for (let i = START; i < cursor; i++) {
            const flagged = isFlagged(i);
            if (data.truth[i] && flagged) tp++;
            else if (flagged) fp++;
            else if (data.truth[i]) fn++;
        }
        const started = data.events.filter((e) => e.start * PER_DAY < cursor);
        const caught = started.filter((e) => {
            for (let i = Math.ceil(e.start * PER_DAY); i < Math.min(cursor, e.end * PER_DAY); i++) if (isFlagged(i)) return true;
            return false;
        });
        const pct = (a, b) => (b > 0 ? `${((100 * a) / b).toFixed(0)}%` : "–");
        const day = (cursor - 1) / PER_DAY;
        ui.readout.innerHTML =
            `<div>Day ${day.toFixed(1)} · ${tp + fp} readings flagged</div>` +
            `<div>True positives ${tp} · False positives ${fp} · Missed ${fn}</div>` +
            `<div><strong>Precision ${pct(tp, tp + fp)}</strong> · <strong>Recall ${pct(tp, tp + fn)}</strong> · ` +
            `Events caught ${caught.length} of ${started.length}</div>` +
            `<div style="opacity:0.75">Shaded: injected anomalies (ground truth)</div>`;
    }

    // Scroll both time charts to show the newest readings
    function scrollTo(i) {
        const now = data.x[i - 1];
        const range = new NumberRange(now - VISIBLE_DAYS, now + 0.2);
        signalX.visibleRange = range;
        scoreX.visibleRange = range;
    }

    function restart() {
        reset();
        signalData.clear();
        signalData.appendRange(data.x.slice(0, START), data.value.slice(0, START)); // the history
        retrainForest(START);
        updateHeatmap();
        redrawDetections();
        scrollTo(START);
    }

    // --- The controls ---
    let paused = false;
    function setThresholdSlider() {
        const d = DETECTORS[detector()];
        ui.thresholdInput.min = String(d.min);
        ui.thresholdInput.max = String(d.max);
        ui.thresholdInput.step = String(d.step);
        ui.thresholdInput.value = String(d.value);
    }
    ui.detectorSelect.addEventListener("change", () => {
        setThresholdSlider();
        redrawDetections();
    });
    ui.thresholdInput.addEventListener("input", () => {
        DETECTORS[detector()].value = Number(ui.thresholdInput.value);
        redrawDetections();
    });
    thresholdLine.dragDelta.subscribe(() => {
        const d = DETECTORS[detector()];
        d.value = Math.max(d.min, Math.min(d.max, thresholdLine.y1));
        ui.thresholdInput.value = String(d.value);
        redrawDetections();
    });
    ui.pauseButton.addEventListener("click", () => {
        if (cursor >= data.value.length) {
            restart();
            paused = false;
        } else {
            paused = !paused;
        }
        ui.pauseButton.textContent = paused ? "Resume" : "Pause";
    });
    ui.restartButton.addEventListener("click", () => {
        restart();
        paused = false;
        ui.pauseButton.textContent = "Pause";
    });

    // Stream a few readings every 50 ms; each is scored as it arrives
    const timer = setInterval(() => {
        if (paused || cursor >= data.value.length) return;
        const count = Number(ui.speedSelect.value);
        for (let k = 0; k < count && cursor < data.value.length; k++) {
            scoreReading(cursor);
            cursor++;
            drawReading(cursor - 1);
        }
        scrollTo(cursor);
        updateReadout();
        updateFeatureView();
        if (cursor >= data.value.length) ui.pauseButton.textContent = "Replay";
    }, 50);
    signal.sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });

    setThresholdSlider();
    restart();
    // #region_A_end
}

anomalyDetectionChart("scichart-root");
