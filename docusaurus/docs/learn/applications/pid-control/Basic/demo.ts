import * as SciChart from "scichart";

// The controls, the readout and the two charts each need an element. This splits the page's div into a control bar,
// the setpoint and process variable chart, the controller output chart and a readout panel; in your app, they can
// be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const slider = (id, label, min, max, step, value, width = 90) =>
        `<label>${label} <input data-id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" ` +
        `style="vertical-align:middle; width:${width}px"> <output data-id="${id}"></output></label>`;
    const row = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-direction:column; gap:6px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<div style="${row}"><strong style="min-width:76px">Controller</strong>` +
        slider("kp", "K<sub>p</sub>", 0, 20, 0.05, 2) +
        slider("ki", "K<sub>i</sub>", 0, 5, 0.01, 0.3) +
        slider("kd", "K<sub>d</sub>", 0, 20, 0.05, 1) +
        `<label>D acts on <select data-id="dmode" style="font:inherit">` +
        `<option value="measurement">measurement</option><option value="error">error</option></select></label>` +
        `<label><input data-id="antiwindup" type="checkbox" checked> Anti-windup</label>` +
        `<button data-id="zn" type="button" style="font:inherit">Ziegler–Nichols</button></div>` +
        `<div style="${row}"><strong style="min-width:76px">Process</strong>` +
        slider("gain", "Gain K", 0.2, 4, 0.1, 1) +
        slider("tau", "Time constant τ", 1, 30, 0.5, 8) +
        slider("theta", "Dead time θ", 0.2, 8, 0.1, 2) +
        slider("umax", "Output limit", 40, 100, 1, 100) +
        `</div>` +
        `<div style="${row}"><strong style="min-width:76px">Events</strong>` +
        `<button data-id="step" type="button" style="font:inherit">Step setpoint</button>` +
        `<button data-id="disturb" type="button" style="font:inherit">Add load disturbance</button>` +
        `<button data-id="pause" type="button" style="font:inherit">Pause</button></div>`;
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const charts = document.createElement("div");
    charts.style.cssText = "flex:1 1 520px; min-height:0; display:flex; flex-direction:column;";
    const pvDiv = document.createElement("div");
    pvDiv.id = divElementId + "-pv"; // each chart's div needs its own id
    pvDiv.style.cssText = "flex:1; min-height:220px;";
    const coDiv = document.createElement("div");
    coDiv.id = divElementId + "-co";
    coDiv.style.cssText = "flex:1; min-height:200px;";
    charts.append(pvDiv, coDiv);
    const panel = document.createElement("div");
    panel.setAttribute("aria-live", "polite");
    panel.style.cssText = "flex:0 1 230px; padding:8px 12px; color:#ffffff; font-size:13px; line-height:1.5; white-space:pre-line;" + font;
    body.append(charts, panel);
    root.append(bar, body);
    const query = (selector) => bar.querySelector(selector);
    const input = (id) => query(`[data-id="${id}"]`);
    const output = (id) => query(`output[data-id="${id}"]`);
    return { pvDiv, coDiv, panel, input, output };
}

async function pidControlChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A real-time PID control loop simulator: setpoint, process variable and controller output, charted with SciChart.js
    const {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        FastLineRenderableSeries,
        XyDataSeries,
        HorizontalLineAnnotation,
        ELabelPlacement,
        LegendModifier,
        ELegendPlacement,
        ELegendOrientation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const DT = 0.01; // simulation step (s): the controller's sample time
    const RECORD_EVERY = 10; // plot one point every 10 steps (0.1 s)
    const WINDOW = 60; // seconds of process time on screen
    const SPEED = 4; // process time runs 4 times faster than real time
    const SETPOINTS = [40, 60]; // the setpoint step toggles between these (% of range)
    const DISTURBANCE = -15; // load disturbance added to the process input (%)
    const D_FILTER = 0.2; // time constant of the derivative filter (s)

    // --- The process: first order plus dead time (FOPDT), like a heater or a motor ---
    // τ·dy/dt = K·u(t − θ) − y, solved with Euler steps; a ring buffer holds the dead time
    function createProcess(initialOutput) {
        let buffer = new Float64Array(1);
        let head = 0;
        const process = {
            gain: 1,
            tau: 8,
            theta: 2,
            load: 0,
            y: 0,
            // Start in steady state with the input held at u
            reset(u) {
                buffer = new Float64Array(Math.max(1, Math.round(process.theta / DT))).fill(u);
                head = 0;
                process.y = process.gain * u;
            },
            // After a dead-time change, refill the buffer with the latest input (keeps it simple)
            resizeDelay() {
                const last = buffer[(head + buffer.length - 1) % buffer.length];
                const size = Math.max(1, Math.round(process.theta / DT));
                if (size === buffer.length) return;
                buffer = new Float64Array(size).fill(last);
                head = 0;
            },
            step(u) {
                const delayed = buffer[head]; // the input from θ seconds ago
                buffer[head] = u + process.load;
                head = (head + 1) % buffer.length;
                process.y += (DT / process.tau) * (process.gain * delayed - process.y);
                return process.y;
            }
        };
        process.reset(initialOutput);
        return process;
    }

    // --- The PID controller: parallel form u = Kp·e + Ki·∫e dt + Kd·de/dt, one sample every DT ---
    function createPid() {
        let previous = null;
        let derivative = 0;
        const pid = {
            kp: 2,
            ki: 0.3,
            kd: 1,
            uMin: 0,
            uMax: 100,
            antiWindup: true,
            dOnMeasurement: true,
            integral: 0, // the I term itself, so changing Ki doesn't bump the output
            update(setpoint, measurement) {
                const error = setpoint - measurement;
                // Derivative of the error, or of minus the measurement, which ignores setpoint steps (no derivative kick)
                const signal = pid.dOnMeasurement ? -measurement : error;
                const raw = previous === null ? 0 : (signal - previous) / DT;
                previous = signal;
                derivative += (DT / (D_FILTER + DT)) * (raw - derivative); // first-order low-pass filter on the derivative
                const p = pid.kp * error;
                const d = pid.kd * derivative;
                const unclamped = p + pid.integral + d;
                const u = Math.min(pid.uMax, Math.max(pid.uMin, unclamped)); // actuator limits
                // Anti-windup by clamping: stop integrating while the output is saturated and the error pushes it further
                const saturated = u !== unclamped && Math.sign(error) === Math.sign(unclamped - u);
                if (!(pid.antiWindup && saturated)) pid.integral += pid.ki * error * DT;
                return { u, p, i: pid.integral, d };
            },
            reset(integral) {
                pid.integral = integral;
                previous = null;
                derivative = 0;
            }
        };
        return pid;
    }

    // --- Ziegler–Nichols closed-loop method, done by simulation ---
    // With P control only, raise Kp until the loop oscillates with a constant amplitude: that gain is the ultimate
    // gain Ku and the oscillation period is Tu. Bisection: the loop is unstable above Ku, decaying below it.
    function findUltimateGain(gain, tau, theta) {
        const duration = 20 * (tau + theta);
        const trial = (kp) => {
            const process = createProcess(0);
            Object.assign(process, { gain, tau, theta });
            process.reset(0);
            const final = (kp * gain) / (1 + kp * gain); // where a stable P-only loop settles after a unit step
            let early = 0;
            let late = 0;
            let previous = 0;
            const crossings = [];
            for (let n = 0, t = 0; t < duration; n++, t = n * DT) {
                const y = process.step(kp * (1 - process.y)); // no output limits: Ku is a property of the linear loop
                if (!Number.isFinite(y)) return { ratio: Infinity, period: NaN };
                const deviation = y - final;
                if (t > duration / 3 && t <= (2 * duration) / 3) early = Math.max(early, Math.abs(deviation));
                if (t > (2 * duration) / 3) late = Math.max(late, Math.abs(deviation));
                if (t > duration / 3 && previous < 0 && deviation >= 0) crossings.push(t);
                previous = deviation;
            }
            const period = crossings.length > 1 ? (crossings[crossings.length - 1] - crossings[0]) / (crossings.length - 1) : NaN;
            if (late < 1e-9) return { ratio: 0, period }; // decayed to nothing: below Ku
            return { ratio: late / early, period };
        };
        let low = 0.01;
        let high = 100000;
        for (let k = 0; k < 40; k++) {
            const mid = Math.sqrt(low * high);
            if (trial(mid).ratio >= 1) high = mid;
            else low = mid;
        }
        return { ku: Math.sqrt(low * high), tu: trial(high).period };
    }

    // --- Step response metrics, measured live against the new setpoint ---
    function createStepMetrics() {
        let m = null;
        return {
            start(t, y, setpoint, previousSetpoint) {
                // A step made before the last one finished, with the PV already near the new setpoint, can't be measured
                const tooSmall = Math.abs(setpoint - y) < 0.5 * Math.abs(setpoint - previousSetpoint);
                m = { t0: t, y0: y, setpoint, t10: null, t90: null, peak: 0, lastOutside: t, frozen: tooSmall, tooSmall };
            },
            freeze() {
                if (m) m.frozen = true; // a disturbance would spoil the step metrics
            },
            update(t, y) {
                if (!m || m.frozen) return;
                const change = m.setpoint - m.y0;
                if (change === 0) return;
                const fraction = (y - m.y0) / change;
                if (m.t10 === null && fraction >= 0.1) m.t10 = t;
                if (m.t90 === null && fraction >= 0.9) m.t90 = t;
                m.peak = Math.max(m.peak, fraction - 1);
                if (Math.abs(y - m.setpoint) > 0.02 * Math.abs(change)) m.lastOutside = t; // 2% settling band
            },
            read(t) {
                if (!m) return null;
                const settled = t - m.lastOutside > 10; // inside the band for 10 s
                if (m.tooSmall) return { tooSmall: true };
                return {
                    tooSmall: false,
                    riseTime: m.t10 !== null && m.t90 !== null ? m.t90 - m.t10 : null,
                    overshoot: 100 * m.peak,
                    settlingTime: settled ? m.lastOutside - m.t0 : null,
                    frozen: m.frozen,
                    change: m.setpoint - m.y0
                };
            }
        };
    }

    // --- The charts: setpoint and process variable on top, controller output and its P, I and D parts below ---
    const theme = new SciChartJsNavyTheme();
    const group = new SciChartVerticalGroup(); // lines up the two charts' axes
    const capacity = (WINDOW * 2) / (DT * RECORD_EVERY); // keep two windows, so you can pan back after pausing
    async function trendChart(div, yTitle, yRange, lines) {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(div, { theme });
        const xAxis = new NumericAxis(wasmContext, {
            axisTitle: "Time (s)",
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(0, WINDOW),
            labelPrecision: 0
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: yTitle,
                axisAlignment: EAxisAlignment.Left,
                visibleRange: yRange,
                autoRange: EAutoRange.Never,
                labelPrecision: 0
            })
        );
        const series = lines.map(({ name, colour, thickness = 2, dash }) => {
            const dataSeries = new XyDataSeries(wasmContext, { dataSeriesName: name, fifoCapacity: capacity, isSorted: true, containsNaN: false });
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: colour, strokeThickness: thickness, strokeDashArray: dash })
            );
            return dataSeries;
        });
        sciChartSurface.chartModifiers.add(
            new LegendModifier({ showCheckboxes: true, placement: ELegendPlacement.TopLeft, orientation: ELegendOrientation.Horizontal }),
            new CursorModifier({ showTooltip: true, showYLine: false }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        group.addSurfaceToGroup(sciChartSurface);
        return { sciChartSurface, xAxis, series };
    }
    const pvChart = await trendChart(ui.pvDiv, "Process (%)", new NumberRange(20, 85), [
        { name: "Setpoint (SP)", colour: "#F48420", dash: [6, 4] },
        { name: "Process variable (PV)", colour: "#50C7E0", thickness: 2.5 }
    ]);
    const coChart = await trendChart(ui.coDiv, "Output (%)", new NumberRange(-40, 140), [
        { name: "Controller output (CO)", colour: "#FFFFFF", thickness: 2.5 },
        { name: "P", colour: "#3BD16F", thickness: 1.5 },
        { name: "I", colour: "#E36FD4", thickness: 1.5 },
        { name: "D", colour: "#F6E05E", thickness: 1.5 }
    ]);
    const limitLine = new HorizontalLineAnnotation({
        y1: 100,
        stroke: "#EF5350",
        strokeThickness: 1.5,
        strokeDashArray: [4, 4],
        showLabel: true,
        labelPlacement: ELabelPlacement.TopRight,
        labelValue: "Output limit",
        axisLabelFill: "#EF5350"
    });
    coChart.sciChartSurface.annotations.add(limitLine);
    const [spSeries, pvSeries] = pvChart.series;
    const [coSeries, pSeries, iSeries, dSeries] = coChart.series;

    // --- The simulation ---
    let random = 1977; // seeded noise, so the demo behaves the same every time
    const noise = () => {
        random = (random * 16807) % 2147483647;
        const u1 = random / 2147483647;
        random = (random * 16807) % 2147483647;
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos((2 * Math.PI * random) / 2147483647);
    };
    const process = createProcess(SETPOINTS[0]);
    const pid = createPid();
    pid.reset(SETPOINTS[0]); // start in steady state at 40%: the I term holds the output there
    const metrics = createStepMetrics();
    let setpoint = SETPOINTS[0];
    let n = 0; // steps simulated
    let paused = false;
    let lastZn = null;
    const buffer = { t: [], sp: [], pv: [], co: [], p: [], i: [], d: [] };
    const recentPv = []; // the last 5 s of recorded PV, for the steady-state error

    function stepSetpoint() {
        const previous = setpoint;
        setpoint = setpoint === SETPOINTS[0] ? SETPOINTS[1] : SETPOINTS[0];
        metrics.start(n * DT, process.y, setpoint, previous);
    }

    function simulate(steps) {
        for (let k = 0; k < steps; k++, n++) {
            const t = n * DT;
            if (n === 200) stepSetpoint(); // a first setpoint step at 2 s
            const measured = process.y + 0.1 * noise(); // 0.1% measurement noise
            const { u, p, i, d } = pid.update(setpoint, measured);
            process.step(u);
            metrics.update(t, process.y); // measured on the noise-free PV, so noise doesn't inflate the overshoot
            if (n % RECORD_EVERY === 0) {
                for (const [key, value] of [["t", t], ["sp", setpoint], ["pv", measured], ["co", u], ["p", p], ["i", i], ["d", d]]) buffer[key].push(value);
                recentPv.push(process.y);
                if (recentPv.length > 50) recentPv.shift();
            }
        }
        if (buffer.t.length === 0) return;
        spSeries.appendRange(buffer.t, buffer.sp);
        pvSeries.appendRange(buffer.t, buffer.pv);
        coSeries.appendRange(buffer.t, buffer.co);
        pSeries.appendRange(buffer.t, buffer.p);
        iSeries.appendRange(buffer.t, buffer.i);
        dSeries.appendRange(buffer.t, buffer.d);
        for (const key of Object.keys(buffer)) buffer[key].length = 0;
        const now = n * DT;
        const range = new NumberRange(Math.max(0, now - WINDOW), Math.max(WINDOW, now));
        pvChart.xAxis.visibleRange = range;
        coChart.xAxis.visibleRange = range;
    }

    function showReadout() {
        const t = n * DT;
        const m = metrics.read(t);
        const fmt = (value, unit, digits = 1) => (value === null ? "–" : `${value.toFixed(digits)} ${unit}`);
        // Steady-state error: the setpoint minus the average PV over the last 5 s
        const average = recentPv.length ? recentPv.reduce((a, b) => a + b, 0) / recentPv.length : process.y;
        const steadyError = setpoint - average;
        const lines = [`Last setpoint step${m && m.frozen && !m.tooSmall ? " (until the disturbance)" : ""}`];
        if (m && m.tooSmall) {
            lines.push("Not measured: the PV was still close to the new setpoint. Wait for the loop to settle, then step again.");
        } else {
            lines.push(`Rise time (10–90%): ${fmt(m && m.riseTime, "s")}`);
            lines.push(`Overshoot: ${m ? `${m.overshoot.toFixed(1)}%` : "–"}`);
            lines.push(`Settling time (2%): ${m && m.settlingTime !== null ? fmt(m.settlingTime, "s") : m ? "settling…" : "–"}`);
        }
        lines.push(`Steady-state error now: ${steadyError.toFixed(2)}%`, "", `SP ${setpoint}% · PV ${process.y.toFixed(1)}%`);
        if (lastZn) {
            lines.push(
                "",
                `Ziegler–Nichols: Ku = ${lastZn.ku.toFixed(2)}, Tu = ${lastZn.tu.toFixed(2)} s, ` +
                    `so Kp = ${lastZn.kp.toFixed(2)}, Ki = ${lastZn.ki.toFixed(2)}/s, Kd = ${lastZn.kd.toFixed(2)} s`
            );
        }
        ui.panel.textContent = lines.join("\n"); // plain text, one line per metric
    }

    simulate(Math.round(30 / DT)); // start with 30 s of history, including a setpoint step at 2 s

    // Run about 60 times a second; each tick simulates the process time that has passed, SPEED times faster
    let lastTime = performance.now();
    let carry = 0;
    let ticks = 0;
    const timer = setInterval(() => {
        const time = performance.now();
        const due = Math.min(((time - lastTime) / 1000) * SPEED, 0.5) / DT + carry;
        lastTime = time;
        if (paused) return;
        const steps = Math.floor(due);
        carry = due - steps;
        simulate(steps);
        if (++ticks % 6 === 0) showReadout(); // ten readout updates a second is plenty
    }, 16);
    pvChart.sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });

    // --- The controls ---
    const bindSlider = (id, format, apply) => {
        const input = ui.input(id);
        const update = () => {
            const value = Number(input.value);
            ui.output(id).textContent = format(value);
            apply(value);
        };
        input.addEventListener("input", update);
        update();
        return input;
    };
    const kpInput = bindSlider("kp", (v) => v.toFixed(2), (v) => (pid.kp = v));
    const kiInput = bindSlider("ki", (v) => `${v.toFixed(2)}/s`, (v) => (pid.ki = v));
    const kdInput = bindSlider("kd", (v) => `${v.toFixed(2)} s`, (v) => (pid.kd = v));
    bindSlider("gain", (v) => v.toFixed(1), (v) => (process.gain = v));
    bindSlider("tau", (v) => `${v.toFixed(1)} s`, (v) => (process.tau = v));
    bindSlider("theta", (v) => `${v.toFixed(1)} s`, (v) => {
        process.theta = v;
        process.resizeDelay();
    });
    bindSlider("umax", (v) => `${v}%`, (v) => {
        pid.uMax = v;
        limitLine.y1 = v;
    });
    const dModeSelect = ui.input("dmode");
    dModeSelect.addEventListener("change", () => (pid.dOnMeasurement = dModeSelect.value === "measurement"));
    const antiWindupCheckbox = ui.input("antiwindup");
    antiWindupCheckbox.addEventListener("change", () => (pid.antiWindup = antiWindupCheckbox.checked));
    ui.input("step").addEventListener("click", stepSetpoint);
    const disturbButton = ui.input("disturb");
    disturbButton.addEventListener("click", () => {
        process.load = process.load === 0 ? DISTURBANCE : 0;
        disturbButton.textContent = process.load === 0 ? "Add load disturbance" : "Remove load disturbance";
        metrics.freeze();
    });
    const pauseButton = ui.input("pause");
    const setPaused = (value) => {
        paused = value;
        pauseButton.textContent = paused ? "Resume" : "Pause";
    };
    pauseButton.addEventListener("click", () => setPaused(!paused));
    // Zooming or panning pauses the trend, so the live update doesn't undo it
    for (const surface of [pvChart.sciChartSurface, coChart.sciChartSurface]) {
        const pauseForZoom = () => setPaused(true);
        surface.domChartRoot.addEventListener("wheel", pauseForZoom);
        surface.domChartRoot.addEventListener("pointerdown", pauseForZoom);
    }
    // Ziegler–Nichols: find Ku and Tu for the current process, apply the classic PID rule, then step the setpoint
    ui.input("zn").addEventListener("click", () => {
        const { ku, tu } = findUltimateGain(process.gain, process.tau, process.theta);
        const kp = 0.6 * ku;
        const ti = tu / 2; // integral time
        const td = tu / 8; // derivative time
        lastZn = { ku, tu, kp, ki: kp / ti, kd: kp * td };
        for (const [input, value] of [[kpInput, lastZn.kp], [kiInput, lastZn.ki], [kdInput, lastZn.kd]]) {
            input.value = String(value); // the sliders clamp values beyond their range
            input.dispatchEvent(new Event("input"));
        }
        setPaused(false);
        stepSetpoint();
        showReadout();
    });
    showReadout();
    // #region_A_end
}

pidControlChart("scichart-root");
