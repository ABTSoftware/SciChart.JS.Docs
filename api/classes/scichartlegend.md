[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [SciChartLegend](scichartlegend.md)

# Class: SciChartLegend

## Hierarchy

* [SciChartLegendBase](scichartlegendbase.md)

  ↳ **SciChartLegend**

## Index

### Accessors

* [margin](scichartlegend.md#margin)
* [orientation](scichartlegend.md#orientation)
* [placement](scichartlegend.md#placement)
* [showCheckboxes](scichartlegend.md#showcheckboxes)
* [showLegend](scichartlegend.md#showlegend)
* [showSeriesMarkers](scichartlegend.md#showseriesmarkers)

### Methods

* [applyTheme](scichartlegend.md#applytheme)
* [invalidateLegend](scichartlegend.md#invalidatelegend)
* [setInvalidateParentSurface](scichartlegend.md#setinvalidateparentsurface)
* [setRenderableSeriesArray](scichartlegend.md#setrenderableseriesarray)
* [setRootDiv](scichartlegend.md#setrootdiv)
* [setSeriesViewRect](scichartlegend.md#setseriesviewrect)
* [update](scichartlegend.md#update)

## Accessors

###  margin

• **get margin**(): *number*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[margin](scichartlegendbase.md#margin)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:89](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L89)*

**Returns:** *number*

• **set margin**(`value`: number): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[margin](scichartlegendbase.md#margin)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:92](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  orientation

• **get orientation**(): *[ELegendOrientation](../enums/elegendorientation.md)*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[orientation](scichartlegendbase.md#orientation)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:65](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L65)*

**Returns:** *[ELegendOrientation](../enums/elegendorientation.md)*

• **set orientation**(`orientation`: [ELegendOrientation](../enums/elegendorientation.md)): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[orientation](scichartlegendbase.md#orientation)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:68](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`orientation` | [ELegendOrientation](../enums/elegendorientation.md) |

**Returns:** *void*

___

###  placement

• **get placement**(): *[ELegendPlacement](../enums/elegendplacement.md)*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[placement](scichartlegendbase.md#placement)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:81](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L81)*

**Returns:** *[ELegendPlacement](../enums/elegendplacement.md)*

• **set placement**(`value`: [ELegendPlacement](../enums/elegendplacement.md)): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[placement](scichartlegendbase.md#placement)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ELegendPlacement](../enums/elegendplacement.md) |

**Returns:** *void*

___

###  showCheckboxes

• **get showCheckboxes**(): *boolean*

*Defined in [src/Charting/Visuals/Legend/SciChartLegend.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegend.ts#L15)*

**Returns:** *boolean*

• **set showCheckboxes**(`value`: boolean): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegend.ts:18](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegend.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  showLegend

• **get showLegend**(): *boolean*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[showLegend](scichartlegendbase.md#showlegend)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:73](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L73)*

**Returns:** *boolean*

• **set showLegend**(`value`: boolean): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[showLegend](scichartlegendbase.md#showlegend)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:76](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  showSeriesMarkers

• **get showSeriesMarkers**(): *boolean*

*Defined in [src/Charting/Visuals/Legend/SciChartLegend.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegend.ts#L23)*

**Returns:** *boolean*

• **set showSeriesMarkers**(`value`: boolean): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegend.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegend.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

## Methods

###  applyTheme

▸ **applyTheme**(): *void*

*Overrides [SciChartLegendBase](scichartlegendbase.md).[applyTheme](scichartlegendbase.md#abstract-applytheme)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegend.ts:11](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegend.ts#L11)*

**Returns:** *void*

___

###  invalidateLegend

▸ **invalidateLegend**(): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[invalidateLegend](scichartlegendbase.md#invalidatelegend)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:60](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L60)*

**Returns:** *void*

___

###  setInvalidateParentSurface

▸ **setInvalidateParentSurface**(`value`: function): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[setInvalidateParentSurface](scichartlegendbase.md#setinvalidateparentsurface)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L31)*

**Parameters:**

▪ **value**: *function*

▸ (): *void*

**Returns:** *void*

___

###  setRenderableSeriesArray

▸ **setRenderableSeriesArray**(`renderableSeriesArray`: [IRenderableSeries](../interfaces/irenderableseries.md)[]): *void*

*Defined in [src/Charting/Visuals/Legend/SciChartLegend.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegend.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`renderableSeriesArray` | [IRenderableSeries](../interfaces/irenderableseries.md)[] |

**Returns:** *void*

___

###  setRootDiv

▸ **setRootDiv**(`rootDivProperty`: HTMLDivElement): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[setRootDiv](scichartlegendbase.md#setrootdiv)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`rootDivProperty` | HTMLDivElement |

**Returns:** *void*

___

###  setSeriesViewRect

▸ **setSeriesViewRect**(`seriesViewRect`: Rect): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[setSeriesViewRect](scichartlegendbase.md#setseriesviewrect)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:39](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`seriesViewRect` | Rect |

**Returns:** *void*

___

###  update

▸ **update**(): *void*

*Inherited from [SciChartLegendBase](scichartlegendbase.md).[update](scichartlegendbase.md#update)*

*Defined in [src/Charting/Visuals/Legend/SciChartLegendBase.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/SciChartLegendBase.ts#L46)*

**Returns:** *void*
