[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [BaseSceneEntity3D](basesceneentity3d.md)

# Class: BaseSceneEntity3D ‹**TNativeEntity**›

## Type parameters

▪ **TNativeEntity**: *SCRTSceneEntity*

## Hierarchy

* **BaseSceneEntity3D**

  ↳ [RootSceneEntity](rootsceneentity.md)

  ↳ [AxisCubeEntity](axiscubeentity.md)

  ↳ [GizmoEntity](gizmoentity.md)

  ↳ [ScatterPointsSceneEntity](scatterpointssceneentity.md)

  ↳ [SurfaceMeshSceneEntity](surfacemeshsceneentity.md)

## Implements

* [IBaseSceneEntity](../interfaces/ibasesceneentity.md)

## Index

### Properties

* [children](basesceneentity3d.md#readonly-children)
* [isDirty](basesceneentity3d.md#isdirty)
* [isVisible](basesceneentity3d.md#isvisible)
* [parent](basesceneentity3d.md#parent)
* [rootSceneEntity](basesceneentity3d.md#readonly-rootsceneentity)
* [type](basesceneentity3d.md#readonly-abstract-type)

### Accessors

* [entityId](basesceneentity3d.md#entityid)
* [nativeEntity](basesceneentity3d.md#nativeentity)

### Methods

* [Render](basesceneentity3d.md#render)
* [Update](basesceneentity3d.md#update)
* [delete](basesceneentity3d.md#delete)
* [getEntity](basesceneentity3d.md#getentity)
* [invalidateScene](basesceneentity3d.md#invalidatescene)
* [notifySeriesPropertyChanged](basesceneentity3d.md#abstract-notifyseriespropertychanged)
* [onAttached](basesceneentity3d.md#onattached)
* [onDetached](basesceneentity3d.md#ondetached)
* [onEngineRestart](basesceneentity3d.md#onenginerestart)
* [setRenderPassData](basesceneentity3d.md#setrenderpassdata)
* [visitEntities](basesceneentity3d.md#visitentities)

## Properties

### `Readonly` children

• **children**: *ObservableArray‹[IBaseSceneEntity](../interfaces/ibasesceneentity.md)›*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md).[children](../interfaces/ibasesceneentity.md#readonly-children)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L31)*

___

###  isDirty

• **isDirty**: *boolean*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md).[isDirty](../interfaces/ibasesceneentity.md#isdirty)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:32](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L32)*

___

###  isVisible

• **isVisible**: *boolean* = true

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md).[isVisible](../interfaces/ibasesceneentity.md#isvisible)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:33](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L33)*

___

###  parent

• **parent**: *[IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md).[parent](../interfaces/ibasesceneentity.md#parent)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L34)*

___

### `Readonly` rootSceneEntity

• **rootSceneEntity**: *[RootSceneEntity](rootsceneentity.md)*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md).[rootSceneEntity](../interfaces/ibasesceneentity.md#rootsceneentity)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L30)*

___

### `Readonly` `Abstract` type

• **type**: *ESceneEntityType*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md).[type](../interfaces/ibasesceneentity.md#readonly-type)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:29](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L29)*

## Accessors

###  entityId

• **get entityId**(): *number*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:103](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L103)*

**Returns:** *number*

• **set entityId**(`value`: number): *void*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:107](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L107)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  nativeEntity

• **get nativeEntity**(): *TNativeEntity*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:151](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L151)*

**Returns:** *TNativeEntity*

## Methods

###  Render

▸ **Render**(): *void*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:88](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L88)*

Render method called from WebAssembly engine. Use this to do immediate-mode 3D drawing, or to draw created meshes
When overriding, you must call super.Update() for the object to draw in the scene

**Returns:** *void*

___

###  Update

▸ **Update**(`deltaTime`: number): *void*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:72](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L72)*

Update method called from WebAssembly engine. Use this to update meshes, properties, geometry before draw.
When overriding, you must call super.Update() for the object to draw in the scene

**Parameters:**

Name | Type |
------ | ------ |
`deltaTime` | number |

**Returns:** *void*

___

###  delete

▸ **delete**(): *void*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:62](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L62)*

**Returns:** *void*

___

###  getEntity

▸ **getEntity**(`type`: ESceneEntityType): *[IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:116](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L116)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | ESceneEntityType |

**Returns:** *[IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

___

###  invalidateScene

▸ **invalidateScene**(): *void*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:127](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L127)*

**Returns:** *void*

___

### `Abstract` notifySeriesPropertyChanged

▸ **notifySeriesPropertyChanged**(`propertyName`: string): *void*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:60](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L60)*

Called when a property changes on the parent series

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`propertyName` | string |   |

**Returns:** *void*

___

###  onAttached

▸ **onAttached**(): *void*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:131](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L131)*

**Returns:** *void*

___

###  onDetached

▸ **onDetached**(): *void*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:140](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L140)*

**Returns:** *void*

___

###  onEngineRestart

▸ **onEngineRestart**(): *void*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:98](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L98)*

**Returns:** *void*

___

###  setRenderPassData

▸ **setRenderPassData**(`rpd`: [RenderPassInfo3D](renderpassinfo3d.md)): *void*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:112](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`rpd` | [RenderPassInfo3D](renderpassinfo3d.md) |

**Returns:** *void*

___

###  visitEntities

▸ **visitEntities**(`operation`: function): *void*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:144](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L144)*

**Parameters:**

▪ **operation**: *function*

▸ (`e`: [IBaseSceneEntity](../interfaces/ibasesceneentity.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`e` | [IBaseSceneEntity](../interfaces/ibasesceneentity.md) |

**Returns:** *void*
