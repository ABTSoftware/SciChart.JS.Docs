---
sidebar_position: 2
---

# ✅ Creating a Simple Chart

Creating a Series with the Builder API
--------------------------------------

Let’s add a series. A definition must have a type property which is an [ESeriesType:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/eseriestype.html). We’ll go into options in more detail later. The data property tells us the shape of data we need. There are a few different ways to supply data, but the simplest is to set the values directly here.

<CodeSnippetBlock labels={["TS"]}>
    ```ts {6} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This is all we need for a working SciChart chart with our BuilderAPI.

Notice that the return type of the **chartBuilder.buildChart()** function call is a Promise, which returns [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/sichartsurface.html) and **wasmContext** just like a call to **SciChartSurface.create()**, except it will already be populated with series, default axes and data provided in the builder options.

Run the code sample above and you will get this output:

<CenteredImageWrapper 
    src="images/BuilderApi_CreateSeriesExample1.png"
/>

Customizing Axis, Theme and Modifiers with the Builder API
----------------------------------------------------------

To customise the axes you again need to specify the axis type, then you can set options. The theme can be set in the surface. The theme can be a full theme class, or you can just refer to it by type.

Use the following code sample to try these out:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following chart output:

<CenteredImageWrapper 
    src="images/BuilderApi_CreateSeriesExample2.png"
/>

Note that visible range for an axis needs to be supplied as a [NumberRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/numberrange.html) class, however, in a text definition you can write `visibleRange: { min: 0, max: 20 }` .

Chart Modifiers, like pretty much everything, are `{ type, options }`. Note that series, axes, annotations and modifiers can all be a single definition, or an array.

#### See Also

* [Intro to the Builder API](/docs/2d-charts/builder-api/builder-api-overview)
* [Working with Data](/docs/2d-charts/builder-api/working-with-data)