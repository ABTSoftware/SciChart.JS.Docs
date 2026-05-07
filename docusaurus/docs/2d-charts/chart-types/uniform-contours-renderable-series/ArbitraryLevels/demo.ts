import * as SciChart from "scichart";

function createSeries(heatmapWidth: number, heatmapHeight: number, colorPaletteMin: number, colorPaletteMax: number) {
    const { zeroArray2D } = SciChart;
    const zValues = zeroArray2D([heatmapHeight, heatmapWidth]);

    for (let i = 0; i < heatmapWidth; i++) {
        const x = i - heatmapWidth / 2;
        for (let j = 0; j < heatmapHeight; j++) {
            const y = j - heatmapHeight / 2;
            const zValue = x * x + y * y;
            zValues[j][i] = zValue;
        }
    }

    return zValues;
}

const drawArbitraryLevels = async (divElementId: string) => {
    const {
        SciChartSurface,
        NumericAxis,
        HeatmapColorMap,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        UniformContoursRenderableSeries,
        NumberRange,
        ZoomPanModifier,
        ZoomExtentsModifier,
        MouseWheelZoomModifier,
        CursorModifier
    } = SciChart;

    // #region_A_start
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-100, 100) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-100, 100) }));

    const heatmapWidth = 200;
    const heatmapHeight = 200;
    const colorPaletteMin = 0; // sets Z value for 0 gradient stop
    const colorPaletteMax = 10000; // sets Z value for 1 gradient stop

    // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
    const initialZValues: number[][] = createSeries(heatmapWidth, heatmapHeight, colorPaletteMin, colorPaletteMax);
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1,
        zValues: initialZValues
    });

    // Create a Contours RenderableSeries with the same data
    const contourSeries = new UniformContoursRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        zLevels: [1000, 4000],
        strokeThickness: 2,
        stroke: "white",
        dataLabels: {
            style: {
                fontSize: 10
            },
            color: "white",
            labelRowCount: 5,
            precision: 0
        }
    });

    // Add the contours to the chart
    sciChartSurface.renderableSeries.add(contourSeries);

    const gradientStops = [
        { offset: 0, color: "#00008B" },
        { offset: 0.2, color: "#6495ED" },
        { offset: 0.4, color: "#006400" },
        { offset: 0.6, color: "#7FFF00" },
        { offset: 0.8, color: "#FFFF00" },
        { offset: 1.0, color: "#FF0000" }
    ];

    // Create a background heatmap series with the same data and add to the chart
    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        //useLinearTextureFiltering: true,
        opacity: 0.8,
        colorMap: new HeatmapColorMap({
            minimum: colorPaletteMin,
            maximum: colorPaletteMax,
            gradientStops
        })
    });

    // Add heatmap to the chart
    sciChartSurface.renderableSeries.add(heatmapSeries);
    // #region_A_end

    sciChartSurface.zoomExtents();
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, includedSeriesIds: [contourSeries.id] })
    );
    return { sciChartSurface, wasmContext };
};

drawArbitraryLevels("scichart-root");

