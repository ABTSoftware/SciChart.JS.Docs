import {
    NumberRange,
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    TriangleRenderableSeries,
    XyDataSeries,
    ETriangleSeriesDrawMode,
    ZoomPanModifier,
    ZoomExtentsModifier,
    EFillPaletteMode,
    parseColorToUIntArgb,
    XyxyDataSeries,
    applyOpacityToHtmlColor,
    GradientParams,
    Point
} from "scichart";

async function basicTriangleSeriesChart(divElementId) {


    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    const polygonSeries = new TriangleRenderableSeries(wasmContext, {
        isDigitalLine: false,
        fill: "pink",
        drawMode: ETriangleSeriesDrawMode.Polygon,
        polygonVertices: 6, // Sets the number of vertices per polygon. Applies only for drawMode ETriangleSeriesDrawMode.Polygon
        // opacity: 0.5, // not working
 
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#f39c12", offset: 0 },
            { color: "#8e44ad", offset: 1 }
        ])
    });

    const dataSeries = new XyxyDataSeries(wasmContext);

    dataSeries.append(200, 200, 0.5, 0.5);
    dataSeries.append(100, 100, 0, 1);
    dataSeries.append(100, 300, 0, 0);
    dataSeries.append(300, 300, 1, 0);
    dataSeries.append(300, 100, 1, 1);
    dataSeries.append(100, 100, 0, 1);

    // Treat center as bottom and all other points as top to give radial gradient
    dataSeries.append(200, 500, 0, 0);
    dataSeries.append(100, 400, 1, 1);
    dataSeries.append(100, 600, 1, 1);
    dataSeries.append(300, 600, 1, 1);
    dataSeries.append(300, 400, 1, 1);
    dataSeries.append(100, 400, 1, 1);

    dataSeries.append(500, 300, 0, 0.7);
    dataSeries.append(600, 500, 0.3, 0.2);
    dataSeries.append(700, 550, 0.5, 0);
    dataSeries.append(800, 500, 0.7, 0.2);
    dataSeries.append(900, 300, 1, 0.7);
    dataSeries.append(700, 200, 0.5, 1);

    polygonSeries.dataSeries = dataSeries;

    sciChartSurface.renderableSeries.add(polygonSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());
}

basicTriangleSeriesChart("scichart-root");
