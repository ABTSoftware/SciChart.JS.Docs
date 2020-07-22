[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [CameraController](cameracontroller.md)

# Class: CameraController

## Hierarchy

* **CameraController**

## Implements

* [ICameraController](../interfaces/icameracontroller.md)

## Index

### Constructors

* [constructor](cameracontroller.md#constructor)

### Properties

* [propertyChanged](cameracontroller.md#readonly-propertychanged)

### Accessors

* [aspectRatio](cameracontroller.md#aspectratio)
* [farClip](cameracontroller.md#farclip)
* [fieldOfView](cameracontroller.md#fieldofview)
* [forward](cameracontroller.md#forward)
* [id](cameracontroller.md#id)
* [isAttached](cameracontroller.md#isattached)
* [nearClip](cameracontroller.md#nearclip)
* [orbitalPitch](cameracontroller.md#orbitalpitch)
* [orbitalYaw](cameracontroller.md#orbitalyaw)
* [orthoHeight](cameracontroller.md#orthoheight)
* [orthoWidth](cameracontroller.md#orthowidth)
* [position](cameracontroller.md#position)
* [projectionMode](cameracontroller.md#projectionmode)
* [radius](cameracontroller.md#radius)
* [side](cameracontroller.md#side)
* [target](cameracontroller.md#target)
* [up](cameracontroller.md#up)
* [upGlobal](cameracontroller.md#upglobal)

### Methods

* [debugOutput](cameracontroller.md#debugoutput)
* [notifyPropertyChanged](cameracontroller.md#notifypropertychanged)
* [resetToDefaults](cameracontroller.md#resettodefaults)
* [toOrthogonal](cameracontroller.md#toorthogonal)
* [toPerspective](cameracontroller.md#toperspective)
* [updateEngineCamera](cameracontroller.md#updateenginecamera)

## Constructors

###  constructor

\+ **new CameraController**(`webAssemblyContext`: TSciChart3D, `options?`: [ICameraOptions](../interfaces/icameraoptions.md)): *[CameraController](cameracontroller.md)*

*Defined in [src/Charting3D/CameraController.ts:73](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L73)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |
`options?` | [ICameraOptions](../interfaces/icameraoptions.md) |

**Returns:** *[CameraController](cameracontroller.md)*

## Properties

### `Readonly` propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Implementation of [ICameraController](../interfaces/icameracontroller.md).[propertyChanged](../interfaces/icameracontroller.md#propertychanged)*

*Defined in [src/Charting3D/CameraController.ts:59](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L59)*

## Accessors

###  aspectRatio

• **get aspectRatio**(): *number*

*Defined in [src/Charting3D/CameraController.ts:126](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L126)*

**Returns:** *number*

• **set aspectRatio**(`value`: number): *void*

*Defined in [src/Charting3D/CameraController.ts:130](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L130)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  farClip

• **get farClip**(): *number*

*Defined in [src/Charting3D/CameraController.ts:210](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L210)*

**Returns:** *number*

• **set farClip**(`value`: number): *void*

*Defined in [src/Charting3D/CameraController.ts:213](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L213)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  fieldOfView

• **get fieldOfView**(): *number*

*Defined in [src/Charting3D/CameraController.ts:226](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L226)*

**Returns:** *number*

• **set fieldOfView**(`value`: number): *void*

*Defined in [src/Charting3D/CameraController.ts:229](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L229)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  forward

• **get forward**(): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/CameraController.ts:246](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L246)*

**Returns:** *[Vector3](vector3.md)*

___

###  id

• **get id**(): *string*

*Defined in [src/Charting3D/CameraController.ts:85](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L85)*

**Returns:** *string*

• **set id**(`value`: string): *void*

*Defined in [src/Charting3D/CameraController.ts:88](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L88)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  isAttached

• **get isAttached**(): *boolean*

*Defined in [src/Charting3D/CameraController.ts:139](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L139)*

**Returns:** *boolean*

• **set isAttached**(`value`: boolean): *void*

*Defined in [src/Charting3D/CameraController.ts:142](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  nearClip

• **get nearClip**(): *number*

*Defined in [src/Charting3D/CameraController.ts:218](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L218)*

**Returns:** *number*

• **set nearClip**(`value`: number): *void*

*Defined in [src/Charting3D/CameraController.ts:221](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L221)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  orbitalPitch

• **get orbitalPitch**(): *number*

*Defined in [src/Charting3D/CameraController.ts:165](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L165)*

**Returns:** *number*

• **set orbitalPitch**(`value`: number): *void*

*Defined in [src/Charting3D/CameraController.ts:168](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L168)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  orbitalYaw

• **get orbitalYaw**(): *number*

*Defined in [src/Charting3D/CameraController.ts:188](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L188)*

**Returns:** *number*

• **set orbitalYaw**(`value`: number): *void*

*Defined in [src/Charting3D/CameraController.ts:191](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L191)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  orthoHeight

• **get orthoHeight**(): *number*

*Defined in [src/Charting3D/CameraController.ts:93](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L93)*

**Returns:** *number*

• **set orthoHeight**(`value`: number): *void*

*Defined in [src/Charting3D/CameraController.ts:96](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L96)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  orthoWidth

• **get orthoWidth**(): *number*

*Defined in [src/Charting3D/CameraController.ts:104](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L104)*

**Returns:** *number*

• **set orthoWidth**(`value`: number): *void*

*Defined in [src/Charting3D/CameraController.ts:107](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L107)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  position

• **get position**(): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/CameraController.ts:281](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L281)*

**Returns:** *[Vector3](vector3.md)*

• **set position**(`value`: [Vector3](vector3.md)): *void*

*Defined in [src/Charting3D/CameraController.ts:284](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L284)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vector3](vector3.md) |

**Returns:** *void*

___

###  projectionMode

• **get projectionMode**(): *[ECameraProjectionMode](../enums/ecameraprojectionmode.md)*

*Defined in [src/Charting3D/CameraController.ts:115](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L115)*

**Returns:** *[ECameraProjectionMode](../enums/ecameraprojectionmode.md)*

• **set projectionMode**(`value`: [ECameraProjectionMode](../enums/ecameraprojectionmode.md)): *void*

*Defined in [src/Charting3D/CameraController.ts:118](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L118)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ECameraProjectionMode](../enums/ecameraprojectionmode.md) |

**Returns:** *void*

___

###  radius

• **get radius**(): *number*

*Defined in [src/Charting3D/CameraController.ts:147](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L147)*

**Returns:** *number*

• **set radius**(`value`: number): *void*

*Defined in [src/Charting3D/CameraController.ts:152](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L152)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  side

• **get side**(): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/CameraController.ts:238](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L238)*

**Returns:** *[Vector3](vector3.md)*

___

###  target

• **get target**(): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/CameraController.ts:259](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L259)*

**Returns:** *[Vector3](vector3.md)*

• **set target**(`value`: [Vector3](vector3.md)): *void*

*Defined in [src/Charting3D/CameraController.ts:262](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L262)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [Vector3](vector3.md) |

**Returns:** *void*

___

###  up

• **get up**(): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/CameraController.ts:252](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L252)*

**Returns:** *[Vector3](vector3.md)*

___

###  upGlobal

• **get upGlobal**(): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/CameraController.ts:234](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L234)*

**Returns:** *[Vector3](vector3.md)*

## Methods

###  debugOutput

▸ **debugOutput**(): *void*

*Implementation of [ICameraController](../interfaces/icameracontroller.md)*

*Defined in [src/Charting3D/CameraController.ts:386](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L386)*

**Returns:** *void*

___

###  notifyPropertyChanged

▸ **notifyPropertyChanged**(`propertyName`: string): *void*

*Defined in [src/Charting3D/CameraController.ts:382](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L382)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*

___

###  resetToDefaults

▸ **resetToDefaults**(): *void*

*Implementation of [ICameraController](../interfaces/icameracontroller.md)*

*Defined in [src/Charting3D/CameraController.ts:325](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L325)*

**Returns:** *void*

___

###  toOrthogonal

▸ **toOrthogonal**(): *void*

*Implementation of [ICameraController](../interfaces/icameracontroller.md)*

*Defined in [src/Charting3D/CameraController.ts:303](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L303)*

**Returns:** *void*

___

###  toPerspective

▸ **toPerspective**(): *void*

*Implementation of [ICameraController](../interfaces/icameracontroller.md)*

*Defined in [src/Charting3D/CameraController.ts:315](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L315)*

**Returns:** *void*

___

###  updateEngineCamera

▸ **updateEngineCamera**(`tsrCamera`: TSRCamera): *void*

*Implementation of [ICameraController](../interfaces/icameracontroller.md)*

*Defined in [src/Charting3D/CameraController.ts:349](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L349)*

**Parameters:**

Name | Type |
------ | ------ |
`tsrCamera` | TSRCamera |

**Returns:** *void*
