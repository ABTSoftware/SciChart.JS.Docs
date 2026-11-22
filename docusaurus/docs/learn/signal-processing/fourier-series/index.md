---
sidebar_position: 90
sidebar_label: Fourier Series
title: "Fourier Series: Formula, Square Wave Example and Interactive Grapher"
description: "What a Fourier series is: the formula and coefficients, trigonometric and complex forms, the square wave example, the Gibbs phenomenon, and a live grapher to try."
keywords:
    [
        "fourier series",
        "fourier series formula",
        "fourier series equation",
        "fourier series coefficients",
        "square wave fourier series",
        "fourier series of square wave",
        "trigonometric fourier series",
        "complex fourier series",
        "exponential fourier series",
        "fourier series examples",
        "fourier series graph",
        "fourier series grapher",
        "fourier series visualization",
        "gibbs phenomenon",
        "fourier series vs fourier transform",
        "discrete time fourier series"
    ]
image: /img/learn/fourier-series-og.png
related: [fourier-transform, fast-fourier-transform, window-functions, audio-spectrum-analyzer]
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
                    "name": "What is the Fourier series formula?",
                    "acceptedAnswer": { "@type": "Answer", "text": "For a signal f(t) that repeats every T seconds, with fundamental angular frequency w0 = 2 pi / T, the Fourier series is f(t) = a0/2 + the sum over n = 1, 2, 3 ... of (an cos(n w0 t) + bn sin(n w0 t)). The coefficients are an = (2/T) times the integral over one period of f(t) cos(n w0 t), and bn = (2/T) times the integral over one period of f(t) sin(n w0 t). The term a0/2 is the signal's average value." }
                },
                {
                    "@type": "Question",
                    "name": "What is the Fourier series of a square wave?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A square wave that is +1 for the first half of each period and -1 for the second half has the Fourier series (4/pi)(sin w0t + sin 3w0t / 3 + sin 5w0t / 5 + ...). It contains only odd harmonics, and the amplitude of harmonic n is 4/(n pi), so it falls as 1/n. The fundamental alone carries about 81% of the wave's power." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a Fourier series and a Fourier transform?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A Fourier series describes a periodic signal as a sum of sine waves at whole-number multiples of its repeat frequency, so its spectrum is a set of separate lines. A Fourier transform works on signals that don't repeat and gives a continuous spectrum. For sampled data, the discrete Fourier transform (DFT) plays both roles: it treats a block of samples as one period of a repeating signal." }
                },
                {
                    "@type": "Question",
                    "name": "What is the Gibbs phenomenon?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The Gibbs phenomenon is the overshoot a Fourier series makes next to a jump in the signal. However many harmonics you add, the partial sum overshoots by about 9% of the jump on each side; more harmonics only squeeze the ripple closer to the jump. Smoothing the coefficients, for example with Lanczos sigma factors, reduces the overshoot to around 1%, at the cost of a less steep edge." }
                },
                {
                    "@type": "Question",
                    "name": "How do I find Fourier series coefficients from measured data?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Sample exactly one period (or a whole number of periods) of the signal at M evenly spaced points and take its discrete Fourier transform. Bin n of the DFT divided by M approximates the complex coefficient cn, so an is 2/M times the real part of X[n] and bn is minus 2/M times its imaginary part. The approximation is good while n is well below M/2 and the sample rate is high enough to avoid aliasing." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a Fourier series in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Compute the coefficients an and bn, evaluate the partial sum a0/2 + the sum of an cos(n w0 t) + bn sin(n w0 t) for n = 1 to N at a few thousand time points, and plot the result as a line. With SciChart.js, put the times and values in an XyDataSeries and draw them with a FastLineRenderableSeries; draw the harmonic amplitudes with a FastImpulseRenderableSeries. In React or Angular, create the same charts inside scichart-react's SciChartReact or scichart-angular's ScichartAngularComponent." }
                }
            ]
        })}
    </script>
</head>

# Fourier Series

## What is a Fourier series?

A **Fourier series** is a way of writing a periodic signal, one that repeats every $T$ seconds, as a sum of sine and cosine waves. The waves are the **harmonics**: the **fundamental** frequency $f_0 = 1/T$ and its whole-number multiples $2f_0, 3f_0, 4f_0 \ldots$ Each harmonic has its own amplitude, given by the signal's **Fourier coefficients**.

![A Fourier series grapher in a dark navy theme: the top chart shows a square wave and its partial sum with harmonics up to N = 15, rippling around the flat tops and overshooting at each jump; the bottom chart shows the harmonic amplitudes as stems at the odd harmonics 1, 3, 5 to 15, falling along a dashed 4 over pi n curve, with the left-out harmonics in grey](/img/learn/fourier-series-og.png)

*A square wave and its Fourier series with harmonics 1 to 15 (top), and the amplitude of each harmonic (bottom). [Try the interactive version](#how-to-graph-a-fourier-series-in-javascript-react-or-angular), where you can change the waveform and the number of harmonics.*

:::tip Key takeaways
- Any practical periodic signal is a sum of harmonics at $f_0, 2f_0, 3f_0 \ldots$, plus a constant (its average).
- The coefficients $a_n$ and $b_n$ come from one integral each over one period. The trigonometric, amplitude–phase and complex forms all hold the same information.
- A square wave contains only odd harmonics, with amplitude $4/(n\pi)$. The smoother a waveform, the faster its harmonics shrink.
- At a jump, a truncated series always overshoots by about 9% of the jump (the Gibbs phenomenon), however many terms you add.
- For sampled data, the DFT of one period gives the coefficients: $c_n \approx X[n]/M$.
:::

## How a Fourier series works

A Fourier series is a recipe for a repeating waveform. The ingredients are fixed: a constant, then sine and cosine waves at one, two, three times the repeat frequency, and so on. Only the amounts change from one waveform to the next. Those amounts are the coefficients.

The picture below builds a square wave from its first three ingredients. Each one is a sine wave that fits a whole number of cycles into one period, so the sum repeats with the same period as the square wave.

![Left: three sine waves over one period, harmonic 1 with amplitude 4/π ≈ 1.27, harmonic 3 with amplitude 4/(3π) ≈ 0.42 and harmonic 5 with amplitude 4/(5π) ≈ 0.25. Right: their sum, which follows a dashed square wave of +1 then −1 with three ripples on each flat part and a steep edge at the middle of the period](./square-wave-from-harmonics.svg)

Three terms already give flat-ish tops and steep edges. Each extra odd harmonic adds a smaller, faster ripple that fills in more of the corners.

The coefficients are easy to find because sines and cosines at different harmonics are **orthogonal**: multiply two of them together and average over one period, and the result is zero unless they are the same harmonic. So to measure how much of harmonic $n$ a signal contains, multiply the signal by that harmonic's cosine (or sine) and average. Every other harmonic averages to zero and drops out.

The idea is named after Joseph Fourier, who used these series in his 1822 work on the flow of heat.

## The Fourier series formula

For a signal $f(t)$ with period $T$, write the fundamental angular frequency as $\omega_0 = 2\pi/T = 2\pi f_0$. The **trigonometric Fourier series** is:

$$
f(t) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \Big( a_n \cos(n\omega_0 t) + b_n \sin(n\omega_0 t) \Big)
$$

and its **Fourier series coefficients** are integrals over any one period:

$$
a_n = \frac{2}{T} \int_{0}^{T} f(t) \cos(n\omega_0 t)\, dt, \qquad
b_n = \frac{2}{T} \int_{0}^{T} f(t) \sin(n\omega_0 t)\, dt
$$

- $a_0/2$ is the average value of the signal over a period (the DC level). Writing it as $a_0/2$ lets the same $a_n$ formula work for $n = 0$.
- $a_n$ measures the cosine part of harmonic $n$, and $b_n$ the sine part.
- Harmonic $n$ has frequency $n f_0$ hertz. For a 50 Hz waveform, harmonic 3 is at 150 Hz.
- Stopping the sum at $n = N$ gives the **partial sum** $S_N(t)$, which is what a graph or a computer actually draws.

### Amplitude–phase form

A cosine and a sine at the same frequency add up to one shifted cosine. So the series can also be written with one amplitude and one phase per harmonic:

$$
f(t) = \frac{a_0}{2} + \sum_{n=1}^{\infty} A_n \cos(n\omega_0 t - \varphi_n), \qquad
A_n = \sqrt{a_n^2 + b_n^2}, \quad \varphi_n = \operatorname{atan2}(b_n, a_n)
$$

$A_n$ is what a spectrum analyser shows as the height of each line, and it doesn't change if you shift the signal in time. Only the phases $\varphi_n$ change.

### Complex exponential form

Using Euler's formula, $e^{i\theta} = \cos\theta + i\sin\theta$, the sines and cosines fold into one sum over positive and negative $n$. This is the **complex** (or **exponential**) **Fourier series**:

$$
f(t) = \sum_{n=-\infty}^{\infty} c_n\, e^{i n \omega_0 t}, \qquad
c_n = \frac{1}{T} \int_{0}^{T} f(t)\, e^{-i n \omega_0 t}\, dt
$$

The two sets of coefficients convert directly:

| Complex form | Trigonometric form |
| --- | --- |
| $c_0$ | $a_0/2$ (the average) |
| $c_n$, for $n > 0$ | $(a_n - i\, b_n)/2$ |
| $c_{-n}$ | $(a_n + i\, b_n)/2$, the complex conjugate of $c_n$ for a real signal |
| $\lvert c_n \rvert$ | $A_n / 2$: half the amplitude sits at $+n$, half at $-n$ |

The complex form is shorter to write and to manipulate, and it is the form the [Fourier transform](/learn/signal-processing/fourier-transform/) and the DFT grow out of. The trigonometric form is easier to picture.

## Worked example: the Fourier series of a square wave

Take a square wave that is $+1$ for the first half of each period and $-1$ for the second half.

1. Use the symmetry. The wave is an odd function, $f(-t) = -f(t)$, so every cosine coefficient is zero: $a_0 = a_n = 0$. Only the $b_n$ are left.
2. Integrate each half of the period. With $\omega_0 T = 2\pi$:
   $$
   b_n = \frac{2}{T}\left[ \int_0^{T/2} \sin(n\omega_0 t)\, dt - \int_{T/2}^{T} \sin(n\omega_0 t)\, dt \right] = \frac{2\,(1 - \cos n\pi)}{n\pi}
   $$
3. Read off the pattern. $\cos n\pi$ is $-1$ for odd $n$ and $+1$ for even $n$. So $b_n = 4/(n\pi)$ for odd $n$, and $b_n = 0$ for even $n$.

The square wave's Fourier series is therefore:

$$
f(t) = \frac{4}{\pi} \left( \sin \omega_0 t + \frac{1}{3} \sin 3\omega_0 t + \frac{1}{5} \sin 5\omega_0 t + \frac{1}{7} \sin 7\omega_0 t + \cdots \right)
$$

| Harmonic $n$ | $b_n = 4/(n\pi)$ | Share of the wave's power, up to and including $n$ |
| --- | --- | --- |
| 1 | 1.2732 | 81.1% |
| 3 | 0.4244 | 90.1% |
| 5 | 0.2546 | 93.3% |
| 7 | 0.1819 | 95.0% |
| up to 99 | | 99.6% |

The power column uses **Parseval's theorem**: the mean square of the signal (here 1) equals $a_0^2/4 + \tfrac{1}{2}\sum (a_n^2 + b_n^2)$. So the fundamental alone carries $8/\pi^2 \approx 81\%$ of a square wave's power, and the last few per cent are spread over a long tail of harmonics. That tail is what makes the edges sharp.

At $t = T/4$ the square wave is 1 and every sine is $\pm 1$, so the series gives $1 = \tfrac{4}{\pi}(1 - \tfrac{1}{3} + \tfrac{1}{5} - \cdots)$. That is the Leibniz series for $\pi/4$.

## Fourier series examples: square, sawtooth, triangle and pulse waves

All four waves below swing between $-1$ and $+1$ (the pulse train between 0 and 1) and repeat every $T$. You can draw each of them, with any number of harmonics, in the [live grapher](#how-to-graph-a-fourier-series-in-javascript-react-or-angular).

| Waveform (one period) | Fourier series | Harmonics present | Amplitudes fall as | Power in the fundamental |
| --- | --- | --- | --- | --- |
| Square, $+1$ then $-1$ | $\dfrac{4}{\pi} \displaystyle\sum_{n \text{ odd}} \frac{\sin n\omega_0 t}{n}$ | Odd only | $1/n$ | 81.1% |
| Sawtooth, rising from $-1$ to $+1$, centred on $t = 0$ | $\dfrac{2}{\pi} \displaystyle\sum_{n=1}^{\infty} (-1)^{n+1} \frac{\sin n\omega_0 t}{n}$ | All | $1/n$ | 60.8% |
| Triangle, peak $+1$ at $t = 0$ | $\dfrac{8}{\pi^2} \displaystyle\sum_{n \text{ odd}} \frac{\cos n\omega_0 t}{n^2}$ | Odd only | $1/n^2$ | 98.6% |
| Pulse train, 1 for a fraction $D$ of each period (the **duty cycle**), centred on $t = 0$ | $D + \displaystyle\sum_{n=1}^{\infty} \frac{2 \sin(n\pi D)}{n\pi} \cos n\omega_0 t$ | All, except where $nD$ is a whole number | $1/n$ (under a sinc-shaped envelope) | depends on $D$ |

The smoother a waveform, the faster its coefficients fall, because the faster a waveform changes, the more high harmonics it needs:

- The square, sawtooth and pulse waves jump, so their coefficients fall only as $1/n$. Even harmonic 99 still has about 1% of the fundamental's amplitude.
- The triangle is continuous but has corners (its slope jumps), so its coefficients fall as $1/n^2$. Harmonic 9 is already down to about 1%.
- In general, if a signal and its first $k-1$ derivatives are continuous and the $k$th derivative jumps, the coefficients fall as $1/n^{k+1}$. A signal with no corners at all, such as a rounded pulse, needs very few harmonics.

So a square-wave clock signal radiates interference at high frequencies, and a triangle wave sounds much mellower than a square wave at the same pitch.

Pulse trains show one more effect. With $D = 25\%$, the coefficient $\sin(n\pi D)$ is zero at $n = 4, 8, 12 \ldots$, so every fourth harmonic is missing. A narrower pulse spreads its power over more harmonics, and as $D$ shrinks towards zero the line spectrum fills in towards the continuous sinc shape of a single pulse's Fourier transform.

## Even and odd symmetry shortcuts

Spotting symmetry before you integrate halves the work, and often tells you that whole groups of coefficients are zero.

| Symmetry | Test | Coefficients that are zero | What's left |
| --- | --- | --- | --- |
| Even | $f(-t) = f(t)$: a mirror image about $t = 0$ | All $b_n$ | A Fourier cosine series, with $a_n = \frac{4}{T}\int_0^{T/2} f(t)\cos(n\omega_0 t)\,dt$ |
| Odd | $f(-t) = -f(t)$: rotate by half a turn about the origin | $a_0$ and all $a_n$ | A Fourier sine series, with $b_n = \frac{4}{T}\int_0^{T/2} f(t)\sin(n\omega_0 t)\,dt$ |
| Half-wave | $f(t + T/2) = -f(t)$: the second half is the first half upside down | All even harmonics, including $a_0$ | Odd harmonics only |

The square wave is odd and half-wave symmetric, so only odd sine terms survive. The triangle above is even and half-wave symmetric, so only odd cosine terms survive. The sawtooth is odd but not half-wave symmetric, so it has every sine harmonic.

Two more shortcuts: adding a constant to a signal changes only $a_0$, and shifting it in time changes only the phases, never the amplitudes $A_n$. So a square wave that runs from 0 to 1 has the same harmonics as the one above, at half the size, plus an average of $1/2$.

## Convergence and the Gibbs phenomenon

If a periodic signal has a finite number of jumps, peaks and troughs in each period, and the area under its absolute value over a period is finite (the **Dirichlet conditions**), then its Fourier series converges:

- to $f(t)$ wherever the signal is continuous;
- to the midpoint of the jump wherever it jumps. At the square wave's edges, every partial sum passes through 0.

Even without those conditions, the series converges **in the mean-square sense** for any signal with finite power: the RMS error between $S_N(t)$ and $f(t)$ goes to zero as $N$ grows. For the square wave it is 0.44 with one harmonic, 0.16 with harmonics up to 15 and 0.06 up to 99. For the triangle it is 0.0036 already at 15.

### The Gibbs phenomenon at a jump

Near a jump, the partial sum doesn't settle. It overshoots and rings, and the overshoot doesn't shrink as you add terms. This is the **Gibbs phenomenon**. The overshoot stays at about 8.95% of the jump on each side; adding harmonics only squeezes the ripple into a narrower region next to the jump.

![A close-up of a square wave's jump from −1 to +1 at t = 0. Partial sums with N = 15 and N = 61 harmonics both peak at about 1.18, an overshoot of 9% of the jump of 2; the N = 61 ripple sits closer to the jump. A partial sum with N = 61 and Lanczos sigma smoothing peaks at about 1.02, with a slightly slower rise](./gibbs-phenomenon-close-up.svg)

The exact limit is $\frac{1}{\pi}\int_0^{\pi} \frac{\sin x}{x}\,dx - \frac{1}{2} \approx 0.0895$ of the jump. For a square wave from $-1$ to $+1$, the partial sums peak near $1.179$. Henry Wilbraham described the overshoot in 1848; it is named after J. Willard Gibbs, who wrote about it in 1899.

### Reducing the Gibbs overshoot with sigma factors

The ringing comes from cutting the series off abruptly at harmonic $N$. Tapering the coefficients instead, by multiplying harmonic $n$ by a **Lanczos sigma factor** $\sigma_n = \operatorname{sinc}\big(n/(N+1)\big)$, cuts the overshoot from about 9% to about 1.2% of the jump, but it softens the edge and slightly raises the RMS error (0.075 instead of 0.060 for the square wave at $N = 100$). This is the same trade-off a [window function](/learn/signal-processing/window-functions/) makes in spectrum analysis, and Gibbs ringing is the same effect you see as ringing from a sharp [low-pass filter](/learn/signal-processing/low-pass-filter/).

## Fourier series vs Fourier transform vs DFT

All three describe a signal by its frequencies. Which one applies depends on whether the signal repeats and whether it is sampled.

| Your signal | Tool | Its spectrum | Typical use |
| --- | --- | --- | --- |
| Continuous and periodic (repeats every $T$) | Fourier series | Separate lines at $f_0, 2f_0, 3f_0 \ldots$ | Analysing or building a repeating waveform on paper: square waves, harmonics, AC power, musical tones |
| Continuous and not periodic (a pulse, a transient, a chirp) | [Fourier transform](/learn/signal-processing/fourier-transform/) | A continuous curve over all frequencies | Theory of filters, modulation and signals that start and stop |
| Sampled, a finite block of $M$ samples | Discrete Fourier transform (DFT), computed with an [FFT](/learn/signal-processing/fast-fourier-transform/) | $M$ lines, $f_s/M$ apart | Anything measured: audio, vibration, sensor data |
| Sampled and periodic (repeats every $M$ samples) | Discrete-time Fourier series (DTFS) | $M$ lines, exactly | The same sums as the DFT, scaled by $1/M$ |

The rows are closely linked. The Fourier transform is the limit of a Fourier series as the period grows to infinity: the lines get closer together until they merge into a curve. The DFT is a Fourier series of the samples, because it treats the block as one period of a signal that repeats forever. That is why the DFT can find a waveform's Fourier coefficients, as the next section shows.

## How to find Fourier series coefficients from sampled data

In practice you rarely have a formula for $f(t)$. You have samples. To estimate the coefficients:

1. Sample exactly one period (or a whole number of periods) at $M$ evenly spaced points, $x[k] = f(kT/M)$ for $k = 0 \ldots M-1$. A sample that lands on a jump should take the midpoint value.
2. Take the DFT, $X[n] = \sum_{k=0}^{M-1} x[k]\, e^{-2\pi i n k / M}$, usually with an FFT.
3. Scale by $1/M$: $c_n \approx X[n]/M$. In trigonometric form, $a_n \approx \tfrac{2}{M}\operatorname{Re} X[n]$ and $b_n \approx -\tfrac{2}{M}\operatorname{Im} X[n]$.

This is the coefficient formula with the integral replaced by a sum over the samples. The estimate is good for harmonics well below $M/2$; higher harmonics of the signal fold back onto the lower ones ([aliasing](/learn/signal-processing/nyquist-and-aliasing/)). We sampled one period of the square wave and compared the estimates with the exact $4/(n\pi)$:

| Harmonic $n$ | Exact $b_n$ | From $M = 64$ samples | From $M = 1{,}024$ samples |
| --- | --- | --- | --- |
| 1 | 1.27324 | 1.27222 | 1.27324 |
| 3 | 0.42441 | 0.42134 | 0.42440 |
| 5 | 0.25465 | 0.24951 | 0.25463 |
| 7 | 0.18189 | 0.17468 | 0.18186 |

The estimates get worse as $n$ rises towards $M/2$, and better with more samples per period. In JavaScript, a direct version for a handful of harmonics is only a few lines (use an FFT when you need many):

```js
// Fourier series coefficients a[n] and b[n], n = 0 ... nMax, from M samples of exactly one period
function seriesFromSamples(samples, nMax) {
    const M = samples.length;
    const a = [];
    const b = [];
    for (let n = 0; n <= nMax; n++) {
        let sumCos = 0;
        let sumSin = 0;
        for (let k = 0; k < M; k++) {
            const angle = (2 * Math.PI * n * k) / M;
            sumCos += samples[k] * Math.cos(angle);
            sumSin += samples[k] * Math.sin(angle);
        }
        a.push((2 * sumCos) / M); // a[0] / 2 is the average
        b.push((2 * sumSin) / M);
    }
    return { a, b };
}
```

If the block isn't a whole number of periods, the DFT sees a jump where the end of the block meets the start. The harmonics then spread into neighbouring bins (spectral leakage), and the bins no longer line up with the harmonics. Trim the block to whole periods, or resample it so they fit; a [window function](/learn/signal-processing/window-functions/) reduces the leakage but doesn't put the bins back on the harmonics.

## Common Fourier series mistakes

Most Fourier series mistakes are slips in the coefficient formulas, or misreadings of what a partial sum shows.

- **Forgetting the $a_0/2$.** If you compute $a_0$ with the same $2/T$ formula as the other $a_n$, the constant term is $a_0/2$, not $a_0$. Some books define $a_0$ as the average itself, with $1/T$; check which convention a table uses.
- **Integrating over less (or more) than one full period.** The orthogonality that makes the formulas work holds only over whole periods. With sampled data, a block that isn't a whole number of periods causes leakage.
- **Confusing harmonic number with frequency.** Harmonic $n$ is at $n f_0$ hertz. Harmonic 5 of a 60 Hz waveform is at 300 Hz, not 5 Hz.
- **Mixing one-sided and two-sided amplitudes.** The amplitude of harmonic $n$ is $A_n = 2\lvert c_n \rvert$. Reading $\lvert c_n \rvert$ as the amplitude halves every harmonic.
- **Applying a Fourier series to a signal that doesn't repeat.** The series is periodic, so it repeats your interval forever, jump at the join included. For one-off signals, use the [Fourier transform](/learn/signal-processing/fourier-transform/).
- **Sampling too slowly for the harmonics you want.** You need more than $2n$ samples per period to estimate harmonic $n$, and many more if the signal jumps, because its harmonics never stop.

## How to graph a Fourier series in JavaScript, React or Angular

Each time you move a control, the grapher below re-adds up to 100 harmonics at 5,001 points across two periods, using the plain JavaScript functions in the code, and redraws the wave and its spectrum. Pick a **waveform** (square, sawtooth, triangle or a pulse train with a **duty cycle**), drag the **harmonics** slider from 1 to 100, **show the harmonics** being added, and turn on **Lanczos σ smoothing** to see the Gibbs overshoot drop. The line under the controls gives the overshoot and the RMS error. Zoom in on a jump to see the Gibbs ripples up close; hover to read values, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="Fourier series grapher" demo="audio-analyzer-fft-example" demoLabel="audio spectrum analyzer chart" docs="/2d-charts/chart-types/fast-impulse-renderable-series/" docsLabel="SciChart.js impulse (stem) series documentation" />

Here is the code for this example. The JavaScript tab includes the coefficient and partial-sum functions; the React and Angular tabs reuse them.

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
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";
    // partialSum: copy it from the JavaScript tab
    import { partialSum } from "./fourierSeries";

    const N = 15; // highest harmonic in the sum

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Value" }));

        // Your coefficients: { a, b } arrays indexed by harmonic number, period 1 s
        const coefficients = getYourCoefficients();
        const times = Array.from({ length: 2001 }, (_, i) => -1 + i / 1000);
        const values = times.map((t) => partialSum(coefficients, N, t, false));

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: times, yValues: values, dataIsSortedInX: true }),
                stroke: "#50C7E0",
                strokeThickness: 2
            })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const FourierSeriesChart = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />;
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
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";
    // partialSum: copy it from the JavaScript tab
    import { partialSum } from "./fourierSeries";

    const N = 15; // highest harmonic in the sum

    @Component({
        selector: "app-fourier-series-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class FourierSeriesChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Value" }));

            // Your coefficients: { a, b } arrays indexed by harmonic number, period 1 s
            const coefficients = getYourCoefficients();
            const times = Array.from({ length: 2001 }, (_, i) => -1 + i / 1000);
            const values = times.map((t) => partialSum(coefficients, N, t, false));

            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: times, yValues: values, dataIsSortedInX: true }),
                    stroke: "#50C7E0",
                    strokeThickness: 2
                })
            );
            sciChartSurface.chartModifiers.add(
                new CursorModifier({ showTooltip: true }),
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

- The partial sum is an `XyDataSeries` of times and values, drawn by a `FastLineRenderableSeries`. A few thousand points per period are enough to show the Gibbs ripple even at 100 harmonics.
- The harmonic spectrum is a `FastImpulseRenderableSeries` (a stem chart) with an `EllipsePointMarker` on each stem. A second impulse series in grey shows the harmonics the sum leaves out.
- The individual harmonics share one `XyDataSeries`, separated by `NaN` values that the line series draws as gaps, so they need only one legend entry.
- To update the chart live, keep the data series and call `clear()` then `appendRange()` with the new values, as the example's `update()` function does. SciChart.js redraws on the next frame.

**See it in the demo app:** [JavaScript audio spectrum analyzer chart](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example) · [React audio spectrum analyzer chart](https://www.scichart.com/demo/react/audio-analyzer-fft-example) · [Angular audio spectrum analyzer chart](https://www.scichart.com/demo/angular/audio-analyzer-fft-example). It analyses live audio from your microphone, where you can see the harmonics of your own voice or an instrument.

**Go deeper:** [SciChart.js impulse (stem) series documentation](/2d-charts/chart-types/fast-impulse-renderable-series/), the [line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), and the [FFT guide](/learn/signal-processing/fast-fourier-transform/) for measuring the spectrum of real signals.

## Frequently asked questions

### What is the Fourier series formula?

For a signal $f(t)$ that repeats every $T$ seconds, with fundamental angular frequency $\omega_0 = 2\pi/T$, the Fourier series is $f(t) = a_0/2 + \sum_{n=1}^{\infty} (a_n \cos n\omega_0 t + b_n \sin n\omega_0 t)$. The coefficients are $a_n = \frac{2}{T}\int_0^T f(t)\cos(n\omega_0 t)\,dt$ and $b_n = \frac{2}{T}\int_0^T f(t)\sin(n\omega_0 t)\,dt$. The term $a_0/2$ is the signal's average value.

### What is the Fourier series of a square wave?

A square wave that is +1 for the first half of each period and −1 for the second half has the Fourier series $\frac{4}{\pi}(\sin \omega_0 t + \frac{1}{3}\sin 3\omega_0 t + \frac{1}{5}\sin 5\omega_0 t + \cdots)$. It contains only odd harmonics, and the amplitude of harmonic $n$ is $4/(n\pi)$, so it falls as $1/n$. The fundamental alone carries about 81% of the wave's power.

### What is the difference between a Fourier series and a Fourier transform?

A Fourier series describes a periodic signal as a sum of sine waves at whole-number multiples of its repeat frequency, so its spectrum is a set of separate lines. A Fourier transform works on signals that don't repeat and gives a continuous spectrum. For sampled data, the discrete Fourier transform (DFT) plays both roles: it treats a block of samples as one period of a repeating signal.

### What is the Gibbs phenomenon?

The Gibbs phenomenon is the overshoot a Fourier series makes next to a jump in the signal. However many harmonics you add, the partial sum overshoots by about 9% of the jump on each side; more harmonics only squeeze the ripple closer to the jump. Smoothing the coefficients, for example with Lanczos sigma factors, reduces the overshoot to around 1%, at the cost of a less steep edge.

### How do I find Fourier series coefficients from measured data?

Sample exactly one period (or a whole number of periods) of the signal at $M$ evenly spaced points and take its discrete Fourier transform. Bin $n$ of the DFT divided by $M$ approximates the complex coefficient $c_n$, so $a_n$ is $2/M$ times the real part of $X[n]$ and $b_n$ is minus $2/M$ times its imaginary part. The approximation is good while $n$ is well below $M/2$ and the sample rate is high enough to avoid aliasing.

### How do I plot a Fourier series in JavaScript?

Compute the coefficients $a_n$ and $b_n$, evaluate the partial sum $a_0/2 + \sum_{n=1}^{N} (a_n \cos n\omega_0 t + b_n \sin n\omega_0 t)$ at a few thousand time points, and plot the result as a line. With SciChart.js, put the times and values in an `XyDataSeries` and draw them with a `FastLineRenderableSeries`; draw the harmonic amplitudes with a `FastImpulseRenderableSeries`. In React or Angular, create the same charts inside `scichart-react`'s `SciChartReact` or `scichart-angular`'s `ScichartAngularComponent`.

## Sources

- Fourier, J. (1822), *Théorie analytique de la chaleur*. Paris: Firmin Didot. The origin of Fourier series ([English translation, 1878, at the Internet Archive](https://archive.org/details/analyticaltheory00fourrich)).
- Oppenheim, A. V. and Willsky, A. S. with Nawab, S. H. (1997), *Signals and Systems*, 2nd edition, Prentice Hall, chapter 3, Fourier Series Representation of Periodic Signals. Trigonometric and complex forms, convergence and the discrete-time Fourier series.
- Smith, S. W., *The Scientist and Engineer's Guide to Digital Signal Processing*: [chapter 13, Continuous Signal Processing: The Fourier Series](https://www.dspguide.com/ch13/4.htm) and [chapter 8, The Discrete Fourier Transform](https://www.dspguide.com/ch8.htm).
- Osgood, B., [The Fourier Transform and its Applications](https://see.stanford.edu/materials/lsoftaee261/book-fall-07.pdf), lecture notes for EE 261, Stanford University. Chapter 1 covers Fourier series, orthogonality, convergence and the Gibbs phenomenon.
- Gibbs, J. W. (1899), [Fourier's Series](https://doi.org/10.1038/059606a0). *Nature*, 59, 606. And Hewitt, E. and Hewitt, R. E. (1979), [The Gibbs-Wilbraham phenomenon: an episode in Fourier analysis](https://doi.org/10.1007/BF00330404). *Archive for History of Exact Sciences*, 21, 129–160. The overshoot and its history, including Wilbraham's 1848 description.
- Lanczos, C. (1956), *Applied Analysis*, Prentice Hall. The sigma factors for reducing Gibbs overshoot.

<LearnCta position="bottom" chart="Fourier series grapher" demo="audio-analyzer-fft-example" demoLabel="audio spectrum analyzer chart" docs="/2d-charts/chart-types/fast-impulse-renderable-series/" docsLabel="SciChart.js impulse (stem) series documentation" />
