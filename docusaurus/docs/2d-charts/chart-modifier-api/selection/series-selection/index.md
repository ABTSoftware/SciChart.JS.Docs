---
sidebar_position: 1
---

# ✅ Series Selection

SciChart now features a native ChartModifier called the [SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html) which allows you to click-select series via the mouse, or programmatically. The [SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html) allows you to do the following things:

1.  When [SeriesSelectionModifier.enableSelection:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#enableselection) is true, be notified via the [selectionChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#selectionchanged) event when the user selects one or more series.
2.  When [SeriesSelectionModifier.enableHover:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#enablehover) is true, be notified via the [hoverChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#hoverchanged) event when a user hovers one or more series
3.  Get a list of currently selected series via the [SeriesSelectionModifier.selectedSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#selectedseries) array, or hovered series via the [SeriesSelectionModifier.hoveredSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#hoveredseries) array.

Find an example below:

<CodeSnippetBlock labels={["JS", "Builder API (Config)"]}>
    ```ts {57} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {9} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./Basic/demo" />
:::tip
Many of the properties here are optional - they have been included to show the configuration possibilities for the [SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html). See [ISeriesSelectionModifierOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iseriesselectionmodifieroptions.html) for more.
:::
Getting Notified on Series Hovered / Selected
---------------------------------------------

The [SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html) has two events [SeriesSelectionModifier.selectionChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#selectionchanged) and [SeriesSelectionModifier.hoverChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#hoverchanged). These provide callbacks to user code when a series is selected or deselected. They can be subscribed to as follows.

The [constructor options for the SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iseriesselectionmodifieroptions.html) also have [onSelectionChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iseriesselectionmodifieroptions.html#onselectionchanged) and [onHoverChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iseriesselectionmodifieroptions.html#onhoverchanged) functions. You can pass in selected and hovered functions in the constructor also:


<CodeSnippetBlock labels={["Subscribe to SeriesSelectionModifier events"]}>
    ```ts showLineNumbers
    import { SeriesSelectionModifier } from "scichart";

    const seriesSelectionModifier = new SeriesSelectionModifier({
        enableHover: true,
        enableSelection: true,
        // selection, hover callbacks can be passed to the constructor
        onSelectionChanged: args => {
            console.log("seriesSelectionModifier constructor onSelectionChanged");
        },
        onHoverChanged: args => {
            console.log("seriesSelectionModifier constructor onHoverChanged");
        }
    });

    // Or, subscribed to later.
    seriesSelectionModifier.hoverChanged.subscribe(args => {
        console.log("seriesSelectionModifier.hoverChanged event");
    });
    seriesSelectionModifier.selectionChanged.subscribe(args => {
        console.log("seriesSelectionModifier.selectionChanged event");
    });
    ```
</CodeSnippetBlock>

Finally, series themselves have [selected:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#selected) and [hovered:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#hovered) events and functions in the constructor and on the series themselves.

<CodeSnippetBlock labels={["Series selected hovered events"]}>
    ```ts
    const series = new FastLineRenderableSeries(wasmContext, {
    /* ... other options here ... */

    onSelectedChanged: (sourceSeries, isSelected) => {
        console.log("FastLineRenderableSeries constructor onSelectedChanged");
    },
    onHoveredChanged: (sourceSeries, isHovered) => {
        console.log("FastLineRenderableSeries constructor onSelectedChanged");
    }
    });

    series.hovered.subscribe(args => {
        console.log("FastLineRenderableSeries.hovered event");
    });
    series.selected.subscribe(args => {
        console.log("FastLineRenderableSeries.selected event");
    });
    ```
</CodeSnippetBlock>

Here's a full code sample showing the four possible ways you can get notified when selection changes in SciChart.js:

<CodeSnippetBlock labels={["ts"]}>
    ```ts showLineNumbers file=./Hovered/demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

this results in the following output:

<LiveDocSnippet name="./Hovered/demo" />

Customizing Selection Visuals
-----------------------------

### Colour a series when selected

When a series is selected or hovered, you can use one of the callback methods (above) to change it's style. Any property may be changed, such as `BaseRenderableSeries.stroke`, `strokeThickness`, `pointMarker` type or colours. Below is a simple code sample showing how to get a tri-state style on series selected, hovered, or selected and hovered.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./TriStateSelectionVisuals/demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This results in the following behaviour when hovering or selecting the series.

<LiveDocSnippet name="./TriStateSelectionVisuals/demo" />

### Animating Selection State Changes

Using the Animations API built into SciChart, it is also possible to animate between style state changes on a RenderableSeries.

Update the code above to use the Animations API to call [BaseRenderableSeries.enqueueAnimation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#enqueueanimation) as follows:

<CodeSnippetBlock labels={["tri state animation on selection"]}>
    ```ts showLineNumbers file=./TriStateSelectionVisualsAnimation/demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This now results in the following animated style-transition behaviour when hovering or selecting the series.

<LiveDocSnippet name="./TriStateSelectionVisualsAnimation/demo" />

:::tip
Multiple properties can be animated in SciChart.js, including stroke, fill, strokethickness, pointmarker size, type, opacity and more. For more information about how to animate between styles or datasets, see the [Animations API Documentation](/docs/2d-charts/animations-api/aminations-api-overview).
:::

Programmatically Getting/Setting Selected Series
------------------------------------------------

Series may also be selected and deselected programmatically. Simply set the [BaseRenderableSeries.isSelected:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#isselected) property to trigger this action. SciChart will automatically redraw, and selection callbacks will be called, where you can update the style.

Excluding/Including Series from Selection
-----------------------------------------

By default, all series in the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection will be included in the selection and hovered functionality when [SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html) is used.

At the moment, you can filter which series are included by overriding the [getAllSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#getallseries) function.

Find a short example below:

<CodeSnippetBlock labels={["Exclude series from SeriesSelectionModifier"]}>
    ```ts showLineNumbers
    const seriesSelectionModifier = new SeriesSelectionModifier({ /* options .. */});
    seriesSelectionModifier.getAllSeries = () => {
        // access and return the series you want to include in the operation. 
        // This function should return an array 
        return [seriesSelectionModifier.parentSurface.renderableSeries.get(1)]; 
    }
    ```
</CodeSnippetBlock>

#### See Also

* [DataPoint Selection](/docs/2d-charts/chart-modifier-api/selection/data-point-selection)
* [Annotation Hover](/docs/2d-charts/chart-modifier-api/selection/annotation-hover)