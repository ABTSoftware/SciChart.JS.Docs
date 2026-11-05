---
sidebar_position: 4
sidebar_label: Styling the Chart
title: "Style a Candlestick Chart: Candle Colours, Axes, Fonts, Legend | SciTrader.js"
description: "Style a SciTrader.js candlestick chart in JavaScript or React: candle and indicator colours, axis gridlines and fonts, the legend and crosshair, a transparent background, drawings and the order book heatmap."
keywords: ["candlestick chart colours", "style financial chart", "chart axis font", "chart gridlines", "chart legend style", "crosshair style", "indicator colours", "SciTrader.js"]
---

# Styling the Chart

The theme colours the chart. Beyond colours, the chart has options for its axes, legend, crosshair and background:

| To change | Use |
| --- | --- |
| Candle colours | The theme's `studies.OHLC`; see [Creating a Custom Theme](/financial-charts/styling-and-themes/custom-themes/#in-code) |
| One indicator's colours | Its constructor's colours, or the theme's `studies.<type>` for every chart; [below](#indicator-colours) |
| Axis gridlines, bands, labels and fonts | [`axisDefaults`, `applyAxisStyle`](#axes) |
| The legend and crosshair | [`FinChartLegendModifier`'s setters](#legend-and-crosshair) |
| The background | The theme's `chart.background`, or [`surfaceConfig`](#background) |
| Drawings and the order book heatmap | The theme; [below](#drawings) |

## TypeScript Example: Styling the Chart

BTC-USD with an orange SMA, its colour passed to the study, and `axisDefaults` turning off the axis bands and minor gridlines. The buttons switch theme, turn the gridlines on and off with `applyAxisStyle`, enlarge the axis labels and legend, and dash the crosshair (move the mouse over the chart). Switch theme after the others: the orange SMA and your axis options stay.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader name="../../_examples/styling_Chart/vanilla" html={`<div style="display: flex; flex-direction: column; height: 100%"><div id="toolbar"></div><div id="chart" style="flex: 1; min-height: 0"></div></div>`} />

The code for this example is found below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=../../_examples/styling_Chart/vanilla.ts
    ```
</CodeSnippetBlock>

## React Example: Styling the Chart

The same in React: each setting is state, applied to the chart in an effect.

<LiveDocSnippet maxWidth={"100%"} height={650} includeSciTrader reactComponent="ChartStylingChart" name="../../_examples/styling_Chart/react" />

The code for this example is found below.

<CodeSnippetBlock labels={["React"]}>
    ```tsx showLineNumbers file=../../_examples/styling_Chart/react.tsx
    ```
</CodeSnippetBlock>

## Indicator Colours {#indicator-colours}

An indicator's colours come from the theme, `studies.<type>`, unless you pass your own:

```ts
new SMAStudy({ length: 20, renderOptions: { stroke: "#F59E0B", strokeThickness: 2 } });
```

A colour passed to a constructor is kept through every theme switch, as are colours the user edits in the indicator's settings form. To change an indicator's colours on every chart, put them in your theme instead: `studies: { SMA: { strokeColor: "#F59E0B" } }`. The keys are the colour names in each indicator's settings form; [Creating a Custom Theme](/financial-charts/styling-and-themes/custom-themes/#theme-reference) lists them.

## Axes {#axes}

`axisDefaults` takes any SciChart axis option, `IAxisBase2dOptions`, for every axis on every pane, including panes added later. It wins over the theme's axis colours:

```ts
const financeChartPanel = await SciFinanceChartPanel.create(element, {
    // …
    axisDefaults: {
        drawMajorBands: false, // no alternating bands
        drawMinorGridLines: false,
        labelStyle: { fontSize: 13 },
    },
});

// Later, on a live chart: only the options given change
financeChartPanel.financeApi.applyAxisStyle({ drawMajorGridLines: false });
```

**Fonts.** Axis labels are drawn by WebGL, so a font must be registered with SciChart (`sciChartSurface.registerFont`) before `labelStyle.fontFamily` can use it. The theme's `fontFamily` is for the HTML controls only. Each theme sets the label size as `chart.axisLabelFontSize`.

## The Legend and Crosshair {#legend-and-crosshair}

The theme sets their colours and the legend's size (`chart.legendFontSize`). `FinChartLegendModifier`, which draws both, has setters for everything else:

```ts
const legend = financeChartPanel.financeApi.finChartModifiers
    .asArray()
    .find((m): m is FinChartLegendModifier => m instanceof FinChartLegendModifier);

legend.setCrosshairStrokeDashArray([4, 4]); // a dashed crosshair
legend.setLegendFontSize(15);
legend.legendOffsetX = 12; // move the legend
```

- **A theme switch sets the legend's colours and size** back to the theme's, so set them again after `setTheme` if you changed them.
- **After `setTheme` to a theme with a different `legendFontSize`,** call `setLegendFontSize` with it too: the legend doesn't redraw at the new size by itself yet.
- **To hide the crosshair and legend,** e.g. on a touch screen, call `setCursorEnabled(false)`; see [Mobile and Desktop Modes](/financial-charts/sci-finance-chart/mobile-and-desktop-modes/#crosshair).

<details>
<summary>The styling members of FinChartLegendModifier, with their TSDoc</summary>

```ts
class FinChartLegendModifier {
    /**
     * Updates the crosshair stroke color on every already-attached pane's
     * x/y line annotations. Without walking the annotation maps, mutating
     * `this.crosshairStroke` alone has no visible effect — the constructor
     * stamps the value into each LineAnnotation at attach time and never
     * re-reads it.
     */
    setCrosshairStroke(value: string): void;
    /** Live-updates the dash pattern on all attached panes' crosshair lines. */
    setCrosshairStrokeDashArray(value: number[]): void;
    /** Live-updates the dot fill on all attached panes' crosshair-intersection markers. */
    setCrosshairDotFill(value: string): void;
    /**
     * Colours of the crosshair's axis labels (the price and time tags on the axes). The labels
     * are baked into their annotations when created, so this rebuilds the crosshair on every pane.
     */
    setAxisLabelColors(fill: string, text: string): void;
    /**
     * Live-updates the y-axis price tag's font on every pane. A `HorizontalLineAnnotation` draws
     * its tag in its own `axisFontSize` / `axisFontFamily` (SciChart's default 14px), not the
     * axis `labelStyle` the earlier `LineAnnotation` tag used, so `SciFinanceChart` passes the
     * axis label font in here whenever it sets one: at creation, `setTheme` and
     * `applyAxisStyle`. The axis font is drawn by WebGL, so CSS can't reach it.
     */
    setAxisLabelFont(fontSize: number | undefined, fontFamily?: string): void;
    /**
     * Live-updates the text color used by the legend annotation on every attached
     * pane. The template reads `la.valueFill` per-render, but SciChart only
     * re-renders the SVG when the annotation's `template` property fires its
     * change notification — so we re-assign the template to itself after writing
     * the new color, forcing the next paint to pick it up.
     */
    setLegendTextColor(value: string): void;
    /** Live-updates the legend row font size on every attached pane's legend annotation. */
    setLegendFontSize(value: number): void;
    get legendOffsetX(): number;
    set legendOffsetX(value: number);
    get legendOffsetY(): number;
    set legendOffsetY(value: number);
    /**
     * Master on/off for the cursor readout. When `enabled` is `false`, the
     * per-pane legend and the crosshair are hidden completely and pointer moves
     * are ignored — the chart shows no cursor/legend. When `true`, the legend
     * renders again (latest value at rest, hovered value on pointer-move) and
     * the crosshair tracks the pointer.
     *
     * This modifier — not SciChart's built-in `CursorModifier` (never
     * instantiated here) — owns both the crosshair and the legend, so the
     * cursor-toggle button routes through this method.
     */
    setCursorEnabled(enabled: boolean): void;
}
```

</details>

## The Background {#background}

The theme's `chart.background` colours each pane. `surfaceConfig` runs on each pane's SciChart surface as it is created, after the theme, for anything else SciChart can do to a surface:

```ts
surfaceConfig: async ({ sciChartSurface }) => {
    sciChartSurface.background = "transparent"; // show the page behind the chart
},
```

A background set here is yours: a theme switch leaves it alone.

## Drawings {#drawings}

Drawing tools with a colour of their own keep it, like the orange horizontal line or the coloured pattern presets. Everything else a drawing would otherwise draw in white or in SciChart's dark defaults comes from `theme.drawing`:
- the line, for tools that set none (channel, poly line, extended line, angle line);
- neutral fills;
- label text, for labels without their own colour (Fibonacci levels in single-colour mode);
- the drag grips' outline and fill;
- the selection outline.

The chart applies these as drawings are placed or restored from a save, and moves them on `setTheme`. A colour set in a drawing's editor is kept.

The theme’s `drawing` colours set them; see [Creating a Custom Theme](/financial-charts/styling-and-themes/custom-themes/#drawing-colours).


## The Order Book Heatmap {#order-book-heatmap}

Each heatmap colour scale (Liquidity, Inferno, Viridis, Greyscale) has two ramps, one for dark backgrounds and one for light, and the heatmap draws whichever suits the chart's theme (`isDark`):
- **On dark,** thin liquidity fades into the background and walls glow bright.
- **On light,** the ramp runs the other way, from near-transparent pale to dark. Liquidity's walls are deep navy.

A theme switch redraws the current scale in the new ramp without reloading anything. `studies.OrderBookHeatmap.palette` sets the scale a theme starts with. A scale the user picks in the settings is kept for the theme it was picked in, like study colours. A custom ramp is kept as the user made it.


## Where to read next

- [Creating a Custom Theme](/financial-charts/styling-and-themes/custom-themes/): your own candle and indicator colours for every chart.
- [Styling the UI Components](/financial-charts/styling-and-themes/styling-ui-components/): the toolbars and market depth ladder around the chart.
- [SciFinanceChart](/financial-charts/sci-finance-chart/): pane sizes and the rest of the chart's layout.
