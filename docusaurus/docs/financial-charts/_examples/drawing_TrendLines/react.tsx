import "scichart-scitrader/scitrader.css";
import * as React from "react";
import { Point } from "scichart";
import {
    ETradingAnnotationType,
    ExtendedLineAnnotation,
    HorizontalTrendLineAnnotation,
} from "scichart-financial-tools";
import {
    CandleInterval,
    CoinbaseExchange,
    DEFAULT_FEED_ID,
    defaultExchangeProvider,
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
import { SciFinanceChartView, useDrawingTools } from "scichart-scitrader-react";

// Once, at app startup: register a data source, and the drawing tools' annotation types.
// registerDrawingTools() makes drawings added in code count as user drawings, listed and saved with the chart
defaultExchangeProvider.registerExchange(CoinbaseExchange, idbPriceStore);
registerDrawingTools();

export function TrendLinesChart() {
    const [chartApi, setChartApi] = React.useState<ISciFinanceChartPanelApi>();
    // useDrawingTools attaches a DrawingToolsController once the chart is ready, and detaches it on unmount
    const { controller } = useDrawingTools(chartApi);

    // Create the config once per mounted chart: studies are live objects bound to one chart
    const config = React.useMemo<ISciFinanceChartPanelConfig>(
        () => ({
            exchangeName: CoinbaseExchange.name, // name="Coinbase" matches the built-in CoinbaseExchange
            symbol: "ETH-USD",
            interval: CandleInterval.SIX_HOURS,
            period: "3M",
            studies: [new OHLCStudy(), new VolumeStudy()],
        }),
        []
    );

    // Once the chart has loaded its candles, add a drawing in code: create its annotation with its
    // points in data coordinates (x: a candle's time in seconds, y: a price), and add it to the price pane
    const onInit = (api: ISciFinanceChartPanelApi) => {
        const chart = api.financeApi;
        const candles = getCandles(chart);
        const pricePane = chart.chartPanes.get(PaneId.DEFAULT).surface;
        // A support trend line through the lowest lows of the two halves of the last 90 candles,
        // extended to the right, so it projects where support may be next
        const n = candles.times.length;
        pricePane.annotations.add(
            new ExtendedLineAnnotation({
                points: [lowest(candles, n - 90, n - 45), lowest(candles, n - 45, n)],
                extendEnd: true, // continue past the second point
                stroke: "#26a69a",
                strokeThickness: 2,
                isEditable: true, // the user can select, drag and edit it
            })
        );
        // A horizontal resistance line at the highest high of the last 90 candles: one point sets its price
        pricePane.annotations.add(
            new HorizontalTrendLineAnnotation({
                points: [highest(candles, n - 90, n)],
                stroke: "#ef5350",
                strokeThickness: 2,
                isEditable: true,
            })
        );
        setChartApi(api);
    };

    // Fills its parent, so give the parent a height
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Point-and-click drawing: selectTool starts a tool, and the user clicks the chart to place its points */}
            <div style={toolbarStyle}>
                <button style={buttonStyle} disabled={!controller} onClick={() => controller.selectTool(ETradingAnnotationType.ExtendedLineAnnotation)}>
                    Draw a trend line
                </button>
                <button style={buttonStyle} disabled={!controller} onClick={() => controller.selectTool(ETradingAnnotationType.HorizontalTrendLineAnnotation)}>
                    Draw a horizontal line
                </button>
                <button style={buttonStyle} disabled={!controller} onClick={() => controller.remove()}>
                    Remove all
                </button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <SciFinanceChartView config={config} onInit={onInit} />
            </div>
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

// The toolbar uses SciTrader's UI colours: its --st-ui-* CSS variables, with the stylesheet's defaults
const toolbarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    padding: 8,
    background: "var(--st-ui-background, #2b2839)",
    borderBottom: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
};
const buttonStyle: React.CSSProperties = {
    padding: "4px 10px",
    border: "1px solid var(--st-ui-divider, rgba(255,255,255,0.1))",
    borderRadius: 6,
    background: "var(--st-ui-surface, #373447)",
    color: "var(--st-ui-text, #ffffff)",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
};
