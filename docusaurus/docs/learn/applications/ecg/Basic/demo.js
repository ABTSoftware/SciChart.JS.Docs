import * as SciChart from "scichart";

// A simulated ECG monitor. Sample data only: the waveforms come from a simple model of the heart's electrical
// activity, not from a patient, and the demo is for learning how ECG traces are drawn and read.
//
// The model: at each moment the heart's electrical activity is one vector (a dipole) in three dimensions, which
// rotates and changes size through each beat. Every lead sees that same vector from its own direction, so all
// twelve leads come from one source, as in a real recording. A seeded random generator makes the noise and the
// irregular rhythms look the same every time the demo loads.
const SAMPLE_RATE = 500; // samples per second, a common rate for diagnostic ECGs
const MM_PER_SECOND = 25; // standard paper speed
const MM_PER_MV = 10; // standard gain
const LEADS = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"];
// The standard printed layout: three rows of four columns, 2.5 s each, then a 10 s rhythm strip of lead II
const TWELVE_LEAD_ROWS = [
    ["I", "aVR", "V1", "V4"],
    ["II", "aVL", "V2", "V5"],
    ["III", "aVF", "V3", "V6"]
];

let seed = 20261120;
function random() {
    seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
}
// Roughly Gaussian noise with a standard deviation of 1
const gaussian = () => (random() + random() + random() - 1.5) * 2;

// --- Leads: how each lead sees the heart vector h = [x (to the patient's left), y (down), z (forwards)] ---
const toRadians = (degrees) => (degrees * Math.PI) / 180;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
// Einthoven's triangle: the right arm, left arm and left leg electrodes seen from the heart, in the frontal plane
const LIMB_ELECTRODES = {
    RA: [Math.cos(toRadians(-150)), Math.sin(toRadians(-150)), 0],
    LA: [Math.cos(toRadians(-30)), Math.sin(toRadians(-30)), 0],
    LL: [0, 1, 0]
};
// Chest electrodes V1 to V6 around the horizontal plane (0° = the patient's left, 90° = straight forwards), and a
// gain for each, because the chest electrodes nearest the heart record the largest waves
const CHEST_ELECTRODES = {
    V1: { angle: 115, gain: 1.0 },
    V2: { angle: 92, gain: 1.5 },
    V3: { angle: 72, gain: 1.6 },
    V4: { angle: 52, gain: 1.6 },
    V5: { angle: 28, gain: 1.3 },
    V6: { angle: 5, gain: 1.0 }
};

// The voltage (mV) that one lead records for the heart vector h. The limb leads are differences between electrode
// potentials, so lead II always equals lead I + lead III (Einthoven's law), and aVR + aVL + aVF = 0.
function leadVoltage(lead, h) {
    const potential = (electrode) => dot(LIMB_ELECTRODES[electrode], h) / Math.sqrt(3);
    const ra = potential("RA");
    const la = potential("LA");
    const ll = potential("LL");
    switch (lead) {
        case "I":
            return la - ra;
        case "II":
            return ll - ra;
        case "III":
            return ll - la;
        case "aVR":
            return ra - (la + ll) / 2;
        case "aVL":
            return la - (ra + ll) / 2;
        case "aVF":
            return ll - (ra + la) / 2;
    }
    // A chest lead compares its electrode with the average of the three limb electrodes (Wilson's central terminal)
    const { angle, gain } = CHEST_ELECTRODES[lead];
    return gain * dot([Math.cos(toRadians(angle)), 0, Math.sin(toRadians(angle))], h);
}

// --- Beats: each beat is a few bell-shaped bursts of the heart vector, and the times that mark its waves ---
// A burst peaks at `at` (s), rises over `rise` and falls over `fall` (standard deviations, s), along vector `v` (mV)
const burst = (at, rise, fall, v) => ({ at, rise, fall, v });

// A normally conducted beat starting at time t0 (the P wave's start). rrBefore is the time since the last beat (s).
function sinusBeat(t0, rrBefore, hasP) {
    const pr = 0.16; // P onset to QRS onset (s)
    const qrsOn = t0 + pr;
    const qt = 0.4 * Math.cbrt(rrBefore); // QT shortens as the heart speeds up (Fridericia's cube-root relation)
    const tEnd = qrsOn + qt;
    const bursts = [
        burst(qrsOn + 0.015, 0.006, 0.006, [-0.15, 0.05, 0.25]), // septum, left to right: small q in I and V6, r in V1
        burst(qrsOn + 0.035, 0.01, 0.01, [0.55, 0.75, 0.55]), // the ventricles, early
        burst(qrsOn + 0.052, 0.01, 0.01, [0.75, 0.55, -0.55]), // the ventricles, late: towards the left and back
        burst(qrsOn + 0.07, 0.008, 0.008, [-0.15, -0.25, -0.4]), // the base of the heart, last: the S wave
        burst(tEnd - 0.075, 0.06, 0.028, [0.3, 0.3, 0.25]), // T wave: the ventricles recovering
        burst(tEnd + 0.06, 0.025, 0.025, [0.01, 0.02, 0.05]) // a small U wave
    ];
    if (hasP) bursts.push(burst(t0 + 0.05, 0.02, 0.02, [0.09, 0.12, 0.03])); // P wave: the atria
    return {
        kind: "normal",
        pOn: hasP ? t0 : NaN,
        qrsOn,
        qrsOff: qrsOn + 0.09,
        tEnd,
        bursts
    };
}

// A premature ventricular complex (PVC): it starts in the ventricle, with no P wave, spreads slowly through the
// muscle (a wide QRS) and recovers the other way (a T wave opposite to the QRS)
function ectopicBeat(qrsOn) {
    return {
        kind: "PVC",
        pOn: NaN,
        qrsOn,
        qrsOff: qrsOn + 0.16,
        tEnd: qrsOn + 0.44,
        bursts: [
            burst(qrsOn + 0.05, 0.02, 0.022, [0.9, -0.4, -0.7]),
            burst(qrsOn + 0.11, 0.022, 0.02, [0.6, 0.3, -0.6]),
            burst(qrsOn + 0.33, 0.07, 0.035, [-0.35, 0.05, 0.3])
        ]
    };
}

// The heart vector at time t: the sum of the bursts of the beats around t, plus the fibrillation waves in AF
function heartVector(beats, t, fibrillation) {
    const h = [0, 0, 0];
    for (const beat of beats) {
        if (beat.qrsOn > t + 0.3 || beat.tEnd < t - 0.3) continue;
        for (const { at, rise, fall, v } of beat.bursts) {
            const s = t < at ? rise : fall;
            const k = Math.exp(-0.5 * ((t - at) / s) * ((t - at) / s));
            h[0] += k * v[0];
            h[1] += k * v[1];
            h[2] += k * v[2];
        }
    }
    if (fibrillation) {
        // Chaotic atrial activity: a few drifting oscillations of 5 to 8 Hz, seen best in V1 and the inferior leads
        const f =
            Math.sin(2 * Math.PI * 5.3 * t + 2 * Math.sin(0.7 * t)) +
            0.7 * Math.sin(2 * Math.PI * 6.9 * t + 1.5 * Math.sin(1.1 * t)) +
            0.5 * Math.sin(2 * Math.PI * 8.1 * t);
        h[0] += 0.01 * f;
        h[1] += 0.03 * f;
        h[2] += 0.06 * f;
    }
    return h;
}

// Builds the beats as time goes on, for the chosen rhythm and heart rate
function createRhythmGenerator() {
    const beats = [];
    let next = 0.2; // when the next beat starts (s)
    let sinceEctopic = 0;
    let rrBefore = 0.83; // the interval before the next beat, which sets its QT
    return {
        beats,
        // Adds beats until the timeline reaches `until`, and forgets those more than 12 s old
        extend(until, rhythm, heartRate) {
            const meanRR = 60 / heartRate;
            while (next < until) {
                if (rhythm === "af") {
                    // Atrial fibrillation: no P waves, and the gaps between beats vary at random
                    const rr = Math.max(0.33, meanRR * (0.55 + 0.9 * random()));
                    beats.push(sinusBeat(next - 0.16, rrBefore, false));
                    next += rr;
                    rrBefore = rr;
                } else {
                    // Sinus rhythm, with a little natural variation in rate as the patient breathes
                    const rr = meanRR * (1 + 0.025 * Math.sin((2 * Math.PI * next) / 4.5));
                    const beat = sinusBeat(next, rrBefore, true);
                    beats.push(beat);
                    next += rr;
                    rrBefore = rr;
                    sinceEctopic++;
                    if (rhythm === "pvc" && sinceEctopic > 2 && random() < 0.3) {
                        // A PVC comes early, then a pause: the next normal beat is due two cycles after the last one
                        beats.push(ectopicBeat(beat.qrsOn + 0.6 * rr));
                        next += rr;
                        rrBefore = 1.4 * rr; // from the PVC to the next normal beat
                        sinceEctopic = 0;
                    }
                }
            }
            while (beats.length && beats[0].tEnd < until - 12) beats.shift();
        }
    };
}

// The controls, the readouts and the chart each need an element. In your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const header = document.createElement("div");
    header.style.cssText = "padding:6px 12px 2px; color:#ffffff;" + font;
    const leadOptions = LEADS.map((lead) => `<option${lead === "II" ? " selected" : ""}>${lead}</option>`).join("");
    header.innerHTML =
        `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:4px 14px; margin-bottom:4px">` +
        `<label>Layout <select data-id="layout" style="font:inherit">` +
        `<option value="single">Rhythm strip (one lead)</option>` +
        `<option value="twelve">12-lead (3 × 4 + rhythm strip)</option></select></label>` +
        `<label>Lead <select data-id="lead" style="font:inherit">${leadOptions}</select></label>` +
        `<label>Rhythm <select data-id="rhythm" style="font:inherit">` +
        `<option value="normal">Normal sinus rhythm</option>` +
        `<option value="tachycardia">Sinus tachycardia</option>` +
        `<option value="bradycardia">Sinus bradycardia</option>` +
        `<option value="af">Atrial fibrillation</option>` +
        `<option value="pvc">Sinus rhythm with PVCs</option></select></label>` +
        `<label>Heart rate <input data-id="rate" type="range" min="35" max="170" step="1" value="72" ` +
        `style="vertical-align:middle; width:110px"> <output data-id="rate"></output></label>` +
        `<label><input data-id="intervals" type="checkbox" checked> Show intervals</label>` +
        `<button data-id="run" style="font:inherit; min-width:72px; padding:1px 10px; cursor:pointer">Pause</button>` +
        `</div>`;
    const readoutRow = document.createElement("div");
    readoutRow.setAttribute("aria-live", "off");
    readoutRow.style.cssText = "display:flex; flex-wrap:wrap; gap:6px; margin:2px 0 4px;";
    header.append(readoutRow);
    const chart = document.createElement("div");
    chart.id = `${divElementId}-chart`;
    chart.style.cssText = "flex:1; min-height:0;";
    root.append(header, chart);
    const get = (selector) => header.querySelector(selector);
    return {
        chart,
        readoutRow,
        layout: get('select[data-id="layout"]'),
        lead: get('select[data-id="lead"]'),
        rhythm: get('select[data-id="rhythm"]'),
        rate: get('input[data-id="rate"]'),
        rateOut: get('output[data-id="rate"]'),
        intervals: get('input[data-id="intervals"]'),
        run: get('button[data-id="run"]')
    };
}

async function ecgMonitor(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A sweeping ECG on ECG paper with SciChart.js: one lead or a 12-lead layout, with calipers on the latest beat
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        FastLineRenderableSeries,
        XyDataSeries,
        BoxAnnotation,
        TextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const TRACE_COLOUR = "#3BD16F"; // monitors traditionally draw the ECG in green
    const MV_PER_SECOND = MM_PER_SECOND / MM_PER_MV; // 2.5 mV of height looks as tall as 1 s is wide
    const ROW_BASELINES = [4.3, 1.3, -1.7, -4.6]; // mV: three rows of four leads, then the rhythm strip

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.chart, {
        theme: new SciChartJsNavyTheme()
    });

    // ECG paper: a small square is 1 mm (0.04 s by 0.1 mV) and a large square 5 mm (0.2 s by 0.5 mV)
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "Time in sweep (s)",
        autoRange: EAutoRange.Never,
        autoTicks: false,
        majorDelta: 0.2,
        minorDelta: 0.04,
        drawMajorBands: false,
        majorGridLineStyle: { color: "#E0607E80", strokeThickness: 1 },
        minorGridLineStyle: { color: "#E0607E30", strokeThickness: 1 },
        cursorLabelPrecision: 2
    });
    xAxis.labelProvider.formatLabel = (value) =>
        Math.abs(value - Math.round(value)) < 1e-6 ? `${Math.round(value)}` : "";
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "mV",
        autoRange: EAutoRange.Never,
        autoTicks: false,
        majorDelta: 0.5,
        minorDelta: 0.1,
        drawMajorBands: false,
        majorGridLineStyle: { color: "#E0607E80", strokeThickness: 1 },
        minorGridLineStyle: { color: "#E0607E30", strokeThickness: 1 },
        labelPrecision: 0,
        cursorLabelPrecision: 2
    });
    yAxis.labelProvider.formatLabel = (value) =>
        Math.abs(value - Math.round(value)) < 1e-6 ? `${Math.round(value)}` : "";
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Calipers on the latest complete beat: shaded spans for the PR interval, the QRS and the QT interval
    const caliper = (fill, stroke) =>
        new BoxAnnotation({ fill, stroke, strokeThickness: 1, x1: 0, x2: 0, y1: 0, y2: 0, isHidden: true });
    const label = (textColor, horizontalAnchorPoint, verticalAnchorPoint) =>
        new TextAnnotation({
            text: "",
            textColor,
            fontSize: 13,
            x1: 0,
            y1: 0,
            isHidden: true,
            horizontalAnchorPoint,
            verticalAnchorPoint
        });
    const calipers = {
        // The PR label sits to the left of the P wave, the QRS label above the R wave and the QT label underneath
        qt: {
            box: caliper("#F6E05E18", "#F6E05E99"),
            text: label("#F6E05E", EHorizontalAnchorPoint.Left, EVerticalAnchorPoint.Top)
        },
        pr: {
            box: caliper("#50C7E030", "#50C7E0CC"),
            text: label("#50C7E0", EHorizontalAnchorPoint.Right, EVerticalAnchorPoint.Bottom)
        },
        qrs: {
            box: caliper("#FF8A3D40", "#FF8A3DCC"),
            text: label("#FF8A3D", EHorizontalAnchorPoint.Left, EVerticalAnchorPoint.Bottom)
        }
    };
    Object.values(calipers).forEach(({ box, text }) => sciChartSurface.annotations.add(box, text));
    // Lead names for the 12-lead layout, at the start of each column
    const leadLabels = [];
    const leadLabel = (lead, x, baseline) =>
        new TextAnnotation({
            text: lead,
            textColor: "#FFFFFF",
            fontSize: 14,
            x1: x + 0.08,
            y1: baseline + 1.2,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom
        });

    // Hover for the time and voltage; pause, then scroll to zoom, drag to pan and double-click to reset
    const cursor = new CursorModifier({ showTooltip: true, tooltipContainerBackground: "#14233CDD" });
    sciChartSurface.chartModifiers.add(
        cursor,
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier({
            onZoomExtents: () => {
                setView(true);
                return false; // back to the calibrated ECG paper view, not to the data
            }
        })
    );

    // --- Traces: a fixed time grid per trace. The sweep writes into it from left to right, then wraps around. ---
    let layout = "single";
    let windowSeconds = 4;
    let traces = []; // { leadAt(i), offset(i), ys, dataSeries }
    let xs = [];
    function buildTraces() {
        traces.forEach((trace) => sciChartSurface.renderableSeries.remove(trace.line, true));
        leadLabels.forEach((annotation) => sciChartSurface.annotations.remove(annotation, true));
        leadLabels.length = 0;
        windowSeconds = layout === "single" ? 4 : 10; // a 4-second strip, as on a monitor screen, or a 10-second 12-lead
        const count = windowSeconds * SAMPLE_RATE;
        xs = Array.from({ length: count }, (_, i) => i / SAMPLE_RATE);
        const columnLength = count / 4;
        const rows =
            layout === "single"
                ? [{ name: `Lead ${ui.lead.value}`, leadAt: () => ui.lead.value, baseline: 0, isColumns: false }]
                : [
                      ...TWELVE_LEAD_ROWS.map((row, r) => ({
                          name: row.join(", "),
                          leadAt: (i) => row[Math.floor(i / columnLength)],
                          baseline: ROW_BASELINES[r],
                          isColumns: true
                      })),
                      {
                          name: "Rhythm strip, lead II",
                          leadAt: () => "II",
                          baseline: ROW_BASELINES[3],
                          isColumns: false
                      }
                  ];
        traces = rows.map((row) => {
            const dataSeries = new XyDataSeries(wasmContext, {
                dataSeriesName: row.name,
                isSorted: true,
                containsNaN: true
            });
            const line = new FastLineRenderableSeries(wasmContext, {
                dataSeries,
                stroke: TRACE_COLOUR,
                strokeThickness: 1.5
            });
            sciChartSurface.renderableSeries.add(line);
            return { ...row, ys: new Float64Array(count).fill(NaN), dataSeries, line };
        });
        if (layout === "twelve") {
            TWELVE_LEAD_ROWS.forEach((row, r) =>
                row.forEach((lead, c) => {
                    leadLabels.push(leadLabel(lead, c * (windowSeconds / 4), ROW_BASELINES[r]));
                })
            );
            leadLabels.push(leadLabel("II", 0, ROW_BASELINES[3]));
            leadLabels.forEach((annotation) => sciChartSurface.annotations.add(annotation));
        }
        cursor.showTooltip = layout === "single"; // in the 12-lead layout, rows are offset, so only times are shown
        cursor.showYLine = layout === "single";
        yAxis.drawLabels = layout === "single";
        yAxis.axisTitle = layout === "single" ? "mV" : "";
        setView(true);
    }

    // Keeps the squares square at 25 mm/s and 10 mm/mV, whatever the size of the chart
    let lastAspect = 0;
    function setView(force) {
        const rect = sciChartSurface.seriesViewRect;
        const hasSize = Boolean(rect) && rect.width > 0 && rect.height > 0;
        const aspect = hasSize ? rect.height / rect.width : 0.45; // before the first layout, assume a typical shape
        if (!force && Math.abs(aspect - lastAspect) < 0.005) return;
        lastAspect = aspect;
        // On very wide or very tall screens, stretch the squares a little to keep the waves in view
        const [minimum, maximum] = layout === "single" ? [3.5, 5.5] : [12.4, 15];
        const span = Math.min(maximum, Math.max(minimum, windowSeconds * MV_PER_SECOND * aspect));
        const centre = layout === "single" ? 0.4 : 0;
        xAxis.visibleRange = new NumberRange(0, windowSeconds);
        yAxis.visibleRange = new NumberRange(centre - span / 2, centre + span / 2);
        // Hide the small squares when they would be less than 4 pixels wide
        const pixelsPerSmallSquare = hasSize ? (rect.width / windowSeconds) * 0.04 : 4;
        xAxis.drawMinorGridLines = pixelsPerSmallSquare >= 4;
        yAxis.drawMinorGridLines = pixelsPerSmallSquare >= 4;
    }

    // --- The live sweep ---
    const generator = createRhythmGenerator();
    let sample = 0; // samples drawn so far
    let running = true;
    const settings = { rhythm: "normal", heartRate: 72, showIntervals: true };
    const GAP = Math.round(0.2 * SAMPLE_RATE); // a 0.2 s gap ahead of the sweep, as on a monitor

    // Writes sample number s into every trace, at its place in the sweep
    function writeSample(s) {
        const length = xs.length;
        const t = s / SAMPLE_RATE;
        const i = s % length;
        const h = heartVector(generator.beats, t, settings.rhythm === "af");
        const wander = 0.04 * Math.sin(2 * Math.PI * 0.21 * t); // slow baseline wander, e.g. from breathing
        for (const trace of traces) {
            // Break the line where one lead ends and the next begins, as on a printed 12-lead
            const isColumnStart = trace.isColumns && i % (length / 4) === 0;
            trace.ys[i] = isColumnStart
                ? NaN
                : trace.baseline + leadVoltage(trace.leadAt(i), h) + wander + 0.012 * gaussian();
        }
    }

    // Clears the gap ahead of the write position and sends the traces to the chart
    function refresh() {
        const length = xs.length;
        const writeAt = sample % length;
        for (const trace of traces) {
            for (let g = 0; g < GAP; g++) trace.ys[(writeAt + g) % length] = NaN;
            trace.dataSeries.clear();
            trace.dataSeries.appendRange(xs, trace.ys);
        }
    }

    function addSamples(count) {
        generator.extend((sample + count) / SAMPLE_RATE + 1, settings.rhythm, settings.heartRate);
        for (let n = 0; n < count; n++) writeSample(sample++);
        refresh();
    }

    // Redraws the sweep on screen from the beats already made, after a change of lead or layout
    function redrawSweep() {
        const start = Math.max(0, sample - xs.length + GAP);
        for (let s = start; s < sample; s++) writeSample(s);
        refresh();
    }

    // --- Readouts ---
    const readoutNames = ["Rhythm", "Heart rate", "PR", "QRS", "QT", "QTc (Bazett)", "QTc (Fridericia)", "Paper"];
    const readouts = readoutNames.map((name) => {
        const tile = document.createElement("div");
        tile.style.cssText = "padding:2px 10px; border-radius:6px; background:#14233C; min-width:76px;";
        tile.innerHTML = `<div style="font-size:11px; color:#c8d3e8">${name}</div><div style="font-size:15px; font-weight:600">–</div>`;
        ui.readoutRow.append(tile);
        return tile.lastElementChild;
    });
    const ms = (seconds) => (isFinite(seconds) ? `${Math.round(seconds * 1000)} ms` : "–");

    function rhythmName(rate) {
        if (settings.rhythm === "af") return "Atrial fibrillation";
        if (settings.rhythm === "pvc") return "Sinus rhythm with PVCs";
        return rate > 100 ? "Sinus tachycardia" : rate < 60 ? "Sinus bradycardia" : "Normal sinus rhythm";
    }

    // Measures the latest complete beat, places the calipers on it and updates the readouts
    function measure() {
        const now = sample / SAMPLE_RATE;
        const done = generator.beats.filter((beat) => beat.tEnd + 0.05 < now && beat.qrsOn > now - 8);
        // Heart rate from the QRS complexes of the last 6 seconds, as a monitor counts them
        const recent = done.filter((beat) => beat.qrsOn > now - 6);
        const rate =
            recent.length > 1 ? (60 * (recent.length - 1)) / (recent[recent.length - 1].qrsOn - recent[0].qrsOn) : NaN;
        // The calipers go on the latest normally conducted beat that sits within one sweep
        let index = -1;
        for (let k = done.length - 1; k > 0 && index < 0; k--) {
            const beat = done[k];
            const start = isFinite(beat.pOn) ? beat.pOn : beat.qrsOn;
            const sameSweep = Math.floor(start / windowSeconds) === Math.floor((beat.tEnd + 0.1) / windowSeconds);
            if (beat.kind === "normal" && sameSweep) index = k;
        }
        const beat = index > 0 ? done[index] : null;
        const rr = beat ? beat.qrsOn - done[index - 1].qrsOn : NaN; // the RR interval before this beat
        const qt = beat ? beat.tEnd - beat.qrsOn : NaN;
        const values = [
            rhythmName(settings.heartRate),
            isFinite(rate) ? `${Math.round(rate)} bpm` : "–",
            beat && isFinite(beat.pOn) ? ms(beat.qrsOn - beat.pOn) : beat ? "no P waves" : "–",
            beat ? ms(beat.qrsOff - beat.qrsOn) : "–",
            ms(qt),
            ms(qt / Math.sqrt(rr)),
            ms(qt / Math.cbrt(rr)),
            `${MM_PER_SECOND} mm/s, ${MM_PER_MV} mm/mV`
        ];
        values.forEach((text, k) => (readouts[k].textContent = text));

        const show = Boolean(beat) && settings.showIntervals;
        Object.values(calipers).forEach(({ box, text }) => {
            box.isHidden = !show;
            text.isHidden = !show;
        });
        if (!show) return;
        const toX = (t) => t - Math.floor(beat.qrsOn / windowSeconds) * windowSeconds;
        const baseline = traces[traces.length - 1].baseline; // the single trace, or the 12-lead rhythm strip
        // Each caliper is a shaded span from one wave's start to another's end, with its label at (labelX, labelY)
        const place = ({ box, text }, from, to, bottom, top, labelX, labelY, caption) => {
            box.isHidden = !isFinite(from);
            text.isHidden = !isFinite(from);
            if (!isFinite(from)) return;
            box.x1 = toX(from);
            box.x2 = toX(to);
            box.y1 = baseline + bottom;
            box.y2 = baseline + top;
            text.x1 = toX(labelX);
            text.y1 = baseline + labelY;
            text.text = caption;
        };
        place(calipers.pr, beat.pOn, beat.qrsOn, -0.3, 0.5, beat.pOn, 0.5, `PR ${ms(beat.qrsOn - beat.pOn)}`);
        place(
            calipers.qrs,
            beat.qrsOn,
            beat.qrsOff,
            -0.3,
            1.75,
            beat.qrsOn,
            1.75,
            `QRS ${ms(beat.qrsOff - beat.qrsOn)}`
        );
        place(calipers.qt, beat.qrsOn, beat.tEnd, -0.55, -0.85, beat.qrsOn, -0.85, `QT ${ms(qt)}`);
    }

    // Add the samples that have arrived since the last update, about 30 times a second
    let lastTime = performance.now();
    let carry = 0;
    const timer = setInterval(() => {
        const time = performance.now();
        const due = Math.min(((time - lastTime) * SAMPLE_RATE) / 1000, SAMPLE_RATE / 4) + carry;
        lastTime = time;
        if (!running) return;
        const count = Math.floor(due);
        carry = due - count;
        if (count > 0) {
            addSamples(count);
            measure();
            setView(false);
        }
    }, 33);
    sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });

    // --- Controls ---
    const PRESET_RATES = { normal: 72, tachycardia: 125, bradycardia: 48, af: 100, pvc: 72 };
    const readControls = () => {
        settings.heartRate = Number(ui.rate.value);
        settings.showIntervals = ui.intervals.checked;
        ui.rateOut.textContent = `${settings.heartRate} bpm`;
        ui.lead.disabled = layout === "twelve";
    };
    const setRunning = (value) => {
        running = value;
        ui.run.textContent = running ? "Pause" : "Resume";
        if (running) setView(true);
    };
    ui.rhythm.addEventListener("change", () => {
        settings.rhythm = ui.rhythm.value === "af" || ui.rhythm.value === "pvc" ? ui.rhythm.value : "sinus";
        ui.rate.value = String(PRESET_RATES[ui.rhythm.value]);
        readControls();
    });
    ui.rate.addEventListener("input", () => {
        readControls();
        // The three sinus presets are the same rhythm at different rates, so follow the rate
        if (settings.rhythm === "sinus") {
            const rate = settings.heartRate;
            ui.rhythm.value = rate > 100 ? "tachycardia" : rate < 60 ? "bradycardia" : "normal";
        }
    });
    ui.intervals.addEventListener("change", () => {
        readControls();
        measure();
    });
    ui.lead.addEventListener("change", () => {
        traces[0].dataSeries.dataSeriesName = `Lead ${ui.lead.value}`;
        redrawSweep(); // show the whole strip in the new lead at once
    });
    ui.layout.addEventListener("change", () => {
        layout = ui.layout.value;
        readControls();
        buildTraces();
        redrawSweep();
        measure();
    });
    ui.run.addEventListener("click", () => setRunning(!running));
    // Zooming or panning pauses the sweep, so the live update doesn't undo it
    const pauseForZoom = () => running && setRunning(false);
    ui.chart.addEventListener("wheel", pauseForZoom);
    ui.chart.addEventListener("pointerdown", pauseForZoom);

    settings.rhythm = "sinus";
    readControls();
    buildTraces();
    // Start with one full sweep already drawn
    addSamples(xs.length - GAP);
    measure();
    sciChartSurface.rendered.subscribe(() => running && setView(false));
    // #region_A_end
}

ecgMonitor("scichart-root");
