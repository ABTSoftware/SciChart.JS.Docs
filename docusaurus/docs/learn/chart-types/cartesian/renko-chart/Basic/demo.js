import * as SciChart from "scichart";

const DAYS = 250; // trading days of sample data
const START_DATE = Date.UTC(2025, 0, 1); // day 0, in milliseconds
const UP = "#26a69a";
const DOWN = "#ef5350";

// Sample data: daily open, high, low and close prices from a seeded random walk whose drift changes every
// few weeks, so the chart looks the same every time and has rising, falling and sideways stretches.
function generatePrices(count) {
    let seed = 1993;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const drifts = [0.25, -0.05, -0.3, 0.1, 0.35, -0.15];
    const open = [];
    const high = [];
    const low = [];
    const close = [];
    let last = 100;
    for (let i = 0; i < count; i++) {
        const drift = drifts[Math.floor((i / count) * drifts.length)];
        const o = last;
        const c = Math.max(5, o + drift + 1.3 * gaussian());
        open.push(o);
        close.push(c);
        high.push(Math.max(o, c) + Math.abs(gaussian()) * 0.8);
        low.push(Math.min(o, c) - Math.abs(gaussian()) * 0.8);
        last = c;
    }
    return { open, high, low, close };
}

// Day number to a date label, e.g. "14 Mar"
function formatDay(day, withYear) {
    return new Date(START_DATE + Math.round(day) * 86400000).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: withYear ? "numeric" : undefined,
        timeZone: "UTC"
    });
}

// The controls and the charts each need an element. This splits the page's div into a control bar, the
// candlestick chart, the Renko chart and a readout; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Box size <select data-id="method" style="font:inherit">` +
        `<option value="fixed" selected>Fixed</option><option value="atr">ATR (14 days)</option></select></label>` +
        `<label>Fixed size <input data-id="box" type="range" min="0.5" max="5" step="0.25" value="2" ` +
        `style="vertical-align:middle; width:120px"> <output data-id="box"></output></label>` +
        `<label>Price source <select data-id="source" style="font:inherit">` +
        `<option value="close" selected>Close</option><option value="highlow">High-low</option></select></label>` +
        `<label>Renko x-axis <select data-id="axis" style="font:inherit">` +
        `<option value="brick" selected>Brick number</option><option value="time">Date formed</option></select></label>`;
    const candleDiv = document.createElement("div");
    candleDiv.id = divElementId + "-candles"; // each chart's div needs its own id
    candleDiv.style.cssText = "flex:1; min-height:200px;";
    const renkoDiv = document.createElement("div");
    renkoDiv.id = divElementId + "-renko";
    renkoDiv.style.cssText = "flex:1; min-height:200px;";
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:6px 12px; color:#ffffff; min-height:2.6em;" + font;
    root.append(bar, candleDiv, renkoDiv, readout);
    const get = (selector) => bar.querySelector(selector);
    return {
        candleDiv,
        renkoDiv,
        readout,
        methodSelect: get('select[data-id="method"]'),
        boxInput: get('input[data-id="box"]'),
        boxOutput: get('output[data-id="box"]'),
        sourceSelect: get('select[data-id="source"]'),
        axisSelect: get('select[data-id="axis"]')
    };
}

async function renkoChart(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // A candlestick chart and the Renko chart built from the same prices, charted with SciChart.js
    const {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAutoRange,
        FastCandlestickRenderableSeries,
        OhlcDataSeries,
        FastRectangleRenderableSeries,
        XyxyDataSeries,
        EColumnMode,
        EColumnYMode,
        VerticalLineAnnotation,
        CustomChartModifier2D,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Renko maths (plain JavaScript, no library needed) ---

    // Average true range (Wilder's smoothing): the typical daily range, including gaps from the previous close
    function averageTrueRange(prices, period = 14) {
        const { high, low, close } = prices;
        let value = 0;
        for (let i = 1; i < close.length; i++) {
            const trueRange = Math.max(high[i] - low[i], Math.abs(high[i] - close[i - 1]), Math.abs(low[i] - close[i - 1]));
            if (i <= period) value += trueRange / period;
            else value = (value * (period - 1) + trueRange) / period;
        }
        return value;
    }

    // Builds Renko bricks. A new brick needs the price to pass the last brick's top + box (up) or its
    // bottom - box (down). In a trend that is one box to continue and two boxes to reverse.
    // With "highlow", the high extends rising bricks and the low extends falling ones; the trend's own
    // direction is checked first.
    function buildBricks(prices, boxSize, source) {
        const bricks = [];
        const { close, high, low } = prices;
        let top = Math.round(close[0] / boxSize) * boxSize; // start on a multiple of the box size
        let bottom = top;
        let direction = 0;
        const add = (brickBottom, brickTop, up, day) => {
            bricks.push({ bottom: brickBottom, top: brickTop, up, day });
            bottom = brickBottom;
            top = brickTop;
            direction = up ? 1 : -1;
        };
        for (let day = 1; day < close.length; day++) {
            const upPrice = source === "highlow" ? high[day] : close[day];
            const downPrice = source === "highlow" ? low[day] : close[day];
            const before = bricks.length;
            const tryUp = () => {
                while (upPrice >= top + boxSize - 1e-9) add(top, top + boxSize, true, day);
            };
            const tryDown = () => {
                while (downPrice <= bottom - boxSize + 1e-9) add(bottom - boxSize, bottom, false, day);
            };
            if (direction >= 0) {
                tryUp();
                if (bricks.length === before) tryDown();
            } else {
                tryDown();
                if (bricks.length === before) tryUp();
            }
        }
        return bricks;
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const prices = generatePrices(DAYS);
    const days = prices.close.map((_, i) => i);
    const group = new SciChartVerticalGroup(); // lines up the two charts' y-axes, so their x-axes match

    // 1. Candlestick chart of the daily prices
    const candles = await SciChartSurface.create(ui.candleDiv, { theme });
    const candleXAxis = new NumericAxis(candles.wasmContext, { growBy: new NumberRange(0.01, 0.01) });
    candleXAxis.labelProvider.formatLabel = (day) => formatDay(day, false);
    candleXAxis.labelProvider.formatCursorLabel = (day) => formatDay(day, true);
    candles.sciChartSurface.xAxes.add(candleXAxis);
    candles.sciChartSurface.yAxes.add(
        new NumericAxis(candles.wasmContext, { axisTitle: "Daily candles", labelPrefix: "$", labelPrecision: 0, cursorLabelPrecision: 2, autoRange: EAutoRange.Always, growBy: new NumberRange(0.05, 0.05) })
    );
    candles.sciChartSurface.renderableSeries.add(
        new FastCandlestickRenderableSeries(candles.wasmContext, {
            dataSeries: new OhlcDataSeries(candles.wasmContext, {
                xValues: days,
                openValues: prices.open,
                highValues: prices.high,
                lowValues: prices.low,
                closeValues: prices.close,
                dataSeriesName: "Price"
            }),
            dataPointWidth: 0.7,
            brushUp: UP,
            strokeUp: UP,
            brushDown: DOWN,
            strokeDown: DOWN
        })
    );

    // 2. Renko chart: one rectangle series for rising bricks and one for falling bricks
    const renko = await SciChartSurface.create(ui.renkoDiv, { theme });
    const renkoXAxis = new NumericAxis(renko.wasmContext, { axisTitle: "Brick number", growBy: new NumberRange(0.01, 0.01) });
    renko.sciChartSurface.xAxes.add(renkoXAxis);
    renko.sciChartSurface.yAxes.add(
        new NumericAxis(renko.wasmContext, { axisTitle: "Renko bricks", labelPrefix: "$", labelPrecision: 0, autoRange: EAutoRange.Always, growBy: new NumberRange(0.05, 0.05) })
    );
    const brickSeries = (fill) => {
        const dataSeries = new XyxyDataSeries(renko.wasmContext);
        const series = new FastRectangleRenderableSeries(renko.wasmContext, {
            dataSeries,
            columnXMode: EColumnMode.StartEnd, // x = left edge, x1 = right edge
            columnYMode: EColumnYMode.TopBottom, // y = top, y1 = bottom
            fill: fill + "DD",
            stroke: "#14233C",
            strokeThickness: 1
        });
        renko.sciChartSurface.renderableSeries.add(series);
        return dataSeries;
    };
    const upBricks = brickSeries(UP);
    const downBricks = brickSeries(DOWN);

    // Dashed lines that link a day on the candlestick chart with the brick it made
    const lineOptions = { stroke: "#FFFFFF", strokeThickness: 1.5, strokeDashArray: [5, 4], isHidden: true };
    const candleLine = new VerticalLineAnnotation({ x1: 0, ...lineOptions });
    const renkoLine = new VerticalLineAnnotation({ x1: 0, ...lineOptions });
    candles.sciChartSurface.annotations.add(candleLine);
    renko.sciChartSurface.annotations.add(renkoLine);

    // --- Linking the two charts ---
    let bricks = [];
    let boxSize = 2;
    let byTime = false;
    let summary = "";

    // The last brick formed on or before a day, or -1
    const brickIndexForDay = (day) => {
        let index = -1;
        for (let i = 0; i < bricks.length && bricks[i].day <= day; i++) index = i;
        return index;
    };

    // Reports the x value under the mouse, so the other chart can show the matching day or brick
    const linkModifier = (onMove) =>
        new (class extends CustomChartModifier2D {
            modifierMouseMove(args) {
                super.modifierMouseMove(args);
                const surface = this.parentSurface;
                const x = args.mousePoint.x - surface.seriesViewRect.x;
                if (x >= 0 && x <= surface.seriesViewRect.width) onMove(surface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(x));
            }
            modifierMouseLeave(args) {
                super.modifierMouseLeave(args);
                candleLine.isHidden = true;
                renkoLine.isHidden = true;
                ui.readout.innerHTML = summary;
            }
        })();

    const showBrick = (index) => {
        const brick = bricks[index];
        if (!brick) return;
        candleLine.x1 = brick.day;
        candleLine.isHidden = false;
        renkoLine.x1 = byTime ? brick.day : index + 0.5;
        renkoLine.isHidden = false;
        ui.readout.innerHTML =
            `Brick ${index + 1} of ${bricks.length}: ${brick.up ? "up" : "down"}, $${brick.bottom.toFixed(2)} to $${brick.top.toFixed(2)}, ` +
            `formed on ${formatDay(brick.day, true)}.<br>${summary}`;
    };

    // Hovering a brick marks the day it formed; hovering a day marks the latest brick at that point
    renko.sciChartSurface.chartModifiers.add(
        linkModifier((x) => {
            if (byTime) {
                const index = brickIndexForDay(Math.round(x));
                if (index >= 0) showBrick(index);
            } else {
                showBrick(Math.min(bricks.length - 1, Math.max(0, Math.floor(x))));
            }
        })
    );
    candles.sciChartSurface.chartModifiers.add(
        linkModifier((x) => {
            const index = brickIndexForDay(Math.round(x));
            if (index >= 0) showBrick(index);
            candleLine.x1 = Math.round(x);
        })
    );

    // Tooltip on the candles; zoom with the wheel, pan by dragging, double-click to reset
    candles.sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true, showYLine: false }));
    for (const surface of [candles.sciChartSurface, renko.sciChartSurface]) {
        surface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
        group.addSurfaceToGroup(surface);
    }

    // In "Date formed" mode the two x-axes show the same days, so zooming one moves the other
    candleXAxis.visibleRangeChanged.subscribe(({ visibleRange }) => {
        if (byTime && !renkoXAxis.visibleRange.equals(visibleRange)) renkoXAxis.visibleRange = visibleRange;
    });
    renkoXAxis.visibleRangeChanged.subscribe(({ visibleRange }) => {
        if (byTime && !candleXAxis.visibleRange.equals(visibleRange)) candleXAxis.visibleRange = visibleRange;
    });

    // --- The controls ---
    function update() {
        const atr = averageTrueRange(prices);
        const useAtr = ui.methodSelect.value === "atr";
        boxSize = useAtr ? Math.round(atr * 100) / 100 : Number(ui.boxInput.value);
        ui.boxInput.disabled = useAtr;
        ui.boxOutput.textContent = useAtr ? `$${boxSize.toFixed(2)} (ATR)` : `$${boxSize.toFixed(2)}`;
        byTime = ui.axisSelect.value === "time";
        bricks = buildBricks(prices, boxSize, ui.sourceSelect.value);

        // Brick number mode: each brick fills one slot. Date formed mode: each brick sits on the day it formed,
        // so bricks formed on the same day stack up and quiet days leave gaps
        const x = bricks.map((b, i) => (byTime ? b.day - 0.5 : i + 0.05));
        const x1 = bricks.map((b, i) => (byTime ? b.day + 0.5 : i + 0.95));
        for (const { dataSeries, up } of [{ dataSeries: upBricks, up: true }, { dataSeries: downBricks, up: false }]) {
            const keep = bricks.map((b) => b.up === up);
            const pick = (values) => values.filter((_, i) => keep[i]);
            dataSeries.clear();
            dataSeries.appendRange(pick(x), pick(bricks.map((b) => b.top)), pick(x1), pick(bricks.map((b) => b.bottom)));
        }
        renkoXAxis.axisTitle = byTime ? "Date each brick formed" : "Brick number";
        renkoXAxis.labelProvider.formatLabel = byTime ? (day) => formatDay(day, false) : (value) => String(Math.round(value) + 1);
        renkoXAxis.visibleRange = byTime ? candleXAxis.visibleRange : new NumberRange(-0.5, Math.max(bricks.length, 1) + 0.5);
        if (!byTime) renko.sciChartSurface.zoomExtents();

        // Summary: brick count, reversals and the current run of same-colour bricks
        let run = 0;
        for (let i = bricks.length - 1; i >= 0 && bricks[i].up === bricks[bricks.length - 1].up; i--) run++;
        const reversals = bricks.filter((b, i) => i > 0 && b.up !== bricks[i - 1].up).length;
        const last = bricks[bricks.length - 1];
        summary =
            `${bricks.length} bricks from ${DAYS} days (box $${boxSize.toFixed(2)}, ATR $${atr.toFixed(2)}) · ${reversals} reversals · ` +
            (last ? `current run: ${run} ${last.up ? "up" : "down"} brick${run === 1 ? "" : "s"}` : "no bricks yet");
        ui.readout.innerHTML = summary;
        candleLine.isHidden = true;
        renkoLine.isHidden = true;
    }

    ui.methodSelect.addEventListener("change", update);
    ui.boxInput.addEventListener("input", update);
    ui.sourceSelect.addEventListener("change", update);
    ui.axisSelect.addEventListener("change", update);
    update();
    // #region_A_end
}

renkoChart("scichart-root");
