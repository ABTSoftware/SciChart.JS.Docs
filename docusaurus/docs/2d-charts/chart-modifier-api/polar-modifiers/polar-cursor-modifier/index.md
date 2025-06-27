---
sidebar_position: 2
---

# ✅ PolarCursorModifier

The [PolarCursorModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcursormodifier.html) is a modifier that provides a crosshair cursor on a polar chart. It allows users to hover over data points and see their values, enhancing the interactivity of the chart.


## Adding a PolarCursorModifier to a Chart

Similarly to the [CursorModifier](/docs/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview) for a Cartesian 2D chart, a [PolarCursorModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcursormodifier.html) can be added to the `sciChartSurface.chartModifiers` collection of a [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) to enable crosshair behavior. For example:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
```ts {9} showLineNumbers file=./demo.ts start=region_A_start end=region_A_end
```
```ts {37} showLineNumbers file=./demo.ts start=region_B_start end=region_B_end
```
</CodeSnippetBlock>

This results in the following behavior:

<LiveDocSnippet name="./demo" />

#### See Also:

* [What is the ChartModifier API?](/docs/2d-charts/chart-modifier-api/chart-modifier-api-overview)
* [CursorModifier](/docs/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview)