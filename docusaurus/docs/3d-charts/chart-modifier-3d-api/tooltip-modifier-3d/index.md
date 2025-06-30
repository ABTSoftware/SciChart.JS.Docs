---
sidebar_position: 2
---

# ✅ Tooltip Modifier 3D

Tooltips in SciChart.js 3D are performed by the [TooltipModifier3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/tooltipmodifier3d.html). This is a [ChartModifierBase3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartmodifierbase3d.html) derived type which executes on touch over the data point and shows tooltips for the data-points under the mouse.

Declaring a TooltipModifier3D
-----------------------------

Declaring a [TooltipModifier3D:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/tooltipmodifier3d.html) is as simple as adding one to the [SciChart3DSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/orbitmodifier3d.html) property. This can be done as a single modifier, or as part of a group.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {} showLineNumbers file=./Basic/demo.ts start=region_A_start end=region_A_end
```
```html showLineNumbers file=./Basic/demo.html
```
```css showLineNumbers file=./Basic/demo.css
```
</CodeSnippetBlock>

This results in the following behaviour added to the chart.

<LiveDocSnippet maxWidth={"100%"} name="./Basic/demo" htmlPath="./Basic/demo.html" cssPath="./Basic/demo.css" />

Styling the Tooltip Output
--------------------------

### Properties which affect Tooltip style

Some simple properties which affect the tooltip style are:

| Property | Description |
|----------|-------------|
| **isCrosshairVisible** | When true (default), a crosshair is drawn from the hovered datapoint to the far axis wall. |
| **crosshairStroke** | The stroke color as a Hex code of the crosshair line. |
| **crosshairStrokeThickness** | The stroke thickness of the crosshair line. |
| **tooltipContainerBackground** | The background color of the tooltip container as a Hex code. |
| **tooltipLegendOffsetX** / **Y** | Offset in pixels of the tooltip from the hovered datapoint. |
| **tooltipTextStroke** | The text color on the tooltip. |

For further customisation of the tooltip content & container, read on.

### Tooltip Text Formatting

Tooltips obey formatting rules on the Axis. These can be defined by setting [axis.labelProvider.cursorPrecision:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/labelprovider.html), [cursorNumericFormat:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/labelprovider.html#cursornumericformat) or overriding [formatCursorLabel:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/labelprovider.html#formatcursorlabel). For more information on text formatting, see the [LabelProvider documentation](/docs/3d-charts/axis-3d-api/axis-3d-text-label-formatting/index.md).

### Modifying the Tooltip Content

You can modify the content output by tooltip via the **TooltipModifier3D.tooltipDataTemplate** property. This accepts a function with **SeriesInfo3D** and **TooltipSvgAnnotation3D** arguments where you can access data about the series that was hit.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {} showLineNumbers file=./TooltipContent/demo.ts start=region_A_start end=region_A_end
```
```html showLineNumbers file=./TooltipContent/demo.html
```
```css showLineNumbers file=./TooltipContent/demo.css
```
</CodeSnippetBlock>

This results in the following output.

<LiveDocSnippet maxWidth={"100%"} name="./TooltipContent/demo" htmlPath="./TooltipContent/demo.html" cssPath="./TooltipContent/demo.css" />

The arguments to the **tooltipDataTemplate** function are **SeriesInfo3D** and **TooltipSvgAnnotation3D**. You can access any info about the series, parent chart or axis from SeriesInfo3D. Inspect these types in the TypeDoc to see what properties are available.

### Modifying the Tooltip Container

The container of the tooltip can be modified as well. Extending the example above further, we override **TooltipModifier3D.tooltipSvgTemplate** to customize the background/foreground color before rendering the tooltip.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {} showLineNumbers file=./TooltipContainer/demo.ts start=region_A_start end=region_A_end
```
```html showLineNumbers file=./TooltipContainer/demo.html
```
```css showLineNumbers file=./TooltipContainer/demo.css
```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./TooltipContainer/demo" htmlPath="./TooltipContainer/demo.html" cssPath="./TooltipContainer/demo.css" />

Placing the Tooltip as a Separate Legend
----------------------------------------

The tooltip can be placed as a legend in the corner of the chart by using the **TooltipModifier3D.placementDivId** property. This simply changes the location in the HTML Dom where tooltips are placed.

Here's a quick example:

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts {} showLineNumbers file=./Legend/demo.ts start=region_A_start end=region_A_end
```
```html showLineNumbers file=./Legend/demo.html
```
```css showLineNumbers file=./Legend/demo.css
```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./Legend/demo" htmlPath="./Legend/demo.html" cssPath="./Legend/demo.css" />

If you hover over data points you will notice that the tooltips appears in the left top part of the chart.
