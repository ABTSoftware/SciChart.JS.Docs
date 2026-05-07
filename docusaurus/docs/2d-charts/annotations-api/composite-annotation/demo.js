import * as SciChart from "scichart";
async function drawExample(divElementId) {
    // #region_A_start
    const { CompositeAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint, LineAnnotation, NumberRange, NumericAxis, SciChartJsNavyTheme, SciChartSurface, TextAnnotation } = SciChart;
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 30) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(90, 130) }));
    sciChartSurface.annotations.add(new CompositeAnnotation({
        // The parent bounds define an invisible coordinate space for the children.
        x1: 8,
        x2: 22,
        y1: 100,
        y2: 120,
        isEditable: true,
        fill: "#00000000",
        stroke: "#00000000",
        strokeThickness: 0,
        annotations: [
            // Child coordinates between 0 and 1 are relative to the composite bounds.
            new LineAnnotation({
                x1: 0.1,
                y1: 0.7,
                x2: 0.9,
                y2: 0.3,
                stroke: "#50C7E0",
                strokeThickness: 4
            }),
            new TextAnnotation({
                x1: 0.5,
                y1: 0.23,
                text: "Grouped line + label",
                fontSize: 16,
                textColor: "#FFFFFF",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Bottom
            })
        ]
    }));
    // #region_A_end
}
drawExample("scichart-root");
