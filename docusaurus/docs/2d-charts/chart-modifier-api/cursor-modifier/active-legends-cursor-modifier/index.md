---
sidebar_position: 3
---

# Active Legends - CursorModifier output into a legend

Background reading:

If you haven't already, read the article [The CursorModifier Type](CursorModifier.html) which will show you how to setup a CursorModifier with default options for tooltips. This article goes into further detail on customising the tooltip items (formatting, text content)

CursorModifier tooltipLegendTemplates
-------------------------------------

The [CursorModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html) supports a tooltipLegendTemplate property which allows you to specify a function to transform CursorModifier content into a legend which can be placed in the top left of the chart. This active legend updates with series values as you move the mouse.

Perhaps the best example of this is in financial charts, which require placing a legend in the top left of the chart to show the current hovered candle or series.

Here's a worked example below, which extends our [Candlestick Chart - Volume Bars](The Candlestick Series type.html) example with an active legend provided by [CursorModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html).

*   [Javascript](#i-tab-content-JS)

```ts
// Add a CursorModifier with active legend to the chart
const cursorModifier = new CursorModifier({
    // X,Y offset in pixels for the active legend
    tooltipLegendOffsetX: 5,
    tooltipLegendOffsetY: 5,
    // Callback to format the legend
    tooltipLegendTemplate: (seriesInfos, svgAnnotation) => {
        let outputSvgString = "";

        // Foreach series there will be a seriesInfo supplied by SciChart. This contains info about the series under the mouse
        seriesInfos.forEach((seriesInfo, index) => {
            const y = 20 + index \* 20;
            // use the series.stroke for the text color. If the series.stroke is transparent, use white
            let textColor = seriesInfo.stroke;
            if (textColor === undefined || parseColorToTArgb(textColor).opacity === 0) {
                textColor = "#ffffff";
            }
            // Default handling for Xy series
            let legendText = seriesInfo.formattedYValue;
            // Special handling for Ohlc series
            if (seriesInfo.dataSeriesType === EDataSeriesType.Ohlc) {
                legendText =
                    \`Open=${seriesInfo.formattedOpenValue} High=${seriesInfo.formattedHighValue} \` +
                    \`Low=${seriesInfo.formattedLowValue} Close=${seriesInfo.formattedCloseValue}\`;
            }
            // Output one block of text per seriesInfo on the chart. Using seriesName (from dataSeries.dataSeriesName) as a prefix
            outputSvgString += \`<text x="8" y="${y}" font-size="13" font-family="Verdana" fill="${textColor}"\>
        ${seriesInfo.seriesName}: ${legendText}
    </text>\`;
        });

        return \`<svg width="100%" height="100%"\>
            ${outputSvgString}
        </svg>\`;
    }
});
sciChartSurface.chartModifiers.add(cursorModifier);
```

This results in the following output:

<LiveDocSnippet name="./ActiveLegends/demo" />

Using External placementDivId with the CursorModifier
-----------------------------------------------------

Another way you can control the placement of the [CursorModifier:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html) tooltip is using the [placementDivId:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#placementdivid) property. This places the standard CursorModifier tooltip into a div of your choice (which can be anywhere on the app).

Note, it does not currently work with [tooltipLegendTemplate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html#tooltiplegendtemplate), however we are working on more options for styling, placement and configuration of tooltips soon.

Try the following code in your application:

*   [Javascript](#i-tab-content-JS)

```ts
// Add a CursorModifier with external placement div on the chart
// Expects <div id="legend-root" /> to be present in the DOM
const cursorModifier = new CursorModifier({
    placementDivId: "legend-root",
    showTooltip: true,
    tooltipContainerBackground: "#4682b433"
});
sciChartSurface.chartModifiers.add(cursorModifier);
```

This results in the following output.


#### See Also

* [Formatting CursorModifier Tooltip Items](../formatting-cursor-modifier-tooltip-items/)
* [Customizing the CursorModifier Tooltip Container Appearance](../customizing-cursor-modifier-tooltip-container-appearance/)