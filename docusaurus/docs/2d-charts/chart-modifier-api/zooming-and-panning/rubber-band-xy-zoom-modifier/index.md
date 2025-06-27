---
sidebar_position: 2
---

# ✅ RubberBandXyZoomModifier

SciChart.js provides the ability to Drag an area to zoom the chart (known as Rubber-band zoom) using the [RubberBandXyZoomModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rubberbandxyzoommodifier.html), available out of the box.

Besides common features which are inherited from the [ChartModifierBase](/docs/2d-charts/chart-modifier-api/common-features) class, the [RubberBandXyZoomModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rubberbandxyzoommodifier.html) allows animated zooming via the [isAnimated:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoomextentsmodifier.html#isanimated), [animationDuration:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoomextentsmodifier.html#animationduration) and [easingFunction:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoomextentsmodifier.html#easingfunction) properties. The drag rectangle can be styled via the [fill:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rubberbandxyzoommodifier.html#fill), [stroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rubberbandxyzoommodifier.html#stroke) and [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rubberbandxyzoommodifier.html#strokethickness) properties.

Adding a RubberBandXyZoomModifier to a Chart
--------------------------------------------

A [RubberBandXyZoomModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rubberbandxyzoommodifier.html) can be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#chartmodifiers) collection to enable zoom to fit behavior. For example:

<CodeSnippetBlock labels={["TS"]}>
   ```ts {4} showLineNumbers
   import { RubberBandXyZoomModifier, easing } from "scichart";

   // Add Zoom Extents behavior
   const rubberBandXyZoomModifier = new RubberBandXyZoomModifier({ 
      isAnimated: true,
      animationDuration: 400,
      easingFunction: easing.outExpo,
      fill: "#FFFFFF33",
      stroke: "#FFFFFF77",
      strokeThickness: 1,
   });
   sciChartSurface.chartModifiers.add(rubberBandXyZoomModifier);
      ```
</CodeSnippetBlock>

This results in the following behavior when dragging the chart:

<CenteredImageWrapper
   src="/images/ChartModifiers_RubberBandZoom_24Fps.gif"
/>

#### See Also

* [What is the ChartModifier API](/docs/2d-charts/chart-modifier-api/chart-modifier-api-overview)
* [Common ChartModifiers Features](/docs/2d-charts/chart-modifier-api/common-features)