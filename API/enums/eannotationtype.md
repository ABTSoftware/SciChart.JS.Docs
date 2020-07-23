[SciChart JS API - v0.0.6](../README.md) › [Globals](../globals.md) › [EAnnotationType](eannotationtype.md)

# Enumeration: EAnnotationType

Defines the type of [Annotation](../interfaces/iannotation.md).
Annotations are overlays or markers added to the [SciChartSurface.annotations](../classes/scichartsurface.md#readonly-annotations) collection

## Index

### Enumeration members

* [RenderContext](eannotationtype.md#rendercontext)
* [SVG](eannotationtype.md#svg)

## Enumeration members

###  RenderContext

• **RenderContext**:

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:41](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L41)*

The [Annotation](../interfaces/iannotation.md) is a [RenderContextAnnotation](../classes/rendercontextannotationbase.md)

**`remarks`** 
[RenderContextAnnotations](../classes/rendercontextannotationbase.md) are drawn on the
[Javascript chart](https://www.scichart.com/javascript-chart-features) using WebGL2 where available.
They differ from [SvgAnnotations](../classes/svgannotation.md) which use slower,
but more flexible SVG to draw annotations on the chart

___

###  SVG

• **SVG**:

*Defined in [src/Charting/Visuals/Annotations/IAnnotation.ts:50](https://github.com/ABTSoftware/SciChart.Dev/blob/f6fba97af2/Web/src/SciChart/src/Charting/Visuals/Annotations/IAnnotation.ts#L50)*

The Annotation is an [SvgAnnotation](../classes/svgannotation.md)

**`remarks`** 
[SvgAnnotations](../classes/svgannotation.md) are drawn using SVG where available.
This allows for more flexible annotations over the
[Javascript Chart](https://www.scichart.com/javascript-chart-features),
such as text or other custom shapes
