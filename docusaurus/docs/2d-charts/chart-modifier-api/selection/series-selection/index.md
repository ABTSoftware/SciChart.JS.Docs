---
sidebar_position: 1
---

# Series Selection

SciChart now features a native ChartModifier called the [SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html) which allows you to click-select series via the mouse, or programmatically. The [SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html) allows you to do the following things:

1.  When [SeriesSelectionModifier.enableSelection:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#enableselection) is true, be notified via the [selectionChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#selectionchanged) event when the user selects one or more series.
2.  When [SeriesSelectionModifier.enableHover:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#enablehover) is true, be notified via the [hoverChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#hoverchanged) event when a user hovers one or more series
3.  Get a list of currently selected series via the [SeriesSelectionModifier.selectedSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#selectedseries) array, or hovered series via the [SeriesSelectionModifier.hoveredSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#hoveredseries) array.

Find an example below:

*   [Javascript](#i-tab-content-JS)
*   [json-builder](#i-tab-content-jS)

```ts
const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    NumberRange,
    SeriesSelectionModifier,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
    EllipsePointMarker
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"
// Create a chart surface
const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
});

sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

// Create a chart with line series with a point-marker
// Subscribe to onSelected to change the visual of the series when isSelected = true
sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
        stroke: "SteelBlue",
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            strokeThickness: 2,
            stroke: "SteelBlue",
            fill: "LightSteelBlue"
        }),
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: \[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12\],
            yValues: \[4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8\]
        }),
        // using onSelectedChanged callback, change the style of the series on selection
        onSelectedChanged: sourceSeries => {
            sourceSeries.stroke = sourceSeries.isSelected ? "white" : "SteelBlue";
            sourceSeries.pointMarker.fill = sourceSeries.isSelected ? "white" : "SteelBlue";
            sourceSeries.pointMarker.stroke = sourceSeries.isSelected ? "white" : "LightSteelBlue";
        }
    })
);

// You can also set or access onSelectedChanged via the renderableSeries
sciChartSurface.renderableSeries.get(0).selected.subscribe(args => {
    console.log(\`Series ${args.sourceSeries.dataSeries.dataSeriesName} was ${args.isSelected ? "" : "de"}selected\`);
});

// Add the SeriesSelectionModifier to the chart
sciChartSurface.chartModifiers.add(
    new SeriesSelectionModifier({
        enableHover: false,
        enableSelection: true
    })
);
```

```ts
// Demonstrates how to configure the CursorModifier in SciChart.js using the Builder API
const { chartBuilder, EThemeProviderType, EPointMarkerType, EChart2DModifierType } = SciChart;

// or, for npm, import { chartBuilder, ... } from "scichart"
const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    modifiers: \[
        {
            type: EChart2DModifierType.SeriesSelection,
            options: {
                enableHover: false,
                enableSelection: true
            }
        }
    \],
    series: \[
        {
            type: ESeriesType.LineSeries,
            options: {
                stroke: "SteelBlue",
                strokeThickness: 3,
                pointMarker: {
                    type: EPointMarkerType.Ellipse,
                    options: {
                        width: 10,
                        height: 10,
                        strokeThickness: 2,
                        stroke: "SteelBlue",
                        fill: "LightSteelBlue"
                    }
                },
                // using onSelectedChanged callback, change the style of the series on selection
                onSelectedChanged: sourceSeries => {
                    sourceSeries.stroke = sourceSeries.isSelected ? "white" : "SteelBlue";
                    sourceSeries.pointMarker.fill = sourceSeries.isSelected ? "white" : "SteelBlue";
                    sourceSeries.pointMarker.stroke = sourceSeries.isSelected ? "white" : "LightSteelBlue";
                }
            },
            xyData: {
                dataSeriesName: "Line Series",
                xValues: \[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12\],
                yValues: \[4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8\]
            }
        }
    \]
});

// You can also set or access onSelectedChanged via the renderableSeries
sciChartSurface.renderableSeries.get(0).selected.subscribe(args => {
    console.log(\`Series ${args.sourceSeries.dataSeries.dataSeriesName} was ${args.isSelected ? "" : "de"}selected\`);
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

async function basicSeriesSelection(divElementId) {
    // #region ExampleA
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        NumberRange,
        SeriesSelectionModifier,
        TextAnnotation,
        EHorizontalAnchorPoint,
        ECoordinateMode,
        EllipsePointMarker
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Create a chart with line series with a point-marker
    // Subscribe to onSelected to change the visual of the series when isSelected = true
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                strokeThickness: 2,
                stroke: "SteelBlue",
                fill: "LightSteelBlue"
            }),
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: \[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12\],
                yValues: \[4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8\]
            }),
            // using onSelectedChanged callback, change the style of the series on selection
            onSelectedChanged: sourceSeries => {
                sourceSeries.stroke = sourceSeries.isSelected ? "white" : "SteelBlue";
                sourceSeries.pointMarker.fill = sourceSeries.isSelected ? "white" : "SteelBlue";
                sourceSeries.pointMarker.stroke = sourceSeries.isSelected ? "white" : "LightSteelBlue";
            }
        })
    );

    // You can also set or access onSelectedChanged via the renderableSeries
    sciChartSurface.renderableSeries.get(0).selected.subscribe(args => {
        console.log(\`Series ${args.sourceSeries.dataSeries.dataSeriesName} was ${args.isSelected ? "" : "de"}selected\`);
    });

    // Add the SeriesSelectionModifier to the chart
    sciChartSurface.chartModifiers.add(
        new SeriesSelectionModifier({
            enableHover: false,
            enableSelection: true
        })
    );
    // #endregion

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
            text: "SeriesSelectionModifier Example",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Click the series to select it and apply selection style",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );
}

basicSeriesSelection("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the CursorModifier in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EPointMarkerType, EChart2DModifierType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        modifiers: \[
            {
                type: EChart2DModifierType.SeriesSelection,
                options: {
                    enableHover: false,
                    enableSelection: true
                }
            }
        \],
        series: \[
            {
                type: ESeriesType.LineSeries,
                options: {
                    stroke: "SteelBlue",
                    strokeThickness: 3,
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 10,
                            height: 10,
                            strokeThickness: 2,
                            stroke: "SteelBlue",
                            fill: "LightSteelBlue"
                        }
                    },
                    // using onSelectedChanged callback, change the style of the series on selection
                    onSelectedChanged: sourceSeries => {
                        sourceSeries.stroke = sourceSeries.isSelected ? "white" : "SteelBlue";
                        sourceSeries.pointMarker.fill = sourceSeries.isSelected ? "white" : "SteelBlue";
                        sourceSeries.pointMarker.stroke = sourceSeries.isSelected ? "white" : "LightSteelBlue";
                    }
                },
                xyData: {
                    dataSeriesName: "Line Series",
                    xValues: \[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12\],
                    yValues: \[4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8\]
                }
            }
        \]
    });

    // You can also set or access onSelectedChanged via the renderableSeries
    sciChartSurface.renderableSeries.get(0).selected.subscribe(args => {
        console.log(\`Series ${args.sourceSeries.dataSeries.dataSeriesName} was ${args.isSelected ? "" : "de"}selected\`);
    });
    // #endregion
}

// Uncomment this to use the builder example //builderExample("scichart-root");
```

Many of the properties here are optional - they have been included to show the configuration possibilities for the [SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html). See [ISeriesSelectionModifierOptions:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iseriesselectionmodifieroptions.html) for more.

Getting Notified on Series Hovered / Selected
---------------------------------------------

The [SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html) has two events [SeriesSelectionModifier.selectionChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#selectionchanged) and [SeriesSelectionModifier.hoverChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#hoverchanged). These provide callbacks to user code when a series is selected or deselected. They can be subscribed to as follows.

The [constructor options for the SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iseriesselectionmodifieroptions.html) also have [onSelectionChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iseriesselectionmodifieroptions.html#onselectionchanged) and [onHoverChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iseriesselectionmodifieroptions.html#onhoverchanged) functions. You can pass in selected and hovered functions in the constructor also:

Subscribe to SeriesSelectionModifier events

Copy Code

```ts
import { SeriesSelectionModifier } from "scichart";
const seriesSelectionModifier = new SeriesSelectionModifier({
  enableHover: true,
  enableSelection: true,
  // selection, hover callbacks can be passed to the constructor
  onSelectionChanged: args => {
    console.log("seriesSelectionModifier constructor onSelectionChanged");
  },
  onHoverChanged: args => {
    console.log("seriesSelectionModifier constructor onHoverChanged");
  }
});

// Or, subscribed to later.
seriesSelectionModifier.hoverChanged.subscribe(args => {
  console.log("seriesSelectionModifier.hoverChanged event");
});
seriesSelectionModifier.selectionChanged.subscribe(args => {
  console.log("seriesSelectionModifier.selectionChanged event");
});
```

Finally, series themselves have [selected:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#selected) and [hovered:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#hovered) events and functions in the constructor and on the series themselves.

Series selected hovered events

Copy Code

```ts
const series = new FastLineRenderableSeries(wasmContext, {
  /\* ... other options here ... \*/

  onSelectedChanged: (sourceSeries, isSelected) => {
    console.log("FastLineRenderableSeries constructor onSelectedChanged");
  },
  onHoveredChanged: (sourceSeries, isHovered) => {
    console.log("FastLineRenderableSeries constructor onSelectedChanged");
  }
});

series.hovered.subscribe(args => {
  console.log("FastLineRenderableSeries.hovered event");
});
series.selected.subscribe(args => {
  console.log("FastLineRenderableSeries.selected event");
});
```

Here's a full code sample showing the four possible ways you can get notified when selection changes in SciChart.js:

*   [hovering series](#i-tab-content-f95a43de-a5e8-470e-8ece-1550c4f8fe4c)

```ts
const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    NumberRange,
    SeriesSelectionModifier,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
    EllipsePointMarker
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"
// Create a chart surface
const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
});

sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

// Method 1: Pass onSelectionChanged and onHoverChanged to SeriesSelectionModifier constructor options
const seriesSelectionModifier = new SeriesSelectionModifier({
    enableHover: true,
    enableSelection: true,
    onSelectionChanged: args => {
        console.log("1 seriesSelectionModifier constructor onSelectionChanged");
    },
    onHoverChanged: args => {
        console.log("1 seriesSelectionModifier constructor onHoverChanged");
    }
});

// Method 2: Use the hoverChanged and selectionChanged events
seriesSelectionModifier.hoverChanged.subscribe(args => {
    console.log("2 seriesSelectionModifier.hoverChanged event");
});

seriesSelectionModifier.selectionChanged.subscribe(args => {
    console.log("2 seriesSelectionModifier.selectionChanged event");
});

// Method 3: Use the onSelectedChanged functions on the series itself
const series = new FastLineRenderableSeries(wasmContext, {
    stroke: "SteelBlue",
    strokeThickness: 3,
    pointMarker: new EllipsePointMarker(wasmContext, {
        width: 10,
        height: 10,
        strokeThickness: 2,
        stroke: "SteelBlue",
        fill: "LightSteelBlue"
    }),
    dataSeries: new XyDataSeries(wasmContext, {
        xValues: \[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12\],
        yValues: \[4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8\]
    }),
    onSelectedChanged: (sourceSeries, isSelected) => {
        console.log("3 FastLineRenderableSeries constructor onSelectedChanged");
    },
    onHoveredChanged: (sourceSeries, isHovered) => {
        console.log("3 FastLineRenderableSeries constructor onSelectedChanged");
    }
});

// Method 4: use the selected and hovered events on the series
series.hovered.subscribe(args => {
    console.log("4 FastLineRenderableSeries.hovered event");

    series.stroke = series.isSelected ? "White" : series.isHovered ? "Orange" : "SteelBlue";
});

series.selected.subscribe(args => {
    console.log("4 FastLineRenderableSeries.selected event");

    series.stroke = series.isSelected ? "White" : series.isHovered ? "Orange" : "SteelBlue";
});

// Add the modifier and series to chart
sciChartSurface.chartModifiers.add(seriesSelectionModifier);
sciChartSurface.renderableSeries.add(series);
```

this results in the following output:

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

async function basicSeriesSelection(divElementId) {
    // #region ExampleA
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        NumberRange,
        SeriesSelectionModifier,
        TextAnnotation,
        EHorizontalAnchorPoint,
        ECoordinateMode,
        EllipsePointMarker
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Method 1: Pass onSelectionChanged and onHoverChanged to SeriesSelectionModifier constructor options
    const seriesSelectionModifier = new SeriesSelectionModifier({
        enableHover: true,
        enableSelection: true,
        onSelectionChanged: args => {
            console.log("1 seriesSelectionModifier constructor onSelectionChanged");
        },
        onHoverChanged: args => {
            console.log("1 seriesSelectionModifier constructor onHoverChanged");
        }
    });

    // Method 2: Use the hoverChanged and selectionChanged events
    seriesSelectionModifier.hoverChanged.subscribe(args => {
        console.log("2 seriesSelectionModifier.hoverChanged event");
    });

    seriesSelectionModifier.selectionChanged.subscribe(args => {
        console.log("2 seriesSelectionModifier.selectionChanged event");
    });

    // Method 3: Use the onSelectedChanged functions on the series itself
    const series = new FastLineRenderableSeries(wasmContext, {
        stroke: "SteelBlue",
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            strokeThickness: 2,
            stroke: "SteelBlue",
            fill: "LightSteelBlue"
        }),
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: \[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12\],
            yValues: \[4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8\]
        }),
        onSelectedChanged: (sourceSeries, isSelected) => {
            console.log("3 FastLineRenderableSeries constructor onSelectedChanged");
        },
        onHoveredChanged: (sourceSeries, isHovered) => {
            console.log("3 FastLineRenderableSeries constructor onSelectedChanged");
        }
    });

    // Method 4: use the selected and hovered events on the series
    series.hovered.subscribe(args => {
        console.log("4 FastLineRenderableSeries.hovered event");

        series.stroke = series.isSelected ? "White" : series.isHovered ? "Orange" : "SteelBlue";
    });

    series.selected.subscribe(args => {
        console.log("4 FastLineRenderableSeries.selected event");

        series.stroke = series.isSelected ? "White" : series.isHovered ? "Orange" : "SteelBlue";
    });

    // Add the modifier and series to chart
    sciChartSurface.chartModifiers.add(seriesSelectionModifier);
    sciChartSurface.renderableSeries.add(series);
    // #endregion

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
            text: "SeriesSelectionModifier Example",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Hover or click the series. Check the output in the console.",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );
}

basicSeriesSelection("scichart-root");
```

Customizing Selection Visuals
-----------------------------

### Colour a series when selected

When a series is selected or hovered, you can use one of the callback methods (above) to change it's style. Any property may be changed, such as `BaseRenderableSeries.stroke`, `strokeThickness`, `pointMarker` type or colours. Below is a simple code sample showing how to get a tri-state style on series selected, hovered, or selected and hovered.

*   [series styling when selected](#i-tab-content-d24e7925-4fc8-4f47-a04b-96357896ad92)

```ts
import \* as SciChart from "scichart";

const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    NumberRange,
    SeriesSelectionModifier,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
    EllipsePointMarker
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"
async function seriesSelectionStyle(divElementId) {
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const defaultStroke = "SteelBlue";
    const defaultFill = "LightSteelBlue";

    const applyStyle = (series, isSelected, isHovered) => {
        series.stroke =
            isSelected && isHovered ? "#FFBB99" : isSelected ? "#FFF" : isHovered ? "#FF7733" : defaultStroke;
        series.pointMarker.stroke = series.stroke;
        series.pointMarker.fill =
            isSelected && isHovered ? "#FFBB99" : isSelected ? "#FFF" : isHovered ? "#FF7733" : defaultFill;
    };

    // Create a chart with line series with a point-marker
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: defaultStroke,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                strokeThickness: 2,
                stroke: defaultStroke,
                fill: defaultFill
            }),
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: \[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12\],
                yValues: \[4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8\]
            }),

            // Apply a style to the series on selected and hovered
            onSelectedChanged: sourceSeries => {
                applyStyle(sourceSeries, sourceSeries.isSelected, sourceSeries.isHovered);
            },

            onHoveredChanged: sourceSeries => {
                applyStyle(sourceSeries, sourceSeries.isSelected, sourceSeries.isHovered);
            }
        })
    );

    // Add the DatapointSelectionModifier to the chart
    sciChartSurface.chartModifiers.add(
        new SeriesSelectionModifier({
            enableSelection: true,
            enableHover: true
        })
    );

    // #endregion
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
            text: "SeriesSelectionModifier Example",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Hover or click the series. Check the output in the console.",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );
}

seriesSelectionStyle("scichart-root");
```

This results in the following behaviour when hovering or selecting the series.

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

const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    NumberRange,
    SeriesSelectionModifier,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
    EllipsePointMarker
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function seriesSelectionStyle(divElementId) {
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const defaultStroke = "SteelBlue";
    const defaultFill = "LightSteelBlue";

    const applyStyle = (series, isSelected, isHovered) => {
        series.stroke =
            isSelected && isHovered ? "#FFBB99" : isSelected ? "#FFF" : isHovered ? "#FF7733" : defaultStroke;
        series.pointMarker.stroke = series.stroke;
        series.pointMarker.fill =
            isSelected && isHovered ? "#FFBB99" : isSelected ? "#FFF" : isHovered ? "#FF7733" : defaultFill;
    };

    // Create a chart with line series with a point-marker
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: defaultStroke,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                strokeThickness: 2,
                stroke: defaultStroke,
                fill: defaultFill
            }),
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: \[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12\],
                yValues: \[4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8\]
            }),

            // Apply a style to the series on selected and hovered
            onSelectedChanged: sourceSeries => {
                applyStyle(sourceSeries, sourceSeries.isSelected, sourceSeries.isHovered);
            },

            onHoveredChanged: sourceSeries => {
                applyStyle(sourceSeries, sourceSeries.isSelected, sourceSeries.isHovered);
            }
        })
    );

    // Add the DatapointSelectionModifier to the chart
    sciChartSurface.chartModifiers.add(
        new SeriesSelectionModifier({
            enableSelection: true,
            enableHover: true
        })
    );

    // #endregion

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
            text: "SeriesSelectionModifier Example",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Hover or click the series. Check the output in the console.",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );
}

seriesSelectionStyle("scichart-root");
```

### Animating Selection State Changes

Using the Animations API built into SciChart, it is also possible to animate between style state changes on a RenderableSeries.

Update the code above to use the Animations API to call [BaseRenderableSeries.enqueueAnimation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#enqueueanimation) as follows:

*   [tri state animation on selection](#i-tab-content-6c0e05f4-9b3d-4844-bc1d-f210ff69264c)

```ts
// import { LineAnimation, easing, EPointMarkerType } from "scichart";
// Update function applyStyle to use Animations API
const applyStyle = (series, isSelected, isHovered) => {
    const stroke =
        isSelected && isHovered ? "#FFBB99" : isSelected ? "#FFF" : isHovered ? "#FF7733" : defaultStroke;
    const fill = isSelected && isHovered ? "#FFBB99" : isSelected ? "#FFF" : isHovered ? "#FF7733" : defaultFill;
    const strokeThickness = isHovered ? 4 : 2;

    series.enqueueAnimation(
        new LineAnimation({
            styles: {
                stroke,
                strokeThickness,
                pointMarker: {
                    stroke,
                    fill,
                    width: 10,
                    height: 10,
                    strokeThickness: 2,
                    type: EPointMarkerType.Ellipse
                }
            },
            duration: 250,
            ease: easing.outQuad
        })
    );
};
```

This now results in the following animated style-transition behaviour when hovering or selecting the series.

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

const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    NumberRange,
    SeriesSelectionModifier,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
    EllipsePointMarker,
    LineAnimation,
    easing,
    EPointMarkerType
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function seriesSelectionStyle(divElementId) {
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const defaultStroke = "SteelBlue";
    const defaultFill = "LightSteelBlue";

    // #region ExampleA
    // import { LineAnimation, easing, EPointMarkerType } from "scichart";

    // Update function applyStyle to use Animations API
    const applyStyle = (series, isSelected, isHovered) => {
        const stroke =
            isSelected && isHovered ? "#FFBB99" : isSelected ? "#FFF" : isHovered ? "#FF7733" : defaultStroke;
        const fill = isSelected && isHovered ? "#FFBB99" : isSelected ? "#FFF" : isHovered ? "#FF7733" : defaultFill;
        const strokeThickness = isHovered ? 4 : 2;

        series.enqueueAnimation(
            new LineAnimation({
                styles: {
                    stroke,
                    strokeThickness,
                    pointMarker: {
                        stroke,
                        fill,
                        width: 10,
                        height: 10,
                        strokeThickness: 2,
                        type: EPointMarkerType.Ellipse
                    }
                },
                duration: 250,
                ease: easing.outQuad
            })
        );
    };
    // #endregion

    // Create a chart with line series with a point-marker
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: defaultStroke,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                strokeThickness: 2,
                stroke: defaultStroke,
                fill: defaultFill
            }),
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: \[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12\],
                yValues: \[4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8\]
            }),

            // Apply a style to the series on selected and hovered
            onSelectedChanged: sourceSeries => {
                applyStyle(sourceSeries, sourceSeries.isSelected, sourceSeries.isHovered);
            },

            onHoveredChanged: sourceSeries => {
                applyStyle(sourceSeries, sourceSeries.isSelected, sourceSeries.isHovered);
            }
        })
    );

    // Add the DatapointSelectionModifier to the chart
    sciChartSurface.chartModifiers.add(
        new SeriesSelectionModifier({
            enableSelection: true,
            enableHover: true
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
            text: "SeriesSelectionModifier Example",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Hover or click the series. Check the output in the console.",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );
}

seriesSelectionStyle("scichart-root");
```

Multiple properties can be animated in SciChart.js, including stroke, fill, strokethickness, pointmarker size, type, opacity and more. For more information about how to animate between styles or datasets, see the [Animations API Documentation](/docs/2d-charts/animations-api/aminations-api-overview).

Programmatically Getting/Setting Selected Series
------------------------------------------------

Series may also be selected and deselected programmatically. Simply set the [BaseRenderableSeries.isSelected:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#isselected) property to trigger this action. SciChart will automatically redraw, and selection callbacks will be called, where you can update the style.

Excluding/Including Series from Selection
-----------------------------------------

By default, all series in the [SciChartSurface.renderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#renderableseries) collection will be included in the selection and hovered functionality when [SeriesSelectionModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html) is used.

At the moment, you can filter which series are included by overriding the [getAllSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesselectionmodifier.html#getallseries) function.

Find a short example below:

Exclude series from SeriesSelectionModifier

Copy Code

```ts
const seriesSelectionModifier = new SeriesSelectionModifier({ /\* options .. \*/});
seriesSelectionModifier.getAllSeries = () => {
    // access and return the series you want to include in the operation. 
    // This function should return an array 
    return \[seriesSelectionModifier.parentSurface.renderableSeries.get(1)\]; 
}
```

#### See Also

* [DataPoint Selection](/docs/2d-charts/chart-modifier-api/selection/data-point-selection)