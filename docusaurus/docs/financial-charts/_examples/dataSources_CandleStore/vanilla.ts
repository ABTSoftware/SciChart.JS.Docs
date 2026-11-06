import "scichart-scitrader/scitrader.css";
import {
    CandleInterval,
    CoinbaseExchange,
    createExchangeProvider,
    DataFeedManager,
    ExchangeRestCandle,
    ICandleStore,
    idbPriceStore,
    OHLCStudy,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//         <pre id="store-log" style="width: 340px"></pre>
//     </div>
// </div>

// A candle store that logs what the SDK asks of it, and passes each call to idbPriceStore, the
// built-in IndexedDB store. Every ICandleStore call says which exchange, symbol and interval it is for
class LoggingCandleStore implements ICandleStore {
    constructor(private readonly log: (line: string) => void) {}

    // The cache asks the store first: candles it has for the requested range
    async getCandles(exchange: string, symbol: string, interval: CandleInterval, start?: number, end?: number) {
        const candles = await idbPriceStore.getCandles(exchange, symbol, interval, start, end);
        this.log(`read   ${symbol} ${interval}: ${candles.length} cached candles`);
        return candles;
    }

    // Then it fetches what was missing from the exchange, and stores it here
    async insertCandles(exchange: string, symbol: string, interval: CandleInterval, candles: ExchangeRestCandle[]) {
        this.log(`write  ${symbol} ${interval}: ${candles.length} candles from ${exchange}`);
        return idbPriceStore.insertCandles(exchange, symbol, interval, candles);
    }

    // Where the exchange's history starts, once found, so it isn't asked for again
    getEarliestCandleTime(exchange: string, symbol: string, interval: CandleInterval) {
        return idbPriceStore.getEarliestCandleTime(exchange, symbol, interval);
    }
    setEarliestCandleTime(exchange: string, symbol: string, interval: CandleInterval, time: number) {
        this.log(`floor  ${symbol} ${interval}: history starts ${new Date(time).toISOString().slice(0, 10)}`);
        return idbPriceStore.setEarliestCandleTime(exchange, symbol, interval, time);
    }

    // Optional: time spans with no candles, so they aren't asked for again
    getKnownEmptyRanges(exchange: string, symbol: string, interval: CandleInterval) {
        return idbPriceStore.getKnownEmptyRanges(exchange, symbol, interval);
    }
    setKnownEmptyRanges(exchange: string, symbol: string, interval: CandleInterval, ranges: Array<{ start: number; end: number }>) {
        return idbPriceStore.setKnownEmptyRanges(exchange, symbol, interval, ranges);
    }

    // Optional: tells the cache when old candles are deleted to keep the store's size down
    subscribeToEvictions(callback: () => void) {
        return idbPriceStore.subscribeToEvictions(callback);
    }
}

async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    const logPanel = document.getElementById("store-log");
    Object.assign(logPanel.style, logStyle);
    const log = (line: string) => (logPanel.textContent = `${new Date().toLocaleTimeString()} ${line}\n` + logPanel.textContent);

    // Register Coinbase with the logging store, in a provider of this chart's own
    const provider = createExchangeProvider();
    provider.registerExchange(CoinbaseExchange, new LoggingCandleStore(log));

    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name,
        symbol: "BTC-USD",
        interval: CandleInterval.ONE_HOUR,
        period: "1W",
        services: { dataFeedManager: new DataFeedManager(provider) }, // the chart's data comes from `provider`
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi;

    // Change interval and back: the second time, the candles come from the store.
    // Reload the page: they come from IndexedDB
    toolbar.append(
        buttonGroup(CoinbaseExchange.getSupportedIntervals(), (i) => i, CandleInterval.ONE_HOUR, (interval) =>
            chart.changeInterval(interval)
        ),
        // clearAll deletes every candle in IndexedDB. The next load fetches everything again
        buttonGroup(["Clear the cache"], (s) => s, "", async () => {
            await idbPriceStore.clearAll();
            log("cleared IndexedDB");
        })
    );

    // When the page goes away: financeChartPanel.cleanup();
    return financeChartPanel;
}

// A row of toggle buttons: one per value, the selected one highlighted
function buttonGroup<T>(values: readonly T[], label: (v: T) => string, selected: T, onSelect: (v: T) => void) {
    const group = document.createElement("div");
    Object.assign(group.style, { display: "flex", gap: "4px" });
    const render = (current: T) =>
        group.replaceChildren(
            ...values.map((value) => {
                const b = document.createElement("button");
                b.textContent = label(value);
                Object.assign(b.style, buttonStyle(value === current));
                b.onclick = () => {
                    render(value);
                    onSelect(value);
                };
                return b;
            })
        );
    render(selected);
    return group;
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: Partial<CSSStyleDeclaration> = {
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
const buttonStyle = (active = false): Partial<CSSStyleDeclaration> => ({
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "6px",
    background: active ? "var(--st-ui-selection, #6c63ff)" : "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: "13px",
    cursor: "pointer",
});
const logStyle: Partial<CSSStyleDeclaration> = {
    margin: "0",
    padding: "8px 12px",
    overflowY: "auto",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    font: "12px/1.5 monospace",
    whiteSpace: "pre-wrap",
};

createChart();
