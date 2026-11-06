import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeProfileStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

export function VolumeProfileChart() {
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            studies: [
                new OHLCStudy(), // the price series, as candlesticks
                new VolumeStudy(), // volume, along the bottom of the price pane
                // Volume Profile: volume traded at each price, drawn as sideways bars on the price pane.
                // binCount: the number of price buckets (default 40).
                // rangeMode: "visible" recalculates as you pan and zoom; "all" uses every loaded candle.
                // showPointOfControl: a line at the price bucket with the most volume
                new VolumeProfileStudy({
                    binCount: 40,
                    rangeMode: "visible",
                    side: "right", // the edge of the pane the bars grow from
                    widthFraction: 0.25, // the longest bar spans a quarter of the pane
                    showPointOfControl: true,
                }),
            ],
        }),
        []
    );

    // SciFinanceChartView fills its parent, so give the parent a height
    return <SciFinanceChartView config={config} />;
}
