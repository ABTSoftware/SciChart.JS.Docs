---
sidebar_position: 6
---

# VerticalLineAnnotation

The [VerticalLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html) allows to draw a **vertical line** between Y1, Y2 coordinates at X1.

<CenteredImageWrapper
    src="images/Annotations_VerticalLineAnnotation.png"
/>

Declaring a VerticalLineAnnotation in code
------------------------------------------

The following code will declare a [VerticalLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html) and add it to the chart.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {14,25} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {7,20} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

Changing Label Position or Label Value
--------------------------------------

The label may be placed on the line, or on the axis. Placemement of the label is controlled by the [VerticalLineAnnotation.labelPlacement:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#labelplacement) property, which expects an [ELabelPlacement:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/elabelplacement.html) enum.

Valid settings are `Axis`, `Bottom`, `BottomLeft`, `BottomRight`, `Top`, `TopLeft`, `TopRight`, `Left` and `Right`.

For example, setting **labelPlacement** to `ELabelPlacement.TopRight`:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {5,16} showLineNumbers file=./LabelPlacement/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {9,22} showLineNumbers file=./LabelPlacement/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Results in the label being placed on the top right of the line.

<LiveDocSnippet name="./LabelPlacement/demo" />

:::tip
Labels on VerticalLineAnnotations may be placed on the `Axis`, or at `Bottom`, `BottomLeft`, `BottomRight`, `Top`, `TopLeft`, `TopRight`, `Left` or `Right` of the line.
:::

VerticalAlignment Stretch and Partially Drawn Lines
---------------------------------------------------

[VerticalLineAnnotations:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html) may be drawn to stretch vertically across the viewport, or to a specific Y-value. To truncate a VerticalLineAnnotation simply specify a y1 coordinate.

For example, the two options are shown below in code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {19,28-29} showLineNumbers file=./AnnotationStretch/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {13,24-25} showLineNumbers file=./AnnotationStretch/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Result in this output:

<LiveDocSnippet name="./AnnotationStretch/demo" />

Styling the VerticalLineAnnotation
----------------------------------

The following properties can be set to style the [VerticalLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html):

| **Property** | **Description** |
|--------------|-----------------|
| [labelPlacement:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#labelplacement) | An enumeration defining where the vertical line label is placed. Default is on axis. |
| [labelValue:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#labelvalue) | The label value. By default this will equal the x1 value with text formatting applied by the axis. However it can be overridden to any string |
| [showLabel:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#showlabel) | When true, a label is shown |
| [stroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#stroke) | The stroke color of the vertical line |
| [strokeDashArray:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#strokedasharray) | Gets or sets the strokeDashArray for the LineAnnotation |
| [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#strokethickness) | The stroke thickness of the vertical line |
| [axisLabelFill:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#axislabelfill) | The box fill color for the axis label |
| [axisLabelStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#axislabelstroke) | The text-color for the axis label |
| [axisFontFamily:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#axisfontfamily) | The font family for the axis label text |
| [axisFontSize:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#axisfontsize) | The font size for the axis label text |

#### See Also

* [The Annotations API Overview](/2d-charts/annotations-api/annotations-api-overview)
* [The HorizontalLineAnnotation](/2d-charts/annotations-api/horizontal-line-annotation)
* [The LineAnnotation](/2d-charts/annotations-api/line-annotation)