---
sidebar_position: 7
---

# HorizontalLineAnnotation

The HorizontalLineAnnotation allows to draw a **horizontal line** between X1, X2 coordinates at Y1.

<CenteredImageWrapper
    src="images/Annotations_HorizontalLineAnnotation.png"
/>

Declaring a HorizontalLineAnnotation in code
--------------------------------------------

The following code will declare a [HorizontalLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/horizontallineannotation.html) and add it to the chart.

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

The label may be placed on the line, or on the axis. Placemement of the label is controlled by the [HorizontalLineAnnotation.labelPlacement:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/horizontallineannotation.html#labelplacement) property, which expects an [ELabelPlacement:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/elabelplacement.html) enum.

Valid settings are `Axis`, `Bottom`, `BottomLeft`, `BottomRight`, `Top`, `TopLeft`, `TopRight`, `Left` and `Right`.

For example, setting **labelPlacement** to `ELabelPlacement.TopLeft`:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {5,16} showLineNumbers file=./LabelPlacement/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {9,22} showLineNumbers file=./LabelPlacement/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Results in the label being placed on the top left of the line.

<LiveDocSnippet name="./LabelPlacement/demo" />

:::tip
Labels on [HorizontalLineAnnotations:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/horizontallineannotation.html) may be placed on the `Axis`, or at `Bottom`, `BottomLeft`, `BottomRight`, `Top`, `TopLeft`, `TopRight`, `Left` or `Right` of the line.
:::

HorizontalAlignment Stretch and Partially Drawn Lines
-----------------------------------------------------

[HorizontalLineAnnotations:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/horizontallineannotation.html) may be drawn to stretch vertically across the viewport, or to a specific Y-value. To truncate a VerticalLineAnnotation simply specify a y1 coordinate.

For example, the two options are shown below in code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {19,28-29} showLineNumbers file=./AnnotationStretch/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {13,24-25} showLineNumbers file=./AnnotationStretch/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Result in this output.

<LiveDocSnippet name="./AnnotationStretch/demo" />

Styling the HorizontalLineAnnotation
------------------------------------

The following properties can be set to style the [HorizontalLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/horizontallineannotation.html):

| **Property** | **Description** |
|--------------|-----------------|
| [labelPlacement:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#labelplacement) | An enumeration defining where the vertical line label is placed. Default is on axis. |
| [labelValue:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#labelvalue) | The label value. By default this will equal the x1 value with text formatting applied by the axis. However it can be overridden to any string |
| [showLabel:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#showlabel) | When true, a label is shown |
| [stroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#stroke) | The stroke color of the vertical line |
| [strokeDashArray:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#strokedasharray) | Defines the dash pattern for the stroke |
| [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#strokethickness) | The stroke thickness of the vertical line |
| [axisLabelFill:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#axislabelfill) | The box fill color for the axis label |
| [axisLabelStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#axislabelstroke) | The text-color for the axis label |
| [axisFontFamily:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#axisfontfamily) | The font family for the axis label text |
| [axisFontSize:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticallineannotation.html#axisfontsize) | The font size for the axis label text |

#### See Also

* [The Annotations API Overview](/docs/2d-charts/annotations-api/annotations-api-overview)
* [The VerticalLineAnnotation](/docs/2d-charts/annotations-api/vertical-line-annotation)
* [The LineAnnotation](/docs/2d-charts/annotations-api/line-annotation)