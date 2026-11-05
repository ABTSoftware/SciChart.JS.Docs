import "scichart-scitrader/scitrader.css";
import { Point } from "scichart";
import { FibonacciRetracementAnnotation } from "scichart-financial-tools";
import { CandleInterval, CoinbaseExchange, DEFAULT_FEED_ID, defaultExchangeProvider, DRAWING_TOOL_BY_ID, DrawingList, DrawingToolbar, DrawingToolsController, EDataSourceStringId, idbPriceStore, OHLCStudy, PaneId, registerDrawingTools, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="tools"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//         <div style="display: flex; flex-direction: column; width: 320px">
//             <div id="drawings" style="max-height: 40%; overflow-y: auto"></div>
//             <div id="editor" style="flex: 1; min-height: 0; overflow-y: auto"></div>
//         </div>
//     </div>
//     <div id="log"></div>
// </div>
// Once, at app startup: register a data source, and the drawing tools' annotation types
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
registerDrawingTools();
// The full editor sets its own position and look inline, as a floating panel. These rules dock it in
// its container instead: give the editor these classes with editorRootClassName and editorPanelClassName
const EDITOR_CSS = `
.docked-editor { position: static !important; inset: auto !important; width: 100% !important; height: 100% !important; overflow-y: auto; }
.docked-editor-panel { width: 100% !important; max-height: 100% !important; box-sizing: border-box; border-radius: 0 !important; box-shadow: none !important; }
`;
async function createChart() {
    const log = document.getElementById("log");
    Object.assign(log.style, logStyle);
    const say = (text) => (log.textContent = text);
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi;
    // A drawing to edit: a Fibonacci retracement of the last 90 candles' move
    const candles = getCandles(chart);
    const n = candles.times.length;
    const low = lowest(candles, n - 90, n);
    const high = highest(candles, n - 90, n);
    chart.chartPanes
        .get(PaneId.DEFAULT)
        .surface.annotations.add(new FibonacciRetracementAnnotation({ points: low.x < high.x ? [low, high] : [high, low], isEditable: true }));
    // Editing a drawing. Click a drawing to select it: the quick-edit toolbar appears on it, with its
    // colour, thickness, line style, a delete button and a "more" button. "More" opens the full editor,
    // every option of the drawing, in editorContainer. Without editorContainer there is no "more" button
    document.head.append(Object.assign(document.createElement("style"), { textContent: EDITOR_CSS }));
    const drawing = DrawingToolsController.attach(chart, {
        editorContainer: document.getElementById("editor"),
        editorRootClassName: "docked-editor",
        editorPanelClassName: "docked-editor-panel",
        // Called as the full editor opens, e.g. to show the panel that holds it
        onOpenFullEditor: (annotation) => say(`Full editor opened for ${nameOf(annotation)}`),
    });
    // The drawing tools rail, to draw more
    const toolbar = DrawingToolbar.create(document.getElementById("tools"), drawing, { orientation: "horizontal" });
    // The drawing list: clicking a row selects the drawing (select), and its edit button opens the
    // full editor for it (openEditor), as the quick-edit toolbar's "more" button does
    const list = DrawingList.create(document.getElementById("drawings"), {
        controller: drawing,
        title: "Drawings",
        onEdit: (id) => {
            const item = drawing.drawings.find((d) => d.id === id);
            if (item)
                drawing.openEditor(item);
        },
    });
    // Events for selection and edits come from each drawing's annotation (SciChart's IAnnotation):
    // selectedChanged when it is selected or deselected, dragEnded when the user has moved it or one
    // of its points. Subscribe to each new drawing as drawingsChanged reports it
    const watched = new Set();
    const watch = (items) => items
        .filter((item) => !watched.has(item.annotation))
        .forEach(({ annotation }) => {
        watched.add(annotation);
        // The events are on AnnotationBase, which every drawing extends; `annotation` is typed as IAnnotation
        const events = annotation;
        events.selectedChanged.subscribe((selected) => say(`${nameOf(annotation)} ${selected ? "selected" : "deselected"}`));
        events.dragEnded.subscribe(() => say(`${nameOf(annotation)} moved`));
    });
    drawing.drawingsChanged.subscribe((items) => {
        say(`${items.length} drawing(s) on the chart`);
        watch(items);
    });
    watch(drawing.drawings);
    say("Click the Fibonacci retracement to select it, or press Edit in the list");
    // When the page goes away: list.destroy(); toolbar.destroy(); drawing.detach(); financeChartPanel.cleanup();
    return { financeChartPanel, drawing, list, toolbar };
}
// A drawing's tool name, e.g. "Fibonacci Retracement"
const nameOf = (annotation) => DRAWING_TOOL_BY_ID.get(annotation.type)?.label ?? annotation.type;
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
    fontSize: "13px",
};
createChart();
