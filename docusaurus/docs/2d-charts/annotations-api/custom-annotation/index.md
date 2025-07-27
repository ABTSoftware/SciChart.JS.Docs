---
sidebar_position: 5
---

# CustomAnnotation

<MinimizedImageAndTextHeader 
    imgSrc="images/Annotations_CustomAnnotation.png"
>
    The [CustomAnnotation type:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/customannotation.html) draws a custom shape defined by SVG at the x1, y1 location where coordinates are data-values.

    Coordinates may be relative, absolute or data-value based, to both [xCoordinateMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#xcoordinatemode), [yCoordinateMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#ycoordinatemode) properties as values of [ECoordinateMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html) enum.
</MinimizedImageAndTextHeader>

Declaring a CustomAnnotation in code
------------------------------------

The following code will declare a a [CustomAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/customannotation.html) with a Rocket icon rendered in SVG. This is added to the chart at specific X and Y locations.

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {31,34} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {17,23} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

Notice that the SVG string is [W3C compliant SVG](https://www.w3.org/Graphics/SVG/). Lots of sources online have SVG icons that you can download, or you can create your own vector graphics using a tool like Figma, Inkscape or Adobe Illustrator.

Positioning a CustomAnnotation with horizontal/vertical Anchor Points
---------------------------------------------------------------------

A [CustomAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/customannotation.html) only requires coordinates x1, y1 to be set. The alignment of the annotation around this coordinate is controlled by the [horizontalAnchorPoint:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#horizontalanchorpoint), [verticalAnchorPoint:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#verticalanchorpoint) properties.

<CenteredImageWrapper
    src="/images/Annotations_AnchorPoints.png"
    width="50%"
>
    Above: Set the [horizontalAnchorPoint:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#horizontalanchorpoint), and [verticalAnchorPoint:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#verticalanchorpoint) property to determine which anchor point (horizontal: left, center, right or vertical: top, center, bottom) the x1, y2 coordinate is bound to.
</CenteredImageWrapper>

Aligning a CustomAnnotation with x/yCoordinateModes
---------------------------------------------------

Like other annotation types, the [CustomAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/customannotation.html) can be positioned relatively or absolute using xCoordinateMode, yCoordinateMode property.

For example. The [TradeMarkers demo in the SciChart.js Examples Suite](https://scichart.com/demo/javascript-stock-chart-buy-sell-markers) places a number of custom annotations for buy/sell markers, but also places news bullet annotations at the bottom of the chart using yCoordinateMode. 

<CodeSnippetBlock labels={["TS"]}>
    ```ts {44,62,78} showLineNumbers file=./CoordinateMode/demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./CoordinateMode/demo" />

#### See Also

* [The Annotations API Overview](/2d-charts/annotations-api/annotations-api-overview)