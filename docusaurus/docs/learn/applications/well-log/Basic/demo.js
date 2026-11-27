import * as SciChart from "scichart";

// A seeded random generator, so the log looks the same every time it loads
function createRandom(seed) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

// A synthetic well log: sand and shale layers from 5,000 to 5,600 ft, sampled every 0.5 ft as in a LAS file.
// It is made up, not a real well. The sands follow textbook rules: density from porosity and fluid,
// resistivity from Archie's equation (Rw = 0.05 ohm.m, a = 1, m = n = 2), sonic from the Wyllie time average.
// Neutron porosity is in sandstone units, so a water-filled sand shows no density-neutron separation.
const RW = 0.05; // formation water resistivity, ohm.m
const RMF = 0.5; // mud filtrate resistivity (fresh mud), ohm.m
function createWellLog() {
    const random = createRandom(20261126);
    const noise = (size) => (random() + random() + random() - 1.5) * size;
    const TOP = 5000;
    const STEP = 0.5;
    const count = 1201; // 5,000 to 5,600 ft

    // Layers from top to base. Sands: porosity, water saturation in the formation (sw) and in the flushed zone next to the hole (sxo)
    const shale = { kind: "shale" };
    const layers = [
        { top: 5000, ...shale },
        { top: 5080, kind: "sand", phi: 0.25, sw: 1, sxo: 1, fluid: "water" },
        { top: 5140, ...shale },
        { top: 5195, kind: "sand", phi: 0.24, sw: 0.12, sxo: 0.7, fluid: "gas" },
        { top: 5232, kind: "sand", phi: 0.24, sw: 1, sxo: 1, fluid: "water" }, // gas-water contact at 5,232 ft
        { top: 5262, ...shale },
        { top: 5300, kind: "lime", phi: 0.03 },
        { top: 5318, ...shale },
        { top: 5380, kind: "sand", phi: 0.22, sw: 0.2, sxo: 0.8, fluid: "oil" },
        { top: 5440, ...shale },
        { top: 5500, kind: "sand", phi: 0.12, sw: 1, sxo: 1, fluid: "water", silty: true },
        { top: 5510, ...shale }
    ];
    const layerAt = (depth) => layers.filter((l) => l.top <= depth).pop();
    const hydrocarbonDensity = { water: 1.0, oil: 0.8, gas: 0.2 };
    const hydrocarbonIndex = { water: 1.0, oil: 0.95, gas: 0.35 }; // how much hydrogen the neutron tool sees

    // The "true" value of every curve at each depth, before the tools blur it
    const raw = { gr: [], cali: [], rt: [], rxo: [], nphi: [], rhob: [], dt: [] };
    const depth = [];
    for (let i = 0; i < count; i++) {
        const d = TOP + i * STEP;
        depth.push(d);
        const layer = layerAt(d);
        const washout = d >= 5152 && d < 5166; // the hole is enlarged in this shale
        if (layer.kind === "shale") {
            raw.gr.push(105 + 8 * Math.sin(d / 17) + 5 * Math.sin(d / 5.3));
            raw.cali.push(washout ? 12.5 : 8.9);
            raw.rt.push(2.2 + 0.4 * Math.sin(d / 23));
            raw.rxo.push(2.0);
            raw.nphi.push(washout ? 0.42 : 0.36);
            raw.rhob.push(washout ? 2.28 : 2.48); // the pad loses contact in the washout and reads too low
            raw.dt.push(104 + 3 * Math.sin(d / 19));
        } else if (layer.kind === "lime") {
            raw.gr.push(18);
            raw.cali.push(8.5);
            raw.rt.push(400);
            raw.rxo.push(250);
            raw.nphi.push(0.07); // limestone reads a little high in sandstone units
            raw.rhob.push(2.71 - layer.phi * 1.71);
            raw.dt.push(47.5 + layer.phi * (189 - 47.5));
        } else {
            const { phi, sw, sxo, fluid } = layer;
            // Funnel shape: the oil sand coarsens upwards, so its gamma ray falls towards the top
            const funnel = fluid === "oil" ? Math.max(0, (d - 5410) / 30) * 25 : 0;
            raw.gr.push((layer.silty ? 68 : 30) + funnel);
            raw.cali.push(8.3); // mudcake on a permeable bed: slightly smaller than the 8.5 in bit
            raw.rt.push(RW / (phi * phi * sw * sw)); // Archie
            raw.rxo.push(RMF / (phi * phi * sxo * sxo));
            // The density and neutron tools read the flushed zone: filtrate plus any hydrocarbon left behind
            const hc = 1 - sxo;
            raw.rhob.push(2.65 * (1 - phi) + phi * (sxo * 1.0 + hc * hydrocarbonDensity[fluid]));
            raw.nphi.push(phi * (sxo + hc * hydrocarbonIndex[fluid]));
            raw.dt.push(55.5 + phi * (189 - 55.5) + (fluid === "gas" ? 8 : 0));
        }
    }

    // Each tool averages over a few feet, so sharp bed boundaries come out as ramps
    const smooth = (values, halfWidth, useLog) => {
        const v = useLog ? values.map(Math.log10) : values;
        return v.map((_, i) => {
            let sum = 0;
            let n = 0;
            for (let j = Math.max(0, i - halfWidth); j <= Math.min(v.length - 1, i + halfWidth); j++) {
                sum += v[j];
                n++;
            }
            return useLog ? 10 ** (sum / n) : sum / n;
        });
    };
    return {
        depth,
        gr: smooth(raw.gr, 4, false).map((v) => v + noise(6)),
        cali: smooth(raw.cali, 3, false).map((v) => v + noise(0.08)),
        rt: smooth(raw.rt, 8, true).map((v) => v * (1 + noise(0.06))),
        rxo: smooth(raw.rxo, 3, true).map((v) => v * (1 + noise(0.1))),
        nphi: smooth(raw.nphi, 4, false).map((v) => v + noise(0.015)),
        rhob: smooth(raw.rhob, 3, false).map((v) => v + noise(0.02)),
        dt: smooth(raw.dt, 4, false).map((v) => v + noise(2))
    };
}

// The controls and the readout above the tracks. In your app these are just elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#1B2438;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const header = document.createElement("div");
    header.style.cssText = "padding:6px 12px; color:#ffffff;" + font;
    header.innerHTML =
        `<label>Gamma ray sand/shale cutoff <input data-id="cutoff" type="range" min="40" max="120" step="1" value="75" style="vertical-align:middle">` +
        ` <span data-id="cutoffValue">75</span> API</label>` +
        `<div data-id="readout" aria-live="off" style="margin-top:4px; color:#c8d3e8; font-variant-numeric:tabular-nums">Hover over the log to read every curve at one depth.</div>`;
    const tracks = document.createElement("div");
    tracks.style.cssText = "flex:1; min-height:0; display:flex; gap:2px; padding:0 4px 4px;";
    const trackDivs = [1.25, 1, 1, 0.8].map((grow, i) => {
        const div = document.createElement("div");
        div.id = `${divElementId}-track${i}`; // each chart needs its own element id
        div.style.cssText = `flex:${grow} 1 0; min-width:0;`;
        tracks.append(div);
        return div;
    });
    root.append(header, tracks);
    const get = (selector) => header.querySelector(selector);
    return { trackDivs, cutoffInput: get('input[data-id="cutoff"]'), cutoffValue: get('span[data-id="cutoffValue"]'), readout: get('div[data-id="readout"]') };
}

async function wellLog(divElementId) {
    const ui = createLayout(divElementId);
    const log = createWellLog();

    // #region_A_start
    // A well log with SciChart.js: four vertical tracks side by side, sharing one depth axis that increases
    // downwards, with synchronised zoom and pan and one depth cursor across every track
    const {
        SciChartSurface,
        SciChartHorizontalGroup,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EXyDirection,
        ENumericFormat,
        FastLineRenderableSeries,
        FastBandRenderableSeries,
        XyDataSeries,
        XyyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        translateFromCanvasToSeriesViewRect
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const DEPTH_RANGE = new NumberRange(5000, 5600);
    const colours = { gr: "#3BD16F", cali: "#C8D3E8", rt: "#EF5350", rxo: "#50C7E0", nphi: "#50C7E0", rhob: "#EF5350", dt: "#C3B4F0" };
    // Neutron and density share one track on compatible scales: NPHI 0.45 to -0.15 (sandstone units) lines up
    // with RHOB 1.90 to 2.90 g/cc, so the two curves overlay in a water-filled sand. Convert RHOB to that scale:
    const densityOnNeutronScale = (rhob) => 0.45 - 0.6 * (rhob - 1.9);

    // One track: a vertical chart. The x-axis is depth, on the left or right and increasing downwards;
    // each curve gets a y-axis along the top with its own scale and colour
    const group = new SciChartHorizontalGroup(); // gives every track the same header height, so depths line up
    const createTrack = async (div, showDepth) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(div, {
            theme: new SciChartJsNavyTheme(),
            padding: { top: 4, right: 4, bottom: 4, left: 4 }
        });
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Right, // a vertical chart: x runs down the side, top to bottom
                visibleRange: DEPTH_RANGE,
                autoRange: EAutoRange.Never,
                isVisible: showDepth,
                axisTitle: showDepth ? "Depth (ft)" : undefined,
                axisTitleStyle: { fontSize: 13 },
                labelFormat: ENumericFormat.Decimal,
                labelPrecision: 0,
                drawMinorGridLines: true
            })
        );
        group.addSurfaceToGroup(sciChartSurface);
        return { sciChartSurface, wasmContext };
    };
    // On a vertical chart a top axis runs right to left unless flipped, so flippedCoordinates: true puts
    // low values on the left, as on a printed log. Scales that run backwards (neutron, sonic) leave it false.
    const curveAxis = (wasmContext, id, title, colour, min, max, options = {}) =>
        new NumericAxis(wasmContext, {
            id,
            axisAlignment: EAxisAlignment.Top,
            flippedCoordinates: true,
            axisTitle: title,
            axisTitleStyle: { color: colour, fontSize: 13 },
            labelStyle: { color: colour, fontSize: 11 },
            visibleRange: new NumberRange(min, max),
            autoRange: EAutoRange.Never,
            drawMinorGridLines: false,
            labelPrecision: 0,
            ...options
        });
    const xy = (wasmContext, values) => new XyDataSeries(wasmContext, { xValues: log.depth, yValues: values, isSorted: true, containsNaN: false });

    // Track 1: gamma ray, shaded between the curve and a sand/shale cutoff, and the caliper
    const track1 = await createTrack(ui.trackDivs[0], true);
    {
        const { sciChartSurface, wasmContext } = track1;
        sciChartSurface.yAxes.add(
            curveAxis(wasmContext, "gr", "GR (API)", colours.gr, 0, 150),
            curveAxis(wasmContext, "cali", "CALI (in)", colours.cali, 6, 16, { drawMajorGridLines: false })
        );
        const cutoff = Number(ui.cutoffInput.value);
        const grSeries = new XyyDataSeries(wasmContext, { xValues: log.depth, yValues: log.gr, y1Values: log.gr.map(() => cutoff), isSorted: true });
        const grBand = new FastBandRenderableSeries(wasmContext, {
            yAxisId: "gr",
            dataSeries: grSeries,
            stroke: colours.gr,
            strokeThickness: 1.5,
            strokeY1: "#FFFFFF66", // the cutoff line
            strokeY1DashArray: [4, 4],
            fill: "#8A7F7099", // gamma ray above the cutoff (right of the line): shale
            fillY1: "#E8C547AA" // gamma ray below the cutoff (left of the line): sand, or clean carbonate
        });
        sciChartSurface.renderableSeries.add(
            grBand,
            new FastLineRenderableSeries(wasmContext, { yAxisId: "cali", dataSeries: xy(wasmContext, log.cali), stroke: colours.cali, strokeThickness: 1, strokeDashArray: [6, 3] })
        );
        // Move the cutoff with the slider
        ui.cutoffInput.addEventListener("input", () => {
            const value = Number(ui.cutoffInput.value);
            ui.cutoffValue.textContent = String(value);
            grSeries.clear();
            grSeries.appendRange(log.depth, log.gr, log.gr.map(() => value));
        });
    }

    // Track 2: resistivity on a logarithmic scale, 0.2 to 2,000 ohm.m, deep and shallow readings
    const track2 = await createTrack(ui.trackDivs[1], false);
    {
        const { sciChartSurface, wasmContext } = track2;
        sciChartSurface.yAxes.add(
            new LogarithmicAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Top,
                flippedCoordinates: true,
                axisTitle: "RT, RXO (ohm.m)", // deep (solid) and shallow (dashed)
                axisTitleStyle: { color: colours.rt, fontSize: 13 },
                labelStyle: { color: "#C8D3E8", fontSize: 11 },
                logBase: 10,
                // A label and major gridline at each power of ten, minor gridlines at 2, 3 ... 9 times it
                autoTicks: false,
                majorDelta: 1,
                minorDelta: 1,
                labelFormat: ENumericFormat.Decimal,
                labelPrecision: 0,
                visibleRange: new NumberRange(0.2, 2000),
                autoRange: EAutoRange.Never,
                drawMinorGridLines: true
            })
        );
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { dataSeries: xy(wasmContext, log.rxo), stroke: colours.rxo, strokeThickness: 1, strokeDashArray: [6, 3] }),
            new FastLineRenderableSeries(wasmContext, { dataSeries: xy(wasmContext, log.rt), stroke: colours.rt, strokeThickness: 2 })
        );
    }

    // Track 3: neutron porosity and bulk density, shaded where the density curve crosses to the left (gas)
    const track3 = await createTrack(ui.trackDivs[2], false);
    {
        const { sciChartSurface, wasmContext } = track3;
        sciChartSurface.yAxes.add(
            curveAxis(wasmContext, "nphi", "NPHI (v/v)", colours.nphi, -0.15, 0.45, { flippedCoordinates: false, labelPrecision: 2 }),
            curveAxis(wasmContext, "rhob", "RHOB (g/cc)", colours.rhob, 1.9, 2.9, { drawMajorGridLines: false, labelPrecision: 2 })
        );
        sciChartSurface.renderableSeries.add(
            new FastBandRenderableSeries(wasmContext, {
                yAxisId: "nphi",
                dataSeries: new XyyDataSeries(wasmContext, { xValues: log.depth, yValues: log.nphi, y1Values: log.rhob.map(densityOnNeutronScale), isSorted: true }),
                stroke: colours.nphi,
                strokeThickness: 1.5,
                strokeDashArray: [6, 3],
                strokeY1: colours.rhob, // the density curve, drawn on the neutron scale so it sits where RHOB reads
                // The band picks its fill by which line is on top on screen, and this axis is not flipped:
                fill: "#F6A13ACC", // density left of neutron: the crossover that flags gas
                fillY1: "#9AA5B11A" // neutron left of density: shale or tight rock, barely shaded
            })
        );
    }

    // Track 4: sonic transit time, 140 to 40 microseconds per foot (slower rock to the left)
    const track4 = await createTrack(ui.trackDivs[3], false);
    {
        const { sciChartSurface, wasmContext } = track4;
        sciChartSurface.yAxes.add(curveAxis(wasmContext, "dt", "DT (us/ft)", colours.dt, 40, 140, { flippedCoordinates: false, autoTicks: false, majorDelta: 20, minorDelta: 10 }));
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { yAxisId: "dt", dataSeries: xy(wasmContext, log.dt), stroke: colours.dt, strokeThickness: 1.5 })
        );
    }

    // The depth cursor: a crosshair that also passes the depth under the mouse to the readout
    class DepthCursorModifier extends CursorModifier {
        onDepth;
        constructor(options, onDepth) {
            super(options);
            this.onDepth = onDepth;
        }
        modifierMouseMove(args) {
            super.modifierMouseMove(args);
            if (!args.isMaster) return; // the other tracks in the group get a copy of the event; read it once
            const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            if (point) this.onDepth(this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(point.y));
        }
    }

    // Synchronise the depth axes, the cursor and zooming across all four tracks
    const surfaces = [track1, track2, track3, track4].map((t) => t.sciChartSurface);
    let syncing = false;
    for (const surface of surfaces) {
        surface.xAxes.get(0).visibleRangeChanged.subscribe((args) => {
            if (syncing) return;
            syncing = true;
            for (const other of surfaces) if (other !== surface) other.xAxes.get(0).visibleRange = args.visibleRange;
            syncing = false;
        });
        surface.chartModifiers.add(
            // Zoom and pan in depth only: each curve keeps its standard scale
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
            new DepthCursorModifier(
                { modifierGroup: "depth", showTooltip: false, showYLine: false, showAxisLabels: true, crosshairStroke: "#FFFFFFAA" },
                (depth) => showReadout(depth)
            )
        );
    }
    // #region_A_end

    // The readout: every curve at the cursor depth, and a quick-look reading of the rock and fluid.
    // Porosity is the neutron-density average (root mean square, which also corrects for gas);
    // water saturation is from Archie's equation with Rw = 0.05 ohm.m.
    const fmt = (value, digits) => value.toFixed(digits);
    const showReadout = (depth) => {
        const i = Math.round((depth - log.depth[0]) / 0.5);
        if (i < 0 || i >= log.depth.length) return;
        const gr = log.gr[i];
        const rt = log.rt[i];
        const nphi = log.nphi[i];
        const rhob = log.rhob[i];
        const phiD = (2.65 - rhob) / 1.65;
        const phi = Math.sqrt((nphi * nphi + phiD * phiD) / 2);
        const crossover = densityOnNeutronScale(rhob) - nphi;
        const cutoff = Number(ui.cutoffInput.value);
        let reading;
        let sw;
        if (gr >= cutoff) reading = "shale";
        else if (phi < 0.08) reading = "clean but tight: little porosity, so high resistivity is not pay";
        else {
            sw = Math.min(1, Math.sqrt(RW / (phi * phi * rt)));
            if (crossover > 0.05 && sw < 0.5) reading = "porous, hydrocarbon, density-neutron crossover: likely gas";
            else if (sw < 0.5) reading = "porous, hydrocarbon, no crossover: likely oil";
            else reading = "porous, water-bearing";
        }
        ui.readout.textContent =
            `Depth ${depth.toFixed(1)} ft · GR ${fmt(gr, 0)} API · CALI ${fmt(log.cali[i], 1)} in · RT ${fmt(rt, rt < 10 ? 2 : 0)} · RXO ${fmt(log.rxo[i], 1)} ohm.m · ` +
            `NPHI ${fmt(nphi, 2)} · RHOB ${fmt(rhob, 2)} g/cc · DT ${fmt(log.dt[i], 0)} us/ft · ` +
            (gr < cutoff && phi >= 0.08 ? `porosity ${fmt(phi * 100, 0)}% · Sw ${fmt(sw * 100, 0)}% · ` : "") +
            `quick look: ${reading}`;
    };
}

wellLog("scichart-root");
