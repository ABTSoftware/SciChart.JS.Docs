---
sidebar_position: 270
sidebar_label: Timeline Chart
title: "Timeline Chart: What It Is & How to Read It (Interactive Example)"
description: "What a timeline chart is, the main types (event, state and swimlane, Gantt, editor tracks), how to read one and when to use it, with a live, zoomable event timeline."
keywords:
    [
        "timeline chart",
        "timeline graph",
        "what is a timeline chart",
        "event timeline",
        "state timeline",
        "swimlane timeline",
        "how to read a timeline chart",
        "timeline vs gantt chart"
    ]
image: /img/learn/timeline-chart-og.png
related: [bar-chart, dumbbell-chart, line-chart]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a timeline chart used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A timeline chart is used to show when things happened, how long they lasted and what happened at the same time. Typical uses are company or project histories, the running, idle and fault states of machines on a production line, alarms and operator actions in a control room, clips on the tracks of a video editor, and requests or jobs in software logs." }
                },
                {
                    "@type": "Question",
                    "name": "What is the best chart for a timeline?",
                    "acceptedAnswer": { "@type": "Answer", "text": "It depends on what you are showing. For a handful of dated milestones, use an event timeline: one line with labelled points. For the states of several machines or processes over time, use a state (swimlane) timeline with one lane of coloured bands each. For planned tasks with dependencies, use a Gantt chart. For a value that changes continuously, such as a temperature, use a line chart instead." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a Gantt chart and a timeline chart?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A Gantt chart is one kind of timeline chart, made for planning. It shows tasks as bars with planned start and end dates, often with dependencies between tasks, progress and a today line. Other timeline charts record what actually happened: dated events on a line, or the states of machines and processes in lanes, often measured down to the second." }
                },
                {
                    "@type": "Question",
                    "name": "What is a timeline chart called?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A timeline chart is also called a timeline graph, a chronology or a time line. Variants have their own names: an event timeline or milestone chart for dated points, a state timeline, swimlane timeline or status history for lanes of state bands, a Gantt chart for project schedules, and a sequence of events chart in power and process plants." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a timeline chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "With SciChart.js, turn each lane's state changes into bands with a start time and an end time. Draw them with a FastRectangleRenderableSeries and an XyxyDataSeries, using EColumnMode.StartEnd and EColumnYMode.TopBottom, on a DateTimeNumericAxis. Give each lane its own row on a numeric y-axis with a TextLabelProvider, and draw point events such as alarms with an XyScatterRenderableSeries. React (scichart-react) and Angular (scichart-angular) components wrap the same code." }
                }
            ]
        })}
    </script>
</head>

# Timeline Chart

## What is a timeline chart?

A **timeline chart** (also called a timeline graph) shows events and periods in the order they happened, along a time axis. Points mark moments, such as an alarm or a product launch. Bars or bands mark spans of time, such as a machine running or a task in progress. Rows (lanes) compare several things over the same period.

![A timeline chart of one eight-hour shift on a batch reactor line: lanes for batch phase, reactor state and feed pump state drawn as green running, amber idle, blue cleaning and red fault bands, and a bottom lane of red alarm triangles and white event dots, on a time axis from 06:00 to 14:00](/img/learn/timeline-chart-og.png)

*An event timeline of one shift on a batch reactor line (sample data). [Try the interactive version](#how-to-create-a-timeline-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- A timeline chart puts when on the horizontal axis. Points are instants; bands are periods, and a band's width is its duration.
- Lanes (rows) let you line up machines, people or processes, so you can see what was happening everywhere at one moment.
- There are five main kinds: event timelines, state (swimlane) timelines, Gantt charts for project plans, editor tracks in video and audio software, and trace or log timelines in software.
- In industry, colour carries meaning: green running, amber idle or waiting, red fault. Keep it consistent and give a key.
- Short events vanish when you look at a whole day. A useful timeline lets you zoom from hours down to seconds.
:::

## Types of timeline chart

"Timeline" covers five main kinds of chart, which share a time axis but answer different questions.

![Four sketches of timeline charts: an event timeline with dated milestones on one line; a state timeline with three lanes of green, amber, red and blue bands; a Gantt chart with staggered task bars, a dependency arrow and a dashed today line; and video editor tracks with clips on V1, V2, A1 and A2 under a red playhead](./timeline-chart-types.svg)

| Type | What it shows | Where you see it |
| --- | --- | --- |
| Event timeline | Dated points on one line, each with a short label | Histories, incident reports, release notes, biographies |
| State timeline (swimlane, status history) | One lane per machine or process, filled with bands for each state it was in | Industrial process control, equipment monitoring, network and server uptime |
| Gantt chart | Planned tasks as bars, with start and end dates, dependencies and progress | Project management and scheduling |
| Editor tracks | Clips laid end to end on stacked tracks, read against a moving playhead | Video and audio editing software |
| Trace or log timeline | Nested spans showing how long each step of a request or job took | Software logging, monitoring and performance tracing |

The first two record what happened. A Gantt chart plans what should happen. Editor tracks and trace timelines are the same picture used as a working tool: you read them, and in an editor you also drag clips around on them.

Joseph Priestley's *Chart of Biography* (1765) already laid out about two thousand lives across three thousand years on one time scale. A plant or a server farm today logs thousands of state changes a day, time-stamped to the second or better, so a timeline has to zoom.

## How to read a timeline chart

Read a timeline chart across for when and how long, and down for what was happening in every lane at the same moment.

![The parts of a timeline chart: lanes for Mixer M-1, Conveyor C-2 and Alarms; a time axis from 08:00 to 12:00; a green state band whose width is how long the state lasted; a short red fault that shows as a hairline; triangle markers for point events; and a colour key](./timeline-chart-anatomy.svg)

1. Check the time axis first. Note the start, the end and the unit: years, days, hours or seconds. Every lane shares this one scale.
2. Read the lane labels. Each row is one thing: a machine, a process step, a person or a source of events.
3. Read across one lane to follow its history. A band starts when the state changed and ends at the next change, so its width is its duration. Long, unbroken bands mean stable running; lots of thin bands mean frequent stops and starts.
4. Read down the chart at one moment to see what everything was doing then. Lining up a fault in one lane with a change in another is often how a cause is found.
5. Look for point events. Markers such as triangles or dots have no width: they are instants, such as an alarm, an operator action or a milestone.
6. Use the colour key. Colours should mean the same thing in every lane, for example green for running and red for a fault.

Then zoom in on anything that looks crowded. At a whole-shift view, a fault lasting a few seconds is thinner than one pixel, and several alarms a few seconds apart draw as one marker.

## Worked example: one shift on a batch reactor line

Industrial plants record every state change and alarm with a time stamp in a database called a **historian**. A timeline chart turns those records into a picture that operators, process engineers and maintenance teams can read at a glance. The chart at the top of this page shows one eight-hour shift (06:00 to 14:00) on a batch reactor line, in four lanes:

- Batch phase: the recipe step each batch is in (charge, heat, react, cool, discharge, clean). These are names, not good or bad states, so they share one colour and carry text labels.
- Reactor R-101 and Feed pump P-201: what each piece of equipment was doing (running, idle, cleaning or fault).
- Alarms and events: alarms as red triangles, and batch starts and operator actions as white dots.

At the full-shift view, something went wrong just before 12:00. The pump turns red, the reactor drops to idle and the batch shows a Hold. Zoomed in, the sequence is clear:

| Time | Lane | What happened |
| --- | --- | --- |
| 11:47:30 | Feed pump P-201 | Starts a dosing run |
| 11:52:00 | Feed pump P-201 | First alarm: motor overload; the pump trips to Fault |
| 11:52:04 | Alarms | Low feed flow (a consequence of the trip) |
| 11:52:11 | Alarms | Reactor level low (also a consequence) |
| 11:52:14 | Reactor R-101 and batch phase | An interlock holds the batch; the reactor goes idle |
| 11:53:30 | Alarms | Reactor temperature deviation |
| 11:54:40 | Feed pump P-201 | Fault clears; the pump is idle, waiting for a reset |
| 11:58:40 | Reactor R-101 and batch phase | Operator resets the pump and the batch resumes after a 6 min 26 s hold |

The timeline shows three things a list of alarms alone would hide:

- The first alarm points to the cause. Four alarms arrived within 90 seconds, but only the first, the pump overload, is the cause; the others followed from it. Recording the exact order of events like this is the job of a **sequence of events recorder** in power and process plants.
- There was an earlier warning. The same pump tripped for 18 seconds at 07:31:12 and reset itself. At the full-shift view it is a hairline; zoom in on 07:31 in the live chart to find it.
- The totals tell a different story from the picture. Over the shift the reactor ran for 7 h 9 min (89% of the time), was cleaned for 30 min and idle for 21 min. The pump was in fault for under 3 minutes in total (0.6%), yet that was enough to hold a batch.

### How to describe a timeline chart

Use this template when you report what a timeline shows:

> [Lane] was [state] for [duration], from [start] to [end]. It began with [first event] at [time], and [what else changed at the same time].

For example: "Batch B-1043 was held for 6 min 26 s, from 11:52:14 to 11:58:40. It began with a motor overload trip on feed pump P-201 at 11:52:00, and the reactor went idle while three further alarms followed within 90 seconds."

## Timeline chart vs Gantt chart

A **Gantt chart** is a timeline chart made for planning projects. Its bars are tasks with planned dates, and it usually adds dependencies (this task can't start until that one ends), percent complete and a "today" line. It is named after Henry Gantt, who designed it in the 1910s.

Most other timelines show what actually happened: when each event occurred and how long each state lasted, often measured to the second and recorded automatically. If your bars are a plan, use a Gantt chart. If they are a record of states or events, use an event or state timeline.

## When to use a timeline chart

Use a timeline chart when the question is when and for how long, and when things happening at the same time matter. Typical uses:

- industrial process control: equipment states, batch phases, alarms and operator actions over a shift;
- monitoring and logging: service uptime, job runs and errors, or each step of a slow request;
- media editing: clips, effects and audio laid out against a playhead;
- histories and reports: the key dates in a project, an incident or a company's past.

| Chart | Best for |
| --- | --- |
| Timeline chart | When events happened, how long states lasted, and what overlapped |
| [Line chart](/learn/chart-types/cartesian/line-chart/) | A measured value that changes continuously over time, such as a temperature or a price |
| [Gantt chart](/2d-charts/chart-types/fast-rectangle-renderable-series/) | A project plan: tasks, planned dates and dependencies |
| [Heatmap](/learn/chart-types/cartesian/heatmap/) | A value for every time slot across many rows, such as load per hour per machine |

In process monitoring the two are often stacked: line charts for the measured values (temperature, flow, pressure) above a state timeline for the equipment states and alarms, sharing one time axis so they zoom together.

## Common timeline chart mistakes

Most timeline mistakes hide short events or give colours a meaning that changes from lane to lane.

- **Short events disappear at the full view.** A 20-second fault is thinner than a pixel on an eight-hour chart. Let readers zoom, give every band a minimum visible width, or add a point marker for each fault or alarm.
- **Colours that mean different things in different lanes.** If red is a fault in one lane, don't use it for a normal state in another. Save the strongest colours for abnormal states, and give a key.
- **Relying on colour alone.** Red and green are hard to tell apart for many people with colour vision deficiency. Add labels, tooltips, or a different marker shape for alarms.
- **Colour-coding labels that aren't states.** Batch phases or task names aren't good or bad, so giving each its own bright colour suggests a meaning that isn't there. Use one neutral colour and write the names on the bands.
- **Mixed or missing time zones.** Plant historians, servers and people often log in different time zones. Store times in UTC and say which zone the axis shows.
- **Overlapping events in one lane.** If two states can be true at once, they belong in separate lanes; otherwise one band hides the other.
- **Using a timeline for a measured value.** A temperature or a price is a line chart. Turn it into bands only for thresholds, such as "above limit".

## How to create a timeline chart in JavaScript, React or Angular

SciChart.js draws timelines with rectangle series for the bands and scatter series for the point events. The chart below shows the eight-hour reactor shift from the worked example: three lanes of state bands and a lane of alarm and event markers, with zooming and panning set to work on the time axis only, so the lanes stay in place. Scroll to zoom in time, drag to pan, double-click to see the whole shift again, and hover over a band or a marker to see its times. Zoom in around 11:52 to see the alarms separate, and around 07:31 to find the short fault.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="timeline chart" demo="gantt-chart" demoLabel="Gantt chart" docs="/2d-charts/chart-types/fast-rectangle-renderable-series/" docsLabel="SciChart.js rectangle series documentation" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        DateTimeNumericAxis,
        FastRectangleRenderableSeries,
        XyxyDataSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        TrianglePointMarker,
        TextLabelProvider,
        EAxisAlignment,
        EColumnMode,
        EColumnYMode,
        EAutoRange,
        EXyDirection,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        // laneNames: one per row, bottom row first. bands: { start, end, lane, state } with times in seconds (UTC)
        const { laneNames, bandsByState, alarms } = getYourTimelineData();
        const stateColours: Record<string, string> = { Running: "#3FB47F", Idle: "#F4B740", Fault: "#E5484D" };

        sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Left,
                labelProvider: new TextLabelProvider({ labels: laneNames, useNativeText: false }),
                autoRange: EAutoRange.Never,
                visibleRange: new NumberRange(-0.6, laneNames.length - 0.4),
                autoTicks: false,
                majorDelta: 1
            })
        );

        // One rectangle series per state: x to x1 is the band's start and end time, y to y1 its top and bottom
        Object.keys(bandsByState).forEach((state) => {
            const bands = bandsByState[state];
            sciChartSurface.renderableSeries.add(
                new FastRectangleRenderableSeries(wasmContext, {
                    dataSeries: new XyxyDataSeries(wasmContext, {
                        xValues: bands.map((b) => b.start),
                        x1Values: bands.map((b) => b.end),
                        yValues: bands.map((b) => b.lane + 0.32),
                        y1Values: bands.map((b) => b.lane - 0.32),
                        dataSeriesName: state
                    }),
                    columnXMode: EColumnMode.StartEnd,
                    columnYMode: EColumnYMode.TopBottom,
                    fill: stateColours[state],
                    stroke: stateColours[state]
                })
            );
        });

        // Alarms as red triangles in the bottom lane
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: alarms.map((a) => a.time),
                    yValues: alarms.map(() => 0),
                    dataSeriesName: "Alarm"
                }),
                pointMarker: new TrianglePointMarker(wasmContext, { width: 14, height: 14, fill: "#E5484D" })
            })
        );

        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true, showYLine: false }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        return { sciChartSurface };
    };

    export const TimelineChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 450 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        DateTimeNumericAxis,
        FastRectangleRenderableSeries,
        XyxyDataSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        TrianglePointMarker,
        TextLabelProvider,
        EAxisAlignment,
        EColumnMode,
        EColumnYMode,
        EAutoRange,
        EXyDirection,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    @Component({
        selector: "app-timeline-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class TimelineChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            // laneNames: one per row, bottom row first. bands: { start, end, lane, state } with times in seconds (UTC)
            const { laneNames, bandsByState, alarms } = getYourTimelineData();
            const stateColours: Record<string, string> = { Running: "#3FB47F", Idle: "#F4B740", Fault: "#E5484D" };

            sciChartSurface.xAxes.add(new DateTimeNumericAxis(wasmContext));
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    axisAlignment: EAxisAlignment.Left,
                    labelProvider: new TextLabelProvider({ labels: laneNames, useNativeText: false }),
                    autoRange: EAutoRange.Never,
                    visibleRange: new NumberRange(-0.6, laneNames.length - 0.4),
                    autoTicks: false,
                    majorDelta: 1
                })
            );

            // One rectangle series per state: x to x1 is the band's start and end time, y to y1 its top and bottom
            Object.keys(bandsByState).forEach((state) => {
                const bands = bandsByState[state];
                sciChartSurface.renderableSeries.add(
                    new FastRectangleRenderableSeries(wasmContext, {
                        dataSeries: new XyxyDataSeries(wasmContext, {
                            xValues: bands.map((b) => b.start),
                            x1Values: bands.map((b) => b.end),
                            yValues: bands.map((b) => b.lane + 0.32),
                            y1Values: bands.map((b) => b.lane - 0.32),
                            dataSeriesName: state
                        }),
                        columnXMode: EColumnMode.StartEnd,
                        columnYMode: EColumnYMode.TopBottom,
                        fill: stateColours[state],
                        stroke: stateColours[state]
                    })
                );
            });

            // Alarms as red triangles in the bottom lane
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        xValues: alarms.map((a) => a.time),
                        yValues: alarms.map(() => 0),
                        dataSeriesName: "Alarm"
                    }),
                    pointMarker: new TrianglePointMarker(wasmContext, { width: 14, height: 14, fill: "#E5484D" })
                })
            );

            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true, showYLine: false }),
                new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Historians and logs usually store state changes, not bands. Turn each change into a band that runs until the next change (step 1 in the code), with times in seconds since 1970 (UTC), which is what the [DateTimeNumericAxis](/2d-charts/axis-api/axis-types/date-time-numeric-axis/) expects. Its labels switch from hours to minutes to seconds as you zoom.
- A [FastRectangleRenderableSeries](/2d-charts/chart-types/fast-rectangle-renderable-series/) with an `XyxyDataSeries` draws each band from `x` to `x1` (start and end time) and from `y` to `y1` (top and bottom of its lane), set by `columnXMode: EColumnMode.StartEnd` and `columnYMode: EColumnYMode.TopBottom`. One series per state gives each state one colour and one legend entry.
- The lanes are rows on a `NumericAxis` with a [TextLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) for the lane names, fixed with `autoRange: EAutoRange.Never`. Setting `xyDirection: EXyDirection.XDirection` on the zoom modifiers makes zooming stretch time only.
- Point events are an [XyScatterRenderableSeries](/2d-charts/chart-types/xy-scatter-renderable-series/) with a triangle or dot marker. For a handful of events, or ones users should drag, [annotations](/2d-charts/annotations-api/annotations-api-overview/) such as vertical lines also work. Put the text for each tooltip in the data series' `metadata`.

**See it in the demo app:** [JavaScript Gantt chart](https://www.scichart.com/demo/javascript/gantt-chart) · [React Gantt chart](https://www.scichart.com/demo/react/gantt-chart) · [Angular Gantt chart](https://www.scichart.com/demo/angular/gantt-chart)

**Go deeper:** [SciChart.js rectangle series documentation](/2d-charts/chart-types/fast-rectangle-renderable-series/), which draws the bands, the [SciChart.js date-time axis documentation](/2d-charts/axis-api/axis-types/date-time-numeric-axis/), and the [SciChart.js annotations documentation](/2d-charts/annotations-api/annotations-api-overview/) for markers and labels on a timeline.

## Frequently asked questions

### What is a timeline chart used for?

A timeline chart is used to show when things happened, how long they lasted and what happened at the same time. Typical uses are company or project histories, the running, idle and fault states of machines on a production line, alarms and operator actions in a control room, clips on the tracks of a video editor, and requests or jobs in software logs.

### What is the best chart for a timeline?

It depends on what you are showing. For a handful of dated milestones, use an event timeline: one line with labelled points. For the states of several machines or processes over time, use a state (swimlane) timeline with one lane of coloured bands each. For planned tasks with dependencies, use a Gantt chart. For a value that changes continuously, such as a temperature, use a line chart instead.

### What is the difference between a Gantt chart and a timeline chart?

A Gantt chart is one kind of timeline chart, made for planning. It shows tasks as bars with planned start and end dates, often with dependencies between tasks, progress and a today line. Other timeline charts record what actually happened: dated events on a line, or the states of machines and processes in lanes, often measured down to the second.

### What is a timeline chart called?

A timeline chart is also called a timeline graph, a chronology or a time line. Variants have their own names: an event timeline or milestone chart for dated points, a state timeline, swimlane timeline or status history for lanes of state bands, a Gantt chart for project schedules, and a sequence of events chart in power and process plants.

### How do I make a timeline chart in JavaScript?

With SciChart.js, turn each lane's state changes into bands with a start time and an end time. Draw them with a `FastRectangleRenderableSeries` and an `XyxyDataSeries`, using `EColumnMode.StartEnd` and `EColumnYMode.TopBottom`, on a `DateTimeNumericAxis`. Give each lane its own row on a numeric y-axis with a `TextLabelProvider`, and draw point events such as alarms with an `XyScatterRenderableSeries`. React (`scichart-react`) and Angular (`scichart-angular`) components wrap the same code.

## Sources

- Wikipedia, [A Chart of Biography](https://en.wikipedia.org/wiki/A_Chart_of_Biography). Joseph Priestley's 1765 chart of about two thousand lives from 1200 BC to 1800 AD, an early timeline chart.
- Wikipedia, [Gantt chart](https://en.wikipedia.org/wiki/Gantt_chart). Henry Gantt's design of around 1910 to 1915, and Karol Adamiecki's earlier harmonogram.
- Wikipedia, [Sequence of events recorder](https://en.wikipedia.org/wiki/Sequence_of_events_recorder). Devices that time-stamp each change of state so the order of events can be rebuilt for root-cause analysis.
- ISA, [ISA-101 series of standards](https://www.isa.org/standards-and-publications/isa-standards/isa-101-standards). The standard for designing human-machine interfaces (HMIs) in process automation.

<LearnCta position="bottom" chart="timeline chart" demo="gantt-chart" demoLabel="Gantt chart" docs="/2d-charts/chart-types/fast-rectangle-renderable-series/" docsLabel="SciChart.js rectangle series documentation" />
