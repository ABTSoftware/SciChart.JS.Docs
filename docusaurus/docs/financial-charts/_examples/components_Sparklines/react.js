import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, formatSymbolPair, idbPriceStore, OHLCStudy, SPARKLINE_INTERVAL, SPARKLINE_WINDOW_CANDLES, SparkLineChart, VolumeStudy, WatchListDataManager, } from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";
// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
const EXCHANGE = CoinbaseExchange.name; // name="Coinbase" matches the built-in CoinbaseExchange
const SYMBOLS = ["BTC-USD", "ETH-USD", "SOL-USD", "XRP-USD", "DOGE-USD"]; // Coinbase's symbol format
export function SparklineWatchlist() {
    const chartRef = React.useRef(null);
    // The symbol the chart shows: clicking a row charts that symbol
    const [active, setActive] = React.useState(SYMBOLS[0]);
    // The latest price and 24-hour change for each symbol, from WatchListDataManager
    const [rows, setRows] = React.useState([]);
    const [manager, setManager] = React.useState();
    // One manager for the whole list. It streams prices through onDataUpdate, and fetches the
    // sparkline candles for every symbol over one shared stream
    React.useEffect(() => {
        const watchList = new WatchListDataManager({ exchangeName: EXCHANGE, onDataUpdate: setRows });
        watchList.createFeeds(SYMBOLS);
        setManager(watchList);
        return () => watchList.delete();
    }, []);
    const config = React.useMemo(() => ({
        exchangeName: EXCHANGE,
        symbol: SYMBOLS[0],
        interval: CandleInterval.FIFTEEN_MINUTES,
        period: "1D", // the last day, like the sparklines
        studies: [new OHLCStudy(), new VolumeStudy()],
    }), []);
    const select = (symbol) => {
        setActive(symbol);
        // financeApi throws until the chart has initialised
        if (chartRef.current?.isInitialized)
            chartRef.current.financeApi.setSymbol(symbol);
    };
    const bySymbol = new Map(rows.map((row) => [row.symbol, row]));
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", height: "100%" } },
        React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            React.createElement(SciFinanceChartView, { ref: chartRef, config: config })),
        React.createElement("div", { role: "list", "aria-label": "Watchlist", style: listStyle }, SYMBOLS.map((symbol) => {
            const row = bySymbol.get(symbol);
            const up = (row?.changePC ?? 0) >= 0;
            return (React.createElement("div", { key: symbol, role: "listitem", style: rowStyle(symbol === active), onClick: () => select(symbol) },
                React.createElement("span", { style: { width: 78, fontWeight: 600 } }, formatSymbolPair(symbol, EXCHANGE)),
                React.createElement(Sparkline, { symbol: symbol, manager: manager }),
                React.createElement("div", { style: { width: 80, textAlign: "right" } },
                    React.createElement("div", null, row ? formatPrice(row.last) : "–"),
                    React.createElement("div", { style: {
                            fontSize: 12,
                            color: up ? "var(--st-market-bid, #2ebd85)" : "var(--st-market-ask, #f6465d)",
                        } }, row ? `${up ? "+" : ""}${row.changePC.toFixed(2)}%` : ""))));
        }))));
}
// A live sparkline in a <div>. The manager's prefetched candles and live stream feed it, so a whole
// list of sparklines makes one request and holds one connection
function Sparkline({ symbol, manager }) {
    const hostRef = React.useRef(null);
    React.useEffect(() => {
        if (!manager || !hostRef.current)
            return undefined;
        let disposed = false;
        let surface;
        (async () => {
            const prefetched = await manager.getSparklineData(symbol);
            if (disposed || !hostRef.current)
                return;
            const { sciChartSurface } = await SparkLineChart.createSpark(hostRef.current, {
                exchangeName: EXCHANGE,
                instrument: symbol,
                interval: SPARKLINE_INTERVAL, // the SDK's sparkline candle size
                candles: SPARKLINE_WINDOW_CANDLES, // how many candles a sparkline shows
                prefetchedCandles: prefetched?.candles,
                candleStream$: prefetched?.candleStream$,
            });
            // Unmounted while it was being created: delete it straight away
            if (disposed)
                sciChartSurface.delete();
            else
                surface = sciChartSurface;
        })();
        // Delete the sparkline's SciChart surface when the row unmounts
        return () => {
            disposed = true;
            surface?.delete();
        };
    }, [symbol, manager]);
    return React.createElement("div", { ref: hostRef, style: { flex: 1, height: 36, minWidth: 0 } });
}
// More decimals for small prices: 0.0812 rather than 0.08
function formatPrice(price) {
    return price.toFixed(price < 10 ? 4 : 2);
}
// The list uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const listStyle = {
    width: 360,
    height: "100%",
    overflowY: "auto",
    boxSizing: "border-box",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text, #ffffff)",
    fontFamily: "var(--st-font-family, sans-serif)",
    fontSize: 13,
};
const rowStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    background: active ? "var(--st-ui-surface, #373447)" : "transparent",
    cursor: "pointer",
});
