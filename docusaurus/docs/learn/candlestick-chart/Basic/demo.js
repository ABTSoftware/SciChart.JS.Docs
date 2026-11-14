import * as SciChart from "scichart";

// Generates daily OHLC (open, high, low, close) prices with a seeded random walk,
// so the chart looks the same every time and needs no market data feed.
function generateCandles(count = 150) {
    let seed = 42;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const xValues = [];
    const openValues = [];
    const highValues = [];
    const lowValues = [];
    const closeValues = [];
    const startDate = Date.UTC(2025, 0, 1) / 1000; // SciChart expects Unix timestamps in seconds
    let close = 100;
    for (let i = 0; i < count; i++) {
        const open = close;
        close = Math.max(5, open + (random() - 0.48) * 4);
        xValues.push(startDate + i * 24 * 60 * 60);
        openValues.push(open);
        closeValues.push(close);
        highValues.push(Math.max(open, close) + random() * 2);
        lowValues.push(Math.min(open, close) - random() * 2);
    }
    return { xValues, openValues, highValues, lowValues, closeValues };
}

async function candlestickChart(divElementId) {
    // #region_A_start
    // Create a JavaScript candlestick chart with SciChart.js
    const {
        SciChartSurface,
        CategoryAxis,
        NumericAxis,
        FastCandlestickRenderableSeries,
        OhlcDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // A CategoryAxis spaces candles evenly, closing gaps for weekends and holidays
    const xAxis = new CategoryAxis(wasmContext);
    // Show dates day first: "21 Jan" on the axis and "21 Jan 2025" in the tooltip (x values are Unix timestamps in seconds)
    xAxis.labelProvider.formatLabel = (unixSeconds) =>
        new Date(unixSeconds * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
    xAxis.labelProvider.formatCursorLabel = (unixSeconds) =>
        new Date(unixSeconds * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrefix: "$", labelPrecision: 2 }));

    // Your data: one open, high, low and close value per period
    const { xValues, openValues, highValues, lowValues, closeValues } = generateCandles();

    sciChartSurface.renderableSeries.add(
        new FastCandlestickRenderableSeries(wasmContext, {
            dataSeries: new OhlcDataSeries(wasmContext, { xValues, openValues, highValues, lowValues, closeValues }),
            dataPointWidth: 0.7,
            brushUp: "#26a69a",
            strokeUp: "#26a69a",
            brushDown: "#ef5350",
            strokeDown: "#ef5350",
            strokeThickness: 1
        })
    );

    // Zoom with the mouse wheel, pan by dragging, double-click to reset, and hover for OHLC values
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

candlestickChart("scichart-root");
