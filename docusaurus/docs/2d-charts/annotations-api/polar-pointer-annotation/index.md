---
sidebar_position: 16
---

# ✅ PolarPointerAnnotation

The [PolarPointerAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpointerannotation.html) creates a customizable SVG pointer for polar charts, ideal for gauges or radial indicators. It consists of 3 customizable elements: a pointer stick, center circle (optional), and arrowhead (also optional).

## Basic Usage 
```ts {33,38,40-45} showLineNumbers file=./Basic/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./Basic/demo" />

## Key Configuration Properties

### Core Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| x1 | number | 0 | Rotation angle (radians/data-value) |
| y1 | number | 0 | Pointer length (pixels/data-value) |
| xCoordinateMode | [ECoordinateMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#ecoordinatemode) | DataValue | Units for rotation angle |
| yCoordinateMode | [ECoordinateMode:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#ecoordinatemode) | DataValue | Units for pointer length |
| isStrokeAboveCenter | boolean | false | Z-order: pointer above/below center |

### Style Objects

The 3 main style objects control the appearance of the pointer: 
| Property | Type | Description |
|----------|------|-------------|
| pointerStyle | [TPointerStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#tpointerstyle) | Styling of the main stick of the pointer annotation. By default only this part will appear |
| pointerArrowStyle | [TPointerArrowStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#tpointerarrowstyle) | Styles the arrowhead of the pointer annotation. To see the arrow end, you must set its `height` or `width`. |
| pointerCenterStyle | [TPointerCenterStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#tpointercenterstyle) | Styles the center circle of the pointer annotation. To see the center circle, you must set its `size`. |

:::tip
The arrowhead of the pointer does not appear by default. Set [pointerArrowStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#tpointerarrowstyle)'s width & height to see it.
```ts {5-6} showLineNumbers
const arrowheadPointer = new PolarPointerAnnotation({
    // .....

    pointerArrowStyle: {
        width: 0.1,
        height: 0.16,
        stroke: "#222",
        fill: "#fff",
        headDepth: 0.8
    },
});
```
:::

:::tip
In simlar fashion, the base circle only appears if the [pointerCenterStyle:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/index.html#tpointercenterstyle) option is defined.
```ts {5} showLineNumbers
const centerCirclePointer = new PolarPointerAnnotation({
    // .....

    pointerCenterStyle: {
        size: 0.1,
        fill: "#EEE"
    }
});
```

:::

:::tip
In the case you want a **stick-less** pointer annotation, this can be achieved by doing this:
```ts {5-6} showLineNumbers
const stickLessPointer = new PolarPointerAnnotation({
    // .....

    pointerStyle: { // Hide the pointer stick
        baseSize: 0,
        stroke: "none"
    },


    pointerArrowStyle: { // make the arrowhead visible so a pointer entity still exists
        // .....
        width: 0.1,
        height: 0.16,
        stroke: "#222",
    }
});
```
:::

## Advanced Customization
Override SVG generation methods for full control:

```ts {35,52,67} showLineNumbers file=./Custom/demo.ts start=region_A_start end=region_A_end
```

<LiveDocSnippet name="./Custom/demo" />

:::tip
The [PolarPointerAnnotation:blue_book:](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpointerannotation.html) plays a crucial role within a [Gauge Chart](../../chart-types/polar-gauge-chart/)
:::

#### See Also

* [Polar Gauge Chart](../../chart-types/polar-gauge-chart/)
