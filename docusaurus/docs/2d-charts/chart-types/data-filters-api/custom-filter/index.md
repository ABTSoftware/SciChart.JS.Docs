---
sidebar_position: 6
---

# ✅ Creating a Custom Filter

As well as several filters out of the box, such as Moving Average, Linear Trendline, Scale & Offset and Ratio filter, you can also create custom filters or data transforms in SciChart.js

There are two levels of filter customization, simple and advanced:

*   If you just need to apply a transformation or filter function to each data point, use a simple **Custom Filter** by creating an instance of one of the CustomFilter types, and set your filter function.
*   If you want to totally reshape your data, or perform transformations that need access to the entire dataSeries, create an **Advanced Custom Filter** by extending one of the FilterBase classes.

Simple Custom Filters
---------------------

There are Custom Filter classes for each of the main series types:

*   XyCustomFilter
*   XyyCustomFilter
*   XyzCustomFilter
*   OhlcCustomFilter

They all have a **filterFunction** of type **(index: number, y: number) => number** which will be applied to each data value in the series. The multiValue series types have additional properties for each of the data values.

E.g. for an XyyCustomFilter you can potentially apply different functions to y and y1 by setting **filterfunction** and **y1filterFunction**.

For OhlcCustomFilter, the **closefilterFunction** will apply to any field which does not have an explicit function set.

### Worked Example: Excluding data from a chart depending on Y-value

The following worked example demonstrates how to create a Simple custom filter. We use a filterFunction and exclude any values that are inside the range y=0.33 to 0.66 by returning NaN.

<CodeSnippetBlock labels={["simple custom filter"]}>
    ```ts showLineNumbers
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id-6');
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    // A function to get random data
    const getData = (start, count) => {
        let xValues = [];
        let yValues = [];
        for (let i = start; i < start + count; i++) {
            xValues.push(i);
            yValues.push(Math.random());      
        }
        return { xValues, yValues };
    };
    // Original Data
    const dataSeries = new XyDataSeries(wasmContext, getData(0, 1000));
    // A function to exclude the middle thrid of the data
    const midRangeFilter = (index, y) => {
        if (y < 0.33 || y > 0.66) {
            return y;
        } else {
            // Return NaN for data you want to exclude
            return NaN;
        }
    }
    // Create the filter, passing in the original series
    const customFilter = new XyCustomFilter(dataSeries, { filterFunction: midRangeFilter });
    const filteredSeries = new XyScatterRenderableSeries(wasmContext, { dataSeries: customFilter });
    sciChartSurface.renderableSeries.add(filteredSeries);
    ```

</CodeSnippetBlock>

This results in the following output:

![](img/1.png)

When creating a filtering function (as opposed to a transformation function) return NaN for points from the original dataset you want to exclude.

Reusable Simple Custom Filters
------------------------------

If you want to be able to reuse your simple filter but with some parameters, you can extend the relevant **CustomFilter** class and embed your function in it.

For example:

<CodeSnippetBlock labels={["JavaScript", "TypeScript" ]}>
    ```ts showLineNumbers
    class RangeFilter extends XyCustomFilter {
        constructor(originalSeries, options) {
            super(originalSeries, options);
            this.upper = options.upper ?? 0.66;
            this.lower = options.lower ?? 0.33;
            // Using an arrow function ensures that 'this' is correct
            // Setting the property causes filterAll to be run.
            this.filterFunction = (index, y) => (y < this.lower || y > this.upper) ? y : NaN;
        }
    }
    ...
    // Create an instance, passing in parameters
    const rangeFilter = new RangeFilter(dataSeries, { upper: 0.5, lower: 0.1 });
    const filteredSeries = new XyScatterRenderableSeries(wasmContext, { dataSeries: rangeFilter });
    ```
    ```ts showLineNumbers
    // Options for the filter
    interface IRangeFilterOptions extends IXyCustomFilterOptions {
        upper: number;
        lower: number;
    }
    // A Custom Filter that excludes data with a range
    class RangeFilter extends XyCustomFilter {
        public upper = 0.66;
        public lower = 0.33;
        constructor(originalSeries: BaseDataSeries, options: IRangeFilterOptions) {
            super(originalSeries, options);
            this.upper = options?.upper ?? this.upper;
            this.lower = options?.lower ?? this.lower;
            // Using an arrow function ensures that 'this' is correct
            // Setting the property causes filterAll to be run.
            this.filterFunction = (index, y) => (y < this.lower || y > this.upper) ? y : NaN;
        }
    }
    ...
    // Create an instance, passing in parameters
    const rangeFilter = new RangeFilter(dataSeries, { upper: 0.5, lower: 0.1 });
    const filteredSeries = new XyScatterRenderableSeries(wasmContext, { dataSeries: rangeFilter });
    ```

</CodeSnippetBlock>

Advanced Custom Filters
-----------------------

To create an Advanced Custom Filter we simply extend the FilterBase of the type of series we want ie (**XyFilterBase**, **XyyFilterBase**, **XyzFilterBase**, **OhlcFilterBase**). We must then implement the **filterAll** method to perform filtering. Optionally, we can implement one or more of the following to gain performance if our transformation allows for partial recalculation.

*   filterOnAppend(count: number): void
*   filterOnUpdate(index: number): void
*   filterOnInsert(startIndex: number, count: number): void
*   filterOnRemove(startIndex: number, count: number): void
*   onClear(): void

The base class handles the field mapping in the getOriginalYValues method (and getOriginalY1Values for Xyy, and similar for the other types).

The constructor should take the originalSeries and an options class, and call super with these. It should also call filterAll if data is available, as this is not done by the base class.

For example:

<CodeSnippetBlock labels={["simple custom filter"]}>
    ```ts showLineNumbers
    constructor(originalSeries: BaseDataSeries, options?: IXyFilterOptions) {
        super(originalSeries, options);
        if (this.getOriginalCount() > 0) {
            this.filterAll();
        }
    }
    ```

</CodeSnippetBlock>

### Worked Example - Advanced Custom Filters

You can find an example of an Advanced Custom Filter in the [SciChart.js Examples Suite](/docs/get-started/scichart-js-examples-suite/index.md).

Please see the [Realtime Aggregation using Advanced Custom Filter Example](http://demo.scichart.com/javascript-custom-filters) for more details.

#### See Also

* [What is the Filters API](/docs/2d-charts/chart-types/data-filters-api/data-filters-api-overview/index.md)
* [Scale Offset Filters](/docs/2d-charts/chart-types/data-filters-api/scale-offset-filters/index.md)
* [Linear Trendline Filter](/docs/2d-charts/chart-types/data-filters-api/linear-trendline-filter/index.md)
* [Ratio Filter](/docs/2d-charts/chart-types/data-filters-api/ratio-filter/index.md)
* [Moving Average Filter](/docs/2d-charts/chart-types/data-filters-api/moving-average-filter/index.md)