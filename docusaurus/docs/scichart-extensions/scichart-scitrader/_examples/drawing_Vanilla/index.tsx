import * as React from "react";
import Button from "@mui/material/Button";
import { IDrawingItem } from "scichart-scitrader";
import { useSciTraderTheme } from "scichart-scitrader-react";
import { ExamplePage } from "../../framework/ExamplePage";
import { drawExample, IDrawingExample } from "./drawExample";

export default function DrawingToolsVanillaExample(): JSX.Element {
    const toolbarRef = React.useRef<HTMLDivElement>(null);
    const chartRef = React.useRef<HTMLDivElement>(null);
    const [api, setApi] = React.useState<IDrawingExample>();
    const [drawings, setDrawings] = React.useState<readonly IDrawingItem[]>([]);
    const [error, setError] = React.useState<unknown>();
    const theme = useSciTraderTheme();

    React.useEffect(() => {
        let disposed = false;
        let result: IDrawingExample | undefined;
        drawExample(toolbarRef.current, chartRef.current).then((value) => {
            result = value;
            if (disposed) {
                value.cleanup();
                return;
            }
            (window as unknown as { __example?: unknown }).__example = value;
            value.drawing.drawingsChanged.subscribe(setDrawings);
            setApi(value);
        }, setError);
        return () => {
            disposed = true;
            result?.cleanup();
        };
    }, []);

    React.useEffect(() => {
        api?.panel.financeApi.setTheme(theme);
    }, [api, theme]);

    const toolbar = (
        <>
            <span style={{ fontSize: 13, opacity: 0.8 }} data-testid="drawing-count">
                {drawings.length} drawing{drawings.length === 1 ? "" : "s"}
            </span>
            <Button
                size="small"
                variant="outlined"
                disabled={drawings.length === 0}
                onClick={() => api?.drawing.remove()}
            >
                Clear drawings
            </Button>
        </>
    );

    return (
        <ExamplePage
            title="Drawing Tools"
            description={
                <>
                    Pick a tool from the rail and draw on the chart: trend lines, channels, pitchforks, Fibonacci tools,
                    patterns, measure, stop-loss / take-profit, freehand and an eraser. Click a drawing to edit it. The
                    rail is <code>DrawingToolbar.create</code>, plain DOM with no framework, driving a{" "}
                    <code>DrawingToolsController</code>.
                </>
            }
            toolbar={toolbar}
            ready={api !== undefined}
            error={error}
        >
            <div style={{ position: "absolute", inset: 0, display: "flex" }}>
                <div ref={toolbarRef} style={{ display: "flex" }} />
                <div ref={chartRef} style={{ position: "relative", flex: 1 }} />
            </div>
        </ExamplePage>
    );
}
