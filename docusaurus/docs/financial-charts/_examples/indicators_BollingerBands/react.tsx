import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BollingerBandsStudy,
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

export function BollingerBandsChart() {
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
                // Bollinger Bands: an overlay, so it draws on the price pane, against the price axis.
                // period: candles in the moving average and standard deviation (default 20).
                // stdDev: how many standard deviations the bands sit from the middle band (default 2)
                new BollingerBandsStudy({
                    period: 20,
                    stdDev: 2,
                    middleBandOptions: { stroke: "#ff9f1c", strokeThickness: 1 }, // the 20-candle SMA
                }),
            ],
        }),
        []
    );

    // SciFinanceChartView fills its parent, so give the parent a height
    return <SciFinanceChartView config={config} />;
}
