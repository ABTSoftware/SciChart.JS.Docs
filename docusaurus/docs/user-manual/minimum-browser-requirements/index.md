---
id: Minimum-Browser-Requirements
sidebar_position: 2
---

# ✅ Minimum Browser Requirements

:::tip
Are you new to SciChart? Check out our most popular pages to get started below:

* [Tutorials (JavaScript APIs / npm / webpack)](/docs/get-started/tutorials-js-npm-webpack/tutorial-01-setting-up-npm-project-with-scichart-js/index.md)
* [The SciChartSurface Type](/docs/2d-charts/surface/scichart-surface-type-overview/index.md)        
* [Series or Chart Types](/docs/2d-charts/chart-types/renderable-series-api-overview/index.md)
* [Axis Types and Configuration](/docs/2d-charts/axis-api/axis-api-overview/index.md)
* [Zooming & Panning](/docs/2d-charts/chart-modifier-api/zooming-and-panning/zoom-pan-modifier/index.md)
* [Tooltips](/docs/2d-charts/chart-modifier-api/rollover-modifier/index.md)
* [Annotations and Markers](/docs/2d-charts/annotations-api/annotations-api-overview/index.md)
* [Styling and Themeing](/docs/2d-charts/styling-and-theming/theme-manager-api/index.md)
* [Chart Synchronization APIs](/docs/2d-charts/chart-synchronization-api/synchronizing-multiple-charts/index.md)
* [3D charts Basics](/docs/3d-charts/scichart-3d-basics/scichart-3d-basics-overview/index.md)
:::

SciChart.js is a cutting-edge next-generation JavaScript Chart Library. As a result, we are using the latest technologies to draw our fast, real-time and interactive JavaScript charts.

Minimum requirement for deployment of an application with SciChart.js is **your browser must support WebAssembly (wasm) and WebGL 1 (preferably WebGL 2).**

A full table of which browsers are supported can be found at the [caniuse.com](https://caniuse.com/) website.

WebAssembly (wasm) Minimum Browser Support
------------------------------------------

According to [caniuse.com](https://caniuse.com/#search=webassembly), 95.79% of web modern browsers worldwide can use WebAssembly. This includes all major browsers: Chrome, Edge, Firefox, Safari, Opera on Windows, macOS, Linux as well as Android, iOS devices.

This compatibility % is set to increase as wasm becomes a standard across browsers, led by Google Chrome and adopted by others.

Minimum versions are found below:

[![](images/1.png)](https://caniuse.com/#search=webassembly)

WebAssembly is supported on

*   Chrome v57 or later
*   IE Edge v16 or later
*   Firefox v52 or later
*   Safari v11 or later
*   Opera v44 or later.
*   Almost all modern mobile and desktop browsers support WebAssembly.

WebAssembly can be enabled in some earlier browsers can by adjusting settings. See [caniuse.com](https://caniuse.com/#search=webassembly) for more information.

:::warning
Note: WebAssembly support is not available on Internet Explorer 11, but is available on IE Edge 16 or later, Google Chrome, FireFox and Safari
:::

WebGL 1 Minimum Browser Support
-------------------------------

According to [caniuse.com](https://caniuse.com/#search=webgl), 96.56% of web browsers worldwide support WebGL 1. SciChart achieves the best performance with a WebGL 2 browser support, but all features are available on WebGL 1.

Minimum versions can be found below

[![](images/2.png)](https://caniuse.com/#search=webgl)

WebGL 1 is supported on

*   Chrome v8 or later
*   IE Edge v12 or later
*   Firefox v4 or later
*   Safari v5 or later
*   Opera v12 or later.
*   Almost all modern mobile and desktop browsers support WebGL 1

WebGL 2 Minimum Browser Support
-------------------------------

According to [caniuse.com](https://caniuse.com/#search=webgl2), 95.1% of web browsers worldwide now support WebGL 2. SciChart achieves superior performance with WebGL 2, but will automatically drop down to WebGL 1 where this latest API is not available.

[![](images/3.png)](https://caniuse.com/#search=webgl2)

WebGL 2 is supported on

*   Chrome v56 or later
*   IE Edge v79 or later
*   Firefox v51 or later
*   Safari iOS v 15 or later
*   Safari mac v15 or later
*   Firefox for Android v107
*   Android Browser v108
*   Opera mobile v72

:::warning
Note: WebGL 2 support is not available on earlier versions of Safari (Desktop or mobile), but in cases where WebGL 2 is not available SciChart.js will automatically downgrade to WebGL 1.
:::
