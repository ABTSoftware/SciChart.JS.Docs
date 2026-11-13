import * as SciChart from "scichart";

async function bubbleSizing(divElementId) {
    // #region_A_start
    // Area or diameter? The same four values (1, 2, 4 and 8) sized two ways
    const {
        SciChartSurface,
        NumericAxis,
        TextLabelProvider,
        NumberRange,
        XyzDataSeries,
        FastBubbleRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const values = [1, 2, 4, 8];
    const smallest = 16; // diameter in pixels of the bubble for the value 1

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Value shown by the bubble",
            labelProvider: new TextLabelProvider({ labels: { 0: "1", 1: "2", 2: "4", 3: "8" } }),
            autoTicks: false,
            majorDelta: 1,
            drawMinorGridLines: false,
            growBy: new NumberRange(0.2, 0.2)
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            labelProvider: new TextLabelProvider({ labels: { 0: "By diameter", 1: "By area" } }),
            autoTicks: false,
            majorDelta: 1,
            drawMinorGridLines: false,
            growBy: new NumberRange(0.6, 0.6)
        })
    );

    const rows = [
        {
            name: "Sized by area (honest)",
            y: 1,
            colour: "#50C7E0",
            // Area proportional to the value: the diameter grows with the square root
            diameter: (value) => smallest * Math.sqrt(value)
        },
        {
            name: "Sized by diameter (exaggerates)",
            y: 0,
            colour: "#F48420",
            // Diameter proportional to the value: the area grows with the square
            diameter: (value) => smallest * value
        }
    ];

    for (const row of rows) {
        sciChartSurface.renderableSeries.add(
            new FastBubbleRenderableSeries(wasmContext, {
                dataSeries: new XyzDataSeries(wasmContext, {
                    xValues: values.map((value, i) => i),
                    yValues: values.map(() => row.y),
                    zValues: values.map((value) => row.diameter(value)),
                    dataSeriesName: row.name
                }),
                stroke: row.colour, // the colour shown in the legend
                pointMarker: new EllipsePointMarker(wasmContext, {
                    width: 64,
                    height: 64,
                    strokeThickness: 0,
                    fill: row.colour + "CC"
                })
            })
        );
    }

    // Show what each row means, and zoom with the mouse wheel, pan by dragging, double-click to reset
    sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

bubbleSizing("scichart-root");
