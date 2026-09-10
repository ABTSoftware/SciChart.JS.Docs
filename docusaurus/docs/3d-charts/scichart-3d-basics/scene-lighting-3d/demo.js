import { ColumnRenderableSeries3D, EDrawMeshAs, EMainLightMode, GradientColorPalette, MouseWheelZoomModifier3D, NumericAxis3D, NumberRange, OrbitModifier3D, ResetCamera3DModifier, SciChart3DSurface, SciChartJsNavyTheme, SurfaceMeshRenderableSeries3D, UniformGridDataSeries3D, Vector3, XyzDataSeries3D } from "scichart";
const input = (id) => document.getElementById(id);
const ambient = input("ambient");
const lightMode = document.getElementById("light-mode");
const directionInputs = [input("direction-x"), input("direction-y"), input("direction-z")];
const setOutput = (control) => {
    document.querySelector(`output[for="${control.id}"]`).textContent = Number(control.value).toFixed(2);
};
async function createLightingDemo() {
    // #region_lighting_setup_start
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create("scichart-root", {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(220, 130, 220),
        lighting: {
            ambientLight: Number(ambient.value), // global ambient light
            lightDirection: new Vector3(-0.25, 0.5, -0.25), // directional light
            lightMode: EMainLightMode.GlobalSpace,
        },
        cameraOptions: {
            position: new Vector3(-210, 170, 240),
            target: new Vector3(0, 55, 0)
        }
    });
    // #region_lighting_setup_end
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { visibleRange: new NumberRange(0, 29) });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { visibleRange: new NumberRange(0, 42) });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { visibleRange: new NumberRange(0, 29) });
    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D(), new OrbitModifier3D(), new ResetCamera3DModifier());
    const size = 30;
    const surfaceValues = Array.from({ length: size }, (_, z) => Array.from({ length: size }, (_, x) => 4 + 7 * Math.sin(x * 0.25) * Math.cos(z * 0.22) + 5 * Math.exp(-((x - 15) ** 2 + (z - 15) ** 2) / 70)));
    const surfaceData = new UniformGridDataSeries3D(wasmContext, { yValues: surfaceValues, xStep: 1, zStep: 1 });
    const palette = new GradientColorPalette(wasmContext, {
        gradientStops: [
            { offset: 0, color: "#142e5e" },
            { offset: 0.5, color: "#32a5a0" },
            { offset: 1, color: "#ffe08a" }
        ]
    });
    const columns = new XyzDataSeries3D(wasmContext);
    [[4, 23, 5], [10, 30, 21], [18, 26, 9], [25, 36, 24]].forEach(([x, y, z]) => columns.append(x, y, z));
    sciChart3DSurface.renderableSeries.add(new SurfaceMeshRenderableSeries3D(wasmContext, {
        dataSeries: surfaceData,
        minimum: 0,
        maximum: 18,
        drawMeshAs: EDrawMeshAs.SOLID_MESH,
        meshColorPalette: palette,
        lightingFactor: 0.85,
        highlight: 0.05,
        stroke: "rgba(255,255,255,0.16)",
        strokeThickness: 1
    }), new ColumnRenderableSeries3D(wasmContext, {
        dataSeries: columns,
        fill: "#f58b65",
        dataPointWidthX: 2.1,
        dataPointWidthZ: 2.1
    }));
    const applyLighting = () => {
        const [x, y, z] = directionInputs.map(control => Number(control.value));
        const length = Math.hypot(x, y, z) || 1;
        const mode = lightMode.value;
        // #region_lighting_controls_start
        // setting amibent light:
        sciChart3DSurface.lightingController.ambientLight = Number(ambient.value);
        // setting the directional light mode and direction:
        sciChart3DSurface.lightingController.lightMode = mode;
        sciChart3DSurface.lightingController.setLightDirection(new Vector3(x / length, y / length, z / length));
        // #region_lighting_controls_end
        directionInputs.forEach(control => control.disabled = (mode !== EMainLightMode.GlobalSpace));
        [ambient, ...directionInputs].forEach(setOutput);
    };
    [ambient, lightMode, ...directionInputs].forEach(control => control.addEventListener("input", applyLighting));
    applyLighting();
}
createLightingDemo();
