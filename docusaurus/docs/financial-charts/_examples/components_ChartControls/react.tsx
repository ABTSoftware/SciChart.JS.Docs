import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    BinanceExchange,
    CandleInterval,
    carryPeriodToInterval,
    defaultExchangeProvider,
    ECandleType,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    TPeriod,
    VolumeStudy,
} from "scichart-scitrader";
import {
    CandleTypeSelector,
    IntervalSelector,
    LiveTipToggle,
    PeriodSelector,
    SciFinanceChartView,
} from "scichart-scitrader-react";

defaultExchangeProvider.registerExchange(BinanceExchange, idbPriceStore);

const INTERVALS = [
    CandleInterval.ONE_MINUTE,
    CandleInterval.FIVE_MINUTES,
    CandleInterval.FIFTEEN_MINUTES,
    CandleInterval.ONE_HOUR,
    CandleInterval.FOUR_HOURS,
    CandleInterval.ONE_DAY,
];

export function ChartWithControls() {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    const [interval, setInterval] = React.useState(CandleInterval.FIVE_MINUTES);
    const [period, setPeriod] = React.useState<TPeriod | null>("1D");
    const [candleType, setCandleType] = React.useState(ECandleType.Candlestick);
    const [liveTipMode, setLiveTipMode] = React.useState<"follow" | "anchored">("follow");

    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: BinanceExchange.name, // name="Binance" matches the built-in BinanceExchange
            symbol: "BTCUSDT",
            interval: CandleInterval.FIVE_MINUTES,
            period: "1D",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    // The React controls are controlled components: they call onChange, and show what you pass as value
    return (
        <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <IntervalSelector
                    value={interval}
                    intervals={INTERVALS}
                    onChange={(next) => {
                        // Keep about the same span on screen, adjusted to suit the new interval
                        const carried = carryPeriodToInterval(period, next);
                        setInterval(next);
                        setPeriod(carried);
                        api?.financeApi.changeInterval(next, carried);
                    }}
                />
                <PeriodSelector
                    value={period}
                    currentInterval={interval}
                    onChange={(next) => {
                        setPeriod(next);
                        api?.financeApi.setPeriod(next);
                    }}
                />
                <CandleTypeSelector
                    value={candleType}
                    onChange={(next) => {
                        setCandleType(next);
                        api?.financeApi.setCandleType(next);
                    }}
                />
                <LiveTipToggle
                    value={liveTipMode}
                    onChange={(next) => {
                        setLiveTipMode(next);
                        if (api) api.financeApi.liveTipMode = next;
                    }}
                />
            </div>
            <div style={{ flex: 1 }}>
                <SciFinanceChartView config={config} onInit={setApi} />
            </div>
        </div>
    );
}
