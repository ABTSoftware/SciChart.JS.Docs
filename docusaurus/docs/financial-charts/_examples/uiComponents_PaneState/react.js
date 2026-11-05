import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, idbPriceStore, MACDStudy, OHLCStudy, PaneId, RSIStudy, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// 1. Give each indicator pane an id, so you can size it and find it later. Keep these PaneId
// objects: the chart looks panes up by the object, not by its value
const RSI_PANE = new PaneId("rsi");
const MACD_PANE = new PaneId("macd");
const PANES = [
    { id: PaneId.DEFAULT, label: "Price" }, // the price pane
    { id: RSI_PANE, label: "RSI" },
    { id: MACD_PANE, label: "MACD" },
];
export function PaneStateChart() {
    const [api, setApi] = React.useState();
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [
            new OHLCStudy(),
            new VolumeStudy(),
            new RSIStudy({ paneId: RSI_PANE }),
            new MACDStudy({ paneId: MACD_PANE }),
        ],
        // 2. The pane sizes, by pane id: `grow` shares the free space (default 1), `size` is fixed pixels
        paneSizing: {
            [PaneId.DEFAULT.value]: { grow: 3 }, // the price pane takes 3 shares
            [RSI_PANE.value]: { size: 110 }, // the RSI pane is 110 px high
            [MACD_PANE.value]: { grow: 1 }, // the MACD pane takes 1 share
        },
    }), []);
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        api ? React.createElement(PaneToolbar, { api: api }) : React.createElement("div", { style: toolbarStyle }, "Loading\u2026"),
        React.createElement("div", { style: { flex: 1, minHeight: 0 } },
            React.createElement(SciFinanceChartView, { config: config, onInit: setApi }))));
}
// 3. Read and set pane state in code. The pane control bars (hover a pane) change the same state,
// so the toolbar re-renders on every change
function PaneToolbar({ api }) {
    const group = api.paneGroupApi; // pane layout state, by pane id (a string)
    const chart = api.financeApi;
    const [, setRevision] = React.useState(0);
    React.useEffect(() => {
        const rerender = () => setRevision((r) => r + 1);
        group.stateChanged.subscribe(rerender); // order, size, hidden, maximised, closed
        const autoRanges = PANES.map(({ id }) => chart.getYAxisAutoRangeController(id)).filter(Boolean);
        autoRanges.forEach((controller) => controller.yAxisAutoRangeChanged.subscribe(rerender));
        return () => {
            group.stateChanged.unsubscribe(rerender);
            autoRanges.forEach((controller) => controller.yAxisAutoRangeChanged.unsubscribe(rerender));
        };
    }, [group, chart]);
    // setPaneSizes takes a size for every pane, and scales them to fill the chart: the sizes act as
    // proportions. lockPaneSize fixes one pane at an exact size in pixels, until unlockPaneSize
    const paneIds = group.getAllPanes().map((pane) => pane.id);
    const proportions = (price, indicator) => group.setPaneSizes(paneIds.map((id) => ({ id, size: id === PaneId.DEFAULT.value ? price : indicator })));
    const hasRsi = !!group.getPane(RSI_PANE.value);
    const rsiLocked = hasRsi && group.isSizeLocked(RSI_PANE.value);
    return (React.createElement("div", { style: toolbarStyle },
        PANES.filter(({ id }) => group.getPane(id.value)).map(({ id, label }) => {
            // Y-axis autorange: on, the pane's Y axis fits the visible candles; off, it stays as the user set it
            const autoRange = chart.getYAxisAutoRangeController(id);
            const isMaximised = group.getExpandedId() === id.value;
            const isVisible = group.isVisible(id.value);
            return (React.createElement(Row, { key: id.value, label: `${label}${isVisible ? "" : " (hidden)"}` },
                React.createElement(Button, { text: `Autorange ${autoRange?.isYAxisAutoRangeEnabled ? "on" : "off"}`, onClick: () => (autoRange.isYAxisAutoRangeEnabled = !autoRange.isYAxisAutoRangeEnabled) }),
                React.createElement(Button, { text: isMaximised ? "Restore" : "Maximise", onClick: () => group.setExpanded(isMaximised ? null : id.value) }),
                React.createElement(Button, { text: isVisible ? "Hide" : "Show", onClick: () => group.setVisible(id.value, !isVisible) }),
                id !== PaneId.DEFAULT && React.createElement(Button, { text: "Close", onClick: () => group.removePane(id.value) })));
        }),
        React.createElement(Row, { label: "Sizes" },
            React.createElement(Button, { text: "All equal", onClick: () => proportions(1, 1) }),
            React.createElement(Button, { text: "Price 4 : 1", onClick: () => proportions(4, 1) }),
            hasRsi && (React.createElement(Button, { text: rsiLocked ? "Unlock RSI" : "Lock RSI at 80 px", onClick: () => rsiLocked ? group.unlockPaneSize(RSI_PANE.value) : group.lockPaneSize(RSI_PANE.value, 80) })))));
}
// A labelled row of buttons
function Row({ label, children }) {
    return (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } },
        React.createElement("span", { style: { width: 110, color: "var(--st-ui-text-muted, #9da2bc)" } }, label),
        children));
}
function Button({ text, onClick }) {
    return (React.createElement("button", { style: buttonStyle, onClick: onClick }, text));
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    fontSize: 13,
};
const buttonStyle = {
    padding: "3px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.15))",
    borderRadius: 4,
    background: "var(--st-ui-surface, #363345)",
    color: "var(--st-ui-text, #e8e8ee)",
    font: "inherit",
    cursor: "pointer",
};
