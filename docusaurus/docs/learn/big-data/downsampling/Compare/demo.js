import * as SciChart from "scichart";

// #region_B_start
// Downsampling helpers. Each one takes x and y arrays (sorted by x) and a target number of points,
// and returns a smaller { x, y } to draw. They work with any chart library.

// Every nth point: keep one point in every n. Fast, but blind to anything between the points it keeps.
function everyNth(x, y, target) {
    const n = Math.max(1, Math.floor(x.length / target));
    const outX = [];
    const outY = [];
    for (let i = 0; i < x.length; i += n) {
        outX.push(x[i]);
        outY.push(y[i]);
    }
    return { x: outX, y: outY };
}

// Average: split the data into equal buckets and keep each bucket's mean. Smooth, but flattens spikes.
function bucketAverage(x, y, target) {
    const size = x.length / target;
    const outX = [];
    const outY = [];
    for (let b = 0; b < target; b++) {
        const start = Math.floor(b * size);
        const end = Math.min(x.length, Math.floor((b + 1) * size));
        if (end <= start) continue;
        let sumX = 0;
        let sumY = 0;
        for (let i = start; i < end; i++) {
            sumX += x[i];
            sumY += y[i];
        }
        outX.push(sumX / (end - start));
        outY.push(sumY / (end - start));
    }
    return { x: outX, y: outY };
}

// Lowest and highest point in each bucket, by index
function bucketExtremes(y, start, end) {
    let iMin = start;
    let iMax = start;
    for (let i = start + 1; i < end; i++) {
        if (y[i] < y[iMin]) iMin = i;
        if (y[i] > y[iMax]) iMax = i;
    }
    return { iMin, iMax };
}

// Min-max: one bucket per two output points (one per pixel column when target = 2 x chart width).
// Keeps each bucket's lowest and highest point, in time order, so every peak and trough survives.
function minMax(x, y, target) {
    const buckets = Math.max(1, Math.floor(target / 2));
    const size = x.length / buckets;
    const outX = [];
    const outY = [];
    for (let b = 0; b < buckets; b++) {
        const start = Math.floor(b * size);
        const end = Math.min(x.length, Math.floor((b + 1) * size));
        if (end <= start) continue;
        const { iMin, iMax } = bucketExtremes(y, start, end);
        for (const i of iMin === iMax ? [iMin] : [Math.min(iMin, iMax), Math.max(iMin, iMax)]) {
            outX.push(x[i]);
            outY.push(y[i]);
        }
    }
    return { x: outX, y: outY };
}

// M4 (Jugel et al., 2014): one bucket per four output points. Keeps each bucket's first, lowest,
// highest and last point, so the lines joining one pixel column to the next are drawn correctly too.
function m4(x, y, target) {
    const buckets = Math.max(1, Math.floor(target / 4));
    const size = x.length / buckets;
    const outX = [];
    const outY = [];
    for (let b = 0; b < buckets; b++) {
        const start = Math.floor(b * size);
        const end = Math.min(x.length, Math.floor((b + 1) * size));
        if (end <= start) continue;
        const { iMin, iMax } = bucketExtremes(y, start, end);
        const keep = [...new Set([start, iMin, iMax, end - 1])].sort((p, q) => p - q);
        for (const i of keep) {
            outX.push(x[i]);
            outY.push(y[i]);
        }
    }
    return { x: outX, y: outY };
}

// Largest-Triangle-Three-Buckets (Steinarsson, 2013). Keeps the first and last points, then one point per
// bucket: the one that makes the largest triangle with the point kept before it and the next bucket's average.
function lttb(x, y, target) {
    const n = x.length;
    if (target >= n || target < 3) return { x: Array.from(x), y: Array.from(y) };
    const outX = [x[0]];
    const outY = [y[0]];
    const every = (n - 2) / (target - 2);
    let a = 0; // index of the point kept in the previous bucket
    for (let b = 0; b < target - 2; b++) {
        // The average point of the next bucket (for the last bucket, the final point)
        const nextStart = Math.floor((b + 1) * every) + 1;
        const nextEnd = Math.min(n, Math.floor((b + 2) * every) + 1);
        let avgX = x[n - 1];
        let avgY = y[n - 1];
        if (nextEnd > nextStart) {
            avgX = 0;
            avgY = 0;
            for (let i = nextStart; i < nextEnd; i++) {
                avgX += x[i];
                avgY += y[i];
            }
            avgX /= nextEnd - nextStart;
            avgY /= nextEnd - nextStart;
        }
        // The point in this bucket with the largest triangle area (twice the area: the factor doesn't matter)
        const start = Math.floor(b * every) + 1;
        const end = Math.floor((b + 1) * every) + 1;
        let best = start;
        let bestArea = -1;
        for (let i = start; i < end; i++) {
            const area = Math.abs((x[a] - avgX) * (y[i] - y[a]) - (x[a] - x[i]) * (avgY - y[a]));
            if (area > bestArea) {
                bestArea = area;
                best = i;
            }
        }
        outX.push(x[best]);
        outY.push(y[best]);
        a = best;
    }
    outX.push(x[n - 1]);
    outY.push(y[n - 1]);
    return { x: outX, y: outY };
}
// #region_B_end

// Example data: 1,000,000 samples (1,000 a second for 1,000 seconds) of a slowly changing, noisy signal
// with 12 short spikes, each one to three samples wide. Seeded, so it looks the same every time.
function makeSignal(count = 1000000, spikeCount = 12) {
    let seed = 7;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const x = new Float64Array(count);
    const y = new Float64Array(count);
    const base = new Float64Array(count); // the signal without its spikes, to check which spikes survive
    let drift = 0;
    for (let i = 0; i < count; i++) {
        const t = i / 1000;
        drift = drift * 0.9999 + (random() - 0.5) * 0.02;
        const noise = (random() + random() + random() - 1.5) * 0.8;
        base[i] = 2 * Math.sin((2 * Math.PI * t) / 400) + 0.8 * Math.sin((2 * Math.PI * t) / 37) + drift + noise;
        x[i] = t;
        y[i] = base[i];
    }
    const spikes = [];
    for (let s = 0; s < spikeCount; s++) {
        const index = Math.floor(((s + 0.2 + random() * 0.6) / spikeCount) * count);
        const height = (random() < 0.5 ? -1 : 1) * (5 + random() * 4);
        const width = 1 + Math.floor(random() * 3);
        for (let k = 0; k < width; k++) y[index + k] = base[index + k] + height * (k === 0 ? 1 : 0.6);
        spikes.push({ index, height });
    }
    return { x, y, base, spikes };
}

// A spike counts as kept if the downsampled line still reaches at least half its height
function countSpikesKept(result, signal) {
    let kept = 0;
    for (const spike of signal.spikes) {
        const t = signal.x[spike.index];
        const base = signal.base[spike.index];
        const direction = Math.sign(spike.height);
        for (let i = 0; i < result.x.length; i++) {
            if (Math.abs(result.x[i] - t) <= 0.0021 && (result.y[i] - base) * direction >= 0.5 * Math.abs(spike.height)) {
                kept++;
                break;
            }
        }
    }
    return kept;
}

const METHODS = [
    { key: "nth", label: "Every nth", run: everyNth },
    { key: "average", label: "Average", run: bucketAverage },
    { key: "minmax", label: "Min-max", run: minMax },
    { key: "m4", label: "M4", run: m4 },
    { key: "lttb", label: "LTTB", run: lttb }
];
const TARGETS = [500, 1000, 5000];

// Buttons and a status line in the top-left corner of the chart
function addControls(chartRoot, state, onChange) {
    const panel = document.createElement("div");
    panel.style.cssText =
        "position:absolute; top:8px; left:12px; right:12px; z-index:10; display:flex; flex-direction:column; gap:6px;" +
        "font:13px Arial, sans-serif; color:#ffffff; pointer-events:none;";
    const makeRow = (label, items, isActive, onClick) => {
        const row = document.createElement("div");
        row.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px; pointer-events:auto;";
        const caption = document.createElement("span");
        caption.textContent = label;
        caption.style.cssText = "min-width:52px; font-weight:bold;";
        row.append(caption);
        const buttons = items.map((item) => {
            const button = document.createElement("button");
            button.textContent = item.label;
            button.style.cssText =
                "font:bold 13px Arial, sans-serif; padding:3px 10px; border-radius:14px; cursor:pointer; border:1px solid #F48420;";
            button.onclick = () => {
                onClick(item);
                paintAll();
            };
            row.append(button);
            return { button, item };
        });
        const paint = () =>
            buttons.forEach(({ button, item }) => {
                const active = isActive(item);
                button.style.background = active ? "#F48420" : "#14233CCC";
                button.style.color = active ? "#14233C" : "#ffffff";
            });
        return { row, paint };
    };
    const methodRow = makeRow("Method", METHODS, (m) => m.key === state.method.key, (m) => (state.method = m));
    const targetRow = makeRow(
        "Points",
        TARGETS.map((t) => ({ label: t.toLocaleString("en-US"), value: t })),
        (t) => t.value === state.target,
        (t) => (state.target = t.value)
    );
    const status = document.createElement("div");
    status.style.cssText = "background:#14233CCC; padding:3px 8px; border-radius:6px; align-self:flex-start;";
    const paintAll = () => {
        methodRow.paint();
        targetRow.paint();
        status.innerHTML = onChange();
    };
    panel.append(methodRow.row, targetRow.row, status);
    chartRoot.append(panel);
    paintAll();
}

async function downsamplingComparison(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        NumberRange,
        EResamplingMode,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } = SciChart;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)", growBy: new NumberRange(0.02, 0.01) }));
    // Extra space at the top for the buttons
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Signal", growBy: new NumberRange(0.08, 0.55) }));

    const signal = makeSignal();

    // All 1,000,000 raw samples, drawn faintly. SciChart.js resamples this line itself for each view.
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: signal.x,
                yValues: signal.y,
                dataIsSortedInX: true,
                dataEvenlySpacedInX: true,
                containsNaN: false
            }),
            stroke: "#50C7E066",
            strokeThickness: 1,
            resamplingMode: EResamplingMode.Auto
        })
    );

    // The downsampled copy, drawn on top. Resampling is off, so you see exactly the points the method kept.
    const downsampled = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: downsampled,
            stroke: "#F48420",
            strokeThickness: 2,
            resamplingMode: EResamplingMode.None
        })
    );

    const state = { method: METHODS[4], target: 1000 };
    const update = () => {
        const result = state.method.run(signal.x, signal.y, state.target);
        downsampled.clear();
        downsampled.appendRange(result.x, result.y);
        const kept = countSpikesKept(result, signal);
        return (
            `<span style="color:#F48420">&#9644;</span> ${state.method.label}: ${result.x.length.toLocaleString("en-US")} points` +
            ` &nbsp;<span style="color:#50C7E0">&#9644;</span> raw: 1,000,000 points` +
            ` &nbsp;&middot;&nbsp; <b>${kept} of ${signal.spikes.length} spikes kept</b>`
        );
    };
    addControls(sciChartSurface.domChartRoot, state, update);

    // Scroll to zoom in time, drag to pan, double-click to reset. The y-axis stays put, so spikes stay in view.
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier()
    );
}

downsamplingComparison("scichart-root");
