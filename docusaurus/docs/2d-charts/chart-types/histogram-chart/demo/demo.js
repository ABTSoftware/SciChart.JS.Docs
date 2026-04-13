import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    FastRectangleRenderableSeries,
    XyxyDataSeries,
    EColumnMode,
    EColumnYMode,
    SciChartJsNavyTheme,
    GradientParams,
    Point,
    ENumericFormat,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier
} from "scichart";

async function histogramChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "Age (years)",
        growBy: new NumberRange(0.05, 0.05)
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "Population",
        labelFormat: ENumericFormat.Engineering,
        growBy: new NumberRange(0, 0.2)
    }));

    // region_A_start
    // Histogram bins: each entry defines [x, x1, y] = [binStart, binEnd, count]
    // representing Europe's population by age bracket (simplified)
    const bins = [
        { x: 0,  x1: 20, y: 150_000_000 },
        { x: 20, x1: 30, y:  75_000_000 },
        { x: 30, x1: 45, y: 112_000_000 },
        { x: 45, x1: 65, y: 138_000_000 },
        { x: 65, x1: 70, y:  32_000_000 },
        { x: 70, x1: 80, y:  48_000_000 },
    ];

    const histogramSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues:  bins.map(b => b.x),
            yValues:  bins.map(b => b.y),
            x1Values: bins.map(b => b.x1),
        }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        defaultY1: 0,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "rgba(70, 130, 180, 0.9)", offset: 0 },
            { color: "rgba(70, 130, 180, 0.3)", offset: 1 },
        ]),
        strokeThickness: 0,
        topCornerRadius: 4,
        opacity: 0.85,
        dataLabels: {
            style: { fontSize: 13, fontFamily: "Arial" },
            color: "white",
        }
    });
    // region_A_end

    sciChartSurface.renderableSeries.add(histogramSeries);

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
    );
}

histogramChart("scichart-root");
