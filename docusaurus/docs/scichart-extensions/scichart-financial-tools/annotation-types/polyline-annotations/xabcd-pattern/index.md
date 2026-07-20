---
sidebar_position: 2
sidebar_label: XABCD pattern
---

# XABCD Pattern

An XABCD pattern can be represented with a five-point [PolyLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/polylineannotation.html). The polyline stores the turning points in order, while point labels name the pattern anchors.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {14,24,37-43,50} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Use [placementPointCount:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/polylineannotation.html#placementpointcount) when the same pattern should be placed interactively.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo-placement" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {1,5,7,12,19} showLineNumbers file=./demo-placement.ts start=#region_A_start end=#region_A_end
    ``` 
</CodeSnippetBlock>

:::note
It goes without saying that the XABCD pattern is just an example of a n-point pattern that can be represented with a `PolyLineAnnotation`. You can use the same approach to create custom patterns with any number of points, labels, and segments. 

E.g. the popular ABCD pattern can be implemented with `PolyLineAnnotation` with labels: `["A", "B", "C", "D"]` and `placementPointCount: 4`.
::: 

#### See Also

- [Polyline annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotations/)
- [PolyLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotations/polyline-annotation/)
- [Placement and Editing](/scichart-extensions/scichart-financial-tools/modifiers/placement-and-editing/)
- [Elliott patterns](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotations/elliott-patterns/)
