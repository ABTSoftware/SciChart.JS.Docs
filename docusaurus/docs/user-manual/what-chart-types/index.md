---
id: What-Chart-Types
title: Features, Chart Types and more supported by SciChart.js
sidebar_label: What Chart Types & Features does SciChart.js Support?
sidebar_position: 2
---

# Features and Chart Types of SciChart.js

The following page is a comprehensive list of all features in SciChart.js. From v4 onwards, SciChart.js features:

- over 70 2D & 3D chart types including Polar, 2D Charts, 3D Charts and Maps
- specialist chart types for the financial industry, scientific, semiconductor, industrial and medical applications
- has many interaction behaviours such as zoom, pan, selection, and hit-test
- features programmatic zoom, and zoom-changed callbacks
- features unlimited, multiple axis, many axis types, multiple axis layout & formatting options
- has configurable legends, scrollbars, chart synchronization and dashboard layout options
- interactive annotations and overlays,
- supports fast, real-time updates of data, efficient structure of arrays data formats, optional Js objects at X,y data-points (metadata API), data-labels rendered on the chart
- supports per-point colouring (individual data-point colouring) via the PaletteProvider API
- supports full GPU hardware acceleration via WebGL and fast pointer-based arithmetic and memory operations via WebAssembly
- a programmatic API (JavaScript) or optional side-by-side JSON Builder API allowing creation of charts via JSON or JavaScript configuration objects
- serialization/deserialization of charts to JSON
- accessibility
- retina DPI support
- built-in themes, custom themeing and animations APIs
- data filters, render transforms, and polygon/triangle series types for custom drawing
- a React wrapper (scichart-react), Angular wrapper (scichart-angular) and full TypeScript support

For a full list of features in SciChart.js, browse the FAQs below.

## What Chart Types does SciChart.js Support?

**SciChart.js version 4 features over 70 2D & 3D chart types**, including cartesian charts, polar charts, pie/donut charts, radial & linear gauges, heatmaps,
JavaScript GeoJSON maps, 3d bubble, 3d scatter, 3d point-cloud, 3d lines, 3d surface plots and more.

Most chart types support dashed line & solid stroke, solid and gradient colour fills,
customisable [Text Data Labels](../../2d-charts/chart-types/data-point-labels/data-labels-api-overview/) rendered at the X,y value, optional [Metadata](../../2d-charts/chart-types/point-metadata-api/point-metadata-api-overview/) (Js Objects at X,y points) and per-point colouring (custom data-point colours) via the [PaletteProvider API](../../2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/).

SciChart.js charts are hardware accelerated using WebGL and WebAssembly for outstanding performance in big-data, financial, scientific and real-time monitoring applications.

A detailed list of all supported chart types with links to documentation / demos can be found below.

### 2D Cartesian Chart Types Supported by SciChart.js

#### Line Chart Types Supported
1. [Polyline Charts](../../2d-charts/chart-types/fast-line-renderable-series/)
2. [Line Segment Charts](../../2d-charts/chart-types/fast-line-segment-renderable-series/)
3. [Bezier Spline Line Chart](../../2d-charts/chart-types/spline-line-renderable-series/)
4. [Digital/Step Line Chart](../../2d-charts/chart-types/fast-line-digital-renderable-series/)

#### Scatter and Bubble Chart Types Supported
5. [Scatter Charts with configurable point-marker](../../2d-charts/chart-types/xy-scatter-renderable-series/)
6. [Bubble Charts with variable size bubbles](../../2d-charts/chart-types/fast-bubble-renderable-series/)
7. [Per-point coloured Scatter / Bubble Charts](../../2d-charts/chart-types/palette-provider-api/fast-bubble-renderable-series/)

#### Column and Bar Charts Supported by SciChart.js
8. [Column / Bar Charts](../../2d-charts/chart-types/fast-column-renderable-series/column-series-type/)
9. [Histogram Charts](https://www.scichart.com/demo/react/histogram-chart)
10. [Rectangle Range Charts](../../2d-charts/chart-types/fast-rectangle-renderable-series/)
11. [Horizontal Bar Charts](https://www.scichart.com/demo/react/animated-columns)
12. [Stacked Column Charts](../../2d-charts/chart-types/stacked-column-renderable-series/)
13. [100% Stacked Column Charts](../../2d-charts/chart-types/stacked-column-renderable-series/)
14. [Grouped Column Charts](../../2d-charts/chart-types/stacked-column-renderable-series/)

#### Mountain and Area Chart Types Supported by SciChart.js

15. [Mountain (Area) Charts](../../2d-charts/chart-types/fast-mountain-area-renderable-series/)
16. [Spline Mountain Charts](../../2d-charts/chart-types/spline-mountain-renderable-series/)
17. [Stacked Mountain Charts](../../2d-charts/chart-types/stacked-mountain-renderable-series/)
18. [Smoothed (Spline) Stacked Mountain Charts](../../2d-charts/chart-types/smooth-stacked-mountain-renderable-series/)
19. [100% Stacked Mountain Charts](../../2d-charts/chart-types/stacked-mountain-renderable-series/)

#### Statistical Chart Types Supported by SciChart.js

20. [Box Plots](../../2d-charts/chart-types/fast-box-plot-renderable-series/)
21. [Vertical Error Bars](../../2d-charts/chart-types/fast-error-bars-renderable-series/)
22. [Horizontal Error Bars](../../2d-charts/chart-types/fast-error-bars-renderable-series/)
23. [Histogram Charts](https://www.scichart.com/demo/react/histogram-chart)

#### Misc Chart Types Supported by SciChart.js

24. [Heatmap Charts](../../2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) with optional [HeatmapColorMap](../../2d-charts/chart-types/uniform-heatmap-renderable-series/color-maps-and-legends/) legend
25. [Non-uniform Heatmap Charts](../../2d-charts/chart-types/non-uniform-heatmap-renderable-series/) with optional [HeatmapColorMap](../../2d-charts/chart-types/uniform-heatmap-renderable-series/color-maps-and-legends/) legend
26. [Contours Charts](../../2d-charts/chart-types/uniform-contours-renderable-series/)
27. [Band Charts or High-Low Area Fill Charts](../../2d-charts/chart-types/fast-band-renderable-series/)
28. [Spline Band Charts / Area Fill](../../2d-charts/chart-types/spline-band-renderable-series/)
29. [Fan Chart](../../2d-charts/chart-types/fan-charts-type/)
30. [Text / Word Cloud Charts](../../2d-charts/chart-types/fast-text-renderable-series/)
31. [Impulse, Lollipop or Stem Charts](../../2d-charts/chart-types/fast-impulse-renderable-series/)
32. [Population Pyramid Charts](https://www.scichart.com/demo/react/population-pyramid)
33. [Quadrant Charts](https://www.scichart.com/demo/react/chart-background-annotations)
34. [Waterfall Charts](https://www.scichart.com/demo/react/waterfall-chart)
35. [Vector Field Charts](https://www.scichart.com/demo/react/vector-field)
36. [Treemap Charts](../../2d-charts/chart-types/tree-map-type/)
37. [Gantt Charts](https://www.scichart.com/demo/react/gantt-chart)
38. [Rectangle Series Charts](../../2d-charts/chart-types/fast-rectangle-renderable-series/)
39. [Triangle Series Charts (Polygons)](../../2d-charts/chart-types/fast-triangle-renderable-series/)

#### Financial Chart Types Supported by SciChart.js

40. [Candlestick Chart](../../2d-charts/chart-types/fast-candlestick-renderable-series/)
41. [OHLC Bars Chart](../../2d-charts/chart-types/fast-ohlc-renderable-series/)
42. [Volume Bars Chart](../../2d-charts/chart-types/fast-ohlc-renderable-series/)
43. [Market Profile / Volume Profile Chart](https://www.scichart.com/blog/how-to-create-a-volume-profile-in-a-javascript-financial-chart/)
44. [Market Depth Chart](https://www.scichart.com/demo/react/depth-chart)

#### Pie / Donut Chart Types Supported by SciChart.js

45. [Pie Charts](../../2d-charts/chart-types/pie-chart-type/)
46. [Donut Charts](../../2d-charts/chart-types/donut-chart-type/)

#### Gauges Supported by SciChart.js

47. [Linear Gauges](https://www.scichart.com/demo/react/linear-gauges)
48. [Radial Gauges](../../2d-charts/chart-types/polar-partial-chart-type/#1-gauge-charts)

### 2D Polar or Radial Chart Types Supported by SciChart.js

49. [Polar Line Charts](../../2d-charts/chart-types/polar-line-renderable-series/)
50. [Polar Spline Line Charts](https://www.scichart.com/demo/react/polar-spline-line-chart)
51. [Polar Column Chart](../../2d-charts/chart-types/polar-column-renderable-series/)
52. [Polar Range Column Chart](https://www.scichart.com/demo/react/polar-reange-column-chart)
53. [Windrose Chart or Stacked Polar Column Chart](../../2d-charts/chart-types/polar-stacked-column-renderable-series/)
54. [Radial Sunburst Chart](../../2d-charts/chart-types/polar-sunburst-chart/)
55. [Radial Column Charts](../../2d-charts/chart-types/polar-column-renderable-series/#polar-radial-polar-column-series)
56. [Radial Stacked Column Charts](https://www.scichart.com/demo/react/polar-stacked-radial-column-chart)
57. [Polar Mountain Charts](../../2d-charts/chart-types/polar-mountain-renderable-series/)
58. [Polar Stacked Mountain Charts](../../2d-charts/chart-types/polar-stacked-mountain-renderable-series/)
59. [Polar Band (High Low Fill) Charts](../../2d-charts/chart-types/polar-band-renderable-series/)
60. [Polar Scatter Charts](../../2d-charts/chart-types/polar-xy-scatter-renderable-series/)
61. [Radar Charts](../../2d-charts/chart-types/polar-radar-chart/)
62. [Polar Heatmap Charts](../../2d-charts/chart-types/polar-uniform-heatmap-renderable-series/)
63. [Polar Map Chart](https://www.scichart.com/demo/react/polar-map-example)
64. [Phasor Diagrams](https://www.scichart.com/demo/react/phasor-diagram-chart)

### 2D Maps Charts Supported by SciChart.js

65. [Chloropleth Maps](https://www.scichart.com/demo/react/map-example)
66. [GeoJson Maps](https://www.scichart.com/demo/react/multi-map-example)

### 3D Chart Types Supported by SciChart.js

67. [3D Bubble Chart](../../3d-charts/chart-types/bubble-3d-chart/)
68. [3D Surface Mesh (Surface Plots) Chart](../../3d-charts/chart-types/surface-mesh-3d/) with optional [HeatmapColorMap](../../2d-charts/chart-types/uniform-heatmap-renderable-series/color-maps-and-legends/) legend
69. [3D Point Line Charts](../../3d-charts/chart-types/lines-3d-chart/)
70. [3D Point Cloud Charts](https://www.scichart.com/demo/react/3d-lidar-visualization)
71. [3D Scatter Charts](../../3d-charts/chart-types/scatter-3d-chart/)
72. [3D Column / Bar Charts](../../3d-charts/chart-types/column-3d-chart/)

## What Axis Types does SciChart.js Support?

SciChart.js features 10 Axis types including cartesian value axis ([NumericAxis](../../2d-charts/axis-api/axis-types/numeric-axis/))
date axis ([DateTimeNumericAxis](../../2d-charts/axis-api/axis-types/date-time-numeric-axis/)),
Category Axis ([CategoryAxis](../../2d-charts/axis-api/axis-types/category-axis/)),
polar (radial) axis ([PolarNumericAxis](../../2d-charts/axis-api/axis-types/polar-numeric-axis/),
[PolarCategoryAxis](../../2d-charts/axis-api/axis-types/polar-category-axis/)),
solutions for [Text Label axis](../../2d-charts/axis-api/axis-types/text-string-axis/)
and non-linear axis types such [LogarithmicAxis](../../2d-charts/axis-api/axis-types/logarithmic-axis/).
A full list of axis types and links to respective documentation pages can be found below:

### Linear Axis Types Supported by SciChart.js

1. [Linear Numeric Axis](../../2d-charts/axis-api/axis-types/numeric-axis/)
2. [Linear Date Axis](../../2d-charts/axis-api/axis-types/date-time-numeric-axis/)
3. [Category Numeric Axis](../../2d-charts/axis-api/axis-types/category-axis/)
4. [Category Date Axis](../../2d-charts/axis-api/axis-types/category-axis/)
5. [Text / String Labels Axis](../../2d-charts/axis-api/axis-types/text-string-axis/)
6. (3D Charts) [Linear Numeric 3D Axis](../../3d-charts/axis-3d-api/numeric-and-date-axis-in-scichart-3d/)
7. (3D Charts) [Linear Numeric 3D Date Axis](../../3d-charts/axis-3d-api/numeric-and-date-axis-in-scichart-3d/)

### Logarithmic Axis Types Supported by SciChart.js

8. [Logarithmic Numeric Axis (Log2, LogE, Log10)](../../2d-charts/axis-api/axis-types/logarithmic-axis/)

### Radial (Polar) Axis Types Supported by SciChart.js

9. [Polar Numeric Axis](../../2d-charts/axis-api/axis-types/polar-numeric-axis/)
10. [Polar Category Axis](../../2d-charts/axis-api/axis-types/polar-category-axis/)

### What Axis Configuration Options and Axis Layout Options does SciChart.js Support?

Axis in SciChart are infinitely configurable for everything from labels to layout and more.
Axes support label formatting ([NumericFormats](../../2d-charts/axis-api/axis-labels/numeric-formats/)),
date formatting ([DateTimeNumericAxis](../../2d-charts/axis-api/axis-types/date-time-numeric-axis/)),
customisation of label values and decimal places ([LabelProvider API](../../2d-charts/axis-api/axis-labels/label-provider-api-overview/)),
[image labels](../../2d-charts/axis-api/axis-labels/image-labels/),
fine-grained gridline/label interval or spacing customisation ([Gridline Spacing](../../2d-charts/axis-api/axis-tick-label-interval/gridline-and-label-spacing-interval/),
[TickProvider API](../../2d-charts/axis-api/axis-tick-label-interval/tick-provider-api/)),
dynamic label formatting on zoom ([Custom LabelProviders](../../2d-charts/axis-api/axis-labels/custom-label-providers-readable-numbers/),
alignment or docking of the axis on the left, right, top, bottom,
unlimited multiple X and Y axis ([Multiple Axis docs](../../2d-charts/axis-api/multi-axis-and-layout/secondary-and-multiple-axis-overview/),
[rotating axis labels](../../2d-charts/axis-api/axis-labels/rotating-axis-labels/) and
[Multi Line Axis Labels](../../2d-charts/axis-api/axis-labels/text-and-multi-line-labels/)).

Axis layout options include [Vertically Stacked Axis Layout](../../2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout/),
[horizontal stacking](../../2d-charts/axis-api/multi-axis-and-layout/horizontally-stacked-axis-layout/),
[central axis](../../2d-charts/axis-api/multi-axis-and-layout/central-axis-layout/),
[inner or outer axis](../../2d-charts/axis-api/multi-axis-and-layout/inner-axis-layout/),
[drawing series behind axis](../../2d-charts/axis-api/multi-axis-and-layout/inner-axis-layout/#drawseriesbehindaxis-property),
rotation of charts by 90 degrees ([vertical charts](../../2d-charts/axis-api/multi-axis-and-layout/vertical-charts-rotate-transpose-axis/)),
and [complex custom layouts](../../2d-charts/axis-api/multi-axis-and-layout/advanced-options-custom-layout-managers/)
of axis including stacked, stretched layouts of multi-axis charts via the LayoutManager API.

Axis can be dragged to scale, dragged to pan, and custom markers or images can be placed over axis via the [AxisMarkerAnnotation](../../2d-charts/annotations-api/axis-marker-annotation/axis-marker-annotation-overview/).
Using the [SubCharts API](../../2d-charts/subcharts-api/subcharts-api-overview/), it's possible to draw a chart on an axis.

All axis elements may be styled including gridlines, tick lines, labels, bands (shading between gridlines) and axis borders and background
([Axis styling docs](../../2d-charts/axis-api/axis-styling/title-labels-gridlines-axis-band-style/)).
Axis also may be hidden or visible ([Axis Visibility](../../2d-charts/axis-api/axis-styling/visibility-of-axis-elements/)).
Axis support [Zoom to Fit and AutoRange](../../2d-charts/axis-api/ranging-scaling/set-range-zoom-to-fit/) on a per-axis basis and
callbacks exist for axis range changed ([VisibleRangeChanged](../../2d-charts/axis-api/ranging-scaling/listen-to-visible-range-changes/)))


## What Zoom, Pan, Selection and Interaction Behaviours does SciChart.js Feature?

SciChart.js features a myriad of built-in interaction behaviours, such as zooming, panning, drag-rectangle zoom, mousewheel zoom, pinch zoom for touch screens,
mouse-wheel zoom or pan, x-axis drag to zoom or pan, y-axis drag, zoom to fit and scrollbars provided by the SciChartOverview control. Tooltips, selection, hover are also
supported via the modifiers listed below. For 3D Charts, SciChart.js supports Orbiting, Pinch zoom, Mousewheel zoom in-out of the 3D scene, Tooltips in 3D and Camera viewport reset modifiers.

### Zooming Behaviours Supported by SciChart.js

1. [ZoomPanModifier](../../2d-charts/chart-modifier-api/zooming-and-panning/zoom-pan-modifier/) - Drag to pan in X or Y, plus built-in touch screen support
2. [RubberBandXyZoomModifier](../../2d-charts/chart-modifier-api/zooming-and-panning/rubber-band-xy-zoom-modifier/) - Drag rectangle to zoom
3. [PinchZoomModifier](../../2d-charts/chart-modifier-api/zooming-and-panning/pinch-zoom-modifier/) - Two finger pinch zoom on touchscreen devices
4. [ZoomExtentsModifier](../../2d-charts/chart-modifier-api/zooming-and-panning/zoom-extents-modifier/) - double click to Zoom Extents (zoom to fit)
5. [YAxisDragModifier](../../2d-charts/chart-modifier-api/zooming-and-panning/y-axis-drag-modifier/) - drag Y-Axis to zoom or pan
6. [XAxisDragModifier](../../2d-charts/chart-modifier-api/zooming-and-panning/x-axis-drag-modifier/) - drag X-Axis to zoom or pan
7. [MouseWheelZoomModifier](../../2d-charts/chart-modifier-api/zooming-and-panning/mouse-wheel-zoom-modifier/) - mousewheel to zoom or pan
8. [SciChartOverview](../../2d-charts/chart-modifier-api/zooming-and-panning/overview/) - scrollbars with configurable chart view behind
9. (3D Charts) [OrbitModifier3D](../../3d-charts/chart-modifier-3d-api/zooming-and-panning/orbit-modifier-3d/) - Rotates a 3D chart in 2-axis on mouse-drag by orbiting the 3D scene. This is achieved by updating the Camera position/target
10. (3D Charts) [PinchZoomModifier3D](../../3d-charts/chart-modifier-3d-api/zooming-and-panning/pinch-zoom-modifier-3d/) - Pinch to zoom a 3D chart on touchscreen devices by updating the camera position/target
11. (3D Charts) [MouseWheelZoomModifier3D](../../3d-charts/chart-modifier-3d-api/zooming-and-panning/mouse-wheel-zoom-modifier-3d/) - Mousewheel to zoom a 3D chart by updating the camera position / target.
12. (3D Charts) [ResetCamera3DModifier](../../3d-charts/chart-modifier-3d-api/zooming-and-panning/reset-camera-modifier-3d/) - Resets the Camera to a default position on double-click, either calculated by fitting the 3D scene in the viewport, or a custom position / target

### Touchscreen Zoom Behaviours Supported by SciChart.js

All zoom behaviours respond to touch, but these specific ChartModifiers have pinch-zooming or touch-gesture behaviour built in.

- [ZoomPanModifier](../../2d-charts/chart-modifier-api/zooming-and-panning/zoom-pan-modifier/) - Also supports touch to pan and pinch to zoom
- [PinchZoomModifier](../../2d-charts/chart-modifier-api/zooming-and-panning/pinch-zoom-modifier/) - Pinch zoom on touchscreen devices
- [MouseWheelZoomModifier](../../2d-charts/chart-modifier-api/zooming-and-panning/mouse-wheel-zoom-modifier/) - Responds to two-finger touch to replicate mousewheel zooming of 2D charts on touch devices.
- (3D Charts) [MouseWheelZoomModifier3D](../../3d-charts/chart-modifier-3d-api/zooming-and-panning/mouse-wheel-zoom-modifier-3d/) - Responds to two-finger touch to replicate mousewheel zooming of 3D charts on touch devices

### Selection & Hover Behaviours Supported by SciChart.js

SciChart.js features selection of series, hover of series and selection of data-points with callbacks and hover of annotations with callbacks.
Specific ChartModifiers (behaviours) which ship out of the box include:

1. [SeriesSelectionModifier](../../2d-charts/chart-modifier-api/selection/series-selection/) - select or hover series with callbacks on which series was selected
2. [DataPointSelectionModifier](../../2d-charts/chart-modifier-api/selection/data-point-selection/) - select data points via click or drag rectangle with notification of which data-points were selected
3. [AnnotationHoverModifier](../../2d-charts/chart-modifier-api/selection/annotation-hover/) - callbacks when an annotation has been hovered or clicked, allowing tooltips and custom behaviour on user interaction with annotations.

#### 3D Chart Selection & Hover Behaviours

At the time of writing, there is no selection behaviours built for 3D Charts, but if this is a requirement, contact [tech support](https://www.scichart.com/contact-us) to request a feature.

## What Tooltips, Inspections and Hit-Testing does SciChart.js Feature?

SciChart.js features several behaviours to add tooltips to charts. Tooltips are provided by ChartModifiers (behaviours) such as the [RolloverModifier](../../2d-charts/chart-modifier-api/rollover-modifier/),
[CursorModifier](../../2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview/) and [VerticalSliceModifier](../../2d-charts/chart-modifier-api/vertical-slice-modifier/vertical-slice-modifier-overview/). Tooltip containers (tooltip shape, style) and contents (tooltip text, content) can be templated and customised to show extra data or to match your application style.

1. [RolloverModifier](../../2d-charts/chart-modifier-api/rollover-modifier/) - provides a vertical line which tracks the mouse and places a configurable tooltip container and template at the intersection with chart series.
2. [CursorModifier](../../2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview/) - provides a crosshairs (horizontal/vertical line) which tracks the mouse and configurable tooltip container and template. The CursorModifier can also be used to display data in an external legend.
3. [VerticalSliceModifier](../../2d-charts/chart-modifier-api/vertical-slice-modifier/vertical-slice-modifier-overview/) - provides multiple, placeable, draggable vertical lines which intersect time-series and display configurable tooltip contains and templates at each intersection with chart series.
4. [Hit-Test API](../../2d-charts/chart-types/hit-test-api/hit-test-api-overview/) - provides a programmatic API to detect clicks and taps on chart data-points with various functions to detect the nearest data-point in Xy, nearest data-point in X and series series body hit.
Used in conjuction with the ChartModifier API for listening to mouse events via `modifierMouseDown`, `modifierMouseMove` etc, the Hit-Test API can be used to create custom interaction behaviours on the chart.
5. (3D Charts) [TooltipModifier3D](../../3d-charts/chart-modifier-3d-api/tooltip-modifier-3d/) - provides a configurable tooltip for 3D charts able to display seriesName, X, Y, Z value and optional metadata, with optional axis lines drawn to the far 3D axis walls

## Custom Zoom, Pan, Tooltip, Selection or Interaction Behaviours Supported by SciChart.js

SciChart.js supports the creation of custom behaviours (custom ChartModifiers) to allow you to create any specific zooming, panning, tooltip, hover or inspection behaviour that you want.
By inheriting a type `ChartModifierBase2D` you can override `modifierMouseDown` `modifierMouseMove` `modifierMouseUp` or even  `modifierMouseLeave`, `modifierMouseEnter`, `modifierMouseWheel` or `modifierDoubleClick`
allowing you to detect mouse-clicks on charts without subscribing to event handlers.

Custom ChartModifiers can be attached to the parent chart and get notified `onAttach` `onAttachSeries` `onDetach` `onDetachSeries` and have full access to the chart via `parentSurface`, it's axis, series and can manipulate properties or data,
plus draw custom overlays such as Tooltips or Annotations.

For 3D Charts, the type `ChartModifierBase3D` can be inherited which also supports `modifierMouseDown` `modifierMouseMove` `modifierMouseUp` etc, and can access the 3D Chart via `parentSurface`, it's axis, 3D series and data, and can manipulate properties, data or draw custom overlays.

An overview of the [Custom Chart Modifier API is found here](../../2d-charts/chart-modifier-api/custom-modifiers/custom-modifiers-overview/) is found here and an example
[Detecting Clicks on Chart Parts can be found here](../../2d-charts/chart-modifier-api/custom-modifiers/detecting-clicks-on-chart-parts/) which
demonstrates how to detect and highlight areas of the chart that were clicked/hovered. A [Keyboard Zoom Modifier](../../2d-charts/accessibility/keyboard-accessibility/) example is shown here using the custom ChartModifier API to
create accessible charts with zoom on keypress (+/-).

## What Chart Legend Options does SciChart.js Feature?

SciChart.js features a [LegendModifier](../../2d-charts/chart-modifier-api/miscellaneous-modifiers/legend-modifier/)
type which provides a rich, customisable legend. Legends support:
- Placement of the Legend inside the chart top-left, top-right, bottom-left or bottom-right aligned
- Horizontal or Vertical orientation of the Legend
- Showing data series name, line color/marker, visibility checkboxes
- Allowing full customization of the Legend using auto-generated CSS classes scichart__legend, scichart__legend-item
- Placing the Legend anywhere outside the chart

Certain modifiers such as the `CursorModifier` type also support the output of data to create an
[active legend](../../2d-charts/chart-modifier-api/cursor-modifier/active-legends-cursor-modifier/)
which updates and tracks the position of the crosshair. This is demonstrated in a [Financial chart example](https://www.scichart.com/demo/react/candlestick-chart)
which outputs details of the candles, bars and series under the cross-hair in the top-left of the chart window
in an active legend.

## What Annotation and Overlay Types does SciChart.js Feature?

SciChart.js features a number of annotation overlays which can be placed at X,Y data-points on the chart, which scroll, zoom or pan with the chart.
Annotations such as labels, lines, boxes and custom markers may be placed at specific X,Y data-points, or relative coordinates via `ECoordinateMode` (0..1 relative to the viewport height or width),
or at specific pixel coordinates.

Annotations may also be clicked, selected, edited (dragged or resized by the user). The selection grips can be styled to fit your application style. Annotations may be serialized and state persisted in your app.

It's possible to get hover/click feedback on annotations via the [AnnotationHoverModifier](../../2d-charts/annotations-api/annotation-hover/).
A [CustomAnnotation](../../2d-charts/annotations-api/custom-annotation/) allows drawing of any SVG shape on the chart, and [HTMLAnnotation](../../2d-charts/annotations-api/html-annotation/) allows placement of any HTML content over the chart.

Annotations available SciChart.js include:

1. [LineAnnotation](../../2d-charts/annotations-api/line-annotation/) - provides WebGL lines at X1 X2 Y1 Y2 coordinates
2. [BoxAnnotation](../../2d-charts/annotations-api/box-annotation/) - provides a WebGL box with outline at X1 X2 Y1 Y2 coordinates
3. [TextAnnotation](../../2d-charts/annotations-api/text-annotation/) - displays SVG text labels at any X1 Y1 coordinate
4. [VerticalLineAnnotation](../../2d-charts/annotations-api/vertical-line-annotation/) - provides a stretched, draggable WebGL vertical line with optional X-Axis label on the chart
5. [HorizontalLineAnnotation](../../2d-charts/annotations-api/horizontal-line-annotation/) - provides a stretched, draggable WebGL horizontal line or threshold with optional Y-Axis label on the chart
6. [LineArrowAnnotation](../../2d-charts/annotations-api/line-arrow-annotation/) -provides a WebGL line with arrowhead at X1 X2 Y1 Y2 coordinates
7. [AxisMarkerAnnotation](../../2d-charts/annotations-api/axis-marker-annotation/axis-marker-annotation-overview/) - provides a draggable axis marker on Y-Axis at specific Y-value, which can display the current value, or custom text
8. [NativeTextAnnotation](../../2d-charts/annotations-api/native-text-annotation/) - provides WebGL accelerated alterative to TextAnnotation for displaying large quantities of text labels on a chart
9. [HTML Annotations](../../2d-charts/annotations-api/html-annotation/) - provides any HTML overlay on the chart
9. [ArcAnnotation](../../2d-charts/annotations-api/arc-annotation/) - draws a filled arc sector or curved line on 2D cartesian charts.
10. [PolarArcAnnotation](../../2d-charts/annotations-api/polar-arc-annotation/) - draws a filled sector or arc line on a 2D Polar chart.
11. [PolarPointerAnnotation](../../2d-charts/annotations-api/polar-pointer-annotation/) - creates a customisable SVG pointer for polar charts, ideal for gauges or radial indicators.

### 3D Chart Annotations

At the time of writing there are no 3D chart annotations, however HTML/SVG overlays in combination with the `ChartModifierBase3D` type could allow the development
of custom behaviours. Get in touch with [tech support](https://www.scichart.com/contact-us) to request a feature if required.

## What Data Structures does SciChart.js support?

Both 2D and 3D charts in SciChart.js supports "structure of arrays" data in full 64-bit precision for optimal performance in big-data charts, with arrays of `xValues`, `yValues` or higher order charts requiring `y1Values` `y2Values` etc.
Data is stored in WebAssembly (wasm) and is mem-copied from JavaScript to the wasm heap and read/scanned via pointer operations for the fastest possible performance.

Data can be passed to SciChart.js as individual data-points, via JavaScript arrays e.g. `const array = [1,2,3]` or via `Float64Array` for better performance and memory usage.

Optional point metadata (see [Metadata API](../../2d-charts/chart-types/point-metadata-api/point-metadata-api-overview/)) allows you to tag any X,y point with Js objects, allowing for more complex data structures to be stored and retrieved on inspection - with metadata available to Tooltips, Data Labels,
per-point colouring (see [PaletteProvider API](../../2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/)) and more.

Some chart types such as heatmaps, surface mesh plot 3D support uniform grid data format: a 2-dimensional jagged array of values (e.g. `const zValues = [[1,2,3],[4,5,6]]`) used to render cell colours in the case of 2D Chart heatmaps, or cell heights and colours in the cause of 3D Chart surface plots.

## What Real-time Data Update Capabilities does SciChart.js Feature?

SciChart.js supports bulk create, read, update, delete ([DataSeries CRUD operations](../../2d-charts/chart-types/data-series-api/append-insert-update-remove/)) via its [DataSeries API](../../2d-charts/chart-types/data-series-api/data-series-api-overview/). This applies to both 2D & 3D Charts.
[Real-time updates](../../2d-charts/chart-types/data-series-api/realtime-updates/) are possible by rapidly updating the Data Series.

Any data-update automatically triggers a redraw. Chart rendering is scheduled and will render at 60 FPS maximum (or your display refresh rate) regardless of the frequency of data-updates.

Real-time data updates have been tested up to millions of data-points per second and SciChart.js handles these efficiently while scheduling re-draws, balancing CPU and GPU load.

SciChart.js also features a FIFO mode (first-in-first-out) via `fifoCapacity` flag for automatic scrolling and discarding of old data in time-series monitoring applications,
and a `fifoSweeping` flag to allow wrap-around ECG-style charts. For more info see the demos on [Scrolling Data](../../2d-charts/chart-types/data-series-api/realtime-updates/#scrolling-using-fifocapacity)
and [Sweeping Data](../../2d-charts/chart-types/data-series-api/realtime-updates/#sweeping-data)

SciChart is already optimised for the maximum possible performance out of the box. For learning about how to get the best performance from SciChart.js in your application, refer to our [Performance Tips & Tricks](../../2d-charts/performance-tips/performance-tips-and-tricks/) article.

## What Performance Limits or Datapoint Limits does SciChart.js Have?

We often say, **"You will hit the limits of the browser before you hit the limits of SciChart.js"**. SciChart.js can draw up to 100,000,000 (100 million) data-points in Google Chrome browser which is limited to ~1.5GBytes RAM per tab, 4GB RAM per process.
Higher data-point limits are possible with Mozilla Firefox (billions of data-points) which has a higher memory limit.
Practically speaking, a limit of total data-points can be calculated assuming X,Y values with double-precision floating point (16-bytes per X,Y data-point)
and the browser limit.

Dashboards of hundreds of charts all updating in real-time are possible with SciChart.js, such as this [Realtime 100 Chart Drag & Drop React Dashboard](https://www.scichart.com/blog/creating-a-react-drag-drop-chart-dashboard/) demo, and this [64-chart dashboard demo](https://www.scichart.com/demo/javascript/javascript-multiple-chart-dashboard-performance-demo).

There are no WebGL context limits with SciChart.js when using the standard `SciChartSurface.create()` function - which creates a single shared WebGL context for all charts on the page.
This efficiently by-passes the browser WebGL Context limits which would otherwise limit the number of WebGL charts on a screen to as little as 2 for mobile devices, and 16 for desktop with Google Chrome.

SciChart.js is always pushing the limits of performance, ensuring low memory consumption, efficient, balanced CPU/GPU usage. If you discover a performance problem, please report it via [tech support](https://www.scichart.com/contact-us)
and our team will do their best to help.

## What Multi-Chart Linking and Dashboard Layout Capabilities does SciChart.js Feature?

SciChart.js supports multi-chart linking for complex, synchronised dashboards as well as a [SubCharts API](../../2d-charts/subcharts-api/subcharts-api-overview/) for grouping several charts into a single master surface, charts within charts, charts on the axis and more.

Several APIs are available to link multiple charts.

### Linking Multiple Charts via Chart Groups

At a basic level, one `SciChartSurface` is one chart.
Two or more charts can be linked by [creating a vertical or horizontal chart group](../../2d-charts/chart-synchronization-api/synchronizing-multiple-charts/)
where zooming, panning and tooltips / mouse interactions are shared across multiple charts in the group. This allows the creation of multi-chart components such as [Financial charts](https://www.scichart.com/demo/react/multi-pane-stock-charts-sync-technique)
where indicator panels appear below the main Candlestick chart, but all zooming, panning and tooltips happen in unison.

The same technique can be used to create timeline controls in industrial process monitoring where multiple time-series charts are linked and zoom, pan and have tooltips act on all chart surfaces in unison.

### Appearance of multiple linked charts via Vertically Stacked Axis / Horizontally Stacked Axis feature

A similar effect of creating timeline charts can be achieved via [Vertically Stacking Axis](../../2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout/),
or [Horizontally Stacking Axis](../../2d-charts/axis-api/multi-axis-and-layout/horizontally-stacked-axis-layout/).
By taking advantage of SciChart.js' complex axis layout features via the [LayoutManager API](../../2d-charts/axis-api/multi-axis-and-layout/advanced-options-custom-layout-managers/)
a single chart surface can be configured to appear as multiple charts arranged horizontally, or vertically with zoom, pan, tooltips and mouse-interactions shared across all charts.

### Creation of Dashboard Layout controls with multi-charts using the SubCharts API

The [SubCharts API](../../2d-charts/subcharts-api/subcharts-api-overview/)
allows placement of multiple charts into a single parent chart surface, allowing charts within charts, groups of charts and creation of pre-defined dashboard chart groups with layout based on relative coordinates.
This API is highly performant as per this [blog post](https://www.scichart.com/blog/pushing-the-boundaries-of-javascript-chart-dashboard-performance/)  on 100 charts with total of 200 axis, 1,000 text labels and 6 million datapoints,
as grouping of charts into a single WebGL surface and single render call allows for batching strategies that aren't available with groups of individual chart surfaces.

Some worked examples can be found below:
- [Creating re-usable chart groups using SubCharts](../../2d-charts/subcharts-api/example-reusable-chart-groups-with-sub-charts/)
- [Dynamically Add/Remove Charts to a group using SubCharts API](../../2d-charts/subcharts-api/exampe-dynamic-multi-panel-charts-with-sub-charts/)
- [Resizable multi-chart panes using SubCharts](../../2d-charts/subcharts-api/example-resizable-multi-pane-charts-with-sub-charts/)
- [Using SubCharts to create a large dashboard of 100 charts](../../2d-charts/subcharts-api/example-using-sub-charts-to-create-large-dashboard/)
- [Creating a Chart within a Chart using SubCharts](../../2d-charts/subcharts-api/sub-charts-positioning/)
- [Creating a 2-dimensional overlay by placing a chart within a chart using SubCharts](../../2d-charts/subcharts-api/subcharts-api-overview/)
- [Performance Benefits of SubCharts vs. separate charts for 100 chart dashboards](https://www.scichart.com/blog/pushing-the-boundaries-of-javascript-chart-dashboard-performance/)

## What Styling, Theming and Animations Capabilities does SciChart.js Feature?

SciChart.js supports a rich styling, theming and animations API to create beautiful 2D & 3D charts on the web which match your application style, theme and branding.

Out of the box SciChart.js ships with three [themes](../../2d-charts/styling-and-theming/theme-manager-api/): Light, Dark and Navy.
Additional [custom themes](../../2d-charts/styling-and-theming/creating-custom-theme/) can be created by implementing `IThemeProvider`.
Individual chart parts can be [styled in code](../../2d-charts/styling-and-theming/style-chart-parts-in-code/), such as chart titles,
labels, axis, gridlines, viewport boundaries, viewport backgrounds, legend containers, tooltip containers and text, chart margins and paddings.
The [chart background](../../2d-charts/styling-and-theming/image-transparent-blurred-backgrounds/) can be transparent showing the
underlying HTML DOM, blurred creating a glass-like effect or the chart background can be set to an image.

A rich [Animations API](../../2d-charts/animations-api/animations-api-overview/) allows you to animate series on first-load, data-points, provide animated style or data transitions, or any element via the generic animations API.

## What Accessibility Options does SciChart.js Feature?

SciChart.js supports Accessibility with the following features:

- [Voice Over](../../2d-charts/accessibility/voice-over/) using the `SpeechSynthesisUterrance` API to announce data-point values on tap/touch,
to announce axis labels on tap/touch or to announce changes to chart viewport zoom state.
- [Color and Contrast](../../2d-charts/accessibility/color-and-contrast/).
- [Keyboard accessibility](../../2d-charts/accessibility/keyboard-accessibility/) such as zooming on keypress.

## What Custom Drawing / Custom Rendering Options does SciChart.js Feature?

SciChart.js features ways to customize the rendering of the charts beyond the standard chart types, for example if you wish to draw arbitrary shapes, polygons,
manipulate rendering beyond the standard built-in annotations or series. Some ways to customize rendering are listed below.

### Triangle Series (Arbitrary Polygon Drawing) on 2D Charts

The `FastTriangleRenderableSeries` [Triangle Series Type documentation](../../2d-charts/chart-types/fast-triangle-renderable-series/)
plots data as triangles, can be used for custom scatter plots, mesh visualisations, creating complex geometry in 2D such as [Geo Maps](https://www.scichart.com/demo/react/multi-map-example)
and more. This series type visualizes data as a series of triangles (polygons) on a 2D Chart. Triangles can be drawn as `List`, `Polygon` or `Strip` - consistent with 2D/3D graphics
APIs such as OpenGL. Polygons can have an individual `fill`, are associated with `polygonVertices`.

Triangle Series fills support solid color as well as gradient fill via `fillLinearGradient` property.
Custom textures may be applied to triangles or polygons drawn on a 2D chart using the Triangle Series.
Conversion functions exist in SciChart.js examples such as `constrainedDelaunayTriangulation.ts` in the
[Polar Map Example](https://www.scichart.com/demo/javascript/polar-map-example)
to convert Geo JSON data to `polygonVertices` for Geo Maps.
It is recommended to convert and cache these on the server for optional performance.

### Custom Annotations - custom SVG markers, images and shapes on 2D Charts

The [CustomAnnotation](../../2d-charts/annotations-api/custom-annotation/)
type allows you to create custom SVG markers, images, shapes and place these on a 2D chart at specific X,Y locations.
This is part of the [Annotations API](../../2d-charts/annotations-api/annotations-api-overview/) and can e used
to display custom shapes such as Buy/Sell markers on a Financial chart, custom warnings or points of interest or even images.
A custom [AxisMarkerAnnotation](../../2d-charts/annotations-api/axis-marker-annotation/image-axis-marker-annotation/)
allows a similar technique (image, SVG, custom marker) to be placed on the axis.

Further customisation is possible via the [CustomHTMLAnnotation](../../2d-charts/annotations-api/html-annotation/) type
which allows placement of any HTML (such as buttons, dropdowns, forms) onto X,Y locations on the chart.

### Custom DataPoint Markers (Custom PointMarkers) on 2D Charts

The [PointMarkers API](../../2d-charts/chart-types/common-series-apis/drawing-point-markers/) in SciChart.js
allows you to place data-point markers on chart such as Ellipse, Square, Triangle, Cross, X. Also a custom
`SpritePointMarker` type can be used to create a custom point-marker from image, which is cached to texture and rendered using WebGL.
This allows custom markers to be placed on data-points such as scatter charts, line charts and more.

### Per-point Colouring of Data-points via the PaletteProvider API on 2D and 3D Charts

The [PaletteProvider API](../../2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/)
applies to both 2D and 3D charts, and allows individual data-point colours, fills and strokes to be overridden via a programmatic rule.
PaletteProviders are attached to the `BaseRenderableSeries.paletteProvider` property. They are called during the render process to return an overridden colour
(or undefined for default colour) allowing the stroke, fill, or pointmarker stroke/fill to be updated dynamically, allowing creation of
thresholds, warnings, and highlighting areas of interest in your data. For example, you can change the fill of a time-based histogram depending on day
of the week, or change the colour of a column (bar) chart displaying Volume in financial charts depending on whether the candle was red or green.

In combination with the PaletteProvider API, we also have a [PaletteFactory](../../2d-charts/chart-types/palette-provider-api/palette-factory/)
helper class which can create predefined palettes such as gradient fills in X or Y, which may be applied to line, scatter, column, mountain, area series and more.

### RenderDataTransforms - transform data and switch rendering immediately before draw on 2D Charts

`RenderDataTransforms` (see [RenderDataTransforms API](../../2d-charts/chart-types/render-data-transforms-api/)
allow you to transform data immediately before rendering, allowing for skipping or insertion of points for drawing (without affecting hit-test or drawing or actual data),

Some use-cases of `RenderDataTransforms` include:
- Interpolating Data: The `RenderDataTransforms` API is used internally to draw spline (bezier) series types
- Switching styles on series: for example changing the point-marker on a series dynamically during rendering
- Splitting line segments: for example, inserting extra points to define thresholds with discrete colour changes at a specific level
- Adding gaps to series: for example, by manipulating NaN values

### SVG Overlays on 2D and 3D Charts
The `SciChartSurface` type has several SVG layers which can be drawn to for any custom overlay (think: custom tooltips, legend, annotations or content) should the
built-in methods of customising rendering be insufficient. These are accessible via properties on the `SciChartSurface` such as [domSvgContainer](../../typedoc/classes/scichartsurface.html#domsvgcontainer).

### CustomRenderableSeries (Custom Series in 2D Charts)

At the time of writing, `CustomRenderableSeries` - a type which allows you to create a custom 2D chart type by accessing rendering functions within SciChart.js - is not
available. Custom Series are supported in other platforms of SciChart (SciChart WPF, iOS, Android) and will be ported to SciChart.js in future versions.
If this is needed in your project or you would like to enquire more, contact [tech support](https://www.scichart.com/contact-us)

## What other API Features does SciChart.js have?

SciChart.js features several other miscellaneous APIs to allow creating rich, interactive and flexible charts for the most demanding applications.
This is not an exhaustive list of what's possible with SciChart.js, but provides an overview of the APIs which allow extensibility and flexibility
of the chart for almost any requirement in scientific, medical, financial, industrial and business data visualisation.

These additional API features include:

- [Pixel to Data-point Conversion APIs](../../2d-charts/axis-api/misc/pixel-and-data-coordinates/)
- [Retina and Browser Zoom Support](../../2d-charts/miscellaneous-apis/retina-support-and-browser-zoom/)
- [Ordered Rendering](../../2d-charts/miscellaneous-apis/ordered-rendering/), allowing to control the order of rendering of chart series, chart annotations and chart gridlines
- [Render Events and callbacks](../../2d-charts/miscellaneous-apis/render-events/),
such as `redrawRequested`, `preRenderAll`, `preRender`, `layoutMeasured`, `rendered`, `renderedToWebGL`, `renderedToDestination` and `painted`
allowing precise control over insertion of commands and fine-grained monitoring of performance
- [Axis VisibleRange Changed Callbacks](../../2d-charts/axis-api/ranging-scaling/listen-to-visible-range-changes/) allow you to be notified of
changes to an axis range, such as zoom changes, pan changes, programmatic or user-zoom changes. Including the [ZoomState](../../get-started/faqs/faq-zoomState/)
property, it is possible to detect if the user is zooming or panning and apply custom logic to your chart.
- [Memory Debug tools](../../2d-charts/performance-tips/memory-leak-debugging/) are also included as
well as detailed documentation on [Memory Best Practices](../../2d-charts/performance-tips/memory-best-practices/)
and [Performance Tips](../../2d-charts/performance-tips/performance-tips-and-tricks/) to get the best possible performance out of SciChart.js
- [Data Filters API](../../2d-charts/chart-types/data-filters-api/data-filters-api-overview/),
similar to `RenderDataTransforms`, the Data Filters API allows transforms on data before rendering, allowing you to create moving averages, low-pass or high-pass filters
in Digital Signal Processing, calculate the ratio between two series, scale or offset a series, and apply linear regression line fitting to series.
Custom filters can be created for any complex data-filtering scenario and filters may be chained (output of one filter as input to the next) for more complex operations.
- [Data Labels API](../../2d-charts/chart-types/data-point-labels/data-labels-api-overview/) allows placement of per-point text labels on data-points.
Text labels can display the Y-value, X-Y value, can be multi-line, can be custom text and support various culling options for showing/hiding labels which overlap.
- [Builder API (JSON Builder)](../../2d-charts/builder-api/builder-api-overview/),
a complete way to define charts via JSON or JavaScript objects, vs. programmatic creation of charts in JavaScript.
The Builder/JSON API allows creation of pre-defined chart configurations or partially configured charts which may be serialized, deserialized
or created programmatically in your application. JSON served from a server can be used to populate a chart on the client.
- [Serialization / Deserialization](../../2d-charts/builder-api/charts-serialization-deserialization/)
- [Drawing Gaps in series](../../2d-charts/chart-types/common-series-apis/drawing-gaps/) - drawing gaps or handling null data-points in polyline, mountain (area) and other series types by using Y=NaN
- Batching or temporarily suspending drawing via the [Update Suspender API](../../2d-charts/miscellaneous-apis/batching-updates-or-temporary-suspending-drawing/#the-suspend-updates-api)
- [Effects (glow, dropshadow)](../../2d-charts/miscellaneous-apis/glow-and-dro-shadow-shader-effects/) - experimental shaders which can be applied to series to provide glow effect (oscilloscope / VDU style effect). These may not work on all
hardware due to the complexity of the shaders.

