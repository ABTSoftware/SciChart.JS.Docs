import * as SciChart from "scichart";

// Example data: monthly sales in £ thousands for two shops, split into three product lines.
// These are the illustrative figures from the worked example on the page, not real statistics.
function getShopSales() {
    const shops = ["Shop A", "Shop B"];
    const productLines = [
        { name: "Food", values: [40, 30], fill: "#F48420" },
        { name: "Drinks", values: [25, 27], fill: "#50C7E0" },
        { name: "Other", values: [15, 23], fill: "#30BC9A" }
    ];
    return { shops, productLines };
}

async function clusteredColumnChart(divElementId) {
    // #region_A_start
    // Create a JavaScript clustered (grouped) column chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        StackedColumnRenderableSeries,
        StackedColumnCollection,
        XyDataSeries,
        TextLabelProvider,
        EColumnDataLabelPosition,
        NumberRange,
        SciChartJsNavyTheme,
        LegendModifier,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const { shops, productLines } = getShopSales();

    // One category per shop, at x = 0, 1, ...; the TextLabelProvider shows the shop names
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            labelProvider: new TextLabelProvider({ labels: shops }),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            growBy: new NumberRange(0.6, 0.4) // extra space on the left keeps the first group clear of the chart's bottom corner
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Monthly sales (£ thousands)",
            labelPrecision: 0,
            growBy: new NumberRange(0, 0.15) // headroom for the value labels
        })
    );

    // A different stackedGroupId for each series puts the bars side by side (clustered).
    // Give them all the same stackedGroupId to stack them instead.
    const collection = new StackedColumnCollection(wasmContext, { dataPointWidth: 0.6 });
    for (const line of productLines) {
        collection.add(
            new StackedColumnRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: shops.map((_, index) => index),
                    yValues: line.values,
                    dataSeriesName: line.name
                }),
                stackedGroupId: line.name,
                fill: line.fill,
                stroke: "#E4F5FC",
                strokeThickness: 1,
                // Show each bar's value above it
                dataLabels: {
                    color: "#ffffff",
                    style: { fontSize: 16, fontFamily: "Arial" },
                    precision: 0,
                    positionMode: EColumnDataLabelPosition.Outside
                }
            })
        );
    }
    sciChartSurface.renderableSeries.add(collection);

    sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true }),
        new CursorModifier({
            showTooltip: true,
            // Show the hovered bar as e.g. "Food" then "Shop A: £40k"
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos
                    .filter((info) => info.isHit)
                    .flatMap((info) => [info.seriesName, `${shops[Math.round(info.xValue)]}: £${info.yValue}k`])
        }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

clusteredColumnChart("scichart-root");
