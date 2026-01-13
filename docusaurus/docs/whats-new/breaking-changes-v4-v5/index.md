---
sidebar_position: 3
---

# Breaking Changes in SciChart.js v5.x from v4.x

## Default native font has been change from Arial to Arimo

If you are using default native font, you will notice some small changes. 

If there are places where you are using Arial font explicitly you may want to set `SciChartDefaults.autoFontName = 'Arial'` in order to pick up the new default font. Another options would be loading Arial font from file or disabling native text.

Read more on [font resolution here](/2d-charts/miscellaneous-apis/native-text-api#font-resolution).

## Support for WebGL1 has been abandoned

After investigating current state of web browsers support, we decided to stop supporting WebGL 1 as all major browsers including mobile browsers support WebGL 2.

## SIMD support introduced in v5 requires copying nosimd wasm files for fallback support 

Webpack config needs to be updated to include `scichart2d-nosimd.wasm` and `scichart3d-nosimd.wasm` files.

**Webpack config example**

```js
const config: Configuration = {
    entry: "./src/index.tsx",
    mode: "production",
    ...
    plugins: [
        ...
        new CopyPlugin({
            patterns: [
                { from: "src/static/", to: "" },
                { from: "../src/_wasm/scichart2d.wasm", to: "" },
                { from: "../src/_wasm/scichart2d-nosimd.wasm", to: "" },
                { from: "../src/_wasm/scichart3d.wasm", to: "" },
                { from: "../src/_wasm/scichart3d-nosimd.wasm", to: "" }
            ]
        })
    ]
};
```

**SIMD settings**

`SciChartDefaults.useWasmSimd` defines how WebAssembly SIMD should be used by SciChart. The default behavior is `Auto`.
The list of options:
- `Always` Always use SIMD-enabled binaries (you must serve scichart2d.wasm, scichart3d.wasm)
- `Never` Never use SIMD, always use fallback binaries (you must serve scichart2d-nosimd.wasm, scichart3d-nosimd.wasm)
- `Auto` Automatically detect SIMD support and choose appropriate binary (you must serve both variants)

## DataLabelState.xValues yValues yFinalValues and PolarColumnDataLabelState.x1Values

The type for `DataLabelState.xValues`, `DataLabelState.yValues`, `DataLabelState.xValues` and `PolarColumnDataLabelState.x1Values` has been changed from `SCRTDoubleVector` to `Float64Array`, therefore this code needs to be updated

**Before**

```ts
dataLabelState.xValues.get(i)
```

**After**

```ts
dataLabelState.xValues[i]
```