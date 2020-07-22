[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [SciChartJSLightTheme](scichartjslighttheme.md)

# Class: SciChartJSLightTheme

An implementation of [IThemeProvider](../interfaces/ithemeprovider.md) which provides a light theme

**`decription`** Applied to a 2D [SciChartSurface](scichartsurface.md), or a 3D [SciChart3DSurface](scichart3dsurface.md), the ThemeProvider may be
applied using the [applyTheme](scichartsurface.md#applytheme) method, where it is passed down to child components
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

* **SciChartJSLightTheme**

## Implements

* [IThemeProvider](../interfaces/ithemeprovider.md)

## Index

### Properties

* [annotationsGripsBackroundBrush](scichartjslighttheme.md#annotationsgripsbackroundbrush)
* [annotationsGripsBorderBrush](scichartjslighttheme.md#annotationsgripsborderbrush)
* [axis3DBandsFill](scichartjslighttheme.md#axis3dbandsfill)
* [axisBandsFill](scichartjslighttheme.md#axisbandsfill)
* [axisPlaneBackgroundFill](scichartjslighttheme.md#axisplanebackgroundfill)
* [columnFillBrush](scichartjslighttheme.md#columnfillbrush)
* [columnLineColor](scichartjslighttheme.md#columnlinecolor)
* [cursorLineBrush](scichartjslighttheme.md#cursorlinebrush)
* [defaultColorMapBrush](scichartjslighttheme.md#defaultcolormapbrush)
* [downBandSeriesFillColor](scichartjslighttheme.md#downbandseriesfillcolor)
* [downBandSeriesLineColor](scichartjslighttheme.md#downbandserieslinecolor)
* [downBodyBrush](scichartjslighttheme.md#downbodybrush)
* [downWickColor](scichartjslighttheme.md#downwickcolor)
* [gridBackgroundBrush](scichartjslighttheme.md#gridbackgroundbrush)
* [gridBorderBrush](scichartjslighttheme.md#gridborderbrush)
* [labelBackgroundBrush](scichartjslighttheme.md#labelbackgroundbrush)
* [labelBorderBrush](scichartjslighttheme.md#labelborderbrush)
* [labelForegroundBrush](scichartjslighttheme.md#labelforegroundbrush)
* [legendBackgroundBrush](scichartjslighttheme.md#legendbackgroundbrush)
* [lineSeriesColor](scichartjslighttheme.md#lineseriescolor)
* [majorGridLineBrush](scichartjslighttheme.md#majorgridlinebrush)
* [minorGridLineBrush](scichartjslighttheme.md#minorgridlinebrush)
* [mountainAreaBrush](scichartjslighttheme.md#mountainareabrush)
* [mountainLineColor](scichartjslighttheme.md#mountainlinecolor)
* [overviewFillBrush](scichartjslighttheme.md#overviewfillbrush)
* [planeBorderColor](scichartjslighttheme.md#planebordercolor)
* [rolloverLineBrush](scichartjslighttheme.md#rolloverlinebrush)
* [rubberBandFillBrush](scichartjslighttheme.md#rubberbandfillbrush)
* [rubberBandStrokeBrush](scichartjslighttheme.md#rubberbandstrokebrush)
* [sciChartBackground](scichartjslighttheme.md#scichartbackground)
* [scrollbarBackgroundBrush](scichartjslighttheme.md#scrollbarbackgroundbrush)
* [scrollbarBorderBrush](scichartjslighttheme.md#scrollbarborderbrush)
* [scrollbarGripsBackgroundBrush](scichartjslighttheme.md#scrollbargripsbackgroundbrush)
* [scrollbarViewportBackgroundBrush](scichartjslighttheme.md#scrollbarviewportbackgroundbrush)
* [scrollbarViewportBorderBrush](scichartjslighttheme.md#scrollbarviewportborderbrush)
* [shadowEffectColor](scichartjslighttheme.md#shadoweffectcolor)
* [textAnnotationBackground](scichartjslighttheme.md#textannotationbackground)
* [textAnnotationForeground](scichartjslighttheme.md#textannotationforeground)
* [tickTextBrush](scichartjslighttheme.md#ticktextbrush)
* [upBandSeriesFillColor](scichartjslighttheme.md#upbandseriesfillcolor)
* [upBandSeriesLineColor](scichartjslighttheme.md#upbandserieslinecolor)
* [upBodyBrush](scichartjslighttheme.md#upbodybrush)
* [upWickColor](scichartjslighttheme.md#upwickcolor)

## Properties

###  annotationsGripsBackroundBrush

• **annotationsGripsBackroundBrush**: *string* = "#FFFFFF33"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[annotationsGripsBackroundBrush](../interfaces/ithemeprovider.md#annotationsgripsbackroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:63](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L63)*

The [AnnotationBase](annotationbase.md) grips background color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  annotationsGripsBorderBrush

• **annotationsGripsBorderBrush**: *string* = "#232323FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[annotationsGripsBorderBrush](../interfaces/ithemeprovider.md#annotationsgripsborderbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:61](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L61)*

The [AnnotationBase](annotationbase.md) grips border color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  axis3DBandsFill

• **axis3DBandsFill**: *string* = "#33333333"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[axis3DBandsFill](../interfaces/ithemeprovider.md#axis3dbandsfill)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:115](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L115)*

The default 3D Chart Axis Bands fill color applied as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  axisBandsFill

• **axisBandsFill**: *string* = "#AAAAAA11"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[axisBandsFill](../interfaces/ithemeprovider.md#axisbandsfill)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L31)*

The Axis Bands fill brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  axisPlaneBackgroundFill

• **axisPlaneBackgroundFill**: *string* = "Transparent"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[axisPlaneBackgroundFill](../interfaces/ithemeprovider.md#axisplanebackgroundfill)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:113](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L113)*

The default 3D Chart Axis Plane background color applied as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  columnFillBrush

• **columnFillBrush**: *string* = "#777777FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[columnFillBrush](../interfaces/ithemeprovider.md#columnfillbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:101](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L101)*

The default [FastColumnRenderableSeries](fastcolumnrenderableseries.md) fill brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  columnLineColor

• **columnLineColor**: *string* = "#777777FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[columnLineColor](../interfaces/ithemeprovider.md#columnlinecolor)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:99](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L99)*

The default [FastColumnRenderableSeries](fastcolumnrenderableseries.md) stroke brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  cursorLineBrush

• **cursorLineBrush**: *string* = "#33333355"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[cursorLineBrush](../interfaces/ithemeprovider.md#cursorlinebrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:43](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L43)*

The Cursor Line brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  defaultColorMapBrush

• **defaultColorMapBrush**: *object[]* = [
        { offset: 0, color: "DarkBlue" },
        { offset: 0.5, color: "CornflowerBlue" },
        { offset: 1, color: "#FF22AA" }
    ]

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[defaultColorMapBrush](../interfaces/ithemeprovider.md#defaultcolormapbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:103](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L103)*

The default [UniformHeatmapRenderableSeries](uniformheatmaprenderableseries.md) color-map gradient stops

___

###  downBandSeriesFillColor

• **downBandSeriesFillColor**: *string* = "#E26565A0"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[downBandSeriesFillColor](../interfaces/ithemeprovider.md#downbandseriesfillcolor)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:91](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L91)*

The default [FastBandRenderableSeries](fastbandrenderableseries.md) down band fill color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  downBandSeriesLineColor

• **downBandSeriesLineColor**: *string* = "#E26565FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[downBandSeriesLineColor](../interfaces/ithemeprovider.md#downbandserieslinecolor)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:87](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L87)*

The default [FastBandRenderableSeries](fastbandrenderableseries.md) down line color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  downBodyBrush

• **downBodyBrush**: *string* = "#E26565D0"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[downBodyBrush](../interfaces/ithemeprovider.md#downbodybrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:83](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L83)*

The default [FastCandlestickRenderableSeries](fastcandlestickrenderableseries.md) down body color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  downWickColor

• **downWickColor**: *string* = "#E26565FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[downWickColor](../interfaces/ithemeprovider.md#downwickcolor)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:79](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L79)*

The default [FastCandlestickRenderableSeries](fastcandlestickrenderableseries.md) down-wick color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  gridBackgroundBrush

• **gridBackgroundBrush**: *string* = "#05333377"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[gridBackgroundBrush](../interfaces/ithemeprovider.md#gridbackgroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:39](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L39)*

The Grid area background brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  gridBorderBrush

• **gridBorderBrush**: *string* = "#33333399"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[gridBorderBrush](../interfaces/ithemeprovider.md#gridborderbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:29](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L29)*

The Grid border brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  labelBackgroundBrush

• **labelBackgroundBrush**: *string* = "#D0D0D0BB"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[labelBackgroundBrush](../interfaces/ithemeprovider.md#labelbackgroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:51](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L51)*

The [Axis](axiscore.md) label background brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  labelBorderBrush

• **labelBorderBrush**: *string* = "#33333377"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[labelBorderBrush](../interfaces/ithemeprovider.md#labelborderbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L53)*

The [Axis](axiscore.md) label border brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  labelForegroundBrush

• **labelForegroundBrush**: *string* = "#555"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[labelForegroundBrush](../interfaces/ithemeprovider.md#labelforegroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:55](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L55)*

The [Axis](axiscore.md) label foreground font color brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  legendBackgroundBrush

• **legendBackgroundBrush**: *string* = "#33333333"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[legendBackgroundBrush](../interfaces/ithemeprovider.md#legendbackgroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:49](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L49)*

The [SciChartLegend](scichartlegend.md) background brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  lineSeriesColor

• **lineSeriesColor**: *string* = "#777777FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[lineSeriesColor](../interfaces/ithemeprovider.md#lineseriescolor)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L97)*

The default [FastLineRenderableSeries](fastlinerenderableseries.md) line stroke brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  majorGridLineBrush

• **majorGridLineBrush**: *string* = "#AAAAAA"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[majorGridLineBrush](../interfaces/ithemeprovider.md#majorgridlinebrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L35)*

The Major Gridlines brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  minorGridLineBrush

• **minorGridLineBrush**: *string* = "#CFCFCF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[minorGridLineBrush](../interfaces/ithemeprovider.md#minorgridlinebrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:37](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L37)*

The Minor Gridlines brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  mountainAreaBrush

• **mountainAreaBrush**: *string* = "#76B7E2B4"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[mountainAreaBrush](../interfaces/ithemeprovider.md#mountainareabrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:93](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L93)*

The default [FastMountainRenderableSeries](fastmountainrenderableseries.md) mountain fill brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  mountainLineColor

• **mountainLineColor**: *string* = "#777777FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[mountainLineColor](../interfaces/ithemeprovider.md#mountainlinecolor)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:95](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L95)*

The default [FastMountainRenderableSeries](fastmountainrenderableseries.md) mountain line brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  overviewFillBrush

• **overviewFillBrush**: *string* = "#33333322"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[overviewFillBrush](../interfaces/ithemeprovider.md#overviewfillbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L65)*

**`inheritdoc`** 

___

###  planeBorderColor

• **planeBorderColor**: *string* = "#EEEEEEFF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[planeBorderColor](../interfaces/ithemeprovider.md#planebordercolor)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:111](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L111)*

The default 3D Chart Axis Plane border color applied as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  rolloverLineBrush

• **rolloverLineBrush**: *string* = "#33333333"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[rolloverLineBrush](../interfaces/ithemeprovider.md#rolloverlinebrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:41](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L41)*

The [RolloverModifier](rollovermodifier.md) line brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  rubberBandFillBrush

• **rubberBandFillBrush**: *string* = "#33333333"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[rubberBandFillBrush](../interfaces/ithemeprovider.md#rubberbandfillbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L45)*

The [RubberBandXyZoomModifier](rubberbandxyzoommodifier.md) recticule fill brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  rubberBandStrokeBrush

• **rubberBandStrokeBrush**: *string* = "#33333377"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[rubberBandStrokeBrush](../interfaces/ithemeprovider.md#rubberbandstrokebrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:47](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L47)*

The [RubberBandXyZoomModifier](rubberbandxyzoommodifier.md) recticule stroke brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  sciChartBackground

• **sciChartBackground**: *string* = "#F9F9F9"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[sciChartBackground](../interfaces/ithemeprovider.md#scichartbackground)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L27)*

The Background color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  scrollbarBackgroundBrush

• **scrollbarBackgroundBrush**: *string* = "#33333322"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[scrollbarBackgroundBrush](../interfaces/ithemeprovider.md#scrollbarbackgroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:67](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L67)*

**`inheritdoc`** 

___

###  scrollbarBorderBrush

• **scrollbarBorderBrush**: *string* = "#12121255"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[scrollbarBorderBrush](../interfaces/ithemeprovider.md#scrollbarborderbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L69)*

**`inheritdoc`** 

___

###  scrollbarGripsBackgroundBrush

• **scrollbarGripsBackgroundBrush**: *string* = "#FFFFFF66"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[scrollbarGripsBackgroundBrush](../interfaces/ithemeprovider.md#scrollbargripsbackgroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:71](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L71)*

**`inheritdoc`** 

___

###  scrollbarViewportBackgroundBrush

• **scrollbarViewportBackgroundBrush**: *string* = "#FFFFFF44"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[scrollbarViewportBackgroundBrush](../interfaces/ithemeprovider.md#scrollbarviewportbackgroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:73](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L73)*

**`inheritdoc`** 

___

###  scrollbarViewportBorderBrush

• **scrollbarViewportBorderBrush**: *string* = "#12121255"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[scrollbarViewportBorderBrush](../interfaces/ithemeprovider.md#scrollbarviewportborderbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L75)*

**`inheritdoc`** 

___

###  shadowEffectColor

• **shadowEffectColor**: *string* = "#A0AABAFA"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[shadowEffectColor](../interfaces/ithemeprovider.md#shadoweffectcolor)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:109](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L109)*

The default shadow effect color applied to drop-shadows

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  textAnnotationBackground

• **textAnnotationBackground**: *string* = "#FFFFFFFF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[textAnnotationBackground](../interfaces/ithemeprovider.md#textannotationbackground)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L59)*

The TextAnnotation background color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  textAnnotationForeground

• **textAnnotationForeground**: *string* = "#000000FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[textAnnotationForeground](../interfaces/ithemeprovider.md#textannotationforeground)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:57](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L57)*

The TextAnnotation font color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  tickTextBrush

• **tickTextBrush**: *string* = "#333333"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[tickTextBrush](../interfaces/ithemeprovider.md#ticktextbrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:33](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L33)*

The Tick Text brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  upBandSeriesFillColor

• **upBandSeriesFillColor**: *string* = "#52CC5490"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[upBandSeriesFillColor](../interfaces/ithemeprovider.md#upbandseriesfillcolor)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L89)*

The default [FastBandRenderableSeries](fastbandrenderableseries.md) up band fill color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  upBandSeriesLineColor

• **upBandSeriesLineColor**: *string* = "#52CC54FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[upBandSeriesLineColor](../interfaces/ithemeprovider.md#upbandserieslinecolor)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:85](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L85)*

The default [FastBandRenderableSeries](fastbandrenderableseries.md) up line color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  upBodyBrush

• **upBodyBrush**: *string* = "#52CC54A0"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[upBodyBrush](../interfaces/ithemeprovider.md#upbodybrush)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:81](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L81)*

The default [FastCandlestickRenderableSeries](fastcandlestickrenderableseries.md) up body color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  upWickColor

• **upWickColor**: *string* = "#52CC54FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[upWickColor](../interfaces/ithemeprovider.md#upwickcolor)*

*Defined in [src/Charting/Themes/SciChartJSLightTheme.ts:77](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Themes/SciChartJSLightTheme.ts#L77)*

The default [FastCandlestickRenderableSeries](fastcandlestickrenderableseries.md) up-wick color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```
