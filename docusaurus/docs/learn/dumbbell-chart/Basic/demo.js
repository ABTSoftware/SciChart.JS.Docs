import * as SciChart from "scichart";

// Example data: each team's score out of 100 in a yearly staff survey, in 2024 and in 2025.
// These are illustrative numbers, not real statistics.
function getSurveyData() {
    return [
        { team: "Facilities", score2024: 57, score2025: 45 },
        { team: "Finance", score2024: 63, score2025: 67 },
        { team: "Support", score2024: 48, score2025: 71 },
        { team: "HR", score2024: 69, score2025: 61 },
        { team: "Design", score2024: 66, score2025: 73 },
        { team: "Sales", score2024: 55, score2025: 72 },
        { team: "Legal", score2024: 70, score2025: 72 },
        { team: "Operations", score2024: 64, score2025: 62 },
        { team: "Engineering", score2024: 61, score2025: 74 },
        { team: "Marketing", score2024: 58, score2025: 68 }
    ];
}

async function dumbbellChart(divElementId) {
    // #region_A_start
    // Create a JavaScript dumbbell chart with SciChart.js: two dots per row, joined by a line
    const {
        SciChartSurface,
        NumericAxis,
        FastLineSegmentRenderableSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        TextLabelProvider,
        EAxisAlignment,
        NumberRange,
        SciChartJsNavyTheme,
        FadeAnimation,
        CursorModifier,
        LegendModifier,
        ELegendPlacement,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Sort by the change from 2024 to 2025, biggest rise first, so the rows read as a ranking of change
    const rows = getSurveyData().sort((a, b) => b.score2025 - b.score2024 - (a.score2025 - a.score2024));
    const rowIndexes = rows.map((_, index) => index);

    // The row (X) axis goes on the left, which turns the chart on its side: one horizontal dumbbell per row.
    // A TextLabelProvider shows a team name at x = 0, 1, 2, ...
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            labelProvider: new TextLabelProvider({ labels: rows.map((row) => row.team), useNativeText: false }),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMinorGridLines: false,
            drawMajorBands: false,
            growBy: new NumberRange(0.05, 0.3) // extra space below the last row keeps it clear of the chart's bottom corner
        })
    );

    // The value (Y) axis goes along the top. It doesn't need to start at zero: the gap between the dots is what's read.
    // flippedCoordinates makes values grow from left to right
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Top,
            flippedCoordinates: true,
            axisTitle: "Staff survey score (out of 100)",
            labelPrecision: 0,
            growBy: new NumberRange(0.1, 0.1)
        })
    );

    // The connecting lines: a line segment series joins points in pairs (0 to 1, 2 to 3, ...),
    // so each row adds two points with the same x value: its 2024 score and its 2025 score
    const segmentX = [];
    const segmentY = [];
    rows.forEach((row, index) => {
        segmentX.push(index, index);
        segmentY.push(row.score2024, row.score2025);
    });
    const connectors = new FastLineSegmentRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: segmentX, yValues: segmentY }),
        stroke: "#8A9AB0",
        strokeThickness: 4,
        animation: new FadeAnimation({ duration: 800 })
    });

    // The two ends: one scatter series per year, each with its own colour, so readers can tell the ends apart
    const makeDots = (name, values, color) =>
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues: rowIndexes, yValues: values, dataSeriesName: name }),
            stroke: color, // the colour shown in the legend
            pointMarker: new EllipsePointMarker(wasmContext, { width: 18, height: 18, fill: color, stroke: color }),
            animation: new FadeAnimation({ duration: 800 })
        });
    const dots2024 = makeDots("2024", rows.map((row) => row.score2024), "#B8C2D0");
    const dots2025 = makeDots("2025", rows.map((row) => row.score2025), "#50C7E0");

    // Add the lines first, so the dots are drawn on top of them
    sciChartSurface.renderableSeries.add(connectors, dots2024, dots2025);

    // Tooltip: the team, both scores and the change between them
    const cursor = new CursorModifier({
        showTooltip: true,
        showAxisLabels: false,
        tooltipDataTemplate: (seriesInfos) => {
            if (seriesInfos.length === 0) return [];
            const row = rows[Math.round(seriesInfos[0].xValue)];
            if (!row) return [];
            const change = row.score2025 - row.score2024;
            return [row.team, `2024: ${row.score2024}`, `2025: ${row.score2025}`, `Change: ${change > 0 ? "+" : ""}${change}`];
        }
    });
    // The legend names the two ends; leave the connecting lines out of it
    const legend = new LegendModifier({ placement: ELegendPlacement.BottomRight, showCheckboxes: false });

    // Hover for values, zoom with the mouse wheel, pan by dragging, double-click to reset
    sciChartSurface.chartModifiers.add(cursor, legend, new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
    cursor.includeSeries(connectors, false);
    legend.includeSeries(connectors, false);
    // #region_A_end
}

dumbbellChart("scichart-root");
