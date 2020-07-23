[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [GradientColorPalette](gradientcolorpalette.md)

# Class: GradientColorPalette

## Hierarchy

* [MeshColorPalette](meshcolorpalette.md)

  ↳ **GradientColorPalette**

## Index

### Constructors

* [constructor](gradientcolorpalette.md#constructor)

### Properties

* [propertyChanged](gradientcolorpalette.md#propertychanged)

### Accessors

* [gradientStops](gradientcolorpalette.md#gradientstops)

### Methods

* [getTexture](gradientcolorpalette.md#gettexture)

## Constructors

###  constructor

\+ **new GradientColorPalette**(`webAssemblyContext`: TSciChart3D, `options?`: [IGradientColorPaletteOptions](../interfaces/igradientcolorpaletteoptions.md)): *[GradientColorPalette](gradientcolorpalette.md)*

*Overrides void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/GradientColorPalette.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/GradientColorPalette.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [IGradientColorPaletteOptions](../interfaces/igradientcolorpaletteoptions.md) |

**Returns:** *[GradientColorPalette](gradientcolorpalette.md)*

## Properties

###  propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Inherited from [MeshColorPalette](meshcolorpalette.md).[propertyChanged](meshcolorpalette.md#propertychanged)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/MeshColorPalette.ts:8](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/MeshColorPalette.ts#L8)*

## Accessors

###  gradientStops

• **get gradientStops**(): *TGradientStop[]*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/GradientColorPalette.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/GradientColorPalette.ts#L26)*

**Returns:** *TGradientStop[]*

• **set gradientStops**(`gradientStops`: TGradientStop[]): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/GradientColorPalette.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/GradientColorPalette.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`gradientStops` | TGradientStop[] |

**Returns:** *void*

## Methods

###  getTexture

▸ **getTexture**(`size`: Size): *[CanvasTexture](canvastexture.md)*

*Overrides [MeshColorPalette](meshcolorpalette.md).[getTexture](meshcolorpalette.md#abstract-gettexture)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/GradientColorPalette.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/GradientColorPalette.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`size` | Size |

**Returns:** *[CanvasTexture](canvastexture.md)*
