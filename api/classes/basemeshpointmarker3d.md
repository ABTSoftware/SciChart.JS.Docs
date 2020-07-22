[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [BaseMeshPointMarker3D](basemeshpointmarker3d.md)

# Class: BaseMeshPointMarker3D

## Hierarchy

* [BasePointMarker3D](basepointmarker3d.md)

  ↳ **BaseMeshPointMarker3D**

  ↳ [SpherePointMarker3D](spherepointmarker3d.md)

  ↳ [CubePointMarker3D](cubepointmarker3d.md)

  ↳ [PyramidPointMarker3D](pyramidpointmarker3d.md)

  ↳ [CylinderPointMarker3D](cylinderpointmarker3d.md)

## Index

### Properties

* [propertyChanged](basemeshpointmarker3d.md#readonly-propertychanged)

### Accessors

* [fill](basemeshpointmarker3d.md#fill)
* [markerType](basemeshpointmarker3d.md#markertype)
* [pointsMesh](basemeshpointmarker3d.md#pointsmesh)
* [size](basemeshpointmarker3d.md#size)

## Properties

### `Readonly` propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[propertyChanged](basepointmarker3d.md#readonly-propertychanged)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L31)*

## Accessors

###  fill

• **get fill**(): *string*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[fill](basepointmarker3d.md#fill)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L45)*

**Returns:** *string*

• **set fill**(`fill`: string): *void*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[fill](basepointmarker3d.md#fill)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:48](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`fill` | string |

**Returns:** *void*

___

###  markerType

• **get markerType**(): *[EMarkerType](../enums/emarkertype.md)*

*Overrides [BasePointMarker3D](basepointmarker3d.md).[markerType](basepointmarker3d.md#markertype)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BaseMeshPointMarker3D.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BaseMeshPointMarker3D.ts#L13)*

Defines the MarkerType, e.g. pixel point marker, Mesh (3d object) or textured-quad

**Returns:** *[EMarkerType](../enums/emarkertype.md)*

___

###  pointsMesh

• **get pointsMesh**(): *TSRIndexedMesh*

*Defined in [src/Charting3D/Visuals/PointMarkers/BaseMeshPointMarker3D.ts:20](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BaseMeshPointMarker3D.ts#L20)*

Returns the TSRIndexedMesh instance which defines the 3D geometry to draw at each location or point

**Returns:** *TSRIndexedMesh*

___

###  size

• **get size**(): *number*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[size](basepointmarker3d.md#size)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L53)*

**Returns:** *number*

• **set size**(`size`: number): *void*

*Inherited from [BasePointMarker3D](basepointmarker3d.md).[size](basepointmarker3d.md#size)*

*Defined in [src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts:56](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/PointMarkers/BasePointMarker3D.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`size` | number |

**Returns:** *void*
