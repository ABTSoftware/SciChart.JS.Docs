import { SciChartSurface, NumericAxis, EAutoRange, NumberRange, ZoomPanModifier, MouseWheelZoomModifier } from "scichart";
export const drawExampleCustomCanvas2dImage = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
    // #region_A_start
    const context = sciChartSurface.domCanvas2D.getContext("2d");
    sciChartSurface.renderedToDestination.subscribe(args => {
        // Notice that selecting a proper composition operation here is quite important
        context.globalCompositeOperation = "xor";
        // static texture
        drawBasic2DScene(context);
        // texture bound to data coordinates and clipped
        // const xAxis=sciChartSurface.xAxes.get(0)
        // const xCoordinateCalculator = sciChartSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        // const yCoordinateCalculator = sciChartSurface.yAxes.get(0).getCurrentCoordinateCalculator();
        // const circleCentreDataPoint = new Point(5, 6);
        // let xCoord = xCoordinateCalculator.getCoordinate(circleCentreDataPoint.x);
        // let yCoord = yCoordinateCalculator.getCoordinate(circleCentreDataPoint.x);
        // // adjust by seriesViesRect offset
        // xCoord += sciChartSurface.seriesViewRect.left;
        // yCoord += sciChartSurface.seriesViewRect.top;
        // const initialRadius = 300;
        // const initialRangeDiff = 10;
        // const radius = xAxis.visibleRange.diff * initialRadius / initialRangeDiff;
        // drawCircleClippedToRect(context, xCoord, yCoord, radius, sciChartSurface.seriesViewRect);
    });
    // request a redraw to rerender with custom logic initially
    sciChartSurface.invalidateElement();
    // #region_A_end
    return { sciChartSurface };
};
// #region_B_start
function drawBasic2DScene(ctx) {
    const canvas = ctx.canvas;
    // --- Draw triangle ---
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 50);
    ctx.lineTo(100, canvas.height - 50);
    ctx.lineTo(canvas.width - 100, canvas.height - 50);
    ctx.closePath();
    ctx.fillStyle = "#FF6F61"; // coral red
    ctx.fill();
}
function drawCircleClippedToRect(ctx, x, y, radius, rect) {
    // Set rectangular clipping region using the Rect object
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.clip();
    // Draw the circle (will be clipped to the rect)
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#4A90E2";
    ctx.fill();
}
// #region_B_end
drawExampleCustomCanvas2dImage("scichart-root");
