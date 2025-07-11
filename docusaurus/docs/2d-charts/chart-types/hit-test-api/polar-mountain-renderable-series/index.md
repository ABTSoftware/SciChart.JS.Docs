---
sidebar_position: 20
---

# Hit-Test API for Polar Mountain Series 

The IHitTestProvider.hitTest method on [PolarMountainRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmountainrenderableseries.html) tests if the click was within the mountain body, and returns a [HitTestInfo:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/hittestinfo.html) object with the following properties:

## Hit-Test on a particular Polar Mountain Series

Calling the `hitTest` method on one specific series can be done this way:

```ts {4} showLineNumbers
const x = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
const y = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;

const hitTestInfo: HitTestInfo = polarMountainSeries.hitTestProvider.hitTest(x, y);
```

The algorithm is as follows:

1. Finds two nearest points in x direction that the x-hit value falls between them.
2. Tests if the click is within the triangle formed by two nearest points and the center of polar surface [HitTestInfo.isHit:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/hittestinfo.html#isHit) property.


## Hit-Test on multiple Polar Mountain Series

First, we add two renderable series we will hit-test on:

```ts {2,11}showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
```

Second, we add an event-listener on the "mousedown" event:

```ts {2,16} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
```

Which results in the following example

<LiveDocSnippet name="./Basic/demo" />