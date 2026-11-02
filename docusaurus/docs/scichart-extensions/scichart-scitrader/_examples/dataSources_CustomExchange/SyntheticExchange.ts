import { EMPTY, Observable } from "rxjs";
import {
    CandleInterval,
    ExchangeRestCandle,
    IListingDateResult,
    intervalToTimeSpan,
    IRemoteExchange,
    SciTraderCandle,
    SciTraderTicker,
    SciTraderTrade,
} from "scichart-scitrader";

/**
 * A complete custom exchange: prices from a formula instead of a server.
 *
 * Implementing `IRemoteExchange` is all it takes to chart any data source. The SDK wraps the
 * exchange in its own client, which adds caching, paging back through history and the listing-date
 * floor, so an adapter only answers simple questions:
 *
 * - `getCandles`: candles in a time range. The only method a historical chart needs.
 * - `getCandleStream`: live updates to the current candle, for a chart that ticks.
 * - `getSupportedIntervals`, `getInstruments`, `getListingDate`: what can be asked for.
 * - trades and tickers: for the trade and watchlist features. Return empty if you have none.
 *
 * Price at time t is a fixed function of t, so any range of candles can be generated
 * independently and always joins up with its neighbours.
 */
export class SyntheticExchange implements IRemoteExchange {
    public readonly name = "Synthetic";
    /** Most candles returned by one `getCandles` call; the SDK pages longer ranges in chunks this size. */
    public candleLimit = 1000;
    /** `getCandleStream` emits the whole current candle each tick, so the SDK needn't rebuild it from trades. */
    public readonly hasCompleteCandleStream = true;

    private static readonly SYMBOLS: Record<string, number> = { ALPHA: 100, BETA: 40 };
    private static readonly INTERVALS = [
        CandleInterval.ONE_MINUTE,
        CandleInterval.FIVE_MINUTES,
        CandleInterval.FIFTEEN_MINUTES,
        CandleInterval.ONE_HOUR,
        CandleInterval.FOUR_HOURS,
        CandleInterval.ONE_DAY,
    ];
    /** History starts here. `getListingDate` reports it, so the chart stops panning back at it. */
    private static readonly LISTED = Date.UTC(2024, 0, 1);

    public async getInstruments(): Promise<string[]> {
        return Object.keys(SyntheticExchange.SYMBOLS);
    }

    public getSupportedIntervals(): CandleInterval[] {
        return SyntheticExchange.INTERVALS;
    }

    public async getListingDate(): Promise<IListingDateResult | null> {
        return { openTime: SyntheticExchange.LISTED };
    }

    /** Candles with `start <= openTime <= end`, oldest first, at most `limit` of them from `start`. */
    public async getCandles(
        symbol: string,
        interval: CandleInterval,
        start: number,
        end: number,
        limit: number
    ): Promise<ExchangeRestCandle[]> {
        const span = intervalToTimeSpan(interval);
        const first = Math.max(Math.ceil(start / span) * span, SyntheticExchange.LISTED);
        const last = Math.min(end, Date.now());
        const candles: ExchangeRestCandle[] = [];
        for (let t = first; t <= last && candles.length < limit; t += span) {
            candles.push(this.candleAt(symbol, t, span, Math.min(t + span, Date.now())));
        }
        return candles;
    }

    /** The forming candle, re-emitted every half second with the latest price. */
    public getCandleStream(symbol: string | string[], interval: CandleInterval): Observable<SciTraderCandle> {
        const symbols = Array.isArray(symbol) ? symbol : [symbol];
        const span = intervalToTimeSpan(interval);
        return new Observable<SciTraderCandle>((subscriber) => {
            const tick = () => {
                const now = Date.now();
                const openTime = Math.floor(now / span) * span;
                for (const s of symbols) {
                    const c = this.candleAt(s, openTime, span, now);
                    subscriber.next({
                        eventTime: now,
                        // Echo the symbol exactly as it was asked for.
                        symbol: s,
                        startTime: c.openTime,
                        closeTime: c.closeTime,
                        open: Number(c.open),
                        high: Number(c.high),
                        low: Number(c.low),
                        close: Number(c.close),
                        volume: Number(c.volume),
                        trades: 0,
                        interval,
                        buyVolume: 0,
                    });
                }
            };
            tick();
            const timer = setInterval(tick, 500);
            // Returned teardown runs when the chart unsubscribes.
            return () => clearInterval(timer);
        });
    }

    // No trades or tickers in this source.
    public async getTrades(): Promise<SciTraderTrade[]> {
        return [];
    }
    public getTradeStream(): Observable<SciTraderTrade> {
        return EMPTY;
    }
    public getTickerStream(): Observable<SciTraderTicker> {
        return EMPTY;
    }
    public getAllTickerStream(): Observable<SciTraderTicker[]> {
        return EMPTY;
    }

    /** OHLC from sampling the price function across the candle, up to `until` for the forming one. */
    private candleAt(symbol: string, openTime: number, span: number, until: number): ExchangeRestCandle {
        const base = SyntheticExchange.SYMBOLS[symbol] ?? 50;
        const steps = 24;
        const close = until > openTime ? until - 1 : openTime;
        let high = -Infinity;
        let low = Infinity;
        for (let i = 0; i <= steps; i++) {
            const p = price(base, openTime + ((close - openTime) * i) / steps);
            high = Math.max(high, p);
            low = Math.min(low, p);
        }
        const open = price(base, openTime);
        const last = price(base, close);
        return {
            openTime,
            open: open.toFixed(2),
            high: high.toFixed(2),
            low: low.toFixed(2),
            close: last.toFixed(2),
            volume: (100 + 900 * smoothNoise(openTime / 180_000) ** 2).toFixed(0),
            closeTime: openTime + span - 1,
            trades: 0,
        };
    }
}

/**
 * A slow trend, a faster wiggle and smooth noise. Every term is continuous in t, so each candle
 * opens where the previous one closed, and the same t always gives the same price.
 */
function price(base: number, t: number): number {
    const days = t / 86_400_000;
    const trend = 0.25 * Math.sin(days / 40) + 0.1 * Math.sin(days / 7);
    const wiggle = 0.01 * Math.sin(t / 3_600_000);
    const noise = 0.006 * (smoothNoise(t / 300_000) - 0.5) + 0.002 * (smoothNoise(t / 8_000) - 0.5);
    return base * Math.exp(trend + wiggle + noise);
}

/** Value noise: random values at whole numbers, eased between them. */
function smoothNoise(x: number): number {
    const i = Math.floor(x);
    const f = x - i;
    const eased = f * f * (3 - 2 * f);
    return hash(i) + (hash(i + 1) - hash(i)) * eased;
}

function hash(n: number): number {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
}
