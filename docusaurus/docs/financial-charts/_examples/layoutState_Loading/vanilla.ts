import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleCounter,
    CandleInterval,
    defaultExchangeProvider,
    idbPriceStore,
    IntervalSelector,
    OHLCStudy,
    PaneId,
    PaneProgressEmitter,
    paneProgressDotsLoading,
    RSIStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// <div id="toolbar"></div>
// <div id="chart" style="height: 600px"></div>

// The chart reports each pane's loading phases (surface → configured → data) to this emitter.
// Pass it in `services.progress` so it hears them from the start, before create() resolves.
const progress = new PaneProgressEmitter();

const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.FIVE_MINUTES,
    period: "1D",
    studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
    services: { progress },
    loading: {
        // Progress dots in each pane until its chart is ready, in place of the default skeleton
        ...paneProgressDotsLoading(progress),
        // The shimmer over the panes while a symbol or interval change loads (on by default)
        overlay: true,
    },
});
const chart = financeChartPanel.financeApi; // SciFinanceChart

// Your own content at the start of a pane's control bar (hover the price pane to see it):
// here, the SDK's candle counter, "visible / loaded / ~total"
const counter = CandleCounter.create(financeChartPanel.getPaneInfoElement(PaneId.DEFAULT.value), { chart });

// Changing the interval covers the panes with the shimmer until the new candles are drawn
IntervalSelector.create(document.getElementById("toolbar"), {
    value: CandleInterval.FIVE_MINUTES,
    intervals: [CandleInterval.ONE_MINUTE, CandleInterval.FIVE_MINUTES, CandleInterval.ONE_HOUR],
    onChange: (interval) => chart.changeInterval(interval),
});

// When the page goes away:
// counter.destroy(); financeChartPanel.cleanup();
