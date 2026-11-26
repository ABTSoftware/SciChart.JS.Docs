import * as SciChart from "scichart";

// A simulated weather radar, drawn the way a Doppler radar draws its lowest scan: a polar image with the radar
// at the centre, azimuth (compass bearing) around the circle and range (distance) outwards.
// The weather is synthetic: a squall line of thunderstorms with light rain behind it, a separate supercell
// with a hail core, a hook echo and a rotating updraft, scattered showers, and ground clutter near the radar.
// A seeded random generator makes it look the same every time. Nothing is loaded from outside.
const AZIMUTHS = 360; // one column per degree of azimuth
const GATES = 300; // range gates (cells along each beam)
const GATE_KM = 0.5; // so the image reaches 150 km from the radar
const MAX_RANGE = GATES * GATE_KM;
const SWEEP_SECONDS = 4; // one turn of the antenna on screen
const MINUTES_PER_SWEEP = 4.5; // the time one turn stands for: about one radar volume scan
const LOOP_SWEEPS = 16; // the weather moves for 16 scans, then the loop starts again
const STORM_MOTION = { x: 0.68, y: 0.3 }; // km per minute: about 45 km/h towards the east-north-east
const ELEVATION_DEG = 0.5; // the radar's lowest tilt
const HEATMAP_UPDATES_PER_SECOND = 30; // how often the heatmap is recomputed and sent to the chart (see the animation below)
const SWEEP_GLOW_DEG = 60; // the glow behind the sweep line fades out over this many degrees

// A reflectivity colour scale in the style of the classic US National Weather Service radar images:
// one colour per 5 dBZ step, from 5 dBZ to 75 dBZ and above
const DBZ_SCALE = [
    { dbz: 5, color: "#04E9E7", name: "light cyan" },
    { dbz: 10, color: "#019FF4", name: "light blue" },
    { dbz: 15, color: "#0300F4", name: "blue" },
    { dbz: 20, color: "#02FD02", name: "bright green" },
    { dbz: 25, color: "#01C501", name: "green" },
    { dbz: 30, color: "#008E00", name: "dark green" },
    { dbz: 35, color: "#FDF802", name: "yellow" },
    { dbz: 40, color: "#E5BC00", name: "gold" },
    { dbz: 45, color: "#FD9500", name: "orange" },
    { dbz: 50, color: "#FD0000", name: "red" },
    { dbz: 55, color: "#D40000", name: "dark red" },
    { dbz: 60, color: "#BC0000", name: "maroon" },
    { dbz: 65, color: "#F800FD", name: "pink (magenta)" },
    { dbz: 70, color: "#9854C6", name: "purple" },
    { dbz: 75, color: "#FDFDFD", name: "white" }
];
const DBZ_MIN = 5;
const DBZ_MAX = 80;

// What a reflectivity usually means. Rain rates use Z = 200 R^1.6 (Marshall-Palmer) and assume the echo is all rain
function meaningOfDbz(dbz) {
    if (dbz < 20) return "very light: drizzle, light snow, or non-weather echoes such as insects, birds or ground clutter";
    if (dbz < 30) return "light rain, about 0.6 to 3 mm (up to 0.1 in) an hour";
    if (dbz < 40) return "moderate rain, about 3 to 12 mm (0.1 to 0.45 in) an hour";
    if (dbz < 50) return "heavy rain, about 12 to 50 mm (0.45 to 1.9 in) an hour";
    if (dbz < 60) return "very heavy rain, and small hail is possible";
    if (dbz < 65) return "very heavy rain, probably with hail";
    return "hail is very likely, though radar reflectivity alone can't tell its size";
}

// Height of the beam centre above the radar at a range, for the 0.5° tilt, with the standard 4/3 Earth radius model
function beamHeightKm(rangeKm) {
    const ka = (4 / 3) * 6371;
    const el = (ELEVATION_DEG * Math.PI) / 180;
    return Math.sqrt(rangeKm * rangeKm + ka * ka + 2 * rangeKm * ka * Math.sin(el)) - ka;
}

// A small seeded random number generator (mulberry32), so the weather is the same on every load
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
// A repeatable pseudo-random number in [0, 1) for one cell, for speckle that doesn't flicker
function hash01(i, j, k) {
    let h = Math.imul(i + 1, 374761393) ^ Math.imul(j + 1, 668265263) ^ Math.imul(k + 1, 2246822519);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// --- The synthetic weather ---
// Reflectivities add as power (Z, in mm^6/m^3), not as dBZ, so overlapping echoes combine as a radar sees them
const toZ = (dbz) => Math.pow(10, dbz / 10);
const toDbz = (z) => 10 * Math.log10(z);
const gauss = (d2, sigma) => Math.exp(-d2 / (2 * sigma * sigma));

const rng = makeRandom(20261126);
// Scattered showers: position (km from the radar), size and peak reflectivity
const SHOWERS = Array.from({ length: 22 }, () => {
    const angle = rng() * 2 * Math.PI;
    const dist = 25 + rng() * 120;
    return { x: dist * Math.sin(angle), y: dist * Math.cos(angle), size: 2 + rng() * 5, dbz: 15 + rng() * 20 };
});
// Thunderstorm cells strung along the squall line: position along the line (-1 to 1) and peak reflectivity
const LINE_CELLS = Array.from({ length: 14 }, (_, i) => ({ s: -0.95 + (i * 1.9) / 13 + (rng() - 0.5) * 0.08, dbz: 47 + rng() * 9 }));
LINE_CELLS[6].dbz = 61; // one cell in the line is strong enough to be producing hail
// The supercell, its hail core and its hook, in km from the radar at the start of the loop
const SUPERCELL = { x: 12, y: -52 };
const HOOK = { x: SUPERCELL.x - 6, y: SUPERCELL.y - 7.5, radius: 4.5 };

// Squall line centre line: x as a function of y, bowing eastwards in the middle
const lineX = (y) => -62 + 14 * (1 - (y / 80) * (y / 80));

// Reflectivity (dBZ) of the moving weather at a point, at time t in minutes
function weatherDbz(x, y, t) {
    const sx = x - STORM_MOTION.x * t; // storm-relative position
    const sy = y - STORM_MOTION.y * t;
    let z = 0;
    // Squall line: a narrow band of strong cells, with a wide area of lighter (stratiform) rain behind it
    if (Math.abs(sy) < 95) {
        const dx = sx - lineX(sy); // > 0 ahead of the line (east), < 0 behind it
        const taper = gauss(Math.max(0, Math.abs(sy) - 70) ** 2, 8);
        for (const cell of LINE_CELLS) {
            const cy = cell.s * 80;
            const d2 = (dx + 1.5) ** 2 + ((sy - cy) * 0.55) ** 2;
            z += toZ(cell.dbz) * gauss(d2, 3.2) * taper;
        }
        if (dx < 0 && dx > -45) {
            const stratiform = 31 - Math.abs(dx + 18) * 0.35 + 3 * Math.sin(sy / 9);
            z += toZ(stratiform) * gauss(Math.max(0, -dx - 40) ** 2, 4) * taper;
        }
        z += toZ(26) * gauss((dx + 4) ** 2, 6) * taper;
    }
    // Supercell: a hail core inside a heavy rain core, a forward-flank shield downstream, and a hook echo
    const cx = sx - SUPERCELL.x;
    const cy = sy - SUPERCELL.y;
    z += toZ(71) * gauss(cx * cx + cy * cy, 2.2);
    z += toZ(56) * gauss(cx * cx + cy * cy, 3.2);
    const fx = cx * 0.9 + cy * 0.44 - 9; // along the storm's motion, centred downstream of the core
    const fy = -cx * 0.44 + cy * 0.9;
    z += toZ(38) * gauss(fx * fx * 0.15 + fy * fy, 6);
    const hx = sx - HOOK.x;
    const hy = sy - HOOK.y;
    const hr = Math.hypot(hx, hy);
    const ha = Math.atan2(hy, hx); // the hook curls round the south and west of the rotating updraft
    if (ha < 2.4 && ha > -2.6) {
        const along = (2.4 - ha) / 5; // 0 where the hook joins the core, 1 at its tip
        z += toZ(52 - 12 * along) * gauss((hr - HOOK.radius) ** 2, 1.4 - 0.5 * along);
    }
    // Showers
    for (const shower of SHOWERS) {
        const d2 = (sx - shower.x) ** 2 + (sy - shower.y) ** 2;
        if (d2 < 9 * shower.size * shower.size) z += toZ(shower.dbz) * gauss(d2, shower.size);
    }
    return z;
}

// Ground clutter: fixed echoes from buildings, trees and hills near the radar, which don't move with the weather
function clutterDbz(col, row) {
    const rangeKm = (row + 0.5) * GATE_KM;
    if (rangeKm > 14) return 0;
    const chance = 0.5 * Math.exp(-rangeKm / 5);
    return hash01(col, row, 7) < chance ? 20 + 28 * hash01(col, row, 8) : 0;
}

// Radial velocity (m/s, positive away from the radar) of the moving weather at a point
function weatherVelocity(x, y, t) {
    const sx = x - STORM_MOTION.x * t;
    const sy = y - STORM_MOTION.y * t;
    // Background wind from the west-south-west at 16 m/s, stronger behind the squall line (a rear inflow jet)
    let u = 14.5;
    let v = 6.5;
    const dx = sx - lineX(sy);
    if (dx < 0 && dx > -40 && Math.abs(sy) < 80) u += 11 * gauss((dx + 15) ** 2, 9);
    // The supercell's rotating updraft (a mesocyclone): a Rankine vortex turning anticlockwise, as in the northern hemisphere
    const hx = sx - HOOK.x;
    const hy = sy - HOOK.y + 1;
    const r = Math.hypot(hx, hy);
    const coreRadius = 3.5;
    const vt = r < coreRadius ? (30 * r) / coreRadius : (30 * coreRadius) / r;
    if (r > 0.01) {
        u += (-hy / r) * vt * Math.exp(-r / 12);
        v += (hx / r) * vt * Math.exp(-r / 12);
    }
    const dist = Math.hypot(x, y);
    return dist > 0 ? (u * x + v * y) / dist : 0;
}

// The controls, the readout, the chart and the colour key each need an element. This splits the page's div
// into them; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#22365B; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px;";
    bar.innerHTML =
        `<label><input type="radio" name="${divElementId}-mode" value="reflectivity" checked> Reflectivity (dBZ)</label>` +
        `<label><input type="radio" name="${divElementId}-mode" value="velocity"> Velocity (m/s)</label>` +
        `<label><input type="checkbox" data-id="sweep" checked> Sweep</label>` +
        `<span data-id="readout" aria-live="polite" style="flex-basis:100%; min-height:2.6em; color:#c8d3e8"></span>`;
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex;";
    const chartDiv = document.createElement("div");
    chartDiv.id = `${divElementId}-radar`;
    chartDiv.style.cssText = "flex:1; min-width:0; min-height:0;";
    const legend = document.createElement("div");
    legend.style.cssText = "flex:0 0 132px; padding:8px 8px 8px 4px; overflow:auto; font-size:12px; line-height:1.25;";
    body.append(chartDiv, legend);
    root.append(bar, body);
    const inputs = Array.from(bar.getElementsByTagName("input"));
    return {
        chartDiv,
        legend,
        modeInputs: inputs.filter((input) => input.type === "radio"),
        sweepInput: inputs.find((input) => input.type === "checkbox"),
        readout: bar.querySelector('span[data-id="readout"]')
    };
}

async function weatherRadarChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A simulated Doppler weather radar on a polar heatmap: reflectivity on the NWS colour scale or radial velocity,
    // with a rotating sweep line and a readout of the value under the mouse, charted with SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        EPolarAxisMode,
        EPolarLabelMode,
        NumberRange,
        EAutoRange,
        UniformHeatmapDataSeries,
        PolarUniformHeatmapRenderableSeries,
        HeatmapColorMap,
        PolarLineRenderableSeries,
        PolarColumnRenderableSeries,
        XyxDataSeries,
        EColumnMode,
        GradientParams,
        Point,
        XyDataSeries,
        CustomChartModifier2D,
        EModifierType,
        translateFromCanvasToSeriesViewRect,
        SciChartJsNavyTheme,
        PolarMouseWheelZoomModifier,
        PolarPanModifier,
        PolarZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartPolarSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(ui.chartDiv, {
        theme: new SciChartJsNavyTheme()
    });

    // Azimuth: 0° (north) at the top, increasing clockwise like a compass
    const azimuthAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, 360),
        autoRange: EAutoRange.Never,
        startAngle: Math.PI / 2,
        flippedCoordinates: true,
        autoTicks: false,
        majorDelta: 30,
        labelPrecision: 0,
        labelPostfix: "°",
        polarLabelMode: EPolarLabelMode.Horizontal,
        drawMinorGridLines: false,
        drawMajorBands: false,
        majorGridLineStyle: { strokeThickness: 1, color: "#FFFFFF33" }
    });
    // Range: distance from the radar along the beam
    const rangeAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, MAX_RANGE),
        autoRange: EAutoRange.Never,
        autoTicks: false,
        majorDelta: 25,
        labelPrecision: 0,
        labelPostfix: " km",
        startAngle: Math.PI / 2,
        drawMinorGridLines: false,
        drawMajorBands: false,
        majorGridLineStyle: { strokeThickness: 1, color: "#FFFFFF33" }
    });
    sciChartSurface.xAxes.add(azimuthAxis);
    sciChartSurface.yAxes.add(rangeAxis);

    // A stepped colour map: each 5 dBZ band gets one solid colour, as on a weather service radar display
    const span = DBZ_MAX - DBZ_MIN;
    const reflectivityColors = new HeatmapColorMap({
        minimum: DBZ_MIN,
        maximum: DBZ_MAX,
        gradientStops: DBZ_SCALE.flatMap((step, i) => {
            const from = (step.dbz - DBZ_MIN) / span;
            const to = i < DBZ_SCALE.length - 1 ? (DBZ_SCALE[i + 1].dbz - DBZ_MIN) / span - 0.0005 : 1;
            return [
                { offset: from, color: step.color },
                { offset: to, color: step.color }
            ];
        })
    });
    // Velocity: greens towards the radar (negative), reds away from it (positive), grey near zero
    const velocityColors = new HeatmapColorMap({
        minimum: -32,
        maximum: 32,
        gradientStops: [
            { offset: 0, color: "#B6FFB6" },
            { offset: 0.25, color: "#00D000" },
            { offset: 0.47, color: "#0B5E0B" },
            { offset: 0.5, color: "#808080" },
            { offset: 0.53, color: "#6E0B0B" },
            { offset: 0.75, color: "#E00000" },
            { offset: 1, color: "#FFB6B6" }
        ]
    });

    // One row per range gate, one column per degree. NaN means no echo, which draws nothing.
    // Float64Array rows are copied into the chart faster than plain arrays.
    const reflectivity = Array.from({ length: GATES }, () => new Float64Array(AZIMUTHS).fill(NaN));
    const velocity = Array.from({ length: GATES }, () => new Float64Array(AZIMUTHS).fill(NaN));
    const heatmapOptions = { xStart: 0, xStep: 360 / AZIMUTHS, yStart: 0, yStep: GATE_KM };
    const reflectivityData = new UniformHeatmapDataSeries(wasmContext, { ...heatmapOptions, zValues: reflectivity });
    const velocityData = new UniformHeatmapDataSeries(wasmContext, { ...heatmapOptions, zValues: velocity });
    reflectivityData.hasNaNs = true;
    velocityData.hasNaNs = true;
    const reflectivitySeries = new PolarUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: reflectivityData,
        colorMap: reflectivityColors,
        fillValuesOutOfRange: true
    });
    const velocitySeries = new PolarUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: velocityData,
        colorMap: velocityColors,
        fillValuesOutOfRange: true,
        isVisible: false
    });

    // The sweep line: the beam's current azimuth, from the radar to the edge of the image
    const sweepData = new XyDataSeries(wasmContext, { xValues: [0, 0], yValues: [0, MAX_RANGE] });
    const sweepGlow = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: sweepData,
        stroke: "#7CFFB2",
        strokeThickness: 8,
        opacity: 0.25
    });
    const sweepLine = new PolarLineRenderableSeries(wasmContext, { dataSeries: sweepData, stroke: "#C9FFE0", strokeThickness: 2 });
    // The glow behind the sweep: one polar column, a wedge from SWEEP_GLOW_DEG behind the line up to the line,
    // filled with a gradient from see-through to a soft green, so the weather still shows through
    // Two copies of the wedge, one turn apart: the chart only draws 0° to 360°, so when the wedge crosses north
    // the first copy draws the part after 0° and the second the part before 360°
    const glowData = new XyxDataSeries(wasmContext, {
        xValues: [-SWEEP_GLOW_DEG, 360 - SWEEP_GLOW_DEG],
        x1Values: [0, 360],
        yValues: [MAX_RANGE, MAX_RANGE]
    });
    const sweepWedge = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: glowData,
        columnXMode: EColumnMode.StartEnd, // x is where the wedge starts, x1 where it ends
        strokeThickness: 0,
        // The gradient runs around the circle across the column. The azimuth axis is flipped (clockwise, like a compass),
        // so offset 0 is the sweep line's end: bright there, fading to clear SWEEP_GLOW_DEG behind it
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(1, 0), [
            { offset: 0, color: "#7CFFB270" },
            { offset: 0.5, color: "#7CFFB21C" },
            { offset: 1, color: "#7CFFB200" }
        ])
    });
    function moveSweepWedge(sweepAngle) {
        glowData.updateXyz(0, sweepAngle - SWEEP_GLOW_DEG, MAX_RANGE, sweepAngle);
        glowData.updateXyz(1, sweepAngle - SWEEP_GLOW_DEG + 360, MAX_RANGE, sweepAngle + 360);
    }
    moveSweepWedge(0);
    sciChartSurface.renderableSeries.add(reflectivitySeries, velocitySeries, sweepWedge, sweepGlow, sweepLine);

    // Fill in the beams between two azimuths with the weather at time t (minutes), as the antenna passes over them
    function scanColumns(fromCol, toCol, t, scanNumber) {
        for (let k = fromCol; k < toCol; k++) {
            const col = ((k % AZIMUTHS) + AZIMUTHS) % AZIMUTHS;
            const azimuth = ((col + 0.5) * Math.PI) / 180;
            for (let row = 0; row < GATES; row++) {
                const rangeKm = (row + 0.5) * GATE_KM;
                const x = rangeKm * Math.sin(azimuth); // east
                const y = rangeKm * Math.cos(azimuth); // north
                const weatherZ = weatherDbz(x, y, t);
                const clutter = clutterDbz(col, row);
                const total = weatherZ + (clutter > 0 ? toZ(clutter) : 0);
                if (total <= 0) {
                    reflectivity[row][col] = NaN;
                    velocity[row][col] = NaN;
                    continue;
                }
                // Measurement noise of about ±1 dB, different on each scan
                const dbz = toDbz(total) + 2 * (hash01(col, row, scanNumber) - 0.5);
                if (dbz < DBZ_MIN) {
                    reflectivity[row][col] = NaN;
                    velocity[row][col] = NaN;
                    continue;
                }
                reflectivity[row][col] = dbz;
                // Clutter that outweighs the weather doesn't move, so it reads close to 0 m/s
                const v = clutter > 0 && toZ(clutter) > weatherZ ? 0 : weatherVelocity(x, y, t);
                velocity[row][col] = Math.max(-32, Math.min(32, v + 2 * (hash01(col, row, scanNumber + 999) - 0.5)));
            }
        }
    }

    // Draw a complete first scan, so the image is full before the sweep starts
    const minutesAt = (scan, fraction) => ((scan % LOOP_SWEEPS) + fraction) * MINUTES_PER_SWEEP - (LOOP_SWEEPS * MINUTES_PER_SWEEP) / 2;
    scanColumns(0, AZIMUTHS, minutesAt(0, 0), 0);
    reflectivityData.setZValues(reflectivity);
    velocityData.setZValues(velocity);

    sciChartSurface.chartModifiers.add(new PolarMouseWheelZoomModifier(), new PolarPanModifier(), new PolarZoomExtentsModifier());

    // --- Readout: the value under the mouse, what it means, and how high the beam is there ---
    let mode = "reflectivity";
    let lastMouse = null;
    const defaultText = "Hover over the radar image to read the value at that point.";
    ui.readout.textContent = defaultText;
    function showReadout() {
        if (!lastMouse) {
            ui.readout.textContent = defaultText;
            return;
        }
        const { azimuth, rangeKm } = lastMouse;
        const col = Math.floor((((azimuth % 360) + 360) % 360) / (360 / AZIMUTHS)) % AZIMUTHS;
        const row = Math.floor(rangeKm / GATE_KM);
        if (row < 0 || row >= GATES) {
            ui.readout.textContent = defaultText;
            return;
        }
        const where =
            `Azimuth ${Math.round(azimuth) % 360}°, range ${rangeKm.toFixed(0)} km (${(rangeKm / 1.609).toFixed(0)} mi), ` +
            `beam centre ${beamHeightKm(rangeKm).toFixed(1)} km above the radar: `;
        if (mode === "reflectivity") {
            const value = reflectivity[row][col];
            if (Number.isNaN(value)) {
                ui.readout.textContent = where + "no echo.";
                return;
            }
            const dbz = Math.round(value);
            const step = DBZ_SCALE.filter((s) => s.dbz <= dbz).pop();
            ui.readout.textContent = `${where}${dbz} dBZ, ${step.name}: ${meaningOfDbz(dbz)}.`;
        } else {
            const v = velocity[row][col];
            if (Number.isNaN(v)) {
                ui.readout.textContent = where + "no echo, so no velocity.";
                return;
            }
            const direction = Math.abs(v) < 1 ? "almost no motion along the beam" : v < 0 ? "towards the radar" : "away from the radar";
            ui.readout.textContent = `${where}${v.toFixed(0)} m/s (${Math.abs(v * 2.237).toFixed(0)} mph) ${direction}.`;
        }
    }

    // A custom modifier turns the mouse position into azimuth and range with the polar axes' own transforms
    class RadarReadoutModifier extends CustomChartModifier2D {
        // Tells the polar surface that this modifier works with polar charts
        get modifierType() {
            return EModifierType.Chart2DPolarModifier;
        }
        modifierMouseMove(args) {
            super.modifierMouseMove(args);
            const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            if (!point) {
                lastMouse = null;
            } else {
                const polar = azimuthAxis.reverseTransform(point.x, point.y);
                const azimuth = azimuthAxis.getCurrentCoordinateCalculator().getDataValue(polar.x);
                const rangeKm = rangeAxis.getCurrentCoordinateCalculator().getDataValue(polar.y);
                lastMouse = rangeKm >= 0 && rangeKm <= MAX_RANGE ? { azimuth, rangeKm } : null;
            }
            showReadout();
        }
        modifierMouseLeave(args) {
            super.modifierMouseLeave(args);
            lastMouse = null;
            showReadout();
        }
    }
    sciChartSurface.chartModifiers.add(new RadarReadoutModifier());

    // --- Colour key ---
    function drawLegend() {
        const row = (color, label) =>
            `<div style="display:flex; align-items:center; gap:6px; margin:1px 0">` +
            `<span style="flex:0 0 18px; height:14px; background:${color}; border:1px solid #ffffff33"></span>${label}</div>`;
        if (mode === "reflectivity") {
            ui.legend.innerHTML =
                `<div style="font-weight:600; margin-bottom:4px">Reflectivity (dBZ)</div>` +
                DBZ_SCALE.slice()
                    .reverse()
                    .map((s, i) => row(s.color, i === 0 ? `${s.dbz}+` : `${s.dbz} to ${s.dbz + 4}`))
                    .join("") +
                `<div style="margin-top:6px; color:#c8d3e8">Green: light rain. Yellow to red: heavy rain. Pink, purple, white: hail likely.</div>`;
        } else {
            const stops = [-30, -20, -10, -3, 0, 3, 10, 20, 30];
            ui.legend.innerHTML =
                `<div style="font-weight:600; margin-bottom:4px">Velocity (m/s)</div>` +
                stops
                    .slice()
                    .reverse()
                    .map((v) => row(velocityColor(v), `${v > 0 ? "+" : ""}${v}`))
                    .join("") +
                `<div style="margin-top:6px; color:#c8d3e8">Green: towards the radar. Red: away from it. A tight green–red pair is rotation.</div>`;
        }
    }
    // The key's swatches use the same stops as the velocity colour map
    function velocityColor(v) {
        const stops = velocityColors.gradientStops;
        const offset = (v + 32) / 64;
        for (let i = 1; i < stops.length; i++) {
            if (offset <= stops[i].offset) {
                const a = stops[i - 1];
                const b = stops[i];
                const f = (offset - a.offset) / (b.offset - a.offset || 1);
                const mix = (k) =>
                    Math.round(parseInt(a.color.substr(k, 2), 16) * (1 - f) + parseInt(b.color.substr(k, 2), 16) * f)
                        .toString(16)
                        .padStart(2, "0");
                return `#${mix(1)}${mix(3)}${mix(5)}`;
            }
        }
        return stops[stops.length - 1].color;
    }
    drawLegend();

    // --- Controls ---
    for (const input of ui.modeInputs) {
        input.addEventListener("change", () => {
            mode = ui.modeInputs.find((i) => i.checked).value;
            reflectivitySeries.isVisible = mode === "reflectivity";
            velocitySeries.isVisible = mode === "velocity";
            drawLegend();
            showReadout();
        });
    }

    // --- The sweep: the antenna turns, and each beam is redrawn with the latest weather as it passes ---
    let scan = 0;
    let sweepCol = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let sinceHeatmap = 0; // ms since the heatmap was last sent to the chart
    function animate(now) {
        if (sciChartSurface.isDeleted) return;
        if (ui.sweepInput.checked) {
            const dt = Math.min(now - lastTime, 100);
            elapsed += dt;
            sinceHeatmap += dt;
            // Performance: every heatmap update makes SciChart re-process the whole grid, however few cells changed.
            // So the cheap parts (the sweep line and its glow) move every frame, and the heatmap is updated
            // HEATMAP_UPDATES_PER_SECOND times a second. For large grids (a million cells or more), use 15.
            const angle = ((elapsed / 1000 / SWEEP_SECONDS) * 360) % 360;
            sweepData.clear();
            sweepData.appendRange([angle, angle], [0, MAX_RANGE]);
            moveSweepWedge(angle);
            const targetCol = Math.floor((elapsed / 1000 / SWEEP_SECONDS) * AZIMUTHS);
            if (sinceHeatmap >= 1000 / HEATMAP_UPDATES_PER_SECOND && targetCol > sweepCol) {
                sinceHeatmap = 0;
                const fromCol = sweepCol;
                const firstScan = Math.floor(fromCol / AZIMUTHS);
                scan = Math.floor(targetCol / AZIMUTHS);
                // Split at the end of each turn, so each turn uses its own scan time
                for (let s = firstScan; s <= scan; s++) {
                    const a = Math.max(fromCol, s * AZIMUTHS);
                    const b = Math.min(targetCol, (s + 1) * AZIMUTHS);
                    if (b > a) scanColumns(a, b, minutesAt(s, (a % AZIMUTHS) / AZIMUTHS), s);
                }
                sweepCol = targetCol;
                if (mode === "reflectivity") reflectivityData.setZValues(reflectivity);
                else velocityData.setZValues(velocity);
                showReadout();
            }
        }
        lastTime = now;
        requestAnimationFrame(animate);
    }
    // The hidden series catches up when it is shown
    for (const input of ui.modeInputs) {
        input.addEventListener("change", () => {
            if (mode === "reflectivity") reflectivityData.setZValues(reflectivity);
            else velocityData.setZValues(velocity);
        });
    }
    sweepLine.isVisible = sweepGlow.isVisible = sweepWedge.isVisible = true;
    ui.sweepInput.addEventListener("change", () => {
        sweepLine.isVisible = sweepGlow.isVisible = sweepWedge.isVisible = ui.sweepInput.checked;
    });
    requestAnimationFrame(animate);
    // #region_A_end
}

weatherRadarChart("scichart-root");
