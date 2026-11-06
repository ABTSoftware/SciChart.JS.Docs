import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { EMPTY, firstValueFrom, Observable } from "rxjs";
import {
    CandleInterval,
    CoinbaseExchange,
    createSciTraderTheme,
    defaultExchangeProvider,
    ECandleType,
    IBookSnapshot,
    IBookUpdate,
    IDepthColumn,
    IHeatmapAvailability,
    IHeatmapTile,
    idbPriceStore,
    IOrderBookSource,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    ISciTraderTheme,
    OHLCStudy,
    SCITRADER_DARK_THEME,
    SCITRADER_THEME_LIST,
    themeDisplayName,
    VolumeStudy,
} from "scichart-scitrader";
import {
    CandleTypeSelector,
    IntervalSelector,
    MarketDepthView,
    SciFinanceChartView,
    SciTraderThemeProvider,
    useSciTraderTheme,
    useSciTraderThemeSwitch,
} from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// A theme with market depth colours of its own: theme.market colours the depth ladder
const CUSTOM_DEPTH: ISciTraderTheme = createSciTraderTheme(SCITRADER_DARK_THEME, {
    name: "Dark, custom depth",
    market: {
        bid: "#4FC3F7", // bid prices
        ask: "#FFB74D", // ask prices
        bidBar: "rgba(79, 195, 247, 0.25)", // the bars behind the bids
        askBar: "rgba(255, 183, 77, 0.25)", // the bars behind the asks
    },
});
const THEMES = [...SCITRADER_THEME_LIST, CUSTOM_DEPTH];

// An IOrderBookSource for Coinbase's public order book, which the depth panel reads.
// Coinbase's "level2_batch" WebSocket channel needs no API key. It sends the whole book once, then
// batches of changes. This source keeps the book in memory and sends the panel the top levels four
// times a second, as the IOrderBookSource contract asks: the panel has no use for every change
class CoinbaseOrderBookSource implements IOrderBookSource {
    readonly exchangeName = CoinbaseExchange.name;

    getBookStream(symbol: string, depth = 50): Observable<IBookUpdate> {
        return new Observable<IBookUpdate>((subscriber) => {
            // price -> quantity, for each side of the book
            const bids = new Map<number, number>();
            const asks = new Map<number, number>();
            const socket = new WebSocket("wss://ws-feed.exchange.coinbase.com");

            socket.onopen = () =>
                socket.send(JSON.stringify({ type: "subscribe", product_ids: [symbol], channels: ["level2_batch"] }));

            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === "snapshot") {
                    // The whole book: [price, size] pairs as strings
                    for (const [price, size] of message.bids) bids.set(Number(price), Number(size));
                    for (const [price, size] of message.asks) asks.set(Number(price), Number(size));
                } else if (message.type === "l2update") {
                    // Changes: [side, price, size]. A size of 0 removes the level
                    for (const [side, price, size] of message.changes) {
                        const book = side === "buy" ? bids : asks;
                        if (Number(size) === 0) book.delete(Number(price));
                        else book.set(Number(price), Number(size));
                    }
                }
            };
            socket.onerror = () => subscriber.error(new Error("Coinbase order-book connection failed"));

            // Four times a second, send the top of the book. isSnapshot: true replaces the ladder
            const timer = setInterval(() => {
                if (bids.size === 0 || asks.size === 0) return;
                subscriber.next({
                    symbol,
                    timestamp: Date.now(),
                    isSnapshot: true,
                    bids: topLevels(bids, depth, (a, b) => b - a), // highest bid first
                    asks: topLevels(asks, depth, (a, b) => a - b), // lowest ask first
                });
            }, 250);

            // Called when the panel unsubscribes: stop the timer and close the connection
            return () => {
                clearInterval(timer);
                socket.close();
            };
        });
    }

    // The current top of the book: the stream's first frame
    getBookSnapshot(symbol: string, depth?: number): Promise<IBookSnapshot | null> {
        return firstValueFrom(this.getBookStream(symbol, depth));
    }

    // No liquidity heatmap here: the depth panel only needs the book
    async getHeatmapAvailability(): Promise<IHeatmapAvailability> {
        return { enabled: false, tileColumns: 0, tiers: [] };
    }
    async getHeatmapTile(): Promise<IHeatmapTile | null> {
        return null;
    }
    getDepthStream(): Observable<IDepthColumn> {
        return EMPTY;
    }
}

// The best `depth` levels of one side of the book, as { price, qty }
function topLevels(book: Map<number, number>, depth: number, order: (a: number, b: number) => number) {
    return [...book.keys()]
        .sort(order)
        .slice(0, depth)
        .map((price) => ({ price, qty: book.get(price) }));
}

const INTERVALS = [CandleInterval.FIVE_MINUTES, CandleInterval.ONE_HOUR, CandleInterval.SIX_HOURS, CandleInterval.ONE_DAY];

export function ThemedComponents() {
    // One theme for every part. SciTraderThemeProvider gives it to the React components inside it:
    // the toolbar controls read its CSS variables, and MarketDepthView follows it by itself
    const [theme, setTheme] = React.useState<ISciTraderTheme>(SCITRADER_DARK_THEME);
    return (
        <SciTraderThemeProvider theme={theme} onThemeChange={setTheme} themes={THEMES}>
            <TradingScreen />
        </SciTraderThemeProvider>
    );
}

function TradingScreen() {
    const theme = useSciTraderTheme();
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    const [interval, setInterval] = React.useState(CandleInterval.ONE_HOUR);
    const [candleType, setCandleType] = React.useState(ECandleType.Candlestick);
    const source = React.useMemo(() => new CoinbaseOrderBookSource(), []);

    // The chart is drawn by WebGL, so it takes the theme itself, through setTheme
    React.useEffect(() => api?.financeApi.setTheme(theme), [api, theme]);

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.ONE_HOUR,
            period: "1W",
            theme,
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <ThemePicker />
            {/* The toolbar controls: styled by scitrader.css from the theme's CSS variables */}
            <div style={toolbarStyle}>
                <IntervalSelector
                    value={interval}
                    intervals={INTERVALS}
                    onChange={(next) => {
                        setInterval(next);
                        api?.financeApi.changeInterval(next);
                    }}
                />
                <CandleTypeSelector
                    value={candleType}
                    onChange={(type) => {
                        setCandleType(type);
                        api?.financeApi.setCandleType(type);
                    }}
                />
            </div>
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <SciFinanceChartView config={config} onInit={setApi} />
                </div>
                {/* The market depth ladder: its colours come from theme.market */}
                <div style={{ width: 300 }}>
                    <MarketDepthView source={source} symbol="BTC-USD" />
                </div>
            </div>
        </div>
    );
}

function ThemePicker() {
    const themeSwitch = useSciTraderThemeSwitch();
    if (!themeSwitch) return null;
    return (
        <div style={toolbarStyle}>
            {themeSwitch.themes.map((theme) => (
                <button
                    key={theme.name}
                    style={buttonStyle(theme === themeSwitch.theme)}
                    onClick={() => themeSwitch.setTheme(theme)}
                >
                    {themeDisplayName(theme)}
                </button>
            ))}
        </div>
    );
}

// The bars' colours are the theme's CSS variables too
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    padding: "6px 12px",
    background: "var(--st-ui-toolbar-background)",
    borderBottom: "1px solid var(--st-ui-divider)",
};

const buttonStyle = (selected: boolean): React.CSSProperties => ({
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider)",
    borderRadius: 4,
    background: selected ? "var(--st-ui-accent)" : "var(--st-ui-button-background)",
    color: selected ? "#ffffff" : "var(--st-ui-toolbar-text)",
    font: "13px var(--st-font-family, sans-serif)",
    cursor: "pointer",
});
