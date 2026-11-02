import "scichart-scitrader/scitrader.css";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

// 1. Register a data source, once, at app startup.
//    idbPriceStore caches candles in IndexedDB, so a reload only fetches what is new.
defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

// 2. Create the chart inside an element that has a size, e.g. <div id="chart" style="height: 600px">
const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
    exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
    symbol: "BTCUSDT",
    interval: CandleInterval.FOUR_HOURS,
    // OHLCStudy draws the candles; VolumeStudy adds volume columns along the bottom of the price pane
    studies: [new OHLCStudy(), new VolumeStudy()],
});

// 3. When the element goes away, free the chart's resources
// financeChartPanel.cleanup();
