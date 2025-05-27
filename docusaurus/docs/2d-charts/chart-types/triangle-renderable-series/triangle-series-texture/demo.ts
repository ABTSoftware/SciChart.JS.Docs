import {
    NumberRange,
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    TriangleRenderableSeries,
    ETriangleSeriesDrawMode,
    ZoomPanModifier,
    ZoomExtentsModifier,
    XyxyDataSeries,
    applyOpacityToHtmlColor,
} from "scichart";

class StickFigureTextureOptions {
    isPerPrimitive = false;
    options;
    textureHeight = 150;
    textureWidth = 75;
    repeat = true;
    constructor(options) {
        this.options = options;
    }
    createTexture(context, options) {
        // console.log("!!!", options);
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

async function triangleSeriesTexture(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    // region_A_start
    const polygonSeries = new TriangleRenderableSeries(wasmContext, {
        isDigitalLine: false,
        fill: "cornflowerblue",
        drawMode: ETriangleSeriesDrawMode.Polygon,
        polygonVertices: 6, // Sets the number of vertices per polygon. Applies only for drawMode ETriangleSeriesDrawMode.Polygon
        customTextureOptions: new StickFigureTextureOptions({ stroke: "white" }),
        opacity: 0.5
    });

    const dataSeries = new XyxyDataSeries(wasmContext);

    function generateRectangle(minX, maxX, minY, maxY) {
        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;

        [
            [midX, midY, 0.5, 0.5], // Center point
            [minX, minY, 0, 1], // Bottom-left
            [maxX, minY, 1, 1], // Bottom-right
            [maxX, maxY, 1, 0], // Top-right
            [minX, maxY, 0, 0], // Top-left
            [minX, minY, 0, 1] // Bottom-left (duplicate)
        ].forEach(d => {
            dataSeries.append(d[0], d[1], d[2], d[3]);
        });
    }

    generateRectangle(500, 900, 100, 600);
    generateRectangle(350, 450, 100, 600);
    generateRectangle(100, 300, 100, 325);
    generateRectangle(100, 300, 375, 600);

    polygonSeries.dataSeries = dataSeries;

    // region_A_end

    sciChartSurface.renderableSeries.add(polygonSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());
}

triangleSeriesTexture("scichart-root");
