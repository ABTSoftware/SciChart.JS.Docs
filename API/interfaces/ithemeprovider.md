[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [IThemeProvider](ithemeprovider.md)

# Interface: IThemeProvider

**`summary`** The ThemeProvider has properties to define a theme within SciChart's 2D & 3D Charts

**`decription`** Applied to a 2D [SciChartSurface](../classes/scichartsurface.md), or a 3D [SciChart3DSurface](../classes/scichart3dsurface.md), the ThemeProvider may be
applied using the [applyTheme](../classes/scichartsurface.md#applytheme) method, where it is passed down to child components
so that all children of the chart get the same theme.

For example:
```ts
// Applying a built-in dark theme
const sciChartSurface: SciChartSurface;
sciChartSurface.applyTheme(new SciChartJSDarkTheme());
// Or light theme
sciChartSurface.applyTheme(new SciChartJSLightTheme());

// Applying a custom theme
export class MyCustomTheme implements IThemeProvider {
   // todo: implement IThemeProvider interface and apply properties
}

sciChartSurface.applyTheme(new MyCustomTheme());
```

## Hierarchy

* **IThemeProvider**

## Implemented by

* [SciChartJSDarkTheme](../classes/scichartjsdarktheme.md)
* [SciChartJSLightTheme](../classes/scichartjslighttheme.md)

## Index

### Properties

* [annotationsGripsBackroundBrush](ithemeprovider.md#annotationsgripsbackroundbrush)
* [annotationsGripsBorderBrush](ithemeprovider.md#annotationsgripsborderbrush)
* [axis3DBandsFill](ithemeprovider.md#axis3dbandsfill)
* [axisBandsFill](ithemeprovider.md#axisbandsfill)
* [axisPlaneBackgroundFill](ithemeprovider.md#axisplanebackgroundfill)
* [columnFillBrush](ithemeprovider.md#columnfillbrush)
* [columnLineColor](ithemeprovider.md#columnlinecolor)
* [cursorLineBrush](ithemeprovider.md#cursorlinebrush)
* [defaultColorMapBrush](ithemeprovider.md#defaultcolormapbrush)
* [downBandSeriesFillColor](ithemeprovider.md#downbandseriesfillcolor)
* [downBandSeriesLineColor](ithemeprovider.md#downbandserieslinecolor)
* [downBodyBrush](ithemeprovider.md#downbodybrush)
* [downWickColor](ithemeprovider.md#downwickcolor)
* [gridBackgroundBrush](ithemeprovider.md#gridbackgroundbrush)
* [gridBorderBrush](ithemeprovider.md#gridborderbrush)
* [labelBackgroundBrush](ithemeprovider.md#labelbackgroundbrush)
* [labelBorderBrush](ithemeprovider.md#labelborderbrush)
* [labelForegroundBrush](ithemeprovider.md#labelforegroundbrush)
* [legendBackgroundBrush](ithemeprovider.md#legendbackgroundbrush)
* [lineSeriesColor](ithemeprovider.md#lineseriescolor)
* [majorGridLineBrush](ithemeprovider.md#majorgridlinebrush)
* [minorGridLineBrush](ithemeprovider.md#minorgridlinebrush)
* [mountainAreaBrush](ithemeprovider.md#mountainareabrush)
* [mountainLineColor](ithemeprovider.md#mountainlinecolor)
* [overviewFillBrush](ithemeprovider.md#overviewfillbrush)
* [planeBorderColor](ithemeprovider.md#planebordercolor)
* [rolloverLineBrush](ithemeprovider.md#rolloverlinebrush)
* [rubberBandFillBrush](ithemeprovider.md#rubberbandfillbrush)
* [rubberBandStrokeBrush](ithemeprovider.md#rubberbandstrokebrush)
* [sciChartBackground](ithemeprovider.md#scichartbackground)
* [scrollbarBackgroundBrush](ithemeprovider.md#scrollbarbackgroundbrush)
* [scrollbarBorderBrush](ithemeprovider.md#scrollbarborderbrush)
* [scrollbarGripsBackgroundBrush](ithemeprovider.md#scrollbargripsbackgroundbrush)
* [scrollbarViewportBackgroundBrush](ithemeprovider.md#scrollbarviewportbackgroundbrush)
* [scrollbarViewportBorderBrush](ithemeprovider.md#scrollbarviewportborderbrush)
* [shadowEffectColor](ithemeprovider.md#shadoweffectcolor)
* [textAnnotationBackground](ithemeprovider.md#textannotationbackground)
* [textAnnotationForeground](ithemeprovider.md#textannotationforeground)
* [tickTextBrush](ithemeprovider.md#ticktextbrush)
* [upBandSeriesFillColor](ithemeprovider.md#upbandseriesfillcolor)
* [upBandSeriesLineColor](ithemeprovider.md#upbandserieslinecolor)
* [upBodyBrush](ithemeprovider.md#upbodybrush)
* [upWickColor](ithemeprovider.md#upwickcolor)

## Properties

###  annotationsGripsBackroundBrush

• **annotationsGripsBackroundBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:120](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L120)*

The [AnnotationBase](../classes/annotationbase.md) grips background color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  annotationsGripsBorderBrush

• **annotationsGripsBorderBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:115](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L115)*

The [AnnotationBase](../classes/annotationbase.md) grips border color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  axis3DBandsFill

• **axis3DBandsFill**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:215](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L215)*

The default 3D Chart Axis Bands fill color applied as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  axisBandsFill

• **axisBandsFill**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L40)*

The Axis Bands fill brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  axisPlaneBackgroundFill

• **axisPlaneBackgroundFill**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:210](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L210)*

The default 3D Chart Axis Plane background color applied as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  columnFillBrush

• **columnFillBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:191](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L191)*

The default [FastColumnRenderableSeries](../classes/fastcolumnrenderableseries.md) fill brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  columnLineColor

• **columnLineColor**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:186](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L186)*

The default [FastColumnRenderableSeries](../classes/fastcolumnrenderableseries.md) stroke brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  cursorLineBrush

• **cursorLineBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:70](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L70)*

The Cursor Line brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  defaultColorMapBrush

• **defaultColorMapBrush**: *TGradientStop[]*

*Defined in [src/Charting/Themes/IThemeProvider.ts:195](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L195)*

The default [UniformHeatmapRenderableSeries](../classes/uniformheatmaprenderableseries.md) color-map gradient stops

___

###  downBandSeriesFillColor

• **downBandSeriesFillColor**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:166](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L166)*

The default [FastBandRenderableSeries](../classes/fastbandrenderableseries.md) down band fill color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  downBandSeriesLineColor

• **downBandSeriesLineColor**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:156](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L156)*

The default [FastBandRenderableSeries](../classes/fastbandrenderableseries.md) down line color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  downBodyBrush

• **downBodyBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:146](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L146)*

The default [FastCandlestickRenderableSeries](../classes/fastcandlestickrenderableseries.md) down body color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  downWickColor

• **downWickColor**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:136](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L136)*

The default [FastCandlestickRenderableSeries](../classes/fastcandlestickrenderableseries.md) down-wick color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  gridBackgroundBrush

• **gridBackgroundBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:60](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L60)*

The Grid area background brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  gridBorderBrush

• **gridBorderBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L35)*

The Grid border brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  labelBackgroundBrush

• **labelBackgroundBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:90](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L90)*

The [Axis](../classes/axiscore.md) label background brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  labelBorderBrush

• **labelBorderBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:95](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L95)*

The [Axis](../classes/axiscore.md) label border brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  labelForegroundBrush

• **labelForegroundBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:100](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L100)*

The [Axis](../classes/axiscore.md) label foreground font color brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  legendBackgroundBrush

• **legendBackgroundBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:85](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L85)*

The [SciChartLegend](../classes/scichartlegend.md) background brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  lineSeriesColor

• **lineSeriesColor**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:181](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L181)*

The default [FastLineRenderableSeries](../classes/fastlinerenderableseries.md) line stroke brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  majorGridLineBrush

• **majorGridLineBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L50)*

The Major Gridlines brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  minorGridLineBrush

• **minorGridLineBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:55](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L55)*

The Minor Gridlines brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  mountainAreaBrush

• **mountainAreaBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:171](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L171)*

The default [FastMountainRenderableSeries](../classes/fastmountainrenderableseries.md) mountain fill brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  mountainLineColor

• **mountainLineColor**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:176](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L176)*

The default [FastMountainRenderableSeries](../classes/fastmountainrenderableseries.md) mountain line brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  overviewFillBrush

• **overviewFillBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:121](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L121)*

___

###  planeBorderColor

• **planeBorderColor**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:205](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L205)*

The default 3D Chart Axis Plane border color applied as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  rolloverLineBrush

• **rolloverLineBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L65)*

The [RolloverModifier](../classes/rollovermodifier.md) line brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  rubberBandFillBrush

• **rubberBandFillBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L75)*

The [RubberBandXyZoomModifier](../classes/rubberbandxyzoommodifier.md) recticule fill brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  rubberBandStrokeBrush

• **rubberBandStrokeBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:80](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L80)*

The [RubberBandXyZoomModifier](../classes/rubberbandxyzoommodifier.md) recticule stroke brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  sciChartBackground

• **sciChartBackground**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L30)*

The Background color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  scrollbarBackgroundBrush

• **scrollbarBackgroundBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:122](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L122)*

___

###  scrollbarBorderBrush

• **scrollbarBorderBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:123](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L123)*

___

###  scrollbarGripsBackgroundBrush

• **scrollbarGripsBackgroundBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:124](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L124)*

___

###  scrollbarViewportBackgroundBrush

• **scrollbarViewportBackgroundBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:125](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L125)*

___

###  scrollbarViewportBorderBrush

• **scrollbarViewportBorderBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:126](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L126)*

___

###  shadowEffectColor

• **shadowEffectColor**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:200](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L200)*

The default shadow effect color applied to drop-shadows

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  textAnnotationBackground

• **textAnnotationBackground**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:110](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L110)*

The TextAnnotation background color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  textAnnotationForeground

• **textAnnotationForeground**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:105](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L105)*

The TextAnnotation font color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  tickTextBrush

• **tickTextBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L45)*

The Tick Text brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  upBandSeriesFillColor

• **upBandSeriesFillColor**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:161](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L161)*

The default [FastBandRenderableSeries](../classes/fastbandrenderableseries.md) up band fill color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  upBandSeriesLineColor

• **upBandSeriesLineColor**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:151](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L151)*

The default [FastBandRenderableSeries](../classes/fastbandrenderableseries.md) up line color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  upBodyBrush

• **upBodyBrush**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:141](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L141)*

The default [FastCandlestickRenderableSeries](../classes/fastcandlestickrenderableseries.md) up body color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  upWickColor

• **upWickColor**: *string*

*Defined in [src/Charting/Themes/IThemeProvider.ts:131](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Themes/IThemeProvider.ts#L131)*

The default [FastCandlestickRenderableSeries](../classes/fastcandlestickrenderableseries.md) up-wick color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```
