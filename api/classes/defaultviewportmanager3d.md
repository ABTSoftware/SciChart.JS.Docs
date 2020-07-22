[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [DefaultViewportManager3D](defaultviewportmanager3d.md)

# Class: DefaultViewportManager3D

## Hierarchy

* [ViewportManager3DBase](viewportmanager3dbase.md)

  ↳ **DefaultViewportManager3D**

## Index

### Properties

* [isAttached](defaultviewportmanager3d.md#isattached)
* [parentSurface](defaultviewportmanager3d.md#parentsurface)

### Methods

* [attachSciChartSurface](defaultviewportmanager3d.md#attachscichartsurface)
* [calculateAutoRange](defaultviewportmanager3d.md#calculateautorange)
* [detachSciChartSurface](defaultviewportmanager3d.md#detachscichartsurface)

## Properties

###  isAttached

• **isAttached**: *boolean*

*Inherited from [ViewportManager3DBase](viewportmanager3dbase.md).[isAttached](viewportmanager3dbase.md#isattached)*

*Defined in [tests/Charting3D/Visuals/ViewportManager3DBase.ts:7](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/tests/Charting3D/Visuals/ViewportManager3DBase.ts#L7)*

___

###  parentSurface

• **parentSurface**: *[SciChart3DSurface](scichart3dsurface.md)*

*Inherited from [ViewportManager3DBase](viewportmanager3dbase.md).[parentSurface](viewportmanager3dbase.md#parentsurface)*

*Defined in [tests/Charting3D/Visuals/ViewportManager3DBase.ts:8](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/tests/Charting3D/Visuals/ViewportManager3DBase.ts#L8)*

## Methods

###  attachSciChartSurface

▸ **attachSciChartSurface**(`scs`: [SciChart3DSurface](scichart3dsurface.md)): *void*

*Inherited from [ViewportManager3DBase](viewportmanager3dbase.md).[attachSciChartSurface](viewportmanager3dbase.md#attachscichartsurface)*

*Defined in [tests/Charting3D/Visuals/ViewportManager3DBase.ts:10](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/tests/Charting3D/Visuals/ViewportManager3DBase.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`scs` | [SciChart3DSurface](scichart3dsurface.md) |

**Returns:** *void*

___

###  calculateAutoRange

▸ **calculateAutoRange**(`axis`: [AxisBase3D](axisbase3d.md)): *NumberRange*

*Inherited from [ViewportManager3DBase](viewportmanager3dbase.md).[calculateAutoRange](viewportmanager3dbase.md#calculateautorange)*

*Defined in [tests/Charting3D/Visuals/ViewportManager3DBase.ts:23](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/tests/Charting3D/Visuals/ViewportManager3DBase.ts#L23)*

**Parameters:**

Name | Type |
------ | ------ |
`axis` | [AxisBase3D](axisbase3d.md) |

**Returns:** *NumberRange*

___

###  detachSciChartSurface

▸ **detachSciChartSurface**(): *void*

*Inherited from [ViewportManager3DBase](viewportmanager3dbase.md).[detachSciChartSurface](viewportmanager3dbase.md#detachscichartsurface)*

*Defined in [tests/Charting3D/Visuals/ViewportManager3DBase.ts:18](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/tests/Charting3D/Visuals/ViewportManager3DBase.ts#L18)*

**Returns:** *void*
