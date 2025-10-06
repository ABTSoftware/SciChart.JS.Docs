import {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    NumberRange,
    SciChartJsNavyTheme,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    SeriesSelectionModifier
} from "scichart";

async function hitTestExample(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    const xLineValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yLineValues = [0, 0.5, 1.3, 2.4, 3, 2.5, 2.2, 1.9, 1.2];


    // region_A_start
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 3,
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: xLineValues,
            yValues: yLineValues,
            dataSeriesName: "Line Series"
        }),
        onHoveredChanged: (sourceSeries, isHovered) => {
            console.log(`Series ${sourceSeries.dataSeries.dataSeriesName} hovered: ${isHovered}`);
            // Change appearance on hover
            sourceSeries.strokeThickness = isHovered ? 6 : 3;
        }
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    sciChartSurface.chartModifiers.add(
        new SeriesSelectionModifier({
            enableHover: true,
            enableSelection: false // Set to false if you only want hover, not selection
        })
    );
    // region_A_end

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
}

hitTestExample("scichart-root");
