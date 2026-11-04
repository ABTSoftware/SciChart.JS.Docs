import "scichart-scitrader/scitrader.css";
import { BollingerBandsStudy, CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
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
            // Bollinger Bands: an overlay, so it draws on the price pane, against the price axis.
            // period: candles in the moving average and standard deviation (default 20).
            // stdDev: how many standard deviations the bands sit from the middle band (default 2)
            new BollingerBandsStudy({
                period: 20,
                stdDev: 2,
                middleBandOptions: { stroke: "#ff9f1c", strokeThickness: 1 }, // the 20-candle SMA
            }),
        ],
    });
    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}
createChart();
