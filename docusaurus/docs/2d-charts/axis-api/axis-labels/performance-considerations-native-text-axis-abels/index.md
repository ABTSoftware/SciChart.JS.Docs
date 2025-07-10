---
sidebar_position: 9
---

# Native Text Axis Labels

In version SciChart 4.0 rendering axis labels defaults to using a [native text api](/docs/2d-charts/miscellaneous-apis/native-text-api/index.md).  This uses our in-house WebGL text rendering engine and offers performance benefits in situations where you have many axes with many labels. Rotated and multiline support is better with native text than with standard text, but there are also some important limitations you need to be aware of.

Disabling Native Text Labels
----------------------------

If you are using any custom fonts in your axes, then you can disable native text as the default for all axes by doing the following once at the start of your app: 

```ts
// Enable native text

import { SciChartDefaults } from "scichart";

SciChartDefaults.useNativeText = false;
```

You can control it for a particular axis by setting the useNativeText option when creating the axis, or by setting the [axis.labelProvider.useNativeText:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/labelproviderbase2d.html#usenativetext) property.

:::warning
To use any font other than Arial you will need ensure that font is available on your server (as fontname.ttf), or registered using [sciChartSurface.registerFont():blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html#registerfont) if coming from a remote url.  See [Native Text Font Loading](/docs/2d-charts/miscellaneous-apis/native-text-api/index.md) for more details.
:::

All the normal options in [labelStyle:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/axisbase2d.html#labelstyle) are supported except for **fontStyle** and **fontWeight**. 

The example below creates axes using both native and standard text.

<CodeSnippetBlock labels={["TS", "Builder API (Config)"]}>
    ```ts showLineNumbers file=./NativeText/demo.ts start=region_A_start end=region_A_end
 
    ```

    ```ts showLineNumbers file=./NativeText/demo.ts start=region_B_start end=region_B_end
 
    ```
</CodeSnippetBlock>

This results in the following output:

<LiveDocSnippet maxWidth={"100%"} name="./NativeText/demo" />

Rotated and Multiline Native Text Labels
----------------------------------------

The standard axis labels supported rotation, but the positioning is poor for angles outside the 0 to 90 range. With native text labels, this is fixed. Note that rotation is a property on the labelProvider, not the axis itself.

:::info
When using angles that are not a multiple of 90, you probably want to set **hideOverlappingLabels: false** as the overlap is calculated using the bounding rectangle of the text. 
:::

Multiline labels are supported simply by using newline characters (\\n) in the label text.  lineSpacing is a property on the labelProvider.  The alignment property on labelStyle also affects the alignment for multiple lines. 

:::note
Note: for more info about [Text and MultiLine labels see this article](/docs/2d-charts/axis-api/axis-labels/text-and-multi-line-labels).  
For rotation of labels [see this article](/docs/2d-charts/axis-api/axis-labels/rotating-axis-labels).
:::

#### See Also

[Axis Label Formatting - TextLabelProvider](/docs/2d-charts/axis-api/axis-types/text-string-axis/index.md)

[Axis Label Formatting - Custom LabelProviders](/docs/2d-charts/axis-api/axis-labels/label-provider-api-overview/index.md)

#### Miscellaneous APIs

[Native Text Api](/docs/2d-charts/miscellaneous-apis/native-text-api/index.md)
