import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, RSIStudy, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
export function RsiChart() {
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [
            new OHLCStudy(), // the price series, as candlesticks
            new VolumeStudy(), // volume, along the bottom of the price pane
            // RSI: an oscillator, so it gets a pane of its own below the price pane, scaled 0 to 100.
            // length: candles in the average gain and loss (default 14).
            // overbought / oversold: the levels drawn as dashed lines, with the RSI filled beyond them
            new RSIStudy({
                length: 14,
                overbought: 70,
                oversold: 30,
                renderOptions: { stroke: "#ff9f1c", strokeThickness: 2 }, // the RSI line
            }),
        ],
    }), []);
    // SciFinanceChartView fills its parent, so give the parent a height
    return React.createElement(SciFinanceChartView, { config: config });
}
