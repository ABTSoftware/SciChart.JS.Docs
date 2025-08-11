---
sidebar_position: 4
---

# PolarMouseWheelZoomModifier

The [PolarMouseWheelZoomModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmousewheelzoommodifier.html) is special a modifier that allows users to interact with the polar chart in 2 major ways: 

## 1. Zooming in and out, using `EActionType.Zoom` (default)

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {9} showLineNumbers file=./demo.ts start=region_A_start end=region_A_end
    ```
    ```ts {40} showLineNumbers file=./demo.ts start=region_B_start end=region_B_end
    ```
</CodeSnippetBlock>

This will result in the following behavior:

<LiveDocSnippet name="./demo" />

## 2. Panning / Spinning the chart, with `EActionType.Pan`

<CodeSnippetBlock labels={["TS"]}>
    ```ts {9} showLineNumbers file=./demo-pan.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

Which will result in this:

<LiveDocSnippet name="./demo-pan" />

- use whichever configuration you prefer, depending on the desired interaction with the polar chart.

#### See Also:

* [What is the ChartModifier API?](/2d-charts/chart-modifier-api/chart-modifier-api-overview)