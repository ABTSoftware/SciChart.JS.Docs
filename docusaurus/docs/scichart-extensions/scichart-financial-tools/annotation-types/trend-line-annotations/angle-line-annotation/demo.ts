import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    const { SciChartSurface, NumericAxis, NumberRange, AnnotationHoverModifier, ECursorStyle } = SciChart;
    const { AngleLineAnnotation, SciTraderLightTheme } = SciChartFinancialTools;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 20) }));

    // #region_A_start
    sciChartSurface.annotations.add(
        new AngleLineAnnotation({
            isEditable: true,
            points: [
                { x: 3, y: 6 },
                { x: 8, y: 12 }
            ],
            angleGuideLength: 60,
            stroke: "#F97316",
            strokeThickness: 3,
            guideStrokeThickness: 1,
            guideDashArray: [3, 2],
            // formatAngleLabel: ({ angleLabel }) => angleLabel
        }),
        new AngleLineAnnotation({
            isEditable: true,
            points: [
                { x: 11, y: 14 },
                { x: 16, y: 9 }
            ],
            stroke: "#22C55E",
            strokeThickness: 3,
            strokeDashArray: [12, 2],
            formatAngleLabel: ({ angle }) => `${Math.round(angle)}°`,
            guideDashArray: [10, 0], // no dash -> solid line
            guideStrokeThickness: 1,
            labelFontSize: 13,
            labelPadding: 20, // default is 10
            angleGuideLength: 100,
            // labelColor: "#FFF", // optional
        })
    );
    // #region_A_end

    sciChartSurface.chartModifiers.add(
        new AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair
        })
    );
}

drawExample("scichart-root");
