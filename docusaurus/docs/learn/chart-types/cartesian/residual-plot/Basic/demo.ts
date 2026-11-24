import * as SciChart from "scichart";

// Sample data: pairs (x, y) from a made-up calibration experiment, where y is a reading and x the setting.
// The true relationship is a straight line or a gentle curve, and the noise added to it can be normal,
// grow with x (a funnel), have heavy tails or be skewed. A seeded random generator makes the data the same
// every time, and the same x values and random draws are reused whatever the settings, so only the
// setting you change changes the chart.
const MAX_POINTS = 1000;

function createSampleSource() {
    let seed = 4242;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    const x = [];
    const normal = [];
    const studentT = [];
    const exponential = [];
    for (let i = 0; i < MAX_POINTS; i++) {
        x.push(10 * random());
        normal.push(gaussian());
        // Student's t with 3 degrees of freedom: a normal draw divided by sqrt(chi-squared / 3)
        const chi2 = gaussian() ** 2 + gaussian() ** 2 + gaussian() ** 2;
        studentT.push(gaussian() / Math.sqrt(chi2 / 3));
        exponential.push(-Math.log(1 - random()));
    }
    return { x, normal, studentT, exponential };
}

function trueValue(relationship, x) {
    return relationship === "curved" ? 3 + 0.2 * x + 0.15 * x * x : 4 + 1.2 * x;
}

function makeSample(source, relationship, noiseType, count, extraPoint) {
    const x = source.x.slice(0, count);
    const y = x.map((xi, i) => {
        let noise = source.normal[i]; // standard deviation 1
        if (noiseType === "funnel") noise = (0.15 + 0.25 * xi) * source.normal[i]; // spread grows with x
        if (noiseType === "heavy") noise = 0.6 * source.studentT[i]; // occasional very large errors
        if (noiseType === "skewed") noise = source.exponential[i] - 1; // a long tail to the high side
        return trueValue(relationship, xi) + noise;
    });
    // One extra point, drawn in orange: an outlier in the middle of the x range, or a far-out x value
    // (high leverage) whose y doesn't follow the trend
    if (extraPoint === "outlier") {
        x.push(5);
        y.push(trueValue(relationship, 5) + 8);
    }
    if (extraPoint === "leverage") {
        x.push(16);
        y.push(trueValue(relationship, 16) - 10);
    }
    return { x, y, extraIndex: extraPoint === "none" ? -1 : x.length - 1 };
}

// The controls, the readout and the three charts each need an element. This splits the page's div into them;
// in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B; overflow:auto;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>True relationship <select data-id="relationship" style="font:inherit">` +
        `<option value="linear">Straight line</option><option value="curved">Curved</option></select></label>` +
        `<label>Noise <select data-id="noise" style="font:inherit">` +
        `<option value="normal">Normal</option><option value="funnel">Funnel (grows with x)</option>` +
        `<option value="heavy">Heavy-tailed</option><option value="skewed">Skewed</option></select></label>` +
        `<label>Extra point <select data-id="extra" style="font:inherit">` +
        `<option value="none">None</option><option value="outlier">Outlier</option>` +
        `<option value="leverage">High-leverage point</option></select></label>` +
        `<label>Sample size <select data-id="size" style="font:inherit">` +
        `<option value="30">30</option><option value="100" selected>100</option><option value="300">300</option>` +
        `<option value="1000">1,000</option></select></label>` +
        `<label><input data-id="quadratic" type="checkbox"> Fit a quadratic</label>`;
    const summary = document.createElement("div");
    summary.setAttribute("aria-live", "polite");
    summary.style.cssText = "padding:0 12px 6px; color:#c8d3e8;" + font;
    // The data chart on top; the residual and Q-Q charts side by side below it (stacked on narrow screens)
    const makeDiv = (parent, suffix, css) => {
        const div = document.createElement("div");
        div.id = divElementId + suffix;
        div.style.cssText = "min-width:0; min-height:240px;" + css;
        parent.append(div);
        return div;
    };
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex; flex-direction:column;";
    const dataDiv = makeDiv(body, "-data", "flex:1 1 0;");
    const lowerRow = document.createElement("div");
    lowerRow.style.cssText = "flex:1 1 0; display:flex; flex-wrap:wrap;";
    body.append(lowerRow);
    const residualDiv = makeDiv(lowerRow, "-residuals", "flex:1 1 300px;");
    const qqDiv = makeDiv(lowerRow, "-qq", "flex:1 1 300px;");
    root.append(bar, summary, body);
    const get = (selector) => bar.querySelector(selector);
    return {
        dataDiv,
        residualDiv,
        qqDiv,
        summary,
        relationshipSelect: get('select[data-id="relationship"]'),
        noiseSelect: get('select[data-id="noise"]'),
        extraSelect: get('select[data-id="extra"]'),
        sizeSelect: get('select[data-id="size"]'),
        quadraticCheckbox: get('input[data-id="quadratic"]')
    };
}

async function residualPlotChart(divElementId) {
    const ui = createLayout(divElementId);
    const source = createSampleSource();

    // #region_A_start
    // A regression fit, its residuals vs fitted plot and a normal Q-Q plot with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        XyScatterRenderableSeries,
        FastLineRenderableSeries,
        EllipsePointMarker,
        HorizontalLineAnnotation,
        LegendModifier,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Statistics helpers (plain JavaScript, no library needed) ---

    // Least-squares fit of a straight line (degree 1) or a quadratic (degree 2), by solving the normal
    // equations. x is centred on its mean first, which keeps the arithmetic accurate.
    function fitPolynomial(x, y, degree) {
        const n = x.length;
        const k = degree + 1;
        const meanX = x.reduce((s, v) => s + v, 0) / n;
        const terms = (xi) => [1, xi - meanX, (xi - meanX) ** 2].slice(0, k);
        // The augmented matrix [X'X | X'y]
        const m = Array.from({ length: k }, () => new Array(k + 1).fill(0));
        for (let i = 0; i < n; i++) {
            const t = terms(x[i]);
            for (let r = 0; r < k; r++) {
                for (let c = 0; c < k; c++) m[r][c] += t[r] * t[c];
                m[r][k] += t[r] * y[i];
            }
        }
        // Gauss-Jordan elimination with partial pivoting
        for (let col = 0; col < k; col++) {
            let pivot = col;
            for (let r = col + 1; r < k; r++) if (Math.abs(m[r][col]) > Math.abs(m[pivot][col])) pivot = r;
            [m[col], m[pivot]] = [m[pivot], m[col]];
            for (let r = 0; r < k; r++) {
                if (r === col) continue;
                const factor = m[r][col] / m[col][col];
                for (let c = col; c <= k; c++) m[r][c] -= factor * m[col][c];
            }
        }
        const b = m.map((row, i) => row[k] / row[i]);
        const predict = (xi) => terms(xi).reduce((s, t, j) => s + t * b[j], 0);
        // The same model written in powers of x itself: y = c0 + c1 x + c2 x^2
        const c2 = k > 2 ? b[2] : 0;
        const coefficients = [b[0] - b[1] * meanX + c2 * meanX * meanX, b[1] - 2 * c2 * meanX, c2];
        return { predict, coefficients, parameterCount: k };
    }

    // Residual = observed - fitted. R squared and the residual standard deviation summarise the fit.
    function analyseFit(x, y, degree) {
        const model = fitPolynomial(x, y, degree);
        const n = x.length;
        const fitted = x.map(model.predict);
        const residuals = y.map((yi, i) => yi - fitted[i]);
        const meanY = y.reduce((s, v) => s + v, 0) / n;
        const sse = residuals.reduce((s, r) => s + r * r, 0);
        const sst = y.reduce((s, v) => s + (v - meanY) ** 2, 0);
        const residualSD = Math.sqrt(sse / (n - model.parameterCount));
        return { model, fitted, residuals, rSquared: 1 - sse / sst, residualSD };
    }

    // The inverse of the standard normal cumulative distribution (Acklam's rational approximation,
    // accurate to about 1e-9): the z value with probability p below it
    function normalQuantile(p) {
        const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
        const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
        const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
        const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
        const tail = (q) => (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
        if (p < 0.02425) return tail(Math.sqrt(-2 * Math.log(p)));
        if (p > 0.97575) return -tail(Math.sqrt(-2 * Math.log(1 - p)));
        const q = p - 0.5;
        const r = q * q;
        return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    }

    // Normal Q-Q points: the sorted standardised residuals against the normal quantiles of the
    // plotting positions (i - 3/8) / (n + 1/4) (Blom's formula). Returns each point's original index too.
    function normalQQ(residuals, residualSD) {
        const n = residuals.length;
        const order = residuals.map((_, i) => i).sort((i, j) => residuals[i] - residuals[j]);
        return order.map((index, rank) => ({
            index,
            theoretical: normalQuantile((rank + 1 - 0.375) / (n + 0.25)),
            sample: residuals[index] / residualSD
        }));
    }

    // A smoothing line through the residuals vs fitted points: a Gaussian-weighted moving average
    // (a kernel smoother), evaluated at 50 points across the fitted values
    function smoothLine(xs, ys) {
        const min = Math.min(...xs);
        const max = Math.max(...xs);
        const bandwidth = 0.12 * (max - min || 1);
        const outX = [];
        const outY = [];
        for (let j = 0; j < 50; j++) {
            const at = min + ((max - min) * j) / 49;
            let weightSum = 0;
            let sum = 0;
            for (let i = 0; i < xs.length; i++) {
                const w = Math.exp(-0.5 * ((xs[i] - at) / bandwidth) ** 2);
                weightSum += w;
                sum += w * ys[i];
            }
            outX.push(at);
            outY.push(sum / weightSum);
        }
        return { x: outX, y: outY };
    }

    // --- Three charts: the data with the fitted model, residuals vs fitted, and the normal Q-Q plot ---
    async function createChart(div, title, xTitle, yTitle) {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(div, {
            theme: new SciChartJsNavyTheme(),
            title,
            titleStyle: { fontSize: 15 }
        });
        const axisTitleStyle = { fontSize: 14 };
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: xTitle, axisTitleStyle, growBy: new NumberRange(0.05, 0.05) }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: yTitle, axisTitleStyle, growBy: new NumberRange(0.08, 0.08) }));
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { wasmContext, sciChartSurface };
    }
    // Blue points for the sample, a larger orange point for the extra point
    const addPoints = (chart, name, size, fill) => {
        const dataSeries = new XyDataSeries(chart.wasmContext, { dataSeriesName: name });
        chart.sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(chart.wasmContext, {
                dataSeries,
                pointMarker: new EllipsePointMarker(chart.wasmContext, {
                    width: size,
                    height: size,
                    fill,
                    stroke: size > 8 ? "#FFFFFF" : undefined,
                    strokeThickness: size > 8 ? 2 : 0
                })
            })
        );
        return dataSeries;
    };
    const addLine = (chart, name, stroke, strokeDashArray) => {
        const dataSeries = new XyDataSeries(chart.wasmContext, { dataSeriesName: name });
        chart.sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(chart.wasmContext, { dataSeries, stroke, strokeThickness: 2.5, strokeDashArray })
        );
        return dataSeries;
    };

    const dataChart = await createChart(ui.dataDiv, "Data and fitted model", "x (setting)", "y (reading)");
    const dataPoints = addPoints(dataChart, "Observations", 6, "#50C7E0AA");
    const dataExtra = addPoints(dataChart, "Extra point", 13, "#F48420");
    const fitLine = addLine(dataChart, "Fitted model", "#FFFFFF", undefined);
    dataChart.sciChartSurface.chartModifiers.add(new LegendModifier({ showCheckboxes: false }));

    const residualChart = await createChart(ui.residualDiv, "Residuals vs fitted", "Fitted value", "Residual");
    // The zero line: residuals should scatter evenly above and below it
    residualChart.sciChartSurface.annotations.add(
        new HorizontalLineAnnotation({ y1: 0, stroke: "#FFFFFF", strokeThickness: 1.5, strokeDashArray: [6, 4] })
    );
    const residualPoints = addPoints(residualChart, "Residuals", 6, "#50C7E0AA");
    const residualExtra = addPoints(residualChart, "Extra point", 13, "#F48420");
    const smoothed = addLine(residualChart, "Smoothing line", "#F6C343", undefined);

    const qqChart = await createChart(ui.qqDiv, "Normal Q-Q plot of residuals", "Theoretical normal quantile", "Standardised residual");
    const qqReference = addLine(qqChart, "Reference line y = x", "#FFFFFF", [6, 4]);
    const qqPoints = addPoints(qqChart, "Residuals", 6, "#50C7E0AA");
    const qqExtra = addPoints(qqChart, "Extra point", 13, "#F48420");
    qqReference.appendRange([-3.5, 3.5], [-3.5, 3.5]);

    // --- Recompute and redraw when a control changes ---
    function update() {
        const degree = ui.quadraticCheckbox.checked ? 2 : 1;
        const sample = makeSample(
            source,
            ui.relationshipSelect.value,
            ui.noiseSelect.value,
            Number(ui.sizeSelect.value),
            ui.extraSelect.value
        );
        const { x, y, extraIndex } = sample;
        const fit = analyseFit(x, y, degree);
        const isMain = (_, i) => i !== extraIndex;

        dataPoints.clear();
        dataPoints.appendRange(x.filter(isMain), y.filter(isMain));
        residualPoints.clear();
        residualPoints.appendRange(fit.fitted.filter(isMain), fit.residuals.filter(isMain));
        dataExtra.clear();
        residualExtra.clear();
        if (extraIndex >= 0) {
            dataExtra.append(x[extraIndex], y[extraIndex]);
            residualExtra.append(fit.fitted[extraIndex], fit.residuals[extraIndex]);
        }

        // The fitted model, drawn as a smooth line across the x range
        const minX = Math.min(...x);
        const maxX = Math.max(...x);
        const lineX = Array.from({ length: 60 }, (_, j) => minX + ((maxX - minX) * j) / 59);
        fitLine.clear();
        fitLine.appendRange(lineX, lineX.map(fit.model.predict));

        const smooth = smoothLine(fit.fitted, fit.residuals);
        smoothed.clear();
        smoothed.appendRange(smooth.x, smooth.y);

        const qq = normalQQ(fit.residuals, fit.residualSD);
        const qqMain = qq.filter((p) => p.index !== extraIndex);
        qqPoints.clear();
        qqPoints.appendRange(qqMain.map((p) => p.theoretical), qqMain.map((p) => p.sample));
        qqExtra.clear();
        const extraQQ = qq.find((p) => p.index === extraIndex);
        if (extraQQ) qqExtra.append(extraQQ.theoretical, extraQQ.sample);

        for (const chart of [dataChart, residualChart, qqChart]) chart.sciChartSurface.zoomExtents();

        const [c0, c1, c2] = fit.model.coefficients;
        const sign = (v) => (v < 0 ? " − " : " + ") + Math.abs(v).toFixed(degree === 2 ? 3 : 2);
        const equation = degree === 2 ? `y = ${c0.toFixed(2)}${sign(c1)}x${sign(c2)}x²` : `y = ${c0.toFixed(2)}${sign(c1)}x`;
        ui.summary.textContent =
            `Fitted ${degree === 2 ? "quadratic" : "line"}: ${equation} · R² = ${fit.rSquared.toFixed(3)}` +
            ` · residual SD = ${fit.residualSD.toFixed(2)} · n = ${x.length}`;
    }

    for (const control of [ui.relationshipSelect, ui.noiseSelect, ui.extraSelect, ui.sizeSelect, ui.quadraticCheckbox]) {
        control.addEventListener("change", update);
    }
    update();
    // #region_A_end
}

residualPlotChart("scichart-root");
