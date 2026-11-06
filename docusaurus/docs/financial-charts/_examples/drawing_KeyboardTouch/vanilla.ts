import "scichart-scitrader/scitrader.css";
import { SciChartSurface } from "scichart";
import { ETradingAnnotationType } from "scichart-financial-tools";
import {
    AnnotationKeyboardSelectionModifier,
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    DrawingToolbar,
    DrawingToolsController,
    idbPriceStore,
    OHLCStudy,
    OnChartButtonsModifier,
    OnChartKeyboardZoomPanModifier,
    RSIStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="keys"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="tools"></div>
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//     </div>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

async function createChart() {
    const keys = document.getElementById("keys");
    Object.assign(keys.style, keysStyle);
    keys.textContent =
        "Click a pane, then: N / P select drawings, Delete removes, D duplicates, arrows nudge (Shift: 10 px), " +
        "Esc deselects, A draws again. With nothing selected: arrows pan, + / - zoom, 0 resets.";

    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
    });
    const chart = financeChartPanel.financeApi;

    // Touch: a long press selects a drawing, and placement uses a cursor you drag to aim and tap to
    // commit. The cursor applies to a mouse too, so turn touch on for touch screens only
    const drawing = DrawingToolsController.attach(chart, { touch: matchMedia("(pointer: coarse)").matches });
    const toolbar = DrawingToolbar.create(document.getElementById("tools"), drawing, { orientation: "vertical" });

    // The keyboard and on-chart button modifiers are optional, and added to each pane's surface
    function addModifiers(surface: SciChartSurface) {
        surface.chartModifiers.add(
            // Arrow keys pan, + / - zoom, 0 resets the zoom (Shift for bigger steps)
            new OnChartKeyboardZoomPanModifier(),
            // N / P step through the drawings on every pane, Delete removes the selected one, D duplicates
            // it, arrow keys nudge it, Esc deselects. A and Esc call back to your app:
            new AnnotationKeyboardSelectionModifier({
                // A: draw again with the last tool used, or freehand if none has been
                onAddAnnotation: () =>
                    drawing.selectTool(drawing.lastUsedTool ?? ETradingAnnotationType.FreehandDrawingAnnotation),
                // Esc: also cancel a drawing in progress
                onCancelPlacement: () => drawing.stop(),
            }),
            // Zoom, pan and reset buttons on the pane under the mouse
            new OnChartButtonsModifier({ visible: true })
        );
    }

    // Add the modifiers to every pane now, and to panes added later, e.g. by a new study:
    // paneConfigured fires as each pane is set up
    const done = new Set<SciChartSurface>();
    const addToAllPanes = () =>
        chart.chartPanes.forEach(({ surface }) => {
            if (surface && !done.has(surface)) {
                done.add(surface);
                addModifiers(surface);
            }
        });
    addToAllPanes();
    chart.paneConfigured.subscribe(addToAllPanes);

    // When the page goes away:
    // chart.paneConfigured.unsubscribe(addToAllPanes); toolbar.destroy(); drawing.detach(); financeChartPanel.cleanup();
    return { financeChartPanel, drawing, toolbar };
}

// The key help uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const keysStyle: Partial<CSSStyleDeclaration> = {
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: "13px",
};

createChart();
