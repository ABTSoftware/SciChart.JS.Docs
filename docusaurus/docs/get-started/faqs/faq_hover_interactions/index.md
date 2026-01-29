---
sidebar_position: 5
---

# Hover and Click Interactions

In SciChart.js, you can implement both click and hover events on charts using several different approaches. Here are the main methods for detecting these interactions:

## Click Events on Charts

### Custom Chart Modifier for Click Detection

<!-- [RolloverModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/rollovermodifier.html) -->

The most flexible approach is creating a CustomChartModifier that extends [ChartModifierBase2D:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/chartmodifierbase2d.html)

```ts {1} showLineNumbers file=./demo.ts start=region_A_start end=region_A_end

```

<LiveDocSnippet name="./demo" />

### Series Selection Modifier

For built-in series click functionality, use the [SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/seriesselectionmodifier.html)

```ts {1} showLineNumbers file=./demo1.ts start=region_A_start end=region_A_end

```

<LiveDocSnippet name="./demo1" />

## Hover Events on Charts

### Hover Detection with Series Selection Modifier

Enable hover detection using the [SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/seriesselectionmodifier.html)

```ts {1} showLineNumbers file=./demo2.ts start=region_A_start end=region_A_end

```

<LiveDocSnippet name="./demo2" />

### Series-Level Hover Events

You can attach hover callbacks directly to RenderableSeries

```ts {8} showLineNumbers file=./demo3.ts start=region_A_start end=region_A_end

```

<LiveDocSnippet name="./demo3" />

### Custom Modifier for Advanced Hover Detection

For detecting hover on specific chart parts (axes, series, chart area), create a custom modifier

```ts {1} showLineNumbers file=./demo4.ts start=region_A_start end=region_A_end

```

<LiveDocSnippet name="./demo4" />

### Annotation Hover Events

For annotations, SciChart.js provides dedicated hover functionality

```ts {2} showLineNumbers file=./demo5.ts start=region_A_start end=region_A_end

```

<LiveDocSnippet name="./demo5" />

The ChartModifier API provides comprehensive mouse event handling including modifierMouseDown, modifierMouseUp, modifierMouseMove, modifierDoubleClick, and modifierMouseWheel methods for creating sophisticated chart interactions.
