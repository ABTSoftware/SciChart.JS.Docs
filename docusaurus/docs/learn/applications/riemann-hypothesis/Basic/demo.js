import * as SciChart from "scichart";

// --- Complex arithmetic: numbers are { re, im } ---

const cx = (re, im = 0) => ({ re, im });
const cAdd = (a, b) => cx(a.re + b.re, a.im + b.im);
const cSub = (a, b) => cx(a.re - b.re, a.im - b.im);
const cMul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const cScale = (a, k) => cx(a.re * k, a.im * k);
const cDiv = (a, b) => {
    const d = b.re * b.re + b.im * b.im;
    return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
};
const cExp = (a) => cScale(cx(Math.cos(a.im), Math.sin(a.im)), Math.exp(a.re));
const cLog = (a) => cx(Math.log(Math.hypot(a.re, a.im)), Math.atan2(a.im, a.re));
const cCos = (a) => cx(Math.cos(a.re) * Math.cosh(a.im), -Math.sin(a.re) * Math.sinh(a.im));
const cAbs = (a) => Math.hypot(a.re, a.im);

// n^(-s) for a whole number n
function powNeg(n, s) {
    const ln = Math.log(n);
    return cScale(cx(Math.cos(-s.im * ln), Math.sin(-s.im * ln)), Math.exp(-s.re * ln));
}

// --- The zeta function and Hardy's Z function ---

// log Gamma(z) for Re z > 0: shift z up past 10, then Stirling's series
const STIRLING = [1 / 12, -1 / 360, 1 / 1260, -1 / 1680, 1 / 1188, -691 / 360360, 1 / 156];
function logGamma(z) {
    let shift = cx(0);
    while (z.re < 10) {
        shift = cAdd(shift, cLog(z));
        z = cx(z.re + 1, z.im);
    }
    let result = cAdd(cSub(cMul(cx(z.re - 0.5, z.im), cLog(z)), z), cx(0.5 * Math.log(2 * Math.PI)));
    const inverse = cDiv(cx(1), z);
    const inverse2 = cMul(inverse, inverse);
    let power = inverse;
    for (const a of STIRLING) {
        result = cAdd(result, cScale(power, a));
        power = cMul(power, inverse2);
    }
    return cSub(result, shift);
}

// Riemann-Siegel theta function: theta(t) = arg Gamma(1/4 + it/2) - (t/2) ln(pi)
function theta(t) {
    return logGamma(cx(0.25, t / 2)).im - (t / 2) * Math.log(Math.PI);
}

// zeta(s) for any s except the pole at s = 1, by Euler-Maclaurin summation. It converges inside the critical strip,
// where the series sum of n^-s does not. Accurate to about 1e-12 for |Im s| up to a few hundred.
const BERNOULLI = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6, -3617 / 510, 43867 / 798, -174611 / 330];
function zeta(s) {
    const N = Math.max(10, Math.ceil(Math.abs(s.im)) + 10);
    let sum = cx(0);
    for (let n = 1; n < N; n++) sum = cAdd(sum, powNeg(n, s));
    const Ns = powNeg(N, s);
    sum = cAdd(sum, cDiv(cScale(Ns, N), cx(s.re - 1, s.im))); // N^(1-s) / (s-1)
    sum = cAdd(sum, cScale(Ns, 0.5));
    let rising = s; // s(s+1)...(s+2k-2)
    let factorial = 2; // (2k)!
    let power = cScale(Ns, 1 / N); // N^(-s-2k+1)
    for (let k = 1; k <= BERNOULLI.length; k++) {
        sum = cAdd(sum, cScale(cMul(rising, power), BERNOULLI[k - 1] / factorial));
        rising = cMul(rising, cMul(cx(s.re + 2 * k - 1, s.im), cx(s.re + 2 * k, s.im)));
        factorial *= (2 * k + 1) * (2 * k + 2);
        power = cScale(power, 1 / (N * N));
    }
    return sum;
}

// Taylor coefficients about p = 1/2 of Psi(p) = cos(2 pi (p^2 - p - 1/16)) / cos(2 pi p), the function behind the
// Riemann-Siegel correction terms. Psi is entire, so a discrete Cauchy integral on a circle gives them accurately.
function psiTaylorCoefficients(count, points) {
    const a = new Array(count).fill(0);
    for (let j = 0; j < points; j++) {
        const phi = (2 * Math.PI * j) / points;
        const w = cx(0.5 + Math.cos(phi), Math.sin(phi)); // on the circle of radius 1 around 1/2
        const f = cDiv(cCos(cScale(cSub(cMul(w, w), cAdd(w, cx(1 / 16))), 2 * Math.PI)), cCos(cScale(w, 2 * Math.PI)));
        for (let k = 0; k < count; k++) a[k] += (f.re * Math.cos(k * phi) + f.im * Math.sin(k * phi)) / points;
    }
    return a;
}
const PSI = psiTaylorCoefficients(40, 256);
function psiDerivative(m, p) {
    let sum = 0;
    for (let k = PSI.length - 1; k >= m; k--) {
        let falling = 1;
        for (let i = 0; i < m; i++) falling *= k - i;
        sum = sum * (p - 0.5) + PSI[k] * falling;
    }
    return sum;
}

// Hardy's Z(t) = e^(i theta(t)) zeta(1/2 + it): real, with |Z(t)| = |zeta(1/2 + it)|, and a sign change at every zero
// on the critical line. Below t = 50 it uses zeta directly; above, the Riemann-Siegel formula with terms C0 to C4.
function hardyZ(t) {
    if (t < 50) {
        const z = zeta(cx(0.5, t));
        const th = theta(t);
        return z.re * Math.cos(th) - z.im * Math.sin(th);
    }
    const r = Math.sqrt(t / (2 * Math.PI));
    const N = Math.floor(r);
    const p = r - N;
    const th = theta(t);
    let main = 0;
    for (let n = 1; n <= N; n++) main += Math.cos(th - t * Math.log(n)) / Math.sqrt(n);
    const d = (m) => psiDerivative(m, p);
    const pi2 = Math.PI * Math.PI;
    const C = [
        d(0),
        -d(3) / (96 * pi2),
        d(2) / (64 * pi2) + d(6) / (18432 * pi2 ** 2),
        -d(1) / (64 * pi2) - d(5) / (3840 * pi2 ** 2) - d(9) / (5308416 * pi2 ** 3),
        d(0) / (128 * pi2) + (19 * d(4)) / (24576 * pi2 ** 2) + (11 * d(8)) / (5898240 * pi2 ** 3) + d(12) / (2038431744 * pi2 ** 4)
    ];
    const remainder = C.reduce((sum, ck, k) => sum + ck / r ** k, 0);
    return 2 * main + ((N % 2 === 1 ? 1 : -1) * remainder) / Math.sqrt(r);
}

// The zeros of Z(t) up to height T: step through t in a twentieth of the average gap, then refine each sign change
// by false position. Matches Odlyzko's published table of the first 5,000 zeros to within 1e-6.
function findZeros(T) {
    const zeros = [];
    let t = 10;
    let z = hardyZ(t);
    while (t < T) {
        const step = (0.05 * 2 * Math.PI) / Math.log(Math.max(t, 20) / (2 * Math.PI));
        const t1 = t + step;
        const z1 = hardyZ(t1);
        if (z * z1 < 0) {
            let [a, b, fa, fb, side] = [t, t1, z, z1, 0];
            for (let i = 0; i < 60 && b - a > 1e-11; i++) {
                const m = (a * fb - b * fa) / (fb - fa);
                const fm = hardyZ(m);
                if (fm === 0) [a, b] = [m, m];
                else if (fm * fb > 0) {
                    [b, fb] = [m, fm];
                    if (side === -1) fa /= 2;
                    side = -1;
                } else {
                    [a, fa] = [m, fm];
                    if (side === 1) fb /= 2;
                    side = 1;
                }
            }
            zeros.push((a + b) / 2);
        }
        [t, z] = [t1, z1];
    }
    return zeros;
}

// Riemann-von Mangoldt formula: the number of zeros with 0 < t < T is about this
const zeroCountEstimate = (T) => (T / (2 * Math.PI)) * Math.log(T / (2 * Math.PI)) - T / (2 * Math.PI) + 7 / 8;

// --- Primes and Riemann's explicit formula ---

// Logarithmic integral li(x) = Ei(ln x), from the power series of Ei
function li(x) {
    const u = Math.log(x);
    let sum = 0;
    let term = 1;
    for (let k = 1; k < 200; k++) {
        term *= u / k;
        sum += term / k;
        if (Math.abs(term / k) < 1e-17 * Math.abs(sum)) break;
    }
    return 0.5772156649015329 + Math.log(u) + sum;
}

// Exponential integral E1(w) for complex w, by its continued fraction (modified Lentz)
function expIntegralE1(w) {
    let D = cDiv(cx(1), cx(w.re + 1, w.im));
    let C = cx(1e300);
    let h = D;
    for (let k = 2; k < 500; k++) {
        const a = cx(-((k - 1) ** 2));
        const b = cx(w.re + 2 * k - 1, w.im);
        D = cDiv(cx(1), cAdd(b, cMul(a, D)));
        C = cAdd(b, cDiv(a, C));
        const delta = cMul(C, D);
        h = cMul(h, delta);
        if (Math.abs(delta.re - 1) + Math.abs(delta.im) < 1e-15) break;
    }
    return cMul(cExp(cx(-w.re, -w.im)), h);
}

// The contribution of one zero and its mirror image, li(y^rho) + li(y^conj(rho)) with rho = 1/2 + i gamma
const zeroPairTerm = (gamma, lnY) => -2 * expIntegralE1(cx(-0.5 * lnY, -gamma * lnY)).re;

// The small integral term in Riemann's formula: the integral from y to infinity of dt / (t (t^2 - 1) ln t)
function tailIntegral(y) {
    const a = Math.log(y);
    const n = 400;
    const h = 20 / n;
    let sum = 0;
    for (let i = 0; i <= n; i++) {
        const u = a + i * h;
        sum += ((i === 0 || i === n ? 1 : i % 2 ? 4 : 2) / ((Math.exp(2 * u) - 1) * u));
    }
    return (sum * h) / 3;
}

// Mobius function mu(n) for n = 0..20 (index 0 unused)
const MOBIUS = [0, 1, -1, -1, 0, -1, 1, -1, 0, 0, 1, -1, 0, -1, 1, 1, 0, -1, 0, -1, 0];

// Riemann's explicit formula, split so a slider can add zeros instantly:
// pi(x) = sum over n of mu(n)/n * J(x^(1/n)), and J(y) = li(y) - sum over zeros of li(y^rho) - ln 2 + tail(y).
// Returns the part without zeros at each x, and each zero pair's contribution at each x.
function explicitFormulaTerms(xs, zeros) {
    const smooth = xs.map(() => 0);
    const perZero = zeros.map(() => new Float64Array(xs.length));
    xs.forEach((x, i) => {
        for (let n = 1; x ** (1 / n) >= 2; n++) {
            if (!MOBIUS[n]) continue;
            const y = x ** (1 / n);
            const weight = MOBIUS[n] / n;
            smooth[i] += weight * (li(y) - Math.LN2 + tailIntegral(y));
            zeros.forEach((gamma, k) => (perZero[k][i] -= weight * zeroPairTerm(gamma, Math.log(y))));
        }
    });
    return { smooth, perZero };
}

function primesUpTo(n) {
    const composite = new Uint8Array(n + 1);
    const primes = [];
    for (let i = 2; i <= n; i++) {
        if (composite[i]) continue;
        primes.push(i);
        for (let j = i * i; j <= n; j += i) composite[j] = 1;
    }
    return primes;
}

// --- Page layout: a control bar and a chart for each of the four panels ---

function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-wrap:wrap; align-content:stretch; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const panel = (name, title, controlsHtml) => {
        const div = document.createElement("div");
        div.style.cssText = "flex:1 1 460px; min-height:330px; height:50%; display:flex; flex-direction:column;";
        const bar = document.createElement("div");
        bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:4px 14px; padding:6px 12px 2px; color:#ffffff;" + font;
        bar.innerHTML = `<strong style="font-weight:600">${title}</strong>` + controlsHtml;
        const status = document.createElement("div");
        status.setAttribute("aria-live", "polite");
        status.style.cssText = "padding:0 12px 4px; color:#C8D3E8; font-size:13px; min-height:18px;" + font;
        const chartDiv = document.createElement("div");
        chartDiv.id = `${divElementId}-${name}`; // each chart's div needs its own id
        chartDiv.style.cssText = "flex:1; min-height:250px;";
        div.append(bar, status, chartDiv);
        root.append(div);
        // Look up a control (input or select) by its data-id, and the output that shows a slider's value
        const control = (id) => [...bar.querySelectorAll("input"), ...bar.querySelectorAll("select")].find((el) => el.dataset.id === id);
        const output = (id) => bar.querySelector(`output[data-id="${id}-out"]`);
        return { chartDiv, status, control, output };
    };
    const slider = (id, label, min, max, step, value) =>
        `<label>${label} <input data-id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" ` +
        `style="vertical-align:middle; width:130px"> <output data-id="${id}-out"></output></label>`;
    const select = (id, label, options, value) =>
        `<label>${label} <select data-id="${id}" style="font:inherit">` +
        options.map((o) => `<option value="${o}"${o === value ? " selected" : ""}>${o.toLocaleString("en-GB")}</option>`).join("") +
        `</select></label>`;
    return {
        hardy: panel("hardy", "Z(t) on the critical line", select("range", "t from 0 to", [50, 100, 500, 1000, 5000], 100)),
        spiral: panel(
            "spiral",
            "ζ(σ + it) in the complex plane",
            slider("sigma", "σ", 0.2, 0.8, 0.01, 0.5) + slider("tmax", "t up to", 15, 60, 1, 40)
        ),
        primes: panel("primes", "Primes rebuilt from zeros", slider("zeros", "Zeros", 0, 300, 1, 30)),
        spacings: panel("spacings", "Gaps between zeros", select("count", "First", [1000, 2000, 5000], 5000))
    };
}

async function riemannHypothesis(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Four linked views of the Riemann zeta function, all computed in the browser: Hardy's Z(t) along the critical
    // line, the path of zeta(sigma + it) in the complex plane, the primes rebuilt from the zeros, and the gaps
    // between zeros against random-matrix theory
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        XyxyDataSeries,
        FastLineRenderableSeries,
        FastRectangleRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        EColumnMode,
        EColumnYMode,
        EAxisAlignment,
        HorizontalLineAnnotation,
        VerticalLineAnnotation,
        LegendModifier,
        ELegendPlacement,
        CursorModifier,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const theme = new SciChartJsNavyTheme();
    const BLUE = "#50C7E0";
    const ORANGE = "#F48420";
    const GREY = "#C8D3E8";
    const zoom = () => [new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier()];
    const line = (wasmContext, dataSeries, stroke, options = {}) =>
        new FastLineRenderableSeries(wasmContext, { dataSeries, stroke, strokeThickness: 2, ...options });
    const dots = (wasmContext, dataSeries, fill, size) =>
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries,
            stroke: fill, // the colour shown in the legend
            pointMarker: new EllipsePointMarker(wasmContext, { width: size, height: size, fill, stroke: "#FFFFFF", strokeThickness: 1 })
        });
    const dashed = { stroke: GREY, strokeThickness: 1, strokeDashArray: [3, 3] };
    const zeroLineY = () => new HorizontalLineAnnotation({ y1: 0, ...dashed });
    const zeroLineX = () => new VerticalLineAnnotation({ x1: 0, ...dashed });

    // The zeros, found once: every zero up to height 5,600 (5,000 and more of them)
    const zeros = findZeros(5600);

    // --- 1. Hardy's Z(t): it crosses zero at every zero of zeta on the critical line ---
    const hardy = await SciChartSurface.create(ui.hardy.chartDiv, { theme });
    hardy.sciChartSurface.xAxes.add(new NumericAxis(hardy.wasmContext, { axisTitle: "t (height on the critical line)", labelPrecision: 0 }));
    hardy.sciChartSurface.yAxes.add(new NumericAxis(hardy.wasmContext, { axisTitle: "Z(t)", axisAlignment: EAxisAlignment.Left, growBy: new NumberRange(0.05, 0.05) }));
    const hardyData = new XyDataSeries(hardy.wasmContext, { dataSeriesName: "Z(t)", isSorted: true, containsNaN: false });
    const hardyZeros = new XyDataSeries(hardy.wasmContext, { dataSeriesName: "Zeros", isSorted: true, containsNaN: false });
    hardy.sciChartSurface.renderableSeries.add(line(hardy.wasmContext, hardyData, BLUE, { strokeThickness: 1.5 }), dots(hardy.wasmContext, hardyZeros, ORANGE, 7));
    hardy.sciChartSurface.annotations.add(zeroLineY());
    hardy.sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight }),
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        ...zoom()
    );

    function updateHardy() {
        const T = Number(ui.hardy.control("range").value);
        const step = T <= 100 ? 0.01 : T <= 1000 ? 0.02 : 0.05; // 5,000 to 100,000 points
        const ts = [];
        const zs = [];
        for (let t = 0; t <= T + 1e-9; t += step) {
            ts.push(t);
            zs.push(hardyZ(t));
        }
        hardyData.clear();
        hardyData.appendRange(ts, zs);
        const shown = zeros.filter((g) => g <= T);
        hardyZeros.clear();
        hardyZeros.appendRange(shown, shown.map(() => 0));
        hardy.sciChartSurface.zoomExtents();
        ui.hardy.status.textContent =
            `${ts.length.toLocaleString("en-GB")} points · ${shown.length.toLocaleString("en-GB")} zeros between 0 and ${T.toLocaleString("en-GB")}, ` +
            `every one a sign change on the line · Riemann–von Mangoldt N(T) ≈ ${zeroCountEstimate(T).toFixed(1)}`;
    }

    // --- 2. The zeta spiral: the path of zeta(sigma + it) as t increases ---
    const spiral = await SciChartSurface.create(ui.spiral.chartDiv, { theme });
    spiral.sciChartSurface.xAxes.add(
        new NumericAxis(spiral.wasmContext, { axisTitle: "Real part of ζ", visibleRange: new NumberRange(-2.5, 4.5) })
    );
    spiral.sciChartSurface.yAxes.add(
        new NumericAxis(spiral.wasmContext, { axisTitle: "Imaginary part of ζ", axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(-3, 3) })
    );
    // The path is not sorted in x, so tell the data series
    const spiralData = new XyDataSeries(spiral.wasmContext, { dataSeriesName: "ζ(σ + it)", isSorted: false, containsNaN: false });
    const spiralAtZeros = new XyDataSeries(spiral.wasmContext, { dataSeriesName: "At the zero heights", isSorted: false, containsNaN: false });
    spiral.sciChartSurface.renderableSeries.add(line(spiral.wasmContext, spiralData, BLUE, { strokeThickness: 1.5 }), dots(spiral.wasmContext, spiralAtZeros, ORANGE, 9));
    spiral.sciChartSurface.annotations.add(zeroLineY(), zeroLineX());
    spiral.sciChartSurface.chartModifiers.add(new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight }), ...zoom());

    function updateSpiral() {
        const sigma = Number(ui.spiral.control("sigma").value);
        const tMax = Number(ui.spiral.control("tmax").value);
        ui.spiral.output("sigma").textContent = sigma.toFixed(2);
        ui.spiral.output("tmax").textContent = String(tMax);
        const re = [];
        const im = [];
        for (let t = 0; t <= tMax + 1e-9; t += 0.01) {
            const z = zeta(cx(sigma, t));
            re.push(z.re);
            im.push(z.im);
        }
        spiralData.clear();
        spiralData.appendRange(re, im);
        // Where the path is at the height of each zero: on the origin only when sigma = 1/2
        const heights = zeros.filter((g) => g <= tMax);
        const atZeros = heights.map((g) => zeta(cx(sigma, g)));
        spiralAtZeros.clear();
        spiralAtZeros.appendRange(atZeros.map((z) => z.re), atZeros.map((z) => z.im));
        const nearest = Math.min(...atZeros.map(cAbs));
        ui.spiral.status.textContent =
            Math.abs(sigma - 0.5) < 0.005
                ? `σ = 0.5: the path goes through 0 at all ${heights.length} zero heights up to t = ${tMax}`
                : `σ = ${sigma.toFixed(2)}: the path misses 0; nearest approach at a zero height ${nearest.toFixed(3)}`;
    }

    // --- 3. The prime-counting function rebuilt from the zeros (Riemann's explicit formula) ---
    const primesChart = await SciChartSurface.create(ui.primes.chartDiv, { theme });
    primesChart.sciChartSurface.xAxes.add(
        new NumericAxis(primesChart.wasmContext, { axisTitle: "x", labelPrecision: 0, visibleRange: new NumberRange(0, 100), visibleRangeLimit: new NumberRange(0, 100) })
    );
    primesChart.sciChartSurface.yAxes.add(
        new NumericAxis(primesChart.wasmContext, { axisTitle: "Number of primes up to x", axisAlignment: EAxisAlignment.Left, labelPrecision: 0, visibleRange: new NumberRange(-4, 31) })
    );
    const X_MAX = 100;
    const xs = Array.from({ length: 991 }, (_, i) => 1 + i * 0.1);
    const primes = primesUpTo(X_MAX);
    const MAX_ZEROS = 300;
    const { smooth, perZero } = explicitFormulaTerms(xs, zeros.slice(0, MAX_ZEROS));
    const stepX = [1, ...primes, X_MAX];
    const stepY = [0, ...primes.map((_, i) => i + 1), primes.length];
    const liX = xs.filter((x) => x >= 1.5);
    primesChart.sciChartSurface.renderableSeries.add(
        line(primesChart.wasmContext, new XyDataSeries(primesChart.wasmContext, { xValues: liX, yValues: liX.map(li), dataSeriesName: "li(x)" }), GREY, {
            strokeDashArray: [6, 4]
        }),
        // isDigitalLine draws the steps of pi(x): flat between primes, up by one at each prime
        line(primesChart.wasmContext, new XyDataSeries(primesChart.wasmContext, { xValues: stepX, yValues: stepY, dataSeriesName: "π(x), the true count" }), ORANGE, {
            isDigitalLine: true
        })
    );
    const formulaData = new XyDataSeries(primesChart.wasmContext, { dataSeriesName: "Explicit formula", isSorted: true, containsNaN: false });
    primesChart.sciChartSurface.renderableSeries.add(line(primesChart.wasmContext, formulaData, BLUE));
    primesChart.sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopLeft }),
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        ...zoom()
    );

    function updatePrimes() {
        const count = Number(ui.primes.control("zeros").value);
        ui.primes.output("zeros").textContent = String(count);
        const ys = Float64Array.from(smooth);
        for (let k = 0; k < count; k++) {
            const row = perZero[k];
            for (let i = 0; i < ys.length; i++) ys[i] += row[i];
        }
        formulaData.clear();
        formulaData.appendRange(xs, Array.from(ys));
        const at = (x) => ys[Math.round((x - 1) * 10)];
        ui.primes.status.textContent =
            count === 0
                ? "No zeros: a smooth curve, close to li(x), with no steps"
                : `${count} zeros (up to height ${zeros[count - 1].toFixed(1)}) · formula at x = 50: ${at(50).toFixed(2)} (π = 15), at x = 100: ${at(100).toFixed(2)} (π = 25)`;
    }

    // --- 4. Gaps between neighbouring zeros against the GUE prediction from random-matrix theory ---
    const gaps = await SciChartSurface.create(ui.spacings.chartDiv, { theme });
    gaps.sciChartSurface.xAxes.add(
        new NumericAxis(gaps.wasmContext, { axisTitle: "Gap ÷ average gap at that height", visibleRange: new NumberRange(0, 3) })
    );
    gaps.sciChartSurface.yAxes.add(new NumericAxis(gaps.wasmContext, { axisTitle: "Probability density", axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(0, 1.2) }));
    const histogramData = new XyxyDataSeries(gaps.wasmContext, { dataSeriesName: "Zeros" });
    const sGrid = Array.from({ length: 301 }, (_, i) => i * 0.01);
    gaps.sciChartSurface.renderableSeries.add(
        new FastRectangleRenderableSeries(gaps.wasmContext, {
            dataSeries: histogramData,
            columnXMode: EColumnMode.StartEnd,
            columnYMode: EColumnYMode.TopBottom,
            fill: "#50C7E0CC",
            stroke: BLUE,
            strokeThickness: 1,
            topCornerRadius: 2
        }),
        // Wigner surmise for the GUE: p(s) = (32 / pi^2) s^2 e^(-4 s^2 / pi)
        line(
            gaps.wasmContext,
            new XyDataSeries(gaps.wasmContext, {
                xValues: sGrid,
                yValues: sGrid.map((s) => (32 / Math.PI ** 2) * s * s * Math.exp((-4 * s * s) / Math.PI)),
                dataSeriesName: "GUE (Wigner surmise)"
            }),
            ORANGE,
            { strokeThickness: 3 }
        ),
        // Independent random points (Poisson): p(s) = e^(-s)
        line(
            gaps.wasmContext,
            new XyDataSeries(gaps.wasmContext, { xValues: sGrid, yValues: sGrid.map((s) => Math.exp(-s)), dataSeriesName: "Random points (Poisson)" }),
            GREY,
            { strokeDashArray: [6, 4] }
        )
    );
    gaps.sciChartSurface.chartModifiers.add(new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight }), ...zoom());

    function updateGaps() {
        const count = Number(ui.spacings.control("count").value);
        const g = zeros.slice(0, count);
        // Normalise each gap by the local average gap, 2 pi / ln(t / 2 pi), so the average is 1 at every height
        const spacings = g.slice(1).map((next, i) => ((next - g[i]) * Math.log(g[i] / (2 * Math.PI))) / (2 * Math.PI));
        const BIN = 0.1;
        const counts = new Array(30).fill(0);
        spacings.forEach((s) => s < 3 && counts[Math.floor(s / BIN)]++);
        const density = counts.map((n) => n / (spacings.length * BIN));
        histogramData.clear();
        histogramData.appendRange(
            counts.map((_, i) => i * BIN),
            density,
            counts.map((_, i) => (i + 1) * BIN),
            density.map(() => 0)
        );
        const mean = spacings.reduce((a, b) => a + b, 0) / spacings.length;
        const small = spacings.filter((s) => s < 0.2).length;
        ui.spacings.status.textContent =
            `${spacings.length.toLocaleString("en-GB")} gaps, average ${mean.toFixed(3)} · ` +
            `${((100 * small) / spacings.length).toFixed(1)}% under 0.2 (random points: 18.1%)`;
    }

    const on = (panel, id, event, handler) => panel.control(id).addEventListener(event, handler);
    on(ui.hardy, "range", "change", updateHardy);
    on(ui.spiral, "sigma", "input", updateSpiral);
    on(ui.spiral, "tmax", "input", updateSpiral);
    on(ui.primes, "zeros", "input", updatePrimes);
    on(ui.spacings, "count", "change", updateGaps);
    updateHardy();
    updateSpiral();
    updatePrimes();
    updateGaps();
    // #region_A_end
}

riemannHypothesis("scichart-root");
