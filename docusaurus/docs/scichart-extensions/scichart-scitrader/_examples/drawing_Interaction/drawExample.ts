import { SciChartSurface } from "scichart";
import { ETradingAnnotationType } from "scichart-financial-tools";
import {
    AnnotationKeyboardSelectionModifier,
    CandleInterval,
    DrawingToolsController,
    ISciFinanceChartPanelApi,
    OHLCStudy,
    OnChartButtonsModifier,
    OnChartKeyboardZoomPanModifier,
    RSIStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";
import { loadSampleData, SAMPLE_EXCHANGE } from "../../sampleData";

/**
 * Keyboard, touch and on-chart buttons. The drawing tools' `touch` option makes a long press select
 * a drawing on touch screens. The rest are optional chart modifiers, added to each pane's surface:
 *
 * - `OnChartKeyboardZoomPanModifier`: arrow keys pan, `+` / `-` zoom, `0` resets (Shift for bigger
 *   steps). Click a pane to give it focus.
 * - `AnnotationKeyboardSelectionModifier`: `N` / `P` step through drawings, `Delete` removes the
 *   selected one, `Esc` deselects, `A` draws again with the last tool.
 * - `OnChartButtonsModifier`: a zoom / pan / reset strip that appears on the pane under the mouse.
 */
export async function drawExample(
    container: HTMLElement
): Promise<{ panel: ISciFinanceChartPanelApi; cleanup(): void }> {
    await loadSampleData();

    const panel = await SciFinanceChartPanel.create(container, {
        exchangeName: SAMPLE_EXCHANGE,
        symbol: "ETHUSDT",
        interval: CandleInterval.FOUR_HOURS,
        period: "1M",
        lockPeriodWidth: false,
        studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
    });
    const chart = panel.financeApi;
    // `touch` also switches placement to a drag-to-aim cursor, for a mouse too, so only on a touch screen.
    const drawing = DrawingToolsController.attach(chart, { touch: matchMedia("(pointer: coarse)").matches });

    const addModifiers = (surface: SciChartSurface) => {
        surface.chartModifiers.add(
            new OnChartKeyboardZoomPanModifier(),
            new AnnotationKeyboardSelectionModifier({
                onAddAnnotation: () =>
                    drawing.selectTool(drawing.lastUsedTool ?? ETradingAnnotationType.FreehandDrawingAnnotation),
                onCancelPlacement: () => drawing.stop(),
            }),
            new OnChartButtonsModifier({ visible: true })
        );
    };

    // Every pane now, and any pane a study adds later.
    const done = new Set<SciChartSurface>();
    const attachAll = () =>
        chart.chartPanes.forEach(({ surface }) => {
            if (surface && !done.has(surface)) {
                done.add(surface);
                addModifiers(surface);
            }
        });
    attachAll();
    chart.paneConfigured.subscribe(attachAll);

    return {
        panel,
        cleanup: () => {
            chart.paneConfigured.unsubscribe(attachAll);
            drawing.detach();
            panel.cleanup();
        },
    };
}
