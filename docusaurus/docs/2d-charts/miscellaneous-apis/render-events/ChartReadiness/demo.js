import { SciChartSurface, NumericAxis, EAutoRange, NumberRange, ZoomPanModifier, XyDataSeries, FastLineRenderableSeries, WaveAnimation, receiveNextEvent } from "scichart";
export const drawExample = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {});
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Once }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Once, growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    // #region_A_start
    const { xValues, yValues } = generateData(10, 1);
    const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues, capacity: 1000 });
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "olive",
        strokeThickness: 2,
        dataSeries,
        animation: new WaveAnimation({ duration: 3000 })
    });
    sciChartSurface.renderableSeries.add(lineSeries);
    // highlight-next-line
    while (await receiveNextEvent(sciChartSurface.painted)) { }
    console.log("animation completed");
    // #region_A_end
    return { sciChartSurface };
};
const generateData = (limit, step, offset = 0) => {
    const xValues = [];
    const yValues = [];
    for (let i = 0; i < limit; i += step) {
        xValues.push(offset + i);
        yValues.push(Math.random() * 20);
    }
    return { xValues, yValues };
};
drawExample("scichart-root");
