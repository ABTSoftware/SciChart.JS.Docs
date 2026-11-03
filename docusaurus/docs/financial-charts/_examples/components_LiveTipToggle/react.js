import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, VolumeStudy, } from "scichart-scitrader";
import { LiveTipToggle, SciFinanceChartView } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
export function LiveTipChart() {
    const chartRef = React.useRef(null);
    // The toggle is a controlled component: its value lives in React state
    const [mode, setMode] = React.useState("follow");
    // One-minute candles over the last hour, so a new live candle arrives every minute
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.ONE_MINUTE,
        period: "1H",
        liveTipMode: "follow",
        studies: [new OHLCStudy(), new VolumeStudy()],
    }), []);
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement(LiveTipToggle, { value: mode, onChange: (next) => {
                    setMode(next);
                    // financeApi throws until the chart has initialised
                    if (chartRef.current?.isInitialized) {
                        chartRef.current.financeApi.liveTipMode = next;
                    }
                } })),
        React.createElement("div", { style: { flex: 1, minHeight: 0 } },
            React.createElement(SciFinanceChartView, { ref: chartRef, config: config }))));
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
