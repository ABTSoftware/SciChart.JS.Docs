import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    SciTraderTicker,
    VolumeStudy,
} from "scichart-scitrader";
import { SciFinanceChartView } from "scichart-scitrader-react";

// Register Coinbase once, at app startup, with a candle store: idbPriceStore keeps downloaded
// candles in IndexedDB, so a reload or a return visit draws from the cache
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

const SYMBOLS = ["BTC-USD", "ETH-USD", "SOL-USD"]; // Coinbase's symbol format: BASE-QUOTE
// The intervals Coinbase serves: 1m, 5m, 15m, 1h, 6h and 1d
const INTERVALS = CoinbaseExchange.getSupportedIntervals();

export function CoinbaseChart() {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    const [symbol, setSymbol] = React.useState("BTC-USD");
    const [interval, setInterval] = React.useState(CandleInterval.ONE_HOUR);
    const [ticker, setTicker] = React.useState<SciTraderTicker>();

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // "Coinbase": the name it was registered under
            symbol: "BTC-USD",
            interval: CandleInterval.ONE_HOUR,
            period: "1W",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    // The registered exchange's client also gives live data: here a ticker, the latest price and
    // the 24-hour change, for the chart's symbol. Unsubscribe when the symbol changes or on unmount
    React.useEffect(() => {
        const subscription = defaultExchangeProvider.getExchange(CoinbaseExchange.name).getTickerStream(symbol).subscribe(setTicker);
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
                        chart()?.setSymbol(s); // reload the chart's candles for the new symbol
                    }}
                />
                <ButtonGroup
                    values={INTERVALS}
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
