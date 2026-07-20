---
sidebar_position: 12
sidebar_label: Pitchfork
---

# PitchforkAnnotation

[PitchforkAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchforkannotation.html) draws Andrews' Pitchfork from three points: handle, shoulder A and shoulder B. It supports optional full-width and half-width zones.

<LiveDocSnippet maxWidth={"100%"} includeFinTools name="./demo" />

<CodeSnippetBlock labels={["TS"]}>
    ```ts {2,16} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Pitchfork annotations inherit multi-point labels for handle, shoulder and axis callouts.

:::tip
- `showFullWidthZone` and `showHalfWidthZone` let you control whether the outer and inner pitchfork zones are visible.
- `fullWidthZoneFill` / `fullWidthZoneStroke` and `halfWidthZoneFill` / `halfWidthZoneStroke` can be tuned independently if you want the zones to read differently.
- `strokeDashArray` is useful when you want the fork lines to feel more like guides than hard trend lines.
:::

#### See Also

- [ChannelAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/channel-annotations/)
- [PitchfanAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/pitchfan-annotation/)
- [SchiffPitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/schiff-pitchfork-annotation/)
- [ModifiedSchiffPitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/modified-schiff-pitchfork-annotation/)
- [InsidePitchforkAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/pitchfork-annotations/inside-pitchfork-annotation/)
- [FibonacciRetracementAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/retracement/)
- [ExtendedLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/trend-line-annotations/extended-line-annotation/)
- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
