import * as SciChart from "scichart";

const SAMPLE_RATE = 100; // samples per second for both waveforms, as on many bedside monitors

// Sample data: a simulated patient. These are illustrative waveforms for learning how the traces are drawn
// and read, not medical data. A seeded random generator makes the demo behave the same every time.
// Each breath is built from the phases of a capnogram; each heartbeat adds a pulse to two light signals
// (red and infrared), as a pulse oximeter's sensor sees them.
const BREATHING = {
    // rate (breaths/min), et (end-tidal CO2, mmHg), base (inspired CO2, mmHg), tau (s, how fast CO2 rises at the
    // start of expiration), plateauRise (mmHg, slope of the plateau), downTau (s, how fast it falls on inspiration),
    // heartRate (beats/min) and sat (the patient's true oxygen saturation, %)
    normal: { rate: 14, et: 38, base: 0, tau: 0.05, plateauRise: 3, downTau: 0.05, heartRate: 72, sat: 97 },
    bronchospasm: { rate: 20, et: 43, base: 0, tau: 0.55, plateauRise: 0, downTau: 0.06, heartRate: 96, sat: 93 },
    rebreathing: { rate: 14, et: 47, base: 7, tau: 0.06, plateauRise: 3, downTau: 0.25, heartRate: 80, sat: 97 },
    hypoventilation: { rate: 7, et: 58, base: 0, tau: 0.06, plateauRise: 4, downTau: 0.05, heartRate: 64, sat: 96 },
    apnoea: { rate: 0, et: 0, base: 0, tau: 0.05, plateauRise: 0, downTau: 0.05, heartRate: 72, sat: 97 }
};
const PERFUSION_INDEX = { normal: 3, lowPerfusion: 0.35, motion: 3 }; // % of the infrared light that pulses

function createPatientSimulator(sampleRate) {
    let seed = 20261120;
    const random = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const bump = (t, centre, width) => Math.exp(-Math.pow((t - centre) / width, 2));

    const settings = { breathing: "normal", pleth: "normal" };
    let n = 0;
    // Breathing: the current breath, and the CO2 level at the end of its expiration
    let breath = null;
    let nextBreath = 0.4;
    let endExpiredCo2 = 0;
    let co2Base = 0;
    let lastCo2 = 0; // the previous sample, before noise
    // Heart: the current and previous beat, so a beat's tail carries on under the next one
    let beat = { start: -10, size: 1 };
    let previousBeat = { start: -20, size: 1 };
    let nextBeat = 0.2;
    let sat = 97;
    // Movement of the finger: bursts of shaking every few seconds
    let motion = { start: 3, end: 5, f1: 1.6, f2: 2.7, p1: 0, p2: 1 };

    // One pulse of blood volume, tb seconds after the beat started. A normal pulse has a fast upstroke, a peak,
    // a dicrotic notch and a second (reflected) wave; a poorly perfused one is small and rounded.
    function pulseShape(tb, lowPerfusion) {
        if (tb < 0) return 0;
        if (lowPerfusion) {
            return (tb < 0.2 ? bump(tb, 0.2, 0.1) : bump(tb, 0.2, 0.22)) + 0.1 * bump(tb, 0.48, 0.14);
        }
        return (tb < 0.15 ? bump(tb, 0.15, 0.06) : bump(tb, 0.15, 0.11)) + 0.38 * bump(tb, 0.4, 0.075) + 0.12 * bump(tb, 0.6, 0.2);
    }

    // Returns one sample: CO2 at the airway (mmHg), and the infrared and red light reaching the detector
    // (1 = the steady level with no pulse)
    return {
        settings,
        nextSample() {
            const t = n++ / sampleRate;
            const pattern = BREATHING[settings.breathing];

            // --- Capnogram ---
            if (t >= nextBreath) {
                if (settings.breathing === "apnoea") {
                    breath = null;
                    nextBreath = t + 0.5; // check again shortly
                } else {
                    const period = (60 / pattern.rate) * (1 + 0.08 * (random() - 0.5));
                    const ti = Math.min(1.3, 0.35 * period); // inspiration takes about a third of the breath
                    breath = { ...pattern, start: t, te: period - ti, et: pattern.et + gaussian() * 0.6 };
                    nextBreath = t + period;
                }
            }
            if (settings.breathing === "apnoea" && breath && t - breath.start > breath.te + 0.5) {
                breath = null; // the breath in progress ends, and no new one starts
                nextBreath = t + 0.5;
            }
            if (breath) co2Base = breath.base;
            let co2 = co2Base;
            if (breath) {
                const tb = t - breath.start;
                const deadSpace = 0.15; // phase I: gas from the airways, with no CO2, comes out first
                if (tb < breath.te) {
                    if (tb > deadSpace) {
                        // Phase II (the rise) and phase III (the plateau), reaching end-tidal CO2 at the end of expiration
                        const rise = (1 - Math.exp(-(tb - deadSpace) / breath.tau)) / (1 - Math.exp(-(breath.te - deadSpace) / breath.tau));
                        const level = breath.et - breath.plateauRise * (1 - tb / breath.te);
                        co2 = breath.base + rise * (level - breath.base);
                    }
                    endExpiredCo2 = co2;
                } else {
                    // Inspiration: fresh gas washes the CO2 out of the sensor
                    co2 = breath.base + (endExpiredCo2 - breath.base) * Math.exp(-(tb - breath.te) / breath.downTau);
                }
            } else {
                co2 = lastCo2 * Math.exp(-1 / (sampleRate * 0.1)); // no breath: whatever CO2 is left fades away
            }
            lastCo2 = co2;
            co2 = Math.max(0, co2 + gaussian() * 0.25);

            // --- Pulse oximeter ---
            sat += (pattern.sat - sat) / (sampleRate * 10); // saturation follows its target slowly
            if (t >= nextBeat) {
                previousBeat = beat;
                beat = { start: nextBeat, size: 1 + 0.06 * Math.sin((2 * Math.PI * t * Math.max(pattern.rate, 12)) / 60) };
                nextBeat += (60 / pattern.heartRate) * (1 + 0.05 * (random() - 0.5));
            }
            const lowPerfusion = settings.pleth === "lowPerfusion";
            const pulse = beat.size * pulseShape(t - beat.start, lowPerfusion) + previousBeat.size * pulseShape(t - previousBeat.start, lowPerfusion);
            const acIr = (PERFUSION_INDEX[settings.pleth] / 100) * pulse;
            // Red light pulses less than infrared when the blood is well oxygenated. The ratio of the two
            // (R) is set from the true saturation using SpO2 = 110 - 25 R, a common textbook approximation.
            const ratio = (110 - sat) / 25;
            let movement = 0;
            if (settings.pleth === "motion") {
                if (t > motion.end) {
                    const start = t + 2 + 4 * random();
                    motion = { start, end: start + 1.5 + 2 * random(), f1: 1.2 + 1.5 * random(), f2: 2.2 + 2 * random(), p1: 6 * random(), p2: 6 * random() };
                }
                if (t > motion.start && t < motion.end) {
                    const envelope = Math.pow(Math.sin((Math.PI * (t - motion.start)) / (motion.end - motion.start)), 2);
                    movement = 0.05 * envelope * (Math.sin(2 * Math.PI * motion.f1 * t + motion.p1) + 0.6 * Math.sin(2 * Math.PI * motion.f2 * t + motion.p2));
                }
            }
            const ir = (1 - acIr) * (1 + movement) + gaussian() * 0.0002;
            const red = (1 - ratio * acIr) * (1 + movement) + gaussian() * 0.0002;
            return { time: t, co2, ir, red };
        }
    };
}

// The page's div holds a control bar, the two traces and a panel of numbers, like a bedside monitor.
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
        select("breathing", "Breathing", [
            ["normal", "Normal"],
            ["bronchospasm", "Bronchospasm (shark fin)"],
            ["rebreathing", "Rebreathing"],
            ["hypoventilation", "Hypoventilation"],
            ["apnoea", "Apnoea"]
        ]) +
        select("pleth", "Pleth", [
            ["normal", "Normal"],
            ["lowPerfusion", "Low perfusion"],
            ["motion", "Motion artefact"]
        ]) +
        select("co2Sweep", "CO₂ sweep", [
            ["6.25", "6.25 mm/s"],
            ["12.5", "12.5 mm/s"],
            ["25", "25 mm/s"]
        ]) +
        select("plethSweep", "Pleth sweep", [
            ["12.5", "12.5 mm/s"],
            ["25", "25 mm/s"],
            ["50", "50 mm/s"]
        ]) +
        `<button data-id="pause" type="button" style="font:inherit; padding:2px 12px; border-radius:12px; border:1px solid #50C7E0; ` +
        `background:transparent; color:#ffffff; cursor:pointer">Pause</button>`;
    const note = document.createElement("div");
    note.setAttribute("aria-live", "polite");
    note.style.cssText = "padding:4px 12px; color:#C8D3E8; min-height:20px; background:#22365B; border-top:1px solid #2F4670;" + font + "font-size:13px;";
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const traces = document.createElement("div");
    traces.style.cssText = "flex:1 1 460px; min-height:320px; display:flex; flex-direction:column;";
    const capnoDiv = document.createElement("div");
    capnoDiv.id = divElementId + "-capno";
    capnoDiv.style.cssText = "flex:1; min-height:150px;";
    const plethDiv = document.createElement("div");
    plethDiv.id = divElementId + "-pleth";
    plethDiv.style.cssText = "flex:1; min-height:150px;";
    traces.append(capnoDiv, plethDiv);
    const panel = document.createElement("div");
    panel.style.cssText = "flex:0 1 190px; display:flex; flex-direction:column; justify-content:space-around; padding:8px 14px; color:#ffffff;" + font;
    const reading = (id, label, unit, color) =>
        `<div style="color:${color}"><div style="font-size:12px; opacity:0.85">${label} <span style="opacity:0.7">${unit}</span></div>` +
        `<div data-id="${id}" style="font-size:34px; font-weight:600; line-height:1.1">--</div></div>`;
    panel.innerHTML =
        reading("etco2", "EtCO₂", "mmHg", "#F6E05E") +
        `<div style="display:flex; gap:18px">` +
        reading("rr", "RR", "/min", "#F6E05E").replace("font-size:34px", "font-size:24px") +
        reading("fico2", "Insp CO₂", "mmHg", "#F6E05E").replace("font-size:34px", "font-size:24px") +
        `</div>` +
        reading("spo2", "SpO₂", "%", "#50C7E0") +
        `<div style="display:flex; gap:18px">` +
        reading("pr", "PR", "/min", "#50C7E0").replace("font-size:34px", "font-size:24px") +
        reading("pi", "PI", "%", "#50C7E0").replace("font-size:34px", "font-size:24px") +
        `</div>` +
        `<div data-id="alarm" role="status" style="min-height:22px; font-weight:700; color:#FF6B6B"></div>`;
    body.append(traces, panel);
    root.append(bar, note, body);
    const get = (selector) => root.querySelector(selector);
    get('select[data-id="plethSweep"]').value = "25"; // start the pleth at 25 mm/s, the CO2 at 6.25 mm/s
    return {
        capnoDiv,
        plethDiv,
        note,
        breathingSelect: get('select[data-id="breathing"]'),
        plethSelect: get('select[data-id="pleth"]'),
        co2SweepSelect: get('select[data-id="co2Sweep"]'),
        plethSweepSelect: get('select[data-id="plethSweep"]'),
        pauseButton: get('button[data-id="pause"]'),
        readings: Object.fromEntries(["etco2", "rr", "fico2", "spo2", "pr", "pi", "alarm"].map((id) => [id, get(`div[data-id="${id}"]`)]))
    };
}

const NOTES = {
    normal: "Normal capnogram: flat baseline at zero, a steep rise, a near-flat plateau, then a steep fall.",
    bronchospasm: "Shark fin: narrowed airways empty unevenly, so CO₂ rises slowly and the plateau slopes upwards.",
    rebreathing: "Rebreathing: the baseline no longer returns to zero, so inspired CO₂ is above 0.",
    hypoventilation: "Hypoventilation: slow breaths with high end-tidal CO₂. SpO₂ can stay normal on supplemental oxygen.",
    apnoea: "Apnoea: the capnogram goes flat at once. SpO₂ falls only later, as the body's oxygen stores run down.",
    lowPerfusion: "Low perfusion: a small, rounded pulse with no dicrotic notch. The monitor scales it up, so check the PI.",
    motion: "Motion artefact: shaking swamps the pulse, so the pulse rate and SpO₂ readings become unreliable."
};

async function patientMonitorChart(divElementId) {
    const ui = createLayout(divElementId);
    const patient = createPatientSimulator(SAMPLE_RATE);

    // #region_A_start
    // A two-trace patient monitor in sweep mode: a capnogram and a pleth trace, with the numbers a monitor
    // works out from them, drawn with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        NumberRange,
        EAutoRange,
        EXyDirection,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const TRACE_WIDTH_MM = 150; // a sweep speed in mm/s becomes a time window, for a trace this wide

    // --- Monitor algorithms (plain JavaScript): numbers from the waveforms ---

    // Capnometer: finds each exhalation in the CO2 waveform, then reports end-tidal CO2 (the peak at the end
    // of the breath), inspired CO2 (the lowest level between breaths) and the respiratory rate
    function createCapnometer(apnoeaDelaySeconds) {
        let exhaling = false;
        let peak = 0;
        let lowest = Infinity;
        const starts = [];
        const state = { etco2: NaN, inspired: NaN, rate: NaN, apnoea: false, add: null };
        state.add = (time, co2) => {
            if (!exhaling && co2 > 14) {
                // Start of an exhalation: the CO2 rises through 14 mmHg
                exhaling = true;
                peak = co2;
                if (Number.isFinite(lowest)) state.inspired = Math.max(0, lowest);
                lowest = Infinity;
                starts.push(time);
                if (starts.length > 5) starts.shift();
                if (starts.length > 1) state.rate = (60 * (starts.length - 1)) / (starts[starts.length - 1] - starts[0]);
            } else if (exhaling) {
                peak = Math.max(peak, co2);
                if (co2 < 10) {
                    exhaling = false;
                    state.etco2 = peak;
                }
            } else {
                lowest = Math.min(lowest, co2);
            }
            state.apnoea = starts.length > 0 && time - starts[starts.length - 1] > apnoeaDelaySeconds;
        };
        return state;
    }

    // Pulse oximeter: turns the raw red and infrared light into the pleth trace, and works out SpO2 from the
    // ratio of ratios, the perfusion index and the pulse rate
    function createOximeter(sampleRate) {
        const windowSize = Math.round(3 * sampleRate); // 3 s of samples for each reading
        const smoothing = 0.35; // light smoothing of the raw light signals
        const dcSmoothing = 1 / (2 * sampleRate); // the steady (DC) level, averaged over about 2 s
        let ir = NaN;
        let red = NaN;
        let dcIr = NaN;
        let dcRed = NaN;
        const irPulse = []; // pulsing part as % of the steady level, newest last
        const redPulse = [];
        let count = 0;
        let lastBeat = -1;
        let wasAbove = false;
        const beatIntervals = [];
        const state = { spo2: NaN, perfusionIndex: NaN, pulseRate: NaN, add: null };
        const range = (values) => Math.max(...values) - Math.min(...values);
        // Returns the pleth value to draw: the infrared pulse, upside down from the raw light so that more
        // blood in the finger plots upwards
        state.add = (time, rawIr, rawRed) => {
            ir = Number.isNaN(ir) ? rawIr : ir + smoothing * (rawIr - ir);
            red = Number.isNaN(red) ? rawRed : red + smoothing * (rawRed - red);
            dcIr = Number.isNaN(dcIr) ? ir : dcIr + dcSmoothing * (ir - dcIr);
            dcRed = Number.isNaN(dcRed) ? red : dcRed + dcSmoothing * (red - dcRed);
            const pleth = (100 * (dcIr - ir)) / dcIr;
            irPulse.push(pleth);
            redPulse.push((100 * (dcRed - red)) / dcRed);
            if (irPulse.length > windowSize) {
                irPulse.shift();
                redPulse.shift();
            }
            // Pulse detection: an upward crossing of the middle of the last 3 s, at least 0.3 s after the last beat
            const middle = Math.min(...irPulse) + 0.5 * range(irPulse);
            const above = pleth > middle;
            if (above && !wasAbove && time - lastBeat > 0.3) {
                if (lastBeat >= 0) beatIntervals.push(time - lastBeat);
                if (beatIntervals.length > 5) beatIntervals.shift();
                lastBeat = time;
                const sorted = beatIntervals.slice().sort((a, b) => a - b);
                if (sorted.length) state.pulseRate = 60 / sorted[Math.floor(sorted.length / 2)];
            }
            wasAbove = above;
            // Every half second: perfusion index and SpO2 from the pulse heights of the last 3 s
            if (++count % Math.round(sampleRate / 2) === 0 && irPulse.length === windowSize) {
                const acIr = range(irPulse);
                const acRed = range(redPulse);
                state.perfusionIndex = acIr; // already a % of the steady level
                const ratio = acRed / acIr; // the "ratio of ratios" R
                const reading = Math.min(100, Math.max(0, 110 - 25 * ratio));
                state.spo2 = Number.isNaN(state.spo2) ? reading : state.spo2 + 0.15 * (reading - state.spo2); // averaged over a few seconds
            }
            return pleth;
        };
        return state;
    }

    // --- The charts: one sweeping trace each, with its own sweep speed ---
    async function createTrace(div, options) {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(div, { theme: new SciChartJsNavyTheme() });
        const xAxis = new NumericAxis(wasmContext, {
            axisTitle: "Time in sweep (s)",
            autoRange: EAutoRange.Never,
            labelPrecision: 0,
            axisTitleStyle: { fontSize: 12 }
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: options.title,
                axisTitleStyle: { color: options.color, fontSize: 13 },
                // A fixed CO2 scale keeps the numbers comparable; the pleth is auto-scaled, as monitors do
                autoRange: options.range ? EAutoRange.Never : EAutoRange.Always,
                visibleRange: options.range,
                growBy: new NumberRange(0.1, 0.1),
                labelPrecision: options.precision,
                maxAutoTicks: options.range ? 8 : 4
            })
        );
        const line = new FastLineRenderableSeries(wasmContext, {
            stroke: options.color,
            strokeThickness: 2,
            pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: options.color, strokeThickness: 0, lastPointOnly: true })
        });
        sciChartSurface.renderableSeries.add(line);
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true, showYLine: false, showAxisLabels: false }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        const trace = { sciChartSurface, xAxis, line, capacity: 0, written: 0, seconds: 0, dataSeries: null, setSweepSpeed: null, append: null };
        // Sweep mode: fifoSweeping makes the buffer wrap around, so new points overwrite the oldest from left
        // to right, with a small gap ahead of the write point
        trace.setSweepSpeed = (mmPerSecond, history) => {
            trace.seconds = TRACE_WIDTH_MM / mmPerSecond;
            trace.capacity = Math.round(trace.seconds * SAMPLE_RATE);
            const old = trace.dataSeries;
            trace.dataSeries = new XyDataSeries(wasmContext, {
                dataSeriesName: options.name,
                fifoCapacity: trace.capacity,
                fifoSweeping: true,
                fifoSweepingGap: Math.round(SAMPLE_RATE * trace.seconds * 0.02),
                isSorted: false,
                containsNaN: false
            });
            line.dataSeries = trace.dataSeries;
            if (old) old.delete();
            trace.written = 0;
            xAxis.visibleRange = new NumberRange(0, trace.seconds);
            trace.append(history.slice(-trace.capacity)); // redraw the latest screenful from the monitor's memory
        };
        trace.append = (values) => {
            const xValues = values.map((_, i) => ((trace.written + i) % trace.capacity) / SAMPLE_RATE);
            trace.written += values.length;
            trace.dataSeries.appendRange(xValues, values);
        };
        return trace;
    }

    const capno = await createTrace(ui.capnoDiv, { name: "CO₂ (mmHg)", title: "CO₂ (mmHg)", color: "#F6E05E", range: new NumberRange(0, 70), precision: 0 });
    const pleth = await createTrace(ui.plethDiv, { name: "Pleth (% of light)", title: "Pleth", color: "#50C7E0", precision: 1 });

    // --- Live data: run the simulated patient through the monitor algorithms ---
    const capnometer = createCapnometer(10); // apnoea alarm after 10 s with no breath (a short demo setting)
    const oximeter = createOximeter(SAMPLE_RATE);
    const history = { co2: [], pleth: [] }; // the last 24 s, so a sweep speed change can redraw the screen
    function runPatient(count) {
        const co2Values = [];
        const plethValues = [];
        for (let i = 0; i < count; i++) {
            const sample = patient.nextSample();
            capnometer.add(sample.time, sample.co2);
            co2Values.push(sample.co2);
            plethValues.push(oximeter.add(sample.time, sample.ir, sample.red));
        }
        history.co2.push(...co2Values);
        history.pleth.push(...plethValues);
        for (const values of [history.co2, history.pleth]) {
            if (values.length > 24 * SAMPLE_RATE) values.splice(0, values.length - 24 * SAMPLE_RATE);
        }
        return { co2Values, plethValues };
    }
    runPatient(30 * SAMPLE_RATE); // 30 s of warm-up, so the screen starts full and the numbers are settled

    function showNumbers() {
        const r = ui.readings;
        const show = (value, digits = 0) => (Number.isFinite(value) ? value.toFixed(digits) : "--");
        r.etco2.textContent = capnometer.apnoea ? "--" : show(capnometer.etco2);
        r.rr.textContent = capnometer.apnoea ? "0" : show(capnometer.rate);
        r.fico2.textContent = show(capnometer.inspired);
        r.spo2.textContent = show(oximeter.spo2);
        r.pr.textContent = show(oximeter.pulseRate);
        r.pi.textContent = show(oximeter.perfusionIndex, oximeter.perfusionIndex < 1 ? 2 : 1);
        r.alarm.textContent = capnometer.apnoea ? "APNOEA" : "";
    }

    function onSettingsChanged() {
        patient.settings.breathing = ui.breathingSelect.value;
        patient.settings.pleth = ui.plethSelect.value;
        const notes = [NOTES[ui.breathingSelect.value]];
        if (ui.plethSelect.value !== "normal") notes.push(NOTES[ui.plethSelect.value]);
        ui.note.textContent = notes.join(" ");
    }
    ui.breathingSelect.addEventListener("change", onSettingsChanged);
    ui.plethSelect.addEventListener("change", onSettingsChanged);
    ui.co2SweepSelect.addEventListener("change", () => capno.setSweepSpeed(Number(ui.co2SweepSelect.value), history.co2));
    ui.plethSweepSelect.addEventListener("change", () => pleth.setSweepSpeed(Number(ui.plethSweepSelect.value), history.pleth));
    capno.setSweepSpeed(Number(ui.co2SweepSelect.value), history.co2);
    pleth.setSweepSpeed(Number(ui.plethSweepSelect.value), history.pleth);
    onSettingsChanged();
    showNumbers();

    // Pause: stop the sweep to zoom (mouse wheel), pan (drag) and read values (hover); double-click to reset
    let paused = false;
    function setPaused(value) {
        paused = value;
        ui.pauseButton.textContent = paused ? "Resume" : "Pause";
        ui.pauseButton.style.background = paused ? "#50C7E0" : "transparent";
        ui.pauseButton.style.color = paused ? "#14233C" : "#ffffff";
        if (!paused) for (const trace of [capno, pleth]) trace.xAxis.visibleRange = new NumberRange(0, trace.seconds);
    }
    ui.pauseButton.addEventListener("click", () => setPaused(!paused));
    for (const trace of [capno, pleth]) {
        const root = trace.sciChartSurface.domChartRoot;
        root.addEventListener("wheel", () => setPaused(true));
        root.addEventListener("pointerdown", () => setPaused(true));
    }

    // Add the samples that have arrived since the last update, about 60 times a second
    let lastTime = performance.now();
    let carry = 0;
    let frames = 0;
    const timer = setInterval(() => {
        const now = performance.now();
        const due = Math.min(((now - lastTime) * SAMPLE_RATE) / 1000, SAMPLE_RATE / 4) + carry;
        lastTime = now;
        if (paused) return;
        const count = Math.floor(due);
        carry = due - count;
        if (count === 0) return;
        const { co2Values, plethValues } = runPatient(count);
        capno.append(co2Values);
        pleth.append(plethValues);
        if (++frames % 15 === 0) showNumbers(); // update the numbers about four times a second
    }, 16);
    capno.sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });
    // #region_A_end
}

patientMonitorChart("scichart-root");
