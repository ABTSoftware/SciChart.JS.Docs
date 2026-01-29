---
sidebar_position: 11
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# Axis Labels FAQs

## I would like no matter what always to show axis labels, they can overlap but should not hide

This scenario if often useful when we disable **autoTicks** and set **majorDelta** manually. This can be done by setting [INumericAxisOptions.hideOverlappingLabels:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/inumericaxisoptions.html#hideoverlappinglabels) option to `false`.

```typescript {10} 
const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");
	
sciChartSurface.xAxes.add(new NumericAxis(wasmContext));

sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
        labelPrecision: 0,
        autoTicks: false,
        majorDelta: 2,
        hideOverlappingLabels: false
    })
);
```