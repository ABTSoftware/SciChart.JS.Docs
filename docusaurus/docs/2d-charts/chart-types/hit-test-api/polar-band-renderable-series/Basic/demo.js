import * as SciChart from "scichart";
export async function polarMountainChart(divElementId) {
    const { SciChartPolarSurface, PolarNumericAxis, SciChartJsNavyTheme, PolarBandRenderableSeries, EPolarAxisMode, EAxisAlignment, NumberRange, CustomAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint, ECoordinateMode, NativeTextAnnotation, EMultiLineAlignment, DpiHelper, XyyDataSeries } = SciChart;
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 8),
        flippedCoordinates: true,
    });
    sciChartSurface.xAxes.add(angularXAxis);
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 5),
        autoTicks: false,
        majorDelta: 1
    });
    sciChartSurface.yAxes.add(radialYAxis);
    // add a polar band to the chart to demonstrate hit-testing
    const polarBand = new PolarBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7],
            yValues: [4, 3, 2, 1, 3, 4, 5, 6],
            y1Values: [1, 2, 5, 6, 4, 3, 2, 1],
            dataSeriesName: "Polar Band 1"
        }),
        stroke: "white",
    });
    sciChartSurface.renderableSeries.add(polarBand);
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
        x1: 6,
        y1: 5,
        lineSpacing: 10,
        multiLineAlignment: EMultiLineAlignment.Left,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
    });
    sciChartSurface.annotations.add(dotAnnotation, textAnnotation);
    // Add an event listener for mouse down events
    sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent) => {
        // Use our DpiHelper class to multiply coordinates, else screens with non-100% scaling will not work very well
        const x = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const y = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        // optional - flag to stop checking for hit-test on other series once a hit is found
        let wasTheHitSuccessfulAtLeastOnce = false;
        if (polarBand.hitTestProvider && mouseEvent && !wasTheHitSuccessfulAtLeastOnce) {
            const hitTestInfo = polarBand.hitTestProvider.hitTest(x, y, HIT_TEST_RADIUS);
            dotAnnotation.x1 = hitTestInfo.hitTestPointValues.x;
            dotAnnotation.y1 = hitTestInfo.hitTestPointValues.y;
            dotAnnotation.isHidden = false;
            if (hitTestInfo.isHit) {
                // Successful Hit
                dotAnnotation.svgString = SUCCESSFUL_HIT_SVG;
                textAnnotation.text = `Hit (x: ${hitTestInfo.hitTestPointValues.x.toFixed(2)}, y: ${hitTestInfo.hitTestPointValues.y.toFixed(2)})\n`
                    + `- series: "${hitTestInfo.associatedSeries.getDataSeriesName()}"\n`
                    + `- yValue: ${hitTestInfo.yValue}`;
                +`- y1Value: ${hitTestInfo.y1Value}`;
                wasTheHitSuccessfulAtLeastOnce = true;
            }
            else {
                // No Hit
                dotAnnotation.svgString = NO_HIT_SVG;
                textAnnotation.text = `No hit detected\n`;
            }
        }
    });
    return { sciChartSurface, wasmContext };
}
polarMountainChart("scichart-root");
