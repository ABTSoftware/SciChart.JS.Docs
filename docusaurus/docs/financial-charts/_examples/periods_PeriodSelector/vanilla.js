import "scichart-scitrader/scitrader.css";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, PeriodSelector, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
const INTERVAL = CandleInterval.SIX_HOURS;
// The periods to offer. At 6h candles "1D" is only four candles, so the PeriodSelector disables it
const PERIODS = ["1D", "5D", "1W", "1M", "3M", "6M", "YTD", "1Y"];
async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: INTERVAL,
        period: "1M", // the first period: the last month
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi; // SciFinanceChart
    // The SDK's PeriodSelector: a row of period buttons, plus "Free" for no period.
    // It only calls onChange; pass the period on to the chart with setPeriod
    const periods = PeriodSelector.create(toolbar, {
        value: chart.currentPeriod, // "1M", from the config
        periods: PERIODS,
        currentInterval: INTERVAL, // disables the periods that don't suit 6h candles
        // period is a TPeriod, or null when the user picks "Free" or clicks the selected period again
        onChange: (period) => chart.setPeriod(period),
    });
    // When the page goes away: periods.destroy(); financeChartPanel.cleanup();
    return { financeChartPanel, periods };
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    alignItems: "center",
    padding: "8px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
createChart();
