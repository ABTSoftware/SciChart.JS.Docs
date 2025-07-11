---
sidebar_position: 3
---

# Hit-Test API for Line Series

The hitTest method on Line Series
---------------------------------

The **IHitTestProvider.hitTest** method on [FastLineRenderableSeries](/2d-charts/chart-types/fast-line-renderable-series) tests if the click was within the **hitTestRadius** from the line. The algorithm differs for sorted and unsorted data.

```ts
// hitTest method on LineSeries
const hitTestInfo = lineSeries.hitTestProvider.hitTest(premultipliedX, premultipliedY, HIT_TEST_RADIUS);
```

For **sorted data** the algorithm is as follows:

1.  Find the nearest point in X direction.
2.  Take the second adjacent point which is on the other side from the hit-test point.
3.  Calculate the distance from the hit-test point to the line formed by two points above and update HitTestInfo.isHit property.

For **unsorted data**:

1.  Iterate over each of the line segments and find the index with minimal distance to the hit-test point.
2.  Compare this distance with the **hitTestRadius** and update **HitTestInfo.isHit** property.

The hitTestDataPoint method on Line Series
------------------------------------------

The **IHitTestProvider.hitTestDataPoint** method on [FastLineRenderableSeries](/2d-charts/chart-types/fast-line-renderable-series) tests if the click was within the **hitTestRadius** from a data point.

```ts
// hitTestDataPoint method on Line Series
const hitTestInfo = lineSeries.hitTestProvider.hitTestDataPoint(premultipliedX, premultipliedY, HIT_TEST_RADIUS);
```

 The algorithm is as follows:

1.  Iterate over each of the points to find the nearest one on the XY plane.
    
2.  Compare distance to the nearest point with the **hitTestRadius** and update **HitTestInfo.isHit** property.
    

This is an example of the **hitTestDataPoint** method usage.

<CodeSnippetBlock labels={["JS","TS"]}>
```ts showLineNumbers
import {SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries, NumberRange, DpiHelper, CustomAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart";

export async function hitTestTs(divId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);
    const HIT_TEST_RADIUS = 10 * DpiHelper.PIXEL_RATIO;
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));
    const xLineValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yLineValues = [0, 0.5, 1.3, 2.4, 3, 2.5, 2.2, 1.9, 1.2];
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 3,
        dataSeries: new XyDataSeries(wasmContext, { xValues: xLineValues, yValues: yLineValues })
    });
    sciChartSurface.renderableSeries.add(lineSeries);
    // Add an SVG annotation to display the mouse click
    const svgAnnotation = new CustomAnnotation({
        svgString: `<svg width="8" height="8"><circle cx="50%" cy="50%" r="4" fill="#FF0000"/></svg>`,
        isHidden: true,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center
    });
    sciChartSurface.annotations.add(svgAnnotation);
    sciChartSurface.domCanvas2D.addEventListener('mousedown', (mouseEvent) => {
        const mouseClickX = mouseEvent.offsetX;
        const mouseClickY = mouseEvent.offsetY;
        console.log("mouseClickX", mouseClickX, "mouseClickY", mouseClickY);
        const premultipliedX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const premultipliedY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        console.log('premultipliedX', premultipliedX, 'premultipliedY', premultipliedY);
        // IHitTestProvider.hitTestDataPoint
        const hitTestInfo = lineSeries.hitTestProvider.hitTestDataPoint(premultipliedX, premultipliedY, HIT_TEST_RADIUS);
        svgAnnotation.x1 = hitTestInfo.hitTestPointValues.x;
        svgAnnotation.y1 = hitTestInfo.hitTestPointValues.y;
        svgAnnotation.isHidden = false;
        const resultDiv = document.getElementById("result");
        resultDiv.innerText = `isHit = ${hitTestInfo.isHit}`;
        console.log('hitTestInfo', hitTestInfo);
    });
}
```
```ts showLineNumbers
import {SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries, NumberRange, DpiHelper, CustomAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart";

export async function hitTestTs(divId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);
    const HIT_TEST_RADIUS = 10 * DpiHelper.PIXEL_RATIO;
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));
    const xLineValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yLineValues = [0, 0.5, 1.3, 2.4, 3, 2.5, 2.2, 1.9, 1.2];
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 3,
        dataSeries: new XyDataSeries(wasmContext, { xValues: xLineValues, yValues: yLineValues })
    });
    sciChartSurface.renderableSeries.add(lineSeries);
    // Add an SVG annotation to display the mouse click
    const svgAnnotation = new CustomAnnotation({
        svgString: `<svg width="8" height="8"><circle cx="50%" cy="50%" r="4" fill="#FF0000"/></svg>`,
        isHidden: true,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center
    });
    sciChartSurface.annotations.add(svgAnnotation);
    sciChartSurface.domCanvas2D.addEventListener('mousedown', (mouseEvent: MouseEvent) => {
        const mouseClickX = mouseEvent.offsetX;
        const mouseClickY = mouseEvent.offsetY;
        console.log("mouseClickX", mouseClickX, "mouseClickY", mouseClickY);
        const premultipliedX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const premultipliedY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        console.log('premultipliedX', premultipliedX, 'premultipliedY', premultipliedY);
        // IHitTestProvider.hitTestDataPoint
        const hitTestInfo = lineSeries.hitTestProvider.hitTestDataPoint(premultipliedX, premultipliedY, HIT_TEST_RADIUS);
        svgAnnotation.x1 = hitTestInfo.hitTestPointValues.x;
        svgAnnotation.y1 = hitTestInfo.hitTestPointValues.y;
        svgAnnotation.isHidden = false;
        const resultDiv = document.getElementById("result");
        resultDiv.innerText = `isHit = ${hitTestInfo.isHit}`;
        console.log('hitTestInfo', hitTestInfo);
    });
}
```
</CodeSnippetBlock>





If we run the example we get this chart. 

<CenteredImageWrapper
    src="/images/HitTestApi_line-chart-hittest-datapoint1.png"
/>

Clicking near a data point results is **isHit=true**.  In the browser console you will find output for the **HitTestInfo** object.

 The hitTestXSlice method on Line Series
----------------------------------------

The **IHitTestProvider.hitTestXSlice** method is used for [CursorModifier](/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview) and [RolloverModifier](/2d-charts/chart-modifier-api/rollover-modifier) to get information about the nearest point.

```ts
// hitTestXSlice method on Line Series
const hitTestInfo = lineSeries.hitTestProvider.hitTestXSlice(premultipliedX, premultipliedY);
```

 The way it works:

1.  Finds the nearest point in X direction.
2.  Sets **HitTestInfo.isHit** property to True if the mouse click was within the data bounds.

#### See Also

* [Hit-Test API for Bubble Series](/2d-charts/chart-types/hit-test-api/fast-bubble-renderable-series)
* [Hit-Test API for Column Series](/2d-charts/chart-types/hit-test-api/fast-column-renderable-series)
* [Hit-Test API for Heatmap Series](/2d-charts/chart-types/hit-test-api/uniform-heatmap-renderable-series)
* [Hit-Test API for Rectangle Series](/2d-charts/chart-types/hit-test-api/fast-rectangle-renderable-series)
* [Hit-Test API for Polar Line Series](/2d-charts/chart-types/hit-test-api/polar-line-renderable-series)
