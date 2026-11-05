---
sidebar_position: 1
sidebar_label: SciFinanceChart
title: "SciFinanceChart: a JavaScript and React Candlestick Chart Component | SciTrader.js"
description: "SciFinanceChart is SciTrader.js's trading chart component: a multi-pane candlestick chart with indicators, live data, zoom and pan, as SciFinanceChartPanel in JavaScript and SciFinanceChartView in React."
keywords: ["SciFinanceChart", "SciFinanceChartPanel", "SciFinanceChartView", "candlestick chart component", "React candlestick chart", "JavaScript trading chart", "financial chart component", "SciTrader.js"]
---

# SciFinanceChart: the Trading Chart Component

The chart itself: a candlestick chart of one symbol, with a pane for each indicator that needs one, live data, and zoom and pan. It comes in two forms, with the same config and the same API:

| | Plain TypeScript | React |
| --- | --- | --- |
| **The component** | `SciFinanceChartPanel` | `<SciFinanceChartView>`, from `scichart-scitrader-react` |
| **Create it** | `await SciFinanceChartPanel.create(element, config)` | `<SciFinanceChartView config={config} />` |
| **Its API** | What `create` resolves with | `onInit`, or `ref` |
| **Remove it** | `financeChartPanel.cleanup()` | Unmount it |

Both create:

- **the panes:** the price pane, and a pane for each study that needs one, with dividers to resize them and a control bar on each;
- **a data feed** for the symbol, from the [exchange](/financial-charts/data-sources/) you name, which loads older candles as the user pans back and adds live ones;
- **the chart's interaction:** zoom, pan, axis drag, crosshair and legend, by mouse or by touch.

The config is an [`ISciFinanceChartPanelConfig`](/financial-charts/ui-components/sci-finance-chart/chart-config/), and the API an [`ISciFinanceChartPanelApi`](/financial-charts/ui-components/sci-finance-chart/finance-chart-api/), called `financeChartPanel` in these docs. Its `financeApi` is the chart, a `SciFinanceChart`, and its `paneGroupApi` the panes.

## TypeScript Example: Creating a Chart

`SciFinanceChartPanel.create` builds the chart inside an element. The element needs a size: the chart fills it, and follows it when it resizes.

<LiveDocSnippet maxWidth={"100%"} includeSciTrader name="../../_examples/gettingStarted_CreateChart/vanilla" html={`<div id="chart" style="width: 100%; height: 100%"></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/gettingStarted_CreateChart/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Creating a Chart

`<SciFinanceChartView>` takes the same config, and fills its parent, so give the parent a height. It is in the React package, `scichart-scitrader-react`, along with React versions of the other UI components. Add it to an app that has the [core packages](/financial-charts/installation/#install-the-packages):

```bash
npm install scichart-scitrader-react react react-dom
```

<LiveDocSnippet maxWidth={"100%"} height={680} includeSciTrader reactComponent="TradingChart" name="../../_examples/gettingStarted_CreateChartReact/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/gettingStarted_CreateChartReact/react.tsx
    ```
</CodeSnippetBlock>

- **Wait for `onInit`.** `ref.current` is set as soon as the view mounts, but its `financeApi` throws until the chart has initialised. Use `onInit`, or check `isInitialized`, first.
- **`config` is read once.** Changing it doesn't rebuild the chart: change a live chart through `financeApi`, or remount it with a new `key` to start again.
- **`paneControls` is live.** Unlike `config`, a change to the `paneControls` prop applies to the running chart.
- **Unmounting cleans up.** The view calls `cleanup()` itself.

## Pane Sizes, and Pane State in Code

Set each pane's size when you create the chart with `paneSizing`, by pane id. Afterwards, `paneGroupApi` reads and sets the same state the pane control bars do: size, hidden, maximised and closed. `financeApi` sets each pane's Y-axis autorange.

```ts
const RSI_PANE = new PaneId("rsi");

const financeChartPanel = await SciFinanceChartPanel.create(element, {
    // …
    studies: [new OHLCStudy(), new VolumeStudy(), new RSIStudy({ paneId: RSI_PANE })],
    paneSizing: {
        [PaneId.DEFAULT.value]: { grow: 3 }, // the price pane takes 3 shares of the height
        [RSI_PANE.value]: { size: 110 }, // the RSI pane is 110 px high
    },
});

financeChartPanel.paneGroupApi.setExpanded(RSI_PANE.value); // maximise the RSI pane
financeChartPanel.financeApi.getYAxisAutoRangeController(RSI_PANE).isYAxisAutoRangeEnabled = false;
```

[Pane Sizes and Pane State](/financial-charts/ui-components/sci-finance-chart/pane-sizes-and-state/) covers each of them, with live examples.

## Mobile and Desktop Modes

The chart works by mouse and by touch, but some parts have a touch layout, which your app turns on: the chart doesn't detect touch screens. Decide from your app's own breakpoint, and pass it in:

```ts
const touch = matchMedia("(pointer: coarse)").matches; // or your app's breakpoint

const financeChartPanel = await SciFinanceChartPanel.create(element, { /* … */ paneControls: { touch } });
const drawing = DrawingToolsController.attach(financeChartPanel.financeApi, { touch, selectFinishedDrawing: !touch });
```

[Mobile and Desktop Modes](/financial-charts/ui-components/sci-finance-chart/mobile-and-desktop-modes/) lists what changes, and how the SciTrader app decides.

## Pages in This Section

| Page | What it covers |
| --- | --- |
| [Pane Sizes and Pane State](/financial-charts/ui-components/sci-finance-chart/pane-sizes-and-state/) | Pane sizes; Y-axis autorange, maximising, hiding and closing panes in code |
| [Mobile and Desktop Modes](/financial-charts/ui-components/sci-finance-chart/mobile-and-desktop-modes/) | Touch and mouse layouts, and how your app chooses |
| [Layout, Panes and PaneGroup](/financial-charts/ui-components/sci-finance-chart/layout/) | Sub-chart and multi-chart modes, pane control bars, loading states, and the layout underneath |
| [Finance Chart API](/financial-charts/ui-components/sci-finance-chart/finance-chart-api/) | `ISciFinanceChartPanelApi`, and the `SciFinanceChart` class |
| [Chart Config Object](/financial-charts/ui-components/sci-finance-chart/chart-config/) | Every `ISciFinanceChartPanelConfig` option |

## Where to read next

- [Symbols, Intervals and Periods](/financial-charts/symbols-intervals-periods/): change what the chart shows.
- [Studies and Indicators](/financial-charts/studies-and-indicators/): add RSI, MACD, Bollinger Bands and more.
- [UI Components](/financial-charts/ui-components/): the toolbar controls, drawing toolbar, market depth and watchlist around the chart.
