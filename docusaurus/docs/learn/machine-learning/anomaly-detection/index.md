---
sidebar_position: 20
sidebar_label: Anomaly Detection
title: "Anomaly Detection: Algorithms and How to Spot Anomalies in Time Series Data (With a Live Example)"
description: "What anomaly detection is, the three types of anomaly, how z-scores, the IQR rule, LOF and isolation forest work, how to handle seasonality in time series, and how to measure a detector. With a live example."
keywords:
    [
        "anomaly detection",
        "anomaly detection algorithms",
        "what is anomaly detection",
        "anomaly detection machine learning",
        "isolation forest",
        "isolation forest anomaly detection",
        "time series anomaly detection",
        "network anomaly detection",
        "outlier detection",
        "point contextual and collective anomalies",
        "z-score anomaly detection",
        "local outlier factor",
        "seasonal anomaly detection",
        "how to visualise anomalies"
    ]
image: /img/learn/anomaly-detection-og.png
related: [time-series-graph, strip-chart, roc-curve, k-means-clustering]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is anomaly detection in simple terms?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Anomaly detection means finding the readings, events or records that don't fit the usual pattern of the data: a sudden spike from a sensor, a card payment unlike the owner's others, or a burst of network traffic at 3 a.m. A detector learns what normal looks like, gives every new point a score for how unusual it is, and raises an alert when the score passes a threshold." }
                },
                {
                    "@type": "Question",
                    "name": "What are the three types of anomalies?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Point anomalies are single values far from all the others, such as one reading of 90 among readings near 50. Contextual anomalies are values that are normal in general but wrong for their context, such as a daytime power level at 2 a.m. Collective anomalies are runs of values that are each normal on their own but abnormal together, such as a day on which a machine's usual daily cycle never happens." }
                },
                {
                    "@type": "Question",
                    "name": "How does isolation forest detect anomalies?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An isolation forest builds about 100 random trees, each from a random sample of 256 points. Every tree keeps cutting the data on a random feature at a random value until each point is alone. Anomalies are few and far from the rest, so they end up alone after only a few cuts. The anomaly score is 2 to the power of minus the average path length divided by c(n), the average path length expected for n points: scores near 1 mark anomalies, and scores of about 0.5 or below are normal." }
                },
                {
                    "@type": "Question",
                    "name": "Which anomaly detection algorithm is best?",
                    "acceptedAnswer": { "@type": "Answer", "text": "No single algorithm is best. For one variable, start with a robust z-score or the IQR rule. For time series with daily or weekly cycles, compare each reading with a seasonal baseline or a forecast and flag large residuals. For several features without labels, isolation forest is a fast, strong default, and local outlier factor suits data with clusters of different density. Choose by measuring precision and recall on labelled past incidents." }
                },
                {
                    "@type": "Question",
                    "name": "How do you detect anomalies in time series data?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Remove the parts of the series you can predict, then look for large leftovers. Model the trend and the daily or weekly seasonality, with a seasonal baseline, a decomposition such as STL or a forecasting model, and compute the residual: the reading minus what was expected. Scale the residual by a robust measure of its usual spread and flag values beyond a threshold, using only past data so the detector works live." }
                },
                {
                    "@type": "Question",
                    "name": "How do I build a real-time anomaly detection chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Score each new reading as it arrives, using only earlier readings, then append it to the chart. Draw the signal as a line series, the detector's expected range as a band series, flagged readings as red scatter markers and known incidents as shaded box annotations. A second chart shows the anomaly score with a draggable threshold line. SciChart.js does this with FastLineRenderableSeries, FastBandRenderableSeries and XyScatterRenderableSeries, in plain JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# Anomaly Detection

## What is anomaly detection?

**Anomaly detection** (also called outlier detection) is the task of finding data points, events or patterns that differ from the expected behaviour of the rest of the data. A detector learns what normal looks like, scores each new observation for how unusual it is, and flags those whose score passes a threshold. It is used to catch faults, fraud and intrusions early.

![A live anomaly detection dashboard in a dark navy theme: a streaming power reading with a daily cycle, a yellow band showing the expected range from a seasonal baseline, red markers on readings flagged as anomalous, and grey shaded boxes labelled spike and level shift marking the injected anomalies; below it, the anomaly score over time with a dashed red threshold line; on the right, an isolation forest anomaly-score heatmap with recent readings plotted on two features](/img/learn/anomaly-detection-og.png)

*A streaming sensor signal checked by a seasonal-baseline detector, with its anomaly score and an isolation forest view (simulated data). [Try the interactive version](#how-to-build-a-real-time-anomaly-detection-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- Anomalies come in three types: single odd points, values that are wrong for their context, and runs of values that are only odd together.
- Every detector is a model of normal, a score and a threshold. The threshold sets the balance between missed incidents and false alarms.
- On time series, remove the trend and the seasonality first and test what is left, or the daily cycle will swamp everything else.
- Isolation forest finds anomalies by how quickly random cuts separate them from the rest, with no distance or density calculations.
- Measure a detector with precision and recall on labelled incidents, and check whole incidents caught as well as single points.
:::

## Types of anomalies: point, contextual and collective

The classic survey by Chandola, Banerjee and Kumar sorts anomalies into three types. The type decides which detectors can see it at all.

![Three small time series charts. Left: a noisy flat signal with one reading far above the rest, circled as a point anomaly. Middle: a daily cycle where a short stretch at night sits at the usual midday level, circled as a contextual anomaly. Right: a daily cycle where one whole day stays flat, shaded as a collective anomaly whose readings are each in the normal range](./anomaly-types.svg)

| Type | What it is | Example | What can find it |
| --- | --- | --- | --- |
| Point anomaly | One value far from all the others | A temperature sensor reads 140 °C once among readings near 60 °C | Almost any detector, even a fixed limit |
| Contextual anomaly | A value that is normal in general but wrong for when or where it occurs | A building's daytime power draw at 2 a.m.; a warm day in winter | A detector that knows the context, such as a seasonal baseline |
| Collective anomaly | A run of values, each normal alone, that is abnormal as a group | A day on which a pump never cycles; a flat-lined ECG trace; a steady trickle of small data transfers | Detectors that look at windows or patterns, not single values |

A **level shift**, where the series jumps to a new level and stays there, and a slow **drift**, where it creeps away from normal, are common collective cases in sensor data. Drift is the hardest to catch, because each step is tiny and a detector that keeps relearning normal can relearn the drift with it.

## How anomaly detection works

Every detector has three parts:

1. A model of normal, learned from past data: a mean and standard deviation, a seasonal profile, the density of nearby points, or a forecast.
2. An **anomaly score** for each new point: how far it sits from that model.
3. A **threshold** on the score. Points above it raise an alert.

Detectors also differ in how much labelled data they need:

| Setting | Training data | Typical use |
| --- | --- | --- |
| Unsupervised | Unlabelled data, assumed to be mostly normal | Sensor monitoring, log and network data, first look at a new dataset |
| Semi-supervised | Data known to be normal only | Machines with a clean commissioning period; "learn normal, flag the rest" |
| Supervised | Labelled normal and anomalous examples | Fraud with confirmed chargebacks; known fault types. It is really classification with rare positives |

Most real systems are unsupervised or semi-supervised, because anomalies are rare, varied and often new. Labels are still worth collecting, because they are the only way to measure and tune a detector.

## Anomaly detection algorithms

### Statistical methods: z-score, robust z-score and the IQR rule

The **z-score** measures how many standard deviations a value sits from the mean:

$$
z = \frac{x - \bar{x}}{s}
$$

A common rule flags $|z| > 3$. It works for one roughly normal variable with plenty of data, but the mean and standard deviation are themselves pulled by the outliers they are meant to find. Take ten readings: 20, 21, 19, 22, 20, 21, 35, 20, 19, 21. The mean is 21.8 and the standard deviation 4.73, so the 35 has a z-score of only 2.79 and passes a 3-sigma test, because the 35 itself has inflated the standard deviation. With ten points, no value can have a z-score above $(n-1)/\sqrt{n} = 2.85$, as the NIST handbook points out.

The **robust z-score** (or modified z-score) of Iglewicz and Hoaglin uses the median and the **median absolute deviation** (MAD) instead, which a few outliers barely move:

$$
M = \frac{0.6745\,(x - \tilde{x})}{\text{MAD}}
$$

For the ten readings the median is 20.5 and the MAD is 0.5, so the 35 scores 19.6, far past the usual cut-off of 3.5. The factor 0.6745 makes $M$ comparable with an ordinary z-score for normal data; equivalently, 1.4826 × MAD estimates the standard deviation.

The **IQR rule** behind the [box plot](/learn/chart-types/cartesian/box-plot/) uses quartiles. With Q1 = 20 and Q3 = 21, the interquartile range is 1, the inner fences are at Q1 − 1.5 × IQR = 18.5 and Q3 + 1.5 × IQR = 22.5, and the outer fences at 17 and 24. The NIST handbook calls a point beyond an inner fence a mild outlier and one beyond an outer fence an extreme outlier, so 35 is extreme.

On a stream, these statistics are computed over a **rolling window** of recent readings. That adapts to slow changes, but it also adapts to the anomaly: a level shift looks odd for a few readings, then becomes the new normal.

### Distance and density methods: k-nearest neighbours and LOF

When there are several features, "far from the rest" needs a distance. The **k-nearest-neighbour (k-NN) distance** score is the distance from a point to its k-th nearest neighbour: points in empty regions score high. It is simple and works in any number of dimensions, but one global threshold struggles when the normal data has a tight cluster and a loose one, because a normal point in the loose cluster is further from its neighbours than an anomaly near the tight one.

The **local outlier factor** (LOF) of Breunig and colleagues fixes that by comparing each point's local density with the density around its neighbours. An LOF near 1 means the point is as dense as its surroundings; well above 1 means it sits in a sparser patch than its neighbours. Both methods need distances to many points, so they slow down on large datasets unless you use an index, and both depend on scaling the features first.

### Isolation forest

An **isolation forest** (Liu, Ting and Zhou, 2008) turns the problem round. Instead of modelling normal points, it measures how easy each point is to isolate. Each tree takes a random sample of the data and keeps cutting it, on a randomly chosen feature at a random value between that feature's minimum and maximum, until every point sits alone or a depth limit is reached. A point far from the rest ends up alone after a few cuts; a point inside a dense cluster needs many.

![Left: a cluster of about sixty readings in a two-feature space and one reading far to the upper right, with a vertical cut numbered 1 and a horizontal cut numbered 2 that box the far reading on its own, while grey dashed cuts show the many cuts needed for a reading in the middle of the cluster. Right: the same cuts as a tree, with the anomaly reached at depth 2 and the cluster reading at about depth 9, and the score formula](./isolation-forest-splits.svg)

The anomaly score averages the path length $h(x)$ over the trees and normalises it by $c(n)$, the average path length of an unsuccessful search in a binary search tree of $n$ points:

$$
s(x, n) = 2^{-\,E[h(x)]\,/\,c(n)}, \qquad c(n) = 2H(n-1) - \frac{2(n-1)}{n}
$$

where $H(i) \approx \ln(i) + 0.5772$ is the harmonic number. A point whose average path equals $c(n)$ scores exactly 0.5. Scores close to 1 mark anomalies; if every point scores around 0.5, the data has no clear anomalies.

A worked example with the paper's default sample size of 256: $c(256) = 2(\ln 255 + 0.5772) - 2 \times 255/256 = 10.24$. A point isolated after 2.5 cuts on average scores $2^{-2.5/10.24} = 0.84$, a likely anomaly. A point that needs 14 cuts scores $2^{-14/10.24} = 0.39$, a normal one.

Why isolation forest is widely used:

- It is fast. Training needs only a small sample per tree (256 points and 100 trees are the paper's defaults), and scoring a point is one walk down each tree, so the cost grows linearly with the data.
- It needs no distance measure, so features on different scales cause less trouble than in k-NN or LOF.
- Its trees are shallow, with depth capped at $\lceil \log_2 256 \rceil = 8$, because anomalies are found near the top. A leaf that still holds several points adds $c(\text{size})$ to the path, an estimate of the cuts left.

It has two weaknesses. Every cut is parallel to an axis, which leaves stripes in the score map, and it sees only the features you give it. On a raw sensor value it can't find a contextual anomaly, because a daytime value at night is a perfectly ordinary number. Give it a seasonal residual as a feature, as the live demo does, and it can.

### Other anomaly detection methods

- One-class SVM: learns a boundary around the normal data in a kernel feature space. Good on small, clean training sets; slower and more sensitive to its settings than isolation forest.
- Autoencoders and other neural networks: trained to rebuild normal data, they flag inputs they rebuild badly. Suited to images, audio and many correlated sensors, with enough normal data to train on.
- Forecasting models: predict the next value (seasonal naive, exponential smoothing, ARIMA or a neural forecaster) and flag large forecast errors. The standard approach for single time series.
- Clustering: points far from every cluster centre, or in tiny clusters, are candidates. k-means gives a quick version.
- Control charts: Shewhart, CUSUM and EWMA charts from statistical process control. CUSUM and EWMA accumulate small deviations, so they catch slow drifts that point tests miss.

## Anomaly detection algorithms compared: which to use

| Method | Data it suits | Anomaly types it finds | Strengths | Watch out for |
| --- | --- | --- | --- | --- |
| Fixed limits | One variable with known safe limits | Point | Simple, explainable, required by many standards | Misses anything inside the limits |
| z-score (rolling) | One variable, roughly normal, no strong cycles | Point | Simple and fast on a stream | Outliers inflate the standard deviation; a daily cycle causes false alarms |
| Robust z-score, IQR rule | One variable, skewed or with outliers | Point | Resistant to the outliers it is looking for | Still blind to context and seasonality |
| Seasonal baseline or forecast residual | Time series with daily or weekly cycles | Point, contextual, many collective | Uses the pattern of normal; band is easy to show | Needs several cycles of history; anomalies in the history leak into the baseline |
| CUSUM, EWMA | Process data with a stable target | Drift, small level shifts | Catches small persistent changes | Needs a target and reset rules |
| k-NN distance, LOF | Several features, moderate size | Point, local outliers in clusters | No distribution assumed; LOF handles uneven density | Slow on big data; needs scaled features |
| Isolation forest | Several features, large or streaming data | Point, and others if given the right features | Fast, few settings, strong default | Axis-parallel cuts; only as good as its features |
| Autoencoder | Many correlated signals, images, audio | Collective, complex patterns | Learns structure no rule captures | Needs lots of clean data; hard to explain an alert |

A sensible order is to start with the simplest method that matches the anomaly type, measure it on past incidents, and move to a more complex model only when the measurements show the simple one misses things that matter.

## Time series anomaly detection

Most real anomaly detection runs on time series: sensor readings, server metrics, transactions per minute. Time adds three problems that a plain outlier test ignores.

- Seasonality. Many series repeat daily or weekly. A reading of 64 kW is normal at noon and an anomaly at 2 a.m. A threshold on the raw value either floods you with alarms at every peak or is set so high that it misses the night-time fault.
- Trend and drift. The level changes over weeks, so last month's mean is the wrong yardstick today.
- Correlation between neighbours. Readings close in time are alike, so one fault spans many points, and a test that assumes independent points sees each of them as a separate event.

The standard answer is to predict what each reading should be, subtract, and test the **residual**: the reading minus its expected value. Ways to get the expected value, from simplest to most involved:

1. Seasonal baseline: the median of the readings at the same time of day over the last several days. The median keeps one bad day out of the baseline.
2. Decomposition: STL (Cleveland and colleagues, 1990) splits a series into trend, seasonal and remainder parts; the remainder is the residual. See [what a time series graph shows](/learn/real-time/time-series-graph/) for trend, seasonality and noise.
3. Forecasting: a model fitted on the past predicts each new reading, and the forecast error is the residual. Hyndman and Athanasopoulos cover the methods and how to check residuals in *Forecasting: Principles and Practice*.

Then scale the residual by a robust measure of its usual spread, such as 1.4826 × MAD on a period you trust, and apply a threshold. Two rules keep it honest on live data: compute every score from earlier readings only, and keep the spread estimate free of the anomalies it should find. In the demo, estimating the spread on a rolling week that contains a drift and a flat day almost doubles it, and the detector goes quiet exactly when it is needed.

### Network anomaly detection

Network anomaly detection follows the same pattern on traffic data: bytes, connections and failed logins per minute, which have strong daily and weekly cycles. A seasonal baseline per host or service catches the burst at 3 a.m., and features such as the number of distinct destinations feed an isolation forest for patterns a single counter can't show.

## How to evaluate an anomaly detector

An anomaly detector is a classifier with very rare positives, so accuracy is useless: a detector that never fires is 99% accurate when 1% of readings are anomalous. Use the confusion matrix instead:

- Precision: of the readings flagged, the share that were real anomalies. Low precision means **alert fatigue**: operators learn to ignore the alarm.
- Recall: of the real anomalous readings, the share that were flagged. Low recall means missed incidents.
- F1, the harmonic mean of the two, when you need one number.

Raising the threshold trades recall for precision. To compare detectors across all thresholds, draw a precision-recall curve rather than a [ROC curve](/learn/machine-learning/roc-curve/): with rare anomalies, the false positive rate on a ROC curve hides thousands of false alarms.

Time series need one more step. A level shift that lasts 216 readings and triggers an alert on 150 of them counts as 66 misses, though the operator was warned. Report event-level recall too (how many incidents got at least one alert, and how soon) alongside point-level precision. Be wary of "point-adjusted" scores that mark a whole incident as found if any point in it is flagged: Kim and colleagues showed that under that protocol even random scores can match published detectors.

The live demo shows these numbers for the 14 streamed days, against seven injected anomalies (665 anomalous readings out of 2,016), at each detector's default threshold:

| Detector (default threshold) | Precision | Recall (readings) | Incidents caught | What it misses |
| --- | --- | --- | --- | --- |
| Rolling z-score over 6 hours (3) | 23% | 2% | 5 of 7 | The contextual anomaly and the flat day; most false alarms come from the daily cycle |
| Seasonal baseline residual (3.5) | 99% | 61% | 7 of 7 | The first two-thirds of the drift and the hours when the flat day crosses the normal cycle |
| Isolation forest on two features (0.6) | 86% | 43% | 7 of 7 | Nearly all of the drift, which grows too slowly to stand out from the readings the forest is trained on |

None of them finds the drift early. That job belongs to a CUSUM or EWMA chart, or to comparing against a fixed reference period.

## How to visualise anomalies

A chart is often where an alert is checked, so the visual matters as much as the algorithm:

- The signal as a line, with the detector's expected range as a shaded band. Readers see at once whether a point is outside the band, and whether the band itself looks sensible.
- Flagged points as markers in a strong colour, drawn on top of the line, so a single flagged reading in a week of data is still visible.
- Known incidents or maintenance windows as shaded boxes behind the data, with short labels.
- The anomaly score on its own chart below, sharing the time axis, with the threshold as a horizontal line. Dragging that line is the quickest way to see what a different threshold would flag.
- For two features, a scatter plot over a [heatmap](/learn/chart-types/cartesian/heatmap/) of the score shows where the detector draws its boundary. For many sensors, a heatmap of scores (sensors as rows, time as columns) shows which ones misbehave together.
- For live data, a scrolling [strip chart](/learn/real-time/strip-chart/) that keeps the last hours or days in view.

## Where anomaly detection is used

- Industrial and sensor monitoring: vibration, temperature, pressure and power on pumps, motors and production lines, as part of condition monitoring. See the [vibration analysis guide](/learn/applications/vibration-analysis/), how alarm limits work on [HMI and SCADA trend charts](/learn/applications/hmi-scada/), and SciChart for [HMI and SCADA](https://www.scichart.com/scada-big-data/) and [instrumentation](https://www.scichart.com/best-instrumentation-engineering-software/) software.
- Fraud detection: card payments, insurance claims and account logins that don't match a customer's history.
- Network and IT security: intrusion detection, unusual traffic, and server metrics such as latency and error rates.
- Manufacturing quality: defects in measurements from test and inspection equipment.
- Medicine and life sciences: unusual readings in patient monitoring or lab instruments. This page explains how detectors work and how their output is charted; it is not clinical guidance.
- Finance and business metrics: sudden changes in sales, sign-ups or costs.

## Common anomaly detection mistakes

- **Fixed thresholds on non-stationary data.** A limit set last month is wrong after the process drifts or the season changes. Test residuals from a model of the current level, not raw values.
- **Ignoring seasonality.** A rolling z-score on a daily cycle flags every steep rise as an anomaly and misses a normal-looking value at the wrong hour. In the demo it scores 23% precision and catches neither the contextual anomaly nor the flat day.
- **Letting anomalies into the baseline.** A mean and standard deviation, or a forest retrained on yesterday's fault, learn the fault as normal. Use medians and MAD, exclude flagged points or known incidents, or fit on a clean reference period.
- **Alert fatigue.** Hundreds of alerts a day get ignored. Merge consecutive flags into one incident, require a few readings in a row, add a cool-down, and tune the threshold on precision as well as recall.
- **Judging on accuracy or a handful of points.** With rare anomalies, accuracy is meaningless. Use precision, recall and incidents caught on as many labelled incidents as you can get.
- **Using the future.** Centred moving averages and decompositions fitted on the whole series use readings that wouldn't exist yet in a live system, so offline results look better than live ones. Score each point from earlier data only.
- **Unscaled features.** Distance methods let the feature with the biggest units dominate. Standardise features, preferably with robust statistics.
- **Never showing the data.** A score without a chart of the signal and its expected range is hard to trust and hard to debug.

## How to build a real-time anomaly detection chart in JavaScript, React or Angular

Monitoring dashboards stream thousands of readings per sensor and redraw several times a second. SciChart.js draws with WebGL, so the signal, the band, the flags and the score chart stay smooth as data streams in, and the threshold can be dragged while the whole history is re-scored. The demo simulates 28 days of a power reading every 10 minutes: 14 days of clean history to learn from, then 14 streamed days with seven injected anomalies. All three detectors, including a 100-tree isolation forest retrained every simulated day, run in the browser.

Choose a **Detector**: a rolling z-score over the last 6 hours, a seasonal baseline (the median of the same time on the previous 7 days, scaled by the MAD of the history), or an isolation forest on two features. Move the **Threshold** slider, or drag the dashed red line on the score chart, and the flags, the band and the precision and recall readout update at once. **Speed** sets how fast the days stream, **Pause** stops the stream so you can zoom and pan, and **Restart** plays it again. The chart on the right shows the isolation forest's score as a heatmap over its two features, with the last 7 days of readings on top and the newest one ringed. Scroll to zoom, drag to pan, double-click to reset, and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={780} name="./Basic/demo" />

<LearnCta position="top" chart="anomaly detection chart" demo="chart-realtime-performance-demo" demoLabel="real-time line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for this chart. The detectors, including the isolation forest, are plain JavaScript with no machine learning library; SciChart.js draws the signal, the band, the flags, the score and the heatmap.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        FastLineRenderableSeries,
        FastBandRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        XyyDataSeries,
        LegendModifier,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Seasonal baseline detector: expected value = median of the same time on the previous 7 days;
    // score = |reading - expected| / robust spread. Uses only earlier readings, so it also works live.
    const median = (v: number[]) => {
        const s = [...v].sort((a, b) => a - b);
        const m = s.length >> 1;
        return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
    };
    const detect = (values: number[], perDay: number, threshold: number) => {
        const expected: number[] = [];
        const residuals: number[] = [];
        for (let i = 7 * perDay; i < values.length; i++) {
            const sameTime = [1, 2, 3, 4, 5, 6, 7].map((d) => values[i - d * perDay]);
            expected.push(median(sameTime));
            residuals.push(values[i] - expected[expected.length - 1]);
        }
        const mid = median(residuals);
        const spread = 1.4826 * median(residuals.map((r) => Math.abs(r - mid))); // robust standard deviation
        const flagged = residuals.map((r) => Math.abs(r) / spread > threshold);
        return { start: 7 * perDay, expected, spread, flagged };
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (days)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Reading", growBy: new NumberRange(0.1, 0.1) }));

        const { times, values, perDay } = getYourSensorData(); // evenly spaced readings, perDay readings a day
        const k = 3.5;
        const { start, expected, spread, flagged } = detect(values, perDay, k);
        const x = times.slice(start);
        const flagX = x.filter((_, i) => flagged[i]);
        const flagY = values.slice(start).filter((_, i) => flagged[i]);
        sciChartSurface.renderableSeries.add(
            new FastBandRenderableSeries(wasmContext, {
                dataSeries: new XyyDataSeries(wasmContext, {
                    xValues: x,
                    yValues: expected.map((e) => e + k * spread),
                    y1Values: expected.map((e) => e - k * spread),
                    dataSeriesName: "Expected range"
                }),
                fill: "#F5E66322",
                fillY1: "#F5E66322",
                stroke: "#F5E66388",
                strokeY1: "#F5E66388"
            }),
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: times, yValues: values, dataSeriesName: "Reading" }),
                stroke: "#50C7E0"
            }),
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: flagX, yValues: flagY, dataSeriesName: "Flagged" }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 8, height: 8, fill: "#FF4D4D", stroke: "#FFFFFF" })
            })
        );
        sciChartSurface.chartModifiers.add(
            new LegendModifier({ showCheckboxes: false }),
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const AnomalyDetectionChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 450 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        FastLineRenderableSeries,
        FastBandRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        XyyDataSeries,
        LegendModifier,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Seasonal baseline detector: expected value = median of the same time on the previous 7 days;
    // score = |reading - expected| / robust spread. Uses only earlier readings, so it also works live.
    const median = (v: number[]) => {
        const s = [...v].sort((a, b) => a - b);
        const m = s.length >> 1;
        return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
    };
    const detect = (values: number[], perDay: number, threshold: number) => {
        const expected: number[] = [];
        const residuals: number[] = [];
        for (let i = 7 * perDay; i < values.length; i++) {
            const sameTime = [1, 2, 3, 4, 5, 6, 7].map((d) => values[i - d * perDay]);
            expected.push(median(sameTime));
            residuals.push(values[i] - expected[expected.length - 1]);
        }
        const mid = median(residuals);
        const spread = 1.4826 * median(residuals.map((r) => Math.abs(r - mid))); // robust standard deviation
        const flagged = residuals.map((r) => Math.abs(r) / spread > threshold);
        return { start: 7 * perDay, expected, spread, flagged };
    };

    @Component({
        selector: "app-anomaly-detection-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class AnomalyDetectionChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (days)" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Reading", growBy: new NumberRange(0.1, 0.1) }));

            const { times, values, perDay } = getYourSensorData(); // evenly spaced readings, perDay readings a day
            const k = 3.5;
            const { start, expected, spread, flagged } = detect(values, perDay, k);
            const x = times.slice(start);
            const flagX = x.filter((_, i) => flagged[i]);
            const flagY = values.slice(start).filter((_, i) => flagged[i]);
            sciChartSurface.renderableSeries.add(
                new FastBandRenderableSeries(wasmContext, {
                    dataSeries: new XyyDataSeries(wasmContext, {
                        xValues: x,
                        yValues: expected.map((e) => e + k * spread),
                        y1Values: expected.map((e) => e - k * spread),
                        dataSeriesName: "Expected range"
                    }),
                    fill: "#F5E66322",
                    fillY1: "#F5E66322",
                    stroke: "#F5E66388",
                    strokeY1: "#F5E66388"
                }),
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: times, yValues: values, dataSeriesName: "Reading" }),
                    stroke: "#50C7E0"
                }),
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: flagX, yValues: flagY, dataSeriesName: "Flagged" }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 8, height: 8, fill: "#FF4D4D", stroke: "#FFFFFF" })
                })
            );
            sciChartSurface.chartModifiers.add(
                new LegendModifier({ showCheckboxes: false }),
                new CursorModifier({ showTooltip: true }),
                new MouseWheelZoomModifier(),
                new ZoomPanModifier(),
                new ZoomExtentsModifier()
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- The signal is a `FastLineRenderableSeries`. New readings go in with `append`, and the x-axis `visibleRange` moves each tick to keep the last 6 days in view.
- The expected range is a `FastBandRenderableSeries` over an `XyyDataSeries` holding the upper and lower limits; flagged readings are an `XyScatterRenderableSeries` with an `EllipsePointMarker`.
- The score chart's threshold is a `HorizontalLineAnnotation` with `isEditable: true`; its `dragDelta` event moves the slider and re-scores the history. A `SciChartVerticalGroup` lines up the signal and score charts so their time axes match.
- The isolation forest's score map is a `UniformHeatmapRenderableSeries` with a `HeatmapColorMap`, recomputed on a 50 × 50 grid each time the forest is retrained. The injected anomalies are `BoxAnnotation`s with `TextAnnotation` labels.

**See it in the demo app:** [JavaScript real-time line chart](https://www.scichart.com/demo/javascript/chart-realtime-performance-demo) · [React real-time line chart](https://www.scichart.com/demo/react/chart-realtime-performance-demo) · [Angular real-time line chart](https://www.scichart.com/demo/angular/chart-realtime-performance-demo), and for the score map, [JavaScript heatmap chart](https://www.scichart.com/demo/javascript/heatmap-chart) · [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) · [Angular heatmap chart](https://www.scichart.com/demo/angular/heatmap-chart).

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), the [band series documentation](/2d-charts/chart-types/fast-band-renderable-series/) for the expected range, the [uniform heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) for the score map, and the [time series graph guide](/learn/real-time/time-series-graph/). For monitoring software built with SciChart, see SciChart for [HMI and SCADA](https://www.scichart.com/scada-big-data/) and for [instrumentation](https://www.scichart.com/best-instrumentation-engineering-software/).

## Frequently asked questions

### What is anomaly detection in simple terms?

Anomaly detection means finding the readings, events or records that don't fit the usual pattern of the data: a sudden spike from a sensor, a card payment unlike the owner's others, or a burst of network traffic at 3 a.m. A detector learns what normal looks like, gives every new point a score for how unusual it is, and raises an alert when the score passes a threshold.

### What are the three types of anomalies?

Point anomalies are single values far from all the others, such as one reading of 90 among readings near 50. Contextual anomalies are values that are normal in general but wrong for their context, such as a daytime power level at 2 a.m. Collective anomalies are runs of values that are each normal on their own but abnormal together, such as a day on which a machine's usual daily cycle never happens.

### How does isolation forest detect anomalies?

An isolation forest builds about 100 random trees, each from a random sample of 256 points. Every tree keeps cutting the data on a random feature at a random value until each point is alone. Anomalies are few and far from the rest, so they end up alone after only a few cuts. The anomaly score is 2 to the power of minus the average path length divided by c(n), the average path length expected for n points: scores near 1 mark anomalies, and scores of about 0.5 or below are normal.

### Which anomaly detection algorithm is best?

No single algorithm is best. For one variable, start with a robust z-score or the IQR rule. For time series with daily or weekly cycles, compare each reading with a seasonal baseline or a forecast and flag large residuals. For several features without labels, isolation forest is a fast, strong default, and local outlier factor suits data with clusters of different density. Choose by measuring precision and recall on labelled past incidents.

### How do you detect anomalies in time series data?

Remove the parts of the series you can predict, then look for large leftovers. Model the trend and the daily or weekly seasonality, with a seasonal baseline, a decomposition such as STL or a forecasting model, and compute the residual: the reading minus what was expected. Scale the residual by a robust measure of its usual spread and flag values beyond a threshold, using only past data so the detector works live.

### How do I build a real-time anomaly detection chart in JavaScript?

Score each new reading as it arrives, using only earlier readings, then append it to the chart. Draw the signal as a line series, the detector's expected range as a band series, flagged readings as red scatter markers and known incidents as shaded box annotations. A second chart shows the anomaly score with a draggable threshold line. SciChart.js does this with FastLineRenderableSeries, FastBandRenderableSeries and XyScatterRenderableSeries, in plain JavaScript, React or Angular.

## Sources

- Chandola, V., Banerjee, A. and Kumar, V. (2009), [Anomaly detection: a survey](https://doi.org/10.1145/1541880.1541882). *ACM Computing Surveys*, 41(3), article 15. Point, contextual and collective anomalies; supervised, semi-supervised and unsupervised detection.
- Liu, F. T., Ting, K. M. and Zhou, Z.-H. (2008), [Isolation forest](https://doi.org/10.1109/ICDM.2008.17). *Proceedings of the 8th IEEE International Conference on Data Mining*, 413–422. The algorithm, the score $s(x, n)$, $c(n)$ and the default sample size and tree count.
- Breunig, M. M., Kriegel, H.-P., Ng, R. T. and Sander, J. (2000), [LOF: identifying density-based local outliers](https://doi.org/10.1145/342009.335388). *Proceedings of the 2000 ACM SIGMOD International Conference on Management of Data*, 93–104.
- NIST/SEMATECH e-Handbook of Statistical Methods, [Detection of outliers](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35h.htm) (z-scores, the $(n-1)/\sqrt{n}$ limit and the modified z-score of Iglewicz and Hoaglin) and [What are outliers in the data?](https://www.itl.nist.gov/div898/handbook/prc/section1/prc16.htm) (inner and outer fences).
- Cleveland, R. B., Cleveland, W. S., McRae, J. E. and Terpenning, I. (1990), STL: a seasonal-trend decomposition procedure based on loess. *Journal of Official Statistics*, 6(1), 3–73.
- Hyndman, R. J. and Athanasopoulos, G. (2021), [Forecasting: Principles and Practice](https://otexts.com/fpp3/), 3rd edition, OTexts. Decomposition, forecasting and residual diagnostics.
- Kim, S., Choi, K., Choi, H.-S., Lee, B. and Yoon, S. (2022), [Towards a rigorous evaluation of time-series anomaly detection](https://doi.org/10.1609/aaai.v36i7.20680). *Proceedings of the AAAI Conference on Artificial Intelligence*, 36(7), 7194–7201.

<LearnCta position="bottom" chart="anomaly detection chart" demo="chart-realtime-performance-demo" demoLabel="real-time line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
