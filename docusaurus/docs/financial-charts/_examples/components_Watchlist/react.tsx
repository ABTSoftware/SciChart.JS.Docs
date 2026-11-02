import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
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

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

const EXCHANGE = BinanceExchange.name; // name="Binance" matches the built-in BinanceExchange
const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"];

/**
 * A watchlist built from two SDK pieces:
 * - WatchListDataManager streams each symbol's last price and 24-hour change from the exchange's
 *   tickers, and prefetches the candles for the sparklines over one shared stream.
 * - SparkLineChart.createSpark draws a live sparkline into any <div>.
 * The list itself is plain React. Clicking a row charts that symbol.
 */
export function WatchlistWithChart() {
    const [active, setActive] = React.useState(SYMBOLS[0]);
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    const [rows, setRows] = React.useState<TWatchListRowData[]>([]);
    const [manager, setManager] = React.useState<WatchListDataManager>();

    // One manager for the whole list: prices arrive through onDataUpdate
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
            interval: CandleInterval.FIVE_MINUTES,
            period: "1D",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    const select = (symbol: string) => {
        setActive(symbol);
        api?.financeApi.setSymbol(symbol);
    };

    // Rows in SYMBOLS order. A symbol shows "–" until its first ticker arrives.
    const bySymbol = new Map<string, TWatchListRowData>(rows.map((row) => [row.id, row]));

    return (
        <div style={{ display: "flex", height: 600 }}>
            <div style={{ flex: 1 }}>
                <SciFinanceChartView config={config} onInit={setApi} />
            </div>
            <div role="list" aria-label="Watchlist" style={{ width: 400, overflowY: "auto" }}>
                {SYMBOLS.map((symbol) => {
                    const row = bySymbol.get(symbol);
                    const up = (row?.changePC ?? 0) >= 0;
                    return (
                        <button
                            key={symbol}
                            role="listitem"
                            onClick={() => select(symbol)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                width: "100%",
                                padding: "8px 16px",
                                fontWeight: symbol === active ? "bold" : "normal",
                            }}
                        >
                            {/* BTCUSDT → BTC/USDT, using the exchange's own symbol parser */}
                            <span style={{ width: 90 }}>{formatSymbolPair(symbol, EXCHANGE)}</span>
                            <Sparkline symbol={symbol} manager={manager} />
                            <span style={{ width: 80, textAlign: "right" }}>{row ? row.last.toFixed(2) : "–"}</span>
                            <span style={{ width: 70, textAlign: "right", color: up ? "green" : "red" }}>
                                {row ? `${up ? "+" : ""}${row.changePC.toFixed(2)}%` : ""}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * A live sparkline in a <div>. The manager's prefetched candles seed it and its shared candle stream
 * keeps it moving, so a whole list of sparklines makes one request and holds one connection.
 */
function Sparkline({ symbol, manager }: { symbol: string; manager: WatchListDataManager | undefined }) {
    const hostRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!manager || !hostRef.current) {
            return undefined;
        }
        let disposed = false;
        let surface: { delete(): void } | undefined;

        (async () => {
            const prefetched = await manager.getSparklineData(symbol);
            if (disposed || !hostRef.current) {
                return;
            }
            const { sciChartSurface } = await SparkLineChart.createSpark(hostRef.current, {
                exchangeName: EXCHANGE,
                instrument: symbol,
                interval: SPARKLINE_INTERVAL,
                candles: SPARKLINE_WINDOW_CANDLES,
                prefetchedCandles: prefetched?.candles,
                candleStream$: prefetched?.candleStream$,
            });
            if (disposed) {
                sciChartSurface.delete();
            } else {
                surface = sciChartSurface;
            }
        })();

        return () => {
            disposed = true;
            surface?.delete();
        };
    }, [symbol, manager]);

    return <div ref={hostRef} style={{ flex: 1, height: 36, minWidth: 0 }} />;
}
