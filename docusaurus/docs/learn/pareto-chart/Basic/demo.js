import * as SciChart from "scichart";

// Example data: support tickets logged in one quarter, counted by cause.
// These are illustrative numbers, not real statistics.
function getTicketData() {
    const causes = ["Sign-in", "Billing", "Slow pages", "Data export", "Notifications", "Mobile app", "Other"];
    const tickets = [168, 97, 61, 38, 22, 14, 10];
    return { causes, tickets };
}

async function paretoChart(divElementId) {
    // #region_A_start
    // Create a JavaScript Pareto chart with SciChart.js: sorted columns plus a cumulative percentage line
    const {
        SciChartSurface,
        NumericAxis,
        FastColumnRenderableSeries,
        FastLineRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        HorizontalLineAnnotation,
        TextLabelProvider,
        EAxisAlignment,
        EColumnDataLabelPosition,
        ELabelPlacement,
        EAutoRange,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        WaveAnimation
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Your data: one category and one count per column
    const { causes, tickets } = getTicketData();

    // 1. Sort the categories from largest to smallest ("Other" is usually kept last; here it is also the smallest)
    const order = tickets.map((_, index) => index).sort((a, b) => tickets[b] - tickets[a]);
    const sortedCauses = order.map((index) => causes[index]);
    const sortedTickets = order.map((index) => tickets[index]);

    // 2. Work out the running total as a percentage of the grand total
    const total = sortedTickets.reduce((sum, value) => sum + value, 0);
    let runningTotal = 0;
    const cumulativePercent = sortedTickets.map((value) => {
        runningTotal += value;
        return (runningTotal / total) * 100;
    });
    const xValues = sortedCauses.map((_, index) => index);

    // X axis: one category name per column, at x = 0, 1, 2, ...
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            labelProvider: new TextLabelProvider({ labels: sortedCauses }),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            growBy: new NumberRange(0.2, 0.05) // extra space on the left keeps the first column clear of the chart's bottom corner
        })
    );

    // Left Y axis: the count for each column
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            axisTitle: "Tickets",
            labelPrecision: 0,
            growBy: new NumberRange(0, 0.15)
        })
    );

    // Right Y axis: the cumulative percentage, fixed at 0% to 100% (plus a little headroom so the 100% marker isn't cut off)
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: "percentAxis",
            axisAlignment: EAxisAlignment.Right,
            axisTitle: "Cumulative % of tickets",
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(0, 104),
            autoTicks: false,
            majorDelta: 20,
            minorDelta: 10,
            labelPostfix: "%",
            labelPrecision: 0,
            drawMajorGridLines: false,
            drawMinorGridLines: false
        })
    );

    // The columns: counts sorted from largest to smallest
    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: sortedTickets,
                dataSeriesName: "Tickets"
            }),
            fill: "#50C7E0CC", // one colour: here colour carries no meaning
            stroke: "#50C7E0",
            strokeThickness: 2,
            dataPointWidth: 0.7,
            cornerRadius: 8,
            // Columns grow in a wave when the chart first appears
            animation: new WaveAnimation({ duration: 1000 }),
            // Show each column's count above it
            dataLabels: {
                color: "#ffffff",
                style: { fontSize: 16, fontFamily: "Arial" },
                precision: 0,
                positionMode: EColumnDataLabelPosition.Outside
            }
        })
    );

    // The line: cumulative percentage, drawn against the right-hand axis
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            yAxisId: "percentAxis",
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: cumulativePercent,
                dataSeriesName: "Cumulative %"
            }),
            stroke: "#FFFFFF",
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 12,
                height: 12,
                strokeThickness: 3,
                stroke: "#FFFFFF",
                fill: "#E8336D"
            })
        })
    );

    // The 80% reference line: the categories to its left are the "vital few"
    sciChartSurface.annotations.add(
        new HorizontalLineAnnotation({
            yAxisId: "percentAxis",
            y1: 80,
            stroke: "#E8336D",
            strokeThickness: 2,
            strokeDashArray: [8, 5],
            showLabel: true,
            labelPlacement: ELabelPlacement.TopLeft,
            labelValue: "80%",
            axisFontSize: 16,
            axisLabelFill: "#E8336D"
        })
    );

    // Zoom with the mouse wheel, pan by dragging, double-click to reset, and hover for values
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

paretoChart("scichart-root");
