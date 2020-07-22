[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [TextureManager](texturemanager.md)

# Class: TextureManager

## Hierarchy

* **TextureManager**

## Index

### Constructors

* [constructor](texturemanager.md#constructor)

### Methods

* [createAxisLabelsTexture](texturemanager.md#createaxislabelstexture)
* [createTextTexture](texturemanager.md#createtexttexture)

## Constructors

###  constructor

\+ **new TextureManager**(`webAssemblyContext`: TSciChart): *[TextureManager](texturemanager.md)*

*Defined in [src/Charting/Visuals/TextureManager/TextureManager.ts:28](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/TextureManager/TextureManager.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |

**Returns:** *[TextureManager](texturemanager.md)*

## Methods

###  createAxisLabelsTexture

▸ **createAxisLabelsTexture**(`tickLabels`: string[], `tickCoords`: number[], `labelStyle`: [TTextStyle](../globals.md#ttextstyle), `textureWidth`: number, `textureHeight`: number, `isAxisFlipped`: boolean, `axisAlignment`: EAxisAlignment, `tickSize`: number): *object*

*Defined in [src/Charting/Visuals/TextureManager/TextureManager.ts:56](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/TextureManager/TextureManager.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`tickLabels` | string[] |
`tickCoords` | number[] |
`labelStyle` | [TTextStyle](../globals.md#ttextstyle) |
`textureWidth` | number |
`textureHeight` | number |
`isAxisFlipped` | boolean |
`axisAlignment` | EAxisAlignment |
`tickSize` | number |

**Returns:** *object*

* **bitmapTexture**: *TSRTexture‹›* = testTexture

* **textureHeight**: *number* = 1

* **textureWidth**: *number* = 1

___

###  createTextTexture

▸ **createTextTexture**(`text`: string, `fontSizePx`: number, `fontFamily`: string, `color`: string): *object*

*Defined in [src/Charting/Visuals/TextureManager/TextureManager.ts:40](https://github.com/ABTSoftware/SciChart.Dev/blob/46671d21ce/Web/src/SciChart/src/Charting/Visuals/TextureManager/TextureManager.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |
`fontSizePx` | number |
`fontFamily` | string |
`color` | string |

**Returns:** *object*

* **bitmapTexture**: *TSRTexture‹›* = testTexture

* **textureHeight**: *number* = 1

* **textureWidth**: *number* = 1
