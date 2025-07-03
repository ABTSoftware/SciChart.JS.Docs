---
sidebar_position: 2
---

# ✅ Data Label Positioning

DataLabels allow per data-point text labels to be drawn on series, or arbitrary text labels at x,y positions on the chart.

You can see several datalabel examples on the SciChart.js demo:

- [The Line Chart example](https://demo.scichart.com/javascript-line-chart)
- [The Column Chart example](https://demo.scichart.com/javascript-column-chart)
- [The PaletteProvider example](https://demo.scichart.com/javascript-chart-color-points-individually-with-paletteprovider)
- [The DataLabels demo](https://demo.scichart.com/javascript-datalabels)
- [The Stacked Column Chart demo](https://demo.scichart.com/javascript/stacked-column-chart)
- [The Population Pyramid demo](https://demo.scichart.com/javascript/population-pyramid)

Explore these for some rich examples of how to use this API.

## Label Positioning

The text positioning rules vary a little for different series. For line series the default behaviour is to place the label above the line if it is moving down, and below if it is moving up. This avoids the text overlapping the line in many situations, but often you will want to take more control.

You can disable the default behviour by setting [LineSeriesDataLabelProvider.aboveBelow:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineseriesdatalabelprovider.html#abovebelow) false, then you can make use of the [horizontalTextPosition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineseriesdatalabelprovider.html#horizontaltextpositionproperty) and [verticalTextPosition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineseriesdatalabelprovider.html#verticaltextpositionproperty) properties along with the padding on the style.

The position properties are where the text should be relative to the data point, so _horizontalTextPosition: EHorizontalTextPosition.Left_ means place the text to the left of the point (ie the text is anchored on the right.) This example also demonstrates the use of the [SkipIfSame:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatalabelskipmode.html#skipifsame) option for [skipMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatalabelskipmode.html) on a digital line. The other skipMode options are discussed in the section on 'Labels for many points' below.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers {39-45} file=./demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>


<LiveDocSnippet />

## Positioning Rules for Data Labels

This table summarises the built in positioning behaviour for the various series types.

| Series Type       | DataLabelProvider type                                                                                                                          | Positioning Rules                                                                                                                                                                                                                                             | Type Specific Options                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Line              | [LineSeriesDataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/lineseriesdatalabelprovider.html)               | If **aboveBelow** is true (default), place the label above the line if it is moving down, and below if it is moving up. Otherwise use **horizontalTextPosition** and **verticalTextPosition** (default: Right, Above)                                         | `aboveBelow: boolean`                                                                                                                     |
| Column / Impulse  | [ColumnSeriesDataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/columnseriesdatalabelprovider.html)           | Label is centered and outside the column (above for columns above the zeroLine, below if below). **positionMode** can be set to Inside to reverse this, or to use the value of **verticalTextPosition** (or **horizontalTextPosition** for a vertical chart). | `positionMode`: [EColumnDataLabelPosition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/ecolumndatalabelposition.html) |
| Bubble            | [BubbleSeriesDataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/bubbleseriesdatalabelprovider.html)           | Label is centered within the bubble. If **horizontalTextPosition** or **verticalTextPosition** is not Center, label is placed outside the bubble on the specified side                                                                                        | –                                                                                                                                         |
| Band              | [BandSeriesDataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/bandseriesdatalabelprovider.html)               | By default, each line of the band has its own label which follows the rules for line series. Set **singleLabel** to true to render a single label in the middle of the band, containing both y and y1 values.                                                 | `singleLabel: boolean`                                                                                                                    |
| Heatmap           | [HeatmapDataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmapdatalabelprovider.html)                     | Labels are centered in the cell                                                                                                                                                                                                                               | –                                                                                                                                         |
| NonUniformHeatmap | [HeatmapDataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmapdatalabelprovider.html)                     | Labels are centered in the cell                                                                                                                                                                                                                               | –                                                                                                                                         |
| Contours          | [ContoursDataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/contoursdatalabelprovider.html)                   | Places 10 rows of labels on the contour lines. The rows are evenly spaced. Set **labelRowCount** to adjust the number of rows                                                                                                                                 | `labelRowCount: number`                                                                                                                   |
| Text              | [TextDataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/textdatalabelprovider.html)                           | Labels placed above and to the right of the point. Set **calculateTextBounds** to false for a performance boost if rendering many labels and their size doesn't matter                                                                                        | `calculateTextBounds: boolean`                                                                                                            |
| XYScatter         | [DataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html)                                   | Labels placed above and to the right of the point                                                                                                                                                                                                             | –                                                                                                                                         |
| CandleStick/Ohlc  | [DataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html)                                   | Labels placed above and to the right of the close value                                                                                                                                                                                                       | –                                                                                                                                         |
| Stacked Column    | [StackedCollectionDataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedcollectiondatalabelprovider.html) | Label is centered and outside the column (above for columns above the zeroLine, below if below). **positionMode** can be set to Inside to reverse this, or to use the value of **verticalTextPosition** (or **horizontalTextPosition** for a vertical chart). | `positionMode`: [EColumnDataLabelPosition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/ecolumndatalabelposition.html) |

## Custom Positioning

To take full control of label positioning, override the [dataLabelProvider.getPosition():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#getposition) function. This takes [DataLabelState:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelstate.html) and a **TSRTextBounds** (a WebAssembly exported type) which describes the size of the label.

It should return a Point `{ x: number, y: number }` which will be the left, baseline point for the label. See **Native Text Api** for details on **TSRTextBounds**.

## Positioning Labels from Multiple Series

Normally, the layout for dataLabels is done per series, so labels from different series could overlap. If you want to prevent this or want to do some other adjustment of label positioning after all labels for all series have been generated, but before they are drawn, you can create an [IDataLabelLayoutManager:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/idatalabellayoutmanager.html) and attach it to the [sciChartSurface.dataLabelLayoutManager:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#datalabellayoutmanager) property.

This has a single method, [performTextLayout:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/idatalabellayoutmanager.html#performtextlayout) where you can access and update the [dataLabelProvider.dataLabels:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#datalabels) array on all the series.

Although you have access to the full surface and [renderPassInfo:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/renderpassinfo.html) in the [performTextLayout:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/idatalabellayoutmanager.html#performtextlayout) function, be aware that this is run at the very end of the render process, so only changes to the contents of the dataLabels arrays will have an effect on what is drawn. Updating other things on the surface from this function is not advised.

The example below hides labels from the second series which overlap those on the first.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./demoGlobalLayout.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

<LiveDocSnippet name="./demo" />

:::tip
Above: Text layout is overridden to take into account label bounds across series. For each label, if the label overlaps an existing label (or is within 2 pixels of the edge of an existing label), skip drawing the label.
:::