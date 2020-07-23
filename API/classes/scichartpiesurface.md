[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [SciChartPieSurface](scichartpiesurface.md)

# Class: SciChartPieSurface

## Hierarchy

* **SciChartPieSurface**

## Implements

* [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)

## Index

### Constructors

* [constructor](scichartpiesurface.md#constructor)

### Properties

* [animate](scichartpiesurface.md#animate)
* [domCanvas2D](scichartpiesurface.md#readonly-domcanvas2d)
* [domChartRoot](scichartpiesurface.md#readonly-domchartroot)
* [domDivContainer](scichartpiesurface.md#readonly-domdivcontainer)
* [domSvgContainer](scichartpiesurface.md#readonly-domsvgcontainer)
* [legend](scichartpiesurface.md#legend)
* [pieSegments](scichartpiesurface.md#readonly-piesegments)

### Accessors

* [holeRadius](scichartpiesurface.md#holeradius)
* [holeRadiusSizingMode](scichartpiesurface.md#holeradiussizingmode)
* [pieType](scichartpiesurface.md#pietype)
* [seriesSpacing](scichartpiesurface.md#seriesspacing)

### Methods

* [applyTheme](scichartpiesurface.md#applytheme)
* [changeViewportSize](scichartpiesurface.md#changeviewportsize)
* [delete](scichartpiesurface.md#delete)
* [invalidateElement](scichartpiesurface.md#invalidateelement)
* [update](scichartpiesurface.md#update)
* [create](scichartpiesurface.md#static-create)

## Constructors

###  constructor

\+ **new SciChartPieSurface**(`canvases`: [TSciChartSurfaceCanvases](../globals.md#tscichartsurfacecanvases)): *[SciChartPieSurface](scichartpiesurface.md)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:62](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L62)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`canvases` | [TSciChartSurfaceCanvases](../globals.md#tscichartsurfacecanvases) | {} |

**Returns:** *[SciChartPieSurface](scichartpiesurface.md)*

## Properties

###  animate

• **animate**: *boolean* = true

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:49](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L49)*

___

### `Readonly` domCanvas2D

• **domCanvas2D**: *HTMLCanvasElement*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md).[domCanvas2D](../interfaces/iscichartsurfacebase.md#readonly-domcanvas2d)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L46)*

___

### `Readonly` domChartRoot

• **domChartRoot**: *HTMLDivElement*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L45)*

___

### `Readonly` domDivContainer

• **domDivContainer**: *HTMLDivElement*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:48](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L48)*

___

### `Readonly` domSvgContainer

• **domSvgContainer**: *SVGSVGElement*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:47](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L47)*

___

###  legend

• **legend**: *[SciChartPieLegend](scichartpielegend.md)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:51](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L51)*

___

### `Readonly` pieSegments

• **pieSegments**: *ObservableArray‹[IPieSegment](../interfaces/ipiesegment.md)›*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:43](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L43)*

## Accessors

###  holeRadius

• **get holeRadius**(): *number*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:137](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L137)*

**Returns:** *number*

• **set holeRadius**(`holeRadius`: number): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:140](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L140)*

**Parameters:**

Name | Type |
------ | ------ |
`holeRadius` | number |

**Returns:** *void*

___

###  holeRadiusSizingMode

• **get holeRadiusSizingMode**(): *[ESizingMode](../enums/esizingmode.md)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:145](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L145)*

**Returns:** *[ESizingMode](../enums/esizingmode.md)*

• **set holeRadiusSizingMode**(`holeRadiusSizingMode`: [ESizingMode](../enums/esizingmode.md)): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:148](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L148)*

**Parameters:**

Name | Type |
------ | ------ |
`holeRadiusSizingMode` | [ESizingMode](../enums/esizingmode.md) |

**Returns:** *void*

___

###  pieType

• **get pieType**(): *[EPieType](../enums/epietype.md)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:129](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L129)*

**Returns:** *[EPieType](../enums/epietype.md)*

• **set pieType**(`value`: [EPieType](../enums/epietype.md)): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:132](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L132)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [EPieType](../enums/epietype.md) |

**Returns:** *void*

___

###  seriesSpacing

• **get seriesSpacing**(): *number*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:153](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L153)*

**Returns:** *number*

• **set seriesSpacing**(`value`: number): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:156](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L156)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

## Methods

###  applyTheme

▸ **applyTheme**(`themeProvider`: [IThemeProvider](../interfaces/ithemeprovider.md)): *void*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:93](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L93)*

**Parameters:**

Name | Type |
------ | ------ |
`themeProvider` | [IThemeProvider](../interfaces/ithemeprovider.md) |

**Returns:** *void*

___

###  changeViewportSize

▸ **changeViewportSize**(`width`: number, `height`: number): *void*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:122](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L122)*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |
`height` | number |

**Returns:** *void*

___

###  delete

▸ **delete**(): *void*

*Implementation of [ISciChartSurfaceBase](../interfaces/iscichartsurfacebase.md)*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:111](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L111)*

**Returns:** *void*

___

###  invalidateElement

▸ **invalidateElement**(): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:97](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L97)*

**Returns:** *void*

___

###  update

▸ **update**(): *void*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:103](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L103)*

**Returns:** *void*

___

### `Static` create

▸ **create**(`divElementId`: string, `width`: number, `height`: number): *Promise‹[SciChartPieSurface](scichartpiesurface.md)›*

*Defined in [src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts:33](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/SciChartPieSurface/SciChartPieSurface.ts#L33)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`divElementId` | string | - |
`width` | number | 0 |
`height` | number | 0 |

**Returns:** *Promise‹[SciChartPieSurface](scichartpiesurface.md)›*
