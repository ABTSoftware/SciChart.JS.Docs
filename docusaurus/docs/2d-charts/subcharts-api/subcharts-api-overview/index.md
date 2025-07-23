---
sidebar_position: 1
---

# What is the SubCharts API?

The SubCharts API allows to place 1..N child [SciChartSurfaces:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) within a parent chart (Charts within charts). It is possible to have multiple sub-charts within the main SciChartSurface.

What is the Benefit of the SubCharts API?
-----------------------------------------

SubCharts is an extremely powerful API that allows you to create dashboards or chart groups that share a single SciChartSurface, single WebGL canvas and engine instance.

*   With the SubCharts API you can **create a single chart with several nested chart panels**, enabling you to create components of single dashboards with one SciChartSurface parent that you can re-use throughout your app.
*   It's possible to **dynamically position and resize SubCharts** on the main SciChartSurface, so you could create **dynamic multi-panel charts** such as in the financial industry or industrial process monitoring industry.
*   **SubCharts are a huge performance boost** when many charts are used. For example, 100 charts created using SciChartSurface.create() will be far slower than 100 charts added to a single SciChartSurfaces using SubCharts.

It's possible with SubCharts to create very dashboards and re-usable multi-chart configurations, multi-chart groups while maintaining very high performance due to the WebGL canvas & context sharing nature of this API.

SubCharts API could be applied to display separate charts simultaneously on a single root element. The API allows to set a position, size , and styling of a sub-chart. Additionally it is possible to add custom HTML elements to the chart, which would be positioned accordingly to the chart layout flow.

Overview of the SubCharts API
-----------------------------

A sub-chart is represented by the [SciChartSubSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html) class, which inherits [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html). Similarly to [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) it has its own Axes, Modifiers, Renderable Series and Annotations.

You can add a sub-chart to a SciChartSurface by calling [SciChartSubSurface.createSubSurface():blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsubsurface.html#createsubsurface). This returns a [SciChartSubSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html) instance.

<CodeSnippetBlock labels={["SciChartSubSurface.createSubSurface()"]}>
    ```ts
SciChartSubSurface.createSubSurface(parentSurface: ISciChartSurface, options?: I2DSubSurfaceOptions): SciChartSubSurface
    ```
</CodeSnippetBlock>

Parent [sciChartSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) must be passed, in addition [I2DSubSurfaceOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/i2dsubsurfaceoptions.html) may be passed to [createSubSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsubsurface.html#createsubsurface). 

This interface has the following properties:

<CodeSnippetBlock labels={["I2DSubSurfaceOptions interface"]}>
    ```ts showLineNumbers
export interface I2DSubSurfaceOptions extends I2DSurfaceOptions {
    surfaceType?: ESciChartSurfaceType;
    /**
     * A rectangle defining the position and size of a subchart.
     * If {@link coordinateMode} is Relative (the default) then the values give the size as a proportion of the parent div, and all properties must be between 0 and 1 inclusive.
     * If {@link coordinateMode} is DataValue, values will be converted to coordinates using {@link parentXAxisId} and {@link parentYAxisId}. Subchart will be clpped to the parent SeriesViewRect
     * Can only be set if this is a subChart.  See {@link addSubChart}
     */
    position?: TSubSurfacePosition;

    /** An id or div element that will wrap the subchart.  This can contain top, left, bottom and right section divs.  The chart will shrink to fit the sections  */
    subChartContainerId?: string | HTMLDivElement;

    /** Whether other surfaces, including the parent, will be visible underneath this surface  */
    isTransparent?: boolean;

    /** Sets if the subchart is visible, allowing you to hide a subchart without removing it from the parent surface */
    isVisible?: boolean;

    /**
     * Gets or sets the {@link TSubSurfaceCoordinateMode} used when calculating the actual position based on the {@link subPosition}.
     * @default Relative
     */
    coordinateMode?: TSubSurfaceCoordinateMode;
    /**
     * Sets the AxisId used to determing which X Axis should be used when calculating the actual position based on the {@link subPosition}
     * if {@link coordinateMode} is DataValue
     */
    parentXAxisId?: string;
    /**
     * Sets the AxisId used to determing which Y Axis should be used when calculating the actual position based on the {@link subPosition}
     * if {@link coordinateMode} is DataValue
     */
    parentYAxisId?: string;
    /**
     * Gets or sets scale property for all sections
     */
    sectionScale?: number;
    ```
</CodeSnippetBlock>

The return value of [createSubSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsubsurface.html#createsubsurface) is a SciChartSubSurface class. This inherits SciChartSurface but has additional properties, which can be found below.

<CodeSnippetBlock labels={["ISciChartSubSurface interface"]}>
    ```ts showLineNumbers
interface ISciChartSubSurface extends ISciChartSurface {
    /**
     * The {@link HTMLDivElement} which is the dom sub-chart root
     */
    readonly subChartContainer: HTMLDivElement;
    /**
     * The parent {@link ISciChartSurface}, if this is a subChart
     */
    readonly parentSurface: ISciChartSurface;
    /**
     * Gets the adjusted padding between the SciChartSurface and its inner elements, in order top, right, bottom, left
     * Defines a resulting padding accordingly to DPI scaling.
     */
    readonly adjustedPadding: Thickness;
    offset: Thickness | undefined;

    topSectionClass: string;
    leftSectionClass: string;
    bottomSectionClass: string;
    rightSectionClass: string;
    /**
     * Gets or Sets whether other surfaces, including the parent, will be visible underneath this surface
     */
    isTransparent: boolean;

    /**
     * Gets or sets the {@link TSubSurfaceCoordinateMode} used when calculating the actual position based on the {@link subPosition}
     */
    coordinateMode: TSubSurfaceCoordinateMode;
    /**
     * Gets or sets the parent chart AxisId used to determine which X Axis should be used when calculating the actual position based on the {@link subPosition}
     * if {@link coordinateMode} is DataValue
     */
    parentXAxisId: string;
    /**
     * Gets or sets the parent chart AxisId used to determine which Y Axis should be used when calculating the actual position based on the {@link subPosition}
     * if {@link coordinateMode} is DataValue
     */
    parentYAxisId: string;
    /**
     * A rectangle defining the position and size of a subchart.
     * If {@link coordinateMode} is Relative (the default) then the values give the size as a proportion of the parent div, and all properties must be between 0 and 1 inclusive.
     * If {@link coordinateMode} is DataValue, values will be converted to coordinates using {@link parentXAxisId} and {@link parentYAxisId}. Subchart will be clpped to the parent SeriesViewRect
     * Can only be set if this is a subChart.
     */
    subPosition: TSubSurfacePosition;
    /**
     * Gets or sets if the subchart is visible, allowing you to hide a subchart without removing it from the parent surface
     */
    isVisible: boolean;
    /**
     * Gets or sets scale property for all sections
     * It is necessary if the scale transformation is being used for html areas around the subchart
     * For example, style = { width: "50%", transform: scale(2), transformOrigin: 'left top' }
     */
    sectionScale: number;
    /**
     * Used internally
     */
    backgroundFillBrushCache: BrushCache;
    /**
     * Recalculate the position of the subChart. Call if you update the size of html elements in the wrapper
     */
    updateSubLayout(isDrawing?: boolean): void;
    /**
     * Gets the sub-chart container
     */
    getSubChartContainer(): HTMLDivElement;
    /** Gets the sub-chart rect on the parent surface. Defines the viewport size of the sub-surface.
     * TThis rect is a subset of the {@link SciChartSubSurface.subPosition} considering the SubChart Wrapper content areas
     */
    getSubChartRect(): Rect;
    toJSON(excludeData: boolean): ISubChartDefinition;
}
    ```
</CodeSnippetBlock>

Basic Subchart Example (Charts within Charts)
---------------------------------------------

Let's demonstrate a simple setup, where we define a sub-chart on a surface. For this we will start from defining a surface with some axes on it. On the surface we will create a sub-chart on a specified area.

<CodeSnippetBlock labels={["Subcharts"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

In the example above we create a [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) as normal and add some series to it. Then, we call [createSubSurface:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsubsurface.html#createsubsurface) function, which contains a position property. The property defines a structure for specifying coordinates and sizes of a sub-chart. By default, the coordinates and size are treated as ratio values in range from 0 to 1, with a canvas viewport used as a base.

Next, we add some series to both the parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) and the [SciChartSubSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html). We subscribe to [visibleRangeChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axiscore.html#visiblerangechanged) on the parent SciChartSurface x, y axis and use that to update a [BoxAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/boxannotation.html) in the [SciChartSubSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html).

By creating this example, we have created a 2D viewport overview using the Sub-charts API, placing a child [SciChartSubSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsubsurface.html) inside a parent [SciChartSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html), and subscribed to interactivity on the parent chart. The Sub-chart shows all the data and where you have zoomed in on the parent chart, allowing you to get a view into your current position (zoom level and range) on the chart.

<LiveDocSnippet maxWidth={"100%"} name="./Basic/demo" />

Try zooming the example with mouse-drag, panning, mousewheel and double-click to reset zoom to see the effect on the BoxAnnotation in the SciChartSubSurface.

SubCharts with the Builder API
------------------------------

It is also possible to create a sub-chart via [Builder API](/2d-charts/builder-api/builder-api-overview). For this pass an array of [ISubChartDefinition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/isubchartdefinition.html) via [ISciChart2DDefinition.subCharts:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iscichart2ddefinition.html#subcharts) property.

For example, the following snippet will give us the same result as Basic Example setup:

<CodeSnippetBlock labels={["Subcharts builder API"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=region_B_start end=region_B_end
    ```
</CodeSnippetBlock>

The Builder API demo of SubCharts works very similarly to the javascript-API version. A SubChart is declared via the [subCharts:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iscichart2ddefinition.html#subcharts) property of the chart [ISciChart2DDefinition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iscichart2ddefinition.html), and axis, series, interactions can be added to it as before. You can access the SubChart and any of it's created properties via the [SciChartSurface.subCharts:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#subcharts) property.

Other ways to set SubChart position
-----------------------------------
The [subPosition:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iscichartsubsurface.html#subposition) property supports 3 formats of coordinates:

*   `TXywhCoordinates: {x, y, width, height}`
*   `TLtrbCoordinates: {left, top, right, bottom}`
*   `TEdgeCoordinates: {x1, y1, x2, y2}`

:::tip
Each of the coordinates could be assigned to use different coordinate modes.
:::

<CodeSnippetBlock>
    ```ts showLineNumbers file=./CoordinateFormats/demo.ts start=region_A_start end=region_A_end
    ```
    ```ts showLineNumbers file=./CoordinateFormats/demo.js start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} name="./CoordinateFormats/demo" />

#### See Also

* [SubChart Sub Surface Transparency](/2d-charts/subcharts-api/sub-chart-sub-surface-transparency)
* [SubCharts Positioning](/2d-charts/subcharts-api/sub-charts-positioning)
* [SubCharts Html Container](/2d-charts/subcharts-api/sub-charts-html-container)
* [Worked Example: Using SubCharts to create a Large Dashboard](/2d-charts/subcharts-api/example-using-sub-charts-to-create-large-dashboard)
