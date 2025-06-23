---
sidebar_position: 4
---

# Customizing the CursorModifier Tooltip Container Appearance

Background reading:

If you haven't already, read the article [The CursorModifier Type](CursorModifier.html) which will show you how to setup a CursorModifier with default options for tooltips. This article goes into further detail on customising the tooltip items (formatting, text content)

Basic customisation of the cursor and tooltip appearance can be made through the following properties.

*   The crosshair line thickness and stroke color can be changed with the [crosshairStrokeThickness:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#crosshairstrokethickness) and [crosshairStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#crosshairstroke) properties.
*   Axis labels can be turned on/off via the [showAxisLabels:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#showaxislabels) property.
*   The tooltip can be turned on/off (to have a simple cursor) with the [showTooltip:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#showtooltip) property.
*   Axis Label backgrounds and text color can be changed with the [axisLabelStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#axislabelstroke), [axisLabelFill:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#axislabelfill) properties.
*   The tooltip background and text color can be changed with the [tooltipContainerBackground:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#tooltipcontainerbackground) and [tooltipTextStroke:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#tooltiptextstroke) properties.

Deeper customisation of the tooltip appearance can be achieved via the [tooltipSvgTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#tooltipsvgtemplate) property.

This defines the actual SVG used to host the tooltip container. This property expects a function in the following format (see [TCursorTooltipSvgTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#tcursortooltipsvgtemplate)):

cursotTooltipSvgTemplate function

Copy Code

```ts
(seriesInfos: SeriesInfo\[\], svgAnnotation: CursorTooltipSvgAnnotation) => string
```

The input/output parameters are:

*   **Input**: an array of [SeriesInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesinfo.html): a data object which stores info about the series under the mouse.
*   **Input**: svgAnnotation ([CursorTooltipSvgAnnotation:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#tcursortooltipsvgtemplate)) which is the current tooltip SVG annotation
*   **Output**: string, containing the new SVG to define the tooltip container.

Let's create a simple example which shows you how to customize the tooltip container.

*   [Javascript](#i-tab-content-JS)

```ts
const tooltipSvgTemplate = (seriesInfos, svgAnnotation) => {
    const width = 120;
    const height = 120;
    const seriesInfo = seriesInfos\[0\];
    if (!seriesInfo?.isWithinDataBounds) {
        return "<svg></svg>";
    }
    const x = seriesInfo ? seriesInfo.formattedXValue : "";
    const y = seriesInfo ? seriesInfo.formattedYValue : "";

    // this calculates and sets svgAnnotation.xCoordShift and svgAnnotation.yCoordShift.  Do not set x1 or y1 at this point.
    adjustTooltipPosition(width, height, svgAnnotation);

    return \`<svg width="${width}" height="${height}"\>
         <circle cx="50%" cy="50%" r="50%" fill="green"/>
         <svg width="100%"\>
             <text y="40" font-size="13" font-family="Verdana" dy="0" fill="white"\>
                 <tspan x="50%" text-anchor="middle" dy="1.2em"\>Some Title</tspan>
                 <tspan x="50%" text-anchor="middle" dy="1.2em"\>x: ${x} y: ${y}</tspan>
             </text>
         </svg>
     </svg>\`;
};

// Add a CursorModifier to the chart
const cursorModifier = new CursorModifier({
    showTooltip: true,
    showAxisLabels: true,
    tooltipSvgTemplate
});
sciChartSurface.chartModifiers.add(cursorModifier);
```

This results in the following output:

```ts
<div id="scichart-root" ></div>
```
```ts
body { margin: 0; }
#scichart-root { width: 100%; height: 100vh; }
```
```ts
import \* as SciChart from "scichart";

async function tooltipSvgCursorModifier(divElementId) {
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
        EllipsePointMarker,
        adjustTooltipPosition
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        titleStyle: { fontSize: 16 }
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region ExampleA
    const tooltipSvgTemplate = (seriesInfos, svgAnnotation) => {
        const width = 120;
        const height = 120;
        const seriesInfo = seriesInfos\[0\];
        if (!seriesInfo?.isWithinDataBounds) {
            return "<svg></svg>";
        }
        const x = seriesInfo ? seriesInfo.formattedXValue : "";
        const y = seriesInfo ? seriesInfo.formattedYValue : "";

        // this calculates and sets svgAnnotation.xCoordShift and svgAnnotation.yCoordShift.  Do not set x1 or y1 at this point.
        adjustTooltipPosition(width, height, svgAnnotation);

        return \`<svg width="${width}" height="${height}">
             <circle cx="50%" cy="50%" r="50%" fill="green"/>
             <svg width="100%">
                 <text y="40" font-size="13" font-family="Verdana" dy="0" fill="white">
                     <tspan x="50%" text-anchor="middle" dy="1.2em">Some Title</tspan>
                     <tspan x="50%" text-anchor="middle" dy="1.2em">x: ${x} y: ${y}</tspan>
                 </text>
             </svg>
         </svg>\`;
    };

    // Add a CursorModifier to the chart
    const cursorModifier = new CursorModifier({
        showTooltip: true,
        showAxisLabels: true,
        tooltipSvgTemplate
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
            text: "CursorModifier Tooltip SVG",
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

tooltipSvgCursorModifier("scichart-root");
```
