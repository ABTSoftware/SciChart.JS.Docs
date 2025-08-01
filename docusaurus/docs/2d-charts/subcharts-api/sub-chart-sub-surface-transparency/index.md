---
sidebar_position: 3
---

# SubChart Sub Surface Transparency

The SubCharts API allows you to place nested charts (charts within charts). In the previous example [What is the SubCharts API](/2d-charts/subcharts-api/subcharts-api-overview) we covered how to add SubCharts to a SciChartSurface, and also how to position them in [SubCharts Positioning](/2d-charts/subcharts-api/sub-charts-positioning).

In this example we're going to show the difference between [SciChartSubSurface.isTransparent:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html#istransparent) true and false.

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
```ts {43,65} showLineNumbers file=./Transparency/demo.ts start=region_A_start end=region_A_end
```
```ts {44,70} showLineNumbers file=./Transparency/demo.ts start=region_B_start end=region_B_end
```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./Transparency/demo" />

The example shows that the Line Series on the parent chart will be visible underneath the sub-surface when `isTransparent = true`. This behavior could be changed using [I2DSubSurfaceOptions.isTransparent:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/i2dsubsurfaceoptions.html#istransparent) option passed to [SciChartSubSurface.createSubSurface():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsubsurface.html#createsubsurface) or via the [SciChartSubSurface.isTransparent:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html#istransparent) property.

#### See Also

* [SubCharts Positioning](/2d-charts/subcharts-api/sub-charts-positioning)
* [SubCharts Html Container](/2d-charts/subcharts-api/sub-charts-html-container)
* [Worked Example: Using SubCharts to create a Large Dashboard](/2d-charts/subcharts-api/example-using-sub-charts-to-create-large-dashboard)
