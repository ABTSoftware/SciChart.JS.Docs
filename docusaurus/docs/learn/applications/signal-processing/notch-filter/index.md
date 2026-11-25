---
sidebar_position: 140
sidebar_label: Notch Filter
title: "Notch (Band-Stop) Filter: How It Works and How to Remove Mains Hum"
description: "What a notch (band-stop) filter is and does: centre frequency, Q and bandwidth, the transfer function, twin-T and digital biquad designs, and a live 50/60 Hz hum removal demo."
keywords:
    [
        "notch filter",
        "band stop filter",
        "band-stop filter",
        "what is a notch filter",
        "what does a notch filter do",
        "how does a notch filter work",
        "notch filter circuit",
        "twin t notch filter",
        "notch filter transfer function",
        "notch filter design",
        "active notch filter",
        "passive notch filter",
        "tunable notch filter",
        "60hz notch filter",
        "50hz notch filter",
        "band stop filter applications",
        "band stop filter frequency response"
    ]
image: /img/learn/notch-filter-og.png
related: [band-pass-filter, high-pass-filter, fir-vs-iir-filters, bode-plot]
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
                    "name": "What does a notch filter do?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A notch filter removes one narrow band of frequencies and leaves the rest of the signal almost untouched. It is used when a single unwanted tone sits on top of a useful signal, such as 50 or 60 Hz mains hum on an ECG, EEG or audio recording, acoustic feedback in a PA system, or a mechanical resonance in a control loop." }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between a notch filter and a band-stop filter?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A notch filter is a band-stop filter with a very narrow stopband. Band-stop (or band-reject) is the general name for any filter that removes the frequencies between two limits and passes those on either side. When the removed band is wide, it is usually called a band-stop filter; when it is narrow and aimed at one frequency, it is called a notch filter." }
                },
                {
                    "@type": "Question",
                    "name": "What is the Q of a notch filter?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Q is the notch's centre frequency divided by its bandwidth, measured between the points where the gain is 3 dB down. A 50 Hz notch with Q = 10 is about 5 Hz wide; with Q = 100 it is about 0.5 Hz wide. A higher Q removes less of the nearby signal, but rings for longer after a sudden change and misses the interference if its frequency drifts." }
                },
                {
                    "@type": "Question",
                    "name": "How does a twin-T notch filter work?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A twin-T notch filter puts two T-shaped RC networks in parallel: a low-pass T made of two resistors R and a capacitor 2C, and a high-pass T made of two capacitors C and a resistor R/2. At the notch frequency, f0 = 1 / (2 pi R C), the two paths deliver signals of equal size and opposite phase, which cancel at the output." }
                },
                {
                    "@type": "Question",
                    "name": "Should I use a 50 Hz or a 60 Hz notch filter?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use the mains frequency of the place where the data was recorded. Most of Europe, Africa, Asia and Australia use 50 Hz; North America, Brazil, South Korea, Taiwan and Saudi Arabia use 60 Hz; Japan uses 50 Hz in the east and 60 Hz in the west. If in doubt, look for the hum peak in the signal's spectrum before choosing." }
                },
                {
                    "@type": "Question",
                    "name": "How do I make a notch filter in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Compute the coefficients of a second-order IIR notch (a biquad) from the centre frequency, Q and sample rate, then run each sample through the difference equation y[n] = b0 x[n] + b1 x[n-1] + b2 x[n-2] - a1 y[n-1] - a2 y[n-2]. Run one biquad per harmonic to remove 50, 100 and 150 Hz together. To chart the result with SciChart.js, apply the filter with an XyCustomFilter." }
                }
            ]
        })}
    </script>
</head>

# Notch Filter

## What is a notch filter?

A **notch filter** (also called a band-stop or band-reject filter when the band is wider) is a filter that removes a narrow band of frequencies around one **centre frequency** and passes everything else almost unchanged. Its best-known job is deleting 50 or 60 Hz mains hum from ECG, EEG, audio and sensor signals.

![An ECG-like trace covered in 50 Hz mains hum in orange, and the same trace after a notch filter in blue, with the spectrum below showing the hum peaks at 50 Hz and its harmonics removed, in a dark navy theme](/img/learn/notch-filter-og.png)

*An ECG-like signal with mains hum (orange) and after a 50 Hz notch filter with notches at the harmonics (blue). Below: the spectrum before and after, and the filter's gain in yellow (sample data). [Try the interactive version](#how-to-remove-mains-hum-with-a-notch-filter-in-javascript-react-or-angular).*

:::tip Key takeaways
- A notch filter removes one narrow band and keeps the rest. A band-stop filter is the same idea with a wider band.
- It is set by its centre frequency $f_0$, its bandwidth (or Q $= f_0/\text{bandwidth}$) and its depth.
- The classic circuit is the twin-T, with $f_0 = 1/(2\pi RC)$. In code, it's a second-order IIR filter (a biquad) with zeros on the unit circle.
- To remove mains hum, notch the fundamental (50 or 60 Hz) and its harmonics, with a Q low enough to allow for the mains frequency drifting.
- A narrower notch rings for longer: width in hertz times ringing time in seconds is about $1/\pi$.
:::

## What does a notch filter do?

A notch filter is the right tool when one known tone sits on top of a signal you want to keep, and the tone falls inside the signal's own frequency range, so a [low-pass](/learn/applications/signal-processing/low-pass-filter/) or [high-pass filter](/learn/applications/signal-processing/high-pass-filter/) would remove useful content with it.

| Field | What the notch filter removes | Typical centre |
| --- | --- | --- |
| ECG, EEG and EMG | Mains interference picked up by the body and the leads | 50 or 60 Hz, sometimes with harmonics |
| Audio recording | Hum and buzz from ground loops and lighting | 50 or 60 Hz and their harmonics |
| Live sound | Feedback (howl) between a microphone and loudspeakers | Wherever the howl starts; feedback suppressors place notches automatically |
| Control systems | A mechanical resonance that would make a motor or servo loop oscillate | The resonant frequency of the mechanism |
| Sensors and test equipment | A known interfering tone, such as a power supply's switching frequency or a vibration source | That tone |
| Radio | A strong interfering station or carrier | The interferer's frequency |
| Optics | A laser line, for example in Raman spectroscopy, so the weaker light around it can be measured | The laser wavelength |

In images, the same idea removes a regular pattern, such as scan lines or a printed screen: the pattern shows up as bright spots in the 2-D Fourier transform, and notching them out removes it.

## How a notch filter works

Like any filter, a notch filter is described by its **frequency response**: how much it scales each frequency, usually drawn as a [Bode plot](/learn/applications/signal-processing/bode-plot/) of gain in decibels (dB) against frequency.

![On the left, the gain of two notch filters centred on 50 Hz: the Q = 2 notch is 25 Hz wide at the minus 3 dB line, the Q = 10 notch five times narrower, and both fall to minus infinity at 50 Hz. On the right, the z-plane of the digital version: two zeros on the unit circle at the notch frequency, and two poles just inside them](./notch-filter-anatomy.svg)

A notch is described by its centre frequency, bandwidth, Q and depth:

- **Centre frequency ($f_0$).** The frequency it removes, also called the notch or null frequency.
- **Bandwidth ($B$).** The width of the notch between the two points where the gain is 3 dB down (half power, about 71% amplitude). Some datasheets quote the width at another level, such as −10 dB; check which one.
- **Quality factor ($Q$).** How sharp the notch is: $Q = f_0 / B$. A 50 Hz notch with $Q = 10$ is about 5 Hz wide.
- **Depth.** How much the centre frequency is reduced. An ideal notch removes it completely (−∞ dB). A real circuit's depth is limited by how well its components match; a digital notch is exact at $f_0$, so its depth in practice depends on how closely $f_0$ matches the interference.

### Notch filter transfer function

The standard second-order notch, with $\omega_0 = 2\pi f_0$, is:

$$
H(s) = \frac{s^2 + \omega_0^2}{s^2 + \dfrac{\omega_0}{Q}\,s + \omega_0^2}
$$

The numerator is zero at $s = \pm j\omega_0$, so the gain at $f_0$ is exactly zero. Far below and far above $f_0$, the numerator and denominator are almost equal, so the gain is 1 (0 dB). The middle term of the denominator sets how quickly the gain recovers on either side: the larger $Q$, the narrower the notch. Its magnitude is

$$
|H(f)| = \frac{|f_0^2 - f^2|}{\sqrt{(f_0^2 - f^2)^2 + (f f_0 / Q)^2}}
$$

The gain dips only near $f_0$, but the phase moves there too. It falls to −90° just below the centre, jumps to +90° just above it, and returns to 0° away from the notch. Frequencies close to the notch are delayed or advanced, which changes the shape of any waveform with energy there (see [side effects](#notch-filter-side-effects-phase-ringing-and-settling)).

### Notch filter vs band-stop filter

A notch filter is a band-stop filter so narrow that it is described by a single centre frequency and a Q, with a V-shaped dip where a wider **band-stop filter** (or band-reject filter) has a flat-bottomed stopband between two cutoffs. There is no fixed Q at which one name gives way to the other; the [comparison table](#notch-vs-band-stop-vs-low-pass-filter) below sets them side by side.

## Choosing Q: a worked example

The table shows a digital notch at 50 Hz, sampled at 1,000 samples per second, for five values of Q. "Rings for" is the time constant of the filter's ringing: after a sudden change in the input, the ringing at 50 Hz decays to 37% in this time.

| Q | −3 dB width | Rings for | Gain if the hum is at 50.1 Hz | at 50.2 Hz | at 50.5 Hz | Gain at 45 Hz |
| --- | --- | --- | --- | --- | --- | --- |
| 2 | 24.5 Hz | 13 ms | −41.8 dB | −35.8 dB | −27.9 dB | −8.1 dB |
| 5 | 9.8 Hz | 32 ms | −33.8 dB | −27.8 dB | −19.9 dB | −2.7 dB |
| 10 | 4.9 Hz | 65 ms | −27.8 dB | −21.8 dB | −14.1 dB | −0.9 dB |
| 30 | 1.6 Hz | 194 ms | −18.3 dB | −12.5 dB | −5.7 dB | −0.1 dB |
| 100 | 0.49 Hz | 647 ms | −8.5 dB | −4.0 dB | −0.9 dB | 0.0 dB |

- A very sharp notch is fragile. At $Q = 100$, mains hum only 0.2 Hz off nominal is reduced by just 4 dB. Grid frequency does drift: in Great Britain, for example, it is allowed to stray by up to 1% (0.5 Hz) from 50 Hz.
- A wide notch removes signal too. At $Q = 2$, a component at 45 Hz loses 8 dB. On an ECG, that is part of the sharp QRS complex.
- Width and ringing trade off. Width in hertz times the ringing time constant in seconds is almost exactly $1/\pi$ (about 0.32) at every Q in the table above 2: halve the width and the filter rings twice as long.
- For mains hum in this example, a Q of about 10 to 30 balances the three: a few hertz wide or less, tolerant of normal drift, and settling within a fraction of a second.

## Notch filter circuits

An analogue notch filter is built from a twin-T network, an op-amp circuit or an inductor and capacitor.

### Twin-T notch filter

The **twin-T** is the classic **passive notch filter**: six components and no power supply.

![A twin-T notch filter: a low-pass T of two resistors R and a capacitor 2C in parallel with a high-pass T of two capacitors C and a resistor R/2, between the input and the output. At f0 = 1 / (2 pi R C) the two paths cancel. Example values: R = 31.6 kilohms and C = 100 nanofarads give about 50.4 Hz](./twin-t-notch-filter-circuit.svg)

It works by cancellation. The upper T (two resistors and a capacitor to ground) is a low-pass network, so it delays the phase; the lower T (two capacitors and a resistor to ground) is a high-pass network, so it advances it. At one frequency the two paths deliver signals of equal size and opposite phase, and they cancel at the output:

$$
f_0 = \frac{1}{2\pi RC}
$$

For a 50 Hz twin-T, choose $C = 100$ nF. Then $R = 1/(2\pi \times 50 \times 100 \times 10^{-9}) \approx 31.8$ kΩ. The nearest standard value is 31.6 kΩ, which gives $f_0 \approx 50.4$ Hz; the shunt parts are $2C = 200$ nF and $R/2 = 15.8$ kΩ. For a 60 Hz notch filter with the same capacitors, $R \approx 26.5$ kΩ (26.7 kΩ gives 59.6 Hz).

The passive twin-T has two practical limits:

- Low Q. A passive twin-T driven from a low-impedance source into a high-impedance load has $Q = 1/4$: the notch is deep but very wide, so it also cuts frequencies an octave or more away.
- Depth depends on matching. The cancellation is only perfect if the components are in exact ratio. With ordinary 5% parts, the null is shallow and slightly off frequency, so precision parts or a trimmer are used.

### Active notch filters

An **active notch filter** adds one or more op-amps to fix both limits:

- Bootstrapped twin-T. A buffer at the output feeds part of the output back to the twin-T's ground point. This sharpens the notch, and the feedback fraction sets Q.
- Fliege notch. A two-op-amp circuit in which a matched pair of resistors and capacitors sets $f_0$ and a separate resistor ratio sets Q, so the width can be changed without moving the centre.
- State-variable and biquad filters. Op-amp filters with separate low-pass, band-pass and high-pass outputs. Adding the low-pass and high-pass outputs gives a notch. Several of these use ganged potentiometers or digital potentiometers to make a **tunable notch filter**.

### LC notch filters

At radio frequencies, notches are built from inductors and capacitors. A series LC circuit from the signal line to ground is a short circuit at its resonance, $f_0 = 1/(2\pi\sqrt{LC})$, so it shunts that frequency away (a "trap"); a parallel LC circuit in series with the line has a very high impedance at resonance and blocks it. A resistor in the loop sets the Q.

## Digital notch filters

In software, a notch filter is a second-order IIR filter, often called a **biquad**. Its output depends on the last two inputs and the last two outputs:

$$
y[n] = b_0 x[n] + b_1 x[n-1] + b_2 x[n-2] - a_1 y[n-1] - a_2 y[n-2]
$$

The design is clearest on the **z-plane** (the diagram above, right). Each frequency is a point on the unit circle (the circle of radius 1), from 0 Hz at the right to half the sample rate at the left. With $\omega_0 = 2\pi f_0 / f_s$ the notch frequency in radians per sample:

- Two zeros on the unit circle at angle $\pm\omega_0$ make the gain exactly zero at $f_0$: the notch.
- Two poles at the same angle, just inside the circle, at radius $r$ slightly below 1, bring the gain back to 1 a short distance either side. The closer $r$ is to 1, the narrower the notch.

In this form, $H(z) = \dfrac{1 - 2\cos\omega_0\, z^{-1} + z^{-2}}{1 - 2r\cos\omega_0\, z^{-1} + r^2 z^{-2}}$, and the bandwidth is roughly $(1 - r) f_s / \pi$.

To get the coefficients from $f_0$ and $Q$ directly, the demo uses the bilinear-transform recipe from the *Audio EQ Cookbook*:

$$
\alpha = \frac{\sin\omega_0}{2Q}, \qquad b = \frac{[\,1,\ -2\cos\omega_0,\ 1\,]}{1 + \alpha}, \qquad a = \Big[\,1,\ \frac{-2\cos\omega_0}{1+\alpha},\ \frac{1-\alpha}{1+\alpha}\,\Big]
$$

Its −3 dB width is exactly $\tfrac{f_s}{\pi}\arctan\alpha$, very close to $f_0/Q$ when $f_0$ is well below the sample rate.

Other digital approaches:

- **FIR notch.** Zeros alone, $1 - 2\cos\omega_0\,z^{-1} + z^{-2}$, make a notch with no feedback, but it's very wide. A sharp FIR notch needs a long kernel (several hundred to about a thousand taps for a few hertz at 1,000 samples per second), in exchange for linear phase.
- **Forward-backward (zero-phase) filtering.** Run the biquad over recorded data forwards, then backwards. The phase shifts cancel and the notch gets twice as deep (in dB), at the cost of working offline only.
- **Adaptive notch filter.** An adaptive filter, such as an LMS noise canceller fed with a reference taken from the mains, tracks the interference as its frequency and amplitude change, instead of using a fixed $f_0$.
- **Spectral editing.** Take the [FFT](/learn/applications/signal-processing/fast-fourier-transform/), set the bins around the hum to zero, and transform back. This is simple but leaks unless the hum sits exactly on a bin, and it treats the whole recording as one block.

## Removing mains hum and its harmonics

**Mains hum** is interference at the frequency of the electricity supply. It couples into the leads of an ECG or EEG, into microphone cables and into sensor wiring, through electric and magnetic fields and through ground loops.

| Mains frequency | Where |
| --- | --- |
| 50 Hz | Europe, the UK, most of Africa, China, India, Australia, most of the Middle East, Argentina; eastern Japan (including Tokyo) |
| 60 Hz | The USA, Canada, Mexico, Brazil, South Korea, Taiwan, the Philippines, Saudi Arabia; western Japan (including Osaka) |

Hum is rarely a pure sine. Rectifiers, lighting and motors distort the mains current, so hum usually comes with **harmonics** at whole multiples of the fundamental: 100, 150, 200 Hz… on a 50 Hz supply, or 120, 180, 240 Hz… on a 60 Hz one. A single 50 Hz notch leaves them all behind, which is why the hum still sounds like a buzz after notching.

To remove them, run a notch at each harmonic in a row (a cascade of biquads), all with the same Q so the higher notches are proportionally wider. A set of evenly spaced notches like this is a **comb filter**. It can also be built in one step as $y[n] = x[n] - x[n-D]$ with $D = f_s / f_0$ samples, which places zeros at every multiple of $f_0$ (including 0 Hz), but its notches are very wide unless feedback is added.

Check your result in the frequency domain: compute the [power spectral density](/learn/applications/signal-processing/power-spectral-density/) before and after, and the hum peaks should be gone with the rest of the spectrum unchanged. Hum often arrives together with slow baseline wander; remove that with a [high-pass filter](/learn/applications/signal-processing/high-pass-filter/), before or after the notch. Diagnostic ECGs use a cutoff of about 0.05 Hz, or up to 0.67 Hz with a linear-phase filter (Kligfield et al., 2007); about 0.5 Hz is a monitoring setting. A harmonic above half the sample rate doesn't vanish: it [aliases](/learn/applications/signal-processing/nyquist-and-aliasing/) to a lower frequency, where a notch at the "expected" harmonic won't find it.

## Notch vs band-stop vs low-pass filter

A notch removes one narrow band, a band-stop removes a wider one, and a low-pass removes everything above its cutoff.

| Filter | Removes | Use it when… | Example |
| --- | --- | --- | --- |
| Notch | One narrow band around $f_0$ | One known tone sits inside the band you need | 50 or 60 Hz hum on an ECG; feedback howl |
| Notch comb | A fundamental and its harmonics | The interference is periodic but not a pure sine | Mains hum with harmonics; a rotating machine's vibration |
| Band-stop | A wide band between two cutoffs | A whole range is unwanted but frequencies on both sides are needed | Blocking one radio band; removing a band of machine noise |
| [Low-pass](/learn/applications/signal-processing/low-pass-filter/) | Everything above a cutoff | The interference is above everything you need | 50 Hz hum on a signal that only needs 0 to 10 Hz, such as a slow temperature log |
| [High-pass](/learn/applications/signal-processing/high-pass-filter/) | Everything below a cutoff | The interference is below everything you need | Baseline wander and DC offset |
| Adaptive | Interference that it learns and tracks | The tone's frequency or amplitude changes over time | Hum on a long recording with a drifting supply |

If the wanted signal doesn't reach the hum frequency at all, a low-pass filter is simpler, removes the harmonics too, and doesn't ring at $f_0$. Reach for a notch only when the interference sits inside the band you need.

## Notch filter side effects: phase, ringing and settling

A notch has three side effects:

- Phase distortion near $f_0$. Components a few hertz either side of the notch are shifted in time (see [the phase](#notch-filter-transfer-function)), so a sharp feature with energy near $f_0$ changes shape.
- Ringing on transients. A notch filter's output is the input minus a narrow band around $f_0$. A sudden step or spike contains every frequency, so after it, the filter "rings" at $f_0$: a decaying 50 or 60 Hz oscillation that wasn't in the original. The narrower the notch, the longer the ringing (the table above). On an ECG, ringing after the QRS complex can look like real high-frequency activity, and it can distort the ST segment.
- Start-up settling. When a filter starts, it takes several ringing time constants before the hum is fully cancelled: with $Q = 30$ at 50 Hz, the first half-second or so of output still contains hum. Discard it, or start the filter from a steady state.

Try it in the [live demo](#how-to-remove-mains-hum-with-a-notch-filter-in-javascript-react-or-angular): tick **Add a step**, then raise and lower Q, and zoom in on the time chart just after 2.5 seconds.

Forward-backward filtering removes the phase distortion of recorded data, and spreads the ringing either side of the step instead of after it. It doesn't remove the ringing.

## Common notch filter mistakes

Most notch problems come from aiming at the wrong frequency, or from a notch that is narrower than the hum's drift.

- **Notching before you look.** Check the spectrum first. If the "hum" is broadband noise, or a peak at a different frequency, a notch at 50 Hz does nothing useful and still distorts the signal.
- **Using the wrong mains frequency.** A 60 Hz notch on data recorded on a 50 Hz supply removes a slice of the signal and leaves the hum untouched. Data from other countries, or open datasets, may have been recorded on a different supply from yours.
- **Making Q too high.** A very narrow notch looks clean on a design plot, but the mains frequency drifts, so the hum slides off the side of the notch. Check the attenuation a few tenths of a hertz either side of nominal.
- **Forgetting the harmonics.** A 50 Hz notch leaves 100, 150, 200 and 250 Hz behind. Notch the harmonics too, or low-pass the signal if it doesn't need those frequencies.
- **Mistaking ringing for signal.** Decaying oscillations at $f_0$ after a spike or step are made by the filter. Compare with the unfiltered trace before interpreting them.
- **Designing for the wrong sample rate.** Digital coefficients depend on $f_0 / f_s$. Coefficients designed for 500 samples per second put the notch at the wrong frequency at 1,000.
- **Hiding a wiring problem.** Strong hum often means a poor electrode contact, an unshielded cable or a ground loop. Fix the wiring or grounding first; a notch also removes any real signal at $f_0$.

## How to remove mains hum with a notch filter in JavaScript, React or Angular

The demo generates 4,096 samples of an ECG-like signal at 1,000 samples per second, adds hum at the mains frequency and four of its harmonics, and refilters and redraws both charts whenever you change a setting. In the demo below, the top chart shows an ECG-like signal covered in mains hum (orange) and the notch-filtered result (blue). The bottom chart shows the spectrum of each, with the filter's gain in yellow on the right-hand axis. The hum in this sample sits 0.2 Hz above the nominal mains frequency, as real mains often does.

Choose **50 or 60 Hz** mains, move the **notch centre** off the hum to see it come back, change **Q**, and set how many **notches** (the fundamental and its harmonics) to use. **Show** switches between the signal before, after, or both, and **Add a step** adds a sudden electrode artefact at 2.5 seconds to show the filter ringing. The readout gives the hum reduction, the notch's −3 dB width and how long it rings. Hover over the spectrum to read the level at each harmonic; scroll to zoom, drag to pan and double-click to reset.

<LiveDocSnippet maxWidth={'100%'} height={760} name="./Basic/demo" />

<LearnCta position="top" chart="notch filter" demo="trend-ma-ratio" demoLabel="trendline and moving average filters" docs="/2d-charts/chart-types/data-filters-api/custom-filter/" docsLabel="SciChart.js custom filter documentation" />

Here is the code for this chart. The notch design, the filter and the FFT are plain JavaScript, and SciChart.js applies the filter to the chart's data with an `XyCustomFilter`.

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
        XyCustomFilter,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Second-order IIR notch (Audio EQ Cookbook form): zeros on the unit circle at the centre frequency
    const designNotch = (centreHz: number, q: number, sampleRate: number) => {
        const w0 = (2 * Math.PI * centreHz) / sampleRate;
        const alpha = Math.sin(w0) / (2 * q);
        const a0 = 1 + alpha;
        return { b: [1 / a0, (-2 * Math.cos(w0)) / a0, 1 / a0], a: [1, (-2 * Math.cos(w0)) / a0, (1 - alpha) / a0] };
    };

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)" }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Signal" }));

        const { xValues, yValues, sampleRate } = getYourSignalData(); // evenly spaced samples
        const raw = new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Raw" });

        // Notches at 50, 100 and 150 Hz, Q = 20 (use 60, 120, 180 Hz on a 60 Hz supply)
        const sections = [50, 100, 150].map((f) => designNotch(f, 20, sampleRate));
        let filtered: number[] = [];
        // An IIR filter depends on all earlier samples, so filter the whole series once
        // on a full recompute (index 0) or an append, then return one value per call
        const notchAt = (index: number) => {
            if (index === 0 || index >= filtered.length) {
                const values = raw.getNativeYValues();
                let signal: number[] = [];
                for (let i = 0; i < raw.count(); i++) signal.push(values.get(i));
                for (const { b, a } of sections) {
                    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
                    signal = signal.map((x) => {
                        const y = b[0] * x + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2;
                        [x2, x1, y2, y1] = [x1, x, y1, y];
                        return y;
                    });
                }
                filtered = signal;
            }
            return filtered[index];
        };
        const clean = new XyCustomFilter(raw, { dataSeriesName: "Notch filtered", filterFunction: notchAt });

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { dataSeries: raw, stroke: "#F48420" }),
            new FastLineRenderableSeries(wasmContext, { dataSeries: clean, stroke: "#50C7E0", strokeThickness: 2 })
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

    export const NotchFilterChart = () => (
        <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />
    );
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        XyCustomFilter,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Second-order IIR notch (Audio EQ Cookbook form): zeros on the unit circle at the centre frequency
    const designNotch = (centreHz: number, q: number, sampleRate: number) => {
        const w0 = (2 * Math.PI * centreHz) / sampleRate;
        const alpha = Math.sin(w0) / (2 * q);
        const a0 = 1 + alpha;
        return { b: [1 / a0, (-2 * Math.cos(w0)) / a0, 1 / a0], a: [1, (-2 * Math.cos(w0)) / a0, (1 - alpha) / a0] };
    };

    @Component({
        selector: "app-notch-filter-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class NotchFilterChartComponent {
        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)" }));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Signal" }));

            const { xValues, yValues, sampleRate } = getYourSignalData(); // evenly spaced samples
            const raw = new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Raw" });

            // Notches at 50, 100 and 150 Hz, Q = 20 (use 60, 120, 180 Hz on a 60 Hz supply)
            const sections = [50, 100, 150].map((f) => designNotch(f, 20, sampleRate));
            let filtered: number[] = [];
            // An IIR filter depends on all earlier samples, so filter the whole series once
            // on a full recompute (index 0) or an append, then return one value per call
            const notchAt = (index: number) => {
                if (index === 0 || index >= filtered.length) {
                    const values = raw.getNativeYValues();
                    let signal: number[] = [];
                    for (let i = 0; i < raw.count(); i++) signal.push(values.get(i));
                    for (const { b, a } of sections) {
                        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
                        signal = signal.map((x) => {
                            const y = b[0] * x + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2;
                            [x2, x1, y2, y1] = [x1, x, y1, y];
                            return y;
                        });
                    }
                    filtered = signal;
                }
                return filtered[index];
            };
            const clean = new XyCustomFilter(raw, { dataSeriesName: "Notch filtered", filterFunction: notchAt });

            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { dataSeries: raw, stroke: "#F48420" }),
                new FastLineRenderableSeries(wasmContext, { dataSeries: clean, stroke: "#50C7E0", strokeThickness: 2 })
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

- `XyCustomFilter` is a data series computed from another series by a `filterFunction(index, y)`. SciChart.js calls it for each sample in index order: from index 0 when the filter is created or its function is set, and from the first new index when data is appended.
- An IIR notch depends on every earlier sample, so the filter function runs the whole cascade once when it sees index 0 (or new data) and returns cached values for the other indices. Setting `filterFunction` again reruns it; the demo does this whenever a control moves.
- The spectrum chart has two y-axes: amplitude in dB on the left, and the filter's gain in dB on a right-hand axis (`axisAlignment: EAxisAlignment.Left` and `EAxisAlignment.Right`), linked to the gain series by `yAxisId`.
- The spectrum is a Hann-windowed radix-2 FFT of the 4,096 samples before and after filtering, drawn as two `FastLineRenderableSeries`.

**See it in the demo app:** [JavaScript trendline and moving average filters](https://www.scichart.com/demo/javascript/trend-ma-ratio) · [React trendline and moving average filters](https://www.scichart.com/demo/react/trend-ma-ratio) · [Angular trendline and moving average filters](https://www.scichart.com/demo/angular/trend-ma-ratio), for SciChart.js's built-in data filters. For the signal a notch filter is most often used on, see the [React vital signs ECG/EKG medical chart](https://www.scichart.com/demo/react/vital-signs-ecg-medical-chart-example).

**Go deeper:** [SciChart.js custom filter documentation](/2d-charts/chart-types/data-filters-api/custom-filter/), and the [Filters API overview](/2d-charts/chart-types/data-filters-api/data-filters-api-overview/).

## Frequently asked questions

### What does a notch filter do?

A notch filter removes one narrow band of frequencies and leaves the rest of the signal almost untouched. It is used when a single unwanted tone sits on top of a useful signal, such as 50 or 60 Hz mains hum on an ECG, EEG or audio recording, acoustic feedback in a PA system, or a mechanical resonance in a control loop.

### What is the difference between a notch filter and a band-stop filter?

A notch filter is a band-stop filter with a very narrow stopband. Band-stop (or band-reject) is the general name for any filter that removes the frequencies between two limits and passes those on either side. When the removed band is wide, it is usually called a band-stop filter; when it is narrow and aimed at one frequency, it is called a notch filter.

### What is the Q of a notch filter?

Q is the notch's centre frequency divided by its bandwidth, measured between the points where the gain is 3 dB down. A 50 Hz notch with Q = 10 is about 5 Hz wide; with Q = 100 it is about 0.5 Hz wide. A higher Q removes less of the nearby signal, but rings for longer after a sudden change and misses the interference if its frequency drifts.

### How does a twin-T notch filter work?

A twin-T notch filter puts two T-shaped RC networks in parallel: a low-pass T made of two resistors R and a capacitor 2C, and a high-pass T made of two capacitors C and a resistor R/2. At the notch frequency, f0 = 1 / (2 pi R C), the two paths deliver signals of equal size and opposite phase, which cancel at the output.

### Should I use a 50 Hz or a 60 Hz notch filter?

Use the mains frequency of the place where the data was recorded. Most of Europe, Africa, Asia and Australia use 50 Hz; North America, Brazil, South Korea, Taiwan and Saudi Arabia use 60 Hz; Japan uses 50 Hz in the east and 60 Hz in the west. If in doubt, look for the hum peak in the signal's spectrum before choosing.

### How do I make a notch filter in JavaScript?

Compute the coefficients of a second-order IIR notch (a biquad) from the centre frequency, Q and sample rate, then run each sample through the difference equation y[n] = b0 x[n] + b1 x[n-1] + b2 x[n-2] - a1 y[n-1] - a2 y[n-2]. Run one biquad per harmonic to remove 50, 100 and 150 Hz together. To chart the result with SciChart.js, apply the filter with an XyCustomFilter.

## Sources

- Smith, S. W., *The Scientist and Engineer's Guide to Digital Signal Processing*: [chapter 19, Recursive Filters: narrow-band filters](https://www.dspguide.com/ch19/3.htm) (band-pass and band-reject recursive filters from pole and zero placement).
- Bristow-Johnson, R., [Audio EQ Cookbook](https://www.w3.org/TR/audio-eq-cookbook/). W3C Group Note. The biquad notch coefficients used in the demo.
- Smith, J. O., [Introduction to Digital Filters with Audio Applications](https://ccrma.stanford.edu/~jos/filters/). Center for Computer Research in Music and Acoustics, Stanford University. Poles, zeros and the z-plane.
- Oppenheim, A. V. and Schafer, R. W. (2010), *Discrete-Time Signal Processing*, 3rd edition, Pearson. IIR filter design and the bilinear transform.
- Horowitz, P. and Hill, W. (2015), *The Art of Electronics*, 3rd edition, Cambridge University Press. Twin-T and active notch filters.
- Kligfield, P. et al. (2007), [Recommendations for the Standardization and Interpretation of the Electrocardiogram, Part I](https://doi.org/10.1161/CIRCULATIONAHA.106.180200). *Circulation*, 115(10), 1306–1324. The 0.05 Hz and 0.67 Hz low-frequency cutoffs for diagnostic ECGs.
- Widrow, B. et al. (1975), [Adaptive noise cancelling: principles and applications](https://doi.org/10.1109/PROC.1975.10036). *Proceedings of the IEEE*, 63(12). Adaptive cancellation of mains interference in ECGs.
- [The Electricity Safety, Quality and Continuity Regulations 2002, regulation 27](https://www.legislation.gov.uk/uksi/2002/2665/regulation/27) (the ±1% limit on mains frequency in Great Britain), and the IEC's [World Plugs](https://www.iec.ch/world-plugs) list of mains frequencies by country.

<LearnCta position="bottom" chart="notch filter" demo="trend-ma-ratio" demoLabel="trendline and moving average filters" docs="/2d-charts/chart-types/data-filters-api/custom-filter/" docsLabel="SciChart.js custom filter documentation" />
