import { SciChart3DSurface, NumericAxis3D, Vector3, SciChartJsNavyTheme, PointLineRenderableSeries3D, XyzDataSeries3D, MouseWheelZoomModifier3D, OrbitModifier3D, ResetCamera3DModifier, parseColorToUIntArgb, uintArgbColorLerp, NumberRange, } from "scichart";
// Generate synthetic spectral data for one slice of the 3D waterfall.
// Returns xValues (frequency), yValues (power/magnitude) and zValues (all equal to sliceIndex).
function generateSpectralSlice(sliceIndex, spectraSize) {
    const xValues = [];
    const yValues = [];
    const zValues = [];
    for (let i = 0; i < spectraSize; i++) {
        const val = 2.0 * Math.sin((2 * Math.PI * i) / (20 + sliceIndex * 0.2)) +
            5.0 * Math.sin((2 * Math.PI * i) / (10 + sliceIndex * 0.01)) +
            10.0 * Math.sin((2 * Math.PI * i) / (5 + sliceIndex * -0.002)) +
            2.0 * Math.random();
        xValues.push(i);
        yValues.push(Math.max(-30, val < -5 ? val : Math.random() * 9 - 6));
        zValues.push(sliceIndex * 6); // spread slices along Z axis
    }
    yValues[0] = -30;
    return { xValues, yValues, zValues };
}
// Map a value in [low, high] to a color by linearly interpolating through a gradient.
function valueToColor(value, low, high) {
    const gradientStops = [
        { offset: 0.00, color: "#1C0073" },
        { offset: 0.20, color: "#0D47A1" },
        { offset: 0.45, color: "#00897B" },
        { offset: 0.65, color: "#F9A825" },
        { offset: 0.85, color: "#E53935" },
        { offset: 1.00, color: "#FF80AB" },
    ];
    const t = Math.max(0, Math.min(1, (value - low) / (high - low)));
    let i = gradientStops.findIndex((s) => s.offset >= t);
    if (i <= 0)
        return parseColorToUIntArgb(gradientStops[0].color);
    const a = gradientStops[i - 1];
    const b = gradientStops[i];
    const ratio = (t - a.offset) / (b.offset - a.offset);
    return uintArgbColorLerp(parseColorToUIntArgb(a.color), parseColorToUIntArgb(b.color), ratio);
}
async function waterfallChart3D(divElementId) {
    // #region_A_start
    // Demonstrates how to create a 3D Waterfall Chart using PointLineRenderableSeries3D.
    // Each "slice" is a PointLineRenderableSeries3D whose zValues are all set to the same
    // value, spreading slices along the Z axis to produce the waterfall depth effect.
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 100, 300),
        cameraOptions: {
            position: new Vector3(-142, 310, 393),
            target: new Vector3(0, 50, 0),
        },
    });
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Frequency (Hz)",
        drawMinorGridLines: false,
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Power (dB)",
        drawMinorGridLines: false,
        visibleRange: new NumberRange(-30, 10),
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Time",
        drawMinorGridLines: false,
    });
    const sliceCount = 20;
    const spectraSize = 200;
    for (let i = 0; i < sliceCount; i++) {
        const { xValues, yValues, zValues } = generateSpectralSlice(i, spectraSize);
        // Color each point by its Y (power) value using a heat gradient
        const low = Math.min(...yValues);
        const high = Math.max(...yValues);
        const metadata = yValues.map((y) => ({
            vertexColor: valueToColor(y, low, high),
            pointScale: 1,
        }));
        sciChart3DSurface.renderableSeries.add(new PointLineRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, { xValues, yValues, zValues, metadata }),
            strokeThickness: 2,
            opacity: 0.7,
        }));
    }
    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D(), new OrbitModifier3D(), new ResetCamera3DModifier());
    // #region_A_end
}
waterfallChart3D("scichart-root");
