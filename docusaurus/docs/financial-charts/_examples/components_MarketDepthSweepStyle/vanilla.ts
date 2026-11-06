import "scichart-scitrader/scitrader.css";
import { EMPTY, firstValueFrom, Observable } from "rxjs";
import {
    CandleInterval,
    CoinbaseExchange,
    DEFAULT_MARKET_DEPTH_SETTINGS,
    defaultExchangeProvider,
    IBookSnapshot,
    IBookUpdate,
    IDepthColumn,
    IHeatmapAvailability,
    IHeatmapTile,
    idbPriceStore,
    IOrderBookSource,
    MarketDepthPanel,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; height: 100%">
//     <div id="chart" style="flex: 1; min-width: 0"></div>
//     <div id="depth" style="width: 340px"></div>
// </div>

// Register a data source for the chart's candles, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

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

async function createChartAndDepth() {
    // 1. Restyle the slippage readout with CSS: see READOUT_CSS below
    const style = document.createElement("style");
    style.textContent = READOUT_CSS;
    document.head.appendChild(style);

    // 2. The shading over the rungs an order would consume, and the dashed line at its edge, are
    // drawn on the ladder's canvas, so they are settings rather than CSS: colours.highlight and
    // colours.highlightEdge
    const depth = MarketDepthPanel.create(document.getElementById("depth"), {
        source: new CoinbaseOrderBookSource(),
        symbol: "BTC-USD", // Coinbase's symbol format
        settings: {
            ...DEFAULT_MARKET_DEPTH_SETTINGS,
            colours: {
                ...DEFAULT_MARKET_DEPTH_SETTINGS.colours,
                highlight: "rgba(255, 193, 7, 0.18)", // an amber wash over the swept rungs
                highlightEdge: "#ffc107", // and an amber edge line
            },
        },
    });

    // The chart, so the readout has room to show to the left of the panel
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.ONE_MINUTE,
        period: "1H",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });

    // When the page goes away: depth.destroy(); financeChartPanel.cleanup(); style.remove();
    return { financeChartPanel, depth };
}

// The readout is attached to document.body, outside your page's containers, so these rules use
// the readout's own classes. Each starts with "body", which always matches the readout and makes
// the rule more specific than scitrader.css's, so it wins whichever stylesheet loads first.
// Point at a rung in the ladder to see them
const READOUT_CSS = `
    /* The box: larger, rounder, with a stronger shadow and a sans-serif font */
    body .st-market-depth__sweep {
        min-width: 200px;
        padding: 12px 14px;
        border-radius: 10px;
        border: 1px solid rgba(255, 193, 7, 0.35);
        background: rgba(18, 16, 28, 0.97);
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.6);
        font-family: var(--st-font-family, "DM Sans", sans-serif);
        font-size: 13px;
    }

    /* Each side has its own modifier class: --ask (buying) and --bid (selling) */
    body .st-market-depth__sweep--ask {
        border-left: 5px solid #f6465d;
    }
    body .st-market-depth__sweep--bid {
        border-left: 5px solid #2ebd85;
    }

    /* The headline, "Buy up to 78,471.97": the price, coloured by side */
    body .st-market-depth__sweep-head {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }
    body .st-market-depth__sweep--ask .st-market-depth__sweep-head strong {
        color: #f6465d;
        font-size: 14px;
    }
    body .st-market-depth__sweep--bid .st-market-depth__sweep-head strong {
        color: #2ebd85;
        font-size: 14px;
    }

    /* The rows: labels (dt) and values (dd), in a two-column grid */
    body .st-market-depth__sweep-rows {
        gap: 4px 16px;
    }
    body .st-market-depth__sweep-rows dd {
        font-family: "SF Mono", Menlo, Consolas, monospace;
        color: #ffffff;
    }

    /* Hide one row: the third pair of dt / dd is "Sum USD" */
    body .st-market-depth__sweep-rows dt:nth-of-type(3),
    body .st-market-depth__sweep-rows dd:nth-of-type(3) {
        display: none;
    }

    /* Add fixed text after the footer ("4 levels") with ::after */
    body .st-market-depth__sweep-foot::after {
        content: " · indicative, before fees";
    }
`;

createChartAndDepth();
