---
sidebar_position: 2
---

# How to Detect If a User Is Zooming or Panning

## The sciChartSurface.zoomState Property

The [sciChartSurface.zoomState:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#zoomstate) property allows us to detect if the chart has been zoomed or panned by the user, or if the chart is at extents of the data. You can take a look at the values of the [EZoomState Enum here:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/ezoomstate.html).


Here is example:


```ts {16} showLineNumbers file=./demo.ts start=region_A_start end=region_A_end

```

<LiveDocSnippet name="./demo" />