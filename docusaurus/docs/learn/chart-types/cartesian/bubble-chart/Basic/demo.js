import * as SciChart from "scichart";

// Generates sample store data with a seeded random generator, so the chart looks the
// same every time and needs no external data. Each store has three values:
// advertising spend (x), sales (y) and number of customers (bubble size).
function generateStores(count, seedValue, spendCentre) {
    let seed = seedValue;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const xValues = [];
    const yValues = [];
    const customers = [];
    for (let i = 0; i < count; i++) {
        const spend = spendCentre + (random() - 0.5) * 40; // $k
        const sales = 60 + spend * 4 + (random() - 0.5) * 120; // $k
        xValues.push(spend);
        yValues.push(sales);
        customers.push(Math.round(300 + random() * 4700));
    }
    return { xValues, yValues, customers };
}

async function bubbleChart(divElementId) {
    // #region_A_start
    // Create a JavaScript bubble chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyzDataSeries,
        FastBubbleRenderableSeries,
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

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { axisTitle: "Advertising spend ($k)", labelPrecision: 0, growBy: new NumberRange(0.1, 0.1) })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { axisTitle: "Sales ($k)", labelPrecision: 0, growBy: new NumberRange(0.1, 0.1) })
    );

    // Your data: x, y and a third value per point. One series per region, each in its own colour
    const regions = [
        { name: "North", colour: "#50C7E0", ...generateStores(12, 7, 40) },
        { name: "South", colour: "#F48420", ...generateStores(12, 21, 70) },
        { name: "West", colour: "#AE418D", ...generateStores(12, 99, 100) }
    ];

    for (const region of regions) {
        // The z value is the bubble's diameter in pixels. Use the square root of the value,
        // so that the bubble's area (what the eye compares) is proportional to the value.
        const zValues = region.customers.map((count) => Math.sqrt(count) * 0.9);

        sciChartSurface.renderableSeries.add(
            new FastBubbleRenderableSeries(wasmContext, {
                dataSeries: new XyzDataSeries(wasmContext, {
                    xValues: region.xValues,
                    yValues: region.yValues,
                    zValues,
                    dataSeriesName: region.name
                }),
                // Draw one large marker; SciChart scales it to each bubble's size
                pointMarker: new EllipsePointMarker(wasmContext, {
                    width: 64,
                    height: 64,
                    strokeThickness: 0,
                    fill: region.colour + "99" // semi-transparent, so overlapping bubbles stay visible
                })
            })
        );
    }

    // Zoom with the mouse wheel, pan by dragging, double-click to reset, and hover for values.
    // The tooltip shows the number of customers, not the bubble's size in pixels
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos.map((info) => {
                    const region = regions.find((r) => r.name === info.seriesName);
                    const customers = region ? region.customers[info.dataSeriesIndex] : 0;
                    return `${info.seriesName}: $${info.xValue.toFixed(0)}k spend, $${info.yValue.toFixed(0)}k sales, ${customers} customers`;
                })
        }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

bubbleChart("scichart-root");
