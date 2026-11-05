import "scichart-scitrader/scitrader.css";
import { ATRStudy, CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
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
        period: "6M",
        studies: [
            new OHLCStudy(), // the price series, as candlesticks
            new VolumeStudy(), // volume, along the bottom of the price pane
            // ATR: an oscillator, so it gets a pane of its own below the price pane.
            // It is in price units: an ATR of 80 on ETH-USD means a typical daily range of about $80.
            // length: the smoothing length (default 14)
            new ATRStudy({ length: 14, renderOptions: { stroke: "#ff9f1c", strokeThickness: 2 } }),
        ],
    });
    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}
createChart();
