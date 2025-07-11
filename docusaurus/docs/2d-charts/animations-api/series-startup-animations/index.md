---
sidebar_position: 2
---

# Series Startup Animations

There are several series startup Animation Types provided out of the box in SciChart.js. These are:

*   **FadeAnimation**
*   **ScaleAnimation**
*   **SweepAnimation**
*   **WaveAnimation**

### Sweep Startup Animation

Let's see a simple example of using Sweep Animation on chart types in SciChart.js

```ts
// Sweep Animation    

const rendSeries = new FastBandRenderableSeries(wasmContext, {
    dataSeries,
    strokeThickness: 2,
    animation: new SweepAnimation({ duration: 1000 }),
});

// Alternatively
rendSeries.enqueueAnimation(new SweepAnimation({ duration: 1000 }));
```

<CenteredImageWrapper
    src="/images/SweepAnimationBandSeries.gif"
/>

### Fade Startup Animation

Now let's see an example of using Fade Animation on some chart types in SciChart.js

```ts
// Fade Animation

const rendSeries = new FastBandRenderableSeries(wasmContext, {
    dataSeries,
    strokeThickness: 2,
    animation: new FadeAnimation({ duration: 1000 }),
});

// Alternatively
rendSeries.enqueueAnimation(new FadeAnimation({ duration: 1000 }));
```

<CenteredImageWrapper
    src="/images/FadeAnimation_RenderableSeries.gif"
/>

Note: The Sweep, Scale and Wave animations also support fade/opacity by setting the Animation.fadeEffect property to true.

### Scale Startup Animation

Now let's see an example of the Sweep animation on chart types in SciChart.js.

```ts
// Scale Animation

const rendSeries = new FastBandRenderableSeries(wasmContext, {
    dataSeries,
    strokeThickness: 2,
    animation: new ScaleAnimation({ duration: 1000, zeroLineY: -1.5 }),
});

// Alternatively
rendSeries.enqueueAnimation(new ScaleAnimation({ duration: 1000 }));
```

<CenteredImageWrapper
    src="/images/ScaleAnimation_RenderableSeries.gif"
/>

### Wave Startup Animation

Finally let's see an example of the Wave animation on chart types in SciChart.js.

```ts
// Wave Animation

const rendSeries = new FastBandRenderableSeries(wasmContext, {
    dataSeries,
    strokeThickness: 2,
    animation: new WaveAnimation({ duration: 1000, pointDurationFactor: 0.5, zeroLineY: -1.5 }),
});

// Alternatively
rendSeries.enqueueAnimation(new WaveAnimation({ duration: 1000 }));
```

<CenteredImageWrapper
    src="/images/WaveAnimation_RenderableSeries.gif"
/>

#### See Also
* [The Animations API](/2d-charts/animations-api/animations-api-overview/index.md)
* [Style Transition Animations](/2d-charts/animations-api/style-transition-animations/index.md)
* [Dataset Animations](/2d-charts/animations-api/dataset-animations/index.md)
* [Generic Animations](/2d-charts/animations-api/generic-animations/index.md)