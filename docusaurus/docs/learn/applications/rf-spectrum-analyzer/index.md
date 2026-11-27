---
sidebar_position: 220
sidebar_label: RF Spectrum Analyzer
title: "RF Spectrum Analyzer and Waterfall Display: How to Read Them"
description: "What an RF spectrum analyzer shows, how span, RBW and reference level change the screen, how to read dBm, signals and a waterfall display. With a live example."
keywords:
    [
        "rf spectrum analyzer",
        "spectrum analyzer",
        "how to read a spectrum analyzer",
        "waterfall display",
        "spectrum monitoring",
        "resolution bandwidth",
        "rbw spectrum analyzer",
        "spectrum analyzer noise floor",
        "max hold spectrum analyzer",
        "real-time spectrum analyzer",
        "sdr waterfall",
        "dbm"
    ]
image: /img/learn/rf-spectrum-analyzer-og.png
related: [sigint, audio-spectrum-analyzer, spectrogram, iq-constellation-diagram]
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
                    "name": "What does a spectrum analyzer show?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A spectrum analyser shows how much power a signal has at each frequency. Frequency runs along the horizontal axis and power, usually in dBm on a logarithmic scale, runs up the vertical axis, with the reference level at the top line. Transmitters appear as peaks, and the ragged band along the bottom is the noise floor, the weakest level the analyser can see at its current settings."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is RBW on a spectrum analyzer?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "RBW, the resolution bandwidth, is the bandwidth of the filter a spectrum analyser measures each frequency through. A narrower RBW separates signals that are closer together and lowers the noise floor, by 10 dB for every tenfold reduction, but makes a swept analyser slower, because sweep time grows with the inverse square of the RBW. A wider RBW sweeps faster but hides weak and closely spaced signals."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is a waterfall display?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A waterfall display shows a radio spectrum changing over time. Frequency runs across, time runs down, and colour shows power: each new spectrum is added as a row at the top and older rows scroll down. Steady signals draw vertical lines, bursts draw dashes and frequency hoppers draw scattered dots, which is why a waterfall reveals intermittent signals that a single spectrum misses."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a waterfall display and a spectrogram?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "They are the same kind of chart: frequency on one axis, time on the other, and colour for power. Spectrogram is the general term, used in audio, speech and science, often with time running across. Waterfall is the radio and SDR term for the same thing with time running down the screen, drawn under a live spectrum that shares its frequency axis."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Why does the noise floor rise when I increase the RBW?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The noise floor is the noise power that passes through the resolution bandwidth filter. Noise is spread evenly across frequency, so a wider filter lets more of it through: the displayed noise rises by 10 log10 of the bandwidth ratio, 10 dB for a tenfold increase. A carrier's power fits inside either filter, so its peak stays at the same level while the floor rises around it."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a spectrum analyzer display in JavaScript?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Compute or receive the spectrum as arrays of frequencies and power levels in dBm, draw it as a line chart with a fixed dB range below the reference level, and redraw it each frame. For the waterfall, keep a 2D array with one row per spectrum, add each new row at the top, and draw it as a heatmap on the same frequency axis. With SciChart.js, use a FastLineRenderableSeries and a UniformHeatmapRenderableSeries."
                    }
                }
            ]
        })}
    </script>
</head>

# RF Spectrum Analyzer

## What is an RF spectrum analyzer?

An **RF spectrum analyzer** (British spelling: analyser) is an instrument that measures how much radio-frequency power is present at each frequency. Frequency runs across the screen and power, in dBm on a logarithmic scale, runs up it, so transmitters show as peaks above a ragged noise floor. A **waterfall display** adds time, as rows of colour.

![A simulated RF spectrum analyser in a dark navy theme: above, a live spectrum from 490 to 510 MHz with power in dBm, showing a tall steady carrier, an FM-like signal, the frequency hopper on one of its channels, a flat-topped wideband channel and a dashed noise floor line; below, a waterfall on the same frequency axis with time running down, where the carrier and FM signal draw vertical lines, the burst transmitter draws short dashes, the hopper draws scattered dots and the wideband channel a filled block](/img/learn/rf-spectrum-analyzer-og.png)

*A simulated band: the live spectrum (top) and its waterfall (bottom) on one frequency axis. [Try the interactive version](#how-to-build-an-rf-spectrum-analyzer-display-in-javascript-react-or-angular).*

:::tip Key takeaways
- A spectrum analyser plots power (dBm, log scale) against frequency; the top line of the screen is the reference level.
- Resolution bandwidth (RBW) sets how far apart two signals must be to show as two peaks, how high the noise floor sits and, on a swept analyser, how long a sweep takes.
- Every 10× increase in RBW raises the noise floor by 10 dB; a carrier stays put, while a wideband signal's displayed level falls as RBW narrows.
- A waterfall stacks spectra over time, so it shows bursts, hoppers and drift that a single spectrum, or a max-hold trace, hides.
- False peaks can come from the analyser itself: add 10 dB of input attenuation, and any peak that moves was made inside the analyser.
:::

## How to read a spectrum analyzer display

![An annotated spectrum analyser screen from 490 to 510 MHz, reference level −10 dBm at the top and 10 dB per division: a narrow carrier peak with a marker reading 500.300 MHz and −20.0 dBm, a flat-topped FM signal near 497 MHz, a wideband digital channel as a ragged plateau from 505 to 509 MHz, and the noise floor near −90 dBm, with the settings bar RBW 30 kHz, VBW 30 kHz, attenuation 20 dB below](./spectrum-analyzer-screen.svg)

A spectrum analyser screen is a graph of power against frequency, with the settings that produced it printed round the edge. Read it in this order:

1. The settings bar. Resolution bandwidth (RBW), video bandwidth (VBW), input attenuation, sweep time and detector all change what the trace looks like. Two screens can only be compared if these match.
2. The frequency axis. It is set by a **centre frequency** and a **span** (the width of the screen), or by start and stop frequencies. With 10 divisions across, a 20 MHz span is 2 MHz per division.
3. The power axis. The top line is the **reference level**, here −10 dBm. The scale is usually 10 dB per division, so a 10-division screen shows 100 dB, from −10 to −110 dBm. Each division is a factor of 10 in power.
4. The noise floor. The ragged band along the bottom is the analyser's own noise, seen through the RBW filter. Nothing weaker than this can be seen at these settings.
5. The peaks. Put a marker on a peak to read its exact frequency and level; a delta marker reads the difference between two peaks in dB.
6. The shapes. How wide a peak is and how it behaves over time tell you what kind of signal it is (see [what common signals look like](#what-common-signals-look-like-on-a-spectrum-analyzer)).

On a swept analyser, the screen shows one sweep, which takes from microseconds to seconds; on an FFT or real-time analyser, it is one block of samples or an average of many.

## Spectrum analyzer controls and what they change on screen

| Control | What it sets | What changes on screen |
| --- | --- | --- |
| Centre frequency and span | Which slice of the spectrum is shown | The frequency axis. A wide span finds signals; a narrow span shows their detail |
| Resolution bandwidth (RBW) | The width of the filter that measures each frequency | Peak width, the noise floor, which close signals separate, and sweep time |
| Video bandwidth (VBW) | A smoothing filter after the detector | How noisy the trace looks. A narrow VBW smooths noise but doesn't lower the average floor |
| Reference level | The power at the top line of the screen | Where the trace sits; on most analysers it also sets the input attenuation |
| Input attenuation | How much the input is weakened before the first mixer | More attenuation raises the noise floor; too little lets strong signals overload the analyser |
| Detector | Which value each display point shows when it covers many measurements | Peak shows the highest, sample one value, average (RMS) the mean power |
| Trace mode | How successive sweeps are combined | Clear-write shows the latest sweep, max-hold the highest ever, average the mean |
| Sweep time | How long one sweep takes (swept analysers) | Too fast and peaks read low and shift in frequency; analysers set it automatically from span and RBW |

### Resolution bandwidth (RBW) and its trade-offs

The **resolution bandwidth** is the bandwidth of the filter the analyser looks through at each frequency, measured at its 3 dB points. Every signal is drawn in the shape of that filter, so a pure carrier shows as a peak as wide as the RBW, not as a thin line. RBW sets three things at once:

- Resolution. Two equal signals separated by less than about one RBW merge into one peak. A small signal next to a big one needs more: the filter's skirts fall away gradually, and the ratio of its 60 dB width to its 3 dB width (its selectivity) is typically 11:1 to 15:1 for analogue filters and about 4:1 to 5:1 for digital ones. To see a signal 60 dB below its neighbour, the two must be at least half the 60 dB bandwidth apart.
- Noise floor. The noise that reaches the detector grows with the filter's bandwidth, so the displayed noise floor changes by $10 \log_{10}(\text{RBW}_\text{new} / \text{RBW}_\text{old})$ dB: up 10 dB for each tenfold increase in RBW, and down 4.8 dB going from 30 kHz to 10 kHz.
- Speed. A narrow filter takes longer to respond, so a swept analyser must sweep more slowly. Sweep time is roughly $k \times \text{span} / \text{RBW}^2$, with $k$ about 2 to 3. For a 20 MHz span, an RBW of 30 kHz needs about 0.06 s; 3 kHz needs about 6 s, a hundred times longer. FFT analysers avoid most of this penalty, and many modern analysers switch to FFT processing at narrow RBWs.

In the live example below, a −45 dBm carrier sits 60 kHz above the −20 dBm one. With a 100 kHz RBW the filter is only about 4 dB down at 60 kHz, so the weaker carrier is buried in the strong one's peak. With a 30 kHz RBW the strong carrier's skirt is 48 dB down at that distance, and the weaker carrier stands 23 dB clear of it.

### Reference level, attenuation and overload

The reference level is the power at the top line of the graph. On most analysers, raising it also adds input attenuation automatically, which keeps strong signals from overloading the first mixer, the stage that shifts each frequency to where it is measured. More attenuation costs sensitivity: the analyser turns up its gain to compensate, so signals stay where they were on the screen while the noise floor rises dB for dB.

Too little attenuation causes a worse problem. An overloaded mixer creates harmonics and intermodulation products of its own, which appear as real-looking peaks. Third-order products grow 3 dB for every 1 dB rise in the signals that cause them. The standard check is to add 10 dB of attenuation: a peak that comes from the input stays at the same level on screen, while one made inside the analyser drops or changes.

### Detectors and trace modes

A display has a few hundred to a few thousand points across, but each point usually covers many measurements. The **detector** decides which one is shown:

- Peak (positive peak) shows the highest value in each point. It never misses a narrow carrier or a short burst, but it makes noise look higher than it is.
- Sample shows one value per point. It shows noise as it really fluctuates, but can miss narrow signals on a wide span.
- Average (RMS) shows the mean power in each point. Use it for noise and for noise-like digital signals.

The trace mode decides how one sweep combines with the next. Clear-write shows each new sweep as it comes. Max-hold keeps the highest level ever seen at each frequency, which catches intermittent signals but erases when they happened. Average combines many sweeps to steady the noise; averaging on a log (dB) scale reads noise about 2.5 dB low, so use power (RMS) averaging when the noise level itself matters.

## Swept-tuned vs FFT and real-time spectrum analyzers

| Type | How it works | Good at | Blind spot |
| --- | --- | --- | --- |
| Swept-tuned (superheterodyne) | Tunes one narrow filter across the span, a frequency at a time | Very wide spans, from hertz to tens of gigahertz, and large dynamic range | Sees only the frequency it is tuned to at that moment, so it can miss short bursts |
| FFT (vector signal) analyser | Captures a block of samples over a band and computes every frequency at once with a [fast Fourier transform](/learn/applications/signal-processing/fast-fourier-transform/) | Narrow RBWs quickly; also keeps the phase, so it can demodulate | The band it can capture at once is limited by its sample rate |
| Real-time spectrum analyser | Computes overlapping FFTs with no gaps between them across its real-time bandwidth | Catches every event above a minimum duration (100% probability of intercept), and shows how often each level occurs as a persistence or density display | Gap-free only within its real-time bandwidth; wider spans are stitched together |
| Software-defined radio (SDR) with spectrum software | A receiver streams IQ samples to a computer, which runs the FFT and draws a spectrum and waterfall | Low cost and flexible; the usual way people meet a waterfall display | Levels are usually relative (dBFS), not calibrated dBm; less dynamic range, and its own spurs and images |

The audio guide explains [how an FFT analyser turns samples into a spectrum](/learn/applications/signal-processing/audio-spectrum-analyzer/#how-an-fft-spectrum-analyzer-works). IQ samples, the raw data an SDR and an FFT analyser work from, are explained in the [IQ data and constellation diagrams guide](/learn/applications/iq-constellation-diagram/).

## dBm and dB: a worked example

RF power is quoted in **dBm**: decibels relative to one milliwatt.

$$
P_\text{dBm} = 10 \log_{10}\left(\frac{P}{1\ \text{mW}}\right)
$$

| Power | dBm | In a 50 Ω system |
| --- | --- | --- |
| 1 W | +30 dBm | 7.1 V rms |
| 1 mW | 0 dBm | 0.22 V rms |
| 1 µW | −30 dBm | 7.1 mV rms |
| 1 nW | −60 dBm | 0.22 mV rms |
| 1 pW | −90 dBm | 7.1 µV rms |
| 0.02 pW | −107 dBm | 1 µV rms |

Every 10 dB is a factor of 10 in power and every 3 dB about a factor of 2. **dB** on its own is a ratio, so the difference between two dBm readings is in dB. Powers in dBm can't be added directly: two −50 dBm signals together make −47 dBm, not −100 dBm.

Now read the live example's default screen (RBW 30 kHz, reference level −10 dBm, 20 dB attenuation):

1. The marker on the strong carrier reads −20 dBm, which is 10 µW.
2. The noise floor sits at about −89 dBm. The carrier is 69 dB above it: about 8 million times more power.
3. Change the RBW to 10 kHz. The floor drops by $10 \log_{10}(10/30) = -4.8$ dB, to about −94 dBm. The carrier still reads −20 dBm: a carrier's power all passes through even the narrower filter.
4. The wideband channel is different. Its power is spread over 4 MHz, so the analyser shows only the slice inside the RBW. With Average trace at 30 kHz RBW, its plateau reads about −61 dBm. Its total power, the channel power, is approximately $-61 + 10 \log_{10}(4\ \text{MHz} / 30\ \text{kHz}) = -61 + 21.2 \approx -40$ dBm.
5. At 10 kHz RBW the same plateau reads about −66 dBm, 4.8 dB lower, yet the channel power is still −40 dBm. Plateau height means nothing without the RBW; analysers have a channel-power measurement that does this sum for you, allowing for the filter's exact noise bandwidth.

## The noise floor: how to tell a signal from noise

Every receiver adds noise. The least possible is thermal noise, $kTB$: at a room temperature of 290 K it is −174 dBm in each hertz of bandwidth. An analyser adds its own on top, described by its noise figure (NF), and shows it through the RBW filter, so its **displayed average noise level** (DANL) is approximately

$$
\text{DANL} \approx -174\ \text{dBm/Hz} + \text{NF} + 10 \log_{10}(\text{RBW in Hz}) + \text{attenuation}
$$

For the live example's analyser, with a 20 dB noise figure, 20 dB attenuation and a 30 kHz RBW: $-174 + 20 + 20 + 44.8 \approx -89$ dBm.

To decide whether a bump near the floor is a signal:

- Watch it over several sweeps. Noise moves about at random; a signal stays at the same frequency. On a waterfall, a weak signal draws a faint but continuous line through the speckle.
- Narrow the RBW. The floor drops but a carrier doesn't, so a real carrier rises out of the noise. In the live example, the weak carrier at 502.2 MHz (−85 dBm) is lost in the floor at 100 kHz RBW and stands about 9 dB clear at 10 kHz.
- Use the average trace or a narrower VBW. Smoothing the noise lets you see a signal a few dB above it.
- Compare the shape. A noise-like wideband signal drops with the floor when RBW narrows, so its height above the floor stays the same; a carrier's grows.
- Rule out the analyser. Disconnect the antenna or terminate the input: a peak that remains is a residual spur of the analyser itself.

How far above the noise a signal must be to be usable is its signal-to-noise ratio; see the [signal-to-noise ratio guide](/learn/applications/signal-processing/signal-to-noise-ratio/). For noise and wideband signals measured in dBm per hertz, see [power spectral density](/learn/applications/signal-processing/power-spectral-density/).

## What common signals look like on a spectrum analyzer

| Signal | On the spectrum | On the waterfall |
| --- | --- | --- |
| Unmodulated carrier (CW) | A single narrow peak in the shape of the RBW filter | A straight, steady vertical line |
| AM (amplitude modulation) | A steady carrier with sidebands either side, out to the highest audio frequency; the sidebands rise and fall with the audio | A bright centre line with flickering edges |
| FM (frequency modulation) | A hump or block whose total power stays constant but whose width changes with the audio; Carson's rule gives its bandwidth as about $2(\Delta f + f_m)$, twice the sum of the peak deviation and the highest audio frequency | A band that widens and narrows |
| Wideband digital channel | A flat-topped, noise-like plateau with steep sides; its height depends on RBW | An evenly filled block |
| Bursts (packets, pulsed or time-shared transmitters) | Appears and vanishes on clear-write; looks permanent on max-hold | Short dashes at one frequency with gaps between them |
| Frequency hopper | A narrow peak that jumps to a new channel many times a second; max-hold fills the whole hopping band like a comb | Scattered dots or short dashes across a set of channels |
| Harmonics | Peaks at 2, 3, 4… times a carrier's frequency, usually weaker as the number goes up | Lines that start and stop with the carrier |
| Spurs | Discrete peaks that belong to no wanted signal, such as clock harmonics, oscillator leakage or mixing products | Steady lines, often at round-number frequencies |
| Intermodulation (third order) | Two signals at $f_1$ and $f_2$ produce new peaks at $2f_1 - f_2$ and $2f_2 - f_1$, spaced from them by $f_2 - f_1$ | Lines that appear only while both parent signals are present |

Harmonics and intermodulation can be made by the transmitter, by a nearby non-linear junction such as a corroded connector, or by the analyser itself when it is overloaded. The attenuation test tells the last case apart.

## What is a waterfall display?

A waterfall display shows the spectrum over time. Frequency runs across, as on the spectrum above it, time runs down, and colour shows power. Each new spectrum is drawn as a row of colour at the top and the older rows move down, so the picture flows like a waterfall. It is the same chart as a [spectrogram](/learn/chart-types/cartesian/spectrogram/), turned so that time runs down the screen and placed under a live spectrum that shares its frequency axis; RF and SDR tools call it a waterfall.

![A spectrum panel above a waterfall panel on the same frequency axis. In the waterfall, a steady carrier draws a straight vertical line, an FM signal a band that changes width, a wideband channel a wide filled block, a burst transmitter short dashes at one frequency, and a frequency hopper dots that jump between channels. A dashed guide shows the burst transmitter's frequency is empty on the spectrum, which shows only the present moment](./waterfall-display-reading.svg)

A spectrum shows only the latest moment, and max-hold shows everything that ever happened without saying when. The waterfall keeps both what and when. That makes it the display for anything that changes: a burst transmitter that is silent at the moment you look, a hopper that is never on one channel for long, an oscillator drifting as it warms up, or interference that comes and goes. The passive sonar [bearing-time waterfall](/learn/applications/sonar/#how-to-read-a-passive-sonar-waterfall) works the same way, with bearing in place of frequency.

### How to read a waterfall display, step by step

1. Check the axes. Find which end is newest (usually the top), how much time the screen holds, and the frequency range. In the live example, the newest row is at the top and the screen holds the last 10 seconds.
2. Read the colour scale. Find the colour of the noise floor and the colour of the strongest signals. The scale is often tied to the reference level, so changing it recolours everything.
3. Find the vertical lines. Each is a signal that is always on. Note its frequency, and its width: thin for a carrier, wide for a digital channel.
4. Look for breaks in the lines. Dashes at one frequency are bursts. Their length is how long each transmission lasts, and the gaps show how often it transmits.
5. Look for slants and scatter. A slanting line is a signal drifting in frequency; dots scattered across a set of channels are a hopper.
6. Measure. Hover or place a marker to read frequency, time and level. Count rows and divide by the row rate to time an event.

## Spectrum monitoring and interference hunting

**Spectrum monitoring** means measuring how the radio spectrum is actually used. National regulators and licence holders do it to check that transmitters stay on their assigned frequencies, within their bandwidth and power, to measure how busy each band is, and to find the cause when a radio service suffers interference. The ITU publishes a handbook of the methods, covering everything from occupancy measurements to fixed and mobile monitoring stations.

A typical civil interference hunt follows the same steps whatever the band:

1. Catch it. Interference is often intermittent, so leave a waterfall or a max-hold trace running and note when and how often it appears.
2. Characterise it. Measure its frequency, bandwidth, level and time pattern, and compare its shape with the table above: a steady carrier, a wideband plateau, regular bursts, or a comb of harmonics from a faulty device.
3. Rule out the analyser. Use the attenuation test, so you don't chase a peak made by your own instrument.
4. Find the source. Regulators and operators use directional antennas and the methods in the [direction finding guide](/learn/applications/direction-finding/), then work with the owner to fix it.

Monitoring is regulated. In most countries, transmitting without a licence, deliberately interfering with radio services or listening to and disclosing the content of communications you are not authorised to receive is an offence. A spectrum analyser measures power at each frequency; it doesn't decode content. Military and intelligence monitoring is done by authorised agencies under its own legal framework: see [what SIGINT is](/learn/applications/sigint/).

## Common spectrum analyzer mistakes

- **An RBW too wide for the job.** A wide RBW raises the floor over weak signals and merges close ones. Narrow it, and reduce the span, until the floor stops hiding what you're looking for.
- **Overloading the input.** Strong signals with too little attenuation create intermodulation peaks inside the analyser, and readings above the reference level are compressed or clipped. Keep the strongest signal below the top line, and do the 10 dB attenuation test before reporting any spur.
- **Reading max-hold as a continuous signal.** A burst seen once, or a hopper visiting every channel, fills in a max-hold trace as if it never stopped. Check clear-write or the waterfall before calling something continuous, and clear max-hold after changing anything.
- **Quoting a wideband plateau as its power.** The height of a noise-like signal depends on RBW. Use channel power, or add $10 \log_{10}(\text{bandwidth}/\text{RBW})$.
- **Averaging noise in dB.** Log averaging reads noise about 2.5 dB low. Use RMS or power averaging for noise and digital signals.
- **Sweeping past a burst.** A swept analyser can be tuned elsewhere when a short transmission happens. Use max-hold over many sweeps, a real-time analyser or a waterfall.
- **Treating SDR levels as dBm.** Most SDR software shows levels relative to the converter's full scale (dBFS), which change with gain settings. Calibrate against a known source before quoting absolute power.

## How to build an RF spectrum analyzer display in JavaScript, React or Angular

SciChart.js draws line series and heatmaps with WebGL, so an analyser display can redraw thousands of frequency points every frame and scroll a large waterfall smoothly in the browser. The example below simulates a band of generic signals and computes what an analyser with a Gaussian RBW filter would display: 2,048 to 8,192 frequency bins, redrawn up to 60 times a second, over a waterfall of 300 rows and up to 2,048 columns that gains a new row 30 times a second.

All the data is simulated: the signals, frequencies and levels are invented for teaching. Change the **Span**, the **RBW** and the **Reference level** to see the noise floor, the peak shapes and the input attenuation change; set the reference level to −30 dBm to overload the simulated mixer and make false peaks appear. Switch **Trace** between clear-write, max-hold and average, and press **Pause** to freeze the band. Hover over either chart for the frequency, power and (on the waterfall) the time; scroll to zoom, drag to pan, and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="RF spectrum analyzer" demo="audio-analyzer-fft-example" demoLabel="audio analyzer" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/updating-realtime/" docsLabel="SciChart.js real-time heatmap documentation" />

Here is the code for this example. The band simulation and spectrum engine are plain JavaScript; SciChart.js draws the spectrum, the waterfall, the noise floor line and the hover markers. The React and Angular versions below draw a spectrum and waterfall from your own receiver data.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAutoRange,
        XyDataSeries,
        FastLineRenderableSeries,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme
    } from "scichart";

    // One group lines up the two charts' plot areas, so their frequency axes match
    const group = new SciChartVerticalGroup();
    const ROWS = 300;

    // The live spectrum: power in dBm against frequency in MHz
    const initSpectrum = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, { theme: new SciChartJsNavyTheme() });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Never }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Power (dBm)", visibleRange: new NumberRange(-110, -10), autoRange: EAutoRange.Never })
        );
        const dataSeries = new XyDataSeries(wasmContext, { dataIsSortedInX: true });
        sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0" }));
        group.addSurfaceToGroup(sciChartSurface);
        // Each new spectrum from your receiver: frequencies (MHz) and levels (dBm), as typed arrays
        subscribeToYourReceiver(({ frequencies, levels }) => {
            sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(frequencies[0], frequencies[frequencies.length - 1]);
            dataSeries.clear();
            dataSeries.appendRange(frequencies, levels);
        });
        return { sciChartSurface };
    };

    // The waterfall: frequency across, time down (newest row at the top), colour = power
    const initWaterfall = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, { theme: new SciChartJsNavyTheme() });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Frequency (MHz)", autoRange: EAutoRange.Never }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Rows ago", flippedCoordinates: true }));
        const rows: number[][] = [];
        const dataSeries = new UniformHeatmapDataSeries(wasmContext, { xStart: 0, xStep: 1, yStart: 0, yStep: 1, zValues: [[0]] });
        const colorMap = new HeatmapColorMap({
            minimum: -110,
            maximum: -10,
            gradientStops: [
                { offset: 0, color: "#050B1E" },
                { offset: 0.4, color: "#1F6FD1" },
                { offset: 0.7, color: "#F2D24B" },
                { offset: 1, color: "#FFF4E6" }
            ]
        });
        sciChartSurface.renderableSeries.add(new UniformHeatmapRenderableSeries(wasmContext, { dataSeries, colorMap }));
        group.addSurfaceToGroup(sciChartSurface);
        subscribeToYourReceiver(({ frequencies, levels }) => {
            const step = frequencies[1] - frequencies[0];
            dataSeries.xStart = frequencies[0] - step / 2;
            dataSeries.xStep = step;
            sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(dataSeries.xStart, dataSeries.xStart + step * levels.length);
            rows.unshift(Array.from(levels)); // newest row first
            if (rows.length > ROWS) rows.pop();
            dataSeries.setZValues(rows); // for large waterfalls, update at most about 30 times a second
        });
        return { sciChartSurface };
    };

    export const SpectrumWithWaterfall = () => (
        <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
            <SciChartReact initChart={initSpectrum} style={{ flex: 1 }} />
            <SciChartReact initChart={initWaterfall} style={{ flex: 1 }} />
        </div>
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        SciChartVerticalGroup,
        NumericAxis,
        NumberRange,
        EAutoRange,
        XyDataSeries,
        FastLineRenderableSeries,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme
    } from "scichart";

    // One group lines up the two charts' plot areas, so their frequency axes match
    const group = new SciChartVerticalGroup();
    const ROWS = 300;

    // The live spectrum: power in dBm against frequency in MHz
    const initSpectrum = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, { theme: new SciChartJsNavyTheme() });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Never }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Power (dBm)", visibleRange: new NumberRange(-110, -10), autoRange: EAutoRange.Never })
        );
        const dataSeries = new XyDataSeries(wasmContext, { dataIsSortedInX: true });
        sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0" }));
        group.addSurfaceToGroup(sciChartSurface);
        // Each new spectrum from your receiver: frequencies (MHz) and levels (dBm), as typed arrays
        subscribeToYourReceiver(({ frequencies, levels }) => {
            sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(frequencies[0], frequencies[frequencies.length - 1]);
            dataSeries.clear();
            dataSeries.appendRange(frequencies, levels);
        });
        return { sciChartSurface };
    };

    // The waterfall: frequency across, time down (newest row at the top), colour = power
    const initWaterfall = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, { theme: new SciChartJsNavyTheme() });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Frequency (MHz)", autoRange: EAutoRange.Never }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Rows ago", flippedCoordinates: true }));
        const rows: number[][] = [];
        const dataSeries = new UniformHeatmapDataSeries(wasmContext, { xStart: 0, xStep: 1, yStart: 0, yStep: 1, zValues: [[0]] });
        const colorMap = new HeatmapColorMap({
            minimum: -110,
            maximum: -10,
            gradientStops: [
                { offset: 0, color: "#050B1E" },
                { offset: 0.4, color: "#1F6FD1" },
                { offset: 0.7, color: "#F2D24B" },
                { offset: 1, color: "#FFF4E6" }
            ]
        });
        sciChartSurface.renderableSeries.add(new UniformHeatmapRenderableSeries(wasmContext, { dataSeries, colorMap }));
        group.addSurfaceToGroup(sciChartSurface);
        subscribeToYourReceiver(({ frequencies, levels }) => {
            const step = frequencies[1] - frequencies[0];
            dataSeries.xStart = frequencies[0] - step / 2;
            dataSeries.xStep = step;
            sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(dataSeries.xStart, dataSeries.xStart + step * levels.length);
            rows.unshift(Array.from(levels)); // newest row first
            if (rows.length > ROWS) rows.pop();
            dataSeries.setZValues(rows); // for large waterfalls, update at most about 30 times a second
        });
        return { sciChartSurface };
    };

    @Component({
        selector: "app-spectrum-with-waterfall",
        standalone: true,
        imports: [ScichartAngularComponent],
        // scichart-angular creates each chart, sizes it and cleans it up
        template: `
            <div style="display: flex; flex-direction: column; height: 600px">
                <scichart-angular [initChart]="initSpectrum" style="flex: 1"></scichart-angular>
                <scichart-angular [initChart]="initWaterfall" style="flex: 1"></scichart-angular>
            </div>
        `
    })
    export class SpectrumWithWaterfallComponent {
        initSpectrum = initSpectrum;
        initWaterfall = initWaterfall;
    }
    ```
</CodeSnippetBlock>

Key points:

- The spectrum is a `FastLineRenderableSeries` whose `XyDataSeries` is cleared and refilled from typed arrays with one `appendRange` call per frame, never point by point.
- The waterfall is a `UniformHeatmapRenderableSeries` on a flipped y-axis, so row 0, the newest, is at the top. Each new row goes to the front of the array, the oldest is dropped, and `setZValues` sends the grid once per update, capped at 30 times a second because every update re-processes the whole grid.
- A `SciChartVerticalGroup` lines up the two plot areas, and each frequency axis's `visibleRangeChanged` event updates the other, so zooming or panning one chart moves both.
- A `HeatmapColorMap` maps the reference level and the 100 dB below it to colour, and a `CustomChartModifier2D` turns the mouse position into frequency, power and time for the readout.

**See it in the demo app:** [JavaScript audio analyzer with spectrogram](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example) · [React audio analyzer with spectrogram](https://www.scichart.com/demo/react/audio-analyzer-fft-example) · [Angular audio analyzer with spectrogram](https://www.scichart.com/demo/angular/audio-analyzer-fft-example). Related technique: the [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart).

**Go deeper:** [SciChart.js real-time heatmap documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/updating-realtime/), the [uniform heatmap](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/), and the learning center guides to the [audio spectrum analyzer](/learn/applications/signal-processing/audio-spectrum-analyzer/), the [spectrogram](/learn/chart-types/cartesian/spectrogram/) and the [window functions](/learn/applications/signal-processing/window-functions/) an FFT analyser uses. For the industry, see SciChart for [aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/).

## Frequently asked questions

### What does a spectrum analyzer show?

A spectrum analyser shows how much power a signal has at each frequency. Frequency runs along the horizontal axis and power, usually in dBm on a logarithmic scale, runs up the vertical axis, with the reference level at the top line. Transmitters appear as peaks, and the ragged band along the bottom is the noise floor, the weakest level the analyser can see at its current settings.

### What is RBW on a spectrum analyzer?

RBW, the resolution bandwidth, is the bandwidth of the filter a spectrum analyser measures each frequency through. A narrower RBW separates signals that are closer together and lowers the noise floor, by 10 dB for every tenfold reduction, but makes a swept analyser slower, because sweep time grows with the inverse square of the RBW. A wider RBW sweeps faster but hides weak and closely spaced signals.

### What is a waterfall display?

A waterfall display shows a radio spectrum changing over time. Frequency runs across, time runs down, and colour shows power: each new spectrum is added as a row at the top and older rows scroll down. Steady signals draw vertical lines, bursts draw dashes and frequency hoppers draw scattered dots, which is why a waterfall reveals intermittent signals that a single spectrum misses.

### What is the difference between a waterfall display and a spectrogram?

They are the same kind of chart: frequency on one axis, time on the other, and colour for power. Spectrogram is the general term, used in audio, speech and science, often with time running across. Waterfall is the radio and SDR term for the same thing with time running down the screen, drawn under a live spectrum that shares its frequency axis.

### Why does the noise floor rise when I increase the RBW?

The noise floor is the noise power that passes through the resolution bandwidth filter. Noise is spread evenly across frequency, so a wider filter lets more of it through: the displayed noise rises by 10 log10 of the bandwidth ratio, 10 dB for a tenfold increase. A carrier's power fits inside either filter, so its peak stays at the same level while the floor rises around it.

### How do I make a spectrum analyzer display in JavaScript?

Compute or receive the spectrum as arrays of frequencies and power levels in dBm, draw it as a line chart with a fixed dB range below the reference level, and redraw it each frame. For the waterfall, keep a 2D array with one row per spectrum, add each new row at the top, and draw it as a heatmap on the same frequency axis. With SciChart.js, use a FastLineRenderableSeries and a UniformHeatmapRenderableSeries.

## Sources

- Keysight Technologies, [Spectrum Analysis Basics](https://www.keysight.com/us/en/assets/7018-06714/application-notes/5952-0292.pdf) (Application Note 150). How swept analysers work, RBW, sweep time, noise floor and the attenuation test for internal distortion.
- Hewlett-Packard (1997), [Spectrum Analysis Basics](https://docente.unife.it/antonello.giovannelli/materiale-didattico/analizzatore-di-spettro/spectrum-analysis-basics_hp_1997.pdf) seminar notes. Selectivity of 11:1 to 15:1 (analogue) and 5:1 (digital), the 10 log RBW rule for noise, and attenuator and IF gain coupling.
- Rohde & Schwarz, [Understanding basic spectrum analyzer operation](https://www.rohde-schwarz.com/tw/_256005.html). Centre and span, reference level, RBW and sweep time, video bandwidth.
- Keysight Technologies, [Noise measurements](https://helpfiles.keysight.com/csg/89600B/Webhelp/Subsystems/powerspectrum/content/ps_noisemeasurements.htm) (89600 VSA help). Log averaging of noise reads up to 2.51 dB low; use power (RMS) averaging.
- Ramian, F. (2015), [Implementation of Real-Time Spectrum Analysis](https://scdn.rohde-schwarz.com/ur/pws/dl_downloads/dl_application/application_notes/1ef77/1EF77_3e_Real-time_Spectrum_Analysis.pdf), Rohde & Schwarz white paper 1EF77. Overlapping FFTs, 100% probability of intercept and the persistence spectrum compared with max-hold.
- International Telecommunication Union (2026), [Handbook on Spectrum Monitoring](https://www.itu.int/pub/R-HDB-23). The reference on how administrations monitor the spectrum.
- ITU-R Recommendation SM.1138-3 (2019), [Determination of necessary bandwidths](https://www.itu.int/rec/R-REC-SM.1138/en). The necessary bandwidth of FM, $2M + 2DK$, which is Carson's rule when $K = 1$.
- NIST, [Boltzmann constant](https://physics.nist.gov/cgi-bin/cuu/Value?k) (CODATA). $k$ for the thermal noise of −174 dBm/Hz at 290 K.

<LearnCta position="bottom" chart="RF spectrum analyzer" demo="audio-analyzer-fft-example" demoLabel="audio analyzer" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/updating-realtime/" docsLabel="SciChart.js real-time heatmap documentation" />
