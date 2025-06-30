---
sidebar_position: 4
---

# ✅ Axis3D Gridline and Label Spacing (Interval)   

Axis 3D Gridline and Label Spacing obeys the same rules as SciChart 2D. Here are the key principles.

*   Each axis has a [axisCore.MajorDelta:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#majordelta) and [axisCore.MinorDelta:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#minordelta), which specify the interval of major gridlines / labels and minor gridlines respectively. These are normally calculated automatically. They can be set manually along with [axis.autoTicks:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase3d.html#autoticks) = false to achieve user-defined intervals.
*   You can also set hints such as [axis.maxAutoTicks:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase3d.html#maxautoticks) or [axis.minorsPerMajor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase3d.html#minorspermajor) to adjust the number of gridlines using the automatic built-in intervals.
*   Or, if you want fine-grained control over gridline spacing and to apply custom or dynamic rules, you can create a [TickProvider plugin](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview) to do it

:::tip
Background reading: Read the [Axis Ticks - Gridline and Label Spacing](/docs/2d-charts/axis-api/axis-tick-label-interval/gridline-and-label-spacing-interval/index.md) and the advanced article [Axis Ticks - Programmatic Gridline Spacing](/docs/2d-charts/axis-api/axis-tick-label-interval/tick-provider-api/index.md) to learn more about this powerful API.
:::

Simple Example of spacing Gridlines
-----------------------------------

Here is a code sample that demonstrates the three ways to space gridlines.

### Automatic Spacing

Automatic gridline and label spacing (default) can be adjusted by setting the [axis.maxAutoTicks:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase3d.html#maxautoticks) and [axis.minorsPerMajor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase3d.html#minorspermajor) properties.

<CodeSnippetBlock labels={["TS"]}>
```ts showLineNumbers file=./GridlineLabelSpacing/demo.ts start=region_A_start end=region_A_end
```
</CodeSnippetBlock>

### Manual Spacing

To manually specify gridline and label intervals, set [axis.autoTicks:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase3d.html#autoticks) = false then set [axisCore.MajorDelta:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#majordelta) and [axisCore.MinorDelta:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#minordelta).

<CodeSnippetBlock labels={["TS"]}>
```ts showLineNumbers file=./GridlineLabelSpacing/demo.ts start=region_B_start end=region_B_end
```
</CodeSnippetBlock>

### Custom Spacing

Finally, to specify custom spacing or irregular spacing, you can create a class which inherits from NumericTickProvider and attach to the axis like this.

<CodeSnippetBlock labels={["TS"]}>
```ts showLineNumbers file=./GridlineLabelSpacing/demo.ts start=region_C_start end=region_C_end
```
</CodeSnippetBlock>

Putting this all together, we've created an example to show you all three spacing methods in one 3D chart.

<LiveDocSnippet maxWidth={"100%"} name="./GridlineLabelSpacing/demo" htmlPath="./GridlineLabelSpacing/demo.html" cssPath="./GridlineLabelSpacing/demo.css" />