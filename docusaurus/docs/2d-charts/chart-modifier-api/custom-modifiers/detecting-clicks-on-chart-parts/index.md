---
sidebar_position: 2
---

# Detecting Clicks On Chart Parts with a Custom Modifier

One of the uses of the custom ChartModifier API is to allow you to create custom behaviours and add them onto a SciChartSurface. These behaviours can be simple or complex, and perform zooming, panning operations or more.

Below we give an example of how to detect clicks on chart parts using the ChartModifier API. This results in the following output on mouse over.

![](/images/ChartModifier-axis-hover-scichart-js.gif)

Detecting Click or MouseOver on Axis, RenderableSeries 
-------------------------------------------------------

In the sample below we've created a custom chartmodifier which allows us to detect whether the mouse is over chart parts such as XAxis, YAxis and RenderableSeries.

The process to create a chart modifier is by extending ChartModifierBase2D and overridding one or more of the functions or callbacks that are called when we interact with the chart.

*   [JavaScript](#i-tab-content-JavaScript)
*   [TypeScript](#i-tab-content-TypeScript)

```ts
import {ChartModifierBase2D} from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import {EChart2DModifierType} from "scichart/types/ChartModifierType";
import {ModifierMouseArgs} from "scichart/Charting/ChartModifiers/ModifierMouseArgs";
import {testIsInBounds} from "scichart/utils/pointUtil";
import {Rect} from "scichart/Core/Rect";
import {RubberBandSvgRect} from "scichart/Charting/Visuals/RubberBandSvgRect/RubberBandSvgRect";
// A custom modifier which detects clicks on chart parts
export class DetectClicksOnChartPartsModifier extends ChartModifierBase2D {
    readonly type: EChart2DModifierType = EChart2DModifierType.Custom;
    private debugRect: RubberBandSvgRect;
    override onAttach() {
        super.onAttach();
        // Rectangle used to show visually what chart part you clicked
        this.debugRect = new RubberBandSvgRect(this.parentSurface.domSvgAdornerLayer, "#FF000033", "Transparent", 0);
    }
    override onDetach() {
        super.onDetach();
        this.debugRect.delete();
    }
    override modifierMouseMove(args: ModifierMouseArgs) {
        super.modifierMouseMove(args);
        if (!this.isAttached) {
            throw new Error("Should not call DetectClicksOnChartPartsModifier.modifierMouseDown if not attached");
        }
        const mousePoint = args.mousePoint;
        this.updateDebugRectangle(undefined);
        // Check if the mouse was over A YAxis
        this.parentSurface?.yAxes.asArray().forEach(yAxis => {
            const { left, right, top, bottom } = yAxis.viewRect;
            if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
                console.log("Mouse is over YAxis ID=" + yAxis.id);
                this.updateDebugRectangle(yAxis.viewRect);
            }
        });
        // Check if the mouse was over an XAxis
        this.parentSurface?.xAxes.asArray().forEach(xAxis => {
            const { left, right, top, bottom } = xAxis.viewRect;
            if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
                console.log("Mouse is over XAxis ID=" + xAxis.id);
                this.updateDebugRectangle(xAxis.viewRect);
            }
        });
        // Check if the mouse was over the main chart area
        const { left, right, top, bottom } = this.parentSurface?.seriesViewRect;
        if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
            console.log("Mouse is over main Chart area");
            this.updateDebugRectangle(this.parentSurface?.seriesViewRect);
            // Check if the mouse was over any series
            this.parentSurface?.renderableSeries.asArray().forEach(rSeries => {
               const hitTestInfo = rSeries.hitTestProvider.hitTest(mousePoint.x, mousePoint.y);
               if (hitTestInfo.isHit) {
                   console.log(`RenderableSeries with seriesname=${rSeries.dataSeries.dataSeriesName} was hovered`);
                   rSeries.isHovered = true;
               } else {
                   rSeries.isHovered = false;
               }
            });
        }
    }
    private updateDebugRectangle(rect: Rect) {
        if (!rect) {
            this.debugRect.isHidden = true;
            return;
        }
        this.debugRect.isHidden = false;
        this.debugRect.x1 = rect.x;
        this.debugRect.y1 = rect.y;
        this.debugRect.x2 = rect.x + rect.width;
        this.debugRect.y2 = rect.y + rect.height;
        this.debugRect.isHidden = false;
    }
}
```

```ts
import {ChartModifierBase2D} from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import {EChart2DModifierType} from "scichart/types/ChartModifierType";
import {ModifierMouseArgs} from "scichart/Charting/ChartModifiers/ModifierMouseArgs";
import {testIsInBounds} from "scichart/utils/pointUtil";
import {Rect} from "scichart/Core/Rect";
import {RubberBandSvgRect} from "scichart/Charting/Visuals/RubberBandSvgRect/RubberBandSvgRect";
// A custom modifier which detects clicks on chart parts
export class DetectClicksOnChartPartsModifier extends ChartModifierBase2D {
    readonly type: EChart2DModifierType = EChart2DModifierType.Custom;
    private debugRect: RubberBandSvgRect;
    override onAttach() {
        super.onAttach();
        // Rectangle used to show visually what chart part you clicked
        this.debugRect = new RubberBandSvgRect(this.parentSurface.domSvgAdornerLayer, "#FF000033", "Transparent", 0);
    }
    override onDetach() {
        super.onDetach();
        this.debugRect.delete();
    }
    override modifierMouseMove(args: ModifierMouseArgs) {
        super.modifierMouseMove(args);
        if (!this.isAttached) {
            throw new Error("Should not call DetectClicksOnChartPartsModifier.modifierMouseDown if not attached");
        }
        const mousePoint = args.mousePoint;
        this.updateDebugRectangle(undefined);
        // Check if the mouse was over A YAxis
        this.parentSurface?.yAxes.asArray().forEach(yAxis => {
            const { left, right, top, bottom } = yAxis.viewRect;
            if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
                console.log("Mouse is over YAxis ID=" + yAxis.id);
                this.updateDebugRectangle(yAxis.viewRect);
            }
        });
        // Check if the mouse was over an XAxis
        this.parentSurface?.xAxes.asArray().forEach(xAxis => {
            const { left, right, top, bottom } = xAxis.viewRect;
            if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
                console.log("Mouse is over XAxis ID=" + xAxis.id);
                this.updateDebugRectangle(xAxis.viewRect);
            }
        });
        // Check if the mouse was over the main chart area
        const { left, right, top, bottom } = this.parentSurface?.seriesViewRect;
        if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
            console.log("Mouse is over main Chart area");
            this.updateDebugRectangle(this.parentSurface?.seriesViewRect);
            // Check if the mouse was over any series
            this.parentSurface?.renderableSeries.asArray().forEach(rSeries => {
               const hitTestInfo = rSeries.hitTestProvider.hitTest(mousePoint.x, mousePoint.y);
               if (hitTestInfo.isHit) {
                   console.log(\`RenderableSeries with seriesname=${rSeries.dataSeries.dataSeriesName} was hovered\`);
                   rSeries.isHovered = true;
               } else {
                   rSeries.isHovered = false;
               }
            });
        }
    }
    private updateDebugRectangle(rect: Rect) {
        if (!rect) {
            this.debugRect.isHidden = true;
            return;
        }
        this.debugRect.isHidden = false;
        this.debugRect.x1 = rect.x;
        this.debugRect.y1 = rect.y;
        this.debugRect.x2 = rect.x + rect.width;
        this.debugRect.y2 = rect.y + rect.height;
        this.debugRect.isHidden = false;
    }
}
```

Above: we create a custom chartmodifier by extending ChartModifierBase2D.

We override onModifierMouseMove (you could easily override onModifierMouseDown, MouseUp, MouseDoubleClick).

Next, we perform a series of tests to see if the mouse pointer is over an axis, or a series.

Try the above code with the following test harness:

*   [using the custom modifier](#i-tab-content-9ab63cb9-4b15-4537-b58c-474f060a3e08)

```ts
import {SciChartSurface} from 'scichart/Charting/Visuals/SciChartSurface';
import {NumericAxis} from 'scichart/Charting/Visuals/Axis/NumericAxis';
import {DetectClicksOnChartPartsModifierJs} from "./DetectClicksOnChartPartsModifier";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {SimpleChartModifierJs} from "./SimpleChartModifierJS";
export async function customModifiersSandboxJs(divId) {
    console.log('customModifier typescript example');
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { id: "XAxis\_0", axisTitle: "XAxis 0", axisAlignment: EAxisAlignment.Top}));
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { id: "XAxis\_1", axisTitle: "XAxis 1", axisAlignment: EAxisAlignment.Bottom}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { id: "YAxis\_0", axisTitle: "YAxis 0", axisAlignment: EAxisAlignment.Left}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { id: "YAxis\_1", axisTitle: "YAxis 1", axisAlignment: EAxisAlignment.Right}));
    sciChartSurface.chartModifiers.add(new DetectClicksOnChartPartsModifierJs());
    sciChartSurface.chartModifiers.add(new SimpleChartModifierJs());
    const xValues = Array.from(Array(25).keys())
    const yValues = xValues.map(x => Math.sin(x \* 0.1));
    console.log(yValues);
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        strokeThickness: 3,
        stroke: "Yellow",
        yAxisId: "YAxis\_0",
        xAxisId: "XAxis\_0",
        onHoveredChanged: sourceSeries => sourceSeries.strokeThickness = sourceSeries.isHovered ? 7 : 3,
    }));
}
```

Find the full code sample for detecting clicks or mouse-over chart parts at [github.com/ABTSoftware/SciChart.JS.Examples/tree/dev\_v2.x/Sandbox/DocumentationSnippets/ChartModifierAPI](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/dev_v2.x/Sandbox/DocumentationSnippets/ChartModifierAPI/src)