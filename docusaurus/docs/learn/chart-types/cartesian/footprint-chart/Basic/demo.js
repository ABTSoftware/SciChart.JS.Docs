import * as SciChart from "scichart";

const TICK = 0.25; // the smallest price step, as on an index future
const BAR_COUNT = 40; // five-minute bars
const BAR_MINUTES = 5;
const SESSION_START_MINUTES = 9 * 60 + 30; // 09:30

// Sample data: a seeded simulation of individual trades (about 28,000 of them), so the chart looks the same every time and needs no feed.
// Each trade has a price, a size and an aggressor side. A buyer who crosses the spread trades at the ask, one tick
// above the bid; a seller trades at the bid. Buying pressure tends to lift the quote and selling pressure to push it
// down, so the bars trend when one side is more aggressive.
function simulateTrades() {
    let seed = 1987;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    let bidTick = 20000; // 5,000.00 in ticks of 0.25
    let pressure = 0;
    const bars = [];
    for (let b = 0; b < BAR_COUNT; b++) {
        // How one-sided the buying or selling is this bar: drifts from bar to bar, with the odd strong push
        pressure = 0.6 * pressure + (random() - 0.5) * 0.5 + (random() < 0.12 ? (random() - 0.5) * 1.6 : 0);
        const tradeCount = 450 + Math.floor(random() * 500);
        const trades = [];
        for (let t = 0; t < tradeCount; t++) {
            const buyChance = Math.min(0.85, Math.max(0.15, 0.5 + 0.3 * pressure + (random() - 0.5) * 0.1));
            const isBuy = random() < buyChance;
            let size = 1 + Math.floor(-Math.log(1 - random()) * 4);
            if (random() < 0.01) size += 20 + Math.floor(random() * 40); // an occasional large order
            trades.push({ tick: isBuy ? bidTick + 1 : bidTick, size, isBuy });
            // Now and then a burst of large orders sweeps through several prices in a row
            if (random() < 0.002) {
                const up = random() < (pressure >= 0 ? 0.8 : 0.2);
                const levels = 3 + Math.floor(random() * 3);
                for (let k = 0; k < levels; k++) {
                    trades.push({ tick: up ? bidTick + 1 : bidTick, size: 15 + Math.floor(random() * 30), isBuy: up });
                    bidTick += up ? 1 : -1;
                }
            }
            if (random() < 0.04) bidTick += isBuy ? 1 : -1; // the quote moves in the direction of the last trade
        }
        bars.push(trades);
    }
    return bars;
}

// The controls and the charts each need an element. This splits the page's div into a control bar, the price chart
// and a delta pane under it; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<span><button data-id="footprint" type="button" style="font:inherit">Zoom in to footprint</button> ` +
        `<button data-id="candles" type="button" style="font:inherit">Zoom out to candles</button></span>` +
        `<label>Display <select data-id="mode" style="font:inherit">` +
        `<option value="bidask" selected>Bid × Ask</option><option value="profile">Volume profile</option>` +
        `<option value="delta">Delta</option></select></label>` +
        `<label>Imbalance <select data-id="imbalance" style="font:inherit">` +
        `<option value="0">Off</option><option value="1.5">150%</option><option value="2">200%</option>` +
        `<option value="3" selected>300%</option><option value="4">400%</option></select></label>` +
        `<label>Row size <select data-id="row" style="font:inherit">` +
        `<option value="1" selected>0.25 (1 tick)</option><option value="2">0.50 (2 ticks)</option>` +
        `<option value="4">1.00 (4 ticks)</option></select></label>` +
        `<label><input data-id="valueArea" type="checkbox" checked> Value area (70%)</label>`;
    const priceDiv = document.createElement("div");
    priceDiv.id = divElementId + "-price"; // each chart's div needs its own id
    priceDiv.style.cssText = "flex:3; min-height:0;";
    const deltaDiv = document.createElement("div");
    deltaDiv.id = divElementId + "-delta";
    deltaDiv.style.cssText = "flex:1; min-height:0;";
    root.append(bar, priceDiv, deltaDiv);
    const get = (selector) => bar.querySelector(selector);
    return {
        priceDiv,
        deltaDiv,
        footprintButton: get('button[data-id="footprint"]'),
        candlesButton: get('button[data-id="candles"]'),
        modeSelect: get('select[data-id="mode"]'),
        imbalanceSelect: get('select[data-id="imbalance"]'),
        rowSelect: get('select[data-id="row"]'),
        valueAreaCheckbox: get('input[data-id="valueArea"]')
    };
}

async function footprintChart(divElementId) {
    const ui = createLayout(divElementId);
    const trades = simulateTrades();

    // #region_A_start
    // A candlestick chart that turns into a footprint (bid/ask volume at each price) when you zoom in, with SciChart.js
    const {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAxisAlignment,
        EAutoRange,
        EXyDirection,
        OhlcDataSeries,
        FastCandlestickRenderableSeries,
        XyxyDataSeries,
        FastRectangleRenderableSeries,
        EColumnMode,
        EColumnYMode,
        XyTextDataSeries,
        FastTextRenderableSeries,
        EHorizontalTextPosition,
        EVerticalTextPosition,
        XyDataSeries,
        FastColumnRenderableSeries,
        FastLineRenderableSeries,
        EFillPaletteMode,
        EStrokePaletteMode,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Order flow maths (plain JavaScript, no library needed) ---

    // One bar: OHLC from the trades, plus buy (at the ask) and sell (at the bid) volume at every price row.
    // Rows are rowTicks ticks tall; row r covers the prices from r * rowTicks to r * rowTicks + rowTicks - 1 ticks.
    function buildFootprint(barTrades, rowTicks) {
        const first = barTrades[0].tick;
        let high = first;
        let low = first;
        for (const t of barTrades) {
            high = Math.max(high, t.tick);
            low = Math.min(low, t.tick);
        }
        const lowRow = Math.floor(low / rowTicks);
        const rowCount = Math.floor(high / rowTicks) - lowRow + 1;
        const buy = new Array(rowCount).fill(0);
        const sell = new Array(rowCount).fill(0);
        for (const t of barTrades) {
            const r = Math.floor(t.tick / rowTicks) - lowRow;
            if (t.isBuy) buy[r] += t.size;
            else sell[r] += t.size;
        }
        return {
            open: first * TICK,
            high: high * TICK,
            low: low * TICK,
            close: barTrades[barTrades.length - 1].tick * TICK,
            lowRow,
            buy,
            sell
        };
    }

    // Point of control (the busiest row) and the value area: start at the POC and keep adding the busier
    // neighbouring row until the rows hold 70% of the bar's volume
    function valueArea(fp, share = 0.7) {
        const total = fp.buy.map((b, r) => b + fp.sell[r]);
        const volume = total.reduce((sum, v) => sum + v, 0);
        let poc = 0;
        for (let r = 1; r < total.length; r++) if (total[r] > total[poc]) poc = r;
        let lo = poc;
        let hi = poc;
        let inside = total[poc];
        while (inside < share * volume) {
            const below = lo > 0 ? total[lo - 1] : -1;
            const above = hi < total.length - 1 ? total[hi + 1] : -1;
            if (above >= below) inside += total[++hi];
            else inside += total[--lo];
        }
        return { poc, lo, hi, volume, delta: fp.buy.reduce((s, v) => s + v, 0) - fp.sell.reduce((s, v) => s + v, 0) };
    }

    // Diagonal imbalances: buying at the ask in row r against selling at the bid one row lower (r - 1), which are
    // the two sides of the same quote. Rows with fewer than minVolume contracts are ignored. ratio 3 means 300%.
    function imbalances(fp, ratio, minVolume = 10) {
        const n = fp.buy.length;
        const askImbalance = new Array(n).fill(false);
        const bidImbalance = new Array(n).fill(false);
        if (ratio > 0) {
            // The bottom row has no bid below it and the top row no ask above it, so they are never compared
            for (let r = 1; r < n; r++) {
                askImbalance[r] = fp.buy[r] >= minVolume && fp.buy[r] >= ratio * Math.max(fp.sell[r - 1], 1);
            }
            for (let r = 0; r < n - 1; r++) {
                bidImbalance[r] = fp.sell[r] >= minVolume && fp.sell[r] >= ratio * Math.max(fp.buy[r + 1], 1);
            }
        }
        return { askImbalance, bidImbalance };
    }

    // Runs of at least `length` imbalanced rows in a row: "stacked" imbalances
    function stackedRuns(flags, length = 3) {
        const runs = [];
        let start = -1;
        for (let r = 0; r <= flags.length; r++) {
            if (r < flags.length && flags[r]) {
                if (start < 0) start = r;
            } else if (start >= 0) {
                if (r - start >= length) runs.push({ from: start, to: r - 1 });
                start = -1;
            }
        }
        return runs;
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const GREEN = [38, 166, 154];
    const RED = [239, 83, 80];
    const argb = (alpha, rgb) => ((Math.round(alpha * 255) << 24) | (rgb[0] << 16) | (rgb[1] << 8) | rgb[2]) >>> 0;
    const timeLabel = (bar) => {
        const minutes = SESSION_START_MINUTES + Math.round(bar) * BAR_MINUTES;
        return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    };
    // A palette provider that gives each rectangle (or column) its own colour from an array we fill in
    const arrayPalette = (colourAt) => ({
        fillPaletteMode: EFillPaletteMode.SOLID,
        strokePaletteMode: EStrokePaletteMode.SOLID,
        isRangeIndependant: true,
        onAttached: () => {},
        onDetached: () => {},
        overrideFillArgb: (x, y, index) => colourAt(index, y),
        overrideStrokeArgb: (x, y, index) => colourAt(index, y)
    });

    // 1. The price pane: candles, and the footprint drawn over them with rectangles and text
    const price = await SciChartSurface.create(ui.priceDiv, { theme });
    const priceXAxis = new NumericAxis(price.wasmContext, { drawLabels: false, drawMinorGridLines: false });
    const priceYAxis = new NumericAxis(price.wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        autoRange: EAutoRange.Never, // fitted to the visible bars below
        labelPrecision: 2,
        drawMinorGridLines: false
    });
    price.sciChartSurface.xAxes.add(priceXAxis);
    price.sciChartSurface.yAxes.add(priceYAxis);

    const ohlc = new OhlcDataSeries(price.wasmContext, { dataSeriesName: "Price" });
    const candles = new FastCandlestickRenderableSeries(price.wasmContext, {
        dataSeries: ohlc,
        dataPointWidth: 0.7,
        brushUp: "#26a69a",
        strokeUp: "#26a69a",
        brushDown: "#ef5350",
        strokeDown: "#ef5350",
        strokeThickness: 1
    });
    const rectangles = (options) =>
        new FastRectangleRenderableSeries(price.wasmContext, {
            dataSeries: new XyxyDataSeries(price.wasmContext, { dataIsSortedInX: false }),
            columnXMode: EColumnMode.StartEnd, // x to x1
            columnYMode: EColumnYMode.TopBottom, // y (top) to y1 (bottom)
            strokeThickness: 0,
            ...options
        });
    let cellColours = [];
    const valueAreaBands = rectangles({ fill: "#FFFFFF1A" });
    const cells = rectangles({ paletteProvider: arrayPalette((index) => cellColours[index]) });
    const pocOutline = rectangles({ fill: "#00000000", stroke: "#FFD54A", strokeThickness: 2 });
    let stackColours = [];
    const stackMarkers = rectangles({ paletteProvider: arrayPalette((index) => stackColours[index]) });
    const text = (colour) =>
        new FastTextRenderableSeries(price.wasmContext, {
            dataSeries: new XyTextDataSeries(price.wasmContext, { dataIsSortedInX: false }),
            dataLabels: {
                style: { fontSize: 11, fontFamily: "Arial" },
                color: colour,
                horizontalTextPosition: EHorizontalTextPosition.Center,
                verticalTextPosition: EVerticalTextPosition.Center
            }
        });
    const plainText = text("#F2F5FA");
    const highlightText = text("#0B1530"); // dark text on the bright imbalance cells
    const footprintSeries = [valueAreaBands, cells, pocOutline, stackMarkers, plainText, highlightText];
    // Footprint behind, the candle over it as a thin line, numbers on top
    price.sciChartSurface.renderableSeries.add(valueAreaBands, cells, pocOutline, stackMarkers, candles, plainText, highlightText);

    // 2. The delta pane: buy minus sell volume per bar (columns) and the running total, cumulative delta (line)
    const delta = await SciChartSurface.create(ui.deltaDiv, { theme });
    const deltaXAxis = new NumericAxis(delta.wasmContext, { drawMinorGridLines: false });
    deltaXAxis.labelProvider.formatLabel = timeLabel;
    deltaXAxis.labelProvider.formatCursorLabel = timeLabel;
    delta.sciChartSurface.xAxes.add(deltaXAxis);
    delta.sciChartSurface.yAxes.add(
        new NumericAxis(delta.wasmContext, {
            id: "delta",
            autoRange: EAutoRange.Always, // fit the visible bars
            axisTitle: "Delta",
            labelPrecision: 0,
            axisAlignment: EAxisAlignment.Right,
            growBy: new NumberRange(0.25, 0.25),
            drawMinorGridLines: false
        }),
        new NumericAxis(delta.wasmContext, {
            id: "cumulative",
            autoRange: EAutoRange.Always, // fit the visible bars
            axisTitle: "Cum. delta",
            labelPrecision: 0,
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.1, 0.1),
            drawMajorGridLines: false,
            drawMinorGridLines: false
        })
    );
    // Bar delta as two column series, buyers ahead in green and sellers ahead in red (NaN leaves a gap)
    const positiveDelta = new XyDataSeries(delta.wasmContext, { dataSeriesName: "Delta", containsNaN: true });
    const negativeDelta = new XyDataSeries(delta.wasmContext, { dataSeriesName: "Delta", containsNaN: true });
    const cumulativeDelta = new XyDataSeries(delta.wasmContext, { dataSeriesName: "Cumulative delta" });
    const deltaColumns = (dataSeries, colour) =>
        new FastColumnRenderableSeries(delta.wasmContext, {
            dataSeries,
            yAxisId: "delta",
            dataPointWidth: 0.6,
            fill: colour + "D9",
            stroke: colour,
            dataLabels: { style: { fontSize: 12, fontFamily: "Arial" }, color: "#F2F5FA", precision: 0 }
        });
    delta.sciChartSurface.renderableSeries.add(
        deltaColumns(positiveDelta, "#26A69A"),
        deltaColumns(negativeDelta, "#EF5350"),
        new FastLineRenderableSeries(delta.wasmContext, {
            dataSeries: cumulativeDelta,
            yAxisId: "cumulative",
            stroke: "#50C7E0",
            strokeThickness: 2
        })
    );

    const fullRange = new NumberRange(-0.6, BAR_COUNT - 0.4);
    const zoomTo = (min, max) => priceXAxis.animateVisibleRange(new NumberRange(min, max), 400);

    // Line up the two panes' axes, and zoom and pan them together in time
    const group = new SciChartVerticalGroup();
    group.addSurfaceToGroup(price.sciChartSurface);
    group.addSurfaceToGroup(delta.sciChartSurface);
    for (const surface of [price.sciChartSurface, delta.sciChartSurface]) {
        surface.chartModifiers.add(
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            // Double-click resets to all the bars
            new ZoomExtentsModifier({
                xyDirection: EXyDirection.XDirection,
                onZoomExtents: () => {
                    zoomTo(fullRange.min, fullRange.max);
                    return false;
                }
            }),
            new CursorModifier({ showTooltip: false, showAxisLabels: true, crosshairStroke: "#C8D3E8AA" })
        );
    }

    // --- Build the data and redraw on every zoom, pan or control change ---
    let footprints = [];
    let stats = [];
    let rowTicks = 1;

    // Candles, delta and cumulative delta: rebuilt when the row size changes
    function onRowSizeChanged() {
        rowTicks = Number(ui.rowSelect.value);
        footprints = trades.map((barTrades) => buildFootprint(barTrades, rowTicks));
        stats = footprints.map((fp) => valueArea(fp));
        ohlc.clear();
        positiveDelta.clear();
        negativeDelta.clear();
        cumulativeDelta.clear();
        let running = 0;
        footprints.forEach((fp, i) => {
            ohlc.append(i, fp.open, fp.high, fp.low, fp.close);
            running += stats[i].delta;
            positiveDelta.append(i, stats[i].delta >= 0 ? stats[i].delta : NaN);
            negativeDelta.append(i, stats[i].delta < 0 ? stats[i].delta : NaN);
            cumulativeDelta.append(i, running);
        });
        onViewChanged();
    }

    // Fit the price axis to the visible bars, switch between candles and footprint by bar width, and redraw the footprint
    function onViewChanged() {
        const view = priceXAxis.visibleRange;
        const first = Math.max(0, Math.ceil(view.min - 0.5));
        const last = Math.min(BAR_COUNT - 1, Math.floor(view.max + 0.5));
        if (last < first) return;
        let low = Infinity;
        let high = -Infinity;
        for (let i = first; i <= last; i++) {
            low = Math.min(low, footprints[i].low);
            high = Math.max(high, footprints[i].high);
        }
        const pad = Math.max((high - low) * 0.04, TICK * rowTicks);
        priceYAxis.visibleRange = new NumberRange(low - pad, high + pad);
        // Ticks on whole bars only, so each label is one bar's start time
        deltaXAxis.autoTicks = false;
        deltaXAxis.majorDelta = Math.max(1, [1, 2, 5, 10].find((step) => (view.max - view.min) / step <= 10) ?? 10);
        deltaXAxis.minorDelta = deltaXAxis.majorDelta;

        const rect = price.sciChartSurface.seriesViewRect;
        const plotWidth = rect ? rect.width / window.devicePixelRatio : 800;
        const plotHeight = rect ? rect.height / window.devicePixelRatio : 400;
        const barPixels = plotWidth / (view.max - view.min);
        const rowPixels = ((TICK * rowTicks) / (high + 2 * pad - low)) * plotHeight;
        const showFootprint = barPixels >= 34;
        const showNumbers = showFootprint && barPixels >= 90 && rowPixels >= 11;
        candles.dataPointWidth = showFootprint ? 0.03 : 0.7; // a thin line through the footprint
        for (const series of footprintSeries) series.isVisible = showFootprint;
        if (showFootprint) drawFootprint(first, last, showNumbers);
    }

    function drawFootprint(first, last, showNumbersInView) {
        // Text isn't clipped to the chart area, so numbers are drawn only for bars and rows fully on screen
        const view = priceXAxis.visibleRange;
        const prices = priceYAxis.visibleRange;
        const mode = ui.modeSelect.value;
        const ratio = Number(ui.imbalanceSelect.value);
        const rowHeight = TICK * rowTicks;
        const half = 0.4; // half the width of a bar's footprint, in bars
        const cellX = [], cellX1 = [], cellY = [], cellY1 = [];
        const vaX = [], vaX1 = [], vaY = [], vaY1 = [];
        const pocX = [], pocX1 = [], pocY = [], pocY1 = [];
        const stackX = [], stackX1 = [], stackY = [], stackY1 = [];
        const textX = [], textY = [], textValue = [];
        const hiX = [], hiY = [], hiValue = [];
        cellColours = [];
        stackColours = [];
        // Row r's top and bottom price: rows are centred on the prices they hold
        const rowTop = (fp, r) => ((fp.lowRow + r) * rowTicks + rowTicks - 1) * TICK + TICK / 2;
        const rowBottom = (fp, r) => (fp.lowRow + r) * rowTicks * TICK - TICK / 2;
        const addCell = (x, x1, fp, r, colour) => {
            const gap = rowHeight * 0.06;
            cellX.push(x);
            cellX1.push(x1);
            cellY.push(rowTop(fp, r) - gap);
            cellY1.push(rowBottom(fp, r) + gap);
            cellColours.push(colour);
        };
        const addText = (x, fp, r, value, highlighted) => {
            const y = (rowTop(fp, r) + rowBottom(fp, r)) / 2;
            if (rowTop(fp, r) > prices.max || rowBottom(fp, r) < prices.min) return;
            (highlighted ? hiX : textX).push(x);
            (highlighted ? hiY : textY).push(y);
            (highlighted ? hiValue : textValue).push(value);
        };

        for (let i = first; i <= last; i++) {
            const fp = footprints[i];
            const s = stats[i];
            const showNumbers = showNumbersInView && i - 0.5 >= view.min && i + 0.5 <= view.max;
            const { askImbalance, bidImbalance } = imbalances(fp, ratio);
            const n = fp.buy.length;
            const maxSide = Math.max(1, ...fp.buy, ...fp.sell);
            const maxTotal = Math.max(1, ...fp.buy.map((b, r) => b + fp.sell[r]));
            const maxDelta = Math.max(1, ...fp.buy.map((b, r) => Math.abs(b - fp.sell[r])));
            for (let r = 0; r < n; r++) {
                const buy = fp.buy[r];
                const sell = fp.sell[r];
                if (mode === "bidask") {
                    // Bid (sell) volume on the left, ask (buy) volume on the right; brighter for more volume,
                    // and a bright solid colour for an imbalance
                    addCell(i - half, i, fp, r, bidImbalance[r] ? argb(1, [255, 82, 110]) : argb(0.12 + 0.6 * (sell / maxSide), RED));
                    addCell(i, i + half, fp, r, askImbalance[r] ? argb(1, [0, 230, 160]) : argb(0.12 + 0.6 * (buy / maxSide), GREEN));
                    if (showNumbers) {
                        addText(i - half / 2, fp, r, String(sell), bidImbalance[r]);
                        addText(i + half / 2, fp, r, String(buy), askImbalance[r]);
                    }
                } else if (mode === "profile") {
                    // A volume profile per bar: total volume as a horizontal bar, split into sell (red) and buy (green)
                    const width = (2 * half * (buy + sell)) / maxTotal;
                    const split = i - half + (width * sell) / Math.max(1, buy + sell);
                    if (sell > 0) addCell(i - half, split, fp, r, argb(0.7, RED));
                    if (buy > 0) addCell(split, i - half + width, fp, r, argb(0.7, GREEN));
                    if (showNumbers) addText(i + half - 0.12, fp, r, String(buy + sell), false);
                } else {
                    // Delta per row: buy minus sell, green when buyers were more aggressive, red when sellers were
                    const d = buy - sell;
                    addCell(i - half, i + half, fp, r, argb(0.12 + 0.75 * (Math.abs(d) / maxDelta), d >= 0 ? GREEN : RED));
                    if (showNumbers) addText(i, fp, r, d > 0 ? `+${d}` : String(d), false);
                }
            }
            // Point of control outline and value area band
            pocX.push(i - half);
            pocX1.push(i + half);
            pocY.push(rowTop(fp, s.poc));
            pocY1.push(rowBottom(fp, s.poc));
            vaX.push(i - half - 0.03);
            vaX1.push(i + half + 0.03);
            vaY.push(rowTop(fp, s.hi));
            vaY1.push(rowBottom(fp, s.lo));
            // Stacked imbalances: a bar beside the rows, red on the left for sellers, green on the right for buyers
            for (const [flags, x, x1, colour] of [
                [bidImbalance, i - half - 0.07, i - half - 0.03, argb(1, [255, 82, 110])],
                [askImbalance, i + half + 0.03, i + half + 0.07, argb(1, [0, 230, 160])]
            ]) {
                for (const run of stackedRuns(flags)) {
                    stackX.push(x);
                    stackX1.push(x1);
                    stackY.push(rowTop(fp, run.to));
                    stackY1.push(rowBottom(fp, run.from));
                    stackColours.push(colour);
                }
            }
        }
        const setRects = (series, x, y, x1, y1) => {
            series.dataSeries.clear();
            series.dataSeries.appendRange(x, y, x1, y1);
        };
        setRects(cells, cellX, cellY, cellX1, cellY1);
        setRects(pocOutline, pocX, pocY, pocX1, pocY1);
        const va = ui.valueAreaCheckbox.checked;
        setRects(valueAreaBands, va ? vaX : [], va ? vaY : [], va ? vaX1 : [], va ? vaY1 : []);
        setRects(stackMarkers, stackX, stackY, stackX1, stackY1);
        const setText = (series, x, y, values) => {
            series.dataSeries.clear();
            series.dataSeries.appendRange(x, y, values);
        };
        setText(plainText, textX, textY, textValue);
        setText(highlightText, hiX, hiY, hiValue);
    }

    // --- The controls ---
    const footprintView = () => zoomTo(BAR_COUNT - 5.6, BAR_COUNT - 0.4);
    let syncing = false;
    priceXAxis.visibleRangeChanged.subscribe(() => {
        // Keep at least three bars on screen
        const { min, max } = priceXAxis.visibleRange;
        if (max - min < 3) {
            priceXAxis.visibleRange = new NumberRange((min + max) / 2 - 1.5, (min + max) / 2 + 1.5);
            return;
        }
        if (!syncing) {
            syncing = true;
            deltaXAxis.visibleRange = priceXAxis.visibleRange;
            syncing = false;
        }
        onViewChanged();
    });
    deltaXAxis.visibleRangeChanged.subscribe(() => {
        if (syncing) return;
        syncing = true;
        priceXAxis.visibleRange = deltaXAxis.visibleRange;
        syncing = false;
    });
    ui.footprintButton.addEventListener("click", footprintView);
    ui.candlesButton.addEventListener("click", () => zoomTo(fullRange.min, fullRange.max));
    ui.modeSelect.addEventListener("change", onViewChanged);
    ui.imbalanceSelect.addEventListener("change", onViewChanged);
    ui.valueAreaCheckbox.addEventListener("change", onViewChanged);
    ui.rowSelect.addEventListener("change", onRowSizeChanged);
    // Redraw once the chart has a size, so the numbers appear or hide for the real bar width
    let lastWidth = -1;
    price.sciChartSurface.rendered.subscribe(() => {
        if (!footprints.length) return;
        const rect = price.sciChartSurface.seriesViewRect;
        if (rect && rect.width !== lastWidth) {
            lastWidth = rect.width;
            onViewChanged();
        }
    });

    onRowSizeChanged();
    priceXAxis.visibleRange = new NumberRange(BAR_COUNT - 5.6, BAR_COUNT - 0.4);
    // #region_A_end
}

footprintChart("scichart-root");
