import * as SciChart from "scichart";

// Example data: 40 soil samples from three imaginary fields, as percentages of sand, silt and clay.
// Generated with a seeded random generator, so the chart looks the same every time. Not real measurements.
function getSoilSampleData() {
    let seed = 20261116;
    const random = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());

    const fields = [
        { name: "River terrace", sand: 62, clay: 12, spread: 6, count: 14 },
        { name: "Valley floor", sand: 18, clay: 22, spread: 5, count: 14 },
        { name: "Hill slope", sand: 30, clay: 38, spread: 6, count: 12 }
    ];
    const samples = [];
    for (const field of fields) {
        for (let i = 0; i < field.count; i++) {
            const sand = Math.round(Math.min(95, Math.max(2, field.sand + field.spread * gaussian())));
            const clay = Math.round(Math.min(95 - sand, Math.max(2, field.clay + field.spread * gaussian())));
            samples.push({ name: `${field.name}, sample ${i + 1}`, sand, silt: 100 - sand - clay, clay });
        }
    }
    return samples;
}

// The 12 USDA soil texture classes. Each corner is [sand, silt, clay] in percent (USDA NRCS Soil Survey Manual).
function getSoilTextureClasses() {
    return [
        { name: "Clay", corners: [[0, 0, 100], [45, 0, 55], [45, 15, 40], [20, 40, 40], [0, 40, 60]] },
        { name: "Silty\nclay", corners: [[0, 40, 60], [20, 40, 40], [0, 60, 40]] },
        { name: "Sandy\nclay", corners: [[45, 0, 55], [65, 0, 35], [45, 20, 35]] },
        { name: "Clay loam", corners: [[45, 15, 40], [45, 28, 27], [20, 53, 27], [20, 40, 40]] },
        { name: "Silty clay\nloam", corners: [[20, 40, 40], [20, 53, 27], [0, 73, 27], [0, 60, 40]] },
        { name: "Sandy clay\nloam", corners: [[65, 0, 35], [80, 0, 20], [52, 28, 20], [45, 28, 27], [45, 20, 35]] },
        { name: "Loam", corners: [[45, 28, 27], [52, 28, 20], [52, 41, 7], [43, 50, 7], [23, 50, 27]] },
        { name: "Silt loam", corners: [[23, 50, 27], [50, 50, 0], [20, 80, 0], [8, 80, 12], [0, 88, 12], [0, 73, 27]] },
        { name: "Silt", corners: [[20, 80, 0], [0, 100, 0], [0, 88, 12], [8, 80, 12]], labelAt: [6, 88, 6] },
        { name: "Sandy loam", corners: [[52, 28, 20], [80, 0, 20], [85, 0, 15], [70, 30, 0], [50, 50, 0], [43, 50, 7], [52, 41, 7]], labelAt: [64, 25, 11] },
        { name: "Loamy sand", corners: [[85, 0, 15], [70, 30, 0], [85, 15, 0], [90, 0, 10]], labelAt: [80, 14, 6], fontSize: 11 },
        { name: "Sand", corners: [[90, 0, 10], [85, 15, 0], [100, 0, 0]], labelAt: [92, 6, 2], fontSize: 11 }
    ];
}

// #region_A_start
// Create a JavaScript ternary plot with SciChart.js: a triangular grid, shaded regions and scatter points
const {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    EAutoRange,
    XyDataSeries,
    FastLineSegmentRenderableSeries,
    FastTriangleRenderableSeries,
    ETriangleSeriesDrawMode,
    XyScatterRenderableSeries,
    EllipsePointMarker,
    NativeTextAnnotation,
    LineAnnotation,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EMultiLineAlignment,
    Thickness,
    CustomChartModifier2D,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    ZoomExtentsModifier,
    translateFromCanvasToSeriesViewRect,
    SciChartJsNavyTheme
} = SciChart;
// or, for npm, import { SciChartSurface, ... } from "scichart"

// 1. TERNARY HELPER (plain JavaScript, no SciChart code)
// The triangle has sides of 100 units. `left` is the bottom-left corner, `right` the bottom-right corner and
// `top` the apex. Each component's scale runs from 0 on the opposite side to 100 at its own corner.
const HEIGHT = Math.sqrt(3) / 2;

function createTernary(components) {
    const { left, right, top } = components;
    return {
        components,
        // (a, b, c) to (x, y): any three values that add up to a constant
        toXY(values) {
            const total = values[left.key] + values[right.key] + values[top.key];
            const r = (100 * values[right.key]) / total;
            const t = (100 * values[top.key]) / total;
            return { x: r + t / 2, y: t * HEIGHT };
        },
        // (x, y) back to percentages of each component
        fromXY(x, y) {
            const t = y / HEIGHT;
            const r = x - t / 2;
            return { [left.key]: 100 - r - t, [right.key]: r, [top.key]: t };
        },
        isInside(x, y) {
            const t = y / HEIGHT;
            const r = x - t / 2;
            return t >= 0 && r >= 0 && r + t <= 100;
        },
        // [a, b, c] given in the order left, right, top
        cornerToXY([a, b, c]) {
            return this.toXY({ [left.key]: a, [right.key]: b, [top.key]: c });
        }
    };
}

// Rounds percentages to whole numbers that still add up to 100 (largest remainder)
function roundTo100(values, keys) {
    const floors = keys.map((key) => Math.floor(values[key]));
    let missing = 100 - floors.reduce((sum, v) => sum + v, 0);
    const order = keys.map((key, i) => i).sort((i, j) => (values[keys[j]] % 1) - (values[keys[i]] % 1));
    for (const i of order) if (missing-- > 0) floors[i]++;
    return Object.fromEntries(keys.map((key, i) => [key, floors[i]]));
}

// Ear clipping: splits any simple polygon (convex or not) into triangles, returned as a flat list of corners
function triangulate(points) {
    const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    const pts = points.slice();
    const area = pts.reduce((sum, p, i) => sum + cross({ x: 0, y: 0 }, p, pts[(i + 1) % pts.length]), 0);
    if (area < 0) pts.reverse(); // make it anticlockwise
    const triangles = [];
    while (pts.length > 3) {
        let earIndex = -1;
        for (let i = 0; i < pts.length && earIndex < 0; i++) {
            const a = pts[(i + pts.length - 1) % pts.length];
            const b = pts[i];
            const c = pts[(i + 1) % pts.length];
            if (cross(a, b, c) <= 1e-9) continue; // not convex here
            const blocked = pts.some(
                (p) => p !== a && p !== b && p !== c && cross(a, b, p) >= 0 && cross(b, c, p) >= 0 && cross(c, a, p) >= 0
            );
            if (!blocked) earIndex = i;
        }
        if (earIndex < 0) break;
        const n = pts.length;
        triangles.push(pts[(earIndex + n - 1) % n], pts[earIndex], pts[(earIndex + 1) % n]);
        pts.splice(earIndex, 1);
    }
    if (pts.length === 3) triangles.push(...pts);
    return triangles;
}

function pointInPolygon(x, y, points) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const a = points[i];
        const b = points[j];
        if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
}

// 2. DRAWING HELPERS (SciChart)
function addText(sciChartSurface, x, y, text, options) {
    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            x1: x,
            y1: y,
            text,
            fontSize: 13,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            multiLineAlignment: EMultiLineAlignment.Center,
            ...options
        })
    );
}

// Frame, gridlines every `step` percent, ticks, tick labels and a title for each side
function addTernaryGrid(sciChartSurface, wasmContext, ternary, step = 10) {
    const { left, right, top } = ternary.components;
    const gridX = [];
    const gridY = [];
    const tickX = [];
    const tickY = [];
    const tickLength = 2.5;
    // Each component's ticks continue its own gridlines out of the triangle, so they show which way to read
    const sides = [
        { component: top, dir: { x: -1, y: 0 }, anchorH: EHorizontalAnchorPoint.Right, anchorV: EVerticalAnchorPoint.Center },
        { component: right, dir: { x: 0.5, y: HEIGHT }, anchorH: EHorizontalAnchorPoint.Left, anchorV: EVerticalAnchorPoint.Center },
        { component: left, dir: { x: 0.5, y: -HEIGHT }, anchorH: EHorizontalAnchorPoint.Left, anchorV: EVerticalAnchorPoint.Top }
    ];
    // Where the gridline for `value` of each component starts (on its labelled side) and ends
    const ends = {
        [top.key]: (v) => [ternary.cornerToXY([100 - v, 0, v]), ternary.cornerToXY([0, 100 - v, v])],
        [right.key]: (v) => [ternary.cornerToXY([0, v, 100 - v]), ternary.cornerToXY([100 - v, v, 0])],
        [left.key]: (v) => [ternary.cornerToXY([v, 100 - v, 0]), ternary.cornerToXY([v, 0, 100 - v])]
    };
    for (const side of sides) {
        for (let v = 0; v <= 100; v += step) {
            const [start, end] = ends[side.component.key](v);
            if (v > 0 && v < 100) {
                gridX.push(start.x, end.x);
                gridY.push(start.y, end.y);
            }
            tickX.push(start.x, start.x + side.dir.x * tickLength);
            tickY.push(start.y, start.y + side.dir.y * tickLength);
            addText(sciChartSurface, start.x + side.dir.x * 3.5, start.y + side.dir.y * 3.5, `${v}`, {
                textColor: side.component.color,
                horizontalAnchorPoint: side.anchorH,
                verticalAnchorPoint: side.anchorV
            });
        }
    }
    const corners = [ternary.cornerToXY([100, 0, 0]), ternary.cornerToXY([0, 100, 0]), ternary.cornerToXY([0, 0, 100])];
    const frameX = [];
    const frameY = [];
    corners.forEach((corner, i) => {
        const next = corners[(i + 1) % 3];
        frameX.push(corner.x, next.x);
        frameY.push(corner.y, next.y);
    });
    const segments = (xValues, yValues, stroke, strokeThickness) =>
        new FastLineSegmentRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            stroke,
            strokeThickness
        });
    sciChartSurface.renderableSeries.add(
        segments(gridX, gridY, "#FFFFFF22", 1),
        segments(tickX, tickY, "#C8D3E6", 1.5),
        segments(frameX, frameY, "#C8D3E6", 2)
    );
    // Side titles, rotated to run along each side, with an arrow pointing the way the values increase
    addText(sciChartSurface, 25 - 13 * HEIGHT, 43.3 + 13 * 0.5, `${top.name} (%) →`, { textColor: top.color, fontSize: 16, rotation: -60 });
    addText(sciChartSurface, 75 + 13 * HEIGHT, 43.3 + 13 * 0.5, `${right.name} (%) →`, { textColor: right.color, fontSize: 16, rotation: 60 });
    addText(sciChartSurface, 50, -11, `← ${left.name} (%)`, { textColor: left.color, fontSize: 16 });
}

// Shaded regions (for example soil texture classes), each a polygon of [left, right, top] corners
function addTernaryRegions(sciChartSurface, wasmContext, ternary, regions) {
    const palette = ["#6C8EF5", "#30BC9A", "#9B7BD4", "#E8336D", "#50C7E0"];
    const borderX = [];
    const borderY = [];
    const shapes = regions.map((region, index) => {
        const points = region.corners.map((corner) => ternary.cornerToXY(corner));
        const triangles = triangulate(points);
        sciChartSurface.renderableSeries.add(
            new FastTriangleRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: triangles.map((p) => p.x),
                    yValues: triangles.map((p) => p.y)
                }),
                drawMode: ETriangleSeriesDrawMode.List,
                fill: region.color ?? palette[index % palette.length],
                opacity: 0.16
            })
        );
        points.forEach((p, i) => {
            const next = points[(i + 1) % points.length];
            borderX.push(p.x, next.x);
            borderY.push(p.y, next.y);
        });
        // Label at the region's centre, unless a position is given
        const label = region.labelAt
            ? ternary.cornerToXY(region.labelAt)
            : { x: points.reduce((s, p) => s + p.x, 0) / points.length, y: points.reduce((s, p) => s + p.y, 0) / points.length };
        addText(sciChartSurface, label.x, label.y, region.name, { textColor: "#E6ECF5", fontSize: region.fontSize ?? 13, opacity: 0.85 });
        return { name: region.name.replace(/\n/g, " "), points };
    });
    sciChartSurface.renderableSeries.add(
        new FastLineSegmentRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues: borderX, yValues: borderY }),
            stroke: "#FFFFFF66",
            strokeThickness: 1.5
        })
    );
    // Returns the name of the region that (x, y) falls in
    return (x, y) => shapes.find((shape) => pointInPolygon(x, y, shape.points))?.name ?? "";
}

// Keeps the triangle equilateral: one data unit is the same number of pixels across and up
function fitTernaryView(sciChartSurface, area = { xMin: -18, xMax: 118, yMin: -18, yMax: 96 }) {
    const rect = sciChartSurface.seriesViewRect;
    if (!rect || rect.width <= 0 || rect.height <= 0) return;
    const pixelsPerUnit = Math.min(rect.width / (area.xMax - area.xMin), rect.height / (area.yMax - area.yMin));
    const halfWidth = rect.width / pixelsPerUnit / 2;
    const halfHeight = rect.height / pixelsPerUnit / 2;
    const xMid = (area.xMin + area.xMax) / 2;
    const yMid = (area.yMin + area.yMax) / 2;
    sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(xMid - halfWidth, xMid + halfWidth);
    sciChartSurface.yAxes.get(0).visibleRange = new NumberRange(yMid - halfHeight, yMid + halfHeight);
}

// Refits the view whenever the chart changes size (zooming and panning keep the shape on their own)
function keepTernaryEquilateral(sciChartSurface) {
    let lastSize = "";
    sciChartSurface.layoutMeasured.subscribe(() => {
        const rect = sciChartSurface.seriesViewRect;
        const size = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
        if (size !== lastSize) {
            lastSize = size;
            fitTernaryView(sciChartSurface);
        }
    });
}

// 3. TOOLTIP: reads all three components at the mouse, or of the nearest sample, and draws its three gridlines
class TernaryTooltipModifier extends CustomChartModifier2D {
    ternary;
    samples;
    findRegion;
    tooltip;
    guides;

    constructor(ternary, samples, findRegion) {
        super();
        this.ternary = ternary;
        this.samples = samples;
        this.findRegion = findRegion;
        this.tooltip = new NativeTextAnnotation({
            text: "",
            isHidden: true,
            textColor: "#FFFFFF",
            fontSize: 14,
            background: "#0F1A2BEE",
            multiLineAlignment: EMultiLineAlignment.Left,
            padding: new Thickness(6, 10, 6, 10),
            lineSpacing: 4,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom
        });
        const { left, right, top } = ternary.components;
        this.guides = [top, right, left].map(
            (component) =>
                new LineAnnotation({ stroke: component.color, strokeThickness: 2, strokeDashArray: [4, 3], isHidden: true })
        );
    }

    onAttach() {
        super.onAttach();
        this.parentSurface.annotations.add(...this.guides, this.tooltip);
    }

    onDetach() {
        this.parentSurface?.annotations.remove(this.tooltip);
        this.guides.forEach((guide) => this.parentSurface?.annotations.remove(guide));
        super.onDetach();
    }

    hide() {
        this.tooltip.isHidden = true;
        this.guides.forEach((guide) => (guide.isHidden = true));
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        const surface = this.parentSurface;
        const point = translateFromCanvasToSeriesViewRect(args.mousePoint, surface.seriesViewRect);
        if (!point) return this.hide();
        const xCalc = surface.xAxes.get(0).getCurrentCoordinateCalculator();
        const yCalc = surface.yAxes.get(0).getCurrentCoordinateCalculator();

        // The nearest sample within 14 pixels, otherwise the composition under the mouse
        let nearest = null;
        let nearestDistance = 14;
        for (const sample of this.samples) {
            const p = this.ternary.toXY(sample);
            const distance = Math.hypot(xCalc.getCoordinate(p.x) - point.x, yCalc.getCoordinate(p.y) - point.y);
            if (distance < nearestDistance) {
                nearest = sample;
                nearestDistance = distance;
            }
        }
        const mouseX = xCalc.getDataValue(point.x);
        const mouseY = yCalc.getDataValue(point.y);
        if (!nearest && !this.ternary.isInside(mouseX, mouseY)) return this.hide();

        const { left, right, top } = this.ternary.components;
        const keys = [left.key, right.key, top.key];
        const exact = nearest ?? this.ternary.fromXY(mouseX, mouseY);
        const values = nearest ? exact : roundTo100(exact, keys);
        const at = this.ternary.toXY(exact);

        // Each guide runs along that component's gridline, from the point to the side where its scale is
        const ends = [
            this.ternary.cornerToXY([100 - exact[top.key], 0, exact[top.key]]),
            this.ternary.cornerToXY([0, exact[right.key], 100 - exact[right.key]]),
            this.ternary.cornerToXY([exact[left.key], 100 - exact[left.key], 0])
        ];
        this.guides.forEach((guide, i) => {
            guide.x1 = at.x;
            guide.y1 = at.y;
            guide.x2 = ends[i].x;
            guide.y2 = ends[i].y;
            guide.isHidden = false;
        });

        const lines = [
            nearest ? nearest.name : "Under the cursor",
            `${top.name}: ${values[top.key]}%`,
            `${right.name}: ${values[right.key]}%`,
            `${left.name}: ${values[left.key]}%`,
            `Class: ${this.findRegion(at.x, at.y)}`
        ];
        const xRange = surface.xAxes.get(0).visibleRange;
        const nearRightEdge = at.x > xRange.min + xRange.diff * 0.6;
        this.tooltip.text = lines.join("\n");
        this.tooltip.horizontalAnchorPoint = nearRightEdge ? EHorizontalAnchorPoint.Right : EHorizontalAnchorPoint.Left;
        this.tooltip.x1 = at.x + xRange.diff * (nearRightEdge ? -0.015 : 0.015);
        this.tooltip.y1 = at.y + surface.yAxes.get(0).visibleRange.diff * 0.02;
        this.tooltip.isHidden = false;
    }

    modifierMouseLeave(args) {
        super.modifierMouseLeave(args);
        this.hide();
    }
}

// 4. THE CHART
async function ternaryPlot(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Which component goes on which corner, in the USDA soil texture triangle's layout
    const ternary = createTernary({
        left: { key: "sand", name: "Sand", color: "#F2C14E" },
        right: { key: "silt", name: "Silt", color: "#50C7E0" },
        top: { key: "clay", name: "Clay", color: "#F48420" }
    });

    // The axes only set the drawing area. They're hidden: a ternary plot draws its own three scales.
    const axisOptions = { isVisible: false, autoRange: EAutoRange.Never };
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { ...axisOptions, visibleRange: new NumberRange(-18, 118) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { ...axisOptions, visibleRange: new NumberRange(-18, 96) }));

    const findRegion = addTernaryRegions(sciChartSurface, wasmContext, ternary, getSoilTextureClasses());
    addTernaryGrid(sciChartSurface, wasmContext, ternary, 10);

    // Your data: one object per point, with a value for each component
    const samples = getSoilSampleData();
    const points = samples.map((sample) => ternary.toXY(sample));
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: points.map((p) => p.x),
                yValues: points.map((p) => p.y),
                dataSeriesName: "Soil samples"
            }),
            pointMarker: new EllipsePointMarker(wasmContext, { width: 10, height: 10, fill: "#FFFFFF", stroke: "#14233C", strokeThickness: 1.5 })
        })
    );

    // Keep the triangle equilateral whenever the chart changes size
    keepTernaryEquilateral(sciChartSurface);

    // Hover to read all three values, scroll to zoom, drag to pan, double-click to reset
    sciChartSurface.chartModifiers.add(
        new TernaryTooltipModifier(ternary, samples, findRegion),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier({
            onZoomExtents: () => {
                fitTernaryView(sciChartSurface);
                return false; // skip the default, which would stretch the triangle to fill the chart
            }
        })
    );
}
// #region_A_end

ternaryPlot("scichart-root");
