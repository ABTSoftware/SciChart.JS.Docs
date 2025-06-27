---
sidebar_position: 5
---

# ✅ Working with Data

Creating or Updating Data on Builder API Created charts
-------------------------------------------------------

Data can be supplied to charts created with the SciChart.js Builder API in one of three ways:

### 1. Supply Data via Values properties

Values properties can be supplied within the series definition property.

This method is demonstrated below. This is also the format you will get by default when you serialise a chart containing data.

<CodeSnippetBlock labels={["TS"]}>
    ```ts {5,6} showLineNumbers file=./BasicExample.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

### 2. Reference sharedData using dataId properties

Often you will want to define the structure of the chart, and reuse it with different data. Instead of setting `xValues` and `yValues`, you set `xDataId` and `yDataId` to the names you use in a `sharedData` section.

For example:

<CodeSnippetBlock labels={["JS"]}>
    ```ts {3-7,14} showLineNumbers file=./SupplyingData.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

This is good for multiple series which share x data, but is not as convenient if you want to be able to update the data later. For this you need to use our [DataSeries API](/docs/2d-charts/chart-types/data-series-api/data-series-api-overview).

### 3. Create a DataSeries and Manually Assign it

Once the chart is created, you can use the `wasmContext` that is returned to create a `dataSeries` in the normal way.

Here we’re using [build2DChart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartbuilder.html#build2dchart) rather than [buildChart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartbuilder.html#buildchart) so that we don’t have to cast the result.

:::tip
Note that [build2DChart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartbuilder.html#build2dchart) (and [buildChart:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/chartbuilder.html#buildchart)) returns a `Promise` so we need to resolve it to use the result, e.g. use `async/await` syntax or `Promise chaining`.
:::

<CodeSnippetBlock labels={["JS"]}>
    ```ts {22,25} showLineNumbers file=./SupplyingData.ts start=#region_B_start end=#region_B_end
    ```
</CodeSnippetBlock>

:::tip
Note that Charts, Series and DataSeries created when using the Builder API can be accessed and modified using the JavaScript programmatic API in SciChart.js. If you want deep customization of the chart but a simple way to create templates, then this API is very powerful!
:::

Using the Filters API with the Builder API
------------------------------------------

SciChart.js v2.x features a new [Filters API](/docs/2d-charts/chart-types/data-filters-api/data-filters-api-overview), which allows you to apply dynamic data transforms to data series which update as your underlying data updates.

Here is an example of adding a `Filter` or `DataTransform` to a SciChartSurface when using the Builder API:

<CodeSnippetBlock labels={["TS"]}>
    ```ts {18} showLineNumbers file=./FilterApi.ts start=#region_A_start end=#region_A_end
    ```
</CodeSnippetBlock>

For more details regarding the Filters API, check the [Filter API Documentation](/docs/2d-charts/chart-types/data-filters-api/data-filters-api-overview).

Using PointMetadata with the Builder API
----------------------------------------

SciChart.js v2.x features a new [PointMetadata API](/docs/2d-charts/chart-types/point-metadata-api/point-metadata-api-overview), which allows you to tag any X, Y datapoint with a custom object confirming to the [IPointMetadata:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmetadata.html) interface.

This lets you tag datapoints with objects, mark them as selected or deselected, or include further information to display in tooltips, on hit-test or selection etc...

When working with the Builder API, some extra consideration is needed if you are planning to serialize and deserialize metadata.

1. You need a copy of the same metadata object applied to every point. This is needed to support datapoint selection. In this case, set the metadata poroperty on the dataSeries options to your desired object and it will be cloned to every point that is added. It will be serialized exactly as added.


```ts showLineNumbers
xyData: { 
    metadata: { 
        isSelected: false 
        } 
    }
```

2.You need to set an array of metadata with values specific to each data point. As long as your metadata object is pure data, just set the array on the metadata property.

3.Your metadata object contains functions. Now you need to supply a type name of a registered [IMetadataGenerator:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/imetadataGenerator.html). This interface can return a single object which will be used to populate each data point, or as [I1DMetadataGenerator:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/i1dmetadatagenerator.html) (or [I2DMetadataGenerator:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/i2dmetadatagenerator.html) for heatmap data) it can return an array which should be the same size as your data. In this case you will probably want to set the data property, which will be passed into the function you register to create your metadataGenerator. In this case, the output of the toJSON method on the metadataGenerator should match the format of data passed in. As before, don’t forget to define and register these things on the client. Hopefully now the type signature of the metadata option makes some sense.

```ts showLineNumbers
metadata?: 
    | IPointMetadata[] 
    | IPointMetadata 
    | { type: string; data?: any };
```

For more information regarding the PointMetadata API, check the [PointMetadata API Documentation](/docs/2d-charts/chart-types/point-metadata-api/point-metadata-api-overview).

#### See Also

* [Intro to the Builder API](/docs/2d-charts/builder-api/builder-api-overview)

* [Creating a Simple Chart](/docs/2d-charts/builder-api/simple-chart)

* [Creating a Pie Chart](/docs/2d-charts/builder-api/pie-chart)

* [Creating a Polar Chart](/docs/2d-charts/builder-api/polar-chart)

* [Creating a 3D Chart](/docs/2d-charts/builder-api/default-3d-chart)

* [Complex Options](/docs/2d-charts/builder-api/complex-options)