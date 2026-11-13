import * as SciChart from "scichart";

// Generates a year of daily temperatures for two made-up cities with a seeded random generator,
// so the chart looks the same every time and needs no external data.
function generateTemperatures(days = 365) {
    let seed = 7;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const xValues = [];
    const cityA = [];
    const cityB = [];
    const startDate = Date.UTC(2025, 0, 1) / 1000; // SciChart expects Unix timestamps in seconds
    for (let i = 0; i < days; i++) {
        // A seasonal curve (coldest in January, warmest in July) plus day-to-day noise
        const season = -Math.cos((2 * Math.PI * i) / days);
        xValues.push(startDate + i * 24 * 60 * 60);
        cityA.push(11 + 7 * season + (random() - 0.5) * 2.5);
        cityB.push(17 + 9 * season + (random() - 0.5) * 3);
    }
    return { xValues, cityA, cityB };
}

async function lineChart(divElementId) {
    // #region_A_start
    // Create a JavaScript line chart with SciChart.js
    const {
        SciChartSurface,
        DateTimeNumericAxis,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        LegendModifier,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Time runs along the x-axis; the measured value goes up the y-axis
    sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Temperature (°C)", labelPostfix: "°" }));

    // Your data: one x value (a date) and one y value per point, for each line
    const { xValues, cityA, cityB } = generateTemperatures();

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: cityA, dataSeriesName: "City A" }),
            stroke: "#50C7E0",
            strokeThickness: 2
        }),
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: cityB, dataSeriesName: "City B" }),
            stroke: "#F48420",
            strokeThickness: 2
        })
    );

    // A legend, plus zoom with the mouse wheel, pan by dragging, double-click to reset, and hover for values
    sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true }),
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

lineChart("scichart-root");
