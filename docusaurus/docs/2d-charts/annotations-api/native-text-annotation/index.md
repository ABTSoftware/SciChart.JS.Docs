---
sidebar_position: 9
---

# NativeTextAnnotation

[NativeTextAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/nativetextannotation.html) works almost exactly like the normal [TextAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/textannotation.html) but instead of using SVG, it draws using the native text api that is new in SciChart.JS v3 or greater. This allows for some significant benefits:

*   **Performance:** you can draw hundreds or even thousands of text labels without significant slowdown.
*   **Multi-line text is much easier**.  Separate lines with the newline (/n) character, and adjust [lineSpacing:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/nativetextannotation.html#linespacing) and [multiLineAlignment:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/nativetextannotation.html#multilinealignment) if needed.
*   **Rotated text is much easier:**  If you try and rotate SVG text, you will often find it gets clipped by its own viewbox.  NativeText does not.  You can control the angle via [NativeTextAnnotation.rotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/nativetextannotation.html#rotation). You can control center of rotation by overriding [getRotationCenter:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/nativetextannotation.html#getrotationcenter) if need be.
*   **Text wrapping is much easier:** [NativeTextAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/nativetextannotation.html) can wrap to the chart area, or to the width you set for it.  If you make the annotation editable you can see the wrapping change as you resize.
*   **Allows Text Scaling:** Using the [NativeTextAnnotation.scale:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/nativetextannotation.html#scale) property text can be drawn at different sizes without creating a new font. From v6 this text is rendered with Slug (GPU Bezier) text, so scaled and rotated glyphs are mathematically exact at any scale and angle rather than sampled from a texture atlas.

:::info New in v6
2D native text renders through Slug (GPU Bezier) text rather than a Signed Distance Field texture atlas. Nothing on this page changes - **rotation**, **scale**, multi-line and wrapping all work exactly as described - but glyphs stay crisp at any size and angle, and changing fontSize at runtime no longer rebuilds an atlas. See [Native Text Api](/2d-charts/miscellaneous-apis/native-text-api/#slug-gpu-bezier-text-in-2d).
:::

:::warning
There are also some limitations compared to svg text:
:::

*   Font style and font weight are not supported. Fonts other than the packaged default face must be `ttf` and either be hosted on your server or registered if coming from the internet. See [Native Text Font Loading](/2d-charts/miscellaneous-apis/native-text-api/)

## Creating many variants of [NativeTextAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/nativetextannotation.html):

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {21,30-33,42,52,65,69} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {17,30,39,43} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

Polar Charts with NativeTextAnnotation
--------------------------------

To add a [NativeTextAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/nativetextannotation.html) to a Polar chart, use the same exact code, just change the surface and axes types. The NativeTextAnnotation will be positioned in polar coordinates.

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {15,30} showLineNumbers file=./Polar/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {11,14} showLineNumbers file=./Polar/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following:

<LiveDocSnippet name="./Polar/demo" />

#### See Also

* [Native Text Api](/2d-charts/miscellaneous-apis/native-text-api/)
* [Adding DataLabels to a Chart Series](/2d-charts/chart-types/data-point-labels/data-labels-api-overview/)
