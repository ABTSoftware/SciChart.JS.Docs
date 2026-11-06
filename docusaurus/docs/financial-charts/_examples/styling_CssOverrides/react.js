import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, OHLCStudy, OnChartButtonsModifier, RSIStudy, VolumeStudy, } from "scichart-scitrader";
import { DrawingToolbar, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// CSS overrides for the SDK's controls. In an app, these rules go in your own stylesheet, loaded
// after scitrader.css. Each skin is scoped under a class on an element around the chart, which keeps
// it to this chart and makes each rule more specific than the scitrader.css rule it replaces
const SKINS = [
    { name: "Default", css: "/* No overrides: scitrader.css alone */" },
    {
        name: "Rounded",
        css: `
/* Round drawing tools */
.skin .st-drawing-toolbar__button { border-radius: 50%; }

/* Pill-shaped zoom buttons and pane control bars */
.skin .st-on-chart-buttons,
.skin .st-pane-control-bar { border-radius: 999px; padding-left: 8px; padding-right: 8px; }
.skin .st-pane-control-bar__button,
.skin .st-on-chart-buttons__button { border-radius: 50%; }`,
    },
    {
        name: "Square and flat",
        css: `
/* Square corners, and no borders on idle buttons */
.skin .st-drawing-toolbar__button,
.skin .st-on-chart-buttons,
.skin .st-on-chart-buttons__button,
.skin .st-pane-control-bar,
.skin .st-pane-control-bar__button { border-radius: 0; }
.skin .st-drawing-toolbar__button:not([aria-pressed="true"]) { border-color: transparent; }`,
    },
    {
        name: "Theme variables",
        css: `
/* Change the theme's colours for these controls only, through its CSS variables.
   The drawing toolbar is outside the chart, so it reads them from any parent: */
.skin {
    --st-ui-menu-background: #1f1a12;
    --st-ui-selection: #f59e0b;
}

/* The chart writes the theme's variables on its own container, which wins over a parent.
   To reach controls inside the chart, set the variables on them: */
.skin .st-pane-control-bar,
.skin .st-on-chart-buttons {
    --st-ui-toolbar-background: #1f1a12;
    --st-ui-toolbar-active: #f59e0b;
    --st-ui-icon: #f59e0b;
}`,
    },
];
export function CssOverridesChart() {
    const [skin, setSkin] = React.useState(SKINS[0]);
    const [api, setApi] = React.useState();
    const { controller } = useDrawingTools(api); // the drawing tools rail
    // The zoom and pan buttons on every pane, shown all the time so their style is easy to see
    React.useEffect(() => {
        if (!api)
            return undefined;
        const chart = api.financeApi;
        const withButtons = new Set();
        const addButtons = () => chart.chartPanes.forEach(({ surface }) => {
            if (surface && !withButtons.has(surface)) {
                withButtons.add(surface);
                surface.chartModifiers.add(new OnChartButtonsModifier({ visible: true }));
            }
        });
        addButtons();
        chart.paneConfigured.subscribe(addButtons); // panes added later, e.g. by a new study
        return () => chart.paneConfigured.unsubscribe(addButtons);
    }, [api]);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
    }), []);
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("style", null, skin.css),
        React.createElement("div", { style: barStyle }, SKINS.map((s) => (React.createElement("button", { key: s.name, style: buttonStyle(s === skin), onClick: () => setSkin(s) }, s.name)))),
        React.createElement("div", { className: "skin", style: { display: "flex", flex: 1, minHeight: 0 } },
            React.createElement(DrawingToolbar, { controller: controller, orientation: "vertical" }),
            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement(SciFinanceChartView, { config: config, onInit: setApi })))));
}
// The skin buttons use the theme's CSS variables, with the dark theme's values as fallbacks
const barStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    padding: "8px 12px",
    background: "var(--st-ui-toolbar-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle = (selected) => ({
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.15))",
    borderRadius: 4,
    background: selected ? "var(--st-ui-accent, #5c5cff)" : "var(--st-ui-button-background, #363345)",
    color: "var(--st-ui-text, #e8e8ee)",
    font: "13px sans-serif",
    cursor: "pointer",
});
