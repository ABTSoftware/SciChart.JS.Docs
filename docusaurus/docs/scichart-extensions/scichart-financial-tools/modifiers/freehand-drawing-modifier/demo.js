import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    // #region_A_start
    const { NumericAxis, SciChartSurface, NativeTextAnnotation, } = SciChart; // or import from "scichart"
    const { SciTraderLightTheme, FreehandDrawingModifier } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    const freehandMod = new FreehandDrawingModifier({
        isDrawing: false, // Start in drawing mode or not. If not, it waits for "startDrawing" to be called, which can be done from a button click or similar.
        keepDrawingAfterComplete: true, // keep drawing after each completed stroke. 
        // Turn it off to be able to edit existing annotations.
        maxPoints: 1000,
        pointSamplingDistancePx: 0.001, // Lower sampling distance captures smoother strokes; 
        simplifyTolerancePx: 1, // Simplification trims redundant points after pointer-up.
    });
    sciChartSurface.chartModifiers.add(freehandMod);
    // to start drawing:
    freehandMod.startDrawing({
        stroke: "#22C55E",
    });
    // freehandMod.stopDrawing(false); // call this on a button click or similar to stop drawing mode.
    // #region_A_end
    sciChartSurface.annotations.add(new NativeTextAnnotation({
        x1: 5,
        y1: 9,
        textColor: "#000",
        text: "Draw freehand annotations on the chart!\nTo edit any annotation after placement, you need to set \"isDrawing\" to false and select the annotation.",
        fontSize: 18,
        horizontalAnchorPoint: SciChart.EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: SciChart.EVerticalAnchorPoint.Top,
        opacity: 0.7,
        lineSpacing: 10
    }));
}
drawExample("scichart-root");
