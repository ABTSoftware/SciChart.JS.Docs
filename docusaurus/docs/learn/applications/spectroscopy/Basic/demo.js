import * as SciChart from "scichart";

// Sample data: simulated spectra built from typical band positions in published correlation tables
// (see the page's Sources). Each band is [position, height, half-width, label]; positions are approximate,
// and real spectra of these compounds differ in detail. IR and Raman positions are in cm⁻¹, UV-Vis in nm.
const TECHNIQUES = {
    ir: {
        name: "IR",
        xTitle: "Wavenumber (cm⁻¹)",
        from: 400,
        to: 4000,
        step: 1,
        flipped: true, // IR spectra are drawn from 4000 cm⁻¹ on the left down to 400 cm⁻¹ on the right
        tolerance: 40,
        compounds: {
            ethanol: {
                name: "Ethanol (an alcohol)",
                bands: [
                    [3340, 0.75, 170, "O–H stretch (H-bonded)", "gauss"],
                    [2972, 0.62, 12, "C–H stretch"],
                    [2928, 0.35, 12, ""],
                    [2885, 0.3, 12, ""],
                    [1450, 0.3, 12, "C–H bend"],
                    [1380, 0.3, 10, ""],
                    [1330, 0.18, 20, ""],
                    [1088, 0.55, 12, ""],
                    [1048, 0.95, 12, "C–O stretch"],
                    [880, 0.4, 10, ""]
                ]
            },
            acetone: {
                name: "Acetone (a ketone)",
                bands: [
                    [3005, 0.12, 12, ""],
                    [2925, 0.1, 12, "C–H stretch"],
                    [1715, 1.0, 12, "C=O stretch"],
                    [1420, 0.35, 12, "C–H bend"],
                    [1362, 0.6, 10, ""],
                    [1220, 0.7, 12, "C–C–C stretch"],
                    [1092, 0.15, 10, ""],
                    [530, 0.3, 10, ""]
                ]
            },
            aceticAcid: {
                name: "Acetic acid (a carboxylic acid)",
                bands: [
                    [3000, 0.6, 330, "O–H stretch (acid, very broad)", "gauss"],
                    [1712, 1.0, 14, "C=O stretch"],
                    [1412, 0.45, 14, "O–H bend"],
                    [1294, 0.7, 14, "C–O stretch"],
                    [935, 0.4, 30, "O–H out-of-plane bend"],
                    [620, 0.35, 12, ""]
                ]
            }
        }
    },
    raman: {
        name: "Raman",
        xTitle: "Raman shift (cm⁻¹)",
        from: 200,
        to: 3400,
        step: 1,
        flipped: false,
        tolerance: 25,
        compounds: {
            ethanol: {
                name: "Ethanol (an alcohol)",
                bands: [
                    [433, 0.15, 10, ""],
                    [883, 1.0, 7, "C–C–O stretch"],
                    [1052, 0.35, 8, ""],
                    [1096, 0.3, 8, ""],
                    [1454, 0.4, 9, "C–H bend"],
                    [2880, 0.6, 12, ""],
                    [2930, 0.95, 12, "C–H stretch"],
                    [2975, 0.7, 12, ""],
                    [3350, 0.08, 120, "", "gauss"]
                ]
            },
            acetone: {
                name: "Acetone (a ketone)",
                bands: [
                    [530, 0.3, 8, ""],
                    [787, 1.0, 6, "C–C stretch"],
                    [1066, 0.1, 8, ""],
                    [1222, 0.2, 8, ""],
                    [1430, 0.35, 10, "C–H bend"],
                    [1710, 0.3, 9, "C=O stretch"],
                    [2925, 0.95, 10, "C–H stretch"],
                    [3005, 0.3, 12, ""]
                ]
            },
            aceticAcid: {
                name: "Acetic acid (a carboxylic acid)",
                bands: [
                    [448, 0.25, 10, ""],
                    [623, 0.3, 10, ""],
                    [893, 1.0, 8, "C–C stretch"],
                    [1430, 0.35, 10, "C–H bend"],
                    [1665, 0.4, 14, "C=O stretch"],
                    [2944, 0.8, 12, "C–H stretch"]
                ]
            }
        }
    },
    uv: {
        name: "UV-Vis",
        xTitle: "Wavelength (nm)",
        from: 220,
        to: 500,
        step: 0.5,
        flipped: false,
        tolerance: 15,
        // Here the band height is the molar absorptivity ε in L mol⁻¹ cm⁻¹ (about 6,220 for NADH at 340 nm;
        // the 260 nm values are approximate), so absorbance follows the Beer–Lambert law A = ε·l·c
        compounds: {
            nadh: {
                name: "NADH (reduced coenzyme)",
                bands: [
                    [259, 14400, 17, "adenine band", "gauss"],
                    [340, 6220, 27, "NADH band", "gauss"]
                ]
            },
            nad: {
                name: "NAD⁺ (oxidised coenzyme)",
                bands: [[260, 18000, 16, "adenine band", "gauss"]]
            },
            mix: {
                name: "Assay mix (half reduced)",
                bands: [
                    [259.5, 16200, 16.5, "adenine band", "gauss"],
                    [340, 3110, 27, "NADH band", "gauss"]
                ]
            }
        }
    }
};

const NOISE_LEVELS = { low: 0.002, medium: 0.012, high: 0.04 }; // as a fraction of the strongest band
const PATH_LENGTH_CM = 1; // UV-Vis cuvette
const STRAY_LIGHT = 0.001; // 0.1% stray light: the reason measured absorbance flattens out above about 2

function simulateSpectrum(technique, compoundKey, drift, noiseLevel, concentrationMM) {
    let seed = 7;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussianNoise = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const spec = TECHNIQUES[technique];
    const bands = spec.compounds[compoundKey].bands;
    const count = Math.round((spec.to - spec.from) / spec.step) + 1;
    const scale = technique === "uv" ? PATH_LENGTH_CM * concentrationMM * 1e-3 : 1; // A = ε l c
    const x = new Array(count);
    const pure = new Array(count);
    for (let n = 0; n < count; n++) {
        const v = spec.from + n * spec.step;
        x[n] = v;
        let sum = 0;
        for (const [centre, height, width, , shape] of bands) {
            const d = (v - centre) / width;
            sum += shape === "gauss" ? height * Math.exp(-0.5 * d * d) : height / (1 + d * d); // Gaussian or Lorentzian
        }
        pure[n] = sum * scale;
    }
    const strongest = Math.max(...pure);
    const y = pure.map((value, n) => {
        const u = (x[n] - spec.from) / (spec.to - spec.from); // 0 to 1 across the range
        let background = 0;
        if (technique === "ir") background = drift * (0.08 + 0.35 * u * u); // scattering rises towards high wavenumber
        if (technique === "raman") background = drift * 2.5 * Math.exp(-((u - 0.45) ** 2) / 0.18); // fluorescence hump
        if (technique === "uv") background = drift * 0.6 * (spec.from / x[n]) ** 4; // turbidity: scattering ∝ 1/λ⁴
        let measured = value + background + gaussianNoise() * NOISE_LEVELS[noiseLevel] * (technique === "uv" ? 1 : strongest);
        if (technique === "uv") {
            // A real photometer can't read beyond the stray light: A = -log10((T + s) / (1 + s))
            measured = -Math.log10((Math.pow(10, -measured) + STRAY_LIGHT) / (1 + STRAY_LIGHT));
        }
        return measured;
    });
    return { x, y, bands, scale };
}

// The controls and the chart each need an element. This splits the page's div into a control bar and the
// chart; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Technique <select data-id="technique" style="font:inherit">` +
        `<option value="ir">IR</option><option value="raman">Raman</option><option value="uv">UV-Vis</option></select></label>` +
        `<label>Compound <select data-id="compound" style="font:inherit"></select></label>` +
        `<label data-id="ymode-label">IR y-axis <select data-id="ymode" style="font:inherit">` +
        `<option value="transmittance">Transmittance</option><option value="absorbance">Absorbance</option></select></label>` +
        `<label data-id="conc-label">Concentration <input data-id="conc" type="range" min="0.01" max="1" step="0.01" value="0.1" ` +
        `style="vertical-align:middle; width:110px"> <output data-id="conc"></output></label>` +
        `<label>Baseline drift <input data-id="drift" type="range" min="0" max="1" step="0.05" value="0.4" ` +
        `style="vertical-align:middle; width:90px"></label>` +
        `<label><input data-id="correct" type="checkbox" checked> Correct baseline</label>` +
        `<label>Noise <select data-id="noise" style="font:inherit">` +
        `<option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select></label>` +
        `<label>Smoothing <select data-id="smooth" style="font:inherit"><option value="0">Off</option>` +
        `<option value="11">Savitzky–Golay, 11 points</option><option value="41">Savitzky–Golay, 41 points</option>` +
        `<option value="121">Savitzky–Golay, 121 points</option></select></label>` +
        `<label><input data-id="labels" type="checkbox" checked> Peak labels</label>` +
        `<span data-id="summary" aria-live="polite" style="color:#c8d3e8; flex-basis:100%"></span>`;
    const chartDiv = document.createElement("div");
    chartDiv.id = divElementId + "-chart";
    chartDiv.style.cssText = "flex:1; min-height:320px;";
    root.append(bar, chartDiv);
    const get = (selector) => bar.querySelector(selector);
    return {
        chartDiv,
        techniqueSelect: get('select[data-id="technique"]'),
        compoundSelect: get('select[data-id="compound"]'),
        yModeLabel: get('label[data-id="ymode-label"]'),
        yModeSelect: get('select[data-id="ymode"]'),
        concLabel: get('label[data-id="conc-label"]'),
        concInput: get('input[data-id="conc"]'),
        concOutput: get('output[data-id="conc"]'),
        driftInput: get('input[data-id="drift"]'),
        correctCheckbox: get('input[data-id="correct"]'),
        noiseSelect: get('select[data-id="noise"]'),
        smoothSelect: get('select[data-id="smooth"]'),
        labelsCheckbox: get('input[data-id="labels"]'),
        summary: get('span[data-id="summary"]')
    };
}

async function spectroscopyChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Process and plot IR, Raman and UV-Vis spectra with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        FastLineRenderableSeries,
        XyDataSeries,
        TextAnnotation,
        BoxAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Spectrum processing helpers (plain JavaScript, no library needed) ---

    // Savitzky–Golay smoothing: a least-squares quadratic fitted in a moving window of 2m + 1 points
    function savitzkyGolay(values, points) {
        if (points < 3) return values.slice();
        const m = Math.floor(points / 2);
        const norm = (2 * m - 1) * (2 * m + 1) * (2 * m + 3);
        const weights = [];
        for (let i = -m; i <= m; i++) weights.push((3 * (3 * m * m + 3 * m - 1) - 15 * i * i) / norm);
        return values.map((_, n) => {
            let sum = 0;
            for (let i = -m; i <= m; i++) {
                const k = Math.min(values.length - 1, Math.max(0, n + i)); // repeat the end points
                sum += weights[i + m] * values[k];
            }
            return sum;
        });
    }

    // Least-squares polynomial fit of the given degree, evaluated at every point
    function polyFit(u, values, degree) {
        const size = degree + 1;
        const m = Array.from({ length: size }, () => new Array(size + 1).fill(0)); // normal equations
        for (let i = 0; i < u.length; i++) {
            const p = [1];
            for (let d = 1; d < size; d++) p.push(p[d - 1] * u[i]);
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) m[r][c] += p[r] * p[c];
                m[r][size] += p[r] * values[i];
            }
        }
        for (let r = 0; r < size; r++) {
            for (let s = r + 1; s < size; s++) {
                const f = m[s][r] / m[r][r];
                for (let c = r; c <= size; c++) m[s][c] -= f * m[r][c];
            }
        }
        const coef = new Array(size).fill(0);
        for (let r = size - 1; r >= 0; r--) {
            let sum = m[r][size];
            for (let c = r + 1; c < size; c++) sum -= m[r][c] * coef[c];
            coef[r] = sum / m[r][r];
        }
        return u.map((v) => coef.reduceRight((acc, c) => acc * v + c, 0));
    }

    // Baseline for IR and Raman: the iterative "modified polynomial" method. Fit a polynomial, lower every point
    // that sits above the fit, and repeat, so the bands stop pulling the curve up.
    function polynomialBaseline(x, values, degree) {
        const lo = x[0];
        const hi = x[x.length - 1];
        const u = x.map((v) => (2 * (v - lo)) / (hi - lo) - 1);
        let work = values.slice();
        let fit = values;
        for (let iteration = 0; iteration < 60; iteration++) {
            fit = polyFit(u, work, degree);
            work = work.map((v, i) => Math.min(v, fit[i]));
        }
        return fit;
    }

    // Baseline for UV-Vis: turbidity scatters light in proportion to 1/λ⁴. Fit a·(1/λ⁴) where the sample
    // doesn't absorb (above 420 nm here) and extend it across the whole spectrum.
    function scatterBaseline(x, values) {
        let num = 0;
        let den = 0;
        x.forEach((lambda, i) => {
            if (lambda < 420) return;
            const f = 1 / lambda ** 4;
            num += f * values[i];
            den += f * f;
        });
        const a = num / den;
        return x.map((lambda) => a / lambda ** 4);
    }

    // Peak picking: local maxima that stand clear of the valleys either side by a minimum prominence
    function findPeaks(x, values, minProminence, maxPeaks) {
        const peaks = [];
        for (let i = 1; i < values.length - 1; i++) {
            if (!(values[i] > values[i - 1] && values[i] >= values[i + 1])) continue;
            let left = values[i];
            for (let j = i - 1; j >= 0 && values[j] <= values[i]; j--) left = Math.min(left, values[j]);
            let right = values[i];
            for (let j = i + 1; j < values.length && values[j] <= values[i]; j++) right = Math.min(right, values[j]);
            const prominence = values[i] - Math.max(left, right);
            if (prominence >= minProminence) peaks.push({ index: i, position: x[i], height: values[i], prominence });
        }
        return peaks.sort((a, b) => b.prominence - a.prominence).slice(0, maxPeaks);
    }

    // --- The chart ---
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.chartDiv, {
        theme: new SciChartJsNavyTheme()
    });
    const xAxis = new NumericAxis(wasmContext, { labelPrecision: 0, autoRange: EAutoRange.Never });
    const yAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, growBy: new NumberRange(0.05, 0.15) });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const baselineData = new XyDataSeries(wasmContext, { dataSeriesName: "Estimated baseline", dataIsSortedInX: true });
    const spectrumData = new XyDataSeries(wasmContext, { dataSeriesName: "Spectrum", dataIsSortedInX: true });
    const baselineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: baselineData,
        stroke: "#F48420",
        strokeThickness: 2,
        strokeDashArray: [6, 4]
    });
    sciChartSurface.renderableSeries.add(
        baselineSeries,
        new FastLineRenderableSeries(wasmContext, { dataSeries: spectrumData, stroke: "#50C7E0", strokeThickness: 1.5 })
    );
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- The controls ---
    function onTechniqueChanged() {
        const technique = ui.techniqueSelect.value;
        const spec = TECHNIQUES[technique];
        ui.compoundSelect.innerHTML = Object.keys(spec.compounds)
            .map((key) => `<option value="${key}">${spec.compounds[key].name}</option>`)
            .join("");
        ui.yModeLabel.style.display = technique === "ir" ? "" : "none";
        ui.concLabel.style.display = technique === "uv" ? "" : "none";
        xAxis.axisTitle = spec.xTitle;
        xAxis.flippedCoordinates = spec.flipped;
        xAxis.visibleRange = new NumberRange(spec.from, spec.to);
        onControlsChanged();
    }

    function onControlsChanged() {
        const technique = ui.techniqueSelect.value;
        const spec = TECHNIQUES[technique];
        const concentration = Number(ui.concInput.value);
        ui.concOutput.textContent = `${concentration.toFixed(2)} mM`;
        const transmittance = technique === "ir" && ui.yModeSelect.value === "transmittance";

        // 1. Simulate, smooth and correct the spectrum, working in absorbance (IR, UV-Vis) or counts (Raman)
        const { x, y, bands, scale } = simulateSpectrum(
            technique,
            ui.compoundSelect.value,
            Number(ui.driftInput.value),
            ui.noiseSelect.value,
            concentration
        );
        const smoothed = savitzkyGolay(y, Number(ui.smoothSelect.value));
        const baseline = technique === "uv" ? scatterBaseline(x, smoothed) : polynomialBaseline(x, smoothed, technique === "raman" ? 5 : 2);
        const correct = ui.correctCheckbox.checked;
        const processed = correct ? smoothed.map((v, i) => v - baseline[i]) : smoothed;

        // 2. Pick the peaks on the processed spectrum, and match each to the nearest known band
        const strongest = Math.max(...processed) - Math.min(...processed);
        const peaks = findPeaks(x, processed, 0.06 * strongest, 8).map((peak) => {
            const match = bands.find(([centre, , , label]) => label && Math.abs(centre - peak.position) <= spec.tolerance);
            // A UV-Vis band above about 2.5 is flat-topped (saturated), so its apex position means nothing
            return { ...peak, label: match ? match[3] : "", saturated: technique === "uv" && peak.height > 2.5 };
        });

        // 3. Draw. IR transmittance is %T = 100 × 10^(−A), so the bands point down
        const toDisplay = (value) => (transmittance ? 100 * Math.pow(10, -value) : value);
        spectrumData.clear();
        spectrumData.appendRange(x, processed.map(toDisplay));
        baselineData.clear();
        baselineSeries.isVisible = !correct && Number(ui.driftInput.value) > 0;
        if (baselineSeries.isVisible) baselineData.appendRange(x, baseline.map(toDisplay));
        yAxis.axisTitle = technique === "raman" ? "Raman intensity (relative)" : transmittance ? "Transmittance (%)" : "Absorbance";
        yAxis.labelProvider.precision = transmittance ? 0 : technique === "raman" ? 1 : 2;
        yAxis.growBy = transmittance ? new NumberRange(0.25, 0.05) : new NumberRange(0.05, 0.25); // room for the labels (kept in step with the label layout below)

        sciChartSurface.annotations.clear();
        if (technique === "ir") {
            // Shade the fingerprint region, below 1500 cm⁻¹
            sciChartSurface.annotations.add(
                new BoxAnnotation({
                    x1: 400,
                    x2: 1500,
                    y1: 0,
                    y2: 1,
                    yCoordinateMode: ECoordinateMode.Relative,
                    fill: "#FFFFFF14",
                    strokeThickness: 0
                }),
                new TextAnnotation({
                    x1: 1480,
                    y1: 0.02,
                    yCoordinateMode: ECoordinateMode.Relative,
                    text: "Fingerprint region",
                    fontSize: 13,
                    textColor: "#C8D3E8"
                }),
                new TextAnnotation({
                    x1: 3980,
                    y1: 0.02,
                    yCoordinateMode: ECoordinateMode.Relative,
                    text: "Functional-group region",
                    fontSize: 13,
                    textColor: "#C8D3E8"
                })
            );
        }
        if (ui.labelsCheckbox.checked) {
            // Label the most prominent peaks first. Each label is a box in pixels; if it would overlap a label
            // already placed, try it further from its peak, and leave it out after three tries.
            const rect = sciChartSurface.seriesViewRect;
            const width = rect && rect.width > 0 ? rect.width : 800;
            const height = rect && rect.height > 0 ? rect.height : 420;
            const shown = processed.map(toDisplay);
            const lo = Math.min(...shown);
            const hi = Math.max(...shown);
            const [growLow, growHigh] = transmittance ? [0.25, 0.05] : [0.05, 0.25];
            const yMin = lo - growLow * (hi - lo);
            const yMax = hi + growHigh * (hi - lo);
            const toPixelX = (v) => (spec.flipped ? spec.to - v : v - spec.from) * (width / (spec.to - spec.from));
            const toPixelY = (v) => ((yMax - v) / (yMax - yMin)) * height;
            const placed = [];
            for (const peak of peaks) {
                const position = technique === "uv" ? `${peak.position.toFixed(0)} nm` : `${peak.position.toFixed(0)}`;
                const text = peak.saturated ? "saturated: dilute" : peak.label ? `${position} ${peak.label}` : position;
                const halfWidth = text.length * 3.8 + 4; // about 7.6 px per character at 13 px
                const px = toPixelX(peak.position);
                const py = toPixelY(toDisplay(peak.height));
                let row = 0;
                const box = (r) => {
                    const shift = 6 + 17 * r;
                    const top = transmittance ? py + shift : py - shift - 16;
                    return { left: px - halfWidth, right: px + halfWidth, top, bottom: top + 16 };
                };
                const overlaps = (r) => placed.some((p) => {
                    const q = box(r);
                    return q.left < p.right && q.right > p.left && q.top < p.bottom && q.bottom > p.top;
                });
                while (row < 3 && overlaps(row)) row++;
                if (row === 3) continue;
                placed.push(box(row));
                const shift = 6 + 17 * row;
                sciChartSurface.annotations.add(
                    new TextAnnotation({
                        x1: peak.position,
                        y1: toDisplay(peak.height),
                        text,
                        fontSize: 13,
                        textColor: peak.label ? "#FFFFFF" : "#C8D3E8",
                        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                        verticalAnchorPoint: transmittance ? EVerticalAnchorPoint.Top : EVerticalAnchorPoint.Bottom,
                        yCoordShift: transmittance ? shift : -shift
                    })
                );
            }
        }

        // 4. A one-line reading of the spectrum
        const top = peaks[0];
        if (technique === "uv") {
            const at340 = processed[x.indexOf(340)];
            const epsilon340 = (bands.find(([centre]) => centre === 340) || [0, 0])[1];
            // A flat-topped band has hit the photometer's limit, so its maximum can't be located
            const lambdaMax = Math.max(...processed) > 2.5 ? "– (band saturated)" : top ? `${top.position.toFixed(0)} nm` : "–";
            ui.summary.textContent = epsilon340
                ? `λmax ${lambdaMax} · A at 340 nm: measured ${at340.toFixed(3)}, ` +
                  `Beer–Lambert predicts ${(epsilon340 * scale).toFixed(3)} · NADH from A/(ε·l): ` +
                  `${((at340 / (6220 * PATH_LENGTH_CM)) * 1000).toFixed(3)} mM` +
                  (epsilon340 * scale > 1.5 ? " · above about 1.5 the reading flattens: dilute the sample" : "")
                : `λmax ${lambdaMax} · no band at 340 nm: NAD⁺ absorbs only near 260 nm`;
        } else {
            const unit = "cm⁻¹";
            ui.summary.textContent =
                `${peaks.length} peaks picked` +
                (top ? ` · strongest at ${top.position.toFixed(0)} ${unit}${top.label ? ` (${top.label})` : ""}` : "") +
                (!correct && Number(ui.driftInput.value) > 0 ? " · dashed orange line: the estimated baseline, not yet subtracted" : "");
        }
    }

    ui.techniqueSelect.addEventListener("change", onTechniqueChanged);
    for (const control of [ui.compoundSelect, ui.yModeSelect, ui.noiseSelect, ui.smoothSelect, ui.correctCheckbox, ui.labelsCheckbox]) {
        control.addEventListener("change", onControlsChanged);
    }
    ui.concInput.addEventListener("input", onControlsChanged);
    ui.driftInput.addEventListener("input", onControlsChanged);
    onTechniqueChanged();
    // #region_A_end
}

spectroscopyChart("scichart-root");
