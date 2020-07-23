[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [PixelPointMarker3D](pixelpointmarker3d.md)

# Class: PixelPointMarker3D

## Hierarchy

* [BasePointMarker3D](basepointmarker3d.md)

  ↳ **PixelPointMarker3D**

## Index

### Constructors

* [constructor](pixelpointmarker3d.md#constructor)

### Properties

* [propertyChanged](pixelpointmarker3d.md#readonly-propertychanged)

### Accessors

* [fill](pixelpointmarker3d.md#fill)
* [markerType](pixelpointmarker3d.md#markertype)
* [size](pixelpointmarker3d.md#size)

## Constructors

###  constructor

\+ **new PixelPointMarker3D**(`webAssemblyContext`: TSciChart3D, `options?`: [IBasePointMarker3DOptions](../interfaces/ibasepointmarker3doptions.md)): *[PixelPointMarker3D](pixelpointmarker3d.md)*

*Overrides void*

*Defined in [src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts:48](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [IBasePointMarker3DOptions](../interfaces/ibasepointmarker3doptions.md) |

**Returns:** *[PixelPointMarker3D](pixelpointmarker3d.md)*

## Properties

### `Readonly` propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[propertyChanged](basepointmarker3d.md#readonly-propertychanged)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L31)*

## Accessors

###  fill

• **get fill**(): *string*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[fill](basepointmarker3d.md#fill)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L45)*

**Returns:** *string*

• **set fill**(`fill`: string): *void*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[fill](basepointmarker3d.md#fill)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:48](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`fill` | string |

**Returns:** *void*

___

###  markerType

• **get markerType**(): *[EMarkerType](../enums/emarkertype.md)*

*Overrides [BasePointMarker3D](basepointmarker3d.md).[markerType](basepointmarker3d.md#markertype)*

*Defined in [src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts:54](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts#L54)*

**Returns:** *[EMarkerType](../enums/emarkertype.md)*

___

###  size

• **get size**(): *number*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[size](basepointmarker3d.md#size)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L53)*

**Returns:** *number*

• **set size**(`size`: number): *void*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[size](basepointmarker3d.md#size)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:56](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`size` | number |

**Returns:** *void*
