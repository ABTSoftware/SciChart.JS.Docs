import "scichart-scitrader/scitrader.css";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, DrawingToolbar, DrawingToolsController, EStudyType, idbPriceStore, MACDStudy, OHLCStudy, registerDrawingTools, SciFinanceChartPanel, studyProvider, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="tools"></div>
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//         <pre id="json"></pre>
//     </div>
// </div>
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// Register the drawing tools' types before restoring, so saved drawings can be rebuilt. Without it,
// fromJSON on a fresh page skips them
registerDrawingTools();
const STORAGE_KEY = "my-app:chart";
const container = document.getElementById("chart");
let financeChartPanel;
let drawing;
let tools;
// Drawing tools for whichever chart is current
function attachDrawingTools() {
    tools?.destroy();
    drawing?.detach();
    drawing = DrawingToolsController.attach(financeChartPanel.financeApi);
    tools = DrawingToolbar.create(document.getElementById("tools"), drawing, { orientation: "vertical" });
}
async function createChart() {
    financeChartPanel = await SciFinanceChartPanel.create(container, {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy(), new MACDStudy()],
    });
    attachDrawingTools();
}
// 1. Save: toJSON() returns the chart as plain JSON: the exchange, symbol, interval and period,
// every study and its settings, the drawings, and the pane layout. Store it anywhere
function save() {
    const state = financeChartPanel.toJSON();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    showJson(state);
}
// 2. Restore: remove the chart, and build it again from the saved JSON. fromJSON recreates the
// studies, panes, drawings and data feed, then loads fresh data
async function restore() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved)
        return;
    const state = JSON.parse(saved);
    tools.destroy();
    drawing.detach();
    financeChartPanel.cleanup();
    financeChartPanel = await SciFinanceChartPanel.fromJSON(container, state, { useSubCharts: state.useSubCharts });
    attachDrawingTools();
}
// Change the chart, so there is something to save: add a study, or draw with the tools on the left
function addStudy(type) {
    financeChartPanel.financeApi.attachStudy(studyProvider.getStudy(type));
}
function showJson(state) {
    const pre = document.getElementById("json");
    Object.assign(pre.style, jsonStyle);
    pre.textContent = `${JSON.stringify(state).length.toLocaleString()} characters\n\n${JSON.stringify(state, null, 2)}`;
}
function renderToolbar() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    const button = (text, onClick) => {
        const b = document.createElement("button");
        b.textContent = text;
        Object.assign(b.style, buttonStyle);
        b.onclick = onClick;
        return b;
    };
    toolbar.replaceChildren(button("Add RSI", () => addStudy(EStudyType.RSI)), button("Add SMA", () => addStudy(EStudyType.SMA)), button("Save", save), button("Restore", restore), button("Clear saved", () => localStorage.removeItem(STORAGE_KEY)));
}
// The toolbar and JSON panel use SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    padding: "8px 12px",
    background: "var(--st-ui-toolbar-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle = {
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.15))",
    borderRadius: "4px",
    background: "var(--st-ui-button-background, #363345)",
    color: "var(--st-ui-text, #e8e8ee)",
    font: "13px sans-serif",
    cursor: "pointer",
};
const jsonStyle = {
    width: "300px",
    margin: "0",
    padding: "8px",
    overflow: "auto",
    background: "var(--st-ui-background, #2b2839)",
    color: "var(--st-ui-text-muted, #9da2bc)",
    font: "11px monospace",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
renderToolbar();
createChart();
