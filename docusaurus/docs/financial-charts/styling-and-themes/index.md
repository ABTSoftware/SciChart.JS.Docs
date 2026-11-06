---
sidebar_position: 1
sidebar_label: Overview
title: "Themes for JavaScript and React Trading Charts: Dark, Light, Ocean | SciTrader.js"
description: "Style SciTrader.js trading charts with a theme: the built-in Dark, Light and Ocean themes, applying a theme, switching themes live in JavaScript and React, and remembering the user's choice."
keywords: ["trading chart theme", "dark theme candlestick chart", "light theme financial chart", "chart theme switcher", "React chart theme", "SciTraderThemeProvider", "setTheme", "SciTrader.js"]
---

# Styling and Themes

Every colour SciTrader draws with comes from one **theme**: an [`ISciTraderTheme`](/financial-charts/styling-and-themes/custom-themes/#theme-reference) object. One theme styles the chart, its candles and indicators, the drawings, the market depth ladder, and every toolbar and control around them, so they always match.

<CenteredImageWrapper src={require("./themes.jpg").default} title="SciTrader's three built-in themes, Dark, Light and Ocean, on a candlestick chart with an order book heatmap, RSI and a market depth ladder" />

## The Three Built-In Themes {#built-in-themes}

| Theme | Constant | Key in `SCITRADER_THEMES` | Look |
| --- | --- | --- | --- |
| **Dark** | `SCITRADER_DARK_THEME` | `dark` | SciTrader's dark purple-grey. Charts use it unless given another |
| **Light** | `SCITRADER_LIGHT_THEME` | `light` | A white chart, with darker, more saturated candles and indicators |
| **Ocean** | `SCITRADER_OCEAN_THEME` | `ocean` | Deep navy, with sky-blue accents and teal and coral candles |

`SCITRADER_THEME_LIST` lists all three, in that order, e.g. for a theme picker. To make your own, see [Creating a Custom Theme](/financial-charts/styling-and-themes/custom-themes/).

## TypeScript Example: Switching Between the Three Themes

BTC-USD from Coinbase with SMA, RSI and MACD. The buttons switch between the three built-in themes with `setTheme`, and write the theme’s CSS variables on the page, so the toolbar follows too.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../_examples/styling_Themes/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../_examples/styling_Themes/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Switching Between the Three Themes

The same in React. `SciTraderThemeProvider` holds the theme for the toolbar, and the picker uses `useSciTraderThemeSwitch`. The chart takes the theme through `setTheme`.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="ThemedChart" name="../_examples/styling_Themes/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../_examples/styling_Themes/react.tsx
    ```
</CodeSnippetBlock>

## Applying a Theme {#applying-a-theme}

Give the chart a theme when you create it:

```ts
import { SCITRADER_LIGHT_THEME, SciFinanceChartPanel } from "scichart-scitrader";

const financeChartPanel = await SciFinanceChartPanel.create(element, { /* … */ theme: SCITRADER_LIGHT_THEME });
```

Each part of the SDK takes the theme in the way it is drawn:

| Part | Drawn with | How it gets the theme |
| --- | --- | --- |
| **The chart:** candles, indicators, axes, legend, crosshair | WebGL | `config.theme`, then `financeApi.setTheme(theme)` |
| **The chart's own controls:** pane control bars, dividers, loading states | HTML | From the chart, which writes the theme's CSS variables on its container |
| **The market depth ladder** | Canvas | `MarketDepthPanel`'s `theme` option, then `setTheme(theme)`. `MarketDepthView` follows the React provider |
| **Toolbars and other controls outside the chart** | HTML, styled by [the stylesheet](/financial-charts/styling-and-themes/css-stylesheet/) | The theme's CSS variables on an element above them: `applyThemeCssVariables(element, theme)`, or `SciTraderThemeProvider` in React |

So for one theme everywhere, give it to each: the example above does this for the chart and its toolbar.

## Switching Theme {#switching-theme}

```ts
financeChartPanel.financeApi.setTheme(SCITRADER_OCEAN_THEME);
applyThemeCssVariables(document.body, SCITRADER_OCEAN_THEME); // toolbars outside the chart
```

`setTheme` restyles a live chart in place, with no reload: backgrounds, axes, candles, every study, the legend, the crosshair, the current-price line and the pane controls. `themeChanged` fires afterwards, and studies added later use the new theme.

**What a theme switch leaves alone.** A colour or style someone chose keeps its value:

- axis options passed in `axisDefaults`, or to `applyAxisStyle`;
- a background set by `surfaceConfig`;
- colours passed to a study's constructor, such as `new SMAStudy({ renderOptions: { stroke: "#F59E0B" } })`;
- colours the user edited in a study's settings form.

It works by comparing values: a colour that still equals the old theme's value follows the theme, and any other colour stays. "Reset to defaults" in a study form resets to the *current* theme's colours.

## Themes in React: SciTraderThemeProvider {#react}

Wrap the React components in `SciTraderThemeProvider`, and give the chart the same theme:

```tsx
import { SciFinanceChartView, SciTraderThemeProvider } from "scichart-scitrader-react";

<SciTraderThemeProvider theme={theme}>
    <SciFinanceChartView config={{ /* … */ theme }} onInit={setApi} />
    <MarketDepthView source={source} symbol="BTC-USD" />
</SciTraderThemeProvider>

// The chart is drawn by WebGL, which can't read CSS, so it takes later changes through setTheme
React.useEffect(() => api?.financeApi.setTheme(theme), [api, theme]);
```

- **The provider writes the theme as CSS variables** on a wrapper element (`display: contents`), and on `:root`, so menus and pickers attached to `<body>` follow it too. Set `global={false}` on a nested provider that should theme only its own part of the page. It is safe to render on the server.
- **Changing `theme` restyles every component at once,** without a remount.
- **`useSciTraderTheme()`** gives the theme to components that need a colour in code.
- **A theme picker:** give the provider `onThemeChange` (and `themes`, which defaults to the three built-in ones). Inside it, `useSciTraderThemeSwitch()` returns the current theme, the themes on offer and `setTheme`, as the example's picker uses.

**With MUI.** The SDK doesn't use MUI. If your app does, build its MUI theme from the same [`ISciTraderTheme`](/financial-charts/styling-and-themes/custom-themes/#theme-reference), mapping the background, paper, text, accent and light or dark mode, so both match.

<details>
<summary>SciTraderThemeProvider, useSciTraderTheme and useSciTraderThemeSwitch, with their TSDoc</summary>

```tsx
interface ISciTraderThemeProviderProps {
    theme?: ISciTraderTheme;
    /** Extra styles for the wrapper element. It uses `display: contents` by default, so it takes no space in the layout. */
    style?: React.CSSProperties;
    className?: string;
    /**
     * Also publish the theme's variables on `:root`. Default `true`. Needed by anything rendered
     * outside this element in the DOM: menus, pickers and dialogs attached to `<body>`, such as
     * the SDK's candle-type menu and colour picker, or an app's MUI dialogs.
     * Set `false` on a nested provider that should theme only its own subtree.
     */
    global?: boolean;
    /**
     * Makes the theme switchable from inside: a theme picker built with `useSciTraderThemeSwitch`
     * calls this with the theme picked. The host owns the state: store the new theme and pass it
     * back as `theme`. Without it, `useSciTraderThemeSwitch` returns `undefined`.
     */
    onThemeChange?: (theme: ISciTraderTheme) => void;
    /** The themes a theme control offers, when {@link onThemeChange} is set. Default: the built-in themes. */
    themes?: readonly ISciTraderTheme[];
    children?: React.ReactNode;
}

interface ISciTraderThemeSwitch {
    theme: ISciTraderTheme;
    themes: readonly ISciTraderTheme[];
    setTheme: (theme: ISciTraderTheme) => void;
}

/** Makes a SciTrader theme available to the React components inside it. */
function SciTraderThemeProvider(props: ISciTraderThemeProviderProps): JSX.Element;
/** The theme from the nearest provider, or the dark theme outside one. */
function useSciTraderTheme(): ISciTraderTheme;
/** The current theme, the themes on offer and setTheme; `undefined` under a provider without onThemeChange. */
function useSciTraderThemeSwitch(): ISciTraderThemeSwitch | undefined;
```

</details>

## Remembering the User's Theme {#remembering}

Store a theme's id, not the object, and look it up when the page loads:

```ts
import { builtInThemeId, SCITRADER_DARK_THEME, SCITRADER_THEMES } from "scichart-scitrader";

localStorage.setItem("theme", builtInThemeId(theme)); // "dark", "light" or "ocean"

const saved = SCITRADER_THEMES[localStorage.getItem("theme") as keyof typeof SCITRADER_THEMES];
const theme = saved ?? SCITRADER_DARK_THEME;
```

**No flash of the wrong theme.** With server rendering, keep the choice in a cookie instead, so the server renders the chosen theme on the first paint. The SciTrader app does this.

## What a Theme Contains {#what-a-theme-contains}

| Group | What it colours |
| --- | --- |
| `chart` | Background, axis strip, gridlines, axis labels and their size, crosshair and its labels, legend text and its size, current-price line, forming-candle wash, zoom rectangle, loading tint, indicator reference lines and bands |
| `candles` | The line and mountain candle types, and point & figure X and O |
| `studies` | Each study's default colours, by study type, then by the name of the colour in its settings form: `studies.RSI.strokeColor`, `studies.MACD.bandSignalColor`. `studies.OHLC` holds the candles' colours |
| `market` | The market depth ladder: bid, ask, depth bars, the flash for pulled liquidity, text |
| `ui` | Toolbars, menus, pane controls, buttons, dividers, icons, backgrounds, text, accent, scrollbars, and the gradient of selected icons and primary buttons |
| `drawing` | The default colours of drawings. Worked out from `ui` and `chart` unless you set them |
| `isDark`, `fontFamily` | Whether the theme is dark, for colours that differ on dark and light backgrounds; the font of the HTML controls |

The [`ISciTraderTheme` interface reference](/financial-charts/styling-and-themes/custom-themes/#theme-reference) on Creating a Custom Theme has every member, with its TSDoc.

## Pages in This Section

| Page | What it covers |
| --- | --- |
| [The CSS Stylesheet](/financial-charts/styling-and-themes/css-stylesheet/) | Importing it, its CSS variables, overriding its rules, and every class |
| [Creating a Custom Theme](/financial-charts/styling-and-themes/custom-themes/) | Your own theme, in code or from your CSS |
| [Styling the Chart](/financial-charts/styling-and-themes/styling-the-chart/) | Candles, indicators, axes, fonts, legend, crosshair, background, drawings |
| [Styling the UI Components](/financial-charts/styling-and-themes/styling-ui-components/) | Toolbars, the market depth ladder, forms and icons |
| [Mobile and Responsive Styling](/financial-charts/styling-and-themes/mobile-and-responsive/) | Touch-sized controls, larger text, and following the device's light or dark setting |
