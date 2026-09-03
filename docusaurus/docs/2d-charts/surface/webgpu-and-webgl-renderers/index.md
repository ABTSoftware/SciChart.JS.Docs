---
sidebar_position: 5
---

# WebGPU and WebGL Renderers

SciChart.js draws with its own WebAssembly rendering engine, which talks to the GPU through one of two browser graphics APIs: **WebGL 2** or **WebGPU**.

**From v6, WebGPU is the default**, with automatic fallback to WebGL 2 when WebGPU is unavailable. Existing applications need no code change — but you can pin either renderer explicitly, in code or from the browser, and this page shows how.

## What are WebGL and WebGPU?

**WebGL 2** is the long-established browser graphics API, derived from OpenGL ES 3.0 and available in every current browser since 2017. It is a *stateful* API: there is one big global context whose state you mutate before each draw, and the browser validates that state on every call.

**WebGPU** is its successor, modelled on the modern native APIs (Vulkan, Metal and Direct3D 12) rather than on OpenGL. Work is described up front as immutable **render pipelines** and **bind groups**, then submitted in **command buffers**, so the per-draw cost of validation and state juggling largely disappears.

### Which one should you use?

| | WebGL 2 | WebGPU |
|---|---|---|
| Maturity | Very stable, universally supported, years of driver hardening | Newer; browser and driver support still maturing |
| Availability | Effectively everywhere | Modern desktop browsers, plus increasing mobile support |
| SciChart support | Fully supported, and the automatic fallback | The default from v6 |

**WebGL 2 is the more conservative choice.** It has the longest track record, the widest reach, and the most predictable behaviour across old GPUs, virtual machines, remote desktops and headless CI environments. If you need one renderer that behaves identically everywhere, this is it.

**WebGPU is the newer option, and brings real benefits:**

* **Lower CPU overhead per draw call.** Pipeline state is validated once when the pipeline is created rather than on every draw, which matters for charts that issue many draws per frame.
* **One GPU device can present to many canvases.** This is the big one for SciChart, and it removes a per-frame copy step when you have several charts on a page — see [Where WebGPU wins](#where-webgpu-wins-many-charts-on-one-page) below.
* **Compute shaders**, opening up GPU work that WebGL 2 cannot express.
* **Modern texture formats.** Where the adapter offers them, SciChart opts into `float32-filterable` (filterable 32-bit float textures) and `texture-compression-bc` (BC compressed textures).
* **A design built for the GPUs and drivers of today**, so it is where browser vendors' graphics work is now focused.

The practical answer for most applications is **leave the default alone**. WebGPU is used where it works, WebGL 2 is used where it does not, and the switch happens without your involvement.

## How SciChart.js chooses a renderer

At engine startup SciChart probes for WebGPU:

1. Is `navigator.gpu` present?
2. Can a high-performance adapter be acquired via `navigator.gpu.requestAdapter()`?
3. Can a device be acquired from that adapter via `adapter.requestDevice()`?

If any step fails — no `navigator.gpu`, no adapter, or a device that cannot be brought up (a driver fault, for instance) — SciChart logs a `console.warn` naming the step that failed and **falls back to WebGL 2**. Each warning is prefixed `SciChart.js:`, so a quick look at the console tells you which renderer you ended up on and why.

The choice applies to **both 2D and 3D charts**, and to both `SciChartSurface.create()` and `SciChartSurface.createSingle()`.

:::note
The renderer is resolved **once** during engine initialisation and used for the lifetime of the page. There is no way to switch renderer on a chart that already exists.
:::

## Switching renderer in code

Call `WebGpuHelper.setWebGpuSupported(false)` to force WebGL 2. It must run **before the first surface is created**, because that is when the engine initialises:

```ts
import { SciChartSurface, WebGpuHelper } from "scichart";

// Force WebGL 2 - must be called BEFORE creating any SciChartSurface
WebGpuHelper.setWebGpuSupported(false);

const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id");
```

:::warning
Calling this after a chart exists has no effect on that chart. Put it at the top of your app's startup code, before any `await SciChartSurface.create(...)`.
:::

### Checking which renderer is active

```ts
import { WebGpuHelper } from "scichart";

// Which renderer is in use? This is the authoritative answer.
const usingWebGpu = WebGpuHelper.getWebGpuSupported();

// Was a WebGPU device successfully acquired? (see the caveat below)
const device = WebGpuHelper.getCachedWebGPUDevice();
```

The two answer different questions, and it is worth being precise about which you want:

* **`getWebGpuSupported()` is the one to use** to find out what SciChart is actually rendering with. It reports the *intent* before the probe has run and the *outcome* after — the probe flips it to `false` on failure.
* **`getCachedWebGPUDevice()` reports only whether a `GPUDevice` was acquired**, which is not the same thing as WebGPU being in use.

:::note
If you force WebGL 2 with `setWebGpuSupported(false)` while local storage still permits WebGPU, SciChart renders with WebGL 2 as asked, but the startup probe has already run and cached a `GPUDevice`. So `getCachedWebGPUDevice()` can return a device even though WebGL 2 is doing the drawing. Treat `getWebGpuSupported()` as the source of truth; the same caveat applies to `webGpuDeviceAcquired` in the diagnostics below. To avoid the situation entirely, disable WebGPU through local storage instead of in code.
:::

For a single readout of everything the engine decided, including the renderer, call the static diagnostics helper:

```ts
import { SciChartSurface, Logger } from "scichart";

Logger.enableLog = true; // the helper logs through Logger, which is off by default

const { webGpu, wasm64, simd, details } = SciChartSurface.debugWasmWebGPU();
console.log("Renderer:", webGpu ? "WebGPU" : "WebGL");
```

It returns the values whether or not logging is enabled, so you can assert on them in tests. `details` includes `navigatorGpuPresent` and `webGpuDeviceAcquired`, which together distinguish "this browser has no WebGPU" from "WebGPU exists but failed to start".  Read `webGpu` for the renderer actually in use.

## Switching renderer in the browser

You can also switch renderer **without touching code**, by setting `IS_WEB_GPU` to `"0"` in the browser's local storage. Run this in the DevTools console and reload:

```javascript
// Force WebGL 2, then reload the page
localStorage.setItem("IS_WEB_GPU", "0");
location.reload();
```

```javascript
// Back to the default (WebGPU where available), then reload
localStorage.removeItem("IS_WEB_GPU");
location.reload();
```

:::tip
This is the quickest way to compare the two backends against the exact same page — flip the flag, reload, and measure again. It is also a useful first diagnostic step for a rendering problem: if forcing WebGL 2 makes it disappear, the issue is backend-specific.
:::

The value is read **once when the SciChart module loads**, which is why a reload is required. Any value other than `"0"` (including the key being absent) means the default: use WebGPU where available.

## Where WebGPU wins: many charts on one page

This is the case where the difference is structural rather than incremental.

**Under WebGL 2**, a page may only hold a limited number of live WebGL contexts. [`SciChartSurface.create()`](/2d-charts/surface/new-scichart-surface/) works around that limit by sharing **one** WebGL context, on one hidden master canvas, across every chart on the page. Each surface renders into its own region of that master canvas, and the result is then **copied** out to that chart's own destination canvas. That copy happens once per chart, every frame — so a dashboard of 30 charts pays 30 blits per frame on top of the actual drawing.

`SciChartSurface.createSingle()` exists to avoid the copy by giving a chart its own context, but it trades one problem for another: you are then back under the browser's context limit, so it does not scale to many charts.

**Under WebGPU**, a single `GPUDevice` can present to many canvas swapchains at once. Each surface renders **directly into its own canvas** — there is no shared master canvas and **no copy step at all**. The context-limit problem that motivated the shared-canvas design simply does not exist, so `create()` gets the direct-rendering benefit *and* unlimited chart counts.

The more charts on the page, the wider the gap. Dashboards built from many small charts see the largest improvement; a single full-page chart sees comparatively little, because there was only ever one copy to eliminate.

:::note
If you have custom drawing code that assumed the shared master canvas and its copy step, be aware the layout differs between backends. See [Render Events](/2d-charts/miscellaneous-apis/render-events/) for the per-backend canvas model.
:::

## Browser support and fallback

WebGPU support is still expanding, and it varies by browser, operating system, GPU and driver. Rather than reproduce a matrix that ages badly, check [caniuse.com/webgpu](https://caniuse.com/webgpu) for the current state.

Environments where you should expect the WebGL 2 fallback to kick in include older browsers, some virtual machines and remote-desktop sessions, older or blocklisted GPU drivers, and many headless/CI browser setups.

Because the fallback is automatic and needs no code change, it is safe to ship with the default. The only reason to pin WebGL 2 explicitly is to guarantee one identical code path everywhere — for example, to keep visual-regression baselines stable.

## API Reference

:::warning TODO
The v6 Typedoc is not published yet, so the links below are placeholders. Once it is published, replace each `TODO` with a `:blue_book:` link under `https://www.scichart.com/documentation/js/v6/typedoc/`, and link these symbols inline in the sections above.
:::

| Symbol | Expected Typedoc path | Link |
|---|---|---|
| `WebGpuHelper` | `variables/webgpuhelper.html` | TODO |
| `WebGpuHelper.getWebGpuSupported()` | `variables/webgpuhelper.html#getwebgpusupported` | TODO |
| `WebGpuHelper.setWebGpuSupported()` | `variables/webgpuhelper.html#setwebgpusupported` | TODO |
| `WebGpuHelper.getCachedWebGPUDevice()` | `variables/webgpuhelper.html#getcachedwebgpudevice` | TODO |
| `WebGpuHelper.initializeWebGPUDevice()` | `variables/webgpuhelper.html#initializewebgpudevice` | TODO |
| `SciChartSurface.debugWasmWebGPU()` | `classes/scichartsurface.html#debugwasmwebgpu` (inherited from `SciChartSurfaceBase`) | TODO |
| `SciChartSurface.create()` | `classes/scichartsurface.html#create` | TODO |
| `SciChartSurface.createSingle()` | `classes/scichartsurface.html#createsingle` | TODO |
| `Logger` | `classes/logger.html` | TODO |

#### See Also

##### The SciChartSurface

* [SciChartSurface.create() vs. createSingle()](/2d-charts/surface/new-scichart-surface/)
* [Deploying Wasm (WebAssembly) with your app](/2d-charts/surface/deploying-wasm/)

##### Miscellaneous APIs

* [Render Events](/2d-charts/miscellaneous-apis/render-events/)

##### Performance

* [Performance Tips and Tricks](/2d-charts/performance-tips/performance-tips-and-tricks/)

##### What's New

* [What's New in SciChart.js SDK v6.0](/whats-new/sdk-6.0/)
