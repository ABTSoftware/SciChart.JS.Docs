import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const { NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const {
        EAnnotationVisibilityMode,
        FibonacciExtensionAnnotation,
        FibonacciSpeedResistanceArcsAnnotation,
        PitchforkAnnotation,
        SciTraderLightTheme
    } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 70) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(70, 130) }));

    sciChartSurface.annotations.add(
        new FibonacciExtensionAnnotation({
            points: [
                { x: 6, y: 86 },
                { x: 16, y: 104 },
                { x: 26, y: 96 }
            ],
            stroke: "#F97316",
            strokeThickness: 2,
            fillOpacity: 0.12,
            selectionBoxStroke: "#F97316",
            selectionBoxThickness: 16,
            adornerStrokeLineCap: "round",
            adornerStrokeLineJoin: "round",
            annotationsGripsRadius: 6,
            annotationsGripsFill: "#FFFFFF",
            annotationsGripsStroke: "#F97316",
            isEditable: true,
            isSelected: true,
            adornerVisibility: EAnnotationVisibilityMode.Always,
            gripVisibility: EAnnotationVisibilityMode.Always
        }),
        new PitchforkAnnotation({
            points: [
                { x: 31, y: 84 },
                { x: 42, y: 104 },
                { x: 42, y: 90 }
            ],
            stroke: "#2563EB",
            strokeThickness: 2,
            showFullWidthZone: false,
            showHalfWidthZone: false,
            selectionBoxStroke: "#2563EB",
            selectionBoxThickness: 16,
            adornerStrokeLineCap: "square",
            adornerStrokeLineJoin: "miter",
            annotationsGripsRadius: 6,
            annotationsGripsFill: "#FFFFFF",
            annotationsGripsStroke: "#2563EB",
            isEditable: true,
            isSelected: true,
            adornerVisibility: EAnnotationVisibilityMode.Always,
            gripVisibility: EAnnotationVisibilityMode.Always
        }),
        new FibonacciSpeedResistanceArcsAnnotation({
            points: [
                { x: 52, y: 88 },
                { x: 62, y: 110 }
            ],
            stroke: "#10B981",
            strokeThickness: 2,
            fillOpacity: 0.12,
            selectionBoxStroke: "#10B981",
            selectionBoxThickness: 16,
            adornerStrokeLineCap: "round",
            adornerStrokeLineJoin: "bevel",
            annotationsGripsRadius: 6,
            annotationsGripsFill: "#FFFFFF",
            annotationsGripsStroke: "#10B981",
            isEditable: true,
            isSelected: true,
            adornerVisibility: EAnnotationVisibilityMode.Always,
            gripVisibility: EAnnotationVisibilityMode.Always
        })
    );
    // #region_A_end
}

drawExample("scichart-root");

