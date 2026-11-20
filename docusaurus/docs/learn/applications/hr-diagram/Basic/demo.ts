import * as SciChart from "scichart";

// --- Star physics (approximate textbook relations, enough to place a star on the diagram) ---

const SUN_TEMPERATURE = 5772; // K, the IAU nominal solar effective temperature
const SUN_MBOL = 4.74; // the Sun's absolute bolometric magnitude (IAU 2015)

// Spectral classes by surface temperature (K): each class runs from `from` down to `to`
const SPECTRAL_CLASSES = [
    { letter: "O", from: 50000, to: 30000 },
    { letter: "B", from: 30000, to: 10000 },
    { letter: "A", from: 10000, to: 7500 },
    { letter: "F", from: 7500, to: 6000 },
    { letter: "G", from: 6000, to: 5200 },
    { letter: "K", from: 5200, to: 3700 },
    { letter: "M", from: 3700, to: 2400 }
];

// B-V colour index against temperature for main-sequence stars (approximate, after Pecaut & Mamajek 2013)
const COLOUR_TABLE = [
    [2500, 2.1], [2800, 1.98], [3060, 1.83], [3200, 1.66], [3400, 1.55], [3560, 1.5], [3850, 1.42], [4050, 1.35],
    [4440, 1.15], [4600, 1.07], [5040, 0.92], [5280, 0.82], [5500, 0.74], [5770, 0.65], [5920, 0.59], [6200, 0.52],
    [6510, 0.44], [6750, 0.38], [7220, 0.3], [8100, 0.16], [8800, 0.08], [9700, 0.0], [11000, -0.07], [12500, -0.11],
    [15000, -0.15], [20000, -0.21], [25000, -0.26], [30000, -0.3], [45000, -0.33]
];

function colourIndex(temperature) {
    const t = Math.min(Math.max(temperature, 2500), 45000);
    for (let i = 1; i < COLOUR_TABLE.length; i++) {
        const [t1, c1] = COLOUR_TABLE[i];
        if (t <= t1) {
            const [t0, c0] = COLOUR_TABLE[i - 1];
            const f = (Math.log10(t) - Math.log10(t0)) / (Math.log10(t1) - Math.log10(t0));
            return c0 + f * (c1 - c0);
        }
    }
    return COLOUR_TABLE[COLOUR_TABLE.length - 1][1];
}

// Bolometric correction BC_V (Flower 1996, coefficients as corrected by Torres 2010), extended in a straight line
// below 3,300 K where the polynomial runs away
function bolometricCorrection(temperature) {
    const polynomial = (logT) => {
        const c =
            logT < 3.7
                ? [-0.190537291496456e5, 0.155144866764412e5, -0.421278819301717e4, 0.381476328422343e3]
                : logT < 3.9
                  ? [-0.370510203809015e5, 0.385672629965804e5, -0.150651486316025e5, 0.261724637119416e4, -0.170623810323864e3]
                  : [-0.118115450538963e6, 0.137145973583929e6, -0.636233812100225e5, 0.147412923562646e5, -0.170587278406872e4, 0.78873172180499e2];
        return c.reduce((sum, a, i) => sum + a * logT ** i, 0);
    };
    const logT = Math.log10(temperature);
    const edge = Math.log10(3300);
    if (logT >= edge) return polynomial(logT);
    const slope = (polynomial(edge + 0.01) - polynomial(edge)) / 0.01;
    return polynomial(edge) + slope * (logT - edge);
}

// Luminosity (in Suns) to absolute visual magnitude: M_V = M_bol - BC_V, with M_bol = 4.74 - 2.5 log10(L)
function absoluteMagnitude(temperature, luminosity) {
    return SUN_MBOL - 2.5 * Math.log10(luminosity) - bolometricCorrection(temperature);
}

// Stefan-Boltzmann law in solar units: L = R^2 (T / T_sun)^4
function radiusOf(temperature, luminosity) {
    return Math.sqrt(luminosity) / (temperature / SUN_TEMPERATURE) ** 2;
}

function spectralType(temperature) {
    const t = Math.min(Math.max(temperature, 2401), 49999);
    const c = SPECTRAL_CLASSES.find((s) => t <= s.from && t > s.to);
    const f = (Math.log10(c.from) - Math.log10(t)) / (Math.log10(c.from) - Math.log10(c.to));
    return c.letter + Math.min(9, Math.floor(10 * f));
}

// The approximate colour of a blackbody at this temperature, saturated a little so the differences show on screen
const BLACKBODY = [
    { t: 2400, rgb: [255, 150, 60] }, { t: 3000, rgb: [255, 180, 107] }, { t: 3500, rgb: [255, 196, 137] },
    { t: 4000, rgb: [255, 209, 163] }, { t: 5000, rgb: [255, 228, 206] }, { t: 6000, rgb: [255, 243, 239] },
    { t: 7000, rgb: [245, 243, 255] }, { t: 8000, rgb: [227, 233, 255] }, { t: 10000, rgb: [204, 219, 255] },
    { t: 15000, rgb: [179, 204, 255] }, { t: 30000, rgb: [159, 191, 255] }, { t: 50000, rgb: [155, 188, 255] }
];
function starColour(temperature) {
    let rgb = BLACKBODY[BLACKBODY.length - 1].rgb;
    for (let i = 1; i < BLACKBODY.length; i++) {
        if (temperature <= BLACKBODY[i].t) {
            const lo = BLACKBODY[i - 1];
            const hi = BLACKBODY[i];
            const f = Math.min(Math.max((temperature - lo.t) / (hi.t - lo.t), 0), 1);
            rgb = lo.rgb.map((v, k) => v + f * (hi.rgb[k] - v));
            break;
        }
    }
    const hex = rgb.map((v) => Math.round(Math.min(255, Math.max(0, 255 - 1.8 * (255 - v)))).toString(16).padStart(2, "0"));
    return "#" + hex.join("");
}

// --- Sample data: simulated stars (no real catalogue), placed with the relations above ---

function makeRandom(seed) {
    return () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
}

// Main-sequence luminosity and radius from mass (in Suns): the usual piecewise power laws
function mainSequenceStar(mass) {
    const luminosity = mass < 0.43 ? 0.23 * mass ** 2.3 : mass < 2 ? mass ** 4 : 1.4 * mass ** 3.5;
    const radius = mass < 1 ? mass ** 0.8 : mass ** 0.57;
    return { luminosity, radius };
}

function star(temperature, luminosity, stage, mass = 0) {
    return { temperature, luminosity, stage, mass };
}

// Stars near the Sun. The mix of stages is chosen so every region shows up; a real sample of nearby stars has far
// more red dwarfs, and a sample limited by brightness has more giants.
function simulateFieldStars(count) {
    const random = makeRandom(20);
    const normal = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const stars = [];
    for (let i = 0; i < count; i++) {
        const u = random();
        if (u < 0.7) {
            // Main sequence: masses from 0.12 to 25 Suns, more of the low ones; older stars are a little brighter and larger
            const mass = 0.12 * (25 / 0.12) ** (random() ** 1.6);
            const { luminosity, radius } = mainSequenceStar(mass);
            const age = random();
            const L = luminosity * 10 ** (0.25 * age + 0.06 * normal());
            const R = radius * 10 ** (0.1 * age + 0.015 * normal());
            stars.push(star(SUN_TEMPERATURE * (L / (R * R)) ** 0.25, L, "Main sequence", mass));
        } else if (u < 0.74) {
            const f = random(); // subgiants: from the top of the main sequence across to the giant branch
            stars.push(star(10 ** (3.79 - 0.1 * f + 0.01 * normal()), 10 ** (0.45 + 0.4 * f + 0.08 * normal()), "Subgiant"));
        } else if (u < 0.86) {
            const logL = 0.9 + 2.4 * random() ** 2; // red giant branch: more stars near its base
            stars.push(star(10 ** (3.695 - 0.045 * (logL - 0.9) + 0.012 * normal()), 10 ** logL, "Red giant"));
        } else if (u < 0.91) {
            stars.push(star(10 ** (3.68 + 0.015 * normal()), 10 ** (1.7 + 0.08 * normal()), "Red clump giant"));
        } else if (u < 0.925) {
            stars.push(star(10 ** (3.55 + 0.9 * random()), 10 ** (4.2 + 1.4 * random()), "Supergiant"));
        } else {
            // White dwarfs: about the size of the Earth (0.0125 Suns), cooling over time, so more of them are cool
            const temperature = 10 ** (3.7 + 0.8 * random() ** 1.8);
            const radius = 0.0125 * (1 + 0.1 * normal());
            stars.push(star(temperature, radius * radius * (temperature / SUN_TEMPERATURE) ** 4, "White dwarf"));
        }
    }
    return stars;
}

// A star cluster: every star born at the same time, with masses from a Salpeter mass function (0.25 to 25 Suns).
// Each star stays on the main sequence for about 10 billion years x mass^-2.5, then becomes a giant, then
// (below 8 Suns) a white dwarf. Returns a function that places the same stars at any age.
function createCluster(count) {
    const random = makeRandom(4242);
    const members = [];
    for (let i = 0; i < count; i++) {
        const u = random();
        const mass = (0.25 ** -1.35 - u * (0.25 ** -1.35 - 25 ** -1.35)) ** (-1 / 1.35);
        members.push({ mass, a: random(), b: random(), c: random() });
    }
    return (ageGyr) =>
        members.flatMap(({ mass, a, b, c }) => {
            const lifetime = 10 * mass ** -2.5; // Gyr on the main sequence
            const progress = ageGyr / lifetime;
            const { luminosity, radius } = mainSequenceStar(mass);
            if (progress < 1) {
                // Stars brighten and swell as they burn their core hydrogen, which bends the top of the sequence
                const L = luminosity * (1 + 0.8 * progress ** 2) * 10 ** (0.06 * (b - 0.5));
                const R = radius * (1 + 0.5 * progress ** 2) * (1 + 0.02 * (a - 0.5));
                return [star(SUN_TEMPERATURE * (L / (R * R)) ** 0.25, L, "Main sequence", mass)];
            }
            const endL = luminosity * 1.8;
            const endR = radius * 1.5;
            const endLogT = Math.log10(SUN_TEMPERATURE * (endL / (endR * endR)) ** 0.25);
            if (progress < 1.2) {
                const p = (progress - 1) / 0.2; // 0 to 1 through the giant stages
                if (mass >= 8) {
                    const logT = endLogT + (3.55 - endLogT) * Math.sqrt(p);
                    return [star(10 ** logT, endL * 10 ** (0.2 * p), "Supergiant", mass)];
                }
                if (mass >= 2.2) {
                    if (p < 0.1) return [star(10 ** (endLogT + (3.66 - endLogT) * (p / 0.1)), endL, "Subgiant", mass)];
                    return [star(10 ** (3.66 + 0.09 * b), endL * 10 ** (0.5 + 0.1 * c), "Giant (helium burning)", mass)];
                }
                if (p < 0.2) {
                    const f = p / 0.2;
                    return [star(10 ** (endLogT + (3.7 - endLogT) * f), endL * 10 ** (0.25 * f), "Subgiant", mass)];
                }
                if (p < 0.55) {
                    const base = Math.log10(endL) + 0.25;
                    const logL = base + (3.3 - base) * ((p - 0.2) / 0.35) ** 3;
                    return [star(10 ** (3.695 - 0.045 * (logL - 0.9) + 0.006 * (b - 0.5)), 10 ** logL, "Red giant", mass)];
                }
                return [star(10 ** (3.68 + 0.02 * (b - 0.5)), 10 ** (1.7 + 0.12 * (c - 0.5)), "Red clump giant", mass)];
            }
            if (mass >= 8) return []; // exploded as a supernova: a neutron star or black hole, not on the diagram
            const cooling = (progress - 1.2) * lifetime; // Gyr since it became a white dwarf
            const temperature = 60000 * (1 + cooling / 0.02) ** -0.4;
            const r = 0.0125 * (1 + 0.1 * (a - 0.5));
            return [star(temperature, r * r * (temperature / SUN_TEMPERATURE) ** 4, "White dwarf", mass)];
        });
}

// The controls and the chart each need an element. This splits the page's div into a control bar and the chart;
// in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Stars <select data-id="stars" style="font:inherit">` +
        `<option value="field">Near the Sun</option><option value="cluster">A star cluster</option></select></label>` +
        `<label>Cluster age <input data-id="age" type="range" min="7" max="10.1" step="0.01" value="9.6" disabled ` +
        `style="vertical-align:middle; width:120px"> <output data-id="age"></output></label>` +
        `<label>Axes <select data-id="axes" style="font:inherit">` +
        `<option value="physical">Temperature and luminosity</option>` +
        `<option value="observed">Colour index and absolute magnitude</option></select></label>` +
        `<label>View <select data-id="view" style="font:inherit">` +
        `<option value="points">Points</option><option value="density">Density (heatmap)</option></select></label>` +
        `<label><input data-id="regions" type="checkbox" checked> Regions and classes</label>` +
        `<label><input data-id="radii" type="checkbox"> Radius lines</label>` +
        `<label><input data-id="sun" type="checkbox" checked> The Sun</label>`;
    const summary = document.createElement("div");
    summary.setAttribute("aria-live", "polite");
    summary.style.cssText = "padding:0 12px 6px; color:#c8d3e8;" + font;
    const chartBox = document.createElement("div");
    chartBox.style.cssText = "flex:1; min-height:300px; position:relative;";
    const chartDiv = document.createElement("div");
    chartDiv.id = divElementId + "-chart";
    chartDiv.style.cssText = "position:absolute; inset:0;";
    const tooltip = document.createElement("div");
    tooltip.style.cssText =
        "position:absolute; display:none; pointer-events:none; padding:6px 8px; border-radius:4px; background:#0E1A33E6; " +
        "border:1px solid #50C7E0; color:#ffffff; font-size:13px; line-height:1.4; white-space:nowrap; z-index:2;" + font;
    chartBox.append(chartDiv, tooltip);
    root.append(bar, summary, chartBox);
    const get = (selector) => bar.querySelector(selector);
    return {
        chartDiv,
        tooltip,
        summary,
        starsSelect: get('select[data-id="stars"]'),
        ageInput: get('input[data-id="age"]'),
        ageOutput: get('output[data-id="age"]'),
        axesSelect: get('select[data-id="axes"]'),
        viewSelect: get('select[data-id="view"]'),
        regionsCheckbox: get('input[data-id="regions"]'),
        radiiCheckbox: get('input[data-id="radii"]'),
        sunCheckbox: get('input[data-id="sun"]')
    };
}

async function hrDiagram(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A Hertzsprung-Russell diagram: stars plotted by temperature (reversed, log scale) and luminosity (log scale),
    // or by colour index and absolute magnitude, coloured by temperature, as points or as a density heatmap
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        NumericTickProvider,
        XyDataSeries,
        XyScatterRenderableSeries,
        FastLineRenderableSeries,
        EllipsePointMarker,
        MetadataPaletteProvider,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        TextAnnotation,
        VerticalLineAnnotation,
        ECoordinateMode,
        EAxisAlignment,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        Thickness,
        DpiHelper,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Both kinds of HR diagram, as functions from a star's temperature (K) and luminosity (Suns) to chart x and y.
    // The axes hold log10 values; the tick and label functions below show them as kelvin and Suns.
    const AXES = {
        physical: {
            x: (t) => Math.log10(t),
            y: (t, l) => Math.log10(l),
            xRange: new NumberRange(3.38, 4.7),
            yRange: new NumberRange(-4.6, 6.4),
            xTitle: "Surface temperature (K), hotter to the left",
            yTitle: "Luminosity (Sun = 1)",
            flipX: true, // temperature falls from left to right
            flipY: false,
            xTicks: [2500, 3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000, 30000, 40000].map(Math.log10),
            yTicks: [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
            xLabel: (v) => Math.round(10 ** v / 100) * 100 + " K",
            yLabel: (v) => (v >= 0 ? (10 ** v).toLocaleString("en-GB", { maximumFractionDigits: 0 }) : String(+(10 ** v).toPrecision(1)))
        },
        observed: {
            x: (t) => colourIndex(t),
            y: (t, l) => absoluteMagnitude(t, l),
            xRange: new NumberRange(-0.45, 2.15),
            yRange: new NumberRange(-9, 17),
            xTitle: "Colour index B-V (bluer to the left)",
            yTitle: "Absolute magnitude M_V (brighter is up)",
            flipX: false,
            flipY: true, // smaller magnitudes are brighter, so they go at the top
            xTicks: null, // automatic ticks
            yTicks: null,
            xLabel: (v) => v.toFixed(1),
            yLabel: (v) => v.toFixed(0)
        }
    };

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.chartDiv, {
        theme: new SciChartJsNavyTheme()
    });
    const xAxis = new NumericAxis(wasmContext, { axisTitle: "", drawMinorGridLines: false });
    const yAxis = new NumericAxis(wasmContext, { axisTitle: "", drawMinorGridLines: false, axisAlignment: EAxisAlignment.Left });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Ticks at round temperatures and powers of ten (log mode), or SciChart's automatic ticks (magnitude mode)
    let axes = AXES.physical;
    for (const { axis, key } of [{ axis: xAxis, key: "xTicks" }, { axis: yAxis, key: "yTicks" }]) {
        const ticks = new NumericTickProvider(wasmContext);
        const automatic = ticks.getMajorTicks.bind(ticks);
        ticks.getMajorTicks = (minorDelta, majorDelta, range) =>
            axes[key] ? axes[key].filter((v) => v >= range.min && v <= range.max) : automatic(minorDelta, majorDelta, range);
        axis.tickProvider = ticks;
    }
    xAxis.labelProvider.formatLabel = (v) => axes.xLabel(v);
    yAxis.labelProvider.formatLabel = (v) => axes.yLabel(v);

    // Density view: stars counted on a grid; empty cells are transparent
    const GRID_X = 120;
    const GRID_Y = 90;
    const heatmapData = new UniformHeatmapDataSeries(wasmContext, {
        zValues: Array.from({ length: GRID_Y }, () => new Array(GRID_X).fill(0)),
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1
    });
    const heatmap = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: heatmapData,
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 1,
            gradientStops: [
                { offset: 0, color: "#00000000" },
                { offset: 0.001, color: "#1B2E6B" },
                { offset: 0.3, color: "#2F7FC1" },
                { offset: 0.6, color: "#50C7E0" },
                { offset: 0.85, color: "#F5E663" },
                { offset: 1, color: "#FFFFFF" }
            ]
        }),
        isVisible: false
    });

    // Points view: one scatter series; each point's colour comes from its metadata (MetadataPaletteProvider)
    const starData = new XyDataSeries(wasmContext, { dataSeriesName: "Stars" });
    const stars = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: starData,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 4, height: 4, strokeThickness: 0, fill: "#FFFFFF" }),
        paletteProvider: new MetadataPaletteProvider()
    });

    // Lines of constant radius (Stefan-Boltzmann law), the Sun, the cluster turn-off and the star under the mouse
    const RADII = [0.01, 0.1, 1, 10, 100, 1000];
    const radiusData = RADII.map((r) => new XyDataSeries(wasmContext, { dataSeriesName: `${r} solar radii` }));
    const radiusLines = radiusData.map(
        (dataSeries) =>
            new FastLineRenderableSeries(wasmContext, {
                dataSeries,
                stroke: "#C8D3E8",
                strokeThickness: 1,
                strokeDashArray: [4, 4],
                opacity: 0.6
            })
    );
    const sunData = new XyDataSeries(wasmContext, { dataSeriesName: "Sun" });
    const turnOffData = new XyDataSeries(wasmContext, { dataSeriesName: "Turn-off" });
    const hoveredData = new XyDataSeries(wasmContext, { dataSeriesName: "Hovered star" });
    const marker = (dataSeries, fill, stroke, size) =>
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries,
            pointMarker: new EllipsePointMarker(wasmContext, { width: size, height: size, strokeThickness: 2, fill, stroke })
        });
    const sun = marker(sunData, "#FFD84D", "#FFFFFF", 14);
    const turnOff = marker(turnOffData, "#00000000", "#F48420", 22);
    const hovered = marker(hoveredData, "#00000000", "#FFFFFF", 14);
    sciChartSurface.renderableSeries.add(heatmap, ...radiusLines, stars, sun, turnOff, hovered);
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());

    // --- Redraw everything for the current controls ---
    const fieldStars = simulateFieldStars(9000);
    const cluster = createCluster(8000);
    let current = [];
    let points = { x: [], y: [] };

    function update() {
        axes = AXES[ui.axesSelect.value];
        const isCluster = ui.starsSelect.value === "cluster";
        const ageGyr = 10 ** (Number(ui.ageInput.value) - 9);
        ui.ageInput.disabled = !isCluster;
        ui.ageOutput.textContent = ageGyr < 1 ? `${Math.round(ageGyr * 1000)} million years` : `${ageGyr.toFixed(1)} billion years`;
        current = isCluster ? cluster(ageGyr) : fieldStars;

        // Axes
        xAxis.labelProvider.invalidateCache(); // the label text for a value changes with the mode
        yAxis.labelProvider.invalidateCache();
        xAxis.axisTitle = axes.xTitle;
        yAxis.axisTitle = axes.yTitle;
        xAxis.flippedCoordinates = axes.flipX;
        yAxis.flippedCoordinates = axes.flipY;
        xAxis.visibleRange = axes.xRange;
        yAxis.visibleRange = axes.yRange;
        xAxis.visibleRangeLimit = axes.xRange;
        yAxis.visibleRangeLimit = axes.yRange;

        // Stars
        points = {
            x: current.map((s) => axes.x(s.temperature)),
            y: current.map((s) => axes.y(s.temperature, s.luminosity))
        };
        const metadata = current.map((s) => {
            const colour = starColour(s.temperature);
            return { isSelected: false, fill: colour + "CC", stroke: colour };
        });
        starData.clear();
        starData.appendRange(points.x, points.y, metadata);
        hoveredData.clear();
        ui.tooltip.style.display = "none";

        // Density: count stars per grid cell, on a log scale so sparse regions still show
        const density = ui.viewSelect.value === "density";
        const { xRange, yRange } = axes;
        const xStep = (xRange.max - xRange.min) / GRID_X;
        const yStep = (yRange.max - yRange.min) / GRID_Y;
        const counts = Array.from({ length: GRID_Y }, () => new Array(GRID_X).fill(0));
        points.x.forEach((x, i) => {
            const col = Math.floor((x - xRange.min) / xStep);
            const row = Math.floor((points.y[i] - yRange.min) / yStep);
            if (col >= 0 && col < GRID_X && row >= 0 && row < GRID_Y) counts[row][col]++;
        });
        const peak = Math.log10(1 + Math.max(...counts.map((row) => Math.max(...row))));
        heatmapData.xStart = xRange.min;
        heatmapData.xStep = xStep;
        heatmapData.yStart = yRange.min;
        heatmapData.yStep = yStep;
        heatmapData.setZValues(counts.map((row) => row.map((n) => (n ? Math.max(0.01, Math.log10(1 + n) / peak) : 0))));
        heatmap.isVisible = density;
        stars.isVisible = !density;

        // Radius lines: L = R^2 (T / T_sun)^4, drawn across the temperature range
        radiusLines.forEach((line, i) => {
            const xs = [];
            const ys = [];
            for (let logT = 3.38; logT <= 4.7; logT += 0.02) {
                const t = 10 ** logT;
                xs.push(axes.x(t));
                ys.push(axes.y(t, RADII[i] ** 2 * (t / SUN_TEMPERATURE) ** 4));
            }
            radiusData[i].clear();
            radiusData[i].appendRange(xs, ys);
            line.isVisible = ui.radiiCheckbox.checked;
        });

        // The Sun
        sunData.clear();
        sunData.append(axes.x(SUN_TEMPERATURE), axes.y(SUN_TEMPERATURE, 1));
        sun.isVisible = ui.sunCheckbox.checked;

        // The cluster's main-sequence turn-off: the most massive star still burning hydrogen in its core
        turnOffData.clear();
        turnOff.isVisible = isCluster;
        let turnOffText = "";
        if (isCluster) {
            const remaining = current.filter((s) => s.stage === "Main sequence");
            const top = remaining.reduce((a, b) => (b.luminosity > a.luminosity ? b : a), remaining[0]);
            turnOffData.append(axes.x(top.temperature), axes.y(top.temperature, top.luminosity));
            turnOffText = ` · turn-off at about ${top.mass.toFixed(1)} solar masses, ${Math.round(top.temperature / 100) * 100} K`;
        }

        // Labels: spectral classes along the top, the main regions, the Sun, the turn-off and the radius lines
        sciChartSurface.annotations.clear();
        const label = (x, y, text, options) =>
            sciChartSurface.annotations.add(
                new TextAnnotation({
                    x1: x,
                    y1: y,
                    text,
                    fontSize: 14,
                    textColor: "#FFFFFF",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                    ...options
                })
            );
        if (ui.regionsCheckbox.checked) {
            for (const c of SPECTRAL_CLASSES) {
                const mid = Math.sqrt(c.from * Math.max(c.to, 2600));
                label(axes.x(mid), 0.03, c.letter, { yCoordinateMode: ECoordinateMode.Relative, fontSize: 16, textColor: starColour(mid) });
                if (c.to > 2600) {
                    sciChartSurface.annotations.add(
                        new VerticalLineAnnotation({ x1: axes.x(c.to), stroke: "#C8D3E855", strokeDashArray: [2, 4] })
                    );
                }
            }
            const regions = isCluster
                ? []
                : [
                      { text: "Main sequence", t: 16000, l: 30 },
                      { text: "Giants", t: 4200, l: 600 },
                      { text: "Supergiants", t: 6500, l: 6000 },
                      { text: "White dwarfs", t: 16000, l: 0.0006 }
                  ];
            for (const r of regions) {
                label(axes.x(r.t), axes.y(r.t, r.l), r.text, { fontSize: 15, background: "#22365BCC", padding: new Thickness(2, 4, 2, 4) });
            }
        }
        if (ui.radiiCheckbox.checked) {
            RADII.forEach((r) => {
                // Label each line at its coolest point inside the chart
                const lumAt = (t) => r * r * (t / SUN_TEMPERATURE) ** 4;
                let t = 2700;
                while (t < 40000 && Math.log10(lumAt(t)) < AXES.physical.yRange.min + 0.5) t *= 1.05;
                label(axes.x(t), axes.y(t, lumAt(t)), `${r} R☉`, { fontSize: 12, textColor: "#C8D3E8" });
            });
        }
        if (ui.sunCheckbox.checked) {
            label(axes.x(SUN_TEMPERATURE), axes.y(SUN_TEMPERATURE, 1), "Sun", {
                horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                verticalAnchorPoint: EVerticalAnchorPoint.Top,
                xCoordShift: 6,
                yCoordShift: 6,
                background: "#22365BCC",
                textColor: "#FFD84D"
            });
        }
        if (isCluster) {
            const p = turnOffData;
            label(p.getNativeXValues().get(0), p.getNativeYValues().get(0), "Turn-off", {
                horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
                xCoordShift: -14,
                textColor: "#F48420"
            });
        }

        // One-line summary of what is plotted
        const giants = current.filter((s) => /giant/i.test(s.stage)).length;
        const dwarfs = current.filter((s) => s.stage === "White dwarf").length;
        ui.summary.textContent =
            `${current.length.toLocaleString("en-GB")} simulated stars · ` +
            `${Math.round((100 * (current.length - giants - dwarfs)) / current.length)}% main sequence or subgiant, ` +
            `${giants} giants, ${dwarfs} white dwarfs` +
            turnOffText;
    }

    // --- Hover: find the nearest star on screen and show its values ---
    ui.chartDiv.addEventListener("mousemove", (event) => {
        if (!stars.isVisible || current.length === 0) return;
        const box = ui.chartDiv.getBoundingClientRect();
        const view = sciChartSurface.seriesViewRect;
        const mouseX = (event.clientX - box.left) * DpiHelper.PIXEL_RATIO - view.left;
        const mouseY = (event.clientY - box.top) * DpiHelper.PIXEL_RATIO - view.top;
        const xCalc = xAxis.getCurrentCoordinateCalculator();
        const yCalc = yAxis.getCurrentCoordinateCalculator();
        let best = -1;
        let bestDistance = (10 * DpiHelper.PIXEL_RATIO) ** 2;
        for (let i = 0; i < current.length; i++) {
            const dx = xCalc.getCoordinate(points.x[i]) - mouseX;
            const dy = yCalc.getCoordinate(points.y[i]) - mouseY;
            if (dx * dx + dy * dy < bestDistance) {
                bestDistance = dx * dx + dy * dy;
                best = i;
            }
        }
        hoveredData.clear();
        if (best < 0) {
            ui.tooltip.style.display = "none";
            return;
        }
        hoveredData.append(points.x[best], points.y[best]);
        const s = current[best];
        const lum = s.luminosity >= 1 ? s.luminosity.toLocaleString("en-GB", { maximumFractionDigits: 1 }) : s.luminosity.toPrecision(2);
        ui.tooltip.innerHTML =
            `<b>${s.stage}</b>, spectral type about ${spectralType(s.temperature)}<br>` +
            `Temperature ${Math.round(s.temperature).toLocaleString("en-GB")} K · luminosity ${lum} Suns<br>` +
            `B-V ${colourIndex(s.temperature).toFixed(2)} · M<sub>V</sub> ${absoluteMagnitude(s.temperature, s.luminosity).toFixed(1)} · ` +
            `radius ${+radiusOf(s.temperature, s.luminosity).toPrecision(2)} Suns` +
            (s.mass ? ` · mass ${s.mass.toFixed(2)} Suns` : "");
        const cssX = event.clientX - box.left;
        const cssY = event.clientY - box.top;
        ui.tooltip.style.display = "block";
        ui.tooltip.style.left = `${Math.min(cssX + 14, box.width - ui.tooltip.offsetWidth - 4)}px`;
        ui.tooltip.style.top = `${cssY > box.height / 2 ? cssY - ui.tooltip.offsetHeight - 10 : cssY + 14}px`;
    });
    ui.chartDiv.addEventListener("mouseleave", () => {
        ui.tooltip.style.display = "none";
        hoveredData.clear();
    });

    ui.starsSelect.addEventListener("change", update);
    ui.ageInput.addEventListener("input", update);
    ui.axesSelect.addEventListener("change", update);
    ui.viewSelect.addEventListener("change", update);
    ui.regionsCheckbox.addEventListener("change", update);
    ui.radiiCheckbox.addEventListener("change", update);
    ui.sunCheckbox.addEventListener("change", update);
    update();
    // #region_A_end
}

hrDiagram("scichart-root");
