import {
    SciChartSurface,
    EAutoRange,
    FastLineRenderableSeries,
    NumberRange,
    XyDataSeries,
    NumericAxis
} from "scichart";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // // #region_B_start create a surface in paused state
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        // highlight-next-line
        createSuspended: true
    });
    // #region_B_end

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
        stroke: "orange",
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
            // here we create arrays of additional 10 data points
            const { xValues, yValues } = generateData(10, 1, dataSeries.count());

            // Pause chart rerender requests before updating the data.
            // highlight-next-line
            sciChartSurface.suspendUpdates();

            // appending data points here won't trigger the chart redraw
            dataSeries.appendRange(xValues, yValues);
            console.log("Data updated. Number of points in the current batch: ", batchCounter);

            // unpause the chart
            // highlight-next-line
            sciChartSurface.resumeUpdates({ invalidateOnResume: false, force: false });

            // but if the accumulated data points reached the desired batch size,
            // we request a redraw explicitly
            batchCounter += xValues.length;
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

    sciChartSurface.suspender.onResumed.subscribe(() => {
        console.log("Updates resumed.");
    });

    sciChartSurface.renderedToDestination.subscribe(() => {
        console.log("Chart Rendered");
    });

    return { sciChartSurface, toggleUpdates };
};

const generateData = (limit: number, step: number, offset: number = 0) => {
    const xValues: number[] = [];
    const yValues: number[] = [];

    for (let i = 0; i < limit; i += step) {
        xValues.push(offset + i);
        yValues.push(Math.random() * 20);
    }

    return { xValues, yValues };
};

drawExample("scichart-root").then(initResult => {
    const button = document.getElementById("toggleDataUpdatesButton") as HTMLButtonElement;
    button.addEventListener("click", () => {
        initResult.toggleUpdates();
    });
});
