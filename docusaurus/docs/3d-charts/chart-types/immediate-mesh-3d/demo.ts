import {
    EMainLightMode,
    MouseWheelZoomModifier3D,
    NumericAxis3D,
    NumberRange,
    OrbitModifier3D,
    ResetCamera3DModifier,
    SciChart3DSurface,
    SciChartJsNavyTheme,
    Vector3
} from "scichart";
import { AuroraRibbonSceneEntity } from "./AuroraRibbonSceneEntity";

async function immediateMesh3D(divElementId: string) {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(400, 200, 400),
        lighting: {
            ambientLight: 0.18,
            lightMode: EMainLightMode.GlobalSpace,
            lightDirection: new Vector3(-0.25, 0.5, -0.25)
        },
        cameraOptions: {
            position: new Vector3(300, 300, 300),
            target: new Vector3(0, 50, 0)
        },
    });

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { visibleRange: new NumberRange(-100, 100) });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { visibleRange: new NumberRange(-100, 100) });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { visibleRange: new NumberRange(-100, 100) });

    sciChart3DSurface.rootEntity.children.add(new AuroraRibbonSceneEntity(wasmContext));

    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(), 
        new OrbitModifier3D(), 
        new ResetCamera3DModifier()
    );
}
immediateMesh3D("scichart-root");
