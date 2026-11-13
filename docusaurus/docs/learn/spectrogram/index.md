---
sidebar_position: 10
sidebar_label: Spectrogram
title: "Spectrogram: What It Is & How to Read It (With Interactive Examples)"
description: "What a spectrogram is, how to read time, frequency and colour, how it is made with an FFT, how window size trades time against frequency detail, and where spectrograms are used. With a live, real-time example."
keywords:
    [
        "spectrogram",
        "what is a spectrogram",
        "how to read a spectrogram",
        "audio spectrogram",
        "mel spectrogram",
        "spectrogram vs spectrum",
        "waterfall plot"
    ]
image: /img/learn/spectrogram-og.png
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a spectrogram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A spectrogram is a picture of how the frequencies in a signal change over time. Time runs along the horizontal axis, frequency runs up the vertical axis, and the colour of each point shows how strong that frequency was at that moment, often in decibels." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a spectrogram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Check the colour scale first, so you know which colours are loud and which are quiet. Then read left to right through time: a horizontal line is a steady tone, stacked parallel lines are a sound and its harmonics, a rising or falling line is a changing pitch, a vertical line is a click or other short sound, and a speckled background is noise." }
                },
                {
                    "@type": "Question",
                    "name": "How does a spectrogram work?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The signal is cut into short, usually overlapping windows. A Fourier transform (in practice, an FFT) of each window measures how strong each frequency is in it, and the result becomes one column of the spectrogram. This is called the short-time Fourier transform (STFT)." }
                },
                {
                    "@type": "Question",
                    "name": "What is a mel spectrogram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A mel spectrogram is a spectrogram whose frequency axis uses the mel scale, which spaces frequencies roughly the way people hear pitch: more detail at low frequencies, less at high ones. Mel spectrograms are widely used as the input to speech recognition and other audio machine-learning models." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a spectrogram and a spectrum?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A spectrum (or FFT plot) shows the strength of each frequency at one moment, as a line chart of level against frequency. A spectrogram stacks many spectra side by side over time and shows level as colour, so you can see how the frequencies change." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a spectrogram in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Compute a spectrum (for example with an FFT) for each new block of samples. With SciChart.js, put the spectra in a UniformHeatmapDataSeries, one column per time step and one row per frequency band, draw it with a UniformHeatmapRenderableSeries and a HeatmapColorMap in decibels, and call setZValues() as new columns arrive so the chart scrolls. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Spectrogram

:::info Looking for the SciChart.js API?
A spectrogram in SciChart.js is a real-time heatmap. See the [SciChart.js spectrogram documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/) for `UniformHeatmapRenderableSeries`, colour maps and real-time updates.
:::

A **spectrogram** shows how the **frequencies** in a signal change over **time**. Time runs along the horizontal axis, frequency (pitch, for sound) runs up the vertical axis, and the **colour** of each point shows how strong that frequency was at that moment, usually in **decibels (dB)**. It turns sound, vibration or radio signals into a picture you can read at a glance.

The spectrogram below is generated live: two steady tones, a tone that pulses on and off, and a sweep that rises from 500 Hz to 7,000 Hz every four seconds, over a background of noise. Scroll to zoom into a frequency band, drag up or down to pan, double-click to reset, and hover to read the level.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="spectrogram" demo="audio-analyzer-fft-example" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/" />

## How to read a spectrogram

![Anatomy of a spectrogram: time on the horizontal axis, frequency on the vertical axis, colour from quiet (black) to loud (pale yellow), with a steady tone as a horizontal line, a sweep as a rising line and a click as a vertical line](./spectrogram-anatomy.svg)

- **Start with the colour scale.** It tells you which colours are loud and which are quiet. Levels are usually in decibels, a logarithmic scale, so quiet detail and loud tones fit on one chart.
- **Each vertical slice is one moment.** Reading up a slice tells you which frequencies were present then, and how strong each was.
- **Horizontal lines are steady tones.** A hum, a whistle or a machine running at constant speed draws a flat line at its frequency. In the demo, the tones at 1,000 Hz and 3,000 Hz are flat lines.
- **Stacked parallel lines are harmonics.** Voices, instruments and rotating machinery produce a **fundamental** frequency plus harmonics at whole-number multiples of it.
- **Sloping lines are changing pitch.** A rising line is a sweep or **chirp**, like the diagonal lines in the demo; birdsong and sirens look like this.
- **Vertical lines are short, sharp sounds** such as clicks, knocks or drum hits, which contain many frequencies at once.
- **Speckle is noise.** Broadband noise, such as hiss, fills many frequencies with low, random levels.

## How a spectrogram is made

You don't need the maths to read a spectrogram, but knowing how it is made explains what it can and can't show.

1. **Cut the signal into short windows,** for example 1,024 samples each, usually overlapping.
2. **Taper each window** with a window function (such as a Hann window), so the cut edges don't add false frequencies.
3. **Take a Fourier transform of each window.** In practice this is a fast Fourier transform (**FFT**). It measures how strong each frequency is in that window. Together, these steps are the **short-time Fourier transform** (STFT).
4. **Convert to decibels and colour it.** Each window's result becomes one column of the spectrogram; each frequency band becomes one row.

The highest frequency a spectrogram can show is half the signal's sample rate (the **Nyquist frequency**): 22,050 Hz for audio sampled at 44,100 Hz.

### Window size: time detail versus frequency detail

The window length sets a trade-off you can't avoid. A long window separates frequencies finely but blurs when things happened; a short window shows timing sharply but blurs frequencies together.

| Window (at 44,100 samples per second) | Time per column | Frequency band width | Good for |
| --- | --- | --- | --- |
| 256 samples | about 6 ms | about 172 Hz | Clicks, drum hits and other fast events |
| 1,024 samples | about 23 ms | about 43 Hz | General audio and speech |
| 4,096 samples | about 93 ms | about 11 Hz | Separating close musical notes or steady machine tones |

Band width is the sample rate divided by the window length; time per column is the window length divided by the sample rate (overlapping windows add columns more often, but don't sharpen the time detail).

### Variants

| Variant | What changes | Typical use |
| --- | --- | --- |
| **Linear spectrogram** | Frequency axis evenly spaced, as in the demo | Engineering, vibration, radio |
| **Log-frequency spectrogram** | Frequency axis on a logarithmic scale, so each octave takes the same height | Music analysis |
| **Mel spectrogram** | Frequency axis on the mel scale, which spaces frequencies roughly as people hear pitch | Speech recognition and audio machine learning |
| **Waterfall display** | A spectrogram that scrolls as new data arrives, often top to bottom | Radio and software-defined radio (SDR), sonar |

## When to use a spectrogram

Use a spectrogram when **the frequencies in a signal change over time** and you need to see when each one starts, stops or moves. Spectrograms are used in:

- **Audio and music:** finding noise, hum and clipping, checking mixes, analysing notes and harmonics.
- **Speech:** phonetics and voice analysis, where vowels show as bands called formants.
- **Bioacoustics:** identifying birdsong and bat, whale and dolphin calls.
- **Vibration and condition monitoring:** spotting a bearing or gear fault as a new tone appearing or drifting.
- **Radar and sonar:** seeing targets and their movement (for example, micro-Doppler signatures).
- **Medicine:** time-frequency analysis of EEG (brain wave) signals.
- **Radio:** watching which channels are busy, on spectrum analysers and SDR waterfall displays.

| Chart | Best for |
| --- | --- |
| **Spectrogram** | How frequencies change over time |
| Waveform ([line chart](/learn/line-chart/)) | The raw signal: amplitude against time; good for loudness and timing, poor for pitch |
| Spectrum (FFT plot) | Level against frequency at one moment; precise levels, but no history |
| [Heatmap](/learn/heatmap/) | Any grid of values; a spectrogram is a heatmap with time and frequency as its axes |

Many tools show a waveform, a spectrum and a spectrogram together, as in the SciChart audio analyser demo.

## How to create a spectrogram in JavaScript, React or Angular

In SciChart.js a spectrogram is a real-time, scrolling heatmap: you compute each new spectrum (for example with an FFT of the latest samples), and SciChart.js draws it with WebGL and WebGPU, so the chart keeps up with live data. Here is the code for the chart above:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        EAutoRange,
        UniformHeatmapRenderableSeries,
        UniformHeatmapDataSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme
    } from "scichart";

    const BINS = 256; // frequency bands per spectrum
    const COLUMNS = 200; // spectra kept on screen

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Always }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Frequency (Hz)" }));

        // zValues[frequency band][time column], in dB
        const zValues: number[][] = Array.from({ length: BINS }, () => new Array(COLUMNS).fill(-90));
        const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
            zValues,
            xStart: 0,
            xStep: 0.05, // seconds per spectrum
            yStart: 0,
            yStep: 8000 / BINS // Hz per frequency band
        });
        sciChartSurface.renderableSeries.add(
            new UniformHeatmapRenderableSeries(wasmContext, {
                dataSeries,
                colorMap: new HeatmapColorMap({
                    minimum: -90,
                    maximum: -10,
                    gradientStops: [
                        { offset: 0, color: "#000004" },
                        { offset: 0.5, color: "#932667" },
                        { offset: 1, color: "#FCFFA4" }
                    ]
                })
            })
        );

        // Each time a new spectrum arrives, scroll the chart by one column
        const timer = setInterval(() => {
            const spectrum = getYourNextSpectrum(); // one dB level per frequency band, e.g. from an FFT
            spectrum.forEach((level, bin) => {
                zValues[bin].shift();
                zValues[bin].push(level);
            });
            dataSeries.xStart += dataSeries.xStep;
            dataSeries.setZValues(zValues);
        }, 50);
        sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });

        return { sciChartSurface };
    };

    export const Spectrogram = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        EAutoRange,
        UniformHeatmapRenderableSeries,
        UniformHeatmapDataSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme
    } from "scichart";

    const BINS = 256; // frequency bands per spectrum
    const COLUMNS = 200; // spectra kept on screen

    @Component({
        selector: "app-spectrogram",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class SpectrogramComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Always }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Frequency (Hz)" }));

            // zValues[frequency band][time column], in dB
            const zValues: number[][] = Array.from({ length: BINS }, () => new Array(COLUMNS).fill(-90));
            const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
                zValues,
                xStart: 0,
                xStep: 0.05, // seconds per spectrum
                yStart: 0,
                yStep: 8000 / BINS // Hz per frequency band
            });
            sciChartSurface.renderableSeries.add(
                new UniformHeatmapRenderableSeries(wasmContext, {
                    dataSeries,
                    colorMap: new HeatmapColorMap({
                        minimum: -90,
                        maximum: -10,
                        gradientStops: [
                            { offset: 0, color: "#000004" },
                            { offset: 0.5, color: "#932667" },
                            { offset: 1, color: "#FCFFA4" }
                        ]
                    })
                })
            );

            // Each time a new spectrum arrives, scroll the chart by one column
            const timer = setInterval(() => {
                const spectrum = getYourNextSpectrum(); // one dB level per frequency band, e.g. from an FFT
                spectrum.forEach((level, bin) => {
                    zValues[bin].shift();
                    zValues[bin].push(level);
                });
                dataSeries.xStart += dataSeries.xStep;
                dataSeries.setZValues(zValues);
            }, 50);
            sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });

            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- A [UniformHeatmapDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/uniformheatmapdataseries.html) holds the spectrogram as a 2D array, `zValues[frequency band][time column]`. `yStep` is the width of each frequency band (sample rate divided by FFT size) and `xStep` is the time between spectra.
- To scroll, drop the oldest column, add the newest, call `setZValues()` and move `xStart` on. An x-axis with `autoRange: EAutoRange.Always` follows the newest data.
- A [HeatmapColorMap](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmapcolormap.html) with `minimum` and `maximum` in decibels sets the colour scale; a [HeatmapLegend](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmaplegend.html) shows it.
- SciChart.js draws the chart; the FFT is up to you. The audio analyser demo below includes an FFT, a microphone input, a waveform and a spectrum alongside its spectrogram.

**See it in the demo app:** [JavaScript spectrogram](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example) · [React spectrogram](https://www.scichart.com/demo/react/audio-analyzer-fft-example) · [Angular spectrogram](https://www.scichart.com/demo/angular/audio-analyzer-fft-example)

**Go deeper:** [SciChart.js spectrogram documentation](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/), including [updating a heatmap in real time](/2d-charts/chart-types/uniform-heatmap-renderable-series/updating-realtime/) and [colour maps and legends](/2d-charts/chart-types/uniform-heatmap-renderable-series/color-maps-and-legends/). New to heatmaps? Read our [heatmap guide](/learn/heatmap/).

## Frequently asked questions

### What is a spectrogram?

A spectrogram is a picture of how the frequencies in a signal change over time. Time runs along the horizontal axis, frequency runs up the vertical axis, and the colour of each point shows how strong that frequency was at that moment, often in decibels.

### How do you read a spectrogram?

Check the colour scale first, so you know which colours are loud and which are quiet. Then read left to right through time: a horizontal line is a steady tone, stacked parallel lines are a sound and its harmonics, a rising or falling line is a changing pitch, a vertical line is a click or other short sound, and a speckled background is noise.

### How does a spectrogram work?

The signal is cut into short, usually overlapping windows. A Fourier transform (in practice, an FFT) of each window measures how strong each frequency is in it, and the result becomes one column of the spectrogram. This is called the short-time Fourier transform (STFT).

### What is a mel spectrogram?

A mel spectrogram is a spectrogram whose frequency axis uses the mel scale, which spaces frequencies roughly the way people hear pitch: more detail at low frequencies, less at high ones. Mel spectrograms are widely used as the input to speech recognition and other audio machine-learning models.

### What is the difference between a spectrogram and a spectrum?

A spectrum (or FFT plot) shows the strength of each frequency at one moment, as a line chart of level against frequency. A spectrogram stacks many spectra side by side over time and shows level as colour, so you can see how the frequencies change.

### How do I make a spectrogram in JavaScript?

Compute a spectrum (for example with an FFT) for each new block of samples. With SciChart.js, put the spectra in a `UniformHeatmapDataSeries`, one column per time step and one row per frequency band, draw it with a `UniformHeatmapRenderableSeries` and a `HeatmapColorMap` in decibels, and call `setZValues()` as new columns arrive so the chart scrolls. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`. See the code above.

<LearnCta position="bottom" chart="spectrogram" demo="audio-analyzer-fft-example" docs="/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/" />
