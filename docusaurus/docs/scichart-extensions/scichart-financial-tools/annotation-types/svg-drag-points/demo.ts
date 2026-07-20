import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const {
        AnnotationHoverModifier,
        ECursorStyle,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        NativeTextAnnotation,
        NumberRange,
        NumericAxis,
        SciChartSurface
    } = SciChart;
    const {
        PolyLineAnnotation,
        SciTraderLightTheme,
        EAnnotationVisibilityMode
    } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 60) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(72, 132) }));

    const hoverGrowGripSvgTemplate = (annotation, x, y, context) => {
        const strokeWidth = "strokeThickness" in annotation ? annotation.strokeThickness : 1;
        const radius = annotation.annotationsGripsRadius + (context?.isHovered ? 2 : 0);
        const fill = context?.isSelected
            ? "#10B981"
            : context?.isHovered
                ? "#60A5FA"
                : annotation.annotationsGripsFill;

        return `<circle
            cx="${x}" cy="${y}"
            r="${radius}"
            fill="${fill}"
            stroke="${annotation.annotationsGripsStroke}"
            stroke-width="${strokeWidth}"
        />`;
    };

    const squareStateGripSvgTemplate = (annotation, x, y, context) => {
        const strokeWidth = "strokeThickness" in annotation ? annotation.strokeThickness : 1;
        const size = Math.max(6, annotation.annotationsGripsRadius * 2 + (context?.isSelected ? -2 : 0));
        const fill = context?.isSelected
            ? "#222"
            : annotation.annotationsGripsFill;

        return `<rect
            x="${x - size / 2}"
            y="${y - size / 2}"
            width="${size}"
            height="${size}"
            rx="2"
            ry="2"
            fill="${fill}"
            stroke="${annotation.annotationsGripsStroke}"
            stroke-width="${strokeWidth}"
        />`;
    };

    sciChartSurface.annotations.add(
        new PolyLineAnnotation({
            points: [
                { x: 10, y: 118 },
                { x: 20, y: 124 },
                { x: 29, y: 115 }
            ],
            stroke: "#94A3B8",
            strokeThickness: 2,
            isEditable: true,
            gripVisibility: EAnnotationVisibilityMode.Always,
        }),
        new PolyLineAnnotation({
            points: [
                { x: 10, y: 99 },
                { x: 21, y: 105 },
                { x: 31, y: 96 }
            ],
            stroke: "#3B82F6",
            strokeThickness: 2,
            isEditable: true,
            gripVisibility: EAnnotationVisibilityMode.Always,
            gripSvgTemplate: hoverGrowGripSvgTemplate
        }),
        new PolyLineAnnotation({
            points: [
                { x: 10, y: 80 },
                { x: 21, y: 86 },
                { x: 31, y: 77 }
            ],
            stroke: "#10B981",
            strokeThickness: 2,
            isEditable: true,
            isSelected: true,
            gripVisibility: EAnnotationVisibilityMode.Always,
            gripSvgTemplate: squareStateGripSvgTemplate
        })
    );
    // #region_A_end

    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            x1: 6,
            y1: 128,
            text: "Default grips",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            fontSize: 14,
            textColor: "#111827"
        }),
        new NativeTextAnnotation({
            x1: 6,
            y1: 109,
            text: "Hover grows",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            fontSize: 14,
            textColor: "#111827",
        }),
        new NativeTextAnnotation({
            x1: 6,
            y1: 90,
            text: "Selected state",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            fontSize: 14,
            textColor: "#111827",
        }),
    )

    sciChartSurface.chartModifiers.add(
        new AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair
        })
    );
}

drawExample("scichart-root");

