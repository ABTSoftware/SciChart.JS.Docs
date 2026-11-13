import * as SciChart from "scichart";

// Generates 100,000 points in two overlapping groups with a seeded random generator,
// so the chart looks the same every time and needs no external data.
function generateLargeScatterData(count = 100000) {
    let seed = 7;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    // Normally distributed noise (Box-Muller transform)
    const randomNormal = () => Math.sqrt(-2 * Math.log(random())) * Math.cos(2 * Math.PI * random());

    const xValues = new Float64Array(count);
    const yValues = new Float64Array(count);
    for (let i = 0; i < count; i++) {
        // Two groups with opposite trends that cross in the middle: where they overlap, only density shows them apart
        const inGroupA = random() < 0.6;
        const x = inGroupA ? 40 + randomNormal() * 14 : 60 + randomNormal() * 12;
        const y = inGroupA ? 0.9 * x + 5 + randomNormal() * 5 : -0.7 * x + 100 + randomNormal() * 5;
        xValues[i] = x;
        yValues[i] = y;
    }
    return { xValues, yValues };
}

async function largeScatterPlot(divElementId) {
    // #region_A_start
    // A scatter plot with 100,000 points: small, semi-transparent markers show where points pile up
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "x", growBy: new NumberRange(0.05, 0.05) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "y", growBy: new NumberRange(0.05, 0.05) }));

    const { xValues, yValues } = generateLargeScatterData();
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            // Small dots with a low opacity: overlapping dots add up, so dense areas look brighter
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 3,
                height: 3,
                strokeThickness: 0,
                fill: "#50C7E022"
            })
        })
    );

    // Zoom with the mouse wheel, pan by dragging, double-click to reset
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
    // #region_A_end
}

largeScatterPlot("scichart-root");
