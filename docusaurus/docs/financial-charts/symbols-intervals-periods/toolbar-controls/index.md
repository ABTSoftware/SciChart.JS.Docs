---
sidebar_position: 4
sidebar_label: Toolbar Controls
title: "Interval and Period Toolbar Controls | SciTrader.js Trading Charts"
description: "The ready-made toolbar controls for a SciTrader.js trading chart: interval and period buttons, a candle-type menu and a live-tip toggle, in plain TypeScript and React."
keywords: ["SciTrader", "SciTrader.js", "IntervalSelector", "PeriodSelector", "trading chart toolbar", "React financial chart toolbar"]
---

# Toolbar Controls

The SDK has ready-made toolbar controls for the interval and the period, so you don't have to build the toolbar yourself. Each only picks a value and calls `onChange`; you pass it on to the chart with [changeInterval](/financial-charts/symbols-intervals-periods/changing-the-interval/) or [setPeriod](/financial-charts/symbols-intervals-periods/periods/).

<CenteredImageWrapper src={require("../../_examples/components_IntervalPeriodSelectors/screenshot.png").default} title="IntervalSelector and PeriodSelector above a SciTrader.js chart" />

| Control | What it picks | Documented in |
| --- | --- | --- |
| `IntervalSelector` | The candle interval: 1m, 1h, 1d, … | [Interval and Period Selectors](/financial-charts/ui-components/interval-and-period-selectors/) |
| `PeriodSelector` | The visible period: 1D, 1M, 1Y, …, or "Free" for none | [Interval and Period Selectors](/financial-charts/ui-components/interval-and-period-selectors/) |
| `CandleTypeSelector` | How prices are drawn: candlesticks, OHLC bars, line, mountain, Heikin-Ashi | [Candle Type Selector](/financial-charts/ui-components/candle-type-selector/) |
| `LiveTipToggle` | Whether the view follows new candles, or stays where the user left it | [Live Tip Toggle](/financial-charts/ui-components/live-tip-toggle/) |

Each control's page has live TypeScript and React examples with CodePens, its options, and how to style it. They come in plain TypeScript from `scichart-scitrader`, and in React from `scichart-scitrader-react`.

#### See also

- [UI Components](/financial-charts/ui-components/)
- [Changing the Interval](/financial-charts/symbols-intervals-periods/changing-the-interval/)
- [Periods](/financial-charts/symbols-intervals-periods/periods/)
