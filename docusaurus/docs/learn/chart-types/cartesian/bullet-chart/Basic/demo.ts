import * as SciChart from "scichart";

// Example data: one quarter's sales for five regions, in thousands of dollars.
// Each region has its own target and its own limits for "poor" and "satisfactory".
// These are illustrative numbers, not real figures.
function getSalesData() {
    return [
        { region: "North", actual: 470, target: 450, poorTo: 300, satisfactoryTo: 420 },
        { region: "South", actual: 285, target: 380, poorTo: 250, satisfactoryTo: 350 },
        { region: "East", actual: 395, target: 400, poorTo: 260, satisfactoryTo: 380 },
        { region: "West", actual: 210, target: 300, poorTo: 220, satisfactoryTo: 290 },
        { region: "Online", actual: 540, target: 480, poorTo: 320, satisfactoryTo: 460 }
    ];
}

async function bulletChart(divElementId) {
    // #region_A_start
    // Create a JavaScript bullet chart with SciChart.js: one horizontal bullet per row, stacked on a shared scale
    const {
        SciChartSurface,
        NumericAxis,
        FastRectangleRenderableSeries,
        XyxyDataSeries,
        EColumnMode,
        EColumnYMode,
        TextLabelProvider,
        EAxisAlignment,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier,
        TextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const SCALE_MAX = 600; // the end of the scale, in $k: the "good" band runs up to here

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const rows = getSalesData();

    // The row axis. On a vertical chart the X axis is drawn on the left, so each row becomes one horizontal bullet.
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            // useNativeText: false draws the labels as textures, which keeps each one centred on its row
            labelProvider: new TextLabelProvider({ labels: rows.map((row) => row.region), useNativeText: false }),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            labelStyle: { fontSize: 15 },
            growBy: new NumberRange(0.15, 0.22) // room above the first row for the band names, and below the last row for the logo
        })
    );

    // The value axis along the bottom: one shared scale, starting at zero, so the bars can be compared
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Bottom,
            flippedCoordinates: true, // on a vertical chart this makes the bars grow from left to right
            axisTitle: "Quarterly sales ($ thousands)",
            labelPrefix: "$",
            labelPostfix: "k",
            labelPrecision: 0,
            visibleRange: new NumberRange(0, SCALE_MAX),
            drawMajorGridLines: false,
            drawMinorGridLines: false
        })
    );

    // A helper that draws one rectangle per row. Each rectangle spans rowIndex ± halfHeight across the row,
    // and from `from` to `to` along the scale.
    const rectangles = (name, halfHeight, from, to, fill) =>
        new FastRectangleRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, {
                xValues: rows.map((_, index) => index - halfHeight),
                x1Values: rows.map((_, index) => index + halfHeight),
                yValues: rows.map(from),
                y1Values: rows.map(to),
                dataSeriesName: name
            }),
            columnXMode: EColumnMode.StartEnd, // x and x1 are the two edges of the row
            columnYMode: EColumnYMode.TopBottom, // y and y1 are where the rectangle starts and ends on the scale
            fill,
            stroke: fill,
            strokeThickness: 0
        });

    // 1. The qualitative ranges: shades of one grey (40%, 25% and 10% black), darkest for poor and lightest for good
    sciChartSurface.renderableSeries.add(
        rectangles("Poor", 0.38, () => 0, (row) => row.poorTo, "#999999"),
        rectangles("Satisfactory", 0.38, (row) => row.poorTo, (row) => row.satisfactoryTo, "#BFBFBF"),
        rectangles("Good", 0.38, (row) => row.satisfactoryTo, () => SCALE_MAX, "#E6E6E6")
    );

    // 2. The featured measure: a dark bar about a third as thick as the row
    sciChartSurface.renderableSeries.add(rectangles("Actual", 0.13, () => 0, (row) => row.actual, "#0B1A33"));

    // 3. The comparative measure: a short, thin line across the bar at the target
    const TARGET_HALF_WIDTH = 2; // in $k, so the line is about 4k wide on the scale
    sciChartSurface.renderableSeries.add(
        rectangles("Target", 0.28, (row) => row.target - TARGET_HALF_WIDTH, (row) => row.target + TARGET_HALF_WIDTH, "#0B1A33")
    );

    // Name each shade once, above the first row
    const first = rows[0];
    [
        { name: "Poor", from: 0, to: first.poorTo },
        { name: "Satisfactory", from: first.poorTo, to: first.satisfactoryTo },
        { name: "Good", from: first.satisfactoryTo, to: SCALE_MAX }
    ].forEach(({ name, from, to }) =>
        sciChartSurface.annotations.add(
            new TextAnnotation({
                x1: -0.42,
                y1: (from + to) / 2,
                text: name,
                fontSize: 16,
                textColor: "#E6E6E6",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Bottom
            })
        )
    );

    // Tooltip text for the row under the mouse
    const bandOf = (row) => (row.actual < row.poorTo ? "Poor" : row.actual < row.satisfactoryTo ? "Satisfactory" : "Good");
    const money = (value) => `$${value.toLocaleString("en-US")}k`;

    // Hover for a row's values, zoom with the mouse wheel, pan by dragging, double-click to reset
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            tooltipDataTemplate: (seriesInfos) => {
                const info = seriesInfos.find((seriesInfo) => seriesInfo.isWithinDataBounds);
                if (!info) return [];
                const row = rows[info.dataSeriesIndex];
                const gap = row.actual - row.target;
                return [
                    row.region,
                    `Actual: ${money(row.actual)} (${bandOf(row)})`,
                    `Target: ${money(row.target)}`,
                    `${gap >= 0 ? "Above" : "Below"} target by ${money(Math.abs(gap))}`
                ];
            }
        }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

bulletChart("scichart-root");
