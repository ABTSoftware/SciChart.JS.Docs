import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    IchimokuCloudStudy,
    idbPriceStore,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

export function IchimokuCloudChart() {
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "ETH-USD",
            interval: CandleInterval.ONE_DAY,
            period: "1Y",
            studies: [
                new OHLCStudy(), // the price series, as candlesticks
                new VolumeStudy(), // volume, along the bottom of the price pane
                // Ichimoku Cloud: an overlay of five lines and a cloud, on the price pane.
                // conversionPeriod / basePeriod / spanPeriod: the Tenkan-sen, Kijun-sen and Senkou Span B
                // lookbacks (defaults 9, 26 and 52). displacement: how far the cloud is shifted forward,
                // and the Chikou Span back (default 26)
                new IchimokuCloudStudy({
                    conversionPeriod: 9,
                    basePeriod: 26,
                    spanPeriod: 52,
                    displacement: 26,
                }),
            ],
        }),
        []
    );

    // SciFinanceChartView fills its parent, so give the parent a height
    return <SciFinanceChartView config={config} />;
}
