import * as SciChart from "scichart";

export async function polarMountainChart(divElementId) {
    const { 
        SciChartPolarSurface, 
        PolarNumericAxis, 
        SciChartJsNavyTheme,
        PolarStackedMountainCollection,
        PolarStackedMountainRenderableSeries,
        EPolarAxisMode,
        EAxisAlignment,
        NumberRange,
        XyDataSeries,
        CustomAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        ECoordinateMode,
        NativeTextAnnotation,
        EMultiLineAlignment,
        DpiHelper,
    } = SciChart;

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        flippedCoordinates: true,
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 12),
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 8),
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // Create a collection and add a couple of polar stacked mountains to the chart
    const collection = new PolarStackedMountainCollection(wasmContext);

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const polarMountain1 = new PolarStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: [2.5, 1.8, 3.0, 1.4, 2.0, 1.75, 2.4, 1.5, 3.0, 2.5],
            dataSeriesName: "Red Mountain"
        }),
        fill: "#883333",
    });
    const polarMountain2 = new PolarStackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: [4.5, 3.2, 5.1, 2.8, 4.0, 3.5, 4.8, 3.0, 5.0, 4.5],
            dataSeriesName: "Blue Mountain"
        }),
        fill: "#3333AA",
    });
    collection.add(polarMountain1, polarMountain2);

    // Add the collection to the SciChartSurface
    sciChartSurface.renderableSeries.add(collection);

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
        x1: 10.5,
        y1: 8,
        lineSpacing: 10,
        multiLineAlignment: EMultiLineAlignment.Left,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
    });
    sciChartSurface.annotations.add(dotAnnotation, textAnnotation);

    // Add an event listener for mouse down events
    sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent: MouseEvent) => {
        // Use our DpiHelper class to multiply coordinates, else screens with non-100% scaling will not work very well
        const x = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const y = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;

        // optional - flag to stop checking for hit-test on other series once a hit is found
        let wasTheHitSuccessfulAtLeastOnce = false; 

        collection
            .asArray()
            .forEach(rs => {
            console.log(`Trying hit test on: ${rs.getDataSeriesName()}`);
            
            if (rs.hitTestProvider && mouseEvent && !wasTheHitSuccessfulAtLeastOnce) {
                const hitTestInfo = rs.hitTestProvider.hitTest(x, y, HIT_TEST_RADIUS);

                dotAnnotation.x1 = hitTestInfo.hitTestPointValues.x;
                dotAnnotation.y1 = hitTestInfo.hitTestPointValues.y;
                dotAnnotation.isHidden = false;

                if (hitTestInfo.isHit) { 
                    // Successful Hit
                    dotAnnotation.svgString = SUCCESSFUL_HIT_SVG;
                    textAnnotation.text = `Hit (x: ${hitTestInfo.hitTestPointValues.x.toFixed(2)}, y: ${hitTestInfo.hitTestPointValues.y.toFixed(2)})\n`
                        + `- series: "${hitTestInfo.associatedSeries.getDataSeriesName()}"\n`
                        + `- mountain index: ${hitTestInfo.dataSeriesIndex}\n`
                        + `- yValue: ${hitTestInfo.yValue}`;
                    wasTheHitSuccessfulAtLeastOnce = true;
                } else { 
                    // No Hit
                    dotAnnotation.svgString = NO_HIT_SVG;
                    textAnnotation.text = `No hit detected\n`;
                }
            }
        });
    });

    return { sciChartSurface, wasmContext };
}

polarMountainChart("scichart-root");