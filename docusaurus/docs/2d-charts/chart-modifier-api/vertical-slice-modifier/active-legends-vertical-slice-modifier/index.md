---
sidebar_position: 3
---

# Active Legends - VerticalSliceModifier output to a Legend

**Background reading:** If you haven't already, read the article [The VerticalSliceModifier Type](/docs/2d-charts/chart-modifier-api/vertical-slice-modifier/vertical-slice-modifier-overview) which will show you how to setup a [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) with default options for tooltips.

This article goes into further detail on customising the tooltip items (formatting, text content)

VerticalSliceModifier tooltipLegendTemplates
--------------------------------------------

The [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) supports a [tooltipLegendTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#tooltiplegendtemplate) property which allows you to specify a function to transform [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) content into a legend which can be placed in the top left of the chart. This active legend updates with series values as you drag the vertical lines, or when a series updates.

The [tooltipLegendTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#tooltiplegendtemplate) property expects a function in the following format (see [TRolloverLegendSvgTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#trolloverlegendsvgtemplate)):

tooltipLegendTemplate

Copy Code

```ts
TRolloverLegendSvgTemplate: (seriesInfos: SeriesInfo\[\], svgAnnotation: RolloverLegendSvgAnnotation) => string
```

The input/output parameters are:

**In/Out**

**Parameter**

**Description**

_Input_

seriesInfos

an array of [SeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesinfo.html): a data object which stores info about the series that intersects the Vertical Line

_Input_

svgAnnotation

The [RolloverLegendSvgAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rolloverlegendsvgannotation.html) that will be used to render the legend. From here you can access properties of the underlying legend container, such as [tooltipLegendOffsetX:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rolloverlegendsvgannotation.html#tooltiplegendoffsetx) / Y or [tooltipLegendTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rolloverlegendsvgannotation.html#tooltiplegendtemplate)

_Return_

string\[\]

A string containing the result SVG to display inside the [RolloverLegendSvgAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rolloverlegendsvgannotation.html)

Let's create a simple example which shows you how to access properties on [XySeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html) and output to a custom legend.

Here's a worked example below, which shows how to place the hit-test result from a vertical line into an active legend elsewhere in your application.

*   [Javascript](#i-tab-content-JS)

```ts
// Create a tooltip legend template
const getTooltipLegendTemplate = (seriesInfos, svgAnnotation) => {
    let outputSvgString = "";
    // Foreach series there will be a seriesInfo supplied by SciChart. This contains info about the series under the house
    seriesInfos.forEach((seriesInfo, index) => {
        if (seriesInfo.isWithinDataBounds) {
            const lineHeight = 30;
            const y = 50 + index \* lineHeight;
            // Use the series stroke for legend text colour
            const textColor = seriesInfo.stroke;
            // Use the seriesInfo formattedX/YValue for text on the
            outputSvgString += \`<text x="8" y="${y}" font-size="16" font-family="Verdana" fill="${textColor}"\>
                                ${seriesInfo.seriesName}: X=${seriesInfo.formattedXValue}, Y=${seriesInfo.formattedYValue}
                            </text>\`;
        }
    });
    // Content here is returned for the custom legend placed in top-left of the chart
    return \`<svg width="100%" height="100%"\>
            <text x="8" y="20" font-size="15" font-family="Verdana" fill="lightblue"\>Custom VerticalSlice Legend</text>
            ${outputSvgString}
        </svg>\`;
};

// Apply it to a VerticalSliceModifier
const vSlice = new VerticalSliceModifier({
    x1: 30.0,
    xCoordinateMode: ECoordinateMode.DataValue,
    isDraggable: true,
    showRolloverLine: true,
    rolloverLineStrokeThickness: 1,
    rolloverLineStroke: "#50C7E0",
    lineSelectionColor: "#50C7E0",
    showTooltip: true,
    // Optional: Overrides the legend template to display additional info top-left of the chart
    tooltipLegendTemplate: getTooltipLegendTemplate
});
sciChartSurface.chartModifiers.add(vSlice);
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
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-2, 0.5),
            axisTitle: "Y Axis"
        })
    );

    // #region ExampleA
    // Create a tooltip legend template
    const getTooltipLegendTemplate = (seriesInfos, svgAnnotation) => {
        let outputSvgString = "";
        // Foreach series there will be a seriesInfo supplied by SciChart. This contains info about the series under the house
        seriesInfos.forEach((seriesInfo, index) => {
            if (seriesInfo.isWithinDataBounds) {
                const lineHeight = 30;
                const y = 50 + index \* lineHeight;
                // Use the series stroke for legend text colour
                const textColor = seriesInfo.stroke;
                // Use the seriesInfo formattedX/YValue for text on the
                outputSvgString += \`<text x="8" y="${y}" font-size="16" font-family="Verdana" fill="${textColor}">
                                    ${seriesInfo.seriesName}: X=${seriesInfo.formattedXValue}, Y=${seriesInfo.formattedYValue}
                                </text>\`;
            }
        });
        // Content here is returned for the custom legend placed in top-left of the chart
        return \`<svg width="100%" height="100%">
                <text x="8" y="20" font-size="15" font-family="Verdana" fill="lightblue">Custom VerticalSlice Legend</text>
                ${outputSvgString}
            </svg>\`;
    };

    // Apply it to a VerticalSliceModifier
    const vSlice = new VerticalSliceModifier({
        x1: 30.0,
        xCoordinateMode: ECoordinateMode.DataValue,
        isDraggable: true,
        showRolloverLine: true,
        rolloverLineStrokeThickness: 1,
        rolloverLineStroke: "#50C7E0",
        lineSelectionColor: "#50C7E0",
        showTooltip: true,
        // Optional: Overrides the legend template to display additional info top-left of the chart
        tooltipLegendTemplate: getTooltipLegendTemplate
    });
    sciChartSurface.chartModifiers.add(vSlice);
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
        y1: 0.75,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White"
    };
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "VerticalSliceModifier Example",
            fontSize: 36,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Creating Active Legends with tooltipLegendTemplate",
            fontSize: 20,
            yCoordShift: 50,
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

Using External placementDivId with the VerticalSliceModifier
------------------------------------------------------------

Another way you can control the placement of the [VerticalSliceModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html) tooltip is using the [placementDivId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#placementdivid) property. This places the standard VerticalSliceModifier tooltip into a div of your choice (which can be anywhere on the app).

Note, it does not currently work with [tooltipLegendTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/verticalslicemodifier.html#tooltiplegendtemplate), however we are working on more options for styling, placement and configuration of tooltips soon.

Try the following code in your application:

*   [Javascript](#i-tab-content-JS)

```ts
// Create a VerticalSliceModifier and add to the chart
const vSlice = new VerticalSliceModifier({
    x1: 30.0,
    xCoordinateMode: ECoordinateMode.DataValue,
    isDraggable: true,
    showRolloverLine: true,
    rolloverLineStrokeThickness: 1,
    rolloverLineStroke: "#50C7E0",
    lineSelectionColor: "#50C7E0",
    showTooltip: true,
    // Optional: Places the tooltip output in a div with id="legend-root"
    placementDivId: "legend-root"
});
sciChartSurface.chartModifiers.add(vSlice);
```

This results in the following output.

```ts
<body>
  <div id="container">
    <div id="scichart-root"></div>
    <div id="legend-root"></div>
  </div>
</body>
```
```ts
body {
  margin: 0;
}
#container {
  width: 100%;
  height: 100vh;
  position: relative;
}
#scichart-root {
  width: 100%;
  height: 100%;
  position: relative;
}
#legend-root {
  position: absolute;
  left: 20px;
  top: 20px;
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
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-2, 0.5),
            axisTitle: "Y Axis"
        })
    );

    // #region ExampleA
    // Create a VerticalSliceModifier and add to the chart
    const vSlice = new VerticalSliceModifier({
        x1: 30.0,
        xCoordinateMode: ECoordinateMode.DataValue,
        isDraggable: true,
        showRolloverLine: true,
        rolloverLineStrokeThickness: 1,
        rolloverLineStroke: "#50C7E0",
        lineSelectionColor: "#50C7E0",
        showTooltip: true,
        // Optional: Places the tooltip output in a div with id="legend-root"
        placementDivId: "legend-root"
    });
    sciChartSurface.chartModifiers.add(vSlice);
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
        y1: 0.75,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White"
    };
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "VerticalSliceModifier Example",
            fontSize: 36,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Creating Active Legends with tooltipLegendTemplate",
            fontSize: 20,
            yCoordShift: 50,
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