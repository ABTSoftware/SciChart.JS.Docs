import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, observeCandleCounts, OHLCStudy, PaneId, VolumeStudy, } from "scichart-scitrader";
import { CandleCounter, SciFinanceChartView } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
export function CandleCounterChart() {
    // The chart's API, once it has initialised: CandleCounter needs its financeApi
    const [chart, setChart] = React.useState();
    const [counts, setCounts] = React.useState();
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "1M",
        studies: [new OHLCStudy(), new VolumeStudy()],
    }), []);
    // The same numbers in your own element, with observeCandleCounts. It returns a function that
    // stops it, which is the effect's cleanup
    React.useEffect(() => (chart ? observeCandleCounts(chart.financeApi, setCounts) : undefined), [chart]);
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            "On screen: ",
            counts?.visible ?? "?",
            " \u00B7 Loaded: ",
            counts?.loaded ?? "?",
            " \u00B7 Since listing: ~",
            counts?.total ?? "?"),
        React.createElement("div", { style: { flex: 1, minHeight: 0 } },
            React.createElement(SciFinanceChartView, { config: config, onInit: setChart, 
                // paneInfo is called for every chart pane, with the pane's id. Whatever it returns
                // is rendered in that pane's control bar; null leaves the area empty.
                // Here: a CandleCounter in the price pane (PaneId.DEFAULT.value, "default") only
                paneInfo: (paneId) => paneId === PaneId.DEFAULT.value && chart ? React.createElement(CandleCounter, { chart: chart.financeApi }) : null }))));
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    padding: "10px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text, #ffffff)",
    fontFamily: "var(--st-font-family, sans-serif)",
    fontSize: 14,
};
