---
sidebar_position: 120
sidebar_label: Hilbert Transform and Envelope
title: "Hilbert Transform: Analytic Signal and Envelope Detection"
description: "What the Hilbert transform does, how the analytic signal gives a signal's envelope, instantaneous phase and frequency, and how to compute it with an FFT or an FIR filter. Live envelope detection example."
keywords:
    [
        "hilbert transform",
        "what is hilbert transform",
        "analytic signal",
        "envelope detection",
        "instantaneous amplitude",
        "instantaneous phase",
        "instantaneous frequency",
        "hilbert transform envelope",
        "discrete hilbert transform",
        "fir hilbert transformer"
    ]
image: /img/learn/hilbert-transform-og.png
related: [envelope-detector-circuit, fast-fourier-transform, iq-constellation-diagram, audio-spectrum-analyzer]
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
                    "name": "What does the Hilbert transform do?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The Hilbert transform delays every frequency in a signal by a quarter of a cycle: positive frequencies are shifted by -90 degrees and negative frequencies by +90 degrees, and no amplitude changes. A cosine becomes a sine of the same frequency. Its main use is to build the analytic signal, from which you read a signal's envelope, instantaneous phase and instantaneous frequency." }
                },
                {
                    "@type": "Question",
                    "name": "What is the Hilbert transform of sin and cos?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The Hilbert transform of cos(2 pi f t) is sin(2 pi f t), and the Hilbert transform of sin(2 pi f t) is -cos(2 pi f t), for any frequency f above zero. Applying the transform twice gives the negative of the original signal, so the inverse Hilbert transform is the transform with a minus sign." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between the Hilbert transform and the Fourier transform?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The Fourier transform changes a signal from time to frequency: it tells you which frequencies the signal contains. The Hilbert transform keeps the signal in time and only shifts the phase of each frequency by a quarter cycle. The two work together: the usual way to compute a Hilbert transform is to take an FFT, change the bins and take an inverse FFT." }
                },
                {
                    "@type": "Question",
                    "name": "How do you find the envelope of a signal?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The envelope is the slowly changing outline of a fast oscillation. In software, the most accurate way to find it is the magnitude of the analytic signal, the square root of x squared plus H(x) squared, computed with the Hilbert transform. A simpler way is to rectify the signal and low-pass filter it, which leaves some ripple and adds delay. In hardware, a diode envelope detector does the same with a diode, a capacitor and a resistor." }
                },
                {
                    "@type": "Question",
                    "name": "Does scipy.signal.hilbert or MATLAB hilbert return the Hilbert transform?",
                    "acceptedAnswer": { "@type": "Answer", "text": "No. Both scipy.signal.hilbert(x) and MATLAB hilbert(x) return the analytic signal, x + iH(x), computed with the FFT method. The Hilbert transform itself is the imaginary part (numpy.imag or MATLAB imag), and the envelope is the absolute value (numpy.abs or MATLAB abs)." }
                },
                {
                    "@type": "Question",
                    "name": "How do I compute the Hilbert transform in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Remove the mean, zero pad the samples to a power of 2 at least twice their length, and run an FFT. Double bins 1 to N/2 - 1, keep bin 0 and bin N/2 as they are, set the rest to zero, and run an inverse FFT. The result is the analytic signal: its imaginary part is the Hilbert transform and its magnitude is the envelope. With SciChart.js, draw the signal and its envelope as FastLineRenderableSeries." }
                }
            ]
        })}
    </script>
</head>

# Hilbert Transform and Envelope Detection

## What is the Hilbert transform?

The **Hilbert transform** shifts every frequency component of a signal by a quarter of a cycle (−90°) without changing its amplitude. Combined with the original, it forms the **analytic signal**: its length is the signal's envelope, and its angle gives the instantaneous phase and frequency. Envelope detection recovers that outline, for example to demodulate AM radio.

![An envelope detection example in a dark navy theme: an amplitude-modulated tone with its envelope traced by two methods, rectify and low-pass in orange running slightly late, and the Hilbert envelope in yellow on both sides of the signal, with each method's error against the true envelope in the chart below](/img/learn/hilbert-transform-og.png)

*An AM tone (blue) with its true envelope (dashed), the rectify-and-low-pass envelope (orange) and the Hilbert envelope ±|z| (yellow); below, each method's error (sample data). [Try the interactive version](#how-to-compute-the-hilbert-transform-and-envelope-in-javascript-react-or-angular), with an echo train, a chirp, noise and a cutoff slider.*

:::tip Key takeaways
- The Hilbert transform delays every frequency by a quarter cycle (−90° for positive frequencies, +90° for negative ones), so $\mathcal{H}\{\cos\} = \sin$. Its frequency response is $-i\,\mathrm{sgn}(f)$.
- The analytic signal $z = x + i\,\mathcal{H}\{x\}$ has no negative frequencies. Its magnitude $\lvert z \rvert$ is the envelope, and its angle is the instantaneous phase.
- Instantaneous frequency is how fast that phase turns: $f(t) = \frac{1}{2\pi}\frac{d\varphi}{dt}$.
- Digitally, compute it with an FFT (zero the negative bins, double the positive ones) or an FIR Hilbert transformer for real-time streams.
- In hardware, a diode envelope detector rectifies and low-pass filters; the [envelope detector circuit guide](/learn/applications/signal-processing/envelope-detector-circuit/) covers choosing its R and C.
:::

## What the Hilbert transform does: a quarter-cycle phase shift

Picture a signal as a sum of sine waves. The Hilbert transform takes each one and delays it by a quarter of its own cycle: a 10 Hz wave by 25 ms, a 1 kHz wave by 0.25 ms. Every wave keeps its frequency and its size; only its timing moves.

| Input $x(t)$ | Hilbert transform $\mathcal{H}\{x\}(t)$ | What happened |
| --- | --- | --- |
| $\cos(2\pi f t)$ | $\sin(2\pi f t)$ | A quarter cycle later |
| $\sin(2\pi f t)$ | $-\cos(2\pi f t)$ | A quarter cycle later |
| $A(t)\cos(2\pi f_c t)$, with $A(t)$ slower than $f_c$ | $A(t)\sin(2\pi f_c t)$ | The carrier shifts and the slow amplitude $A(t)$ passes through unchanged (Bedrosian's theorem, which holds when $A(t)$ has no frequencies as high as $f_c$) |
| A constant (DC) | 0 | Zero frequency has no phase to shift |
| $\mathcal{H}\{x\}$ | $-x(t)$ | Two quarter-cycle shifts make a half cycle: an inversion |

Because the amplitude never changes, the transformed signal has exactly the same spectrum magnitude and the same energy as the original (apart from any DC, which is lost). It is an **all-pass filter**, which shifts phase and leaves amplitude alone.

### The definition

Mathematically, the Hilbert transform is the convolution of the signal with $1/(\pi t)$:

$$
\mathcal{H}\{x\}(t) = \frac{1}{\pi}\, \mathrm{p.v.}\!\int_{-\infty}^{\infty} \frac{x(\tau)}{t - \tau}\, d\tau
$$

The "p.v." (Cauchy principal value) means the integral is taken symmetrically around $\tau = t$, where $1/(t-\tau)$ blows up. In the frequency domain, convolution becomes multiplication (see [convolution](/learn/applications/signal-processing/convolution/)), and the Fourier transform of $1/(\pi t)$ is

$$
\mathcal{F}\left\{\frac{1}{\pi t}\right\} = -i\,\mathrm{sgn}(f) = \begin{cases} -i & f > 0 \\ 0 & f = 0 \\ +i & f < 0 \end{cases}
$$

Multiplying by $-i$ is a rotation by −90°, and by $+i$ a rotation by +90°. So the transform turns each frequency by a quarter-turn, in opposite directions for positive and negative frequencies. It's named after David Hilbert, whose 1905 work on analytic functions introduced it; its use in signal processing began with Dennis Gabor's analytic signal in 1946.

## The analytic signal: no negative frequencies

A real signal's spectrum is symmetric: every positive frequency has a mirror image at the matching negative frequency (the reason an [FFT](/learn/applications/signal-processing/fast-fourier-transform/) shows a mirrored second half). The **analytic signal** removes that redundancy:

$$
z(t) = x(t) + i\,\mathcal{H}\{x\}(t)
$$

Its spectrum is $X(f)\,(1 + \mathrm{sgn}(f))$: doubled for positive frequencies, kept as is at 0 Hz, and zero for negative frequencies. The two mirror-image halves cancel on the negative side and add on the positive side.

![Top: three spectra of one tone at frequency f0. 1, the real signal x(t), has two lines of height A/2 at minus f0 and plus f0. 2, the Hilbert transform multiplies by minus i sgn(f): the line at plus f0 turns by minus 90 degrees and the line at minus f0 by plus 90 degrees, both keeping height A/2. 3, the analytic signal z = x + iH(x) has a single line of height A at plus f0 and zero at minus f0. Bottom: z(t) as an arrow in the complex plane, with real part x(t), imaginary part H(x)(t), length A(t) (the envelope) and angle phi(t) (the instantaneous phase), beside the formulas A = sqrt(x squared + H(x) squared), phi = atan2(H(x), x), f = (1 / 2 pi) d phi / dt and x = A cos phi](./analytic-signal-spectrum.svg)

A signal with only positive frequencies can be drawn as a single arrow spinning one way around the complex plane. For a tone, $x = A\cos(2\pi f t)$ gives $z = A e^{\,i 2\pi f t}$: an arrow of fixed length $A$ turning $f$ times a second. The real signal is that arrow's shadow on the real axis. For a modulated signal, the arrow's length and speed change slowly, and they are exactly the envelope and the instantaneous frequency.

## Instantaneous amplitude, phase and frequency

Write the analytic signal in polar form, $z(t) = A(t)\,e^{\,i\varphi(t)}$. Then:

| Quantity | Formula | What it means |
| --- | --- | --- |
| Instantaneous amplitude (the envelope) | $A(t) = \lvert z(t) \rvert = \sqrt{x^2 + \mathcal{H}\{x\}^2}$ | The size of the oscillation at each moment |
| Instantaneous phase | $\varphi(t) = \arg z(t) = \operatorname{atan2}(\mathcal{H}\{x\},\, x)$ | Where in its cycle the signal is |
| Instantaneous frequency | $f(t) = \dfrac{1}{2\pi}\dfrac{d\varphi}{dt}$ | How fast it is cycling right now, in Hz |

Instantaneous frequency only means something for a narrowband signal, one with a single dominant oscillation at a time, such as a tone, a chirp or a modulated carrier. Add two tones of similar size and the arrow traces loops; its speed then wobbles and can even go negative, which no one would call "the frequency". For multi-component signals, split them first, for example with a [band-pass filter](/learn/applications/signal-processing/band-pass-filter/) or a [spectrogram](/learn/chart-types/cartesian/spectrogram/).

### Why does the Hilbert envelope have no ripple?

For a steady tone, $x = A\cos\theta$ and $\mathcal{H}\{x\} = A\sin\theta$, so $x^2 + \mathcal{H}\{x\}^2 = A^2(\cos^2\theta + \sin^2\theta) = A^2$ at every instant. Squaring and adding a signal and its quarter-cycle-shifted copy cancels the carrier completely. A rectifier, by contrast, gives $\lvert \cos\theta \rvert$, which still bounces twice per cycle and has to be smoothed.

### Worked examples: an AM tone and an 8-point FFT

For an AM tone, take a 200 Hz carrier whose amplitude follows a 3 Hz message at 80% depth: $x(t) = (1 + 0.8\cos 2\pi 3t)\cos 2\pi 200t$. The message is far slower than the carrier, so Bedrosian's theorem applies and $\mathcal{H}\{x\} = (1 + 0.8\cos 2\pi 3t)\sin 2\pi 200t$. Then $\lvert z \rvert = 1 + 0.8\cos 2\pi 3t$ exactly: the envelope peaks at 1.8 at $t = 0$ and falls to 0.2 at $t = 1/6$ s. The phase is $2\pi \cdot 200t$, so the instantaneous frequency is a constant 200 Hz.

For an 8-point FFT, sample one cycle of a cosine 8 times, $x_n = \cos(2\pi n/8)$. Its FFT has $X_1 = 4$ and $X_7 = 4$ (the mirror image), and zeros elsewhere. Double bin 1 and zero bin 7: $Z_1 = 8$, everything else 0. The inverse FFT gives $z_n = \tfrac{1}{8} \cdot 8\, e^{\,2\pi i n/8} = \cos(2\pi n/8) + i\sin(2\pi n/8)$: the real part is the cosine, the imaginary part is the sine ($\mathcal{H}\{\cos\} = \sin$), and $\lvert z_n \rvert = 1$ at every sample.

## How to compute the Hilbert transform digitally

There are two standard ways: one for a recorded block of samples, and one for a live stream.

### The FFT method (for a block of samples)

Steps 3 to 5 are what `scipy.signal.hilbert` and MATLAB's `hilbert` do (Marple, 1999); steps 1 and 2 are preparation you do yourself first, since neither function removes the mean or pads unless you ask it to:

1. Remove the mean (the DC offset). A constant offset adds to $x$ but not to $\mathcal{H}\{x\}$, so it makes the envelope wobble at the carrier frequency.
2. Zero pad to a power of 2, at least twice the length, if you use a radix-2 FFT. The FFT treats the block as repeating; padding stops the end of the block wrapping onto its start.
3. FFT the $N$ samples to get bins $X_0 \ldots X_{N-1}$.
4. Build the analytic spectrum. For an even number of samples $N$ (as after step 2), keep $X_0$ (DC) and $X_{N/2}$ (Nyquist) once, double bins $1$ to $N/2 - 1$ (the positive frequencies), and set to zero bins $N/2 + 1$ to $N - 1$ (the negative frequencies).
5. Inverse FFT. The result is the analytic signal $z_n$: its real part is your signal again, its imaginary part is the Hilbert transform, and $\lvert z_n \rvert$ is the envelope.

While you are in the frequency domain, you can also zero the bins outside the band you care about, which band-pass filters the signal at no extra cost and keeps broadband noise out of the envelope.

### The FIR Hilbert transformer (for a stream)

For real-time processing, a **finite impulse response (FIR) filter** approximates the transform sample by sample (see [FIR vs IIR filters](/learn/applications/signal-processing/fir-vs-iir-filters/)). The ideal discrete Hilbert transformer's impulse response is

$$
h[n] = \begin{cases} \dfrac{2}{\pi n} & n \text{ odd} \\[4pt] 0 & n \text{ even} \end{cases}
$$

so $h[\pm 1] = \pm 0.637$, $h[\pm 3] = \pm 0.212$, $h[\pm 5] = \pm 0.127$ and so on. It goes on forever, so practical filters keep $M$ taps either side of the centre and taper them with a window such as Hamming. A practical FIR Hilbert transformer:

- Has odd length and is antisymmetric, $h[-n] = -h[n]$, which is what makes the phase shift exactly 90° at every frequency.
- Has every other tap zero. A 31-tap filter has only 16 non-zero taps, in ± pairs, so it needs just 8 multiplications per output sample.
- Can't work near 0 Hz or the Nyquist frequency. An odd-length antisymmetric filter always has zero gain at both. For example, a 31-tap Hamming-windowed design, computed from its coefficients, has a gain within 0.1 dB of 1 from $0.054\,f_s$ to $0.446\,f_s$ and within 1 dB from $0.038\,f_s$. Longer filters widen the band: 63 taps hold 0.1 dB from $0.026\,f_s$.
- Delays the output by $M$ samples (15 for 31 taps), so delay the original signal by the same amount before pairing it with the Hilbert output, or the envelope ripples.

| | FFT method | FIR Hilbert transformer |
| --- | --- | --- |
| Works on | A whole block, after it's recorded | A stream, one sample at a time |
| Accuracy | Exact inside the block, with errors near its ends | A small ripple across the band; useless near 0 Hz and $f_s/2$ |
| Delay | None (it sees the whole block) | $M$ samples, constant |
| Cost | About $N \log_2 N$ per block | A few multiplications per sample |
| Typical use | Offline analysis, Python and MATLAB | Radios, single-sideband and I/Q processing, real-time audio |

### Edge effects: why you window or pad

The FFT method assumes the block repeats forever, and the convolution kernel $1/(\pi t)$ dies away only slowly. So samples near the start and end of the block are computed from a signal that suddenly stops. Measured with the demo on this page (the AM tone, no noise, no band-pass), the envelope is off by more than 10% of the carrier amplitude for the first 3 ms and by more than 1% for about the first 50 ms (ten carrier cycles), while the middle is accurate to a few tenths of a percent.

- Zero pad to at least twice the length, so the end doesn't wrap around onto the start.
- Taper the ends with a short [window](/learn/applications/signal-processing/window-functions/), or record a little extra either side and throw it away.
- Ignore the edges when you measure, for example the first and last 10% of the block.
- An FIR transformer has the same problem for its first $2M$ samples, while its delay line fills.

## Envelope detection methods compared

An **envelope detector**, in hardware or software, recovers the slowly varying outline of a fast oscillation. All four common methods agree on a clean, steady tone; they differ in ripple, delay and cost.

![Envelope detection two ways. Top row, the classic method: a raw waveform of three fading bursts is rectified, which flips every negative half-cycle positive, then low-pass filtered, giving a smooth envelope that runs late compared with the true envelope (dashed). Bottom row: the same waveform goes through a Hilbert transform and then a magnitude, the square root of x squared plus H(x) squared, giving the envelope directly with no carrier ripple and no delay, drawn above and below the waveform; an optional gentle low-pass filter can follow for noise. Adapted from Burnett-Thompson (2007)](./envelope-detection-two-ways.svg)

*Adapted from [Burnett-Thompson (2007)](#sources).*

| Method | How it works | Carrier ripple | Delay | Best for |
| --- | --- | --- | --- | --- |
| Rectify + low-pass | Take $\lvert x \rvert$, then a [low-pass filter](/learn/applications/signal-processing/low-pass-filter/); scale by $\pi/2$ to read the peak (the average of $\lvert\sin\rvert$ is $2/\pi$) | At twice the carrier, reduced by the filter | The filter's delay: about 11 ms for a 2nd-order 20 Hz Butterworth | [Diode envelope detectors](/learn/applications/signal-processing/envelope-detector-circuit/) in AM radios, EMG "linear envelope", simple embedded code |
| Square-law + low-pass + square root | Square $x$, low-pass, then $\sqrt{2 \times}$ the result | At twice the carrier, reduced by the filter | The filter's delay | RF power detectors (a diode at low level is square-law), RMS meters |
| Hilbert magnitude | $\sqrt{x^2 + \mathcal{H}\{x\}^2}$ | None for a narrowband signal | None offline; $M$ samples with an FIR | Vibration envelope spectra, ultrasound, instantaneous frequency, accurate timing |
| Peak-hold (attack and release) | Jump up to each new peak quickly, decay slowly between them | A sawtooth set by the release time | Set by the attack time | Audio compressors, gates and level meters |

### Why does the Hilbert method need less filtering?

A full-wave rectifier gives two bumps per carrier cycle, so the filter after it must remove a strong ripple at twice the carrier frequency. Adding the rectified signal to its rectified quarter-cycle-shifted copy (quadrature rectification) already gives four smaller bumps per cycle that fill in each other's gaps. Squaring and adding instead, $\sqrt{x^2 + \mathcal{H}\{x\}^2}$, leaves no bumps at all for a steady tone. Any filter afterwards only has to deal with noise, so it can be much gentler, and gentler means less delay.

In the [live example](#how-to-compute-the-hilbert-transform-and-envelope-in-javascript-react-or-angular), with the AM tone at a 20 Hz cutoff, the readout shows the rectify-and-low-pass envelope about 11 ms late; slide the cutoff down to 5 Hz and the delay grows to about 49 ms while the envelope's dips get shallower. The Hilbert envelope stays on time. Then pick the **echo train** and see how a low cutoff smears and delays each echo, which in a ranging system is a distance error.

## The diode envelope detector circuit

The simplest hardware envelope detector, used in most AM radios, is a diode followed by a capacitor and a resistor in parallel. The diode charges the capacitor to each carrier peak, and the resistor lets it discharge slowly between peaks, so the capacitor voltage follows the envelope. Its time constant $RC$ must be long compared with a carrier cycle, or the output ripples, and short compared with the message, or the output cuts across the troughs (diagonal clipping). The [envelope detector circuit guide](/learn/applications/signal-processing/envelope-detector-circuit/) covers choosing R and C, the diode drop and precision detectors, with a circuit simulator. In software, the same circuit is a rectifier followed by a single-pole [low-pass filter](/learn/applications/signal-processing/low-pass-filter/), or a peak-hold with exponential release.

## Hilbert transform vs Fourier transform, quadrature demodulation and other tools

Use the Hilbert transform for the envelope or phase of a narrowband signal, and the tools below for the other questions people bring to it.

| If you need… | Use | Why |
| --- | --- | --- |
| Which frequencies a signal contains | [Fourier transform](/learn/applications/signal-processing/fourier-transform/) or [FFT](/learn/applications/signal-processing/fast-fourier-transform/) | It moves to the frequency domain; the Hilbert transform stays in time |
| The envelope or instantaneous phase of a recorded narrowband signal | Hilbert transform (FFT method) | No ripple, no delay, and it gives the phase as well |
| The envelope of a live signal in hardware | [Diode envelope detector](/learn/applications/signal-processing/envelope-detector-circuit/), or rectify + low-pass in code | Cheap and simple, if some delay and ripple are acceptable |
| The amplitude and phase at one known frequency, buried in noise | Quadrature (I/Q) demodulation, as in a lock-in amplifier | Multiplies by a reference sine and cosine, then low-pass filters both; very narrow bandwidth rejects noise |
| How several frequencies change over time | [Spectrogram](/learn/chart-types/cartesian/spectrogram/) | Instantaneous frequency only works for one component at a time |
| How similar a signal is to a delayed copy of itself | [Autocorrelation](/learn/applications/signal-processing/autocorrelation/) | Correlating envelopes, rather than raw signals, gives a cleaner time-delay peak for echoes |

## What the Hilbert transform and envelope detection are used for

They are used wherever information rides on the amplitude or frequency of a carrier rather than on the carrier itself.

- AM demodulation: the envelope of an AM broadcast is the audio. A [diode envelope detector](/learn/applications/signal-processing/envelope-detector-circuit/) does it in hardware; a software radio takes $\lvert z \rvert$.
- Single-sideband (SSB) modulation: mixing a signal and its Hilbert transform with a cosine and a sine carrier cancels one sideband, halving the bandwidth used.
- Vibration and bearing fault analysis: a cracked bearing race produces a burst of high-frequency ringing every time a ball passes the crack. Band-pass around the ringing, take the envelope, then an [FFT](/learn/applications/signal-processing/fast-fourier-transform/) of the envelope: the **envelope spectrum** shows peaks at the ball-pass rate, which identifies the faulty part (Randall and Antoni, 2011).
- Ultrasound imaging and echo ranging: each ultrasound echo is a short burst of a few megahertz. B-mode scanners take its envelope, then compress it to a log scale, to make the grey-level image; sonar and radar time echoes from their envelopes.
- EMG and EEG amplitude: muscle activity is read from the rectified, smoothed EMG (its "linear envelope"); the amplitude of a brain rhythm, such as the alpha band, from the Hilbert envelope of the band-passed EEG.
- Audio: compressors, limiters, noise gates and level meters all follow the envelope, usually with separate attack and release times.
- Instantaneous frequency of chirps: radar, sonar and bat calls sweep their frequency; the derivative of the analytic signal's phase shows the sweep sample by sample, with no FFT block to blur it.

## Common Hilbert transform and envelope detection mistakes

Most mistakes come from using the transform on a signal that isn't narrowband, or from trusting the ends of the block.

- **Applying it to a broadband signal and expecting a meaningful envelope.** The envelope and instantaneous frequency only make sense for a narrowband signal. Band-pass filter around the component you want first.
- **Forgetting that the analytic signal is complex.** `scipy.signal.hilbert` and MATLAB `hilbert` return $z = x + i\,\mathcal{H}\{x\}$, not $\mathcal{H}\{x\}$. Take the imaginary part for the transform and the magnitude for the envelope.
- **A low-pass cutoff that's too low** after rectifying. It removes ripple, but also delays and flattens the envelope; in a ranging system that delay is a distance error.
- **Differentiating a noisy phase.** Instantaneous frequency amplifies noise, especially where the envelope is small. Band-pass first, and smooth the frequency, not the phase.

## How to compute the Hilbert transform and envelope in JavaScript, React or Angular

The demo takes the analytic signal of 4,096 samples (about 1 second at 4,000 samples per second) with a zero-padded FFT, and recomputes both envelopes each time you change a control. In the example below, the top chart shows a signal (blue), its true envelope (dashed white), the rectify-and-low-pass envelope (orange) and the Hilbert envelope $\pm\lvert z \rvert$ (yellow). The bottom chart shows each envelope's error against the truth, or, for the chirp, the instantaneous frequency from the analytic signal's phase.

Choose the **signal** (an AM tone, an echo train like ultrasound or sonar, or a linear chirp), the **modulation depth** of the AM tone and the **noise** level. **Method** shows either envelope or both, **Low-pass cutoff** sets the filter after the rectifier, and **Band-pass before Hilbert** removes noise outside the carrier band, using the same cutoff. The readout gives each method's delay and its remaining ripple and noise. Zoom in on the first few milliseconds to see the edge error; drag to pan, double-click to reset, and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="signal envelope chart" demo="audio-analyzer-fft-example" demoLabel="audio spectrum analyzer chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for this example. The FFT, the analytic signal and both envelope methods are plain JavaScript; the charts are ordinary SciChart.js line series.

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
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";
    // fft and analyticSignal: copy them from the JavaScript tab
    import { analyticSignal } from "./hilbert";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Signal" }));

        const { xValues, yValues, sampleRate } = getYourSignalData(); // evenly spaced samples
        const z = analyticSignal(yValues, sampleRate, null); // z.re = signal, z.im = Hilbert transform
        const envelope = Array.from(z.re, (re, i) => Math.hypot(re, z.im[i]));

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Signal" }),
                stroke: "#50C7E0",
                strokeThickness: 1
            }),
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: envelope, dataSeriesName: "Envelope" }),
                stroke: "#F5E663",
                strokeThickness: 2
            })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new LegendModifier(),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const EnvelopeChart = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";
    // fft and analyticSignal: copy them from the JavaScript tab
    import { analyticSignal } from "./hilbert";

    @Component({
        selector: "app-envelope-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class EnvelopeChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Signal" }));

            const { xValues, yValues, sampleRate } = getYourSignalData(); // evenly spaced samples
            const z = analyticSignal(yValues, sampleRate, null); // z.re = signal, z.im = Hilbert transform
            const envelope = Array.from(z.re, (re, i) => Math.hypot(re, z.im[i]));

            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Signal" }),
                    stroke: "#50C7E0",
                    strokeThickness: 1
                }),
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: envelope, dataSeriesName: "Envelope" }),
                    stroke: "#F5E663",
                    strokeThickness: 2
                })
            );
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true }),
                new LegendModifier(),
                new MouseWheelZoomModifier(),
                new ZoomPanModifier(),
                new ZoomExtentsModifier()
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- Each envelope is an ordinary line chart: an `XyDataSeries` of times and values, drawn by a `FastLineRenderableSeries`. The lower envelope $-\lvert z \rvert$ is a second series with the values negated.
- To update the charts when a control moves, the example keeps every data series and calls `clear()` then `appendRange()` with the new values; SciChart.js redraws on the next frame. Setting `isVisible` on a series hides it without removing its data.
- The Hilbert transform is the `analyticSignal()` function: an FFT, a change to the bins and an inverse FFT, about 40 lines of plain JavaScript. Swap in any FFT library; the chart code stays the same.
- The rectify-and-low-pass envelope runs its filter forwards in time, like a circuit, so its delay is real. Offline, you could run the filter forwards and then backwards to cancel the delay, but not the ripple-versus-bandwidth trade-off.

**See it in the demo app:** [JavaScript audio spectrum analyzer chart](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example) · [React audio spectrum analyzer chart](https://www.scichart.com/demo/react/audio-analyzer-fft-example) · [Angular audio spectrum analyzer chart](https://www.scichart.com/demo/angular/audio-analyzer-fft-example), which draws live microphone audio and its FFT; it doesn't compute an envelope.

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), and the [FFT guide](/learn/applications/signal-processing/fast-fourier-transform/) for the FFT behind the Hilbert transform. Ultrasonic flaw detectors show the envelope of each echo: see [non-destructive testing](/learn/applications/non-destructive-testing/).

## Frequently asked questions

### What does the Hilbert transform do?

The Hilbert transform delays every frequency in a signal by a quarter of a cycle: positive frequencies are shifted by -90 degrees and negative frequencies by +90 degrees, and no amplitude changes. A cosine becomes a sine of the same frequency. Its main use is to build the analytic signal, from which you read a signal's envelope, instantaneous phase and instantaneous frequency.

### What is the Hilbert transform of sin and cos?

The Hilbert transform of cos(2 pi f t) is sin(2 pi f t), and the Hilbert transform of sin(2 pi f t) is -cos(2 pi f t), for any frequency f above zero. Applying the transform twice gives the negative of the original signal, so the inverse Hilbert transform is the transform with a minus sign.

### What is the difference between the Hilbert transform and the Fourier transform?

The Fourier transform changes a signal from time to frequency: it tells you which frequencies the signal contains. The Hilbert transform keeps the signal in time and only shifts the phase of each frequency by a quarter cycle. The two work together: the usual way to compute a Hilbert transform is to take an FFT, change the bins and take an inverse FFT.

### How do you find the envelope of a signal?

The envelope is the slowly changing outline of a fast oscillation. In software, the most accurate way to find it is the magnitude of the analytic signal, the square root of x squared plus H(x) squared, computed with the Hilbert transform. A simpler way is to rectify the signal and low-pass filter it, which leaves some ripple and adds delay. In hardware, a diode envelope detector does the same with a diode, a capacitor and a resistor.

### Does scipy.signal.hilbert or MATLAB hilbert return the Hilbert transform?

No. Both `scipy.signal.hilbert(x)` and MATLAB `hilbert(x)` return the analytic signal, x + iH(x), computed with the FFT method. The Hilbert transform itself is the imaginary part (`numpy.imag` or MATLAB `imag`), and the envelope is the absolute value (`numpy.abs` or MATLAB `abs`).

### How do I compute the Hilbert transform in JavaScript?

Remove the mean, zero pad the samples to a power of 2 at least twice their length, and run an FFT. Double bins 1 to N/2 - 1, keep bin 0 and bin N/2 as they are, set the rest to zero, and run an inverse FFT. The result is the analytic signal: its imaginary part is the Hilbert transform and its magnitude is the envelope. With SciChart.js, draw the signal and its envelope as `FastLineRenderableSeries`.

## Sources

- Gabor, D. (1946), [Theory of communication. Part 1: The analysis of information](https://doi.org/10.1049/ji-3-2.1946.0074). *Journal of the Institution of Electrical Engineers, Part III*, 93(26), 429–441. The analytic signal.
- Bedrosian, E. (1963), [A product theorem for Hilbert transforms](https://doi.org/10.1109/PROC.1963.2308). *Proceedings of the IEEE*, 51(5), 868–869. When the Hilbert transform of $A(t)\cos(2\pi f_c t)$ is $A(t)\sin(2\pi f_c t)$.
- Marple, S. L. (1999), [Computing the discrete-time "analytic" signal via FFT](https://doi.org/10.1109/78.782222). *IEEE Transactions on Signal Processing*, 47(9), 2600–2603. The FFT method, including the DC and Nyquist bins.
- Oppenheim, A. V. and Schafer, R. W. (2010), *Discrete-Time Signal Processing*, 3rd edition, Pearson, chapter 12, Discrete Hilbert Transforms. The ideal discrete Hilbert transformer and FIR approximations.
- Lyons, R. G. (2010), *Understanding Digital Signal Processing*, 3rd edition, Prentice Hall, chapter 9, The Discrete Hilbert Transform. FIR Hilbert transformers and their delay.
- Smith, J. O., [Spectral Audio Signal Processing](https://ccrma.stanford.edu/~jos/sasp/), Center for Computer Research in Music and Acoustics (CCRMA), Stanford University. Analytic signals and Hilbert transform filters.
- Haykin, S. and Moher, M. (2009), *Communication Systems*, 5th edition, Wiley. Amplitude modulation and the envelope detector, including the diagonal-clipping limit.
- Randall, R. B. and Antoni, J. (2011), [Rolling element bearing diagnostics: a tutorial](https://doi.org/10.1016/j.ymssp.2010.07.017). *Mechanical Systems and Signal Processing*, 25(2), 485–520. Envelope analysis of bearing faults.
- SciPy developers, [scipy.signal.hilbert](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.hilbert.html), SciPy documentation. Returns the analytic signal.
- Burnett-Thompson, A. (2007), *A 3D Local Positioning System to track A Neutrally Buoyant Flow Follower*, PhD thesis, University of Manchester, UK, chapter 3. The associated published paper is Burnett-Thompson, A. and York, T. (2007), [*A 3D Acoustic Local Positioning System to Track a Neutrally Buoyant Flow Follower*](https://doi.org/10.1109/IMTC.2007.379071), IEEE Instrumentation and Measurement Technology Conference (IMTC 2007). The envelope detection diagram (rectify and low-pass, and the Hilbert method that needs a gentler filter) is adapted from it.

<LearnCta position="bottom" chart="signal envelope chart" demo="audio-analyzer-fft-example" demoLabel="audio spectrum analyzer chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
