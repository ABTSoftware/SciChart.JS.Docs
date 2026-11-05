import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    StochasticStudy,
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
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [
            new OHLCStudy(), // the price series, as candlesticks
            new VolumeStudy(), // volume, along the bottom of the price pane
        // Stochastic Oscillator: an oscillator, so it gets a pane of its own, scaled 0 to 100.
        // length: candles in the high-low range %K is measured against (default 14).
        // signalPeriod: the length of %D, the moving average of %K (default 3)
        new StochasticStudy({
            length: 14,
            signalPeriod: 3,
            strokeK: "#2ec4b6", // %K
            strokeD: "#ff9f1c", // %D
            strokeThickness: 2,
        }),
        ],
    });

    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}

createChart();
