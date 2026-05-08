import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { EXyDirection, NumberRange, NumericAxis, SciChartSurface } = SciChart; // or import from "scichart"
    const { FreehandDrawingAnnotation, SciTraderLightTheme } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 10) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(8, 15) }));
    sciChartSurface.annotations.add(new FreehandDrawingAnnotation({
        // Freehand drawings are stored as many polyline points. This static example
        // uses a few points so the editable shape is easy to inspect.
        points: [
            { x: 1, y: 10 },
            { x: 1.6, y: 11.7 },
            { x: 2, y: 12 },
            { x: 2.7, y: 11.2 },
            { x: 3, y: 11 },
            { x: 4, y: 13 },
            { x: 5, y: 12.4 },
            { x: 6, y: 11 }
        ],
        stroke: "#22C55E",
        strokeThickness: 2,
        isEditable: true, isSelected: true,
        // Body dragging lets users move the whole captured stroke.
        allowMove: true,
        // XyDirection enables both horizontal and vertical resize handles.
        resizeDirections: EXyDirection.XyDirection,
        keepAspectRatioOnResize: false,
        // The outline gives freehand strokes resize handles without exposing every point as a grip.
        showBoxOutline: true,
        showBoxOutlineOnlyWhenSelected: false
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new SciChart.AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: SciChart.ECursorStyle.Crosshair,
    }));
}
drawExample("scichart-root");
