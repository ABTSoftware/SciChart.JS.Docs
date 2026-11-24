import * as SciChart from "scichart";

// Sample data: a simulated limit order book for a share trading near 100.00 with a 0.01 tick, so the chart looks
// the same every time and needs no market data feed. Every 0.1 s of market time, resting orders are added and
// cancelled, random market orders take liquidity from the best price, and now and then a large order appears for
// a moment (or a few seconds) and is cancelled. Prices are stored as whole ticks to avoid rounding errors.
const TICK = 0.01;
const LOW_TICK = 9500; // the lowest price the book can hold: 95.00
const LEVELS = 1001; // 95.00 to 105.00
const STEP_SECONDS = 0.1; // market time per simulation step
const BOOK_DEPTH = 150; // levels kept on each side of the mid price

const PROFILES = {
    balanced: { label: "Balanced", bid: 1, ask: 1, fill: 1 },
    bidHeavy: { label: "Bid-heavy", bid: 2.5, ask: 0.7, fill: 1 },
    thin: { label: "Thin", bid: 0.25, ask: 0.25, fill: 0.45 }
};

function createOrderBook(seed) {
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const bids = new Float64Array(LEVELS); // resting size at each price, by tick index
    const asks = new Float64Array(LEVELS);
    let profile = PROFILES.balanced;
    let temporary = []; // large orders that will be cancelled: { side, index, size, expires }
    let time = 0;
    // Typical resting size at d ticks from the mid: more size waits further away
    const typical = (d) => 120 + 6 * d;

    const bestBid = () => {
        for (let i = LEVELS - 1; i >= 0; i--) if (bids[i] > 0) return i;
        return -1;
    };
    const bestAsk = () => {
        for (let i = 0; i < LEVELS; i++) if (asks[i] > 0) return i;
        return LEVELS;
    };
    const midTicks = () => (bestBid() + bestAsk()) / 2;
    const price = (index) => (index + LOW_TICK) * TICK;

    function reset(profileName, centre) {
        profile = PROFILES[profileName];
        bids.fill(0);
        asks.fill(0);
        temporary = [];
        const c = Math.round(centre);
        for (let d = 1; d <= BOOK_DEPTH; d++) {
            if (d === 1 || random() < profile.fill) bids[c - d] = typical(d) * profile.bid * (0.5 + random());
            if (d === 1 || random() < profile.fill) asks[c + d] = typical(d) * profile.ask * (0.5 + random());
        }
    }

    function refill(levels, from, direction, scale) {
        for (let d = 1; d <= BOOK_DEPTH; d++) {
            const i = from + direction * d;
            if (i >= 0 && i < LEVELS && (d === 1 || random() < profile.fill)) levels[i] = typical(d) * scale * (0.5 + random());
        }
    }

    // A market order takes liquidity from the best price outwards until it is filled ("walking the book")
    function marketOrder(side, size) {
        const book = side === "buy" ? asks : bids;
        const fills = [];
        let remaining = size;
        let i = side === "buy" ? bestAsk() : bestBid();
        while (remaining > 0 && i >= 0 && i < LEVELS) {
            if (book[i] > 0) {
                const filled = Math.min(remaining, book[i]);
                book[i] -= filled;
                if (book[i] < 1e-9) book[i] = 0;
                remaining -= filled;
                fills.push({ price: price(i), size: filled });
            }
            i += side === "buy" ? 1 : -1;
        }
        // If the order used up that whole side of the book, new orders arrive beyond the last fill
        const last = Math.round(fills.length ? fills[fills.length - 1].price / TICK : 0) - LOW_TICK;
        if (side === "buy" && bestAsk() === LEVELS) refill(asks, last, 1, profile.ask);
        if (side === "sell" && bestBid() === -1) refill(bids, last, -1, profile.bid);
        return { fills, unfilled: remaining };
    }

    function step() {
        time += STEP_SECONDS;
        const b = bestBid();
        const a = bestAsk();
        const mid = (b + a) / 2;
        // Resting orders are added and cancelled: re-draw the size at 40 random levels on each side, more often
        // near the mid. A bid can go anywhere below the best ask (inside the spread too), an ask anywhere above
        // the best bid.
        for (let k = 0; k < 40; k++) {
            const d = 1 + Math.floor(BOOK_DEPTH * random() ** 2);
            const ib = Math.floor(mid - d + 0.5);
            const ia = Math.ceil(mid + d - 0.5);
            if (ib < a && ib >= 0) {
                const target = random() < profile.fill ? typical(d) * profile.bid * (0.5 + random()) : 0;
                bids[ib] += (target - bids[ib]) * 0.3;
            }
            if (ia > b && ia < LEVELS) {
                const target = random() < profile.fill ? typical(d) * profile.ask * (0.5 + random()) : 0;
                asks[ia] += (target - asks[ia]) * 0.3;
            }
        }
        // Market orders from other traders: about five a second. Buys and sells are equally likely at 100.00;
        // away from it, the side that pulls the price back is a little more likely, so the price stays in view.
        const buyChance = Math.min(0.9, Math.max(0.1, 0.5 - 0.3 * (price(mid) - 100)));
        const orderSize = 80 * Math.min(profile.bid, profile.ask);
        let count = 0;
        for (let p = Math.exp(-0.5), u = random(); u > p; u *= random()) count++;
        for (let k = 0; k < count; k++) marketOrder(random() < buyChance ? "buy" : "sell", -Math.log(random() + 1e-12) * orderSize);
        // Large orders that appear and are cancelled: brief ones (0.2 to 0.8 s) and longer walls (5 to 20 s)
        const addTemporary = (maxSeconds, minSeconds, nearest, farthest, multiple) => {
            const side = random() < 0.5 ? "bid" : "ask";
            const d = nearest + Math.floor(random() * (farthest - nearest));
            const index = side === "bid" ? bestBid() - d : bestAsk() + d;
            if (index < 0 || index >= LEVELS) return;
            const size = typical(d) * multiple * (side === "bid" ? profile.bid : profile.ask);
            (side === "bid" ? bids : asks)[index] += size;
            temporary.push({ side, index, size, expires: time + minSeconds + random() * (maxSeconds - minSeconds) });
        };
        if (random() < 0.06) addTemporary(0.8, 0.2, 2, 20, 6);
        if (random() < 0.012) addTemporary(20, 5, 10, 60, 12);
        temporary = temporary.filter((order) => {
            if (order.expires > time) return true;
            const book = order.side === "bid" ? bids : asks;
            book[order.index] = Math.max(0, book[order.index] - order.size); // cancelled: whatever is left goes
            return false;
        });
        // Orders far from the price are dropped from the simulation
        const m = midTicks();
        for (let i = 0; i < LEVELS; i++) {
            if (Math.abs(i - m) > BOOK_DEPTH) {
                bids[i] = 0;
                asks[i] = 0;
            }
        }
    }

    return {
        bids,
        asks,
        reset,
        step,
        marketOrder,
        bestBid,
        bestAsk,
        get time() {
            return time;
        }
    };
}

// The controls, the readout and the two charts each need an element. This splits the page's div into them;
// in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 12px; color:#ffffff;" + font;
    const button = "font:inherit; padding:2px 12px; cursor:pointer";
    bar.innerHTML =
        `<label>Liquidity <select data-id="profile" style="font:inherit">` +
        `<option value="balanced" selected>Balanced</option><option value="bidHeavy">Bid-heavy</option>` +
        `<option value="thin">Thin</option></select></label>` +
        `<label>Feed updates per second <select data-id="rate" style="font:inherit">` +
        `<option value="10" selected>10</option><option value="5">5</option><option value="1">1</option></select></label>` +
        `<label>Market buy of <select data-id="size" style="font:inherit">` +
        `<option value="1000">1,000</option><option value="5000" selected>5,000</option>` +
        `<option value="20000">20,000</option></select></label>` +
        `<button data-id="buy" type="button" style="${button}">Send market buy</button>` +
        `<button data-id="pause" type="button" style="${button}">Pause</button>`;
    const makeDiv = (name, flex) => {
        const div = document.createElement("div");
        div.id = `${divElementId}-${name}`; // each chart's div needs its own id
        div.style.cssText = `flex:${flex}; min-height:160px;`;
        return div;
    };
    const depthDiv = makeDiv("depth", 1);
    const heatmapDiv = makeDiv("heatmap", 1.15);
    const readout = document.createElement("div");
    readout.style.cssText = "padding:4px 12px; color:#ffffff; font-variant-numeric:tabular-nums;" + font;
    const tradeReport = document.createElement("div");
    tradeReport.setAttribute("aria-live", "polite");
    tradeReport.style.cssText = "padding:0 12px 6px; color:#F6B26B; min-height:1.4em;" + font;
    root.append(bar, readout, tradeReport, depthDiv, heatmapDiv);
    const get = (selector) => bar.querySelector(selector);
    return {
        depthDiv,
        heatmapDiv,
        readout,
        tradeReport,
        profileSelect: get('select[data-id="profile"]'),
        rateSelect: get('select[data-id="rate"]'),
        sizeSelect: get('select[data-id="size"]'),
        buyButton: get('button[data-id="buy"]'),
        pauseButton: get('button[data-id="pause"]')
    };
}

async function marketDepthChart(divElementId) {
    const ui = createLayout(divElementId);
    const book = createOrderBook(20261124);
    book.reset("balanced", 10000 - LOW_TICK);

    // #region_A_start
    // A live market depth chart and an order book heatmap from the same simulated order book, with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        FastMountainRenderableSeries,
        FastLineRenderableSeries,
        XyDataSeries,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        BoxAnnotation,
        VerticalLineAnnotation,
        TextAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const VIEW = 0.6; // both charts show the mid price ± 0.60
    const COLUMNS = 400; // heatmap history: 400 columns of 0.1 s = 40 seconds
    const ROW_LOW = 96; // heatmap rows: one per tick from 96.00 to 104.00
    const ROWS = 801;
    const price = (index) => (index + LOW_TICK) * TICK;
    const fmt = (value, digits) => value.toLocaleString("en-GB", { minimumFractionDigits: digits, maximumFractionDigits: digits });

    // --- Order book maths (plain JavaScript) ---

    // Best bid, best ask, spread, mid, and the imbalance of resting size within ±1% of the mid
    function bookStats() {
        const b = book.bestBid();
        const a = book.bestAsk();
        const bestBid = price(b);
        const bestAsk = price(a);
        const mid = (bestBid + bestAsk) / 2;
        let bidSize = 0;
        let askSize = 0;
        for (let i = 0; i < LEVELS; i++) {
            if (price(i) >= mid * 0.99) bidSize += book.bids[i];
            if (price(i) <= mid * 1.01) askSize += book.asks[i];
        }
        return { bestBid, bestAsk, mid, spread: bestAsk - bestBid, bidSize, askSize, imbalance: (bidSize - askSize) / (bidSize + askSize) };
    }

    // Cumulative size as a step outline: asks add up from the best ask upwards, bids from the best bid downwards.
    // Each level adds two points at the same price (before and after its size), so the steps are exact.
    function depthCurves(mid) {
        const askX = [];
        const askY = [];
        let total = 0;
        for (let i = book.bestAsk(); i < LEVELS && price(i) <= mid + VIEW; i++) {
            if (book.asks[i] <= 0) continue;
            askX.push(price(i), price(i));
            askY.push(total, (total += book.asks[i]));
        }
        askX.push(mid + VIEW);
        askY.push(total);
        const bidX = [];
        const bidY = [];
        total = 0;
        for (let i = book.bestBid(); i >= 0 && price(i) >= mid - VIEW; i--) {
            if (book.bids[i] <= 0) continue;
            bidX.push(price(i), price(i));
            bidY.push(total, (total += book.bids[i]));
        }
        bidX.push(mid - VIEW);
        bidY.push(total);
        return { askX, askY, bidX: bidX.reverse(), bidY: bidY.reverse() }; // x must run left to right
    }

    // --- Top chart: the market depth chart ---
    const theme = new SciChartJsNavyTheme();
    const depth = await SciChartSurface.create(ui.depthDiv, { theme, title: "Market depth: cumulative size by price", titleStyle: { fontSize: 15 } });
    const depthX = new NumericAxis(depth.wasmContext, { axisTitle: "Price", labelPrecision: 2, autoRange: EAutoRange.Never });
    const depthY = new NumericAxis(depth.wasmContext, {
        axisTitle: "Cumulative size",
        axisAlignment: EAxisAlignment.Left,
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0, 0.1),
        labelPrecision: 0
    });
    depth.sciChartSurface.xAxes.add(depthX);
    depth.sciChartSurface.yAxes.add(depthY);
    const bidSeries = new XyDataSeries(depth.wasmContext, { dataSeriesName: "Bids (cumulative)", isSorted: true, containsNaN: false });
    const askSeries = new XyDataSeries(depth.wasmContext, { dataSeriesName: "Asks (cumulative)", isSorted: true, containsNaN: false });
    depth.sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(depth.wasmContext, { dataSeries: bidSeries, stroke: "#26a69a", strokeThickness: 2, fill: "#26a69a66" }),
        new FastMountainRenderableSeries(depth.wasmContext, { dataSeries: askSeries, stroke: "#ef5350", strokeThickness: 2, fill: "#ef535066" })
    );
    // The mid price, and the price range a market buy walked through
    const midLine = new VerticalLineAnnotation({ x1: 100, stroke: "#ffffff", strokeThickness: 1, strokeDashArray: [4, 4] });
    const sweep = new BoxAnnotation({ yCoordinateMode: ECoordinateMode.Relative, y1: 0, y2: 1, x1: 0, x2: 0, fill: "#F6B26B40", stroke: "#F6B26B", strokeThickness: 1, isHidden: true });
    const sweepLabel = new TextAnnotation({
        yCoordinateMode: ECoordinateMode.Relative,
        y1: 0.02,
        x1: 0,
        text: "",
        fontSize: 13,
        textColor: "#F6B26B",
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        isHidden: true
    });
    depth.sciChartSurface.annotations.add(midLine, sweep, sweepLabel);

    // --- Bottom chart: the order book heatmap (resting size at each price over time) with the mid price ---
    const heat = await SciChartSurface.create(ui.heatmapDiv, { theme, title: "Order book heatmap: resting size over the last 40 seconds", titleStyle: { fontSize: 15 } });
    const timeAxis = new NumericAxis(heat.wasmContext, { axisTitle: "Market time (seconds)", labelPrecision: 0, autoRange: EAutoRange.Never });
    const priceAxis = new NumericAxis(heat.wasmContext, { axisTitle: "Price", labelPrecision: 2, autoRange: EAutoRange.Never });
    heat.sciChartSurface.xAxes.add(timeAxis);
    heat.sciChartSurface.yAxes.add(priceAxis);
    // zValues[row][column]: row = price level, column = time. New columns enter on the right.
    const zValues = Array.from({ length: ROWS }, () => new Array(COLUMNS).fill(0));
    const heatmapData = new UniformHeatmapDataSeries(heat.wasmContext, {
        zValues,
        xStart: 0,
        xStep: STEP_SECONDS,
        yStart: ROW_LOW - TICK / 2, // centre each row on its price
        yStep: TICK,
        dataSeriesName: "Resting size"
    });
    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 3000,
        gradientStops: [
            { offset: 0, color: "#0B1730" },
            { offset: 0.15, color: "#1E4E8C" },
            { offset: 0.35, color: "#2BB3C0" },
            { offset: 0.65, color: "#F6E05E" },
            { offset: 1, color: "#FFFFFF" }
        ]
    });
    const midSeries = new XyDataSeries(heat.wasmContext, { dataSeriesName: "Mid price", fifoCapacity: COLUMNS, isSorted: true, containsNaN: false });
    heat.sciChartSurface.renderableSeries.add(
        new UniformHeatmapRenderableSeries(heat.wasmContext, { dataSeries: heatmapData, colorMap, opacity: 1 }),
        new FastLineRenderableSeries(heat.wasmContext, { dataSeries: midSeries, stroke: "#FF6EC7", strokeThickness: 2 })
    );
    const sweepMarks = [];

    const modifiers = () => [
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    ];
    depth.sciChartSurface.chartModifiers.add(...modifiers(), new LegendModifier({ showCheckboxes: false }));
    heat.sciChartSurface.chartModifiers.add(...modifiers(), new LegendModifier({ showCheckboxes: false }));

    // --- Each step: advance the book, add a heatmap column, redraw when the feed sends an update ---
    let paused = false;
    let nextUpdate = 0;
    let shown = bookStats(); // what the feed last sent
    let shownColumn = new Array(ROWS).fill(0);

    function snapshot() {
        shown = bookStats();
        shownColumn = shownColumn.map((_, row) => {
            const i = Math.round((ROW_LOW + row * TICK) / TICK) - LOW_TICK;
            return book.bids[i] + book.asks[i];
        });
        const curves = depthCurves(shown.mid);
        bidSeries.clear();
        bidSeries.appendRange(curves.bidX, curves.bidY);
        askSeries.clear();
        askSeries.appendRange(curves.askX, curves.askY);
        midLine.x1 = shown.mid;
        ui.readout.textContent =
            `Best bid ${fmt(shown.bestBid, 2)} · Best ask ${fmt(shown.bestAsk, 2)} · ` +
            `Spread ${fmt(shown.spread, 2)} (${fmt((shown.spread / shown.mid) * 10000, 1)} bp) · Mid ${fmt(shown.mid, 3)} · ` +
            `Within ±1%: bids ${fmt(shown.bidSize, 0)}, asks ${fmt(shown.askSize, 0)}, imbalance ${shown.imbalance >= 0 ? "+" : ""}${fmt(shown.imbalance, 2)}`;
    }

    // One column of the heatmap per 0.1 s: between feed updates the last update is repeated, as a slow feed would
    function addColumn() {
        for (let row = 0; row < ROWS; row++) {
            zValues[row].shift();
            zValues[row].push(shownColumn[row]);
        }
        heatmapData.xStart = book.time - (COLUMNS - 0.5) * STEP_SECONDS;
        heatmapData.setZValues(zValues);
        midSeries.append(book.time, shown.mid);
    }

    function follow() {
        depthX.visibleRange = new NumberRange(shown.mid - VIEW, shown.mid + VIEW);
        timeAxis.visibleRange = new NumberRange(book.time - COLUMNS * STEP_SECONDS, book.time);
        priceAxis.visibleRange = new NumberRange(shown.mid - VIEW, shown.mid + VIEW);
    }

    function advance() {
        book.step();
        if (book.time >= nextUpdate - 1e-9) {
            snapshot();
            nextUpdate += 1 / Number(ui.rateSelect.value);
        }
        addColumn();
    }

    // Fill the history before the first draw, so the heatmap starts full
    for (let k = 0; k < COLUMNS; k++) advance();
    follow();

    const timer = setInterval(() => {
        if (depth.sciChartSurface.isDeleted) return clearInterval(timer);
        if (paused) return;
        advance();
        follow();
    }, STEP_SECONDS * 1000);

    // --- The controls ---
    ui.profileSelect.addEventListener("change", () => {
        const s = bookStats();
        book.reset(ui.profileSelect.value, s.mid / TICK - LOW_TICK);
        snapshot();
    });
    ui.rateSelect.addEventListener("change", () => (nextUpdate = book.time));
    ui.pauseButton.addEventListener("click", () => {
        paused = !paused;
        ui.pauseButton.textContent = paused ? "Resume" : "Pause";
        if (!paused) follow();
    });

    // A market buy walks up the ask side: show each fill, the average price and the slippage
    ui.buyButton.addEventListener("click", () => {
        const before = bookStats();
        const size = Number(ui.sizeSelect.value);
        const { fills, unfilled } = book.marketOrder("buy", size);
        if (!fills.length) return;
        const filled = size - unfilled;
        const cost = fills.reduce((sum, f) => sum + f.price * f.size, 0);
        const average = cost / filled;
        const last = fills[fills.length - 1].price;
        const bp = (value) => fmt((value / before.mid) * 10000, 1); // in basis points: 1 bp = 0.01%
        sweep.x1 = before.bestAsk - TICK / 2;
        sweep.x2 = last + TICK / 2;
        sweep.isHidden = false;
        sweepLabel.x1 = sweep.x2;
        sweepLabel.text = ` Buy ${fmt(filled, 0)}: average ${fmt(average, 4)}`;
        sweepLabel.isHidden = false;
        // Mark the swept prices on the heatmap at the current time
        const mark = new BoxAnnotation({ x1: book.time - 0.3, x2: book.time, y1: sweep.x1, y2: sweep.x2, fill: "#F6B26B99", stroke: "#F6B26B", strokeThickness: 1 });
        heat.sciChartSurface.annotations.add(mark);
        sweepMarks.push(mark);
        if (sweepMarks.length > 5) heat.sciChartSurface.annotations.remove(sweepMarks.shift(), true);
        ui.tradeReport.textContent =
            `Market buy of ${fmt(size, 0)}: ${fills.length} price level${fills.length > 1 ? "s" : ""} from ${fmt(fills[0].price, 2)} to ${fmt(last, 2)}, ` +
            `average ${fmt(average, 4)}. Slippage ${fmt(average - before.bestAsk, 4)} (${bp(average - before.bestAsk)} bp) against the best ask, ` +
            `${fmt(average - before.mid, 4)} (${bp(average - before.mid)} bp) against the mid` +
            (unfilled > 0 ? `; ${fmt(unfilled, 0)} unfilled.` : ".");
        snapshot();
        nextUpdate = book.time + 1 / Number(ui.rateSelect.value);
    });

    snapshot();
    // #region_A_end
}

marketDepthChart("scichart-root");
