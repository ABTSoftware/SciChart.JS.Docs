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
    IFillPaletteProvider
} from "scichart";

async function triangleSeriesList(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    const colors = {
        0: "#f39c12",
        1: "#27ae60",
        2: "#2980b9",
        3: "#8e44ad"
    };

    class TrianglePaletteProvider implements IFillPaletteProvider {
        public readonly fillPaletteMode = EFillPaletteMode.SOLID;

        public onAttached(): void {}

        public onDetached(): void {}

        public overrideFillArgb(_xValue: number, _yValue: number, index: number, opacity: number): number {
            // return SciChart.parseColorToUIntArgb(Math.floor(index / 3) % 2 === 0 ? "cornflowerblue" : "lightgray");

            console.log(Math.floor(index / 3));

            const opacityRound = Math.round(opacity * 255);

            return parseColorToUIntArgb(colors[Math.floor(index / 3)], opacityRound);
        }
    }

    // region_A_start
    const sXValues = [200, 200, 300, 320, 420, 420, 220, 400, 310, 220, 400, 310];
    const sYValues = [200, 400, 300, 300, 400, 200, 400, 400, 310, 200, 200, 290];

    const polygonSeries = new TriangleRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: sXValues,
            yValues: sYValues
        }),
        isDigitalLine: false,
        opacity: 0.5,
        drawMode: ETriangleSeriesDrawMode.List, // Polygon / List / Strip
        paletteProvider: new TrianglePaletteProvider()
    });
    // region_A_end

    sciChartSurface.renderableSeries.add(polygonSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());
}

triangleSeriesList("scichart-root");
