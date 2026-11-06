import "scichart-scitrader/scitrader.css";
import { ETradingAnnotationType } from "scichart-financial-tools";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    DRAWING_TOOL_BY_ID,
    DrawingList,
    DrawingToolbar,
    DrawingToolsController,
    EDrawingToolVariantId,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    TDrawingToolId,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="tools"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//         <div id="drawings" style="width: 280px; overflow-y: auto"></div>
//     </div>
//     <div id="log"></div>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// The tools on the rail, in order. Every other tool is in the "All drawing tools" panel
const TOOLS: TDrawingToolId[] = [
    ETradingAnnotationType.ExtendedLineAnnotation,
    ETradingAnnotationType.HorizontalTrendLineAnnotation,
    ETradingAnnotationType.FibonacciRetracementAnnotation,
    EDrawingToolVariantId.PatternElliottImpulse,
    ETradingAnnotationType.StopLossTakeProfitAnnotation,
    EDrawingToolVariantId.Eraser,
];

async function createChart() {
    const log = document.getElementById("log");
    Object.assign(log.style, logStyle);
    const say = (text: string) => (log.textContent = text);

    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const drawing = DrawingToolsController.attach(financeChartPanel.financeApi);

    // DrawingToolbar: a rail of tools that drives the controller. A tool's button lights up while it
    // is in use; clicking it again cancels it. showAllTools adds the button that opens every tool
    const toolbar = DrawingToolbar.create(document.getElementById("tools"), drawing, {
        tools: TOOLS,
        orientation: "horizontal",
        showAllTools: true,
    });

    // DrawingList: the drawings on the chart, following the controller. Each callback you pass
    // replaces the controller's own action for it, so these log the event, then do the action
    const find = (id: string) => drawing.drawings.find((d) => d.id === id);
    const name = (id: string) => DRAWING_TOOL_BY_ID.get(find(id)?.toolId ?? "")?.label ?? id;
    const list = DrawingList.create(document.getElementById("drawings"), {
        controller: drawing,
        title: "My drawings",
        emptyMessage: "Pick a tool above, then click the chart",
        // A row was clicked. Default: select that drawing
        onSelect: (id) => {
            say(`onSelect: ${name(id)}`);
            drawing.select(find(id));
        },
        // Adds an edit button to each row. Open your own editor here, or drawing.openEditor(item)
        onEdit: (id) => say(`onEdit: ${name(id)}`),
        // A row's delete button. Default: remove that drawing
        onDelete: (id) => {
            say(`onDelete: ${name(id)}`);
            drawing.remove(find(id));
        },
        // "Clear all", once confirmed. Default: remove every drawing
        onClearAll: () => {
            say("onClearAll");
            drawing.remove();
        },
        // Ask in your own way before "Clear all"; call proceed() if the user agrees.
        // Default: the list's built-in dialog (.st-confirm-dialog)
        confirmClearAll: (proceed) => {
            say("Remove every drawing? ");
            log.append(
                button("Remove all", () => proceed()),
                button("Cancel", () => say("Clear all cancelled"))
            );
        },
    });

    // When the page goes away: list.destroy(); toolbar.destroy(); drawing.detach(); financeChartPanel.cleanup();
    return { financeChartPanel, drawing, toolbar, list };
}

function button(text: string, onClick: () => void) {
    const b = document.createElement("button");
    b.textContent = text;
    b.onclick = onClick;
    Object.assign(b.style, buttonStyle);
    return b;
}

// The log uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const logStyle: Partial<CSSStyleDeclaration> = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minHeight: "36px",
    padding: "4px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderTop: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: "13px",
};
const buttonStyle: Partial<CSSStyleDeclaration> = {
    padding: "2px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "6px",
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: "13px",
    cursor: "pointer",
};

createChart();
