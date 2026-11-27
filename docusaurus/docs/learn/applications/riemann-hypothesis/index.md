---
sidebar_position: 250
sidebar_label: Riemann Hypothesis
title: "The Riemann Hypothesis, Visualised: Zeta Zeros, the Critical Line and the Primes (With Interactive Charts)"
description: "What the Riemann hypothesis says, the zeta function and its zeros, the critical line, why it matters for the primes, and the evidence, with live charts computed in the browser."
keywords:
    [
        "riemann hypothesis",
        "riemann hypothesis explained",
        "riemann zeta function",
        "zeta function zeros",
        "zeros of the zeta function",
        "nontrivial zeros",
        "critical line",
        "critical strip",
        "riemann hypothesis visualization",
        "hardy z function",
        "riemann siegel formula",
        "prime number theorem",
        "prime counting function",
        "riemann explicit formula",
        "montgomery odlyzko law"
    ]
image: /img/learn/riemann-hypothesis-og.png
related: [hr-diagram, fourier-transform, histogram, log-scale-graph]
datePublished: 2026-11-21
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What does the Riemann hypothesis say in simple terms?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The Riemann zeta function is zero at two kinds of points. The trivial zeros are the negative even numbers -2, -4, -6 and so on. All the others, the non-trivial zeros, lie in a narrow vertical band of the complex plane between real part 0 and real part 1. The hypothesis says every one of these non-trivial zeros sits exactly on the centre line of that band, where the real part is 1/2." }
                },
                {
                    "@type": "Question",
                    "name": "Has the Riemann hypothesis been proven?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Not as of November 2026. The Clay Mathematics Institute lists it as unsolved, with a one-million-dollar prize for a proof. Computers have checked more than 12 trillion zeros and found all of them on the critical line, but no number of checked cases proves a statement about infinitely many zeros. Claimed proofs appear from time to time, but none has been accepted." }
                },
                {
                    "@type": "Question",
                    "name": "What is the first non-trivial zero of the zeta function?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The first non-trivial zero is at 1/2 + 14.134725...i, so its height on the critical line is about 14.134725. The next two are at heights 21.022040 and 25.010858. Every zero has a mirror image below the real axis, at 1/2 - 14.134725...i and so on. Andrew Odlyzko's tables and the LMFDB list the first zeros to many more decimal places." }
                },
                {
                    "@type": "Question",
                    "name": "Why does the Riemann hypothesis matter for prime numbers?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Riemann's explicit formula writes the prime-counting function exactly as a smooth main term minus one wave for each zero of the zeta function. The real part of a zero sets how fast its wave grows. If every zero has real part 1/2, the primes stray from the logarithmic integral li(x) by no more than about the square root of x times log x, which is close to the best accuracy possible. A zero off the line would mean larger, more irregular deviations." }
                },
                {
                    "@type": "Question",
                    "name": "What is the critical line?",
                    "acceptedAnswer": { "@type": "Answer", "text": "The critical line is the vertical line of complex numbers with real part 1/2, written s = 1/2 + it. It runs down the middle of the critical strip, the band 0 < Re(s) < 1 that contains every non-trivial zeta zero. The functional equation makes the zeros symmetric about this line, and the Riemann hypothesis says they all lie on it." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot the Riemann zeta function in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Compute Hardy's Z(t), a real function whose sign changes are the zeros on the critical line: evaluate zeta directly with Euler-Maclaurin summation for small t, and with the Riemann-Siegel formula for larger t. Draw Z(t) as a line series with the zeros as scatter points at y = 0. For the complex path of zeta, plot the real part against the imaginary part as an unsorted line. SciChart.js draws hundreds of thousands of points this way in plain JavaScript, React or Angular." }
                }
            ]
        })}
    </script>
</head>

# The Riemann Hypothesis

## What is the Riemann hypothesis?

The **Riemann hypothesis** is the conjecture, made by Bernhard Riemann in 1859, that the Riemann zeta function's non-trivial zeros all have real part exactly 1/2. On the complex plane, every zero inside the critical strip would then lie on one vertical line, the critical line. It is unproven; if true, it pins down how evenly the prime numbers are spread.

![Four charts on a dark navy background. Top left, Hardy's Z function oscillating along the critical line from t = 0 to 100, with 29 orange dots where it crosses zero. Top right, the path of the zeta function in the complex plane for t from 0 to 40, a looping curve that passes through the origin at six orange dots. Bottom left, the step function counting primes up to 100, a dashed logarithmic integral curve and a blue curve rebuilt from 30 zeros that follows the steps. Bottom right, a histogram of normalised gaps between the first 5,000 zeros, matching an orange random-matrix curve rather than a dashed random-points curve](/img/learn/riemann-hypothesis-og.png)

*Four views of the zeta function, all computed in the browser: Z(t) and its zeros, the zeta spiral through the origin, the primes rebuilt from zeros, and the gaps between zeros. [Try the interactive version](#how-to-visualise-the-riemann-hypothesis-in-javascript-react-or-angular).*

:::tip Key takeaways
- The zeta function is zero at -2, -4, -6, … (the trivial zeros) and at infinitely many points in the strip 0 < Re s < 1. The hypothesis says those all have real part 1/2.
- On the critical line the zeros show up as sign changes of a real function, Hardy's Z(t). The first is at height 14.134725….
- Each zero adds one wave to Riemann's formula for the number of primes. Zeros on the line keep the errors in prime counts as small as they can be.
- More than 12 trillion zeros have been checked and all lie on the line. That is strong evidence, not a proof.
- The gaps between zeros follow the statistics of eigenvalues of large random matrices, not of random points.
:::

The hypothesis is one of the seven Millennium Prize Problems of the Clay Mathematics Institute, with a prize of one million US dollars for a proof. It was also on David Hilbert's list of 23 problems in 1900. As of November 2026 the Clay Institute lists it as unsolved.

## The Riemann zeta function

For a number $s$ with real part greater than 1, the **zeta function** is the sum

$$
\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} = 1 + \frac{1}{2^s} + \frac{1}{3^s} + \frac{1}{4^s} + \cdots
$$

At $s = 2$ the sum is $\pi^2/6 \approx 1.6449$. As $s$ falls towards 1 the sum grows without limit, and at $s = 1$ it becomes the harmonic series, which diverges. Riemann used complex values $s = \sigma + it$, where $\sigma$ is the real part and $t$ the imaginary part, or height.

Euler had already found the link with primes in 1737. Because every whole number is a product of primes in exactly one way, the sum can be rewritten as a product with one factor for each prime $p$:

$$
\zeta(s) = \prod_{p\ \text{prime}} \frac{1}{1 - p^{-s}} = \frac{1}{1-2^{-s}} \cdot \frac{1}{1-3^{-s}} \cdot \frac{1}{1-5^{-s}} \cdots
$$

This Euler product is why a statement about the zeros of zeta turns into a statement about primes.

### Analytic continuation and the functional equation

The sum only converges when the real part of $s$ is above 1, but the function itself extends to every complex number except $s = 1$, where it has a pole. This extension, the **analytic continuation**, is unique: there is only one smooth (complex-differentiable) function that agrees with the sum where the sum converges. Values such as $\zeta(-1) = -1/12$ come from the continued function, not from adding up $1 + 2 + 3 + \cdots$.

Riemann showed that the continued function satisfies a **functional equation** linking $s$ and $1 - s$:

$$
\zeta(s) = 2^s \pi^{s-1} \sin\left(\frac{\pi s}{2}\right) \Gamma(1-s)\, \zeta(1-s)
$$

where $\Gamma$ is the gamma function. It reflects the plane in the line $\sigma = 1/2$, which is why that line is special. A computer evaluates zeta inside the strip with a formula that converges there, such as Euler–Maclaurin summation.

## Trivial and non-trivial zeros: the critical strip and the critical line

The zeta function has two kinds of zeros: trivial zeros at the negative even integers, and non-trivial zeros inside the critical strip, which the hypothesis places on the critical line.

![The complex plane of the zeta function. The horizontal axis is the real part sigma from -7 to 3 and the vertical axis the imaginary part t from -30 to 30. Blue dots on the real axis at -2, -4 and -6 are the trivial zeros. A cross at 1 is the pole. A shaded vertical band between 0 and 1 is the critical strip, and a red dashed line down its middle at one half is the critical line. Red dots on that line at heights 14.13, 21.02 and 25.01, with mirror images below the axis, are the first non-trivial zeros. A green region to the right of 1 is where the series converges](./critical-strip.svg)

The zeros of the zeta function come in two kinds.

- The **trivial zeros** are at $s = -2, -4, -6, \ldots$. The sine factor in the functional equation forces them, and they tell us nothing about primes.
- The **non-trivial zeros** all lie in the **critical strip**, $0 < \sigma < 1$. There are infinitely many of them. They are written $\rho = \beta + i\gamma$, and they come in mirror-image pairs: if $\beta + i\gamma$ is a zero, so is $\beta - i\gamma$. The functional equation adds a second symmetry, about the line $\sigma = 1/2$.

The **critical line** is $\sigma = 1/2$, the centre of the strip. The Riemann hypothesis states that $\beta = 1/2$ for every non-trivial zero. Because of the two symmetries, a zero off the line would always come with three partners, at $1 - \beta \pm i\gamma$ and $\beta - i\gamma$.

The first ten zeros above the real axis, at $1/2 + i\gamma$:

| Zero | Height $\gamma$ | Zero | Height $\gamma$ |
| --- | --- | --- | --- |
| 1 | 14.134725 | 6 | 37.586178 |
| 2 | 21.022040 | 7 | 40.918719 |
| 3 | 25.010858 | 8 | 43.327073 |
| 4 | 30.424876 | 9 | 48.005151 |
| 5 | 32.935062 | 10 | 49.773832 |

These match Andrew Odlyzko's published table and the LMFDB. Computed from scratch with the methods on this page, the first 5,163 zeros agree with Odlyzko's table to better than one part in a million.

## How to see the zeros: Hardy's Z function

Zeta is complex-valued, so on the critical line it can't simply be drawn as one curve against $t$. G. H. Hardy's trick is to rotate each value by a known angle so that the result is real:

$$
Z(t) = e^{i\theta(t)}\, \zeta\!\left(\tfrac{1}{2} + it\right), \qquad \theta(t) = \arg \Gamma\!\left(\tfrac{1}{4} + \tfrac{it}{2}\right) - \frac{t}{2}\ln \pi
$$

The rotation doesn't change the size, so $|Z(t)| = |\zeta(1/2 + it)|$, and $Z(t)$ is a real number for every real $t$. When the curve of $Z(t)$ crosses the axis, zeta is zero on the line. For example $Z(14) \approx -0.106$ and $Z(14.2) \approx 0.052$, so a zero lies between them: the first one, at 14.134725.

A sign change proves a zero is on the line, which is how the numerical checks work. The opposite is not automatic: a zero off the line would show up as a place where $Z(t)$ dips towards the axis and turns back without crossing, combined with a count of zeros (next section) that comes out one pair short.

### The Riemann–Siegel formula

For large $t$, $Z(t)$ is computed with the **Riemann–Siegel formula**. With $N = \lfloor \sqrt{t/2\pi} \rfloor$,

$$
Z(t) = 2 \sum_{n=1}^{N} \frac{\cos\left(\theta(t) - t \ln n\right)}{\sqrt{n}} + R(t)
$$

where $R(t)$ is a remainder of size about $t^{-1/4}$ that is itself given by a series of correction terms $C_0, C_1, C_2, \ldots$. Only about $\sqrt{t/2\pi}$ terms are needed: 3 at $t = 100$ and 28 at $t = 5{,}000$. Carl Ludwig Siegel found the formula in Riemann's unpublished notes and published it in 1932, so Riemann had computed the first few zeros himself.

The formula is an asymptotic series, accurate for large $t$ and poor for small $t$. With five correction terms it agrees with direct evaluation to within about $3 \times 10^{-7}$ from $t = 50$ upwards. Below that, evaluating zeta directly is cheap and more accurate.

## How many zeros are there? The Riemann–von Mangoldt formula

Let $N(T)$ be the number of non-trivial zeros with height between 0 and $T$. Riemann stated, and Hans von Mangoldt proved in 1905, that

$$
N(T) = \frac{T}{2\pi}\ln\frac{T}{2\pi} - \frac{T}{2\pi} + \frac{7}{8} + S(T) + O\!\left(\frac{1}{T}\right)
$$

where $S(T)$ is a small, irregular term that grows extremely slowly with $T$. The zeros get closer together as $t$ rises: the average gap near height $t$ is $2\pi / \ln(t/2\pi)$, about 2.3 at $t = 100$ and 0.94 at $t = 5{,}000$.

| Height $T$ | Sign changes of $Z(t)$ up to $T$ | Formula without $S(T)$ |
| --- | --- | --- |
| 100 | 29 | 29.0 |
| 1,000 | 649 | 648.6 |
| 5,000 | 4,520 | 4,520.3 |

This count is what makes numerical checks rigorous. Alan Turing's method combines the formula with a proven bound on the average of $S(T)$ to certify the exact number of zeros in the strip up to height $T$. If the sign changes of $Z(t)$ up to $T$ account for all of them, every zero up to $T$ is on the line.

## Why the Riemann hypothesis matters: the primes

The **prime-counting function** $\pi(x)$ is the number of primes up to $x$: $\pi(10) = 4$, $\pi(100) = 25$. Drawn as a chart, it is a staircase that steps up by one at each prime.

Gauss guessed that primes near $x$ have density about $1/\ln x$, which gives the **logarithmic integral**

$$
\operatorname{li}(x) = \int_0^x \frac{dt}{\ln t}
$$

(taken as a principal value, because the integrand blows up at $t = 1$; the offset version $\operatorname{Li}(x) = \operatorname{li}(x) - \operatorname{li}(2)$ starts the integral at 2 and differs by about 1.045). The **prime number theorem**, proved by Hadamard and de la Vallée Poussin in 1896, says $\pi(x) / \operatorname{li}(x) \to 1$. Its proof rests on zeta having no zeros on the line $\sigma = 1$.

| $x$ | $\pi(x)$ | $x / \ln x$ | $\operatorname{li}(x)$ | $\operatorname{li}(x) - \pi(x)$ | Bound if the hypothesis holds |
| --- | --- | --- | --- | --- | --- |
| 1,000 | 168 | 144.8 | 177.6 | 9.6 | 8.7 (applies from 2,657) |
| 100,000 | 9,592 | 8,685.9 | 9,629.8 | 37.8 | 144.9 |
| 1,000,000 | 78,498 | 72,382.4 | 78,627.5 | 129.5 | 549.7 |
| 10,000,000 | 664,579 | 620,420.7 | 664,918.4 | 339.4 | 2,028.0 |

The last column is the bound Lowell Schoenfeld proved in 1976 on the assumption that the hypothesis holds. The converse follows from an argument going back to Helge von Koch in 1901, so the hypothesis is equivalent to the bound: it is true if and only if

$$
|\pi(x) - \operatorname{li}(x)| < \frac{\sqrt{x}\,\ln x}{8\pi} \quad \text{for all } x \ge 2657
$$

So the hypothesis is a precise claim about how small the error in the prime number theorem stays, roughly the square root of $x$. A zero off the line at real part $\beta > 1/2$ would make the error grow like $x^\beta$ instead.

### Riemann's explicit formula: primes from zeros

Riemann went further and wrote the prime count exactly in terms of the zeros. In one standard form, with $J(x) = \pi(x) + \tfrac12\pi(x^{1/2}) + \tfrac13\pi(x^{1/3}) + \cdots$,

$$
J(x) = \operatorname{li}(x) - \sum_{\rho} \operatorname{li}(x^{\rho}) - \ln 2 + \int_x^{\infty} \frac{dt}{t\,(t^2-1)\ln t}
$$

and $\pi(x)$ is recovered as $\sum_n \frac{\mu(n)}{n} J(x^{1/n})$, where $\mu$ is the Möbius function. The sum runs over all the non-trivial zeros, taken in pairs in order of height. Each pair contributes a wave of the form

$$
\frac{2\sqrt{x}}{|\rho| \ln x} \cos\left(\gamma \ln x - \arg\rho\right)
$$

to leading order: an oscillation in $\ln x$ with frequency $\gamma$ and an amplitude that grows like $x^\beta$, which is $\sqrt{x}$ on the critical line. Adding waves of increasing frequency to sharpen a smooth curve into steps is the same idea as a Fourier series building a square wave (see the [Fourier transform guide](/learn/applications/signal-processing/fourier-transform/)).

With no zeros, the formula is a smooth curve close to $\operatorname{li}(x)$. With 30 zeros it gives 15.07 at $x = 50$ and 25.18 at $x = 100$, against true counts of 15 and 25; with 300 zeros, 15.02 and 25.01, and the steps at each prime are sharp.

## The evidence for the Riemann hypothesis

The evidence for the hypothesis is strong but not a proof: trillions of zeros checked by computer, and theorems that put a large share of all zeros on the critical line.

### Numerical verification

Each generation of computers has checked more zeros. In 2021 Dave Platt and Tim Trudgian proved, with rigorous interval arithmetic, that every zero up to height $3 \times 10^{12}$ lies on the critical line: the first 12,363,153,437,138 zeros. Odlyzko's computations have checked large blocks of zeros much higher up, near the $10^{20}$-th zero and beyond.

### Theorems

- Hardy proved in 1914 that infinitely many zeros lie on the critical line.
- Selberg proved in 1942 that a positive proportion of them do. Conrey raised the proportion above two-fifths in 1989, and Pratt, Robles, Zaharescu and Zeindler above five-twelfths in 2020. Two preprints from 2026, not yet refereed, claim that more than two-thirds of the zeros are simple and on the line.
- No zero has real part 1 (the prime number theorem), and there are explicit zero-free regions just inside the strip.
- In autumn 2026, preprints claimed the first zero-free half-plane of fixed width inside the critical strip (a "quasi-Riemann hypothesis"). None had been refereed by November 2026, and none says anything about the line 1/2 itself.

None of these shows that all of the zeros are on the line.

### Montgomery–Odlyzko: zeros behave like random-matrix eigenvalues

In 1973 Hugh Montgomery studied the gaps between zeros and found a formula for how often two zeros are a given distance apart. Freeman Dyson recognised it: the same formula describes eigenvalues of big random Hermitian matrices drawn from the **Gaussian Unitary Ensemble** (GUE). Odlyzko's computations, from 1987 on, confirmed the match with huge samples of zeros far up the line.

To compare gaps at different heights, divide each gap between neighbouring zeros by the average gap at its height, so the average is 1. A histogram of these normalised gaps can then be set against the Wigner surmise $p(s) = \frac{32}{\pi^2} s^2 e^{-4s^2/\pi}$, a close approximation to the GUE distribution. Random points (a Poisson process) would have gaps following $e^{-s}$, with 18.1% of gaps under 0.2. The first 5,000 zeros have 0.5% under 0.2: they repel each other, as eigenvalues do. These low zeros fit the GUE curve only roughly, with even fewer very small gaps than it predicts. The close agreement Odlyzko found is for zeros at great heights.

### The status in November 2026

Claimed proofs appear from time to time, some now written in proof assistants such as Lean so that a computer can check each step. Partial results are moving faster: in 2026, preprints claimed that more than two-thirds of the zeros are on the line, and the first zero-free half-plane of fixed width inside the strip. None had been refereed by November 2026, and none implies the hypothesis. A claim counts only once mathematicians have checked it, including that the formal statement really is the Riemann hypothesis, and the result has been accepted. Until then the hypothesis is unproven, and the Clay Mathematics Institute lists it as unsolved.

## Ways to visualise the Riemann hypothesis

Each way of charting the zeta function shows a different side of the hypothesis, from counting zeros to watching them rebuild the primes.

| Chart | What it shows | Best for |
| --- | --- | --- |
| Z(t) line chart | Real oscillating curve; zeros are where it crosses the axis | Locating and counting zeros on the critical line |
| Zeta spiral (real part against imaginary part) | The path of $\zeta(\sigma + it)$ as $t$ rises; on the line it passes through the origin at each zero | Seeing why the line is special, by moving $\sigma$ off 1/2 |
| Prime staircase with the explicit formula | $\pi(x)$, $\operatorname{li}(x)$ and the curve rebuilt from N zeros | Showing what the zeros have to do with primes |
| Spacing histogram | Normalised gaps between zeros against the GUE and Poisson curves | The statistics of the zeros |
| Domain colouring or $|\zeta|$ heatmap | Colour for the argument of $\zeta$, brightness for its size, over the whole plane | A picture of the whole function, zeros and pole included |
| N(T) step chart | The count of zeros against the Riemann–von Mangoldt curve | Checking that no zeros are missing |

The first four are in the live demo below. A $|\zeta|$ heatmap over a rectangle of the plane is a natural extension, drawn with a [heatmap](/learn/chart-types/cartesian/heatmap/) series.

## Common misconceptions about the Riemann hypothesis

Most misconceptions about the hypothesis overstate what is known or confuse the zeros with the primes.

- **"It has been proven."** Not as of November 2026. Claimed proofs appear from time to time; none has been accepted, and the Clay Mathematics Institute lists the problem as unsolved.
- **"Trillions of verified zeros prove it."** A numerical check covers finitely many zeros out of infinitely many. Other conjectures in number theory held for every case anyone could compute and still turned out false, and the first counterexample to the claim that $\pi(x) < \operatorname{li}(x)$ is known to be far beyond direct computation.
- **"The zeros are the primes."** They are not. The zeros are complex numbers such as $1/2 + 14.1347i$; the primes are whole numbers. The link is Riemann's explicit formula, where each zero adds one wave to the count of primes.
- **"The trivial zeros are counterexamples."** The zeros at $-2, -4, -6, \ldots$ are outside the critical strip, and the hypothesis says nothing about them.
- **"$1 + 2 + 3 + \cdots = -1/12$."** The series diverges. $\zeta(-1) = -1/12$ is the value of the analytically continued function, not a sum.
- **"A zero is missing where $Z(t)$ only touches the axis."** On a chart, a close pair of zeros can look like a touch. Zoomed in, the curve crosses twice, and the count of sign changes matches the Riemann–von Mangoldt formula.

## How to visualise the Riemann hypothesis in JavaScript, React or Angular

Everything here is computed in the browser, from the zeta function up: more than 5,000 zeros at start-up, then 100,000 points of $Z(t)$ when you pick the longest range. When you move a control, SciChart.js redraws the chart's line, scatter or rectangle series with WebGL and WebGPU; pick the longest range to see how it handles 100,000 points on your device.

Pick a range from **t from 0 to** to draw $Z(t)$ up to 5,000, with every zero marked and counted against the Riemann–von Mangoldt formula. Drag **σ** away from 0.5 and the zeta spiral stops passing through the origin; **t up to** lengthens the path. **Zeros** adds zeros one by one to Riemann's explicit formula, so the steps of the prime staircase sharpen. **First** sets how many zeros go into the gap histogram. Scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={900} name="./Basic/demo" />

<LearnCta position="top" chart="zeta function chart" demo="line-chart" demoLabel="line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />

Here is the code for the four charts. The zeta function, Hardy's $Z$, the zero search and the explicit formula are plain JavaScript in the same file, above this part; SciChart.js draws the results. The React and Angular versions show the core chart, $Z(t)$ with its zeros marked.

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
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        HorizontalLineAnnotation,
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
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "t (height on the critical line)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Z(t)", growBy: new NumberRange(0.05, 0.05) }));

        // Your data: Hardy's Z(t) sampled along the line, and the heights of the zeros (its sign changes)
        const { t, z, zeros } = getYourZetaData();
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: t, yValues: z, dataSeriesName: "Z(t)" }),
                stroke: "#50C7E0",
                strokeThickness: 1.5
            }),
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: zeros, yValues: zeros.map(() => 0), dataSeriesName: "Zeros" }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "#F48420", stroke: "#FFFFFF" })
            })
        );
        sciChartSurface.annotations.add(new HorizontalLineAnnotation({ y1: 0, stroke: "#C8D3E8", strokeDashArray: [3, 3] }));
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );
        return { sciChartSurface };
    };

    export const HardyZChart = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 450 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        HorizontalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    @Component({
        selector: "app-hardy-z-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 450px"></scichart-angular>`
    })
    export class HardyZChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "t (height on the critical line)" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Z(t)", growBy: new NumberRange(0.05, 0.05) }));

            // Your data: Hardy's Z(t) sampled along the line, and the heights of the zeros (its sign changes)
            const { t, z, zeros } = getYourZetaData();
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: t, yValues: z, dataSeriesName: "Z(t)" }),
                    stroke: "#50C7E0",
                    strokeThickness: 1.5
                }),
                new XyScatterRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, { xValues: zeros, yValues: zeros.map(() => 0), dataSeriesName: "Zeros" }),
                    pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "#F48420", stroke: "#FFFFFF" })
                })
            );
            sciChartSurface.annotations.add(new HorizontalLineAnnotation({ y1: 0, stroke: "#C8D3E8", strokeDashArray: [3, 3] }));
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

- $Z(t)$ and the explicit formula are `FastLineRenderableSeries`; the prime staircase is the same series with `isDigitalLine: true`, which draws steps instead of slopes.
- The zeta spiral is a line whose x values (the real part) go back and forth, so its `XyDataSeries` is created with `isSorted: false`.
- The gap histogram is a `FastRectangleRenderableSeries` on an `XyxyDataSeries`, one rectangle per bin from its start to its end.
- Sliders only change data: each update calls `clear()` and `appendRange()` on a data series, and the chart redraws. The explicit formula stores each zero's wave once, so moving the slider is just a sum.

**See it in the demo app:** [JavaScript line chart](https://www.scichart.com/demo/javascript/line-chart) · [React line chart](https://www.scichart.com/demo/react/line-chart) · [Angular line chart](https://www.scichart.com/demo/angular/line-chart); and for very large point counts, [JavaScript chart with one million points](https://www.scichart.com/demo/javascript/chart-performance-load-one-million-points) · [React chart with one million points](https://www.scichart.com/demo/react/chart-performance-load-one-million-points) · [Angular chart with one million points](https://www.scichart.com/demo/angular/chart-performance-load-one-million-points).

**Go deeper:** [SciChart.js line series documentation](/2d-charts/chart-types/fast-line-renderable-series/), the [rectangle series documentation](/2d-charts/chart-types/fast-rectangle-renderable-series/) and the guides to the [line chart](/learn/chart-types/cartesian/line-chart/), the [histogram](/learn/chart-types/cartesian/histogram/) and the [log scale graph](/learn/axes-and-scales/log-scale-graph/), useful when you plot $\pi(x)$ against $\operatorname{li}(x)$ up to millions.

## Frequently asked questions

### What does the Riemann hypothesis say in simple terms?

The Riemann zeta function is zero at two kinds of points. The trivial zeros are the negative even numbers -2, -4, -6 and so on. All the others, the non-trivial zeros, lie in a narrow vertical band of the complex plane between real part 0 and real part 1. The hypothesis says every one of these non-trivial zeros sits exactly on the centre line of that band, where the real part is 1/2.

### Has the Riemann hypothesis been proven?

Not as of November 2026. The Clay Mathematics Institute lists it as unsolved, with a one-million-dollar prize for a proof. Computers have checked more than 12 trillion zeros and found all of them on the critical line, but no number of checked cases proves a statement about infinitely many zeros. Claimed proofs appear from time to time, but none has been accepted.

### What is the first non-trivial zero of the zeta function?

The first non-trivial zero is at 1/2 + 14.134725...i, so its height on the critical line is about 14.134725. The next two are at heights 21.022040 and 25.010858. Every zero has a mirror image below the real axis, at 1/2 - 14.134725...i and so on. Andrew Odlyzko's tables and the LMFDB list the first zeros to many more decimal places.

### Why does the Riemann hypothesis matter for prime numbers?

Riemann's explicit formula writes the prime-counting function exactly as a smooth main term minus one wave for each zero of the zeta function. The real part of a zero sets how fast its wave grows. If every zero has real part 1/2, the primes stray from the logarithmic integral li(x) by no more than about the square root of x times log x, which is close to the best accuracy possible. A zero off the line would mean larger, more irregular deviations.

### What is the critical line?

The critical line is the vertical line of complex numbers with real part 1/2, written s = 1/2 + it. It runs down the middle of the critical strip, the band 0 < Re(s) < 1 that contains every non-trivial zeta zero. The functional equation makes the zeros symmetric about this line, and the Riemann hypothesis says they all lie on it.

### How do I plot the Riemann zeta function in JavaScript?

Compute Hardy's Z(t), a real function whose sign changes are the zeros on the critical line: evaluate zeta directly with Euler-Maclaurin summation for small t, and with the Riemann-Siegel formula for larger t. Draw Z(t) as a line series with the zeros as scatter points at y = 0. For the complex path of zeta, plot the real part against the imaginary part as an unsorted line. SciChart.js draws hundreds of thousands of points this way in plain JavaScript, React or Angular.

## Sources

- Riemann, B. (1859), *Ueber die Anzahl der Primzahlen unter einer gegebenen Grösse*, Monatsberichte der Berliner Akademie; [manuscript and English translation](https://www.claymath.org/collections/riemanns-1859-manuscript/) at the Clay Mathematics Institute.
- Clay Mathematics Institute, [The Riemann Hypothesis](https://www.claymath.org/millennium/riemann-hypothesis/) (Millennium Prize Problem, listed as unsolved) and E. Bombieri's official problem description linked from it.
- Edwards, H. M., *Riemann's Zeta Function*, Academic Press (1974; Dover reprint 2001): the explicit formula, the Riemann–Siegel formula and its correction terms. Titchmarsh, E. C., *The Theory of the Riemann Zeta-Function*, 2nd edition revised by D. R. Heath-Brown, Oxford University Press (1986): the functional equation, $N(T)$, Hardy's and Selberg's theorems.
- Odlyzko, A. M., [Tables of zeros of the Riemann zeta function](https://www-users.cse.umn.edu/~odlyzko/zeta_tables/index.html) (the first 100,000 zeros, used to check the demo) and (1987), [On the distribution of spacings between zeros of the zeta function](https://doi.org/10.1090/S0025-5718-1987-0866115-0), *Mathematics of Computation*, 48, 273–308. Montgomery, H. L. (1973), The pair correlation of zeros of the zeta function, *Proceedings of Symposia in Pure Mathematics*, 24, 181–193. [LMFDB: zeros of the Riemann zeta function](https://www.lmfdb.org/zeros/zeta/).
- Platt, D. and Trudgian, T. (2021), [The Riemann hypothesis is true up to 3·10¹²](https://doi.org/10.1112/blms.12460), *Bulletin of the London Mathematical Society*, 53, 792–797 ([arXiv:2004.09765](https://arxiv.org/abs/2004.09765)).
- Schoenfeld, L. (1976), [Sharper bounds for the Chebyshev functions θ(x) and ψ(x). II](https://doi.org/10.1090/S0025-5718-1976-0457374-X), *Mathematics of Computation*, 30, 337–360: the bound on $|\pi(x) - \operatorname{li}(x)|$. Conrey, J. B. (1989), [More than two fifths of the zeros of the Riemann zeta function are on the critical line](https://doi.org/10.1515/crll.1989.399.1), *Journal für die reine und angewandte Mathematik*, 399, 1–26.
- Pratt, K., Robles, N., Zaharescu, A. and Zeindler, D. (2020), [More than five-twelfths of the zeros of ζ are on the critical line](https://doi.org/10.1007/s40687-019-0199-8), *Research in the Mathematical Sciences*, 7, article 2.
- Preprints, not yet refereed: Alpöge, L. and Furman, R. (2026), [More than two thirds of the zeta zeros are simple and on the critical line](https://arxiv.org/abs/2608.13637), arXiv:2608.13637. Lamzouri, Y. (2026), [A new proof that more than 2/3 of the zeros of the Riemann zeta function are simple and on the critical line](https://arxiv.org/abs/2609.02882), arXiv:2609.02882. Liu, B. (2026), [Improved zero-free half-planes for the quasi-Riemann hypothesis](https://arxiv.org/abs/2610.12234), arXiv:2610.12234.
- NIST Digital Library of Mathematical Functions, [§25.10 Zeros of the Riemann zeta function](https://dlmf.nist.gov/25.10): $Z(t)$, $\theta(t)$ and the Riemann–Siegel formula.

<LearnCta position="bottom" chart="zeta function chart" demo="line-chart" demoLabel="line chart" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line series documentation" />
