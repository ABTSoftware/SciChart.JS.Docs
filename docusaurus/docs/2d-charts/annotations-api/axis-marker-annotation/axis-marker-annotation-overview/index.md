---
sidebar_position: 1
---

# AxisMarkerAnnotation

The [AxisMarkerAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html) allows you to add a label on to the Axis at a specific X or Y value.

<CenteredImageWrapper 
    src="/images/Annotations_AxisMarkerAnnotation.png"
/>

Declaring a AxisMarkerAnnotation in code
----------------------------------------

The following code will declare an [AxisMarkerAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html) add it to the chart.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts {14,24} showLineNumbers file=./demo.ts start=#region_A_start end=#region_A_end
    ```
    ```ts {7,18} showLineNumbers file=./demo.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Results in the following output: 

<LiveDocSnippet name="./demo" />

Styling the AxisMarkerAnnotation
--------------------------------

The following properties can be set to style the [AxisMarkerAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html):

| **Property** | **Description** |
|--------------|-----------------|
| [backgroundColor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#backgroundColor) | The box fill color for the axis label |
| [color:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#color) | The text-color for the axis label |
| [fontFamily:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#fontfamily) | The font family for the axis label text |
| [fontSize:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#fontSize) | The font size for the axis label text |
| [fontStyle:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#fontStyle) | The font style, e.g. Bold or Italic for the axis label text |
| [formattedValue:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#formattedvalue) | The formatted value on the axis label. This defaults to the Y-value formatted by the [yAxis.labelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#labelprovider). This can be overridden by a custom label value by setting this property. |
| [annotationGripsFill:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#annotationsgripsfill) | The fill color for the annotations grips when editing (dragging) |
| [annotationsGripsRadius:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#annotationsgripsradius) | The radius for the annotations grips when editing (dragging) |
| [annotationGripsStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axismarkerannotation.html#annotationsgripsstroke) | The stroke color for the annotations grips when editing. |

#### See Also

* [The Annotations API Overview](/docs/2d-charts/annotations-api/axis-marker-annotation/axis-marker-annotation-overview)