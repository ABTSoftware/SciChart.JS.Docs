import {
    NumberRange,
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    TriangleRenderableSeries,
    XyDataSeries,
    ETriangleSeriesDrawMode,
    ZoomPanModifier,
    ZoomExtentsModifier,
    EFillPaletteMode,
    parseColorToUIntArgb,
    GradientParams,
    Point,
    XyxyDataSeries
} from "scichart";

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

async function basicTriangleSeriesChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    const polygonSeries = new TriangleRenderableSeries(wasmContext, {
        isDigitalLine: false,
        fill: "pink",
        drawMode: ETriangleSeriesDrawMode.Polygon,
        polygonVertices: 6, // Sets the number of vertices per polygon. Applies only for drawMode ETriangleSeriesDrawMode.Polygon
        opacity: 0.5, // not working
        // customTextureOptions: new StickFigureTextureOptions({ stroke: "black" }),
        // fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
        //     { color: "#f39c12", offset: 0 },
        //     { color: "#8e44ad", offset: 1 }
        // ])
    });

    sciChartSurface.renderableSeries.add(polygonSeries);

    const dataSeries = new XyxyDataSeries(wasmContext);

    dataSeries.append(200, 200, 0.5, 0.5);
    dataSeries.append(100, 100, 0, 1);
    dataSeries.append(100, 300, 0, 0);
    dataSeries.append(300, 300, 1, 0);
    dataSeries.append(300, 100, 1, 1);
    dataSeries.append(100, 100, 0, 1);

    // Treat center as bottom and all other points as top to give radial gradient
    dataSeries.append(200, 500, 0, 0);
    dataSeries.append(100, 400, 1, 1);
    dataSeries.append(100, 600, 1, 1);
    dataSeries.append(300, 600, 1, 1);
    dataSeries.append(300, 400, 1, 1);
    dataSeries.append(100, 400, 1, 1);

    dataSeries.append(500, 300, 0, 0.7);
    dataSeries.append(600, 500, 0.3, 0.2);
    dataSeries.append(700, 550, 0.5, 0);
    dataSeries.append(800, 500, 0.7, 0.2);
    dataSeries.append(900, 300, 1, 0.7);
    dataSeries.append(700, 200, 0.5, 1);

    polygonSeries.dataSeries = dataSeries;

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());
}

basicTriangleSeriesChart("scichart-root");
