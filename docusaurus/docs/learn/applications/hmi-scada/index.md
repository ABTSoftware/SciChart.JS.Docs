---
sidebar_position: 20
sidebar_label: HMI and SCADA
title: "HMI and SCADA: What They Are, How They Work and Examples of SCADA Trend Charts (With Interactive Examples)"
description: "What SCADA and HMI mean, how a SCADA system is built, SCADA vs DCS, what is on an HMI screen, and how to read trend charts, alarm limits and deadbands, with a live example."
keywords:
    [
        "scada",
        "scada meaning",
        "what is scada",
        "scada system",
        "what does scada stand for",
        "hmi",
        "hmi meaning",
        "what is hmi",
        "hmi screen",
        "hmi scada",
        "hmi software",
        "plc hmi",
        "scada vs dcs",
        "scada trend chart",
        "hmi trend",
        "high performance hmi",
        "alarm deadband"
    ]
image: /img/learn/hmi-scada-og.png
related: [telemetry, strip-chart, gauge-chart, downsampling]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does SCADA stand for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "SCADA stands for supervisory control and data acquisition. Data acquisition is collecting readings from sensors and controllers; supervisory control is people, or higher-level software, giving those controllers new setpoints and commands. The control loops themselves run in PLCs and RTUs on site, not in the SCADA software." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between HMI and SCADA?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An HMI is the screen a person uses to watch and operate a machine or process. SCADA is the whole system behind it: the communications to many PLCs and RTUs, the database of live values, the historian, the alarm server and the HMI screens. A small machine can have an HMI with no SCADA; every SCADA system has HMIs." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a PLC and SCADA?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A PLC (programmable logic controller) is a rugged computer that reads sensors and drives outputs such as pumps and valves, running its control logic many times a second. SCADA is software and servers that collect data from many PLCs, show it to operators, store it and raise alarms. The PLC keeps controlling if the SCADA link is lost." }
                },
                {
                    "@type": "Question",
                    "name": "What is an HMI screen?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An HMI screen is a display that shows a machine or process to its operator and accepts their commands. It usually combines a simplified drawing of the plant, faceplates showing each value with its setpoint and limits, trend charts of recent and historical values, and an alarm list. It can be a touch panel on a machine or a page in SCADA software." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between SCADA and DCS?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A DCS (distributed control system) controls one plant, such as a refinery or power station, with controllers, network and operator stations designed as one system and tightly linked loops. SCADA supervises equipment spread over a wide area, such as a pipeline or water network, over slower and less reliable links, and leaves the closed-loop control to PLCs and RTUs at each site." }
                },
                {
                    "@type": "Question",
                    "name": "What is a deadband in SCADA alarms?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A deadband is a margin a value must move back inside an alarm limit before the alarm clears. With a high limit of 80 and a deadband of 5, the alarm is raised above 80 but clears only below 75. Without it, a noisy value hovering at the limit raises and clears the alarm over and over, which is called chattering." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make an HMI trend chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a charting library that handles real-time data. In SciChart.js, give each process tag its own y-axis with a fixed range, stack the axes with a vertically stacked axis layout, append readings to XyDataSeries with fifoCapacity set, and move the time axis's visible range to follow the newest reading. Add HorizontalLineAnnotation lines for the alarm limits; with isEditable they can be dragged." }
                }
            ]
        })}
    </script>
</head>

# HMI and SCADA

## What are SCADA and HMI?

**SCADA** (supervisory control and data acquisition) is a system that gathers readings from sensors and controllers across a plant or a wide area, shows them to operators, stores their history and raises alarms, and lets operators send commands back. An **HMI** (human-machine interface) is the screen through which a person watches and operates a machine or process.

![An HMI trend display on a dark navy background: four process tags (tank level, inlet flow, discharge pressure and temperature) on four stacked lanes over ten minutes, each with dashed high and low alarm limit lines, and an alarm list on the right with times, tags and alarm messages](/img/learn/hmi-scada-og.png)

*A SCADA trend display of a simulated pumping station: four tags in stacked lanes, their alarm limits as dashed lines and the alarm list on the right. [Try the interactive version](#how-to-build-an-hmi-trend-chart-in-javascript-react-or-angular), drag the limits and switch to the grey high-performance style.*

:::tip Key takeaways
- SCADA is the whole system: field devices, PLCs and RTUs, communications, servers, the historian and the HMI screens.
- The HMI is the part people see. A single machine can have an HMI without SCADA.
- Control loops run in the PLCs and RTUs on site; SCADA supervises them, so the plant keeps running if a link drops.
- Trend charts are the main tool on an HMI for seeing what a process is doing and has done.
- Good HMIs are grey and calm, so colour stands out when something is wrong (ISA-101), and alarms use limits with deadbands so they don't chatter (ISA-18.2).
:::

## What does SCADA stand for?

SCADA stands for supervisory control and data acquisition. Each part of the name is a job the system does:

- Supervisory: it sits above the controllers that run the process. It doesn't open a valve every time a level changes; a PLC (programmable logic controller) or RTU (remote terminal unit) on site does that. SCADA watches those controllers and changes their setpoints, modes and schedules.
- Control: operators, or SCADA's own logic, send commands: start a pump, close a breaker, raise a setpoint.
- Data acquisition: it polls or receives readings, called **tags** or points, from hundreds to millions of sensors and stores them with a timestamp.

The word is used for the software (a "SCADA package"), for the whole installation (a "SCADA system") and, loosely, for any industrial monitoring screen. NIST describes SCADA as a computerised system that gathers and processes data and applies controls across assets spread over long distances, such as power grids, pipelines and water systems.

## What is an HMI?

An **HMI** is anything that lets a person see the state of a machine and act on it. In industry, the term usually means one of three things:

| Kind of HMI | What it is | Typical use |
| --- | --- | --- |
| Panel HMI | A touch screen mounted on a machine or cabinet, wired to one PLC | Starting, stopping and adjusting a single machine, such as a packaging line or compressor |
| PC or server-based HMI | HMI software on an industrial PC, showing several machines or a whole area | A control room for one plant area |
| SCADA HMI clients | Screens served by the SCADA system to operator stations, web browsers and mobile devices | Supervising a whole plant or a network of remote sites |

"HMI software" is the program used to draw those screens and link each graphic to a tag. A "PLC HMI" pairing is the simplest system: the PLC runs the control logic and the panel shows its values and buttons. Outside industry, HMI also describes car dashboards, medical device screens and cockpit displays.

## HMI vs SCADA: how they fit together

HMI and SCADA are often written together ("HMI/SCADA") because the HMI is the visible part of a SCADA system. They differ mainly in scope.

| | HMI | SCADA |
| --- | --- | --- |
| What it is | A display and its controls | A system of devices, networks, servers and displays |
| Scope | One machine, or the screens of a larger system | A whole plant, or sites spread over hundreds of kilometres |
| Stores history | Little or none on a panel HMI | Yes, in a historian, often for years |
| Alarms | Shows them | Detects, logs, prioritises and routes them |
| Can exist alone | Yes: a panel HMI on one machine | No: it always has HMIs |

## How a SCADA system works

A SCADA system is built in layers. Readings travel up from the field to the screens, and commands travel down.

![The layers of a SCADA system, from bottom to top: field devices such as level, flow, pressure and temperature transmitters, pumps, motors, valves and breakers; controllers (PLCs in plants and RTUs at remote sites); the communications network with protocols such as Modbus, DNP3, OPC UA and IEC 61850; the SCADA server with its tag database, historian and alarm server; and the HMI clients: operator stations, web and mobile screens and the engineering station. An arrow on the right shows measurements and alarms going up and commands and setpoints going down](./scada-architecture.svg)

1. Field devices measure and act. **Transmitters** turn level, flow, pressure and temperature into electrical signals; pumps, motors, valves and circuit breakers are the outputs.
2. Controllers run the local logic. A **PLC** is a rugged computer that scans its inputs and updates its outputs many times a second. An **RTU** does the same at a remote site, such as a pumping station or substation, and is built for low power and patchy communications.
3. The communications network carries data between sites and the control centre over Ethernet, fibre, licensed radio, cellular or satellite links. Common protocols are Modbus (simple and very widespread), DNP3 (utilities, with timestamped events), IEC 61850 (electrical substations) and OPC UA (a vendor-neutral way to exchange data between software).
4. The SCADA server polls the controllers, or receives changes they report, and keeps the latest value of every tag. The **historian** stores the values over time for trends and reports, and the alarm server compares values with their limits.
5. HMI clients show it all to people: operators in the control room, engineers on an engineering station, and managers in a browser.

Because the PLCs and RTUs keep controlling on their own, a SCADA system tolerates a slow or broken link: the site carries on, and the server fills in the history when the link returns. Connecting these layers to business networks and the internet brings cyber risk; NIST SP 800-82 is the standard guide to securing them.

## SCADA vs DCS vs PLC

The three overlap, and modern products blur the line, but they started with different jobs.

| | PLC | SCADA | DCS (distributed control system) |
| --- | --- | --- | --- |
| Main job | Control one machine or process unit | Supervise many controllers, often far apart | Control a whole continuous plant |
| Where | One cabinet | A water network, pipeline, power grid or factory | A refinery, chemical plant or power station |
| Control loops | Runs them | Leaves them to the PLCs and RTUs | Runs them in its own controllers, tightly linked |
| Network | Local | Wide-area, can be slow or unreliable | Fast, redundant plant network |
| Typical screens | A panel HMI | Overviews, trends and alarms across sites | Operator consoles with built-in trends and faceplates |
| Choose it when | A machine needs logic and I/O | Assets are spread out or come from several vendors | One large process needs coordinated control and high availability |

## What is on an HMI screen?

Most HMI screens are built from a handful of elements:

- Process graphics: a simplified drawing of the plant (tanks, pipes, pumps, valves) with live values beside each item. Older screens drew 3-D tanks and spinning pumps; modern guidance prefers flat, simple shapes.
- **Faceplates**: a small panel for one tag or device, with its value, units, setpoint, mode (auto or manual) and a bar or gauge showing where the value sits between its limits. Clicking a pump or valve usually opens its faceplate.
- Trend charts: the value of one or more tags over time. They are the subject of the next section.
- Alarm summary: a list of active and recent alarms, with time, tag, message and priority, where operators acknowledge alarms.
- X-Y plots and phasor views: one value against another, such as a pump's head against its flow (its curve), or, in power systems, the voltage and current phasors from substation measurements.
- Navigation: the hierarchy of screens. ISA-101 describes four levels, from a level 1 overview of the whole operation, through level 2 unit screens and level 3 detail screens, to level 4 diagnostics.

To see how those charts are built, read our guides to the [gauge chart](/learn/chart-types/radial/gauge-chart/) used on faceplates and the [strip chart](/learn/real-time/strip-chart/) that trend displays grew from.

## How to read a SCADA trend chart

A trend chart, or "trend", plots tags against time. It's the screen operators turn to when they need to know whether a value is rising or falling, how fast, and what happened before an alarm.

![A ten-minute trend of reactor temperature TI-101 on a grey background, with a dashed HI limit at 80, a shaded 5-degree deadband just below it and a LO limit at 20. The temperature rises through 80, where the alarm is raised and the line turns red; dips to 79 and 77 inside the deadband, where the alarm stays on; and falls below 75, where it returns to normal. A cursor reads 88.0 degrees at 08:44:23](./trend-alarm-deadband.svg)

1. Find the tag and its units. Each line is a **pen**, named after its tag (TI-101 is a temperature indicator) with its engineering units. Check which axis each pen uses.
2. Check the time span and where "now" is. A live trend scrolls, with the newest value at the right. A 10-minute trend and a 10-hour trend can look alike, so read the time axis.
3. Read the value against its limits. Dashed lines often show the setpoint and the alarm limits (HI and LO, sometimes HIHI and LOLO beyond them). How close a value runs to a limit matters as much as the value.
4. Look at the shape: a steady line, a slow drift, a step, a cycle (often a control loop that's tuned too hard), or a flat line, which can mean a failed sensor rather than a steady process.
5. Line up pens in time. When pressure jumps and flow drops at the same moment, they are probably linked. A vertical cursor shows every pen's value at one time.
6. Zoom and pan into history. Pausing the trend, then zooming into the minutes before an alarm, is the usual first step in finding its cause.

### Real-time vs historical trends

| | Real-time trend | Historical trend |
| --- | --- | --- |
| Data from | The SCADA server's live values, buffered for a short window | The historian |
| Time span | Seconds to a few hours | Hours to years |
| Updates | Continuously, scrolling | Only when asked, then fixed |
| Used for | Watching a process while operating it | Finding the cause of an event, reports, comparing batches |

Most SCADA trends do both: they scroll live, and pausing or panning left loads older values from the historian. Long spans hold far more readings than the screen has pixels, so the historian or the chart reduces them first. Our [downsampling guide](/learn/big-data/downsampling/) shows why the method matters: a plain average can hide the spike that caused the alarm.

### Pens, axes and stacked trends

A trend can show its pens on one shared axis, on several axes side by side, or in **stacked axes**, with one lane per pen down the chart, as on a paper chart recorder. Shared axes suit tags with the same units and range, such as several temperatures in one vessel. Stacked lanes suit mixed units, because each pen keeps its own fixed scale and lines don't cross.

### Setpoints, alarm limits and deadbands

An alarm limit is the value at which the SCADA system tells the operator something needs attention. A **deadband** stops a noisy value from raising and clearing an alarm many times while it hovers at the limit, which alarm engineers call chattering. With a HI limit of 80 and a deadband of 5, the alarm is raised above 80 and clears only once the value falls below 75 (the diagram above). Alarm-management guides suggest deadbands of a few percent of a tag's range, larger for noisy signals such as flow and level and smaller for slow ones such as temperature. Some systems add an on-delay too: the value must stay beyond the limit for some seconds before the alarm is raised.

## Alarms and high-performance HMI design

Two standards shape how modern HMIs look and alarm:

- **ANSI/ISA-18.2**, its international counterpart IEC 62682, and the **EEMUA 191** guide cover alarm management: every alarm must need an operator response, have a priority and a documented cause and action. ISA-18.2 treats about one alarm every 10 minutes per operator as very likely to be acceptable in normal running, and uses more than 10 alarms in 10 minutes as the usual measure of an **alarm flood**, when operators can no longer respond to each alarm.
- **ANSI/ISA-101.01** covers HMI design. Its approach, often called **high-performance HMI**, uses grey backgrounds and muted colours for normal operation and keeps bright colour, red and amber especially, for abnormal states and alarms. It favours analogue indicators that show a value against its normal range, and embeds small trends in overview screens, so operators can see a problem developing before an alarm.

Try both styles in the [live example](#how-to-build-an-hmi-trend-chart-in-javascript-react-or-angular). In both, a pen turns red where it crosses a limit and the part beyond the limit is shaded. On the colourful trend that red competes with four other bright pens; on the grey trend it's the only strong colour.

## Examples of HMI and SCADA screens

| Industry | What the screens show | Trend and chart examples |
| --- | --- | --- |
| Power plant and substations | Generator output, breakers and transformers on a one-line diagram | Megawatts, frequency and voltage over the last hour; voltage and current phasors from phasor measurement units; transformer temperature against its limit |
| Water and wastewater treatment | Reservoir levels, pumps, filters, chemical dosing | Reservoir level over 24 hours against pump starts; chlorine residual and turbidity with alarm limits; flow at each pumping station |
| Oil and gas pipeline | Compressor and pumping stations, valves and meters along hundreds of kilometres, often over radio or satellite | Inlet and outlet pressure at each station; flow balance between stations to detect leaks; compressor vibration |
| Manufacturing line | Machine states, counts and rejects for each station | Cycle time and temperature by station; oven or mould temperatures against a recipe; downtime by cause |

SciChart's [HMI and SCADA page](https://www.scichart.com/scada-big-data/) describes how its charts are used on these screens, and the [instrumentation page](https://www.scichart.com/best-instrumentation-engineering-software/) covers test and measurement displays.

## Common HMI and SCADA trend chart mistakes

- **Autoscaling the value axis.** A live axis that rescales to fit the data makes a 1% wobble look like a crash, and the trace jumps about. Give each tag a fixed range that covers its normal values and its limits.
- **No deadband on alarms.** A tag hovering at its limit produces dozens of alarm and return-to-normal events, which buries real alarms. Set a deadband, and an on-delay for very noisy tags.
- **Colour everywhere.** When every pen, tank and pipe is brightly coloured, an alarm colour no longer stands out. Keep normal states grey and save strong colours for abnormal ones.
- **Too many pens on one axis.** Eight lines with different units on one scale can't be read. Use stacked lanes, or split them over several trends.
- **Averaging away the event.** Long historical trends drawn from averaged data hide short spikes and dips. Use min-max downsampling, or draw the raw data.
- **No way to stop and look.** A trend that keeps scrolling while an operator studies it is hard to use. Provide pause, zoom, pan and a cursor that reads every pen at one time.
- **Unclear time.** Mixing local time and UTC, or hiding the date on long spans, causes mistakes when trends are compared with logs and other sites.

## How to build an HMI trend chart in JavaScript, React or Angular

SciChart.js draws charts with WebGL and WebGPU, so trends with many pens, long histories and live updates stay smooth in a browser HMI. The example below simulates a pumping station: a tank (LT-101) filled by an inlet flow (FT-102) and emptied by a pump that starts and stops on level, its discharge pressure (PT-103) and a temperature (TT-104). It loads an hour of history, then adds a reading per tag every simulated second, running ten times faster than real time, with occasional upsets that raise alarms.

Drag any dashed **HI** or **LO** line to move that limit, and watch the alarm list on the right. Set the **Deadband** to None to see alarms chatter. Each pen turns red exactly where it crosses a limit, and the part beyond the limit is shaded. Switch the **Style** to high-performance (grey) to compare how much that stands out. Change the **Time span** to see 2, 10 or 60 minutes, and use **Pause** to stop the scrolling; scroll to zoom in time, drag to pan, double-click to see all the history, and hover to read every pen.

<LiveDocSnippet maxWidth={'100%'} height={640} name="./Basic/demo" />

<LearnCta position="top" chart="HMI trend chart" demo="vertically-stacked-axes" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line chart documentation" />

Here is the code for this chart. The process simulation and the alarm logic are plain JavaScript; SciChart.js draws the stacked trend, the limit lines, the colour change at each limit and the shading.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        DateTimeNumericAxis,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EXyDirection,
        FastLineRenderableSeries,
        XyDataSeries,
        HorizontalLineAnnotation,
        LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // One pen per tag, each with a fixed range and HI/LO alarm limits
    const pens = [
        { tag: "LT-101", unit: "%", min: 0, max: 100, lo: 20, hi: 85, color: "#50C7E0" },
        { tag: "PT-103", unit: "bar", min: 0, max: 10, lo: 0.5, hi: 7.5, color: "#F6E05E" }
    ];

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        const xAxis = new DateTimeNumericAxis(wasmContext, { autoRange: EAutoRange.Never });
        sciChartSurface.xAxes.add(xAxis);
        // One lane per pen, stacked top to bottom
        sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy =
            new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();

        const series = pens.map((pen, i) => {
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    id: `pen${i}`,
                    axisAlignment: EAxisAlignment.Left,
                    axisTitle: `${pen.tag} (${pen.unit})`,
                    autoRange: EAutoRange.Never,
                    visibleRange: new NumberRange(pen.min, pen.max)
                })
            );
            const data = new XyDataSeries(wasmContext, { dataSeriesName: pen.tag, fifoCapacity: 7200 });
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { dataSeries: data, yAxisId: `pen${i}`, stroke: pen.color })
            );
            // Draggable alarm limits
            for (const limit of [pen.hi, pen.lo]) {
                sciChartSurface.annotations.add(
                    new HorizontalLineAnnotation({
                        yAxisId: `pen${i}`,
                        y1: limit,
                        isEditable: true,
                        stroke: "#EF5350",
                        strokeDashArray: [6, 4]
                    })
                );
            }
            return data;
        });

        // Append each new reading and keep the newest 10 minutes in view
        const unsubscribe = subscribeToYourTags((time: number, values: number[]) => {
            series.forEach((data, i) => data.append(time, values[i]));
            xAxis.visibleRange = new NumberRange(time - 600, time);
        });
        sciChartSurface.addDeletable({ delete: unsubscribe });

        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const HmiTrendChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 500 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        DateTimeNumericAxis,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EXyDirection,
        FastLineRenderableSeries,
        XyDataSeries,
        HorizontalLineAnnotation,
        LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // One pen per tag, each with a fixed range and HI/LO alarm limits
    const pens = [
        { tag: "LT-101", unit: "%", min: 0, max: 100, lo: 20, hi: 85, color: "#50C7E0" },
        { tag: "PT-103", unit: "bar", min: 0, max: 10, lo: 0.5, hi: 7.5, color: "#F6E05E" }
    ];

    @Component({
        selector: "app-hmi-trend-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 500px"></scichart-angular>`
    })
    export class HmiTrendChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            const xAxis = new DateTimeNumericAxis(wasmContext, { autoRange: EAutoRange.Never });
            sciChartSurface.xAxes.add(xAxis);
            // One lane per pen, stacked top to bottom
            sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy =
                new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();

            const series = pens.map((pen, i) => {
                sciChartSurface.yAxes.add(
                    new NumericAxis(wasmContext, {
                        id: `pen${i}`,
                        axisAlignment: EAxisAlignment.Left,
                        axisTitle: `${pen.tag} (${pen.unit})`,
                        autoRange: EAutoRange.Never,
                        visibleRange: new NumberRange(pen.min, pen.max)
                    })
                );
                const data = new XyDataSeries(wasmContext, { dataSeriesName: pen.tag, fifoCapacity: 7200 });
                sciChartSurface.renderableSeries.add(
                    new FastLineRenderableSeries(wasmContext, { dataSeries: data, yAxisId: `pen${i}`, stroke: pen.color })
                );
                // Draggable alarm limits
                for (const limit of [pen.hi, pen.lo]) {
                    sciChartSurface.annotations.add(
                        new HorizontalLineAnnotation({
                            yAxisId: `pen${i}`,
                            y1: limit,
                            isEditable: true,
                            stroke: "#EF5350",
                            strokeDashArray: [6, 4]
                        })
                    );
                }
                return data;
            });

            // Append each new reading and keep the newest 10 minutes in view
            const unsubscribe = subscribeToYourTags((time: number, values: number[]) => {
                series.forEach((data, i) => data.append(time, values[i]));
                xAxis.visibleRange = new NumberRange(time - 600, time);
            });
            sciChartSurface.addDeletable({ delete: unsubscribe });

            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true }),
                new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomExtentsModifier()
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- `LeftAlignedOuterVerticallyStackedAxisLayoutStrategy` stacks the left-hand y-axes into lanes, and each `FastLineRenderableSeries` is tied to its lane by `yAxisId`. Fixed `visibleRange`s with `autoRange: EAutoRange.Never` keep each scale still.
- `XyDataSeries` with `fifoCapacity` keeps the newest readings (two hours here) and drops the oldest, so memory stays flat however long the trend runs. Moving the `DateTimeNumericAxis`'s `visibleRange` makes it scroll; when the user zooms or pans, `visibleRangeChanged` pauses it.
- Each alarm limit is a `HorizontalLineAnnotation` with `isEditable: true`, so it can be dragged; its `onDrag` callback updates the limit the alarm logic uses.
- A line segment has one colour, so a [render data transform](/2d-charts/chart-types/render-data-transforms-api/) (`XyBaseRenderDataTransform`) adds a point wherever a segment crosses a limit, just before drawing. The data series isn't changed, so tooltips still show the real readings. Setting `requiresTransform` to true reruns it when a limit is dragged.
- A [palette provider](/2d-charts/chart-types/palette-provider-api/fast-line-renderable-series/) then colours each split segment: `overrideStrokeArgb` returns red when the segment's midpoint is beyond a limit.
- The shading is a [band series](/2d-charts/chart-types/palette-provider-api/fast-band-renderable-series/) (`FastBandRenderableSeries`) whose transform sets y1 to the reading held inside the limits. The band has area only where the reading is beyond a limit: `fill` above HI, `fillY1` below LO.

**See it in the demo app:** [JavaScript chart with vertically stacked axes](https://www.scichart.com/demo/javascript/vertically-stacked-axes) · [React chart with vertically stacked axes](https://www.scichart.com/demo/react/vertically-stacked-axes) · [Angular chart with vertically stacked axes](https://www.scichart.com/demo/angular/vertically-stacked-axes). For draggable limits, see the [React chart with a draggable threshold](https://www.scichart.com/demo/react/chart-drag-horizontal-threshold) and the [React line chart with threshold colouring](https://www.scichart.com/demo/react/line-splitting-thresholds); for faceplate bars, the [React linear gauges](https://www.scichart.com/demo/react/linear-gauges); and for a full industrial screen, the [React oil and gas dashboard](https://www.scichart.com/demo/react/oil-and-gas-dashboard-showcase).

**Go deeper:** [SciChart.js line chart documentation](/2d-charts/chart-types/fast-line-renderable-series/), [vertically stacked axis layout](/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout/), [horizontal line annotation](/2d-charts/annotations-api/horizontal-line-annotation/), [palette provider](/2d-charts/chart-types/palette-provider-api/palette-provider-api-overview/), [render data transforms](/2d-charts/chart-types/render-data-transforms-api/), [band series](/2d-charts/chart-types/fast-band-renderable-series/) and [real-time updates](/2d-charts/chart-types/data-series-api/realtime-updates/). For where SciChart is used in industry, see the [HMI and SCADA page](https://www.scichart.com/scada-big-data/), and our guide to [big data visualisation](/learn/big-data/big-data-visualization/) for long histories.

## Frequently asked questions

### What does SCADA stand for?

SCADA stands for supervisory control and data acquisition. Data acquisition is collecting readings from sensors and controllers; supervisory control is people, or higher-level software, giving those controllers new setpoints and commands. The control loops themselves run in PLCs and RTUs on site, not in the SCADA software.

### What is the difference between HMI and SCADA?

An HMI is the screen a person uses to watch and operate a machine or process. SCADA is the whole system behind it: the communications to many PLCs and RTUs, the database of live values, the historian, the alarm server and the HMI screens. A small machine can have an HMI with no SCADA; every SCADA system has HMIs.

### What is the difference between a PLC and SCADA?

A PLC (programmable logic controller) is a rugged computer that reads sensors and drives outputs such as pumps and valves, running its control logic many times a second. SCADA is software and servers that collect data from many PLCs, show it to operators, store it and raise alarms. The PLC keeps controlling if the SCADA link is lost.

### What is an HMI screen?

An HMI screen is a display that shows a machine or process to its operator and accepts their commands. It usually combines a simplified drawing of the plant, faceplates showing each value with its setpoint and limits, trend charts of recent and historical values, and an alarm list. It can be a touch panel on a machine or a page in SCADA software.

### What is the difference between SCADA and DCS?

A DCS (distributed control system) controls one plant, such as a refinery or power station, with controllers, network and operator stations designed as one system and tightly linked loops. SCADA supervises equipment spread over a wide area, such as a pipeline or water network, over slower and less reliable links, and leaves the closed-loop control to PLCs and RTUs at each site.

### What is a deadband in SCADA alarms?

A deadband is a margin a value must move back inside an alarm limit before the alarm clears. With a high limit of 80 and a deadband of 5, the alarm is raised above 80 but clears only below 75. Without it, a noisy value hovering at the limit raises and clears the alarm over and over, which is called chattering.

### How do I make an HMI trend chart in JavaScript?

Use a charting library that handles real-time data. In SciChart.js, give each process tag its own y-axis with a fixed range, stack the axes with a vertically stacked axis layout, append readings to XyDataSeries with fifoCapacity set, and move the time axis's visible range to follow the newest reading. Add HorizontalLineAnnotation lines for the alarm limits; with isEditable they can be dragged.

## Sources

- Stouffer, K. et al. (2023), [Guide to Operational Technology (OT) Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final), NIST Special Publication 800-82 Revision 3. SCADA, DCS and PLC architectures and how to secure them.
- NIST Computer Security Resource Center glossary: [supervisory control and data acquisition (SCADA)](https://csrc.nist.gov/glossary/term/supervisory_control_and_data_acquisition) and [human machine interface (HMI)](https://csrc.nist.gov/glossary/term/human_machine_interface).
- International Society of Automation, [ANSI/ISA-18.2, Management of Alarm Systems for the Process Industries](https://www.isa.org/products/ansi-isa-18-2-2016-management-of-alarm-systems-for) (alarm rates, floods, chattering and deadbands); IEC 62682 is its international counterpart.
- International Society of Automation, [ANSI/ISA-101.01, Human Machine Interfaces for Process Automation Systems](https://www.isa.org/standards-and-publications/isa-standards/isa-101-standards) (the HMI life cycle, display hierarchy and use of colour).
- EEMUA Publication 191, [Alarm systems: a guide to design, management and procurement](https://eemua.org/products/publications/print/eemua-publication-191).
- Protocol specifications: [Modbus Organization](https://www.modbus.org/), [IEEE 1815 (DNP3)](https://standards.ieee.org/ieee/1815/5414/), [IEC 61850](https://webstore.iec.ch/en/publication/6028) and the [OPC Foundation's OPC UA](https://opcfoundation.org/about/opc-technologies/opc-ua/).

<LearnCta position="bottom" chart="HMI trend chart" demo="vertically-stacked-axes" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line chart documentation" />
