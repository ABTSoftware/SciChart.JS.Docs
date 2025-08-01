import {
    SciChartJsNavyTheme,
    NumberRange,
    SciChartDefaults,
    SciChart3DSurface,
    NumericAxis3D,
    XyzDataSeries3D,
    ScatterRenderableSeries3D,
    SpherePointMarker3D,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
    Vector3
} from "scichart";

const generateData = () => {
    const gaussianRandom = (mean, stdev) => {
        const u = 1 - Math.random();
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdev + mean;
    };

    const xValues = [];
    const yValues = [];
    const zValues = [];

    for (let i = 0; i < 1000; i++) {
        xValues.push(gaussianRandom(0, 1));
        yValues.push(gaussianRandom(0, 1));
        zValues.push(gaussianRandom(0, 1));
    }
    return { xValues, yValues, zValues };
};

async function scatter3dChart(divElementId) {
    // region_A_start

    SciChartDefaults.useNativeText = false;

    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 200, 300),
        cameraOptions: {
            position: new Vector3(-300, 300, -300),
            target: new Vector3(0, 50, 0)
        }
    });

    // Declare your axis like this
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "长度（米）",
        // axisTitle: "xAxis",
        visibleRange: new NumberRange(-3, 3)
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "宽度（米）",
        visibleRange: new NumberRange(-3, 3)
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "高度（米）",
        visibleRange: new NumberRange(-3, 3)
    });

    const { xValues, yValues, zValues } = generateData();

    // Add a ScatterRenderableSeries3D
    sciChart3DSurface.renderableSeries.add(
        new ScatterRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, {
                xValues,
                yValues,
                zValues
            }),
            opacity: 0.5,
            pointMarker: new SpherePointMarker3D(wasmContext, {
                fill: "#EC0F6C",
                size: 10
            })
        })
    );

    // region_A_end
    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(),
        new OrbitModifier3D(),
        new ResetCamera3DModifier()
    );
}

scatter3dChart("scichart-root");
