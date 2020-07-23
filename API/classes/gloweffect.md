[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [GlowEffect](gloweffect.md)

# Class: GlowEffect

## Hierarchy

* [ShaderEffect](shadereffect.md)

  ↳ **GlowEffect**

## Index

### Constructors

* [constructor](gloweffect.md#constructor)

### Properties

* [propertyChanged](gloweffect.md#propertychanged)

### Accessors

* [color](gloweffect.md#color)
* [intensity](gloweffect.md#intensity)
* [offset](gloweffect.md#offset)
* [range](gloweffect.md#range)

### Methods

* [getNativeEffect](gloweffect.md#getnativeeffect)
* [notifyPropertyChanged](gloweffect.md#notifypropertychanged)

## Constructors

###  constructor

\+ **new GlowEffect**(`webAssemblyContext`: TSciChart, `options?`: [IShaderEffectOptions](../interfaces/ishadereffectoptions.md)): *[GlowEffect](gloweffect.md)*

*Overrides void*

*Defined in [src/Charting/Visuals/RenderableSeries/GlowEffect.ts:4](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/GlowEffect.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`webAssemblyContext` | TSciChart |
`options?` | [IShaderEffectOptions](../interfaces/ishadereffectoptions.md) |

**Returns:** *[GlowEffect](gloweffect.md)*

## Properties

###  propertyChanged

• **propertyChanged**: *EventHandler‹PropertyChangedEventArgs›*

*Inherited from [ShaderEffect](shadereffect.md).[propertyChanged](shadereffect.md#propertychanged)*

*Defined in [src/Charting/Visuals/RenderableSeries/ShaderEffect.ts:20](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/ShaderEffect.ts#L20)*

## Accessors

###  color

• **get color**(): *string*

*Inherited from [ShaderEffect](shadereffect.md).[color](shadereffect.md#color)*

*Defined in [src/Charting/Visuals/RenderableSeries/ShaderEffect.ts:71](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/ShaderEffect.ts#L71)*

**Returns:** *string*

• **set color**(`color`: string): *void*

*Inherited from [ShaderEffect](shadereffect.md).[color](shadereffect.md#color)*

*Defined in [src/Charting/Visuals/RenderableSeries/ShaderEffect.ts:74](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/ShaderEffect.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`color` | string |

**Returns:** *void*

___

###  intensity

• **get intensity**(): *number*

*Inherited from [ShaderEffect](shadereffect.md).[intensity](shadereffect.md#intensity)*

*Defined in [src/Charting/Visuals/RenderableSeries/ShaderEffect.ts:51](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/ShaderEffect.ts#L51)*

**Returns:** *number*

• **set intensity**(`intensity`: number): *void*

*Inherited from [ShaderEffect](shadereffect.md).[intensity](shadereffect.md#intensity)*

*Defined in [src/Charting/Visuals/RenderableSeries/ShaderEffect.ts:54](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/ShaderEffect.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`intensity` | number |

**Returns:** *void*

___

###  offset

• **get offset**(): *Point*

*Inherited from [ShaderEffect](shadereffect.md).[offset](shadereffect.md#offset)*

*Defined in [src/Charting/Visuals/RenderableSeries/ShaderEffect.ts:60](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/ShaderEffect.ts#L60)*

**Returns:** *Point*

• **set offset**(`offset`: Point): *void*

*Inherited from [ShaderEffect](shadereffect.md).[offset](shadereffect.md#offset)*

*Defined in [src/Charting/Visuals/RenderableSeries/ShaderEffect.ts:63](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/ShaderEffect.ts#L63)*

**Parameters:**

Name | Type |
------ | ------ |
`offset` | Point |

**Returns:** *void*

___

###  range

• **get range**(): *number*

*Inherited from [ShaderEffect](shadereffect.md).[range](shadereffect.md#range)*

*Defined in [src/Charting/Visuals/RenderableSeries/ShaderEffect.ts:84](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/ShaderEffect.ts#L84)*

**Returns:** *number*

• **set range**(`range`: number): *void*

*Inherited from [ShaderEffect](shadereffect.md).[range](shadereffect.md#range)*

*Defined in [src/Charting/Visuals/RenderableSeries/ShaderEffect.ts:87](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/ShaderEffect.ts#L87)*

**Parameters:**

Name | Type |
------ | ------ |
`range` | number |

**Returns:** *void*

## Methods

###  getNativeEffect

▸ **getNativeEffect**(): *SCRTSeriesEffect*

*Inherited from [ShaderEffect](shadereffect.md).[getNativeEffect](shadereffect.md#getnativeeffect)*

*Defined in [src/Charting/Visuals/RenderableSeries/ShaderEffect.ts:47](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/ShaderEffect.ts#L47)*

**Returns:** *SCRTSeriesEffect*

___

###  notifyPropertyChanged

▸ **notifyPropertyChanged**(`propertyName`: string): *void*

*Inherited from [ShaderEffect](shadereffect.md).[notifyPropertyChanged](shadereffect.md#notifypropertychanged)*

*Defined in [src/Charting/Visuals/RenderableSeries/ShaderEffect.ts:93](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/RenderableSeries/ShaderEffect.ts#L93)*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string |

**Returns:** *void*
