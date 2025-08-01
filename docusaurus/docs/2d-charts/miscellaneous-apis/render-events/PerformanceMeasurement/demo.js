import { EAutoRange, NumberRange, NumericAxis, receiveNextEvent, SciChartSurface } from "scichart";
export const drawExamplePerformanceMeasurement2d = async (rootElement) => {
    const initStartTimeStamp = performance.now();
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        createSuspended: true
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, growBy: new NumberRange(0.1, 0.1) }));
    // The fist frame is usually the slowest, so we perform and measure it separately.
    // Also in this example we include it into the initialization time.
    await sciChartSurface.nextStateRender({
        resumeBefore: true,
        invalidateOnResume: true,
        suspendAfter: false
    });
    const firstFrameRenderedTimeStamp = performance.now();
    const renderStartTimeStamps = [];
    const renderEndTimeStamps = [];
    const framePaintedTimeStamps = [];
    sciChartSurface.preRenderAll.subscribe(() => {
        renderStartTimeStamps.push(performance.now());
    });
    sciChartSurface.renderedToDestination.subscribe(() => {
        renderEndTimeStamps.push(performance.now());
    });
    sciChartSurface.painted.subscribe(() => {
        framePaintedTimeStamps.push(performance.now());
    });
    sciChartSurface.invalidateElement();
    const requestRedraw = () => {
        sciChartSurface.invalidateElement();
    };
    const outputPerformanceMeasurements = () => {
        if (renderEndTimeStamps.length !== renderStartTimeStamps.length ||
            renderEndTimeStamps.length !== framePaintedTimeStamps.length) {
            console.warn("There are differences in timestamps number!", renderStartTimeStamps, renderEndTimeStamps, framePaintedTimeStamps);
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
    return { sciChartSurface, requestRedraw, outputPerformanceMeasurements };
};
drawExamplePerformanceMeasurement2d("scichart-root");
