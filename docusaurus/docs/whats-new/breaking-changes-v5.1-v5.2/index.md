---
sidebar_position: 5
---

# Breaking Changes in SciChart.js v5.2 from v5.1

## ArcAnnotation and PolarArcAnnotation strokeThickness changes

`ArcAnnotation` and `PolarArcAnnotation` `strokeThickness` is now treated correctly, which resulted in lines twice as thick, you may want reducing strokeThickness by half.

**Before**

```typescript
const an = new ArcAnnotation({
        height: 0.5,
        innerRadius: 0,
        x1: 4,
        y1: 7,
        x2: 1,
        y2: 8,
        stroke: "purple",
        strokeThickness: 20,
        fill: "grey"
    });
```

**After**

```typescript
const an = new ArcAnnotation({
        height: 0.5,
        innerRadius: 0,
        x1: 4,
        y1: 7,
        x2: 1,
        y2: 8,
        stroke: "purple",
        strokeThickness: 10,
        fill: "grey"
    });
```

## DataPointSelectionModifier selectManyPoints() and selectSinglePoint() returns boolean instead of void

`DataPointSelectionModifier` `selectManyPoints()` and `selectSinglePoint()` returns boolean instead of void. It will affect only TypeScript users who are extending the class.

**Before**

```typescript

class SomeClass extends DataPointSelectionModifier {
    ...
    protected selectManyPoints(rect: Rect, selectionMode: ESelectionMode): void {
        ...
    }
    ...
    protected selectSinglePoint(point: Point, selectionMode: ESelectionMode): void {
        ...
    }
```

**After**

```typescript

class SomeClass extends DataPointSelectionModifier {
    ...
    protected selectManyPoints(rect: Rect, selectionMode: ESelectionMode): boolean {
        ...
        return true; // if at least one point has been selected
    }
    ...
    protected selectSinglePoint(point: Point, selectionMode: ESelectionMode): boolean {
        ...
        return true; // if at least one point has been selected
    }
```

## EAnnotationType.CompositeAnnotation enum item

`EAnnotationType` enum now includes one more value `EAnnotationType.CompositeAnnotation`. It might affect TypeScript users having switch/case conditions with all annotation type check.
