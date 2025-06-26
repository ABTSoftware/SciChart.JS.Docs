---
sidebar_position: 8
---

# 🔄 Label Style, Alignment and Positioning

TODO: update and say about positioning limitations for native labels

The LabelStyle property
-----------------------

The Axis includes a [LabelStyle](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#labelstyle) property. This may be set in the constructor options or set on the axis itself. Apply a labelStyle as follows to an axis:

```ts
// Label Style

import { NumericAxis, ELabelAlignment, Thickness } from "scichart";

const axis = new NumericAxis(wasmContext, {
    labelStyle: {
        alignment: ELabelAlignment.Auto,
        fontFamily: "Arial",
        fontSize: 16,
        color: "White",
    } // type TTextStyle
});
```

The type for LabelStyle is [TTextStyle](https://www.scichart.com/documentation/js/current/typedoc/index.html#ttextstyle). The Definition for TTextStyle is found below:

```ts
// TTextStyle definition

/**
 * A type class to contain information about Axis Label text styles
 * @remarks
 * - Set the fontFamily as a string to set the font
 * - Set the fontSize as you would in HTML/CSS
 * - Set the fontWeight and fontStyle as you would in HTML/CSS
 * - Set the color as an HTML Color code to define the color
 */
export type TTextStyle = {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    /** Padding is left 4, right 4, top 2, bottom 0 by default. This is because there is natural space below the text baseline.
     * If you are using text labels rather than just numbers, or when using native text, 
     * you may want to increase the bottom padding.
     */
    padding?: Thickness;
    /** Horizontal label alignment for vertical axes.  Default Auto */
    alignment?: ELabelAlignment;
};
```

Label Alignment & Padding
-------------------------

The **labelStyle** option on an axis contains **padding** and **alignment** which can be used to adjust the positioning of axis labels.

Padding refers to the space around the label. 

*   By default, a label will not be displayed if if would overlap with the previous label, and this overlap includes padding. 
*   By default the padding is 4 pixels left and right, 2 pixels top, and 0 bottom padding. This is because the font height includes space below the baseline of the text. 
    *   For numbers this usually results in nicely centered labels for a vertical axis, but depending on your font size and style, or if you are using text, you may want to adjust the padding to improve the vertical alignment, or to fit in labels that would otherwise be hidden.
*   Alignment is an [ELabelAlignment](https://www.scichart.com/documentation/js/current/typedoc/enums/elabelalignment.html) which can be one of the options below.  Auto is the default. 

KeepLabelsWithinAxis property
-----------------------------

Another property which defines label placement is keepLabelsWithinAxis.

By default the first and last labels on an axis are shifted so that they stay within the bounds of the axis itself.  If you want to turn this off so that all labels are centered, you can disable **keepLabelsWithinAxis** as follows:

```ts
// keepLabelsWithinAxis Example

// Either
const xAxis = new NumericAxis(wasmContext, { 
    // Allow labels to overlap
    keepLabelsWithinAxis: false
});
// Or
const xAxis = new NumericAxis(wasmContext);
// Allow rotated labels to overlap
xAxis.axisRenderer.keepLabelsWithinAxis= false;
```

Worked Example: Alignment of labels
-----------------------------------

In the example below we show how to apply the [ELabelAlignment](https://www.scichart.com/documentation/js/current/typedoc/enums/elabelalignment.html) enum to an axis. We've chosen [LogarithmicAxis](/docs/2d-charts/axis-api/axis-types/logarithmic-axis/index.md) for this demo to get different length labels, such as "10", "100", "1000". Try editing the label alignment in the sandbox below to see how it affects the chart.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./LabelAlignment/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./LabelAlignment/demo.ts start=region_B_start end=region_B_end
 
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./LabelAlignment/demo" />

:::note
Label alignment only applies to vertical axis.  Labels for horizontal axes are always centered horizontally.
:::