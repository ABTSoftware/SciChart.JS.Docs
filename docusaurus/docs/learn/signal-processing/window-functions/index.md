---
sidebar_position: 180
sidebar_label: Window Functions
title: "Window Functions: Hann, Hamming, Blackman and Spectral Leakage"
description: "What a window function is and why the FFT needs one: spectral leakage, main and side lobes, Hann vs Hamming, Blackman, flat top, measured figures and which window to choose. Live demo."
keywords:
    [
        "window function",
        "window function signal processing",
        "what is a window function",
        "spectral leakage",
        "fft windowing",
        "fft window",
        "hann window",
        "hanning window",
        "hamming window",
        "blackman window",
        "blackman harris window",
        "flat top window",
        "hann vs hamming window",
        "hanning vs hamming window",
        "hamming window main lobe width",
        "hamming window side lobe level",
        "equivalent noise bandwidth",
        "scalloping loss"
    ]
image: /img/learn/window-functions-og.png
related: [fast-fourier-transform, power-spectral-density, fir-vs-iir-filters, fourier-series]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is a window function in signal processing?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A window function is a set of weights, one per sample, that you multiply a block of samples by before an FFT or when designing an FIR filter. It is largest in the middle and tapers towards the ends, so the block has no sudden jump where it starts and stops. That reduces spectral leakage: energy from one frequency spreading into many others." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a Hann and a Hamming window?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both are raised cosines. Hann is 0.5 - 0.5 cos(2 pi n / N) and falls to zero at the ends; Hamming is 0.54 - 0.46 cos(2 pi n / N) and stops at 0.08. Hamming's highest side lobe is lower, about -43 dB against Hann's -31.5 dB, but its side lobes stay near that level, while Hann's fall by 18 dB per octave. Use Hamming when interference is close to the tone, and Hann when it is far away or for noise." }
                },
                {
                    "@type": "Question",
                    "name": "Why does a window function reduce spectral leakage?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The FFT treats a block of samples as if it repeated forever. Unless a tone fits a whole number of cycles in the block, the repeat has a jump at the join, and a jump contains energy at every frequency. A window brings both ends of the block smoothly to (or near) zero, so the jump disappears and much less energy leaks into distant bins. The cost is a wider peak." }
                },
                {
                    "@type": "Question",
                    "name": "Which window function is best for an FFT?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Hann is the usual default for general analysis, noise and power spectral density. Use Blackman or Blackman-Harris to find a weak tone next to a strong one, a flat-top window to measure a tone's amplitude accurately, and no window (rectangular) for transients that start and end inside the block or tones that fit it exactly." }
                },
                {
                    "@type": "Question",
                    "name": "What is the main lobe width and side lobe level of a Hamming window?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A Hamming window's main lobe is 4 bins wide between its first nulls, which is 8 pi / N radians per sample, twice the width of no window. It is 1.30 bins wide at -3 dB and 1.82 bins at -6 dB. The first side lobe is almost cancelled (-44 dB), so the highest is a later one, at -42.7 dB, usually quoted as -43 dB. In FIR filter design it gives a stopband attenuation of about 53 dB." }
                },
                {
                    "@type": "Question",
                    "name": "How do I apply a window function in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Build an array of weights, for example w[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N) for Hann, multiply each sample by its weight, run the FFT, and divide each magnitude by the sum of the weights (doubling all but the first and last bins) to read amplitudes. To plot the spectrum with SciChart.js, put the frequencies and levels in an XyDataSeries and draw them with a FastLineRenderableSeries." }
                }
            ]
        })}
    </script>
</head>

# Window Functions in Signal Processing

## What is a window function?

A **window function** (also called a tapering function or apodization function) is a set of weights that you multiply a block of samples by before taking its [FFT](/learn/signal-processing/fast-fourier-transform/). It is largest in the middle and falls towards the ends, so the block starts and stops smoothly. This reduces **spectral leakage**, the smearing of one frequency across many FFT bins.

![A spectral leakage explorer in a dark navy theme: a sine wave record with a Hann window and the windowed signal at the top left, the Hann window's own frequency response with its main lobe and side lobes at the top right, and the spectrum in decibels at the bottom with a strong tone, its leakage skirt and a weak tone 60 dB lower](/img/learn/window-functions-og.png)

*A strong tone that falls between FFT bins, a Hann window (top left), the window's own response (top right) and the spectrum in decibels with a weak tone 60 dB down (bottom), sample data. [Try the interactive version](#how-to-apply-a-window-function-in-javascript-react-or-angular), where you can switch windows, move the tone and the weak tone, and see the leakage change.*

:::tip Key takeaways
- The FFT assumes the record repeats. A tone that doesn't fit a whole number of cycles leaves a jump at the join, and that jump leaks energy into every bin.
- A window trades a wider main lobe (less resolution) for lower side lobes (less leakage). No window wins on both.
- Hann is the everyday default. Hamming has a lower first side lobe; Hann's side lobes fall away faster. Blackman and Blackman–Harris find weak tones; flat top measures amplitude.
- Windowing lowers every level: divide by the window's sum (its coherent gain) for tones, and use its equivalent noise bandwidth (ENBW) for noise and PSD.
- Zero padding doesn't fix leakage. It only draws the same leaky spectrum at more points.
:::

## What is spectral leakage?

The discrete Fourier transform, and the FFT that computes it, works on a block of $N$ samples, and it behaves as if that block were one period of a signal that repeats forever. Each bin is a sine wave that fits exactly $k$ whole cycles into the block.

- If a tone completes a whole number of cycles in the block, the copies join seamlessly, the tone matches one bin exactly, and every other bin reads zero.
- If it doesn't, say 4.5 cycles, the repeated signal has a jump at every join. A jump is a sharp edge, and a sharp edge contains energy at every frequency. So the tone's energy spreads into its neighbours and, more weakly, into bins far away.

That spreading is **spectral leakage**. It comes from cutting a finite record out of a longer one.

![Two rows. Top: a record holding exactly 4 cycles, repeated end to end with smooth joins, and its spectrum, a single line at bin 4. Bottom: a record holding 4.5 cycles, repeated with a jump at every join, and its spectrum, which spreads into every bin and is still about -27 dB ten bins away; a dashed Hann-window spectrum is wider at the peak but falls below -60 dB about six bins away](./spectral-leakage-repeated-record.svg)

In real measurements a tone almost never fits the record exactly, because the record length is set by the FFT size, not by the signal. So leakage is the normal case, and it causes three problems:

- Hidden weak tones. The skirt of a strong peak can be higher than a small peak near it.
- Wrong peak heights. A tone halfway between two bins reads 3.92 dB low with no window. This is **scalloping loss**, named after the scalloped shape of the error as a tone moves between bins.
- A raised floor. Leakage from a large component, including a DC offset, lifts the apparent noise floor across the spectrum.

## How a window function works

Before the FFT, each sample $x[n]$ is multiplied by a weight $w[n]$. The weights are near 1 in the middle of the block and close to 0 at the ends, so the ends of the block, and the jump between copies, are squeezed down to almost nothing.

Multiplying two signals sample by sample convolves their spectra (the [convolution theorem](/learn/signal-processing/convolution/)). So the spectrum you see is the true spectrum smeared by the window's own spectrum $W(f)$:

$$
x[n]\,w[n] \;\longleftrightarrow\; \frac{1}{N}\, X(f) \circledast W(f)
$$

A pure tone's true spectrum is a single spike, so after windowing every tone shows up as a copy of $W(f)$ centred on the tone's frequency. The FFT bins then sample that copy at whole-bin spacing. Everything about leakage follows from the shape of $W(f)$. Cutting out a block is itself a **rectangular window**, with every weight equal to 1.

![The spectrum of a Hann window and of a rectangular window for a single tone, in dB from 10 bins below to 10 bins above it. The Hann main lobe has nulls at plus and minus 2 bins, a -3 dB width of 1.44 bins, a -6 dB width of 2.00 bins and a level of -1.42 dB half a bin from the centre. Its highest side lobe is -31.5 dB and its side lobes fall by 18 dB per octave. The rectangular window's main lobe is half as wide, but its side lobes start at -13.3 dB and fall slowly](./window-main-lobe-side-lobes.svg)

A window's spectrum has two parts:

- **The main lobe**, the central peak. Its width decides resolution: two tones closer than about one main-lobe width merge into one peak. A tone that falls between bins is sampled partway down the main lobe, which is where scalloping loss comes from.
- **The side lobes**, the ripples either side. Their height decides leakage: a tone's side lobes land in other bins and can hide weaker tones there.

Tapering the ends harder lowers the side lobes but widens the main lobe. A window that is smooth at its ends also makes its side lobes fall away faster with distance: one with a jump in value (rectangular, Hamming) gives side lobes that fall by 6 dB per octave, and one that reaches zero smoothly (Hann, Blackman) gives 18 dB per octave.

Because Hann is a single cosine, windowing in time is the same as a three-point convolution of the unwindowed FFT: $X_{\text{Hann}}[k] = \tfrac{1}{2}X[k] - \tfrac{1}{4}X[k-1] - \tfrac{1}{4}X[k+1]$. You can apply a Hann window after the FFT, which is useful when you need both spectra.

### The figures that describe a window

| Figure | What it means | Why it matters |
| --- | --- | --- |
| Highest side lobe | The tallest ripple outside the main lobe, in dB below the peak | How far below a strong tone a weak one can be and still be seen near it |
| Side-lobe roll-off | How quickly the side lobes fall with distance, in dB per octave | Whether leakage is still a problem far from a strong tone |
| −3 dB and −6 dB width | The main lobe's width, in bins, at those levels below its peak | Resolution: two equal tones separate when they are further apart than about the −6 dB width |
| Coherent gain | The window's average value, $\frac{1}{N}\sum w[n]$ | How much the window lowers a tone's peak; divide by it to correct amplitudes |
| Equivalent noise bandwidth (ENBW) | $N \sum w[n]^2 \big/ \left(\sum w[n]\right)^2$, in bins | How many bins wide each bin is for noise; it raises the noise floor by $10\log_{10}(\text{ENBW})$ dB |
| Scalloping loss | How far a tone exactly halfway between bins reads below its true level | The worst-case amplitude error from where a tone falls |

## Window function formulas

The common windows are all **cosine sums**. For $n = 0, 1, \ldots, N-1$:

$$
w[n] = a_0 - a_1 \cos\!\left(\frac{2\pi n}{N}\right) + a_2 \cos\!\left(\frac{4\pi n}{N}\right) - a_3 \cos\!\left(\frac{6\pi n}{N}\right) + a_4 \cos\!\left(\frac{8\pi n}{N}\right)
$$

| Window | $a_0$ | $a_1$ | $a_2$ | $a_3$ | $a_4$ |
| --- | --- | --- | --- | --- | --- |
| Rectangular (no window) | 1 | | | | |
| Hann | 0.5 | 0.5 | | | |
| Hamming | 0.54 | 0.46 | | | |
| Blackman | 0.42 | 0.5 | 0.08 | | |
| Blackman–Harris (4-term) | 0.35875 | 0.48829 | 0.14128 | 0.01168 | |
| Flat top (5-term) | 0.21557895 | 0.41663158 | 0.277263158 | 0.083578947 | 0.006947368 |

Written out, the three classics are:

$$
w_{\text{Hann}}[n] = 0.5 - 0.5\cos\frac{2\pi n}{N} = \sin^2\frac{\pi n}{N}, \qquad
w_{\text{Hamming}}[n] = 0.54 - 0.46\cos\frac{2\pi n}{N}
$$

$$
w_{\text{Blackman}}[n] = 0.42 - 0.5\cos\frac{2\pi n}{N} + 0.08\cos\frac{4\pi n}{N}
$$

A few notes on the names:

- Hann takes its name from Julius von Hann, an Austrian meteorologist. Many people call it the Hanning window, because Blackman and Tukey used "hanning" as a verb for applying it; both names mean the same window.
- Hamming is named after Richard Hamming. Its coefficients are chosen to cancel the first side lobe: the exact value is $a_0 = 25/46 \approx 0.5435$, usually rounded to 0.54.
- Blackman–Harris is one of a family of cosine sums with three or four terms, published by Harris (1978) and refined by Nuttall (1981). The 4-term version above keeps its side lobes 92 dB down.
- Flat-top windows are designed so the top of the main lobe is almost flat, not for low leakage. Several exist; the 5-term one above is the one most signal-processing libraries call "flattop". Its values dip slightly below zero near the ends.

### Symmetric vs periodic windows

The formulas above divide by $N$. That makes the window **periodic** (also called **DFT-even**): it is one period of a repeating cosine, so the sample after the last one would be the first one again. For an FFT, that's what you want, because the FFT treats the block as periodic too, and it gives the exact figures in the table below.

The **symmetric** form divides by $N - 1$ instead, so the first and last samples are equal and the window is a mirror image about its centre. Use it to design FIR filters, where symmetry gives the filter linear phase.

The difference is one sample's worth of stretch, which only matters for short windows. Check which one a library gives you: `numpy.hanning(N)` and MATLAB's `hann(N)` are symmetric, while `scipy.signal.get_window('hann', N)` and `hann(N, 'periodic')` are periodic. The [FFT guide](/learn/signal-processing/fast-fourier-transform/#does-a-javascript-fft-give-the-same-result-as-numpy-or-matlab) explains why mixing them up makes spectra disagree.

## Window functions compared: measured figures

We measured every figure in this table with the window and FFT code in the [live example](#how-to-apply-a-window-function-in-javascript-react-or-angular), using periodic windows of 1,024 samples and a finely zero-padded transform. They agree closely with the values Harris (1978) published; small differences in the second decimal place come from how each width is measured. Widths are in bins.

| Window | Highest side lobe | Side-lobe roll-off | −3 dB width | −6 dB width | First nulls | Coherent gain | ENBW | Scalloping loss |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rectangular | −13.3 dB | −6 dB/octave | 0.89 | 1.21 | ±1 | 1.00 | 1.00 | 3.92 dB |
| Hann | −31.5 dB | −18 dB/octave | 1.44 | 2.00 | ±2 | 0.50 | 1.50 | 1.42 dB |
| Hamming | −42.7 dB | −6 dB/octave | 1.30 | 1.82 | ±2 | 0.54 | 1.36 | 1.75 dB |
| Blackman | −58.1 dB | −18 dB/octave | 1.64 | 2.30 | ±3 | 0.42 | 1.73 | 1.10 dB |
| Blackman–Harris (4-term) | −92.0 dB | −6 dB/octave | 1.90 | 2.67 | ±4 | 0.36 | 2.00 | 0.83 dB |
| Flat top (5-term) | −93.0 dB | −6 dB/octave | 3.72 | 4.58 | ±5 | 0.22 | 3.77 | 0.01 dB |

How to read it:

- Down the side-lobe column, leakage falls; down the width columns, resolution gets worse. Every row pays for lower side lobes with a wider main lobe.
- Main-lobe width in radians: the first nulls at ±2 bins mean Hann's and Hamming's main lobes are 4 bins, or $8\pi/N$ radians per sample, wide. Rectangular's is $4\pi/N$ and Blackman's $12\pi/N$.
- Worst-case loss: for a tone halfway between bins buried in noise, the scalloping loss and the noise-bandwidth penalty add up to about 3.9 dB for rectangular, 3.2 dB for Hann, 3.1 dB for Hamming and 3.5 dB for Blackman, which makes Hann and Hamming popular for detecting tones in noise.

### Worked example: can you see a tone 60 dB weaker?

With 1,024 samples, a strong tone at bin 40.5 (the worst place for it) and very low noise, we added a tone 60 dB weaker and checked whether it stood above everything around it:

| Weak tone is… | Rectangular | Hann | Hamming | Blackman | Blackman–Harris | Flat top |
| --- | --- | --- | --- | --- | --- | --- |
| 5 bins away | Hidden | Hidden | Hidden | Hidden | Visible, by 40 dB | Visible, by 45 dB |
| 12 bins away | Hidden | Visible, by 13 dB | Hidden | Visible, by 22 dB | Visible, by 42 dB | Visible, by 39 dB |
| 20 bins away | Hidden | Visible, by 27 dB | Hidden | Visible, by 35 dB | Visible, by 62 dB | Visible, by 36 dB |

Hamming never shows it: its side lobes start lower than Hann's but stay in the −40s and −50s of dB for dozens of bins. Hann's start higher but fall away, so by 12 bins they are lower than Hamming's.

## Hann vs Hamming window

The two are the same shape, a raised cosine, with slightly different heights:

| | Hann (Hanning) | Hamming |
| --- | --- | --- |
| Formula | $0.5 - 0.5\cos(2\pi n/N)$ | $0.54 - 0.46\cos(2\pi n/N)$ |
| Value at the ends | 0 | 0.08 |
| Highest side lobe | −31.5 dB, the first one | −42.7 dB; the first is almost cancelled |
| Side-lobe roll-off | −18 dB per octave | −6 dB per octave |
| Main lobe, first nulls | ±2 bins | ±2 bins |
| ENBW | 1.50 bins | 1.36 bins |
| Scalloping loss | 1.42 dB | 1.75 dB |
| Typical use | General spectrum analysis, noise, PSD, vibration | Speech and audio frames; FIR filter design; interference close to a tone |

Hann goes all the way to zero at the ends, so the windowed record has no jump in value or slope and its side lobes fall away fast. Hamming stops at 0.08, a small step, and in return its constant and cosine terms are balanced so the first side lobe almost cancels. The leftover step is why its side lobes barely fall.

Choose Hamming when the interference you care about is within a few bins of a strong tone, and Hann when it could be anywhere in the spectrum, or when you're measuring noise. If you're unsure, Hann is the safer default.

## Which window should you use?

Use Hann for most work, and switch only when you need accurate amplitudes, deeper side lobes or a transient that fits the block.

| If you need to… | Use | Why |
| --- | --- | --- |
| Analyse a signal you know little about | Hann | A good balance of resolution, leakage and noise bandwidth |
| Separate two tones of similar size that are close together | Hann or Hamming (rectangular if they fit the record exactly) | The narrowest main lobes after rectangular |
| Find a weak tone near a strong one | Blackman, or Blackman–Harris for 60 dB or more | Side lobes 58 dB and 92 dB down |
| Measure a tone's amplitude accurately, such as calibrating against a reference | Flat top | Reads within 0.01 dB wherever the tone falls between bins |
| Measure noise, random vibration or a [power spectral density](/learn/signal-processing/power-spectral-density/) | Hann, with 50% overlap between segments | Low leakage, and overlap recovers the samples the taper discards |
| Measure a transient that starts and ends inside the record, such as an impact | Rectangular (no window) | Tapering would cut off part of the event |
| Analyse a tone that you sample synchronously, an exact number of cycles per record | Rectangular | There is no jump, so there is no leakage to fix |
| Frame speech or audio for a short-time FFT or [spectrogram](/learn/chart-types/cartesian/spectrogram/) | Hann or Hamming | The usual choices; Hann with 50% overlap sums to a constant |

Two tones of equal size show as separate peaks when they are further apart than about the window's −6 dB width: about 1.2 bins with no window, 2 bins with Hann and 2.3 with Blackman. If they're closer than that, no window will separate them: record for longer.

## Correcting amplitude and power after windowing

A window removes part of the signal, so every level in a windowed spectrum reads low. How you correct depends on what you are measuring.

- Tones (amplitude correction): a tone's peak is scaled by the window's **coherent gain**, its average value. Divide each FFT magnitude by $\sum w[n]$ instead of $N$ (and double every bin except 0 and $N/2$ for a one-sided spectrum), and a tone centred on a bin reads its true amplitude. The correction factor is $1/\text{coherent gain}$: 2.00 for Hann, 1.85 for Hamming, 2.38 for Blackman, 2.79 for Blackman–Harris and 4.64 for flat top.
- Noise and broadband signals (power correction): noise is spread across all bins, so it is scaled by the window's average power, $\frac{1}{N}\sum w[n]^2$, not its average value. Correct RMS levels by $1/\sqrt{\frac{1}{N}\sum w[n]^2}$: 1.63 for Hann, 1.59 for Hamming, 1.81 for Blackman. A [power spectral density](/learn/signal-processing/power-spectral-density/) builds this in by dividing by $f_s \sum w[n]^2$, which is the same as dividing by the ENBW in hertz.

You can't have both in one plot. With amplitude correction, a tone reads correctly but the noise floor reads high by $10\log_{10}(\text{ENBW})$: 1.76 dB for Hann, 5.76 dB for flat top. With power correction, the noise reads correctly but tones read low. Label which one a chart uses.

Scalloping loss is a separate error. Even with the right correction, a tone between bins reads low by up to the scalloping loss (1.42 dB for Hann), so test equipment offers a **flat-top window** for amplitude measurements. Its main lobe is so flat that the error is about 0.01 dB, but it is nearly 4 bins wide at −3 dB and raises the noise floor by 5.8 dB, so it's a poor choice for resolving close tones or finding weak ones. The alternative is to keep a narrower window and interpolate the peak from the bins either side of it.

## Window functions in FIR filter design

An ideal low-pass filter's impulse response is a **sinc** function, which goes on forever in both directions. To make a real FIR filter, you keep $M + 1$ samples of it and multiply them by a window: the **windowed-sinc** method.

The same trade-off applies, now to the filter's frequency response. Cutting the sinc off abruptly (a rectangular window) leaves ripples only about 21 dB down in the stopband, whatever the length. A tapering window lowers them: about 53 dB with Hamming and 74 dB with Blackman, at the cost of a wider transition band. For filter design, use the symmetric form of the window, dividing by $M$ (the number of taps minus one), so the filter has linear phase.

The [FIR vs IIR filters guide](/learn/signal-processing/fir-vs-iir-filters/) works through the windowed-sinc method step by step, with a live demo where you can switch the window and watch the stopband change. Other uses of windows include overlap-add processing, where overlapping Hann windows sum to a constant, and smoothing the edges of audio clips to avoid clicks.

## Does zero padding reduce spectral leakage?

No. **Zero padding**, appending zeros to the record before the FFT, gives you more bins, closer together. They are samples of the same windowed spectrum, main lobe, side lobes and all. So zero padding:

- draws the leakage in more detail, which can make it look worse, because the side lobes that fell between bins are now visible;
- reduces the apparent scalloping loss, because a bin lands nearer the top of each peak;
- doesn't separate close tones, because the main lobe is as wide as ever.

Only a window lowers the side lobes, and only a longer record narrows the main lobe. See [zero padding in the FFT guide](/learn/signal-processing/fast-fourier-transform/#zero-padding-a-smoother-plot-not-more-detail) for more.

## Common windowing mistakes

Most windowing mistakes are forgetting to window, or forgetting to correct for the window afterwards.

- **Using no window by accident.** Taking the FFT of a raw block applies a rectangular window, with side lobes only 13 dB down. Unless the signal fits the block exactly or is a transient, apply Hann at least.
- **Forgetting to correct the level.** Hann alone lowers every tone by 6 dB. Divide by the window's sum, not by $N$.
- **Correcting noise with the tone factor.** Amplitude correction makes noise read high by the ENBW. Use power correction, or a PSD, for noise.
- **Using a symmetric window for the FFT.** It makes small, confusing errors in short FFTs. Use the periodic form for spectrum analysis and the symmetric form for filter design.
- **Choosing Hamming to find weak tones far away.** Its side lobes barely fall. Use Hann or Blackman.
- **Windowing a transient.** An impact or pulse that sits inside the record is already zero at both ends; a window just attenuates or cuts it off.
- **Windowing without overlap when averaging.** With Hann and no overlap, the samples near each segment's ends barely count. Overlap segments by 50% (see [Welch's method](/learn/signal-processing/power-spectral-density/)).

## How to apply a window function in JavaScript, React or Angular

The demo windows a record of one or two tones (1,024 samples by default), takes its FFT and redraws all three charts each time you move a control. It runs the windows and the FFT in your browser with the plain JavaScript functions in the code. The top left chart shows the record (blue), the window (yellow) and the windowed record (orange); the top right chart shows the window's own frequency response; the bottom chart shows the spectrum in dB, with the strong tone's leakage on its own as a dashed line.

Choose a **window**, move the **tone** from bin 40.0 (on a bin, no leakage) to 40.5 (halfway, worst case), switch the **weak tone** 60 dB down on or off and move its **offset**, and change the **FFT size** and the **noise**. The readout gives the peak's error, the highest side lobe, the ENBW, the coherent gain and whether the weak tone can be seen. Hover over the spectrum to read a side lobe's level; scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={800} name="./Basic/demo" />

<LearnCta position="top" chart="window function comparison" demo="audio-analyzer-fft-example" demoLabel="audio spectrum analyzer chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for this example. The JavaScript tab includes the FFT, the window functions and the spectrum code; the React and Angular tabs reuse them to plot a Hann-windowed spectrum.

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
        ZoomExtentsModifier,
        EXyDirection
    } from "scichart";
    // fft, makeWindow and spectrumDb: copy them from the JavaScript tab
    import { makeWindow, spectrumDb } from "./windows";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Frequency (Hz)" }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Amplitude (dB)",
                autoRange: EAutoRange.Never,
                visibleRange: new NumberRange(-140, 5)
            })
        );

        // Your block of samples (a power of 2 long) and its sample rate
        const { samples, sampleRate } = getYourSamples();
        const levels = spectrumDb(samples, makeWindow("hann", samples.length)); // or "blackman", "flatTop"...
        const frequencies = Array.from(levels, (_, k) => (k * sampleRate) / samples.length);

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: frequencies, yValues: Array.from(levels), dataIsSortedInX: true }),
                stroke: "#50C7E0",
                strokeThickness: 2
            })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        return { sciChartSurface };
    };

    export const WindowedSpectrum = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />;
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
        ZoomExtentsModifier,
        EXyDirection
    } from "scichart";
    // fft, makeWindow and spectrumDb: copy them from the JavaScript tab
    import { makeWindow, spectrumDb } from "./windows";

    @Component({
        selector: "app-windowed-spectrum",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class WindowedSpectrumComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Frequency (Hz)" }));
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, {
                    axisTitle: "Amplitude (dB)",
                    autoRange: EAutoRange.Never,
                    visibleRange: new NumberRange(-140, 5)
                })
            );

            // Your block of samples (a power of 2 long) and its sample rate
            const { samples, sampleRate } = getYourSamples();
            const levels = spectrumDb(samples, makeWindow("hann", samples.length)); // or "blackman", "flatTop"...
            const frequencies = Array.from(levels, (_, k) => (k * sampleRate) / samples.length);

            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: frequencies, yValues: Array.from(levels), dataIsSortedInX: true }),
                    stroke: "#50C7E0",
                    strokeThickness: 2
                })
            );
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true }),
                new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
            );
            return { sciChartSurface };
        };
    }
    ```
</CodeSnippetBlock>

Key points:

- One function makes every window: `makeWindow` evaluates the cosine sum from a table of coefficients; pass `symmetric = true` for FIR filter design. `windowFigures` computes the coherent gain and ENBW from the weights, so you can check any window you add.
- `spectrumDb` divides by the window's sum, so a tone centred on a bin reads its true level in dB whichever window you use.
- Each spectrum is an `XyDataSeries` drawn by a `FastLineRenderableSeries`, with `dataIsSortedInX: true` because bins are in order. The example's `update()` calls `clear()` and `appendRange()` whenever a control moves, and SciChart.js redraws on the next frame.
- A fixed dB range (`autoRange: EAutoRange.Never` with a `visibleRange`) keeps the axis still while you compare windows, so side lobes and the noise floor can be compared by eye.

**See it in the demo app:** [JavaScript audio spectrum analyzer chart](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example) · [React audio spectrum analyzer chart](https://www.scichart.com/demo/react/audio-analyzer-fft-example) · [Angular audio spectrum analyzer chart](https://www.scichart.com/demo/angular/audio-analyzer-fft-example), which runs an FFT on live microphone input.

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), and the [FFT guide](/learn/signal-processing/fast-fourier-transform/) for bins, resolution and how to read a spectrum.

## Frequently asked questions

### What is a window function in signal processing?

A window function is a set of weights, one per sample, that you multiply a block of samples by before an FFT or when designing an FIR filter. It is largest in the middle and tapers towards the ends, so the block has no sudden jump where it starts and stops. That reduces spectral leakage: energy from one frequency spreading into many others.

### What is the difference between a Hann and a Hamming window?

Both are raised cosines. Hann is 0.5 - 0.5 cos(2 pi n / N) and falls to zero at the ends; Hamming is 0.54 - 0.46 cos(2 pi n / N) and stops at 0.08. Hamming's highest side lobe is lower, about -43 dB against Hann's -31.5 dB, but its side lobes stay near that level, while Hann's fall by 18 dB per octave. Use Hamming when interference is close to the tone, and Hann when it is far away or for noise.

### Why does a window function reduce spectral leakage?

The FFT treats a block of samples as if it repeated forever. Unless a tone fits a whole number of cycles in the block, the repeat has a jump at the join, and a jump contains energy at every frequency. A window brings both ends of the block smoothly to (or near) zero, so the jump disappears and much less energy leaks into distant bins. The cost is a wider peak.

### Which window function is best for an FFT?

Hann is the usual default for general analysis, noise and power spectral density. Use Blackman or Blackman-Harris to find a weak tone next to a strong one, a flat-top window to measure a tone's amplitude accurately, and no window (rectangular) for transients that start and end inside the block or tones that fit it exactly.

### What is the main lobe width and side lobe level of a Hamming window?

A Hamming window's main lobe is 4 bins wide between its first nulls, which is 8 pi / N radians per sample, twice the width of no window. It is 1.30 bins wide at -3 dB and 1.82 bins at -6 dB. The first side lobe is almost cancelled (-44 dB), so the highest is a later one, at -42.7 dB, usually quoted as -43 dB. In FIR filter design it gives a stopband attenuation of about 53 dB.

### How do I apply a window function in JavaScript?

Build an array of weights, for example w[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N) for Hann, multiply each sample by its weight, run the FFT, and divide each magnitude by the sum of the weights (doubling all but the first and last bins) to read amplitudes. To plot the spectrum with SciChart.js, put the frequencies and levels in an XyDataSeries and draw them with a FastLineRenderableSeries.

## Sources

- Harris, F. J. (1978), [On the Use of Windows for Harmonic Analysis with the Discrete Fourier Transform](https://doi.org/10.1109/PROC.1978.10837). *Proceedings of the IEEE*, 66(1), 51–83. The standard reference for window figures of merit: side lobes, roll-off, bandwidths, coherent gain, ENBW and scalloping loss; the Blackman–Harris windows.
- Nuttall, A. H. (1981), [Some Windows with Very Good Sidelobe Behavior](https://doi.org/10.1109/TASSP.1981.1163506). *IEEE Transactions on Acoustics, Speech, and Signal Processing*, 29(1), 84–91. Cosine-sum windows and their side-lobe roll-off.
- Heinzel, G., Rüdiger, A. and Schilling, R. (2002), [Spectrum and spectral density estimation by the Discrete Fourier transform (DFT), including a comprehensive list of window functions and some new flat-top windows](https://hdl.handle.net/11858/00-001M-0000-0013-557A-5). Max Planck Institute for Gravitational Physics. Amplitude and power scaling, ENBW and flat-top windows.
- Blackman, R. B. and Tukey, J. W. (1958), *The Measurement of Power Spectra from the Point of View of Communications Engineering*, Dover. The origin of "hanning" and "hamming".
- Smith, S. W., *The Scientist and Engineer's Guide to Digital Signal Processing*: [chapter 9, Applications of the DFT](https://www.dspguide.com/ch9.htm) (spectral analysis and windows) and [chapter 16, Windowed-Sinc Filters](https://www.dspguide.com/ch16.htm).
- Oppenheim, A. V. and Schafer, R. W. (2010), *Discrete-Time Signal Processing*, 3rd edition, Pearson. FIR filter design by windowing, and the windows' stopband attenuation.
- Smith, J. O., [Spectral Audio Signal Processing](https://ccrma.stanford.edu/~jos/sasp/), Center for Computer Research in Music and Acoustics (CCRMA), Stanford University. Windows and spectrum analysis in depth.

<LearnCta position="bottom" chart="window function comparison" demo="audio-analyzer-fft-example" demoLabel="audio spectrum analyzer chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
