import * as SciChart from "scichart";

async function horizontallyStackedAxis(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        EAxisAlignment,
        FastLineRenderableSeries,
        XyDataSeries,
        BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy,
        NumberRange
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Create an YAxis on the Left
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Y Axis",
            axisTitleStyle: { fontSize: 13 },
            backgroundColor: "#50C7E022",
            axisBorder: { color: "#50C7E0", borderRight: 1 },
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.1, 0.1)
        })
    );

    // Create several XAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis 0" }));
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis 1" }));
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis 2" }));
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis 3" }));

    // #region_A_start
    // Enable stacking of axis
    sciChartSurface.layoutManager.bottomOuterAxesLayoutStrategy =
        new BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy();
    // #region_A_end

    // To make it clearer what's happening, colour the axis backgrounds & borders
    const axisColors = ["#50C7E0", "#EC0F6C", "#30BC9A", "#F48420"];
    sciChartSurface.xAxes.asArray().forEach((xAxis, index) => {
        xAxis.backgroundColor = axisColors[index] + "22";
        xAxis.axisBorder = { color: axisColors[index], borderRight: 1 };
        xAxis.axisTitleStyle.fontSize = 13;
    });

    // Let's add some series to the chart to show how they also behave with axis
    const getOptions = index => {
        const xValues = Array.from(Array(50).keys());
        const yValues = xValues.map(x => Math.sin(x * 0.4 + index));

        return {
            xAxisId: sciChartSurface.xAxes.asArray()[index].id,
            stroke: axisColors[index],
            strokeThickness: 2,
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
        };
    };

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(0) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(1) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(2) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(3) }));
}

horizontallyStackedAxis("scichart-root");
