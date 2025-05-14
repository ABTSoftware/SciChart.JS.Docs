import CodePenEmbed from "@site/src/components/CodePenEmbed";
import React from "react";

const js = `
async function PolarColumnChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a basic polar column chart using SciChart.js
    const { 
        SciChartPolarSurface, 
        PolarNumericAxis, 
        PolarColumnRenderableSeries,
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        NumberRange,
        XyDataSeries, 
        Thickness,
        GradientParams,
        Point
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        padding: Thickness.fromNumber(30),
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 9),
        useNativeText: true,
        drawMajorGridLines: true,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        autoTicks: false,
        majorDelta: 1,
        startAngle: Math.PI / 2,
        labelPrecision: 0,
        flippedCoordinates: true, // go clockwise
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 6),
        drawLabels: false, // don't draw labels
        autoTicks: false,
        majorDelta: 1,
        drawMajorGridLines: true,
        drawMajorTickLines: false,
        drawMajorTickLines: false,
        innerRadius: 0.1,
        majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            yValues: [2.6, 5.3, 3.5, 2.7, 4.8, 3.8, 5, 4.5, 3.5]
        }),
        stroke: "white",
        fill: "#8800AA66",
        strokeThickness: 2,
        dataPointWidth: 0.8,
        dataLabels: { // optionally - add data labels
            color: "white",
            style: {
                fontSize: 14,
                fontFamily: "Default",
            },
            polarLabelMode: EPolarLabelMode.Parallel,
        },
    });
    sciChartSurface.renderableSeries.add(polarColumn);
    
    return { sciChartSurface, wasmContext };
}
PolarColumnChart("scichart-root");
`;

export default function LiveExample() {
  return <CodePenEmbed js={js} />;
}
