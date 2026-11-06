import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { EMPTY, map, Observable } from "rxjs";
import {
    CandleInterval,
    defaultExchangeProvider,
    ExchangeRestCandle,
    idbPriceStore,
    IListingDateResult,
    IRemoteExchange,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    SciTraderCandle,
    SciTraderTicker,
    SciTraderTrade,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// ---------------------------------------------------------------------------------------------
// The adapter: Kraken's public market data as an IRemoteExchange. No API key is needed.
// REST https://api.kraken.com/0/public/… for history, WebSocket v2 wss://ws.kraken.com/v2 for live data
// ---------------------------------------------------------------------------------------------

// Step 1. The intervals Kraken serves, and the length of each in minutes, Kraken's unit
const KRAKEN_MINUTES: Partial<Record<CandleInterval, number>> = {
    [CandleInterval.ONE_MINUTE]: 1,
    [CandleInterval.FIVE_MINUTES]: 5,
    [CandleInterval.FIFTEEN_MINUTES]: 15,
    [CandleInterval.THIRTY_MINUTES]: 30,
    [CandleInterval.ONE_HOUR]: 60,
    [CandleInterval.FOUR_HOURS]: 240,
    [CandleInterval.ONE_DAY]: 1440,
    [CandleInterval.ONE_WEEK]: 10080,
};

class KrakenExchange implements IRemoteExchange {
    // Step 2. The name charts ask for (exchangeName), and the most candles one request returns.
    // Kraken's OHLC endpoint returns only the latest 720 candles of each interval
    readonly name = "Kraken";
    candleLimit = 720;
    // Kraken's live OHLC channel sends the whole forming candle on every trade, so the chart
    // can draw it as it is, instead of rebuilding it from the trade stream
    readonly hasCompleteCandleStream = true;

    getSupportedIntervals(): CandleInterval[] {
        return Object.keys(KRAKEN_MINUTES) as CandleInterval[];
    }

    // Symbols in Kraken's WebSocket form, BASE/QUOTE. The REST API accepts the same names
    async getInstruments(): Promise<string[]> {
        return ["BTC/USD", "ETH/USD", "SOL/USD"];
    }

    // Step 3. Historical candles: those with start <= openTime <= end, oldest first, at most `limit`.
    // Times are in milliseconds. Kraken's are in seconds, with prices as strings
    async getCandles(
        symbol: string,
        interval: CandleInterval,
        start: number,
        end: number,
        limit: number,
        signal?: AbortSignal
    ): Promise<ExchangeRestCandle[]> {
        const minutes = KRAKEN_MINUTES[interval];
        if (!minutes) return []; // an interval Kraken doesn't serve
        const url = `https://api.kraken.com/0/public/OHLC?pair=${encodeURIComponent(symbol)}&interval=${minutes}`;
        const json = await (await fetch(url, { signal })).json();
        if (json.error?.length) throw new Error(`Kraken: ${json.error.join(", ")}`);
        // The result is keyed by pair name, next to a "last" cursor. Each row is
        // [time, open, high, low, close, vwap, volume, count]
        const pairKey = Object.keys(json.result).find((key) => key !== "last");
        const rows: Array<[number, string, string, string, string, string, string, number]> = json.result[pairKey] ?? [];
        return rows
            .map(([time, open, high, low, close, , volume, count]) => ({
                openTime: time * 1000,
                closeTime: time * 1000 + minutes * 60_000 - 1, // the last millisecond of the candle
                open,
                high,
                low,
                close,
                volume,
                trades: count,
            }))
            .filter((candle) => candle.openTime >= start && candle.openTime <= end)
            .slice(0, limit);
    }

    // Step 4. Where the history starts, so the chart stops panning back there. Kraken keeps only
    // the latest 720 candles, so the oldest of them is the start. Returning them as surplusCandles
    // lets the SDK cache them, which saves the next request
    async getListingDate(symbol: string, interval: CandleInterval, signal?: AbortSignal): Promise<IListingDateResult | null> {
        const candles = await this.getCandles(symbol, interval, 0, Date.now(), this.candleLimit, signal);
        return candles.length ? { openTime: candles[0].openTime, surplusCandles: candles } : null;
    }

    // Step 5. Live candles. Each must carry the symbol string that was asked for: Kraken echoes
    // BASE/QUOTE, the form we use, so it does
    getCandleStream(symbol: string | string[], interval: CandleInterval): Observable<SciTraderCandle> {
        const minutes = KRAKEN_MINUTES[interval];
        return krakenChannel<SciTraderCandle>("ohlc", { symbol: [symbol].flat(), interval: minutes, snapshot: false }, (bar) => {
            const startTime = Date.parse(bar.interval_begin);
            return {
                eventTime: Date.parse(bar.timestamp),
                symbol: bar.symbol,
                startTime,
                closeTime: startTime + minutes * 60_000 - 1,
                open: bar.open,
                high: bar.high,
                low: bar.low,
                close: bar.close,
                volume: bar.volume,
                trades: bar.trades,
                interval,
                buyVolume: 0, // not in Kraken's OHLC data
            };
        });
    }

    // Step 6. Live trades and tickers, for the studies and watchlists that use them
    getTradeStream(symbol: string): Observable<SciTraderTrade> {
        return krakenChannel<SciTraderTrade>("trade", { symbol: [symbol], snapshot: false }, (trade) => ({
            eventTime: Date.parse(trade.timestamp),
            symbol: trade.symbol,
            price: trade.price,
            quantity: trade.qty,
            maker: false,
            isBuyerMaker: trade.side === "sell", // Kraken reports the taker's side
            tradeId: trade.trade_id,
        }));
    }

    async getTrades(): Promise<SciTraderTrade[]> {
        return []; // no recent-trades history in this example
    }

    getTickerStream(symbol: string | string[]): Observable<SciTraderTicker> {
        return krakenChannel<SciTraderTicker>("ticker", { symbol: [symbol].flat() }, (t) => {
            const now = Date.now();
            return {
                eventTime: now,
                symbol: t.symbol,
                priceChange: t.change,
                priceChangePercent: t.change_pct,
                weightedAvg: t.vwap,
                prevDayClose: t.last - t.change,
                curDayClose: t.last,
                closeTradeQuantity: 0,
                open: t.last - t.change,
                high: t.high,
                low: t.low,
                volume: t.volume,
                volumeQuote: t.vwap * t.volume,
                openTime: now - 86_400_000,
                closeTime: now,
                totalTrades: t.trades,
            };
        });
    }

    getAllTickerStream(productIds: string[] = []): Observable<SciTraderTicker[]> {
        return productIds.length ? this.getTickerStream(productIds).pipe(map((ticker) => [ticker])) : EMPTY;
    }
}

// One Kraken WebSocket v2 subscription as an Observable: connect, subscribe to `channel`, and emit
// each item of each update. Unsubscribing closes the connection
function krakenChannel<T>(channel: string, params: object, toItem: (data: any) => T): Observable<T> {
    return new Observable<T>((subscriber) => {
        const socket = new WebSocket("wss://ws.kraken.com/v2");
        socket.onopen = () => socket.send(JSON.stringify({ method: "subscribe", params: { channel, ...params } }));
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.channel === channel && (message.type === "update" || message.type === "snapshot")) {
                message.data.forEach((item: any) => subscriber.next(toItem(item)));
            }
        };
        socket.onerror = () => subscriber.error(new Error(`Kraken ${channel} connection failed`));
        return () => socket.close();
    });
}

// ---------------------------------------------------------------------------------------------
// Using it in React: register it once, then chart it by name, like any built-in exchange
// ---------------------------------------------------------------------------------------------

// Step 7. Register the exchange with a candle store. idbPriceStore keeps the candles in IndexedDB,
// so history builds up past Kraken's 720 candles as the user comes back
const kraken = new KrakenExchange();
defaultExchangeProvider.registerExchange(kraken, idbPriceStore);
const SYMBOLS = ["BTC/USD", "ETH/USD", "SOL/USD"];

export function KrakenChart() {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    const [symbol, setSymbol] = React.useState("BTC/USD");
    const [interval, setInterval] = React.useState(CandleInterval.ONE_HOUR);
    const [ticker, setTicker] = React.useState<SciTraderTicker>();

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: kraken.name,
            symbol: "BTC/USD",
            interval: CandleInterval.ONE_HOUR,
            period: "1W",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    // A live price from the adapter's ticker, through the registered client
    React.useEffect(() => {
        const subscription = defaultExchangeProvider.getExchange(kraken.name).getTickerStream(symbol).subscribe(setTicker);
        return () => subscription.unsubscribe();
    }, [symbol]);

    // financeApi throws until the chart has initialised
    const chart = () => (chartRef.current?.isInitialized ? chartRef.current.financeApi : undefined);

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                <ButtonGroup
                    values={SYMBOLS}
                    selected={symbol}
                    onSelect={(s) => {
                        setSymbol(s);
                        chart()?.setSymbol(s);
                    }}
                />
                <ButtonGroup
                    values={kraken.getSupportedIntervals()}
                    selected={interval}
                    onSelect={(i) => {
                        setInterval(i);
                        chart()?.changeInterval(i);
                    }}
                />
                {ticker && (
                    <span>{`${ticker.symbol} ${ticker.curDayClose.toLocaleString()} (${ticker.priceChangePercent.toFixed(2)}% 24h)`}</span>
                )}
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <SciFinanceChartView ref={chartRef} config={config} />
            </div>
        </div>
    );
}

// A row of toggle buttons: one per value, the selected one highlighted
function ButtonGroup<T extends string>(props: { values: readonly T[]; selected: T; onSelect: (v: T) => void }) {
    return (
        <div style={{ display: "flex", gap: 4 }}>
            {props.values.map((value) => (
                <button key={value} style={buttonStyle(value === props.selected)} onClick={() => props.onSelect(value)}>
                    {value}
                </button>
            ))}
        </div>
    );
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px 16px",
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: 13,
};
const buttonStyle = (active = false): React.CSSProperties => ({
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: active ? "var(--st-ui-selection, #6c63ff)" : "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
});
