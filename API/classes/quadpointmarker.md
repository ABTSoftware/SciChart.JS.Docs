[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [QuadPointMarker](quadpointmarker.md)

# Class: QuadPointMarker

## Hierarchy

  ↳ [BaseTexturePointMarker3D](basetexturepointmarker3d.md)

  ↳ **QuadPointMarker**

## Index

### Constructors

* [constructor](quadpointmarker.md#constructor)

### Properties

* [propertyChanged](quadpointmarker.md#readonly-propertychanged)

### Accessors

* [fill](quadpointmarker.md#fill)
* [markerType](quadpointmarker.md#markertype)
* [pointsTexture](quadpointmarker.md#pointstexture)
* [size](quadpointmarker.md#size)

## Constructors

###  constructor

\+ **new QuadPointMarker**(`webAssemblyContext`: TSciChart3D, `options?`: [IBasePointMarker3DOptions](../interfaces/ibasepointmarker3doptions.md)): *[QuadPointMarker](quadpointmarker.md)*

*Overrides void*

*Defined in [src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts#L59)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [IBasePointMarker3DOptions](../interfaces/ibasepointmarker3doptions.md) |

**Returns:** *[QuadPointMarker](quadpointmarker.md)*

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

*Inherited from [BaseTexturePointMarker3D](basetexturepointmarker3d.md).[markerType](basetexturepointmarker3d.md#markertype)*

*Overrides [BasePointMarker3D](basepointmarker3d.md).[markerType](basepointmarker3d.md#markertype)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BaseTexturePointMarker3D.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BaseTexturePointMarker3D.ts#L13)*

Defines the MarkerType, e.g. pixel point marker, Mesh (3d object) or textured-quad

**Returns:** *[EMarkerType](../enums/emarkertype.md)*

___

###  pointsTexture

• **get pointsTexture**(): *TSRTexture*

*Overrides [BaseTexturePointMarker3D](basetexturepointmarker3d.md).[pointsTexture](basetexturepointmarker3d.md#pointstexture)*

*Defined in [src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts:64](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts#L64)*

**Returns:** *TSRTexture*

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
