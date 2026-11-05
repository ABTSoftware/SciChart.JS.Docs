---
sidebar_position: 1
sidebar_label: Overview
title: "UI Components: Trading Chart, Toolbars, Watchlist, Market Depth | SciTrader.js"
description: "SciTrader.js UI components for trading apps: the SciFinanceChart candlestick chart, interval and period pickers, candle-type menu, live-tip toggle, colour picker, candle counter, icons, market-depth ladder and watchlist sparklines, in plain DOM and React."
keywords: ["SciTrader", "SciTrader.js", "trading UI components", "IntervalSelector", "PeriodSelector", "CandleTypeSelector", "LiveTipToggle", "watchlist sparkline", "market depth ladder React"]
---

# UI Components

The chart itself is the [SciFinanceChart](/financial-charts/ui-components/sci-finance-chart/) component. Around it, the SDK ships the controls a trading app needs: toolbar pickers, study settings, a drawings list, a market-depth ladder, loading placeholders, a candle counter, UI icons and the pieces of a watchlist. Each one is plain DOM in `scichart-scitrader`, and `scichart-scitrader-react` wraps it for React. They have the SciTrader app's look, from the stylesheet, and follow the theme.

| Component | Plain TypeScript | React |
| --- | --- | --- |
| **The chart: candlesticks, indicator panes, live data**<br />See [SciFinanceChart](/financial-charts/ui-components/sci-finance-chart/) | `SciFinanceChartPanel` | `<SciFinanceChartView>` |
| **Interval buttons**<br />See [Interval and Period Selectors](/financial-charts/ui-components/interval-and-period-selectors/) | `IntervalSelector` | `<IntervalSelector>` |
| **Period buttons**<br />See [Interval and Period Selectors](/financial-charts/ui-components/interval-and-period-selectors/) | `PeriodSelector` | `<PeriodSelector>` |
| **Candle-type menu**<br />See [Candle Type Selector](/financial-charts/ui-components/candle-type-selector/) | `CandleTypeSelector` | `<CandleTypeSelector>` |
| **Follow / Anchored toggle**<br />See [Live Tip Toggle](/financial-charts/ui-components/live-tip-toggle/) | `LiveTipToggle` | `<LiveTipToggle>` |
| **Colour field with opacity**<br />See [Colour Picker](/financial-charts/ui-components/colour-picker/) | `ColorPicker` | `<ColorPicker>` |
| **A study's settings form**<br />See [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/) | `StudySettingsForm` | `<StudySettingsForm>` |
| **The chart's studies, each with its form**<br />See [Study Settings Form and Study List](/financial-charts/ui-components/study-settings-form-and-study-list/) | `StudyList` | `<StudyList>` |
| **Drawing tools rail**<br />See [Drawing Toolbar and Drawing List](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/) | `DrawingToolbar` | `<DrawingToolbar>` |
| **List of drawings**<br />See [Drawing Toolbar and Drawing List](/financial-charts/ui-components/drawing-toolbar-and-drawing-list/#drawing-list) | `DrawingList` | `<DrawingList>` |
| **Market-depth ladder**<br />See [Market Depth](/financial-charts/ui-components/market-depth/) | `MarketDepthPanel` | `<MarketDepthView>` |
| **Loading progress dots**<br />See [Layout](/financial-charts/ui-components/sci-finance-chart/layout/#loading-states) | `createPaneProgressDots`, `paneProgressDotsLoading` | `<PaneProgressDots>` |
| **Candle counts (visible / loaded / total)**<br />See [Candle Counter](/financial-charts/ui-components/candle-counter/) | `CandleCounter`, `countCandles`, `observeCandleCounts` | `<CandleCounter>` |
| **UI icons**<br />See [Icons](/financial-charts/ui-components/icons/) | `SCITRADER_ICONS`, `sciTraderIconSvg` | `<SciTraderIcon>` |
| **Sparklines, and watchlist prices**<br />See [Sparklines](/financial-charts/ui-components/sparklines/) | `SparkLineChart`, `WatchListDataManager` | none: use them from React |
| **Symbols as pairs (`BTC/USDT`)**<br />See [Sparklines](/financial-charts/ui-components/sparklines/#symbol-pairs) | `formatSymbolPair`, `parseInstrument` | the same functions |

## How the Components Work {#how-they-work}

**Plain TypeScript.** Each component is a class:
- `Component.create(container, options)` builds it inside `container` and returns it.
- `element` is its root element.
- `update(options)` changes any options; the ones not given stay as they are.
- `destroy()` removes it, along with any listeners it added to the document.

Controls that hold a value also have a `value` getter and an `onChange` option.

**React.** Each wrapper mounts the vanilla component in a `<div>` and passes it the latest props after every render, so props apply in place, without a remount. (`SciFinanceChartView` and `MarketDepthView` are the exceptions: some of their props are read once, as their docs say.) The controls are controlled: they show `value` and report the user's choice through `onChange`, as an `<input>` does. All the wrappers take `className` and `style` for their host `<div>`.

**Controls only pick a value.** The toolbar controls never change the chart themselves. Each calls `onChange` with what the user picked, and you pass it on to the chart, e.g. `financeApi.changeInterval(interval)`. So you decide what happens, and can validate, log or store the choice first.

**Server rendering.** Each control has a static `toHTML(options)` that returns its markup without behaviour, the same markup `create` builds. The React wrappers render it on the server, and the vanilla control takes over before the first paint, so a server-rendered toolbar doesn't change when the page hydrates. A control created with `autoSelect: false` doesn't select what the user picks: it calls `onChange` and waits for `update({ value })`. The React wrappers work this way, so the parent's state decides what is selected.

## Styling the UI Components {#styling}

The components get their look from the SDK's stylesheet. Import it once:

```ts
import "scichart-scitrader/scitrader.css";
```

Without it, the controls still work but look like plain browser buttons. The stylesheet reads the theme's colours from CSS variables such as `--st-ui-surface` and `--st-ui-text`, with the dark theme's colours as fallbacks, so the components follow the chart's theme. Every element has a class, e.g. `st-toggle-group__button`, so you can restyle any part with your own CSS, loaded after `scitrader.css`. Each component's page lists its classes. [Styling and Themes](/financial-charts/styling-and-themes/#the-stylesheet) covers the stylesheet, the theme variables and the full list of classes.

#### See also

- [Styling and Themes](/financial-charts/styling-and-themes/)
- [Symbols, Intervals and Periods](/financial-charts/symbols-intervals-periods/)
