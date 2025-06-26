import * as SciChart from "scichart";

const {
    BoxAnnotation,
    CustomAnnotation,
    LineAnnotation,
    TextAnnotation,
    NumericAxis,
    SciChartSurface,
    NumberRange,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ECoordinateMode,
    SciChartJsNavyTheme,
    EAnnotationLayer
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region_A_start
    // Add a TextAnnotation using CoordinateMode Relative and Horizontal/Vertical Anchor Point
    // to create a watermark in a fixed position in the middle of the chart
    sciChartSurface.annotations.add(
        // Watermark with CoordinateMode Relative
        new TextAnnotation({
            text: "Create a Watermark",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            x1: 0.5,
            y1: 0.5,
            fontSize: 56,
            fontWeight: "Bold",
            textColor: "#FFFFFF22",
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            annotationLayer: EAnnotationLayer.BelowChart
        })
    );
    // #region_A_end
}

addAnnotationToChart("scichart-root");

async function builderExample(divElementId) {
    const { chartBuilder, EAnnotationType } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // #region_B_start
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        annotations: [
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Create a Watermark",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                    x1: 0.5,
                    y1: 0.5,
                    fontSize: 56,
                    fontWeight: "Bold",
                    textColor: "#FFFFFF22",
                    xCoordinateMode: ECoordinateMode.Relative,
                    yCoordinateMode: ECoordinateMode.Relative,
                    annotationLayer: EAnnotationLayer.BelowChart
                }
            }
        ]
    });
    // #region_B_end
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
