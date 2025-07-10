import { deleteSafe, Guard, DpiHelper, LineAnnotation } from "scichart";
import { BrushCache, createBrushInCache, getWebGlBrushFromCache } from "scichart/Charting/Drawing/BrushCache";
import { createPenInCache, getWebGlPenFromCache, Pen2DCache } from "scichart/Charting/Drawing/Pen2DCache";
/**
 * Enumeration of possible positions for the circle(s) inside a {@link LineDumbbellAnnotation}
 */
export var ECirclePosition;
(function (ECirclePosition) {
    /**
     * The circle will be at `x2y2`
     */
    ECirclePosition["End"] = "End";
    /**
     * The circle will be at `x1y1`
     */
    ECirclePosition["Start"] = "Start";
    /**
     * Circles will be at both `x1y1` and `x2y2`
     * Default value
     */
    ECirclePosition["StartEnd"] = "StartEnd";
})(ECirclePosition || (ECirclePosition = {}));
/**
 * @summary The {@link LineDumbbellAnnotation} provides an {@link LineAnnotation} which draws a line with circles at
 * the start and/or end points over the {@link SciChartSurface}
 * @description
 * To add a {@link LineDumbbellAnnotation} to a {@link SciChartSurface}, use the following code:
 * ```ts
 * const sciChartSurface: SciChartSurface;
 * const dumbbelAnnotation = new LineDumbbellAnnotation({
 *   x1: 1, y1: 3, x2: 2, y2: 4,
 *   stroke: "#FF0000",
 *   strokeThickness: 2,
 *   circleRadius: 5,
 *   circleStrokeThickness: 1,
 *   circleStroke: "#000000",
 *   circleFill: "#FF0000",
 *   circlePosition: ECirclePosition.StartEnd
 * });
 * sciChartSurface.annotations.add(dumbbelAnnotation);
 * ```
 * @remarks Uses the fast WebGL/WebAssembly {@link WebGL2RenderingContext} for rendering
 */
export class LineDumbbellAnnotation extends LineAnnotation {
    /**
     * Fill brush for the circles
     */
    circleFillBrushCache;
    /**
     * Stroke pen for the circles
     */
    circleStrokePenCache;
    circleRadiusProperty = 5;
    circleStrokeThicknessProperty = 1;
    circleStrokeProperty;
    circleFillProperty;
    circlePositionProperty = ECirclePosition.StartEnd;
    /**
     * Create an instance of a LineDumbbellAnnotation
     * @param options Optional parameters of type {@link ILineDumbbellAnnotationOptions} which configure the annotation upon construction
     */
    constructor(options) {
        super(options);
        this.circleRadiusProperty = options?.circleRadius ?? this.circleRadiusProperty;
        this.circleStrokeThicknessProperty = options?.circleStrokeThickness ?? this.circleStrokeThicknessProperty;
        this.circleStrokeProperty = options?.circleStroke;
        this.circleFillProperty = options?.circleFill;
        this.circlePositionProperty = options?.circlePosition ?? this.circlePositionProperty;
    }
    /**
     * Gets the radius of the circle in pixels
     */
    get circleRadius() {
        return this.circleRadiusProperty;
    }
    /**
     * Sets the radius of the circle in pixels
     */
    set circleRadius(value) {
        this.circleRadiusProperty = value;
        this.notifyPropertyChanged("CIRCLE_RADIUS");
    }
    /**
     * Gets the stroke thickness of the circle in pixels
     */
    get circleStrokeThickness() {
        return this.circleStrokeThicknessProperty;
    }
    /**
     * Sets the stroke thickness of the circle in pixels
     */
    set circleStrokeThickness(value) {
        this.circleStrokeThicknessProperty = value;
        this.notifyPropertyChanged("CIRCLE_STROKE_THICKNESS");
    }
    /**
     * Gets the outline color of the circle
     */
    get circleStroke() {
        return this.circleStrokeProperty ?? this.stroke;
    }
    /**
     * Sets the outline color of the circle
     */
    set circleStroke(value) {
        this.circleStrokeProperty = value;
        this.notifyPropertyChanged("CIRCLE_STROKE");
    }
    /**
     * Gets the fill color of the circle
     */
    get circleFill() {
        return this.circleFillProperty ?? this.stroke;
    }
    /**
     * Sets the fill color of the circle
     */
    set circleFill(value) {
        this.circleFillProperty = value;
        this.notifyPropertyChanged("CIRCLE_FILL");
    }
    /**
     * Gets the position of the circle(s)
     */
    get circlePosition() {
        return this.circlePositionProperty;
    }
    /**
     * Sets the position of the circle(s)
     */
    set circlePosition(value) {
        this.circlePositionProperty = value;
        this.notifyPropertyChanged("CIRCLE_POSITION");
    }
    /** @inheritDoc */
    onAttach(scs) {
        super.onAttach(scs);
        if (!this.circleStrokePenCache) {
            this.circleStrokePenCache = new Pen2DCache(scs.webAssemblyContext2D);
        }
        createPenInCache(this.circleStrokePenCache, this.circleStroke, this.circleStrokeThickness, this.opacity);
        if (!this.circleFillBrushCache) {
            this.circleFillBrushCache = new BrushCache(scs.webAssemblyContext2D);
        }
        createBrushInCache(this.circleFillBrushCache, this.circleFill, this.opacity);
    }
    /** @inheritDoc */
    delete() {
        super.delete();
        this.circleFillBrushCache = deleteSafe(this.circleFillBrushCache);
        this.circleStrokePenCache = deleteSafe(this.circleStrokePenCache);
    }
    /** @inheritDoc */
    drawWithContext(renderContext, xCalc, yCalc, seriesViewRect, surfaceViewRect, chartViewRect) {
        Guard.notNull(renderContext, "renderContext");
        Guard.notNull(xCalc, "xCalc");
        Guard.notNull(yCalc, "yCalc");
        const { x: borderX1, y: borderY1 } = this.convertPolarToCartesian(this.getX1Coordinate(xCalc, yCalc), this.getY1Coordinate(xCalc, yCalc));
        const { x: borderX2, y: borderY2 } = this.convertPolarToCartesian(this.getX2Coordinate(xCalc, yCalc), this.getY2Coordinate(xCalc, yCalc));
        this.setAnnotationBorders(borderX1, borderX2, borderY1, borderY2);
        const clipRect = this.getClippingRect(this.clipping, seriesViewRect, surfaceViewRect, chartViewRect);
        const { x1, x2, y1, y2 } = this.getAnnotationBorders();
        const dx = x2 - x1;
        const dy = y2 - y1;
        if (dx === 0 && dy === 0) {
            return;
        }
        this.drawLine(renderContext, x1, y1, x2, y2, seriesViewRect, surfaceViewRect, chartViewRect);
        const scaledCircleRadius = this.circleRadiusProperty * DpiHelper.PIXEL_RATIO;
        if (this.circlePosition === ECirclePosition.Start || this.circlePosition === ECirclePosition.StartEnd) {
            this.drawCircle(renderContext, x1, y1, scaledCircleRadius, seriesViewRect, clipRect);
        }
        if (this.circlePosition === ECirclePosition.End || this.circlePosition === ECirclePosition.StartEnd) {
            this.drawCircle(renderContext, x2, y2, scaledCircleRadius, seriesViewRect, clipRect);
        }
    }
    drawLine(renderContext, x1, y1, x2, y2, seriesViewRect, surfaceViewRect, chartViewRect) {
        const strokePen = this.stroke && this.strokeThickness && this.strokePenCache
            ? getWebGlPenFromCache(this.strokePenCache)
            : undefined;
        if (strokePen) {
            const clipRect = this.getClippingRect(this.clipping, seriesViewRect, surfaceViewRect, chartViewRect);
            renderContext.drawLine(x1, y1, x2, y2, strokePen, seriesViewRect, clipRect);
        }
        this.updateAdornerInner();
    }
    drawCircle(renderContext, centerX, centerY, radius, seriesViewRect, clipRect) {
        const strokePen = getWebGlPenFromCache(this.circleStrokePenCache);
        const fillBrush = getWebGlBrushFromCache(this.circleFillBrushCache);
        const points = [];
        const numSegments = 32; // Number of segments to approximate the circle
        for (let i = 0; i < numSegments; i++) {
            const angle = (i / numSegments) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            points.push(x, y);
        }
        // Close the circle
        points.push(points[0], points[1]);
        if (fillBrush) {
            // TODO-andrei - fill
            // renderContext.drawPolygon(points, fillBrush, seriesViewRect, clipRect);
        }
        if (strokePen) {
            renderContext.drawLines(points, strokePen, seriesViewRect, clipRect);
        }
    }
    /** @inheritDoc */
    notifyPropertyChanged(propertyName) {
        super.notifyPropertyChanged(propertyName);
        const circlePenRelated = ["CIRCLE_STROKE", "CIRCLE_STROKE_THICKNESS", "OPACITY", "STROKE"];
        if (this.circleStrokePenCache && circlePenRelated.includes(propertyName)) {
            createPenInCache(this.circleStrokePenCache, this.circleStroke, this.circleStrokeThickness, this.opacity);
        }
        const circleBrushRelated = ["CIRCLE_FILL", "OPACITY", "STROKE"];
        if (this.circleFillBrushCache && circleBrushRelated.includes(propertyName)) {
            createBrushInCache(this.circleFillBrushCache, this.circleFill, this.opacity);
        }
    }
}
