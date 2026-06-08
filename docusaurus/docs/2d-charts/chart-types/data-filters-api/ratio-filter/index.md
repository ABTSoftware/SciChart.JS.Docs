---
sidebar_position: 5
---

# Ratio Filter

The XyRatioFilter returns a series where each point is the ratio of the original series and the given divisor DataSeries.

The original series and divisor series can be different types, and there is a **divisorField** option to specify the field to use from the divisorSeries.

Calculating a Ratio of Two Chart Series
---------------------------------------

To create a ratio filter and apply to a chart, use the code below:

<CodeSnippetBlock labels={["Ratio filter example"]}>
    ```ts showLineNumbers file=./RatioFilter/demo.ts start=#region_A_start end=#region_A_end
    ```

</CodeSnippetBlock>

This produces the following chart. We also added a LegendModifier to make it clear which line is which:

<LiveDocSnippet name="./RatioFilter/demo" />

The ratio filter requires that the original series and divisor series have the same number of elements.

When you add or remove data, the filter will not update until both series have been updated. It does not matter which series you update first.

#### See Also

* [What is the Filters API](/2d-charts/chart-types/data-filters-api/data-filters-api-overview/)
* [Scale Offset Filters](/2d-charts/chart-types/data-filters-api/scale-offset-filters/)
* [Linear Trendline Filter](/2d-charts/chart-types/data-filters-api/linear-trendline-filter/)
* [Creating a Custom Filter](/2d-charts/chart-types/data-filters-api/custom-filter/)
* [Moving Average Filter](/2d-charts/chart-types/data-filters-api/moving-average-filter/)
