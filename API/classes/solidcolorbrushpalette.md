[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [SolidColorBrushPalette](solidcolorbrushpalette.md)

# Class: SolidColorBrushPalette

## Hierarchy

* [MeshColorPalette](meshcolorpalette.md)

  ↳ **SolidColorBrushPalette**

## Index

### Constructors

* [constructor](solidcolorbrushpalette.md#constructor)

### Properties

* [propertyChanged](solidcolorbrushpalette.md#propertychanged)

### Accessors

* [fill](solidcolorbrushpalette.md#fill)

### Methods

* [getTexture](solidcolorbrushpalette.md#gettexture)

## Constructors

###  constructor

\+ **new SolidColorBrushPalette**(`webAssemblyContext`: TSciChart3D, `options?`: [ISolidColorBrushPaletteOptions](../interfaces/isolidcolorbrushpaletteoptions.md)): *[SolidColorBrushPalette](solidcolorbrushpalette.md)*

*Overrides void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SolidColorBrushPalette.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SolidColorBrushPalette.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [ISolidColorBrushPaletteOptions](../interfaces/isolidcolorbrushpaletteoptions.md) |

**Returns:** *[SolidColorBrushPalette](solidcolorbrushpalette.md)*

## Properties

###  propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Inherited from [MeshColorPalette](meshcolorpalette.md).[propertyChanged](meshcolorpalette.md#propertychanged)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/MeshColorPalette.ts:8](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/MeshColorPalette.ts#L8)*

## Accessors

###  fill

• **get fill**(): *string*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SolidColorBrushPalette.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SolidColorBrushPalette.ts#L22)*

**Returns:** *string*

• **set fill**(`fill`: string): *void*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SolidColorBrushPalette.ts:26](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SolidColorBrushPalette.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`fill` | string |

**Returns:** *void*

## Methods

###  getTexture

▸ **getTexture**(`size`: Size): *[CanvasTexture](canvastexture.md)*

*Overrides [MeshColorPalette](meshcolorpalette.md).[getTexture](meshcolorpalette.md#abstract-gettexture)*

*Defined in [src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SolidColorBrushPalette.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SolidColorBrushPalette.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`size` | Size |

**Returns:** *[CanvasTexture](canvastexture.md)*
