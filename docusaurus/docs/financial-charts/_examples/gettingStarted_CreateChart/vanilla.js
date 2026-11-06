import "scichart-scitrader/scitrader.css";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
// 1. Register a data source, once, at app startup.
//    idbPriceStore caches candles in IndexedDB, so a reload only fetches what is new.
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// 2. Create the chart inside an element that has a size, e.g. <div id="chart" style="height: 600px">
async function createChart(elementId) {
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById(elementId), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD", // Coinbase's symbol format
        interval: CandleInterval.ONE_HOUR, // Coinbase offers 1m, 5m, 15m, 1h, 6h and 1d candles
        // OHLCStudy draws the candles; VolumeStudy adds volume columns along the bottom of the price pane
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    // 3. When the element goes away, free the chart's resources with financeChartPanel.cleanup()
    return financeChartPanel;
}
createChart("chart");
