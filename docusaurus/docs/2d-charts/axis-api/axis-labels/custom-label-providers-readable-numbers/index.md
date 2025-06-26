---
sidebar_position: 4
---

# ✅ Custom LabelProviders: Readable Numbers

:::tip
Customisation in SciChart.js can go a level deeper than built-in label formatting by creating a custom labelprovider class.

In this page we're going to show a worked example of how we can create a custom label provider to handle formatting of numbers with thousands/millions commas, or to format large numbers such as 1,000 as 1K, 1,000,000 as 1M and 1,000,000,000 as 1Bn
:::

To create a custom labelprovider to handle dynamic dates, first a class which inherits one of the [LabelProvider classes listed here](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview/index.md) and override [formatLabel](https://www.scichart.com/documentation/js/current/typedoc/classes/labelproviderbase2d.html#formatlabel) or [formatCursorLabel](https://www.scichart.com/documentation/js/current/typedoc/classes/labelproviderbase2d.html#formatcursorlabel).

Inside the **formatLabel** function, determine which formatting to apply based on properties and format the label value.

In this example below, we show two ways to format large numeric values in SciChart.js.

### Method 1: K,M,B,T formatting

Large numbers are formatted as follows:

*   1,000 = 1K
*   1,000,000 = 1M
*   1,000,000,000 = 1B
*   1,000,000,000,000 = 1T

Label prefix and postfix, decimal places are supported by passing [ILabel2DOptions](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ilabel2doptions.html) to the constructor of **CustomNumericLabelProvider**, which in turn passes to the base class constructor [NumericLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/numericlabelprovider.html).

### Method 2: Comma formatting

Large numbers are formatted as follows:

*   1000 => 1,000
*   1000000 => 1,000,000
*   1000000000 => 1,000,000,000

etc...

<CodeSnippetBlock labels={["TS"]}>

    ```ts showLineNumbers file=./LabelProviderNumeric/demo.ts start=region_A_start end=region_A_end
 
    ```
 
</CodeSnippetBlock>
 

### Applying the Custom LabelProvider to an Axis

Next, apply the custom LabelProvider to an axis as follows:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>


    ```ts showLineNumbers file=./LabelProviderNumeric/demo.ts start=region_B_start end=region_B_end
 
    ```
 
    ```ts showLineNumbers file=./LabelProviderNumeric/demo.ts start=region_C_start end=region_C_end
 
    ```
</CodeSnippetBlock>

This results in the following output:

*   When the property formatOptions = "Default", default numeric formatting is chosen
*   When the property formatOptions = "Commas", numbers are formatted with comma separators, e.g. 1,000,000
*   When the property formatOptions = "KMBT", large numbers are formatted as 1k, 1M, 1B

<LiveDocSnippet maxWidth={"100%"} name="./LabelProviderNumeric/demo" />

The above example showcases how to apply custom or complex formatting to labels in SciChart.js.

Any formatting (dynamic or static) that you can think of can be applied using the [LabelProvider API](Axis Label Formatting - LabelProvider API.html).

Custom labelproviders can then be set on individual X,Y axis of any type.

####  See Also

[Axis LabelProviders](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview/index.md)
