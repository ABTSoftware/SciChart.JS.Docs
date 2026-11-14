import * as SciChart from "scichart";

// Generates daily OHLC (open, high, low, close) prices for weekdays only, with a seeded
// random walk, so the chart looks the same every time and needs no market data feed.
// The prices are illustrative, not real market data.
function generateOhlcBars(count = 80) {
    let seed = 2024;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const xValues = [];
    const openValues = [];
    const highValues = [];
    const lowValues = [];
    const closeValues = [];
    const day = 24 * 60 * 60;
    let time = Date.UTC(2025, 2, 3) / 1000; // Monday 3 March 2025, as a Unix timestamp in seconds
    let close = 60;
    while (xValues.length < count) {
        const weekday = new Date(time * 1000).getUTCDay();
        if (weekday !== 0 && weekday !== 6) {
            // Each day opens a little away from the previous close, then moves
            const open = Math.max(5, close + (random() - 0.5) * 0.8);
            close = Math.max(5, open + (random() - 0.45) * 2.4);
            xValues.push(time);
            openValues.push(open);
            closeValues.push(close);
            highValues.push(Math.max(open, close) + random() * 0.8);
            lowValues.push(Math.min(open, close) - random() * 0.8);
        }
        time += day;
    }
    return { xValues, openValues, highValues, lowValues, closeValues };
}

async function ohlcChart(divElementId) {
    // #region_A_start
    // Create a JavaScript OHLC chart with SciChart.js
    const {
        SciChartSurface,
        CategoryAxis,
        NumericAxis,
        FastOhlcRenderableSeries,
        OhlcDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        NumberRange
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // A CategoryAxis spaces bars evenly, so weekends and holidays leave no gaps
    const xAxis = new CategoryAxis(wasmContext);
    // Show dates day first: "21 Jan" on the axis and "21 Jan 2025" in the tooltip (x values are Unix timestamps in seconds)
    xAxis.labelProvider.formatLabel = (unixSeconds) =>
        new Date(unixSeconds * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
    xAxis.labelProvider.formatCursorLabel = (unixSeconds) =>
        new Date(unixSeconds * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
    sciChartSurface.xAxes.add(xAxis);
    // growBy adds 10% space below the lowest bar (clear of the logo) and 5% above the highest
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { labelPrefix: "$", labelPrecision: 2, growBy: new NumberRange(0.1, 0.05) })
    );

    // Your data: one open, high, low and close value per period
    const { xValues, openValues, highValues, lowValues, closeValues } = generateOhlcBars();

    sciChartSurface.renderableSeries.add(
        new FastOhlcRenderableSeries(wasmContext, {
            dataSeries: new OhlcDataSeries(wasmContext, {
                dataSeriesName: "Price", // shown in the tooltip
                xValues,
                openValues,
                highValues,
                lowValues,
                closeValues
            }),
            // Each bar is a vertical high-low line, with the open tick on the left and the close tick on the right
            strokeUp: "#26a69a", // closed above its open
            strokeDown: "#ef5350", // closed below its open
            strokeThickness: 2,
            dataPointWidth: 0.8, // tick length as a fraction of each bar's slot
            // When you zoom far out, hide the open and close ticks so the bars stay readable
            autoSimplify: true
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

ohlcChart("scichart-root");
