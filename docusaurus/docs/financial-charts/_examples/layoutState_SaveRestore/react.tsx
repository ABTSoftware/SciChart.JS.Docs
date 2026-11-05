import "scichart-scitrader/scitrader.css";
import * as React from "react";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    EStudyType,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    ISciFinanceChartPanelState,
    MACDStudy,
    OHLCStudy,
    registerDrawingTools,
    studyProvider,
    VolumeStudy,
} from "scichart-scitrader";
import { DrawingToolbar, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// Register the drawing tools' types before restoring, so saved drawings can be rebuilt. Without it,
// a chart restored on a fresh page skips them
registerDrawingTools();

const STORAGE_KEY = "my-app:chart";

export function SaveRestoreChart() {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    const { controller } = useDrawingTools(api);
    // The state to restore, and a key that changes to create the chart again from it
    const [restoreState, setRestoreState] = React.useState<ISciFinanceChartPanelState | null>(null);
    const [mount, setMount] = React.useState(0);
    const [json, setJson] = React.useState("");

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            studies: [new OHLCStudy(), new VolumeStudy(), new MACDStudy()],
        }),
        [mount]
    );

    // 1. Save: toJSON() returns the chart as plain JSON: the exchange, symbol, interval and period,
    // every study and its settings, the drawings, and the pane layout. Store it anywhere
    const save = () => {
        if (!api) return;
        const state = api.toJSON();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        setJson(`${JSON.stringify(state).length.toLocaleString()} characters\n\n${JSON.stringify(state, null, 2)}`);
    };

    // 2. Restore: pass the saved state as restoreState, and change the key so the view creates the
    // chart again from it. restoreState is read when the chart is created, like config
    const restore = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        // Deselect any drawing first: the drawing tools detach after the old chart is gone
        controller?.clearSelection();
        setApi(undefined);
        setRestoreState(JSON.parse(saved));
        setMount((m) => m + 1);
    };

    // Change the chart, so there is something to save: add a study, or draw with the tools on the left
    const addStudy = (type: EStudyType) => api?.financeApi.attachStudy(studyProvider.getStudy(type));

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={toolbarStyle}>
                <button style={buttonStyle} onClick={() => addStudy(EStudyType.RSI)}>Add RSI</button>
                <button style={buttonStyle} onClick={() => addStudy(EStudyType.SMA)}>Add SMA</button>
                <button style={buttonStyle} onClick={save}>Save</button>
                <button style={buttonStyle} onClick={restore}>Restore</button>
                <button style={buttonStyle} onClick={() => localStorage.removeItem(STORAGE_KEY)}>Clear saved</button>
            </div>
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <DrawingToolbar controller={controller} orientation="vertical" />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <SciFinanceChartView
                        key={mount}
                        config={config}
                        restoreState={restoreState}
                        useSubCharts={restoreState?.useSubCharts}
                        onInit={setApi}
                    />
                </div>
                <pre style={jsonStyle}>{json}</pre>
            </div>
        </div>
    );
}

// The toolbar and JSON panel use SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    padding: "8px 12px",
    background: "var(--st-ui-toolbar-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};

const buttonStyle: React.CSSProperties = {
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.15))",
    borderRadius: 4,
    background: "var(--st-ui-button-background, #363345)",
    color: "var(--st-ui-text, #e8e8ee)",
    font: "13px sans-serif",
    cursor: "pointer",
};

const jsonStyle: React.CSSProperties = {
    width: 300,
    margin: 0,
    padding: 8,
    overflow: "auto",
    background: "var(--st-ui-background, #2b2839)",
    color: "var(--st-ui-text-muted, #9da2bc)",
    font: "11px monospace",
    borderLeft: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
