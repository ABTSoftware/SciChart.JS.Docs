---
sidebar_position: 6
---

# ✅ Complex Options

Many things in SciChart.js are customised by providing a particular subclass, eg `PointMarkers`. The type signature in the options in these cases will be something like [IPointMarker:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmarker.html) | [TPointMarkerDefinition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/tpointmarkerdefinition.html).

Many of these classes require a `wasmContext` in the constructor, which you won’t have if you are trying to pass everything in a single definition, so instead use the Definition style, which as usual is `{ type, options }`.

For example:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {5,6} showLineNumbers file=./ComplexOptions.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This works for **Themes**, **PointMarkers**, **Effects**, **Animations**, **PaletteProviders** and **LabelProviders**.

Alternatively you can take the same approach as for option 3 of creating data and call [buildChart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/modules/_scichart_builder_chartbuilder.html#buildchart) or [build2DChart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/modules/_scichart_builder_chartbuilder.html#build2dchart) with a partial definition, to get your wasmContext, then create an instance of the necessary class, then call buildSeries and pass it in. This is useful if you want to keep a reference to the object to be able to update it later.


<CodeSnippetBlock labels={["Building with complex options"]}>
    ```ts {3-6,15} showLineNumbers file=./ComplexOptions.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

Function Options
----------------

Some options properties are actually functions, such as the templating functions on [RolloverModifier](/docs/2d-charts/chart-modifier-api/rollover-modifier), or the callbacks on [SeriesSelectionModifier](/docs/2d-charts/chart-modifier-api/selection/series-selection). These have a signature which is essentially `function | string` eg

```ts
onSelectionChanged?: ((args: SelectionChangedArgs) => void) | string;
```

Here, the choice depends very specifically on whether or not you need to be able to serialise and deserialise the chart to a JSON string. If you don’t need to, just specify the option as a function as normal. If you do need to, then you will need to register your function, and pass the registered name eg:


<CodeSnippetBlock labels={["Building with function options"]}>
    ```ts {11-13,15,17-20} showLineNumbers file=./ComplexOptions.ts start=#region_C_start end=#region_C_end
    ```
</CodeSnippetBlock>

When the modifier is built, SciChart will look up the function in its registry and assign it. When you serialize the chart, you will get the function name in the definition. It is very important when doing this that the function definition and registration actually occurs before it is needed in a chart.

onCreated Function 
-------------------

Specific to the builder api, there is an **onCreated** option in the [ISciChart2DDefinition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iscichart2ddefinition.html) which is a callback that is run after the chart is built and takes the sciChartSurface as a parameter.  It can be used to run zoomExtents, or perform further configuration using the standard api.

#### See Also

* [Intro to the Builder API](/docs/2d-charts/builder-api/builder-api-overview)
* [Working with Data](/docs/2d-charts/builder-api/working-with-data)
* [Custom Subtypes](/docs/2d-charts/builder-api/custom-subtypes)