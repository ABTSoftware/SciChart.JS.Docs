import * as SciChart from "scichart";

// Controls above the chart: input and kernel menus, a width slider, a slide-position slider with a Play button,
// boxes for your own numbers and a results line. In your app these can be any inputs you like.
function addControls(root, { inputs, kernels, onChange }) {
    root.style.cssText += "display:flex; flex-direction:column; background:#14233C;";
    const panel = document.createElement("div");
    panel.style.cssText =
        "flex:none; display:flex; flex-wrap:wrap; align-items:center; gap:6px 14px; padding:8px 12px 4px;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color:#ffffff;";
    const fieldStyle =
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background:#0B1426; color:#ffffff;" +
        "border:1px solid #50C7E0; border-radius:6px; padding:3px 6px;";
    const makeLabel = (text, control) => {
        const label = document.createElement("label");
        label.style.cssText = "display:flex; align-items:center; gap:6px; white-space:nowrap;";
        label.append(text, control);
        panel.append(label);
        return label;
    };
    const makeSelect = (text, options) => {
        const select = document.createElement("select");
        select.style.cssText = fieldStyle;
        options.forEach(({ key, label }) => select.add(new Option(label, key)));
        makeLabel(text, select);
        return select;
    };
    const makeSlider = (text, min, max, value) => {
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = String(min);
        slider.max = String(max);
        slider.value = String(value);
        slider.style.cssText = "width:110px; accent-color:#F48420;";
        const readout = document.createElement("b");
        readout.style.cssText = "min-width:22px;";
        const label = makeLabel(text, slider);
        label.append(readout);
        return { slider, readout, label };
    };
    const makeTextBox = (text, value) => {
        const box = document.createElement("input");
        box.type = "text";
        box.value = value;
        box.style.cssText = fieldStyle + "width:150px;";
        const label = makeLabel(text, box);
        return { box, label };
    };

    const input = makeSelect("Input x", inputs);
    const kernel = makeSelect("Kernel h", kernels);
    const width = makeSlider("Width", 1, 15, 7);
    const position = makeSlider("Slide n", 0, 60, 20);
    const play = document.createElement("button");
    play.textContent = "Play";
    play.style.cssText = fieldStyle + "cursor:pointer; background:#F48420; color:#14233C; font-weight:bold; border-color:#F48420;";
    position.label.append(play);
    const customX = makeTextBox("Your x", "1, 2, 3");
    const customH = makeTextBox("Your h", "0, 1, 0.5");
    const results = document.createElement("div");
    results.setAttribute("aria-live", "polite");
    results.style.cssText = "flex-basis:100%; font-size:13px; line-height:1.45; color:#E0E6F0; min-height:38px;";
    panel.append(results);

    const chartDiv = document.createElement("div");
    chartDiv.id = root.id + "-chart"; // SciChart tells charts apart by their div's id
    chartDiv.style.cssText = "flex:1; min-height:0;";
    root.append(panel, chartDiv);

    const read = () => ({
        input: input.value,
        kernel: kernel.value,
        width: Number(width.slider.value),
        position: Number(position.slider.value),
        customX: customX.box.value,
        customH: customH.box.value
    });
    const refresh = () => {
        const { maxPosition, widthApplies, html } = onChange(read());
        position.slider.max = String(maxPosition);
        width.readout.textContent = width.slider.value;
        position.readout.textContent = position.slider.value;
        width.label.style.opacity = widthApplies ? "1" : "0.4";
        width.slider.disabled = !widthApplies;
        customX.label.style.display = input.value === "custom" ? "flex" : "none";
        customH.label.style.display = kernel.value === "custom" ? "flex" : "none";
        results.innerHTML = html;
    };
    [input, kernel].forEach((el) => el.addEventListener("change", refresh));
    [width.slider, position.slider, customX.box, customH.box].forEach((el) => el.addEventListener("input", refresh));

    // Play slides the kernel along one sample at a time, like the classic convolution animation
    let timer = null;
    const stop = () => {
        clearInterval(timer);
        timer = null;
        play.textContent = "Play";
    };
    play.onclick = () => {
        if (timer) return stop();
        if (Number(position.slider.value) >= Number(position.slider.max)) position.slider.value = "0";
        play.textContent = "Pause";
        timer = setInterval(() => {
            const next = Number(position.slider.value) + 1;
            if (next > Number(position.slider.max)) return stop();
            position.slider.value = String(next);
            refresh();
        }, 180);
    };
    return { chartDiv, refresh };
}

// #region_A_start
// Convolution calculator: the input, the kernel and the output, y = x * h, in three lanes.
// Signals and kernels are arrays of numbers. SciChart.js computes the output with an XyCustomFilter.

// The products that make up one output sample y[n], for showing the working
function productsAt(x, h, n) {
    const terms = [];
    for (let k = Math.max(0, n - h.length + 1); k <= Math.min(n, x.length - 1); k++) {
        terms.push({ k, x: x[k], h: h[n - k] });
    }
    return terms;
}

// Kernels (impulse responses). The smoothing kernels add up to 1, so they keep the signal's level.
const sumTo1 = (h) => {
    const total = h.reduce((a, b) => a + b, 0);
    return h.map((v) => v / total);
};
// Moving average: w equal weights
const movingAverageKernel = (w) => new Array(w).fill(1 / w);
// Gaussian: a bell-shaped weighted average, w samples wide
const gaussianKernel = (w) => {
    const sigma = Math.max(w / 6, 0.4);
    const centre = (w - 1) / 2;
    return sumTo1(Array.from({ length: w }, (_, k) => Math.exp(-0.5 * ((k - centre) / sigma) ** 2)));
};
// Exponential decay: recent samples count most, like an RC low-pass filter or a fading memory
const exponentialDecayKernel = (w) => {
    const ratio = w > 1 ? Math.pow(0.05, 1 / (w - 1)) : 0; // the last weight is 5% of the first
    return sumTo1(Array.from({ length: w }, (_, k) => Math.pow(ratio, k)));
};
// Echo: the sound now, plus a copy at half the volume d samples later
const echoKernel = (d) => {
    const h = new Array(d + 1).fill(0);
    h[0] = 1;
    h[d] = 0.5;
    return h;
};
// Difference (edge detector): y[n] = x[n] - x[n - 1], large where the signal jumps
const differenceKernel = () => [1, -1];

// Example input signals, 48 samples each. The noise uses a seeded random generator, so it is the same every time.
const SIGNAL_LENGTH = 48;
function makeInput(type) {
    let seed = 11;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    return Array.from({ length: SIGNAL_LENGTH }, (_, n) => {
        if (type === "step") return n >= 12 ? 1 : 0;
        if (type === "pulse") return n >= 12 && n < 24 ? 1 : 0;
        if (type === "impulse") return n === 8 ? 1 : 0;
        // noisy sine: one cycle every 24 samples, plus noise
        return Math.sin((2 * Math.PI * n) / 24) + 0.6 * (random() + random() - 1);
    });
}

// Reads "1, 2, 3" (commas or spaces) into [1, 2, 3], ignoring anything that isn't a number
const parseNumbers = (text) =>
    text
        .split(/[\s,;]+/)
        .filter((part) => part !== "")
        .map(Number)
        .filter((v) => Number.isFinite(v))
        .slice(0, 64);

async function convolutionCalculator(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastImpulseRenderableSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        XyCustomFilter,
        EllipsePointMarker,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const INPUTS = [
        { key: "noisy", label: "Noisy sine" },
        { key: "step", label: "Step" },
        { key: "pulse", label: "Pulse" },
        { key: "impulse", label: "Impulse" },
        { key: "custom", label: "Your numbers" }
    ];
    const KERNELS = [
        { key: "average", label: "Moving average", make: movingAverageKernel },
        { key: "gaussian", label: "Gaussian", make: gaussianKernel },
        { key: "decay", label: "Exponential decay", make: exponentialDecayKernel },
        { key: "echo", label: "Echo", make: echoKernel },
        { key: "difference", label: "Difference [1, −1]", make: differenceKernel },
        { key: "custom", label: "Your numbers" }
    ];

    const root = document.getElementById(divElementId);
    const controls = addControls(root, { inputs: INPUTS, kernels: KERNELS, onChange: (state) => update(state) });

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(controls.chartDiv, {
        theme: new SciChartJsNavyTheme()
    });
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "Sample index (k, n)",
        autoRange: EAutoRange.Never,
        labelPrecision: 0,
        drawMinorGridLines: false
    });
    sciChartSurface.xAxes.add(xAxis);

    // Three lanes, top to bottom: the input, the flipped and shifted kernel, and the output
    sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy = new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();
    const lanes = [
        { id: "x", title: "Input x[k]", color: "#50C7E0" },
        { id: "h", title: "Kernel h[n−k]", color: "#F48420" },
        { id: "y", title: "Output y[n]", color: "#3BD16F" }
    ];
    lanes.forEach((lane) =>
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                id: lane.id,
                axisAlignment: EAxisAlignment.Left,
                axisTitle: lane.title,
                axisTitleStyle: { color: lane.color, fontSize: 13 },
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0.15, 0.15),
                maxAutoTicks: 5,
                labelPrecision: 2,
                drawMinorGridLines: false
            })
        )
    );

    // Stem (impulse) series: one vertical line and dot per sample
    const addStems = (yAxisId, dataSeries, color, opacity = "") =>
        sciChartSurface.renderableSeries.add(
            new FastImpulseRenderableSeries(wasmContext, {
                yAxisId,
                dataSeries,
                stroke: color + opacity,
                fill: color + opacity,
                strokeThickness: 2,
                size: 7
            })
        );
    // The input x, padded with M - 1 zeros so the output can run on past its end (N + M - 1 samples in all)
    const inputSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Input x[k]" });
    addStems("x", inputSeries, "#50C7E0");
    // The kernel, flipped and slid to the current position n
    const kernelSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Kernel h[n−k]" });
    addStems("h", kernelSeries, "#F48420");

    // The output y = x * h, computed by SciChart.js from the input series with an XyCustomFilter.
    // SciChart calls filterFunction(n) for every sample when the input is replaced, and only for the new
    // samples when you append to it, so the same code keeps up with live data.
    let kernel = [1]; // the current kernel h
    let current = 0; // the current slide position n
    const convolveAt = (n) => {
        const x = inputSeries.getNativeYValues();
        let sum = 0;
        // y[n] = sum of h[j] * x[n - j]: the kernel, flipped, over the input up to sample n
        for (let j = 0; j < kernel.length && n - j >= 0; j++) sum += kernel[j] * x.get(n - j);
        return sum;
    };
    // Two copies, so samples up to n are bright and those still to come are faint (NaN draws nothing)
    const doneSeries = new XyCustomFilter(inputSeries, {
        dataSeriesName: "Output y[n]",
        filterFunction: (n) => (n <= current ? convolveAt(n) : NaN)
    });
    const toComeSeries = new XyCustomFilter(inputSeries, {
        dataSeriesName: "Output still to come",
        filterFunction: (n) => (n > current ? convolveAt(n) : NaN)
    });
    addStems("y", doneSeries, "#3BD16F");
    addStems("y", toComeSeries, "#3BD16F", "44");
    // A ring around the output sample being computed
    const currentSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Current y[n]" });
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            yAxisId: "y",
            dataSeries: currentSeries,
            pointMarker: new EllipsePointMarker(wasmContext, { width: 16, height: 16, fill: "#00000000", stroke: "#FFFFFF", strokeThickness: 2 })
        })
    );

    const indices = (start, count) => Array.from({ length: count }, (_, i) => start + i);
    const fmt = (v) => String(Math.round(v * 1000) / 1000);
    const replace = (series, xs, ys) => {
        series.clear();
        if (xs.length) series.appendRange(xs, ys);
    };

    // Runs the convolution for the current settings and redraws everything. Returns the text for the results line.
    function update(state) {
        const x = state.input === "custom" ? parseNumbers(state.customX) : makeInput(state.input);
        const kernelInfo = KERNELS.find((k) => k.key === state.kernel);
        const h = state.kernel === "custom" ? parseNumbers(state.customH) : kernelInfo.make(state.width);
        if (x.length === 0 || h.length === 0) {
            return { maxPosition: 0, widthApplies: false, html: "Type some numbers, separated by commas." };
        }
        const N = x.length;
        const M = h.length;
        const length = N + M - 1;
        const n = Math.min(state.position, length - 1);
        kernel = h;
        current = n;

        // Replacing the input makes the two XyCustomFilters recompute the output
        const padded = x.concat(new Array(M - 1).fill(0));
        replace(inputSeries, indices(0, length), padded);
        // The kernel, flipped and slid to n: h[n - k] sits at k = n - j for j = 0 … M - 1
        replace(kernelSeries, indices(0, M).map((j) => n - j), h);
        // Read the output back from the filters
        const y = indices(0, length).map((i) => (i <= n ? doneSeries : toComeSeries).getNativeYValues().get(i));
        replace(currentSeries, [n], [y[n]]);
        xAxis.visibleRange = new NumberRange(-M - 0.5, length + 0.5);

        const terms = productsAt(x, h, n).filter((t) => t.x !== 0 && t.h !== 0);
        const working =
            terms.length === 0
                ? "0 (no overlap)"
                : terms.length <= 5
                  ? terms.map((t) => `${fmt(t.x)}×${fmt(t.h)}`).join(" + ") + ` = <b>${fmt(y[n])}</b>`
                  : `the sum of ${terms.length} products = <b>${fmt(y[n])}</b>`;
        const list = y.length <= 16 ? `<br>y = [${y.map(fmt).join(", ")}]` : "";
        return {
            maxPosition: length - 1,
            widthApplies: !["difference", "custom"].includes(state.kernel),
            html:
                `y[${n}] = Σ x[k]·h[${n}−k] = ${working}` +
                ` &nbsp;·&nbsp; Length: N + M − 1 = ${N} + ${M} − 1 = <b>${length}</b>${list}`
        };
    }
    controls.refresh();

    // Hover for values, scroll to zoom, drag to pan, double-click to reset
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
}
// #region_A_end

convolutionCalculator("scichart-root");
