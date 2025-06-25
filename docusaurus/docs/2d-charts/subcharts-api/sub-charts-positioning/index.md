---
sidebar_position: 2
---

# ✅ SubCharts Positioning

There are several modes that can be used to position a sub-surface, they are defined in the [ECoordinateMode](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html) enum.

By default, sub-surfaces use [ECoordinateMode.Relative](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html#relative) for positioning. To change the coordinate mode use [I2DSubSurfaceOptions.coordinateMode](https://www.scichart.com/documentation/js/current/typedoc/interfaces/i2dsubsurfaceoptions.html#coordinatemode) or [SciChartSubSurface.coordinateMode](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html#coordinatemode) property.

Note [ECoordinateMode.DataValue](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html#datavalue) require axes to be present on the main surface and that they are specified as parent axes of the sub-surface.

Let's create a basic example to demonstrate this:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
```ts {68} showLineNumbers file=./Positioning/demo.ts start=region_A_start end=region_A_end
```
```ts showLineNumbers file=./Positioning/demo.ts start=region_B_start end=region_B_end
```
</CodeSnippetBlock>

This places a chart-within-a-chart at a specific DataValue.

<LiveDocSnippet maxWidth={"100%"} name="./Positioning/demo" />

SubChart Positioning in Multi-Axis Scenarios
--------------------------------------------

Next let's look at the case where we have a custom axis id or multiple axes on main surface.

Since positioning with [ECoordinateMode.DataValue](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html#datavalue) depends on the axis visible ranges, we will have to specify which axis pair should be used for sub-surface position calculation.

To do this we can pass [I2DSubSurfaceOptions.parentXAxisId](https://www.scichart.com/documentation/js/current/typedoc/interfaces/i2dsubsurfaceoptions.html#parentxaxisid) / [I2DSubSurfaceOptions.parentYAxisId](https://www.scichart.com/documentation/js/current/typedoc/interfaces/i2dsubsurfaceoptions.html#parentyaxisid) via options or use [SciChartSubSurface.parentXAxisId](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html#parentxaxisid) / [SciChartSubSurface.parentYAxisId](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html#parentyaxisid) properties.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
```ts {86-87} showLineNumbers file=./PositioningMultiAxis/demo.ts start=region_A_start end=region_A_end
```
```ts showLineNumbers file=./PositioningMultiAxis/demo.ts start=region_B_start end=region_B_end
```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./PositioningMultiAxis/demo" />

Updating SubChart Position
--------------------------

SciChart allows to change a sub-surface position dynamically using the [SciChartSubSurface.subPosition](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html#subposition) property.

Let's demonstrate this by updating the coordinate mode and subPosition of the sub-chart from previous section

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
```ts {88} showLineNumbers file=./SubPosition/demo.ts start=region_A_start end=region_A_end
```
```ts showLineNumbers file=./SubPosition/demo.ts start=region_B_start end=region_B_end
```
</CodeSnippetBlock>

This will move and update the SubChart position after 1-second (see the setTimeout call).

<LiveDocSnippet maxWidth={"100%"} name="./SubPosition/demo" />