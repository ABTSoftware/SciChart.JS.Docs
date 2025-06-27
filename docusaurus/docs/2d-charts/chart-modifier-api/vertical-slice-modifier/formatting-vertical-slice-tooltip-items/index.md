---
sidebar_position: 2
---

# Formatting VerticalSlice Tooltip Items 

**Background reading:** If you haven't already, read the article [The VerticalSliceModifier Type](/docs/2d-charts/chart-modifier-api/vertical-slice-modifier/vertical-slice-modifier-overview) which will show you how to setup a [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) with default options for tooltips.

This article goes into further detail on customising the tooltip items (formatting, text content)

Basic VerticalSliceModifier Tooltip Formatting Options
------------------------------------------------------

The [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) obeys similar rules to the [CursorModifier](/docs/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview) and [RolloverModifier](/docs/2d-charts/chart-modifier-api/rollover-modifier) for customizing the tooltip content and appearance.

_Tooltip and Axis Label formatting comes from the [axis.labelprovider.formatCursorLabel():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/labelprovider.html#formatcursorlabel) function and is axis-specific. You can read more about the [Axis.LabelProvider API here](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview), including how to specify formats from Enums and override formatting programmatically.

Below we're going to show you how to apply tooltip formatting to enable four-decimal places on [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) tooltips.

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Create a chart surface
const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    titleStyle: { fontSize: 16 }
});

// For the example to work, axis must have EAutoRange.Always
sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
        axisTitle: "X Axis",
        // label format options applied to the X-Axis
        labelPrecision: 1,
        labelFormat: ENumericFormat.Decimal,
        // label format options applied to cursors & tooltips
        cursorLabelPrecision: 2,
        cursorLabelFormat: ENumericFormat.Decimal
    })
);
sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-2, 0.5),
        axisTitle: "Y Axis",
        // label format options applied to the X-Axis
        labelPrecision: 1,
        labelFormat: ENumericFormat.Decimal,
        // label format options applied to cursors & tooltips
        cursorLabelPrecision: 6,
        cursorLabelFormat: ENumericFormat.Decimal
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
vSlice1.verticalLine.showLabel = true;
vSlice1.verticalLine.axisLabelFill = "#FF6600";
vSlice1.verticalLine.axisLabelStroke = "White";
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
vSlice2.verticalLine.showLabel = true;
vSlice2.verticalLine.axisLabelFill = "#50C7E0";
vSlice2.verticalLine.axisLabelStroke = "White";
sciChartSurface.chartModifiers.add(vSlice1, vSlice2);
```

```ts
// Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
const {
    chartBuilder,
    EThemeProviderType,
    ECoordinateMode,
    EChart2DModifierType,
    ENumericFormat,
    EAxisType,
    NumberRange
} = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
        type: EAxisType.NumericAxis,
        options: {
            axisTitle: "X Axis",
            // label format options applied to the X-Axis
            labelPrecision: 1,
            labelFormat: ENumericFormat.Decimal,
            // label format options applied to cursors & tooltips
            cursorLabelPrecision: 2,
            cursorLabelFormat: ENumericFormat.Decimal
        }
    },
    yAxes: {
        type: EAxisType.NumericAxis,
        options: {
            visibleRange: new NumberRange(-2, 0.5),
            axisTitle: "Y Axis",
            // label format options applied to the X-Axis
            labelPrecision: 1,
            labelFormat: ENumericFormat.Decimal,
            // label format options applied to cursors & tooltips
            cursorLabelPrecision: 6,
            cursorLabelFormat: ENumericFormat.Decimal
        }
    },
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

Here's a **Codepen** which shows the effect of these properties on the axis on cursor tooltips.

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

async function formattingVerticalSliceModifier(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        ENumericFormat,
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
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis",
            // label format options applied to the X-Axis
            labelPrecision: 1,
            labelFormat: ENumericFormat.Decimal,
            // label format options applied to cursors & tooltips
            cursorLabelPrecision: 2,
            cursorLabelFormat: ENumericFormat.Decimal
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-2, 0.5),
            axisTitle: "Y Axis",
            // label format options applied to the X-Axis
            labelPrecision: 1,
            labelFormat: ENumericFormat.Decimal,
            // label format options applied to cursors & tooltips
            cursorLabelPrecision: 6,
            cursorLabelFormat: ENumericFormat.Decimal
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
    vSlice1.verticalLine.showLabel = true;
    vSlice1.verticalLine.axisLabelFill = "#FF6600";
    vSlice1.verticalLine.axisLabelStroke = "White";
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
    vSlice2.verticalLine.showLabel = true;
    vSlice2.verticalLine.axisLabelFill = "#50C7E0";
    vSlice2.verticalLine.axisLabelStroke = "White";
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
            text: "VerticalSliceModifier 6 Decimal Places",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Shows how axis.cursorTextFormatting affects VerticalSlice tooltips",
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

formattingVerticalSliceModifier("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
    const {
        chartBuilder,
        EThemeProviderType,
        ECoordinateMode,
        EChart2DModifierType,
        ENumericFormat,
        EAxisType,
        NumberRange
    } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "X Axis",
                // label format options applied to the X-Axis
                labelPrecision: 1,
                labelFormat: ENumericFormat.Decimal,
                // label format options applied to cursors & tooltips
                cursorLabelPrecision: 2,
                cursorLabelFormat: ENumericFormat.Decimal
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                visibleRange: new NumberRange(-2, 0.5),
                axisTitle: "Y Axis",
                // label format options applied to the X-Axis
                labelPrecision: 1,
                labelFormat: ENumericFormat.Decimal,
                // label format options applied to cursors & tooltips
                cursorLabelPrecision: 6,
                cursorLabelFormat: ENumericFormat.Decimal
            }
        },
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

For further customisation on a per-axis basis, consider using the [LabelProvider feature](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview) to create a custom labelprovider, and override formatCursorLabel.

Tooltip DataTemplates
---------------------

Further customisation of [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) tooltip content can be achieved with the [VerticalSliceModifier.tooltipDataTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#tooltipdatatemplate) property. This defines the content inside the tooltip e.g. what values are shown (x, y, values from metadata), if the series name is shown and so on.

This property expects a function in the following format (see [TRolloverTooltipDataTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#trollovertooltipdatatemplate)):

tooltipDataTemplateFunction

Copy Code

```ts
TRolloverTooltipDataTemplate: (seriesInfo: SeriesInfo, 
   tooltipTitle: string, 
   tooltipLabelX: string, 
   tooltipLabelY: string) => string\[\]
```

The input/output parameters are:

**In/Out**

**Parameter**

**Description**

_Input_

seriesInfo

an instance of [SeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesinfo.html): a data object which stores info about the series that intersects the Vertical Line

_Input_

tooltipTitle

a tooltipTitle (string) which comes from [renderableSeries.rolloverModifierProps.tooltipTitle:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiptitle).

_Input_

tooltipLabelX

A prefix (string) which comes from [renderableSeries.rolloverModifierProps.tooltipLabelX:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiplabelx)

_Input_

tooltipLabelY

A prefix (string) which comes from [renderableSeries.rolloverModifierProps.tooltipLabelY:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiplabely)

_Return_

string\[\]

An array of strings, each one corresponding to a line in the tooltip

Let's create a simple example which shows you how to access properties on [XySeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html) and output to tooltips.

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Add a custom tooltip data template
const tooltipDataTemplate = (seriesInfo, tooltipTitle, tooltipLabelX, tooltipLabelY) => {
    // each element in this array = 1 line in the tooltip
    const lineItems = \[\];
    // See SeriesInfo docs at https://scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html
    // SeriesInfo.seriesName comes from dataSeries.dataSeriesName
    lineItems.push(\`${seriesInfo.seriesName}\`);
    // seriesInfo.xValue, yValue are available to be formatted
    // Or, preformatted values are available as si.formattedXValue, si.formattedYValue
    lineItems.push(\`X: ${seriesInfo.xValue.toFixed(2)}\`);
    lineItems.push(\`Y: ${seriesInfo.yValue.toFixed(2)}\`);
    // index to the dataseries is available
    lineItems.push(\`Index: ${seriesInfo.dataSeriesIndex}\`);
    // Which can be used to get anything from the dataseries
    lineItems.push(
        \`Y-value from dataSeries: ${seriesInfo.renderableSeries.dataSeries
            .getNativeYValues()
            .get(seriesInfo.dataSeriesIndex)
            .toFixed(4)}\`
    );
    // Location of the hit in pixels is available
    lineItems.push(\`Location: ${seriesInfo.xCoordinate.toFixed(0)}, ${seriesInfo.yCoordinate.toFixed(0)}\`);
    return lineItems;
};

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
    showTooltip: true,
    // The tooltip data template
    tooltipDataTemplate
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
    showTooltip: true,
    // The tooltip data template
    tooltipDataTemplate
});
sciChartSurface.chartModifiers.add(vSlice1, vSlice2);
```

```ts
// Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
const {
    chartBuilder,
    EThemeProviderType,
    ECoordinateMode,
    EChart2DModifierType,
    ENumericFormat,
    EAxisType,
    NumberRange
} = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
// Add a custom tooltip data template
const tooltipDataTemplate = (seriesInfo, tooltipTitle, tooltipLabelX, tooltipLabelY) => {
    // each element in this array = 1 line in the tooltip
    const lineItems = \[\];
    // See SeriesInfo docs at https://scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html
    // SeriesInfo.seriesName comes from dataSeries.dataSeriesName
    lineItems.push(\`${seriesInfo.seriesName}\`);
    // seriesInfo.xValue, yValue are available to be formatted
    // Or, preformatted values are available as si.formattedXValue, si.formattedYValue
    lineItems.push(\`X: ${seriesInfo.xValue.toFixed(2)}\`);
    lineItems.push(\`Y: ${seriesInfo.yValue.toFixed(2)}\`);
    // index to the dataseries is available
    lineItems.push(\`Index: ${seriesInfo.dataSeriesIndex}\`);
    // Which can be used to get anything from the dataseries
    lineItems.push(
        \`Y-value from dataSeries: ${seriesInfo.renderableSeries.dataSeries
            .getNativeYValues()
            .get(seriesInfo.dataSeriesIndex)
            .toFixed(4)}\`
    );
    // Location of the hit in pixels is available
    lineItems.push(\`Location: ${seriesInfo.xCoordinate.toFixed(0)}, ${seriesInfo.yCoordinate.toFixed(0)}\`);
    return lineItems;
};

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
                showTooltip: true,
                // Add the tooltip data template
                tooltipDataTemplate
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
                showTooltip: true,
                // Add the tooltip data template
                tooltipDataTemplate
            }
        }
    \]
});
```

This results in the following output

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

async function formattingVerticalSliceModifier(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        ENumericFormat,
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

    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        titleStyle: { fontSize: 16 }
    });

    // For the example to work, axis must have EAutoRange.Always
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis"
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-2, 0.5),
            axisTitle: "Y Axis"
        })
    );

    // #region ExampleA
    // Add a custom tooltip data template
    const tooltipDataTemplate = (seriesInfo, tooltipTitle, tooltipLabelX, tooltipLabelY) => {
        // each element in this array = 1 line in the tooltip
        const lineItems = \[\];
        // See SeriesInfo docs at https://scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html
        // SeriesInfo.seriesName comes from dataSeries.dataSeriesName
        lineItems.push(\`${seriesInfo.seriesName}\`);
        // seriesInfo.xValue, yValue are available to be formatted
        // Or, preformatted values are available as si.formattedXValue, si.formattedYValue
        lineItems.push(\`X: ${seriesInfo.xValue.toFixed(2)}\`);
        lineItems.push(\`Y: ${seriesInfo.yValue.toFixed(2)}\`);
        // index to the dataseries is available
        lineItems.push(\`Index: ${seriesInfo.dataSeriesIndex}\`);
        // Which can be used to get anything from the dataseries
        lineItems.push(
            \`Y-value from dataSeries: ${seriesInfo.renderableSeries.dataSeries
                .getNativeYValues()
                .get(seriesInfo.dataSeriesIndex)
                .toFixed(4)}\`
        );
        // Location of the hit in pixels is available
        lineItems.push(\`Location: ${seriesInfo.xCoordinate.toFixed(0)}, ${seriesInfo.yCoordinate.toFixed(0)}\`);
        return lineItems;
    };

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
        showTooltip: true,
        // The tooltip data template
        tooltipDataTemplate
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
        showTooltip: true,
        // The tooltip data template
        tooltipDataTemplate
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
            text: "VerticalSliceModifier 6 Decimal Places",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Shows how axis.cursorTextFormatting affects VerticalSlice tooltips",
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

formattingVerticalSliceModifier("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
    const {
        chartBuilder,
        EThemeProviderType,
        ECoordinateMode,
        EChart2DModifierType,
        ENumericFormat,
        EAxisType,
        NumberRange
    } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // Add a custom tooltip data template
    const tooltipDataTemplate = (seriesInfo, tooltipTitle, tooltipLabelX, tooltipLabelY) => {
        // each element in this array = 1 line in the tooltip
        const lineItems = \[\];
        // See SeriesInfo docs at https://scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html
        // SeriesInfo.seriesName comes from dataSeries.dataSeriesName
        lineItems.push(\`${seriesInfo.seriesName}\`);
        // seriesInfo.xValue, yValue are available to be formatted
        // Or, preformatted values are available as si.formattedXValue, si.formattedYValue
        lineItems.push(\`X: ${seriesInfo.xValue.toFixed(2)}\`);
        lineItems.push(\`Y: ${seriesInfo.yValue.toFixed(2)}\`);
        // index to the dataseries is available
        lineItems.push(\`Index: ${seriesInfo.dataSeriesIndex}\`);
        // Which can be used to get anything from the dataseries
        lineItems.push(
            \`Y-value from dataSeries: ${seriesInfo.renderableSeries.dataSeries
                .getNativeYValues()
                .get(seriesInfo.dataSeriesIndex)
                .toFixed(4)}\`
        );
        // Location of the hit in pixels is available
        lineItems.push(\`Location: ${seriesInfo.xCoordinate.toFixed(0)}, ${seriesInfo.yCoordinate.toFixed(0)}\`);
        return lineItems;
    };

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
                    showTooltip: true,
                    // Add the tooltip data template
                    tooltipDataTemplate
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
                    showTooltip: true,
                    // Add the tooltip data template
                    tooltipDataTemplate
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