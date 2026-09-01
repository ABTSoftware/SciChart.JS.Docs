---
sidebar_position: 1
---

# What's New in SciChart.js SDK v5.2

## SciChart Financial Drawing Tools Extension

New [scichart-financial-tools](https://www.npmjs.com/package/scichart-financial-tools) NPM package.
You will find [financial tools documentation here](/scichart-extensions/scichart-financial-tools/overview/).

New trading annotations:

* ChannelAnnotation
* DisjointChannelAnnotation
* FlatBottomChannelAnnotation
* ExtendedLineAnnotation
* FibonacciRetracementAnnotation
* MeasureAnnotation
* PitchforkAnnotation
* PitchfanAnnotation
* StopLossTakeProfitAnnotation

New modifiers:

* MultiPointAnnotationPlacementModifier
* FreehandDrawingModifier

New data filters:

* Heikin-Ashi data filter
* Renko data filter
* PointAndFigureFilter

## New Features

* Composite annotations (combine multiple annotations into one)
* Smith Chart demo
* Force Direction Graph demo
* Arbitrary contour chart levels (zLevels property on UniformContoursRenderableSeries)
* Pinch zoom support for XAxisDragModifier and YAxisDragModifier
* 3D Series Selection Modifier

## New Server Side Licensing

SciChart.js v5.2 **introduces Simple Server Validation** — a new Advanced Licensing option designed to make server-side license validation as painless as possible.

Unlike our existing Native Server (OEM) deployment, Simple Server Validation requires **no native DLL, no FFI bridge, and no challenge/response handshake**. Your server simply computes an HMAC-SHA256 token from a shared Server Secret and returns it to SciChart.js, which verifies it in WASM and caches the result for 7 days. That means a single endpoint, a few lines of code, and you're done.

**Why you'll like it**

- **Drop-in integration** — typically under 20 lines of server code in any language that supports HMAC-SHA256.
- **No native dependencies** — pure managed code on the server side; nothing to install, nothing to patch.
- **Works anywhere** — Node.js, .NET (Minimal API and MVC), Spring Boot, Python, Go, Ruby, PHP, Rust.
- **Desktop apps too** — Electron and Tauri can compute the token in the privileged process and pass it to the renderer over IPC, keeping the secret out of the bundle.
- **Low overhead** — each browser only needs to hit your endpoint once per week, with automatic background re-validation every 24 hours.

Simple Server Validation is ideal for OEM scenarios where you need to deploy SciChart.js to unknown or user-controlled domains, or for desktop apps built on Electron or Tauri.

**Get started**

1. Full documentation, including step-by-step implementation guides for every supported stack: [Simple Server Validation — SciChart.js Docs:blue_book:](https://www.scichart.com/documentation/js/v5/user-manual/licensing-scichart-js/simple-server-validation/)
2. Runnable example projects for Node.js, ASP.NET Core (Minimal API and MVC), Spring Boot, Electron, and Tauri are on GitHub: [SciChart.JS.Examples — AdvancedLicensing](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v5.x/AdvancedLicensing)
3. Simple Server Validation requires a license with the SV (Simple Validation) feature flag. If you'd like this enabled on your order, please [contact technical sales](https://www.scichart.com/contact-us/#pre-sales) or [submit a support request](http://scichart.com/contact-us#tech-support).

:::warning
**Heads up:** the My Account page changes that let you self-serve your Server Secret may not be live on release day, but they're following close behind. In the meantime, please reach out to support and we'll get your Server Secret to you directly.
:::

## Improvements and Bug Fixes

* Anti-aliasing improvements for arc annotation rendering
* SCJS-2422: Fixed Native Text Shared Cache bug with multiple SciChartSurfaces and custom fonts
* SCJS-2406: Fixed text measure and label cache issues
* SCJS-2397: Fixed line rendering freeze
* SCJS-2405: Fixed metadata updates on 3D not invalidating
