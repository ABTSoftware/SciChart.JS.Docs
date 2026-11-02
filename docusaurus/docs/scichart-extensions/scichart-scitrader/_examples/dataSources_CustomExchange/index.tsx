import * as React from "react";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useVanillaExample } from "../../framework/useVanillaExample";
import { drawExample } from "./drawExample";

export default function CustomExchangeExample(): JSX.Element {
    const { containerRef, api, error } = useVanillaExample(drawExample);

    return (
        <ExamplePage
            title="Custom Data Source"
            description={
                <>
                    Any data source can back a chart by implementing <code>IRemoteExchange</code>. This one generates
                    prices from a formula: <code>getCandles</code> answers history requests, and{" "}
                    <code>getCandleStream</code> pushes the live candle twice a second. Pan left to page back through
                    history, which stops at the listing date.
                </>
            }
            ready={api !== undefined}
            error={error}
        >
            <div ref={containerRef} style={CHART_STYLE} />
        </ExamplePage>
    );
}
