---
sidebar_position: 3
---

# ✅ Creating a 3D Chart

SciChart provides a powerful API for creating various types of charts, including **3D Charts**.

The [buildChart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/functions/buildchart.html) function can be used to build both 2D Charts, Pie Charts, 2D Polar Charts & **3D Charts**, so the returned object type will differ depending on the chart type.

## Using [buildChart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/functions/buildchart.html) to create a Pie Chart

<CodeSnippetBlock labels={["TS"]}>
    ```ts {3,14,15} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock> 

## Using [build3DChart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/functions/build3dchart.html) to explicitly create a 3D Chart.

<CodeSnippetBlock labels={["TS"]}>
    ```ts {3,13} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Both of these methods will result in this output:

<LiveDocSnippet name="./demo" />


#### See Also

* [Intro to the Builder API](/docs/2d-charts/builder-api/builder-api-overview)
* [Working with Data](/docs/2d-charts/builder-api/working-with-data)