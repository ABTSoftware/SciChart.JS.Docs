import { SciChartSurface } from "scichart";
import {
    CandleInterval,
    DrawingToolbar,
    DrawingToolsController,
    ISciFinanceChartPanelApi,
    OHLCStudy,
    OnChartButtonsModifier,
    RSIStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";
import { loadSampleData, SAMPLE_EXCHANGE } from "../../sampleData";

export interface ICssOverridesExample {
    panel: ISciFinanceChartPanelApi;
    drawing: DrawingToolsController;
    cleanup(): void;
}

/**
 * A chart with every SDK control that `scitrader.css` styles, to restyle with CSS: the drawing
 * toolbar and its "All drawing tools" panel, the on-chart zoom / pan buttons, the per-pane
 * control bar (on hover), the dividers between panes, the restore strip (hide a pane), and the
 * quick-edit toolbar on a selected drawing. Nothing here is specific to styling; the CSS does
 * it all (see skins.ts).
 */
export async function drawExample(toolbarHost: HTMLElement, chartHost: HTMLElement): Promise<ICssOverridesExample> {
    await loadSampleData();

    const panel = await SciFinanceChartPanel.create(chartHost, {
        exchangeName: SAMPLE_EXCHANGE,
        symbol: "BTCUSDT",
        interval: CandleInterval.FOUR_HOURS,
        period: "3M",
        lockPeriodWidth: false,
        studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
    });
    const chart = panel.financeApi;

    const drawing = DrawingToolsController.attach(chart);
    const toolbar = DrawingToolbar.create(toolbarHost, drawing);

    // The zoom / pan strip on every pane, shown all the time so its style is easy to see.
    const withButtons = new Set<SciChartSurface>();
    const addButtons = () =>
        chart.chartPanes.forEach(({ surface }) => {
            if (surface && !withButtons.has(surface)) {
                withButtons.add(surface);
                surface.chartModifiers.add(new OnChartButtonsModifier({ visible: true }));
            }
        });
    addButtons();
    chart.paneConfigured.subscribe(addButtons);

    return {
        panel,
        drawing,
        cleanup: () => {
            chart.paneConfigured.unsubscribe(addButtons);
            toolbar.destroy();
            drawing.detach();
            panel.cleanup();
        },
    };
}
