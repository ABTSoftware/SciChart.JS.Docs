---
sidebar_position: 1
---

# The VerticalSliceModifier Type

With the [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html), SciChart.js provides the ability to place multiple vertical lines on the chart, which can show tooltips intersecting chart series.

This provides a similar behaviour to the [RolloverModifier](RolloverModifier.html), except instead of a single vertical line plus tooltips which track the mouse, you can place multiple draggable vertical lines on the chart, which intersect line series and display tooltips.

The [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) allows you to:

*   Place one or more vertical lines on the chart at data-values, relative coordinates or pixel coordinates
*   Vertical lines intersect chart series
*   Tooltips may be displayed at the intersections
*   Optionally show/hide or customize the tooltip content
*   Vertical lines may be dragged or edited
*   Vertical lines may be removed from the chart.

The [](https://demo.scichart.com/javascript-line-chart)[](https://demo.scichart.com/javascript-line-chart)[Using VerticalSliceModifier Example](https://demo.scichart.com/javascript/chart-vertical-slice-modifier) can be found in the [SciChart.Js Examples Suite](https://github.com/abtsoftware/scichart.js.examples) on Github, or our live demo at [demo.scichart.com](https://demo.scichart.com/javascript-line-chart)

Adding a VerticalSliceModifier to a Chart
-----------------------------------------

One or more [VerticalSliceModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) can be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#chartmodifiers) collection to enable draggable lines with crosshair/cursor behavior. For example, this code adds a crosshair, enables default tooltips and allows dragging of the vertical lines.

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Create a chart surface
const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    titleStyle: { fontSize: 16 }
});

// For the example to work, axis must have EAutoRange.Always
sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));
sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-2, 0.5),
        axisTitle: "Y Axis"
    })
);

// Add some vertical slices to the chart
const vSlice1 = new VerticalSliceModifier({
    x1: 10.1,
    xCoordinateMode: ECoordinateMode.DataValue,
    isDraggable: true,
    // Defines if rollover vertical line is shown
    showRolloverLine: true,
    rolloverLineStrokeThickness: 1,
    rolloverLineStroke: "#FF6600",
    lineSelectionColor: "#FF6600",
    // Shows the default tooltip
    showTooltip: true
});
const vSlice2 = new VerticalSliceModifier({
    x1: 30.0,
    xCoordinateMode: ECoordinateMode.DataValue,
    isDraggable: true,
    // Defines if rollover vertical line is shown
    showRolloverLine: true,
    rolloverLineStrokeThickness: 1,
    rolloverLineStroke: "#50C7E0",
    lineSelectionColor: "#50C7E0",
    // Shows the default tooltip
    showTooltip: true
});
sciChartSurface.chartModifiers.add(vSlice1, vSlice2);
```

```ts
// Demonstrates how to configure the VerticalSliceModifier in SciChart.js using the Builder API
const { chartBuilder, EThemeProviderType, ECoordinateMode, EChart2DModifierType } = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    modifiers: \[
        {
            type: EChart2DModifierType.VerticalSlice,
            options: {
                x1: 10.1,
                xCoordinateMode: ECoordinateMode.DataValue,
                isDraggable: true,
                // Defines if rollover vertical line is shown
                showRolloverLine: true,
                rolloverLineStrokeThickness: 1,
                rolloverLineStroke: "#FF6600",
                lineSelectionColor: "#FF6600",
                // Shows the default tooltip
                showTooltip: true
            }
        },
        {
            type: EChart2DModifierType.VerticalSlice,
            options: {
                x1: 30.0,
                xCoordinateMode: ECoordinateMode.DataValue,
                isDraggable: true,
                // Defines if rollover vertical line is shown
                showRolloverLine: true,
                rolloverLineStrokeThickness: 1,
                rolloverLineStroke: "#50C7E0",
                lineSelectionColor: "#50C7E0",
                // Shows the default tooltip
                showTooltip: true
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

async function basicVerticalSliceModifier(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        EAutoRange,
        NumberRange,
        VerticalSliceModifier,
        TextAnnotation,
        EHorizontalAnchorPoint,
        ECoordinateMode,
        EllipsePointMarker,
        ZoomPanModifier,
        ZoomExtentsModifier,
        MouseWheelZoomModifier
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // #region ExampleA
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        titleStyle: { fontSize: 16 }
    });

    // For the example to work, axis must have EAutoRange.Always
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-2, 0.5),
            axisTitle: "Y Axis"
        })
    );

    // Add some vertical slices to the chart
    const vSlice1 = new VerticalSliceModifier({
        x1: 10.1,
        xCoordinateMode: ECoordinateMode.DataValue,
        isDraggable: true,
        // Defines if rollover vertical line is shown
        showRolloverLine: true,
        rolloverLineStrokeThickness: 1,
        rolloverLineStroke: "#FF6600",
        lineSelectionColor: "#FF6600",
        // Shows the default tooltip
        showTooltip: true
    });
    const vSlice2 = new VerticalSliceModifier({
        x1: 30.0,
        xCoordinateMode: ECoordinateMode.DataValue,
        isDraggable: true,
        // Defines if rollover vertical line is shown
        showRolloverLine: true,
        rolloverLineStrokeThickness: 1,
        rolloverLineStroke: "#50C7E0",
        lineSelectionColor: "#50C7E0",
        // Shows the default tooltip
        showTooltip: true
    });
    sciChartSurface.chartModifiers.add(vSlice1, vSlice2);

    // #endregion

    // Add some series to inspect
    const xValues = \[\];
    const yValues = \[\];
    const yValues2 = \[\];
    for (let i = 0; i < 50; i++) {
        xValues.push(i);
        yValues.push(0.2 \* Math.sin(i \* 0.25) - Math.cos(i \* 0.02));
        yValues2.push(0.5 \* Math.cos(i \* 0.18) - Math.sin(i \* 0.025));
    }

    const pointMarker = new EllipsePointMarker(wasmContext, {
        width: 7,
        height: 7,
        fill: "white",
        strokeThickness: 0
    });

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#FF6600",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues,
                dataSeriesName: "Sinewave 1"
            }),
            pointMarker
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: yValues2,
                dataSeriesName: "Sinewave 2"
            }),
            pointMarker
        })
    );

    // Add some instructions to the user
    const options = {
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 0.0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White"
    };
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "VerticalSliceModifier Example",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Pan the chart or drag vertical lines to see tooltips update",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );

    // Add further zooming and panning behaviours
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
}

basicVerticalSliceModifier("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the VerticalSliceModifier in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, ECoordinateMode, EChart2DModifierType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        modifiers: \[
            {
                type: EChart2DModifierType.VerticalSlice,
                options: {
                    x1: 10.1,
                    xCoordinateMode: ECoordinateMode.DataValue,
                    isDraggable: true,
                    // Defines if rollover vertical line is shown
                    showRolloverLine: true,
                    rolloverLineStrokeThickness: 1,
                    rolloverLineStroke: "#FF6600",
                    lineSelectionColor: "#FF6600",
                    // Shows the default tooltip
                    showTooltip: true
                }
            },
            {
                type: EChart2DModifierType.VerticalSlice,
                options: {
                    x1: 30.0,
                    xCoordinateMode: ECoordinateMode.DataValue,
                    isDraggable: true,
                    // Defines if rollover vertical line is shown
                    showRolloverLine: true,
                    rolloverLineStrokeThickness: 1,
                    rolloverLineStroke: "#50C7E0",
                    lineSelectionColor: "#50C7E0",
                    // Shows the default tooltip
                    showTooltip: true
                }
            }
        \]
    });
    // #endregion

    const xValues = \[\];
    const yValues = \[\];
    const yValues2 = \[\];
    for (let i = 0; i < 50; i++) {
        xValues.push(i);
        yValues.push(0.2 \* Math.sin(i \* 0.25) - Math.cos(i \* 0.02));
        yValues2.push(0.5 \* Math.cos(i \* 0.18) - Math.sin(i \* 0.025));
    }

    const { EllipsePointMarker, FastLineRenderableSeries, XyDataSeries } = SciChart;
    const pointMarker = new EllipsePointMarker(wasmContext, {
        width: 7,
        height: 7,
        fill: "white",
        strokeThickness: 0
    });

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#FF6600",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues
            }),
            pointMarker
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: yValues2
            }),
            pointMarker
        })
    );
}

// Uncomment this to use the builder example //builderExample("scichart-root");
```

Many of the properties here are optional - they have been included to show the configuration possibilities for the cursor. See [IVerticalSliceOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iverticalsliceoptions.html) for more.

Removing a VerticalSliceModifier from the Chart
-----------------------------------------------

Styling & Visibility of VerticalSliceModifier Elements
------------------------------------------------------

The following elements can be turned on or off when using the [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html).

VerticalSliceModifier visibility

Copy Code

```ts
verticalSliceModifier.showTooltip = true; // Show or hide the tooltip
verticalSliceModifier.showRolloverLine = true; // Show or hide the vertical line
verticalSliceModifier.verticalLine.showLabel = true; // Show or hide the X-Axis label
```

In addition, the line may be made editable (draggable) by setting the [isDraggable:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#isdraggable) property

VerticalSliceModifier editing

Copy Code

```ts
verticalSliceModifier.isDraggable = true; // Enable or disable dragging of the line
```

The line colour, dash pattern, strokethickness and selection color of the [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) can also be set. e.g.

**Property**

**Description**

[VerticalSliceModifier.rolloverLineStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#rolloverlinestroke)

Sets the colour of the rollover line as an HTML colour code

[VerticalSliceModifier.rolloverLineStrokeDashArray:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#rolloverlinestrokedasharray)

Sets the dash pattern (see [Dash Line Styling](Series Styling - Dash Line Patterns.html) for guidelines)

[VerticalSliceModifier.rolloverLineStrokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#rolloverlinestrokethickness)

Sets the rollover line thickness

VerticalSliceModifier styling

Copy Code

```ts
verticalSliceModifier.rolloverLineStrokeThickness = 1; // Sets the line thickness
verticalSliceModifier.rolloverLineStroke = "Orange"; // Sets the line colour
verticalSliceModifier.lineSelectionColor = "Red"; // Change the highlight color when selected
```

Properties of the tooltip can be controlled on a per-series basis as per the [RolloverModifier](RolloverModifier.html) via the [RenderableSeries.rolloverModifierProps:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html) property

**Property**

**Description**

[series.rolloverModifierProps.tooltipTextColor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiptextcolor)

The text foreground color of the tooltip, on a per-series basis

[series.rolloverModifierProps.tooltipColor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltipcolor)

The tooltip container color on a per-series basis

[series.rolloverModifierProps.tooltipLabelX:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiplabelx)

Prefix label in the tooltip for X values. Defaults to 'X: '

[series.rolloverModifierProps.tooltipLabelY:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiplabely)

Prefix label in the tooltip for Y values. Defaults to 'Y: '

VerticalSliceModifier Tooltip styling

Copy Code

```ts
// On a per series basis, you can control the tooltip background/foreground
series.rolloverModifierProps.tooltipTextColor = "White";
series.rolloverModifierProps.tooltipColor = "Red";
series.rolloverModifierProps.tooltipLabelX = "X Value:";
series.rolloverModifierProps.tooltipLabelY = "Y Value:";
```

Finally, the vertical line itself is simply a [LineAnnotation](LineAnnotation.html) so all the properties there may be accessed via the [verticalSliceModifier.verticalLine:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#verticalline) property after instantiation.

VerticalSliceModifier.verticalLine Styling

Copy Code

```ts
// Add some vertical slices to the chart
const vSlice1 = new VerticalSliceModifier({
   // options ...
});
vSlice1.verticalLine.showLabel = true; // Show axis label
vSlice1.verticalLine.axisLabelFill = "#FF6600"; // Style axis label outline and font
vSlice1.verticalLine.axisLabelStroke = "White";
```

See Also

[Formatting VerticalSlice Tooltip Items](VerticalSliceModifier_Formatting.html)