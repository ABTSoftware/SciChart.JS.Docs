import * as SciChart from "scichart";

const BARS = 260; // about one year of daily bars
// The simulated market moves through four phases, so you can compare the oscillator in ranges and trends
const PHASES = [
    { name: "Range", from: 0, to: 100 },
    { name: "Uptrend", from: 100, to: 170 },
    { name: "Downtrend", from: 170, to: 220 },
    { name: "Range", from: 220, to: BARS }
];

// Sample data: seeded random numbers, so the chart looks the same every time and needs no market data feed.
// normalNoise returns n standard normal values (mean 0, standard deviation 1) from a seeded generator.
function normalNoise(seed, n) {
    let state = seed;
    const random = () => {
        state = (state * 16807) % 2147483647;
        return (state - 1) / 2147483646;
    };
    const values = [];
    while (values.length < n) {
        const radius = Math.sqrt(-2 * Math.log(random() + 1e-12));
        const angle = 2 * Math.PI * random();
        values.push(radius * Math.cos(angle), radius * Math.sin(angle));
    }
    return values.slice(0, n);
}

// Weekdays from Monday 6 January 2025, as Unix seconds (holidays are ignored)
function tradingDates(n) {
    const dates = [];
    for (let t = Date.UTC(2025, 0, 6) / 1000; dates.length < n; t += 86400) {
        const weekday = new Date(t * 1000).getUTCDay();
        if (weekday !== 0 && weekday !== 6) dates.push(t);
    }
    return dates;
}

// Simulated daily candles. In the ranges, the price is pulled back towards a fixed level each day;
// in the trends, it drifts 0.6% a day up or 0.7% a day down. Daily volatility is about 1%.
function simulateCandles(seed) {
    const z = normalNoise(seed, BARS * 4);
    const open = [];
    const high = [];
    const low = [];
    const close = [];
    let previous = 100;
    let anchor = 100; // the level a range is pulled back towards
    for (let i = 0; i < BARS; i++) {
        const phase = PHASES.find((p) => i >= p.from && i < p.to);
        if (i === phase.from) anchor = previous;
        let logReturn;
        if (phase.name === "Uptrend") logReturn = 0.006 + 0.01 * z[4 * i];
        else if (phase.name === "Downtrend") logReturn = -0.007 + 0.011 * z[4 * i];
        else logReturn = -0.15 * Math.log(previous / anchor) + 0.011 * z[4 * i];
        const o = previous * Math.exp(0.003 * z[4 * i + 1]);
        const c = previous * Math.exp(logReturn);
        open.push(o);
        close.push(c);
        high.push(Math.max(o, c) * (1 + Math.abs(0.006 * z[4 * i + 2])));
        low.push(Math.min(o, c) * (1 - Math.abs(0.006 * z[4 * i + 3])));
        previous = c;
    }
    return { open, high, low, close };
}

// The controls, the two charts and the readout each need an element. This splits the page's div into a control bar,
// the price chart, the oscillator chart and a readout; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const slider = (id, label, min, max, value) =>
        `<label>${label} <input data-id="${id}" type="range" min="${min}" max="${max}" step="1" value="${value}" ` +
        `style="vertical-align:middle; width:90px"> <output data-id="${id}"></output></label>`;
    const button = (id, label) =>
        `<button data-id="${id}" type="button" aria-pressed="false" style="font:inherit; padding:2px 10px; border-radius:12px; ` +
        `border:1px solid #50C7E0; background:transparent; color:#ffffff; cursor:pointer">${label}</button>`;
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        slider("lookback", "Look-back N", 5, 30, 14) +
        slider("kSmoothing", "%K smoothing", 1, 5, 3) +
        slider("dSmoothing", "%D smoothing", 1, 5, 3) +
        `<span role="group" aria-label="Presets" style="display:inline-flex; gap:6px; align-items:center">Presets ` +
        button("fast", "Fast 14,3") +
        button("slow", "Slow 14,3") +
        button("full", "Full 14,3,3") +
        `</span>` +
        `<label>Zones <select data-id="zones" style="font:inherit">` +
        `<option value="80">80 / 20</option><option value="70">70 / 30</option><option value="90">90 / 10</option></select></label>` +
        `<label><input data-id="range" type="checkbox" checked> Show the N-bar high–low range</label>`;
    const priceDiv = document.createElement("div");
    priceDiv.id = divElementId + "-price"; // each chart's div needs its own id
    priceDiv.style.cssText = "flex:3; min-height:250px;";
    const oscillatorDiv = document.createElement("div");
    oscillatorDiv.id = divElementId + "-oscillator";
    oscillatorDiv.style.cssText = "flex:2; min-height:170px;";
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:6px 12px; color:#ffffff; font-size:13px; line-height:1.5;" + font;
    root.append(bar, priceDiv, oscillatorDiv, readout);
    const get = (selector) => bar.querySelector(selector);
    return {
        priceDiv,
        oscillatorDiv,
        readout,
        lookback: get('input[data-id="lookback"]'),
        lookbackOut: get('output[data-id="lookback"]'),
        kSmoothing: get('input[data-id="kSmoothing"]'),
        kSmoothingOut: get('output[data-id="kSmoothing"]'),
        dSmoothing: get('input[data-id="dSmoothing"]'),
        dSmoothingOut: get('output[data-id="dSmoothing"]'),
        presets: { fast: get('button[data-id="fast"]'), slow: get('button[data-id="slow"]'), full: get('button[data-id="full"]') },
        zones: get('select[data-id="zones"]'),
        range: get('input[data-id="range"]')
    };
}

async function stochasticChart(divElementId) {
    const ui = createLayout(divElementId);
    const dates = tradingDates(BARS);
    const candles = simulateCandles(4021);

    // #region_A_start
    // A candlestick chart with a stochastic oscillator (%K and %D) in a pane below it, with SciChart.js
    const {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        ELabelPlacement,
        OhlcDataSeries,
        XyDataSeries,
        FastCandlestickRenderableSeries,
        FastLineRenderableSeries,
        BoxAnnotation,
        TextAnnotation,
        HorizontalLineAnnotation,
        SciChartJsNavyTheme,
        LegendModifier,
        ELegendPlacement,
        ELegendOrientation,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        CustomChartModifier2D,
        translateFromCanvasToSeriesViewRect,
        Thickness
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Stochastic maths (plain JavaScript) ---
    // Simple moving average over the last m values; NaN until m values exist. m = 1 returns the values unchanged.
    function sma(values, m) {
        return values.map((_, i) => {
            if (i < m - 1) return NaN;
            let sum = 0;
            for (let j = i - m + 1; j <= i; j++) sum += values[j];
            return sum / m; // NaN if any value in the window is NaN
        });
    }

    // The full stochastic: raw %K over n bars, %K = raw %K smoothed over kSmoothing bars, %D = %K smoothed over dSmoothing.
    // kSmoothing = 1 gives the fast stochastic; kSmoothing = 3 gives the slow stochastic.
    function stochastic(high, low, close, n, kSmoothing, dSmoothing) {
        const highestHigh = [];
        const lowestLow = [];
        const rawK = [];
        for (let i = 0; i < close.length; i++) {
            if (i < n - 1) {
                highestHigh.push(NaN);
                lowestLow.push(NaN);
                rawK.push(NaN);
                continue;
            }
            let hh = -Infinity;
            let ll = Infinity;
            for (let j = i - n + 1; j <= i; j++) {
                hh = Math.max(hh, high[j]);
                ll = Math.min(ll, low[j]);
            }
            highestHigh.push(hh);
            lowestLow.push(ll);
            // where the close sits in the n-bar range, 0 to 100; a flat range (high = low) is taken as 50
            rawK.push(hh > ll ? (100 * (close[i] - ll)) / (hh - ll) : 50);
        }
        const k = sma(rawK, kSmoothing);
        const d = sma(k, dSmoothing);
        return { highestHigh, lowestLow, rawK, k, d };
    }

    // Share of each phase's bars with %K above the upper zone and below the lower zone
    function timeInZones(k, upper, lower) {
        return PHASES.map((phase) => {
            let above = 0;
            let below = 0;
            let count = 0;
            for (let i = phase.from; i < phase.to; i++) {
                if (!Number.isFinite(k[i])) continue;
                count++;
                if (k[i] > upper) above++;
                if (k[i] < lower) below++;
            }
            return { name: phase.name, above: above / count, below: below / count };
        });
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const COLOURS = { up: "#26a69a", down: "#ef5350", k: "#50C7E0", d: "#F48420", range: "#F6E05E" };
    const fmtDate = (index) => {
        const t = dates[Math.round(index)];
        return t === undefined ? "" : new Date(t * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
    };
    // x is the bar number (no weekend gaps); the labels show each bar's date
    const makeXAxis = (wasmContext) => {
        const axis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.01, 0.03) });
        axis.labelProvider.formatLabel = fmtDate;
        axis.labelProvider.formatCursorLabel = fmtDate;
        return axis;
    };
    const modifiers = () => [
        new CursorModifier({ showTooltip: false, modifierGroup: "stochastic" }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new LegendModifier({ placement: ELegendPlacement.TopLeft, orientation: ELegendOrientation.Horizontal, showCheckboxes: false })
    ];

    // 1. Price: daily candles
    const top = await SciChartSurface.create(ui.priceDiv, { theme });
    const priceX = makeXAxis(top.wasmContext);
    top.sciChartSurface.xAxes.add(priceX);
    top.sciChartSurface.yAxes.add(
        new NumericAxis(top.wasmContext, { axisTitle: "Price", autoRange: EAutoRange.Always, growBy: new NumberRange(0.05, 0.3), labelPrecision: 0 })
    );
    const barNumbers = dates.map((_, i) => i);
    top.sciChartSurface.renderableSeries.add(
        new FastCandlestickRenderableSeries(top.wasmContext, {
            dataSeries: new OhlcDataSeries(top.wasmContext, {
                xValues: barNumbers,
                openValues: candles.open,
                highValues: candles.high,
                lowValues: candles.low,
                closeValues: candles.close,
                dataSeriesName: "Price (simulated daily candles)"
            }),
            brushUp: COLOURS.up,
            brushDown: COLOURS.down,
            strokeUp: COLOURS.up,
            strokeDown: COLOURS.down
        })
    );
    // Label the phases of the simulation along the top of the price chart, and shade the trends
    for (const phase of PHASES) {
        top.sciChartSurface.annotations.add(
            new TextAnnotation({
                x1: (phase.from + phase.to - 1) / 2, // centred on the phase, below the legend
                y1: 0.12,
                yCoordinateMode: ECoordinateMode.Relative,
                text: phase.name,
                fontSize: 13,
                textColor: "#C8D3E6",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Top
            })
        );
        if (phase.name !== "Range") {
            top.sciChartSurface.annotations.add(
                new BoxAnnotation({ x1: phase.from - 0.5, x2: phase.to - 0.5, yCoordinateMode: ECoordinateMode.Relative, y1: 0, y2: 1, fill: "#FFFFFF0D", strokeThickness: 0 })
            );
        }
    }
    // The N-bar window behind the selected %K value: a box from the lowest low to the highest high, with labels
    const rangeBox = new BoxAnnotation({ x1: 0, x2: 1, y1: 0, y2: 1, fill: COLOURS.range + "22", stroke: COLOURS.range, strokeThickness: 1 });
    const label = (vertical) =>
        new TextAnnotation({
            x1: 0,
            y1: 0,
            text: "",
            fontSize: 12,
            textColor: "#FFFFFF",
            background: "#14233CCC",
            padding: new Thickness(2, 4, 2, 4),
            horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
            verticalAnchorPoint: vertical
        });
    const highLabel = label(EVerticalAnchorPoint.Bottom);
    const lowLabel = label(EVerticalAnchorPoint.Top);
    top.sciChartSurface.annotations.add(rangeBox, highLabel, lowLabel);
    top.sciChartSurface.chartModifiers.add(...modifiers());

    // 2. Oscillator: %K and %D on a fixed 0 to 100 scale, with the overbought and oversold zones shaded
    const bottom = await SciChartSurface.create(ui.oscillatorDiv, { theme });
    const oscillatorX = makeXAxis(bottom.wasmContext);
    bottom.sciChartSurface.xAxes.add(oscillatorX);
    bottom.sciChartSurface.yAxes.add(
        new NumericAxis(bottom.wasmContext, { axisTitle: "Stochastic", autoRange: EAutoRange.Never, visibleRange: new NumberRange(-4, 104), labelPrecision: 0 })
    );
    const kData = new XyDataSeries(bottom.wasmContext, { dataSeriesName: "%K", isSorted: true, containsNaN: true });
    const dData = new XyDataSeries(bottom.wasmContext, { dataSeriesName: "%D", isSorted: true, containsNaN: true });
    bottom.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(bottom.wasmContext, { dataSeries: kData, stroke: COLOURS.k, strokeThickness: 2 }),
        new FastLineRenderableSeries(bottom.wasmContext, { dataSeries: dData, stroke: COLOURS.d, strokeThickness: 2, strokeDashArray: [5, 3] })
    );
    const zone = (fill) => new BoxAnnotation({ xCoordinateMode: ECoordinateMode.Relative, x1: 0, x2: 1, y1: 0, y2: 0, fill, strokeThickness: 0 });
    const upperZone = zone("#EF535033");
    const lowerZone = zone("#26A69A33");
    const level = () =>
        new HorizontalLineAnnotation({ y1: 0, stroke: "#C8D3E6", strokeThickness: 1, strokeDashArray: [4, 4], showLabel: true, labelPlacement: ELabelPlacement.Axis, axisLabelFill: "#C8D3E6" });
    const upperLine = level();
    const lowerLine = level();
    bottom.sciChartSurface.annotations.add(upperZone, lowerZone, upperLine, lowerLine);
    bottom.sciChartSurface.chartModifiers.add(...modifiers());

    // Line up the y-axes and keep both charts on the same bars when you zoom or pan either one
    const group = new SciChartVerticalGroup();
    group.addSurfaceToGroup(top.sciChartSurface);
    group.addSurfaceToGroup(bottom.sciChartSurface);
    const link = (from, to) =>
        from.visibleRangeChanged.subscribe(({ visibleRange }) => {
            if (!to.visibleRange.equals(visibleRange)) to.visibleRange = visibleRange;
        });
    link(priceX, oscillatorX);
    link(oscillatorX, priceX);

    // Hovering either chart selects a bar; leaving the charts selects the latest bar again
    class HoverBarModifier extends CustomChartModifier2D {
        onBar = (index) => {};
        modifierMouseMove(args) {
            super.modifierMouseMove(args);
            const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            if (!point) return this.onBar(-1);
            const x = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(point.x);
            this.onBar(Math.max(0, Math.min(BARS - 1, Math.round(x))));
        }
        modifierMouseLeave(args) {
            super.modifierMouseLeave(args);
            this.onBar(-1);
        }
    }

    // --- The controls: recompute, redraw and explain the selected bar ---
    let result = null;
    let selected = -1; // -1: the latest bar
    const settings = () => ({ n: Number(ui.lookback.value), kS: Number(ui.kSmoothing.value), dS: Number(ui.dSmoothing.value) });
    const name = ({ n, kS, dS }) => (kS === 1 ? `Fast ${n},${dS}` : kS === 3 && dS === 3 ? `Slow ${n},3 (full ${n},3,3)` : `Full ${n},${kS},${dS}`);
    const one = (value) => (Number.isFinite(value) ? value.toFixed(1) : "–");
    const percent = (share) => `${Math.round(share * 100)}%`;

    function showBar() {
        const i = selected >= 0 ? selected : BARS - 1;
        const { n } = settings();
        const hh = result.highestHigh[i];
        const ll = result.lowestLow[i];
        const hasRange = Number.isFinite(hh);
        const visible = ui.range.checked && hasRange;
        for (const annotation of [rangeBox, highLabel, lowLabel]) annotation.isHidden = !visible;
        if (hasRange) {
            rangeBox.x1 = i - n + 1 - 0.5;
            rangeBox.x2 = i + 0.5;
            rangeBox.y1 = ll;
            rangeBox.y2 = hh;
            highLabel.x1 = lowLabel.x1 = i - n + 1 - 0.5;
            highLabel.y1 = hh;
            lowLabel.y1 = ll;
            highLabel.text = `Highest high ${hh.toFixed(2)}`;
            lowLabel.text = `Lowest low ${ll.toFixed(2)}`;
        }
        const upper = Number(ui.zones.value);
        const shares = timeInZones(result.k, upper, 100 - upper)
            .map((s) => `${s.name}: ${percent(s.above)} above ${upper}, ${percent(s.below)} below ${100 - upper}`)
            .join(" · ");
        const where = selected >= 0 ? "Hovered bar" : "Latest bar";
        ui.readout.innerHTML =
            `<div><strong>${name(settings())}</strong> · ${where}, ${fmtDate(i)}: close ${candles.close[i].toFixed(2)}, ` +
            (hasRange
                ? `${n}-bar highest high ${hh.toFixed(2)}, lowest low ${ll.toFixed(2)}, raw %K ${one(result.rawK[i])}, ` +
                  `<span style="color:${COLOURS.k}">%K ${one(result.k[i])}</span>, <span style="color:${COLOURS.d}">%D ${one(result.d[i])}</span>`
                : `not enough bars yet for a ${n}-bar range`) +
            `</div><div>Share of bars with %K in the zones · ${shares}</div>`;
    }

    function update() {
        const s = settings();
        ui.lookbackOut.textContent = `${s.n} bars`;
        ui.kSmoothingOut.textContent = s.kS === 1 ? "1 (none)" : `${s.kS}`;
        ui.dSmoothingOut.textContent = `${s.dS}`;
        for (const [key, button] of Object.entries(ui.presets)) {
            const on = s.n === 14 && s.dS === 3 && (key === "fast" ? s.kS === 1 : s.kS === 3);
            button.setAttribute("aria-pressed", String(on));
            button.style.background = on ? "#50C7E0" : "transparent";
            button.style.color = on ? "#14233C" : "#ffffff";
        }
        result = stochastic(candles.high, candles.low, candles.close, s.n, s.kS, s.dS);
        kData.clear();
        kData.appendRange(barNumbers, result.k);
        dData.clear();
        dData.appendRange(barNumbers, result.d);
        const upper = Number(ui.zones.value);
        upperZone.y1 = upper;
        upperZone.y2 = 100;
        lowerZone.y1 = 0;
        lowerZone.y2 = 100 - upper;
        upperLine.y1 = upper;
        lowerLine.y1 = 100 - upper;
        showBar();
    }

    const preset = (n, kS, dS) => () => {
        ui.lookback.value = String(n);
        ui.kSmoothing.value = String(kS);
        ui.dSmoothing.value = String(dS);
        update();
    };
    ui.presets.fast.addEventListener("click", preset(14, 1, 3));
    ui.presets.slow.addEventListener("click", preset(14, 3, 3));
    ui.presets.full.addEventListener("click", preset(14, 3, 3));
    for (const input of [ui.lookback, ui.kSmoothing, ui.dSmoothing]) input.addEventListener("input", update);
    ui.zones.addEventListener("change", update);
    ui.range.addEventListener("change", showBar);
    for (const surface of [top.sciChartSurface, bottom.sciChartSurface]) {
        const hover = new HoverBarModifier();
        hover.onBar = (index) => {
            if (index === selected) return;
            selected = index;
            showBar();
        };
        surface.chartModifiers.add(hover);
    }
    update();
    // #region_A_end
}

stochasticChart("scichart-root");
