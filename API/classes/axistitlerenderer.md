[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [AxisTitleRenderer](axistitlerenderer.md)

# Class: AxisTitleRenderer

## Hierarchy

* **AxisTitleRenderer**

## Index

### Constructors

* [constructor](axistitlerenderer.md#constructor)

### Properties

* [text](axistitlerenderer.md#text)
* [viewRect](axistitlerenderer.md#viewrect)

### Accessors

* [desiredHeight](axistitlerenderer.md#desiredheight)
* [desiredWidth](axistitlerenderer.md#desiredwidth)

### Methods

* [draw](axistitlerenderer.md#draw)
* [layout](axistitlerenderer.md#layout)
* [measure](axistitlerenderer.md#measure)

## Constructors

###  constructor

\+ **new AxisTitleRenderer**(`webAssemblyContext`: TSciChart): *[AxisTitleRenderer](axistitlerenderer.md)*

*Defined in [src/Charting/Visuals/Axis/AxisTitleRenderer.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisTitleRenderer.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |

**Returns:** *[AxisTitleRenderer](axistitlerenderer.md)*

## Properties

###  text

• **text**: *string* = ""

*Defined in [src/Charting/Visuals/Axis/AxisTitleRenderer.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisTitleRenderer.ts#L16)*

___

###  viewRect

• **viewRect**: *Rect‹›* = Rect.createZero()

*Defined in [src/Charting/Visuals/Axis/AxisTitleRenderer.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisTitleRenderer.ts#L15)*

## Accessors

###  desiredHeight

• **get desiredHeight**(): *number*

*Defined in [src/Charting/Visuals/Axis/AxisTitleRenderer.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisTitleRenderer.ts#L40)*

**Returns:** *number*

• **set desiredHeight**(`value`: number): *void*

*Defined in [src/Charting/Visuals/Axis/AxisTitleRenderer.ts:44](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisTitleRenderer.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  desiredWidth

• **get desiredWidth**(): *number*

*Defined in [src/Charting/Visuals/Axis/AxisTitleRenderer.ts:48](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisTitleRenderer.ts#L48)*

**Returns:** *number*

• **set desiredWidth**(`value`: number): *void*

*Defined in [src/Charting/Visuals/Axis/AxisTitleRenderer.ts:52](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisTitleRenderer.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

## Methods

###  draw

▸ **draw**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md), `textStyle`: [TTextStyle](../globals.md#ttextstyle), `axisAlignment`: EAxisAlignment): *void*

*Defined in [src/Charting/Visuals/Axis/AxisTitleRenderer.ts:61](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisTitleRenderer.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`renderContext` | [WebGlRenderContext2D](webglrendercontext2d.md) |
`textStyle` | [TTextStyle](../globals.md#ttextstyle) |
`axisAlignment` | EAxisAlignment |

**Returns:** *void*

___

###  layout

▸ **layout**(`rect`: Rect): *void*

*Defined in [src/Charting/Visuals/Axis/AxisTitleRenderer.ts:56](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisTitleRenderer.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`rect` | Rect |

**Returns:** *void*

___

###  measure

▸ **measure**(`textStyle`: [TTextStyle](../globals.md#ttextstyle), `isHorizontal`: boolean): *void*

*Defined in [src/Charting/Visuals/Axis/AxisTitleRenderer.ts:28](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Axis/AxisTitleRenderer.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`textStyle` | [TTextStyle](../globals.md#ttextstyle) |
`isHorizontal` | boolean |

**Returns:** *void*
