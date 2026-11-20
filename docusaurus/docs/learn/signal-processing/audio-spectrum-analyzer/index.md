---
sidebar_position: 10
sidebar_label: Audio Spectrum Analyzer
title: "Audio Spectrum Analyzer: How It Works and How to Read One (With Interactive Examples)"
description: "What a spectrum analyzer shows and measures, how a real-time FFT analyzer works, how to read dB and log frequency axes, 1/3-octave bands, and analyzer vs oscilloscope. Live demo."
keywords:
    [
        "audio spectrum analyzer",
        "spectrum analyzer",
        "what is a spectrum analyzer",
        "real time spectrum analyzer",
        "fft spectrum analyzer",
        "what is a spectrum analyzer used for",
        "what does a spectrum analyzer measure",
        "spectrum analyzer vs oscilloscope",
        "spectrum analyzer resolution bandwidth",
        "spectrum analyzer noise floor",
        "using a spectrum analyzer",
        "1/3 octave analyzer",
        "spectrum analyzer software"
    ]
image: /img/learn/audio-spectrum-analyzer-og.png
related: [fast-fourier-transform, spectrogram, power-spectral-density, signal-to-noise-ratio]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a spectrum analyzer used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A spectrum analyzer is used to see which frequencies a signal contains and how strong each one is. In audio, that means balancing a mix with EQ, finding mains hum and feedback, measuring rooms, loudspeakers and headphones, and tracking machine noise. In radio and electronics, it checks transmitters, interference, harmonics and the noise floor of a circuit." }
                },
                {
                    "@type": "Question",
                    "name": "What does a spectrum analyzer measure?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A spectrum analyzer measures the level of a signal at each frequency: amplitude or power on the vertical axis, frequency on the horizontal axis. From that display you read the frequency and level of tones and their harmonics, the noise floor, the bandwidth a signal occupies, and how the balance of low, mid and high frequencies changes over time." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a spectrum analyzer and an oscilloscope?",
                    "acceptedAnswer": { "@type": "Answer", "text": "An oscilloscope shows a signal's voltage against time: its waveform, timing, rise time and glitches. A spectrum analyzer shows the signal's level against frequency: which tones, harmonics and noise it contains. Use an oscilloscope to see when and what shape; use a spectrum analyzer to see which frequencies and how much. Many oscilloscopes have an FFT mode, but a dedicated analyzer usually has a lower noise floor and finer frequency resolution." }
                },
                {
                    "@type": "Question",
                    "name": "What is resolution bandwidth on a spectrum analyzer?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Resolution bandwidth (RBW) is the width of the filter each point on the display measures through. Two tones closer together than about the RBW merge into one peak, and the displayed noise floor rises by 10 dB for every tenfold increase in RBW. In an FFT analyzer, the RBW is the bin width (sample rate divided by FFT size) times the window's noise bandwidth, about 1.5 bins for a Hann window." }
                },
                {
                    "@type": "Question",
                    "name": "Why does pink noise slope down on a spectrum analyzer?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Pink noise has equal power in every octave, so its power per hertz falls by half (3 dB) each time the frequency doubles. An FFT analyzer's bins all have the same width in hertz, so pink noise slopes down at 3 dB per octave. An octave or 1/3-octave analyzer's bands get wider as frequency rises, which cancels the slope, so pink noise looks flat." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make an audio spectrum analyzer in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Get audio from the microphone with navigator.mediaDevices.getUserMedia on an HTTPS page, connect it to a Web Audio AnalyserNode, and call getFloatFrequencyData in a requestAnimationFrame loop to get one level in dB per frequency bin. For full control of the window, scaling and bands, read getFloatTimeDomainData and run your own FFT. Plot the levels against frequency on a logarithmic axis, for example with a SciChart.js LogarithmicAxis and a mountain series." }
                }
            ]
        })}
    </script>
</head>

# Audio Spectrum Analyzer

## What is a spectrum analyzer?

An **audio spectrum analyzer** (spelled analyser in British English) is a tool that shows how loud a sound is at each frequency, updated live. Frequency runs along the horizontal axis, usually on a log scale from 20 Hz to 20 kHz, and level in decibels runs up the vertical axis. Peaks are tones and their harmonics; the low, ragged floor beneath them is noise.

![A real-time audio spectrum analyser in a dark navy theme: the live FFT spectrum of an A major chord as a blue mountain on a logarithmic frequency axis from 20 Hz to 20 kHz, with sharp peaks at each note and its harmonics, an orange peak-hold line above, and level in decibels relative to digital full scale (dBFS) from -120 to 0](/img/learn/audio-spectrum-analyzer-og.png)

*The live spectrum of an A major chord, with peak hold, sample data. [Try the interactive analyser](#how-to-build-an-audio-spectrum-analyzer-in-javascript-react-or-angular), with test signals or your own microphone.*

:::tip Key takeaways
- A spectrum analyser plots level against frequency; an oscilloscope plots level against time.
- Software (FFT) analysers cut the sound into blocks, window each one, run an FFT, convert to decibels, then average and peak-hold the result.
- A bigger FFT size separates closer frequencies but reacts more slowly.
- Audio analysers use a log frequency axis because each octave matters equally to the ear; 1/3-octave bands group the FFT bins to match.
- Pink noise slopes down 3 dB per octave in FFT bins but looks flat in 1/3-octave bands.
:::

## What does a spectrum analyzer measure?

A spectrum analyser measures the level of a signal at each frequency. Any sound can be described as a sum of sine waves (the idea behind the [Fourier transform](/learn/signal-processing/fourier-transform/)); the analyser estimates how strong each of those sine waves is, and redraws the result many times a second.

From that one picture you can read:

- tones and pitches: a whistle, a note or a hum shows as a narrow peak at its frequency;
- harmonics: a musical note or a distorted tone shows a row of peaks at 2, 3, 4… times its fundamental frequency;
- the noise floor: the level of the background hiss between the peaks, which sets the quietest thing you can see;
- tonal balance: whether the energy sits mostly in the bass, the midrange or the treble;
- bandwidth: how wide a range of frequencies a signal occupies.

It does not show when something happens within a block, or the phase of each component. For changes over time, use a [spectrogram](#the-spectrogram-a-spectrum-analyzer-with-history); for timing and waveform shape, use an [oscilloscope](#spectrum-analyzer-vs-oscilloscope).

## How an FFT spectrum analyzer works

Almost every audio analyser, whether a plug-in, a phone app or a measurement system, is an **FFT analyser**. It repeats the same chain of steps for every new block of samples:

![The signal chain of an FFT spectrum analyser, from left to right: capture at 48,000 samples per second, a block of N samples, a Hann window, the FFT, magnitude squared converted to decibels, averaging and peak hold, and the display on a log frequency axis. Below, the numbers for N = 4,096: each block lasts 85 ms, the bins are 11.7 Hz apart, and the result has 2,048 bins](./fft-analyser-signal-chain.svg)

1. Capture a block. Take the latest $N$ samples, for example $N = 4{,}096$ at a sample rate $f_s$ of 48,000 samples per second: 85 ms of sound.
2. Window it. Multiply the block by a **window**, such as Hann, that tapers both ends to zero. Without it, the abrupt edges of the block smear every tone across the spectrum (**spectral leakage**). The [FFT guide](/learn/signal-processing/fast-fourier-transform/#windowing-and-spectral-leakage) shows why.
3. Run the FFT. The [fast Fourier transform](/learn/signal-processing/fast-fourier-transform/) turns the block into $N/2$ frequency **bins**, spaced $\Delta f = f_s / N$ apart (11.7 Hz here).
4. Convert to decibels. Square each bin's magnitude to get power, scale it, and take $10 \log_{10}$, so a sine of amplitude $A$ reads $20 \log_{10} A$ (the formula is below).
5. Average and hold. A single block of music or noise is jumpy. **Averaging** several blocks steadies the reading; **peak hold** keeps the highest level seen at each frequency.
6. Display. Draw the levels against frequency, usually on a log axis, as a line, a filled "mountain" or bars.

The level of bin $k$ in step 4, in dBFS (decibels relative to digital full scale, where 0 dBFS is the largest sine the system can store), with $X[k]$ the FFT output and $w[n]$ the window, is:

$$
L_k = 10 \log_{10}\!\left(\frac{4\,|X[k]|^2}{\left(\sum_n w[n]\right)^2}\right) \ \text{dBFS}
$$

The factor of 4 and the window's sum undo the FFT's scaling and the window's loss, so a full-scale sine reads 0 dBFS whatever the FFT size or window.

A **real-time analyser** (RTA) is one that processes every sample, with no gaps between blocks, so a short click or burst can't slip through unseen. Analysers usually overlap the blocks (50% or 75%) too, so that the parts of the signal near the tapered ends of one block sit in the middle of the next. For audio, that's an easy load for a modern computer, even in plain JavaScript.

## How to read an audio spectrum analyzer

### The level axis: dBFS, dBV, dBu and dB SPL

The vertical axis is in **decibels**, a log scale where every 20 dB is a factor of ten in amplitude and 6 dB is roughly a factor of two. A decibel is always relative to a reference, and the unit name tells you which:

| Unit | Reference (0 dB) | Where you'll see it |
| --- | --- | --- |
| dBFS | Digital full scale: a full-scale sine wave, the loudest clean tone a digital system can store | Software analysers, DAWs, plug-ins. Values are 0 or negative |
| dBV | 1 volt RMS | Measurement interfaces and analogue test gear |
| dBu | 0.775 volt RMS | Professional audio line levels (+4 dBu is a common nominal level) |
| dB SPL | 20 µPa of sound pressure, about the threshold of hearing at 1 kHz | Calibrated measurement microphones, sound level meters, room acoustics |

A software analyser that has not been calibrated against a known level can only show dBFS: it doesn't know your microphone's sensitivity or your interface's gain. Its readings are still useful for comparing frequencies with each other, which is most of what EQ and troubleshooting need.

### The frequency axis: why a log scale

Each **octave** (a doubling of frequency) sounds like the same size of step to the ear, whether it's 50 to 100 Hz or 5,000 to 10,000 Hz. On a logarithmic frequency axis, every octave gets the same width, so bass, midrange and treble each get a fair share of the screen. On a linear axis, the octave from 10 to 20 kHz takes up half of the chart and everything a voice or bass guitar does is squeezed into the left-hand edge. (The [log scale guide](/learn/axes-and-scales/log-scale-graph/) covers log axes in general.)

Linear axes still have their uses: spotting evenly spaced harmonics, or reading vibration and electrical signals where the frequencies of interest are evenly spaced.

### FFT bins vs octave and 1/3-octave bands

An FFT gives bins of equal width in hertz. On a log axis that's very uneven: at $N = 4{,}096$ and 48 kHz, the octave from 31.5 to 63 Hz contains only about three bins, while the octave from 8 to 16 kHz contains about 680. The bass is coarse and the treble is a dense comb.

**Octave** and **1/3-octave bands** fix this by adding up the power of all the bins inside each band. Each band is a fixed fraction of an octave wide, so the bands are evenly spaced on a log axis. The 1/3-octave bands have standard centre frequencies: 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800 Hz, 1, 1.25, 1.6, 2, 2.5, 3.15, 4, 5, 6.3, 8, 10, 12.5, 16 and 20 kHz (the preferred frequencies of ISO 266; filter edges as in IEC 61260-1). There are 30 of them across the range of hearing, and each spans about 23% of its centre frequency.

![Two panels about FFT bins and 1/3-octave bands on a logarithmic frequency axis from 20 Hz to 20 kHz. Top: tick marks for FFT bins at a spacing of 11.7 Hz, sparse in the bass and so dense in the treble that they merge, with counts per octave from about 3 at 31.5 Hz to about 680 at 8 kHz. Bottom: the spectrum of pink noise, falling 3 dB per octave as an FFT line but level as 1/3-octave bars](./fft-bins-vs-third-octave-bands.svg)

So **pink noise**, which has equal power in every octave, looks different in the two views:

- in FFT bins, it falls by 3 dB per octave (10 dB per decade), because each bin is the same width but the power per hertz halves with every octave;
- in 1/3-octave bands, it is flat, because each band is twice as wide as the band an octave below it and catches twice as much power.

White noise does the opposite: flat in FFT bins, rising 3 dB per octave in bands. Bands match how we hear and are the norm for room tuning and noise measurement. FFT bins resolve individual tones, such as a 50 Hz hum and its harmonics. The [power spectral density guide](/learn/signal-processing/power-spectral-density/) explains how noise levels depend on bandwidth.

At small FFT sizes, some of the lowest bands are narrower than the bin spacing and contain no bin at all, so they stay empty: the analyser has no information there. Bands holding just one or two bins are only rough estimates.

## Spectrum analyzer settings: resolution, averaging and peak hold

| Setting | What it does | Trade-off |
| --- | --- | --- |
| FFT size ($N$) | Sets the bin spacing, $f_s / N$, and the block length, $N / f_s$ | Bigger $N$: finer frequency detail and a lower noise floor per bin, but a slower, smeared response to change. At 48 kHz: 1,024 gives 46.9 Hz bins every 21 ms; 16,384 gives 2.9 Hz bins every 341 ms |
| Window | Tapers the block to reduce leakage | Hann suits most audio. Flat-top reads tone levels accurately but widens peaks; rectangular gives the sharpest peaks but the worst leakage |
| Overlap | How much each block shares with the previous one | More overlap: smoother updates and no lost events, at more computation |
| Averaging | Combines several spectra: exponential (each new spectrum nudges a running average) or linear (the mean of the last $M$) | More averaging: a steadier noise floor and clearer tones, but it hides short events and responds slowly |
| Peak hold | Keeps the highest level reached at each frequency | Catches brief peaks such as feedback or a transient; must be reset to see the current state |
| Weighting | Applies a frequency-dependent correction such as A-weighting | Matches hearing at moderate levels; hides low-frequency rumble you might need to see |

With exponential averaging, a smoothing factor $\alpha$ applied at $r$ updates per second makes the average forget old spectra with a time constant of about $-1/(r \ln \alpha)$. At 30 updates a second, $\alpha = 0.8$ is about 0.15 s and $\alpha = 0.95$ is about 0.65 s. The same $\alpha$ gives a different time constant if the display updates at a different rate.

### Resolution bandwidth (RBW)

**Resolution bandwidth** (RBW) is the width of the filter that each point on the display measures through. In a swept analyser, it is the width of the one filter that sweeps across the range. In an FFT analyser, the equivalent is the bin width times the window's **equivalent noise bandwidth**: about 1.5 bins for Hann and 1 for rectangular (Harris, 1978). At $N = 4{,}096$ and 48 kHz with Hann, that's $1.5 \times 11.7 \approx 17.6$ Hz. Two tones closer than about two or three bins merge into one peak.

### Noise floor and FFT size

The displayed noise floor depends on the RBW as well as the noise. For broadband noise, each doubling of the FFT size lowers the floor by 3 dB, while a steady tone keeps its level. So a bigger FFT lets you see weaker tones buried in noise, at the cost of a slower response. Averaging doesn't lower the floor's average level; it makes it smoother, so small tones stand out of it. How far a signal sits above the floor is its [signal-to-noise ratio](/learn/signal-processing/signal-to-noise-ratio/).

### A-weighting

**A-weighting** is a standard correction curve (IEC 61672-1) that approximates the ear's lower sensitivity to bass and extreme treble at moderate levels. It is 0 dB at 1 kHz, about −16 dB at 125 Hz and −39 dB at 31.5 Hz, and close to 0 dB from 1 to 6 kHz. Sound levels quoted in **dB(A)** use it. It is the right choice for judging how loud noise sounds and for regulations, but the wrong one for finding a 50 Hz hum or a rumbling fan, which it hides: switch weighting off (Z-weighting) for troubleshooting.

## Swept-tuned vs FFT spectrum analyzers

The first spectrum analysers were **swept-tuned**. A single narrow filter, one resolution bandwidth (RBW) wide, is swept across the frequency range, and the display traces the level that comes through it. Radio-frequency analysers still use this design, often with a **superheterodyne** front end, which mixes the input with a tunable oscillator so that each frequency in turn is shifted down to one fixed intermediate frequency, where the filter does the measuring.

| | Swept-tuned analyser | FFT analyser |
| --- | --- | --- |
| How it measures | One narrow filter sweeps across the span, a frequency at a time | Captures a block of samples and computes every frequency at once |
| Speed | Slow sweeps for narrow RBWs; misses events at frequencies it isn't tuned to at that moment | Every frequency in each block; real-time with no gaps if processing keeps up |
| Frequency range | Hertz up to tens of gigahertz | Limited by the converter's sample rate (half of it, the Nyquist frequency) |
| Typical use | Radio, microwave and telecoms | Audio, acoustics, vibration, and the digital back end of modern RF analysers |

For sound, the range of interest is only 20 Hz to 20 kHz, and a sound card or audio interface samples fast enough to capture all of it ([why 44.1 and 48 kHz](/learn/signal-processing/nyquist-and-aliasing/#common-sampling-rates-and-why-they-were-chosen)), so audio analysers are FFT analysers.

## What is a spectrum analyzer used for?

- Mixing and EQ: spotting where instruments overlap and pile up energy (often in the low mids), finding a harsh resonance to cut, and comparing a mix's tonal balance with a reference track.
- Room acoustics: playing pink noise through the speakers and reading a 1/3-octave RTA at the listening position reveals room modes: the bass peaks and dips caused by the room's dimensions.
- Hum and buzz: mains hum shows as a peak at 50 Hz (60 Hz in North America) with harmonics at 100, 150, 200 Hz…. A soft hum has few harmonics; a harsh buzz has many. A [notch filter](/learn/signal-processing/notch-filter/) can remove it.
- Feedback: in live sound, a feedback squeal is a single peak that grows; peak hold catches the frequency so it can be cut with a narrow EQ.
- Loudspeakers and headphones: a sine sweep or noise signal shows the frequency response, its peaks and dips, and where the output falls away at each end (a [Bode plot](/learn/signal-processing/bode-plot/) shows the same response with phase).
- Machine noise and vibration: a rotating part makes peaks at its running speed and its multiples; a growing peak can be an early sign of wear in a bearing or gear.
- Electronics and radio: checking amplifier distortion (harmonics of a pure tone), measuring a circuit's noise floor, and checking that a transmitter stays inside its channel.

## Spectrum analyzer vs oscilloscope

An oscilloscope and a spectrum analyser look at the same signal from two sides: the **time domain** and the **frequency domain**.

| | Oscilloscope | Spectrum analyser |
| --- | --- | --- |
| Horizontal axis | Time | Frequency |
| Vertical axis | Voltage (linear) | Level, usually in dB (log) |
| Shows best | Waveform shape, timing, rise time, glitches, clipping | Tones, harmonics, noise floor, bandwidth, interference |
| Dynamic range | Small signals are hard to see next to large ones on a linear scale | A dB scale shows signals thousands of times weaker side by side |
| Typical questions | "When does it happen? What shape is it?" | "Which frequencies are in it, and how strong is each?" |
| Overlap | Many have an FFT or "math" mode | "Zero span" mode shows level against time at one fixed frequency |

## The spectrogram: a spectrum analyzer with history

An analyser shows only the latest spectrum. A **spectrogram** (or waterfall) keeps the history: time on one axis, frequency on the other, and level as colour. It shows how a sweep climbs, how a note's harmonics decay, or when a hum starts. Many audio tools show a waveform, a spectrum and a spectrogram together. See the [spectrogram guide](/learn/chart-types/cartesian/spectrogram/) for how to read and build one.

## Common spectrum analyzer mistakes

- **Reading the noise floor as the noise level.** The floor in FFT bins depends on the FFT size and window; double $N$ and it drops 3 dB. Compare noise across settings with a [PSD](/learn/signal-processing/power-spectral-density/) or fixed bands.
- **Using a linear frequency axis for audio.** Everything below 1 kHz ends up crammed into a few pixels. Use a log axis.
- **Too small an FFT for bass.** At 1,024 points and 48 kHz, the bins are 47 Hz apart, wider than the whole octave from 40 to 80 Hz. Use 8,192 or more to resolve low notes.
- **Too much averaging for live work.** Heavy averaging hides feedback and transients. Use a short average with peak hold, or a spectrogram.
- **Leaving voice processing on.** Browsers and phones apply echo cancellation, noise suppression and automatic gain to microphones by default; they reshape the spectrum. Turn them off for measurement.
- **Trusting uncalibrated levels.** dBFS from a laptop microphone is not dB SPL. Calibrate with a known source before quoting absolute levels.
- **Forgetting weighting.** An A-weighted display hides low-frequency problems; a Z-weighted (unweighted) one exaggerates rumble compared with how loud it sounds.

## How to build an audio spectrum analyzer in JavaScript, React or Angular

SciChart.js draws spectra, spectrograms and waveforms with WebGL and WebGPU, fast enough to redraw thousands of bins every frame. The analyser below runs live in your browser: choose a test **Signal**, change the **FFT size**, **Averaging**, **Peak hold**, **Display** (FFT bins or 1/3-octave bands) and **Frequency axis**, and watch the spectrum react. The line under the controls gives the bin width and block length. Click **Use my microphone** to analyse your own sound; the browser asks for permission first, and nothing is recorded or sent anywhere. Hover to read a level, scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={640} name="./Basic/demo" />

<LearnCta position="top" chart="audio spectrum analyzer" demo="audio-analyzer-fft-example" docs="/2d-charts/axis-api/axis-types/logarithmic-axis/" docsLabel="SciChart.js logarithmic axis documentation" />

**Things to try:** switch **Frequency axis** between Log and Linear and watch the bass squeeze into the left-hand edge. Choose **Pink noise** and switch **Display** between FFT bins and 1/3-octave bands: the downward slope levels out in bands. Pick **Two close tones** (1,000 and 1,020 Hz), which zooms in around 1 kHz: at FFT sizes up to 4,096 you see one peak, and from 8,192 you see two. Choose **50 Hz hum** to see the row of harmonics.

Here is the code. The JavaScript tab is the demo itself: test signals, a Hann window, a plain JavaScript FFT, averaging, peak hold and 1/3-octave bands, animated with `requestAnimationFrame`. The React and Angular tabs show the shortest route, the browser's built-in `AnalyserNode`, on live microphone input:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { useState } from "react";
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        LogarithmicAxis,
        NumericAxis,
        NumberRange,
        ENumericFormat,
        EAutoRange,
        FastMountainRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } from "scichart";

    // A live spectrum from the browser's own AnalyserNode (Web Audio API): no FFT code needed
    const initChart = async (rootElement: string | HTMLDivElement, stream: MediaStream) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(
            new LogarithmicAxis(wasmContext, {
                axisTitle: "Frequency (Hz)",
                logBase: 10,
                labelFormat: ENumericFormat.Engineering,
                visibleRange: new NumberRange(20, 20000)
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Level (dB)", autoRange: EAutoRange.Never, visibleRange: new NumberRange(-140, 0) })
        );

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 8192; // 4,096 bins
        analyser.smoothingTimeConstant = 0.8; // exponential averaging, from 0 (off) to just under 1
        audioContext.createMediaStreamSource(stream).connect(analyser);

        const levels = new Float32Array(analyser.frequencyBinCount); // dB, one per bin
        const binWidth = audioContext.sampleRate / analyser.fftSize;
        // Skip bin 0 (0 Hz), which a log axis can't show
        const frequencies = Array.from({ length: levels.length - 1 }, (_, i) => (i + 1) * binWidth);
        const spectrum = new XyDataSeries(wasmContext, { dataIsSortedInX: true });
        sciChartSurface.renderableSeries.add(
            new FastMountainRenderableSeries(wasmContext, { dataSeries: spectrum, stroke: "#50C7E0", fill: "#50C7E044", zeroLineY: -200 })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );

        let frame = 0;
        const draw = () => {
            analyser.getFloatFrequencyData(levels); // silence gives -Infinity, so clamp it
            spectrum.clear();
            spectrum.appendRange(frequencies, Array.from(levels.subarray(1), (dB) => Math.max(dB, -200)));
            frame = requestAnimationFrame(draw);
        };
        draw();
        // Stop the animation and release the microphone when the chart is deleted (the component unmounts)
        sciChartSurface.addDeletable({
            delete: () => {
                cancelAnimationFrame(frame);
                stream.getTracks().forEach((track) => track.stop());
                audioContext.close();
            }
        });
        return { sciChartSurface };
    };

    export const AudioSpectrumAnalyzer = () => {
        const [stream, setStream] = useState<MediaStream | null>(null);
        if (!stream) {
            // Start from a click: browsers only start audio after the user interacts, and ask for the microphone on HTTPS
            const start = async () =>
                setStream(await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }));
            return <button onClick={start}>Use my microphone</button>;
        }
        return <SciChartReact initChart={(root) => initChart(root, stream)} style={{ width: "100%", height: 400 }} />;
    };
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        LogarithmicAxis,
        NumericAxis,
        NumberRange,
        ENumericFormat,
        EAutoRange,
        FastMountainRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } from "scichart";

    // A live spectrum from the browser's own AnalyserNode (Web Audio API): no FFT code needed
    const initSpectrumChart = async (rootElement: string | HTMLDivElement, stream: MediaStream) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(
            new LogarithmicAxis(wasmContext, {
                axisTitle: "Frequency (Hz)",
                logBase: 10,
                labelFormat: ENumericFormat.Engineering,
                visibleRange: new NumberRange(20, 20000)
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Level (dB)", autoRange: EAutoRange.Never, visibleRange: new NumberRange(-140, 0) })
        );

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 8192; // 4,096 bins
        analyser.smoothingTimeConstant = 0.8; // exponential averaging, from 0 (off) to just under 1
        audioContext.createMediaStreamSource(stream).connect(analyser);

        const levels = new Float32Array(analyser.frequencyBinCount); // dB, one per bin
        const binWidth = audioContext.sampleRate / analyser.fftSize;
        // Skip bin 0 (0 Hz), which a log axis can't show
        const frequencies = Array.from({ length: levels.length - 1 }, (_, i) => (i + 1) * binWidth);
        const spectrum = new XyDataSeries(wasmContext, { dataIsSortedInX: true });
        sciChartSurface.renderableSeries.add(
            new FastMountainRenderableSeries(wasmContext, { dataSeries: spectrum, stroke: "#50C7E0", fill: "#50C7E044", zeroLineY: -200 })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );

        let frame = 0;
        const draw = () => {
            analyser.getFloatFrequencyData(levels); // silence gives -Infinity, so clamp it
            spectrum.clear();
            spectrum.appendRange(frequencies, Array.from(levels.subarray(1), (dB) => Math.max(dB, -200)));
            frame = requestAnimationFrame(draw);
        };
        draw();
        // Stop the animation and release the microphone when the chart is deleted (the component is destroyed)
        sciChartSurface.addDeletable({
            delete: () => {
                cancelAnimationFrame(frame);
                stream.getTracks().forEach((track) => track.stop());
                audioContext.close();
            }
        });
        return { sciChartSurface };
    };

    @Component({
        selector: "app-audio-spectrum-analyzer",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `
            @if (stream) {
                <scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>
            } @else {
                <button (click)="start()">Use my microphone</button>
            }
        `
    })
    export class AudioSpectrumAnalyzerComponent {
        stream: MediaStream | null = null;
        // Start from a click: browsers only start audio after the user interacts, and ask for the microphone on HTTPS
        async start() {
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
            });
        }
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = (rootElement: string | HTMLDivElement) => initSpectrumChart(rootElement, this.stream!);
    }
    ```
</CodeSnippetBlock>

Key points:

- The spectrum is an `XyDataSeries` of frequencies and levels drawn by a `FastMountainRenderableSeries`, with a peak-hold `FastLineRenderableSeries` on top. For bands, a `FastRectangleRenderableSeries` with an `XyxyDataSeries` draws each bar from its lower to its upper band edge (`EColumnMode.StartEnd`), so the bars sit exactly on the band edges on a log axis.
- A [LogarithmicAxis](/2d-charts/axis-api/axis-types/logarithmic-axis/) with `logBase: 10` gives one major gridline per decade (100 Hz, 1 kHz, 10 kHz) and minor gridlines at 2, 3, 4… times each. Swap it for a `NumericAxis` to get a linear frequency axis. Skip bin 0 (0 Hz): a log axis can't show it.
- Animate with `requestAnimationFrame`, and update the series with `clear()` and `appendRange()` each frame. A fixed y-axis range (`autoRange: EAutoRange.Never`) stops the axis jumping. Register a `delete` callback with `sciChartSurface.addDeletable()` to stop the loop and release the microphone when the chart goes away.
- For the microphone, `getUserMedia` works only in a secure context (HTTPS or `localhost`), and the browser asks the user's permission. Turn off `echoCancellation`, `noiseSuppression` and `autoGainControl`, which are meant for calls and reshape the spectrum. Inside an iframe on another site, the frame also needs `allow="microphone"`.

### Web Audio AnalyserNode or your own FFT?

The browser's `AnalyserNode` (part of the Web Audio API) runs the FFT for you. Set `fftSize` (a power of 2 from 32 to 32,768) and `smoothingTimeConstant` (its exponential averaging, 0.8 by default), and `getFloatFrequencyData()` fills an array with one level in dB per bin. It's the fastest way to a live display. `AnalyserNode` fixes three things:

- it always uses a Blackman window;
- its levels are relative: a full-scale sine reads about −14 dB rather than 0 dBFS, because of the window's gain and the FFT's scaling, so add an offset if you need dBFS;
- its smoothing is applied each time you call it, so the effective averaging time depends on how often you ask for data.

Your own FFT on `getFloatTimeDomainData()` (as in the JavaScript tab) gives you the window, the dB scaling, linear or exponential averaging, overlap, peak hold, bands and weighting. Use it when you need calibrated dBFS, bands or weighting.

**See it in the demo app:** [JavaScript audio spectrum analyzer](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example) · [React audio spectrum analyzer](https://www.scichart.com/demo/react/audio-analyzer-fft-example) · [Angular audio spectrum analyzer](https://www.scichart.com/demo/angular/audio-analyzer-fft-example). It analyses live audio from your microphone, with a waveform, an FFT spectrum and a spectrogram. SciChart also has audio analyzer examples for [Android](https://www.scichart.com/example/android-chart/android-audio-analyzer-chart-example/), [iOS](https://www.scichart.com/example/ios-chart/ios-audio-analyzer-chart-example/) and [WPF](https://www.scichart.com/example/wpf-chart/wpf-chart-audio-analyzer-example/).

**Go deeper:** [SciChart.js logarithmic axis documentation](/2d-charts/axis-api/axis-types/logarithmic-axis/), the [mountain (area) series](/2d-charts/chart-types/fast-mountain-area-renderable-series/) and [rectangle series](/2d-charts/chart-types/fast-rectangle-renderable-series/) documentation, and the guides to the [FFT](/learn/signal-processing/fast-fourier-transform/), [power spectral density](/learn/signal-processing/power-spectral-density/) and the [spectrogram](/learn/chart-types/cartesian/spectrogram/).

## Frequently asked questions

### What is a spectrum analyzer used for?

A spectrum analyzer is used to see which frequencies a signal contains and how strong each one is. In audio, that means balancing a mix with EQ, finding mains hum and feedback, measuring rooms, loudspeakers and headphones, and tracking machine noise. In radio and electronics, it checks transmitters, interference, harmonics and the noise floor of a circuit.

### What does a spectrum analyzer measure?

A spectrum analyzer measures the level of a signal at each frequency: amplitude or power on the vertical axis, frequency on the horizontal axis. From that display you read the frequency and level of tones and their harmonics, the noise floor, the bandwidth a signal occupies, and how the balance of low, mid and high frequencies changes over time.

### What is the difference between a spectrum analyzer and an oscilloscope?

An oscilloscope shows a signal's voltage against time: its waveform, timing, rise time and glitches. A spectrum analyzer shows the signal's level against frequency: which tones, harmonics and noise it contains. Use an oscilloscope to see when and what shape; use a spectrum analyzer to see which frequencies and how much. Many oscilloscopes have an FFT mode, but a dedicated analyzer usually has a lower noise floor and finer frequency resolution.

### What is resolution bandwidth on a spectrum analyzer?

Resolution bandwidth (RBW) is the width of the filter each point on the display measures through. Two tones closer together than about the RBW merge into one peak, and the displayed noise floor rises by 10 dB for every tenfold increase in RBW. In an FFT analyzer, the RBW is the bin width (sample rate divided by FFT size) times the window's noise bandwidth, about 1.5 bins for a Hann window.

### Why does pink noise slope down on a spectrum analyzer?

Pink noise has equal power in every octave, so its power per hertz falls by half (3 dB) each time the frequency doubles. An FFT analyzer's bins all have the same width in hertz, so pink noise slopes down at 3 dB per octave. An octave or 1/3-octave analyzer's bands get wider as frequency rises, which cancels the slope, so pink noise looks flat.

### How do I make an audio spectrum analyzer in JavaScript?

Get audio from the microphone with navigator.mediaDevices.getUserMedia on an HTTPS page, connect it to a Web Audio AnalyserNode, and call getFloatFrequencyData in a requestAnimationFrame loop to get one level in dB per frequency bin. For full control of the window, scaling and bands, read getFloatTimeDomainData and run your own FFT. Plot the levels against frequency on a logarithmic axis, for example with a SciChart.js LogarithmicAxis and a mountain series.

## Sources

- Smith, S. W., *The Scientist and Engineer's Guide to Digital Signal Processing*: [chapter 9, Applications of the DFT](https://www.dspguide.com/ch9.htm) (spectral analysis, windows and frequency resolution) and [chapter 12, The Fast Fourier Transform](https://www.dspguide.com/ch12.htm).
- Harris, F. J. (1978), [On the Use of Windows for Harmonic Analysis with the Discrete Fourier Transform](https://doi.org/10.1109/PROC.1978.10837). *Proceedings of the IEEE*, 66(1), 51–83. Equivalent noise bandwidth and leakage of each window.
- Welch, P. D. (1967), [The use of fast Fourier transform for the estimation of power spectra](https://doi.org/10.1109/TAU.1967.1161901). *IEEE Transactions on Audio and Electroacoustics*, 15(2), 70–73. Averaging overlapped, windowed segments.
- Smith, J. O., [Spectral Audio Signal Processing](https://ccrma.stanford.edu/~jos/sasp/), Center for Computer Research in Music and Acoustics (CCRMA), Stanford University. Short-time spectrum analysis of audio.
- ISO 266:1997, *Acoustics: Preferred frequencies*; IEC 61260-1:2014, *Electroacoustics: Octave-band and fractional-octave-band filters*; IEC 61672-1:2013, *Electroacoustics: Sound level meters*, which defines the A, C and Z frequency weightings.
- W3C, [Web Audio API: the AnalyserNode interface](https://www.w3.org/TR/webaudio/#AnalyserNode). The Blackman window, smoothing and dB conversion behind `getFloatFrequencyData`.

<LearnCta position="bottom" chart="audio spectrum analyzer" demo="audio-analyzer-fft-example" docs="/2d-charts/axis-api/axis-types/logarithmic-axis/" docsLabel="SciChart.js logarithmic axis documentation" />
