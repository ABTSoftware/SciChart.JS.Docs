import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { ADXStudy, CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
export function AdxChart() {
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
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
    }), []);
    // SciFinanceChartView fills its parent, so give the parent a height
    return React.createElement(SciFinanceChartView, { config: config });
}
