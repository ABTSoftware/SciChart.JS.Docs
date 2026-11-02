import { EMPTY, Observable } from "rxjs";
import {
    CandleInterval,
    ExchangeRestCandle,
    IBookSnapshot,
    IBookUpdate,
    IDepthColumn,
    IHeatmapAvailability,
    IHeatmapTierInfo,
    IHeatmapTile,
    IListingDateResult,
    intervalToTimeSpan,
    IOrderBookSource,
    IRemoteExchange,
    SciTraderCandle,
    SciTraderTicker,
    SciTraderTrade,
} from "scichart-scitrader";

/**
 * A randomised market, standing in for a real exchange so this sample runs offline: several
 * symbols, every interval from 1m to 1w, a live forming candle, live tickers, and a level-2 order
 * book (for market depth, the order-book heatmap and book imbalance).
 *
 * Nothing is stored. Price, volume and book depth are fixed functions of time and symbol, so any
 * range of candles or heatmap tiles can be generated on request and always agrees with its
 * neighbours and with the live streams.
 *
 * To chart a real order book, implement IOrderBookSource against your own feed, the way
 * DummyOrderBookSource does below.
 */
export const DUMMY_EXCHANGE = "Dummy";

/** Symbol → starting price. */
export const DUMMY_SYMBOLS: Record<string, number> = {
    ALPHAUSD: 120,
    BETAUSD: 42,
    GAMMAUSD: 2650,
    DELTAUSD: 8.4,
    EPSILONUSD: 0.62,
};

const LISTED = Date.UTC(2024, 0, 1);
const INTERVALS = [
    CandleInterval.ONE_MINUTE,
    CandleInterval.FIVE_MINUTES,
    CandleInterval.FIFTEEN_MINUTES,
    CandleInterval.THIRTY_MINUTES,
    CandleInterval.ONE_HOUR,
    CandleInterval.FOUR_HOURS,
    CandleInterval.ONE_DAY,
    CandleInterval.ONE_WEEK,
];

export class DummyDataExchange implements IRemoteExchange {
    public readonly name = DUMMY_EXCHANGE;
    public candleLimit = 1000;
    public readonly hasCompleteCandleStream = true;

    public async getInstruments(): Promise<string[]> {
        return Object.keys(DUMMY_SYMBOLS);
    }

    public getSupportedIntervals(): CandleInterval[] {
        return INTERVALS;
    }

    public async getListingDate(): Promise<IListingDateResult | null> {
        return { openTime: LISTED };
    }

    public async getCandles(
        symbol: string,
        interval: CandleInterval,
        start: number,
        end: number,
        limit: number
    ): Promise<ExchangeRestCandle[]> {
        if (!(symbol in DUMMY_SYMBOLS)) {
            return [];
        }
        const span = intervalToTimeSpan(interval);
        const now = Date.now();
        const first = Math.max(Math.ceil((start || 0) / span) * span, LISTED);
        const last = Math.min(end || now, now);
        const out: ExchangeRestCandle[] = [];
        for (let t = first; t <= last && out.length < (limit || this.candleLimit); t += span) {
            out.push(candle(symbol, t, span, Math.min(t + span, now)));
        }
        return out;
    }

    public getCandleStream(symbol: string | string[], interval: CandleInterval): Observable<SciTraderCandle> {
        const symbols = Array.isArray(symbol) ? symbol : [symbol];
        const span = intervalToTimeSpan(interval);
        return new Observable<SciTraderCandle>((subscriber) => {
            const tick = () => {
                const now = Date.now();
                const openTime = Math.floor(now / span) * span;
                for (const s of symbols.filter((x) => x in DUMMY_SYMBOLS)) {
                    const c = candle(s, openTime, span, now);
                    subscriber.next({
                        eventTime: now,
                        symbol: s,
                        startTime: c.openTime,
                        closeTime: c.closeTime,
                        open: +c.open,
                        high: +c.high,
                        low: +c.low,
                        close: +c.close,
                        volume: +c.volume,
                        trades: 0,
                        interval,
                        buyVolume: 0,
                    });
                }
            };
            tick();
            const timer = setInterval(tick, 500);
            return () => clearInterval(timer);
        });
    }

    public getTickerStream(symbol: string | string[]): Observable<SciTraderTicker> {
        const symbols = Array.isArray(symbol) ? symbol : [symbol];
        return new Observable<SciTraderTicker>((subscriber) => {
            const tick = () => symbols.filter((s) => s in DUMMY_SYMBOLS).forEach((s) => subscriber.next(ticker(s)));
            tick();
            const timer = setInterval(tick, 1000);
            return () => clearInterval(timer);
        });
    }

    public getAllTickerStream(productIds?: string[]): Observable<SciTraderTicker[]> {
        const symbols = productIds ?? Object.keys(DUMMY_SYMBOLS);
        return new Observable<SciTraderTicker[]>((subscriber) => {
            const tick = () => subscriber.next(symbols.filter((s) => s in DUMMY_SYMBOLS).map(ticker));
            tick();
            const timer = setInterval(tick, 1000);
            return () => clearInterval(timer);
        });
    }

    public async getTrades(): Promise<SciTraderTrade[]> {
        return [];
    }

    public getTradeStream(): Observable<SciTraderTrade> {
        return EMPTY;
    }
}

/**
 * A level-2 book around the dummy price: bids below, asks above, depth thinning away from the
 * mid, with a few larger "walls" that come and go.
 */
export class DummyOrderBookSource implements IOrderBookSource {
    public readonly exchangeName = DUMMY_EXCHANGE;
    private static readonly TILE_COLUMNS = 240;
    private static readonly LEVELS = 60;
    /** Tiers of the heatmap and how far back each is "recorded". */
    private static readonly TIERS: Array<{ bucket: string; bucketMs: number; historyMs: number }> = [
        { bucket: "1s", bucketMs: 1_000, historyMs: 2 * 3_600_000 },
        { bucket: "1m", bucketMs: 60_000, historyMs: 3 * 86_400_000 },
        { bucket: "15m", bucketMs: 900_000, historyMs: 60 * 86_400_000 },
        { bucket: "4h", bucketMs: 14_400_000, historyMs: 365 * 86_400_000 },
    ];

    public async getBookSnapshot(symbol: string, depth = 100): Promise<IBookSnapshot | null> {
        return symbol in DUMMY_SYMBOLS
            ? bookAt(symbol, Date.now(), Math.min(depth, DummyOrderBookSource.LEVELS))
            : null;
    }

    public getBookStream(symbol: string, depth = 100): Observable<IBookUpdate> {
        return new Observable<IBookUpdate>((subscriber) => {
            const tick = () =>
                subscriber.next({
                    ...bookAt(symbol, Date.now(), Math.min(depth, DummyOrderBookSource.LEVELS)),
                    isSnapshot: true,
                });
            tick();
            const timer = setInterval(tick, 250);
            return () => clearInterval(timer);
        });
    }

    public async getHeatmapAvailability(): Promise<IHeatmapAvailability> {
        const now = Date.now();
        const tiers: IHeatmapTierInfo[] = DummyOrderBookSource.TIERS.map(({ bucket, bucketMs, historyMs }) => ({
            bucket,
            bucketMs,
            from: Math.max(LISTED, Math.floor((now - historyMs) / bucketMs) * bucketMs),
            to: now,
        }));
        return { enabled: true, tileColumns: DummyOrderBookSource.TILE_COLUMNS, tiers };
    }

    public async getHeatmapTile(symbol: string, bucket: string, tile: number): Promise<IHeatmapTile | null> {
        const tier = DummyOrderBookSource.TIERS.find((t) => t.bucket === bucket);
        if (!tier || !(symbol in DUMMY_SYMBOLS)) {
            return null;
        }
        const columns = DummyOrderBookSource.TILE_COLUMNS;
        const start = tile * columns * tier.bucketMs;
        const now = Date.now();
        const base = price(symbol, start);
        const step = niceStep(base * 0.001);
        const levels = DummyOrderBookSource.LEVELS;
        // Price range of the tile, padded by the book's depth either side.
        let lo = Infinity;
        let hi = -Infinity;
        for (let c = 0; c < columns; c++) {
            const p = price(symbol, start + c * tier.bucketMs);
            lo = Math.min(lo, p);
            hi = Math.max(hi, p);
        }
        const priceMin = Math.floor((lo - levels * step) / step) * step;
        const rows = Math.ceil((hi + levels * step - priceMin) / step) + 1;
        const out: IHeatmapTile = {
            bucket,
            bucketMs: tier.bucketMs,
            tile,
            start,
            columns,
            complete: start + columns * tier.bucketMs <= now,
            priceMin,
            step,
            rows,
            col: [],
            row: [],
            bid: [],
            ask: [],
        };
        for (let c = 0; c < columns; c++) {
            const t = start + c * tier.bucketMs;
            if (t > now || t < LISTED) {
                continue;
            }
            const mid = price(symbol, t);
            const midRow = Math.round((mid - priceMin) / step);
            for (let d = 1; d <= levels; d++) {
                const bid = depthAt(symbol, midRow - d, t, d, tier.bucketMs);
                const ask = depthAt(symbol, midRow + d, t, d, tier.bucketMs);
                out.col.push(c, c);
                out.row.push(midRow - d, midRow + d);
                out.bid.push(bid, 0);
                out.ask.push(0, ask);
            }
        }
        return out;
    }

    public getDepthStream(symbol: string, bucket: string): Observable<IDepthColumn> {
        const tier = DummyOrderBookSource.TIERS.find((t) => t.bucket === bucket);
        if (!tier) {
            return EMPTY;
        }
        return new Observable<IDepthColumn>((subscriber) => {
            const tick = () => {
                const now = Date.now();
                const bucketStart = Math.floor(now / tier.bucketMs) * tier.bucketMs;
                const mid = price(symbol, now);
                const step = niceStep(
                    price(
                        symbol,
                        Math.floor(bucketStart / (DummyOrderBookSource.TILE_COLUMNS * tier.bucketMs)) *
                            DummyOrderBookSource.TILE_COLUMNS *
                            tier.bucketMs
                    ) * 0.001
                );
                const midRow = Math.round(mid / step);
                const column: IDepthColumn = {
                    symbol,
                    bucket,
                    bucketStart,
                    provisional: true,
                    step,
                    price: [],
                    bid: [],
                    ask: [],
                };
                for (let d = 1; d <= DummyOrderBookSource.LEVELS; d++) {
                    column.price.push((midRow - d) * step, (midRow + d) * step);
                    column.bid.push(depthAt(symbol, midRow - d, bucketStart, d, tier.bucketMs), 0);
                    column.ask.push(0, depthAt(symbol, midRow + d, bucketStart, d, tier.bucketMs));
                }
                subscriber.next(column);
            };
            tick();
            const timer = setInterval(tick, 1000);
            return () => clearInterval(timer);
        });
    }
}

// ----- the market model -----------------------------------------------------------------

function seed(symbol: string): number {
    let h = 0;
    for (let i = 0; i < symbol.length; i++) h = (h * 31 + symbol.charCodeAt(i)) | 0;
    return (Math.abs(h) % 1000) / 1000;
}

/** Price at time t: a slow trend, a daily wiggle and smooth noise, all continuous in t. */
function price(symbol: string, t: number): number {
    const s = seed(symbol) * 100;
    const days = t / 86_400_000;
    const trend = 0.3 * Math.sin(days / 45 + s) + 0.12 * Math.sin(days / 9 + 2 * s);
    const wiggle = 0.015 * Math.sin(t / 3_600_000 + s);
    const noise = 0.008 * (smoothNoise(t / 300_000 + s * 1e3) - 0.5) + 0.003 * (smoothNoise(t / 8_000 + s * 1e4) - 0.5);
    return DUMMY_SYMBOLS[symbol] * Math.exp(trend + wiggle + noise);
}

function candle(symbol: string, openTime: number, span: number, until: number): ExchangeRestCandle {
    const close = until > openTime ? until - 1 : openTime;
    let high = -Infinity;
    let low = Infinity;
    for (let i = 0; i <= 24; i++) {
        const p = price(symbol, openTime + ((close - openTime) * i) / 24);
        high = Math.max(high, p);
        low = Math.min(low, p);
    }
    const dp = decimals(DUMMY_SYMBOLS[symbol]);
    const volume = (span / 60_000) * (50 + 400 * smoothNoise(openTime / 1_800_000 + seed(symbol) * 50) ** 2);
    return {
        openTime,
        open: price(symbol, openTime).toFixed(dp),
        high: high.toFixed(dp),
        low: low.toFixed(dp),
        close: price(symbol, close).toFixed(dp),
        volume: volume.toFixed(2),
        closeTime: openTime + span - 1,
        trades: 0,
    };
}

function ticker(symbol: string): SciTraderTicker {
    const now = Date.now();
    // Rounded as an exchange would quote them.
    const dp = decimals(DUMMY_SYMBOLS[symbol]);
    const close = +price(symbol, now).toFixed(dp);
    const open = +price(symbol, now - 86_400_000).toFixed(dp);
    return {
        eventTime: now,
        symbol,
        priceChange: +(close - open).toFixed(dp),
        priceChangePercent: +(((close - open) / open) * 100).toFixed(2),
        weightedAvg: (close + open) / 2,
        prevDayClose: open,
        curDayClose: close,
        closeTradeQuantity: 0,
        open,
        high: Math.max(open, close) * 1.01,
        low: Math.min(open, close) * 0.99,
        volume: 100_000,
        volumeQuote: 100_000 * close,
        openTime: now - 86_400_000,
        closeTime: now,
        totalTrades: 0,
    };
}

function bookAt(symbol: string, t: number, depth: number): IBookSnapshot {
    const mid = price(symbol, t);
    const step = niceStep(mid * 0.0005);
    const midRow = Math.round(mid / step);
    const bids = [];
    const asks = [];
    for (let d = 1; d <= depth; d++) {
        bids.push({ price: (midRow - d) * step, qty: depthAt(symbol, midRow - d, t, d, 250) });
        asks.push({ price: (midRow + d) * step, qty: depthAt(symbol, midRow + d, t, d, 250) });
    }
    return { symbol, timestamp: t, bids, asks };
}

/** Resting size at a price row: thinning with distance from the mid, noisy, with occasional walls. */
function depthAt(symbol: string, row: number, t: number, distance: number, bucketMs: number): number {
    const s = seed(symbol) * 997;
    const slot = Math.floor(t / Math.max(bucketMs, 30_000));
    const base = 20 * Math.exp(-distance / 25) + 3;
    const jitter = 0.6 + 0.8 * hash(row * 7.1 + slot * 0.37 + s);
    const wall = hash(row * 13.7 + Math.floor(t / 600_000) + s) > 0.97 ? 8 : 1;
    return +(base * jitter * wall).toFixed(3);
}

function niceStep(raw: number): number {
    const exp = Math.pow(10, Math.floor(Math.log10(raw)));
    const m = raw / exp;
    return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * exp;
}

function decimals(p: number): number {
    return p >= 1000 ? 2 : p >= 10 ? 3 : p >= 1 ? 4 : 5;
}

function smoothNoise(x: number): number {
    const i = Math.floor(x);
    const f = x - i;
    const e = f * f * (3 - 2 * f);
    return hash(i) + (hash(i + 1) - hash(i)) * e;
}

function hash(n: number): number {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
}
