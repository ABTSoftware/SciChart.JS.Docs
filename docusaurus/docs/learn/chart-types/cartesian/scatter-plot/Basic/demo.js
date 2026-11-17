import * as SciChart from "scichart";

// Generates height and weight measurements with a seeded random generator,
// so the chart looks the same every time and needs no external data.
function generateScatterData(count = 200) {
    let seed = 42;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    // Normally distributed noise (Box-Muller transform)
    const randomNormal = () => Math.sqrt(-2 * Math.log(random())) * Math.cos(2 * Math.PI * random());

    const xValues = [];
    const yValues = [];
    for (let i = 0; i < count; i++) {
        const height = 170 + randomNormal() * 9; // cm
        const weight = 0.9 * height - 85 + randomNormal() * 7; // kg: rises with height, plus noise
        xValues.push(height);
        yValues.push(weight);
    }
    // Two outliers: points that sit far from the overall pattern
    xValues.push(158, 186);
    yValues.push(92, 54);
    return { xValues, yValues };
}

// Fits a least-squares straight line (y = slope * x + intercept) through the points
function fitTrendLine(xValues, yValues) {
    const n = xValues.length;
    const meanX = xValues.reduce((sum, x) => sum + x, 0) / n;
    const meanY = yValues.reduce((sum, y) => sum + y, 0) / n;
    let covariance = 0;
    let varianceX = 0;
    for (let i = 0; i < n; i++) {
        covariance += (xValues[i] - meanX) * (yValues[i] - meanY);
        varianceX += (xValues[i] - meanX) ** 2;
    }
    const slope = covariance / varianceX;
    const intercept = meanY - slope * meanX;
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    return { xValues: [minX, maxX], yValues: [slope * minX + intercept, slope * maxX + intercept] };
}

async function scatterPlot(divElementId) {
    // #region_A_start
    // Create a JavaScript scatter plot with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        FastLineRenderableSeries,
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

    // Both axes are numeric: a scatter plot compares two measured values
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { axisTitle: "Height (cm)", labelPrecision: 0, growBy: new NumberRange(0.05, 0.05) })
    );
    sciChartSurface.yAxes.add(
        // Extra space at the bottom keeps the lowest dots clear of the chart's bottom-left corner
        new NumericAxis(wasmContext, { axisTitle: "Weight (kg)", labelPrecision: 0, growBy: new NumberRange(0.15, 0.05) })
    );

    // Your data: one x value and one y value per point
    const { xValues, yValues } = generateScatterData();

    // One dot per data point, drawn with a point marker
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Measurements" }),
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 9,
                height: 9,
                strokeThickness: 1,
                fill: "#50C7E0AA",
                stroke: "#50C7E0"
            })
        })
    );

    // A trend line (line of best fit) shows the overall direction of the relationship
    const trend = fitTrendLine(xValues, yValues);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { ...trend, dataSeriesName: "Trend line" }),
            stroke: "#F48420",
            strokeThickness: 3,
            strokeDashArray: [8, 4]
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

scatterPlot("scichart-root");
