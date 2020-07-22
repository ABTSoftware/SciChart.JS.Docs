[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [HeatmapColorMap](heatmapcolormap.md)

# Class: HeatmapColorMap

## Hierarchy

* [SciChartLegendBase](scichartlegendbase.md)

  ↳ **HeatmapColorMap**

## Index

### Constructors

* [constructor](heatmapcolormap.md#constructor)

### Properties

* [propertyChanged](heatmapcolormap.md#readonly-propertychanged)

### Accessors

* [gradientStops](heatmapcolormap.md#gradientstops)
* [margin](heatmapcolormap.md#margin)
* [maximum](heatmapcolormap.md#maximum)
* [minimum](heatmapcolormap.md#minimum)
* [orientation](heatmapcolormap.md#orientation)
* [placement](heatmapcolormap.md#placement)
* [showLegend](heatmapcolormap.md#showlegend)

### Methods

* [applyTheme](heatmapcolormap.md#applytheme)
* [invalidateLegend](heatmapcolormap.md#invalidatelegend)
* [setInvalidateParentSurface](heatmapcolormap.md#setinvalidateparentsurface)
* [setRootDiv](heatmapcolormap.md#setrootdiv)
* [setSeriesViewRect](heatmapcolormap.md#setseriesviewrect)
* [update](heatmapcolormap.md#update)

## Constructors

###  constructor

\+ **new HeatmapColorMap**(`options?`: [IHeatmapColorMapOptions](../interfaces/iheatmapcolormapoptions.md)): *[HeatmapColorMap](heatmapcolormap.md)*

*Defined in [src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts:18](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [IHeatmapColorMapOptions](../interfaces/iheatmapcolormapoptions.md) |

**Returns:** *[HeatmapColorMap](heatmapcolormap.md)*

## Properties

### `Readonly` propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Defined in [src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts#L14)*

## Accessors

###  gradientStops

• **get gradientStops**(): *TGradientStop[]*

*Defined in [src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts:28](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts#L28)*

**Returns:** *TGradientStop[]*

• **set gradientStops**(`gradientStops`: TGradientStop[]): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts:32](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`gradientStops` | TGradientStop[] |

**Returns:** *void*

___

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

###  maximum

• **get maximum**(): *number*

*Defined in [src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts#L45)*

**Returns:** *number*

• **set maximum**(`maximum`: number): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts:48](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`maximum` | number |

**Returns:** *void*

___

###  minimum

• **get minimum**(): *number*

*Defined in [src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts:37](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts#L37)*

**Returns:** *number*

• **set minimum**(`minimum`: number): *void*

*Defined in [src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/HeatmapColorMap.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`minimum` | number |

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

## Methods

###  applyTheme

▸ **applyTheme**(): *void*

*Overrides [SciChartLegendBase](scichartlegendbase.md).[applyTheme](scichartlegendbase.md#abstract-applytheme)*

*Defined in [src/Charting/Visuals/Legend/HeatmapColorMap.ts:6](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Legend/HeatmapColorMap.ts#L6)*

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
