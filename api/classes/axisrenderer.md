[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [AxisRenderer](axisrenderer.md)

# Class: AxisRenderer

## Hierarchy

* **AxisRenderer**

## Index

### Constructors

* [constructor](axisrenderer.md#constructor)

### Properties

* [viewRect](axisrenderer.md#viewrect)

### Accessors

* [desiredHeight](axisrenderer.md#desiredheight)
* [desiredWidth](axisrenderer.md#desiredwidth)

### Methods

* [drawLabels](axisrenderer.md#drawlabels)
* [drawTicks](axisrenderer.md#drawticks)
* [layout](axisrenderer.md#layout)
* [measure](axisrenderer.md#measure)

## Constructors

###  constructor

\+ **new AxisRenderer**(`webAssemblyContext`: TSciChart): *[AxisRenderer](axisrenderer.md)*

*Defined in [src/Charting/Visuals/Axis/AxisRenderer.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisRenderer.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |

**Returns:** *[AxisRenderer](axisrenderer.md)*

## Properties

###  viewRect

• **viewRect**: *Rect‹›* = Rect.createZero()

*Defined in [src/Charting/Visuals/Axis/AxisRenderer.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisRenderer.ts#L22)*

## Accessors

###  desiredHeight

• **get desiredHeight**(): *number*

*Defined in [src/Charting/Visuals/Axis/AxisRenderer.ts:90](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisRenderer.ts#L90)*

**Returns:** *number*

• **set desiredHeight**(`height`: number): *void*

*Defined in [src/Charting/Visuals/Axis/AxisRenderer.ts:94](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisRenderer.ts#L94)*

**Parameters:**

Name | Type |
------ | ------ |
`height` | number |

**Returns:** *void*

___

###  desiredWidth

• **get desiredWidth**(): *number*

*Defined in [src/Charting/Visuals/Axis/AxisRenderer.ts:98](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisRenderer.ts#L98)*

**Returns:** *number*

• **set desiredWidth**(`width`: number): *void*

*Defined in [src/Charting/Visuals/Axis/AxisRenderer.ts:102](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisRenderer.ts#L102)*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |

**Returns:** *void*

## Methods

###  drawLabels

▸ **drawLabels**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `axisAlignment`: EAxisAlignment, `ticksLabels`: string[], `tickCoords`: number[], `labelStyle`: [TTextStyle](../globals.md#ttextstyle), `isVerticalChart`: boolean): *void*

*Defined in [src/Charting/Visuals/Axis/AxisRenderer.ts:115](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisRenderer.ts#L115)*

**Parameters:**

Name | Type |
------ | ------ |
`renderContext` | [WebGlRenderContext2D](webglrendercontext2d.md) |
`axisAlignment` | EAxisAlignment |
`ticksLabels` | string[] |
`tickCoords` | number[] |
`labelStyle` | [TTextStyle](../globals.md#ttextstyle) |
`isVerticalChart` | boolean |

**Returns:** *void*

___

###  drawTicks

▸ **drawTicks**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `axisAlignment`: EAxisAlignment, `tickCoords`: number[], `pen`: SCRTPen, `tickStyle`: [TTickLineStyle](../globals.md#tticklinestyle)): *void*

*Defined in [src/Charting/Visuals/Axis/AxisRenderer.ts:142](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisRenderer.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`renderContext` | [WebGlRenderContext2D](webglrendercontext2d.md) |
`axisAlignment` | EAxisAlignment |
`tickCoords` | number[] |
`pen` | SCRTPen |
`tickStyle` | [TTickLineStyle](../globals.md#tticklinestyle) |

**Returns:** *void*

___

###  layout

▸ **layout**(`rect`: Rect): *void*

*Defined in [src/Charting/Visuals/Axis/AxisRenderer.ts:106](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisRenderer.ts#L106)*

**Parameters:**

Name | Type |
------ | ------ |
`rect` | Rect |

**Returns:** *void*

___

###  measure

▸ **measure**(`isHorizontalAxis`: boolean, `labelStyle`: [TTextStyle](../globals.md#ttextstyle), `majorTicks`: number[], `labelProvider`: [NumericLabelProvider](numericlabelprovider.md), `drawLabels`: boolean, `drawTicks`: boolean): *void*

*Defined in [src/Charting/Visuals/Axis/AxisRenderer.ts:44](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/Visuals/Axis/AxisRenderer.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`isHorizontalAxis` | boolean |
`labelStyle` | [TTextStyle](../globals.md#ttextstyle) |
`majorTicks` | number[] |
`labelProvider` | [NumericLabelProvider](numericlabelprovider.md) |
`drawLabels` | boolean |
`drawTicks` | boolean |

**Returns:** *void*
