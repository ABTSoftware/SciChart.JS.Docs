import * as SciChart from "scichart";

const SAMPLE_SIZE = 5000; // cases in the simulated test set
const BINS = 25; // histogram bins across the score range 0 to 1

// Sample data: a simulated test set for two classifiers. Each case is positive or negative; each model gives it
// a score from 0 to 1. Under the hood a score is the logistic of a normal value (the "binormal" model):
// model A: negatives N(-d/2, 1), positives N(+d/2, 1); model B: the same separation in AUC terms, but its
// positives are twice as spread out (standard deviation 2), so the two ROC curves cross.
function simulateTestSet(separation, positiveRate) {
    let seed = 2006;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const logistic = (z) => 1 / (1 + Math.exp(-z));
    const separationB = separation * Math.sqrt(5 / 2); // same theoretical AUC as model A: d / sqrt(1 + 1) = dB / sqrt(1 + 4)
    const labels = new Array(SAMPLE_SIZE);
    const scoresA = new Array(SAMPLE_SIZE);
    const scoresB = new Array(SAMPLE_SIZE);
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        const positive = random() < positiveRate;
        const noiseA = gaussian();
        const noiseB = gaussian();
        labels[i] = positive ? 1 : 0;
        scoresA[i] = logistic(positive ? separation / 2 + noiseA : -separation / 2 + noiseA);
        scoresB[i] = logistic(positive ? separationB / 2 + 2 * noiseB : -separationB / 2 + noiseB);
    }
    return { labels, scoresA, scoresB };
}

// The controls and the charts each need an element. This splits the page's div into a control bar, a histogram,
// a confusion matrix panel, and the ROC and precision-recall charts; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Class separation <input data-id="separation" type="range" min="0" max="4" step="0.1" value="1.8" ` +
        `style="vertical-align:middle; width:110px"> <output data-id="separation"></output></label>` +
        `<label>Positive rate <select data-id="rate" style="font:inherit">` +
        `<option value="0.5">50%</option><option value="0.2">20%</option><option value="0.05" selected>5%</option>` +
        `<option value="0.01">1%</option></select></label>` +
        `<label>Threshold <input data-id="threshold" type="range" min="0" max="1" step="0.001" value="0.5" ` +
        `style="vertical-align:middle; width:140px"> <output data-id="threshold"></output></label>` +
        `<button data-id="youden" type="button" style="font:inherit">Best Youden's J</button>` +
        `<label><input data-id="compare" type="checkbox"> Compare model B</label>` +
        `<label>Histogram <select data-id="histogram" style="font:inherit">` +
        `<option value="share">% of each class</option><option value="count">Counts</option></select></label>`;
    const top = document.createElement("div");
    top.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const histogramDiv = document.createElement("div");
    histogramDiv.id = divElementId + "-histogram"; // each chart's div needs its own id
    histogramDiv.style.cssText = "flex:1 1 420px; min-height:240px;";
    const panel = document.createElement("div");
    panel.setAttribute("aria-live", "polite");
    panel.style.cssText = "flex:0 1 300px; padding:6px 12px; color:#ffffff; font-size:13px;" + font;
    top.append(histogramDiv, panel);
    const bottom = document.createElement("div");
    bottom.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const rocDiv = document.createElement("div");
    rocDiv.id = divElementId + "-roc";
    rocDiv.style.cssText = "flex:1 1 340px; min-height:280px;";
    const prDiv = document.createElement("div");
    prDiv.id = divElementId + "-pr";
    prDiv.style.cssText = "flex:1 1 340px; min-height:280px;";
    bottom.append(rocDiv, prDiv);
    root.append(bar, top, bottom);
    const get = (selector) => bar.querySelector(selector);
    return {
        histogramDiv,
        rocDiv,
        prDiv,
        panel,
        separationInput: get('input[data-id="separation"]'),
        separationOutput: get('output[data-id="separation"]'),
        rateSelect: get('select[data-id="rate"]'),
        thresholdInput: get('input[data-id="threshold"]'),
        thresholdOutput: get('output[data-id="threshold"]'),
        youdenButton: get('button[data-id="youden"]'),
        compareCheckbox: get('input[data-id="compare"]'),
        histogramSelect: get('select[data-id="histogram"]')
    };
}

async function rocCurveChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Score histograms, ROC curve and precision-recall curve for a binary classifier, charted with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        FastLineRenderableSeries,
        FastMountainRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        VerticalLineAnnotation,
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

    // --- ROC and precision-recall maths (plain JavaScript, no library needed) ---

    // Sweep the threshold from the highest score to the lowest. Each step admits one more case as "predicted
    // positive"; tied scores are admitted together. Returns the ROC and PR points, the AUC (trapezoids, which
    // equals the share of positive-negative pairs ranked correctly) and the average precision (AP).
    function evaluate(scores, labels) {
        const order = scores.map((_, i) => i).sort((a, b) => scores[b] - scores[a]);
        const positives = labels.reduce((sum, y) => sum + y, 0);
        const negatives = labels.length - positives;
        const roc = { fpr: [0], tpr: [0], threshold: [Infinity] };
        const pr = { recall: [0], precision: [1] };
        let tp = 0;
        let fp = 0;
        let auc = 0;
        let ap = 0;
        for (let k = 0; k < order.length; k++) {
            const i = order[k];
            if (labels[i] === 1) tp++;
            else fp++;
            if (k + 1 < order.length && scores[order[k + 1]] === scores[i]) continue; // wait for the end of a tie
            const fpr = fp / negatives;
            const tpr = tp / positives;
            const last = roc.fpr.length - 1;
            auc += ((fpr - roc.fpr[last]) * (tpr + roc.tpr[last])) / 2;
            const precision = tp / (tp + fp);
            ap += (tpr - pr.recall[pr.recall.length - 1]) * precision;
            roc.fpr.push(fpr);
            roc.tpr.push(tpr);
            roc.threshold.push(scores[i]);
            pr.recall.push(tpr);
            pr.precision.push(precision);
        }
        return { roc, pr, auc, ap, positives, negatives };
    }

    // The confusion matrix at one threshold: a case is predicted positive when its score is at or above it
    function confusionMatrix(scores, labels, threshold) {
        let tp = 0;
        let fp = 0;
        let tn = 0;
        let fn = 0;
        for (let i = 0; i < scores.length; i++) {
            const predicted = scores[i] >= threshold;
            if (labels[i] === 1) predicted ? tp++ : fn++;
            else predicted ? fp++ : tn++;
        }
        const ratio = (a, b) => (b > 0 ? a / b : NaN);
        const tpr = ratio(tp, tp + fn); // recall, sensitivity
        const fpr = ratio(fp, fp + tn); // 1 - specificity
        return {
            tp,
            fp,
            tn,
            fn,
            tpr,
            fpr,
            specificity: ratio(tn, tn + fp),
            precision: ratio(tp, tp + fp),
            accuracy: (tp + tn) / scores.length,
            f1: ratio(2 * tp, 2 * tp + fp + fn),
            youdenJ: tpr - fpr
        };
    }

    // Counts per score bin for one class, as a step outline from 0 to 1
    function histogram(scores, labels, label, asShare) {
        const counts = new Array(BINS).fill(0);
        let total = 0;
        for (let i = 0; i < scores.length; i++) {
            if (labels[i] !== label) continue;
            counts[Math.min(BINS - 1, Math.floor(scores[i] * BINS))]++;
            total++;
        }
        const x = [];
        const y = [];
        for (let b = 0; b <= BINS; b++) {
            x.push(b / BINS);
            const value = counts[Math.min(b, BINS - 1)]; // repeat the last bin so the step closes at 1
            y.push(asShare ? (100 * value) / Math.max(total, 1) : value);
        }
        return { x, y };
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const COLOUR_NEG = "#50C7E0";
    const COLOUR_POS = "#F48420";
    const COLOUR_A = "#3BD16F";
    const COLOUR_B = "#E36FD4";
    const zoom = () => [new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier()];

    // 1. Score histograms of the two classes, with a draggable threshold line
    const hist = await SciChartSurface.create(ui.histogramDiv, { theme });
    hist.sciChartSurface.xAxes.add(
        new NumericAxis(hist.wasmContext, { axisTitle: "Model A score", visibleRange: new NumberRange(0, 1), labelPrecision: 1 })
    );
    const histYAxis = new NumericAxis(hist.wasmContext, {
        axisTitle: "% of class",
        axisAlignment: EAxisAlignment.Left,
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0, 0.3), // headroom for the legend
        labelPrecision: 0
    });
    hist.sciChartSurface.yAxes.add(histYAxis);
    const negativeHist = new XyDataSeries(hist.wasmContext, { dataSeriesName: "Negatives", dataIsSortedInX: true });
    const positiveHist = new XyDataSeries(hist.wasmContext, { dataSeriesName: "Positives", dataIsSortedInX: true });
    for (const { dataSeries, colour } of [{ dataSeries: negativeHist, colour: COLOUR_NEG }, { dataSeries: positiveHist, colour: COLOUR_POS }]) {
        hist.sciChartSurface.renderableSeries.add(
            new FastMountainRenderableSeries(hist.wasmContext, {
                dataSeries,
                isDigitalLine: true,
                fill: colour + "55",
                stroke: colour,
                strokeThickness: 2
            })
        );
    }
    const thresholdLine = new VerticalLineAnnotation({
        x1: 0.5,
        stroke: "#FFFFFF",
        strokeThickness: 2,
        strokeDashArray: [6, 4],
        isEditable: true, // drag the line to move the threshold
        showLabel: true,
        labelPlacement: ELabelPlacement.Axis,
        axisLabelFill: "#FFFFFF",
        axisLabelStroke: "#22365B"
    });
    hist.sciChartSurface.annotations.add(thresholdLine);
    hist.sciChartSurface.chartModifiers.add(new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight }));

    // 2 and 3. The ROC curve (TPR against FPR) and the precision-recall curve, each with a no-skill line,
    // one curve per model and a marker for the current threshold
    async function curveChart(div, xTitle, yTitle) {
        const chart = await SciChartSurface.create(div, { theme });
        const { sciChartSurface, wasmContext } = chart;
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, { axisTitle: xTitle, visibleRange: new NumberRange(0, 1), growBy: new NumberRange(0.02, 0.02), labelPrecision: 1 })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: yTitle, axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(0, 1), growBy: new NumberRange(0.02, 0.02), labelPrecision: 1 })
        );
        const line = (name, colour, extra = {}) => {
            const dataSeries = new XyDataSeries(wasmContext, { dataSeriesName: name });
            const series = new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: colour, strokeThickness: 2.5, ...extra });
            sciChartSurface.renderableSeries.add(series);
            return series;
        };
        const noSkill = line("No skill", "#C8D3E8", { strokeThickness: 1.5, strokeDashArray: [6, 4] });
        const curveA = line("Model A", COLOUR_A);
        const curveB = line("Model B", COLOUR_B);
        const marker = (colour) => {
            const series = new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { dataSeriesName: "At threshold" }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 14, height: 14, fill: colour, stroke: "#FFFFFF", strokeThickness: 2 })
            });
            sciChartSurface.renderableSeries.add(series);
            return series;
        };
        const pointA = marker(COLOUR_A);
        const pointB = marker(COLOUR_B);
        // The legend and the tooltip skip the markers; the curves carry the names
        const legend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.BottomRight });
        const cursor = new CursorModifier({ showTooltip: true, showAxisLabels: false });
        sciChartSurface.chartModifiers.add(legend, cursor, ...zoom());
        for (const series of [pointA, pointB]) {
            legend.includeSeries(series, false);
            cursor.includeSeries(series, false);
        }
        return { noSkill, curveA, curveB, pointA, pointB, legend };
    }
    const roc = await curveChart(ui.rocDiv, "False positive rate (1 − specificity)", "True positive rate");
    const pr = await curveChart(ui.prDiv, "Recall (true positive rate)", "Precision");

    const setXy = (series, x, y) => {
        series.dataSeries.clear();
        series.dataSeries.appendRange(x, y);
    };

    // --- The controls ---
    let data;
    let resultA;
    let resultB;
    let threshold = 0.5;

    // Simulate and evaluate both models: runs when the separation or positive rate changes
    function onDataChanged() {
        const separation = Number(ui.separationInput.value);
        ui.separationOutput.textContent = `d = ${separation.toFixed(1)}`;
        data = simulateTestSet(separation, Number(ui.rateSelect.value));
        resultA = evaluate(data.scoresA, data.labels);
        resultB = evaluate(data.scoresB, data.labels);
        const asShare = ui.histogramSelect.value === "share";
        histYAxis.axisTitle = asShare ? "% of class" : "Number of cases";
        const negative = histogram(data.scoresA, data.labels, 0, asShare);
        const positive = histogram(data.scoresA, data.labels, 1, asShare);
        negativeHist.clear();
        negativeHist.appendRange(negative.x, negative.y);
        positiveHist.clear();
        positiveHist.appendRange(positive.x, positive.y);

        const compare = ui.compareCheckbox.checked;
        const prevalence = resultA.positives / data.labels.length;
        setXy(roc.noSkill, [0, 1], [0, 1]);
        setXy(pr.noSkill, [0, 1], [prevalence, prevalence]);
        pr.noSkill.dataSeries.dataSeriesName = `No skill (precision = ${(100 * prevalence).toFixed(1)}%)`;
        setXy(roc.curveA, resultA.roc.fpr, resultA.roc.tpr);
        setXy(roc.curveB, resultB.roc.fpr, resultB.roc.tpr);
        setXy(pr.curveA, resultA.pr.recall, resultA.pr.precision);
        setXy(pr.curveB, resultB.pr.recall, resultB.pr.precision);
        roc.curveA.dataSeries.dataSeriesName = `Model A (AUC ${resultA.auc.toFixed(3)})`;
        roc.curveB.dataSeries.dataSeriesName = `Model B (AUC ${resultB.auc.toFixed(3)})`;
        pr.curveA.dataSeries.dataSeriesName = `Model A (AP ${resultA.ap.toFixed(3)})`;
        pr.curveB.dataSeries.dataSeriesName = `Model B (AP ${resultB.ap.toFixed(3)})`;
        for (const series of [roc.curveB, roc.pointB, pr.curveB, pr.pointB]) series.isVisible = compare;
        // Rebuild the legends so they show the new AUC and AP, and model B only when it is drawn
        for (const chart of [roc, pr]) {
            chart.legend.sciChartLegend?.setRenderableSeriesArray(compare ? [chart.noSkill, chart.curveA, chart.curveB] : [chart.noSkill, chart.curveA]);
        }
        onThresholdChanged();
    }

    // Move the markers and update the confusion matrix: runs when the threshold changes
    function onThresholdChanged() {
        ui.thresholdInput.value = String(threshold);
        ui.thresholdOutput.textContent = threshold.toFixed(3);
        thresholdLine.x1 = threshold;
        thresholdLine.labelValue = threshold.toFixed(3);
        const a = confusionMatrix(data.scoresA, data.labels, threshold);
        const b = confusionMatrix(data.scoresB, data.labels, threshold);
        setXy(roc.pointA, [a.fpr], [a.tpr]);
        setXy(roc.pointB, [b.fpr], [b.tpr]);
        // With no predicted positives, precision is undefined: leave the PR marker off the chart
        setXy(pr.pointA, Number.isFinite(a.precision) ? [a.tpr] : [], Number.isFinite(a.precision) ? [a.precision] : []);
        setXy(pr.pointB, Number.isFinite(b.precision) ? [b.tpr] : [], Number.isFinite(b.precision) ? [b.precision] : []);

        const pct = (v) => (Number.isFinite(v) ? `${(100 * v).toFixed(1)}%` : "–");
        const cell = "padding:6px 8px; text-align:center; border:1px solid #3a5480;";
        const good = "background:#3BD16F33;";
        const bad = "background:#EF535033;";
        ui.panel.innerHTML =
            `<table style="border-collapse:collapse; margin-bottom:8px"><caption style="text-align:left; padding-bottom:4px">` +
            `Model A confusion matrix at ${threshold.toFixed(3)}</caption>` +
            `<tr><td></td><th scope="col" style="${cell}">Predicted +</th><th scope="col" style="${cell}">Predicted −</th></tr>` +
            `<tr><th scope="row" style="${cell}">Actual +</th><td style="${cell}${good}">TP ${a.tp}</td><td style="${cell}${bad}">FN ${a.fn}</td></tr>` +
            `<tr><th scope="row" style="${cell}">Actual −</th><td style="${cell}${bad}">FP ${a.fp}</td><td style="${cell}${good}">TN ${a.tn}</td></tr>` +
            `</table>` +
            `<div>Recall (TPR) ${pct(a.tpr)} · FPR ${pct(a.fpr)}</div>` +
            `<div>Precision ${pct(a.precision)} · Specificity ${pct(a.specificity)}</div>` +
            `<div>Accuracy ${pct(a.accuracy)} · F1 ${Number.isFinite(a.f1) ? a.f1.toFixed(3) : "–"} · J ${a.youdenJ.toFixed(3)}</div>` +
            (ui.compareCheckbox.checked
                ? `<div style="margin-top:6px; color:${COLOUR_B}">Model B: recall ${pct(b.tpr)} · FPR ${pct(b.fpr)} · precision ${pct(b.precision)}</div>`
                : "");
    }

    // The threshold that maximises Youden's J = TPR − FPR for model A
    function bestYoudenThreshold() {
        let best = 1;
        let bestJ = -Infinity;
        const { fpr, tpr, threshold: thresholds } = resultA.roc;
        for (let k = 1; k < fpr.length; k++) {
            if (tpr[k] - fpr[k] > bestJ) {
                bestJ = tpr[k] - fpr[k];
                best = thresholds[k];
            }
        }
        return best;
    }

    ui.separationInput.addEventListener("input", onDataChanged);
    ui.rateSelect.addEventListener("change", onDataChanged);
    ui.compareCheckbox.addEventListener("change", onDataChanged);
    ui.histogramSelect.addEventListener("change", onDataChanged);
    ui.thresholdInput.addEventListener("input", () => {
        threshold = Number(ui.thresholdInput.value);
        onThresholdChanged();
    });
    ui.youdenButton.addEventListener("click", () => {
        threshold = bestYoudenThreshold();
        onThresholdChanged();
    });
    thresholdLine.dragDelta.subscribe(() => {
        threshold = Math.max(0, Math.min(1, thresholdLine.x1));
        onThresholdChanged();
    });
    onDataChanged();
    // #region_A_end
}

rocCurveChart("scichart-root");
