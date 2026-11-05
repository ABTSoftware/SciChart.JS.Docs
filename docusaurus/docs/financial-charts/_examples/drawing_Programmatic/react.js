import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { Point } from "scichart";
import { ETradingAnnotationType, ExtendedLineAnnotation, FibonacciRetracementAnnotation, HorizontalTrendLineAnnotation, } from "scichart-financial-tools";
import { CandleInterval, CoinbaseExchange, DEFAULT_FEED_ID, defaultExchangeProvider, EDataSourceStringId, idbPriceStore, OHLCStudy, PaneId, registerDrawingTools, VolumeStudy, } from "scichart-scitrader";
import { DrawingList, SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";
// Once, at app startup: register a data source, and the drawing tools' annotation types.
// registerDrawingTools() makes drawings added in code count as user drawings: listed, saved with the
// chart, and restyled by its theme. Without it they still draw, but as plain annotations
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
registerDrawingTools();
// Add drawings in code: create each annotation with its points in data coordinates
// (x: a candle's time in seconds, y: a price), and add it to a pane's surface
function addDrawings(chart) {
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
}
export function ProgrammaticDrawingChart() {
    const [chartApi, setChartApi] = React.useState();
    // The controller isn't needed to add drawings in code. Here it lists them (drawings, as React
    // state), removes them, and lets the user select and edit them
    const { controller, drawings } = useDrawingTools(chartApi);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy()],
    }), []);
    // Add the drawings once the chart has loaded its candles
    const onInit = (api) => {
        addDrawings(api.financeApi);
        setChartApi(api);
    };
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement("button", { style: buttonStyle, disabled: !chartApi, onClick: () => addDrawings(chartApi.financeApi) }, "Add the drawings again"),
            React.createElement("button", { style: buttonStyle, disabled: !controller, onClick: () => drawings
                    .filter((d) => d.type === ETradingAnnotationType.FibonacciRetracementAnnotation)
                    .forEach((d) => controller.remove(d)) }, "Remove the Fibonacci retracements"),
            React.createElement("button", { style: buttonStyle, disabled: !controller, onClick: () => controller.remove() }, "Remove all")),
        React.createElement("div", { style: { display: "flex", flex: 1, minHeight: 0 } },
            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement(SciFinanceChartView, { config: config, onInit: onInit })),
            React.createElement(DrawingList, { controller: controller, title: "Drawings", style: { width: 280, overflowY: "auto" } }))));
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
