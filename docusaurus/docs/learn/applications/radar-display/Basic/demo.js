import * as SciChart from "scichart";

// A simulated surveillance radar display (a PPI scope): the radar at the centre, bearing around the circle and
// range outwards, a rotating sweep, and echoes that glow and fade like the phosphor of an old radar tube.
// Everything here is synthetic and generic: a coastal radar watching two airliners, a friendly patrol aircraft,
// a light aircraft with no transponder, a ship, and a fast unknown contact that closes in and is declared hostile.
// A seeded random generator makes it look the same every time. Nothing is loaded from outside.
const MAX_RANGE_NM = 60; // display range in nautical miles
const GATE_NM = 0.5; // range cells along each beam
const GATES = MAX_RANGE_NM / GATE_NM;
const AZIMUTHS = 360; // one column per degree of bearing
const SWEEP_SECONDS = 4; // one turn of the antenna on screen
const SCAN_SECONDS = 12; // the real time one turn stands for, like a long-range surveillance radar
const LOOP_SCANS = 30; // the scenario runs for 30 turns (6 minutes of simulated time), then starts again
const PERSISTENCE_SECONDS = 1.6; // how quickly the afterglow fades: about 8% is left after one turn
const BEAMWIDTH_DEG = 1.4; // a blip is about one beamwidth wide in bearing
const TRAIL_LENGTH = 8; // past plots kept for each track
const HEATMAP_UPDATES_PER_SECOND = 30; // how often the heatmap is recomputed and sent to the chart (see the animation below)
const SWEEP_GLOW_DEG = 60; // the glow behind the sweep line fades out over this many degrees

// Standard identities, coloured and shaped loosely after the public military symbol standards
const IDENTITIES = {
    friend: { label: "Friend", color: "#5CC8FF", shape: "circle" },
    neutral: { label: "Neutral", color: "#6CE07A", shape: "square" },
    unknown: { label: "Unknown", color: "#FFE45C", shape: "quatrefoil" },
    hostile: { label: "Hostile", color: "#FF5C5C", shape: "diamond" }
};

// The contacts. Positions are in nautical miles east (x) and north (y) of the radar, speeds in knots,
// headings in degrees true. squawk is the secondary radar (transponder) reply; null means none.
const CONTACTS = [
    { name: "Airliner", kind: "air", identity: "neutral", squawk: "2361", flightLevel: 350, x: 18, y: 52, speed: 450, heading: 205 },
    { name: "Airliner", kind: "air", identity: "neutral", squawk: "5512", flightLevel: 240, x: -50, y: -14, speed: 420, heading: 72, descentPerScan: 0.17 },
    { name: "Patrol aircraft", kind: "air", identity: "friend", squawk: "4401", flightLevel: 120, x: -26, y: 22, speed: 280, orbit: { cx: -24, cy: 16, radius: 6 } },
    { name: "Light aircraft", kind: "air", identity: "unknown", squawk: null, flightLevel: null, x: -12, y: -24, speed: 105, heading: 20, detectProbability: 0.8 },
    { name: "Cargo ship", kind: "surface", identity: "neutral", squawk: null, flightLevel: null, x: 16, y: -10, speed: 14, heading: 35 },
    { name: "Fast contact", kind: "air", identity: "unknown", squawk: null, flightLevel: null, x: 55, y: 18, speed: 560, heading: 250, hostileFromScan: 8 }
];

// A small seeded random number generator (mulberry32), so the scene is the same on every load
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
// A repeatable pseudo-random number in [0, 1) for one cell, for clutter that doesn't flicker
function hash01(i, j, k) {
    let h = Math.imul(i + 1, 374761393) ^ Math.imul(j + 1, 668265263) ^ Math.imul(k + 1, 2246822519);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const toBearing = (x, y) => ((Math.atan2(x, y) * 180) / Math.PI + 360) % 360;
const toRange = (x, y) => Math.hypot(x, y);
const pad3 = (deg) => String(Math.round(deg) % 360).padStart(3, "0");

// The coastline, 4 to 9 NM west of the radar: land to the west, sea to the east
const coastX = (y) => -6 - 2.5 * Math.sin(y / 7) - 1.2 * Math.sin(y / 2.3 + 1);

// Where each contact is after a number of whole scans
function positionAt(contact, scan) {
    const hours = (scan * SCAN_SECONDS) / 3600;
    if (contact.orbit) {
        const { cx, cy, radius } = contact.orbit;
        const start = Math.atan2(contact.x - cx, contact.y - cy);
        const turn = (contact.speed * hours) / radius; // radians flown round the orbit, clockwise
        const a = start + turn;
        return { x: cx + radius * Math.sin(a), y: cy + radius * Math.cos(a), heading: (((a * 180) / Math.PI + 90) % 360 + 360) % 360 };
    }
    const h = (contact.heading * Math.PI) / 180;
    const d = contact.speed * hours;
    return { x: contact.x + d * Math.sin(h), y: contact.y + d * Math.cos(h), heading: contact.heading };
}

// Draws one identity symbol on a small canvas, for the chart's point markers and the key
function drawSymbol(identity, size) {
    const { color, shape } = IDENTITIES[identity];
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    const c = size / 2;
    const r = size * 0.36;
    ctx.lineWidth = Math.max(2, size / 10);
    ctx.strokeStyle = color;
    ctx.fillStyle = color + "26";
    ctx.beginPath();
    if (shape === "circle") ctx.arc(c, c, r, 0, 2 * Math.PI);
    if (shape === "square") ctx.rect(c - r * 0.85, c - r * 0.85, r * 1.7, r * 1.7);
    if (shape === "diamond") {
        ctx.moveTo(c, c - r * 1.15);
        ctx.lineTo(c + r * 1.15, c);
        ctx.lineTo(c, c + r * 1.15);
        ctx.lineTo(c - r * 1.15, c);
        ctx.closePath();
    }
    if (shape === "quatrefoil") {
        const q = r * 0.48;
        for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
            ctx.moveTo(c + dx * q + q, c + dy * q);
            ctx.arc(c + dx * q, c + dy * q, q, 0, 2 * Math.PI);
        }
    }
    ctx.fill();
    ctx.stroke();
    return canvas.toDataURL();
}

// The controls, the readout, the chart and the key each need an element. This splits the page's div
// into them; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#22365B; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px;";
    bar.innerHTML =
        `<label><input type="checkbox" data-id="trails" checked> Trails</label>` +
        `<label><input type="checkbox" data-id="labels" checked> Labels</label>` +
        `<label><input type="checkbox" data-id="clutter"> Clutter (filters off)</label>` +
        `<span data-id="readout" aria-live="polite" style="flex-basis:100%; min-height:2.6em; color:#c8d3e8"></span>`;
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex;";
    const chartDiv = document.createElement("div");
    chartDiv.id = `${divElementId}-ppi`;
    chartDiv.style.cssText = "flex:1; min-width:0; min-height:0; position:relative;";
    const legend = document.createElement("div");
    legend.style.cssText = "flex:0 0 150px; padding:8px 8px 8px 4px; overflow:auto; font-size:12px; line-height:1.3;";
    body.append(chartDiv, legend);
    root.append(bar, body);
    const inputs = Array.from(bar.getElementsByTagName("input"));
    const input = (id) => inputs.find((i) => i.dataset.id === id);
    return {
        chartDiv,
        legend,
        trailsInput: input("trails"),
        labelsInput: input("labels"),
        clutterInput: input("clutter"),
        readout: bar.querySelector('span[data-id="readout"]')
    };
}

async function radarDisplayChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A simulated surveillance radar PPI scope on a polar chart: a rotating sweep with fading afterglow, range rings,
    // a bearing scale, and tracks with trails, labels and identity symbols, charted with SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        EPolarAxisMode,
        EPolarLabelMode,
        EPolarGridlineMode,
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
        PolarXyScatterRenderableSeries,
        PolarTextRenderableSeries,
        XyDataSeries,
        XyTextDataSeries,
        EllipsePointMarker,
        CrossPointMarker,
        SpritePointMarker,
        createImageAsync,
        EHorizontalTextPosition,
        EVerticalTextPosition,
        CustomChartModifier2D,
        EModifierType,
        translateFromCanvasToSeriesViewRect,
        SciChartJsNavyTheme,
        PolarMouseWheelZoomModifier,
        PolarZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartPolarSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(ui.chartDiv, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.background = "#0B1A2E";

    // Bearing: 0° (north) at the top, increasing clockwise like a compass. North-up, as on most surveillance displays
    const bearingAxis = new PolarNumericAxis(wasmContext, {
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
        majorGridLineStyle: { strokeThickness: 1, color: "#7CFFB222" }
    });
    // Range: distance from the radar. The circular gridlines are the range rings, every 10 NM
    const rangeAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, MAX_RANGE_NM),
        autoRange: EAutoRange.Never,
        autoTicks: false,
        majorDelta: 10,
        labelPrecision: 0,
        labelPostfix: " NM",
        startAngle: Math.PI / 2,
        gridlineMode: EPolarGridlineMode.Circles,
        drawMinorGridLines: false,
        drawMajorBands: false,
        majorGridLineStyle: { strokeThickness: 1, color: "#7CFFB244" },
        labelStyle: { color: "#9FE8BD" }
    });
    // Bearings are written with three digits on radar displays: 000°, 030°, 090°
    bearingAxis.labelProvider.formatLabel = (value) => `${pad3(value)}°`;
    sciChartSurface.xAxes.add(bearingAxis);
    sciChartSurface.yAxes.add(rangeAxis);

    // The radar video: one cell per degree and half mile, holding how brightly it glows (0 to 1). Each turn of the
    // sweep writes fresh echoes into the cells it passes; between turns every cell fades, like long-persistence phosphor
    const video = Array.from({ length: GATES }, () => new Float64Array(AZIMUTHS).fill(NaN)); // Float64Array rows copy into the chart faster
    const videoData = new UniformHeatmapDataSeries(wasmContext, { xStart: 0, xStep: 360 / AZIMUTHS, yStart: 0, yStep: GATE_NM, zValues: video });
    videoData.hasNaNs = true;
    const phosphor = new HeatmapColorMap({
        minimum: 0,
        maximum: 1,
        gradientStops: [
            { offset: 0, color: "#0B1A2E00" },
            { offset: 0.08, color: "#0F5A3555" },
            { offset: 0.35, color: "#22A75CAA" },
            { offset: 0.7, color: "#7CFFB2EE" },
            { offset: 1, color: "#E8FFF2FF" }
        ]
    });
    const videoSeries = new PolarUniformHeatmapRenderableSeries(wasmContext, { dataSeries: videoData, colorMap: phosphor, fillValuesOutOfRange: true });

    // The coastline, drawn as a map overlay (a "video map") so the operator can relate echoes to the ground
    const coastY = Array.from({ length: 241 }, (_, i) => -60 + i * 0.5);
    const coastPoints = coastY.map((y) => ({ x: coastX(y), y })).filter((p) => toRange(p.x, p.y) < MAX_RANGE_NM);
    const coastline = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: coastPoints.map((p) => toBearing(p.x, p.y)),
            yValues: coastPoints.map((p) => toRange(p.x, p.y))
        }),
        stroke: "#C9A96E88",
        strokeThickness: 1.5
    });

    // The sweep line: the antenna's current bearing, from the radar to the edge of the display
    const sweepData = new XyDataSeries(wasmContext, { xValues: [0, 0], yValues: [0, MAX_RANGE_NM] });
    const sweepGlow = new PolarLineRenderableSeries(wasmContext, { dataSeries: sweepData, stroke: "#7CFFB2", strokeThickness: 8, opacity: 0.25 });
    const sweepLine = new PolarLineRenderableSeries(wasmContext, { dataSeries: sweepData, stroke: "#D8FFE8", strokeThickness: 2 });
    // The glow behind the sweep: one polar column, a wedge from SWEEP_GLOW_DEG behind the line up to the line,
    // filled with a gradient from soft green at the line to clear, so the echoes still show through.
    // Two copies, one turn apart: the chart only draws 0° to 360°, so when the wedge crosses north
    // the first copy draws the part after 0° and the second the part before 360°.
    const glowData = new XyxDataSeries(wasmContext, {
        xValues: [-SWEEP_GLOW_DEG, 360 - SWEEP_GLOW_DEG],
        x1Values: [0, 360],
        yValues: [MAX_RANGE_NM, MAX_RANGE_NM]
    });
    const sweepWedge = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: glowData,
        columnXMode: EColumnMode.StartEnd, // x is where the wedge starts, x1 where it ends
        strokeThickness: 0,
        // The gradient runs around the circle across the column. The bearing axis is flipped (clockwise, like a compass),
        // so offset 0 is the sweep line's end
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(1, 0), [
            { offset: 0, color: "#7CFFB270" },
            { offset: 0.5, color: "#7CFFB21C" },
            { offset: 1, color: "#7CFFB200" }
        ])
    });
    function moveSweepWedge(angle) {
        glowData.updateXyz(0, angle - SWEEP_GLOW_DEG, MAX_RANGE_NM, angle);
        glowData.updateXyz(1, angle - SWEEP_GLOW_DEG + 360, MAX_RANGE_NM, angle + 360);
    }

    // Own position at the centre
    const ownPosition = new PolarXyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: [0], yValues: [0] }),
        pointMarker: new CrossPointMarker(wasmContext, { width: 14, height: 14, stroke: "#FFFFFF", strokeThickness: 2 })
    });

    // For each identity: track symbols, trails of past plots, and velocity leaders (where the track will be in one minute)
    const layers = {};
    for (const identity of Object.keys(IDENTITIES)) {
        const color = IDENTITIES[identity].color;
        const image = await createImageAsync(drawSymbol(identity, 18));
        layers[identity] = {
            symbols: new PolarXyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext),
                pointMarker: new SpritePointMarker(wasmContext, { image })
            }),
            trails: new PolarXyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 4, height: 4, fill: color + "99", stroke: color + "99", strokeThickness: 0 })
            }),
            leaders: new PolarLineRenderableSeries(wasmContext, { dataSeries: new XyDataSeries(wasmContext), stroke: color, strokeThickness: 1.5 })
        };
    }
    // Data blocks: the transponder code, flight level and ground speed next to each track
    const labelData = new XyTextDataSeries(wasmContext);
    const labels = new PolarTextRenderableSeries(wasmContext, {
        dataSeries: labelData,
        dataLabels: {
            style: { fontSize: 12, fontFamily: "Arial" },
            color: "#E6F0FF",
            horizontalTextPosition: EHorizontalTextPosition.Right,
            verticalTextPosition: EVerticalTextPosition.Above
        }
    });

    sciChartSurface.renderableSeries.add(videoSeries, coastline, sweepWedge, sweepGlow, sweepLine, ownPosition);
    const allLayers = Object.keys(layers).map((identity) => layers[identity]);
    for (const layer of allLayers) sciChartSurface.renderableSeries.add(layer.trails, layer.leaders);
    for (const layer of allLayers) sciChartSurface.renderableSeries.add(layer.symbols);
    sciChartSurface.renderableSeries.add(labels);
    sciChartSurface.chartModifiers.add(new PolarMouseWheelZoomModifier(), new PolarZoomExtentsModifier());

    // --- What the radar receives on one beam: noise, clutter and target echoes ---
    let rng = makeRandom(20261126);
    // Rain: a band of showers to the south-east, drifting slowly north-east
    const rainAt = (x, y, scan) => {
        const rx = x - 24 - scan * 0.04;
        const ry = y + 22 - scan * 0.03;
        return Math.exp(-((rx * 0.9 + ry * 0.5) ** 2) / 40 - ((ry * 0.9 - rx * 0.5) ** 2) / 12);
    };
    function receive(col, row, scan, showClutter) {
        const rangeNm = (row + 0.5) * GATE_NM;
        const bearing = ((col + 0.5) * Math.PI) / 180;
        const x = rangeNm * Math.sin(bearing);
        const y = rangeNm * Math.cos(bearing);
        // Receiver noise: faint speckle everywhere, different on every turn, which leaves the glowing wedge behind the sweep
        let v = rng() < 0.25 ? 0.1 + 0.2 * rng() : 0.07;
        if (!showClutter) return v;
        const overLand = x < coastX(y);
        // Ground clutter: strong, fixed echoes from hills and buildings on land, strongest close in
        if (overLand && hash01(col, row, 3) < 0.55 * Math.exp(-rangeNm / 14)) v = Math.max(v, 0.45 + 0.5 * hash01(col, row, 4));
        // Sea clutter: echoes from waves, strongest near the radar and gone by about 8 NM, changing every turn
        if (!overLand && rng() < Math.exp(-rangeNm / 2.5)) v = Math.max(v, 0.3 + 0.6 * rng() * Math.exp(-rangeNm / 6));
        // Rain clutter: a broad, grainy area that hides anything inside it
        const rain = rainAt(x, y, scan);
        if (rain > 0.15 && rng() < rain) v = Math.max(v, 0.3 + 0.5 * rain * rng());
        return v;
    }

    // --- Tracks: a plot is made when the sweep passes a contact, and the track keeps its last few plots as a trail ---
    const tracks = CONTACTS.map((contact) => ({ contact, plots: [], lastPlotScan: -1, identity: contact.identity, state: null }));
    function plotContact(track, scan) {
        const { contact } = track;
        const p = positionAt(contact, scan);
        const range = toRange(p.x, p.y);
        if (range > MAX_RANGE_NM - 1) return; // off the display
        track.identity = contact.hostileFromScan !== undefined && scan >= contact.hostileFromScan ? "hostile" : contact.identity;
        const fl = contact.flightLevel === null ? null : Math.round(contact.flightLevel - (contact.descentPerScan || 0) * scan);
        track.state = { x: p.x, y: p.y, heading: p.heading, speed: contact.speed, flightLevel: fl, coasting: false };
        if (rng() > (contact.detectProbability || 0.97)) {
            track.state.coasting = true; // no echo this turn: the tracker carries the track on its last course and speed
            return;
        }
        // The plot: the measured position, with a little range and bearing error
        const bearing = toBearing(p.x, p.y) + (rng() - 0.5) * 0.6;
        const measuredRange = range + (rng() - 0.5) * 0.15;
        track.plots.push({ bearing, range: measuredRange });
        if (track.plots.length > TRAIL_LENGTH + 1) track.plots.shift();
        track.lastPlotScan = scan;
        // Paint the echo into the video: about one beamwidth wide and one range cell deep
        const row = Math.floor(measuredRange / GATE_NM);
        const strength = contact.kind === "surface" ? 1 : contact.speed < 150 ? 0.7 : 0.9;
        for (let d = -BEAMWIDTH_DEG; d <= BEAMWIDTH_DEG; d += 0.5) {
            const col = ((Math.round(bearing + d) % AZIMUTHS) + AZIMUTHS) % AZIMUTHS;
            const fall = 1 - Math.abs(d) / (BEAMWIDTH_DEG * 1.4);
            for (const r of [row, row + 1]) if (r >= 0 && r < GATES) video[r][col] = Math.max(video[r][col] || 0, strength * fall);
        }
    }

    function redrawTracks() {
        for (const identity of Object.keys(layers)) {
            const sym = { x: [], y: [] };
            const trail = { x: [], y: [] };
            const lead = { x: [], y: [] };
            for (const track of tracks) {
                if (track.identity !== identity || !track.state || track.plots.length === 0) continue;
                const s = track.state;
                const last = track.plots[track.plots.length - 1];
                const shown = s.coasting ? { bearing: toBearing(s.x, s.y), range: toRange(s.x, s.y) } : last;
                sym.x.push(shown.bearing);
                sym.y.push(shown.range);
                if (ui.trailsInput.checked) {
                    for (const p of track.plots.slice(0, -1)) {
                        trail.x.push(p.bearing);
                        trail.y.push(p.range);
                    }
                }
                // A one-minute velocity leader, drawn as a few points so it stays straight on the polar chart
                const h = (s.heading * Math.PI) / 180;
                const sx = shown.range * Math.sin((shown.bearing * Math.PI) / 180);
                const sy = shown.range * Math.cos((shown.bearing * Math.PI) / 180);
                for (let k = 0; k <= 4; k++) {
                    const d = (s.speed / 60) * (k / 4);
                    lead.x.push(toBearing(sx + d * Math.sin(h), sy + d * Math.cos(h)));
                    lead.y.push(toRange(sx + d * Math.sin(h), sy + d * Math.cos(h)));
                }
                lead.x.push(NaN);
                lead.y.push(NaN);
            }
            const layer = layers[identity];
            layer.symbols.dataSeries.clear();
            layer.symbols.dataSeries.appendRange(sym.x, sym.y);
            layer.trails.dataSeries.clear();
            layer.trails.dataSeries.appendRange(trail.x, trail.y);
            layer.leaders.dataSeries.clear();
            layer.leaders.dataSeries.appendRange(lead.x, lead.y);
        }
        labelData.clear();
        if (ui.labelsInput.checked) {
            for (const track of tracks) {
                if (!track.state || track.plots.length === 0) continue;
                const last = track.plots[track.plots.length - 1];
                const s = track.state;
                const text = track.contact.squawk
                    ? `${track.contact.squawk}\nFL${String(s.flightLevel).padStart(3, "0")} ${s.speed}kt`
                    : `no SSR\n${s.speed}kt`;
                // Place the data block a little up and to the right of the track (east and north on a north-up display)
                const lx = last.range * Math.sin((last.bearing * Math.PI) / 180) + 1.6;
                const ly = last.range * Math.cos((last.bearing * Math.PI) / 180) + 0.6;
                labelData.append(toBearing(lx, ly), toRange(lx, ly), text);
            }
        }
    }

    // --- Tooltip and readout: the track under the mouse, or the range and bearing of the cursor ---
    let lastMouse = null;
    // The tooltip is an HTML card over the chart, placed next to the mouse
    const tooltip = document.createElement("div");
    tooltip.style.cssText =
        "position:absolute; z-index:5; pointer-events:none; display:none; min-width:170px; padding:8px 10px;" +
        "background:#0B1424EE; border:1px solid #FFFFFF33; border-left-width:4px; border-radius:6px;" +
        "color:#E8EEF8; font:13px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height:1.45;";
    ui.chartDiv.append(tooltip);
    function showTooltip(track, last) {
        const s = track.state;
        const identity = IDENTITIES[track.identity];
        const rows = [
            ["Range", `${last.range.toFixed(1)} NM`],
            ["Bearing", `${pad3(last.bearing)}°`],
            ["Speed", `${s.speed} kt`],
            ["Heading", `${pad3(s.heading)}°`],
            ["Transponder", track.contact.squawk ? `${track.contact.squawk}, FL${String(s.flightLevel).padStart(3, "0")}` : "no reply"]
        ];
        tooltip.style.borderLeftColor = identity.color;
        tooltip.innerHTML =
            `<div style="font-weight:700; color:${identity.color}">${identity.label.toUpperCase()}</div>` +
            `<div style="margin-bottom:4px; color:#AFC0DC">${track.contact.name}, ${track.contact.kind === "surface" ? "surface" : "air"} track</div>` +
            rows.map(([k, v]) => `<div style="display:flex; justify-content:space-between; gap:14px"><span style="color:#AFC0DC">${k}</span><b>${v}</b></div>`).join("") +
            (s.coasting ? `<div style="margin-top:4px; color:#FFD166">Coasting: no echo on the last sweep</div>` : "");
        // Beside the cursor, flipped to the other side near the right or bottom edge
        const { x, y } = lastMouse.pixel;
        const box = ui.chartDiv.getBoundingClientRect();
        tooltip.style.display = "block";
        const w = tooltip.offsetWidth;
        const h = tooltip.offsetHeight;
        tooltip.style.left = `${x + 16 + w > box.width ? x - 16 - w : x + 16}px`;
        tooltip.style.top = `${Math.max(4, Math.min(y - h / 2, box.height - h - 4))}px`;
    }
    const defaultText = "Hover over a track for its identity, range, bearing, speed and heading.";
    ui.readout.textContent = defaultText;
    function showReadout() {
        if (!lastMouse) {
            tooltip.style.display = "none";
            ui.readout.textContent = defaultText;
            return;
        }
        const { bearing, range } = lastMouse;
        const mx = range * Math.sin((bearing * Math.PI) / 180);
        const my = range * Math.cos((bearing * Math.PI) / 180);
        const pickRadius = (rangeAxis.visibleRange.max - rangeAxis.visibleRange.min) / 25;
        let best = null;
        for (const track of tracks) {
            if (!track.state || track.plots.length === 0) continue;
            const last = track.plots[track.plots.length - 1];
            const tx = last.range * Math.sin((last.bearing * Math.PI) / 180);
            const ty = last.range * Math.cos((last.bearing * Math.PI) / 180);
            const d = Math.hypot(tx - mx, ty - my);
            if (d < pickRadius && (!best || d < best.d)) best = { d, track, last };
        }
        if (!best) {
            tooltip.style.display = "none";
            ui.readout.textContent = `Cursor: range ${range.toFixed(1)} NM, bearing ${pad3(bearing)}°.`;
            return;
        }
        showTooltip(best.track, best.last);
        const { track, last } = best;
        const s = track.state;
        const id = IDENTITIES[track.identity].label;
        const ssr = track.contact.squawk ? `squawk ${track.contact.squawk}, FL${String(s.flightLevel).padStart(3, "0")}` : "no transponder reply (primary radar only)";
        const coast = s.coasting ? " Coasting: no echo on the last sweep." : "";
        ui.readout.textContent =
            `${id} ${track.contact.kind === "surface" ? "surface" : "air"} track (${track.contact.name.toLowerCase()}): range ${last.range.toFixed(1)} NM, ` +
            `bearing ${pad3(last.bearing)}°, speed ${s.speed} kt, heading ${pad3(s.heading)}°, ${ssr}.${coast}`;
    }

    // A custom modifier turns the mouse position into bearing and range with the polar axes' own transforms
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
                const polar = bearingAxis.reverseTransform(point.x, point.y);
                const bearing = (bearingAxis.getCurrentCoordinateCalculator().getDataValue(polar.x) + 360) % 360;
                const range = rangeAxis.getCurrentCoordinateCalculator().getDataValue(polar.y);
                // The mouse's position in the chart's div, in CSS pixels, to place the tooltip
                const box = ui.chartDiv.getBoundingClientRect();
                const pixel = { x: args.nativeEvent.clientX - box.left, y: args.nativeEvent.clientY - box.top };
                lastMouse = range >= 0 && range <= MAX_RANGE_NM ? { bearing, range, pixel } : null;
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

    // --- The key ---
    ui.legend.innerHTML =
        `<div style="font-weight:600; margin-bottom:4px">Identity</div>` +
        Object.keys(IDENTITIES)
            .map(
                (id) =>
                    `<div style="display:flex; align-items:center; gap:6px; margin:3px 0">` +
                    `<img src="${drawSymbol(id, 22)}" width="18" height="18" alt="">${IDENTITIES[id].label}</div>`
            )
            .join("") +
        `<div style="margin-top:8px; color:#c8d3e8">Dots: past plots (trail). Line: where the track will be in one minute.` +
        ` Labels: transponder code, flight level and ground speed. Simulated data.</div>`;

    // --- The sweep: the antenna turns, each beam is refreshed as it passes, and everything else fades ---
    let sweepCol = 0;
    let elapsed = 0;
    let lastTime = performance.now();
    const fade = (seconds) => Math.exp(-seconds / PERSISTENCE_SECONDS);
    function scanColumns(fromCol, toCol) {
        const showClutter = ui.clutterInput.checked;
        for (let k = fromCol; k < toCol; k++) {
            const scan = Math.floor(k / AZIMUTHS) % LOOP_SCANS;
            const col = k % AZIMUTHS;
            if (col === 0 && scan === 0) {
                rng = makeRandom(20261126); // the scenario starts again: clear the tracks
                for (const track of tracks) {
                    track.plots = [];
                    track.state = null;
                }
            }
            for (let row = 0; row < GATES; row++) {
                const fresh = receive(col, row, scan, showClutter);
                const old = video[row][col];
                video[row][col] = Number.isNaN(old) ? fresh : Math.max(old * 0.3, fresh);
            }
            // Contacts whose bearing the beam is passing now get a new plot
            for (const track of tracks) {
                const p = positionAt(track.contact, scan + col / AZIMUTHS);
                if (Math.floor(toBearing(p.x, p.y)) === col) plotContact(track, scan + col / AZIMUTHS);
            }
        }
    }
    // Run a few turns first, so the display already has tracks and trails when it appears,
    // then fade each beam by how long ago the sweep passed it
    const PREFILL = 9 * AZIMUTHS;
    scanColumns(0, PREFILL);
    for (let col = 0; col < AZIMUTHS; col++) {
        const k = fade(((AZIMUTHS - col) / AZIMUTHS) * SWEEP_SECONDS);
        for (let row = 0; row < GATES; row++) video[row][col] *= k;
    }
    sweepCol = PREFILL;
    redrawTracks();

    let sinceHeatmap = 0; // seconds since the heatmap was last sent to the chart
    function animate(now) {
        if (sciChartSurface.isDeleted) return; // stop when the chart is deleted
        const dt = Math.min(now - lastTime, 100) / 1000;
        lastTime = now;
        elapsed += dt;
        sinceHeatmap += dt;
        // Performance: every heatmap update makes SciChart re-process the whole grid, however few cells changed.
        // So the cheap parts (the sweep line and its glow) move every frame, and the heatmap (afterglow fade,
        // new beams, tracks) is updated HEATMAP_UPDATES_PER_SECOND times a second. For large grids, use 15.
        const angle = ((elapsed / SWEEP_SECONDS) * 360) % 360;
        sweepData.clear();
        sweepData.appendRange([angle, angle], [0, MAX_RANGE_NM]);
        moveSweepWedge(angle);
        if (sinceHeatmap >= 1 / HEATMAP_UPDATES_PER_SECOND) {
            // Afterglow: every cell fades by the time since the last update
            const k = fade(sinceHeatmap);
            sinceHeatmap = 0;
            for (let row = 0; row < GATES; row++) {
                const line = video[row];
                for (let col = 0; col < AZIMUTHS; col++) {
                    const v = line[col] * k;
                    line[col] = v < 0.012 ? NaN : v;
                }
            }
            const targetCol = PREFILL + Math.floor((elapsed / SWEEP_SECONDS) * AZIMUTHS);
            if (targetCol > sweepCol) {
                scanColumns(sweepCol, targetCol);
                sweepCol = targetCol;
                redrawTracks();
            }
            videoData.setZValues(video);
            showReadout();
        }
        requestAnimationFrame(animate);
    }
    ui.trailsInput.addEventListener("change", redrawTracks);
    ui.labelsInput.addEventListener("change", redrawTracks);
    requestAnimationFrame(animate);
    // #region_A_end
}

radarDisplayChart("scichart-root");
