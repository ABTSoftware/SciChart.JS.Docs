import * as SciChart from "scichart";

const TICK = 0.25; // the smallest price step, as on an index future
const SESSIONS = 3;
const BARS_PER_SESSION = 78; // five-minute bars from 09:30 to 16:00
const BAR_MINUTES = 5;
const SESSION_START_MINUTES = 9 * 60 + 30;

// Sample data: a seeded simulation of about 23,600 individual trades over three sessions, so the chart looks the
// same every time and needs no feed. Prices are whole ticks. The price wanders around a level that the session
// "accepts", which shifts now and then: session 1 trades in one range, session 2 moves up 25 points in about half
// an hour and settles there, and session 3 opens lower and climbs back. Trading is busier at the open and close.
function simulateTrades() {
    let seed = 20261124;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const ticks = (price) => Math.round(price / TICK);
    // The level each session's price is drawn towards, by bar
    const level = (session, b) => {
        if (session === 0) return ticks(4800) + (b < 30 ? -8 : 4);
        if (session === 1) return b < 34 ? ticks(4801) : b < 40 ? ticks(4801) + ((b - 33) / 6) * (ticks(4826) - ticks(4801)) : ticks(4826);
        return b < 12 ? ticks(4818) : ticks(4827);
    };
    const tick = [];
    const size = [];
    const bar = [];
    let t = ticks(4798);
    let wander = 0;
    for (let session = 0; session < SESSIONS; session++) {
        for (let b = 0; b < BARS_PER_SESSION; b++) {
            const x = b / (BARS_PER_SESSION - 1);
            const count = Math.round(50 * (1 + 3 * (2 * x - 1) ** 2) * (0.7 + 0.6 * random()));
            const target = level(session, b) + wander;
            wander += Math.round((random() - 0.5) * 6);
            for (let k = 0; k < count; k++) {
                const pull = Math.max(-0.2, Math.min(0.2, 0.0025 * (target - t)));
                const u = random();
                if (u < 0.3 + pull) t += 1;
                else if (u > 0.7 + pull) t -= 1;
                tick.push(t);
                size.push(random() < 0.02 ? 20 + Math.floor(random() * 40) : 1 + Math.floor(-Math.log(random() + 1e-12) * 4));
                bar.push(session * BARS_PER_SESSION + b);
            }
        }
    }
    return { tick: Int32Array.from(tick), size: Float64Array.from(size), bar: Int32Array.from(bar) };
}

// Five-minute candles from the trades: open, high, low and close (in ticks) and volume
function buildCandles(trades) {
    const candles = [];
    for (let i = 0; i < trades.tick.length; i++) {
        const t = trades.tick[i];
        const c = candles[trades.bar[i]];
        if (!c) {
            candles[trades.bar[i]] = { openTick: t, highTick: t, lowTick: t, closeTick: t, volume: trades.size[i] };
            continue;
        }
        c.highTick = Math.max(c.highTick, t);
        c.lowTick = Math.min(c.lowTick, t);
        c.closeTick = t;
        c.volume += trades.size[i];
    }
    return candles;
}

// The controls, the readout and the chart each need an element. This splits the page's div into them; in your app,
// they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Range <select data-id="range" style="font:inherit">` +
        `<option value="all">All three sessions</option><option value="2">Session 2</option>` +
        `<option value="3" selected>Session 3 (last)</option><option value="visible">Visible bars (zoom and pan)</option></select></label>` +
        `<label>Row size <select data-id="row" style="font:inherit">` +
        `<option value="1" selected>1 tick (0.25)</option><option value="2">2 ticks (0.50)</option>` +
        `<option value="4">4 ticks (1.00)</option><option value="8">8 ticks (2.00)</option></select></label>` +
        `<label>Value area <input data-id="share" type="range" min="60" max="80" step="1" value="70" style="vertical-align:middle"> ` +
        `<output data-id="shareText">70%</output></label>` +
        `<label>Built by <select data-id="method" style="font:inherit">` +
        `<option value="pairs" selected>Two rows at a time</option><option value="rows">One row at a time</option></select></label>` +
        `<label>Volume from <select data-id="source" style="font:inherit">` +
        `<option value="trades" selected>Every trade (exact)</option><option value="candles">Candles (estimated)</option></select></label>`;
    const chartDiv = document.createElement("div");
    chartDiv.id = `${divElementId}-chart`; // the chart's div needs its own id
    chartDiv.style.cssText = "flex:1; min-height:300px;";
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:2px 12px 6px; color:#ffffff; font-variant-numeric:tabular-nums;" + font;
    root.append(bar, readout, chartDiv);
    const get = (selector) => bar.querySelector(selector);
    return {
        chartDiv,
        readout,
        rangeSelect: get('select[data-id="range"]'),
        rowSelect: get('select[data-id="row"]'),
        shareSlider: get('input[data-id="share"]'),
        shareText: get('output[data-id="shareText"]'),
        methodSelect: get('select[data-id="method"]'),
        sourceSelect: get('select[data-id="source"]')
    };
}

async function volumeProfileChart(divElementId) {
    const ui = createLayout(divElementId);
    const trades = simulateTrades();
    const candles = buildCandles(trades);

    // #region_A_start
    // A candlestick chart with a volume profile, point of control and value area beside it, with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAxisAlignment,
        EAutoRange,
        EXyDirection,
        ECoordinateMode,
        ELabelPlacement,
        OhlcDataSeries,
        FastCandlestickRenderableSeries,
        XyxyDataSeries,
        FastRectangleRenderableSeries,
        EColumnMode,
        EColumnYMode,
        BoxAnnotation,
        HorizontalLineAnnotation,
        VerticalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Volume profile maths (plain JavaScript, no library needed) ---

    // Volume at each price row from every trade. Prices are whole ticks; a row is rowTicks ticks tall, so
    // row r holds the ticks from r * rowTicks to r * rowTicks + rowTicks - 1.
    function profileFromTrades(trades, fromBar, toBar, rowTicks) {
        let low = Infinity;
        let high = -Infinity;
        for (let i = 0; i < trades.tick.length; i++) {
            if (trades.bar[i] < fromBar || trades.bar[i] > toBar) continue;
            low = Math.min(low, trades.tick[i]);
            high = Math.max(high, trades.tick[i]);
        }
        const firstRow = Math.floor(low / rowTicks);
        const volumes = new Array(Math.floor(high / rowTicks) - firstRow + 1).fill(0);
        for (let i = 0; i < trades.tick.length; i++) {
            if (trades.bar[i] < fromBar || trades.bar[i] > toBar) continue;
            volumes[Math.floor(trades.tick[i] / rowTicks) - firstRow] += trades.size[i];
        }
        return { firstRow, volumes };
    }

    // The estimate from candles: each candle's volume is spread evenly over every tick from its low to its high
    function profileFromCandles(candles, fromBar, toBar, rowTicks) {
        const inRange = candles.slice(fromBar, toBar + 1);
        const low = Math.min(...inRange.map((c) => c.lowTick));
        const high = Math.max(...inRange.map((c) => c.highTick));
        const firstRow = Math.floor(low / rowTicks);
        const volumes = new Array(Math.floor(high / rowTicks) - firstRow + 1).fill(0);
        for (const c of inRange) {
            const share = c.volume / (c.highTick - c.lowTick + 1);
            for (let t = c.lowTick; t <= c.highTick; t++) volumes[Math.floor(t / rowTicks) - firstRow] += share;
        }
        return { firstRow, volumes };
    }

    // Point of control: the row with the most volume. A tie goes to the row nearest the middle of the range.
    function pointOfControl(volumes) {
        let best = 0;
        const middle = (volumes.length - 1) / 2;
        for (let i = 1; i < volumes.length; i++) {
            const more = volumes[i] > volumes[best];
            const tieNearer = volumes[i] === volumes[best] && Math.abs(i - middle) < Math.abs(best - middle);
            if (more || tieNearer) best = i;
        }
        return best;
    }

    // Value area: start at the point of control and add rows until they hold `share` of the volume.
    // "pairs" compares the next two rows above with the next two below and adds the busier pair (the method in
    // Dalton, Jones and Dalton's Mind Over Markets); "rows" compares one row on each side. Ties go up.
    function valueArea(volumes, poc, share, method) {
        const total = volumes.reduce((sum, v) => sum + v, 0);
        const step = method === "pairs" ? 2 : 1;
        let low = poc;
        let high = poc;
        let volume = volumes[poc];
        while (volume < share * total && (low > 0 || high < volumes.length - 1)) {
            let above = 0;
            let below = 0;
            for (let k = 1; k <= step; k++) {
                above += high + k < volumes.length ? volumes[high + k] : 0;
                below += low - k >= 0 ? volumes[low - k] : 0;
            }
            const goUp = low === 0 || (high < volumes.length - 1 && above >= below);
            const added = Math.min(step, goUp ? volumes.length - 1 - high : low);
            if (goUp) high += added;
            else low -= added;
            volume += goUp ? above : below;
        }
        return { low, high, volume, total };
    }

    // --- The chart: candles on a time axis, the profile on a hidden volume axis that shares the price axis ---
    const fmt = (value, digits) => value.toLocaleString("en-GB", { minimumFractionDigits: digits, maximumFractionDigits: digits });
    const barLabel = (x) => {
        const b = Math.round(x);
        if (b < 0 || b >= SESSIONS * BARS_PER_SESSION) return "";
        const minutes = SESSION_START_MINUTES + (b % BARS_PER_SESSION) * BAR_MINUTES;
        const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
        return `Session ${Math.floor(b / BARS_PER_SESSION) + 1} ${time}`;
    };
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(ui.chartDiv, { theme: new SciChartJsNavyTheme() });
    const timeAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.01, 0.5), // room on the right for the profile
        drawMinorGridLines: false,
        maxAutoTicks: 6
    });
    timeAxis.labelProvider.formatLabel = barLabel;
    timeAxis.labelProvider.formatCursorLabel = barLabel;
    // The profile's bars grow leftwards from the right edge: flipped, hidden, and autoranged so the longest bar
    // spans about 30% of the width
    const volumeAxis = new NumericAxis(wasmContext, {
        id: "volume",
        isVisible: false,
        flippedCoordinates: true,
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0, 2.3)
    });
    const priceAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        autoRange: EAutoRange.Always, // fit the candles on screen and the profile
        labelPrecision: 2,
        growBy: new NumberRange(0.05, 0.05),
        axisTitle: "Price"
    });
    sciChartSurface.xAxes.add(timeAxis, volumeAxis);
    sciChartSurface.yAxes.add(priceAxis);

    const ohlc = new OhlcDataSeries(wasmContext, { dataSeriesName: "Price (5-minute candles)" });
    candles.forEach((c, b) => ohlc.append(b, c.openTick * TICK, c.highTick * TICK, c.lowTick * TICK, c.closeTick * TICK));
    const outsideData = new XyxyDataSeries(wasmContext, { dataSeriesName: "Volume at price", dataIsSortedInX: false });
    const valueAreaData = new XyxyDataSeries(wasmContext, { dataSeriesName: "Value area", dataIsSortedInX: false });
    const pocData = new XyxyDataSeries(wasmContext, { dataSeriesName: "Point of control", dataIsSortedInX: false });
    const rows = (dataSeries, fill) =>
        new FastRectangleRenderableSeries(wasmContext, {
            dataSeries,
            xAxisId: "volume",
            columnXMode: EColumnMode.StartEnd, // x (0) to x1 (the row's volume)
            columnYMode: EColumnYMode.TopBottom, // y (top of the row) to y1 (bottom)
            fill,
            stroke: fill, // the legend's marker colour
            strokeThickness: 0
        });
    const outsideRows = rows(outsideData, "#50C7E055");
    const valueAreaRows = rows(valueAreaData, "#50C7E0CC");
    const pocRow = rows(pocData, "#FFD54A");
    sciChartSurface.renderableSeries.add(
        new FastCandlestickRenderableSeries(wasmContext, {
            dataSeries: ohlc,
            dataPointWidth: 0.7,
            brushUp: "#26a69a",
            strokeUp: "#26a69a",
            brushDown: "#ef5350",
            strokeDown: "#ef5350"
        }),
        outsideRows,
        valueAreaRows,
        pocRow
    );

    // The range the profile covers, the value area band and the POC, VAH and VAL lines
    const rangeBox = new BoxAnnotation({ yCoordinateMode: ECoordinateMode.Relative, y1: 0, y2: 1, x1: 0, x2: 1, fill: "#FFFFFF0D", strokeThickness: 0 });
    const valueAreaBand = new BoxAnnotation({ xCoordinateMode: ECoordinateMode.Relative, x1: 0, x2: 1, y1: 0, y2: 0, fill: "#50C7E01A", strokeThickness: 0 });
    const line = (stroke, dash) =>
        new HorizontalLineAnnotation({ y1: 0, stroke, strokeThickness: 1.5, strokeDashArray: dash, showLabel: true, labelPlacement: ELabelPlacement.Axis, axisLabelFill: stroke, axisLabelStroke: "#0B1530" });
    const pocLine = line("#FFD54A", undefined);
    const vahLine = line("#50C7E0", [6, 4]);
    const valLine = line("#50C7E0", [6, 4]);
    const sessionLines = [1, 2].map(
        (s) => new VerticalLineAnnotation({ x1: s * BARS_PER_SESSION - 0.5, stroke: "#FFFFFF55", strokeThickness: 1, strokeDashArray: [2, 4] })
    );
    sciChartSurface.annotations.add(rangeBox, valueAreaBand, pocLine, vahLine, valLine, ...sessionLines);

    // Zoom and pan in time only, never the hidden volume axis; the price axis follows the candles on screen
    const timeOnly = { excludedXAxisIds: ["volume"], xyDirection: EXyDirection.XDirection };
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ excludedXAxisIds: ["volume"], showTooltip: true, showAxisLabels: true }),
        new MouseWheelZoomModifier(timeOnly),
        new ZoomPanModifier(timeOnly),
        new ZoomExtentsModifier(timeOnly),
        new LegendModifier({ showCheckboxes: false })
    );

    // --- Recalculate the profile and redraw it whenever a control or the visible range changes ---
    function update() {
        const lastBar = candles.length - 1;
        let fromBar = 0;
        let toBar = lastBar;
        const range = ui.rangeSelect.value;
        if (range === "2" || range === "3") {
            fromBar = (Number(range) - 1) * BARS_PER_SESSION;
            toBar = fromBar + BARS_PER_SESSION - 1;
        } else if (range === "visible") {
            const visible = timeAxis.visibleRange;
            fromBar = Math.max(0, Math.ceil(visible.min));
            toBar = Math.min(lastBar, Math.floor(visible.max));
            if (toBar < fromBar) return;
        }
        const rowTicks = Number(ui.rowSelect.value);
        const share = Number(ui.shareSlider.value) / 100;
        const exact = profileFromTrades(trades, fromBar, toBar, rowTicks);
        const estimated = profileFromCandles(candles, fromBar, toBar, rowTicks);
        const profile = ui.sourceSelect.value === "trades" ? exact : estimated;
        const poc = pointOfControl(profile.volumes);
        const area = valueArea(profile.volumes, poc, share, ui.methodSelect.value);

        // Row r runs from its lowest tick to its highest tick, drawn half a tick beyond each so the rows touch
        const rowBottom = (r) => (profile.firstRow + r) * rowTicks * TICK;
        const rowTop = (r) => rowBottom(r) + (rowTicks - 1) * TICK;
        [outsideData, valueAreaData, pocData].forEach((s) => s.clear());
        profile.volumes.forEach((v, r) => {
            const target = r === poc ? pocData : r >= area.low && r <= area.high ? valueAreaData : outsideData;
            target.append(0, rowTop(r) + TICK / 2 - TICK * 0.08, v, rowBottom(r) - TICK / 2 + TICK * 0.08);
        });

        const vah = rowTop(area.high);
        const val = rowBottom(area.low);
        const pocText = rowTicks === 1 ? fmt(rowBottom(poc), 2) : `${fmt(rowBottom(poc), 2)}–${fmt(rowTop(poc), 2)}`;
        pocLine.y1 = (rowBottom(poc) + rowTop(poc)) / 2;
        pocLine.labelValue = `POC ${pocText}`;
        vahLine.y1 = vah + TICK / 2;
        vahLine.labelValue = `VAH ${fmt(vah, 2)}`;
        valLine.y1 = val - TICK / 2;
        valLine.labelValue = `VAL ${fmt(val, 2)}`;
        valueAreaBand.y1 = val - TICK / 2;
        valueAreaBand.y2 = vah + TICK / 2;
        rangeBox.x1 = fromBar - 0.5;
        rangeBox.x2 = toBar + 0.5;

        // Compare the two sources' points of control
        const pocPrice = (p) => (p.firstRow + pointOfControl(p.volumes)) * rowTicks * TICK;
        const gapTicks = Math.abs(pocPrice(exact) - pocPrice(estimated)) / TICK;
        ui.shareText.textContent = `${ui.shareSlider.value}%`;
        ui.readout.textContent =
            `${barLabel(fromBar)} to ${barLabel(toBar)} · Volume ${fmt(area.total, 0)} · POC ${pocText} · ` +
            `VAH ${fmt(vah, 2)} · VAL ${fmt(val, 2)} (${fmt((100 * area.volume) / area.total, 1)}% of volume) · ` +
            `POC from candles is ${gapTicks === 0 ? "in the same row as" : `${fmt(gapTicks, 0)} tick${gapTicks === 1 ? "" : "s"} ${pocPrice(estimated) > pocPrice(exact) ? "above" : "below"}`} the exact POC`;
    }

    for (const control of [ui.rangeSelect, ui.rowSelect, ui.methodSelect, ui.sourceSelect]) control.addEventListener("change", update);
    ui.shareSlider.addEventListener("input", update);
    let pending = 0;
    timeAxis.visibleRangeChanged.subscribe(() => {
        if (ui.rangeSelect.value !== "visible") return;
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(update);
    });
    update();
    // #region_A_end
}

volumeProfileChart("scichart-root");
