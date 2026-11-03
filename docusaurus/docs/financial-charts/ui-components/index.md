---
sidebar_position: 1
sidebar_label: Overview
title: "UI Components: Toolbars, Watchlist, Market Depth | SciTrader.js"
description: "SciTrader.js UI components for trading apps: interval and period pickers, candle-type menu, live-tip toggle, colour picker, candle counter, icons, market-depth ladder and watchlist sparklines, in plain DOM and React."
keywords: ["SciTrader", "SciTrader.js", "trading UI components", "IntervalSelector", "PeriodSelector", "CandleTypeSelector", "LiveTipToggle", "watchlist sparkline", "market depth ladder React"]
---

# UI Components

Besides the chart, the SDK ships the controls a trading app puts around it: toolbar pickers, study settings, a drawings list, a market-depth ladder, loading placeholders, a candle counter, UI icons and the pieces of a watchlist. Each one is plain DOM in `scichart-scitrader`, and `scichart-scitrader-react` wraps it for React. They have the SciTrader app's look, from the stylesheet, and follow the theme.

| Component | Plain TypeScript | React | Documented in |
|---|---|---|---|
| Interval buttons | `IntervalSelector` | `<IntervalSelector>` | [Interval and Period Selectors](/financial-charts/ui-components/interval-and-period-selectors/) |
| Period buttons | `PeriodSelector` | `<PeriodSelector>` | [Interval and Period Selectors](/financial-charts/ui-components/interval-and-period-selectors/) |
| Candle-type menu | `CandleTypeSelector` | `<CandleTypeSelector>` | [Candle Type Selector](/financial-charts/ui-components/candle-type-selector/) |
| Follow / Anchored toggle | `LiveTipToggle` | `<LiveTipToggle>` | [Live Tip Toggle](/financial-charts/ui-components/live-tip-toggle/) |
| Colour field with opacity | `ColorPicker` | `<ColorPicker>` | [Colour Picker](/financial-charts/ui-components/colour-picker/) |
| A study's settings form | `StudySettingsForm` | `<StudySettingsForm>` | [Studies](/financial-charts/studies-and-indicators/#settings-forms) |
| The chart's studies, each with its form | `StudyList` | `<StudyList>` | [Studies](/financial-charts/studies-and-indicators/#settings-forms) |
| Drawing tools rail | `DrawingToolbar` | `<DrawingToolbar>` | [Drawing tools](/financial-charts/drawing-tools/) |
| List of drawings | `DrawingList` | `<DrawingList>` | [Drawing tools](/financial-charts/drawing-tools/#list-of-drawings) |
| Market-depth ladder | `MarketDepthPanel` | `<MarketDepthView>` | [Data sources](/financial-charts/data-sources/#market-depth) |
| Loading progress dots | `createPaneProgressDots`, `paneProgressDotsLoading` | `<PaneProgressDots>` | [Layout](/financial-charts/layout/#loading-states) |
| Candle counts (visible / loaded / total) | `CandleCounter`, `countCandles`, `observeCandleCounts` | `<CandleCounter>` | [Candle Counter](/financial-charts/ui-components/candle-counter/) |
| UI icons | `SCITRADER_ICONS`, `sciTraderIconSvg` | `<SciTraderIcon>` | [Icons](/financial-charts/ui-components/icons/) |
| Watchlist prices and sparklines | `WatchListDataManager`, `SparkLineChart` | none: build the list in React | [Watchlist](/financial-charts/ui-components/watchlist/) |
| Symbols as pairs (`BTC/USDT`) | `formatSymbolPair`, `parseInstrument` | the same functions | [Watchlist](/financial-charts/ui-components/watchlist/) |

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
