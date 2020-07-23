[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [GizmoEntity](gizmoentity.md)

# Class: GizmoEntity

## Hierarchy

* [BaseSceneEntity3D](basesceneentity3d.md)‹SCRTXyzGizmoEntity›

  ↳ **GizmoEntity**

## Implements

* [IBaseSceneEntity](../interfaces/ibasesceneentity.md)

## Index

### Constructors

* [constructor](gizmoentity.md#constructor)

### Properties

* [children](gizmoentity.md#readonly-children)
* [isDirty](gizmoentity.md#isdirty)
* [isVisible](gizmoentity.md#isvisible)
* [parent](gizmoentity.md#parent)
* [rootSceneEntity](gizmoentity.md#readonly-rootsceneentity)
* [type](gizmoentity.md#readonly-type)

### Accessors

* [enableGizmo](gizmoentity.md#enablegizmo)
* [entityId](gizmoentity.md#entityid)
* [nativeEntity](gizmoentity.md#nativeentity)

### Methods

* [Render](gizmoentity.md#render)
* [Update](gizmoentity.md#update)
* [delete](gizmoentity.md#delete)
* [getEntity](gizmoentity.md#getentity)
* [invalidateScene](gizmoentity.md#invalidatescene)
* [notifySeriesPropertyChanged](gizmoentity.md#notifyseriespropertychanged)
* [onAttached](gizmoentity.md#onattached)
* [onDetached](gizmoentity.md#ondetached)
* [onEngineRestart](gizmoentity.md#onenginerestart)
* [setRenderPassData](gizmoentity.md#setrenderpassdata)
* [visitEntities](gizmoentity.md#visitentities)

## Constructors

###  constructor

\+ **new GizmoEntity**(`webAssemblyContext`: TSciChart3D): *[GizmoEntity](gizmoentity.md)*

*Overrides void*

*Defined in [src/Charting3D/Visuals/GizmoEntity.ts:6](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/GizmoEntity.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |

**Returns:** *[GizmoEntity](gizmoentity.md)*

## Properties

### `Readonly` children

• **children**: *ObservableArray‹[IBaseSceneEntity](../interfaces/ibasesceneentity.md)›*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md).[children](../interfaces/ibasesceneentity.md#readonly-children)*

*Inherited from [RootSceneEntity](rootsceneentity.md).[children](rootsceneentity.md#readonly-children)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L31)*

___

###  isDirty

• **isDirty**: *boolean*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md).[isDirty](../interfaces/ibasesceneentity.md#isdirty)*

*Inherited from [RootSceneEntity](rootsceneentity.md).[isDirty](rootsceneentity.md#isdirty)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:32](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L32)*

___

###  isVisible

• **isVisible**: *boolean* = true

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md).[isVisible](../interfaces/ibasesceneentity.md#isvisible)*

*Inherited from [RootSceneEntity](rootsceneentity.md).[isVisible](rootsceneentity.md#isvisible)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:33](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L33)*

___

###  parent

• **parent**: *[IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md).[parent](../interfaces/ibasesceneentity.md#parent)*

*Inherited from [RootSceneEntity](rootsceneentity.md).[parent](rootsceneentity.md#parent)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L34)*

___

### `Readonly` rootSceneEntity

• **rootSceneEntity**: *[RootSceneEntity](rootsceneentity.md)*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md).[rootSceneEntity](../interfaces/ibasesceneentity.md#rootsceneentity)*

*Inherited from [RootSceneEntity](rootsceneentity.md).[rootSceneEntity](rootsceneentity.md#readonly-rootsceneentity)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:30](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L30)*

___

### `Readonly` type

• **type**: *ESceneEntityType* = ESceneEntityType.GizmoEntity

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md).[type](../interfaces/ibasesceneentity.md#readonly-type)*

*Overrides [BaseSceneEntity3D](basesceneentity3d.md).[type](basesceneentity3d.md#readonly-abstract-type)*

*Defined in [src/Charting3D/Visuals/GizmoEntity.ts:6](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/GizmoEntity.ts#L6)*

## Accessors

###  enableGizmo

• **get enableGizmo**(): *boolean*

*Defined in [src/Charting3D/Visuals/GizmoEntity.ts:18](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/GizmoEntity.ts#L18)*

**Returns:** *boolean*

• **set enableGizmo**(`isEnabled`: boolean): *void*

*Defined in [src/Charting3D/Visuals/GizmoEntity.ts:22](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/GizmoEntity.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`isEnabled` | boolean |

**Returns:** *void*

___

###  entityId

• **get entityId**(): *number*

*Inherited from [RootSceneEntity](rootsceneentity.md).[entityId](rootsceneentity.md#entityid)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:103](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L103)*

**Returns:** *number*

• **set entityId**(`value`: number): *void*

*Inherited from [RootSceneEntity](rootsceneentity.md).[entityId](rootsceneentity.md#entityid)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:107](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L107)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  nativeEntity

• **get nativeEntity**(): *SCRTXyzGizmoEntity*

*Inherited from [RootSceneEntity](rootsceneentity.md).[nativeEntity](rootsceneentity.md#nativeentity)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:151](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L151)*

**Returns:** *SCRTXyzGizmoEntity*

## Methods

###  Render

▸ **Render**(): *void*

*Inherited from [RootSceneEntity](rootsceneentity.md).[Render](rootsceneentity.md#render)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:88](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L88)*

Render method called from WebAssembly engine. Use this to do immediate-mode 3D drawing, or to draw created meshes
When overriding, you must call super.Update() for the object to draw in the scene

**Returns:** *void*

___

###  Update

▸ **Update**(`deltaTime`: number): *void*

*Inherited from [RootSceneEntity](rootsceneentity.md).[Update](rootsceneentity.md#update)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:72](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L72)*

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

*Inherited from [BaseSceneEntity3D](basesceneentity3d.md).[delete](basesceneentity3d.md#delete)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:62](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L62)*

**Returns:** *void*

___

###  getEntity

▸ **getEntity**(`type`: ESceneEntityType): *[IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Inherited from [RootSceneEntity](rootsceneentity.md).[getEntity](rootsceneentity.md#getentity)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:116](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L116)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | ESceneEntityType |

**Returns:** *[IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

___

###  invalidateScene

▸ **invalidateScene**(): *void*

*Inherited from [RootSceneEntity](rootsceneentity.md).[invalidateScene](rootsceneentity.md#invalidatescene)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:127](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L127)*

**Returns:** *void*

___

###  notifySeriesPropertyChanged

▸ **notifySeriesPropertyChanged**(`propertyName`: string): *void*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Overrides [BaseSceneEntity3D](basesceneentity3d.md).[notifySeriesPropertyChanged](basesceneentity3d.md#abstract-notifyseriespropertychanged)*

*Defined in [src/Charting3D/Visuals/GizmoEntity.ts:14](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/GizmoEntity.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*

___

###  onAttached

▸ **onAttached**(): *void*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Inherited from [RootSceneEntity](rootsceneentity.md).[onAttached](rootsceneentity.md#onattached)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:131](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L131)*

**Returns:** *void*

___

###  onDetached

▸ **onDetached**(): *void*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Inherited from [RootSceneEntity](rootsceneentity.md).[onDetached](rootsceneentity.md#ondetached)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:140](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L140)*

**Returns:** *void*

___

###  onEngineRestart

▸ **onEngineRestart**(): *void*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Inherited from [RootSceneEntity](rootsceneentity.md).[onEngineRestart](rootsceneentity.md#onenginerestart)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:98](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L98)*

**Returns:** *void*

___

###  setRenderPassData

▸ **setRenderPassData**(`rpd`: [RenderPassInfo3D](renderpassinfo3d.md)): *void*

*Implementation of [IBaseSceneEntity](../interfaces/ibasesceneentity.md)*

*Inherited from [RootSceneEntity](rootsceneentity.md).[setRenderPassData](rootsceneentity.md#setrenderpassdata)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:112](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`rpd` | [RenderPassInfo3D](renderpassinfo3d.md) |

**Returns:** *void*

___

###  visitEntities

▸ **visitEntities**(`operation`: function): *void*

*Inherited from [RootSceneEntity](rootsceneentity.md).[visitEntities](rootsceneentity.md#visitentities)*

*Defined in [src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts:144](https://github.com/ABTSoftware/SciChart.Dev/blob/34ff3115c2/Web/src/SciChart/src/Charting3D/Visuals/Primitives/BaseSceneEntity3D.ts#L144)*

**Parameters:**

▪ **operation**: *function*

▸ (`e`: [IBaseSceneEntity](../interfaces/ibasesceneentity.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`e` | [IBaseSceneEntity](../interfaces/ibasesceneentity.md) |

**Returns:** *void*
