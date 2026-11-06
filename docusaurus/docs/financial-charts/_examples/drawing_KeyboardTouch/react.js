import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { ETradingAnnotationType } from "scichart-financial-tools";
import { AnnotationKeyboardSelectionModifier, CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, OnChartButtonsModifier, OnChartKeyboardZoomPanModifier, RSIStudy, VolumeStudy, } from "scichart-scitrader";
import { DrawingToolbar, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// Touch: a long press selects a drawing, and placement uses a cursor you drag to aim and tap to
// commit. The cursor applies to a mouse too, so turn touch on for touch screens only
const DRAWING_OPTIONS = { touch: matchMedia("(pointer: coarse)").matches };
export function KeyboardAndTouchChart() {
    const [chartApi, setChartApi] = React.useState();
    const { controller } = useDrawingTools(chartApi, DRAWING_OPTIONS);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
    }), []);
    // The keyboard and on-chart button modifiers are optional, and added to each pane's surface:
    // every pane now, and panes added later (paneConfigured fires as each pane is set up)
    React.useEffect(() => {
        if (!chartApi || !controller)
            return undefined;
        const chart = chartApi.financeApi;
        const done = new Set();
        const addToAllPanes = () => chart.chartPanes.forEach(({ surface }) => {
            if (!surface || done.has(surface))
                return;
            done.add(surface);
            surface.chartModifiers.add(
            // Arrow keys pan, + / - zoom, 0 resets the zoom (Shift for bigger steps)
            new OnChartKeyboardZoomPanModifier(), 
            // N / P step through the drawings on every pane, Delete removes the selected one,
            // D duplicates it, arrow keys nudge it, Esc deselects. A and Esc call back to your app:
            new AnnotationKeyboardSelectionModifier({
                // A: draw again with the last tool used, or freehand if none has been
                onAddAnnotation: () => controller.selectTool(controller.lastUsedTool ?? ETradingAnnotationType.FreehandDrawingAnnotation),
                // Esc: also cancel a drawing in progress
                onCancelPlacement: () => controller.stop(),
            }), 
            // Zoom, pan and reset buttons on the pane under the mouse
            new OnChartButtonsModifier({ visible: true }));
        });
        addToAllPanes();
        chart.paneConfigured.subscribe(addToAllPanes);
        return () => chart.paneConfigured.unsubscribe(addToAllPanes);
    }, [chartApi, controller]);
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: keysStyle }, "Click a pane, then: N / P select drawings, Delete removes, D duplicates, arrows nudge (Shift: 10 px), Esc deselects, A draws again. With nothing selected: arrows pan, + / - zoom, 0 resets."),
        React.createElement("div", { style: { display: "flex", flex: 1, minHeight: 0 } },
            React.createElement(DrawingToolbar, { controller: controller, orientation: "vertical" }),
            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement(SciFinanceChartView, { config: config, onInit: setChartApi })))));
}
// The key help uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const keysStyle = {
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: 13,
};
