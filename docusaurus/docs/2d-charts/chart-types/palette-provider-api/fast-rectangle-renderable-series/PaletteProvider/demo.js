import { NumberRange, EColumnMode, EColumnYMode, SciChartSurface, NumericAxis, SciChartJsNavyTheme, FastRectangleRenderableSeries, XyxyDataSeries, } from "scichart";
// #region_A_start
import { DefaultPaletteProvider, EStrokePaletteMode, parseColorToUIntArgb } from "scichart";
// Custom PaletteProvider for rectangle series which colours datapoints above a threshold
class RectanglePaletteProvider extends DefaultPaletteProvider {
    threshold;
    stroke;
    fillColor;
    constructor(threshold) {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.threshold = threshold;
        this.stroke = parseColorToUIntArgb("#FF0000");
        this.fillColor = parseColorToUIntArgb("#FF000077");
    }
    // This function is called for every data-point.
    // Return undefined to use the default color for the rectangle,
    // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
    overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
        return yValue > this.threshold
            ? this.fillColor
            : undefined;
    }
    // This function is called for every data-point
    // Return undefined to use the default color for the fill, else, return
    // a custom color as ARGB color code e.g. 0xFFFF0000 is red
    overrideFillArgb(xValue, yValue, index, opacity, metadata) {
        return yValue > this.threshold
            ? this.fillColor
            : undefined;
    }
}
// #region_A_end
async function basicRectangleSeriesChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));
    // region_B_start
    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues: [0, 6, 10, 17, 23],
            yValues: [0, 6, 2, 5, 8],
            x1Values: [5, 9, 15, 25, 30],
            y1Values: [5, 9, 8, 10, 15]
        }),
        columnXMode: EColumnMode.StartEnd, // x, x1
        columnYMode: EColumnYMode.TopBottom, // y, y1
        fill: "skyblue",
        stroke: "white",
        strokeThickness: 2,
        opacity: 0.5,
        paletteProvider: new RectanglePaletteProvider(4.5) // rectangles with yValue > 4.5 will be coloured red
    });
    // region_B_end
    sciChartSurface.renderableSeries.add(rectangleSeries);
}
basicRectangleSeriesChart("scichart-root");
