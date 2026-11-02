---
sidebar_position: 2
sidebar_label: Installation
title: "Installing SciTrader.js | npm, Webpack, Vite, React"
description: "Install scichart-scitrader and scichart-scitrader-react, import the stylesheet and serve SciChart WebAssembly with webpack, Vite, esbuild, Rollup or Parcel."
keywords: ["SciTrader", "SciTrader.js", "SciTrader installation", "scichart-scitrader npm", "React financial charts setup", "SciChart wasm webpack vite"]
---

# Installation

Setting up an app for SciTrader takes three steps:
1. install the packages;
2. import the stylesheet;
3. serve SciChart's WebAssembly files.

Step 3 depends on your bundler, so this page has an example for each of the common ones.

## Install the packages

```sh
# Plain TypeScript or JavaScript
npm install scichart-scitrader scichart scichart-financial-tools rxjs

# React: add these as well
npm install scichart-scitrader-react react react-dom
```

Why so many? `scichart-scitrader` relies on SciChart, but doesn't bring its own copy. `scichart`, `scichart-financial-tools` and `rxjs` are **peer dependencies**: your app installs them, and the SDK uses your copy. An app must have exactly one copy of SciChart, because SciChart keeps global state: the licence, the loaded WebAssembly engine, and the registry used when charts are saved and restored. Peer dependencies make sure the SDK and your own chart code share that copy. They also let you choose its version. `scichart-scitrader-react` works the same way with `react`, `react-dom` and `scichart-scitrader`.

| Package | Version |
|---|---|
| `scichart` | 6.0.14 or later 6.x |
| `scichart-financial-tools` | 6.0.14 or later 6.x. |
| `rxjs` | 7.5.5 or later. Earlier 7.x releases have no TypeScript types for modern module resolution. |
| `react`, `react-dom` | 16.14 or later |

The SDK's own dependencies (`idb`, `technicalindicators`) install automatically.

**You need a bundler.** The packages ship as ES modules (`esm/`) and CommonJS (`cjs/`), with TypeScript types in `types/`. They import their own files without file extensions, which a bundler resolves and a browser can't. The examples below cover webpack, Vite, esbuild, Rollup and Parcel. Any bundler that understands `node_modules` works.

## Import the stylesheet

Import it once, next to your first import of the SDK:

```ts
import "scichart-scitrader/scitrader.css";
```

It gives the SDK's toolbars, pane controls, menus and overlays their look ([Styling](/scichart-extensions/scichart-scitrader/styling-and-themes/#the-stylesheet)). It is plain CSS, and the SDK's JavaScript never imports it, so your bundler handles it like any other CSS file. Without a bundler, link `node_modules/scichart-scitrader/styles/scitrader.css` from your page.

## Serve SciChart's WebAssembly

SciChart draws with a WebAssembly engine. Your bundler bundles SciChart's JavaScript, but not the engine: the browser downloads that as a separate file when the first chart is created. You have to serve it, and SciChart has to know its URL.

The files are in `node_modules/scichart/_wasm/`:

| File | Size | Loaded |
|---|---|---|
| `scichart.wasm` | 1.6 MB | Always, in browsers with WebAssembly SIMD (every browser since 2023) |
| `scichart-nosimd.wasm` | 1.6 MB | Instead of `scichart.wasm`, in older browsers without SIMD |
| `scichart-64.wasm` | 1.6 MB | Only if you opt in to 64-bit memory (`SciChartDefaults.useWasm64`) |
| `scichart-charting3d*.wasm` | 0.5 MB each | Only for SciChart 3D charts; SciTrader doesn't use them |

Copying the whole folder is simplest. To serve less, `scichart.wasm` and `scichart-nosimd.wasm` cover every browser for SciTrader charts.

### Where SciChart looks

By default SciChart requests `scichart.wasm` **relative to the page's URL**, not the script's. On a page at `/charts/btc`, that's `/charts/scichart.wasm`. So unless every page sits at the root, tell SciChart the file's absolute URL before the first chart is created:

```ts
import { SciChartSurface } from "scichart";

SciChartSurface.configure({ wasmUrl: "/scichart.wasm" });
```

If your app also uses [`scichart-react`](https://www.npmjs.com/package/scichart-react), note that importing it sets `wasmUrl` to `/scichart.wasm`, at import time. To use a different URL, call `configure` after that import.

SciChart finds `scichart-nosimd.wasm` and `scichart-64.wasm` from the same URL, by adding `-nosimd` or `-64` to the name. If your bundler renames files (Vite and Parcel add content hashes), pass `wasmNoSimdUrl` too, as in their examples below.

If the file can't be loaded, chart creation fails with *"Could not load SciChart WebAssembly module"*. Look for a `404` on `scichart.wasm` in the browser's network tab: the URL it shows is where SciChart looked.

### webpack

Copy the folder into the build with [`copy-webpack-plugin`](https://webpack.js.org/plugins/copy-webpack-plugin/):

```js
// webpack.config.js
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const scichartWasm = path.join(path.dirname(require.resolve("scichart/package.json")), "_wasm");

module.exports = {
    // …
    plugins: [new CopyWebpackPlugin({ patterns: [{ from: scichartWasm, to: "" }] })],
};
```

The files land next to your bundle, at `/scichart.wasm` if you serve the build from the root. Set `wasmUrl` to that.

### Vite

Vite needs no copy step. Import each file's URL with `?url`; Vite copies the file into the build and returns its final, hashed URL:

```ts
import { SciChartSurface } from "scichart";
import wasmUrl from "scichart/_wasm/scichart.wasm?url";
import wasmNoSimdUrl from "scichart/_wasm/scichart-nosimd.wasm?url";

SciChartSurface.configure({ wasmUrl, wasmNoSimdUrl });
```

This works in the dev server and in production builds. In TypeScript, `?url` imports need Vite's client types: add `/// <reference types="vite/client" />` to a `.d.ts` file in your project (Vite's templates include one).

### esbuild

esbuild bundles the JavaScript and the stylesheet. Copy the WebAssembly in your build script:

```js
// build.mjs
import { build } from "esbuild";
import { cpSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const scichartWasm = path.join(path.dirname(require.resolve("scichart/package.json")), "_wasm");

await build({
    entryPoints: ["src/main.ts"],
    bundle: true,
    format: "esm",
    outdir: "dist/assets",
});

// SciChart's WebAssembly, next to the bundle.
cpSync(scichartWasm, "dist/assets", { recursive: true });
```

Then `SciChartSurface.configure({ wasmUrl: "/assets/scichart.wasm" })`. esbuild writes the stylesheet you imported as `main.css`, next to `main.js`; link it from your page.

### Rollup

Rollup needs four plugins besides TypeScript:
- `@rollup/plugin-node-resolve` to find packages;
- `@rollup/plugin-commonjs` for CommonJS dependencies;
- `rollup-plugin-postcss` for the stylesheet;
- `rollup-plugin-copy` for the WebAssembly.

It also needs `@rollup/plugin-replace`, because unlike the other bundlers Rollup doesn't define `process.env.NODE_ENV`, which SciChart reads:

```js
// rollup.config.mjs
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const scichartWasm = path.join(path.dirname(require.resolve("scichart/package.json")), "_wasm");

export default {
    input: "src/main.ts",
    output: { dir: "dist", format: "esm" },
    plugins: [
        // SciChart reads process.env.NODE_ENV, which only exists in Node.
        replace({ preventAssignment: true, "process.env.NODE_ENV": JSON.stringify("production") }),
        resolve({ browser: true }),
        commonjs(),
        typescript(),
        postcss({ extract: "main.css" }),
        copy({ targets: [{ src: `${scichartWasm}/*`, dest: "dist" }] }),
    ],
};
```

Then `SciChartSurface.configure({ wasmUrl: "/scichart.wasm" })`.

### Parcel

Parcel copies a file from a package when you take its URL with `new URL("npm:…", import.meta.url)`:

```ts
import { SciChartSurface } from "scichart";

SciChartSurface.configure({
    wasmUrl: new URL("npm:scichart/_wasm/scichart.wasm", import.meta.url).href,
    wasmNoSimdUrl: new URL("npm:scichart/_wasm/scichart-nosimd.wasm", import.meta.url).href,
});
```

Parcel also has to read the packages' `exports` maps, which it doesn't by default; without them it can't find `scichart-scitrader/scitrader.css`. Turn that on in your `package.json`:

```json
{
    "@parcel/resolver-default": { "packageExports": true }
}
```

### From SciChart's CDN

To skip serving the files yourself, load them from jsDelivr:

```ts
import { SciChartSurface } from "scichart";

SciChartSurface.loadWasmFromCDN();
```

It requests the files for the SciChart version you have installed, so they always match. Your users then need to reach `cdn.jsdelivr.net`, and a Content Security Policy must allow it (`connect-src`).

### Anything else

Whatever builds and serves your app: copy the files from `node_modules/scichart/_wasm/` to a folder your server publishes, as part of the build, and call `SciChartSurface.configure({ wasmUrl })` with the URL of `scichart.wasm`. Serve them with the `application/wasm` content type; most servers do this already. That lets the browser compile the file while it downloads.

## Next

[Getting started](/scichart-extensions/scichart-scitrader/getting-started/): register a data source and create your first chart.
