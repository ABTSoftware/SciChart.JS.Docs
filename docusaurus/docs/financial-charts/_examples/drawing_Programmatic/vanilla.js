import "scichart-scitrader/scitrader.css";
import { Point } from "scichart";
import { ETradingAnnotationType, ExtendedLineAnnotation, FibonacciRetracementAnnotation, HorizontalTrendLineAnnotation, } from "scichart-financial-tools";
import { CandleInterval, CoinbaseExchange, DEFAULT_FEED_ID, defaultExchangeProvider, DrawingList, DrawingToolsController, EDataSourceStringId, idbPriceStore, OHLCStudy, PaneId, registerDrawingTools, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div style="display: flex; flex: 1; min-height: 0">
//         <div id="chart" style="flex: 1; min-width: 0"></div>
//         <div id="drawings" style="width: 280px; overflow-y: auto"></div>
//     </div>
// </div>
// Once, at app startup: register a data source, and the drawing tools' annotation types.
// registerDrawingTools() makes drawings added in code count as user drawings: listed, saved with the
// chart, and restyled by its theme. Without it they still draw, but as plain annotations
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
registerDrawingTools();
async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi;
    // The controller isn't needed to add drawings in code. Here it lists them (drawings,
    // drawingsChanged), removes them, and lets the user select and edit them
    const drawing = DrawingToolsController.attach(chart);
    // Add drawings in code: create each annotation with its points in data coordinates
    // (x: a candle's time in seconds, y: a price), and add it to a pane's surface
    const addDrawings = () => {
        const candles = getCandles(chart);
        const n = candles.times.length;
        const pricePane = chart.chartPanes.get(PaneId.DEFAULT).surface;
        const low = lowest(candles, n - 90, n);
        const high = highest(candles, n - 90, n);
        pricePane.annotations.add(
        // A Fibonacci retracement of the last 90 candles' move, from the low to the high in time order
        new FibonacciRetracementAnnotation({ points: low.x < high.x ? [low, high] : [high, low], isEditable: true }), 
        // A trend line through two lows, extended to the right
        new ExtendedLineAnnotation({
            points: [lowest(candles, n - 90, n - 45), lowest(candles, n - 45, n)],
            extendEnd: true,
            stroke: "#26a69a",
            strokeThickness: 2,
            isEditable: true,
        }), 
        // A horizontal line at the latest close
        new HorizontalTrendLineAnnotation({
            points: [new Point(candles.times[n - 1], candles.closes[n - 1])],
            stroke: "#ff9f1c",
            isEditable: true,
        }));
    };
    addDrawings();
    // The drawing list follows the controller: a row per drawing, with select and delete
    const list = DrawingList.create(document.getElementById("drawings"), { controller: drawing, title: "Drawings" });
    toolbar.append(button("Add the drawings again", addDrawings), 
    // drawing.drawings lists the user's drawings, oldest first. Each has a type, a toolId and its annotation
    button("Remove the Fibonacci retracements", () => drawing.drawings
        .filter((d) => d.type === ETradingAnnotationType.FibonacciRetracementAnnotation)
        .forEach((d) => drawing.remove(d))), button("Remove all", () => drawing.remove()) // remove() with no drawing removes every one
    );
    // When the page goes away: list.destroy(); drawing.detach(); financeChartPanel.cleanup();
    return { financeChartPanel, drawing, list };
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
function button(text, onClick) {
    const b = document.createElement("button");
    b.textContent = text;
    b.onclick = onClick;
    Object.assign(b.style, buttonStyle);
    return b;
}
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle = {
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: "6px",
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: "13px",
    cursor: "pointer",
};
createChart();
