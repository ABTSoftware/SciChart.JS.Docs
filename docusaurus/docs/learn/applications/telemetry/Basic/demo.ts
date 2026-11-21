import * as SciChart from "scichart";

// A simulated telemetry recording of a single-stage sounding rocket, from liftoff to just after apogee.
// The flight is a simple vertical-ascent model (thrust, drag in an exponential atmosphere, gravity), integrated
// at 1,000 steps per second. Each channel is then "recorded" at its own sample rate, as a real telemetry
// format samples fast and slow sensors at different rates. A seeded random generator adds sensor noise, so the
// recording is the same every time. These are illustrative numbers, not data from a real vehicle.
const RECORD_SECONDS = 180;
const BURN_SECONDS = 40; // the motor burns for 40 s
const SEPARATION_TIME = 50.0137; // payload separation: a short pyrotechnic shock on the vibration channel
const START_AT = 70; // the dashboard opens with the first 70 s already received, then keeps streaming

function makeFlightRecording() {
    let seed = 20261120;
    const random = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
    const noise = (size) => (random() - 0.5) * 2 * size;

    const STEP = 0.001; // s
    const G = 9.81;
    const MASS = 1100; // kg at liftoff
    const PROPELLANT = 700; // kg
    const THRUST = 34000; // N
    const DRAG_AREA = 0.048; // drag coefficient x reference area (m²)
    const density = (h) => 1.225 * Math.exp(-h / 8500); // kg/m³
    const airTemperature = (h) => (h < 11000 ? 288.15 - 0.0065 * h : 216.65); // K, simplified standard atmosphere

    // Channels and their sample rates (samples per second)
    const channels = {
        altitude: { rate: 20, x: [], y: [] }, // km
        speed: { rate: 20, x: [], y: [] }, // m/s
        acceleration: { rate: 100, x: [], y: [] }, // g, along the rocket's axis, as an accelerometer reads it
        vibration: { rate: 1000, x: [], y: [] }, // g
        temperature: { rate: 5, x: [], y: [] }, // °C, skin of the nose cone
        pressure: { rate: 100, x: [], y: [] } // bar, motor chamber
    };
    const events = [{ name: "Liftoff", time: 0 }];

    let h = 0;
    let v = 0;
    let skin = 288.15; // K
    let vibrationState = 0;
    let maxQ = 0;
    let maxQTime = 0;
    let apogeeTime = 0;
    const steps = Math.round(RECORD_SECONDS / STEP);
    for (let n = 0; n <= steps; n++) {
        const t = n * STEP;
        const burning = t < BURN_SECONDS;
        const mass = MASS - (PROPELLANT * Math.min(t, BURN_SECONDS)) / BURN_SECONDS;
        const tailOff = t < BURN_SECONDS - 2 ? 1 : Math.max(0, (BURN_SECONDS - t) / 2);
        const thrust = burning ? THRUST * tailOff : 0;
        const q = 0.5 * density(h) * v * v; // dynamic pressure (Pa)
        const drag = q * DRAG_AREA * Math.sign(v);
        const sensed = (thrust - drag) / mass / G; // what an accelerometer on the rocket reads, in g
        if (q > maxQ) {
            maxQ = q;
            maxQTime = t;
        }
        // Aerodynamic heating: the skin creeps towards the recovery temperature, faster in denser air
        const mach = Math.abs(v) / (20.05 * Math.sqrt(airTemperature(h)));
        const recovery = airTemperature(h) * (1 + 0.178 * mach * mach);
        skin += (recovery - skin) * (0.00004 * density(h) * Math.abs(v) + 0.0005) * STEP;

        // Vibration: band-limited noise from the motor and the airflow, plus the separation shock
        vibrationState = 0.7 * vibrationState + 0.3 * noise(1);
        const roughness = burning ? 1.2 * tailOff + q / 60000 : 0.03;
        const sinceSeparation = t - SEPARATION_TIME;
        const shock =
            sinceSeparation >= 0 && sinceSeparation < 0.03
                ? 28 * Math.exp(-sinceSeparation / 0.0025) * Math.sin(2 * Math.PI * 230 * sinceSeparation)
                : 0;

        const record = (channel, value) => {
            const every = Math.round(1 / channel.rate / STEP);
            if (n % every === 0) {
                channel.x.push(t);
                channel.y.push(value);
            }
        };
        record(channels.altitude, h / 1000 + noise(0.005));
        record(channels.speed, v + noise(1.5));
        record(channels.acceleration, sensed + noise(0.05));
        record(channels.vibration, roughness * 3 * vibrationState + shock);
        record(channels.temperature, skin - 273.15 + noise(0.4));
        record(channels.pressure, burning ? (52 + 4 * Math.sin(t / 7)) * tailOff + noise(0.4) : noise(0.05));

        const previousV = v;
        v += ((thrust - drag) / mass - G) * STEP;
        h += v * STEP;
        if (previousV > 0 && v <= 0) apogeeTime = t;
    }
    events.push(
        { name: "Max-Q", time: maxQTime },
        { name: "Burnout", time: BURN_SECONDS },
        { name: "Separation", time: SEPARATION_TIME },
        { name: "Apogee", time: apogeeTime }
    );
    return { channels, events };
}

// The controls, the readouts and the four chart panes each need an element. This splits the page's div into a
// header and four panes; in your app, they can simply be elements in your HTML.
function createLayout(divElementId, paneCount) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const header = document.createElement("div");
    header.style.cssText = "padding:6px 12px 4px; color:#ffffff;" + font;
    header.innerHTML =
        `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px">` +
        `<button data-id="play" style="font:inherit; min-width:76px; padding:2px 10px; cursor:pointer">Pause</button>` +
        `<button data-id="replay" style="font:inherit; padding:2px 10px; cursor:pointer">Replay from liftoff</button>` +
        `<label>Playback speed <select data-id="speed" style="font:inherit">` +
        `<option value="1">1×</option><option value="2">2×</option><option value="5" selected>5×</option>` +
        `<option value="10">10×</option><option value="20">20×</option></select></label>` +
        `<label>Skin temperature limit <input data-id="limit" type="range" min="40" max="120" step="1" value="80" ` +
        `style="vertical-align:middle; width:120px"> <output data-id="limit"></output></label>` +
        `<label>Vibration display <select data-id="stride" style="font:inherit">` +
        `<option value="1">Every sample (1,000/s)</option><option value="20">Every 20th sample (50/s)</option>` +
        `</select></label></div>` +
        `<div data-id="tiles" aria-live="off" style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px"></div>`;
    const panes = [];
    for (let i = 0; i < paneCount; i++) {
        const pane = document.createElement("div");
        pane.id = `${divElementId}-pane${i}`;
        pane.style.cssText = "flex:1; min-height:0;";
        panes.push(pane);
    }
    root.append(header, ...panes);
    const get = (selector) => header.querySelector(selector);
    return {
        panes,
        playButton: get('button[data-id="play"]'),
        replayButton: get('button[data-id="replay"]'),
        speedSelect: get('select[data-id="speed"]'),
        limitInput: get('input[data-id="limit"]'),
        limitOutput: get('output[data-id="limit"]'),
        strideSelect: get('select[data-id="stride"]'),
        tiles: get('div[data-id="tiles"]')
    };
}

async function telemetryDashboard(divElementId) {
    const ui = createLayout(divElementId, 4);
    const { channels, events } = makeFlightRecording();

    // #region_A_start
    // A telemetry dashboard with SciChart.js: four time-synchronised strip charts, event markers,
    // an alarm limit that turns a channel red, live readouts, and playback of a recorded flight
    const {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EXyDirection,
        ELabelPlacement,
        ECoordinateMode,
        EStrokePaletteMode,
        FastLineRenderableSeries,
        XyDataSeries,
        DefaultPaletteProvider,
        parseColorToUIntArgb,
        VerticalLineAnnotation,
        HorizontalLineAnnotation,
        BoxAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const ALARM_COLOUR = "#FF4D4D";
    const fullFlight = () => new NumberRange(0, RECORD_SECONDS);
    let limit = Number(ui.limitInput.value); // °C

    // One pane per group of channels. Each pane has a fixed y-range, so the traces don't jump as data arrives.
    const paneSpecs = [
        // name: for the tooltip; title: a short axis title that fits a pane
        { name: "Altitude (km)", title: "Altitude (km)", range: new NumberRange(0, 110), colour: "#50C7E0", channel: "altitude",
          right: { name: "Speed (m/s)", title: "Speed (m/s)", range: new NumberRange(-300, 1400), colour: "#F6E05E", channel: "speed" } },
        { name: "Acceleration (g)", title: "Accel. (g)", range: new NumberRange(-2, 8), colour: "#3BD16F", channel: "acceleration" },
        { name: "Vibration (g)", title: "Vibration (g)", range: new NumberRange(-20, 20), colour: "#C3B4F0", channel: "vibration" },
        { name: "Skin temperature (°C)", title: "Skin (°C)", range: new NumberRange(0, 130), colour: "#F48420", channel: "temperature" }
    ];

    const group = new SciChartVerticalGroup(); // lines up the panes' y-axes so their time axes match
    const panes = [];
    // For each channel: its data series, its line and how many samples have been appended so far
    const lines = { altitude: null, speed: null, acceleration: null, vibration: null, temperature: null };
    for (const [index, spec] of paneSpecs.entries()) {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.panes[index], {
            theme: new SciChartJsNavyTheme()
        });
        const isLast = index === paneSpecs.length - 1;
        const xAxis = new NumericAxis(wasmContext, {
            axisTitle: isLast ? "Mission elapsed time (s)" : undefined,
            drawLabels: isLast, // only the bottom pane shows time labels
            autoRange: EAutoRange.Never, // the whole flight is shown; zoom in for detail
            visibleRange: fullFlight(),
            drawMinorGridLines: false
        });
        sciChartSurface.xAxes.add(xAxis);

        const addChannel = (axisSpec, alignment) => {
            const yAxisId = alignment === EAxisAlignment.Right ? "right" : "left";
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    id: yAxisId,
                    axisAlignment: alignment,
                    axisTitle: axisSpec.title,
                    axisTitleStyle: { color: axisSpec.colour, fontSize: 13 },
                    autoRange: EAutoRange.Never,
                    visibleRange: axisSpec.range,
                    maxAutoTicks: 4,
                    drawMinorGridLines: false
                })
            );
            const dataSeries = new XyDataSeries(wasmContext, {
                dataSeriesName: axisSpec.name,
                isSorted: true,
                containsNaN: false
            });
            const line = new FastLineRenderableSeries(wasmContext, {
                dataSeries,
                yAxisId,
                stroke: axisSpec.colour,
                strokeThickness: axisSpec.channel === "vibration" ? 1 : 2
            });
            sciChartSurface.renderableSeries.add(line);
            lines[axisSpec.channel] = { dataSeries, line, appended: 0 };
        };
        addChannel(spec, EAxisAlignment.Left);
        if (spec.right) addChannel(spec.right, EAxisAlignment.Right);

        // Event markers: a dashed vertical line on every pane, labelled on the top pane. Hidden until reached.
        const markers = events.map(
            (event) =>
                new VerticalLineAnnotation({
                    x1: event.time,
                    yAxisId: "left",
                    stroke: "#FFFFFF99",
                    strokeThickness: 1,
                    strokeDashArray: [4, 4],
                    showLabel: index === 0,
                    labelPlacement: ELabelPlacement.TopRight,
                    labelValue: event.name,
                    axisLabelFill: "#E8EDF5", // the label text colour when the label sits beside the line
                    axisFontSize: 12,
                    isHidden: true
                })
        );
        sciChartSurface.annotations.add(...markers);

        // Hover anywhere: the crosshair and values follow on every pane (modifierGroup).
        // Scroll to zoom in time, drag to pan, double-click to show the whole flight again.
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ modifierGroup: "telemetry", showTooltip: true, showYLine: false }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({
                xyDirection: EXyDirection.XDirection,
                onZoomExtents: () => {
                    panes.forEach((pane) => (pane.xAxis.visibleRange = fullFlight()));
                    return false; // skip the built-in zoom to the data received so far
                }
            })
        );
        group.addSurfaceToGroup(sciChartSurface);
        panes.push({ sciChartSurface, xAxis, markers });
    }

    // Keep the time axes in step: zooming or panning one pane moves the others
    for (const pane of panes) {
        pane.xAxis.visibleRangeChanged.subscribe(({ visibleRange }) => {
            for (const other of panes) {
                if (other !== pane && !other.xAxis.visibleRange.equals(visibleRange)) other.xAxis.visibleRange = visibleRange;
            }
        });
    }

    // --- Alarm limit on the skin temperature: a red band above the limit, a draggable limit line,
    // and a palette provider that draws the trace red wherever it is over the limit ---
    const tempPane = panes[3].sciChartSurface;
    const alarmBand = new BoxAnnotation({
        xCoordinateMode: ECoordinateMode.Relative,
        x1: 0,
        x2: 1,
        y1: limit,
        y2: 1000,
        yAxisId: "left",
        fill: ALARM_COLOUR + "22",
        strokeThickness: 0
    });
    const limitLine = new HorizontalLineAnnotation({
        y1: limit,
        yAxisId: "left",
        stroke: ALARM_COLOUR,
        strokeThickness: 2,
        strokeDashArray: [6, 3],
        isEditable: true, // drag the line to change the limit
        showLabel: true,
        labelPlacement: ELabelPlacement.Axis,
        axisLabelFill: ALARM_COLOUR
    });
    tempPane.annotations.add(alarmBand, limitLine);

    const alarmArgb = parseColorToUIntArgb(ALARM_COLOUR);
    const alarmPalette = new DefaultPaletteProvider();
    alarmPalette.strokePaletteMode = EStrokePaletteMode.SOLID;
    alarmPalette.overrideStrokeArgb = (x, y) => (y > limit ? alarmArgb : undefined);
    lines.temperature.line.paletteProvider = alarmPalette;

    function setLimit(value) {
        limit = Math.round(value);
        ui.limitInput.value = String(limit);
        ui.limitOutput.textContent = `${limit} °C`;
        alarmBand.y1 = limit;
        if (Math.abs(limitLine.y1 - limit) > 0.5) limitLine.y1 = limit;
        tempPane.invalidateElement(); // redraw, so the palette is re-evaluated
        updateReadouts();
    }
    limitLine.dragDelta.subscribe(() => setLimit(limitLine.y1));
    ui.limitInput.addEventListener("input", () => setLimit(Number(ui.limitInput.value)));

    // --- Readouts (the "gauges" of a telemetry display): the latest value of each channel ---
    const tileSpecs = [
        { label: "Time", unit: "s", digits: 1, value: () => playTime, prefix: "T+" },
        { label: "Altitude", unit: "km", digits: 1, channel: "altitude" },
        { label: "Speed", unit: "m/s", digits: 0, channel: "speed" },
        { label: "Acceleration", unit: "g", digits: 2, channel: "acceleration" },
        { label: "Chamber pressure", unit: "bar", digits: 1, channel: "pressure" },
        { label: "Skin temp.", unit: "°C", digits: 1, channel: "temperature", alarm: (v) => v > limit }
    ];
    const tiles = tileSpecs.map((spec) => {
        const tile = document.createElement("div");
        tile.style.cssText = "padding:2px 10px; border-radius:6px; background:#14233C; min-width:92px;";
        tile.innerHTML = `<div style="font-size:11px; color:#c8d3e8">${spec.label}</div><div style="font-size:16px; font-weight:600">–</div>`;
        ui.tiles.append(tile);
        return { spec, tile, value: tile.lastElementChild };
    });
    // The channel's latest received sample
    const latest = (name) => {
        const channel = channels[name];
        const sent = Math.min(channel.x.length, Math.floor(playTime * channel.rate) + 1);
        return channel.y[Math.max(0, sent - 1)];
    };
    function updateReadouts() {
        for (const { spec, tile, value } of tiles) {
            const v = spec.channel ? latest(spec.channel) : spec.value();
            value.textContent = `${spec.prefix ?? ""}${v.toFixed(spec.digits)} ${spec.unit}`;
            tile.style.background = spec.alarm && spec.alarm(v) ? ALARM_COLOUR : "#14233C";
        }
    }

    // --- Playback: append every sample whose time has come, at the chosen speed ---
    let playTime = 0; // mission elapsed time shown so far (s)
    let isPlaying = false; // starts when the dashboard first scrolls into view
    const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            isPlaying = ui.playButton.textContent === "Pause";
            observer.disconnect();
        }
    });
    observer.observe(ui.panes[0]);
    let stride = 1; // vibration display: 1 = every sample, 20 = every 20th

    function appendUpTo(time) {
        for (const [name, entry] of Object.entries(lines)) {
            const channel = channels[name];
            const step = name === "vibration" ? stride : 1;
            const end = Math.min(channel.x.length, Math.floor(time * channel.rate + 1e-9) + 1);
            const xs = [];
            const ys = [];
            let i = entry.appended;
            for (; i < end; i += step) {
                xs.push(channel.x[i]);
                ys.push(channel.y[i]);
            }
            if (xs.length) entry.dataSeries.appendRange(xs, ys);
            entry.appended = Math.max(entry.appended, i);
        }
        panes.forEach((pane) => pane.markers.forEach((marker, k) => (marker.isHidden = events[k].time > time)));
        playTime = Math.min(time, RECORD_SECONDS);
        updateReadouts();
    }

    function restartFrom(time) {
        for (const entry of Object.values(lines)) {
            entry.dataSeries.clear();
            entry.appended = 0;
        }
        appendUpTo(time);
    }

    let lastFrame = performance.now();
    const timer = setInterval(() => {
        const now = performance.now();
        const elapsed = Math.min(now - lastFrame, 250) / 1000; // s of real time, capped if the tab was hidden
        lastFrame = now;
        if (!isPlaying || playTime >= RECORD_SECONDS) return;
        appendUpTo(playTime + elapsed * Number(ui.speedSelect.value));
        if (playTime >= RECORD_SECONDS) ui.playButton.textContent = "Ended";
    }, 16);
    panes[0].sciChartSurface.addDeletable({
        delete: () => {
            clearInterval(timer);
            observer.disconnect();
        }
    });

    ui.playButton.addEventListener("click", () => {
        if (playTime >= RECORD_SECONDS) return;
        isPlaying = !isPlaying;
        ui.playButton.textContent = isPlaying ? "Pause" : "Play";
    });
    ui.replayButton.addEventListener("click", () => {
        restartFrom(0);
        isPlaying = true;
        ui.playButton.textContent = "Pause";
    });
    ui.strideSelect.addEventListener("change", () => {
        // Redraw the vibration channel from the start at the new sample spacing
        stride = Number(ui.strideSelect.value);
        lines.vibration.dataSeries.clear();
        lines.vibration.appended = 0;
        appendUpTo(playTime);
    });

    setLimit(limit);
    restartFrom(START_AT);
    // #region_A_end
}

telemetryDashboard("scichart-root");
