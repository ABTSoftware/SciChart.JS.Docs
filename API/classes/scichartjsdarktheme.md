[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [SciChartJSDarkTheme](scichartjsdarktheme.md)

# Class: SciChartJSDarkTheme

An implementation of [IThemeProvider](../interfaces/ithemeprovider.md) which provides a dark theme

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

* **SciChartJSDarkTheme**

## Implements

* [IThemeProvider](../interfaces/ithemeprovider.md)

## Index

### Properties

* [annotationsGripsBackroundBrush](scichartjsdarktheme.md#annotationsgripsbackroundbrush)
* [annotationsGripsBorderBrush](scichartjsdarktheme.md#annotationsgripsborderbrush)
* [axis3DBandsFill](scichartjsdarktheme.md#axis3dbandsfill)
* [axisBandsFill](scichartjsdarktheme.md#axisbandsfill)
* [axisPlaneBackgroundFill](scichartjsdarktheme.md#axisplanebackgroundfill)
* [columnFillBrush](scichartjsdarktheme.md#columnfillbrush)
* [columnLineColor](scichartjsdarktheme.md#columnlinecolor)
* [cursorLineBrush](scichartjsdarktheme.md#cursorlinebrush)
* [defaultColorMapBrush](scichartjsdarktheme.md#defaultcolormapbrush)
* [downBandSeriesFillColor](scichartjsdarktheme.md#downbandseriesfillcolor)
* [downBandSeriesLineColor](scichartjsdarktheme.md#downbandserieslinecolor)
* [downBodyBrush](scichartjsdarktheme.md#downbodybrush)
* [downWickColor](scichartjsdarktheme.md#downwickcolor)
* [gridBackgroundBrush](scichartjsdarktheme.md#gridbackgroundbrush)
* [gridBorderBrush](scichartjsdarktheme.md#gridborderbrush)
* [labelBackgroundBrush](scichartjsdarktheme.md#labelbackgroundbrush)
* [labelBorderBrush](scichartjsdarktheme.md#labelborderbrush)
* [labelForegroundBrush](scichartjsdarktheme.md#labelforegroundbrush)
* [legendBackgroundBrush](scichartjsdarktheme.md#legendbackgroundbrush)
* [lineSeriesColor](scichartjsdarktheme.md#lineseriescolor)
* [majorGridLineBrush](scichartjsdarktheme.md#majorgridlinebrush)
* [minorGridLineBrush](scichartjsdarktheme.md#minorgridlinebrush)
* [mountainAreaBrush](scichartjsdarktheme.md#mountainareabrush)
* [mountainLineColor](scichartjsdarktheme.md#mountainlinecolor)
* [overviewFillBrush](scichartjsdarktheme.md#overviewfillbrush)
* [planeBorderColor](scichartjsdarktheme.md#planebordercolor)
* [rolloverLineBrush](scichartjsdarktheme.md#rolloverlinebrush)
* [rubberBandFillBrush](scichartjsdarktheme.md#rubberbandfillbrush)
* [rubberBandStrokeBrush](scichartjsdarktheme.md#rubberbandstrokebrush)
* [sciChartBackground](scichartjsdarktheme.md#scichartbackground)
* [scrollbarBackgroundBrush](scichartjsdarktheme.md#scrollbarbackgroundbrush)
* [scrollbarBorderBrush](scichartjsdarktheme.md#scrollbarborderbrush)
* [scrollbarGripsBackgroundBrush](scichartjsdarktheme.md#scrollbargripsbackgroundbrush)
* [scrollbarViewportBackgroundBrush](scichartjsdarktheme.md#scrollbarviewportbackgroundbrush)
* [scrollbarViewportBorderBrush](scichartjsdarktheme.md#scrollbarviewportborderbrush)
* [shadowEffectColor](scichartjsdarktheme.md#shadoweffectcolor)
* [textAnnotationBackground](scichartjsdarktheme.md#textannotationbackground)
* [textAnnotationForeground](scichartjsdarktheme.md#textannotationforeground)
* [tickTextBrush](scichartjsdarktheme.md#ticktextbrush)
* [upBandSeriesFillColor](scichartjsdarktheme.md#upbandseriesfillcolor)
* [upBandSeriesLineColor](scichartjsdarktheme.md#upbandserieslinecolor)
* [upBodyBrush](scichartjsdarktheme.md#upbodybrush)
* [upWickColor](scichartjsdarktheme.md#upwickcolor)

## Properties

###  annotationsGripsBackroundBrush

• **annotationsGripsBackroundBrush**: *string* = "#FFFFFF33"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[annotationsGripsBackroundBrush](../interfaces/ithemeprovider.md#annotationsgripsbackroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:63](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L63)*

The [AnnotationBase](annotationbase.md) grips background color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  annotationsGripsBorderBrush

• **annotationsGripsBorderBrush**: *string* = "#EEEEEEFF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[annotationsGripsBorderBrush](../interfaces/ithemeprovider.md#annotationsgripsborderbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:61](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L61)*

The [AnnotationBase](annotationbase.md) grips border color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  axis3DBandsFill

• **axis3DBandsFill**: *string* = "#202123E1"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[axis3DBandsFill](../interfaces/ithemeprovider.md#axis3dbandsfill)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:115](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L115)*

The default 3D Chart Axis Bands fill color applied as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  axisBandsFill

• **axisBandsFill**: *string* = "#202123E1"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[axisBandsFill](../interfaces/ithemeprovider.md#axisbandsfill)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L31)*

The Axis Bands fill brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  axisPlaneBackgroundFill

• **axisPlaneBackgroundFill**: *string* = "Transparent"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[axisPlaneBackgroundFill](../interfaces/ithemeprovider.md#axisplanebackgroundfill)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:113](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L113)*

The default 3D Chart Axis Plane background color applied as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  columnFillBrush

• **columnFillBrush**: *string* = "#FFFFFFFF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[columnFillBrush](../interfaces/ithemeprovider.md#columnfillbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:101](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L101)*

The default [FastColumnRenderableSeries](fastcolumnrenderableseries.md) fill brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  columnLineColor

• **columnLineColor**: *string* = "#FFFFFFFF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[columnLineColor](../interfaces/ithemeprovider.md#columnlinecolor)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:99](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L99)*

The default [FastColumnRenderableSeries](fastcolumnrenderableseries.md) stroke brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  cursorLineBrush

• **cursorLineBrush**: *string* = "#42b64999"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[cursorLineBrush](../interfaces/ithemeprovider.md#cursorlinebrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:43](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L43)*

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

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:103](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L103)*

The default [UniformHeatmapRenderableSeries](uniformheatmaprenderableseries.md) color-map gradient stops

___

###  downBandSeriesFillColor

• **downBandSeriesFillColor**: *string* = "#E26565A0"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[downBandSeriesFillColor](../interfaces/ithemeprovider.md#downbandseriesfillcolor)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:91](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L91)*

The default [FastBandRenderableSeries](fastbandrenderableseries.md) down band fill color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  downBandSeriesLineColor

• **downBandSeriesLineColor**: *string* = "#E26565FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[downBandSeriesLineColor](../interfaces/ithemeprovider.md#downbandserieslinecolor)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:87](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L87)*

The default [FastBandRenderableSeries](fastbandrenderableseries.md) down line color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  downBodyBrush

• **downBodyBrush**: *string* = "#E26565D0"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[downBodyBrush](../interfaces/ithemeprovider.md#downbodybrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:83](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L83)*

The default [FastCandlestickRenderableSeries](fastcandlestickrenderableseries.md) down body color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  downWickColor

• **downWickColor**: *string* = "#E26565FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[downWickColor](../interfaces/ithemeprovider.md#downwickcolor)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:79](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L79)*

The default [FastCandlestickRenderableSeries](fastcandlestickrenderableseries.md) down-wick color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  gridBackgroundBrush

• **gridBackgroundBrush**: *string* = "Transparent"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[gridBackgroundBrush](../interfaces/ithemeprovider.md#gridbackgroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:39](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L39)*

The Grid area background brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  gridBorderBrush

• **gridBorderBrush**: *string* = "#5a5b5b"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[gridBorderBrush](../interfaces/ithemeprovider.md#gridborderbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:29](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L29)*

The Grid border brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  labelBackgroundBrush

• **labelBackgroundBrush**: *string* = "#42b649AA"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[labelBackgroundBrush](../interfaces/ithemeprovider.md#labelbackgroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:51](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L51)*

The [Axis](axiscore.md) label background brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  labelBorderBrush

• **labelBorderBrush**: *string* = "#42b649FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[labelBorderBrush](../interfaces/ithemeprovider.md#labelborderbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L53)*

The [Axis](axiscore.md) label border brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  labelForegroundBrush

• **labelForegroundBrush**: *string* = "#EEEEEE"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[labelForegroundBrush](../interfaces/ithemeprovider.md#labelforegroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:55](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L55)*

The [Axis](axiscore.md) label foreground font color brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  legendBackgroundBrush

• **legendBackgroundBrush**: *string* = "#1D2C35"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[legendBackgroundBrush](../interfaces/ithemeprovider.md#legendbackgroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:49](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L49)*

The [SciChartLegend](scichartlegend.md) background brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  lineSeriesColor

• **lineSeriesColor**: *string* = "#C6E6FFFF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[lineSeriesColor](../interfaces/ithemeprovider.md#lineseriescolor)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L97)*

The default [FastLineRenderableSeries](fastlinerenderableseries.md) line stroke brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  majorGridLineBrush

• **majorGridLineBrush**: *string* = "#323539"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[majorGridLineBrush](../interfaces/ithemeprovider.md#majorgridlinebrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L35)*

The Major Gridlines brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  minorGridLineBrush

• **minorGridLineBrush**: *string* = "#232426"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[minorGridLineBrush](../interfaces/ithemeprovider.md#minorgridlinebrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:37](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L37)*

The Minor Gridlines brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  mountainAreaBrush

• **mountainAreaBrush**: *string* = "#4083B777"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[mountainAreaBrush](../interfaces/ithemeprovider.md#mountainareabrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:93](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L93)*

The default [FastMountainRenderableSeries](fastmountainrenderableseries.md) mountain fill brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  mountainLineColor

• **mountainLineColor**: *string* = "#C6E6FFFF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[mountainLineColor](../interfaces/ithemeprovider.md#mountainlinecolor)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:95](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L95)*

The default [FastMountainRenderableSeries](fastmountainrenderableseries.md) mountain line brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  overviewFillBrush

• **overviewFillBrush**: *string* = "#262728BB"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[overviewFillBrush](../interfaces/ithemeprovider.md#overviewfillbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L65)*

**`inheritdoc`** 

___

###  planeBorderColor

• **planeBorderColor**: *string* = "#333333FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[planeBorderColor](../interfaces/ithemeprovider.md#planebordercolor)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:111](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L111)*

The default 3D Chart Axis Plane border color applied as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  rolloverLineBrush

• **rolloverLineBrush**: *string* = "#42b64933"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[rolloverLineBrush](../interfaces/ithemeprovider.md#rolloverlinebrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:41](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L41)*

The [RolloverModifier](rollovermodifier.md) line brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  rubberBandFillBrush

• **rubberBandFillBrush**: *string* = "#42b64933"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[rubberBandFillBrush](../interfaces/ithemeprovider.md#rubberbandfillbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L45)*

The [RubberBandXyZoomModifier](rubberbandxyzoommodifier.md) recticule fill brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  rubberBandStrokeBrush

• **rubberBandStrokeBrush**: *string* = "#42b64977"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[rubberBandStrokeBrush](../interfaces/ithemeprovider.md#rubberbandstrokebrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:47](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L47)*

The [RubberBandXyZoomModifier](rubberbandxyzoommodifier.md) recticule stroke brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  sciChartBackground

• **sciChartBackground**: *string* = "#1c1c1e"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[sciChartBackground](../interfaces/ithemeprovider.md#scichartbackground)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:27](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L27)*

The Background color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  scrollbarBackgroundBrush

• **scrollbarBackgroundBrush**: *string* = "#262728"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[scrollbarBackgroundBrush](../interfaces/ithemeprovider.md#scrollbarbackgroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:67](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L67)*

**`inheritdoc`** 

___

###  scrollbarBorderBrush

• **scrollbarBorderBrush**: *string* = "#121212"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[scrollbarBorderBrush](../interfaces/ithemeprovider.md#scrollbarborderbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:69](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L69)*

**`inheritdoc`** 

___

###  scrollbarGripsBackgroundBrush

• **scrollbarGripsBackgroundBrush**: *string* = "#535353"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[scrollbarGripsBackgroundBrush](../interfaces/ithemeprovider.md#scrollbargripsbackgroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:71](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L71)*

**`inheritdoc`** 

___

###  scrollbarViewportBackgroundBrush

• **scrollbarViewportBackgroundBrush**: *string* = "#222222"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[scrollbarViewportBackgroundBrush](../interfaces/ithemeprovider.md#scrollbarviewportbackgroundbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:73](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L73)*

**`inheritdoc`** 

___

###  scrollbarViewportBorderBrush

• **scrollbarViewportBorderBrush**: *string* = "#232323"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[scrollbarViewportBorderBrush](../interfaces/ithemeprovider.md#scrollbarviewportborderbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:75](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L75)*

**`inheritdoc`** 

___

###  shadowEffectColor

• **shadowEffectColor**: *string* = "#000000FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[shadowEffectColor](../interfaces/ithemeprovider.md#shadoweffectcolor)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:109](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L109)*

The default shadow effect color applied to drop-shadows

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  textAnnotationBackground

• **textAnnotationBackground**: *string* = "#42b649AA"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[textAnnotationBackground](../interfaces/ithemeprovider.md#textannotationbackground)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L59)*

The TextAnnotation background color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  textAnnotationForeground

• **textAnnotationForeground**: *string* = "#EEEEEE"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[textAnnotationForeground](../interfaces/ithemeprovider.md#textannotationforeground)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:57](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L57)*

The TextAnnotation font color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  tickTextBrush

• **tickTextBrush**: *string* = "#A6A7AC"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[tickTextBrush](../interfaces/ithemeprovider.md#ticktextbrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:33](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L33)*

The Tick Text brush as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  upBandSeriesFillColor

• **upBandSeriesFillColor**: *string* = "#52CC5490"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[upBandSeriesFillColor](../interfaces/ithemeprovider.md#upbandseriesfillcolor)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L89)*

The default [FastBandRenderableSeries](fastbandrenderableseries.md) up band fill color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  upBandSeriesLineColor

• **upBandSeriesLineColor**: *string* = "#52CC54FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[upBandSeriesLineColor](../interfaces/ithemeprovider.md#upbandserieslinecolor)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:85](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L85)*

The default [FastBandRenderableSeries](fastbandrenderableseries.md) up line color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  upBodyBrush

• **upBodyBrush**: *string* = "#52CC54A0"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[upBodyBrush](../interfaces/ithemeprovider.md#upbodybrush)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:81](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L81)*

The default [FastCandlestickRenderableSeries](fastcandlestickrenderableseries.md) up body color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```

___

###  upWickColor

• **upWickColor**: *string* = "#52CC54FF"

*Implementation of [IThemeProvider](../interfaces/ithemeprovider.md).[upWickColor](../interfaces/ithemeprovider.md#upwickcolor)*

*Defined in [src/Charting/Themes/SciChartJSDarkTheme.ts:77](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Themes/SciChartJSDarkTheme.ts#L77)*

The default [FastCandlestickRenderableSeries](fastcandlestickrenderableseries.md) up-wick color as an HTML color code

**`remarks`** Acceptable values include RGB format e.g. ```#FF0000```, RGBA format e.g. ```#FF000077`` and RGBA format e.g. ```rgba(255,0,0,0.5)```
