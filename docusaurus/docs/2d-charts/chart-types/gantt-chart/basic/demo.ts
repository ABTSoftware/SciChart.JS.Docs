import {
    EColumnMode,
    EColumnYMode,
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    FastRectangleRenderableSeries,
    XyxyDataSeries,
    NumberRange
} from "scichart";

async function basicGanttChart(divElementId: string) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        axisTitle: "Day"
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        axisTitle: "Task"
    }));

    // region_A_start
    // Each task is a horizontal bar defined by [xStart, yBottom, xEnd, yTop]
    // Y rows are integer indices; bar height is 0.6 to leave gaps between rows
    const BAR_HEIGHT = 0.6;

    const tasks = [
        { start: 0,  end: 3  },
        { start: 2,  end: 6  },
        { start: 5,  end: 12 },
        { start: 10, end: 14 },
        { start: 13, end: 15 },
    ];

    const xValues  = tasks.map(t => t.start);
    const x1Values = tasks.map(t => t.end);
    const yValues  = tasks.map((_, i) => i);
    const y1Values = tasks.map((_, i) => i + BAR_HEIGHT);

    const ganttSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, { xValues, yValues, x1Values, y1Values }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        fill: "steelblue",
        stroke: "white",
        strokeThickness: 1,
        opacity: 0.85,
        topCornerRadius: 4,
        bottomCornerRadius: 4,
        dataLabels: {
            style: { fontSize: 13, fontFamily: "Arial" },
            color: "white"
        }
    });
    // region_A_end

    sciChartSurface.renderableSeries.add(ganttSeries);
}

basicGanttChart("scichart-root");
