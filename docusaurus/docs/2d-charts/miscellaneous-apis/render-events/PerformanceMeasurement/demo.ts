import {
    easing,
    ECoordinateMode,
    EllipsePointMarker,
    EMultiLineAlignment,
    FastLineRenderableSeries,
    GradientParams,
    INativeTextAnnotationOptions,
    NativeTextAnnotation,
    NumericAxis,
    PaletteFactory,
    Point,
    receiveNextEvent,
    ScatterAnimation,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";

export const drawExamplePerformanceMeasurement2d = async (rootElement: string | HTMLDivElement) => {
    // #region_A_start
    // highlight-next-line
    const initStartTimeStamp = performance.now();

    const { sciChartSurface, wasmContext } = await SciChartSurface.createSingle(rootElement, {
        // highlight-next-line
        createSuspended: true
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // highlight-start
    // The fist frame is usually the slowest, so we perform and measure it separately.
    // Also in this example we include it into the initialization time.
    // #region_C_start
    await sciChartSurface.nextStateRender({
        resumeBefore: true,
        invalidateOnResume: true,
        suspendAfter: false
    });
    // #region_C_end

    const firstFrameRenderedTimeStamp = performance.now();

    const renderStartTimeStamps: DOMHighResTimeStamp[] = [];
    const renderEndTimeStamps: DOMHighResTimeStamp[] = [];
    const framePaintedTimeStamps: DOMHighResTimeStamp[] = [];

    sciChartSurface.preRenderAll.subscribe(() => {
        renderStartTimeStamps.push(performance.now());
    });

    sciChartSurface.renderedToDestination.subscribe(() => {
        renderEndTimeStamps.push(performance.now());
    });

    sciChartSurface.painted.subscribe(() => {
        framePaintedTimeStamps.push(performance.now());
    });

    const outputPerformanceMeasurements = () => {
        if (
            renderEndTimeStamps.length !== renderStartTimeStamps.length ||
            renderEndTimeStamps.length !== framePaintedTimeStamps.length
        ) {
            // this will mean that the setup is wrong, probably due to the missing "createSuspended" flag during the initialization
            console.warn(
                "There are differences in timestamps number!",
                renderStartTimeStamps,
                renderEndTimeStamps,
                framePaintedTimeStamps
            );
        }

        const aggregatedResults = renderEndTimeStamps.map((end, index) => {
            const start = renderStartTimeStamps[index];
            return { start, end, renderDuration: end - start, frameDuration: framePaintedTimeStamps[index] - start };
        });

        console.log("Performance Measurement Results");
        console.log("Initial Frame time", firstFrameRenderedTimeStamp - initStartTimeStamp);
        console.table(aggregatedResults);

        // cleanup the results to output only new ones the next time
        renderStartTimeStamps.length = 0;
        renderEndTimeStamps.length = 0;
        framePaintedTimeStamps.length = 0;
    };

    // render one more time and show results
    sciChartSurface.invalidateElement();
    await receiveNextEvent(sciChartSurface.painted);
    outputPerformanceMeasurements();
    // highlight-end
    // #region_A_end

    sciChartSurface.annotations.add(new PerformanceStatsAnnotation());

    ////
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());

    const length = 120;
    let xValues = Array.from(Array(length).keys());
    let yValues = Array.from({ length }, () => Math.random() * length);

    // Create a scatter series with some initial data
    const scatterSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues
        }),
        strokeThickness: 2,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 11,
            height: 11,
            fill: "blue",
            strokeThickness: 0
        }),
        paletteProvider: PaletteFactory.createGradient(
            wasmContext,
            new GradientParams(new Point(0, 0), new Point(1, 1), [
                { offset: 0, color: "#36B8E6" },
                { offset: 0.2, color: "#5D8CC2" },
                { offset: 0.4, color: "#8166A2" },
                { offset: 0.6, color: "#AE418C" },
                { offset: 1.0, color: "#CA5B79" }
            ]),
            { enableStroke: true, enablePointMarkers: true, strokeOpacity: 0.67 }
        )
    });
    sciChartSurface.renderableSeries.add(scatterSeries);

    // create a temp series for passing animation values
    const animationSeries = new XyDataSeries(wasmContext);
    // register this so it is deleted along with the main surface
    sciChartSurface.addDeletable(animationSeries);
    // Update data using data animations
    let timerId: NodeJS.Timeout;

    const animateData = () => {
        xValues = xValues.map(x => x + ((Math.random() - 0.5) * length) / 5);
        yValues = yValues.map(y => y + ((Math.random() - 0.5) * length) / 5);
        // Set the values on the temp series
        animationSeries.clear();
        animationSeries.appendRange(xValues, yValues);
        scatterSeries.runAnimation(
            new ScatterAnimation({
                duration: 1000,
                ease: easing.outQuad,
                // Do not create a new DataSeries here or it will leak and eventually crash.
                dataSeries: animationSeries
            })
        );

        timerId = setTimeout(animateData, 1200);
    };
    timerId = setTimeout(animateData, 1000);

    return { sciChartSurface, outputPerformanceMeasurements };
};

// #region_B_start
/**
 * An annotation displaying render performance stats of the surface.
 * It extends the NativeTextAnnotation so its position and styles could be easily updated.
 *
 * @remarks Since the annotation is rendered on the same surface, the annotation displays stats from the previous frame.
 * So, basically it is always a frame behind the last drawn frame...
 */
class PerformanceStatsAnnotation extends NativeTextAnnotation {
    constructor(options?: INativeTextAnnotationOptions) {
        super(options);
        this.processResults = this.processResults.bind(this);

        this.x1 = 0;
        this.y1 = 0;
        this.xCoordinateMode = ECoordinateMode.Relative;
        this.yCoordinateMode = ECoordinateMode.Relative;
        this.multiLineAlignment = EMultiLineAlignment.Left;
        this.backgroundProperty = options?.background ?? "black";
    }
    public onAttach(scs: SciChartSurface): void {
        super.onAttach(scs);

        if (scs.isSubSurface) {
            scs.hasInvalidState = true;
            throw new Error(
                `PerformanceStatsAnnotation is only supposed to be attached to a regular surface, not a sub-chart!`
            );
        }
        subscribeToPerformanceMeasurements(scs, this.processResults);
    }

    protected processResults(result: TPerformanceMeasurementResults) {
        const {
            invalidatedTimeStamp,
            renderStartTimeStamp,
            renderToWebGlEndTimeStamp,
            renderEndTimeStamp,
            paintEndTimeStamp,
            lastPaintEndTimeStamp
        } = result;
        const renderTime = renderEndTimeStamp - renderStartTimeStamp;
        const renderToWebGlTime = renderToWebGlEndTimeStamp - renderStartTimeStamp;
        const copyToCanvasTime = renderTime - renderToWebGlTime;
        const timeToRenderStart = renderStartTimeStamp - invalidatedTimeStamp;
        const timeBetweenPaints = paintEndTimeStamp - lastPaintEndTimeStamp;
        const timeFromRequestToPaint = paintEndTimeStamp - invalidatedTimeStamp;

        // updating the underlying property instead of the setter to prevent invalidation,
        // alternatively Suspend API could be used
        this.textProperty = [
            `FPS: ${(1000 / timeBetweenPaints).toFixed(3).padStart(3, "0")}`,
            `Render: ${renderTime.toFixed(2).padStart(2, "0")}ms`,
            renderToWebGlTime === renderToWebGlTime
                ? `Copy to Canvas: ${copyToCanvasTime.toFixed(2).padStart(2, "0")}ms`
                : "",
            `Since Last Paint: ${timeBetweenPaints.toFixed(2).padStart(2, "0")}ms`
        ].join("\n");
    }
}

/**
 * Collected performance timestamps
 */
type TPerformanceMeasurementResults = {
    invalidatedTimeStamp: DOMHighResTimeStamp;
    renderStartTimeStamp: DOMHighResTimeStamp;
    renderToWebGlEndTimeStamp: DOMHighResTimeStamp;
    renderEndTimeStamp: DOMHighResTimeStamp;
    paintEndTimeStamp: DOMHighResTimeStamp;
    lastPaintEndTimeStamp: DOMHighResTimeStamp;
};

function subscribeToPerformanceMeasurements(
    surface: SciChartSurface,
    callback: (result: TPerformanceMeasurementResults) => void
) {
    let invalidatedTimeStamp: DOMHighResTimeStamp;
    let renderStartTimeStamp: DOMHighResTimeStamp;
    let renderToWebGlEndTimeStamp: DOMHighResTimeStamp;
    let renderEndTimeStamp: DOMHighResTimeStamp;
    let paintEndTimeStamp: DOMHighResTimeStamp;
    let lastPaintEndTimeStamp: DOMHighResTimeStamp;

    surface.redrawRequested.subscribe(isInvalidated => {
        invalidatedTimeStamp = performance.now();
    });

    surface.preRenderAll.subscribe(() => {
        renderStartTimeStamp = performance.now();
    });

    if (surface.isCopyCanvasSurface) {
        surface.renderedToWebGl.subscribe(() => {
            renderToWebGlEndTimeStamp = performance.now();
        });
    }

    surface.renderedToDestination.subscribe(() => {
        renderEndTimeStamp = performance.now();
    });

    surface.painted.subscribe(() => {
        lastPaintEndTimeStamp = paintEndTimeStamp;
        paintEndTimeStamp = performance.now();

        callback({
            invalidatedTimeStamp,
            renderStartTimeStamp,
            renderToWebGlEndTimeStamp,
            renderEndTimeStamp,
            paintEndTimeStamp,
            lastPaintEndTimeStamp
        });
    });
}
// #region_B_end

drawExamplePerformanceMeasurement2d("scichart-root");
