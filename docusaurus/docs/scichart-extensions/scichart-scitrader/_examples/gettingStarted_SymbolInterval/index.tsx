import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { CandleInterval, carryPeriodToInterval, TPeriod } from "scichart-scitrader";
import { IntervalSelector, PeriodSelector } from "scichart-scitrader-react";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useVanillaExample } from "../../framework/useVanillaExample";
import { SAMPLE_SYMBOLS } from "../../sampleData";
import { changeInterval, changePeriod, changeSymbol, drawExample, INITIAL } from "./drawExample";

const INTERVALS = [
    CandleInterval.ONE_HOUR,
    CandleInterval.FOUR_HOURS,
    CandleInterval.TWELVE_HOURS,
    CandleInterval.ONE_DAY,
    CandleInterval.ONE_WEEK,
];

export default function SymbolIntervalExample(): JSX.Element {
    const { containerRef, api, error } = useVanillaExample(drawExample);
    const [symbol, setSymbol] = React.useState(INITIAL.symbol);
    const [interval, setInterval] = React.useState(INITIAL.interval);
    const [period, setPeriod] = React.useState<TPeriod | null>(INITIAL.period);

    const toolbar = (
        <>
            <ToggleButtonGroup
                size="small"
                exclusive
                value={symbol}
                onChange={(_e, next: string | null) => {
                    if (next && api) {
                        setSymbol(next);
                        changeSymbol(api, next);
                    }
                }}
            >
                {SAMPLE_SYMBOLS.map((s) => (
                    <ToggleButton key={s} value={s} data-testid={`symbol-${s}`}>
                        {s}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <IntervalSelector
                value={interval}
                intervals={INTERVALS}
                onChange={(next) => {
                    // Keep about the same span, adjusted to suit the new interval.
                    const carried = carryPeriodToInterval(period, next);
                    setInterval(next);
                    setPeriod(carried);
                    api && changeInterval(api, next, carried);
                }}
            />
            <PeriodSelector
                value={period}
                currentInterval={interval}
                onChange={(next) => {
                    setPeriod(next);
                    api && changePeriod(api, next);
                }}
            />
        </>
    );

    return (
        <ExamplePage
            title="Change Symbol, Interval and Period"
            description={
                <>
                    A chart keeps its studies and panes when the data changes. <code>setSymbol</code> swaps the symbol,{" "}
                    <code>changeInterval</code> reloads at a new candle size, and <code>setPeriod</code> sets how much
                    time is on screen. The interval and period pickers are the <code>IntervalSelector</code> and{" "}
                    <code>PeriodSelector</code> React components.
                </>
            }
            toolbar={toolbar}
            ready={api !== undefined}
            error={error}
        >
            <div ref={containerRef} style={CHART_STYLE} />
        </ExamplePage>
    );
}
