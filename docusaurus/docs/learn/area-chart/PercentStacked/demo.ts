import * as SciChart from "scichart";

// Generates 24 months of website visitors by device with a seeded random generator,
// so the chart looks the same every time and needs no external data.
function generateVisitorsByDevice(months = 24) {
    let seed = 23;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const xValues = [];
    const desktop = [];
    const mobile = [];
    const tablet = [];
    for (let i = 0; i < months; i++) {
        xValues.push(Date.UTC(2024, i, 1) / 1000); // SciChart expects Unix timestamps in seconds
        desktop.push(Math.round(30 - i * 0.3 + random() * 4));
        mobile.push(Math.round(20 + i * 0.9 + random() * 4));
        tablet.push(Math.round(6 + random() * 2));
    }
    return { xValues, desktop, mobile, tablet };
}

async function percentStackedAreaChart(divElementId) {
    // #region_A_start
    // The same data as a 100% stacked area chart: each layer shows its share of the total
    const {
        SciChartSurface,
        DateTimeNumericAxis,
        NumericAxis,
        StackedMountainRenderableSeries,
        StackedMountainCollection,
        XyDataSeries,
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
    sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Share of visitors",
            labelPostfix: "%",
            labelPrecision: 0,
            visibleRange: new NumberRange(0, 100),
            zoomExtentsToInitialRange: true // double-click returns to 0-100%
        })
    );

    const { xValues, desktop, mobile, tablet } = generateVisitorsByDevice();

    // One StackedMountainRenderableSeries per layer; each is drawn on top of the one before
    const layer = (yValues, dataSeriesName, fill) =>
        new StackedMountainRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName }),
            fill,
            stroke: "#E4F5FC",
            strokeThickness: 1
        });

    // Add the layers to a StackedMountainCollection, and the collection to the chart.
    // isOneHundredPercent: true scales every month so the stack reaches 100%
    const stackedCollection = new StackedMountainCollection(wasmContext, { isOneHundredPercent: true });
    stackedCollection.add(
        layer(desktop, "Desktop", "#882B91"),
        layer(mobile, "Mobile", "#50C7E0"),
        layer(tablet, "Tablet", "#F48420")
    );
    sciChartSurface.renderableSeries.add(stackedCollection);

    sciChartSurface.chartModifiers.add(
        new LegendModifier(),
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

percentStackedAreaChart("scichart-root");
