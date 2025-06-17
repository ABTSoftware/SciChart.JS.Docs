---
sidebar_position: 3
---

# ✅ Inner Axis Layout

SciChart allows you to customize how axes are placed around and within the surface.  Axes can be placed:

*   **Outside the drawing area,** called Outer Axes. This is the default. The drawing area is reduced to give space for the axes and their labels and titles.
*   **Inside the drawing area**, called Inner Axes. The drawing area fills the entire space of the chart. 

Inner axes can either be around the edges of the area, or bound to a coordinate so they appear in the middle of the drawing area. These are referred to as **Central Axes**.

Inner Axes
----------

To create an Inner axis simply set [isInnerAxis: true](https://scichart.com/documentation/js/current/typedoc/classes/numericaxis.html#isinneraxis) on the axis options:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./InsideAxis/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./InsideAxis/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

Now the x axis is an inner axis, while the y axis is the default outer axis. 

<LiveDocSnippet maxWidth={"100%"} name="./InsideAxis/demo" />

DrawSeriesBehindAxis property
-----------------------------

SciChart.js also allows you to draw all chart series behind axis by setting a single flag on the parent SciChartSurface.

The default behaviour is to draw axis on the outside of the chart area. If you need more space on the chart (if axis are taking up too much space), you can set a single flag to draw the series behind the axis and pull the axis areas inside the chart area:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./SeriesBehindAxis/demo.ts start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

This results in the following output.

<LiveDocSnippet maxWidth={"100%"} name="./SeriesBehindAxis/demo" />

#### See Also

* [Secondary and Multiple Axis](/docs/2d-charts/axis-api/multi-axis-and-layout/secondary-and-multiple-axis-overview/index.md)
* [Vertically Stacked Axis Layout](/docs/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout/index.md)
* [Axis LabelProviders](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview/index.md)
