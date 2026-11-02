import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { SciChartSurface } from "scichart";
import { ETradingAnnotationType } from "scichart-financial-tools";
import {
    AnnotationKeyboardSelectionModifier,
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    OnChartButtonsModifier,
    OnChartKeyboardZoomPanModifier,
    RSIStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// Touch: a long press selects a drawing. Turn it on only on a touch screen, since it also changes
// placement to a drag-to-aim cursor
const DRAWING_OPTIONS = { touch: matchMedia("(pointer: coarse)").matches };

export function KeyboardAndTouchChart() {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    const { controller } = useDrawingTools(api, DRAWING_OPTIONS);

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "ETHUSDT",
            interval: CandleInterval.FOUR_HOURS,
            period: "1M",
            studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
        }),
        []
    );

    // Add the keyboard and on-chart button modifiers to every pane, including panes added later
    React.useEffect(() => {
        if (!api || !controller) return undefined;
        const chart = api.financeApi;
        const done = new Set<SciChartSurface>();

        const addToAllPanes = () =>
            chart.chartPanes.forEach(({ surface }) => {
                if (!surface || done.has(surface)) return;
                done.add(surface);
                surface.chartModifiers.add(
                    // Click a pane, then: arrow keys pan, + / - zoom, 0 resets
                    new OnChartKeyboardZoomPanModifier(),
                    // N / P step through drawings, Delete removes, Esc deselects, A draws with the last tool
                    new AnnotationKeyboardSelectionModifier({
                        onAddAnnotation: () =>
                            controller.selectTool(
                                controller.lastUsedTool ?? ETradingAnnotationType.FreehandDrawingAnnotation
                            ),
                        onCancelPlacement: () => controller.stop(),
                    }),
                    // Zoom, pan and reset buttons on the pane under the mouse
                    new OnChartButtonsModifier({ visible: true })
                );
            });

        addToAllPanes();
        chart.paneConfigured.subscribe(addToAllPanes);
        return () => chart.paneConfigured.unsubscribe(addToAllPanes);
    }, [api, controller]);

    return (
        <div style={{ height: 600 }}>
            <SciFinanceChartView config={config} onInit={setApi} />
        </div>
    );
}
