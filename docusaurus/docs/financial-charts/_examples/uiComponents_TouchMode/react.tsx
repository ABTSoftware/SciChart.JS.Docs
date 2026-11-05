import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { XAxisDragModifier, ZoomPanModifier } from "scichart";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    FinChartLegendModifier,
    FinChartZoomExtentsModifier,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    RSIStudy,
    SciFinanceChart,
    VolumeStudy,
} from "scichart-scitrader";
import { DrawingToolbar, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// 1. Your app decides between touch and mouse: the chart doesn't detect it. This hook follows a
// media query: a coarse pointer (a finger) means touch. Add a width test for a phone layout
const touchScreen = matchMedia("(pointer: coarse)");
function useTouchScreen(): boolean {
    return React.useSyncExternalStore(
        (onChange) => {
            touchScreen.addEventListener("change", onChange);
            return () => touchScreen.removeEventListener("change", onChange);
        },
        () => touchScreen.matches,
        () => false // server render: assume a mouse
    );
}

type TMode = "auto" | "touch" | "mouse";

export function TouchModeChart() {
    const isTouchScreen = useTouchScreen();
    const [mode, setMode] = React.useState<TMode>("auto"); // the buttons override it, to try touch with a mouse
    const touch = mode === "touch" || (mode === "auto" && isTouchScreen);

    const modes: Array<[TMode, string]> = [
        ["auto", `Auto (${isTouchScreen ? "touch" : "mouse"})`],
        ["touch", "Touch"],
        ["mouse", "Mouse"],
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* 2. Some settings are read only when a chart is created, so a new `key` creates the
                chart again in the new mode */}
            <ModeChart key={touch ? "touch" : "mouse"} touch={touch}>
                {modes.map(([value, label]) => (
                    <button key={value} style={buttonStyle(value === mode)} onClick={() => setMode(value)}>
                        {label}
                    </button>
                ))}
            </ModeChart>
        </div>
    );
}

function ModeChart({ touch, children }: { touch: boolean; children: React.ReactNode }) {
    const [api, setApi] = React.useState<ISciFinanceChartPanelApi>();
    // The crosshair and legend follow the mouse, so they start on with a mouse, and off on touch
    const [crosshair, setCrosshair] = React.useState(!touch);
    const crosshairRef = React.useRef(crosshair);
    crosshairRef.current = crosshair;

    // Touch: a long press selects a drawing, and placement uses a cursor you drag to aim and tap to
    // commit. A finished drawing isn't selected, so its editor doesn't cover it. When a tool
    // finishes, resumeGestures turns panning back on, unless the crosshair has it.
    // useDrawingTools reads its options once, which is why the chart is created again on a change
    const drawingOptions = React.useMemo(
        () => ({
            touch,
            selectFinishedDrawing: !touch,
            resumeGestures: () => api && setPanAndZoom(api.financeApi, !(touch && crosshairRef.current)),
        }),
        [touch, api]
    );
    const { controller } = useDrawingTools(api, drawingOptions);

    // 3. The crosshair. With a mouse, hovering moves it and dragging pans. On touch, one finger does
    // both, so while the crosshair is on, a drag moves it and panning is off
    React.useEffect(() => {
        if (!api) return;
        const chart = api.financeApi;
        // FinChartLegendModifier draws the crosshair and the legend
        chart.finChartModifiers
            .asArray()
            .find((m): m is FinChartLegendModifier => m instanceof FinChartLegendModifier)
            ?.setCursorEnabled(crosshair);
        if (touch) setPanAndZoom(chart, !crosshair);
    }, [api, crosshair, touch]);

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.ONE_HOUR,
            period: "1W",
            studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy()],
        }),
        []
    );

    return (
        <>
            <div style={toolbarStyle}>
                {children}
                <button style={buttonStyle(crosshair)} onClick={() => setCrosshair(!crosshair)}>
                    Crosshair {crosshair ? "on" : "off"}
                </button>
            </div>
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <DrawingToolbar controller={controller} orientation="vertical" />
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Touch: each pane's control bar sits in a drawer at its right edge (there is no
                        hover to show it), and the dividers between panes get a wider grip */}
                    <SciFinanceChartView config={config} paneControls={{ touch }} onInit={setApi} />
                </div>
            </div>
        </>
    );
}

// Pan, X-axis drag and double-tap zoom-to-fit, on every pane. Pinch-to-zoom works on touch screens
// without any setup
function setPanAndZoom(chart: SciFinanceChart, enabled: boolean) {
    chart.chartPanes.forEach(({ surface }) =>
        surface.chartModifiers.asArray().forEach((m) => {
            if (m instanceof ZoomPanModifier || m instanceof XAxisDragModifier || m instanceof FinChartZoomExtentsModifier) {
                m.isEnabled = enabled;
            }
        })
    );
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};

const buttonStyle = (selected: boolean): React.CSSProperties => ({
    padding: "4px 12px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.15))",
    borderRadius: 4,
    background: selected ? "var(--st-ui-accent, #5c5cff)" : "var(--st-ui-surface, #363345)",
    color: "var(--st-ui-text, #e8e8ee)",
    font: "13px inherit",
    cursor: "pointer",
});
