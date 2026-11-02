import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    MACDStudy,
    OHLCStudy,
    RSIStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

export function TradingChart() {
    // The same ISciFinanceChartPanelApi that SciFinanceChartPanel.create returns
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    const [ready, setReady] = React.useState(false);

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "ETHUSDT",
            interval: CandleInterval.ONE_DAY,
            period: "1Y",
            studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
        }),
        []
    );

    // financeApi throws until the chart has initialised, so only use it after onInit
    const addMacd = () => {
        if (chartRef.current?.isInitialized) {
            chartRef.current.financeApi.attachStudy(new MACDStudy());
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
            <div>
                <button disabled={!ready} onClick={addMacd}>
                    Add MACD
                </button>
            </div>
            <div style={{ flex: 1 }}>
                <SciFinanceChartView ref={chartRef} config={config} onInit={() => setReady(true)} />
            </div>
        </div>
    );
}
