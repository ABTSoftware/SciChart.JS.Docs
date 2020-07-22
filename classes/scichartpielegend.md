[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [SciChartPieLegend](scichartpielegend.md)

# Class: SciChartPieLegend

## Hierarchy

* [SciChartLegendBase](scichartlegendbase.md)

  ↳ **SciChartPieLegend**

## Index

### Properties

* [animate](scichartpielegend.md#animate)

### Accessors

* [margin](scichartpielegend.md#margin)
* [orientation](scichartpielegend.md#orientation)
* [placement](scichartpielegend.md#placement)
* [showCheckboxes](scichartpielegend.md#showcheckboxes)
* [showLegend](scichartpielegend.md#showlegend)
* [showSeriesMarkers](scichartpielegend.md#showseriesmarkers)

### Methods

* [applyTheme](scichartpielegend.md#applytheme)
* [invalidateLegend](scichartpielegend.md#invalidatelegend)
* [setInvalidateParentSurface](scichartpielegend.md#setinvalidateparentsurface)
* [setPieSegmentArray](scichartpielegend.md#setpiesegmentarray)
* [setRootDiv](scichartpielegend.md#setrootdiv)
* [setSeriesViewRect](scichartpielegend.md#setseriesviewrect)
* [update](scichartpielegend.md#update)

## Properties

###  animate

• **animate**: *boolean* = true

*Defined in [src/Charting/Visuals/Legend/SciChartPieLegend.ts:6](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartPieLegend.ts#L6)*

## Accessors

###  margin

• **get margin**(): *number*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[margin](scichartlegendbase.md#margin)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L89)*

**Returns:** *number*

• **set margin**(`value`: number): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[margin](scichartlegendbase.md#margin)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:92](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  orientation

• **get orientation**(): *[ELegendOrientation](../enums/elegendorientation.md)*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[orientation](scichartlegendbase.md#orientation)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L65)*

**Returns:** *[ELegendOrientation](../enums/elegendorientation.md)*

• **set orientation**(`orientation`: [ELegendOrientation](../enums/elegendorientation.md)): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[orientation](scichartlegendbase.md#orientation)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:68](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`orientation` | [ELegendOrientation](../enums/elegendorientation.md) |

**Returns:** *void*

___

###  placement

• **get placement**(): *[ELegendPlacement](../enums/elegendplacement.md)*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[placement](scichartlegendbase.md#placement)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:81](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L81)*

**Returns:** *[ELegendPlacement](../enums/elegendplacement.md)*

• **set placement**(`value`: [ELegendPlacement](../enums/elegendplacement.md)): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[placement](scichartlegendbase.md#placement)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ELegendPlacement](../enums/elegendplacement.md) |

**Returns:** *void*

___

###  showCheckboxes

• **get showCheckboxes**(): *boolean*

*Defined in [src/Charting/Visuals/Legend/SciChartPieLegend.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartPieLegend.ts#L12)*

**Returns:** *boolean*

• **set showCheckboxes**(`value`: boolean): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartPieLegend.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartPieLegend.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  showLegend

• **get showLegend**(): *boolean*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[showLegend](scichartlegendbase.md#showlegend)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:73](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L73)*

**Returns:** *boolean*

• **set showLegend**(`value`: boolean): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[showLegend](scichartlegendbase.md#showlegend)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:76](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  showSeriesMarkers

• **get showSeriesMarkers**(): *boolean*

*Defined in [src/Charting/Visuals/Legend/SciChartPieLegend.ts:20](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartPieLegend.ts#L20)*

**Returns:** *boolean*

• **set showSeriesMarkers**(`value`: boolean): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartPieLegend.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartPieLegend.ts#L23)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

## Methods

###  applyTheme

▸ **applyTheme**(): *void*

*Overrides [SciChartLegendBase](scichartlegendbase.md).[applyTheme](scichartlegendbase.md#abstract-applytheme)*

*Defined in [src/Charting/Visuals/Legend/SciChartPieLegend.ts:28](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartPieLegend.ts#L28)*

**Returns:** *void*

___

###  invalidateLegend

▸ **invalidateLegend**(): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[invalidateLegend](scichartlegendbase.md#invalidatelegend)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:60](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L60)*

**Returns:** *void*

___

###  setInvalidateParentSurface

▸ **setInvalidateParentSurface**(`value`: function): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[setInvalidateParentSurface](scichartlegendbase.md#setinvalidateparentsurface)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L31)*

**Parameters:**

▪ **value**: *function*

▸ (): *void*

**Returns:** *void*

___

###  setPieSegmentArray

▸ **setPieSegmentArray**(`pieSegmentArray`: [IPieSegment](../interfaces/ipiesegment.md)[]): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartPieLegend.ts:32](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartPieLegend.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`pieSegmentArray` | [IPieSegment](../interfaces/ipiesegment.md)[] |

**Returns:** *void*

___

###  setRootDiv

▸ **setRootDiv**(`rootDivProperty`: HTMLDivElement): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[setRootDiv](scichartlegendbase.md#setrootdiv)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`rootDivProperty` | HTMLDivElement |

**Returns:** *void*

___

###  setSeriesViewRect

▸ **setSeriesViewRect**(`seriesViewRect`: Rect): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[setSeriesViewRect](scichartlegendbase.md#setseriesviewrect)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:39](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`seriesViewRect` | Rect |

**Returns:** *void*

___

###  update

▸ **update**(): *void*

*Overrides [SciChartLegendBase](scichartlegendbase.md).[update](scichartlegendbase.md#update)*

*Defined in [src/Charting/Visuals/Legend/SciChartPieLegend.ts:36](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartPieLegend.ts#L36)*

**Returns:** *void*
