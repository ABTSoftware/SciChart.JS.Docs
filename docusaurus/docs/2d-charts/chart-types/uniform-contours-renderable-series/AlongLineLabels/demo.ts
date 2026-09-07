import {
    ContoursDataLabelProvider,
    DpiHelper,
    ENumericFormat,
    formatNumber,
    HeatmapColorMap,
    MouseWheelZoomModifier,
    NumericAxis,
    parseColorToUIntArgb,
    Point,
    Rect,
    SciChartJsNavyTheme,
    SciChartSurface,
    UniformContoursRenderableSeries,
    UniformHeatmapDataSeries,
    zeroArray2D,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import type { IContoursDataLabelProviderOptions, NumberArray, RenderPassData, WebGlRenderContext2D } from "scichart";

// #region_tracer_start
/** One straight piece of a contour line, in fractional grid-index space (`i` = column, `j` = row) */
type TContourSegment = { level: number; i0: number; j0: number; i1: number; j1: number };

/** Where between two samples the contour crosses */
const crossing = (from: number, to: number, level: number) => (level - from) / (to - from);

/**
 * Traces the contour lines of a 2D array with marching squares, in one pass over the cells for all
 * levels. Returns loose segments rather than stitched polylines - enough to place a label on a line
 * and know which way the line runs there, which is all the label provider below needs.
 */
const traceContourSegments = (zValues: NumberArray[], levels: number[]): TContourSegment[] => {
    const segments: TContourSegment[] = [];
    const height = zValues.length;
    const width = zValues[0].length;

    for (let j = 0; j < height - 1; j++) {
        for (let i = 0; i < width - 1; i++) {
            // The four corners of this cell, counter-clockwise from bottom-left
            const v00 = zValues[j][i];
            const v10 = zValues[j][i + 1];
            const v11 = zValues[j + 1][i + 1];
            const v01 = zValues[j + 1][i];
            const min = Math.min(v00, v10, v11, v01);
            const max = Math.max(v00, v10, v11, v01);

            for (const level of levels) {
                // With "corner is above" meaning value > level, a cell is crossed exactly when this holds
                if (level < min || level >= max) continue;

                const bottom = () => ({ i: i + crossing(v00, v10, level), j });
                const top = () => ({ i: i + crossing(v01, v11, level), j: j + 1 });
                const left = () => ({ i, j: j + crossing(v00, v01, level) });
                const right = () => ({ i: i + 1, j: j + crossing(v10, v11, level) });
                const add = (from: { i: number; j: number }, to: { i: number; j: number }) =>
                    segments.push({ level, i0: from.i, j0: from.j, i1: to.i, j1: to.j });

                // Which corners are above the level decides which edges the line enters and leaves by
                const bits =
                    (v00 > level ? 1 : 0) | (v10 > level ? 2 : 0) | (v11 > level ? 4 : 0) | (v01 > level ? 8 : 0);
                switch (bits) {
                    case 1:
                    case 14:
                        add(left(), bottom());
                        break;
                    case 2:
                    case 13:
                        add(bottom(), right());
                        break;
                    case 3:
                    case 12:
                        add(left(), right());
                        break;
                    case 4:
                    case 11:
                        add(right(), top());
                        break;
                    case 6:
                    case 9:
                        add(bottom(), top());
                        break;
                    case 7:
                    case 8:
                        add(top(), left());
                        break;
                    // Saddle: the cell centre decides which pair of corners is joined
                    case 5:
                    case 10: {
                        const centreAbove = (v00 + v10 + v11 + v01) / 4 > level;
                        if (bits === 5 ? !centreAbove : centreAbove) {
                            add(left(), bottom());
                            add(right(), top());
                        } else {
                            add(bottom(), right());
                            add(top(), left());
                        }
                        break;
                    }
                }
            }
        }
    }
    return segments;
};
// #region_tracer_end

// #region_provider_start
export interface IAlongLineLabelOptions extends IContoursDataLabelProviderOptions {
    /** Smallest gap, in pixels, allowed between two labels on the same contour line. Default 140 */
    labelSpacing?: number;
    /** Rotate each label to follow the line it sits on. Default true */
    rotateToLine?: boolean;
}

/**
 * Lays contour labels *along* their lines, rotated to follow them, in the manner of matplotlib
 * clabel. Subclasses the built-in provider and replaces generateDataLabels wholesale: the built-in
 * one scans a number of fixed horizontal rows, which puts an upright label wherever a row happens
 * to cross a line. Everything else - style, color, numericFormat, precision, isEnabled - is
 * inherited unchanged.
 */
export class AlongLineContoursDataLabelProvider extends ContoursDataLabelProvider {
    public labelSpacing: number;
    public rotateToLine: boolean;

    public constructor(options?: IAlongLineLabelOptions) {
        super(options);
        this.labelSpacing = options?.labelSpacing ?? 140;
        this.rotateToLine = options?.rotateToLine ?? true;
    }

    /** Rotated text needs the alternative, transformable font instance */
    protected get useRotation(): boolean {
        return this.rotateToLine;
    }

    public generateDataLabels(renderContext: WebGlRenderContext2D, renderPassData: RenderPassData): void {
        this.dataLabels = [];
        if (!this.isEnabled || !this.style?.fontFamily || !this.style?.fontSize) return;

        const series = this.parentSeries as UniformContoursRenderableSeries;
        const dataSeries = series.dataSeries as UniformHeatmapDataSeries;
        if (!dataSeries) return;

        // The levels the contour shader is drawing: an explicit list, or one every minor step
        const params = series.getContourDrawingParams();
        const levels: number[] = params.zLevels?.length
            ? params.zLevels.slice().sort((left, right) => left - right)
            : [];
        if (levels.length === 0 && params.minorStepZ > 0) {
            for (let z = params.zMin + params.zOffset; z <= params.zMax; z += params.minorStepZ) {
                levels.push(z);
            }
        }
        if (levels.length === 0) return;

        const segments = traceContourSegments(dataSeries.getZValues(), levels);
        if (segments.length === 0) return;

        // The contour surface is a texture stretched over [xMin, xMax] x [yMin, yMax], with the data
        // samples at cell centres. Mapping grid indices to pixels the same way puts the labels exactly
        // on the drawn lines, whatever the axis type.
        const { xCoordinateCalculator: xCalc, yCoordinateCalculator: yCalc } = renderPassData;
        const xStartPx = xCalc.getCoordinate(params.xMin);
        const yStartPx = yCalc.getCoordinate(params.yMin);
        const perColumn = (xCalc.getCoordinate(params.xMax) - xStartPx) / dataSeries.arrayWidth;
        const perRow = (yCalc.getCoordinate(params.yMax) - yStartPx) / dataSeries.arrayHeight;

        const font = renderContext.getFont(DpiHelper.adjustTextStyle(this.style), this.useRotation);
        const lineSpacing = this.getLineSpacing();
        const bounds = this.textBounds;
        const color = parseColorToUIntArgb(this.color);
        const viewRect = series.parentSurface.seriesViewRect;
        const minGap = Math.max(1, this.labelSpacing) * DpiHelper.PIXEL_RATIO;
        const placed: { level: number; x: number; y: number; rect: Rect }[] = [];

        for (const segment of segments) {
            const ax = xStartPx + (segment.i0 + 0.5) * perColumn;
            const ay = yStartPx + (segment.j0 + 0.5) * perRow;
            const bx = xStartPx + (segment.i1 + 0.5) * perColumn;
            const by = yStartPx + (segment.j1 + 0.5) * perRow;
            const centreX = (ax + bx) / 2;
            const centreY = (ay + by) / 2;
            const dx = bx - ax;
            const dy = by - ay;
            if (dx === 0 && dy === 0) continue;

            // Thin the labels out before doing any text measurement: one per labelSpacing along a line
            const tooClose = placed.some(
                other =>
                    other.level === segment.level &&
                    (other.x - centreX) ** 2 + (other.y - centreY) ** 2 < minGap * minGap
            );
            if (tooClose) continue;

            // Screen y grows downwards and the text is drawn counter-clockwise, hence the minus.
            // Fold the angle into a quarter turn either way so the text is never upside down.
            let rotationAngle = this.rotateToLine ? -Math.atan2(dy, dx) : 0;
            if (rotationAngle > Math.PI / 2) rotationAngle -= Math.PI;
            else if (rotationAngle < -Math.PI / 2) rotationAngle += Math.PI;

            const text = formatNumber(segment.level, this.numericFormat, this.precision);
            font.CalculateStringBounds(text, bounds, lineSpacing);
            const textWidth = bounds.m_fWidth;
            const textHeight = bounds.m_fHeight;
            // position.y is the alphabetic baseline of the first line, not the top of the text
            const lineBounds = bounds.GetLineBounds(0);
            const firstLineHeight = lineBounds.m_fHeight;
            lineBounds.delete();

            // Axis-aligned box of the rotated text, used for the clipping and overlap tests
            const sin = Math.abs(Math.sin(rotationAngle));
            const cos = Math.abs(Math.cos(rotationAngle));
            const boxWidth = textWidth * cos + textHeight * sin;
            const boxHeight = textWidth * sin + textHeight * cos;
            const rect = new Rect(centreX - boxWidth / 2, centreY - boxHeight / 2, boxWidth, boxHeight);

            // Drop anything hanging outside the chart, or landing on a label already placed
            if (rect.x < 0 || rect.y < 0 || rect.right > viewRect.width || rect.bottom > viewRect.height) continue;
            if (placed.some(other => rectsOverlap(other.rect, rect))) continue;

            placed.push({ level: segment.level, x: centreX, y: centreY, rect });
            this.dataLabels.push({
                text,
                position: new Point(centreX - textWidth / 2, centreY - textHeight / 2 + firstLineHeight),
                rect,
                color,
                dataX: xCalc.getDataValue(centreX),
                dataY: yCalc.getDataValue(centreY),
                rotationAngle,
                rotationCenter: new Point(centreX, centreY)
            });
        }
    }
}

const rectsOverlap = (first: Rect, second: Rect): boolean =>
    first.left < second.right && second.left < first.right && first.top < second.bottom && second.top < first.bottom;
// #region_provider_end

/** A two-well potential: near-circular level sets around each well, with a saddle between them */
function generateExampleData(width: number, height: number) {
    const zValues = zeroArray2D([height, width]);
    const wells = [
        { x: -1.2, y: -0.6, strength: 25 },
        { x: 1.5, y: 0.9, strength: 12 }
    ];
    for (let i = 0; i < width; i++) {
        const x = -4 + ((i + 0.5) / width) * 8;
        for (let j = 0; j < height; j++) {
            const y = -4 + ((j + 0.5) / height) * 8;
            let value = 0;
            for (const well of wells) {
                // The 0.1 softens the singularity, so the innermost level set is a few cells across
                const radius = Math.hypot(x - well.x, y - well.y, 0.1);
                value -= well.strength * Math.log(radius);
            }
            zValues[j][i] = value;
        }
    }
    return zValues;
}

// #region_main_start
const Z_LEVELS = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30];

const createChart = async (divElementId: string, dataLabelProvider: ContoursDataLabelProvider) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const SIZE = 300;
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        zValues: generateExampleData(SIZE, SIZE),
        xStart: -4,
        xStep: 8 / SIZE,
        yStart: -4,
        yStep: 8 / SIZE
    });

    const contourSeries = new UniformContoursRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        zLevels: Z_LEVELS,
        strokeThickness: 2,
        stroke: "#50C7E0",
        colorMap: new HeatmapColorMap({ minimum: -70, maximum: 45, gradientStops: [] })
    });
    // dataLabelProvider is a plain property, so a custom provider drops straight in
    contourSeries.dataLabelProvider = dataLabelProvider;
    sciChartSurface.renderableSeries.add(contourSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
    return sciChartSurface;
};

const drawExample = async () => {
    // Left: the built-in provider. Labels are upright, and land wherever its fixed rows cross a line
    await createChart(
        "scichart-root",
        new ContoursDataLabelProvider({
            style: { fontSize: 12 },
            color: "#FFFFFF",
            labelRowCount: 3,
            precision: 0
        })
    );

    // Right: the custom provider above. Labels follow the lines and space themselves along them
    await createChart(
        "scichart-root-2",
        new AlongLineContoursDataLabelProvider({
            style: { fontSize: 12 },
            color: "#FFFFFF",
            labelSpacing: 130,
            rotateToLine: true,
            precision: 0
        })
    );
};
// #region_main_end

drawExample();
