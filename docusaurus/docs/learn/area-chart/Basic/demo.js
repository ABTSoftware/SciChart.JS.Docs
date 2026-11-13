import * as SciChart from "scichart";

// Generates 90 days of website visitors with a seeded random generator,
// so the chart looks the same every time and needs no external data.
function generateVisitors(days = 90) {
    let seed = 11;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const xValues = [];
    const yValues = [];
    const startDate = Date.UTC(2025, 0, 1) / 1000; // SciChart expects Unix timestamps in seconds
    let visitors = 1200;
    for (let i = 0; i < days; i++) {
        visitors = Math.max(200, visitors + (random() - 0.45) * 120);
        xValues.push(startDate + i * 24 * 60 * 60);
        yValues.push(Math.round(visitors));
    }
    return { xValues, yValues };
}

async function areaChart(divElementId) {
    // #region_A_start
    // Create a JavaScript area (mountain) chart with SciChart.js
    const {
        SciChartSurface,
        DateTimeNumericAxis,
        NumericAxis,
        FastMountainRenderableSeries,
        XyDataSeries,
        GradientParams,
        Point,
        NumberRange,
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

    sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext));
    // Start the y-axis at zero, so the filled area is in proportion to the values
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Visitors per day",
            labelPrecision: 0,
            visibleRange: new NumberRange(0, 2000),
            zoomExtentsToInitialRange: true // double-click returns to this range
        })
    );

    // Your data: one x value (a date) and one y value per point
    const { xValues, yValues } = generateVisitors();

    sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Visitors" }),
            stroke: "#50C7E0",
            strokeThickness: 2,
            zeroLineY: 0, // the baseline the area is filled down to
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: "rgba(80, 199, 224, 0.8)", offset: 0 },
                { color: "rgba(80, 199, 224, 0.05)", offset: 1 }
            ])
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

areaChart("scichart-root");
