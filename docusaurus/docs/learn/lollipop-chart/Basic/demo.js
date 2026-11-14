import * as SciChart from "scichart";

// Example data: share of survey respondents who rated each product feature "useful".
// These are illustrative numbers, not real statistics.
function getFeatureData() {
    const features = [
        "Search",
        "Dashboards",
        "CSV export",
        "Alerts",
        "Sharing",
        "Dark mode",
        "Comments",
        "Mobile app",
        "API access",
        "Integrations",
        "Offline mode",
        "Custom themes"
    ];
    const percentUseful = [78, 74, 72, 69, 67, 64, 61, 59, 55, 52, 47, 41];
    return { features, percentUseful };
}

async function lollipopChart(divElementId) {
    // #region_A_start
    // Create a JavaScript lollipop chart with SciChart.js: a thin stem and a dot for each category
    const {
        SciChartSurface,
        NumericAxis,
        FastImpulseRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        TextLabelProvider,
        EAxisAlignment,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        WaveAnimation
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Your data: one category name and one value per lollipop
    const { features, percentUseful } = getFeatureData();

    // Sort from largest to smallest, so the ranking reads from top to bottom
    const order = percentUseful.map((_, index) => index).sort((a, b) => percentUseful[b] - percentUseful[a]);
    const sortedFeatures = order.map((index) => features[index]);
    const sortedValues = order.map((index) => percentUseful[index]);

    // The category (X) axis goes on the left, which turns the chart on its side: horizontal lollipops.
    // A TextLabelProvider shows a category name at x = 0, 1, 2, ...
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            labelProvider: new TextLabelProvider({ labels: sortedFeatures }),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            growBy: new NumberRange(0.05, 0.2) // extra space below the last lollipop keeps it clear of the chart's bottom corner
        })
    );

    // The value (Y) axis goes along the top and starts at zero, because the stem's length shows the value.
    // flippedCoordinates makes values grow from left to right
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Top,
            flippedCoordinates: true,
            axisTitle: "Respondents who rated the feature useful",
            labelPostfix: "%",
            labelPrecision: 0,
            growBy: new NumberRange(0, 0.1) // headroom for the value labels
        })
    );

    // The lollipops: a stem from zero to the value, with a dot at the end. One colour: here colour carries no meaning
    sciChartSurface.renderableSeries.add(
        new FastImpulseRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: sortedFeatures.map((_, index) => index),
                yValues: sortedValues,
                dataSeriesName: "Rated useful (%)"
            }),
            fill: "#50C7E0", // the colour of the stem and the dot
            strokeThickness: 3, // the stem's thickness
            size: 18, // the dot's size in pixels
            pointMarker: new EllipsePointMarker(wasmContext),
            // Lollipops grow in a wave when the chart first appears
            animation: new WaveAnimation({ duration: 1000 }),
            // Show each value next to its dot
            dataLabels: {
                color: "#ffffff",
                style: { fontSize: 18, fontFamily: "Arial" },
                precision: 0
            }
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

lollipopChart("scichart-root");
