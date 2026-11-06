import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelConfig,
    MACDStudy,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

export function MacdChart() {
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
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
        }),
        []
    );

    // SciFinanceChartView fills its parent, so give the parent a height
    return <SciFinanceChartView config={config} />;
}
