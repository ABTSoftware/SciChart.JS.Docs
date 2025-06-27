---
sidebar_position: 3
---

# Annotation Hover

Annotations Hover API is an opt-in functionality that allows detecting hover events on chart annotations and adding event handlers.

The [](https://demo.scichart.com/javascript-line-chart)[](https://demo.scichart.com/javascript-line-chart)[JavaScript Hoverable Trade Markers Example](https://demo.scichart.com/javascript/stock-chart-buy-sell-markers) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript-line-chart)

 _**Above**: The [](https://demo.scichart.com/javascript-line-chart)[](https://demo.scichart.com/javascript-line-chart)[JavaScript Hoverable Trade Markers Example](https://demo.scichart.com/javascript/stock-chart-buy-sell-markers)_ _from the SciChart.js Demo, showing trade markers with tooltips on hover ._

Using AnnotationHoverModifier
-----------------------------

To enable the hover detection we need to add the [AnnotationHoverModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html).

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Add an annotation with hover behaviour
const boxAnnotation = new BoxAnnotation({
    xCoordinateMode: ECoordinateMode.Relative,
    yCoordinateMode: ECoordinateMode.Relative,
    fill: "#3d34eb",
    strokeThickness: 1,
    x1: 0.1,
    x2: 0.4,
    y1: 0.4,
    y2: 0.6,
    onHover: args => {
        const { sender, mouseArgs, isHovered } = args;
        if (mouseArgs && isHovered) {
            const relativeCoordinates = args.getRelativeCoordinates();
            console.log("The annotation is hovered at", relativeCoordinates);
        }
    }
});
sciChartSurface.annotations.add(boxAnnotation);
// Add AnnotationHoverModifier to enable hover behaviour
const annotationHoverModifier = new AnnotationHoverModifier({
    enableHover: true,
    targets: \[boxAnnotation\],
    hoverMode: EHoverMode.AbsoluteTopmost,
    notifyOutEvent: true,
    notifyPositionUpdate: true,
    onHover: args => {
        const { mouseArgs, includedEntities, hoveredEntities, unhoveredEntities } = args;
        const hoveredAnnotations = /\*\* @type {BoxAnnotation\[\]} \*/ (hoveredEntities);
        const unhoveredAnnotations = /\*\* @type {BoxAnnotation\[\]} \*/ (unhoveredEntities);
        hoveredAnnotations.forEach(annotation => {
            annotation.fill = "#34eb8c";
            annotation.strokeThickness = 3;
        });
        unhoveredAnnotations.forEach(annotation => {
            annotation.fill = "#3d34eb";
            annotation.strokeThickness = 1;
        });
    }
});
sciChartSurface.chartModifiers.add(annotationHoverModifier);
```

```ts
const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: {
        theme: new SciChartJsNavyTheme()
    },
    // Add an annotation with hover behaviour
    annotations: \[
        {
            type: EAnnotationType.RenderContextBoxAnnotation,
            options: {
                id: "boxAnnotation",
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative,
                fill: "#3d34eb",
                strokeThickness: 1,
                x1: 0.1,
                x2: 0.4,
                y1: 0.4,
                y2: 0.6,
                onHover: args => {
                    const { sender, mouseArgs, isHovered } = args;
                    if (mouseArgs && isHovered) {
                        const relativeCoordinates = args.getRelativeCoordinates();
                        console.log("The annotation is hovered at", relativeCoordinates);
                    }
                }
            }
        }
    \],
    // Add AnnotationHoverModifier to enable hover behaviour
    modifiers: \[
        {
            type: EChart2DModifierType.AnnotationHover,
            options: {
                enableHover: true,
                targets: \["boxAnnotation"\],
                hoverMode: EHoverMode.AbsoluteTopmost,
                notifyOutEvent: true,
                notifyPositionUpdate: true,
                onHover: args => {
                    const { mouseArgs, includedEntities, hoveredEntities, unhoveredEntities } = args;
                    const hoveredAnnotations = /\*\* @type {BoxAnnotation\[\]} \*/ (hoveredEntities);
                    const unhoveredAnnotations = /\*\* @type {BoxAnnotation\[\]} \*/ (unhoveredEntities);
                    hoveredAnnotations.forEach(annotation => {
                        annotation.fill = "#34eb8c";
                        annotation.strokeThickness = 3;
                    });
                    unhoveredAnnotations.forEach(annotation => {
                        annotation.fill = "#3d34eb";
                        annotation.strokeThickness = 1;
                    });
                }
            }
        }
    \]
});
```

Adding Hover Event Handlers
---------------------------

There are several different options for adding a callback for the hover event.

1\. By passing [onHover:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationbaseoptions.html#onhover) via an [annotation constructor options:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#constructor), or subscribing to the [annotation.hovered:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#hovered) event handler on an [AnnotationBase:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html) derived type.  This allows you to have different hover behaviour for each annotation, and the args has a method which allows you to find out where on the annotation the over occurred.

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

/\*\* @import {BoxAnnotation} from "scichart" \*/

const {
    SciChartSurface,
    SciChartJsNavyTheme,
    NumericAxis,
    BoxAnnotation,
    ECoordinateMode,
    AnnotationHoverModifier,
    EHoverMode
} = SciChart;

async function annotationHover(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region PrimaryExample
    // Add an annotation with hover behaviour
    const boxAnnotation = new BoxAnnotation({
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        fill: "#3d34eb",
        strokeThickness: 1,
        x1: 0.1,
        x2: 0.4,
        y1: 0.4,
        y2: 0.6,
        onHover: args => {
            const { sender, mouseArgs, isHovered } = args;
            if (mouseArgs && isHovered) {
                const relativeCoordinates = args.getRelativeCoordinates();
                console.log("The annotation is hovered at", relativeCoordinates);
            }
        }
    });
    sciChartSurface.annotations.add(boxAnnotation);
    // Add AnnotationHoverModifier to enable hover behaviour
    const annotationHoverModifier = new AnnotationHoverModifier({
        enableHover: true,
        targets: \[boxAnnotation\],
        hoverMode: EHoverMode.AbsoluteTopmost,
        notifyOutEvent: true,
        notifyPositionUpdate: true,
        onHover: args => {
            const { mouseArgs, includedEntities, hoveredEntities, unhoveredEntities } = args;
            const hoveredAnnotations = /\*\* @type {BoxAnnotation\[\]} \*/ (hoveredEntities);
            const unhoveredAnnotations = /\*\* @type {BoxAnnotation\[\]} \*/ (unhoveredEntities);
            hoveredAnnotations.forEach(annotation => {
                annotation.fill = "#34eb8c";
                annotation.strokeThickness = 3;
            });
            unhoveredAnnotations.forEach(annotation => {
                annotation.fill = "#3d34eb";
                annotation.strokeThickness = 1;
            });
        }
    });
    sciChartSurface.chartModifiers.add(annotationHoverModifier);
    // #endregion
    // #region AnnotationEventHandler
    // subscribe via Event Handler
    boxAnnotation.hovered.subscribe(args => {
        // ...
    });
    // #endregion
    // #region ModifierEventHandler
    // subscribe via Event Handler
    annotationHoverModifier.hoverChanged.subscribe(args => {
        // ...
    });
    // #endregion
    return { sciChartSurface };
}

annotationHover("scichart-root");

const { chartBuilder, EChart2DModifierType, EAnnotationType } = SciChart;

async function builderExample(divElementId) {
    // #region Example1WithBuilderAPI
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: {
            theme: new SciChartJsNavyTheme()
        },
        // Add an annotation with hover behaviour
        annotations: \[
            {
                type: EAnnotationType.RenderContextBoxAnnotation,
                options: {
                    id: "boxAnnotation",
                    xCoordinateMode: ECoordinateMode.Relative,
                    yCoordinateMode: ECoordinateMode.Relative,
                    fill: "#3d34eb",
                    strokeThickness: 1,
                    x1: 0.1,
                    x2: 0.4,
                    y1: 0.4,
                    y2: 0.6,
                    onHover: args => {
                        const { sender, mouseArgs, isHovered } = args;
                        if (mouseArgs && isHovered) {
                            const relativeCoordinates = args.getRelativeCoordinates();
                            console.log("The annotation is hovered at", relativeCoordinates);
                        }
                    }
                }
            }
        \],
        // Add AnnotationHoverModifier to enable hover behaviour
        modifiers: \[
            {
                type: EChart2DModifierType.AnnotationHover,
                options: {
                    enableHover: true,
                    targets: \["boxAnnotation"\],
                    hoverMode: EHoverMode.AbsoluteTopmost,
                    notifyOutEvent: true,
                    notifyPositionUpdate: true,
                    onHover: args => {
                        const { mouseArgs, includedEntities, hoveredEntities, unhoveredEntities } = args;
                        const hoveredAnnotations = /\*\* @type {BoxAnnotation\[\]} \*/ (hoveredEntities);
                        const unhoveredAnnotations = /\*\* @type {BoxAnnotation\[\]} \*/ (unhoveredEntities);
                        hoveredAnnotations.forEach(annotation => {
                            annotation.fill = "#34eb8c";
                            annotation.strokeThickness = 3;
                        });
                        unhoveredAnnotations.forEach(annotation => {
                            annotation.fill = "#3d34eb";
                            annotation.strokeThickness = 1;
                        });
                    }
                }
            }
        \]
    });
    // #endregion

    return { sciChartSurface };
}

// Uncomment this to use the builder example //builderExample("scichart-root");
```

2\. By passing [onHover:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iannotationhovermodifieroptions.html#onhover) via the constructor of the [AnnotationHoverModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html) or subscribing to the [annotationHoverModifier.hoverChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html#hoverchanged) event handler on an instance of [AnnotationHoverModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html).  This gives you a single callback with access to both the hovered and unhovered annotations, allowing you to define common hover behaviour in one place, and enabling you to update other annotations when one is hovered.

Hover on modifier

Copy Code

```ts
// onHover in constructor.  Internally this just subcribes to the hovered event using the function you pass in.
  const annotationHoverModifier = new AnnotationHoverModifier({
    onHover: (args /\* type IHoverCallbackArgs<IAnnotation> \*/) => {
      const { mouseArgs, includedEntities, hoveredEntities, unhoveredEntities } = args;
      // ...
    }
  });
// subscribe to hovered event directly
annotationHoverModifier.hoverChanged.subscribe((args /\* type IHoverCallbackArgs<IAnnotation> \*/) => {
  // ...
});
```

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
*   the name of a function registered with the [Builder API](/docs/2d-charts/builder-api/builder-api-overview)

*   [Target Selector](#i-tab-content-Typescript)

```ts
const targetsSelector = modifier => hoverableAnnotations;

const annotationHoverModifier = new AnnotationHoverModifier({
    targets: targetsSelector,
    hoverMode: EHoverMode.Multi
});
```

 Here is a simple example using the methods described above

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

/\*\* @import {BoxAnnotation} from "scichart" \*/

const {
    EChart2DModifierType,
    EAnnotationType,
    ECoordinateMode,
    TextAnnotation,
    AnnotationHoverEventArgs,
    BoxAnnotation,
    EHoverMode,
    NumericAxis,
    SciChartJsNavyTheme,
    SciChartSurface,
    chartBuilder,
    AnnotationHoverModifier
} = SciChart;

async function annotationHoverTargets(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    const primaryColors = \["#4FBEE6", "#AD3D8D", "#6BBDAE", "#E76E63", "#2C4B92"\];

    const secondaryColors = \["Blue", "Green", "Red", "Yellow", "Orange"\];
    const hoverableAnnotations = \[\];

    const annotationSize = 0.1;
    const gap = 0.01;
    for (let i = 0; i < 5; ++i) {
        const annotation = new BoxAnnotation({
            isEditable: true,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            stroke: primaryColors\[i\],
            fill: secondaryColors\[i\],
            strokeThickness: 1,
            x1: 0.1 + (annotationSize + gap) \* i,
            x2: 0.1 + annotationSize + (annotationSize + gap) \* i,
            y1: 0.7,
            y2: 0.5
        });
        hoverableAnnotations.push(annotation);
        sciChartSurface.annotations.add(annotation);
    }

    const textAnnotation = new TextAnnotation({
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        text: "Nonhoverable Annotation",
        textColor: "black",
        fontSize: 24,
        x1: 0.1,
        y1: 0.3
    });

    const nonHoverableAnnotation = new BoxAnnotation({
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        fill: "#eb34cc",
        strokeThickness: 1,
        x1: 0.1,
        x2: 0.6,
        y1: 0.4,
        y2: 0.2
    });

    sciChartSurface.annotations.add(nonHoverableAnnotation, textAnnotation);

    // #region ModifierTargetsSelector
    const targetsSelector = modifier => hoverableAnnotations;

    const annotationHoverModifier = new AnnotationHoverModifier({
        targets: targetsSelector,
        hoverMode: EHoverMode.Multi
    });
    // #endregion

    sciChartSurface.chartModifiers.add(annotationHoverModifier);

    annotationHoverModifier.hoverChanged.subscribe(args => {
        const { includedEntities } = args;

        // annotations returned by the targetsSelector
        const includedAnnotations = /\*\* @type {BoxAnnotation\[\]} \*/ (includedEntities);

        includedAnnotations.forEach((annotation, index) => {
            if (annotation.isHovered) {
                annotation.stroke = "#87ceeb";
                annotation.strokeThickness = 3;
            } else {
                annotation.stroke = primaryColors\[index\];
                annotation.strokeThickness = 1;
            }
        });
    });

    return { sciChartSurface };
}

annotationHoverTargets("scichart-root");
```