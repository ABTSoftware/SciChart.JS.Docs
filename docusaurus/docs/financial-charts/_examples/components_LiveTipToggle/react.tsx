import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    TLiveTipMode,
    VolumeStudy,
} from "scichart-scitrader";
import { LiveTipToggle, SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

export function LiveTipChart() {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    // The toggle is a controlled component: its value lives in React state
    const [mode, setMode] = React.useState<TLiveTipMode>("follow");

    // One-minute candles over the last hour, so a new live candle arrives every minute
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.ONE_MINUTE,
            period: "1H",
            liveTipMode: "follow",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                <LiveTipToggle
                    value={mode}
                    onChange={(next) => {
                        setMode(next);
                        // financeApi throws until the chart has initialised
                        if (chartRef.current?.isInitialized) {
                            chartRef.current.financeApi.liveTipMode = next;
                        }
                    }}
                />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <SciFinanceChartView ref={chartRef} config={config} />
            </div>
        </div>
    );
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
