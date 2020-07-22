[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [Vector3](vector3.md)

# Class: Vector3

## Hierarchy

* **Vector3**

## Index

### Constructors

* [constructor](vector3.md#constructor)

### Accessors

* [length](vector3.md#length)
* [x](vector3.md#x)
* [y](vector3.md#y)
* [z](vector3.md#z)
* [zero](vector3.md#static-zero)

### Methods

* [add](vector3.md#add)
* [crossProduct](vector3.md#crossproduct)
* [normalize](vector3.md#normalize)
* [scalarMultiply](vector3.md#scalarmultiply)
* [subtract](vector3.md#subtract)
* [toString](vector3.md#tostring)
* [toTsrVector3](vector3.md#totsrvector3)

## Constructors

###  constructor

\+ **new Vector3**(`x`: number, `y`: number, `z`: number): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/Vector3.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |
`z` | number |

**Returns:** *[Vector3](vector3.md)*

## Accessors

###  length

• **get length**(): *number*

*Defined in [src/Charting3D/Vector3.ts:56](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L56)*

**Returns:** *number*

___

###  x

• **get x**(): *number*

*Defined in [src/Charting3D/Vector3.ts:21](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L21)*

**Returns:** *number*

___

###  y

• **get y**(): *number*

*Defined in [src/Charting3D/Vector3.ts:25](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L25)*

**Returns:** *number*

___

###  z

• **get z**(): *number*

*Defined in [src/Charting3D/Vector3.ts:29](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L29)*

**Returns:** *number*

___

### `Static` zero

• **get zero**(): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/Vector3.ts:5](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L5)*

**Returns:** *[Vector3](vector3.md)*

## Methods

###  add

▸ **add**(`other`: [Vector3](vector3.md)): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/Vector3.ts:42](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | [Vector3](vector3.md) |

**Returns:** *[Vector3](vector3.md)*

___

###  crossProduct

▸ **crossProduct**(`rhs`: [Vector3](vector3.md)): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/Vector3.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`rhs` | [Vector3](vector3.md) |

**Returns:** *[Vector3](vector3.md)*

___

###  normalize

▸ **normalize**(): *void*

*Defined in [src/Charting3D/Vector3.ts:60](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L60)*

**Returns:** *void*

___

###  scalarMultiply

▸ **scalarMultiply**(`scalar`: number): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/Vector3.ts:46](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`scalar` | number |

**Returns:** *[Vector3](vector3.md)*

___

###  subtract

▸ **subtract**(`other`: [Vector3](vector3.md)): *[Vector3](vector3.md)*

*Defined in [src/Charting3D/Vector3.ts:38](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | [Vector3](vector3.md) |

**Returns:** *[Vector3](vector3.md)*

___

###  toString

▸ **toString**(): *string*

*Defined in [src/Charting3D/Vector3.ts:70](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L70)*

**Returns:** *string*

___

###  toTsrVector3

▸ **toTsrVector3**(`webAssemblyContext`: TSciChart3D): *TSRVector3*

*Defined in [src/Charting3D/Vector3.ts:33](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting3D/Vector3.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart3D |

**Returns:** *TSRVector3*
