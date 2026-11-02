import * as React from "react";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { ISciFinanceChartPanelApi } from "scichart-scitrader";
import { useSciTraderTheme } from "scichart-scitrader-react";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { drawExample, ILayoutOptions } from "./drawExample";

export default function MultiPaneExample(): JSX.Element {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const panelRef = React.useRef<ISciFinanceChartPanelApi>();
    const [layout, setLayout] = React.useState<ILayoutOptions>({ useSubCharts: true, direction: "column" });
    const [ready, setReady] = React.useState(false);
    const [synced, setSynced] = React.useState(true);
    const [touch, setTouch] = React.useState(false);
    const [controlBarVisible, setControlBarVisible] = React.useState(true);
    // Read when the chart is (re)built; later changes go through `setPaneControls`.
    const paneControlsRef = React.useRef({ touch, visible: controlBarVisible });
    paneControlsRef.current = { touch, visible: controlBarVisible };
    const theme = useSciTraderTheme();

    // Rebuild on a layout change, carrying the chart over.
    React.useEffect(() => {
        let disposed = false;
        const previous = panelRef.current?.toJSON();
        panelRef.current?.cleanup();
        panelRef.current = undefined;
        setReady(false);
        drawExample(containerRef.current, layout, paneControlsRef.current, previous).then((panel) => {
            if (disposed) {
                panel.cleanup();
                return;
            }
            panelRef.current = panel;
            (window as unknown as { __example?: unknown }).__example = panel;
            panel.financeApi.setTheme(theme);
            setReady(true);
        });
        return () => {
            disposed = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- the theme is applied separately below
    }, [layout]);

    React.useEffect(() => () => panelRef.current?.cleanup(), []);
    React.useEffect(() => {
        if (ready) panelRef.current?.financeApi.setTheme(theme);
    }, [theme, ready]);
    React.useEffect(() => {
        if (ready) panelRef.current?.setPaneControls({ touch, visible: controlBarVisible });
    }, [touch, controlBarVisible, ready]);

    const toolbar = (
        <>
            <ToggleButtonGroup
                size="small"
                exclusive
                value={layout.useSubCharts ? "sub" : "multi"}
                onChange={(_e, v) => v && setLayout({ ...layout, useSubCharts: v === "sub" })}
            >
                <ToggleButton value="sub">Sub-charts</ToggleButton>
                <ToggleButton value="multi">Multi-chart</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
                size="small"
                exclusive
                value={layout.direction}
                onChange={(_e, v) => v && setLayout({ ...layout, direction: v })}
            >
                <ToggleButton value="column">Stacked</ToggleButton>
                <ToggleButton value="row">Side by side</ToggleButton>
            </ToggleButtonGroup>
            <Button
                size="small"
                variant="outlined"
                disabled={!ready}
                onClick={() => {
                    panelRef.current?.paneGroupApi.toggleAxisSync(!synced);
                    setSynced(!synced);
                }}
            >
                Axis sync: {synced ? "on" : "off"}
            </Button>
            <Button size="small" variant="outlined" disabled={!ready} onClick={() => panelRef.current?.addCustomPane()}>
                Add custom pane
            </Button>
            <Button size="small" variant="outlined" onClick={() => setTouch(!touch)}>
                Touch layout: {touch ? "on" : "off"}
            </Button>
            <Button size="small" variant="outlined" onClick={() => setControlBarVisible(!controlBarVisible)}>
                Control bar: {controlBarVisible ? "shown" : "hidden"}
            </Button>
        </>
    );

    return (
        <ExamplePage
            title="Multi-Pane Layout"
            description={
                <>
                    Hover the top of a pane for its controls: lock size, Y-axis autorange, move, maximise, hide and
                    close. Drag a divider to resize. <strong>Sub-charts</strong> draw every pane on one SciChart
                    surface (fastest); <strong>multi-chart</strong> gives each pane its own. <code>paneGroupApi</code>{" "}
                    drives the same layout from code, including axis sync. <strong>Touch layout</strong> (
                    <code>paneControls: {"{ touch: true }"}</code>) is for phones and tablets: each control bar moves
                    into a drawer at the pane&apos;s right edge (tap or swipe the handle) and the dividers get a
                    wider grip. The chart doesn&apos;t detect touch screens itself; your page turns it on, e.g. from
                    its own breakpoint, and <code>setPaneControls</code> switches a live chart.
                </>
            }
            toolbar={toolbar}
            ready={ready}
        >
            <div ref={containerRef} style={CHART_STYLE} />
        </ExamplePage>
    );
}
