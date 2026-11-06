import "scichart-scitrader/scitrader.css";
import { EMPTY, firstValueFrom, Observable } from "rxjs";
import { CandleInterval, CoinbaseExchange, defaultExchangeProvider, getOrderBookSource, idbPriceStore, MarketDepthPanel, OHLCStudy, SciFinanceChartPanel, setOrderBookSources, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//         <div id="depth" style="width: 340px"></div>
//     </div>
// </div>
// Register a data source for the chart's candles, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
// An IOrderBookSource for Coinbase's public order book, which the depth panel reads.
// Coinbase's "level2_batch" WebSocket channel needs no API key. It sends the whole book once, then
// batches of changes. This source keeps the book in memory and sends the panel the top levels four
// times a second, as the IOrderBookSource contract asks: the panel has no use for every change
class CoinbaseOrderBookSource {
    constructor() {
        this.exchangeName = CoinbaseExchange.name;
    }
    getBookStream(symbol, depth = 50) {
        return new Observable((subscriber) => {
            // price -> quantity, for each side of the book
            const bids = new Map();
            const asks = new Map();
            const socket = new WebSocket("wss://ws-feed.exchange.coinbase.com");
            socket.onopen = () => socket.send(JSON.stringify({ type: "subscribe", product_ids: [symbol], channels: ["level2_batch"] }));
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === "snapshot") {
                    // The whole book: [price, size] pairs as strings
                    for (const [price, size] of message.bids)
                        bids.set(Number(price), Number(size));
                    for (const [price, size] of message.asks)
                        asks.set(Number(price), Number(size));
                }
                else if (message.type === "l2update") {
                    // Changes: [side, price, size]. A size of 0 removes the level
                    for (const [side, price, size] of message.changes) {
                        const book = side === "buy" ? bids : asks;
                        if (Number(size) === 0)
                            book.delete(Number(price));
                        else
                            book.set(Number(price), Number(size));
                    }
                }
            };
            socket.onerror = () => subscriber.error(new Error("Coinbase order-book connection failed"));
            // Four times a second, send the top of the book. isSnapshot: true replaces the ladder
            const timer = setInterval(() => {
                if (bids.size === 0 || asks.size === 0)
                    return;
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
    getBookSnapshot(symbol, depth) {
        return firstValueFrom(this.getBookStream(symbol, depth));
    }
    // No liquidity heatmap here: the depth panel only needs the book
    async getHeatmapAvailability() {
        return { enabled: false, tileColumns: 0, tiers: [] };
    }
    async getHeatmapTile() {
        return null;
    }
    getDepthStream() {
        return EMPTY;
    }
}
// The best `depth` levels of one side of the book, as { price, qty }
function topLevels(book, depth, order) {
    return [...book.keys()]
        .sort(order)
        .slice(0, depth)
        .map((price) => ({ price, qty: book.get(price) }));
}
// Register the order book source, once, at app startup, under its exchange's name. Order book
// studies and panels find it with getOrderBookSource(exchangeName)
setOrderBookSources(new Map([[CoinbaseExchange.name, new CoinbaseOrderBookSource()]]));
async function createChart() {
    // The depth panel, given the source registered for the chart's exchange
    const depth = MarketDepthPanel.create(document.getElementById("depth"), {
        source: getOrderBookSource(CoinbaseExchange.name),
        symbol: "BTC-USD",
    });
    // Read the book yourself: the top of the book, from the same registered source.
    // getBookStream(symbol, depth) emits the best `depth` levels of each side
    const topOfBook = document.getElementById("toolbar");
    Object.assign(topOfBook.style, toolbarStyle);
    const subscription = getOrderBookSource(CoinbaseExchange.name)
        .getBookStream("BTC-USD", 1)
        .subscribe(({ bids, asks }) => {
        const [bid, ask] = [bids[0], asks[0]];
        if (!bid || !ask)
            return;
        topOfBook.textContent =
            `Best bid ${bid.price.toLocaleString()} (${bid.qty.toFixed(4)})   ` +
                `Best ask ${ask.price.toLocaleString()} (${ask.qty.toFixed(4)})   Spread ${(ask.price - bid.price).toFixed(2)}`;
    });
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name,
        symbol: "BTC-USD",
        interval: CandleInterval.ONE_MINUTE,
        period: "1H",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    // When the page goes away: subscription.unsubscribe(); depth.destroy(); financeChartPanel.cleanup();
    return { financeChartPanel, depth, subscription };
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px 16px",
    padding: "8px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: "13px",
};
createChart();
