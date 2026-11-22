---
sidebar_position: 20
sidebar_label: Autocorrelation and Cross-Correlation
title: "Autocorrelation and Cross-Correlation: How to Read Them"
description: "Autocorrelation and cross-correlation explained: the formulas, a worked example, how to read an ACF plot, finding a period or a time delay, and fast correlation with the FFT. Live example."
keywords:
    [
        "autocorrelation",
        "what is autocorrelation",
        "autocorrelation function",
        "autocorrelation formula",
        "autocorrelation plot",
        "acf plot",
        "correlogram",
        "cross correlation",
        "cross-correlation function",
        "normalized cross correlation",
        "time delay estimation",
        "autocorrelation vs cross-correlation",
        "correlation vs convolution",
        "positive autocorrelation",
        "negative autocorrelation"
    ]
image: /img/learn/autocorrelation-og.png
related: [convolution, power-spectral-density, fast-fourier-transform, hilbert-transform]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is autocorrelation in simple terms?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Autocorrelation measures how much a signal or time series resembles a delayed copy of itself. You shift the copy by a lag, multiply the overlapping values, add them up and scale the result so that a perfect match is 1. Doing this for every lag shows whether the data repeats, and how strongly each value depends on the ones before it." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between autocorrelation and cross-correlation?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Autocorrelation compares a signal with shifted copies of itself, so it reveals repetition: a period, a pitch or a seasonal cycle. Cross-correlation compares two different signals at every shift, so it reveals how far one lags the other, or where a known pattern appears inside a longer recording. Autocorrelation is cross-correlation with both inputs set to the same signal." }
                },
                {
                    "@type": "Question",
                    "name": "What do positive and negative autocorrelation mean?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Positive autocorrelation at lag 1 means high values tend to follow high values and low follow low, so the series moves in runs, as temperatures and many prices do. Negative autocorrelation means a high value tends to be followed by a low one, so the series zigzags. A value near zero means one sample tells you little about the next." }
                },
                {
                    "@type": "Question",
                    "name": "Why is autocorrelation a problem in regression?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Ordinary least squares assumes the errors are independent. When the residuals are autocorrelated, the coefficients are still unbiased, but their standard errors are usually too small, so confidence intervals are too narrow and results look more significant than they are. Check the residuals with an ACF plot or a Durbin-Watson or Ljung-Box test, and model the dependence if it is there." }
                },
                {
                    "@type": "Question",
                    "name": "How do I match numpy.correlate, MATLAB xcorr or pandas autocorr?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Mind the argument order, the output mode and the scaling. numpy.correlate(y, x, mode='full') and MATLAB xcorr(y, x) both peak at a positive lag when y is a delayed copy of x; swap the arguments and the result is mirrored. Neither removes the mean: subtract it first, or use MATLAB xcov. numpy's default mode is 'valid', which returns only fully overlapping lags. For an ACF that matches the biased estimate on this page, use statsmodels acf or xcorr with the 'biased' option on the mean-removed data, divided by its value at lag 0. pandas Series.autocorr(lag) is different again: it is the Pearson correlation between the series and its shifted self, so it uses the means and spreads of the overlapping parts only." }
                },
                {
                    "@type": "Question",
                    "name": "How do I calculate autocorrelation in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Subtract the mean, then for each lag k add up x[n] times x[n + k] over every n where both exist, divide by the number of samples N, and divide every lag by the value at lag 0 so it starts at 1. That is two nested loops. For long signals, use an FFT: zero-pad to at least 2N − 1 samples, transform, take the squared magnitude, and transform back." }
                }
            ]
        })}
    </script>
</head>

# Autocorrelation and Cross-Correlation

## What is autocorrelation?

**Autocorrelation** (also called **serial correlation**) measures how similar a signal or time series is to a delayed copy of itself, at every possible delay, or **lag**. **Cross-correlation** does the same for two different signals. Both shift one series along the other, multiply the overlapping values and add them up; a high result means a good match at that lag.

![Two linked charts in a dark navy theme: a noisy repeating waveform with a shifted copy at the top, and its autocorrelation against lag at the bottom, with a green line marking the first repeat at 8 ms](/img/learn/autocorrelation-og.png)

*A noisy 125 Hz voice-like signal (top) and its autocorrelation (bottom): the first peak after lag 0 sits at its period, 8 ms. [Try the interactive version](#how-to-calculate-and-chart-autocorrelation-in-javascript-react-or-angular), where you can change the pitch, the noise and the lag, or switch to finding a delay.*

:::tip Key takeaways
- Correlation answers one question at every lag: how well do these two series match when one is shifted by this much?
- Autocorrelation finds repetition: a signal's period, a voice's pitch, a heart rate or a seasonal cycle.
- Cross-correlation finds delay: the peak's lag is how far one signal trails the other, which is how sonar, GPS and echo location measure distance.
- An ACF plot (correlogram) shows the autocorrelation at each lag, with a band of about $\pm 1.96/\sqrt{N}$ that pure noise stays inside.
- It's convolution without the flip, so the FFT can compute it fast, and the autocorrelation's Fourier transform is the power spectrum.
:::

## How autocorrelation and cross-correlation work: shift, multiply and sum

Take a signal and lay a copy of it on top. At a lag of zero the two are identical, so every product is a value times itself, and the sum is as large as it can be. Now slide the copy along by one sample and do it again: multiply each value by the value now underneath it, and add the products. Repeat for lag 2, lag 3 and so on.

- Where the peaks of the copy land on peaks of the original, the products are large and positive, and the sum is high: a match.
- Where peaks land on troughs, the products are negative: an anti-match.
- Where the two have nothing to do with each other, positive and negative products cancel out, and the sum is near zero.

A repeating signal matches itself again each time the copy has moved by a whole period, so its autocorrelation rises to a new peak at the period, twice the period and so on. The period is the lag of the first peak after lag 0.

![Three panels: a signal of three spikes three samples apart, a copy of it shifted by three samples whose spikes line up with the original, and the autocorrelation at lags 0 to 8, which is 1 at lag 0, negative at lags 1 and 2, and peaks at lag 3 and again at lag 6](./autocorrelation-shift-multiply-sum.svg)

Cross-correlation slides a different signal along instead. If $y$ is a recording that contains a delayed copy of $x$, sliding $x$ along $y$ gives a peak at the lag where the copy sits. That lag is the delay.

Correlation is [convolution](/learn/signal-processing/convolution/) without the flip. Convolution also slides, multiplies and sums, but it reverses the kernel first. Correlation leaves it the right way round, because the question is different: convolution models what a system does to a signal, while correlation measures how alike two signals are at each shift.

## The autocorrelation formula

For $N$ samples $x_0 \ldots x_{N-1}$ with mean $\bar{x}$, the **sample autocovariance** at lag $k$ is the sum of products of the mean-removed signal and a copy shifted by $k$:

$$
c_k = \frac{1}{N} \sum_{n=0}^{N-1-k} (x_n - \bar{x})(x_{n+k} - \bar{x})
$$

Only $N - k$ pairs overlap at lag $k$, so the sum stops at $N - 1 - k$. Dividing every lag by its value at lag 0 (the variance) gives the **autocorrelation function (ACF)**, which runs from $-1$ to $1$:

$$
r_k = \frac{c_k}{c_0}
$$

### Biased vs unbiased autocorrelation

The formula above divides by $N$ at every lag, even though fewer products are summed as the lag grows. This is the **biased** estimate, the standard one in statistics and the one an ACF plot normally shows. Because it divides by more than the number of products, it shrinks towards zero at large lags. The **unbiased** estimate divides by $N - k$ instead, which removes the taper but makes large lags noisy, since they average only a few products. Use lags up to about $N/4$ with either.

Cross-correlation of a reference $x$ with a second signal $y$ uses the same sum with two different series. In the convention used on this page, lag $\ell$ means "$y$ shifted back by $\ell$":

$$
r_{xy}[\ell] = \sum_{n} x[n]\, y[n+\ell]
$$

If $y$ is $x$ delayed by $D$ samples, this peaks at $\ell = D$. Dividing by $\sqrt{\sum x^2 \sum y^2}$, after removing the means, scales it from $-1$ to $1$. When you search for a short pattern in a long recording, the **normalised cross-correlation** goes one step further: at each lag it computes the Pearson correlation coefficient between the pattern and the stretch of signal underneath it, so a quiet echo and a loud one both score near 1 if their shapes match.

For a function of continuous time, the sum becomes an integral: $R_{xx}(\tau) = \int x(t)\, x(t+\tau)\, dt$, where $\tau$ is the lag. For a random process, it is defined as an expected value instead, $E[x(t)\, x(t+\tau)]$; the formulas above estimate it from one recording.

## Autocorrelation example, step by step

Take nine samples with a spike every three: $x = [0, 3, 0, 0, 3, 0, 0, 3, 0]$. Its mean is 1, so the mean-removed signal is $[-1, 2, -1, -1, 2, -1, -1, 2, -1]$, and the sum of its squares, the lag-0 sum, is 18.

| Lag k | Pairs summed (N − k) | Sum of products | Biased r[k] (sum ÷ 18) | Unbiased r[k] |
| --- | --- | --- | --- | --- |
| 0 | 9 | 18 | 1.00 | 1.00 |
| 1 | 8 | −10 | −0.56 | −0.63 |
| 2 | 7 | −5 | −0.28 | −0.36 |
| 3 | 6 | 12 | 0.67 | 1.00 |
| 4 | 5 | −7 | −0.39 | −0.70 |
| 5 | 4 | −2 | −0.11 | −0.25 |
| 6 | 3 | 6 | 0.33 | 1.00 |

The unbiased column divides each sum by its own number of pairs, then by the lag-0 value on the same basis (18 ÷ 9 = 2). So at lag 3 it is $(12 \div 6) \div 2 = 1$.

The ACF is 1 at lag 0, goes negative while the spikes are out of step, and peaks at lag 3, so the period is 3 samples. It peaks again at lag 6, at twice the period.

The signal repeats perfectly, so the unbiased estimate gives exactly 1 at every multiple of the period, while the biased one tapers (0.67, then 0.33) because it divides 6 and then 3 products by 9. The biased version is still the usual choice for finding periods and estimating spectra: it is less noisy at large lags, and it always gives a valid (positive semi-definite) autocorrelation, which the unbiased one does not.

## Properties of autocorrelation

Autocorrelation is largest at lag 0, symmetric about it, and periodic when the signal is.

| Property | In symbols | What it means in practice |
| --- | --- | --- |
| Highest at lag 0 | $\lvert r_k \rvert \le r_0 = 1$ | Nothing matches a signal better than itself, unshifted |
| Symmetric | $r_{-k} = r_k$ | Shifting left or right gives the same result, so ACF plots show only positive lags |
| Periodic in, periodic out | $x$ repeats every $P$ ⇒ $r$ peaks at $P, 2P, \ldots$ | The lag of the first peak is the period; its inverse is the frequency or pitch |
| White noise gives a spike | $r_0 = 1$, $r_k \approx 0$ for $k \neq 0$ | Random noise matches itself only at lag 0, so correlation pulls repeating patterns out of noise |
| No phase | Only the power at each frequency matters | Two signals with the same spectrum but different phases have the same autocorrelation |
| Cross-correlation flips with order | $r_{xy}[\ell] = r_{yx}[-\ell]$ | Swapping the two signals mirrors the result about lag 0 |
| Wiener–Khinchin theorem | $\mathcal{F}\{r_{xx}\} = \lvert X(f) \rvert^2$ | The Fourier transform of the autocorrelation is the power spectrum |

## How to read an autocorrelation plot (ACF plot or correlogram)

An **ACF plot**, also called a **correlogram**, draws the autocorrelation as a bar or stem at each lag, starting at 1 for lag 0. Statistics software adds a shaded band, usually at

$$
\pm \frac{1.96}{\sqrt{N}}
$$

which is where 95% of the bars would fall if the series were pure white noise. For 400 observations that's about $\pm 0.1$. Bars outside the band are unlikely to be chance. Some tools widen the band at larger lags, using Bartlett's formula, to allow for the bars before them.

Reading the bars assumes the series is **stationary**: its mean and variance don't change over time.

| What you see | What it suggests |
| --- | --- |
| One bar at lag 0, everything else inside the band | White noise: no memory, nothing left to model |
| High at lag 1 and decaying slowly over many lags | A trend or a slowly wandering (non-stationary) series. Difference it (take each value minus the one before) and look again |
| Peaks repeating at a regular lag, such as 12 for monthly data or 7 for daily | Seasonality or a period: the lag of the peaks is the cycle length |
| Positive at lag 1, then dying away quickly | Positive autocorrelation: values come in runs (an autoregressive, or AR, process) |
| Negative at lag 1, signs alternating | Negative autocorrelation: the series zigzags, each high followed by a low |
| A few significant lags, then a sharp cut to zero after lag q | A moving-average process of order q, MA(q) |

A trend breaks that assumption: it dominates the plot and hides everything else, so remove it before reading the ACF for anything subtler.

### Partial autocorrelation (PACF)

The partial autocorrelation (PACF) measures the link between values $k$ steps apart after removing the effect of the lags in between. A PACF that cuts off sharply after lag $p$ points to an autoregressive model of order $p$, AR(p). Time-series modellers read the ACF and PACF together to choose an ARIMA model.

### Ljung–Box and Durbin–Watson tests

The **Ljung–Box test** checks whether a group of lags is, taken together, larger than noise would give. The **Durbin–Watson statistic**, used on regression residuals, runs from 0 to 4 and is roughly $2(1 - r_1)$: about 2 means no lag-1 autocorrelation, near 0 strong positive, near 4 strong negative.

## Cross-correlation and time-delay estimation

To measure a delay, cross-correlate the signal you sent, or recorded at one point, with the signal received later, or recorded at another. The lag of the highest peak is the delay. Multiply it by the speed of the wave and you have a distance.

- Sonar, radar and ultrasound send a known pulse, often a **chirp** that sweeps through a range of frequencies, and cross-correlate the echo with it. A chirp's autocorrelation has one narrow main peak, so its echoes give sharp, unambiguous peaks. Taking the [envelope](/learn/signal-processing/hilbert-transform/) of the correlation output turns each echo's ripple into one smooth peak that is easy to time.
- GPS receivers correlate the incoming signal with a local copy of each satellite's code. The lag of the peak gives the signal's travel time, and from several satellites, the receiver's position.
- Microphone arrays and leak detectors cross-correlate two sensors. The delay between them shows which side a sound came from, or where along a pipe a leak is.
- Finding a known pattern in noise: cross-correlating a recording with the pattern you expect is a **matched filter**. For a known shape in white noise, it gives the highest possible peak-to-noise ratio, which is why it's used in radar, communications and the detection of gravitational waves.

Whether a delay shows up at $+D$ or $-D$ depends on which signal you shift, and libraries differ (see the FAQ). Test with a signal you have delayed on purpose before trusting the direction.

The peak's lag is a whole number of samples. For sub-sample accuracy, fit a parabola through the highest point and its two neighbours: its vertex estimates where the true peak lies between samples.

## What autocorrelation and cross-correlation are used for

Autocorrelation finds repeats within one signal; cross-correlation finds where one signal appears in another.

- Pitch detection: a voiced sound repeats once per vocal-fold cycle, so the first autocorrelation peak gives the pitch. [Rabiner (1977)](#sources) describes autocorrelation pitch detection for speech.
- Heart rate: an ECG repeats once per beat. The lag of the first autocorrelation peak is the time between beats, and 60 divided by it (in seconds) is beats per minute.
- Seasonality in time series: sales, energy use, web traffic and temperatures repeat daily, weekly or yearly, and the ACF shows at which lags.
- Checking a model: if a forecast's errors are still autocorrelated, the model has missed a pattern.
- Vibration and machine monitoring: autocorrelation picks a rotating part's period out of noisy vibration data.
- Time delay and position: sonar, radar, GPS, seismology and acoustic source location, by cross-correlation.
- Image matching: normalised cross-correlation finds where a small template image appears in a larger one, and how far an image has moved between frames.
- Spectral analysis: the Fourier transform of the autocorrelation is the power spectrum, one of the classic ways to estimate it.

## Fast correlation with the FFT

Direct correlation of $N$ samples at every lag takes about $N^2$ multiplications. As with convolution, the [FFT](/learn/signal-processing/fast-fourier-transform/) is much faster for long signals. Correlation in time is multiplication in frequency, with one spectrum conjugated:

1. Remove the mean, and zero-pad the signal to at least $2N - 1$ samples (usually rounded up to a power of 2).
2. Take the FFT, $X(f)$.
3. Multiply each bin by its complex conjugate, giving the power spectrum $\lvert X(f) \rvert^2$.
4. Take the inverse FFT. The first $N$ values are the autocorrelation sums at lags 0 to $N - 1$; divide by $N$ and by the value at lag 0 as before.

For cross-correlation, multiply $\overline{X(f)}$ by $Y(f)$ in step 3. That costs on the order of $N \log N$ operations instead of $N^2$.

![Two routes from the mean-removed signal x[n] (N = 9 samples, the example above) to the same lag sums 18, −10, −5, 12, −7, −2, 6, −4 and 1 at lags 0 to 8. Route 1, direct: c[k] = Σ x[n] · x[n + k], about N² multiplications. Route 2, fast correlation: zero-pad to length L of at least 2N − 1 (here 32), take the FFT X[k], multiply each bin by its complex conjugate to get |X[k]|² (highlighted, the one step that differs from fast convolution; for cross-correlation multiply X*[k] by Y[k]), then take the inverse FFT and keep lags 0 to N − 1. Adapted from Burnett-Thompson (2007)](./correlation-direct-vs-fft.svg)

*Adapted from [Burnett-Thompson (2007)](#sources). Compare the same pipeline for [convolution](/learn/signal-processing/convolution/#the-convolution-theorem): only step 3 changes.*

Zero-pad the signal, or the copy wraps around. Without padding, the FFT treats the signal as if it repeated forever, so the end of the signal is compared with its start, and every lag picks up products that don't belong. Padding to $2N - 1$ leaves enough empty space for the largest lag.

Step 3 is also the **Wiener–Khinchin theorem** at work: the autocorrelation and the power spectrum are a Fourier transform pair (see [power spectral density](/learn/signal-processing/power-spectral-density/)). So the autocorrelation carries the same information as the power spectrum, read in time rather than frequency, and you can estimate either one from the other.

## Autocorrelation vs cross-correlation, convolution and the correlation coefficient

All four multiply two sequences and add up the products; they differ in which sequences, whether one is flipped, and whether the result is one number or a function of lag.

| | Autocorrelation | Cross-correlation | Convolution | Pearson correlation coefficient |
| --- | --- | --- | --- | --- |
| Inputs | One signal, against itself | Two signals | A signal and a kernel (impulse response) | Two sets of paired values |
| Shifted? | Yes, at every lag | Yes, at every lag | Yes, with the kernel flipped | No: one number for the pairs as they are |
| Output | A function of lag, 1 at lag 0 | A function of lag | A new signal, N + M − 1 samples long | A single value from −1 to 1 |
| Answers | Does it repeat, and how far back does it remember? | How far apart are these two, or where is this pattern? | What does this system do to this signal? | How strongly do these two move together? |
| Typical use | Period, pitch, heart rate, seasonality, residual checks | Time delay, echo location, template matching, GPS | Filtering, smoothing, reverb, blurring | Comparing two variables, such as height and weight |

The autocorrelation at one lag is almost the Pearson correlation between a series and its shifted self; the difference is that the ACF uses the whole series' mean and variance for both parts. Cross-correlation is convolution with one signal reversed. And autocorrelation is cross-correlation of a signal with itself.

## Common autocorrelation and cross-correlation mistakes

Most correlation mistakes come from skipping the preparation (removing the mean, choosing the estimate) or from over-reading noisy peaks.

- **Not removing the mean.** A signal sitting at an offset, such as a temperature around 20 °C, correlates strongly with itself at every lag simply because all the products are positive. Subtract the mean first, or the ACF tells you about the offset rather than the pattern.
- **Reading a trend as memory.** A rising or falling series gives an ACF that decays slowly over dozens of lags. Remove the trend, or difference the series, before you look for anything else.
- **Mixing up biased and unbiased estimates.** The biased ACF tapers at large lags; the unbiased one doesn't, but it gets noisy near the end. Two tools disagreeing at large lags often comes down to this.
- **Trusting very large lags.** At lag $k$ only $N - k$ pairs are compared, so the last lags rest on a handful of products. Keep to about $N/4$ for interpretation.
- **FFT correlation without zero-padding.** The result wraps around and mixes the end of the signal into the start. Pad to at least $2N - 1$ samples.
- **Confusing the sign of the lag.** Swapping the two inputs mirrors a cross-correlation, so a delay of $+D$ appears at $-D$. Test with a known delay.
- **Picking the wrong peak.** Lag 0 is always the highest, and a periodic signal also peaks at two and three times its period. Look for the first strong peak after the curve first dips below zero.
- **Treating a band crossing as proof.** With 40 lags and a 95% band, about two bars will cross it by chance. Look for a pattern, or use a test across several lags.

## How to calculate and chart autocorrelation in JavaScript, React or Angular

The demo takes 1,000-sample signals (125 ms at 8,000 samples per second) and recomputes their correlation at up to 500 lags whenever you move a slider, using the plain JavaScript functions in the code.

- **Autocorrelation: find the period.** Change the voice-like signal's **pitch** and **noise**; the green line marks the detected period, and the line above the chart compares it with the true one. Switch the **estimate** between biased and unbiased to see the taper appear and disappear.
- **Cross-correlation: find the delay.** A chirp is hidden in noise at the **delay** you set. Raise the **noise** until a noise peak beats the echo and the estimate goes wrong.
- Move **Lag** to slide the orange copy along the top chart, and watch the correlation at that lag, marked by the dashed line below. Hover over the bottom chart for values, scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={680} name="./Basic/demo" />

<LearnCta position="top" chart="autocorrelation chart" demo="vital-signs-ecg-medical-chart-example" demoLabel="ECG vital signs chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for this example. The JavaScript tab includes the correlation, peak-finding and test-signal functions; the React and Angular tabs reuse `autocorrelation` and chart an ACF plot of your own data with its 95% band.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        FastImpulseRenderableSeries,
        XyDataSeries,
        HorizontalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } from "scichart";
    // removeMean and autocorrelation: copy them from the JavaScript tab
    import { autocorrelation } from "./correlation";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Lag" }));
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Autocorrelation", visibleRange: new NumberRange(-1.1, 1.1) })
        );

        // An ACF plot (correlogram): one stem per lag, up to about N / 4
        const values = getYourTimeSeries(); // e.g. daily readings
        const maxLag = Math.floor(values.length / 4);
        const acf = autocorrelation(values, maxLag, false);
        sciChartSurface.renderableSeries.add(
            new FastImpulseRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: acf.map((_, k) => k), yValues: acf }),
                stroke: "#50C7E0",
                fill: "#50C7E0",
                size: 6
            })
        );
        // The 95% band for white noise: +-1.96 / sqrt(N)
        const band = 1.96 / Math.sqrt(values.length);
        sciChartSurface.annotations.add(
            new HorizontalLineAnnotation({ y1: band, stroke: "#FFFFFF88", strokeDashArray: [2, 4] }),
            new HorizontalLineAnnotation({ y1: -band, stroke: "#FFFFFF88", strokeDashArray: [2, 4] })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        return { sciChartSurface };
    };

    export const AcfPlot = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        FastImpulseRenderableSeries,
        XyDataSeries,
        HorizontalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EXyDirection
    } from "scichart";
    // removeMean and autocorrelation: copy them from the JavaScript tab
    import { autocorrelation } from "./correlation";

    @Component({
        selector: "app-acf-plot",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class AcfPlotComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Lag" }));
            sciChartSurface.yAxes.add(
                new NumericAxis(wasmContext, { axisTitle: "Autocorrelation", visibleRange: new NumberRange(-1.1, 1.1) })
            );

            // An ACF plot (correlogram): one stem per lag, up to about N / 4
            const values = getYourTimeSeries(); // e.g. daily readings
            const maxLag = Math.floor(values.length / 4);
            const acf = autocorrelation(values, maxLag, false);
            sciChartSurface.renderableSeries.add(
                new FastImpulseRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: acf.map((_, k) => k), yValues: acf }),
                    stroke: "#50C7E0",
                    fill: "#50C7E0",
                    size: 6
                })
            );
            // The 95% band for white noise: +-1.96 / sqrt(N)
            const band = 1.96 / Math.sqrt(values.length);
            sciChartSurface.annotations.add(
                new HorizontalLineAnnotation({ y1: band, stroke: "#FFFFFF88", strokeDashArray: [2, 4] }),
                new HorizontalLineAnnotation({ y1: -band, stroke: "#FFFFFF88", strokeDashArray: [2, 4] })
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

- Both charts are ordinary SciChart.js line charts: an `XyDataSeries` of lags and correlation values, drawn by a `FastLineRenderableSeries`. For a classic correlogram with a few dozen lags, use a `FastImpulseRenderableSeries` (stems), as in the React and Angular tabs.
- To update live, keep the data series and call `clear()` then `appendRange()` with the new values, as the example's `update()` function does. SciChart.js redraws on the next frame.
- `VerticalLineAnnotation` marks the detected peak and the chosen lag; `HorizontalLineAnnotation` draws the $\pm 1.96/\sqrt{N}$ band. Change an annotation's `x1` or `y1` to move it.
- The correlation itself is plain JavaScript. For long signals, swap in an FFT-based version; the chart code stays the same.

### Cross-correlation without a chart library

If you only need the numbers, the full cross-correlation is two loops. This uses the same convention as the formula above, so a copy of `x` delayed by `D` samples peaks at lag `D`. It returns the same values as `numpy.correlate(y, x, mode="full")`:

```js
// r[lag] = sum over n of x[n] * y[n + lag], for lags -(x.length - 1) to y.length - 1
function crossCorrelate(x, y) {
    const lags = [];
    const values = [];
    for (let lag = -(x.length - 1); lag <= y.length - 1; lag++) {
        let sum = 0;
        for (let n = Math.max(0, -lag); n < x.length && n + lag < y.length; n++) sum += x[n] * y[n + lag];
        lags.push(lag);
        values.push(sum);
    }
    return { lags, values };
}

crossCorrelate([1, 2, 1], [0, 0, 1, 2, 1]); // values [0, 0, 1, 4, 6, 4, 1] at lags -2 to 4: peak at lag 2
```

**See it in the demo app:** [JavaScript ECG vital signs chart](https://www.scichart.com/demo/javascript/vital-signs-ecg-medical-chart-example) · [React ECG vital signs chart](https://www.scichart.com/demo/react/vital-signs-ecg-medical-chart-example) · [Angular ECG vital signs chart](https://www.scichart.com/demo/angular/vital-signs-ecg-medical-chart-example), a real-time vital signs monitor with ECG, blood pressure and oxygen traces: the kind of periodic signal autocorrelation turns into a heart rate. For live audio, see the [JavaScript audio analyzer with FFT](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example).

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), the [impulse (stem) series](/2d-charts/chart-types/fast-impulse-renderable-series/) for correlograms, and [vertical line annotations](/2d-charts/annotations-api/vertical-line-annotation/) for marking peaks.

## Frequently asked questions

### What is autocorrelation in simple terms?

Autocorrelation measures how much a signal or time series resembles a delayed copy of itself. You shift the copy by a lag, multiply the overlapping values, add them up and scale the result so that a perfect match is 1. Doing this for every lag shows whether the data repeats, and how strongly each value depends on the ones before it.

### What is the difference between autocorrelation and cross-correlation?

Autocorrelation compares a signal with shifted copies of itself, so it reveals repetition: a period, a pitch or a seasonal cycle. Cross-correlation compares two different signals at every shift, so it reveals how far one lags the other, or where a known pattern appears inside a longer recording. Autocorrelation is cross-correlation with both inputs set to the same signal.

### What do positive and negative autocorrelation mean?

Positive autocorrelation at lag 1 means high values tend to follow high values and low follow low, so the series moves in runs, as temperatures and many prices do. Negative autocorrelation means a high value tends to be followed by a low one, so the series zigzags. A value near zero means one sample tells you little about the next.

### Why is autocorrelation a problem in regression?

Ordinary least squares assumes the errors are independent. When the residuals are autocorrelated, the coefficients are still unbiased, but their standard errors are usually too small, so confidence intervals are too narrow and results look more significant than they are. Check the residuals with an ACF plot or a Durbin-Watson or Ljung-Box test, and model the dependence if it is there.

### How do I match numpy.correlate, MATLAB xcorr or pandas autocorr?

Mind the argument order, the output mode and the scaling. `numpy.correlate(y, x, mode='full')` and MATLAB `xcorr(y, x)` both peak at a positive lag when `y` is a delayed copy of `x`; swap the arguments and the result is mirrored. Neither removes the mean: subtract it first, or use MATLAB `xcov`. numpy's default mode is `'valid'`, which returns only fully overlapping lags. For an ACF that matches the biased estimate on this page, use statsmodels `acf` or `xcorr` with the `'biased'` option on the mean-removed data, divided by its value at lag 0. pandas `Series.autocorr(lag)` is different again: it is the Pearson correlation between the series and its shifted self, so it uses the means and spreads of the overlapping parts only.

### How do I calculate autocorrelation in JavaScript?

Subtract the mean, then for each lag k add up x[n] times x[n + k] over every n where both exist, divide by the number of samples N, and divide every lag by the value at lag 0 so it starts at 1. That is two nested loops. For long signals, use an FFT: zero-pad to at least 2N − 1 samples, transform, take the squared magnitude, and transform back.

## Sources

- Smith, S. W., *The Scientist and Engineer's Guide to Digital Signal Processing*: [chapter 7, Properties of Convolution](https://www.dspguide.com/ch7/3.htm) (correlation, and matched filtering of a known pattern) and [chapter 18, FFT Convolution](https://www.dspguide.com/ch18.htm).
- NIST/SEMATECH, *e-Handbook of Statistical Methods*: [Autocorrelation](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35c.htm) and [Autocorrelation Plot](https://www.itl.nist.gov/div898/handbook/eda/section3/autocopl.htm), including the confidence band.
- Hyndman, R. J. and Athanasopoulos, G., *Forecasting: Principles and Practice*, 3rd ed., [section 2.8, Autocorrelation](https://otexts.com/fpp3/acf.html) and [section 2.9, White noise](https://otexts.com/fpp3/wn.html).
- Box, G. E. P., Jenkins, G. M., Reinsel, G. C. and Ljung, G. M., *Time Series Analysis: Forecasting and Control*, 5th ed., Wiley, 2015. The sample ACF and PACF, and model identification.
- Rabiner, L. R. (1977), [On the Use of Autocorrelation Analysis for Pitch Detection](https://doi.org/10.1109/TASSP.1977.1162905). *IEEE Transactions on Acoustics, Speech, and Signal Processing*, 25(1), 24–33.
- Knapp, C. H. and Carter, G. C. (1976), [The Generalized Correlation Method for Estimation of Time Delay](https://doi.org/10.1109/TASSP.1976.1162830). *IEEE Transactions on Acoustics, Speech, and Signal Processing*, 24(4), 320–327.
- Bendat, J. S. and Piersol, A. G., *Random Data: Analysis and Measurement Procedures*, 4th ed., Wiley, 2010. Correlation functions, the Wiener–Khinchin relation and time-delay measurement.
- Burnett-Thompson, A. (2007), *A 3D Local Positioning System to track A Neutrally Buoyant Flow Follower*, PhD thesis, chapter 3. The associated published paper is Burnett-Thompson, A. and York, T. (2007), [*A 3D Acoustic Local Positioning System to Track a Neutrally Buoyant Flow Follower*](https://www.semanticscholar.org/paper/A-3D-Acoustic-Local-Positioning-System-to-Track-a-Burnett-Thompson-York/13e659919f6201ceecdf458643b708d58912841c), IEEE Instrumentation and Measurement Technology Conference (IMTC 2007). The direct-versus-FFT correlation diagram on this page is adapted from it.

<LearnCta position="bottom" chart="autocorrelation chart" demo="vital-signs-ecg-medical-chart-example" demoLabel="ECG vital signs chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
