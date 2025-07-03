---
sidebar_position: 11
---

# ✅ Polar Chart Styling

Polar charts in SciChart.js are specialized charts designed for polar data visualization, which are circular in nature. They can be used to create various types of charts, such as radial bar, windrose, line, band, mountain, spider, scatter, heatmaps and more.

:::tip
There is also the [labelStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#labelstyle) property, which acts the same way as the [AxisBase.labelStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#labelstyle) property, allowing you to set the font, color, and other styles of the labels based on the [TLabelStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#ttextstyle) type.
:::

### Grid mode for Radial Gridlines

> The grid mode for radial gridlines can be controlled via the [gridlineMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#gridlineMode) property. This property determines how the radial gridlines are drawn.
>
> For a Spider/Radar chart look you can set this property to [EPolarGridLineMode.Polygon:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolargridlinemode.html#polygon), which will draw the gridlines as concentric polygons, or you can stick to the default [EPolarGridLineMode.Circles:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolargridlinemode.html#circles) which draws radial gridlines as arcs.

## Other Styling Properties

### Major Gridlines 
> aligned with labels having [majorGridLineStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#majorglstyle) and [drawMajorGridLines:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#drawmajorgl) properties.

### Minor Gridlines 
> between labels with [minorGridLineStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#minorglstyle) and [drawMinorGridLines:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#drawminorgl) properties.

:::tip
Both Major and Minor gridlines **style** objects have the [TGridLineStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#tgridlinestyle) type, which allows you to set the `color`, `thickness`, and `strokeDashArray` of the gridlines.

Also, the [drawMajorGridLines:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#drawmajorgl) and [drawMinorGridLines:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#drawminorgl) properties are `boolean` values that control whether the gridlines are drawn or not.    
:::

### Major Ticks 
> small marks, outside the axis, aligned with labels with [majorTickLineStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#majortickstyle) and [drawMajorTicks:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#drawmajorticks) properties.

### Minor Ticks 
> small marks, outside the axis, between labels with [minorTickLineStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#minortickstyle) and [drawMinorTicks:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#drawminorticks) properties.

:::tip
Both Major and Minor ticks **style** objects have the [TTickLineStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#tticklinestyle) type, which allows you to set the `color`, `tickSize`, and `strokeThickess` of the ticks.
:::


## Polar Axis Styling Example

Read the code comments carefully

<CodeSnippetBlock labels={["TS"]}>
    ```ts {18,21,25-26,29,49,53,58,59,61,63} showLineNumbers file=./demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet name="./demo" />

#### See Also

* [Polar Chart Layout](/docs/2d-charts/axis-api/multi-axis-and-layout/polar-chart-layout)