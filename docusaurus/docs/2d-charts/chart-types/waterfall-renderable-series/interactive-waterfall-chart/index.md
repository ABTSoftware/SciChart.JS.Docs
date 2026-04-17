---
sidebar_position: 1
---

# Interactive Waterfall (Spectral) Chart

The Interactive Waterfall Chart is a scientific visualization that stacks multiple spectral line series in a 3D-like perspective. Each series represents a slice of data at a point in time or frequency, creating the appearance of a waterfall of spectra. Hover and click interactions let users select and compare individual slices.

:::tip
The [JavaScript Interactive Waterfall Chart Example](https://www.scichart.com/demo/react/interactive-waterfall-chart) can be found in the [SciChart.JS Examples Suite](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/FeaturedApps/ScientificCharts/InteractiveWaterfallChart) on GitHub, or in the live demo at [scichart.com/demo](https://www.scichart.com/demo/react/interactive-waterfall-chart).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/interactive-waterfall-chart"
    title="Interactive Waterfall Spectral Chart"
/>

## How the Waterfall Effect Works

SciChart.js has no single "waterfall series" type. The depth-stacking effect is achieved by:

1. Creating **one `FastLineRenderableSeries` per slice**, each bound to its own X and Y axis.
2. Setting **`overrideOffset`** on each axis to shift it by a fixed pixel amount, nudging every successive series further back in the visual stack.
3. Hiding all axes **except the frontmost one**, so the chart reads cleanly while still using multiple coordinate systems internally.

```ts showLineNumbers file=./demo/demo.ts start=#region_A_start end=#region_A_end
```

<LiveDocSnippet name="./demo/demo" />

In the code above:

- **`overrideOffset: 3 * -i`** on each Y axis shifts it 3 px upward per slice, moving each series higher than the previous one.
- **`overrideOffset: 2 * i`** on each X axis shifts it 2 px to the right per slice, adding the horizontal perspective tilt.
- **`isVisible: i === seriesCount - 1`** shows only the frontmost axis so tick marks and labels appear only once.
- **`SeriesSelectionModifier`** with `enableHover` and `enableSelection` highlights individual slices on hover and click.
- Zoom and pan are restricted to the **X direction** so the depth offset is never accidentally distorted.

## The `overrideOffset` Property

`overrideOffset` lets you bypass SciChart's automatic axis layout and position an axis at an exact pixel offset from its default location. This is what makes the 3D stacking possible: by incrementing the offset for each successive axis, you physically move each layer back in the chart.

:::tip
For a deeper explanation of `overrideOffset` and how it interacts with SciChart's layout system, see [Axis Offset and overrideOffset](/2d-charts/axis-api/multi-axis-and-layout/axis-offset-and-overrideOffset/).
:::

## Series Selection and Highlighting

Attach a `SeriesSelectionModifier` to enable hover and click highlighting across all series:

```ts
new SeriesSelectionModifier({
    enableHover: true,
    enableSelection: true,
    onHoverChanged: (args) => {
        args.allSeries.forEach((s) => {
            s.stroke = s.isHovered || s.isSelected ? "#FFBE93" : "#64BAE4";
            s.strokeThickness = s.isHovered || s.isSelected ? 3 : 1;
        });
    },
    onSelectionChanged: (args) => {
        args.allSeries.forEach((s) => {
            s.stroke = s.isSelected ? "White" : s.isHovered ? "#FFBE93" : "#64BAE4";
            s.strokeThickness = s.isSelected || s.isHovered ? 3 : 1;
        });
    },
})
```

The full [SciChart.JS Examples interactive version](https://www.scichart.com/demo/react/interactive-waterfall-chart) extends this further with a draggable cross-section annotation and two linked detail charts — see the [source on GitHub](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/FeaturedApps/ScientificCharts/InteractiveWaterfallChart) for the complete implementation.

## See Also

- [The Waterfall Chart Type](/2d-charts/chart-types/waterfall-renderable-series/) — financial waterfall charts built with Rectangle Series
- [Axis Offset and overrideOffset](/2d-charts/axis-api/multi-axis-and-layout/axis-offset-and-overrideOffset/) — the key property enabling the depth-stacking effect
- [SeriesSelectionModifier](/2d-charts/chart-modifier-api/selection/series-selection/) — adding hover and click selection to series
- [Multi-Axis Charts](/2d-charts/axis-api/multi-axis-and-layout/) — working with multiple axes
