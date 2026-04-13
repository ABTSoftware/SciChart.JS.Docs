import * as SciChart from "scichart";
async function verticalGradientGauge(divElementId) {
    const { SciChartSurface, NumericAxis, SciChartJsNavyTheme, NumberRange, FastRectangleRenderableSeries, XyxyDataSeries,
        EColumnMode, EColumnYMode, GradientParams, Point, EAxisAlignment, Thickness,
        LineArrowAnnotation, EArrowHeadPosition, TextAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint } = SciChart;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        padding: new Thickness(5, 50, 5, 70)
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0, 1) }));

    // region_A_start
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.05, 0.05),
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMinorTickLines: false,
        overrideOffset: 0
    }));

    const gaugeSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues: [0],
            yValues: [0],
            x1Values: [10],
            y1Values: [100]
        }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        strokeThickness: 1,
        stroke: "#FFFFFF44",
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { offset: 0,   color: "#FF4F81" },
            { offset: 0.3, color: "#FF9A3C" },
            { offset: 0.6, color: "#50C7E0" },
            { offset: 0.8, color: "#264B93" },
            { offset: 1,   color: "#1B2A4A" }
        ])
    });
    sciChartSurface.renderableSeries.add(gaugeSeries);

    const value = 60;
    sciChartSurface.annotations.add(
        new LineArrowAnnotation({
            x1: 10, y1: value,
            x2: 11, y2: value,
            stroke: "#FFFFFF",
            strokeThickness: 2,
            arrowHeadPosition: EArrowHeadPosition.Start,
            arrowStyle: { headLength: 10, headWidth: 7, headDepth: 1, fill: "#FFFFFF", strokeThickness: 1 }
        }),
        new TextAnnotation({
            x1: 13, y1: value,
            text: `${value}`,
            fontSize: 12,
            textColor: "#FFFFFF",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Center
        })
    );
    // region_A_end

    return { sciChartSurface };
}
verticalGradientGauge("scichart-root");
