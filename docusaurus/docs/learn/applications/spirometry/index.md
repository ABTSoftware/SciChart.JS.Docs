---
sidebar_position: 290
sidebar_label: Spirometry
title: "Spirometry: How to Read Results and the Flow-Volume Loop"
description: "How to read spirometry results: FEV1, FVC and the FEV1/FVC ratio, the volume-time curve and flow-volume loop, obstructive, restrictive and upper-airway patterns, and test quality."
keywords:
    [
        "spirometry",
        "spirometry interpretation",
        "how to read spirometry results",
        "flow volume loop",
        "flow volume loop interpretation",
        "fev1/fvc ratio",
        "fev1",
        "fvc",
        "peak expiratory flow",
        "volume time curve",
        "obstructive vs restrictive spirometry",
        "upper airway obstruction flow volume loop",
        "bronchodilator response"
    ]
image: /img/learn/spirometry-og.png
related: [capnography-pulse-oximetry, heart-rate-variability, ecg, line-chart]
datePublished: 2026-11-27
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is spirometry?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Spirometry is a breathing test in which a person breathes in as deeply as possible and then blows out as hard and fast as they can, for as long as they can, into a spirometer. It measures how much air the lungs can blow out (FVC), how much comes out in the first second (FEV1) and the ratio of the two, and draws the blow as a volume-time curve and a flow-volume loop." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read spirometry results?",
                    "acceptedAnswer": { "@type": "Answer", "text": "First check the test quality: a sharp start, a blow that reaches a plateau, and at least three acceptable blows that agree within 150 mL. Then look at the FEV1/FVC ratio against its lower limit of normal: a low ratio suggests airflow obstruction. Then look at FVC and FEV1 against their predicted values, and at the shape of the flow-volume loop. A clinician interprets the result alongside symptoms and other tests." }
                },
                {
                    "@type": "Question",
                    "name": "What is a normal FEV1/FVC ratio?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Healthy young adults usually blow out about 80% or more of their FVC in the first second, so their FEV1/FVC is around 0.8 or higher. The ratio falls naturally with age. Current ERS/ATS standards call a ratio abnormal when it is below the lower limit of normal, the 5th percentile for a healthy person of the same age, sex and height; COPD guidelines from GOLD use a simpler fixed cut-off of 0.70 after a bronchodilator." }
                },
                {
                    "@type": "Question",
                    "name": "What does a flow-volume loop show?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A flow-volume loop plots airflow against the volume breathed out during one forced breath. The expiratory limb, above the zero line, rises to peak expiratory flow and falls back to zero as the lungs empty; the inspiratory limb, below the line, shows the full breath back in. Its shape points to the kind of problem: a scooped expiratory limb with obstruction, a narrow loop with restriction, and flattened limbs with a narrowing in the upper airway." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between obstructive and restrictive spirometry?",
                    "acceptedAnswer": { "@type": "Answer", "text": "In an obstructive pattern, narrowed airways slow the air coming out, so FEV1 falls more than FVC and the FEV1/FVC ratio is low; the flow-volume loop has a scooped expiratory limb. In a restrictive pattern, the lungs hold less air, so FVC is low but the ratio is normal or high and the loop is narrow with a normal shape. Spirometry can only suggest restriction: confirming it needs a measurement of total lung capacity." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a flow-volume loop in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Plot the spirometer's samples as a line with volume breathed out on the x-axis and flow on the y-axis, expiratory flow upwards. Because the volume goes out and comes back, mark the data series as unsorted so the line joins the points in time order. Draw the volume-time curve from the same samples in a second chart. SciChart.js does this with FastLineRenderableSeries and an XyDataSeries with isSorted set to false." }
                }
            ]
        })}
    </script>
</head>

# Spirometry and the Flow-Volume Loop

## What is spirometry?

**Spirometry** is a lung function test in which a person breathes in as fully as possible and then blows out as hard and fast as they can, for as long as they can, into a spirometer. It reports how much air comes out in total (FVC) and in the first second (FEV1), and draws the blow as a volume-time curve and a **flow-volume loop**.

![Two linked spirometry graphs in a dark navy theme: on the left a flow-volume loop with a sharp expiratory peak of 9.9 litres per second above the zero line and a rounded inspiratory limb below it; on the right the volume-time curve of the same blow rising steeply and levelling off at a plateau, with the 1-second line, FEV1 and FVC marked](/img/learn/spirometry-og.png)

*A simulated forced breath drawn as a flow-volume loop and a volume-time curve (sample data). [Try the interactive version](#how-to-build-a-flow-volume-loop-chart-in-javascript-react-or-angular).*

This guide explains how spirometry graphs are made and read. It is for learning only and isn't medical advice: a qualified clinician interprets spirometry, alongside symptoms, examination and other tests.

:::tip Key takeaways
- Spirometry measures FVC (all the air blown out), FEV1 (the air blown out in the first second) and their ratio, FEV1/FVC. Peak expiratory flow (PEF) is the fastest flow during the blow.
- A result is judged against predicted values for a healthy person of the same age, sex and height. Below the lower limit of normal (the 5th percentile) counts as low.
- The flow-volume loop's shape points to the pattern: scooped with obstruction, narrow with restriction, flattened with an upper-airway narrowing.
- Check test quality before reading anything: a sharp start, a plateau at the end and repeatable blows. Poor effort can look like disease.
:::

## What spirometry measures: FVC, FEV1, FEV1/FVC and PEF

Spirometry reduces one forced breath to a handful of numbers, each read off the curves.

| Measure | What it is | Units |
| --- | --- | --- |
| FVC (forced vital capacity) | The total volume blown out, from full lungs to as empty as they get | litres (L) |
| FEV1 (forced expiratory volume in 1 second) | The volume blown out in the first second | L |
| FEV1/FVC | The share of the FVC that comes out in the first second; the main number for spotting obstruction | ratio (or %) |
| PEF (peak expiratory flow) | The fastest flow reached, normally very early in the blow | L/s (or L/min on peak flow meters) |
| FEF25–75 | The average flow over the middle half of the blow | L/s |

Healthy young adults usually blow out about 80% or more of their FVC in the first second, and the ratio falls slowly with age. FEF25–75 depends heavily on the FVC and on effort, and varies widely between healthy people, so it isn't used on its own to call a result abnormal.

### Predicted values, the lower limit of normal and z-scores

A spirometry result means little without a reference. The spirometer compares each measure with a predicted value from a **reference equation**, which gives the average, and the spread, for healthy people of the same age, sex and height.

- The **lower limit of normal** (LLN) is the 5th percentile of healthy people. Values below it are reported as low.
- The **z-score** says how many standard deviations a result sits from the predicted value. The LLN is a z-score of −1.645. The 2022 ERS/ATS interpretation standard grades how far a result is below normal by its z-score: −1.65 to −2.5 mild, −2.51 to −4.0 moderate, below −4.0 severe.
- Percent predicted (for example "FEV1 78% predicted") is still printed on most reports, but a fixed 80% cut-off misclassifies many younger and older people, which is why the current standards use the LLN.

The Global Lung Function Initiative published the GLI-2012 equations for ages 3 to 95, with separate equations for different ethnic groups. In 2023 it published GLI Global, a race-neutral equation, and the American Thoracic Society now recommends race-neutral reference equations for interpreting lung function.

COPD guidelines from GOLD (the Global Initiative for Chronic Obstructive Lung Disease) use a simpler fixed cut-off: a post-bronchodilator FEV1/FVC below 0.70. Because the ratio falls with age, the fixed cut-off labels more older people as obstructed, and fewer younger people, than the LLN does.

## The two spirometry graphs: volume-time curve and flow-volume loop

A spirometer draws the same blow two ways, and the 2019 ATS/ERS standard requires both to be shown live during the test.

![An annotated flow-volume loop and volume-time curve from one simulated forced breath. On the loop, flow in litres per second is on the vertical axis and volume breathed out on the horizontal axis; the expiratory limb rises to peak expiratory flow just after total lung capacity and falls almost in a straight line to zero at residual volume, its width marked as FVC; below the zero line the inspiratory limb is a rounded bowl with peak inspiratory flow at its lowest point. On the volume-time curve the volume rises steeply from a back-extrapolated time zero, passes FEV1 at 1 second and levels off at a plateau equal to FVC](./spirometry-graphs-annotated.svg)

- The **volume-time curve** plots the volume blown out against time. It rises steeply, then bends over and flattens into a plateau. FEV1 is its height at 1 second and FVC is the height of the plateau. It shows best how long the blow lasted and whether it really finished.
- The **flow-volume loop** plots the flow (how fast air is moving) against the volume blown out. The 2019 standard sets the layout: expiratory flow upwards, volume breathed out to the right, and a 2:1 ratio between the flow and volume scales, so loops from different machines look alike. Full lungs (total lung capacity, TLC) are at the left; the end of the blow (residual volume, RV) is where the loop meets the zero line on the right. After the blow, the patient breathes in fully, and that breath is drawn below the line as the inspiratory limb. The flow-volume loop shows best what happens in the first second, including the peak.

### Time zero: where the clock starts

Nobody starts blowing at full speed in an instant, so the spirometer works out when the blow "really" began. It draws a line through the point of peak flow, with a slope equal to PEF, back to zero volume. Where that line meets the time axis is **time zero**, and FEV1 is measured from there. The volume already blown out by time zero is the **back-extrapolated volume** (BEV). In the simulated normal blow in the demo, PEF of 9.9 L/s is reached after 0.20 L, so time zero is 0.20 ÷ 9.9 = 0.02 s before the peak, and the BEV is 0.04 L, under 1% of the FVC.

## How to read a flow-volume loop, step by step

Read a flow-volume loop in a fixed order, starting with whether the blow can be trusted.

1. Check the start. The expiratory limb should shoot up to a sharp peak in the first small part of the volume. A slow, rounded rise means a hesitant start.
2. Check the end. The expiratory limb should come down smoothly to zero flow. A sudden drop to zero while flow is still high means the patient stopped early or closed their throat. On the volume-time curve, look for the plateau.
3. Compare the size with the predicted loop. A loop much narrower than predicted means a low FVC.
4. Look at the shape of the expiratory limb after the peak. A near-straight fall is normal; a scooped, concave fall means flow drops off quickly as the lungs empty, as in obstruction.
5. Look for flat tops. A flat cap on the expiratory limb, the inspiratory limb or both points to a narrowing in the larger, central airways.
6. Then read the numbers: FEV1/FVC against its LLN first, then FVC and FEV1.

## Flow-volume loop patterns

Each common pattern changes the loop in its own way. These are the textbook shapes; a clinician decides what a given loop means for a given person.

![Six simulated flow-volume loops, each over a dashed normal loop: A normal, with a sharp peak and a straight fall; B obstructive, with a low peak and a scooped expiratory limb; C restrictive, narrow but normal in shape; D fixed upper-airway obstruction, with both limbs flattened; E variable extrathoracic obstruction, with only the inspiratory limb flattened; F variable intrathoracic obstruction, with only the expiratory limb flattened](./flow-volume-loop-patterns.svg)

| Pattern | Loop shape | Numbers | Examples of causes |
| --- | --- | --- | --- |
| Normal | Sharp early peak, near-straight fall to zero, rounded inspiratory limb | FEV1, FVC and FEV1/FVC above their LLNs | |
| Obstructive | Lower peak, then a scooped (concave) expiratory limb; the blow takes longer | FEV1/FVC below the LLN; FEV1 reduced more than FVC | Asthma, COPD, bronchiectasis |
| Restrictive pattern | Narrow loop, normal shape, often steep sides | FVC low; FEV1/FVC normal or high | Lung fibrosis, chest wall or muscle disease, obesity, previous lung surgery |
| Fixed upper-airway obstruction | Both limbs cut flat, like a box | PEF and peak inspiratory flow both capped; FEV1 can be reduced | Narrowing of the windpipe after intubation, a goitre pressing on it |
| Variable extrathoracic obstruction | Only the inspiratory limb is flattened | Expiratory numbers often near normal | Vocal cord paralysis or dysfunction, a floppy upper airway |
| Variable intrathoracic obstruction | Only the expiratory limb is flattened | PEF capped | Tracheomalacia, a tumour in the lower windpipe |

The upper-airway patterns were set out by Miller and Hyatt in 1973 and follow from simple mechanics. A narrowing outside the chest is sucked inwards on a breath in, so it limits inspiration; one inside the chest is squeezed on a forced breath out, so it limits expiration. A rigid narrowing limits both.

A low FVC with a normal ratio doesn't prove restriction. Air trapped behind narrowed airways can lower the FVC too. The 2022 ERS/ATS standard calls restriction only when total lung capacity, measured by body plethysmography or gas dilution, is low. It calls a low FVC with a normal ratio a non-specific pattern, and a low FEV1 with a normal ratio PRISm (preserved ratio impaired spirometry).

### How to describe a spirometry result

Reports usually follow a fixed order. A template:

> "Spirometry was acceptable and repeatable. FEV1/FVC was 0.58 (below the LLN), FEV1 2.28 L (58% predicted) and FVC 3.95 L, consistent with airflow obstruction; the flow-volume loop shows a scooped expiratory limb."

The numbers are the demo's simulated obstructive blow. The interpretation, and what it means for the patient, is for the clinician.

## Test quality: acceptable, repeatable blows

Spirometry depends on effort, so the first step in reading it is checking the test was done properly. The 2019 ATS/ERS standard sets these criteria for adults:

| Check | Criterion |
| --- | --- |
| Start of the blow | Back-extrapolated volume under 5% of FVC or 0.100 L, whichever is greater; no more than 2 s of hesitation from full lungs to time zero |
| End of the blow | A plateau (less than 0.025 L of extra volume in the last second), or 15 s of blowing; or, if neither, an FVC within the repeatability tolerance of, or larger than, the largest FVC so far |
| During the blow | No cough or closing of the throat (glottic closure) in the first second, no glottic closure later in the blow for FVC, no leak and no blocked mouthpiece |
| Number of blows | At least three acceptable blows, usually no more than eight in adults |
| Repeatability | The two largest FVCs within 0.150 L of each other, and the two largest FEV1s within 0.150 L |
| What is reported | The largest FVC and the largest FEV1 from the acceptable blows, even if they come from different blows |

Poor effort can look like disease. A slow start lowers the peak and can make the loop look obstructed. Stopping early cuts the volume-time curve off before its plateau, so the FVC reads low and the result can look restrictive. In the demo, the slow start gives a BEV of 0.38 L, 7.8% of the FVC and above the 0.24 L limit, so that blow fails the start criterion.

## Bronchodilator response

A bronchodilator test repeats spirometry after an inhaled bronchodilator, such as salbutamol (albuterol), once it has had time to work, to see whether airway narrowing eases. The 2022 ERS/ATS standard defines a significant response as an increase in FEV1 or FVC of more than 10% of the person's predicted value. For example, if the predicted FEV1 is 3.95 L and FEV1 rises from 2.28 L to 2.75 L, the gain of 0.47 L is 11.9% of predicted, which meets the definition. The older 2005 rule, 12% and 200 mL of the starting value, is still printed by many spirometers.

## Common mistakes in reading spirometry

Most reading errors come from skipping the quality check or using the wrong yardstick.

- **Reading the numbers before checking the blows.** A hesitant start, an early stop or a cough changes every number. Look at both graphs and the repeatability first.
- **Using 80% predicted or 0.70 as the line for everyone.** Fixed cut-offs misclassify older and younger adults. Use the LLN or z-score where the report gives one.
- **Calling restriction from spirometry alone.** A low FVC with a normal ratio needs a lung volume test to confirm restriction.
- **Ignoring the inspiratory limb.** Some spirometry tests record only the blow out, and a flattened breath in, the sign of an extrathoracic narrowing, is missed.
- **Comparing loops drawn at different scales.** A loop looks taller or flatter if the flow and volume scales aren't in the standard 2:1 ratio.
- **Comparing results from different reference equations.** Switching from GLI-2012 to GLI Global, or from an older equation, changes percent predicted and z-scores without any change in the lungs.

## How to build a flow-volume loop chart in JavaScript, React or Angular

Spirometers sample flow many times a second and must draw both graphs live as the patient blows, so the chart needs to append data without redrawing everything. This demo simulates one forced breath and traces it in real time on two linked SciChart.js charts, with a marker at the same instant on both. It works out FVC, FEV1, FEV1/FVC and PEF from the curve as a spirometer does, finds time zero by back-extrapolation and checks the start and end of the blow.

Choose a **Pattern** to see a normal, obstructive, restrictive or upper-airway loop over the faint predicted loop, and an **Effort** to see what a slow start or an early stop does to the curves and the quality check. **Blow again** replays the breath. Hover for values, scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={600} name="./Basic/demo" />

<LearnCta position="top" chart="flow-volume loop" demo="line-chart" demoLabel="line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for this chart. The breath model and the measurements are plain JavaScript; SciChart.js draws the two charts and the moving markers.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier
    } from "scichart";

    // One spirometry graph: x and y come from your spirometer's samples
    const makeSpirometryChart = (xTitle: string, yTitle: string, getXY: (s: SpirometrySamples) => [number[], number[]]) =>
        async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: xTitle, growBy: new NumberRange(0.05, 0.05) }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: yTitle, growBy: new NumberRange(0.05, 0.05) }));
            const [xValues, yValues] = getXY(getYourSpirometryData());
            // The loop's volume goes out and comes back, so the data is not sorted in x
            const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues, isSorted: false });
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0", strokeThickness: 3 })
            );
            sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));
            return { sciChartSurface };
        };

    // Flow upwards, volume breathed out to the right
    const initLoop = makeSpirometryChart("Volume breathed out (L)", "Flow (L/s)", (s) => [s.volume, s.flow]);
    const initVolumeTime = makeSpirometryChart("Time (s)", "Volume breathed out (L)", (s) => [s.time, s.volume]);

    export const SpirometryCharts = () => (
        <div style={{ display: "flex", gap: 8 }}>
            <SciChartReact initChart={initLoop} style={{ flex: 1, height: 400 }} />
            <SciChartReact initChart={initVolumeTime} style={{ flex: 1, height: 400 }} />
        </div>
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier
    } from "scichart";

    // One spirometry graph: x and y come from your spirometer's samples
    const makeSpirometryChart = (xTitle: string, yTitle: string, getXY: (s: SpirometrySamples) => [number[], number[]]) =>
        async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: xTitle, growBy: new NumberRange(0.05, 0.05) }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: yTitle, growBy: new NumberRange(0.05, 0.05) }));
            const [xValues, yValues] = getXY(getYourSpirometryData());
            // The loop's volume goes out and comes back, so the data is not sorted in x
            const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues, isSorted: false });
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0", strokeThickness: 3 })
            );
            sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));
            return { sciChartSurface };
        };

    @Component({
        selector: "app-spirometry-charts",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `
            <div style="display: flex; gap: 8px">
                <scichart-angular [initChart]="initLoop" style="flex: 1; height: 400px"></scichart-angular>
                <scichart-angular [initChart]="initVolumeTime" style="flex: 1; height: 400px"></scichart-angular>
            </div>
        `
    })
    export class SpirometryChartsComponent {
        // Flow upwards, volume breathed out to the right
        initLoop = makeSpirometryChart("Volume breathed out (L)", "Flow (L/s)", (s) => [s.volume, s.flow]);
        initVolumeTime = makeSpirometryChart("Time (s)", "Volume breathed out (L)", (s) => [s.time, s.volume]);
    }
    ```
</CodeSnippetBlock>

Key points:

- Each graph is a `FastLineRenderableSeries` over an `XyDataSeries`. The flow-volume loop's data series is created with `isSorted: false`, because the volume goes out and comes back, so the line joins the samples in time order.
- The live trace uses `appendRange` to add all the samples due since the last frame in one call, inside a `requestAnimationFrame` loop that stops when the chart is deleted.
- The moving marker is a one-point `XyScatterRenderableSeries` with an `EllipsePointMarker`, cleared and appended on each frame. A dashed `FastLineRenderableSeries` draws the predicted loop behind the patient's.
- `HorizontalLineAnnotation`, `VerticalLineAnnotation` and `TextAnnotation` mark FEV1, FVC, the 1-second line and PEF once the blow is finished.

**See it in the demo app:** [JavaScript line chart](https://www.scichart.com/demo/javascript/line-chart) · [React line chart](https://www.scichart.com/demo/react/line-chart) · [Angular line chart](https://www.scichart.com/demo/angular/line-chart). For a live medical display, see the [JavaScript vital signs monitor](https://www.scichart.com/demo/javascript/vital-signs-ecg-medical-chart-example).

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/) and [real-time updates documentation](/2d-charts/chart-types/data-series-api/realtime-updates/). For how medical device makers and researchers use SciChart, see [SciChart for medical charts and dashboards](https://www.scichart.com/why-scichart-medical-charts-dashboarding-for-research-and-healthcare/).

## Frequently asked questions

### What is spirometry?

Spirometry is a breathing test in which a person breathes in as deeply as possible and then blows out as hard and fast as they can, for as long as they can, into a spirometer. It measures how much air the lungs can blow out (FVC), how much comes out in the first second (FEV1) and the ratio of the two, and draws the blow as a volume-time curve and a flow-volume loop.

### How do you read spirometry results?

First check the test quality: a sharp start, a blow that reaches a plateau, and at least three acceptable blows that agree within 150 mL. Then look at the FEV1/FVC ratio against its lower limit of normal: a low ratio suggests airflow obstruction. Then look at FVC and FEV1 against their predicted values, and at the shape of the flow-volume loop. A clinician interprets the result alongside symptoms and other tests.

### What is a normal FEV1/FVC ratio?

Healthy young adults usually blow out about 80% or more of their FVC in the first second, so their FEV1/FVC is around 0.8 or higher. The ratio falls naturally with age. Current ERS/ATS standards call a ratio abnormal when it is below the lower limit of normal, the 5th percentile for a healthy person of the same age, sex and height; COPD guidelines from GOLD use a simpler fixed cut-off of 0.70 after a bronchodilator.

### What does a flow-volume loop show?

A flow-volume loop plots airflow against the volume breathed out during one forced breath. The expiratory limb, above the zero line, rises to peak expiratory flow and falls back to zero as the lungs empty; the inspiratory limb, below the line, shows the full breath back in. Its shape points to the kind of problem: a scooped expiratory limb with obstruction, a narrow loop with restriction, and flattened limbs with a narrowing in the upper airway.

### What is the difference between obstructive and restrictive spirometry?

In an obstructive pattern, narrowed airways slow the air coming out, so FEV1 falls more than FVC and the FEV1/FVC ratio is low; the flow-volume loop has a scooped expiratory limb. In a restrictive pattern, the lungs hold less air, so FVC is low but the ratio is normal or high and the loop is narrow with a normal shape. Spirometry can only suggest restriction: confirming it needs a measurement of total lung capacity.

### How do I plot a flow-volume loop in JavaScript?

Plot the spirometer's samples as a line with volume breathed out on the x-axis and flow on the y-axis, expiratory flow upwards. Because the volume goes out and comes back, mark the data series as unsorted so the line joins the points in time order. Draw the volume-time curve from the same samples in a second chart. SciChart.js does this with FastLineRenderableSeries and an XyDataSeries with isSorted set to false.

## Sources

- Graham, B. L. et al. (2019), [Standardization of spirometry 2019 update: an official American Thoracic Society and European Respiratory Society technical statement](https://doi.org/10.1164/rccm.201908-1590ST). *American Journal of Respiratory and Critical Care Medicine*, 200(8), e70–e88. Graph layout, time zero and back-extrapolation, acceptability, repeatability and what is reported.
- Stanojevic, S. et al. (2022), [ERS/ATS technical standard on interpretive strategies for routine lung function tests](https://doi.org/10.1183/13993003.01499-2021). *European Respiratory Journal*, 60(1), 2101499. Lower limit of normal, z-score severity, obstruction, restriction, PRISm and bronchodilator response.
- Quanjer, P. H. et al. (2012), [Multi-ethnic reference values for spirometry for the 3–95-yr age range: the global lung function 2012 equations](https://doi.org/10.1183/09031936.00080312). *European Respiratory Journal*, 40(6), 1324–1343.
- Bowerman, C. et al. (2023), [A race-neutral approach to the interpretation of lung function measurements](https://doi.org/10.1164/rccm.202205-0963OC). *American Journal of Respiratory and Critical Care Medicine*, 207(6), 768–774. The GLI Global equations.
- Bhakta, N. R. et al. (2023), [Race and ethnicity in pulmonary function test interpretation: an official American Thoracic Society statement](https://doi.org/10.1164/rccm.202302-0310ST). *American Journal of Respiratory and Critical Care Medicine*, 207(8), 978–995.
- Miller, R. D. and Hyatt, R. E. (1973), [Evaluation of obstructing lesions of the trachea and larynx by flow-volume loops](https://doi.org/10.1164/arrd.1973.108.3.475). *American Review of Respiratory Disease*, 108(3), 475–481. Fixed and variable upper-airway obstruction.
- Global Initiative for Chronic Obstructive Lung Disease, [*Global Strategy for the Diagnosis, Management and Prevention of COPD*](https://goldcopd.org/) (updated each year). The fixed post-bronchodilator FEV1/FVC cut-off of 0.70.

<LearnCta position="bottom" chart="flow-volume loop" demo="line-chart" demoLabel="line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
