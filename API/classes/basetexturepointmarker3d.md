[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [BaseTexturePointMarker3D](basetexturepointmarker3d.md)

# Class: BaseTexturePointMarker3D

## Hierarchy

* [BasePointMarker3D](basepointmarker3d.md)

  ↳ **BaseTexturePointMarker3D**

  ↳ [QuadPointMarker](quadpointmarker.md)

  ↳ [EllipsePointMarker3D](ellipsepointmarker3d.md)

  ↳ [TrianglePointMarker3D](trianglepointmarker3d.md)

## Index

### Properties

* [propertyChanged](basetexturepointmarker3d.md#readonly-propertychanged)

### Accessors

* [fill](basetexturepointmarker3d.md#fill)
* [markerType](basetexturepointmarker3d.md#markertype)
* [pointsTexture](basetexturepointmarker3d.md#pointstexture)
* [size](basetexturepointmarker3d.md#size)

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

*Defined in [src/Charting3D/Visuals/PointMarkers/BaseTexturePointMarker3D.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BaseTexturePointMarker3D.ts#L13)*

Defines the MarkerType, e.g. pixel point marker, Mesh (3d object) or textured-quad

**Returns:** *[EMarkerType](../enums/emarkertype.md)*

___

###  pointsTexture

• **get pointsTexture**(): *TSRTexture*

*Defined in [src/Charting3D/Visuals/PointMarkers/BaseTexturePointMarker3D.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BaseTexturePointMarker3D.ts#L21)*

Returns the TSRTexture instance which defines the flat geometry
(e.g. a billboarded textured quad) to draw at each location or point

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
