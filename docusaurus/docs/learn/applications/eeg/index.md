---
sidebar_position: 70
sidebar_label: EEG
title: "EEG: Brain Waves and How to Read an EEG (Interactive Example)"
description: "What an EEG records, the 10-20 electrode system, what an EEG test is like, delta to gamma brain waves, montages and artefacts, and a step-by-step way to read an EEG, with a live 19-channel EEG."
keywords:
    [
        "eeg",
        "what is an eeg",
        "eeg test",
        "eeg scan",
        "how to read an eeg",
        "eeg brain waves",
        "eeg waveforms",
        "eeg montage",
        "10-20 system",
        "eeg electrode placement",
        "alpha rhythm",
        "bipolar montage",
        "eeg artifacts",
        "eeg vs mri"
    ]
image: /img/learn/eeg-og.png
related: [ecg, mri, strip-chart, power-spectral-density]
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
                    "name": "What is an EEG test used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An EEG is used mainly to help diagnose and classify epilepsy, and to look into seizures, blackouts and unexplained episodes of confusion. It is also used in sleep studies, to monitor the brain in intensive care and during some operations, and in research and brain-computer interfaces. A specialist interprets it alongside the person's history and other tests." }
                },
                {
                    "@type": "Question",
                    "name": "How long does an EEG take?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A routine EEG appointment usually takes about an hour, including putting the electrodes on and taking them off; the recording itself is at least 20 minutes. Sleep EEGs take longer, ambulatory EEGs are worn at home for a day or more, and video EEG telemetry in hospital can last several days." }
                },
                {
                    "@type": "Question",
                    "name": "What do the lines on an EEG mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Each line is one channel: the voltage difference between two electrodes, or between one electrode and a reference, plotted against time. Channels are labelled with the electrode names, such as Fp1-F7, and listed from front to back. By convention an upward deflection means the first electrode is more negative than the second." }
                },
                {
                    "@type": "Question",
                    "name": "What are the five types of brain waves?",
                    "acceptedAnswer": { "@type": "Answer", "text": "EEG activity is grouped into frequency bands: delta (below 4 Hz), theta (4 to under 8 Hz), alpha (8 to 13 Hz), beta (14 to 30 Hz) and gamma (above 30 Hz). Slow bands dominate in deep sleep, alpha appears over the back of the head when an awake person closes their eyes, and beta goes with alertness." }
                },
                {
                    "@type": "Question",
                    "name": "What can an EEG see that an MRI cannot?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An EEG measures the brain's electrical activity as it happens, millisecond by millisecond, so it can show seizure activity, sleep stages and how the brain responds to stimuli. An MRI shows the brain's structure in fine detail, such as a tumour, scar or stroke, but not its electrical activity. The two are often used together." }
                },
                {
                    "@type": "Question",
                    "name": "How do I draw a real-time EEG chart in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Put every channel on one chart with one y-axis per channel, stacked vertically, and a shared time axis. Give each channel a FIFO data series with a capacity of one page of samples, and append each frame's new samples as typed arrays in one call per channel. SciChart.js does this with LeftAlignedOuterVerticallyStackedAxisLayoutStrategy, XyDataSeries with fifoCapacity and appendRange." }
                }
            ]
        })}
    </script>
</head>

# EEG: Brain Waves and How to Read an EEG

## What is an EEG?

An **electroencephalogram** (EEG) is a recording of the brain's electrical activity, picked up by small electrodes on the scalp. It plots a few microvolts against time, one line per channel, and shows rhythms such as the 10 Hz alpha rhythm, sleep patterns and seizure activity as they happen, millisecond by millisecond.

![A simulated 19-channel EEG on the 10-20 system in a dark navy theme. Channels Fp1 to O2 run down the left, each in its own lane on a shared time axis, left-hemisphere channels in blue, right in orange and midline in white. A marker shows where the eyes closed, and after it a regular 10 Hz alpha rhythm builds up in the occipital and parietal channels O1, O2, P3 and P4](/img/learn/eeg-og.png)

*A simulated 19-channel EEG in a referential montage: after the eyes close, a 10 Hz alpha rhythm appears over the back of the head (generated data, not a patient). [Try the interactive version](#how-to-build-a-real-time-eeg-chart-in-javascript-react-or-angular).*

This guide explains how an EEG is recorded, displayed and read. It is not medical advice: EEGs are interpreted by trained specialists (neurologists and clinical neurophysiologists) alongside the patient's history.

:::tip Key takeaways
- An EEG channel is a voltage between two electrodes, measured in microvolts; 19 scalp electrodes on the 10-20 system give a standard recording.
- Brain waves are grouped by frequency: delta (under 4 Hz), theta (4 to 8 Hz), alpha (8 to 13 Hz), beta (14 to 30 Hz) and gamma (over 30 Hz).
- The alpha rhythm over the back of the head should appear when the eyes close and fade when they open.
- The montage decides what each line shows; in a bipolar montage, a local event deflects neighbouring channels in opposite directions (phase reversal).
- Most odd-looking waves are artefacts: blinks, muscle, loose electrodes or mains hum.
:::

## What an EEG records

The cerebral cortex is folded into columns of pyramidal neurons, all lined up at right angles to the surface. When thousands of them receive synaptic input at the same time, the small currents in their dendrites add up to a field strong enough to reach the scalp. Single nerve impulses are too brief and too scattered to show; what the EEG sees is the summed, synchronised activity of several square centimetres of cortex.

By the time that field has passed through the cerebrospinal fluid, skull and scalp it is tiny: a few microvolts to around a hundred microvolts (µV), ten to a hundred times smaller than the heart's millivolt-sized signal on an [ECG](/learn/applications/ecg/). An EEG amplifier therefore measures the difference between electrodes, which cancels interference that reaches all of them equally, and amplifies it many thousands of times.

EEG's strength is timing. It follows the brain's activity with millisecond resolution, so it shows a seizure start, spread and stop, or the brain changing state as someone falls asleep. Its weakness is location: each electrode sees a blurred mix of a large area of cortex, and activity deep in the brain barely reaches the scalp.

## The 10-20 system: where the EEG electrodes go

Clinical EEG electrodes are placed by the **international 10-20 system**. The technologist measures the head from the nasion (the bridge of the nose) to the inion (the bump at the back of the skull) and from ear to ear, then places electrodes at 10% and 20% steps along those lines. Because the positions are proportional, the same electrode name sits over roughly the same part of the brain on every head, child or adult.

![The 10-20 electrode system and the longitudinal bipolar montage. Left: a head seen from above, nose at the top, with the 19 scalp electrodes. Letters name the region (Fp frontopolar, F frontal, T temporal, C central, P parietal, O occipital); odd numbers are on the left in blue, even numbers on the right in orange, z on the midline in grey. Along the nasion-inion line the electrodes are 10% then 20% apart. Right: the same electrodes joined by arrows into the five front-to-back chains of the double banana montage: Fp1-F7-T7-P7-O1, Fp1-F3-C3-P3-O1, Fz-Cz-Pz, Fp2-F4-C4-P4-O2 and Fp2-F8-T8-P8-O2](./eeg-10-20-system-montage.svg)

Each electrode name has two parts:

| Part | Meaning | Examples |
| --- | --- | --- |
| Letters | The region underneath: Fp frontopolar, F frontal, T temporal, C central, P parietal, O occipital, A ear | Fp1, F3, T7, C4, O2 |
| Odd number | Left side of the head | F3, C3, P3, O1 |
| Even number | Right side | F4, C4, P4, O2 |
| z (zero) | The midline | Fz, Cz, Pz |
| Smaller number | Closer to the midline | F3 is nearer the midline than F7 |

A standard adult EEG uses 19 scalp electrodes plus two ear electrodes (A1 and A2) and a ground. The American Clinical Neurophysiology Society (ACNS) renamed four of them to fit the denser 10-10 system: T3 and T4 became T7 and T8, and T5 and T6 became P7 and P8. Older textbooks and many reports still use the old names. Research systems use 32, 64 or 256 electrodes in the 10-10 or 10-5 layouts.

## What happens during an EEG test

For a routine EEG, a technologist (often called a clinical physiologist in the UK) measures the head, marks the positions and fixes small metal disc electrodes to the scalp with conductive paste, or fits a cap with the electrodes built in. The test is painless: the electrodes only listen, and nothing is passed into the head. The hospital sends instructions beforehand, for example about hair products, or about sleep before a sleep-deprived EEG; follow those.

The person lies or sits quietly while the EEG records. During the recording they are asked to:

- open and close their eyes, which checks that the alpha rhythm reacts normally;
- breathe deeply and quickly for a few minutes (hyperventilation);
- look at a flashing light at different rates (photic stimulation).

The last two can bring out abnormal activity in some types of epilepsy, so the technologist watches closely and stops if needed. The appointment usually takes about an hour, and the recording itself lasts at least 20 minutes. A specialist reviews the recording afterwards, so results are not usually given on the day.

| Type of EEG | What it involves | Why it's used |
| --- | --- | --- |
| Routine EEG | About an hour in a clinic, awake | The first test for most people |
| Sleep or sleep-deprived EEG | Recorded while the person sleeps, sometimes after a night of little sleep | Some abnormalities appear only in drowsiness or sleep |
| Ambulatory EEG | A portable recorder worn at home for one or more days | Catching events that happen during daily life |
| Video EEG telemetry | EEG and video recorded together in hospital, often for several days | Recording the events themselves, to see what the brain does during them |
| Continuous EEG (ICU) | Hours to days at the bedside | Watching for seizures in people who are unconscious or very ill |

## EEG brain waves: delta, theta, alpha, beta and gamma

EEG activity is described by its frequency: how many waves pass per second, in hertz (Hz). The bands have Greek letters, and their boundaries are set in the international glossary of EEG terms.

![EEG brain waves: one second each of delta, theta, alpha, beta and gamma activity drawn on the same time scale. Delta (0.5 to 4 Hz) is slow and large, seen in deep sleep; theta (4 to 8 Hz) appears in drowsiness; alpha (8 to 13 Hz) is the relaxed, eyes-closed rhythm over the back of the head; beta (14 to 30 Hz) is low and fast, with alertness; gamma (over 30 Hz) is faster and smaller still](./eeg-brain-wave-bands.svg)

| Band | Frequency | Where and when it is normal | When it can be abnormal |
| --- | --- | --- | --- |
| Delta (δ) | Under 4 Hz (0.5 Hz in practice) | Deep (N3) sleep; infants | Prominent in an awake adult, especially if it stays in one area |
| Theta (θ) | 4 to under 8 Hz | Drowsiness and light sleep; awake children | Excessive or focal in an awake adult |
| Alpha (α) | 8 to 13 Hz | Awake and relaxed with the eyes closed, over the back of the head | Missing on one side, or a slow posterior rhythm in an adult |
| Beta (β) | 14 to 30 Hz | Awake and alert, mainly over the front and centre | Very prominent with some sedative drugs (benzodiazepines, for example) |
| Gamma (γ) | Over 30 Hz | Studied in research, during perception and attention | Hard to measure on the scalp, because muscle activity overlaps it |

Amplitude matters too. A normal awake adult EEG is measured in tens of microvolts, with the alpha rhythm often the largest feature; deep-sleep delta waves are larger. Very low voltage everywhere, or a big difference between the two sides of the head, is something the reader notes.

### The alpha rhythm and what happens when you close your eyes

The **alpha rhythm**, also called the posterior dominant rhythm, is the clearest landmark in an awake adult EEG. It is a regular rhythm of about 10 Hz, strongest at the occipital and parietal electrodes (O1, O2, P3, P4), which waxes and wanes in spindles of a second or two. It appears when the person relaxes with their eyes closed and is attenuated or blocked within a fraction of a second when they open their eyes or concentrate on something. This **reactivity** is one of the first things a reader checks: a posterior rhythm that is present, symmetrical and reactive is a sign of a normal background.

The alpha frequency also changes with age. It reaches the adult range during childhood and can slow a little in later life, which is why the reader compares it with what is expected for the person's age.

## EEG montages: bipolar vs referential

An EEG machine records every electrode against a common reference, then the reviewing software combines them into channels for display. The list of channels shown on screen is the **montage**. Changing the montage doesn't change the recording, only how it is drawn, and readers switch between montages to locate activity.

- **Referential montage.** Each channel is one electrode minus a reference: an ear electrode (A1 or A2), the average of all the electrodes (a common average reference, labelled "Avg"), or another chosen point. A local event is largest in its own channel, so amplitudes are easy to compare. The weakness is the reference itself: if the reference picks up the event too, it leaks into every channel.
- **Bipolar montage.** Each channel is the difference between two neighbouring electrodes, linked in chains. The most common is the **longitudinal bipolar montage**, nicknamed the **double banana** after the shape of its chains on a head diagram: four front-to-back chains over the left and right temporal and parasagittal areas, and a short one down the midline (the right-hand diagram above). A **transverse bipolar** montage links electrodes from ear to ear instead.

In a bipolar chain, an event under one electrode appears in the two channels that share it, deflecting them in opposite directions: in F8-T8 the electrode T8 is subtracted, and in T8-P8 it is added. This **phase reversal** points to the electrode at the centre of the event. Readers use it to locate abnormal activity, and to unmask artefacts: an electrode pop shows a perfect phase reversal at one electrode, with no field spreading to its neighbours, which brain activity almost never does.

**On an EEG, negative is up**: an upward deflection means input 1 is more negative than input 2. A blink makes the frontal electrodes more positive, so it appears as a downward wave in Fp1 and Fp2.

## How to read an EEG, step by step

A systematic order helps a reader avoid jumping to the most eye-catching wave, which is often an artefact. These are the steps EEG reports are built around. They describe how a recording is reviewed, not how to diagnose from one.

1. Check the settings. Note the montage, the sensitivity (commonly 7 µV/mm; the usual range is 5 to 10), the time base (10 to 20 seconds per screen, about 30 mm/s on paper), and the filters (low-frequency filter no higher than 1 Hz, high-frequency filter no lower than 70 Hz, notch filter off unless needed). A higher sensitivity number makes waves look smaller.
2. Read the channel labels. Channels run from front to back and are usually grouped left, midline and right. In colour displays the left hemisphere and right hemisphere are often drawn in different colours.
3. Find the patient's state. Awake, drowsy, asleep or unresponsive changes what is normal. Technologists annotate events such as "eyes closed", "hyperventilation" or "patient talking" on the recording.
4. Describe the background. Find the posterior dominant rhythm: its frequency, amplitude, symmetry between the two sides, and whether it blocks when the eyes open. Then look at the mix of frequencies over the front and centre of the head.
5. Compare left with right. The two hemispheres should look broadly similar. A persistent difference in amplitude or frequency over one area is worth noting.
6. Look for anything that stands out from the background. Note its shape (sharp or rounded), where it is largest, and whether it is a single wave, a burst or a rhythm that evolves over time.
7. Rule out artefact. Ask whether a physiological explanation from the brain fits its field: does it spread to neighbouring electrodes as brain activity would, or is it confined to one electrode, synchronised with the heartbeat or the eyes? See the artefact table below.
8. Check the responses to activation. Note what happened during hyperventilation, photic stimulation and sleep.
9. Write it up and compare. The report describes the findings, then a specialist relates them to the clinical question and to any earlier EEGs.

## Common EEG artefacts

An **artefact** is anything on the EEG that doesn't come from the brain. They are the most common thing on any recording, and some look like abnormal brain activity.

| Artefact | What it looks like | Where | How to tell |
| --- | --- | --- | --- |
| Eye blink | A large, slow wave lasting a quarter to half a second, downward in Fp channels | Fp1 and Fp2, fading quickly towards F3 and F4 | The eye is an electrical dipole (front positive), and it rolls up during a blink; nothing in O1 or O2 |
| Lateral eye movement | Slow waves of opposite polarity on the two sides | F7 and F8 | F7 and F8 move in opposite directions |
| Muscle (EMG) | Bursts of fast, spiky, high-frequency activity | Temporal and frontal channels (jaw and forehead muscles) | Frequencies far above the EEG's, often during talking, chewing or clenching |
| Electrode pop | A sudden steep jump followed by a slower return | One electrode only | Phase reversal at a single electrode, with no field in its neighbours |
| Mains hum (50 or 60 Hz) | A fine, even thickening of the trace | Often one or two channels with poor electrode contact | A constant frequency of 50 Hz (most of the world) or 60 Hz (North America and some other countries); a notch filter removes it |
| ECG | Small, regular spikes in time with the heartbeat | Often left temporal or ear electrodes | They line up with the QRS complex on a simultaneous ECG channel |
| Sweat or movement | Very slow drifting or swaying of the baseline | Several channels at once | Far slower than brain activity, often with a known cause |

A notch filter is a useful fix for mains hum, but the ACNS recommends using it only when other measures fail, because it can distort sharp waves. The cure is usually a better electrode contact. How notch filters work is explained in the [notch filter guide](/learn/applications/signal-processing/notch-filter/).

## EEG in sleep

Sleep is scored in 30-second pages (epochs) of a polysomnogram, which combines EEG with eye-movement and chin-muscle channels. The stages have characteristic EEG features:

| Stage | EEG features |
| --- | --- |
| Awake, eyes closed | Posterior alpha rhythm |
| N1 (light sleep) | Alpha fades and is replaced by low-voltage theta; vertex sharp waves over the centre of the head |
| N2 | Sleep spindles (short bursts at about 11 to 16 Hz) and K-complexes (large, sharp slow waves) |
| N3 (deep sleep) | Slow waves of 0.5 to 2 Hz, over 75 µV, in at least a fifth of the epoch |
| REM | Low-voltage, mixed-frequency EEG like light sleep, with rapid eye movements and very low muscle tone |

A night's sleep cycles through these stages several times. Some EEG abnormalities show up only in drowsiness or sleep, which is why a sleep or sleep-deprived EEG is sometimes requested.

## What EEG is used for

- Epilepsy, the main clinical use: helping to confirm that seizures are epileptic, to tell different types of epilepsy apart, and to plan treatment or surgery. A normal EEG between seizures does not rule epilepsy out, and an abnormal one doesn't prove it.
- Unexplained episodes such as blackouts, confusion or unusual behaviour, often with video EEG to record an episode.
- Intensive care: continuous EEG watches for seizures without visible movement (non-convulsive seizures) and follows the depth of coma or sedation.
- Anaesthesia: depth-of-anaesthesia monitors process the EEG into a single index of how deeply anaesthetised a patient is.
- Sleep medicine: EEG is the core of a polysomnogram for sleep disorders.
- Brain-computer interfaces and research: EEG headsets detect changes such as motor imagery or attention to drive cursors and spellers, and researchers study event-related potentials and oscillations. They often analyse the [power spectral density](/learn/applications/signal-processing/power-spectral-density/) of each channel, computed with the [fast Fourier transform](/learn/applications/signal-processing/fast-fourier-transform/) over short [windowed](/learn/applications/signal-processing/window-functions/) segments, as the band-power chart in the demo does.

### What does seizure activity look like on an EEG?

This is a description of how such recordings appear, not a guide to reading them. Between seizures, some people with epilepsy show brief epileptiform discharges: spikes (lasting 20 to under 70 ms) and sharp waves (70 to 200 ms) that stand out from the background, sometimes followed by a slow wave. During a seizure, the EEG typically shows a new rhythm that builds up and changes in frequency, amplitude or location over seconds, then stops, often followed by slowing. Many things mimic these patterns, including artefacts and normal variants, which is why EEG interpretation needs specialist training.

## EEG vs MRI vs MEG

EEG is one of several ways to study the brain. They answer different questions and are often combined.

| | EEG | MRI | MEG |
| --- | --- | --- | --- |
| Measures | Electrical potentials on the scalp | Structure (and, with fMRI, blood-oxygen changes) | Magnetic fields from the same currents EEG sees |
| Timing | Milliseconds | Seconds (fMRI); structure is a snapshot | Milliseconds |
| Locating the source | Blurred by the skull and scalp | Millimetre detail | Better than EEG, as the skull distorts magnetic fields much less |
| Equipment | Portable; bedside, home or ambulance | A large scanner with a strong magnet | A magnetically shielded room and very sensitive sensors |
| Best for | Seizures, sleep, monitoring over hours or days | Tumours, strokes, scars, malformations | Locating epileptic activity before surgery, research |

An EEG shows what the brain is doing, moment by moment, which an MRI can't. An MRI shows what the brain looks like, including a structural cause for seizures. The [MRI guide](/learn/applications/mri/) explains how MRI images are made and read.

## Common mistakes when reading an EEG

- **Reading artefacts as brain activity.** Blinks, eye movements, muscle and electrode pops are the most frequent cause of misreading. Check the field: brain activity spreads to neighbouring electrodes.
- **Overcalling normal variants.** Sharp-looking waves in drowsiness and several benign patterns look alarming but are normal. Over-reading them can lead to a wrong label of epilepsy.
- **Ignoring the montage.** The same event looks different in referential and bipolar montages, and in a referential montage an active reference (an ear electrode near temporal activity, say) can make it appear in the wrong channels. Look in more than one montage.
- **Forgetting the sensitivity.** At 15 µV/mm normal activity looks flat; at 3 µV/mm it looks huge. Check the setting before calling anything high or low amplitude.
- **Filtering too much.** Raising the low-frequency filter hides slow waves, and lowering the high-frequency filter makes muscle look like spikes. Leave filters at the standard settings unless there's a reason.
- **Forgetting the state.** Theta in drowsiness is normal; the same theta in a fully alert adult may not be. Check the technologist's annotations.
- **Treating one EEG as the final answer.** A single normal recording between seizures doesn't exclude epilepsy. The specialist interprets the EEG with the history and other tests.

## How to build a real-time EEG chart in JavaScript, React or Angular

An EEG viewer needs many channels on one page, a fixed time base and smooth scrolling as samples stream in, which is the kind of real-time, multi-channel work SciChart.js is built for. The demo below streams 19 channels of simulated EEG at 256 samples per second, up to 1,000, all on one chart: each channel has its own lane on a vertically stacked y-axis, and every lane shares one time axis. The side panel shows the live load: 19 channels × 256 Hz is 4,864 new points per second, and at 1,000 Hz with a 20-second page the chart holds 380,000 points while redrawing every frame. The EEG is generated by a model, not recorded from a person: 1/f-like background noise, correlated between neighbouring electrodes, with an alpha rhythm over the back of the head.

Press **Close eyes** and watch alpha build up in O1, O2, P3 and P4 within a second; the band-power chart on the right shows the alpha bar rise. Switch the **Montage** between referential (average reference) and bipolar (double banana) to see the same data redrawn. Add a **Blink**, a burst of **Muscle** or an **Electrode pop**, then compare where each appears in the two montages. Turn on **Mains hum** at 50 or 60 Hz, then the **Notch filter**. Choose **Scroll** or **Sweep**, a **Sample rate**, the **Time base** and the **Sensitivity** in µV/mm. Hover for the voltage of every channel at that moment; scroll to zoom in time, drag to pan, and press **Resume** to go back to the live view.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="EEG chart" demo="vertically-stacked-axes" demoLabel="vertically stacked axes chart" docs="/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout/" docsLabel="SciChart.js vertically stacked axes documentation" />

Here is the code for this chart. The EEG model, the band-power calculation and the controls are plain JavaScript; SciChart.js draws the stacked channels, the scrolling or sweeping traces and the event markers. The React and Angular versions show the core of it: N channels on stacked y-axes, streaming your own samples.

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
        EAxisAlignment,
        EXyDirection,
        FastLineRenderableSeries,
        XyDataSeries,
        LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier
    } from "scichart";

    const CHANNELS = ["Fp1-F7", "F7-T7", "T7-P7", "P7-O1", "Fp1-F3", "F3-C3", "C3-P3", "P3-O1", "Fz-Cz", "Cz-Pz",
        "Fp2-F4", "F4-C4", "C4-P4", "P4-O2", "Fp2-F8", "F8-T8", "T8-P8", "P8-O2"];
    const SAMPLE_RATE = 256; // samples per second, per channel
    const SECONDS = 10; // one page

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        const xAxis = new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Never, majorDelta: 1, autoTicks: false });
        sciChartSurface.xAxes.add(xAxis);

        // One y-axis per channel, stacked down the left side, negative up as on an EEG
        sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy = new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();
        const dataSeries = CHANNELS.map((name, i) => {
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    id: `ch${i}`,
                    axisAlignment: EAxisAlignment.Left,
                    axisTitle: name,
                    axisTitleStyle: { fontSize: 12, rotation: 0 },
                    visibleRange: new NumberRange(-50, 50), // µV
                    autoRange: EAutoRange.Never,
                    flippedCoordinates: true,
                    drawLabels: false,
                    drawMajorGridLines: false,
                    drawMinorGridLines: false
                })
            );
            const series = new XyDataSeries(wasmContext, {
                dataSeriesName: name,
                fifoCapacity: SAMPLE_RATE * SECONDS, // keeps one page, discards older samples
                isSorted: true,
                containsNaN: false
            });
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { yAxisId: `ch${i}`, dataSeries: series, stroke: "#50C7E0" })
            );
            return series;
        });
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection })
        );

        // Append the samples that arrived since the last frame: one appendRange per channel, as typed arrays
        let sample = 0;
        let frame = requestAnimationFrame(function update() {
            const { times, channels }: { times: Float64Array; channels: Float64Array[] } = getYourNewEegSamples(); // e.g. from a WebSocket
            channels.forEach((values, i) => dataSeries[i].appendRange(times, values));
            sample += times.length;
            const now = sample / SAMPLE_RATE;
            xAxis.visibleRange = new NumberRange(now - SECONDS, now);
            frame = requestAnimationFrame(update);
        });
        sciChartSurface.addDeletable({ delete: () => cancelAnimationFrame(frame) });

        return { sciChartSurface };
    };

    export const EegChart = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 600 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EXyDirection,
        FastLineRenderableSeries,
        XyDataSeries,
        LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier
    } from "scichart";

    const CHANNELS = ["Fp1-F7", "F7-T7", "T7-P7", "P7-O1", "Fp1-F3", "F3-C3", "C3-P3", "P3-O1", "Fz-Cz", "Cz-Pz",
        "Fp2-F4", "F4-C4", "C4-P4", "P4-O2", "Fp2-F8", "F8-T8", "T8-P8", "P8-O2"];
    const SAMPLE_RATE = 256; // samples per second, per channel
    const SECONDS = 10; // one page

    @Component({
        selector: "app-eeg-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 600px"></scichart-angular>`
    })
    export class EegChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            const xAxis = new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Never, majorDelta: 1, autoTicks: false });
            sciChartSurface.xAxes.add(xAxis);

            // One y-axis per channel, stacked down the left side, negative up as on an EEG
            sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy = new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();
            const dataSeries = CHANNELS.map((name, i) => {
                sciChartSurface.yAxes.add(
                    new NumericAxis(wasmContext, {
                        id: `ch${i}`,
                        axisAlignment: EAxisAlignment.Left,
                        axisTitle: name,
                        axisTitleStyle: { fontSize: 12, rotation: 0 },
                        visibleRange: new NumberRange(-50, 50), // µV
                        autoRange: EAutoRange.Never,
                        flippedCoordinates: true,
                        drawLabels: false,
                        drawMajorGridLines: false,
                        drawMinorGridLines: false
                    })
                );
                const series = new XyDataSeries(wasmContext, {
                    dataSeriesName: name,
                    fifoCapacity: SAMPLE_RATE * SECONDS, // keeps one page, discards older samples
                    isSorted: true,
                    containsNaN: false
                });
                sciChartSurface.renderableSeries.add(
                    new FastLineRenderableSeries(wasmContext, { yAxisId: `ch${i}`, dataSeries: series, stroke: "#50C7E0" })
                );
                return series;
            });
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true }),
                new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomPanModifier({ xyDirection: EXyDirection.XDirection })
            );

            // Append the samples that arrived since the last frame: one appendRange per channel, as typed arrays
            let sample = 0;
            let frame = requestAnimationFrame(function update() {
                const { times, channels }: { times: Float64Array; channels: Float64Array[] } = getYourNewEegSamples(); // e.g. from a WebSocket
                channels.forEach((values, i) => dataSeries[i].appendRange(times, values));
                sample += times.length;
                const now = sample / SAMPLE_RATE;
                xAxis.visibleRange = new NumberRange(now - SECONDS, now);
                frame = requestAnimationFrame(update);
            });
            sciChartSurface.addDeletable({ delete: () => cancelAnimationFrame(frame) });

            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- `LeftAlignedOuterVerticallyStackedAxisLayoutStrategy` on `sciChartSurface.layoutManager` stacks the y-axes down the left side, so each channel gets its own lane on one chart, with one shared time axis, one canvas and one cursor. `flippedCoordinates: true` draws negative upwards, as EEG convention requires, and the axis range comes from the sensitivity: a lane *h* mm tall at 7 µV/mm spans 7*h* µV.
- Each channel's `XyDataSeries` has `fifoCapacity` set to one page of samples, so old samples drop off without any buffer code of your own. Set `fifoSweeping: true` (with the x-values wrapping round at the end of the page) for a monitor-style sweep instead of a scroll.
- Every animation frame appends the new samples with one `appendRange` call per channel, using typed arrays (`Float64Array`) reused from frame to frame, inside `suspendUpdates()` and `resumeUpdates()` so all the channels redraw once.
- The event markers are `VerticalLineAnnotation`s with an axis label, and the band-power chart is a second, small chart with a `FastColumnRenderableSeries`.

**See it in the demo app:** [JavaScript vertically stacked axes chart](https://www.scichart.com/demo/javascript/vertically-stacked-axes) · [React vertically stacked axes chart](https://www.scichart.com/demo/react/vertically-stacked-axes) · [Angular vertically stacked axes chart](https://www.scichart.com/demo/angular/vertically-stacked-axes), and for live medical signals, [JavaScript ECG vital signs chart](https://www.scichart.com/demo/javascript/vital-signs-ecg-medical-chart-example) and [JavaScript real-time chart performance](https://www.scichart.com/demo/javascript/chart-realtime-performance-demo).

**Go deeper:** [SciChart.js vertically stacked axes documentation](/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout/), [real-time updates with FIFO scrolling and sweeping](/2d-charts/chart-types/data-series-api/realtime-updates/) and the [line chart documentation](/2d-charts/chart-types/fast-line-renderable-series/). The [strip chart guide](/learn/real-time/strip-chart/) compares scrolling and sweeping displays. For how SciChart is used in medical research and patient monitoring software, see [SciChart for medical charts and dashboards](https://www.scichart.com/why-scichart-medical-charts-dashboarding-for-research-and-healthcare/).

## Frequently asked questions

### What is an EEG test used for?

An EEG is used mainly to help diagnose and classify epilepsy, and to look into seizures, blackouts and unexplained episodes of confusion. It is also used in sleep studies, to monitor the brain in intensive care and during some operations, and in research and brain-computer interfaces. A specialist interprets it alongside the person's history and other tests.

### How long does an EEG take?

A routine EEG appointment usually takes about an hour, including putting the electrodes on and taking them off; the recording itself is at least 20 minutes. Sleep EEGs take longer, ambulatory EEGs are worn at home for a day or more, and video EEG telemetry in hospital can last several days.

### What do the lines on an EEG mean?

Each line is one channel: the voltage difference between two electrodes, or between one electrode and a reference, plotted against time. Channels are labelled with the electrode names, such as Fp1-F7, and listed from front to back. By convention an upward deflection means the first electrode is more negative than the second.

### What are the five types of brain waves?

EEG activity is grouped into frequency bands: delta (below 4 Hz), theta (4 to under 8 Hz), alpha (8 to 13 Hz), beta (14 to 30 Hz) and gamma (above 30 Hz). Slow bands dominate in deep sleep, alpha appears over the back of the head when an awake person closes their eyes, and beta goes with alertness.

### What can an EEG see that an MRI cannot?

An EEG measures the brain's electrical activity as it happens, millisecond by millisecond, so it can show seizure activity, sleep stages and how the brain responds to stimuli. An MRI shows the brain's structure in fine detail, such as a tumour, scar or stroke, but not its electrical activity. The two are often used together.

### How do I draw a real-time EEG chart in JavaScript?

Put every channel on one chart with one y-axis per channel, stacked vertically, and a shared time axis. Give each channel a FIFO data series with a capacity of one page of samples, and append each frame's new samples as typed arrays in one call per channel. SciChart.js does this with LeftAlignedOuterVerticallyStackedAxisLayoutStrategy, XyDataSeries with fifoCapacity and appendRange.

## Sources

- Sinha, S. R. et al. (2016), [American Clinical Neurophysiology Society Guideline 1: minimum technical requirements for performing clinical electroencephalography](https://doi.org/10.1097/WNP.0000000000000308). *Journal of Clinical Neurophysiology*, 33(4), 303–307. The 21 electrodes of the 10-20 system, sensitivity (5 to 10 µV/mm, 7 µV/mm typical), filters, 10 to 20 seconds per page, notch filter use, at least 20 minutes of recording and eyes-open and eyes-closed periods.
- Acharya, J. N. et al. (2016), [ACNS Guideline 2: guidelines for standard electrode position nomenclature](https://doi.org/10.1097/WNP.0000000000000316). *Journal of Clinical Neurophysiology*, 33(4), 308–311. Electrode names, the 10-10 system and the T7, T8, P7 and P8 names.
- Acharya, J. N. et al. (2016), [ACNS Guideline 3: a proposal for standard montages to be used in clinical EEG](https://doi.org/10.1097/WNP.0000000000000317). *Journal of Clinical Neurophysiology*, 33(4), 312–316. Longitudinal bipolar, transverse bipolar and referential montages.
- Kane, N. et al. (2017), [A revised glossary of terms most commonly used by clinical electroencephalographers and updated proposal for the report format of the EEG findings](https://doi.org/10.1016/j.cnp.2017.07.002). *Clinical Neurophysiology Practice*, 2, 170–185. Frequency bands, the alpha rhythm and its attenuation on eye opening, montages, the common average reference, phase reversal, the polarity convention, spikes, sharp waves and EEG seizure patterns.
- Tatum, W. O. et al. (2011), [Artifact and recording concepts in EEG](https://doi.org/10.1097/WNP.0b013e31821c3c93). *Journal of Clinical Neurophysiology*, 28(3), 252–263. Eye, muscle, electrode, mains and ECG artefacts.
- NHS (reviewed 2026), [Electroencephalogram (EEG)](https://www.nhs.uk/tests-and-treatments/electroencephalogram/). What the test involves, how long it takes, and the types of EEG.
- Troester, M. M. et al. (2023), *The AASM Manual for the Scoring of Sleep and Associated Events: Rules, Terminology and Technical Specifications*, version 3. American Academy of Sleep Medicine. Sleep stages and their EEG features.
- NICE (2012), [Depth of anaesthesia monitors: Bispectral Index (BIS), E-Entropy and Narcotrend-Compact M](https://www.nice.org.uk/guidance/dg6). Diagnostics guidance DG6. Processed-EEG monitoring during anaesthesia.
- Baillet, S. (2017), [Magnetoencephalography for brain electrophysiology and imaging](https://doi.org/10.1038/nn.4504). *Nature Neuroscience*, 20(3), 327–339. How MEG relates to EEG.

<LearnCta position="bottom" chart="EEG chart" demo="vertically-stacked-axes" demoLabel="vertically stacked axes chart" docs="/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout/" docsLabel="SciChart.js vertically stacked axes documentation" />
