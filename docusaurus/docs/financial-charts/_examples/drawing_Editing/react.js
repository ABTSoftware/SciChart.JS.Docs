import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { Point } from "scichart";
import { FibonacciRetracementAnnotation } from "scichart-financial-tools";
import { CandleInterval, CoinbaseExchange, DEFAULT_FEED_ID, defaultExchangeProvider, DRAWING_TOOL_BY_ID, EDataSourceStringId, idbPriceStore, OHLCStudy, PaneId, registerDrawingTools, VolumeStudy, } from "scichart-scitrader";
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
const nameOf = (annotation) => DRAWING_TOOL_BY_ID.get(annotation.type)?.label ?? annotation.type;
export function EditingDrawingsChart() {
    const [chartApi, setChartApi] = React.useState();
    const [message, setMessage] = React.useState("Click the Fibonacci retracement to select it, or press Edit in the list");
    // The element the full editor is mounted in. useDrawingTools reads its options once, when it
    // attaches the controller, so render the editor's element before the chart is ready
    const editorRef = React.useRef(null);
    const options = React.useMemo(() => ({
        // "More" on the quick-edit toolbar opens the full editor, every option of the drawing, here
        get editorContainer() {
            return editorRef.current ?? undefined;
        },
        editorRootClassName: "docked-editor",
        editorPanelClassName: "docked-editor-panel",
        // Called as the full editor opens, e.g. to show the panel that holds it
        onOpenFullEditor: (annotation) => setMessage(`Full editor opened for ${nameOf(annotation)}`),
    }), []);
    const { controller, drawings } = useDrawingTools(chartApi, options);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy()],
    }), []);
    // A drawing to edit: a Fibonacci retracement of the last 90 candles' move
    const onInit = (api) => {
        const chart = api.financeApi;
        const candles = getCandles(chart);
        const n = candles.times.length;
        const low = lowest(candles, n - 90, n);
        const high = highest(candles, n - 90, n);
        chart.chartPanes
            .get(PaneId.DEFAULT)
            .surface.annotations.add(new FibonacciRetracementAnnotation({ points: low.x < high.x ? [low, high] : [high, low], isEditable: true }));
        setChartApi(api);
    };
    // Events for selection and edits come from each drawing's annotation (SciChart's IAnnotation):
    // selectedChanged when it is selected or deselected, dragEnded when the user has moved it or one
    // of its points. Subscribe to each drawing, and unsubscribe when it goes
    React.useEffect(() => {
        const unsubscribe = drawings.map(({ annotation }) => {
            const onSelected = (selected) => setMessage(`${nameOf(annotation)} ${selected ? "selected" : "deselected"}`);
            const onMoved = () => setMessage(`${nameOf(annotation)} moved`);
            // The events are on AnnotationBase, which every drawing extends; `annotation` is typed as IAnnotation
            const events = annotation;
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
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("style", null, EDITOR_CSS),
        React.createElement(DrawingToolbar, { controller: controller, orientation: "horizontal" }),
        React.createElement("div", { style: { display: "flex", flex: 1, minHeight: 0 } },
            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement(SciFinanceChartView, { config: config, onInit: onInit })),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", width: 320 } },
                React.createElement(DrawingList, { controller: controller, title: "Drawings", onEdit: (id) => {
                        const item = drawings.find((d) => d.id === id);
                        if (item)
                            controller.openEditor(item);
                    }, style: { maxHeight: "40%", overflowY: "auto" } }),
                React.createElement("div", { ref: editorRef, style: { flex: 1, minHeight: 0, overflowY: "auto" } }))),
        React.createElement("div", { style: logStyle }, message)));
}
// ---------------------------------------------------------------------------------------------
// Not part of the SDK: helpers that read the loaded candles, to choose where to place drawings
// ---------------------------------------------------------------------------------------------
// The loaded candles: times in seconds (the x values of a SciTrader chart), and prices
function getCandles(chart) {
    const dm = chart.dataManager;
    const values = (name) => dm.getValues(dm.getSourceIdByName(DEFAULT_FEED_ID, name));
    return {
        times: dm.xValues,
        highs: values(EDataSourceStringId.HIGH),
        lows: values(EDataSourceStringId.LOW),
        closes: values(EDataSourceStringId.CLOSE),
    };
}
// The lowest low, or highest high, of candles [from, to), as a point on the chart
function lowest(c, from, to) {
    let i = from;
    for (let j = from; j < to; j++)
        if (c.lows[j] < c.lows[i])
            i = j;
    return new Point(c.times[i], c.lows[i]);
}
function highest(c, from, to) {
    let i = from;
    for (let j = from; j < to; j++)
        if (c.highs[j] > c.highs[i])
            i = j;
    return new Point(c.times[i], c.highs[i]);
}
const logStyle = {
    padding: "8px 12px",
    background: "var(--st-ui-background, #2b2839)",
    borderTop: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    color: "var(--st-ui-text-muted, #9da2bc)",
    fontSize: 13,
};
