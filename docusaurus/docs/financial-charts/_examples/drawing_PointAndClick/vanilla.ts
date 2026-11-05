import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    DRAWING_TOOL_BY_ID,
    DrawingToolbar,
    DrawingToolsController,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="status"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="tools"></div>
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//     </div>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

async function createChart() {
    const status = document.getElementById("status");
    Object.assign(status.style, statusStyle);

    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });

    // 1. Enable point-and-click drawing: the controller adds the drawing modifiers to every pane,
    // including panes added later, and shows a quick-edit toolbar on a selected drawing.
    // It has no UI of its own: a toolbar, menu or shortcut calls selectTool
    const drawing = DrawingToolsController.attach(financeChartPanel.financeApi);

    // 2. A toolbar: the SDK's drawing-tools rail. Click a tool, then click the chart to place its
    // points. Click the tool again to cancel. The last button opens every tool, grouped
    const toolbar = DrawingToolbar.create(document.getElementById("tools"), drawing, { orientation: "vertical" });

    // 3. Follow what the user does.
    // activeToolChanged: a tool was started, finished or stopped (null when none is active)
    // drawingsChanged: a drawing was added or removed, with the full list
    const show = () => {
        const tool = drawing.activeTool ? DRAWING_TOOL_BY_ID.get(drawing.activeTool)?.label : "none";
        status.textContent = `Active tool: ${tool}. Drawings on the chart: ${drawing.drawings.length}`;
    };
    drawing.activeToolChanged.subscribe(show);
    drawing.drawingsChanged.subscribe(show);
    show();

    // When the page goes away: toolbar.destroy(); drawing.detach(); financeChartPanel.cleanup();
    return { financeChartPanel, drawing, toolbar };
}

// The status line uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const statusStyle: Partial<CSSStyleDeclaration> = {
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: "13px",
};

createChart();
