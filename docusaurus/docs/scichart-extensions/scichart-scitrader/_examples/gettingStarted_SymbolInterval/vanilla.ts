import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleInterval,
    carryPeriodToInterval,
    defaultExchangeProvider,
    idbPriceStore,
    IntervalSelector,
    OHLCStudy,
    PeriodSelector,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// <div id="toolbar"></div>
// <div id="chart" style="height: 600px"></div>
const toolbar = document.getElementById("toolbar");

const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.FOUR_HOURS,
    period: "1M", // show the last month
    studies: [new OHLCStudy(), new VolumeStudy()],
});
const chart = financeChartPanel.financeApi; // SciFinanceChart

// Symbol: plain buttons. setSymbol keeps the exchange, interval, period and studies
for (const symbol of ["BTCUSDT", "ETHUSDT", "SOLUSDT"]) {
    const button = document.createElement("button");
    button.textContent = symbol;
    button.onclick = () => chart.setSymbol(symbol);
    toolbar.appendChild(button);
}

// Interval: the SDK's IntervalSelector
const intervals = IntervalSelector.create(toolbar, {
    value: CandleInterval.FOUR_HOURS,
    intervals: [CandleInterval.ONE_HOUR, CandleInterval.FOUR_HOURS, CandleInterval.ONE_DAY, CandleInterval.ONE_WEEK],
    onChange: (interval) => {
        // Keep about the same span on screen, adjusted to suit the new interval
        const period = carryPeriodToInterval(periods.value, interval);
        periods.update({ value: period, currentInterval: interval });
        chart.changeInterval(interval, period);
    },
});

// Period: the SDK's PeriodSelector. "Free", or clicking the selected period again, gives null
const periods = PeriodSelector.create(toolbar, {
    value: "1M",
    currentInterval: CandleInterval.FOUR_HOURS, // greys out periods that don't suit the interval
    onChange: (period) => chart.setPeriod(period),
});

// When the page goes away:
// intervals.destroy(); periods.destroy(); financeChartPanel.cleanup();
