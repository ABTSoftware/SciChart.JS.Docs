import * as SciChart from "scichart";

export async function polarMountainChart(divElementId) {
    const { 
        SciChartPolarSurface, 
        PolarNumericAxis, 
        SciChartJsNavyTheme,
        PolarMountainRenderableSeries,
        EPolarAxisMode,
        EAxisAlignment,
        NumberRange,
        XyDataSeries,
        CustomAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        ECoordinateMode,
        NativeTextAnnotation,
        EllipsePointMarker,
        EMultiLineAlignment,
        DpiHelper,
    } = SciChart;

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 16),
        flippedCoordinates: true,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 6),
        innerRadius: 0.1,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // add a couple of polar mountains to the chart
    const polarMountain1 = new PolarMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7],
            yValues: [2.5, 1.8, 3.0, 1.4, 2.0, 1.75, 2.4, 1.5],
            dataSeriesName: "Red Mountain"
        }),
        stroke: "white",
        fill: "#883333",
    });
    const polarMountain2 = new PolarMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [8, 9, 10, 11, 12, 13, 14, 15],
            yValues: [4.5, 3.2, 5.1, 2.8, 4.0, 3.5, 4.8, 3.0],
            dataSeriesName: "Blue Mountain"
        }),
        stroke: "black",
        fill: "#3333AA",
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            strokeThickness: 2,
            stroke: "SteelBlue",
            fill: "LightSteelBlue"
        }),
    });
    sciChartSurface.renderableSeries.add(polarMountain1, polarMountain2);

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
        x1: 12,
        y1: 5.5,
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

        [...sciChartSurface.renderableSeries.asArray()] // copy the renderable series to an array
            .reverse() // reverse array -> The 2nd series will be drawn on top of the 1st series, users likely want to hit-test the topmost series first (valueable for overlapping series)
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