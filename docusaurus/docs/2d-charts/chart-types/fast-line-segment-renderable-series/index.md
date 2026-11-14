---
sidebar_position: 32
---

# The Line Segment Series Type

Line segment is a part of a straight line that is bounded by two distinct endpoints. [FastLineSegmentRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinesegmentrenderableseries.html) defines a line-series or line chart type in the SciChart's High Performance Real-time JavaScript Charts

:::tip New to dumbbell charts?
Read our guide: [Dumbbell Chart: what it is and how to read it](/learn/dumbbell-chart/). It shows how to build one from a line segment series and two scatter series, how to sort the rows, and when to use one instead of clustered bars.
:::

:::tip New to network graphs?
Read our guide: [Network Graph: what it is and how to read it](/learn/network-graph/), covering nodes and edges, hubs, clusters and bridges, and how force-directed layouts work.
:::

Here is a simple Line Segment Series made using [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) 

```ts {23} showLineNumbers file=./basic-example/demo.ts start=region_A_start end=region_A_end
```

## Properties
    
    - dataSeries: we can use [XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) and [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html). The main difference is that when using [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) we can use custom paletteProvider like ```LineSegmentPaletteProvider``` and that enables different colors on start and end of the line
    - strokeThickness: defines thickness of the stroke
    - paletteProvider: here is example of custom paletteProvider that is available when using [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html):

```ts
class LineSegmentPaletteProvider implements IStrokePaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.GRADIENT;
    private readonly palettedStart = parseColorToUIntArgb("red");
    private readonly palettedEnd = parseColorToUIntArgb("blue");

    public onAttached(parentSeries: IRenderableSeries): void {}

    public onDetached(): void {}

    public overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return index % 2 === 0 ? this.palettedStart : this.palettedEnd;
    }

    public toJSON(): TPaletteProviderDefinition {
        return { type: EPaletteProviderType.Custom, customType: "MyPaletteProvider" };
    }
}
```

:::tip
When using [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) with [FastLineSegmentRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinesegmentrenderableseries.html) we can use custom paletteProvider that enables different colors on start and end of the line.
:::


## Examples

### Line Segment Example with XyDataSeries

This example is using [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) to create a simple line segment series.

<LiveDocSnippet name="./basic-example/demo" />

```ts {23} showLineNumbers file=./basic-example/demo.ts start=region_A_start end=region_A_end
```

### Line Segment Example with XyxyDataSeries

This example is using XyxyDataSeries

<LiveDocSnippet name="./xyxy-example/demo" />

```ts {13} showLineNumbers file=./xyxy-example/demo.ts start=region_A_start end=region_A_end
```

### Gradient Field Example

<LiveDocSnippet name="./gradient-field/demo" />

```ts showLineNumbers file=./gradient-field/demo.ts start=region_A_start end=region_A_end
```