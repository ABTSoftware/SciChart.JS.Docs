import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { EVerticalTextPosition, Point } from "scichart";
import { EAnnotationVisibilityMode, EMultiPointLabelAnchorMode, PolyLineAnnotation, } from "scichart-financial-tools";
import { CandleInterval, CoinbaseExchange, DEFAULT_FEED_ID, defaultExchangeProvider, EDataSourceStringId, EDrawingToolVariantId, idbPriceStore, OHLCStudy, PaneId, registerDrawingTools, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";
// Once, at app startup: register a data source, and the drawing tools' annotation types.
// registerDrawingTools() makes drawings added in code count as user drawings, listed and saved with the chart
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
registerDrawingTools();
export function HarmonicPatternChart() {
    const [chartApi, setChartApi] = React.useState();
    // useDrawingTools attaches a DrawingToolsController once the chart is ready, and detaches it on unmount
    const { controller } = useDrawingTools(chartApi);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "ETH-USD",
        interval: CandleInterval.ONE_DAY,
        period: "1Y",
        studies: [new OHLCStudy(), new VolumeStudy()],
    }), []);
    // Once the chart has loaded its candles, add a drawing in code: create its annotation with its
    // points in data coordinates (x: a candle's time in seconds, y: a price), and add it to the price pane
    const onInit = (api) => {
        const chart = api.financeApi;
        const candles = getCandles(chart);
        const pricePane = chart.chartPanes.get(PaneId.DEFAULT).surface;
        // An XABCD pattern, 0 to D, on a zigzag of alternating lows and highs over the last 150 candles.
        // It shows how to draw one; it is not a harmonic pattern found in this market
        pricePane.annotations.add(new PolyLineAnnotation(patternOptions(zigzag(candles, 150, 6), ["0", "X", "A", "B", "C", "D"], "#0F766E", "#0F766E15")));
        setChartApi(api);
    };
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement("button", { style: buttonStyle, disabled: !controller, onClick: () => controller.selectTool(EDrawingToolVariantId.PatternXabcd) }, "Draw an XABCD pattern"),
            React.createElement("button", { style: buttonStyle, disabled: !controller, onClick: () => controller.remove() }, "Remove all")),
        React.createElement("div", { style: { flex: 1, minHeight: 0 } },
            React.createElement(SciFinanceChartView, { config: config, onInit: onInit }))));
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
// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle = {
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
};
