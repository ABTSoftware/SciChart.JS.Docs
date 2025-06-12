import * as SciChart from "scichart";

async function drawPolarPointerAnnotation(divElementId) {
    // #region_A_start
    // Demonstrates how to use PolarPointerAnnotation in SciChart.js
    const {
        SciChartPolarSurface,
        SciChartJsNavyTheme,
        PolarNumericAxis,
        EPolarAxisMode,
        PolarPointerAnnotation,
        ECoordinateMode,
        EStrokeLineJoin
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    
    // Create axes
    sciChartSurface.xAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            flippedCoordinates: true, // go clockwise
            totalAngle: Math.PI, // 180 degrees
            startAngle: 0,
        })
    );

    sciChartSurface.yAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
        })
    );

    const pointerExample = new PolarPointerAnnotation({
        x1: Math.random() * 10, // pointer angle
        y1: 10, // pointer length
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        isStrokeAboveCenter: true, // whether the pointer stick is above the center circle or not

        pointerStyle: {
            baseSize: 0.01, // slightly wider base than the pointer
            fill: "#F00",
            stroke: "#F00",
            backExtensionSize: 0.2
        },

        // optional - arrowhead at the tip of the pointer
        pointerArrowStyle: { 
            stroke: "#F00",
            strokeWidth: 2,
            fill: "#900",
            height: 0.2,
            width: 0.1,
            headDepth: 0.8
        },
        
        // optional - circle at the base of the pointer
        pointerCenterStyle: { 
            size: 0.12, // relative to the pointer height
            fill: "#111",
        },

        strokeLineJoin: EStrokeLineJoin.Round,
    });
    sciChartSurface.annotations.add(pointerExample);
    // #region_A_end
}

drawPolarPointerAnnotation("scichart-root");