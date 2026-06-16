---
sidebar_position: 7
sidebar_label: Extended line annotation
---

# ExtendedLineAnnotation

[ExtendedLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/extendedlineannotation.html) is a two-point trend line. Use [extendStart:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/extendedlineannotation.html#extendstart) and/or [extendEnd:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/extendedlineannotation.html#extendend) to project the line beyond its endpoints.

### Basic example:

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo-simple" />


<CodeSnippetBlock labels={["TS"]}>
    ```ts {8,11,18,20-23,25,26} showLineNumbers file=./demo-simple.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

--- 

### Complex example with labels and hover modifiers:

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {2,13,53} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Use inherited multi-point labels for endpoint, segment or axis values.

#### See Also

- [ChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [FibonacciRetracementAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/retracement/)
- [PitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/pitchfork-annotation/)
- [PitchfanAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/pitchfan-annotation/)
- [AnnotationHoverModifier](/2d-charts/annotations-api/annotation-hover/)
