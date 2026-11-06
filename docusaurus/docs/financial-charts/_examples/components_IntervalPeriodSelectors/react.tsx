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

// The intervals to offer: the ones Coinbase supports
const INTERVALS = [
    CandleInterval.FIVE_MINUTES,
    CandleInterval.FIFTEEN_MINUTES,
    CandleInterval.ONE_HOUR,
    CandleInterval.SIX_HOURS,
    CandleInterval.ONE_DAY,
];

export function IntervalPeriodChart() {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    // The controls are controlled components: their value lives in React state
    const [interval, setInterval] = React.useState(CandleInterval.ONE_HOUR);
    const [period, setPeriod] = React.useState<TPeriod | null>("1M");

    // Read once, when the chart is created. Later changes go through financeApi
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.ONE_HOUR,
            period: "1M",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    // financeApi throws until the chart has initialised
    const chart = () => (chartRef.current?.isInitialized ? chartRef.current.financeApi : undefined);

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
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
                    // Disables the periods that don't suit the interval
                    currentInterval={interval}
                    // next is a TPeriod, or null for "Free"
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
