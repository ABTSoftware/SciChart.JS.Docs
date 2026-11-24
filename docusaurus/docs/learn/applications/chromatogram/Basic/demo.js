import * as SciChart from "scichart";

const RUN_MINUTES = 12; // length of the run
const DT = 0.002; // minutes between detector readings (0.12 s, about 8 readings per second)
const DEAD_TIME = 1.2; // minutes: t0, when an unretained compound reaches the detector
const INTEGRATE_FROM = 1.5; // minutes: integration is switched off before this, to skip the solvent front

// Five sample compounds. Each one's retention factor k depends on the column temperature through
// ln k = lnK30 - slope * (1000 / T - 1000 / 303.15), with T in kelvin: a straight van 't Hoff line.
// The slopes differ, so heating the column moves the peaks by different amounts. B and C swap order near 45 °C.
const COMPOUNDS = [
    { name: "A", lnK30: Math.log(0.9), slope: 1.365, area: 300 },
    { name: "B", lnK30: Math.log(2.2), slope: 0.868, area: 450 },
    { name: "C", lnK30: Math.log(2.6), slope: 1.966, area: 380 },
    { name: "D", lnK30: Math.log(4.5), slope: 1.847, area: 600 },
    { name: "E", lnK30: Math.log(7.0), slope: 2.239, area: 520 }
]; // area in mAU·s: the true amount of each compound the detector sees

const NOISE_LEVELS = { low: 0.05, medium: 0.4, high: 1.5 }; // mAU, standard deviation of the detector noise

// Sample data: a simulated HPLC run with a UV detector. Each compound is a Gaussian peak at its retention time
// tR = t0 (1 + k), with a width set by the column's plate number N (sigma = tR / sqrt N). A tailing or fronting
// peak is the Gaussian passed through an exponential decay (an exponentially modified Gaussian).
// On top: a slowly drifting baseline, a small disturbance at t0 and noise from a seeded random generator.
function simulateChromatogram(temperatureC, plates, shape, noiseLevel) {
    let seed = 11;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussianNoise = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const count = Math.round(RUN_MINUTES / DT) + 1;
    const x = new Array(count);
    const y = new Array(count);
    for (let n = 0; n < count; n++) {
        const t = n * DT;
        x[n] = t;
        const drift = 1.5 + 0.35 * t + 0.02 * t * t; // mAU
        const front = -6 * ((t - DEAD_TIME) / 0.02) * Math.exp(-0.5 * ((t - DEAD_TIME) / 0.02) ** 2); // solvent front
        y[n] = drift + front + gaussianNoise() * NOISE_LEVELS[noiseLevel];
    }
    const inverseT = 1000 / (temperatureC + 273.15) - 1000 / 303.15;
    const truth = COMPOUNDS.map((compound) => {
        const k = Math.exp(compound.lnK30 + compound.slope * inverseT);
        const tR = DEAD_TIME * (1 + k);
        const sigma = tR / Math.sqrt(plates); // minutes
        const peak = new Array(count);
        for (let n = 0; n < count; n++) {
            const z = (x[n] - tR) / sigma;
            peak[n] = (compound.area / 60 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z); // mAU
        }
        if (shape !== "symmetric") {
            // Exponential decay with time constant tau, run forwards (tailing) or backwards (fronting)
            const decay = Math.exp(-DT / (1.2 * sigma));
            const order = shape === "tailing" ? [...peak.keys()] : [...peak.keys()].reverse();
            let state = 0;
            for (const n of order) peak[n] = state = state * decay + peak[n] * (1 - decay);
        }
        for (let n = 0; n < count; n++) y[n] += peak[n];
        return { name: compound.name, k, tR };
    });
    return { x, y, truth };
}

// The controls and the chart each need an element. This splits the page's div into a control bar, the chart
// and a peak table; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Column temperature <input data-id="temperature" type="range" min="25" max="60" step="0.5" value="30" ` +
        `style="vertical-align:middle; width:120px"> <output data-id="temperature"></output></label>` +
        `<label>Column efficiency <input data-id="plates" type="range" min="0" max="100" value="60" ` +
        `style="vertical-align:middle; width:120px"> <output data-id="plates"></output></label>` +
        `<label>Peak shape <select data-id="shape" style="font:inherit">` +
        `<option value="symmetric">Symmetric</option><option value="tailing">Tailing</option>` +
        `<option value="fronting">Fronting</option></select></label>` +
        `<label>Noise <select data-id="noise" style="font:inherit">` +
        `<option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>` +
        `<label><input data-id="integrate" type="checkbox" checked> Integrate peaks</label>` +
        `<span data-id="summary" aria-live="polite" style="color:#c8d3e8"></span>`;
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap;";
    const chartDiv = document.createElement("div");
    chartDiv.id = divElementId + "-chart";
    chartDiv.style.cssText = "flex:1 1 480px; min-height:300px;";
    const table = document.createElement("div");
    table.style.cssText = "flex:0 1 330px; overflow:auto; padding:6px 10px; color:#ffffff; font-size:13px;" + font;
    body.append(chartDiv, table);
    root.append(bar, body);
    const get = (selector) => bar.querySelector(selector);
    return {
        chartDiv,
        table,
        temperatureInput: get('input[data-id="temperature"]'),
        temperatureOutput: get('output[data-id="temperature"]'),
        platesInput: get('input[data-id="plates"]'),
        platesOutput: get('output[data-id="plates"]'),
        shapeSelect: get('select[data-id="shape"]'),
        noiseSelect: get('select[data-id="noise"]'),
        integrateCheckbox: get('input[data-id="integrate"]'),
        summary: get('span[data-id="summary"]')
    };
}

async function chromatogramChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Find, label and integrate the peaks in a chromatogram, and chart it with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        FastLineRenderableSeries,
        FastBandRenderableSeries,
        XyDataSeries,
        XyyDataSeries,
        TextAnnotation,
        VerticalLineAnnotation,
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

    // --- Peak integration helpers (plain JavaScript, no library needed) ---

    function movingAverage(values, window) {
        const half = Math.floor(window / 2);
        const out = new Array(values.length);
        let sum = 0;
        let n = 0;
        for (let i = -half; i < values.length; i++) {
            if (i + half < values.length) { sum += values[i + half]; n++; }
            if (i - half - 1 >= 0) { sum -= values[i - half - 1]; n--; }
            if (i >= 0) out[i] = sum / n;
        }
        return out;
    }

    // Detector noise (standard deviation) from the median absolute difference between neighbouring readings
    function estimateNoise(values) {
        const diffs = [];
        for (let i = 1; i < values.length; i++) diffs.push(Math.abs(values[i] - values[i - 1]));
        diffs.sort((a, b) => a - b);
        return diffs[Math.floor(diffs.length / 2)] / (0.6745 * Math.SQRT2);
    }

    // A rough baseline for finding peaks: fit a cubic, lower every point that is above the fit, and repeat
    // (the "modified polynomial" method), so the peaks stop pulling the curve up
    function estimateBaseline(x, values) {
        const lo = x[0];
        const hi = x[x.length - 1];
        const u = x.map((t) => (2 * (t - lo)) / (hi - lo) - 1);
        let work = values.slice();
        let fit = values.slice();
        for (let iteration = 0; iteration < 40; iteration++) {
            const m = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]; // normal equations
            for (let i = 0; i < u.length; i++) {
                const p = [1, u[i], u[i] ** 2, u[i] ** 3];
                for (let r = 0; r < 4; r++) {
                    for (let c = 0; c < 4; c++) m[r][c] += p[r] * p[c];
                    m[r][4] += p[r] * work[i];
                }
            }
            for (let r = 0; r < 4; r++) {
                for (let s = r + 1; s < 4; s++) {
                    const f = m[s][r] / m[r][r];
                    for (let c = r; c < 5; c++) m[s][c] -= f * m[r][c];
                }
            }
            const coef = [0, 0, 0, 0];
            for (let r = 3; r >= 0; r--) {
                let sum = m[r][4];
                for (let c = r + 1; c < 4; c++) sum -= m[r][c] * coef[c];
                coef[r] = sum / m[r][r];
            }
            fit = u.map((v) => coef[0] + coef[1] * v + coef[2] * v * v + coef[3] * v * v * v);
            work = work.map((v, i) => Math.min(v, fit[i]));
        }
        return fit;
    }

    // Find the peaks, split overlapping ones at the valley between them (a perpendicular drop), draw a straight
    // baseline under each group, and measure retention time, height, area and width at half height.
    function integratePeaks(x, y, startTime) {
        const dtSeconds = (x[1] - x[0]) * 60;
        const smooth = movingAverage(y, 9);
        const noise = estimateNoise(y);
        const baseline = estimateBaseline(x, smooth);
        const above = smooth.map((v, i) => v - baseline[i]);
        const first = x.findIndex((t) => t >= startTime);

        // 1. Groups of readings clearly above the baseline, widened until they return to it
        const groups = [];
        const threshold = Math.max(6 * noise, 0.5);
        for (let i = first; i < y.length; i++) {
            if (above[i] <= threshold) continue;
            let start = i;
            let end = i;
            while (end + 1 < y.length && above[end + 1] > threshold) end++;
            while (start > first && above[start - 1] > 2 * noise) start--;
            while (end + 1 < y.length && above[end + 1] > 2 * noise) end++;
            const last = groups[groups.length - 1];
            if (last && start <= last.end) last.end = end;
            else groups.push({ start, end });
            i = end;
        }

        // 2. Apexes in each group: local maxima that stand out from the valleys either side
        const peaks = [];
        for (const group of groups) {
            const apexes = [];
            for (let i = group.start + 1; i < group.end; i++) {
                if (!(smooth[i] > smooth[i - 1] && smooth[i] >= smooth[i + 1])) continue;
                let left = smooth[i];
                for (let j = i - 1; j >= group.start && smooth[j] <= smooth[i]; j--) left = Math.min(left, smooth[j]);
                let right = smooth[i];
                for (let j = i + 1; j <= group.end && smooth[j] <= smooth[i]; j++) right = Math.min(right, smooth[j]);
                if (smooth[i] - Math.max(left, right) > Math.max(5 * noise, 0.3)) apexes.push(i);
            }
            if (apexes.length === 0) continue;
            // The baseline under the group: a straight line from its start to its end (valley to valley)
            const y0 = smooth[group.start];
            const slope = (smooth[group.end] - y0) / (x[group.end] - x[group.start]);
            const line = (i) => y0 + slope * (x[i] - x[group.start]);
            // Split the group at the lowest point between neighbouring apexes
            const cuts = [group.start];
            for (let a = 1; a < apexes.length; a++) {
                let valley = apexes[a - 1];
                for (let j = apexes[a - 1]; j <= apexes[a]; j++) if (smooth[j] < smooth[valley]) valley = j;
                cuts.push(valley);
            }
            cuts.push(group.end);
            apexes.forEach((apex, a) => {
                const from = cuts[a];
                const to = cuts[a + 1];
                let area = 0;
                for (let i = from; i < to; i++) area += ((y[i] - line(i) + y[i + 1] - line(i + 1)) / 2) * dtSeconds;
                const height = smooth[apex] - line(apex);
                // Refine the apex time with a parabola through the three highest readings
                const [p, c, n] = [smooth[apex - 1], smooth[apex], smooth[apex + 1]];
                const shift = (p - n) / (2 * (p - 2 * c + n)) || 0;
                const crossing = (level, direction) => {
                    for (let i = apex; i > from && i < to; i += direction) {
                        const v0 = smooth[i] - line(i);
                        const v1 = smooth[i + direction] - line(i + direction);
                        if (v1 < level) return x[i] + ((v0 - level) / (v0 - v1)) * (x[i + direction] - x[i]);
                    }
                    return NaN; // the peak doesn't fall that low before the next one starts
                };
                const halfWidth = crossing(height / 2, 1) - crossing(height / 2, -1);
                peaks.push({ from, to, line, apex, apexY: smooth[apex], retentionTime: x[apex] + shift * (x[1] - x[0]), height, area, halfWidth });
            });
        }
        // Resolution to the next peak, from the widths at half height: Rs = 1.18 (tR2 - tR1) / (w0.5,1 + w0.5,2)
        const totalArea = peaks.reduce((sum, peak) => sum + peak.area, 0);
        peaks.forEach((peak, i) => {
            const next = peaks[i + 1];
            peak.percentArea = (100 * peak.area) / totalArea;
            peak.resolution = next ? (1.18 * (next.retentionTime - peak.retentionTime)) / (peak.halfWidth + next.halfWidth) : NaN;
        });
        return { peaks, noise };
    }

    // --- The chart: detector signal against time ---
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.chartDiv, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Retention time (min)",
            visibleRange: new NumberRange(0, RUN_MINUTES),
            labelPrecision: 1
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Detector response (mAU)",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.05, 0.15),
            labelPrecision: 0
        })
    );

    const PEAK_FILLS = ["#F48420", "#AE418D", "#67BDAF", "#F5E663", "#EC0F6C", "#50C7E0"];
    const MAX_SHADED_PEAKS = 8;
    // One band series per peak shades the area between the signal and the integration baseline
    const shades = [];
    for (let i = 0; i < MAX_SHADED_PEAKS; i++) {
        const band = new FastBandRenderableSeries(wasmContext, {
            dataSeries: new XyyDataSeries(wasmContext, { dataSeriesName: `Peak ${i + 1}` }),
            fill: PEAK_FILLS[i % PEAK_FILLS.length] + "88",
            fillY1: PEAK_FILLS[i % PEAK_FILLS.length] + "88",
            stroke: "#00000000",
            strokeY1: "#FFFFFFAA",
            strokeThickness: 1,
            isVisible: false
        });
        shades.push(band);
        sciChartSurface.renderableSeries.add(band);
    }
    const signal = new XyDataSeries(wasmContext, {
        dataSeriesName: "Detector signal",
        dataIsSortedInX: true,
        dataEvenlySpacedInX: true
    });
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, { dataSeries: signal, stroke: "#E8F1FF", strokeThickness: 1.5 })
    );
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // --- The controls ---
    function onControlsChanged() {
        const temperature = Number(ui.temperatureInput.value);
        const plates = Math.round(1000 * Math.pow(30, Number(ui.platesInput.value) / 100) / 100) * 100; // 1,000 to 30,000, log scale
        ui.temperatureOutput.textContent = `${temperature.toFixed(1)} °C`;
        ui.platesOutput.textContent = `N = ${plates.toLocaleString("en-GB")}`;

        const { x, y, truth } = simulateChromatogram(temperature, plates, ui.shapeSelect.value, ui.noiseSelect.value);
        signal.clear();
        signal.appendRange(x, y);
        const { peaks } = integratePeaks(x, y, INTEGRATE_FROM);
        const integrate = ui.integrateCheckbox.checked;

        // Shade each peak's area down to its baseline
        shades.forEach((band, i) => {
            const peak = peaks[i];
            band.isVisible = integrate && !!peak;
            if (!band.isVisible) return;
            const xs = [];
            const ys = [];
            const baselineYs = [];
            for (let j = peak.from; j <= peak.to; j++) {
                xs.push(x[j]);
                ys.push(y[j]);
                baselineYs.push(peak.line(j));
            }
            band.dataSeries.clear();
            band.dataSeries.appendRange(xs, ys, baselineYs);
        });

        // Label the injection, the dead time t0 and each peak's retention time
        sciChartSurface.annotations.clear();
        for (const { time, label, top } of [{ time: 0, label: "Injection", top: 0.08 }, { time: DEAD_TIME, label: "t0 (dead time)", top: 0.02 }]) {
            sciChartSurface.annotations.add(
                new VerticalLineAnnotation({ x1: time, stroke: "#C8D3E8", strokeDashArray: [4, 4] }),
                new TextAnnotation({
                    x1: time,
                    y1: top,
                    yCoordinateMode: ECoordinateMode.Relative,
                    text: label,
                    fontSize: 12,
                    textColor: "#C8D3E8",
                    xCoordShift: 4
                })
            );
        }
        for (const peak of peaks) {
            sciChartSurface.annotations.add(
                new TextAnnotation({
                    x1: peak.retentionTime,
                    y1: peak.apexY,
                    text: peak.retentionTime.toFixed(2),
                    fontSize: 13,
                    textColor: "#FFFFFF",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                    yCoordShift: -6
                })
            );
        }

        // The peak table, and a one-line summary
        const cell = "padding:2px 6px; text-align:right; border-bottom:1px solid #3a5480;";
        const fmt = (v, digits) => (Number.isFinite(v) ? v.toFixed(digits) : "–");
        ui.table.style.display = integrate ? "block" : "none";
        ui.table.innerHTML =
            `<table style="border-collapse:collapse; width:100%"><caption style="text-align:left; padding-bottom:4px">` +
            `Peak table</caption><thead><tr>` +
            ["Peak", "tR (min)", "Height (mAU)", "Area (mAU·s)", "Area %", "Rs to next"]
                .map((h) => `<th scope="col" style="${cell}">${h}</th>`).join("") +
            `</tr></thead><tbody>` +
            peaks.map((p, i) =>
                `<tr><td style="${cell}">${i + 1}</td><td style="${cell}">${fmt(p.retentionTime, 2)}</td>` +
                `<td style="${cell}">${fmt(p.height, 1)}</td><td style="${cell}">${fmt(p.area, 0)}</td>` +
                `<td style="${cell}">${fmt(p.percentArea, 1)}</td><td style="${cell}">${fmt(p.resolution, 2)}</td></tr>`
            ).join("") +
            `</tbody></table>`;
        // The simulation knows the true retention times, so it can say why a compound has no peak of its own
        const owner = truth.map((c) => peaks.findIndex((p) => c.tR >= x[p.from] && c.tR <= x[p.to]));
        const coeluting = owner.some((o, i) => o >= 0 && owner.indexOf(o) !== i);
        const lost = owner.includes(-1);
        const criticalRs = Math.min(...peaks.map((p) => p.resolution).filter(Number.isFinite));
        ui.summary.textContent =
            `${truth.length} compounds injected, ${peaks.length} peaks found` +
            (Number.isFinite(criticalRs) ? ` · lowest Rs ${criticalRs.toFixed(2)}` : "") +
            (coeluting ? " · co-elution: one peak hides two compounds" : "") +
            (lost ? " · a peak is lost in the noise" : "");
    }

    ui.temperatureInput.addEventListener("input", onControlsChanged);
    ui.platesInput.addEventListener("input", onControlsChanged);
    ui.shapeSelect.addEventListener("change", onControlsChanged);
    ui.noiseSelect.addEventListener("change", onControlsChanged);
    ui.integrateCheckbox.addEventListener("change", onControlsChanged);
    onControlsChanged();
    // #region_A_end
}

chromatogramChart("scichart-root");
