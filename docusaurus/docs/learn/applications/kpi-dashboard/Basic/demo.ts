import * as SciChart from "scichart";

// A seeded random generator, so the dashboard looks the same every time it loads
function createRandom(seed) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const REGIONS = ["North", "South", "East", "West"];
const PRODUCTS = ["Hardware", "Software", "Services"];

// A year of simulated sales for a made-up company: orders, revenue ($ thousands) and gross profit
// for every region, product line and month, with last year's figures and this year's plan (the target).
// Illustrative numbers only. North grows fastest and South falls behind, so some KPIs miss their targets.
function getSalesData() {
    const random = createRandom(2026);
    const noise = (size) => (random() + random() + random() - 1.5) * size;
    const season = [0.84, 0.86, 1.0, 0.94, 0.97, 1.02, 0.9, 0.87, 1.03, 1.06, 1.13, 1.32];
    const ordersPerMonth = [230, 190, 160, 130]; // by region
    const productShare = [0.45, 0.35, 0.2];
    const pricePerOrder = [1.6, 0.9, 2.4]; // $k, by product
    const margin = [0.34, 0.8, 0.46]; // gross margin, by product
    const regionGrowth = [1.13, 0.93, 1.07, 1.02];
    const productGrowth = [0.97, 1.09, 1.01];
    const records = [];
    for (let region = 0; region < REGIONS.length; region++) {
        for (let product = 0; product < PRODUCTS.length; product++) {
            for (let month = 0; month < 12; month++) {
                const usual = ordersPerMonth[region] * productShare[product] * season[month];
                const lastPrice = pricePerOrder[product] * 0.97;
                const lyOrders = Math.round(usual * (1 + noise(0.1)));
                const lyRevenue = lyOrders * lastPrice * (1 + noise(0.04));
                const growth = 1 + (regionGrowth[region] * productGrowth[product] - 1) * (0.4 + month / 10);
                const orders = Math.round(usual * growth * (1 + noise(0.1)));
                const revenue = orders * pricePerOrder[product] * (1 + noise(0.04));
                const targetRevenue = usual * lastPrice * 1.08; // the plan: 8% more revenue than a usual year
                records.push({
                    region,
                    product,
                    month,
                    actual: { orders, revenue, gross: revenue * (margin[product] - 0.02 + noise(0.04)) },
                    lastYear: { orders: lyOrders, revenue: lyRevenue, gross: lyRevenue * (margin[product] - 0.02 + noise(0.04)) },
                    target: { orders: usual * 1.05, revenue: targetRevenue, gross: targetRevenue * margin[product] }
                });
            }
        }
    }
    return records;
}

// The controls, four KPI tiles and three chart panels. In your app these are just elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#1B2438; color:#FFFFFF;" +
        "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const select = (id, label, options, selected) =>
        `<label>${label} <select data-id="${id}" style="font:inherit">` +
        options.map(([value, text]) => `<option value="${value}"${value === selected ? " selected" : ""}>${text}</option>`).join("") +
        `</select></label>`;
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px; padding:6px 10px;";
    bar.innerHTML =
        select("period", "Period", [["month", "Month (Dec)"], ["quarter", "Quarter (Q4)"], ["year", "Year"]], "quarter") +
        select("compare", "Compare to", [["target", "Target"], ["lastYear", "Last year"]], "target") +
        select("region", "Region", [["all", "All regions"], ...REGIONS.map((name, i) => [String(i), name])], "all") +
        `<label><input data-id="highlight" type="checkbox" checked> Highlight off-target KPIs</label>`;

    // One tile per KPI: name, big number and change against the comparison, as HTML text laid over a single chart
    // that draws the four tile backgrounds and sparklines (one chart with four sub-charts)
    const tileRow = document.createElement("div");
    tileRow.style.cssText = "position:relative; height:128px; margin:0 6px 6px; flex:none;";
    const sparkRow = document.createElement("div");
    sparkRow.id = `${divElementId}-sparklines`;
    sparkRow.style.cssText = "position:absolute; inset:0;";
    tileRow.append(sparkRow);
    const tiles = [0, 1, 2, 3].map((i) => {
        const tile = document.createElement("div");
        tile.style.cssText = `position:absolute; top:0; bottom:0; left:calc(${25 * i}% + 3px); width:calc(25% - 6px); z-index:1; pointer-events:none;` +
            "box-sizing:border-box; border-left:4px solid transparent; padding:5px 8px; overflow:hidden;";
        tile.innerHTML =
            `<div data-id="name" style="font-size:13px; color:#B8C6DD; white-space:nowrap"></div>` +
            `<div data-id="value" style="font-size:24px; font-weight:600; line-height:1.2; font-variant-numeric:tabular-nums"></div>` +
            `<div style="font-size:13px; display:flex; gap:2px 8px; flex-wrap:wrap"><span data-id="change"></span><span data-id="status"></span></div>`;
        tileRow.append(tile);
        const get = (selector) => tile.querySelector(selector);
        return { tile, name: get('[data-id="name"]'), value: get('[data-id="value"]'), change: get('[data-id="change"]'), status: get('[data-id="status"]') };
    });

    const grid = document.createElement("div");
    grid.style.cssText = "flex:1; min-height:0; display:grid; gap:6px; padding:0 6px 6px;" +
        "grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; grid-template-areas:'trend trend' 'bullet bridge';";
    const cell = (area) => {
        const div = document.createElement("div");
        div.id = `${divElementId}-${area}`; // each chart needs its own element id
        div.style.cssText = `grid-area:${area}; min-width:0; min-height:0;`;
        grid.append(div);
        return div.id;
    };
    const cells = { trend: cell("trend"), bullet: cell("bullet"), bridge: cell("bridge") };
    root.append(bar, tileRow, grid);
    const get = (selector) => bar.querySelector(selector);
    return {
        tiles,
        sparkRow: sparkRow.id,
        cells,
        period: get('select[data-id="period"]'),
        compare: get('select[data-id="compare"]'),
        region: get('select[data-id="region"]'),
        highlight: get('input[data-id="highlight"]')
    };
}

async function kpiDashboard(divElementId) {
    const ui = createLayout(divElementId);
    const records = getSalesData();

    // #region_A_start
    // A sales KPI dashboard with SciChart.js: KPI tiles with sparklines, a revenue trend against target and last year,
    // a bullet chart of revenue by region and a waterfall of the variance, all driven by the same filters
    const {
        SciChartSurface,
        SciChartSubSurface,
        NumericAxis,
        NumberRange,
        Rect,
        Thickness,
        EAutoRange,
        EAxisAlignment,
        ETextAlignment,
        ECoordinateMode,
        EAnnotationLayer,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        EColumnMode,
        EColumnYMode,
        EDataPointWidthMode,
        EFillPaletteMode,
        EStrokePaletteMode,
        FastLineRenderableSeries,
        FastColumnRenderableSeries,
        FastRectangleRenderableSeries,
        XyDataSeries,
        XyxyDataSeries,
        TextLabelProvider,
        BoxAnnotation,
        TextAnnotation,
        HorizontalLineAnnotation,
        WaveAnimation,
        parseColorToUIntArgb,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        ELegendOrientation,
        ELegendPlacement,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Blue for on target and orange for off target: a pair that colour-blind readers can tell apart.
    // Every status also has a symbol and a word, so colour is never the only clue.
    const ON = "#50C7E0";
    const OFF = "#FF8A3D";
    const NEUTRAL = "#B8C6DD";
    const OFF_TARGET_BELOW = 0.98; // below 98% of the comparison counts as off target
    const PERIOD_MONTHS = { month: [11], quarter: [9, 10, 11], year: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] };
    const state = { period: "quarter", compare: "target", region: "all", highlight: true };

    // Add up orders, revenue and gross profit for the records that match a filter
    const totals = (keep) => {
        const sum = { actual: { orders: 0, revenue: 0, gross: 0 }, lastYear: { orders: 0, revenue: 0, gross: 0 }, target: { orders: 0, revenue: 0, gross: 0 } };
        for (const record of records) {
            if (!keep(record)) continue;
            for (const kind of ["actual", "lastYear", "target"]) {
                for (const measure of ["orders", "revenue", "gross"]) sum[kind][measure] += record[kind][measure];
            }
        }
        return sum;
    };
    const inRegion = (record) => state.region === "all" || record.region === Number(state.region);
    const inPeriod = (record) => PERIOD_MONTHS[state.period].includes(record.month);
    const money = (k) => (k >= 1000 ? `$${(k / 1000).toFixed(2)}M` : `$${Math.round(k)}k`);
    const axisMoney = (k) => {
        const size = Math.abs(k);
        const text = size >= 1000 ? `$${(size / 1000).toFixed(1)}M` : size < 0.5 ? "$0" : `$${Math.round(size)}k`;
        return k < -0.5 ? `−${text}` : text;
    };

    // The four KPIs. Each is worked out from the totals, so it can be compared with the same KPI for the target or last year.
    const KPIS = [
        { name: "Revenue", of: (s) => s.revenue, format: money },
        { name: "Gross margin", of: (s) => (100 * s.gross) / s.revenue, format: (v) => `${v.toFixed(1)}%`, isPercent: true },
        { name: "Orders", of: (s) => s.orders, format: (v) => Math.round(v).toLocaleString("en-US") },
        { name: "Average order value", of: (s) => (1000 * s.revenue) / s.orders, format: (v) => `$${Math.round(v).toLocaleString("en-US")}` }
    ];
    const surfaceOptions = (title) => ({
        theme: new SciChartJsNavyTheme(),
        title,
        titleStyle: { fontSize: 14, color: "#E8EDF5", alignment: ETextAlignment.Left, placeWithinChart: false }
    });
    const zoomAndCursor = (tooltipDataTemplate = undefined) => [
        new CursorModifier({ showTooltip: true, showAxisLabels: false, tooltipDataTemplate }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    ];

    // ---- KPI tiles: one chart with four sub-charts, each a tile with a sparkline of the last 12 months ----
    const tileChart = await SciChartSurface.create(ui.sparkRow, { theme: new SciChartJsNavyTheme() });
    tileChart.sciChartSurface.background = "#1B2438";
    const sparklines = [];
    for (const [i, kpi] of KPIS.entries()) {
        const tile = SciChartSubSurface.createSubSurface(tileChart.sciChartSurface, {
            position: new Rect(0.25 * i + 0.003, 0, 0.244, 1),
            padding: new Thickness(4, 6, 4, 8),
            isTransparent: false
        });
        tile.background = "#24324F";
        tile.xAxes.add(new NumericAxis(tileChart.wasmContext, { isVisible: false, visibleRange: new NumberRange(-0.5, 11.5) }));
        // growBy leaves the top two-thirds of the tile empty for the text
        tile.yAxes.add(new NumericAxis(tileChart.wasmContext, { isVisible: false, autoRange: EAutoRange.Always, growBy: new NumberRange(0.1, 2.1) }));
        const actual = new XyDataSeries(tileChart.wasmContext, { isSorted: true, containsNaN: false });
        const comparison = new XyDataSeries(tileChart.wasmContext, { isSorted: true, containsNaN: false });
        tile.renderableSeries.add(
            new FastLineRenderableSeries(tileChart.wasmContext, { dataSeries: comparison, stroke: "#8A9BB8", strokeThickness: 1, strokeDashArray: [3, 3] }),
            new FastLineRenderableSeries(tileChart.wasmContext, { dataSeries: actual, stroke: ON, strokeThickness: 2 })
        );
        // Shade the months in the selected period, behind the sparkline
        const periodBox = new BoxAnnotation({ x1: -0.5, x2: 11.5, yCoordinateMode: ECoordinateMode.Relative, y1: 0.64, y2: 1, fill: "#FFFFFF1A", strokeThickness: 0, annotationLayer: EAnnotationLayer.BelowChart });
        tile.annotations.add(periodBox);
        ui.tiles[i].name.textContent = kpi.name;
        sparklines.push({ actual, comparison, periodBox });
    }

    // ---- Revenue trend: monthly columns, with the target and last year as lines ----
    const trend = await SciChartSurface.create(ui.cells.trend, surfaceOptions(""));
    const monthAxis = new NumericAxis(trend.wasmContext, {
        visibleRange: new NumberRange(-0.6, 11.6),
        autoTicks: false,
        majorDelta: 1,
        drawMajorGridLines: false,
        drawMinorGridLines: false
    });
    monthAxis.labelProvider.formatLabel = (x) => MONTHS[Math.round(x)] ?? "";
    monthAxis.labelProvider.formatCursorLabel = (x) => MONTHS[Math.round(x)] ?? "";
    trend.sciChartSurface.xAxes.add(monthAxis);
    const revenueAxis = new NumericAxis(trend.wasmContext, { autoRange: EAutoRange.Always, growBy: new NumberRange(0, 0.12) });
    revenueAxis.labelProvider.formatLabel = axisMoney;
    trend.sciChartSurface.yAxes.add(revenueAxis);
    const monthly = { actual: [], target: [], lastYear: [] };
    const revenueSeries = new XyDataSeries(trend.wasmContext, { dataSeriesName: "Revenue", isSorted: true, containsNaN: false });
    const targetSeries = new XyDataSeries(trend.wasmContext, { dataSeriesName: "Target", isSorted: true, containsNaN: false });
    const lastYearSeries = new XyDataSeries(trend.wasmContext, { dataSeriesName: "Last year", isSorted: true, containsNaN: false });
    // A palette provider colours each month's column: orange when it is off target and highlighting is on
    const isOffMonth = (index) => state.highlight && monthly.actual[index] < OFF_TARGET_BELOW * monthly[state.compare][index];
    const offColumns = {
        fillPaletteMode: EFillPaletteMode.SOLID,
        strokePaletteMode: EStrokePaletteMode.SOLID,
        onAttached() {},
        onDetached() {},
        overrideFillArgb: (x, y, index) => (isOffMonth(index) ? parseColorToUIntArgb(OFF + "CC") : undefined),
        overrideStrokeArgb: (x, y, index) => (isOffMonth(index) ? parseColorToUIntArgb(OFF) : undefined)
    };
    trend.sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(trend.wasmContext, {
            dataSeries: revenueSeries,
            fill: "#50C7E0CC",
            stroke: "#50C7E0",
            dataPointWidth: 0.6,
            cornerRadius: 8,
            paletteProvider: offColumns,
            animation: new WaveAnimation({ duration: 1000 })
        }),
        new FastLineRenderableSeries(trend.wasmContext, { dataSeries: targetSeries, stroke: "#F6E05E", strokeThickness: 2, strokeDashArray: [6, 4] }),
        new FastLineRenderableSeries(trend.wasmContext, { dataSeries: lastYearSeries, stroke: "#A7B3C9", strokeThickness: 2 })
    );
    const trendPeriodBox = new BoxAnnotation({ x1: -0.5, x2: 11.5, yCoordinateMode: ECoordinateMode.Relative, y1: 0, y2: 1, fill: "#FFFFFF12", strokeThickness: 0, annotationLayer: EAnnotationLayer.BelowChart });
    trend.sciChartSurface.annotations.add(trendPeriodBox);
    trend.sciChartSurface.chartModifiers.add(
        ...zoomAndCursor(),
        new LegendModifier({ showCheckboxes: false, orientation: ELegendOrientation.Horizontal, placement: ELegendPlacement.TopLeft })
    );

    // ---- Bullet chart: the period's revenue by region, against the comparison ----
    // A vertical chart: the x-axis runs down the left (one row per region) and the value axis along the bottom
    const bullet = await SciChartSurface.create(ui.cells.bullet, surfaceOptions(""));
    bullet.sciChartSurface.xAxes.add(
        new NumericAxis(bullet.wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            labelProvider: new TextLabelProvider({ labels: REGIONS, useNativeText: false }),
            autoTicks: false,
            majorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            visibleRange: new NumberRange(-0.6, REGIONS.length - 0.4)
        })
    );
    const bulletScale = new NumericAxis(bullet.wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        flippedCoordinates: true, // on a vertical chart this makes the bars grow from left to right
        maxAutoTicks: 5,
        drawMajorGridLines: false,
        drawMinorGridLines: false
    });
    bulletScale.labelProvider.formatLabel = axisMoney;
    bullet.sciChartSurface.yAxes.add(bulletScale);
    let bulletRows = [];
    // One rectangle per row, spanning rowIndex ± halfHeight across the row and from `from` to `to` along the scale
    const bulletLayer = (halfHeight, fill, paletteProvider = undefined) => {
        const dataSeries = new XyxyDataSeries(bullet.wasmContext, { containsNaN: false });
        bullet.sciChartSurface.renderableSeries.add(
            new FastRectangleRenderableSeries(bullet.wasmContext, {
                dataSeries,
                columnXMode: EColumnMode.StartEnd,
                columnYMode: EColumnYMode.TopBottom,
                fill,
                stroke: fill,
                strokeThickness: 0,
                paletteProvider
            })
        );
        return (from, to) => {
            dataSeries.clear();
            dataSeries.appendRange(
                bulletRows.map((_, i) => i - halfHeight),
                bulletRows.map(from),
                bulletRows.map((_, i) => i + halfHeight),
                bulletRows.map(to)
            );
        };
    };
    // Qualitative bands, relative to each region's comparison: below 90%, 90-100%, and above
    const setPoorBand = bulletLayer(0.38, "#7D8799");
    const setFairBand = bulletLayer(0.38, "#A9B1BF");
    const setGoodBand = bulletLayer(0.38, "#D5DAE2");
    // The actual bar: dark, orange when off target, and faded for regions outside the filter
    const barColour = (index) => {
        const row = bulletRows[index];
        const colour = state.highlight && row.ratio < OFF_TARGET_BELOW ? OFF : "#0B1A33";
        const isFaded = state.region !== "all" && index !== Number(state.region);
        return parseColorToUIntArgb(colour + (isFaded ? "55" : "FF"));
    };
    const setActualBar = bulletLayer(0.13, "#0B1A33", {
        fillPaletteMode: EFillPaletteMode.SOLID,
        strokePaletteMode: EStrokePaletteMode.SOLID,
        onAttached() {},
        onDetached() {},
        overrideFillArgb: (x, y, index) => barColour(index),
        overrideStrokeArgb: (x, y, index) => barColour(index)
    });
    const setMarker = bulletLayer(0.28, "#0B1A33");
    let bulletLabels = [];
    bullet.sciChartSurface.chartModifiers.add(
        ...zoomAndCursor((seriesInfos) => {
            const info = seriesInfos.find((s) => s.isWithinDataBounds);
            if (!info) return [];
            const row = bulletRows[info.dataSeriesIndex];
            return [row.name, `Actual: ${money(row.actual)}`, `${compareName()}: ${money(row.comparison)}`, `${Math.round(100 * row.ratio)}% of ${compareName().toLowerCase()}`];
        })
    );

    // ---- Waterfall: how each region (or product line) adds to the gap between actual and comparison ----
    const bridge = await SciChartSurface.create(ui.cells.bridge, surfaceOptions(""));
    let bridgeBars = [];
    const bridgeAxis = new NumericAxis(bridge.wasmContext, { autoTicks: false, majorDelta: 1, drawMajorGridLines: false, drawMinorGridLines: false, drawMajorBands: false });
    bridgeAxis.labelProvider.formatLabel = (x) => bridgeBars[Math.round(x)]?.label ?? "";
    bridge.sciChartSurface.xAxes.add(bridgeAxis);
    const gapAxis = new NumericAxis(bridge.wasmContext, { autoRange: EAutoRange.Always, growBy: new NumberRange(0.2, 0.2), maxAutoTicks: 5 });
    gapAxis.labelProvider.formatLabel = axisMoney;
    bridge.sciChartSurface.yAxes.add(gapAxis);
    const bridgeSeries = new XyxyDataSeries(bridge.wasmContext, { containsNaN: false });
    const bridgeColour = (index) => {
        const bar = bridgeBars[index];
        if (!bar) return undefined;
        return parseColorToUIntArgb(bar.isTotal ? "#94A3B8" : bar.change >= 0 ? ON : OFF);
    };
    // Colour each bar by direction: blue where revenue is ahead, orange where it is behind, grey for the total
    const bridgeColours = {
        fillPaletteMode: EFillPaletteMode.SOLID,
        onAttached() {},
        onDetached() {},
        overrideFillArgb: (x, y, index) => bridgeColour(index)
    };
    bridge.sciChartSurface.renderableSeries.add(
        new FastRectangleRenderableSeries(bridge.wasmContext, {
            dataSeries: bridgeSeries,
            columnXMode: EColumnMode.Mid,
            columnYMode: EColumnYMode.TopBottom,
            dataPointWidthMode: EDataPointWidthMode.Range,
            dataPointWidth: 0.6,
            strokeThickness: 0,
            paletteProvider: bridgeColours
        })
    );
    bridge.sciChartSurface.annotations.add(new HorizontalLineAnnotation({ y1: 0, stroke: "#E4F5FC", strokeThickness: 1 }));
    let bridgeLabels = [];
    bridge.sciChartSurface.chartModifiers.add(
        ...zoomAndCursor((seriesInfos) => {
            const info = seriesInfos.find((s) => s.isWithinDataBounds);
            const bar = info && bridgeBars[info.dataSeriesIndex];
            return bar ? [bar.label, `${bar.isTotal ? "Total gap" : "Contribution"}: ${signedMoney(bar.change)}`] : [];
        })
    );
    const signedMoney = (k) => `${k >= 0 ? "+" : "−"}${money(Math.abs(k))}`;
    const compareName = () => (state.compare === "target" ? "Target" : "Last year");

    // ---- Redraw everything from the current filters ----
    function update() {
        const months = PERIOD_MONTHS[state.period];
        const periodRange = { x1: months[0] - 0.5, x2: months[months.length - 1] + 0.5 };

        // KPI tiles
        const period = totals((r) => inRegion(r) && inPeriod(r));
        KPIS.forEach((kpi, i) => {
            const tile = ui.tiles[i];
            const actual = kpi.of(period.actual);
            const comparison = kpi.of(period[state.compare]);
            const ratio = actual / comparison;
            const isOff = ratio < OFF_TARGET_BELOW;
            const change = kpi.isPercent ? `${(actual - comparison).toFixed(1)} pts` : `${(100 * (ratio - 1)).toFixed(1)}%`;
            tile.value.textContent = kpi.format(actual);
            tile.change.textContent = `${ratio >= 1 ? "▲ +" : "▼ "}${change.replace("-", "−")} vs ${compareName().toLowerCase()}`;
            tile.status.textContent = isOff ? "Off target" : "";
            tile.change.style.color = !state.highlight ? NEUTRAL : isOff ? OFF : ratio >= 1 ? ON : NEUTRAL;
            tile.status.style.cssText = state.highlight && isOff ? `color:#1B2438; background:${OFF}; border-radius:3px; padding:0 4px; font-weight:600` : "display:none";
            tile.tile.style.borderLeftColor = state.highlight && isOff ? OFF : "transparent";

            const spark = sparklines[i];
            const byMonth = MONTHS.map((_, m) => totals((r) => inRegion(r) && r.month === m));
            spark.actual.clear();
            spark.actual.appendRange(MONTHS.map((_, m) => m), byMonth.map((s) => kpi.of(s.actual)));
            spark.comparison.clear();
            spark.comparison.appendRange(MONTHS.map((_, m) => m), byMonth.map((s) => kpi.of(s[state.compare])));
            Object.assign(spark.periodBox, periodRange);
        });

        // Revenue trend
        const byMonth = MONTHS.map((_, m) => totals((r) => inRegion(r) && r.month === m));
        for (const kind of ["actual", "target", "lastYear"]) monthly[kind] = byMonth.map((s) => s[kind].revenue);
        const x = MONTHS.map((_, m) => m);
        revenueSeries.clear();
        revenueSeries.appendRange(x, monthly.actual);
        targetSeries.clear();
        targetSeries.appendRange(x, monthly.target);
        lastYearSeries.clear();
        lastYearSeries.appendRange(x, monthly.lastYear);
        Object.assign(trendPeriodBox, periodRange);
        const regionName = state.region === "all" ? "all regions" : REGIONS[Number(state.region)];
        trend.sciChartSurface.title = `Monthly revenue, ${regionName} (shaded: selected period)`;

        // Bullet chart
        bulletRows = REGIONS.map((name, region) => {
            const s = totals((r) => r.region === region && inPeriod(r));
            return { name, actual: s.actual.revenue, comparison: s[state.compare].revenue, ratio: s.actual.revenue / s[state.compare].revenue };
        });
        const scaleEnd = 1.3 * Math.max(...bulletRows.map((row) => Math.max(row.actual, row.comparison)));
        bulletScale.visibleRange = new NumberRange(0, scaleEnd);
        setPoorBand(() => 0, (row) => 0.9 * row.comparison);
        setFairBand((row) => 0.9 * row.comparison, (row) => row.comparison);
        setGoodBand((row) => row.comparison, () => scaleEnd);
        setActualBar(() => 0, (row) => row.actual);
        const markerHalfWidth = scaleEnd / 300;
        setMarker((row) => row.comparison - markerHalfWidth, (row) => row.comparison + markerHalfWidth);
        bulletLabels.forEach((label) => bullet.sciChartSurface.annotations.remove(label, true));
        bulletLabels = bulletRows.map((row, i) =>
            new TextAnnotation({
                x1: i,
                y1: 0.985 * scaleEnd,
                text: `${Math.round(100 * row.ratio)}%`,
                fontSize: 14,
                textColor: "#0B1A33",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
                verticalAnchorPoint: EVerticalAnchorPoint.Center
            })
        );
        bullet.sciChartSurface.annotations.add(...bulletLabels);
        bullet.sciChartSurface.title = `Revenue by region vs ${compareName().toLowerCase()} (marker), this period`;

        // Waterfall of the variance: one step per region, or per product line when one region is selected
        const byRegion = state.region === "all";
        const parts = byRegion ? REGIONS : PRODUCTS;
        let running = 0;
        bridgeBars = parts.map((label, i) => {
            const s = totals((r) => inRegion(r) && inPeriod(r) && (byRegion ? r.region === i : r.product === i));
            const change = s.actual.revenue - s[state.compare].revenue;
            const bar = { label, change, from: running, to: running + change };
            running += change;
            return bar;
        });
        bridgeBars.push({ label: "Total", change: running, from: 0, to: running, isTotal: true });
        bridgeSeries.clear();
        bridgeSeries.appendRange(
            bridgeBars.map((_, i) => i),
            bridgeBars.map((bar) => Math.min(bar.from, bar.to)),
            bridgeBars.map((_, i) => i),
            bridgeBars.map((bar) => Math.max(bar.from, bar.to))
        );
        bridgeAxis.visibleRange = new NumberRange(-0.6, bridgeBars.length - 0.4);
        bridgeAxis.labelProvider.invalidateCache(); // the labels change between regions and product lines
        bridgeLabels.forEach((label) => bridge.sciChartSurface.annotations.remove(label, true));
        bridgeLabels = bridgeBars.map((bar, i) =>
            new TextAnnotation({
                x1: i,
                y1: bar.change >= 0 ? Math.max(bar.from, bar.to) : Math.min(bar.from, bar.to),
                text: signedMoney(bar.change),
                fontSize: 14,
                textColor: "#FFFFFF",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: bar.change >= 0 ? EVerticalAnchorPoint.Bottom : EVerticalAnchorPoint.Top
            })
        );
        bridge.sciChartSurface.annotations.add(...bridgeLabels);
        bridge.sciChartSurface.title = `Revenue gap vs ${compareName().toLowerCase()}, by ${byRegion ? "region" : "product line"}`;

        // Palette providers are read when the chart draws, so ask the charts to redraw
        [tileChart, trend, bullet, bridge].forEach((chart) => chart.sciChartSurface.invalidateElement());
    }

    // ---- Controls ----
    for (const name of ["period", "compare", "region"]) {
        ui[name].addEventListener("change", () => {
            state[name] = ui[name].value;
            update();
        });
    }
    ui.highlight.addEventListener("change", () => {
        state.highlight = ui.highlight.checked;
        update();
    });
    update();
    // #region_A_end
}

kpiDashboard("scichart-root");
