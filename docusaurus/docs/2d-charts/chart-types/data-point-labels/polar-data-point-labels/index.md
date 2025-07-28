---
sidebar_position: 7
---

# Polar Data Point Labels

:::tip
Before reading this article, we recommend you read the [DataLabels API Overview](/2d-charts/chart-types/data-point-labels/data-labels-api-overview) to understand the basics of how DataLabels work.
:::

Polar Data Labels allow per data-point text labels to be drawn on series, or arbitrary text labels at `x`, `y` positions on the chart, which for polar charts are conceptually "radius" and "angle". 

There are no real differences between polar and cartesian data labels.

## Adding Data Labels

You can configure data labels for almost any series by setting a valid style on the [dataLabels property:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ibaselinerenderableseriesoptions.html#datalabels) in the series options:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers {44-54} file=./demo.ts start=region_A_start end=region_A_end
    ```
    ```ts showLineNumbers {22-32} file=./demo.ts start=region_B_start end=region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet />

#### See Also

- [DataLabels API Overview](/2d-charts/chart-types/data-point-labels/data-labels-api-overview)
- [Polar Data Labels Example](https://stagingdemo2.scichart.com/demo/iframe/polar-line-chart)