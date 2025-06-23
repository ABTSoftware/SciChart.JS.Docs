---
sidebar_position: 2
---

# ✅ BoxAnnotation

<MinimizedImageAndTextHeader 
    imgSrc="/images/Annotations_BoxAnnotation.PNG"
>
    The [BoxAnnotation type:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/boxannotation.html) draws a rectangle at x1, y1, x2, y2 where coordinates are data-values. The BoxAnnotation supports [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/boxannotation.html#strokethickness), [stroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/boxannotation.html#stroke) and [fill:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/boxannotation.html#fill) properties.

    Coordinates may be relative, absolute or data-value based, to both [xCoordinateMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#xcoordinatemode), [yCoordinateMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#ycoordinatemode) properties as values of [ECoordinateMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html) enum.
</MinimizedImageAndTextHeader>

Declaring a BoxAnnotation in code
---------------------------------

The following code will declare a number of [BoxAnnotations:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/boxannotation.html) and add them to the chart.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {23,32,41} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {16,40} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

 This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

Aligning a BoxAnnotation with x/yCoordinateModes
------------------------------------------------

To position a [BoxAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/boxannotation.html) so that it stretches horizontally or vertically across the viewport, use x/yCoordinateMode. e.g. the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {11,14,28,31} showLineNumbers file=./CoordinateMode/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {16,19,29,32} showLineNumbers file=./CoordinateMode/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

results in the following output:

<LiveDocSnippet name="./CoordinateMode/demo" />

#### See Also

* [The Annotations API Overview](../annotations-api-overview/)
* [The Arc Annotation](../arc-annotation/)