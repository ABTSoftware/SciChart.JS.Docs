---
sidebar_position: 9
---

# The Index Axis

## Overview

The [IndexAxis:blue_book:](http://stagingdemo.scichart.com/documentation/js/v5/typedoc/classes/indexaxis.html) is a specialized axis type in SciChart.js that combines the benefits of both [CategoryAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/categoryaxis.html) and [DateTimeNumericAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/datetimenumericaxis.html). This hybrid axis type uses X-Index positioning like a [CategoryAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/categoryaxis.html) while maintaining the ability to display DateTime values as labels, making it ideal for financial and time-series data with irregular intervals.

The [IndexAxis:blue_book:](http://stagingdemo.scichart.com/documentation/js/v5/typedoc/classes/indexaxis.html) is a specialized axis type in SciChart.js that measures and positions data points based on their index rather than their actual data values. This axis type is particularly useful for financial charts, time-series data with irregular intervals, and datasets where sequential positioning is more important than proportional spacing.

Unlike value axes ([NumericAxis:blue_book:](http://stagingdemo.scichart.com/documentation/js/v5/typedoc/classes/numericaxis.html), [DateTimeNumericAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/datetimenumericaxis.html)) that position data proportionally according to their values, the [IndexAxis:blue_book:](http://stagingdemo.scichart.com/documentation/js/v5/typedoc/classes/indexaxis.html) treats each data point as equally spaced regardless of the underlying x-values. This makes it ideal for displaying data where gaps (like weekends in financial data) should not appear as empty spaces on the chart.

## Difference between CategoryAxis, NumericAxis and IndexAxis

Imagine you want to plot the data:

| **Age (XAxis)** | **Cats** | **Dogs** | **Fish** |
| --------------- | -------- | -------- | -------- |
| 1               | 7        | 7        | 8        |
| 9               | 6        | 5        | 7        |
| 10              | 5        | 4        | 3        |
| 20              | 4        | 3        | 2        |

A standard [NumericAxis:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/numericaxis.html) (which is a value-axis) and the [IndexAxis:blue_book:](http://stagingdemo.scichart.com/documentation/js/v5/typedoc/classes/indexaxis.html) would display the data differently.

<LiveDocSnippet maxWidth={"100%"} name="./CategoryAxisValueAxisIndexAxis/demo" htmlPath="./CategoryAxisValueAxisIndexAxis/demo.html" cssPath="./CategoryAxisValueAxisIndexAxis/demo.css" />

Here's the code to setup the chart:

<CodeSnippetBlock labels={["TS"]}>

    ```ts showLineNumbers file=./CategoryAxisValueAxisIndexAxis/demo.ts start=region_C_start end=region_C_end

    ```

</CodeSnippetBlock>

## Key Characteristics

**Index-Based Positioning:** Data points are positioned at regular intervals based on their sequential index in the dataset, not their actual values. If you have data at x-values, all three points will be evenly spaced on the axis.
​

**Category Behavior:** The IndexAxis belongs to the category axis family, which uses X-Index rather than X-Value to measure chart series. The visible range operates on index values rather than data values.
​

**Equal Spacing:** All data points receive equal spacing on the chart, making patterns and trends easier to visualize when data has irregular intervals.

## Constructor and Options

The [IndexAxis:blue_book:](http://stagingdemo.scichart.com/documentation/js/v5/typedoc/classes/indexaxis.html) extends AxisBase2D and inherits all common axis properties from AxisCore. When creating an IndexAxis, you can specify options including:

```typescript
const xAxis = new IndexAxis(wasmContext, {
    axisTitle: "Index Axis",
    axisAlignment: EAxisAlignment.Bottom,
    id: "IndexXAxis",
    visibleRange: new NumberRange(0, 100),
    labelProvider: customLabelProvider // optional
});
```

## Common Use Cases

**Financial Charts:** Display stock prices, forex, or cryptocurrency data where trading only occurs on business days. The IndexAxis eliminates weekend gaps automatically.

​**Irregular Time Series:** When time intervals between data points vary significantly, IndexAxis ensures consistent visual spacing.

**Sequential Data:** Any dataset where the order of data points matters more than their absolute values.


Here is example of IndexAxis in ohlc chart:

<LiveDocSnippet name="./OhlcChart/demo" />

<CodeSnippetBlock labels={["TS"]}>

    ```ts showLineNumbers file=./OhlcChart/demo.ts start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

## Conclusion

The [IndexAxis:blue_book:](http://stagingdemo.scichart.com/documentation/js/v5/typedoc/classes/indexaxis.html) represents the best of both worlds for time-series data visualization, particularly in financial applications. By combining the gap-collapsing behavior of CategoryAxis with the DateTime labeling capabilities of DateTimeNumericAxis, it provides an optimal solution for displaying irregular time-series data without visual gaps while maintaining meaningful temporal context.

This axis type is essential for creating professional-grade financial charts, business analytics dashboards, and any application where time-based data has natural gaps that should not be visually represented.
