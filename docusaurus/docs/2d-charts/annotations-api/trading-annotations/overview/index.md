---
sidebar_position: 1
sidebar_label: Trading annotations overview
---

# Trading Annotations Overview

Trading annotations are provided by the `scichart-financial-tools` package. This package also provides the shared [MultiPointAnnotationBase:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html), [PolyLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/polylineannotation.html), [FreehandDrawingAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingannotation.html), trading modifiers, trader themes, OHLC data filters and the label / snapping enums used by the examples in this section.

The annotations integrate with normal SciChart.js surfaces and axes, but their multi-point editing model lives in `scichart-financial-tools`. Use this page as the map; the individual pages contain the focused live examples.

```bash
npm install scichart scichart-financial-tools
```

```ts
import {
    ChannelAnnotation,
    EAnnotationVisibilityMode,
    ETradingAnnotationType,
    ExtendedLineAnnotation,
    FibonacciRetracementAnnotation,
    FreehandDrawingAnnotation,
    FreehandDrawingModifier,
    MultiPointAnnotationBase,
    MultiPointAnnotationPlacementModifier,
    PitchfanAnnotation,
    PitchforkAnnotation,
    PolyLineAnnotation,
    SciTraderLightTheme,
    StopLossTakeProfitAnnotation
} from "scichart-financial-tools";
```

Hover and cursor feedback in the examples uses `AnnotationHoverModifier` from `scichart`.

## Annotation Tools

| Annotation | Points | Main Use |
| --- | --- | --- |
| [PolyLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/polylineannotation.html) | 2 or more | Base concrete multi-point line / polygon annotation |
| [ChannelAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/channelannotation.html) | 3 placement points, 4 corners | Parallel price channel |
| [ExtendedLineAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/extendedlineannotation.html) | 2 | Trend line, ray or infinite line |
| [FlatBottomChannelAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/flatbottomchannelannotation.html) | 3 placement points, 4 corners | Channel with horizontal lower boundary |
| [DisjointChannelAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/disjointchannelannotation.html) | 3 placement points, 4 corners | Channel with the second side constrained from the first |
| [FibonacciRetracementAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html) | 3 | Retracement levels, regions and level labels |
| [PitchforkAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchforkannotation.html) | 3 | Andrews' Pitchfork with optional zones |
| [PitchfanAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pitchfanannotation.html) | 3 | Projected fan lines from pitchfork points |
| [MeasureAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/measureannotation.html) | 2 | Change between two points |
| [StopLossTakeProfitAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/stoplosstakeprofitannotation.html) | 2 | Stop-loss or take-profit zone |
| [FreehandDrawingAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingannotation.html) | Many sampled points | Editable freehand drawing stored as a polyline |

## Modifiers

| Modifier | Main Use |
| --- | --- |
| [MultiPointAnnotationPlacementModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationplacementmodifier.html) | Click-to-place workflow for supported multi-point annotations |
| [MultiPointAnnotationEditorModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationeditormodifier.html) | Schema-driven editor panel for selected multi-point annotations |
| [FreehandDrawingModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingmodifier.html) | Captures pointer strokes and creates [FreehandDrawingAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/freehanddrawingannotation.html) instances |
| [SeriesValueModifier:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/seriesvaluemodifier.html) | Adds y-axis markers that track latest / last-visible renderable series values |

## Financial Data Filters

| Filter | Main Use |
| --- | --- |
| [OhlcHeikinAshiFilter:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/ohlcheikinashifilter.html) | Converts OHLC candles to Heikin-Ashi candles |
| [OhlcRenkoFilter:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/ohlcrenkofilter.html) | Converts OHLC data into Renko bricks |
| [PointAndFigureFilter:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/pointandfigurefilter.html) | Converts OHLC close values into Point & Figure marks |

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

All annotations based on [MultiPointAnnotationBase:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/multipointannotationbase.html) inherit generic multi-point labels. See [Multi-Point Labels Deep Dive](/2d-charts/annotations-api/trading-annotations/multipoint-annotations/) for the shared point, segment and axis label model, or open the individual trading annotation pages for live examples.

Some tools also have their own label systems:

- [FibonacciRetracementAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html) has Fibonacci level labels and [formatFibonacciLabel:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/fibonacciretracementannotation.html#formatfibonaccilabel).
- [MeasureAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/measureannotation.html) has a measurement label and [labelDataTemplate:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/measureannotation.html#labeldatatemplate).
- [StopLossTakeProfitAnnotation:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc-fin-tools/classes/stoplosstakeprofitannotation.html) automatically contributes Y-axis labels for entry and target levels.

For point, segment and axis label options, see [Multi-Point Labels Deep Dive](/2d-charts/annotations-api/trading-annotations/multipoint-annotations/).

#### See Also

- [Multi-Point Labels Deep Dive](/2d-charts/annotations-api/trading-annotations/multipoint-annotations/)
- [Placement and Editing](/2d-charts/annotations-api/trading-annotations/placement-and-editing/)
- [AnnotationHoverModifier](/2d-charts/annotations-api/annotation-hover/)
- [PolyLineAnnotation](/2d-charts/annotations-api/trading-annotations/polyline-annotation/)
