import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    formatSymbolPair,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    SPARKLINE_INTERVAL,
    SPARKLINE_WINDOW_CANDLES,
    SparkLineChart,
    TWatchListRowData,
    VolumeStudy,
    WatchListDataManager,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

const EXCHANGE = CoinbaseExchange.name; // name="Coinbase" matches the built-in CoinbaseExchange
const SYMBOLS = ["BTC-USD", "ETH-USD", "SOL-USD", "XRP-USD", "DOGE-USD"]; // Coinbase's symbol format

export function SparklineWatchlist() {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    // The symbol the chart shows: clicking a row charts that symbol
    const [active, setActive] = React.useState(SYMBOLS[0]);
    // The latest price and 24-hour change for each symbol, from WatchListDataManager
    const [rows, setRows] = React.useState<TWatchListRowData[]>([]);
    const [manager, setManager] = React.useState<WatchListDataManager>();

    // One manager for the whole list. It streams prices through onDataUpdate, and fetches the
    // sparkline candles for every symbol over one shared stream
    React.useEffect(() => {
        const watchList = new WatchListDataManager({ exchangeName: EXCHANGE, onDataUpdate: setRows });
        watchList.createFeeds(SYMBOLS);
        setManager(watchList);
        return () => watchList.delete();
    }, []);

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: EXCHANGE,
            symbol: SYMBOLS[0],
            interval: CandleInterval.FIFTEEN_MINUTES,
            period: "1D", // the last day, like the sparklines
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    const select = (symbol: string) => {
        setActive(symbol);
        // financeApi throws until the chart has initialised
        if (chartRef.current?.isInitialized) chartRef.current.financeApi.setSymbol(symbol);
    };

    const bySymbol = new Map<string, TWatchListRowData>(rows.map((row) => [row.symbol, row]));

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <SciFinanceChartView ref={chartRef} config={config} />
            </div>
            <div role="list" aria-label="Watchlist" style={listStyle}>
                {SYMBOLS.map((symbol) => {
                    const row = bySymbol.get(symbol);
                    const up = (row?.changePC ?? 0) >= 0;
                    return (
                        <div key={symbol} role="listitem" style={rowStyle(symbol === active)} onClick={() => select(symbol)}>
                            {/* "BTC-USD" -> "BTC/USD", using the exchange's own symbol parser */}
                            <span style={{ width: 78, fontWeight: 600 }}>{formatSymbolPair(symbol, EXCHANGE)}</span>
                            <Sparkline symbol={symbol} manager={manager} />
                            <div style={{ width: 80, textAlign: "right" }}>
                                <div>{row ? formatPrice(row.last) : "–"}</div>
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: up ? "var(--st-market-bid, #2ebd85)" : "var(--st-market-ask, #f6465d)",
                                    }}
                                >
                                    {row ? `${up ? "+" : ""}${row.changePC.toFixed(2)}%` : ""}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// A live sparkline in a <div>. The manager's prefetched candles and live stream feed it, so a whole
// list of sparklines makes one request and holds one connection
function Sparkline({ symbol, manager }: { symbol: string; manager: WatchListDataManager | undefined }) {
    const hostRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!manager || !hostRef.current) return undefined;
        let disposed = false;
        let surface: { delete(): void } | undefined;

        (async () => {
            const prefetched = await manager.getSparklineData(symbol);
            if (disposed || !hostRef.current) return;
            const { sciChartSurface } = await SparkLineChart.createSpark(hostRef.current, {
                exchangeName: EXCHANGE,
                instrument: symbol,
                interval: SPARKLINE_INTERVAL, // the SDK's sparkline candle size
                candles: SPARKLINE_WINDOW_CANDLES, // how many candles a sparkline shows
                prefetchedCandles: prefetched?.candles,
                candleStream$: prefetched?.candleStream$,
            });
            // Unmounted while it was being created: delete it straight away
            if (disposed) sciChartSurface.delete();
            else surface = sciChartSurface;
        })();

        // Delete the sparkline's SciChart surface when the row unmounts
        return () => {
            disposed = true;
            surface?.delete();
        };
    }, [symbol, manager]);

    return <div ref={hostRef} style={{ flex: 1, height: 36, minWidth: 0 }} />;
}

// More decimals for small prices: 0.0812 rather than 0.08
function formatPrice(price: number) {
    return price.toFixed(price < 10 ? 4 : 2);
}

// The list uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const listStyle: React.CSSProperties = {
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

const rowStyle = (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    background: active ? "var(--st-ui-surface, #373447)" : "transparent",
    cursor: "pointer",
});
