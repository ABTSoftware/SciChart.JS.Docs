import * as SciChart from "scichart";

// A simulated radio direction finding (DF) network: three receivers, A, B and C, listen to one transmitter.
// Each receiver measures a bearing (angle of arrival, AOA) and a time of arrival. The left chart is the DF display
// for one receiver; the right chart is a plain km grid with the bearing lines or the TDOA hyperbolas, the fix,
// its 95% error ellipse and the true (simulated) transmitter. Everything here is synthetic and generic.
// A seeded random generator makes the noise the same every time. Nothing is loaded from outside.
const C_KM_PER_US = 0.299792458; // radio waves travel about 300 m per microsecond
const DEG = Math.PI / 180;
const MEASUREMENTS_PER_SECOND = 5; // how often each receiver reports a new bearing and arrival time
const HISTORY = 24; // past bearings shown on the DF display
const FIX_HISTORY = 40; // past fixes shown on the map
const ELLIPSE_95 = Math.sqrt(-2 * Math.log(0.05)); // 2.45: scales a 1-sigma ellipse to contain 95% of fixes (2 degrees of freedom)
const MAP_VIEW = { xMin: -5, xMax: 105, yCentre: 40 }; // the default map view, in km

const RECEIVER_COLOURS = ["#F48420", "#50C7E0", "#6CE07A"];
const PAIR_COLOURS = ["#C68BFF", "#FFE45C", "#FF7EB6"]; // hyperbolas B−A, C−A, C−B

// A small seeded random number generator (mulberry32), so the noise is the same on every load
function makeRandom(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
// Normally distributed noise with mean 0 and standard deviation 1 (Box-Muller)
function gaussian(rng) {
    return Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-12))) * Math.cos(2 * Math.PI * rng());
}

// Compass bearing from one point to another: 0° is north (+y), 90° east (+x)
const bearingTo = (from, to) => ((Math.atan2(to.x - from.x, to.y - from.y) / DEG) + 360) % 360;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const wrapPi = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const pad3 = (deg) => String(Math.round(deg) % 360).padStart(3, "0");

// The controls, the readout, the two charts and the key each need an element. This splits the page's div
// into them; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#22365B; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px;";
    const slider = (id, label, min, max, step, value) =>
        `<label data-for="${id}">${label} <input data-id="${id}" type="range" min="${min}" max="${max}" step="${step}" ` +
        `value="${value}" style="vertical-align:middle; width:100px"> <output data-id="${id}"></output></label>`;
    bar.innerHTML =
        `<label>Method <select data-id="mode" style="font:inherit">` +
        `<option value="aoa" selected>AOA (bearings)</option><option value="tdoa">TDOA (hyperbolas)</option>` +
        `<option value="both">Both</option></select></label>` +
        `<label>DF display <select data-id="receiver" style="font:inherit">` +
        `<option value="0">Receiver A</option><option value="1" selected>Receiver B</option><option value="2">Receiver C</option></select></label>` +
        slider("bearingNoise", "Bearing noise", 0.5, 10, 0.5, 3) +
        slider("timingNoise", "Timing noise", 0.1, 5, 0.1, 1) +
        `<label><input data-id="multipath" type="checkbox"> Multipath at B</label>`;
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:2px 12px 0; color:#dfe7f5; font-size:13px; line-height:1.5; min-height:20px;";
    const hover = document.createElement("div");
    hover.style.cssText = "padding:0 12px 6px; color:#b8c6e0; font-size:13px; line-height:1.5; min-height:20px;";
    const charts = document.createElement("div");
    charts.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const dfDiv = document.createElement("div");
    dfDiv.id = divElementId + "-df"; // each chart's div needs its own id
    dfDiv.style.cssText = "flex:1 1 320px; min-height:320px;";
    const mapDiv = document.createElement("div");
    mapDiv.id = divElementId + "-map";
    mapDiv.style.cssText = "flex:1.4 1 420px; min-height:320px;";
    charts.append(dfDiv, mapDiv);
    const key = document.createElement("div");
    key.style.cssText = "display:flex; flex-wrap:wrap; gap:4px 16px; padding:6px 12px 8px; font-size:12px; color:#dfe7f5;";
    root.append(bar, readout, hover, charts, key);
    const get = (selector) => root.querySelector(selector);
    return {
        dfDiv,
        mapDiv,
        readout,
        hover,
        key,
        modeSelect: get('select[data-id="mode"]'),
        receiverSelect: get('select[data-id="receiver"]'),
        bearingInput: get('input[data-id="bearingNoise"]'),
        bearingOutput: get('output[data-id="bearingNoise"]'),
        timingInput: get('input[data-id="timingNoise"]'),
        timingOutput: get('output[data-id="timingNoise"]'),
        multipathInput: get('input[data-id="multipath"]'),
        labelFor: (id) => get(`label[data-for="${id}"]`)
    };
}

async function directionFindingChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Radio direction finding and TDOA: a polar DF display and a map of the fix, charted with SciChart.js
    const {
        SciChartSurface,
        SciChartPolarSurface,
        NumericAxis,
        PolarNumericAxis,
        EPolarAxisMode,
        EPolarGridlineMode,
        EPolarLabelMode,
        EAutoRange,
        NumberRange,
        XyDataSeries,
        XyxDataSeries,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        PolarLineRenderableSeries,
        PolarXyScatterRenderableSeries,
        PolarColumnRenderableSeries,
        EColumnMode,
        EllipsePointMarker,
        TrianglePointMarker,
        SquarePointMarker,
        CrossPointMarker,
        TextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        MouseWheelZoomModifier,
        CustomChartModifier2D,
        EModifierType,
        translateFromCanvasToSeriesViewRect,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- The scenario: positions in km east (x) and north (y) of a reference point ---
    const DEFAULT_RECEIVERS = [{ x: 20, y: 15 }, { x: 80, y: 20 }, { x: 45, y: 65 }];
    const receivers = DEFAULT_RECEIVERS.map((r) => ({ ...r }));
    const transmitter = { x: 58, y: 40 };
    const reflector = { x: 75, y: 45 }; // a hill: with multipath on, B hears only the echo off it
    const NAMES = ["A", "B", "C"];
    const PAIRS = [[0, 1], [0, 2], [1, 2]]; // hyperbolas for B−A, C−A and C−B
    const rng = makeRandom(20261127);

    // One set of measurements: a bearing and a time of arrival at each receiver, with noise.
    // Arrival times are kept as ranges (time × c) in km, so time differences become range differences.
    function measure(sigmaDeg, sigmaUs, multipath) {
        const bearings = [];
        const ranges = [];
        receivers.forEach((r, i) => {
            const blocked = multipath && i === 1;
            const source = blocked ? reflector : transmitter;
            bearings.push((bearingTo(r, source) + sigmaDeg * gaussian(rng) + 360) % 360);
            const path = blocked ? distance(transmitter, reflector) + distance(reflector, r) : distance(transmitter, r);
            ranges.push(path + C_KM_PER_US * sigmaUs * gaussian(rng));
        });
        return { bearings, rangeDiffs: PAIRS.map(([i, j]) => ranges[j] - ranges[i]) };
    }

    // The fix: weighted least squares by Gauss-Newton iteration. Bearings have standard deviation sigmaDeg.
    // Range differences B−A and C−A share A's timing noise, so their covariance is (c·σt)² [[2, 1], [1, 2]].
    // Returns the position and its covariance P (the inverse of the information matrix JᵀWJ at the fix).
    function solveFix(meas, useAoa, useTdoa, sigmaDeg, sigmaUs, start) {
        let p = { ...start };
        let P = null;
        const varBearing = (sigmaDeg * DEG) ** 2;
        const varRange = (C_KM_PER_US * sigmaUs) ** 2;
        const W = [[2 / 3 / varRange, -1 / 3 / varRange], [-1 / 3 / varRange, 2 / 3 / varRange]]; // inverse of the covariance above
        for (let iteration = 0; iteration < 30; iteration++) {
            let n11 = 0, n12 = 0, n22 = 0, g1 = 0, g2 = 0;
            if (useAoa) {
                receivers.forEach((r, i) => {
                    const dx = p.x - r.x;
                    const dy = p.y - r.y;
                    const q = dx * dx + dy * dy;
                    const jx = dy / q; // ∂bearing/∂x for bearing = atan2(dx, dy)
                    const jy = -dx / q; // ∂bearing/∂y
                    const residual = wrapPi(meas.bearings[i] * DEG - Math.atan2(dx, dy));
                    n11 += (jx * jx) / varBearing;
                    n12 += (jx * jy) / varBearing;
                    n22 += (jy * jy) / varBearing;
                    g1 += (jx * residual) / varBearing;
                    g2 += (jy * residual) / varBearing;
                });
            }
            if (useTdoa) {
                const u = receivers.map((r) => {
                    const d = distance(p, r);
                    return { x: (p.x - r.x) / d, y: (p.y - r.y) / d, d };
                });
                const J = [[u[1].x - u[0].x, u[1].y - u[0].y], [u[2].x - u[0].x, u[2].y - u[0].y]];
                const residual = [meas.rangeDiffs[0] - (u[1].d - u[0].d), meas.rangeDiffs[1] - (u[2].d - u[0].d)];
                for (let a = 0; a < 2; a++) {
                    for (let b = 0; b < 2; b++) {
                        n11 += J[a][0] * W[a][b] * J[b][0];
                        n12 += J[a][0] * W[a][b] * J[b][1];
                        n22 += J[a][1] * W[a][b] * J[b][1];
                        g1 += J[a][0] * W[a][b] * residual[b];
                        g2 += J[a][1] * W[a][b] * residual[b];
                    }
                }
            }
            const det = n11 * n22 - n12 * n12;
            if (!(det > 0)) return null; // e.g. all bearings parallel: no crossing
            P = { xx: n22 / det, xy: -n12 / det, yy: n11 / det };
            let sx = P.xx * g1 + P.xy * g2;
            let sy = P.xy * g1 + P.yy * g2;
            const step = Math.hypot(sx, sy);
            if (step > 30) {
                sx *= 30 / step; // limit each step, so a poor start can't throw the fix far away
                sy *= 30 / step;
            }
            p = { x: p.x + sx, y: p.y + sy };
            if (step < 1e-6) break;
        }
        return Number.isFinite(p.x) && Number.isFinite(p.y) ? { p, P } : null;
    }

    // A starting point for the bearings-only fix: the point closest to all bearing lines (unweighted, closed form)
    function crossingPoint(bearings) {
        let a11 = 0, a12 = 0, a22 = 0, b1 = 0, b2 = 0;
        receivers.forEach((r, i) => {
            const nx = Math.cos(bearings[i] * DEG); // normal to the bearing line (sin, cos)
            const ny = -Math.sin(bearings[i] * DEG);
            const c = nx * r.x + ny * r.y;
            a11 += nx * nx;
            a12 += nx * ny;
            a22 += ny * ny;
            b1 += nx * c;
            b2 += ny * c;
        });
        const det = a11 * a22 - a12 * a12;
        return det > 1e-9 ? { x: (a22 * b1 - a12 * b2) / det, y: (a11 * b2 - a12 * b1) / det } : null;
    }

    // The 95% error ellipse from the fix covariance: eigenvalues give the axes, the eigenvector the orientation
    function errorEllipse(fix) {
        const { xx, xy, yy } = fix.P;
        const half = Math.sqrt(((xx - yy) / 2) ** 2 + xy * xy);
        const major = ELLIPSE_95 * Math.sqrt((xx + yy) / 2 + half);
        const minor = ELLIPSE_95 * Math.sqrt(Math.max((xx + yy) / 2 - half, 0));
        const angle = 0.5 * Math.atan2(2 * xy, xx - yy);
        const xs = [];
        const ys = [];
        for (let k = 0; k <= 72; k++) {
            const t = (k / 72) * 2 * Math.PI;
            const ex = major * Math.cos(t);
            const ey = minor * Math.sin(t);
            xs.push(fix.p.x + ex * Math.cos(angle) - ey * Math.sin(angle));
            ys.push(fix.p.y + ex * Math.sin(angle) + ey * Math.cos(angle));
        }
        return { major, minor, xs, ys };
    }

    // The points where |p − f2| − |p − f1| equals rangeDiff: one branch of a hyperbola with foci at the receivers
    function hyperbola(f1, f2, rangeDiff, reach) {
        const c = distance(f1, f2) / 2;
        if (Math.abs(rangeDiff) >= 2 * c) return { xs: [], ys: [] }; // impossible: longer than the baseline
        const a = rangeDiff / 2;
        const b = Math.sqrt(c * c - a * a);
        const ux = (f2.x - f1.x) / (2 * c);
        const uy = (f2.y - f1.y) / (2 * c);
        const mx = (f1.x + f2.x) / 2;
        const my = (f1.y + f2.y) / 2;
        const tMax = Math.asinh(reach / b);
        const xs = [];
        const ys = [];
        for (let k = 0; k <= 200; k++) {
            const t = -tMax + (2 * tMax * k) / 200;
            const along = -a * Math.cosh(t); // along the baseline, from its midpoint towards f2
            const across = b * Math.sinh(t);
            xs.push(mx + along * ux - across * uy);
            ys.push(my + along * uy + across * ux);
        }
        return { xs, ys };
    }

    const theme = new SciChartJsNavyTheme();

    // --- Chart 1: the DF display, a compass rose for one receiver ---
    const df = await SciChartPolarSurface.create(ui.dfDiv, {
        theme,
        title: "DF display",
        titleStyle: { fontSize: 15, color: "#dfe7f5" }
    });
    df.sciChartSurface.background = "#0B1A2E";
    const bearingAxis = new PolarNumericAxis(df.wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, 360),
        autoRange: EAutoRange.Never,
        startAngle: Math.PI / 2, // 000° at the top
        flippedCoordinates: true, // bearings increase clockwise, like a compass
        autoTicks: false,
        majorDelta: 30,
        polarLabelMode: EPolarLabelMode.Horizontal,
        drawMinorGridLines: false,
        drawMajorBands: false,
        majorGridLineStyle: { strokeThickness: 1, color: "#FFFFFF22" }
    });
    bearingAxis.labelProvider.formatLabel = (value) => (value >= 360 ? "" : `${pad3(value)}°`);
    const radiusAxis = new PolarNumericAxis(df.wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 1),
        autoRange: EAutoRange.Never,
        startAngle: Math.PI / 2,
        gridlineMode: EPolarGridlineMode.Circles,
        autoTicks: false,
        majorDelta: 0.25,
        drawLabels: false,
        drawMinorGridLines: false,
        drawMajorBands: false,
        majorGridLineStyle: { strokeThickness: 1, color: "#FFFFFF22" }
    });
    df.sciChartSurface.xAxes.add(bearingAxis);
    df.sciChartSurface.yAxes.add(radiusAxis);

    // The spread: a wedge 2 standard deviations either side of the strobe. Three copies, a turn apart,
    // so the wedge still draws when it crosses north (the chart only draws 0° to 360°)
    const spreadData = new XyxDataSeries(df.wasmContext, { xValues: [-360, 0, 360], x1Values: [-360, 0, 360], yValues: [1, 1, 1] });
    const spread = new PolarColumnRenderableSeries(df.wasmContext, {
        dataSeries: spreadData,
        columnXMode: EColumnMode.StartEnd,
        strokeThickness: 0,
        fill: "#FFFFFF30"
    });
    const trueLine = new PolarLineRenderableSeries(df.wasmContext, {
        dataSeries: new XyDataSeries(df.wasmContext),
        stroke: "#FF8A8A",
        strokeThickness: 1.5,
        strokeDashArray: [5, 5]
    });
    // The strobe: a coloured line with a white core, so it stands out from the history dots
    const strobeData = new XyDataSeries(df.wasmContext);
    const strobe = new PolarLineRenderableSeries(df.wasmContext, { dataSeries: strobeData, stroke: "#FFFFFF", strokeThickness: 6 });
    const strobeCore = new PolarLineRenderableSeries(df.wasmContext, { dataSeries: strobeData, stroke: "#FFFFFF", strokeThickness: 2 });
    // Recent bearings as dots, newest at the rim; older dots move inwards and fade (four age groups)
    const historyLayers = [0.9, 0.6, 0.38, 0.2].map(
        (opacity) =>
            new PolarXyScatterRenderableSeries(df.wasmContext, {
                dataSeries: new XyDataSeries(df.wasmContext),
                opacity,
                pointMarker: new EllipsePointMarker(df.wasmContext, { width: 6, height: 6, strokeThickness: 0, fill: "#FFFFFF" })
            })
    );
    df.sciChartSurface.renderableSeries.add(spread, ...historyLayers, trueLine, strobe, strobeCore);

    // --- Chart 2: the map, a plain km grid ---
    const map = await SciChartSurface.create(ui.mapDiv, {
        theme,
        title: "Map (km)",
        titleStyle: { fontSize: 15, color: "#dfe7f5" }
    });
    const wasm = map.wasmContext;
    const axisOptions = { autoRange: EAutoRange.Never, labelPrecision: 0, axisTitleStyle: { fontSize: 14 }, labelStyle: { fontSize: 12 } };
    const xAxis = new NumericAxis(wasm, { ...axisOptions, axisTitle: "East (km)", visibleRange: new NumberRange(MAP_VIEW.xMin, MAP_VIEW.xMax) });
    const yAxis = new NumericAxis(wasm, { ...axisOptions, axisTitle: "North (km)", visibleRange: new NumberRange(0, 80) });
    map.sciChartSurface.xAxes.add(xAxis);
    map.sciChartSurface.yAxes.add(yAxis);

    const line = (stroke, thickness, extra = {}) =>
        new FastLineRenderableSeries(wasm, { dataSeries: new XyDataSeries(wasm, { containsNaN: true }), stroke, strokeThickness: thickness, ...extra });
    const scatter = (pointMarker) => new XyScatterRenderableSeries(wasm, { dataSeries: new XyDataSeries(wasm), pointMarker });
    const bearingLines = RECEIVER_COLOURS.map((colour) => line(colour, 2));
    const sectorLines = line("#FFFFFF66", 1, { strokeDashArray: [4, 4] }); // ±2σ either side of the selected receiver's bearing
    const hyperbolas = PAIR_COLOURS.map((colour) => line(colour, 2));
    const echoPath = line("#C9A96E", 1.5, { strokeDashArray: [2, 4] }); // transmitter → reflector → B
    const ellipseLine = line("#FFFFFF", 2);
    const pastFixes = scatter(new EllipsePointMarker(wasm, { width: 4, height: 4, strokeThickness: 0, fill: "#FFFFFF66" }));
    const fixMarker = scatter(new EllipsePointMarker(wasm, { width: 11, height: 11, strokeThickness: 2, stroke: "#FFFFFF", fill: "#FFFFFF55" }));
    const receiverMarkers = RECEIVER_COLOURS.map((colour) =>
        scatter(new TrianglePointMarker(wasm, { width: 16, height: 16, strokeThickness: 2, stroke: colour, fill: colour + "AA" }))
    );
    const transmitterMarker = scatter(new CrossPointMarker(wasm, { width: 16, height: 16, strokeThickness: 3, stroke: "#FF5C5C" }));
    const reflectorMarker = scatter(new SquarePointMarker(wasm, { width: 12, height: 12, strokeThickness: 2, stroke: "#C9A96E", fill: "#C9A96E55" }));
    map.sciChartSurface.renderableSeries.add(
        ...hyperbolas,
        ...bearingLines,
        sectorLines,
        echoPath,
        pastFixes,
        ellipseLine,
        fixMarker,
        reflectorMarker,
        ...receiverMarkers,
        transmitterMarker
    );
    const label = (text, color, toLeft = false) =>
        new TextAnnotation({
            text,
            textColor: color,
            fontSize: 13,
            xCoordShift: toLeft ? -10 : 10,
            yCoordShift: toLeft ? 8 : -8,
            horizontalAnchorPoint: toLeft ? EHorizontalAnchorPoint.Right : EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: toLeft ? EVerticalAnchorPoint.Top : EVerticalAnchorPoint.Bottom
        });
    const receiverLabels = NAMES.map((name, i) => label(name, RECEIVER_COLOURS[i]));
    const transmitterLabel = label("Transmitter (true)", "#FF8A8A");
    const fixLabel = label("Fix", "#FFFFFF", true);
    const reflectorLabel = label("Reflector", "#C9A96E");
    map.sciChartSurface.annotations.add(...receiverLabels, transmitterLabel, fixLabel, reflectorLabel);
    map.sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    const setXy = (series, xs, ys) => {
        series.dataSeries.clear();
        if (xs.length > 0) series.dataSeries.appendRange(xs, ys);
    };
    const place = (annotation, p) => {
        annotation.x1 = p.x;
        annotation.y1 = p.y;
    };

    // Keep 1 km the same length on both axes, so angles, circles and ellipses aren't distorted
    function keepSquare() {
        const rect = map.sciChartSurface.seriesViewRect;
        if (!rect || rect.width < 10 || rect.height < 10) return;
        const xr = xAxis.visibleRange;
        const yr = yAxis.visibleRange;
        const span = ((xr.max - xr.min) * rect.height) / rect.width;
        if (Math.abs(yr.max - yr.min - span) > span * 1e-3) {
            const centre = (yr.min + yr.max) / 2;
            yAxis.visibleRange = new NumberRange(centre - span / 2, centre + span / 2);
        }
    }
    function resetView() {
        xAxis.visibleRange = new NumberRange(MAP_VIEW.xMin, MAP_VIEW.xMax);
        yAxis.visibleRange = new NumberRange(MAP_VIEW.yCentre - 40, MAP_VIEW.yCentre + 40);
        keepSquare();
    }

    // --- State and drawing ---
    const bearingHistory = [[], [], []]; // newest first, per receiver
    const fixHistory = [];
    let latest = null;
    let fix = null;
    let lastFixPosition = null;

    function settings() {
        return {
            mode: ui.modeSelect.value,
            selected: Number(ui.receiverSelect.value),
            sigmaDeg: Number(ui.bearingInput.value),
            sigmaUs: Number(ui.timingInput.value),
            multipath: ui.multipathInput.checked
        };
    }

    // Take one new set of measurements and compute the fix
    function step() {
        const s = settings();
        latest = measure(s.sigmaDeg, s.sigmaUs, s.multipath);
        latest.bearings.forEach((b, i) => {
            bearingHistory[i].unshift(b);
            if (bearingHistory[i].length > HISTORY) bearingHistory[i].pop();
        });
        const useAoa = s.mode !== "tdoa";
        const useTdoa = s.mode !== "aoa";
        const centroid = { x: (receivers[0].x + receivers[1].x + receivers[2].x) / 3, y: (receivers[0].y + receivers[1].y + receivers[2].y) / 3 };
        const start = (useAoa && crossingPoint(latest.bearings)) || lastFixPosition || centroid;
        fix = solveFix(latest, useAoa, useTdoa, s.sigmaDeg, s.sigmaUs, start);
        if (fix && distance(fix.p, centroid) > 1000) fix = null; // bearings nearly parallel: no useful crossing
        if (fix) {
            lastFixPosition = fix.p;
            fixHistory.unshift(fix.p);
            if (fixHistory.length > FIX_HISTORY) fixHistory.pop();
        }
        draw();
    }

    function drawDfDisplay(s) {
        const i = s.selected;
        const colour = RECEIVER_COLOURS[i];
        const history = bearingHistory[i];
        if (history.length === 0) return;
        df.sciChartSurface.title = `DF display: receiver ${NAMES[i]}`;
        const bearing = history[0];
        strobe.stroke = colour;
        setXy(strobe, [bearing, bearing], [0, 1]);
        const trueBearing = bearingTo(receivers[i], transmitter);
        setXy(trueLine, [trueBearing, trueBearing], [0, 1]);
        // Spread of the recent bearings: the circular standard deviation, shown as ±2σ
        let sumSin = 0;
        let sumCos = 0;
        const recent = history.slice(0, 12);
        for (const b of recent) {
            sumSin += Math.sin(b * DEG);
            sumCos += Math.cos(b * DEG);
        }
        const meanBearing = ((Math.atan2(sumSin, sumCos) / DEG) + 360) % 360;
        const resultant = Math.min(1, Math.hypot(sumSin, sumCos) / recent.length);
        const spreadDeg = recent.length > 2 ? Math.sqrt(-2 * Math.log(Math.max(resultant, 1e-9))) / DEG : s.sigmaDeg;
        spread.fill = colour + "38";
        for (let k = 0; k < 3; k++) spreadData.updateXyz(k, meanBearing - 2 * spreadDeg + (k - 1) * 360, 1, meanBearing + 2 * spreadDeg + (k - 1) * 360);
        // History dots: newest on the rim, each older one a little further in
        historyLayers.forEach((layer, group) => {
            const xs = [];
            const ys = [];
            for (let age = group * 6; age < Math.min(history.length, (group + 1) * 6); age++) {
                xs.push(history[age]);
                ys.push(0.96 - age * 0.028);
            }
            layer.pointMarker.fill = colour;
            setXy(layer, xs, ys);
        });
        return { bearing, meanBearing, spreadDeg, trueBearing };
    }

    function draw() {
        if (!latest) return;
        const s = settings();
        const showAoa = s.mode !== "tdoa";
        const showTdoa = s.mode !== "aoa";
        const reach = 400; // km: long enough to run off the map
        // Bearing lines from each receiver, and the ±2σ sector of the selected one
        bearingLines.forEach((series, i) => {
            const b = latest.bearings[i] * DEG;
            const r = receivers[i];
            setXy(series, [r.x, r.x + reach * Math.sin(b)], [r.y, r.y + reach * Math.cos(b)]);
            series.isVisible = showAoa;
        });
        const r = receivers[s.selected];
        const b = latest.bearings[s.selected];
        const lo = (b - 2 * s.sigmaDeg) * DEG;
        const hi = (b + 2 * s.sigmaDeg) * DEG;
        setXy(sectorLines, [r.x, r.x + reach * Math.sin(lo), NaN, r.x, r.x + reach * Math.sin(hi)], [r.y, r.y + reach * Math.cos(lo), NaN, r.y, r.y + reach * Math.cos(hi)]);
        sectorLines.isVisible = showAoa;
        // Hyperbolas from the measured range differences of each receiver pair
        PAIRS.forEach(([i, j], k) => {
            const h = hyperbola(receivers[i], receivers[j], latest.rangeDiffs[k], reach);
            setXy(hyperbolas[k], h.xs, h.ys);
            hyperbolas[k].isVisible = showTdoa;
        });
        // The multipath echo path
        echoPath.isVisible = s.multipath;
        reflectorMarker.isVisible = s.multipath;
        reflectorLabel.isHidden = !s.multipath;
        setXy(echoPath, [transmitter.x, reflector.x, receivers[1].x], [transmitter.y, reflector.y, receivers[1].y]);
        setXy(reflectorMarker, [reflector.x], [reflector.y]);
        place(reflectorLabel, reflector);
        // Sites
        receivers.forEach((rx, i) => {
            setXy(receiverMarkers[i], [rx.x], [rx.y]);
            place(receiverLabels[i], rx);
        });
        setXy(transmitterMarker, [transmitter.x], [transmitter.y]);
        place(transmitterLabel, transmitter);
        setXy(pastFixes, fixHistory.map((p) => p.x), fixHistory.map((p) => p.y));
        // The fix and its error ellipse
        let summary;
        if (fix) {
            const e = errorEllipse(fix);
            setXy(ellipseLine, e.xs, e.ys);
            setXy(fixMarker, [fix.p.x], [fix.p.y]);
            place(fixLabel, fix.p);
            fixLabel.isHidden = false;
            const miss = distance(fix.p, transmitter);
            const gdop = s.mode === "tdoa" ? ` · GDOP ${(Math.sqrt(fix.P.xx + fix.P.yy) / (C_KM_PER_US * s.sigmaUs)).toFixed(1)}` : "";
            summary =
                `Fix ${fix.p.x.toFixed(1)} km E, ${fix.p.y.toFixed(1)} km N, ${miss.toFixed(2)} km from the true position · ` +
                `95% error ellipse ${(2 * e.major).toFixed(2)} × ${(2 * e.minor).toFixed(2)} km${gdop}`;
        } else {
            setXy(ellipseLine, [], []);
            setXy(fixMarker, [], []);
            fixLabel.isHidden = true;
            summary = "No fix: the measurements don't cross";
        }
        const d = drawDfDisplay(s);
        const dfText = d
            ? ` · ${NAMES[s.selected]}: bearing ${d.bearing.toFixed(1)}°, spread ±${d.spreadDeg.toFixed(1)}° (1σ, last 12)` +
              (s.multipath && s.selected === 1 ? `, true ${d.trueBearing.toFixed(1)}° (echo off the reflector)` : "")
            : "";
        ui.readout.textContent = summary + dfText + ". Simulated data.";
    }

    // --- Hover readouts and dragging on the map ---
    let dragging = null; // the object being dragged: transmitter, or a receiver
    let hoverText = "";
    function hoverReadout(p) {
        const bearings = receivers.map((rx, i) => `${NAMES[i]} ${pad3(bearingTo(rx, p))}°`).join(", ");
        const dBA = distance(p, receivers[1]) - distance(p, receivers[0]);
        const dCA = distance(p, receivers[2]) - distance(p, receivers[0]);
        return (
            `Cursor ${p.x.toFixed(1)} km E, ${p.y.toFixed(1)} km N · bearings from ${bearings} · ` +
            `range differences B−A ${dBA.toFixed(2)} km (${(dBA / C_KM_PER_US).toFixed(1)} µs), C−A ${dCA.toFixed(2)} km (${(dCA / C_KM_PER_US).toFixed(1)} µs)`
        );
    }
    class MapDragModifier extends CustomChartModifier2D {
        get modifierType() {
            return EModifierType.Chart2DModifier;
        }
        toData(args) {
            const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            if (!point) return null;
            return {
                x: xAxis.getCurrentCoordinateCalculator().getDataValue(point.x),
                y: yAxis.getCurrentCoordinateCalculator().getDataValue(point.y),
                px: point.x,
                py: point.y
            };
        }
        modifierMouseDown(args) {
            super.modifierMouseDown(args);
            const m = this.toData(args);
            if (!m) return;
            // Pick the nearest site within about 20 pixels of the mouse
            const xc = xAxis.getCurrentCoordinateCalculator();
            const yc = yAxis.getCurrentCoordinateCalculator();
            const candidates = [transmitter, ...receivers];
            let best = null;
            let bestDistance = 20 * (window.devicePixelRatio || 1);
            for (const c of candidates) {
                const dp = Math.hypot(xc.getCoordinate(c.x) - m.px, yc.getCoordinate(c.y) - m.py);
                if (dp < bestDistance) {
                    best = c;
                    bestDistance = dp;
                }
            }
            dragging = best;
            const index = receivers.indexOf(best);
            if (index >= 0) ui.receiverSelect.value = String(index); // clicking a receiver shows its DF display
            if (best) args.handled = true;
        }
        modifierMouseMove(args) {
            super.modifierMouseMove(args);
            const m = this.toData(args);
            if (dragging && m) {
                dragging.x = m.x;
                dragging.y = m.y;
                fixHistory.length = 0; // the old fixes belong to the old geometry
                draw();
            }
            hoverText = m ? hoverReadout(m) : "";
            ui.hover.textContent = hoverText;
        }
        modifierMouseUp(args) {
            super.modifierMouseUp(args);
            dragging = null;
        }
        modifierMouseLeave(args) {
            super.modifierMouseLeave(args);
            dragging = null;
            ui.hover.textContent = "";
        }
        modifierDoubleClick(args) {
            super.modifierDoubleClick(args);
            resetView();
        }
    }
    map.sciChartSurface.chartModifiers.add(new MapDragModifier());

    // Hover on the DF display: the bearing under the mouse
    class DfReadoutModifier extends CustomChartModifier2D {
        get modifierType() {
            return EModifierType.Chart2DPolarModifier;
        }
        modifierMouseMove(args) {
            super.modifierMouseMove(args);
            const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            if (!point) return;
            const polar = bearingAxis.reverseTransform(point.x, point.y);
            const bearing = (bearingAxis.getCurrentCoordinateCalculator().getDataValue(polar.x) + 360) % 360;
            ui.hover.textContent = `DF display: cursor at bearing ${pad3(bearing)}° from receiver ${NAMES[settings().selected]}`;
        }
        modifierMouseLeave(args) {
            super.modifierMouseLeave(args);
            ui.hover.textContent = "";
        }
    }
    df.sciChartSurface.chartModifiers.add(new DfReadoutModifier());

    // --- The key ---
    const swatch = (colour, text, dashed = false) =>
        `<span style="display:inline-flex; align-items:center; gap:5px"><span style="display:inline-block; width:18px; ` +
        `border-top:2px ${dashed ? "dashed" : "solid"} ${colour}"></span>${text}</span>`;
    ui.key.innerHTML =
        swatch(RECEIVER_COLOURS[0], "Bearing A") +
        swatch(RECEIVER_COLOURS[1], "Bearing B") +
        swatch(RECEIVER_COLOURS[2], "Bearing C") +
        swatch(PAIR_COLOURS[0], "Hyperbola B−A") +
        swatch(PAIR_COLOURS[1], "Hyperbola C−A") +
        swatch(PAIR_COLOURS[2], "Hyperbola C−B") +
        swatch("#FFFFFF", "95% error ellipse") +
        swatch("#FFFFFFAA", "±2σ either side of the DF receiver's bearing", true) +
        swatch("#FF8A8A", "True bearing on the DF display (known only in a simulation)", true) +
        `<span>Drag the red cross or a receiver. Scroll to zoom, double-click to reset. All positions and signals are simulated.</span>`;

    // --- Controls ---
    function updateControls() {
        const s = settings();
        ui.bearingOutput.textContent = `${s.sigmaDeg.toFixed(1)}°`;
        ui.timingOutput.textContent = `${s.sigmaUs.toFixed(1)} µs`;
        ui.labelFor("bearingNoise").style.display = s.mode === "tdoa" ? "none" : "";
        ui.labelFor("timingNoise").style.display = s.mode === "aoa" ? "none" : "";
    }
    const restart = () => {
        fixHistory.length = 0;
        updateControls();
        step();
    };
    ui.modeSelect.addEventListener("change", restart);
    ui.multipathInput.addEventListener("change", restart);
    ui.bearingInput.addEventListener("input", restart);
    ui.timingInput.addEventListener("input", restart);
    ui.receiverSelect.addEventListener("change", draw);

    // --- New measurements MEASUREMENTS_PER_SECOND times a second; stops when the chart is deleted ---
    updateControls();
    resetView();
    for (let k = 0; k < HISTORY; k++) step(); // fill the history, so the displays aren't empty at the start
    let last = performance.now();
    function animate(now) {
        if (map.sciChartSurface.isDeleted || df.sciChartSurface.isDeleted) return;
        keepSquare();
        if (now - last >= 1000 / MEASUREMENTS_PER_SECOND) {
            last = now;
            step();
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    // #region_A_end
}

directionFindingChart("scichart-root");
