import "scichart-scitrader/scitrader.css";
import * as React from "react";
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
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    TMarketDepthSettings,
    VolumeStudy,
} from "scichart-scitrader";
import { MarketDepthView, SciFinanceChartView } from "scichart-scitrader-react";

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

export function ChartWithMarketDepth() {
    // One source for the lifetime of the component: changing `source` creates a new panel
    const source = React.useMemo(() => new CoinbaseOrderBookSource(), []);
    // The panel's settings, e.g. the price grouping its ± stepper changes. Persist them if you like
    const [settings, setSettings] = React.useState<TMarketDepthSettings>(DEFAULT_MARKET_DEPTH_SETTINGS);

    // One-minute candles over the last hour: the first load is a single request of at most
    // 300 candles, Coinbase's limit per request
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.ONE_MINUTE,
            period: "1H",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <SciFinanceChartView config={config} />
            </div>
            <div style={{ width: 340 }}>
                <MarketDepthView
                    source={source}
                    symbol="BTC-USD" // Coinbase's symbol format
                    settings={settings}
                    onSettingsChange={setSettings}
                />
            </div>
        </div>
    );
}
