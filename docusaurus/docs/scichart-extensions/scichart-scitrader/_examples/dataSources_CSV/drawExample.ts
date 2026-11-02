import {
    CandleInterval,
    createCSVServices,
    CSVExchange,
    ISciFinanceChartPanelApi,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

/**
 * Chart candles from a CSV file.
 *
 * `CSVExchange` is an exchange like Binance or Coinbase, except that its candles come from CSV
 * text you give it. The file here has one row per hour for three symbols:
 *
 * ```
 * symbol,time,open,high,low,close,volume
 * BTCUSDT,2026-07-01 12:00,58622.02,58676,58326,58538.01,1716.61
 * ```
 *
 * Columns are found by their usual names (`time`/`date`/`timestamp`, `open`/`o`, …), or map them
 * with `columns: { time: "Date", close: "Adj Close" }`. Times can be epoch seconds, epoch
 * milliseconds or dates, and are read as UTC.
 *
 * The exchange serves the file's own interval and every coarser interval that is made of whole
 * candles. This hourly file also serves 2h, 4h, 12h, 1d, 1w and 1M, resampled on first request.
 * The data is moved forward in time so its last candle is the current one. Pass
 * `alignToNow: false` to keep the file's own dates.
 */
export async function drawExample(
    container: HTMLElement
): Promise<{ panel: ISciFinanceChartPanelApi; exchange: CSVExchange; cleanup(): void }> {
    const exchange = await CSVExchange.fromUrl("data/crypto-1h.csv", { name: "MyCSV" });

    // Give the chart its own services, so this exchange stays private to this chart. To make it
    // available everywhere by name instead, call registerCSVExchange(defaultExchangeProvider, exchange).
    const { services } = createCSVServices(exchange);

    const panel = await SciFinanceChartPanel.create(container, {
        exchangeName: exchange.name,
        symbol: "SOLUSDT",
        interval: CandleInterval.TWO_HOURS,
        studies: [new OHLCStudy(), new VolumeStudy()],
        services,
    });

    return { panel, exchange, cleanup: () => panel.cleanup() };
}

/** CSV text works the same way as a URL, for data already in memory. */
export function exchangeFromText(): CSVExchange {
    const csv = [
        "Date,Open,High,Low,Close,Volume",
        "2024-01-01,100,104,99,103,1200",
        "2024-01-02,103,107,102,106,1350",
        "2024-01-03,106,106,101,102,1500",
    ].join("\n");
    return new CSVExchange({ csv, symbol: "DEMO" }, { name: "InlineCSV" });
}
