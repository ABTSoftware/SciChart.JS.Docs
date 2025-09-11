---
sidebar_position: 7
---

# Per-Point Colouring of Column Charts

Column series can be colored per-point or per line-segment using the [PaletteProvider API](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview). To use this, we must create a class (typescript) or object (javascript) which implements or confirms to the [IStrokePaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/istrokepaletteprovider.html) and [IFillPaletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ifillpaletteprovider.html) interfaces. Then, apply this to the [FastColumnRenderableSeries.paletteProvider:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastcolumnrenderableseries.html#paletteprovider) property. This allows you to colour data-points based on values, or custom rules with infinite extensiblity.

First, let's create a PaletteProvider class like this:

<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_A_start end=region_A_end

    ```
</CodeSnippetBlock>

Next, we can apply the PaletteProvider to the series. This can be done both with the programmatic API and the Builder API:

<CodeSnippetBlock labels={["TS", "Builder API (JSON Config)"]}>
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_B_start end=region_B_end

    ```
    ```ts showLineNumbers file=./PaletteProvider/demo.ts start=region_C_start end=region_C_end

    ```

</CodeSnippetBlock>

The code above results in a [JavaScript Column Chart](https://www.scichart.com/demo/javascript-column-chart) with the following output. YValues > 10 are colored red, and YValues < 10 are the default series stroke and fill colors.

<LiveDocSnippet maxWidth={"100%"} name="./PaletteProvider/demo" />

## Troubleshooting

For [FastColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastcolumnrenderableseries.html) you may notice that **palette provider stops working when zoomed out to the point that columns are 1px wide**. It may happens when a palette provider class overrides only fill and do not override stroke. When we zoom out far enough to reach one pixel width the drawing engine does not use fill any more it uses stroke. Therefore in order to make it look always the same color you would need to override both fill and stroke. For example:

```ts
import {
  EFillPaletteMode,
  IFillPaletteProvider,
  IStrokePaletteProvider,
  IPointMetadata,
  IRenderableSeries,
  EStrokePaletteMode,
} from 'scichart';

export class BarPaletteProvider
  implements IFillPaletteProvider, IStrokePaletteProvider
{
  fillPaletteMode = EFillPaletteMode.SOLID;
  strokePaletteMode = EStrokePaletteMode.SOLID;
  private color: number;

  constructor(color: string) {
    this.color = BarPaletteProvider.argbColorToNumber(color);
  }

  onAttached(parentSeries: IRenderableSeries): void {}

  onDetached(): void {}

  overrideFillArgb(
    xValue: number,
    yValue: number,
    index: number,
    opacity?: number,
    metadata?: IPointMetadata
  ): number {
    return this.color;
  }

  overrideStrokeArgb(
    xValue: number,
    yValue: number,
    index: number,
    opacity?: number,
    metadata?: IPointMetadata
  ): number | undefined {
    return this.color;
  }

  private static argbColorToNumber(color: string) {
    return parseInt(color.substring(1), 16);
  }
}
```
