---
sidebar_position: 2
---

# ✅ Breaking Changes in SciChart.js v4.x from v3.x

SciChart.js v4 is a very big release with many new features and many fixes and improvements that have required some breaking changes to the api from v3.  Many of these are typo fixes or improved ways of doing the same thing.  Below you will find migration guides for all the issues you might hit.

We in the the process of updating our documentation and examples for all the changes and new features.  let us know if you find something that is out of date.

.data files removed
-------------------

The `scichart.data` file (and `scichart3d.data` file) which contained various assets, has been merged into the main wasm file, shrinking the total size of the file to be loaded and increasing startup time.  If you are serving wasm locally and your build process copies the wasm and data files from `node_modules`, you may need to remove the config for copying the .data files or you may receive file-not-found errors.

SciChartDefaults.useNativeText now defaults true
------------------------------------------------

**SciChartDefaults.useNativeText** has been changed to default to true, which means that by default, axis labels will be rendered using WebGL instead of by Canvas, unless useNativeText is set false on the axis or labelProvider.  There are pros and cons to using them:

|                     | Native Text                                                                 | Canvas Text                                                                 |
|---------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **Speed**           | Fast, especially on realtime charts or when zooming/panning, requiring changing labels | Slow to create new labels, but caching means redrawing of static labels is ok. |
| **Font support**    | Default font Arial. Using other fonts requires hosting them yourself. See [native font loading](/docs/2d-charts/miscellaneous-apis/native-text-api). | Default font Arial. Any font supported by the browser can be used. |
| **fontWeight and fontStyle** | Not supported | Supported |
| **Customisation**   | Only text can be rendered | Can override `getLabelTexture` to use images as labels. |
| **Other features**  | Size, color, rotation, multiline all supported by both | Size, color, rotation, multiline all supported by both |

If you do not have any special requirements for your labels, we recommend using the new native text defaults.  If you have specific axes using features not supported by native text, just set useNativeText: false on that axis.

SciChartSurface.svgClippingMode
-------------------------------

**SciChartSurface.svgClippingMode** functionality and corresponding **ESvgClippingMode** enum were removed in favour of a new API which supports clipping settings per annotation (both WebGL and SVG rendered).  All annotations now support the following:

**Annotation clipping**

```ts
// The clipping mode of the annotation
IAnnotation.clipping: EAnnotationClippingMode
// The clipping mode for the adorners, ie the drag handles and selection box
IAnnotation.adornerClipping: EAnnotationClippingMode
enum EAnnotationClippingMode {
    //Clips to the series view rect, ie the area within the axes
    SeriesViewRect = "SeriesViewRect",

    //Clips to the whole sub-chart rect or to the chart rect if not applicable
    SubChart = "SubChart",

     //Clips to the whole chart rect. In case of sub-charts it allows floating SVG annotations over adjacent sub-charts
    Chart = "Chart"
}
```

DataLabelProvider.getPosition()
-------------------------------

**DataLabelProvider.getPosition()** used to return Point. The method has been changed to return and object of type

```
{ position: Point; rotationCenter: Point; rotationAngle: number }
```

This allows for data driven rotation values to be calcualted for each data label.  This applies to all child classes of DataLabelProvider and HeatMapDataLabelProvider.

ChartModifierBase.executeOn
---------------------------

**ChartModifierBase.executeOn** has been replaced by **ChartModifierBase.executeCondition** which takes `{ button?: EExecuteOn, key?: EModifierMouseArgKey }`. This provides a general way of specifying when you want a modifier to activate based on both mouse button and ctrl/alt/shift keys.

**ChartModifierBase.executeOn migration**

```ts
// <= v3.5
sciChartSurface.chartModifiers.add(new ZoomPanModifier({ executeOn: EExecuteOn.MouseRightButton }) );

// >= v4.0
sciChartSurface.chartModifiers.add(new ZoomPanModifier({ executeCondition: { button: EExecuteOn.MouseRightButton } }) );
```

IXAxisDragModifierOptions.excludedAxisIds and IYAxisDragModifierOptions.excludedAxisIds
---------------------------------------------------------------------------------------

 **excludedAxisIds** on both **IXAxisDragModifierOptions** and **IYAxisDragModifierOptions** have been replaced by **excludedXAxisIds** and **excludedYAxisIds.**  This is part of a new general way to include and exclude axes from modifiers.

All modifiers now support the following constructor options, with the idea that you either supply a set to include (and anything not specified is excluded), or a set to exclude (and anything not specified is included).  This makes it much easier to deal with situations in which you are adding or removing axes.

**IChartModifierBaseOptions**

```ts
includedXAxisIds?: string[];
excludedXAxisIds?: string[];

includedYAxisIds?: string[];
excludedYAxisIds?: string[];
```

ChartModifierBase2D now also has an includedXAxes and includedYAxes property which has methods for including or excluding axes by instance.

IIncludeAxis, IIncludeSeries, IIncludeXAxis, IIncludeYAxis
----------------------------------------------------------

The **IIncludeAxis**, **IIncludeSeries**, **IIncludeXAxis** and **IIncludeYAxis** interfaces have all been removed as this functionality has been moved to the ChartModifierBase2D class, so it is available to all modifiers.

Series inclusion works similarly to Axis inclusion.  There are **includedSeriesIds** and **excludedSeriesIds** constructor options which take arrays of ids, and an **includedSeries** property with methods to include or exclude series by instance

AxisCore.DEFAULT_AXIS_ID
--------------------------

**AxisCore.DEFAULT_AXIS_ID** has been removed. From now on value for **AxisCore.id** is an auto generated guid. If there is any code where id is being set on the axis for example `xAxis.id = "someId"` it must be removed. We recommend to use the autogenerated ids. If for some reason it is not possible, you can pass the id into the constructor.

**Set Axis.id explicitly**

```ts
const xAxis = new NumericAxis(wasmContext, { id: "someId" });
```

Although it is possible to set a custom id by passing id option into the constructor, it is discouraged. This change removes the necessity to come up with custom ids when working with multiple axes. The recommended approach is to first create axes and then to used their auto generated ids. For example:

**Set Axis Ids on other objects**

```ts
const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
const xAxis1 = new NumericAxis(wasmContext);
const xAxis2 = new NumericAxis(wasmContext);
const yAxis1 = new NumericAxis(wasmContext);
const yAxis2 = new NumericAxis(wasmContext);
sciChartSurface.xAxes.add(xAxis1, xAxis2);
sciChartSurface.yAxes.add(yAxis1, yAxis2);
sciChartSurface.renderableSeries.add(
   new FastLineRenderableSeries(wasmContext, {
       xAxisId: xAxis2.id
       // if an axisId is not specified, the series will use the first one in the list, in this case yAxisId will be yAxis1.id
}));
sciChartSurface.chartModifiers.add(
    new ZoomPanModifier({
        includedXAxisIds: [xAxis1.id],
        includedYAxisIds: [yAxis1.id]
    })
);
```

 In addition **BaseRenderableSeries.xAxisId**, **BaseRenderableSeries.yAxisId**, **ChartModifierBase2D.xAxisId**, **ChartModifierBase2D.yAxisId**, **AnnotationBase.xAxisId**, **AnnotationBase.yAxisId** now defaults to undefined. If the xAxisId or yAxisId is not set the default X and Y axes will be used. The default axis is the first one that has been attached to the SciChartSurface or undefined if there are no axes. Get these using `SciChartSurface.getDefaultXAxis()` and `SciChartSurface.getDefaultYAxis()`.

RenderableSeries have xAxis and yAxis properties which return the instance of the axes they are linked to.  These links are resolved when the series is attached to the surface, and at the start of each render.

HitTestInfo.dataSeriesName
--------------------------

**HitTestInfo.dataSeriesName** has been replaced with **HitTestInfo.seriesName**, which contains the new seriesName from the renderable series. If the renderableSeries seriesName is not defined, it returns BaseDataSeries.dataSeriesName.

Legends also now use seriesName, so you can distinguish between series that use the same dataSeries.

sciChartSurface.addSubChart
---------------------------

The api for creating subcharts has changed to accommodate the new polar surfaces and subsurfaces.

**Create subchart**

```ts
// before
sciChartSurface.addSubChart(options);
// after
// This creates and adds the subchart to the given sciChartSurface and returns the created SciChartSubSurface
SciChartSubSurface.createSubSurface(sciChartSurface, options);
```

SciChartSubSurface and ISciChartSurfaceBase
-------------------------------------------

SciChartSubSurface and ISciChartSurfaceBase have both been moved to their own files, so you may need to update their imports

**Updated surface imports**

```ts
// Before
import { SciChartSubSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { ISciChartSurfaceBase } from "scichart/Charting/Visuals/SciChartSurfaceBase";
// After
import { SciChartSubSurface } from "scichart/Charting/Visuals/SciChartSubSurface";
import { ISciChartSurfaceBase } from "scichart/Charting/Visuals/ISciChartSurfaceBase";
```

SciChartSubSurface.subChartPadding
----------------------------------

**subchartPadding** property has been removed.  Instead use the padding property.

**subchart padding**

```ts
// Before
const subChartOptions = {
    subChartPadding: Thickness.fromNumber(20)
};
subChart.subChartPadding = Thickness.fromNumber(20);
// After
const subChartOptions = {
    padding: Thickness.fromNumber(20)
};
subChart.padding = Thickness.fromNumber(20);
```

SciChartSubSurface.subPosition
------------------------------

In prior versions, the position constructor option and the subPosition property on SciChartSubSurface could be set to Rect, or to `{x, y, width, height }`, which was then converted to Rect internally.

Now they could be set one of 3 formats:

*   `TXywhCoordinates: {x, y, width, height}`
*   `TLtrbCoordinates: {left, top, right, bottom}`
*   `TEdgeCoordinates: {x1, y1, x2, y2}`

but the internal transformation is no longer happening. We simply retain the object that was set. Thus, the Typescript compiler sometimes may require casting subPosition property or object which is set to it to a specific type of a selected format.

**TEasing changes**

```ts
// Before
const y = subSurface.subPosition.y
// After
const y = (subSurface.subPosition as TXywhCoordinates).y
```

You can only read values out if they are on the structure you used to set subPosition.  You can still set using Rect which includes everything from both `TXywhCoordinates: {x, y, width, height}` and `TLtrbCoordinates: {left, top, right, bottom}`, and then read out values in either format.

IThemeProvider.annotationsGripsBackroundBrush
---------------------------------------------

property **IThemeProvider.annotationsGripsBackroundBrush** typo fixed to  **IThemeProvider.annotationsGripsBackgroundBrush**

scichart/utils/perfomance
-------------------------

```
import **scichart/utils/perfomance** typo fixed to **scichart/utils/performance**
```

ColumnRenderableSeries3DOptions
-------------------------------

interface ColumnRenderableSeries3DOptions naming convention fixed to IColumnRenderableSeries3DOptions

LayoutMangerType
----------------

class **LayoutMangerType** typo fixed to **LayoutManagerType**

AxisBase3D.labelStyle.foreground
--------------------------------

property **AxisBase3D.labelStyle.foreground** renamed to **AxisBase3D.labelStyle.color** for consistency with 2D.

DoubleRange
-----------

**DoubleRange on TSciChart** renamed to **SCRTDoubleRange**.  This is used by webAssemblyContext.NumberUtil.MinMax and similar methods

## ObservableArray method

ObservableArray methods defaults delete to true in remove(), removeAt() and clear()

## SciChartSubSurface.isTransparent

Default behavior has changed. Before it was transparent even with `isTransparent = false` now you must set `isTransparent = true` to make it transparent.