import {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    XyDataSeries,
    ZoomPanModifier,
    ZoomExtentsModifier,
    NumberRange,
    FastLineRenderableSeries,
    SciChartDefaults,
    TextAnnotation,
    MouseWheelZoomModifier
} from "scichart";


async function twoDChart(divElementId) {

    // region_A_start

    SciChartDefaults.useNativeText = false;

    // 创建 SciChart 表面
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        title: "每日温度变化趋势图",
        titleStyle: {
            fontSize: 30,
        },
    });

    // 配置带中文标签的 X 轴
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "时间（小时）",
        growBy: new NumberRange(0.02, 0.02),
    });

    // 配置带中文标签的 Y 轴
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "温度（摄氏度）",
        growBy: new NumberRange(0.01, 0.1),
    });

    // 添加轴到图表
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // 创建数据系列
    const dataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "北京温度数据"
    });

    // 添加数据点
    dataSeries.appendRange([0, 1, 2, 3, 4, 5], [20, 22, 25, 28, 30, 27]);

    // 创建线系列
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "#FF6600"
    });

    // 添加系列到图表
    sciChartSurface.renderableSeries.add(lineSeries);



    // region_A_end


    // region_B_start

    // 创建中文文本注释
    const textAnnotation = new TextAnnotation({
        text: "最高温度点",
        x1: 4,
        y1: 30,
        fontSize: 14,
        textColor: "#FF0000"
    });

    // 添加注释到图表
    sciChartSurface.annotations.add(textAnnotation);

    // region_B_end



    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier()
    );
}

twoDChart("scichart-root");
