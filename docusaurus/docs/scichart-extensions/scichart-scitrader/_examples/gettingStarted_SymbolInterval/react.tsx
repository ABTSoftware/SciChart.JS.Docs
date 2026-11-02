import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    carryPeriodToInterval,
    defaultExchangeProvider,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    TPeriod,
    VolumeStudy,
} from "scichart-scitrader";
import { IntervalSelector, PeriodSelector, SciFinanceChartView } from "scichart-scitrader-react";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
const INTERVALS = [CandleInterval.ONE_HOUR, CandleInterval.FOUR_HOURS, CandleInterval.ONE_DAY, CandleInterval.ONE_WEEK];

export function SymbolIntervalPeriodChart() {
    const chartRef = React.useRef<ISciFinanceChartPanelApi>(null);
    const [symbol, setSymbol] = React.useState("BTCUSDT");
    const [interval, setInterval] = React.useState(CandleInterval.FOUR_HOURS);
    const [period, setPeriod] = React.useState<TPeriod | null>("1M");

    // Read once, when the chart is created. Later changes go through financeApi
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
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

    return (
        <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
            <div style={{ display: "flex", gap: 8 }}>
                {SYMBOLS.map((s) => (
                    <button
                        key={s}
                        disabled={s === symbol}
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
            <div style={{ flex: 1 }}>
                <SciFinanceChartView ref={chartRef} config={config} />
            </div>
        </div>
    );
}
