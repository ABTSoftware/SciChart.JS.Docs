import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, ECandleType, idbPriceStore, OHLCStudy, VolumeStudy, } from "scichart-scitrader";
import { CandleTypeSelector, SciFinanceChartView } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
export function CandleTypeChart() {
    const chartRef = React.useRef(null);
    // The selector is a controlled component: its value lives in React state
    const [candleType, setCandleType] = React.useState(ECandleType.Candlestick);
    // Read once, when the chart is created
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy()], // OHLCStudy draws the price series
    }), []);
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement(CandleTypeSelector, { value: candleType, onChange: (type) => {
                    setCandleType(type);
                    // financeApi throws until the chart has initialised
                    if (chartRef.current?.isInitialized) {
                        chartRef.current.financeApi.setCandleType(type);
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
