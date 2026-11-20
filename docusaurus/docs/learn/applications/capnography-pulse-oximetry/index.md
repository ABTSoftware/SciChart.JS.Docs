---
sidebar_position: 10
sidebar_label: Capnography and Pulse Oximetry
title: "Capnography and Pulse Oximetry Waveforms: How to Read a Capnogram and Pleth Trace (With Interactive Examples)"
description: "How to read a capnogram and a pleth (pulse oximetry) waveform: the four capnography phases, normal EtCO2, shark fin and other abnormal shapes, perfusion index, motion artefact and sweep speeds, with a live simulated monitor."
keywords:
    [
        "capnography",
        "capnography waveform",
        "capnogram",
        "capnography waveform interpretation",
        "normal capnography waveform",
        "phases of capnography",
        "shark fin capnography",
        "end tidal co2",
        "etco2",
        "pulse oximetry",
        "pulse oximetry waveform",
        "pleth waveform",
        "plethysmograph",
        "photoplethysmography",
        "ppg signal",
        "perfusion index",
        "capnography vs pulse oximetry"
    ]
image: /img/learn/capnography-pulse-oximetry-og.png
related: [ecg, strip-chart, telemetry, low-pass-filter]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a normal capnography waveform look like?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A normal capnogram repeats the same squared-off shape with every breath. It sits on a flat baseline at zero during inspiration, rises steeply when exhaled gas from the lungs reaches the sensor, runs along a nearly flat plateau that climbs slightly, and drops steeply back to zero when the next breath in begins. The value at the end of the plateau is the end-tidal CO2." }
                },
                {
                    "@type": "Question",
                    "name": "What is a normal EtCO2?",
                    "acceptedAnswer": { "@type": "Answer", "text": "In adults with healthy lungs, end-tidal CO2 is normally 35 to 45 mmHg, or about 4.7 to 6.0 kPa. It usually reads a few mmHg below the arterial CO2 level. A higher value suggests hypoventilation or rebreathing; a lower value suggests hyperventilation, poor blood flow to the lungs or a leak in the sampling system." }
                },
                {
                    "@type": "Question",
                    "name": "What does a shark fin capnogram mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A shark fin capnogram has a slow, curved rise and a plateau that keeps sloping upwards instead of levelling off. It means the lungs are emptying unevenly because some airways are narrowed, as in bronchospasm, asthma or COPD. A partly blocked or kinked breathing tube can give a similar shape." }
                },
                {
                    "@type": "Question",
                    "name": "What is a pleth waveform on a pulse oximeter?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The pleth waveform, short for plethysmograph, is the pulse oximeter's trace of how much light the blood in a finger or earlobe absorbs from moment to moment. It rises with each heartbeat as arterial blood swells the tissue. A clean, regular pleth with a sharp upstroke shows the sensor is picking up a real pulse, so the SpO2 and pulse rate readings can be trusted." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between capnography and pulse oximetry?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Capnography measures carbon dioxide in exhaled breath, so it shows ventilation, the movement of air in and out of the lungs, breath by breath. Pulse oximetry measures the oxygen saturation of arterial blood, so it shows oxygenation. Capnography shows a stopped or slowed breath within seconds, while SpO2 can stay normal for minutes, especially when the patient is breathing extra oxygen." }
                },
                {
                    "@type": "Question",
                    "name": "How do I draw a capnogram or pleth waveform in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a line series with a first-in, first-out data buffer sized to one screen of samples, and set it to sweep, so new points overwrite the old ones from left to right as on a bedside monitor. Give the CO2 trace a fixed y-axis in mmHg and auto-scale the pleth trace. SciChart.js does this with FastLineRenderableSeries and an XyDataSeries using fifoCapacity and fifoSweeping." }
                }
            ]
        })}
    </script>
</head>

# Capnography and Pulse Oximetry Waveforms

## What are capnography and pulse oximetry waveforms?

**Capnography** measures carbon dioxide (CO₂) in the breath continuously and draws it as a waveform, the **capnogram**, whose value at the end of each breath is the end-tidal CO₂ (EtCO₂). **Pulse oximetry** shines red and infrared light through a finger to estimate blood oxygen saturation (SpO₂), and draws each heartbeat as the **pleth** waveform.

![A simulated bedside monitor in a dark navy theme: a yellow capnogram with square-topped breaths above a cyan pleth trace with regular pulses, next to large numbers for end-tidal CO2, respiratory rate, SpO2, pulse rate and perfusion index](/img/learn/capnography-pulse-oximetry-og.png)

*A simulated capnogram and pleth trace on a sweeping monitor display (sample data). [Try the interactive version](#how-to-build-a-capnography-and-pleth-monitor-display-in-javascript-react-or-angular).*

This page explains how these traces are made, drawn and read. It is not clinical guidance: diagnosis and treatment decisions belong to trained clinicians, using their local protocols.

:::tip Key takeaways
- A normal capnogram has four phases: a zero baseline, a steep rise, a near-flat plateau and a steep fall. EtCO₂ is the value at the end of the plateau, normally 35 to 45 mmHg in adults.
- The shape tells you as much as the number. A shark fin points to narrowed airways, a raised baseline to rebreathing, a flat line to no breath reaching the sensor.
- The pleth shows the pulse that the SpO₂ reading is based on. If the pleth is messy, the SpO₂ and pulse rate are unreliable.
- Capnography tracks ventilation breath by breath; pulse oximetry tracks oxygenation and can lag by minutes.
- Monitors sweep the CO₂ trace slowly so several breaths fit on screen, and auto-scale the pleth, so check the perfusion index before trusting a tall-looking pulse.
:::

## What is capnography?

Capnography is the continuous measurement of CO₂ in the gas a patient breathes in and out. Most capnometers measure how strongly the gas absorbs infrared light at a wavelength CO₂ absorbs well (around 4.3 µm), and report the result as a partial pressure in mmHg or kPa (1 kPa is about 7.5 mmHg), or as a percentage.

Three related words are easy to mix up:

| Term | What it is |
| --- | --- |
| Capnometry | The number alone: EtCO₂ and often the respiratory rate, without a waveform |
| Capnography | Continuous measurement and display of CO₂ as a waveform |
| Capnogram | The waveform itself. A time capnogram plots CO₂ against time (the usual monitor trace); a volumetric capnogram plots it against the volume breathed out |

It is used in operating theatres, intensive care, emergency departments, ambulances and sedation suites. A capnogram can confirm that a breathing tube is in the windpipe rather than the oesophagus, warn of a disconnected circuit or a stopped breath within seconds, and help judge the quality of chest compressions during resuscitation. The American Society of Anesthesiologists' monitoring standards call for continual monitoring of exhaled CO₂ during general anaesthesia and during moderate or deep sedation.

### Mainstream vs sidestream capnography

The sensor can sit on the airway or at the end of a sampling tube.

| | Mainstream | Sidestream |
| --- | --- | --- |
| Where the CO₂ is measured | In a small adapter fitted directly in the breathing circuit | In the monitor, from gas pumped continuously along a thin sampling line |
| Response | Immediate, with a sharp waveform | Delayed by the time gas takes to travel along the tube, and slightly smoothed |
| Patients | Mostly intubated, ventilated patients | Intubated patients, and patients breathing on their own through a nasal or oral cannula |
| Drawbacks | Adds weight and a little dead space at the airway | Water and secretions can block the line; a leak or very small breaths dilute the sample and read low |

The international standard for respiratory gas monitors, ISO 80601-2-55, requires the maker to state the delay and the rise time of the measurement, because both change how the waveform looks.

## The four phases of a normal capnogram

![An annotated normal capnogram: phase I is a flat baseline at zero while CO2-free gas passes the sensor, phase II is a steep rise as alveolar gas arrives, phase III is a slowly rising plateau ending at the end-tidal CO2 point, normally 35 to 45 mmHg, and phase 0 is the steep fall when inspiration starts. The alpha angle between phases II and III and the beta angle at the end of the plateau are marked, with brackets showing expiration and inspiration](./capnogram-phases.svg)

A normal breath draws the same squared-off shape every time. Reading it from left to right:

- **Phase I: the baseline.** Gas with no CO₂ in it passes the sensor: the fresh gas breathed in, then the first gas breathed out, which comes from the airways (the anatomical dead space) and never took part in gas exchange. It should read zero.
- **Phase II: the expiratory upstroke.** Gas from the alveoli, the small air sacs where CO₂ leaves the blood, starts to reach the sensor and mixes with the dead-space gas. The trace rises steeply.
- **Phase III: the alveolar plateau.** Almost pure alveolar gas is breathed out. The plateau climbs gently, because the slowest-emptying parts of the lung hold the most CO₂ and empty last. Its last point is the **end-tidal CO₂** (EtCO₂).
- **Phase 0: the inspiratory downstroke.** The next breath in sweeps fresh gas past the sensor, and the trace falls steeply back to the baseline. Many emergency and nursing texts call this phase IV; in the anaesthesia literature, phase IV is a small final upswing seen at the end of phase III in some patients, such as in pregnancy.

Two angles describe the corners. The alpha angle, between phases II and III, is normally about 100 to 110 degrees; it widens when the plateau slopes, as in airway obstruction. The beta angle, between the end of phase III and the downstroke, is close to 90 degrees; it widens with rebreathing.

### Normal capnography values

| Measure | Typical normal value (adults) | What moves it |
| --- | --- | --- |
| End-tidal CO₂ (EtCO₂) | 35–45 mmHg (about 4.7–6.0 kPa) | Breathing rate and depth, CO₂ production, blood flow through the lungs |
| Inspired CO₂ (the baseline) | 0 mmHg | Rises above zero with rebreathing |
| Respiratory rate | 12–20 breaths per minute | Counted from the capnogram, one waveform per breath |
| Arterial minus end-tidal CO₂ | A few mmHg | Widens when parts of the lung are ventilated but poorly perfused, as in a pulmonary embolism or low cardiac output |

The respiratory rate range is the band that scores zero in the UK's National Early Warning Score (NEWS2). Children and infants breathe faster, and their normal ranges are different.

### How to read a capnogram step by step

1. Is there a waveform? No waveform means no CO₂ is reaching the sensor: no breathing, a disconnected or blocked circuit, a misplaced tube or a blocked sampling line.
2. Does the baseline return to zero? A baseline above zero means CO₂ is being breathed back in.
3. How high is the end-tidal value, and is it steady, rising or falling from breath to breath?
4. How fast and how regular? Count the waveforms per minute, and look for pauses.
5. What shape is it? Check the rise, the plateau and the fall against the normal shape above.

Watch the trend as well as the single breath. A slow EtCO₂ drift over 10 minutes says something different from a sudden drop.

## Abnormal capnography waveforms

| Pattern | What the trace looks like | Common causes |
| --- | --- | --- |
| Shark fin | Slow, curved rise and a plateau that keeps sloping upwards, so each breath looks like a fin | Bronchospasm, asthma, COPD; a kinked or partly blocked tube |
| Rebreathing | Baseline (and the downstroke) no longer returns to zero; EtCO₂ creeps up | An exhausted CO₂ absorber, a faulty valve in the breathing circuit, too little fresh gas flow |
| Hypoventilation | Fewer breaths, with higher EtCO₂ (above 45 mmHg); the waveforms can also get smaller with shallow breathing | Opioids and sedatives, exhaustion, neuromuscular weakness |
| Hyperventilation | More breaths, with lower EtCO₂ (below 35 mmHg) | Anxiety, pain, over-ventilation by a ventilator or bag |
| Curare cleft | A notch cut into the plateau | The patient's own breathing effort during mechanical ventilation, often as a muscle relaxant wears off |
| Cardiogenic oscillations | Small ripples at the end of the downstroke, in time with the heartbeat | The heart beating against the lungs during a slow breath out; harmless |
| Sudden loss of waveform | The trace drops to a flat line | Apnoea, disconnection, a dislodged or oesophageal tube, a blocked sampling line |
| Sudden fall in EtCO₂ with waveforms still present | Lower plateaus, same shape | A large drop in blood flow through the lungs: cardiac arrest, massive pulmonary embolism, severe bleeding; or a leak in the sampling line |

During cardiopulmonary resuscitation, EtCO₂ reflects how much blood the chest compressions push through the lungs. Resuscitation guidelines from the American Heart Association recommend waveform capnography to confirm and monitor tube placement, and an abrupt, sustained rise in EtCO₂ can be the first sign that the heart has started beating again.

## What is pulse oximetry?

Pulse oximetry estimates the percentage of haemoglobin in arterial blood that is carrying oxygen. A clip on a finger, toe or earlobe has two light-emitting diodes on one side, one red (around 660 nm) and one infrared (around 940 nm), and a light detector on the other side or next to them. The reading is called SpO₂; the same quantity measured in a blood sample is SaO₂. The US National Institute of Standards and Technology (NIST) puts normal saturation for the average person at 95% to 100%; people with long-term lung disease can have a lower usual level.

### How SpO₂ is worked out: the ratio of ratios

Oxygenated haemoglobin absorbs less red light and more infrared light than deoxygenated haemoglobin. Most of the light the detector sees is absorbed by things that don't change from beat to beat: skin, bone, venous blood and the steady part of the arterial blood. That steady part is called DC. With each heartbeat, extra arterial blood swells the tissue and absorbs a little more light; that pulsing part is called AC. Dividing AC by DC at each wavelength cancels out the thickness of the finger and the brightness of the LEDs, and dividing one of those by the other gives the **ratio of ratios** $R$:

$$
R = \frac{AC_{\text{red}} / DC_{\text{red}}}{AC_{\text{IR}} / DC_{\text{IR}}}
$$

A low $R$ means well-oxygenated blood. Each manufacturer turns $R$ into SpO₂ with a calibration curve measured on healthy volunteers breathing low-oxygen gas mixtures. A commonly quoted straight-line approximation is $\text{SpO}_2 \approx 110 - 25R$, so $R = 0.5$ reads about 97% and $R = 1$ reads about 85%. Because the calibration comes from volunteers whose saturation was taken down only to about 70%, readings below that are less certain.

## The pleth waveform (photoplethysmogram)

![The parts of one pleth pulse: a steep systolic upstroke to the systolic peak, a dicrotic notch, then a smaller diastolic or reflected wave; a vertical arrow marks the pulse amplitude (AC), a horizontal bracket marks the beat-to-beat interval used for the pulse rate, and a box defines the perfusion index as AC divided by DC times 100 per cent](./pleth-pulse-anatomy.svg)

The pleth trace is the pulsing (AC) part of the infrared signal, plotted against time. Light reaching the detector falls as blood volume rises, so monitors turn the signal upside down to make each pulse point upwards. A normal pleth pulse has:

- a steep upstroke as the pressure wave from the heart arrives;
- a rounded systolic peak;
- a **dicrotic notch**, a small dip on the way down, linked to the closing of the aortic valve and to pressure waves reflected back from the lower body;
- a smaller diastolic wave after the notch, then a slow fall to the start of the next pulse.

The notch is clearest in young people with elastic arteries. It fades with age and stiffer arteries, and with cold or vasoconstricted fingers. Breathing also makes the pulse heights and the baseline rise and fall slightly from breath to breath.

### Plethysmograph, photoplethysmography and PPG

These words describe the same kind of measurement at different levels:

- A plethysmograph is any instrument that measures changes in the volume of part of the body. A body plethysmograph, the sealed "body box" used in lung function tests, is one; the pulse oximeter's light sensor is another.
- Photoplethysmography (PPG) is the optical method: measuring volume changes in tissue through changes in absorbed light. Smartwatches and fitness bands use green-light PPG for heart rate.
- A photoplethysmogram, PPG signal or pleth waveform is the trace it produces. On a patient monitor the channel is labelled "Pleth".

### Perfusion index

The **perfusion index** (PI) is the pulse amplitude as a percentage of the steady signal:

$$
\text{PI} = \frac{AC_{\text{IR}}}{DC_{\text{IR}}} \times 100\%
$$

It measures how strong the pulse is at the sensor, which depends on blood flow to the skin. Warm, well-perfused fingers give a PI of a few per cent; cold, constricted fingers give a fraction of 1%. In one study of critically ill adults, a PI below 1.4 identified patients with poor peripheral perfusion. A low PI also means the signal is small compared with noise, so the SpO₂ and pulse rate become less reliable.

## Pleth problems: low perfusion, motion artefact and other errors

| Problem | What the pleth looks like | Effect on the numbers |
| --- | --- | --- |
| Low perfusion (cold hands, shock, vasoconstricting drugs) | Small, rounded pulses with no notch. Auto-scaling can make them look normal size, but the PI is low | SpO₂ and pulse rate wander or drop out |
| Motion artefact (shivering, tapping, transport) | Large, irregular waves that hide the pulses | Missed or extra beats give a wrong pulse rate. Movement changes the red and infrared signals by about the same fraction, so $R$ is pulled towards 1 and SpO₂ falsely towards about 85% |
| Poor probe fit or bright room light | Noisy or flat trace | Readings unstable or missing |
| Carbon monoxide poisoning | Normal-looking pleth | Carboxyhaemoglobin is read as if it were oxyhaemoglobin, so SpO₂ reads falsely high |
| Darker skin pigmentation | Normal-looking pleth | Readings can be higher than the true saturation. A 2020 study found hidden low oxygen levels about three times as often in Black patients as in white patients |
| Nail varnish, dyes such as methylene blue | Often normal-looking | Readings can be falsely low or high |

A good pleth is the quickest check on whether to believe an SpO₂ number: regular pulses with a clear upstroke, at the same rate as the ECG.

## How monitors draw capnogram and pleth traces

Bedside monitors show these waveforms in sweep mode: each trace stays still and a write point moves from left to right, overwriting the previous sweep a little ahead of it (see sweeping vs scrolling in the [strip chart](/learn/real-time/strip-chart/) guide). The time on screen is set by the **sweep speed** in millimetres per second.

| Trace | Typical default sweep speeds | Why |
| --- | --- | --- |
| ECG | 25 mm/s (sometimes 50 mm/s) | Matches ECG paper, so intervals can be read the same way |
| Pleth | 25 mm/s | Keeps the pulses in step with the ECG above it |
| CO₂ and respiration | 6.25 mm/s, with 3.13 or 12.5 mm/s as options | Breaths are slow; at 6.25 mm/s several breaths fit across the screen |

The time window is the trace width divided by the sweep speed. On a 150 mm wide trace, 25 mm/s shows 6 seconds and 6.25 mm/s shows 24 seconds. A capnogram swept too fast looks stretched and shows one breath at a time; a pleth swept too slowly squashes the pulses so the notch can't be seen.

The two traces are also scaled differently. The CO₂ trace has a fixed scale in mmHg (often 0–50 or 0–75), so its height can be read as a value. The pleth is usually auto-scaled (auto-gain): the monitor stretches it to fill its space, because its absolute size depends on the finger, not on oxygen. That is why a low-perfusion pleth can look as tall as a healthy one, and why monitors show the PI or a signal-quality bar beside it.

The numbers are worked out from the waveforms. EtCO₂ is the peak of each breath and the respiratory rate comes from the time between breaths, often averaged over several. SpO₂ is averaged over several seconds to smooth out noise, so it lags behind sudden changes, and a finger probe reacts more slowly than an earlobe probe. Sidestream capnographs add the gas transit delay on top.

### Capnogram and pleth alongside the ECG

On a patient monitor the pleth sits under the [ECG](/learn/applications/ecg/), and the capnogram under that. Each pleth pulse arrives at the finger a fraction of a second after the ECG's R wave, the time the pressure wave takes to travel from the heart. Comparing the two is a quick check on both: a pulse rate that matches the heart rate means the oximeter is seeing real pulses, and a heart rate higher than the pulse rate (a pulse deficit) can mean some beats, for example in atrial fibrillation, are too weak to reach the finger. SciChart's [JavaScript vital signs monitor](https://www.scichart.com/demo/javascript/vital-signs-ecg-medical-chart-example) shows ECG, blood pressure, pleth and respiration together.

## Capnography vs pulse oximetry vs ECG

| | Capnography | Pulse oximetry | ECG |
| --- | --- | --- | --- |
| Measures | CO₂ in exhaled gas | Oxygen saturation of arterial blood, and the pulse | Electrical activity of the heart |
| Tells you about | Ventilation: is air moving in and out, and how much | Oxygenation: is blood carrying enough oxygen | Heart rate and rhythm |
| Responds to a stopped breath | Within one breath: the waveform goes flat | Late: SpO₂ falls only once oxygen stores run down, which can take minutes with supplemental oxygen | Late, and only indirectly |
| Main waveform | Capnogram | Pleth (PPG) | ECG trace |
| Typical sweep speed | 6.25 mm/s | 25 mm/s | 25 mm/s |
| Common failure | Blocked or leaking sampling line | Motion, low perfusion | Electrode noise, movement |

The two respiratory monitors answer different questions, and each covers the other's blind spot. A study of patients breathing supplemental oxygen found that pulse oximetry detected hypoventilation late or not at all, while CO₂ monitoring showed it at once.

## Common capnography and pleth mistakes

- **Trusting the number without the waveform.** An EtCO₂ value with no proper capnogram behind it, or an SpO₂ with a messy pleth, may be measuring noise. Check the shape first.
- **Reading a normal SpO₂ as "breathing is fine".** With supplemental oxygen, saturation can stay normal while CO₂ builds up from slow, shallow breathing. The capnogram shows hypoventilation long before the oximeter does.
- **Taking EtCO₂ as the arterial CO₂.** EtCO₂ is usually a few mmHg lower, and the gap widens with lung disease or low cardiac output. Check it against a blood gas when it matters.
- **Ignoring a raised baseline.** A capnogram whose baseline doesn't return to zero is a warning about the breathing circuit, even if EtCO₂ looks normal.
- **Judging perfusion by the height of the pleth.** The pleth is auto-scaled; read the perfusion index or the signal-quality indicator instead.
- **Comparing traces drawn at different sweep speeds.** A shape changes with the sweep speed. Note the speed before comparing a trace with a reference picture or an earlier recording.
- **Forgetting the delays.** A sidestream reading trails the breath by the transit time, and SpO₂ is averaged over several seconds. Neither shows the patient's state at that exact moment.

## How to build a capnography and pleth monitor display in JavaScript, React or Angular

Patient monitors redraw several waveforms at 100 or more samples a second each, around the clock. SciChart.js draws with WebGL and WebGPU, and its data series have a built-in sweeping mode, so monitor-style traces stay smooth even with many channels on one screen. The demo below simulates a patient and runs the samples through the same kind of logic a monitor uses: it finds each breath in the CO₂ signal for EtCO₂, inspired CO₂ and respiratory rate, and works out SpO₂ from the ratio of ratios, the perfusion index and the pulse rate from raw red and infrared light.

Change **Breathing** to see a shark fin, rebreathing, hypoventilation or apnoea (the apnoea alarm fires after 10 seconds, a short setting for the demo). Change **Pleth** to low perfusion or motion artefact, and watch what happens to SpO₂, the pulse rate and the PI. **CO₂ sweep** and **Pleth sweep** set each trace's sweep speed. **Pause** stops the sweep: then scroll to zoom in time, drag to pan, double-click to reset, and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={640} name="./Basic/demo" />

<LearnCta position="top" chart="patient monitor" demo="vital-signs-ecg-medical-chart-example" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for this chart. The monitor algorithms are plain JavaScript; SciChart.js draws the two sweeping traces.

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
        EAutoRange,
        SciChartJsNavyTheme,
        CursorModifier
    } from "scichart";

    const SAMPLE_RATE = 100; // samples per second from your monitor
    const SECONDS_ON_SCREEN = 24; // 6.25 mm/s on a 150 mm trace

    // One sweeping trace. Pass a range for a fixed scale (CO2), or leave it out to auto-scale (pleth)
    const makeSweepTrace = (channel: string, title: string, color: string, range?: NumberRange) =>
        async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, {
                    axisTitle: "Time in sweep (s)",
                    autoRange: EAutoRange.Never,
                    visibleRange: new NumberRange(0, SECONDS_ON_SCREEN)
                })
            );
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    axisTitle: title,
                    autoRange: range ? EAutoRange.Never : EAutoRange.Always,
                    visibleRange: range
                })
            );
            const capacity = SECONDS_ON_SCREEN * SAMPLE_RATE;
            const dataSeries = new XyDataSeries(wasmContext, {
                fifoCapacity: capacity, // one screen of samples
                fifoSweeping: true, // overwrite from left to right, like a monitor
                fifoSweepingGap: SAMPLE_RATE / 2
            });
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: color, strokeThickness: 2 })
            );
            sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));

            // New samples from your monitor or device feed
            let written = 0;
            const unsubscribe = subscribeToYourWaveform(channel, (values: number[]) => {
                const xValues = values.map((_, i) => ((written + i) % capacity) / SAMPLE_RATE);
                written += values.length;
                dataSeries.appendRange(xValues, values);
            });
            sciChartSurface.addDeletable({ delete: unsubscribe });
            return { sciChartSurface };
        };

    const initCapnogram = makeSweepTrace("co2", "CO₂ (mmHg)", "#F6E05E", new NumberRange(0, 70));
    const initPleth = makeSweepTrace("pleth", "Pleth", "#50C7E0");

    export const PatientMonitorTraces = () => (
        <div>
            <SciChartReact initChart={initCapnogram} style={{ width: "100%", height: 200 }} />
            <SciChartReact initChart={initPleth} style={{ width: "100%", height: 200 }} />
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
        EAutoRange,
        SciChartJsNavyTheme,
        CursorModifier
    } from "scichart";

    const SAMPLE_RATE = 100; // samples per second from your monitor
    const SECONDS_ON_SCREEN = 24; // 6.25 mm/s on a 150 mm trace

    // One sweeping trace. Pass a range for a fixed scale (CO2), or leave it out to auto-scale (pleth)
    const makeSweepTrace = (channel: string, title: string, color: string, range?: NumberRange) =>
        async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, {
                    axisTitle: "Time in sweep (s)",
                    autoRange: EAutoRange.Never,
                    visibleRange: new NumberRange(0, SECONDS_ON_SCREEN)
                })
            );
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    axisTitle: title,
                    autoRange: range ? EAutoRange.Never : EAutoRange.Always,
                    visibleRange: range
                })
            );
            const capacity = SECONDS_ON_SCREEN * SAMPLE_RATE;
            const dataSeries = new XyDataSeries(wasmContext, {
                fifoCapacity: capacity, // one screen of samples
                fifoSweeping: true, // overwrite from left to right, like a monitor
                fifoSweepingGap: SAMPLE_RATE / 2
            });
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: color, strokeThickness: 2 })
            );
            sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));

            // New samples from your monitor or device feed
            let written = 0;
            const unsubscribe = subscribeToYourWaveform(channel, (values: number[]) => {
                const xValues = values.map((_, i) => ((written + i) % capacity) / SAMPLE_RATE);
                written += values.length;
                dataSeries.appendRange(xValues, values);
            });
            sciChartSurface.addDeletable({ delete: unsubscribe });
            return { sciChartSurface };
        };

    @Component({
        selector: "app-patient-monitor-traces",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `
            <scichart-angular [initChart]="initCapnogram" style="display: block; width: 100%; height: 200px"></scichart-angular>
            <scichart-angular [initChart]="initPleth" style="display: block; width: 100%; height: 200px"></scichart-angular>
        `
    })
    export class PatientMonitorTracesComponent {
        // scichart-angular creates each chart, sizes it and cleans it up
        initCapnogram = makeSweepTrace("co2", "CO₂ (mmHg)", "#F6E05E", new NumberRange(0, 70));
        initPleth = makeSweepTrace("pleth", "Pleth", "#50C7E0");
    }
    ```
</CodeSnippetBlock>

Key points:

- Each trace is a `FastLineRenderableSeries` over an `XyDataSeries` with `fifoCapacity` set to one screen of samples and `fifoSweeping: true`, so new points overwrite the oldest from left to right. `fifoSweepingGap` leaves a short blank ahead of the write point, as monitors do.
- The x-values wrap back to zero at the end of each sweep (`written % capacity`), and the x-axis stays fixed at the sweep window. Changing the sweep speed means a new data series with a new capacity.
- The CO₂ y-axis has a fixed `visibleRange` in mmHg; the pleth y-axis uses `EAutoRange.Always`, the chart's equivalent of a monitor's auto-gain.
- The capnometer and oximeter functions show how the numbers come from the waveforms: breath detection with two thresholds, EtCO₂ as the peak of each breath, and SpO₂ from the ratio of the red and infrared pulse heights.

**See it in the demo app:** [JavaScript vital signs monitor](https://www.scichart.com/demo/javascript/vital-signs-ecg-medical-chart-example) · [React vital signs monitor](https://www.scichart.com/demo/react/vital-signs-ecg-medical-chart-example) · [Angular vital signs monitor](https://www.scichart.com/demo/angular/vital-signs-ecg-medical-chart-example).

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/) and [real-time updates documentation](/2d-charts/chart-types/data-series-api/realtime-updates/), which covers sweeping FIFO series. For how medical device makers and researchers use SciChart, see [SciChart for medical charts and dashboards](https://www.scichart.com/why-scichart-medical-charts-dashboarding-for-research-and-healthcare/) and [SciChart for telehealth](https://www.scichart.com/telehealth/).

## Frequently asked questions

### What does a normal capnography waveform look like?

A normal capnogram repeats the same squared-off shape with every breath. It sits on a flat baseline at zero during inspiration, rises steeply when exhaled gas from the lungs reaches the sensor, runs along a nearly flat plateau that climbs slightly, and drops steeply back to zero when the next breath in begins. The value at the end of the plateau is the end-tidal CO2.

### What is a normal EtCO2?

In adults with healthy lungs, end-tidal CO2 is normally 35 to 45 mmHg, or about 4.7 to 6.0 kPa. It usually reads a few mmHg below the arterial CO2 level. A higher value suggests hypoventilation or rebreathing; a lower value suggests hyperventilation, poor blood flow to the lungs or a leak in the sampling system.

### What does a shark fin capnogram mean?

A shark fin capnogram has a slow, curved rise and a plateau that keeps sloping upwards instead of levelling off. It means the lungs are emptying unevenly because some airways are narrowed, as in bronchospasm, asthma or COPD. A partly blocked or kinked breathing tube can give a similar shape.

### What is a pleth waveform on a pulse oximeter?

The pleth waveform, short for plethysmograph, is the pulse oximeter's trace of how much light the blood in a finger or earlobe absorbs from moment to moment. It rises with each heartbeat as arterial blood swells the tissue. A clean, regular pleth with a sharp upstroke shows the sensor is picking up a real pulse, so the SpO2 and pulse rate readings can be trusted.

### What is the difference between capnography and pulse oximetry?

Capnography measures carbon dioxide in exhaled breath, so it shows ventilation, the movement of air in and out of the lungs, breath by breath. Pulse oximetry measures the oxygen saturation of arterial blood, so it shows oxygenation. Capnography shows a stopped or slowed breath within seconds, while SpO2 can stay normal for minutes, especially when the patient is breathing extra oxygen.

### How do I draw a capnogram or pleth waveform in JavaScript?

Use a line series with a first-in, first-out data buffer sized to one screen of samples, and set it to sweep, so new points overwrite the old ones from left to right as on a bedside monitor. Give the CO2 trace a fixed y-axis in mmHg and auto-scale the pleth trace. SciChart.js does this with FastLineRenderableSeries and an XyDataSeries using fifoCapacity and fifoSweeping.

## Sources

- Bhavani-Shankar, K. and Philip, J. H. (2000), [Defining segments and phases of a time capnogram](https://doi.org/10.1097/00000539-200010000-00038). *Anesthesia & Analgesia*, 91(4). Phases 0, I, II and III (and IV), and the alpha and beta angles.
- Siobal, M. S. (2016), [Monitoring exhaled carbon dioxide](https://doi.org/10.4187/respcare.04919). *Respiratory Care*, 61(10). Capnometry and capnography, mainstream and sidestream sensors, normal values, the arterial to end-tidal gradient and abnormal waveforms.
- Kodali, B. S. (2013), [Capnography outside the operating rooms](https://doi.org/10.1097/ALN.0b013e318278c8b6). *Anesthesiology*, 118(1). Uses in sedation, emergency care and resuscitation, and abnormal capnograms.
- American Society of Anesthesiologists, *Standards for Basic Anesthetic Monitoring*. Continual monitoring of exhaled CO₂ during general anaesthesia and moderate or deep sedation.
- Panchal, A. R. et al. (2020), [Part 3: Adult basic and advanced life support: 2020 American Heart Association guidelines for cardiopulmonary resuscitation and emergency cardiovascular care](https://doi.org/10.1161/CIR.0000000000000916). *Circulation*, 142(16 suppl 2). Waveform capnography for tube placement and during CPR.
- Royal College of Physicians (2017), *National Early Warning Score (NEWS) 2*. Respiratory rate scoring bands.
- ISO 80601-2-55: *Medical electrical equipment, particular requirements for respiratory gas monitors*; ISO 80601-2-61: *particular requirements for pulse oximeter equipment*.
- Nitzan, M., Romem, A. and Koppel, R. (2014), [Pulse oximetry: fundamentals and technology update](https://doi.org/10.2147/MDER.S47319). *Medical Devices: Evidence and Research*, 7. Red and infrared absorption, the ratio of ratios and calibration.
- Allen, J. (2007), [Photoplethysmography and its application in clinical physiological measurement](https://doi.org/10.1088/0967-3334/28/3/R01). *Physiological Measurement*, 28(3). The PPG waveform, the dicrotic notch and sources of artefact.
- Lima, A. P., Beelen, P. and Bakker, J. (2002), [Use of a peripheral perfusion index derived from the pulse oximetry signal as a noninvasive indicator of perfusion](https://doi.org/10.1097/00003246-200206000-00006). *Critical Care Medicine*, 30(6).
- Fu, E. S., Downs, J. B., Schweiger, J. W., Miguel, R. V. and Smith, R. A. (2004), [Supplemental oxygen impairs detection of hypoventilation by pulse oximetry](https://doi.org/10.1378/chest.126.5.1552). *Chest*, 126(5).
- Sjoding, M. W., Dickson, R. P., Iwashyna, T. J., Gay, S. E. and Valley, T. S. (2020), [Racial bias in pulse oximetry measurement](https://doi.org/10.1056/NEJMc2029240). *New England Journal of Medicine*, 383.
- National Institute of Standards and Technology, [How do you measure blood oxygen levels?](https://www.nist.gov/how-do-you-measure-it/how-do-you-measure-blood-oxygen-levels) Normal saturation range and the effect of skin pigmentation.

<LearnCta position="bottom" chart="patient monitor" demo="vital-signs-ecg-medical-chart-example" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
