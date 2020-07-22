[SciChart.js Documentation - v0.0.6](../README.md) › [Globals](../globals.md) › [ModifierArgsBase](modifierargsbase.md)

# Class: ModifierArgsBase

The base class for arguments passed to [ChartModifierBase](chartmodifierbase.md) methods

## Hierarchy

* **ModifierArgsBase**

  ↳ [ModifierMouseArgs](modifiermouseargs.md)

## Index

### Properties

* [handled](modifierargsbase.md#handled)

## Properties

###  handled

• **handled**: *boolean* = false

*Defined in [src/Charting/ChartModifiers/ModifierArgsBase.ts:13](https://github.com/ABTSoftware/SciChart.Dev/blob/272ab7fc7f/Web/src/SciChart/src/Charting/ChartModifiers/ModifierArgsBase.ts#L13)*

Gets or sets whether the event is handled

**`remarks`** 
Set handled to true if you want to prevent the event from propagating to subsequent modifiers in the
parent [SciChartSurfaceBase.chartModifiers](scichartsurfacebase.md#readonly-chartmodifiers) collection

If handled is true, the events no longer propagate. To override this behaviour set [ChartModifierBase.receiveHandledEvents](chartmodifierbase.md#receivehandledevents) to true
