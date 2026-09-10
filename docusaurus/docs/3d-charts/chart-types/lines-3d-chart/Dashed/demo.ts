import {
    SciChart3DSurface,
    SciChartJsNavyTheme,
    NumericAxis3D,
    Vector3,
    XyzDataSeries3D,
    PointLineRenderableSeries3D,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    ResetCamera3DModifier
} from "scichart";

async function dashedLine3D(divElementId) {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(200, 400, 200),
        cameraOptions: {
            position: new Vector3(380, 240, 380),
            target: new Vector3(0, 180, 0)
        }
    });
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z" });

    const dataSeries = new XyzDataSeries3D(wasmContext);
    for (let i = 0; i <= 100; i++) {
        const angle = (i * Math.PI) / 12;
        dataSeries.append(50 * Math.cos(angle), i, 50 * Math.sin(angle));
    }

    // #region_A_start
    const lineSeries = new PointLineRenderableSeries3D(wasmContext, {
        dataSeries,
        stroke: "#FF9A2E",
        strokeThickness: 6,
        strokeDashArray: [10, 3]
    });
    sciChart3DSurface.renderableSeries.add(lineSeries);

    // Assign a new array to change the pattern later:
    // lineSeries.strokeDashArray = [5, 5];
    // Use an empty array to return to a solid line:
    // lineSeries.strokeDashArray = [];
    // #region_A_end

    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(),
        new OrbitModifier3D(),
        new ResetCamera3DModifier()
    );
}

dashedLine3D("scichart-root");