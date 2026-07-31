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
    const { PolyLineAnnotation, SciTraderLightTheme } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 60) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(84, 136) }));

    const createEditableLine = (points, stroke, isSelected = false) =>
        new PolyLineAnnotation({
            points,
            stroke,
            strokeThickness: 3,
            fill: "#00000000",
            isEditable: true,
            isSelected
        });

    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            x1: 6,
            y1: 132,
            text: "Backspace deletes, Cmd/Ctrl+C copies, Cmd/Ctrl+V pastes, Cmd/Ctrl+D duplicates.",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            fontSize: 13,
            textColor: "#111827"
        }),
        createEditableLine(
            [
                { x: 10, y: 124 },
                { x: 22, y: 129 },
                { x: 34, y: 121 }
            ],
            "#3B82F6",
            true
        ),
        createEditableLine(
            [
                { x: 10, y: 112 },
                { x: 23, y: 118 },
                { x: 36, y: 110 }
            ],
            "#F97316"
        ),
        createEditableLine(
            [
                { x: 10, y: 100 },
                { x: 24, y: 106 },
                { x: 38, y: 97 }
            ],
            "#10B981"
        )
    );

    let clipboardOptions;

    const getSelectedAnnotation = () =>
        sciChartSurface.annotations
            .asArray()
            .find(annotation => annotation.isSelected && annotation instanceof PolyLineAnnotation);

    const clonePolyline = (options, offsetX, offsetY) => ({
        ...options,
        points: (options.points ?? []).map(point => ({
            ...point,
            x: typeof point.x === "number" ? point.x + offsetX : point.x,
            y: typeof point.y === "number" ? point.y + offsetY : point.y
        })),
        isSelected: true
    });

    const removeSelectedAnnotations = () => {
        const selectedAnnotation = getSelectedAnnotation();
        if (!selectedAnnotation) {
            return false;
        }

        sciChartSurface.annotations.remove(selectedAnnotation);
        return true;
    };

    const copySelectedAnnotation = () => {
        const selectedAnnotation = getSelectedAnnotation();
        if (!selectedAnnotation) {
            return false;
        }

        clipboardOptions = selectedAnnotation.toJSON().options;
        return true;
    };

    const pasteClipboardAnnotation = () => {
        if (!clipboardOptions) {
            return false;
        }

        const duplicate = new PolyLineAnnotation(clonePolyline(clipboardOptions, 3, -3));
        sciChartSurface.annotations.add(duplicate);
        return true;
    };

    const duplicateSelectedAnnotation = () => {
        if (!copySelectedAnnotation()) {
            return false;
        }

        const selectedAnnotation = getSelectedAnnotation();
        if (selectedAnnotation) {
            selectedAnnotation.isSelected = false;
        }

        return pasteClipboardAnnotation();
    };

    const isTypingTarget = target =>
        target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

    const onKeyboardShortcuts = event => {
        if (isTypingTarget(event.target)) {
            return;
        }

        if (event.key === "Backspace" || event.key === "Delete") {
            if (removeSelectedAnnotations()) {
                event.preventDefault();
                event.stopPropagation();
            }
            return;
        }

        const lowerKey = event.key.toLowerCase();
        const isCmdOrCtrl = event.metaKey || event.ctrlKey;

        if (isCmdOrCtrl && !event.altKey && lowerKey === "c") {
            if (copySelectedAnnotation()) {
                event.preventDefault();
                event.stopPropagation();
            }
            return;
        }

        if (isCmdOrCtrl && !event.altKey && lowerKey === "v") {
            if (pasteClipboardAnnotation()) {
                event.preventDefault();
                event.stopPropagation();
            }
            return;
        }

        if (isCmdOrCtrl && !event.altKey && lowerKey === "d") {
            if (duplicateSelectedAnnotation()) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    };

    document.addEventListener("keydown", onKeyboardShortcuts);

    sciChartSurface.chartModifiers.add(
        new AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair
        })
    );
    // #region_A_end
}

drawExample("scichart-root");
