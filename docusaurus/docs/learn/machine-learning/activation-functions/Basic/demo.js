import * as SciChart from "scichart";

// The controls and the charts each need an element. This splits the page's div into four panels, each with its own
// control bar: activation functions, softmax, the network's fit and its training loss. In your app, they can be
// elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const barStyle = "display:flex; flex-wrap:wrap; align-items:center; gap:4px 14px; padding:6px 12px; color:#ffffff;" + font;
    const row = () => {
        const div = document.createElement("div");
        div.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
        root.append(div);
        return div;
    };
    const panel = (parent, name, basis, controlsHtml) => {
        const div = document.createElement("div");
        div.style.cssText = `flex:${basis}; min-height:300px; display:flex; flex-direction:column;`;
        const bar = document.createElement("div");
        bar.style.cssText = barStyle;
        bar.innerHTML = controlsHtml;
        const chartDiv = document.createElement("div");
        chartDiv.id = `${divElementId}-${name}`; // each chart's div needs its own id
        chartDiv.style.cssText = "flex:1; min-height:240px;";
        div.append(bar, chartDiv);
        parent.append(div);
        return { bar, chartDiv };
    };
    const checkbox = (id, label, checked) =>
        `<label style="white-space:nowrap"><input data-id="${id}" type="checkbox"${checked ? " checked" : ""}> ${label}</label>`;
    const logit = (id, label, value) =>
        `<label>${label} <input data-id="${id}" type="number" min="-10" max="10" step="0.5" value="${value}" style="font:inherit; width:58px"></label>`;

    const top = row();
    const functions = panel(
        top,
        "functions",
        "1.6 1 460px",
        `<label>Show <select data-id="preset" style="font:inherit">` +
            `<option value="custom">Ticked</option><option value="classic">Sigmoid and tanh</option>` +
            `<option value="relu">ReLU family</option><option value="smooth">GELU, Swish, softplus</option>` +
            `<option value="all">All</option></select></label>` +
            checkbox("sigmoid", "Sigmoid", true) +
            checkbox("tanh", "Tanh", true) +
            checkbox("relu", "ReLU", true) +
            checkbox("leakyRelu", "Leaky ReLU", false) +
            checkbox("elu", "ELU", false) +
            checkbox("gelu", "GELU", true) +
            checkbox("swish", "Swish", false) +
            checkbox("softplus", "Softplus", false) +
            `<span style="opacity:0.5">|</span>` +
            checkbox("derivatives", "Derivatives (dashed)", false)
    );
    const softmax = panel(
        top,
        "softmax",
        "1 1 320px",
        logit("logitA", "Cat", 2) +
            logit("logitB", "Dog", 1) +
            logit("logitC", "Bird", -1) +
            `<label>Temperature <input data-id="temperature" type="range" min="0.1" max="5" step="0.1" value="1" ` +
            `style="vertical-align:middle; width:110px"> <output data-id="temperature"></output></label>`
    );
    const softmaxReadout = document.createElement("div");
    softmaxReadout.setAttribute("aria-live", "polite");
    softmaxReadout.style.cssText = "padding:0 12px 4px; color:#C8D3E8; font-size:13px;" + font;
    softmax.bar.after(softmaxReadout);

    const bottom = row();
    const fit = panel(
        bottom,
        "fit",
        "1.6 1 460px",
        `<label>Activation <select data-id="activation" style="font:inherit">` +
            `<option value="sigmoid">Sigmoid</option><option value="tanh" selected>Tanh</option><option value="relu">ReLU</option>` +
            `<option value="leakyRelu">Leaky ReLU</option><option value="elu">ELU</option><option value="gelu">GELU</option>` +
            `<option value="swish">Swish</option><option value="softplus">Softplus</option></select></label>` +
            `<label>Hidden units <select data-id="units" style="font:inherit">` +
            `<option>2</option><option>4</option><option selected>8</option><option>16</option><option>32</option></select></label>` +
            `<button data-id="train" type="button" style="font:inherit; min-width:70px">Pause</button>` +
            `<button data-id="reset" type="button" style="font:inherit">Reset</button>`
    );
    const status = document.createElement("div");
    status.setAttribute("role", "status");
    status.style.cssText = "padding:0 12px 4px; color:#C8D3E8; font-size:13px;" + font;
    fit.bar.after(status);
    const loss = panel(
        bottom,
        "loss",
        "1 1 320px",
        `<span>Training loss, log scale</span><button data-id="clearPrevious" type="button" style="font:inherit">Clear previous run</button>`
    );

    // Look up a control by its data-id
    const input = (id) => Array.from(root.querySelectorAll("input")).find((el) => el.dataset.id === id);
    const select = (id) => Array.from(root.querySelectorAll("select")).find((el) => el.dataset.id === id);
    const button = (id) => Array.from(root.querySelectorAll("button")).find((el) => el.dataset.id === id);
    return {
        functionsDiv: functions.chartDiv,
        softmaxDiv: softmax.chartDiv,
        fitDiv: fit.chartDiv,
        lossDiv: loss.chartDiv,
        softmaxReadout,
        status,
        input,
        select,
        button
    };
}

async function activationFunctionsChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Activation functions, softmax and a tiny neural network trained in the browser, charted with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        ENumericFormat,
        TextLabelProvider,
        FastLineRenderableSeries,
        FastColumnRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        EColumnDataLabelPosition,
        WaveAnimation,
        LegendModifier,
        ELegendPlacement,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- The activation functions and their derivatives (plain JavaScript) ---

    // The error function, needed for GELU (Abramowitz and Stegun 7.1.26; absolute error below 1.5e-7)
    function erf(x) {
        const sign = x < 0 ? -1 : 1;
        const t = 1 / (1 + 0.3275911 * Math.abs(x));
        const poly = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
        return sign * (1 - poly * Math.exp(-x * x));
    }
    const sigmoid = (x) => 1 / (1 + Math.exp(-x));
    const LEAK = 0.1; // leaky ReLU slope for x < 0 (0.01 is a common default; 0.1 makes it visible on the chart)

    // f is the function, df its derivative: backpropagation multiplies the gradient by df at every unit
    const ACTIVATIONS = {
        sigmoid: { name: "Sigmoid", colour: "#50C7E0", f: sigmoid, df: (x) => sigmoid(x) * (1 - sigmoid(x)) },
        tanh: { name: "Tanh", colour: "#F48420", f: Math.tanh, df: (x) => 1 - Math.tanh(x) ** 2 },
        relu: { name: "ReLU", colour: "#3BD16F", f: (x) => Math.max(0, x), df: (x) => (x > 0 ? 1 : 0) },
        leakyRelu: { name: "Leaky ReLU (α = 0.1)", colour: "#E36FD4", f: (x) => (x > 0 ? x : LEAK * x), df: (x) => (x > 0 ? 1 : LEAK) },
        elu: { name: "ELU (α = 1)", colour: "#FFD54F", f: (x) => (x > 0 ? x : Math.exp(x) - 1), df: (x) => (x > 0 ? 1 : Math.exp(x)) },
        gelu: {
            name: "GELU",
            colour: "#FF6B6B",
            f: (x) => 0.5 * x * (1 + erf(x / Math.SQRT2)), // x times the standard normal CDF
            df: (x) => 0.5 * (1 + erf(x / Math.SQRT2)) + (x * Math.exp(-0.5 * x * x)) / Math.sqrt(2 * Math.PI)
        },
        swish: { name: "Swish / SiLU", colour: "#B39DDB", f: (x) => x * sigmoid(x), df: (x) => sigmoid(x) * (1 + x * (1 - sigmoid(x))) },
        softplus: { name: "Softplus", colour: "#C8D3E8", f: (x) => (x > 30 ? x : Math.log1p(Math.exp(x))), df: sigmoid }
    };

    // Softmax: turns scores (logits) into probabilities that sum to 1. Dividing by the temperature first makes the
    // result sharper (T < 1) or flatter (T > 1). Subtracting the largest score stops Math.exp overflowing and
    // doesn't change the result.
    function softmax(logits, temperature) {
        const scaled = logits.map((z) => z / temperature);
        const max = Math.max(...scaled);
        const exps = scaled.map((z) => Math.exp(z - max));
        const sum = exps.reduce((a, b) => a + b, 0);
        return exps.map((e) => e / sum);
    }

    // --- A tiny neural network: 1 input, one hidden layer, 1 linear output, trained with Adam ---

    // Seeded random numbers, so every run starts from the same weights and the activations compare fairly
    function makeRandom(seed) {
        let s = seed;
        const random = () => {
            s = (s * 16807) % 2147483647;
            return (s - 1) / 2147483646;
        };
        const gaussian = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
        return { random, gaussian };
    }

    // Sample data: 60 points of y = sin(2x) on -3 to 3, plus a little seeded noise (standard deviation 0.05)
    function makeTrainingData(count) {
        const { gaussian } = makeRandom(4242);
        const x = [];
        const y = [];
        for (let i = 0; i < count; i++) {
            const xi = -3 + (6 * i) / (count - 1);
            x.push(xi);
            y.push(Math.sin(2 * xi) + 0.05 * gaussian());
        }
        return { x, y };
    }

    function createNetwork(hiddenUnits, activation) {
        const { gaussian } = makeRandom(1010);
        // Parameters: hidden weights w1 and biases b1, output weights w2 and bias b2
        const p = { w1: [], b1: [], w2: [], b2: 0 };
        for (let j = 0; j < hiddenUnits; j++) {
            p.w1.push(gaussian());
            p.b1.push(gaussian());
            p.w2.push(gaussian() / Math.sqrt(hiddenUnits));
        }
        // Adam keeps a running mean (m) and mean square (v) of each parameter's gradient
        const zeros = () => new Array(hiddenUnits).fill(0);
        const m = { w1: zeros(), b1: zeros(), w2: zeros(), b2: [0] };
        const v = { w1: zeros(), b1: zeros(), w2: zeros(), b2: [0] };
        let step = 0;

        const predict = (x) => {
            let out = p.b2;
            for (let j = 0; j < hiddenUnits; j++) out += p.w2[j] * activation.f(p.w1[j] * x + p.b1[j]);
            return out;
        };

        // One epoch of full-batch gradient descent on the mean squared error. Returns the loss before the update.
        function trainStep(xs, ys, learningRate) {
            const n = xs.length;
            const g = { w1: zeros(), b1: zeros(), w2: zeros(), b2: [0] };
            const z = new Array(hiddenUnits);
            const a = new Array(hiddenUnits);
            let loss = 0;
            for (let i = 0; i < n; i++) {
                // Forward pass: z = w1·x + b1, a = f(z), output = w2·a + b2
                let out = p.b2;
                for (let j = 0; j < hiddenUnits; j++) {
                    z[j] = p.w1[j] * xs[i] + p.b1[j];
                    a[j] = activation.f(z[j]);
                    out += p.w2[j] * a[j];
                }
                const error = out - ys[i];
                loss += (error * error) / n;
                // Backward pass (the chain rule): the activation's derivative scales each hidden unit's gradient
                const dOut = (2 * error) / n;
                g.b2[0] += dOut;
                for (let j = 0; j < hiddenUnits; j++) {
                    g.w2[j] += dOut * a[j];
                    const dz = dOut * p.w2[j] * activation.df(z[j]);
                    g.w1[j] += dz * xs[i];
                    g.b1[j] += dz;
                }
            }
            // Adam update, with bias correction for the first steps
            step++;
            const c1 = 1 - 0.9 ** step;
            const c2 = 1 - 0.999 ** step;
            const adam = (values, grads, mk, vk) => {
                for (let j = 0; j < values.length; j++) {
                    mk[j] = 0.9 * mk[j] + 0.1 * grads[j];
                    vk[j] = 0.999 * vk[j] + 0.001 * grads[j] * grads[j];
                    values[j] -= (learningRate * (mk[j] / c1)) / (Math.sqrt(vk[j] / c2) + 1e-8);
                }
            };
            adam(p.w1, g.w1, m.w1, v.w1);
            adam(p.b1, g.b1, m.b1, v.b1);
            adam(p.w2, g.w2, m.w2, v.w2);
            const b2 = [p.b2];
            adam(b2, g.b2, m.b2, v.b2);
            p.b2 = b2[0];
            return loss;
        }

        // A ReLU unit is "dead" when its input is negative for every training point: its output and gradient are
        // then always 0, so gradient descent can never revive it
        const deadUnits = (xs) => p.w1.filter((w, j) => xs.every((x) => w * x + p.b1[j] <= 0)).length;

        return { predict, trainStep, deadUnits };
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const zoom = () => [new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier()];
    const range = (from, to, count) => Array.from({ length: count }, (_, i) => from + ((to - from) * i) / (count - 1));

    // 1. The activation functions (solid) and their derivatives (dashed), from x = -5 to 5
    const fn = await SciChartSurface.create(ui.functionsDiv, { theme });
    fn.sciChartSurface.xAxes.add(new NumericAxis(fn.wasmContext, { axisTitle: "Input x", visibleRange: new NumberRange(-5, 5), labelPrecision: 0 }));
    fn.sciChartSurface.yAxes.add(
        new NumericAxis(fn.wasmContext, { axisTitle: "f(x)", axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(-1.25, 2.5), labelPrecision: 1 })
    );
    const xs = range(-5, 5, 801);
    const fnLegend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopLeft });
    const fnCursor = new CursorModifier({ showTooltip: true, showAxisLabels: false });
    fn.sciChartSurface.chartModifiers.add(fnLegend, fnCursor, ...zoom());
    const functionSeries = {};
    for (const [key, a] of Object.entries(ACTIVATIONS)) {
        const curve = new FastLineRenderableSeries(fn.wasmContext, {
            dataSeries: new XyDataSeries(fn.wasmContext, { xValues: xs, yValues: xs.map(a.f), dataSeriesName: a.name, dataIsSortedInX: true }),
            stroke: a.colour,
            strokeThickness: 2.5
        });
        const derivative = new FastLineRenderableSeries(fn.wasmContext, {
            dataSeries: new XyDataSeries(fn.wasmContext, { xValues: xs, yValues: xs.map(a.df), dataSeriesName: `${a.name} derivative`, dataIsSortedInX: true }),
            stroke: a.colour,
            strokeThickness: 1.5,
            strokeDashArray: [6, 4]
        });
        fn.sciChartSurface.renderableSeries.add(curve, derivative);
        functionSeries[key] = { curve, derivative };
    }

    // 2. Softmax: the probability of each class, as columns
    const classes = ["Cat", "Dog", "Bird"];
    const sm = await SciChartSurface.create(ui.softmaxDiv, { theme });
    sm.sciChartSurface.xAxes.add(
        new NumericAxis(sm.wasmContext, {
            labelProvider: new TextLabelProvider({ labels: classes }),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            visibleRange: new NumberRange(-1, 2.6) // room on the left for the watermark
        })
    );
    sm.sciChartSurface.yAxes.add(
        new NumericAxis(sm.wasmContext, {
            axisTitle: "Probability (%)",
            axisAlignment: EAxisAlignment.Left,
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(0, 112), // headroom for the labels above the columns
            labelPrecision: 0
        })
    );
    const probabilities = new XyDataSeries(sm.wasmContext, { dataSeriesName: "Softmax probability" });
    sm.sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(sm.wasmContext, {
            dataSeries: probabilities,
            fill: "#50C7E0CC",
            stroke: "#50C7E0",
            strokeThickness: 2,
            dataPointWidth: 0.6,
            cornerRadius: 8,
            animation: new WaveAnimation({ duration: 1000 }),
            dataLabels: {
                color: "#FFFFFF",
                style: { fontSize: 16, fontFamily: "Arial" },
                precision: 1,
                positionMode: EColumnDataLabelPosition.Outside
            }
        })
    );

    // 3. The network's fit: the training points and the network's output across the input range
    const training = makeTrainingData(60);
    const fitChart = await SciChartSurface.create(ui.fitDiv, { theme });
    fitChart.sciChartSurface.xAxes.add(new NumericAxis(fitChart.wasmContext, { axisTitle: "Input x", visibleRange: new NumberRange(-3.2, 3.2), labelPrecision: 0 }));
    fitChart.sciChartSurface.yAxes.add(
        new NumericAxis(fitChart.wasmContext, { axisTitle: "Output y", axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(-1.8, 1.8), labelPrecision: 1 })
    );
    fitChart.sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(fitChart.wasmContext, {
            dataSeries: new XyDataSeries(fitChart.wasmContext, { xValues: training.x, yValues: training.y, dataSeriesName: "Training data: sin(2x) + noise" }),
            pointMarker: new EllipsePointMarker(fitChart.wasmContext, { width: 7, height: 7, fill: "#C8D3E8", stroke: "#C8D3E8" })
        })
    );
    const fitX = range(-3.2, 3.2, 321);
    const fitLine = new XyDataSeries(fitChart.wasmContext, { dataSeriesName: "Network output", dataIsSortedInX: true });
    fitChart.sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(fitChart.wasmContext, { dataSeries: fitLine, stroke: "#F48420", strokeThickness: 3 }));
    fitChart.sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.BottomRight }),
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        ...zoom()
    );

    // 4. The training loss (mean squared error) on a log scale, with the previous run in grey for comparison
    const MAX_EPOCHS = 5000;
    const lossChart = await SciChartSurface.create(ui.lossDiv, { theme });
    lossChart.sciChartSurface.xAxes.add(
        new NumericAxis(lossChart.wasmContext, { axisTitle: "Epoch", visibleRange: new NumberRange(0, MAX_EPOCHS), labelFormat: ENumericFormat.Engineering })
    );
    lossChart.sciChartSurface.yAxes.add(
        new LogarithmicAxis(lossChart.wasmContext, {
            axisTitle: "Mean squared error",
            axisAlignment: EAxisAlignment.Left,
            logBase: 10,
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(0.001, 2),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 3
        })
    );
    const previousLoss = new XyDataSeries(lossChart.wasmContext, { dataSeriesName: "Previous run", dataIsSortedInX: true });
    const currentLoss = new XyDataSeries(lossChart.wasmContext, { dataSeriesName: "This run", dataIsSortedInX: true });
    const previousLossLine = new FastLineRenderableSeries(lossChart.wasmContext, { dataSeries: previousLoss, stroke: "#8A9BB8", strokeThickness: 2 });
    const currentLossLine = new FastLineRenderableSeries(lossChart.wasmContext, { dataSeries: currentLoss, stroke: "#F48420", strokeThickness: 2.5 });
    lossChart.sciChartSurface.renderableSeries.add(previousLossLine, currentLossLine);
    const lossLegend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight });
    lossChart.sciChartSurface.chartModifiers.add(
        lossLegend,
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        ...zoom()
    );

    // --- The controls ---

    // Chart 1: show the ticked functions, and their derivatives when "Derivatives" is ticked
    function onFunctionsChanged() {
        const showDerivatives = ui.input("derivatives").checked;
        const inLegend = [];
        for (const key of Object.keys(functionSeries)) {
            const { curve, derivative } = functionSeries[key];
            const shown = ui.input(key).checked;
            curve.isVisible = shown;
            derivative.isVisible = shown && showDerivatives;
            if (shown) inLegend.push(curve);
            fnCursor.includeSeries(derivative, shown && showDerivatives);
        }
        fnLegend.sciChartLegend?.setRenderableSeriesArray(inLegend); // the dashed derivatives share their function's colour
    }

    // Presets tick a group of functions at once
    const PRESETS = {
        classic: ["sigmoid", "tanh"],
        relu: ["relu", "leakyRelu", "elu"],
        smooth: ["gelu", "swish", "softplus"],
        all: Object.keys(ACTIVATIONS)
    };
    function onPresetChanged() {
        const keys = PRESETS[ui.select("preset").value];
        if (!keys) return;
        for (const key of Object.keys(ACTIVATIONS)) ui.input(key).checked = keys.includes(key);
        onFunctionsChanged();
    }

    // Chart 2: recompute the softmax from the three scores and the temperature
    function onSoftmaxChanged() {
        const logits = ["logitA", "logitB", "logitC"].map((id) => Number(ui.input(id).value) || 0);
        const temperature = Number(ui.input("temperature").value);
        ui.input("temperature").nextElementSibling.textContent = `T = ${temperature.toFixed(1)}`;
        const p = softmax(logits, temperature);
        probabilities.clear();
        probabilities.appendRange([0, 1, 2], p.map((value) => 100 * value));
        const exps = logits.map((z) => Math.exp(z / temperature));
        const sum = exps.reduce((a, b) => a + b, 0);
        ui.softmaxReadout.textContent =
            `e^(z/T): ${exps.map((e) => (e < 1000 ? e.toFixed(2) : e.toExponential(2))).join(", ")} · ` +
            `sum ${sum < 1000 ? sum.toFixed(2) : sum.toExponential(2)} · each probability = e^(z/T) / sum`;
    }

    // Charts 3 and 4: train the network a few epochs per animation frame, until MAX_EPOCHS
    // The learning rate falls from 0.02 to 0.002 over the run, which settles the fit without late loss spikes
    const learningRate = (epoch) => 0.02 * Math.pow(0.1, epoch / MAX_EPOCHS);
    const EPOCHS_PER_FRAME = 10;
    let network;
    let epoch = 0;
    let running = true;
    let lastLoss = NaN;
    let runLabel = "";
    let lossHistory = { x: [], y: [] }; // a copy of this run's loss curve, kept for the "previous run" line

    function drawFit() {
        fitLine.clear();
        fitLine.appendRange(fitX, fitX.map(network.predict));
    }

    function showStatus() {
        const key = ui.select("activation").value;
        const dead = key === "relu" ? ` · dead units ${network.deadUnits(training.x)} of ${ui.select("units").value}` : "";
        ui.status.textContent = `Epoch ${epoch.toLocaleString("en-GB")} · loss (MSE) ${Number.isFinite(lastLoss) ? lastLoss.toFixed(4) : "–"}${dead}`;
        ui.button("train").textContent = running ? "Pause" : epoch >= MAX_EPOCHS ? "Done" : "Train";
    }

    // Start again from the same seeded weights. If the settings changed, keep the old loss curve in grey.
    function resetNetwork() {
        const key = ui.select("activation").value;
        const units = Number(ui.select("units").value);
        const label = `${ACTIVATIONS[key].name}, ${units} units`;
        if (lossHistory.x.length > 0 && label !== runLabel) {
            previousLoss.clear();
            previousLoss.appendRange(lossHistory.x, lossHistory.y);
            previousLoss.dataSeriesName = `Previous: ${runLabel}`;
        }
        lossHistory = { x: [], y: [] };
        currentLoss.clear();
        currentLoss.dataSeriesName = label;
        runLabel = label;
        // Rebuild the legend so it shows the new names, and the previous run only once there is one
        lossLegend.sciChartLegend?.setRenderableSeriesArray(previousLoss.count() > 0 ? [previousLossLine, currentLossLine] : [currentLossLine]);
        network = createNetwork(units, ACTIVATIONS[key]);
        epoch = 0;
        lastLoss = NaN;
        running = true;
        drawFit();
        showStatus();
    }

    function trainFrame() {
        if (lossChart.sciChartSurface.isDeleted) return; // stop when the chart is removed from the page
        if (running) {
            for (let k = 0; k < EPOCHS_PER_FRAME && epoch < MAX_EPOCHS; k++) {
                lastLoss = network.trainStep(training.x, training.y, learningRate(epoch));
                epoch++;
                if (epoch % 5 === 0 || epoch === 1) {
                    currentLoss.append(epoch, lastLoss);
                    lossHistory.x.push(epoch);
                    lossHistory.y.push(lastLoss);
                }
            }
            if (epoch >= MAX_EPOCHS) running = false;
            drawFit();
            showStatus();
        }
        requestAnimationFrame(trainFrame);
    }

    ui.select("preset").addEventListener("change", onPresetChanged);
    for (const key of Object.keys(ACTIVATIONS)) {
        ui.input(key).addEventListener("change", () => {
            ui.select("preset").value = "custom"; // a hand-ticked set
            onFunctionsChanged();
        });
    }
    ui.input("derivatives").addEventListener("change", onFunctionsChanged);
    for (const id of ["logitA", "logitB", "logitC", "temperature"]) ui.input(id).addEventListener("input", onSoftmaxChanged);
    ui.select("activation").addEventListener("change", resetNetwork);
    ui.select("units").addEventListener("change", resetNetwork);
    ui.button("reset").addEventListener("click", resetNetwork);
    ui.button("clearPrevious").addEventListener("click", () => {
        previousLoss.clear();
        lossLegend.sciChartLegend?.setRenderableSeriesArray([currentLossLine]);
    });
    ui.button("train").addEventListener("click", () => {
        if (epoch < MAX_EPOCHS) running = !running;
        showStatus();
    });

    onFunctionsChanged();
    onSoftmaxChanged();
    resetNetwork();
    requestAnimationFrame(trainFrame);
    // #region_A_end
}

activationFunctionsChart("scichart-root");
