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

    // 2Dチャートで日本語タイトルとラベルを設定
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        title: "売上グラフ", // 日本語タイトル
        titleStyle: {
            fontSize: 30
        }
    });

    // X軸の日本語ラベル
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "月", // 日本語軸タイトル
        growBy: new NumberRange(0.02, 0.02)
    });

    // Y軸の日本語ラベル
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "売上（万円）", // 日本語軸タイトル
        growBy: new NumberRange(0.01, 0.1)
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "日本語シリーズ名"
    });

    dataSeries.appendRange([0, 1, 2, 3, 4, 5], [20, 22, 25, 28, 30, 27]);

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "#FF6600"
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    const textAnnotation = new TextAnnotation({
        text: "重要なポイント：売上が急上昇", // 日本語注釈
        x1: 4,
        y1: 30,
        fontSize: 14,
        textColor: "#FF0000"
    });

    sciChartSurface.annotations.add(textAnnotation);

    // region_A_end

    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier()
    );
}

twoDChart("scichart-root");
