import * as SciChart from "scichart";

// Example data: one year's income statement for a small company, in thousands of dollars.
// These are illustrative numbers, not real figures.
// "step" bars add to (or take from) the running total; "total" bars show the running total so far.
function getProfitData() {
    return [
        { label: "Products", kind: "step", value: 900 },
        { label: "Services", kind: "step", value: 600 },
        { label: "Revenue", kind: "total" },
        { label: "Materials", kind: "step", value: -620 },
        { label: "Salaries", kind: "step", value: -380 },
        { label: "Rent", kind: "step", value: -100 },
        { label: "Interest", kind: "step", value: 40 },
        { label: "Tax", kind: "step", value: -155 },
        { label: "Profit", kind: "total" }
    ];
}

async function waterfallChart(divElementId) {
    // #region_A_start
    // Create a JavaScript waterfall chart with SciChart.js: floating bars that step a running total up and down
    const {
        SciChartSurface,
        NumericAxis,
        FastRectangleRenderableSeries,
        XyxyDataSeries,
        EColumnMode,
        EColumnYMode,
        EDataPointWidthMode,
        EFillPaletteMode,
        TextLabelProvider,
        EAxisAlignment,
        LineAnnotation,
        TextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        NumberRange,
        parseColorToUIntArgb,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Colour carries meaning here: green for a rise, red for a fall, blue-grey for a total
    const RISE = "#26A69A";
    const FALL = "#EF5350";
    const TOTAL = "#94A3B8";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // 1. Work out the running total. Each bar spans from where the total was ("from") to where it ends up ("to").
    //    A total bar always starts at zero and shows the running total so far.
    let runningTotal = 0;
    const bars = getProfitData().map((item, index) => {
        if (item.kind === "total") {
            return { ...item, index, from: 0, to: runningTotal, change: runningTotal };
        }
        const from = runningTotal;
        runningTotal += item.value;
        return { ...item, index, from, to: runningTotal, change: item.value };
    });
    const xValues = bars.map((bar) => bar.index);

    // X axis: one label per bar, at x = 0, 1, 2, ...
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            // useNativeText: false draws the labels as textures, which keeps each one centred under its bar
            labelProvider: new TextLabelProvider({ labels: bars.map((bar) => bar.label), useNativeText: false }),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            growBy: new NumberRange(0.12, 0.12) // extra space on the left keeps the first bar clear of the chart's bottom corner
        })
    );

    // Y axis: the running total, always starting at zero
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            axisTitle: "Running total",
            labelPrefix: "$",
            labelPostfix: "k",
            labelPrecision: 0,
            visibleRangeLimit: new NumberRange(0, 1e9), // never cut the axis off above zero
            growBy: new NumberRange(0, 0.12)
        })
    );

    // Colour each bar by its kind and direction
    const barColours = {
        fillPaletteMode: EFillPaletteMode.SOLID,
        onAttached() {},
        onDetached() {},
        overrideFillArgb(xValue, yValue, index) {
            const bar = bars[index];
            if (bar.kind === "total") return parseColorToUIntArgb(TOTAL);
            return parseColorToUIntArgb(bar.change >= 0 ? RISE : FALL);
        }
    };

    // 2. The bars: a rectangle series where each bar has an explicit bottom (y) and top (y1)
    sciChartSurface.renderableSeries.add(
        new FastRectangleRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, {
                xValues,
                yValues: bars.map((bar) => Math.min(bar.from, bar.to)),
                x1Values: xValues,
                y1Values: bars.map((bar) => Math.max(bar.from, bar.to)),
                dataSeriesName: "Profit walk"
            }),
            columnXMode: EColumnMode.Mid, // centre each bar on its x value
            columnYMode: EColumnYMode.TopBottom, // y and y1 are the bar's bottom and top
            dataPointWidthMode: EDataPointWidthMode.Range,
            dataPointWidth: 0.7,
            strokeThickness: 0,
            paletteProvider: barColours
        })
    );

    // 3. Dashed connector lines carry the running total from the top of one bar to the start of the next
    for (let i = 0; i < bars.length - 1; i++) {
        sciChartSurface.annotations.add(
            new LineAnnotation({
                x1: i + 0.35,
                x2: i + 0.65,
                y1: bars[i].to,
                y2: bars[i].to,
                stroke: "#E4F5FC",
                strokeThickness: 1.5,
                strokeDashArray: [4, 3]
            })
        );
    }

    // 4. A value label above each bar: the change for a step, the running total for a total
    const formatValue = (value) => `$${Math.abs(value).toLocaleString("en-US")}k`;
    bars.forEach((bar) => {
        const text = bar.kind === "total" ? formatValue(bar.to) : `${bar.change >= 0 ? "+" : "−"}${formatValue(bar.change)}`;
        sciChartSurface.annotations.add(
            new TextAnnotation({
                x1: bar.index,
                y1: Math.max(bar.from, bar.to),
                text,
                fontSize: 16,
                textColor: bar.kind === "total" ? "#FFFFFF" : bar.change >= 0 ? RISE : FALL,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                yCoordShift: -4
            })
        );
    });

    // Zoom with the mouse wheel, pan by dragging, double-click to reset, and hover for each bar's values
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            tooltipDataTemplate: (seriesInfos) => {
                const info = seriesInfos.find((seriesInfo) => seriesInfo.isWithinDataBounds);
                if (!info) return [];
                const bar = bars[info.dataSeriesIndex];
                if (bar.kind === "total") return [bar.label, `Running total: ${formatValue(bar.to)}`];
                return [
                    bar.label,
                    `Change: ${bar.change >= 0 ? "+" : "−"}${formatValue(bar.change)}`,
                    `Running total: ${formatValue(bar.from)} → ${formatValue(bar.to)}`
                ];
            }
        }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

waterfallChart("scichart-root");
