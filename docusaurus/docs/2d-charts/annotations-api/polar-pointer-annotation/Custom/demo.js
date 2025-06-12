import * as SciChart from "scichart";
async function drawGaugeChartArc(divElementId) {
    // Demonstrates how to customise the PolarPointerAnnotation in SciChart.js
    const { SciChartPolarSurface, SciChartJsNavyTheme, PolarNumericAxis, EPolarAxisMode, PolarPointerAnnotation, EStrokeLineJoin, ECoordinateMode } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"
    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    // Create axes
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        flippedCoordinates: true, // go clockwise
        totalAngle: Math.PI * 3 / 2,
        startAngle: -Math.PI / 4,
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        startAngle: -Math.PI / 4,
        innerRadius: 0.2,
    });
    sciChartSurface.yAxes.add(radialYAxis);
    // #region_A_start
    // Define a pointer annotation
    const customPointer = new PolarPointerAnnotation({
        x1: Math.random() * 6 + 2,
        y1: 10, // pointer length
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        pointerStyle: {
            baseSize: 0.05, // relative to the pointer length
            fill: "#195",
            stroke: "#195",
        },
        // optional - arrowhead at the tip of the pointer
        pointerArrowStyle: {
            stroke: "#195",
            fill: "#132",
            height: 0.2,
            width: 0.1,
            headDepth: 0.8,
        },
        // optional - circle at the base of the pointer
        pointerCenterStyle: {
            size: 0.05, // relative to the pointer length
            fill: "#132",
            stroke: "#195",
        },
        strokeLineJoin: EStrokeLineJoin.Round,
    });
    // You can override: 
    // 1. the Stick (pointer) path
    customPointer.getPointerStickSvg = (pointerLength, pointerWidth, backExtensionSize) => {
        const size = pointerLength * 2;
        const halfStrokeWidth = Math.max(customPointer.pointerStyle.strokeWidth ?? 1.5, 0);
        return `<path stroke-linejoin=${customPointer.strokeLineJoin}
            d="
                M${size - halfStrokeWidth} ${pointerLength}
                L${pointerLength - pointerLength * backExtensionSize} ${pointerLength - pointerWidth / 2}
                l0 ${pointerWidth}
                L${size - halfStrokeWidth} ${pointerLength}Z
            " 
            fill="${customPointer.pointerStyle.fill}"
            stroke="${customPointer.pointerStyle.stroke}"  
            stroke-width="${customPointer.pointerStyle.strokeWidth}"
        />`;
    };
    // 2. Center path
    customPointer.getPointerCenterSvg = (pointerLength, centerSize) => {
        return `<rect
            x="${pointerLength - centerSize / 2}" 
            y="${pointerLength - centerSize / 2}"
            width=${centerSize} 
            height=${centerSize}
            rx=${centerSize / 2}
            ry=${centerSize / 2}
            stroke=${customPointer.pointerCenterStyle.stroke}
            stroke-width=${customPointer.pointerCenterStyle.strokeWidth}
            fill=${customPointer.pointerCenterStyle.fill}
        />`;
    };
    // 3. The arrowhead path
    customPointer.getPointerArrowSvg = (pointerLength, height, width, headDepth) => {
        const size = 2 * pointerLength;
        const halfStrokeWidth = Math.max(customPointer.pointerArrowStyle.strokeWidth ?? 1.5, 0);
        return `<path 
            stroke="${customPointer.pointerArrowStyle.stroke}"
            stroke-width="${customPointer.pointerArrowStyle.strokeWidth}"
            fill="${customPointer.pointerArrowStyle.fill}"
            stroke-linejoin=${customPointer.strokeLineJoin}
            d="
                M${size - height / 2 - halfStrokeWidth} ${pointerLength - width / 2}
                l${height / 2} ${width / 2}
                l-${height / 2} ${width / 2}
                ${headDepth === 0
            ? ""
            : `l${((1 - headDepth) * height) / 2} ${-width / 2}Z`}
            " 
        />`;
    };
    // The above methods are the default implementations, but you can override them if you want to
    // #region_A_end
    sciChartSurface.annotations.add(customPointer);
}
drawGaugeChartArc("scichart-root");
