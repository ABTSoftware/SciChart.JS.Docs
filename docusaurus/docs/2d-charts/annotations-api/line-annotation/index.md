---
sidebar_position: 3
---

# ✅ LineAnnotation

<MinimizedImageAndTextHeader 
    imgSrc="/images/Annotations_LineAnnotation.png"
>
The [LineAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineannotation.html) draws a line of variable thickness from x1, y1 to x2, y2 where coordinates are data-values. The LineAnnotation supports [strokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineannotation.html#strokethickness), [stroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineannotation.html#stroke) properties.

Coordinates may be relative, absolute or data-value based, to both [xCoordinateMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#xcoordinatemode), [yCoordinateMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#ycoordinatemode) properties as values of [ECoordinateMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html) enum.
</MinimizedImageAndTextHeader>

Declaring a LineAnnotation in code
----------------------------------

The following code will declare a number of [LineAnnotations:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineannotation.html) and add them to the chart.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {26,34} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {16,27} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

Aligning a LineAnnotation with x/yCoordinateModes
-------------------------------------------------

To position a [LineAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineannotation.html) so that it stretches horizontally or vertically across the viewport, use x/yCoordinateMode. e.g. the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {13,17,32,36} showLineNumbers file=./CoordinateMode/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {19,22,40,43} showLineNumbers file=./CoordinateMode/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

results in this output:

<LiveDocSnippet name="./CoordinateMode/demo" />

Polar Charts with LineAnnotation
--------------------------------------------

To add a [LineAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineannotation.html) to a Polar chart, use the same exact code, just change the surface and axes types. The LineAnnotation will be positioned in polar coordinates.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {13,17,32,36} showLineNumbers file=./Polar/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {19,22,40,43} showLineNumbers file=./Polar/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following:

<LiveDocSnippet name="./Polar/demo" />

#### See Also

* [The Annotations API Overview](/docs/2d-charts/annotations-api/annotations-api-overview)