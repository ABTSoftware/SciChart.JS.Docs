import "scichart-scitrader/scitrader.css";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>
// Register Coinbase once, at app startup, with a candle store: idbPriceStore keeps downloaded
// candles in IndexedDB, so a reload or a return visit draws from the cache
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
const SYMBOLS = ["BTC-USD", "ETH-USD", "SOL-USD"]; // Coinbase's symbol format: BASE-QUOTE
async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // "Coinbase": the name it was registered under
        symbol: "BTC-USD",
        interval: CandleInterval.ONE_HOUR,
        period: "1W",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi;
    // The intervals Coinbase serves: 1m, 5m, 15m, 1h, 6h and 1d
    const intervals = CoinbaseExchange.getSupportedIntervals();
    // The registered exchange's client also gives live data: here a ticker, the latest price and
    // the 24-hour change, for the chart's symbol
    const price = document.createElement("span");
    const client = defaultExchangeProvider.getExchange(CoinbaseExchange.name);
    let ticker = client.getTickerStream("BTC-USD").subscribe(showTicker);
    function showTicker(t) {
        price.textContent = `${t.symbol} ${t.curDayClose.toLocaleString()} (${t.priceChangePercent.toFixed(2)}% 24h)`;
    }
    toolbar.append(buttonGroup(SYMBOLS, (s) => s, "BTC-USD", (symbol) => {
        chart.setSymbol(symbol); // reload the chart's candles for the new symbol
        ticker.unsubscribe();
        ticker = client.getTickerStream(symbol).subscribe(showTicker);
    }), buttonGroup(intervals, (i) => i, CandleInterval.ONE_HOUR, (interval) => chart.changeInterval(interval)), price);
    // When the page goes away: ticker.unsubscribe(); financeChartPanel.cleanup();
    return financeChartPanel;
}
// A row of toggle buttons: one per value, the selected one highlighted
function buttonGroup(values, label, selected, onSelect) {
    const group = document.createElement("div");
    Object.assign(group.style, { display: "flex", gap: "4px" });
    const render = (current) => group.replaceChildren(...values.map((value) => {
        const b = document.createElement("button");
        b.textContent = label(value);
        Object.assign(b.style, buttonStyle(value === current));
        b.onclick = () => {
            render(value);
            onSelect(value);
        };
        return b;
    }));
    render(selected);
    return group;
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px 16px",
    padding: "8px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: "13px",
};
const buttonStyle = (active = false) => ({
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "6px",
    background: active ? "var(--st-ui-selection, #6c63ff)" : "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: "13px",
    cursor: "pointer",
});
createChart();
