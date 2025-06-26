---
sidebar_position: 4
---

# ✅ TextAnnotation

<MinimizedImageAndTextHeader 
    imgSrc="/images/Annotations_TextAnnotation.png"
>
The [TextAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html) type draws a text label at the x1,y1 location where coordinates are data-values. The TextAnnotation supports [text](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#text), [fontSize](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#fontsize), [fontWeight](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#fontweight), [fontFamily](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#fontfamily) and [textColor](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#textcolor) properties.

Coordinates may be relative, absolute or data-value based, to both [xCoordinateMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#xcoordinatemode), [yCoordinateMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#ycoordinatemode) properties as values of [ECoordinateMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html) enum.

</MinimizedImageAndTextHeader>

Declaring a TextAnnotation in code
----------------------------------

The following code will declare a number of [TextAnnotations](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html) and add them to the chart.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {21,27,35,42,49} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {7,16,25,35,45} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

Positioning a TextAnnotation with horizontal/vertical Anchor Points
-------------------------------------------------------------------

A [TextAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html) only requires coordinates x1,y1 to be set. The alignment of the text around this coordinate is controlled by the [horizontalAnchorPoint](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#horizontalanchorpoint), [verticalAnchorPoint](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#verticalanchorpoint) properties.

<CenteredImageWrapper 
    src="/images/Annotations_AnchorPoints.png"
>
    Above: Set the [horizontalAnchorPoint](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#horizontalanchorpoint), and [verticalAnchorPoint](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#verticalanchorpoint) property to determine which anchor point (horizontal: **left**, **center**, **right** or **vertical**: **top**, **center**, **bottom**) the x1, y1 coordinate is bound to.
</CenteredImageWrapper>

Aligning a LineAnnotation with x/yCoordinateModes
-------------------------------------------------

Like other annotation types, the [TextAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html) can be positioned relatively or absolute using [xCoordinateMode](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#xcoordinatemode), [yCoordinateMode](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#ycoordinatemode) properties.

For example, to create a watermark in the centre of the chart, use this code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {14,15} showLineNumbers file=./CoordinateMode/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {14,15} showLineNumbers file=./CoordinateMode/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./CoordinateMode/demo" />

Polar Charts with TextAnnotation
--------------------------------

To add a [TextAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html) to a Polar chart, use the same exact code, just change the surface and axes types. The TextAnnotation will be positioned in polar coordinates.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {16,31} showLineNumbers file=./Polar/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {11,14} showLineNumbers file=./Polar/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following:

<LiveDocSnippet name="./Polar/demo" />

#### See Also

* [The Annotations API Overview](../annotations-api-overview/)