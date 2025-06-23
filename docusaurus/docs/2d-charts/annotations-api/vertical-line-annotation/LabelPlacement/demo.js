import * as SciChart from "scichart";
const { VerticalLineAnnotation, NumericAxis, SciChartSurface, ELabelPlacement, SciChartJsNavyTheme } = SciChart;
// or for npm import { SciChartSurface, ... } from "scichart"
async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region_A_start
    // Add a selection of annotations to the chart
    sciChartSurface.annotations.add(
    // Vertically line stretched across the viewport, showing label value = X (9)
    new VerticalLineAnnotation({
        labelPlacement: ELabelPlacement.TopRight,
        showLabel: true,
        stroke: "#FF6600",
        strokeThickness: 2,
        x1: 9,
        axisLabelFill: "#FF6600",
        axisLabelStroke: "#333",
        axisFontSize: 20
    }), 
    // Vertically line with a custom label value
    new VerticalLineAnnotation({
        labelPlacement: ELabelPlacement.TopLeft,
        showLabel: true,
        stroke: "#3388FF",
        strokeThickness: 2,
        strokeDashArray: [5, 5],
        x1: 4,
        axisLabelFill: "#3388FF",
        labelValue: "Custom Label",
        axisLabelStroke: "White",
        axisFontSize: 20
    }));
    // #region_A_end
}
addAnnotationToChart("scichart-root");
async function builderExample(divElementId) {
    // #region_B_start
    const { chartBuilder, EAnnotationType } = SciChart;
    // or for npm import { SciChartSurface, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        annotations: [
            {
                type: EAnnotationType.RenderContextVerticalLineAnnotation,
                options: {
                    labelPlacement: ELabelPlacement.TopRight,
                    showLabel: true,
                    stroke: "#FF6600",
                    strokeThickness: 2,
                    x1: 9,
                    axisLabelFill: "#FF6600",
                    axisLabelStroke: "#333",
                    axisFontSize: 20
                }
            },
            {
                type: EAnnotationType.RenderContextVerticalLineAnnotation,
                options: {
                    labelPlacement: ELabelPlacement.TopLeft,
                    showLabel: true,
                    stroke: "#3388FF",
                    strokeThickness: 2,
                    strokeDashArray: [5, 5],
                    x1: 4,
                    axisLabelFill: "#3388FF",
                    labelValue: "Custom Label",
                    axisLabelStroke: "White",
                    axisFontSize: 20
                }
            }
        ]
    });
    // #region_B_end
}
if (location.search.includes("builder=1"))
    builderExample("scichart-root");
