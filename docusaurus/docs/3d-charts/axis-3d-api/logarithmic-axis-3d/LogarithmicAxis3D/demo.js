import { SciChart3DSurface, NumericAxis3D, LogarithmicAxis3D, Vector3, NumberRange, SciChartJsNavyTheme, XyzDataSeries3D, PointLineRenderableSeries3D, MouseWheelZoomModifier3D, OrbitModifier3D, ResetCamera3DModifier } from "scichart";
async function logarithmicAxis3D(divElementId) {
    // Demonstrates how to create a 3D chart with a LogarithmicAxis3D on the Y axis
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 200, 300),
        cameraOptions: {
            position: new Vector3(-250, 180, -250),
            target: new Vector3(0, 50, 0)
        }
    });
    // X axis: linear frequency axis
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Frequency (Hz)",
        visibleRange: new NumberRange(0, 299),
        maxAutoTicks: 5,
        titleOffset: 50,
        tickLabelsOffset: 10
    });
    // Y axis: LogarithmicAxis3D - data spans several orders of magnitude
    // Values must be strictly positive; logBase defaults to 10
    sciChart3DSurface.yAxis = new LogarithmicAxis3D(wasmContext, {
        axisTitle: "Magnitude (log10)",
        logBase: 10,
        visibleRange: new NumberRange(0.05, 200),
        maxAutoTicks: 5,
        titleOffset: 50,
        tickLabelsOffset: 10
    });
    // Z axis: linear slice/time axis
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Slice",
        visibleRange: new NumberRange(0, 49),
        maxAutoTicks: 5,
        titleOffset: 50,
        tickLabelsOffset: 10
    });
    // Generate synthetic spectral data: 50 slices, 300 points each
    const SERIES_COUNT = 50;
    const POINTS_PER_SERIES = 300;
    for (let i = 0; i < SERIES_COUNT; i++) {
        const xValues = new Array(POINTS_PER_SERIES);
        const yValues = new Array(POINTS_PER_SERIES);
        const zValues = new Array(POINTS_PER_SERIES).fill(i);
        for (let j = 0; j < POINTS_PER_SERIES; j++) {
            const peak1 = 80 * Math.exp(-Math.pow((j - (30 + i * 0.2)) / 8, 2));
            const peak2 = 40 * Math.exp(-Math.pow((j - (90 + i * 0.1)) / 12, 2));
            const peak3 = 25 * Math.exp(-Math.pow((j - (180 - i * 0.15)) / 16, 2));
            xValues[j] = j;
            // Clamp to a small positive minimum - LogarithmicAxis3D requires strictly positive values
            yValues[j] = Math.max(peak1 + peak2 + peak3 + 0.05 + Math.random() * 0.4, 0.05);
        }
        const t = i / (SERIES_COUNT - 1);
        const stroke = `rgb(${Math.round(40 + t * 215)}, ${Math.round(120 + (1 - Math.abs(t - 0.5) * 2) * 90)}, ${Math.round(228 - t * 160)})`;
        sciChart3DSurface.renderableSeries.add(new PointLineRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, { xValues, yValues, zValues }),
            stroke,
            strokeThickness: 2,
            isLineStrip: true,
            opacity: 0.9
        }));
    }
    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D(), new OrbitModifier3D(), new ResetCamera3DModifier());
}
logarithmicAxis3D("scichart-root");
