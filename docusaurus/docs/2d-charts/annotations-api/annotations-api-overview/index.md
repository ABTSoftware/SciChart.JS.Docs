---
sidebar_position: 1
---

# 🔄 Annotations API Overview

SciChart.js features a rich Annotations API, that allows you to place annotations (boxes, markers, text labels and custom shapes) over a chart: 

Annotations can provide **interactive** event/news bullets, horizontal/vertical lines (thresholds), text/callouts as well as measurements such as Peak-to-peak or cycle duration. Annotations can be edited by click & drag, added by touching a screen, or, simply created programmatically. SciChart provides a number of built-in annotations, but you can also create your own.

Annotation Types
----------------

The following annotation types are available out of the box in SciChart:

Here's the two-column Markdown table with headers:

| Type | Description | Supported Chart Types |
|------|-------------|-----------------------|
| [BoxAnnotation](/docs/2d-charts/annotations-api/box-annotation/index.md) | Draws a **rectangle** at specific X1, X2, Y1, Y2 coordinates. | Cartesian |
| [LineAnnotation](/docs/2d-charts/annotations-api/line-annotation/index.md) | Draws a **line** between X1, Y1 and X2, Y2 positions. | Cartesian and Polar |
| [TextAnnotation](/docs/2d-charts/annotations-api/text-annotation/index.md) | Allows to place a piece of **text** at a specific location on a chart. | |
| [CustomAnnotation](/docs/2d-charts/annotations-api/custom-annotation/index.md) | Allows to place any SVG Content at a specific location on a chart. | |
| [VerticalLineAnnotation](/docs/2d-charts/annotations-api/vertical-line-annotation/index.md) | Draws a vertical line at a given x position, with various labelling options | |
| [HorizontalLineAnnotation](/docs/2d-charts/annotations-api/horizontal-line-annotation/index.md) | Draws a horizontal line at a given y position, with various labelling options | |
| [LineArrowAnnotation](/docs/2d-charts/annotations-api/line-arrow-annotation/index.md) | Allows to place line arrows at a specific location on a chart | |
| [AxisMarkerAnnotation](/docs/2d-charts/annotations-api/axis-marker-annotation/axis-marker-annotation-overview/index.md) | Allows to place a marker at a specific location on an axis | |
| [CustomAxisMarkerAnnotation](/docs/2d-charts/annotations-api/axis-marker-annotation/image-axis-marker-annotation/index.md) | Uses an image instead of text for an axis marker | |
| [NativeTextAnnotation](/docs/2d-charts/annotations-api/native-text-annotation/index.md) | Draws text natively rather than using svg, supporting rotation, multiline, wordwrap and scaling | |
| [HTMLAnnotations](/docs/2d-charts/annotations-api/html-annotation/index.md) | Allows to place HTML elements at a specific location on a chart | |
| [ArcAnnotation](/docs/2d-charts/annotations-api/arc-annotation/index.md) | Allows to place arc element at a specific location on a cartesian chart. | |
| [PolarArcAnnotation](/docs/2d-charts/annotations-api/polar-arc-annotation/index.md) | Allows to place arc element at a specific location on a polar chart. | |
| [PolarPointerAnnotation](/docs/2d-charts/annotations-api/polar-pointer-annotation/index.md) | Allows to place a pointer on a polar chart. Is used for gauge charts | |

:::info
Annotations have [surfaceTypes](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/iannotation.html#surfacetypes) property, which defines list of compatible surface types. [ESurfaceType.SciChartSurfaceType](https://www.scichart.com/documentation/js/v4/typedoc/enums/esurfacetype.html#scichartsurfacetype) stands for regular or Cartesian chart and [ESurfaceType.SciChartPolarSurfaceType](https://www.scichart.com/documentation/js/v4/typedoc/enums/esurfacetype.html#scichartpolarsurfacetype) stands for Polar chart.
:::

To learn more about any annotation type, please refer to the corresponding article.

Adding an Annotation to a Chart
-------------------------------

The [SciChartSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) stores all its annotations in the [SciChartSurface.annotations](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#annotations) collection. The following code can be used to add an annotation to a chart:

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
const {
    BoxAnnotation,
    TextAnnotation,
    LineAnnotation,
    NumericAxis,
    SciChartSurface,
    NumberRange,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ECoordinateMode,
    SciChartJsNavyTheme
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"
async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a selection of annotations to the chart
    sciChartSurface.annotations.add(
        new LineAnnotation({
            stroke: "#FF6600",
            strokeThickness: 3,
            x1: 2.0,
            x2: 8.0,
            y1: 3.0,
            y2: 7.0
        }),
        new BoxAnnotation({
            stroke: "#FF3333",
            strokeThickness: 1,
            fill: "rgba(255,50,50,0.3)",
            x1: 2.0,
            x2: 8.0,
            y1: 3.0,
            y2: 7.0
        }),
        new BoxAnnotation({
            stroke: "#33FF33",
            strokeThickness: 1,
            fill: "rgba(50, 255, 50, 0.3)",
            x1: 3.0,
            x2: 9.0,
            y1: 4.0,
            y2: 8.0
        }),
        new TextAnnotation({
            x1: 100,
            y1: 0.5,
            xCoordinateMode: ECoordinateMode.Pixel,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            textColor: "yellow",
            fontSize: 26,
            fontFamily: "Default",
            text: "TEXT ANNOTATION"
        })
    );
}

addAnnotationToChart("scichart-root");
```

```ts
const { chartBuilder, EAnnotationType, ECoordinateMode, EVerticalAnchorPoint, EHorizontalAnchorPoint } = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"
const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    annotations: \[
        {
            type: EAnnotationType.RenderContextBoxAnnotation,
            options: {
                stroke: "#FF3333",
                strokeThickness: 1,
                fill: "rgba(255,50,50,0.3)",
                x1: 2.0,
                x2: 8.0,
                y1: 3.0,
                y2: 7.0
            }
        },
        {
            type: EAnnotationType.RenderContextBoxAnnotation,
            options: {
                stroke: "#33FF33",
                strokeThickness: 1,
                fill: "rgba(50,255,50,0.3)",
                x1: 3.0,
                x2: 9.0,
                y1: 4.0,
                y2: 8.0
            }
        },
        {
            type: EAnnotationType.SVGTextAnnotation,
            options: {
                x1: 100,
                y1: 0.5,
                xCoordinateMode: ECoordinateMode.Pixel,
                yCoordinateMode: ECoordinateMode.Relative,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                verticalAnchorPoint: EVerticalAnchorPoint.Center,
                textColor: "yellow",
                fontSize: 26,
                fontFamily: "Times New Roman",
                text: "TEXT ANNOTATION"
            }
        }
    \]
});
```

This results in the following output:

```ts
<div id="scichart-root"></div>
```
```ts
body {
  margin: 0;
}
#scichart-root {
  width: 100%;
  height: 100vh;
}
```
```ts
import \* as SciChart from "scichart";

// #region ExampleA
const {
    BoxAnnotation,
    TextAnnotation,
    LineAnnotation,
    NumericAxis,
    SciChartSurface,
    NumberRange,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ECoordinateMode,
    SciChartJsNavyTheme
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a selection of annotations to the chart
    sciChartSurface.annotations.add(
        new LineAnnotation({
            stroke: "#FF6600",
            strokeThickness: 3,
            x1: 2.0,
            x2: 8.0,
            y1: 3.0,
            y2: 7.0
        }),
        new BoxAnnotation({
            stroke: "#FF3333",
            strokeThickness: 1,
            fill: "rgba(255,50,50,0.3)",
            x1: 2.0,
            x2: 8.0,
            y1: 3.0,
            y2: 7.0
        }),
        new BoxAnnotation({
            stroke: "#33FF33",
            strokeThickness: 1,
            fill: "rgba(50, 255, 50, 0.3)",
            x1: 3.0,
            x2: 9.0,
            y1: 4.0,
            y2: 8.0
        }),
        new TextAnnotation({
            x1: 100,
            y1: 0.5,
            xCoordinateMode: ECoordinateMode.Pixel,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            textColor: "yellow",
            fontSize: 26,
            fontFamily: "Default",
            text: "TEXT ANNOTATION"
        })
    );
}

addAnnotationToChart("scichart-root");
// #endregion

async function builderExample(divElementId) {
    // #region ExampleB
    const { chartBuilder, EAnnotationType, ECoordinateMode, EVerticalAnchorPoint, EHorizontalAnchorPoint } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        annotations: \[
            {
                type: EAnnotationType.RenderContextBoxAnnotation,
                options: {
                    stroke: "#FF3333",
                    strokeThickness: 1,
                    fill: "rgba(255,50,50,0.3)",
                    x1: 2.0,
                    x2: 8.0,
                    y1: 3.0,
                    y2: 7.0
                }
            },
            {
                type: EAnnotationType.RenderContextBoxAnnotation,
                options: {
                    stroke: "#33FF33",
                    strokeThickness: 1,
                    fill: "rgba(50,255,50,0.3)",
                    x1: 3.0,
                    x2: 9.0,
                    y1: 4.0,
                    y2: 8.0
                }
            },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    x1: 100,
                    y1: 0.5,
                    xCoordinateMode: ECoordinateMode.Pixel,
                    yCoordinateMode: ECoordinateMode.Relative,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                    textColor: "yellow",
                    fontSize: 26,
                    fontFamily: "Times New Roman",
                    text: "TEXT ANNOTATION"
                }
            }
        \]
    });
    // #endregion
}

// Uncomment this to use the builder example //builderExample("scichart-root");
```

Individual Annotation features are discussed in greater detail in the following pages:

*   The [BoxAnnotation](BoxAnnotation.html) Type
*   The [LineAnnotation](LineAnnotation.html) Type
*   The [TextAnnotation](TextAnnotation.html) Type
*   The [CustomAnnotation](CustomAnnotation.html) Type

Common Annotation Properties
----------------------------

All annotations in SciChart.js are derived from the [AnnotationBase](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html) **type. Individual Annotations have additional properties however the following common properties of the [AnnotationBase](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html) class listed below can be used to control all annotation types.**

**AnnotationBase Property**

**Description**

[annotationLayer](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#annotationlayer)

Determines which canvas the annotation should be placed on.

The default is [EAnnotationLayer.AboveChart](https://www.scichart.com/documentation/js/current/typedoc/enums/eannotationlayer.html), where annotations are displayed above the chart series.

Setting this property to [EAnnotationLayer.BelowChart](https://www.scichart.com/documentation/js/current/typedoc/enums/eannotationlayer.html) places an annotation below series but above gridlines, axis bands and axis labels. Note that this method doesn't work with SVG based annotations such as [TextAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html) and [CustomAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/customannotation.html).

Finally, setting the property to [EAnnotationLayer.Background](https://www.scichart.com/documentation/js/current/typedoc/enums/eannotationlayer.html#background), places an annotation below all elements on the chart (series, axis bands, gridlines, axis labels). This method works with all annotation types including SVG, and is useful for placing watermarks on the chart.

[xCoordinateMode](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#xcoordinatemode),   
[yCoordinateMode](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#ycoordinatemode)

Determines how coordinates x1,y2,x2,y2 are used when placing the annotation. X/YCoordinateMode should be used to place watermarks, or annotations anchored to the top or bottom of the viewport etc…

The default is [ECoordinateMode.DataValue](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html). In this mode, x1,y2,x2,y2 correspond to Data-values and the annotion position will update as you zoom and pan the chart.

[ECoordinateMode.Relative](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html) means that coordinates are relative to the viewport. The annotation does not update position as you zoom and pan. E.g. x1=0.0 and y1=0.0 means the annotation will be placed in the top-left corner of the Viewport and x1=1.0, y1=1.0 corresponds to the bottom-left corner of the viewport always (regardless of Zoom or Pan).

[ECoordinateMode.Pixel](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html) means that coordinates are pixel values relative to the top-left of the viewport. These are also useful to dock annotations to a specific

[horizontalAnchorPoint](https://www.scichart.com/documentation/js/current/typedoc/classes/svgannotationbase.html#horizontalanchorpoint),   
[verticalAnchorPoint](https://www.scichart.com/documentation/js/current/typedoc/classes/svgannotationbase.html#verticalanchorpointproperty)

The horizontalAnchorPoint, verticalAnchorPoint properties are used to adjust the alignment of certain annotations.

![](img/1.png)

Above: HorizontalAnchorPoint, VerticalAnchorPoint when applied to a TextAnnotation

[isHidden](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#ishidden)

isHidden can be set to show or hide an annotation.

[hovered](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#hovered), [isHovered](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#ishovered), [selectedChanged](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#selectedchanged), [isSelected](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#isselected)

Annotations can be made interactive with selection and hover callbacks. To find out how to enable this, read the [Annotation Hover](AnnotationHover.html) page.

[resizeDirections](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#resizedirections)

Allows you to specify which direction (X, Y, Xy) an annotation may be resized in.

[dragStarted](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#dragstarted), [dragDelta](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#dragdelta), [dragEnded](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#dragended)

Callbacks may be registered when an annotation is dragged by the user

[x1](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#x1),[x2](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#x2),[y1](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#y1),[y2](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#y2)

x1,x2,y1,y2 properties are set to define the position of the annotation on the parent chart.

Note that annotation position is also defined by the xCoordinateMode, yCoordinateMode properties, which allow you to place annotations using data-values, relative to the viewport or absolute pixel coordinates.

[xAxisId](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#xaxisid), [yAxisId](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#yaxisid)

In a multiple-axis scenario, AnnotationBase.xAxisId or yAxisId property is used to bind the annotation to a specific X or Y-Axis.

**_NOTE:_** _This value must be supplied if you have axis with non-default Axis Ids._

[isEditable](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#iseditable)

If true, this annotation can be selected and dragged/resized.  See [Editable Annotations](EditableAnnotations.html) for more details

[clicked](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#clicked) / [onClick](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationbaseoptions.html#onclick)

clicked is an event on the annotation which you can subscribe to to be notified when the annotation is clicked.  This is fired for both editable and non-editable annotations.  You can pass a callback for this using the onClick property of the IAnnotationBaseOptions.  The event arguments contain a point which gives the coordinates of where on the annotation it was clicked, relative to the top left corner.

**_NOTE:_**  If and editable annotation is already selected, clicking on it will fire dragStarted, but not clicked

More annotation properties and the inheritence hierachy may be viewed at the [AnnotationBase Typedoc page](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html).

See Also

[BoxAnnotation](BoxAnnotation.html)

[LineAnnotation](LineAnnotation.html)

[CustomAnnotation](CustomAnnotation.html)

[TextAnnotation](TextAnnotation.html)

TODO: update with the text supported surface types Polar not Cartesian

```typescript
export class LineAnnotation extends RenderContextAnnotationBase {
    ...
    public readonly surfaceTypes: ESurfaceType[] = [
        ESurfaceType.SciChartSurfaceType,
        ESurfaceType.SciChartPolarSurfaceType
    ];
    ...
}
```
