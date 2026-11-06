import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleInterval,
    CandleTypeSelector,
    carryPeriodToInterval,
    defaultExchangeProvider,
    ECandleType,
    idbPriceStore,
    IntervalSelector,
    LiveTipToggle,
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
    interval: CandleInterval.FIVE_MINUTES,
    period: "1D",
    studies: [new OHLCStudy(), new VolumeStudy()],
});
const chart = financeChartPanel.financeApi; // SciFinanceChart

// Each control is created with create(container, options), calls onChange when the user picks,
// and takes new options through update(options).
const intervals = IntervalSelector.create(toolbar, {
    value: CandleInterval.FIVE_MINUTES,
    intervals: [
        CandleInterval.ONE_MINUTE,
        CandleInterval.FIVE_MINUTES,
        CandleInterval.FIFTEEN_MINUTES,
        CandleInterval.ONE_HOUR,
        CandleInterval.FOUR_HOURS,
        CandleInterval.ONE_DAY,
    ],
    onChange: async (interval) => {
        // Keep about the same span on screen, adjusted to suit the new interval: one day of
        // 1-day candles would be a single candle, so that steps up to a longer period
        const period = carryPeriodToInterval(periods.value, interval);
        periods.update({ currentInterval: interval, value: period });
        await chart.changeInterval(interval, period);
    },
});

const periods = PeriodSelector.create(toolbar, {
    value: "1D",
    currentInterval: CandleInterval.FIVE_MINUTES, // disables periods that don't suit the interval
    onChange: (period) => chart.setPeriod(period), // null is "Free": leave the view where the user put it
});

const candleTypes = CandleTypeSelector.create(toolbar, {
    value: ECandleType.Candlestick,
    onChange: (type) => chart.setCandleType(type),
});

const liveTip = LiveTipToggle.create(toolbar, {
    value: chart.liveTipMode,
    // Follow: the view slides right with each new candle. Anchored: it stays put.
    onChange: (mode) => (chart.liveTipMode = mode),
});

// When the page goes away. Controls attach listeners (the candle-type menu to the document),
// so destroy them as well as the chart:
// [intervals, periods, candleTypes, liveTip].forEach((control) => control.destroy());
// financeChartPanel.cleanup();
