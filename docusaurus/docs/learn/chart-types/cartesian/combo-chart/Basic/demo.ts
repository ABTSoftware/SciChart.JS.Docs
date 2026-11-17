import * as SciChart from "scichart";

// Example data: one warehouse's shipments per month, and the average time from order to dispatch.
// These are illustrative numbers, not real statistics.
function getWarehouseData() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const shipments = [3120, 2980, 3410, 3350, 3580, 3490, 3260, 3300, 3720, 4150, 5480, 6130];
    const dispatchHours = [18.5, 18.1, 19.0, 18.7, 19.4, 19.1, 18.3, 18.6, 20.2, 22.8, 29.5, 33.1];
    return { months, shipments, dispatchHours };
}

async function comboChart(divElementId) {
    // #region_A_start
    // Create a JavaScript combo chart with SciChart.js: columns and a line on one chart, each with its own y-axis
    const {
        SciChartSurface,
        NumericAxis,
        FastColumnRenderableSeries,
        FastLineRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        TextLabelProvider,
        EAxisAlignment,
        EAutoRange,
        NumberRange,
        SciChartJsNavyTheme,
        LegendModifier,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        WaveAnimation
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // One colour per series, used for the series and for its axis, so readers can tell which axis belongs to which
    const columnColour = "#50C7E0";
    const lineColour = "#F48420";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Your data: one x value per month, with a value for each series
    const { months, shipments, dispatchHours } = getWarehouseData();
    const xValues = months.map((_, index) => index);

    // Shared X axis: one month name per column, at x = 0, 1, 2, ...
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            labelProvider: new TextLabelProvider({ labels: months }),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            growBy: new NumberRange(0.12, 0.05) // extra space on the left keeps the first column clear of the chart's bottom corner
        })
    );

    // Left Y axis: shipments. Columns must start at zero, so the axis starts at zero
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            axisTitle: "Shipments per month",
            axisTitleStyle: { color: columnColour },
            labelStyle: { color: columnColour },
            labelPrecision: 0,
            growBy: new NumberRange(0, 0.1)
        })
    );

    // Right Y axis: average dispatch time in hours, fixed at 0 to 40 so the line's slope isn't exaggerated.
    // Its grid lines are hidden, so only the left axis draws grid lines
    const hoursAxis = new NumericAxis(wasmContext, {
        id: "hoursAxis",
        axisAlignment: EAxisAlignment.Right,
        axisTitle: "Average dispatch time (hours)",
        axisTitleStyle: { color: lineColour },
        labelStyle: { color: lineColour },
        autoRange: EAutoRange.Never,
        visibleRange: new NumberRange(0, 40),
        autoTicks: false,
        majorDelta: 10,
        minorDelta: 5,
        labelPrecision: 0,
        drawMajorGridLines: false,
        drawMinorGridLines: false
    });
    hoursAxis.labelProvider.cursorPrecision = 1; // show one decimal place (e.g. 29.5 h) in the tooltip
    sciChartSurface.yAxes.add(hoursAxis);

    // The columns: shipments, drawn against the default (left) y-axis
    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: shipments,
                dataSeriesName: "Shipments"
            }),
            fill: columnColour + "CC", // one colour for every column: the colour identifies the series
            stroke: columnColour,
            strokeThickness: 2,
            dataPointWidth: 0.6,
            cornerRadius: 8,
            // Columns grow in a wave when the chart first appears
            animation: new WaveAnimation({ duration: 1000 })
        })
    );

    // The line: dispatch time, drawn against the right-hand axis. It's added second, so it draws on top of the columns
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            yAxisId: "hoursAxis",
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: dispatchHours,
                dataSeriesName: "Average dispatch time (h)"
            }),
            stroke: lineColour,
            strokeThickness: 4,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 13,
                height: 13,
                strokeThickness: 2,
                stroke: lineColour,
                fill: "#14233C"
            })
        })
    );

    // A legend naming each series, a tooltip with both values, mouse-wheel zoom, drag to pan and double-click to reset
    sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true }),
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

comboChart("scichart-root");
