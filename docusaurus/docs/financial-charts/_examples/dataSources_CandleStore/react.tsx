import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    createExchangeProvider,
    DataFeedManager,
    ExchangeRestCandle,
    ICandleStore,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

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

const INTERVALS = CoinbaseExchange.getSupportedIntervals();

export function CandleStoreChart() {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    const [lines, setLines] = React.useState<string[]>([]);
    const [interval, setInterval] = React.useState(CandleInterval.ONE_HOUR);
    const log = (line: string) => setLines((previous) => [`${new Date().toLocaleTimeString()} ${line}`, ...previous]);

    // Register Coinbase with the logging store, in a provider of this chart's own. Create the config
    // once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(() => {
        const provider = createExchangeProvider();
        provider.registerExchange(CoinbaseExchange, new LoggingCandleStore(log));
        return {
            exchangeName: CoinbaseExchange.name,
            symbol: "BTC-USD",
            interval: CandleInterval.ONE_HOUR,
            period: "1W",
            services: { dataFeedManager: new DataFeedManager(provider) }, // the chart's data comes from `provider`
            studies: [new OHLCStudy(), new VolumeStudy()],
        };
    }, []);

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                {/* Change interval and back: the second time, the candles come from the store */}
                <ButtonGroup
                    values={INTERVALS}
                    selected={interval}
                    onSelect={(i) => {
                        setInterval(i);
                        if (chartRef.current?.isInitialized) chartRef.current.financeApi.changeInterval(i);
                    }}
                />
                {/* clearAll deletes every candle in IndexedDB. The next load fetches everything again */}
                <button style={buttonStyle()} onClick={() => idbPriceStore.clearAll().then(() => log("cleared IndexedDB"))}>
                    Clear the cache
                </button>
            </div>
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <SciFinanceChartView ref={chartRef} config={config} />
                </div>
                <pre style={logStyle}>{lines.join("\n")}</pre>
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
const logStyle: React.CSSProperties = {
    width: 340,
    margin: 0,
    padding: "8px 12px",
    overflowY: "auto",
    background: "var(--st-ui-background, #2b2839)",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    font: "12px/1.5 monospace",
    whiteSpace: "pre-wrap",
};
