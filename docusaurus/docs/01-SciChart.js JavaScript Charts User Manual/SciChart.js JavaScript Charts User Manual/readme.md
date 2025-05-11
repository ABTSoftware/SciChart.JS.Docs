---
id: SciChartjs-JavaScript-Charts-User-Manual
title: SciChart.js JavaScript Charts User Manual
sidebar_position: 1
---

# SciChart.js JavaScript Charts User Manual


Are you new to SciChart? Check out our most popular pages to get started
below:

- [SciChart.js Vanilla JavaScript
  Tutorials](Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html)   
- [The SciChartSurface Type](SciChartSurface.html)               
- [Series or Chart Types](What%20is%20a%20RenderableSeries.html)
- [Axis Types and Configuration](StartHere-AxisOverview.html)
- [Zooming & Panning](ZoomPanModifier.html)
- [Tooltips](RolloverModifier.html)
- [Annotations and Markers](The%20Annotations%20API%20Overview.html)
- [Styling and Themeing](Chart%20Styling%20-%20ThemeManager%20API.html)
- [Chart Synchronization APIs](Synchronizing%20Multiple%20Charts.html)
- [3D charts Basics](Creating%20your%20first%20SciChartSurface3D.html) 

# What is SciChart.js?

SciChart.js is a [High-Performance Real-time 2D and 3D JavaScript Charting Library](https://www.scichart.com/javascript-chart-features).
Designed for use in scientific, financial, trading, engineering, medical
and business apps where you require extreme speed, rich interactivity
and depth of features and flexibility in a [JavaScript
chart](https://www.scichart.com/javascript-chart-features).

![Scichart](images/scichart-home-see-new-worlds.jpg)

Across [Windows](https://www.scichart.com/wpf-chart-features), [iOS/macOS](https://www.scichart.com/ios-charts), [Android](https://www.scichart.com/android-charts)
and
now [JavaScript](https://scichart.com/javascript-chart-features),
the SciChart Family is now in its 7th generation, and provides an
extremely rich, fast and interactive JavaScript charting experience with
a wide array of chart types, and the [JavaScript Charting
Library](https://www.scichart.com/javascript-chart-features)
is the newest edition to our portfolio, bringing high-performance,
realtime charts to web browsers and JavaScript applications.

The SciChart family is used by thousands of customers in over 80
countries worldwide, in sectors ranging from Defence to Medical,
Financial and Trading to Oil & Gas, Process Management to Formula 1.

When you become a SciChart customer, you join a community of developers
support by a world-class **JavaScript**, **WebGL** and **WebAssembly**
graphics & visualisation team and domain-experts around scientific
visualisation, performance optimisation and low-level software
techniques.

We want you to enjoy using our products as much as we enjoy making them,
as well as to succeed, so if you have any feedback good or bad, please
get in touch as **we want to hear from you**.

The following document serves as a reference and an overview of the
features in the SciChart.js JavaScript SDK. For a complete code
reference, see the [TypeDoc API
Documentation](https://www.scichart.com/documentation/js/current/typedoc/index.html)
and the [SciChart.js Examples
Suite](https://demo.scichart.com), which contains many
code samples you can run, export and modify for yourself.

# Table of Contents

Below you can find a table of Contents for the SciChart.js JavaScript
Chart SDK User Manual. Also you can use
the[ ]**links on the
left**[ ]

### Intro to the SciChart.js JavaScript Chart SDK

- SciChart.js JavaScript Charts User Manual
- - [SciChart.js JavaScript Charts User
    Manual](SciChart_JS_User_Manual.html)
  - [Minimum Browser Requirements](Minimum-Browser-Requirements.html)
  - [Online Resources and Help](Online-Resources-and-Help.html)
  - [Licensing SciChart.js](Licensing%20SciChart.js.html)

### The SciChart.js Examples Suite

- [The SciChart.js Examples Suite](The_SciChart_Js_Examples_Suite.html)

### SciChart.js 2D Charts Quickstart Guide

- Get Started: Tutorials, Examples
- - Tutorials (JavaScript APIs / npm / webpack)
  - - [Tutorial 01 - Setting up a npm Project with
      SciChart.js](Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html)
    - [Tutorial 02 - Adding Series and
      Data](Tutorial%2002%20-%20Adding%20Series%20and%20Data.html)
    - [Tutorial 03 - Adding Zooming, Panning
      Behavior](Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html)
    - [Tutorial 04 - Adding Realtime
      Updates](Tutorial%2004%20-%20Adding%20Realtime%20Updates.html)
    - [Tutorial 05 - Zoom and Pan with Realtime
      Updates](Tutorial%2005%20-%20Zoom%20and%20Pan%20with%20Realtime%20Updates.html)
    - [Tutorial 06 - Adding
      Annotations](Tutorial%2006%20-%20Adding%20Annotations.html)
    - [Tutorial 07 - Adding Tooltips and
      Legends](Tutorial%2007%20-%20Adding%20Tooltips%20and%20Legends.html)
    - [Tutorial 08 - Adding Multiple
      Axis](Tutorial%2008%20-%20Adding%20Multiple%20Axis.html)
    - [Tutorial 09 - Linking Multiple
      Charts](Tutorial%2009%20-%20Linking%20Multiple%20Charts.html)
    - [Tutorial 10 - Vertical
      Charts](Tutorial%2010%20-%20Vertical%20Charts.html)
  - Tutorials (index.min.js from CDN)
  - - [Tutorial 01 - Including SciChart.js in an HTML Page using
      CDN](Tutorial01IncludingSciChartjsHTMLPage.html)
    - [Tutorial 02 - Including index.min.js and WebAssembly Files
      offline](Tutorial02IncludeIndexMinJSWebassemblyFilesOffline.html)
  - Tutorials (SciChart React)
  - - [(Deprecated Tutorial) - Creating a SciChart React Component from
      the Ground Up](TutorialReusableReactComponent.html)
    - [Tutorial 01 - Setting up a project with scichart-react and config
      object](TutorialSetupProjectWithSciChartReact.html)
    - [Tutorial 02 - Creating a Chart with
      scichart-react](Tutorial02CreatingChartsWithInitChart.html)
    - [Tutorial 03 - Modifying Chart Data and Behavior in
      React](Tutorial03ModifyingChartDataBehaviourInReact.html)
    - [Tutorial 04 - Adding & Removing Charts To a Group in
      React](Tutorial04AddingRemovingChartsToAGroup.html)
    - [Tutorial 05 - Synchronizing React Charts with Data in a
      Group](Tutorial05SynchronizingReactCharts.html)
  - Worked Examples
  - - [How do I? \... Worked Examples with
      SciChart.js](WorkedExamplesHome.html)
    - [How to: Pan the Chart with the
      MouseWheel](HowToPanChartWithMousewheel.html)
    - [How to: Export an Image From Chart](ExportImageFromChart.html)
  - The SciChart.js Examples Suite
  - - [The SciChart.js Examples
      Suite](The_SciChart_Js_Examples_Suite.html)

### SciChart.js 2D Chart Documentation

- SciChart.js JavaScript 2D Charts API
- - The SciChartSurface (Root Chart Control)
  - - [The SciChartSurface Type](SciChartSurface.html)
    - [Creating a new SciChartSurface and loading
      Wasm](SciChartSurface.create%20and%20createSingle.html)
    - [Setting a Runtime License on a
      SciChartSurface](SciChartSurface.setRuntimeLicenseKey.html)
    - [Deploying Wasm (WebAssembly) and Data Files with your
      app](Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html)
  - 2D Chart Types
  - - [Start Here - RenderableSeries
      Overview](What%20is%20a%20RenderableSeries.html)
    - Common Series APIs
    - - [Series isVisible and isVisibleChanged
        API](Series%20isVisible%20and%20isVisibleChanged%20API.html)
      - [Drawing Gaps in Series (null data)](DrawingGapsInSeries.html)
      - [Drawing PointMarkers on Series (Scatter
        markers)](DrawingPointMarkersOnSeries.html)
    - Series Text DataPoint Labels API
    - - [Adding DataLabels to a Chart Series](AddingDataLabels.html)
      - [Data Label Positioning](DataLabelPositioning.html)
      - [Data Label Colouring](DataLabelColouring.html)
      - [Custom DataLabel Formatting with
        getText()](DataLabelFormattingAdvanced.html)
      - [Getting Labels from Metadata](DataLabelsFromMetadata.html)
      - [DataLabel SkipModes and Culling](DataLabelCulling.html)
    - Series PaletteProvider API
    - - [The PaletteProvider API](The%20PaletteProvider%20API.html)
      - [Per-point Colouring of Line
        Segments](Per-point%20Colouring%20of%20Line%20Segments.html)
      - [Per-point Colouring of Mountain
        Segments](Per-point%20Colouring%20of%20Mountain%20Segments.html)
      - [Per-Point Colouring of Band
        Segments](Per-Point%20Colouring%20of%20Band%20Segments.html)
      - [Per-Point Colouring of Bubble
        Charts](Per-Point%20Colouring%20of%20Bubble%20Charts.html)
      - [Per-Point Colouring of Candlestick / OHLC
        Charts](Per-Point%20Colouring%20of%20Candlestick%20Charts.html)
      - [Per-Point Colouring of Column
        Charts](Per-Point%20Colouring%20of%20Column%20Charts.html)
      - [Per-Point Colouring of Scatter Charts (or
        PointMarkers)](Per-Point%20Colouring%20of%20Scatter%20Charts.html)
      - [Per-Point Colouring of Impulse
        Charts](Per-Point%20Colouring%20of%20Impulse%20Charts.html)
      - [The PaletteFactory Helper
        Class](PaletteFactoryHelperClass.html)
    - Series Hit Test API
    - - [RenderableSeries Hit-Test API](Hit-Test%20API.html)
      - [Hit-Test API for Band
        Series](Hit-Test%20API%20for%20Band%20Series.html)
      - [Hit-Test API for Line
        Series](Hit-Test%20API%20for%20Line%20Series.html)
      - [Hit-Test API for Bubble
        Series](Hit-Test%20API%20for%20Bubble%20Series.html)
      - [Hit-Test API for Column
        Series](Hit-Test%20API%20for%20Column%20Series.html)
      - [Hit-Test API for Heatmap
        Series](Hit-Test%20API%20for%20Heatmap%20Series.html)
      - [Hit-Test API and
        Metadata](Hit-Test%20API%20and%20Metadata.html)
      - [Hit-Test API for Mountain
        Series](Hit-Test%20API%20for%20Mountain%20Series.html)
      - [Hit-Test API for Candlestick and OHLC
        Series](Hit-Test%20API%20for%20Candlestick%20and%20OHLC%20Series.html)
      - [Hit-Test API for Scatter
        Series](Hit-Test%20API%20for%20Scatter%20Series.html)
      - [Hit-Test API for Stacked Column
        Series](Hit-Test%20API%20for%20Stacked%20Column%20Series.html)
      - [Hit-Test API for Stacked Mountain
        Series](Hit-Test%20API%20for%20Stacked%20Mountain%20Series.html)
    - DataSeries (Data Updates) API
    - - [The DataSeries API](The%20DataSeries%20API.html)
      - [Append, Insert, Update,
        Remove](DataSeries_AppendInsertUpdateRemove.html)
      - [DataSeries Get Set value at
        Index](DataSeries_GetSetatIndex.html)
      - [DataSeries Realtime Updates](DataSeries_RealtimeUpdates.html)
      - [Data Resampling](DataSeries_Resampling.html)
      - [Deleting DataSeries Memory](DataSeries_DeletingMemory.html)
    - Data PointMetadata API
    - - [DataSeries PointMetaData
        Api](DataSeries%20PointMetaData%20Api.html)
      - [Metadata and
        PaletteProviders](DataSeries_PointMetadata_PaletteProviders.html)
      - [Metadata and Tooltips](DataSeries_PointMetadata_Tooltips.html)
      - [Metadata and HitTest](DataSeries_PointMetadata_HitTest.html)
    - Data Filters (Transforms) API
    - - [What is the Filters API](What%20is%20the%20Filters%20API.html)
      - [Scale Offset Filters](Scale%20Offset%20Filters.html)
      - [Linear Trendline Filter](Linear%20Trendline%20Filter.html)
      - [Moving Average Filter](MovingAverageFilter.html)
      - [Ratio Filter](Ratio%20Filter.html)
      - [Creating a Custom Filter](Creating%20a%20Custom%20Filter.html)
    - Render Data Transforms API
    - - [The RenderDataTransforms API](RenderDataTransform%20API.html)
    - [The Line Series Type](The%20Line%20Series%20Type.html)
    - [The Digital (Step) Line
      Series](The%20Digital%20(Step)%20Line%20Series.html)
    - [The Scatter Series Type](The%20Scatter%20Series%20Type.html)
    - [The Mountain (Area) Series
      Type](The%20Mountain%20(Area)%20Series%20Type.html)
    - [The Digital (Step) Mountain Series
      Type](The%20Digital%20(Step)%20Mountain%20Series%20Type.html)
    - [The Column Series Type](The%20Column%20Series%20Type.html)
    - - [Column Series Data Point Width
        Mode](ColumnSeriesDataPointWidthMode.html)
    - [The Uniform Heatmap Chart
      Type](The-Uniform-Heatmap-Chart-Type.html)
    - - [Updating (Realtime) Heatmaps](Updating-Uniform-Heatmaps.html)
      - [Heatmap ColorMaps and Legends](Uniform-Heatmap-Colormaps.html)
    - [The Non-Uniform Heatmap Chart
      Type](The-Non-Uniform-Heatmap-Chart-Type.html)
    - [The Contours Series Type](The%20Contours%20Series%20Type.html)
    - [The Candlestick Series
      type](The%20Candlestick%20Series%20type.html)
    - [The OHLC Series Type](The%20OHLC%20Series%20Type.html)
    - [The Lollipop (Impulse or Stem) Chart
      Type](The%20Lollipop%20(Impulse%20or%20Stem)%20Chart%20Type.html)
    - [The Error Bars Chart
      Type](The%20Error%20Bars%20Chart%20Type.html)
    - [The Band Series type](The%20Band%20Series%20type.html)
    - [The Digital (Step) Band Series Type](DigitalBandSeriesType.html)
    - [The Bubble Series Type](The%20Bubble%20Series%20Type.html)
    - [The Fan Charts Type](The%20Fan%20Charts%20Type.html)
    - [The Stacked Column Series
      Type](The%20Stacked%20Column%20Series%20Type.html)
    - [The Stacked Mountain Series
      Type](The%20Stacked%20Mountain%20Series%20Type.html)
    - [The Pie Chart Type](The%20Pie%20Chart%20Type.html)
    - [The Donut Chart Type](The%20Donut%20Chart%20Type.html)
    - [The Spline (Smoothed) Line Series
      Type](The%20Spline%20(Smoothed)%20Line%20Series%20Type.html)
    - [The Spline (Smoothed) Mountain Series
      Type](The%20Spline%20(Smoothed)%20Mountain%20Series%20Type.html)
    - [The Spline (Smoothed) Band Series
      Type](The%20Spline%20(Smoothed)%20Band%20Series%20Type.html)
    - [The Bezier (Smoothed) Stacked Mountain Series
      Type](TheSmoothStackedMountainSeriesType.html)
    - [The Text Series Type](TheTextSeriesType.html)
  - Builder (JSON Chart Definition) API
  - - [Intro to the Builder API](Intro%20to%20the%20Builder%20API.html)
    - [Creating a Simple Chart](Creating%20a%20Simple%20Chart.html)
    - [Creating a Pie Chart](Creating%20a%20Pie%20Chart.html)
    - [Working with Data](Working%20with%20Data.html)
    - [Complex Options](Complex%20Options.html)
    - [Custom Subtypes](Custom%20Subtypes.html)
    - [Serialization and Deserialization of
      Charts](Serialization%20and%20Deserialization%20of%20Charts.html)
  - Axis APIs
  - - [Start Here - Axis Overview in
      SciChart.js](StartHere-AxisOverview.html)
    - Axis Types
    - - [Common Axis Base Type and Options](CommonAxisBaseType.html)
      - [The Numeric Axis](NumericAxis.html)
      - [The DateTimeNumericAxis](DateTimeNumericAxis.html)
      - [The Logarithmic Axis](Logarithmic%20Axis.html)
      - [The Category Axis](CategoryAxis.html)
      - [Text / String Axis](TextStringAxis.html)
    - Axis Ranging, Scaling
    - - [Axis Ranging - AutoRange](Axis%20Ranging%20-%20AutoRange.html)
      - [Axis Ranging - Set Range and Zoom to
        Fit](Axis%20Ranging%20-%20Setting%20and%20Getting%20VisibleRange.html)
      - [Axis Ranging - How to Listen to VisibleRange
        Changes](Axis%20Ranging%20-%20How%20to%20Listen%20to%20VisibleRange%20Changes.html)
    - Axis Labels
    - - [LabelProvider API
        Overview](Axis%20Label%20Formatting%20-%20LabelProvider%20API.html)
      - [Axis Labels - The ENumericFormat
        Enum](AxisLabels-ENumericFormats.html)
      - [Custom LabelProviders: Dynamic Dates on
        Zoom](CustomLabelProvider_DynamicDates.html)
      - [Custom LabelProviders: Readable
        Numbers](CustomLabelProvider_Numeric.html)
      - [Rotating Axis Labels](RotatingAxisLabels.html)
      - [Text and Multi-Line Labels](MultiLineLabels.html)
      - [Image Labels](ImageLabels.html)
      - [Label Style, Alignment and
        Positioning](LabelAlignmentPositioning.html)
      - [Performance Considerations - Native Text Axis
        Labels](Axis%20Labels%20-%20Native%20Text.html)
    - Axis Tick, Label Interval
    - - [Gridline and Label Spacing
        (Interval)](Axis%20Ticks%20-%20Gridline%20and%20Label%20Spacing%20(Interval).html)
      - [The TickProvider
        API](AxisTicks-GridLineAndLabelSpacingProgrammatically.html)
      - [Fixed Label Intervals - Static Axis
        Feature](StaticAxisFeature.html)
    - Multi Axis and Layout
    - - [Secondary and Multiple
        Axis](Axis%20Alignment%20-%20Setting%20Axis%20Alignment.html)
      - [Vertical Charts (Rotate, Transpose
        Axis)](Axis%20Alignment%20-%20Create%20a%20Vertical%20Chart.html)
      - [Inner Axis
        Layout](Axis%20Layout%20-%20Inside%20and%20Central%20Axis.html)
      - [Central Axis Layout](CentralAxisLayout.html)
      - [Vertically Stacked Axis
        Layout](Axis%20Layout%20-%20Vertically%20Stacked%20Axis.html)
      - [Horizontally Stacked Axis
        Layout](Axis%20Layout%20-%20Horizontally%20Stacked%20Axis.html)
      - [Advanced Options - Custom Layout Managers](LayoutManagers.html)
    - Axis Styling
    - - [Title, Labels, Gridlines and Axis Band
        Style](Axis%20Styling%20-%20Title,%20Labels,%20Gridlines%20and%20Axis%20Bands.html)
      - [Axis Borders and
        Background](Axis%20Styling%20-%20Axis%20Borders.html)
      - [Visibility of Axis Elements](AxisVisibility.html)
    - Misc
    - - [Axis APIs - Convert Pixel to Data
        Coordinates](Axis%20APIs%20-%20Convert%20Pixel%20to%20Data%20Coordinates.html)
  - Animations API
  - - [The Animations API](Animations%20API.html)
    - [Series Startup Animations](Series%20Startup%20Animations.html)
    - [Style Transition Animations](Series%20Style%20Animations.html)
    - [Dataset Animations](Dataset%20Animations.html)
    - [Generic Animations](Generic%20Animations.html)
  - Annotations API
  - - [The Annotations API
      Overview](The%20Annotations%20API%20Overview.html)
    - [BoxAnnotation](BoxAnnotation.html)
    - [LineAnnotation](LineAnnotation.html)
    - [TextAnnotation](TextAnnotation.html)
    - [CustomAnnotation](CustomAnnotation.html)
    - [VerticalLineAnnotation](VerticalLineAnnotation.html)
    - [HorizontalLineAnnotation](HorizontalLineAnnotation.html)
    - [AxisMarkerAnnotation](AxisMarkerAnnotation.html)
    - - [Image AxisMarkerAnnotation](CustomAxisLabelAnnotation.html)
      - [SVG Axis Marker Annotation](CustomAxisMarkerAnnotationSVG.html)
    - [NativeTextAnnotation](NativeTextAnnotation.html)
    - [Editable Annotations](EditableAnnotations.html)
    - [Styling Annotation Selection](StylingAnnotationSelection.html)
    - [Annotation Hover](AnnotationHover.html)
  - ChartModifier API
  - - ChartModifier APIs
    - - [What is the ChartModifier
        API](What%20is%20the%20ChartModifier%20API.html)
      - [Common ChartModifiers
        Features](Common%20ChartModifiers%20Features.html)
    - Zooming and Panning
    - - [ZoomPanModifier](ZoomPanModifier.html)
      - [RubberBandXyZoomModifier](RubberBandXyZoomModifier.html)
      - [PinchZoomModifier](PinchZoomModifier.html)
      - [ZoomExtentsModifier](ZoomExtentsModifier.html)
      - [YAxisDragModifier](YAxisDragModifier.html)
      - [XAxisDragModifier](XAxisDragModifier.html)
      - [MouseWheelZoomModifier](MouseWheelZoomModifier.html)
      - [Easy Overview charts with
        SciChartOverview](SciChartOverview.html)
    - CursorModifier (Crosshair + Tooltips)
    - - [The CursorModifier Type](CursorModifier.html)
      - [Formatting CursorModifier Tooltip
        Items](CursorModifier_Formatting.html)
      - [Active Legends - CursorModifier output into a
        legend](CursorModifier_PlaceTooltipLegendExternally.html)
      - [Customizing the CursorModifier Tooltip Container
        Appearance](CursorModifier_CustomisingContainer.html)
      - [Interpolated Tooltip Values](InterpolatedTooltipValues.html)
    - RolloverModifier (VerticalLine + Tooltips)
    - - [Rollover Modifier](RolloverModifier.html)
    - VerticalSliceModifier (Multiple Vertical Lines + Tooltips)
    - - [The VerticalSliceModifier Type](VerticalSliceModifier.html)
      - [Formatting VerticalSlice Tooltip
        Items](VerticalSliceModifier_Formatting.html)
      - [Active Legends - VerticalSliceModifier output to a
        Legend](VerticalSliceModifier_ActiveLegends.html)
      - [Customizing VerticalSliceModifier Tooltip
        Containers](VerticalSliceModifier_CustomisingContainer.html)
    - Miscellaneous Modifiers
    - - [Legend Modifier](LegendModifier.html)
    - Selection
    - - [Series Selection](SeriesSelection.html)
      - [DataPoint Selection](DataPointSelection.html)
      - [Annotation Hover](AnnotationHover.html)
    - Custom Modifiers
    - - [Custom Chart Modifier API](CustomChartModifierAPI.html)
      - [Detecting Clicks On Chart Parts with a Custom
        Modifier](DetectingClicksOnChartParts.html)
  - Subcharts API
  - - [What is the SubCharts API?](WhatIsTheSubChartsAPI.html)
    - [SubCharts Positioning](SubChartPositioning.html)
    - [SubChart Sub Surface Transparency](SubSurfaceTransparency.html)
    - [SubCharts Html Container](SubChartsHtmlContainer.html)
    - [Worked Example: Re-usable Chart Groups with
      SubCharts](SubChartsWorkedExampleReusableChartGroups.html)
    - [Worked Example: Dynamic Multi-Panel charts with
      SubCharts](SubChartsWorkedExampleDynamicMultiPaneCharts.html)
    - [Worked Example: Resizable Multi Pane Charts with
      SubCharts](SubChartsWorkedExampleResizableMultiPanes.html)
    - [Worked Example: Using SubCharts to create a Large
      Dashboard](SubChartsWorkedExample10x10Grid.html)
  - Styling and Theming
  - - [Chart Styling - ThemeManager
      API](Chart%20Styling%20-%20ThemeManager%20API.html)
    - [Chart Styling - Creating a Custom
      Theme](Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html)
    - [Chart Styling - Style Chart Parts in
      Code](Chart%20Styling%20-%20Style%20Chart%20Parts%20in%20Code.html)
    - [Chart Styling - Margin and
      Padding](Chart%20Styling%20-%20Margin%20and%20Padding.html)
    - [Series Styling - Dash Line
      Patterns](Series%20Styling%20-%20Dash%20Line%20Patterns.html)
    - [Chart Styling - Image, Transparent or Blurred
      Backgrounds](Chart%20Styling%20-%20Images%20in%20Background.html)
    - [Chart Styling - Theming of Wait
      Loader](Chart%20Styling%20-%20Themeing%20of%20Wait%20Loader.html)
    - [CSS Classes, Ids](CSS%20Classes,%20Ids.html)
    - [Chart Styling - Auto Coloring](ChartStyling-AutoColoring.html)
    - [Chart Styling - Chart Titles](ChartTitles.html)
  - Chart Synchronization APIs
  - - [Synchronizing Multiple
      Charts](Synchronizing%20Multiple%20Charts.html)
    - [Synchronizing Vertical Charts](SynchronizingVerticalCharts.html)
  - Accessibility
  - - [Creating Accessible Charts](Creating%20Accessible%20Charts.html)
    - [Voice Over](Voice%20Over.html)
    - [Color and Contrast](Color%20and%20Contrast.html)
    - [Keyboard Accessibility](Keyboard%20Accessibility.html)
  - Miscellaneous APIs
  - - [Retina Support and Browser
      Zoom](Retina%20Support%20and%20Browser%20Zoom.html)
    - [Batching updates or Temporary Suspending
      Drawing](Batching%20updates%20or%20Temporary%20Suspending%20Drawing.html)
    - [Native Text Api](Native%20Text%20Api.html)
  - Performance Tips
  - - [Performance Tips & Tricks](Performance%20Tips.html)
    - [Memory Best Practices](MemoryBestPractices.html)
    - [Memory Leak Debugging](MemoryLeakDebugging.html)

### SciChart.js 3D Chart Documentation Coming soon

- SciChart.js JavaScript 3D Charts API
- - SciChart3D Basics
  - - [Creating your first
      SciChartSurface3D](Creating%20your%20first%20SciChartSurface3D.html)
    - [SciChart3DSurface.create() vs.
      createSingle()](CreateVsCreateSingle3D.html)
    - [Coordinates in 3D Space](Coordinates%20in%203D%20Space.html)
    - [The SciChartSurface Camera](The%20SciChartSurface%20Camera.html)
  - Axis3D APIs
  - - [Axis3D APIs Overview](Axis3D%20APIs.html)
    - [Numeric and Date Axis in
      SciChart3D](Axis%20Types%20in%20SciChart3D.html)
    - [Axis3D Text (Label) Formatting](Axis3DTextFormatting.html)
    - [Axis3D Gridline and Label Spacing
      (Interval)](Axis3DLabelInterval.html)
  - 3D Chart Types
  - - [The Scatter 3D Chart
      Type](The%20Scatter%203D%20Chart%20Type.html)
    - [The Bubble 3D Chart Type](The%20Bubble%203D%20Chart%20Type.html)
    - [The Surface Mesh 3D Chart
      Type](The%20SurfaceMesh%203D%20Chart%20Type.html)
    - [The Lines 3D Chart Type](ThePointLine3DChartType.html)
    - [The Column 3D Chart Type](Column3DChartType.html)
  - ChartModifier 3D API
  - - Zooming and Panning
    - - [Orbit Modifier 3D](OrbitModifier3D.html)
      - [Pinch Zoom Modifier 3D](PinchZoomModifier3D.html)
      - [Mouse Wheel Zoom Modifier 3D](MouseWheelZoomModifier3D.html)
      - [Reset Camera Modifier 3D](ResetCamera3DModifier.html)
    - Tooltips
    - - [Tooltip Modifier 3D](TooltipModifier3D.html)

### TypeDoc Documentation for SciChart.js

The [TypeDoc documentation for SciChart.js can also be found
here](https://www.scichart.com/documentation/js/current/typedoc/index.html),
or by clicking on API Documentation in the Treeview on the left.
