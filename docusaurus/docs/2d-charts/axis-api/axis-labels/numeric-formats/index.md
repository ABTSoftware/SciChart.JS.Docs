---
sidebar_position: 2
---

# Axis Labels - The ENumericFormat Enum

In the previous article we gave you an overview of the LabelProvider feature and how this is used to format labels on axis.

You'll notice in the many axis label code samples, labels are formatted by passing in [ENumericFormat:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/enumericformat.html) to the constructor options of the axis. What's actually happening here is parameters are being passed to the [AxisCore.labelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#labelprovider).

[NumericAxis](/docs/2d-charts/axis-api/axis-types/numeric-axis/index.md) is quite versatile, it can format decimals with label prefix and postfix to any number of decimal places or significant figures. It can even format numbers as dates (assuming number is a unix stamp). You can find out all the options of the [ENumericFormat:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/enumericformat.html) enum below, or on our [TypeDoc:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/enumericformat.html).


```ts
// ENumericFormat
// import {ENumericFormat} from "scichart";
export enum ENumericFormat {
    /** No format, return the string representation unchanged */
    NoFormat = "NoFormat",
    /** Format to a specified number of decimal places */
    Decimal = "Decimal",
    /** Format to a specified number of significant figures */
    SignificantFigures = "SignificantFigures",
    /** Format as a date in format DD/MM/YYYY */
    Date_DDMMYYYY = "Date_DDMMYYYY",
    /** Format as a date in format DD/MM/YY */
    Date_DDMMYY = "Date_DDMMYY",
    /** Format as a date in format DD/MM HH:MM */
    Date_DDMMHHMM = "Date_DDMMHHMM",
    /** Format as a date in format DD/MM */
    Date_DDMM = "Date_DDMM",
    /** Format as a date in format HH:MM */
    Date_HHMM = "Date_HHMM",
    /** Format as a date in format HH:MM:SS */
    Date_HHMMSS = "Date_HHMMSS",
    /** Format as a date in format SS.ms */
    Date_SSms = "Date_SSms",
    /**
     * Format using Exponential notation to a specified number of significant figures eg 1.0E0, 1.5E1, 2.7E2
     * Note that this will ALWAYS be base 10, even when used on a Logarithmic axis
     */
    Exponential = "Exponential",
    /**
     * Format using Scientific notation to a specified number of significant figures eg 1.0x10^1, 1.5x10^2, 2.7x10^3
     * On a Logarithmic axis, the base will be the same as the axis logarithmic base
     */
    Scientific = "Scientific",
    /**
     * Engineering notation, eg 12.32K, 1.5M, 2.7G
     * @feature You can pass your custom prefixes as {@link IEngineeringPrefix}
     */
    Engineering = "Engineering"
}
```

Demonstrating the Different ENumericFormats
-------------------------------------------

Below we've created an example that demonstrates four of the [ENumericFormat:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/enumericformat.html) values: **Date\_DDMMYYYY**, **Engineering**, **Scientific** and **Decimal**.

Try to edit the code in the Codepen below and pan the chart to see the effect of different ENumericFormat values.


<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./ENumericFormats/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./ENumericFormats/demo.ts start=region_B_start end=region_B_end
 
    ```
 
</CodeSnippetBlock>
 

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./ENumericFormats/demo" />


:::info
Further enhancement of the NumericAxis labels including custom formatting, string formatting or dynamic formatting can be achieved with the [LabelProvider API](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview/index.md).
:::