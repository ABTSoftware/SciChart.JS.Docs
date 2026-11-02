import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

export function CandlestickChart() {
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "BTCUSDT",
            interval: CandleInterval.FOUR_HOURS,
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
