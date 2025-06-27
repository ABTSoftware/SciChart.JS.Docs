---
sidebar_position: 4
---

# ✅ PolarZoomExtentsModifier

SciChart.js provides the ability to Zoom Extents the polar chart (zoom to fit data) by double-clicking the chart area with the [PolarZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html), available out of the box.

Here is how to define the [PolarZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html) in your code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {6} showLineNumbers file=./demo.ts start=region_A_start end=region_A_end 
    ```
    ```ts {51} showLineNumbers file=./demo.ts start=region_B_start end=region_B_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet name="./demo" />

## Zoom to a Preset Range
If you would like the double-click to zoom to some preset range, rather than the data range, you can set `zoomExtentsRange` on the axes. In addition, if you are setting an initial visibleRange on an axis and would like zoomExtents to return to this range, you can just set `zoomExtentsToInitialRange` true, which will set `zoomExtentsRange` to the `visibleRange` passed in.

Besides common features which are inherited from the base [ZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/zoomextentsmodifier.html) class, the [PolarZoomExtentsModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html) has many more polar-specific features, such as:

| Property | Type | Description |
| --- | --- | --- |
| [xStartAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html#xstartangle) | number | The start angle for the X-axis in the polar chart. |
| [yStartAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html#ystartangle) | number | The start angle for the Y-axis in the polar chart. |
| [totalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html#totalangle) | number | The total angle of the polar chart, which defines the range of angles covered by the chart. |
| [lengthScale:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html#lengthscale) | number | The scale factor for the radian axis |
| [innerRadius:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html#innerradius) | number | The inner radius of the polar chart, which defines the minimum distance from the center to the edge of the chart. |
| [centerPoint:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html#centerpoint) | [Point:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/point.html) | Center point of the polar chart, which defines the origin of the polar coordinates. |
| [resetStartAngles:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html#resetstartangles) | boolean | Whether to reset the start angles for both the X and Y axes to their initial values. |
| [resetTotalAngle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html#resettotalangle) | boolean | Whether to reset the total angle to its initial value. |
| [resetRanges:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html#resetranges) | boolean | Whether to reset the ranges for both the radial and angular axes to their initial values. |
| [resetLengthScale:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html#resetlengthscale) | boolean | Whether to reset the length scale to its initial value. |
| [resetCenterPoint:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html#resetcenterpoint) | boolean | Whether to reset the center point to its initial value. |
| [resetInnerRadius:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html#resetinnerradius) | boolean | Whether to reset the inner radius to its initial value. |

See all at [IPolarZoomExtentsModifierOptions:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarzoomextentsmodifieroptions.html).

#### See Also

* [What is the ChartModifier API?](/docs/2d-charts/chart-modifier-api/chart-modifier-api-overview)
* [ZoomExtentsModifier](/docs/2d-charts/chart-modifier-api/zooming-and-panning/zoom-extents-modifier)