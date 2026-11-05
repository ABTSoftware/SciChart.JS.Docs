import "scichart-scitrader/scitrader.css";
import { EMPTY, firstValueFrom, Observable } from "rxjs";
import {
    applyThemeCssVariables,
    CandleInterval,
    CandleTypeSelector,
    CoinbaseExchange,
    createSciTraderTheme,
    defaultExchangeProvider,
    IBookSnapshot,
    IBookUpdate,
    IDepthColumn,
    IHeatmapAvailability,
    IHeatmapTile,
    idbPriceStore,
    IntervalSelector,
    IOrderBookSource,
    ISciTraderTheme,
    MarketDepthPanel,
    OHLCStudy,
    SciFinanceChartPanel,
    SCITRADER_DARK_THEME,
    SCITRADER_THEME_LIST,
    themeDisplayName,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="themes"></div>
//     <div id="toolbar"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//         <div id="depth" style="width: 300px"></div>
//     </div>
// </div>

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

async function createChart() {
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.ONE_HOUR,
        period: "1W",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi;

    // The toolbar controls: plain HTML, styled by scitrader.css from the theme's CSS variables
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    IntervalSelector.create(toolbar, {
        value: CandleInterval.ONE_HOUR,
        intervals: [CandleInterval.FIVE_MINUTES, CandleInterval.ONE_HOUR, CandleInterval.SIX_HOURS, CandleInterval.ONE_DAY],
        onChange: (interval) => chart.changeInterval(interval),
    });
    CandleTypeSelector.create(toolbar, { value: chart.getCandleType(), onChange: (type) => chart.setCandleType(type) });

    // The market depth ladder: its colours come from theme.market
    const depth = MarketDepthPanel.create(document.getElementById("depth"), {
        source: new CoinbaseOrderBookSource(),
        symbol: "BTC-USD",
        theme: SCITRADER_DARK_THEME,
    });

    // One theme for every part. Each part takes it its own way:
    function applyTheme(theme: ISciTraderTheme) {
        chart.setTheme(theme); // the chart, drawn by WebGL
        depth.setTheme(theme); // the depth ladder, drawn on a canvas
        // HTML controls outside the chart and the depth panel, such as the toolbar, read the theme's
        // CSS variables: write them on an element above the controls
        applyThemeCssVariables(document.body, theme);
        renderThemeButtons(theme);
    }

    function renderThemeButtons(current: ISciTraderTheme) {
        const bar = document.getElementById("themes");
        Object.assign(bar.style, toolbarStyle);
        bar.replaceChildren(
            ...THEMES.map((theme) => {
                const button = document.createElement("button");
                button.textContent = themeDisplayName(theme);
                Object.assign(button.style, buttonStyle(theme === current));
                button.onclick = () => applyTheme(theme);
                return button;
            })
        );
    }
    applyTheme(SCITRADER_DARK_THEME);

    // When the page goes away: depth.destroy(); financeChartPanel.cleanup();
    return { financeChartPanel, depth };
}

// The bars' colours are the theme's CSS variables too
const toolbarStyle: Partial<CSSStyleDeclaration> = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    background: "var(--st-ui-toolbar-background)",
    borderBottom: "1px solid var(--st-ui-divider)",
};

const buttonStyle = (selected: boolean): Partial<CSSStyleDeclaration> => ({
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider)",
    borderRadius: "4px",
    background: selected ? "var(--st-ui-accent)" : "var(--st-ui-button-background)",
    color: selected ? "#ffffff" : "var(--st-ui-toolbar-text)",
    font: "13px var(--st-font-family, sans-serif)",
    cursor: "pointer",
});

createChart();
