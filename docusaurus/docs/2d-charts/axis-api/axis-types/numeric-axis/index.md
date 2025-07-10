---
sidebar_position: 2
---

# The Numeric Axis

The [NumericAxis:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html) is a Value axis and is suitable for X and Y Axis when the data on that axis is numeric (e.g. number in TypeScript). It is not suitable for non-numeric data types.

:::info
Learn more about the [commonalities between axis here](/docs/2d-charts/axis-api/axis-types/common-axis-base-type).
:::

Create and Configure a NumericAxis
----------------------------------

There are lots of options that can be passed to the constructor of a NumericAxis to configure it. Some of these are in the [common AxisBase2D type](/docs/2d-charts/axis-api/axis-types/common-axis-base-type).

To create and configure a NumericAxis, use the following code: 

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./NumericAxis/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./NumericAxis/demo.ts start=region_B_start end=region_B_end
 
    ```
 
</CodeSnippetBlock>
 

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./NumericAxis/demo" />

:::info
Further enhancement of the NumericAxis labels including custom formatting, string formatting or dynamic formatting can be achieved with the [LabelProvider API](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview).

Also see the documentation page on ENumericFormat
:::
