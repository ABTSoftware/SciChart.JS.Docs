import * as SciChart from "scichart";

// Generates a day of temperature readings from a sensor, one per second (86,400 points),
// with a seeded random generator, so the chart looks the same every time and needs no external data.
function generateSensorReadings(count = 86400) {
    let seed = 13;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const xValues = [];
    const yValues = [];
    const startTime = Date.UTC(2025, 5, 1) / 1000; // SciChart expects Unix timestamps in seconds
    let drift = 0;
    for (let i = 0; i < count; i++) {
        // A daily cycle (coolest before dawn, warmest mid-afternoon), a slow random drift and fast sensor noise
        const daily = -Math.cos((2 * Math.PI * (i - 3 * 3600)) / count);
        drift = drift * 0.9995 + (random() - 0.5) * 0.05;
        xValues.push(startTime + i);
        yValues.push(20 + 4 * daily + drift + (random() - 0.5) * 3);
    }
    return { xValues, yValues };
}

async function largeLineChart(divElementId) {
    // #region_A_start
    // A line chart with 86,400 points, plus a moving average that smooths out the noise
    const {
        SciChartSurface,
        DateTimeNumericAxis,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        XyMovingAverageFilter,
        SciChartJsNavyTheme,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Temperature (°C)", labelPostfix: "°" }));

    const { xValues, yValues } = generateSensorReadings();
    const rawData = new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Reading every second" });

    // The raw readings: a thin, semi-transparent line
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, { dataSeries: rawData, stroke: "#50C7E088", strokeThickness: 1 })
    );

    // A 10-minute (600-point) moving average of the same data, drawn on top as a thicker line
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyMovingAverageFilter(rawData, { length: 600, dataSeriesName: "10-minute moving average" }),
            stroke: "#F48420",
            strokeThickness: 3
        })
    );

    // Zoom with the mouse wheel, pan by dragging, double-click to reset; tick a line in the legend to hide or show it
    sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

largeLineChart("scichart-root");
