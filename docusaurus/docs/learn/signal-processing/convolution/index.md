---
sidebar_position: 50
sidebar_label: Convolution
title: "Convolution: Formula and Step-by-Step Example (Interactive Calculator)"
description: "Convolution explained: flip, slide, multiply and sum, the discrete and continuous formulas, a worked example, its properties and the convolution theorem, with a live calculator."
keywords:
    [
        "convolution",
        "what is convolution",
        "convolution formula",
        "convolution theorem",
        "convolution integral",
        "convolution example",
        "convolution properties",
        "convolution calculator",
        "1d convolution",
        "discrete convolution",
        "convolution vs cross-correlation"
    ]
image: /img/learn/convolution-og.png
related: [fourier-transform, autocorrelation, low-pass-filter, high-pass-filter]
datePublished: 2026-11-19
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is convolution in simple terms?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Convolution is a sliding weighted sum. You take a short list of weights, called the kernel, and slide it along a signal. At each position you multiply the overlapping values and add them up, giving one output value. A kernel of equal weights gives a moving average; other kernels sharpen, delay, echo or detect edges." }
                },
                {
                    "@type": "Question",
                    "name": "What is the formula for convolution?",
                    "acceptedAnswer": { "@type": "Answer", "text": "For sampled signals, y[n] = Σ x[k] h[n − k], summed over every k: the input x is multiplied by the kernel h, flipped and shifted by n, and the products are added. For continuous signals, the sum becomes an integral: (f ∗ g)(t) = ∫ f(τ) g(t − τ) dτ, taken over all τ." }
                },
                {
                    "@type": "Question",
                    "name": "What is the convolution theorem?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The convolution theorem says that convolving two signals in time is the same as multiplying their Fourier transforms in frequency. So you can convolve by taking the FFT of both signals, multiplying the results bin by bin and taking the inverse FFT. For long kernels, that takes far fewer operations than direct convolution." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between convolution and cross-correlation?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Both slide one signal along another and sum the products. Convolution flips the kernel first; cross-correlation doesn't. Convolution answers what a system does to a signal; cross-correlation measures how similar two signals are at each shift, which is how you find a known pattern or a time delay. For a symmetric kernel the two give the same result." }
                },
                {
                    "@type": "Question",
                    "name": "What is convolution in a CNN?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A convolutional neural network slides small two-dimensional kernels, typically 3 by 3 pixels, across an image and sums the products at each position, which is the same operation in two dimensions. The network learns the kernel weights during training. Most deep learning libraries compute cross-correlation, without the flip, and still call it convolution." }
                },
                {
                    "@type": "Question",
                    "name": "How do I calculate a convolution in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Write two nested loops: for each output index n from 0 to N + M − 2, add up x[k] × h[n − k] for every k where both values exist. That is direct convolution, and it is fast enough for short kernels. For long kernels, use an FFT: zero-pad both arrays, transform them, multiply and transform back." }
                }
            ]
        })}
    </script>
</head>

# Convolution

## What is convolution?

**Convolution** is a way of combining two signals into a third: one signal, the **kernel**, is flipped, slid along the other, and at each position the overlapping values are multiplied and summed. It's how a filter, a blur, an echo or any linear system turns an input into an output, and it's written with an asterisk: $y = x * h$.

![Three stacked panels: a noisy input signal drawn as stems, a seven-sample moving-average kernel slid to one position, and the smoothed output signal, in a dark navy theme](/img/learn/convolution-og.png)

*A noisy sine convolved with a seven-sample moving average: the input (top), the kernel slid to one position (middle) and the smoothed output (bottom). [Try the interactive calculator](#how-to-calculate-and-chart-a-convolution-in-javascript-react-or-angular).*

:::tip Key takeaways
- Convolution is a sliding weighted sum: flip the kernel, slide it, multiply, add.
- A system's impulse response is its kernel: convolve any input with it to get the system's output.
- Convolving N samples with M samples gives N + M − 1 output samples.
- The convolution theorem: convolution in time is multiplication in frequency, so the FFT makes long convolutions fast.
- Cross-correlation is the same calculation without the flip; it finds patterns rather than modelling systems.
:::

## How convolution works: flip, slide, multiply and sum

Think of the kernel as a set of weights, and the output as a weighted average of the input around each point. Four steps give one output sample, $y[n]$:

1. Flip the kernel, so its first sample is on the right.
2. Slide it along the input until its last sample sits under position $n$.
3. Multiply each kernel value by the input value directly above it.
4. Sum the products. That total is $y[n]$.

Then move one sample to the right and repeat, for every position where the kernel and the input overlap.

![The kernel h = [0, 1, 0.5] is flipped to [0.5, 1, 0], slid under the input x = [1, 2, 3] so it ends at k = 2, multiplied to give 0.5, 2 and 0, and summed to give y[2] = 2.5](./convolution-flip-slide-multiply-sum.svg)

### Why is the kernel flipped?

Because the kernel is usually an **impulse response**: the output a system gives when the input is a single spike of height 1 (a unit impulse). Its first sample, $h[0]$, is the system's immediate reaction, $h[1]$ is what's left one sample later, and so on. The output now, $y[n]$, is the present input times $h[0]$, plus the previous input times $h[1]$, plus the one before that times $h[2]$. Writing that as a sum over the inputs puts the kernel in reverse order, and that reversal is the flip.

Any **linear, time-invariant (LTI)** system, such as an audio filter, a spring and damper, a room's acoustics or an RC circuit, is completely described by its impulse response. Measure that once, and you can work out the output for any input by convolution.

The moving average is a familiar case. A kernel of five equal weights, each 1/5, replaces every sample with the mean of it and the four before it. That's a convolution, and it's why moving averages smooth noise: each output blends several noisy inputs. Change the weights and you change the filter: a bell-shaped (Gaussian) kernel smooths more gently, a decaying kernel favours recent samples, and a kernel of $[1, -1]$ subtracts each sample's neighbour, which picks out sudden jumps.

## The convolution formula

Discrete convolution, for sampled signals such as audio, sensor readings or prices:

$$
y[n] = (x * h)[n] = \sum_{k=-\infty}^{\infty} x[k]\, h[n-k]
$$

The sum runs over every $k$, but in practice only the values of $k$ where both $x[k]$ and $h[n-k]$ exist contribute. Here $h[n-k]$ is the kernel flipped (the $-k$) and shifted by $n$.

Continuous convolution, the **convolution integral**, for functions of continuous time:

$$
(f * g)(t) = \int_{-\infty}^{\infty} f(\tau)\, g(t-\tau)\, d\tau
$$

It's the same idea with an integral in place of the sum: $g$ is flipped, shifted by $t$, multiplied by $f$, and the area under the product is the output at $t$. The dummy variable $\tau$ plays the role of $k$.

If $x$ has $N$ samples and $h$ has $M$, the full convolution has

$$
N + M - 1
$$

samples. The output starts as soon as the kernel's leading edge touches the input, and ends when its trailing edge leaves it. A 1,000-sample signal and a filter with 31 coefficients (or taps) give 1,030 output samples.

Near the ends, the kernel overhangs the input, and the missing samples are treated as zeros. Libraries usually offer three output sizes: **full** (all $N + M - 1$ samples), **same** (the middle $N$, aligned with the input) and **valid** (only the $N - M + 1$ samples where the kernel lies entirely over real data).

## Convolution example, step by step

Convolve $x = [1, 2, 3]$ with $h = [0, 1, 0.5]$. Both have 3 samples, so the output has $3 + 3 - 1 = 5$.

| n | Flipped kernel lined up under x | Products | y[n] |
| --- | --- | --- | --- |
| 0 | only h[0] overlaps x[0] | 1 × 0 | 0 |
| 1 | h[1] under x[0], h[0] under x[1] | 1 × 1 + 2 × 0 | 1 |
| 2 | h[2] under x[0], h[1] under x[1], h[0] under x[2] | 1 × 0.5 + 2 × 1 + 3 × 0 | 2.5 |
| 3 | h[2] under x[1], h[1] under x[2] | 2 × 0.5 + 3 × 1 | 4 |
| 4 | only h[2] overlaps x[2] | 3 × 0.5 | 1.5 |

So $[1, 2, 3] * [0, 1, 0.5] = [0, 1, 2.5, 4, 1.5]$.

Two quick checks:
- Sum check: the output's total equals the product of the inputs' totals. Here $6 \times 1.5 = 9$, and $0 + 1 + 2.5 + 4 + 1.5 = 9$.
- Shape check: this kernel is "nothing now, all of it one sample later, half of it two samples later". The output is the input delayed by one sample, plus half of it delayed by two.

## Properties of convolution

Convolution behaves like multiplication: order and grouping don't matter, and it spreads over addition.

| Property | Formula | What it means in practice |
| --- | --- | --- |
| Commutative | $x * h = h * x$ | It doesn't matter which one you call the kernel |
| Associative | $(x * h_1) * h_2 = x * (h_1 * h_2)$ | Two filters in a row act like one filter whose kernel is $h_1 * h_2$ |
| Distributive | $x * (h_1 + h_2) = x * h_1 + x * h_2$ | Two filters side by side, outputs added, act like one filter with kernel $h_1 + h_2$ |
| Identity | $x * \delta = x$ | Convolving with a unit impulse $\delta = [1]$ changes nothing |
| Shift | $x * \delta[n - d] = x[n - d]$ | A kernel that is a single impulse at $d$ is a pure delay of $d$ samples |
| Linearity | $(a x_1 + b x_2) * h = a(x_1 * h) + b(x_2 * h)$ | Scale or add inputs and the outputs scale and add the same way |
| Sum | $\sum y = \sum x \cdot \sum h$ | A kernel that sums to 1 keeps the signal's average level |

The associative property is why a chain of filters can be designed, analysed or applied as one. The identity property is also a handy test: feed a unit impulse into any linear system, and what comes out is its kernel.

## The convolution theorem

The **convolution theorem** links convolution to the [Fourier transform](/learn/signal-processing/fourier-transform/). Writing $\mathcal{F}$ for the Fourier transform:

$$
\mathcal{F}\{x * h\} = \mathcal{F}\{x\} \cdot \mathcal{F}\{h\}
$$

Convolution in time is multiplication in frequency, and the reverse holds too: multiplication in time is convolution in frequency.

The Fourier transform of a kernel is its **frequency response**: how much it lets through at each frequency. Convolving with the kernel multiplies the signal's spectrum by that response. A moving-average kernel has a response that is high at low frequencies and small at high ones, so it acts as a [low-pass filter](/learn/signal-processing/low-pass-filter/). A difference kernel such as $[1, -1]$ does the opposite, a simple [high-pass filter](/learn/signal-processing/high-pass-filter/).

### Fast convolution with the FFT

Direct convolution needs about $N \times M$ multiplications. With the [fast Fourier transform (FFT)](/learn/signal-processing/fast-fourier-transform/), you can instead:

1. Zero-pad $x$ and $h$ to the same length $L$, at least $N + M - 1$ (usually rounded up to a power of 2).
2. Take the FFT of both.
3. Multiply the two spectra, bin by bin.
4. Take the inverse FFT, and keep the first $N + M - 1$ samples.

![Two routes from the input x[n] = [1, 2, 3] (N = 3) and the kernel h[n] = [0, 1, 0.5] (M = 3) to the same output y[n] = [0, 1, 2.5, 4, 1.5] of N + M − 1 = 5 samples. Route 1, direct: the convolution sum y[n] = Σ x[k] h[n − k], about N × M multiplications. Route 2, fast convolution: zero-pad both to length L of at least N + M − 1 (here 8), take the FFT of each, multiply bin by bin to get Y[k] = X[k] · H[k], then take the inverse FFT and keep the first N + M − 1 samples, about L log₂ L operations. Adapted from Burnett-Thompson (2007)](./convolution-direct-vs-fft.svg)

*Adapted from [Burnett-Thompson (2007)](#sources).*

That costs on the order of $L \log L$ operations instead of $N \times M$, so the saving grows with the kernel's length. In Smith's measurements, FFT convolution overtook direct convolution once the kernel was about 40 to 80 samples long, depending on the hardware. For signals that never end, such as live audio, the **overlap-add** method splits the input into blocks, convolves each with the FFT and adds the overlapping tails.

Zero-pad both signals, or the output wraps around. Multiplying DFTs (the discrete Fourier transform an FFT computes) gives **circular convolution**, in which the tail that should run past the end lands on top of the start. Padding to at least $N + M - 1$ samples leaves room for the tail, so circular convolution gives the same answer as ordinary (linear) convolution.

## Convolution vs cross-correlation and circular convolution

Cross-correlation is convolution without the flip, and circular convolution is convolution with the ends wrapped round.

| | Convolution | Cross-correlation | Circular convolution |
| --- | --- | --- | --- |
| Formula | $\sum_k x[k]\, h[n-k]$ | $\sum_k x[k+n]\, h[k]$ (one common convention) | Like convolution, with indices wrapped modulo $L$ |
| Kernel flipped? | Yes | No | Yes |
| Commutative? | Yes | No: swapping the signals reverses the result | Yes |
| Output length | $N + M - 1$ | $N + M - 1$ lags | $L$ (wraps around) |
| Answers | What does this system do to this signal? | Where, and at what delay, does this pattern appear? | The result of multiplying unpadded FFTs |
| Used for | Filters, smoothing, echo, blur, system modelling | Template matching, time-delay estimation, radar, sonar | Fast convolution via the FFT, periodic signals |

For a symmetric kernel, such as a moving average or a Gaussian, the flip changes nothing, so convolution and cross-correlation give the same result. For an asymmetric one they differ: cross-correlating $[1, 2, 3]$ with $[0, 1, 0.5]$ gives $[0.5, 2, 3.5, 3, 0]$ at lags $-2$ to $2$, not the convolution's $[0, 1, 2.5, 4, 1.5]$. Cross-correlating a signal with itself is [autocorrelation](/learn/signal-processing/autocorrelation/), which reveals repeating patterns.

## What convolution is used for

Convolution is how any linear, time-invariant system acts on a signal, so it turns up in every kind of filtering.

- Filtering: every FIR (finite impulse response) filter is a convolution with its kernel. [Low-pass filters](/learn/signal-processing/low-pass-filter/) remove noise; [high-pass filters](/learn/signal-processing/high-pass-filter/) remove drift.
- Smoothing: moving averages, Gaussian smoothing and exponential smoothing of sensor data, prices and measurements.
- Echo and reverb: an echo is a kernel with a spike now and a smaller one later. Convolution reverb records a real room's impulse response and convolves dry audio with it.
- Images: the same operation in two dimensions, with a small grid of weights: a 3 × 3 grid of 1/9 blurs; kernels with positive and negative weights find edges or sharpen.
- Neural networks: convolutional neural networks (CNNs) slide many small 2D kernels over images and learn the weights. It's the same sliding multiply-and-sum, though most libraries skip the flip and compute cross-correlation.
- Probability: add two independent random quantities, such as two dice, and the distribution of the total is their two distributions convolved. Repeat it many times and the result tends to a bell curve.
- Physics and engineering: the response of any LTI system, such as a circuit, a sensor or a building in an earthquake, is its input convolved with its impulse response. Instruments blur what they measure in the same way, and deconvolution tries to undo it.

## Common convolution mistakes

Most convolution mistakes are about the flip, the length and edges of the output, or the cost of long kernels.

- **Forgetting the flip.** Sliding the kernel without reversing it computes cross-correlation. With symmetric kernels nobody notices; with an echo or a derivative kernel the result is mirrored.
- **Expecting the output to be as long as the input.** Full convolution adds $M - 1$ samples. Decide whether you want full, same or valid output before you compare or plot results.
- **Ignoring the delay.** A causal kernel (one that uses only past samples) delays the signal. A symmetric kernel of $M$ taps delays it by $(M - 1)/2$ samples, so smoothed lines appear shifted to the right unless you align them.
- **Kernels that don't sum to 1.** A smoothing kernel that sums to 2 doubles the signal's level. Normalise it, unless the gain is intended.
- **Treating the edges as real data.** The first and last $M - 1$ output samples include padded zeros, so they dip towards zero. Trim them, or pad with repeated or mirrored values instead.
- **FFT convolution without zero-padding.** Multiplying unpadded FFTs gives circular convolution, and the end of the output wraps onto its start.
- **Direct convolution with very long kernels.** $N \times M$ grows quickly. For kernels longer than a few dozen samples, try the FFT method.

## How to calculate and chart a convolution in JavaScript, React or Angular

The calculator below convolves an input (48 samples for the built-in signals) with the kernel you choose and charts the input, the kernel and the result on stacked axes. SciChart.js computes the output itself: an `XyCustomFilter` convolves the input series with the kernel and recalculates whenever the input changes.

- Pick an **input** and a **kernel**, and set the kernel's **width** (for the echo, its delay).
- Move **Slide n**, or press **Play**, to slide the flipped kernel along the input: the ringed output sample is the sum shown above the chart.
- Choose **Your numbers** to convolve any two short sequences, such as the worked example above: the full result is listed when it has 16 values or fewer.
- Hover for values, scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={620} name="./Basic/demo" />

<LearnCta position="top" chart="convolution chart" demo="trend-ma-ratio" demoLabel="trendline and moving average filters" docs="/2d-charts/chart-types/data-filters-api/custom-filter/" docsLabel="SciChart.js custom filter documentation" />

Here is the code for this chart. The convolution itself is the `convolveAt` function inside the two `XyCustomFilter`s; the rest builds the lanes and the controls' results line:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        FastImpulseRenderableSeries,
        FastLineRenderableSeries,
        XyDataSeries,
        XyCustomFilter,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Sample" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Value" }));

        const x = getYourSignal(); // e.g. sensor readings
        const h = new Array(7).fill(1 / 7); // the kernel: a 7-sample moving average
        // Pad the input with h.length - 1 zeros, so the output has all N + M - 1 samples
        const padded = [...x, ...new Array(h.length - 1).fill(0)];
        const input = new XyDataSeries(wasmContext, {
            xValues: padded.map((_, i) => i),
            yValues: padded,
            dataSeriesName: "Input"
        });

        // The output: y[n] = sum of h[j] * x[n - j], computed by SciChart.js from the input series
        const output = new XyCustomFilter(input, {
            dataSeriesName: "Output",
            filterFunction: (n: number) => {
                const values = input.getNativeYValues();
                let sum = 0;
                for (let j = 0; j < h.length && n - j >= 0; j++) sum += h[j] * values.get(n - j);
                return sum;
            }
        });

        sciChartSurface.renderableSeries.add(
            new FastImpulseRenderableSeries(wasmContext, { dataSeries: input, stroke: "#50C7E0", fill: "#50C7E0", size: 6 }),
            new FastLineRenderableSeries(wasmContext, { dataSeries: output, stroke: "#3BD16F", strokeThickness: 3 })
        );
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const ConvolutionChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastImpulseRenderableSeries,
        FastLineRenderableSeries,
        XyDataSeries,
        XyCustomFilter,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    @Component({
        selector: "app-convolution-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class ConvolutionChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Sample" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Value" }));

            const x = getYourSignal(); // e.g. sensor readings
            const h = new Array(7).fill(1 / 7); // the kernel: a 7-sample moving average
            // Pad the input with h.length - 1 zeros, so the output has all N + M - 1 samples
            const padded = [...x, ...new Array(h.length - 1).fill(0)];
            const input = new XyDataSeries(wasmContext, {
                xValues: padded.map((_, i) => i),
                yValues: padded,
                dataSeriesName: "Input"
            });

            // The output: y[n] = sum of h[j] * x[n - j], computed by SciChart.js from the input series
            const output = new XyCustomFilter(input, {
                dataSeriesName: "Output",
                filterFunction: (n: number) => {
                    const values = input.getNativeYValues();
                    let sum = 0;
                    for (let j = 0; j < h.length && n - j >= 0; j++) sum += h[j] * values.get(n - j);
                    return sum;
                }
            });

            sciChartSurface.renderableSeries.add(
                new FastImpulseRenderableSeries(wasmContext, { dataSeries: input, stroke: "#50C7E0", fill: "#50C7E0", size: 6 }),
                new FastLineRenderableSeries(wasmContext, { dataSeries: output, stroke: "#3BD16F", strokeThickness: 3 })
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

- `XyCustomFilter` is a data series computed from another one. SciChart.js calls its `filterFunction(index, y)` for every sample when the filter is created, when the function is replaced or when the input is cleared and refilled, and only for the new samples when you append. A causal kernel only looks back, so appended data is filtered correctly without recomputing the rest.
- `FastImpulseRenderableSeries` draws stems, one line and dot per sample, the usual way to show discrete signals and kernels.
- `LeftAlignedOuterVerticallyStackedAxisLayoutStrategy` stacks the y-axes into lanes, so the input, kernel and output share one x-axis and line up sample for sample.
- Returning `NaN` from a filter function leaves a gap, which is how the demo shows the output "still to come" in a fainter colour.

### Apply a kernel to live data

The same filter smooths a stream as it arrives. Append to the raw series and the filtered line follows, with no extra code:

```ts
const { XyDataSeries, XyCustomFilter, FastLineRenderableSeries } = SciChart;

const rawData = new XyDataSeries(wasmContext, { dataSeriesName: "Raw" });
const kernel = [0.1, 0.2, 0.4, 0.2, 0.1]; // any kernel; this one sums to 1

// y[n] = sum of h[j] * x[n - j], over the samples received so far
const filtered = new XyCustomFilter(rawData, {
    dataSeriesName: "Filtered",
    filterFunction: (n) => {
        const x = rawData.getNativeYValues();
        let sum = 0;
        for (let j = 0; j < kernel.length && n - j >= 0; j++) sum += kernel[j] * x.get(n - j);
        return sum;
    }
});
sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, { dataSeries: rawData, stroke: "#50C7E066" }),
    new FastLineRenderableSeries(wasmContext, { dataSeries: filtered, stroke: "#3BD16F", strokeThickness: 2 })
);

rawData.appendRange(xValues, yValues); // the filtered line follows automatically
```

Two cautions: updating one existing raw value refilters only that sample, so later samples that depend on it keep their old values (set the `filterFunction` again to recompute everything); and with a `fifoCapacity` series the index passed to the function counts samples in order, while `getNativeYValues()` holds the wrapped buffer, so keep your own copy of the recent samples instead.

### Convolution without a chart library

If you only need the numbers, direct convolution is two loops. This returns the full output of N + M − 1 samples, and gives `[0, 1, 2.5, 4, 1.5]` for the worked example above:

```js
// y[n] = sum over k of x[k] * h[n - k]
function convolve(x, h) {
    const y = new Array(x.length + h.length - 1).fill(0);
    for (let n = 0; n < y.length; n++) {
        for (let k = Math.max(0, n - h.length + 1); k <= Math.min(n, x.length - 1); k++) {
            y[n] += x[k] * h[n - k];
        }
    }
    return y;
}

convolve([1, 2, 3], [0, 1, 0.5]); // [0, 1, 2.5, 4, 1.5]
```

**See it in the demo app:** [JavaScript trendline and moving average filters](https://www.scichart.com/demo/javascript/trend-ma-ratio) · [React trendline and moving average filters](https://www.scichart.com/demo/react/trend-ma-ratio) · [Angular trendline and moving average filters](https://www.scichart.com/demo/angular/trend-ma-ratio), where the moving average is a convolution with a flat kernel. For live signal processing, see the [JavaScript audio analyzer with FFT](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example).

**Go deeper:** [SciChart.js custom filter documentation](/2d-charts/chart-types/data-filters-api/custom-filter/), the built-in [moving average filter](/2d-charts/chart-types/data-filters-api/moving-average-filter/), and the [impulse (stem) series](/2d-charts/chart-types/fast-impulse-renderable-series/).

## Frequently asked questions

### What is convolution in simple terms?

Convolution is a sliding weighted sum. You take a short list of weights, called the kernel, and slide it along a signal. At each position you multiply the overlapping values and add them up, giving one output value. A kernel of equal weights gives a moving average; other kernels sharpen, delay, echo or detect edges.

### What is the formula for convolution?

For sampled signals, y[n] = Σ x[k] h[n − k], summed over every k: the input x is multiplied by the kernel h, flipped and shifted by n, and the products are added. For continuous signals, the sum becomes an integral: (f ∗ g)(t) = ∫ f(τ) g(t − τ) dτ, taken over all τ.

### What is the convolution theorem?

The convolution theorem says that convolving two signals in time is the same as multiplying their Fourier transforms in frequency. So you can convolve by taking the FFT of both signals, multiplying the results bin by bin and taking the inverse FFT. For long kernels, that takes far fewer operations than direct convolution.

### What is the difference between convolution and cross-correlation?

Both slide one signal along another and sum the products. Convolution flips the kernel first; cross-correlation doesn't. Convolution answers what a system does to a signal; cross-correlation measures how similar two signals are at each shift, which is how you find a known pattern or a time delay. For a symmetric kernel the two give the same result.

### What is convolution in a CNN?

A convolutional neural network slides small two-dimensional kernels, typically 3 by 3 pixels, across an image and sums the products at each position, which is the same operation in two dimensions. The network learns the kernel weights during training. Most deep learning libraries compute cross-correlation, without the flip, and still call it convolution.

### How do I calculate a convolution in JavaScript?

Write two nested loops: for each output index n from 0 to N + M − 2, add up x[k] × h[n − k] for every k where both values exist. That is direct convolution, and it is fast enough for short kernels. For long kernels, use an FFT: zero-pad both arrays, transform them, multiply and transform back.

## Sources

- Smith, S. W., *The Scientist and Engineer's Guide to Digital Signal Processing*: [chapter 6, Convolution](https://www.dspguide.com/ch6.htm), [chapter 7, Properties of Convolution](https://www.dspguide.com/ch7.htm) and [chapter 18, FFT Convolution](https://www.dspguide.com/ch18/3.htm), including the measured crossover between direct and FFT convolution.
- Smith, J. O., *Mathematics of the Discrete Fourier Transform*, Stanford CCRMA: [Convolution](https://ccrma.stanford.edu/~jos/mdft/Convolution.html) and [the Convolution Theorem](https://ccrma.stanford.edu/~jos/mdft/Convolution_Theorem.html).
- Oppenheim, A. V. and Schafer, R. W., *Discrete-Time Signal Processing*, 3rd ed., Pearson, 2010, chapter 2 (linear time-invariant systems and the convolution sum) and chapter 8 (circular convolution and the DFT).
- Burnett-Thompson, A. (2007), *A 3D Local Positioning System to track A Neutrally Buoyant Flow Follower*, PhD thesis, chapter 3. The associated published paper is Burnett-Thompson, A. and York, T. (2007), [*A 3D Acoustic Local Positioning System to Track a Neutrally Buoyant Flow Follower*](https://www.semanticscholar.org/paper/A-3D-Acoustic-Local-Positioning-System-to-Track-a-Burnett-Thompson-York/13e659919f6201ceecdf458643b708d58912841c), IEEE Instrumentation and Measurement Technology Conference (IMTC 2007). The direct-versus-FFT convolution diagram on this page is adapted from it.
- MIT OpenCourseWare, 6.003 Signals and Systems, [Lecture 8: Convolution](https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/resources/lecture-8-convolution/).
- PyTorch documentation, [Conv2d](https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html), which defines its "convolution" layer as cross-correlation.

<LearnCta position="bottom" chart="convolution chart" demo="trend-ma-ratio" demoLabel="trendline and moving average filters" docs="/2d-charts/chart-types/data-filters-api/custom-filter/" docsLabel="SciChart.js custom filter documentation" />
