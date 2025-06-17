import * as SciChart from "scichart";

async function verticallyStackedAxis(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        EAxisAlignment,
        FastLineRenderableSeries,
        XyDataSeries
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // #region_A_start
    // Create an XAxis on the bottom
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis",
            axisTitleStyle: { fontSize: 13 },
            backgroundColor: "#50C7E022",
            axisBorder: { color: "#50C7E0", borderTop: 1 }
        })
    );

    // Create several YAxis on the left
    // Creating a NumericAxis as a YAxis on the left
    const yAxis0 = new NumericAxis(wasmContext, {
        axisTitle: "Y Axis 0",
        axisAlignment: EAxisAlignment.Left
    });
    sciChartSurface.yAxes.add(yAxis0);
    const yAxis1 = new NumericAxis(wasmContext, {
        axisTitle: "Y Axis 1",
        axisAlignment: EAxisAlignment.Left
    });
    sciChartSurface.yAxes.add(yAxis1);
    const yAxis2 = new NumericAxis(wasmContext, {
        axisTitle: "Y Axis 2",
        axisAlignment: EAxisAlignment.Left
    });
    sciChartSurface.yAxes.add(yAxis2);
    const yAxis3 = new NumericAxis(wasmContext, {
        axisTitle: "Y Axis 3",
        axisAlignment: EAxisAlignment.Left
    });
    sciChartSurface.yAxes.add(yAxis3);
    const yAxis4 = new NumericAxis(wasmContext, {
        axisTitle: "Y Axis 4",
        axisAlignment: EAxisAlignment.Left
    });
    sciChartSurface.yAxes.add(yAxis4);
    const yAxis5 = new NumericAxis(wasmContext, {
        axisTitle: "Y Axis 5",
        axisAlignment: EAxisAlignment.Left
    });
    sciChartSurface.yAxes.add(yAxis5);
    const yAxis6 = new NumericAxis(wasmContext, {
        axisTitle: "Y Axis 6",
        axisAlignment: EAxisAlignment.Left
    });
    sciChartSurface.yAxes.add(yAxis6);
    const yAxis7 = new NumericAxis(wasmContext, {
        axisTitle: "Y Axis 7",
        axisAlignment: EAxisAlignment.Left
    });
    sciChartSurface.yAxes.add(yAxis7);

    // To make it clearer what's happening, colour the axis backgrounds & borders
    const axisColors = ["#50C7E0", "#EC0F6C", "#30BC9A", "#F48420", "#364BA0", "#882B91", "#67BDAF", "#C52E60"];
    sciChartSurface.yAxes.asArray().forEach((yAxis, index) => {
        yAxis.backgroundColor = axisColors[index] + "22";
        yAxis.axisBorder = { color: axisColors[index], borderRight: 1 };
        yAxis.axisTitleStyle.fontSize = 13;
    });

    // Let's add some series to the chart to show how they also behave with axis
    const getOptions = index => {
        const xValues = Array.from(Array(50).keys());
        const yValues = xValues.map(x => Math.sin(x * 0.4 + index));

        return {
            yAxisId: sciChartSurface.yAxes.asArray()[index].id,
            stroke: axisColors[index] + "77",
            strokeThickness: 2,
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
        };
    };

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(0) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(1) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(2) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(3) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(4) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(5) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(6) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(7) }));
    // #region_A_end
}

verticallyStackedAxis("scichart-root");

async function builderExample(divElementId) {
    const { chartBuilder, EThemeProviderType, EAxisType, EAxisAlignment } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region_B_start
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "X Axis",
                axisTitleStyle: { fontSize: 13 },
                backgroundColor: "#50C7E022",
                axisBorder: { color: "#50C7E0", borderTop: 1 }
            }
        },
        yAxes: [
            {
                type: EAxisType.NumericAxis,
                options: { axisTitle: "Y Axis 0", axisAlignment: EAxisAlignment.Left }
            },
            {
                type: EAxisType.NumericAxis,
                options: { axisTitle: "Y Axis 1", axisAlignment: EAxisAlignment.Left }
            },
            {
                type: EAxisType.NumericAxis,
                options: { axisTitle: "Y Axis 2", axisAlignment: EAxisAlignment.Left }
            },
            {
                type: EAxisType.NumericAxis,
                options: { axisTitle: "Y Axis 3", axisAlignment: EAxisAlignment.Left }
            },
            {
                type: EAxisType.NumericAxis,
                options: { axisTitle: "Y Axis 4", axisAlignment: EAxisAlignment.Left }
            },
            {
                type: EAxisType.NumericAxis,
                options: { axisTitle: "Y Axis 5", axisAlignment: EAxisAlignment.Left }
            },
            {
                type: EAxisType.NumericAxis,
                options: { axisTitle: "Y Axis 6", axisAlignment: EAxisAlignment.Left }
            },
            {
                type: EAxisType.NumericAxis,
                options: { axisTitle: "Y Axis 7", axisAlignment: EAxisAlignment.Left }
            }
        ]
    });

    const axisColors = ["#50C7E0", "#EC0F6C", "#30BC9A", "#F48420", "#364BA0", "#882B91", "#67BDAF", "#C52E60"];
    sciChartSurface.yAxes.asArray().forEach((yAxis, index) => {
        yAxis.backgroundColor = axisColors[index] + "22";
        yAxis.axisBorder = { color: axisColors[index], borderRight: 1 };
        yAxis.axisTitleStyle.fontSize = 13;
    });
    // #region_B_end
}
