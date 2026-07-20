---
sidebar_position: 3
sidebar_label: Elliott patterns
---

# Elliott Patterns

:::info
In similar fashion to the XABCD pattern (See [XABCD doc page](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotations/xabcd-pattern/)), every Elliott tool such as: impulse / motive / wave, Single / Double / Triple Corrections (ABC/WXYXZ) patterns CAN be represented with a `PolyLineAnnotation` instance with user defined point counts and labels: `["0", "1", "2", "3", "4", "5"]`. 

Optionally - the 1st point can be left without a label `""` or labeled with `"0"` to keep the wave start unmarked.
:::

For example, an Elliott impulse wave can be drawn as a simple 6-point [PolyLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/polylineannotation.html).

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {14,24,39-47,53,63,73} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Keep the annotation editable so traders can adjust the vertices after placement.

## Other Elliott patterns

This example shows two more variants:

- An Elliott Motive Wave with labels: `["", "A", "B", "C", "D", "E"]`
- An Elliott Triple correction with labels: `["(0)", "(W)", "(X)", "(Y)", "(X)", "(Z)"]`

The important part is to keep in mind that ANY pattern can be drawn with a `PolyLineAnnotation` and the labels can be assigned to any point index. The rest is just a styling choice.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo-other" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {17,42,48} showLineNumbers file=./demo-other.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

## Side-by-Side Elliott Layout

This variant keeps the same `PolyLineAnnotation` recipe but shows two labeled wave structures on the same chart. It is a nice way to compare an impulse wave with a correction wave while keeping the label placement readable.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo-more" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {11,17,26,54,67} showLineNumbers file=./demo-more.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

#### See Also 

- [Polyline annotations overview](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotations/)
- [PolyLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotations/polyline-annotation/)
- [XABCD pattern](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotations/xabcd-pattern/)
