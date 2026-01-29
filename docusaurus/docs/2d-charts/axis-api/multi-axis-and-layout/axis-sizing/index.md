---
sidebar_position: 9
---

# Axis Sizing

There are two properties on an axis that allow to manually set its size:

- [axisThickness](https://www.scichart.com/documentation/js/v5/typedoc/classes/axisbase2d.html#axisthickness) - The size of the axis perpendicular to its main direction (space occupied by labels, ticks, and title).
- [axisLength](https://www.scichart.com/documentation/js/v5/typedoc/classes/axisbase2d.html#axislength) - The size of the axis along its main direction (the direction the axis runs).

## Axis Thickness

The default axis layout reserves a minimal required area to fit an axis and recalculates it on each frame to adjust for possible size changes to labels, paddings, borders, etc...

Most common example of that is when zooming a vertical axis the number of digits in axis label values increases (or decreases) causing the label text width and as a result axis thickness.

But, if you want to changes this behavior and know the limit of max axis thickness, you could set it to a static value.  
This will prevent axis resize jitter when zooming or scrolling.

:::note
However, note that if the labels require more space then the set axisThickness, the axis size still would be adjusted by increasing by required value.
:::

<CodeSnippetBlock labels={["TS"]}>
```ts showLineNumbers file=./Basic/demo.ts start=region_A_start end=region_A_end

    ```

</CodeSnippetBlock>

<LiveDocSnippet maxWidth={"100%"} name="./Basic/demo" />

## Axis Length

The axis length can depend on size of other axes (available horizontal size depends on vertical axis thickness and vice vers),
and also can be modified by a layout strategy (for example [Vertically Stacked Axis Layout](/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout/) or [Horizontally Stacked Axis Layout](/2d-charts/axis-api/multi-axis-and-layout/horizontally-stacked-axis-layout/))

If you need to customize this layout behavior, you could set a custom axis length value during rendering.  
More commonly it could be used in custom Axis Layout Strategies.

:::note
Unlike `axisThickness`, `axisLength` do not override the default behavior of axis layout. So in order for it to take effect you need to ensure your custom value is being set during the rendering process after the layout phase.
For example, use [layoutMeasured](/2d-charts/miscellaneous-apis/render-events/) EventHandler
:::


