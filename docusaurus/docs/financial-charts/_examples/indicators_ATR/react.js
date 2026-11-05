import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { ATRStudy, CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
export function AtrChart() {
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
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
    }), []);
    // SciFinanceChartView fills its parent, so give the parent a height
    return React.createElement(SciFinanceChartView, { config: config });
}
