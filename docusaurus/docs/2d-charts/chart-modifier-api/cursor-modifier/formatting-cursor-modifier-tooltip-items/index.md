---
sidebar_position: 2
---

# Formatting CursorModifier Tooltip Items

Background reading:

If you haven't already, read the article [The CursorModifier Type](CursorModifier.html) which will show you how to setup a **CursorModifier** with default options for tooltips. This article goes into further detail on customising the tooltip items (formatting, text content)

Basic CursorModifier Tooltip Formatting Options
-----------------------------------------------

Tooltip and Axis Label formatting comes from the [axis.labelprovider.formatCursorLabel():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/labelprovider.html#formatcursorlabel) function and is axis-specific. You can read more about the [Axis.LabelProvider API here](Axis Label Formatting - LabelProvider API.html), including how to specify formats from Enums and override formatting programmatically.

Below we're going to show you how to apply cursor formatting to enable four-decimal places on tooltips.

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Create a chart surface
const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    titleStyle: { fontSize: 16 }
});

sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
        // label format options applied to the X-Axis
        labelPrecision: 2,
        labelFormat: ENumericFormat.Decimal,
        // label format options applied to cursors & tooltips
        cursorLabelPrecision: 4,
        cursorLabelFormat: ENumericFormat.Decimal
    })
);
sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
        // label format options applied to the X-Axis
        labelPrecision: 1,
        labelFormat: ENumericFormat.Decimal,
        // label format options applied to cursors & tooltips
        cursorLabelPrecision: 4,
        cursorLabelFormat: ENumericFormat.Decimal
    })
);

// Add a CursorModifier to the chart
const cursorModifier = new CursorModifier({
    showTooltip: true,
    showAxisLabels: true,
    hitTestRadius: 10
});
sciChartSurface.chartModifiers.add(cursorModifier);
```

```ts
const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
        type: EAxisType.NumericAxis,
        options: {
            // label format options applied to the X-Axis
            labelPrecision: 2,
            labelFormat: ENumericFormat.Decimal,
            // label format options applied to cursors & tooltips
            cursorLabelPrecision: 4,
            cursorLabelFormat: ENumericFormat.Decimal
        }
    },
    yAxes: {
        type: EAxisType.NumericAxis,
        options: {
            // label format options applied to the X-Axis
            labelPrecision: 2,
            labelFormat: ENumericFormat.Decimal,
            // label format options applied to cursors & tooltips
            cursorLabelPrecision: 4,
            cursorLabelFormat: ENumericFormat.Decimal
        }
    },
    modifiers: \[
        {
            type: EChart2DModifierType.Cursor,
            options: {
                showTooltip: true,
                showAxisLabels: true,
                hitTestRadius: 10
            }
        }
    \]
});
```

Here's a **Codepen** which shows the effect of these properties on the axis on cursor tooltips.

```ts
<div id="scichart-root" ></div>
```
```ts
body { margin: 0; }
#scichart-root { width: 100%; height: 100vh; }
```
```ts
import \* as SciChart from "scichart";

async function formatCursorModifier(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        ENumericFormat,
        CursorModifier,
        TextAnnotation,
        EHorizontalAnchorPoint,
        ECoordinateMode,
        EllipsePointMarker
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // #region ExampleA
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        titleStyle: { fontSize: 16 }
    });

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            // label format options applied to the X-Axis
            labelPrecision: 2,
            labelFormat: ENumericFormat.Decimal,
            // label format options applied to cursors & tooltips
            cursorLabelPrecision: 4,
            cursorLabelFormat: ENumericFormat.Decimal
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            // label format options applied to the X-Axis
            labelPrecision: 1,
            labelFormat: ENumericFormat.Decimal,
            // label format options applied to cursors & tooltips
            cursorLabelPrecision: 4,
            cursorLabelFormat: ENumericFormat.Decimal
        })
    );

    // Add a CursorModifier to the chart
    const cursorModifier = new CursorModifier({
        showTooltip: true,
        showAxisLabels: true,
        hitTestRadius: 10
    });
    sciChartSurface.chartModifiers.add(cursorModifier);
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

    const pointMarker = new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "white", strokeThickness: 0 });

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
            text: "CursorModifier Formatting",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Move the mouse over the chart to see cursor & tooltip",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );
}

formatCursorModifier("scichart-root");

async function builderExample(divElementId) {
    // Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType, EChart2DModifierType, ENumericFormat } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region ExampleB
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                // label format options applied to the X-Axis
                labelPrecision: 2,
                labelFormat: ENumericFormat.Decimal,
                // label format options applied to cursors & tooltips
                cursorLabelPrecision: 4,
                cursorLabelFormat: ENumericFormat.Decimal
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                // label format options applied to the X-Axis
                labelPrecision: 2,
                labelFormat: ENumericFormat.Decimal,
                // label format options applied to cursors & tooltips
                cursorLabelPrecision: 4,
                cursorLabelFormat: ENumericFormat.Decimal
            }
        },
        modifiers: \[
            {
                type: EChart2DModifierType.Cursor,
                options: {
                    showTooltip: true,
                    showAxisLabels: true,
                    hitTestRadius: 10
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
    const pointMarker = new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "white", strokeThickness: 0 });

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

For further customisation on a per-axis basis, consider using the [LabelProvider feature](CustomLabelProvider_Numeric.html) to create a custom labelprovider, and override formatCursorLabel.

Tooltip DataTemplates
---------------------

Further customisation of tooltip content can be achieved with the [CursorModifier.tooltipDataTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#tooltipdatatemplate) property. This defines the content inside the tooltip e.g. what values are shown (x, y, values from metadata), if the series name is shown and so on.

This property expects a function in the following format (see [TCursorTooltipDataTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#tcursortooltipdatatemplate)):

tooltipDataTemplateFunction

Copy Code

```ts
export type TCursorTooltipDataTemplate = (seriesInfos: SeriesInfo\[\], tooltipTitle: string) => string\[\];
```

The input/output parameters are:

*   **Input**: an array of [SeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesinfo.html): a data object which stores info about the series under the mouse.
*   **Input**: a tooltipTitle (string) which comes from [renderableSeries.rolloverModifierProps.tooltipTitle:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifierrenderableseriesprops.html#tooltiptitle).
*   **Output**: an array of strings, each one corresponding to a line in the tooltip.

Let's create a simple example which shows you how to access properties on [XySeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html) and output to tooltips.

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
// Create a chart surface
const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    titleStyle: { fontSize: 16 }
});

sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

// Add a CursorModifier to the chart
const cursorModifier = new CursorModifier({
    showTooltip: true,
    showAxisLabels: true,
    hitTestRadius: 10,
    // Add a custom tooltip data template
    tooltipDataTemplate: (seriesInfos, tooltipTitle) => {
        // each element in this array = 1 line in the tooltip
        const lineItems = \[\];
        // See SeriesInfo docs at https://scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html
        seriesInfos.forEach(si => {
            // If hit (within hitTestRadius of point)
            if (si.isHit) {
                // SeriesInfo.seriesName comes from dataSeries.dataSeriesName
                lineItems.push(\`${si.seriesName}\`);
                // seriesInfo.xValue, yValue are available to be formatted
                // Or, preformatted values are available as si.formattedXValue, si.formattedYValue
                lineItems.push(\`X: ${si.xValue.toFixed(2)}\`);
                lineItems.push(\`Y: ${si.yValue.toFixed(2)}\`);
                // index to the dataseries is available
                lineItems.push(\`Index: ${si.dataSeriesIndex}\`);
                // Which can be used to get anything from the dataseries
                lineItems.push(
                    \`Y-value from dataSeries: ${si.renderableSeries.dataSeries
                        .getNativeYValues()
                        .get(si.dataSeriesIndex)
                        .toFixed(4)}\`
                );
                // Location of the hit in pixels is available
                lineItems.push(\`Location: ${si.xCoordinate.toFixed(0)}, ${si.yCoordinate.toFixed(0)}\`);
            }
        });

        return lineItems;
    }
});
sciChartSurface.chartModifiers.add(cursorModifier);
```

```ts
// Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
const { chartBuilder, EThemeProviderType, EAxisType, EChart2DModifierType } = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    modifiers: \[
        {
            type: EChart2DModifierType.Cursor,
            options: {
                // Optional properties to configure what parts are shown
                showTooltip: true,
                showAxisLabels: true,
                showXLine: true,
                showYLine: true,
                // How close to a datapoint to show the tooltip? 10 = 10 pixels. 0 means always
                hitTestRadius: 10,
                // Optional properties to configure the axis labels
                axisLabelFill: "#b36200",
                axisLabelStroke: "#fff",
                // Optional properties to configure line and tooltip style
                crosshairStroke: "#ff6600",
                crosshairStrokeThickness: 1,
                tooltipContainerBackground: "#000",
                tooltipTextStroke: "#ff6600"
            }
        }
    \]
});
```

This results in the following output

```ts
<div id="scichart-root" ></div>
```
```ts
body { margin: 0; }
#scichart-root { width: 100%; height: 100vh; }
```
```ts
import \* as SciChart from "scichart";

async function cursorDataTemplates(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        TextAnnotation,
        EHorizontalAnchorPoint,
        ECoordinateMode,
        EllipsePointMarker
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // #region ExampleA
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        titleStyle: { fontSize: 16 }
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a CursorModifier to the chart
    const cursorModifier = new CursorModifier({
        showTooltip: true,
        showAxisLabels: true,
        hitTestRadius: 10,
        // Add a custom tooltip data template
        tooltipDataTemplate: (seriesInfos, tooltipTitle) => {
            // each element in this array = 1 line in the tooltip
            const lineItems = \[\];
            // See SeriesInfo docs at https://scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html
            seriesInfos.forEach(si => {
                // If hit (within hitTestRadius of point)
                if (si.isHit) {
                    // SeriesInfo.seriesName comes from dataSeries.dataSeriesName
                    lineItems.push(\`${si.seriesName}\`);
                    // seriesInfo.xValue, yValue are available to be formatted
                    // Or, preformatted values are available as si.formattedXValue, si.formattedYValue
                    lineItems.push(\`X: ${si.xValue.toFixed(2)}\`);
                    lineItems.push(\`Y: ${si.yValue.toFixed(2)}\`);
                    // index to the dataseries is available
                    lineItems.push(\`Index: ${si.dataSeriesIndex}\`);
                    // Which can be used to get anything from the dataseries
                    lineItems.push(
                        \`Y-value from dataSeries: ${si.renderableSeries.dataSeries
                            .getNativeYValues()
                            .get(si.dataSeriesIndex)
                            .toFixed(4)}\`
                    );
                    // Location of the hit in pixels is available
                    lineItems.push(\`Location: ${si.xCoordinate.toFixed(0)}, ${si.yCoordinate.toFixed(0)}\`);
                }
            });

            return lineItems;
        }
    });
    sciChartSurface.chartModifiers.add(cursorModifier);

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

    const pointMarker = new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "white", strokeThickness: 0 });

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
            text: "CursorModifier Custom DataTemplates",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Move the mouse over the chart to see cursor & tooltip",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );

    sciChartSurface.chartModifiers.add(new SciChart.LegendModifier());
}

cursorDataTemplates("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType, EChart2DModifierType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        modifiers: \[
            {
                type: EChart2DModifierType.Cursor,
                options: {
                    // Optional properties to configure what parts are shown
                    showTooltip: true,
                    showAxisLabels: true,
                    showXLine: true,
                    showYLine: true,
                    // How close to a datapoint to show the tooltip? 10 = 10 pixels. 0 means always
                    hitTestRadius: 10,
                    // Optional properties to configure the axis labels
                    axisLabelFill: "#b36200",
                    axisLabelStroke: "#fff",
                    // Optional properties to configure line and tooltip style
                    crosshairStroke: "#ff6600",
                    crosshairStrokeThickness: 1,
                    tooltipContainerBackground: "#000",
                    tooltipTextStroke: "#ff6600"
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
    const pointMarker = new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "white", strokeThickness: 0 });

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

Accessing Metadata in Tooltip DataTemplates
-------------------------------------------

In the above example we access properties of [XySeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html) to format lines in the CursorModifier tooltip.

You can also access metadata to store any custom object in your X,Y data, then read that data out in tooltips.

For a worked example see [PointMetadata API - Metadata and Tooltips](DataSeries_PointMetadata_Tooltips.html).

See Also

[Customizing the CursorModifier Tooltip Container Appearance](CursorModifier_CustomisingContainer.html)

[Active Legends - CursorModifier output into a legend](CursorModifier_PlaceTooltipLegendExternally.html)