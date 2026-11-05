import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { ETradingAnnotationType } from "scichart-financial-tools";
import {
    CandleInterval,
    CoinbaseExchange,
    defaultExchangeProvider,
    DRAWING_TOOL_BY_ID,
    EDrawingToolVariantId,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    TDrawingToolId,
    VolumeStudy,
} from "scichart-scitrader";
import { DrawingList, DrawingToolbar, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";

// Register a data source, once, at app startup
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);

// The tools on the rail, in order. Every other tool is in the "All drawing tools" panel
const TOOLS: TDrawingToolId[] = [
    ETradingAnnotationType.ExtendedLineAnnotation,
    ETradingAnnotationType.HorizontalTrendLineAnnotation,
    ETradingAnnotationType.FibonacciRetracementAnnotation,
    EDrawingToolVariantId.PatternElliottImpulse,
    ETradingAnnotationType.StopLossTakeProfitAnnotation,
    EDrawingToolVariantId.Eraser,
];

export function DrawingToolbarAndListChart() {
    const [chartApi, setChartApi] = React.useState<ISciFinanceChartPanelApi>();
    const { controller, drawings } = useDrawingTools(chartApi);
    const [message, setMessage] = React.useState("");
    // Set while asking to confirm "Clear all": the list's proceed callback
    const [pendingClear, setPendingClear] = React.useState<() => void>();

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "BTC-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    const find = (id: string) => drawings.find((d) => d.id === id);
    const name = (id: string) => DRAWING_TOOL_BY_ID.get(find(id)?.toolId ?? "")?.label ?? id;

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* DrawingToolbar: a rail of tools that drives the controller. A tool's button lights up while
                it is in use; clicking it again cancels it. showAllTools adds the button that opens every tool */}
            <DrawingToolbar controller={controller} tools={TOOLS} orientation="horizontal" showAllTools />
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <SciFinanceChartView config={config} onInit={setChartApi} />
                </div>
                {/* DrawingList: the drawings on the chart, following the controller. Each callback you pass
                    replaces the controller's own action for it, so these log the event, then do the action */}
                <DrawingList
                    controller={controller}
                    title="My drawings"
                    emptyMessage="Pick a tool above, then click the chart"
                    // A row was clicked. Default: select that drawing
                    onSelect={(id) => {
                        setMessage(`onSelect: ${name(id)}`);
                        controller.select(find(id));
                    }}
                    // Adds an edit button to each row. Open your own editor here, or controller.openEditor(item)
                    onEdit={(id) => setMessage(`onEdit: ${name(id)}`)}
                    // A row's delete button. Default: remove that drawing
                    onDelete={(id) => {
                        setMessage(`onDelete: ${name(id)}`);
                        controller.remove(find(id));
                    }}
                    // "Clear all", once confirmed. Default: remove every drawing
                    onClearAll={() => {
                        setMessage("onClearAll");
                        controller.remove();
                    }}
                    // Ask in your own way before "Clear all"; call proceed() if the user agrees.
                    // Default: the list's built-in dialog (.st-confirm-dialog)
                    confirmClearAll={(proceed) => setPendingClear(() => proceed)}
                    style={{ width: 280, overflowY: "auto" }}
                />
            </div>
            <div style={logStyle}>
                {pendingClear ? (
                    <>
                        Remove every drawing?
                        <button
                            style={buttonStyle}
                            onClick={() => {
                                setPendingClear(undefined);
                                pendingClear();
                            }}
                        >
                            Remove all
                        </button>
                        <button
                            style={buttonStyle}
                            onClick={() => {
                                setPendingClear(undefined);
                                setMessage("Clear all cancelled");
                            }}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    message
                )}
            </div>
        </div>
    );
}

// The log uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const logStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minHeight: 36,
    padding: "4px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderTop: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: 13,
};
const buttonStyle: React.CSSProperties = {
    padding: "2px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
};
