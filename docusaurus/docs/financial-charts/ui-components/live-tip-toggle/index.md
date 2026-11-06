---
sidebar_position: 4
sidebar_label: Live Tip Toggle
title: "LiveTipToggle: Follow or Anchor Live Candles | SciTrader.js"
description: "Let users choose whether a live SciTrader.js trading chart scrolls with each new candle (Follow) or stays where they left it (Anchored), with the ready-made LiveTipToggle, in plain TypeScript and React."
keywords: ["SciTrader", "SciTrader.js", "LiveTipToggle", "liveTipMode", "live trading chart auto scroll", "follow live candles"]
---

# Live Tip Toggle

The **live tip** is the latest candle, which keeps updating as live prices arrive and is followed by a new candle at each interval. `liveTipMode` decides what the view does when new candles arrive, while a [period](/financial-charts/symbols-intervals-periods/periods/) is set:

- **Follow** (`"follow"`, the default): the view slides right with each new candle, so the latest one stays in view.
- **Anchored** (`"anchored"`): the view stays where it is, and new candles collect off-screen to the right. Users who are studying an earlier part of the chart aren't moved away from it.

`LiveTipToggle` is a ready-made pair of Follow / Anchored buttons for it. Like the other [toolbar controls](/financial-charts/ui-components/#how-they-work), it only picks a mode. It calls `onChange`, and you set the mode on the chart with `financeApi.liveTipMode = mode`.

## TypeScript Example: Live Tip Toggle

A chart of BTC-USD at one-minute candles over the last hour, from Coinbase, so a new candle arrives every minute. With **Follow**, the view moves along with it; switch to **Anchored**, and the view stays put while new candles collect to the right.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../_examples/components_LiveTipToggle/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/components_LiveTipToggle/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Live Tip Toggle

The same chart in React, with the React `LiveTipToggle` from `scichart-scitrader-react`. It is a controlled component: the mode lives in React state.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="LiveTipChart" name="../../_examples/components_LiveTipToggle/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/components_LiveTipToggle/react.tsx
    ```
</CodeSnippetBlock>

## LiveTipToggle Options {#options}

| Option | Type | What it does |
| --- | --- | --- |
| `value` | `TLiveTipMode`: `"follow" \| "anchored"` | The selected mode |
| `onChange` | `(mode: TLiveTipMode) => void` | Called when the user picks the other mode |
| `autoSelect` | `boolean` | Whether a pick is selected straight away. Default `true` |

The chart side: `SciFinanceChart.liveTipMode` gets or sets the mode, and `liveTipModeChanged` is raised when it changes. To start a chart in one mode, set the [`liveTipMode` option](/financial-charts/sci-finance-chart/chart-config/#livetipmode) of the chart config.

<details>
<summary>The LiveTipToggle class and ILiveTipToggleOptions, with their TSDoc</summary>

```ts
/**
 * Follow / Anchored buttons, in plain DOM, for how the chart treats new live candles:
 * - **Follow:** the visible range slides right with each new candle.
 * - **Anchored:** the range stays where the user left it, and new candles collect off-screen.
 *
 * Picking one selects it and calls `onChange`; set it on the chart with
 * `financeApi.liveTipMode = mode`. Its look is `.st-toggle-group.st-live-tip-toggle` in
 * `scitrader.css`.
 *
 * React apps use the React `LiveTipToggle`.
 */
class LiveTipToggle {
    /** The control's element, inside the container passed to {@link create}. */
    readonly element: HTMLDivElement;
    static create(container: HTMLElement, options: ILiveTipToggleOptions): LiveTipToggle;
    /**
     * The control's HTML for these options, without behaviour: for rendering on a server. A
     * control created with the same options produces the same markup.
     */
    static toHTML(options: ILiveTipToggleOptions): string;
    /** The selected mode. */
    get value(): TLiveTipMode;
    /** Change any of the options; the ones not given stay as they are. */
    update(options: Partial<ILiveTipToggleOptions>): void;
    destroy(): void;
}

/** Options for {@link LiveTipToggle}. */
interface ILiveTipToggleOptions {
    /** The selected mode. */
    value: TLiveTipMode;
    /** Called when the user picks the other mode. */
    onChange?: (mode: TLiveTipMode) => void;
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
<summary>The React LiveTipToggle and its props, with their TSDoc</summary>

```ts
/** Props for {@link LiveTipToggle}. */
interface ILiveTipToggleProps extends IHostProps {
    /** The selected mode. */
    value: TLiveTipMode;
    /** Called when the user picks the other mode. */
    onChange: (mode: TLiveTipMode) => void;
}

/**
 * The SDK's Follow / Anchored toggle in React: the vanilla `LiveTipToggle` in a `<div>`,
 * controlled by `value` and `onChange`.
 */
function LiveTipToggle({ value, onChange, className, style }: ILiveTipToggleProps): React.JSX.Element;

/** Props every React finance control takes besides its own. */
interface IHostProps {
    className?: string;
    style?: React.CSSProperties;
}
```

</details>

<details>
<summary>SciFinanceChart.liveTipMode and liveTipModeChanged, with their TSDoc</summary>

```ts
get liveTipMode(): "follow" | "anchored";
set liveTipMode(value: "follow" | "anchored");

/** Fires when {@link liveTipMode} changes via the setter. */
liveTipModeChanged: EventHandler<"follow" | "anchored">;
```

</details>

## Styling the Live Tip Toggle {#styling}

It is a toggle group, like the [interval and period selectors](/financial-charts/ui-components/interval-and-period-selectors/#styling):

| Element | Class |
| --- | --- |
| The group | `st-toggle-group st-live-tip-toggle` |
| Each button | `st-toggle-group__button`; the selected one has `aria-pressed="true"` |

```css
/* Show the selected mode in the accent colour */
.st-live-tip-toggle .st-toggle-group__button[aria-pressed="true"] {
    background: var(--st-ui-accent, #7464ff);
}
```

See [Styling and Themes](/financial-charts/styling-and-themes/css-stylesheet/).

#### See also

- [Periods](/financial-charts/symbols-intervals-periods/periods/)
- [Chart Config object: liveTipMode](/financial-charts/sci-finance-chart/chart-config/#livetipmode)
- [Interval and Period Selectors](/financial-charts/ui-components/interval-and-period-selectors/)
