---
sidebar_position: 1
---

# ✅ Retina Support and Browser Zoom

SciChart.js supports sharp graphics on high resolution Retina displays, as well as Browser Zoom functionality.

Previously in SciChart.js, retina displays would look low quality, and when the browser is zoomed the image that SciChart renders to would simply be scaled.

In SciChart.js starting from v2, every element is now rendered at the native resolution and scaled down for display. This results in the following benefits:

1.  Lines, strokes, shapes now look sharper and clearer on higher DPI displays or when browser is zoomed
2.  Text is rendered at a higher resolution. Text scales with browser zoom (good for Accessibility)
3.  Stroke thickness (line pen) increases with Browser Zoom

Take a look below to see some comparison images side by side of SciChart.js v1 vs. v2 at 200% Browser zoom in Chrome.

![](img/1.png)

In particular, notice the quality of text, lines and gridlines difference between version 1 and version 2 when at 200% browser zoom:

![](img/2.png)

Enabling & Disabling Retina DPI / Browser Zoom Support
------------------------------------------------------

By default, Retina &amp; high DPI support is built in, you don't have to do anything to enable it.

However, if you wanted to disable automatic scaling with DPI then you can use the following code:

<CodeSnippetBlock labels={["Disable DPI scaling"]}>
    ```ts
import { DpiHelper} from "scichart";

// Note: you will need to call this before any SciChartSurface is created
DpiHelper.IsDpiScaleEnabled = false;
    ```
</CodeSnippetBlock>

Performance Considerations when Dpi Scaling
-------------------------------------------

When SciChart.js is used on a high resolution display such as Retina, the chart will be rendered at 4x the number of pixels visible on screen. For example a 1,000 x 1,000 chart (1M Pixels) will be rendered at 2,000 x 2,000 (4M Pixels) before scaling down to the correct size.

Higher number of pixels means more work for the browser to display the chart. If you notice any performance degredation on your application you can disable Dpi scaling using the code above.

Also, we recommend use of Google Chrome browser as this has by far the best performance metrics, compared to Safari or Firefox, which both struggle to render large canvases.