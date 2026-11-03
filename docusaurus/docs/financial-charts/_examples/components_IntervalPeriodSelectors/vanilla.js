import "scichart-scitrader/scitrader.css";
import { CandleInterval, carryPeriodToInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, IntervalSelector, OHLCStudy, PeriodSelector, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// The intervals to offer: the ones Coinbase supports
const INTERVALS = [
    CandleInterval.FIVE_MINUTES,
    CandleInterval.FIFTEEN_MINUTES,
    CandleInterval.ONE_HOUR,
    CandleInterval.SIX_HOURS,
    CandleInterval.ONE_DAY,
];
async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.ONE_HOUR,
        period: "1M", // the last month
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi; // SciFinanceChart
    // IntervalSelector: a row of interval buttons. It calls onChange with the picked interval,
    // and you pass it on to the chart with changeInterval
    const intervals = IntervalSelector.create(toolbar, {
        value: CandleInterval.ONE_HOUR,
        intervals: INTERVALS,
        onChange: (interval) => {
            // Keep about the same span on screen, adjusted to suit the new interval
            const period = carryPeriodToInterval(periods.value, interval);
            // Tell the PeriodSelector, so it shows that period and disables the ones that don't suit
            periods.update({ value: period, currentInterval: interval });
            chart.changeInterval(interval, period);
        },
    });
    // PeriodSelector: "Free" plus a row of period buttons. It calls onChange with the picked
    // period, or null for "Free", and you pass it on to the chart with setPeriod
    const periods = PeriodSelector.create(toolbar, {
        value: "1M",
        currentInterval: CandleInterval.ONE_HOUR, // disables the periods that don't suit 1h candles
        onChange: (period) => chart.setPeriod(period),
    });
    // When the page goes away: intervals.destroy(); periods.destroy(); financeChartPanel.cleanup();
    return { financeChartPanel, intervals, periods };
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
createChart();
