import {
    SciChartSurface,
    NumericAxis,
    EAutoRange,
    NumberRange,
    XyDataSeries,
    FastLineRenderableSeries
} from "scichart";

const generateData = (limit: number, step: number, offset: number = 0) => {
    const xValues: number[] = [];
    const yValues: number[] = [];

    for (let i = 0; i < limit; i += step) {
        xValues.push(offset + i);
        yValues.push(Math.random() * 20);
    }

    return { xValues, yValues };
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // create a surface in paused state
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        createSuspended: true
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, growBy: new NumberRange(0.1, 0.1) })
    );

    // unpause the surface
    sciChartSurface.resumeUpdates();
    sciChartSurface.invalidateElement();

    // initial data

    const { xValues, yValues } = generateData(10, 1);
    const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues, capacity: 1000 });
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "olive",
        strokeThickness: 2,
        dataSeries
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    //// #region_A_start Batching Data Updates
    // In this setup data is updated approximately each 10ms,
    // but the redraw is requested only when a batch of data points has been accumulated up to the specified size (`maxBatchSize`)
    let batchCounter = 0;
    const maxBatchSize = 1000;

    let timer: NodeJS.Timeout;

    const toggleUpdates = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
            return;
        }

        timer = setInterval(() => {
            // Pause chart rerender requests before updating the data.
            // highlight-next-line
            const unlock = sciChartSurface.suspender.lock();

            // here we create arrays of additional 10 data points
            const { xValues, yValues } = generateData(10, 1, dataSeries.count());

            // appending data points here won't trigger the chart redraw
            dataSeries.appendRange(xValues, yValues);
            batchCounter += xValues.length;
            console.log("Data updated. Number of points in the current batch: ", batchCounter);

            // unpause the chart
            // highlight-next-line
            unlock();

            // but if the accumulated data points reached the desired batch size,
            // we request a redraw explicitly
            if (batchCounter === maxBatchSize) {
                // reset counter
                batchCounter = 0;

                // request a redraw
                // highlight-next-line
                sciChartSurface.invalidateElement();
            }
        }, 10);
    };

    // bind the timer cleanup to the surface lifecycle
    sciChartSurface.addDeletable({
        delete: () => {
            clearInterval(timer);
        }
    });

    toggleUpdates();
    //// #region_A_end

    // #region_B_start
    sciChartSurface.suspender.onResumed.subscribe(() => {
        console.log("Updates resumed.");
    });
    // #region_B_end

    sciChartSurface.renderedToDestination.subscribe(() => {
        console.log("Chart Rendered");
    });

    return { sciChartSurface, toggleUpdates };
};

drawExample("scichart-root").then(initResult => {
    const button = document.getElementById("toggleDataUpdatesButton") as HTMLButtonElement;
    button.addEventListener("click", () => {
        initResult.toggleUpdates();
    });
});
