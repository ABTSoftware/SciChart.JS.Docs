---
sidebar_position: 1
---

# What's New in SciChart.js SDK v5.0

## SciChart.js v5.0 Release Overview

This release is all about performance optimization.

## List of New Features

* Performance improvements (table with some numbers needed)
* Reducing bundle size (numbers are needed)
* Make use of Float64Array views to speed up vector access in loops
* SIMD (Single Instruction, Multiple Data) support, which significantly improves performance of CPU operations such as resampling.
* Index axis support
* Improved layout of 3D labels.
* Improved multiline text rendering and positioning for native text annotations and native text titles.
* Multiline Axis Title and Labels support on 3D charts
* SVG only mode for tooltips and annotations
* Equidistant vertical margin for multiline text
* Palette provider support for Stacked columns

## List of optimizations and fixes

* 3D SurfaceMesh optimization
* 3D PointCloud and PointLine optimizations
* Fix hit-test for XyNDataSeries
* Improving and fixing bugs in the low-level WebGLRenderContext2D API
* Heatmap support for 4000x4000 size
* Superscript fix