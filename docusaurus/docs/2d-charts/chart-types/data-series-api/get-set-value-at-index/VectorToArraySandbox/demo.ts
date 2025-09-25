import * as SciChart from "scichart";

const {
    SciChartSurface,
    XyDataSeries,
    NumericAxis,
    TextAnnotation,
    vectorToArray,
    vectorToArrayViewF64,
    SciChartDefaults,
    libraryVersion
} = SciChart;

async function initSciChart() {
    console.log(`Scichart version ${libraryVersion}`);
    // Ignore warnings in console for this test harness
    SciChartDefaults.performanceWarnings = false;
    // Create the SciChartSurface - we need this for wasmContext
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 1,
            y1: 9,
            fontSize: 26,
            text: "DataSeries vectorToArray tests. Check the console output!"
        })
    );

    const example1 = () => {
        console.log("example 1: get(i) from dataseries");
        // #region Example1-Start
        // Example: Accessing X, Y Values from DataSeries using getNativeXValues, getNativeYValues
        const xyDataSeries = new XyDataSeries(wasmContext);
        xyDataSeries.appendRange([1, 2, 3], [10, 20, 30]);

        // Get xValues from the dataSeries
        const xValues = xyDataSeries.getNativeXValues();
        // Get yValues from the dataSeries
        const yValues = xyDataSeries.getNativeYValues();
        for (let i = 0; i < xyDataSeries.count(); i++) {
            // Note, this method of point by point access using .get(i) is slow
            // faster methods exist below using the helper functions `vectorToArrayViewF64` and `vectorToArray`
            console.log(`index=${i}, xy = ${xValues.get(i)}, ${yValues.get(i)}`);
        }

        // Will output to console
        // index=0, xy=1, 10
        // index=1, xy=2, 20
        // index=2, xy=3, 30
        // #endregion Example1-End
    };

    const example2 = () => {
        console.log("example 2: time to get(i) from dataseries 1M points (slow path)");

        // #region Example2-Start
        // Example 2: slow readback of dataSeries data via dataSeries.getNativeXValues().get(i)
        const count = 1_000_000;
        const xValues: number[] = Array.from(Array(count).keys());
        const yValues: number[] = Array.from(Array(count).keys());

        const series = new XyDataSeries(wasmContext, {
            xValues,
            yValues
        });

        const startIterate = performance.now();
        // Check values
        let test = 0;
        for (let i = 0; i < count; i++) {
            test += series.getNativeXValues().get(i);
            test += series.getNativeYValues().get(i);
        }
        console.log(
            `Time to readback 1M points using slow .get(i) method: ${(performance.now() - startIterate).toFixed(3)}ms`
        );
        // Outputs: Time to readback 1M points using slow .get(i) method: 409ms
        //#endregion Example2-End
    };

    const example3 = () => {
        console.log("example 3: get count of dataSeries");
        // #region Example3-Start
        // Example: get count (length, size) of dataSeries
        const count = 1_000_000;
        const xValues: number[] = Array.from(Array(count).keys());
        const yValues: number[] = Array.from(Array(count).keys());

        const series = new XyDataSeries(wasmContext, {
            xValues,
            yValues
        });
        console.log(`dataSeries count: ${series.count()}`);
        // Outputs: "dataSeries count: 1,000,000"
        // #endregion Example3-End
    };

    const example4 = () => {
        console.log("example 4: set capacity of dataSeries");

        // #region Example4-Start
        // Example: setting the capacity of a dataseries to preallocate memory
        const series = new XyDataSeries(wasmContext);
        series.capacity = 1000000; // pre-allocates 1,000,000 values for X,Y
        console.log(`dataSeries count: ${series.count()}`);
        console.log(`dataSeries capacity: ${series.capacity}`);

        // Outputs: "dataSeries count: 0"
        // "dataSeries capacity: 1,000,000"
        // #endregion Example4-End
    };

    const example5 = () => {
        console.log("example 5: using vectorToArrayViewF64");
        // #region Example5-Start
        // vectorToArrayViewF64() (returns Float64Array) allows access to dataSeries xValues, yValues
        // by creating a view onto webassembly memory
        const count = 1_000_000;
        const xValues: number[] = Array.from(Array(count).keys());
        const yValues: number[] = Array.from(Array(count).keys());

        // Create an XyDataSeries with 1,000,000 xValues, yValues
        const dataSeries = new XyDataSeries(wasmContext, {
            xValues,
            yValues
        });

        // Create a view into the data (maps dataSeries xValues, yValues onto a JavaScript Float64Array)
        const startGet = performance.now();
        const f64XValues: Float64Array = vectorToArrayViewF64(dataSeries.getNativeXValues(), wasmContext);
        const f64YValues: Float64Array = vectorToArrayViewF64(dataSeries.getNativeYValues(), wasmContext);
        console.log(`vectorToArrayViewF64 get: ${(performance.now() - startGet).toFixed(3)}ms`);

        // Operate on these as normal JS arrays
        const startIterate = performance.now();
        // Check values
        let test = 0;
        for (let i = 0; i < count; i++) {
            test += f64XValues[i];
            test += f64YValues[i];
        }
        console.log(`vectorToArrayViewF64 iterate: ${(performance.now() - startIterate).toFixed(3)}ms`);

        // Output to console:
        // vectorToArrayViewF64 get: 0.072ms
        // vectorToArrayViewF64 iterate: 2.747ms
        // #endregion Example5-End
    };

    const example6 = () => {
        console.log("example 6: using vectorToArray");
        // #region Example6-Start
        // vectorToArray() (returns number[]) performs a deep-copy of a scichart webassembly vector
        // allowing for safer read-only access to dataseries data
        const count = 1_000_000;
        const xValues = Array.from(Array(count).keys());
        const yValues = Array.from(Array(count).keys());

        // Create an XyDataSeries with 1,000,000 xValues, yValues
        const dataSeries = new XyDataSeries(wasmContext, {
            xValues,
            yValues
        });

        const startGet = performance.now();

        // vectorToArray creates first a Float64Array view onto dataSeries xValues, yValues
        // then uses Array.from(typedArrayView) to copy to JS Array
        const jsXValues: number[] = vectorToArray(dataSeries.getNativeXValues(), wasmContext);
        const jsYValues: number[] = vectorToArray(dataSeries.getNativeYValues(), wasmContext);

        console.log(`vectorToArray deepCopy: ${(performance.now() - startGet).toFixed(3)}ms`);

        // Operate on these as normal JS arrays
        const startIterate = performance.now();
        // Check values
        let test = 0;
        for (let i = 0; i < count; i++) {
            test += jsXValues[i];
            test += jsYValues[i];
        }
        console.log(`vectorToArray iterate: ${(performance.now() - startIterate).toFixed(3)}ms`);

        // Output to console:
        // vectorToArray deepCopy: 62ms
        // vectorToArray iterate: 2ms
        // #endregion Example6-End
    };

    const example7 = () => {
        console.log("example 7: fast copy one dataseries to another");

        // #region Example7-Start
        const count = 1_000_000;
        const xValues: number[] = Array.from(Array(count).keys());
        const yValues: number[] = Array.from(Array(count).keys());

        const startCreate = performance.now();

        // Create a src series and fill with values
        const seriesSrc = new XyDataSeries(wasmContext, {
            xValues,
            yValues
        });

        console.log(`time to fill a dataSeries 1M points: ${(performance.now() - startCreate).toFixed(3)}ms`);

        const startCopy = performance.now();

        // Create a dest series and ensure the capacity (memory size) before calling
        // vectorToArrayView. This will avoid potential "Cannot perform %TypedArray%.prototype.set on a detached ArrayBuffer"
        // error as any resizes of memory might move other memory locations
        const seriesDest = new XyDataSeries(wasmContext);
        seriesDest.capacity = seriesSrc.count();

        // Fast copy xValues, yValues from one dataSeries to another
        console.time("Time to deep copy an entire dataSeries");
        seriesDest.appendRange(
            vectorToArrayViewF64(seriesSrc.getNativeXValues(), wasmContext),
            vectorToArrayViewF64(seriesSrc.getNativeYValues(), wasmContext)
        );

        console.log(`time to deep copy a dataSeries 1M points: ${(performance.now() - startCopy).toFixed(3)}ms`);

        // Console output
        // Time to fill a dataSeries 1M points: 11.762ms
        // Time to deep copy a dataSeries 1M points: 13.861ms
        // #endregion Example7-End
    };

    example1();
    example2();
    example3();
    example4();
    example5();
    example6();
    example7();
}

initSciChart();
