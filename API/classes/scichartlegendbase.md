[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [SciChartLegendBase](scichartlegendbase.md)

# Class: SciChartLegendBase

## Hierarchy

* **SciChartLegendBase**

  ↳ [SciChartLegend](scichartlegend.md)

  ↳ [HeatmapColorMap](heatmapcolormap.md)

  ↳ [SciChartPieLegend](scichartpielegend.md)

## Index

### Accessors

* [margin](scichartlegendbase.md#margin)
* [orientation](scichartlegendbase.md#orientation)
* [placement](scichartlegendbase.md#placement)
* [showLegend](scichartlegendbase.md#showlegend)

### Methods

* [applyTheme](scichartlegendbase.md#abstract-applytheme)
* [invalidateLegend](scichartlegendbase.md#invalidatelegend)
* [setInvalidateParentSurface](scichartlegendbase.md#setinvalidateparentsurface)
* [setRootDiv](scichartlegendbase.md#setrootdiv)
* [setSeriesViewRect](scichartlegendbase.md#setseriesviewrect)
* [update](scichartlegendbase.md#update)

## Accessors

###  margin

• **get margin**(): *number*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L89)*

**Returns:** *number*

• **set margin**(`value`: number): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:92](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  orientation

• **get orientation**(): *[ELegendOrientation](../enums/elegendorientation.md)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L65)*

**Returns:** *[ELegendOrientation](../enums/elegendorientation.md)*

• **set orientation**(`orientation`: [ELegendOrientation](../enums/elegendorientation.md)): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:68](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`orientation` | [ELegendOrientation](../enums/elegendorientation.md) |

**Returns:** *void*

___

###  placement

• **get placement**(): *[ELegendPlacement](../enums/elegendplacement.md)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:81](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L81)*

**Returns:** *[ELegendPlacement](../enums/elegendplacement.md)*

• **set placement**(`value`: [ELegendPlacement](../enums/elegendplacement.md)): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ELegendPlacement](../enums/elegendplacement.md) |

**Returns:** *void*

___

###  showLegend

• **get showLegend**(): *boolean*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:73](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L73)*

**Returns:** *boolean*

• **set showLegend**(`value`: boolean): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:76](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

## Methods

### `Abstract` applyTheme

▸ **applyTheme**(): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:29](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L29)*

**Returns:** *void*

___

###  invalidateLegend

▸ **invalidateLegend**(): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:60](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L60)*

**Returns:** *void*

___

###  setInvalidateParentSurface

▸ **setInvalidateParentSurface**(`value`: function): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L31)*

**Parameters:**

▪ **value**: *function*

▸ (): *void*

**Returns:** *void*

___

###  setRootDiv

▸ **setRootDiv**(`rootDivProperty`: HTMLDivElement): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`rootDivProperty` | HTMLDivElement |

**Returns:** *void*

___

###  setSeriesViewRect

▸ **setSeriesViewRect**(`seriesViewRect`: Rect): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:39](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`seriesViewRect` | Rect |

**Returns:** *void*

___

###  update

▸ **update**(): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L46)*

**Returns:** *void*
