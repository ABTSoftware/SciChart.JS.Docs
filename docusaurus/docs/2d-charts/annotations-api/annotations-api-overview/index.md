---
sidebar_position: 1
---

# ⚠️ The Annotations API Overview

TODO: update with the text supported surface types Polar not Cartesian

```typescript
export class LineAnnotation extends RenderContextAnnotationBase {
    ...
    public readonly surfaceTypes: ESurfaceType[] = [
        ESurfaceType.SciChartSurfaceType,
        ESurfaceType.SciChartPolarSurfaceType
    ];
    ...
}
```
