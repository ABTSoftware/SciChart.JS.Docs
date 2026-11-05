---
sidebar_position: 6
sidebar_label: Mobile and Responsive Styling
title: "Mobile-Friendly Trading Chart Styling: Touch Targets, Dark Mode | SciTrader.js"
description: "Make SciTrader.js trading charts comfortable on phones and tablets: touch-sized toolbar buttons in CSS, larger chart text with a theme variant, and following the device's light or dark mode, in JavaScript and React."
keywords: ["mobile trading chart", "responsive candlestick chart", "chart dark mode", "prefers-color-scheme chart", "touch friendly chart", "mobile chart font size", "SciTrader.js"]
---

# Mobile and Responsive Styling

On a phone, small buttons are hard to hit, small text is hard to read, and users expect apps to follow their phone's light or dark setting. Each has a styling answer:

| On phones and tablets | Do |
| --- | --- |
| Toolbar buttons too small to tap | [Bigger targets in CSS](#touch-sized-controls), under `@media (pointer: coarse)` |
| Axis labels and legend too small | [A theme variant with larger text](#larger-text) |
| Light or dark to match the device | [Follow `prefers-color-scheme`](#light-or-dark) |
| Pane controls that need a mouse to appear | [The touch layout](/financial-charts/sci-finance-chart/mobile-and-desktop-modes/), `paneControls: { touch: true }` |

## Touch-Sized Controls {#touch-sized-controls}

Aim for targets about 44 px across. Put the rules in your stylesheet under `@media (pointer: coarse)`, which matches when the main pointer is a finger:

```css
@media (pointer: coarse) {
    .st-toggle-group__button {
        min-width: 44px;
        min-height: 40px;
        font-size: 15px;
    }
    .st-candle-type-selector {
        min-height: 40px;
    }
    .st-drawing-toolbar__button {
        width: 44px;
        height: 44px;
    }
}
```

The pane control bars and dividers have their own touch layout, with a drawer and a wider grip: turn it on with `paneControls: { touch: true }`; see [Mobile and Desktop Modes](/financial-charts/sci-finance-chart/mobile-and-desktop-modes/).

## Larger Text on the Chart {#larger-text}

The chart's text is drawn by WebGL, so CSS can't size it. Make a theme variant with larger axis labels and legend, and use it on phones:

```ts
const phoneTheme = (theme: ISciTraderTheme) =>
    createSciTraderTheme(theme, { chart: { axisLabelFontSize: 15, legendFontSize: 15 } });

const touch = matchMedia("(pointer: coarse)").matches;
const theme = touch ? phoneTheme(SCITRADER_DARK_THEME) : SCITRADER_DARK_THEME;
```

When you switch to a theme with a different `legendFontSize` on a live chart, also call the legend's `setLegendFontSize`: see [Styling the Chart](/financial-charts/styling-and-themes/styling-the-chart/#legend-and-crosshair).

## Following the Device's Light or Dark Setting {#light-or-dark}

`(prefers-color-scheme: dark)` matches when the device is in dark mode. Pick the theme from it, and follow it when it changes, e.g. at sunset:

```ts
const prefersDark = matchMedia("(prefers-color-scheme: dark)");
const systemTheme = () => (prefersDark.matches ? SCITRADER_DARK_THEME : SCITRADER_LIGHT_THEME);

financeChartPanel.financeApi.setTheme(systemTheme());
prefersDark.addEventListener("change", () => financeChartPanel.financeApi.setTheme(systemTheme()));
```

Offer "System" as one choice beside Dark and Light, as the example does, so users can still pick one.

## TypeScript Example: Phone Sizes and the Device’s Dark Mode

**System** follows your device’s light or dark setting; **Dark** and **Light** override it. **Phone** switches to larger axis labels and legend, from a theme variant, and touch-sized toolbar buttons, from CSS. In an app the CSS goes under `@media (pointer: coarse)`; here a class turns it on, so you can see it with a mouse.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/styling_Mobile/vanilla" html={`<div id="app" style="display: flex; flex-direction: column; height: 100%"><div id="options"></div><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/styling_Mobile/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Phone Sizes and the Device’s Dark Mode

The same in React. A `useSyncExternalStore` hook follows `prefers-color-scheme`.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="ResponsiveChart" name="../../_examples/styling_Mobile/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/styling_Mobile/react.tsx
    ```
</CodeSnippetBlock>

## Where to read next

- [Mobile and Desktop Modes](/financial-charts/sci-finance-chart/mobile-and-desktop-modes/): the touch layout of the chart itself.
- [The CSS Stylesheet](/financial-charts/styling-and-themes/css-stylesheet/): every class to restyle.
- [Styling and Themes](/financial-charts/styling-and-themes/): remembering the user's choice of theme.
