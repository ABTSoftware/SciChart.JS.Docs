---
sidebar_position: 9
sidebar_label: Stop-loss / take-profit
---

# StopLossTakeProfitAnnotation

[StopLossTakeProfitAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/stoplosstakeprofitannotation.html) draws a stop-loss or take-profit zone from two points. The second point chooses the take-profit or stop-loss color.

<LiveDocSnippet maxWidth={"100%"} name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {17,24,31,32,35,36,40} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Use [takeProfitColor:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/stoplosstakeprofitannotation.html#takeprofitcolor), [stopLossColor:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/stoplosstakeprofitannotation.html#stoplosscolor), [fillOpacity:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/stoplosstakeprofitannotation.html#fillopacity) and line stroke options to style the zone. The annotation also inherits editable grips and point labels from the multi-point annotation base. Set `annotationsGripsStroke` and `annotationsGripsFill` when the grip stroke needs more contrast against the chart theme.

#### See Also

- [MeasureAnnotation](/scichart-extensions/trading-annotations/measure-annotation/)
- [FibonacciRetracementAnnotation](/scichart-extensions/trading-annotations/fibonacci-retracement/)
- [Multi-Point Labels Deep Dive](/scichart-extensions/trading-annotations/multipoint-annotations/)
- [AnnotationHoverModifier](/2d-charts/annotations-api/annotation-hover/)
