---
sidebar_position: 7
---

# MouseWheelZoomModifier

SciChart.js provides an zooming / panning behavior when scrolling the mouse-wheel, or two-finger drag on touch devices via the [MouseWheelZoomModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/mousewheelzoommodifier.html), available out of the box.

Besides common features which are inherited from the [ChartModifierBase](/2d-charts/chart-modifier-api/common-features/) class, the [MouseWheelZoomModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/mousewheelzoommodifier.html) allows you to specify how fast the chart zooms in or out via the [growFactor property:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/mousewheelzoommodifier.html#growfactor).

Adding a MouseWheelZoomModifier to a Chart
------------------------------------------

A [MouseWheelZoomModifier:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/mousewheelzoommodifier.html) can be added to the [sciChartSurface.chartModifiers:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html#chartmodifiers) collection to enable scaling or panning behavior. For example:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts {6} showLineNumbers
    const { MouseWheelZoomModifier } = SciChart;
    // or for npm import { MouseWheelZoomModifier } from "scichart"

    // Add MouseWheel Zoom behavior
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier({
            growFactor: 0.001, // each mousewheel click zooms 0.1%
        })
    );
    ```

    ```ts {8} showLineNumbers
    // Demonstrates how to configure the MouseWheelZoomModifier in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EChart2DModifierType, EXyDirection } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        modifiers: [
            {
                type: EChart2DModifierType.MouseWheelZoom,
                options: {
                    growFactor: 0.001 // each mousewheel click zooms 0.1%
                }
            }
        ]
    });
    ```
</CodeSnippetBlock>


This results in the following behavior:

<CenteredImageWrapper
    src="/images/ChartModifiers_MouseWheelZoomModifier.gif"
/>
