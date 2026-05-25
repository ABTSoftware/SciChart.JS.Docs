---
sidebar_position: 1
sidebar_label: Overview
---

# "scichart-financial-tools" Overview

`scichart-financial-tools` provides trading annotations, trading modifiers, trader themes, OHLC data filters and the label / snapping enums used by the examples in this section. The annotation types share [MultiPointAnnotationBase:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html), [PolyLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/polylineannotation.html), and [FreehandDrawingAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingannotation.html).

The annotations integrate with normal SciChart.js surfaces and axes, but their multi-point editing model lives in `scichart-financial-tools`. Use this page as the map; the individual pages contain the focused live examples.

```bash showLineNumbers
npm install scichart scichart-financial-tools
```

```ts showLineNumbers
import {
    ChannelAnnotation,
    EAnnotationVisibilityMode,
    ETradingAnnotationType,
    ExtendedLineAnnotation,
    FibonacciCirclesAnnotation,
    FibonacciExtensionAnnotation,
    FibonacciRetracementAnnotation,
    FibonacciSpeedResistanceArcsAnnotation,
    FibonacciWedgeAnnotation,
    FreehandDrawingAnnotation,
    FreehandDrawingModifier,
    MultiPointAnnotationBase,
    MultiPointAnnotationPlacementModifier,
    OhlcHeikinAshiFilter,
    OhlcRenkoFilter,
    PitchfanAnnotation,
    PitchforkAnnotation,
    PointAndFigureFilter,
    PolyLineAnnotation,
    SciTraderLightTheme,
    StopLossTakeProfitAnnotation
} from "scichart-financial-tools";
```

Hover and cursor feedback in the examples uses `AnnotationHoverModifier` from `scichart`.

## Annotation Types

| Annotation | Points | Main Use |
| --- | --- | --- |
| [PolyLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/polylineannotation.html) | 2 or more | Base concrete multi-point line / polygon annotation |
| [ChannelAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/channelannotation.html) | 3 placement points, 4 corners | Parallel ChannelAnnotation |
| [ExtendedLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/extendedlineannotation.html) | 2 | Trend line, ray or infinite line |
| [FlatBottomChannelAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/flatbottomchannelannotation.html) | 3 placement points, 4 corners | Channel with horizontal lower boundary |
| [DisjointChannelAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/disjointchannelannotation.html) | 3 placement points, 4 corners | Channel with the second side constrained from the first |
| [FibonacciRetracementAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html) | 2 by default, 3 in skewed mode | Retracement levels, regions and level labels |
| [FibonacciExtensionAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciextensionannotation.html) | 3 | Extension levels from a measured trend and start offset |
| [FibonacciCirclesAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonaccicirclesannotation.html) | 2 | Fibonacci circles or ovals from opposite corners |
| [FibonacciSpeedResistanceArcsAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonaccispeedresistancearcsannotation.html) | 2 | Concentric speed resistance arcs from a center and radius |
| [FibonacciWedgeAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciwedgeannotation.html) | 3 | Fibonacci arcs constrained inside a wedge |
| [PitchforkAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchforkannotation.html) | 3 | Andrews' Pitchfork with optional zones |
| [PitchfanAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchfanannotation.html) | 3 | Projected fan lines from pitchfork points |
| [MeasureAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/measureannotation.html) | 2 | Change between two points |
| [StopLossTakeProfitAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/stoplosstakeprofitannotation.html) | 2 | Stop-loss or take-profit zone |
| [FreehandDrawingAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingannotation.html) | Many sampled points | Editable freehand drawing stored as a polyline |

## Annotation Class Hierarchy

```mermaid
classDiagram
    MultiPointAnnotationBase <|-- PolyLineAnnotation
    PolyLineAnnotation <|-- FreehandDrawingAnnotation
    MultiPointAnnotationBase <|-- ExtendedLineAnnotation
    MultiPointAnnotationBase <|-- ChannelAnnotation
    ChannelAnnotation <|-- FlatBottomChannelAnnotation
    ChannelAnnotation <|-- DisjointChannelAnnotation
    MultiPointAnnotationBase <|-- PitchforkAnnotation
    PitchforkAnnotation <|-- PitchfanAnnotation
    MultiPointAnnotationBase <|-- MeasureAnnotation
    MultiPointAnnotationBase <|-- StopLossTakeProfitAnnotation
    MultiPointAnnotationBase <|-- FibonacciAnnotationBase
    FibonacciAnnotationBase <|-- FibonacciRetracementAnnotation
    FibonacciRetracementAnnotation <|-- FibonacciExtensionAnnotation
    FibonacciAnnotationBase <|-- FibonacciArcAnnotationBase
    FibonacciArcAnnotationBase <|-- FibonacciCirclesAnnotation
    FibonacciArcAnnotationBase <|-- FibonacciSpeedResistanceArcsAnnotation
    FibonacciArcAnnotationBase <|-- FibonacciWedgeAnnotation
```

## Modifiers

| Modifier | Main Use |
| --- | --- |
| [MultiPointAnnotationPlacementModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationplacementmodifier.html) | Click-to-place workflow for supported multi-point annotations. See [Placement and Editing](/scichart-extensions/scichart-financial-tools/modifiers/placement-and-editing/). |
| [MultiPointAnnotationEditorModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationeditormodifier.html) | Schema-driven editor panel for selected multi-point annotations. See [Annotation editor modifier](/scichart-extensions/scichart-financial-tools/modifiers/multipoint-annotation-editor-modifier/). |
| [FreehandDrawingModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingmodifier.html) | Captures pointer strokes and creates [FreehandDrawingAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingannotation.html) instances. See [Freehand drawing modifier](/scichart-extensions/scichart-financial-tools/modifiers/freehand-drawing-modifier/). |
| [SeriesValueModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/seriesvaluemodifier.html) | Adds y-axis markers that track latest / last-visible renderable series values. See [Series value modifier](/scichart-extensions/scichart-financial-tools/modifiers/series-value-modifier/). |

## Data Filters

| Filter | Main Use |
| --- | --- |
| [OhlcHeikinAshiFilter:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/ohlcheikinashifilter.html) | Converts OHLC candles to Heikin-Ashi candles |
| [OhlcRenkoFilter:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/ohlcrenkofilter.html) | Converts OHLC data into Renko bricks |
| [PointAndFigureFilter:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pointandfigurefilter.html) | Converts OHLC close values into Point & Figure marks |

See the individual data filter pages for live examples with source / filtered toggles:

- [Heikin-Ashi filter](/scichart-extensions/scichart-financial-tools/data-filters/heikin-ashi/)
- [Renko filter](/scichart-extensions/scichart-financial-tools/data-filters/renko/)
- [Point & Figure filter](/scichart-extensions/scichart-financial-tools/data-filters/point-and-figure/)

## Themes and Enums

[SciTraderDarkTheme:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/scitraderdarktheme.html) and [SciTraderLightTheme:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/scitraderlighttheme.html) provide financial-chart styling for examples and applications.

Common trading enum exports include:

- [ETradingAnnotationType:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/etradingannotationtype.html)
- [ETradingChartModifierType:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/etradingchartmodifiertype.html)
- [ELastYMode:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/elastymode.html)
- [EAnnotationVisibilityMode:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/eannotationvisibilitymode.html)
- [EMultiPointLabelAnchorMode:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/emultipointlabelanchormode.html#point)
- [EAxisLabelDrawMode:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/eaxislabeldrawmode.html)
- [ESegmentLabelRotationMode:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/esegmentlabelrotationmode.html)
- [ESnapMode:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/enums/esnapmode.html)

## Shared Labels

All annotations based on [MultiPointAnnotationBase:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html) inherit generic multi-point labels. See [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/) for the shared point, segment and axis label model, or open the individual trading annotation pages for live examples.

Some tools also have their own label systems:

- [Fibonacci annotations](/scichart-extensions/scichart-financial-tools/annotation-types/fibonacci-annotations/) have Fibonacci level labels and [formatFibonacciLabel:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciannotationbase.html#formatfibonaccilabel).
- [MeasureAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/measureannotation.html) has a measurement label and [labelDataTemplate:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/measureannotation.html#labeldatatemplate).
- [StopLossTakeProfitAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/stoplosstakeprofitannotation.html) automatically contributes Y-axis labels for entry and target levels.

For point, segment and axis label options, see [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/).

#### See Also

- [Multi-Point Labels Deep Dive](/scichart-extensions/scichart-financial-tools/annotation-types/multipoint-annotations/)
- [Placement and Editing](/scichart-extensions/scichart-financial-tools/modifiers/placement-and-editing/)
- [Annotation editor modifier](/scichart-extensions/scichart-financial-tools/modifiers/multipoint-annotation-editor-modifier/)
- [Series value modifier](/scichart-extensions/scichart-financial-tools/modifiers/series-value-modifier/)
- [Heikin-Ashi filter](/scichart-extensions/scichart-financial-tools/data-filters/heikin-ashi/)
- [Renko filter](/scichart-extensions/scichart-financial-tools/data-filters/renko/)
- [Point & Figure filter](/scichart-extensions/scichart-financial-tools/data-filters/point-and-figure/)
- [AnnotationHoverModifier](/2d-charts/annotations-api/annotation-hover/)
- [PolyLineAnnotation](/scichart-extensions/scichart-financial-tools/annotation-types/polyline-annotations/polyline-annotation/)
