---
sidebar_position: 12
---

# Hit-Test API for Rectangle Series

The IHitTestProvider.hitTest method on [FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastrectanglerenderableseries.html) tests if the click was within the Rectangle's bounds and returns a [HitTestInfo:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/hittestinfo.html) object with the following properties:

### HitTest on 1 particular Rectangle Series:

The algorithm is as follows:

1. Find the nearest rectangle in X direction.
2. Test if the click was within rectangle bounds and update [HitTestInfo.isHit:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/hittestinfo.html#isHit) property.

> First, you need to add at least 1 renderable series you plan to hit-test on:

```ts {6} showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
```

> And then, add an event-listener, likely on the `mousedown` event:

```ts {27,32,35} showLineNumbers file=./Basic/demo.ts start=#region_B_start end=#region_B_end
```

Which results in this following functionality:

<LiveDocSnippet name="./Basic/demo" />