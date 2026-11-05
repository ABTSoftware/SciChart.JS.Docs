import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    IchimokuCloudStudy,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div id="chart" style="height: 100%"></div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

async function createChart() {
    // A financial chart is a SciFinanceChartPanel. Its indicators are studies, passed in `studies`
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "ETH-USD",
        interval: CandleInterval.ONE_DAY,
        period: "1Y",
        studies: [
            new OHLCStudy(), // the price series, as candlesticks
            new VolumeStudy(), // volume, along the bottom of the price pane
        // Ichimoku Cloud: an overlay of five lines and a cloud, on the price pane.
        // conversionPeriod / basePeriod / spanPeriod: the Tenkan-sen, Kijun-sen and Senkou Span B
        // lookbacks (defaults 9, 26 and 52). displacement: how far the cloud is shifted forward,
        // and the Chikou Span back (default 26)
        new IchimokuCloudStudy({
            conversionPeriod: 9,
            basePeriod: 26,
            spanPeriod: 52,
            displacement: 26,
        }),
        ],
    });

    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}

createChart();
