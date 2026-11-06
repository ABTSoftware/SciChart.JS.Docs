import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, ECandleType, idbPriceStore, OHLCStudy, PointAndFigureStudy, RenkoStudy, } from "scichart-scitrader";
import { CandleTypeSelector, SciFinanceChartView } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
export function PriceChartTypes() {
    const chartRef = React.useRef(null);
    // The selector is a controlled component: its value lives in React state
    const [candleType, setCandleType] = React.useState(ECandleType.HeikinAshi);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "ETH-USD",
        interval: CandleInterval.ONE_DAY,
        period: "1Y",
        // candleType on OHLCStudy sets the price series' starting style
        studies: [new OHLCStudy({ candleType: ECandleType.HeikinAshi }), new RenkoStudy()],
    }), []);
    // Renko and Point & Figure aren't candle types but studies: they plot price moves, not time,
    // so each draws in a pane of its own, on a category (index) axis.
    // Leave brickSize / boxSize unset to size them from the price range
    const showPane = (create) => {
        const chart = chartRef.current;
        if (!chart?.isInitialized)
            return; // financeApi throws until the chart has initialised
        const finance = chart.financeApi;
        finance.studies.filter((s) => s instanceof RenkoStudy || s instanceof PointAndFigureStudy).forEach((s) => finance.detachStudy(s));
        if (create)
            finance.attachStudy(create());
    };
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement(CandleTypeSelector, { value: candleType, onChange: (type) => {
                    setCandleType(type);
                    if (chartRef.current?.isInitialized)
                        chartRef.current.financeApi.setCandleType(type);
                } }),
            React.createElement("button", { style: buttonStyle, onClick: () => showPane(() => new RenkoStudy({ reversalAmount: 2 })) }, "Renko"),
            React.createElement("button", { style: buttonStyle, onClick: () => showPane(() => new PointAndFigureStudy({ reversalAmount: 3 })) }, "Point & Figure"),
            React.createElement("button", { style: buttonStyle, onClick: () => showPane() }, "Neither")),
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
const buttonStyle = {
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
};
