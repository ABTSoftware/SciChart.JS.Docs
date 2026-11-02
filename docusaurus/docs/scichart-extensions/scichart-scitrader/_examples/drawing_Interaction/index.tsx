import * as React from "react";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { useVanillaExample } from "../../framework/useVanillaExample";
import { drawExample } from "./drawExample";

export default function InteractionExample(): JSX.Element {
    const { containerRef, api, error } = useVanillaExample(drawExample);

    return (
        <ExamplePage
            title="Keyboard, Touch and On-Chart Buttons"
            description={
                <>
                    Click a pane, then use the arrow keys to pan, <kbd>+</kbd> / <kbd>-</kbd> to zoom and <kbd>0</kbd>{" "}
                    to reset. Hover a pane for the zoom and pan buttons. Press <kbd>A</kbd> to draw (freehand until a
                    tool has been used), <kbd>N</kbd> / <kbd>P</kbd> to step through drawings and <kbd>Delete</kbd> to
                    remove one. On a touch screen, long-press a drawing to select it.
                </>
            }
            ready={api !== undefined}
            error={error}
        >
            <div ref={containerRef} style={CHART_STYLE} />
        </ExamplePage>
    );
}
