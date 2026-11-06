import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { AnnotationBase, IAnnotation, Point } from "scichart";
import { FibonacciRetracementAnnotation } from "scichart-financial-tools";
import {
    CandleInterval,
    CoinbaseExchange,
    DEFAULT_FEED_ID,
    defaultExchangeProvider,
    DRAWING_TOOL_BY_ID,
    EDataSourceStringId,
    idbPriceStore,
    ISciFinanceChartPanelApi,
    ISciFinanceChartPanelConfig,
    OHLCStudy,
    PaneId,
    registerDrawingTools,
    SciFinanceChart,
    VolumeStudy,
} from "scichart-scitrader";
import { DrawingList, DrawingToolbar, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";

// Once, at app startup: register a data source, and the drawing tools' annotation types
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
registerDrawingTools();

// The full editor sets its own position and look inline, as a floating panel. These rules dock it in
// its container instead: give the editor these classes with editorRootClassName and editorPanelClassName
const EDITOR_CSS = `
.docked-editor { position: static !important; inset: auto !important; width: 100% !important; height: 100% !important; overflow-y: auto; }
.docked-editor-panel { width: 100% !important; max-height: 100% !important; box-sizing: border-box; border-radius: 0 !important; box-shadow: none !important; }
`;

// A drawing's tool name, e.g. "Fibonacci Retracement"
const nameOf = (annotation: IAnnotation) => DRAWING_TOOL_BY_ID.get(annotation.type)?.label ?? annotation.type;

export function EditingDrawingsChart() {
    const [chartApi, setChartApi] = React.useState<ISciFinanceChartPanelApi>();
    const [message, setMessage] = React.useState("Click the Fibonacci retracement to select it, or press Edit in the list");
    // The element the full editor is mounted in. useDrawingTools reads its options once, when it
    // attaches the controller, so render the editor's element before the chart is ready
    const editorRef = React.useRef<HTMLDivElement>(null);
    const options = React.useMemo(
        () => ({
            // "More" on the quick-edit toolbar opens the full editor, every option of the drawing, here
            get editorContainer() {
                return editorRef.current ?? undefined;
            },
            editorRootClassName: "docked-editor",
            editorPanelClassName: "docked-editor-panel",
            // Called as the full editor opens, e.g. to show the panel that holds it
            onOpenFullEditor: (annotation: IAnnotation) => setMessage(`Full editor opened for ${nameOf(annotation)}`),
        }),
        []
    );
    const { controller, drawings } = useDrawingTools(chartApi, options);

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

    // A drawing to edit: a Fibonacci retracement of the last 90 candles' move
    const onInit = (api: ISciFinanceChartPanelApi) => {
        const chart = api.financeApi;
        const candles = getCandles(chart);
        const n = candles.times.length;
        const low = lowest(candles, n - 90, n);
        const high = highest(candles, n - 90, n);
        chart.chartPanes
            .get(PaneId.DEFAULT)
            .surface.annotations.add(
                new FibonacciRetracementAnnotation({ points: low.x < high.x ? [low, high] : [high, low], isEditable: true })
            );
        setChartApi(api);
    };

    // Events for selection and edits come from each drawing's annotation (SciChart's IAnnotation):
    // selectedChanged when it is selected or deselected, dragEnded when the user has moved it or one
    // of its points. Subscribe to each drawing, and unsubscribe when it goes
    React.useEffect(() => {
        const unsubscribe = drawings.map(({ annotation }) => {
            const onSelected = (selected: boolean) => setMessage(`${nameOf(annotation)} ${selected ? "selected" : "deselected"}`);
            const onMoved = () => setMessage(`${nameOf(annotation)} moved`);
            // The events are on AnnotationBase, which every drawing extends; `annotation` is typed as IAnnotation
            const events = annotation as AnnotationBase;
            events.selectedChanged.subscribe(onSelected);
            events.dragEnded.subscribe(onMoved);
            return () => {
                events.selectedChanged.unsubscribe(onSelected);
                events.dragEnded.unsubscribe(onMoved);
            };
        });
        return () => unsubscribe.forEach((u) => u());
    }, [drawings]);

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <style>{EDITOR_CSS}</style>
            <DrawingToolbar controller={controller} orientation="horizontal" />
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <SciFinanceChartView config={config} onInit={onInit} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", width: 320 }}>
                    {/* Clicking a row selects the drawing; its edit button opens the full editor for it */}
                    <DrawingList
                        controller={controller}
                        title="Drawings"
                        onEdit={(id) => {
                            const item = drawings.find((d) => d.id === id);
                            if (item) controller.openEditor(item);
                        }}
                        style={{ maxHeight: "40%", overflowY: "auto" }}
                    />
                    <div ref={editorRef} style={{ flex: 1, minHeight: 0, overflowY: "auto" }} />
                </div>
            </div>
            <div style={logStyle}>{message}</div>
        </div>
    );
}
// ---------------------------------------------------------------------------------------------
// Not part of the SDK: helpers that read the loaded candles, to choose where to place drawings
// ---------------------------------------------------------------------------------------------

// The loaded candles: times in seconds (the x values of a SciTrader chart), and prices
function getCandles(chart: SciFinanceChart) {
    const dm = chart.dataManager;
    const values = (name: EDataSourceStringId) => dm.getValues<number>(dm.getSourceIdByName(DEFAULT_FEED_ID, name));
    return {
        times: dm.xValues,
        highs: values(EDataSourceStringId.HIGH),
        lows: values(EDataSourceStringId.LOW),
        closes: values(EDataSourceStringId.CLOSE),
    };
}
type TCandles = ReturnType<typeof getCandles>;

// The lowest low, or highest high, of candles [from, to), as a point on the chart
function lowest(c: TCandles, from: number, to: number): Point {
    let i = from;
    for (let j = from; j < to; j++) if (c.lows[j] < c.lows[i]) i = j;
    return new Point(c.times[i], c.lows[i]);
}
function highest(c: TCandles, from: number, to: number): Point {
    let i = from;
    for (let j = from; j < to; j++) if (c.highs[j] > c.highs[i]) i = j;
    return new Point(c.times[i], c.highs[i]);
}

const logStyle: React.CSSProperties = {
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderTop: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: 13,
};
