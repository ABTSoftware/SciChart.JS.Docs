---
sidebar_position: 6
---

# DataLabel SkipModes and Culling

DataLabels allow per data-point text labels to be drawn on series, or arbitrary text labels at x,y positions on the chart.

You can see several datalabel examples on the SciChart.js demo:

- [The Line Chart example](https://demo.scichart.com/javascript-line-chart)
- [The Column Chart example](https://demo.scichart.com/javascript-column-chart)
- [The PaletteProvider example](https://demo.scichart.com/javascript-chart-color-points-individually-with-paletteprovider)
- [The DataLabels demo](https://demo.scichart.com/javascript-datalabels)
- [The Stacked Column Chart demo](https://demo.scichart.com/javascript/stacked-column-chart)
- [The Population Pyramid demo](https://demo.scichart.com/javascript/population-pyramid)

Explore these for some rich examples of how to use this API.

## Labels for Many Points

SciChart's native text rendering means that it can potentially draw tens of thousands of labels relatively fast, but in practise with many points there is no point drawing so many labels that they become unreadable. SciChart has a number of options for dealing with this. If you really want to show all labels even if they overlap, set [skipMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#skipmode) to [EDataLabelSkipMode.ShowAll:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatalabelskipmode.html)

### Hide overlapping labels

The default for the [skipMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#skipmode) property is [EDataLabelSkipMode.SkipIfOverlapPrevious:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatalabelskipmode.html). This means a label will not be drawn if it would overlap the bounds of the previous label. This means that even if you have 1000 points on a line series, you will only see a few dozen non-overlpping labels (depending on the shape of your data).

The downside of this is that SciChart has to calculate the text, size and position of every label, and then throw most of them away, which is potentially inefficient.
Also, it is often unclear which points on the line are actually being labeled. 
The alternative to this is to calculate less labels (use [skipNumber:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#skipnumber))
or to not draw labels at all if there are too many to display (use [pointGapThreshold:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#pointgapthreshold) 
or [pointCountThreshold:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#pointcountthreshold)).

[skipMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#skipmode) 
also has a [EDataLabelSkipMode.SkipIfOverlapNext:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/edatalabelskipmode.html) option. 
This is useful if you have labels of significantly varying lengths, as it means long labels tend to be skipped in favour of shorter ones.

### Improve performance with many points using skipNumber

Setting [skipNumber:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#skipnumber) greater than 0 will make SciChart skip that many points between each label it generates. The number of labels generated is therefore pointCount / ( skipNumber + 1). You will see performance warnings in the console if more than 80% of labels were skipped.

### Showing Labels Past a Threshold

The alternative is to only show labels when the chart is sufficiently zoomed in so that there are a sensible number of labels to display, or room to show them.

#### pointGapThreshold

If your labels are a consistent size and your data is evenly spaced and does not have large y variation (ie it is smooth, not jagged), then setting [pointGapThreshold:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#pointgapthreshold) to around 1 will cause labels to appear only when there is room to show them. [pointGapThreshold:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#pointgapthreshold) is the gap between the first points divided by the size of the first label, so 1 means the spacing between points is equal to the label size. Values less than 1 will cause labels to be drawn sooner, but they may overlap. Values greater than 1 mean that you will need to zoom in more, but labels are less likely to overlap.

#### pointCountThreshold

If your data is unevenly spaced, is jagged, or your label text has significant variation in width, then [pointCountThreshold:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#pointcountthreshold) may give more predictable results. It is simply the number of points in view, below which labels will be drawn. [skipMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#skipmode) and [skipNumber:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#skipnumber) still apply when these threshold options are set.

#### Custom thresholds

If you don't like either of those options, you can write your own threshold by overriding the [shouldGenerate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#shouldgenerate) function on [dataLabelProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html). This receives a [DataLabelState:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelstate.html) which will return values for the first label. If [shouldGenerate:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datalabelprovider.html#shouldgenerate) returns true, labels will be generated. If false, they will not. Below is the standard implementation of shouldGenerate.

<!-- TODO create an actual example with snippet -->

```ts
public shouldGenerate(state: DataLabelState): boolean {
    if (state.pointCount > this.pointCountThresholdProperty) return false;
    const firstlabel = this.getText(state);
    const bounds = getTextBounds(this.webAssemblyContext);
    state.font.CalculateStringBounds(firstlabel ?? "", bounds, this.style?.lineSpacing ?? 2);
    return state.pointGap > bounds.m_fWidth * this.pointGapThreshold;
}
```
