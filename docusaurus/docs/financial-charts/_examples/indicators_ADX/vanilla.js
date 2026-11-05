import "scichart-scitrader/scitrader.css";
import { ADXStudy, CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
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
            // ADX: an oscillator, so it gets a pane of its own below the price pane.
            // It draws three lines: ADX (trend strength), +DI and -DI (direction).
            // length: the smoothing length of all three (default 14)
            new ADXStudy({
                length: 14,
                adxColor: "#ff9f1c", // ADX
                pdiColor: "#26a69a", // +DI
                mdiColor: "#ef5350", // -DI
                strokeThickness: 2,
            }),
        ],
    });
    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}
createChart();
