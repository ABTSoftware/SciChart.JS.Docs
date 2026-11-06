import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, createCSVServices, CSVExchange, OHLCStudy, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";
// The sample price history: real Binance candles for BTCUSDT, ETHUSDT and SOLUSDT, served by jsDelivr
const SAMPLE_DATA = "https://cdn.jsdelivr.net/gh/ABTSoftware/SciChart.JS.Docs@0c19782c/docusaurus/static/financial-charts/data";
// 1. Load the CSV files, once. Each row is "symbol,time,open,high,low,close,volume", so one exchange
// serves all three symbols. CSVExchange serves every interval the data can make: the hourly file
// gives 1h to 12h, the daily file 1d, 1w and 1M. It moves the dates so the data ends now.
// 2. createCSVServices: chart services for this exchange alone, so nothing is registered in
// defaultExchangeProvider
const loading = CSVExchange.fromUrl([`${SAMPLE_DATA}/crypto-1h.csv`, `${SAMPLE_DATA}/crypto-1d.csv`], { name: "Sample" } // the exchangeName charts ask for
).then(createCSVServices);
export function CsvDataChart() {
    // The chart can only be created once the files have loaded
    const [handle, setHandle] = React.useState();
    const [symbols, setSymbols] = React.useState([]);
    React.useEffect(() => {
        loading.then(async (h) => {
            setSymbols(await h.exchange.getInstruments()); // ["BTCUSDT", "ETHUSDT", "SOLUSDT"]
            setHandle(h);
        });
    }, []);
    // Fills its parent, so give the parent a height
    return handle ? React.createElement(CsvChart, { handle: handle, symbols: symbols }) : React.createElement("div", { style: toolbarStyle }, "Loading the CSV files\u2026");
}
function CsvChart({ handle, symbols }) {
    const chartRef = React.useRef(null);
    const [symbol, setSymbol] = React.useState("BTCUSDT");
    const [interval, setInterval] = React.useState(CandleInterval.FOUR_HOURS);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: handle.exchange.name,
        symbol: "BTCUSDT",
        interval: CandleInterval.FOUR_HOURS,
        period: "1M",
        services: handle.services,
        studies: [new OHLCStudy(), new VolumeStudy()],
    }), [handle]);
    // financeApi throws until the chart has initialised
    const chart = () => (chartRef.current?.isInitialized ? chartRef.current.financeApi : undefined);
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement(ButtonGroup, { values: symbols, selected: symbol, onSelect: (s) => (setSymbol(s), chart()?.setSymbol(s)) }),
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
