---
sidebar_position: 3
---

# ✅ Custom LabelProviders: Dynamic Dates on Zoom

:::tip
Customisation in SciChart.js can go a level deeper than built-in label formatting by creating a custom labelprovider class.

In this page we're going to show a worked example of how we can create a custom label provider to handle dynamic date formatting on zoom.
:::

To create a custom labelprovider to handle dynamic dates, first a class which inherits one of the [LabelProvider classes listed here](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview/index.md) and override [formatLabel](https://www.scichart.com/documentation/js/current/typedoc/classes/labelproviderbase2d.html#formatlabel) or [formatCursorLabel](https://www.scichart.com/documentation/js/current/typedoc/classes/labelproviderbase2d.html#formatcursorlabel).

Inside the **formatLabel** function, **parentAxis.visibleRange** can be accessed to determine the visibleRange or zoom level of the axis.

Here we can provide some dynamic formatting of labels depending on the zoom level.

<CodeSnippetBlock labels={["TS"]}>

    ```ts showLineNumbers file=./LabelProviderClass/demo.ts start=region_A_start end=region_A_end
 
    ```
 
</CodeSnippetBlock>

Next, apply the custom LabelProvider to an axis as follows:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./LabelProviderClass/demo.ts start=region_B_start end=region_B_end
 
    ```
    ```ts showLineNumbers file=./LabelProviderClass/demo.ts start=region_C_start end=region_C_end
 
    ```
</CodeSnippetBlock>

This results in the following output:

*   At default zoom level the format DD/MM/YYYY is chosen
*   Zooming in and format changes to HH:mm
*   Zooming further still and format changes to HH:mm:ss
*   Once the axis range is less than a few minutes, label format changes to show minutes, seconds and milliseconds

<LiveDocSnippet maxWidth={"100%"} name="./LabelProviderClass/demo" />

:::tip
Zoom IN on the above example using the mousewheel to see dynamic label formatting
:::