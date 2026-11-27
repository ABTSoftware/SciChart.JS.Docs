---
sidebar_position: 120
sidebar_label: IQ Data and Constellation Diagrams
title: "IQ Data and Constellation Diagrams: How to Read Them (Interactive)"
description: "What IQ data is, how to plot it, and how to read a constellation diagram: BPSK, QPSK, 16-QAM and 64-QAM, Gray coding, impairments, and EVM with a worked example."
keywords:
    [
        "iq data",
        "i/q data",
        "in-phase and quadrature",
        "constellation diagram",
        "how to read a constellation diagram",
        "qpsk constellation diagram",
        "qam constellation diagram",
        "16-qam constellation",
        "64-qam constellation",
        "bpsk constellation diagram",
        "error vector magnitude",
        "evm",
        "iq imbalance",
        "phase noise constellation"
    ]
image: /img/learn/iq-constellation-diagram-og.png
related: [rf-spectrum-analyzer, sigint, signal-to-noise-ratio, hilbert-transform]
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
                    "name": "What is IQ data?",
                    "acceptedAnswer": { "@type": "Answer", "text": "IQ data is a radio signal recorded as pairs of numbers: I, the in-phase part, and Q, the quadrature part, which is the same signal measured a quarter of a cycle later. Each pair is one complex sample, I + jQ, whose length is the signal's amplitude and whose angle is its phase. Software-defined radios, spectrum analysers and digital receivers all produce IQ data." }
                },
                {
                    "@type": "Question",
                    "name": "Why do radios use I and Q instead of a single signal?",
                    "acceptedAnswer": { "@type": "Answer", "text": "One real-valued sample cannot tell a frequency above the tuned centre from one below it, and cannot separate amplitude from phase. Two samples taken 90 degrees apart can. With I and Q, a receiver sampling at rate fs captures a band fs wide centred on the tuning frequency, measures amplitude and phase directly, and can demodulate any modulation in software." }
                },
                {
                    "@type": "Question",
                    "name": "How do you read a constellation diagram?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Check that the I and Q axes have the same scale, count the clusters to find the modulation and bits per symbol, then check that the pattern is centred, still and square. Next look at the shape of each cluster: round clouds mean noise, arcs mean phase noise, rings mean a frequency offset and pulled-in corners mean compression. Finally compare the cluster size with the spacing between points and read the EVM." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between QPSK and QAM?",
                    "acceptedAnswer": { "@type": "Answer", "text": "QPSK puts four points on a circle, so every symbol has the same amplitude and carries 2 bits in its phase. QAM changes both amplitude and phase, so its points form a grid: 16-QAM has 16 points and 4 bits per symbol, 64-QAM has 64 points and 6 bits. QPSK is the same constellation as 4-QAM. Larger QAM grids carry more bits but put the points closer together, so they need a cleaner signal." }
                },
                {
                    "@type": "Question",
                    "name": "What is a good EVM?",
                    "acceptedAnswer": { "@type": "Answer", "text": "It depends on the modulation: the more points, the lower the EVM must be. The 5G NR base station standard, 3GPP TS 38.104, allows up to 17.5% RMS EVM for QPSK, 12.5% for 16-QAM, 8% for 64-QAM and 3.5% for 256-QAM. When noise is the only impairment, EVM is about 1 divided by the square root of the SNR, so 5.6% corresponds to an SNR of 25 dB." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a constellation diagram in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Put the I values on the x axis and the Q values on the y axis of a scatter chart, with both axes on the same scale. In SciChart.js, use an XyScatterRenderableSeries with an XyDataSeries, and set fifoCapacity on the data series so it keeps only the newest symbols. Append each block of received symbols with one appendRange call, which keeps tens of thousands of points smooth in real time." }
                }
            ]
        })}
    </script>
</head>

# IQ Data and Constellation Diagrams

## What are IQ data and constellation diagrams?

**IQ data** is a radio signal recorded as pairs of samples: I (in-phase) and Q (quadrature, the same signal a quarter cycle later). Each pair is one complex number whose length is the signal's amplitude and whose angle is its phase. A **constellation diagram** plots those samples at each symbol instant as points on the I-Q plane, one cluster per symbol.

![A simulated 16-QAM constellation diagram with 16 clusters of received symbols in a 4 by 4 grid on the I-Q plane, beside the I and Q signals plotted against time and the spectrum of the IQ samples](/img/learn/iq-constellation-diagram-og.png)

*A simulated 16-QAM signal: the constellation (left), the I and Q signals against time (top right) and their spectrum (bottom right). [Try the interactive version](#how-to-plot-iq-data-and-a-constellation-diagram-in-javascript-react-or-angular).*

:::tip Key takeaways
- IQ data stores a signal as complex samples, I + jQ: amplitude and phase in one number, independent of the carrier frequency.
- A constellation diagram shows the received symbols as points. The number of clusters gives the modulation: 4 for QPSK, 16 for 16-QAM, 64 for 64-QAM.
- The shape of the clusters points to the cause of a problem: round clouds for noise, arcs for phase noise, rings for a frequency offset, a squashed grid for IQ imbalance, pulled-in corners for compression.
- Error vector magnitude (EVM) puts one number on the spread. With only noise present, EVM is about $1/\sqrt{\text{SNR}}$: 5.6% at 25 dB.
- Plot I against Q with equal axis scales, or a squashed constellation can be an artefact of the chart.
:::

## What is IQ data? In-phase and quadrature samples

IQ data describes a radio signal by two numbers per sample instead of one. Any signal near a carrier frequency $f_c$ can be written as two waves 90° apart, each with its own slowly changing amplitude:

$$
s(t) = I(t)\cos(2\pi f_c t) - Q(t)\sin(2\pi f_c t)
$$

$I(t)$ and $Q(t)$ hold all the information the transmitter put on the carrier. Written as one complex number per sample, $x = I + jQ$:

- the amplitude is $\sqrt{I^2 + Q^2}$;
- the phase is $\operatorname{atan2}(Q, I)$;
- a change of phase over time is a change of frequency.

### How a receiver produces IQ data

A receiver, a software-defined radio (SDR) or a vector signal analyser makes IQ data by quadrature downconversion. It multiplies the incoming signal by a local oscillator's cosine to get I and by its negative sine to get Q, low-pass filters both, and digitises them. The carrier is removed, so what's left is the **complex baseband** signal: the modulation alone, centred on 0 Hz.

A real-valued signal can do the same job only with twice the sample rate, because its spectrum is mirrored about 0 Hz and frequencies above and below the tuned centre land on top of each other. IQ samples keep them apart. A complex stream sampled at $f_s$ covers a band $f_s$ wide, from $-f_s/2$ to $+f_s/2$ around the tuned frequency; see [Nyquist and aliasing](/learn/applications/signal-processing/nyquist-and-aliasing/) for the sampling rules. The same pair, a signal plus a copy shifted by 90°, is what the [Hilbert transform](/learn/applications/signal-processing/hilbert-transform/) builds from a real signal: the analytic signal.

### How IQ data is stored

IQ recordings are usually interleaved pairs, I then Q, as 8-bit or 16-bit integers or 32-bit floats. The format and the sample rate aren't in the numbers themselves, so they travel as metadata: the open Signal Metadata Format (SigMF) stores them in a JSON file beside the samples, and ITU-R Recommendation SM.2117 defines a format for exchanging stored IQ data in spectrum monitoring.

## How to plot IQ data: four views

IQ data is plotted in four common ways, each answering a different question.

| View | Axes | Shows | Use it to |
| --- | --- | --- | --- |
| I and Q against time | Time, amplitude | Two waveforms | See bursts, levels, clipping and timing |
| IQ plot (vector diagram) | I, Q, every sample | The path the signal traces between symbols | See transitions and filtering |
| Constellation diagram | I, Q, only at the symbol instants | One cluster per symbol | Identify the modulation and judge quality |
| Spectrum | Frequency, power | Power against frequency, both sides of 0 Hz | Measure bandwidth, offsets and interference |

The time view is the raw material. The IQ plot draws every sample, so a filtered signal shows curved paths between the symbol points. The constellation keeps only the samples at the moments the receiver decides which symbol was sent, so the paths disappear and each symbol becomes a dot.

The spectrum of IQ data is two-sided. A Fourier transform of complex samples gives different values at $+f$ and $-f$, so the plot runs from $-f_s/2$ to $+f_s/2$ with the tuned frequency in the middle; see the [fast Fourier transform](/learn/applications/signal-processing/fast-fourier-transform/) guide. A spike exactly at 0 Hz usually comes from the receiver's own DC offset, not from the signal. For live spectra and waterfalls of IQ data, see the [RF spectrum analyzer](/learn/applications/rf-spectrum-analyzer/) guide.

## Constellation diagrams: BPSK, QPSK, 8PSK, 16-QAM and 64-QAM

A constellation diagram for a digital modulation has one ideal point per symbol the transmitter can send. With $M$ points, each symbol carries $\log_2 M$ bits.

| Modulation | Points | Bits per symbol | Layout | Where it is used (examples) |
| --- | --- | --- | --- | --- |
| BPSK (binary phase-shift keying) | 2 | 1 | Two points on a line | Satellite navigation signals, low-rate control links |
| QPSK (quadrature phase-shift keying) | 4 | 2 | Four points on a circle (the same as 4-QAM) | Satellite TV, the most noise-tolerant mode of 4G and 5G |
| 8PSK | 8 | 3 | Eight points on a circle | Satellite broadcasting (DVB-S2) |
| 16-QAM (quadrature amplitude modulation) | 16 | 4 | 4 × 4 grid | Wi-Fi, 4G and 5G |
| 64-QAM | 64 | 6 | 8 × 8 grid | Wi-Fi, 4G and 5G, cable |

PSK keeps every symbol at the same amplitude and uses only phase. QAM uses amplitude and phase, so its points fill a grid. Wi-Fi 6 (IEEE 802.11ax) goes up to 1024-QAM, 10 bits per symbol, for short, clean links.

More points carry more bits, but at the same average power they sit closer together. For square QAM the spacing between neighbours is $d = \sqrt{6/(M-1)}$ when the average symbol power is 1: 0.632 for 16-QAM and 0.309 for 64-QAM. Halving the spacing means the signal needs about 6 dB more SNR for the same error rate.

![A 16-QAM constellation diagram drawn as a 4 by 4 grid of ideal points on the I and Q axes, each labelled with four Gray-coded bits, with dashed decision boundaries halfway between points, the spacing d between neighbours, and one received sample near the point 1011 joined to it by an error vector arrow](./constellation-anatomy.svg)

### Gray coding: why neighbours differ by one bit

Bits are assigned to the points with a **Gray code**, so any two neighbouring points differ in exactly one bit. Noise usually pushes a symbol only as far as a neighbour, so a symbol error then costs one wrong bit, not several. The diagram above uses one common convention: the first two bits pick the column (I) and the last two pick the row (Q). Standards define their own exact mappings, so check the one your system uses.

### Decision boundaries

The receiver decides which symbol was sent by picking the nearest ideal point. The dashed lines halfway between points are the decision boundaries. A sample that crosses one is decoded as the wrong symbol, which happens once noise or distortion moves it by more than $d/2$ towards a neighbour.

## How to read a constellation diagram, step by step

Read a constellation from the whole pattern down to the single cluster:

1. Check the chart. I and Q must have the same scale, or a perfect grid looks stretched. Check whether you are looking at symbol instants or every sample, and whether the receiver has already corrected the frequency and phase.
2. Count the clusters. 2, 4, 8, 16 or 64 clusters identify the modulation and the bits per symbol. A ring or a blur instead of clusters means the receiver isn't locked yet.
3. Is it centred? A pattern shifted off the origin means a DC offset in the receiver, usually with a spike at 0 Hz in the spectrum.
4. Is it still? A pattern that spins, or smears into rings when many symbols are overlaid, means a frequency offset. A pattern that is still but rotated means a phase offset.
5. Is it square? A grid stretched along I or Q means IQ gain imbalance. A square that leans into a rhombus means quadrature skew: I and Q aren't exactly 90° apart.
6. What shape are the clusters? Round clouds of equal size mean noise. Arcs centred on the origin, longest on the outer points, mean phase noise. Small circles around every point mean an interfering tone. Outer points pulled towards the centre mean amplifier compression.
7. How big are the clusters compared with the spacing? Clusters that reach the decision boundaries produce symbol errors.
8. Read the numbers. EVM or MER puts a value on everything above; compare it with the limit for your modulation.

## What impairments look like on a constellation diagram

Each impairment distorts the constellation in its own way, so the shape often names the cause before any number does.

![Eight small simulated 16-QAM constellation diagrams, one per impairment: noise gives round clouds of equal size, phase noise gives arcs that are longest at the edge, a frequency offset spins the pattern into rings, IQ gain imbalance stretches the grid along one axis, quadrature skew leans the square into a rhombus, compression pulls the outer points in, a DC offset shifts the whole pattern off centre and an interfering tone draws small circles around each point](./constellation-impairments.svg)

| Impairment | What the constellation shows | Usual cause | Also visible in |
| --- | --- | --- | --- |
| Noise (low SNR) | Round, fuzzy clouds of the same size at every point | Weak signal, thermal noise in the receiver | A raised noise floor in the spectrum |
| Phase noise | Arcs centred on the origin; outer points spread furthest | Jitter in the local oscillators | A skirt around the carrier in the spectrum |
| Frequency offset | The pattern rotates; overlaid symbols form rings | Transmitter and receiver oscillators on slightly different frequencies, or Doppler shift | A spectrum shifted off centre |
| IQ gain imbalance | The grid is stretched along one axis and squeezed along the other | I and Q paths with unequal gain | A mirror image of the signal at the opposite frequency |
| Quadrature skew | The square grid leans into a rhombus | The two mixer signals not exactly 90° apart | The same mirror image |
| Compression | Outer and corner points pulled towards the centre | Power amplifier driven close to saturation | Spectral regrowth: shoulders either side of the channel |
| DC offset | The whole pattern shifted off the origin | Local oscillator leakage, DC offsets in the mixer | A spike at 0 Hz |
| Interfering tone | Small circles around every point | A continuous-wave signal inside the channel | A narrow spike inside the channel |

Some rules of thumb, for small impairments on a constellation with an average power of 1:

- Phase noise: an RMS phase error of $\sigma$ radians adds about $\sigma$ to the EVM. 3° is 0.052 rad, so about 5.2% EVM.
- IQ imbalance: the mirror image sits $10 \log_{10}\!\big[(1 + 2g\cos\varphi + g^2)/(1 - 2g\cos\varphi + g^2)\big]$ dB below the signal, for an amplitude ratio $g$ between I and Q and a phase error $\varphi$. 1 dB of gain imbalance alone leaves the image only about 25 dB down; 2° of skew alone leaves it about 35 dB down.
- Noise: EVM ≈ $1/\sqrt{\text{SNR}}$ when noise is the only impairment, as worked through below.

## EVM and MER: how to measure constellation quality

Error vector magnitude (EVM) measures how far the received symbols sit from where they should be. For each symbol, the **error vector** runs from the ideal point to the received sample. EVM is the RMS length of the error vectors divided by the RMS length of the ideal symbols:

$$
\text{EVM}_\text{rms} = \sqrt{\frac{\frac{1}{N}\sum_k |r_k - s_k|^2}{\frac{1}{N}\sum_k |s_k|^2}}
$$

where $r_k$ is the received symbol and $s_k$ the ideal one. It is given as a percentage, or in dB as $20\log_{10}(\text{EVM})$.

**Modulation error ratio** (MER) is the same comparison turned upside down and in decibels: the average ideal symbol power over the average error power. With this normalisation, MER in dB is minus the EVM in dB. Broadcasting and cable equipment tends to quote MER; cellular and Wi-Fi standards quote EVM.

### Worked example: EVM from four QPSK symbols

Take a QPSK constellation with ideal points at $(\pm 1, \pm 1)$, so each ideal symbol has power $1^2 + 1^2 = 2$. Four symbols are received:

| Ideal symbol | Received | Error vector | Error power $\lvert e \rvert^2$ |
| --- | --- | --- | --- |
| (1, 1) | (1.10, 0.95) | (0.10, −0.05) | 0.0125 |
| (−1, 1) | (−0.90, 1.05) | (0.10, 0.05) | 0.0125 |
| (−1, −1) | (−1.05, −0.85) | (−0.05, 0.15) | 0.0250 |
| (1, −1) | (0.95, −1.10) | (−0.05, −0.10) | 0.0125 |

- Mean error power: $0.0625 / 4 = 0.015625$.
- Mean ideal power: 2.
- EVM: $\sqrt{0.015625 / 2} = 0.0884$, or 8.8%, which is −21.1 dB.
- MER: $10 \log_{10}(2 / 0.015625) = 10 \log_{10}(128) = 21.1$ dB.

In practice EVM is averaged over thousands of symbols, as in the demo below.

### EVM and SNR

When noise is the only impairment, and the receiver knows which symbols were sent, the error power is the noise power. Then $\text{EVM} \approx 1/\sqrt{\text{SNR}}$ and MER equals the [signal-to-noise ratio](/learn/applications/signal-processing/signal-to-noise-ratio/):

| SNR | EVM | MER |
| --- | --- | --- |
| 20 dB | 10.0% | 20 dB |
| 25 dB | 5.6% | 25 dB |
| 30 dB | 3.2% | 30 dB |

Any other impairment adds to the EVM, so a measured EVM well above $1/\sqrt{\text{SNR}}$ points to distortion rather than noise.

### What is a good EVM?

The limit depends on the modulation, because denser constellations have less room between points. For example, 3GPP TS 38.104 allows a 5G NR base station at most 17.5% RMS EVM for QPSK, 12.5% for 16-QAM, 8% for 64-QAM and 3.5% for 256-QAM. Standards also differ in how they normalise: most divide by the average symbol power, as above, but some divide by the power of the outermost symbol, which gives a smaller number for the same signal (by a factor of $1/\sqrt{1.8}$ for 16-QAM). State which one you use.

## Constellation diagram vs eye diagram

An eye diagram overlays many short slices of the I (or Q) signal against time, each one or two symbols long, so the traces form an "eye". The height of the opening shows the noise margin and its width shows the timing margin.

| | Constellation diagram | Eye diagram |
| --- | --- | --- |
| Axes | I against Q | Amplitude against time within a symbol |
| Best for | Phase and amplitude errors, IQ imbalance, identifying the modulation | Timing errors, jitter, intersymbol interference, choosing the sampling instant |
| Hides | When in the symbol the sample was taken | Errors in the other channel (Q or I) |

They complement each other. A receiver sampling at the wrong moment shows a closed eye and a constellation with blurred, smeared clusters.

## Where constellation diagrams are used

Constellation diagrams are a standard view in vector signal analysers and SDR software. They are used in:

- Wireless and wired communications: designing and testing Wi-Fi, 4G and 5G radios, cable modems and satellite links, where EVM limits are part of the standards.
- Manufacturing test: checking every transmitter on a production line against its EVM limit.
- Spectrum monitoring: regulators identify the modulation of signals they find in a band. In defence, [signals intelligence](/learn/applications/sigint/) uses the same displays; intercepting communications is regulated and carried out only by authorised agencies.
- Optical fibre: coherent optical receivers recover IQ data from light and use the same constellations and EVM.

## Common constellation diagram mistakes

- **Unequal axis scales.** A chart that autoscales I and Q separately turns a square grid into a rectangle, which looks exactly like IQ gain imbalance. Lock both axes to the same scale.
- **Reading the constellation before carrier recovery.** A spinning pattern can be a receiver that hasn't locked yet, not a faulty transmitter. Check whether the frequency and phase have been corrected.
- **Plotting every sample instead of the symbol instants.** The transitions between symbols fill the space between points and look like noise.
- **Comparing EVM figures with different normalisations.** EVM relative to the peak symbol is lower than EVM relative to the average for the same signal, and some instruments report dB, others percent.
- **Too few symbols.** A few hundred points can't show rare outliers or estimate EVM to better than a few tenths of a percent. Use thousands, with persistence so the density is visible.
- **Swapping I and Q or the sign of Q.** The constellation is mirrored and the spectrum inverted. Check the convention of the recording.

## How to plot IQ data and a constellation diagram in JavaScript, React or Angular

SciChart.js draws scatter and line charts with WebGL, so a live constellation of tens of thousands of points stays smooth while new symbols arrive every frame. The demo simulates a signal from transmitter to receiver: random symbols, pulse shaping, amplifier compression, noise, phase noise, frequency offset and IQ imbalance, then a matched filter. Pick a **Modulation**, move the **SNR**, **Phase noise**, **Frequency offset**, **IQ gain imbalance**, **Quadrature skew** and **Compression** sliders and watch the constellation and the EVM readout change. Hover over the constellation to see the nearest ideal symbol and its bits, scroll to zoom, double-click to reset, and press **Pause** to freeze it.

<LiveDocSnippet maxWidth={'100%'} height={820} name="./Basic/demo" />

<LearnCta position="top" chart="constellation diagram" demo="scatter-chart" demoLabel="scatter chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter chart documentation" />

Here is the code. The live demo includes the signal simulation; the React and Angular versions show the core pattern for your own IQ symbols:

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
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        // The same range on both axes; keep the chart square so the grid isn't distorted
        const axisOptions = { autoRange: EAutoRange.Never, visibleRange: new NumberRange(-1.6, 1.6) };
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { ...axisOptions, axisTitle: "I (in-phase)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { ...axisOptions, axisTitle: "Q (quadrature)" }));

        // A FIFO buffer keeps only the newest 30,000 symbols, so older ones drop off as new ones arrive
        const symbols = new XyDataSeries(wasmContext, { fifoCapacity: 30000, containsNaN: false });
        sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: symbols,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 3, height: 3, fill: "#50C7E088", strokeThickness: 0 })
            })
        );

        const animate = () => {
            if (sciChartSurface.isDeleted) return; // stop when the chart is removed
            // Your data: the latest block of I and Q values at the symbol instants (arrays or Float64Arrays)
            const { i, q } = getYourIqSymbols();
            symbols.appendRange(i, q); // one call per block, never point by point
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        return { sciChartSurface };
    };

    export const ConstellationChart = () => (
        <SciChartReact initChart={initChart} style={{ width: 500, height: 500 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        XyDataSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme
    } from "scichart";

    @Component({
        selector: "app-constellation-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 500px; height: 500px"></scichart-angular>`
    })
    export class ConstellationChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            // The same range on both axes; keep the chart square so the grid isn't distorted
            const axisOptions = { autoRange: EAutoRange.Never, visibleRange: new NumberRange(-1.6, 1.6) };
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { ...axisOptions, axisTitle: "I (in-phase)" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { ...axisOptions, axisTitle: "Q (quadrature)" }));

            // A FIFO buffer keeps only the newest 30,000 symbols, so older ones drop off as new ones arrive
            const symbols = new XyDataSeries(wasmContext, { fifoCapacity: 30000, containsNaN: false });
            sciChartSurface.renderableSeries.add(
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: symbols,
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 3, height: 3, fill: "#50C7E088", strokeThickness: 0 })
                })
            );

            const animate = () => {
                if (sciChartSurface.isDeleted) return; // stop when the chart is removed
                // Your data: the latest block of I and Q values at the symbol instants (arrays or Float64Arrays)
                const { i, q } = getYourIqSymbols();
                symbols.appendRange(i, q); // one call per block, never point by point
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Fading persistence: the constellation is three `XyScatterRenderableSeries` layers that receive the same symbols, with `fifoCapacity` of 1,500, 6,000 and 30,000 and increasing transparency. The newest symbols are drawn three times, so they are brightest; the oldest fade into the background, and the FIFO buffers discard them without any extra code.
- Batches: each animation frame appends 500 symbols to each layer with a single `appendRange` call of typed arrays (`Float64Array`), never point by point.
- Square axes: both axes use `EAutoRange.Never`, and the demo resets the I range to match the chart's width-to-height ratio, so IQ imbalance and skew are shown at their true shape.
- The I and Q traces are `FastLineRenderableSeries` with scatter markers at the symbol instants; the spectrum is a Hann-windowed FFT of the complex samples, written in plain JavaScript. Swap the simulator for your SDR's IQ stream to plot real data.

**See it in the demo app:** [JavaScript scatter chart](https://www.scichart.com/demo/javascript/scatter-chart) · [React scatter chart](https://www.scichart.com/demo/react/scatter-chart) · [Angular scatter chart](https://www.scichart.com/demo/angular/scatter-chart). For a persistence display on line traces, see the [JavaScript real-time ghosted traces chart](https://www.scichart.com/demo/javascript/realtime-ghosted-traces-chart) · [React real-time ghosted traces chart](https://www.scichart.com/demo/react/realtime-ghosted-traces-chart) · [Angular real-time ghosted traces chart](https://www.scichart.com/demo/angular/realtime-ghosted-traces-chart).

**Go deeper:** [SciChart.js scatter chart documentation](/2d-charts/chart-types/xy-scatter-renderable-series/), [real-time updates and FIFO data series](/2d-charts/chart-types/data-series-api/realtime-updates/), and the related guides: [signal-to-noise ratio](/learn/applications/signal-processing/signal-to-noise-ratio/), [Hilbert transform](/learn/applications/signal-processing/hilbert-transform/) and [fast Fourier transform](/learn/applications/signal-processing/fast-fourier-transform/).

## Frequently asked questions

### What is IQ data?

IQ data is a radio signal recorded as pairs of numbers: I, the in-phase part, and Q, the quadrature part, which is the same signal measured a quarter of a cycle later. Each pair is one complex sample, I + jQ, whose length is the signal's amplitude and whose angle is its phase. Software-defined radios, spectrum analysers and digital receivers all produce IQ data.

### Why do radios use I and Q instead of a single signal?

One real-valued sample cannot tell a frequency above the tuned centre from one below it, and cannot separate amplitude from phase. Two samples taken 90 degrees apart can. With I and Q, a receiver sampling at rate fs captures a band fs wide centred on the tuning frequency, measures amplitude and phase directly, and can demodulate any modulation in software.

### How do you read a constellation diagram?

Check that the I and Q axes have the same scale, count the clusters to find the modulation and bits per symbol, then check that the pattern is centred, still and square. Next look at the shape of each cluster: round clouds mean noise, arcs mean phase noise, rings mean a frequency offset and pulled-in corners mean compression. Finally compare the cluster size with the spacing between points and read the EVM.

### What is the difference between QPSK and QAM?

QPSK puts four points on a circle, so every symbol has the same amplitude and carries 2 bits in its phase. QAM changes both amplitude and phase, so its points form a grid: 16-QAM has 16 points and 4 bits per symbol, 64-QAM has 64 points and 6 bits. QPSK is the same constellation as 4-QAM. Larger QAM grids carry more bits but put the points closer together, so they need a cleaner signal.

### What is a good EVM?

It depends on the modulation: the more points, the lower the EVM must be. The 5G NR base station standard, 3GPP TS 38.104, allows up to 17.5% RMS EVM for QPSK, 12.5% for 16-QAM, 8% for 64-QAM and 3.5% for 256-QAM. When noise is the only impairment, EVM is about 1 divided by the square root of the SNR, so 5.6% corresponds to an SNR of 25 dB.

### How do I plot a constellation diagram in JavaScript?

Put the I values on the x axis and the Q values on the y axis of a scatter chart, with both axes on the same scale. In SciChart.js, use an XyScatterRenderableSeries with an XyDataSeries, and set fifoCapacity on the data series so it keeps only the newest symbols. Append each block of received symbols with one appendRange call, which keeps tens of thousands of points smooth in real time.

## Sources

- Proakis, J. G. and Salehi, M. (2008), *Digital Communications*, 5th edition, McGraw-Hill. Signal constellations for PSK and QAM, Gray coding, minimum-distance detection and symbol error rates.
- Sklar, B. (2001), *Digital Communications: Fundamentals and Applications*, 2nd edition, Prentice Hall. The quadrature (I and Q) representation of bandpass signals and complex baseband.
- Razavi, B. (2012), *RF Microelectronics*, 2nd edition, Prentice Hall. Quadrature downconversion, IQ gain and phase imbalance and image rejection, and amplifier compression.
- 3GPP, [TS 38.104: NR; Base Station (BS) radio transmission and reception](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3202), section 6.5.2 (error vector magnitude). The EVM limits per modulation quoted above.
- ETSI (2020), [TR 101 290 V1.4.1: Digital Video Broadcasting (DVB); Measurement guidelines for DVB systems](https://www.etsi.org/deliver/etsi_tr/101200_101299/101290/01.04.01_60/tr_101290v010401p.pdf). Definitions of modulation error ratio (MER) and EVM.
- IEEE (2021), *IEEE Std 802.11ax-2021: Enhancements for High-Efficiency WLAN* (Wi-Fi 6). Adds 1024-QAM.
- ITU-R (2018), [Recommendation SM.2117-0: Data format definition for exchanging stored I/Q data for the purpose of spectrum monitoring](https://www.itu.int/rec/R-REC-SM.2117-0-201809-I/en).
- [Signal Metadata Format (SigMF) specification](https://github.com/sigmf/SigMF), an open standard for recorded IQ data and its metadata.

<LearnCta position="bottom" chart="constellation diagram" demo="scatter-chart" demoLabel="scatter chart" docs="/2d-charts/chart-types/xy-scatter-renderable-series/" docsLabel="SciChart.js scatter chart documentation" />
