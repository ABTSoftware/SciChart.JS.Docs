import * as SciChart from "scichart";
import { LineSeriesDataLabelProvider } from "scichart";

// SciChart.SciChartSurface.loadWasmFromCDN();

export async function dataLabelsMetadataFromGetText(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        NumberRange,
        SciChartJsNavyTheme,
        EDataLabelSkipMode
    } = SciChart;

    // or for npm: import { SciChartSurface, ... } from "scichart"

    // Create a SciChartSurface with X,Y Axis
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.2, 0.2) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.2) }));

    const metadata = [
        { text: "Bananas", isSelected: false },
        { text: "Apples", isSelected: false },
        { text: "Pears", isSelected: false },
        { text: "Pineapples", isSelected: false },
        { text: "Plums", isSelected: false },
        { text: "Cherries", isSelected: false },
        { text: "Strawberries", isSelected: false },
        { text: "Blueberries", isSelected: false },
        { text: "Lemons", isSelected: false },
        { text: "Limes", isSelected: false },
        { text: "Papaya", isSelected: false },
        { text: "Guava", isSelected: false }
    ];

    // Create a chart with line series with a point-marker
    // optional metadata is also passed with javascript objecst into the dataSeries
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                strokeThickness: 2,
                stroke: "SteelBlue",
                fill: "LightSteelBlue"
            }),
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8],
                metadata
            }),
            // Next, add the dataLabels. Simply setting dataLabel style makes labels visible
            dataLabels: {
                style: {
                    fontFamily: "Default",
                    fontSize: 13
                },
                skipMode: EDataLabelSkipMode.ShowAll,
                color: "#EEE"
            }
        })
    );

    // #region_A_start
    // Assuming metadata has been constructed in the dataseries and dataLabels enabled,
    // you can format labels with metadata using dataLabelProvider.getText(dataLabelState)
    (sciChartSurface.renderableSeries.get(0).dataLabelProvider as LineSeriesDataLabelProvider).getText =
        dataLabelState => {
            return `index=${dataLabelState.index}, 
        x,y=[${dataLabelState.xVal()}, ${dataLabelState.yVal()}], 
        metadata="${(dataLabelState.getMetaData() as any)?.text}"`;
        };
    // #region_A_end

    return { sciChartSurface };
}

dataLabelsMetadataFromGetText("scichart-root");
