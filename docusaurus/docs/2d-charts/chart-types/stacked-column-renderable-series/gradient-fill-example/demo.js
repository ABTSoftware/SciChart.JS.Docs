import { SciChartSurface, NumericAxis, StackedColumnRenderableSeries, StackedColumnCollection, XyDataSeries, SciChartJsNavyTheme, NumberRange, EColumnDataLabelPosition, EVerticalTextPosition, Thickness, MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier, ENumericFormat, GradientParams, Point } from "scichart";
async function simpleStackedColumnChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    // Create XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 0,
        autoTicks: false,
        majorDelta: 1,
        minorDelta: 1,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorBands: false,
        axisTitle: "Year"
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        labelPrecision: 0,
        growBy: new NumberRange(0, 0.05),
        axisTitle: "Sales $USD (Billion)"
    }));
    // region_A_start
    // Data for the example
    const xValues = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003];
    const yValues1 = [10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11];
    const yValues2 = [12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10];
    const yValues3 = [7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22];
    const yValues4 = [16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17];
    const yValues5 = [7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16];
    const dataLabels = {
        color: "#FFfFFF",
        style: { fontSize: 12, fontFamily: "Arial", padding: new Thickness(0, 0, 4, 0) },
        precision: 0,
        positionMode: EColumnDataLabelPosition.Outside,
        verticalTextPosition: EVerticalTextPosition.Center
    };
    // Create some RenderableSeries - for each part of the stacked column
    // Notice the stackedGroupId. This defines if series are stacked (same), or grouped side by side (different)
    const rendSeries1 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues1, dataSeriesName: "EU" }),
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#882B91", offset: 0 },
            { color: "#EC0F6C", offset: 1 }
        ]),
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
    });
    const rendSeries2 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues2, dataSeriesName: "Asia" }),
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#EC0F6C", offset: 0 },
            { color: "#F48420", offset: 1 }
        ]),
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
    });
    const rendSeries3 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues3, dataSeriesName: "USA" }),
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#F48420", offset: 0 },
            { color: "#50C7E0", offset: 1 }
        ]),
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
    });
    const rendSeries4 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues4, dataSeriesName: "UK" }),
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#50C7E0", offset: 0 },
            { color: "#30BC9A", offset: 1 }
        ]),
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
    });
    const rendSeries5 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues5, dataSeriesName: "Latam" }),
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#30BC9A", offset: 0 },
            { color: "#0652DD", offset: 1 }
        ]),
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
    });
    // To add the series to the chart, put them in a StackedColumnCollection
    const stackedColumnCollection = new StackedColumnCollection(wasmContext);
    stackedColumnCollection.dataPointWidth = 0.6;
    stackedColumnCollection.add(rendSeries1, rendSeries2, rendSeries3, rendSeries4, rendSeries5);
    // Add the Stacked Column collection to the chart
    sciChartSurface.renderableSeries.add(stackedColumnCollection);
    // region_A_end
    // Optional: add zooming, panning for the example
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}
simpleStackedColumnChart("scichart-root");
