---
sidebar_position: 3
sidebar_label: Creating a Custom Theme
title: "Create a Custom Theme for a JavaScript Trading Chart | SciTrader.js"
description: "Make your own SciTrader.js theme: change any colour of a built-in theme with createSciTraderTheme, build a theme from your brand's CSS variables, and use it in JavaScript and React."
keywords: ["custom chart theme", "trading chart brand colours", "createSciTraderTheme", "custom candlestick colours", "theme from CSS variables", "ISciTraderTheme", "SciTrader.js"]
---

# Creating a Custom Theme

A custom theme is a built-in theme with some colours changed. It works everywhere a built-in theme does: in the chart's config, in `setTheme`, in `SciTraderThemeProvider`, and as CSS variables for the controls.

## In Code: createSciTraderTheme {#in-code}

`createSciTraderTheme(base, overrides)` copies a theme, and changes only the colours you list:

```ts
import { createSciTraderTheme, SCITRADER_DARK_THEME } from "scichart-scitrader";

const MIDNIGHT_GOLD = createSciTraderTheme(SCITRADER_DARK_THEME, {
    name: "Midnight Gold",
    chart: { background: "#0E0E14", currentPriceLine: "#E8B931" },
    studies: {
        OHLC: { brushUp: "#E8B93133", brushDown: "#8A8FA833", strokeUp: "#E8B931", strokeDown: "#8A8FA8" },
        RSI: { strokeColor: "#E8B931" },
    },
    ui: { accent: "#C99A1E" },
});
```

- **Start from the closest theme.** Base a dark theme on `SCITRADER_DARK_THEME`, a light one on `SCITRADER_LIGHT_THEME`: everything you don't list keeps a colour that suits it.
- **Groups merge.** List only the colours you change, at any depth: `studies.OHLC.strokeUp` alone is fine.
- **It stays complete.** When an SDK update adds a colour, your theme gets the base theme's value for it.
- **Give it a `name`.** Theme pickers show it.
- **Hide what you don't want with `transparent`:** a theme holds colours, so `chart: { axisBands: "transparent", minorGridLine: "transparent" }` turns off the alternating axis bands and the minor gridlines for that theme only. (`axisDefaults: { drawMajorBands: false }` turns them off whatever the theme.)
- **`isDark`** comes from the base theme. Set it if you turn a dark theme light, or the other way: the order book heatmap uses it to pick its colours.

**Candle colours** are `studies.OHLC`: `brushUp` and `brushDown` fill the bodies, and `strokeUp` and `strokeDown` draw the outlines and wicks. Renko bricks use them too. The line and mountain candle types use `candles`.

## From Your CSS: Brand Colours as CSS Variables {#from-css}

If your app keeps its brand colours in CSS variables, read them into a theme, so the chart uses the same colours as the rest of your app:

```css
:root {
    --brand-background: #F7F5EF;
    --brand-up: #2E7D5B;
    --brand-down: #B5452E;
    --brand-accent: #3D5A80;
}
```

```ts
function themeFromCss(): ISciTraderTheme {
    const css = getComputedStyle(document.documentElement);
    const brand = (name: string) => css.getPropertyValue(`--brand-${name}`).trim();
    return createSciTraderTheme(SCITRADER_LIGHT_THEME, {
        name: "Classic",
        chart: { background: brand("background"), axisBackground: brand("background") },
        studies: {
            OHLC: { brushUp: brand("up"), brushDown: brand("down"), strokeUp: brand("up"), strokeDown: brand("down") },
        },
        ui: { accent: brand("accent") },
    });
}
```

The chart is drawn by WebGL, which can't read CSS, so CSS alone can't change the chart's colours: they have to go into a theme like this. Read them after your stylesheet has loaded, and build the theme again if they change.

**To restyle only the HTML controls,** without a new theme, set the theme's own CSS variables in your stylesheet instead; see [The CSS Stylesheet](/financial-charts/styling-and-themes/css-stylesheet/#css-variables).

## TypeScript Example: Two Custom Themes

Midnight Gold is the Dark theme with gold candles, made with `createSciTraderTheme`. Classic is the Light theme in beige and deep green and red, read from CSS variables on the page. Both turn off the axis bands with a transparent `chart.axisBands`, and Midnight Gold the minor gridlines too. Switch between them and the built-in Dark theme.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/styling_CustomTheme/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/styling_CustomTheme/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Two Custom Themes

The same in React: the custom themes go in the provider’s `themes`, so the picker offers them.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="CustomThemeChart" name="../../_examples/styling_CustomTheme/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/styling_CustomTheme/react.tsx
    ```
</CodeSnippetBlock>

## Drawing Colours {#drawing-colours}

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


## Theme Reference {#theme-reference}

<details>
<summary>createSciTraderTheme, with its TSDoc</summary>

```ts
/**
 * Build a theme by overriding parts of another. Nested groups merge, so an override lists only
 * the colours it changes:
 *
 * ```ts
 * const theme = createSciTraderTheme(SCITRADER_DARK_THEME, {
 *     name: "Teal candles",
 *     studies: {
 *         OHLC: { brushUp: "#26A69AB2", strokeUp: "#26A69A" },
 *         SMA: { strokeColor: "#FFFFFF" },
 *     },
 * });
 * ```
 *
 * The result is a new object; `base` is not modified.
 */
function createSciTraderTheme(base?: ISciTraderTheme, overrides?: TSciTraderThemeOverrides): ISciTraderTheme;
```

</details>

<details>
<summary>The ISciTraderTheme interface and its colour groups, with their TSDoc</summary>

```ts
/**
 * A SciTrader theme: every colour the SDK and its React components draw with, in one object.
 *
 * - **Charts** take a theme as the `theme` option (`SciFinanceChartPanel.create`,
 *   `SciFinanceChart.createWithStudies`, `<SciFinanceChartView config>`), and switch a live chart with
 *   `SciFinanceChart.setTheme`. WebGL can't read CSS, so the chart applies the colours itself.
 * - **HTML and CSS** (the vanilla SDK toolbars and overlays, and the React components) read the theme
 *   as CSS custom properties. `SciTraderThemeProvider`, and each chart view on its own container,
 *   writes them. Every colour in the `chart`, `candles`, `market` and `ui` groups becomes one variable,
 *   named `--st-<group>-<property in kebab case>`: `ui.textMuted` is `--st-ui-text-muted`. Study colours
 *   are not written as variables.
 *
 * The SDK ships three themes, `SCITRADER_DARK_THEME` (the default), `SCITRADER_LIGHT_THEME` and
 * `SCITRADER_OCEAN_THEME`, listed in picker order by `SCITRADER_THEMES`. Build a
 * custom theme with `createSciTraderTheme(base, overrides)` rather than from scratch, so colours added
 * to the SDK later still have a value.
 *
 * **Colour values** are CSS colour strings: `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb(…)` / `rgba(…)` or a
 * colour name. Values drawn by WebGL (everything in `chart`, `candles` and `studies`) must be a form
 * SciChart parses: hex, `rgb(…)`, `rgba(…)` or a colour name. `var(…)`, `color-mix(…)` and gradients
 * work only in the groups that are applied as CSS (`ui`, and `market` where noted).
 *
 * **Explicit settings win over the theme.** A theme supplies defaults. A colour passed explicitly (in
 * `axisDefaults`, `surfaceConfig`, a study's constructor options, or edited in a study's settings
 * form) is kept, including across `setTheme`.
 */
interface ISciTraderTheme {
    /**
     * Display name, e.g. `"SciTrader Dark"`. Used to label the theme in pickers, and written to the
     * `data-scitrader-theme` attribute of `SciTraderThemeProvider`'s element for CSS selectors and
     * tests. Give each theme a distinct name.
     */
    name: string;
    /**
     * `true` for a theme with a dark background. `createMuiThemeFromSciTrader` reads it to set MUI's
     * palette `mode`, which decides MUI's own light or dark defaults for colours this theme does
     * not set. Make it agree with the colours: {@link ISciTraderUiColors.overlayRgb} in particular
     * should be white on a dark theme and black on a light one.
     */
    isDark: boolean;
    /**
     * CSS `font-family` for HTML text. It is set on `SciTraderThemeProvider`'s element (so the React
     * components inherit it), written as `--st-font-family` (read by the vanilla drawing-tools flyout),
     * and passed to MUI's typography by `createMuiThemeFromSciTrader`. The chart legend and crosshair
     * labels use their own font and do not read it. Axis tick labels are drawn by WebGL and do not
     * use it either. To change their font, register one with SciChart
     * (`sciChartSurface.registerFont`) and set `labelStyle.fontFamily` in `axisDefaults`.
     */
    fontFamily: string;
    /** The chart itself: surface, axes, gridlines, crosshair, legend and in-chart overlays. */
    chart: ISciTraderChartColors;
    /** Price-series colours that are not settings-form controls: line and mountain types, point & figure. */
    candles: ISciTraderCandleColors;
    /** Order-book colours: bid and ask, for the market-depth panel and order-book studies. */
    market: ISciTraderMarketColors;
    /**
     * The default colours of each study, keyed by `EStudyType`, then by the study's own colour-control
     * name. The keys are exactly the controls the study's settings form shows, so a theme sets what
     * the form would. See {@link ISciTraderStudyColors}.
     */
    studies: ISciTraderStudyColors;
    /** Application chrome: panels, text, buttons, toolbars, menus, scrollbars, for HTML components. */
    ui: ISciTraderUiColors;
    /**
     * Default colours of the drawing tools: lines, fills, labels, grips and the selection outline,
     * for any drawing whose tool doesn't give it a colour of its own. The built-in themes derive
     * them from their text, selection and background colours (see `deriveDrawingColors`), and
     * `createSciTraderTheme` re-derives them when an override changes those.
     */
    drawing: ISciTraderDrawingColors;
}
/**
 * Colours for user drawings (trend lines, channels, Fibonacci tools, patterns…).
 *
 * Tools with a colour of their own keep it: the orange horizontal line, the cyan Schiff pitchfork,
 * the coloured pattern presets. These are the neutral defaults: what a drawing uses when its tool
 * leaves a colour unset, and what `scichart-financial-tools` would otherwise hard-code (white lines
 * and grips, which disappear on a light chart). The chart applies them as drawings are placed or
 * restored, and moves them on `setTheme`. A colour the user set in a drawing's editor is kept.
 *
 * Drawings are SVG, so any SVG colour works, but prefer hex or `rgba(…)`.
 */
interface ISciTraderDrawingColors {
    /**
     * Lines of drawings whose tool sets no colour: the channel's edges, poly line, extended line,
     * angle line. Their labels follow the line. Derived from `ui.text`. CSS: `--st-drawing-line`.
     */
    line: string;
    /**
     * Neutral area fill, e.g. the cyclic arc's. Use a low alpha. Derived from `ui.selection` at 20%.
     * CSS: `--st-drawing-fill`.
     */
    fill: string;
    /**
     * Label text with no colour of its own, e.g. Fibonacci level labels in single-colour mode.
     * Derived from `chart.axisLabel`. CSS: `--st-drawing-text`.
     */
    text: string;
    /** Outline of the drag handles on a selected or placing drawing. Derived from `ui.text`. CSS: `--st-drawing-grip-stroke`. */
    gripStroke: string;
    /**
     * Fill of the drag handles, so they read as holes in the line. Derived from `chart.background`
     * (`ui.background` when that is transparent). CSS: `--st-drawing-grip-fill`.
     */
    gripFill: string;
    /** Outline drawn around a selected drawing. Derived from `ui.selection`. CSS: `--st-drawing-selection`. */
    selection: string;
}
/**
 * Colours of the chart surface and what is drawn on it, other than the series.
 *
 * All are drawn by WebGL or SciChart annotations, except where a property says it is also written as
 * a CSS variable for an HTML overlay.
 */
interface ISciTraderChartColors {
    /**
     * Fill behind the plot area of every pane. In sub-chart mode it fills the one parent surface the
     * panes are drawn on, including the gaps between panes. `"transparent"` lets the host page show
     * through. A pane background set in `surfaceConfig` takes precedence. CSS: `--st-chart-background`,
     * used by the Sandbox as the chart area's own background.
     */
    background: string;
    /** Fill of the axis strips, behind the tick labels (axis `backgroundColor`). CSS: `--st-chart-axis-background`. */
    axisBackground: string;
    /** Major gridlines, both directions (axis `majorGridLineStyle.color`). CSS: `--st-chart-grid-line`. */
    gridLine: string;
    /**
     * Minor gridlines, between the major ones (axis `minorGridLineStyle.color`), and also the minor
     * tick marks. Only visible where an axis draws minor gridlines. CSS: `--st-chart-minor-grid-line`.
     */
    minorGridLine: string;
    /**
     * The alternating stripes between major gridlines (axis `axisBandsFill`). Only visible where an
     * axis has `drawMajorBands` on, which is SciChart's default. Use a very low alpha. CSS:
     * `--st-chart-axis-bands`.
     */
    axisBands: string;
    /** Major tick marks on the axes (axis `majorTickLineStyle.color`). CSS: `--st-chart-tick-line`. */
    tickLine: string;
    /** Axis tick label text (axis `labelStyle.color`). CSS: `--st-chart-axis-label`. */
    axisLabel: string;
    /**
     * Axis tick label size, in CSS pixels (axis `labelStyle.fontSize`). As a CSS variable it is
     * written with its unit: `--st-chart-axis-label-font-size: 12px`.
     */
    axisLabelFontSize: number;
    /** The crosshair's horizontal and vertical lines. CSS: `--st-chart-crosshair`. */
    crosshair: string;
    /** The small square where the crosshair lines cross. CSS: `--st-chart-crosshair-dot`. */
    crosshairDot: string;
    /**
     * Background of the crosshair's value tags on the axes: the price tag on the Y axis and the time
     * tag on the X axis. CSS: `--st-chart-crosshair-label-background`.
     */
    crosshairLabelBackground: string;
    /**
     * Text of the crosshair's axis tags, and of the current-price tag
     * ({@link currentPriceLine}). Choose it to contrast with both. CSS:
     * `--st-chart-crosshair-label-text`.
     */
    crosshairLabelText: string;
    /**
     * Legend labels in the top-left of each pane ("O", "H", "V", "RSI"…). Each value in the legend is
     * drawn in its own series' colour instead. CSS: `--st-chart-legend-text`.
     */
    legendText: string;
    /** Legend text size in CSS pixels. As a CSS variable: `--st-chart-legend-font-size: 13px`. */
    legendFontSize: number;
    /**
     * The dashed horizontal line at the latest close on the price pane, and the fill of its price tag
     * on the Y axis. The tag's text is {@link crosshairLabelText}. CSS: `--st-chart-current-price-line`.
     */
    currentPriceLine: string;
    /**
     * Full-height wash over the still-forming candle's time slot on the price pane. Use a very low
     * alpha. CSS: `--st-chart-open-candle-wash`.
     */
    openCandleWash: string;
    /** Fill of the rubber-band rectangle dragged with the right mouse button to zoom. CSS: `--st-chart-rubber-band-fill`. */
    rubberBandFill: string;
    /** Outline of the rubber-band zoom rectangle. CSS: `--st-chart-rubber-band-stroke`. */
    rubberBandStroke: string;
    /**
     * Translucent tint over regions of the chart whose data is still loading. Applied as CSS through
     * `--st-chart-loading-tint`, by the SDK's loading-region overlay and the React chart-loading
     * overlay, so any CSS colour works here.
     */
    loadingTint: string;
    /**
     * Horizontal guide lines inside indicator panes: RSI's overbought and oversold levels, CCI's ±100,
     * Williams %R's and MFI's levels, and the book-imbalance zero line. CSS: `--st-chart-reference-line`.
     */
    referenceLine: string;
    /**
     * Wash between a pair of reference lines: RSI's band between oversold and overbought. Use a very
     * low alpha. CSS: `--st-chart-reference-band`.
     */
    referenceBand: string;
}
/**
 * Price-series colours that are not settings-form controls.
 *
 * Candle bodies and wicks are the OHLC study's controls, so they live in
 * {@link ISciTraderStudyColors.OHLC}. Renko bricks use those too.
 */
interface ISciTraderCandleColors {
    /**
     * The price line of the `Line` and `Mountain` candle types (`ECandleType`). If the user has set the
     * OHLC study's bullish stroke to something other than the theme's, that colour is used instead.
     * CSS: `--st-candles-line`.
     */
    line: string;
    /** Area fill under the `Mountain` candle type's line. Use a low alpha. CSS: `--st-candles-mountain-fill`. */
    mountainFill: string;
    /**
     * The X markers (rising columns) of the point & figure study. Follows `setTheme`. CSS:
     * `--st-candles-point-and-figure-x`.
     */
    pointAndFigureX: string;
    /** The O markers (falling columns) of the point & figure study. As {@link pointAndFigureX}. CSS: `--st-candles-point-and-figure-o`. */
    pointAndFigureO: string;
}
/**
 * Order-book colours. The market-depth panel (`MarketDepthPanel`, drawn by `MarketDepthGrid`) takes
 * them through the market-depth settings: a settings colour still at its built-in default follows
 * the theme (see `themeMarketDepthSettings`), and one the user changed in the settings dialog is
 * kept. The panel's DOM parts (header, hover readout) read them as CSS variables.
 *
 * The order-book studies' own line and fill colours are study controls, in
 * {@link ISciTraderStudyColors.OrderBookImbalance}.
 */
interface ISciTraderMarketColors {
    /** Bid (buy side) prices in the depth ladder. CSS: `--st-market-bid`. */
    bid: string;
    /** Ask (sell side) prices in the depth ladder. CSS: `--st-market-ask`. */
    ask: string;
    /**
     * Cumulative-depth bars behind bid rows in the depth ladder. Alpha is part of the value: the bars
     * sit under the text. CSS: `--st-market-bid-bar`.
     */
    bidBar: string;
    /** Cumulative-depth bars behind ask rows, as {@link bidBar}. CSS: `--st-market-ask-bar`. */
    askBar: string;
    /** Flash on a price level whose resting size was just pulled. CSS: `--st-market-flash`. */
    flash: string;
    /** Horizontal rules between rungs in the depth ladder. CSS: `--st-market-grid-line`. */
    gridLine: string;
    /** Wash over the rungs the pointer would sweep, in the depth ladder. CSS: `--st-market-highlight`. */
    highlight: string;
    /** Edge line at the far end of the swept rungs, in the depth ladder. CSS: `--st-market-highlight-edge`. */
    highlightEdge: string;
    /** Size and total columns, and other primary text, in the depth ladder. CSS: `--st-market-text`. */
    text: string;
    /**
     * Secondary text in the depth ladder (column headings, totals, spread), and the labels of the
     * book-imbalance study's gauge. CSS: `--st-market-text-muted`.
     */
    textMuted: string;
}
/**
 * Each study's default colours.
 *
 * Keyed by `EStudyType` value, then by the study's colour-control name. Each nested property is one
 * colour control in the study's settings form, and its doc names the form label. A study attached
 * to a chart takes these as its defaults. `setTheme` moves a control to the new theme's value only
 * while it still shows the old theme's, so colours the user or the caller chose are kept. "Reset to
 * defaults" in the form resets to the current theme's values.
 *
 * Studies without an entry (point & figure, Renko, sparklines, custom studies) are not themed through
 * this map.
 */
interface ISciTraderStudyColors {
    /** `OHLCStudy`: the price series (candlestick, OHLC bars, Heikin-Ashi; Renko bricks use the same colours). */
    OHLC: ISciTraderOhlcColors;
    /** `VolumeStudy`: volume columns under the price. */
    Volume: ISciTraderVolumeColors;
    /** `VolumeProfileStudy`: volume-at-price histogram on the price pane. */
    VolumeProfile: ISciTraderVolumeProfileColors;
    /** `RSIStudy`: Relative Strength Index. */
    RSI: ISciTraderRsiColors;
    /** `MACDStudy`: MACD line, signal line and histogram. */
    MACD: ISciTraderMacdColors;
    /** `SMAStudy`: simple moving average. */
    SMA: ISciTraderLineColors;
    /** `EMAStudy`: exponential moving average. */
    EMA: ISciTraderLineColors;
    /** `WMAStudy`: weighted moving average. */
    WMA: ISciTraderLineColors;
    /** `VWAPStudy`: volume-weighted average price. */
    VWAP: ISciTraderLineColors;
    /** `PSARStudy`: parabolic stop and reverse. */
    PSAR: ISciTraderPsarColors;
    /** `BollingerBandsStudy`: Bollinger Bands. */
    BBANDS: ISciTraderBollingerColors;
    /** `DonchianChannelsStudy`: Donchian channels. */
    Donchian: ISciTraderChannelColors;
    /** `KeltnerChannelsStudy`: Keltner channels. */
    Keltner: ISciTraderChannelColors;
    /** `IchimokuCloudStudy`: Ichimoku cloud. */
    Ichimoku: ISciTraderIchimokuColors;
    /** `ATRStudy`: average true range. */
    ATR: ISciTraderLineColors;
    /** `CCIStudy`: commodity channel index. Its ±100 guide lines are {@link ISciTraderChartColors.referenceLine}. */
    CCI: ISciTraderLineColors;
    /** `WilliamsRStudy`: Williams %R. Its guide lines are {@link ISciTraderChartColors.referenceLine}. */
    WilliamsR: ISciTraderLineColors;
    /** `StochasticStudy`: stochastic oscillator. */
    Stochastic: ISciTraderStochasticColors;
    /** `ROCStudy`: rate of change. */
    ROC: ISciTraderLineColors;
    /** `OBVStudy`: on-balance volume. */
    OBV: ISciTraderLineColors;
    /** `MFIStudy`: money flow index. Its guide lines are {@link ISciTraderChartColors.referenceLine}. */
    MFI: ISciTraderLineColors;
    /** `ADXStudy`: average directional index with +DI and −DI. */
    ADX: ISciTraderAdxColors;
    /** `TRIXStudy`: triple-smoothed EMA oscillator. */
    TRIX: ISciTraderLineColors;
    /** `AwesomeOscillatorStudy`: awesome oscillator histogram. */
    AO: ISciTraderUpDownColors;
    /** `ForceIndexStudy`: force index. */
    ForceIndex: ISciTraderLineColors;
    /**
     * `OrderBookHeatmapStudy`: the order-book liquidity heatmap. Its colour scale is a preset
     * rather than single colours, so the theme picks the preset.
     */
    OrderBookHeatmap: ISciTraderHeatmapColors;
    /** `OrderBookImbalanceStudy`: bid-versus-ask depth imbalance. Its zero line is {@link ISciTraderChartColors.referenceLine}. */
    OrderBookImbalance: ISciTraderOrderBookImbalanceColors;
    /** `LargeTradeStudy`: markers for unusually large trades. */
    LargeTrade: ISciTraderLargeTradeColors;
    /** `LineStudy`: a plain line through any data source. */
    Line: ISciTraderLineColors;
}
/** A study drawn as a single line. */
interface ISciTraderLineColors {
    /** The line. Form label: "Stroke Color". */
    strokeColor: string;
}
/** A study drawn as a histogram coloured by direction. */
interface ISciTraderUpDownColors {
    /** Bars that rose from the previous bar. Form label: "Up Color". */
    upColor: string;
    /** Bars that fell from the previous bar. Form label: "Down Color". */
    downColor: string;
}
/** `OHLCStudy`: candle, bar and Heikin-Ashi colours. */
interface ISciTraderOhlcColors {
    /** Body fill of rising candles (close ≥ open). Form label: "Bullish Fill". */
    brushUp: string;
    /** Body fill of falling candles. Form label: "Bearish Fill". */
    brushDown: string;
    /**
     * Wick and body outline of rising candles, and the whole bar on the OHLC-bars type. Form label:
     * "Bullish Stroke".
     */
    strokeUp: string;
    /** Wick and body outline of falling candles, and the whole bar on the OHLC-bars type. Form label: "Bearish Stroke". */
    strokeDown: string;
}
/** `VolumeStudy`: volume columns. */
interface ISciTraderVolumeColors {
    /** Columns under rising candles. Use a moderate alpha so candles stay readable over them. Form label: "Up Color". */
    volumeUpColor: string;
    /** Columns under falling candles. Form label: "Down Color". */
    volumeDownColor: string;
}
/** `VolumeProfileStudy`: volume-at-price histogram. */
interface ISciTraderVolumeProfileColors {
    /** The histogram bars. Use a low alpha: they sit over the candles. Form label: "Bar Fill". */
    fill: string;
    /** The point of control: the price level with the most volume. Form label: "POC Color". */
    pointOfControlColor: string;
}
/** `RSIStudy`: RSI line and threshold fills. Its level lines and band are {@link ISciTraderChartColors.referenceLine} / `referenceBand`. */
interface ISciTraderRsiColors {
    /** The RSI line. Form label: "Stroke Color". */
    strokeColor: string;
    /** Fill between the line and the overbought level where RSI is above it. Form label: "Overbought fill". */
    overboughtFill: string;
    /** Fill between the line and the oversold level where RSI is below it. Form label: "Oversold fill". */
    oversoldFill: string;
}
/** `MACDStudy`: MACD and signal lines, the fill between them, and the histogram. */
interface ISciTraderMacdColors {
    /** The MACD line (fast EMA minus slow EMA). Form label: "MACD Line". */
    bandMacdColor: string;
    /** The signal line (EMA of the MACD line). Form label: "Signal Line". */
    bandSignalColor: string;
    /** Fill between the lines where MACD is above the signal line. Form label: "Fill (MACD above Signal)". */
    fillMacdAboveSignal: string;
    /** Fill between the lines where MACD is below the signal line. Form label: "Fill (MACD below Signal)". */
    fillMacdBelowSignal: string;
    /** Histogram columns above zero. Form label: "Histogram Above Zero". */
    histogramAboveZero: string;
    /** Histogram columns below zero. Form label: "Histogram Below Zero". */
    histogramBelowZero: string;
}
/** `PSARStudy`: parabolic SAR dots. */
interface ISciTraderPsarColors {
    /** The SAR dots above or below the candles. Form label: "Dot Color". */
    dotColor: string;
}
/** `BollingerBandsStudy`: the three bands and the envelope between the outer two. */
interface ISciTraderBollingerColors {
    /** Upper band (moving average plus N standard deviations). Form label: "Upper Band Color". */
    upperBandColor: string;
    /** Lower band (moving average minus N standard deviations). Form label: "Lower Band Color". */
    lowerBandColor: string;
    /** Middle band (the moving average). Form label: "Middle Band Color". */
    middleBandColor: string;
    /** Fill between the upper and lower bands. Use a low alpha. Form label: "Band Fill". */
    bandFillColor: string;
}
/** `DonchianChannelsStudy` and `KeltnerChannelsStudy`: channel lines, basis and channel fill. */
interface ISciTraderChannelColors {
    /** Upper channel line. Form label: "Upper Band Color". */
    upperBandColor: string;
    /** Lower channel line. Form label: "Lower Band Color". */
    lowerBandColor: string;
    /** Fill between the upper and lower lines. Use a low alpha. Form label: "Channel Fill". */
    channelFillColor: string;
    /** Centre line: Donchian's midpoint, Keltner's moving average. Form label: "Basis Color". */
    basisColor: string;
}
/** `IchimokuCloudStudy`: the five Ichimoku lines and the cloud. */
interface ISciTraderIchimokuColors {
    /** Tenkan-sen, the conversion line. Form label: "Tenkan Color". */
    tenkanColor: string;
    /** Kijun-sen, the base line. Form label: "Kijun Color". */
    kijunColor: string;
    /** Senkou span A, the cloud's first edge. Form label: "Senkou A Color". */
    senkouAColor: string;
    /** Senkou span B, the cloud's second edge. Form label: "Senkou B Color". */
    senkouBColor: string;
    /** Chikou span, the lagging line. Form label: "Chikou Color". */
    chikouColor: string;
    /** Cloud fill where span A is above span B. Use a low alpha. Form label: "Cloud (Bullish)". */
    cloudBullishColor: string;
    /** Cloud fill where span B is above span A. Use a low alpha. Form label: "Cloud (Bearish)". */
    cloudBearishColor: string;
}
/** `StochasticStudy`: the %K and %D lines. */
interface ISciTraderStochasticColors {
    /** %K, the fast line. Form label: "%K Color". */
    strokeK: string;
    /** %D, the slow (signal) line. Form label: "%D Color". */
    strokeD: string;
}
/** `ADXStudy`: ADX and the two directional indicators. */
interface ISciTraderAdxColors {
    /** The ADX line (trend strength). Form label: "ADX Color". */
    adxColor: string;
    /** +DI, the positive directional indicator. Form label: "+DI Color". */
    pdiColor: string;
    /** −DI, the negative directional indicator. Form label: "-DI Color". */
    mdiColor: string;
}
/** `OrderBookHeatmapStudy`: the heatmap's colour scale. */
interface ISciTraderHeatmapColors {
    /**
     * The colour-scale preset the heatmap starts with (`THeatmapPalette`): `"liquidity"`,
     * `"inferno"`, `"viridis"` or `"grayscale"`. Each preset has a ramp for dark backgrounds and
     * one for light, chosen by the theme's `isDark`: on a dark theme thin liquidity fades into the
     * background and walls glow; on a light theme the ramp runs the other way, and Liquidity's
     * walls are deep navy. Form label: "Colour scale".
     */
    palette: string;
}
/** `OrderBookImbalanceStudy`: imbalance fill and line, by which side dominates. */
interface ISciTraderOrderBookImbalanceColors {
    /** Where resting bid depth outweighs ask depth (imbalance above zero). Form label: "Bid-heavy colour". */
    bidColor: string;
    /** Where resting ask depth outweighs bid depth (imbalance below zero). Form label: "Ask-heavy colour". */
    askColor: string;
}
/** `LargeTradeStudy`: large-trade markers. */
interface ISciTraderLargeTradeColors {
    /** Markers for large buys (taker bought). Form label: "Buy Color". */
    buyColor: string;
    /** Markers for large sells (taker sold). Form label: "Sell Color". */
    sellColor: string;
}
/**
 * Application chrome, for the HTML parts of SciTrader: the vanilla SDK toolbars (pane splitter
 * toolbar and control bar, dividers, restore strip, on-chart buttons, inline annotation toolbar,
 * drawing toolbar) and the React components.
 *
 * Every property is applied as CSS through its variable, `--st-ui-<property in kebab case>`, so any CSS
 * colour works, including `var(…)` and `color-mix(…)`. `createMuiThemeFromSciTrader` also maps
 * `background`, `surface`, `text`, `textMuted`, `accent` and `overlayRgb` onto the MUI palette.
 */
interface ISciTraderUiColors {
    /**
     * Main app background, and the background of side panels such as the watchlist and the studies
     * and drawing lists. MUI `palette.background.default`. CSS: `--st-ui-background`.
     */
    background: string;
    /**
     * Raised surfaces on {@link background}: dialogs, cards, selector buttons, skeleton blocks. MUI
     * `palette.background.paper`. CSS: `--st-ui-surface`.
     */
    surface: string;
    /** {@link surface} under the pointer, for hovered buttons in the app bars. CSS: `--st-ui-surface-hover`. */
    surfaceHover: string;
    /** Panels directly behind or beside the chart, e.g. the right-hand drawer's content panels. CSS: `--st-ui-panel`. */
    panel: string;
    /**
     * The page behind the app's panels, and the darkest panels: the drawing-tools catalogue, modal and
     * sheet, and parts of the watchlist. CSS: `--st-ui-page-background`.
     */
    pageBackground: string;
    /** Primary text and icons: titles, values, active labels. MUI `palette.text.primary`. CSS: `--st-ui-text`. */
    text: string;
    /**
     * Secondary text, between {@link text} and {@link textMuted}: list rows and item labels in the
     * drawing-tools lists. CSS: `--st-ui-text-secondary`.
     */
    textSecondary: string;
    /**
     * De-emphasised text and icons: captions, column headings, hints, inactive tabs. MUI
     * `palette.text.secondary`. CSS: `--st-ui-text-muted`.
     */
    textMuted: string;
    /**
     * Brand accent: the active interval chip, the selected tab, primary buttons, focus rings, and
     * translucent accent washes made from it with `color-mix`. MUI `palette.primary.main`. CSS:
     * `--st-ui-accent`.
     */
    accent: string;
    /** {@link accent} under the pointer, for accent-filled buttons. CSS: `--st-ui-accent-hover`. */
    accentHover: string;
    /**
     * First stop of the brand gradient behind selected and primary buttons: the selected sidebar
     * icons, the selected drawing-tools catalogue row, and gradient buttons in the watchlist. CSS:
     * `--st-ui-brand-gradient-start`.
     */
    brandGradientStart: string;
    /** Last stop of the brand gradient. CSS: `--st-ui-brand-gradient-end`. */
    brandGradientEnd: string;
    /** Background of the pane splitter's toolbar and the on-chart zoom / pan button strip. CSS: `--st-ui-toolbar-background`. */
    toolbarBackground: string;
    /**
     * Background of drop-down menus (the pane splitter toolbar's menus), the inline annotation
     * toolbar, and the drawing-tools rail and flyout. CSS: `--st-ui-menu-background`.
     */
    menuBackground: string;
    /** Background of the vanilla layout's per-pane control bar and hidden-pane restore strip. CSS: `--st-ui-pane-control-background`. */
    paneControlBackground: string;
    /**
     * Buttons on the vanilla pane control bar, restore-strip chips under the pointer, and the pane
     * divider while dragged. CSS: `--st-ui-button-background`.
     */
    buttonBackground: string;
    /** Text and icons on {@link buttonBackground}. CSS: `--st-ui-button-text`. */
    buttonText: string;
    /** Icons on the on-chart zoom / pan buttons and the inline annotation toolbar. CSS: `--st-ui-icon`. */
    icon: string;
    /** The drag handle between panes in the vanilla layout. CSS: `--st-ui-divider`. */
    divider: string;
    /** The pane divider under the pointer. CSS: `--st-ui-divider-hover`. */
    dividerHover: string;
    /** Button text on the pane splitter toolbar and the restore strip's chips. CSS: `--st-ui-toolbar-text`. */
    toolbarText: string;
    /**
     * A toggle that is on: the pane splitter toolbar's axis-sync and group toggles when on for every
     * pane, an active pane control, the active item in its menus. CSS: `--st-ui-toolbar-active`.
     */
    toolbarActive: string;
    /**
     * The selected item in a tool rail or list: the active drawing tool's icon and border (with a
     * translucent wash of the same colour behind it). CSS: `--st-ui-selection`.
     */
    selection: string;
    /** A toolbar toggle that is on for some panes and off for others. CSS: `--st-ui-toolbar-mixed`. */
    toolbarMixed: string;
    /** Scrollbar track, in themed scroll areas. CSS: `--st-ui-scrollbar-track`. */
    scrollbarTrack: string;
    /** Scrollbar thumb. CSS: `--st-ui-scrollbar-thumb`. */
    scrollbarThumb: string;
    /** Scrollbar thumb under the pointer (WebKit browsers). CSS: `--st-ui-scrollbar-thumb-hover`. */
    scrollbarThumbHover: string;
    /** A rise: watchlist price ticks and positive changes. CSS: `--st-ui-positive`. */
    positive: string;
    /** A fall: watchlist price ticks and negative changes. CSS: `--st-ui-negative`. */
    negative: string;
    /** Warning text and badges in the chart settings. CSS: `--st-ui-warning`. */
    warning: string;
    /**
     * Destructive actions (delete and reset buttons in the settings, remove in the watchlist's edit
     * mode), and the background of the watchlist's negative-change badges. CSS: `--st-ui-danger`.
     */
    danger: string;
    /**
     * Base colour of every translucent overlay: hover washes, hairline borders, dividers, and inactive
     * icons. It is a space-separated RGB triple, not a colour, so stylesheets can add the alpha:
     * `rgb(var(--st-ui-overlay-rgb) / 0.08)`. Use `"255 255 255"` (white) on a dark theme and
     * `"0 0 0"` (black) on a light one. `createMuiThemeFromSciTrader` builds MUI's divider from it at
     * 12%. CSS: `--st-ui-overlay-rgb`.
     */
    overlayRgb: string;
}
/**
 * What `createSciTraderTheme` takes as overrides: every property optional, two levels deep. For
 * example, `{ chart: { gridLine } }` or `{ studies: { SMA: { strokeColor } } }` sets just those
 * colours, and the rest come from the base theme.
 */
type TSciTraderThemeOverrides = {
    [K in keyof ISciTraderTheme]?: ISciTraderTheme[K] extends object ? {
        [P in keyof ISciTraderTheme[K]]?: ISciTraderTheme[K][P] extends object ? Partial<ISciTraderTheme[K][P]> : ISciTraderTheme[K][P];
    } : ISciTraderTheme[K];
};
```

</details>

<details>
<summary>deriveDrawingColors and withAlpha, with their TSDoc</summary>

```ts
/**
 * The drawing colours that follow from a theme's other colours, so a theme needs no drawing
 * section of its own: lines and grips in the text colour, labels in the axis-label colour, the
 * selection outline and neutral fill from the selection colour, grip holes in the chart background.
 */
function deriveDrawingColors(theme: Pick<ISciTraderTheme, "chart" | "ui">): ISciTraderDrawingColors;
/** `colour` with its alpha set to `alpha` (0–255) when it is a form `normaliseColour` reads; else unchanged. */
function withAlpha(colour: string, alpha: number): string;
```

</details>

## Where to read next

- [Styling the Chart](/financial-charts/styling-and-themes/styling-the-chart/): axes, fonts, the legend and crosshair, which a theme doesn't cover.
- [The CSS Stylesheet](/financial-charts/styling-and-themes/css-stylesheet/): restyle the controls with CSS.
- [Mobile and Responsive Styling](/financial-charts/styling-and-themes/mobile-and-responsive/): a theme variant with larger text for phones.
