import * as SciChart from "scichart";

// The controls, the readout and the chart each need an element. This splits the page's div into a side panel
// (controls and readout) and a square chart; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-wrap:wrap; justify-content:center; align-items:flex-start; gap:8px; background:#22365B;" +
        "color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const panel = document.createElement("div");
    panel.style.cssText =
        "flex:1 1 230px; max-width:300px; display:flex; flex-direction:column; gap:8px; padding:10px 12px; box-sizing:border-box;";
    const row = "display:flex; flex-direction:column; gap:2px;";
    panel.innerHTML =
        `<label style="${row}">Line impedance Z₀ <select data-id="z0" style="font:inherit">` +
        `<option value="50">50 Ω (RF, lab coax)</option><option value="75">75 Ω (video, TV coax)</option></select></label>` +
        `<label style="${row}">Load resistance R <span><input data-id="r" type="range" min="0" max="300" value="140" ` +
        `style="vertical-align:middle; width:150px"> <output data-id="r"></output></span></label>` +
        `<label style="${row}">Load reactance X <span><input data-id="x" type="range" min="-250" max="250" value="50" ` +
        `style="vertical-align:middle; width:150px"> <output data-id="x"></output></span></label>` +
        `<label style="${row}">Line length to the load <span><input data-id="len" type="range" min="0" max="0.5" ` +
        `step="0.005" value="0" style="vertical-align:middle; width:150px"> <output data-id="len"></output></span></label>` +
        `<label style="${row}">Design frequency <select data-id="freq" style="font:inherit">` +
        `<option value="1e8">100 MHz</option><option value="1e9" selected>1 GHz</option>` +
        `<option value="2.4e9">2.4 GHz</option></select></label>` +
        `<label><input data-id="match" type="checkbox" checked> Show L-network match</label>` +
        `<label><input data-id="adm" type="checkbox"> Show admittance grid</label>` +
        `<div data-id="readout" aria-live="polite" style="line-height:1.45; color:#dfe7f5; white-space:pre-line"></div>` +
        `<div data-id="hover" style="line-height:1.45; color:#c8d3e8; white-space:pre-line"></div>`;
    const chartDiv = document.createElement("div");
    chartDiv.id = divElementId + "-smith";
    chartDiv.style.cssText = "flex:none; width:400px; height:400px;";
    root.append(panel, chartDiv);
    // Keep the chart square, as large as the space allows, so circles stay circles
    const fit = () => {
        const panelBeside = panel.offsetParent !== null && panel.offsetTop === chartDiv.offsetTop;
        const width = root.clientWidth - (panelBeside ? panel.offsetWidth + 8 : 0);
        const height = panelBeside || panel.offsetParent === null ? root.clientHeight : root.clientHeight - panel.offsetHeight - 8;
        const size = Math.max(240, Math.floor(Math.min(width, height)));
        chartDiv.style.width = chartDiv.style.height = size + "px";
    };
    new ResizeObserver(fit).observe(root);
    new ResizeObserver(fit).observe(panel);
    fit();
    const get = (selector) => panel.querySelector(selector);
    return {
        chartDiv,
        z0Select: get('select[data-id="z0"]'),
        rInput: get('input[data-id="r"]'),
        rOutput: get('output[data-id="r"]'),
        xInput: get('input[data-id="x"]'),
        xOutput: get('output[data-id="x"]'),
        lenInput: get('input[data-id="len"]'),
        lenOutput: get('output[data-id="len"]'),
        freqSelect: get('select[data-id="freq"]'),
        matchCheckbox: get('input[data-id="match"]'),
        admCheckbox: get('input[data-id="adm"]'),
        readout: get('div[data-id="readout"]'),
        hover: get('div[data-id="hover"]')
    };
}

async function smithChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // An interactive Smith chart drawn with SciChart.js: the grid, a load, its VSWR circle, a length of line
    // and an L-network that matches it
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        TextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        ELineDrawMode,
        SciChartJsNavyTheme,
        CustomChartModifier2D,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        translateFromCanvasToSeriesViewRect
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Complex numbers and the Smith chart mapping (plain JavaScript) ---
    const cx = (re, im) => ({ re, im });
    const add = (a, b) => cx(a.re + b.re, a.im + b.im);
    const sub = (a, b) => cx(a.re - b.re, a.im - b.im);
    const mul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
    const div = (a, b) => {
        const d = b.re * b.re + b.im * b.im;
        return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
    };
    const ONE = cx(1, 0);
    // Normalised impedance z = Z / Z0 to reflection coefficient: gamma = (z - 1) / (z + 1). The chart is the
    // gamma plane, so every point is drawn at (gamma.re, gamma.im).
    const toGamma = (z) => div(sub(z, ONE), add(z, ONE));
    const toZ = (gamma) => div(add(ONE, gamma), sub(ONE, gamma));

    // A list of z values becomes one polyline in the gamma plane; NaN between lines breaks the line
    function appendPath(xs, ys, zs) {
        for (const z of zs) {
            const g = toGamma(z);
            xs.push(g.re);
            ys.push(g.im);
        }
        xs.push(NaN);
        ys.push(NaN);
    }

    // The impedance grid: circles of constant resistance r, and arcs of constant reactance x.
    // Each is the image of a straight line in the z plane; tan() spreads the points from 0 to infinity.
    const R_CIRCLES = [0, 0.2, 0.5, 1, 2, 5];
    const X_ARCS = [0.2, 0.5, 1, 2, 5];
    function smithGrid() {
        const xs = [];
        const ys = [];
        const steps = 400;
        for (const r of R_CIRCLES) {
            const zs = [];
            for (let i = 1; i < steps; i++) zs.push(cx(r, Math.tan(Math.PI * (i / steps - 0.5))));
            appendPath(xs, ys, zs);
        }
        for (const x of [...X_ARCS, ...X_ARCS.map((v) => -v)]) {
            const zs = [];
            for (let i = 0; i < steps; i++) zs.push(cx(Math.tan((Math.PI / 2) * (i / steps)), x));
            appendPath(xs, ys, zs);
        }
        appendPath(xs, ys, [cx(0, 0), cx(1e9, 0)]); // the real axis, x = 0, from short to open
        return { xs, ys };
    }

    // An L-network (one series and one shunt reactance) that turns zIn into Z0. The element next to the load
    // is shunt when R > Z0 and series when R < Z0; of the two solutions, use the one with smaller elements.
    function lMatch(zLoad, z0) {
        const R = zLoad.re * z0;
        const X = zLoad.im * z0;
        const solutions = [];
        for (const sign of [1, -1]) {
            if (R > z0) {
                const b = (X + sign * Math.sqrt(R / z0) * Math.sqrt(R * R + X * X - z0 * R)) / (R * R + X * X);
                solutions.push({ shuntFirst: true, b, x: 1 / b + (X * z0) / R - z0 / (b * R) });
            } else {
                solutions.push({
                    shuntFirst: false,
                    x: sign * Math.sqrt(R * (z0 - R)) - X,
                    b: (sign * Math.sqrt((z0 - R) / R)) / z0
                });
            }
        }
        const size = (s) => Math.abs(s.x / z0) + Math.abs(s.b * z0);
        return size(solutions[0]) <= size(solutions[1]) ? solutions[0] : solutions[1];
    }

    // The path a match takes on the chart: a series element moves z along its constant-r circle; a shunt
    // element moves the admittance y = 1/z along its constant-g circle
    function matchPath(zLoad, match, z0) {
        const steps = 120;
        const seriesStep = (z, dx) => Array.from({ length: steps + 1 }, (_, i) => cx(z.re, z.im + (dx * i) / steps));
        const shuntStep = (z, db) => {
            const y = div(ONE, z);
            return Array.from({ length: steps + 1 }, (_, i) => div(ONE, cx(y.re, y.im + (db * i) / steps)));
        };
        if (match.shuntFirst) {
            const first = shuntStep(zLoad, match.b * z0);
            return [...first, ...seriesStep(first[steps], match.x / z0)];
        }
        const first = seriesStep(zLoad, match.x / z0);
        return [...first, ...shuntStep(first[steps], match.b * z0)];
    }

    // A reactance (ohms) or susceptance (siemens) as a real capacitor or inductor at frequency f
    const formatPart = (value, unit) => {
        const scales = [1e-12, 1e-9, 1e-6];
        const prefixes = ["p", "n", "µ"];
        let i = 0;
        while (i < scales.length - 1 && value >= scales[i + 1]) i++;
        return `${(value / scales[i]).toPrecision(3)} ${prefixes[i]}${unit}`;
    };
    const seriesPart = (x, f) =>
        x > 0 ? `series inductor ${formatPart(x / (2 * Math.PI * f), "H")}` : `series capacitor ${formatPart(-1 / (2 * Math.PI * f * x), "F")}`;
    const shuntPart = (b, f) =>
        b > 0 ? `shunt capacitor ${formatPart(b / (2 * Math.PI * f), "F")}` : `shunt inductor ${formatPart(-1 / (2 * Math.PI * f * b), "H")}`;

    // --- The chart: a square gamma plane from -1.25 to 1.25, with hidden axes ---
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.chartDiv, {
        theme: new SciChartJsNavyTheme(),
        padding: { top: 6, right: 6, bottom: 6, left: 6 }
    });
    const range = new NumberRange(-1.25, 1.25);
    const axisOptions = {
        visibleRange: range,
        isVisible: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorBands: false
    };
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { ...axisOptions }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { ...axisOptions }));

    // Line series draw their points in order, so unsorted x and NaN gaps make any set of curves
    const lineSeries = (name, stroke, strokeThickness, extra = {}) => {
        const dataSeries = new XyDataSeries(wasmContext, { dataSeriesName: name, dataIsSortedInX: false });
        const series = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke,
            strokeThickness,
            drawNaNAs: ELineDrawMode.DiscontinuousLine,
            ...extra
        });
        sciChartSurface.renderableSeries.add(series);
        return { dataSeries, series };
    };

    const grid = smithGrid();
    const admittanceGrid = lineSeries("Admittance grid", "#F48420", 1, { opacity: 0.55, isVisible: false });
    // The admittance grid is the impedance grid turned 180 degrees: y = 1/z, so its gamma is -gamma
    admittanceGrid.dataSeries.appendRange(grid.xs.map((v) => -v), grid.ys.map((v) => -v));
    const impedanceGrid = lineSeries("Impedance grid", "#8FA3C7", 1, { opacity: 0.8 });
    impedanceGrid.dataSeries.appendRange(grid.xs, grid.ys);
    const vswrCircle = lineSeries("VSWR circle", "#F5E663", 2, { strokeDashArray: [8, 5] });
    const lineArc = lineSeries("Along the line", "#50C7E0", 3);
    const matchLine = lineSeries("L-network match", "#67E08A", 3);

    const pointSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Load and input", dataIsSortedInX: false });
    const points = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: pointSeries,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 14, height: 14, fill: "#FF6B6B", stroke: "#FFFFFF", strokeThickness: 2 })
    });
    sciChartSurface.renderableSeries.add(points);

    // Grid labels: r on the real axis, x around the rim, and the three special points
    const label = (x, y, text, color = "#C8D3E8", fontSize = 12) =>
        sciChartSurface.annotations.add(
            new TextAnnotation({
                x1: x,
                y1: y,
                text,
                textColor: color,
                fontSize,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Bottom
            })
        );
    for (const r of R_CIRCLES.slice(1)) label((r - 1) / (r + 1), 0.01, String(r));
    for (const x of [...X_ARCS, ...X_ARCS.map((v) => -v)]) {
        const g = toGamma(cx(0, x));
        label(1.1 * g.re, 1.1 * g.im - 0.03, (x > 0 ? "+j" : "−j") + Math.abs(x));
    }
    label(-1.13, 0.04, "Short", "#FFFFFF", 13);
    label(1.13, 0.04, "Open", "#FFFFFF", 13);
    label(0, -0.09, "Matched", "#FFFFFF", 12);

    const legend = new LegendModifier({ showCheckboxes: true });
    sciChartSurface.chartModifiers.add(legend, new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
    legend.includeSeries(impedanceGrid.series, false);
    legend.includeSeries(admittanceGrid.series, false);

    // A small modifier that reads the chart under the mouse: pixel -> gamma -> z, shown in the side panel
    class SmithReadoutModifier extends CustomChartModifier2D {
        modifierMouseMove(args) {
            super.modifierMouseMove(args);
            const surface = this.parentSurface;
            const p = translateFromCanvasToSeriesViewRect(args.mousePoint, surface.seriesViewRect);
            if (!p) return;
            const g = cx(
                surface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(p.x),
                surface.yAxes.get(0).getCurrentCoordinateCalculator().getDataValue(p.y)
            );
            const mag = Math.hypot(g.re, g.im);
            if (mag >= 1) {
                ui.hover.textContent = "Under the mouse: outside the chart (|Γ| > 1)";
                return;
            }
            const z = toZ(g);
            ui.hover.textContent =
                `Under the mouse: z = ${z.re.toFixed(2)} ${z.im < -0.005 ? "−" : "+"} j${Math.abs(z.im).toFixed(2)}` +
                `, |Γ| = ${mag.toFixed(2)}, VSWR = ${((1 + mag) / (1 - mag)).toFixed(2)}`;
        }
        modifierMouseLeave(args) {
            super.modifierMouseLeave(args);
            ui.hover.textContent = "";
        }
    }
    sciChartSurface.chartModifiers.add(new SmithReadoutModifier());

    // --- The controls ---
    const formatZ = (re, im, unit = "", digits = 1) =>
        `${re.toFixed(digits)} ${im < -0.5 * 10 ** -digits ? "−" : "+"} j${Math.abs(im).toFixed(digits)}${unit}`;

    function update() {
        const z0 = Number(ui.z0Select.value);
        const R = Math.round(10 ** (Number(ui.rInput.value) / 100)); // 1 to 1,000 ohms on a log scale
        const X = Number(ui.xInput.value);
        const lengthWl = Number(ui.lenInput.value);
        const f = Number(ui.freqSelect.value);
        ui.rOutput.textContent = `${R} Ω`;
        ui.xOutput.textContent = `${X > 0 ? "+" : ""}${X} Ω`;
        ui.lenOutput.textContent = `${lengthWl.toFixed(3)} λ`;

        // The load, its reflection coefficient, and the input after a length of lossless line:
        // gamma_in = gamma_load * e^(-j 4 pi d / lambda), a clockwise turn of 720 degrees per wavelength
        const zLoad = cx(R / z0, X / z0);
        const gLoad = toGamma(zLoad);
        const turn = -4 * Math.PI * lengthWl;
        const gIn = mul(gLoad, cx(Math.cos(turn), Math.sin(turn)));
        const zIn = toZ(gIn);
        const mag = Math.hypot(gLoad.re, gLoad.im);
        const vswr = (1 + mag) / (1 - mag);
        const angleDeg = (Math.atan2(gIn.im, gIn.re) * 180) / Math.PI;

        pointSeries.clear();
        pointSeries.append(gLoad.re, gLoad.im);
        if (lengthWl > 0) pointSeries.append(gIn.re, gIn.im);

        vswrCircle.dataSeries.clear();
        lineArc.dataSeries.clear();
        for (let i = 0; i <= 360; i++) {
            const a = (2 * Math.PI * i) / 360;
            vswrCircle.dataSeries.append(mag * Math.cos(a), mag * Math.sin(a));
            const t = (turn * i) / 360;
            const g = mul(gLoad, cx(Math.cos(t), Math.sin(t)));
            if (lengthWl > 0) lineArc.dataSeries.append(g.re, g.im);
        }

        // Match the impedance seen at the input of the line
        matchLine.dataSeries.clear();
        let matchText = "Already matched: no network needed";
        if (mag > 0.005) {
            const match = lMatch(zIn, z0);
            const path = matchPath(zIn, match, z0).map(toGamma);
            matchLine.dataSeries.appendRange(path.map((g) => g.re), path.map((g) => g.im));
            // An element of (almost) zero size isn't needed, e.g. no shunt part when R = Z0
            const series = Math.abs(match.x / z0) > 1e-6 ? seriesPart(match.x, f) : "none";
            const shunt = Math.abs(match.b * z0) > 1e-6 ? shuntPart(match.b, f) : "none";
            const [atLoad, toward] = match.shuntFirst ? [shunt, series] : [series, shunt];
            matchText = `Match at ${f / 1e9} GHz:\n  load side: ${atLoad}\n  source side: ${toward}`;
        }
        matchLine.series.isVisible = ui.matchCheckbox.checked;
        admittanceGrid.series.isVisible = ui.admCheckbox.checked;

        const returnLoss = -20 * Math.log10(mag);
        const mismatchLoss = -10 * Math.log10(1 - mag * mag);
        ui.readout.textContent =
            `Load Z = ${formatZ(R, X, " Ω", 0)}\n` +
            `z = Z/Z₀ = ${formatZ(zLoad.re, zLoad.im, "", 2)}\n` +
            (lengthWl > 0 ? `At the line input: z = ${formatZ(zIn.re, zIn.im, "", 2)}\n` : "") +
            `Γ = ${mag.toFixed(3)} ∠ ${angleDeg.toFixed(1)}°\n` +
            `VSWR = ${mag < 0.999 ? vswr.toFixed(2) : "∞"}\n` +
            `Return loss = ${mag > 1e-6 ? returnLoss.toFixed(2) + " dB" : "∞"}\n` +
            `Mismatch loss = ${mag < 0.999 ? mismatchLoss.toFixed(2) + " dB" : "∞"} (${(100 * mag * mag).toFixed(1)}% of power reflected)\n` +
            (ui.matchCheckbox.checked ? matchText : "");
    }

    for (const input of [ui.rInput, ui.xInput, ui.lenInput]) input.addEventListener("input", update);
    for (const control of [ui.z0Select, ui.freqSelect, ui.matchCheckbox, ui.admCheckbox]) control.addEventListener("change", update);
    update();
    // #region_A_end
}

smithChart("scichart-root");
