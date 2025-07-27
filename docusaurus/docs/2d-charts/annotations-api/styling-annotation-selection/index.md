---
sidebar_position: 21
---

# Styling Annotation Selection

The Annotations API allows to customize the interaction adorners style of an editable annotation. This includes:

1.  specifying the grip points that could be used for interaction with the annotation
2.  specifying the radius of the grip points
3.  setting a custom svg template for the grips

There is a number of common properties which could be used to customize the look and behavior of interactive annotations. They could be passed as constructor options, which are described by the [IAnnotationBaseOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationbaseoptions.html). And the relevant properties are defined as follows:

<CodeSnippetBlock labels={["Discrete Dragging"]}>
    ```ts
    /** The direction in which the annotation is allowed to be resized or dragged */
    resizeDirections?: EXyDirection;
    /** if true, the annotation is editable (can be dragged and manipulated by the user) */
    isEditable?: boolean;
    /** The stroke color for the adorner drag handle */
    annotationsGripsStroke?: string;
    /** The fill color for the adorner drag handle */
    annotationsGripsFill?: string;
    /** The radius of the adorner drag handle */
    annotationsGripsRadius?: number;
    /** The stroke color for the adorner selection box */
    selectionBoxStroke?: string;
    /** How much bigger the selection box is than the bounding box of the annotation, in pixels */
    selectionBoxDelta?: number;
    /** The thickness of the selection box line */
    selectionBoxThickness?: number;
    /** The dragPoints that should be enabled for this annotation */
    dragPoints?: readonly EDraggingGripPoint[];
    ```
</CodeSnippetBlock>

Also, the same properties could be modified using the properties on an annotation instance:

*   [AnnotationBase.resizeDirections:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#resizedirections)
*   [AnnotationBase.annotationsGripsStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#annotationsgripsstroke)
*   [AnnotationBase.annotationsGripsFill:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#annotationsgripsfill)
*   [AnnotationBase.annotationsGripsRadius:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#annotationsgripsradius)
*   [AnnotationBase.selectionBoxStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#selectionboxstroke)
*   [AnnotationBase.selectionBoxDelta:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#selectionboxdelta)
*   [AnnotationBase.selectionBoxThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#selectionboxthickness)
*   [AnnotationBase.dragPoints:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html#dragpoints)

Default Adorners Style
----------------------

We will start by creating a [BoxAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/boxannotation.html) on a surface and will use it as a boilerplate for further examples (other types of annotations could be modified similarly). In order to make the annotation interactable, we will set [IAnnotationBaseOptions.isEditable:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationbaseoptions.html#iseditable) flag. Also we will set [IAnnotationBaseOptions.isSelected:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationbaseoptions.html#isselected) to display adorners of the annotation.

<CodeSnippetBlock labels={["TS"]}>
    ```ts {7-14} showLineNumbers
    // ...
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const boxAnnotation = new BoxAnnotation({
        x1: 3,
        x2: 7,
        y1: 3,
        y2: 7,
        isEditable: true,
        isSelected: true,
    });
    sciChartSurface.annotations.add(boxAnnotation);
    ```
</CodeSnippetBlock>

As you can see the adorners consist of the outlining **selection box** used for highlighting a selected annotation, and **dragging grip points** - used to resize or move an annotation when dragged by a cursor. 

<CenteredImageWrapper 
    src="/images/DefaultAdorners.png"
/>

Custom Adorners Style
---------------------

Here we will demonstrate how to apply custom styles for the adorners. So in this example we changed the colors and sizes of the selection box and grip points.

Modify the code as follow:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {11-16} showLineNumbers file=./demo1.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {18-23} showLineNumbers file=./demo1.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

 This results in the following output:

<LiveDocSnippet name="./demo1" />

Modifying Dragging Grip Points
------------------------------

By default, an annotation uses all of the predefined grip points for interactions (corners and body), but this can be changed to allow dragging and resizing only using specific ones. For this we will use the [IAnnotationBaseOptions.dragPoints:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationbaseoptions.html#dragpoints) (or [AnnotationBase.dragPoints:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#dragpoints)) property.

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {18} showLineNumbers file=./demo2.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {25} showLineNumbers file=./demo2.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This modifies the output as follows: 

<LiveDocSnippet name="./demo2" />

Custom Adorners SVG
-------------------

More advanced option to customize the adorners is to override the SVG template for the selection box and grips. To do this we can create a derived annotation class, which in this case extends [BoxAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/boxannotation.html). In the class we are overriding the [AnnotationBase.getAnnotationGripSvg:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#getannotationgripsvg) and [AnnotationBase.svgStringAdornerTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#svgstringadornertemplate) methods, which are used to create the adorners.

<CodeSnippetBlock labels={["TS"]}>
    ```ts {} showLineNumbers file=./demo3.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>
Then simply create and use an instance of the customized annotation:

<CodeSnippetBlock labels={["Custom Adorners SVG"]}>
    ```ts {3} showLineNumbers file=./demo3.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./demo3" />