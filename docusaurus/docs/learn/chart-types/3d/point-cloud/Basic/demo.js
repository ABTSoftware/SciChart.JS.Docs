import * as SciChart from "scichart";

// Simulates an airborne LiDAR survey of a 150 m × 100 m site: gently rolling ground, a road with painted lines,
// four buildings, trees and bushes, a pond, a power line, and a few stray noise points.
// A seeded random generator makes the point cloud the same every time the page loads.
// Each point has x (east), y (elevation), z (north), an intensity from 0 to 1, an ASPRS class code,
// its return number and the number of returns its laser pulse produced.
function createScene() {
    let seed = 20261120;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const jitter = (size) => (random() - 0.5) * 2 * size;
    const WIDTH = 150; // metres east
    const DEPTH = 100; // metres north

    const xs = [], ys = [], zs = [], intensity = [], cls = [], ret = [], nRet = [];
    const add = (x, y, z, i, c, r, n) => {
        xs.push(x);
        ys.push(y);
        zs.push(z);
        intensity.push(Math.max(0, Math.min(1, i)));
        cls.push(c);
        ret.push(r);
        nRet.push(n);
    };

    // Bare-earth elevation (m above datum): a gentle slope with low hills; the road is levelled
    const ROAD = { z0: 44, z1: 52 };
    const hills = (x, z) => 52 + 0.03 * x + 2.2 * Math.sin(x / 23) + 1.6 * Math.cos(z / 17 + 0.6) + 0.8 * Math.sin((x + z) / 11);
    const ground = (x, z) => {
        if (z >= ROAD.z0 - 2 && z <= ROAD.z1 + 2) {
            const flat = 52 + 0.03 * x + 2.2 * Math.sin(x / 23); // the road follows the slope but not the bumps
            const edge = Math.min(1, Math.max(0, Math.min(z - (ROAD.z0 - 2), ROAD.z1 + 2 - z) / 2));
            return flat * edge + hills(x, z) * (1 - edge);
        }
        return hills(x, z);
    };

    const buildings = [
        { x0: 14, x1: 34, z0: 60, z1: 77, eave: 6.5, ridge: 3, along: "x" }, // gabled house
        { x0: 46, x1: 76, z0: 62, z1: 90, eave: 12, ridge: 0 }, // flat-roofed office
        { x0: 20, x1: 37, z0: 10, z1: 30, eave: 5.5, ridge: 2.5, along: "z" }, // gabled house
        { x0: 86, x1: 102, z0: 8, z1: 27, eave: 9, ridge: 0 } // flat-roofed warehouse
    ].map((b) => ({ ...b, base: ground((b.x0 + b.x1) / 2, (b.z0 + b.z1) / 2) }));
    const roofHeight = (b, x, z) => {
        let h = b.base + b.eave;
        if (b.ridge > 0) {
            const t = b.along === "x" ? (z - b.z0) / (b.z1 - b.z0) : (x - b.x0) / (b.x1 - b.x0);
            h += b.ridge * (1 - Math.abs(2 * t - 1));
        }
        // A plant room on the office roof
        if (b.ridge === 0 && b.x0 === 46 && x > 52 && x < 58 && z > 80 && z < 85) h += 2.5;
        return h;
    };
    const POND = { x: 112, z: 74, rx: 12, rz: 8 };
    const POWER_X = 138; // the power line runs north-south here, so no trees grow in a corridor around it
    const inBuilding = (x, z, margin) =>
        buildings.find((b) => x > b.x0 - margin && x < b.x1 + margin && z > b.z0 - margin && z < b.z1 + margin);
    const inPond = (x, z, margin) => ((x - POND.x) / (POND.rx + margin)) ** 2 + ((z - POND.z) / (POND.rz + margin)) ** 2 < 1;

    // Trees (crowns as ellipsoids) and bushes, kept off the road, the buildings, the pond and the power line corridor
    const plants = [];
    while (plants.length < 70) {
        const x = 3 + random() * (WIDTH - 6);
        const z = 3 + random() * (DEPTH - 6);
        const isTree = plants.length < 42;
        const r = isTree ? 2.5 + random() * 2.5 : 0.8 + random() * 1.2;
        if (z > ROAD.z0 - r - 1.5 && z < ROAD.z1 + r + 1.5) continue;
        if (inBuilding(x, z, r + 2) || inPond(x, z, r + 2) || Math.abs(x - POWER_X) < r + 7) continue;
        const height = isTree ? 9 + random() * 9 : 0.8 + random() * 1.2;
        const crownDepth = isTree ? height * (0.5 + random() * 0.2) : height;
        plants.push({ x, z, r, top: ground(x, z) + height, crownDepth, isTree });
    }

    // The scanner flies north and sweeps east-west: one scan line every 0.25 m, one pulse every 0.25 m along it
    for (let zi = 0; zi < DEPTH / 0.25; zi++) {
        for (let xi = 0; xi < WIDTH / 0.25; xi++) {
            const x = Math.min(WIDTH, Math.max(0, xi * 0.25 + jitter(0.09)));
            const z = Math.min(DEPTH, Math.max(0, zi * 0.25 + jitter(0.05)));
            const g = ground(x, z);

            // Stray returns: birds or dust high above (high noise), multipath below ground (low point)
            const n = random();
            if (n < 0.0005) {
                add(x, g + 30 + random() * 50, z, random() * 0.3, 18, 1, 1);
                continue;
            }
            if (n < 0.0008) {
                add(x, g - 2 - random() * 6, z, random() * 0.2, 7, 1, 1);
                continue;
            }
            // Water absorbs the near-infrared laser, so most pulses over the pond come back empty
            if (inPond(x, z, 0)) {
                if (random() < 0.04) add(x, ground(POND.x, POND.z) - 0.6 + jitter(0.03), z, 0.03 + random() * 0.05, 9, 1, 1);
                continue;
            }
            const building = inBuilding(x, z, 0);
            if (building) {
                add(x, roofHeight(building, x, z) + jitter(0.03), z, 0.3 + random() * 0.15, 6, 1, 1);
                continue;
            }
            // Vegetation: a pulse can return from the canopy, from inside it, and from the ground below
            const plant = plants.find((p) => (x - p.x) ** 2 + (z - p.z) ** 2 < p.r * p.r);
            if (plant && random() < (plant.isTree ? 0.9 : 0.75)) {
                const d = Math.sqrt((x - plant.x) ** 2 + (z - plant.z) ** 2) / plant.r;
                const half = plant.crownDepth / 2;
                const centre = plant.top - half;
                const surface = centre + half * Math.sqrt(1 - d * d);
                const c = plant.isTree ? 5 : 3;
                const hits = [surface - random() * 0.4];
                if (plant.isTree && random() < 0.45) hits.push(centre - random() * half * 0.8);
                const reachesGround = random() < (plant.isTree ? 0.55 : 0.4);
                const count = hits.length + (reachesGround ? 1 : 0);
                hits.forEach((y, k) => add(x, y, z, 0.25 + random() * 0.2 - k * 0.1, c, k + 1, count));
                if (reachesGround) add(x, g + jitter(0.03), z, 0.25 + random() * 0.15, 2, count, count);
                continue;
            }
            // Open ground: grass is bright in near-infrared, asphalt is dark, road paint is brightest
            if (z >= ROAD.z0 && z <= ROAD.z1) {
                const edgeLine = Math.abs(z - ROAD.z0 - 0.3) < 0.1 || Math.abs(z - ROAD.z1 + 0.3) < 0.1;
                const centreLine = Math.abs(z - (ROAD.z0 + ROAD.z1) / 2) < 0.1 && x % 9 < 3;
                const paint = edgeLine || centreLine;
                add(x, g + jitter(0.02), z, paint ? 0.85 + random() * 0.1 : 0.1 + random() * 0.06, 11, 1, 1);
            } else {
                add(x, g + jitter(0.03), z, 0.5 + random() * 0.15, 2, 1, 1);
            }
        }
    }

    // A few wall points: the scanner looks slightly sideways, so it catches some walls
    for (const b of buildings) {
        const perimeter = 2 * (b.x1 - b.x0 + b.z1 - b.z0);
        for (let k = 0; k < perimeter * 3; k++) {
            let s = random() * perimeter;
            let x, z;
            if (s < b.x1 - b.x0) [x, z] = [b.x0 + s, b.z0];
            else if ((s -= b.x1 - b.x0) < b.z1 - b.z0) [x, z] = [b.x1, b.z0 + s];
            else if ((s -= b.z1 - b.z0) < b.x1 - b.x0) [x, z] = [b.x1 - s, b.z1];
            else [x, z] = [b.x0, b.z1 - (s - (b.x1 - b.x0))];
            add(x, b.base + random() * b.eave, z, 0.3 + random() * 0.15, 6, 1, 1);
        }
    }

    // The power line: two lattice towers and three sagging conductors
    const towers = [6, 94];
    for (const tz of towers) {
        const base = ground(POWER_X, tz);
        for (let k = 0; k < 900; k++) {
            const h = random() * 24;
            const half = 2 - (1.6 * h) / 24; // the tower narrows towards the top
            const corner = Math.floor(random() * 4);
            const x = POWER_X + (corner % 2 ? half : -half) + jitter(0.05);
            const z = tz + (corner < 2 ? half : -half) + jitter(0.05);
            add(x, base + h, z, 0.4 + random() * 0.2, 15, 1, 1);
        }
        for (let k = 0; k < 120; k++) add(POWER_X + jitter(4.5), base + 21.5 + jitter(0.1), tz + jitter(0.15), 0.45, 15, 1, 1);
    }
    const top0 = ground(POWER_X, towers[0]) + 21.5;
    const top1 = ground(POWER_X, towers[1]) + 21.5;
    for (const dx of [-4, 0, 4]) {
        for (let z = towers[0]; z <= towers[1]; z += 0.2) {
            if (random() < 0.5) continue; // thin wires return only some pulses
            const t = (z - towers[0]) / (towers[1] - towers[0]);
            const sag = 4 * 4 * t * (1 - t); // 4 m of sag at mid-span
            add(POWER_X + dx + jitter(0.03), top0 + (top1 - top0) * t - sag + jitter(0.03), z, 0.2 + random() * 0.1, 14, 1, 1);
        }
    }

    // A random rank per point, used to show a random 1 in N of them
    const rank = xs.map(() => random());
    return {
        x: Float64Array.from(xs),
        y: Float64Array.from(ys),
        z: Float64Array.from(zs),
        intensity: Float64Array.from(intensity),
        cls: Uint8Array.from(cls),
        ret: Uint8Array.from(ret),
        nRet: Uint8Array.from(nRet),
        rank: Float64Array.from(rank),
        count: xs.length,
        width: WIDTH,
        depth: DEPTH
    };
}

// The control bar, the colour key and the two chart areas each need an element. This splits the page's div
// into them; in your app they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    const font = "14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B; color:#ffffff; font:" + font;
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px;";
    bar.innerHTML =
        `<label>Colour by <select data-id="colour" style="font:inherit">` +
        `<option value="height">Height</option><option value="intensity">Intensity</option>` +
        `<option value="class">Class</option><option value="return">Return number</option></select></label>` +
        `<label>Show <select data-id="filter" style="font:inherit">` +
        `<option value="all">All points, with noise</option><option value="clean" selected>All points, noise removed</option>` +
        `<option value="ground">Ground only (bare earth)</option><option value="above">Ground removed</option></select></label>` +
        `<label>Points <select data-id="decimate" style="font:inherit">` +
        `<option value="1">Every point</option><option value="4">Random 1 in 4</option>` +
        `<option value="16">Random 1 in 16</option><option value="v1">Voxel grid, 1 m</option>` +
        `<option value="v2">Voxel grid, 2 m</option></select></label>` +
        `<label>Point size <input data-id="size" type="range" min="0" max="4" step="1" value="0" style="vertical-align:middle">` +
        ` <span data-id="sizeText">1 pixel</span></label>` +
        `<label>View <select data-id="view" style="font:inherit">` +
        `<option value="3d">3D point cloud</option><option value="2d">Top-down grid, 1 m cells</option></select></label>`;
    const info = document.createElement("div");
    info.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:4px 16px; padding:0 12px 6px; font-size:13px;";
    info.innerHTML = `<span data-id="key" style="display:flex; flex-wrap:wrap; gap:4px 12px; align-items:center"></span>` +
        `<span data-id="readout" aria-live="polite" style="color:#c8d3e8"></span>`;
    const chart3d = document.createElement("div");
    chart3d.id = divElementId + "-3d";
    chart3d.style.cssText = "flex:1; min-height:0;";
    const chart2d = document.createElement("div");
    chart2d.id = divElementId + "-2d";
    chart2d.style.cssText = "flex:1; min-height:0; display:none;";
    root.append(bar, info, chart3d, chart2d);
    const [colourSelect, filterSelect, decimateSelect, viewSelect] = Array.from(bar.querySelectorAll("select"));
    const get = (id) => root.querySelector(`[data-id="${id}"]`);
    return {
        chart3d,
        chart2d,
        colourSelect,
        filterSelect,
        decimateSelect,
        viewSelect,
        sizeSlider: bar.querySelector("input"),
        sizeText: get("sizeText"),
        key: get("key"),
        readout: get("readout")
    };
}

async function pointCloud(divElementId) {
    const ui = createLayout(divElementId);
    const cloud = createScene();

    // #region_A_start
    // A LiDAR point cloud with SciChart.js: about 265,000 points in a 3D scatter chart, coloured by height,
    // intensity, class or return number, with filtering, downsampling and a top-down 2D grid view.
    const {
        SciChart3DSurface,
        SciChartSurface,
        NumericAxis3D,
        NumericAxis,
        NumberRange,
        Vector3,
        XyzDataSeries3D,
        ScatterRenderableSeries3D,
        PixelPointMarker3D,
        QuadPointMarker,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        TooltipModifier3D,
        XyzSeriesInfo3D,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // ASPRS LAS class codes used in this scene, with a colour for each
    const CLASSES = [
        { code: 2, name: "Ground", color: "#B98B5E" },
        { code: 11, name: "Road surface", color: "#9AA3AE" },
        { code: 3, name: "Low vegetation", color: "#B6E35B" },
        { code: 5, name: "High vegetation", color: "#2FAE5B" },
        { code: 6, name: "Building", color: "#EF5350" },
        { code: 9, name: "Water", color: "#3FA9F5" },
        { code: 14, name: "Wire", color: "#FFD54F" },
        { code: 15, name: "Tower", color: "#FF9F1C" },
        { code: 7, name: "Noise (low)", color: "#FF4DFF" },
        { code: 18, name: "Noise (high)", color: "#FF4DFF" }
    ];
    const classIndex = new Map(CLASSES.map((c, i) => [c.code, i]));
    const RETURNS = [
        { name: "Only return", color: "#50C7E0" },
        { name: "First of many", color: "#3BD16F" },
        { name: "Middle", color: "#F6E05E" },
        { name: "Last of many", color: "#F48420" }
    ];
    const returnKind = (i) => (cloud.nRet[i] === 1 ? 0 : cloud.ret[i] === 1 ? 1 : cloud.ret[i] === cloud.nRet[i] ? 3 : 2);
    const HEIGHT_STOPS = ["#2C7BB6", "#00A6CA", "#00CCBC", "#90EB9D", "#FFFF8C", "#F9D057", "#F29E2E", "#E76818", "#D7191C"];

    // Colour helpers: turn a 0..1 value into an ARGB integer along a list of colour stops
    const hexToRgb = (hex) => [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16));
    const argb = (rgb) => (0xff000000 | (rgb[0] << 16) | (rgb[1] << 8) | rgb[2]) >>> 0;
    const heightRgb = HEIGHT_STOPS.map(hexToRgb);
    const ramp = (t) => {
        const f = Math.max(0, Math.min(1, t)) * (heightRgb.length - 1);
        const k = Math.min(heightRgb.length - 2, Math.floor(f));
        const a = heightRgb[k], b = heightRgb[k + 1], u = f - k;
        return argb([0, 1, 2].map((c) => Math.round(a[c] + (b[c] - a[c]) * u)));
    };
    const classArgb = CLASSES.map((c) => argb(hexToRgb(c.color)));
    const returnArgb = RETURNS.map((r) => argb(hexToRgb(r.color)));

    // --- Choosing which points to show: filter by class, then thin out ---
    const isNoise = (c) => c === 7 || c === 18;
    const isGround = (c) => c === 2 || c === 11 || c === 9;
    function selectPoints() {
        const filter = ui.filterSelect.value;
        const decimate = ui.decimateSelect.value;
        const keep = [];
        const voxel = decimate[0] === "v" ? Number(decimate.slice(1)) : 0;
        const fraction = voxel ? 1 : 1 / Number(decimate);
        const voxelsSeen = new Set(); // voxel grid: keep the first point that falls in each cube
        for (let i = 0; i < cloud.count; i++) {
            const c = cloud.cls[i];
            if (filter !== "all" && isNoise(c)) continue;
            if (filter === "ground" && !isGround(c)) continue;
            if (filter === "above" && isGround(c)) continue;
            if (cloud.rank[i] >= fraction) continue;
            if (voxel) {
                const key =
                    (Math.floor(cloud.x[i] / voxel) * 1000 + Math.floor(cloud.z[i] / voxel)) * 1000 +
                    Math.floor((cloud.y[i] + 100) / voxel);
                if (voxelsSeen.has(key)) continue;
                voxelsSeen.add(key);
            }
            keep.push(i);
        }
        return keep;
    }

    // --- The 3D chart. In SciChart.js 3D, Y is up: here, elevation. X is east and Z is north. ---
    const theme = new SciChartJsNavyTheme();
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(ui.chart3d, {
        theme,
        worldDimensions: new Vector3(300, 60, 200), // 150 m × 100 m of ground, with a little height exaggeration
        cameraOptions: { position: new Vector3(-190, 180, -215), target: new Vector3(0, 0, 0) }
    });
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "East (m)",
        labelPrecision: 0,
        visibleRange: new NumberRange(0, cloud.width)
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Elevation (m)", labelPrecision: 0 });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "North (m)",
        labelPrecision: 0,
        visibleRange: new NumberRange(0, cloud.depth)
    });

    const dataSeries = new XyzDataSeries3D(wasmContext, { dataSeriesName: "LiDAR points" });
    const series = new ScatterRenderableSeries3D(wasmContext, {
        dataSeries,
        // One pixel per point is the fastest marker for millions of points
        pointMarker: new PixelPointMarker3D(wasmContext, { fill: "#FFFFFF" })
    });
    sciChart3DSurface.renderableSeries.add(series);
    sciChart3DSurface.chartModifiers.add(
        new OrbitModifier3D(), // drag to rotate
        new MouseWheelZoomModifier3D(), // scroll to zoom
        new ResetCamera3DModifier(), // double-click to reset the view
        new TooltipModifier3D({
            // Hover a point to read its class, return, position and intensity
            tooltipDataTemplate: (info) => {
                if (!(info instanceof XyzSeriesInfo3D) || !info.isHit) return [];
                const i = shown[info.dataSeriesIndex];
                if (i === undefined) return [];
                return [
                    `${CLASSES[classIndex.get(cloud.cls[i])].name}, return ${cloud.ret[i]} of ${cloud.nRet[i]}`,
                    `East ${cloud.x[i].toFixed(1)} m, north ${cloud.z[i].toFixed(1)} m`,
                    `Elevation ${cloud.y[i].toFixed(2)} m, intensity ${cloud.intensity[i].toFixed(2)}`
                ];
            }
        })
    );

    // --- The top-down view: a 2D heatmap with one cell per square metre ---
    const map = await SciChartSurface.create(ui.chart2d, { theme });
    const mapSurface = map.sciChartSurface;
    mapSurface.xAxes.add(new NumericAxis(map.wasmContext, { axisTitle: "East (m)", labelPrecision: 0 }));
    mapSurface.yAxes.add(new NumericAxis(map.wasmContext, { axisTitle: "North (m)", labelPrecision: 0 }));
    const gridColumns = cloud.width;
    const gridRows = cloud.depth;
    const heatmapData = new UniformHeatmapDataSeries(map.wasmContext, {
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1,
        zValues: Array.from({ length: gridRows }, () => new Array(gridColumns).fill(NaN)),
        containsNaN: true // empty cells (no returns) are drawn transparent
    });
    const heatmap = new UniformHeatmapRenderableSeries(map.wasmContext, {
        dataSeries: heatmapData,
        colorMap: new HeatmapColorMap({ minimum: 0, maximum: 1, gradientStops: [] })
    });
    mapSurface.renderableSeries.add(heatmap);
    mapSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            tooltipDataTemplate: (infos) => {
                const info = infos[0];
                if (!info) return [];
                const col = Math.floor(info.xValue);
                const row = Math.floor(info.yValue);
                const value = gridValues[row]?.[col];
                const where = `East ${col} m, north ${row} m`;
                return Number.isFinite(value) ? [where, cellText(value)] : [where, "No returns in this cell"];
            }
        }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // Category colours for the heatmap: the same colour across each category's whole step
    const steppedStops = (colors) =>
        colors.flatMap((color, k) => [
            { offset: k / colors.length, color },
            { offset: (k + 1) / colors.length - 1e-6, color }
        ]);
    let cellText = (value) => `${value.toFixed(1)}`;
    let gridValues = [];

    // --- Redraw both views from the current settings ---
    let shown = [];
    function update() {
        const keep = selectPoints();
        const mode = ui.colourSelect.value;
        // The height colour scale and the vertical axis stretch to the points shown, so stray noise flattens them
        let minY = Infinity, maxY = -Infinity;
        for (const i of keep) {
            if (cloud.y[i] < minY) minY = cloud.y[i];
            if (cloud.y[i] > maxY) maxY = cloud.y[i];
        }
        if (!keep.length) [minY, maxY] = [0, 1];
        const colourOf = (i) => {
            if (mode === "height") return ramp((cloud.y[i] - minY) / (maxY - minY));
            if (mode === "intensity") {
                const v = Math.round(255 * Math.min(1, 0.08 + cloud.intensity[i] * 1.05));
                return argb([v, v, v]);
            }
            if (mode === "class") return classArgb[classIndex.get(cloud.cls[i])];
            return returnArgb[returnKind(i)];
        };

        // 3D: typed arrays for the positions, plus per-point metadata for the colour
        const n = keep.length;
        const xs = new Float64Array(n), ys = new Float64Array(n), zs = new Float64Array(n);
        const metadata = new Array(n);
        keep.forEach((i, k) => {
            xs[k] = cloud.x[i];
            ys[k] = cloud.y[i];
            zs[k] = cloud.z[i];
            metadata[k] = { vertexColor: colourOf(i) }; // ARGB colour of this point
        });
        shown = keep; // which scene point each chart point is, for the tooltip
        dataSeries.clear();
        dataSeries.appendRange(xs, ys, zs, metadata);
        const pad = Math.max(1, (maxY - minY) * 0.05);
        sciChart3DSurface.yAxis.visibleRange = new NumberRange(Math.floor(minY - pad), Math.ceil(maxY + pad));

        // 2D: grid the points into 1 m cells, keeping the highest point in each (a surface model seen from above)
        if (ui.viewSelect.value === "2d") {
            const top = new Int32Array(gridColumns * gridRows).fill(-1);
            const sum = new Float64Array(gridColumns * gridRows);
            const hits = new Uint32Array(gridColumns * gridRows);
            for (const i of keep) {
                const col = Math.min(gridColumns - 1, Math.floor(cloud.x[i]));
                const row = Math.min(gridRows - 1, Math.floor(cloud.z[i]));
                const cell = row * gridColumns + col;
                if (top[cell] < 0 || cloud.y[i] > cloud.y[top[cell]]) top[cell] = i;
                sum[cell] += cloud.intensity[i];
                hits[cell]++;
            }
            const zValues = [];
            for (let row = 0; row < gridRows; row++) {
                const values = new Array(gridColumns);
                for (let col = 0; col < gridColumns; col++) {
                    const cell = row * gridColumns + col;
                    const i = top[cell];
                    if (i < 0) values[col] = NaN;
                    else if (mode === "height") values[col] = cloud.y[i];
                    else if (mode === "intensity") values[col] = sum[cell] / hits[cell]; // mean intensity: an intensity image
                    else if (mode === "class") values[col] = classIndex.get(cloud.cls[i]);
                    else values[col] = returnKind(i);
                }
                zValues.push(values);
            }
            heatmapData.setZValues(zValues);
            gridValues = zValues;
            if (mode === "height") {
                heatmap.colorMap = new HeatmapColorMap({
                    minimum: minY,
                    maximum: maxY,
                    gradientStops: HEIGHT_STOPS.map((color, k) => ({ offset: k / (HEIGHT_STOPS.length - 1), color }))
                });
                cellText = (v) => `Highest point ${v.toFixed(2)} m`;
            } else if (mode === "intensity") {
                heatmap.colorMap = new HeatmapColorMap({
                    minimum: 0,
                    maximum: 0.9,
                    gradientStops: [{ offset: 0, color: "#141414" }, { offset: 1, color: "#FFFFFF" }]
                });
                cellText = (v) => `Mean intensity ${v.toFixed(2)}`;
            } else {
                const list = mode === "class" ? CLASSES : RETURNS;
                heatmap.colorMap = new HeatmapColorMap({
                    minimum: -0.5,
                    maximum: list.length - 0.5,
                    gradientStops: steppedStops(list.map((c) => c.color))
                });
                cellText = (v) => `Top point: ${list[Math.round(v)].name}`;
            }
        }
        renderKey(mode, minY, maxY);
        ui.readout.textContent = `Showing ${n.toLocaleString("en-GB")} of ${cloud.count.toLocaleString("en-GB")} points`;
    }

    // Point size: one pixel, or camera-facing squares sized in metres (2 world units = 1 m here)
    const SIZES = [0, 0.25, 0.5, 0.75, 1];
    function setPointSize() {
        const metres = SIZES[Number(ui.sizeSlider.value)];
        ui.sizeText.textContent = metres ? `${metres} m` : "1 pixel";
        ui.sizeSlider.setAttribute("aria-valuetext", ui.sizeText.textContent);
        series.pointMarker = metres
            ? new QuadPointMarker(wasmContext, { size: metres * 2, fill: "#FFFFFF" })
            : new PixelPointMarker3D(wasmContext, { fill: "#FFFFFF" });
    }

    // A colour key for the current colouring
    function renderKey(mode, minY, maxY) {
        const swatch = (color, name) =>
            `<span style="display:inline-flex; align-items:center; gap:4px"><span style="width:12px; height:12px; ` +
            `border-radius:2px; background:${color}"></span>${name}</span>`;
        if (mode === "height") {
            ui.key.innerHTML = `${minY.toFixed(0)} m <span style="display:inline-block; width:140px; height:10px; ` +
                `border-radius:2px; background:linear-gradient(to right, ${HEIGHT_STOPS.join(", ")})"></span> ${maxY.toFixed(0)} m`;
        } else if (mode === "intensity") {
            ui.key.innerHTML = `Low <span style="display:inline-block; width:140px; height:10px; border-radius:2px; ` +
                `background:linear-gradient(to right, #141414, #FFFFFF)"></span> High intensity`;
        } else if (mode === "class") {
            ui.key.innerHTML = CLASSES.filter((c) => c.code !== 7).map((c) => swatch(c.color, c.code === 18 ? "Noise" : c.name)).join("");
        } else {
            ui.key.innerHTML = RETURNS.map((r) => swatch(r.color, r.name)).join("");
        }
    }

    function setView() {
        const is2d = ui.viewSelect.value === "2d";
        ui.chart3d.style.display = is2d ? "none" : "";
        ui.chart2d.style.display = is2d ? "" : "none";
        update();
        if (is2d) mapSurface.zoomExtents();
    }

    ui.colourSelect.addEventListener("change", update);
    ui.filterSelect.addEventListener("change", update);
    ui.decimateSelect.addEventListener("change", update);
    ui.sizeSlider.addEventListener("input", setPointSize);
    ui.viewSelect.addEventListener("change", setView);
    setPointSize();
    update();
    // #region_A_end
}

pointCloud("scichart-root");
