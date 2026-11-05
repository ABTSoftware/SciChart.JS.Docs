import "scichart-scitrader/scitrader.css";
import { Point } from "scichart";
import {
    ETradingAnnotationType,
    StopLossTakeProfitAnnotation,
} from "scichart-financial-tools";
import {
    CandleInterval,
    CoinbaseExchange,
    DEFAULT_FEED_ID,
    defaultExchangeProvider,
    DrawingToolsController,
    EDataSourceStringId,
    idbPriceStore,
    OHLCStudy,
    PaneId,
    registerDrawingTools,
    SciFinanceChart,
    SciFinanceChartPanel,
    VolumeStudy,
} from "scichart-scitrader";

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
        interval: CandleInterval.SIX_HOURS,
        period: "1M",
        studies: [new OHLCStudy(), new VolumeStudy()],
    });
    const chart = financeChartPanel.financeApi;

    // 1. Add a drawing in code: create its annotation with its points in data coordinates
    // (x: a candle's time in seconds, y: a price), and add it to the price pane's surface
    const candles = getCandles(chart);
    const pricePane = chart.chartPanes.get(PaneId.DEFAULT).surface;
    // A long trade entered at the close 30 candles ago, with a take-profit 6% above the entry and a
    // stop-loss 3% below it. Point 1 is the entry; point 2 the target, which also sets the zone's width
    const n = candles.times.length;
    const entry = new Point(candles.times[n - 30], candles.closes[n - 30]);
    const end = candles.times[n - 1];
    pricePane.annotations.add(
        new StopLossTakeProfitAnnotation({ points: [entry, new Point(end, entry.y * 1.06)], isEditable: true }),
        new StopLossTakeProfitAnnotation({ points: [entry, new Point(end, entry.y * 0.97)], isEditable: true })
    );

    // 2. Point-and-click drawing: the controller adds the drawing modifiers to every pane.
    // selectTool starts a tool, and the user clicks the chart to place its points
    const drawing = DrawingToolsController.attach(chart);
    toolbar.append(
        button("Draw a stop loss / take profit", () => drawing.selectTool(ETradingAnnotationType.StopLossTakeProfitAnnotation)),
        button("Measure", () => drawing.selectTool(ETradingAnnotationType.MeasureAnnotation)),
        button("Remove all", () => drawing.remove()) // every drawing, the ones added in code too
    );

    // When the page goes away: drawing.detach(); financeChartPanel.cleanup();
    return { financeChartPanel, drawing };
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

function button(text: string, onClick: () => void) {
    const b = document.createElement("button");
    b.textContent = text;
    b.onclick = onClick;
    Object.assign(b.style, buttonStyle);
    return b;
}

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: Partial<CSSStyleDeclaration> = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle: Partial<CSSStyleDeclaration> = {
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
