---
sidebar_position: 1
sidebar_label: Overview
title: "Save and Restore a Trading Chart as JSON in JavaScript and React | SciTrader.js"
description: "Save a SciTrader.js trading chart (symbol, interval, indicators and their settings, drawings and pane layout) to JSON with toJSON, and restore it with fromJSON, in JavaScript and React."
keywords: ["save chart state", "restore chart JSON", "serialize trading chart", "chart toJSON fromJSON", "persist indicators and drawings", "React chart save restore", "SciTrader.js"]
---

# Saving and Restoring

A trading app should open the chart the way the user left it: the same symbol and interval, their indicators with their settings, their trend lines and Fibonacci retracements, and their pane layout. SciTrader saves all of that as plain JSON in one call, and builds the chart again from it in another.

```ts
// Save
const state = financeChartPanel.toJSON(); // ISciFinanceChartPanelState: plain JSON
localStorage.setItem("my-chart", JSON.stringify(state));

// Restore
const saved = JSON.parse(localStorage.getItem("my-chart"));
const restored = await SciFinanceChartPanel.fromJSON(element, saved, { useSubCharts: saved.useSubCharts });
```

## What Is Saved {#what-is-saved}

| Saved and restored | Where in the JSON |
| --- | --- |
| The exchange, symbol, interval and period | `finance.exchangeName`, `symbol`, `interval`, `period` |
| Every study, with its pane and settings, including the user's edits | `finance.studies` |
| The drawings: trend lines, Fibonacci tools, channels, patterns | `finance.annotations` |
| The live-tip mode | `finance.liveTipMode` |
| The pane layout: order, sizes, hidden and maximised panes, axis sync | `layout` |
| Sub-chart mode | `useSubCharts` |

[The Saved JSON Format](/financial-charts/save-and-restore/json-format/) shows a real saved chart, and every field.

## What Isn't Saved {#what-isnt-saved}

- **The zoom and pan position.** It is saved, as `finance.visibleRanges`, but not applied: a restored chart opens on its period, or on the latest data.
- **The theme.** Pass it to `fromJSON` (`{ theme }`), from the user's saved preference; see [Remembering the User's Theme](/financial-charts/styling-and-themes/#remembering).
- **Settings that aren't data,** such as `services`, `axisDefaults`, `paneSizing` and `surfaceConfig`. Pass them to `fromJSON` again.
- **Anything outside the chart,** such as a watchlist, the selected drawing tool or other app preferences. Save them yourself, beside the chart's state.
- **The candles.** Only the symbol and interval are saved; a restored chart loads fresh data.

## TypeScript Example: Save, Restore and See the JSON

A BTC-USD chart with MACD. Add a study, draw with the tools on the left, or drag a pane divider, then **Save**: the JSON appears on the right. Change the chart again, then **Restore** to bring back the saved one. The save is kept in `localStorage`, so it survives a page reload.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../_examples/layoutState_SaveRestore/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div style="display: flex; flex: 1; min-height: 0"><div id="tools"></div><div id="chart" style="flex: 1; min-width: 0"></div><pre id="json"></pre></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../_examples/layoutState_SaveRestore/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Save, Restore and See the JSON

The same in React: **Restore** passes the saved state as `restoreState`, and changes the view’s `key`.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="SaveRestoreChart" name="../_examples/layoutState_SaveRestore/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../_examples/layoutState_SaveRestore/react.tsx
    ```
</CodeSnippetBlock>

## Restoring a Chart {#restoring}

`SciFinanceChartPanel.fromJSON(element, state, options)` builds a new chart from a saved state. It creates each study through `studyProvider`, opens the panes, applies the saved layout and the drawings, then loads data for the saved symbol and period.

```ts
import { registerDrawingTools, SciFinanceChartPanel } from "scichart-scitrader";

registerDrawingTools(); // once, at startup: before any chart is restored

financeChartPanel.cleanup(); // the old chart, if there is one
financeChartPanel = await SciFinanceChartPanel.fromJSON(element, state, {
    useSubCharts: state.useSubCharts,
    theme, // not saved: pass the user's theme
});
```

:::warning[Register the drawing tools before restoring]
Drawings are restored only if their types are registered. `DrawingToolsController.attach` registers the built-in drawing tools, but a chart restored when the page loads is created before any controller is attached, so its drawings are silently skipped. Call `registerDrawingTools()` once at startup. For your own annotation types, call `SciFinanceChart.registerDrawingType(name)`.
:::

- **Studies must be registered with `studyProvider`.** The built-in studies are. A state with a study type that isn't throws, so [load saved state safely](/financial-charts/save-and-restore/storage-and-servers/#loading-safely).
- **Remove the old chart first,** with `cleanup()`, and detach its drawing tools before that.
- **Use the saved sub-chart mode,** `state.useSubCharts`, so the layout matches.

## Restoring in React {#react}

Pass the saved state as `restoreState`, and give `<SciFinanceChartView>` a new `key` to create the chart again from it. Like `config`, `restoreState` is read when the chart is created:

```tsx
<SciFinanceChartView
    key={mount} // change it to restore
    config={config}
    restoreState={savedState}
    useSubCharts={savedState?.useSubCharts}
    onInit={setApi}
/>
```

With `useDrawingTools`, deselect any drawing (`controller.clearSelection()`) before changing the `key`: the drawing tools detach after the old chart has gone.

## Pages in This Section

| Page | What it covers |
| --- | --- |
| [The Saved JSON Format](/financial-charts/save-and-restore/json-format/) | A real saved chart, every field and its type, editing a saved state, and versions |
| [Saving to Your Own Storage or Server](/financial-charts/save-and-restore/storage-and-servers/) | `localStorage`, IndexedDB or your server; auto-saving; loading safely |

<details>
<summary>SciFinanceChartPanel.fromJSON, with its TSDoc</summary>

```ts
class SciFinanceChartPanel {
    /**
     * Restore a panel from serialized state.
     *
     * @param container — DOM element to mount into.
     * @param state — Previously serialized state from {@link ISciFinanceChartPanelApi.toJSON}.
     * @param options — Non-serializable settings (sub-chart mode, services, surface setup).
     */
    static fromJSON(container: HTMLElement, state: ISciFinanceChartPanelState, options?: {
        useSubCharts?: boolean;
        services?: ISciFinanceChartServices;
        surfaceConfig?: ISciFinanceChartPanelConfig["surfaceConfig"];
        axisDefaults?: IChartAxisDefaults;
        paneSizing?: Record<string, IPaneSizeConfig>;
        maxPanes?: number;
        theme?: ISciTraderTheme;
        paneControls?: IPaneControlOptions;
        loading?: IPaneLoadingOptions;
    }): Promise<ISciFinanceChartPanelApi<HTMLElement>>;
}
```

</details>
