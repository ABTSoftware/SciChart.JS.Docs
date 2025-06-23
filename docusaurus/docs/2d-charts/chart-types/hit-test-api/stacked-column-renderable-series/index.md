---
sidebar_position: 10
---

# ✅ Hit-Test API for Stacked Column Series

The hitTest method on Stacked Column Series
-------------------------------------------

The **IHitTestProvider.hitTest** method on [StackedColumnRenderableSeries](/docs/2d-charts/chart-types/stacked-column-renderable-series/index.md) tests if the click was within a stacked column.

```ts
// hitTest method on Stacked Column Series
const hitTestInfo = stackedColumnRenderableSeries.hitTestProvider.hitTest(
    premultipliedX,
    premultipliedY
);
```

 The algorithm is as follows:

1.  Find the nearest column in X direction.
2.  Test if the click was within the column body and update **HitTestInfo.isHit** property.

This is the full example of the **hitTest** method on Stacked Column Series.

<CodeSnippetBlock labels={["JS","TS"]}>
```ts showLineNumbers
import { SciChartSurface, NumericAxis, DpiHelper, CustomAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint, NumberRange, XyDataSeries, StackedColumnRenderableSeries, StackedColumnCollection, HitTestInfo } from 'scichart';

export async function hitTestStackedColumnTs(divId) {
    const xValues = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003];
    const porkData = [10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11];
    const vealData = [12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10];
    const tomatoesData = [7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22];
    const cucumberData = [16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17];
    const pepperData = [7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16];
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);
    const xAxis = new NumericAxis(wasmContext);
    xAxis.labelProvider.precision = 0;
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext);
    yAxis.growBy = new NumberRange(0, 0.1);
    sciChartSurface.yAxes.add(yAxis);
    const dataSeries1 = new XyDataSeries(wasmContext, { xValues, yValues: porkData, dataSeriesName: 'Pork' });
    const dataSeries2 = new XyDataSeries(wasmContext, { xValues, yValues: vealData, dataSeriesName: 'Veal' });
    const dataSeries3 = new XyDataSeries(wasmContext, { xValues, yValues: tomatoesData, dataSeriesName: 'Tomato' });
    const dataSeries4 = new XyDataSeries(wasmContext, { xValues, yValues: cucumberData, dataSeriesName: 'Cucumber' });
    const dataSeries5 = new XyDataSeries(wasmContext, { xValues, yValues: pepperData, dataSeriesName: 'Pepper' });
    const rendSeries1 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries1.fill = '#226Fb7';
    rendSeries1.stroke = 'black';
    rendSeries1.strokeThickness = 1;
    rendSeries1.dataSeries = dataSeries1;
    rendSeries1.rolloverModifierProps.markerColor = '#19548b';
    rendSeries1.rolloverModifierProps.tooltipColor = '#226Fb7';
    rendSeries1.rolloverModifierProps.tooltipTextColor = '#fff';
    rendSeries1.stackedGroupId = 'Meat';
    const rendSeries2 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries2.fill = '#ff9a2e';
    rendSeries2.dataSeries = dataSeries2;
    rendSeries2.rolloverModifierProps.markerColor = '#db8428';
    rendSeries2.rolloverModifierProps.tooltipColor = '#ff9a2e';
    rendSeries2.rolloverModifierProps.tooltipTextColor = '#000';
    rendSeries2.stackedGroupId = 'Meat';
    const rendSeries3 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries3.fill = '#dc443f';
    rendSeries3.dataSeries = dataSeries3;
    rendSeries3.rolloverModifierProps.markerColor = '#b83735';
    rendSeries3.rolloverModifierProps.tooltipColor = '#dc443f';
    rendSeries3.rolloverModifierProps.tooltipTextColor = '#fff';
    rendSeries3.stackedGroupId = 'Vegetables';
    const rendSeries4 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries4.fill = '#aad34f';
    rendSeries4.dataSeries = dataSeries4;
    rendSeries4.rolloverModifierProps.markerColor = '#87a73e';
    rendSeries4.rolloverModifierProps.tooltipColor = '#aad34f';
    rendSeries4.rolloverModifierProps.tooltipTextColor = '#000';
    rendSeries4.stackedGroupId = 'Vegetables';
    const rendSeries5 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries5.fill = '#8562b4';
    rendSeries5.dataSeries = dataSeries5;
    rendSeries5.rolloverModifierProps.markerColor = '#715195';
    rendSeries5.rolloverModifierProps.tooltipColor = '#8562b4';
    rendSeries5.rolloverModifierProps.tooltipTextColor = '#fff';
    rendSeries5.stackedGroupId = 'Vegetables';
    const verticallyStackedColumnCollection = new StackedColumnCollection(wasmContext);
    verticallyStackedColumnCollection.dataPointWidth = 0.8;
    verticallyStackedColumnCollection.add(rendSeries3, rendSeries4, rendSeries5, rendSeries1, rendSeries2);
    sciChartSurface.renderableSeries.add(verticallyStackedColumnCollection);
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
        console.log('mouseClickX', mouseClickX, 'mouseClickY', mouseClickY);
        const premultipliedX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const premultipliedY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        console.log('premultipliedX', premultipliedX, 'premultipliedY', premultipliedY);
        const hitTestResults = verticallyStackedColumnCollection
            .asArray()
            .reduce((acc, stackedColumnRenderableSeries) => {
                const hitTestInfo = stackedColumnRenderableSeries.hitTestProvider.hitTest(
                    premultipliedX,
                    premultipliedY
                );
                acc.push(hitTestInfo);
                return acc;
            }, []);
        svgAnnotation.x1 = hitTestResults[0].hitTestPointValues.x;
        svgAnnotation.y1 = hitTestResults[0].hitTestPointValues.y;
        svgAnnotation.isHidden = false;
        const resultDiv = document.getElementById('result');
        resultDiv.innerText = JSON.stringify(
            hitTestResults.map((hitTestInfo, index) => `${index} isHit = ${hitTestInfo.isHit}; `)
        );
        console.log('hitTestResults', hitTestResults);
    });
}
```
```ts showLineNumbers
import { SciChartSurface, NumericAxis, DpiHelper, CustomAnnotation, EHorizontalAnchorPoint, EVerticalAnchorPoint, NumberRange, XyDataSeries, StackedColumnRenderableSeries, StackedColumnCollection, HitTestInfo } from 'scichart';

export async function hitTestStackedColumnTs(divId: string) {
    const xValues = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003];
    const porkData = [10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11];
    const vealData = [12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10];
    const tomatoesData = [7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22];
    const cucumberData = [16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17];
    const pepperData = [7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16];
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);
    const xAxis = new NumericAxis(wasmContext);
    xAxis.labelProvider.precision = 0;
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext);
    yAxis.growBy = new NumberRange(0, 0.1);
    sciChartSurface.yAxes.add(yAxis);
    const dataSeries1 = new XyDataSeries(wasmContext, { xValues, yValues: porkData, dataSeriesName: 'Pork' });
    const dataSeries2 = new XyDataSeries(wasmContext, { xValues, yValues: vealData, dataSeriesName: 'Veal' });
    const dataSeries3 = new XyDataSeries(wasmContext, { xValues, yValues: tomatoesData, dataSeriesName: 'Tomato' });
    const dataSeries4 = new XyDataSeries(wasmContext, { xValues, yValues: cucumberData, dataSeriesName: 'Cucumber' });
    const dataSeries5 = new XyDataSeries(wasmContext, { xValues, yValues: pepperData, dataSeriesName: 'Pepper' });
    const rendSeries1 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries1.fill = '#226Fb7';
    rendSeries1.stroke = 'black';
    rendSeries1.strokeThickness = 1;
    rendSeries1.dataSeries = dataSeries1;
    rendSeries1.rolloverModifierProps.markerColor = '#19548b';
    rendSeries1.rolloverModifierProps.tooltipColor = '#226Fb7';
    rendSeries1.rolloverModifierProps.tooltipTextColor = '#fff';
    rendSeries1.stackedGroupId = 'Meat';
    const rendSeries2 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries2.fill = '#ff9a2e';
    rendSeries2.dataSeries = dataSeries2;
    rendSeries2.rolloverModifierProps.markerColor = '#db8428';
    rendSeries2.rolloverModifierProps.tooltipColor = '#ff9a2e';
    rendSeries2.rolloverModifierProps.tooltipTextColor = '#000';
    rendSeries2.stackedGroupId = 'Meat';
    const rendSeries3 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries3.fill = '#dc443f';
    rendSeries3.dataSeries = dataSeries3;
    rendSeries3.rolloverModifierProps.markerColor = '#b83735';
    rendSeries3.rolloverModifierProps.tooltipColor = '#dc443f';
    rendSeries3.rolloverModifierProps.tooltipTextColor = '#fff';
    rendSeries3.stackedGroupId = 'Vegetables';
    const rendSeries4 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries4.fill = '#aad34f';
    rendSeries4.dataSeries = dataSeries4;
    rendSeries4.rolloverModifierProps.markerColor = '#87a73e';
    rendSeries4.rolloverModifierProps.tooltipColor = '#aad34f';
    rendSeries4.rolloverModifierProps.tooltipTextColor = '#000';
    rendSeries4.stackedGroupId = 'Vegetables';
    const rendSeries5 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries5.fill = '#8562b4';
    rendSeries5.dataSeries = dataSeries5;
    rendSeries5.rolloverModifierProps.markerColor = '#715195';
    rendSeries5.rolloverModifierProps.tooltipColor = '#8562b4';
    rendSeries5.rolloverModifierProps.tooltipTextColor = '#fff';
    rendSeries5.stackedGroupId = 'Vegetables';
    const verticallyStackedColumnCollection = new StackedColumnCollection(wasmContext);
    verticallyStackedColumnCollection.dataPointWidth = 0.8;
    verticallyStackedColumnCollection.add(rendSeries3, rendSeries4, rendSeries5, rendSeries1, rendSeries2);
    sciChartSurface.renderableSeries.add(verticallyStackedColumnCollection);
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
        console.log('mouseClickX', mouseClickX, 'mouseClickY', mouseClickY);
        const premultipliedX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const premultipliedY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        console.log('premultipliedX', premultipliedX, 'premultipliedY', premultipliedY);
        const hitTestResults: HitTestInfo[] = verticallyStackedColumnCollection
            .asArray()
            .reduce((acc: HitTestInfo[], stackedColumnRenderableSeries: StackedColumnRenderableSeries) => {
                const hitTestInfo = stackedColumnRenderableSeries.hitTestProvider.hitTest(
                    premultipliedX,
                    premultipliedY
                );
                acc.push(hitTestInfo);
                return acc;
            }, []);
        svgAnnotation.x1 = hitTestResults[0].hitTestPointValues.x;
        svgAnnotation.y1 = hitTestResults[0].hitTestPointValues.y;
        svgAnnotation.isHidden = false;
        const resultDiv = document.getElementById('result');
        resultDiv.innerText = JSON.stringify(
            hitTestResults.map((hitTestInfo, index) => `${index} isHit = ${hitTestInfo.isHit}; `)
        );
        console.log('hitTestResults', hitTestResults);
    });
}
```
</CodeSnippetBlock>

The **StackedColumnCollection** in this example has five [StackedColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedcolumnrenderableseries.html). Therefore, we use **reduce** function to iterate over each renderable series and to accumulate the result.

This gives us the following chart.

![](/images/HitTestApi_stacked-column-chart1.png)

 If we click inside the column it will be hit for the corresponding renderable series in the collection. In the browser console you will find output with array of **HitTestInfo** results.

The hitTestDataPoint method on Stacked Column Series
----------------------------------------------------

The **IHitTestProvider.hitTestDataPoint** method is not supported for [StackedColumnRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedcolumnrenderableseries.html).

The hitTestXSlice method on Column Series
-----------------------------------------

The **IHitTestProvider.hitTestXSlice** method is used for [CursorModifier](/docs/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview/index.md) and [RolloverModifier](/docs/2d-charts/chart-modifier-api/rollover-modifier/index.md) to get information about the nearest point.

```ts
// hitTestXSlice on Stacked Column Series
const hitTestInfo = stackedColumnRenderableSeries.hitTestProvider.hitTestXSlice(
    premultipliedX,
    premultipliedY
);
```

 The way it works:

1.  Finds the nearest point in X direction.
2.  Sets **HitTestInfo.isHit** property **True** if the mouse click was over the column bar.

#### See Also

* [Hit-Test API for Line Series](/docs/2d-charts/chart-types/hit-test-api/fast-line-renderable-series/index.md)
* [Hit-Test API for Band Series](/docs/2d-charts/chart-types/hit-test-api/fast-band-renderable-series/index.md)
* [Hit-Test API for Bubble Series](/docs/2d-charts/chart-types/hit-test-api/fast-bubble-renderable-series/index.md)
* [Hit-Test API for Column Series](/docs/2d-charts/chart-types/hit-test-api/fast-column-renderable-series/index.md)
* [Hit-Test API for Heatmap Series](/docs/2d-charts/chart-types/hit-test-api/uniform-heatmap-renderable-series/index.md)
* [Hit-Test API for Rectangle Series](/docs/2d-charts/chart-types/hit-test-api/fast-rectangle-renderable-series/index.md)
* [Hit-Test API for Polar Line Series](/docs/2d-charts/chart-types/hit-test-api/polar-line-renderable-series/README.md)
