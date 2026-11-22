---
sidebar_position: 30
sidebar_label: Time Series Graph
title: "Time Series Graph: What It Is, How to Read One and Chart Live Data"
description: "What a time series graph is, how to read its trend, seasonality, noise, level shifts and gaps, how to handle time axes, smoothing and large data, and how to chart live time series."
keywords:
    [
        "time series graph",
        "what is a time series graph",
        "time series graph definition",
        "time-series graph",
        "time series line graph",
        "time series graph example",
        "how to make a time series graph",
        "what does a time series graph look like",
        "how to read a time series graph",
        "time series chart",
        "time series plot",
        "time series visualization",
        "components of a time series",
        "time series graph vs line graph"
    ]
image: /img/learn/time-series-graph-og.png
related: [strip-chart, real-time-dashboard, line-chart, downsampling]
datePublished: 2026-11-20
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a time series graph?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A time series graph is a graph of one or more measurements recorded over time, with time on the horizontal axis and the measured value on the vertical axis. The points are plotted in time order and usually joined by a line, so the reader can see the trend, repeating cycles, sudden changes and unusual values."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a time series graph and a line graph?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A time series graph is a line graph whose x-axis is time. Every time series graph can be drawn as a line graph, but a line graph can also show a value against distance, frequency or any other ordered quantity. A time series graph adds the concerns that come with time: date and time labels, time zones, uneven sampling, gaps in the record and aggregation into hours, days or months."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What are the components of a time series?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A time series is usually described as a trend (the long-run rise or fall), seasonality (a pattern that repeats over a fixed period such as a day, week or year), cycles (rises and falls with no fixed period) and the remainder or noise (irregular variation). Level shifts, outliers and gaps are not components, but a reader should look for them too."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do you describe a time series graph?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "State what was measured, over what period and how often, then describe the trend with a rate, the repeating pattern with its period and size, any sudden changes with their dates, and any outliers or gaps. For example: over three weeks, demand rose by about 0.6 kW a day, peaked at around 90 kW every weekday afternoon, and dropped by about 12 kW on 15 March."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Should you join the points across a gap in a time series graph?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No. A line drawn straight across a gap shows values that were never measured, and it can hide a peak or a dip that happened while no data was recorded. Break the line where data is missing, and mark long gaps with a shaded band or a note so readers know the record is incomplete."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a time series graph in JavaScript?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Store each time as a Unix timestamp and plot the values against a date-time axis. With SciChart.js, use a DateTimeNumericAxis for x, an XyDataSeries for the values with NaN for missing readings, and a FastLineRenderableSeries with drawNaNAs set to DiscontinuousLine so gaps show as breaks. For live data, set fifoCapacity and call appendRange as readings arrive. The same code works in React with scichart-react and in Angular with scichart-angular."
                    }
                }
            ]
        })}
    </script>
</head>

# Time Series Graph

## What is a time series graph?

A **time series graph** (also known as a time series chart or time plot) is a graph of measurements recorded over time, with time on the horizontal x-axis and the measured value on the vertical y-axis. The points are usually joined by a line in time order, showing trends, repeating cycles, sudden changes and unusual values.

![A time series graph in a dark navy theme: three weeks of 15-minute power demand readings for an office building, with a daily peak every weekday afternoon, lower weekends, three red-shaded meter outages, a dashed yellow retrofit marker where demand drops, and an orange 24-hour moving average running through the readings](/img/learn/time-series-graph-og.png)

*Three weeks of simulated power demand for an office building, read every 15 minutes, with a 24-hour moving average, meter outages shaded and a retrofit marked. [Try the interactive version](#how-to-make-a-time-series-graph-in-javascript-react-or-angular).*

:::tip Key takeaways
- A time series graph plots values in time order against a time axis; the line between points stands for the time in between.
- Read it in layers: the trend, the repeating (seasonal) pattern, sudden level shifts, single outliers, then the noise that is left.
- Break the line where data is missing. A line joined across a gap draws readings that were never taken.
- Store times in UTC, label them in a stated time zone, and resample with the right aggregate (mean, sum, max or last).
- A live time series appends new readings and drops the oldest, so the graph shows a moving window of fixed length.
:::

A **time series** is a list of values of one quantity, each with a time stamp, in time order: a city's hourly temperature, a share's daily closing price, a heart monitor's 500 samples a second, a website's visits per day. Two things set it apart from other data. The order matters, and neighbouring values tend to resemble each other (statisticians call this [autocorrelation](/learn/signal-processing/autocorrelation/)), so the graph has to keep them in sequence.

### What does a time series graph look like?

Most time series graphs share the same parts:

- An x-axis of dates or times, running left to right from oldest to newest, with labels such as "Mon 9", "12:00" or "2026".
- A y-axis with the measured quantity and its unit, for example "Power demand (kW)".
- A line through the data points in time order. Sparse data, such as a yearly survey, often adds a marker at each point.
- Often, extra lines for a moving average, a target or a limit, and markers or shaded bands for events and missing data.

A line graph of sales by month, a stock chart, a weather station's temperature record and a server's CPU load over the last hour are all time series graphs.

## How to read a time series graph

Most time series are a mix of a few simple patterns. Learning to pull them apart by eye is most of the skill. The diagram splits the demand series from the image above into a slow trend, a repeating cycle and leftover noise; added together, they make the series you see.

![A time series split into its parts. The top panel shows 15 days of building power demand with labels for weekday peaks, a quiet weekend, an outlier spike, a shaded gap and a level shift where demand drops by 12 kW. Below, three panels show the parts that add up to it: a trend line rising about 0.6 kW a day that steps down at the retrofit, a daily and weekly cycle that repeats every day and is smaller at weekends, and irregular noise centred on zero](./time-series-components.svg)

| What to look for | What it looks like | In the example |
| --- | --- | --- |
| Trend | A long-run rise or fall that outlasts the repeating pattern | Demand creeps up by about 0.6 kW a day |
| Seasonality | A pattern that repeats over a fixed, known period: a day, a week, a year | A peak every weekday afternoon, smaller at weekends |
| Cycles | Rises and falls without a fixed period, usually lasting longer than a season | None in three weeks; business cycles in sales data are the classic case |
| Level shift | A sudden step to a new level that stays | Demand drops by 12 kW when a retrofit goes live on 15 March |
| Outliers | Single points far from their neighbours | Two one-reading spikes, each over 30 kW above the readings either side |
| Noise | The irregular wiggle left when everything above is taken out | Readings scatter by a few kW around the daily shape |
| Gaps | Stretches with no data | Three meter outages of 1 to 6 hours |

When the parts add up, the series is **additive**:

$$
y_t = T_t + S_t + R_t
$$

where $y_t$ is the value at time $t$, $T_t$ the trend (including any level shifts), $S_t$ the seasonal part and $R_t$ the remainder. When the seasonal swings grow in proportion to the level, as with retail sales that rise every December by a bigger amount each year, the parts multiply instead. Plotting such a series on a [log scale](/learn/axes-and-scales/log-scale-graph/) turns it back into an additive one, with swings of steady height.

Read a time series graph in this order:

1. Read the axes: what is measured, in what unit, over what period, how often, and in which time zone.
2. Find the trend. Ignore the wiggles and ask whether the level at the right is higher or lower than at the left, and by how much per day, month or year.
3. Find the repeating pattern and its period. Count the peaks between two dates: seven peaks a week means a daily cycle.
4. Look for steps. A sudden change that persists usually has a cause with a date: a new machine, a price change, a policy.
5. Look for single odd points. Check whether they are real events or measurement errors before drawing conclusions from them.
6. Look for gaps, and for flat stretches that might be a stuck sensor rather than a steady value.

### Seasonality vs cycles

The two words are often mixed up. Seasonality has a fixed period set by the calendar or the clock (daily, weekly, yearly), so you can predict when the next peak comes. A cycle rises and falls over irregular lengths, such as an economic expansion and recession, and you can't say in advance when it will turn.

## Time series graph example: describing one

Here is how to put the example graph into words, with the numbers read from it. The data is the simulated building meter from the image at the top: 2,016 readings, one every 15 minutes, from Monday 2 March to Sunday 22 March 2026, in UTC.

| Feature | What the graph shows |
| --- | --- |
| Trend | A slow rise, about 4 kW a week |
| Seasonal pattern | A daily cycle peaking around 13:00. Weekday afternoons reach about 85 to 98 kW, nights fall to about 45 to 57 kW, and weekends stay low |
| Level shift | On Sunday 15 March demand steps down by about 12 kW. The weekday average falls by less, from 71.6 kW (9 to 13 March) to 65.1 kW (16 to 20 March), because a week of the upward trend adds back about 4 kW and the outages on 10 and 12 March left out some midday peaks from the earlier week |
| Outliers | Spikes to 107 kW at 12:30 on Saturday 7 March, and to 93 kW at 01:30 on Saturday 21 March, with the readings either side between 55 and 67 kW |
| Gaps | No readings on 10 March from 10:00 to 16:00, on 12 March from 10:00 to 11:00, and from 21:00 on 21 March to 03:00 on 22 March |

A template for describing any time series graph: "Over [period], [quantity] [rose / fell / stayed level] by about [rate]. It [peaks / dips] every [period], at around [value]. On [date], it [jumped / dropped] by [amount], probably because [cause]. [Outliers and gaps], which [do / don't] change the picture."

For the example: "Over three weeks in March 2026, the building's power demand rose by about 4 kW a week. It peaked every weekday around 13:00 at 85 to 98 kW and was much lower at weekends. On 15 March it dropped by about 12 kW, when the retrofit went live. Two single-reading spikes look like meter glitches, and three outages leave gaps of 1 to 6 hours, one of them over the Tuesday 10 March peak."

## Regular and irregular sampling, and gaps

A regularly sampled series has a reading at a fixed interval: every 15 minutes, every day, 1,000 times a second. An irregular one has readings whenever something happens: a trade, a sensor that reports only when its value changes, a patient's blood test.

- Plot both against a true time axis, where the distance between two points is proportional to the time between them. Some charting tools place every point an equal distance apart, as categories; with irregular data that squeezes long quiet periods and stretches busy ones.
- Markets and some machines stop at known times, overnight or at weekends. A date axis that skips the closed hours avoids long flat lines, but must make the jump visible, for example with a gridline or a label.
- Decide what counts as a gap. For regular data, a missing reading or a time step longer than about one and a half times the normal interval is a gap. For irregular data, choose a threshold from what the sensor should do (a sensor that reports every change should still send a heartbeat at least once a minute, say).

![Two copies of the same day of power readings, 06:00 to 21:00, with the meter offline from 10:00 to 16:00. On the left, the line is joined straight across the gap, suggesting demand stayed near 85 kW and hiding the real midday peak, which is drawn faintly. On the right, the line stops at the gap and a shaded band marks the outage](./time-series-gaps.svg)

The line between two points says "the value moved smoothly from here to there". Across a six-hour outage that claim is false, and in the diagram the joined line hides a midday peak near 100 kW. Store missing readings as empty values (NaN in most programming languages), let the line break there, and shade long outages so readers know why the line stops.

## Date-time axes, time zones and labels

Time is the axis that causes the most bugs. A few rules prevent most of them:

- Store UTC timestamps. Keep times as Coordinated Universal Time, for example as Unix time (seconds or milliseconds since 1 January 1970 UTC), and convert to local time only for display.
- Say which time zone the labels use. "12:00" means different moments in London, Chicago and Tokyo. Put the zone in the axis title or the tooltip, such as "Time (UTC)" or "Local time (Europe/London)", using names from the IANA time zone database.
- Expect daylight saving time. In a zone with daylight saving, one local day a year has 23 hours and another has 25. Daily totals for those days differ for that reason alone, and a repeated hour can make a line double back if times are stored as local clock readings.
- Let labels follow the zoom. A good date axis shows years when you see a decade, then months, days, hours and seconds as you zoom in, and gives the wider unit once at each boundary ("Mar 9" then "06:00", "12:00", "18:00").
- Write unambiguous dates. 03/04/2026 is 3 April in the UK and 4 March in the USA. ISO 8601 dates (2026-03-04) or month names avoid the confusion.
- Watch the precision of high-rate data. A 64-bit floating-point number holding today's Unix time in seconds can only resolve steps of about 0.24 microseconds. For microsecond or nanosecond data, store times as an offset from a nearby start time.

## One series or many: overlays, small multiples and stacked axes

Comparing several time series is common: sites, products, sensors, years. Choose the layout by how many series there are and whether they share a unit.

| Layout | Use it when | Watch out for |
| --- | --- | --- |
| Overlay: several lines on one chart | Up to about five series in the same unit, such as three sites' temperatures | More lines become a tangle that is hard to follow |
| Index to 100 | Comparing growth of series with different sizes, such as two shares' prices | Readers lose the actual values; say what the base date is |
| Small multiples: one small chart per series, same scales | Many series with the same unit, where the shape matters more than exact crossings | Use the same y-range in every panel, or say clearly that they differ |
| Stacked axes or panes on a shared time axis | Related series in different units, such as speed, temperature and vibration | The time axes must line up exactly, so one moment sits in one vertical line |
| Two y-axes on one chart | Two series in different units, when space is tight | The scales are arbitrary, so any crossing of the two lines means nothing |
| [Heatmap](/learn/chart-types/cartesian/heatmap/): time across, series down, colour for value | Hundreds of series, such as every server in a data centre | Exact values are hard to read from colour |

## Smoothing a time series with a moving average

A **moving average** replaces each reading with the average of the readings in a window around it, which irons out noise and makes the trend and the cycle easier to see. The trailing moving average of the last $k$ readings is

$$
\bar{y}_t = \frac{1}{k}\sum_{j=0}^{k-1} y_{t-j}
$$

Three things decide what it shows:

- The window length. A window exactly one season long removes that season: a 24-hour average of the example series flattens the daily cycle and leaves the weekly pattern and the trend. A one-week window would leave only the trend and the level shift.
- Trailing or centred. A trailing average uses only past readings, so it can run live, but it lags behind the data by half its window: a 24-hour trailing average shows the retrofit drop about 12 hours late. A centred average puts the window around each point, so it doesn't lag, but it can't be computed for the newest half-window until the future readings arrive.
- Missing data. An average over a window with gaps should average only the readings it has, and show nothing when too few are left.

A moving average is a simple [low-pass filter](/learn/signal-processing/low-pass-filter/): it passes slow changes and blocks fast ones. An exponential moving average weights recent readings more heavily and is cheaper to update live.

## Resampling large time series

A year of one reading per second is about 31.5 million points, far more than a screen has pixels. There are two separate reasons to reduce it, and they need different methods.

Resampling for analysis puts readings into equal time buckets (per minute, hour, day) and summarises each with one number. The right summary depends on what the quantity is:

| Quantity | Aggregate per bucket | Why |
| --- | --- | --- |
| Rates and levels: temperature, power, speed | Mean, often with min and max | The average level is what matters; the extremes show the spread |
| Counts and amounts: visits, energy used, rainfall | Sum | A day's rainfall is the sum of its hours, not their average |
| Peaks that matter: loads, pressures, latency | Max (or a high percentile) | An average hides the peaks you need to see |
| States and prices: a valve position, a share price | Last (or open, high, low, close) | The value at the end of the bucket is the state; OHLC bars keep the range too, as on a [candlestick chart](/learn/chart-types/cartesian/candlestick-chart/) |

[Downsampling](/learn/big-data/downsampling/) for display keeps the shape of every point while drawing fewer of them. A min-max method keeps the highest and lowest value for each pixel column, so a one-sample spike still shows when a year is on screen. Taking every hundredth point can drop it entirely. With a fast renderer you can skip this step for millions of points and draw them all; see [big data visualization](/learn/big-data/big-data-visualization/).

## Real-time time series graphs

A real-time time series graph adds new readings as they arrive. Most work the same way:

- New readings are appended at the right-hand end, often in batches (all the readings that came in since the last screen update), rather than redrawing everything for each one.
- A first-in, first-out (FIFO) buffer of fixed length keeps memory steady: once it is full, each new reading pushes out the oldest, and the graph shows a moving window such as the last hour or the last 21 days.
- The x-axis scrolls to follow the newest reading, unless the user has zoomed in or paused to look at something.
- The y-axis usually has a fixed range when readings are compared with limits, and an automatic range when the level wanders.

A scrolling real-time graph of measurements is also called a [strip chart](/learn/real-time/strip-chart/), after the paper recorders that drew one. Process control screens and telemetry displays are built from them; see the guides to [HMI and SCADA](/learn/applications/hmi-scada/) and [telemetry](/learn/applications/telemetry/).

## Time series graph vs line chart vs strip chart vs candlestick chart

A time series graph is a line chart whose x-axis is time; a strip chart is one that scrolls with live data, and a candlestick chart summarises each period of prices in one bar.

| | Time series graph | [Line chart](/learn/chart-types/cartesian/line-chart/) | [Strip chart](/learn/real-time/strip-chart/) | [Candlestick chart](/learn/chart-types/cartesian/candlestick-chart/) |
| --- | --- | --- | --- | --- |
| x-axis | Dates and times | Any ordered quantity: time, distance, frequency | Time, as a moving window | Time, in equal bars (minute, day) |
| Points | Every reading, or one per bucket | One per x value | Every reading as it arrives | Four per bar: open, high, low, close |
| Best for | Trends, seasonality, events and gaps over any span | Comparing a few series against one x-axis | Watching live signals and recent history | Prices, where the range within each bar matters |
| Live? | Either | Usually static | Always | Either; the last bar updates live |
| Choose it when | You want to read patterns in measurements over time | The x-axis isn't time, or you are comparing a few series | You need to watch readings as they happen | Each period's opening, closing and range matter, as with prices |

For a tiny time series in a table or a dashboard tile, with no axes, use a [sparkline](/learn/chart-types/cartesian/sparkline/).

## Common time series graph mistakes

Most mistakes read a pattern into too little data, or draw something the data doesn't contain, such as a line across a gap.

- **Calling a trend from less than one cycle.** Sales that rise from Monday to Wednesday, in a business that peaks every midweek, are the weekly cycle at work. Compare like with like: the same weekday, the same month last year, or a moving average one season long.
- **Comparing unlike periods.** A week with a public holiday, a 28-day February against a 31-day March, or a 23-hour daylight-saving day all look like changes in demand. Note them on the graph, or compare daily averages instead of totals.
- **A y-axis range chosen to dramatise.** A line graph doesn't have to start at zero, but a narrow range makes a 1% wiggle look like a crash. Pick a range that fits the changes that matter, and label it clearly.
- **The wrong aggregate.** A monthly average of a cable's hourly load says nothing about the peak it must carry, and adding up hourly temperatures gives a number with no meaning.
- **Mixed time zones.** Two series, one stamped in UTC and one in local time, put cause after effect by several hours.
- **Too many lines on one chart.** Past about five, use small multiples, a heatmap or a selector instead.
- **A chart too tall or too wide.** Slopes are easiest to compare when the important segments sit at about 45 degrees (Cleveland's "banking to 45°"). A tall narrow chart turns every change into a cliff; a long flat one hides them.
- **Smoothing without saying so.** A heavy moving average hides real spikes. Name the window in the legend and draw the raw data faintly behind the smoothed line.

## How to make a time series graph in JavaScript, React or Angular

In Excel, you select a date column and a value column and insert a line chart with a date axis; this section builds a time series graph in code instead. The demo holds the 2,016 readings of building power demand from this guide (21 days at 15-minute intervals), breaks the line where readings are missing, and in live mode appends each new reading while the oldest drops out of the window.

Switch the **Components** on and off (**Trend**, **Daily and weekly cycle**, **Noise and outliers**, **Level shift**, **Outages**) to build the series up part by part. Set **At gaps** to join the points and watch a straight line cross the shaded outage on 10 March. Drag the **Moving average** slider to 24 h to flatten the daily cycle, and switch from **trailing** to **centred** to see the lag at the retrofit disappear. Press **Go live** to append readings in real time: each new reading pushes the oldest out of the 21-day window. Zoom in time with the mouse wheel, drag to pan, double-click for the whole window, and hover to read a value.

<LiveDocSnippet maxWidth={'100%'} height={600} name="./Basic/demo" />

<LearnCta position="top" chart="time series chart" demo="chart-realtime-performance-demo" demoLabel="real-time line chart" docs="/2d-charts/axis-api/axis-types/date-time-numeric-axis/" docsLabel="SciChart.js date-time axis documentation" />

Here is the code for this time series explorer. The meter simulation and the HTML controls are plain JavaScript; SciChart.js draws the date-time axis, the readings with their gaps, the moving average and the annotations.

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
        EXyDirection,
        ELineDrawMode,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    const WINDOW_READINGS = 21 * 96; // 21 days of 15-minute readings

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // x values are Unix timestamps in seconds; labels are in UTC and adapt as you zoom
        sciChartSurface.xAxes.add(
            new DateTimeNumericAxis(wasmContext, { axisTitle: "Time (UTC)", autoRange: EAutoRange.Always })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Power demand (kW)", growBy: new NumberRange(0.1, 0.1) })
        );
        // A missing reading is NaN; the FIFO keeps only the newest WINDOW_READINGS
        const dataSeries = new XyDataSeries(wasmContext, {
            fifoCapacity: WINDOW_READINGS,
            isSorted: true,
            containsNaN: true
        });
        const { times, values } = getYourTimeSeries(); // e.g. from your API or database
        dataSeries.appendRange(times, values);
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries,
                stroke: "#50C7E0",
                strokeThickness: 1.5,
                drawNaNAs: ELineDrawMode.DiscontinuousLine // break the line at gaps
            })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        // Live: append each batch of new readings; the oldest drop out of the window
        const unsubscribe = subscribeToYourReadings((newTimes: number[], newValues: number[]) =>
            dataSeries.appendRange(newTimes, newValues)
        );
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return { sciChartSurface };
    };

    // SciChartReact creates the chart, sizes it and cleans it up
    export const TimeSeriesGraph = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 480 }} />;
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
        EXyDirection,
        ELineDrawMode,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    const WINDOW_READINGS = 21 * 96; // 21 days of 15-minute readings

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // x values are Unix timestamps in seconds; labels are in UTC and adapt as you zoom
        sciChartSurface.xAxes.add(
            new DateTimeNumericAxis(wasmContext, { axisTitle: "Time (UTC)", autoRange: EAutoRange.Always })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Power demand (kW)", growBy: new NumberRange(0.1, 0.1) })
        );
        // A missing reading is NaN; the FIFO keeps only the newest WINDOW_READINGS
        const dataSeries = new XyDataSeries(wasmContext, {
            fifoCapacity: WINDOW_READINGS,
            isSorted: true,
            containsNaN: true
        });
        const { times, values } = getYourTimeSeries(); // e.g. from your API or database
        dataSeries.appendRange(times, values);
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries,
                stroke: "#50C7E0",
                strokeThickness: 1.5,
                drawNaNAs: ELineDrawMode.DiscontinuousLine // break the line at gaps
            })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        // Live: append each batch of new readings; the oldest drop out of the window
        const unsubscribe = subscribeToYourReadings((newTimes: number[], newValues: number[]) =>
            dataSeries.appendRange(newTimes, newValues)
        );
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return { sciChartSurface };
    };

    @Component({
        selector: "app-time-series-graph",
        standalone: true,
        imports: [ScichartAngularComponent],
        // scichart-angular creates the chart, sizes it and cleans it up
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 480px"></scichart-angular>`
    })
    export class TimeSeriesGraphComponent {
        initChart = initChart;
    }
    ```
</CodeSnippetBlock>

Key points:

- `DateTimeNumericAxis` takes Unix timestamps in seconds and labels them in UTC, switching between years, months, days, hours and seconds as you zoom. For microsecond or nanosecond data, its label provider's `datePrecision` and `dateOffset` options keep the labels exact.
- Missing readings are stored as `NaN` in an `XyDataSeries` with `containsNaN: true`. `drawNaNAs: ELineDrawMode.DiscontinuousLine` breaks the line there; `ELineDrawMode.PolyLine` would join the points either side.
- For live data, `fifoCapacity` fixes the number of readings kept, and `appendRange` adds each batch; the oldest readings drop out automatically.
- `XyMovingAverageFilter` adds a trailing moving average that updates as data is appended. The demo computes its own average instead, so it can skip missing readings and offer a centred window. A `BoxAnnotation` shades each outage, and a `VerticalLineAnnotation` marks the retrofit.

**See it in the demo app:** [JavaScript real-time line chart](https://www.scichart.com/demo/javascript/chart-realtime-performance-demo) · [React real-time line chart](https://www.scichart.com/demo/react/chart-realtime-performance-demo) · [Angular real-time line chart](https://www.scichart.com/demo/angular/chart-realtime-performance-demo). Related techniques: the [React zoom and pan of a real-time chart](https://www.scichart.com/demo/react/zoom-pan-realtime-javascript-chart), [React vertically stacked axes](https://www.scichart.com/demo/react/vertically-stacked-axes), [React synchronised multiple charts](https://www.scichart.com/demo/react/sync-multi-chart) and [React chart with one million points](https://www.scichart.com/demo/react/chart-performance-load-one-million-points).

**Go deeper:** [SciChart.js date-time axis documentation](/2d-charts/axis-api/axis-types/date-time-numeric-axis/), the [discontinuous date axis](/2d-charts/axis-api/axis-types/discontinuous-date-axis/) for data with closed hours, [real-time updates](/2d-charts/chart-types/data-series-api/realtime-updates/), [resampling](/2d-charts/chart-types/data-series-api/resampling/), the [moving average filter](/2d-charts/chart-types/data-filters-api/moving-average-filter/) and [vertically stacked axes](/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout/). For the industries that chart time series at scale, see SciChart for [HMI and SCADA](https://www.scichart.com/scada-big-data/) and [instrumentation](https://www.scichart.com/best-instrumentation-engineering-software/).

## Frequently asked questions

### What is a time series graph?

A time series graph is a graph of one or more measurements recorded over time, with time on the horizontal axis and the measured value on the vertical axis. The points are plotted in time order and usually joined by a line, so the reader can see the trend, repeating cycles, sudden changes and unusual values.

### What is the difference between a time series graph and a line graph?

A time series graph is a line graph whose x-axis is time. Every time series graph can be drawn as a line graph, but a line graph can also show a value against distance, frequency or any other ordered quantity. A time series graph adds the concerns that come with time: date and time labels, time zones, uneven sampling, gaps in the record and aggregation into hours, days or months.

### What are the components of a time series?

A time series is usually described as a trend (the long-run rise or fall), seasonality (a pattern that repeats over a fixed period such as a day, week or year), cycles (rises and falls with no fixed period) and the remainder or noise (irregular variation). Level shifts, outliers and gaps are not components, but a reader should look for them too.

### How do you describe a time series graph?

State what was measured, over what period and how often, then describe the trend with a rate, the repeating pattern with its period and size, any sudden changes with their dates, and any outliers or gaps. For example: over three weeks, demand rose by about 0.6 kW a day, peaked at around 90 kW every weekday afternoon, and dropped by about 12 kW on 15 March.

### Should you join the points across a gap in a time series graph?

No. A line drawn straight across a gap shows values that were never measured, and it can hide a peak or a dip that happened while no data was recorded. Break the line where data is missing, and mark long gaps with a shaded band or a note so readers know the record is incomplete.

### How do I make a time series graph in JavaScript?

Store each time as a Unix timestamp and plot the values against a date-time axis. With SciChart.js, use a `DateTimeNumericAxis` for x, an `XyDataSeries` for the values with `NaN` for missing readings, and a `FastLineRenderableSeries` with `drawNaNAs` set to `DiscontinuousLine` so gaps show as breaks. For live data, set `fifoCapacity` and call `appendRange` as readings arrive. The same code works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- NIST/SEMATECH, [e-Handbook of Statistical Methods, section 6.4: Introduction to Time Series Analysis](https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc4.htm). Autocorrelation, trend and seasonal variation, and moving averages and smoothing.
- Hyndman, R. J. and Athanasopoulos, G. (2021), *Forecasting: Principles and Practice*, 3rd edition, OTexts: [section 2.3, Time series patterns](https://otexts.com/fpp3/tspatterns.html) (trend, seasonal and cyclic patterns) and [chapter 3, Time series decomposition](https://otexts.com/fpp3/decomposition.html) (additive and multiplicative decomposition, moving averages).
- Cleveland, W. S., McGill, M. E. and McGill, R. (1988), [The Shape Parameter of a Two-Variable Graph](https://doi.org/10.1080/01621459.1988.10478598). *Journal of the American Statistical Association*, 83(402), 289–300. Banking to 45°.
- IANA, [Time Zone Database](https://www.iana.org/time-zones). The zone names and daylight saving rules used by most software.
- ISO, [ISO 8601 date and time format](https://www.iso.org/iso-8601-date-and-time-format.html). The year-month-day notation.
- MDN Web Docs, [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). JavaScript time values as milliseconds since 1 January 1970 UTC.

<LearnCta position="bottom" chart="time series chart" demo="chart-realtime-performance-demo" demoLabel="real-time line chart" docs="/2d-charts/axis-api/axis-types/date-time-numeric-axis/" docsLabel="SciChart.js date-time axis documentation" />
