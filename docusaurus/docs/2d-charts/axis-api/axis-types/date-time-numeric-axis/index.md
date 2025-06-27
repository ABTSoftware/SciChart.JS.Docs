---
sidebar_position: 3
---

# ✅ The DateTimeNumericAxis

The [DateTimeNumericAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) is a Value axis (subclass of [NumericAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html)) and has some extra formatting options and features for handling date formatting.

:::info
Learn more about the [commonalities between axis here](/docs/2d-charts/axis-api/axis-types/common-axis-base-type).
:::

Create and Configure a DateTimeNumericAxis
------------------------------------------

Dates in SciChart.js are treated as Linux timestamps divided by 1000 (to get seconds from milliseconds). e.g. to create a DateTimeNumericAxis in SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./DateTimeNumericAxis/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./DateTimeNumericAxis/demo.ts start=region_B_start end=region_B_end
 
    ```
 
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./DateTimeNumericAxis/demo" />

Two fundamental differences of DateTimeNumericAxis and NumericAxis are that a [SmartDateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html) is applied to the labelProvider property and [DateTimeDeltaCalculator:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimedeltacalculator.html) is applied to the deltaCalculator property. This allows for more intuitive date formatting & handling when zooming the chart. Try it!

Date / Label Formatting Options
-------------------------------

### Configuring Default behaviour with the SmartDateLabelProvider

You'll notice above the Date formatting is quite intuitive out of the box, and dynamically changes on zoom. The more zoomed in you are, the finer grained the date labels e.g. Month/Day becomes Day/Hour, and Day/Hour becomes Hour/Minute. This behaviour is provided by the [SmartDateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html) which is assigned to the [Axis.LabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#labelprovider) property by default.

This behaviour is pretty fixed, however some options of the [SmartDateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html) are below:

:::info
The properties on SmartDateLabelProvider can be found in the [TypeDoc API documentation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html).

*   [cursorNumericFormat:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html#cursornumericformat)
*   [cursorPrecision:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html#cursorprecision)
*   [formatCursorLabel:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html#formatcursorlabel)
*   [formatLabel:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html#formatlabel)
*   [lineSpacing:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html#linespacing)
*   [numericFormat:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html#numericformat)
*   [postfix:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html#postfix)
*   [precision:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html#precision)
*   [prefix:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html#prefix)
*   [rotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html#rotation)
*   [showWiderDateOnFirstLabel:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html#showwiderdateonfirstlabel)
:::

### Further customising the DateTimeNumericAxis Label Output

There isn't much option at the moment for customising the [DateTimeNumericAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) label formatting when using the default [SmartDateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html), however, it is possible to substitute the simpler [DateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datelabelprovider.html) which doesn't have dynamic updating labels on zoom, and to specify your own formats.

It is also possible to create a custom labelprovider class and have complete control over axis label output. More on that in the [Custom Label Providers documentation page](/docs/2d-charts/axis-api/axis-labels/custom-label-providers-dynamic-dates-on-zoom).

Here's a quick example:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./DateTimeNumericAxisLabelFormatting/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./DateTimeNumericAxisLabelFormatting/demo.ts start=region_B_start end=region_B_end
 
    ```
 
</CodeSnippetBlock>

This code example above shows how you can swap the default [SmartDateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html) on the [DateTimeNumericAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) for a simpler [DateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datelabelprovider.html), then subscribe to axis.visibleRangeChanged to dynamically change the labelformat.

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./DateTimeNumericAxisLabelFormatting/demo" />

:::info
Other options are available, such as implementing a [custom LabelProvider](/docs/2d-charts/axis-api/axis-labels/custom-label-providers-dynamic-dates-on-zoom). Overriding [LabelProvider.formatLabel:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/labelprovider.html#formatlabel) and formatCursorLabel allows for complete control over axis labels.
:::