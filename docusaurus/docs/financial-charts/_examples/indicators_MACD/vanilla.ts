import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    MACDStudy,
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
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [
            new OHLCStudy(), // the price series, as candlesticks
            new VolumeStudy(), // volume, along the bottom of the price pane
        // MACD: an oscillator, so it gets a pane of its own below the price pane.
        // fast / slow: the EMA lengths whose difference is the MACD line (defaults 12 and 26).
        // signal: the EMA length of the signal line (default 9).
        // The histogram is MACD minus signal, coloured by which side of zero it is on
        new MACDStudy({
            fast: 12,
            slow: 26,
            signal: 9,
            bandOptions: { stroke: "#2ec4b6", strokeY1: "#ff9f1c", strokeThickness: 2 }, // MACD line, signal line
            histogramAboveZero: "#26a69a",
            histogramBelowZero: "#ef5350",
        }),
        ],
    });

    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}

createChart();
