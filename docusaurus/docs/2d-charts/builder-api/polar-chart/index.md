---
sidebar_position: 4
---

# Creating a Polar Chart

SciChart provides a powerful API for creating various types of charts, including **Polar Charts**.

Use [build2DPolarChart:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/index.html#build2dpolarchart) to create a Polar Chart:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {10} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet name="./demo" />

:::note
The options that the polar chart builder accepts are the same as the 2D surface, and can be seen here [ISciChart2DDefinition:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/iscichart2ddefinition.html), but you must choose options with `Polar` in their name.
:::

#### See Also

* [Intro to the Builder API](/2d-charts/builder-api/builder-api-overview/)
* [Working with Data](/2d-charts/builder-api/working-with-data/)
