import * as SciChart from "scichart";

// #region_A_start
// Polar curves, r = f(θ): type in functions of θ, draw them on a polar chart with SciChart.js, and explore them.
// The tangent, the area swept out and the arc length follow the mouse; intersections and the furthest and nearest
// points are marked. The expressions are parsed and differentiated by math.js; the analysis is plain JavaScript.
const MATHJS_URL = "https://cdn.jsdelivr.net/npm/mathjs@15.3.0/+esm";
// or, for npm: import { parse, derivative } from "mathjs"

const MAX_FAMILY = 12; // most curves one function with a parameter can draw
const MAX_POINTS = 200; // most intersection points marked
const TWO_PI = 2 * Math.PI;

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

// A chart modifier that reports where the mouse is, in pixels right of and above the centre of the plot
class MouseFromCentre extends SciChart.CustomChartModifier2D {
    onMove;

    // A modifier has to say it is for a polar chart before a polar chart will take it
    get modifierType() {
        return SciChart.EModifierType.Chart2DPolarModifier;
    }

    constructor(onMove) {
        super();
        this.onMove = onMove;
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        const rect = this.parentSurface.seriesViewRect;
        const point = SciChart.translateFromCanvasToSeriesViewRect(args.mousePoint, rect);
        if (point)
            this.onMove(point.x - rect.width / 2, rect.height / 2 - point.y, Math.min(rect.width, rect.height) / 2);
    }
}

// --- The polar chart. A curve is { label, colour, f, d1 }: f(θ) returns r, with θ in radians, and d1 is dr/dθ ---
// onChange is called with the results when the curves change and as the mouse moves.
// onSelect is called with a curve's index when it is clicked
async function createPolarChart(div, onChange, onSelect) {
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarLineRenderableSeries,
        PolarMountainRenderableSeries,
        PolarXyScatterRenderableSeries,
        EPolarAxisMode,
        EPolarLabelMode,
        EAxisAlignment,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        EllipsePointMarker,
        TrianglePointMarker,
        LineAnnotation,
        TextAnnotation,
        Thickness,
        NumberRange,
        XyDataSeries,
        PolarSeriesSelectionModifier,
        PolarMouseWheelZoomModifier,
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

    // Bottom to top: the area swept out so far, the curves, then three kinds of marker
    const xy = () => new XyDataSeries(wasmContext, { containsNaN: true, dataIsSortedInX: false });
    const sweepData = xy();
    const sweepSeries = new PolarMountainRenderableSeries(wasmContext, {
        dataSeries: sweepData,
        fill: "#FFFFFF33",
        stroke: "#00000000",
        strokeThickness: 0
    });
    const extremeData = xy();
    const pointData = xy();
    const probeData = xy();
    const probeMarker = new EllipsePointMarker(wasmContext, {
        width: 15,
        height: 15,
        fill: "#FFFFFF",
        stroke: "#FFFFFF",
        strokeThickness: 2
    });
    sciChartSurface.renderableSeries.add(
        sweepSeries,
        new PolarXyScatterRenderableSeries(wasmContext, {
            dataSeries: extremeData,
            pointMarker: new TrianglePointMarker(wasmContext, {
                width: 11,
                height: 11,
                fill: "#F5E663",
                stroke: "#17243D",
                strokeThickness: 1
            })
        }),
        new PolarXyScatterRenderableSeries(wasmContext, {
            dataSeries: pointData,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                fill: "#FFFFFF",
                stroke: "#17243D",
                strokeThickness: 2
            })
        }),
        new PolarXyScatterRenderableSeries(wasmContext, { dataSeries: probeData, pointMarker: probeMarker })
    );
    const setLines = createLinePool(
        sciChartSurface,
        3,
        () => new PolarLineRenderableSeries(wasmContext, { dataSeries: xy(), strokeThickness: 2.5 })
    );

    // The probe: the radius out to the point, the tangent there and two lines of text. Annotations on a polar chart
    // are placed by angle and radius, like the data
    const radiusLine = new LineAnnotation({
        stroke: "#FFFFFFAA",
        strokeThickness: 1.5,
        strokeDashArray: [5, 4],
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    });
    const tangentLine = new LineAnnotation({ stroke: "#FFFFFF", strokeThickness: 2, x1: 0, y1: 0, x2: 0, y2: 0 });
    const label = () =>
        new TextAnnotation({
            x1: 0,
            y1: 0,
            text: "",
            fontSize: 13,
            textColor: "#FFFFFF",
            background: "#17243DDD",
            padding: Thickness.fromNumber(3)
        });
    const valueLabel = label();
    const slopeLabel = label();
    const probeParts = [radiusLine, tangentLine, valueLabel, slopeLabel];
    sciChartSurface.annotations.add(...probeParts);

    let curves = [];
    let options = { selected: 0, showProbe: true, showSpecial: true, thetaMax: TWO_PI };
    let curveLines = [];
    let paths = []; // for each curve: its samples as { theta, r, x, y, angle, radius }, the last two as drawn
    let swept = { area: [], length: [] }; // for the selected curve: the area and the arc length from θ = 0 to each sample
    let probeIndex = -1; // the sample the probe is on
    let results = { points: [], extremes: 0, sweep: null };

    // A point (x, y) as the angle and radius to plot it at
    const toPolar = (x, y) => ({ angle: (Math.atan2(y, x) + TWO_PI) % TWO_PI, radius: Math.hypot(x, y) });

    // Put the probe on sample i of the selected curve
    const placeProbe = i => {
        const path = paths[options.selected];
        const shown = options.showProbe && path && Number.isFinite(path.r[i]);
        probeParts.forEach(part => (part.isHidden = !shown));
        probeData.clear();
        sweepData.clear();
        results.sweep = null;
        if (!shown) return onChange(results);
        probeIndex = i;
        const curve = curves[options.selected];
        const theta = path.theta[i];
        const r = path.r[i];
        const x = path.x[i];
        const y = path.y[i];
        probeMarker.fill = curve.colour;
        probeData.append(path.angle[i], path.radius[i]);
        radiusLine.x1 = path.angle[i];
        radiusLine.x2 = path.angle[i];
        radiusLine.y2 = path.radius[i];

        // The tangent's direction is (dx/dθ, dy/dθ), from x = r cos θ and y = r sin θ
        const slopeOfR = curve.d1(theta);
        const dx = slopeOfR * Math.cos(theta) - r * Math.sin(theta);
        const dy = slopeOfR * Math.sin(theta) + r * Math.cos(theta);
        const reach = (0.22 * radiusAxis.visibleRange.max) / (Math.hypot(dx, dy) || 1);
        const from = toPolar(x - reach * dx, y - reach * dy);
        const to = toPolar(x + reach * dx, y + reach * dy);
        tangentLine.x1 = from.angle;
        tangentLine.y1 = from.radius;
        tangentLine.x2 = to.angle;
        tangentLine.y2 = to.radius;
        tangentLine.isHidden = !Number.isFinite(dx + dy);

        // The labels go on the outside of the point: right of it on the right half of the chart, above it on the top half
        const lines = [valueLabel, slopeLabel];
        lines.forEach((line, k) => {
            line.x1 = path.angle[i];
            line.y1 = path.radius[i];
            line.horizontalAnchorPoint = x >= 0 ? EHorizontalAnchorPoint.Left : EHorizontalAnchorPoint.Right;
            line.verticalAnchorPoint = y >= 0 ? EVerticalAnchorPoint.Bottom : EVerticalAnchorPoint.Top;
            line.xCoordShift = x >= 0 ? 14 : -14;
            line.yCoordShift = y >= 0 ? -8 - 22 * (1 - k) : 8 + 22 * k;
        });
        const name = curve.label.split(" ")[0];
        valueLabel.text = name + "(" + formatNumber(theta / Math.PI, 3) + "π) = " + formatNumber(r, 4);
        slopeLabel.text =
            "dr/dθ " +
            formatNumber(slopeOfR, 4) +
            "   slope dy/dx " +
            (Math.abs(dx) < 1e-9 * Math.abs(dy) ? "vertical" : formatNumber(dy / dx, 4));

        // Shade what the radius has swept out from θ = 0 to here
        sweepSeries.fill = curve.colour + "44";
        sweepData.appendRange(path.angle.slice(0, i + 1), path.radius.slice(0, i + 1));
        const last = path.theta.length - 1;
        results.sweep = {
            theta,
            area: swept.area[i],
            length: swept.length[i],
            thetaMax: path.theta[last],
            totalArea: swept.area[last],
            totalLength: swept.length[last]
        };
        onChange(results);
    };

    // The mouse, from the centre of the plot: move the probe to the nearest sample of the selected curve.
    // The plot's circle is a little smaller than the plot area, which leaves room for the angle labels
    const onMouseMove = (right, up, halfSize) => {
        const path = paths[options.selected];
        if (!path || !options.showProbe) return;
        const perPixel = radiusAxis.visibleRange.max / (0.87 * halfSize);
        const mouseX = right * perPixel;
        const mouseY = up * perPixel;
        let nearest = Infinity;
        let index = -1;
        for (let i = 0; i < path.x.length; i++) {
            const distance = (path.x[i] - mouseX) ** 2 + (path.y[i] - mouseY) ** 2;
            if (distance < nearest) {
                nearest = distance;
                index = i;
            }
        }
        if (index >= 0 && index !== probeIndex) placeProbe(index);
    };

    sciChartSurface.chartModifiers.add(
        new MouseFromCentre(onMouseMove),
        // Click a curve to select it, as on the Cartesian chart
        new PolarSeriesSelectionModifier({
            enableSelection: true,
            onSelectionChanged: args => {
                const picked = curveLines.findIndex(line => args.selectedSeries.includes(line));
                args.allSeries.forEach(series => {
                    if (series.isSelected) series.isSelected = false;
                });
                if (picked >= 0 && picked !== options.selected) onSelect(picked);
            }
        }),
        new PolarMouseWheelZoomModifier(),
        new PolarZoomExtentsModifier()
    );

    return {
        // newOptions: { selected, showProbe, showSpecial, thetaMax }: the curves are drawn for θ from 0 to thetaMax
        setCurves: (newCurves, newOptions) => {
            curves = newCurves;
            options = newOptions;
            const count = Math.min(5760, Math.round((720 * options.thetaMax) / TWO_PI)); // a sample every 0.5°
            const step = options.thetaMax / count;
            curveLines = setLines(curves);
            const sizes = [];
            paths = curves.map((curve, c) => {
                const path = { theta: [], r: [], x: [], y: [], angle: [], radius: [] };
                for (let i = 0; i <= count; i++) {
                    const theta = step * i;
                    const value = curve.f(theta);
                    const r = Number.isFinite(value) && Math.abs(value) < 1e12 ? value : NaN;
                    path.theta.push(theta);
                    path.r.push(r);
                    path.x.push(r * Math.cos(theta));
                    path.y.push(r * Math.sin(theta));
                    // A negative r is drawn at distance |r| in the opposite direction, θ + π
                    path.angle.push(r < 0 ? theta + Math.PI : theta);
                    path.radius.push(Math.abs(r));
                    if (!Number.isNaN(r)) sizes.push(Math.abs(r));
                }
                curveLines[c].dataSeries.clear();
                curveLines[c].dataSeries.appendRange(path.angle, path.radius);
                curveLines[c].strokeThickness = c === options.selected ? 4 : 2;
                curveLines[c].opacity = c === options.selected ? 1 : 0.9;
                return path;
            });
            // Fit the radius axis to the curves. A curve that runs off to infinity (r = 1/cos θ) mustn't set the scale,
            // so stop at four times the size that 90% of the samples are within
            sizes.sort((p, q) => p - q);
            const largest = sizes.length
                ? Math.min(sizes[sizes.length - 1], 4 * sizes[Math.floor(sizes.length * 0.9)])
                : 1;
            radiusAxis.visibleRange = new NumberRange(0, (largest || 1) * 1.08);

            // Intersections of every pair of curves
            const found = [];
            for (let a = 0; a < paths.length; a++) {
                for (let b = a + 1; b < paths.length; b++) found.push(...findPolylineCrossings(paths[a], paths[b]));
            }
            const points = distinctPoints(found, (largest || 1) * 2e-3);
            const plot = (dataSeries, list) => {
                const polar = list.map(p => toPolar(p.x, p.y));
                dataSeries.clear();
                dataSeries.appendRange(
                    polar.map(p => p.angle),
                    polar.map(p => p.radius)
                );
            };
            plot(pointData, points);

            // Where each curve is furthest from or nearest to the pole: dr/dθ changes sign there
            const extremes = [];
            if (options.showSpecial) {
                const zeros = paths.length ? paths[0].theta.map(() => 0) : [];
                curves.forEach((curve, c) => {
                    const slopes = paths[c].theta.map(theta => curve.d1(theta));
                    for (const theta of findCrossings(curve.d1, () => 0, paths[c].theta, slopes, zeros, false)) {
                        const r = curve.f(theta);
                        extremes.push({ x: r * Math.cos(theta), y: r * Math.sin(theta) });
                    }
                });
            }
            const distinctExtremes = distinctPoints(extremes, (largest || 1) * 2e-3);
            plot(extremeData, distinctExtremes);

            // For the selected curve, the area swept out by the radius, ½∫r² dθ, and the arc length, ∫√(r² + (dr/dθ)²) dθ,
            // from θ = 0 to each sample (trapezium rule)
            swept = { area: [0], length: [0] };
            const path = paths[options.selected];
            if (path) {
                const speed = path.theta.map((theta, i) => Math.hypot(path.r[i], curves[options.selected].d1(theta)));
                for (let i = 1; i < path.theta.length; i++) {
                    swept.area.push(swept.area[i - 1] + ((path.r[i - 1] ** 2 + path.r[i] ** 2) / 4) * step);
                    swept.length.push(swept.length[i - 1] + ((speed[i - 1] + speed[i]) / 2) * step);
                }
            }

            results = { points, extremes: distinctExtremes.length, sweep: null };
            placeProbe(probeIndex >= 0 && probeIndex <= count ? probeIndex : Math.round(count / 6));
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

// The page around the chart: the list of curves, the library and the other controls. In your app these can be ordinary HTML.

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

// A library of polar curves. turns: draw θ from 0 to turns × π
const LIBRARY = [
    { group: "Circles and lines", name: "Circle centred on the pole", rows: [{ text: "2" }], turns: 2 },
    { group: "Circles and lines", name: "Circle through the pole", rows: [{ text: "2 cos(θ)" }], turns: 1 },
    { group: "Circles and lines", name: "Straight line", rows: [{ text: "1 / cos(θ)" }], turns: 2 },
    { group: "Cardioid and limaçons", name: "Cardioid", rows: [{ text: "1 + cos(θ)" }], turns: 2 },
    { group: "Cardioid and limaçons", name: "Limaçon with an inner loop", rows: [{ text: "1 + 2 cos(θ)" }], turns: 2 },
    { group: "Cardioid and limaçons", name: "Dimpled limaçon", rows: [{ text: "3 + 2 cos(θ)" }], turns: 2 },
    {
        group: "Cardioid and limaçons",
        name: "Limaçons: a + 2 cos(θ)",
        rows: [{ text: "a + 2 cos(θ)", from: 1, to: 4, step: 1 }],
        turns: 2
    },
    { group: "Roses", name: "Three petals", rows: [{ text: "cos(3θ)" }], turns: 1 },
    { group: "Roses", name: "Four petals", rows: [{ text: "cos(2θ)" }], turns: 2 },
    { group: "Roses", name: "Five petals", rows: [{ text: "sin(5θ)" }], turns: 1 },
    { group: "Roses", name: "Roses: cos(n θ)", rows: [{ text: "cos(n θ)", from: 2, to: 4, step: 1 }], turns: 2 },
    { group: "Roses", name: "Overlapping petals: cos(3θ / 2)", rows: [{ text: "cos(3θ / 2)" }], turns: 4 },
    { group: "Spirals", name: "Archimedean spiral", rows: [{ text: "θ / 4" }], turns: 6 },
    { group: "Spirals", name: "Logarithmic spiral", rows: [{ text: "exp(θ / 8)" }], turns: 6 },
    { group: "Spirals", name: "Fermat's spiral", rows: [{ text: "sqrt(θ)" }, { text: "-sqrt(θ)" }], turns: 6 },
    { group: "Spirals", name: "Hyperbolic spiral", rows: [{ text: "4 / θ" }], turns: 8 },
    {
        group: "Lemniscates and conics",
        name: "Lemniscate of Bernoulli",
        rows: [{ text: "sqrt(4 cos(2θ))" }, { text: "-sqrt(4 cos(2θ))" }],
        turns: 2
    },
    {
        group: "Lemniscates and conics",
        name: "Ellipse, focus at the pole",
        rows: [{ text: "1 / (1 + 0.5 cos(θ))" }],
        turns: 2
    },
    {
        group: "Lemniscates and conics",
        name: "Parabola, focus at the pole",
        rows: [{ text: "1 / (1 + cos(θ))" }],
        turns: 2
    },
    {
        group: "Lemniscates and conics",
        name: "Conics: 1 / (1 + k cos(θ))",
        rows: [{ text: "1 / (1 + k cos(θ))", from: 0, to: 0.9, step: 0.3 }],
        turns: 2
    },
    {
        group: "More curves",
        name: "Butterfly curve",
        rows: [{ text: "exp(sin(θ)) - 2 cos(4θ) + sin((2θ - pi) / 24)^5" }],
        turns: 24
    },
    { group: "More curves", name: "Cochleoid", rows: [{ text: "sin(θ) / θ" }], turns: 12 },
    { group: "More curves", name: "Nephroid of Freeth", rows: [{ text: "1 + 2 sin(θ / 2)" }], turns: 4 },
    { group: "More curves", name: "Cissoid of Diocles", rows: [{ text: "2 sin(θ) tan(θ)" }], turns: 1 },
    { group: "Two curves", name: "Cardioid and circle", rows: [{ text: "1 + cos(θ)" }, { text: "1.5" }], turns: 2 },
    { group: "Two curves", name: "Spiral and limaçon", rows: [{ text: "θ / 4" }, { text: "1 + 2 sin(θ)" }], turns: 2 },
    { group: "Two curves", name: "Rose and circle", rows: [{ text: "2 cos(3θ)" }, { text: "1" }], turns: 2 }
];

function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#17243d; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;";
    const bar = element("div", "display:flex; flex-wrap:wrap; gap:6px 14px; align-items:center; padding:8px 12px 4px;");
    const rows = element("div", "display:flex; flex-direction:column; gap:2px; padding:2px 12px;");
    const status = element(
        "div",
        "padding:4px 12px 6px; color:#c8d3e6; min-height:2.8em; line-height:1.4; white-space:pre-line;"
    );
    status.setAttribute("aria-live", "polite");
    const chartDiv = element("div", "flex:1; min-height:0;");
    chartDiv.id = divElementId + "-chart"; // SciChart tells its charts apart by their div's id
    root.append(bar, rows, status, chartDiv);
    return { bar, rows, status, chartDiv };
}

async function polarCurvesDemo(divElementId) {
    const ui = createLayout(divElementId);
    ui.status.textContent = "Loading…";
    const math = await import(MATHJS_URL);

    const copyRows = rows =>
        rows.map(row => ({ text: row.text, from: row.from ?? 1, to: row.to ?? 5, step: row.step ?? 1 }));
    const START = LIBRARY.findIndex(entry => entry.name === "Cardioid and circle");
    const state = {
        rows: copyRows(LIBRARY[START].rows),
        selected: 0,
        probe: true,
        special: true,
        turns: LIBRARY[START].turns
    };
    let curves = [];
    let rowViews = [];

    // --- The bar: the library, the range of θ, the options ---
    const library = element("select", INPUT_STYLE);
    library.setAttribute("aria-label", "Library of polar curves");
    library.append(new Option("Library of polar curves…", ""));
    let group = null;
    LIBRARY.forEach((entry, i) => {
        if (!group || group.label !== entry.group) {
            group = element("optgroup");
            group.label = entry.group;
            library.append(group);
        }
        group.append(new Option(entry.name, String(i)));
    });
    const turnsGroup = element("label", GROUP_STYLE, "θ from 0 to");
    const turns = element("input", INPUT_STYLE + "width:52px;");
    turns.type = "number";
    turns.min = "1";
    turns.max = "24";
    turns.step = "1";
    turns.value = String(state.turns);
    turnsGroup.append(turns, document.createTextNode("π"));
    const addButton = element("button", BUTTON_STYLE, "+ Add curve");
    const probeBox = checkbox("Tangent at the cursor", state.probe, on => {
        state.probe = on;
        recompute();
    });
    const specialBox = checkbox("Furthest and nearest points ▲", state.special, on => {
        state.special = on;
        recompute();
    });
    const hint = element("span", "color:#c8d3e6; font-size:13px;", "Click a curve to select it");
    ui.bar.append(library, turnsGroup, addButton, probeBox.label, specialBox.label, hint);

    // --- The status lines, written when the curves change and as the mouse moves ---
    const showResult = result => {
        const n = result.points.length;
        const list = result.points
            .slice(0, 6)
            .map(
                p =>
                    "(r " +
                    formatNumber(Math.hypot(p.x, p.y), 3) +
                    ", θ " +
                    formatNumber(((Math.atan2(p.y, p.x) + TWO_PI) % TWO_PI) / Math.PI, 3) +
                    "π)"
            )
            .join(", ");
        let text =
            curves.length < 2
                ? ""
                : (n === 0
                      ? "No intersections"
                      : n + (n === 1 ? " intersection" : " intersections") + ": " + list + (n > 6 ? ", …" : "")) +
                  " · ";
        if (state.special) text += result.extremes + " furthest or nearest points";
        if (result.sweep) {
            const sweep = result.sweep;
            const finite = value => (Number.isFinite(value) ? formatNumber(value, 4) : "not finite");
            text +=
                "\n" +
                curves[state.selected].label +
                " from θ = 0 to " +
                formatNumber(sweep.theta / Math.PI, 3) +
                "π: area swept " +
                finite(sweep.area) +
                ", arc length " +
                finite(sweep.length);
            text +=
                " · to " +
                formatNumber(sweep.thetaMax / Math.PI, 3) +
                "π: area " +
                finite(sweep.totalArea) +
                ", arc length " +
                finite(sweep.totalLength);
        }
        ui.status.textContent = text;
    };

    // Select a curve: the tangent follows it, and the swept area and arc length are its
    const select = index => {
        state.selected = index;
        recompute();
    };
    const chart = await createPolarChart(ui.chartDiv, showResult, select);

    const recompute = () => {
        const built = buildCurves(math, state.rows, ["theta", "t"], "r");
        curves = built.curves;
        if (state.selected >= curves.length) state.selected = 0;
        updateRows(rowViews, built.messages, curves.length ? curves[state.selected].row : -1);
        addButton.style.display = state.rows.length < MAX_ROWS ? "" : "none";
        chart.setCurves(curves, {
            selected: state.selected,
            showProbe: state.probe,
            showSpecial: state.special,
            thetaMax: state.turns * Math.PI
        });
    };

    const drawRows = () => {
        rowViews = renderRows(ui.rows, divElementId, state.rows, r => "r" + (r + 1) + "(θ) =", {
            onEdit: recompute,
            onRemove: r => {
                state.rows.splice(r, 1);
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
        state.turns = entry.turns;
        state.selected = 0;
        turns.value = String(entry.turns);
        drawRows();
        recompute();
    });
    turns.addEventListener("input", () => {
        const value = Number(turns.value);
        if (value >= 1 && value <= 24) {
            state.turns = value;
            recompute();
        }
    });
    addButton.addEventListener("click", () => {
        state.rows.push({ text: "1", from: 1, to: 5, step: 1 });
        drawRows();
        recompute();
        rowViews[rowViews.length - 1].input.select();
    });

    drawRows();
    recompute();
}

polarCurvesDemo("scichart-root");
