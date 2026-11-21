import * as SciChart from "scichart";

// Eight readings logged from a made-up industrial pump, one row per reading. The data comes from a seeded
// random generator, so the chart looks the same every time and needs no data feed. It has structure built in:
// - a load group: flow rises with load, vibration rises steeply (exponentially) with load, pressure falls with flow;
// - a thermal group: oil temperature rises with ambient temperature, humidity falls as it gets warmer;
// - efficiency peaks at mid load and falls either side: a strong but non-linear link that a correlation misses.
const VARIABLES = ["Load", "Ambient temp", "Flow", "Humidity", "Vibration", "Oil temp", "Pressure", "Efficiency"];
const UNITS = ["%", "°C", "L/min", "%", "mm/s", "°C", "bar", "%"];

function generatePumpData(count) {
    let seed = 7;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    // Normally distributed noise (Box-Muller)
    const gauss = () => {
        let u = 0;
        while (u === 0) u = random();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
    };
    const rows = [];
    for (let i = 0; i < count; i++) {
        const load = 20 + 80 * random();
        const ambient = 22 + 5 * gauss();
        const flow = 30 + 2.2 * load + 25 * gauss();
        const humidity = 85 - 1.6 * ambient + 6 * gauss();
        const vibration = 0.3 * Math.exp(load / 20) * (1 + 0.3 * gauss());
        const oilTemp = 10 + 1.2 * ambient + 0.12 * load + 3 * gauss();
        const pressure = 7.5 - 0.012 * flow + 0.4 * gauss();
        const efficiency = 82 - 0.012 * (load - 60) * (load - 60) + 2.5 * gauss();
        rows.push([load, ambient, flow, humidity, vibration, oilTemp, pressure, efficiency]);
    }
    return rows;
}

// The controls, the matrix, its colour legend and the scatter plot each need an element. This splits the page's
// div into them; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Method <select data-id="method" style="font:inherit">` +
        `<option value="pearson">Pearson r</option><option value="spearman">Spearman ρ</option></select></label>` +
        `<label>Sample size <select data-id="size" style="font:inherit">` +
        `<option value="20">20</option><option value="50">50</option><option value="200" selected>200</option>` +
        `<option value="1000">1,000</option></select></label>` +
        `<label><input data-id="outlier" type="checkbox"> Add an outlier</label>` +
        `<label><input data-id="reorder" type="checkbox"> Reorder by similarity</label>` +
        `<label><input data-id="triangle" type="checkbox"> Lower triangle only</label>`;
    const summary = document.createElement("div");
    summary.setAttribute("aria-live", "polite");
    summary.style.cssText = "padding:0 12px 6px; color:#c8d3e8;" + font;
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    // The matrix and its legend stay side by side; the scatter plot moves below them on narrow screens
    const matrixBox = document.createElement("div");
    matrixBox.style.cssText = "flex:1.4 1 360px; min-height:280px; display:flex;";
    const matrixDiv = document.createElement("div");
    matrixDiv.id = divElementId + "-matrix";
    matrixDiv.style.cssText = "flex:1; min-width:0;";
    const legendDiv = document.createElement("div");
    legendDiv.id = divElementId + "-legend";
    legendDiv.style.cssText = "flex:0 0 90px;";
    matrixBox.append(matrixDiv, legendDiv);
    const scatterDiv = document.createElement("div");
    scatterDiv.id = divElementId + "-scatter";
    scatterDiv.style.cssText = "flex:1 1 300px; min-height:280px;";
    body.append(matrixBox, scatterDiv);
    root.append(bar, summary, body);
    const get = (selector) => bar.querySelector(selector);
    return {
        matrixDiv,
        legendDiv,
        scatterDiv,
        summary,
        methodSelect: get('select[data-id="method"]'),
        sizeSelect: get('select[data-id="size"]'),
        outlierCheckbox: get('input[data-id="outlier"]'),
        reorderCheckbox: get('input[data-id="reorder"]'),
        triangleCheckbox: get('input[data-id="triangle"]')
    };
}

async function correlationMatrixChart(divElementId) {
    const ui = createLayout(divElementId);
    const allRows = generatePumpData(1000);

    // #region_A_start
    // A correlation matrix heatmap and a linked scatter plot with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        Thickness,
        EAxisAlignment,
        UniformHeatmapRenderableSeries,
        UniformHeatmapDataSeries,
        HeatmapColorMap,
        HeatmapLegend,
        XyScatterRenderableSeries,
        FastLineRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        BoxAnnotation,
        CustomChartModifier2D,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Correlation helpers (plain JavaScript, no library needed) ---

    // Pearson's r: the covariance of x and y divided by the product of their standard deviations
    function pearson(x, y) {
        const n = x.length;
        let meanX = 0;
        let meanY = 0;
        for (let i = 0; i < n; i++) {
            meanX += x[i] / n;
            meanY += y[i] / n;
        }
        let sxy = 0;
        let sxx = 0;
        let syy = 0;
        for (let i = 0; i < n; i++) {
            const dx = x[i] - meanX;
            const dy = y[i] - meanY;
            sxy += dx * dy;
            sxx += dx * dx;
            syy += dy * dy;
        }
        return sxy / Math.sqrt(sxx * syy);
    }

    // Ranks from 1 to n, with tied values sharing the average of their ranks
    function ranks(values) {
        const order = values.map((_, i) => i).sort((a, b) => values[a] - values[b]);
        const result = new Array(values.length);
        for (let i = 0; i < order.length; ) {
            let j = i;
            while (j + 1 < order.length && values[order[j + 1]] === values[order[i]]) j++;
            for (let k = i; k <= j; k++) result[order[k]] = (i + j) / 2 + 1;
            i = j + 1;
        }
        return result;
    }

    // The full matrix: Pearson's r of every pair of columns, or Spearman's rho (Pearson's r of the ranks)
    function correlationMatrix(columns, method) {
        const used = method === "spearman" ? columns.map(ranks) : columns;
        return used.map((a) => used.map((b) => pearson(a, b)));
    }

    // Order the variables so that strongly related ones sit together: average-linkage hierarchical
    // clustering with distance 1 - |r|, so strong negative correlations count as similar too
    function clusterOrder(matrix) {
        let clusters = matrix.map((_, i) => [i]);
        const distance = (a, b) => {
            let sum = 0;
            for (const i of a) for (const j of b) sum += 1 - Math.abs(matrix[i][j]);
            return sum / (a.length * b.length);
        };
        while (clusters.length > 1) {
            let best = [0, 1];
            let bestDistance = Infinity;
            for (let i = 0; i < clusters.length; i++) {
                for (let j = i + 1; j < clusters.length; j++) {
                    const d = distance(clusters[i], clusters[j]);
                    if (d < bestDistance) {
                        bestDistance = d;
                        best = [i, j];
                    }
                }
            }
            const merged = clusters[best[0]].concat(clusters[best[1]]);
            clusters = clusters.filter((_, k) => k !== best[0] && k !== best[1]);
            clusters.push(merged);
        }
        return clusters[0];
    }

    // The smallest |r| that is significant at the 5% level (two-sided) for n pairs, from Fisher's z transform
    const criticalR = (n) => Math.tanh(1.96 / Math.sqrt(n - 3));

    // --- The correlation matrix: a heatmap with one cell per pair of variables ---
    const count = VARIABLES.length;
    const matrixChart = await SciChartSurface.create(ui.matrixDiv, {
        theme: new SciChartJsNavyTheme(),
        padding: new Thickness(10, 50, 10, 10) // room on the right for the last rotated label
    });
    const matrixSurface = matrixChart.sciChartSurface;
    const wasmContext = matrixChart.wasmContext;
    let order = VARIABLES.map((_, i) => i); // display position -> variable index

    // One label per cell, in the middle of the cell, showing the variable at that position
    const axisOptions = {
        autoTicks: false,
        majorDelta: 1,
        minorDelta: 1,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMinorTickLines: false,
        drawMajorBands: false
    };
    const xAxis = new NumericAxis(wasmContext, {
        ...axisOptions,
        visibleRange: new NumberRange(-0.5, count - 0.5),
        rotation: 40,
        hideOverlappingLabels: false
    });
    // First variable at the top. The empty strip below the last row leaves room for the SciChart logo
    const yAxis = new NumericAxis(wasmContext, {
        ...axisOptions,
        visibleRange: new NumberRange(-0.5, count + 0.1),
        flippedCoordinates: true,
        axisAlignment: EAxisAlignment.Left
    });
    xAxis.labelProvider.formatLabel = (value) => VARIABLES[order[Math.round(value)]] ?? "";
    yAxis.labelProvider.formatLabel = (value) => VARIABLES[order[Math.round(value)]] ?? "";
    matrixSurface.xAxes.add(xAxis);
    matrixSurface.yAxes.add(yAxis);

    // A diverging colour scale centred on 0: blue for negative, red for positive, dark for no correlation
    const colorMap = new HeatmapColorMap({
        minimum: -1,
        maximum: 1,
        gradientStops: [
            { offset: 0, color: "#2C7BE5" },
            { offset: 0.5, color: "#1B2A47" },
            { offset: 1, color: "#E5484D" }
        ]
    });
    const matrixData = new UniformHeatmapDataSeries(wasmContext, {
        zValues: [[0]],
        xStart: -0.5, // cell i spans i - 0.5 to i + 0.5, so it is centred on its label
        xStep: 1,
        yStart: -0.5,
        yStep: 1
    });
    matrixData.hasNaNs = true; // the hidden triangle is NaN (transparent)
    matrixSurface.renderableSeries.add(
        new UniformHeatmapRenderableSeries(wasmContext, {
            dataSeries: matrixData,
            colorMap,
            // Print each coefficient in its cell, to two decimal places
            dataLabels: { style: { fontSize: 13 }, color: "#FFFFFF", precision: 2 }
        })
    );
    await HeatmapLegend.create(ui.legendDiv, {
        theme: new SciChartJsNavyTheme(),
        colorMap,
        yAxisOptions: { visibleRange: new NumberRange(-1, 1) }
    });

    // An outline around the selected cell
    const selection = new BoxAnnotation({ fill: "#FFFFFF00", stroke: "#FFFFFF", strokeThickness: 3 });
    matrixSurface.annotations.add(selection);

    // --- The scatter plot of the selected pair, with its least-squares line ---
    const scatterChart = await SciChartSurface.create(ui.scatterDiv, { theme: new SciChartJsNavyTheme() });
    const scatterSurface = scatterChart.sciChartSurface;
    const scatterX = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05), axisTitleStyle: { fontSize: 16 } });
    const scatterY = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05), axisTitleStyle: { fontSize: 16 } });
    scatterSurface.xAxes.add(scatterX);
    scatterSurface.yAxes.add(scatterY);
    const pointsData = new XyDataSeries(scatterChart.wasmContext, { dataSeriesName: "Readings" });
    const outlierData = new XyDataSeries(scatterChart.wasmContext, { dataSeriesName: "Outlier" });
    const fitData = new XyDataSeries(scatterChart.wasmContext, { dataSeriesName: "Least-squares line" });
    scatterSurface.renderableSeries.add(
        new XyScatterRenderableSeries(scatterChart.wasmContext, {
            dataSeries: pointsData,
            pointMarker: new EllipsePointMarker(scatterChart.wasmContext, {
                width: 7,
                height: 7,
                fill: "#50C7E099",
                strokeThickness: 0
            })
        }),
        new XyScatterRenderableSeries(scatterChart.wasmContext, {
            dataSeries: outlierData,
            pointMarker: new EllipsePointMarker(scatterChart.wasmContext, {
                width: 13,
                height: 13,
                fill: "#F48420",
                stroke: "#FFFFFF",
                strokeThickness: 2
            })
        }),
        new FastLineRenderableSeries(scatterChart.wasmContext, { dataSeries: fitData, stroke: "#FFFFFF", strokeThickness: 2 })
    );
    scatterSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- Recompute and redraw when a control changes ---
    // A sensor glitch: a reading of 85 °C ambient and 60 mm/s vibration, with every other value normal
    const outlierRow = allRows[0].slice();
    outlierRow[1] = 85;
    outlierRow[4] = 60;
    let columns = [];
    let matrix = [];
    let selected = { a: 0, b: 7 }; // start on Load vs Efficiency: strongly linked, but r is near 0

    function showPair() {
        const { a, b } = selected;
        const n = columns[a].length;
        const hasOutlier = ui.outlierCheckbox.checked;
        const last = hasOutlier ? n - 1 : n; // the outlier, when present, is the last row
        pointsData.clear();
        pointsData.appendRange(columns[a].slice(0, last), columns[b].slice(0, last));
        outlierData.clear();
        if (hasOutlier) outlierData.append(columns[a][n - 1], columns[b][n - 1]);
        // Least-squares line y = intercept + slope * x, drawn across the range of x
        const x = columns[a];
        const y = columns[b];
        const meanX = x.reduce((s, v) => s + v, 0) / n;
        const meanY = y.reduce((s, v) => s + v, 0) / n;
        let sxy = 0;
        let sxx = 0;
        for (let i = 0; i < n; i++) {
            sxy += (x[i] - meanX) * (y[i] - meanY);
            sxx += (x[i] - meanX) * (x[i] - meanX);
        }
        const slope = sxy / sxx;
        const minX = Math.min(...x);
        const maxX = Math.max(...x);
        fitData.clear();
        fitData.appendRange([minX, maxX], [meanY + slope * (minX - meanX), meanY + slope * (maxX - meanX)]);
        scatterX.axisTitle = `${VARIABLES[a]} (${UNITS[a]})`;
        scatterY.axisTitle = `${VARIABLES[b]} (${UNITS[b]})`;
        scatterSurface.zoomExtents();

        // Outline the selected cell (below the diagonal, so it stays visible with the lower triangle only)
        const posA = order.indexOf(a);
        const posB = order.indexOf(b);
        const column = Math.min(posA, posB);
        const row = Math.max(posA, posB);
        selection.x1 = column - 0.5;
        selection.x2 = column + 0.5;
        selection.y1 = row - 0.5;
        selection.y2 = row + 0.5;

        const r = pearson(x, y);
        const rho = pearson(ranks(x), ranks(y));
        ui.summary.textContent =
            `${VARIABLES[b]} vs ${VARIABLES[a]}: Pearson r = ${r.toFixed(2)}, Spearman ρ = ${rho.toFixed(2)}, n = ${n}` +
            ` · |r| above ${criticalR(n).toFixed(2)} is significant at the 5% level for this n`;
    }

    function update() {
        const size = Number(ui.sizeSelect.value);
        const rows = allRows.slice(0, size);
        if (ui.outlierCheckbox.checked) rows.push(outlierRow);
        columns = VARIABLES.map((_, j) => rows.map((row) => row[j]));
        matrix = correlationMatrix(columns, ui.methodSelect.value);
        const newOrder = ui.reorderCheckbox.checked ? clusterOrder(matrix) : VARIABLES.map((_, i) => i);
        if (newOrder.join() !== order.join()) {
            order = newOrder;
            xAxis.labelProvider.invalidateCache(); // relabel the axes in the new order
            yAxis.labelProvider.invalidateCache();
        }
        // zValues[row][column], in display order; above the diagonal is NaN when showing the lower triangle only
        const lowerOnly = ui.triangleCheckbox.checked;
        const zValues = order.map((rowVariable, row) =>
            order.map((columnVariable, column) => (lowerOnly && column > row ? NaN : matrix[rowVariable][columnVariable]))
        );
        matrixData.setZValues(zValues);
        showPair();
    }

    // Click a cell to show the scatter plot behind it. A small custom modifier hit-tests the heatmap
    // on mouse up, unless the mouse moved (a drag)
    class CellClickModifier extends CustomChartModifier2D {
        downPoint = undefined;
        modifierMouseDown(args) {
            super.modifierMouseDown(args);
            this.downPoint = args.mousePoint;
        }
        modifierMouseUp(args) {
            super.modifierMouseUp(args);
            const down = this.downPoint;
            if (!down || Math.hypot(args.mousePoint.x - down.x, args.mousePoint.y - down.y) > 5) return;
            const hit = matrixSurface.renderableSeries.get(0).hitTestProvider.hitTest(args.mousePoint.x, args.mousePoint.y);
            if (!hit.isHit || hit.heatmapXIndex === hit.heatmapYIndex) return; // ignore the diagonal (always 1)
            selected = { a: order[hit.heatmapXIndex], b: order[hit.heatmapYIndex] };
            showPair();
        }
    }
    matrixSurface.chartModifiers.add(
        new CellClickModifier(),
        // Hover to read a cell, e.g. "Flow vs Load: r = 0.91"
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            showXLine: false,
            showYLine: false,
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos
                    // Skip the hidden upper triangle (column after row)
                    .filter((info) => info.isHit && !(ui.triangleCheckbox.checked && Math.round(info.xValue) > Math.round(info.yValue)))
                    .map((info) => {
                        const column = Math.round(info.xValue);
                        const row = Math.round(info.yValue);
                        const value = matrix[order[row]][order[column]];
                        return `${VARIABLES[order[row]]} vs ${VARIABLES[order[column]]}: ${value.toFixed(2)}`;
                    })
        }),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier()
    );

    ui.methodSelect.addEventListener("change", update);
    ui.sizeSelect.addEventListener("change", update);
    ui.outlierCheckbox.addEventListener("change", () => {
        // Jump to the pair the outlier affects most, so its effect is visible
        if (ui.outlierCheckbox.checked) selected = { a: 1, b: 4 };
        update();
    });
    ui.reorderCheckbox.addEventListener("change", update);
    ui.triangleCheckbox.addEventListener("change", update);
    update();
    // #region_A_end
}

correlationMatrixChart("scichart-root");
