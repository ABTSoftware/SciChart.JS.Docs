import { buildSubCharts, EAutoRange, EAxisType, ECoordinateMode, ESeriesType, MouseWheelZoomModifier, NumericAxis, SciChartJsNavyTheme, SciChartSubSurface, SciChartSurface, ZoomPanModifier } from "scichart";
async function drawHtmlAnnotationsExample(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    const addSubSurface = () => {
        return SciChartSubSurface.createSubSurface(sciChartSurface, {});
    };
    const commonSubChartDefinitions = {};
    const [subSurface1, subSurface2] = buildSubCharts([
        {
            xAxes: {
                type: EAxisType.NumericAxis,
                options: { autoRange: EAutoRange.Once }
            },
            surface: {
                position: { x: 100, y: 100, width: 200, height: 200 },
                coordinateMode: ECoordinateMode.Pixel,
                isTransparent: true
            },
            series: [
                {
                    type: ESeriesType.SplineMountainSeries,
                    xyData: {
                        xValues: Array.from({ length: 20 }, (_, i) => i),
                        yValues: [12, 9, 10, 6, 7, 11, 13, 8, 9, 10, 14, 7, 5, 9, 8, 13, 6, 10, 11, 12]
                    },
                    options: {
                        stroke: "FireBrick",
                        fill: "Tomato",
                        strokeThickness: 5
                    }
                }
            ]
        },
        {
            surface: {
                position: { x: 150, y: 150, width: 200, height: 200 },
                coordinateMode: ECoordinateMode.Pixel,
                isTransparent: true
            },
            series: [
                {
                    type: ESeriesType.SplineMountainSeries,
                    xyData: {
                        xValues: Array.from({ length: 20 }, (_, i) => i),
                        yValues: [6, 8, 5, 9, 3, 10, 7, 6, 4, 12, 8, 9, 10, 5, 11, 7, 3, 8, 9, 6]
                    },
                    options: {
                        stroke: "Navy",
                        fill: "DodgerBlue",
                        strokeThickness: 5
                    }
                }
            ]
        }
    ], sciChartSurface);
    // region_A_start
    const firstSubSurface = sciChartSurface.subCharts[0];
    const firstSeries = firstSubSurface.renderableSeries.get(0);
    firstSeries.setSurfaceRenderOrder(3);
    // region_A_end
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
}
drawHtmlAnnotationsExample("scichart-root");
