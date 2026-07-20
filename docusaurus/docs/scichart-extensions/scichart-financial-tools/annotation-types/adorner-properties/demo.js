import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { NumberRange, NumericAxis, SciChartSurface } = SciChart;
    const { EAnnotationVisibilityMode, FibonacciExtensionAnnotation, FibonacciSpeedResistanceArcsAnnotation, PitchforkAnnotation, SciTraderLightTheme } = SciChartFinancialTools;
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 70) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(70, 130) }));
    sciChartSurface.annotations.add(new FibonacciExtensionAnnotation({
        points: [
            { x: 4, y: 73 },
            { x: 13, y: 82 },
            { x: 26, y: 84.5 }
        ],
        // stroke: "#F97316",
        strokeThickness: 2,
        fillOpacity: 0.12,
        selectionBoxStroke: "#F97316AA",
        selectionBoxThickness: 6,
        adornerStrokeLineCap: "round",
        adornerStrokeLineJoin: "round",
        annotationsGripsRadius: 4,
        annotationsGripsFill: "#FFFFFF",
        annotationsGripsStroke: "#F97316",
        isEditable: true,
        isSelected: true,
        adornerVisibility: EAnnotationVisibilityMode.Always,
        gripVisibility: EAnnotationVisibilityMode.Always
    }), new PitchforkAnnotation({
        points: [
            { x: 31, y: 79 },
            { x: 42, y: 74 },
            { x: 41, y: 90 }
        ],
        stroke: "#2563EB",
        strokeThickness: 2,
        showFullWidthZone: true,
        showHalfWidthZone: false,
        selectionBoxStroke: "#2563EB66",
        selectionBoxThickness: 22,
        adornerStrokeLineCap: "square",
        adornerStrokeLineJoin: "miter",
        annotationsGripsRadius: 6,
        annotationsGripsFill: "#FFFFFF",
        annotationsGripsStroke: "#2563EB",
        isEditable: true,
        isSelected: true,
        adornerVisibility: EAnnotationVisibilityMode.Always,
        gripVisibility: EAnnotationVisibilityMode.Always
    }), new FibonacciSpeedResistanceArcsAnnotation({
        points: [
            { x: 52, y: 98 },
            { x: 60, y: 102 }
        ],
        thresholds: [0, 0.236, 0.5, 0.618, 1, 1.618, 2.618],
        strokeThickness: 2,
        fillOpacity: 0.12,
        selectionBoxStroke: "#70CEA5",
        selectionBoxThickness: 16,
        adornerStrokeLineCap: "round",
        adornerStrokeLineJoin: "bevel",
        annotationsGripsRadius: 6,
        annotationsGripsFill: "#FFFFFF",
        annotationsGripsStroke: "#70CEA5",
        isEditable: true,
        isSelected: true,
        adornerVisibility: EAnnotationVisibilityMode.Always,
        gripVisibility: EAnnotationVisibilityMode.Always
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new SciChart.AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: SciChart.ECursorStyle.Crosshair,
    }));
}
drawExample("scichart-root");
