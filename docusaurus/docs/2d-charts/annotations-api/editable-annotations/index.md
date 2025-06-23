---
sidebar_position: 20
---

# ✅ Editable Annotations

The annotations API allows you to mark any annotation as editable by setting isEditable true.  Editable annotations can be selected and dragged, and some can be resized.  This page describes how you can respond to a user's interaction with an annotation, and how to **customise the style of the selected view** of the annotation.

Annotation Interactions
-----------------------

All annotations have the following properties and events which can be used to run code on user interaction:

| **AnnotationBase Property** | **Description** |
|----------------------------|-----------------|
| [isEditable:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#iseditable) | When true, an annotation is editable. It may be selected, dragged or resized. Individual behaviours can be controlled by the following properties. |
| [isSelected:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#isselected) | Set true when an editable annotation is clicked. This causes the selection box and the drag points to be shown. These are known as the adorners. Setting this programatically is not advised |
| [selectedChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#selectedchanged) | An event that is fired when isSelected changes. |
| [dragStarted:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#dragstarted) / [onDragStarted:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#ondragstarted) | dragStarted is an event which fires on mouseDown of an editable annotation. This is fired by the call to onDragStarted which is overridden in various annotations to determine which dragging point is being used, setting the [adornerDraggingPoint:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#adornerdraggingpoint) property. If this is not set, dragging will not be performed. You can pass a callback for the event via the [onDragStarted:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationbaseoptions.html#ondragstarted) property of the IAnnotationsBase options object when constructing. |
| [dragDelta:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#dragdelta) / [onDragAdorner:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#onDragAdorner) | dragDelta is the event which fires during dragging. This is fired by the call to onDragAdorner which translates the mouse point to xy coordinates and calls [calcDragDistance:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#calcdragdistance), which is where the coordinates of the annotation are updated. You can pass a callback for the event via the [onDrag:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationbaseoptions.html#ondrag) property of the IAnnotationsBase options object when constructing. |
| [dragEnded:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#dragended) / [onDragEnded:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#onDragEnded) | dragEnded is an event which fires on mouseUp when dragging has finished. This is fired by the call to onDragEnded. You can pass a callback for the event via the [onDragEnded:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationbaseoptions.html#ondragended) property of the IAnnotationsBase options object when constructing. |
| [resizeDirections:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#resizedirections) | Controls which direction an annotation may be resized in, e.g. X, Y or Xy |

Enabling and Subscribing to Drag Events in Annotations
------------------------------------------------------

Below is an example of how to enable editing (dragging) on a [TextAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html), as well as how to get a callback on when the annotation is updated.

<CodeSnippetBlock labels={["TS"]}>
    ```ts {11-13} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

Try it out below by dragging the annotation.

<LiveDocSnippet name="./Basic/demo" />

Dragging to discrete values
---------------------------

Sometimes you want an annotation to snap to particular values as you drag.  The way to do this is to override [onDragAdorner:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#ondragadorner) and convert to discete points there, then pass these to [calcDragDistance:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#calcdragdistancecalcDragDistance). Here is an example of an [AxisMarkerAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html) that can only take discrete values, from our [Rich Interactions Demo](https://www.scichart.com/example/javascript-chart/javascript-heatmap-interactions/).

<CodeSnippetBlock labels={["TS"]}>
```ts {} showLineNumbers file=./DiscreteAxisMarker/demo.ts start=#region_A_start end=#region_A_end
```
</CodeSnippetBlock>

Try it out below by dragging the axis marker:

<LiveDocSnippet name="./DiscreteAxisMarker/demo" />

Limiting Resize to Specific Directions (x,y)
--------------------------------------------

Another property of interactable annotation is the dimension where it can be moved or resized. By default it is possible to move a [BoxAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/boxannotation.html) towards each side of the chart. In the next example we will demonstrate a usage of the [AnnotationBase.resizeDirections:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#resizedirections) property. We will limit the annotation to resize and move only along the X Axis.

It is also possible to restrict the drag direction of the box annotation by subscribing to the [dragDelta:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#dragdelta) event callback. Find an example below.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {10,13-16} showLineNumbers file=./ResizeDirections/demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {16} showLineNumbers file=./ResizeDirections/demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

#### See Also

* [The Annotations API Overview](../annotations-api-overview/)
* [BoxAnnotation](../box-annotation/)
* [LineAnnotation](../line-annotation/)