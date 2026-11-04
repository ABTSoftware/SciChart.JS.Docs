import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    formatSymbolPair,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    SPARKLINE_INTERVAL,
    SPARKLINE_WINDOW_CANDLES,
    SparkLineChart,
    TWatchListRowData,
    VolumeStudy,
    WatchListDataManager,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; height: 100%">
//     <div id="chart" style="flex: 1; min-width: 0"></div>
//     <div id="watchlist" style="width: 360px"></div>
// </div>

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

const EXCHANGE = CoinbaseExchange.name; // name="Coinbase" matches the built-in CoinbaseExchange
const SYMBOLS = ["BTC-USD", "ETH-USD", "SOL-USD", "XRP-USD", "DOGE-USD"]; // Coinbase's symbol format

async function createWatchlist() {
    const list = document.getElementById("watchlist");
    Object.assign(list.style, listStyle);

    // The chart: clicking a row in the watchlist charts that symbol. Create it without waiting,
    // so the watchlist fills in while the chart loads
    const chartReady = SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: EXCHANGE,
        symbol: SYMBOLS[0],
        interval: CandleInterval.FIFTEEN_MINUTES,
        period: "1D", // the last day, like the sparklines
        studies: [new OHLCStudy(), new VolumeStudy()],
    });

    // One row per symbol: the pair, a <div> for the sparkline, the last price and the 24-hour change
    const rows = new Map<string, { row: HTMLElement; price: HTMLElement; change: HTMLElement }>();
    const sparkHosts = new Map<string, HTMLDivElement>();
    for (const symbol of SYMBOLS) {
        const row = document.createElement("div");
        Object.assign(row.style, rowStyle(symbol === SYMBOLS[0]));
        row.onclick = async () => {
            rows.forEach((r, s) => Object.assign(r.row.style, rowStyle(s === symbol)));
            (await chartReady).financeApi.setSymbol(symbol);
        };
        const pair = document.createElement("span");
        pair.textContent = formatSymbolPair(symbol, EXCHANGE); // "BTC-USD" -> "BTC/USD"
        Object.assign(pair.style, { width: "78px", fontWeight: "600" });
        const spark = document.createElement("div");
        Object.assign(spark.style, { flex: "1", height: "36px", minWidth: "0" });
        const prices = document.createElement("div");
        Object.assign(prices.style, { width: "80px", textAlign: "right" });
        const price = document.createElement("div");
        price.textContent = "–";
        const change = document.createElement("div");
        Object.assign(change.style, { fontSize: "12px" });
        prices.append(price, change);
        row.append(pair, spark, prices);
        list.appendChild(row);
        rows.set(symbol, { row, price, change });
        sparkHosts.set(symbol, spark);
    }

    // WatchListDataManager streams each symbol's last price and 24-hour change from the exchange's
    // tickers, through onDataUpdate. It also fetches the sparkline candles for every symbol over one
    // shared stream, so the whole list makes one connection rather than one per row
    const manager = new WatchListDataManager({
        exchangeName: EXCHANGE,
        onDataUpdate: (data: TWatchListRowData[]) => {
            for (const item of data) {
                const row = rows.get(item.symbol);
                if (!row) continue;
                const up = item.changePC >= 0;
                row.price.textContent = formatPrice(item.last);
                row.change.textContent = `${up ? "+" : ""}${item.changePC.toFixed(2)}%`;
                row.change.style.color = up ? "var(--st-market-bid, #2ebd85)" : "var(--st-market-ask, #f6465d)";
            }
        },
    });
    await manager.createFeeds(SYMBOLS);

    // SparkLineChart.createSpark draws a live sparkline into any <div>. Give it the manager's
    // prefetched candles and live stream, so it makes no requests of its own
    const surfaces = await Promise.all(
        SYMBOLS.map(async (symbol) => {
            const prefetched = await manager.getSparklineData(symbol);
            const { sciChartSurface } = await SparkLineChart.createSpark(sparkHosts.get(symbol), {
                exchangeName: EXCHANGE,
                instrument: symbol,
                interval: SPARKLINE_INTERVAL, // the SDK's sparkline candle size
                candles: SPARKLINE_WINDOW_CANDLES, // how many candles a sparkline shows
                prefetchedCandles: prefetched?.candles,
                candleStream$: prefetched?.candleStream$,
            });
            return sciChartSurface;
        })
    );

    // When the page goes away:
    // surfaces.forEach((s) => s.delete()); manager.delete(); (await chartReady).cleanup();
    return { manager, surfaces, chartReady };
}

// More decimals for small prices: 0.0812 rather than 0.08
function formatPrice(price: number) {
    return price.toFixed(price < 10 ? 4 : 2);
}

// The list uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const listStyle: Partial<CSSStyleDeclaration> = {
    height: "100%",
    overflowY: "auto",
    boxSizing: "border-box",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text, #ffffff)",
    fontFamily: "var(--st-font-family, sans-serif)",
    fontSize: "13px",
};

const rowStyle = (active: boolean): Partial<CSSStyleDeclaration> => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 12px",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    background: active ? "var(--st-ui-surface, #373447)" : "transparent",
    cursor: "pointer",
});

createWatchlist();
