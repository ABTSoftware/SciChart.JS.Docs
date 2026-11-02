import * as React from "react";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useVanillaExample } from "../../framework/useVanillaExample";
import { drawExample } from "./drawExample";

export default function ChartControlsExample(): JSX.Element {
    const { containerRef, api, error } = useVanillaExample(drawExample);

    return (
        <ExamplePage
            title="Chart Controls (plain TypeScript)"
            description={
                <>
                    The SDK's toolbar controls, without React: <code>IntervalSelector</code>,{" "}
                    <code>PeriodSelector</code>, <code>CandleTypeSelector</code> and <code>LiveTipToggle</code>. Each is
                    created with <code>create(container, options)</code>, calls <code>onChange</code> when the user
                    picks, and takes new options through <code>update</code>. The period buttons disable the periods
                    that don't suit the interval. The data is live and randomised, so try Anchored, then pan left.
                </>
            }
            ready={api !== undefined}
            error={error}
        >
            <div ref={containerRef} style={CHART_STYLE} />
        </ExamplePage>
    );
}
