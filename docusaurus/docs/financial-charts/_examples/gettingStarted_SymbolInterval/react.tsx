import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    carryPeriodToInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    TPeriod,
    VolumeStudy,
} from "scichart-scitrader";
import { IntervalSelector, PeriodSelector, SciFinanceChartView } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

const SYMBOLS = ["BTC-USD", "ETH-USD", "SOL-USD"]; // Coinbase's symbol format
// Coinbase offers 1m, 5m, 15m, 1h, 6h and 1d candles
const INTERVALS = [CandleInterval.FIFTEEN_MINUTES, CandleInterval.ONE_HOUR, CandleInterval.SIX_HOURS, CandleInterval.ONE_DAY];

export function SymbolIntervalPeriodChart() {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    const [symbol, setSymbol] = React.useState(SYMBOLS[0]);
    const [interval, setInterval] = React.useState(CandleInterval.SIX_HOURS);
    const [period, setPeriod] = React.useState<TPeriod | null>("1M");

    // Read once, when the chart is created. Later changes go through financeApi
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol,
            interval,
            period: period ?? undefined,
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // financeApi throws until the chart has initialised
    const chart = () => (chartRef.current?.isInitialized ? chartRef.current.financeApi : undefined);

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                {SYMBOLS.map((s) => (
                    <button
                        key={s}
                        style={buttonStyle(s === symbol)}
                        onClick={() => {
                            setSymbol(s);
                            chart()?.setSymbol(s);
                        }}
                    >
                        {s}
                    </button>
                ))}
                <IntervalSelector
                    value={interval}
                    intervals={INTERVALS}
                    onChange={(next) => {
                        // Keep about the same span on screen, adjusted to suit the new interval
                        const carried = carryPeriodToInterval(period, next);
                        setInterval(next);
                        setPeriod(carried);
                        chart()?.changeInterval(next, carried);
                    }}
                />
                <PeriodSelector
                    value={period}
                    currentInterval={interval}
                    onChange={(next) => {
                        setPeriod(next);
                        chart()?.setPeriod(next);
                    }}
                />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <SciFinanceChartView ref={chartRef} config={config} />
            </div>
        </div>
    );
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};

const buttonStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    fontSize: 14,
    fontFamily: "var(--st-font-family, sans-serif)",
    color: "var(--st-ui-text, #ffffff)",
    background: active ? "var(--st-ui-accent, #7464ff)" : "var(--st-ui-surface, #373447)",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 4,
    cursor: "pointer",
});
