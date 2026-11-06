import "scichart-scitrader/scitrader.css";
import { EVerticalTextPosition, Point } from "scichart";
import { EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, PolyLineAnnotation, } from "scichart-financial-tools";
import { CandleInterval, CoinbaseExchange, DEFAULT_FEED_ID, defaultExchangeProvider, DrawingToolsController, EDataSourceStringId, EDrawingToolVariantId, idbPriceStore, OHLCStudy, PaneId, registerDrawingTools, SciFinanceChartPanel, VolumeStudy, } from "scichart-scitrader";
// This example expects this HTML:
// <div style="display: flex; flex-direction: column; height: 100%">
//     <div id="toolbar"></div>
//     <div id="chart" style="flex: 1; min-height: 0"></div>
// </div>
// Once, at app startup: register a data source, and the drawing tools' annotation types.
// registerDrawingTools() makes drawings added in code count as user drawings, listed and saved with the chart
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
registerDrawingTools();
async function createChart() {
    const toolbar = document.getElementById("toolbar");
    Object.assign(toolbar.style, toolbarStyle);
    const financeChartPanel = await SciFinanceChartPanel.create(document.getElementById("chart"), {
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.ONE_DAY,
        period: "1Y",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi;
    // 1. Add a drawing in code: create its annotation with its points in data coordinates
    // (x: a candle's time in seconds, y: a price), and add it to the price pane's surface
    const candles = getCandles(chart);
    const pricePane = chart.chartPanes.get(PaneId.DEFAULT).surface;
    // An Elliott impulse wave, (0) to (5), on a zigzag of alternating lows and highs over the last
    // 180 candles. It shows how to draw one; it is not a wave count of this market
    pricePane.annotations.add(new PolyLineAnnotation(patternOptions(zigzag(candles, 180, 6), ["(0)", "(1)", "(2)", "(3)", "(4)", "(5)"], "#7C3AED", "#7C3AED33")));
    // 2. Point-and-click drawing: the controller adds the drawing modifiers to every pane.
    // selectTool starts a tool, and the user clicks the chart to place its points
    const drawing = DrawingToolsController.attach(chart);
    toolbar.append(button("Draw an impulse wave (12345)", () => drawing.selectTool(EDrawingToolVariantId.PatternElliottImpulse)), button("Draw a correction wave (ABC)", () => drawing.selectTool(EDrawingToolVariantId.PatternElliottCorrection)), button("Remove all", () => drawing.remove()) // every drawing, the ones added in code too
    );
    // When the page goes away: drawing.detach(); financeChartPanel.cleanup();
    return { financeChartPanel, drawing };
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
// A zigzag of `count` points over the last `candleCount` candles: the lowest low of the first
// stretch, the highest high of the next, and so on
function zigzag(c, candleCount, count) {
    const n = c.times.length;
    const size = Math.floor(candleCount / count);
    return Array.from({ length: count }, (_, k) => {
        const from = n - candleCount + k * size;
        return k % 2 === 0 ? lowest(c, from, from + size) : highest(c, from, from + size);
    });
}
// The options the SDK's pattern tools use: a poly line with a label at each point.
// The label text identifies the pattern, e.g. in the drawing list
function patternOptions(points, labels, stroke, fill) {
    return {
        points,
        isEditable: true, // the user can select, drag and edit it
        stroke,
        fill, // shades the triangles between consecutive legs
        strokeThickness: 3,
        pointLabelVisibility: EAnnotationVisibilityMode.Always,
        labels: labels.map((text, pointIndex) => ({
            anchorMode: EMultiPointLabelAnchorMode.Point,
            pointIndex,
            verticalTextPosition: EVerticalTextPosition.Below,
            yOffset: 10,
            text,
        })),
        // Registered by registerDrawingTools(): puts each label above its point at a peak, below at a trough
        formatLabelStyle: "SciTraderPatternLabelStyle",
    };
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
