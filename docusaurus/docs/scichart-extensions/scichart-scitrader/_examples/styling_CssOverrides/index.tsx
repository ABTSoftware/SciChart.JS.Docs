import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useSciTraderTheme } from "scichart-scitrader-react";
import { ExamplePage } from "../../framework/ExamplePage";
import { drawExample, ICssOverridesExample } from "./drawExample";
import { CSS_SKINS } from "./skins";

export default function CssOverridesExample(): JSX.Element {
    const toolbarRef = React.useRef<HTMLDivElement>(null);
    const chartRef = React.useRef<HTMLDivElement>(null);
    const [api, setApi] = React.useState<ICssOverridesExample>();
    const [error, setError] = React.useState<unknown>();
    const [skinId, setSkinId] = React.useState(CSS_SKINS[0].id);
    const skin = CSS_SKINS.find((s) => s.id === skinId);
    const theme = useSciTraderTheme();

    React.useEffect(() => {
        let disposed = false;
        let result: ICssOverridesExample | undefined;
        drawExample(toolbarRef.current, chartRef.current).then((value) => {
            result = value;
            if (disposed) {
                value.cleanup();
                return;
            }
            (window as unknown as { __example?: unknown }).__example = value;
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
        <ToggleButtonGroup
            size="small"
            exclusive
            value={skinId}
            onChange={(_e, next: string | null) => next && setSkinId(next)}
        >
            {CSS_SKINS.map((s) => (
                <ToggleButton key={s.id} value={s.id} data-testid={`skin-${s.id}`}>
                    {s.name}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );

    return (
        <ExamplePage
            title="CSS Overrides"
            description={
                <>
                    The SDK's toolbars and controls take their look from <code>scitrader.css</code>, so plain CSS
                    restyles them. Every element has an <code>st-…</code> class, and states are attributes such as{" "}
                    <code>aria-pressed</code> and <code>:hover</code>. Pick a style; the rules on the right are all it
                    takes. Hover a pane for its control bar, hide a pane for the restore strip, and draw something then
                    click it for the quick-edit toolbar.
                </>
            }
            toolbar={toolbar}
            ready={api !== undefined}
            error={error}
        >
            {/* In an app, these rules would live in your own stylesheet. */}
            <style data-testid="css-overrides">{skin.css}</style>
            <div style={{ position: "absolute", inset: 0, display: "flex" }}>
                <div className={`skin-${skin.id}`} style={{ display: "flex", flex: 1, minWidth: 0 }}>
                    <div ref={toolbarRef} style={{ display: "flex" }} />
                    <div ref={chartRef} style={{ position: "relative", flex: 1 }} />
                </div>
                <pre style={CODE_STYLE} data-testid="css-overrides-source">
                    {skin.css}
                </pre>
            </div>
        </ExamplePage>
    );
}

const CODE_STYLE: React.CSSProperties = {
    width: 400,
    flexShrink: 0,
    margin: 0,
    whiteSpace: "pre-wrap",
    padding: 12,
    overflow: "auto",
    fontSize: 12,
    lineHeight: 1.5,
    color: "var(--st-ui-text, #ffffff)",
    background: "var(--st-ui-panel, #262334)",
    borderLeft: "1px solid rgb(var(--st-ui-overlay-rgb, 255 255 255) / 0.1)",
};
