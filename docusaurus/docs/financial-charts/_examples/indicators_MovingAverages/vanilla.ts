import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    EMAStudy,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    SMAStudy,
    VolumeStudy,
    WMAStudy,
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
        interval: CandleInterval.ONE_DAY,
        period: "1Y",
        studies: [
            new OHLCStudy(), // the price series, as candlesticks
            new VolumeStudy(), // volume, along the bottom of the price pane
        // Moving averages are overlays: they draw on the price pane, against the price axis.
        // length: the number of candles averaged (default 14). Give each its own colour
        new SMAStudy({ length: 50, renderOptions: { stroke: "#ff9f1c", strokeThickness: 2 } }), // simple: equal weights
        new EMAStudy({ length: 20, renderOptions: { stroke: "#2ec4b6", strokeThickness: 2 } }), // exponential
        new WMAStudy({ length: 10, renderOptions: { stroke: "#e056fd", strokeThickness: 2 } }), // weighted: linear
        ],
    });

    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}

createChart();
