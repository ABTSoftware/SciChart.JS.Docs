[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [SpherePointMarker3D](spherepointmarker3d.md)

# Class: SpherePointMarker3D

## Hierarchy

  ↳ [BaseMeshPointMarker3D](basemeshpointmarker3d.md)

  ↳ **SpherePointMarker3D**

## Index

### Constructors

* [constructor](spherepointmarker3d.md#constructor)

### Properties

* [propertyChanged](spherepointmarker3d.md#readonly-propertychanged)

### Accessors

* [fill](spherepointmarker3d.md#fill)
* [markerType](spherepointmarker3d.md#markertype)
* [pointsMesh](spherepointmarker3d.md#pointsmesh)
* [size](spherepointmarker3d.md#size)

## Constructors

###  constructor

\+ **new SpherePointMarker3D**(`webAssemblyContext`: TSciChart3D, `options?`: [IBasePointMarker3DOptions](../interfaces/ibasepointmarker3doptions.md)): *[SpherePointMarker3D](spherepointmarker3d.md)*

*Overrides void*

*Defined in [src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts:8](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [IBasePointMarker3DOptions](../interfaces/ibasepointmarker3doptions.md) |

**Returns:** *[SpherePointMarker3D](spherepointmarker3d.md)*

## Properties

### `Readonly` propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[propertyChanged](basepointmarker3d.md#readonly-propertychanged)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L31)*

## Accessors

###  fill

• **get fill**(): *string*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[fill](basepointmarker3d.md#fill)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L45)*

**Returns:** *string*

• **set fill**(`fill`: string): *void*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[fill](basepointmarker3d.md#fill)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:48](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`fill` | string |

**Returns:** *void*

___

###  markerType

• **get markerType**(): *[EMarkerType](../enums/emarkertype.md)*

*Inherited from [BaseMeshPointMarker3D](basemeshpointmarker3d.md).[markerType](basemeshpointmarker3d.md#markertype)*

*Overrides [BasePointMarker3D](basepointmarker3d.md).[markerType](basepointmarker3d.md#markertype)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BaseMeshPointMarker3D.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BaseMeshPointMarker3D.ts#L13)*

Defines the MarkerType, e.g. pixel point marker, Mesh (3d object) or textured-quad

**Returns:** *[EMarkerType](../enums/emarkertype.md)*

___

###  pointsMesh

• **get pointsMesh**(): *TSRIndexedMesh*

*Overrides [BaseMeshPointMarker3D](basemeshpointmarker3d.md).[pointsMesh](basemeshpointmarker3d.md#pointsmesh)*

*Defined in [src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/DefaultPointMarkers.ts#L13)*

**Returns:** *TSRIndexedMesh*

___

###  size

• **get size**(): *number*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[size](basepointmarker3d.md#size)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L53)*

**Returns:** *number*

• **set size**(`size`: number): *void*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[size](basepointmarker3d.md#size)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:56](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`size` | number |

**Returns:** *void*
