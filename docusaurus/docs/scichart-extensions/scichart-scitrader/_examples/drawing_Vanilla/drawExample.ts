import {
    CandleInterval,
    DrawingToolbar,
    DrawingToolsController,
    ISciFinanceChartPanelApi,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";
import { loadSampleData, SAMPLE_EXCHANGE } from "../../sampleData";

export interface IDrawingExample {
    panel: ISciFinanceChartPanelApi;
    drawing: DrawingToolsController;
    cleanup(): void;
}

/**
 * Drawing tools without a framework.
 *
 * `DrawingToolsController.attach` adds the drawing machinery to a chart: placement, freehand
 * and eraser on every pane, a floating edit toolbar on the selected drawing, and pan suspended
 * while a tool is in use. `DrawingToolbar.create` renders a rail that drives it. Any other
 * control can drive it too, through `drawing.selectTool(id)`.
 */
export async function drawExample(toolbarHost: HTMLElement, chartHost: HTMLElement): Promise<IDrawingExample> {
    await loadSampleData();

    const panel = await SciFinanceChartPanel.create(chartHost, {
        exchangeName: SAMPLE_EXCHANGE,
        symbol: "BTCUSDT",
        interval: CandleInterval.FOUR_HOURS,
        period: "3M",
        lockPeriodWidth: false,
        studies: [new OHLCStudy(), new VolumeStudy()],
    });

    const drawing = DrawingToolsController.attach(panel.financeApi);
    const toolbar = DrawingToolbar.create(toolbarHost, drawing);

    return {
        panel,
        drawing,
        cleanup: () => {
            toolbar.destroy();
            drawing.detach();
            panel.cleanup();
        },
    };
}
