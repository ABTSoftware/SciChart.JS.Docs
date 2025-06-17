---
sidebar_position: 4
---

# ✅ Creating a Polar Chart

## Creating a simple Polar Chart with SciChart.js's Builder API

To create a simple Polar Chart using SciChart.js's Builder API, you can use the following code snippet:

```ts showLineNumbers file=./Basic/demo.js start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./Basic/demo" />

In the code above:

- To create a Polar Surface Chart, you can either use:
    - The [chartBuilder.buildChart({}):blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#buildchart) method with type: [ESciChartSurfaceType.Polar2D:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/escichartsurfacetype.html#polar2d)
    - The [chartBuilder.build2DPolarChart({}):blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#chartbuilder.build2dpolarchart) which does not need a type parameter.
- The options that the polar chart builder accepts are the same as the 2D surface, and can be seen here [ISciChart2DDefinition:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iscichart2ddefinition.html), but you must choose options with `Polar` in their name.