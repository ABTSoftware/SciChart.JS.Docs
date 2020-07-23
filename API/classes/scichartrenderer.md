[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [SciChartRenderer](scichartrenderer.md)

# Class: SciChartRenderer

A class used internally in SciChart to perform layout, arrangement, data-preparation and rendering on the Cartesian 2D [SciChartSurface](scichartsurface.md)

## Hierarchy

* **SciChartRenderer**

## Index

### Constructors

* [constructor](scichartrenderer.md#constructor)

### Methods

* [render](scichartrenderer.md#render)

## Constructors

###  constructor

\+ **new SciChartRenderer**(`sciChartSurface`: [SciChartSurface](scichartsurface.md)): *[SciChartRenderer](scichartrenderer.md)*

*Defined in [src/Charting/Services/SciChartRenderer.ts:19](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Services/SciChartRenderer.ts#L19)*

Creates an instance of the SciChartRenderer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sciChartSurface` | [SciChartSurface](scichartsurface.md) | The [SciChartSurface](scichartsurface.md) that we are rendering  |

**Returns:** *[SciChartRenderer](scichartrenderer.md)*

## Methods

###  render

▸ **render**(`renderContext`: [WebGlRenderContext2D](webglrendercontext2d.md)): *void*

*Defined in [src/Charting/Services/SciChartRenderer.ts:33](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Services/SciChartRenderer.ts#L33)*

Render loop for the current {@SciChartSurface}

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`renderContext` | [WebGlRenderContext2D](webglrendercontext2d.md) | the {@WebGLRenderContext2D} used for drawing  |

**Returns:** *void*
