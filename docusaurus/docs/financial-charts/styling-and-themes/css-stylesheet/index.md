---
sidebar_position: 2
sidebar_label: The CSS Stylesheet
title: "Styling Trading Chart Controls with CSS: the SciTrader Stylesheet | SciTrader.js"
description: "Import SciTrader.js's stylesheet, restyle the toolbars, pane controls and drawing tools with your own CSS, use the theme's CSS variables, and look up every CSS class. Live JavaScript and React examples."
keywords: ["trading chart CSS", "chart toolbar CSS", "CSS variables theme", "override chart styles", "scitrader.css", "custom chart styling", "SciTrader.js"]
---

# The CSS Stylesheet

The chart is drawn with WebGL, but everything around it is HTML: the pane control bars and dividers, the toolbars, the drawing tools, the study forms and the loading states. That HTML gets its look from one stylesheet, `scitrader.css`, and you restyle it with ordinary CSS.

## Importing the Stylesheet {#importing}

Import it once, e.g. in your app's entry file:

```ts
import "scichart-scitrader/scitrader.css";
```

It is plain CSS: nothing in the SDK imports it, so it works with any bundler, or as a `<link>`. Without it, the controls still work, but look like plain browser buttons. The components set inline only the layout they need to work, such as positions and sizes while dragging; colours, borders, spacing, fonts and hover states all come from the stylesheet.

## The Theme's CSS Variables {#css-variables}

The stylesheet takes its colours from the theme, through **CSS variables**. Each theme colour has one, named `--st-<group>-<name>`: `ui.textMuted` is `--st-ui-text-muted`, `chart.loadingTint` is `--st-chart-loading-tint`. Every rule gives a fallback, the dark theme's colour, so a control outside any theme still looks right: `var(--st-ui-text, #ffffff)`.

**Where the variables come from:**

| | Writes the variables on |
| --- | --- |
| `SciFinanceChartPanel`, `<SciFinanceChartView>` | The chart's container, for its pane controls, dividers and loading states |
| `MarketDepthPanel`, `<MarketDepthView>` | The panel's element |
| `SciTraderThemeProvider` (React) | A wrapper element, and `:root` |
| `applyThemeCssVariables(element, theme)` | Any element you choose: use it for controls outside the chart in plain TypeScript |

:::warning[A parent's variables don't reach inside the chart]
The chart and the depth panel write the variables on their own elements, so a variable you set on a parent, e.g. `.my-app { --st-ui-accent: orange }`, is overridden for everything inside them. To change a variable inside the chart, set it on the elements themselves: `.my-app .st-pane-control-bar { --st-ui-accent: orange }`. The example's "Theme variables" skin does both.
:::

**Use the variables in your own CSS,** so your controls follow the theme too:

```css
.my-panel {
    background: var(--st-ui-panel, #262334);
    color: var(--st-ui-text-muted, #9da2bc);
}
```

`themeToCssVariables(theme)` lists every variable and its value. Study colours aren't among them: studies are drawn by WebGL, and get their colours from the theme directly.

## Overriding the Stylesheet {#overriding}

Override its rules in your own CSS, loaded after `scitrader.css`. Every element has a class, listed [below](#class-reference):

```css
/* Round drawing tools */
.my-chart .st-drawing-toolbar__button {
    border-radius: 50%;
}

/* A thicker highlight on the drawing tool in use */
.my-chart .st-drawing-toolbar__button[aria-pressed="true"] {
    border-width: 2px;
}
```

- **Scope your rules under a class of your own,** such as `.my-chart` here. It keeps them to one chart, and makes each rule more specific than the one it replaces, so it wins whichever stylesheet loads first.
- **A rule with `:not()` needs the same `:not()`.** Some `scitrader.css` rules have one, such as the divider's hover, `:hover:not([data-dragging="true"])`. Repeat it in yours to stay more specific.
- **States are attributes,** not classes. Style `:hover`, `:disabled`, `aria-pressed` on toggles and on the selected button of a group, `aria-checked` on menu items, `aria-expanded` on a study list's open card, `aria-disabled`, and `data-dragging="true"` on a divider being dragged.
- **Translucent hovers and lines** use `rgb(var(--st-ui-overlay-rgb) / alpha)`. The overlay colour is white on dark themes and black on light ones, so the same rule works on both.
- **The crosshair isn't HTML.** It is drawn with the chart, so its colours come from the theme's `chart` group; see [Styling the Chart](/financial-charts/styling-and-themes/styling-the-chart/#legend-and-crosshair).

## TypeScript Example: Restyling the Controls with CSS

A BTC-USD chart with the drawing tools rail, zoom buttons on each pane, and a control bar when you hover a pane. Each button above the chart puts a different set of CSS rules on the page: rounded, square and flat, or new values for the theme’s CSS variables. Pick a drawing tool, or hover a pane, to see each skin’s states.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/styling_CssOverrides/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="skins"></div><div id="skinned" style="display: flex; flex: 1; min-height: 0"><div id="tools"></div><div id="chart" style="flex: 1; min-width: 0"></div></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/styling_CssOverrides/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Restyling the Controls with CSS

The same in React: the rules go in a `<style>` element.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="CssOverridesChart" name="../../_examples/styling_CssOverrides/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/styling_CssOverrides/react.tsx
    ```
</CodeSnippetBlock>

## CSS Class Reference {#class-reference}

| Component | Classes |
|---|---|
| Per-pane control bar | `st-pane-control-bar`, `__info` (your content, [Layout](/financial-charts/sci-finance-chart/layout/#your-own-content-in-the-control-bar)), `__button`, `__icon`, `__separator` |
| Control bar drawer (touch layout) | `st-pane-control-drawer`, `__handle`, `__chevron` |
| Divider between panes | `st-pane-divider` (`--touch`), `__grip` |
| Restore strip for hidden panes | `st-pane-restore-strip`, `__chip`, `__icon` |
| A pane | `st-pane`, and `st-pane--focused` while it has keyboard focus |
| Candle counter | `st-candle-counter` |
| Pane loading: skeleton, switch overlay, progress dots | `st-pane-skeleton` (`__block`); `st-pane-loading-overlay` (`__shimmer`); `st-pane-progress`, `__dots`, `__dot`, `__caption` |
| On-chart zoom / pan buttons | `st-on-chart-buttons`, `__button` |
| Annotation quick-edit toolbar | `st-inline-toolbar`, `__button`, `__handle`, `__separator`, `__swatch`, `__value` |
| Drawing toolbar | `st-drawing-toolbar` (`--vertical` / `--horizontal`), `__button`, `__divider`, `__flyout`, `__heading`, `__item` |
| Market depth panel (the ladder itself is canvas) | `st-market-depth`, `__header`, `__title`, `__grouping`, `__step`, `__grouping-value`, `__settings`, `__body`; the hover readout `__sweep` (`--bid` / `--ask`), `__sweep-head`, `__sweep-rows`, `__sweep-foot` |
| Loading overlays inside the chart | `st-loading-region`, `st-historical-load`, `__spinner` |
| Interval, period and live-tip buttons | `st-toggle-group`, `__button`, with `st-interval-selector`, `st-period-selector` or `st-live-tip-toggle` on the group |
| Candle-type picker and its menu | `st-candle-type-selector`, `__icon`, `__chevron`; `st-candle-type-menu`, `__item`, `__icon` |
| Study settings form | `st-study-form`, `__section`, `__section-label`, `__empty`, `__footer`, `__reset` |
| Study list | `st-study-list`, `__title`, `__items`, `__card`, `__header`, `__chevron`, `__name`, `__remove`, `__body`, `__empty` |
| Form fields | `st-text-field` (`--labelled`, `--compact`), `__label`, `__input`, `__adornment`, `__outline`; `st-select-field`, `__label`, `__box`, `__select`, `__arrow` |
| Colour field and its picker | `st-color-field` (`--with-trailing`), `__label`, `__swatch`, `__swatch-color`, `__trailing`; `st-color-popover`, `__picker`, `__saturation`, `__hue`, `__alpha`, `__hex`, `__channels`, `__channel`, … |
| Gradient editor | `st-gradient-ramp`, `__label`, `__bar`, `__track`, `__handle`, `__handle-color`, `__position` |
| Drawings list | `st-drawing-list`, `__header`, `__title`, `__clear`, `__items`, `__row`, `__icon`, `__label`, `__button`, `__edit`, `__delete`, `__empty` |
| Confirmation dialog ("Clear all") | `st-confirm-dialog`, `__panel`, `__title`, `__text`, `__actions`, `__cancel`, `__confirm` |

## CSS Variable API

<details>
<summary>themeToCssVariables, applyThemeCssVariables, cssVariableName, themeVar and uiVar, with their TSDoc</summary>

```ts
/**
 * The theme as CSS custom properties, for everything drawn with HTML and CSS rather than WebGL:
 * the vanilla SDK toolbars and overlays, and the React components' stylesheets.
 *
 * Names are `--st-<group>-<key>` in kebab case: `ui.textMuted` becomes `--st-ui-text-muted`,
 * `chart.loadingTint` becomes `--st-chart-loading-tint`. Study colours are not included; they are
 * drawn by WebGL and are applied to the studies directly.
 *
 * Stylesheets should always give a fallback, `var(--st-ui-text, #ffffff)`, so a component still
 * renders outside a themed container.
 */
function themeToCssVariables(theme: ISciTraderTheme): Record<string, string>;
/** `cssVariableName("ui", "textMuted")` → `"--st-ui-text-muted"`. */
function cssVariableName(group: string, key: string): string;
/** Write the theme's CSS variables onto an element, so it and its descendants pick them up. */
function applyThemeCssVariables(element: HTMLElement, theme: ISciTraderTheme): void;
/** `var(--st-ui-text, #ffffff)`: a CSS reference to one theme colour, falling back to its value in `theme`. */
function themeVar(theme: ISciTraderTheme, group: "chart" | "candles" | "market" | "ui", key: string): string;

function uiVar(key: keyof ISciTraderUiColors): string;
```

</details>

## Where to read next

- [Creating a Custom Theme](/financial-charts/styling-and-themes/custom-themes/): change the colours everywhere, not only in CSS.
- [Styling the UI Components](/financial-charts/styling-and-themes/styling-ui-components/): toolbars and the market depth ladder.
- [Mobile and Responsive Styling](/financial-charts/styling-and-themes/mobile-and-responsive/): touch-sized controls in CSS.
