---
sidebar_position: 5
---

# Vertically Stacked Axis Layout

The Stacked Axis feature in SciChart allows you to specify the layout of the axis panel. Normally when you have multiple YAxis, they are stacked horizontally. However, you can switch this to stack vertically. Custom and complex layouts are possible allowing for all kinds of chart scenarios.

<ChartFromSciChartDemo src="https://scichart.com/demo/iframe/javascript-vertically-stacked-axes" title="Vertically Stacked Axis" description="" />

Create a Vertically Stacked Axis Chart
--------------------------------------

### Step 1: Create a multiple Y-Axis Chart

Typically if you create a chart with several Y-Axis, they are stacked on the left or right of the chart.

The following code with 8 YAxis on the left results in this output:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./Step1/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./Step1/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} name="./Step1/demo" />

### Step 2: Apply the Layout Strategy

To change the behaviour of axis stacking you need to set the appropriate layoutStrategy property on the [SciChartSurface.LayoutManager](https://scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#layoutmanager) with the stacked version. 

SciChart provides the following Outer Axes Layout Strategies:

*   [LeftAlignedOuterVerticallyStackedAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/leftalignedouterverticallystackedaxislayoutstrategy.html)
*   [RightAlignedOuterVerticallyStackedAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/rightalignedouterverticallystackedaxislayoutstrategy.html)
*   [TopAlignedOuterHorizontallyStackedAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/topalignedouterhorizontallystackedaxislayoutstrategy.html)
*   [BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/bottomalignedouterhorizontallystackedaxislayoutstrategy.html)

Modify the code above to set this property on the [SciChartSurface.LayoutManager](https://scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#layoutmanager):

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./Step2/demo.ts start=region_A_start end=region_A_end

    ```
</CodeSnippetBlock>

Now the layout is completely changed.

<LiveDocSnippet maxWidth={"100%"} name="./Step2/demo" />

Make sure to assign Layout Strategy to an appropriate property on the Layout Manager accordingly to Axis Alignment.

Experimenting with different Layout Strategies
----------------------------------------------

The following vertically stacked layout strategies are available and may be applied to the following properties on [SciChartSurface.LayoutManager](https://scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#layoutmanager):

| Layout Strategy | Use With | Apply to LayoutManager Prop | Behavior |
|-----------------|----------|-----------------------------|----------|
| [LeftAlignedOuterAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/leftalignedouteraxislayoutstrategy.html) | Y Axis | [leftInnerAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/layoutmanager.html#leftinneraxeslayoutstrategy), [leftOuterAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/layoutmanager.html#leftouteraxeslayoutstrategy) | Default behavior |
| [RightAlignedOuterAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/rightalignedouteraxislayoutstrategy.html) | Y Axis | [rightInnerAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/layoutmanager.html#rightinneraxeslayoutstrategy), [rightOuterAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/layoutmanager.html#rightouteraxeslayoutstrategy) | Default behavior |
| [LeftAlignedOuterVerticallyStackedAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/leftalignedouterverticallystackedaxislayoutstrategy.html) | Y Axis | [rightOuterAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/layoutmanager.html#rightouteraxeslayoutstrategy) | Vertical stacking behavior |
| [RightAlignedOuterVerticallyStackedAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/rightalignedouterverticallystackedaxislayoutstrategy.html) | Y Axis | [leftOuterAxisLayoutStrategy](https://scichart.com/documentation/js/current/typedoc/classes/layoutmanager.html#leftouteraxeslayoutstrategy) | Vertical stacking behavior |

:::tip
Try experimenting with the Codepen above to see how each of the strategies behave.  
Note that a **RightLayoutStrategy** will require [Axis.axisAlignment](https://scichart.com/documentation/js/current/typedoc/classes/numericaxis.html#axisalignment) = [EAxisAlignment.Right](https://scichart.com/documentation/js/current/typedoc/enums/eaxisalignment.html) and vice versa.
:::

Customising Axis Size when Vertically Stacked
---------------------------------------------

The [Axis.stackedAxisLength](https://scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#stackedaxislength) property allows you to customize the size of a Vertically Stacked Axis in SciChart.js. This property may be an absolute number, e.g. 50 pixels, or a percentage e.g. "30%". When left undefined, default equal spacing will be used.

Find an updated example below:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./Step3/demo.ts start=region_A_start end=region_A_end

    ```
</CodeSnippetBlock>

The layout and sizes of the Vertically Stacked Axis now updates as follows:

<LiveDocSnippet maxWidth={"100%"} name="./Step3/demo" />

See Also

* [Inner Axis Layout](/2d-charts/axis-api/multi-axis-and-layout/inner-axis-layout)
* [Secondary and Multiple Axis](/2d-charts/axis-api/multi-axis-and-layout/secondary-and-multiple-axis-overview)
