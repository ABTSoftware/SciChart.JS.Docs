import * as SciChart from "scichart";

// Example data: one eight-hour shift on a batch reactor line, as a plant historian would log it.
// Each lane is a list of state changes: [time the state started, state]. The last state lasts until the end of the shift.
// These are illustrative values, not real plant data.
function getShiftData() {
    const shiftStart = "06:00:00";
    const shiftEnd = "14:00:00";
    const lanes = [
        {
            name: "Batch phase",
            changes: [
                ["06:00:00", null], // no batch running
                ["06:10:00", "Charge"],
                ["06:35:00", "Heat"],
                ["07:10:00", "React"],
                ["08:45:00", "Cool"],
                ["09:25:00", "Discharge"],
                ["09:45:00", "Clean"],
                ["10:15:00", null],
                ["10:20:00", "Charge"],
                ["10:45:00", "Heat"],
                ["11:20:00", "React"],
                ["11:52:14", "Hold"],
                ["11:58:40", "React"],
                ["13:08:00", "Cool"],
                ["13:45:00", "Discharge"]
            ]
        },
        {
            name: "Reactor R-101",
            changes: [
                ["06:00:00", "Idle"],
                ["06:10:00", "Running"],
                ["09:45:00", "Cleaning"],
                ["10:15:00", "Idle"],
                ["10:20:00", "Running"],
                ["11:52:14", "Idle"],
                ["11:58:40", "Running"]
            ]
        },
        {
            name: "Feed pump P-201",
            changes: [
                ["06:00:00", "Idle"],
                ["06:10:00", "Running"],
                ["06:35:00", "Idle"],
                ["07:10:00", "Running"],
                ["07:16:30", "Idle"],
                ["07:24:00", "Running"],
                ["07:31:12", "Fault"], // an 18-second trip: too short to see until you zoom in
                ["07:31:30", "Running"],
                ["07:35:00", "Idle"],
                ["07:44:00", "Running"],
                ["07:50:20", "Idle"],
                ["08:01:00", "Running"],
                ["08:07:45", "Idle"],
                ["08:18:00", "Running"],
                ["08:23:10", "Idle"],
                ["08:31:00", "Running"],
                ["08:36:30", "Idle"],
                ["09:45:00", "Cleaning"],
                ["10:15:00", "Idle"],
                ["10:20:00", "Running"],
                ["10:45:00", "Idle"],
                ["11:20:00", "Running"],
                ["11:26:40", "Idle"],
                ["11:35:00", "Running"],
                ["11:41:15", "Idle"],
                ["11:47:30", "Running"],
                ["11:52:00", "Fault"],
                ["11:54:40", "Idle"],
                ["11:58:40", "Running"],
                ["12:04:30", "Idle"],
                ["12:14:00", "Running"],
                ["12:20:10", "Idle"],
                ["12:29:00", "Running"],
                ["12:35:40", "Idle"],
                ["12:46:00", "Running"],
                ["12:51:30", "Idle"]
            ]
        }
    ];
    // Point events: alarms (something went wrong) and operator or system events (something was done)
    const alarms = [
        ["07:31:12", "P-201 motor overload (cleared at 07:31:30)"],
        ["11:52:00", "P-201 motor overload"],
        ["11:52:04", "FT-201 low feed flow"],
        ["11:52:11", "LT-101 reactor level low"],
        ["11:53:30", "TT-101 temperature deviation"]
    ];
    const events = [
        ["06:10:00", "Batch B-1042 started"],
        ["08:05:00", "Operator raised TIC-101 setpoint to 82 °C"],
        ["10:20:00", "Batch B-1043 started"],
        ["11:52:14", "Batch held by interlock"],
        ["11:58:40", "Operator reset P-201; batch resumed"]
    ];
    return { date: "2026-03-10", shiftStart, shiftEnd, lanes, alarms, events };
}

async function timelineChart(divElementId) {
    // #region_A_start
    // Create a JavaScript timeline chart with SciChart.js: state bands in lanes, plus point events, on a time axis
    const {
        SciChartSurface,
        NumericAxis,
        DateTimeNumericAxis,
        FastRectangleRenderableSeries,
        XyxyDataSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        TrianglePointMarker,
        EllipsePointMarker,
        TextLabelProvider,
        EAxisAlignment,
        EColumnMode,
        EColumnYMode,
        EAutoRange,
        EXyDirection,
        ENumericFormat,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        LegendModifier,
        ELegendOrientation,
        ELegendPlacement
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const { date, shiftStart, shiftEnd, lanes, alarms, events } = getShiftData();

    // Times become seconds since 1970 (UTC), the unit DateTimeNumericAxis expects
    const toSeconds = (time) => Date.parse(`${date}T${time}Z`) / 1000;
    const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11, 19);
    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.round(seconds % 60);
        return [h ? `${h} h` : "", m ? `${m} min` : "", s ? `${s} s` : ""].filter(Boolean).join(" ");
    };

    // Lanes run top to bottom: the first lane gets the highest y value. Point events go in the bottom lane (y = 0).
    const laneNames = ["Alarms and events", ...lanes.map((lane) => lane.name).reverse()];
    const laneY = (laneIndex) => lanes.length - laneIndex;
    const halfLaneHeight = 0.32;

    // State colours carry meaning: green is normal, amber is waiting, red is a fault, blue is cleaning.
    // Batch phases are names, not good or bad, so they share one neutral colour and are labelled instead.
    const stateColours = {
        Running: "#3FB47F",
        Idle: "#F4B740",
        Fault: "#E5484D",
        Cleaning: "#4C8DF6",
        Phase: "#7E72C9"
    };

    // 1. Turn each lane's list of state changes into bands: each band runs from one change to the next
    const bandsByState = {};
    lanes.forEach((lane, laneIndex) => {
        lane.changes.forEach(([time, state], i) => {
            if (!state) return;
            const start = toSeconds(time);
            const end = toSeconds(i + 1 < lane.changes.length ? lane.changes[i + 1][0] : shiftEnd);
            const colourKey = laneIndex === 0 ? "Phase" : state;
            (bandsByState[colourKey] = bandsByState[colourKey] || []).push({
                lane: lane.name,
                state,
                start,
                end,
                y: laneY(laneIndex)
            });
        });
    });

    // X axis: date and time. Labels switch from hours to minutes to seconds as you zoom in
    const xAxis = new DateTimeNumericAxis(wasmContext, {
        visibleRange: new NumberRange(toSeconds(shiftStart), toSeconds(shiftEnd)),
        drawMinorGridLines: false
    });
    xAxis.labelProvider.cursorNumericFormat = ENumericFormat.Date_HHMMSS; // the cursor's time label, to the second
    sciChartSurface.xAxes.add(xAxis);

    // Y axis: one lane per row, labelled with the lane name. Fixed, so zooming only stretches time
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            labelProvider: new TextLabelProvider({ labels: laneNames, useNativeText: false }),
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(-0.6, lanes.length + 0.75),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            labelStyle: { fontSize: 14 }
        })
    );

    // 2. One rectangle series per state, so each state has one colour and one legend entry
    Object.keys(bandsByState).forEach((colourKey) => {
        const bands = bandsByState[colourKey];
        sciChartSurface.renderableSeries.add(
            new FastRectangleRenderableSeries(wasmContext, {
                dataSeries: new XyxyDataSeries(wasmContext, {
                    xValues: bands.map((b) => b.start),
                    x1Values: bands.map((b) => b.end),
                    yValues: bands.map((b) => b.y + halfLaneHeight),
                    y1Values: bands.map((b) => b.y - halfLaneHeight),
                    metadata: bands.map((b) => ({
                        isSelected: false,
                        label: b.state,
                        tooltip: [
                            `${b.lane}: ${b.state}`,
                            `${formatTime(b.start)} to ${formatTime(b.end)} (${formatDuration(b.end - b.start)})`
                        ]
                    })),
                    dataSeriesName: colourKey === "Phase" ? "Batch phase" : colourKey
                }),
                columnXMode: EColumnMode.StartEnd, // x = start time, x1 = end time
                columnYMode: EColumnYMode.TopBottom, // y = top of the band, y1 = bottom
                fill: stateColours[colourKey],
                // The outline also colours the legend entry. Phase bands sit side by side, so theirs is lighter to keep them apart
                stroke: colourKey === "Phase" ? "#C9C2F2" : stateColours[colourKey],
                strokeThickness: 1,
                // Phase names are written inside their bands
                dataLabels:
                    colourKey === "Phase"
                        ? {
                              color: "#FFFFFF",
                              style: { fontSize: 13, fontFamily: "Arial" },
                              metaDataSelector: (metadata) => metadata["label"]
                          }
                        : undefined
            })
        );
    });

    // 3. Point events: alarms as red triangles, other events as white dots, in the bottom lane
    const addPointEvents = (items, name, colour, pointMarker, yOffset) => {
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: items.map(([time]) => toSeconds(time)),
                    yValues: items.map(() => yOffset),
                    metadata: items.map(([time, text]) => ({
                        isSelected: false,
                        tooltip: [`${name}: ${text}`, `at ${time}`]
                    })),
                    dataSeriesName: name
                }),
                stroke: colour, // the legend entry's colour
                pointMarker
            })
        );
    };
    addPointEvents(
        alarms,
        "Alarm",
        "#E5484D",
        new TrianglePointMarker(wasmContext, { width: 14, height: 14, fill: "#E5484D", stroke: "#FFFFFF", strokeThickness: 1 }),
        0.15
    );
    addPointEvents(
        events,
        "Event",
        "#FFFFFF",
        new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "#FFFFFF", stroke: "#1C2A4A", strokeThickness: 1 }),
        -0.15
    );

    // Tooltip: show only what is under the mouse. The list can be empty, so always return an array
    const tooltipDataTemplate = (seriesInfos) => {
        const lines = [];
        (seriesInfos || []).forEach((info) => {
            if (info && info.isHit && info.pointMetadata && info.pointMetadata.tooltip) {
                lines.push(...info.pointMetadata.tooltip);
            }
        });
        return lines;
    };

    // Zoom and pan in time only (lanes stay put); double-click to see the whole shift again
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showYLine: false, tooltipDataTemplate, hitTestRadius: 8 }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new LegendModifier({
            placement: ELegendPlacement.TopRight,
            orientation: ELegendOrientation.Horizontal,
            showCheckboxes: false
        })
    );
    // #region_A_end
}

timelineChart("scichart-root");
