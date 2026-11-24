import * as SciChart from "scichart";

const SESSIONS = 3; // three simulated trading days
const BARS_PER_SESSION = 78; // 09:30 to 16:00 in five-minute bars
const BAR_MINUTES = 5;
const OPEN_MINUTES = 9 * 60 + 30; // 09:30
const GAP = 3; // empty slots on the x axis between days, so the overnight break is visible
const SLOT = BARS_PER_SESSION + GAP;

// Sample data: seeded random numbers, so the chart looks the same every time and needs no market data feed.
function makeRandom(seed) {
    let state = seed;
    return () => {
        state = (state * 16807) % 2147483647;
        return (state - 1) / 2147483646;
    };
}

// Simulated five-minute bars with volume. Volume follows a U shape through the day (busy at the open and close,
// quiet at lunchtime) with random variation; price moves more when volume is high, and each day gets its own drift,
// so some days trend and some go sideways.
function simulateBars(seed) {
    const random = makeRandom(seed);
    const normal = () => Math.sqrt(-2 * Math.log(random() + 1e-12)) * Math.cos(2 * Math.PI * random());
    const round = (value) => Math.round(value * 100) / 100;
    const bars = [];
    let price = 100;
    for (let s = 0; s < SESSIONS; s++) {
        if (s > 0) price *= Math.exp(0.005 * normal()); // overnight gap
        const drift = (random() - 0.5) * 0.0009; // per bar, for this day
        for (let b = 0; b < BARS_PER_SESSION; b++) {
            const t = b / (BARS_PER_SESSION - 1);
            let shape = 0.4 + 3.2 * (t - 0.5) * (t - 0.5); // 1.2 at the open and close, 0.4 at midday
            if (b === 0) shape *= 1.8; // the opening auction
            if (b === BARS_PER_SESSION - 1) shape *= 1.6; // the closing auction
            const volume = Math.round((60000 * shape * Math.exp(0.35 * normal())) / 100) * 100;
            const minuteVolatility = 0.0005 * Math.sqrt(shape / 0.6);
            const open = price;
            let high = open;
            let low = open;
            for (let m = 0; m < BAR_MINUTES; m++) {
                price *= Math.exp(drift / BAR_MINUTES + minuteVolatility * normal());
                high = Math.max(high, price);
                low = Math.min(low, price);
            }
            bars.push({
                session: s,
                x: s * SLOT + b, // position on the x axis
                minutes: OPEN_MINUTES + b * BAR_MINUTES,
                open: round(open),
                high: round(high + 0.03 * random()),
                low: round(low - 0.03 * random()),
                close: round(price),
                volume
            });
        }
    }
    return bars;
}

// The controls, the two charts and the readout each need an element. This splits the page's div into a control bar,
// the price chart, the volume chart and a readout; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Anchor <select data-id="mode" style="font:inherit">` +
        `<option value="session" selected>Each session (resets at 09:30)</option>` +
        `<option value="anchored">Anchored to a bar</option></select></label>` +
        `<label>Anchor bar <input data-id="anchor" type="range" min="0" max="${SESSIONS * BARS_PER_SESSION - 1}" step="1" ` +
        `value="${BARS_PER_SESSION}" style="vertical-align:middle; width:140px" disabled> <output data-id="anchor"></output></label>` +
        `<label>Band multiplier <input data-id="bands" type="range" min="0" max="3" step="0.5" value="1" ` +
        `style="vertical-align:middle; width:90px"> <output data-id="bands"></output></label>` +
        `<label>Compare with <select data-id="compare" style="font:inherit">` +
        `<option value="none">Nothing</option>` +
        `<option value="equal" selected>Equal-weight average, same anchor</option>` +
        `<option value="sma20">20-bar simple moving average</option></select></label>` +
        `<button data-id="reseed" type="button" style="font:inherit">New simulated days</button>`;
    const priceDiv = document.createElement("div");
    priceDiv.id = divElementId + "-price"; // each chart's div needs its own id
    priceDiv.style.cssText = "flex:3; min-height:0;";
    const volumeDiv = document.createElement("div");
    volumeDiv.id = divElementId + "-volume";
    volumeDiv.style.cssText = "flex:1; min-height:0;";
    const readout = document.createElement("div");
    readout.setAttribute("aria-live", "polite");
    readout.style.cssText = "padding:6px 12px; color:#ffffff; font-size:13px;" + font;
    root.append(bar, priceDiv, volumeDiv, readout);
    const get = (selector) => bar.querySelector(selector);
    return {
        priceDiv,
        volumeDiv,
        readout,
        mode: get('select[data-id="mode"]'),
        anchor: get('input[data-id="anchor"]'),
        anchorOut: get('output[data-id="anchor"]'),
        bands: get('input[data-id="bands"]'),
        bandsOut: get('output[data-id="bands"]'),
        compare: get('select[data-id="compare"]'),
        reseed: get('button[data-id="reseed"]')
    };
}

async function vwapChart(divElementId) {
    const ui = createLayout(divElementId);
    let seed = 2024;
    let bars = simulateBars(seed);

    // #region_A_start
    // Candles and volume with a VWAP line, standard deviation bands and a draggable anchor, with SciChart.js
    const {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAxisAlignment,
        EAutoRange,
        EXyDirection,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        ELabelPlacement,
        OhlcDataSeries,
        FastCandlestickRenderableSeries,
        XyDataSeries,
        XyyDataSeries,
        FastLineRenderableSeries,
        FastBandRenderableSeries,
        FastColumnRenderableSeries,
        TextAnnotation,
        VerticalLineAnnotation,
        SciChartJsNavyTheme,
        LegendModifier,
        ELegendPlacement,
        ELegendOrientation,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- VWAP maths (plain JavaScript, no library needed) ---
    // typical price = (high + low + close) / 3
    // VWAP = sum(typical price * volume) / sum(volume), summed from the anchor bar
    // sigma = volume-weighted standard deviation of typical price around VWAP, over the same bars
    // resetEachSession: start the sums again at each day's first bar (session VWAP); otherwise start at bar `anchor`
    // (anchored VWAP) and leave earlier bars empty (NaN).
    function vwapWithBands(bars, anchor, resetEachSession) {
        const vwap = [];
        const sigma = [];
        const cumulativeVolume = [];
        const equalWeight = []; // the plain average of typical price over the same bars, for comparison
        let sumPV = 0;
        let sumP2V = 0;
        let sumV = 0;
        let sumP = 0;
        let count = 0;
        for (let i = 0; i < bars.length; i++) {
            const bar = bars[i];
            const startsHere = resetEachSession ? i === 0 || bar.session !== bars[i - 1].session : i === anchor;
            if (startsHere) {
                sumPV = sumP2V = sumV = sumP = count = 0;
            }
            if (!resetEachSession && i < anchor) {
                vwap.push(NaN);
                sigma.push(NaN);
                cumulativeVolume.push(NaN);
                equalWeight.push(NaN);
                continue;
            }
            const typical = (bar.high + bar.low + bar.close) / 3;
            sumPV += typical * bar.volume;
            sumP2V += typical * typical * bar.volume;
            sumV += bar.volume;
            sumP += typical;
            count += 1;
            const mean = sumPV / sumV;
            vwap.push(mean);
            sigma.push(Math.sqrt(Math.max(0, sumP2V / sumV - mean * mean)));
            cumulativeVolume.push(sumV);
            equalWeight.push(sumP / count);
        }
        return { vwap, sigma, cumulativeVolume, equalWeight };
    }

    // A simple moving average of the close over `length` bars, running across days
    function simpleMovingAverage(bars, length) {
        let sum = 0;
        return bars.map((bar, i) => {
            sum += bar.close;
            if (i >= length) sum -= bars[i - length].close;
            return i >= length - 1 ? sum / length : NaN;
        });
    }

    // --- The charts ---
    const theme = new SciChartJsNavyTheme();
    const COLOURS = { up: "#26A69A", down: "#EF5350", vwap: "#F6E05E", band: "#50C7E0", compare: "#C792EA", anchor: "#FFFFFF" };
    const pad = (n) => String(n).padStart(2, "0");
    const clock = (minutes) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
    const barAt = (x) => {
        const s = Math.floor(Math.round(x) / SLOT);
        const b = Math.round(x) - s * SLOT;
        return s >= 0 && s < SESSIONS && b >= 0 && b < BARS_PER_SESSION ? s * BARS_PER_SESSION + b : -1;
    };
    const barName = (i) => `Day ${bars[i].session + 1} ${clock(bars[i].minutes)}`;
    const timeLabel = (x) => {
        const i = barAt(x);
        return i < 0 ? "" : barName(i);
    };

    // 1. The price pane: candles, VWAP, its bands and the comparison line
    const price = await SciChartSurface.create(ui.priceDiv, { theme });
    const priceX = new NumericAxis(price.wasmContext, { drawLabels: false, drawMinorGridLines: false });
    const priceY = new NumericAxis(price.wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        autoRange: EAutoRange.Always, // fit the visible bars
        growBy: new NumberRange(0.08, 0.12),
        labelPrecision: 2,
        drawMinorGridLines: false
    });
    price.sciChartSurface.xAxes.add(priceX);
    price.sciChartSurface.yAxes.add(priceY);
    const ohlc = new OhlcDataSeries(price.wasmContext, { dataSeriesName: "Price" });
    const vwapData = new XyDataSeries(price.wasmContext, { dataSeriesName: "VWAP", containsNaN: true });
    const innerBand = new XyyDataSeries(price.wasmContext, { dataSeriesName: "Inner band (k σ)", containsNaN: true });
    const outerBand = new XyyDataSeries(price.wasmContext, { dataSeriesName: "Outer band (2k σ)", containsNaN: true });
    const compareData = new XyDataSeries(price.wasmContext, { dataSeriesName: "Comparison", containsNaN: true });
    const band = (dataSeries, fill, thickness, dash) =>
        new FastBandRenderableSeries(price.wasmContext, {
            dataSeries,
            fill,
            fillY1: fill,
            stroke: COLOURS.band,
            strokeY1: COLOURS.band,
            strokeThickness: thickness,
            strokeDashArray: dash,
            strokeY1DashArray: dash
        });
    const outerBandSeries = band(outerBand, "#50C7E00D", 1, [3, 4]);
    const innerBandSeries = band(innerBand, "#50C7E01F", 1.5, [6, 4]);
    const compareLine = new FastLineRenderableSeries(price.wasmContext, { dataSeries: compareData, stroke: COLOURS.compare, strokeThickness: 2 });
    price.sciChartSurface.renderableSeries.add(
        outerBandSeries,
        innerBandSeries,
        new FastCandlestickRenderableSeries(price.wasmContext, {
            dataSeries: ohlc,
            dataPointWidth: 0.7,
            brushUp: COLOURS.up,
            strokeUp: COLOURS.up,
            brushDown: COLOURS.down,
            strokeDown: COLOURS.down,
            strokeThickness: 1
        }),
        compareLine,
        new FastLineRenderableSeries(price.wasmContext, { dataSeries: vwapData, stroke: COLOURS.vwap, strokeThickness: 2.5 })
    );

    // 2. The volume pane: one column per bar, green when the bar closed up and red when it closed down
    const volume = await SciChartSurface.create(ui.volumeDiv, { theme });
    const volumeX = new NumericAxis(volume.wasmContext, { drawMinorGridLines: false });
    volumeX.labelProvider.formatLabel = timeLabel;
    volumeX.labelProvider.formatCursorLabel = timeLabel;
    volume.sciChartSurface.xAxes.add(volumeX);
    volume.sciChartSurface.yAxes.add(
        new NumericAxis(volume.wasmContext, {
            axisAlignment: EAxisAlignment.Right,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0, 0.1),
            axisTitle: "Volume",
            labelPrecision: 0,
            drawMinorGridLines: false
        })
    );
    volume.sciChartSurface.yAxes.get(0).labelProvider.formatLabel = (v) => (v >= 1000 ? `${Math.round(v / 1000)}K` : `${Math.round(v)}`);
    const upVolume = new XyDataSeries(volume.wasmContext, { dataSeriesName: "Volume (up bar)", containsNaN: true });
    const downVolume = new XyDataSeries(volume.wasmContext, { dataSeriesName: "Volume (down bar)", containsNaN: true });
    const columns = (dataSeries, colour) =>
        new FastColumnRenderableSeries(volume.wasmContext, { dataSeries, dataPointWidth: 0.7, fill: colour + "B3", stroke: colour, strokeThickness: 0 });
    volume.sciChartSurface.renderableSeries.add(columns(upVolume, COLOURS.up), columns(downVolume, COLOURS.down));

    // Day labels, and the anchor line: drag it along the chart to move the anchor
    const dayLabels = [];
    for (let s = 0; s < SESSIONS; s++) {
        dayLabels.push(
            new TextAnnotation({
                x1: s * SLOT,
                y1: 0, // relative y: 0 is the top of the chart
                yCoordinateMode: ECoordinateMode.Relative,
                text: `Day ${s + 1}`,
                fontSize: 13,
                textColor: "#C8D3E6",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                verticalAnchorPoint: EVerticalAnchorPoint.Top,
                yCoordShift: 44 // below the legend
            })
        );
    }
    price.sciChartSurface.annotations.add(...dayLabels);
    const anchorLine = new VerticalLineAnnotation({
        x1: bars[Number(ui.anchor.value)].x,
        stroke: COLOURS.anchor,
        strokeThickness: 2,
        strokeDashArray: [4, 3],
        isEditable: true,
        showLabel: true,
        labelPlacement: ELabelPlacement.TopRight,
        labelValue: "Anchor (drag me)",
        axisLabelFill: COLOURS.anchor,
        isHidden: true
    });
    price.sciChartSurface.annotations.add(anchorLine);

    // A short tooltip: the bar's time, its prices, and each visible line's value (a band shows lower to upper)
    function tooltipLines(seriesInfos) {
        const lines = seriesInfos.length ? [timeLabel(seriesInfos[0].xValue)] : [];
        for (const info of seriesInfos) {
            if (!info.renderableSeries.isVisible || !info.isWithinDataBounds || isNaN(info.yValue)) continue;
            if ("formattedCloseValue" in info) {
                lines.push(`O ${info.formattedOpenValue}  H ${info.formattedHighValue}  L ${info.formattedLowValue}  C ${info.formattedCloseValue}`);
            } else if ("formattedY1Value" in info) {
                lines.push(`${info.seriesName} ${info.formattedY1Value} to ${info.formattedYValue}`);
            } else {
                lines.push(`${info.seriesName} ${info.formattedYValue}`);
            }
        }
        return lines;
    }

    // Line up the panes, zoom and pan them together in time, and share one crosshair
    const group = new SciChartVerticalGroup();
    group.addSurfaceToGroup(price.sciChartSurface);
    group.addSurfaceToGroup(volume.sciChartSurface);
    for (const surface of [price.sciChartSurface, volume.sciChartSurface]) {
        surface.chartModifiers.add(
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
            new CursorModifier({
                showTooltip: surface === price.sciChartSurface,
                showAxisLabels: true,
                modifierGroup: "vwap",
                tooltipDataTemplate: tooltipLines
            })
        );
    }
    // The legend lists each series by name. Its items are made when it is added, so it is replaced when names change.
    let legend;
    function refreshLegend() {
        if (legend) price.sciChartSurface.chartModifiers.remove(legend, true);
        legend = new LegendModifier({ placement: ELegendPlacement.TopLeft, orientation: ELegendOrientation.Horizontal, showCheckboxes: false });
        price.sciChartSurface.chartModifiers.add(legend);
        // Hidden series (bands at 0, no comparison line) stay out of the legend
        price.sciChartSurface.renderableSeries.asArray().forEach((rs) => legend.includeSeries(rs, rs.isVisible));
    }
    let syncing = false;
    const link = (from, to) =>
        from.visibleRangeChanged.subscribe(() => {
            if (syncing) return;
            syncing = true;
            to.visibleRange = from.visibleRange;
            syncing = false;
        });
    link(priceX, volumeX);
    link(volumeX, priceX);

    // --- Fill the series from the maths, and the readout ---
    // Line data gets a NaN in each overnight gap, so a session VWAP stops at the close instead of joining the next day
    function lineData(dataSeries, values) {
        dataSeries.clear();
        bars.forEach((bar, i) => {
            if (i > 0 && bar.session !== bars[i - 1].session) dataSeries.append(bar.x - 1, NaN);
            dataSeries.append(bar.x, values[i]);
        });
    }
    // The same for a band: an upper (y) and a lower (y1) value per bar
    function bandData(dataSeries, upper, lower) {
        dataSeries.clear();
        bars.forEach((bar, i) => {
            if (i > 0 && bar.session !== bars[i - 1].session) dataSeries.append(bar.x - 1, NaN, NaN);
            dataSeries.append(bar.x, upper[i], lower[i]);
        });
    }

    function update() {
        const anchored = ui.mode.value === "anchored";
        const anchor = Number(ui.anchor.value);
        const k = Number(ui.bands.value);
        ui.anchor.disabled = !anchored;
        ui.anchorOut.textContent = barName(anchor);
        ui.bandsOut.textContent = k > 0 ? `±${k}σ and ±${2 * k}σ` : "off";
        anchorLine.isHidden = !anchored;
        anchorLine.x1 = bars[anchor].x;

        const { vwap, sigma, cumulativeVolume, equalWeight } = vwapWithBands(bars, anchor, !anchored);
        lineData(vwapData, vwap);
        bandData(innerBand, vwap.map((v, i) => v + k * sigma[i]), vwap.map((v, i) => v - k * sigma[i]));
        bandData(outerBand, vwap.map((v, i) => v + 2 * k * sigma[i]), vwap.map((v, i) => v - 2 * k * sigma[i]));
        innerBandSeries.isVisible = k > 0;
        outerBandSeries.isVisible = k > 0;
        const compare = ui.compare.value;
        compareLine.isVisible = compare !== "none";
        compareData.dataSeriesName = compare === "sma20" ? "20-bar SMA" : "Equal-weight average";
        innerBand.dataSeriesName = `VWAP ±${k}σ`;
        outerBand.dataSeriesName = `VWAP ±${2 * k}σ`;
        refreshLegend();
        lineData(compareData, compare === "sma20" ? simpleMovingAverage(bars, 20) : equalWeight);

        // The readout: where the last close sits against VWAP, in per cent and in standard deviations
        const last = bars.length - 1;
        const close = bars[last].close;
        const distance = close - vwap[last];
        const signed = (value, digits) => `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(digits)}`;
        ui.readout.innerHTML =
            `<strong>${barName(last)}</strong> · Close ${close.toFixed(2)} · VWAP ${vwap[last].toFixed(2)} · ` +
            `Close is ${signed((distance / vwap[last]) * 100, 2)}% and ${sigma[last] > 0 ? signed(distance / sigma[last], 1) : "0.0"}σ from VWAP · ` +
            `σ ${sigma[last].toFixed(2)} · Volume since the ${anchored ? "anchor" : "open"} ${cumulativeVolume[last].toLocaleString("en-US")}`;
    }

    // Candles and volume: rebuilt for new simulated days
    function loadBars() {
        ohlc.clear();
        upVolume.clear();
        downVolume.clear();
        for (const bar of bars) {
            ohlc.append(bar.x, bar.open, bar.high, bar.low, bar.close);
            const up = bar.close >= bar.open;
            upVolume.append(bar.x, up ? bar.volume : NaN);
            downVolume.append(bar.x, up ? NaN : bar.volume);
        }
        update();
    }

    // Dragging the anchor line snaps it to the nearest bar and moves the slider with it
    anchorLine.dragEnded.subscribe(() => {
        let x = Math.round(anchorLine.x1);
        let i = barAt(x);
        while (i < 0 && x < bars[bars.length - 1].x) i = barAt(++x); // dropped in a gap: use the next day's first bar
        if (i < 0) i = bars.length - 1;
        ui.anchor.value = String(i);
        update();
    });
    ui.mode.addEventListener("change", update);
    ui.anchor.addEventListener("input", update);
    ui.bands.addEventListener("input", update);
    ui.compare.addEventListener("change", update);
    ui.reseed.addEventListener("click", () => {
        seed += 1;
        bars = simulateBars(seed);
        loadBars();
    });
    loadBars();
    priceX.visibleRange = new NumberRange(-2, bars[bars.length - 1].x + 2);
    // #region_A_end
}

vwapChart("scichart-root");
