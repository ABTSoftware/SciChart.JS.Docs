import "scichart-scitrader/scitrader.css";
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

// Register the built-in connectors you use, once, at startup. The SDK registers none itself.
// idbPriceStore keeps downloaded candles in IndexedDB, so a reload draws from the cache.
defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// Each exchange names its markets in its own format
const SYMBOLS: Record<string, string> = {
    [BinanceExchange.name]: "BTCUSDT", // name="Binance" matches the built-in BinanceExchange
    [CoinbaseExchange.name]: "BTC-USD", // name="Coinbase" matches the built-in CoinbaseExchange
};

// <div id="toolbar"></div>
// <div id="chart" style="height: 600px"></div>
const container = document.getElementById("chart");
const toolbar = document.getElementById("toolbar");
let financeChartPanel: ISciFinanceChartPanelApi | undefined;

// A live chart: history over REST, then the latest candle updated tick by tick over the exchange's
// websocket. Note that Binance blocks some regions, including the US (HTTP 451).
async function showExchange(exchangeName: string) {
    // Clean up the old chart: this also closes its websocket
    financeChartPanel?.cleanup();
    financeChartPanel = await SciFinanceChartPanel.create(container, {
        exchangeName,
        symbol: SYMBOLS[exchangeName],
        interval: CandleInterval.ONE_MINUTE,
        period: "1H",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
}

for (const exchangeName of Object.keys(SYMBOLS)) {
    const button = document.createElement("button");
    button.textContent = `${exchangeName} · ${SYMBOLS[exchangeName]}`;
    button.onclick = () => showExchange(exchangeName);
    toolbar.appendChild(button);
}

await showExchange(BinanceExchange.name);
