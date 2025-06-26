import * as SciChart from "scichart";

// #region_A_start
const {
    LineAnnotation,
    TextAnnotation,
    PolarNumericAxis,
    SciChartPolarSurface,
    SciChartJsNavyTheme,
    EPolarAxisMode,
    EHorizontalAnchorPoint,
    Thickness
} = SciChart;
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

    // Add a selection of annotations to the chart
    sciChartSurface.annotations.add(
        new TextAnnotation({
            fontSize: 16,
            text: "In SciChart.js, you can add arbitrary lines",
            x1: 0,
            y1: 0,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            padding: new Thickness(40, 0, 0, 0)
        }),

        new LineAnnotation({
            stroke: "#3399FF",
            strokeThickness: 3,
            x1: 2,
            x2: 6,
            y1: 6,
            y2: 2
        }),
        new LineAnnotation({
            stroke: "#FF6600",
            strokeThickness: 3,
            strokeDashArray: [5, 5],
            x1: 1.5,
            x2: 3,
            y1: 2,
            y2: 7
        })
    );
}

addAnnotationToChart("scichart-root");
// #region_A_end

async function builderExample(divElementId) {
    // #region_B_start
    const { chartBuilder, EAnnotationType, EHorizontalAnchorPoint, Thickness } = SciChart;
    // or for npm import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        annotations: [
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "In SciChart.js, you can add arbitrary lines",
                    fontSize: 16,
                    x1: 0,
                    y1: 0,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    padding: new Thickness(40, 0, 0, 0)
                }
            },
            {
                type: EAnnotationType.RenderContextLineAnnotation,
                options: {
                    stroke: "#3399FF",
                    strokeThickness: 3,
                    x1: 2,
                    x2: 6,
                    y1: 6,
                    y2: 2
                }
            },
            {
                type: EAnnotationType.RenderContextLineAnnotation,
                options: {
                    stroke: "#FF6600",
                    strokeThickness: 3,
                    strokeDashArray: [5, 5],
                    x1: 1.5,
                    x2: 3,
                    y1: 2,
                    y2: 7
                }
            }
        ]
    });
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
