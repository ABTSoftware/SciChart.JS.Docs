import * as React from "react";
import Button from "@mui/material/Button";
import { EStudyType, ISciFinanceChartPanelApi, studyProvider } from "scichart-scitrader";
import { useSciTraderTheme } from "scichart-scitrader-react";
import { CHART_STYLE, ExamplePage } from "../../framework/ExamplePage";
import { drawExample, restoreChart, saveChart } from "./drawExample";

const STORAGE_KEY = "scitrader-sandbox:save-restore-demo";

export default function SaveRestoreExample(): JSX.Element {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const panelRef = React.useRef<ISciFinanceChartPanelApi>();
    const [ready, setReady] = React.useState(false);
    const [saved, setSaved] = React.useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
    const [error, setError] = React.useState<unknown>();

    // Keep the chart on the Sandbox theme, including a chart rebuilt by Restore.
    const theme = useSciTraderTheme();
    React.useEffect(() => {
        if (ready) {
            panelRef.current?.financeApi.setTheme(theme);
        }
    }, [theme, ready]);

    const track = (panel: ISciFinanceChartPanelApi) => {
        panelRef.current = panel;
        (window as unknown as { __example?: unknown }).__example = panel;
        setReady(true);
    };

    React.useEffect(() => {
        let disposed = false;
        drawExample(containerRef.current).then((panel) => (disposed ? panel.cleanup() : track(panel)), setError);
        return () => {
            disposed = true;
            panelRef.current?.cleanup();
        };
    }, []);

    const onSave = () => {
        const json = saveChart(panelRef.current);
        localStorage.setItem(STORAGE_KEY, json);
        setSaved(json);
    };

    const onRestore = async () => {
        setReady(false);
        try {
            track(await restoreChart(containerRef.current, panelRef.current, saved));
        } catch (e) {
            console.error(e);
            setError(e);
        }
    };

    const addRsi = () => panelRef.current?.financeApi.attachStudy(studyProvider.getStudy(EStudyType.RSI));

    const toolbar = (
        <>
            <Button size="small" variant="outlined" disabled={!ready} onClick={addRsi}>
                Add RSI
            </Button>
            <Button size="small" variant="contained" disabled={!ready} onClick={onSave} data-testid="save">
                Save
            </Button>
            <Button
                size="small"
                variant="contained"
                disabled={!ready || !saved}
                onClick={onRestore}
                data-testid="restore"
            >
                Restore
            </Button>
            {saved && (
                <span style={{ fontSize: 12, opacity: 0.7 }}>
                    {(saved.length / 1024).toFixed(1)} KB saved to localStorage
                </span>
            )}
        </>
    );

    return (
        <ExamplePage
            title="Save and Restore a Chart"
            description={
                <>
                    Change the chart by adding a study, editing one, resizing panes or drawing on it, then press Save.
                    Restore tears the chart down and rebuilds it from the saved JSON with{" "}
                    <code>SciFinanceChartPanel.fromJSON</code>. In React, pass the same JSON to{" "}
                    <code>&lt;SciFinanceChartView restoreState=&#123;…&#125; /&gt;</code>.
                </>
            }
            toolbar={toolbar}
            ready={ready}
            error={error}
        >
            <div ref={containerRef} style={CHART_STYLE} />
        </ExamplePage>
    );
}
