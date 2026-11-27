import * as SciChart from "scichart";

// A simulated B-mode ultrasound scan of a tissue phantom, drawn as a fan-shaped (sector) image on a polar heatmap,
// the shape a curved (curvilinear) probe makes. Each column of the heatmap is one scan line fanning out from the
// probe, and each row is a step in depth. The brightness of a cell is the strength of the echo from that place.
// The phantom is synthetic: skin, fat and muscle layers, an organ, a blood vessel, a fluid-filled cyst, a bright
// stone-like reflector and a deeper boundary. Speckle, attenuation, shadowing and enhancement all come from a
// simple model of how the echoes form, and a seeded generator makes the image the same on every load.
const SECTOR_DEG = 60; // the fan spans 30° either side of straight down
const BEAMS = 256; // scan lines across the fan
const PROBE_RADIUS = 4; // cm: the curve of the probe face, so the fan's tip sits 4 cm above the skin
const ROW_CM = 0.025; // depth step along each scan line (0.25 mm)
const MAX_DEPTH = 20; // cm
const MAX_ROWS = Math.round(MAX_DEPTH / ROW_CM);
const SOUND_SPEED = 1540; // m/s, the average speed of sound in soft tissue that scanners assume
const ATTENUATION = 0.5; // dB per cm per MHz, a typical value for soft tissue
const NOISE_DB = -78; // the receiver's electronic noise, relative to the echo from organ tissue at the skin
const DISPLAY_DB = 60; // the greyscale spans 60 dB, from black to white
const HEATMAP_UPDATES_PER_SECOND = 30; // how often the heatmaps are sent to the chart while anything moves
const SLOW_SCAN_SECONDS = 3; // in slow motion, one frame takes this long to build, line by line
const SWEEP_GLOW_DEG = 10; // the glow behind the scan line fades out over this many degrees
const TGC_MAX_DB = 50; // the most extra gain TGC can add at depth
const SLOW_DIM_DB = 12; // in slow motion, the previous frame is dimmed until the scan line repaints it
const NYQUIST = 50; // cm/s, the top of the colour Doppler scale
const HEART_RATE = 72; // beats per minute, for the pulsing flow in the vessel

// What each kind of tissue is, how strongly it scatters sound back (dB, relative to the organ), how quickly it
// absorbs sound (times the typical soft-tissue value), and whether it is a smooth (specular) surface
const MAT = { SKIN: 0, FAT: 1, FASCIA: 2, MUSCLE: 3, ORGAN: 4, WALL: 5, BLOOD: 6, CYST: 7, STONE: 8, BOUNDARY: 9, DEEP: 10, DEEP_CYST: 11 };
const MAT_INFO = [
    { text: "skin and the gel line", db: 8, att: 1, specular: true },
    { text: "fat under the skin", db: -13, att: 1, specular: false },
    { text: "fascia, a thin sheet of connective tissue", db: 10, att: 1, specular: true },
    { text: "muscle, with its fibres showing as faint stripes", db: -6, att: 1, specular: false },
    { text: "organ tissue: an even, fine-grained texture (speckle)", db: 0, att: 1, specular: false },
    { text: "vessel wall", db: 8, att: 1, specular: true },
    { text: "blood inside a vessel: almost no echoes", db: -40, att: 0.3, specular: false },
    { text: "fluid-filled cyst: no echoes", db: -80, att: 0.005, specular: false },
    { text: "stone-like reflector (like a gallstone): a bright front surface", db: 24, att: 1, specular: true },
    { text: "a boundary between two tissues", db: 12, att: 1, specular: true },
    { text: "deeper tissue, slightly darker than the organ above", db: -3, att: 1, specular: false },
    { text: "a small, deep fluid-filled cyst", db: -80, att: 0.005, specular: false }
];
const STONE_LOSS_DB = 50; // sound blocked by the stone, so the tissue behind it is in shadow
const STONE_SURFACE_CM = 0.12; // the echo comes from the stone's front surface only

// A repeatable pseudo-random number in [0, 1) for one cell, so the speckle is the same on every load
function hash01(i, j, k) {
    let h = Math.imul(i + 1, 374761393) ^ Math.imul(j + 1, 668265263) ^ Math.imul(k + 1, 2246822519);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
// Smooth noise for tissue texture: random values on a grid, blended between grid points
function smoothNoise(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const fx = x - xi;
    const fy = y - yi;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const v = (a, b) => hash01(xi + a + 5000, yi + b + 5000, 7);
    return (v(0, 0) * (1 - sx) + v(1, 0) * sx) * (1 - sy) + (v(0, 1) * (1 - sx) + v(1, 1) * sx) * sy;
}
// A normally distributed random number, from two uniform ones (Box-Muller)
const gaussRandom = (b, i, k) => Math.sqrt(-2 * Math.log(1 - hash01(b, i, k))) * Math.cos(2 * Math.PI * hash01(b, i, k + 1));

// Geometry: scan line b points at angle theta from straight down; r is the distance from the fan's tip
const beamAngle = (b) => -SECTOR_DEG / 2 + (b + 0.5) * (SECTOR_DEG / BEAMS);
const VESSEL = { y0: 3.8, slope: 0.12, radius: 0.42, wall: 0.1 }; // a vessel running left to right, 3.8 cm deep
const vesselDistance = (x, y) => Math.abs(y - (VESSEL.y0 + VESSEL.slope * x)) / Math.hypot(1, VESSEL.slope);

// The tissue at x cm across and y cm below the centre of the skin line, s cm along the scan line from the skin
function materialAt(x, y, s) {
    if (s < 0.12) return MAT.SKIN;
    const fatEnd = 1.3 + 0.12 * Math.sin(x * 1.1);
    if (s < fatEnd - 0.03) return MAT.FAT;
    if (s < fatEnd + 0.03) return MAT.FASCIA;
    const muscleEnd = 2.6 + 0.1 * Math.sin(x * 0.7 + 1);
    if (s < muscleEnd - 0.03) return MAT.MUSCLE;
    if (s < muscleEnd + 0.03) return MAT.FASCIA;
    const dv = vesselDistance(x, y);
    if (dv < VESSEL.radius) return MAT.BLOOD;
    if (dv < VESSEL.radius + VESSEL.wall) return MAT.WALL;
    if (((x + 1.9) / 1.4) ** 2 + ((y - 6.8) / 1.1) ** 2 < 1) return MAT.CYST;
    if ((x - 2.3) ** 2 + (y - 6.3) ** 2 < 0.5 ** 2) return MAT.STONE;
    const boundary = 10.6 + 0.025 * x * x;
    if (Math.abs(y - boundary) < 0.05) return MAT.BOUNDARY;
    if (y > boundary) return ((x - 0.8) / 1.0) ** 2 + ((y - 14) / 0.8) ** 2 < 1 ? MAT.DEEP_CYST : MAT.DEEP;
    return MAT.ORGAN;
}

// What each cell shows, for the readout, beyond its tissue: shadow and enhancement are effects of what lies above
const LABEL = { TISSUE: 0, SHADOW: 1, ENHANCED: 2 };

// The phantom, built once: tissue, backscatter (dB) and label for every cell, as [beam][row]
const material = [];
const backscatter = [];
const label = [];
const noiseRe = [];
const noiseIm = [];
const noisePower = []; // the receiver's own noise in each cell, which varies at random about its mean
for (let b = 0; b < BEAMS; b++) {
    const theta = (beamAngle(b) * Math.PI) / 180;
    const mat = new Uint8Array(MAX_ROWS);
    const bsc = new Float32Array(MAX_ROWS);
    const lab = new Uint8Array(MAX_ROWS);
    const re = new Float32Array(MAX_ROWS);
    const im = new Float32Array(MAX_ROWS);
    const np = new Float32Array(MAX_ROWS);
    let stoneDepth = -1;
    let passedCyst = false;
    for (let i = 0; i < MAX_ROWS; i++) {
        const s = (i + 0.5) * ROW_CM;
        const r = PROBE_RADIUS + s;
        const x = r * Math.sin(theta);
        const y = r * Math.cos(theta) - PROBE_RADIUS;
        let m = materialAt(x, y, s);
        let db = MAT_INFO[m].db;
        // Texture: faint stripes in the muscle, slow variations in the organ, bright strands in the fat
        if (m === MAT.MUSCLE) db += 4 * Math.cos((2 * Math.PI * (s + 0.15 * x)) / 0.3);
        if (m === MAT.ORGAN || m === MAT.DEEP) db += 3 * (smoothNoise(x * 1.5, y * 1.5) - 0.5);
        if (m === MAT.FAT && smoothNoise(x * 4, s * 6) > 0.78) db += 12;
        // Inside the stone, only the front surface sends an echo back
        if (m === MAT.STONE) {
            if (stoneDepth < 0) stoneDepth = s;
            if (s - stoneDepth > STONE_SURFACE_CM) db = -80;
        }
        if (m === MAT.CYST) passedCyst = true;
        if (stoneDepth >= 0 && m !== MAT.STONE) lab[i] = LABEL.SHADOW;
        else if (passedCyst && m !== MAT.CYST && s < 9.5) lab[i] = LABEL.ENHANCED;
        mat[i] = m;
        bsc[i] = db;
        // Speckle: echoes from many tiny scatterers add up with random phases. Smooth surfaces echo coherently.
        if (MAT_INFO[m].specular) {
            re[i] = 0.45;
            im[i] = 0;
        } else {
            re[i] = gaussRandom(b, i, 1) / Math.SQRT2;
            im[i] = gaussRandom(b, i, 3) / Math.SQRT2;
        }
        np[i] = -Math.log(1 - hash01(b, i, 5));
    }
    material.push(mat);
    backscatter.push(bsc);
    label.push(lab);
    noiseRe.push(re);
    noiseIm.push(im);
    noisePower.push(np);
}

// A Gaussian smoothing kernel, scaled so it keeps the average echo power the same
function kernel(sigma) {
    const half = Math.max(1, Math.ceil(3 * sigma));
    const k = [];
    let sumSq = 0;
    for (let j = -half; j <= half; j++) {
        const w = Math.exp(-(j * j) / (2 * sigma * sigma));
        k.push(w);
        sumSq += w * w;
    }
    return k.map((w) => w / Math.sqrt(sumSq));
}

// The received echo (dB) in every cell for one transmit frequency. Higher frequencies lose more energy with depth
// (attenuation) but resolve finer detail, because the pulse is shorter and the beam narrower.
function receivedEcho(freqMHz) {
    const lossPerRow = 2 * ATTENUATION * freqMHz * ROW_CM; // there and back
    const fieldRe = [];
    const fieldIm = [];
    for (let b = 0; b < BEAMS; b++) {
        const re = new Float32Array(MAX_ROWS);
        const im = new Float32Array(MAX_ROWS);
        let loss = 0;
        let stoneDepth = -1;
        for (let i = 0; i < MAX_ROWS; i++) {
            const m = material[b][i];
            if (m === MAT.STONE && stoneDepth < 0) stoneDepth = i * ROW_CM;
            const blocked = stoneDepth >= 0 && i * ROW_CM - stoneDepth > STONE_SURFACE_CM ? STONE_LOSS_DB : 0;
            const amplitude = Math.pow(10, (backscatter[b][i] - loss - blocked) / 20);
            re[i] = amplitude * noiseRe[b][i];
            im[i] = amplitude * noiseIm[b][i];
            loss += lossPerRow * MAT_INFO[m].att;
        }
        fieldRe.push(re);
        fieldIm.push(im);
    }
    // Resolution: blur along each scan line by the pulse length, and across scan lines by the beam width
    const wavelengthCm = SOUND_SPEED / (freqMHz * 1e6) * 100;
    const axial = kernel((0.5 * wavelengthCm) / ROW_CM);
    const lateral = kernel(2 * (3.5 / freqMHz));
    const blurRows = (src) =>
        src.map((line) => {
            const out = new Float32Array(MAX_ROWS);
            const h = (axial.length - 1) / 2;
            for (let i = 0; i < MAX_ROWS; i++) {
                let sum = 0;
                for (let j = -h; j <= h; j++) {
                    const ii = i + j;
                    if (ii >= 0 && ii < MAX_ROWS) sum += axial[j + h] * line[ii];
                }
                out[i] = sum;
            }
            return out;
        });
    const blurBeams = (src) => {
        const h = (lateral.length - 1) / 2;
        return src.map((_, b) => {
            const out = new Float32Array(MAX_ROWS);
            for (let j = -h; j <= h; j++) {
                const bb = Math.min(BEAMS - 1, Math.max(0, b + j));
                const w = lateral[j + h];
                const line = src[bb];
                for (let i = 0; i < MAX_ROWS; i++) out[i] += w * line[i];
            }
            return out;
        });
    };
    const re = blurBeams(blurRows(fieldRe));
    const im = blurBeams(blurRows(fieldIm));
    const noise = Math.pow(10, NOISE_DB / 10);
    return re.map((line, b) =>
        line.map((v, i) => 10 * Math.log10(v * v + im[b][i] * im[b][i] + noise * noisePower[b][i]))
    );
}

// The pulsing blood flow: fast in systole, slower in diastole, fastest in the middle of the vessel
function peakVelocity(seconds) {
    const phase = ((seconds * HEART_RATE) / 60) % 1;
    const systole = phase < 0.35 ? Math.sin((Math.PI * phase) / 0.35) : 0;
    return 28 + 42 * systole; // cm/s
}

// The controls, readout and chart each need an element. This splits the page's div into them;
// in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#22365B; color:#ffffff; overflow:auto;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px;";
    const select = (id, options, value) =>
        `<select data-id="${id}" style="font:inherit; color:#fff; background:#1a2b4a; border:1px solid #ffffff66; border-radius:4px; padding:1px 4px">` +
        options.map((o) => `<option value="${o}"${o === value ? " selected" : ""}>${o}</option>`).join("") +
        `</select>`;
    const slider = (id, min, max, step, value) =>
        `<input type="range" data-id="${id}" min="${min}" max="${max}" step="${step}" value="${value}" style="width:110px; vertical-align:middle">`;
    bar.innerHTML =
        `<label>Gain ${slider("gain", -20, 30, 1, 0)} <span data-id="gainText"></span></label>` +
        `<label>TGC ${slider("tgc", 0, 8, 0.25, 3.5)} <span data-id="tgcText"></span></label>` +
        `<label>Depth ${select("depth", ["8 cm", "12 cm", "16 cm", "20 cm"], "12 cm")}</label>` +
        `<label>Frequency ${select("freq", ["2.5 MHz", "3.5 MHz", "5 MHz", "7.5 MHz"], "3.5 MHz")}</label>` +
        `<label><input type="checkbox" data-id="doppler" checked> Colour Doppler</label>` +
        `<label><input type="checkbox" data-id="slow"> Slow motion: build the image line by line</label>` +
        `<span>Echo: none <span style="display:inline-block; width:80px; height:10px; vertical-align:middle; background:linear-gradient(90deg,#000,#fff)"></span> strong</span>` +
        `<span data-id="flowKey">Flow: away <span style="display:inline-block; width:80px; height:10px; vertical-align:middle; background:linear-gradient(90deg,#9FE8FF,#1E50FF,#0A1E8C,#22365B,#8C0A0A,#FF2A1A,#FFE14A)"></span> towards the probe</span>` +
        `<span>Simulated data</span>` +
        `<span data-id="readout" aria-live="polite" style="flex-basis:100%; min-height:2.6em; color:#c8d3e8"></span>`;
    const chartDiv = document.createElement("div");
    chartDiv.id = `${divElementId}-scan`;
    chartDiv.style.cssText = "flex:1; min-height:320px;";
    root.append(bar, chartDiv);
    const controls = {};
    bar.querySelectorAll("[data-id]").forEach((e) => (controls[e.getAttribute("data-id")] = e));
    const el = (id) => controls[id];
    return {
        chartDiv,
        gain: el("gain"),
        gainText: el("gainText"),
        tgc: el("tgc"),
        tgcText: el("tgcText"),
        depth: el("depth"),
        freq: el("freq"),
        doppler: el("doppler"),
        slow: el("slow"),
        flowKey: el("flowKey"),
        readout: el("readout")
    };
}

async function ultrasoundScan(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A B-mode ultrasound image as a fan-shaped polar heatmap, with a colour Doppler overlay, an optional
    // line-by-line scan and a readout of the echo under the mouse, charted with SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        EPolarAxisMode,
        NumberRange,
        EAutoRange,
        UniformHeatmapDataSeries,
        PolarUniformHeatmapRenderableSeries,
        HeatmapColorMap,
        PolarLineRenderableSeries,
        PolarColumnRenderableSeries,
        XyxDataSeries,
        XyDataSeries,
        EColumnMode,
        GradientParams,
        Point,
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
    const toRad = (deg) => (deg * Math.PI) / 180;
    // The angle of each scan line: 0° is straight down. The polar chart's angles start at 3 o'clock and run
    // anticlockwise, so the fan starts at 240° (lower left) and spans 60°.
    const angleAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(-SECTOR_DEG / 2, SECTOR_DEG / 2),
        autoRange: EAutoRange.Never,
        startAngle: toRad(270 - SECTOR_DEG / 2),
        totalAngle: toRad(SECTOR_DEG),
        drawLabels: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorBands: false
    });
    // Distance from the fan's tip. The image starts at the probe face (PROBE_RADIUS from the tip), so innerRadius
    // keeps the fan in proportion. The labels show depth below the skin, down the right-hand edge.
    let depthCm = 12;
    const depthAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(PROBE_RADIUS, PROBE_RADIUS + depthCm),
        autoRange: EAutoRange.Never,
        startAngle: toRad(270 + SECTOR_DEG / 2),
        innerRadius: PROBE_RADIUS / (PROBE_RADIUS + depthCm),
        autoTicks: false,
        majorDelta: 2,
        minorDelta: 1,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorBands: false,
        labelStyle: { color: "#E8EEF8" }
    });
    // The skin (0 cm) is the top edge of the image, so it needs no label
    depthAxis.labelProvider.formatLabel = (value) => (value - PROBE_RADIUS < 0.5 ? "" : `${Math.round(value - PROBE_RADIUS)} cm`);
    sciChartSurface.xAxes.add(angleAxis);
    sciChartSurface.yAxes.add(depthAxis);

    // B-mode: brightness for echo strength, from black (no echo) to white (strongest), over DISPLAY_DB decibels
    const rowsFor = (depth) => Math.round(depth / ROW_CM);
    const makeRows = (n) => Array.from({ length: n }, () => new Float64Array(BEAMS)); // Float64Array rows copy into the chart faster
    let shown = makeRows(rowsFor(depthCm)); // what is on screen
    let target = makeRows(rowsFor(depthCm)); // the latest complete frame
    const heatmapOptions = { xStart: -SECTOR_DEG / 2, xStep: SECTOR_DEG / BEAMS, yStart: PROBE_RADIUS, yStep: ROW_CM };
    const bModeData = new UniformHeatmapDataSeries(wasmContext, { ...heatmapOptions, zValues: shown });
    const bModeSeries = new PolarUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: bModeData,
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: DISPLAY_DB,
            gradientStops: [
                { offset: 0, color: "#000000" },
                { offset: 1, color: "#FFFFFF" }
            ]
        }),
        fillValuesOutOfRange: true
    });

    // Colour Doppler: flow towards the probe in red to yellow, away in blue to cyan, no flow transparent.
    // The colour is the direction relative to the probe, not artery or vein.
    let flow = makeRows(rowsFor(depthCm));
    const flowData = new UniformHeatmapDataSeries(wasmContext, { ...heatmapOptions, zValues: flow });
    const flowSeries = new PolarUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: flowData,
        colorMap: new HeatmapColorMap({
            minimum: -NYQUIST,
            maximum: NYQUIST,
            gradientStops: [
                { offset: 0, color: "#9FE8FF" },
                { offset: 0.25, color: "#1E50FF" },
                { offset: 0.46, color: "#0A1E8C" },
                { offset: 0.5, color: "#00000000" },
                { offset: 0.54, color: "#8C0A0A" },
                { offset: 0.75, color: "#FF2A1A" },
                { offset: 1, color: "#FFE14A" }
            ]
        }),
        fillValuesOutOfRange: true
    });

    // Slow motion: the current scan line, with a soft glow behind it (one polar column with a gradient fill)
    const lineData = new XyDataSeries(wasmContext, { xValues: [0, 0], yValues: [PROBE_RADIUS, PROBE_RADIUS + depthCm] });
    const scanLine = new PolarLineRenderableSeries(wasmContext, { dataSeries: lineData, stroke: "#7FE3FF", strokeThickness: 2 });
    const glowData = new XyxDataSeries(wasmContext, { xValues: [-SWEEP_GLOW_DEG], x1Values: [0], yValues: [PROBE_RADIUS + depthCm] });
    const scanGlow = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: glowData,
        columnXMode: EColumnMode.StartEnd, // x is where the glow starts, x1 where it ends (at the scan line)
        defaultY1: PROBE_RADIUS, // the column starts at the probe face
        strokeThickness: 0,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(1, 0), [
            { offset: 0, color: "#7FE3FF50" },
            { offset: 1, color: "#7FE3FF00" }
        ])
    });
    scanLine.isVisible = false;
    scanGlow.isVisible = false;
    sciChartSurface.renderableSeries.add(bModeSeries, flowSeries, scanGlow, scanLine);
    sciChartSurface.chartModifiers.add(new PolarMouseWheelZoomModifier(), new PolarPanModifier(), new PolarZoomExtentsModifier());

    // --- The image: received echo for the frequency, then gain, TGC and the depth shown ---
    const settings = { gain: 0, tgc: 3.5, depth: 12, freq: 3.5, doppler: true, slow: false };
    let echo = receivedEcho(settings.freq); // [beam][row], dB
    // Display value = received echo + overall gain + time gain compensation (TGC), which adds more gain the deeper
    // the echo, up to TGC_MAX_DB
    function buildFrame() {
        for (let i = 0; i < target.length; i++) {
            const tgcDb = Math.min(TGC_MAX_DB, settings.tgc * (i + 0.5) * ROW_CM);
            const row = target[i];
            for (let b = 0; b < BEAMS; b++) row[b] = DISPLAY_DB / 2 + settings.gain + tgcDb + echo[b][i];
        }
    }
    // Copy the scan lines from fromBeam up to toBeam onto the screen, dimmed by dimDb
    function copyLines(fromBeam, toBeam, dimDb = 0) {
        for (let i = 0; i < shown.length; i++) {
            for (let b = fromBeam; b < toBeam; b++) shown[i][b] = target[i][b] - dimDb;
        }
    }

    // The vessel's cells, for the Doppler overlay: where they are and which way their scan line points
    const vesselCells = [];
    for (let b = 0; b < BEAMS; b++) {
        const theta = toRad(beamAngle(b));
        for (let i = 0; i < MAX_ROWS; i++) {
            if (material[b][i] !== MAT.BLOOD) continue;
            const r = PROBE_RADIUS + (i + 0.5) * ROW_CM;
            const d = vesselDistance(r * Math.sin(theta), r * Math.cos(theta) - PROBE_RADIUS);
            // Flow runs along the vessel, left to right. Its speed towards the probe is minus its component along
            // the scan line, which points away from the probe: (sin theta, cos theta).
            const along = (Math.sin(theta) + VESSEL.slope * Math.cos(theta)) / Math.hypot(1, VESSEL.slope);
            vesselCells.push({ b, i, profile: 1 - (d / VESSEL.radius) ** 2, towards: -along });
        }
    }
    function updateFlow(seconds) {
        const peak = peakVelocity(seconds);
        for (const c of vesselCells) {
            if (c.i >= flow.length) continue;
            let v = settings.doppler ? peak * c.profile * c.towards : 0;
            if (Math.abs(v) < 2) v = 0; // the wall filter removes very slow movement
            flow[c.i][c.b] = Math.max(-NYQUIST, Math.min(NYQUIST, v));
        }
        flowData.setZValues(flow);
    }

    // Slow motion state: which scan line is being built
    let scanBeam = 0;

    // When the depth changes, the image has more or fewer rows and the fan keeps its proportions
    function setDepth(depth) {
        depthCm = depth;
        settings.depth = depth;
        shown = makeRows(rowsFor(depth));
        target = makeRows(rowsFor(depth));
        flow = makeRows(rowsFor(depth));
        depthAxis.visibleRange = new NumberRange(PROBE_RADIUS, PROBE_RADIUS + depth);
        depthAxis.innerRadius = PROBE_RADIUS / (PROBE_RADIUS + depth);
        depthAxis.majorDelta = depth > 12 ? 4 : 2;
        showScanLine(scanBeam);
    }
    function showScanLine(beam) {
        const angle = -SECTOR_DEG / 2 + (beam / BEAMS) * SECTOR_DEG;
        lineData.updateXy(0, angle, PROBE_RADIUS);
        lineData.updateXy(1, angle, PROBE_RADIUS + depthCm);
        glowData.updateXyz(0, Math.max(-SECTOR_DEG / 2, angle - SWEEP_GLOW_DEG), PROBE_RADIUS + depthCm, angle);
    }
    function refresh() {
        buildFrame();
        if (!settings.slow) {
            copyLines(0, BEAMS);
            bModeData.setZValues(shown);
        }
        updateFlow(performance.now() / 1000);
        showReadout();
    }

    // --- Controls ---
    const showControlText = () => {
        ui.gainText.textContent = `${settings.gain > 0 ? "+" : ""}${settings.gain} dB`;
        ui.tgcText.textContent = `${settings.tgc.toFixed(2)} dB/cm`;
        ui.flowKey.style.visibility = settings.doppler ? "visible" : "hidden";
    };
    ui.gain.addEventListener("input", () => {
        settings.gain = Number(ui.gain.value);
        showControlText();
        refresh();
    });
    ui.tgc.addEventListener("input", () => {
        settings.tgc = Number(ui.tgc.value);
        showControlText();
        refresh();
    });
    ui.depth.addEventListener("change", () => {
        setDepth(parseFloat(ui.depth.value));
        if (settings.slow) scanBeam = 0;
        refresh();
        bModeData.setZValues(shown);
    });
    ui.freq.addEventListener("change", () => {
        settings.freq = parseFloat(ui.freq.value);
        // Like a scanner preset, TGC is reset to make up for the loss at this frequency: 2 x 0.5 dB/cm/MHz x f
        settings.tgc = Math.min(8, 2 * ATTENUATION * settings.freq);
        ui.tgc.value = String(settings.tgc);
        echo = receivedEcho(settings.freq);
        showControlText();
        refresh();
    });
    ui.doppler.addEventListener("change", () => {
        settings.doppler = ui.doppler.checked;
        showControlText();
        refresh();
    });
    ui.slow.addEventListener("change", () => {
        settings.slow = ui.slow.checked;
        scanLine.isVisible = settings.slow;
        scanGlow.isVisible = settings.slow;
        scanBeam = 0;
        refresh();
        if (settings.slow) copyLines(0, BEAMS, SLOW_DIM_DB);
    });

    // --- Readout: depth, echo time, brightness and what is there ---
    let hover = null;
    const defaultText = "Hover over the image to read the depth, the echo strength and what it shows.";
    function showReadout() {
        if (!hover) {
            ui.readout.textContent = defaultText;
            return;
        }
        const b = Math.floor(((hover.angle + SECTOR_DEG / 2) / SECTOR_DEG) * BEAMS);
        const i = Math.floor((hover.r - PROBE_RADIUS) / ROW_CM);
        if (b < 0 || b >= BEAMS || i < 0 || i >= shown.length) {
            ui.readout.textContent = defaultText;
            return;
        }
        const depth = (i + 0.5) * ROW_CM;
        const micros = ((2 * depth) / 100 / SOUND_SPEED) * 1e6; // there and back
        const level = Math.max(0, Math.min(DISPLAY_DB, shown[i][b]));
        const kind =
            level < 8
                ? "anechoic (black)"
                : level < 22
                  ? "hypoechoic (dark grey)"
                  : level < 40
                    ? "mid-grey (intermediate echoes)"
                    : "hyperechoic (bright)";
        const m = material[b][i];
        let what = MAT_INFO[m].text;
        if (label[b][i] === LABEL.SHADOW) what = "acoustic shadow: the stone above blocks the sound, so nothing comes back from here";
        else if (label[b][i] === LABEL.ENHANCED && m !== MAT.BLOOD)
            what += ", brighter than its neighbours because the sound crossed the cyst with little loss (posterior enhancement)";
        else if (echo[b][i] < NOISE_DB + 3 && backscatter[b][i] > -30) what = "too deep for this frequency: the echoes are weaker than the scanner's own noise";
        let text =
            `Depth ${depth.toFixed(1)} cm (echo back after ${micros.toFixed(0)} µs), ` +
            `brightness ${level.toFixed(0)} of ${DISPLAY_DB}: ${kind}. ${what[0].toUpperCase()}${what.slice(1)}.`;
        const v = flow[i] ? flow[i][b] : 0;
        if (settings.doppler && v !== 0) text += ` Flow ${Math.abs(v).toFixed(0)} cm/s ${v > 0 ? "towards the probe (red)" : "away from the probe (blue)"}.`;
        ui.readout.textContent = text;
    }
    // A custom modifier turns the mouse position into angle and distance, with the polar axes' own transform
    class ScanReadoutModifier extends CustomChartModifier2D {
        // Tells the polar surface that this modifier works with polar charts
        get modifierType() {
            return EModifierType.Chart2DPolarModifier;
        }
        modifierMouseMove(args) {
            super.modifierMouseMove(args);
            const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            hover = null;
            if (point) {
                const polar = angleAxis.reverseTransform(point.x, point.y);
                const angle = angleAxis.getCurrentCoordinateCalculator().getDataValue(polar.x);
                const r = depthAxis.getCurrentCoordinateCalculator().getDataValue(polar.y);
                if (Math.abs(angle) <= SECTOR_DEG / 2 && r >= PROBE_RADIUS) hover = { angle, r };
            }
            showReadout();
        }
        modifierMouseLeave(args) {
            super.modifierMouseLeave(args);
            hover = null;
            showReadout();
        }
    }
    sciChartSurface.chartModifiers.add(new ScanReadoutModifier());

    showControlText();
    refresh();

    // --- Animation: the pulsing flow and, in slow motion, the scan line moving across the fan ---
    let lastTime = performance.now();
    let sinceUpdate = 0; // ms since the heatmaps were last sent to the chart
    function animate(now) {
        // Stop when the chart is deleted (for example when a React component unmounts)
        if (sciChartSurface.isDeleted) return;
        const dt = Math.min(now - lastTime, 100);
        lastTime = now;
        sinceUpdate += dt;
        if (settings.slow) {
            // The scan line moves every frame; the heatmap is sent at most HEATMAP_UPDATES_PER_SECOND times a second
            const next = scanBeam + (dt / 1000 / SLOW_SCAN_SECONDS) * BEAMS;
            if (next >= BEAMS) {
                // A new frame starts: dim the old one, so the new scan lines stand out as they are drawn
                copyLines(0, BEAMS, SLOW_DIM_DB);
                scanBeam = 0;
            } else {
                copyLines(Math.floor(scanBeam), Math.floor(next));
                scanBeam = next;
            }
            showScanLine(scanBeam);
        }
        // Performance: every heatmap update makes SciChart re-process the whole grid, however few cells changed,
        // so the image and the flow are sent HEATMAP_UPDATES_PER_SECOND times a second at most
        if (sinceUpdate >= 1000 / HEATMAP_UPDATES_PER_SECOND) {
            sinceUpdate = 0;
            if (settings.slow) bModeData.setZValues(shown);
            if (settings.doppler) updateFlow(now / 1000);
            if (hover) showReadout();
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    // #region_A_end
}

ultrasoundScan("scichart-root");
