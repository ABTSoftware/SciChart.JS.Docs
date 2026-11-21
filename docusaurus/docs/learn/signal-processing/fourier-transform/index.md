---
sidebar_position: 100
sidebar_label: Fourier Transform
title: "Fourier Transform: What It Is, the Formula & Examples (With an Interactive Demo)"
description: "What the Fourier transform is, how it splits a signal into sine waves, its formula and inverse, the DFT, magnitude and phase, key pairs and properties. Live demo."
keywords:
    [
        "fourier transform",
        "what is a fourier transform",
        "fourier transform formula",
        "inverse fourier transform",
        "discrete fourier transform",
        "fourier transform properties",
        "fourier transform pairs",
        "fourier transform examples",
        "fourier series vs fourier transform"
    ]
image: /img/learn/fourier-transform-og.png
related: [fourier-series, fast-fourier-transform, spectrogram, convolution]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does a Fourier transform do?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A Fourier transform takes a signal recorded over time and works out which frequencies it contains, and how strong each one is. It turns a waveform into a spectrum: a list of sine waves, each with an amplitude and a phase, that add up to the original signal. The inverse transform turns the spectrum back into the waveform." }
                },
                {
                    "@type": "Question",
                    "name": "What is the Fourier transform used for?",
                    "acceptedAnswer": { "@type": "Answer", "text": "It is used wherever the frequencies in a signal matter: audio analysis, removing noise and hum, finding machine faults from vibration, radio and mobile communications, and MRI scanning. Close relatives of it compress MP3 audio and JPEG images." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a Fourier series and a Fourier transform?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A Fourier series describes a periodic signal, one that repeats forever, as a sum of sine waves at whole-number multiples of its repeat frequency, so its spectrum is a set of separate lines. A Fourier transform works on any signal, repeating or not, and gives a continuous spectrum. The Fourier series is the special case of the transform for periodic signals." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between the DFT and the FFT?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The discrete Fourier transform (DFT) is the calculation: the Fourier transform of a finite list of samples. The fast Fourier transform (FFT) is an algorithm that computes exactly the same result much faster, in about N log N steps instead of N squared. Software almost always uses an FFT to compute a DFT." }
                },
                {
                    "@type": "Question",
                    "name": "Is the Fourier transform reversible?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes. The inverse Fourier transform rebuilds the original signal from its spectrum, as long as you keep both the magnitude and the phase of every frequency. For sampled data, the inverse DFT recovers the samples exactly, apart from tiny rounding errors. If you keep only the magnitude, the signal cannot be rebuilt." }
                },
                {
                    "@type": "Question",
                    "name": "How do I compute and plot a Fourier transform in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Compute the discrete Fourier transform of your samples with a short DFT or FFT function, convert each result to an amplitude (scaled by 2/N) and a frequency (bin number times sample rate divided by N), and plot them. With SciChart.js, put the frequencies and amplitudes in an XyDataSeries and draw them with a FastImpulseRenderableSeries or FastLineRenderableSeries. The same chart works in React with scichart-react and in Angular with scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Fourier Transform

## What is a Fourier transform?

A **Fourier transform** is a mathematical tool that breaks a signal into the sine waves it is made of. It takes a signal measured over time and returns its **frequency spectrum**: how much of each frequency the signal contains (the amplitude) and where each wave starts in its cycle (the phase). The inverse transform puts the waves back together.

![A Fourier transform of a square wave: the top chart shows four sine waves at 5, 15, 25 and 35 Hz and their sum, a wave with flat tops; the bottom chart shows four spikes at those frequencies, getting shorter as the frequency rises](/img/learn/fourier-transform-og.png)

*Four sine waves add up to an approximate square wave (top). The Fourier transform of that sum finds each wave again as a spike at its frequency (bottom). [Try the interactive version](#how-to-compute-and-plot-a-fourier-transform-in-javascript-react-or-angular).*

:::tip Key takeaways
- Any practical signal can be written as a sum of sine waves. The Fourier transform finds their frequencies, amplitudes and phases.
- It moves a signal from the time domain (value against time) to the frequency domain (strength against frequency). The inverse Fourier transform moves it back, with nothing lost.
- For sampled data, computers use the discrete Fourier transform (DFT), almost always calculated with the fast algorithm, the FFT.
- The convolution theorem makes filtering easy in the frequency domain: convolution in time becomes multiplication in frequency.
- It is behind audio analysers, noise filters, vibration monitoring, radio, MRI scanners and, through close relatives, MP3 and JPEG compression.
:::

## How the Fourier transform works

Think of a chord played on a piano. Your ear hears one sound, but it is three or four notes at once, each a vibration at its own frequency. A microphone records only the combined wave. The Fourier transform reverses the mixing: from the combined wave alone, it tells you which notes were played and how loudly.

![Left: a 3 Hz sine wave of amplitude 1 and an 8 Hz sine wave of amplitude 0.5 add up to a wavy signal. Right: its Fourier transform is two spikes, height 1 at 3 Hz and height 0.5 at 8 Hz. Arrows show the transform going from the signal to the spectrum and the inverse transform coming back](./time-and-frequency-domain.svg)

It works by testing the signal against one frequency at a time:

1. Pick a test frequency, say 3 Hz, and make a sine wave and a cosine wave at that frequency.
2. Multiply the signal by each test wave, point by point, and add up the results. If the signal contains 3 Hz, its peaks line up with the test wave's peaks again and again, and the total grows large. If it doesn't, the products are positive about as often as negative and cancel out to nearly zero.
3. Read off amplitude and phase. The size of the two totals together gives the amplitude at 3 Hz. Their ratio (how much matched the cosine and how much the sine) gives the phase.
4. Repeat for every frequency. The list of results is the spectrum.

This test works because sine waves of different frequencies are **orthogonal**: over a whole number of cycles, multiplying two of them together and adding up gives exactly zero. Each test frequency picks out its own ingredient and ignores the rest.

### Worked example: a four-sample DFT

Take four samples of one cycle of a sine wave, $x = [0, 1, 0, -1]$. Testing each frequency bin $k$ with the DFT formula below gives:

| Bin $k$ | Frequency | $X[k]$ | Amplitude $2\lvert X[k] \rvert / N$ | Phase |
| --- | --- | --- | --- | --- |
| 0 | 0 (the average) | 0 | 0 | none |
| 1 | 1 cycle per 4 samples | $-2i$ | 1 | −90° |
| 2 | 2 cycles per 4 samples | 0 | 0 | none |
| 3 | mirror of bin 1 | $+2i$ | (mirror) | +90° |

The transform finds one wave, of amplitude 1, at bin 1, which is exactly what went in. The −90° phase says it is a sine (which starts at zero) rather than a cosine (which starts at its peak). Bin 3 is a mirror image of bin 1: for real-valued signals, the top half of the DFT repeats the bottom half, which is why spectrum charts show only frequencies up to half the sample rate.

## The Fourier transform formula

For a signal $x(t)$ that varies with time $t$ (in seconds), the Fourier transform gives a function $X(f)$ of frequency $f$ (in hertz):

$$
X(f) = \int_{-\infty}^{\infty} x(t)\, e^{-i 2\pi f t}\, dt
$$

The term $e^{-i 2\pi f t} = \cos(2\pi f t) - i \sin(2\pi f t)$ is the test wave from the steps above: a cosine and a sine at frequency $f$, packed into one complex number by Euler's formula. The integral is the "multiply and add up".

The **inverse Fourier transform** rebuilds the signal by adding up every frequency's wave with its amplitude and phase:

$$
x(t) = \int_{-\infty}^{\infty} X(f)\, e^{i 2\pi f t}\, df
$$

The only differences are the sign in the exponent and which variable you integrate over. Many textbooks use angular frequency $\omega = 2\pi f$ instead. Then a factor of $1/2\pi$ appears in front of one of the integrals (or $1/\sqrt{2\pi}$ in front of both). The results are the same; only the bookkeeping changes, so check which convention a table uses before copying from it.

### The discrete Fourier transform (DFT)

Real measurements are a list of $N$ samples, $x[0], x[1], \ldots, x[N-1]$, taken at a fixed **sample rate** $f_s$. The **discrete Fourier transform** replaces the integral with a sum:

$$
X[k] = \sum_{n=0}^{N-1} x[n]\, e^{-i 2\pi k n / N}, \qquad k = 0, 1, \ldots, N-1
$$

and the inverse DFT is:

$$
x[n] = \frac{1}{N} \sum_{k=0}^{N-1} X[k]\, e^{i 2\pi k n / N}
$$

Each output $X[k]$ is a **frequency bin**. Bin $k$ is the frequency $f_k = k \, f_s / N$, so the bins are spaced $f_s / N$ apart, and the highest frequency you can measure is half the sample rate (the **Nyquist frequency**). Calculating every bin directly takes about $N^2$ multiplications. The [fast Fourier transform (FFT)](/learn/signal-processing/fast-fourier-transform/) gets exactly the same numbers in about $N \log_2 N$, which is why FFT analysers can update in real time.

This page puts the $1/N$ on the inverse DFT, as NumPy and MATLAB do; some texts put it on the forward transform instead, so check the convention before comparing numbers.

### The real DFT: cosine and sine amplitudes

The formula above is the **complex DFT**: $N$ complex values in, $N$ complex values out. A measured signal is usually real, and then half of that output is redundant, because bin $N - k$ is the complex conjugate of bin $k$. The **real DFT** keeps the useful half, bins $0$ to $N/2$ (for even $N$), and writes each bin as two real numbers:

$$
\operatorname{Re}X[k] = \sum_{n=0}^{N-1} x[n] \cos\!\left(\frac{2\pi k n}{N}\right), \qquad
\operatorname{Im}X[k] = -\sum_{n=0}^{N-1} x[n] \sin\!\left(\frac{2\pi k n}{N}\right)
$$

Since $e^{-i\theta} = \cos\theta - i \sin\theta$, these are just the real and imaginary parts of the complex $X[k]$. Each bin says how much cosine and how much sine the signal holds at that frequency.

![Two rows of boxes for N = 8. Real DFT: 8 real samples x[n], numbered 0 to N − 1, go in; two arrays of N/2 + 1 = 5 values come out, Re X[k] (the cosine amplitudes) and Im X[k] (the sine amplitudes), numbered 0 to N/2. Complex DFT: 8 complex samples (real part and imaginary part, all zeros for a real signal) go in; 8 complex values come out, numbered 0 to N − 1, and for a real signal bins 5 to 7 mirror bins 3 to 1, so Re X is symmetric about N/2 and Im X is antisymmetric. Adapted from Burnett-Thompson (2007)](./real-vs-complex-dft.svg)

*Adapted from [Burnett-Thompson (2007)](#sources).*

To rebuild the signal, add up a cosine and a sine for every bin:

$$
x[n] = \sum_{k=0}^{N/2} \left[ a_k \cos\!\left(\frac{2\pi k n}{N}\right) + b_k \sin\!\left(\frac{2\pi k n}{N}\right) \right]
$$

where the wave amplitudes are $a_k = \tfrac{2}{N}\operatorname{Re}X[k]$ and $b_k = -\tfrac{2}{N}\operatorname{Im}X[k]$, except at the two ends: $a_0 = \operatorname{Re}X[0]/N$ and $a_{N/2} = \operatorname{Re}X[N/2]/N$. The factor of 2 is there because each of the other bins shares its wave with its mirror bin in the complex DFT; bins $0$ and $N/2$ have no mirror, so they get half the weight. Their sine terms are always zero. In the four-sample example above, $\operatorname{Im}X[1] = -2$, so $b_1 = -\tfrac{2}{4} \times (-2) = 1$: one sine wave of amplitude 1.

## Magnitude and phase

Each value of a Fourier transform is a **complex number**, $X = a + ib$. It holds two facts about one frequency:

- **Magnitude** (or amplitude), $\lvert X \rvert = \sqrt{a^2 + b^2}$: how strong that frequency is. A chart of magnitude against frequency is the **magnitude spectrum**, the chart most people mean by "the Fourier transform". Squared, it is the **power spectrum**; on a log scale, in decibels, it is $20 \log_{10} \lvert X \rvert$.
- **Phase**, $\varphi = \operatorname{atan2}(b, a)$: where that wave is in its cycle at time zero, in degrees or radians.

Most charts show only the magnitude, because that answers "what frequencies are in here?". Two signals with the same magnitude spectrum and different phases can look completely different over time: a single click and a burst of white noise both have a roughly flat magnitude spectrum. You need both to run the inverse transform.

To scale a DFT to real units, so that a sine wave of amplitude $A$ shows as a bar of height $A$, multiply $\lvert X[k] \rvert$ by $2/N$ (and the zero-frequency bin, the average, by $1/N$). Libraries differ in where they put the $1/N$, so a spectrum that is 512 times too tall usually means a missing scale factor.

## Common Fourier transform pairs

A **transform pair** is a signal and its Fourier transform. All use the convention above, with $f$ in hertz.

| Signal $x(t)$ | Fourier transform $X(f)$ | What it tells you |
| --- | --- | --- |
| Impulse $\delta(t)$ | $1$ | A single instant contains every frequency equally: a click is broadband |
| Constant $1$ | $\delta(f)$ | A steady value is all at zero frequency (DC) |
| Cosine $\cos(2\pi f_0 t)$ | $\tfrac{1}{2}[\delta(f - f_0) + \delta(f + f_0)]$ | One frequency: two spikes, at $+f_0$ and its mirror $-f_0$ |
| Sine $\sin(2\pi f_0 t)$ | $\tfrac{1}{2i}[\delta(f - f_0) - \delta(f + f_0)]$ | Same spikes as the cosine, with a 90° phase difference |
| Rectangular pulse $\operatorname{rect}(t)$ (width 1) | $\operatorname{sinc}(f) = \dfrac{\sin(\pi f)}{\pi f}$ | Sharp edges spread energy over many frequencies, in ripples |
| Triangle pulse $\operatorname{tri}(t)$ | $\operatorname{sinc}^2(f)$ | Smoother edges: the ripples die away faster |
| Gaussian $e^{-\pi t^2}$ | $e^{-\pi f^2}$ | A bell curve transforms into a bell curve |
| Decaying exponential $e^{-at} u(t)$, $a > 0$ | $\dfrac{1}{a + i 2\pi f}$ | The frequency response of a simple RC [low-pass filter](/learn/signal-processing/low-pass-filter/) |
| Square wave (period $T$) | Spikes at odd multiples of $1/T$, height falling as $1/k$ | A periodic signal has a line spectrum: its Fourier series |

The rectangle and sinc pair shows that the shorter or sharper a signal is in time, the wider its spectrum, and the reverse. This is the **time–frequency uncertainty principle**, and it is why a [spectrogram](/learn/chart-types/cartesian/spectrogram/) must trade detail in time against detail in frequency.

## Fourier transform properties

These rules let you work out new transforms from known ones without integrating. Write $x(t) \leftrightarrow X(f)$ for a transform pair.

| Property | Signal | Transform | In plain words |
| --- | --- | --- | --- |
| Linearity | $a\,x(t) + b\,y(t)$ | $a\,X(f) + b\,Y(f)$ | The transform of a sum is the sum of the transforms |
| Time shift | $x(t - t_0)$ | $e^{-i 2\pi f t_0} X(f)$ | Delaying a signal changes only the phase, never the magnitude |
| Frequency shift (modulation) | $e^{i 2\pi f_0 t} x(t)$ | $X(f - f_0)$ | Multiplying by a carrier moves the spectrum up, as in AM radio |
| Time scaling | $x(at)$ | $\dfrac{1}{\lvert a \rvert} X\!\left(\dfrac{f}{a}\right)$ | Squeeze in time, stretch in frequency |
| Convolution | $(x * y)(t)$ | $X(f)\, Y(f)$ | Filtering in time is multiplication in frequency |
| Multiplication | $x(t)\, y(t)$ | $(X * Y)(f)$ | Windowing in time smears the spectrum |
| Differentiation | $\dfrac{dx}{dt}$ | $i 2\pi f\, X(f)$ | Derivatives become multiplication, turning differential equations into algebra |
| Duality | $X(t)$ | $x(-f)$ | Every pair also works the other way round |
| Parseval's theorem | $\int \lvert x(t) \rvert^2 dt$ | $\int \lvert X(f) \rvert^2 df$ | The total energy is the same in both domains |

The **convolution theorem** turns convolution in time into multiplication in frequency. [Convolution](/learn/signal-processing/convolution/) is how a filter, an echo or a blur acts on a signal, and it is slow to compute directly, so large filters are often applied by transforming, multiplying and transforming back. For the DFT, the theorem holds for circular convolution, which is why fast convolution pads the signals with zeros first.

## Fourier series vs Fourier transform vs DFT vs FFT

Four names cover closely related ideas. They differ in the kind of signal they take in and the kind of spectrum they give out.

| Tool | Input | Output | Use it when |
| --- | --- | --- | --- |
| [Fourier series](/learn/signal-processing/fourier-series/) | A periodic signal (one that repeats forever) | Separate lines at whole-number multiples of the repeat frequency (harmonics) | You are analysing or building a repeating waveform: a square wave, a musical note, a rotating machine |
| Fourier transform | Any continuous signal, repeating or not | A continuous spectrum | You are working with formulas on paper: deriving filter responses, solving equations, proving results |
| Discrete Fourier transform (DFT) | $N$ samples | $N$ frequency bins, spaced $f_s / N$ apart | You have real, sampled data: audio, sensor readings, prices. This is what a computer calculates |
| Fast Fourier transform (FFT) | Same as the DFT | Same as the DFT | Always, in practice: it is an algorithm that computes the DFT quickly. See the [FFT guide](/learn/signal-processing/fast-fourier-transform/) |

In the live demo below, the square, sawtooth and triangle presets are the first four terms of each wave's Fourier series, and the chart under them is a DFT of the summed samples, which finds each term again.

## What is the Fourier transform used for?

- Audio and music: spectrum analysers, equalisers, pitch detection and noise reduction. MP3 and AAC compression use a close relative, the modified discrete cosine transform.
- Vibration and machine monitoring: a worn bearing or an unbalanced shaft shows up as a spike at a known frequency long before it fails.
- Filtering: removing mains hum, smoothing sensor data or separating signals, either by designing a [low-pass](/learn/signal-processing/low-pass-filter/) or [high-pass filter](/learn/signal-processing/high-pass-filter/) from its frequency response or by filtering in the frequency domain directly.
- Communications: Wi-Fi and 4G/5G mobile networks use OFDM, which sends data on many closely spaced frequencies at once and is built on the FFT and inverse FFT.
- Imaging: MRI scanners record their data in the frequency domain and use an inverse Fourier transform to make the picture. JPEG compression uses a close relative, the discrete cosine transform.
- Science and spectroscopy: Fourier-transform infrared (FTIR) spectroscopy, X-ray crystallography and radio astronomy all recover their results with Fourier transforms.
- Mathematics and physics: solving the heat equation (the problem Joseph Fourier was working on), the wave equation and quantum mechanics.
- Time–frequency charts: a [spectrogram](/learn/chart-types/cartesian/spectrogram/) runs many short Fourier transforms one after another to show how frequencies change over time.

## Common Fourier transform mistakes

- **Expecting perfect spikes from real data.** A spike is only clean when the signal fits a whole number of cycles into the window. Otherwise its energy leaks into neighbouring bins. A [window function](/learn/signal-processing/window-functions/) such as Hann reduces the leakage; the [FFT guide](/learn/signal-processing/fast-fourier-transform/) shows it live.
- **Sampling too slowly.** Frequencies above half the sample rate don't vanish: they [alias](/learn/signal-processing/nyquist-and-aliasing/), folding back and appearing as false lower frequencies. Filter them out before sampling.
- **Reading the mirror half as real.** For a real signal, bins above $N/2$ mirror those below. Plot only bins $0$ to $N/2$ and double their amplitude.
- **Confusing frequency resolution with accuracy.** The bin spacing is $f_s / N$. To separate two close frequencies you need a longer recording; zero padding doesn't add detail.
- **Using one transform for a signal that changes.** A single Fourier transform averages over the whole recording, so a rising siren and a chord can look alike. Use a [spectrogram](/learn/chart-types/cartesian/spectrogram/) for signals whose frequencies change over time.

## How to compute and plot a Fourier transform in JavaScript, React or Angular

SciChart.js draws charts with WebGL and WebGPU, so a spectrum can update smoothly as new data arrives, even with thousands of frequency bins. The example below builds a signal from four sine waves and computes its DFT in the browser every time you move a control:

- choose a **Signal** preset: a square, sawtooth or triangle wave (the first four terms of each Fourier series) or a single sine wave;
- drag a wave's **Hz** or **amp.** slider to change one ingredient. A negative amplitude flips that wave upside down: a 180° phase change. The spike stays the same height, but hover over it and its phase reads +90° instead of −90°;
- add **Noise** to see the spikes stand out from a noise floor.

The top chart shows the four sine waves (orange) and their sum (blue). The bottom chart is the transform of the blue line alone, yet it finds every orange wave again. Scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={660} name="./Basic/demo" />

<LearnCta position="top" chart="frequency spectrum chart" demo="audio-analyzer-fft-example" docs="/2d-charts/chart-types/fast-impulse-renderable-series/" docsLabel="SciChart.js impulse (stem) chart documentation" />

Here is the code for this example, including a plain DFT function with no dependencies:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        FastImpulseRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme
    } from "scichart";
    // dft() and amplitudeAndPhase() are the helper functions from the JavaScript tab

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Frequency (Hz)" }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Amplitude", growBy: new NumberRange(0, 0.1) })
        );

        // Your samples, and the rate they were recorded at (samples per second)
        const { samples, sampleRate } = getYourSignal();
        const n = samples.length;
        const { amplitude } = amplitudeAndPhase(dft(samples, Math.floor(n / 2)), n);
        const frequencies = amplitude.map((_, k) => (k * sampleRate) / n);

        sciChartSurface.renderableSeries.add(
            new FastImpulseRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: frequencies, yValues: amplitude }),
                stroke: "#F48420",
                fill: "#F48420",
                strokeThickness: 3,
                size: 9,
                pointMarker: new EllipsePointMarker(wasmContext)
            })
        );
        return { sciChartSurface };
    };

    export const FrequencySpectrum = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        FastImpulseRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme
    } from "scichart";
    // dft() and amplitudeAndPhase() are the helper functions from the JavaScript tab

    @Component({
        selector: "app-frequency-spectrum",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class FrequencySpectrumComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Frequency (Hz)" }));
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, { axisTitle: "Amplitude", growBy: new NumberRange(0, 0.1) })
            );

            // Your samples, and the rate they were recorded at (samples per second)
            const { samples, sampleRate } = getYourSignal();
            const n = samples.length;
            const { amplitude } = amplitudeAndPhase(dft(samples, Math.floor(n / 2)), n);
            const frequencies = amplitude.map((_, k) => (k * sampleRate) / n);

            sciChartSurface.renderableSeries.add(
                new FastImpulseRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: frequencies, yValues: amplitude }),
                    stroke: "#F48420",
                    fill: "#F48420",
                    strokeThickness: 3,
                    size: 9,
                    pointMarker: new EllipsePointMarker(wasmContext)
                })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- `dft()` is the DFT formula written as two loops, and `amplitudeAndPhase()` scales the result to real units. For long signals (thousands of samples, or live data), swap `dft()` for an FFT, which returns the same numbers far faster: see the [FFT guide](/learn/signal-processing/fast-fourier-transform/).
- A [FastImpulseRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastimpulserenderableseries.html) draws each frequency bin as a stem, which suits a spectrum with a few strong lines. For dense spectra with thousands of bins, use a [FastLineRenderableSeries](/2d-charts/chart-types/fast-line-renderable-series/) or a mountain series instead.
- The four sine waves share one [XyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html), separated by `NaN` values that the line series draws as gaps, so they need only one legend entry.
- `clear()` and `appendRange()` replace the data each time a control moves, and `EAutoRange.Always` rescales the y axes to fit.

**See it in the demo app:** [JavaScript frequency spectrum chart](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example) · [React frequency spectrum chart](https://www.scichart.com/demo/react/audio-analyzer-fft-example) · [Angular frequency spectrum chart](https://www.scichart.com/demo/angular/audio-analyzer-fft-example)

**Go deeper:** [SciChart.js impulse (stem) chart documentation](/2d-charts/chart-types/fast-impulse-renderable-series/), and the [line series documentation](/2d-charts/chart-types/fast-line-renderable-series/) for dense spectra. In number theory, Riemann's explicit formula builds the prime-counting function from a sum of oscillations, one per zeta zero: see [the Riemann Hypothesis, visualised](/learn/applications/riemann-hypothesis/).

## Frequently asked questions

### What does a Fourier transform do?

A Fourier transform takes a signal recorded over time and works out which frequencies it contains, and how strong each one is. It turns a waveform into a spectrum: a list of sine waves, each with an amplitude and a phase, that add up to the original signal. The inverse transform turns the spectrum back into the waveform.

### What is the Fourier transform used for?

It is used wherever the frequencies in a signal matter: audio analysis, removing noise and hum, finding machine faults from vibration, radio and mobile communications, and MRI scanning. Close relatives of it compress MP3 audio and JPEG images.

### What is the difference between a Fourier series and a Fourier transform?

A Fourier series describes a periodic signal, one that repeats forever, as a sum of sine waves at whole-number multiples of its repeat frequency, so its spectrum is a set of separate lines. A Fourier transform works on any signal, repeating or not, and gives a continuous spectrum. The Fourier series is the special case of the transform for periodic signals.

### What is the difference between the DFT and the FFT?

The discrete Fourier transform (DFT) is the calculation: the Fourier transform of a finite list of samples. The fast Fourier transform (FFT) is an algorithm that computes exactly the same result much faster, in about N log N steps instead of N squared. Software almost always uses an FFT to compute a DFT.

### Is the Fourier transform reversible?

Yes. The inverse Fourier transform rebuilds the original signal from its spectrum, as long as you keep both the magnitude and the phase of every frequency. For sampled data, the inverse DFT recovers the samples exactly, apart from tiny rounding errors. If you keep only the magnitude, the signal cannot be rebuilt.

### How do I compute and plot a Fourier transform in JavaScript?

Compute the discrete Fourier transform of your samples with a short DFT or FFT function, convert each result to an amplitude (scaled by 2/N) and a frequency (bin number times sample rate divided by N), and plot them. With SciChart.js, put the frequencies and amplitudes in an `XyDataSeries` and draw them with a `FastImpulseRenderableSeries` or `FastLineRenderableSeries`. The same chart works in React with `scichart-react` and in Angular with `scichart-angular`.

## Sources

- Smith, S. W., [*The Scientist and Engineer's Guide to Digital Signal Processing*](https://www.dspguide.com/pdfbook.htm), chapters 8 to 11 (the DFT, its applications and properties, and Fourier transform pairs). A free, readable introduction.
- MIT OpenCourseWare, [6.003 Signals and Systems (Fall 2011)](https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/). The continuous Fourier transform, its properties and the convolution theorem.
- Smith, J. O., [*Mathematics of the Discrete Fourier Transform (DFT)*](https://ccrma.stanford.edu/~jos/mdft/), Stanford CCRMA. The DFT, orthogonality of sinusoids and the DFT theorems.
- Cooley, J. W. and Tukey, J. W. (1965), [An algorithm for the machine calculation of complex Fourier series](https://doi.org/10.1090/S0025-5718-1965-0178586-1). *Mathematics of Computation*, 19(90). The paper that made the FFT widely known.
- Oppenheim, A. V. and Schafer, R. W., *Discrete-Time Signal Processing*, 3rd edition, Pearson (2010). The standard textbook reference for the DFT, sampling and aliasing.
- Burnett-Thompson, A. (2007), *A 3D Local Positioning System to track A Neutrally Buoyant Flow Follower*, PhD thesis, chapter 3 ([associated published paper](https://www.semanticscholar.org/paper/A-3D-Acoustic-Local-Positioning-System-to-Track-a-Burnett-Thompson-York/13e659919f6201ceecdf458643b708d58912841c)). The real and complex DFT diagram on this page is adapted from it.

<LearnCta position="bottom" chart="frequency spectrum chart" demo="audio-analyzer-fft-example" docs="/2d-charts/chart-types/fast-impulse-renderable-series/" docsLabel="SciChart.js impulse (stem) chart documentation" />
