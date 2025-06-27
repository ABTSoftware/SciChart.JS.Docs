---
sidebar_position: 2
---

# ✅ Batching updates or Temporary Suspending Drawing

In SciChart.js, every update that you make to the chart will potentially trigger a redraw. For example:

*   Calling DataSeries.append()
*   Setting Axis.visibleRange
*   Adding a new series to the sciChartSurface.renderableSeries collection

All of these operations potentially trigger a redraw of the SciChartSurface. This may not be desirable in all cases, and there is an API to allow you to temporarily suspend or pause drawing while making multiple updates.

The SuspendUpdates() API
------------------------

The SuspendUpdates() api should be used when you want to temporarily stop drawing on a SciChartSurface. This helps to improve performance and reduce visual artefacts when making many changes at once.

To use it, call the following code.



```ts
// Using UpdateSuspender API

// Method 1: use try/finally statement
const s = surface.suspendUpdates(); // This locks the surface and prevents further drawing
try {
    dataSeries.append(x1, y1); // Multiple changes would normally trigger a redraw
    dataSeries.append(x2, y2);
    dataSeries.append(x3, y4);
    surface.xAxes.add(xAxis);
    surface.yAxes.add(yAxis);       
} finally
    s.resume(); // Resume updates and perform a single redraw here
}

// Method 2: or use UpdateSuspender.using() which does the same thing
UpdateSuspender.using(surface, () => {
    dataSeries.append(x1, y1);
    dataSeries.append(x2, y2);
    dataSeries.append(x3, y4);
    surface.xAxes.add(xAxis);
    surface.yAxes.add(yAxis);      
});
```

:::tip
Nested Calls to SuspendUpdates are permitted, however if you call sciChartSurface.suspendUpdates() more than once, you will need to call .resume() **on all IUpdateSuspender instances** returned to resume updates on the chart.
:::

Troubleshooting
---------------

If you use this API and your chart freezes, it could be because you have forgotten to call **IUpdateSuspender.resume().**

Make sure every instance of IUpdateSuspender (returned from sciChartSurface.suspendUpdates()) is resumed. The chart should start to respond to mouse-input and data or property changes.
