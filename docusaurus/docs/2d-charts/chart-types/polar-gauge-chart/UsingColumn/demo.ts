import * as SciChart from "scichart";

async function drawGaugeChartColumn(divElementId) {
    // Demonstrates how to create a gauge chart using Column Series & PolarPointerAnnotation using SciChart.js
    const {
        SciChartPolarSurface,
        SciChartJsNavyTheme,
        NumberRange,
        Thickness,
        PolarNumericAxis,
        EPolarAxisMode,
        PolarColumnRenderableSeries,
        XyxyDataSeries,
        EColumnMode,
        GradientParams,
        Point
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        padding: Thickness.fromNumber(20),
    });
    
    const gaugeTotalAngle = Math.PI * 1.1;
    const gaugeRange = new NumberRange(0, 100); // the range of the gauge

    // Create axes
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: gaugeRange, 
        flippedCoordinates: true, // go clockwise
        totalAngle: gaugeTotalAngle,
        startAngle: (Math.PI - gaugeTotalAngle) / 2, // to center the bottom gap
        isVisible: false,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 10),
        isVisible: false,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // #region_A_start
    // (optional) add a gray column to show the potential full range of the gauge
    const grayColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            y1Values: [10], // outer radius
            yValues: [8], // inner radius
            x1Values: [gaugeRange.max], // start of visible range -> 0
            xValues: [gaugeRange.min], // end of visible range -> 100
        }),
        columnXMode: EColumnMode.StartEnd,
        fill: "#88888844",
        strokeThickness: 0,
    });
    sciChartSurface.renderableSeries.add(grayColumn);

    // add the value column:
    const columnSeries = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            y1Values: [10], // outer radius
            yValues: [8], // inner radius
            x1Values: [gaugeRange.min], // start of the gauge -> 0
            xValues: [50 + Math.random() * 40], // current value of gauge
        }),
        columnXMode: EColumnMode.StartEnd,
        stroke: "#FFFFFF",
        strokeThickness: 3,

        fillLinearGradient: new GradientParams(
            new Point(0, 0), 
            new Point(1, 0), 
            [
                { offset: 0, color: "#AA2200" },
                { offset: 1, color: "#FFDD00" },
            ]
        ),
    });
    sciChartSurface.renderableSeries.add(columnSeries);
    // #region_A_end
}

drawGaugeChartColumn("scichart-root");
