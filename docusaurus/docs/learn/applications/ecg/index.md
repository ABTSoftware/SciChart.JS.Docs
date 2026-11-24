---
sidebar_position: 50
sidebar_label: ECG
title: "ECG Leads and How to Read an ECG Strip: Waves and Intervals"
description: "What an ECG records, the 12 ECG leads and where the electrodes go, the P-QRS-T waveform and normal intervals, ECG paper and heart rate, and a step-by-step way to read a strip, with a live ECG."
keywords:
    [
        "ecg leads",
        "12 lead ecg",
        "ecg strip",
        "how to read an ecg strip",
        "how to read an ecg",
        "ecg waveform",
        "ecg intervals",
        "ecg paper",
        "ecg electrode placement",
        "ecg lead placement",
        "limb leads",
        "precordial leads",
        "ecg heart rate calculation",
        "qtc calculation",
        "ekg strip"
    ]
image: /img/learn/ecg-og.png
related: [capnography-pulse-oximetry, strip-chart, notch-filter, high-pass-filter]
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
                    "name": "What are the 12 leads of an ECG?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The 12 leads are six limb leads and six chest leads. The limb leads, I, II, III, aVR, aVL and aVF, look at the heart in the frontal plane, from above, below and the sides. The chest (precordial) leads, V1 to V6, look at it in the horizontal plane, from the front of the chest round to the left side. Each lead is a voltage measured between electrodes, so it shows the same heartbeat from its own direction." }
                },
                {
                    "@type": "Question",
                    "name": "Why does a 12-lead ECG use only 10 electrodes?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A lead is a measurement, not a wire. The six limb leads are all calculated from three limb electrodes (right arm, left arm and left leg), and the six chest leads each compare one chest electrode with the average of those three. The tenth electrode, on the right leg, is a ground that reduces interference and isn't part of any lead." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read an ECG strip?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use the same order every time. Check the paper speed, gain and lead labels; work out the heart rate; decide whether the rhythm is regular and whether a P wave comes before every QRS complex; estimate the axis from leads I and aVF; measure the PR interval, QRS duration and QT interval; then look at the shape of each wave and segment. A trained clinician interprets the result alongside the patient." }
                },
                {
                    "@type": "Question",
                    "name": "What do the small and large squares on ECG paper mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "At the standard settings of 25 mm per second and 10 mm per millivolt, a small 1 mm square is 0.04 seconds wide and 0.1 mV tall, and a large 5 mm square is 0.2 seconds wide and 0.5 mV tall. Five large squares make one second, so a minute is 300 large squares or 1,500 small ones. That is where the 300 and 1,500 rules for heart rate come from." }
                },
                {
                    "@type": "Question",
                    "name": "What are the normal PR, QRS and QT intervals?",
                    "acceptedAnswer": { "@type": "Answer", "text": "In adults the PR interval is usually 120 to 200 ms (three to five small squares) and the QRS duration under 120 ms (three small squares). The QT interval depends on heart rate, so it is corrected to QTc; AHA/ACCF/HRS recommendations treat a QTc of 450 ms or more in men and 460 ms or more in women as prolonged. Normal ranges vary with age and between references." }
                },
                {
                    "@type": "Question",
                    "name": "How do I draw an ECG chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Plot the samples in millivolts against time with a line series, on fixed axes with major gridlines every 0.2 s and 0.5 mV and minor gridlines every 0.04 s and 0.1 mV, so the grid matches ECG paper. For a live monitor, append new samples to a FIFO data series in sweep mode, which redraws from left to right with a gap ahead of the newest point. SciChart.js does this with FastLineRenderableSeries and XyDataSeries with fifoSweeping." }
                }
            ]
        })}
    </script>
</head>

# ECG Leads and How to Read an ECG Strip

## What is an ECG?

An **electrocardiogram** (ECG, or EKG) is a recording of the heart's electrical activity, picked up by electrodes on the skin. It plots voltage against time, and each heartbeat draws the same sequence of waves: a P wave, a QRS complex and a T wave. A standard 12-lead ECG shows that activity from twelve directions at once.

![A simulated ECG rhythm strip of lead II on ECG paper, with a green trace sweeping across a grid of small and large squares and shaded calipers marking the PR interval, QRS duration and QT interval of the latest beat, in a dark navy theme](/img/learn/ecg-og.png)

*A simulated lead II rhythm strip on ECG paper, with the PR, QRS and QT intervals of the latest beat marked (sample data from a heart model, not a patient). [Try the interactive version](#how-to-build-an-ecg-chart-in-javascript-react-or-angular).*

This guide explains how ECG traces are recorded, drawn and read. It is not clinical guidance: ECGs are interpreted by trained clinicians, alongside the patient.

:::tip Key takeaways
- An ECG lead is a voltage between electrodes, not a wire: 10 electrodes give 12 leads, each viewing the heart from its own direction.
- Each beat draws a P wave (the atria), a QRS complex (the ventricles) and a T wave (the ventricles recovering).
- On standard paper (25 mm/s, 10 mm/mV) a small square is 0.04 s and 0.1 mV; a large square is 0.2 s and 0.5 mV.
- Heart rate is 300 divided by the large squares between two R waves, or 1,500 divided by the small squares.
- Read every strip in the same order: rate, rhythm, axis, intervals, then the shape of each wave.
:::

## What an ECG records

Each heartbeat starts with an electrical impulse in the sinoatrial (SA) node, a small cluster of cells high in the right atrium. The impulse spreads across both atria, which contract. It is delayed briefly in the atrioventricular (AV) node, then runs down the bundle of His and its branches into the Purkinje fibres, which spread it through the ventricles from the inside out. The ventricles contract, then their cells recover (repolarise), ready for the next beat.

As the wave of activation moves through the heart muscle, the cells it has reached and the cells it hasn't yet reached sit at different voltages. Seen from outside, the whole heart behaves like a single electrical arrow, a dipole, that swings round and changes length through each beat. The body conducts that field to the skin, where it measures about one millivolt.

An electrode pair records how much of the arrow points along the line between them. When the activation moves towards the positive electrode, the trace goes up; when it moves away, the trace goes down; when it moves at right angles, the trace barely moves. So the same beat looks different in each lead, depending on where the lead's electrodes sit.

"ECG" and "EKG" mean the same thing. EKG comes from the German spelling, *Elektrokardiogramm*, and is common in the United States, partly so that it isn't misheard as EEG, the recording of brain activity.

## ECG leads: what the 12 leads are

A **lead** is one voltage measurement: the difference between a positive electrode and a negative reference. A standard 12-lead ECG uses ten electrodes, four on the limbs and six on the chest, and calculates twelve leads from them. The leads fall into three groups.

![ECG electrode placement and lead directions. Left: the chest from the front with ten electrodes. RA and LA on the arms, LL on the left leg and RL on the right leg as the ground. V1 and V2 in the fourth intercostal space either side of the sternum, V4 in the fifth intercostal space on the midclavicular line, V3 halfway between V2 and V4, V5 on the anterior axillary line and V6 on the mid-axillary line level with V4. Top right: the limb leads as arrows in the frontal plane, I at 0 degrees, II at plus 60, aVF at plus 90, III at plus 120, aVL at minus 30 and aVR at minus 150. Bottom right: the chest leads V1 to V6 fanning round the horizontal plane from the front right to the left side. Colours group the leads as inferior, lateral, septal and anterior](./ecg-electrode-placement-and-leads.svg)

### Limb leads I, II and III

The three standard limb leads each measure between two limb electrodes. Together they form Einthoven's triangle around the heart:

| Lead | Positive electrode | Negative electrode | Points towards |
| --- | --- | --- | --- |
| I | Left arm | Right arm | 0°, the patient's left |
| II | Left leg | Right arm | +60°, down and to the left |
| III | Left leg | Left arm | +120°, down and to the right |

Because the three leads go round a closed loop of the same three electrodes, their voltages are linked at every instant: lead II equals lead I plus lead III (Einthoven's law). Lead II runs close to the usual direction of activation, so it usually shows the tallest, clearest P waves and QRS complexes, which is why monitors and rhythm strips default to it.

### Augmented limb leads aVR, aVL and aVF

The augmented leads use one limb electrode as the positive pole and the average of the other two as the reference. aVR looks from the right shoulder (−150°), aVL from the left shoulder (−30°) and aVF from the feet (+90°). "Augmented" refers to the way the reference is built, which makes the signal about 50% larger than measuring against all three electrodes. Activation normally moves away from the right shoulder, so most waves in aVR point downwards. Together with leads I, II and III, they divide the frontal plane every 30°: the hexaxial reference system.

### Chest (precordial) leads V1 to V6

Each chest lead compares one chest electrode with Wilson's central terminal, the average of the right arm, left arm and left leg electrodes. Because the electrodes sit close to the heart, they see the horizontal plane, from the front of the right ventricle (V1) round to the left side of the left ventricle (V6). Across V1 to V6 the R wave normally grows and the S wave shrinks; the lead where they are about equal, usually V3 or V4, is the transition zone.

### ECG electrode placement

| Electrode | Where it goes |
| --- | --- |
| V1 | Fourth intercostal space, just right of the sternum |
| V2 | Fourth intercostal space, just left of the sternum |
| V3 | Halfway between V2 and V4 |
| V4 | Fifth intercostal space, on the midclavicular line |
| V5 | Anterior axillary line, level with V4 |
| V6 | Mid-axillary line, level with V4 and V5 |
| RA, LA | Right and left arm, usually the wrists or upper arms |
| LL | Left leg, usually the ankle or lower leg |
| RL | Right leg: the ground, not part of any lead |

To find the fourth intercostal space, feel for the sternal angle (the ridge where the top of the breastbone joins its body) and move sideways onto the second rib. The gap just below it is the second intercostal space; count down two more gaps to the fourth. Placing V1 and V2 too high is one of the most common recording errors.

### Lead groups: which leads look at which part of the heart

Leads that face the same wall of the left ventricle are read together, because a change seen in two or more neighbouring (contiguous) leads is more meaningful than a change in one.

| Group | Leads | Faces |
| --- | --- | --- |
| Inferior | II, III, aVF | The bottom of the heart |
| Lateral | I, aVL, V5, V6 | The left side |
| Septal | V1, V2 | The wall between the ventricles |
| Anterior | V3, V4 | The front |
| None | aVR | Looks into the cavity from the right shoulder |

### Other lead systems

- **Monitoring leads.** Bedside and transport monitors often use three electrodes (giving leads I, II and III) or five (adding one chest lead), with the limb electrodes moved onto the torso so the patient can move.
- **Torso-placed limb electrodes** (the Mason-Likar position) are used for exercise tests. They change the waveform slightly, so the recording should be labelled.
- **Right-sided and posterior leads.** V3R and V4R mirror V3 and V4 on the right of the chest; V7 to V9 continue round the back. They are added to look at the right ventricle or the back wall.

## The ECG waveform: P, QRS, T and U waves

Each normal heartbeat draws a P wave, a QRS complex and a T wave, sometimes followed by a small U wave, and the intervals between them are what an ECG reader measures.

![Two heartbeats of lead II on ECG paper. The P wave, the Q, R and S waves and the T wave are labelled, with a small U wave after the T wave. Brackets mark the PR interval of 0.16 s (four small squares), the QRS duration of 0.09 s, the ST segment and the QT interval of 0.37 s. The RR interval between the two R waves is 0.80 s, four large squares or twenty small squares, so the heart rate is 300 divided by 4, or 1,500 divided by 20, which is 75 beats per minute. A 1 mV calibration pulse, 10 mm tall, is at the start. Below, a key shows a large square as 0.2 s by 0.5 mV and a small square as 0.04 s by 0.1 mV](./ecg-waveform-intervals.svg)

- **P wave.** Activation spreading through the atria. Small and rounded, normally upright in leads I and II.
- **PR segment.** The flat line after the P wave, while the impulse is delayed in the AV node.
- **QRS complex.** Activation of the ventricles. A Q wave is any first downward deflection, the R wave is the first upward one and an S wave is a downward one after the R. Not every lead shows all three, and the letters describe the shape: "rS" is a small r and a deep S.
- **ST segment.** The line from the end of the QRS (the J point) to the start of the T wave, when the ventricles are fully activated. It is normally close to the baseline.
- **T wave.** The ventricles recovering. Normally upright in most leads where the QRS is upright, and inverted in aVR.
- **U wave.** A small wave sometimes seen after the T wave, best in V2 and V3. Its origin is still debated.

Atrial recovery happens during the QRS complex and is hidden by it, which is why there is no wave for it.

## ECG intervals and normal values

Intervals are measured from the start of one wave to the start or end of another, in the lead where the edges are clearest.

| Measure | From → to | Typical adult range | In small squares |
| --- | --- | --- | --- |
| Heart rate | — | 60 to 100 beats per minute at rest | — |
| PR interval | Start of P → start of QRS | 120 to 200 ms | 3 to 5 |
| QRS duration | Start → end of QRS | Under 120 ms, usually 80 to 110 ms | Under 3 |
| QT interval | Start of QRS → end of T | Depends on heart rate: see QTc | — |
| QTc | QT corrected for rate | Prolonged at 450 ms or more (men), 460 ms or more (women) | — |
| RR interval | One R wave → the next | 0.6 to 1.0 s at 60 to 100 bpm | 15 to 25 |
| Frontal axis | Direction of the main QRS arrow | −30° to +90° | — |

Some references use 50 bpm as the lower limit of a normal resting rate, and children have faster rates and shorter intervals. Measured values depend on the lead and the method, so a machine's printed numbers can differ from a careful manual measurement by a few milliseconds.

### Correcting the QT interval for heart rate (QTc)

The QT interval shortens as the heart speeds up, so a raw QT can't be compared between recordings at different rates. A corrected QT (QTc) estimates what it would be at 60 beats per minute, where the RR interval is 1 second. With QT and RR in seconds, the two best-known formulas are:

$$
\mathrm{QTc}_{\mathrm{Bazett}} = \frac{QT}{\sqrt{RR}}
\qquad
\mathrm{QTc}_{\mathrm{Fridericia}} = \frac{QT}{\sqrt[3]{RR}}
$$

Bazett's formula is the most widely printed, but it over-corrects at fast rates and under-corrects at slow ones. Take a QT of 313 ms at 125 beats per minute (RR = 0.48 s):

- Bazett: $0.313 / \sqrt{0.48} = 0.313 / 0.693 \approx 0.452$ s, or 452 ms, just over the 450 ms threshold for men.
- Fridericia: $0.313 / \sqrt[3]{0.48} = 0.313 / 0.783 \approx 0.400$ s, or 400 ms, well within the normal range.

So the same recording can look prolonged with one formula and normal with the other. The [interactive ECG](#how-to-build-an-ecg-chart-in-javascript-react-or-angular) shows both side by side as you change the heart rate.

## ECG paper: small squares, large squares and calibration

ECG paper is printed with a grid of 1 mm squares, with every fifth line bolder. At the standard paper speed of 25 mm per second and gain of 10 mm per millivolt:

| | Width (time) | Height (voltage) |
| --- | --- | --- |
| Small square, 1 mm | 0.04 s (40 ms) | 0.1 mV |
| Large square, 5 mm | 0.2 s (200 ms) | 0.5 mV |
| 5 large squares | 1 s | — |
| 10 small squares | — | 1 mV |

Every recording starts with a calibration pulse: a 1 mV step that should be 10 mm (two large squares) tall. Check it before measuring. Some recordings are made at 50 mm/s, which stretches every wave to twice the width, or at half or double gain (5 or 20 mm/mV) to fit very large or very small complexes; the settings are printed on the strip.

### How to calculate heart rate from an ECG

A minute at 25 mm/s is 1,500 mm of paper: 300 large squares or 1,500 small ones. Three methods follow from that.

- 300 method: count the large squares between two consecutive R waves and divide 300 by that number. One large square is 300 bpm, then 150, 100, 75, 60 and 50 for two to six squares, a sequence worth memorising.
- 1,500 method: count the small squares between two R waves and divide 1,500 by it. It is more precise.
- 6-second method: count the QRS complexes in 6 seconds (30 large squares) and multiply by 10, or count them across a whole 10-second recording and multiply by 6. This is the only one of the three that works when the rhythm is irregular.

Worked examples:

| Strip | Count | Calculation | Heart rate |
| --- | --- | --- | --- |
| Regular, R waves 4 large squares apart | 4 large | 300 ÷ 4 | 75 bpm |
| The same strip, counted in small squares | 20 small | 1,500 ÷ 20 | 75 bpm |
| Regular, R waves 23 small squares apart | 23 small | 1,500 ÷ 23 | about 65 bpm |
| Irregular, 14 QRS complexes in a 10-second recording | 14 | 14 × 6 | about 84 bpm |

## How to read an ECG strip, step by step

A systematic order catches things a quick glance misses. The steps below follow the order taught in resuscitation and nursing courses for rhythm strips, with the extra checks used on a full 12-lead ECG.

1. Check the recording. Confirm the patient details, the paper speed, the gain and the calibration pulse, and that the leads are labelled. Look for artefact: a fuzzy, jittery baseline from muscle tremor, or a wandering one from breathing or movement.
2. Work out the heart rate with one of the methods above. Under 60 bpm is described as bradycardia and over 100 bpm as tachycardia.
3. Decide whether the rhythm is regular. Mark two or three R waves on a piece of paper (or use calipers) and slide it along the strip. Are the RR intervals the same, regularly irregular (a repeating pattern) or irregularly irregular (no pattern at all)?
4. Look at the atrial activity. Is there a P wave before every QRS complex, and a QRS after every P wave? Are the P waves upright in lead II and all the same shape? Is the PR interval constant?
5. Measure the QRS width. A narrow QRS (under 120 ms) means the ventricles were activated through the normal conduction system; a broad one means they weren't, for example a bundle branch block or a beat starting in the ventricle.
6. Estimate the axis (12-lead ECG only). See the table below.
7. Measure the intervals. PR and QT, and the QTc from the RR interval before the beat.
8. Look at the shape of each wave and segment. P wave size, Q waves, R wave progression across V1 to V6, the ST segments and the T waves, comparing contiguous leads.
9. Compare with any earlier ECG of the same person. A change matters more than a single value.

### Working out the axis from leads I and aVF

The QRS axis is the average direction of ventricular activation in the frontal plane. A quick estimate uses whether the QRS is mainly positive or negative in two leads at right angles:

| Lead I | Lead aVF | Axis | Description |
| --- | --- | --- | --- |
| Positive | Positive | 0° to +90° | Normal |
| Positive | Negative | 0° to −90° | Normal if lead II is positive (down to −30°); otherwise left axis deviation |
| Negative | Positive | +90° to +180° | Right axis deviation |
| Negative | Negative | −90° to ±180° | Extreme (northwest) axis |

For a finer estimate, find the limb lead where the QRS is most nearly equal up and down (isoelectric): the axis is at right angles to it.

## Common heart rhythms on an ECG strip

These are descriptions of how the strips look, not a guide to diagnosis.

| Rhythm | Rate | Regularity | P waves | QRS |
| --- | --- | --- | --- | --- |
| Normal sinus rhythm | 60 to 100 bpm | Regular | Upright in II, one before every QRS, constant PR | Narrow |
| Sinus tachycardia | Over 100 bpm | Regular | As sinus rhythm; may merge into the preceding T wave at fast rates | Narrow |
| Sinus bradycardia | Under 60 bpm | Regular | As sinus rhythm | Narrow |
| Atrial fibrillation | Varies | Irregularly irregular | None: a wavy, fibrillating baseline instead | Usually narrow |
| Premature ventricular complexes (PVCs) | Underlying rhythm | Early beats break the pattern | No P wave before the early beat | Early beat is broad and oddly shaped, with a T wave pointing the opposite way |

A sinus tachycardia is often a normal response, to exercise, fever or anxiety for example. In atrial fibrillation the atria are activated chaotically, several hundred times a minute, and the AV node lets impulses through at random intervals, so no two RR intervals match. A PVC is usually followed by a pause: the next normal beat arrives two normal cycles after the one before the PVC (a compensatory pause). Many other rhythms exist, such as atrial flutter, heart blocks and ventricular tachycardia; they are beyond this guide.

## How ECG monitors and recorders draw the trace

A paper recorder pulls paper past a pen at a constant speed. A screen does the same job in one of two ways. A **sweeping display** redraws the trace from left to right over the old one, leaving a small gap ahead of the newest point; it is what most patient monitors use, because the waveform stays still while it is drawn. A scrolling display moves the whole trace left as new data arrives. Both are explained in the [strip chart guide](/learn/real-time/strip-chart/).

Behind the trace, the signal is sampled, digitised and filtered before it is drawn. Diagnostic recorders typically sample at 500 times a second or more.

| Problem | What causes it | Filter that removes it |
| --- | --- | --- |
| Baseline wander | Breathing, movement, electrode contact | [High-pass filter](/learn/signal-processing/high-pass-filter/) |
| Mains hum at 50 or 60 Hz | Nearby power cables and equipment | [Notch filter](/learn/signal-processing/notch-filter/) |
| Fuzzy, jittery trace | Muscle activity, shivering | [Low-pass filter](/learn/signal-processing/low-pass-filter/) |

Filters change the waveform as well as the noise. The AHA recommendations for diagnostic ECGs set the low-frequency cut-off at 0.05 Hz (or up to 0.67 Hz with linear-phase digital filters) and the high-frequency cut-off at 150 Hz for adults. Monitors often offer a narrower "monitoring" band, for example around 0.5 to 40 Hz, which gives a steadier trace but can distort the ST segment and reduce small, sharp features such as pacemaker spikes. Check which filter mode a strip was recorded in before reading its ST segments.

A printed 12-lead ECG is usually 10 seconds long and laid out as three rows of four columns. Each column shows 2.5 seconds of three leads (I, II and III; then aVR, aVL and aVF; then V1 to V3; then V4 to V6), recorded at the same moment, and a 10-second rhythm strip of one lead, usually lead II, runs along the bottom.

### 12-lead ECG vs rhythm strip vs Holter vs wearable ECG

| | Leads | How long | Used for |
| --- | --- | --- | --- |
| Resting 12-lead ECG | 12 | 10 seconds | A full picture of the heart from all directions: axis, conduction, the walls of the ventricle |
| Monitor rhythm strip | 1 to 3 at a time, from 3 or 5 electrodes | Continuous, printed in 6 to 10 s strips | Watching rate and rhythm at the bedside or in an ambulance, with alarms |
| Holter or patch monitor | 1 to 3 (some record 12) | 24 hours to two weeks or more | Catching rhythm problems that come and go |
| Smartwatch or handheld ECG | Usually 1 (similar to lead I) | About 30 seconds, when the user starts it | Checking the rhythm when symptoms happen |

A single lead is enough to read rate and rhythm, but not axis, or changes confined to one wall of the heart.

## Common ECG reading mistakes

Many ECG misreadings come from how the trace was recorded, such as misplaced electrodes or the wrong gain, or from applying a rule of thumb where it doesn't fit.

- **Swapped arm electrodes.** Reversing the left and right arm electrodes turns lead I upside down (negative P wave, QRS and T wave) and swaps aVR with aVL and lead II with lead III. An inverted lead I with an upright aVR is the clue.
- **Chest electrodes in the wrong place.** V1 and V2 placed one or two spaces too high, or V4 to V6 placed by eye on a large chest, change the R wave progression and can mimic disease.
- **Ignoring the calibration pulse.** At half gain every wave looks half its true height; at 50 mm/s every interval looks twice as long.
- **Using the 300 rule on an irregular rhythm.** It gives a different answer for each pair of beats. Count the complexes over 6 or 10 seconds instead.
- **Reading artefact as an arrhythmia.** Tremor, a loose electrode or tapping on a lead wire can look like fast, chaotic beats. Normal QRS complexes marching through the noise at a regular rate give it away.
- **Measuring the QT in the wrong lead or including the U wave.** Use the lead with the longest clear QT, often II or V5, and end it where the T wave returns to the baseline.
- **Trusting Bazett's QTc at fast or slow rates.** Cross-check with Fridericia's formula when the rate is outside about 60 to 100 bpm.
- **Relying on the machine's printed interpretation.** Automated statements are a starting point. They miss things and over-call others, so the trace is always read by a person.

## How to build an ECG chart in JavaScript, React or Angular

The demo below sweeps twelve leads across the screen at 500 samples a second per lead, the rate of many diagnostic ECGs, and SciChart.js redraws every lead as new samples arrive. It simulates an ECG from a simple model of the heart's electrical activity: one rotating heart vector, seen by each lead from its own direction, so all twelve leads come from the same beats, and lead II always equals lead I plus lead III. It is sample data, not a patient recording.

Choose the **Layout**: a 4-second rhythm strip of one lead, about what a monitor screen shows, or the standard 12-lead layout with a lead II rhythm strip underneath. Pick a **Lead** to see the same beats from another direction: compare II with aVR, or V1 with V6. **Rhythm** switches between normal sinus rhythm, sinus tachycardia and bradycardia, atrial fibrillation and sinus rhythm with PVCs, and **Heart rate** sets the rate. **Show intervals** puts calipers on the latest normal beat, and the readouts give the rate, PR, QRS, QT and both QTc formulas. On most screen sizes the grid keeps the squares square, as on paper at 25 mm/s and 10 mm/mV. Hover for times and voltages. Press **Pause** to freeze the sweep, then scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={640} name="./Basic/demo" />

<LearnCta position="top" chart="ECG chart" demo="vital-signs-ecg-medical-chart-example" demoLabel="ECG vital signs chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line chart documentation" />

Here is the code for this chart. The heart model, the rhythms and the measurements are plain JavaScript; SciChart.js draws the ECG paper grid, the sweeping traces and the calipers. The React and Angular versions show the core of it: one lead sweeping across ECG paper, fed by your own data.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    const SAMPLE_RATE = 500; // samples per second
    const WINDOW = 6; // seconds across the screen

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });

        // ECG paper: minor gridlines every 0.04 s and 0.1 mV, major gridlines every 0.2 s and 0.5 mV
        const paper = {
            autoRange: EAutoRange.Never,
            autoTicks: false,
            drawMajorBands: false,
            majorGridLineStyle: { color: "#E0607E80", strokeThickness: 1 },
            minorGridLineStyle: { color: "#E0607E30", strokeThickness: 1 }
        };
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                ...paper,
                axisTitle: "Time in sweep (s)",
                majorDelta: 0.2,
                minorDelta: 0.04,
                visibleRange: new NumberRange(0, WINDOW)
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                ...paper,
                axisTitle: "mV",
                majorDelta: 0.5,
                minorDelta: 0.1,
                visibleRange: new NumberRange(-1, 2)
            })
        );

        // A sweeping FIFO buffer: new samples overwrite the oldest from left to right, with a 0.2 s gap
        const capacity = WINDOW * SAMPLE_RATE;
        const dataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: "Lead II",
            fifoCapacity: capacity,
            fifoSweeping: true,
            fifoSweepingGap: SAMPLE_RATE / 5,
            isSorted: false,
            containsNaN: false
        });
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#3BD16F", strokeThickness: 1.5 })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );

        // Append the samples that arrived since the last update; x wraps round to 0 at the end of each sweep
        let sample = 0;
        const timer = setInterval(() => {
            const millivolts: number[] = getYourNewEcgSamples(); // e.g. from a WebSocket or a device
            const times = millivolts.map(() => (sample++ % capacity) / SAMPLE_RATE);
            dataSeries.appendRange(times, millivolts);
        }, 33);
        sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });

        return { sciChartSurface };
    };

    export const EcgChart = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    const SAMPLE_RATE = 500; // samples per second
    const WINDOW = 6; // seconds across the screen

    @Component({
        selector: "app-ecg-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class EcgChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });

            // ECG paper: minor gridlines every 0.04 s and 0.1 mV, major gridlines every 0.2 s and 0.5 mV
            const paper = {
                autoRange: EAutoRange.Never,
                autoTicks: false,
                drawMajorBands: false,
                majorGridLineStyle: { color: "#E0607E80", strokeThickness: 1 },
                minorGridLineStyle: { color: "#E0607E30", strokeThickness: 1 }
            };
            sciChartSurface.xAxes.add(
                new NumericAxis(wasmContext, {
                    ...paper,
                    axisTitle: "Time in sweep (s)",
                    majorDelta: 0.2,
                    minorDelta: 0.04,
                    visibleRange: new NumberRange(0, WINDOW)
                })
            );
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    ...paper,
                    axisTitle: "mV",
                    majorDelta: 0.5,
                    minorDelta: 0.1,
                    visibleRange: new NumberRange(-1, 2)
                })
            );

            // A sweeping FIFO buffer: new samples overwrite the oldest from left to right, with a 0.2 s gap
            const capacity = WINDOW * SAMPLE_RATE;
            const dataSeries = new XyDataSeries(wasmContext, {
                dataSeriesName: "Lead II",
                fifoCapacity: capacity,
                fifoSweeping: true,
                fifoSweepingGap: SAMPLE_RATE / 5,
                isSorted: false,
                containsNaN: false
            });
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#3BD16F", strokeThickness: 1.5 })
            );
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true }),
                new MouseWheelZoomModifier(),
                new ZoomPanModifier(),
                new ZoomExtentsModifier()
            );

            // Append the samples that arrived since the last update; x wraps round to 0 at the end of each sweep
            let sample = 0;
            const timer = setInterval(() => {
                const millivolts: number[] = getYourNewEcgSamples(); // e.g. from a WebSocket or a device
                const times = millivolts.map(() => (sample++ % capacity) / SAMPLE_RATE);
                dataSeries.appendRange(times, millivolts);
            }, 33);
            sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });

            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Each trace is a `FastLineRenderableSeries` over an `XyDataSeries` of millivolts against time. NaN values break the line, which the 12-lead layout uses between columns and the sweep uses for the gap ahead of the newest point.
- The ECG paper is the axes' own gridlines: `autoTicks: false` with `majorDelta` and `minorDelta` set to 0.2 s and 0.04 s on the x-axis and 0.5 mV and 0.1 mV on the y-axis. The demo sets the y-axis range from the plot area's shape so that 1 s is as wide as 2.5 mV is tall, as on paper.
- The calipers are `BoxAnnotation`s with `TextAnnotation` labels, moved to the latest complete beat on each update.
- For a monitor fed by a device, `fifoCapacity` with `fifoSweeping` gives the sweeping display with no buffer code of your own, as in the React and Angular versions.

**See it in the demo app:** [JavaScript ECG vital signs chart](https://www.scichart.com/demo/javascript/vital-signs-ecg-medical-chart-example) · [React ECG vital signs chart](https://www.scichart.com/demo/react/vital-signs-ecg-medical-chart-example) · [Angular ECG vital signs chart](https://www.scichart.com/demo/angular/vital-signs-ecg-medical-chart-example), and for several live signals at once, [JavaScript real-time chart performance](https://www.scichart.com/demo/javascript/chart-realtime-performance-demo).

**Go deeper:** [SciChart.js line chart documentation](/2d-charts/chart-types/fast-line-renderable-series/), [real-time updates and FIFO sweeping](/2d-charts/chart-types/data-series-api/realtime-updates/) and the [box annotation documentation](/2d-charts/annotations-api/box-annotation/). For how SciChart is used in patient monitoring and medical research software, see [SciChart for medical charts and dashboards](https://www.scichart.com/why-scichart-medical-charts-dashboarding-for-research-and-healthcare/) and [SciChart for telehealth](https://www.scichart.com/telehealth/).

## Frequently asked questions

### What are the 12 leads of an ECG?

The 12 leads are six limb leads and six chest leads. The limb leads, I, II, III, aVR, aVL and aVF, look at the heart in the frontal plane, from above, below and the sides. The chest (precordial) leads, V1 to V6, look at it in the horizontal plane, from the front of the chest round to the left side. Each lead is a voltage measured between electrodes, so it shows the same heartbeat from its own direction.

### Why does a 12-lead ECG use only 10 electrodes?

A lead is a measurement, not a wire. The six limb leads are all calculated from three limb electrodes (right arm, left arm and left leg), and the six chest leads each compare one chest electrode with the average of those three. The tenth electrode, on the right leg, is a ground that reduces interference and isn't part of any lead.

### How do you read an ECG strip?

Use the same order every time. Check the paper speed, gain and lead labels; work out the heart rate; decide whether the rhythm is regular and whether a P wave comes before every QRS complex; estimate the axis from leads I and aVF; measure the PR interval, QRS duration and QT interval; then look at the shape of each wave and segment. A trained clinician interprets the result alongside the patient.

### What do the small and large squares on ECG paper mean?

At the standard settings of 25 mm per second and 10 mm per millivolt, a small 1 mm square is 0.04 seconds wide and 0.1 mV tall, and a large 5 mm square is 0.2 seconds wide and 0.5 mV tall. Five large squares make one second, so a minute is 300 large squares or 1,500 small ones. That is where the 300 and 1,500 rules for heart rate come from.

### What are the normal PR, QRS and QT intervals?

In adults the PR interval is usually 120 to 200 ms (three to five small squares) and the QRS duration under 120 ms (three small squares). The QT interval depends on heart rate, so it is corrected to QTc; AHA/ACCF/HRS recommendations treat a QTc of 450 ms or more in men and 460 ms or more in women as prolonged. Normal ranges vary with age and between references.

### How do I draw an ECG chart in JavaScript?

Plot the samples in millivolts against time with a line series, on fixed axes with major gridlines every 0.2 s and 0.5 mV and minor gridlines every 0.04 s and 0.1 mV, so the grid matches ECG paper. For a live monitor, append new samples to a FIFO data series in sweep mode, which redraws from left to right with a gap ahead of the newest point. SciChart.js does this with FastLineRenderableSeries and XyDataSeries with fifoSweeping.

## Sources

- Kligfield, P. et al. (2007), [Recommendations for the standardization and interpretation of the electrocardiogram, Part I: the electrocardiogram and its technology](https://doi.org/10.1161/CIRCULATIONAHA.106.180200). *Circulation*, 115(10). AHA/ACCF/HRS. Lead definitions, electrode placement, sampling and the 0.05 Hz and 150 Hz filter recommendations.
- Surawicz, B. et al. (2009), [Part III: intraventricular conduction disturbances](https://doi.org/10.1161/CIRCULATIONAHA.108.191095). *Circulation*, 119(10). QRS duration, bundle branch block and axis deviation.
- Rautaharju, P. M., Surawicz, B. and Gettes, L. S. (2009), [Part IV: the ST segment, T and U waves, and the QT interval](https://doi.org/10.1161/CIRCULATIONAHA.108.191096). *Circulation*, 119(10). QT measurement, rate correction and the 450 ms and 460 ms QTc thresholds.
- Becker, D. E. (2006), [Fundamentals of electrocardiography interpretation](https://pmc.ncbi.nlm.nih.gov/articles/PMC1614214/). *Anesthesia Progress*, 53(2). The conduction system, ECG paper, rate calculation and a systematic reading order.
- Sattar, Y. and Chhabra, L., [Electrocardiogram](https://www.ncbi.nlm.nih.gov/books/NBK549803/). *StatPearls*, NCBI Bookshelf. Leads, waves, intervals and normal values.
- Resuscitation Council UK, *Advanced Life Support*, 8th edition (2021), chapter on monitoring and rhythm recognition. The structured approach to reading rhythm strips.
- Joglar, J. A. et al. (2024), [2023 ACC/AHA/ACCP/HRS guideline for the diagnosis and management of atrial fibrillation](https://doi.org/10.1161/CIR.0000000000001193). *Circulation*, 149(1). The ECG features of atrial fibrillation.

<LearnCta position="bottom" chart="ECG chart" demo="vital-signs-ecg-medical-chart-example" demoLabel="ECG vital signs chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line chart documentation" />
