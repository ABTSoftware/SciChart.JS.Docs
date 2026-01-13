import { ENumericFormat, MouseWheelZoomModifier, NumericAxis, SciChartSurface, StackedColumnCollection, StackedColumnRenderableSeries, WaveAnimation, NumberRange, XyDataSeries, ZoomExtentsModifier, ZoomPanModifier, EVerticalTextPosition, EColumnDataLabelPosition, Thickness, EFillPaletteMode, EStrokePaletteMode, parseColorToUIntArgb, SciChartJsNavyTheme } from "scichart";
const xValues = [1997, 1998, 1999, 2000, 2001, 2002, 2003];
const tomatoesData = [15, 17, 26, 22, 28, 21, 22];
const cucumberData = [14, 12, 27, 25, 23, 17, 17];
const pepperData = [17, 14, 27, 26, 22, 28, 16];
// #region_A_start
/**
 * Custom PaletteProvider for Stacked Column Series
 * Colors columns based on their values - higher values get warmer colors
 */
class StackedColumnPaletteProvider {
    fillPaletteMode = EFillPaletteMode.SOLID;
    strokePaletteMode = EStrokePaletteMode.SOLID;
    lowValueColor;
    mediumValueColor;
    highValueColor;
    strokeColor;
    constructor() {
        // Convert theme colors to ARGB numbers for performance
        this.lowValueColor = parseColorToUIntArgb("skyblue");
        this.mediumValueColor = parseColorToUIntArgb("orange");
        this.highValueColor = parseColorToUIntArgb("red");
        this.strokeColor = parseColorToUIntArgb("white");
    }
    onAttached(parentSeries) { }
    onDetached() { }
    // Override fill color based on Y value
    overrideFillArgb(xValue, yValue, index, opacity, metadata) {
        // Color based on value ranges
        if (yValue >= 50) {
            return this.highValueColor; // High values - red
        }
        else if (yValue >= 30) {
            return this.mediumValueColor; // Medium values - orange
        }
        else {
            return this.lowValueColor; // Low values - sky blue
        }
    }
    // Override stroke color
    overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
        return this.strokeColor; // Always white stroke
    }
}
// #region_A_end
async function drawScatterChartWithPalette(rootElement) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme()
    });
    // Create XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 0,
        autoTicks: false,
        majorDelta: 1,
        minorDelta: 1,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorBands: false,
        axisTitle: "Year",
        growBy: new NumberRange(0.02, 0.02)
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMinorTickLines: false,
        axisTitle: "Produce sold (Tonnes)",
        growBy: new NumberRange(0.02, 0.05)
    }));
    const dataLabels = {
        style: {
            fontSize: 12,
            fontFamily: "Arial",
            padding: new Thickness(0, 0, 2, 0) // lift label above the top by 2 pixels
        },
        color: "white",
        positionMode: EColumnDataLabelPosition.Outside,
        verticalTextPosition: EVerticalTextPosition.Center,
        precision: 0
    };
    // #region_B_start
    const rendSeries1 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: tomatoesData, dataSeriesName: "Tomato" }),
        fill: "red",
        stroke: "white",
        stackedGroupId: "Group0",
        dataLabels
    });
    // Apply custom paletteProvider after creation
    rendSeries1.paletteProvider = new StackedColumnPaletteProvider();
    const rendSeries2 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: pepperData, dataSeriesName: "Pepper" }),
        fill: "orange",
        stroke: "white",
        stackedGroupId: "Group0",
        dataLabels,
        paletteProvider: new StackedColumnPaletteProvider() // Apply custom paletteProvider during series creation
    });
    // Apply custom paletteProvider after creation
    // rendSeries2.paletteProvider = paletteProvider1;
    const rendSeries3 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: cucumberData, dataSeriesName: "Cucumber" }),
        fill: "skyblue",
        stroke: "white",
        stackedGroupId: "Group0",
        dataLabels
    });
    // Apply custom paletteProvider after creation
    rendSeries3.paletteProvider = new StackedColumnPaletteProvider();
    // #region_B_end
    // To add the series to the chart, put them in a StackedColumnCollection
    const stackedColumnCollection = new StackedColumnCollection(wasmContext);
    stackedColumnCollection.dataPointWidth = 0.5;
    stackedColumnCollection.add(rendSeries1, rendSeries2, rendSeries3);
    stackedColumnCollection.animation = new WaveAnimation({ duration: 1000, fadeEffect: true });
    // Add the Stacked Column collection to the chart
    sciChartSurface.renderableSeries.add(stackedColumnCollection);
    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier({ enableZoom: true }), new MouseWheelZoomModifier());
    // Add a legend to the chart to show the series
    // sciChartSurface.chartModifiers.add(
    //     new LegendModifier({
    //         placement: ELegendPlacement.TopLeft,
    //         orientation: ELegendOrientation.Vertical,
    //         showLegend: true,
    //         showCheckboxes: false,
    //         showSeriesMarkers: true,
    //     })
    // );
    sciChartSurface.zoomExtents();
}
drawScatterChartWithPalette("scichart-root");
