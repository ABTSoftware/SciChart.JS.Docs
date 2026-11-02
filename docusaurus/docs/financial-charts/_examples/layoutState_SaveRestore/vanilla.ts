import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    EStudyType,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelState,
    MACDStudy,
    OHLCStudy,
    SciFinanceChartPanel,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// <button id="add-rsi">Add RSI</button> <button id="save">Save</button> <button id="restore">Restore</button>
// <div id="chart" style="height: 600px"></div>
const container = document.getElementById("chart");
const STORAGE_KEY = "my-app:chart";

let financeChartPanel: ISciFinanceChartPanelApi = await SciFinanceChartPanel.create(container, {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.FOUR_HOURS,
    period: "1M",
    studies: [new OHLCStudy(), new VolumeStudy(), new MACDStudy()],
});

// Change the chart (add a study, edit one, resize panes, draw on it), then save it
document.getElementById("add-rsi").onclick = () =>
    financeChartPanel.financeApi.attachStudy(studyProvider.getStudy(EStudyType.RSI));

// Save: toJSON() returns plain JSON, with the exchange, symbol and interval, every study and its
// settings, the pane layout, and the drawings. Store it anywhere: localStorage, a file, your server.
document.getElementById("save").onclick = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(financeChartPanel.toJSON()));
};

// Restore: tear the chart down, and rebuild it from the saved JSON. fromJSON recreates the studies,
// panes and data feed, then loads fresh data.
document.getElementById("restore").onclick = async () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const state: ISciFinanceChartPanelState = JSON.parse(saved);
    financeChartPanel.cleanup();
    financeChartPanel = await SciFinanceChartPanel.fromJSON(container, state, { useSubCharts: state.useSubCharts });
};
