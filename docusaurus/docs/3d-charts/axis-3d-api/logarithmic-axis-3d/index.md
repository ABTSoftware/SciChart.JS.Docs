---
sidebar_position: 3
---

# LogarithmicAxis3D

The LogarithmicAxis3D is a 3D axis type where tick values increase exponentially. It is the 3D counterpart of the 2D [LogarithmicAxis](/2d-charts/axis-api/axis-types/logarithmic-axis/), and is ideal when your data spans several orders of magnitude, such as signal magnitudes, power levels, or frequency response data.

Plotting data on a logarithmic axis is equivalent to plotting the log of the data. For example, with the default `logBase: 10` the axis ticks will appear at 0.01, 0.1, 1, 10, 100, 1000. With `logBase: 2` they would appear at 2, 4, 8, 16, 32.

:::note
**Data must be strictly positive.** A `LogarithmicAxis3D` cannot render values that are zero or negative. Clamp your data to a small positive minimum (e.g. `0.01`) before plotting.
:::

## Create and Configure a LogarithmicAxis3D

To use `LogarithmicAxis3D`, import it from `scichart` and assign it to one of the `xAxis`, `yAxis` or `zAxis` properties on [SciChart3DSurface:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/scichart3dsurface.html).

```ts
import { SciChart3DSurface, LogarithmicAxis3D, NumericAxis3D, NumberRange } from "scichart";

const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId);

// Assign a LogarithmicAxis3D to the Y axis
sciChart3DSurface.yAxis = new LogarithmicAxis3D(wasmContext, {
    axisTitle: "Magnitude (log10)",
    logBase: 10,
    visibleRange: new NumberRange(0.05, 200)
});

// Other axes can remain linear
sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "Frequency (Hz)" });
sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Slice" });
```

## The logBase Property

The `logBase` property controls the base of the logarithmic scale:

| `logBase` | Tick values |
|-----------|-------------|
| `10` (default) | 0.01, 0.1, 1, 10, 100, 1000 |
| `2` | 2, 4, 8, 16, 32, 64 |
| `Math.E` | Natural log (e, e², e³, …) |

```ts
// Base-10 (default) - useful for scientific/engineering data
sciChart3DSurface.yAxis = new LogarithmicAxis3D(wasmContext, { logBase: 10 });

// Base-2 - useful for octave-spaced audio or binary data
sciChart3DSurface.yAxis = new LogarithmicAxis3D(wasmContext, { logBase: 2 });
```

## Full Example - 3D Spectral Waterfall with Log Magnitude Axis

The example below shows a spectral waterfall chart: 50 time-domain spectrum slices plotted as 3D line series, with the Y axis (magnitude) rendered on a base-10 logarithmic scale. The data spans from near-zero noise floor values (~0.05) up to peak magnitudes (~80), covering more than three orders of magnitude — a range that benefits greatly from a log scale.

<LiveDocSnippet maxWidth={"100%"} name="./LogarithmicAxis3D/demo" htmlPath="./LogarithmicAxis3D/demo.html" cssPath="./LogarithmicAxis3D/demo.css" />

You will find the full code here.

<CodeSnippetBlock labels={["TS", "HTML", "CSS"]}>
```ts showLineNumbers file=./LogarithmicAxis3D/demo.ts
```
```html showLineNumbers file=./LogarithmicAxis3D/demo.html
```
```css showLineNumbers file=./LogarithmicAxis3D/demo.css
```
</CodeSnippetBlock>

## Inherited Properties from AxisBase3D

`LogarithmicAxis3D` inherits from [AxisBase3D:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/axisbase3d.html) and supports all the same styling and configuration options as [NumericAxis3D](/3d-charts/axis-3d-api/numeric-and-date-axis-in-scichart-3d/), including:

- `axisTitle`, `titleOffset`, `tickLabelsOffset`
- `visibleRange`, `autoRange`, `growBy`
- `drawMajorGridLines`, `drawMinorGridLines`, `drawLabels`
- `maxAutoTicks`, `labelFormat`, `labelPrecision`
- `axisPlaneBackgroundFill`, `planeBorderColor`, `planeBorderThickness`

See the [Axis3D APIs Overview](/3d-charts/axis-3d-api/axis-3d-api-overview/) for a full reference of inherited properties.

## See Also

- [LogarithmicAxis (2D)](/2d-charts/axis-api/axis-types/logarithmic-axis/) — covers `logBase`, `minorTickMode`, `majorTickMode`, label formatting and negative number handling in more depth
- [NumericAxis3D](/3d-charts/axis-3d-api/numeric-and-date-axis-in-scichart-3d/) — the standard linear value axis for 3D charts
- [Axis3D APIs Overview](/3d-charts/axis-3d-api/axis-3d-api-overview/)
- [Axis3D Text Label Formatting](/3d-charts/axis-3d-api/axis-3d-text-label-formatting/)
- [Axis3D Gridline and Label Spacing](/3d-charts/axis-3d-api/axis-3d-gridline-and-label-spacing-interval/)
