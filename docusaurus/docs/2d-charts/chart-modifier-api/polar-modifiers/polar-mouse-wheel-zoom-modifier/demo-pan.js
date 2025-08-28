import * as SciChart from "scichart";
export async function PolarMouseWheelZoom(divElementId) {
    const { SciChartPolarSurface, PolarNumericAxis, XyyDataSeries, SciChartJsNavyTheme, TextAnnotation, ECoordinateMode, EHorizontalAnchorPoint, EVerticalAnchorPoint, PolarBandRenderableSeries, PolarZoomExtentsModifier, EPolarAxisMode } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular
    }));
    sciChartSurface.yAxes.add(new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        drawMinorGridLines: false,
    }));
    sciChartSurface.renderableSeries.add(new PolarBandRenderableSeries(wasmContext, {
        strokeThickness: 3,
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: Array.from({ length: 12 }, (_, i) => i),
            yValues: Array.from({ length: 12 }, (_, i) => Math.sin(i * 0.2)),
            y1Values: Array.from({ length: 12 }, (_, i) => Math.cos(i * 0.2))
        })
    }));
    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "PolarMouseWheelZoomModifier",
        x1: 0,
        y1: 0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        yCoordShift: -20,
        opacity: 0.33,
        fontSize: 36,
        fontWeight: "Bold"
    }), new TextAnnotation({
        text: 'Scroll mouse wheel to pan or zoom (depending on "defaultActionType")',
        x1: 0,
        y1: 0,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        yCoordShift: 30,
        opacity: 0.45,
        fontSize: 17
    }));
    // #region_A_start
    const { PolarMouseWheelZoomModifier, EActionType } = SciChart;
    // or for npm: import { PolarMouseWheelZoomModifier, EActionType } from "scichart";
    // Add PolarMouseWheelZoomModifier behaviour to the chart
    sciChartSurface.chartModifiers.add(new PolarMouseWheelZoomModifier({
        growFactor: 0.002,
        zoomSize: false,
        defaultActionType: EActionType.Pan
    }));
    // #region_A_end
    sciChartSurface.chartModifiers.add(new PolarZoomExtentsModifier() // optional - double click to reset
    );
}
PolarMouseWheelZoom("scichart-root");
