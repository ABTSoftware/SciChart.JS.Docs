---
sidebar_position: 1
---

# Creating your first SciChart3DSurface

The root 3D chart view is called the [SciChart3DSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html). This is the JavaScript chart control you will be adding to your applications wherever you need a 3D chart. You can add more than one [SciChart3DSurface:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html) to an HTML page, you can configure them independently.

Let's start by declaring one:

<CodeSnippetBlock labels={["TS"]}>
```ts showLineNumbers file=./BasicChart/demo.ts start=region_A_start end=region_A_end
```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./BasicChart/demo" htmlPath="./BasicChart/demo.html" cssPath="./BasicChart/demo.css" />

:::tip
Click on **Edit in Codepen** above to create a copy of this example in CodePen that you can edit. Note in codepen settings the reference to [https://cdn.jsdelivr.net/npm/scichart/index.min.js](https://cdn.jsdelivr.net/npm/scichart/index.min.js)
:::

Breaking the example down
-------------------------

### Referencing SciChart library & Imports

First need to have the correct scripts and imports. When loading SciChart.js in pure javascript (no npm), this is done by including index.min.js from [jsdelivr.com/package/npm/scichart](https://www.jsdelivr.com/package/npm/scichart) and declaring constants as follows:

<CodeSnippetBlock labels={["Pure JS imports for SciChart3D.js"]}>
```js
<script src="https://cdn.jsdelivr.net/npm/scichart/index.min.js"></script>

const {
    SciChart3DSurface,
    NumericAxis3D,
    Vector3,
    SciChartJsNavyTheme,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    ResetCamera3DModifier
} = SciChart;
```
</CodeSnippetBlock>

If using npm, instead you can import types from "scichart":

<CodeSnippetBlock labels={["NPM imports for SciChart3D.js"]}>
```js
// npm install scichart

import {
    SciChart3DSurface,
    NumericAxis3D,
    Vector3,
    SciChartJsNavyTheme,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    ResetCamera3DModifier
} from "scichart";
```
</CodeSnippetBlock>

### Creating the 3D SciChartSurface

Once you have referenced the library and have the correct imports or constants, you can now use SciChart's API to create a 3D chart surface.

<CodeSnippetBlock labels={["Creating SciChart3DSurface"]}>
```ts {2} showLineNumbers
// Create a SciChart3DSurface in the host <div id=".." />
const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
    // Optional theme
    theme: new SciChartJsNavyTheme(),
    // Optional dimensions of the axis cube (X,Y,Z) in World coordinates
    worldDimensions: new Vector3(300, 200, 300),
    // Optional initial camera position and target
    cameraOptions: {
        position: new Vector3(300, 300, 300),
        target: new Vector3(0, 50, 0)
    }
});

// SciChart.js 3D supports only a single x,y,z axis. Declare your axis like this
sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" });
sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });
```
</CodeSnippetBlock>

This will now show a 3D chart on the screen with default sizing of the X,Y,Z axis and position of the 3D camera.

### Serving Wasm (WebAssembly) Files

At this point you may get an error in the console depending on your environment:

:::warning
Could not load SciChart WebAssembly module. Check your build process and ensure that your scichart3d.wasm and scichart3d.js files are from the same version
:::

If so, find out how to resolve this at the page [Deploying Wasm and Data files](/2d-charts/surface/deploying-wasm/index.md).

### Adding Optional Zoom & Pan Behaviour

The last step, In SciChart.js interactivity is provided by ChartModifiers. These are classes which inherit **ChartModifierBase** which receive events such as mouseDown, mouseMove, mouseUp. All the zooming, panning, tooltip and interaction behaviour in SciChart.js comes from the modifier API which is shared between 2D and 3D SciChart.

You can declare and add some built-in modifiers to add zooming, panning behaviour to the chart. Find these below:

<CodeSnippetBlock labels={["Adding chart modifiers"]}>
```ts showLineNumbers
// Optional: add zooming, panning for the example
sciChart3DSurface.chartModifiers.add(
    new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
    new OrbitModifier3D(), // provides 3d rotation on left mouse drag
    new ResetCamera3DModifier()
); // resets camera position on double-click
```
</CodeSnippetBlock>

Congratulations! You have just created your first SciChart3DSurface!