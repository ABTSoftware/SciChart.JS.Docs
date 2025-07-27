---
sidebar_position: 3
---

# Visibility of Axis Elements

In SciChart.js all the elements of an axis may be hidden or shown invidually, with the following code:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./AxisVisibility/demo.ts start=region_A_start end=region_A_end

    ```
    ```ts showLineNumbers file=./AxisVisibility/demo.ts start=region_B_start end=region_B_end

    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./AxisVisibility/demo" />

A hidden axis still behaves like an axis with all the scaling that comes with it, just without the visual elements like labels and gridlines.

Using Hidden Axis to Scale a Series to Viewport
-----------------------------------------------

Other than styling, a hidden axis is very useful to scale a series to a viewport.

Say you had a chart with two series on the same Y-Axis, and with different amplitudes. You want to click a button to maximise a series to the viewport. You can do this with a hidden axis.

Here's a code sample below:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./DynamicAxisVisibility/demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./DynamicAxisVisibility/demo" htmlPath="./DynamicAxisVisibility/demo.html" cssPath="./DynamicAxisVisibility/demo.css" />
