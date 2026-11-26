import * as SciChart from "scichart";

// A simulated sonar on a stopped vessel, drawn two ways:
// 1. an active scanning sonar, as a polar heatmap: the vessel at the centre, bearing around the circle (0° is the bow,
//    at the top) and range outwards. A beam turns round the vessel, and each pass paints the echo strength it hears,
//    which then fades slowly, as on a real scanning sonar display.
// 2. a passive sonar waterfall (bearing-time display), as a heatmap: bearing across, time scrolling down, and the
//    brightness of each cell is how much noise arrives from that bearing.
// The scene is synthetic: a sloping seabed, a wreck with its acoustic shadow, a fish school, surface reverberation,
// and one submerged contact passing down the starboard side. A seeded generator makes it the same every time.
// Time is sped up: each turn of the sweep stands for 30 seconds.
const BEARINGS = 360; // one column per degree of bearing
const GATES = 250; // range cells along each beam
const GATE_M = 4; // so the display reaches 1,000 m
const MAX_RANGE = GATES * GATE_M;
const SOUND_SPEED = 1500; // m/s, a typical value for seawater
const SWEEP_SECONDS = 4; // one turn of the beam on screen
const SIM_SECONDS_PER_SWEEP = 30; // the time one turn stands for
const ECHO_MAX = 40; // top of the colour scale, dB above the noise floor
const SWEEP_GLOW_DEG = 60; // the glow behind the sweep line fades out over this many degrees
const FADE_DB = 16; // how much an echo dims over one turn
const TRAIL_DB = 9; // how much an old echo dims each time the beam repaints it, leaving a short trail behind a mover

// The seabed and the beam
const SONAR_DEPTH = 3; // m, the transducer below the hull
const BEAM_TILT = (4 * Math.PI) / 180; // the beam points 4° down
const BASE_DEPTH = 45; // m of water under the vessel
const SLOPE = 0.015; // the seabed rises 1.5 m per 100 m towards the bow
const seabedDepth = (y) => BASE_DEPTH - SLOPE * y; // y: metres ahead of the vessel

// Passive sonar waterfall
const WF_BINS = 360; // one bin per degree of bearing
const WF_ROWS = 180;
const WF_DT = 5; // simulated seconds per row, so the waterfall holds 15 minutes

// The moving contact: it runs south (from ahead to astern) 350 m off the starboard side at 3 m/s (about 6 knots)
const CONTACT = { cpa: 350, startY: 2000, speed: 3, depth: 20 };
const CONTACT_LOOP = (2 * CONTACT.startY) / CONTACT.speed; // seconds for one run; then it starts again
const START_TIME = (CONTACT.startY - 300) / CONTACT.speed; // begin with the contact 300 m ahead

// What each kind of echo is, for the readout
const SRC = { WATER: 0, SURFACE: 1, SEABED: 2, SHADOW: 3, WRECK: 4, FISH: 5, CONTACT: 6, TRAIL: 7 };
const SRC_TEXT = [
    "water column: background noise only",
    "surface reverberation: sound scattered back by the sea surface and bubbles close to the vessel",
    "seabed: bottom reverberation, starting where the downward-tilted beam meets the bottom",
    "acoustic shadow: the wreck blocks the sound, so the seabed behind it returns nothing",
    "wreck: a strong, hard echo standing up from the seabed",
    "fish school: a patchy, mid-water cloud of weaker echoes",
    "submerged contact: a compact, strong mid-water echo that moves between sweeps",
    "trail: where the contact was on earlier sweeps, fading"
];

// A repeatable pseudo-random number in [0, 1) for one cell, so speckle is the same on every load
function hash01(i, j, k) {
    let h = Math.imul(i + 1, 374761393) ^ Math.imul(j + 1, 668265263) ^ Math.imul(k + 1, 2246822519);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
// Smooth noise for the seabed's texture: random values on a grid, blended between grid points
function smoothNoise(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const fx = x - xi;
    const fy = y - yi;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const v = (a, b) => hash01(xi + a + 5000, yi + b + 5000, 11);
    return (v(0, 0) * (1 - sx) + v(1, 0) * sx) * (1 - sy) + (v(0, 1) * (1 - sx) + v(1, 1) * sx) * sy;
}
const gauss = (d, sigma) => Math.exp(-(d * d) / (2 * sigma * sigma));
// Echo levels in dB add as powers
const addDb = (a, b) => 10 * Math.log10(Math.pow(10, a / 10) + Math.pow(10, b / 10));
const wrapDeg = (d) => ((((d + 180) % 360) + 360) % 360) - 180;
const toXY = (bearingDeg, range) => {
    const b = (bearingDeg * Math.PI) / 180;
    return { x: range * Math.sin(b), y: range * Math.cos(b) }; // x to starboard, y ahead
};

// Where the beam first meets the seabed on each bearing: the beam is at depth SONAR_DEPTH + r tan(tilt),
// and the seabed at BASE_DEPTH - SLOPE r cos(bearing)
const bottomRange = Array.from({ length: BEARINGS }, (_, col) => {
    const b = ((col + 0.5) * Math.PI) / 180;
    return (BASE_DEPTH - SONAR_DEPTH) / (Math.tan(BEAM_TILT) + SLOPE * Math.cos(b));
});

// The wreck: a hull 55 m long and 10 m wide, standing 7 m off the seabed, at bearing 230°, 760 m
const WRECK = { ...toXY(230, 760), length: 55, width: 10, height: 7, heading: (140 * Math.PI) / 180 }; // lying across the beam
const wreckCells = new Set(); // "row,col" of every cell the wreck fills
const wreckFar = new Array(BEARINGS).fill(0); // the far edge of the wreck on each bearing
for (let col = 0; col < BEARINGS; col++) {
    for (let row = 0; row < GATES; row++) {
        const { x, y } = toXY(col + 0.5, (row + 0.5) * GATE_M);
        const dx = x - WRECK.x;
        const dy = y - WRECK.y;
        const along = dx * Math.sin(WRECK.heading) + dy * Math.cos(WRECK.heading);
        const across = dx * Math.cos(WRECK.heading) - dy * Math.sin(WRECK.heading);
        if (Math.abs(along) <= WRECK.length / 2 + 2 && Math.abs(across) <= WRECK.width / 2 + 2) {
            wreckCells.add(row * BEARINGS + col);
            wreckFar[col] = Math.max(wreckFar[col], (row + 1) * GATE_M);
        }
    }
}
// Shadow length: with the sonar H above the seabed, an object h high at range R hides L = h R / (H - h) behind it
const wreckShadow = wreckFar.map((r) => {
    const H = seabedDepth(WRECK.y) - SONAR_DEPTH;
    return r > 0 ? (WRECK.height * r) / (H - WRECK.height) : 0;
});

// Moving things, at simulated time t (seconds)
function contactAt(t) {
    const tl = ((t % CONTACT_LOOP) + CONTACT_LOOP) % CONTACT_LOOP;
    const x = CONTACT.cpa;
    const y = CONTACT.startY - CONTACT.speed * tl;
    let bearing = (Math.atan2(x, y) * 180) / Math.PI;
    if (bearing < 0) bearing += 360;
    return { x, y, range: Math.hypot(x, y), bearing };
}
function fishAt(t) {
    const tl = ((t % 3600) + 3600) % 3600;
    const base = toXY(320, 300);
    return { x: base.x + 0.08 * tl, y: base.y + 0.03 * tl, radius: 45 };
}
const DISTANT_SHIP = (t) => 300 + 6 * Math.sin((2 * Math.PI * t) / 3000); // bearing of a ship well beyond active range

// The echo (dB above the noise floor) and what caused it, for one cell, as the beam passes at time t
function activeEcho(col, row, t, sweep) {
    const bearing = col + 0.5;
    const range = (row + 0.5) * GATE_M;
    const { x, y } = toXY(bearing, range);
    let db = 1 + 5 * hash01(col, row, sweep); // noise floor speckle
    let src = SRC.WATER;
    // Surface reverberation close to the vessel
    if (range < 150) {
        const surface = 30 * Math.exp(-range / 45) + 4 * hash01(col, row, sweep + 77);
        if (surface > db) src = SRC.SURFACE;
        db = addDb(db, surface);
    }
    // Seabed: strongest where the beam first meets it, weaker further out, with rough and smooth patches
    const rb = bottomRange[col];
    if (range > rb - 12) {
        const onset = Math.min(1, (range - (rb - 12)) / 16);
        let seabed = 21 - 0.012 * (range - rb) + 9 * (smoothNoise(x / 45, y / 45) - 0.5) + 5 * (hash01(col, row, sweep + 3) - 0.5);
        seabed += 7 * gauss(range - rb, 10); // the first bottom return
        seabed = Math.max(0, seabed * onset);
        const inShadow = wreckFar[col] > 0 && range > wreckFar[col] && range < wreckFar[col] + wreckShadow[col];
        if (inShadow) {
            src = SRC.SHADOW;
            db = 1 + 3 * hash01(col, row, sweep + 5);
        } else if (seabed > db) {
            db = addDb(db, seabed);
            src = SRC.SEABED;
        }
    }
    // The wreck
    if (wreckCells.has(row * BEARINGS + col)) {
        db = 34 + 6 * hash01(col, row, sweep + 9);
        src = SRC.WRECK;
    }
    // The fish school: a patchy cloud in mid-water
    const fish = fishAt(t);
    const fd = Math.hypot(x - fish.x, (y - fish.y) * 1.4);
    if (fd < fish.radius && hash01(col, row, sweep + 21) > 0.3) {
        const level = 22 + 12 * hash01(col, row, sweep + 22) * (1 - fd / fish.radius / 2);
        if (level > db) {
            db = addDb(db, level);
            src = SRC.FISH;
        }
    }
    // The submerged contact, about 60 m long, smeared a little more by the beam width and the pulse length
    const c = contactAt(t);
    if (c.range < MAX_RANGE) {
        const level = 40 * gauss(wrapDeg(bearing - c.bearing) * c.range * (Math.PI / 180), 22) * gauss(range - c.range, 7);
        if (level > 6 && level > db - 3) {
            db = addDb(db, level);
            src = SRC.CONTACT;
        }
    }
    return { db: Math.min(ECHO_MAX, db), src };
}

// The noise level (dB) arriving from one bearing at time t on the passive array, and what dominates it
function passiveLevel(bin, t, rowSeed) {
    const bearing = bin + 0.5;
    let db = 6 + 6 * hash01(bin, rowSeed, 31); // ambient sea noise
    let src = "background sea noise";
    const baffles = 20 * gauss(wrapDeg(bearing - 180), 14);
    if (baffles > db) src = "own-ship noise: the baffles astern, where the array is deaf";
    db = addDb(db, baffles);
    const ship = 24 * gauss(wrapDeg(bearing - DISTANT_SHIP(t)), 2.5);
    if (ship > db) src = "a distant ship, far beyond active range, on a nearly steady bearing";
    db = addDb(db, ship);
    const c = contactAt(t);
    const level = Math.max(0, 34 - 20 * Math.log10(c.range / 300)) * gauss(wrapDeg(bearing - c.bearing), 2);
    if (level > db) src = "the submerged contact: its bearing changes fastest as it passes closest";
    db = addDb(db, level);
    return { db, src };
}

// The controls, readout and charts each need an element. This splits the page's div into them;
// in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#22365B; color:#ffffff; overflow:auto;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px;";
    bar.innerHTML =
        `<button type="button" data-id="pause" style="font:inherit; padding:2px 12px; border-radius:12px; border:1px solid #ffffff66; background:#ffffff14; color:#fff; cursor:pointer">Pause</button>` +
        `<span>Echo: weak <span style="display:inline-block; width:90px; height:10px; vertical-align:middle; background:linear-gradient(90deg,#0B1E3F,#126E86,#3FBF7F,#F2D24B,#FF8A3D,#FFF4E6)"></span> strong</span>` +
        `<span>Noise: quiet <span style="display:inline-block; width:90px; height:10px; vertical-align:middle; background:linear-gradient(90deg,#06180E,#0F5A30,#33B864,#C4F7D2)"></span> loud</span>` +
        `<span>Simulated data</span>` +
        `<span data-id="readout" aria-live="polite" style="flex-basis:100%; min-height:2.6em; color:#c8d3e8"></span>`;
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const panel = (title) => {
        const div = document.createElement("div");
        div.style.cssText = "flex:1 1 340px; min-width:0; min-height:320px; display:flex; flex-direction:column;";
        const heading = document.createElement("div");
        heading.textContent = title;
        heading.style.cssText = "padding:2px 12px; font-weight:600;";
        const chart = document.createElement("div");
        chart.style.cssText = "flex:1; min-height:0;";
        div.append(heading, chart);
        body.append(div);
        return chart;
    };
    const ppiDiv = panel("Active scanning sonar: echo strength by bearing and range");
    const waterfallDiv = panel("Passive sonar waterfall: noise by bearing over time");
    ppiDiv.id = `${divElementId}-ppi`;
    waterfallDiv.id = `${divElementId}-waterfall`;
    root.append(bar, body);
    return {
        ppiDiv,
        waterfallDiv,
        pauseButton: bar.querySelector('button[data-id="pause"]'),
        readout: bar.querySelector('span[data-id="readout"]')
    };
}

async function sonarDisplays(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A sweeping sonar display drawn as a polar heatmap, and a passive sonar waterfall drawn as a scrolling heatmap,
    // with a readout of the value under the mouse, charted with SciChart.js
    const {
        SciChartPolarSurface,
        SciChartSurface,
        PolarNumericAxis,
        NumericAxis,
        EPolarAxisMode,
        EPolarLabelMode,
        EAxisAlignment,
        NumberRange,
        EAutoRange,
        UniformHeatmapDataSeries,
        PolarUniformHeatmapRenderableSeries,
        UniformHeatmapRenderableSeries,
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
        PolarZoomExtentsModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartPolarSurface, ... } from "scichart"

    // --- 1. The active scanning sonar: a polar heatmap ---
    const { sciChartSurface: ppi, wasmContext } = await SciChartPolarSurface.create(ui.ppiDiv, {
        theme: new SciChartJsNavyTheme()
    });
    // Bearing relative to the bow: 0° at the top, increasing clockwise
    const bearingAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, 360),
        autoRange: EAutoRange.Never,
        startAngle: Math.PI / 2,
        flippedCoordinates: true,
        autoTicks: false,
        majorDelta: 30,
        polarLabelMode: EPolarLabelMode.Horizontal,
        drawMinorGridLines: false,
        drawMajorBands: false,
        majorGridLineStyle: { strokeThickness: 1, color: "#FFFFFF2E" }
    });
    // Three-digit bearings, as sonar operators read them (000°, 030°, ...)
    bearingAxis.labelProvider.formatLabel = (value) => (value >= 359.5 ? "" : `${Math.round(value).toString().padStart(3, "0")}°`);
    // Range from the vessel: the circular grid lines are the range rings
    const rangeAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, MAX_RANGE),
        autoRange: EAutoRange.Never,
        autoTicks: false,
        majorDelta: 200,
        labelPrecision: 0,
        labelPostfix: " m",
        startAngle: Math.PI / 2,
        drawMinorGridLines: false,
        drawMajorBands: false,
        majorGridLineStyle: { strokeThickness: 1, color: "#FFFFFF2E" }
    });
    ppi.xAxes.add(bearingAxis);
    ppi.yAxes.add(rangeAxis);

    // A dark-to-amber colour map: weak echoes in deep blue, strong ones in yellow, orange and white
    const echoColors = new HeatmapColorMap({
        minimum: 0,
        maximum: ECHO_MAX,
        gradientStops: [
            { offset: 0, color: "#0B1E3F" },
            { offset: 0.25, color: "#126E86" },
            { offset: 0.5, color: "#3FBF7F" },
            { offset: 0.7, color: "#F2D24B" },
            { offset: 0.85, color: "#FF8A3D" },
            { offset: 1, color: "#FFF4E6" }
        ]
    });
    // raw: the echo each cell held when the beam last passed; shown: raw, dimmed by how long ago that was
    const raw = Array.from({ length: GATES }, () => new Array(BEARINGS).fill(0));
    const source = Array.from({ length: GATES }, () => new Array(BEARINGS).fill(SRC.WATER));
    const shown = Array.from({ length: GATES }, () => new Array(BEARINGS).fill(0));
    const echoData = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 360 / BEARINGS,
        yStart: 0,
        yStep: GATE_M,
        zValues: shown
    });
    const echoSeries = new PolarUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: echoData,
        colorMap: echoColors,
        fillValuesOutOfRange: true
    });
    // The sweep line: the beam's current bearing, with a soft glow
    const sweepData = new XyDataSeries(wasmContext, { xValues: [0, 0], yValues: [0, MAX_RANGE] });
    const sweepGlow = new PolarLineRenderableSeries(wasmContext, { dataSeries: sweepData, stroke: "#FFD27A", strokeThickness: 8, opacity: 0.3 });
    const sweepLine = new PolarLineRenderableSeries(wasmContext, { dataSeries: sweepData, stroke: "#FFF4E6", strokeThickness: 2 });
    // The glow behind the sweep: one polar column, a wedge from SWEEP_GLOW_DEG behind the line up to the line,
    // filled with a gradient from soft amber at the line to clear, so the echoes still show through.
    // Two copies, one turn apart: the chart only draws 0° to 360°, so when the wedge crosses north
    // the first copy draws the part after 0° and the second the part before 360°.
    const glowData = new XyxDataSeries(wasmContext, {
        xValues: [-SWEEP_GLOW_DEG, 360 - SWEEP_GLOW_DEG],
        x1Values: [0, 360],
        yValues: [MAX_RANGE, MAX_RANGE]
    });
    const sweepWedge = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: glowData,
        columnXMode: EColumnMode.StartEnd, // x is where the wedge starts, x1 where it ends
        strokeThickness: 0,
        // The gradient runs around the circle across the column. The bearing axis is flipped (clockwise, like a compass),
        // so offset 0 is the sweep line's end
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(1, 0), [
            { offset: 0, color: "#FFD27A70" },
            { offset: 0.5, color: "#FFD27A1C" },
            { offset: 1, color: "#FFD27A00" }
        ])
    });
    function moveSweepWedge(angle) {
        glowData.updateXyz(0, angle - SWEEP_GLOW_DEG, MAX_RANGE, angle);
        glowData.updateXyz(1, angle - SWEEP_GLOW_DEG + 360, MAX_RANGE, angle + 360);
    }
    ppi.renderableSeries.add(echoSeries, sweepWedge, sweepGlow, sweepLine);
    ppi.chartModifiers.add(new PolarMouseWheelZoomModifier(), new PolarPanModifier(), new PolarZoomExtentsModifier());

    // Paint the beams between two columns of the endless sweep (column k is bearing k mod 360 on turn k / 360)
    const simTimeAt = (k) => START_TIME + (k / BEARINGS - 4) * SIM_SECONDS_PER_SWEEP;
    function paint(fromK, toK) {
        for (let k = fromK; k < toK; k++) {
            const col = ((k % BEARINGS) + BEARINGS) % BEARINGS;
            const sweep = Math.floor(k / BEARINGS);
            const t = simTimeAt(k);
            for (let row = 0; row < GATES; row++) {
                const echo = activeEcho(col, row, t, sweep);
                const persisted = raw[row][col] - TRAIL_DB;
                if (echo.db >= persisted) {
                    raw[row][col] = echo.db;
                    source[row][col] = echo.src;
                } else {
                    raw[row][col] = persisted;
                    if (source[row][col] === SRC.CONTACT) source[row][col] = SRC.TRAIL;
                }
            }
        }
    }
    // Dim each column by how long ago the beam passed it
    function updateShown(sweepK) {
        for (let col = 0; col < BEARINGS; col++) {
            const age = (((sweepK - col) % BEARINGS) + BEARINGS) % BEARINGS / BEARINGS;
            const dim = FADE_DB * age;
            for (let row = 0; row < GATES; row++) shown[row][col] = Math.max(0, raw[row][col] - dim);
        }
        echoData.setZValues(shown);
        const angle = ((sweepK % BEARINGS) * 360) / BEARINGS;
        sweepData.clear();
        sweepData.appendRange([angle, angle], [0, MAX_RANGE]);
        moveSweepWedge(angle);
    }

    // --- 2. The passive sonar waterfall: a heatmap that scrolls down ---
    const { sciChartSurface: waterfall } = await SciChartSurface.create(ui.waterfallDiv, {
        theme: new SciChartJsNavyTheme()
    });
    waterfall.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Bearing (degrees from the bow)",
            axisAlignment: EAxisAlignment.Top,
            visibleRange: new NumberRange(0, 360),
            autoRange: EAutoRange.Never,
            autoTicks: false,
            majorDelta: 45,
            minorDelta: 15,
            labelPrecision: 0
        })
    );
    waterfall.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Minutes ago",
            axisAlignment: EAxisAlignment.Left,
            flippedCoordinates: true, // newest at the top
            visibleRange: new NumberRange(0, (WF_ROWS * WF_DT) / 60),
            autoRange: EAutoRange.Never,
            labelPrecision: 0
        })
    );
    const noiseColors = new HeatmapColorMap({
        minimum: 6,
        maximum: 36,
        gradientStops: [
            { offset: 0, color: "#06180E" },
            { offset: 0.35, color: "#0F5A30" },
            { offset: 0.7, color: "#33B864" },
            { offset: 1, color: "#C4F7D2" }
        ]
    });
    // Row 0 is the newest; each new row pushes the others down
    const rows = [];
    const rowTimes = [];
    const addRow = (t, seed) => {
        rows.unshift(Array.from({ length: WF_BINS }, (_, bin) => passiveLevel(bin, t, seed).db));
        rowTimes.unshift({ t, seed });
        if (rows.length > WF_ROWS) {
            rows.pop();
            rowTimes.pop();
        }
    };
    const waterfallData = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 360 / WF_BINS,
        yStart: 0,
        yStep: WF_DT / 60,
        zValues: [new Array(WF_BINS).fill(0)]
    });
    waterfall.renderableSeries.add(
        new UniformHeatmapRenderableSeries(wasmContext, { dataSeries: waterfallData, colorMap: noiseColors, fillValuesOutOfRange: true })
    );
    waterfall.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());

    // --- Start with full displays: four turns of history on the scanning sonar, 15 minutes on the waterfall ---
    let sweepK = 4 * BEARINGS;
    paint(0, sweepK);
    updateShown(sweepK);
    let rowCount = 0;
    const t0 = simTimeAt(sweepK);
    for (let i = WF_ROWS - 1; i >= 0; i--) addRow(t0 - i * WF_DT, rowCount++);
    waterfallData.setZValues(rows);

    // --- Readout: what is under the mouse on either display ---
    let hover = null;
    const defaultText = "Hover over either display to read the bearing, range or time, and the signal there.";
    function showReadout() {
        if (!hover) {
            ui.readout.textContent = defaultText;
        } else if (hover.kind === "ppi") {
            const col = Math.floor((((hover.bearing % 360) + 360) % 360) / (360 / BEARINGS)) % BEARINGS;
            const row = Math.min(GATES - 1, Math.floor(hover.range / GATE_M));
            const ms = ((2 * hover.range) / SOUND_SPEED) * 1000;
            ui.readout.textContent =
                `Bearing ${String(Math.round(hover.bearing) % 360).padStart(3, "0")}°, range ${hover.range.toFixed(0)} m ` +
                `(echo back after ${ms.toFixed(0)} ms), echo ${raw[row][col].toFixed(0)} dB: ${SRC_TEXT[source[row][col]]}.`;
        } else {
            const row = Math.floor(hover.minutes / (WF_DT / 60));
            const bin = Math.floor(hover.bearing / (360 / WF_BINS));
            if (row < 0 || row >= rows.length || bin < 0 || bin >= WF_BINS) {
                ui.readout.textContent = defaultText;
                return;
            }
            const { t, seed } = rowTimes[row];
            const level = passiveLevel(bin, t, seed);
            ui.readout.textContent =
                `Bearing ${String(bin).padStart(3, "0")}°, ${hover.minutes.toFixed(1)} minutes ago, ` +
                `noise ${level.db.toFixed(0)} dB: ${level.src}.`;
        }
    }
    // A custom modifier turns the mouse position into chart values, with the polar axes' own transform on the sonar
    function createReadoutModifier(kind) {
        class SonarReadoutModifier extends CustomChartModifier2D {
            // Tells the polar surface that this modifier works with polar charts
            get modifierType() {
                return kind === "ppi" ? EModifierType.Chart2DPolarModifier : EModifierType.Chart2DModifier;
            }
            modifierMouseMove(args) {
                super.modifierMouseMove(args);
                const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
                hover = null;
                if (point && kind === "ppi") {
                    const polar = bearingAxis.reverseTransform(point.x, point.y);
                    const bearing = bearingAxis.getCurrentCoordinateCalculator().getDataValue(polar.x);
                    const range = rangeAxis.getCurrentCoordinateCalculator().getDataValue(polar.y);
                    if (range >= 0 && range <= MAX_RANGE) hover = { kind, bearing, range };
                } else if (point) {
                    const bearing = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(point.x);
                    const minutes = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator().getDataValue(point.y);
                    hover = { kind, bearing, minutes };
                }
                showReadout();
            }
            modifierMouseLeave(args) {
                super.modifierMouseLeave(args);
                hover = null;
                showReadout();
            }
        }
        return new SonarReadoutModifier();
    }
    ppi.chartModifiers.add(createReadoutModifier("ppi"));
    waterfall.chartModifiers.add(createReadoutModifier("waterfall"));
    showReadout();

    // --- The animation: the beam turns, painting each bearing as it passes; the waterfall gains a row every 5 s ---
    let paused = false;
    ui.pauseButton.addEventListener("click", () => {
        paused = !paused;
        ui.pauseButton.textContent = paused ? "Play" : "Pause";
    });
    let lastTime = performance.now();
    let elapsed = 0;
    const startK = sweepK;
    function animate(now) {
        // Stop when either chart is deleted (for example when a React component unmounts)
        if (ppi.isDeleted || waterfall.isDeleted) return;
        if (!paused) {
            elapsed += Math.min(now - lastTime, 100);
            const targetK = startK + Math.floor((elapsed / 1000 / SWEEP_SECONDS) * BEARINGS);
            if (targetK > sweepK) {
                paint(sweepK, targetK);
                sweepK = targetK;
                updateShown(sweepK);
                // Add waterfall rows to keep up with simulated time
                const t = simTimeAt(sweepK);
                let changed = false;
                while (rowTimes[0].t + WF_DT <= t) {
                    addRow(rowTimes[0].t + WF_DT, rowCount++);
                    changed = true;
                }
                if (changed) waterfallData.setZValues(rows);
                if (hover) showReadout();
            }
        }
        lastTime = now;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    // #region_A_end
}

sonarDisplays("scichart-root");
