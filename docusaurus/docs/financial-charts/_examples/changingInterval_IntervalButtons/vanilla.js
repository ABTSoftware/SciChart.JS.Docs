import "scichart-scitrader/scitrader.css";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, defaultPeriodForInterval, idbPriceStore, OHLCStudy, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    let currentInterval = CandleInterval.ONE_HOUR;
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: currentInterval,
        // Start on the same period changeInterval would land on: a week, for 1h candles
        period: defaultPeriodForInterval(currentInterval),
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi; // SciFinanceChart
    // Ask the exchange which intervals it supports, so every button works.
    // Coinbase supports 1m, 5m, 15m, 1h, 6h and 1d
    const intervals = defaultExchangeProvider.getExchange(CoinbaseExchange.name).getSupportedIntervals();
    // One button per supported interval
    const buttons = intervals.map((interval) => {
        const button = document.createElement("button");
        button.textContent = interval; // CandleInterval values are short labels: "1m", "1h", "1d", ...
        // Tell the user which period the chart will land on
        button.title = `Shows ${defaultPeriodForInterval(interval)} of ${interval} candles`;
        button.onclick = () => {
            currentInterval = interval;
            // No period given, so the chart lands on defaultPeriodForInterval(interval)
            chart.changeInterval(interval);
        };
        toolbar.appendChild(button);
        return button;
    });
    // Shows the interval and period on screen
    const status = document.createElement("span");
    Object.assign(status.style, statusStyle);
    toolbar.appendChild(status);
    const updateToolbar = (loading) => {
        buttons.forEach((button, i) => {
            Object.assign(button.style, buttonStyle(intervals[i] === currentInterval));
            button.disabled = loading;
        });
        status.textContent = loading ? "Loading…" : `Interval ${currentInterval}, period ${chart.currentPeriod}`;
    };
    updateToolbar(false);
    // dataLoadStarted: raised when an interval change starts loading. Disable the buttons meanwhile
    chart.dataLoadStarted.subscribe(() => updateToolbar(true));
    // dataRenderComplete: raised when the new candles are drawn. args.type is "interval-change" here
    chart.dataRenderComplete.subscribe((args) => {
        if (args.type === "interval-change") {
            updateToolbar(false);
        }
    });
    return financeChartPanel; // call financeChartPanel.cleanup() when the page goes away
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
const buttonStyle = (active) => ({
    padding: "6px 14px",
    fontSize: "14px",
    fontFamily: "var(--st-font-family, sans-serif)",
    color: "var(--st-ui-text, #ffffff)",
    background: active ? "var(--st-ui-accent, #7464ff)" : "var(--st-ui-surface, #373447)",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "4px",
    cursor: "pointer",
});
const statusStyle = {
    marginLeft: "8px",
    fontSize: "14px",
    fontFamily: "var(--st-font-family, sans-serif)",
    color: "var(--st-ui-text-muted, #9da2bc)",
};
createChart();
