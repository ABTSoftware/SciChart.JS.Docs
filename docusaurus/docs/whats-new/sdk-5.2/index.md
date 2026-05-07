---
sidebar_position: 0
---

# What's New in SciChart.js SDK v5.2

## SciChart Financial Drawing Tools Package (new scichart-financial-tools NPM package)

New trading annotations:

* ChannelAnnotation
* DisjointChannelAnnotation
* FlatBottomChannelAnnotation
* ExtendedLineAnnotation
* FibonacciRetracementAnnotation
* MeasureAnnotation
* PitchforkAnnotation
* PitchfanAnnotation
* StopLossTakeProfitAnnotation

New modifiers:

* MultiPointAnnotationPlacementModifier
* FreehandDrawingModifier

New data filters:

* Heikin-Ashi data filter
* Renko data filter
* PointAndFigureFilter

## New Features

* Composite annotations (combine multiple annotations into one)
* Smith Chart demo
* Force Direction Graph demo
* Arbitrary contour chart levels (zLevels property on UniformContoursRenderableSeries)
* Pinch zoom support for XAxisDragModifier and YAxisDragModifier
* 3D Series Selection Modifier

## New Server-Side Licensing

A simplified version of Advanced Licensing

## Improvements and Bug Fixes

* Anti-aliasing improvements for arc annotation rendering
* SCJS-2422: Fixed Native Text Shared Cache bug with multiple SciChartSurfaces and custom fonts
* SCJS-2406: Fixed text measure and label cache issues
* SCJS-2397: Fixed line rendering freeze
* SCJS-2405: Fixed metadata updates on 3D not invalidating
