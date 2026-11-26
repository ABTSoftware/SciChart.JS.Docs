import * as SciChart from "scichart";

// #region_A_start
// Comparing functions: type in functions of x, add a line through two points you can drag, and SciChart.js draws
// them and marks where they cross. For the selected curve and one other it works out the area between them and the
// length of each between two limits, and the total area they enclose. Parsing is by math.js; the rest is plain JavaScript.
const MATHJS_URL = "https://cdn.jsdelivr.net/npm/mathjs@15.3.0/+esm";
// or, for npm: import { parse, derivative } from "mathjs"

const MAX_FAMILY = 12; // most curves one function with a parameter can draw
const MAX_POINTS = 200; // most intersection points marked

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

// The length of the curve y = f(x) from one x to another: the integral of sqrt(1 + f'(x)²), by Simpson's rule.
// slope is f'. Returns NaN where the slope has no value, as at a pole
function arcLength(slope, from, to) {
    const steps = 1000;
    const h = (to - from) / steps;
    let sum = 0;
    for (let k = 0; k <= steps; k++)
        sum += (k === 0 || k === steps ? 1 : k % 2 === 1 ? 4 : 2) * Math.hypot(1, slope(from + k * h));
    return Math.abs((sum * h) / 3);
}

// --- The chart. A curve is { label, colour, f, d1 }: f(x) returns y and d1(x) its slope ---
// onChange is called with the results each time the chart recalculates: on every zoom and pan, and as a limit or
// the line is dragged. onSelect is called with a curve's index when it is clicked
async function createComparisonChart(div, onChange, onSelect) {
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
        HorizontalLineAnnotation,
        VerticalLineAnnotation,
        LineAnnotation,
        SeriesSelectionModifier,
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

    // Bottom to top: the shaded area between the two curves, the curves, the intersection markers, the line's two points
    const areaData = new XyyDataSeries(wasmContext);
    const pointData = new XyDataSeries(wasmContext);
    const handleData = new XyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(
        // A band series fills between y and y1 with fillY1 where y is above y1, and with fill where it is below
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: areaData,
            fill: "#EC6FA955",
            fillY1: "#3BD16F55",
            stroke: "#00000000",
            strokeY1: "#00000000"
        }),
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: pointData,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                fill: "#FFFFFF",
                stroke: "#17243D",
                strokeThickness: 2
            }),
            dataLabels: {
                style: { fontFamily: "Arial", fontSize: 13 },
                color: "#FFFFFF",
                metaDataSelector: metadata => metadata["label"]
            }
        }),
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: handleData,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 16,
                height: 16,
                fill: "#17243D",
                stroke: "#FFFFFF",
                strokeThickness: 3
            })
        })
    );
    const setLines = createLinePool(
        sciChartSurface,
        2,
        () =>
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { containsNaN: true }),
                strokeThickness: 2
            })
    );

    // The range runs between two vertical lines you can drag. Each shows its x value on the axis
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
    // The line through two points: an editable LineAnnotation, so each end can be dragged, and so can the whole segment.
    // The chart draws the full line through the two points as one more curve
    const ruler = new LineAnnotation({
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 1,
        isEditable: true,
        stroke: "#FFFFFF",
        strokeThickness: 4,
        selectionBoxStroke: "#00000000"
    });
    sciChartSurface.annotations.add(lower, upper, ruler);

    let curves = [];
    let options = { selected: 0, target: -1, line: null }; // target: the curve to compare with, or -1 for the x-axis
    let curveLines = [];
    let limitsAreSet = false; // false: put the limits on the first and last crossing at the next recalculation
    let crossings = []; // where the selected curve and the target cross, in the range on show
    let results = { points: [], range: null, enclosed: null };
    const zero = () => 0;
    const SAMPLES = 1200;
    const viewHeight = () => yAxis.visibleRange.max - yAxis.visibleRange.min;

    sciChartSurface.chartModifiers.add(
        // Click a function's curve to select it. Only those can be selected and one always is, so this clears SciChart's
        // own selected flags and reports the pick; recalculate() then draws the selected curve thicker
        new SeriesSelectionModifier({
            enableSelection: true,
            onSelectionChanged: args => {
                const picked = curveLines.findIndex(series => args.selectedSeries.includes(series));
                args.allSeries.forEach(series => {
                    if (series.isSelected) series.isSelected = false;
                });
                // Dragging the line clicks on it too, so the line itself is left out
                if (picked >= 0 && picked !== options.selected && !curves[picked].isLine) onSelect(picked);
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

    // The two curves being compared: the selected one and the target
    const pair = () => {
        const first = curves[options.selected];
        const second = options.target < 0 ? { f: zero, d1: zero } : curves[options.target];
        return first && second ? { first, second } : null;
    };

    // Between the two limits: the area between the curves, the integral of their difference and each curve's length.
    // Called on its own while a limit is dragged
    const updateRange = () => {
        const both = pair();
        areaData.clear();
        lower.isHidden = !both;
        upper.isHidden = !both;
        results.range = null;
        if (!both) return;
        const from = Math.min(lower.x1, upper.x1);
        const to = Math.max(lower.x1, upper.x1);
        const value = integrate(both.first.f, both.second.f, from, to, 4 * viewHeight());
        results.range = {
            from,
            to,
            value,
            lengthOfFirst: arcLength(both.first.d1, from, to),
            lengthOfSecond: arcLength(both.second.d1, from, to)
        };
        if (value) {
            const bandX = [];
            for (let i = 0; i <= 400; i++) bandX.push(from + ((to - from) * i) / 400);
            areaData.appendRange(
                bandX,
                bandX.map(x => both.first.f(x)),
                bandX.map(x => both.second.f(x))
            );
        }
    };
    for (const limitLine of [lower, upper]) {
        limitLine.dragDelta.subscribe(() => {
            updateRange();
            onChange(results);
        });
        // Let go near a crossing and the limit lands on it exactly
        limitLine.dragEnded.subscribe(() => {
            const reach = 0.012 * (xAxis.visibleRange.max - xAxis.visibleRange.min);
            const nearest = crossings.reduce(
                (best, x) => (Math.abs(x - limitLine.x1) < Math.abs(best - limitLine.x1) ? x : best),
                Infinity
            );
            if (Math.abs(nearest - limitLine.x1) < reach) limitLine.x1 = nearest;
            limitLine.isSelected = false;
            updateRange();
            onChange(results);
        });
    }

    const recalculate = () => {
        const { min, max } = xAxis.visibleRange;
        const xs = [];
        for (let i = 0; i <= SAMPLES; i++) xs.push(min + ((max - min) * i) / SAMPLES);
        const samples = curves.map(curve => xs.map(x => curve.f(x)));

        // Draw each curve. A jump from far above the view to far below it is a pole (tan x, 1/x): leave a gap there
        curveLines = setLines(curves);
        curveLines.forEach((series, c) => {
            const ys = samples[c];
            const lineX = [];
            const lineY = [];
            for (let i = 0; i < xs.length; i++) {
                const y = Number.isFinite(ys[i]) && Math.abs(ys[i]) < 1e12 ? ys[i] : NaN;
                const previous = ys[i - 1];
                if (
                    i > 0 &&
                    Number.isFinite(previous) &&
                    y * previous < 0 &&
                    Math.abs(y - previous) > 4 * viewHeight()
                ) {
                    lineX.push((xs[i - 1] + xs[i]) / 2);
                    lineY.push(NaN);
                }
                lineX.push(xs[i]);
                lineY.push(y);
            }
            series.dataSeries.clear();
            series.dataSeries.appendRange(lineX, lineY);
            series.strokeThickness = c === options.selected ? 4 : 2;
        });

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
        const label = p => (points.length <= 12 ? "(" + formatNumber(p.x, 2) + ", " + formatNumber(p.y, 2) + ")" : "");
        pointData.clear();
        pointData.appendRange(
            points.map(p => p.x),
            points.map(p => p.y),
            points.map(p => ({ isSelected: false, label: label(p) }))
        );
        results = { points, range: null, enclosed: null };

        // The selected curve against the target: where they cross, and the total area they enclose between their first
        // and last crossing on show. integrate() adds up each region between crossings as a positive area
        const both = pair();
        crossings = both
            ? findCrossings(
                  both.first.f,
                  both.second.f,
                  xs,
                  xs.map(x => both.first.f(x)),
                  xs.map(x => both.second.f(x)),
                  true
              )
            : [];
        if (crossings.length >= 2) {
            const from = crossings[0];
            const to = crossings[crossings.length - 1];
            const value = integrate(both.first.f, both.second.f, from, to, 4 * viewHeight());
            results.enclosed = { from, to, area: value ? value.area : NaN, regions: crossings.length - 1 };
        }
        if (both && !limitsAreSet) {
            limitsAreSet = true;
            lower.x1 = crossings.length >= 2 ? crossings[0] : -1;
            upper.x1 = crossings.length >= 2 ? crossings[crossings.length - 1] : 1;
        }
        updateRange();
        onChange(results);
    };

    // Recalculate after a zoom or pan, or as the line is dragged, at most once a frame
    let queued = false;
    const recalculateSoon = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            if (!sciChartSurface.isDeleted) recalculate();
        });
    };
    xAxis.visibleRangeChanged.subscribe(recalculateSoon);
    yAxis.visibleRangeChanged.subscribe(recalculateSoon);

    // Dragging the line: copy its two points to options.line, which the line's curve reads, and recalculate
    const showHandles = () => {
        handleData.clear();
        if (options.line)
            handleData.appendRange([options.line.x1, options.line.x2], [options.line.y1, options.line.y2]);
    };
    ruler.dragDelta.subscribe(() => {
        if (!options.line) return;
        Object.assign(options.line, { x1: ruler.x1, y1: ruler.y1, x2: ruler.x2, y2: ruler.y2 });
        showHandles();
        recalculateSoon();
    });

    return {
        // newOptions: { selected, target, line: { x1, y1, x2, y2 } or null, resetLimits, resetView }
        setCurves: (newCurves, newOptions) => {
            curves = newCurves;
            options = newOptions;
            ruler.isHidden = !options.line;
            if (options.line) Object.assign(ruler, options.line);
            showHandles();
            if (newOptions.resetLimits) limitsAreSet = false;
            if (newOptions.resetView) goHome();
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

// The page around the chart: the list of functions and the other controls. In your app these can be ordinary HTML.

const ROW_COLOURS = ["#50C7E0", "#F48420", "#F5E663", "#3BD16F", "#EC6FA9", "#B79CFF"];
// A family of curves runs from its row's colour to this second colour, so its members can be told apart
const FAMILY_END_COLOURS = ["#EC6FA9", "#F5E663", "#3BD16F", "#50C7E0", "#B79CFF", "#F48420"];
const MAX_ROWS = 6;

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
    const caption = document.createTextNode(text);
    label.append(box, caption);
    return { label, box, caption };
}

// Turn the rows into curves: one for a plain function, one for each parameter value for a family such as x^n.
// Returns the curves and, for each row, { error, note, parameter } to show beside it
function buildCurves(math, rows, variables, prefix) {
    const curves = [];
    const messages = rows.map((row, r) => {
        const name = prefix + (r + 1);
        try {
            const parsed = parseFunction(math, row.text, variables);
            let values = [0];
            let note = "";
            if (parsed.parameter) {
                const step = Math.abs(row.step);
                if (!(step > 0) || !Number.isFinite(row.from) || !Number.isFinite(row.to))
                    throw new Error("Give " + parsed.parameter + " a range and a step above 0");
                values = [];
                for (let k = 0; row.from + k * step <= row.to + 1e-9 && values.length < MAX_FAMILY; k++)
                    values.push(Number((row.from + k * step).toFixed(10)));
                if (!values.length) throw new Error("The range for " + parsed.parameter + " is empty");
                if (row.from + values.length * step <= row.to + 1e-9)
                    note = "Showing the first " + MAX_FAMILY + " values of " + parsed.parameter;
            }
            values.forEach((value, k) => {
                curves.push({
                    label: parsed.parameter ? name + " (" + parsed.parameter + " = " + value + ")" : name,
                    colour: mixColours(
                        ROW_COLOURS[r],
                        FAMILY_END_COLOURS[r],
                        values.length > 1 ? k / (values.length - 1) : 0
                    ),
                    f: x => parsed.evaluate(x, value),
                    d1: x => parsed.derivatives[0].evaluate(x, value),
                    d2: x => parsed.derivatives[1].evaluate(x, value),
                    row: r
                });
            });
            return { error: "", note, parameter: parsed.parameter };
        } catch (e) {
            return { error: e.message, note: "", parameter: null };
        }
    });
    return { curves, messages };
}

// Draw the list of function rows: a colour swatch, a name, the text box, the range for a parameter, a remove button
// and a line for messages. handlers: { onEdit(), onRemove(r), onFocus(r) }. Returns one view for each row
function renderRows(container, idPrefix, rows, nameFor, handlers) {
    container.replaceChildren();
    return rows.map((row, r) => {
        const line = element(
            "div",
            "display:flex; flex-wrap:wrap; gap:6px; align-items:center; padding:3px 6px; border-radius:6px;"
        );
        const swatch = element(
            "span",
            "width:12px; height:12px; border-radius:3px; background:" + ROW_COLOURS[r] + ";"
        );
        const label = element("label", "font-weight:600; min-width:74px;", nameFor(r));
        label.htmlFor = idPrefix + "-f" + r;
        const input = element(
            "input",
            INPUT_STYLE + "flex:1 1 180px; min-width:120px; font-family:ui-monospace, Menlo, Consolas, monospace;"
        );
        input.id = label.htmlFor;
        input.type = "text";
        input.spellcheck = false;
        input.autocomplete = "off";
        input.value = row.text;
        input.addEventListener("focus", () => handlers.onFocus(r));
        input.addEventListener("input", () => {
            row.text = input.value;
            handlers.onEdit();
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
                handlers.onEdit();
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
        const remove = element("button", BUTTON_STYLE + "border-color:#5B6F94; padding:3px 9px;", "×");
        remove.setAttribute("aria-label", "Remove function " + (r + 1));
        remove.style.visibility = rows.length > 1 ? "visible" : "hidden";
        remove.addEventListener("click", () => handlers.onRemove(r));
        const message = element("span", "flex-basis:100%; padding-left:98px; font-size:13px;");
        line.append(swatch, label, input, parameterGroup, remove, message);
        container.append(line);
        return { line, input, parameterGroup, parameterName, message };
    });
}

// Show each row's message and parameter range, and highlight the row of the selected curve
function updateRows(rowViews, messages, selectedRow) {
    rowViews.forEach((view, r) => {
        const { error, note, parameter } = messages[r];
        view.parameterGroup.style.display = parameter ? "inline-flex" : "none";
        view.parameterName.textContent = parameter ? parameter + " from" : "";
        view.message.textContent = error || note;
        view.message.style.color = error ? "#FFB199" : "#c8d3e6";
        view.input.style.borderColor = error ? "#EF5350" : "#50C7E0";
        view.line.style.background = r === selectedRow ? "#22365B" : "transparent";
        view.line.style.boxShadow = r === selectedRow ? "inset 3px 0 0 " + ROW_COLOURS[r] : "none";
    });
}

// Comparisons to start from. line: the two points of the line, or null for no line. With a line, the first function
// is compared with the line; without one, with the curve whose index is target
const LIBRARY = [
    {
        name: "Parabola and a line",
        rows: [{ text: "x^2 / 2 - 2" }],
        line: { x1: -3, y1: -1, x2: 3, y2: 2 },
        target: -1
    },
    { name: "Sine and parabola", rows: [{ text: "sin(x)" }, { text: "x^2 / 4" }], line: null, target: 1 },
    {
        name: "Cubic and a line",
        rows: [{ text: "x^3 / 3 - x" }],
        line: { x1: -3, y1: -1.5, x2: 3, y2: 1.5 },
        target: -1
    },
    { name: "Sine and a line", rows: [{ text: "2 sin(x)" }], line: { x1: -4, y1: -1, x2: 4, y2: 1 }, target: -1 },
    { name: "Two parabolas", rows: [{ text: "x^2 - 2" }, { text: "2 - x^2 / 2" }], line: null, target: 1 },
    { name: "Sine and cosine", rows: [{ text: "sin(x)" }, { text: "cos(x)" }], line: null, target: 1 },
    {
        name: "Exponential and a line",
        rows: [{ text: "exp(x) - 2" }],
        line: { x1: -3, y1: -1, x2: 2, y2: 2 },
        target: -1
    },
    { name: "Powers of x: x^n", rows: [{ text: "x^n", from: 1, to: 5, step: 1 }], line: null, target: 1 }
];
const LINE_COLOUR = "#FFFFFF";

function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#17243d; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;";
    const bar = element("div", "display:flex; flex-wrap:wrap; gap:6px 14px; align-items:center; padding:8px 12px 4px;");
    const tools = element(
        "div",
        "display:flex; flex-wrap:wrap; gap:6px 16px; align-items:center; padding:2px 12px 4px;"
    );
    const rows = element("div", "display:flex; flex-direction:column; gap:2px; padding:2px 12px;");
    const status = element(
        "div",
        "padding:4px 12px 6px; color:#c8d3e6; min-height:4.2em; line-height:1.4; white-space:pre-line; font-size:13px;"
    );
    status.setAttribute("aria-live", "polite");
    const chartDiv = element("div", "flex:1; min-height:0;");
    chartDiv.id = divElementId + "-chart"; // SciChart tells its charts apart by their div's id
    root.append(bar, tools, rows, status, chartDiv);
    return { bar, tools, rows, status, chartDiv };
}

async function comparisonDemo(divElementId) {
    const ui = createLayout(divElementId);
    ui.status.textContent = "Loading…";
    const math = await import(MATHJS_URL);

    const copyRows = rows =>
        rows.map(row => ({ text: row.text, from: row.from ?? 1, to: row.to ?? 5, step: row.step ?? 1 }));
    const state = {
        rows: copyRows(LIBRARY[0].rows),
        line: { ...LIBRARY[0].line }, // the line's two points; the chart updates them as the line is dragged
        showLine: true,
        selected: 0, // the index of the selected curve
        target: 1, // the index of the curve it is compared with, or -1 for the x-axis
        resetLimits: true,
        resetView: false
    };
    let curves = [];
    let rowViews = [];

    // The line through the two points, as one more curve
    const lineCurve = {
        label: "line",
        colour: LINE_COLOUR,
        row: -1,
        isLine: true,
        d1: () => (state.line.y2 - state.line.y1) / (state.line.x2 - state.line.x1),
        f: x =>
            state.line.y1 + ((x - state.line.x1) * (state.line.y2 - state.line.y1)) / (state.line.x2 - state.line.x1)
    };

    // --- The bar and the tools ---
    const library = element("select", INPUT_STYLE);
    library.setAttribute("aria-label", "Examples");
    library.append(new Option("Examples…", ""));
    LIBRARY.forEach((entry, i) => library.append(new Option(entry.name, String(i))));
    const addButton = element("button", BUTTON_STYLE, "+ Add function");
    const lineBox = checkbox("Line through two points", state.showLine, on => {
        state.showLine = on;
        state.resetLimits = true;
        recompute();
    });
    const lineEquation = element("span", "font:13px ui-monospace, Menlo, Consolas, monospace; color:#c8d3e6;");
    ui.bar.append(library, addButton, lineBox.label, lineEquation);

    const selectedName = element("span", "font-weight:600;");
    const targetSelect = element("select", INPUT_STYLE);
    targetSelect.setAttribute("aria-label", "Compare with");
    const compareGroup = element("span", GROUP_STYLE, "Compare");
    compareGroup.append(selectedName, document.createTextNode("with"), targetSelect);
    const snapButton = element("button", BUTTON_STYLE, "Limits to the crossings");
    const hint = element(
        "span",
        "color:#c8d3e6; font-size:13px;",
        "Click a curve to select it · drag the line or its two points to move it"
    );
    ui.tools.append(compareGroup, snapButton, hint);

    // --- The results ---
    const showResult = result => {
        const n = result.points.length;
        const list = result.points
            .slice(0, 6)
            .map(p => "(" + formatNumber(p.x, 4) + ", " + formatNumber(p.y, 4) + ")")
            .join(", ");
        const lines = [
            n === 0
                ? "No intersections in view"
                : n + (n === 1 ? " intersection" : " intersections") + " in view: " + list + (n > 6 ? ", …" : "")
        ];
        if (state.showLine) {
            const slope = lineCurve.d1();
            const intercept = lineCurve.f(0);
            lineEquation.textContent = Number.isFinite(slope)
                ? "y = " +
                  formatNumber(slope, 3) +
                  "x " +
                  (intercept < 0 ? "− " : "+ ") +
                  formatNumber(Math.abs(intercept), 3)
                : "vertical";
        } else {
            lineEquation.textContent = "";
        }
        if (result.range && curves[state.selected]) {
            const first = curves[state.selected].label;
            const second = state.target < 0 ? "the x-axis" : curves[state.target].label;
            const { from, to, value, lengthOfFirst, lengthOfSecond } = result.range;
            const finite = number => (Number.isFinite(number) ? formatNumber(number, 4) : "not finite");
            lines.push(
                "From x = " +
                    formatNumber(from, 4) +
                    " to " +
                    formatNumber(to, 4) +
                    ": area between " +
                    first +
                    " and " +
                    second +
                    " " +
                    (value ? formatNumber(value.area, 4) : "not finite") +
                    " · ∫ (" +
                    first +
                    " − " +
                    (state.target < 0 ? "0" : second) +
                    ") dx " +
                    (value ? formatNumber(value.signed, 4) : "not finite") +
                    " · length of " +
                    first +
                    " " +
                    finite(lengthOfFirst) +
                    (state.target < 0 ? "" : ", of " + second + " " + finite(lengthOfSecond))
            );
            lines.push(
                result.enclosed
                    ? "Enclosed by " +
                          first +
                          " and " +
                          second +
                          ", from their first crossing in view to their last (x = " +
                          formatNumber(result.enclosed.from, 4) +
                          " to " +
                          formatNumber(result.enclosed.to, 4) +
                          "): total area " +
                          (Number.isFinite(result.enclosed.area)
                              ? formatNumber(result.enclosed.area, 4)
                              : "not finite") +
                          " in " +
                          result.enclosed.regions +
                          (result.enclosed.regions === 1 ? " region" : " regions")
                    : first + " and " + second + " cross fewer than twice in view, so they enclose no area"
            );
        }
        ui.status.textContent = lines.join("\n");
    };

    // Select a curve. If it was the one being compared with, swap the two
    const select = index => {
        if (state.target === index) state.target = state.selected;
        state.selected = index;
        state.resetLimits = true;
        recompute();
    };
    const chart = await createComparisonChart(ui.chartDiv, showResult, select);

    const recompute = () => {
        const built = buildCurves(math, state.rows, ["x"], "f");
        curves = state.showLine ? [...built.curves, lineCurve] : built.curves;
        if (state.selected >= curves.length) state.selected = 0;
        if (state.target >= curves.length || state.target === state.selected) state.target = -1;
        updateRows(rowViews, built.messages, curves.length ? curves[state.selected].row : -1);
        selectedName.textContent = curves.length ? curves[state.selected].label : "";
        targetSelect.replaceChildren(
            new Option("the x-axis", "-1"),
            ...curves.map((curve, i) => new Option(curve.label, String(i))).filter((option, i) => i !== state.selected)
        );
        targetSelect.value = String(state.target);
        addButton.style.display = state.rows.length < MAX_ROWS ? "" : "none";
        chart.setCurves(curves, {
            selected: state.selected,
            target: state.target,
            line: state.showLine ? state.line : null,
            resetLimits: state.resetLimits,
            resetView: state.resetView
        });
        state.resetLimits = false;
        state.resetView = false;
    };

    const drawRows = () => {
        rowViews = renderRows(ui.rows, divElementId, state.rows, r => "f" + (r + 1) + "(x) =", {
            onEdit: recompute,
            onRemove: r => {
                state.rows.splice(r, 1);
                state.resetLimits = true;
                drawRows();
                recompute();
            },
            // Working on a function selects it (its first curve, for a family)
            onFocus: r => {
                const first = curves.findIndex(curve => curve.row === r);
                if (first >= 0 && curves[state.selected].row !== r) select(first);
            }
        });
    };

    library.addEventListener("change", () => {
        if (library.value === "") return;
        const entry = LIBRARY[Number(library.value)];
        library.value = "";
        state.rows = copyRows(entry.rows);
        state.showLine = !!entry.line;
        lineBox.box.checked = state.showLine;
        if (entry.line) Object.assign(state.line, entry.line);
        state.selected = 0;
        // The line is the last curve; count the curves the rows make to find its index
        state.target = entry.line ? buildCurves(math, state.rows, ["x"], "f").curves.length : entry.target;
        state.resetLimits = true;
        state.resetView = true;
        drawRows();
        recompute();
    });
    targetSelect.addEventListener("change", () => {
        state.target = Number(targetSelect.value);
        state.resetLimits = true;
        recompute();
    });
    snapButton.addEventListener("click", () => {
        state.resetLimits = true;
        recompute();
    });
    addButton.addEventListener("click", () => {
        state.rows.push({ text: "x", from: 1, to: 5, step: 1 });
        drawRows();
        recompute();
        rowViews[rowViews.length - 1].input.select();
    });

    drawRows();
    recompute();
}

comparisonDemo("scichart-root");
