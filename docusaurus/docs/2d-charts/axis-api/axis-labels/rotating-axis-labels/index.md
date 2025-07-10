---
sidebar_position: 5
---

# Rotating Axis Labels

SciChart.js supports rotation of labels for all 2D axis types and [LabelProviders](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview). This lets you display longer labels, or pack more labels onto an x axis.

To use rotated labels on a chart, or vertical labels, use this code:

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./RotatingLabels/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./RotatingLabels/demo.ts start=region_B_start end=region_B_end
 
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./RotatingLabels/demo" />

:::tip
For an example of using rotation with text labels see the [Multiline and Rotated Text Labels](http://demo.scichart.com/javascript-multiline-labels) demo in our examples suite.
:::

### Further notes on Label Culling & Spacing

:::tip
An axis with rotated labels obeys other rules of axis tick spacing and label culling. Take a look at the section on [Gridline and Label Spacing (Interval)](/docs/2d-charts/axis-api/axis-tick-label-interval/gridline-and-label-spacing-interval) for some more information how this works.
:::

When working with rotated labels that are not horizontal or vertical, it may be necessary to turn off [axis.axisRenderer.hideOverlappingLabels:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisrenderer.html#hideoverlappinglabels) as the bounding box of a partially rotated label is much larger than the text itself.This property may also be set via the axis constructor option [hideOverlappingLabels:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iaxisbase2doptions.html#hideoverlappinglabels).

To do this, use the following code:

```ts
// hideOverlappingLabels  Example
// Either
const xAxis = new NumericAxis(wasmContext, { 
    // Allow labels to overlap
    hideOverlappingLabels : false
});
// Or
const xAxis = new NumericAxis(wasmContext);
// Allow rotated labels to overlap
xAxis.axisRenderer.hideOverlappingLabels = false;
```
