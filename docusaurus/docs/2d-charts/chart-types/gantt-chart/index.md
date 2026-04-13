---
sidebar_position: 37
---

# Gantt Charts

A Gantt chart visualizes tasks against a time axis — each task is drawn as a horizontal bar spanning its start and end dates. Optional metadata such as completion percentage, assignee, or priority can be attached to each bar. Typical use cases include project scheduling, sprint planning, and resource allocation.

SciChart.js has no dedicated Gantt series. Gantt charts are assembled from [FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastrectanglerenderableseries.html) for the task bars, a [CategoryAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/categoryaxis.html) for the task rows on the Y axis, and a [DateTimeNumericAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/datetimenumericaxis.html) for the timeline on the X axis.

:::tip
The [JavaScript Gantt Chart Example](https://www.scichart.com/demo/react/gantt-chart) can be found in the [SciChart.JS Examples Suite](https://github.com/ABTSoftware/SciChart.JS.Examples) on GitHub, or in the live demo at [scichart.com/demo](https://www.scichart.com/demo/react/gantt-chart).
:::

<ChartFromSciChartDemo
    src="https://www.scichart.com/demo/iframe/gantt-chart"
    title="Gantt Chart"
/>

## Core Building Blocks

A Gantt chart in SciChart.js is assembled from:

- **[FastRectangleRenderableSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastrectanglerenderableseries.html)** — renders each task as a horizontal bar
- **[XyxyDataSeries:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyxydataseries.html)** — stores `[x, y, x1, y1]` per task: start date, row bottom, end date, row top
- **[EColumnMode.StartEnd:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/ecolumnmode.html#startend)** — interprets `x` and `x1` as explicit start/end positions on the X axis
- **[EColumnYMode.TopBottom:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/enums/ecolumnymode.html#topbottom)** — interprets `y` and `y1` as explicit bottom/top positions on the Y axis
- **[CategoryAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/categoryaxis.html)** — Y axis mapping integer row indices to task name strings; `flippedCoordinates: true` puts row 0 at the top
- **[DateTimeNumericAxis:blue_book:](https://www.scichart.com/documentation/js/v5/typedoc/classes/datetimenumericaxis.html)** — X axis with automatic date/time tick formatting; dates are passed as Unix millisecond timestamps

## Examples

### Basic Gantt Chart

The simplest Gantt chart uses a plain `NumericAxis` on both axes and a `FastRectangleRenderableSeries` with `EColumnMode.StartEnd` and `EColumnYMode.TopBottom`. Each task occupies one integer row on the Y axis with a bar height less than 1 to leave gaps between rows.

<LiveDocSnippet name="./basic/demo" />

```ts showLineNumbers file=./basic/demo.ts start=region_A_start end=region_A_end
```

## Data Format

For a real project timeline, convert task objects into the four flat arrays that `XyxyDataSeries` expects. Dates are passed as Unix millisecond timestamps via `Date.getTime()`. Metadata attached to each data point is later used by tooltips and data labels.

The `prepareGanttData` function from the project-timeline demo:

```ts
function prepareGanttData(tasks: GanttTask[]) {
    const xValues: number[]  = [];
    const yValues: number[]  = [];
    const x1Values: number[] = [];
    const y1Values: number[] = [];
    const metadata: { name: string; start: Date; end: Date; percentComplete: number }[] = [];

    tasks.forEach((task, i) => {
        xValues.push(task.startDate.getTime());
        x1Values.push(task.endDate.getTime());
        // CategoryAxis is reversed: index 0 = top row, so y increases downward
        yValues.push(i);
        y1Values.push(i + BAR_HEIGHT);
        metadata.push({ name: task.name, start: task.startDate, end: task.endDate, percentComplete: task.percentComplete });
    });

    return { xValues, yValues, x1Values, y1Values, metadata };
}
```

Metadata is attached to the `XyxyDataSeries` constructor:

```ts
new XyxyDataSeries(wasmContext, { xValues, yValues, x1Values, y1Values, metadata })
```

## Axis Setup

### DateTimeNumericAxis (X)

The X axis uses `DateTimeNumericAxis` with `labelFormat: ENumericFormat.Date_DDMMYYYY` so tick labels are automatically formatted as readable dates:

```ts
// X axis: date/time timeline
sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext, {
    labelFormat: ENumericFormat.Date_DDMMYYYY,
    growBy: new NumberRange(0.02, 0.05)
}));
```

### CategoryAxis (Y)

The Y axis uses `CategoryAxis` with `flippedCoordinates: true` so that row index 0 appears at the top (matching typical Gantt chart conventions). A custom `formatLabel` on the label provider maps integer row indices to task name strings:

```ts
// Y axis: category labels for each project stage, reversed so row 0 is at the top
const yAxis = new CategoryAxis(wasmContext, {
    isLabelCullingEnabled: false,
    axisAlignment: EAxisAlignment.Left,
    flippedCoordinates: true,
    growBy: new NumberRange(0.05, 0.05),
    labelStyle: { padding: { bottom: 40 } }
});
// Map integer row indices to task name strings
yAxis.labelProvider.formatLabel = (dataValue: number) =>
    TASKS[Math.round(dataValue)]?.name ?? "";
sciChartSurface.yAxes.add(yAxis);
```

:::tip
Set `isLabelCullingEnabled: false` to ensure all task labels are always visible.
:::

## Styling

Task bars support rounded corners, opacity, stroke, and data labels. The `getTextFunc` callback reads the completion percentage from the per-point metadata and renders it inside each bar:

```ts
const ganttSeries = new FastRectangleRenderableSeries(wasmContext, {
    dataSeries: new XyxyDataSeries(wasmContext, { xValues, yValues, x1Values, y1Values, metadata }),
    columnXMode: EColumnMode.StartEnd,
    columnYMode: EColumnYMode.TopBottom,
    fill: "#4a90d9",
    stroke: "white",
    strokeThickness: 1,
    opacity: 0.5,
    topCornerRadius: 4,
    bottomCornerRadius: 4,
    dataLabels: {
        style: { fontSize: 14, fontFamily: "Arial" },
        color: "white",
        labelAlignment: ELabelAlignment.Center,
        // display completion percentage from metadata
        getTextFunc: (_state, _x, _y, _x1, _y1, index) => {
            const m = metadata[index];
            return m ? `${m.percentComplete}%` : "";
        }
    }
});
```

## Project Timeline Example

The full project timeline example adds a `CategoryAxis`, `DateTimeNumericAxis`, per-task metadata, data labels showing completion percentage, and interactive tooltips via `CursorModifier`.

<LiveDocSnippet name="./project-timeline/demo" />

```ts showLineNumbers file=./project-timeline/demo.ts start=region_A_start end=region_A_end
```

## Tooltips

A `CursorModifier` with a custom `tooltipDataTemplate` reads the point metadata to show the task name, start date, end date, and completion percentage on hover:

```ts
// Tooltip: show task name, start date, end date on hover
const tooltipDataTemplate: TCursorTooltipDataTemplate = (seriesInfos) => {
    return seriesInfos
        .filter(si => si.isHit)
        .map(si => {
            const m = si.pointMetadata as { name: string; start: Date; end: Date; percentComplete: number };
            if (!m) return "";
            return [
                m.name,
                `Start: ${m.start.toLocaleDateString()}`,
                `End:   ${m.end.toLocaleDateString()}`,
                `Complete: ${m.percentComplete}%`
            ].join("\n");
        });
};
```

## Chart Modifiers

The project timeline uses pan and zoom restricted to the X direction so the task list on the Y axis stays fixed, plus a `CursorModifier` for tooltips:

```ts
sciChartSurface.chartModifiers.add(
    new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
    new ZoomExtentsModifier(),
    new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
    new CursorModifier({ showTooltip: true, tooltipDataTemplate })
);
```

#### See Also

- [The Rectangle Series Type](/2d-charts/chart-types/fast-rectangle-renderable-series/)
- [The CategoryAxis](/2d-charts/axis-apis/category-axis/)
- [The DateTimeNumericAxis](/2d-charts/axis-apis/datetime-numeric-axis/)
- [Data Labels API](/2d-charts/chart-types/data-point-labels/data-labels-api-overview/)
- [The Linear Gauge Chart Type](/2d-charts/chart-types/linear-gauge-chart/)
