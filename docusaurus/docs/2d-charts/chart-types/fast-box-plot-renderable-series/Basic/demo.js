import { BoxPlotDataSeries, CategoryAxis, EAutoRange, EAxisAlignment, EDataPointWidthMode, ENumericFormat, FastBoxPlotRenderableSeries, NumberRange, NumericAxis, SciChartJsNavyTheme, SciChartSurface } from "scichart";
async function simpleBoxPlotChart(divElementId) {
    // #region_A_start
    // Demonstrates how to create a box plot chart with SciChart.js
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    const isVertical = true;
    const isXCategoryAxis = false;
    const configCategoryAxis = {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 0,
        cursorLabelFormat: ENumericFormat.Decimal,
        cursorLabelPrecision: 0
    };
    const configX = {
        axisAlignment: isVertical ? EAxisAlignment.Bottom : EAxisAlignment.Left,
        growBy: new NumberRange(0.05, 0.05),
        autoRange: EAutoRange.Once,
        flippedCoordinates: false
    };
    sciChartSurface.xAxes.add(isXCategoryAxis
        ? new CategoryAxis(wasmContext, { ...configX, ...configCategoryAxis })
        : new NumericAxis(wasmContext, configX));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisAlignment: isVertical ? EAxisAlignment.Left : EAxisAlignment.Bottom,
        growBy: new NumberRange(0.05, 0.05),
        autoRange: EAutoRange.Once,
        flippedCoordinates: !isVertical
    }));
    const xValues = [4, 5, 6];
    const minimumValues = [0, 1, 0.5];
    const maximumValues = [10, 9, 9.5];
    const medianValues = [4.5, 5.5, 5];
    const lowerQuartileValues = [3, 4, 3.5];
    const upperQuartileValues = [7, 6, 6.5];
    const boxPlotDataSeries = new BoxPlotDataSeries(wasmContext, {
        xValues,
        minimumValues,
        maximumValues,
        medianValues,
        lowerQuartileValues,
        upperQuartileValues
    });
    const boxSeries = new FastBoxPlotRenderableSeries(wasmContext, {
        dataSeries: boxPlotDataSeries,
        stroke: "black",
        strokeThickness: 1,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.5,
        fill: "green",
        opacity: 0.6,
        whiskers: {
            stroke: "green",
            strokeThickness: 2
        },
        cap: {
            stroke: "green",
            strokeThickness: 2,
            dataPointWidth: 0.3
        },
        medianLine: {
            stroke: "black",
            strokeThickness: 2
        }
    });
    sciChartSurface.renderableSeries.add(boxSeries);
    // #region_A_end
}
simpleBoxPlotChart("scichart-root");
