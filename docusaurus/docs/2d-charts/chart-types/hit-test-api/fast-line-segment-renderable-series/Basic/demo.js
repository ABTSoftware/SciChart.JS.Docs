import * as SciChart from "scichart";
export async function lineSegmentHitTest(divElementId) {
    const { SciChartSurface, NumericAxis, SciChartJsNavyTheme, XyDataSeries, FastLineSegmentRenderableSeries, NumberRange, CustomAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint, ECoordinateMode, NativeTextAnnotation, EMultiLineAlignment, DpiHelper, EStrokePaletteMode, EPaletteProviderType, parseColorToUIntArgb, } = SciChart;
    class LineSegmentPaletteProvider {
        strokePaletteMode = EStrokePaletteMode.GRADIENT;
        palettedStart = parseColorToUIntArgb("orange");
        palettedEnd = parseColorToUIntArgb("cyan");
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
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    const xAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, 10),
    });
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(1, 10),
    });
    sciChartSurface.yAxes.add(yAxis);
    // #region_A_start
    // add a couple of line segments to the chart
    const lineSegment1 = new FastLineSegmentRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0.5, 1, 2, 3, 5, 4, 6, 7, 8, 9],
            yValues: [4.5, 3.2, 5.1, 2.8, 4.0, 3.5, 4.8, 3.0, 2.3, 7.1],
            dataSeriesName: "Teal&Orange Segments"
        }),
        strokeThickness: 5,
        paletteProvider: new LineSegmentPaletteProvider(),
    });
    sciChartSurface.renderableSeries.add(lineSegment1);
    // #region_A_end
    // #region_B_start
    const SUCCESSFUL_HIT_SVG = `<svg width="8" height="8"><circle cx="50%" cy="50%" r="4" fill="#33AA33" stroke="#000000" stroke-width="0.7"/></svg>`;
    const NO_HIT_SVG = `<svg width="4" height="4"><circle cx="50%" cy="50%" r="2" fill="#FF0000"/></svg>`;
    const HIT_TEST_RADIUS = 10; // Radius for hit testing
    // --- Minimal HitTest and SVG Annotation ---
    const dotAnnotation = new CustomAnnotation({
        svgString: NO_HIT_SVG,
        isHidden: true, // initially hidden
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue
    });
    const textAnnotation = new NativeTextAnnotation({
        text: "",
        fontSize: 20,
        x1: 1,
        y1: 9,
        lineSpacing: 10,
        multiLineAlignment: EMultiLineAlignment.Left,
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
    });
    sciChartSurface.annotations.add(dotAnnotation, textAnnotation);
    // Add an event listener for mouse down events
    sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent) => {
        // Use our DpiHelper class to multiply coordinates, else screens with non-100% scaling will not work very well
        const x = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const y = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        const rs = sciChartSurface.renderableSeries.get(0); // Get the renderable series
        if (rs.hitTestProvider && mouseEvent) {
            const hitTestInfo = rs.hitTestProvider.hitTest(x, y, HIT_TEST_RADIUS);
            dotAnnotation.x1 = hitTestInfo.hitTestPointValues.x;
            dotAnnotation.y1 = hitTestInfo.hitTestPointValues.y;
            dotAnnotation.isHidden = false;
            if (hitTestInfo.isHit) {
                // Successful Hit
                dotAnnotation.svgString = SUCCESSFUL_HIT_SVG;
                textAnnotation.text = `Hit (x: ${hitTestInfo.hitTestPointValues.x.toFixed(2)}, y: ${hitTestInfo.hitTestPointValues.y.toFixed(2)})\n`
                    + `- Series index: ${hitTestInfo.dataSeriesIndex}\n`
                    + `- yValue: ${hitTestInfo.yValue}\n`
                    + `- xValue: ${hitTestInfo.xValue}`;
            }
            else {
                // No Hit
                dotAnnotation.svgString = NO_HIT_SVG;
                textAnnotation.text = `No hit detected\n`;
            }
        }
    });
    // #region_B_end
    return { sciChartSurface, wasmContext };
}
lineSegmentHitTest("scichart-root");
