import * as SciChart from "scichart";

// Session times are seconds after midnight: 09:30 to 16:00
const SESSION_START = 9.5 * 3600;
const SESSION_END = 16 * 3600;
const QUIET_HOUR = { from: 12 * 3600, to: 13 * 3600 }; // the lunchtime lull
const BUSY_HOUR = { from: 14 * 3600, to: 15 * 3600 }; // a news release at 14:00
const TICK_SIZE = 0.25; // the smallest price step

// Sample data: one simulated trading day of individual trades (time and price), so the chart looks the same every
// time and needs no market data feed. Trades arrive at random, faster after the open and before the close, slowly
// over lunch, and in a burst after a news release at 14:00. Each trade moves the price up or down one tick, or
// leaves it unchanged; for ten minutes after the news, up-moves are a little more likely.
function simulateTrades() {
    let seed = 233;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    // Trades per minute at a given number of minutes after the open
    const rate = (m) => {
        const uShape = 150 + 350 * Math.exp(-m / 25) + 200 * Math.exp(-(390 - m) / 30);
        const lunch = 1 - 0.6 * Math.exp(-(((m - 165) / 40) ** 2));
        const news = m >= 270 ? 1500 * Math.exp(-(m - 270) / 8) : 0;
        return uShape * lunch + news;
    };
    const times = [];
    const prices = [];
    let t = SESSION_START;
    let price = 5000;
    while (true) {
        const perSecond = rate((t - SESSION_START) / 60) / 60;
        t += -Math.log(random() + 1e-12) / perSecond; // random gap until the next trade
        if (t >= SESSION_END) break;
        const afterNews = t >= BUSY_HOUR.from && t < BUSY_HOUR.from + 600;
        const u = random();
        const up = afterNews ? 0.315 : 0.3;
        const down = afterNews ? 0.285 : 0.3;
        if (u < up) price += TICK_SIZE;
        else if (u < up + down) price -= TICK_SIZE;
        times.push(t);
        prices.push(price);
    }
    return { times, prices };
}

// The controls and the charts each need an element. This splits the page's div into a control bar, two charts and
// a readout; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Ticks per bar <select data-id="ticks" style="font:inherit">` +
        `<option value="100">100</option><option value="233" selected>233</option><option value="500">500</option>` +
        `<option value="1000">1,000</option></select></label>` +
        `<label>Time bar size <select data-id="minutes" style="font:inherit">` +
        `<option value="1" selected>1 minute</option><option value="5">5 minutes</option><option value="15">15 minutes</option>` +
        `</select></label>` +
        `<label><input data-id="raw" type="checkbox"> Show raw ticks</label>`;
    const timeDiv = document.createElement("div");
    timeDiv.id = divElementId + "-time"; // each chart's div needs its own id
    timeDiv.style.cssText = "flex:1; min-height:200px;";
    const tickDiv = document.createElement("div");
    tickDiv.id = divElementId + "-tick";
    tickDiv.style.cssText = "flex:1; min-height:200px;";
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:6px 12px; color:#ffffff; font-size:13px; overflow-x:auto;" + font;
    root.append(bar, timeDiv, tickDiv, readout);
    const get = (selector) => bar.querySelector(selector);
    return {
        timeDiv,
        tickDiv,
        readout,
        ticksSelect: get('select[data-id="ticks"]'),
        minutesSelect: get('select[data-id="minutes"]'),
        rawCheckbox: get('input[data-id="raw"]')
    };
}

async function tickChart(divElementId) {
    const ui = createLayout(divElementId);
    const trades = simulateTrades();

    // #region_A_start
    // A time-bar candlestick chart and a tick-bar candlestick chart built from the same trades, with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        DateTimeNumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        FastCandlestickRenderableSeries,
        FastLineRenderableSeries,
        OhlcDataSeries,
        XyDataSeries,
        BoxAnnotation,
        TextAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Turning trades into bars (plain JavaScript) ---

    // Time bars: a new bar starts every `seconds`, however many trades happen in it
    function timeBars(times, prices, seconds) {
        const bars = { x: [], open: [], high: [], low: [], close: [] };
        let barStart = -Infinity;
        for (let i = 0; i < times.length; i++) {
            const start = Math.floor(times[i] / seconds) * seconds;
            if (start !== barStart) {
                barStart = start;
                bars.x.push(start);
                bars.open.push(prices[i]);
                bars.high.push(prices[i]);
                bars.low.push(prices[i]);
                bars.close.push(prices[i]);
            } else {
                const last = bars.x.length - 1;
                bars.high[last] = Math.max(bars.high[last], prices[i]);
                bars.low[last] = Math.min(bars.low[last], prices[i]);
                bars.close[last] = prices[i];
            }
        }
        return bars;
    }

    // Tick bars: a new bar starts every `ticksPerBar` trades, however long they take. The last bar may still be
    // forming. x is the time of each bar's first trade.
    function tickBars(times, prices, ticksPerBar) {
        const bars = { x: [], open: [], high: [], low: [], close: [] };
        for (let i = 0; i < times.length; i++) {
            if (i % ticksPerBar === 0) {
                bars.x.push(times[i]);
                bars.open.push(prices[i]);
                bars.high.push(prices[i]);
                bars.low.push(prices[i]);
                bars.close.push(prices[i]);
            } else {
                const last = bars.x.length - 1;
                bars.high[last] = Math.max(bars.high[last], prices[i]);
                bars.low[last] = Math.min(bars.low[last], prices[i]);
                bars.close[last] = prices[i];
            }
        }
        return bars;
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const hhmm = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };
    const hhmmss = (seconds) => `${hhmm(seconds)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
    const candles = (wasmContext, dataSeries) =>
        new FastCandlestickRenderableSeries(wasmContext, {
            dataSeries,
            dataPointWidth: 0.7,
            brushUp: "#26a69a",
            strokeUp: "#26a69a",
            brushDown: "#ef5350",
            strokeDown: "#ef5350",
            strokeThickness: 1
        });
    const priceAxis = (wasmContext) =>
        new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, growBy: new NumberRange(0.08, 0.08), labelPrecision: 2 });
    // Shade the quiet and busy hours, with a label at the top
    const shade = (x1, x2, colour, label) => [
        new BoxAnnotation({ x1, x2, yCoordinateMode: ECoordinateMode.Relative, y1: 0, y2: 1, fill: colour + "26", strokeThickness: 0 }),
        new TextAnnotation({
            x1,
            y1: 0,
            yCoordinateMode: ECoordinateMode.Relative,
            text: label,
            fontSize: 13,
            textColor: colour,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top
        })
    ];
    const modifiers = () => [
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    ];

    // 1. Time bars on a time axis, with every trade as an optional line. The x values are seconds after midnight,
    // which a DateTimeNumericAxis labels as times of day (it reads them as Unix seconds, in UTC).
    const top = await SciChartSurface.create(ui.timeDiv, { theme, title: "Time bars", titleStyle: { fontSize: 16 } });
    const timeAxis = new DateTimeNumericAxis(top.wasmContext, { axisTitle: "Time of day" });
    timeAxis.labelProvider.formatLabel = hhmm; // keep the axis's choice of round times, but show them as hh:mm
    timeAxis.labelProvider.formatCursorLabel = hhmmss;
    top.sciChartSurface.xAxes.add(timeAxis);
    top.sciChartSurface.yAxes.add(priceAxis(top.wasmContext));
    const timeBarData = new OhlcDataSeries(top.wasmContext, { dataSeriesName: "Time bars" });
    // The raw ticks: one point per trade, tens of thousands of them. isSorted lets SciChart draw only what's on screen.
    const rawTicks = new FastLineRenderableSeries(top.wasmContext, {
        dataSeries: new XyDataSeries(top.wasmContext, { xValues: trades.times, yValues: trades.prices, dataSeriesName: "Raw ticks", isSorted: true }),
        stroke: "#F6E05E",
        strokeThickness: 1,
        opacity: 0.8,
        isVisible: false
    });
    top.sciChartSurface.renderableSeries.add(candles(top.wasmContext, timeBarData), rawTicks);
    top.sciChartSurface.annotations.add(
        ...shade(QUIET_HOUR.from, QUIET_HOUR.to, "#50C7E0", "Quiet hour"),
        ...shade(BUSY_HOUR.from, BUSY_HOUR.to, "#F48420", "Busy hour (news)")
    );
    top.sciChartSurface.chartModifiers.add(...modifiers());

    // 2. Tick bars on a bar-number axis: bars are evenly spaced, and each label shows when that bar started
    const bottom = await SciChartSurface.create(ui.tickDiv, { theme, title: "Tick bars", titleStyle: { fontSize: 16 } });
    let tickBarTimes = [];
    const barTime = (index) => tickBarTimes[Math.max(0, Math.min(tickBarTimes.length - 1, Math.round(index)))] ?? 0;
    const barAxis = new NumericAxis(bottom.wasmContext, { axisTitle: "Bar number (labels show each bar's start time)" });
    barAxis.labelProvider.formatLabel = (index) => hhmm(barTime(index));
    barAxis.labelProvider.formatCursorLabel = (index) => `Bar ${Math.round(index) + 1}, from ${hhmmss(barTime(index))}`;
    bottom.sciChartSurface.xAxes.add(barAxis);
    bottom.sciChartSurface.yAxes.add(priceAxis(bottom.wasmContext));
    const tickBarData = new OhlcDataSeries(bottom.wasmContext, { dataSeriesName: "Tick bars" });
    bottom.sciChartSurface.renderableSeries.add(candles(bottom.wasmContext, tickBarData));
    bottom.sciChartSurface.chartModifiers.add(...modifiers());
    let tickShading = [];

    const fill = (dataSeries, x, bars) => {
        dataSeries.clear();
        dataSeries.appendRange(x, bars.open, bars.high, bars.low, bars.close);
    };

    // Bars that start in an hour, and the median high-to-low range of those bars
    function hourStats(bars, { from, to }) {
        const ranges = [];
        for (let i = 0; i < bars.x.length; i++) {
            if (bars.x[i] >= from && bars.x[i] < to) ranges.push(bars.high[i] - bars.low[i]);
        }
        ranges.sort((a, b) => a - b);
        const median = ranges.length ? ranges[Math.floor(ranges.length / 2)] : NaN;
        return { count: ranges.length, median };
    }

    // --- The controls: rebuild both sets of bars from the same trades ---
    function update() {
        const ticksPerBar = Number(ui.ticksSelect.value);
        const minutes = Number(ui.minutesSelect.value);
        const byTime = timeBars(trades.times, trades.prices, minutes * 60);
        const byTicks = tickBars(trades.times, trades.prices, ticksPerBar);
        top.sciChartSurface.title = `Time bars: one every ${minutes} minute${minutes > 1 ? "s" : ""} (${byTime.x.length} bars)`;
        bottom.sciChartSurface.title = `Tick bars: one every ${ticksPerBar.toLocaleString("en-GB")} trades (${byTicks.x.length} bars)`;
        // Time bars sit at the middle of their interval; tick bars at their bar number
        fill(timeBarData, byTime.x.map((x) => x + (minutes * 60) / 2), byTime);
        tickBarTimes = byTicks.x;
        barAxis.labelProvider.invalidateCache(); // the same bar numbers now have new start times
        fill(tickBarData, byTicks.x.map((_, i) => i), byTicks);

        // Shade the same two hours on the tick chart: the bars that started in each
        tickShading.forEach((annotation) => bottom.sciChartSurface.annotations.remove(annotation, true));
        const firstBar = (t) => byTicks.x.findIndex((x) => x >= t);
        const span = ({ from, to }) => [firstBar(from) - 0.5, firstBar(to) - 0.5];
        const [q1, q2] = span(QUIET_HOUR);
        const [b1, b2] = span(BUSY_HOUR);
        tickShading = [...shade(q1, q2, "#50C7E0", "Quiet hour"), ...shade(b1, b2, "#F48420", "Busy hour (news)")];
        bottom.sciChartSurface.annotations.add(...tickShading);
        top.sciChartSurface.zoomExtents();
        bottom.sciChartSurface.zoomExtents();

        // The readout: bars per hour and their typical size, quiet hour against busy hour
        const tradesIn = ({ from, to }) => trades.times.filter((t) => t >= from && t < to).length;
        const cell = "padding:3px 10px; text-align:right; border-bottom:1px solid #3a5480;";
        const row = (name, bars) => {
            const q = hourStats(bars, QUIET_HOUR);
            const b = hourStats(bars, BUSY_HOUR);
            return `<tr><th scope="row" style="${cell}text-align:left">${name}</th><td style="${cell}">${q.count}</td><td style="${cell}">${b.count}</td>` +
                `<td style="${cell}">${q.median.toFixed(2)}</td><td style="${cell}">${b.median.toFixed(2)}</td></tr>`;
        };
        ui.readout.innerHTML =
            `<table style="border-collapse:collapse"><caption style="text-align:left; padding-bottom:4px">` +
            `${trades.times.length.toLocaleString("en-GB")} trades in the session: ` +
            `${tradesIn(QUIET_HOUR).toLocaleString("en-GB")} in the quiet hour (12:00–13:00), ` +
            `${tradesIn(BUSY_HOUR).toLocaleString("en-GB")} in the busy hour (14:00–15:00)</caption>` +
            `<tr><td></td><th scope="col" style="${cell}">Bars, quiet hour</th><th scope="col" style="${cell}">Bars, busy hour</th>` +
            `<th scope="col" style="${cell}">Median bar range, quiet</th><th scope="col" style="${cell}">Median bar range, busy</th></tr>` +
            row(`${minutes}-minute bars`, byTime) +
            row(`${ticksPerBar.toLocaleString("en-GB")}-tick bars`, byTicks) +
            `</table>`;
    }

    ui.ticksSelect.addEventListener("change", update);
    ui.minutesSelect.addEventListener("change", update);
    ui.rawCheckbox.addEventListener("change", () => (rawTicks.isVisible = ui.rawCheckbox.checked));
    update();
    // #region_A_end
}

tickChart("scichart-root");
