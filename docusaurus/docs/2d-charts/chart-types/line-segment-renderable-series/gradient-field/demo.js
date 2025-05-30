import { NumberRange, SciChartSurface, NumericAxis, SciChartJsNavyTheme, CentralAxesLayoutManager, EAutoRange, LineSegmentRenderableSeries, EStrokePaletteMode, parseColorToUIntArgb, EPaletteProviderType, XyDataSeries, ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier } from "scichart";
class LineSegmentPaletteProvider {
    strokePaletteMode = EStrokePaletteMode.GRADIENT;
    palettedStart = parseColorToUIntArgb("red");
    palettedEnd = parseColorToUIntArgb("blue");
    // tslint:disable-next-line:no-empty
    onAttached(parentSeries) { }
    // tslint:disable-next-line:no-empty
    onDetached() { }
    overrideStrokeArgb(xValue, yValue, index) {
        return index % 2 === 0 ? this.palettedStart : this.palettedEnd;
    }
    toJSON() {
        return { type: EPaletteProviderType.Custom, customType: "MyPaletteProvider" };
    }
}
async function basicRectangleSeriesChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    // configure central axes
    const layoutManager = new CentralAxesLayoutManager();
    sciChartSurface.layoutManager = layoutManager;
    const xMin = -15;
    const xMax = 15;
    const yMin = -10;
    const yMax = 10;
    const xAxis = new NumericAxis(wasmContext, {
        axisBorder: { color: "white", borderBottom: 1 },
        visibleRange: new NumberRange(xMin, xMax),
        autoRange: EAutoRange.Never,
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        zoomExtentsToInitialRange: true
    });
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, {
        axisBorder: { color: "white", borderRight: 1 },
        visibleRange: new NumberRange(yMin, yMax),
        autoRange: EAutoRange.Never,
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        zoomExtentsToInitialRange: true
    });
    sciChartSurface.yAxes.add(yAxis);
    // For LineSegmentRenderableSeries with palette provider having SOLID palette mode the first color is used
    // However for LineRendereableSeries with the same palette provider and SOLID palette the second color is used
    const lineSegmentSeries = new LineSegmentRenderableSeries(wasmContext, {
        strokeThickness: 4,
        paletteProvider: new LineSegmentPaletteProvider()
    });
    lineSegmentSeries.rolloverModifierProps.tooltipColor = "brown";
    sciChartSurface.renderableSeries.add(lineSegmentSeries);
    const multiplier = 0.01;
    const dataSeries = new XyDataSeries(wasmContext);
    for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
            // start point
            dataSeries.append(x, y);
            // end point
            const xEnd = x + (x * x - y * y - 4) * multiplier;
            const yEnd = y + 2 * x * y * multiplier;
            dataSeries.append(xEnd, yEnd);
        }
    }
    lineSegmentSeries.dataSeries = dataSeries;
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
}
basicRectangleSeriesChart("scichart-root");
