import * as SciChart from "scichart";
const { DefaultPaletteProvider, EFillPaletteMode, parseColorToUIntArgb, RectangleSeriesDataLabelProvider, EDataLabelSkipMode, EHorizontalTextPosition, EVerticalTextPosition, EMultiLineAlignment, ENumericFormat, formatNumber, } = SciChart;
// Monthly profit/loss data (in dollars)
const monthlyData = [
    { month: "Jan", profit: 387264 },
    { month: "Feb", profit: 772096 },
    { month: "Mar", profit: 638075 },
    { month: "Apr", profit: -211386 },
    { month: "May", profit: -138135 },
    { month: "Jun", profit: -267238 },
    { month: "Jul", profit: 431406 },
    { month: "Aug", profit: 363018 },
    { month: "Sep", profit: -224638 },
    { month: "Oct", profit: -299867 },
    { month: "Nov", profit: 607365 },
    { month: "Dec", profit: 1106986 },
];
// Transform monthly data into waterfall (cumulative) format.
// Each entry gets a 'from' (accumulated before) and 'to' (accumulated after) value.
// A final 'Total' bar is appended starting at 0 to show the overall result.
function toWaterfallData(data) {
    let accumulated = 0;
    const result = data.map((d) => {
        const from = accumulated;
        accumulated += d.profit;
        return { month: d.month, profit: d.profit, from, to: accumulated };
    });
    result.push({ month: "Total", profit: 0, from: 0, to: accumulated });
    return result;
}
// PaletteProvider colors each bar: green for gains, red for losses, blue for the Total
class WaterfallPaletteProvider extends DefaultPaletteProvider {
    constructor() {
        super();
        this.fillPaletteMode = EFillPaletteMode.SOLID;
    }
    overrideFillArgb(_x, _y, _index, _opacity, metadata) {
        const profit = metadata?.profit;
        if (profit === 0)
            return parseColorToUIntArgb("#2196F3", 200); // Total bar
        return profit > 0
            ? parseColorToUIntArgb("#4CAF50", 220) // Positive: green
            : parseColorToUIntArgb("#F44336", 220); // Negative: red
    }
}
// DataLabelProvider renders the cumulative total and the period change inside each bar
class WaterfallDataLabelProvider extends RectangleSeriesDataLabelProvider {
    getText(metadataSelector) {
        const d = metadataSelector.getMetaData();
        const total = `${formatNumber(d.to, ENumericFormat.Engineering, 2)}$`;
        if (d.profit === 0)
            return total;
        const delta = `${d.profit > 0 ? "+" : ""}${formatNumber(d.profit, ENumericFormat.Engineering, 2)}$`;
        return `${total}\n${delta}`;
    }
}
async function waterfallChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a Waterfall Chart using SciChart.js
    const { SciChartSurface, NumericAxis, FastRectangleRenderableSeries, XyxyDataSeries, EColumnMode, EColumnYMode, EDataPointWidthMode, ELabelAlignment, TextLabelProvider, NumberRange, Thickness, SciChartJsNavyTheme, } = SciChart;
    // or, for npm: import { SciChartSurface, ... } from "scichart"
    const waterfallData = toWaterfallData(monthlyData);
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    // X axis uses a TextLabelProvider so month names appear on the x axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        labelProvider: new TextLabelProvider({
            labels: waterfallData.map((d) => d.month),
        }),
        labelStyle: {
            alignment: ELabelAlignment.Center,
            padding: new Thickness(2, 1, 2, 1),
            fontSize: 11,
        },
        maxAutoTicks: waterfallData.length,
        growBy: new NumberRange(0.05, 0.05),
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        labelFormat: ENumericFormat.Engineering,
    }));
    // XyxyDataSeries stores x, y (bar bottom/from), x1 (same as x), y1 (bar top/to)
    const dataSeries = new XyxyDataSeries(wasmContext, {
        xValues: waterfallData.map((_, i) => i),
        yValues: waterfallData.map((d) => d.from),
        x1Values: waterfallData.map((_, i) => i),
        y1Values: waterfallData.map((d) => d.to),
        metadata: waterfallData,
    });
    const waterfallSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries,
        columnXMode: EColumnMode.Mid,
        columnYMode: EColumnYMode.TopBottom,
        dataPointWidthMode: EDataPointWidthMode.Range,
        strokeThickness: 0,
        paletteProvider: new WaterfallPaletteProvider(),
        dataLabelProvider: new WaterfallDataLabelProvider({
            skipMode: EDataLabelSkipMode.ShowAll,
            color: "white",
            style: {
                fontSize: 10,
                multiLineAlignment: EMultiLineAlignment.Center,
                lineSpacing: 4,
            },
            horizontalTextPosition: EHorizontalTextPosition.Center,
            verticalTextPosition: EVerticalTextPosition.Center,
        }),
    });
    sciChartSurface.renderableSeries.add(waterfallSeries);
    // #region_A_end
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
}
waterfallChart("scichart-root");
