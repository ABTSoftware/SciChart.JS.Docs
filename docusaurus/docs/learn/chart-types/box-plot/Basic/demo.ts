import * as SciChart from "scichart";

// Generates exam scores for five classes with a seeded random generator,
// so the chart looks the same every time. Class D is skewed and a few scores are outliers.
function generateScores() {
    let seed = 7;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    // Normally distributed values (Box-Muller transform)
    const normal = (mean, sd) => mean + sd * Math.sqrt(-2 * Math.log(random() + 1e-9)) * Math.cos(2 * Math.PI * random());
    const clamp = (v) => Math.min(100, Math.max(0, v));
    const classes = [
        Array.from({ length: 60 }, () => clamp(normal(62, 10))),
        Array.from({ length: 60 }, () => clamp(normal(71, 7))),
        Array.from({ length: 60 }, () => clamp(normal(55, 14))),
        Array.from({ length: 60 }, () => clamp(40 + 45 * Math.pow(random(), 2.5))), // right-skewed: most scores low, a long tail of high ones
        Array.from({ length: 60 }, () => clamp(normal(78, 5)))
    ];
    classes[1].push(35, 97); // a struggling student and a star student
    classes[4].push(52);
    return classes;
}

// Quartile by linear interpolation (the method used by Excel's QUARTILE.INC and NumPy's default)
function quantile(sorted, p) {
    const pos = (sorted.length - 1) * p;
    const lower = Math.floor(pos);
    const upper = Math.ceil(pos);
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (pos - lower);
}

// Works out the five-number summary for each group, with whiskers at 1.5 x IQR (Tukey's rule)
function summarise(groups) {
    const summary = {
        xValues: [],
        minimumValues: [],
        lowerQuartileValues: [],
        medianValues: [],
        upperQuartileValues: [],
        maximumValues: [],
        outlierX: [],
        outlierY: []
    };
    groups.forEach((values, x) => {
        const sorted = [...values].sort((a, b) => a - b);
        const q1 = quantile(sorted, 0.25);
        const q3 = quantile(sorted, 0.75);
        const iqr = q3 - q1;
        const inside = sorted.filter((v) => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr);
        summary.xValues.push(x);
        summary.minimumValues.push(inside[0]);
        summary.lowerQuartileValues.push(q1);
        summary.medianValues.push(quantile(sorted, 0.5));
        summary.upperQuartileValues.push(q3);
        summary.maximumValues.push(inside[inside.length - 1]);
        sorted
            .filter((v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr)
            .forEach((v) => {
                summary.outlierX.push(x);
                summary.outlierY.push(v);
            });
    });
    return summary;
}

async function boxPlot(divElementId) {
    // #region_A_start
    // Create a JavaScript box plot (box and whisker plot) with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        TextLabelProvider,
        NumberRange,
        FastBoxPlotRenderableSeries,
        BoxPlotDataSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // One box per group: x = 0, 1, 2... labelled with the group names
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            labelProvider: new TextLabelProvider({
                labels: { 0: "Class A", 1: "Class B", 2: "Class C", 3: "Class D", 4: "Class E" }
            }),
            autoTicks: false,
            majorDelta: 1,
            drawMinorGridLines: false,
            growBy: new NumberRange(0.15, 0.15) // space either side of the first and last box
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { axisTitle: "Exam score", labelPrecision: 0, growBy: new NumberRange(0.05, 0.05) })
    );

    // Your data: the five-number summary for each group, plus any outliers
    const s = summarise(generateScores());

    sciChartSurface.renderableSeries.add(
        new FastBoxPlotRenderableSeries(wasmContext, {
            dataSeries: new BoxPlotDataSeries(wasmContext, {
                xValues: s.xValues,
                minimumValues: s.minimumValues,
                lowerQuartileValues: s.lowerQuartileValues,
                medianValues: s.medianValues,
                upperQuartileValues: s.upperQuartileValues,
                maximumValues: s.maximumValues,
                dataSeriesName: "Exam scores"
            }),
            dataPointWidth: 0.5,
            fill: "#4682b4aa",
            stroke: "#c6e2ff",
            strokeThickness: 1,
            whiskers: { stroke: "#c6e2ff", strokeThickness: 2 },
            cap: { stroke: "#c6e2ff", strokeThickness: 2, dataPointWidth: 0.25 },
            medianLine: { stroke: "#ffb000", strokeThickness: 3 }
        })
    );

    // Outliers (beyond 1.5 x IQR from the box) drawn as dots
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: s.outlierX,
                yValues: s.outlierY,
                dataSeriesName: "Outliers"
            }),
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 9,
                height: 9,
                fill: "#ef5350",
                stroke: "#ffffff",
                strokeThickness: 1
            })
        })
    );

    // Zoom with the mouse wheel, pan by dragging, double-click to reset, and hover for values
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

boxPlot("scichart-root");
