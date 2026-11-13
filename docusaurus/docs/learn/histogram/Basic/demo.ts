import * as SciChart from "scichart";

// Generates 1,000 simulated adult heights (in cm) from a bell-shaped (normal) distribution.
// A seeded random generator keeps the chart the same every time.
function generateHeights(count = 1000) {
    let seed = 7;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const heights = [];
    for (let i = 0; i < count; i++) {
        // Box-Muller transform: turns two uniform random numbers into a normally distributed one
        const u = Math.max(random(), 1e-9);
        const v = random();
        const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        heights.push(170 + z * 9);
    }
    return heights;
}

// Counts how many values fall into each bin. Every bin includes its start and excludes its end.
function binValues(values, binStart, binWidth, binCount) {
    const binStarts = [];
    const binEnds = [];
    const counts = [];
    for (let i = 0; i < binCount; i++) {
        const start = binStart + i * binWidth;
        const end = start + binWidth;
        binStarts.push(start);
        binEnds.push(end);
        counts.push(values.filter((v) => v >= start && v < end).length);
    }
    return { binStarts, binEnds, counts };
}

async function histogram(divElementId) {
    // #region_A_start
    // Create a JavaScript histogram with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        FastRectangleRenderableSeries,
        XyxyDataSeries,
        EColumnMode,
        EColumnYMode,
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

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Height (cm)", labelPrecision: 0 }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Frequency (number of people)",
            labelPrecision: 0,
            growBy: new NumberRange(0, 0.1)
        })
    );

    // Your data: raw values, counted into equal-width bins (here 5 cm wide, from 130 cm to 210 cm, so every value is counted)
    const { binStarts, binEnds, counts } = binValues(generateHeights(), 130, 5, 16);

    // Each bar spans its bin on the X axis (start to end) and rises from zero to the bin's count
    sciChartSurface.renderableSeries.add(
        new FastRectangleRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, {
                xValues: binStarts,
                x1Values: binEnds,
                yValues: counts,
                y1Values: counts.map(() => 0),
                dataSeriesName: "People"
            }),
            columnXMode: EColumnMode.StartEnd,
            columnYMode: EColumnYMode.TopBottom,
            fill: "#29aade",
            stroke: "#14233c",
            strokeThickness: 1,
            // Show each bin's count above its bar
            dataLabels: {
                color: "#ffffff",
                style: { fontSize: 12, fontFamily: "Arial" },
                precision: 0
            }
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

histogram("scichart-root");
