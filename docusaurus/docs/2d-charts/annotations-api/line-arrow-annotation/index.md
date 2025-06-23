---
sidebar_position: 7
---

# ✅ LineArrowAnnotation

The [LineArrowAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/linearrowannotation.html) class extends [LineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/lineannotation.html) and adds an optional arrowhead at each line endpoint. Use it to annotate charts with directional indicators.

## Create a Line Arrow Annotation

The following code will declare 2 [LineArrowAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/linearrowannotation.html)s and add them to the chart.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {20,28} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {9,17} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Resulting in the following output:

<LiveDocSnippet name="./demo" />

In the code above:

- We create 2 instances of [LineArrowAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/linearrowannotation.html) with different arrowhead styles.
- The first annotation has an arrowhead at the end, while the second has 2 arrowheads, 1 at both ends.
- Also, the first annotation's arrowhead will scale with the zooming, while the second will not.
- In case you want to use editable annotations using [isEditable:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/linearrowannotation.html#iseditable): `true`, you can use the [dragPoints:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/linearrowannotation.html#dragpoints) property to pass an array of valid drag points. See [EDraggingGripPoint:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/edragginggrippoint.html) for more details.

### Unique Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| arrowHeadPosition | [EArrowHeadPosition:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/earrowheadposition.html) | *End* | Where to place the arrowhead(s) -> Start, End, Start&End |
| isArrowHeadScalable | boolean | *false* | Whether to scale the arrowhead size with zooming. |
| arrowStyle | [IArrowStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iarrowstyle.html) | - | Arrowhead style options. |
| onArrowHeadSizeChanged | [TArrowheadSizeChangedCallback:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#tarrowheadsizechangedcallback) | *undefined* | Callback to modify arrowhead size based on angle. |

All other properties are inherited from [LineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/lineannotation.html) & [AnnotationBase:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/annotationbase.html) and work as expected.

:::tip
Use `headDepth: 0` for simple line arrows without filled heads. 
:::

:::tip
Set `isArrowHeadScalable: true` for annotations that maintain relative size during zooming.
:::