import "scichart-scitrader/scitrader.css";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, EMAStudy, idbPriceStore, MACDStudy, OHLCStudy, RSIStudy, SciFinanceChartPanel, SMAStudy, StudyList, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//         <div id="studies" style="width: 320px; overflow-y: auto"></div>
//     </div>
// </div>
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    const rsi = new RSIStudy();
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 50 }), rsi],
    });
    const chart = financeChartPanel.financeApi;
    // StudyList: a card per study on the chart. Click a card to open that study's settings form
    // (one at a time); × removes the study. The list follows studiesChanged, so studies added
    // or removed elsewhere, like by the buttons below, appear and disappear
    const studyList = StudyList.create(document.getElementById("studies"), {
        chart,
        title: "Indicators",
        emptyMessage: "No indicators on the chart.", // shown when the chart has no studies
    });
    toolbar.append(button("Add MACD", () => chart.attachStudy(new MACDStudy())), button("Add EMA 20", () => chart.attachStudy(new EMAStudy({ length: 20 }))), 
    // Open a study's card from code; expand(null) closes it
    button("Open RSI settings", () => studyList.expand(rsi.id)), button("Close settings", () => studyList.expand(null)));
    // When the page goes away: studyList.destroy(); financeChartPanel.cleanup();
    return { financeChartPanel, studyList };
}
function button(text, onClick) {
    const b = document.createElement("button");
    b.textContent = text;
    b.onclick = onClick;
    Object.assign(b.style, buttonStyle);
    return b;
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle = {
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "6px",
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: "13px",
    cursor: "pointer",
};
createChart();
