import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
async function drawExample(divElementId) {
    const { NumberRange, NumericAxis, SciChartSurface } = SciChart; // or import from "scichart"
    const { EFibonacciLabelColorMode, EFibonacciLabelPlacement, FibonacciRetracementAnnotation, SciTraderLightTheme } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region_A_start
    const retracement = new FibonacciRetracementAnnotation({
        // Default verticalOnly mode uses 2 points.
        // This starts at a swing high and ends at a swing low, so the levels move downward.
        points: [
            { x: 3.5, y: 3.5 },
            { x: 7, y: 7 }
        ],
        verticalOnly: true, // default is true, but if false, it is skewed and thus needs 3 points to define.
        strokeThickness: 2,
        strokeDashArray: [8, 4], // optional
        connectorLineStrokeDashArray: [], // this by default is dashed
        connectorLineStroke: "#888",
        extendStart: false,
        extendEnd: true,
        thresholds: [0, 0.236, 0.382, 0.5, 0.618, 1, 1.618],
        regionColors: [
            "#38F",
            "#f93416" // This array would ideally have as many colors as (thresholds - 1)
            // But, missing intermediate colors are interpolated.
        ],
        fillOpacity: 0.2,
        fibonacciLabelPlacement: EFibonacciLabelPlacement.Top,
        fibonacciLabelColorMode: EFibonacciLabelColorMode.MultiColor,
        fibonacciLabelFontSize: 12,
        fibonacciLabelLinePadding: 1,
        // formatFibonacciLabel: ({ thresholdLabel, valueLabel }) => `${thresholdLabel} (${valueLabel})`, // optional formatting
        isEditable: true
    });
    sciChartSurface.annotations.add(retracement);
    // #region_A_end
    sciChartSurface.chartModifiers.add(new SciChart.AnnotationHoverModifier({
        enableHover: true,
        enableCursor: true,
        idleCursor: SciChart.ECursorStyle.Crosshair
    }));
    document.querySelector("#extend-start").addEventListener("change", event => {
        retracement.extendStart = event.target.checked;
        document.querySelector("#extend-start-label").textContent = `extendStart:\u00A0${retracement.extendStart}`;
    });
    document.querySelector("#extend-end").addEventListener("change", event => {
        retracement.extendEnd = event.target.checked;
        document.querySelector("#extend-end-label").textContent = `extendEnd:\u00A0${retracement.extendEnd}`;
    });
}
drawExample("scichart-root");
