import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, createExchangeProvider, DataFeedManager, idbPriceStore, OHLCStudy, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";
// A candle store that logs what the SDK asks of it, and passes each call to idbPriceStore, the
// built-in IndexedDB store. Every ICandleStore call says which exchange, symbol and interval it is for
class LoggingCandleStore {
    constructor(log) {
        this.log = log;
    }
    // The cache asks the store first: candles it has for the requested range
    async getCandles(exchange, symbol, interval, start, end) {
        const candles = await idbPriceStore.getCandles(exchange, symbol, interval, start, end);
        this.log(`read   ${symbol} ${interval}: ${candles.length} cached candles`);
        return candles;
    }
    // Then it fetches what was missing from the exchange, and stores it here
    async insertCandles(exchange, symbol, interval, candles) {
        this.log(`write  ${symbol} ${interval}: ${candles.length} candles from ${exchange}`);
        return idbPriceStore.insertCandles(exchange, symbol, interval, candles);
    }
    // Where the exchange's history starts, once found, so it isn't asked for again
    getEarliestCandleTime(exchange, symbol, interval) {
        return idbPriceStore.getEarliestCandleTime(exchange, symbol, interval);
    }
    setEarliestCandleTime(exchange, symbol, interval, time) {
        this.log(`floor  ${symbol} ${interval}: history starts ${new Date(time).toISOString().slice(0, 10)}`);
        return idbPriceStore.setEarliestCandleTime(exchange, symbol, interval, time);
    }
    // Optional: time spans with no candles, so they aren't asked for again
    getKnownEmptyRanges(exchange, symbol, interval) {
        return idbPriceStore.getKnownEmptyRanges(exchange, symbol, interval);
    }
    setKnownEmptyRanges(exchange, symbol, interval, ranges) {
        return idbPriceStore.setKnownEmptyRanges(exchange, symbol, interval, ranges);
    }
    // Optional: tells the cache when old candles are deleted to keep the store's size down
    subscribeToEvictions(callback) {
        return idbPriceStore.subscribeToEvictions(callback);
    }
}
const INTERVALS = CoinbaseExchange.getSupportedIntervals();
export function CandleStoreChart() {
    const chartRef = React.useRef(null);
    const [lines, setLines] = React.useState([]);
    const [interval, setInterval] = React.useState(CandleInterval.ONE_HOUR);
    const log = (line) => setLines((previous) => [`${new Date().toLocaleTimeString()} ${line}`, ...previous]);
    // Register Coinbase with the logging store, in a provider of this chart's own. Create the config
    // once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => {
        const provider = createExchangeProvider();
        provider.registerExchange(CoinbaseExchange, new LoggingCandleStore(log));
        return {
            exchangeName: CoinbaseExchange.name,
            symbol: "BTC-USD",
            interval: CandleInterval.ONE_HOUR,
            period: "1W",
            services: { dataFeedManager: new DataFeedManager(provider) }, // the chart's data comes from `provider`
            studies: [new OHLCStudy(), new VolumeStudy()],
        };
    }, []);
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement(ButtonGroup, { values: INTERVALS, selected: interval, onSelect: (i) => {
                    setInterval(i);
                    if (chartRef.current?.isInitialized)
                        chartRef.current.financeApi.changeInterval(i);
                } }),
            React.createElement("button", { style: buttonStyle(), onClick: () => idbPriceStore.clearAll().then(() => log("cleared IndexedDB")) }, "Clear the cache")),
        React.createElement("div", { style: { display: "flex", flex: 1, minHeight: 0 } },
            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement(SciFinanceChartView, { ref: chartRef, config: config })),
            React.createElement("pre", { style: logStyle }, lines.join("\n")))));
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
const logStyle = {
    width: 340,
    margin: 0,
    padding: "8px 12px",
    overflowY: "auto",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    font: "12px/1.5 monospace",
    whiteSpace: "pre-wrap",
};
