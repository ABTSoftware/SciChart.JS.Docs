---
sidebar_position: 6
sidebar_label: Candle Counter
title: "CandleCounter: Visible, Loaded and Total Candles | SciTrader.js"
description: "Show how many candles a SciTrader.js chart has on screen, loaded and in total with CandleCounter, countCandles and observeCandleCounts."
keywords: ["SciTrader", "SciTrader.js", "CandleCounter", "countCandles", "observeCandleCounts"]
---

# Candle Counter

`CandleCounter` shows the price pane's candle counts as "visible / loaded / ~total": the candles on screen, the candles loaded, and an estimate of every candle since the symbol was listed. Unknown counts show as "?". It updates as candles load and the user pans or zooms, at most once a frame, and writes its own text, so in React the page around it doesn't re-render as the chart moves.

It is made for the info area at the start of a pane's control bar ([Layout](/financial-charts/layout/#your-own-content-in-the-control-bar)):

```tsx
<SciFinanceChartView
    config={config}
    onInit={setChart}
    paneInfo={(paneId) =>
        paneId === PaneId.DEFAULT.value && chart ? <CandleCounter chart={chart.financeApi} /> : null
    }
/>
```

In plain TypeScript, `CandleCounter.create(financeChartPanel.getPaneInfoElement(PaneId.DEFAULT.value), { chart: financeChartPanel.financeApi })`. For the numbers alone, `countCandles(chart)` counts once, and `observeCandleCounts(chart, onChange)` reports them as they change and returns a function that stops it. The look is `.st-candle-counter`.

<CenteredImageWrapper src={require("../../_examples/layoutState_Loading/screenshot.png").default} title="Loading States and Pane Info" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../../_examples/layoutState_Loading/vanilla.ts
    ```
    ```tsx showLineNumbers file=../../_examples/layoutState_Loading/react.tsx
    ```
</CodeSnippetBlock>
