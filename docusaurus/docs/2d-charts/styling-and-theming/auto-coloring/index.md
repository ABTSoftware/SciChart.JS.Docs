---
sidebar_position: 9
---

# Chart Styling - Auto Coloring

One of the challenges when creating a chart with multiple series is picking colours for each series, especially when you are trying to keep to a color scheme.  We faced this problem during the recent rethemeing of our demos to match the new website theme.  The solution was to create a way to let SciChart automatically pick colours based off a palette.

<ChartFromSciChartDemo 
    src="https://demo.scichart.com/iframe/chart-websocket-bigdata-demo"
    title="Client/Server Websocket Data Streaming"
/>



Setting up Auto Coloring
------------------------

In order to use auto coloring you need to set up a strokePalette and/or fillPalette on a theme and apply it to a surface.  You can then set a stroke or fill color as AUTO\_COLOR and those items will pick colors based on the palette.  stroke properties use strokePalette and fill properties use fillPalette.  

The color is picked based on the number of series currently on the chart.  If the number of series is less than or equal to the number of entries in the palette, then scichart will pick values directly from the palette.  If there are more series than palette entries, scichart will generate a gradient using the palette and then pick colours evenly spaced on that gradient.

In the example below, the stroke and fill palettes are reversed.

```ts
// Auto coloring
import {
  SciChartSurface,
  NumericAxis,
  SciChartJSLightTheme,
  FastLineRenderableSeries,
  AUTO_COLOR,
  XyDataSeries,
  EllipsePointMarker,
  NumberRange
} from "scichart";

export async function autoColoring(divId) {
    const theme = new SciChartJSLightTheme();
    // configure the palette on the theme
    theme.strokePalette = ["red", "yellow", "green", "blue"];
    theme.fillPalette = ["blue", "green", "yellow", "red"];
    // Create a sciChartSurface using the theme
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId,{ theme });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1)}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1)}));
    // common x values - 0 to 20
    const xValues = Array.from(Array(20)).map((_, i) => i);
    // Create 10 line series with pointmarkers
    for (let i = 0; i < 10; i++) {
        const series = new FastLineRenderableSeries(wasmContext, {
            stroke: AUTO_COLOR,
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: xValues.map(x => Math.sin(x/2) + i)}),
            pointMarker: new EllipsePointMarker(wasmContext, {
                stroke: AUTO_COLOR,
                fill: AUTO_COLOR,
                width: 10,
                height: 10
            })
        });
        sciChartSurface.renderableSeries.add(series);     
    }
}
```

<CenteredImageWrapper
    src="/images/AutoColoring.png"
/>

Overriding Auto Coloring
------------------------

If you need to adjust the color that has been picked, you can override the [adjustAutoColor:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#adjustautocolor) method which exists on renerableSeries and pointMarker. DataLabels also support AUTO\_COLOR but for overrides there use getColor instead. See  [DataLabel Coloring](/docs/2d-charts/chart-types/data-point-labels/data-label-coloring/index.md).

adjustAutoColor receives a propertyName which is either "stroke" or "fill" along with the color generated.  If we add the following code into the loop in the above example

```ts
// Adjust Auto coloring

if (i === 4) {
    series.pointMarker.adjustAutoColor = (propertyName, color) => {
        return propertyName === "fill" ? "black" : color;
    };
}
```

 we get this

<CenteredImageWrapper
    src="/images/AutoColorAdjust.png"
/>

Using adjustAutoColor like this sets the color property so it no longer auto-colors.  If instead you return AUTO\_COLOR + "black", then it will use black for the current render, but could be updated by subsequent auto-coloring. 

Controlling When Auto Coloring Occurs
-------------------------------------

By default, colors are assigned to all series on the chart whenever a series is added or removed.  If we remove the first three series after the chart has drawn, like this:

```ts
// Remove series

setTimeout(() => {
    sciChartSurface.renderableSeries.removeAt(0);
    sciChartSurface.renderableSeries.removeAt(0);
    sciChartSurface.renderableSeries.removeAt(0);
}, 1000);
```

 Then all the series will be re-coloured using the full range of the palette.  Note the black fill has not changed.

<CenteredImageWrapper
    src="/images/AutoColorRemove.png"
/>

SciChartSurface has an [autoColorMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#autocolormode) property which is an [EAutoColorMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/eautocolormode.html).  This defaults to OnAddRemoveSeries but can also be Never, Once or Always.  With a fairly large number of series, Auto Coloring can potentially have a performance impact.