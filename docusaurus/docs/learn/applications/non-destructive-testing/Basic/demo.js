import * as SciChart from "scichart";

// A simulated ultrasonic inspection of a steel plate, 100 mm long and 60 mm wide, with two flaws:
// a planar crack lying parallel to the surface, and a 3 mm side-drilled hole running across the plate.
// A 5 MHz, 10 mm contact probe sends a short pulse into the plate and records the echoes (pulse-echo).
// The physics is deliberately simple: a Gaussian-windowed 5 MHz tone burst, a small material attenuation,
// a beam that widens with depth (a lateral Gaussian), and flat reflectors that return sound only near
// normal incidence. A seeded random generator adds grain and electronic noise, so the data is the same
// every time for the same settings.
const VELOCITY = 5.92; // mm/µs: longitudinal sound velocity in low-alloy steel, 5,920 m/s
const FREQUENCY = 5; // MHz
const PROBE_DIAMETER = 10; // mm
const WAVELENGTH = VELOCITY / FREQUENCY; // 1.18 mm
const NEAR_FIELD = (PROBE_DIAMETER * PROBE_DIAMETER) / (4 * WAVELENGTH); // about 21 mm
const PULSE_WIDTH = 0.12; // µs, the standard deviation of the pulse's Gaussian window
const ATTENUATION = 0.01; // dB per mm, one way
const DISPLAY_SCALE = 13; // sets where echoes sit on the screen at a given gain
const PLATE = { length: 100, width: 60 }; // mm
const CRACK = { x: 35, y: 30 }; // centre of the planar crack (square, side set by the Size control)
const HOLE = { x: 70, yFrom: 10, yTo: 50, radius: 1.5 }; // side-drilled hole, axis along y
const SCAN_LINE_Y = 30; // the B-scan and the probe slider follow this line

function erf(x) {
    // Abramowitz and Stegun 7.1.26, accurate to about 1e-7
    const sign = x < 0 ? -1 : 1;
    const a = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * a);
    const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
    return sign * (1 - poly * Math.exp(-a * a));
}
// Fraction of a Gaussian beam profile (centre, sigma) that falls between a and b
function fractionInside(a, b, centre, sigma) {
    const k = sigma * Math.SQRT2;
    return 0.5 * (erf((b - centre) / k) - erf((a - centre) / k));
}
// The beam's lateral width grows with distance, slowly in the near field and linearly beyond it
const beamSigma = (path, focus = 1) => focus * (PROBE_DIAMETER / 4) * Math.sqrt(1 + (path / NEAR_FIELD) ** 2);
const materialLoss = (path) => Math.pow(10, (-ATTENUATION * 2 * path) / 20);

// The echoes a probe at (px, py) receives, with the beam steered angleDeg from straight down.
// Each echo has a sound path (mm, one way) and a raw amplitude. focus < 1 narrows the beam, as a
// phased array's focal law does.
function echoesAt(block, px, py, angleDeg, focus = 1) {
    const { thickness, crackDepth, crackSize, holeDepth, withFlaws } = block;
    const theta = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const specular = Math.exp(-0.5 * (angleDeg / 4) ** 2); // flat reflectors send sound back only near 90°
    const echoes = [];
    let shadow = 0;
    if (withFlaws) {
        // Crack: a horizontal square at crackDepth; its echo is the share of the beam that lands on it
        const crackPath = crackDepth / cos;
        const footprint = beamSigma(crackPath, focus);
        const hitX = px + crackDepth * Math.tan(theta);
        const half = crackSize / 2;
        const crackShare =
            fractionInside(CRACK.x - half, CRACK.x + half, hitX, footprint / cos) *
            fractionInside(CRACK.y - half, CRACK.y + half, py, footprint);
        echoes.push({ name: "Crack", path: crackPath, amplitude: crackShare * specular * materialLoss(crackPath) });
        // Side-drilled hole: a cylinder returns some sound at any angle, but its curved face scatters most away
        const dx = HOLE.x - px;
        const along = dx * sin + holeDepth * cos;
        const across = dx * cos - holeDepth * sin;
        const holeSigma = beamSigma(along, focus);
        const holeShare =
            fractionInside(-HOLE.radius, HOLE.radius, across, holeSigma) *
            fractionInside(HOLE.yFrom, HOLE.yTo, py, holeSigma);
        const holePath = along - HOLE.radius;
        echoes.push({ name: "Hole", path: holePath, amplitude: 0.9 * holeShare * materialLoss(holePath) });
        shadow = Math.min(1, crackShare + 0.7 * holeShare); // flaws block part of the sound to the back wall
    }
    // Back wall: a large flat reflector; diffraction makes its echo fall slowly with distance
    const backPath = thickness / cos;
    const back = (specular * (1 - shadow) * materialLoss(backPath)) / Math.sqrt(1 + (backPath / NEAR_FIELD) ** 2);
    echoes.push({ name: "Back wall", path: backPath, amplitude: back });
    return echoes;
}

// Seeded random numbers, one stream per probe position and angle
function makeRandom(seed) {
    let s = seed >>> 0 || 1;
    const random = () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    return { random, gaussian };
}
const seedFor = (px, py, angleDeg) => Math.round(px * 2) * 92821 + Math.round(py * 2) * 689 + (angleDeg + 90) * 7 + 1;

// The received signal at the given times (µs), as a complex (analytic) signal: re is the RF waveform,
// and the magnitude of (re, im) is its envelope. Each echo is a Gaussian-windowed 5 MHz tone burst.
function receivedSignal(echoes, times, noiseLevel, seed, initialPulse) {
    const n = times.length;
    const re = new Float64Array(n);
    const im = new Float64Array(n);
    const dt = n > 1 ? times[1] - times[0] : 1;
    const t0 = times[0];
    const addBurst = (centre, amplitude, sigma) => {
        const first = Math.max(0, Math.ceil((centre - 5 * sigma - t0) / dt));
        const last = Math.min(n - 1, Math.floor((centre + 5 * sigma - t0) / dt));
        for (let i = first; i <= last; i++) {
            const u = times[i] - centre;
            const a = amplitude * Math.exp(-0.5 * (u / sigma) ** 2);
            const phase = 2 * Math.PI * FREQUENCY * u;
            re[i] += a * Math.cos(phase);
            im[i] += a * Math.sin(phase);
        }
    };
    if (initialPulse) addBurst(0, 40, 0.3); // the transmitted pulse and the probe's ring-down
    for (const echo of echoes) addBurst((2 * echo.path) / VELOCITY, echo.amplitude, PULSE_WIDTH);
    const rng = makeRandom(seed);
    // Grain noise: weak echoes from the steel's grains, at random depths, fixed for each probe position
    for (let k = 0; k < 80; k++) {
        const centre = rng.random() * 25;
        const amplitude = 0.13 * noiseLevel * Math.sqrt(-2 * Math.log(1 - rng.random())) * 0.5;
        addBurst(centre, amplitude * (rng.random() < 0.5 ? -1 : 1), PULSE_WIDTH);
    }
    // Electronic noise from the receiver
    for (let i = 0; i < n; i++) {
        re[i] += 0.01 * noiseLevel * rng.gaussian();
        im[i] += 0.01 * noiseLevel * rng.gaussian();
    }
    return { re, im };
}

// The controls, the readout and the four charts each need an element. This splits the page's div into them;
// in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const bar = document.createElement("div");
    bar.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const slider = (id, label, min, max, step, value) =>
        `<label>${label} <input data-id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" ` +
        `style="vertical-align:middle; width:90px"> <output data-id="${id}"></output></label>`;
    bar.innerHTML =
        slider("position", "Probe position", 0, 100, 0.5, 35) +
        `<button data-id="scan" type="button" style="font:inherit; padding:2px 12px; cursor:pointer">Scan</button>` +
        slider("thickness", "Plate thickness", 10, 50, 1, 25) +
        slider("crackDepth", "Crack depth", 2, 23, 0.5, 12) +
        slider("crackSize", "Crack size", 1, 15, 0.5, 8) +
        slider("holeDepth", "Hole depth", 3, 22, 0.5, 18) +
        slider("gain", "Gain", 0, 50, 1, 20) +
        slider("gateStart", "Gate start", 1, 60, 0.5, 5) +
        slider("gateWidth", "Gate width", 2, 40, 0.5, 12) +
        slider("noise", "Noise", 0, 100, 1, 30) +
        `<label>C-scan shows <select data-id="cMode" style="font:inherit">` +
        `<option value="amplitude">Peak amplitude in gate</option><option value="depth">Depth of gated echo</option>` +
        `</select></label>` +
        `<span data-id="summary" aria-live="polite" style="flex-basis:100%; color:#c8d3e8"></span>`;
    const grid = document.createElement("div");
    grid.style.cssText = "flex:1; min-height:0; display:grid; grid-template-columns:3fr 2fr; grid-template-rows:1fr 1fr;";
    const makeDiv = (name) => {
        const div = document.createElement("div");
        div.id = `${divElementId}-${name}`;
        div.style.cssText = "min-width:0; min-height:0;";
        return div;
    };
    const aScanDiv = makeDiv("ascan");
    const sScanDiv = makeDiv("sscan");
    const bScanDiv = makeDiv("bscan");
    const cScanDiv = makeDiv("cscan");
    grid.append(aScanDiv, sScanDiv, bScanDiv, cScanDiv);
    root.append(bar, grid);
    const get = (selector) => bar.querySelector(selector);
    const ids = ["position", "thickness", "crackDepth", "crackSize", "holeDepth", "gain", "gateStart", "gateWidth", "noise"];
    const inputs = Object.fromEntries(ids.map((id) => [id, get(`input[data-id="${id}"]`)]));
    const outputs = Object.fromEntries(ids.map((id) => [id, get(`output[data-id="${id}"]`)]));
    return {
        aScanDiv,
        sScanDiv,
        bScanDiv,
        cScanDiv,
        inputs,
        outputs,
        scanButton: get('button[data-id="scan"]'),
        cModeSelect: get('select[data-id="cMode"]'),
        summary: get('span[data-id="summary"]')
    };
}

async function ultrasonicTestingChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Ultrasonic testing of a steel plate: an A-scan with a gate, a B-scan cross-section, a C-scan plan view
    // and a phased-array sector scan (S-scan), charted with SciChart.js
    const {
        SciChartSurface,
        SciChartPolarSurface,
        NumericAxis,
        PolarNumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EPolarAxisMode,
        FastLineRenderableSeries,
        XyDataSeries,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        PolarUniformHeatmapRenderableSeries,
        HeatmapColorMap,
        LineAnnotation,
        TextAnnotation,
        VerticalLineAnnotation,
        HorizontalLineAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        ELegendOrientation,
        ELegendPlacement,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        PolarMouseWheelZoomModifier,
        PolarPanModifier,
        PolarZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const GATE_LEVEL = 20; // % of full screen height: echoes in the gate must cross this to count
    const SAMPLE_STEP = 0.01; // µs, a 100 MHz digitiser

    // Depth from time of flight: the pulse goes down and back, so depth = velocity × time / 2
    const depthFromTime = (timeUs) => (VELOCITY * timeUs) / 2;
    const timeFromDepth = (depthMm) => (2 * depthMm) / VELOCITY;
    // Screen height in % of full screen height (FSH) for a raw amplitude at a gain in dB
    const toScreen = (raw, gainDb) => raw * DISPLAY_SCALE * Math.pow(10, gainDb / 20);
    // Envelope (magnitude of the analytic signal), clipped at the top of the screen as a flaw detector does
    const envelopeOf = (signal, i, gainDb) => Math.min(100, toScreen(Math.hypot(signal.re[i], signal.im[i]), gainDb));

    // The gated peak at one probe position: highest envelope inside the gate, its time and its depth
    function gatedPeak(block, settings, px, py) {
        const echoes = echoesAt(block, px, py, 0);
        const from = timeFromDepth(settings.gateStart);
        const to = timeFromDepth(settings.gateStart + settings.gateWidth);
        const times = [];
        for (let t = from; t <= to; t += 0.02) times.push(t);
        const signal = receivedSignal(echoes, times, settings.noise, seedFor(px, py, 0), true);
        let peak = 0;
        let peakTime = 0;
        for (let i = 0; i < times.length; i++) {
            const value = envelopeOf(signal, i, settings.gain);
            if (value > peak) {
                peak = value;
                peakTime = times[i];
            }
        }
        return { peak, peakTime };
    }

    // One colour map for all three images: dark for no echo, through blue and cyan, to yellow and red for strong
    const makeColorMap = (maximum) =>
        new HeatmapColorMap({
            minimum: 0,
            maximum,
            gradientStops: [
                { offset: 0, color: "#0B1A3A" },
                { offset: 0.25, color: "#1F4FA8" },
                { offset: 0.5, color: "#2FB8D9" },
                { offset: 0.75, color: "#F5E663" },
                { offset: 1, color: "#FF4D4D" }
            ]
        });

    const theme = new SciChartJsNavyTheme();
    const titleStyle = { fontSize: 14 };
    const axisTitleStyle = { fontSize: 13 };
    const cartesianModifiers = () => [
        new CursorModifier({ showTooltip: true, showYLine: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    ];

    // --- 1. A-scan: amplitude against time, with a second axis showing depth in steel ---
    const aScan = await SciChartSurface.create(ui.aScanDiv, { theme, title: "A-scan at the probe", titleStyle });
    const aTime = new NumericAxis(aScan.wasmContext, {
        axisTitle: "Time of flight (µs)",
        axisTitleStyle,
        autoRange: EAutoRange.Never,
        labelPrecision: 1
    });
    const aDepth = new NumericAxis(aScan.wasmContext, {
        id: "depth",
        axisAlignment: EAxisAlignment.Top,
        axisTitle: "Depth in steel (mm), d = v·t/2",
        axisTitleStyle,
        autoRange: EAutoRange.Never,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        labelPrecision: 0
    });
    // Keep the depth axis in step with the time axis as you zoom and pan
    aTime.visibleRangeChanged.subscribe(({ visibleRange }) => {
        aDepth.visibleRange = new NumberRange(depthFromTime(visibleRange.min), depthFromTime(visibleRange.max));
    });
    aScan.sciChartSurface.xAxes.add(aTime, aDepth);
    aScan.sciChartSurface.yAxes.add(
        new NumericAxis(aScan.wasmContext, {
            axisTitle: "Amplitude (% screen height)",
            axisTitleStyle,
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(-105, 120),
            labelPrecision: 0
        })
    );
    const rfSeries = new XyDataSeries(aScan.wasmContext, { dataSeriesName: "RF signal", dataIsSortedInX: true });
    const envelopeSeries = new XyDataSeries(aScan.wasmContext, { dataSeriesName: "Envelope", dataIsSortedInX: true });
    aScan.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(aScan.wasmContext, { dataSeries: rfSeries, stroke: "#50C7E099", strokeThickness: 1 }),
        new FastLineRenderableSeries(aScan.wasmContext, { dataSeries: envelopeSeries, stroke: "#F48420", strokeThickness: 2 })
    );
    const gateLine = new LineAnnotation({ y1: GATE_LEVEL, y2: GATE_LEVEL, stroke: "#F5E663", strokeThickness: 3 });
    const gateLabel = new TextAnnotation({
        text: "Gate",
        textColor: "#F5E663",
        fontSize: 12,
        y1: GATE_LEVEL,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom
    });
    const echoLabels = ["← Initial pulse", "Crack", "Hole", "Back wall"].map(
        (text) =>
            new TextAnnotation({
                text,
                textColor: "#FFFFFF",
                fontSize: 12,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Bottom
            })
    );
    aScan.sciChartSurface.annotations.add(gateLine, gateLabel, ...echoLabels);
    aScan.sciChartSurface.chartModifiers.add(
        ...cartesianModifiers(),
        new LegendModifier({ showCheckboxes: false, orientation: ELegendOrientation.Horizontal, placement: ELegendPlacement.BottomRight })
    );

    // --- 2. B-scan: probe position against depth, colour = envelope amplitude ---
    const bScan = await SciChartSurface.create(ui.bScanDiv, { theme, title: "B-scan along y = 30 mm", titleStyle });
    bScan.sciChartSurface.xAxes.add(
        new NumericAxis(bScan.wasmContext, { axisTitle: "Probe position x (mm)", axisTitleStyle, labelPrecision: 0 })
    );
    bScan.sciChartSurface.yAxes.add(
        new NumericAxis(bScan.wasmContext, {
            axisTitle: "Depth (mm)",
            axisTitleStyle,
            flippedCoordinates: true, // depth increases downwards, like a cross-section
            labelPrecision: 0
        })
    );
    const bData = new UniformHeatmapDataSeries(bScan.wasmContext, {
        xStart: 0,
        xStep: 0.5,
        yStart: 0,
        yStep: 1,
        zValues: [[0]]
    });
    bScan.sciChartSurface.renderableSeries.add(
        new UniformHeatmapRenderableSeries(bScan.wasmContext, { dataSeries: bData, colorMap: makeColorMap(100) })
    );
    const markerStyle = { stroke: "#FFFFFF", strokeThickness: 1, strokeDashArray: [4, 4] };
    const bProbe = new VerticalLineAnnotation({ ...markerStyle, x1: 0, showLabel: true, labelValue: "Probe" });
    const bGateTop = new HorizontalLineAnnotation({ ...markerStyle, stroke: "#F5E663", y1: 0 });
    const bGateBottom = new HorizontalLineAnnotation({ ...markerStyle, stroke: "#F5E663", y1: 0 });
    bScan.sciChartSurface.annotations.add(bProbe, bGateTop, bGateBottom);
    bScan.sciChartSurface.chartModifiers.add(...cartesianModifiers());

    // --- 3. C-scan: plan view of the whole plate, colour = gated peak amplitude or its depth ---
    const cScan = await SciChartSurface.create(ui.cScanDiv, { theme, title: "C-scan (plan view)", titleStyle });
    cScan.sciChartSurface.xAxes.add(
        new NumericAxis(cScan.wasmContext, {
            axisTitle: "x (mm)",
            axisTitleStyle,
            labelPrecision: 0,
            visibleRange: new NumberRange(0, PLATE.length)
        })
    );
    cScan.sciChartSurface.yAxes.add(
        new NumericAxis(cScan.wasmContext, {
            axisTitle: "y (mm)",
            axisTitleStyle,
            labelPrecision: 0,
            visibleRange: new NumberRange(0, PLATE.width)
        })
    );
    const cData = new UniformHeatmapDataSeries(cScan.wasmContext, {
        xStart: -0.5,
        xStep: 1,
        yStart: -0.5,
        yStep: 1,
        zValues: [[0]]
    });
    const cSeries = new UniformHeatmapRenderableSeries(cScan.wasmContext, {
        dataSeries: cData,
        colorMap: makeColorMap(100),
        fillValuesOutOfRange: false // cells with no echo above the gate level (value -1) stay empty
    });
    cScan.sciChartSurface.renderableSeries.add(cSeries);
    const cProbe = new VerticalLineAnnotation({ ...markerStyle, x1: 0 });
    const cLine = new HorizontalLineAnnotation({
        ...markerStyle,
        y1: SCAN_LINE_Y,
        showLabel: true,
        labelValue: "B-scan line"
    });
    cScan.sciChartSurface.annotations.add(cProbe, cLine);
    cScan.sciChartSurface.chartModifiers.add(...cartesianModifiers());

    // --- 4. S-scan: a phased-array sector, -30° to +30° from straight down, on a polar heatmap ---
    const sScan = await SciChartPolarSurface.create(ui.sScanDiv, {
        theme,
        title: "S-scan, −30° to +30° (phased array sector)",
        titleStyle
    });
    const sectorStart = (3 * Math.PI) / 2 - Math.PI / 6; // centred on 6 o'clock, 60° wide
    const SECTOR_OFFSET = -0.12 * ui.sScanDiv.clientHeight;
    const SECTOR_SCALE = 1.15;
    sScan.sciChartSurface.xAxes.add(
        new PolarNumericAxis(sScan.wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            visibleRange: new NumberRange(-30, 30),
            startAngle: sectorStart,
            totalAngle: Math.PI / 3,
            // With the radial axis enlarged, angle labels would sit inside the fan, so the spokes
            // (every 10°) carry the angle and the title gives the range
            drawLabels: false,
            autoTicks: false,
            majorDelta: 10,
            drawMajorBands: false,
            drawMinorGridLines: false,
            // The sector only uses the bottom of the circle, so move the centre up and enlarge the circle
            yCenterOffset: SECTOR_OFFSET
        })
    );
    const sRadial = new PolarNumericAxis(sScan.wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        startAngle: sectorStart,
        axisTitle: "Sound path (mm)",
        axisTitleStyle,
        autoRange: EAutoRange.Never,
        labelPrecision: 0,
        drawMajorBands: false,
        drawMinorGridLines: false,
        lengthScale: SECTOR_SCALE
    });
    sScan.sciChartSurface.yAxes.add(sRadial);
    const sData = new UniformHeatmapDataSeries(sScan.wasmContext, {
        xStart: -30,
        xStep: 1,
        yStart: 0,
        yStep: 1,
        zValues: [[0]]
    });
    sScan.sciChartSurface.renderableSeries.add(
        new PolarUniformHeatmapRenderableSeries(sScan.wasmContext, { dataSeries: sData, colorMap: makeColorMap(100) })
    );
    sScan.sciChartSurface.chartModifiers.add(
        new PolarMouseWheelZoomModifier(),
        new PolarPanModifier(),
        new PolarZoomExtentsModifier()
    );

    // --- Reading the controls ---
    function readSettings() {
        const value = (id) => Number(ui.inputs[id].value);
        const thickness = value("thickness");
        // Keep both flaws inside the plate
        ui.inputs.crackDepth.max = String(thickness - 2);
        ui.inputs.holeDepth.max = String(thickness - 3);
        return {
            position: value("position"),
            thickness,
            crackDepth: Math.min(value("crackDepth"), thickness - 2),
            crackSize: value("crackSize"),
            holeDepth: Math.min(value("holeDepth"), thickness - 3),
            gain: value("gain"),
            gateStart: value("gateStart"),
            gateWidth: value("gateWidth"),
            noise: value("noise") / 100,
            cMode: ui.cModeSelect.value
        };
    }
    const blockFrom = (s) => ({
        thickness: s.thickness,
        crackDepth: s.crackDepth,
        crackSize: s.crackSize,
        holeDepth: s.holeDepth,
        withFlaws: true
    });

    // --- B-scan and C-scan: recomputed when the plate, flaws, gain, gate or noise change ---
    let bFull = [];
    let cFull = [];
    let revealUpTo = PLATE.length; // during a scan, only the part already passed is shown
    function computeImages(s) {
        const block = blockFrom(s);
        // B-scan: one A-scan envelope every 0.5 mm along the scan line, sampled at 240 depths
        const maxDepth = 1.2 * s.thickness;
        const rows = 240;
        const depthStep = maxDepth / rows;
        const times = Array.from({ length: rows }, (_, i) => timeFromDepth((i + 0.5) * depthStep));
        bFull = Array.from({ length: rows }, () => new Array(201).fill(0));
        for (let col = 0; col <= 200; col++) {
            const px = col * 0.5;
            const signal = receivedSignal(echoesAt(block, px, SCAN_LINE_Y, 0), times, s.noise, seedFor(px, SCAN_LINE_Y, 0), true);
            for (let row = 0; row < rows; row++) bFull[row][col] = envelopeOf(signal, row, s.gain);
        }
        bData.yStep = depthStep;
        bScan.sciChartSurface.yAxes.get(0).visibleRange = new NumberRange(0, maxDepth);
        bScan.sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(0, PLATE.length);

        // C-scan: the gated peak every 1 mm over the plate. Amplitude in % screen height, or the
        // depth of that peak from its time of flight; -1 where nothing in the gate crosses the gate level
        cFull = [];
        for (let y = 0; y <= PLATE.width; y++) {
            const row = [];
            for (let x = 0; x <= PLATE.length; x++) {
                const { peak, peakTime } = gatedPeak(block, s, x, y);
                if (peak < GATE_LEVEL) row.push(-1);
                else row.push(s.cMode === "depth" ? depthFromTime(peakTime) : peak);
            }
            cFull.push(row);
        }
        cSeries.colorMap = s.cMode === "depth" ? makeColorMap(s.thickness) : makeColorMap(100);
        cScan.sciChartSurface.title = s.cMode === "depth" ? "C-scan: depth of gated echo (mm)" : "C-scan: peak in gate (% FSH)";
        showImages();
    }
    function showImages() {
        const cols = Math.round(revealUpTo * 2);
        bData.setZValues(bFull.map((row) => row.map((value, col) => (col <= cols ? value : 0))));
        cData.setZValues(cFull.map((row) => row.map((value, x) => (x <= revealUpTo ? value : -1))));
    }

    // --- A-scan, S-scan and readout: recomputed when the probe moves too ---
    function updateProbe(s) {
        const block = blockFrom(s);
        const px = s.position;
        const maxTime = timeFromDepth(1.2 * s.thickness);

        // A-scan: 0 to 1.2 × the back-wall time, every 10 ns
        const times = [];
        for (let t = 0; t <= maxTime; t += SAMPLE_STEP) times.push(t);
        const echoes = echoesAt(block, px, SCAN_LINE_Y, 0);
        const signal = receivedSignal(echoes, times, s.noise, seedFor(px, SCAN_LINE_Y, 0), true);
        const gain = Math.pow(10, s.gain / 20) * DISPLAY_SCALE;
        const rf = times.map((_, i) => Math.max(-100, Math.min(100, signal.re[i] * gain)));
        const envelope = times.map((_, i) => envelopeOf(signal, i, s.gain));
        rfSeries.clear();
        rfSeries.appendRange(times, rf);
        envelopeSeries.clear();
        envelopeSeries.appendRange(times, envelope);

        // Label each echo above its peak, if it shows on the screen
        const heightAt = (t) => envelope[Math.min(envelope.length - 1, Math.round(t / SAMPLE_STEP))] || 0;
        const labelAt = (label, t) => {
            const h = heightAt(t);
            label.isHidden = h < 8 || t > maxTime;
            label.x1 = t;
            label.y1 = Math.min(h, 100) + 3;
        };
        labelAt(echoLabels[0], 0.25);
        echoLabels[0].x1 = 1.1;
        echoLabels[0].y1 = 92;
        echoLabels[0].isHidden = false;
        echoLabels[0].horizontalAnchorPoint = EHorizontalAnchorPoint.Left;
        echoes.forEach((echo, i) => labelAt(echoLabels[i + 1], timeFromDepth(echo.path)));

        // The gate, drawn in time on the A-scan and as depth lines on the B-scan
        const gateFrom = timeFromDepth(s.gateStart);
        const gateTo = timeFromDepth(s.gateStart + s.gateWidth);
        gateLine.x1 = gateFrom;
        gateLine.x2 = gateTo;
        gateLabel.x1 = gateFrom;
        bGateTop.y1 = s.gateStart;
        bGateBottom.y1 = s.gateStart + s.gateWidth;
        bProbe.x1 = px;
        cProbe.x1 = px;

        // Readout: gated peak, depth from time of flight, and dB relative to the back wall of a sound area
        const { peak, peakTime } = gatedPeak(block, s, px, SCAN_LINE_Y);
        const soundBackWall = echoesAt({ ...block, withFlaws: false }, px, SCAN_LINE_Y, 0)[0];
        const backWallScreen = toScreen(soundBackWall.amplitude, s.gain);
        let text = `Probe at x = ${px.toFixed(1)} mm · back wall at ${timeFromDepth(s.thickness).toFixed(2)} µs. `;
        if (peak < GATE_LEVEL) {
            text += `Nothing in the gate crosses ${GATE_LEVEL}% screen height.`;
        } else if (peak >= 100) {
            text += `Gated echo at ${peakTime.toFixed(2)} µs → depth ${depthFromTime(peakTime).toFixed(1)} mm, but it is <b>saturated</b> at 100%: lower the gain to measure its height.`;
        } else {
            const relativeDb = 20 * Math.log10(peak / backWallScreen);
            text +=
                `Gated echo <b>${peak.toFixed(0)}%</b> at ${peakTime.toFixed(2)} µs → depth = 5.92 × ${peakTime.toFixed(2)} / 2 = ` +
                `<b>${depthFromTime(peakTime).toFixed(1)} mm</b> · ${relativeDb.toFixed(1)} dB relative to a sound back wall`;
        }
        ui.summary.innerHTML = text;

        // S-scan: a fan of beams from -30° to +30°, each sampled at 200 points along its sound path
        const maxPath = (1.2 * s.thickness) / Math.cos(Math.PI / 6);
        const rows = 200;
        const pathStep = maxPath / rows;
        const pathTimes = Array.from({ length: rows }, (_, i) => timeFromDepth((i + 0.5) * pathStep));
        const sValues = Array.from({ length: rows }, () => new Array(60).fill(0));
        for (let col = 0; col < 60; col++) {
            const angle = -29.5 + col;
            const beam = receivedSignal(
                echoesAt(block, px, SCAN_LINE_Y, angle, 0.4),
                pathTimes,
                s.noise,
                seedFor(px, SCAN_LINE_Y, Math.round(angle)),
                true
            );
            for (let row = 0; row < rows; row++) sValues[row][col] = envelopeOf(beam, row, s.gain);
        }
        sData.yStep = pathStep;
        sData.setZValues(sValues);
        sRadial.visibleRange = new NumberRange(0, maxPath);
    }

    // --- Wiring the controls ---
    let lastThickness = 0;
    function update(recompute) {
        const s = readSettings();
        ui.outputs.position.textContent = `${s.position.toFixed(1)} mm`;
        ui.outputs.thickness.textContent = `${s.thickness} mm`;
        ui.outputs.crackDepth.textContent = `${s.crackDepth.toFixed(1)} mm`;
        ui.outputs.crackSize.textContent = `${s.crackSize.toFixed(1)} mm`;
        ui.outputs.holeDepth.textContent = `${s.holeDepth.toFixed(1)} mm`;
        ui.outputs.gain.textContent = `${s.gain} dB`;
        ui.outputs.gateStart.textContent = `${s.gateStart.toFixed(1)} mm`;
        ui.outputs.gateWidth.textContent = `${s.gateWidth.toFixed(1)} mm`;
        ui.outputs.noise.textContent = `${Math.round(s.noise * 100)}%`;
        if (s.thickness !== lastThickness) {
            aTime.visibleRange = new NumberRange(0, timeFromDepth(1.2 * s.thickness));
            lastThickness = s.thickness;
        }
        if (recompute) computeImages(s);
        updateProbe(s);
    }
    // Several slider events can arrive per frame; redraw at most once per frame
    let pending = null;
    const schedule = (recompute) => {
        if (pending === null) {
            pending = recompute;
            requestAnimationFrame(() => {
                const doRecompute = pending;
                pending = null;
                update(doRecompute);
            });
        } else {
            pending = pending || recompute;
        }
    };
    ui.inputs.position.addEventListener("input", () => schedule(false));
    for (const id of ["thickness", "crackDepth", "crackSize", "holeDepth", "gain", "gateStart", "gateWidth", "noise"]) {
        ui.inputs[id].addEventListener("input", () => schedule(true));
    }
    ui.cModeSelect.addEventListener("change", () => schedule(true));

    // Scan: sweep the probe along the plate; the B-scan and C-scan fill in behind it
    let scanning = false;
    ui.scanButton.addEventListener("click", () => {
        scanning = !scanning;
        ui.scanButton.textContent = scanning ? "Stop" : "Scan";
        if (!scanning) return;
        let x = 0;
        const step = () => {
            if (!scanning || x > PLATE.length) {
                scanning = false;
                ui.scanButton.textContent = "Scan";
                revealUpTo = PLATE.length;
                showImages();
                return;
            }
            ui.inputs.position.value = String(x);
            revealUpTo = x;
            showImages();
            update(false);
            x += 1;
            requestAnimationFrame(step);
        };
        step();
    });

    update(true);
    // #region_A_end
}

ultrasonicTestingChart("scichart-root");
