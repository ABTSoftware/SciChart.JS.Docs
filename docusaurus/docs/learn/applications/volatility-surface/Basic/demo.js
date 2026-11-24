import * as SciChart from "scichart";

// The controls, the readout and the three charts each need an element. This splits the page's div into them;
// in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const bar = document.createElement("div");
    bar.style.cssText =
        "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const slider = (id, label, min, max, step, value) =>
        `<label>${label} <input data-id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" ` +
        `style="vertical-align:middle; width:100px"> <output data-id="${id}"></output></label>`;
    const dropdown = (id, label, options) =>
        `<label>${label} <select data-id="${id}" style="font:inherit">` +
        options.map(([value, text]) => `<option value="${value}">${text}</option>`).join("") +
        `</select></label>`;
    bar.innerHTML =
        slider("skew", "Skew (ρ)", -0.95, 0.5, 0.05, -0.7) +
        slider("curvature", "Smile curvature (η)", 0.2, 3, 0.1, 1) +
        dropdown("term", "Term structure", [
            ["normal", "Normal (upward)"],
            ["flat", "Flat"],
            ["inverted", "Inverted (stress)"],
            ["event", "Event in 30 days"],
            ["steep", "Inverted too steeply"]
        ]) +
        dropdown("expiry", "Expiry", [
            ["14", "14 days"],
            ["28", "28 days"],
            ["56", "56 days"],
            ["84", "84 days"],
            ["182", "182 days"],
            ["364", "364 days"],
            ["546", "546 days"],
            ["728", "728 days"]
        ]) +
        slider("strike", "Strike", 70, 130, 5, 90) +
        `<label><input data-id="quotes" type="checkbox" checked style="vertical-align:middle"> Show quotes</label>` +
        dropdown("view", "3D view", [
            ["perspective", "Perspective"],
            ["above", "From above (heatmap)"]
        ]) +
        `<span data-id="summary" aria-live="polite" style="flex-basis:100%; color:#c8d3e8"></span>`;
    const grid = document.createElement("div");
    grid.style.cssText = "flex:1; min-height:0; display:grid; grid-template-columns:3fr 2fr; grid-template-rows:1fr 1fr;";
    const makeDiv = (name, css) => {
        const div = document.createElement("div");
        div.id = `${divElementId}-${name}`;
        div.style.cssText = "min-width:0; min-height:0;" + css;
        return div;
    };
    const surfaceDiv = makeDiv("surface", "grid-row:1 / span 2;");
    const smileDiv = makeDiv("smile", "");
    const termDiv = makeDiv("term", "");
    grid.append(surfaceDiv, smileDiv, termDiv);
    root.append(bar, grid);
    const input = (id) => Array.from(bar.querySelectorAll("input")).find((el) => el.dataset.id === id);
    const select = (id) => Array.from(bar.querySelectorAll("select")).find((el) => el.dataset.id === id);
    return {
        surfaceDiv,
        smileDiv,
        termDiv,
        skew: input("skew"),
        curvature: input("curvature"),
        term: select("term"),
        expiry: select("expiry"),
        strike: input("strike"),
        quotes: input("quotes"),
        view: select("view"),
        skewOut: bar.querySelector('output[data-id="skew"]'),
        curvatureOut: bar.querySelector('output[data-id="curvature"]'),
        strikeOut: bar.querySelector('output[data-id="strike"]'),
        summary: bar.querySelector('span[data-id="summary"]')
    };
}

async function volatilitySurfaceChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // An implied volatility surface with its smile and term-structure slices, charted with SciChart.js.
    // The surface is simulated (SSVI-style smiles on a chosen term structure), and the "market quotes"
    // are option prices made from it, rounded to the cent, then turned back into implied volatility.
    const {
        SciChartSurface,
        SciChart3DSurface,
        NumericAxis,
        NumericAxis3D,
        NumberRange,
        Vector3,
        UniformGridDataSeries3D,
        SurfaceMeshRenderableSeries3D,
        GradientColorPalette,
        EDrawMeshAs,
        XyzDataSeries3D,
        PointLineRenderableSeries3D,
        ScatterRenderableSeries3D,
        SpherePointMarker3D,
        XyDataSeries,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        VerticalLineAnnotation,
        ELabelPlacement,
        ECameraProjectionMode,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        ELegendPlacement,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        TooltipModifier3D
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const SPOT = 100; // underlying price; strikes are shown as % of spot
    const RATE = 0.04; // continuously compounded interest rate, no dividends
    const STRIKES = []; // 70% to 130% of spot, every 1%
    for (let k = 70; k <= 130; k++) STRIKES.push(k);
    const DAYS = []; // 14 days to two years, every 14 days
    for (let d = 14; d <= 728; d += 14) DAYS.push(d);
    const LISTED_DAYS = [14, 28, 56, 84, 182, 364, 546, 728]; // expiries with quotes
    const QUOTED_STRIKES = [70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130];
    const EVENT_DAYS = 30; // the "event" term structure: a one-day move of about 6% in 30 days
    const EVENT_MOVE = 0.06;

    // --- Black–Scholes pricing and implied volatility ---
    // Standard normal CDF (Abramowitz and Stegun 26.2.17, error below 7.5e-8)
    function normCdf(x) {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989422804014327 * Math.exp(-0.5 * x * x);
        const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
        return x >= 0 ? 1 - p : p;
    }
    const normPdf = (x) => 0.3989422804014327 * Math.exp(-0.5 * x * x);
    // European option price: S spot, K strike, T years, r rate, sigma volatility
    function bsPrice(isCall, S, K, T, r, sigma) {
        const sd = sigma * Math.sqrt(T);
        const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / sd;
        const d2 = d1 - sd;
        if (isCall) return S * normCdf(d1) - K * Math.exp(-r * T) * normCdf(d2);
        return K * Math.exp(-r * T) * normCdf(-d2) - S * normCdf(-d1);
    }
    // Vega: how much the price changes per unit (100 points) of volatility
    function bsVega(S, K, T, r, sigma) {
        const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
        return S * normPdf(d1) * Math.sqrt(T);
    }
    // Implied volatility: the sigma at which bsPrice equals the market price. Newton's method from the
    // Brenner–Subrahmanyam guess, falling back to bisection if a step leaves the bracket
    function impliedVol(isCall, price, S, K, T, r) {
        let sigma = Math.max(0.01, (Math.sqrt((2 * Math.PI) / T) * price) / S);
        const firstGuess = sigma;
        let lo = 1e-4;
        let hi = 5;
        for (let i = 0; i < 50; i++) {
            const diff = bsPrice(isCall, S, K, T, r, sigma) - price;
            if (Math.abs(diff) < 1e-8) return { sigma, steps: i, firstGuess };
            if (diff > 0) hi = sigma;
            else lo = sigma;
            const vega = bsVega(S, K, T, r, sigma);
            let next = sigma - diff / vega;
            if (!(next > lo && next < hi)) next = 0.5 * (lo + hi);
            sigma = next;
        }
        return { sigma, steps: 50, firstGuess };
    }

    // --- The simulated surface ---
    // At-the-money volatility for each term-structure shape (T in years)
    function atmVol(T, shape) {
        if (shape === "flat") return 0.19;
        if (shape === "inverted") return 0.21 + 0.21 * Math.exp(-T / 0.2);
        if (shape === "steep") return 0.15 + 0.6 * Math.exp(-T / 0.1);
        return 0.15 + 0.07 * (1 - Math.exp(-T / 0.75)); // normal, and the base of "event"
    }
    // At-the-money total variance theta = sigma² × T; an event adds its squared move once it is inside the expiry
    function atmVariance(T, shape) {
        let theta = atmVol(T, shape) ** 2 * T;
        if (shape === "event" && T * 365 >= EVENT_DAYS) theta += EVENT_MOVE * EVENT_MOVE;
        return theta;
    }
    // SSVI smile (Gatheral and Jacquier): total variance at log-moneyness k = ln(K / F)
    function totalVariance(k, theta, p) {
        const phi = p.curvature / Math.sqrt(theta * (1 + theta));
        const x = phi * k;
        return (theta / 2) * (1 + p.skew * x + Math.sqrt((x + p.skew) ** 2 + 1 - p.skew * p.skew));
    }
    const logMoneyness = (strikePct, T) => Math.log((strikePct / 100) * SPOT / (SPOT * Math.exp(RATE * T)));
    // Implied volatility (as a fraction) at a strike (% of spot) and days to expiry
    function modelVol(strikePct, days, p) {
        const T = days / 365;
        return Math.sqrt(totalVariance(logMoneyness(strikePct, T), atmVariance(T, p.shape), p) / T);
    }

    // No-arbitrage checks on log-moneyness -0.5 to 0.5 (strikes about 61% to 165% of the forward)
    function arbitrageChecks(p) {
        let butterfly = null;
        let calendar = null;
        const h = 1e-3;
        for (let i = 0; i < DAYS.length; i++) {
            const theta = atmVariance(DAYS[i] / 365, p.shape);
            const before = i > 0 ? atmVariance(DAYS[i - 1] / 365, p.shape) : 0;
            for (let k = -0.5; k <= 0.5001; k += 0.01) {
                const w = totalVariance(k, theta, p);
                const up = totalVariance(k + h, theta, p);
                const down = totalVariance(k - h, theta, p);
                const w1 = (up - down) / (2 * h);
                const w2 = (up - 2 * w + down) / (h * h);
                // Durrleman's condition: g(k) >= 0 means the implied probability density is not negative
                const g = (1 - (k * w1) / (2 * w)) ** 2 - ((w1 * w1) / 4) * (1 / w + 0.25) + w2 / 2;
                if (g < 0 && !butterfly) butterfly = { days: DAYS[i], k };
                // Total variance must not fall as expiry grows (same log-moneyness)
                if (i > 0 && w < totalVariance(k, before, p) - 1e-12 && !calendar) calendar = { days: DAYS[i], k };
            }
        }
        return { butterfly, calendar };
    }

    // Seeded random numbers, so the quote noise is the same every time
    function makeRandom(seed) {
        let s = seed >>> 0 || 1;
        const random = () => {
            s = (s + 0x6d2b79f5) >>> 0;
            let t = s;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        return () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    }
    const quoteNoise = LISTED_DAYS.map((_, i) => {
        const gaussian = makeRandom(1000 + i);
        return QUOTED_STRIKES.map(() => gaussian());
    });

    // Market quotes: an out-of-the-money option at each listed expiry and strike, priced from the surface plus
    // noise, rounded to the cent, then turned back into implied volatility as a real surface build would
    function makeQuotes(p) {
        const quotes = [];
        LISTED_DAYS.forEach((days, i) => {
            const T = days / 365;
            QUOTED_STRIKES.forEach((strikePct, j) => {
                const K = (strikePct / 100) * SPOT;
                const isCall = K >= SPOT * Math.exp(RATE * T); // out of the money: puts below the forward, calls above
                const k = logMoneyness(strikePct, T);
                const noisyVol = modelVol(strikePct, days, p) + (0.004 + 0.02 * Math.abs(k)) * quoteNoise[i][j];
                const price = Math.round(bsPrice(isCall, SPOT, K, T, RATE, noisyVol) * 100) / 100;
                if (price < 0.01) {
                    quotes.push({ days, strikePct, isCall, price, iv: null });
                    return;
                }
                const solved = impliedVol(isCall, price, SPOT, K, T, RATE);
                quotes.push({ days, strikePct, isCall, price, iv: solved.sigma, steps: solved.steps, firstGuess: solved.firstGuess });
            });
        });
        return quotes;
    }

    const theme = new SciChartJsNavyTheme();
    const titleStyle = { fontSize: 14 };
    const axisTitleStyle = { fontSize: 13 };

    // --- 1. The 3D surface: strike across, days to expiry into the screen, implied volatility up ---
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(ui.surfaceDiv, {
        theme,
        worldDimensions: new Vector3(300, 160, 300),
        cameraOptions: { position: new Vector3(480, 350, -390), target: new Vector3(0, 30, 0) }
    });
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Strike (% of spot)",
        labelPrecision: 0,
        visibleRange: new NumberRange(70, 130)
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "IV (%)", labelPrecision: 0 });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Days to expiry",
        labelPrecision: 0,
        visibleRange: new NumberRange(0, 730)
    });
    // yValues[expiryIndex][strikeIndex], in % volatility
    const gridData = new UniformGridDataSeries3D(wasmContext, {
        yValues: DAYS.map(() => STRIKES.map(() => 20)),
        xStart: STRIKES[0],
        xStep: 1,
        zStart: DAYS[0],
        zStep: 14,
        dataSeriesName: "Implied volatility"
    });
    sciChart3DSurface.renderableSeries.add(
        new SurfaceMeshRenderableSeries3D(wasmContext, {
            dataSeries: gridData,
            // Colour repeats the height: 10% volatility is dark blue, 70% and above is red
            meshColorPalette: new GradientColorPalette(wasmContext, {
                gradientStops: [
                    { offset: 0, color: "#14233C" },
                    { offset: 0.2, color: "#1F4FA8" },
                    { offset: 0.4, color: "#2FB8D9" },
                    { offset: 0.6, color: "#7CD992" },
                    { offset: 0.8, color: "#F5E663" },
                    { offset: 1, color: "#FF4D4D" }
                ]
            }),
            minimum: 10,
            maximum: 70,
            drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS,
            contourInterval: 5, // a contour line every 5 volatility points
            contourStroke: "#FFFFFF",
            contourStrokeThickness: 1,
            drawSkirt: false,
            lightingFactor: 0.4
        })
    );
    // The two slices drawn on the surface, and the quotes as spheres
    const smileSlice3D = new XyzDataSeries3D(wasmContext, { dataSeriesName: "Smile slice" });
    const termSlice3D = new XyzDataSeries3D(wasmContext, { dataSeriesName: "Term-structure slice" });
    const quotes3D = new XyzDataSeries3D(wasmContext, { dataSeriesName: "Quotes" });
    const quoteSpheres = new ScatterRenderableSeries3D(wasmContext, {
        dataSeries: quotes3D,
        pointMarker: new SpherePointMarker3D(wasmContext, { size: 6, fill: "#FFFFFF" })
    });
    sciChart3DSurface.renderableSeries.add(
        new PointLineRenderableSeries3D(wasmContext, {
            dataSeries: smileSlice3D,
            stroke: "#FF9F1C",
            strokeThickness: 4,
            pointMarker: new SpherePointMarker3D(wasmContext, { size: 4, fill: "#FF9F1C" })
        }),
        new PointLineRenderableSeries3D(wasmContext, {
            dataSeries: termSlice3D,
            stroke: "#E04FD8",
            strokeThickness: 4,
            pointMarker: new SpherePointMarker3D(wasmContext, { size: 4, fill: "#E04FD8" })
        }),
        quoteSpheres
    );
    sciChart3DSurface.chartModifiers.add(
        new OrbitModifier3D(),
        new MouseWheelZoomModifier3D(),
        new ResetCamera3DModifier(),
        new TooltipModifier3D({
            tooltipDataTemplate: (seriesInfo) => {
                if (!seriesInfo || !seriesInfo.isHit) return [];
                return [
                    `Strike ${seriesInfo.xValue.toFixed(0)}%, ${seriesInfo.zValue.toFixed(0)} days`,
                    `IV ${seriesInfo.yValue.toFixed(1)}%`
                ];
            }
        })
    );

    // --- 2. The smile: implied volatility against strike at the selected expiry ---
    const cartesianModifiers = () => [
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    ];
    const smile = await SciChartSurface.create(ui.smileDiv, { theme, title: "Smile at the selected expiry", titleStyle });
    smile.sciChartSurface.xAxes.add(
        new NumericAxis(smile.wasmContext, {
            axisTitle: "Strike (% of spot)",
            axisTitleStyle,
            labelPrecision: 0,
            visibleRange: new NumberRange(68, 132)
        })
    );
    smile.sciChartSurface.yAxes.add(
        new NumericAxis(smile.wasmContext, {
            axisTitle: "Implied volatility (%)",
            axisTitleStyle,
            labelPrecision: 0,
            growBy: new NumberRange(0.1, 0.1)
        })
    );
    const smileLine = new XyDataSeries(smile.wasmContext, { dataSeriesName: "Surface", dataIsSortedInX: true });
    const smileQuotes = new XyDataSeries(smile.wasmContext, { dataSeriesName: "Quotes", dataIsSortedInX: true });
    const smileQuoteSeries = new XyScatterRenderableSeries(smile.wasmContext, {
        dataSeries: smileQuotes,
        pointMarker: new EllipsePointMarker(smile.wasmContext, { width: 9, height: 9, fill: "#FFFFFF", stroke: "#22365B" })
    });
    smile.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(smile.wasmContext, { dataSeries: smileLine, stroke: "#FF9F1C", strokeThickness: 3 }),
        smileQuoteSeries
    );
    const strikeMarker = new VerticalLineAnnotation({
        x1: 90,
        stroke: "#E04FD8",
        strokeDashArray: [4, 4],
        showLabel: true,
        labelValue: "Strike"
    });
    smile.sciChartSurface.annotations.add(strikeMarker);
    smile.sciChartSurface.chartModifiers.add(
        ...cartesianModifiers(),
        new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight })
    );

    // --- 3. The term structure: implied volatility against expiry at the selected strike ---
    const term = await SciChartSurface.create(ui.termDiv, { theme, title: "Term structure at the selected strike", titleStyle });
    term.sciChartSurface.xAxes.add(
        new NumericAxis(term.wasmContext, {
            axisTitle: "Days to expiry",
            axisTitleStyle,
            labelPrecision: 0,
            visibleRange: new NumberRange(0, 740)
        })
    );
    term.sciChartSurface.yAxes.add(
        new NumericAxis(term.wasmContext, {
            axisTitle: "Implied volatility (%)",
            axisTitleStyle,
            labelPrecision: 0,
            growBy: new NumberRange(0.1, 0.1)
        })
    );
    const termLine = new XyDataSeries(term.wasmContext, { dataSeriesName: "Surface", dataIsSortedInX: true });
    const termQuotes = new XyDataSeries(term.wasmContext, { dataSeriesName: "Quotes", dataIsSortedInX: true });
    const termQuoteSeries = new XyScatterRenderableSeries(term.wasmContext, {
        dataSeries: termQuotes,
        pointMarker: new EllipsePointMarker(term.wasmContext, { width: 9, height: 9, fill: "#FFFFFF", stroke: "#22365B" })
    });
    term.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(term.wasmContext, { dataSeries: termLine, stroke: "#E04FD8", strokeThickness: 3 }),
        termQuoteSeries
    );
    const expiryMarker = new VerticalLineAnnotation({
        x1: 84,
        stroke: "#FF9F1C",
        strokeDashArray: [4, 4],
        showLabel: true,
        labelValue: "Expiry"
    });
    const eventMarker = new VerticalLineAnnotation({
        x1: EVENT_DAYS,
        stroke: "#F5E663",
        showLabel: true,
        labelPlacement: ELabelPlacement.TopRight,
        labelValue: "Event"
    });
    term.sciChartSurface.annotations.add(expiryMarker, eventMarker);
    term.sciChartSurface.chartModifiers.add(
        ...cartesianModifiers(),
        new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight })
    );

    // --- Updating everything from the controls ---
    function readSettings() {
        return {
            skew: Number(ui.skew.value),
            curvature: Number(ui.curvature.value),
            shape: ui.term.value,
            days: Number(ui.expiry.value),
            strikePct: Number(ui.strike.value),
            showQuotes: ui.quotes.checked
        };
    }
    let quotes = [];
    let lastSurfaceKey = "";
    function update() {
        const p = readSettings();
        ui.skewOut.textContent = p.skew.toFixed(2);
        ui.curvatureOut.textContent = p.curvature.toFixed(1);
        ui.strikeOut.textContent = `${p.strikePct}%`;

        // Rebuild the surface and the quotes only when its shape changes
        const surfaceKey = `${p.skew}|${p.curvature}|${p.shape}`;
        if (surfaceKey !== lastSurfaceKey) {
            lastSurfaceKey = surfaceKey;
            const values = DAYS.map((days) => STRIKES.map((s) => 100 * modelVol(s, days, p)));
            gridData.setYValues(values);
            let top = 0;
            for (const row of values) for (const v of row) top = Math.max(top, v);
            sciChart3DSurface.yAxis.visibleRange = new NumberRange(0, Math.ceil(top / 10) * 10);
            quotes = makeQuotes(p);
            const shown = quotes.filter((q) => q.iv !== null);
            quotes3D.clear();
            quotes3D.appendRange(
                shown.map((q) => q.strikePct),
                shown.map((q) => 100 * q.iv),
                shown.map((q) => q.days)
            );
        }
        quoteSpheres.isVisible = p.showQuotes;
        smileQuoteSeries.isVisible = p.showQuotes;
        termQuoteSeries.isVisible = p.showQuotes;
        eventMarker.isHidden = p.shape !== "event";

        // Smile slice at the selected expiry
        const smileVols = STRIKES.map((s) => 100 * modelVol(s, p.days, p));
        smileLine.clear();
        smileLine.appendRange(STRIKES, smileVols);
        smileSlice3D.clear();
        // Lift the slices a little above the surface so they aren't hidden in it
        smileSlice3D.appendRange(STRIKES, smileVols.map((v) => v + 1), STRIKES.map(() => p.days));
        const atExpiry = quotes.filter((q) => q.days === p.days && q.iv !== null);
        smileQuotes.clear();
        smileQuotes.appendRange(atExpiry.map((q) => q.strikePct), atExpiry.map((q) => 100 * q.iv));
        smile.sciChartSurface.title = `Smile at ${p.days} days`;
        strikeMarker.x1 = p.strikePct;

        // Term-structure slice at the selected strike
        const termVols = DAYS.map((d) => 100 * modelVol(p.strikePct, d, p));
        termLine.clear();
        termLine.appendRange(DAYS, termVols);
        termSlice3D.clear();
        termSlice3D.appendRange(DAYS.map(() => p.strikePct), termVols.map((v) => v + 1), DAYS);
        const atStrike = quotes.filter((q) => q.strikePct === p.strikePct && q.iv !== null);
        termQuotes.clear();
        termQuotes.appendRange(atStrike.map((q) => q.days), atStrike.map((q) => 100 * q.iv));
        term.sciChartSurface.title = `Term structure at ${p.strikePct}% strike`;
        expiryMarker.x1 = p.days;
        smile.sciChartSurface.zoomExtentsY();
        term.sciChartSurface.zoomExtentsY();

        // Readout: the selected quote, from price to implied volatility, and the no-arbitrage checks
        const q = quotes.find((x) => x.days === p.days && x.strikePct === p.strikePct);
        let text = `Quote: ${p.days}-day ${q.isCall ? "call" : "put"}, strike ${p.strikePct} (spot 100, rate 4%). `;
        if (q.iv === null) {
            text += `Its price rounds to <b>$0.00</b>, so no implied volatility can be read from it. `;
        } else {
            text +=
                `Price <b>$${q.price.toFixed(2)}</b> → implied volatility <b>${(100 * q.iv).toFixed(2)}%</b> ` +
                `(Newton's method, ${q.steps} steps from a first guess of ${(100 * q.firstGuess).toFixed(1)}%); ` +
                `surface ${(100 * modelVol(p.strikePct, p.days, p)).toFixed(2)}%. `;
        }
        const checks = arbitrageChecks(p);
        const where = (c) => `${c.days} days, k = ${c.k.toFixed(2)}`;
        text += checks.butterfly
            ? `Butterfly check: <b>fails</b> (negative implied density at ${where(checks.butterfly)}). `
            : "Butterfly check: passes. ";
        text += checks.calendar
            ? `Calendar check: <b>fails</b> (total variance falls with expiry at ${where(checks.calendar)}).`
            : "Calendar check: passes.";
        ui.summary.innerHTML = text;
    }

    // From above, the surface reads like a heatmap: colour is implied volatility
    function setView() {
        const camera = sciChart3DSurface.camera;
        if (ui.view.value === "above") {
            // Straight down, without perspective: strike across, expiry up the screen
            camera.projectionMode = ECameraProjectionMode.Orthogonal;
            camera.orthoWidth = 420;
            camera.orthoHeight = 420;
            camera.position = new Vector3(0, 600, -0.1);
            camera.target = new Vector3(0, 0, 0);
        } else {
            camera.projectionMode = ECameraProjectionMode.Perspective;
            camera.position = new Vector3(480, 350, -390);
            camera.target = new Vector3(0, 30, 0);
        }
    }

    // Several slider events can arrive per frame; redraw at most once per frame
    let pending = false;
    const schedule = () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            pending = false;
            update();
        });
    };
    for (const control of [ui.skew, ui.curvature, ui.strike]) control.addEventListener("input", schedule);
    for (const control of [ui.term, ui.expiry, ui.quotes]) control.addEventListener("change", schedule);
    ui.view.addEventListener("change", setView);
    ui.expiry.value = "84";
    update();
    // #region_A_end
}

volatilitySurfaceChart("scichart-root");
