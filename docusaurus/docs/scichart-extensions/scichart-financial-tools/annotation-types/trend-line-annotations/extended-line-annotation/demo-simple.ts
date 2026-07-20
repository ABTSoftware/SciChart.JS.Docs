import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";

async function drawExample(divElementId) {
    // #region_A_start
    const {
        SciChartSurface,
        NumericAxis,
    } = SciChart; // or import from "scichart"
    const {
        ExtendedLineAnnotation,
        SciTraderLightTheme
    } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    sciChartSurface.annotations.add(
        new ExtendedLineAnnotation({
            // Two points define the trend. 
            points: [
                { x: 2, y: 2 },
                { x: 8, y: 8 }
            ],
            // The extension flags decide whether it is a finite segment, a ray or an infinite line.
            extendStart: false,
            extendEnd: true,
            stroke: "#38F",
            isEditable: true,
            isSelected: true,
        })
    );
    // #region_A_end

    sciChartSurface.chartModifiers.add(
        new SciChart.AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: SciChart.ECursorStyle.Crosshair,
        })
    )
}

drawExample("scichart-root");
