---
sidebar_position: 13
sidebar_label: Series value modifier
---

# SeriesValueModifier

[SeriesValueModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/seriesvaluemodifier.html) adds y-axis marker annotations for each included renderable series. For line series it follows the y-value; for OHLC and candlestick series it follows the close value and uses the up / down candle colors for the marker background.

<LiveDocSnippet maxWidth={"100%"} name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {15,67-70} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Use [lastYMode:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/seriesvaluemodifier.html#lastymode) to switch between the final data point and the last value visible in the viewport. `ELastYMode.LastVisible` is useful for financial charts where the user pans historical data and expects the axis markers to describe the visible candle. `ELastYMode.Last` pins the marker to the final point in the series.

Use [annotationTextColor:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/seriesvaluemodifier.html#annotationtextcolor) when your chart theme needs a different label color. The modifier creates and owns [AxisMarkerAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/axismarkerannotation.html) instances and removes them when the modifier or series is detached.

#### See Also

- [MultiPointAnnotationEditorModifier](/scichart-extensions/scichart-financial-tools/modifiers/multipoint-annotation-editor-modifier/)
- [Placement and Editing](/scichart-extensions/scichart-financial-tools/modifiers/placement-and-editing/)
- [AxisMarkerAnnotation](/2d-charts/annotations-api/axis-marker-annotation/axis-marker-annotation-overview/)
