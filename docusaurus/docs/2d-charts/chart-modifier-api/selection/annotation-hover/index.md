---
sidebar_position: 3
---

# Annotation Hover

Annotations Hover API is an opt-in functionality that allows detecting hover events on chart annotations and adding event handlers.

:::tip
The [JavaScript Hoverable Trade Markers Example](https://scichart.com/demo/javascript/stock-chart-buy-sell-markers) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://scichart.com/demo/javascript-line-chart).
:::

<ChartFromSciChartDemo 
    src="https://www.scichart.com/demo/iframe/stock-chart-buy-sell-markers" 
    title="Annotation Hover Example"
/>

Using AnnotationHoverModifier
-----------------------------

To enable the hover detection we need to add the [AnnotationHoverModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html).

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {21} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {32} showLineNumbers file=./demo.js start=#region_D_start end=#region_D_end
    ```
</CodeSnippetBlock>

Adding Hover Event Handlers
---------------------------

There are several different options for adding a callback for the hover event.

1. By passing [onHover:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationbaseoptions.html#onhover) via an [annotation constructor options:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#constructor), or subscribing to the [annotation.hovered:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#hovered) event handler on an [AnnotationBase:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html) derived type.  This allows you to have different hover behaviour for each annotation, and the args has a method which allows you to find out where on the annotation the over occurred.

<LiveDocSnippet name="./demo" />

2. By passing [onHover:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationhovermodifieroptions.html#onhover) via the constructor of the [AnnotationHoverModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html) or subscribing to the [annotationHoverModifier.hoverChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html#hoverchanged) event handler on an instance of [AnnotationHoverModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html).  This gives you a single callback with access to both the hovered and unhovered annotations, allowing you to define common hover behaviour in one place, and enabling you to update other annotations when one is hovered.

<CodeSnippetBlock labels={["Hover on modifier"]}>
    ```ts showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

These approaches could be used simultaneously.

Hover Detection Options
-----------------------

The hover detection functionality is managed by the [AnnotationHoverModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html).   
By default, the modifier checks every annotation within [SciChartSurface.annotations:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#annotations) that is visible upon mouse move.    
Then if the mouse position is over any of the annotations, only the one that is above all others is considered to be hovered.   
An event will be raised if the hovered state of annotation has changed (e.g. it became hovered or unhovered). 

These behaviors can be modified via the [IAnnotationHoverModifierOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationhovermodifieroptions.html).

### Hover Detection Mode

The hover detection rules are defined by the [hoverMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html#hovermode) property accepting values from [EHoverMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/ehovermode.html) enum.

*   [AbsoluteTopmost:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/ehovermode.html#absolutetopmost) (default) - selects only one annotation that is not overlayed by any other annotation at the mouse position; the mode checks both included and ignored targets, but can select only an included one.
*   [TopmostIncluded:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/ehovermode.html#topmostincluded) - selects only one annotation that is not overlayed by any other annotation at the mouse position; the mode checks and selects only included targets.
*   [Multi:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/ehovermode.html#multi) - selects multiple included annotations at the mouse position.

### Types of actions that trigger event

To modify the hover change condition when an event should be raised use [notifyOutEvent:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationhovermodifieroptions.html#notifyoutevent) and [notifyPositionUpdate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationhovermodifieroptions.html#notifypositionupdate) flags.

*   [notifyOutEvent:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationhovermodifieroptions.html#notifyoutevent) - defines whether an event should be raised when any of the annotations has become unhovered. For example, if set to false an event won't be raised when all of the annotations are unhovered. Defaults to true.
*   [notifyPositionUpdate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationhovermodifieroptions.html#notifypositionupdate) - defines whether an event should be raised when the list of hovered and unhovered annotations haven't changed. E.g. the mouse position changed within the bounds of an already hovered annotation. Defaults to false.

Hover Targets
-------------

To check only a specific set of annotations use the [targets:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationhovermodifieroptions.html#targets) property. It can accept either

*   an array of annotations
*   and array of annotation ids
*   a function returning an array of annotations
*   the name of a function registered with the [Builder API](/2d-charts/builder-api/builder-api-overview)

<CodeSnippetBlock labels={["Target Selector"]}>
    ```ts showLineNumbers file=./demo-targets.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

 Here is a simple example using the methods described above

<LiveDocSnippet name="./demo-targets" />