import {
    SciChartSurface,
    SciChartJsNavyTheme,
    NumericAxis,
    NumberRange,
    OhlcDataSeries,
    FastOhlcRenderableSeries,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    ZoomExtentsModifier,
    EXyDirection,
    TextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint
} from "scichart";

async function ohlcAutoSimplify(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(0, 90),
            axisTitle: "Bar index"
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(85, 120)
        })
    );

    const xValues = Array.from({ length: 90 }, (_, i) => i);
    const openValues = xValues.map(i => 100 + Math.sin(i / 10) * 8 + Math.sin(i / 3) * 2);
    const closeValues = xValues.map(i => 100 + Math.sin((i + 1) / 10) * 8 + Math.sin(i / 3) * 2);
    const highValues = openValues.map((open, i) => Math.max(open, closeValues[i]) + 2);
    const lowValues = openValues.map((open, i) => Math.min(open, closeValues[i]) - 2);
    const dataSeries = new OhlcDataSeries(wasmContext, {
        xValues,
        openValues,
        highValues,
        lowValues,
        closeValues
    });

    // #region_A_start
    const ohlcSeries = new FastOhlcRenderableSeries(wasmContext, {
        dataSeries,
        strokeUp: "#50C7E0",
        strokeDown: "#EC0F6C",
        strokeThickness: 2,
        dataPointWidth: 1,
        autoSimplify: true,
        simplifyOpenThresholdPx: 18, // Hides open tick when spacing < X pixels. (Default: 6)
        simplifyCloseThresholdPx: 10 // Hides close tick when spacing < X pixels. (Default: 4)
    });
    sciChartSurface.renderableSeries.add(ohlcSeries);
    // #region_A_end

    if (!("autoSimplify" in ohlcSeries)) {
        sciChartSurface.delete();
        throw new Error("This example needs a SciChart v6 build with OHLC autoSimplify support.");
    }

    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 0.5,
            y1: 0.02,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            text: "Zoom out slowly: the open ticks disappear first,\nthen the close ticks. Zoom back in to bring them back.",
            fontSize: 14,
            textColor: "#FFFFFF"
        })
    );
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection, growFactor: 0.0005 }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier()
    );
}

ohlcAutoSimplify("scichart-root").catch(error => {
    document.getElementById("scichart-root").textContent = error.message;
    console.error(error);
});
