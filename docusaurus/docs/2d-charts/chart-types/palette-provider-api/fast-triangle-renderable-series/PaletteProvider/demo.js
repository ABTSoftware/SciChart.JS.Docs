import { NumberRange, SciChartSurface, NumericAxis, SciChartJsNavyTheme, XyDataSeries, FastTriangleRenderableSeries, ETriangleSeriesDrawMode } from "scichart";
// #region_A_start
import { EFillPaletteMode, parseColorToUIntArgb } from "scichart";
// Custom PaletteProvider for triangle series which colours datapoints above a threshold
const COLORS = ["#f39c12", "#27ae60", "#2980b9", "#8e44ad"];
class TrianglePaletteProvider {
    fillPaletteMode = EFillPaletteMode.SOLID;
    onAttached() { }
    onDetached() { }
    overrideFillArgb(_xValue, _yValue, index, opacity) {
        const opacityFix = Math.round(opacity * 255);
        return parseColorToUIntArgb(COLORS[Math.floor(index / 3)], opacityFix);
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
    const coordinates = [
        [0, 150],
        [0, 50],
        [50, 0],
        [150, 0],
        [200, 50],
        [200, 150],
        [150, 200],
        [50, 200],
        [0, 150],
        [0, 50]
    ];
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: coordinates.map(p => p[0]),
        yValues: coordinates.map(p => p[1])
    });
    const triangleSeries = new FastTriangleRenderableSeries(wasmContext, {
        dataSeries,
        drawMode: ETriangleSeriesDrawMode.Strip, // each group of three consecutive points in the list defines a triangle, every point is connected to the last two points
        fill: "cornflowerblue",
        opacity: 0.5,
        paletteProvider: new TrianglePaletteProvider()
    });
    // region_B_end
    sciChartSurface.renderableSeries.add(triangleSeries);
}
basicRectangleSeriesChart("scichart-root");
