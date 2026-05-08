import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

function createPriceData(count) {
    const dateValues = [];
    const openValues = [];
    const highValues = [];
    const lowValues = [];
    const closeValues = [];
    const movingAverageValues = [];

    const startDate = Date.UTC(2025, 0, 1) / 1000;
    let close = 102;

    for (let i = 0; i < count; i++) {
        const open = close;
        const drift = Math.sin(i * 0.14) * 1.4 + Math.cos(i * 0.035) * 0.8;
        close = open + drift + Math.sin(i * 0.53) * 0.55;
        const high = Math.max(open, close) + 1.2 + Math.abs(Math.sin(i * 0.2)) * 1.6;
        const low = Math.min(open, close) - 1.2 - Math.abs(Math.cos(i * 0.18)) * 1.3;
        const averageStart = Math.max(0, i - 13);
        const averageSlice = closeValues.slice(averageStart).concat(close);
        const movingAverage = averageSlice.reduce((sum, value) => sum + value, 0) / averageSlice.length;

        dateValues.push(startDate + i * 86400);
        openValues.push(open);
        highValues.push(high);
        lowValues.push(low);
        closeValues.push(close);
        movingAverageValues.push(movingAverage);
    }

    return { dateValues, openValues, highValues, lowValues, closeValues, movingAverageValues };
}

async function drawExample(divElementId) {
    // #region_A_start
    const {
        CategoryAxis,
        FastCandlestickRenderableSeries,
        FastLineRenderableSeries,
        MouseWheelZoomModifier,
        NumberRange,
        NumericAxis,
        OhlcDataSeries,
        SciChartJsNavyTheme,
        SciChartSurface,
        XyDataSeries,
        ZoomExtentsModifier,
        ZoomPanModifier
    } = SciChart; // or import from "scichart"
    const { ELastYMode, SeriesValueModifier } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new CategoryAxis(wasmContext, { visibleRange: new NumberRange(64, 136) }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            labelPrefix: "$",
            labelPrecision: 2,
            growBy: new NumberRange(0.1, 0.12)
        })
    );

    const { dateValues, openValues, highValues, lowValues, closeValues, movingAverageValues } = createPriceData(180);

    const ohlcDataSeries = new OhlcDataSeries(wasmContext, {
        dataSeriesName: "OHLC",
        xValues: dateValues,
        openValues,
        highValues,
        lowValues,
        closeValues
    });
    const movingAverageDataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "14 period average",
        xValues: dateValues,
        yValues: movingAverageValues
    });

    sciChartSurface.renderableSeries.add(
        new FastCandlestickRenderableSeries(wasmContext, {
            dataSeries: ohlcDataSeries,
            dataPointWidth: 0.7,
            brushUp: "#22C55E88",
            brushDown: "#EF444488",
            strokeUp: "#86EFAC",
            strokeDown: "#FCA5A5",
            strokeThickness: 1
        }),
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: movingAverageDataSeries,
            stroke: "#38BDF8",
            strokeThickness: 3
        })
    );

    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new SeriesValueModifier({
            lastYMode: ELastYMode.LastVisible,
            annotationTextColor: "#FFFFFF"
        })
    );
    // #region_A_end
}

drawExample("scichart-root");
