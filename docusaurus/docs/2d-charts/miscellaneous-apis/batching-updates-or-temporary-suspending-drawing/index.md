---
sidebar_position: 2
---

# Batching Updates or Temporary Suspending Drawing

In SciChart.js, every update you make to the chart can potentially trigger a redraw. For example:

- Calling `DataSeries.append()`
- Setting `Axis.visibleRange`
- Adding a new series to the `sciChartSurface.renderableSeries` collection

All of these operations may trigger a redraw of the `SciChartSurface`. This might not be desirable in all cases, so there is an API that allows you to temporarily suspend or pause drawing while making multiple updates.

## The Suspend Updates API

The Suspend Updates API should be used when you want to temporarily stop drawing on a `SciChartSurface`.  
This can be useful in certain scenarios:

- It helps improve performance and reduce visual artifacts when making many changes at once (see [Data Updates Batching example](#data-updates-batching-example)).
- It can be used in combination with [Render Events](/docusaurus/2d-charts/miscellaneous-apis/render-events) to apply custom layout calculations.
- It allows control over rendering and timing. For example, by setting up your own render loop.

## SciChart's Redraw-on-Update Behavior Overview

By default, a chart instance redraws only if its state has changed. This includes modifications to properties, data, chart entities, font loading, resizing, pixel ratio changes, visibility changes, and more.

When a modification occurs, it issues an internal "invalidate" request.  
This signals the chart to rerender on the next animation frame.  
The Suspend Updates API allows the chart to ignore these invalidation requests.

:::note
The default behavior of the SciChart Engine relies on render operations being scheduled via [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).
:::

:::note
Some invalidation requests should not be ignored, as doing so may lead to unexpected results.  
For example, chart resizing, pixel ratio changes, or tab visibility changes call the `invalidateElement` method with the `force: true` option. This triggers a redraw regardless of the suspend state.
:::

:::tip
You can override the `invalidateElement` and `notifyPropertyChanged` methods for more granular control over which updates trigger a redraw.
:::

## Usage

The main logic for suspending updates is handled by an [UpdateSuspender:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/updatesuspender.html) instance, accessible via the [sciChartSurface.suspender:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurfacebase.html#suspender) property.

There are two mechanisms to toggle update suspension:

- [suspender.suspend:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/updatesuspender.html#suspend)/[suspender.resume:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/updatesuspender.html#resume) - a counter based mechanisms;
- [suspender.lock:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/updatesuspender.html#lock)/**unlock** - a token based mechanisms.
  Both can be used together and are applied in some areas of the SciChart rendering logic implicitly.

You can also check the current state with the [`suspender.isSuspended`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/updatesuspender.html#issuspended) flag, which reflects the cumulative suspend state based on both counter and token-based controls.

The surface also exposes convenience methods for accessing the API.

### Basic

Two primary methods of this API are [`sciChartSurface.suspendUpdates`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html#suspendupdates) and [`sciChartSurface.resumeUpdates`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html#resumeupdates), which internally call [suspender.suspend:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/updatesuspender.html#suspend) and [suspender.resume:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/updatesuspender.html#resume) respectively.  

The surface also exposes the [`isSuspended`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html#issuspended) property.

A few important things to note:

- Calling `suspendUpdates` multiple times requires you to call `resumeUpdates` the same number of times to fully resume updates.
- Alternatively, `resumeUpdates` accepts a `force` flag in the options, which resets the counter regardless of how many times it was suspended.
- Another option is `invalidateOnResume`, which triggers a redraw immediately after resuming.

#### Data Updates Batching Example Using Suspend/Resume

<CodeSnippetBlock>

    ```ts showLineNumbers file=./Basic/demo.ts start=region_A_start end=region_A_end
    ```

    ```js showLineNumbers file=./Basic/demo.js start=region_A_start end=region_A_end
    ```

</CodeSnippetBlock>

<LiveDocSnippet name="./Basic/demo" htmlPath="./Basic/demo.html" />

### Alternative Lock/Unlock Methods

Another way to suspend updates is via [`suspender.lock`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/updatesuspender.html#lock), which returns an `unlock` function that must be called to resume updates.

These methods provide a stricter suspension mechanism.

Since `suspender.isSuspended` can be affected by both `suspend`/`resume` and `lock`/`unlock`,  
the `lock`/`unlock` pair ensures that suspension is lifted only by its corresponding `unlock` call - it cannot be bypassed or force-resumed by other means.

#### Data Updates Batching Example Using Lock/Unlock

<CodeSnippetBlock>

    ```ts showLineNumbers file=./Alternative/demo.ts start=region_A_start end=region_A_end
    ```

    ```js showLineNumbers file=./Alternative/demo.js start=region_A_start end=region_A_end
    ```

</CodeSnippetBlock>

<LiveDocSnippet name="./Alternative/demo" htmlPath="./Basic/demo.html" />

### Suspend Chart on Initialization

To prevent the chart from rendering immediately upon initialization, use the [`createSuspended`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/i2dsurfaceoptions.html#createsuspended) option when creating the surface.

<CodeSnippetBlock>

    ```ts showLineNumbers file=./Basic/demo.ts start=region_B_start end=region_B_end
    ```

    ```js showLineNumbers file=./Basic/demo.js start=region_B_start end=region_B_end
    ```

</CodeSnippetBlock>

### onResumed Event Handler

The [`suspender.onResumed`:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/updatesuspender.html#onresumed) handler lets you subscribe to an event when a surface becomes unsuspended.

<CodeSnippetBlock>

    ```ts showLineNumbers file=./Alternative/demo.ts start=region_B_start end=region_B_end
    ```

    ```js showLineNumbers file=./Alternative/demo.js start=region_B_start end=region_B_end
    ```

</CodeSnippetBlock>

### Freeze Drawing for Charts Out of View

This feature also uses the Suspend API internally.  
It helps optimize performance by suspending charts that are out of view on the page.  
Check out the [Freeze Drawing for Charts](/2d-charts/performance-tips/performance-tips-and-tricks#21-freeze-drawing-for-charts-out-of-view) section for more details.

## Troubleshooting

If your chart appears frozen after using this API, it may be because you forgot to call `resume` or `unlock`.  
Ensure the suspender is resumed—once active again, the chart should respond to mouse input and reflect data or property changes.
