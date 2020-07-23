[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [IBaseSceneEntity](ibasesceneentity.md)

# Interface: IBaseSceneEntity

## Hierarchy

* IDeletable

  ↳ **IBaseSceneEntity**

## Implemented by

* [AxisCubeEntity](../classes/axiscubeentity.md)
* [BaseSceneEntity3D](../classes/basesceneentity3d.md)
* [GizmoEntity](../classes/gizmoentity.md)
* [RootSceneEntity](../classes/rootsceneentity.md)
* [ScatterPointsSceneEntity](../classes/scatterpointssceneentity.md)
* [SurfaceMeshSceneEntity](../classes/surfacemeshsceneentity.md)

## Index

### Properties

* [children](ibasesceneentity.md#readonly-children)
* [entityId](ibasesceneentity.md#entityid)
* [isDirty](ibasesceneentity.md#isdirty)
* [isVisible](ibasesceneentity.md#isvisible)
* [nativeEntity](ibasesceneentity.md#nativeentity)
* [parent](ibasesceneentity.md#parent)
* [rootSceneEntity](ibasesceneentity.md#rootsceneentity)
* [type](ibasesceneentity.md#readonly-type)

### Methods

* [delete](ibasesceneentity.md#delete)
* [getEntity](ibasesceneentity.md#getentity)
* [notifySeriesPropertyChanged](ibasesceneentity.md#notifyseriespropertychanged)
* [onAttached](ibasesceneentity.md#onattached)
* [onDetached](ibasesceneentity.md#ondetached)
* [onEngineRestart](ibasesceneentity.md#onenginerestart)
* [setRenderPassData](ibasesceneentity.md#setrenderpassdata)
* [visitEntities](ibasesceneentity.md#visitentities)

## Properties

### `Readonly` children

• **children**: *ObservableArray‹[IBaseSceneEntity](ibasesceneentity.md)›*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:11](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L11)*

___

###  entityId

• **entityId**: *number*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L12)*

___

###  isDirty

• **isDirty**: *boolean*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L14)*

___

###  isVisible

• **isVisible**: *boolean*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L13)*

___

###  nativeEntity

• **nativeEntity**: *SCRTSceneEntity*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:17](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L17)*

___

###  parent

• **parent**: *[IBaseSceneEntity](ibasesceneentity.md)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:15](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L15)*

___

###  rootSceneEntity

• **rootSceneEntity**: *[RootSceneEntity](../classes/rootsceneentity.md)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:16](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L16)*

___

### `Readonly` type

• **type**: *ESceneEntityType*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:10](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L10)*

## Methods

###  delete

▸ **delete**(): *void*

*Inherited from [IBrush2D](ibrush2d.md).[delete](ibrush2d.md#delete)*

*Defined in [src/Core/IDeletable.ts:12](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Core/IDeletable.ts#L12)*

Deletes native (WebAssembly) memory used by this type, after which it cannot be used.

**`remarks`** 
Call .delete() before finishing with the object to ensure that WebAssmembly memory leaks do
not occur.

All elements within SciChart's High Performance
[Realtime JavaScript Charts](https://www.scichart.com/javascript-chart-features) which implement
{@link IDeletable} must be deleted manually to free native (WebAssembly) memory

**Returns:** *void*

___

###  getEntity

▸ **getEntity**(`type`: ESceneEntityType): *[IBaseSceneEntity](ibasesceneentity.md)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | ESceneEntityType |

**Returns:** *[IBaseSceneEntity](ibasesceneentity.md)*

___

###  notifySeriesPropertyChanged

▸ **notifySeriesPropertyChanged**(`propertyName`: string): *void*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:19](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*

___

###  onAttached

▸ **onAttached**(): *void*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L22)*

**Returns:** *void*

___

###  onDetached

▸ **onDetached**(): *void*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L23)*

**Returns:** *void*

___

###  onEngineRestart

▸ **onEngineRestart**(): *void*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:24](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L24)*

**Returns:** *void*

___

###  setRenderPassData

▸ **setRenderPassData**(`rpd`: [RenderPassInfo3D](../classes/renderpassinfo3d.md)): *void*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`rpd` | [RenderPassInfo3D](../classes/renderpassinfo3d.md) |

**Returns:** *void*

___

###  visitEntities

▸ **visitEntities**(`operation`: function): *void*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:20](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L20)*

**Parameters:**

▪ **operation**: *function*

▸ (`e`: [IBaseSceneEntity](ibasesceneentity.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`e` | [IBaseSceneEntity](ibasesceneentity.md) |

**Returns:** *void*
