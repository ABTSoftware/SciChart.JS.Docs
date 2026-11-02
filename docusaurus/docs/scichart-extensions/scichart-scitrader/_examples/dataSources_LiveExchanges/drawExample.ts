import {
    BinanceExchange,
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

export type TLiveExchange = "Binance" | "Coinbase";

/**
 * Register the built-in exchange connectors. Do this once, at startup, before creating a chart.
 * Each exchange is registered with a candle store; `idbPriceStore` keeps downloaded candles in
 * IndexedDB, so a reload draws from the cache and only fetches what is new.
 *
 * The SDK registers nothing itself. Register only the exchanges your app uses.
 */
export function registerExchanges(): void {
    if (!defaultExchangeProvider.getExchange(BinanceExchange.name)) {
        defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);
    }
    if (!defaultExchangeProvider.getExchange(CoinbaseExchange.name)) {
        defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
    }
}

/** Each exchange names its markets in its own format. */
export const SYMBOLS: Record<TLiveExchange, string> = {
    Binance: "BTCUSDT",
    Coinbase: "BTC-USD",
};

/**
 * A live chart: history over REST, then the latest candle updated tick by tick over the
 * exchange's websocket. Binance blocks some regions, including the US (HTTP 451).
 */
export async function drawExample(container: HTMLElement, exchange: TLiveExchange): Promise<ISciFinanceChartPanelApi> {
    registerExchanges();

    return SciFinanceChartPanel.create(container, {
        exchangeName: exchange,
        symbol: SYMBOLS[exchange],
        interval: CandleInterval.ONE_MINUTE,
        period: "1H",
        lockPeriodWidth: false,
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
}
