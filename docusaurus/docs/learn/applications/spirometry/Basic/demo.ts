import * as SciChart from "scichart";

// Sample data: a simulated forced breath, for learning how spirometry graphs are traced and read. Not patient data.
// The model is a simple one used to teach flow limitation: at each moment the flow is the smaller of
// (a) the patient's effort, which builds up in a fraction of a second, and (b) the most the airways allow at that
// lung volume (the "maximal flow envelope"), which falls as the lungs empty. The envelope's shape sets the pattern:
// a straight fall for healthy lungs, a scooped (concave) fall for narrowed small airways, and a flat cap for a
// narrowing in the windpipe or larynx that limits flow whatever the effort.
const PATTERNS = {
    // fvc: volume the lungs can blow out (L); pef: envelope flow at full lungs (L/s); shape: 1 = straight fall,
    // larger = more scooped; pif: peak flow breathing in (L/s); capOut / capIn: flow limit from an upper-airway narrowing
    normal: { fvc: 4.85, pef: 10.5, shape: 1.25, pif: 7.0 },
    obstructive: { fvc: 4.4, pef: 5.6, shape: 2.4, pif: 6.0 },
    restrictive: { fvc: 2.95, pef: 9.2, shape: 1.1, pif: 5.5 },
    fixedUpperAirway: { fvc: 4.6, pef: 10.0, shape: 1.25, pif: 6.8, capOut: 3.2, capIn: 2.8 },
    variableExtrathoracic: { fvc: 4.8, pef: 10.4, shape: 1.25, pif: 6.8, capIn: 2.4 }
};
const EFFORTS = {
    maximal: { rise: 0.035, push: 1 }, // a sharp, hard start
    slowStart: { rise: 0.6, push: 0.65 }, // a hesitant, weak start
    stoppedEarly: { rise: 0.035, push: 1, stopAt: 0.8 } // the patient stops blowing after 0.8 s
};
// Predicted values and lower limits of normal (LLN) for the simulated adult. Illustrative numbers only: real ones
// come from reference equations such as GLI Global, using age, sex and height.
const PREDICTED = { fvc: 4.85, fvcLln: 3.85, fev1: 3.95, fev1Lln: 3.1, ratio: 0.81, ratioLln: 0.7, pef: 9.9 };

// Simulates one forced breath, sampled every 10 ms: a short pause at full lungs, the forced blow out, then a full breath in
function simulateBreath(pattern, effort) {
    const dt = 0.001; // integration step (s)
    const step = 0.01; // recorded sample interval (s)
    const hold = 0.4;
    const time = [];
    const volume = []; // volume breathed out so far (L)
    const flow = []; // L/s, positive breathing out
    for (let i = 0; i < hold / step; i++) {
        time.push(i * step);
        volume.push(0);
        flow.push(0);
    }
    const capOut = pattern.capOut ?? Infinity;
    const capIn = pattern.capIn ?? Infinity;
    // Breathing out
    let v = 0;
    let te = 0;
    let lastSample = 0;
    for (;;) {
        const push = 16 * effort.push * (1 - Math.exp(-te / effort.rise));
        const envelope = pattern.pef * Math.pow(Math.max(0, 1 - v / pattern.fvc), pattern.shape);
        let f = Math.min(push, envelope, capOut);
        if (effort.stopAt && te > effort.stopAt) f *= Math.exp(-(te - effort.stopAt) / 0.04);
        v += f * dt;
        te += dt;
        const n = Math.round(te / step);
        if (n !== lastSample) {
            lastSample = n;
            time.push(hold + n * step);
            volume.push(v);
            flow.push(f);
        }
        const oneSecondAgo = volume.length - 1 - Math.round(1 / step);
        // End of the blow: a plateau (under 25 mL in the last second), 15 s of blowing, or the patient stopped
        if (te >= 15 || (te > 1 && oneSecondAgo >= 0 && v - volume[oneSecondAgo] < 0.025)) break;
        if (effort.stopAt && te > effort.stopAt && f < 0.002) break;
    }
    const endOut = time.length - 1;
    // Breathing in, from empty back to full lungs
    const exhaled = v;
    const start = time[endOut];
    let ti = 0;
    lastSample = 0;
    while (v > 0) {
        const share = 1 - v / exhaled;
        const envelope = Math.max(0.15, pattern.pif * Math.pow(Math.sin(Math.PI * (0.02 + 0.98 * share)), 0.7));
        const f = Math.min(pattern.pif * (1 - Math.exp(-ti / 0.06)) + 0.3, envelope, capIn);
        v -= f * dt;
        ti += dt;
        const n = Math.round(ti / step);
        if (n !== lastSample) {
            lastSample = n;
            time.push(start + n * step);
            volume.push(Math.max(v, 0));
            flow.push(-f);
        }
    }
    // Full lungs again: flow back to zero, closing the loop
    time.push(time[time.length - 1] + step);
    volume.push(0);
    flow.push(0);
    return { time, volume, flow, endOut };
}

// Works out the spirometry numbers from the curve, as a spirometer does
function measure(breath) {
    const { time, volume, flow, endOut } = breath;
    let peak = 0;
    for (let i = 0; i <= endOut; i++) if (flow[i] > flow[peak]) peak = i;
    const pef = flow[peak];
    // Time zero by back-extrapolation: a line with slope PEF through the peak-flow point, back to zero volume
    const timeZero = time[peak] - volume[peak] / pef;
    const volumeAt = (t) => {
        for (let i = 1; i <= endOut; i++) {
            if (time[i] >= t) return volume[i - 1] + ((t - time[i - 1]) / (time[i] - time[i - 1])) * (volume[i] - volume[i - 1]);
        }
        return volume[endOut];
    };
    const fvc = volume[endOut];
    const fev1 = volumeAt(timeZero + 1);
    const bev = volumeAt(timeZero); // back-extrapolated volume: what leaked out before time zero
    const fet = time[endOut] - timeZero; // forced expiratory time
    const flowBeforeEnd = flow[Math.max(0, endOut - 30)]; // flow 0.3 s before the end
    let pif = 0;
    for (let i = endOut; i < flow.length; i++) pif = Math.max(pif, -flow[i]);
    return { pef, pif, timeZero, peakTime: time[peak], peakVolume: volume[peak], fvc, fev1, ratio: fev1 / fvc, bev, fet, flowBeforeEnd };
}

// The page's div holds a control bar, the two charts side by side and a row of results.
// In your app these can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#0E1A2E;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff; background:#22365B;" + font;
    const select = (id, label, options) =>
        `<label>${label} <select data-id="${id}" style="font:inherit">` +
        options.map(([value, text]) => `<option value="${value}">${text}</option>`).join("") +
        `</select></label>`;
    bar.innerHTML =
        select("pattern", "Pattern", [
            ["normal", "Normal"],
            ["obstructive", "Obstructive"],
            ["restrictive", "Restrictive"],
            ["fixedUpperAirway", "Upper-airway obstruction (fixed)"],
            ["variableExtrathoracic", "Upper-airway obstruction (variable, extrathoracic)"]
        ]) +
        select("effort", "Effort", [
            ["maximal", "Maximal"],
            ["slowStart", "Poor: slow start"],
            ["stoppedEarly", "Poor: stopped early"]
        ]) +
        `<button data-id="replay" type="button" style="font:inherit; padding:2px 12px; border-radius:12px; border:1px solid #50C7E0; ` +
        `background:transparent; color:#ffffff; cursor:pointer">Blow again</button>`;
    const note = document.createElement("div");
    note.setAttribute("aria-live", "polite");
    note.style.cssText = "padding:4px 12px; color:#C8D3E8; min-height:20px; background:#22365B; border-top:1px solid #2F4670;" + font + "font-size:13px;";
    const charts = document.createElement("div");
    charts.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const loopDiv = document.createElement("div");
    loopDiv.id = divElementId + "-loop";
    loopDiv.style.cssText = "flex:1 1 340px; min-height:260px;";
    const timeDiv = document.createElement("div");
    timeDiv.id = divElementId + "-time";
    timeDiv.style.cssText = "flex:1 1 340px; min-height:260px;";
    charts.append(loopDiv, timeDiv);
    const results = document.createElement("div");
    results.setAttribute("role", "status");
    results.style.cssText = "display:flex; flex-wrap:wrap; gap:4px 22px; padding:6px 12px; color:#ffffff; background:#14233C;" + font;
    root.append(bar, note, charts, results);
    const get = (selector) => root.querySelector(selector);
    return {
        loopDiv,
        timeDiv,
        note,
        results,
        patternSelect: get('select[data-id="pattern"]'),
        effortSelect: get('select[data-id="effort"]'),
        replayButton: get('button[data-id="replay"]')
    };
}

const NOTES = {
    normal: "Normal: a sharp peak early in the blow, then flow falls in a near-straight line to zero. Most of the air is out in the first second.",
    obstructive: "Obstructive: a lower peak and a scooped (concave) fall, because narrowed airways limit flow as the lungs empty. The blow takes much longer.",
    restrictive: "Restrictive pattern: the loop keeps its shape but is narrow, because less air fits in the lungs. FEV1/FVC is normal or high.",
    fixedUpperAirway: "Fixed upper-airway obstruction: both limbs are cut flat, because a rigid narrowing caps flow both ways, whatever the effort.",
    variableExtrathoracic: "Variable extrathoracic obstruction: only the breath in is flattened, because a floppy narrowing above the chest is sucked shut on inspiration.",
    slowStart: " Poor effort: a slow start blunts the peak, and the back-extrapolated volume is too large, so the blow is not acceptable.",
    stoppedEarly: " Poor effort: stopping early cuts the volume-time curve off before its plateau, so FVC reads low and can look like restriction."
};

async function spirometryChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Spirometry: a flow-volume loop and a volume-time curve, traced live as the patient blows, drawn with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        HorizontalLineAnnotation,
        VerticalLineAnnotation,
        TextAnnotation,
        EAxisAlignment,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        LegendModifier,
        ELegendPlacement
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const PATIENT = "#50C7E0";
    const PREDICTED_COLOR = "#FFFFFFAA";
    const MARKER = "#F6E05E";

    async function createChart(div, xTitle, yTitle, xRange, yRange) {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(div, { theme: new SciChartJsNavyTheme() });
        const xAxis = new NumericAxis(wasmContext, { axisTitle: xTitle, visibleRange: xRange, axisTitleStyle: { fontSize: 13 } });
        const yAxis = new NumericAxis(wasmContext, { axisTitle: yTitle, visibleRange: yRange, axisTitleStyle: { fontSize: 13 }, axisAlignment: EAxisAlignment.Left });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);
        // The loop's x-values go out and come back, so tell the data series they are not sorted
        const line = (name, stroke, thickness, dash = undefined) => {
            const dataSeries = new XyDataSeries(wasmContext, { dataSeriesName: name, isSorted: false, containsNaN: false });
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { dataSeries, stroke, strokeThickness: thickness, strokeDashArray: dash })
            );
            return dataSeries;
        };
        const predicted = line("Predicted (simulated)", PREDICTED_COLOR, 2, [6, 4]);
        const patient = line("Patient (simulated)", PATIENT, 3);
        // The moving marker: one point, moved on every frame
        const marker = new XyDataSeries(wasmContext, { dataSeriesName: "Now", isSorted: false });
        const markerSeries = new XyScatterRenderableSeries(wasmContext, {
            dataSeries: marker,
            pointMarker: new EllipsePointMarker(wasmContext, { width: 13, height: 13, fill: MARKER, stroke: "#FFFFFF", strokeThickness: 2 })
        });
        sciChartSurface.renderableSeries.add(markerSeries);
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true, showAxisLabels: false }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface, wasmContext, xAxis, yAxis, predicted, patient, marker, markerSeries, line };
    }

    // Left: the flow-volume loop. Expiratory flow is plotted upwards and volume breathed out to the right.
    const loop = await createChart(ui.loopDiv, "Volume breathed out (L)", "Flow (L/s)", new NumberRange(-0.2, 6.2), new NumberRange(-8, 12));
    const legend = new LegendModifier({ placement: ELegendPlacement.TopRight, showCheckboxes: false, backgroundColor: "#14233CCC" });
    loop.sciChartSurface.chartModifiers.add(legend);
    legend.includeSeries(loop.markerSeries, false);
    // Right: the volume-time curve, timed from the back-extrapolated time zero
    const volumeTime = await createChart(ui.timeDiv, "Time from time zero (s)", "Volume breathed out (L)", new NumberRange(-0.5, 6), new NumberRange(0, 6.2));
    const tangent = volumeTime.line("Back-extrapolation", "#EC0F6C", 2, [3, 3]);

    // The predicted (reference) breath, drawn faintly behind the patient's
    const reference = simulateBreath(PATTERNS.normal, EFFORTS.maximal);
    const referenceZero = measure(reference).timeZero;
    loop.predicted.appendRange(reference.volume, reference.flow);
    volumeTime.predicted.appendRange(
        reference.time.slice(0, reference.endOut + 1).map((t) => t - referenceZero),
        reference.volume.slice(0, reference.endOut + 1)
    );

    let breath = null;
    let result = null;
    let shown = 0; // samples drawn so far
    let startedAt = 0;
    let frame = 0;

    function showResults(done) {
        const r = result;
        const cell = (label, value, low = false) =>
            `<div><span style="opacity:0.75; font-size:12px">${label}</span><br><b style="font-size:20px; color:${low ? "#FF8A8A" : "#FFFFFF"}">${value}</b></div>`;
        if (!done) {
            ui.results.innerHTML = cell("FVC", "…") + cell("FEV1", "…") + cell("FEV1/FVC", "…") + cell("PEF", "…") + cell("Test quality", "blowing…");
            return;
        }
        const pct = (value, predicted) => `${Math.round((100 * value) / predicted)}%`;
        const checks = [];
        if (r.bev > Math.max(0.05 * r.fvc, 0.1)) checks.push(`slow start (BEV ${r.bev.toFixed(2)} L)`);
        if (r.flowBeforeEnd > 0.3) checks.push("blow stopped early");
        ui.results.innerHTML =
            cell("FVC", `${r.fvc.toFixed(2)} L (${pct(r.fvc, PREDICTED.fvc)} pred)`, r.fvc < PREDICTED.fvcLln) +
            cell("FEV1", `${r.fev1.toFixed(2)} L (${pct(r.fev1, PREDICTED.fev1)} pred)`, r.fev1 < PREDICTED.fev1Lln) +
            cell("FEV1/FVC", `${r.ratio.toFixed(2)} (LLN ${PREDICTED.ratioLln.toFixed(2)})`, r.ratio < PREDICTED.ratioLln) +
            cell("PEF", `${r.pef.toFixed(1)} L/s`) +
            cell("Blow time", `${r.fet.toFixed(1)} s`) +
            cell("Test quality", checks.length ? `Not acceptable: ${checks.join(", ")}` : "Acceptable start and end", checks.length > 0);
    }

    function showAnnotations(done) {
        for (const chart of [loop, volumeTime]) chart.sciChartSurface.annotations.clear();
        const label = (x, y, text, color, left) =>
            new TextAnnotation({
                x1: x,
                y1: y,
                text,
                fontSize: 13,
                textColor: color,
                horizontalAnchorPoint: left ? EHorizontalAnchorPoint.Left : EHorizontalAnchorPoint.Right,
                verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                xCoordShift: left ? 6 : -6,
                yCoordShift: -4
            });
        volumeTime.sciChartSurface.annotations.add(
            new VerticalLineAnnotation({ x1: 1, stroke: "#FFFFFF88", strokeDashArray: [4, 4] }),
            label(1, 5.7, "1 s", "#FFFFFFCC", true)
        );
        if (!done) return;
        const r = result;
        const right = volumeTime.xAxis.visibleRange.max;
        volumeTime.sciChartSurface.annotations.add(
            new HorizontalLineAnnotation({ y1: r.fvc, stroke: MARKER, strokeDashArray: [4, 4] }),
            label(right, r.fvc, `FVC ${r.fvc.toFixed(2)} L`, MARKER, false),
            new HorizontalLineAnnotation({ y1: r.fev1, stroke: PATIENT, strokeDashArray: [4, 4] }),
            label(volumeTime.xAxis.visibleRange.min, r.fev1, `FEV1 ${r.fev1.toFixed(2)} L`, PATIENT, true)
        );
        loop.sciChartSurface.annotations.add(label(r.peakVolume, r.pef, `PEF ${r.pef.toFixed(1)} L/s`, "#FFFFFF", true));
    }

    function start() {
        const pattern = PATTERNS[ui.patternSelect.value];
        const effort = EFFORTS[ui.effortSelect.value];
        breath = simulateBreath(pattern, effort);
        result = measure(breath);
        for (const chart of [loop, volumeTime]) {
            chart.patient.clear();
            chart.marker.clear();
        }
        tangent.clear();
        // The back-extrapolation line: slope PEF, through the peak-flow point, down to zero volume at time zero
        const peakT = result.peakTime - result.timeZero;
        tangent.appendRange([0, peakT + 0.25], [0, result.peakVolume + 0.25 * result.pef]);
        volumeTime.xAxis.visibleRange = new NumberRange(-0.5, Math.max(6, result.fet + 0.5));
        loop.xAxis.visibleRange = new NumberRange(-0.2, 6.2);
        loop.yAxis.visibleRange = new NumberRange(-8, 12);
        volumeTime.yAxis.visibleRange = new NumberRange(0, 6.2);
        shown = 0;
        startedAt = performance.now();
        ui.note.textContent = NOTES[ui.patternSelect.value] + (NOTES[ui.effortSelect.value] ?? "");
        showResults(false);
        showAnnotations(false);
    }

    // Draws the samples up to "now", in real time, as the patient blows and then breathes in
    function animate() {
        if (breath) {
            const elapsed = (performance.now() - startedAt) / 1000;
            let due = shown;
            while (due < breath.time.length && breath.time[due] <= elapsed) due++;
            if (due > shown) {
                const volume = breath.volume.slice(shown, due);
                loop.patient.appendRange(volume, breath.flow.slice(shown, due));
                // The volume-time curve shows the blow out only
                const endOut = Math.min(due, breath.endOut + 1);
                if (endOut > shown) {
                    volumeTime.patient.appendRange(
                        breath.time.slice(shown, endOut).map((t) => t - result.timeZero),
                        breath.volume.slice(shown, endOut)
                    );
                }
                const last = due - 1;
                loop.marker.clear();
                loop.marker.append(breath.volume[last], breath.flow[last]);
                const lastOut = Math.min(last, breath.endOut);
                volumeTime.marker.clear();
                volumeTime.marker.append(breath.time[lastOut] - result.timeZero, breath.volume[lastOut]);
                if (shown <= breath.endOut && due > breath.endOut) {
                    showResults(true);
                    showAnnotations(true);
                }
                shown = due;
            }
        }
        frame = requestAnimationFrame(animate);
    }

    ui.patternSelect.addEventListener("change", start);
    ui.effortSelect.addEventListener("change", start);
    ui.replayButton.addEventListener("click", start);
    start();
    frame = requestAnimationFrame(animate);
    // Stop the animation when the chart is deleted
    loop.sciChartSurface.addDeletable({ delete: () => cancelAnimationFrame(frame) });
    // #region_A_end
}

spirometryChart("scichart-root");
