import * as SciChart from "scichart";

const TRAIN_SIZE = 20; // noisy training points the model is fitted to
const TEST_SIZE = 200; // new points from the same curve, used only to measure test error
const MAX_DEGREE = 15;

// Sample data: noisy points from a smooth curve on -1 to 1. The training x values are spread at random, one in each
// of 20 equal slots; the test set is 200 new random points with fresh noise, standing in for "data the model has never seen".
const trueCurve = (x) => Math.sin(3 * x) + 0.4 * Math.cos(7 * x);
function makeData(seedStart, noise) {
    let seed = seedStart;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const trainX = Array.from({ length: TRAIN_SIZE }, (_, i) => -1 + (2 * (i + random())) / TRAIN_SIZE);
    const trainY = trainX.map((x) => trueCurve(x) + noise * gaussian());
    const testX = Array.from({ length: TEST_SIZE }, () => 2 * random() - 1);
    const testY = testX.map((x) => trueCurve(x) + noise * gaussian());
    return { trainX, trainY, testX, testY };
}

// The controls and the charts each need an element. This splits the page's div into a control bar, a readout,
// the fit chart and, below it, the coefficient-path and error charts; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Method <select data-id="method" style="font:inherit">` +
        `<option value="none">No penalty (least squares)</option><option value="ridge" selected>Ridge (L2)</option>` +
        `<option value="lasso">Lasso (L1)</option></select></label>` +
        `<label>Degree <input data-id="degree" type="range" min="1" max="${MAX_DEGREE}" step="1" value="15" ` +
        `style="vertical-align:middle; width:110px"> <output data-id="degree"></output></label>` +
        `<label>λ <input data-id="lambda" type="range" min="-4" max="2" step="0.05" value="-0.6" ` +
        `style="vertical-align:middle; width:150px"> <output data-id="lambda"></output></label>` +
        `<label>Noise <input data-id="noise" type="range" min="0.05" max="0.6" step="0.05" value="0.25" ` +
        `style="vertical-align:middle; width:90px"> <output data-id="noise"></output></label>` +
        `<button data-id="best" type="button" style="font:inherit">Best λ (5-fold CV)</button>` +
        `<label>Error vs <select data-id="errorAxis" style="font:inherit">` +
        `<option value="lambda">λ</option><option value="degree">Degree</option></select></label>` +
        `<button data-id="resample" type="button" style="font:inherit">Resample data</button>`;
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:0 12px 6px; color:#C8D3E8; font-size:13px;" + font;
    const fitDiv = document.createElement("div");
    fitDiv.id = divElementId + "-fit"; // each chart's div needs its own id
    fitDiv.style.cssText = "flex:1.1; min-height:260px;";
    const bottom = document.createElement("div");
    bottom.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const pathDiv = document.createElement("div");
    pathDiv.id = divElementId + "-paths";
    pathDiv.style.cssText = "flex:1 1 340px; min-height:250px;";
    const errorDiv = document.createElement("div");
    errorDiv.id = divElementId + "-error";
    errorDiv.style.cssText = "flex:1 1 340px; min-height:250px;";
    bottom.append(pathDiv, errorDiv);
    root.append(bar, readout, fitDiv, bottom);
    const get = (selector) => bar.querySelector(selector);
    return {
        fitDiv,
        pathDiv,
        errorDiv,
        readout,
        methodSelect: get('select[data-id="method"]'),
        degreeInput: get('input[data-id="degree"]'),
        degreeOutput: get('output[data-id="degree"]'),
        lambdaInput: get('input[data-id="lambda"]'),
        lambdaOutput: get('output[data-id="lambda"]'),
        noiseInput: get('input[data-id="noise"]'),
        noiseOutput: get('output[data-id="noise"]'),
        bestButton: get('button[data-id="best"]'),
        errorAxisSelect: get('select[data-id="errorAxis"]'),
        resampleButton: get('button[data-id="resample"]')
    };
}

async function regularizationChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Polynomial regression with ridge and lasso penalties: the fit, coefficient paths and error curves, charted with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        EAxisAlignment,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        VerticalLineAnnotation,
        LegendModifier,
        ELegendPlacement,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Regression maths (plain JavaScript, no library needed) ---

    // Polynomial features x, x², ..., x^degree for each x
    function polyFeatures(xs, degree) {
        return xs.map((x) => {
            const row = [];
            let power = 1;
            for (let k = 1; k <= degree; k++) {
                power *= x;
                row.push(power);
            }
            return row;
        });
    }

    // Standardise each feature to mean 0 and standard deviation 1, using the training rows only,
    // so the penalty treats x and x¹⁵ equally. Returns a function that applies the same scaling to any rows.
    function standardiser(rows) {
        const n = rows.length;
        const d = rows[0].length;
        const mean = new Array(d).fill(0);
        const sd = new Array(d).fill(0);
        for (const row of rows) for (let j = 0; j < d; j++) mean[j] += row[j] / n;
        for (const row of rows) for (let j = 0; j < d; j++) sd[j] += (row[j] - mean[j]) ** 2 / n;
        for (let j = 0; j < d; j++) sd[j] = Math.sqrt(sd[j]) || 1;
        return (newRows) => newRows.map((row) => row.map((v, j) => (v - mean[j]) / sd[j]));
    }

    // Least squares by Householder QR: the b that minimises ||A b - t||². QR is used rather than the normal
    // equations because high powers of x are nearly collinear and XᵀX is badly conditioned.
    function leastSquares(A, t) {
        const m = A.length;
        const n = A[0].length;
        const R = A.map((row) => row.slice());
        const q = t.slice();
        for (let k = 0; k < n; k++) {
            let norm = 0;
            for (let i = k; i < m; i++) norm += R[i][k] ** 2;
            norm = Math.sqrt(norm);
            if (norm === 0) continue;
            const v = new Array(m).fill(0);
            for (let i = k; i < m; i++) v[i] = R[i][k];
            v[k] -= R[k][k] > 0 ? -norm : norm;
            let vv = 0;
            for (let i = k; i < m; i++) vv += v[i] ** 2;
            if (vv === 0) continue;
            const reflect = (get, set) => {
                let s = 0;
                for (let i = k; i < m; i++) s += v[i] * get(i);
                s = (2 * s) / vv;
                for (let i = k; i < m; i++) set(i, get(i) - s * v[i]);
            };
            for (let j = k; j < n; j++) reflect((i) => R[i][j], (i, value) => (R[i][j] = value));
            reflect((i) => q[i], (i, value) => (q[i] = value));
        }
        const b = new Array(n).fill(0);
        for (let k = n - 1; k >= 0; k--) {
            let s = q[k];
            for (let j = k + 1; j < n; j++) s -= R[k][j] * b[j];
            b[k] = Math.abs(R[k][k]) > 1e-300 ? s / R[k][k] : 0;
        }
        return b;
    }

    // Ridge: minimise RSS + λ Σ b². The closed form is b = (XᵀX + λI)⁻¹ Xᵀy; solving least squares on X with
    // √λ·I stacked underneath (and zeros under y) gives the same b, more accurately. λ = 0 is plain least squares.
    function ridge(X, y, lambda) {
        const d = X[0].length;
        const A = X.map((row) => row.slice());
        const t = y.slice();
        for (let j = 0; j < d; j++) {
            const row = new Array(d).fill(0);
            row[j] = Math.sqrt(lambda);
            A.push(row);
            t.push(0);
        }
        return leastSquares(A, t);
    }

    // Lasso: minimise RSS + λ Σ |b|. Written with G = XᵀX and c = Xᵀy, RSS = yᵀy − 2cᵀb + bᵀGb.
    // Step 1, cyclic coordinate descent: solve for one coefficient at a time with the others fixed. Each step has
    // an exact answer, ρ soft-thresholded by λ/2, and that threshold is what sets coefficients exactly to zero.
    // Step 2, an exact finish: high powers of x are nearly collinear, which makes coordinate descent crawl, so once
    // it is close, an active-set solve (feature-sign search) finds the exact optimum. `start` warm-starts step 1.
    function lasso(X, y, lambda, start = null, sweeps = 200) {
        const n = X.length;
        const d = X[0].length;
        const G = [];
        const c = [];
        for (let j = 0; j < d; j++) {
            G.push([]);
            c.push(0);
            for (let i = 0; i < n; i++) c[j] += X[i][j] * y[i];
            for (let k = 0; k < d; k++) {
                let s = 0;
                for (let i = 0; i < n; i++) s += X[i][j] * X[i][k];
                G[j].push(s);
            }
        }
        const half = lambda / 2;
        const gradient = (b, j) => c[j] - G[j].reduce((s, v, k) => s + v * b[k], 0); // xⱼ · residual
        const objective = (b) => b.reduce((s, bj, j) => s + bj * (G[j].reduce((t, v, k) => t + v * b[k], 0) - 2 * c[j]) + lambda * Math.abs(bj), 0);

        // Step 1: coordinate descent
        const b = start ? start.slice() : new Array(d).fill(0);
        for (let sweep = 0; sweep < sweeps; sweep++) {
            let maxChange = 0;
            for (let j = 0; j < d; j++) {
                const rho = gradient(b, j) + G[j][j] * b[j]; // xⱼ · (residual with feature j left out)
                const next = (Math.sign(rho) * Math.max(Math.abs(rho) - half, 0)) / G[j][j];
                maxChange = Math.max(maxChange, Math.abs(next - b[j]));
                b[j] = next;
            }
            if (maxChange < 1e-12) break;
        }

        // Step 2: feature-sign search. With the signs of the non-zero coefficients fixed, the optimum solves
        // Gₐₐ bₐ = cₐ − (λ/2)·sign(bₐ). Move towards it, stopping where the objective is lowest (at the target or
        // where a coefficient crosses zero), then add any zero coefficient with |xⱼ · residual| > λ/2.
        const tolerance = 1e-9 * Math.max(1, half);
        for (let iteration = 0; iteration < 100; iteration++) {
            const active = b.map((_, j) => j).filter((j) => b[j] !== 0);
            const optimalOnActive = active.every((j) => Math.abs(gradient(b, j) - half * Math.sign(b[j])) < tolerance);
            if (!optimalOnActive) {
                const target = leastSquares(
                    active.map((j) => active.map((k) => G[j][k])),
                    active.map((j) => c[j] - half * Math.sign(b[j]))
                );
                const candidates = [1]; // fractions of the way to the target where a coefficient reaches zero
                active.forEach((j, a) => {
                    if (Math.sign(target[a]) !== Math.sign(b[j])) candidates.push(b[j] / (b[j] - target[a]));
                });
                let best = null;
                let bestValue = Infinity;
                for (const t of candidates) {
                    const trial = b.slice();
                    active.forEach((j, a) => (trial[j] = b[j] + t * (target[a] - b[j])));
                    active.forEach((j) => Math.abs(trial[j]) < 1e-14 && (trial[j] = 0));
                    if (t !== 1) active.forEach((j, a) => Math.abs(b[j] / (b[j] - target[a]) - t) < 1e-12 && (trial[j] = 0));
                    const value = objective(trial);
                    if (value < bestValue) {
                        bestValue = value;
                        best = trial;
                    }
                }
                best.forEach((v, j) => (b[j] = v));
                continue;
            }
            // All non-zero coefficients are optimal: add the zero one that most breaks |xⱼ · residual| ≤ λ/2
            let entering = -1;
            let largest = half + tolerance;
            for (let j = 0; j < d; j++) {
                const g = Math.abs(gradient(b, j));
                if (b[j] === 0 && g > largest) {
                    entering = j;
                    largest = g;
                }
            }
            if (entering < 0) break; // every optimality (KKT) condition holds: this is the lasso solution
            b[entering] = Math.sign(gradient(b, entering)) * 1e-12; // enters with the sign that lowers the objective
        }
        return b;
    }

    // Fit one model: standardise the features, centre y (the intercept is never penalised), then solve.
    // Returns the standardised coefficients and a predict(xs) function.
    function fitModel(xs, ys, degree, method, lambda, start = null) {
        const scale = standardiser(polyFeatures(xs, degree));
        const X = scale(polyFeatures(xs, degree));
        const intercept = ys.reduce((s, v) => s + v, 0) / ys.length;
        const yc = ys.map((v) => v - intercept);
        const coefficients = method === "lasso" ? lasso(X, yc, lambda, start) : ridge(X, yc, method === "none" ? 0 : lambda);
        const predict = (newXs) => scale(polyFeatures(newXs, degree)).map((row) => intercept + row.reduce((s, v, j) => s + v * coefficients[j], 0));
        return { coefficients, predict };
    }

    const rmse = (predicted, actual) => Math.sqrt(predicted.reduce((s, p, i) => s + (p - actual[i]) ** 2, 0) / actual.length);

    // k-fold cross-validation: fit on k-1 folds, score on the held-out fold, average the squared errors.
    // Folds take every k-th point of the x-sorted data, so each fold spans the whole x range.
    function crossValidate(xs, ys, degree, method, lambda, k = 5, starts = null) {
        let squaredError = 0;
        const fits = [];
        for (let fold = 0; fold < k; fold++) {
            const trainIdx = xs.map((_, i) => i).filter((i) => i % k !== fold);
            const testIdx = xs.map((_, i) => i).filter((i) => i % k === fold);
            const model = fitModel(trainIdx.map((i) => xs[i]), trainIdx.map((i) => ys[i]), degree, method, lambda, starts?.[fold]);
            const predicted = model.predict(testIdx.map((i) => xs[i]));
            testIdx.forEach((i, n) => (squaredError += (predicted[n] - ys[i]) ** 2));
            fits.push(model.coefficients);
        }
        return { rmse: Math.sqrt(squaredError / xs.length), fits };
    }

    // The λ grid for the coefficient paths and the error curve: 10⁻⁴ to 10², 10 steps per decade
    const LAMBDAS = Array.from({ length: 61 }, (_, i) => 10 ** (2 - i / 10)); // largest first, for warm starts

    // Fit every λ on the grid: coefficients, training, cross-validation and test RMSE.
    // Lasso fits warm-start from the previous λ, so each lasso fit starts close to its answer.
    function lambdaSweep(data, degree, method) {
        let start;
        let foldStarts;
        const rows = LAMBDAS.map((lambda) => {
            const model = fitModel(data.trainX, data.trainY, degree, method, lambda, start);
            const cv = crossValidate(data.trainX, data.trainY, degree, method, lambda, 5, foldStarts);
            start = model.coefficients;
            foldStarts = cv.fits;
            return {
                lambda,
                coefficients: model.coefficients,
                train: rmse(model.predict(data.trainX), data.trainY),
                cv: cv.rmse,
                test: rmse(model.predict(data.testX), data.testY)
            };
        });
        return rows.reverse(); // smallest λ first, for the charts
    }

    // Training, cross-validation and test RMSE for each degree at a fixed λ
    function degreeSweep(data, method, lambda) {
        return Array.from({ length: MAX_DEGREE }, (_, i) => {
            const model = fitModel(data.trainX, data.trainY, i + 1, method, lambda);
            return {
                degree: i + 1,
                train: rmse(model.predict(data.trainX), data.trainY),
                cv: crossValidate(data.trainX, data.trainY, i + 1, method, lambda).rmse,
                test: rmse(model.predict(data.testX), data.testY)
            };
        });
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const COLOUR_DATA = "#50C7E0";
    const COLOUR_TRUE = "#C8D3E8";
    const COLOUR_FIT = "#F48420";
    const COLOUR_TRAIN = "#50C7E0";
    const COLOUR_CV = "#3BD16F";
    const COLOUR_TEST = "#E36FD4";
    const zoom = () => [new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier()];
    const formatLambda = (v) => (v >= 0.01 && v < 1000 ? String(Number(v.toPrecision(2))) : v.toExponential(0));
    const lambdaAxis = (wasmContext) => {
        const axis = new LogarithmicAxis(wasmContext, { axisTitle: "λ (log scale)", logBase: 10, visibleRange: new NumberRange(1e-4, 100) });
        axis.labelProvider.formatLabel = (v) => formatLambda(v);
        axis.labelProvider.formatCursorLabel = (v) => formatLambda(v);
        return axis;
    };
    const line = (wasmContext, name, stroke, extra = {}) =>
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { dataSeriesName: name }),
            stroke,
            strokeThickness: 2.5,
            ...extra
        });
    const setXy = (series, x, y) => {
        series.dataSeries.clear();
        series.dataSeries.appendRange(x, y);
    };
    const marker = () =>
        new VerticalLineAnnotation({ x1: 0.1, stroke: "#FFFFFF", strokeThickness: 2, strokeDashArray: [6, 4], isEditable: true });

    // 1. The fit: training points, the true curve and the fitted polynomial
    const fit = await SciChartSurface.create(ui.fitDiv, { theme });
    fit.sciChartSurface.xAxes.add(new NumericAxis(fit.wasmContext, { axisTitle: "x", visibleRange: new NumberRange(-1.05, 1.05) }));
    fit.sciChartSurface.yAxes.add(
        new NumericAxis(fit.wasmContext, { axisTitle: "y", axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(-2.6, 2.6) })
    );
    const points = new XyScatterRenderableSeries(fit.wasmContext, {
        dataSeries: new XyDataSeries(fit.wasmContext, { dataSeriesName: `Training data (${TRAIN_SIZE} points)` }),
        pointMarker: new EllipsePointMarker(fit.wasmContext, { width: 9, height: 9, fill: COLOUR_DATA, stroke: "#FFFFFF", strokeThickness: 1 })
    });
    const truth = line(fit.wasmContext, "True curve", COLOUR_TRUE, { strokeThickness: 1.5, strokeDashArray: [6, 4] });
    const fitted = line(fit.wasmContext, "Fitted curve", COLOUR_FIT, { strokeThickness: 3 });
    fit.sciChartSurface.renderableSeries.add(truth, fitted, points);
    const fitLegend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopLeft });
    fit.sciChartSurface.chartModifiers.add(
        fitLegend,
        new CursorModifier({ showTooltip: true }),
        ...zoom()
    );

    // 2. Coefficient paths: one line per standardised coefficient against λ, with the current λ marked
    const paths = await SciChartSurface.create(ui.pathDiv, { theme });
    paths.sciChartSurface.xAxes.add(lambdaAxis(paths.wasmContext));
    const pathYAxis = new NumericAxis(paths.wasmContext, { axisTitle: "Coefficient", axisAlignment: EAxisAlignment.Left });
    paths.sciChartSurface.yAxes.add(pathYAxis);
    // One colour per power of x, from x in red round the colour wheel to x¹⁵ in magenta
    const PATH_COLOURS = ["#EC5151", "#EC8751", "#ECC051", "#E1EC51", "#A8EC51", "#72EC51", "#51EC68", "#51EC9E",
        "#51ECD4", "#51CAEC", "#5194EC", "#515BEC", "#7D51EC", "#B551EC", "#EC51EC"];
    const pathSeries = Array.from({ length: MAX_DEGREE }, (_, j) =>
        line(paths.wasmContext, j === 0 ? "x" : `x^${j + 1}`, PATH_COLOURS[j], { strokeThickness: 2 })
    );
    paths.sciChartSurface.renderableSeries.add(...pathSeries);
    const pathMarker = marker();
    paths.sciChartSurface.annotations.add(pathMarker);
    paths.sciChartSurface.chartModifiers.add(...zoom());

    // 3. Error curves: training, 5-fold cross-validation and test RMSE against λ or against the degree
    const errors = await SciChartSurface.create(ui.errorDiv, { theme });
    const errorYAxis = new NumericAxis(errors.wasmContext, { axisTitle: "RMSE", axisAlignment: EAxisAlignment.Left, labelPrecision: 2 });
    errors.sciChartSurface.yAxes.add(errorYAxis);
    const trainLine = line(errors.wasmContext, "Training", COLOUR_TRAIN);
    const cvLine = line(errors.wasmContext, "5-fold CV", COLOUR_CV);
    const testLine = line(errors.wasmContext, `Test (${TEST_SIZE} new points)`, COLOUR_TEST);
    errors.sciChartSurface.renderableSeries.add(trainLine, cvLine, testLine);
    const errorMarker = marker();
    errors.sciChartSurface.annotations.add(errorMarker);
    errors.sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight }),
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        ...zoom()
    );
    let errorAxisMode = "";
    function setErrorXAxis(mode) {
        if (mode === errorAxisMode) return;
        errorAxisMode = mode;
        errors.sciChartSurface.xAxes.clear();
        errors.sciChartSurface.xAxes.add(
            mode === "lambda"
                ? lambdaAxis(errors.wasmContext)
                : new NumericAxis(errors.wasmContext, { axisTitle: "Polynomial degree", visibleRange: new NumberRange(0.5, MAX_DEGREE + 0.5), labelPrecision: 0 })
        );
    }

    // --- The controls ---
    let seed = 1970;
    let data;
    let sweep; // the λ sweep for the current data, degree and method
    const curveX = Array.from({ length: 301 }, (_, i) => -1 + i / 150);

    const state = () => ({
        method: ui.methodSelect.value,
        degree: Number(ui.degreeInput.value),
        lambda: 10 ** Number(ui.lambdaInput.value),
        noise: Number(ui.noiseInput.value)
    });
    // The paths and the λ curve need a penalty: with "no penalty" selected they show ridge for comparison
    const pathMethod = (method) => (method === "lasso" ? "lasso" : "ridge");

    // New data: runs on noise changes and "Resample data"
    function onDataChanged() {
        const { noise } = state();
        ui.noiseOutput.textContent = `σ = ${noise.toFixed(2)}`;
        data = makeData(seed, noise);
        setXy(points, data.trainX, data.trainY);
        setXy(truth, curveX, curveX.map(trueCurve));
        onModelChanged();
    }

    // New degree or method: recompute the λ sweep (coefficient paths and error curves)
    function onModelChanged() {
        const { method, degree } = state();
        ui.degreeOutput.textContent = String(degree);
        ui.lambdaInput.disabled = method === "none";
        sweep = lambdaSweep(data, degree, pathMethod(method));
        const lambdas = sweep.map((row) => row.lambda);
        let maxAbs = 0;
        pathSeries.forEach((series, j) => {
            series.isVisible = j < degree;
            if (j >= degree) return;
            const values = sweep.map((row) => row.coefficients[j]);
            setXy(series, lambdas, values);
            // Scale the y-axis to λ ≥ 0.01: below that, high-degree coefficients head towards the unpenalised ones,
            // which run into the thousands (zoom out or double-click to see them)
            sweep.forEach((row, i) => row.lambda >= 0.01 && (maxAbs = Math.max(maxAbs, Math.abs(values[i]))));
        });
        pathYAxis.axisTitle = method === "none" ? "Ridge coefficient" : "Coefficient";
        pathYAxis.visibleRange = new NumberRange(-1.1 * maxAbs, 1.1 * maxAbs);
        onErrorChartChanged();
    }

    // Error chart: against λ (from the sweep) or against degree (refit at the current λ)
    function onErrorChartChanged() {
        const { method, lambda } = state();
        const mode = ui.errorAxisSelect.value;
        setErrorXAxis(mode);
        const rows = mode === "lambda" ? sweep : degreeSweep(data, method, lambda);
        const x = rows.map((row) => (mode === "lambda" ? row.lambda : row.degree));
        setXy(trainLine, x, rows.map((row) => row.train));
        setXy(cvLine, x, rows.map((row) => row.cv));
        setXy(testLine, x, rows.map((row) => row.test));
        const best = Math.min(...rows.map((row) => row.cv));
        errorYAxis.visibleRange = new NumberRange(0, Math.max(1, 3 * best)); // clip the runaway overfit errors
        updateFit();
    }

    // Refit the one model at the current settings, move the markers and update the readout
    function updateFit() {
        const { method, degree, lambda, noise } = state();
        ui.lambdaOutput.textContent = method === "none" ? "0 (off)" : formatLambda(lambda);
        const model = fitModel(data.trainX, data.trainY, degree, method, lambda);
        setXy(fitted, curveX, model.predict(curveX));
        const name = { none: "least squares", ridge: "ridge", lasso: "lasso" }[method];
        fitted.dataSeries.dataSeriesName = `Fitted curve (${name}, degree ${degree}${method === "none" ? "" : `, λ = ${formatLambda(lambda)}`})`;
        fitLegend.sciChartLegend?.setRenderableSeriesArray([truth, fitted, points]); // redraw the legend with the new name
        pathMarker.isHidden = method === "none";
        pathMarker.x1 = lambda;
        const byDegree = ui.errorAxisSelect.value === "degree";
        errorMarker.isHidden = method === "none" && !byDegree;
        errorMarker.isEditable = !byDegree; // drag to change λ; the degree has its own slider
        errorMarker.x1 = byDegree ? degree : lambda;
        const nonZero = model.coefficients.filter((b) => Math.abs(b) > 1e-12).length;
        const cv = crossValidate(data.trainX, data.trainY, degree, method, lambda).rmse;
        ui.readout.textContent =
            `Training RMSE ${rmse(model.predict(data.trainX), data.trainY).toFixed(3)} · ` +
            `5-fold CV RMSE ${cv.toFixed(3)} · Test RMSE ${rmse(model.predict(data.testX), data.testY).toFixed(3)} · ` +
            `Non-zero coefficients ${nonZero} of ${degree} · Noise σ = ${noise.toFixed(2)}`;
    }

    // New λ: the error-vs-degree curves depend on λ, so they are refitted too (15 degrees × 6 fits)
    function onLambdaChanged() {
        if (ui.errorAxisSelect.value === "degree" && ui.methodSelect.value !== "none") onErrorChartChanged();
        else updateFit();
    }

    // Set λ from a chart marker or the CV button, keeping the slider in step
    function setLambda(lambda) {
        const exponent = Math.max(-4, Math.min(2, Math.log10(lambda)));
        ui.lambdaInput.value = String(Math.round(exponent * 20) / 20);
        onLambdaChanged();
    }

    ui.methodSelect.addEventListener("change", () => {
        if (ui.methodSelect.value === "none" && ui.errorAxisSelect.value === "lambda") ui.errorAxisSelect.value = "degree";
        onModelChanged();
    });
    ui.degreeInput.addEventListener("input", onModelChanged);
    ui.lambdaInput.addEventListener("input", onLambdaChanged);
    ui.noiseInput.addEventListener("input", onDataChanged);
    ui.errorAxisSelect.addEventListener("change", onErrorChartChanged);
    ui.resampleButton.addEventListener("click", () => {
        seed = (seed * 48271) % 2147483647;
        onDataChanged();
    });
    ui.bestButton.addEventListener("click", () => {
        if (ui.methodSelect.value === "none") ui.methodSelect.value = "ridge";
        ui.errorAxisSelect.value = "lambda";
        onModelChanged();
        const best = sweep.reduce((a, b) => (b.cv < a.cv ? b : a)); // the λ with the lowest cross-validation error
        setLambda(best.lambda);
    });
    pathMarker.dragDelta.subscribe(() => setLambda(pathMarker.x1));
    errorMarker.dragDelta.subscribe(() => {
        if (ui.errorAxisSelect.value === "lambda") setLambda(errorMarker.x1);
    });
    onDataChanged();
    // #region_A_end
}

regularizationChart("scichart-root");
