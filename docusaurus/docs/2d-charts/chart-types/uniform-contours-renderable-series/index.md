---
sidebar_position: 18
---

# The Contours Series Type

Contour maps or Contour-plots can be created using the [UniformContoursRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/uniformcontoursrenderableseries.html) type.

:::tip
The [JavaScript Heatmap Chart Example](https://www.scichart.com/demo/javascript/heatmap-chart) can be found in the [SciChart.Js Examples Suite > Contours Chart](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/Charts2D/BasicChartTypes/ContoursChart) on Github, or our live demo at [scichart.com/demo](https://www.scichart.com/demo/javascript/heatmap-chart).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/heatmap-chart-with-contours"
    title="Uniform Contours Series Chart"
/>

## Create a Contours Plot

SciChart's Contour series is an extremely fast, lightweight chart types for rendering two dimensional data as a contour plot. The [UniformContoursRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/uniformcontoursrenderableseries.html) type should be used in conjunction with a [UniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/uniformheatmapdataseries.html) when you simply want to specify a Step in the X,Y direction (each cell is the same size).

To create a [Javascript Contours Chart](https://www.scichart.com/demo/javascript-heatmap-chart-with-contours) with SciChart.js, use the following code:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {20-22,26,29,40-45} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {5-7,16-30} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

In the code above:

*   We create an empty 2D array `number[][]` using the helper function `zeroArray2D`. This is filled with values in the generateData function
*   A [UniformHeatmapDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/uniformheatmapdataseries.html) instance is created with `xStart`, `xStep`, `yStart`, `yStep` values = `0`, `1`, `0`, `1`. This means the heatmap starts at `(X, Y)` = `(0, 0)` and each cell is `1` on the axis.
*   We set the contour `stroke` and `strokeThickness`.
*   A [UniformContoursRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/uniformcontoursrenderableseries.html) instance is created and added to the [sciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/scichartsurface.html#renderableseries) collection.

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />

## Updating Data in a Contour map

The contour map is supposed to be fully dynamic, enabling real-time graphics. The [Contours Series:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/uniformcontoursrenderableseries.html) however does not support append, insert, update, remove functions like other DataSeries do. You can however update the data and force a refresh simply by updating the data passed in. To do this, use the following code:

```ts {19-20,23-24} showLineNumbers
import { UniformHeatmapDataSeries, zeroArray2D  } from "scichart";

const height = 10; // Set the height of the heatmap
const width = 20; // Set the width of the heatmap

// Create an empty 2D array of size height & width
const initialZValues: number[][] = zeroArray2D([height, width]);
// Create a Heatmap Data-series. Pass the heatValues as a number[][] to the UniformHeatmapDataSeries
const heatmapDataSeries = new UniformHeatmapDataSeries({
    xStart: 0,
    xStep: 1,
    yStart: 0,
    yStep: 1,
    zValues: initialZValues
});

// ...
// Later, update the data
initialZValues[5][6] = 123.4;
heatmapDataSeries.notifyDataChanged() // Notify SciChart that the data has changed

// You can also load an entirely new array with the function UniformHeatmapDataSeries.setZValues
const newZValues; // type number[][]
heatmapDataSeries.setZValues(newZValues);
```

For more details, including a live example of how to update 2D array data for heatmaps and contours, see the [Uniform Heatmap documentation - Updating Heatmaps](/2d-charts/chart-types/uniform-heatmap-renderable-series/updating-realtime/) documentation page. The mechanism for contour plots is the same.

## Contours at arbitrary levels

Using [UniformContoursRenderableSeries.zLevels:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/uniformcontoursrenderableseries.html#zlevels) we can specify arbitrary levels where to draw contour lines.

Use [dataLabels:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/icontoursdatalabelprovideroptions.html) constructor option to tune the way contour labels look.

<CodeSnippetBlock labels={["TS"]}>
    ```ts {23,26-34} showLineNumbers file=./ArbitraryLevels/demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet name="./ArbitraryLevels/demo" />

## Individual colouring for contour lines

By default a contours series draws **every** line in one flat colour, taken from `stroke` (or from
[majorLineStyle:blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/interfaces/icontoursrenderableseriesoptions.html#majorlinestyle) /
[minorLineStyle:blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/interfaces/icontoursrenderableseriesoptions.html#minorlinestyle) when those are set).
That makes it hard to tell one level from another without reading the labels.

:::info New in v6
[UniformContoursRenderableSeries.colorMapMode:blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/classes/uniformcontoursrenderableseries.html#colormapmode)
colours each contour line **individually**, by its own z-value, using the series
[colorMap:blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/classes/heatmapcolormap.html) — so the lines read as a legend on their own, with no background
heatmap needed.
:::

The mode is an [EContourColorMapMode:blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/enums/econtourcolormapmode.html):

| `EContourColorMapMode` | Effect |
|---|---|
| [`SingleColor`:blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/enums/econtourcolormapmode.html#singlecolor) | **The default.** Every line takes the flat colour from `majorLineStyle` / `minorLineStyle`. `colorMap` is used only to normalise the data, not to colour lines |
| [`GradientColors`:blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/enums/econtourcolormapmode.html#gradientcolors) | Each line's colour is interpolated from the gradient at that line's z-value, over the `colorMap` `minimum`..`maximum` range — so the colours follow the data, exactly as a heatmap's do |
| [`AlternateColors`:blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/enums/econtourcolormapmode.html#alternatecolors) | Each line takes the next `gradientStops` colour in turn, **ignoring the offsets**. With stops red, green, blue the lines cycle red, green, blue, red, ... Useful for telling adjacent levels apart when the data range is narrow |

To colour each line by its z-value, set `colorMapMode` together with a `colorMap`:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {8,34-47} showLineNumbers file=./IndividualColoring/demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet name="./IndividualColoring/demo" />

In the code above:

*   `zMin` and `zStep` place a contour line every `20` z-values, so there is one ring per level.
*   `colorMapMode: EContourColorMapMode.GradientColors` switches on per-line colouring.
*   The [colorMap:blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/classes/heatmapcolormap.html) supplies both the gradient and the range it is mapped over. A line at `z = 90` sits halfway through `minimum: 0`..`maximum: 180`, so it takes the colour at gradient offset `0.5`.
*   `strokeThickness` still sets the line width — `colorMapMode` only overrides the *colour*. Set `majorLineStyle` and `minorLineStyle` (with [minorsPerMajor:blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/interfaces/icontoursrenderableseriesoptions.html#minorspermajor)) to give majors and minors different thicknesses; both still take their colour from the `colorMap`.
*   `dataLabels` puts the z-value on each line, so you can read which value a colour stands for. See [Contours at arbitrary levels](#contours-at-arbitrary-levels) above.

:::note
Per-line colouring needs a `colorMap` **with `gradientStops`**. Set `colorMapMode` without one and the series silently
falls back to the flat single-colour path.

It also changes how the lines are drawn: `SingleColor` emits one draw call for all majors and one for all minors, while
the per-line modes enumerate the levels and emit **one draw call per level**. On a chart with very many levels, prefer
`SingleColor`. `colorMapMode` works with [`zLevels`](#contours-at-arbitrary-levels) too.
:::

## Laying labels along the contour lines

The built-in [ContoursDataLabelProvider:blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/classes/contoursdatalabelprovider.html) places labels by
scanning [labelRowCount:blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/interfaces/icontoursdatalabelprovideroptions.html#labelrowcount) evenly
spaced **horizontal rows** across the chart and dropping an **upright** label wherever a row crosses a contour line.
That works well when the lines run roughly horizontally and are well separated. It works less well when they are steep
or tightly packed: the same line picks up one label per row, labels from neighbouring levels end up side by side, and
none of them tell you which line they belong to.

Tools like matplotlib's `clabel` and Plotly instead put each label **on** its line, rotated to follow it. There is no
built-in provider for that, but `dataLabelProvider` is an ordinary property, so you can subclass the built-in one and
replace `generateDataLabels` with your own layout. The chart on the right below does exactly that:

<CodeSnippetBlock labels={["Chart setup", "Custom label provider", "Contour tracer"]}>
    ```ts showLineNumbers file=./AlongLineLabels/demo.ts start=#region_main_start end=#region_main_end
    ```
    ```ts showLineNumbers file=./AlongLineLabels/demo.ts start=#region_provider_start end=#region_provider_end
    ```
    ```ts showLineNumbers file=./AlongLineLabels/demo.ts start=#region_tracer_start end=#region_tracer_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet name="./AlongLineLabels/demo" htmlPath="./AlongLineLabels/demo.html" cssPath="./AlongLineLabels/demo.css" />

How it works:

*   **Find the lines.** The contour geometry lives in a shader, so it is not readable from JavaScript. The *Contour tracer* tab re-derives it with **marching squares**: for every cell of the `zValues` grid, the four corners' positions relative to a level decide which cell edges the line enters and leaves by, and the crossing point on each edge is linearly interpolated. It returns loose **segments** rather than stitched polylines — enough to know where a line is and which way it runs, which is all a label needs.
*   **Ask the series which levels it drew.** [getContourDrawingParams():blue_book:](https://stagingdemo2.scichart.com/documentation/js/v6/typedoc/classes/uniformcontoursrenderableseries.html#getcontourdrawingparams) resolves `zLevels`, or `zMin` / `zMax` / `zStep` / `zOffset`, into the levels actually on screen, so the labels can never disagree with the lines.
*   **Map grid indices to pixels.** The contour surface is a texture stretched over `[xMin, xMax] x [yMin, yMax]` with the data samples at cell *centres*, hence the `+ 0.5`. Going through the render pass's coordinate calculators keeps the labels on the lines under any zoom, pan or axis type.
*   **Thin, then place.** A segment is skipped if a label for the same level already sits within `labelSpacing` pixels — a cheap distance test done *before* any text measurement. What survives gets a `rotationAngle` from the segment's own direction, folded into a quarter turn either way so text is never upside down, and is dropped if its box leaves the chart or lands on a label already placed.
*   **Override `useRotation`.** Returning `true` makes the base class request the transformable font instance; without it `rotationAngle` is ignored.

:::note
This is a deliberately small recipe, not a drop-in replacement for the built-in provider. It traces the whole grid
every render pass rather than caching, spaces labels by straight-line distance rather than arc length, treats major and
minor lines alike, and does not handle vertical (rotated) charts. Its label positions are also not *stable* under zoom
— because the spacing test walks segments in grid order, labels can shift or swap as the chart is zoomed. Pinning them
takes anchoring each label to a position measured in zoom-invariant grid-index arc length, which is what makes a
production implementation of this considerably longer.
:::

#### See Also

* [The Uniform Heatmap Chart Type](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/)
* [The Non-Uniform Heatmap Chart Type](/2d-charts/chart-types/non-uniform-heatmap-renderable-series/)
