import * as SciChart from "scichart";

// The controls, the readout and the two charts each need an element. This splits the page's div into a control bar,
// a readout line, a polar chart and a 3D chart with a colour key; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B; color:#ffffff;" + font;
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px;";
    const slider = (id, label, min, max, step, value, width) =>
        `<label data-for="${id}">${label} <input data-id="${id}" type="range" min="${min}" max="${max}" step="${step}" ` +
        `value="${value}" style="vertical-align:middle; width:${width}px"> <output data-id="${id}"></output></label>`;
    bar.innerHTML =
        `<label>Antenna <select data-id="type" style="font:inherit">` +
        `<option value="halfwave">Half-wave dipole</option><option value="short">Short dipole</option>` +
        `<option value="monopole">Quarter-wave monopole</option><option value="patch">Patch</option>` +
        `<option value="yagi">Yagi-Uda</option><option value="array" selected>Linear phased array</option></select></label>` +
        slider("elements", "Elements", 2, 16, 1, 8, 90) +
        slider("spacing", "Spacing", 0.1, 1, 0.05, 0.5, 90) +
        slider("steer", "Steering", -60, 60, 1, 20, 110) +
        `<label data-for="reflector"><input data-id="reflector" type="checkbox" checked> Reflector behind array</label>` +
        `<label>Scale <select data-id="scale" style="font:inherit">` +
        `<option value="db">dB (40 dB range)</option><option value="linear">Linear power</option></select></label>`;
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:2px 12px 6px; color:#dfe7f5; font-size:13px; line-height:1.5;";
    const charts = document.createElement("div");
    charts.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const polarDiv = document.createElement("div");
    polarDiv.id = divElementId + "-polar"; // each chart's div needs its own id
    polarDiv.style.cssText = "flex:1 1 360px; min-height:360px;";
    const right = document.createElement("div");
    right.style.cssText = "flex:1 1 360px; min-height:360px; display:flex; flex-direction:column;";
    const chart3dDiv = document.createElement("div");
    chart3dDiv.id = divElementId + "-3d";
    chart3dDiv.style.cssText = "flex:1; min-height:0;";
    const key = document.createElement("div");
    key.style.cssText = "display:flex; align-items:center; gap:8px; padding:4px 12px 8px; font-size:12px; color:#dfe7f5;";
    key.innerHTML =
        `<span>3D colour = gain</span><span data-id="key-min"></span>` +
        `<span data-id="key-bar" style="flex:1; max-width:220px; height:10px; border-radius:5px"></span><span>0 dB (peak)</span>`;
    right.append(chart3dDiv, key);
    charts.append(polarDiv, right);
    root.append(bar, readout, charts);
    const get = (selector) => root.querySelector(selector);
    return {
        polarDiv,
        chart3dDiv,
        readout,
        keyMin: get('span[data-id="key-min"]'),
        keyBar: get('span[data-id="key-bar"]'),
        typeSelect: get('select[data-id="type"]'),
        scaleSelect: get('select[data-id="scale"]'),
        elementsInput: get('input[data-id="elements"]'),
        elementsOutput: get('output[data-id="elements"]'),
        spacingInput: get('input[data-id="spacing"]'),
        spacingOutput: get('output[data-id="spacing"]'),
        steerInput: get('input[data-id="steer"]'),
        steerOutput: get('output[data-id="steer"]'),
        reflectorCheckbox: get('input[data-id="reflector"]'),
        labelFor: (id) => get(`label[data-for="${id}"]`)
    };
}

async function antennaRadiationPatternChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Antenna radiation patterns as a polar plot (E-plane and H-plane cuts) and a 3D surface, charted with SciChart.js
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarLineRenderableSeries,
        EPolarAxisMode,
        EPolarLabelMode,
        EAxisAlignment,
        NumberRange,
        XyDataSeries,
        PolarCursorModifier,
        PolarLegendModifier,
        PolarMouseWheelZoomModifier,
        PolarPanModifier,
        PolarZoomExtentsModifier,
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        BaseSceneEntity3D,
        ESceneEntityType,
        ImmediateLitMeshContext,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartPolarSurface, ... } from "scichart"

    // --- Pattern maths (plain JavaScript, no library needed) ---
    // Directions are unit vectors (ux, uy, uz) with z up. Every antenna's main beam lies in the horizontal plane;
    // the directional ones point along +x. Spacing and patch sizes are in wavelengths, so k = 2π.
    const TWO_PI = 2 * Math.PI;
    const PATCH_LENGTH = 0.35; // effective distance between the patch's two radiating edges (along z)
    const PATCH_WIDTH = 0.4; // width of the radiating edges (along y)

    // Normalised array factor of n equal elements with phase step psi: |Σ e^(j·i·psi)| / n
    function arrayFactor(n, psi) {
        const sinHalf = Math.sin(psi / 2);
        if (Math.abs(sinHalf) < 1e-9) return 1;
        return Math.abs(Math.sin((n * psi) / 2) / (n * sinHalf));
    }

    // Half-wave dipole along z: cos(π/2 · cos θ) / sin θ, where cos θ = uz
    function halfWaveDipole(uz) {
        const sin2 = 1 - uz * uz;
        return sin2 < 1e-12 ? 0 : Math.abs(Math.cos((Math.PI / 2) * uz)) / Math.sqrt(sin2);
    }

    // Relative far-field strength |F| in direction (ux, uy, uz)
    function fieldPattern(antenna, ux, uy, uz) {
        const { type, elements, spacing, steerDeg, reflector } = antenna;
        switch (type) {
            case "short": // short (Hertzian) dipole along z: sin θ
                return Math.sqrt(Math.max(0, 1 - uz * uz));
            case "halfwave":
                return halfWaveDipole(uz);
            case "monopole": // quarter-wave monopole on a large ground plane: the dipole's top half
                return uz < 0 ? 0 : halfWaveDipole(uz);
            case "patch": {
                // Two radiating slots facing +x over a ground plane (cavity model): nothing behind the ground plane
                if (ux <= 0) return 0;
                const a = Math.PI * PATCH_WIDTH * uy; // (k·W/2)·uy
                const slot = Math.abs(a) < 1e-9 ? 1 : Math.sin(a) / a;
                const pair = Math.cos(Math.PI * PATCH_LENGTH * uz); // two slots a distance L apart
                const sin2 = 1 - ux * ux;
                const polarisation = sin2 < 1e-12 ? 1 : (uz * uz + ux * ux * uy * uy) / sin2;
                return Math.abs(slot * pair) * Math.sqrt(polarisation);
            }
            case "yagi": {
                // Approximation: an end-fire row of half-wave dipoles along x with the Hansen-Woodyard phase delay
                const kd = TWO_PI * spacing;
                const psi = kd * ux - (kd + Math.PI / elements);
                return halfWaveDipole(uz) * arrayFactor(elements, psi);
            }
            case "array": {
                // A row of half-wave dipoles along y, phased to steer the beam steerDeg from broadside (+x)
                const kd = TWO_PI * spacing;
                const psi = kd * uy - kd * Math.sin((steerDeg * Math.PI) / 180);
                let field = halfWaveDipole(uz) * arrayFactor(elements, psi);
                if (reflector) field *= ux > 0 ? Math.sin((Math.PI / 2) * ux) : 0; // flat reflector λ/4 behind
                return field;
            }
            default:
                return 1; // isotropic
        }
    }

    const toDb = (power) => 10 * Math.log10(Math.max(power, 1e-12));

    // Directivity by numerical integration over the sphere (1° steps), and the direction of the peak
    function analyse(antenna) {
        const step = Math.PI / 180;
        let total = 0;
        let peak = 0;
        let peakTheta = Math.PI / 2;
        let peakPhi = 0;
        for (let i = 0; i < 180; i++) {
            const theta = (i + 0.5) * step; // midpoint rule in θ
            const sinT = Math.sin(theta);
            const cosT = Math.cos(theta);
            for (let j = 0; j < 360; j++) {
                const phi = j * step;
                const f = fieldPattern(antenna, sinT * Math.cos(phi), sinT * Math.sin(phi), cosT);
                total += f * f * sinT;
            }
        }
        total *= step * step;
        // Find the peak on a finer grid near the horizon, where every antenna here has its main beam
        for (let i = 0; i <= 180; i++) {
            const theta = (i * Math.PI) / 360 + Math.PI / 4; // 45° to 135°
            for (let j = 0; j < 1440; j++) {
                const phi = (j * Math.PI) / 720;
                const f = fieldPattern(antenna, Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta));
                if (f * f > peak * (1 + 1e-9)) {
                    peak = f * f;
                    peakTheta = theta;
                    peakPhi = phi;
                }
            }
        }
        return { directivity: (4 * Math.PI * peak) / total, peak, peakTheta, peakPhi };
    }

    // A planar cut through the beam: the E-plane (vertical, containing the beam) or H-plane (horizontal) cut.
    // Angles in degrees, 0.5° steps; gain in dB relative to the peak.
    function patternCut(antenna, plane, analysis) {
        const angles = [];
        const gainDb = [];
        const cosP = Math.cos(analysis.peakPhi);
        const sinP = Math.sin(analysis.peakPhi);
        for (let i = 0; i <= 720; i++) {
            const deg = i / 2;
            const a = (deg * Math.PI) / 180;
            // E-plane: 0° is the beam direction on the horizon and 90° straight up. H-plane: compass azimuth from +x
            const u = plane === "E" ? [Math.cos(a) * cosP, Math.cos(a) * sinP, Math.sin(a)] : [Math.cos(a), Math.sin(a), 0];
            const f = fieldPattern(antenna, u[0], u[1], u[2]);
            angles.push(deg);
            gainDb.push(toDb((f * f) / analysis.peak));
        }
        return { angles, gainDb, beamDeg: plane === "E" ? 0 : (analysis.peakPhi * 180) / Math.PI };
    }

    // Half-power beamwidth and first side lobe of one cut, walking out from the beam on both sides
    function beamMetrics(cut) {
        const n = cut.gainDb.length - 1; // 720 steps of 0.5°, the last equal to the first
        const at = (k) => cut.gainDb[((k % n) + n) % n];
        const start = Math.round(cut.beamDeg * 2);
        const top = at(start);
        let width = 0;
        let sideLobe = -Infinity;
        for (const dir of [-1, 1]) {
            let k = 1;
            while (k < n / 2 && at(start + dir * k) >= top - 3) k++;
            if (k >= n / 2) return { hpbw: 360, sideLobe: null }; // never 3 dB down: omnidirectional in this plane
            const g0 = at(start + dir * (k - 1));
            const g1 = at(start + dir * k);
            width += (k - 1 + (g0 - (top - 3)) / (g0 - g1)) / 2; // linear interpolation, in degrees
            while (k < n / 2 && at(start + dir * (k + 1)) <= at(start + dir * k)) k++; // down to the first null
            while (k < n / 2 && at(start + dir * (k + 1)) > at(start + dir * k)) k++; // up to the next lobe
            const backward = Math.abs(k - n / 2) <= 2; // a lobe pointing straight back is the back lobe
            if (k < n / 2 && !backward) sideLobe = Math.max(sideLobe, at(start + dir * k) - top);
        }
        return { hpbw: width, sideLobe: Number.isFinite(sideLobe) && sideLobe > -40 ? sideLobe : null };
    }

    // Front-to-back ratio: the peak against the same elevation at the opposite azimuth (180° behind the beam)
    function frontToBack(antenna, analysis) {
        const ux = Math.sin(analysis.peakTheta) * Math.cos(analysis.peakPhi);
        const uy = Math.sin(analysis.peakTheta) * Math.sin(analysis.peakPhi);
        const f = fieldPattern(antenna, -ux, -uy, Math.cos(analysis.peakTheta));
        return -toDb((f * f) / analysis.peak);
    }

    // Gain (dB) to colour: navy, blue, cyan, green, yellow, red
    const STOPS = [[31, 58, 147], [47, 111, 222], [80, 199, 224], [59, 209, 111], [244, 208, 63], [239, 83, 80]];
    function gainColour(t) {
        const x = Math.min(1, Math.max(0, t)) * (STOPS.length - 1);
        const i = Math.min(STOPS.length - 2, Math.floor(x));
        const f = x - i;
        const c = STOPS[i].map((v, m) => Math.round(v + f * (STOPS[i + 1][m] - v)));
        return ((0xff << 24) | (c[0] << 16) | (c[1] << 8) | c[2]) >>> 0;
    }

    // The 3D surface: radius from the gain (dB above the floor, or linear power), sampled every 3° in θ and φ
    const STEP_DEG = 3;
    const N_THETA = 180 / STEP_DEG + 1;
    const N_PHI = 360 / STEP_DEG;
    function buildMesh(antenna, analysis, scale, floorDb) {
        const points = [];
        const colours = [];
        for (let i = 0; i < N_THETA; i++) {
            const theta = (i * STEP_DEG * Math.PI) / 180;
            for (let j = 0; j < N_PHI; j++) {
                const phi = (j * STEP_DEG * Math.PI) / 180;
                const u = [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta)];
                const f = fieldPattern(antenna, u[0], u[1], u[2]);
                const power = (f * f) / analysis.peak;
                const db = toDb(power);
                const r = scale === "db" ? Math.max(0, (db - floorDb) / -floorDb) : power;
                points.push([r * u[0], r * u[1], r * u[2]]);
                colours.push(gainColour((db - floorDb) / -floorDb));
            }
        }
        // Smooth normals from neighbouring points on the grid; where the surface pinches to a point, use the radial direction
        const p = (i, j) => points[Math.min(N_THETA - 1, Math.max(0, i)) * N_PHI + ((j + N_PHI) % N_PHI)];
        const normals = points.map((point, index) => {
            const i = Math.floor(index / N_PHI);
            const j = index % N_PHI;
            const a = p(i + 1, j).map((v, m) => v - p(i - 1, j)[m]);
            const b = p(i, j + 1).map((v, m) => v - p(i, j - 1)[m]);
            let n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
            let length = Math.hypot(n[0], n[1], n[2]);
            if (length < 1e-9) {
                const theta = (i * STEP_DEG * Math.PI) / 180;
                const phi = (j * STEP_DEG * Math.PI) / 180;
                n = [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta)];
                length = 1;
            }
            const sign = n[0] * point[0] + n[1] * point[1] + n[2] * point[2] < 0 ? -1 : 1; // point outwards
            return n.map((v) => (sign * v) / length);
        });
        return { points, colours, normals };
    }

    // --- The polar chart: E-plane and H-plane cuts, with a −3 dB circle ---
    const theme = new SciChartJsNavyTheme();
    const COLOUR_E = "#F48420";
    const COLOUR_H = "#50C7E0";
    const polar = await SciChartPolarSurface.create(ui.polarDiv, { theme });
    const angleAxis = new PolarNumericAxis(polar.wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, 360),
        autoTicks: false,
        majorDelta: 30,
        polarLabelMode: EPolarLabelMode.Horizontal,
        drawMinorGridLines: false
    });
    angleAxis.labelProvider.formatLabel = (value) => (value >= 360 ? "" : `${value.toFixed(0)}°`);
    polar.sciChartSurface.xAxes.add(angleAxis);
    const radiusAxis = new PolarNumericAxis(polar.wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        autoTicks: false,
        drawMinorGridLines: false
    });
    polar.sciChartSurface.yAxes.add(radiusAxis);
    const polarLine = (name, stroke, extra = {}) => {
        const series = new PolarLineRenderableSeries(polar.wasmContext, {
            dataSeries: new XyDataSeries(polar.wasmContext, { dataSeriesName: name }),
            stroke,
            strokeThickness: 2.5,
            ...extra
        });
        polar.sciChartSurface.renderableSeries.add(series);
        return series;
    };
    const halfPower = polarLine("−3 dB", "#FFFFFF", { strokeThickness: 1.5, strokeDashArray: [6, 4] });
    const eCut = polarLine("E-plane", COLOUR_E);
    const hCut = polarLine("H-plane", COLOUR_H);
    polar.sciChartSurface.chartModifiers.add(
        new PolarCursorModifier({ showTooltip: true }),
        new PolarLegendModifier({ showCheckboxes: true, showSeriesMarkers: true }),
        new PolarMouseWheelZoomModifier(),
        new PolarPanModifier(),
        new PolarZoomExtentsModifier()
    );

    // --- The 3D chart: the whole pattern as a lit surface, coloured by gain ---
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(ui.chart3dDiv, {
        theme,
        worldDimensions: new Vector3(200, 200, 200),
        cameraOptions: { position: new Vector3(150, 190, -330), target: new Vector3(0, 100, 0) }
    });
    const axis3d = (title) => new NumericAxis3D(wasmContext, { axisTitle: title, visibleRange: new NumberRange(-1.1, 1.1), labelPrecision: 1 });
    sciChart3DSurface.xAxis = axis3d("x (boresight)");
    sciChart3DSurface.yAxis = axis3d("z (up)");
    sciChart3DSurface.zAxis = axis3d("y");
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D(), new MouseWheelZoomModifier3D(), new ResetCamera3DModifier());

    // SciChart.js has no built-in series for a closed surface of any shape, so this scene entity draws the
    // triangles itself with ImmediateLitMeshContext, in data coordinates (chart X = x, chart Y = z up, chart Z = y)
    let mesh = null;
    class RadiationPatternMesh extends BaseSceneEntity3D<any> {
        type = ESceneEntityType.Custom;
        constructor(context) {
            super(context);
            this.setNativeEntity(context.SCRTSceneEntity.implement(this));
        }
        Render() {
            if (!this.isVisible || !this.currentRenderPassData || !mesh) return;
            const { xCalc, yCalc, zCalc, worldDimensions } = this.currentRenderPassData;
            const context = new ImmediateLitMeshContext(this.webAssemblyContext, this.webAssemblyContext.eTSRRenderMode.TSR_RENDERMODE_TRIANGLES);
            const emit = (index) => {
                const [x, y, z] = mesh.points[index];
                const [nx, ny, nz] = mesh.normals[index];
                context.normal3(nx, nz, ny);
                context.setVertexColor(mesh.colours[index]);
                context.setVertex3(xCalc.getCoordinate(x) - worldDimensions.x / 2, yCalc.getCoordinate(z), zCalc.getCoordinate(y) - worldDimensions.z / 2);
            };
            for (let i = 0; i < N_THETA - 1; i++) {
                for (let j = 0; j < N_PHI; j++) {
                    const a = i * N_PHI + j;
                    const b = i * N_PHI + ((j + 1) % N_PHI);
                    const c = a + N_PHI;
                    const d = b + N_PHI;
                    [a, c, b, b, c, d].forEach(emit); // two triangles per grid cell
                }
            }
            context.dispose();
        }
    }
    sciChart3DSurface.rootEntity.children.add(new RadiationPatternMesh(wasmContext));

    // --- The controls ---
    const FLOOR_DB = -40;
    const toXy = (series, x, y) => {
        series.dataSeries.clear();
        series.dataSeries.appendRange(x, y);
    };
    const formatDb = (v) => (v === null ? "none" : `${v.toFixed(1)} dB`);

    function update() {
        const type = ui.typeSelect.value;
        const scale = ui.scaleSelect.value;
        const antenna = {
            type,
            elements: Number(ui.elementsInput.value),
            spacing: Number(ui.spacingInput.value),
            steerDeg: Number(ui.steerInput.value),
            reflector: ui.reflectorCheckbox.checked
        };
        ui.elementsOutput.textContent = String(antenna.elements);
        ui.spacingOutput.textContent = `${antenna.spacing.toFixed(2)} λ`;
        ui.steerOutput.textContent = `${antenna.steerDeg}°`;
        // Only show the controls that apply to the chosen antenna
        const isArray = type === "array" || type === "yagi";
        for (const id of ["elements", "spacing"]) ui.labelFor(id).style.display = isArray ? "" : "none";
        for (const id of ["steer", "reflector"]) ui.labelFor(id).style.display = type === "array" ? "" : "none";

        const analysis = analyse(antenna);
        const e = patternCut(antenna, "E", analysis);
        const h = patternCut(antenna, "H", analysis);
        const radius = (db) => (scale === "db" ? Math.max(db, FLOOR_DB) : Math.pow(10, db / 10));
        toXy(eCut, e.angles, e.gainDb.map(radius));
        toXy(hCut, h.angles, h.gainDb.map(radius));
        toXy(halfPower, e.angles, e.angles.map(() => (scale === "db" ? -3 : 0.5)));
        radiusAxis.visibleRange = scale === "db" ? new NumberRange(FLOOR_DB, 0) : new NumberRange(0, 1);
        radiusAxis.majorDelta = scale === "db" ? 10 : 0.25;
        radiusAxis.labelProvider.formatLabel = (value) => (scale === "db" ? (value === 0 ? "0 dB" : value.toFixed(0)) : value.toFixed(2));

        mesh = buildMesh(antenna, analysis, scale, FLOOR_DB);
        sciChart3DSurface.invalidateElement();
        ui.keyMin.textContent = `${FLOOR_DB} dB`;
        ui.keyBar.style.background = `linear-gradient(to right, ${STOPS.map((c) => `rgb(${c.join(",")})`).join(", ")})`;

        const eMetrics = beamMetrics(e);
        const hMetrics = beamMetrics(h);
        const dBi = 10 * Math.log10(analysis.directivity);
        const fb = frontToBack(antenna, analysis);
        const beamAz = Math.round((analysis.peakPhi * 180) / Math.PI);
        const grating = type === "array" && antenna.spacing * (1 + Math.abs(Math.sin((antenna.steerDeg * Math.PI) / 180))) >= 1;
        const width = (m) => (m.hpbw >= 360 ? "omni" : `${m.hpbw.toFixed(1)}°`);
        ui.readout.textContent =
            `Directivity ${dBi.toFixed(2)} dBi (${(dBi - 2.15).toFixed(2)} dBd) · ` +
            `beam at azimuth ${beamAz > 180 ? beamAz - 360 : beamAz}° · ` +
            `HPBW E-plane ${width(eMetrics)}, H-plane ${width(hMetrics)} · ` +
            `front-to-back ${fb > 40 ? "> 40 dB" : `${fb.toFixed(1)} dB`} · ` +
            `first side lobe E ${formatDb(eMetrics.sideLobe)}, H ${formatDb(hMetrics.sideLobe)}` +
            (grating ? " · grating lobe: spacing too wide for this steering angle" : "") +
            (type === "array" && !antenna.reflector ? ` · mirror-image beam at azimuth ${180 - antenna.steerDeg}° (no reflector)` : "");
    }

    ui.typeSelect.addEventListener("change", () => {
        // Typical starting points: a 6-element Yagi with directors about 0.25 λ apart; an 8-element array at 0.5 λ
        if (ui.typeSelect.value === "yagi") {
            ui.spacingInput.value = "0.25";
            ui.elementsInput.value = "6";
        }
        if (ui.typeSelect.value === "array") {
            ui.spacingInput.value = "0.5";
            ui.elementsInput.value = "8";
        }
        update();
    });
    for (const input of [ui.elementsInput, ui.spacingInput, ui.steerInput]) input.addEventListener("input", update);
    ui.reflectorCheckbox.addEventListener("change", update);
    ui.scaleSelect.addEventListener("change", update);
    update();
    // #region_A_end
}

antennaRadiationPatternChart("scichart-root");
