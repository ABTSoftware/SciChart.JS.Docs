---
sidebar_position: 3
sidebar_label: Candle Type Selector
title: "CandleTypeSelector: Candlestick, OHLC, Line, Heikin-Ashi Menu | SciTrader.js"
description: "Let users switch a SciTrader.js chart between candlesticks, OHLC bars, line, mountain and Heikin-Ashi with the ready-made CandleTypeSelector, in plain TypeScript and React."
keywords: ["SciTrader", "SciTrader.js", "CandleTypeSelector", "candle type", "Heikin-Ashi chart", "OHLC bars", "candlestick chart type switcher"]
---

# Candle Type Selector

The **candle type** is how the chart draws prices: as candlesticks, OHLC bars, a line, a mountain (a filled line) or Heikin-Ashi candles. `CandleTypeSelector` is a ready-made toolbar button for it: it shows the current type's icon and name, and opens a menu of types.

Like the other [toolbar controls](/financial-charts/ui-components/#how-they-work), it only picks a type. It calls `onChange`, and you apply the type with `financeApi.setCandleType(type)`. Changing the candle type redraws the price series in place: the data, zoom and studies stay as they are. See [Price Chart Types](/financial-charts/studies-and-indicators/price-chart-types/).

## TypeScript Example: Candle Type Selector

A chart of BTC-USD at 6-hour candles from Coinbase, with a `CandleTypeSelector` in the toolbar. Pick a type from the menu, and the chart redraws the prices that way.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader name="../../_examples/components_CandleTypeSelector/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/components_CandleTypeSelector/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Candle Type Selector

The same chart in React, with the React `CandleTypeSelector` from `scichart-scitrader-react`. It is a controlled component: the candle type lives in React state.

<LiveDocSnippet maxWidth={"100%"} height={600} includeSciTrader reactComponent="CandleTypeChart" name="../../_examples/components_CandleTypeSelector/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/components_CandleTypeSelector/react.tsx
    ```
</CodeSnippetBlock>

## CandleTypeSelector Options {#options}

| Option | Type | What it does |
| --- | --- | --- |
| `value` | `ECandleType` | The selected candle type |
| `types` | `readonly ECandleType[]` | The types to offer, in order. Default: all of them |
| `onChange` | `(type: ECandleType) => void` | Called when the user picks a different type |
| `menuContainer` | `HTMLElement` | Where the open menu is attached. Default `document.body` |
| `autoSelect` | `boolean` | Whether a pick is selected straight away. Default `true` |

The candle types are the values of `ECandleType`: `Candlestick`, `OhlcBars`, `Line`, `Mountain` and `HeikinAshi`.

The menu works from the keyboard: the arrow keys move between types, and Escape closes it, as does a click outside. It is attached to `document.body` so that a toolbar with `overflow: hidden` can't clip it. If your theme's CSS variables are set on a container rather than on the page, pass an element inside that container as `menuContainer`, so the menu picks up the theme.

The chart side: `setCandleType(type)` changes the type, `getCandleType()` returns it, and `candleTypeChanged` is raised when it changes.

<details>
<summary>The CandleTypeSelector class, ICandleTypeSelectorOptions and ECandleType, with their TSDoc</summary>

```ts
/**
 * A candle-type picker in plain DOM: a button showing the current type's icon and name, which
 * opens a menu of types (candles, OHLC bars, line, mountain, Heikin-Ashi). Picking one selects it,
 * closes the menu and calls `onChange`; apply it with `financeApi.setCandleType(type)`.
 *
 * The menu closes on a click outside or Escape, and follows the button if the page scrolls. The
 * arrow keys move between its items. Its look is `.st-candle-type-selector` (the button) and `.st-candle-type-menu` in
 * `scitrader.css`.
 *
 * ```ts
 * CandleTypeSelector.create(toolbar, {
 *     value: ECandleType.Candlestick,
 *     onChange: (type) => panel.financeApi.setCandleType(type),
 * });
 * ```
 *
 * React apps use the React `CandleTypeSelector`.
 */
class CandleTypeSelector {
    /** The button, inside the container passed to {@link create}. */
    readonly element: HTMLButtonElement;
    static create(container: HTMLElement, options: ICandleTypeSelectorOptions): CandleTypeSelector;
    /**
     * The button's HTML for these options, without behaviour: for rendering on a server. A control
     * created with the same options produces the same markup.
     */
    static toHTML(options: ICandleTypeSelectorOptions): string;
    /** The selected candle type. */
    get value(): ECandleType;
    /** Whether the menu is open. */
    get isOpen(): boolean;
    /** Change any of the options; the ones not given stay as they are. */
    update(options: Partial<ICandleTypeSelectorOptions>): void;
    destroy(): void;
}

/** Options for {@link CandleTypeSelector}. */
interface ICandleTypeSelectorOptions {
    /** The selected candle type. */
    value: ECandleType;
    /** The types to offer, in order. Default: every type, in `CANDLE_TYPE_MENU_ITEMS` order. */
    types?: readonly ECandleType[];
    /** Called when the user picks a different type (never with the selected one). */
    onChange?: (type: ECandleType) => void;
    /**
     * Where the open menu is attached. Default `document.body`, so the menu isn't clipped by an
     * `overflow: hidden` toolbar. Pass an element inside your themed container if the theme's
     * CSS variables are set there rather than on the page.
     */
    menuContainer?: HTMLElement;
    /**
     * Whether picking a type selects it straight away. Default `true`. With `false` the control
     * only calls `onChange`, and shows the new type once you pass it back with `update({ value })`;
     * the React wrapper works this way, so the parent's state decides.
     */
    autoSelect?: boolean;
}

/**
 * The rendering style for the main price series of a finance chart.
 *
 * Candlestick / OhlcBars / Line / Mountain bind directly to the raw
 * {@link OhlcDataSeries}; HeikinAshi is derived via a `scichart-financial-tools`
 * filter (see {@link createPriceSeries}). All are **time-domain** — one mark per
 * time slot, on the price pane's shared time axis.
 *
 * Renko and Point & Figure are NOT candle types — they remap X off the time
 * domain (price-driven bricks / columns) and ship as their own studies
 * (`RenkoStudy` / `PointAndFigureStudy`) on dedicated `CategoryAxis` panes.
 *
 * String values (not numeric) so the choice round-trips cleanly through the
 * study descriptor / `toJSON` serialization and the `?candleType=` URL param.
 */
enum ECandleType {
    Candlestick = "Candlestick",
    OhlcBars = "OhlcBars",
    Line = "Line",
    Mountain = "Mountain",
    HeikinAshi = "HeikinAshi"
}
```

</details>

<details>
<summary>The React CandleTypeSelector and its props, with their TSDoc</summary>

```ts
/** Props for {@link CandleTypeSelector}. */
interface ICandleTypeSelectorProps extends IHostProps {
    /** The selected candle type. */
    value: ECandleType;
    /** Called when the user picks a different type. */
    onChange: (type: ECandleType) => void;
    /** The types to offer, in order. Default: every type. */
    types?: readonly ECandleType[];
    /** Where the open menu is attached. Default `document.body`. */
    menuContainer?: HTMLElement;
}

/**
 * The SDK's candle-type picker in React: the vanilla `CandleTypeSelector` (a button and its menu)
 * in a `<div>`, controlled by `value` and `onChange`.
 */
function CandleTypeSelector({ value, onChange, types, menuContainer, className, style, }: ICandleTypeSelectorProps): React.JSX.Element;

/** Props every React finance control takes besides its own. */
interface IHostProps {
    className?: string;
    style?: React.CSSProperties;
}
```

</details>

<details>
<summary>SciFinanceChart.setCandleType, getCandleType and candleTypeChanged, with their TSDoc</summary>

```ts
/**
 * Change the price series rendering style (candlestick, OHLC bars, line,
 * mountain, Heikin-Ashi, Renko, point & figure). Delegates to the default-pane
 * OHLC study, which swaps its renderable series in place (preserving data /
 * zoom / pan). No-op if there is no price study. Raises {@link candleTypeChanged}.
 */
setCandleType(type: ECandleType): void;

/** The current price rendering style. Defaults to candlestick when no price study exists. */
getCandleType(): ECandleType;

/**
 * Fires when the price series rendering style changes via {@link setCandleType}.
 * Carries the new {@link ECandleType} so UI controls can reflect external changes.
 */
candleTypeChanged: EventHandler<ECandleType>;
```

</details>

## Styling the Candle Type Selector {#styling}

| Element | Class |
| --- | --- |
| The button | `st-candle-type-selector`, with `__icon` and `__chevron` inside |
| The menu | `st-candle-type-menu` |
| Each menu item | `st-candle-type-menu__item`, with `__icon` inside |

The button has `aria-expanded="true"` while the menu is open, and the current type's menu item has `aria-checked="true"`. Override them in your own CSS, loaded after `scitrader.css`:

```css
/* A wider menu, with the current type in the accent colour */
.st-candle-type-menu {
    min-width: 220px;
}
.st-candle-type-menu__item[aria-checked="true"] {
    color: var(--st-ui-accent, #7464ff);
}
```

The menu is attached to `document.body`, outside your toolbar, so scope menu rules by the menu's own class, or attach it inside your container with `menuContainer`. See [Styling and Themes](/financial-charts/styling-and-themes/#the-stylesheet).

#### See also

- [Price Chart Types](/financial-charts/studies-and-indicators/price-chart-types/)
- [Interval and Period Selectors](/financial-charts/ui-components/interval-and-period-selectors/)
- [Live Tip Toggle](/financial-charts/ui-components/live-tip-toggle/)
