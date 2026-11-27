import * as SciChart from "scichart";

// A simulated ELINT pulse analysis display. A passive receiver hears the pulses of four generic radars at once,
// mixed into one stream, and measures each pulse: its time of arrival (TOA), frequency (RF), pulse width (PW),
// amplitude and angle of arrival (AOA). Together these are the pulse descriptor word (PDW).
// Four linked charts show the stream:
// 1. TOA vs frequency: each dot is one pulse, scrolling in time;
// 2. pulse width vs frequency: pulses from the same radar form a cluster;
// 3. the PRI histogram: how often each time difference between pulses occurs (difference-of-TOA histogram);
// 4. amplitude vs time: a scanning radar's beam sweeping past the receiver shows as a regular peak.
// Deinterleave sorts the pulses into emitters by clustering on frequency and pulse width, then measures each
// emitter's PRI pattern and scan period. All emitters and numbers are synthetic and generic, made up for teaching.

// The simulated emitters. PRI values are in microseconds (µs), scan periods in seconds, beamwidths in degrees.
const EMITTERS = [
    { rf: 9.2, pw: 1.2, peak: -32, aoa: 40, scan: 4.0, beam: 5, phase: 0.15, pri: { type: "constant", values: [1000] } },
    { rf: 9.45, pw: 0.4, peak: -52, aoa: 115, scan: 6.0, beam: 6, phase: 0.55, pri: { type: "stagger", values: [700, 800, 900] } },
    { rf: 9.62, pw: 2.0, peak: -40, aoa: 200, scan: 3.0, beam: 8, phase: 0.8, pri: { type: "jitter", values: [1300], jitter: 0.08 } },
    { rf: 9.24, pw: 0.3, peak: -58, aoa: 300, scan: 0, beam: 0, phase: 0, pri: { type: "dwell", values: [600, 750], dwell: [60, 48] } }
];
const SENSITIVITY_DBM = -75; // the receiver hears nothing weaker than this
const MISSED_PULSES = 0.02; // and misses 2% of pulses at random, as real receivers do
const WINDOW_S = 10; // seconds of pulses on the time charts
const MAX_DT_US = 4000; // the PRI histogram covers time differences from 0 to 4,000 µs
const BIN_US = 10; // in 10 µs bins
const BINS = MAX_DT_US / BIN_US; // bins centred on 0, 10, 20 ... 3,990 µs
const HISTOGRAM_MEMORY_S = 10; // the histogram forgets old pulse pairs with this time constant
const SCAN_HISTORY_S = 25; // seconds of amplitude history kept for measuring scan periods
const RING = 65536; // recent pulses kept for the histogram and the hover readout
const MAX_CLUSTERS = 6;
const RF_TOL_GHZ = 0.015; // two pulses within 15 MHz ...
const PW_TOL = Math.log(1.35); // ... and within 35% in pulse width can belong to the same emitter
const COLOURS = ["#50C7E0", "#F6E05E", "#FF8A5C", "#C3B4F0", "#3BD16F", "#F48FB1"];
const MIXED_COLOUR = "#A9C4EB";

// A seeded random generator, so the stream is the same on every load
function createRandom(seed) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}
const random = createRandom(20261127);
const gauss = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
const median = (values) => {
    const s = [...values].sort((a, b) => a - b);
    return s.length ? s[Math.floor(s.length / 2)] : NaN;
};

// The antenna's gain (dB) at an angle off its beam centre: a main lobe of the given 3 dB beamwidth,
// then sidelobes about 26 dB down, falling towards the back
function antennaGainDb(offDeg, beam) {
    const a = Math.abs(offDeg);
    const main = -12 * (a / beam) * (a / beam);
    const side = -26 + 3 * Math.cos((Math.PI * a) / beam) - (10 * a) / 180;
    return Math.max(main, side);
}

// The next PRI (µs) of an emitter, by PRI type
function nextPri(e, s) {
    const p = e.pri;
    if (p.type === "stagger") return p.values[s.k++ % p.values.length];
    if (p.type === "jitter") return p.values[0] * (1 + p.jitter * (2 * random() - 1));
    if (p.type === "dwell") {
        if (++s.count >= p.dwell[s.pos]) {
            s.pos = (s.pos + 1) % p.values.length;
            s.count = 0;
        }
        return p.values[s.pos];
    }
    return p.values[0];
}

// The receiver: every pulse from every emitter up to time tEnd (s), as measured PDWs sorted by time of arrival
const emitterState = EMITTERS.map((e, i) => ({ next: 0.0001 * (i + 1), k: 0, pos: 0, count: 0 }));
function receivePulses(tEnd) {
    const pulses = [];
    EMITTERS.forEach((e, i) => {
        const s = emitterState[i];
        while (s.next < tEnd) {
            const toa = s.next;
            s.next += nextPri(e, s) * 1e-6;
            let gain = 0;
            if (e.scan > 0) {
                const turn = (((toa / e.scan + e.phase) % 1) + 1) % 1; // 0 when the beam points at the receiver
                gain = antennaGainDb(turn < 0.5 ? turn * 360 : (turn - 1) * 360, e.beam);
            }
            const amp = e.peak + gain + 0.7 * gauss();
            if (amp < SENSITIVITY_DBM || random() < MISSED_PULSES) continue;
            pulses.push({
                toa: toa + 0.05e-6 * gauss(), // measurement errors: 50 ns in time, 3 MHz in frequency, 3% in width, 1.5° in angle
                rf: e.rf + 0.003 * gauss(),
                pw: e.pw * (1 + 0.03 * gauss()),
                amp,
                aoa: (e.aoa + 1.5 * gauss() + 360) % 360
            });
        }
    });
    return pulses.sort((a, b) => a.toa - b.toa);
}

// The deinterleaver. Step 1: sort each pulse into a cluster by frequency and pulse width.
// Step 2: per cluster, the time differences between pulses give the PRI pattern, and the amplitude gives the scan.
function createDeinterleaver() {
    const ring = {
        toa: new Float64Array(RING),
        rf: new Float64Array(RING),
        pw: new Float64Array(RING),
        amp: new Float64Array(RING),
        aoa: new Float64Array(RING),
        cluster: new Int8Array(RING),
        count: 0
    };
    const clusters = [];
    const mixedHist = new Float64Array(BINS); // all pulse pairs, whatever their emitter
    const clusterHist = Array.from({ length: MAX_CLUSTERS }, () => new Float64Array(BINS)); // pairs within one cluster
    let lastDecay = 0;

    function assign(p) {
        let best = -1;
        let bestD = Infinity;
        clusters.forEach((c, i) => {
            const d = Math.hypot((p.rf - c.rf) / RF_TOL_GHZ, Math.log(p.pw / c.pw) / PW_TOL);
            if (d < bestD) {
                bestD = d;
                best = i;
            }
        });
        if (bestD > 1 && clusters.length < MAX_CLUSTERS) {
            clusters.push({ rf: p.rf, pw: p.pw, n: 0, lastToa: -1, diffs: [], ampT: [], ampA: [], report: null });
            best = clusters.length - 1;
        }
        const c = clusters[best];
        c.n = Math.min(c.n + 1, 500); // a running mean that keeps adapting
        c.rf += (p.rf - c.rf) / c.n;
        c.pw += (p.pw - c.pw) / c.n;
        return best;
    }

    function track(c, p) {
        // First-order differences (each pulse to the previous one from the same cluster), for the PRI pattern
        const d = (p.toa - c.lastToa) * 1e6;
        if (c.lastToa >= 0 && d < MAX_DT_US) {
            c.diffs.push(d);
            if (c.diffs.length > 300) c.diffs.shift();
        }
        c.lastToa = p.toa;
        // Amplitude history for the scan analysis: the last SCAN_HISTORY_S seconds
        c.ampT.push(p.toa);
        c.ampA.push(p.amp);
        if (c.ampT[0] < p.toa - SCAN_HISTORY_S - 5) {
            const cut = c.ampT.findIndex((t) => t >= p.toa - SCAN_HISTORY_S);
            c.ampT.splice(0, cut);
            c.ampA.splice(0, cut);
        }
    }

    // Illuminations: runs of pulses within 10 dB of the strongest, separated by quiet gaps of more than 0.3 s
    function illuminations(c) {
        let peak = -Infinity;
        for (const a of c.ampA) peak = Math.max(peak, a);
        const runs = [];
        let run = null;
        c.ampT.forEach((t, i) => {
            if (c.ampA[i] < peak - 10) return;
            if (!run || t - run.end > 0.3) {
                run = { start: t, end: t, t: [], a: [] };
                runs.push(run);
            }
            run.end = t;
            run.t.push(t);
            run.a.push(c.ampA[i]);
        });
        return runs;
    }

    function add(pulses) {
        for (const p of pulses) {
            const c = assign(p);
            p.cluster = c;
            track(clusters[c], p);
            const i = ring.count % RING;
            ring.toa[i] = p.toa;
            ring.rf[i] = p.rf;
            ring.pw[i] = p.pw;
            ring.amp[i] = p.amp;
            ring.aoa[i] = p.aoa;
            ring.cluster[i] = c;
            // Difference-of-TOA histogram: this pulse against every earlier pulse up to MAX_DT_US before it
            for (let j = ring.count - 1; j >= 0 && j > ring.count - RING; j--) {
                const k = j % RING;
                const dt = (p.toa - ring.toa[k]) * 1e6;
                if (dt >= MAX_DT_US) break;
                const bin = Math.round(dt / BIN_US); // bins centred on 0, 10, 20 ... µs
                if (bin >= BINS) continue;
                mixedHist[bin]++;
                if (ring.cluster[k] === c) clusterHist[c][bin]++;
            }
            ring.count++;
        }
    }

    // Old pairs fade out, so the histogram follows changes
    function decay(now) {
        const f = Math.exp(-(now - lastDecay) / HISTOGRAM_MEMORY_S);
        lastDecay = now;
        for (let b = 0; b < BINS; b++) {
            mixedHist[b] *= f;
            for (const h of clusterHist) h[b] *= f;
        }
    }

    // Classify one cluster's PRI from its first-order differences, and its scan from its illuminations
    function classify(c) {
        if (c.diffs.length < 40) return null;
        // Group the sorted differences where they jump by more than 15 µs; keep groups with at least 8% of them
        const sorted = [...c.diffs].sort((a, b) => a - b);
        const groups = [];
        let g = [sorted[0]];
        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] - sorted[i - 1] > 15) {
                groups.push(g);
                g = [];
            }
            g.push(sorted[i]);
        }
        groups.push(g);
        const strong = groups.filter((x) => x.length >= 0.08 * sorted.length);
        const means = strong.map((x) => x.reduce((s, v) => s + v, 0) / x.length);
        const fmt = (v) => Math.round(v).toLocaleString("en-US");
        let pri;
        if (strong.length === 1) {
            const x = strong[0];
            const spread = (x[Math.floor(x.length * 0.95)] - x[Math.floor(x.length * 0.05)]) / 2 / means[0];
            pri =
                spread > 0.01
                    ? { text: `jittered PRI ${fmt(means[0])} µs ± ${Math.round(spread * 100)}%`, values: means }
                    : { text: `constant PRI ${fmt(means[0])} µs (PRF ${fmt(1e6 / means[0])} Hz)`, values: means };
        } else {
            // Stagger changes PRI every pulse; dwell-and-switch holds each PRI for many pulses
            const which = (d) => means.findIndex((m) => Math.abs(d - m) < 20);
            let same = 0;
            let pairs = 0;
            for (let i = 1; i < c.diffs.length; i++) {
                const a = which(c.diffs[i - 1]);
                const b = which(c.diffs[i]);
                if (a >= 0 && b >= 0) {
                    pairs++;
                    if (a === b) same++;
                }
            }
            const list = means.map(fmt).join(" / ");
            const frame = means.reduce((s, v) => s + v, 0);
            pri =
                same / Math.max(1, pairs) > 0.8
                    ? { text: `dwell-and-switch PRI ${list} µs`, values: means }
                    : { text: `staggered PRI, ${means.length} positions ${list} µs (frame ${fmt(frame)} µs)`, values: means, frame };
        }
        // Scan period: time between the starts of successive illuminations; beamwidth: time within 3 dB of the peak.
        // The first run may have started before the history did, and the last may still be going, so skip them
        const runs = illuminations(c);
        const ills = runs.slice(1, -1);
        let scan;
        if (runs.some((r) => r.end - r.start > 2)) scan = "steady amplitude, no scan seen";
        else if (ills.length < 2) scan = "scan: waiting for more sweeps";
        else {
            const period = median(ills.slice(1).map((x, i) => x.start - ills[i].start));
            const widths = ills.map((x) => {
                const peak = Math.max(...x.a);
                const inBeam = x.t.filter((_, i) => x.a[i] > peak - 3);
                return inBeam[inBeam.length - 1] - inBeam[0];
            });
            scan = `circular scan ${period.toFixed(1)} s, beam about ${((median(widths) / period) * 360).toFixed(0)}°`;
        }
        return { pri, scan };
    }

    return { ring, clusters, mixedHist, clusterHist, add, decay, classify };
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
        `<label style="cursor:pointer"><input type="checkbox" data-id="deinterleave" checked> Deinterleave</label>` +
        `<span>Simulated data: four generic radars</span>` +
        `<span data-id="readout" aria-live="polite" style="flex-basis:100%; min-height:1.4em; color:#c8d3e8"></span>`;
    const table = document.createElement("div");
    table.setAttribute("role", "status");
    table.style.cssText = "padding:0 12px 4px; min-height:4.2em; font-size:13px; color:#c8d3e8;";
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const panel = (title, grow) => {
        const div = document.createElement("div");
        div.style.cssText = `flex:${grow} 1 420px; min-width:0; min-height:250px; display:flex; flex-direction:column;`;
        const heading = document.createElement("div");
        heading.textContent = title;
        heading.style.cssText = "padding:2px 12px; font-weight:600;";
        const chart = document.createElement("div");
        chart.style.cssText = "flex:1; min-height:0;";
        div.append(heading, chart);
        body.append(div);
        return chart;
    };
    const divs = {
        toa: panel("Time of arrival vs frequency (each dot is a pulse)", 3),
        pw: panel("Pulse width vs frequency", 2),
        amp: panel("Amplitude vs time (scan pattern)", 3),
        hist: panel("PRI histogram (difference of TOA)", 2)
    };
    for (const [name, div] of Object.entries(divs)) div.id = `${divElementId}-${name}`;
    root.append(bar, table, body);
    return {
        divs,
        table,
        pauseButton: bar.querySelector('button[data-id="pause"]'),
        deinterleaveBox: bar.querySelector("input"),
        readout: bar.querySelector('span[data-id="readout"]')
    };
}

async function elintPulseAnalysis(divElementId) {
    const ui = createLayout(divElementId);
    const sorter = createDeinterleaver();

    // #region_A_start
    // An ELINT pulse display: TOA vs frequency, pulse width vs frequency, amplitude vs time and a PRI histogram,
    // fed in batches from a stream of pulse descriptor words, charted with SciChart.js
    const {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAutoRange,
        XyDataSeries,
        XyScatterRenderableSeries,
        FastColumnRenderableSeries,
        StackedColumnCollection,
        StackedColumnRenderableSeries,
        EllipsePointMarker,
        EAxisAlignment,
        EDataPointWidthMode,
        CustomChartModifier2D,
        translateFromCanvasToSeriesViewRect,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const createChart = async (div, xTitle, yTitle, xRange, yRange, xPrecision, yPrecision) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(div, { theme: new SciChartJsNavyTheme() });
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: xTitle,
                visibleRange: xRange,
                autoRange: EAutoRange.Never,
                labelPrecision: xPrecision,
                drawMinorGridLines: false
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: yTitle,
                axisAlignment: EAxisAlignment.Left,
                labelPrecision: yPrecision,
                visibleRange: yRange,
                autoRange: yRange ? EAutoRange.Never : EAutoRange.Always,
                growBy: new NumberRange(0, 0.1),
                drawMinorGridLines: false
            })
        );
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
        return { sciChartSurface, wasmContext };
    };
    const toaChart = await createChart(ui.divs.toa, "Time of arrival (s)", "Frequency (GHz)", new NumberRange(0, WINDOW_S), new NumberRange(9.1, 9.7), 0, 1);
    const pwChart = await createChart(ui.divs.pw, "Frequency (GHz)", "Pulse width (µs)", new NumberRange(9.1, 9.7), new NumberRange(0, 2.5), 1, 1);
    const ampChart = await createChart(ui.divs.amp, "Time of arrival (s)", "Amplitude (dBm)", new NumberRange(0, WINDOW_S), new NumberRange(-80, -25), 0, 0);
    const histChart = await createChart(ui.divs.hist, "Time between pulses, ΔTOA (µs)", "Pulse pairs", new NumberRange(0, MAX_DT_US), null, 0, 0);
    const charts = [toaChart, pwChart, ampChart, histChart];
    const wasmContext = toaChart.wasmContext;
    // Line up the y-axes of the two time charts, so their time axes match exactly
    const group = new SciChartVerticalGroup();
    group.addSurfaceToGroup(toaChart.sciChartSurface);
    group.addSurfaceToGroup(ampChart.sciChartSurface);

    // One scatter series per recovered emitter on each chart. fifoCapacity makes each data series a circular buffer:
    // it keeps the newest pulses and drops the oldest, so memory stays flat however long the stream runs.
    const scatter = (chart, capacity, isSorted) =>
        COLOURS.map((colour) => {
            const dataSeries = new XyDataSeries(wasmContext, { fifoCapacity: capacity, isSorted, containsNaN: false });
            const series = new XyScatterRenderableSeries(wasmContext, {
                dataSeries,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 3, height: 3, strokeThickness: 0, fill: colour, stroke: colour })
            });
            chart.sciChartSurface.renderableSeries.add(series);
            return { series, dataSeries };
        });
    const toaSeries = scatter(toaChart, 40000, true);
    const pwSeries = scatter(pwChart, 20000, false);
    const ampSeries = scatter(ampChart, 40000, true);

    // The PRI histogram: one column per 10 µs bin. Mixed: all pulse pairs. Deinterleaved: each emitter's own pairs,
    // stacked, so a bin where two emitters' harmonics coincide shows both colours
    const binCentres = Float64Array.from({ length: BINS }, (_, b) => b * BIN_US);
    const mixedData = new XyDataSeries(wasmContext, { isSorted: true, containsNaN: false });
    const mixedHistSeries = {
        dataSeries: mixedData,
        series: new FastColumnRenderableSeries(wasmContext, {
            dataSeries: mixedData,
            fill: MIXED_COLOUR,
            strokeThickness: 0,
            dataPointWidthMode: EDataPointWidthMode.Range,
            dataPointWidth: BIN_US
        })
    };
    const stack = new StackedColumnCollection(wasmContext, { dataPointWidthMode: EDataPointWidthMode.Range, dataPointWidth: BIN_US });
    const clusterHistSeries = COLOURS.map((colour) => {
        const dataSeries = new XyDataSeries(wasmContext, { isSorted: true, containsNaN: false });
        const series = new StackedColumnRenderableSeries(wasmContext, { dataSeries, fill: colour, strokeThickness: 0 });
        stack.add(series);
        return { series, dataSeries };
    });
    histChart.sciChartSurface.renderableSeries.add(mixedHistSeries.series, stack);
    // Only the histogram on show gets data: the mixed one, or the stack of emitters' own
    function updateHistogram() {
        mixedHistSeries.dataSeries.clear();
        if (!deinterleaved) mixedHistSeries.dataSeries.appendRange(binCentres, sorter.mixedHist);
        clusterHistSeries.forEach(({ dataSeries }, c) => {
            dataSeries.clear();
            if (deinterleaved) dataSeries.appendRange(binCentres, sorter.clusterHist[c]);
        });
    }

    // Append a batch of pulses: one appendRange per series, never point by point
    function appendPulses(pulses) {
        for (let c = 0; c < COLOURS.length; c++) {
            const mine = pulses.filter((p) => p.cluster === c);
            if (mine.length === 0) continue;
            const toa = Float64Array.from(mine.map((p) => p.toa));
            const rf = Float64Array.from(mine.map((p) => p.rf));
            toaSeries[c].dataSeries.appendRange(toa, rf);
            pwSeries[c].dataSeries.appendRange(rf, Float64Array.from(mine.map((p) => p.pw)));
            ampSeries[c].dataSeries.appendRange(toa, Float64Array.from(mine.map((p) => p.amp)));
        }
    }

    // Deinterleave on: colour each pulse by its recovered emitter, and show each emitter's own histogram
    let deinterleaved = ui.deinterleaveBox.checked;
    function applyDeinterleave() {
        deinterleaved = ui.deinterleaveBox.checked;
        [toaSeries, pwSeries, ampSeries].forEach((list) =>
            list.forEach(({ series }, c) => {
                const colour = deinterleaved ? COLOURS[c] : MIXED_COLOUR;
                series.pointMarker.fill = colour;
                series.pointMarker.stroke = colour;
            })
        );
        updateHistogram();
        showTable();
    }
    function showTable() {
        if (!deinterleaved) {
            ui.table.textContent = "All pulses mixed together, as the receiver hears them. Tick Deinterleave to sort them into emitters.";
            return;
        }
        ui.table.innerHTML = sorter.clusters
            .map((c, i) => {
                const r = c.report;
                const what = r ? `${r.pri.text}; ${r.scan}` : "measuring…";
                return `<div><span style="color:${COLOURS[i]}">●</span> Emitter ${i + 1}: ${c.rf.toFixed(3)} GHz, pulse width ${c.pw.toFixed(2)} µs, ${what}</div>`;
            })
            .join("");
    }
    ui.deinterleaveBox.addEventListener("change", applyDeinterleave);

    // Hover: the nearest pulse's full PDW, or the histogram bar under the mouse
    let hover = null;
    const defaultText = "Hover over a pulse to read its PDW, or over the histogram to read a time difference.";
    function showReadout() {
        if (!hover) {
            ui.readout.textContent = defaultText;
            return;
        }
        if (hover.kind === "hist") {
            const bin = Math.round(hover.x / BIN_US);
            if (bin < 0 || bin >= BINS) return void (ui.readout.textContent = defaultText);
            const dt = bin * BIN_US;
            let text = `ΔTOA ${dt.toLocaleString("en-US")} ± ${BIN_US / 2} µs: ${Math.round(sorter.mixedHist[bin]).toLocaleString("en-US")} recent pulse pairs in the mixed stream.`;
            if (deinterleaved) {
                sorter.clusters.forEach((c, i) => {
                    const values = c.report ? [...c.report.pri.values, ...(c.report.pri.frame ? [c.report.pri.frame] : [])] : [];
                    for (const v of values) {
                        const n = Math.round(dt / v);
                        if (n >= 1 && Math.abs(dt - n * v) <= BIN_US * 0.6) {
                            text += n === 1 ? ` Emitter ${i + 1}: its PRI (${Math.round(v)} µs).` : ` Emitter ${i + 1}: ${n} × ${Math.round(v)} µs, a harmonic.`;
                            break;
                        }
                    }
                });
            }
            ui.readout.textContent = text;
            return;
        }
        const { ring } = sorter;
        const i = hover.index;
        const c = ring.cluster[i];
        ui.readout.textContent =
            `Pulse at ${ring.toa[i].toFixed(6)} s: frequency ${ring.rf[i].toFixed(3)} GHz, pulse width ${ring.pw[i].toFixed(2)} µs, ` +
            `amplitude ${ring.amp[i].toFixed(1)} dBm, angle of arrival ${ring.aoa[i].toFixed(0)}°` +
            (deinterleaved ? `. Recovered as emitter ${c + 1}.` : ".");
    }
    // The nearest pulse to the mouse, in pixels, among the recent pulses
    function nearestPulse(kind, chart, px, py) {
        const xCalc = chart.sciChartSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        const yCalc = chart.sciChartSurface.yAxes.get(0).getCurrentCoordinateCalculator();
        const { ring } = sorter;
        const xs = kind === "pw" ? ring.rf : ring.toa;
        const ys = kind === "pw" ? ring.pw : kind === "amp" ? ring.amp : ring.rf;
        let best = -1;
        let bestD = 64; // within 8 pixels
        for (let i = 0; i < Math.min(ring.count, RING); i++) {
            const dx = xCalc.getCoordinate(xs[i]) - px;
            const dy = yCalc.getCoordinate(ys[i]) - py;
            const d = dx * dx + dy * dy;
            if (d < bestD) {
                bestD = d;
                best = i;
            }
        }
        return best;
    }
    function createReadoutModifier(kind, chart) {
        class PdwReadoutModifier extends CustomChartModifier2D {
            modifierMouseMove(args) {
                super.modifierMouseMove(args);
                const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
                hover = null;
                if (point && kind === "hist") {
                    hover = { kind, x: this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(point.x) };
                } else if (point) {
                    const index = nearestPulse(kind, chart, point.x, point.y);
                    if (index >= 0) hover = { kind, index };
                }
                showReadout();
            }
            modifierMouseLeave(args) {
                super.modifierMouseLeave(args);
                hover = null;
                showReadout();
            }
        }
        return new PdwReadoutModifier();
    }
    toaChart.sciChartSurface.chartModifiers.add(createReadoutModifier("toa", toaChart));
    pwChart.sciChartSurface.chartModifiers.add(createReadoutModifier("pw", pwChart));
    ampChart.sciChartSurface.chartModifiers.add(createReadoutModifier("amp", ampChart));
    histChart.sciChartSurface.chartModifiers.add(createReadoutModifier("hist", histChart));

    // Start with SCAN_HISTORY_S seconds of pulses, processed in 50 ms steps and appended in one batch
    let simTime = 0;
    const history = [];
    while (simTime < SCAN_HISTORY_S) {
        simTime += 0.05;
        const pulses = receivePulses(simTime);
        sorter.add(pulses);
        sorter.decay(simTime);
        history.push(...pulses);
    }
    appendPulses(history);
    sorter.clusters.forEach((c) => (c.report = sorter.classify(c)));
    updateHistogram();
    applyDeinterleave();
    showReadout();

    // The stream: each frame, receive the pulses since the last frame and append them in one batch per series
    let paused = false;
    ui.pauseButton.addEventListener("click", () => {
        paused = !paused;
        ui.pauseButton.textContent = paused ? "Play" : "Pause";
    });
    let lastTime = performance.now();
    let sinceHistogram = 0;
    let sinceReport = 0;
    function animate(now) {
        // Stop when any chart is deleted (for example when a React component unmounts)
        if (charts.some((chart) => chart.sciChartSurface.isDeleted)) return;
        const dt = Math.min(now - lastTime, 100) / 1000;
        lastTime = now;
        if (!paused) {
            simTime += dt;
            const pulses = receivePulses(simTime);
            sorter.add(pulses);
            appendPulses(pulses);
            // Scroll both time charts to show the last WINDOW_S seconds
            const range = new NumberRange(simTime - WINDOW_S, simTime);
            toaChart.sciChartSurface.xAxes.get(0).visibleRange = range;
            ampChart.sciChartSurface.xAxes.get(0).visibleRange = range;
            // The histogram (400 bins per series) and the emitter reports don't need redrawing every frame
            sinceHistogram += dt;
            sinceReport += dt;
            if (sinceHistogram >= 0.1) {
                sinceHistogram = 0;
                sorter.decay(simTime);
                updateHistogram();
                if (hover && hover.kind === "hist") showReadout();
            }
            if (sinceReport >= 0.5) {
                sinceReport = 0;
                sorter.clusters.forEach((c) => (c.report = sorter.classify(c)));
                showTable();
            }
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    // #region_A_end
}

elintPulseAnalysis("scichart-root");
