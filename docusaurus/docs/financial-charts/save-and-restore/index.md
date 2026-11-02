---
sidebar_position: 8
sidebar_label: Saving and Restoring
title: "Saving and Restoring Chart State | SciTrader.js"
description: "Save a SciTrader.js trading chart, including its studies, layout and drawings, to JSON and restore it later."
keywords: ["SciTrader", "SciTrader.js", "save chart state JSON", "SciTrader toJSON"]
---

# Saving and restoring

`toJSON()` returns a chart's state as plain JSON, which you can store anywhere.

```ts
const state = financeChartPanel.toJSON(); // ISciFinanceChartPanelState
localStorage.setItem("my-chart", JSON.stringify(state));
```

| Part           | Contents                                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `finance`      | Data (exchange, symbol, interval, period), view (live-tip mode), studies (type, pane, settings), drawings |
| `layout`       | Pane direction and order; pane sizes, visibility and maximised state; axis sync and group membership      |
| `useSubCharts` | Whether the chart used sub-chart mode                                                                     |

Each study's settings are saved as its [descriptor](/financial-charts/studies-and-indicators/#settings-forms), so settings the user edits in a study form are kept. Drawings are saved and restored when their annotation type is registered. `DrawingToolsController.attach` registers the built-in drawing tools' types; to restore drawings into a chart without a controller, call `registerDrawingTools()` first. For your own annotation types, call `SciFinanceChart.registerDrawingType(name)`.

## Restore

Plain TypeScript:

```ts
const state: ISciFinanceChartPanelState = JSON.parse(localStorage.getItem("my-chart"));

oldPanel?.cleanup();
const financeChartPanel = await SciFinanceChartPanel.fromJSON(container, state, { useSubCharts: state.useSubCharts });
```

`fromJSON` rebuilds everything in `state` in three steps: it creates each study through `studyProvider`, opens the panes, and then applies the saved layout. After that, fresh data loads for the saved symbol and period. Its third argument also takes non-serialisable settings: `services`, `axisDefaults`, `paneSizing` and `maxPanes`.

React: pass the state as `restoreState`, and remount to apply it:

```tsx
<SciFinanceChartView
    key={restoreKey}
    config={config}
    restoreState={savedState}
    useSubCharts={savedState?.useSubCharts}
/>
```

## What is not restored

-   **The zoom and pan position.** It is captured in `finance.visibleRanges` but not applied, because the indices it's stored in shift as history loads. A restored chart opens on its period, or on the latest data.
-   **Anything outside the chart**, such as a watchlist, app preferences and the selected drawing tool. Save those yourself, beside the chart's state. (The SciTrader app bundles them with it in one saved object.)
-   **Studies not registered with `studyProvider`.** Restoring a state that contains one throws an error.

<CenteredImageWrapper src={require("../_examples/layoutState_SaveRestore/screenshot.png").default} title="Save and Restore" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/layoutState_SaveRestore/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/layoutState_SaveRestore/react.tsx
    ```
</CodeSnippetBlock>
