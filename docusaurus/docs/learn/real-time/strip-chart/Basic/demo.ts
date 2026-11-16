import * as SciChart from "scichart";

// Simulated patient-monitor signals, 1,000 samples a second per channel.
// A seeded random generator makes the chart look the same every time. These are illustrative waveforms,
// not medical data.
function createSignalSource(sampleRate) {
    let seed = 20261116;
    const random = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
    const noise = (size) => (random() - 0.5) * 2 * size;
    const bump = (t, centre, width, height) => height * Math.exp(-Math.pow((t - centre) / width, 2));

    let sample = 0; // samples made so far
    let nextBeat = 0.83; // time the next heartbeat starts (s)
    let beatCount = 0;
    // The current and the previous heartbeat: when each started, and its size (early beats are weaker)
    let beat = { start: 0, size: 1 };
    let previousBeat = { start: -1, size: 1 };

    // One heartbeat's waveforms, tb seconds after it started
    const ecgWave = (tb, size) =>
        bump(tb, 0.08, 0.022, 0.12) +
        bump(tb, 0.18, 0.008, -0.12) +
        bump(tb, 0.2, 0.01, size) +
        bump(tb, 0.222, 0.009, -0.25) +
        bump(tb, 0.45, 0.04, 0.28);
    const pressureWave = (tb, size) => bump(tb, 0.36, 0.09, 40 * size) + bump(tb, 0.58, 0.05, 6);
    const plethWave = (tb, size) => bump(tb, 0.48, 0.12, 0.85 * size) + bump(tb, 0.68, 0.06, 0.12);

    // Returns one reading for each channel: [ECG, blood pressure, pleth, respiration, CO2]
    return function nextSample() {
        const t = sample++ / sampleRate;
        if (t >= nextBeat) {
            beatCount++;
            const early = beatCount % 9 === 0; // every 9th beat comes early, then a longer pause
            previousBeat = beat;
            beat = { start: nextBeat, size: early ? 0.7 : 1 };
            nextBeat += early ? 0.55 : beatCount % 9 === 1 ? 1.1 : 0.8 + random() * 0.06;
        }
        // Add the tail of the previous heartbeat, so an early beat doesn't cut it short
        const both = (wave) => wave(t - beat.start, beat.size) + wave(t - previousBeat.start, previousBeat.size);

        const breathing = Math.sin((2 * Math.PI * t) / 4) * (1 + 0.1 * Math.sin((2 * Math.PI * t) / 37));
        const ecg = both(ecgWave) + noise(0.02);
        const pressure = 76 + both(pressureWave) + noise(0.4);
        const pleth = both(plethWave) + 0.05 * breathing + noise(0.01);
        const co2 = 38 / (1 + Math.exp(10 * breathing)) + noise(0.3);
        return [ecg, pressure, pleth, breathing + noise(0.02), co2];
    };
}

// Scrolling / Sweeping and Pause buttons in the top-left corner. In your app these can be any buttons or menus.
function addControls(chartRoot, { onMode, onPause }) {
    const bar = document.createElement("div");
    bar.style.cssText =
        "position:absolute; top:8px; left:14px; right:14px; display:flex; flex-wrap:wrap; align-items:center; gap:8px;" +
        "z-index:10; font:14px Arial, sans-serif; color:#ffffff;";
    const makeButton = (text) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.style.cssText =
            "font:bold 14px Arial, sans-serif; padding:4px 12px; border-radius:14px; cursor:pointer; border:1px solid #50C7E0;";
        bar.append(button);
        return button;
    };
    const paint = (button, active) => {
        button.style.background = active ? "#50C7E0" : "transparent";
        button.style.color = active ? "#14233C" : "#ffffff";
    };
    const scrolling = makeButton("Scrolling");
    const sweeping = makeButton("Sweeping");
    const pause = makeButton("Pause");
    pause.style.marginLeft = "12px";
    const status = document.createElement("span");
    status.style.cssText = "margin-left:8px; opacity:0.8;";
    status.hidden = chartRoot.clientWidth < 560; // no room on narrow screens
    bar.append(status);

    const showMode = (isSweeping) => {
        paint(scrolling, !isSweeping);
        paint(sweeping, isSweeping);
    };
    const showPaused = (isPaused) => {
        pause.textContent = isPaused ? "Resume" : "Pause";
        paint(pause, isPaused);
    };
    scrolling.onclick = () => showMode(onMode(false));
    sweeping.onclick = () => showMode(onMode(true));
    pause.onclick = () => showPaused(onPause());
    chartRoot.append(bar);
    return { showMode, showPaused, setStatus: (text) => (status.textContent = text) };
}

async function stripChart(divElementId) {
    // #region_A_start
    // Create a JavaScript strip chart with SciChart.js: five live channels, each in its own lane,
    // that scroll (newest data at the right) or sweep (the trace redraws from left to right)
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        NumberRange,
        Thickness,
        EAutoRange,
        EAxisAlignment,
        EXyDirection,
        LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const SAMPLE_RATE = 1000; // samples per second, per channel
    const WINDOW = 10; // seconds shown on screen
    const CAPACITY = SAMPLE_RATE * WINDOW; // points kept per channel: 10,000

    const channels = [
        { name: "ECG (mV)", title: "ECG", color: "#3BD16F", range: new NumberRange(-0.5, 1.3), precision: 1 },
        { name: "BP (mmHg)", title: "BP", color: "#EF5350", range: new NumberRange(60, 130), precision: 0 },
        { name: "Pleth", title: "Pleth", color: "#50C7E0", range: new NumberRange(-0.15, 1.05), precision: 1 },
        { name: "Resp", title: "Resp", color: "#F6E05E", range: new NumberRange(-1.4, 1.4), precision: 1 },
        { name: "CO₂ (mmHg)", title: "CO₂", color: "#C3B4F0", range: new NumberRange(-4, 44), precision: 0 }
    ];

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        padding: new Thickness(44, 16, 10, 0) // room at the top for the buttons
    });

    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "Time (s)",
        autoRange: EAutoRange.Never, // the code below moves the time window
        visibleRange: new NumberRange(0, WINDOW),
        labelPrecision: 0,
        cursorLabelPrecision: 2
    });
    sciChartSurface.xAxes.add(xAxis);

    // One y-axis per channel, stacked top to bottom so each signal has its own lane.
    // Fixed ranges: an axis that rescales on every frame makes the trace jump about.
    sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy = new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();
    const lines = channels.map((channel, index) => {
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                id: `channel${index}`,
                axisAlignment: EAxisAlignment.Left,
                axisTitle: channel.title, // short, to fit the lane; the tooltip shows the units
                axisTitleStyle: { color: channel.color, fontSize: 13 },
                autoRange: EAutoRange.Never,
                visibleRange: channel.range,
                labelPrecision: channel.precision,
                maxAutoTicks: 3,
                drawMinorGridLines: false
            })
        );
        const line = new FastLineRenderableSeries(wasmContext, {
            yAxisId: `channel${index}`,
            stroke: channel.color,
            strokeThickness: 2,
            // A dot on the newest point shows where the trace is being drawn
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                fill: channel.color,
                strokeThickness: 0,
                lastPointOnly: true
            })
        });
        sciChartSurface.renderableSeries.add(line);
        return line;
    });

    const nextSample = createSignalSource(SAMPLE_RATE);
    let isSweeping = false;
    let isPaused = false;
    let sampleIndex = 0; // samples drawn in the current mode
    let dataSeries = []; // one XyDataSeries per channel

    // fifoCapacity keeps the newest CAPACITY points and discards older ones automatically (a circular buffer).
    // fifoSweeping makes the buffer wrap around: new points overwrite the oldest, from left to right.
    function startMode(sweeping) {
        isSweeping = sweeping;
        sampleIndex = 0;
        const oldSeries = dataSeries;
        dataSeries = channels.map(
            (channel) =>
                new XyDataSeries(wasmContext, {
                    dataSeriesName: channel.name,
                    fifoCapacity: CAPACITY,
                    fifoSweeping: sweeping,
                    fifoSweepingGap: sweeping ? SAMPLE_RATE / 5 : undefined, // a 0.2 s gap ahead of the sweep
                    containsNaN: false,
                    isSorted: !sweeping
                })
        );
        lines.forEach((line, index) => (line.dataSeries = dataSeries[index]));
        oldSeries.forEach((series) => series.delete());
        xAxis.axisTitle = sweeping ? "Time in sweep (s)" : "Time (s)";
        appendSamples(CAPACITY); // start with a full window of data
        return sweeping;
    }

    function appendSamples(count) {
        const xValues = [];
        const yValues = channels.map(() => []);
        for (let i = 0; i < count; i++, sampleIndex++) {
            // Scrolling: x keeps increasing. Sweeping: x wraps back to 0 at the end of each window.
            xValues.push(isSweeping ? (sampleIndex % CAPACITY) / SAMPLE_RATE : sampleIndex / SAMPLE_RATE);
            nextSample().forEach((value, channel) => yValues[channel].push(value));
        }
        dataSeries.forEach((series, channel) => series.appendRange(xValues, yValues[channel]));
        showWindow();
    }

    // Scrolling: the time window follows the newest point. Sweeping: it stays still.
    function showWindow() {
        const now = sampleIndex / SAMPLE_RATE;
        xAxis.visibleRange = isSweeping ? new NumberRange(0, WINDOW) : new NumberRange(now - WINDOW, now);
    }

    // Add the samples that have arrived since the last update, about 60 times a second
    let lastTime = performance.now();
    let carry = 0;
    const timer = setInterval(() => {
        const time = performance.now();
        const due = Math.min(((time - lastTime) * SAMPLE_RATE) / 1000, SAMPLE_RATE / 4) + carry;
        lastTime = time;
        if (isPaused) return;
        const count = Math.floor(due);
        carry = due - count;
        if (count > 0) appendSamples(count);
    }, 16);
    sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });

    // Hover for values. Pause, then scroll to zoom in time, drag to pan and double-click to reset.
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showYLine: false,
            // One line per channel: its name and value at the cursor
            tooltipDataTemplate: (seriesInfos) => seriesInfos.map((info) => `${info.seriesName}: ${info.formattedYValue}`)
        }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    );

    const controls = addControls(sciChartSurface.domChartRoot, {
        onMode: (sweeping) => startMode(sweeping),
        onPause: () => {
            isPaused = !isPaused;
            if (!isPaused) showWindow(); // back to the live window
            return isPaused;
        }
    });
    // Zooming or panning pauses the chart, so the live update doesn't undo it
    const pauseForZoom = (event) => {
        if (event.target instanceof HTMLButtonElement || isPaused) return;
        isPaused = true;
        controls.showPaused(true);
    };
    sciChartSurface.domChartRoot.addEventListener("wheel", pauseForZoom);
    sciChartSurface.domChartRoot.addEventListener("pointerdown", pauseForZoom);

    controls.showMode(startMode(false));
    controls.showPaused(false);
    controls.setStatus(`${channels.length} channels × ${SAMPLE_RATE.toLocaleString("en")} samples/s`);
    // #region_A_end
}

stripChart("scichart-root");
