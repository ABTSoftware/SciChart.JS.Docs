---
sidebar_position: 32
---

# 🔄 The Line Segment Series Type

Line segment is a part of a straight line that is bounded by two distinct endpoints. [LineSegmentRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/linesegmentrenderableseries.html) defines a line-series or line chart type in the SciChart's High Performance Real-time JavaScript Charts

Here is a simple Line Segment Series made using [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) 

```ts {23} showLineNumbers file=./basic-example/demo.ts start=region_A_start end=region_A_end
```

## Properties

    [ILineSegmentRenderableSeriesOptions:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ilinesegmentrenderableseriesoptions.html) 
    
    - dataSeries
    - strokeThickness
    - paletteProvider

## Examples

### Basic example

This example is using [XyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) to create a simple line segment series.

<LiveDocSnippet name="./basic-example/demo" />

```ts {23} showLineNumbers file=./basic-example/demo.ts start=region_A_start end=region_A_end
```

### Example with XyxyDataSeries

This example is using XyxyDataSeries

<LiveDocSnippet name="./xyxy-example/demo" />

```ts {13} showLineNumbers file=./xyxy-example/demo.ts start=region_A_start end=region_A_end
```

### Gradient field

<LiveDocSnippet name="./gradient-field/demo" />

```ts showLineNumbers file=./gradient-field/demo.ts start=region_A_start end=region_A_end
```