import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

export function CandlestickChart() {
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD", // Coinbase's symbol format
            interval: CandleInterval.ONE_HOUR, // Coinbase offers 1m, 5m, 15m, 1h, 6h and 1d candles
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    // The chart fills its parent, so give the parent a size.
    // The view cleans the chart up when it unmounts.
    return (
        <div style={{ height: 600 }}>
            <SciFinanceChartView config={config} />
        </div>
    );
}
