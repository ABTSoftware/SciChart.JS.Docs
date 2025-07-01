---
sidebar_position: 1
---

# ✅ Custom Chart Modifier API

The ChartModifierBase API is one of the most powerful APIs in the SciChart library.

Using this API you can create behaviours which you can attach to a chart to perform custom Zooming, Panning, Annotation & Markers, Legend output and much much more. Any time you want to do something in JavaScript or Typescript code to alter the behaviour of a SciChartSurface you should be thinking about creating a custom modifier to do it.

The ChartModifierBase2D Type
----------------------------

The [ChartModifierBase2D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase2d.html) provides a base class for all of the ChartModifiers within SciChart. All of our built-in modifiers such as [ZoomPanModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html), [RolloverModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifier.html), [YAxisDragModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/yaxisdragmodifier.html) inherit ChartModifierBase2D.

You can create your own ChartModifiers by inheriting this class. For example, this code sample shows how to declare a custom ChartModifier class in JavaScript ES6 or TypeScript.

<CodeSnippetBlock labels={["TypeScript", "JavaScript"]}>
    ```ts {3} showLineNumbers file=./SimpleChartModifierTs.ts
    ```
    ```js {2} showLineNumbers file=./SimpleChartModifierTs.js
    ```
</CodeSnippetBlock>