[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [ICameraController](icameracontroller.md)

# Interface: ICameraController

## Hierarchy

* **ICameraController**

## Implemented by

* [CameraController](../classes/cameracontroller.md)

## Index

### Properties

* [aspectRatio](icameracontroller.md#aspectratio)
* [farClip](icameracontroller.md#farclip)
* [fieldOfView](icameracontroller.md#fieldofview)
* [forward](icameracontroller.md#readonly-forward)
* [id](icameracontroller.md#id)
* [isAttached](icameracontroller.md#isattached)
* [nearClip](icameracontroller.md#nearclip)
* [orbitalPitch](icameracontroller.md#orbitalpitch)
* [orbitalYaw](icameracontroller.md#orbitalyaw)
* [orthoHeight](icameracontroller.md#orthoheight)
* [orthoWidth](icameracontroller.md#orthowidth)
* [position](icameracontroller.md#position)
* [projectionMode](icameracontroller.md#projectionmode)
* [propertyChanged](icameracontroller.md#propertychanged)
* [radius](icameracontroller.md#radius)
* [side](icameracontroller.md#readonly-side)
* [target](icameracontroller.md#target)
* [up](icameracontroller.md#readonly-up)
* [upGlobal](icameracontroller.md#readonly-upglobal)

### Methods

* [debugOutput](icameracontroller.md#debugoutput)
* [resetToDefaults](icameracontroller.md#resettodefaults)
* [toOrthogonal](icameracontroller.md#toorthogonal)
* [toPerspective](icameracontroller.md#toperspective)
* [updateEngineCamera](icameracontroller.md#updateenginecamera)

## Properties

###  aspectRatio

• **aspectRatio**: *number*

*Defined in [src/Charting3D/CameraController.ts:45](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L45)*

___

###  farClip

• **farClip**: *number*

*Defined in [src/Charting3D/CameraController.ts:41](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L41)*

___

###  fieldOfView

• **fieldOfView**: *number*

*Defined in [src/Charting3D/CameraController.ts:39](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L39)*

___

### `Readonly` forward

• **forward**: *[Vector3](../classes/vector3.md)*

*Defined in [src/Charting3D/CameraController.ts:36](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L36)*

___

###  id

• **id**: *string*

*Defined in [src/Charting3D/CameraController.ts:32](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L32)*

___

###  isAttached

• **isAttached**: *boolean*

*Defined in [src/Charting3D/CameraController.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L46)*

___

###  nearClip

• **nearClip**: *number*

*Defined in [src/Charting3D/CameraController.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L40)*

___

###  orbitalPitch

• **orbitalPitch**: *number*

*Defined in [src/Charting3D/CameraController.ts:43](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L43)*

___

###  orbitalYaw

• **orbitalYaw**: *number*

*Defined in [src/Charting3D/CameraController.ts:42](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L42)*

___

###  orthoHeight

• **orthoHeight**: *number*

*Defined in [src/Charting3D/CameraController.ts:49](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L49)*

___

###  orthoWidth

• **orthoWidth**: *number*

*Defined in [src/Charting3D/CameraController.ts:48](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L48)*

___

###  position

• **position**: *[Vector3](../classes/vector3.md)*

*Defined in [src/Charting3D/CameraController.ts:33](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L33)*

___

###  projectionMode

• **projectionMode**: *[ECameraProjectionMode](../enums/ecameraprojectionmode.md)*

*Defined in [src/Charting3D/CameraController.ts:47](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L47)*

___

###  propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Defined in [src/Charting3D/CameraController.ts:31](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L31)*

___

###  radius

• **radius**: *number*

*Defined in [src/Charting3D/CameraController.ts:44](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L44)*

___

### `Readonly` side

• **side**: *[Vector3](../classes/vector3.md)*

*Defined in [src/Charting3D/CameraController.ts:37](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L37)*

___

###  target

• **target**: *[Vector3](../classes/vector3.md)*

*Defined in [src/Charting3D/CameraController.ts:34](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L34)*

___

### `Readonly` up

• **up**: *[Vector3](../classes/vector3.md)*

*Defined in [src/Charting3D/CameraController.ts:35](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L35)*

___

### `Readonly` upGlobal

• **upGlobal**: *[Vector3](../classes/vector3.md)*

*Defined in [src/Charting3D/CameraController.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L38)*

## Methods

###  debugOutput

▸ **debugOutput**(): *void*

*Defined in [src/Charting3D/CameraController.ts:55](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L55)*

**Returns:** *void*

___

###  resetToDefaults

▸ **resetToDefaults**(): *void*

*Defined in [src/Charting3D/CameraController.ts:52](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L52)*

**Returns:** *void*

___

###  toOrthogonal

▸ **toOrthogonal**(): *void*

*Defined in [src/Charting3D/CameraController.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L50)*

**Returns:** *void*

___

###  toPerspective

▸ **toPerspective**(): *void*

*Defined in [src/Charting3D/CameraController.ts:51](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L51)*

**Returns:** *void*

___

###  updateEngineCamera

▸ **updateEngineCamera**(`tsrCamera`: TSRCamera): *void*

*Defined in [src/Charting3D/CameraController.ts:53](https://github.com/ABTSoftware/SciChart.Dev/blob/ff9f38d289/Web/src/SciChart/src/Charting3D/CameraController.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`tsrCamera` | TSRCamera |

**Returns:** *void*
