---
sidebar_position: 13
---

# Hit-Test API for Line Segment Series

The IHitTestProvider.hitTest method on [FastLineSegmentRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastlinesegmentrenderableseries.html) tests if the click was within the Line's bounds and returns a [HitTestInfo:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/hittestinfo.html) object with the following properties:

### HitTest on 1 particular Line Segment Series:

The algorithm is as follows:

1. Find the nearest line in X direction.
2. Test if the click was within line bounds and update [HitTestInfo.isHit:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/hittestinfo.html#isHit) property.

> First, you need to add at least 1 renderable series you plan to hit-test on:

```ts {2,11}showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
```

> And then, add an event-listener, likely on the `mousedown` event:

```ts {27,32,35} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
```

Which results in this following functionality:

<LiveDocSnippet name="./Basic/demo" />