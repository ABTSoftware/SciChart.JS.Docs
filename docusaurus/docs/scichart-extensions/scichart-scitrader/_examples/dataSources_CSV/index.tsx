import * as React from "react";
import { IntervalSelector } from "scichart-scitrader-react";
import { CandleInterval } from "scichart-scitrader";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useVanillaExample } from "../../framework/useVanillaExample";
import { drawExample } from "./drawExample";

export default function CsvDataExample(): JSX.Element {
    const { containerRef, api, error } = useVanillaExample(drawExample);
    const [interval, setInterval] = React.useState(CandleInterval.TWO_HOURS);
    const [symbol, setSymbol] = React.useState("SOLUSDT");
    const [symbols, setSymbols] = React.useState<string[]>([]);

    React.useEffect(() => {
        api?.exchange.getInstruments().then(setSymbols);
    }, [api]);

    const toolbar = api && (
        <>
            <ToggleButtonGroup
                size="small"
                exclusive
                value={symbol}
                onChange={(_e, next: string | null) => {
                    if (next) {
                        setSymbol(next);
                        api.panel.financeApi.setSymbol(next);
                    }
                }}
            >
                {symbols.map((s) => (
                    <ToggleButton key={s} value={s}>
                        {s}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <IntervalSelector
                value={interval}
                // The picker offers exactly the intervals the CSV data can serve.
                intervals={api.exchange.getSupportedIntervals()}
                onChange={(next) => {
                    setInterval(next);
                    api.panel.financeApi.changeInterval(next);
                }}
            />
        </>
    );

    return (
        <ExamplePage
            title="CSV Data"
            description={
                <>
                    <code>CSVExchange.fromUrl("data/crypto-1h.csv")</code> turns a file of hourly candles into an
                    exchange. It lists the file's symbols, serves every interval the rows can be combined into, and
                    shifts the data to end now. Good for demos, tests and your own historical data. It has no live
                    updates.
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
