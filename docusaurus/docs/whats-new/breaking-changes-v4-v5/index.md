---
sidebar_position: 3
---

# Breaking Changes in SciChart.js v5.x from v4.x

## Default native font has been change from Arial to Arimo

If you are using default native font, you will notice some small changes. 

If there are places where you are using Arial font explicitly you may want to set `SciChartDefaults.autoFontName = 'Arial'` in order to pick up the new default font. Another options would be loading Arial font from file or disabling native text.

**The way font resolution works is as following:**
1. There is a constructor option on the Axis, so set whether to use native text or canvas text. Defaults to native text which is more performant.
    ```
    const xAxis = new NumericAxis(wasmContext, {
        useNativeText: true
    });
    ```
2. If font family is not provided `SciChartDefaults.autoFontName` will be used. 
3. If for a text `SciChartDefaults.autoFontName` font family is used the actual font family will be `SciChartDefaults.nativeFontFamily` for native text and `SciChartDefaults.canvasFontFamily` for canvas text.
4. All these values can be changed
    ```
    // Useful if you need to replace all font family occurrences with a default font
    SciChartDefaults.autoFontName = 'SomeFontFamily'
    // Font family for default native text
    SciChartDefaults.nativeFontFamily = 'NativeFontFamilyForAutoFont'
    // Font family for default canvas text
    SciChartDefaults.canvasFontFamily = 'CanvasFontFamilyForAutoFont'
    ```
5. In addition you may want to set from where to load the native font. This setting applies for all native fonts including the default one.
    ```ts
    sciChartSurface.registerFont(
        "MyCustomNativeFont",
        "https://fontUrl.com/path/to/font/fontName.ttf"
    );
    ```

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