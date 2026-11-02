import * as React from "react";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useVanillaExample } from "../../framework/useVanillaExample";
import { drawExample } from "./drawExample";

export default function CreateChartExample(): JSX.Element {
    const { containerRef, api, error } = useVanillaExample(drawExample);

    return (
        <ExamplePage
            title="Create a Financial Chart"
            description={
                <>
                    The smallest complete chart: <code>SciFinanceChartPanel.create</code> with an exchange, a symbol, an
                    interval and two studies. Scroll to zoom, drag to pan, and pan left to load more history.
                </>
            }
            ready={api !== undefined}
            error={error}
        >
            <div ref={containerRef} style={CHART_STYLE} />
        </ExamplePage>
    );
}
