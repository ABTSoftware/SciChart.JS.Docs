---
sidebar_position: 15
---

# PolarArcAnnotation

The [PolarArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html) is used to draw a filled sector or an arc line on a [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html). It is defined by a center point, inner and outer radii, and start and end angles. This annotation is ideal for highlighting specific angular or radial regions in polar charts.

## Create a Polar Arc Annotation

The following code demonstrates how to declare a filled sector and a line arc using [PolarArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html) and add them to a polar surface.

<CodeSnippetBlock labels={["TS"]}>
    ```ts {32,43,45} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./demo" />

In the code above:
- Two instances of [PolarArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html) are created and added to a [SciChartPolarSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html).
- The first annotation is a **filled sector**. It is defined by start/end angles (`x1`, `x2`) and outer/inner radii (`y1`, `y2`).
- The second annotation is an **arc line**. This is achieved by setting [isLineMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html#islinemode): `true`, which causes the annotation to render as a single line at the `y1` radius, ignoring the `y2` property.
- Both annotations are editable and can be dragged or resized by the user if [isEditable:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html#iseditable): `true` is set.

### Unique Properties

The [PolarArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html) has several specific properties for its configuration:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| [centerX:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html#centerx) | `number` | 0 | The X coordinate of the arc's center point. |
| [centerY:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html#centery) | `number` | 0 | The Y coordinate of the arc's center point. |
| [x1:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html#x1) | `number` | - | The start angle of the annotation. |
| [x2:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html#x2) | `number` | - | The end angle of the annotation. |
| [y1:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html#y1) | `number` | - | The outer radius of the annotation. |
| [y2:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html#y2) | `number` | - | The inner radius of the annotation. This property is ignored when `isLineMode` is true. |
| [isLineMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html#islinemode) | `boolean` | `false` | If `true`, the annotation renders as a line at the `y1` radius. If `false`, it renders as a filled sector between the `y1` and `y2` radii. |

:::tip
To draw a simple arc line instead of a filled sector, set the `isLineMode` property to `true`. This simplifies the annotation to only require `x1`, `x2`, and `y1` for its shape.
:::

:::tip
To draw a full pie-slice that starts from the center, set the inner radius `y2` to `0`.
:::

#### See Also

* [ArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html) - this a similar concept, but for 2D Cartesian surfaces.