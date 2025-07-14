---
sidebar_position: 10
---

# Chart Styling - Chart Titles

New to SciChart.js v3.1, we've added a Chart Title property allowing for multi-line titles on the top, left, right, bottom of the chart and with various alignment options.

Adding a chart title is simple, you can do so with the following code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>

    ```ts showLineNumbers file=./ChartTitles/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./ChartTitles/demo.ts start=region_B_start end=region_B_end
 
    ```
 
</CodeSnippetBlock>
 

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./ChartTitles/demo" />

:::tip
For an example of multiline chart titles see the [Chart Title demo](https://scichart.com/demo/javascript-chart-title) in our examples suite.
:::

Title Styling and Positioning
-----------------------------

For styling and positioning a title we can use [I2DSurfaceOptions.titleStyle:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/i2dsurfaceoptions.html#titlestyle) property in constructor options or a surface property [SciChartSurface.titleStyle:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#titlestyle). Available styling options are defined by **[TChartTitleStyle:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/index.html#tcharttitlestyle)** type.

:::note
When setting via a surface instance, titleStyle should be assigned to an object (or partial object) of type instead of directly setting individual properties. The object then will be merged with the current or default title style.
:::

### Text Styling

Base text styling options for a chart title are:

*   **fontSize**
*   **fontFamily**
*   **color**

```ts
// Text Styling

sciChartSurface.titleStyle = {
    fontSize: 30,
    fontFamily: "Arial",
    color: "#EC0F6C",
    fontWeight: "900",
    fontStyle: "italic",
}
```

Additionally we can set **fontWeight** and **fontStyle** for non-native text title. Find out more info about limitations in the **Native Text section** of the docs below.

### Title Positioning

A title could be placed on different sides relative to the surface. The options are defined by **[ETitlePosition:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/etitleposition.html)** enum and are set by **TChartTitleStyle.position**.

To specify an anchor for a title using **TChartTitleStyle.alignment**, where options are defined in ETextAlignment enum.

Also it is possible to place a title within the series view area using **TChartTitleStyle.placeWithinChart** flag.

```ts
// Title Positioning

const {
    // ...
    ETitlePosition,
    ETextAlignment,
} = SciChart;
// or import { ETitlePosition, ETextAlignment } from "scichart";
sciChartSurface.titleStyle = {
    position: ETitlePosition.Left,
    alignment: ETextAlignment.Right,
    placeWithinChart: true,
};
```

Multiline Chart Titles
----------------------

To set multiline text as a title we can pass it as an array of lines or split lines with the new line character (\\n).

Properties that could be applied to the multiline text are

*   **TChartTitleStyle.multilineAlignment**
*   **TChartTitleStyle.lineSpacing**

:::tip
The multilineAlignment options are described in [EMultiLineAlignment:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/emultilinealignment.html) enum. The lineSpacing is a multiple of the line height.
:::

```ts
// Multiline Chart Titles

const { EMultiLineAlignment } = SciChart;
    // Add multiline chart title
    sciChartSurface.title = \["First line", "Second line", "Third line"\]; // "Or 'FirstLine \\n Second line'
    // Modify multiline text related options for the title
    sciChartSurface.titleStyle = {
        multilineAlignment: EMultiLineAlignment.Right,
        lineSpacing: 1.5
}
```

WebGL Native Text Titles
------------------------

It is possible to enable the Native Text Rendering for the Chart Title. This can improve the rendering performance and allows using custom fonts, but have some differences and limitations compared to the non-native text rendering (e.g. native text doesn't support fontWeight and fontStyle). Find more info about the [Native Text API here](/2d-charts/miscellaneous-apis/native-text-api).

The Native Text Rendering for a chart title is set by **TChartTitleStyle.useNativeText** flag or uses the default value defined in [SciChartDefaults.useNativeText:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartdefaults.html#usenativetext).

Title Rendering Customisation
-----------------------------

For an advanced customization of the chart title rendering one may use a custom Chart Title Renderer.

The Chart Title renderer could be accessed or set with [SciChartSurface.chartTitleRenderer:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#charttitlerenderer) property.

:::note
The default Chart Title Renderer additionally provides a debug rendering and caching of non-native text which could be toggled with [ChartTitleRenderer.drawDebug:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/charttitlerenderer.html#drawdebug) and **[ChartTitleRenderer.useCache:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/charttitlerenderer.html#usecache)** flags appropriately.
:::