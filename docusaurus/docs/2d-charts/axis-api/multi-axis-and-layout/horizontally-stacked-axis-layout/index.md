---
sidebar_position: 6
---

# Horizontally Stacked Axis Layout

The Stacked Axis feature in SciChart allows you to specify the layout of the axis panel. Normally when you have multiple XAxis, they are stacked vertically. However, you can switch this to stack horizontally. Custom and complex layouts are possible allowing for all kinds of chart scenarios.

:::warning
[Polar Charts](/2d-charts/surface/scichart-polar-surface-type) do not support stacked axes yet
:::

In the [previous article we demonstrated Vertically Stacked Axis](/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout). This is where you specify a layout strategy for Y Axis on the left or right of the chart to stack axis above each other.

Create a Horizontally Stacked Axis Chart
----------------------------------------

### Step 1: Create a Multi X-Axis Chart

Typically if you create a chart with several X-Axis, they are stacked on the top or bottom of the chart.

The following code with 4 XAxis on the bottom results in this output:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./Step1/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./Step1/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} name="./Step1/demo" />

### Step 2: Apply the Layout Strategy

To change the behaviour of axis stacking you need to set the appropriate layoutStrategy property on the [SciChartSurface.LayoutManager](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#layoutmanager) with the stacked version. 

SciChart provides the following Outer Axes Layout Strategies:

*   [LeftAlignedOuterVerticallyStackedAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/leftalignedouterverticallystackedaxislayoutstrategy.html)
*   [RightAlignedOuterVerticallyStackedAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/rightalignedouterverticallystackedaxislayoutstrategy.html)
*   [TopAlignedOuterHorizontallyStackedAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/topalignedouterhorizontallystackedaxislayoutstrategy.html)
*   [BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/bottomalignedouterhorizontallystackedaxislayoutstrategy.html)

Modify the code above to set this property on the [SciChartSurface.LayoutManager](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#layoutmanager):

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./Step2/demo.ts start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>


Now the layout is completely changed. 

<LiveDocSnippet maxWidth={"100%"} name="./Step2/demo" />

LayoutStrategies Applicable to X-Axis
----------------------------------------

The following horizontally stacked layout strategies are available and may be applied to the following properties on [SciChartSurface.LayoutManager](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#layoutmanager):

| Layout Strategy | Use With | Apply to LayoutManager Prop | Behavior |
|-----------------|----------|-----------------------------|----------|
| [TopAlignedOuterAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/topalignedouteraxislayoutstrategy.html) | X Axis | [topInnerAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/layoutmanager.html#topinneraxeslayoutstrategy), [topOuterAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/layoutmanager.html#topouteraxeslayoutstrategy) | Default behavior |
| [BottomAlignedOuterAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/bottomalignedouteraxislayoutstrategy.html) | X Axis | [bottomInnerAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/layoutmanager.html#bottominneraxeslayoutstrategy), [bottomOuterAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/layoutmanager.html#bottomouteraxeslayoutstrategy) | Default behavior |
| [TopAlignedOuterHorizontallyStackedAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/topalignedouterhorizontallystackedaxislayoutstrategy.html) | X Axis | [topOuterAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/layoutmanager.html#topouteraxeslayoutstrategy) | Horizontal stacking behavior |
| [BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/bottomalignedouterhorizontallystackedaxislayoutstrategy.html) | X Axis | [bottomOuterAxisLayoutStrategy](https://www.scichart.com/documentation/js/current/typedoc/classes/layoutmanager.html#bottomouteraxeslayoutstrategy) | Horizontal stacking behavior |

:::tip
Try experimenting with the Codepen above to see how each of the strategies behave.  
Note that a **TopLayoutStrategy** will require [Axis.axisAlignment](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html#axisalignment) = [EAxisAlignment.Top](https://www.scichart.com/documentation/js/current/typedoc/enums/eaxisalignment.html) and vice versa.

:::

Customising Axis Size when Horizontally Stacked
-----------------------------------------------

The [Axis.stackedAxisLength](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#stackedaxislength) property allows you to customize the size of a Horizontally Stacked Axis in SciChart.js. This property may be an absolute number, e.g. 50 pixels, or a percentage e.g. "30%". When left undefined, default equal spacing will be used.

Try the following code to see how it affects stacked axis size.

<CodeSnippetBlock labels={["stackedAxisLength"]}>
    ```ts
// This stacked axis has 100 pixel length
sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis 0", stackedAxisLength: 100 }));
// This stacked axis occupies 50% of available space
sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis 1", stackedAxisLength: "50%" }));
// These stacked axis obey default spacing
sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis 2" }));
sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis 3" }));
    ```
</CodeSnippetBlock>

Combining Vertical (rotated) Charts & Stacked Axis
--------------------------------------------------

Part of the magic of SciChart.js is the sheer number of combinations you can have for chart and axis layout!

If we combine the [Vertical Chart feature](/2d-charts/axis-api/multi-axis-and-layout/vertical-charts-rotate-transpose-axis) where you set **XAxis.axisAlignment** = Left and **YAxis.axisAlignment** = Top with the Horizontally Stacked Axis feature where we can re-arrange the layout of axis on the top/bottom of the chart, we can achieve things like this:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./Step3/demo.ts start=region_A_start end=region_A_end

    ```
</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} name="./Step3/demo" />

#### See Also

* [Inner Axis Layout](/2d-charts/axis-api/multi-axis-and-layout/inner-axis-layout)
* [Secondary and Multiple Axis](/2d-charts/axis-api/multi-axis-and-layout/secondary-and-multiple-axis-overview)

