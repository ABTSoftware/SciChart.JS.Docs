import * as SciChart from "scichart";

// An options strategy builder: pick a preset strategy, or edit the legs, and the chart shows the profit or loss
// at expiry (the payoff diagram) against the underlying price, plus the Black-Scholes value of the same position
// before expiry. Prices are per share of the underlying; a standard US equity option contract covers 100 shares.
// The preset premiums are Black-Scholes prices, rounded to 0.05, for a stock at 100 with 45 days to expiry,
// 30% volatility and a 4% interest rate, so the before-expiry curve starts at about zero at today's price.
const SPOT = 100; // today's price of the underlying
const RATE = 0.04; // risk-free interest rate, continuously compounded
const ENTRY_DAYS = 45;
const ENTRY_VOLATILITY = 30; // %

// Each leg: side +1 (long, bought) or -1 (short, sold), quantity, type "call", "put" or "stock",
// strike (for stock, the price paid or received) and premium per share (0 for stock)
const leg = (side, qty, type, strike, premium) => ({ side, qty, type, strike, premium });
const PRESETS = {
    "Long call": [leg(1, 1, "call", 100, 4.45)],
    "Short call": [leg(-1, 1, "call", 100, 4.45)],
    "Long put": [leg(1, 1, "put", 100, 3.95)],
    "Short put": [leg(-1, 1, "put", 100, 3.95)],
    "Covered call": [leg(1, 1, "stock", 100, 0), leg(-1, 1, "call", 105, 2.4)],
    "Protective put": [leg(1, 1, "stock", 100, 0), leg(1, 1, "put", 95, 1.9)],
    "Bull call spread": [leg(1, 1, "call", 100, 4.45), leg(-1, 1, "call", 105, 2.4)],
    "Bear put spread": [leg(1, 1, "put", 100, 3.95), leg(-1, 1, "put", 95, 1.9)],
    "Long straddle": [leg(1, 1, "call", 100, 4.45), leg(1, 1, "put", 100, 3.95)],
    "Long strangle": [leg(1, 1, "put", 95, 1.9), leg(1, 1, "call", 105, 2.4)],
    "Long call butterfly": [leg(1, 1, "call", 95, 7.4), leg(-1, 2, "call", 100, 4.45), leg(1, 1, "call", 105, 2.4)],
    "Iron condor": [
        leg(1, 1, "put", 90, 0.75),
        leg(-1, 1, "put", 95, 1.9),
        leg(-1, 1, "call", 105, 2.4),
        leg(1, 1, "call", 110, 1.2)
    ]
};

// The controls, the legs table, the readout and the chart each need an element. This splits the page's div into
// them; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const panel = document.createElement("div");
    panel.style.cssText =
        "display:flex; flex-direction:column; gap:6px; padding:8px 12px; color:#ffffff;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const options = Object.keys(PRESETS)
        .map((name) => `<option>${name}</option>`)
        .join("");
    panel.innerHTML =
        `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px">` +
        `<label>Strategy <select data-id="strategy" style="font:inherit">${options}<option>Custom</option></select></label>` +
        `<label>Days to expiry <input data-id="days" type="range" min="0" max="90" step="1" value="${ENTRY_DAYS}" style="vertical-align:middle; width:110px"> <output data-id="days"></output></label>` +
        `<label>Volatility <input data-id="vol" type="range" min="5" max="80" step="1" value="${ENTRY_VOLATILITY}" style="vertical-align:middle; width:110px"> <output data-id="vol"></output></label>` +
        `<button data-id="add" type="button" style="font:inherit; padding:2px 12px; cursor:pointer">Add leg</button>` +
        `</div>` +
        `<div data-id="legs" style="display:flex; flex-direction:column; gap:4px"></div>` +
        `<div data-id="summary" aria-live="polite" style="color:#c8d3e8"></div>`;
    const chartDiv = document.createElement("div");
    chartDiv.id = `${divElementId}-chart`;
    chartDiv.style.cssText = "flex:1; min-height:0;";
    root.append(panel, chartDiv);
    const get = (selector) => panel.querySelector(selector);
    return {
        chartDiv,
        strategy: get('select[data-id="strategy"]'),
        days: get('input[data-id="days"]'),
        daysOut: get('output[data-id="days"]'),
        vol: get('input[data-id="vol"]'),
        volOut: get('output[data-id="vol"]'),
        addButton: get('button[data-id="add"]'),
        legsDiv: get('div[data-id="legs"]'),
        summary: get('div[data-id="summary"]')
    };
}

// One editable row per leg: long/short, quantity, call/put/stock, strike, premium and a remove button
function renderLegRows(ui, getLegs, onChange) {
    const legs = getLegs();
    const field = "font:inherit; width:64px";
    ui.legsDiv.innerHTML = legs
        .map(
            (l, i) =>
                `<div data-row="${i}" style="display:flex; flex-wrap:wrap; align-items:center; gap:4px 10px">` +
                `<span style="width:44px">Leg ${i + 1}</span>` +
                `<select data-f="side" aria-label="Leg ${i + 1} long or short" style="font:inherit">` +
                `<option value="1"${l.side > 0 ? " selected" : ""}>Long</option><option value="-1"${l.side < 0 ? " selected" : ""}>Short</option></select>` +
                `<input data-f="qty" type="number" min="1" max="10" step="1" value="${l.qty}" aria-label="Leg ${i + 1} quantity" style="${field}; width:48px">` +
                `<select data-f="type" aria-label="Leg ${i + 1} type" style="font:inherit">` +
                ["call", "put", "stock"]
                    .map((t) => `<option value="${t}"${l.type === t ? " selected" : ""}>${t[0].toUpperCase() + t.slice(1)}</option>`)
                    .join("") +
                `</select>` +
                `<label>${l.type === "stock" ? "Price" : "Strike"} <input data-f="strike" type="number" min="1" max="400" step="0.5" value="${l.strike}" style="${field}"></label>` +
                (l.type === "stock"
                    ? ""
                    : `<label>Premium <input data-f="premium" type="number" min="0" max="100" step="0.05" value="${l.premium}" style="${field}"></label>`) +
                `<button data-f="remove" type="button" aria-label="Remove leg ${i + 1}" style="font:inherit; padding:0 8px; cursor:pointer"${legs.length > 1 ? "" : " disabled"}>Remove</button>` +
                `</div>`
        )
        .join("");
    ui.legsDiv.querySelectorAll("[data-row]").forEach((row) => {
        const i = Number(row.getAttribute("data-row"));
        row.querySelectorAll("[data-f]").forEach((el) => {
            const f = el.getAttribute("data-f");
            if (f === "remove") {
                el.addEventListener("click", () => onChange(getLegs().filter((_, j) => j !== i), true));
                return;
            }
            el.addEventListener(el.tagName === "SELECT" ? "change" : "input", () => {
                const next = getLegs().map((l) => ({ ...l }));
                const value = el.value;
                if (f === "type") next[i].type = value;
                else if (f === "side") next[i].side = Number(value);
                else {
                    const n = Number(value);
                    if (!Number.isFinite(n) || value === "") return;
                    next[i][f] = f === "qty" ? Math.max(1, Math.round(n)) : Math.max(0, n);
                }
                if (next[i].type === "stock") next[i].premium = 0;
                // Changing the type re-draws the row (a stock leg has a price and no premium)
                onChange(next, f === "type");
            });
        });
    });
}

async function optionsPayoffChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Options payoff diagram: profit or loss at expiry against the underlying price, the Black-Scholes value
    // before expiry, breakevens, and maximum profit and loss, charted with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        FastBandRenderableSeries,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyyDataSeries,
        XyDataSeries,
        HorizontalLineAnnotation,
        VerticalLineAnnotation,
        TextAnnotation,
        ELabelPlacement,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        ELegendPlacement,
        ELegendOrientation,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- The option maths: payoff at expiry, Black-Scholes value before it ---
    // Standard normal cumulative distribution, from the Abramowitz and Stegun 7.1.26 erf approximation
    function normCdf(x) {
        const z = Math.abs(x) / Math.SQRT2;
        const t = 1 / (1 + 0.3275911 * z);
        const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
        const erf = 1 - poly * Math.exp(-z * z);
        return x >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
    }
    // Value of one option (or one share) at underlying price s, with t years left and volatility v
    function legValue(l, s, t, v) {
        if (l.type === "stock") return s;
        if (t <= 0 || v <= 0) return l.type === "call" ? Math.max(s - l.strike, 0) : Math.max(l.strike - s, 0);
        if (s <= 0) return l.type === "call" ? 0 : l.strike * Math.exp(-RATE * t);
        const d1 = (Math.log(s / l.strike) + (RATE + (v * v) / 2) * t) / (v * Math.sqrt(t));
        const d2 = d1 - v * Math.sqrt(t);
        const discountedStrike = l.strike * Math.exp(-RATE * t);
        return l.type === "call"
            ? s * normCdf(d1) - discountedStrike * normCdf(d2)
            : discountedStrike * normCdf(-d2) - s * normCdf(-d1);
    }
    // What was paid for one unit of the leg: the premium for an option, the price for stock
    const legCost = (l) => (l.type === "stock" ? l.strike : l.premium);
    // Profit or loss of the whole position at underlying price s, t years before expiry (t = 0: at expiry)
    const positionPnl = (legs, s, t, v) => legs.reduce((sum, l) => sum + l.side * l.qty * (legValue(l, s, t, v) - legCost(l)), 0);
    // Position delta: how much the value changes per 1.00 move in the underlying
    function positionDelta(legs, s, t, v) {
        return legs.reduce((sum, l) => {
            let d = 1;
            if (l.type !== "stock") {
                if (t <= 0) d = l.type === "call" ? (s > l.strike ? 1 : 0) : s < l.strike ? -1 : 0;
                else {
                    const d1 = (Math.log(s / l.strike) + (RATE + (v * v) / 2) * t) / (v * Math.sqrt(t));
                    d = l.type === "call" ? normCdf(d1) : normCdf(d1) - 1;
                }
            }
            return sum + l.side * l.qty * d;
        }, 0);
    }

    // The payoff at expiry is a straight line between strikes, so its extremes and zeros can be found exactly
    // from its value at 0 and at each strike, and its slope above the highest strike.
    function analyse(legs) {
        const knots = [...new Set([0, ...legs.map((l) => l.strike)])].sort((a, b) => a - b);
        const values = knots.map((k) => positionPnl(legs, k, 0, 0));
        // Above the highest strike, every call and share adds +1 (long) or -1 (short) per unit of price
        const slopeAbove = legs.reduce((sum, l) => sum + (l.type === "put" ? 0 : l.side * l.qty), 0);
        const breakevens = [];
        const addBreakeven = (x) => {
            if (!breakevens.some((b) => Math.abs(b - x) < 1e-9)) breakevens.push(x);
        };
        for (let i = 0; i < knots.length - 1; i++) {
            const [a, b] = [values[i], values[i + 1]];
            if (a === 0 && b !== 0) addBreakeven(knots[i]);
            else if (a * b < 0) addBreakeven(knots[i] + ((knots[i + 1] - knots[i]) * -a) / (b - a));
        }
        const last = values[values.length - 1];
        if (last === 0 && slopeAbove !== 0) addBreakeven(knots[knots.length - 1]);
        else if (slopeAbove !== 0 && last * slopeAbove < 0) addBreakeven(knots[knots.length - 1] - last / slopeAbove);
        return {
            maxProfit: slopeAbove > 0 ? Infinity : Math.max(...values),
            maxLoss: slopeAbove < 0 ? -Infinity : Math.min(...values),
            breakevens: breakevens.filter((x) => x > 0),
            netPremium: legs.reduce((sum, l) => sum + (l.type === "stock" ? 0 : l.side * l.qty * l.premium), 0)
        };
    }

    // --- The chart ---
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.chartDiv, {
        theme: new SciChartJsNavyTheme(),
        title: "Profit or loss per share",
        titleStyle: { fontSize: 15 }
    });
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "Underlying price at expiry",
        axisTitleStyle: { fontSize: 13 },
        autoRange: EAutoRange.Never,
        labelPrecision: 0
    });
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "Profit / loss",
        axisTitleStyle: { fontSize: 13 },
        autoRange: EAutoRange.Never,
        labelPrecision: 1
    });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // The payoff at expiry as a band against zero: green where it is above zero (profit), red below (loss)
    const expiryData = new XyyDataSeries(wasmContext, { dataSeriesName: "P&L at expiry", dataIsSortedInX: true });
    const valueData = new XyDataSeries(wasmContext, { dataSeriesName: "P&L before expiry", dataIsSortedInX: true });
    const breakevenData = new XyDataSeries(wasmContext, { dataSeriesName: "Breakeven", dataIsSortedInX: true });
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: expiryData,
            stroke: "#F2F5FA",
            strokeY1: "#00000000",
            fillY1: "#26A69A66", // y above y1 (zero): profit
            fill: "#EF535066", // y below y1 (zero): loss
            strokeThickness: 3
        }),
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: valueData,
            stroke: "#50C7E0",
            strokeThickness: 2,
            strokeDashArray: [8, 4]
        }),
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: breakevenData,
            pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "#F5E663", stroke: "#22365B" })
        })
    );

    const zeroLine = new HorizontalLineAnnotation({ y1: 0, stroke: "#C8D3E8", strokeThickness: 1 });
    const spotLine = new VerticalLineAnnotation({
        x1: SPOT,
        stroke: "#C8D3E8",
        strokeThickness: 1,
        strokeDashArray: [3, 5],
        showLabel: true,
        labelPlacement: ELabelPlacement.Axis,
        labelValue: `Today ${SPOT}`
    });
    const limitLine = (color) =>
        new HorizontalLineAnnotation({
            y1: 0,
            stroke: color,
            strokeThickness: 1,
            strokeDashArray: [6, 4],
            showLabel: true,
            labelPlacement: ELabelPlacement.TopRight,
            axisLabelFill: color,
            axisLabelStroke: "#22365B"
        });
    const maxProfitLine = limitLine("#26A69A");
    const maxLossLine = limitLine("#EF5350");
    // Up to four breakeven labels; unused ones are hidden
    const breakevenLabels = [0, 1, 2, 3].map(
        () =>
            new TextAnnotation({
                text: "",
                textColor: "#F5E663",
                fontSize: 13,
                y1: 0,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Top,
                yCoordShift: 8
            })
    );
    sciChartSurface.annotations.add(zeroLine, spotLine, maxProfitLine, maxLossLine, ...breakevenLabels);
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showYLine: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new LegendModifier({
            showCheckboxes: true,
            orientation: ELegendOrientation.Horizontal,
            placement: ELegendPlacement.TopLeft
        })
    );

    // --- Redraw from the legs and the sliders ---
    let legs = PRESETS["Long call"].map((l) => ({ ...l }));
    const fmt = (x) => x.toFixed(2);
    function update(rescale) {
        const days = Number(ui.days.value);
        const vol = Number(ui.vol.value) / 100;
        ui.daysOut.textContent = `${days}`;
        ui.volOut.textContent = `${Math.round(vol * 100)}%`;
        const t = days / 365;

        // x range: 60 to 140 around today's price of 100, widened to keep every strike well inside
        const strikes = legs.map((l) => l.strike);
        const xMin = Math.max(0, Math.min(SPOT * 0.6, Math.min(...strikes) - 20));
        const xMax = Math.max(SPOT * 1.4, Math.max(...strikes) + 20);
        const result = analyse(legs);

        // Sample every 0.25, plus each strike and breakeven exactly, so the kinks and zero crossings are sharp
        const xs = [];
        for (let x = xMin; x <= xMax + 1e-9; x += 0.25) xs.push(x);
        xs.push(...strikes.filter((k) => k > xMin && k < xMax), ...result.breakevens.filter((b) => b > xMin && b < xMax));
        xs.sort((a, b) => a - b);
        const expiry = xs.map((x) => positionPnl(legs, x, 0, 0));
        expiryData.clear();
        expiryData.appendRange(xs, expiry, new Array(xs.length).fill(0));
        valueData.clear();
        valueData.appendRange(xs, xs.map((x) => positionPnl(legs, x, t, vol)));
        breakevenData.clear();
        breakevenData.appendRange(result.breakevens, result.breakevens.map(() => 0));
        breakevenLabels.forEach((label, i) => {
            const b = result.breakevens[i];
            label.isHidden = b === undefined;
            if (b !== undefined) {
                label.x1 = b;
                label.text = fmt(b);
            }
        });

        const limitText = (value) => (Number.isFinite(value) ? fmt(Math.abs(value)) : "unlimited");
        maxProfitLine.isHidden = !Number.isFinite(result.maxProfit) || result.maxProfit <= 0;
        maxProfitLine.y1 = Number.isFinite(result.maxProfit) ? result.maxProfit : 0;
        maxProfitLine.labelValue = `Max profit ${limitText(result.maxProfit)}`;
        maxLossLine.isHidden = !Number.isFinite(result.maxLoss) || result.maxLoss >= 0;
        maxLossLine.y1 = Number.isFinite(result.maxLoss) ? result.maxLoss : 0;
        maxLossLine.labelValue = `Max loss ${limitText(result.maxLoss)}`;

        // Readout: everything per share; multiply by 100 for a standard equity option contract
        const premium = result.netPremium;
        const premiumText =
            premium > 0 ? `paid ${fmt(premium)} (debit)` : premium < 0 ? `received ${fmt(-premium)} (credit)` : "none";
        const breakevenText = result.breakevens.length ? result.breakevens.map(fmt).join(" and ") : "none";
        const nowPnl = positionPnl(legs, SPOT, t, vol);
        const delta = positionDelta(legs, SPOT, t, vol);
        ui.summary.innerHTML =
            `Net premium: <b>${premiumText}</b> · Max profit: <b>${limitText(result.maxProfit)}</b> · ` +
            `Max loss: <b>${limitText(result.maxLoss)}</b> · Breakeven at expiry: <b>${breakevenText}</b> · ` +
            `At ${SPOT} with ${days} days left: P&L ${nowPnl >= 0 ? "+" : "−"}${fmt(Math.abs(nowPnl))}, ` +
            `delta ${Math.abs(delta) < 0.005 ? "0.00" : (delta < 0 ? "−" : "") + Math.abs(delta).toFixed(2)} (per share)`;

        if (rescale) {
            // Fit the y axis to the expiry payoff and the value curve, with a margin
            const before = xs.map((x) => positionPnl(legs, x, t, vol));
            const yMin = Math.min(0, ...expiry, ...before);
            const yMax = Math.max(0, ...expiry, ...before);
            const pad = Math.max(1, (yMax - yMin) * 0.12);
            xAxis.visibleRange = new NumberRange(xMin, xMax);
            yAxis.visibleRange = new NumberRange(yMin - pad, yMax + pad);
        }
    }

    // --- Wiring the controls ---
    function setLegs(next, redrawRows) {
        legs = next;
        ui.strategy.value = "Custom";
        if (redrawRows) renderLegRows(ui, () => legs, setLegs);
        update(true);
    }
    function loadPreset(name) {
        legs = PRESETS[name].map((l) => ({ ...l }));
        renderLegRows(ui, () => legs, setLegs);
        update(true);
    }
    ui.strategy.addEventListener("change", () => {
        if (ui.strategy.value !== "Custom") loadPreset(ui.strategy.value);
    });
    ui.days.addEventListener("input", () => update(false));
    ui.vol.addEventListener("input", () => update(false));
    ui.addButton.addEventListener("click", () => {
        if (legs.length >= 6) return;
        setLegs([...legs, leg(1, 1, "call", 110, 1.2)], true);
    });
    loadPreset("Long call");
    // #region_A_end
}

optionsPayoffChart("scichart-root");
