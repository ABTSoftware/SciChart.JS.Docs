import { EColumnMode, NumberRange, EColumnYMode, SciChartSurface, NumericAxis, SciChartJsNavyTheme, FastRectangleRenderableSeries, XyxyDataSeries, applyOpacityToHtmlColor } from "scichart";
class StickFigureTextureOptions {
    isPerPrimitive = false;
    options;
    textureHeight = 32;
    textureWidth = 16;
    repeat = true;
    constructor(options) {
        this.options = options;
    }
    createTexture(context, options) {
        console.log("!!!", options);
        context.fillStyle = applyOpacityToHtmlColor(options.fill, options.opacity);
        context.fillRect(0, 0, this.textureWidth, this.textureHeight);
        context.strokeStyle = applyOpacityToHtmlColor(options.stroke, options.opacity);
        // Set up transformation: move to center, rotate, move back
        context.translate(this.textureWidth / 2, this.textureHeight / 2);
        //   context.rotate(Math.PI); // 180 degrees
        context.translate(-this.textureWidth / 2, -this.textureHeight / 2);
        // Proportional values
        const centerX = this.textureWidth / 2;
        const headRadius = Math.min(this.textureWidth, this.textureHeight) * 0.16; // 16% of smaller dimension
        const headY = this.textureHeight * 0.25;
        const bodyTopY = headY + headRadius;
        const bodyBottomY = this.textureHeight * 0.63;
        const armY = bodyTopY + this.textureHeight * 0.06;
        const armSpan = this.textureWidth * 0.38; // arms reach out 19% each side
        const legY = bodyBottomY;
        const legSpan = this.textureWidth * 0.25; // legs out 12.5% each side
        const legBottomY = this.textureHeight * 0.97;
        // Head
        context.beginPath();
        context.arc(centerX, headY, headRadius, 0, Math.PI * 2);
        context.stroke();
        // Body
        context.beginPath();
        context.moveTo(centerX, bodyTopY);
        context.lineTo(centerX, bodyBottomY);
        context.stroke();
        // Left Arm
        context.beginPath();
        context.moveTo(centerX, armY);
        context.lineTo(centerX - armSpan, armY + this.textureHeight * 0.09);
        context.stroke();
        // Right Arm
        context.beginPath();
        context.moveTo(centerX, armY);
        context.lineTo(centerX + armSpan, armY + this.textureHeight * 0.09);
        context.stroke();
        // Left Leg
        context.beginPath();
        context.moveTo(centerX, legY);
        context.lineTo(centerX - legSpan, legBottomY);
        context.stroke();
        // Right Leg
        context.beginPath();
        context.moveTo(centerX, legY);
        context.lineTo(centerX + legSpan, legBottomY);
        context.stroke();
    }
}
async function rectangleSeriesTexture(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));
    // region_A_start
    const xValues = [0, 6, 10, 17];
    const yValues = [0, 6, 2, 5];
    const x1Values = [5, 9, 15, 25];
    const y1Values = [5, 9, 8, 10];
    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            x1Values,
            y1Values
        }),
        columnXMode: EColumnMode.StartEnd, // x, x1
        columnYMode: EColumnYMode.TopBottom, // y, y1
        customTextureOptions: new StickFigureTextureOptions({ stroke: "white" }),
        fill: "cornflowerblue",
        stroke: "black",
        strokeThickness: 1,
        opacity: 0.5
    });
    // region_A_end
    sciChartSurface.renderableSeries.add(rectangleSeries);
}
rectangleSeriesTexture("scichart-root");
