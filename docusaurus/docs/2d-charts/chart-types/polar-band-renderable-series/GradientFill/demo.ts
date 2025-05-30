import {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarBandRenderableSeries,
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        NumberRange,
        XyyDataSeries,
        Thickness,
        SciChartJsNavyTheme,
        GradientParams,
        Point
    } from "scichart";

export async function gradientFillBandChart(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        padding: Thickness.fromNumber(20),
        theme: new SciChartJsNavyTheme(),
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        useNativeText: true,
        drawMajorGridLines: true,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        autoTicks: false,
        majorDelta: 1,
        polarLabelMode: EPolarLabelMode.Parallel
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 8),
        useNativeText: true,
        autoTicks: false,
        majorDelta: 1,
        drawMajorGridLines: true,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        labelPrecision: 0,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // #region_A_start
    const gradientBand = new PolarBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5],
            yValues: [7, 4, 1, 5, 6, 7],
            y1Values: [2, 5, 7, 3, 8, 2]
        }),
        stroke: "white",
        strokeY1: "white",
        strokeThickness: 2,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#FF9999", offset: 0 },
            { color: "#FF2222", offset: 1 }
        ]),
        // This one is for gradient where Y1 values are greater than Y2 values
        fillLinearGradientY1: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#2222FF", offset: 0 },
            { color: "#9999FF", offset: 1 }
        ]),
        interpolateLine: true,
        scaleGradientToYRange: false // set to true to have global gradient depending on Y axis range
    });
    sciChartSurface.renderableSeries.add(gradientBand);
    // #region_A_end

    return { sciChartSurface, wasmContext };
}

gradientFillBandChart("scichart-root");
