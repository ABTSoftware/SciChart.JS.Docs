---
sidebar_position: 9
---

# ✅ RenderDataTransforms API

**RenderDataTransforms** allow you to transform your data immediately before it is drawn. 

This allows you to change visual output performing transforms on chart series, while keeping your data unchanged - meaning tooltips, cursors and more are unchanged by this type of transform.

This API differs from the [Data Filters API](/docs/2d-charts/chart-types/data-filters-api/data-filters-api-overview/index.md), which applies transforms to Data and can be used to create [Moving Averages](/docs/2d-charts/chart-types/data-filters-api/moving-average-filter/index.md), or [Linear Interpolation](Linear Trendline Filter.html) and more.  
  
The RenderTransforms API keeps your data intact, but changes the visual output on the screen.

Some examples of uses of RenderDataTransforms are:

*   **Interpolating the data.** SciChart uses the RenderDataTransforms API internally to draw the spline series
*   **Switching Styles** on a series, for example rendering data on the same series with different pointmarkers or line styles.
*   **Splitting Line Segments**, adding points into the data to be able to draw a single line segment in multiple colors
*   **Adding Gaps to series** by manipulating NaN values

Where RenderDataTransforms Fit 
-------------------------------

In this documentation we are going to walk through some examples of RenderDataTransforms, but to understand them, we first need to understand some details of the SciChart render process and the difference between DataSeries and PointSeries. 

The SciChart render function goes through roughly the following stages:

1.  **Layout**.  Here we calculate the size and position of the axes
2.  **AutoRange**. If required, we measure the data range and update the visibleRange of the axes
3.  **Prepare series data.**  Here we convert from the DataSeries to a PointSeries.  A PointSeries has arrays of vectors like a DataSeries, but not other functionality.  The PointSeries may be just a wrapper ([basePointSeriesWrapped:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/basepointserieswrapped.html)) - pointing to the vectors in the dataSeries, or it may be the result of a resampling operation ([basePointSeriesResampled:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/basepointseriesresampled.html)), in which case it has completely separate sets of vectors.  This, along with an indexRange which indicates what part of the data should be drawn, is put together into [RenderPassData:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/renderpassdata.html).
4.  **Draw series**. The [renderPassData:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/renderpassdata.html) is passed to the draw method of each [drawingProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#drawingproviders) on the [renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html). Lines and pointMarkers have separate drawingProviders.  This is where the [renderDataTransform:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#renderdatatransform) can come into play.  If the current drawingProvider is in the list on the transform, then the transform is run and the resulting renderPassData is given to the drawingProvider instead.

The point here is that the [renderDataTransform:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#renderdatatransform) only applies to drawing. It does not change the [dataSeries](/docs/2d-charts/chart-types/data-series-api/data-series-api-overview/index.md), and is not seen by [hitTest](/docs/2d-charts/chart-types/hit-test-api/hit-test-api-overview/index.md) or [modifiers](/docs/2d-charts/chart-modifier-api/chart-modifier-api-overview/index.md). It can however be used by [AutoRange](/docs/2d-charts/axis-api/ranging-scaling/auto-range/index.md) if required.  
  
To make all this efficient, there is a [base class for renderDataTransforms:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderdatatransform.html) which holds the result of the transform and only runs it if necessary.

BaseRenderDataTransform
-----------------------

When creating renderDataTransforms, you should extend from [BaseRenderDataTransform:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderdatatransform.html) or (since 3.4.662) one of the non-abstract derived classes eg [XyBaseRenderDataTransform:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xybaserenderdatatransform.html), [XyyBaseRenderDataTransform:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyybaserenderdatatransform.html), or [OhlcBaseRenderDataTransform:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/ohlcbaserenderdatatransform.html). 

You should implement [runTransformInternal:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderdatatransform.html#runtransforminternal), which returns a [pointSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointseries.html), rather than [RenderPassData:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/renderpassdata.html).  The base class takes care of calling [runTransformInternal:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderdatatransform.html#runtransforminternal) only when necessary, and creating the RenderPassData from the pointSeries.

In order for this to work, and to avoid memory leaks, you should clear and push to the vectors on [BaseRenderDataTransform.pointSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderdatatransform.html#pointseries).  Do NOT create a new pointSeries in [runTransformInternal:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderdatatransform.html#runtransforminternal).

If your transform depends on anything other than the dataSeries and the indexRange, then you need to set [requiresTransform:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderdatatransform.html#requirestransform) to **true** of that dependency changes.  There are examples of this below.

If your transform changes the yRange of your data and you want this accounted for in [AutoRange](/docs/2d-charts/axis-api/ranging-scaling/auto-range/index.md), set [useForYRange:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderdatatransform.html#useforyrange) true.  The transform will be run and the result used for autoRange, and since the resulting pointSeries is held by the transform it will not need to run again at the point of drawing.

Worked Example: Splitting Data to Multiple DrawingProviders
-----------------------------------------------------------

This is a simplified version of the [Multi Style Series](https://demo.scichart.com/react/multi-style-series) demo.  Below is the transform which takes xy data and returns an [xyyPointSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ixyypointseries.html) with the unselected points in the yValues and selected points in the y1Values. 

<CodeSnippetBlock labels={["TYPEscript"]}>
    ```ts showLineNumbers file=./SimpleSplit/demo.ts start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

To use this, we set up a second drawingProvider which uses a different pointMarker and draws the y1Values of the pointSeries.

<CodeSnippetBlock labels={["TYPEscript"]}>
    ```ts showLineNumbers file=./SimpleSplit/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

The output looks like this

<LiveDocSnippet maxWidth={"100%"} name="./SimpleSplit/demo" />

Worked Example: Splitting lines for Threshold Coloring
------------------------------------------------------

The [Coloring Series per-point using PaletteProvider demo](https://demo.scichart.com/react/chart-color-points-individually-with-paletteprovider) shows a simple way to change the color of line segments if they are above or below a threshold.  However, per point coloring applies to individual line segments.  If you have less data or longer line segments and want the coloring to be split exactly on the threshold, then you need to add points into your data at the intersections.  RenderDataTransforms allow you to do this without affecting the drawing of pointMarkers. 

Here is a transform which does this for a set of y thresholds.  The algorithm needs to handle the fact that a line could cross multiple thresholds, and that an intersection could be on an existing point.  Note that we use an ObservableArray for the thresholds so we can set requiresTransform if the thresholds change.

This transform should only apply to line drawing, so we pass only the first drawingProvider from the renderableSeries to the transform.

<CodeSnippetBlock labels={["TYPEscript"]}>
    ```ts showLineNumbers file=./Thresholds/demo.ts start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

Next we need a paletteProvider which applies colours according to the thresholds.  The stroke color at a point applies to the previous line segment ending at that point, so we have to track the previous y value to see if the line was approaching the threshold from above or below.  Thanks to the transform, we know every line segment will be completely within one of the threshold ranges.

<CodeSnippetBlock labels={["TYPEscript"]}>
    ```ts showLineNumbers file=./Thresholds/demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

Now we can create a series and apply these to it

<CodeSnippetBlock labels={["TYPEscript"]}>
    ```ts showLineNumbers file=./Thresholds/demo.ts start=region_C_start end=region_C_end

    ```

</CodeSnippetBlock>

 This is the final result.  You can view the source of the embed below to see how the annotations are created and configured to update the thresholds.

<LiveDocSnippet maxWidth={"100%"} name="./Thresholds/demo" />
