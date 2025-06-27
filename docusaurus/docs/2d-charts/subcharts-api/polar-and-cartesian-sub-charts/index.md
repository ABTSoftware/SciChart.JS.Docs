---
sidebar_position: 5
---

# ✅ Combining Polar and Cartesian Charts

It is possible to combine both Polar and Cartesian chart. You will find the example below.

<CodeSnippetBlock labels={["TS"]}>
```ts {24-26,39,62,50-51,92-93} showLineNumbers file=./Basic/demo.ts
```
</CodeSnippetBlock>

First we create the root chart. It could be either [Cartesian:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) or [Polar:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html). In our example we are using the Cartesian one.

Next we create a Cartesian SubChart by using [SciChartSubSurface.createSubSurface():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsubsurface.html#createsubsurface) static method.

Finally we add a Polar SubChart by using [SciChartSubSurface.createSubSurface():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsubsurface.html#createsubsurface).

This gives us a parent chart and two sub-charts each taking 1/4 of the parent chart area, with Cartesian sub-chart at the bottom-left and Polar sub-chart at the bottom-right. 

<LiveDocSnippet maxWidth={"100%"} name="./Basic/demo" />

If you do mouse wheel or double click on a sub-chart you will see that they are fully interactive. This is thank to [MouseWheelZoomModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/mousewheelzoommodifier.html), [ZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/zoomextentsmodifier.html), [PolarMouseWheelZoomModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmousewheelzoommodifier.html) and [PolarZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html) chart modifiers.

:::tip
If you need information on positioning or transparency please refer these documents [SubChart Positioning](/docs/2d-charts/subcharts-api/sub-charts-positioning) and [SubChart Surface Transparency](/docs/2d-charts/subcharts-api/sub-chart-sub-surface-transparency).
:::
