---
sidebar_position: 90
sidebar_label: Heart Rate Variability (HRV)
title: "Heart Rate Variability (HRV): What It Is and How to Read HRV Charts"
description: "What heart rate variability (HRV) is, how RMSSD, SDNN and LF/HF are worked out, normal HRV by age, why devices disagree, and how to read HRV charts, with a live demo."
keywords:
    [
        "heart rate variability",
        "hrv",
        "what is hrv",
        "what is heart rate variability",
        "heart rate variability chart",
        "hrv chart",
        "heart rate variability by age",
        "hrv by age",
        "what is a good hrv",
        "normal hrv",
        "low hrv",
        "rmssd",
        "sdnn",
        "rmssd vs sdnn",
        "lf/hf ratio",
        "poincare plot",
        "rr interval",
        "rr tachogram"
    ]
image: /img/learn/heart-rate-variability-og.png
related: [ecg, eeg, capnography-pulse-oximetry, power-spectral-density]
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
                    "name": "What is a good HRV?",
                    "acceptedAnswer": { "@type": "Answer", "text": "There is no single good HRV number, because HRV depends on age, the measure used, the device, the time of day and how long the recording was. In studies of healthy adults resting for 5 minutes, average RMSSD is around 40 ms in people aged 25 to 34 and around 20 ms by 55 to 74, with wide variation between individuals. A good HRV for you is one that is steady or rising against your own baseline, measured the same way each time." }
                },
                {
                    "@type": "Question",
                    "name": "Why is my HRV low?",
                    "acceptedAnswer": { "@type": "Answer", "text": "HRV drops for everyday reasons: a hard training session, a short or broken night's sleep, alcohol, stress, illness or fever, or simply being older. A single low reading usually reflects one of these. A low HRV that stays low for weeks, or comes with symptoms, is something to discuss with a doctor, who can interpret it alongside a proper examination. HRV on its own does not diagnose any condition." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between RMSSD and SDNN?",
                    "acceptedAnswer": { "@type": "Answer", "text": "RMSSD is the root mean square of the differences between successive heartbeat intervals, so it measures fast, beat-to-beat change, which is mostly driven by the vagus nerve and breathing. SDNN is the standard deviation of all the normal heartbeat intervals in a recording, so it includes slow swings as well and grows with the length of the recording. Many wearables report RMSSD; 24-hour clinical studies often use SDNN." }
                },
                {
                    "@type": "Question",
                    "name": "Does HRV go down with age?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes. HRV falls with age in both women and men. In a study of 1,906 healthy adults resting for 5 minutes, mean RMSSD fell from about 40 to 43 ms at ages 25 to 34 to about 19 ms at 65 to 74, with the steepest fall before the mid-fifties. The spread at every age is wide, so an individual can sit well above or below the average." }
                },
                {
                    "@type": "Question",
                    "name": "Is a higher HRV always better?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Not always. Within one healthy person, a higher resting HRV than usual generally goes with good recovery and strong vagal activity. But HRV can also read high because of irregular heartbeats, such as ectopic beats or atrial fibrillation, or measurement errors from motion. That is why HRV is only meaningful from a clean recording of normal heartbeats." }
                },
                {
                    "@type": "Question",
                    "name": "How do I draw an HRV chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Collect the RR intervals between detected heartbeats, then plot them as a line against time for the tachogram, as a scatter of each interval against the next for the Poincaré plot, and as a power spectrum with the LF and HF bands shaded. SciChart.js does this with FastLineRenderableSeries and XyScatterRenderableSeries over XyDataSeries, using fifoCapacity so the tachogram scrolls in real time." }
                }
            ]
        })}
    </script>
</head>

# Heart Rate Variability (HRV)

## What is heart rate variability?

**Heart rate variability** (HRV) is the natural variation in the time between one heartbeat and the next. It is measured in milliseconds from the RR intervals, the gaps between successive R peaks on an ECG or pulses on a watch. In a healthy person at rest, the gaps lengthen and shorten with every breath.

![A simulated heart rate variability display in a dark navy theme: an ECG strip with R peaks marked and an arrow spanning one RR interval, a scrolling RR tachogram that rises and falls with breathing, a Poincaré plot with its SD1 and SD2 ellipse, and an RR spectrum with the LF and HF bands shaded](/img/learn/heart-rate-variability-og.png)

*Four views of one simulated heartbeat stream (sample data). [Try the interactive version](#how-to-build-an-hrv-chart-in-javascript-react-or-angular).*

This page explains how HRV is measured, charted and read. It is educational, not medical advice: HRV doesn't diagnose any condition on its own, and a clinician interprets it alongside everything else they know about a patient.

:::tip Key takeaways
- HRV is the beat-to-beat variation in RR intervals, in ms. At rest, more variation usually means a stronger influence of the vagus nerve, the "rest and digest" side of the nervous system.
- RMSSD measures fast, beat-to-beat change and is what many wearables show; SDNN measures total variation and depends on the recording length.
- HRV falls with age: average resting RMSSD is roughly 40 ms in people aged 25 to 34 and roughly 20 ms by 65 to 74, with a wide spread at every age.
- Compare HRV with your own baseline, measured the same way, not with other people or other devices.
- Ectopic beats and missed detections must be removed before HRV is calculated: a single extra beat can more than double RMSSD.
:::

## How is HRV measured? RR intervals from an ECG or a wearable

HRV is measured by timing every heartbeat precisely, then working out statistics from the list of intervals between them. The gold standard is an ECG: software finds the R peak of each QRS complex (see the [ECG guide](/learn/applications/ecg/) for the waves) and records the time from one R peak to the next.

![Top: an ECG trace of six heartbeats with each R peak circled and arrows between them labelled RR1 = 800 ms, RR2 = 840 ms, RR3 = 880 ms, RR4 = 850 ms and RR5 = 800 ms. Bottom: the same five intervals plotted as points against beat number, rising to 880 ms and falling back, forming an RR tachogram](./rr-intervals-tachogram.svg)

A few terms recur in every HRV report:

| Term | Meaning |
| --- | --- |
| RR interval | The time between two successive R peaks on an ECG, in ms. 60,000 divided by the RR interval gives the instantaneous heart rate: 800 ms is 75 beats per minute |
| NN interval | An RR interval between two normal beats, both started by the heart's natural pacemaker (the sinus node). HRV measures should use only NN intervals |
| Ectopic beat | A beat that starts somewhere else in the heart and comes early, followed by a longer pause. It is removed or corrected before analysis |
| RR tachogram | A chart of each RR interval against beat number or time. It is the raw view that every HRV number summarises |
| Short-term HRV | A recording of about 5 minutes, usually at rest. Ultra-short recordings of 1 minute or less are also used, mostly by apps |
| 24-hour HRV | A whole day from a Holter monitor, which includes sleep, activity and the daily rhythm. Its values are not interchangeable with short-term ones |

Smartwatches, rings and chest straps take a different route. Chest straps usually detect the heart's electrical signal like an ECG. Watches and rings mostly use photoplethysmography (PPG): green or infrared light measures each pulse of blood in the skin (the same pleth wave described in the [capnography and pulse oximetry guide](/learn/applications/capnography-pulse-oximetry/)). The time from one pulse to the next is strictly pulse rate variability. At rest it tracks ECG-based HRV well, but movement and some mental stress make the two disagree, sometimes badly, so most wearables take their HRV reading while you sleep or sit still.

## What HRV tells you about the nervous system

HRV is mostly a window on the autonomic nervous system, the part of the nervous system that runs the body without conscious control. Its two branches pull the heart rate in opposite directions.

- **Parasympathetic** activity, carried to the heart by the vagus nerve, slows the heart. It acts within a single beat, so it can lengthen one interval and not the next. This is the main source of fast, beat-to-beat HRV, and why people talk about high HRV as good "vagal tone".
- **Sympathetic** activity, the "fight or flight" side, speeds the heart and acts over several seconds, so it smooths out quick changes. During exercise or stress the vagal brake is lifted and HRV falls.

Two rhythms dominate a resting tachogram. **Respiratory sinus arrhythmia** (RSA) is the heart speeding up as you breathe in and slowing as you breathe out; at a normal 12 to 20 breaths a minute, it repeats every 3 to 5 seconds. A slower wave, roughly every 10 seconds, comes from the baroreflex, the loop that steadies blood pressure. When you breathe slowly, at about 6 breaths a minute, the two line up and the swings in heart rate grow several times larger. HRV biofeedback training uses this effect.

## HRV measures: RMSSD, SDNN, pNN50 and others

HRV measures fall into three families: time-domain statistics on the intervals themselves, frequency-domain measures from their spectrum, and non-linear measures such as the Poincaré plot. The time-domain ones are the easiest to understand and are the ones most apps show.

| Measure | What it is | What it mostly reflects |
| --- | --- | --- |
| Mean RR / mean HR | The average interval, or 60,000 ÷ mean RR in beats per minute | Heart rate, not variability |
| SDNN | Standard deviation of all NN intervals in the recording | Total variability, from fast and slow rhythms together. Grows with recording length |
| RMSSD | Root mean square of the differences between successive NN intervals | Fast, beat-to-beat change; the main time-domain estimate of vagal activity |
| pNN50 | Percentage of successive intervals that differ by more than 50 ms | The same as RMSSD, more coarsely; often zero at older ages or high heart rates |
| SDANN, SDNN index | Spread of 5-minute averages, and average of 5-minute SDNNs, over 24 hours | Slow, daily changes; used with Holter recordings |
| ln(RMSSD) | Natural logarithm of RMSSD | Same as RMSSD, on a scale where changes are more evenly spread; some apps rescale it to a 0 to 100 score |

### RMSSD vs SDNN: which one should you use?

Use RMSSD to track day-to-day recovery and SDNN for overall variability over a fixed, longer recording. RMSSD looks only at the change from each beat to the next, so slow drifts in heart rate hardly affect it and it stays usable on recordings as short as a minute. SDNN includes every rhythm the recording is long enough to contain, so a 24-hour SDNN is much larger than a 5-minute one and the two can't be compared. In 24-hour recordings from heart attack survivors, an SDNN under 50 ms went with a markedly higher risk of death in the following years than an SDNN over 100 ms. That is a finding about groups of patients, not a test an individual can apply to a watch reading.

### Worked example: RMSSD and SDNN from eight heartbeats

Here are eight RR intervals from a resting person, extending the five in the diagram above. The heart rate is about 72 beats per minute.

| Beat | RR (ms) | Difference from previous (ms) | Difference squared (ms²) |
| --- | --- | --- | --- |
| 1 | 800 | | |
| 2 | 840 | +40 | 1,600 |
| 3 | 880 | +40 | 1,600 |
| 4 | 850 | −30 | 900 |
| 5 | 800 | −50 | 2,500 |
| 6 | 780 | −20 | 400 |
| 7 | 830 | +50 | 2,500 |
| 8 | 870 | +40 | 1,600 |

- Mean RR = 6,650 ÷ 8 = 831.25 ms, so the mean heart rate is 60,000 ÷ 831.25 = 72.2 bpm.
- RMSSD: the seven squared differences add up to 11,100 ms². Their mean is 11,100 ÷ 7 = 1,585.7 ms², and the square root is 39.8 ms.
- SDNN: the squared deviations from the mean add up to 8,887.5 ms². Divided by 8 − 1 = 7 that is 1,269.6 ms², and the square root is 35.6 ms.
- pNN50: no difference is more than 50 ms (two are exactly 50), so pNN50 is 0%, even though RMSSD is a healthy-looking 40 ms, because pNN50 only counts differences above its 50 ms threshold.

Now suppose beat 5 is an ectopic beat. It arrives early, at 560 ms, and the pause after it is long, 1,020 ms, so the two still add up to the 1,580 ms of the normal beats they replace. The mean heart rate doesn't change at all. But the differences around the ectopic beat become −290, +460 and −190 ms, and RMSSD jumps from 39.8 ms to 219.6 ms, five and a half times higher. SDNN rises from 35.6 to 127.9 ms and pNN50 from 0 to 43%. Deleting the two affected intervals, so that beat 4 is followed directly by beat 7, brings RMSSD down to 34.9 ms: close to the true 39.8 ms, though not exactly, because a deleted beat also removes real variation. One unedited beat in a short recording can change the answer completely, which is why HRV software flags or corrects such beats first.

## Frequency-domain HRV: LF, HF and the LF/HF ratio

Frequency-domain analysis splits the tachogram into the rhythms it contains, and reports how much variation (power, in ms²) falls in each frequency band. The tachogram is first resampled at even time steps, then a Fourier transform or an autoregressive model gives its [power spectral density](/learn/applications/signal-processing/power-spectral-density/).

| Band | Frequency | Period | Main sources |
| --- | --- | --- | --- |
| VLF (very low frequency) | 0.0033 to 0.04 Hz | 25 s to 5 min | Temperature regulation, hormones and other slow processes; needs long recordings |
| LF (low frequency) | 0.04 to 0.15 Hz | 7 to 25 s | Mostly the baroreflex, with both branches of the nervous system; slow breathing below about 9 breaths a minute also lands here |
| HF (high frequency) | 0.15 to 0.40 Hz | 2.5 to 7 s | Respiratory sinus arrhythmia at 9 to 24 breaths a minute; vagal activity |

The **LF/HF ratio** was proposed as a measure of "sympathovagal balance", the sympathetic side over the parasympathetic side. It is still printed by most HRV software, but its meaning is disputed. LF power is not a pure sympathetic signal: much of it is vagal and baroreflex activity. And the two branches don't trade off like a seesaw. LF/HF also swings with breathing rate. Breathe at 6 breaths a minute and the respiratory peak moves from the HF band into the LF band, so LF/HF can rise many times over while the vagal effect on the heart is, if anything, stronger. Read LF/HF only with the breathing rate known, and never as a stress score on its own.

## The Poincaré plot: SD1 and SD2

A **Poincaré plot** draws each RR interval against the next one, so every point is a pair of neighbouring beats. A healthy resting recording forms an elongated cloud, like a comet or cigar, along the line of identity (where RR(n+1) = RR(n)).

- **SD1** is the spread of the points across the line of identity: the beat-to-beat change. It equals the standard deviation of the successive differences divided by √2, which is almost exactly RMSSD ÷ √2, so it carries the same information as RMSSD.
- **SD2** is the spread along the line: slower, longer-term variation, closely related to SDNN.
- An ellipse with SD1 and SD2 as its half-widths summarises the shape. A small round cloud means low variability; a long thin one means slow swings with little beat-to-beat change.

The Poincaré plot shows artefacts better than any single number. An ectopic beat makes points far off the main cloud: one below the line (a short interval after a normal one) and one far above it (the long pause after the short one).

## What is a normal HRV? HRV by age

There is no single normal HRV: it depends on age, the measure, the recording length and the conditions. The best guide is a large study of the same measurement in healthy people. In 1,906 healthy adults recorded lying down for 5 minutes (Voss et al., 2015), mean RMSSD fell steadily with age:

![Bar chart of mean resting RMSSD by age group for women and men, with whiskers of one standard deviation: women 43, 35, 26, 21 and 19 ms and men 40, 32, 23, 20 and 19 ms for ages 25–34, 35–44, 45–54, 55–64 and 65–74. The whiskers span roughly 10 to 65 ms in the youngest group](./hrv-by-age.svg)

| Age (years) | RMSSD, women (ms) | RMSSD, men (ms) | SDNN, women (ms) | SDNN, men (ms) |
| --- | --- | --- | --- | --- |
| 25–34 | 42.9 ± 22.8 | 39.7 ± 19.9 | 48.7 ± 19.0 | 50.0 ± 20.9 |
| 35–44 | 35.4 ± 18.5 | 32.0 ± 16.5 | 45.4 ± 20.5 | 44.6 ± 16.8 |
| 45–54 | 26.3 ± 13.6 | 23.0 ± 10.9 | 36.9 ± 13.8 | 36.8 ± 14.6 |
| 55–64 | 21.4 ± 11.9 | 19.9 ± 11.1 | 30.6 ± 12.4 | 32.8 ± 14.7 |
| 65–74 | 19.1 ± 11.8 | 19.1 ± 10.7 | 27.8 ± 11.8 | 29.6 ± 13.2 |

*Mean ± standard deviation, 5-minute supine ECG. Source: Voss et al. (2015).*

The fall is steepest between the late twenties and the mid-fifties, then levels off, which matches 24-hour studies across nine decades of age (Umetani et al., 1998). Women and men differ little in these time-domain measures at any age. And the spread is wide: in the youngest group the standard deviation is about 20 ms, so healthy values from roughly 20 to 60 ms are common, and a "low" number for one person is normal for another.

A review of 44 short-term studies (Nunan et al., 2010) found an average resting RMSSD of 42 ms and SDNN of 50 ms in healthy adults, with study averages for RMSSD ranging from 19 to 75 ms. Numbers recorded overnight by a wearable, or over 24 hours, are on a different scale again.

### What is a good HRV score?

A good HRV score is one that is stable or rising against your own baseline. Most wearables now show a personal normal range, built from several weeks of your own readings, and judge each night against it. That is a better reference than any population table, because it holds your age, your device and your measuring routine constant.

## Why is my HRV low? What changes HRV

Many everyday things lower HRV for a day or two, and a few change it for longer. Short-term dips are normal and usually reflect recovery from something.

| Factor | Effect on HRV |
| --- | --- |
| Age | Falls steadily from early adulthood to the mid-fifties, then levels off |
| Aerobic fitness | Regular endurance training raises resting time-domain HRV |
| Hard exercise | Lowers HRV during and for hours after a session, more after harder ones |
| Alcohol | Lowers HRV during the following night's sleep, more with larger amounts |
| Poor or short sleep, stress | Commonly lower HRV the next day |
| Illness and fever | Commonly lower HRV |
| Breathing | Slow, deep breathing raises HRV while you do it; fast breathing lowers it |
| Posture | Standing lowers HRV compared with lying down, so measure in the same position each time |
| Time of measurement | HRV changes across the day and through sleep stages; a morning reading and an overnight average differ |
| Medicines and heart conditions | Beta-blockers, some other drugs and heart rhythm problems change HRV, in either direction |

A low HRV that stays low for weeks, or comes with symptoms such as breathlessness, palpitations or fainting, is a reason to see a doctor. A clinician interprets HRV alongside an examination and other tests: it is a marker linked to health in large groups, not a diagnosis for one person.

## Why HRV numbers from different devices don't match

HRV numbers from two devices, or two apps, are often different because they measure different things in different ways. Five choices change the number:

| Choice | Options | Effect |
| --- | --- | --- |
| Sensor | ECG chest strap or patch; optical PPG on the wrist or finger | PPG pulse intervals are slightly smoothed and noisier; at rest they read short-term variability a little high |
| Measure | RMSSD, SDNN, ln(RMSSD) or a 0 to 100 score | SDNN and RMSSD from the same recording can differ widely; scores aren't in ms at all |
| When | Overnight average, a deep-sleep window, a 1-minute morning reading, random spot checks | Overnight readings are usually higher than daytime ones |
| How long | 1 minute, 5 minutes, a whole night, 24 hours | Longer windows give larger SDNN |
| Cleaning | How missed beats, extra beats and motion are detected and removed | Poor cleaning inflates HRV; aggressive cleaning can flatten it |

So compare HRV only with readings from the same device, the same measure and the same routine.

## How to read an HRV chart on a watch or app

Read an HRV chart as a trend against your own baseline, not as a score for a single night. Most apps show the same few elements:

1. Find the measure and the unit. Is it RMSSD in ms, SDNN, or a score? When was it recorded: overnight, or a morning spot reading?
2. Find your baseline band. The shaded range is your usual HRV, typically built from the last few weeks.
3. Look at the rolling average, often 7 days, rather than individual nights. One night outside the band says little.
4. Look for a run. Several days below the band suggest your body is under extra load; several days above it usually go with good recovery.
5. Match it with your diary. Training, travel, alcohol, poor sleep or a cold explain most dips.

If the chart is a tachogram or a Poincaré plot, as in research software, read the shape: a tachogram that rises and falls smoothly with each breath, and a Poincaré cloud with no outlying points, mean the recording is clean.

## Common HRV mistakes

Most HRV mistakes come from treating one number as more precise or more comparable than it is.

- **Comparing your HRV with other people's.** The spread between healthy people of the same age is wider than most changes you'll see in yourself. Compare with your own baseline.
- **Reacting to a single reading.** Night-to-night variation is large. Use the weekly trend.
- **Leaving ectopic beats and missed beats in.** One premature beat can multiply RMSSD several times over. Check that artefacts were removed, or look at the tachogram.
- **Mixing measures or devices.** RMSSD, SDNN and app scores aren't interchangeable, and neither are a chest strap and a watch.
- **Changing the conditions.** Posture, time of day, breathing rate and recording length all move HRV. Measure the same way each time.
- **Reading LF/HF as a stress meter.** It shifts with breathing rate and doesn't measure sympathetic activity on its own.
- **Treating HRV as a diagnosis.** HRV is linked to health in populations; a clinician interprets it for an individual.

## How to build an HRV chart in JavaScript, React or Angular

An HRV display redraws several linked charts from one stream of heartbeats, and it has to keep up as each new beat arrives. SciChart.js draws all four charts in this demo with WebGL, appending each batch of samples and beats as typed arrays. The heartbeats are simulated: a model of breathing, the blood-pressure reflex and noise gives each RR interval, and each beat is drawn as an ECG-like trace. The measures use a rolling 1-minute window (shaded on the tachogram), shorter than the standard 5 minutes, so the numbers settle about a minute after you change state.

Choose a **State**: **Rest** shows a normal respiratory rhythm in the HF band; **Exercise** raises the heart rate and flattens HRV; **Slow breathing (6/min)** makes large, regular swings and a tall peak near 0.1 Hz in the LF band. Press **Add ectopic beat** and watch RMSSD jump, the orange points leave the Poincaré cloud and the tachogram spike; then tick **Remove ectopic beats**. **Pause** stops the stream: then scroll to zoom, drag to pan, double-click to reset, and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={820} name="./Basic/demo" />

<LearnCta position="top" chart="HRV chart" demo="vital-signs-ecg-medical-chart-example" demoLabel="ECG vital signs chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter series documentation" />

Here is the code for this chart. The HRV maths is plain JavaScript; SciChart.js draws the ECG strip, the tachogram, the Poincaré plot and the spectrum.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        NumberRange,
        EAutoRange,
        SciChartJsNavyTheme,
        CursorModifier
    } from "scichart";

    // An RR tachogram that scrolls as beats arrive, and a Poincaré plot of the last 100 beats
    const initHrvCharts = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        const xAxis = new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Never });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "RR (ms)", autoRange: EAutoRange.Always }));
        const tachogram = new XyDataSeries(wasmContext, { fifoCapacity: 500 }); // scrolls once full
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { dataSeries: tachogram, stroke: "#50C7E0", strokeThickness: 2 })
        );
        sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));

        // Each detected beat from your ECG or sensor: its time (s) and the RR interval before it (ms)
        const unsubscribe = subscribeToYourRRIntervals((times: number[], rr: number[]) => {
            tachogram.appendRange(times, rr);
            const now = times[times.length - 1];
            xAxis.visibleRange = new NumberRange(now - 120, now); // the last two minutes
        });
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return { sciChartSurface };
    };

    const initPoincare = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "RR(n) (ms)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "RR(n+1) (ms)" }));
        const pairs = new XyDataSeries(wasmContext, { fifoCapacity: 100 });
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: pairs,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "#50C7E0" })
            })
        );
        let previous = NaN;
        const unsubscribe = subscribeToYourRRIntervals((_times: number[], rr: number[]) => {
            for (const value of rr) {
                if (!isNaN(previous)) pairs.append(previous, value);
                previous = value;
            }
        });
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return { sciChartSurface };
    };

    export const HrvCharts = () => (
        <div style={{ display: "flex", gap: 8 }}>
            <SciChartReact initChart={initHrvCharts} style={{ flex: 2, height: 300 }} />
            <SciChartReact initChart={initPoincare} style={{ flex: 1, height: 300 }} />
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
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        NumberRange,
        EAutoRange,
        SciChartJsNavyTheme,
        CursorModifier
    } from "scichart";

    // An RR tachogram that scrolls as beats arrive
    const initHrvCharts = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        const xAxis = new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Never });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "RR (ms)", autoRange: EAutoRange.Always }));
        const tachogram = new XyDataSeries(wasmContext, { fifoCapacity: 500 }); // scrolls once full
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { dataSeries: tachogram, stroke: "#50C7E0", strokeThickness: 2 })
        );
        sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));

        // Each detected beat from your ECG or sensor: its time (s) and the RR interval before it (ms)
        const unsubscribe = subscribeToYourRRIntervals((times: number[], rr: number[]) => {
            tachogram.appendRange(times, rr);
            const now = times[times.length - 1];
            xAxis.visibleRange = new NumberRange(now - 120, now); // the last two minutes
        });
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return { sciChartSurface };
    };

    // A Poincaré plot of the last 100 beats: each RR interval against the next
    const initPoincare = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "RR(n) (ms)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "RR(n+1) (ms)" }));
        const pairs = new XyDataSeries(wasmContext, { fifoCapacity: 100 });
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: pairs,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "#50C7E0" })
            })
        );
        let previous = NaN;
        const unsubscribe = subscribeToYourRRIntervals((_times: number[], rr: number[]) => {
            for (const value of rr) {
                if (!isNaN(previous)) pairs.append(previous, value);
                previous = value;
            }
        });
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return { sciChartSurface };
    };

    @Component({
        selector: "app-hrv-charts",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `
            <div style="display: flex; gap: 8px">
                <scichart-angular [initChart]="initHrvCharts" style="flex: 2; height: 300px"></scichart-angular>
                <scichart-angular [initChart]="initPoincare" style="flex: 1; height: 300px"></scichart-angular>
            </div>
        `
    })
    export class HrvChartsComponent {
        // scichart-angular creates each chart, sizes it and cleans it up
        initHrvCharts = initHrvCharts;
        initPoincare = initPoincare;
    }
    ```
</CodeSnippetBlock>

Key points:

- The ECG strip and the tachogram use `XyDataSeries` with `fifoCapacity`, so old points drop off as new ones are appended with `appendRange`, and the x-axis `visibleRange` follows the latest time.
- The Poincaré plot is an `XyScatterRenderableSeries` of each RR interval against the next. The SD1/SD2 ellipse and its axes are `FastLineRenderableSeries` worked out from the same points.
- The spectrum is a `FastMountainRenderableSeries` over the RR power spectrum, with `BoxAnnotation`s in relative y-coordinates shading the LF and HF bands.
- A `requestAnimationFrame` loop moves time on and appends each frame's samples in one batch; the HRV maths runs twice a second, and the loop stops when a chart is deleted.

**See it in the demo app:** [JavaScript ECG vital signs chart](https://www.scichart.com/demo/javascript/vital-signs-ecg-medical-chart-example) · [React ECG vital signs chart](https://www.scichart.com/demo/react/vital-signs-ecg-medical-chart-example) · [Angular ECG vital signs chart](https://www.scichart.com/demo/angular/vital-signs-ecg-medical-chart-example).

**Go deeper:** [SciChart.js scatter series documentation](/2d-charts/chart-types/xy-scatter-renderable-series/), [line series documentation](/2d-charts/chart-types/fast-line-renderable-series/) and [real-time updates documentation](/2d-charts/chart-types/data-series-api/realtime-updates/), which covers FIFO series. For how medical device makers and researchers use SciChart, see [SciChart for medical charts and dashboards](https://www.scichart.com/why-scichart-medical-charts-dashboarding-for-research-and-healthcare/) and [SciChart for telehealth](https://www.scichart.com/telehealth/).

## Frequently asked questions

### What is a good HRV?

There is no single good HRV number, because HRV depends on age, the measure used, the device, the time of day and how long the recording was. In studies of healthy adults resting for 5 minutes, average RMSSD is around 40 ms in people aged 25 to 34 and around 20 ms by 55 to 74, with wide variation between individuals. A good HRV for you is one that is steady or rising against your own baseline, measured the same way each time.

### Why is my HRV low?

HRV drops for everyday reasons: a hard training session, a short or broken night's sleep, alcohol, stress, illness or fever, or simply being older. A single low reading usually reflects one of these. A low HRV that stays low for weeks, or comes with symptoms, is something to discuss with a doctor, who can interpret it alongside a proper examination. HRV on its own does not diagnose any condition.

### What is the difference between RMSSD and SDNN?

RMSSD is the root mean square of the differences between successive heartbeat intervals, so it measures fast, beat-to-beat change, which is mostly driven by the vagus nerve and breathing. SDNN is the standard deviation of all the normal heartbeat intervals in a recording, so it includes slow swings as well and grows with the length of the recording. Many wearables report RMSSD; 24-hour clinical studies often use SDNN.

### Does HRV go down with age?

Yes. HRV falls with age in both women and men. In a study of 1,906 healthy adults resting for 5 minutes, mean RMSSD fell from about 40 to 43 ms at ages 25 to 34 to about 19 ms at 65 to 74, with the steepest fall before the mid-fifties. The spread at every age is wide, so an individual can sit well above or below the average.

### Is a higher HRV always better?

Not always. Within one healthy person, a higher resting HRV than usual generally goes with good recovery and strong vagal activity. But HRV can also read high because of irregular heartbeats, such as ectopic beats or atrial fibrillation, or measurement errors from motion. That is why HRV is only meaningful from a clean recording of normal heartbeats.

### How do I draw an HRV chart in JavaScript?

Collect the RR intervals between detected heartbeats, then plot them as a line against time for the tachogram, as a scatter of each interval against the next for the Poincaré plot, and as a power spectrum with the LF and HF bands shaded. SciChart.js does this with FastLineRenderableSeries and XyScatterRenderableSeries over XyDataSeries, using fifoCapacity so the tachogram scrolls in real time.

## Sources

- Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology (1996), [Heart rate variability: standards of measurement, physiological interpretation, and clinical use](https://doi.org/10.1161/01.CIR.93.5.1043). *Circulation*, 93(5), 1043–1065; also *European Heart Journal*, 17(3), 354–381. Definitions of RR and NN intervals, the time-domain measures, the VLF, LF and HF bands, recording lengths and the editing of ectopic beats.
- Shaffer, F. and Ginsberg, J. P. (2017), [An overview of heart rate variability metrics and norms](https://doi.org/10.3389/fpubh.2017.00258). *Frontiers in Public Health*, 5, 258. RMSSD as the main time-domain vagal measure, the band sources, breathing-rate effects, SD1 and SD2, and the short-term norms from Nunan et al.
- Voss, A., Schroeder, R., Heitmann, A., Peters, A. and Perz, S. (2015), [Short-term heart rate variability: influence of gender and age in healthy subjects](https://doi.org/10.1371/journal.pone.0118308). *PLoS ONE*, 10(3), e0118308. RMSSD and SDNN by age decade and sex (Tables 5 and 7).
- Umetani, K., Singer, D. H., McCraty, R. and Atkinson, M. (1998), [Twenty-four hour time domain heart rate variability and heart rate: relations to age and gender over nine decades](https://doi.org/10.1016/S0735-1097(97)00554-8). *Journal of the American College of Cardiology*, 31(3), 593–601.
- Nunan, D., Sandercock, G. R. H. and Brodie, D. A. (2010), [A quantitative systematic review of normal values for short-term heart rate variability in healthy adults](https://doi.org/10.1111/j.1540-8159.2010.02841.x). *Pacing and Clinical Electrophysiology*, 33(11), 1407–1417.
- Kleiger, R. E., Miller, J. P., Bigger, J. T. and Moss, A. J. (1987), [Decreased heart rate variability and its association with increased mortality after acute myocardial infarction](https://doi.org/10.1016/0002-9149(87)90795-8). *American Journal of Cardiology*, 59(4), 256–262.
- Billman, G. E. (2013), [The LF/HF ratio does not accurately measure cardiac sympatho-vagal balance](https://doi.org/10.3389/fphys.2013.00026). *Frontiers in Physiology*, 4, 26.
- Brennan, M., Palaniswami, M. and Kamen, P. (2001), [Do existing measures of Poincaré plot geometry reflect nonlinear features of heart rate variability?](https://doi.org/10.1109/10.959330) *IEEE Transactions on Biomedical Engineering*, 48(11), 1342–1347. SD1 and SD2 expressed through the standard deviations of the intervals and of their successive differences.
- Lehrer, P. M. and Gevirtz, R. (2014), [Heart rate variability biofeedback: how and why does it work?](https://doi.org/10.3389/fpsyg.2014.00756) *Frontiers in Psychology*, 5, 756. Resonance breathing near 6 breaths a minute and the baroreflex.
- Schäfer, A. and Vagedes, J. (2013), [How accurate is pulse rate variability as an estimate of heart rate variability?](https://doi.org/10.1016/j.ijcard.2012.03.119) *International Journal of Cardiology*, 166(1), 15–29.
- Peltola, M. A. (2012), [Role of editing of R–R intervals in the analysis of heart rate variability](https://doi.org/10.3389/fphys.2012.00148). *Frontiers in Physiology*, 3, 148.
- Pietilä, J. et al. (2018), [Acute effect of alcohol intake on cardiovascular autonomic regulation during the first hours of sleep in a large real-world sample of Finnish employees](https://doi.org/10.2196/mental.9519). *JMIR Mental Health*, 5(1), e23.

<LearnCta position="bottom" chart="HRV chart" demo="vital-signs-ecg-medical-chart-example" demoLabel="ECG vital signs chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter series documentation" />
