---
sidebar_position: 6
---

# Larger Datasets with 64-bit WebAssembly

SciChart.js runs its chart engine as a WebAssembly module. By default that module is a **32-bit (wasm32)** build, whose linear memory is hard-capped at **4 GB** by the WebAssembly specification itself. For most applications that is far more than enough.

For applications that are not most applications, v6 adds an optional **64-bit (wasm64, also called Memory64)** build that raises the ceiling to **16 GB**. It is **opt-in** — `SciChartDefaults.useWasm64` defaults to `EUseWasm64.Never` — and SciChart always falls back to the wasm32 build when wasm64 cannot be used.

:::info
The only reason to enable wasm64 is that you are hitting, or expect to hit, the 4 GB wasm32 heap limit. It is **not** a general performance option: the trade is roughly **10% of throughput for 4× the memory ceiling**. For workloads actually up against the 4 GB wall that is an easy call, and for everything else it is a bad one. See [Disadvantages](#disadvantages) below.
:::

## What 64-bit WebAssembly gives you over 32-bit

A wasm32 module addresses its heap with 32-bit pointers. That is the whole story: 2<sup>32</sup> bytes is 4 GB, and no amount of available system RAM changes it. Exceed it and allocation fails inside the engine.

The Memory64 proposal widens pointers to 64 bits, so the address space is no longer the binding constraint. In practice the limit becomes whatever the browser is willing to hand out, which today is **16 GB** — SciChart's wasm64 build is linked with `-sMAXIMUM_MEMORY=16GB` to match.

| | wasm32 (default) | wasm64 |
|---|---|---|
| Pointer width | 32-bit | 64-bit |
| Maximum heap | 4 GB (spec limit) | 16 GB (current browser limit) |
| Binary | `scichart.wasm` / `scichart-nosimd.wasm` | `scichart-64.wasm` |
| SIMD | SIMD and non-SIMD variants | SIMD only |
| Browser support | Universal | Chromium 133+, Firefox 134+; not Safari |
| Enabled by default | Yes | No |

## How much more data can you load?

The honest answer is "about four times as much", since the ceiling goes from 4 GB to 16 GB. Turning that into a point count requires knowing how your data is stored.

SciChart holds data series values in the wasm heap as **doubles — 8 bytes per value**. So an `XyDataSeries` costs roughly **16 bytes per point** (one X plus one Y), and a series type with more values per point costs proportionally more:

| Series | Bytes/point | Points in 4 GB | Points in 16 GB |
|---|---|---|---|
| `XyDataSeries` (X, Y) | ~16 | ~250 million | ~1 billion |
| `XyyDataSeries` (X, Y1, Y2) | ~24 | ~170 million | ~670 million |
| `OhlcDataSeries` (X, O, H, L, C) | ~40 | ~100 million | ~400 million |

:::warning
Treat those as upper bounds, not budgets. The same heap also holds the engine itself, textures, resampling and render buffers, and any transient copies made while you append data — so the practical ceiling is meaningfully lower than the arithmetic suggests. Measure your own workload rather than sizing to these numbers.
:::

If you are near the limit, it is worth checking first whether you need the data resident at all. [Performance Tips and Tricks](/2d-charts/performance-tips/performance-tips-and-tricks/) covers data-reduction options that often remove the need for a bigger heap entirely.

## Advantages

* **Four times the heap ceiling**, 4 GB to 16 GB, which is the entire point.
* **No API changes.** Data series, series types and every other API behave identically. You set one flag; nothing else in your code changes.
* **Automatic fallback.** With `EUseWasm64.Auto`, browsers that support Memory64 get the 64-bit engine and everything else transparently gets the 32-bit one. There is no need to branch in application code.
* **SIMD is included.** The wasm64 build is compiled with SIMD, so you are not trading vectorisation away for address space.

## Disadvantages

* **Slower per operation — expect roughly 10%.** Our own testing measured **under 10%**, and on some workloads no measurable difference at all. That matches the wider picture: the Emscripten benchmark suite under V8 [averaged ~10%](https://github.com/WebAssembly/memory64/issues/31) (a 1.098× slowdown), with individual benchmarks ranging from no change to 1.37×, while [SpiderMonkey notes pathological cases can reach 2×](https://spidermonkey.dev/blog/2025/01/15/is-memory64-actually-worth-using.html). The cost is mostly **bounds checking**, not pointer arithmetic: on a 64-bit host an engine can reserve a wasm32 module's entire 4 GB address space up front, which makes an out-of-bounds access impossible and lets it skip bounds checks altogether. Memory64 removes that trick, so every memory access needs a real check. Pointer values crossing the JS boundary are also marshalled as `BigInt` rather than `Number`. **Benchmark your own scenario** — and do not enable wasm64 hoping for a speed-up.
* **Much narrower browser support.** Chromium 133+ and Firefox 134+ have it; Safari does not. Any wasm64 deployment therefore needs the wasm32 fallback served too, which means shipping more binaries, not fewer.
* **An extra binary to deploy, and a slightly larger one.** `scichart-64.wasm` is a separate, non-interchangeable file. It is **not** contained within `scichart.wasm`, and a missing one is the most common cause of a wasm64 load failure. Memory64 builds also carry [roughly 10–15% more code](https://github.com/WebAssembly/memory64/issues/31), from the extra bounds checks and wider data structures.
* **No non-SIMD variant.** There is no wasm64 build for browsers without SIMD — see the next section.
* **16 GB is still a ceiling**, just a higher one. wasm64 buys headroom; it does not make memory management someone else's problem.

## How wasm64 interacts with SIMD

SciChart ships **one** wasm64 binary and it is built with SIMD. There is no non-SIMD wasm64 variant. That produces one rule worth internalising:

:::warning
**No SIMD means no wasm64.** If SIMD is not in effect, SciChart loads a wasm32 binary regardless of `useWasm64` — *including* `EUseWasm64.Always`. Setting `useWasmSimd = EUseWasmSimd.Never` together with `useWasm64 = EUseWasm64.Always` silently gives you the 32-bit engine and the 4 GB limit.
:::

The full resolution, combining [`SciChartDefaults.useWasmSimd`](/2d-charts/surface/deploying-wasm/) and `SciChartDefaults.useWasm64`:

| `useWasmSimd` | `useWasm64` | Binary loaded |
|---|---|---|
| `Never` | anything, including `Always` | `scichart-nosimd.wasm` (wasm32, 4 GB) |
| `Always` or `Auto` on a SIMD browser | `Never` (default) | `scichart.wasm` (wasm32, 4 GB) |
| `Always` or `Auto` on a SIMD browser | `Auto` | `scichart-64.wasm` if Memory64 is supported, else `scichart.wasm` |
| `Always` or `Auto` on a SIMD browser | `Always` | `scichart-64.wasm`, or a load error if unsupported |
| `Auto` on a non-SIMD browser | anything | `scichart-nosimd.wasm` (wasm32, 4 GB) |

`FeatureDetectionHelper.supportsWasm64()` reflects this: it returns `true` only when **both** Memory64 and SIMD are available. Memory64 support is a strict subset of SIMD support — Safari has SIMD but not Memory64 — so the two checks are never redundant.

```ts
import { FeatureDetectionHelper } from "scichart";

FeatureDetectionHelper.supportsWasmSIMD(); // SIMD alone
FeatureDetectionHelper.supportsWasm64();   // Memory64 AND SIMD
```

Both results are cached after the first call.

## Enabling 64-bit mode

Set `SciChartDefaults.useWasm64` **before creating any chart**, since the value is read when the engine loads:

```ts
import { SciChartDefaults, EUseWasm64, SciChartSurface } from "scichart";

// Use wasm64 where the browser supports it, wasm32 everywhere else
SciChartDefaults.useWasm64 = EUseWasm64.Auto;

const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id");
```

### The three `EUseWasm64` values

| Value | Behaviour | Use when |
|---|---|---|
| `EUseWasm64.Never` | Always wasm32. **The default.** | You are not near the 4 GB limit. |
| `EUseWasm64.Auto` | wasm64 where Memory64 + SIMD are supported, wasm32 otherwise. | Recommended whenever you want wasm64 at all. |
| `EUseWasm64.Always` | wasm64 unconditionally, with no fallback. | You control the runtime (kiosk, Electron, a pinned browser) and know Memory64 + SIMD are present. |

:::warning
`EUseWasm64.Always` skips feature detection entirely. On a browser without Memory64 the chart fails to load rather than degrading — a deliberate trade, but only sound where you own the environment. Prefer `Auto` for anything served to the public internet.
:::

### Deploying the binaries

wasm64 needs `scichart-64.wasm` served alongside the standard binaries. The modular side modules follow the same suffix — `scichart-data-64.wasm` and `scichart-charting3d-64.wasm` — and a module's variant must match the core's, so do not mix them.

Copying the whole `_wasm` directory covers every variant at once and needs no updating when one is added:

```js
new CopyPlugin({
    patterns: [{ from: "node_modules/scichart/_wasm/", to: "" }]
});
```

Only the `.wasm` binaries are served. The wasm64 **loader JS ships inside the `scichart` package** and is bundled with your app like the rest of the library, so there is nothing extra to copy for it.

### Configuring URLs

`SciChartSurface.configure({ wasmUrl })` needs no wasm64-specific change: the `-64` variant is derived from it by inserting `-64` before the extension.

```ts
// scichart.wasm for wasm32, and scichart-64.wasm derived automatically for wasm64
SciChartSurface.configure({ wasmUrl: "/wasm/scichart.wasm" });
```

Override the derivation with `wasm64Url` when the 64-bit binary lives somewhere else:

```ts
SciChartSurface.configure({
    wasmUrl: "/wasm/scichart.wasm",
    wasm64Url: "https://my-cdn.example.com/scichart-64.wasm"
});
```

The equivalent knob for the non-SIMD fallback is `wasmNoSimdUrl`. See [Deploying Wasm (WebAssembly) with your app](/2d-charts/surface/deploying-wasm/) for the full picture.

### Preloading

`preloadWasm()` precompiles the binary before the first chart. It defaults to whichever variant your settings resolve to, so set `useWasm64` first and it follows:

```ts
import { SciChartDefaults, EUseWasm64, preloadWasm } from "scichart";

SciChartDefaults.useWasm64 = EUseWasm64.Auto;
await preloadWasm(); // precompiles scichart-64.wasm or scichart.wasm as resolved
```

## Verifying which engine loaded

`SciChartSurface.debugWasmWebGPU()` reports the resolved engine, including whether wasm64 is in use:

```ts
import { SciChartSurface, Logger } from "scichart";

Logger.enableLog = true; // also enables the one-line "WASM engine: ..." log

const { wasm64, simd, webGpu, details } = SciChartSurface.debugWasmWebGPU();
console.log(wasm64 ? "wasm64 (Memory64)" : "wasm32", "| SIMD:", simd);
```

Call it **after** setting `SciChartDefaults`, since it reports the decision those settings produce. With `Logger.enableLog = true` SciChart also logs which binary it selected, and re-logs if the answer changes between chart creations.

## Troubleshooting

A failed wasm64 load reports a named error rather than a generic one, listing what to check: that `scichart-64.wasm` is actually served, that the `.wasm` and its loader come from the same SciChart build, and that the browser has Memory64 plus SIMD. It also names the escape hatch — set `SciChartDefaults.useWasm64 = EUseWasm64.Never` to go back to the 32-bit engine.

By far the most common cause is a **404 on `scichart-64.wasm`**, because it was not added to the deployment copy step. Copying the whole `_wasm` directory, as above, avoids the problem permanently.

#### See Also

##### The SciChartSurface

* [Deploying Wasm (WebAssembly) with your app](/2d-charts/surface/deploying-wasm/)
* [WebGPU and WebGL Renderers](/2d-charts/surface/webgpu-and-webgl-renderers/)
* [SciChartSurface.create() vs. createSingle()](/2d-charts/surface/new-scichart-surface/)

##### Performance

* [Performance Tips and Tricks](/2d-charts/performance-tips/performance-tips-and-tricks/)
* [Memory Best Practices](/2d-charts/performance-tips/memory-best-practices/)

##### What's New

* [What's New in SciChart.js SDK v6.0](/whats-new/sdk-6.0/)
