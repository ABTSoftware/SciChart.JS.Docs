---
sidebar_position: 5
sidebar_label: Styling the UI Components
title: "Styling Trading Toolbars and the Market Depth Ladder | SciTrader.js"
description: "Theme and restyle SciTrader.js's UI components: interval, period and candle-type toolbars, the market depth ladder and its bid and ask colours, study forms and icons, in JavaScript and React."
keywords: ["trading toolbar style", "market depth colours", "order book ladder style", "bid ask colours", "React trading UI theme", "chart toolbar CSS", "SciTrader.js"]
---

# Styling the UI Components

The [UI components](/financial-charts/ui-components/) around the chart are HTML, styled by [the stylesheet](/financial-charts/styling-and-themes/css-stylesheet/), except the market depth ladder, which is drawn on a canvas. Each takes the theme as follows:

| Component | Gets the theme from | Restyle with |
| --- | --- | --- |
| Toolbar controls: `IntervalSelector`, `PeriodSelector`, `CandleTypeSelector`, `LiveTipToggle` | CSS variables on an element above them | CSS; [below](#toolbars) |
| `DrawingToolbar`, `DrawingList`, `StudySettingsForm`, `StudyList`, `ColorPicker` | CSS variables on an element above them | CSS: see the [class reference](/financial-charts/styling-and-themes/css-stylesheet/#class-reference) |
| `MarketDepthPanel` | Its `theme` option, and `setTheme` | The theme's `market` colours; [below](#market-depth) |
| Every React component | `SciTraderThemeProvider` | The same as the plain TypeScript component |

## Giving Controls the Theme {#giving-controls-the-theme}

A control outside the chart gets no theme by itself: it shows the dark theme's colours, the stylesheet's fallbacks. Give it the theme's CSS variables:

```ts
import { applyThemeCssVariables } from "scichart-scitrader";

// Plain TypeScript: on an element above the controls, e.g. the page, and again on each theme switch
applyThemeCssVariables(document.body, theme);
```

```tsx
// React: inside the provider
<SciTraderThemeProvider theme={theme}>
    <IntervalSelector value={interval} onChange={setInterval} />
</SciTraderThemeProvider>
```

Menus and pop-ups, such as the candle-type menu and the colour picker, are attached to `<body>`, so they need the variables on `<body>` or above: `SciTraderThemeProvider` also writes them on `:root` for this.

## TypeScript Example: Theming Toolbars and Market Depth

A BTC-USD chart, an interval and candle-type toolbar, and a live Coinbase market depth ladder. Each theme button themes all three: `setTheme` on the chart and the ladder, and CSS variables for the toolbar. The last theme is Dark with blue and orange depth colours, from the theme’s `market` group.

<LiveDocSnippet maxWidth={"100%"} height={700} includeSciTrader name="../../_examples/styling_UiComponents/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="themes"></div><div id="toolbar"></div><div style="display: flex; flex: 1; min-height: 0"><div id="chart" style="flex: 1; min-width: 0"></div><div id="depth" style="width: 300px"></div></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/styling_UiComponents/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Theming Toolbars and Market Depth

The same in React: inside `SciTraderThemeProvider`, the toolbar controls and `MarketDepthView` follow the theme by themselves, and the chart takes it through `setTheme`.

<LiveDocSnippet maxWidth={"100%"} height={700} includeSciTrader reactComponent="ThemedComponents" name="../../_examples/styling_UiComponents/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/styling_UiComponents/react.tsx
    ```
</CodeSnippetBlock>

## Toolbars {#toolbars}

The interval, period and live-tip buttons are toggle groups: `.st-toggle-group`, with `.st-interval-selector`, `.st-period-selector` or `.st-live-tip-toggle` on the group. Each button is `.st-toggle-group__button`, and the selected one has `aria-pressed="true"`:

```css
/* Pill-shaped interval buttons, with the selected one in your accent colour */
.my-toolbar .st-toggle-group__button {
    border-radius: 999px;
}
.my-toolbar .st-toggle-group__button[aria-pressed="true"] {
    background: #f59e0b;
    color: #1f1a12;
}
```

The candle-type picker is `.st-candle-type-selector`, and its menu `.st-candle-type-menu`. Both take their colours from the theme's `ui` group: `surface` behind the buttons, `background` for the selected one, and `text` and `textMuted` for the labels. So a theme with new `ui` colours restyles them without any CSS.

## The Market Depth Ladder {#market-depth}

The ladder takes its colours from the theme's `market` group:

```ts
const theme = createSciTraderTheme(SCITRADER_DARK_THEME, {
    market: {
        bid: "#4FC3F7", // bid prices
        ask: "#FFB74D", // ask prices
        bidBar: "rgba(79, 195, 247, 0.25)", // the bars behind the bids
        askBar: "rgba(255, 183, 77, 0.25)", // the bars behind the asks
    },
});

const depth = MarketDepthPanel.create(element, { source, symbol: "BTC-USD", theme });
depth.setTheme(nextTheme); // on a theme switch
```

`<MarketDepthView>` follows `SciTraderThemeProvider` by itself. Its header and hover readout are HTML, with `st-market-depth` classes; see the [class reference](/financial-charts/styling-and-themes/css-stylesheet/#class-reference).

**The user's own colours.** The user can recolour it in the market-depth settings dialog. A colour left at its default follows the theme, and one the user changed is kept. Their saved settings don't depend on the theme: `MarketDepthPanel` takes and reports them theme-neutral and resolves them itself (`panel.themedSettings`). A settings dialog shows the themed form, and passes its result through `unthemeMarketDepthSettings(next, theme)` before saving.


## Icons {#icons}

The SDK's UI icons ([Icons](/financial-charts/ui-components/icons/)) draw in `currentColor`, so they take the colour of the button they sit in: style the button, not the icon. The "selected" look fills them with the theme's brand gradient, `ui.brandGradientStart` → `ui.brandGradientEnd` (`--st-ui-brand-gradient-start` / `-end`), so it follows `setTheme` like everything else. Size them with `width` / `height`, or with CSS on the `<svg>` through `className`.


## Where to read next

- [The CSS Stylesheet](/financial-charts/styling-and-themes/css-stylesheet/): every class, and how overrides win.
- [Market Depth](/financial-charts/ui-components/market-depth/): the ladder's settings.
- [Mobile and Responsive Styling](/financial-charts/styling-and-themes/mobile-and-responsive/): touch-sized toolbars.
