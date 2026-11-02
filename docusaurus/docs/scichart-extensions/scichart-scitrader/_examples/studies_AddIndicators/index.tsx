import * as React from "react";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useVanillaExample } from "../../framework/useVanillaExample";
import { drawExample } from "./drawExample";

export default function AddIndicatorsExample(): JSX.Element {
    const { containerRef, api, error } = useVanillaExample(drawExample);

    return (
        <ExamplePage
            title="Add Indicators"
            description={
                <>
                    Indicators are studies, passed to the chart in <code>studies</code>. SMA, EMA and Bollinger Bands
                    overlay the price pane; RSI and MACD each get a pane of their own. The SDK ships 30 studies: see{" "}
                    <code>EStudyType</code> for the full list.
                </>
            }
            ready={api !== undefined}
            error={error}
        >
            <div ref={containerRef} style={CHART_STYLE} />
        </ExamplePage>
    );
}
