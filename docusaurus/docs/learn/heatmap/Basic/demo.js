import * as SciChart from "scichart";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Generates made-up hourly energy use (kWh) for each day of one week, with a seeded random
// generator, so the chart looks the same every time and needs no data feed.
// Weekdays peak in the morning and evening; weekends have one later, broader peak.
function generateEnergyUse() {
    let seed = 42;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const peak = (hour, centre, width) => Math.exp(-((hour - centre) * (hour - centre)) / (2 * width * width));
    // zValues[y][x]: one row per day (y), one column per hour (x)
    const zValues = [];
    for (let day = 0; day < 7; day++) {
        const isWeekend = day >= 5;
        const row = [];
        for (let hour = 0; hour < 24; hour++) {
            const base = 0.3;
            const usage = isWeekend
                ? base + 1.6 * peak(hour, 12, 3.5) + 1.4 * peak(hour, 19, 2)
                : base + 1.5 * peak(hour, 7.5, 1.2) + 2.2 * peak(hour, 19, 1.8);
            row.push(Math.round((usage + random() * 0.3) * 100) / 100);
        }
        zValues.push(row);
    }
    return zValues;
}

// The heatmap and its colour legend each need a div. This splits the page's div in two;
// in your app, they can simply be two divs in your HTML.
function createChartAndLegendDivs(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.display = "flex";
    // Give each div an id: SciChart tells its charts apart by their div's id
    const chartDiv = document.createElement("div");
    chartDiv.id = divElementId + "-chart";
    chartDiv.style.flex = "1";
    chartDiv.style.height = "100%";
    const legendDiv = document.createElement("div");
    legendDiv.id = divElementId + "-legend";
    legendDiv.style.width = "90px";
    legendDiv.style.height = "100%";
    root.append(chartDiv, legendDiv);
    return { chartDiv, legendDiv };
}

async function heatmapChart(divElementId) {
    const { chartDiv, legendDiv } = createChartAndLegendDivs(divElementId);

    // #region_A_start
    // Create a JavaScript heatmap chart with SciChart.js
    const {
        SciChartSurface,
        HeatmapLegend,
        NumericAxis,
        UniformHeatmapRenderableSeries,
        UniformHeatmapDataSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(chartDiv, {
        theme: new SciChartJsNavyTheme()
    });

    // x: hour of day. Each cell spans one hour, from 00:00 to 24:00
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Hour of day",
            labelPrecision: 0,
            drawMajorGridLines: false,
            drawMinorGridLines: false
        })
    );
    // y: day of week, Monday at the top. One label per row, in the middle of the row
    const yAxis = new NumericAxis(wasmContext, {
        flippedCoordinates: true,
        autoTicks: false,
        majorDelta: 1,
        minorDelta: 1,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMinorTickLines: false
    });
    yAxis.labelProvider.formatLabel = (dataValue) => DAYS[Math.round(dataValue)] ?? "";
    sciChartSurface.yAxes.add(yAxis);

    // The colour map turns each value into a colour: 0 kWh is dark purple, 3 kWh is yellow
    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 3,
        gradientStops: [
            { offset: 0, color: "#440154" },
            { offset: 0.25, color: "#3B528B" },
            { offset: 0.5, color: "#21918C" },
            { offset: 0.75, color: "#5EC962" },
            { offset: 1, color: "#FDE725" }
        ]
    });

    // Your data: a 2D array of values, zValues[row][column]
    const zValues = generateEnergyUse();

    sciChartSurface.renderableSeries.add(
        new UniformHeatmapRenderableSeries(wasmContext, {
            dataSeries: new UniformHeatmapDataSeries(wasmContext, {
                zValues,
                xStart: 0, // the first column starts at hour 0
                xStep: 1, // each column is one hour wide
                yStart: -0.5, // centre each row on 0 (Mon), 1 (Tue)...
                yStep: 1
            }),
            colorMap
        })
    );

    // A colour legend, so readers can turn a colour back into a value
    await HeatmapLegend.create(legendDiv, {
        theme: new SciChartJsNavyTheme(),
        colorMap,
        yAxisOptions: { axisTitle: "kWh" }
    });

    // Zoom with the mouse wheel, pan by dragging, double-click to reset, and hover to read a cell
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            // Show the hovered cell as e.g. "Thu 18:00-19:00: 1.58 kWh"
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos
                    .filter((info) => info.isHit)
                    .map((info) => {
                        const day = Math.round(info.yValue);
                        const hour = Math.floor(info.xValue);
                        return `${DAYS[day]} ${hour}:00-${hour + 1}:00: ${zValues[day][hour]} kWh`;
                    })
        }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

heatmapChart("scichart-root");
