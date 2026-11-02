---
sidebar_position: 4
sidebar_label: Toolbar Controls
title: "Interval and Period Toolbar Controls | SciTrader.js Trading Charts"
description: "Add ready-made interval and period pickers to a SciTrader.js trading chart, in plain JavaScript / TypeScript with IntervalSelector.create and PeriodSelector.create, or in React with scichart-scitrader-react."
keywords: ["SciTrader", "SciTrader.js", "IntervalSelector", "PeriodSelector", "trading chart toolbar", "React financial chart toolbar"]
---

# Toolbar Controls

The SDK has ready-made pickers for the interval and the period, so you don't have to build the toolbar yourself. They come in two forms with the same options:

| | Plain JavaScript / TypeScript | React |
| --- | --- | --- |
| Package | `scichart-scitrader` | `scichart-scitrader-react` |
| Create | `IntervalSelector.create(container, options)`, `PeriodSelector.create(container, options)` | `<IntervalSelector … />`, `<PeriodSelector … />` |
| Update | `control.update(partialOptions)` | Change the props |
| Remove | `control.destroy()` | Unmount |

The controls only pick a value and call `onChange`. You pass the value on to the chart with [changeInterval](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/changing-the-interval/) or [setPeriod](/scichart-extensions/scichart-scitrader/symbols-intervals-periods/periods/), so you stay in control of what happens.

<CenteredImageWrapper src={require("../../_examples/gettingStarted_SymbolInterval/period-toolbar.png").default} title="IntervalSelector and PeriodSelector above a SciTrader.js chart" />

## Options

**`IntervalSelector`**

| Option | Type | Meaning |
| --- | --- | --- |
| `value` | `CandleInterval` | The selected interval |
| `intervals` | `readonly CandleInterval[]` | The intervals to offer. Default `DEFAULT_INTERVALS` (the common ones, 1s to 1M); `ALL_INTERVALS` lists every interval |
| `onChange` | `(interval: CandleInterval) => void` | Called when the user picks one |

**`PeriodSelector`**

| Option | Type | Meaning |
| --- | --- | --- |
| `value` | `TPeriod \| null` | The selected period; `null` selects "Free" |
| `periods` | `readonly TPeriod[]` | The periods to offer |
| `currentInterval` | `CandleInterval` | Greys out the periods that don't suit this interval (`validPeriodsForInterval`) |
| `onChange` | `(period: TPeriod \| null) => void` | Called when the user picks one. "Free", or clicking the selected period again, gives `null` |

## Plain JavaScript / TypeScript

```ts
import {
    CandleInterval,
    carryPeriodToInterval,
    IntervalSelector,
    PeriodSelector
} from "scichart-scitrader";

const chart = financeChartPanel.financeApi; // SciFinanceChart
const toolbar = document.getElementById("toolbar");

const intervals = IntervalSelector.create(toolbar, {
    value: CandleInterval.FIVE_MINUTES,
    intervals: [CandleInterval.ONE_MINUTE, CandleInterval.FIVE_MINUTES, CandleInterval.ONE_HOUR, CandleInterval.ONE_DAY],
    onChange: async (next) => {
        // Keep about the same span on screen, adjusted to suit the new interval
        const period = carryPeriodToInterval(periods.value, next);
        periods.update({ currentInterval: next, value: period });
        await chart.changeInterval(next, period);
    },
});

const periods = PeriodSelector.create(toolbar, {
    value: "1D",
    currentInterval: CandleInterval.FIVE_MINUTES,
    onChange: (period) => chart.setPeriod(period),
});

// When the chart goes away
intervals.destroy();
periods.destroy();
```

## React

```tsx
import { CandleInterval, carryPeriodToInterval, TPeriod } from "scichart-scitrader";
import { IntervalSelector, PeriodSelector } from "scichart-scitrader-react";

function ChartToolbar({ financeChartPanel }) {
    const [interval, setInterval] = React.useState(CandleInterval.FOUR_HOURS);
    const [period, setPeriod] = React.useState<TPeriod | null>("1M");

    return (
        <>
            <IntervalSelector
                value={interval}
                intervals={[CandleInterval.ONE_HOUR, CandleInterval.FOUR_HOURS, CandleInterval.ONE_DAY]}
                onChange={(next) => {
                    const carried = carryPeriodToInterval(period, next);
                    setInterval(next);
                    setPeriod(carried);
                    financeChartPanel.financeApi.changeInterval(next, carried);
                }}
            />
            <PeriodSelector
                value={period}
                currentInterval={interval}
                onChange={(next) => {
                    setPeriod(next);
                    financeChartPanel.financeApi.setPeriod(next);
                }}
            />
        </>
    );
}
```

## Full examples

The TS tab is a plain TypeScript chart with all four toolbar controls: interval, period, [candle type](/scichart-extensions/scichart-scitrader/studies-and-indicators/#candle-types) and live-tip. The React tab is a React toolbar with a symbol switcher, `IntervalSelector` and `PeriodSelector`.

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../../_examples/components_ChartControls/vanilla.ts
    ```
    ```tsx showLineNumbers file=../../_examples/gettingStarted_SymbolInterval/react.tsx
    ```
</CodeSnippetBlock>

`CandleTypeSelector` and `LiveTipToggle` work the same way. [UI components](/scichart-extensions/scichart-scitrader/ui-components/#toolbar-controls) covers all four controls, and how they are styled.
