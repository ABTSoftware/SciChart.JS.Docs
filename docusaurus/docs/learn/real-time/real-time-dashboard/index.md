---
sidebar_position: 10
sidebar_label: Real-Time Dashboard
title: "Real-Time Dashboard: How Live Dashboards Work and How to Design One (With an Interactive Example)"
description: "What a real-time dashboard is, how live data reaches the screen, update rate vs frame rate, which charts suit live data, layout and performance tips, with a live example."
keywords:
    [
        "real time dashboard",
        "real-time dashboard",
        "live dashboard",
        "real time analytics dashboard",
        "real time monitoring dashboard",
        "monitoring dashboard",
        "iot dashboard",
        "real time manufacturing dashboard",
        "real-time operations dashboard",
        "real time kpi dashboard",
        "remote patient monitoring dashboard",
        "how to create a real-time dashboard",
        "real-time dashboard design",
        "dashboard update rate"
    ]
image: /img/learn/real-time-dashboard-og.png
related: [strip-chart, time-series-graph, gauge-chart, telemetry]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a real-time dashboard?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A real-time dashboard is a screen of charts, gauges and numbers that updates by itself as new data arrives, usually within a second or a few seconds of each event. It is used to watch something while it is happening, such as a production line, a fleet of sensors, a patient or a website, so people can act before a problem grows." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a real-time dashboard and a BI dashboard?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A BI (business intelligence) dashboard is refreshed on a schedule, often hourly or daily, from a data warehouse, and answers questions about trends and totals. A real-time dashboard is pushed new data continuously from live sources and answers what is happening now. Many operations teams use both: the live view to act, the BI view to review." }
                },
                {
                    "@type": "Question",
                    "name": "How often should a real-time dashboard update?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Match the update rate to the decision and to the chart. Moving traces such as strip charts look smooth when they update with the screen, up to 60 times a second on most displays. Numbers and gauges that people read are easier to follow at one to a few updates a second. Business metrics can update every few seconds or every minute. Updating faster than the screen refreshes does nothing but cost processing time." }
                },
                {
                    "@type": "Question",
                    "name": "How does data get into a real-time dashboard?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Devices and applications publish readings to a broker or server, often over MQTT or a message queue. The server processes and stores them, then pushes new values to each open dashboard over a WebSocket or server-sent events, or the dashboard polls for them. In the browser, the readings are buffered and appended to the charts at the dashboard's update rate." }
                },
                {
                    "@type": "Question",
                    "name": "What is an IoT dashboard?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An IoT dashboard shows live readings from internet-connected devices such as sensors, meters and machines. It typically combines a list or map of devices and their status, sparklines or strip charts of each device's recent readings, gauges for key values and an alarm list. Devices usually send data through an MQTT broker or a cloud IoT service." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a real-time dashboard in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a charting library built for live data. In SciChart.js, create one SciChartSurface per panel, which share a single WebGL context, give each line an XyDataSeries with fifoCapacity, buffer incoming readings and append them with appendRange on a timer at your update rate, then move the time axes together. SciChartVerticalGroup and a CursorModifier modifierGroup keep the charts aligned and their cursors in step." }
                }
            ]
        })}
    </script>
</head>

# Real-Time Dashboard

## What is a real-time dashboard?

A **real-time dashboard** (also called a live dashboard or monitoring dashboard) is a screen of charts, gauges and numbers that updates by itself as new data arrives, usually within a second or a few seconds of each event. People use it to watch a process, machine, system or market while it is happening, and to act before a problem grows.

![A live production-line dashboard on a dark navy background: two strip charts with matching time axes, one of three motor currents and one of pump vibration with two impact spikes; a gauge showing line speed; a bar chart of output by station against a dashed target line; four sparklines for power, reject rate, air pressure and coolant flow; and a heatmap of eight oven zone temperatures over the last 30 seconds](/img/learn/real-time-dashboard-og.png)

*A simulated production-line dashboard with six panels fed from one data stream. [Try the interactive version](#how-to-build-a-real-time-dashboard-in-javascript-react-or-angular), change the update and data rates and watch the frame time.*

:::tip Key takeaways
- A real-time dashboard is pushed new data continuously; a BI dashboard is refreshed on a schedule.
- Data rate, update rate and frame rate are three different numbers, and each adds its own share of latency.
- Strip charts, gauges, sparklines, current-value bars and heatmaps each suit a different kind of live data.
- Lay it out overview first, keep time axes synchronised, and always show when the data was last updated.
- Many live charts on one page stay fast when they share a WebGL context, append to circular buffers and are updated in batches.
:::

## Real-time dashboards vs BI dashboards

The word "dashboard" covers two quite different tools. A business intelligence (BI) dashboard reads a data warehouse that is loaded on a schedule, so its numbers are as fresh as the last load, often an hour or a day old. A real-time dashboard is fed from live sources and changes on screen without anyone pressing refresh.

| | Real-time dashboard | BI dashboard |
| --- | --- | --- |
| Data from | Sensors, devices, application events, market feeds, streamed as they happen | A data warehouse or database, loaded in batches |
| Freshness | Sub-second to a few seconds | Minutes to a day |
| Question it answers | What is happening now, and is anything wrong? | How did we do, and what is the trend? |
| Time window | The last seconds, minutes or hours, scrolling | Days, months, years, fixed |
| Typical charts | Strip charts, gauges, sparklines, alarm lists, live heatmaps | Bar and line charts, tables, filters, drill-downs |
| Used by | Operators, engineers, clinicians, traders, on-call staff | Managers and analysts |

A "real-time analytics dashboard" sits between the two: it computes running totals and rates from live events, such as orders per minute or active users, and shows them within seconds. The design advice on this page applies to all live dashboards, from a factory floor to a web shop.

## How does a real-time dashboard work?

Every live dashboard follows a similar path from the thing being measured to the pixels on the screen. The path also explains where delay comes from.

![The data path of a real-time dashboard in two rows. On the server side: 1, sources such as sensors, PLCs, devices, apps and market feeds; 2, ingest through an MQTT broker, message queue or gateway; 3, process and store, including alarm checks and a time-series database. A dashed arrow, push over the network, leads to the browser row: 4, receive over a WebSocket or server-sent events, or by polling; 5, buffer in typed arrays and circular buffers; 6, draw at the update rate. Underneath, a timeline shows latency adding up: sampling, network and processing, waiting up to one update interval for the next update, and up to about 17 ms for the next frame on a 60 Hz screen](./real-time-dashboard-data-path.svg)

1. Sources produce readings: sensors and PLCs (programmable logic controllers) on a machine, devices in the field, servers and applications writing metrics and logs, or a market data feed.
2. Ingest collects them. Devices often publish to an **MQTT broker**, a lightweight publish-and-subscribe server designed for small devices and unreliable networks. Applications usually write to a message queue or event stream.
3. A server processes the stream: it cleans and converts values, computes rates and averages, checks alarm limits and stores everything in a time-series database or historian for later.
4. The server pushes new values to every open dashboard. A **WebSocket** keeps one two-way connection open between browser and server; **server-sent events** are a simpler one-way stream from server to browser over plain HTTP. Polling, where the page asks for new data every few seconds, is simpler again but adds up to one polling interval of delay.
5. The browser buffers what arrives. Readings are kept in typed arrays (compact blocks of numbers, rather than one object per reading) and in circular buffers that keep the last few minutes and drop the oldest values.
6. The dashboard draws. On a timer, it appends everything buffered since the last update to its charts and scrolls their time axes.

### Latency, data rate, update rate and frame rate

Four numbers describe how "live" a dashboard is, and they are easy to mix up:

| Term | What it measures | Example |
| --- | --- | --- |
| Data rate (sample rate) | How many readings each channel produces per second | A vibration sensor sampled 1,000 times a second |
| Update rate | How often the dashboard adds new data to its charts | 10 times a second (10 Hz) |
| Frame rate | How often the screen can show a new picture | 60 frames a second on most monitors; 120 or more on many phones and gaming screens |
| Latency | The delay from an event to seeing it on screen | 150 ms from a pressure spike to the trace moving |

Take that vibration sensor at 1,000 readings a second and a dashboard updating at 10 Hz. Each update appends about 100 points per channel, and a reading waits up to 100 ms in the buffer before it is drawn. Add the network, any server processing and up to one screen frame (about 17 ms at 60 Hz), and the total latency is a little over a tenth of a second. At a 1 Hz update rate the same reading can wait a full second.

Two limits follow from this. An update rate above the screen's frame rate draws pictures nobody sees, so 60 Hz is a sensible ceiling for a moving trace. And a number on screen that changes many times a second can't be read, so readouts and gauges are often updated more slowly than the traces beside them. Try both in the [live example](#how-to-build-a-real-time-dashboard-in-javascript-react-or-angular): at 1 Hz the traces jump once a second; at 60 Hz they glide.

## Which charts work best for live data?

Not every chart survives being updated many times a second. Charts that work live keep a fixed frame (fixed axes, fixed positions) so only the data moves.

| Chart | Shows | How it behaves live | Use it for |
| --- | --- | --- | --- |
| [Strip chart](/learn/real-time/strip-chart/) | One or more values over a scrolling time window | New data enters at the right, the oldest leaves at the left | Signals where the shape over time matters: current, vibration, ECG, prices |
| [Gauge](/learn/chart-types/radial/gauge-chart/) | One value against its range and limits | The needle or arc moves; the scale stays still | The one or two numbers people check first, with normal and alarm bands |
| Big-number tile | One value as large digits, often with a change arrow | The digits change | Counts and rates such as orders per minute, active alarms |
| [Sparkline](/learn/chart-types/cartesian/sparkline/) | The recent trend of one value, without axes | A small strip chart | Many values side by side: one per device, server or KPI |
| [Bar chart](/learn/chart-types/cartesian/bar-chart/) of current values | The latest value of several items, compared | Bars grow and shrink in place | Output per machine, load per server, queue length per region |
| [Heatmap](/learn/chart-types/cartesian/heatmap/) | Many channels over time as colour | Columns scroll in from the right | Dozens of similar sensors at once, temperature zones, spectrograms |
| Alarm list | Active and recent alarms, newest first | Rows appear and are acknowledged | Anything that needs a response |

Pie charts and charts that re-sort or rescale on every update work badly live: slices and bars that keep swapping places can't be followed.

## How to create a real-time dashboard

These steps work whatever you build it with:

1. Write down the decisions the dashboard supports ("stop the line if vibration exceeds 7 mm/s", "page the on-call engineer if errors pass 1%"). Each panel should help with one of them.
2. List the signals behind those decisions, with each one's data rate, units and normal range.
3. Choose the transport: MQTT or a cloud IoT service for devices, a WebSocket or server-sent events to the browser, polling only for data that changes every few seconds or less.
4. Choose an update rate per panel. Smooth traces can follow the screen; readouts, bars and business numbers can update once a second or slower.
5. Pick a chart per signal from the table above, and fix each axis to the signal's normal range plus its alarm limits.
6. Lay out the screen (below), with alarms and the "last updated" time in fixed places.
7. Test with the full data rate, the largest number of panels and a slow laptop, not just your development machine.

### Layout: overview first, detail on demand

Ben Shneiderman's rule for visual information seeking, "overview first, zoom and filter, then details on demand", fits live dashboards well:

- Overview: put the few numbers that decide action in the top row, as gauges or big numbers with their limits.
- Trends: strip charts and sparklines below them show how each number got there.
- Detail: clicking a panel, pausing, zooming or hovering for a tooltip gives the exact values; it shouldn't need a different screen.
- Alarms: keep the alarm list and any alarm banner in one fixed place, so people know where to look. Keep normal values in calm colours and save red and amber for abnormal states, as the ISA-101 standard for operator screens recommends (see our [HMI and SCADA guide](/learn/applications/hmi-scada/)).

### Synchronised time axes

When a dashboard has several strip charts, they should share one time window and one "now", so a spike at 14:03:07 in one chart sits directly above the change it caused in another. That needs three things: the same visible time range on every chart, the same width for every chart's value axis (so the plot areas line up), and a cursor that shows every chart's value at the hovered time. Zooming or panning one chart should move the others.

## Many charts on one page: performance

A busy dashboard can have dozens of charts redrawing many times a second. The techniques that keep it smooth are the same whatever the domain:

- Share one drawing context. Browsers allow only a few WebGL contexts per page (often 16 in Chrome and Safari, and 8 in Chrome on Android, according to [our performance tips](/2d-charts/performance-tips/performance-tips-and-tricks/)). A library that draws every chart through one shared context can put far more charts on a page.
- Append, don't rebuild. Adding the new points to an existing series costs a fraction of re-creating the series or the chart on every update.
- Batch the updates. Buffer readings as they arrive and add them in one call per update, not one call per reading.
- Use circular buffers. A fixed-size first-in, first-out buffer keeps the last N points, so memory stays flat however long the dashboard runs.
- Use typed arrays. `Float64Array` stores numbers compactly and copies quickly into the chart.
- Reduce what is drawn. When a window holds more points than the chart has pixels across, draw a reduced set that keeps every peak (min-max decimation). Our [downsampling guide](/learn/big-data/downsampling/) explains why a plain average hides spikes, and the [big data visualisation guide](/learn/big-data/big-data-visualization/) covers millions of points.
- Stop drawing what can't be seen. Browsers pause `requestAnimationFrame` in background tabs, and charts scrolled out of view can stop drawing too.
- Keep small panels simple: fewer gridlines and labels on a sparkline or a small tile cost less to draw and read better.

## Real-time dashboard examples

| Domain | What's on the dashboard | How fast the data is | Read more |
| --- | --- | --- | --- |
| IoT and sensor monitoring | Device status, sparklines of each sensor, temperature or energy heatmaps, battery and signal gauges | Usually every few seconds to minutes per device, but thousands of devices | [Telemetry guide](/learn/applications/telemetry/) |
| Manufacturing | Line speed, output against target, rejects, motor current and vibration, oven temperatures | Hundreds to thousands of samples a second for vibration; seconds for counts | [HMI and SCADA guide](/learn/applications/hmi-scada/), [SciChart for HMI and SCADA](https://www.scichart.com/scada-big-data/) |
| Motorsport | Speed, throttle, brake, gear, tyre and brake temperatures, lap times and the gap to a reference lap | Many samples a second per channel while the car is running | [Motorsport telemetry guide](/learn/applications/motorsport-telemetry/) |
| Trading | Price ticks, candlesticks, order book depth, positions and P&L | Many updates a second at busy times | [Candlestick chart guide](/learn/chart-types/cartesian/candlestick-chart/) |
| Remote patient monitoring | Heart rate, SpO₂, blood pressure and ECG, with alerts for out-of-range values | ECG at hundreds of samples a second; vital-sign summaries every few seconds to minutes | [Strip chart guide](/learn/real-time/strip-chart/), [SciChart for medical charts](https://www.scichart.com/why-scichart-medical-charts-dashboarding-for-research-and-healthcare/), [SciChart for telehealth](https://www.scichart.com/telehealth/) |
| Server and network monitoring | Requests per second, latency percentiles, error rate, CPU and memory per host | Typically every 10 to 60 seconds per metric, across many hosts | [Heatmap guide](/learn/chart-types/cartesian/heatmap/) |
| Test and measurement | Many channels from a test rig, limits, pass/fail | Thousands to millions of samples a second per channel at the instrument, reduced before display | [SciChart for instrumentation](https://www.scichart.com/best-instrumentation-engineering-software/) |

## Common real-time dashboard mistakes

- **Updating faster than anyone can read.** Thirty panels all flickering at 60 Hz tire the eye and hide the one change that matters. Update numbers slowly and traces smoothly, and leave static panels static.
- **No "last updated" indicator.** If the connection drops, a frozen dashboard looks exactly like a calm one. Show the time of the newest data, and grey out or flag panels whose data is stale.
- **Unsynchronised time axes.** Two charts showing slightly different windows make cause and effect look out of order. Share one window and line up the plot areas.
- **Colour overload.** When every series, tile and background is brightly coloured, an alarm colour no longer stands out. Use a calm palette and keep strong colours for exceptions.
- **Autoscaling live axes.** An axis that rescales with every update makes a tiny wobble look dramatic and the trace jump about. Fix the range to the normal values plus the limits.
- **Too many charts on one screen.** If a panel doesn't support a decision, it costs attention and drawing time. Move it to a detail page.
- **No way to stop and look.** People need to pause a scrolling chart, zoom into the last minute and read exact values, then return to live.

## How to build a real-time dashboard in JavaScript, React or Angular

SciChart.js draws charts with WebGL and WebGPU, and all charts on a page share one WebGL context, so a dashboard with many live panels and over a million points on screen keeps scrolling smoothly in the browser. The example below simulates a production line: three motor currents and a pump vibration sensor stream in at the data rate you choose, and line speed, station output, utilities and eight oven zones arrive four times a second.

Use **Update rate** to redraw the dashboard 1, 10 or 60 times a second, and **Data rate** to change how many readings each fast channel sends per second (100 to 10,000, so up to 1.2 million points on the strip charts). **Panels** shows 2, 4 or 6 panels. **Pause** stops the display while data keeps arriving; the readout then shows how far behind live it is. The readout also shows the frame time, the points drawn and the number of charts. Hover a strip chart to read both at once; scrolling or dragging on one pauses the dashboard and zooms or pans both, and double-clicking shows the whole window.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="real-time dashboard" demo="multiple-chart-dashboard-performance-demo" docs="/2d-charts/chart-synchronization-api/synchronizing-multiple-charts/" docsLabel="SciChart.js chart synchronisation documentation" />

Here is the code for this dashboard. The plant simulation and the controls are plain JavaScript; SciChart.js draws every panel and keeps the strip charts in step. The React and Angular versions show the core of it: two synchronised strip charts fed from a buffer at a fixed update rate.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { useEffect, useRef } from "react";
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier
    } from "scichart";

    const WINDOW = 30; // seconds on screen
    const DATA_RATE = 1000; // readings per second, per channel
    const UPDATE_RATE = 10; // dashboard updates per second
    const group = new SciChartVerticalGroup(); // lines up the y-axes, so both time axes match

    // One strip chart: a fixed y-range, a circular buffer, and a cursor shared with the other chart
    const stripChart = (title: string, yRange: NumberRange) => async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            title
        });
        const xAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Never });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Never, visibleRange: yRange }));
        const dataSeries = new XyDataSeries(wasmContext, { fifoCapacity: WINDOW * DATA_RATE, isSorted: true, containsNaN: false });
        sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0" }));
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ modifierGroup: "dashboard", showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection })
        );
        group.addSurfaceToGroup(sciChartSurface);
        return { sciChartSurface, xAxis, dataSeries };
    };
    const initCurrent = stripChart("Motor current (A)", new NumberRange(0, 40));
    const initVibration = stripChart("Vibration (mm/s)", new NumberRange(-12, 12));

    export const RealTimeDashboard = () => {
        const charts = useRef<{ xAxis: NumericAxis; dataSeries: XyDataSeries }[]>([]);

        useEffect(() => {
            // Buffer readings as they arrive; draw them in one batch per update
            let times: number[] = [];
            let values: number[][] = [[], []];
            const unsubscribe = subscribeToYourStream((time: number, reading: number[]) => {
                times.push(time);
                reading.forEach((value, i) => values[i].push(value));
            });
            const timer = setInterval(() => {
                if (times.length === 0 || charts.current.length < 2) return;
                charts.current.forEach((chart, i) => chart.dataSeries.appendRange(times, values[i]));
                const now = times[times.length - 1];
                charts.current.forEach((chart) => (chart.xAxis.visibleRange = new NumberRange(now - WINDOW, now)));
                times = [];
                values = [[], []];
            }, 1000 / UPDATE_RATE);
            return () => {
                clearInterval(timer);
                unsubscribe();
            };
        }, []);

        return (
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 6, height: 500 }}>
                <SciChartReact initChart={initCurrent} onInit={(result) => (charts.current[0] = result)} />
                <SciChartReact initChart={initVibration} onInit={(result) => (charts.current[1] = result)} />
            </div>
        );
    };
    ```

    ```ts
    import { Component, OnDestroy, OnInit } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier
    } from "scichart";

    const WINDOW = 30; // seconds on screen
    const DATA_RATE = 1000; // readings per second, per channel
    const UPDATE_RATE = 10; // dashboard updates per second

    @Component({
        selector: "app-real-time-dashboard",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `
            <div style="display: grid; grid-template-rows: 1fr 1fr; gap: 6px; height: 500px">
                <scichart-angular [initChart]="initCurrent"></scichart-angular>
                <scichart-angular [initChart]="initVibration"></scichart-angular>
            </div>`
    })
    export class RealTimeDashboardComponent implements OnInit, OnDestroy {
        private group = new SciChartVerticalGroup(); // lines up the y-axes, so both time axes match
        private charts: { xAxis: NumericAxis; dataSeries: XyDataSeries }[] = [];
        private times: number[] = [];
        private values: number[][] = [[], []];
        private timer?: ReturnType<typeof setInterval>;
        private unsubscribe?: () => void;

        // One strip chart: a fixed y-range, a circular buffer, and a cursor shared with the other chart
        private stripChart = (index: number, title: string, yRange: NumberRange) => async (rootElement: string | HTMLDivElement) => {
            const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme(),
                title
            });
            const xAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Never });
            sciChartSurface.xAxes.add(xAxis);
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Never, visibleRange: yRange }));
            const dataSeries = new XyDataSeries(wasmContext, { fifoCapacity: WINDOW * DATA_RATE, isSorted: true, containsNaN: false });
            sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0" }));
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ modifierGroup: "dashboard", showTooltip: true }),
                new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomPanModifier({ xyDirection: EXyDirection.XDirection })
            );
            this.group.addSurfaceToGroup(sciChartSurface);
            this.charts[index] = { xAxis, dataSeries };
            return { sciChartSurface };
        };
        initCurrent = this.stripChart(0, "Motor current (A)", new NumberRange(0, 40));
        initVibration = this.stripChart(1, "Vibration (mm/s)", new NumberRange(-12, 12));

        ngOnInit() {
            // Buffer readings as they arrive; draw them in one batch per update
            this.unsubscribe = subscribeToYourStream((time: number, reading: number[]) => {
                this.times.push(time);
                reading.forEach((value, i) => this.values[i].push(value));
            });
            this.timer = setInterval(() => {
                if (this.times.length === 0 || this.charts.length < 2) return;
                this.charts.forEach((chart, i) => chart.dataSeries.appendRange(this.times, this.values[i]));
                const now = this.times[this.times.length - 1];
                this.charts.forEach((chart) => (chart.xAxis.visibleRange = new NumberRange(now - WINDOW, now)));
                this.times = [];
                this.values = [[], []];
            }, 1000 / UPDATE_RATE);
        }

        ngOnDestroy() {
            clearInterval(this.timer);
            this.unsubscribe?.();
        }
    }
    ```
</CodeSnippetBlock>

Key points:

- Each panel is its own `SciChartSurface` (the gauge is a `SciChartPolarSurface`). `SciChartSurface.create` draws every chart through one shared WebGL context and engine, which keeps memory low and lets one page hold many charts.
- `XyDataSeries` with `fifoCapacity` is a circular buffer: it keeps the newest points and drops the oldest. Readings arrive into `Float64Array` batches and are added with one `appendRange` per series per update, so the update rate is set by a timer, independently of the data rate.
- `SciChartVerticalGroup` gives the strip charts' y-axes the same width, so their time axes line up; a `visibleRangeChanged` handler copies zooming and panning from one to the other, and `CursorModifier` with a shared `modifierGroup` shows the cursor on both.
- The gauge is a `PolarArcAnnotation` whose end moves to the latest value; the bars update in place with `XyDataSeries.update`; the heatmap scrolls by shifting its rows and calling `UniformHeatmapDataSeries.setZValues`.
- `freezeWhenOutOfView` stops drawing panels scrolled off screen, and fixed `visibleRange`s with `EAutoRange.Never` keep every axis still.

**See it in the demo app:** [JavaScript real-time dashboard](https://www.scichart.com/demo/javascript/multiple-chart-dashboard-performance-demo) · [React real-time dashboard](https://www.scichart.com/demo/react/multiple-chart-dashboard-performance-demo) · [Angular real-time dashboard](https://www.scichart.com/demo/angular/multiple-chart-dashboard-performance-demo). For synchronised charts, see the [React synchronised multi-chart example](https://www.scichart.com/demo/react/sync-multi-chart); for a monitoring screen, the [React server traffic dashboard](https://www.scichart.com/demo/react/server-traffic-dashboard); for gauges fed with live data, the [React polar gauge FIFO dashboard](https://www.scichart.com/demo/react/polar-gauge-fifo-dashboard); for raw speed, the [React real-time performance demo](https://www.scichart.com/demo/react/chart-realtime-performance-demo); and for full industry screens, the [React oil and gas dashboard](https://www.scichart.com/demo/react/oil-and-gas-dashboard-showcase) and the [React vital signs monitor](https://www.scichart.com/demo/react/vital-signs-ecg-medical-chart-example).

**Go deeper:** [SciChart.js chart synchronisation documentation](/2d-charts/chart-synchronization-api/synchronizing-multiple-charts/), [real-time updates](/2d-charts/chart-types/data-series-api/realtime-updates/), [performance tips for many charts](/2d-charts/performance-tips/performance-tips-and-tricks/), [polar gauge chart](/2d-charts/chart-types/polar-gauge-chart/) and [updating a heatmap in real time](/2d-charts/chart-types/uniform-heatmap-renderable-series/updating-realtime/). For where SciChart is used in industry, see the [HMI and SCADA page](https://www.scichart.com/scada-big-data/), the [medical charts page](https://www.scichart.com/why-scichart-medical-charts-dashboarding-for-research-and-healthcare/) and the [instrumentation page](https://www.scichart.com/best-instrumentation-engineering-software/).

## Frequently asked questions

### What is a real-time dashboard?

A real-time dashboard is a screen of charts, gauges and numbers that updates by itself as new data arrives, usually within a second or a few seconds of each event. It is used to watch something while it is happening, such as a production line, a fleet of sensors, a patient or a website, so people can act before a problem grows.

### What is the difference between a real-time dashboard and a BI dashboard?

A BI (business intelligence) dashboard is refreshed on a schedule, often hourly or daily, from a data warehouse, and answers questions about trends and totals. A real-time dashboard is pushed new data continuously from live sources and answers what is happening now. Many operations teams use both: the live view to act, the BI view to review.

### How often should a real-time dashboard update?

Match the update rate to the decision and to the chart. Moving traces such as strip charts look smooth when they update with the screen, up to 60 times a second on most displays. Numbers and gauges that people read are easier to follow at one to a few updates a second. Business metrics can update every few seconds or every minute. Updating faster than the screen refreshes does nothing but cost processing time.

### How does data get into a real-time dashboard?

Devices and applications publish readings to a broker or server, often over MQTT or a message queue. The server processes and stores them, then pushes new values to each open dashboard over a WebSocket or server-sent events, or the dashboard polls for them. In the browser, the readings are buffered and appended to the charts at the dashboard's update rate.

### What is an IoT dashboard?

An IoT dashboard shows live readings from internet-connected devices such as sensors, meters and machines. It typically combines a list or map of devices and their status, sparklines or strip charts of each device's recent readings, gauges for key values and an alarm list. Devices usually send data through an MQTT broker or a cloud IoT service.

### How do I make a real-time dashboard in JavaScript?

Use a charting library built for live data. In SciChart.js, create one SciChartSurface per panel, which share a single WebGL context, give each line an XyDataSeries with fifoCapacity, buffer incoming readings and append them with appendRange on a timer at your update rate, then move the time axes together. SciChartVerticalGroup and a CursorModifier modifierGroup keep the charts aligned and their cursors in step.

## Sources

- Fette, I. and Melnikov, A. (2011), [RFC 6455: The WebSocket Protocol](https://www.rfc-editor.org/rfc/rfc6455), Internet Engineering Task Force.
- WHATWG, [HTML Living Standard: server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html).
- OASIS (2019), [MQTT Version 5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html), OASIS Standard.
- Shneiderman, B. (1996), "The Eyes Have It: A Task by Data Type Taxonomy for Information Visualizations", Proceedings of the IEEE Symposium on Visual Languages, [doi:10.1109/VL.1996.545307](https://doi.org/10.1109/VL.1996.545307).
- International Society of Automation, [ANSI/ISA-101.01, Human Machine Interfaces for Process Automation Systems](https://www.isa.org/standards-and-publications/isa-standards/isa-101-standards).
- MDN Web Docs, [Window: requestAnimationFrame() method](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) (paused in background tabs) and [Float64Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array).

<LearnCta position="bottom" chart="real-time dashboard" demo="multiple-chart-dashboard-performance-demo" docs="/2d-charts/chart-synchronization-api/synchronizing-multiple-charts/" docsLabel="SciChart.js chart synchronisation documentation" />
