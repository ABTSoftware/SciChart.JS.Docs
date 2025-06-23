---
sidebar_position: 1
---

# Custom Chart Modifier API

The ChartModifierBase API is one of the most powerful APIs in the SciChart library.

Using this API you can create behaviours which you can attach to a chart to perform custom Zooming, Panning, Annotation & Markers, Legend output and much much more. Any time you want to do something in JavaScript or Typescript code to alter the behaviour of a SciChartSurface you should be thinking about creating a custom modifier to do it.

The ChartModifierBase2D Type
----------------------------

The ChartModifierBase2D provides a base class for all of the ChartModifiers within SciChart. All of our built-in modifiers such as ZoomPanModifier, RolloverModifier, TooltipModifier, YAxisDragModifier inherit ChartModifierBase2D.

You can create your own ChartModifiers by inheriting this class. For example, this code sample shows how to declare a custom ChartModifier class in JavaScript ES6 or TypeScript.

*   [JavaScript](#i-tab-content-JavaScript)
*   [TypeScript](#i-tab-content-TypeScript)

```ts
import {ChartModifierBase2D} from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import {EChart2DModifierType} from "scichart/types/ChartModifierType";
export class SimpleChartModifierJs extends ChartModifierBase2D {
    constructor() {
        super();
        this.type = EChart2DModifierType.Custom;
    }
    modifierMouseDown(args) {
        super.modifierMouseDown(args);
        console.log(\`MouseDown at point ${args.mousePoint.x}, ${args.mousePoint.y}\`);
    }
    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        console.log(\`MouseMove at point ${args.mousePoint.x}, ${args.mousePoint.y}\`);
    }
    modifierMouseUp(args) {
        super.modifierMouseUp(args);
        console.log(\`MouseUp at point ${args.mousePoint.x}, ${args.mousePoint.y}\`);
    }
    modifierDoubleClick(args) {
        super.modifierDoubleClick(args);
        console.log(\`DoubleClick at point ${args.mousePoint.x}, ${args.mousePoint.y}\`);
    }
    modifierMouseWheel(args) {
        super.modifierMouseWheel(args);
        console.log(\`MouseWheel delta=${args.mouseWheelDelta} at point ${args.mousePoint.x}, ${args.mousePoint.y}\`);
    }
    modifierMouseEnter(args) {
        super.modifierMouseEnter(args);
        console.log(\`MouseEnter!\`);
    }
    modifierMouseLeave(args) {
        super.modifierMouseLeave(args);
        console.log(\`MouseLeave!\`);
    }
}
```

```ts
import {ChartModifierBase2D} from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import {EChart2DModifierType} from "scichart/types/ChartModifierType";
import {ModifierMouseArgs} from "scichart/Charting/ChartModifiers/ModifierMouseArgs";
export class SimpleChartModifierTs extends ChartModifierBase2D {
    readonly type: EChart2DModifierType = EChart2DModifierType.Custom;
    
    override modifierMouseDown(args: ModifierMouseArgs) {
        super.modifierMouseDown(args);
        
        console.log(\`MouseDown at point ${args.mousePoint.x}, ${args.mousePoint.y}\`);
    }
    
    override modifierMouseMove(args: ModifierMouseArgs) {
        super.modifierMouseMove(args);
        
        console.log(\`MouseMove at point ${args.mousePoint.x}, ${args.mousePoint.y}\`);
    }
    override modifierMouseUp(args: ModifierMouseArgs) {
        super.modifierMouseUp(args);
        console.log(\`MouseUp at point ${args.mousePoint.x}, ${args.mousePoint.y}\`);
    }
    override modifierDoubleClick(args: ModifierMouseArgs) {
        super.modifierDoubleClick(args);
        console.log(\`DoubleClick at point ${args.mousePoint.x}, ${args.mousePoint.y}\`);
    }
    
    override modifierMouseWheel(args: ModifierMouseArgs) {
        super.modifierMouseWheel(args);
        console.log(\`MouseWheel delta=${args.mouseWheelDelta} at point ${args.mousePoint.x}, ${args.mousePoint.y}\`);
    }
    
    override modifierMouseEnter(args: ModifierMouseArgs) {
        super.modifierMouseEnter(args);
        console.log(\`MouseEnter!\`);
    }
    
    override modifierMouseLeave(args: ModifierMouseArgs) {
        super.modifierMouseLeave(args);
        
        console.log(\`MouseLeave!\`);
    }
}
```