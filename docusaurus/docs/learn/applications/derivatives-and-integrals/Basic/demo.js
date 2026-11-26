import * as SciChart from "scichart";

// #region_A_start
// Derivatives and integrals of a function: type in f(x) and SciChart.js draws it with its derivatives, its
// antiderivative and the area under it between two limits you can drag, and marks its roots, turning points and
// inflections. The expression is parsed and differentiated by math.js; the rest is plain JavaScript.
const MATHJS_URL = "https://cdn.jsdelivr.net/npm/mathjs@15.3.0/+esm";
// or, for npm: import { parse, derivative } from "mathjs"

const DERIVATIVE_COLOURS = ["#F48420", "#F5E663", "#3BD16F", "#B79CFF"]; // f′, f″, f‴ and f⁗

// --- Parsing: text such as "x^2 / 4" or "1 + cos(n theta)" becomes functions (value, parameter) => number ---
// variables are the names the function's variable can be typed as, e.g. ["x"] or ["theta", "t"].
// Any other unknown name is the parameter, so "x^n" is a family of curves, one for each value of n.
// Returns the function and its derivatives, first to maxOrder, each as { evaluate, text }
function parseFunction(math, text, variables, maxOrder = 2) {
    const expression = text
        .replace(/^\s*(y|r|f\s*\(\s*\w+\s*\))\s*=/, "") // allow "y = ...", "r = ..." and "f(x) = ..."
        .replace(/θ/g, "theta")
        .replace(/π/g, "pi")
        .replace(/\bln\s*\(/g, "log(") // math.js calls the natural logarithm log
        .replace(/\bt\b/g, variables.includes("t") ? variables[0] : "t"); // "t" as a short name for theta
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
            scope[variables[0]] = value;
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
    scope[variables[0]] = 1;
    node.compile().evaluate(scope); // throws now for a name math.js doesn't know, such as "sine(x)"
    const evaluate = toFunction(node);

    // math.js differentiates most expressions symbolically, which is exact and gives a formula to show
    const derivatives = [];
    try {
        let current = node;
        for (let order = 1; order <= maxOrder; order++) {
            current = math.derivative(current, variables[0]);
            derivatives.push({ evaluate: toFunction(current), text: current.toString() });
        }
    } catch (error) {
        // For the few it can't (floor(x), say), the first two derivatives fall back to finite differences
    }
    while (derivatives.length < 2) {
        const below = derivatives.length ? derivatives[derivatives.length - 1].evaluate : evaluate;
        const size = derivatives.length ? 1e-3 : 1e-4;
        derivatives.push({
            evaluate: (x, p) => {
                const h = size * (1 + Math.abs(x));
                return (below(x + h, p) - below(x - h, p)) / (2 * h);
            },
            text: ""
        });
    }
    return { evaluate, derivatives, parameter };
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

// --- The chart. curve is { label, colour, f, derivatives }: f(x) returns y, and derivatives[n - 1](x) is the nth
// derivative. onChange is called with the results each time the chart recalculates: on every zoom and pan, and as
// a limit of the integral is dragged ---
async function createCalculusChart(div, onChange) {
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

    // Bottom to top: the shaded integral, the antiderivative, the derivatives, the function, then the markers
    const line = extra =>
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { containsNaN: true }),
            strokeThickness: 2,
            ...extra
        });
    const areaData = new XyyDataSeries(wasmContext);
    const antiderivativeData = new XyDataSeries(wasmContext, { containsNaN: true });
    const antiderivativeLine = line({ dataSeries: antiderivativeData, stroke: "#FFFFFF", strokeDashArray: [2, 4] });
    const derivativeLines = DERIVATIVE_COLOURS.map(stroke => line({ stroke, strokeDashArray: [7, 4] }));
    const functionLine = line({ strokeThickness: 4 });
    const markers = (pointMarker, labelled) => {
        const dataSeries = new XyDataSeries(wasmContext);
        const dataLabels = {
            style: { fontFamily: "Arial", fontSize: 13 },
            color: "#FFFFFF",
            metaDataSelector: metadata => metadata["label"]
        };
        const series = new XyScatterRenderableSeries(wasmContext, {
            dataSeries,
            pointMarker,
            dataLabels: labelled ? dataLabels : undefined
        });
        return { dataSeries, series };
    };
    const rootMarkers = markers(
        new EllipsePointMarker(wasmContext, {
            width: 9,
            height: 9,
            fill: "#17243D",
            stroke: "#FFFFFF",
            strokeThickness: 2
        }),
        false
    );
    const turningMarkers = markers(
        new TrianglePointMarker(wasmContext, {
            width: 11,
            height: 11,
            fill: "#F5E663",
            stroke: "#17243D",
            strokeThickness: 1
        }),
        true
    );
    const inflectionMarkers = markers(
        new XPointMarker(wasmContext, { width: 13, height: 13, stroke: "#EC6FA9", strokeThickness: 2 }),
        false
    );
    sciChartSurface.renderableSeries.add(
        // A band series fills between y and y1 with fillY1 where y is above y1, and with fill where it is below:
        // here y is the function and y1 is 0, so area above the axis is green and area below it is pink
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: areaData,
            fill: "#EC6FA955",
            fillY1: "#3BD16F55",
            stroke: "#00000000",
            strokeY1: "#00000000"
        }),
        antiderivativeLine,
        ...derivativeLines,
        functionLine,
        rootMarkers.series,
        turningMarkers.series,
        inflectionMarkers.series
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
        new MouseWheelZoomModifier(),
        new ZoomPanModifier()
    );
    // Double-click to go back to the starting view. (ZoomExtentsModifier would zoom to the data, which for x^5 is huge.)
    const goHome = () => {
        xAxis.visibleRange = HOME_X;
        yAxis.visibleRange = HOME_Y;
    };
    div.addEventListener("dblclick", goHome);

    let curve = null;
    let options = {
        derivatives: [],
        showAntiderivative: false,
        showIntegral: true,
        showProbe: true,
        showCritical: true
    };
    let limitsAreSet = false; // false: put the limits on the function's first and last root at the next recalculation
    let roots = []; // the function's roots in the range on show: the limits snap to these
    let samples = { xs: [], ys: [] };
    let results = { roots: [], maxima: [], minima: [], inflections: [], integral: null };
    const zero = () => 0;
    const SAMPLES = 1200;
    const viewHeight = () => yAxis.visibleRange.max - yAxis.visibleRange.min;

    // A sampled curve as a line. A jump from far above the view to far below it is a pole (tan x, 1/x): leave a gap there
    const draw = (series, xs, ys) => {
        const lineX = [];
        const lineY = [];
        for (let i = 0; i < xs.length; i++) {
            const y = Number.isFinite(ys[i]) && Math.abs(ys[i]) < 1e12 ? ys[i] : NaN;
            const previous = ys[i - 1];
            if (i > 0 && Number.isFinite(previous) && y * previous < 0 && Math.abs(y - previous) > 4 * viewHeight()) {
                lineX.push((xs[i - 1] + xs[i]) / 2);
                lineY.push(NaN);
            }
            lineX.push(xs[i]);
            lineY.push(y);
        }
        series.dataSeries.clear();
        series.dataSeries.appendRange(lineX, lineY);
    };

    // The integral from the lower limit a to the upper limit b: its value, its shading, and the antiderivative
    // F(x) = the integral of f from a to x, which is zero at a and has f as its slope.
    // Called on its own while a limit is dragged
    const updateIntegral = () => {
        const shown = !!curve && options.showIntegral;
        lower.isHidden = !shown;
        upper.isHidden = !shown;
        areaData.clear();
        antiderivativeData.clear();
        results.integral = null;
        if (!shown) return;
        const from = lower.x1;
        const to = upper.x1;
        const value = integrate(curve.f, zero, from, to, 4 * viewHeight());
        results.integral = { from, to, value };
        if (value) {
            const bandX = [];
            for (let i = 0; i <= 400; i++) bandX.push(Math.min(from, to) + (Math.abs(to - from) * i) / 400);
            areaData.appendRange(
                bandX,
                bandX.map(x => curve.f(x)),
                bandX.map(zero)
            );
        }
        if (!options.showAntiderivative) return;
        // Add up the area sample by sample (trapezium rule), outwards from the sample nearest a, stopping at a pole
        const { xs, ys } = samples;
        const start = xs.findIndex(x => x >= from);
        if (start < 0 || !Number.isFinite(ys[start])) return; // a is off the chart to the right, or f has no value there
        const atStart = integrate(curve.f, zero, from, xs[start], 4 * viewHeight());
        if (!atStart) return;
        const total = xs.map(() => NaN);
        total[start] = atStart.signed;
        const isBreak = (i, j) =>
            !Number.isFinite(ys[j]) || (ys[i] * ys[j] < 0 && Math.abs(ys[i] - ys[j]) > 4 * viewHeight());
        for (let i = start + 1; i < xs.length && !isBreak(i - 1, i); i++)
            total[i] = total[i - 1] + ((ys[i - 1] + ys[i]) / 2) * (xs[i] - xs[i - 1]);
        for (let i = start - 1; i >= 0 && !isBreak(i + 1, i); i--)
            total[i] = total[i + 1] - ((ys[i + 1] + ys[i]) / 2) * (xs[i + 1] - xs[i]);
        antiderivativeData.appendRange(xs, total);
    };
    for (const limitLine of [lower, upper]) {
        limitLine.dragDelta.subscribe(() => {
            updateIntegral();
            onChange(results);
        });
        // Let go near a root and the limit lands on it exactly
        limitLine.dragEnded.subscribe(() => {
            const reach = 0.012 * (xAxis.visibleRange.max - xAxis.visibleRange.min);
            const nearest = roots.reduce(
                (best, x) => (Math.abs(x - limitLine.x1) < Math.abs(best - limitLine.x1) ? x : best),
                Infinity
            );
            if (Math.abs(nearest - limitLine.x1) < reach) limitLine.x1 = nearest;
            limitLine.isSelected = false;
            updateIntegral();
            onChange(results);
        });
    }

    const recalculate = () => {
        const { min, max } = xAxis.visibleRange;
        const xs = [];
        for (let i = 0; i <= SAMPLES; i++) xs.push(min + ((max - min) * i) / SAMPLES);
        const zeros = xs.map(zero);
        const ys = curve ? xs.map(x => curve.f(x)) : [];
        samples = { xs, ys };
        results = { roots: [], maxima: [], minima: [], inflections: [], integral: null };
        functionLine.isVisible = !!curve;
        derivativeLines.forEach(
            (series, n) =>
                (series.isVisible = !!curve && options.derivatives.includes(n + 1) && n < curve.derivatives.length)
        );
        probe.isHidden = !curve || !options.showProbe;
        if (!curve) {
            for (const set of [rootMarkers, turningMarkers, inflectionMarkers]) set.dataSeries.clear();
            updateIntegral();
            return onChange(results);
        }
        functionLine.stroke = curve.colour;
        draw(functionLine, xs, ys);
        derivativeLines.forEach((series, n) => {
            if (series.isVisible)
                draw(
                    series,
                    xs,
                    xs.map(x => curve.derivatives[n](x))
                );
        });

        // Critical values, in the range of x on show: roots (f = 0), turning points (f' changes sign: a maximum where
        // it goes from + to −, a minimum from − to +) and inflections (f'' changes sign)
        const d1 = curve.derivatives[0];
        const d2 = curve.derivatives[1];
        const on = x => ({ x, y: curve.f(x) });
        roots = findCrossings(curve.f, zero, xs, ys, zeros, true);
        const step = xs[1] - xs[0];
        const turning = findCrossings(
            d1,
            zero,
            xs,
            xs.map(x => d1(x)),
            zeros,
            false
        );
        results.roots = roots.map(x => ({ x, y: 0 }));
        results.maxima = turning.filter(x => d1(x - step / 2) > 0).map(on);
        results.minima = turning.filter(x => d1(x - step / 2) <= 0).map(on);
        results.inflections = findCrossings(
            d2,
            zero,
            xs,
            xs.map(x => d2(x)),
            zeros,
            false
        ).map(on);
        const fill = (set, list, labelled) => {
            const shown = options.showCritical ? list : [];
            const label = p =>
                labelled && shown.length <= 12 ? "(" + formatNumber(p.x, 2) + ", " + formatNumber(p.y, 2) + ")" : "";
            set.dataSeries.clear();
            set.dataSeries.appendRange(
                shown.map(p => p.x),
                shown.map(p => p.y),
                shown.map(p => ({ isSelected: false, label: label(p) }))
            );
        };
        fill(rootMarkers, results.roots, false);
        fill(turningMarkers, [...results.maxima, ...results.minima], true);
        fill(inflectionMarkers, results.inflections, false);

        // The limits start on the first and last root in the starting view, or at −1 and 1
        if (!limitsAreSet) {
            limitsAreSet = true;
            const inHomeView = roots.filter(x => x >= HOME_X.min && x <= HOME_X.max);
            lower.x1 = inHomeView.length >= 2 ? inHomeView[0] : -1;
            upper.x1 = inHomeView.length >= 2 ? inHomeView[inHomeView.length - 1] : 1;
        }
        updateIntegral();

        // The probe stays at its x until the mouse moves, on a box and tangent sized for the new view
        probe.curves = [{ label: curve.label, colour: curve.colour, f: curve.f, d1, d2 }];
        probe.curveIndex = 0;
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
        // newCurve: the function, or null while its text can't be read.
        // newOptions: { derivatives: the orders to draw, showAntiderivative, showIntegral, showProbe, showCritical, reset }
        setCurve: (newCurve, newOptions) => {
            curve = newCurve;
            options = newOptions;
            if (newOptions.reset) {
                limitsAreSet = false;
                goHome();
            }
            recalculate();
        }
    };
}

// 3.14159 -> "3.1416", and no "-0"
function formatNumber(value, decimals) {
    const text = value.toFixed(decimals);
    return Number(text) === 0 ? (0).toFixed(decimals) : text;
}
// #region_A_end

// The page around the chart: the function, the library and the options. In your app these can be ordinary HTML.

const INPUT_STYLE =
    "font:inherit; background:#22365B; color:#ffffff; border:1px solid #50C7E0; border-radius:6px; padding:3px 7px;";
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
    const caption = document.createTextNode(text);
    label.append(box, caption);
    return { label, box, caption };
}

const FUNCTION_COLOUR = "#50C7E0";
const LIBRARY = [
    { name: "Cubic", text: "x^3 / 3 - x" },
    { name: "Quartic", text: "x^4 / 8 - x^2 + 1" },
    { name: "Sine", text: "sin(x)" },
    { name: "Damped wave", text: "3 exp(-x^2 / 8) cos(2x)" },
    { name: "Bell curve", text: "3 exp(-x^2 / 2)" },
    { name: "x e^(−x)", text: "x exp(-x)" },
    { name: "Logistic curve", text: "4 / (1 + exp(-x)) - 2" },
    { name: "Rational: x / (1 + x²)", text: "4x / (1 + x^2)" },
    { name: "sin(x) / x", text: "3 sin(x) / x" },
    { name: "Natural logarithm", text: "ln(x)" },
    { name: "Tangent", text: "tan(x)" }
];
const ORDER_NAMES = ["f′", "f″", "f‴", "f⁗"];

function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#17243d; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;";
    const bar = element("div", "display:flex; flex-wrap:wrap; gap:6px 10px; align-items:center; padding:8px 12px 4px;");
    const tools = element("div", "display:flex; flex-wrap:wrap; gap:4px 16px; align-items:center; padding:2px 12px;");
    const formulas = element(
        "div",
        "padding:2px 12px; font:13px ui-monospace, Menlo, Consolas, monospace; line-height:1.5;"
    );
    const status = element(
        "div",
        "padding:4px 12px 6px; color:#c8d3e6; min-height:5.6em; line-height:1.4; white-space:pre-line; font-size:13px;"
    );
    status.setAttribute("aria-live", "polite");
    const chartDiv = element("div", "flex:1; min-height:0;");
    chartDiv.id = divElementId + "-chart"; // SciChart tells its charts apart by their div's id
    root.append(bar, tools, formulas, status, chartDiv);
    return { bar, tools, formulas, status, chartDiv };
}

async function calculusDemo(divElementId) {
    const ui = createLayout(divElementId);
    ui.status.textContent = "Loading…";
    const math = await import(MATHJS_URL);

    const state = {
        text: LIBRARY[0].text,
        derivatives: [1],
        antiderivative: true,
        integral: true,
        probe: true,
        critical: true,
        reset: true
    };
    let curve = null;

    // --- The bar: the function and the library ---
    const label = element("label", "font-weight:600;", "f(x) =");
    label.htmlFor = divElementId + "-f";
    const input = element(
        "input",
        INPUT_STYLE + "flex:1 1 220px; min-width:140px; font-family:ui-monospace, Menlo, Consolas, monospace;"
    );
    input.id = label.htmlFor;
    input.type = "text";
    input.spellcheck = false;
    input.autocomplete = "off";
    input.value = state.text;
    const library = element("select", INPUT_STYLE);
    library.setAttribute("aria-label", "Library of functions");
    library.append(new Option("Library of functions…", ""));
    LIBRARY.forEach((entry, i) => library.append(new Option(entry.name, String(i))));
    const error = element("span", "flex-basis:100%; color:#FFB199; font-size:13px;");
    ui.bar.append(label, input, library, error);

    // --- The tools: which derivatives to draw, and the other options ---
    const derivativeGroup = element("span", GROUP_STYLE, "Derivatives");
    ORDER_NAMES.forEach((name, n) => {
        const box = checkbox(name, state.derivatives.includes(n + 1), on => {
            state.derivatives = on ? [...state.derivatives, n + 1] : state.derivatives.filter(order => order !== n + 1);
            recompute();
        });
        box.label.style.color = DERIVATIVE_COLOURS[n];
        box.box.style.accentColor = DERIVATIVE_COLOURS[n];
        derivativeGroup.append(box.label);
    });
    const option = (text, key) =>
        checkbox(text, state[key], on => {
            state[key] = on;
            recompute();
        }).label;
    ui.tools.append(
        derivativeGroup,
        option("Integral ∫", "integral"),
        option("Antiderivative F(x) ┈", "antiderivative"),
        option("Critical points  ○ ▲ ✕", "critical"),
        option("Tangent at the cursor", "probe")
    );

    // --- The results: the integral, then the critical values ---
    const showResult = result => {
        const point = p => "(" + formatNumber(p.x, 4) + ", " + formatNumber(p.y, 4) + ")";
        const list = (name, points, format) =>
            name +
            ": " +
            (points.length
                ? points.slice(0, 8).map(format).join(", ") + (points.length > 8 ? ", …" : "")
                : "none in view");
        const lines = [];
        if (result.integral) {
            const { from, to, value } = result.integral;
            lines.push(
                "∫ f(x) dx from " +
                    formatNumber(from, 4) +
                    " to " +
                    formatNumber(to, 4) +
                    (value
                        ? " = " +
                          formatNumber(value.signed, 4) +
                          " · area " +
                          formatNumber(value.area, 4) +
                          " · drag the dashed lines to change the limits"
                        : ": not finite, there is a pole between the limits")
            );
        }
        if (curve) {
            lines.push(list("Roots ○", result.roots, p => "x = " + formatNumber(p.x, 4)));
            lines.push(list("Maxima ▲", result.maxima, point) + " · " + list("Minima ▲", result.minima, point));
            lines.push(list("Inflections ✕", result.inflections, point));
        }
        ui.status.textContent = lines.join("\n");
    };
    const chart = await createCalculusChart(ui.chartDiv, showResult);

    const recompute = () => {
        let message = "";
        ui.formulas.replaceChildren();
        try {
            const parsed = parseFunction(math, state.text, ["x"], ORDER_NAMES.length);
            if (parsed.parameter) throw new Error("Use x only: " + parsed.parameter + " isn't a number or a function");
            curve = {
                label: "f",
                colour: FUNCTION_COLOUR,
                f: x => parsed.evaluate(x, 0),
                derivatives: parsed.derivatives.map(d => x => d.evaluate(x, 0))
            };
            // The formula of each derivative that is drawn
            [...state.derivatives].sort().forEach(order => {
                const derivative = parsed.derivatives[order - 1];
                const full = !derivative
                    ? "math.js can't differentiate this function that far"
                    : derivative.text || "worked out numerically";
                const text = full.length > 110 ? full.slice(0, 108) + " …" : full; // higher derivatives can run to several lines
                const row = element(
                    "div",
                    "color:" + DERIVATIVE_COLOURS[order - 1] + ";",
                    ORDER_NAMES[order - 1] + "(x) = " + text
                );
                ui.formulas.append(row);
            });
        } catch (e) {
            curve = null;
            message = e.message;
        }
        error.textContent = message;
        input.style.borderColor = message ? "#EF5350" : "#50C7E0";
        chart.setCurve(curve, {
            derivatives: state.derivatives,
            showAntiderivative: state.antiderivative && state.integral,
            showIntegral: state.integral,
            showProbe: state.probe,
            showCritical: state.critical,
            reset: state.reset
        });
        state.reset = false;
    };

    input.addEventListener("input", () => {
        state.text = input.value;
        recompute();
    });
    library.addEventListener("change", () => {
        if (library.value === "") return;
        state.text = LIBRARY[Number(library.value)].text;
        input.value = state.text;
        library.value = "";
        state.reset = true;
        recompute();
    });
    recompute();
}

calculusDemo("scichart-root");
