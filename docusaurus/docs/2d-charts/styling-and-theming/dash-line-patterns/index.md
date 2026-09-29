---
sidebar_position: 5
---

# Series Styling - Dash Line Patterns

In SciChart.js v1.3 and above, we have introduced a property to let you style dashed or dotted lines on certain series.

:::tip
We have an example in our SciChart.js Examples Suite which shows how to do this - the [Dashed Line Chart example](https://www.scichart.com/demo/javascript-dashed-line-chart).
:::

<CenteredImageWrapper
    src="/images/Styling_DashedLineStylingExampleJavascript.png"
/>

_**Above:**_ [_The Dashed Line Styling example_](https://www.scichart.com/demo/javascript-dashed-line-chart) _in the SciChart.js demo_

How to set a Stroke Dash
------------------------

Certain series have a **StrokeDashArray** property which allows you to define the line pen as having a dotted or dashed pattern. A variety of dash patterns are possible in SciChart.js using this API.

A StrokeDashArray is an array which defines a dot-dash pattern. For example creating a series with a strokeDashArray as follows:

```ts
// The StrokeDashArray property

const series = new FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 2,
            strokeDashArray: [10, 3]
        });
```

Results in the following output:

<CenteredImageWrapper
    src="/images/Styling_DashedLine_10_3.png"
/>

The dash pattern can be configured to provide dots, dashes and more. For example:

#### strokeDashArray: \[2,2\]

<CenteredImageWrapper
    src="/images/Styling_DashedLine_2_2.png"
/>

#### strokeDashArray: \[5,5\]

<CenteredImageWrapper
    src="/images/Styling_DashedLine_5_5.png"
/>

#### strokeDashArray: \[10,25\]

<CenteredImageWrapper
    src="/images/Styling_DashedLine_10_25.png"
/>

Which Series support StrokeDashArray?
-------------------------------------

All the line-based series in SciChart.js support StrokeDashArray for dashed or dotted lines. These are:

*   [FastLineRenderableSeries.strokeDashArray:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html#strokedasharray)
*   [FastMountainRenderableSeries.strokeDashArray:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastmountainrenderableseries.html#strokedasharray)
*   [FastBandRenderableSeries.strokeDashArray:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html#strokedasharray)
*   SplineLineRenderableSeries
*   SplineMountainRenderableSeries
*   SplineBandRenderableSeries

Chart Parts which support StrokeDashArray
-----------------------------------------

The strokeDashArray property also exists on AxisBase2D.majorGridLineStyle, AxisBase2D.minorGridLineStyle, allowing you to apply stroke dash / dot styling to axis gridlines.

For more information, see the related article [Axis Styling - Title, Labels, Gridlines and Axis Bands](/2d-charts/axis-api/axis-styling/title-labels-gridlines-axis-band-style/index.md).

![Custom styling or themeing of JavaScript chart parts](/images/Axis_styling.png)
