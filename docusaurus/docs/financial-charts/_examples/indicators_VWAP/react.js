import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, VolumeStudy, VWAPStudy, } from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
export function VwapChart() {
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.FIVE_MINUTES,
        period: "1D",
        studies: [
            new OHLCStudy(), // the price series, as candlesticks
            new VolumeStudy(), // volume, along the bottom of the price pane
            // VWAP: an overlay, so it draws on the price pane, against the price axis.
            // It has no length: it averages every loaded candle, weighted by volume, starting from the first
            new VWAPStudy({ renderOptions: { stroke: "#ff9f1c", strokeThickness: 2 } }),
        ],
    }), []);
    // SciFinanceChartView fills its parent, so give the parent a height
    return React.createElement(SciFinanceChartView, { config: config });
}
