---
sidebar_position: 2
sidebar_label: Interval and Period Selectors
title: "IntervalSelector and PeriodSelector: Interval and Period Buttons | SciTrader.js"
description: "Add ready-made interval and period buttons to a SciTrader.js trading chart with IntervalSelector and PeriodSelector, in plain TypeScript and React, and style them with CSS."
keywords: ["SciTrader", "SciTrader.js", "IntervalSelector", "PeriodSelector", "trading chart toolbar", "React financial chart toolbar", "timeframe selector"]
---

# Interval and Period Selectors

`IntervalSelector` and `PeriodSelector` are the SDK's ready-made toolbar buttons for the candle **interval** (1m, 1h, 1d, …) and the visible **period** (1D, 1M, 1Y, …). They work together: the period buttons disable the periods that don't suit the current interval, and an interval change can carry the period across.

Like the other [toolbar controls](/financial-charts/ui-components/#how-they-work), they only pick a value. Each calls `onChange`, and you pass the value on to the chart with [`changeInterval`](/financial-charts/symbols-intervals-periods/changing-the-interval/) or [`setPeriod`](/financial-charts/symbols-intervals-periods/periods/).

## TypeScript Example: Interval and Period Selectors

A chart of BTC-USD from Coinbase, with an `IntervalSelector` offering the intervals Coinbase supports and a `PeriodSelector`. Changing the interval keeps about the same span on screen, and the period buttons disable the periods that don't suit the new interval.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../_examples/components_IntervalPeriodSelectors/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/components_IntervalPeriodSelectors/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Interval and Period Selectors

The same chart in React, with the React `IntervalSelector` and `PeriodSelector` from `scichart-scitrader-react`. They are controlled components: the interval and period live in React state.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="IntervalPeriodChart" name="../../_examples/components_IntervalPeriodSelectors/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/components_IntervalPeriodSelectors/react.tsx
    ```
</CodeSnippetBlock>

## IntervalSelector: Interval Buttons {#intervalselector}

A row of interval buttons. Picking one selects it and calls `onChange` with the interval.

| Option | Type | What it does |
| --- | --- | --- |
| `value` | `CandleInterval` | The selected interval |
| `intervals` | `readonly CandleInterval[]` | The intervals to offer, in order. Default `DEFAULT_INTERVALS`: the common ones, from 1s to 1M. `ALL_INTERVALS` lists every interval |
| `onChange` | `(interval: CandleInterval) => void` | Called when the user picks a different interval |
| `autoSelect` | `boolean` | Whether a pick is selected straight away. Default `true`; see [How the Components Work](/financial-charts/ui-components/#how-they-work) |

Every interval it shows is enabled, so pass it only the intervals the exchange supports. `DEFAULT_INTERVALS` includes some that Coinbase doesn't have, such as 4h; see [Which Intervals an Exchange Supports](/financial-charts/symbols-intervals-periods/changing-the-interval/#which-intervals-are-available).

<details>
<summary>The IntervalSelector class, IIntervalSelectorOptions and DEFAULT_INTERVALS, with their TSDoc</summary>

```ts
/**
 * A row of interval buttons (1s, 1m, 5m … 1M), in plain DOM. Picking one selects it and calls
 * `onChange`; pass the interval on to the chart with `financeApi.changeInterval(interval)`. Every
 * interval is always enabled: the period selector is the one that rules out combinations.
 *
 * Its look is `.st-toggle-group.st-interval-selector` in `scitrader.css`.
 *
 * ```ts
 * const intervals = IntervalSelector.create(toolbar, {
 *     value: CandleInterval.ONE_DAY,
 *     onChange: (interval) => panel.financeApi.changeInterval(interval),
 * });
 * ```
 *
 * React apps use the React `IntervalSelector`.
 */
class IntervalSelector {
    /** The control's element, inside the container passed to {@link create}. */
    readonly element: HTMLDivElement;
    static create(container: HTMLElement, options: IIntervalSelectorOptions): IntervalSelector;
    /**
     * The control's HTML for these options, without behaviour: for rendering on a server. A
     * control created with the same options produces the same markup.
     */
    static toHTML(options: IIntervalSelectorOptions): string;
    /** The selected interval. */
    get value(): CandleInterval;
    /** Change any of the options; the ones not given stay as they are. */
    update(options: Partial<IIntervalSelectorOptions>): void;
    destroy(): void;
}

/** Options for {@link IntervalSelector}. */
interface IIntervalSelectorOptions {
    /** The selected interval. */
    value: CandleInterval;
    /** The intervals to offer, in order. Default {@link DEFAULT_INTERVALS}. */
    intervals?: readonly CandleInterval[];
    /** Called when the user picks a different interval (never with the selected one). */
    onChange?: (interval: CandleInterval) => void;
    /**
     * Whether picking an option selects it straight away. Default `true`. With `false` the control
     * only calls `onChange`, and shows the new selection once you pass it back with
     * `update({ value })`; the React wrappers work this way, so the parent's state decides.
     */
    autoSelect?: boolean;
}

/**
 * The intervals {@link IntervalSelector} shows by default: the common ones, leaving out the rarer
 * cadences (3m, 2h, 6h, 8h, 12h, 3d) to keep a toolbar compact. `ALL_INTERVALS` lists every
 * interval, in duration order.
 */
const DEFAULT_INTERVALS: readonly CandleInterval[];
```

</details>

<details>
<summary>The React IntervalSelector and its props, with their TSDoc</summary>

```ts
/** Props for {@link IntervalSelector}. */
interface IIntervalSelectorProps extends IHostProps {
    /** The selected interval. */
    value: CandleInterval;
    /** Called when the user picks a different interval. */
    onChange: (interval: CandleInterval) => void;
    /** The intervals to offer, in order. Default `DEFAULT_INTERVALS`. */
    intervals?: readonly CandleInterval[];
}

/**
 * The SDK's interval buttons in React: the vanilla `IntervalSelector` in a `<div>`, controlled by
 * `value` and `onChange`.
 *
 * ```tsx
 * <IntervalSelector value={interval} onChange={(next) => { setInterval(next); chart.financeApi.changeInterval(next); }} />
 * ```
 */
function IntervalSelector({ value, onChange, intervals, className, style }: IIntervalSelectorProps): React.JSX.Element;

/** Props every React finance control takes besides its own. */
interface IHostProps {
    className?: string;
    style?: React.CSSProperties;
}
```

</details>

## PeriodSelector: Period Buttons {#periodselector}

"Free" followed by a row of period buttons. Picking one selects it and calls `onChange` with the period. "Free", or a click on the selected period, calls `onChange(null)`: no period.

| Option | Type | What it does |
| --- | --- | --- |
| `value` | `TPeriod \| null` | The selected period, or `null` for "Free" |
| `periods` | `readonly TPeriod[]` | The periods to offer, in order, after "Free". Default `ALL_PERIODS`: all twelve |
| `currentInterval` | `CandleInterval` | The chart's interval. The periods that don't suit it are disabled, as [validPeriodsForInterval](/financial-charts/symbols-intervals-periods/periods/#periods-that-suit-an-interval) decides |
| `onChange` | `(period: TPeriod \| null) => void` | Called when the user picks a period, or "Free" |
| `autoSelect` | `boolean` | Whether a pick is selected straight away. Default `true` |

<details>
<summary>The PeriodSelector class and IPeriodSelectorOptions, with their TSDoc</summary>

```ts
/**
 * A row of period buttons ("Free", 1D, 5D, 1M … ALL), in plain DOM. Picking one selects it and
 * calls `onChange`; pass it on to the chart with `financeApi.setPeriod(period)`. Clicking the
 * selected period again clears it, like "Free".
 *
 * Give it the chart's interval (`currentInterval`) and it disables the periods that don't suit
 * it. Its look is `.st-toggle-group.st-period-selector` in `scitrader.css`.
 *
 * ```ts
 * const periods = PeriodSelector.create(toolbar, {
 *     value: "3M",
 *     currentInterval: CandleInterval.ONE_DAY,
 *     onChange: (period) => period && panel.financeApi.setPeriod(period),
 * });
 * // after an interval change:
 * periods.update({ currentInterval: interval });
 * ```
 *
 * React apps use the React `PeriodSelector`.
 */
class PeriodSelector {
    /** The control's element, inside the container passed to {@link create}. */
    readonly element: HTMLDivElement;
    static create(container: HTMLElement, options: IPeriodSelectorOptions): PeriodSelector;
    /**
     * The control's HTML for these options, without behaviour: for rendering on a server. A
     * control created with the same options produces the same markup.
     */
    static toHTML(options: IPeriodSelectorOptions): string;
    /** The selected period, or `null` for none. */
    get value(): TPeriod | null;
    /** Change any of the options; the ones not given stay as they are. */
    update(options: Partial<IPeriodSelectorOptions>): void;
    destroy(): void;
}

/** Options for {@link PeriodSelector}. */
interface IPeriodSelectorOptions {
    /** The selected period, or `null` for none (the "Free" button). */
    value: TPeriod | null;
    /** The periods to offer, in order, after "Free". Default `ALL_PERIODS`. */
    periods?: readonly TPeriod[];
    /**
     * The chart's interval. When set, periods that don't suit it are disabled, as
     * `validPeriodsForInterval` decides: at a 1d interval, for example, "1D" would show one candle.
     */
    currentInterval?: CandleInterval;
    /**
     * Called when the selection changes: with a period, or with `null` when the user picks "Free"
     * or clicks the selected period again.
     */
    onChange?: (period: TPeriod | null) => void;
    /**
     * Whether picking an option selects it straight away. Default `true`. With `false` the control
     * only calls `onChange`, and shows the new selection once you pass it back with
     * `update({ value })`; the React wrappers work this way, so the parent's state decides.
     */
    autoSelect?: boolean;
}
```

</details>

<details>
<summary>The React PeriodSelector and its props, with their TSDoc</summary>

```ts
/** Props for {@link PeriodSelector}. */
interface IPeriodSelectorProps extends IHostProps {
    /** The selected period, or `null` for none ("Free"). */
    value: TPeriod | null;
    /** Called with the picked period, or `null` for "Free" (or a click on the selected period). */
    onChange: (period: TPeriod | null) => void;
    /** The periods to offer, in order. Default `ALL_PERIODS`. */
    periods?: readonly TPeriod[];
    /** The chart's interval; periods that don't suit it are disabled. */
    currentInterval?: CandleInterval;
}

/**
 * The SDK's period buttons in React: the vanilla `PeriodSelector` in a `<div>`, controlled by
 * `value` and `onChange`.
 *
 * ```tsx
 * <PeriodSelector value={period} currentInterval={interval} onChange={setPeriod} />
 * ```
 */
function PeriodSelector({ value, onChange, periods, currentInterval, className, style }: IPeriodSelectorProps): React.JSX.Element;

/** Props every React finance control takes besides its own. */
interface IHostProps {
    className?: string;
    style?: React.CSSProperties;
}
```

</details>

## Keeping the Two Selectors in Step {#keeping-them-in-step}

When the interval changes, tell the `PeriodSelector` the new interval, so it disables the right periods. Pass it the period to show, too. `carryPeriodToInterval` keeps about the same span, adjusted to suit the new interval:

```ts
import { carryPeriodToInterval } from "scichart-scitrader";

const intervals = IntervalSelector.create(toolbar, {
    value: CandleInterval.ONE_HOUR,
    onChange: (interval) => {
        // The period to land on: about the span the user had, adjusted to suit the new interval
        const period = carryPeriodToInterval(periods.value, interval);
        // Update the PeriodSelector: its selection, and which periods it disables
        periods.update({ value: period, currentInterval: interval });
        // Change the chart's interval and period in one load
        chart.changeInterval(interval, period);
    },
});
```

In React, keep the interval and period in state and pass `currentInterval={interval}`, as the [React example](#react-example-interval-and-period-selectors) does. See [Keeping the User's Span](/financial-charts/symbols-intervals-periods/changing-the-interval/#keeping-the-users-span).

## Styling the Interval and Period Selectors {#styling}

Both are toggle groups: a rounded pill of buttons. The stylesheet gives them these classes:

| Element | Class |
| --- | --- |
| The group | `st-toggle-group`, plus `st-interval-selector` or `st-period-selector` |
| Each button | `st-toggle-group__button` |

States use attributes, not extra classes: the selected button has `aria-pressed="true"`, and a period that doesn't suit the interval is `:disabled`. The colours come from the theme variables: `--st-ui-surface` for the pill, `--st-ui-background` for the selected button, and `--st-ui-text` and `--st-ui-text-muted` for the labels.

Override them in your own CSS, loaded after `scitrader.css`. Scope the rules under a class of your own, so they apply to one toolbar and win over the stylesheet's:

```css
/* Square buttons, with the selected interval or period in the accent colour */
.my-toolbar .st-toggle-group {
    border-radius: 2px;
}
.my-toolbar .st-toggle-group__button {
    border-radius: 2px;
    font-size: 13px;
}
.my-toolbar .st-toggle-group__button[aria-pressed="true"] {
    background: var(--st-ui-accent, #7464ff);
}

/* Only the period buttons: hide the ones that don't suit the interval, instead of greying them */
.my-toolbar .st-period-selector .st-toggle-group__button:disabled {
    display: none;
}
```

In React, `className` and `style` apply to the wrapper's host `<div>`. To change colours everywhere, change the theme instead; see [Styling and Themes](/financial-charts/styling-and-themes/#the-stylesheet).

#### See also

- [Changing the Interval](/financial-charts/symbols-intervals-periods/changing-the-interval/)
- [Periods](/financial-charts/symbols-intervals-periods/periods/)
- [Candle Type Selector](/financial-charts/ui-components/candle-type-selector/)
- [Live Tip Toggle](/financial-charts/ui-components/live-tip-toggle/)
