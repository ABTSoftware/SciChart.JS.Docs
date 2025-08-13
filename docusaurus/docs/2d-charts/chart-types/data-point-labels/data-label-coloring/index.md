---
sidebar_position: 3
---

# Data Label Coloring

DataLabels allow per data-point text labels to be drawn on series, or arbitrary text labels at x,y positions on the chart.

You can see several datalabel examples on the SciChart.js demo:

- [The Line Chart example](https://www.scichart.com/demo/javascript-line-chart)
- [The Column Chart example](https://www.scichart.com/demo/javascript-column-chart)
- [The PaletteProvider example](https://www.scichart.com/demo/javascript-chart-color-points-individually-with-paletteprovider)
- [The DataLabels demo](https://www.scichart.com/demo/javascript-datalabels)
- [The Stacked Column Chart demo](https://www.scichart.com/demo/javascript/stacked-column-chart)
- [The Population Pyramid demo](https://www.scichart.com/demo/javascript/population-pyramid)

Explore these for some rich examples of how to use this API.

## Label Colouring

The color property on the dataLabels option sets the color for all labels, but you can do per-label coloring by overriding the [getColor():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#getcolor) function on the [dataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html).

This function hsa to return the integer color codes used by SciChart's engine, so you need to use [parseColorToUIntArgb:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#parsecolortouintargb) helper function to convert from html colors. It is a good idea to pre-calculate integer colour codes, rather than compute them each time labels are drawn, as in the example below.

<CodeSnippetBlock>
    ```ts showLineNumbers file=./demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./demo.js start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet />
