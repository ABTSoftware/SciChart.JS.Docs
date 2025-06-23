---
sidebar_position: 20
---

# ✅ Hit-Test API for Polar Column Series 

The IHitTestProvider.hitTest method on [PolarColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) tests if the click was within the Column's body and returns a [HitTestInfo:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/hittestinfo.html) object with the following properties:

The hitTest method on 1 particular Polar Column Series can be implemented as follows:

```ts {4} showLineNumbers
const x = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
const y = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;

const colHitTestInfo = colSeries1.hitTestProvider.hitTest(x, y);
```

The algorithm is as follows:

1. Find the nearest column in X direction.
2. Test if the click was within column body and update [HitTestInfo.isHit:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/hittestinfo.html#isHit) property.


Here is how you would implement it on multiple Polar Column Series:

- First, you need to add the renderable series you plan to hit-test on:

```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
```

- And then, add an event-listener, likely on the "mousedown" event:

```ts {10-12,16} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
```

Which results in this following functionality:

<LiveDocSnippet name="./Basic/demo" />
