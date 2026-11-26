import * as SciChart from "scichart";

// #region_A_start
// A function grapher: type in functions of x (Cartesian) or θ (polar), draw them with SciChart.js, and find where
// they cross and the area between them. The expressions are parsed by math.js; the analysis is plain JavaScript.
const MATHJS_URL = "https://cdn.jsdelivr.net/npm/mathjs@15.3.0/+esm";
// or, for npm: import { parse } from "mathjs"

const MAX_FAMILY = 12; // most curves one function with a parameter can draw
const MAX_POINTS = 200; // most intersection points marked
const TWO_PI = 2 * Math.PI;

// --- Parsing: text such as "x^2 / 4" or "1 + cos(n theta)" becomes functions (value, parameter) => number ---
// variables are the names the function's variable can be typed as, e.g. ["x"] or ["theta", "t"].
// Any other unknown name is the parameter, so "x^n" is a family of curves, one for each value of n.
// Returns the function, its first and second derivatives, and the first derivative's formula as text.
function parseFunction(math, text, variables) {
    const expression = text
        .replace(/^\s*(y|r|f\s*\(\s*\w+\s*\))\s*=/, "") // allow "y = ...", "r = ..." and "f(x) = ..."
        .replace(/θ/g, "theta")
        .replace(/π/g, "pi")
        .replace(/\bln\s*\(/g, "log("); // math.js calls the natural logarithm log
    if (!expression.trim()) throw new Error("Type a function");
    const node = math.parse(expression);
    const names = [];
    node.traverse((child, path, parent) => {
        const isFunctionName = parent && parent.isFunctionNode && path === "fn";
        if (child.isSymbolNode && !isFunctionName && !(child.name in math) && !names.includes(child.name))
            names.push(child.name);
    });
    const parameters = names.filter(name => !variables.includes(name));
    if (parameters.length > 1) throw new Error("Use one parameter at most; found " + parameters.join(", "));
    const parameter = parameters.length ? parameters[0] : null;

    const scope = {};
    const toFunction = expressionNode => {
        const code = expressionNode.compile();
        return (value, parameterValue) => {
            for (const name of variables) scope[name] = value;
            if (parameter) scope[parameter] = parameterValue;
            try {
                const result = code.evaluate(scope);
                return typeof result === "number" ? result : NaN; // e.g. sqrt(-1) is a complex number: no point to draw
            } catch (error) {
                return NaN;
            }
        };
    };
    for (const name of names) scope[name] = 1;
    node.compile().evaluate(scope); // throws now for a name math.js doesn't know, such as "sine(x)"
    const evaluate = toFunction(node);

    // math.js differentiates most expressions symbolically, which is exact and gives a formula to show.
    // For the few it can't (floor(x), say), fall back to finite differences
    let derivative;
    let second;
    let derivativeText = "";
    try {
        const derivativeNode = math.derivative(node, variables[0]);
        derivative = toFunction(derivativeNode);
        second = toFunction(math.derivative(derivativeNode, variables[0]));
        derivativeText = derivativeNode.toString();
    } catch (error) {
        derivative = (x, p) => {
            const h = 1e-4 * (1 + Math.abs(x));
            return (evaluate(x + h, p) - evaluate(x - h, p)) / (2 * h);
        };
        second = (x, p) => {
            const h = 1e-3 * (1 + Math.abs(x));
            return (evaluate(x + h, p) - 2 * evaluate(x, p) + evaluate(x - h, p)) / (h * h);
        };
    }
    return { evaluate, derivative, second, derivativeText, parameter };
}

// --- Analysis, Cartesian: where y = f(x) and y = g(x) cross, from samples at xs ---
// With touching, also where they touch without crossing (x^2 and x^4 at 0).
// The same search finds a function's roots (g = 0), turning points (f' against 0) and inflections (f'' against 0)
function findCrossings(f, g, xs, fy, gy, touching) {
    const d = x => f(x) - g(x);
    const roots = [];
    const accept = (x, tolerance) => {
        const y = f(x);
        if (Number.isFinite(y) && Math.abs(d(x)) <= tolerance * (1 + Math.abs(y))) roots.push(x);
    };
    for (let i = 0; i < xs.length - 1; i++) {
        const a = fy[i] - gy[i];
        const b = fy[i + 1] - gy[i + 1];
        if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
        if (a === 0) {
            // A sample exactly on a zero: a crossing if the sign differs either side, otherwise a touch
            const before = i > 0 ? fy[i - 1] - gy[i - 1] : NaN;
            if (touching || before * b < 0) roots.push(xs[i]);
        } else if (a * b < 0) {
            // A sign change: halve the interval until it closes on the crossing. At a pole (tan x against 0) the
            // difference changes sign too, but it is huge there, so accept() turns it down
            let lo = xs[i];
            let hi = xs[i + 1];
            for (let k = 0; k < 60; k++) {
                const mid = (lo + hi) / 2;
                if (d(lo) * d(mid) <= 0) hi = mid;
                else lo = mid;
            }
            accept((lo + hi) / 2, 1e-6);
        } else if (touching && i > 0) {
            // No sign change, but the gap is smallest here: the curves may touch.
            // Golden-section search for the smallest gap between the two neighbouring samples
            const before = fy[i - 1] - gy[i - 1];
            if (Number.isFinite(before) && Math.abs(a) < Math.abs(before) && Math.abs(a) <= Math.abs(b)) {
                const ratio = (Math.sqrt(5) - 1) / 2;
                let lo = xs[i - 1];
                let hi = xs[i + 1];
                for (let k = 0; k < 80; k++) {
                    const x1 = hi - ratio * (hi - lo);
                    const x2 = lo + ratio * (hi - lo);
                    if (Math.abs(d(x1)) < Math.abs(d(x2))) hi = x2;
                    else lo = x1;
                }
                accept((lo + hi) / 2, 1e-10);
            }
        }
    }
    const last = xs.length - 1;
    if (touching && fy[last] - gy[last] === 0) roots.push(xs[last]);
    // Two functions that are equal everywhere have no separate crossings
    if (roots.length > 50) return [];
    const spacing = xs[1] - xs[0];
    return roots.filter((x, i) => i === 0 || x - roots[i - 1] > spacing * 1e-3);
}

// The integral of f - g from one x to another, and the area between the two curves there.
// The area adds up the pieces between crossings, each taken as positive; Simpson's rule on each piece.
// Returns null where the integral isn't finite: a pole shows as a sign change with a jump larger than jump
function integrate(f, g, from, to, jump) {
    const lo = Math.min(from, to);
    const hi = Math.max(from, to);
    if (hi === lo) return { signed: 0, area: 0 };
    const d = x => f(x) - g(x);
    const xs = [];
    const fy = [];
    const gy = [];
    for (let i = 0; i <= 2000; i++) {
        const x = lo + ((hi - lo) * i) / 2000;
        xs.push(x);
        fy.push(f(x));
        gy.push(g(x));
        const gap = fy[i] - gy[i];
        const previous = fy[i - 1] - gy[i - 1];
        if (!Number.isFinite(gap)) return null;
        if (i > 0 && gap * previous < 0 && Math.abs(gap - previous) > jump) return null;
    }
    const simpson = (a, b) => {
        const steps = 200;
        const h = (b - a) / steps;
        let sum = 0;
        for (let k = 0; k <= steps; k++) sum += (k === 0 || k === steps ? 1 : k % 2 === 1 ? 4 : 2) * d(a + k * h);
        return (sum * h) / 3;
    };
    const cuts = [lo, ...findCrossings(f, g, xs, fy, gy, false).filter(x => x > lo && x < hi), hi];
    let signed = 0;
    let area = 0;
    for (let i = 0; i < cuts.length - 1; i++) {
        const piece = simpson(cuts[i], cuts[i + 1]);
        signed += piece;
        area += Math.abs(piece);
    }
    return { signed: from <= to ? signed : -signed, area };
}

// --- Analysis, polar: two curves can meet at different values of θ, so solving r1(θ) = r2(θ) misses crossings.
// Instead, treat each curve as a chain of short straight pieces in x-y and test every pair of pieces ---
function findPolylineCrossings(a, b) {
    const points = [];
    for (let i = 0; i < a.x.length - 1 && points.length < MAX_POINTS; i++) {
        const ax = a.x[i];
        const ay = a.y[i];
        const rx = a.x[i + 1] - ax;
        const ry = a.y[i + 1] - ay;
        if (!Number.isFinite(rx + ry)) continue;
        const aLeft = Math.min(ax, ax + rx);
        const aRight = Math.max(ax, ax + rx);
        for (let j = 0; j < b.x.length - 1; j++) {
            const bx = b.x[j];
            const bx2 = b.x[j + 1];
            if ((bx < aLeft && bx2 < aLeft) || (bx > aRight && bx2 > aRight)) continue; // too far apart to cross
            const sx = bx2 - bx;
            const sy = b.y[j + 1] - b.y[j];
            const cross = rx * sy - ry * sx;
            if (!Number.isFinite(cross) || cross === 0) continue;
            const t = ((bx - ax) * sy - (b.y[j] - ay) * sx) / cross;
            const u = ((bx - ax) * ry - (b.y[j] - ay) * rx) / cross;
            if (t >= 0 && t < 1 && u >= 0 && u < 1) points.push({ x: ax + t * rx, y: ay + t * ry });
        }
    }
    return points;
}

// Keep one of any points closer together than tolerance (three curves through one point give three pairs)
function distinctPoints(points, tolerance) {
    const kept = [];
    for (const point of points) {
        if (kept.length >= MAX_POINTS) break;
        if (!kept.some(other => Math.hypot(other.x - point.x, other.y - point.y) < tolerance)) kept.push(point);
    }
    return kept;
}

// Keeps one line series for each curve on a chart, adding and removing series as the list of curves changes.
// New lines go under the last seriesOnTop series (the markers), so the markers stay on top
function createLinePool(surface, seriesOnTop, createSeries) {
    const lines = [];
    return curves => {
        while (lines.length > curves.length) {
            const line = lines.pop();
            surface.renderableSeries.remove(line);
            line.delete();
        }
        while (lines.length < curves.length) {
            const line = createSeries();
            lines.push(line);
            surface.renderableSeries.insert(surface.renderableSeries.size() - seriesOnTop, line);
        }
        curves.forEach((curve, i) => {
            lines[i].stroke = curve.colour;
            lines[i].dataSeries.dataSeriesName = curve.label;
        });
        return lines;
    };
}

// --- The tangent probe: a point that follows the mouse along the selected curve, with the tangent line there and a
// label giving x, f(x), the slope and f''(x). It is one CompositeAnnotation: the children are placed relative to the
// parent box (0 to 1 across and down it) and move with it, so the tangent's angle and the label
// placement all live in this class and the chart only has to say where the mouse is ---
class TangentProbe extends SciChart.CompositeAnnotation {
    curves = [];
    curveIndex = 0;
    x = 1;
    view = null; // { xMin, xMax, yMin, yMax, aspect }: the ranges on show and the plot's width / height
    forward;
    backward;
    marker;
    valueLabel;
    slopeLabel;

    constructor() {
        // The parent box is invisible: a small square centred on the point, which the children are placed against
        super({ x1: 0, x2: 1, y1: 0, y2: 1, fill: "#00000000", stroke: "#00000000", strokeThickness: 0 });
        // The tangent is two lines out from the centre: a child's first point has to be inside the box,
        // but its second point can be outside it
        const halfLine = () =>
            new SciChart.LineAnnotation({ x1: 0.5, y1: 0.5, x2: 1, y2: 0.5, stroke: "#FFFFFF", strokeThickness: 2 });
        const label = () =>
            new SciChart.TextAnnotation({
                x1: 0.5,
                y1: 0,
                text: "",
                fontSize: 13,
                textColor: "#FFFFFF",
                background: "#17243DDD",
                padding: SciChart.Thickness.fromNumber(3)
            });
        this.forward = halfLine();
        this.backward = halfLine();
        this.marker = new SciChart.CustomAnnotation({
            x1: 0.5,
            y1: 0.5,
            horizontalAnchorPoint: SciChart.EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: SciChart.EVerticalAnchorPoint.Center,
            svgString:
                '<svg width="18" height="18"><circle cx="9" cy="9" r="6.5" fill="#FFFFFF" stroke="#17243D" stroke-width="2"/></svg>'
        });
        this.valueLabel = label();
        this.slopeLabel = label();
        this.add(this.backward, this.forward, this.marker, this.valueLabel, this.slopeLabel);
    }

    // Put the probe at x on the selected curve, curves[curveIndex]
    place(x) {
        if (!this.curves.length || !this.view) return;
        const { xMin, xMax, yMin, yMax, aspect } = this.view;
        const width = xMax - xMin;
        const height = yMax - yMin;
        if (this.curveIndex >= this.curves.length) this.curveIndex = 0;
        const curve = this.curves[this.curveIndex];
        const y = curve.f(x);
        if (!Number.isFinite(y)) return; // the function has no value here: stay put
        const slope = curve.d1(x);
        const bend = curve.d2(x);
        this.x = x;

        // The box: square on screen, centred on the point
        const boxWidth = 0.05 * width;
        const boxHeight = 0.05 * height * aspect;
        this.x1 = x - boxWidth / 2;
        this.x2 = x + boxWidth / 2;
        this.y1 = y - boxHeight / 2;
        this.y2 = y + boxHeight / 2;

        // The tangent: the same length on screen whatever the slope. In box units, 1 across is slope * boxWidth / boxHeight up
        const rise = Number.isFinite(slope) ? (slope * boxWidth) / boxHeight : 0;
        const across = 2.6 / Math.hypot(1, rise);
        this.setChildRelativePosition(this.forward, 0.5, 0.5, 0.5 + across, 0.5 - rise * across);
        this.setChildRelativePosition(this.backward, 0.5, 0.5, 0.5 - across, 0.5 + rise * across);

        // The label: two lines of text, placed so they don't sit on the curve.
        // On a steep stretch they go beside the point; otherwise on the outside of the bend, which is below where
        // the curve bends upwards and above where it bends downwards. Either way, flip them if they would run off the chart
        const { Left, Right, Center } = SciChart.EHorizontalAnchorPoint;
        const { Top, Bottom } = SciChart.EVerticalAnchorPoint;
        const nearRight = x > xMax - 0.25 * width;
        const nearLeft = x < xMin + 0.25 * width;
        const steep = Math.abs(rise) > 1.5;
        let below = bend > 0;
        if (below && y - 0.2 * height < yMin) below = false;
        else if (!below && y + 0.2 * height > yMax) below = true;
        const lines = below ? [this.valueLabel, this.slopeLabel] : [this.slopeLabel, this.valueLabel]; // nearest the point first
        lines.forEach((line, i) => {
            if (steep) {
                // Beside the point: to the right of the box, or to its left near the chart's right edge
                line.horizontalAnchorPoint = nearRight ? Right : Left;
                line.verticalAnchorPoint = SciChart.EVerticalAnchorPoint.Center;
                line.xCoordShift = nearRight ? -8 : 8;
                line.yCoordShift = (line === this.valueLabel ? -1 : 1) * 11;
                this.setChildRelativePosition(line, nearRight ? 0 : 1, 0.5);
            } else {
                line.horizontalAnchorPoint = nearRight ? Right : nearLeft ? Left : Center;
                line.verticalAnchorPoint = below ? Top : Bottom;
                line.xCoordShift = 0;
                line.yCoordShift = (below ? 1 : -1) * (10 + 22 * i);
                this.setChildRelativePosition(line, 0.5, below ? 1 : 0);
            }
        });
        const name = curve.label.split(" ")[0];
        this.valueLabel.text =
            name +
            "(" +
            formatNumber(x, 3) +
            ") = " +
            formatNumber(y, 4) +
            (curve.label.includes("(") ? "  " + curve.label.slice(name.length + 1) : "");
        this.slopeLabel.text = "slope " + formatNumber(slope, 4) + "   " + name + "″ = " + formatNumber(bend, 4);
        this.marker.svgString =
            '<svg width="18" height="18"><circle cx="9" cy="9" r="6.5" fill="' +
            curve.colour +
            '" stroke="#FFFFFF" stroke-width="2"/></svg>';
    }
}

// A chart modifier that passes the mouse's x position, as a data value, to the probe
class ProbeFollowsMouse extends SciChart.CustomChartModifier2D {
    probe;

    constructor(probe) {
        super();
        this.probe = probe;
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        const point = SciChart.translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
        if (!point || this.probe.isHidden) return; // the mouse is over an axis, not the plot
        const x = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(point.x);
        this.probe.place(x);
    }
}

// --- The Cartesian chart. A curve is { label, colour, f, d1, d2, showDerivative }: f(x) returns y, and d1 and d2
// are its first and second derivatives ---
// onChange is called with the results each time the chart recalculates, which it does on every zoom and pan.
// onSelect is called with a curve's index when it is clicked
async function createCartesianChart(div, onChange, onSelect) {
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        XyDataSeries,
        XyyDataSeries,
        FastLineRenderableSeries,
        FastBandRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        TrianglePointMarker,
        XPointMarker,
        HorizontalLineAnnotation,
        VerticalLineAnnotation,
        MouseWheelZoomModifier,
        SeriesSelectionModifier,
        ZoomPanModifier,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(div, { theme: new SciChartJsNavyTheme() });
    const HOME_X = new NumberRange(-6, 6);
    const HOME_Y = new NumberRange(-4, 4);
    const xAxis = new NumericAxis(wasmContext, { axisTitle: "x", visibleRange: HOME_X, autoRange: EAutoRange.Never });
    const yAxis = new NumericAxis(wasmContext, { axisTitle: "y", visibleRange: HOME_Y, autoRange: EAutoRange.Never });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
    // The lines x = 0 and y = 0
    sciChartSurface.annotations.add(
        new HorizontalLineAnnotation({ y1: 0, stroke: "#FFFFFF88", strokeThickness: 1 }),
        new VerticalLineAnnotation({ x1: 0, stroke: "#FFFFFF88", strokeThickness: 1 })
    );

    // Bottom to top: the shaded integral, the curves and their derivatives, then four kinds of marker
    const POSITIVE = "#3BD16F";
    const NEGATIVE = "#EC6FA9";
    const areaData = new XyyDataSeries(wasmContext, { dataSeriesName: "Integral" });
    sciChartSurface.renderableSeries.add(
        // A band series fills between y and y1 with fillY1 where y is above y1, and with fill where it is below
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: areaData,
            fill: NEGATIVE + "55",
            fillY1: POSITIVE + "55",
            stroke: "#00000000",
            strokeY1: "#00000000"
        })
    );
    const addMarkers = (name, pointMarker, labelled) => {
        const dataSeries = new XyDataSeries(wasmContext, { dataSeriesName: name });
        const dataLabels = {
            style: { fontFamily: "Arial", fontSize: 13 },
            color: "#FFFFFF",
            metaDataSelector: metadata => metadata["label"]
        };
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries,
                pointMarker,
                dataLabels: labelled ? dataLabels : undefined
            })
        );
        return dataSeries;
    };
    const MARKER_NAMES = ["Roots", "Turning points", "Inflections", "Intersections"];
    const rootData = addMarkers(
        MARKER_NAMES[0],
        new EllipsePointMarker(wasmContext, {
            width: 9,
            height: 9,
            fill: "#17243D",
            stroke: "#FFFFFF",
            strokeThickness: 2
        }),
        false
    );
    const turningData = addMarkers(
        MARKER_NAMES[1],
        new TrianglePointMarker(wasmContext, {
            width: 11,
            height: 11,
            fill: "#F5E663",
            stroke: "#17243D",
            strokeThickness: 1
        }),
        true
    );
    const inflectionData = addMarkers(
        MARKER_NAMES[2],
        new XPointMarker(wasmContext, { width: 13, height: 13, stroke: "#EC6FA9", strokeThickness: 2 }),
        false
    );
    const pointData = addMarkers(
        MARKER_NAMES[3],
        new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            fill: "#FFFFFF",
            stroke: "#17243D",
            strokeThickness: 2
        }),
        true
    );
    const newLine = extra => () =>
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { containsNaN: true }),
            strokeThickness: 2.5,
            ...extra
        });
    const setLines = createLinePool(sciChartSurface, MARKER_NAMES.length, newLine({}));
    const setDerivativeLines = createLinePool(
        sciChartSurface,
        MARKER_NAMES.length,
        newLine({ strokeThickness: 1.5, strokeDashArray: [7, 4] })
    );

    // The integral runs between two vertical lines you can drag. Each shows its x value on the axis
    const limit = () =>
        new VerticalLineAnnotation({
            x1: 0,
            isEditable: true,
            stroke: "#F5E663",
            strokeThickness: 2,
            strokeDashArray: [5, 4],
            showLabel: true,
            axisLabelFill: "#F5E663",
            axisLabelStroke: "#17243D",
            selectionBoxStroke: "#F5E66344",
            annotationsGripsFill: "#F5E663",
            annotationsGripsStroke: "#17243D"
        });
    const lower = limit();
    const upper = limit();
    const probe = new TangentProbe();
    sciChartSurface.annotations.add(lower, upper, probe);

    sciChartSurface.chartModifiers.add(
        new ProbeFollowsMouse(probe),
        // Click a curve to select it: the tangent follows the selected curve, and it is the one integrated.
        // Only the curves can be selected and one always is, so this clears SciChart's own selected flags
        // and reports the pick; recalculate() then draws the selected curve thicker
        new SeriesSelectionModifier({
            enableSelection: true,
            onSelectionChanged: args => {
                const picked = curveLines.findIndex(line => args.selectedSeries.includes(line));
                args.allSeries.forEach(series => {
                    if (series.isSelected) series.isSelected = false;
                });
                if (picked >= 0 && picked !== options.selected) onSelect(picked);
            }
        }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier()
    );
    // Double-click to go back to the starting view. (ZoomExtentsModifier would zoom to the data, which for x^5 is huge.)
    const goHome = () => {
        xAxis.visibleRange = HOME_X;
        yAxis.visibleRange = HOME_Y;
    };
    div.addEventListener("dblclick", goHome);

    let curves = [];
    let options = { selected: 0, integral: null, showProbe: true, showSpecial: true }; // integral: { of, minus }, indexes of curves; minus -1 is the x-axis
    let curveLines = [];
    let limitsAreSet = false; // false: put the limits on the first and last crossing at the next recalculation
    let crossings = []; // where the integrand is zero, in the range on show: the limits snap to these
    let results = { points: [], roots: 0, turningPoints: 0, inflections: 0, integral: null };
    const SAMPLES = 1200;
    const zero = () => 0;

    // The two functions being integrated, f minus g, or null when the integral is off
    const integrand = () => {
        const chosen = options.integral;
        if (!chosen || chosen.of >= curves.length || chosen.minus >= curves.length) return null;
        return { f: curves[chosen.of].f, g: chosen.minus < 0 ? zero : curves[chosen.minus].f };
    };

    // Shade and work out the integral between the two limits. Called on its own while a limit is dragged
    const updateIntegral = () => {
        const pair = integrand();
        areaData.clear();
        lower.isHidden = !pair;
        upper.isHidden = !pair;
        results.integral = null;
        if (!pair) return;
        const from = lower.x1;
        const to = upper.x1;
        const height = yAxis.visibleRange.max - yAxis.visibleRange.min;
        const value = integrate(pair.f, pair.g, from, to, 4 * height);
        results.integral = { from, to, value };
        if (value) {
            const bandX = [];
            for (let i = 0; i <= 400; i++) bandX.push(from + ((to - from) * i) / 400);
            if (from > to) bandX.reverse();
            areaData.appendRange(
                bandX,
                bandX.map(x => pair.f(x)),
                bandX.map(x => pair.g(x))
            );
        }
    };
    for (const line of [lower, upper]) {
        line.dragDelta.subscribe(() => {
            updateIntegral();
            onChange(results);
        });
        // Let go near a crossing and the limit lands on it exactly
        line.dragEnded.subscribe(() => {
            const reach = 0.012 * (xAxis.visibleRange.max - xAxis.visibleRange.min);
            const nearest = crossings.reduce(
                (best, x) => (Math.abs(x - line.x1) < Math.abs(best - line.x1) ? x : best),
                Infinity
            );
            if (Math.abs(nearest - line.x1) < reach) line.x1 = nearest;
            line.isSelected = false;
            updateIntegral();
            onChange(results);
        });
    }

    const recalculate = () => {
        const { min, max } = xAxis.visibleRange;
        const height = yAxis.visibleRange.max - yAxis.visibleRange.min;
        const xs = [];
        for (let i = 0; i <= SAMPLES; i++) xs.push(min + ((max - min) * i) / SAMPLES);
        const zeros = xs.map(zero);
        const samples = curves.map(curve => xs.map(x => curve.f(x)));

        // A curve as a line. A jump from far above the view to far below it is a pole (tan x, 1/x): leave a gap there
        const toLine = ys => {
            const lineX = [];
            const lineY = [];
            for (let i = 0; i < xs.length; i++) {
                const y = Number.isFinite(ys[i]) && Math.abs(ys[i]) < 1e12 ? ys[i] : NaN;
                const previous = ys[i - 1];
                if (i > 0 && Number.isFinite(previous) && y * previous < 0 && Math.abs(y - previous) > 4 * height) {
                    lineX.push((xs[i - 1] + xs[i]) / 2);
                    lineY.push(NaN);
                }
                lineX.push(xs[i]);
                lineY.push(y);
            }
            return { lineX, lineY };
        };
        const draw = (line, ys) => {
            const { lineX, lineY } = toLine(ys);
            line.dataSeries.clear();
            line.dataSeries.appendRange(lineX, lineY);
        };
        curveLines = setLines(curves);
        curveLines.forEach((line, c) => {
            draw(line, samples[c]);
            line.strokeThickness = c === options.selected ? 4 : 2;
            line.opacity = c === options.selected ? 1 : 0.9;
        });

        // The derivative of each curve that asks for it, as a dashed line in the same colour
        const withDerivative = curves.filter(curve => curve.showDerivative);
        setDerivativeLines(
            withDerivative.map(curve => ({ colour: curve.colour, label: curve.label.replace(/^(\w+)/, "$1′") }))
        ).forEach((line, i) =>
            draw(
                line,
                xs.map(x => withDerivative[i].d1(x))
            )
        );

        // Intersections of every pair of curves, in the range of x on show
        const found = [];
        for (let a = 0; a < curves.length; a++) {
            for (let b = a + 1; b < curves.length; b++) {
                for (const x of findCrossings(curves[a].f, curves[b].f, xs, samples[a], samples[b], true))
                    found.push({ x, y: curves[a].f(x) });
            }
        }
        found.sort((p, q) => p.x - q.x);
        const points = distinctPoints(found, (max - min) * 1e-6);
        // Label the points, through their metadata, while there are few enough to read
        const fill = (dataSeries, list, labelled) => {
            const label = p =>
                labelled && list.length <= 12 ? "(" + formatNumber(p.x, 2) + ", " + formatNumber(p.y, 2) + ")" : "";
            dataSeries.clear();
            dataSeries.appendRange(
                list.map(p => p.x),
                list.map(p => p.y),
                list.map(p => ({ isSelected: false, label: label(p) }))
            );
        };
        fill(pointData, points, true);

        // Each curve's roots (f = 0), turning points (f' changes sign) and inflections (f'' changes sign)
        const roots = [];
        const turningPoints = [];
        const inflections = [];
        if (options.showSpecial) {
            curves.forEach((curve, c) => {
                const on = x => ({ x, y: curve.f(x) });
                roots.push(...findCrossings(curve.f, zero, xs, samples[c], zeros, true).map(x => ({ x, y: 0 })));
                turningPoints.push(
                    ...findCrossings(
                        curve.d1,
                        zero,
                        xs,
                        xs.map(x => curve.d1(x)),
                        zeros,
                        false
                    ).map(on)
                );
                inflections.push(
                    ...findCrossings(
                        curve.d2,
                        zero,
                        xs,
                        xs.map(x => curve.d2(x)),
                        zeros,
                        false
                    ).map(on)
                );
            });
        }
        fill(rootData, distinctPoints(roots, (max - min) * 1e-6), false);
        fill(turningData, turningPoints.slice(0, MAX_POINTS), true);
        fill(inflectionData, inflections.slice(0, MAX_POINTS), false);
        results = {
            points,
            roots: rootData.count(),
            turningPoints: turningPoints.length,
            inflections: inflections.length,
            integral: null
        };

        // The integral: find where the integrand is zero, for the limits to start on and snap to
        const pair = integrand();
        crossings = pair
            ? findCrossings(
                  pair.f,
                  pair.g,
                  xs,
                  xs.map(x => pair.f(x)),
                  xs.map(x => pair.g(x)),
                  true
              )
            : [];
        if (pair && !limitsAreSet) {
            limitsAreSet = true;
            const inHomeView = crossings.filter(x => x >= HOME_X.min && x <= HOME_X.max);
            lower.x1 = inHomeView.length >= 2 ? inHomeView[0] : -1;
            upper.x1 = inHomeView.length >= 2 ? inHomeView[inHomeView.length - 1] : 1;
        }
        updateIntegral();

        // The probe stays at its x until the mouse moves, on a box and tangent sized for the new view
        probe.isHidden = !options.showProbe || !curves.length;
        probe.curves = curves;
        probe.curveIndex = options.selected;
        probe.view = {
            xMin: min,
            xMax: max,
            yMin: yAxis.visibleRange.min,
            yMax: yAxis.visibleRange.max,
            aspect: Math.max(0.2, (div.clientWidth - 60) / Math.max(1, div.clientHeight - 50))
        };
        probe.place(probe.x);

        onChange(results);
    };

    // Recalculate for the new view after a zoom or pan, at most once a frame
    let queued = false;
    const onRangeChanged = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            if (!sciChartSurface.isDeleted) recalculate();
        });
    };
    xAxis.visibleRangeChanged.subscribe(onRangeChanged);
    yAxis.visibleRangeChanged.subscribe(onRangeChanged);

    return {
        // newOptions: { selected, integral: { of, minus } or null, showProbe, showSpecial, resetLimits, resetView }
        setCurves: (newCurves, newOptions) => {
            curves = newCurves;
            options = newOptions;
            if (newOptions.resetLimits) limitsAreSet = false;
            if (newOptions.resetView) goHome();
            recalculate();
        },
        dispose: () => {
            div.removeEventListener("dblclick", goHome);
            sciChartSurface.delete();
        }
    };
}

// --- The polar chart. A curve is { label, colour, f }, where f(θ) returns r, with θ in radians ---
async function createPolarChart(div, onChange) {
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarLineRenderableSeries,
        PolarXyScatterRenderableSeries,
        EPolarAxisMode,
        EPolarLabelMode,
        EAxisAlignment,
        EllipsePointMarker,
        NumberRange,
        XyDataSeries,
        PolarCursorModifier,
        PolarMouseWheelZoomModifier,
        PolarPanModifier,
        PolarZoomExtentsModifier,
        SciChartJsNavyTheme
    } = SciChart;

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(div, {
        theme: new SciChartJsNavyTheme()
    });
    // The angle axis runs from 0 to 2π radians, labelled in multiples of π
    const angleAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, TWO_PI),
        autoTicks: false,
        majorDelta: Math.PI / 6,
        polarLabelMode: EPolarLabelMode.Horizontal,
        drawMinorGridLines: false
    });
    angleAxis.labelProvider.formatLabel = value => (value > TWO_PI - 1e-6 ? "" : formatAngle(value));
    sciChartSurface.xAxes.add(angleAxis);
    const radiusAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        drawMinorGridLines: false,
        labelPrecision: 1
    });
    sciChartSurface.yAxes.add(radiusAxis);

    const pointData = new XyDataSeries(wasmContext, { dataSeriesName: "Intersections" });
    sciChartSurface.renderableSeries.add(
        new PolarXyScatterRenderableSeries(wasmContext, {
            dataSeries: pointData,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                fill: "#FFFFFF",
                stroke: "#17243D",
                strokeThickness: 2
            })
        })
    );
    const setLines = createLinePool(
        sciChartSurface,
        1,
        () =>
            new PolarLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { containsNaN: true, dataIsSortedInX: false }),
                strokeThickness: 2.5
            })
    );
    sciChartSurface.chartModifiers.add(
        new PolarCursorModifier({ showTooltip: true }),
        new PolarMouseWheelZoomModifier(),
        new PolarPanModifier(),
        new PolarZoomExtentsModifier()
    );

    return {
        // options.thetaMax: the curves are drawn for θ from 0 to thetaMax
        setCurves: (curves, options) => {
            const count = Math.min(5760, Math.round((720 * options.thetaMax) / TWO_PI)); // a sample every 0.5°
            const lines = setLines(curves);
            const sizes = [];
            const paths = curves.map((curve, c) => {
                const angle = [];
                const radius = [];
                const path = { x: [], y: [] };
                for (let i = 0; i <= count; i++) {
                    const theta = (options.thetaMax * i) / count;
                    const r = curve.f(theta);
                    const ok = Number.isFinite(r) && Math.abs(r) < 1e12;
                    // A negative r is drawn at distance |r| in the opposite direction, θ + π
                    angle.push(ok && r < 0 ? theta + Math.PI : theta);
                    radius.push(ok ? Math.abs(r) : NaN);
                    path.x.push(ok ? r * Math.cos(theta) : NaN);
                    path.y.push(ok ? r * Math.sin(theta) : NaN);
                    if (ok) sizes.push(Math.abs(r));
                }
                lines[c].dataSeries.clear();
                lines[c].dataSeries.appendRange(angle, radius);
                return path;
            });
            // Fit the radius axis to the curves. A curve that runs off to infinity (r = 1/cos θ) mustn't set the scale,
            // so stop at four times the size that 90% of the samples are within
            sizes.sort((p, q) => p - q);
            const largest = sizes.length
                ? Math.min(sizes[sizes.length - 1], 4 * sizes[Math.floor(sizes.length * 0.9)])
                : 1;
            radiusAxis.visibleRange = new NumberRange(0, (largest || 1) * 1.08);

            const found = [];
            for (let a = 0; a < paths.length; a++) {
                for (let b = a + 1; b < paths.length; b++) found.push(...findPolylineCrossings(paths[a], paths[b]));
            }
            const points = distinctPoints(found, (largest || 1) * 2e-3);
            pointData.clear();
            // Back to (θ, r), with θ from 0 to 2π
            pointData.appendRange(
                points.map(p => (Math.atan2(p.y, p.x) + TWO_PI) % TWO_PI),
                points.map(p => Math.hypot(p.x, p.y))
            );
            onChange({ points, roots: 0, turningPoints: 0, inflections: 0, integral: null });
        },
        dispose: () => sciChartSurface.delete()
    };
}

// 3.14159 -> "3.1416", and no "-0"
function formatNumber(value, decimals) {
    const text = value.toFixed(decimals);
    return Number(text) === 0 ? (0).toFixed(decimals) : text;
}

// An angle in radians as a multiple of π, in twelfths: 0, π/6, π/3, π/2, ...
function formatAngle(value) {
    const twelfths = Math.round((value / Math.PI) * 12);
    if (twelfths === 0) return "0";
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    const divisor = gcd(Math.abs(twelfths), 12);
    const top = twelfths / divisor;
    const bottom = 12 / divisor;
    return (top === 1 ? "" : top) + "π" + (bottom === 1 ? "" : "/" + bottom);
}
// #region_A_end

// ---------------------------------------------------------------------------------------------------------------
// The page around the chart: the list of functions and the other controls. In your app these can be ordinary HTML.

const ROW_COLOURS = ["#50C7E0", "#F48420", "#F5E663", "#3BD16F", "#EC6FA9", "#B79CFF"];
// A family of curves runs from its row's colour to this second colour, so its members can be told apart
const FAMILY_END_COLOURS = ["#EC6FA9", "#F5E663", "#3BD16F", "#50C7E0", "#B79CFF", "#F48420"];
const MAX_ROWS = 6;
const EXAMPLES = [
    { name: "Sine and parabola", mode: "cartesian", rows: [{ text: "sin(x)" }, { text: "x^2 / 4" }] },
    { name: "Cubic and its derivative", mode: "cartesian", rows: [{ text: "x^3 / 3 - x", derivative: true }] },
    { name: "Powers of x: x^n", mode: "cartesian", rows: [{ text: "x^n", from: 1, to: 5, step: 1 }] },
    {
        name: "Sine waves: sin(k x) and a line",
        mode: "cartesian",
        rows: [{ text: "sin(k x)", from: 1, to: 3, step: 1 }, { text: "x / 4" }]
    },
    { name: "Bell curve", mode: "cartesian", rows: [{ text: "3 exp(-x^2 / 2)", derivative: true }] },
    { name: "Cardioid and circle", mode: "polar", rows: [{ text: "1 + cos(θ)" }, { text: "1.5" }] },
    { name: "Rose curves: cos(n θ)", mode: "polar", rows: [{ text: "cos(n θ)", from: 2, to: 4, step: 1 }] },
    { name: "Spiral and limaçon", mode: "polar", rows: [{ text: "θ / 4" }, { text: "1 + 2 sin(θ)" }] }
];

// Mix two colours: amount 0 gives the first, 1 gives the second
function mixColours(from, to, amount) {
    const channel = i => {
        const a = parseInt(from.slice(1 + 2 * i, 3 + 2 * i), 16);
        const b = parseInt(to.slice(1 + 2 * i, 3 + 2 * i), 16);
        return Math.round(a + (b - a) * amount)
            .toString(16)
            .padStart(2, "0");
    };
    return "#" + channel(0) + channel(1) + channel(2);
}

const INPUT_STYLE =
    "font:inherit; background:#22365B; color:#ffffff; border:1px solid #50C7E0; border-radius:6px; padding:3px 7px;";
const BUTTON_STYLE = INPUT_STYLE + "cursor:pointer;";
const GROUP_STYLE = "display:inline-flex; gap:6px; align-items:center;";

function element(tag, style = "", text = "") {
    const el = document.createElement(tag);
    if (style) el.style.cssText = style;
    if (text) el.textContent = text;
    return el;
}

// A checkbox with its label after it
function checkbox(text, checked, onChange) {
    const label = element("label", GROUP_STYLE + "cursor:pointer;");
    const box = element("input", "accent-color:#50C7E0; margin:0;");
    box.type = "checkbox";
    box.checked = checked;
    box.addEventListener("change", () => onChange(box.checked));
    label.append(box, document.createTextNode(text));
    return { label, box };
}

function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#17243d; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;";
    const bar = element("div", "display:flex; flex-wrap:wrap; gap:6px 14px; align-items:center; padding:8px 12px 4px;");
    const tools = element(
        "div",
        "display:flex; flex-wrap:wrap; gap:6px 16px; align-items:center; padding:2px 12px 4px;"
    );
    const rows = element("div", "display:flex; flex-direction:column; gap:4px; padding:2px 12px;");
    const status = element(
        "div",
        "padding:4px 12px 6px; color:#c8d3e6; min-height:2.8em; line-height:1.4; white-space:pre-line;"
    );
    status.setAttribute("aria-live", "polite");
    const chartDiv = element("div", "flex:1; min-height:0;");
    chartDiv.id = divElementId + "-chart"; // SciChart tells its charts apart by their div's id
    root.append(bar, tools, rows, status, chartDiv);
    return { bar, tools, rows, status, chartDiv };
}

async function functionGrapherDemo(divElementId) {
    const ui = createLayout(divElementId);
    ui.status.textContent = "Loading…";
    const math = await import(MATHJS_URL);

    const copyRows = rows =>
        rows.map(row => ({
            text: row.text,
            from: row.from ?? 1,
            to: row.to ?? 5,
            step: row.step ?? 1,
            derivative: row.derivative ?? false
        }));
    const state = {
        mode: "cartesian",
        rows: { cartesian: copyRows(EXAMPLES[0].rows), polar: copyRows(EXAMPLES[5].rows) },
        probe: true,
        special: true,
        selected: 0, // the index of the selected curve: the tangent follows it, and it is the one integrated
        integral: { on: true, minus: 1 }, // integrate the selected curve minus this one; -1 is the x-axis
        resetLimits: true, // put the integral's limits back on the crossings at the next update
        resetView: false, // go back to the starting view at the next update
        turns: 2 // polar curves are drawn for θ from 0 to turns × π
    };
    let chart = null;
    let curves = [];
    let rowViews = [];
    let busy = false;

    // --- The bar: mode, examples, the θ range (polar) ---
    const modeButtons = {
        cartesian: element("button", BUTTON_STYLE, "Cartesian  y = f(x)"),
        polar: element("button", BUTTON_STYLE, "Polar  r = f(θ)")
    };
    const modeGroup = element("span", "display:inline-flex; gap:4px;");
    modeGroup.setAttribute("role", "group");
    modeGroup.setAttribute("aria-label", "Coordinates");
    modeGroup.append(modeButtons.cartesian, modeButtons.polar);

    const examples = element("select", INPUT_STYLE);
    examples.setAttribute("aria-label", "Examples");
    examples.append(new Option("Examples…", ""));
    EXAMPLES.forEach((example, i) => examples.append(new Option(example.name, String(i))));

    const turnsGroup = element("label", GROUP_STYLE, "θ from 0 to");
    const turns = element("input", INPUT_STYLE + "width:52px;");
    turns.type = "number";
    turns.min = "1";
    turns.max = "16";
    turns.step = "1";
    turns.value = String(state.turns);
    turnsGroup.append(turns, document.createTextNode("π"));

    const addButton = element("button", BUTTON_STYLE, "+ Add function");
    ui.bar.append(modeGroup, examples, turnsGroup, addButton);

    // --- The analysis tools (Cartesian): the probe, the special points and the integral ---
    const probeBox = checkbox("Tangent at the cursor", state.probe, on => {
        state.probe = on;
        recompute();
    });
    const specialBox = checkbox("Roots ○  turning points ▲  inflections ✕", state.special, on => {
        state.special = on;
        recompute();
    });
    const integralBox = checkbox("Integral  ∫", state.integral.on, on => {
        state.integral.on = on;
        recompute();
    });
    const integralOf = element("span", "font-weight:600;");
    const integralMinus = element("select", INPUT_STYLE);
    integralMinus.setAttribute("aria-label", "Integrate: minus function");
    const integralGroup = element("span", GROUP_STYLE);
    integralGroup.append(
        integralBox.label,
        document.createTextNode("("),
        integralOf,
        document.createTextNode("−"),
        integralMinus,
        document.createTextNode(") dx")
    );
    const selectHint = element("span", "color:#c8d3e6; font-size:13px;", "Click a curve to select it");
    ui.tools.append(probeBox.label, specialBox.label, integralGroup, selectHint);

    // Select a curve. If it was the one being subtracted in the integral, swap the two, so f1 − f2 becomes f2 − f1
    const select = index => {
        if (state.integral.minus === index) state.integral.minus = state.selected;
        state.selected = index;
        state.resetLimits = true;
        recompute();
    };

    // --- Turn the rows into curves, and show each row's parameter controls, derivative or error ---
    const recompute = () => {
        const polar = state.mode === "polar";
        const rows = state.rows[state.mode];
        curves = [];
        rows.forEach((row, r) => {
            const view = rowViews[r];
            const name = (polar ? "r" : "f") + (r + 1);
            let error = "";
            let note = "";
            let parameter = null;
            try {
                const parsed = parseFunction(math, row.text, polar ? ["theta", "t"] : ["x"]);
                parameter = parsed.parameter;
                let values = [0];
                if (parameter) {
                    const step = Math.abs(row.step);
                    if (!(step > 0) || !Number.isFinite(row.from) || !Number.isFinite(row.to))
                        throw new Error("Give " + parameter + " a range and a step above 0");
                    values = [];
                    for (let k = 0; row.from + k * step <= row.to + 1e-9 && values.length < MAX_FAMILY; k++)
                        values.push(Number((row.from + k * step).toFixed(10)));
                    if (!values.length) throw new Error("The range for " + parameter + " is empty");
                    if (row.from + values.length * step <= row.to + 1e-9)
                        note = "Showing the first " + MAX_FAMILY + " values of " + parameter + ". ";
                }
                values.forEach((value, k) => {
                    curves.push({
                        label: parameter ? name + " (" + parameter + " = " + value + ")" : name,
                        colour: mixColours(
                            ROW_COLOURS[r],
                            FAMILY_END_COLOURS[r],
                            values.length > 1 ? k / (values.length - 1) : 0
                        ),
                        f: x => parsed.evaluate(x, value),
                        d1: x => parsed.derivative(x, value),
                        d2: x => parsed.second(x, value),
                        showDerivative: row.derivative && !polar,
                        row: r
                    });
                });
                if (row.derivative && !polar)
                    note += name + "′(x) = " + (parsed.derivativeText || "worked out numerically");
            } catch (e) {
                error = e.message;
            }
            view.parameterGroup.style.display = parameter ? "inline-flex" : "none";
            view.parameterName.textContent = parameter ? parameter + " from" : "";
            view.message.textContent = error || note;
            view.message.style.color = error ? "#FFB199" : "#c8d3e6";
            view.input.style.borderColor = error ? "#EF5350" : "#50C7E0";
        });

        // The selected curve, and the one it is integrated against: keep each choice where it still exists
        const chosen = state.integral;
        if (state.selected >= curves.length) state.selected = 0;
        if (chosen.minus >= curves.length || chosen.minus === state.selected) chosen.minus = -1;
        integralOf.textContent = curves.length ? curves[state.selected].label : "";
        integralMinus.replaceChildren(
            new Option("0 (the x-axis)", "-1"),
            ...curves.map((curve, i) => new Option(curve.label, String(i))).filter((option, i) => i !== state.selected)
        );
        integralMinus.value = String(chosen.minus);
        rowViews.forEach((view, r) => {
            const isSelected = curves.length > 0 && curves[state.selected].row === r;
            view.line.style.background = isSelected ? "#22365B" : "transparent";
            view.line.style.boxShadow = isSelected ? "inset 3px 0 0 " + ROW_COLOURS[r] : "none";
        });
        ui.tools.style.display = polar ? "none" : "flex";
        turnsGroup.style.display = polar ? "inline-flex" : "none";
        addButton.style.display = rows.length < MAX_ROWS ? "" : "none";

        chart.setCurves(curves, {
            selected: state.selected,
            integral: chosen.on && curves.length ? { of: state.selected, minus: chosen.minus } : null,
            showProbe: state.probe,
            showSpecial: state.special,
            resetLimits: state.resetLimits,
            resetView: state.resetView,
            thetaMax: state.turns * Math.PI
        });
        state.resetLimits = false;
        state.resetView = false;
    };

    // --- The status lines, written each time the chart recalculates ---
    const showResult = result => {
        const polar = state.mode === "polar";
        const n = result.points.length;
        const list = result.points
            .slice(0, 6)
            .map(p =>
                polar
                    ? "(r " +
                      formatNumber(Math.hypot(p.x, p.y), 3) +
                      ", θ " +
                      formatNumber((Math.atan2(p.y, p.x) + TWO_PI) % TWO_PI, 3) +
                      ")"
                    : "(" + formatNumber(p.x, 4) + ", " + formatNumber(p.y, 4) + ")"
            )
            .join(", ");
        let text = n === 0 ? "No intersections" : n + (n === 1 ? " intersection" : " intersections");
        text += (polar ? "" : " in view") + (n ? ": " + list + (n > 6 ? ", …" : "") : "");
        if (!polar && state.special)
            text +=
                " · " +
                result.roots +
                " roots, " +
                result.turningPoints +
                " turning points, " +
                result.inflections +
                " inflections";
        if (result.integral) {
            const { from, to, value } = result.integral;
            const of = curves[state.selected].label;
            const minus = state.integral.minus < 0 ? "" : curves[state.integral.minus].label;
            text +=
                "\n∫ " +
                (minus ? "(" + of + " − " + minus + ")" : of) +
                " dx from " +
                formatNumber(from, 4) +
                " to " +
                formatNumber(to, 4);
            text += value
                ? " = " +
                  formatNumber(value.signed, 4) +
                  " · area " +
                  (minus ? "between them " : "") +
                  formatNumber(value.area, 4) +
                  " · drag the dashed lines to change the limits"
                : ": not finite, there is a pole between the limits";
        }
        ui.status.textContent = text;
    };

    // --- The rows: one function each ---
    const renderRows = () => {
        const polar = state.mode === "polar";
        const rows = state.rows[state.mode];
        ui.rows.replaceChildren();
        rowViews = rows.map((row, r) => {
            const line = element(
                "div",
                "display:flex; flex-wrap:wrap; gap:6px; align-items:center; padding:3px 6px; border-radius:6px;"
            );
            const swatch = element(
                "span",
                "width:12px; height:12px; border-radius:3px; background:" + ROW_COLOURS[r] + ";"
            );
            const id = divElementId + "-f" + r;
            const label = element(
                "label",
                "font-weight:600; min-width:74px;",
                polar ? "r" + (r + 1) + "(θ) =" : "f" + (r + 1) + "(x) ="
            );
            label.htmlFor = id;
            const input = element(
                "input",
                INPUT_STYLE + "flex:1 1 180px; min-width:120px; font-family:ui-monospace, Menlo, Consolas, monospace;"
            );
            input.id = id;
            input.type = "text";
            input.spellcheck = false;
            input.autocomplete = "off";
            input.value = row.text;
            // Working on a function selects it (its first curve, for a family)
            input.addEventListener("focus", () => {
                const first = curves.findIndex(curve => curve.row === r);
                if (first >= 0 && curves[state.selected].row !== r) select(first);
            });
            input.addEventListener("input", () => {
                row.text = input.value;
                recompute();
            });
            const parameterGroup = element("span", "display:none; gap:6px; align-items:center;");
            const parameterName = element("span", "");
            const numberInput = (key, labelText) => {
                const box = element("input", INPUT_STYLE + "width:58px;");
                box.type = "number";
                box.step = "any";
                box.value = String(row[key]);
                box.setAttribute("aria-label", labelText);
                box.addEventListener("input", () => {
                    row[key] = Number(box.value);
                    recompute();
                });
                return box;
            };
            parameterGroup.append(
                parameterName,
                numberInput("from", "Parameter from"),
                document.createTextNode("to"),
                numberInput("to", "Parameter to"),
                document.createTextNode("step"),
                numberInput("step", "Parameter step")
            );
            const derivative = checkbox("Derivative f" + (r + 1) + "′", row.derivative, on => {
                row.derivative = on;
                recompute();
            });
            derivative.box.setAttribute("aria-label", "Draw the derivative of function " + (r + 1));
            derivative.label.style.display = polar ? "none" : "inline-flex";
            const remove = element("button", BUTTON_STYLE + "border-color:#5B6F94; padding:3px 9px;", "×");
            remove.setAttribute("aria-label", "Remove function " + (r + 1));
            remove.style.visibility = rows.length > 1 ? "visible" : "hidden";
            remove.addEventListener("click", () => {
                rows.splice(r, 1);
                state.resetLimits = true;
                renderRows();
                recompute();
            });
            // Under the input: the derivative checkbox, then the derivative's formula or an error message
            const message = element("span", "");
            const second = element(
                "div",
                "flex-basis:100%; display:flex; flex-wrap:wrap; gap:4px 12px; align-items:center; padding-left:98px; font-size:13px;"
            );
            second.append(derivative.label, message);
            line.append(swatch, label, input, parameterGroup, remove, second);
            ui.rows.append(line);
            return { line, input, parameterGroup, parameterName, message };
        });
    };

    // --- Switching between the Cartesian and the polar chart: delete one, create the other in the same div ---
    const setMode = async mode => {
        if (busy) return;
        busy = true;
        state.mode = mode;
        state.resetLimits = true;
        for (const key of ["cartesian", "polar"]) {
            modeButtons[key].style.background = key === mode ? "#50C7E0" : "#22365B";
            modeButtons[key].style.color = key === mode ? "#17243D" : "#ffffff";
            modeButtons[key].setAttribute("aria-pressed", String(key === mode));
        }
        if (chart) chart.dispose();
        chart =
            mode === "polar"
                ? await createPolarChart(ui.chartDiv, showResult)
                : await createCartesianChart(ui.chartDiv, showResult, select);
        renderRows();
        recompute();
        busy = false;
    };

    modeButtons.cartesian.addEventListener("click", () => state.mode !== "cartesian" && setMode("cartesian"));
    modeButtons.polar.addEventListener("click", () => state.mode !== "polar" && setMode("polar"));
    examples.addEventListener("change", async () => {
        if (examples.value === "" || busy) return;
        const example = EXAMPLES[Number(examples.value)];
        examples.value = "";
        state.rows[example.mode] = copyRows(example.rows);
        state.selected = 0;
        state.integral = { on: true, minus: example.rows.length > 1 ? 1 : -1 };
        integralBox.box.checked = true;
        state.resetLimits = true;
        state.resetView = true;
        if (example.mode !== state.mode) {
            await setMode(example.mode);
        } else {
            renderRows();
            recompute();
        }
    });
    integralMinus.addEventListener("change", () => {
        state.integral.minus = Number(integralMinus.value);
        state.resetLimits = true;
        recompute();
    });
    turns.addEventListener("input", () => {
        const value = Number(turns.value);
        if (value >= 1 && value <= 16) {
            state.turns = value;
            recompute();
        }
    });
    addButton.addEventListener("click", () => {
        state.rows[state.mode].push({
            text: state.mode === "polar" ? "1" : "x",
            from: 1,
            to: 5,
            step: 1,
            derivative: false
        });
        renderRows();
        recompute();
        rowViews[rowViews.length - 1].input.select();
    });

    await setMode("cartesian");
}

functionGrapherDemo("scichart-root");
