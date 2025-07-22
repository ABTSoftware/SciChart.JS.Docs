import { SciChartSurface, SciChartJsNavyTheme, NumericAxis, SciChartSubSurface, ESubSurfacePositionCoordinateMode, ZoomPanModifier } from "scichart";
const xValues = [];
const yValues = [];
const yValues1 = [];
const yValues2 = [];
for (let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
    yValues1.push(0.1 * Math.sin(i * 0.3) - Math.cos(i * 0.02));
    yValues2.push(0.1 * Math.sin(i * 0.7) - Math.cos(i * 0.03));
}
async function simpleSubChart(divElementId) {
    // Create a parent (regular) SciChartSurface which will contain the sub-chart
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    // Create X,Y axis on the parent chart and programmatically zoom into part of the data
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {}));
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    const titleStyle = {
        color: "yellow",
        fontSize: 12
    };
    // #region_A_start
    const subChart1 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: { x: 0.1, y: 0.1, width: 0.4, height: 0.3 },
        isTransparent: false,
        coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
        title: "SubChart 1",
        titleStyle
    });
    subChart1.xAxes.add(new NumericAxis(wasmContext));
    subChart1.yAxes.add(new NumericAxis(wasmContext));
    const subChart2 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: { left: 600, right: 900, top: 100, bottom: 300 },
        isTransparent: false,
        coordinateMode: [ESubSurfacePositionCoordinateMode.Pixel, ESubSurfacePositionCoordinateMode.Pixel],
        title: "SubChart 2",
        titleStyle
    });
    subChart2.xAxes.add(new NumericAxis(wasmContext));
    subChart2.yAxes.add(new NumericAxis(wasmContext));
    const subChart3 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: { x1: 6, x2: 9, y1: 6, y2: 2 },
        isTransparent: false,
        coordinateMode: [
            ESubSurfacePositionCoordinateMode.DataValue,
            ESubSurfacePositionCoordinateMode.DataValue,
            ESubSurfacePositionCoordinateMode.DataValue,
            ESubSurfacePositionCoordinateMode.DataValue
        ],
        title: "SubChart 3",
        titleStyle
    });
    subChart3.xAxes.add(new NumericAxis(wasmContext));
    subChart3.yAxes.add(new NumericAxis(wasmContext));
    // #region_A_end
    return { sciChartSurface };
}
simpleSubChart("scichart-root");
