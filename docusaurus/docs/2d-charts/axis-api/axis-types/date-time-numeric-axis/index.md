---
sidebar_position: 3
---

# The DateTimeNumericAxis

The [DateTimeNumericAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/datetimenumericaxis.html) is a Value axis (subclass of [NumericAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/numericaxis.html)) and has some extra formatting options and features for handling date formatting.

:::info
Learn more about the [commonalities between axis here](/2d-charts/axis-api/axis-types/common-axis-base-type/).
:::

Create and Configure a DateTimeNumericAxis
------------------------------------------

Dates in SciChart.js are treated as Linux timestamps divided by 1000 (to get seconds from milliseconds). e.g. to create a DateTimeNumericAxis in SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>

    ```ts showLineNumbers file=./DateTimeNumericAxis/demo.ts start=region_A_start end=region_A_end

    ```

    ```ts showLineNumbers file=./DateTimeNumericAxis/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./DateTimeNumericAxis/demo" />

Two fundamental differences of DateTimeNumericAxis and NumericAxis are that a [SmartDateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html) is applied to the labelProvider property and [DateTimeDeltaCalculator:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/datetimedeltacalculator.html) is applied to the deltaCalculator property. This allows for more intuitive date formatting & handling when zooming the chart. Try it!

Date / Label Formatting Options
-------------------------------

### Configuring Default behaviour with the SmartDateLabelProvider

You'll notice above the Date formatting is quite intuitive out of the box, and dynamically changes on zoom. The more zoomed in you are, the finer grained the date labels e.g. Month/Day becomes Day/Hour, and Day/Hour becomes Hour/Minute. This behaviour is provided by the [SmartDateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html) which is assigned to the [Axis.LabelProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/axisbase2d.html#labelprovider) property by default.

### High Precision & Advanced Label Formatting

**New in SciChart.js** is the ability to handle High Precision dates (Microseconds, Nanoseconds) and finer control over how dates are composed.

By setting the [datePrecision:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#dateprecision) property, you can instruct the axis to treat data values as [Nanoseconds:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/edateprecision.html#nanoseconds), [Microseconds:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/edateprecision.html#microseconds), [Milliseconds:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/edateprecision.html#milliseconds) or [Seconds:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/edateprecision.html#seconds).

The default is [Seconds:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/edateprecision.html#seconds), which means 1 x-axis unit == `1s`. But if we're setting it to [Nanoseconds:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/edateprecision.html#nanoseconds), then 1 x-axis unit == `1ns`, which is `1 / 1,000,000,000s`.

The [SmartDateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#highprecisionlabelmode) automatically adjusts to show suffixes (e.g., `50ns`, `20µs`) or fractional values based on the `highPrecisionLabelMode` you set.

You can also control the verbose nature of labels using flags like `showSecondsOnPreciseDate`, `showSecondsOnWideDate` or `splitWideDateWithComma`.

<CodeSnippetBlock labels={["TS"]}>

```ts
import { EDatePrecision, EHighPrecisionLabelMode } from "scichart";

// ... 
const xAxis = new DateTimeNumericAxis(wasmContext, {
    axisTitle: "Time (Nanoseconds)",
    
    // 1. Define input precision (Default is Seconds)
    // Options: Seconds, Milliseconds, Microseconds, Nanoseconds
    datePrecision: EDatePrecision.Nanoseconds, 

    // 2. Define how sub-millisecond labels are formatted
    // Options: Suffix (50ns), Fractional (0.000000050), Scientific (5e-8)
    highPrecisionLabelMode: EHighPrecisionLabelMode.Suffix,

    // 3. Other Formatting Flags
    // Toggles seconds on the 'Wide' context label (e.g. "Jan 01, 12:00" vs "Jan 01, 12:00:05")
    showSecondsOnWideDate: false,
    // Toggles seconds on the 'Precise' tick label (e.g. "59s500ms" vs "500ms")
    showSecondsOnPreciseDate: true,
    // Adds a comma to wide labels (e.g. "Jan 01, 2025" instead of "Jan 01 2025")
    splitWideDateWithComma: true,
});
// ...
```

</CodeSnippetBlock>

Here's a demo showcasing it:

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/high-precision-date-axis"
    title="High Precision Date Axis Example"
/>

:::info
Key properties for High Precision and Advanced Formatting:

* [datePrecision:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#dateprecision) - Defines the precision of input values (e.g. `EDatePrecision.Nanoseconds`).
* [highPrecisionLabelMode:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#highprecisionlabelmode) - Controls formatting of precise labels (`Suffix`, `Fractional`, `Scientific`).
* [showSecondsOnWideDate:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#showsecondsonwidedate) - Whether to show seconds on the context (wide) label.
* [showSecondsOnPreciseDate:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#showsecondsonprecisedate) - Whether to repeat the seconds value on precise sub-second labels.
* [splitWideDateWithComma:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#splitwidedatewithcomma) - Toggles the comma separator in date strings.
* [labelThresholds:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#labelthresholds) - Advanced: Allows overriding the zoom levels at which formatters switch (e.g., switch to Minutes earlier or later).
:::

### Further customising the DateTimeNumericAxis Label Output

:::info
The properties on SmartDateLabelProvider can be found in the [TypeDoc API documentation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html).

*   [cursorNumericFormat:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#cursornumericformat)
*   [cursorPrecision:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#cursorprecision)
*   [formatCursorLabel:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#formatcursorlabel)
*   [formatLabel:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#formatlabel)
*   [lineSpacing:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#linespacing)
*   [numericFormat:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#numericformat)
*   [postfix:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#postfix)
*   [precision:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#precision)
*   [prefix:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#prefix)
*   [rotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#rotation)
*   [showWiderDateOnFirstLabel:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html#showwiderdateonfirstlabel)
:::

### Further customising the DateTimeNumericAxis Label Output

There isn't much option at the moment for customising the [DateTimeNumericAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/datetimenumericaxis.html) label formatting when using the default [SmartDateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html), however, it is possible to substitute the simpler [DateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/datelabelprovider.html) which doesn't have dynamic updating labels on zoom, and to specify your own formats.

It is also possible to create a custom labelprovider class and have complete control over axis label output. More on that in the [Custom Label Providers documentation page](/2d-charts/axis-api/axis-labels/custom-label-providers-dynamic-dates-on-zoom/).

Here's a quick example:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>

    ```ts showLineNumbers file=./DateTimeNumericAxisLabelFormatting/demo.ts start=region_A_start end=region_A_end

    ```

    ```ts showLineNumbers file=./DateTimeNumericAxisLabelFormatting/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

This code example above shows how you can swap the default [SmartDateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/smartdatelabelprovider.html) on the [DateTimeNumericAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/datetimenumericaxis.html) for a simpler [DateLabelProvider:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/datelabelprovider.html), then subscribe to axis.visibleRangeChanged to dynamically change the labelformat.

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./DateTimeNumericAxisLabelFormatting/demo" />

:::info
Other options are available, such as implementing a [custom LabelProvider](/2d-charts/axis-api/axis-labels/custom-label-providers-dynamic-dates-on-zoom/). Overriding [LabelProvider.formatLabel:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/labelprovider.html#formatlabel) and formatCursorLabel allows for complete control over axis labels.
:::
