---
sidebar_position: 4
---

# Breaking Changes in SciChart.js v6.0 from v5.2

This page lists every breaking change between SciChart.js v5.2 and v6.0, with before/after code for each one.

## Package now ships dual CJS + ESM builds

To enable tree-shaking in modern bundlers, `scichart` now ships both a CommonJS and an ES-module build. The compiled files that previously sat at the package root have moved into two subfolders — `cjs/` (CommonJS, resolved by `require`) and `esm/` (ES modules, resolved by `import`). This is wired through the package's `exports` map, its `main`/`module`/`types` fields, and a per-folder `sideEffects` list.

* **Root-barrel imports are unaffected.** `import { SciChartSurface } from "scichart"` continues to work unchanged, and now tree-shakes on bundlers that honour `exports` + `sideEffects` — barrel imports no longer pull in the whole library.
* **Deep imports on modern tooling are unaffected.** The import *string* is unchanged (`import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis"`). Any tooling that understands the `exports` field (webpack 5, Vite, Rollup, esbuild, TypeScript 4.7+ with `node16`/`nodenext`/`bundler` resolution) maps the same path to the new physical location automatically.
* **Deep imports on legacy tooling that ignores `exports` are broken.** Toolchains that do not read the `exports` field (webpack 4, the Jest default resolver, TypeScript pre-4.7 classic resolution) will no longer resolve `scichart/Charting/...` at the old package-root location. Fix by either upgrading the tooling, or importing from the package root `"scichart"`.
* **Native Node.js ESM (no bundler) is not a target of this build.** The `esm/` output is intended for consumption through a bundler. Importing it directly under Node's native ESM loader is not supported in this release — use a bundler, or the CJS build via `require`.

### Enabling tree-shaking in a TypeScript project

To actually benefit from tree-shaking, your bundler must see ES-module syntax. A bundler picks the ESM build via the `import` condition only when the code importing `scichart` reaches it as ESM.

In particular, **TypeScript projects using `ts-loader`/`ts-jest` with `"module": "commonjs"` will NOT tree-shake** — TypeScript downlevels your `import` to `require("scichart")` before webpack sees it, so webpack resolves the `require` condition and pulls the non-shakeable CommonJS build, bundling the whole library. To get shaking in a TypeScript + webpack app, set in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}
```

Use `"module": "esnext"` to keep ES `import`/`export` for the bundler to shake, and `"moduleResolution": "bundler"` (TypeScript 5.0+) to resolve SciChart's `exports` map the same way the bundler does.

Plain-JavaScript projects using native `import` already get this automatically. This is guidance rather than a breaking change — a `commonjs` TypeScript project keeps working, it just won't shrink.

## Some types have moved to resolve circular dependencies

To resolve circular dependencies and enable tree-shaking, some types have been moved to new files.

:::info
These are only breaking if you import directly from internal file paths, for example `scichart/Charting/...`. Importing from the package root `"scichart"` is unaffected.
:::

### Enums moved

| Enum | Old path | New path |
|---|---|---|
| `ECoordinateMode` | `Charting/Visuals/Annotations/AnnotationBase` | `Charting/Visuals/Annotations/types/ECoordinateMode` |
| `EAnnotationLayer` | `Charting/Visuals/Annotations/IAnnotation` | `Charting/Visuals/Annotations/types/EAnnotationLayer` |
| `EAnnotationType` | `Charting/Visuals/Annotations/IAnnotation` | `Charting/Visuals/Annotations/types/EAnnotationType` |
| `ELineType` | `Charting/Visuals/RenderableSeries/BaseLineRenderableSeries` | `Charting/Visuals/RenderableSeries/types/ELineType` |
| `EPieType` | `Charting/Visuals/SciChartPieSurface/SciChartPieSurface` | `Charting/Visuals/SciChartPieSurface/types/EPieType` |
| `EPieValueMode` | `Charting/Visuals/SciChartPieSurface/SciChartPieSurface` | `Charting/Visuals/SciChartPieSurface/types/EPieValueMode` |
| `ESizingMode` | `Charting/Visuals/SciChartPieSurface/SciChartPieSurface` | `Charting/Visuals/SciChartPieSurface/types/ESizingMode` |
| `EDrawMeshAs` | `Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D` | `Charting3D/Visuals/RenderableSeries/SurfaceMesh/types/EDrawMeshAs` |

### Interface moved

| Interface | Old path | New path |
|---|---|---|
| `ILineRenderableSeries` | `Charting/Visuals/RenderableSeries/BaseLineRenderableSeries` | `Charting/Visuals/RenderableSeries/ILineRenderableSeries` |

### Functions moved

| Function | Old path | New path |
|---|---|---|
| `chartReviver` | `Builder/chartBuilder` | `Builder/helpers/chartReviver` |
| `DebugForDpi` | `Charting/Visuals/SciChartSurfaceBase` | `Charting/Visuals/TextureManager/DpiHelper` |
| `registerType` | `Builder/classFactory` | `Core/classFactory` |
| `registerWasmType` | `Builder/classFactory` | `Core/classFactory` |
| `registerFunction` | `Builder/classFactory` | `Core/classFactory` |
| `getFunction` | `Builder/classFactory` | `Core/classFactory` |
| `createType` | `Builder/classFactory` | `Core/classFactory` |
| `getSubTypes` | `Builder/classFactory` | `Core/classFactory` |

### Builder type definitions moved to dedicated `types/` files

| Type(s) | Old path | New path |
|---|---|---|
| `TAnnotationDefinition` | `Builder/buildAnnotations` | `Builder/types/AnnotationDefinitions` |
| `TAxisDefinition`, `TLabelProviderDefinition`, `TAxis3DDefinition` | `Builder/buildAxis` | `Builder/types/AxisDefinitions` |
| `TSharedDataDefinition`, `TFilterDefinition`, `TXySeriesData`, `TXyxySeriesData`, `TXyxSeriesData`, `TXynSeriesData`, `TXyySeriesData`, `TXyzSeriesData`, `TOhlcSeriesData`, `THlcSeriesData`, `TBoxPlotSeriesData`, `TXyTextSeriesData`, `TSeriesDataDefinition`, `TDataSeriesDefinition`, `TXyzSeries3DData`, `TUniformGrid3DData`, `TSeriesDataDefinition3D`, `TDataSeriesDefinition3D` | `Builder/buildDataSeries` | `Builder/types/DataSeriesDefinitions` |
| `TModifierDefinition`, `TModifier3DDefinition` | `Builder/buildModifiers` | `Builder/types/ModifierDefinitions` |
| `TPointMarkerDefinition`, `TEffectDefinition`, `TPaletteProviderDefinition`, `TAnimationDefinition`, `TDataLabelProviderDefinition`, `TSeriesDefinition`, `TSeriesDefinition3D`, `TPointMarkerDefinition3D`, `TPaletteDefinition` | `Builder/buildSeries` | `Builder/types/SeriesDefinitions` |
| `ISciChart2DDefinition`, `ISubChartDefinition`, `ISciChartPieDefinition`, `ISciChart3DDefinition`, `TLayoutManagerDefinition` | `Builder/buildSurface` | `Builder/types/SurfaceDefinitions` |

## Wasm deployment has changed — copy the `_wasm` directory

v6 replaces the separate 2D and 3D binaries with a **single modular wasm build**: a smaller core binary plus side modules the core loads at runtime. There are two side modules today — **`data`** (the native data-series layer: `DynamicDataSeries` and the crossfilter query path) and **`charting3d`** (the entire 3D engine, fetched lazily at the first 3D chart, so 2D-only pages never pay for it).

There is no flag, no alias and no `DefinePlugin` — a bundle that defines nothing gets the modular build. The JS loader is bundled through the library's own imports exactly as before. **The only thing that changes for deployment is the copy step.**

`node_modules/scichart/_wasm/` holds exactly the 9 servable binaries and nothing else, so the copy step is one directory copy that never needs updating when a variant or module is added.

**Before**

```js
new CopyPlugin({
    patterns: [
        { from: "../src/_wasm/scichart2d.wasm", to: "" },
        { from: "../src/_wasm/scichart2d-nosimd.wasm", to: "" },
        { from: "../src/_wasm/scichart3d.wasm", to: "" },
        { from: "../src/_wasm/scichart3d-nosimd.wasm", to: "" }
    ]
});
```

**After**

```js
new CopyPlugin({
    patterns: [{ from: "node_modules/scichart/_wasm/", to: "" }]
});
```

See [Deploying Wasm (WebAssembly) with your app](/2d-charts/surface/deploying-wasm/) for the full deployment guide.

### The 9 files and their roles

The whole matrix is `{simd, nosimd, wasm64}` per artifact. The SIMD files carry no suffix.

| Files | Role |
|---|---|
| `scichart.wasm`, `scichart-nosimd.wasm`, `scichart-64.wasm` | The cores — one is fetched, chosen by browser capability |
| `scichart-data.wasm`, `scichart-data-nosimd.wasm`, `scichart-data-64.wasm` | The `data` module — loaded with every chart |
| `scichart-charting3d.wasm`, `scichart-charting3d-nosimd.wasm`, `scichart-charting3d-64.wasm` | The `charting3d` module — fetched lazily at the first `SciChart3DSurface` |

The `.data` files (`scichart2d.data`, `scichart3d.data`) were already removed in v5 and do not return.

:::warning
A missing file fails with a named error, not a mystery. The side modules are fetched lazily but must be *serveable*: a missing one surfaces as `could not fetch the "charting3d" wasm module` at the first chart that needs it — which for `charting3d` is the first 3D chart, arbitrarily far into a session. Serve the whole directory and none of these can happen.
:::

### Watch for the two-call `configure` pattern

v5 documentation told you to configure each engine separately. Because one module now backs both engines, the second call **overwrites** the first, so 2D charts try to fetch the 3D URL and 404.

**Before**

```js
SciChartSurface.configure({ wasmUrl: "/scichart2d.wasm" });
SciChart3DSurface.configure({ wasmUrl: "/scichart3d.wasm" }); // clobbers the 2D URL
```

**After**

```js
SciChartSurface.configure({ wasmUrl: "/scichart.wasm" });
```

In v6 `SciChart3DSurface.configure` still exists as a deprecated forward onto the 2D static, so this pattern **still compiles and still clobbers** — it is not caught for you. Deleting the 3D call is required.

### URL configuration is unchanged

`SciChartSurface.configure({ wasmUrl: "/scichart.wasm" })` resolves every module as a sibling of that URL. `useWasmFromCDN()` works for the whole set, because every file sits beside `scichart.wasm` at `_wasm/` under its canonical name. `configure({ modulesUrl: "/wasm-modules/" })` remains the finer-grained override for the side modules only.

### Other wasm-related removals

* **The browser bundle moved.** `scichart/_wasm/scichart.browser.js` (and `.mjs`) no longer exist — `_wasm/` is servable binaries only. Script-tag users should load `scichart/lib/index.min.js` (or `index.min.mjs`), which is unchanged.
* **Three deep-import modules were deleted**, since `package.json` exposes `"./*"` and they were reachable as deep imports: `Charting3D/Visuals/sciChartConfig3D.ts`, `Charting3D/Visuals/createMaster3d.ts`, `Charting3D/Visuals/createSingle3d.ts`.
* **`initializeChartEngine2D` is unchanged.** It stays as a deprecated alias of `initializeChartEngine`, so 2D-facing code that calls it keeps working.
* **The static (monolithic) build is discontinued for consumers.** It remains an internal development shape only; there is no supported way to select it from a v6 package, and nothing to migrate.
* **If you adopted the v6-alpha opt-in modular shape** (a `SCICHART_MODULAR` DefinePlugin, a glue alias, a `_wasm/modular/` copy list), delete all three by hand — the flag is no longer read, the alias target no longer exists, and `_wasm/modular/` is gone.

If you opt into wasm64 (Memory64) you must also deploy `scichart-64.wasm`. It is a separate, non-interchangeable binary and is not contained within `scichart.wasm`.

## SciChart3DSurface wasm engine API deprecated — use the 2D statics for both engines

Since the v6 one-wasm unification, a single wasm module carries both the 2D and 3D engines. The 3D-specific wasm-configuration and engine-bootstrap API that used to live on `SciChart3DSurface` was, by this point, a pure forward onto its 2D equivalent. Call the `SciChartSurface` (2D) version instead — it configures and initialises the shared module for both engines.

### The four SciChart3DSurface wasm-loading statics are deprecated, not removed

They forward to the 2D static and keep working. Use the equivalent `SciChartSurface` static:

| Deprecated | Use instead |
|---|---|
| `SciChart3DSurface.configure(config)` | `SciChartSurface.configure(config)` |
| `SciChart3DSurface.useWasmFromCDN()` | `SciChartSurface.useWasmFromCDN()` |
| `SciChart3DSurface.loadWasmFromCDN()` | `SciChartSurface.loadWasmFromCDN()` |
| `SciChart3DSurface.loadWasmLocal()` | `SciChartSurface.loadWasmLocal()` |

**Before**

```typescript
SciChart3DSurface.configure({ wasmUrl: "./scichart.wasm" });
SciChart3DSurface.loadWasmFromCDN();
```

**After**

```typescript
// the 2D call already configures the shared module for both engines
SciChartSurface.configure({ wasmUrl: "./scichart.wasm" });
SciChartSurface.loadWasmFromCDN();
```

:::note
These four were kept rather than removed because `scichart-react@1.0.0` calls `SciChart3DSurface.configure()` at *module scope*. Deleting the static turned importing that package into a `TypeError` thrown while the module graph was still loading — taking the whole app down before any chart was created, with no way to retro-fix an already-published version. Migrate off them, but they will not break you.
:::

### `SciChart3DSurface.disposeSharedWasmContext()` is NOT removed

Unlike the four statics above, it is kept as a deprecated forwarding alias onto `SciChartSurface.disposeSharedWasmContext()` and continues to work exactly as before:

```typescript
SciChart3DSurface.disposeSharedWasmContext(); // still works — forwards to SciChartSurface's version
```

It was kept deliberately: `SciChart3DSurface` and `SciChartSurface` are *siblings* under `SciChartSurfaceBase`, not parent and child, so deleting the 3D override would not make the call fail loudly — it would silently resolve to `SciChartSurfaceBase`'s own version instead, which only detaches the master canvas and never tears the wasm engine down. Do not remove this alias.

### 3D-suffixed globals removed in favour of their 2D equivalent

Same reason — one module now backs both engines.

| Removed | Use instead |
|---|---|
| `preloadWasm3D` | `preloadWasm` |
| `sciChartConfig3D` | `sciChartConfig` |
| `defaultSciChartConfig3D` | `defaultSciChartConfig` |
| `getSharedWasmContext3D` | `getSharedWasmContext` |
| `initializeChartEngine3D` | `initializeChartEngine` |

### SimdHelper is renamed FeatureDetectionHelper

`SimdHelper` is removed. `FeatureDetectionHelper` replaces it and also gained wasm64 (Memory64) feature detection alongside the original SIMD check.

**Before**

```typescript
import { SimdHelper } from "scichart";
const hasSimd = SimdHelper.supportsWasmSIMD();
```

**After**

```typescript
import { FeatureDetectionHelper } from "scichart";
const hasSimd = FeatureDetectionHelper.supportsWasmSIMD();
```

### Internal symbols removed

`createSingle3dInternal`, `resolveWasmModule3D`, `resolveWasmModule2D` and `TExternalDestinationHandle` are removed. These were always internal implementation details — none was ever intended as public API — and had only appeared in the package's type exports because the export generator auto-published them by accident. Their removal should affect no supported usage.

`TSciChart3D` is unchanged. It remains a type alias of the unified wasm context (the same type as `TSciChart`), so code that only names the type is unaffected by any of the above.

## TSciChartDestination now requires a `kind` field

The five separate destination arrays (one per chart family: 2D multi, 3D multi, 2D single, 3D single, pie) that used to encode which population a destination belonged to — by *which array it sat in* — have been replaced with a single internal store. That population now has to travel with the entry itself, so `TSciChartDestination` gains a required field:

```typescript
export type TSciChartDestination = {
    canvasElementId: string;
    width: number;
    height: number;
    sciChartSurface: ISciChartSurfaceBase;
    kind: TDestinationKind; // "2d" | "3d" | "2dSingle" | "3dSingle" | "pie"
};
```

**Before**

```typescript
const destination: TSciChartDestination = { canvasElementId, sciChartSurface, width, height };
```

**After**

```typescript
// pass the matching kind directly ("2d" | "3d" | "2dSingle" | "3dSingle" | "pie")
const destination: TSciChartDestination = { canvasElementId, sciChartSurface, width, height, kind: "2d" };
```

This only affects code that *constructs* a `TSciChartDestination` literal directly. Reading one — for example via `MemoryUsageHelper` — is unaffected, because the field is additive on the read side. `TDestinationKind` is exported from the package root as a type, so the field can be named in your own code, for example `const kind: TDestinationKind = "2d";`.

## AxisCore visibleRange no longer accepts undefined

Before, it was possible to set an `undefined` or `NaN` visible range. Now the check runs before setting the visible range: if an invalid range is passed nothing happens, and `notifyPropertyChange()` is not called.

## Advanced palette providers must write colours in ABGR format

Palette colours are now stored internally in **ABGR** format (the native vertex-colour format) rather than ARGB.

The per-point palette callbacks — `IStrokePaletteProvider.overrideStrokeArgb`, `IFillPaletteProvider.overrideFillArgb` and `IPointMarkerPaletteProvider.overridePointMarkerArgb` — are **unchanged**. They still return ARGB and the library converts internally.

However, `IAdvancedPaletteProvider.applyPaletting` writes directly into `palettingState.palettedColors` and the library no longer converts those values. Colours you write must therefore be in ABGR. Parse colours with `parseColorToUIntAbgr`, or convert an existing ARGB uint with `uintArgbColorToAbgr`.

**Before**

```typescript
palettingState.palettedColors.set(index, parseColorToUIntArgb("red")); // showed as blue
```

**After**

```typescript
palettingState.palettedColors.set(index, parseColorToUIntAbgr("red"));
```

:::warning
Symptom if not migrated: red and blue appear swapped. Green and black are unaffected.
:::

## PaletteProvider cannot use pure white (`#FFFFFF`)

Pure white (`0xFFFFFFFF`) is reserved as the internal "neutral" sentinel colour used by the line and series shaders to mean *"no per-point override — use the series' default stroke"*. If a `PaletteProvider` returns pure white from `overrideStrokeArgb` (or the other override callbacks), the override is indistinguishable from the sentinel and is silently ignored — the point renders with the default stroke instead of white.

To colour a point almost-white, use `#FFFFFFFD` instead of `#FFFFFF` or `"white"`.

**Before**

```typescript
// silently ignored, renders as the default stroke
overrideStrokeArgb(xValue, yValue, index) {
    return inThreshold(yValue) ? parseColorToUIntArgb("white") : undefined;
}
```

**After**

```typescript
// renders white
overrideStrokeArgb(xValue, yValue, index) {
    return inThreshold(yValue) ? parseColorToUIntArgb("#FFFFFFFD") : undefined;
}
```

:::warning
Symptom if not migrated: points and segments that should be white show the default series stroke colour, so the palette appears to have no effect.
:::

## ShadowEffect offset is applied on a different scale

What used to be `offset: new Point(10, 10)` now looks like `offset: new Point(3, 3)`.

**Before**

```typescript
new ShadowEffect(wasmContext, {
    offset: new Point(10, 10)
});
```

**After**

```typescript
new ShadowEffect(wasmContext, {
    offset: new Point(3, 3)
});
```

Read more about effects in [Glow and Drop Shadow Shader Effects](/2d-charts/miscellaneous-apis/glow-and-dro-shadow-shader-effects/).

## SCRTPen and SCRTBrush are now immutable

Methods that allowed you to mutate `SCRTPen` and `SCRTBrush` have been removed.

`SCRTPen` removed properties:

* `m_uiColor: number`
* `m_fThickness: number`

`SCRTBrush` removed methods:

* `SetColor(uiColor: number)`
* `SetTransparent(transparent: boolean)`
* `SetOpacity(opacity: number)`

## WebGlRenderContext2D.drawArcs() Y coordinate is no longer inverted

The Y coordinate passed to `drawArcs()` is no longer inverted, so a coordinate previously expressed relative to `clipRect.height` is now expressed directly.

**Before**

```typescript
const drawArcsFn = (wasmContext: TSciChart, sciChartSurface: SciChartSurface) => {
    const penDesc = new wasmContext.SCRTPenDescriptor();
    penDesc.m_uiColor = parseColorToUIntArgb("white", 255);
    penDesc.m_fThickness = 10;
    penDesc.m_bAntiAliased = false;
    const linesPen = new wasmContext.SCRTPen(penDesc);
    penDesc.delete();
    const renderContext = sciChartSurface.renderSurface.getRenderContext();
    if (renderContext) {
        const { seriesViewRect, clipRect } = sciChartSurface;
        const vertices = getVectorArcVertex(wasmContext);
        const vertex = getArcVertex(wasmContext);
        const rotCenterX = 100;
        // BEFORE
        const rotCenterY = clipRect.height - 400;
        const arcParms = getArcParams(wasmContext, rotCenterX, rotCenterY, 0, Math.PI / 2, 100, 50, 0, 1, 4);
        vertex.MakeCircularArc(arcParms);
        vertices.push_back(vertex);
        const paddingLeft = 50;
        const paddingTop = 50;
        renderContext.drawArcs(
            vertices,
            rotCenterX,
            rotCenterY,
            Math.PI / 2,
            clipRect,
            linesPen,
            undefined,
            paddingLeft,
            paddingTop
        );
    }
};
```

**After**

```typescript
const drawArcsFn = (wasmContext: TSciChart, sciChartSurface: SciChartSurface) => {
    const penDesc = new wasmContext.SCRTPenDescriptor();
    penDesc.m_uiColor = parseColorToUIntArgb("white", 255);
    penDesc.m_fThickness = 10;
    penDesc.m_bAntiAliased = false;
    const linesPen = new wasmContext.SCRTPen(penDesc);
    penDesc.delete();
    const renderContext = sciChartSurface.renderSurface.getRenderContext();
    if (renderContext) {
        const { seriesViewRect, clipRect } = sciChartSurface;
        const vertices = getVectorArcVertex(wasmContext);
        const vertex = getArcVertex(wasmContext);
        const rotCenterX = 100;
        // AFTER
        const rotCenterY = 400;
        const arcParms = getArcParams(wasmContext, rotCenterX, rotCenterY, 0, Math.PI / 2, 100, 50, 0, 1, 4);
        vertex.MakeCircularArc(arcParms);
        vertices.push_back(vertex);
        const paddingLeft = 50;
        const paddingTop = 50;
        renderContext.drawArcs(
            vertices,
            rotCenterX,
            rotCenterY,
            Math.PI / 2,
            clipRect,
            linesPen,
            undefined,
            paddingLeft,
            paddingTop
        );
    }
};
```

## The `chartBuilder` object is gone — import the build functions by name

`chartBuilder` was an object holding every builder as a property. Because of that, importing it referenced all four surface builders, so a 2D-only app shipped the polar surface, the pie surface and the whole 3D surface. Every member was already a named export, so they are now the only way in.

**Before**

```ts
import { chartBuilder } from "scichart";

const { sciChartSurface } = await chartBuilder.build2DChart(divId, definition);
```

**After**

```ts
import { build2DChart } from "scichart";

const { sciChartSurface } = await build2DChart(divId, definition);
```

Or reproduce the old shape with a namespace import, if you have many call sites:

```ts
import * as chartBuilder from "scichart";

const { sciChartSurface } = await chartBuilder.build2DChart(divId, definition);
```

Measured on a webpack build of the lean Builder path this saves **43.2 KB gzip (21.7%)**, and 35.6 KB gzip for the `registerAllTypes()` path. Nothing else in the API changed — same functions, same signatures.

The full list, all importable from `scichart`: `buildChart`, `build2DChart`, `build2DPolarChart`, `buildPieChart`, `build3DChart`, `configureChart`, `chartReviver`, `buildSeries`, `buildDataSeries`, `buildModifiers`, `buildAxes`, `buildAnnotations`, `buildAxis3D`, `buildModifiers3D`, `buildSeries3D`, `buildDataSeries3D`, `registerType`, `registerWasmType`, `registerFunction`.

## The Builder API is lean by default — one call restores register-everything

Importing a `build*` function no longer registers every built-in chart type. A definition can only reference types you have registered, and unregistered types throw an error naming the register function to call.

**Before** — importing `chartBuilder` registered every built-in type as a side effect:

```ts
import { chartBuilder } from "scichart";

const { sciChartSurface } = await chartBuilder.build2DChart(divId, {
    series: { type: ESeriesType.LineSeries, xyData }
});
```

**After, option A** — the one-line migration. Identical behaviour to before, and the right first step for an existing app: get it working, then trim if bundle size matters.

```ts
import { chartBuilder, registerAllTypes } from "scichart";

registerAllTypes();
```

**After, option B** — register only what your definitions use, keeping the rest out of the bundle:

```ts
import { build2DChart, registerLineSeries, registerXyDataSeries, registerNumericAxis } from "scichart";

registerLineSeries();
registerXyDataSeries();
registerNumericAxis(); // the default axes of a bare 2D definition
```

Miss one and you get an actionable error rather than a silent no-op:

```text
Nothing registered for RenderableSeries:LineSeries. Built-in types register themselves when imported,
so this type's class is not in your bundle. Either import it (for example by passing an instance
instead of a { type, options } definition), or — if your code only ever names the type as a string —
call the matching register function from "scichart/Builder/register/series", or registerAllTypes()
from "scichart" to register every built-in type.
```

Measured on a webpack line chart: `registerAllTypes()` costs about 360 KB gzip, per-type registration with the standalone `build2DChart` about 155 KB, and imperative code with no Builder about 150 KB.

### Classes you import need no registration

A built-in class registers itself when its module is in your bundle. So registration only ever concerns types your code names as a *string* without importing the class — a string cannot pull code into a bundle, which is the whole reason the register functions exist.

In practice that means anything you construct yourself is already usable in a definition:

```ts
import { FastLineRenderableSeries, EllipsePointMarker, chartBuilder } from "scichart";

// These classes are in the bundle, so their types resolve in any definition or round-trip below.
const series = new FastLineRenderableSeries(wasmContext, {
    pointMarker: new EllipsePointMarker(wasmContext)
});
```

You still need a register call when nothing imports the class:

```ts
// Only the type string appears, so nothing puts FastLineRenderableSeries in the bundle.
import { build2DChart, registerLineSeries } from "scichart";

registerLineSeries();
await build2DChart(divId, { series: { type: ESeriesType.LineSeries, xyData } });
```

### Two registrations you need but never asked for

These apply to the definition-only style above, where your code imports no chart classes of its own:

* **Default axes.** A definition with no `xAxes`/`yAxes` still needs `registerNumericAxis()` — the Builder creates the two default axes through the registry.
* **The theme.** A Builder-built surface always resolves a theme, so it needs the theme registered (`registerDarkTheme()` and friends) even when your definition never mentions one.

### Persisting charts needs no registration list

`toJSON()` → `chartBuilder.buildChart()` round-trips work without any register call, because every type in the serialized definition came from an object you created, and those classes are in your bundle:

```ts
const json = sciChartSurface.toJSON();
const { sciChartSurface: restored } = await chartBuilder.build2DChart(divId, json);
```

This matters more than it looks, because a serialized definition contains far more than the objects you built by hand:

* the **default theme**, even if you never set one;
* the **layout manager and all eight per-slot layout strategies** — every 2D surface serializes them;
* a **`dataLabelProvider` for every series whose constructor creates one** (line, triangle and line-segment series always do), so a round-trip references those even with no labels on screen.

A chart with two axes and one series produces a definition naming about a dozen types you never mentioned. All of them resolve, because the surface that serialized them necessarily had them.

`registerAllTypes()` is still the answer for a chart rebuilt from JSON that your code did not create — a definition loaded from a server or a file, in an app that imports no chart classes itself. `ensureRegistrations()` is an alias of it.

The package `sideEffects` list stays empty, which lets esbuild and Vite fully tree-shake the main barrel — a single enum import drops from about 230 KB to 0.4 KB gzip on those bundlers. Self-registration does not need an entry there: a class module is in the bundle because something imports the class, and its registration runs as part of the module.

See [Builder API Overview](/2d-charts/builder-api/builder-api-overview/) and [Chart Serialization and Deserialization](/2d-charts/builder-api/charts-serialization-deserialization/).

## Builder API resolves series, axes and data series through the class factory registry

The Builder API's hardcoded type dispatch — a 42-branch if/else naming every series class, plus switches for axes and data series — has been replaced by lookups in the class factory registry, the same mechanism modifiers and annotations have always used.

Everything that reaches the Builder still registers every built-in type automatically, so **normal usage is unaffected**. Custom types registered via `registerType`/`registerWasmType` are also unaffected. Behaviour changes only for invalid definitions.

### Unknown series types now throw instead of being silently skipped

The same applies to `buildSeries3D`, and to `filter: { type }` entries with an unrecognised type, which previously left the data series unfiltered.

**Before** — the bad definition was dropped; you got one series back, no warning:

```ts
const series = buildSeries(wasmContext, [
    { type: ESeriesType.LineSeries, xyData },
    { type: "NoSuchSeries" as ESeriesType, xyData }
]);
console.log(series.length); // 1
```

**After** — throws, naming the register function to call:

```ts
const series = buildSeries(wasmContext, [
    { type: ESeriesType.LineSeries, xyData },
    { type: "NoSuchSeries" as ESeriesType, xyData }
]);
// Error: Nothing registered for RenderableSeries:NoSuchSeries. Built-in types register themselves
// when imported, so this type's class is not in your bundle. Either import it ... or call the
// matching register function from "scichart/Builder/register/series" ...
```

### Custom series definitions now work

They were accepted by the type system but silently produced nothing.

**Before** — type-checked, and produced no series at all:

```ts
registerType(EBaseType.RenderableSeries, "MySeries", (wasm, options) => new MySeries(wasm, options));
const series = buildSeries(wasmContext, { type: ESeriesType.Custom, customType: "MySeries", xyData });
console.log(series.length); // 0
```

**After** — resolves `customType` from the registry, the way modifiers always have:

```ts
registerType(EBaseType.RenderableSeries, "MySeries", (wasm, options) => new MySeries(wasm, options));
const series = buildSeries(wasmContext, { type: ESeriesType.Custom, customType: "MySeries", xyData });
console.log(series.length); // 1
```

Unknown *axis* types still fall back to a default `NumericAxis`. Types registered via `registerType`/`registerWasmType` keep working exactly as before. See [Custom Subtypes](/2d-charts/builder-api/custom-subtypes/).

## Declarative `{ type, options }` sub-component options are now Builder-only

The declarative form of sub-component options is resolved by the Builder API **before** construction. Core constructors accept instances only, and throw when handed a definition:

```text
The declarative { type, options } form of "pointMarker" is only supported by the Builder API -
use chartBuilder or the build* functions from "scichart". When constructing directly, pass a
constructed instance instead.
```

Builder API users are unaffected — definitions keep working through `chartBuilder.build*`, the standalone `build*` functions, `configure2DSurface` and JSON round-trips. Only **direct constructor calls** must change.

### Migrating a direct constructor call

**Before**

```ts
const series = new FastLineRenderableSeries(wasmContext, {
    dataSeries,
    pointMarker: { type: EPointMarkerType.Ellipse, options: { width: 9, height: 9, fill: "#fff" } },
    animation: { type: EAnimationType.Sweep, options: { duration: 500 } },
    paletteProvider: { type: EPaletteProviderType.DataPointSelection, options: { fill: "#f00" } }
});
```

**After** — pass instances:

```ts
const series = new FastLineRenderableSeries(wasmContext, {
    dataSeries,
    pointMarker: new EllipsePointMarker(wasmContext, { width: 9, height: 9, fill: "#fff" }),
    animation: new SweepAnimation({ duration: 500 }),
    paletteProvider: new DataPointSelectionPaletteProvider({ fill: "#f00" })
});
```

Or keep the definitions and let the Builder resolve them:

```ts
registerLineSeries();
registerXyDataSeries();
registerNumericAxis();
registerAllPointMarkers();
registerAllAnimations();
registerAllPaletteProviders();

const { sciChartSurface } = await build2DChart(divId, {
    series: {
        type: ESeriesType.LineSeries,
        xyData,
        options: {
            pointMarker: { type: EPointMarkerType.Ellipse, options: { width: 9, height: 9, fill: "#fff" } },
            animation: { type: EAnimationType.Sweep, options: { duration: 500 } }
        }
    }
});
```

### Every affected option

`pointMarker`, `effect`, `paletteProvider`, `animation`, `dataLabelProvider` (on `BaseRenderableSeries` and `BaseStackedRenderableSeries`), `zLabelProvider` (heatmap and contour series), `labelProvider` (2D and 3D axes, pie surface, pie segment), `theme`, `loader`, `layoutManager` and its layout strategies, `metadata` generators, and the 3D `pointMarker` / `meshColorPalette`.

Surface options follow the same shape.

**Before**

```ts
const { sciChartSurface } = await SciChartSurface.create(divId, {
    theme: { type: EThemeProviderType.Navy },
    layoutManager: { type: ELayoutManagerType.CentralAxes }
});
```

**After**

```ts
const { sciChartSurface } = await SciChartSurface.create(divId, {
    theme: new SciChartJsNavyTheme(),
    layoutManager: new CentralAxesLayoutManager()
});
```

Axis label providers follow the same shape too.

**Before**

```ts
const xAxis = new NumericAxis(wasmContext, { labelProvider: { type: ELabelProviderType.Numeric } });
```

**After**

```ts
const xAxis = new NumericAxis(wasmContext, { labelProvider: new NumericLabelProvider() });
```

### `metadata` is a partial exception

A plain template object still works, because the constructor keeps building a `TemplateMetadataGenerator` from it. Only the `{ type, data }` *generator* form is Builder-only:

```ts
// Still works - plain template object
new XyDataSeries(wasmContext, { xValues, yValues, metadata: { isSelected: false } });

// Still works - an explicit metadata array
new XyDataSeries(wasmContext, { xValues, yValues, metadata: [{ isSelected: false }] });

// Now throws - the declarative generator form
new XyDataSeries(wasmContext, { xValues, yValues, metadata: { type: "MyGenerator", data: {} } });
```

### One behaviour change in SciChartOverview

Resolving definitions in the Builder means core no longer needs the registration modules that every chart previously loaded, recovering about 15 KB gzip for charts that do not use the Builder API.

`SciChartOverview` now clones point markers and effects onto the overview through the components' own constructors. Palette providers, animations and data labels are **no longer** applied to the overview's mini series — they were previously re-created from the serialized definition. If your overview relied on a palette provider being mirrored, set it explicitly on the overview series.

See [Complex Options in the Builder API](/2d-charts/builder-api/complex-options/).

## `XyNDataSeries` renamed to `TableDataSeries`

`XyNDataSeries` is now a deprecated alias of `TableDataSeries` and will be removed in a future major version. The name no longer described the type: it holds string, date and currency columns as well as numeric Y values.

**Migration:** replace `XyNDataSeries` with `TableDataSeries` and `IXyNDataSeriesOptions` with `ITableDataSeriesOptions`. The alias is a value alias, so `new XyNDataSeries(...)`, `import type { XyNDataSeries }` and the deep import `scichart/Charting/Model/XyNDataSeries` all keep working — only the name is deprecated.

Three things change behind the name.

### 1. `dataSeries.type` is now `EDataSeriesType.Table`

A series constructed through either name reports `"Table"`, not `"XyN"`.

**Before**

```ts
new XyNDataSeries(wasmContext, { arrayCount: 2 }).type === EDataSeriesType.XyN; // true
```

**After**

```ts
new XyNDataSeries(wasmContext, { arrayCount: 2 }).type === EDataSeriesType.Table; // true
```

So a `dataSeries.type === EDataSeriesType.XyN` test is now false, and chart JSON produced by v6 names `"Table"` and will not load in v5.

`EDataSeriesType.XyN` itself is **not** removed and must not be renamed: it is still the type of the *point series* (`XyNPointSeriesResampled`), which is unchanged, and `"XyN"` is still a registered Builder key, so `registerXyNDataSeries()` and existing v5 chart JSON keep resolving.

### 2. `getOptions()` no longer preserves your declared column order

On the tabular shape it emits every numeric column first, then every string column, whatever order you declared them in. Column *names* and values round-trip exactly; only the order of the `columns` array changes. If you build a grid or a header row by iterating `getOptions().columns`, iterate your own column list instead.

```ts
const ds = new TableDataSeries(wasmContext, {
    columns: [
        { name: "symbol", values: ["AAPL", "MSFT"] },
        { name: "price", values: [1, 2] }
    ]
});
ds.getOptions().columns.map(c => c.name); // ["price", "symbol"] - numeric first
```

### 3. Supplying both `columns` and `yValuesArray` now throws

The two are the type's two construction shapes — tabular (`columns`, where X is a row position) and columnar (`yValuesArray`, where X is your data). They select different removal semantics, so one used to be silently dropped. Pick one.

```ts
// Now throws instead of silently ignoring yValuesArray
new TableDataSeries(wasmContext, { columns: [...], yValuesArray: [[1, 2, 3]] });
```

## `EDataSeriesType.Grid` renamed to `EDataSeriesType.Table`

:::note
`GridDataSeries` was never released, so only pre-release users are affected.
:::

`GridDataSeries` is now `TableDataSeries` and its enum member is `EDataSeriesType.Table`. `IGridDataSeriesOptions`, `IGridColumn`, `TGridRow`, `TGridSeriesData` and `registerGridDataSeries` became `ITableDataSeriesOptions`, `ITableColumn`, `TTableRow`, `TTableSeriesData` and `registerTableDataSeries`.

One behaviour changed with the move: **`getTextAt` returns `""` for a row with no value in a string column**, where `GridDataSeries` returned `undefined`. `undefined` now means only one thing — there is no string column of that name — and callers depend on telling the two apart.

## Positional numeric mutators no longer throw on a series with string columns

`appendN`, `appendRangeN`, `insertN` and `insertRangeN` previously threw on `GridDataSeries`. They now succeed, filling every string column with the empty value for the added rows, so the invariant that every column holds exactly one cell per row still holds. If you relied on the throw to catch a mistake, note that rows added this way have blank text.

## String columns are a `BaseDataSeries` capability, not a data series type

Dictionary-encoded string columns moved from `GridDataSeries` onto `BaseDataSeries`, so **any** data series can carry one — declare it with the `stringColumns` option and read it with `getTextAt(name, index)`.

Nothing existing breaks. The consequence worth knowing is that code which tested a concrete data series type before reading text should test the capability instead, because the type test is now strictly narrower than the truth.

**Before** — only a table series could carry text:

```ts
if (dataSeries.type === EDataSeriesType.Table) {
}
```

**After** — ask whether this series has the column:

```ts
if (dataSeries.isStringColumn?.(field)) {
}
```

`TextDataLabelProvider` already made this change internally, and `DataLabelProvider` gained a `textColumn` option that takes label text straight from a named string column.

## `XyTextDataSeries` text is now stored in a dictionary-encoded string column

`XyTextDataSeries` stored its text in a plain JavaScript `string[]` with hand-rolled FIFO index arithmetic. It now declares a single native string column and delegates to it.

The public API is unchanged — `textValues`, `getTextValue`, `append`, `appendRange`, `update`, `updateXyText`, `insert`, `insertRange`, `removeAt`, `removeRange`, `clear`, `getOptions` and `type === EDataSeriesType.XyText` all keep their signatures, and the serialized form is byte-compatible.

**Six behaviours change, all of them corrections.** Five were defects in the FIFO paths, where text and points came apart — two of those are `update`/`updateXyText`, listed separately because they reproduce differently, though they share one root cause. The sixth is a blank-filling difference. If your code compensated for any of these, remove the compensation — with the one exception called out below the table, which you must read before removing anything.

| Path | How to reach it | v5 returned | v6 returns |
| --- | --- | --- | --- |
| `append` past a full ring | `fifoCapacity` set; append more points than the capacity one at a time. Appending `"a","b","c","d"` at `fifoCapacity: 3` and reading `getTextValue(0..2)` | `["d", undefined, "c"]`, and `textValues` had only 2 entries for 3 rows | `["b", "c", "d"]`, and `textValues` has 3 |
| `appendRange` larger than the ring | `fifoCapacity` set; one `appendRange` call carrying more values than the capacity. `appendRange([1..5], [...], ["a".."e"])` at `fifoCapacity: 3` | `textValues` was **empty** and every `getTextValue` was `undefined`, while the x/y ring filled normally | `["c", "d", "e"]`, the same tail the numeric ring kept |
| `fifoSweeping` | `fifoCapacity` + `fifoSweeping: true`; append past the capacity, then read `getTextValue` (or draw data labels / `FastTextRenderableSeries`) | Text sat **one raw ring slot behind its point**, so labels drew against the wrong points, and the newest slot returned `undefined` | Text is paired with the point in the same raw slot |
| `update` / `updateXyText` after the ring wraps | `fifoCapacity` set, no `fifoSweeping`; append past the capacity so the ring wraps, then `update(0, y, "X")`. At `fifoCapacity: 3` with the ring started at 1 | y went to logical row 0 but the text surfaced on logical row **2** — `getTextValue(0..2)` went from `["b","c","d"]` to `["b","c","X"]`. `update` wrote a raw slot while `getTextValue` read a logical row | The text lands on the same row as the y value: `["X","c","d"]` |
| `update` / `updateXyText` under `fifoSweeping` | `fifoCapacity` + `fifoSweeping: true`; append past the capacity, then `update(0, y, "X")`. At `fifoCapacity: 4` with `fifoStartIndex` 2 | y went to raw slot 2 while its text went to raw slot 0 — the text was torn off its own point | The text goes to the same raw slot as the y value |
| Append with no text | Construct or `appendRange` without a `textValues` argument | The whole series got a **single** `undefined` entry — `textValues.length` was 1 regardless of row count | One blank `""` per row, so `textValues.length === count()` |

:::warning One exception — do NOT remove a data-label compensation on a non-sweeping fifo series
The `fifoSweeping` row above is about `getTextValue` and the sweeping draw path, and it holds there. It does **not** cover the most common configuration: an `XyTextDataSeries` with a `fifoCapacity` but **no** `fifoSweeping`, drawn by a `FastTextRenderableSeries` whose data labels leave `textField` unset.

`TextDataLabelProvider` takes its `EDataSeriesType.XyText` branch there and reads through `getTextValue(i)`, which resolves `i` as a **logical** row, while the label pass supplies a **physical** ring slot. Once the ring wraps, drawn labels are still rotated. That defect is unchanged from v5, is **not** fixed by this release, and lives in the label provider rather than in the data series — so if you compensated for it, keep the compensation.

If you would rather not compensate, naming the column bypasses the branch entirely: `dataLabels: { textField: "text" }` (`"text"` is the column `XyTextDataSeries` declares). That takes the string-column path, which reads the codes ring physically and so pairs each label with its own point.
:::

Two consequences worth knowing even if you hit none of the above:

* `getTextValue` returns `""` (not `undefined`) for a row that has no text. It already returned `""` for the `fifoSweeping` gap; that is now uniform.
* `textValues` returns a fresh copy on each access rather than the live internal array. Mutating the returned array never affected the series, so nothing correct breaks — but reading it inside a per-point loop now materialises the whole column each time. Hoist it, or use `getTextValue`.

### Still broken, and not fixed by this release: serializing a wrapped fifo series

`toJSON()` / `getOptions()` write `xValues` and `yValues` in the ring's raw order but `textValues` in logical order, so once the ring has wrapped the two are out of phase by the start index and restoring pairs each row with a neighbour's text. Measured on a capacity-3 series holding rows 2-4, the restored series reads back `x=3` labelled `"r2"`, `x=4` labelled `"r3"` and `x=2` labelled `"r4"`.

This is old behaviour, not a regression, and it is called out here only because the rest of this section reads as "the fifo paths are fixed now" and this one is not.

**Workaround:** serialize a wrapped fifo text series by reading the rows yourself — `getNativeXValues().get(i)` and `getTextValue(i)`, both logical — and rebuilding from those arrays, rather than round-tripping `getOptions()`. A non-wrapped series, one that has not yet exceeded `fifoCapacity`, round-trips correctly.

### A separate FIFO ring fix, for every series type

Not a breaking change, but worth knowing. `SCRTFifoVector::notifyAppend` reset the ring's start index whenever the appended batch length equalled the capacity exactly, so a batch of exactly `fifoCapacity` onto a partly-filled ring read back rotated — the values and the count were correct, only the start marker was wrong.

Nothing to migrate, and no API changed; it is recorded on the changelog as [SCJS-2718](https://abtsoftware.myjetbrains.com/youtrack/issue/SCJS-2718). If you had compensated for the old order — rotating values back, offsetting a label index, picking a different `fifoSweepingGap` — remove that compensation. Do not read this section as an assurance that your numeric FIFO series is untouched.

## Data label providers no longer serialize a format they were never given

:::note
Not a behaviour change — listed here because it changes bytes you may be comparing.
:::

`toJSON()` on a `DataLabelProvider` that was never given a `numericFormat` or a `precision` no longer emits those keys, and the same for `labelFormat`/`labelPrecision` on `TextDataLabelProvider`. Providers you did configure serialize exactly as before, and JSON written by v5 loads unchanged.

The keys only ever echoed the class defaults (`ENumericFormat.Decimal` and `1`). Emitting them wrote those defaults to disk as though you had asked for them, which in v6 would permanently beat the per-column default that a `TableDataSeries` column's `EColumnType` supplies. If you snapshot serialized charts, expect the two keys to disappear from unconfigured providers.
