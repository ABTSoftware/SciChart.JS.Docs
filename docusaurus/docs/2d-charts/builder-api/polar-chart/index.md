---
sidebar_position: 4
---

# ✅ Creating a Polar Chart

SciChart provides a powerful API for creating various types of charts, including **Polar Charts**.

The [buildChart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#chartbuilder.buildchart) function can be used to build both 2D Charts, Pie Charts, **2D Polar Charts** & 3D Charts, so the returned object type will differ depending on the chart type.

## Using [buildChart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#chartbuilder.buildchart) to create a Polar Chart

<CodeSnippetBlock labels={["TS"]}>
    ```ts {12,13} showLineNumbers file=./demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

## Using [build2DPolarChart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/functions/build2DPolarChart.html) to explicitly create a Polar Chart:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {11} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Both of these methods will result in this output:

<LiveDocSnippet name="./demo" />

:::note
The options that the polar chart builder accepts are the same as the 2D surface, and can be seen here [ISciChart2DDefinition:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iscichart2ddefinition.html), but you must choose options with `Polar` in their name.
:::

#### See Also

* [Intro to the Builder API](/docs/2d-charts/builder-api/builder-api-overview)
* [Working with Data](/docs/2d-charts/builder-api/working-with-data)