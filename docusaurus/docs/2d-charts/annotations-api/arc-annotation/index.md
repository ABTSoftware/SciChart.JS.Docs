---
sidebar_position: 11
---

# ArcAnnotation

The [ArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html) is used to draw a filled arc sector or a curved line on a 2D Cartesian [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html). Unlike the [PolarArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html) which uses angles, the [ArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html) is defined by two data points (`x1, y1` and `x2, y2`) and a `height` property, which controls the arc's curvature.

## Create an Arc Annotation

The following code demonstrates how to declare a filled arc segment and a curved line using the [ArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html) and add them to a chart.

<CodeSnippetBlock labels={["TS"]}>
    ```ts {18,31,38} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./demo" />

In the code above:
- Two instances of [ArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html) are created and added to a [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html).
- The first annotation is a **filled arc segment**. It is defined by its start/end points and a positive [height:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html#height) for upward curvature. The [innerRadius:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html#innerradius) property makes it a segment rather than a full sector.
- The second annotation is an **arc line**. This is achieved by setting [isLineMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html#islinemode): `true`. Its negative `height` causes it to curve downwards.
- Both annotations are made editable by setting [isEditable:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html#iseditable): `true`.

### Unique Properties

The [ArcAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html) has several specific properties for its configuration:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| [height:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html#height) | `number` | 0 | The height of the arc from the center of the baseline. Negative values produce an arc with opposite curvature. |
| [innerRadius:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html#innerradius) | `number` | 0 | A value from 0 to 1 that defines the inner radius as a proportion of the outer radius. Ignored when `isLineMode` is true. |
| [isLineMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html#islinemode) | `boolean` | `false` | If `true`, the annotation renders as a curved line. If `false`, it renders as a filled sector. |

:::tip
Use a negative [height:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html#height) value to flip the curvature of the arc.
:::

:::tip
To draw a full sector that extends to the baseline (like a slice of a pie), set the [innerRadius:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/arcannotation.html#innerradius) property to `0`.
:::

#### See Also

* [PolarArcAnnotation](/2d-charts/annotations-api/polar-arc-annotation) - The equivalent annotation for Polar Surfaces.
* [The Annotations API Overview](/2d-charts/annotations-api/annotations-api-overview)