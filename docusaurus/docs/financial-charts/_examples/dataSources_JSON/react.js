import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, createCSVServices, CSVExchange, MACDStudy, OHLCStudy, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";
// The sample price history: real Binance candles for BTCUSDT, ETHUSDT and SOLUSDT, served by jsDelivr
const SAMPLE_DATA = "https://cdn.jsdelivr.net/gh/ABTSoftware/SciChart.JS.Docs@0c19782c/docusaurus/static/financial-charts/data";
// CSVExchange reads CSV text, so write the candles as CSV rows: a header, then one row per candle.
// The header names are the ones CSVExchange looks for; use the `columns` option for other names
function candlesToCsv(candles) {
    const rows = candles.map((c) => `${c.time},${c.open},${c.high},${c.low},${c.close},${c.volume}`);
    return ["time,open,high,low,close,volume", ...rows].join("\n");
}
// Turn candles into chart services: an exchange with one symbol at one interval. timeUnit "ms" says
// how `time` is written ("s" for seconds, "iso" for date strings)
function servicesFor(candles) {
    const exchange = new CSVExchange({ csv: candlesToCsv(candles), symbol: "BTCUSDT", interval: CandleInterval.ONE_DAY }, { name: "MyData", timeUnit: "ms" });
    return createCSVServices(exchange);
}
export function JsonDataChart() {
    // Get the candles: here from a JSON file, but any array of candles works, e.g. from your own API
    const [handle, setHandle] = React.useState();
    React.useEffect(() => {
        fetch(`${SAMPLE_DATA}/btcusdt-1d.json`)
            .then((response) => response.json())
            .then((candles) => setHandle(servicesFor(candles)));
    }, []);
    // Fills its parent, so give the parent a height
    return handle ? React.createElement(JsonChart, { handle: handle }) : React.createElement("div", { style: toolbarStyle }, "Loading the candles\u2026");
}
function JsonChart({ handle }) {
    const chartRef = React.useRef(null);
    const [interval, setInterval] = React.useState(CandleInterval.ONE_DAY);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: handle.exchange.name,
        symbol: "BTCUSDT",
        interval: CandleInterval.ONE_DAY,
        period: "1Y",
        services: handle.services,
        studies: [new OHLCStudy(), new VolumeStudy(), new MACDStudy()],
    }), [handle]);
    // financeApi throws until the chart has initialised
    const chart = () => (chartRef.current?.isInitialized ? chartRef.current.financeApi : undefined);
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement(ButtonGroup, { values: handle.exchange.getSupportedIntervals().filter((i) => i !== CandleInterval.ONE_MONTH), selected: interval, onSelect: (i) => (setInterval(i), chart()?.changeInterval(i)) })),
        React.createElement("div", { style: { flex: 1, minHeight: 0 } },
            React.createElement(SciFinanceChartView, { ref: chartRef, config: config }))));
}
// A row of toggle buttons: one per value, the selected one highlighted
function ButtonGroup(props) {
    return (React.createElement("div", { style: { display: "flex", gap: 4 } }, props.values.map((value) => (React.createElement("button", { key: value, style: buttonStyle(value === props.selected), onClick: () => props.onSelect(value) }, value)))));
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px 16px",
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: 13,
};
const buttonStyle = (active = false) => ({
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: active ? "var(--st-ui-selection, #6c63ff)" : "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
});
