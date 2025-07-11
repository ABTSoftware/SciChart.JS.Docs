---
sidebar_position: 2
---

# Hit-Test API for Band Series

The hitTest method on Band Series
---------------------------------

The **IHitTestProvider.hitTest** method on [FastBandRenderableSeries](/2d-charts/chart-types/fast-band-renderable-series) tests if the click was within the band body.

**hitTest method on Band Series**

```ts
const hitTestInfo = bandSeries.hitTestProvider.hitTest(premultipliedX, premultipliedY);
```

The algorithm is as follows:

1.  Find the nearest data point in X direction.
2.  Test if the click was within the band body and update **HitTestInfo.isHit** property.

This is the full example of the **hitTest** method on Band Series.


<CodeSnippetBlock labels={["TS"]}>
    ```ts showLineNumbers file=./demo.ts start=region_A_start end=region_A_end
    ```
</CodeSnippetBlock>


 This gives us the chart below.

<LiveDocSnippet maxWidth={"100%"} name="demo" htmlType="WithResult" />

<CenteredImageWrapper
    src="/images/HitTestApi_band-chart1.png"
/>

If we click inside the band it will be hit. In the browser console you will find output for the **HitTestInfo** object containing **y1Value** and **y1Coord** properties specific for the series.

The hitTestDataPoint method on Band Series
------------------------------------------

The **IHitTestProvider.hitTestDataPoint** method on [FastBandRenderableSeries](/2d-charts/chart-types/fast-band-renderable-series) tests if the click was within the **hitTestRadius** from XY or XY1 data point.

**hitTestDataPoint method on Band Series**

```ts
const hitTestInfo = bandSeries.hitTestProvider.hitTestDataPoint(premultipliedX, premultipliedY, HIT_TEST_RADIUS);
```

 The algorithm is as follows:

1.  Iterate over each of XY and XY1 points to find the nearest one on the plane.
2.  Compare distance to XY and XY1 points with the **hitTestRadius** and update **HitTestInfo.isHit** property accordingly.

The hitTestXSlice method on Band Series
---------------------------------------

The **IHitTestProvider.hitTestXSlice** method is used for [CursorModifier](/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview) and [RolloverModifier](/2d-charts/chart-modifier-api/rollover-modifier) to get information about the nearest point.

**hitTestXSlice method on Band Series**

```ts
const hitTestInfo = bandSeries.hitTestProvider.hitTestXSlice(premultipliedX, premultipliedY);
```

 The way it works:

1.  Finds the nearest point in X direction.
2.  Sets **HitTestInfo.isHit** property to **True** if the mouse click was within the data bounds.

#### See Also

* [Hit-Test API for Line Series](/2d-charts/chart-types/hit-test-api/fast-line-renderable-series)
* [Hit-Test API for Bubble Series](/2d-charts/chart-types/hit-test-api/fast-bubble-renderable-series)
* [Hit-Test API for Column Series](/2d-charts/chart-types/hit-test-api/fast-column-renderable-series)
* [Hit-Test API for Heatmap Series](/2d-charts/chart-types/hit-test-api/uniform-heatmap-renderable-series)
* [Hit-Test API for Rectangle Series](/2d-charts/chart-types/hit-test-api/fast-rectangle-renderable-series)
* [Hit-Test API for Polar Line Series](/2d-charts/chart-types/hit-test-api/polar-line-renderable-series)