---
sidebar_position: 2
---

# ✅ Series isVisible and isVisibleChanged API

Each RenderableSeries has an [isVisible:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#isvisible) property. This defines whether the series is included in rendering or not.

isVisible can be set programmatically, or is also set by SciChart.js when checking or unchecking a Legend row checkbox (see [LegendModifier API](/docs/2d-charts/chart-modifier-api/miscellaneous-modifiers/legend-modifier)).

You can listen to isVisible changes via the [BaseRenderableSeries.isVisibleChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#isvisiblechanged) event. Listen to the event (get a callback) using the following code:

<CodeSnippetBlock labels={["TS"]}>
    ```ts file=./demo.ts start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

This can be used to get feedback about the current visibility state of a series, as in the following demo:

<LiveDocSnippet maxWidth={600} />

:::tip
See the onIsVisibleChanged parameter in [IBaseRenderableSeriesOptions.onIsVisibleChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ibaserenderableseriesoptions.html#onisvisiblechanged) for type information.

The [BaseRenderableSeries.isVisibleChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#isvisiblechanged) event handler also has args of type [SeriesVisibleChangedArgs:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/seriesvisiblechangedargs.html). In TypeScript, the code would look like this:

**Typescript isVisibleChanged**

```ts
series.isVisibleChanged.subscribe((args: SeriesVisibleChangedArgs) => {
       console.log(`isVisibleChanged handler: Series ${args.sourceSeries.type} was set to isVisible=${args.isVisible}`);
  });
```
:::


#### See Also

* [onIsVisibleChanged option:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ibaserenderableseriesoptions.html#onisvisiblechanged)
* [RenderableSeries.isVisibleChanged:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/irenderableseries.html#isvisiblechanged)