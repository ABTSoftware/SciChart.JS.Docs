import {
    EColumnMode,
    EColumnYMode,
    SciChartSurface,
    SciChartJsNavyTheme,
    FastRectangleRenderableSeries,
    XyxyDataSeries,
    NumberRange,
    DateTimeNumericAxis,
    CategoryAxis,
    EXyDirection,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    CursorModifier,
    EAxisAlignment,
    EAutoRange,
    TCursorTooltipDataTemplate
} from "scichart";

interface GanttTask {
    name: string;
    startDate: Date;
    endDate: Date;
    percentComplete: number;
}

const TASKS: GanttTask[] = [
    { name: "Project Planning", startDate: new Date("2025-01-06"), endDate: new Date("2025-01-17"), percentComplete: 100 },
    { name: "Requirements",     startDate: new Date("2025-01-13"), endDate: new Date("2025-01-31"), percentComplete: 100 },
    { name: "System Design",    startDate: new Date("2025-01-27"), endDate: new Date("2025-02-14"), percentComplete: 90  },
    { name: "Database Design",  startDate: new Date("2025-02-03"), endDate: new Date("2025-02-21"), percentComplete: 75  },
    { name: "Front-end Dev",    startDate: new Date("2025-02-10"), endDate: new Date("2025-03-21"), percentComplete: 60  },
    { name: "Back-end Dev",     startDate: new Date("2025-02-17"), endDate: new Date("2025-03-28"), percentComplete: 50  },
    { name: "Integration",      startDate: new Date("2025-03-17"), endDate: new Date("2025-04-04"), percentComplete: 20  },
    { name: "Unit Testing",     startDate: new Date("2025-03-24"), endDate: new Date("2025-04-11"), percentComplete: 10  },
    { name: "System Testing",   startDate: new Date("2025-04-07"), endDate: new Date("2025-04-25"), percentComplete: 0   },
    { name: "Deployment",       startDate: new Date("2025-04-22"), endDate: new Date("2025-05-02"), percentComplete: 0   },
];

const BAR_HEIGHT = 0.6;

function prepareGanttData(tasks: GanttTask[]) {
    const xValues: number[]  = [];
    const yValues: number[]  = [];
    const x1Values: number[] = [];
    const y1Values: number[] = [];
    const metadata: { isSelected: boolean; name: string; start: Date; end: Date; percentComplete: number }[] = [];

    tasks.forEach((task, i) => {
        xValues.push(task.startDate.getTime() / 1000);
        x1Values.push(task.endDate.getTime() / 1000);
        // Center each bar on its integer index so axis labels land in the middle
        yValues.push(i - BAR_HEIGHT / 2);
        y1Values.push(i + BAR_HEIGHT / 2);
        metadata.push({ isSelected: false, name: task.name, start: task.startDate, end: task.endDate, percentComplete: task.percentComplete });
    });

    return { xValues, yValues, x1Values, y1Values, metadata };
}

async function projectTimelineGanttChart(divElementId: string) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // region_A_start
    // X axis: date/time timeline
    sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext, {
        growBy: new NumberRange(0.02, 0.05)
    }));

    // Y axis: category labels for each project stage, reversed so row 0 is at the top
    const yAxis = new CategoryAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        flippedCoordinates: true,
        visibleRange: new NumberRange(-0.5, TASKS.length - 0.5),
        autoRange: EAutoRange.Never,
        drawMajorBands: false,
        drawMinorGridLines: false,
    });
    // Map integer row indices to task name strings
    yAxis.labelProvider.formatLabel = (dataValue: number) =>
        TASKS[Math.round(dataValue)]?.name ?? "";
    sciChartSurface.yAxes.add(yAxis);

    const { xValues, yValues, x1Values, y1Values, metadata } = prepareGanttData(TASKS);

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
            // display completion percentage from metadata
            metaDataSelector: (m) => {
                const meta = m as { isSelected: boolean; name: string; start: Date; end: Date; percentComplete: number };
                return meta ? `${meta.percentComplete}%` : "";
            }
        }
    });

    sciChartSurface.renderableSeries.add(ganttSeries);

    // Tooltip: show task name, start date, end date on hover
    const tooltipDataTemplate: TCursorTooltipDataTemplate = (seriesInfos) => {
        return seriesInfos
            .filter(si => si.isHit)
            .map(si => {
                const m = si.pointMetadata as { isSelected: boolean; name: string; start: Date; end: Date; percentComplete: number };
                if (!m) return "";
                return [
                    m.name,
                    `Start: ${m.start.toLocaleDateString()}`,
                    `End:   ${m.end.toLocaleDateString()}`,
                    `Complete: ${m.percentComplete}%`
                ].join("\n");
            });
    };

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new CursorModifier({ showTooltip: true, tooltipDataTemplate })
    );
    // region_A_end
}

projectTimelineGanttChart("scichart-root");
