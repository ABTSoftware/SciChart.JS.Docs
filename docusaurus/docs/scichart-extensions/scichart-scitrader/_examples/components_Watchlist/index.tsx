import * as React from "react";
import {
    CandleInterval,
    formatSymbolPair,
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
import { SciFinanceChartView, useSciTraderTheme } from "scichart-scitrader-react";
import { ExamplePage } from "../../framework/ExamplePage";
import { DUMMY_EXCHANGE, DUMMY_SYMBOLS } from "../../dummyData/DummyDataExchange";
import { registerDummyData } from "../../sampleData";

const SYMBOLS = Object.keys(DUMMY_SYMBOLS);

/**
 * A watchlist built from two SDK pieces:
 * - `WatchListDataManager` streams each symbol's last price and 24-hour change from the exchange's
 *   tickers (`onDataUpdate`), and prefetches the candles for the sparklines over one shared stream.
 * - `SparkLineChart.createSpark` draws a live sparkline into any `<div>`, from those prefetched
 *   candles and stream.
 * - `formatSymbolPair` shows each symbol as a pair (`ALPHA/USD`), using the exchange's own parser.
 * The list itself is plain React; clicking a row charts that symbol.
 */
export default function WatchlistExample(): JSX.Element {
    registerDummyData();
    const [active, setActive] = React.useState(SYMBOLS[0]);
    const [chart, setChart] = React.useState<ISciFinanceChartPanelApi>();
    const theme = useSciTraderTheme();

    // One manager for the list: prices arrive through onDataUpdate.
    const [rows, setRows] = React.useState<TWatchListRowData[]>([]);
    const [manager, setManager] = React.useState<WatchListDataManager>();

    React.useEffect(() => {
        const wl = new WatchListDataManager({ exchangeName: DUMMY_EXCHANGE, onDataUpdate: setRows });
        wl.createFeeds(SYMBOLS);
        setManager(wl);
        return () => wl.delete();
    }, []);

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: DUMMY_EXCHANGE,
            symbol: active,
            interval: CandleInterval.FIVE_MINUTES,
            period: "1D",
            lockPeriodWidth: false,
            studies: [new OHLCStudy(), new VolumeStudy()],
            theme,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- created once; symbol and theme then change through the API
        []
    );

    React.useEffect(() => {
        chart?.financeApi.setTheme(theme);
    }, [chart, theme]);

    const select = (symbol: string) => {
        setActive(symbol);
        chart?.financeApi.setSymbol(symbol);
    };

    // Rows in SYMBOLS order; a symbol shows "–" until its first ticker arrives.
    const bySymbol = new Map(rows.map((row) => [row.id, row]));

    return (
        <ExamplePage
            title="Watchlist"
            description={
                <>
                    A watchlist built from the SDK: <code>WatchListDataManager</code> streams each symbol&apos;s price
                    and 24-hour change and prefetches its candles, and <code>SparkLineChart.createSpark</code> draws a
                    live sparkline into each row. Click a row to chart it. The data is the Sandbox&apos;s randomised{" "}
                    <code>DummyDataExchange</code>, so it ticks without a network connection.
                </>
            }
            ready={chart !== undefined}
        >
            <div style={{ position: "absolute", inset: 0, display: "flex" }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <SciFinanceChartView
                        config={config}
                        useSubCharts={false}
                        onInit={(api) => {
                            (window as unknown as { __example?: unknown }).__example = api;
                            setChart(api);
                        }}
                    />
                </div>
                <div role="list" aria-label="Watchlist" style={LIST_STYLE}>
                    {SYMBOLS.map((symbol) => (
                        <WatchlistRow
                            key={symbol}
                            symbol={symbol}
                            row={bySymbol.get(symbol)}
                            manager={manager}
                            active={symbol === active}
                            onSelect={() => select(symbol)}
                        />
                    ))}
                </div>
            </div>
        </ExamplePage>
    );
}

/** One symbol: name, sparkline, last price and change. */
function WatchlistRow({
    symbol,
    row,
    manager,
    active,
    onSelect,
}: {
    symbol: string;
    row: TWatchListRowData | undefined;
    manager: WatchListDataManager | undefined;
    active: boolean;
    onSelect: () => void;
}): JSX.Element {
    const up = (row?.changePC ?? 0) >= 0;

    return (
        <div role="listitem">
            <button
                type="button"
                onClick={onSelect}
                aria-pressed={active}
                data-testid={`watchlist-row-${symbol}`}
                style={{
                    ...ROW_STYLE,
                    background: active ? "rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08)" : "none",
                }}
            >
                <span style={{ width: 90, fontWeight: 600 }}>{formatSymbolPair(symbol, DUMMY_EXCHANGE)}</span>
                <Sparkline symbol={symbol} manager={manager} />
                <span style={{ width: 80, textAlign: "right" }}>{row ? row.last.toFixed(2) : "–"}</span>
                <span
                    style={{
                        width: 70,
                        textAlign: "right",
                        color: up ? "var(--st-ui-positive)" : "var(--st-ui-negative)",
                    }}
                >
                    {row ? `${up ? "+" : ""}${row.changePC.toFixed(2)}%` : ""}
                </span>
            </button>
        </div>
    );
}

/**
 * A live sparkline in a `<div>`. The manager's prefetched candles seed it and its shared candle
 * stream keeps it moving, so a list of sparklines makes one request and holds one connection.
 */
function Sparkline({ symbol, manager }: { symbol: string; manager: WatchListDataManager | undefined }): JSX.Element {
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
                exchangeName: DUMMY_EXCHANGE,
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

    // createSpark gives an id-less element a unique id; this one just makes the row easy to find in the DOM.
    return <div ref={hostRef} id={`watchlist-sparkline-${symbol}`} style={{ flex: 1, height: 36, minWidth: 0 }} />;
}

const LIST_STYLE: React.CSSProperties = {
    width: 400,
    overflowY: "auto",
    borderLeft: "1px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.08)",
    background: "var(--st-ui-background)",
};

const ROW_STYLE: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "8px 16px",
    border: 0,
    borderBottom: "1px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.05)",
    color: "var(--st-ui-text)",
    font: "inherit",
    fontSize: 13,
    textAlign: "left",
    cursor: "pointer",
};
