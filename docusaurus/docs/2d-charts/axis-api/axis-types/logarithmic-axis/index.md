---
sidebar_position: 4
---

# The Logarithmic Axis

The [LogarithicAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/logarithmicaxis.html) is a Value axis similar to the normal NumericAxis, but where the tick values increase exponentially. Plotting data on such an axis is equivalent to plotting the log of that data. You can set the logarithmic base using the logBase property. eg logBase: 10 (the default) will result in ticks like 1, 10, 100, 1000. logBase 2 will result in ticks like 2, 4, 8, 16, 32.

:::info
Learn more about the [commonalities between axis here](/docs/2d-charts/axis-api/axis-types/common-axis-base-type).
:::

Create and Configure a LogarithmicAxis
--------------------------------------

To create and configure a LogarithmicAxis, use the following code: 

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./LogarithmicAxis/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./LogarithmicAxis/demo.ts start=region_B_start end=region_B_end
 
    ```
 
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./LogarithmicAxis/demo" />

Configuration Options for Log Axis
----------------------------------

### labelFormat property

When using logarithmicAxis and the labelFormat [ENumericFormat.Scientific:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/enumericformat.html), the logBase of the axis will be used as the base for the label. This is NOT the case for [ENumericFormat.Exponential:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/enumericformat.html) which is always base 10.

```ts
const logAxis = new LogarithmicAxis(wasmContext, {
    // Format with Scientific notation e.g. 1x10^3
    labelFormat: ENumericFormat.Scientific,
    labelPrecision: 2,
    minorsPerMajor: 10,
  });
```

### Plotting Negative Numbers

LogarithmicAxis cannot show both positive and negative numbers on the same axis, so if your data is negative you need to set isNegative on the axis.  If you need to show positive and negative log data, you need to split it into positive and negative sets and plot them on seperate [vertically stacked axes](/docs/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout).

### Minor Tick Mode

By default, Major gridlines are spaced logarithmically, and Minor gridlines are spaced linearly between them. If your visible range is extremely large, you may want to switch to logarithmic spacing for minor gridlines, which you can do with the [LogarithmicAxis.minorTickMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/logarithmicaxis.html#minortickmode) property which is an [ELogarithmicMinorTickMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/elogarithmicmajortickmode.html) which can be Logarithmic, Linear or Auto

Auto mode means it switches from linear to Logarithmic when the visible range is such that the first linear minor tick would be more than 70% of the major tick

### Major Tick Mode - Financial Log Charts

For financial charts you often want base 2, with a relatively small range, but you don't want your tick labels to be powers of 2. In this case set [LogarithmicAxis.majorTickMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/logarithmicaxis.html#majortickmode) to [ELogarithmicMajorTickMode.RoundNumbers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/elogarithmicmajortickmode.html). This will give you labels with nice round numbers, at the expense of gridlines that are not exactly equally spaced.

### LabelFormat

**labelFormat: [ENumericFormat.SignificantFigures:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/enumericformat.html)** is also helpful as it retains precision for very small values, while not resulting in unnecessary decimal places for large values.

Worked Example - LogAxis Configuration Options
----------------------------------------------

Here's a worked example that combines some of the techniques above.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./LogarithmicAxisConfiguration/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./LogarithmicAxisConfiguration/demo.ts start=region_B_start end=region_B_end
 
    ```
 
</CodeSnippetBlock>

This produces something like this.  If you want even more control over the tick values and gridlines see [Axis Ticks](/docs/2d-charts/axis-api/axis-tick-label-interval/gridline-and-label-spacing-interval).

<LiveDocSnippet maxWidth={"100%"} name="./LogarithmicAxisConfiguration/demo" />

#### See Also

- [Gridline and Label Spacing (Interval)](/docs/2d-charts/axis-api/axis-tick-label-interval/gridline-and-label-spacing-interval)
- [Vertically Stacked Axis Layout](/docs/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout)
