---
sidebar_position: 20
---

# ✅ Hit-Test API for Polar Line Series 

The IHitTestProvider.hitTest method on [PolarLineRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html) tests if the click was within the Line's bounds and returns a [HitTestInfo:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/hittestinfo.html) object with the following properties:

### HitTest on 1 particular Polar Line Series:

Calling the `hitTest` method on one specific series is very easy and can be done this way:

```ts {4} showLineNumbers
const x = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
const y = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;

const lineHitTestInfo: HitTestInfo = lineSeries1.hitTestProvider.hitTest(x, y);
```

The algorithm is as follows:

1. Find the nearest line in X direction.
2. Test if the click was within line bounds and update [HitTestInfo.isHit:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/hittestinfo.html#isHit) property.


### Here is how you would implement it on multiple Polar Line Series:

> First, you need to add the renderable series you plan to hit-test on:

```ts {2,11}showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
```

> And then, add an event-listener, likely on the "mousedown" event:

```ts {29,37,43} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
```

Which results in this following functionality:

<LiveDocSnippet name="./Basic/demo" />