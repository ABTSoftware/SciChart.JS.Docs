import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, EMAStudy, idbPriceStore, MACDStudy, OHLCStudy, RSIStudy, SMAStudy, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView, StudyList } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
export function StudyListChart() {
    // The chart's finance API, once it has initialised. StudyList needs it
    const [chart, setChart] = React.useState(null);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy(), new SMAStudy({ length: 50 }), new RSIStudy()],
    }), []);
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement("button", { style: buttonStyle, disabled: !chart, onClick: () => chart.attachStudy(new MACDStudy()) }, "Add MACD"),
            React.createElement("button", { style: buttonStyle, disabled: !chart, onClick: () => chart.attachStudy(new EMAStudy({ length: 20 })) }, "Add EMA 20")),
        React.createElement("div", { style: { display: "flex", flex: 1, minHeight: 0 } },
            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement(SciFinanceChartView, { config: config, onInit: (api) => setChart(api.financeApi) })),
            chart && (React.createElement(StudyList, { chart: chart, title: "Indicators", emptyMessage: "No indicators on the chart." // shown when the chart has no studies
                , style: sidePanelStyle })))));
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
const sidePanelStyle = {
    width: 320,
    overflowY: "auto",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
