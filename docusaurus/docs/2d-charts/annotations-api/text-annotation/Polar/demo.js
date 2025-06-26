import * as SciChart from "scichart";
// #region_A_start
const { LineAnnotation, TextAnnotation, PolarNumericAxis, SciChartPolarSurface, SciChartJsNavyTheme, EPolarAxisMode, EHorizontalAnchorPoint, EVerticalAnchorPoint, ECoordinateMode, EAnnotationLayer } = SciChart;
// or for npm import { SciChartPolarSurface, ... } from "scichart"
async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    const angularAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
    });
    sciChartSurface.xAxes.add(angularAxis);
    const radialAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
    });
    sciChartSurface.yAxes.add(radialAxis);
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "Polar Text Annotations",
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        x1: 2.5, // at 12 o'clock (if range is 0 ot 10, since startAngle is at 9 o'clock)
        y1: 2,
        fontSize: 56,
        fontWeight: "Bold",
        textColor: "#FFFFFF22",
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        annotationLayer: EAnnotationLayer.BelowChart
    }));
}
addAnnotationToChart("scichart-root");
// #region_A_end
async function builderExample(divElementId) {
    // #region_B_start
    const { chartBuilder, EAnnotationType, EHorizontalAnchorPoint, EVerticalAnchorPoint, ECoordinateMode, EAnnotationLayer } = SciChart;
    // or for npm import { chartBuilder , ... } from "scichart"
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        annotations: [
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Polar Text Annotations",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                    x1: 2.5, // at 12 o'clock (if range is 0 ot 10, since startAngle is at 9 o'clock)
                    y1: 2,
                    fontSize: 56,
                    fontWeight: "Bold",
                    textColor: "#FFFFFF22",
                    xCoordinateMode: ECoordinateMode.DataValue,
                    yCoordinateMode: ECoordinateMode.DataValue,
                    annotationLayer: EAnnotationLayer.BelowChart
                }
            }
        ]
    });
    // #region_B_end
}
if (location.search.includes("builder=1"))
    builderExample("scichart-root");
