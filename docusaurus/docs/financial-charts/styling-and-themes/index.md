---
sidebar_position: 10
sidebar_label: Styling and Themes
title: "Styling and Themes | SciTrader.js Financial Charts"
description: "Theme every colour of a SciTrader.js financial chart with one theme object, switch themes live with setTheme, and restyle the UI with CSS."
keywords: ["SciTrader", "SciTrader.js", "trading chart dark theme", "financial chart styling", "SciTrader theme"]
---

# Styling and themes

Every colour SciTrader draws with comes from one **theme**: an `ISciTraderTheme` object. It covers:
- the chart surface, axes, legend and crosshair;
- each study's default colours;
- the toolbars, pane controls and other UI components.

Three themes are built in, listed in `SCITRADER_THEMES` (keyed `dark`, `light`, `ocean`) and `SCITRADER_THEME_LIST`:
- `SCITRADER_DARK_THEME`, SciTrader's dark purple-grey look, which charts use unless given another;
- `SCITRADER_LIGHT_THEME`, a white chart with darker, more saturated candles and indicators;
- `SCITRADER_OCEAN_THEME`, deep navy surfaces with sky-blue accents and teal and coral candles.

## Using a theme

```ts
import { createSciTraderTheme, SCITRADER_DARK_THEME } from "scichart-scitrader";

const theme = createSciTraderTheme(SCITRADER_DARK_THEME, {
    name: "Ocean",
    chart: { background: "#0B1D2E", axisBackground: "#0F2438", gridLine: "#16324A", axisLabel: "#8FB3D1" },
    studies: {
        OHLC: { brushUp: "#26A69AB2", brushDown: "#EF5350B2", strokeUp: "#26A69A", strokeDown: "#EF5350" },
        EMA: { strokeColor: "#FFD54F" },
    },
});

const financeChartPanel = await SciFinanceChartPanel.create(container, { /* … */ theme });
```

`createSciTraderTheme(base, overrides)` copies `base` and applies only the colours you list, so a custom theme stays complete as the SDK adds colours. React charts take the same `theme` in their `config`.

### Switching a live chart

```ts
financeChartPanel.financeApi.setTheme(nextTheme);
```

Everything is restyled in place, with no reload:
- axes and backgrounds;
- legend, crosshair and current-price line;
- the toolbars;
- every study.

`themeChanged` is raised afterwards, and studies added later use the new theme.

**What a theme switch leaves alone.** Anything set explicitly keeps its value:
- axis options passed in `axisDefaults` or `applyAxisStyle`;
- a background set by `surfaceConfig`;
- colours passed to a study's constructor, such as `new SMAStudy({ renderOptions: { stroke: "#FFFFFF" } })`;
- colours the user has edited in a study's settings form.

It works by comparing values. A colour that still equals the old theme's value follows the theme; any other colour was chosen by someone and stays. "Reset to defaults" in a study form resets to the *current* theme's colours.

<CenteredImageWrapper src={require("../_examples/styling_Themes/screenshot.png").default} title="Themes" />

<CodeSnippetBlock labels={["TS", "React"]}>
    ```ts showLineNumbers file=../_examples/styling_Themes/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/styling_Themes/react.tsx
    ```
</CodeSnippetBlock>

## What a theme contains

| Group | Colours |
|---|---|
| `chart` | Background, axis strip, gridlines, axis labels (and size), crosshair and its dot, crosshair/current-price label, legend text (and size), current-price line, forming-candle wash, rubber-band zoom, loading tint, indicator reference lines and bands |
| `candles` | Line and mountain candle types, point & figure X and O |
| `market` | Bid, ask, depth bars, pulled-liquidity flash, text |
| `studies` | Each study's default colours, keyed by `EStudyType`, then by the study's settings-form control name, e.g. `studies.RSI.strokeColor` or `studies.MACD.bandSignalColor` |
| `ui` | Toolbars, menus, pane controls, buttons, dividers, icons; the React components' backgrounds, text, accent, scrollbars, positive and negative; the brand gradient (`brandGradientStart` / `brandGradientEnd`) of selected icons and primary buttons |
| `drawing` | Default colours of drawings: line, fill, label text, grip outline and fill, selection outline. Derived from `ui` and `chart` unless set |

The study keys are exactly the colour controls in each study's settings form. `studies.OHLC` holds the candle body and wick colours, which Renko bricks also use.

## Drawings

Drawing tools with a colour of their own keep it, like the orange horizontal line or the coloured pattern presets. Everything else a drawing would otherwise draw in white or in SciChart's dark defaults comes from `theme.drawing`:
- the line, for tools that set none (channel, poly line, extended line, angle line);
- neutral fills;
- label text, for labels without their own colour (Fibonacci levels in single-colour mode);
- the drag grips' outline and fill;
- the selection outline.

The chart applies these as drawings are placed or restored from a save, and moves them on `setTheme`. A colour set in a drawing's editor is kept.

A theme needn't list drawing colours. `deriveDrawingColors(theme)` gives:
- line and grips from `ui.text`;
- label text from `chart.axisLabel`;
- selection from `ui.selection`, and the fill from it at 20%;
- grip holes from `chart.background`.

The built-in themes use exactly that, and `createSciTraderTheme` re-derives them from the new theme's colours. Any drawing colour set by hand, in the base theme or the overrides, is kept.

## Market depth

The market-depth panel takes its colours from `theme.market`. The user can recolour it in the market-depth settings dialog. A colour left at its default follows the theme, and one the user changed is kept. Their saved settings don't depend on the theme: `MarketDepthPanel` takes and reports them theme-neutral and resolves them itself (`panel.themedSettings`). A settings dialog shows the themed form, and passes its result through `unthemeMarketDepthSettings(next, theme)` before saving.

## Order-book heatmap

Each heatmap colour scale (Liquidity, Inferno, Viridis, Greyscale) has two ramps, one for dark backgrounds and one for light, and the heatmap draws whichever suits the chart's theme (`isDark`):
- **On dark,** thin liquidity fades into the background and walls glow bright.
- **On light,** the ramp runs the other way, from near-transparent pale to dark. Liquidity's walls are deep navy.

A theme switch redraws the current scale in the new ramp without reloading anything. `studies.OrderBookHeatmap.palette` sets the scale a theme starts with. A scale the user picks in the settings is kept for the theme it was picked in, like study colours. A custom ramp is kept as the user made it.

## The stylesheet

`scichart-scitrader/scitrader.css` gives the HTML the SDK creates its look. Import it once:

```ts
import "scichart-scitrader/scitrader.css";
```

It is plain CSS. Nothing in the SDK imports it, so it works with any bundler, or as a `<link>`. Its colours read the theme variables below, with the dark theme's values as fallbacks, so it follows `setTheme`.

The components set inline only the layout they need to work: positions, the flex panes, the dividers' drag area, show and hide. Colours, borders, spacing, fonts and hover states all come from the stylesheet. Without it, the controls still work but look like plain browser buttons.

### Restyling

Override the rules in your own CSS, loaded after `scitrader.css`. Every element has a class:

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

States use the attributes that describe them, rather than extra classes: `:hover`, `:disabled`, `aria-pressed` on toggles and on the selected button of a group, `aria-checked` on menu items, `aria-expanded` on a study list's open card, `aria-disabled`, and `data-dragging="true"` on a divider being dragged.

```css
/* Rounded-square on-chart buttons that turn green on hover */
.st-on-chart-buttons__button {
    border-radius: 4px;
}
.st-on-chart-buttons__button:hover {
    color: #22c55e;
}

/* A thicker highlight on the drawing tool in use */
.st-drawing-toolbar__button[aria-pressed="true"] {
    border-width: 2px;
}
```

Scoping overrides under a class of your own (`.my-chart .st-…`), as the demo does, keeps them to one chart and makes each rule more specific than the one it replaces, so it wins whichever stylesheet loads first. A rule with a `:not()` in `scitrader.css`, such as the divider's hover, needs the same `:not()` in yours to stay more specific.

<CenteredImageWrapper src={require("../_examples/styling_CssOverrides/screenshot.png").default} title="CSS Overrides" />

<CodeSnippetBlock labels={["TS", "React", "skins.ts"]}>
    ```ts showLineNumbers file=../_examples/styling_CssOverrides/vanilla.ts
    ```
    ```tsx showLineNumbers file=../_examples/styling_CssOverrides/react.tsx
    ```
    ```ts showLineNumbers file=../_examples/styling_CssOverrides/skins.ts
    ```
</CodeSnippetBlock>

The crosshair isn't in the stylesheet. It is redrawn every frame, so its colours are part of the chart theme (`theme.chart`) instead.

## Icons

The SDK's UI icons ([Icons](/financial-charts/ui-components/icons/)) draw in `currentColor`, so they take the colour of the button they sit in: style the button, not the icon. The "selected" look fills them with the theme's brand gradient, `ui.brandGradientStart` → `ui.brandGradientEnd` (`--st-ui-brand-gradient-start` / `-end`), so it follows `setTheme` like everything else. Size them with `width` / `height`, or with CSS on the `<svg>` through `className`.

## React components

Wrap the React components in `SciTraderThemeProvider`:

```tsx
import { SciTraderThemeProvider } from "scichart-scitrader-react";

<SciTraderThemeProvider theme={theme}>
    <SciFinanceChartView config={{ /* … */ theme }} onInit={(api) => (chartRef.current = api)} />
    <DrawingList controller={controller} />
</SciTraderThemeProvider>
```

The provider writes the theme as **CSS custom properties** on a wrapper element (`display: contents`), and also on `:root`, so menus and pickers attached to `<body>` follow the theme too. Set `global={false}` on a nested provider that should theme only its own subtree. The components' stylesheets read the variables:
- `ui.textMuted` becomes `--st-ui-text-muted`;
- `chart.loadingTint` becomes `--st-chart-loading-tint`.

So changing `theme` restyles every component at once, without a remount, and the provider is safe to render on the server. Components that need a colour in code read it with `useSciTraderTheme()`. Charts are drawn by WebGL, which can't read CSS, so a chart takes the theme through its own `config.theme` and `setTheme`. Pass it the same object.

The packages don't use MUI. If your app does, build its MUI theme from the same `ISciTraderTheme`, so both match; this `createMuiThemeFromSciTrader` helper maps the background, paper, text, accent and light or dark mode in about thirty lines:

```tsx
<ThemeProvider theme={createMuiThemeFromSciTrader(theme)}>
    <SciTraderThemeProvider theme={theme}>…</SciTraderThemeProvider>
</ThemeProvider>
```

For users to change theme, give `SciTraderThemeProvider` `onThemeChange` (and optionally `themes`, which defaults to the built-in list). Inside it, `useSciTraderThemeSwitch()` returns the current theme, the themes on offer and `setTheme`, for building a theme picker; it returns `undefined` under a provider without `onThemeChange`, so a picker can hide itself. The host stores the choice and passes it back as `theme`. The SciTrader app keeps it in a cookie, so its server renders the chosen theme on the first paint.

Every variable has a fallback, `var(--st-ui-text, #ffffff)`, so a component outside a provider still gets the built-in look. The chart views set the variables on their own container, too.

Your own CSS can use the same variables:

```css
.my-panel {
    background: var(--st-ui-panel, #262334);
    color: var(--st-ui-text-muted, #9da2bc);
}
```

`themeToCssVariables(theme)` returns the full list. `applyThemeCssVariables(element, theme)` writes them onto any element, for non-React hosts.

## Axes

`axisDefaults` takes any SciChart `IAxisBase2dOptions` and applies them to every axis. It overrides the theme's axis colours, and can set non-colour options too:

```ts
axisDefaults: {
    drawMajorBands: false,
    drawMinorGridLines: false,
    labelStyle: { fontSize: 13 },
},
```

To change axis options later, call `financeChartPanel.financeApi.applyAxisStyle(partial)`.

Axis labels are drawn by WebGL, so their font must be registered with SciChart (`sciChartSurface.registerFont`) before `labelStyle.fontFamily` can use it. The theme's `fontFamily` is for HTML text only.

## Surfaces

`surfaceConfig` runs on each pane's `SciChartSurface` as it is created, after the theme's background has been applied. Use it for anything else SciChart can do to a surface:

```ts
surfaceConfig: async ({ sciChartSurface }) => {
    sciChartSurface.background = "transparent"; // show the page behind the chart
},
```

## Legend and crosshair

The theme sets the legend and crosshair colours. Other styling goes through `FinChartLegendModifier`'s setters:
- `setCrosshairStrokeDashArray` for the dash pattern;
- `setLegendFontSize` for text size;
- `legendOffsetX` / `legendOffsetY` for position.

Find the modifier in `financeChartPanel.financeApi.finChartModifiers`.

## Limits

- **Translucent overlays.** Hover washes, hairlines and dividers are drawn with `rgb(var(--st-ui-overlay-rgb) / alpha)`. The overlay base is white on dark themes and black on light ones, so they work on both.
- **Colours still hard-coded.** The drawing tools' default annotation colours stay literal, because they aren't chrome. The SciTrader app's brand logos and coin icons are hard-coded too.
