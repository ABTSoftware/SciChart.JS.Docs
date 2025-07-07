---
sidebar_position: 2
---

# ✅ Per-point Colouring for Line Series

Line series can be colored per-point or per line-segment using the [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview). To use this, we must create a class (typescript) or object (javascript) which implements or confirms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) interface. Then, apply this to the [FastLineRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/baserenderableseries.html#paletteprovider) property.

Let's start off with the PaletteProvider class:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_A_start end=region_A_end

    ```
</CodeSnippetBlock>

Next, we can apply the PaletteProvider to the line series. This can be done both with the programmatic API and the Builder API:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_B_start end=region_B_end

    ```
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_C_start end=region_C_end

    ```

</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./PaletteProvider/demo" />

In TypeScript you only need to implement an interface such as [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html), whereas in JavaScript you must extend the [DefaultPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/defaultpaletteprovider.html) class.

## Gradient Transitions in Lines

Change [strokePaletteMode:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/defaultpaletteprovider.html#strokepalettemode) to [EStrokePaletteMode.GRADIENT:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/enums/estrokepalettemode.html) to get a gradient color transition:

<CodeSnippetBlock labels={["JS", "TS"]}>

```ts
class LinePaletteProvider extends DefaultPaletteProvider {
    constructor(stroke, rule) {
        super();
        this.strokePaletteMode = EStrokePaletteMode.GRADIENT;
        // ..
    }
    // ..
}
```

```ts
class LinePaletteProvider implements IStrokePaletteProvider {
    readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.GRADIENT;
    // ...
}
```

</CodeSnippetBlock>



This now results in gradient color changes between line segments.

<CenteredImageWrapper
    src="/images/PaletteProvider_Line2.png"
/>

Note: SciChart won't bisect the line at a threshold value but only changes colour between line segments in the data you already have. If you want to have a perfect transistion from one colour to another at a specific Y-value, you will need to include data-points

#### See Also

- [PaletteProvider API](/docs/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview)
- [Per-point Colouring of Mountain Segments](/docs/2d-charts/chart-types/palette-provider-api/fast-mountain-renderable-series)
- [Per-Point Colouring of Band Segments](/docs/2d-charts/chart-types/palette-provider-api/fast-band-renderable-series)
- [Per-Point Colouring of Bubble Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-bubble-renderable-series)
- [Per-Point Colouring of Candlestick / OHLC Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-candlestick-ohlc-renderable-series)
- [Per-Point Colouring of Scatter Charts (or PointMarkers)](/docs/2d-charts/chart-types/palette-provider-api/xy-scatter-renderable-series)
- [Per-Point Colouring of Column Charts](/docs/2d-charts/chart-types/palette-provider-api/fast-column-renderable-series)
