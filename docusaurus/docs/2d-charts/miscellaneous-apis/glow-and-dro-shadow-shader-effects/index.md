---
sidebar_position: 4
---

# ✅ Glow and DropShadow Shader Effects

SciChart.js features WebGL shader-based [GlowEffect:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/gloweffect.html) and [ShadowEffect:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/shadoweffect.html) effects which may be added onto chart types throughout our library.

![WebGL Shader effects applied to JavaScript Charts to achieve glow and dropshadow](/images/RenderableSeries_GlowEffect_Ghosted.png)

**Above**: WebGL GlowEffect added to the Real-time Ghosted Traces example

Adding Glow Effects to Series
-----------------------------

A glow shader effect can be added to series to give it an oscilloscope / VDU style effect.

```ts
// GlowEffect example

import { GlowEffect, Point, FastLineRenderableSeries } from "scichart";

sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 2,
        stroke: "#FFFF00",
        effect: new GlowEffect(wasmContext, {
            range: 0,
            intensity: 1,
            color: "#333333",
            offset: new Point(10, 10)
        })
    })
);
```

This results in the following (visible in the [Vital Signs monitor](https://demo.scichart.com/javascript-vital-signs-ecg-medical-chart-example) example).

![WebGL Shader effects applied to JavaScript Charts to achieve glow and dropshadow](/images/RenderableSeries_GlowEffect_VitalSigns.png)

Adding Shadow Effect to Series
------------------------------

Drop-shadow effects are also in development, and an example will be provided soon.