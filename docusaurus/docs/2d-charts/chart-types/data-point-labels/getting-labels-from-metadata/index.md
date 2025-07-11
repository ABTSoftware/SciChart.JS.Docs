---
sidebar_position: 5
---

# Getting Labels from Metadata

DataLabels allow per data-point text labels to be drawn on series, or arbitrary text labels at x,y positions on the chart.

You can see several datalabel examples on the SciChart.js demo:

- [The Line Chart example](https://demo.scichart.com/javascript-line-chart)
- [The Column Chart example](https://demo.scichart.com/javascript-column-chart)
- [The PaletteProvider example](https://demo.scichart.com/javascript-chart-color-points-individually-with-paletteprovider)
- [The DataLabels demo](https://demo.scichart.com/javascript-datalabels)
- [The Stacked Column Chart demo](https://demo.scichart.com/javascript/stacked-column-chart)
- [The Population Pyramid demo](https://demo.scichart.com/javascript/population-pyramid)

Explore these for some rich examples of how to use this API.

## Formatting a DataLabel using metaDataSelector

:::tip
Metadata allows you to assign optional javascript objects to individual x,y datapoints. To learn more about the [Metadata API, see here](/2d-charts/chart-types/point-metadata-api/point-metadata-api-overview).
:::

DataLabels support rendering text from metadata as standard. You just need to provide a function to the [metaDataSelector:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#metadataselector) option that tells SciChart how to turn your metaData into text.

Find an example below:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./demo.ts start=region_B_start end=region_B_end

    ```

</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet />

## Accessing Metadata from getText() and DataLabelState

The [metaDataSelector:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#metadataselector) option allows you to return values stored in the metadata of a dataSeries, but what if you wanted to have more complex formatting mixing index, x, y value or the metadata values?

You can also access metadata via a custom [DataLabelProvider.getText():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#gettext) function. This technique is covered in the article Custom DataLabel Formatting.

Once you've setup a custom formatting function, you can then use [dataLabelState.getMetaData():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelstate.html#getmetadata) to get the metaData for the current point.

Here's an example:

<CodeSnippetBlock>
    ```ts file=./metadataViaGetText.ts start=region_A_start end=region_A_end

    ```
    ```ts file=./metadataViaGetText.js start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

This results in the following output.

<LiveDocSnippet name="metadataViaGetText" />
