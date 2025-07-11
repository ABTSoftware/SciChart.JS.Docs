---
sidebar_position: 4
---

# Custom DataLabel Formatting with getText()

DataLabels allow per data-point text labels to be drawn on series, or arbitrary text labels at x,y positions on the chart.

You can see several datalabel examples on the SciChart.js demo:

*   [The Line Chart example](https://demo.scichart.com/javascript-line-chart)
*   [The Column Chart example](https://demo.scichart.com/javascript-column-chart)
*   [The PaletteProvider example](https://demo.scichart.com/javascript-chart-color-points-individually-with-paletteprovider)
*   [The DataLabels demo](https://demo.scichart.com/javascript-datalabels)
*   [The Stacked Column Chart demo](https://demo.scichart.com/javascript/stacked-column-chart)
*   [The Population Pyramid demo](https://demo.scichart.com/javascript/population-pyramid)

Explore these for some rich examples of how to use this API.

In the article [DataLabels API Overview](/2d-charts/chart-types/data-point-labels/data-labels-api-overview) we showed you how to apply simple formatting rules to change the number of decimal places on Data Labels. What if you needed more complex Data Label formatting rules? Enter custom label formatting.

Custom Label Formatting
-----------------------

To take full control of the label text, override the [dataLabelProvider.getText():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#gettext) function on the series [renderableSeries.dataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#datalabelprovider). 

[getText:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#gettext) has a single parameter of type [DataLabelState:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelstate.html). This has a number of helper functions that allow you to get the x and y values and coordinates without having to worry about which way the axes run or if you are using a vertical chart.

This example outputs both X and Y Values. DataLabels are rendered using the new native text system, so they support multiline using \\n for newlines. The dataLabels style option has **multiLineAlignment** and **lineSpacing** properties for controlling multiline text.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} />

:::tip
See the [DataLabelState:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelstate.html) type for what data is passed into the [getText():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#gettext) function for each label
:::