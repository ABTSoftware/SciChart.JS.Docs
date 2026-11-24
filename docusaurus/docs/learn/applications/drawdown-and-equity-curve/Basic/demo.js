import * as SciChart from "scichart";

const TRADING_DAYS_PER_YEAR = 252;
const DAYS = 1261; // five years of trading days, plus the starting day
const START_VALUE = 10000; // the account starts at $10,000
const REGIME = { from: 756, to: 1008 }; // year 4: the strategy's edge fades (no drift, 40% more volatility)
const CRASH = { from: 420, days: 20, depth: 0.3 }; // "Add a crash": a 30% fall spread over 20 trading days

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

// Weekdays from Monday 4 January 2021, as Unix seconds (holidays are ignored)
function tradingDates(n) {
    const dates = [];
    for (let t = Date.UTC(2021, 0, 4) / 1000; dates.length < n; t += 86400) {
        const weekday = new Date(t * 1000).getUTCDay();
        if (weekday !== 0 && weekday !== 6) dates.push(t);
    }
    return dates;
}

// A simulated account: each day's log return is the drift's daily share plus noise scaled by the volatility.
// drift and volatility are annual (0.12 = 12%). The same noise is reused when settings change, so only the
// setting you move changes the curve.
function simulateEquity(noise, { drift, volatility, crash, regimeChange }) {
    const equity = [START_VALUE];
    for (let i = 1; i < noise.length; i++) {
        const inRegime = regimeChange && i >= REGIME.from && i < REGIME.to;
        const dailyDrift = inRegime ? 0 : Math.log(1 + drift) / TRADING_DAYS_PER_YEAR;
        const dailyVolatility = (inRegime ? volatility * 1.4 : volatility) / Math.sqrt(TRADING_DAYS_PER_YEAR);
        let logReturn = dailyDrift + dailyVolatility * noise[i];
        if (crash && i >= CRASH.from && i < CRASH.from + CRASH.days) logReturn += Math.log(1 - CRASH.depth) / CRASH.days;
        equity.push(equity[i - 1] * Math.exp(logReturn));
    }
    return equity;
}

// The controls, the two charts and the readout each need an element. This splits the page's div into a control bar,
// the equity chart, the underwater chart and a readout; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const slider = (id, label, min, max, value) =>
        `<label>${label} <input data-id="${id}" type="range" min="${min}" max="${max}" step="1" value="${value}" ` +
        `style="vertical-align:middle; width:110px"> <output data-id="${id}"></output></label>`;
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        slider("volatility", "Strategy volatility", 5, 40, 15) +
        slider("drift", "Drift", -5, 30, 12) +
        `<label><input data-id="crash" type="checkbox"> Add a crash</label>` +
        `<label><input data-id="log" type="checkbox"> Log scale</label>` +
        `<label><input data-id="benchmark" type="checkbox" checked> Compare to benchmark</label>`;
    const equityDiv = document.createElement("div");
    equityDiv.id = divElementId + "-equity"; // each chart's div needs its own id
    equityDiv.style.cssText = "flex:3; min-height:240px;";
    const underwaterDiv = document.createElement("div");
    underwaterDiv.id = divElementId + "-underwater";
    underwaterDiv.style.cssText = "flex:2; min-height:180px;";
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:6px 12px; color:#ffffff; font-size:13px; overflow-x:auto;" + font;
    root.append(bar, equityDiv, underwaterDiv, readout);
    const get = (selector) => bar.querySelector(selector);
    return {
        equityDiv,
        underwaterDiv,
        readout,
        volatility: get('input[data-id="volatility"]'),
        volatilityOut: get('output[data-id="volatility"]'),
        drift: get('input[data-id="drift"]'),
        driftOut: get('output[data-id="drift"]'),
        crash: get('input[data-id="crash"]'),
        log: get('input[data-id="log"]'),
        benchmark: get('input[data-id="benchmark"]')
    };
}

async function drawdownChart(divElementId) {
    const ui = createLayout(divElementId);
    const dates = tradingDates(DAYS);
    const strategyNoise = normalNoise(1531, DAYS);
    const benchmarkNoise = normalNoise(2531, DAYS);

    // #region_A_start
    // An equity curve with its running peak, and an underwater (drawdown) chart below it, with SciChart.js
    const {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        LogarithmicAxis,
        DateTimeNumericAxis,
        NumberRange,
        EAutoRange,
        ENumericFormat,
        EXyDirection,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        ELabelPlacement,
        FastLineRenderableSeries,
        FastMountainRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
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
        Thickness
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Drawdown maths (plain JavaScript) ---
    // Running peak, drawdown from that peak, the maximum drawdown with its peak, trough and recovery, the longest
    // time below a previous peak, and the summary ratios
    function drawdownStats(equity) {
        const runningPeak = [];
        const drawdown = []; // 0 at a new high, negative below it (-0.25 = 25% below the peak)
        let peak = equity[0];
        let peakIndex = 0;
        let maxDrawdown = 0;
        let maxPeakIndex = 0;
        let troughIndex = 0;
        let longest = 0; // trading days from a peak until the account first gets back to it
        for (let i = 0; i < equity.length; i++) {
            if (equity[i] >= peak) {
                longest = Math.max(longest, i - peakIndex);
                peak = equity[i];
                peakIndex = i;
            }
            runningPeak.push(peak);
            drawdown.push(equity[i] / peak - 1);
            if (drawdown[i] < maxDrawdown) {
                maxDrawdown = drawdown[i];
                maxPeakIndex = peakIndex;
                troughIndex = i;
            }
        }
        const stillUnderwater = equity.length - 1 - peakIndex; // a drawdown that hasn't ended yet counts too
        longest = Math.max(longest, stillUnderwater);
        let recoveryIndex = -1; // -1: not recovered by the end of the data
        for (let i = troughIndex; i < equity.length; i++) {
            if (equity[i] >= equity[maxPeakIndex]) {
                recoveryIndex = i;
                break;
            }
        }
        const years = (equity.length - 1) / TRADING_DAYS_PER_YEAR;
        const growth = equity[equity.length - 1] / equity[0];
        const cagr = Math.pow(growth, 1 / years) - 1; // compound annual growth rate
        return {
            runningPeak,
            drawdown,
            maxDrawdown,
            peakIndex: maxPeakIndex,
            troughIndex,
            recoveryIndex,
            longest,
            totalReturn: growth - 1,
            cagr,
            calmar: maxDrawdown < 0 ? cagr / -maxDrawdown : NaN // Calmar ratio over the whole period
        };
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const group = new SciChartVerticalGroup(); // lines up the two charts' y-axes
    const COLOURS = { strategy: "#50C7E0", peak: "#F6E05E", benchmark: "#F48420", drawdown: "#EF5350" };
    const percent = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`.replace("-", "−");
    const dollars = (value) => `$${Math.round(value).toLocaleString("en-US")}`;
    const modifiers = () => [
        new CursorModifier({ showTooltip: true, modifierGroup: "drawdown" }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new LegendModifier({ placement: ELegendPlacement.TopLeft, orientation: ELegendOrientation.Horizontal, showCheckboxes: false })
    ];

    // 1. Equity curves: account value over time, with the strategy's running peak
    const top = await SciChartSurface.create(ui.equityDiv, { theme });
    const topX = new DateTimeNumericAxis(top.wasmContext);
    top.sciChartSurface.xAxes.add(topX);
    // The value axis can be linear or logarithmic. On a log axis, equal heights are equal percentage changes.
    function makeValueAxis(isLog) {
        const options = {
            axisTitle: isLog ? "Account value (log scale)" : "Account value",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.3), // room above the curves for the legend and labels
            labelPrefix: "$",
            labelFormat: ENumericFormat.Engineering, // $10K, $12.5K ...
            labelPrecision: 1
        };
        return isLog ? new LogarithmicAxis(top.wasmContext, { ...options, logBase: 2 }) : new NumericAxis(top.wasmContext, options);
    }
    top.sciChartSurface.yAxes.add(makeValueAxis(false));
    const strategyData = new XyDataSeries(top.wasmContext, { dataSeriesName: "Strategy", isSorted: true });
    const peakData = new XyDataSeries(top.wasmContext, { dataSeriesName: "Running peak", isSorted: true });
    const benchmarkData = new XyDataSeries(top.wasmContext, { dataSeriesName: "Benchmark", isSorted: true });
    const markerData = new XyDataSeries(top.wasmContext, { dataSeriesName: "Max drawdown: peak, trough, recovery" });
    const benchmarkLine = new FastLineRenderableSeries(top.wasmContext, { dataSeries: benchmarkData, stroke: COLOURS.benchmark, strokeThickness: 1.5 });
    top.sciChartSurface.renderableSeries.add(
        benchmarkLine,
        new FastLineRenderableSeries(top.wasmContext, { dataSeries: peakData, stroke: COLOURS.peak, strokeThickness: 1.5, strokeDashArray: [6, 4] }),
        new FastLineRenderableSeries(top.wasmContext, { dataSeries: strategyData, stroke: COLOURS.strategy, strokeThickness: 2 }),
        new XyScatterRenderableSeries(top.wasmContext, {
            dataSeries: markerData,
            pointMarker: new EllipsePointMarker(top.wasmContext, { width: 11, height: 11, fill: "#FFFFFF", stroke: COLOURS.drawdown, strokeThickness: 2 })
        })
    );
    top.sciChartSurface.chartModifiers.add(...modifiers());

    // 2. Underwater chart: drawdown from the running peak, as a negative area below zero
    const bottom = await SciChartSurface.create(ui.underwaterDiv, { theme });
    const bottomX = new DateTimeNumericAxis(bottom.wasmContext);
    bottom.sciChartSurface.xAxes.add(bottomX);
    const drawdownAxis = new NumericAxis(bottom.wasmContext, {
        axisTitle: "Drawdown",
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0.08, 0.35) // room above 0% for the legend
    });
    // Drawdown is never above 0%, so leave the space above zero unlabelled
    drawdownAxis.labelProvider.formatLabel = (value) => (value > 0.001 ? "" : `${value.toFixed(0)}%`.replace("-", "−"));
    bottom.sciChartSurface.yAxes.add(drawdownAxis);
    const strategyDrawdown = new XyDataSeries(bottom.wasmContext, { dataSeriesName: "Strategy drawdown", isSorted: true });
    const benchmarkDrawdown = new XyDataSeries(bottom.wasmContext, { dataSeriesName: "Benchmark drawdown", isSorted: true });
    const benchmarkUnderwater = new FastLineRenderableSeries(bottom.wasmContext, {
        dataSeries: benchmarkDrawdown,
        stroke: COLOURS.benchmark,
        strokeThickness: 1.5
    });
    bottom.sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(bottom.wasmContext, {
            dataSeries: strategyDrawdown,
            zeroLineY: 0, // fill between the line and 0%, so the area hangs below zero
            fill: COLOURS.drawdown + "66",
            stroke: COLOURS.drawdown,
            strokeThickness: 1.5
        }),
        benchmarkUnderwater
    );
    bottom.sciChartSurface.chartModifiers.add(...modifiers());

    // Line up the y-axes and keep both charts on the same dates when you zoom or pan either one
    group.addSurfaceToGroup(top.sciChartSurface);
    group.addSurfaceToGroup(bottom.sciChartSurface);
    const link = (from, to) =>
        from.visibleRangeChanged.subscribe(({ visibleRange }) => {
            if (!to.visibleRange.equals(visibleRange)) to.visibleRange = visibleRange;
        });
    link(topX, bottomX);
    link(bottomX, topX);

    // The year-4 regime change, shaded on both charts
    for (const surface of [top.sciChartSurface, bottom.sciChartSurface]) {
        surface.annotations.add(
            new BoxAnnotation({
                x1: dates[REGIME.from],
                x2: dates[REGIME.to],
                yCoordinateMode: ECoordinateMode.Relative,
                y1: 0,
                y2: 1,
                fill: "#FFFFFF12",
                strokeThickness: 0
            })
        );
    }
    top.sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: dates[REGIME.from],
            y1: 1,
            yCoordinateMode: ECoordinateMode.Relative,
            text: "Regime change: edge fades",
            fontSize: 12,
            textColor: "#C8D3E6",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom
        })
    );

    // Annotations that move with the data: the max drawdown period, its points and labels
    let marks = { top: [], bottom: [] };
    function markMaxDrawdown(equity, stats, crash) {
        marks.top.forEach((annotation) => top.sciChartSurface.annotations.remove(annotation, true));
        marks.bottom.forEach((annotation) => bottom.sciChartSurface.annotations.remove(annotation, true));
        const { peakIndex, troughIndex, recoveryIndex, maxDrawdown } = stats;
        const endIndex = recoveryIndex >= 0 ? recoveryIndex : equity.length - 1;
        const period = () =>
            new BoxAnnotation({
                x1: dates[peakIndex],
                x2: dates[endIndex],
                yCoordinateMode: ECoordinateMode.Relative,
                y1: 0,
                y2: 1,
                fill: COLOURS.drawdown + "22",
                strokeThickness: 0
            });
        const label = (index, y, text, below) =>
            new TextAnnotation({
                x1: dates[index],
                y1: y,
                text,
                fontSize: 13,
                textColor: "#FFFFFF",
                background: "#14233CCC",
                padding: new Thickness(2, 4, 2, 4),
                // above a point: centred; below the trough: to its right, clear of the crash label
                horizontalAnchorPoint: below ? EHorizontalAnchorPoint.Left : EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: below ? EVerticalAnchorPoint.Top : EVerticalAnchorPoint.Bottom,
                yCoordShift: below ? 8 : -8
            });
        marks.top = [
            period(),
            label(peakIndex, equity[peakIndex], `Peak ${dollars(equity[peakIndex])}`, false),
            label(troughIndex, equity[troughIndex], `Trough ${percent(maxDrawdown)}`, true),
            recoveryIndex >= 0
                ? label(recoveryIndex, equity[recoveryIndex], "Recovered", false)
                : label(endIndex, equity[endIndex], "Not yet recovered", false)
        ];
        if (crash) {
            marks.top.push(
                new TextAnnotation({
                    x1: dates[CRASH.from],
                    y1: 1,
                    yCoordinateMode: ECoordinateMode.Relative,
                    text: "Crash",
                    fontSize: 12,
                    textColor: "#C8D3E6",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
                    verticalAnchorPoint: EVerticalAnchorPoint.Bottom
                })
            );
        }
        marks.bottom = [
            period(),
            new HorizontalLineAnnotation({
                y1: maxDrawdown * 100,
                stroke: "#FFFFFF",
                strokeThickness: 1,
                strokeDashArray: [4, 4],
                showLabel: true,
                labelPlacement: ELabelPlacement.TopRight,
                labelValue: `Max drawdown ${percent(maxDrawdown)}`,
                axisLabelFill: "#FFFFFF"
            })
        ];
        top.sciChartSurface.annotations.add(...marks.top);
        bottom.sciChartSurface.annotations.add(...marks.bottom);
        markerData.clear();
        markerData.appendRange(
            [peakIndex, troughIndex, endIndex].map((i) => dates[i]),
            [peakIndex, troughIndex, endIndex].map((i) => equity[i])
        );
    }

    // --- The controls: simulate, measure and redraw ---
    function update() {
        const settings = {
            drift: Number(ui.drift.value) / 100,
            volatility: Number(ui.volatility.value) / 100,
            crash: ui.crash.checked
        };
        ui.driftOut.textContent = `${ui.drift.value}% a year`;
        ui.volatilityOut.textContent = `${ui.volatility.value}% a year`;
        const strategy = simulateEquity(strategyNoise, { ...settings, regimeChange: true });
        const benchmark = simulateEquity(benchmarkNoise, { drift: 0.07, volatility: 0.16, crash: settings.crash, regimeChange: false });
        const s = drawdownStats(strategy);
        const b = drawdownStats(benchmark);
        const fill = (dataSeries, values) => {
            dataSeries.clear();
            dataSeries.appendRange(dates, values);
        };
        fill(strategyData, strategy);
        fill(peakData, s.runningPeak);
        fill(benchmarkData, benchmark);
        fill(strategyDrawdown, s.drawdown.map((d) => d * 100));
        fill(benchmarkDrawdown, b.drawdown.map((d) => d * 100));
        markMaxDrawdown(strategy, s, settings.crash);
        const compare = ui.benchmark.checked;
        benchmarkLine.isVisible = compare;
        benchmarkUnderwater.isVisible = compare;
        top.sciChartSurface.zoomExtents();
        bottom.sciChartSurface.zoomExtents();

        // The readout: the figures behind the charts, all computed above
        const cell = "padding:3px 10px; text-align:right; border-bottom:1px solid #3a5480;";
        const row = (name, stats, colour) =>
            `<tr><th scope="row" style="${cell}text-align:left; color:${colour}">${name}</th>` +
            `<td style="${cell}">${percent(stats.totalReturn)}</td><td style="${cell}">${percent(stats.cagr)}</td>` +
            `<td style="${cell}">${percent(stats.maxDrawdown)}</td><td style="${cell}">${stats.longest}</td>` +
            `<td style="${cell}">${Number.isFinite(stats.calmar) ? stats.calmar.toFixed(2).replace("-", "−") : "–"}</td></tr>`;
        ui.readout.innerHTML =
            `<table style="border-collapse:collapse"><caption style="text-align:left; padding-bottom:4px">` +
            `Five simulated years from ${dollars(START_VALUE)}. Longest drawdown is in trading days, from a peak until the account is back at it.</caption>` +
            `<tr><td></td><th scope="col" style="${cell}">Total return</th><th scope="col" style="${cell}">CAGR</th>` +
            `<th scope="col" style="${cell}">Max drawdown</th><th scope="col" style="${cell}">Longest drawdown</th>` +
            `<th scope="col" style="${cell}">Calmar ratio</th></tr>` +
            row("Strategy", s, COLOURS.strategy) +
            (compare ? row("Benchmark", b, COLOURS.benchmark) : "") +
            `</table>`;
    }

    // Swap the value axis between linear and log; the series keep their data
    function setLogScale(isLog) {
        const oldAxis = top.sciChartSurface.yAxes.get(0);
        top.sciChartSurface.yAxes.remove(oldAxis, true);
        top.sciChartSurface.yAxes.add(makeValueAxis(isLog));
        top.sciChartSurface.zoomExtents();
    }

    ui.volatility.addEventListener("input", update);
    ui.drift.addEventListener("input", update);
    ui.crash.addEventListener("change", update);
    ui.benchmark.addEventListener("change", update);
    ui.log.addEventListener("change", () => setLogScale(ui.log.checked));
    update();
    // #region_A_end
}

drawdownChart("scichart-root");
