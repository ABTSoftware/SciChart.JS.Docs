import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { Point } from "scichart";
import { ETradingAnnotationType, FibonacciRetracementAnnotation, } from "scichart-financial-tools";
import { CandleInterval, CoinbaseExchange, DEFAULT_FEED_ID, defaultExchangeProvider, EDataSourceStringId, idbPriceStore, OHLCStudy, PaneId, registerDrawingTools, VolumeStudy, } from "scichart-scitrader";
import { SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";
// Once, at app startup: register a data source, and the drawing tools' annotation types.
// registerDrawingTools() makes drawings added in code count as user drawings, listed and saved with the chart
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
registerDrawingTools();
export function FibonacciRetracementChart() {
    const [chartApi, setChartApi] = React.useState();
    // useDrawingTools attaches a DrawingToolsController once the chart is ready, and detaches it on unmount
    const { controller } = useDrawingTools(chartApi);
    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo(() => ({
        exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
        symbol: "BTC-USD",
        interval: CandleInterval.SIX_HOURS,
        period: "3M",
        studies: [new OHLCStudy(), new VolumeStudy()],
    }), []);
    // Once the chart has loaded its candles, add a drawing in code: create its annotation with its
    // points in data coordinates (x: a candle's time in seconds, y: a price), and add it to the price pane
    const onInit = (api) => {
        const chart = api.financeApi;
        const candles = getCandles(chart);
        const pricePane = chart.chartPanes.get(PaneId.DEFAULT).surface;
        // A Fibonacci retracement of the last 90 candles' move: from the lowest low to the highest high,
        // in time order. Its levels are measured back from the second point
        const n = candles.times.length;
        const low = lowest(candles, n - 90, n);
        const high = highest(candles, n - 90, n);
        pricePane.annotations.add(new FibonacciRetracementAnnotation({
            points: low.x < high.x ? [low, high] : [high, low],
            isEditable: true, // the user can select, drag and edit it
            // The levels, as fractions of the move. Default: 0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.618, 2.618
            thresholds: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1],
        }));
        setChartApi(api);
    };
    // Fills its parent, so give the parent a height
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: toolbarStyle },
            React.createElement("button", { style: buttonStyle, disabled: !controller, onClick: () => controller.selectTool(ETradingAnnotationType.FibonacciRetracementAnnotation) }, "Draw a Fibonacci retracement"),
            React.createElement("button", { style: buttonStyle, disabled: !controller, onClick: () => controller.selectTool(ETradingAnnotationType.FibonacciExtensionAnnotation) }, "Draw a Fibonacci extension"),
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
