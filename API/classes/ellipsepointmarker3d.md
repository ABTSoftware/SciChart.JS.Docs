[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [EllipsePointMarker3D](ellipsepointmarker3d.md)

# Class: EllipsePointMarker3D

## Hierarchy

  ↳ [BaseTexturePointMarker3D](basetexturepointmarker3d.md)

  ↳ **EllipsePointMarker3D**

## Index

### Constructors

* [constructor](ellipsepointmarker3d.md#constructor)

### Properties

* [propertyChanged](ellipsepointmarker3d.md#readonly-propertychanged)

### Accessors

* [fill](ellipsepointmarker3d.md#fill)
* [markerType](ellipsepointmarker3d.md#markertype)
* [pointsTexture](ellipsepointmarker3d.md#pointstexture)
* [size](ellipsepointmarker3d.md#size)

## Constructors

###  constructor

\+ **new EllipsePointMarker3D**(`webAssemblyContext`: TSciChart3D, `options?`: [IBasePointMarker3DOptions](../interfaces/ibasepointmarker3doptions.md)): *[EllipsePointMarker3D](ellipsepointmarker3d.md)*

*Overrides void*

*Defined in [src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts:71](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts#L71)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [IBasePointMarker3DOptions](../interfaces/ibasepointmarker3doptions.md) |

**Returns:** *[EllipsePointMarker3D](ellipsepointmarker3d.md)*

## Properties

### `Readonly` propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[propertyChanged](basepointmarker3d.md#readonly-propertychanged)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L31)*

## Accessors

###  fill

• **get fill**(): *string*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[fill](basepointmarker3d.md#fill)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L45)*

**Returns:** *string*

• **set fill**(`fill`: string): *void*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[fill](basepointmarker3d.md#fill)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:48](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L48)*

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

*Defined in [src/Charting3D/Visuals/PointMarkers/BaseTexturePointMarker3D.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BaseTexturePointMarker3D.ts#L13)*

Defines the MarkerType, e.g. pixel point marker, Mesh (3d object) or textured-quad

**Returns:** *[EMarkerType](../enums/emarkertype.md)*

___

###  pointsTexture

• **get pointsTexture**(): *TSRTexture*

*Overrides [BaseTexturePointMarker3D](basetexturepointmarker3d.md).[pointsTexture](basetexturepointmarker3d.md#pointstexture)*

*Defined in [src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts:76](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts#L76)*

**Returns:** *TSRTexture*

___

###  size

• **get size**(): *number*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[size](basepointmarker3d.md#size)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L53)*

**Returns:** *number*

• **set size**(`size`: number): *void*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[size](basepointmarker3d.md#size)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:56](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`size` | number |

**Returns:** *void*
