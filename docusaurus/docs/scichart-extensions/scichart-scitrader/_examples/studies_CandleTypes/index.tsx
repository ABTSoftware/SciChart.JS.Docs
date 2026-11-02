import * as React from "react";
import Button from "@mui/material/Button";
import { ECandleType, IStudy } from "scichart-scitrader";
import { CandleTypeSelector } from "scichart-scitrader-react";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useVanillaExample } from "../../framework/useVanillaExample";
import { addPriceActionChart, drawExample, setCandleType } from "./drawExample";

export default function CandleTypesExample(): JSX.Element {
    const { containerRef, api, error } = useVanillaExample(drawExample);
    const [candleType, setType] = React.useState(ECandleType.HeikinAshi);
    const [extra, setExtra] = React.useState<{ kind: "renko" | "pnf"; study: IStudy }>();

    const togglePriceAction = async (kind: "renko" | "pnf") => {
        if (extra) {
            api.financeApi.detachStudy(extra.study);
            setExtra(undefined);
            if (extra.kind === kind) {
                return;
            }
        }
        setExtra({ kind, study: await addPriceActionChart(api, kind) });
    };

    const toolbar = (
        <>
            <CandleTypeSelector
                value={candleType}
                onChange={(next) => {
                    setType(next);
                    setCandleType(api, next);
                }}
            />
            <Button
                size="small"
                variant={extra?.kind === "renko" ? "contained" : "outlined"}
                disabled={!api}
                onClick={() => togglePriceAction("renko")}
            >
                Renko pane
            </Button>
            <Button
                size="small"
                variant={extra?.kind === "pnf" ? "contained" : "outlined"}
                disabled={!api}
                onClick={() => togglePriceAction("pnf")}
            >
                Point &amp; Figure pane
            </Button>
        </>
    );

    return (
        <ExamplePage
            title="Candle Types, Renko and Point & Figure"
            description={
                <>
                    <code>setCandleType</code> redraws the price series as candlesticks, OHLC bars, a line, a mountain
                    or Heikin-Ashi candles, without reloading data. Renko and point &amp; figure plot price moves rather
                    than time, so they are studies that open a pane of their own.
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
