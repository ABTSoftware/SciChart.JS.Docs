import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, EMAStudy, idbPriceStore, OHLCStudy, SMAStudy, VolumeStudy, WMAStudy, } from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
export function MovingAveragesChart() {
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
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
    }), []);
    // SciFinanceChartView fills its parent, so give the parent a height
    return React.createElement(SciFinanceChartView, { config: config });
}
