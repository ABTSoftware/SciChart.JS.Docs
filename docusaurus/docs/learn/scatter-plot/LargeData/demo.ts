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

    // Two groups with opposite trends that cross in the middle
    const rising = { xValues: [], yValues: [] };
    const falling = { xValues: [], yValues: [] };
    for (let i = 0; i < count; i++) {
        if (random() < 0.6) {
            const x = 40 + randomNormal() * 14;
            rising.xValues.push(x);
            rising.yValues.push(0.9 * x + 5 + randomNormal() * 5);
        } else {
            const x = 60 + randomNormal() * 12;
            falling.xValues.push(x);
            falling.yValues.push(-0.7 * x + 100 + randomNormal() * 5);
        }
    }
    return { rising, falling };
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
        ZoomExtentsModifier,
        LegendModifier
    } = SciChart;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "x", growBy: new NumberRange(0.05, 0.05) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "y", growBy: new NumberRange(0.05, 0.05) }));

    const { rising, falling } = generateLargeScatterData();

    // One series per group, each with its own colour. Small dots with a low opacity:
    // overlapping dots add up, so dense areas look brighter. The series added last is drawn on top.
    const addGroup = (data, name, colour, legendColour) =>
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { ...data, dataSeriesName: name }),
                stroke: legendColour, // sets the colour of the series' marker in the legend
                pointMarker: new EllipsePointMarker(wasmContext, { width: 3, height: 3, strokeThickness: 0, fill: colour })
            })
        );
    addGroup(rising, "Rising group", "#50C7E022", "#50C7E0");
    addGroup(falling, "Falling group", "#F484200D", "#F48420"); // more transparent, so the blue shows through where they cross

    // Zoom with the mouse wheel, pan by dragging, double-click to reset; the legend names each group
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new LegendModifier({ showCheckboxes: true })
    );
    // #region_A_end
}

largeScatterPlot("scichart-root");
