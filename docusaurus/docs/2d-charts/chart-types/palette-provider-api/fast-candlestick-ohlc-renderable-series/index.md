---
sidebar_position: 6
---

# Per-Point Colouring of Candlestick / OHLC Charts

Candlestick series can be colored per-point or per line-segment using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview). To use this, we must create a class (typescript) or object (javascript) which implements or confirms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) and [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) interfaces. Then, apply this to the [FastCandlestickRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcandlestickrenderableseries.html#paletteprovider) property. This allows you to colour data-points based on values, or custom rules with infinite extensiblity.

First let's create the PaletteProvider class.

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_A_start end=region_A_end
 
    ```
</CodeSnippetBlock>



Next, apply the PaletteProvider to the Candlestick series. 


<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_B_start end=region_B_end
 
    ```
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_C_start end=region_C_end
 
    ```
</CodeSnippetBlock>


The code above results in the following output. 

<LiveDocSnippet maxWidth={"100%"} name="./PaletteProvider/demo" />

When the open - close is greater than a 1% range, the candle fill is coloured white.

Using this or similar logic you can add an extra-dimension of data to [JavaScript Candlestick charts](https://www.scichart.com/demo/javascript-candlestick-chart).

Applying PaletteProviders to OHLC Series
----------------------------------------

The same technique can be applied to OHLC Bars. Just make sure when creating a class that inherits [DefaultPaletteProvide:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) that the [overrideStrokeArgb:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/defaultpaletteprovider.html#overridestrokeargb) function is defined. As usual, return a color in ARGB format to override this point stroke, else, return undefined for default stroke.
