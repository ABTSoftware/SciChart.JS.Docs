import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    BollingerBandsStudy,
    CandleInterval,
    defaultExchangeProvider,
    EMAStudy,
    idbPriceStore,
    ISciFinanceChartPanelConfig,
    MACDStudy,
    OHLCStudy,
    RSIStudy,
    SMAStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

export function IndicatorsChart() {
    // Create the studies inside useMemo: each study object belongs to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "BTCUSDT",
            interval: CandleInterval.ONE_DAY,
            period: "6M",
            studies: [
                new OHLCStudy(),
                new VolumeStudy(),
                // Overlays draw on the price pane
                new SMAStudy({ length: 50 }),
                new EMAStudy({ length: 20, renderOptions: { stroke: "#FFB74D", strokeThickness: 2 } }),
                new BollingerBandsStudy({ period: 20, stdDev: 2 }),
                // Oscillators each get a pane of their own
                new RSIStudy({ length: 14, overbought: 70, oversold: 30 }),
                new MACDStudy({ fast: 12, slow: 26, signal: 9 }),
            ],
        }),
        []
    );

    return (
        <div style={{ height: 800 }}>
            <SciFinanceChartView config={config} />
        </div>
    );
}
