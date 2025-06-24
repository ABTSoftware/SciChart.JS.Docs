---
sidebar_position: 4
---

# ✅ ZoomExtentsModifier 

SciChart.js provides the ability to Zoom Extents the entire chart (zoom to fit data) by double-clicking the chart area with the [ZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoomextentsmodifier.html), available out of the box.

Besides common features which are inherited from the [ChartModifierBase](../../common-features/) class, the [ZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoomextentsmodifier.html) allows animated zooming via the [isAnimated:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoomextentsmodifier.html#isanimated), [animationDuration:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoomextentsmodifier.html#animationduration) and [easingFunction:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoomextentsmodifier.html#easingfunction) properties.

Adding a ZoomExtentsModifier to a Chart
---------------------------------------

A [ZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoomextentsmodifier.html) can be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#chartmodifiers) collection to enable zoom to fit behavior. 

For example:

<CodeSnippetBlock labels={["ts"]}>
   ```ts {4} showLineNumbers
   import { ZoomExtentsModifier, easing } from "scichart";

   // Add Zoom Extents behavior
   const zoomExtentsModifier = new ZoomExtentsModifier({ 
      isAnimated: true,
      animationDuration: 400,
      easingFunction: easing.outExpo
   });
   sciChartSurface.chartModifiers.add(zoomExtentsModifier);
      ```
</CodeSnippetBlock>

This results in the following behavior when double-clicking the chart:

<CenteredImageWrapper
   src="/images/ChartModifiers_ZoomExtents_24Fps.gif"
/>

Zoom to a Preset Range
----------------------

If you would like the double-click to zoom to some preset range, rather than the data range, you can set [zoomExtentsRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxes.html#zoomextentsrange) on the axes.  In addition, if you are setting an initial visibleRange on an axis and would like zoomExtents to return to this range, you can just set [zoomExtentsToInitialRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxes.html#zoomextentstoinitialrange) true, which will set [zoomExtentsRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxes.html#zoomextentsrange) to the visibleRange passed in.

If you just want to have some space around your data, set [growBy:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html#growby) instead.

#### See Also

* [What is the ChartModifier API](../../chart-modifier-api-overview/)
* [Common ChartModifiers Features](../../common-features/)