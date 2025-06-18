import { SciChartSurface, NumericAxis, NumberRange, DpiHelper, CustomAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint, EAxisAlignment, XyyDataSeries, FastBandRenderableSeries } from "scichart";
export async function hitTestBandTs(divId) {
    // #region_A_start
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Top }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Right, growBy: new NumberRange(0.4, 0.4) }));
    const dataSeries = new XyyDataSeries(wasmContext);
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        const k = 1 - i / 2000;
        dataSeries.append(i, Math.sin(i * STEP) * k * 0.7, Math.cos(i * STEP) * k);
    }
    const bandSeries = new FastBandRenderableSeries(wasmContext, {
        dataSeries,
        strokeThickness: 2
    });
    sciChartSurface.renderableSeries.add(bandSeries);
    bandSeries.fill = "#279B2733";
    bandSeries.fillY1 = "#FF191933";
    bandSeries.stroke = "#FF1919FF";
    bandSeries.strokeY1 = "#279B27FF";
    // Add an SVG annotation to display the mouse click
    const svgAnnotation = new CustomAnnotation({
        svgString: `<svg width="8" height="8"><circle cx="50%" cy="50%" r="4" fill="#FF0000"/></svg>`,
        isHidden: true,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center
    });
    sciChartSurface.annotations.add(svgAnnotation);
    sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent) => {
        const mouseClickX = mouseEvent.offsetX;
        const mouseClickY = mouseEvent.offsetY;
        console.log("mouseClickX", mouseClickX, "mouseClickY", mouseClickY);
        const premultipliedX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const premultipliedY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        console.log("premultipliedX", premultipliedX, "premultipliedY", premultipliedY);
        // IHitTestProvider.hitTest
        const hitTestInfo = bandSeries.hitTestProvider.hitTest(premultipliedX, premultipliedY);
        svgAnnotation.x1 = hitTestInfo.hitTestPointValues.x;
        svgAnnotation.y1 = hitTestInfo.hitTestPointValues.y;
        svgAnnotation.isHidden = false;
        const resultDiv = document.getElementById("result");
        resultDiv.innerText = `isHit = ${hitTestInfo.isHit}`;
        console.log("hitTestInfo", hitTestInfo);
    });
    // #region_A_end
}
hitTestBandTs("scichart-root");
