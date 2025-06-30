---
sidebar_position: 2
---

# ✅ Detecting Clicks On Chart Parts with a Custom Modifier

One of the uses of the custom ChartModifier API is to allow you to create custom behaviours and add them onto a SciChartSurface. These behaviours can be simple or complex, and perform zooming, panning operations or more.

Below we give an example of how to detect clicks on chart parts using the ChartModifier API. This results in the following output on mouse over.

<CenteredImageWrapper
    src="/images/ChartModifier-axis-hover-scichart-js.gif"
    alt="Detecting Clicks on Chart Parts with a Custom Modifier"
/>

Detecting Click or MouseOver on Axis, RenderableSeries 
-------------------------------------------------------

In the sample below we've created a custom chartmodifier which allows us to detect whether the mouse is over chart parts such as XAxis, YAxis and RenderableSeries.

The process to create a chart modifier is by extending ChartModifierBase2D and overridding one or more of the functions or callbacks that are called when we interact with the chart.

<CodeSnippetBlock labels={["TypeScript", "JavaScript"]}>
    ```ts showLineNumbers file=./DetectClicksOnChartPartsModifier.ts
    ```
    ```js showLineNumbers file=./DetectClicksOnChartPartsModifier.js
    ```
</CodeSnippetBlock>

Above: we create a custom chartmodifier by extending ChartModifierBase2D.

We override `onModifierMouseMove` (you could easily override onModifierMouseDown, MouseUp, MouseDoubleClick).

Next, we perform a series of tests to see if the mouse pointer is over an axis, or a series.

Try the above code with the following test harness:

<CodeSnippetBlock labels={["Custom Modifiers Sandbox"]}>
    ```ts showLineNumbers file=./customModifiersSandbox.ts
    ```
</CodeSnippetBlock>

Find the full code sample for detecting clicks or mouse-over chart parts at [github.com/ABTSoftware/SciChart.JS.Examples/tree/dev\_v2.x/Sandbox/DocumentationSnippets/ChartModifierAPI](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v2.x/Sandbox/DocumentationSnippets/ChartModifierAPI/src)