---
sidebar_position: 180
sidebar_label: Vibration Analysis
title: "Vibration Analysis: How to Read Vibration Spectra and Find Machine Faults (With an Interactive Example)"
description: "What vibration analysis is, how sensors, units and ISO 20816 severity zones work, how to read a time waveform and FFT spectrum, and the signatures of imbalance, misalignment, looseness and bearing faults."
keywords:
    [
        "vibration analysis",
        "what is vibration analysis",
        "vibration spectrum analysis",
        "machine vibration analysis",
        "motor vibration analysis",
        "pump vibration analysis",
        "rotating equipment vibration analysis",
        "predictive maintenance vibration analysis",
        "vibration monitoring and analysis",
        "vibration analysis sensor",
        "vibration severity",
        "ISO 20816",
        "bearing fault frequencies",
        "BPFO BPFI",
        "envelope analysis",
        "1x 2x vibration"
    ]
image: /img/learn/vibration-analysis-og.png
related: [fast-fourier-transform, spectrogram, hilbert-transform, power-spectral-density]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is vibration analysis?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Vibration analysis is a way of checking a machine's health from the way it shakes. Sensors on the bearings record vibration, software turns it into a time waveform and a frequency spectrum, and analysts look for the patterns that faults leave, such as a high peak at the shaft speed for imbalance. It lets maintenance teams find faults early and plan repairs before a breakdown."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What are the three types of vibration measurement?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Vibration is measured as displacement, velocity or acceleration. Displacement, in micrometres peak-to-peak, suits low frequencies and shaft movement in sleeve bearings. Velocity, in mm/s RMS, is used for overall machine condition and the ISO severity limits. Acceleration, in g, suits high frequencies, where bearing and gear faults show first."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is 1× and 2× in vibration analysis?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "1× is the vibration at the shaft's running speed, once per revolution: 30 Hz for a shaft at 1,800 rpm. 2× is twice the running speed, 3× three times, and so on. A high 1× usually means imbalance, a high 2× often means misalignment, and a long row of harmonics suggests mechanical looseness."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What are BPFO and BPFI?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "BPFO and BPFI are the ball pass frequencies of the outer and inner race of a rolling-element bearing: the rate at which balls or rollers pass a defect on that race. They depend on the shaft speed and the bearing's geometry, and are not whole multiples of the shaft speed. For a 6205-size ball bearing, BPFO is about 3.59 times and BPFI about 5.42 times the shaft speed."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is an acceptable vibration level for a motor or pump?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "ISO 20816-3 gives zone limits in mm/s RMS, measured on the bearing housings over 10 to 1,000 Hz. For a medium-sized machine of 15 to 300 kW on a rigid base, below 1.4 mm/s is as new, up to 2.8 mm/s is acceptable long term, 2.8 to 4.5 mm/s needs a planned repair, and above 4.5 mm/s risks damage. Larger machines and flexible mounts have higher limits."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot a vibration spectrum in JavaScript?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Compute the spectrum with an FFT of a windowed block of samples, scale it to the units you need, such as velocity in mm/s RMS, and plot frequency against amplitude. With SciChart.js, put the result in an XyDataSeries, draw it with a FastMountainRenderableSeries, and add a VerticalLineAnnotation for each shaft order and bearing frequency. The same code works in React with scichart-react and in Angular with scichart-angular."
                    }
                }
            ]
        })}
    </script>
</head>

# Vibration Analysis

## What is vibration analysis?

**Vibration analysis** is the measurement and study of how a machine shakes, to judge its condition and find faults before they cause a breakdown. A sensor on a bearing housing records the vibration; software turns it into a time waveform and a frequency spectrum, and each fault, such as imbalance, misalignment or a damaged bearing, leaves its own pattern of peaks.

![A simulated motor with an outer-race bearing fault in a dark navy theme: a time waveform with sharp repeated impacts, a velocity spectrum with order markers 1× to 8× and a small BPFO line, and an envelope spectrum with clear peaks at BPFO and its harmonics](/img/learn/vibration-analysis-og.png)

*A simulated motor with a damaged outer bearing race: the time waveform, the velocity spectrum with shaft-speed markers, and the envelope spectrum where the bearing's defect frequency stands out (sample data). [Try the interactive version](#how-to-plot-a-vibration-spectrum-in-javascript-react-or-angular).*

:::tip Key takeaways
- Vibration analysis finds machine faults from the way a machine shakes, often weeks or months before they would stop it.
- Overall vibration, in mm/s RMS, says how bad things are; ISO 20816 sorts it into zones A to D.
- The spectrum says what is wrong: each fault shows up at its own multiple of the shaft speed, or at a bearing's defect frequency.
- Early bearing damage barely moves the overall level. Envelope analysis of the high-frequency band finds it.
- Trend every measurement point over time; the change matters more than any single reading.
:::

It's used on motors, pumps, fans, compressors, gearboxes, turbines and almost any machine that turns.

## Why vibration analysis is used: condition monitoring and predictive maintenance

Machines can be maintained three ways: run them until they break, service them on a fixed schedule, or watch their condition and act when it changes. Watching them is called **condition monitoring**, and planning repairs from what it shows is **predictive maintenance**.

Vibration suits rotating machines because almost every mechanical fault changes the forces inside a machine, and changed forces change the vibration. A worn bearing, a loose foot or a shifted coupling all show up long before the machine is noisy, hot or visibly damaged. NASA's reliability-centred maintenance guide covers vibration monitoring and analysis as one of its main predictive testing techniques.

A vibration programme usually works like this:

1. Choose the machines that matter, and mark fixed measurement points on each bearing, in the horizontal, vertical and axial directions.
2. Take a reading at each point on a route every few weeks with a portable data collector, or fit permanent wireless or wired sensors that read continuously.
3. Trend the overall level at each point, and set alarms on it.
4. When a level rises or crosses an alarm, look at the spectrum and the time waveform to work out the fault and how serious it is.
5. Plan the repair, then measure again after it to confirm the fix.

## Vibration sensors and units

Vibration can be measured as displacement (how far the surface moves), velocity (how fast it moves) or acceleration (how fast its velocity changes). For a single frequency $f$, they are linked by factors of $2\pi f$:

$$
v = \frac{a}{2\pi f}, \qquad d = \frac{v}{2\pi f}
$$

So the same vibration looks large in displacement at low frequencies and large in acceleration at high frequencies. Each sensor suits a band of frequencies and a kind of fault.

| Sensor | Measures | Usual units | Best for |
| --- | --- | --- | --- |
| Accelerometer (piezoelectric or MEMS), on the bearing housing | Acceleration | g (1 g = 9.81 m/s²) | General use, from a few hertz to over 10 kHz; bearing and gear faults, which show at high frequencies |
| Velocity sensor, or an accelerometer whose signal is integrated | Velocity | mm/s (in/s in the USA) | Overall machine condition from about 10 Hz to 1 kHz; the quantity severity standards use |
| Proximity probe (eddy-current), mounted through the bearing | Shaft displacement relative to the bearing | µm (or mils) peak-to-peak | Shafts in fluid-film (sleeve) bearings on turbines and large compressors; low frequencies and shaft orbits |

Most portable data collectors and wireless sensors use an accelerometer, and compute velocity from it.

### Peak, peak-to-peak and RMS

A vibration amplitude can be given three ways. For a pure sine wave:

- Peak is the largest value from zero.
- Peak-to-peak is twice the peak: the full swing. It's the usual way to give displacement.
- RMS (root mean square) is the peak divided by √2, about 0.707 of it. It relates to the energy in the vibration, and it's how ISO severity limits are written.

These ratios only hold for a sine wave. Real vibration with impacts has a much higher peak than RMS, and the ratio of the two, the **crest factor**, is itself a useful sign of bearing damage.

A worked example: a motor vibrating at 5 mm/s RMS at its running speed of 30 Hz (1,800 rpm) has a peak velocity of 7.1 mm/s, an acceleration of 0.94 m/s² RMS (0.096 g), and a displacement of 26.5 µm RMS, or 75 µm peak-to-peak.

## Vibration severity: ISO 20816 zones

ISO 20816-3 (which replaced ISO 10816-3 in 2022) gives vibration limits for industrial machines over 15 kW running at 120 to 30,000 r/min. It measures the overall velocity, in mm/s RMS, on the bearing housings, over 10 to 1,000 Hz for machines above 600 r/min (2 to 1,000 Hz for slower ones), and sorts it into four zones:

- Zone A: typical of newly commissioned machines.
- Zone B: acceptable for unrestricted long-term running.
- Zone C: unsatisfactory for long-term running; plan a repair at the next opportunity.
- Zone D: severe enough to damage the machine.

The boundaries depend on the size of the machine and how stiff its support is:

| Machine group (ISO 20816-3) | Support | A/B | B/C | C/D |
| --- | --- | --- | --- | --- |
| Group 2: medium machines, 15 to 300 kW | Rigid | 1.4 mm/s | 2.8 mm/s | 4.5 mm/s |
| Group 2 | Flexible | 2.3 mm/s | 4.5 mm/s | 7.1 mm/s |
| Group 1: large machines, 300 kW to 50 MW | Rigid | 2.3 mm/s | 4.5 mm/s | 7.1 mm/s |
| Group 1 | Flexible | 3.5 mm/s | 7.1 mm/s | 11.0 mm/s |

The standard also treats a large change as significant on its own, even inside zone B; a change of more than 25% of the B/C boundary is the usual guide. Other parts of the series cover other machines, such as large steam turbines, gas turbines and wind turbines.

## Time waveform vs spectrum: how to read vibration data

A vibration reading starts as a **time waveform**: the sensor's signal over a fraction of a second or a few seconds. It shows impacts, rubs and beats directly, but a running machine mixes dozens of sources into one trace, so it's hard to pick them apart by eye.

The **spectrum** separates them. A [fast Fourier transform (FFT)](/learn/signal-processing/fast-fourier-transform/) turns the waveform into a list of frequencies and their amplitudes, and each source in the machine shows up as a peak at its own frequency. Analysts usually look at the velocity spectrum for machine faults and the acceleration spectrum for bearings and gears.

Three settings decide what a spectrum can show:

- Maximum frequency (Fmax). The data must be sampled at more than twice Fmax. For general machine faults, Fmax is often set to about 40 to 50 times the running speed; bearing and gear work needs several kilohertz.
- Lines of resolution. The spectrum's frequency spacing is Fmax divided by the number of lines (400 to 12,800 is common). Finer spacing needs a longer recording: 1,600 lines up to 1,000 Hz is a spacing of 0.625 Hz and needs 1.6 s of data.
- Window and averaging. A [window function](/learn/signal-processing/window-functions/) (usually Hann) keeps a peak from smearing across the spectrum, and averaging several spectra steadies the noise.

### Orders: 1×, 2× and harmonics

Most vibration in a machine repeats once per revolution of a shaft, or a whole number of times per revolution. So analysts measure frequency in **orders**, multiples of the shaft speed:

- 1× is the running speed: 1,800 rpm is 30 Hz, so 1× is 30 Hz.
- 2×, 3× and so on are its harmonics, at 60 Hz, 90 Hz and so on.
- A peak at a whole order comes from something on that shaft; a peak that isn't on an order comes from something else, such as a bearing, a belt, a gear on another shaft or the electrical supply.

Speeds change slightly with load, so the first step in reading a spectrum is to find the 1× peak and mark its harmonics. Many analysers can show the frequency axis directly in orders.

## Common vibration fault signatures

![Six idealised spectra, frequency in orders of shaft speed. 1, healthy machine: small peaks at 1x and 2x. 2, imbalance: one dominant 1x peak. 3, misalignment: a 2x peak taller than 1x, with a 3x peak. 4, mechanical looseness: a long row of harmonics with half orders between them. 5, outer-race bearing defect in the envelope spectrum: peaks at BPFO, about 3.6x, and at 2x and 3x BPFO, between the whole orders. 6, gear tooth wear: a peak at the gear mesh frequency with sidebands spaced at the shaft speed](./fault-signature-spectra.svg)

| Fault | Where it shows in the spectrum | Other clues |
| --- | --- | --- |
| Imbalance (mass not centred on the shaft) | A high 1× peak, mostly radial; few harmonics | Steady phase; the imbalance force rises with the square of speed |
| Misalignment (shafts not in line across a coupling) | High 2× (often above 1×), with 1× and 3× | High axial vibration; phase differs by about 180° across the coupling |
| Mechanical looseness (loose foot, cracked base, worn fit) | Many harmonics of 1×, often to 10× or more, sometimes with half orders (0.5×, 1.5×) | Changes from point to point; a clipped or erratic time waveform |
| Rolling-element bearing defect | Lines at the bearing's defect frequencies (BPFO, BPFI, BSF, FTF) and their harmonics, which aren't whole orders | Early on, only in the high-frequency band or the envelope spectrum; high crest factor; impacts in the time waveform |
| Gear wear or a damaged tooth | The gear mesh frequency (number of teeth × shaft speed) and its harmonics, with sidebands spaced at the faulty gear's 1× | A cracked or broken tooth gives one impact per revolution of its gear |
| Electrical faults in AC motors | A peak at twice the supply frequency (100 Hz on 50 Hz mains, 120 Hz on 60 Hz) | Disappears the instant the power is cut, while mechanical vibration dies away with the speed |
| Resonance (running near a natural frequency) | A 1× or other peak far higher than its cause explains | Changes sharply with small speed changes; confirm with a run-up or coast-down |

The spectrum narrows down the possibilities; the analyst confirms with the time waveform, the direction (horizontal, vertical or axial), phase readings, and what has changed since the last reading.

## Bearing defect frequencies: BPFO, BPFI, BSF and FTF

A ball or roller bearing has four parts that can be damaged, and each produces impacts at its own rate when a rolling element passes the damage. For a bearing with $n$ rolling elements of diameter $d$ on a pitch circle of diameter $D$, contact angle $\phi$ and shaft frequency $f_r$:

$$
\mathrm{BPFO} = \frac{n}{2} f_r \left(1 - \frac{d}{D}\cos\phi\right) \qquad
\mathrm{BPFI} = \frac{n}{2} f_r \left(1 + \frac{d}{D}\cos\phi\right)
$$

$$
\mathrm{BSF} = \frac{D}{2d} f_r \left(1 - \left(\frac{d}{D}\cos\phi\right)^2\right) \qquad
\mathrm{FTF} = \frac{f_r}{2} \left(1 - \frac{d}{D}\cos\phi\right)
$$

- BPFO, the ball pass frequency outer race: a defect on the outer race. The outer race is usually still, so the impacts are evenly spaced.
- BPFI, the ball pass frequency inner race: a defect on the inner race, which turns with the shaft, so the impacts are stronger when the defect passes through the load zone and the peaks carry sidebands at 1×.
- BSF, the ball spin frequency: a defect on a rolling element. It strikes both races once per spin, so 2 × BSF is often the stronger line.
- FTF, the fundamental train frequency: the speed of the cage. It appears as sidebands around the other frequencies.

A worked example, with the 6205-size deep-groove ball bearing used in the demo (9 balls of 7.94 mm on a 39.04 mm pitch circle, contact angle 0) on a shaft at 1,800 rpm (30 Hz): BPFO is 3.585 × 30 = 107.5 Hz, BPFI is 5.415 × 30 = 162.5 Hz, BSF is 2.357 × 30 = 70.7 Hz and FTF is 0.398 × 30 = 11.9 Hz. None of them is a whole order, which is how they're told apart from shaft faults. In practice the balls slip slightly, so the measured frequencies are usually 1 to 2% off the calculated ones.

## Envelope analysis for bearing faults

A small bearing defect makes short, weak impacts. In a velocity spectrum, their energy at the defect frequency is tiny next to the 1× peak, and the overall level hardly moves. But each impact rings the bearing housing at its own natural frequencies, typically a few kilohertz, where little else in the machine vibrates.

**Envelope analysis** (also called demodulation) uses that ringing:

1. Band-pass filter the acceleration signal around the excited resonance, for example 2 to 5 kHz.
2. Take its envelope, the outline of the ringing bursts, with a rectifier and low-pass filter or the [Hilbert transform](/learn/signal-processing/hilbert-transform/).
3. Take the spectrum of the envelope. Its lines are the rate at which the impacts repeat: BPFO and its harmonics for an outer-race defect, BPFI with 1× sidebands for an inner-race defect.

Randall and Antoni's tutorial on bearing diagnostics calls envelope analysis the benchmark method, and describes how to choose the band with spectral kurtosis.

## Run-up, coast-down and waterfall plots

A single spectrum is a snapshot at one speed. Starting or stopping a machine sweeps its speed through a range, and plotting a spectrum every fraction of a second gives a **waterfall plot** (spectra stacked in 3D) or a [spectrogram](/learn/chart-types/cartesian/spectrogram/) (frequency against time, with amplitude as colour).

- Order lines (1×, 2×, gear mesh) move diagonally as the speed changes.
- A natural frequency stays at the same frequency. Where an order line crosses it, the amplitude jumps, which marks a critical speed to avoid running at.
- Machinery analysts also plot 1× amplitude and phase against speed, which they call a Bode plot; the phase swings by about 180° through a resonance.

The same views suit machines whose speed varies all the time, such as wind turbines and variable-speed drives.

## Trending the overall level

The overall level (the RMS over a band) is one number per measurement point, cheap to collect and easy to trend. Plotted over weeks or months, it shows:

- A slow rise: wear, a loosening fit, a growing imbalance from dirt on a fan.
- A step: a change in the machine, a repair, or a measurement problem.
- A rise then a fall: often a bearing late in its life, as the sharp defect edges wear smooth before the bearing fails.

Set alarms per point, from the ISO zones or from the machine's own baseline (for example, 2 to 2.5 times its normal level), and look at the spectrum whenever one trips. Trend a high-frequency or envelope value beside the velocity overall.

## Vibration analysis vs other condition monitoring methods

| | Vibration analysis | Oil analysis | Infrared thermography | Ultrasound (airborne and contact) | Motor current analysis |
| --- | --- | --- | --- | --- | --- |
| What it measures | Machine motion, by frequency | Wear particles, contamination and the oil's condition | Surface temperatures | High-frequency sound, 20 to 100 kHz | The motor's supply current, by frequency |
| Best at finding | Imbalance, misalignment, looseness, bearing and gear faults, resonance | Wear inside gearboxes and engines, lubricant problems | Electrical hot spots, overheating bearings, insulation and steam losses | Early bearing damage, poor lubrication, leaks, electrical discharge | Broken rotor bars and other motor faults, load changes |
| Machines it suits | Any rotating machine | Oil-lubricated machines | Electrical panels, motors, process equipment | Slow machines, valves, steam traps, compressed air | Electric motors and what they drive |
| Use it when | You want to know what is wrong in a rotating machine, and how badly | The oil is the best witness, as in large gearboxes | You need a quick, non-contact scan of many assets | Speeds are too low for vibration, or you are listening for leaks | The machine is hard to reach; the current can be measured at the panel |

Most programmes combine them. Vibration finds and identifies the fault, and oil analysis or thermography confirm it.

## Common vibration analysis mistakes

- **Trusting the overall level alone.** An early bearing defect can leave the velocity overall in zone A. Add a high-frequency or envelope measurement, and look at the crest factor.
- **Guessing the running speed.** Induction motors slip, so a motor rated 1,800 rpm may run at 1,780. Find the true 1× in the spectrum, or measure it with a tachometer, before naming peaks as orders or bearing frequencies.
- **Not enough resolution.** Twice the supply frequency (120 Hz) and 4× of a motor running at 1,780 rpm (118.7 Hz) are only 1.3 Hz apart, so a coarse spectrum shows them as one peak. Use more lines, or zoom in on the band.
- **Fmax too low.** Bearing and gear frequencies, and the resonances that envelope analysis needs, sit well above 1 kHz. A 10 to 1,000 Hz spectrum can't show them.
- **Mixing up peak, peak-to-peak and RMS.** The same vibration reads 1.41 times higher as peak than as RMS, and twice that as peak-to-peak. Check the units before comparing with a limit or another reading.
- **Changing how you measure.** A different point, direction or sensor mounting changes the reading. A magnet on a curved, painted surface cuts the high-frequency response that a stud-mounted sensor keeps. Measure the same way every time, or the trend means nothing.
- **Ignoring the time waveform.** Impacts, rubs and beats that a spectrum smears out are plain in the waveform.

## How to plot a vibration spectrum in JavaScript, React or Angular

SciChart.js draws charts with WebGL and WebGPU, so a web-based vibration tool can show full-resolution waveforms and spectra of tens of thousands of points, update them as fast as data arrives, and stay smooth while you zoom and pan. The demo below simulates a motor with a 6205-size bearing and computes everything in the browser: a 16,384-sample acceleration waveform at 12,800 samples per second, its Hann-windowed velocity spectrum, and the envelope spectrum of the 2 to 5 kHz band.

Change the **Shaft speed** and watch the order markers and bearing frequencies move. Pick a **Fault**: imbalance raises 1×, misalignment 2×, and looseness a row of harmonics, while the outer-race bearing fault puts impacts in the waveform and clear BPFO lines in the envelope spectrum and barely changes the overall level. Turn up the **Severity** and the **Noise**, and switch the **ISO 20816-3 limits** to see the same reading fall in a different zone. Scroll to zoom, drag to pan, double-click to reset, and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={860} name="./Basic/demo" />

<LearnCta position="top" chart="vibration spectrum" demo="audio-analyzer-fft-example" demoLabel="audio analyzer" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line chart documentation" />

Here is the code for this demo. The machine simulation, the FFT and the envelope analysis are plain JavaScript; SciChart.js draws the waveform, the two spectra and the frequency markers.

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
        EXyDirection,
        ELabelPlacement,
        FastMountainRenderableSeries,
        XyDataSeries,
        VerticalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // A velocity spectrum with markers at 1x to 8x of the shaft speed and at a bearing defect frequency
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            title: "Velocity spectrum"
        });
        // frequencies in Hz, velocity in mm/s RMS, shaftHz = rpm / 60, bpfo in Hz
        const { frequencies, velocity, shaftHz, bpfo } = await getYourVibrationSpectrum();

        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Frequency (Hz)",
                visibleRange: new NumberRange(0, 10 * shaftHz) // the first 10 orders
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Velocity (mm/s RMS)", autoRange: EAutoRange.Always })
        );
        sciChartSurface.renderableSeries.add(
            new FastMountainRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: frequencies, yValues: velocity }),
                stroke: "#50C7E0",
                fill: "#50C7E033"
            })
        );

        // Dashed, labelled markers at the shaft orders and the bearing's outer-race frequency
        const marker = (x: number, label: string, colour: string) =>
            new VerticalLineAnnotation({
                x1: x,
                stroke: colour,
                strokeDashArray: [4, 4],
                showLabel: true,
                labelPlacement: ELabelPlacement.TopRight,
                labelValue: label,
                axisLabelFill: colour
            });
        for (let order = 1; order <= 8; order++) {
            sciChartSurface.annotations.add(marker(order * shaftHz, `${order}×`, "#C8D3E8"));
        }
        sciChartSurface.annotations.add(marker(bpfo, "BPFO", "#F48420"));

        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        return { sciChartSurface };
    };

    // SciChartReact creates the chart, sizes it to its parent and cleans it up
    export const VibrationSpectrum = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
        ELabelPlacement,
        FastMountainRenderableSeries,
        XyDataSeries,
        VerticalLineAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // A velocity spectrum with markers at 1x to 8x of the shaft speed and at a bearing defect frequency
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme(),
            title: "Velocity spectrum"
        });
        // frequencies in Hz, velocity in mm/s RMS, shaftHz = rpm / 60, bpfo in Hz
        const { frequencies, velocity, shaftHz, bpfo } = await getYourVibrationSpectrum();

        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: "Frequency (Hz)",
                visibleRange: new NumberRange(0, 10 * shaftHz) // the first 10 orders
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, { axisTitle: "Velocity (mm/s RMS)", autoRange: EAutoRange.Always })
        );
        sciChartSurface.renderableSeries.add(
            new FastMountainRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: frequencies, yValues: velocity }),
                stroke: "#50C7E0",
                fill: "#50C7E033"
            })
        );

        // Dashed, labelled markers at the shaft orders and the bearing's outer-race frequency
        const marker = (x: number, label: string, colour: string) =>
            new VerticalLineAnnotation({
                x1: x,
                stroke: colour,
                strokeDashArray: [4, 4],
                showLabel: true,
                labelPlacement: ELabelPlacement.TopRight,
                labelValue: label,
                axisLabelFill: colour
            });
        for (let order = 1; order <= 8; order++) {
            sciChartSurface.annotations.add(marker(order * shaftHz, `${order}×`, "#C8D3E8"));
        }
        sciChartSurface.annotations.add(marker(bpfo, "BPFO", "#F48420"));

        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );
        return { sciChartSurface };
    };

    @Component({
        selector: "app-vibration-spectrum",
        standalone: true,
        imports: [ScichartAngularComponent],
        // scichart-angular creates the chart, sizes it and cleans it up
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class VibrationSpectrumComponent {
        initChart = initChart;
    }
    ```
</CodeSnippetBlock>

Key points:

- The spectrum is a `FastMountainRenderableSeries` over an `XyDataSeries` of frequency and amplitude. A spectrum of 8,193 lines, or a waveform of 16,384 samples, is redrawn in full on every change; no downsampling is needed.
- Order and bearing markers are `VerticalLineAnnotation`s with `showLabel` and `labelValue`. Setting each marker's `x1` when the speed changes moves it without rebuilding the chart.
- The waveform and velocity spectrum y-axes use `EAutoRange.Always`, so they rescale to each new reading, while the x-axes keep the band you zoomed to. The envelope spectrum's y-axis has a floor of 0.05 g, so a machine with no impacts shows a flat noise floor instead of noise scaled up to fill the chart. A `ZoomExtentsModifier` with an `onZoomExtents` callback resets each chart to its default band.
- The FFT, the velocity conversion and the envelope analysis are a few dozen lines of plain JavaScript. For a live feed, compute a new spectrum per block of samples and replace the data series' values.

**See it in the demo app:** [JavaScript audio analyzer](https://www.scichart.com/demo/javascript/audio-analyzer-fft-example) · [React audio analyzer](https://www.scichart.com/demo/react/audio-analyzer-fft-example) · [Angular audio analyzer](https://www.scichart.com/demo/angular/audio-analyzer-fft-example). Related techniques: the [React interactive waterfall chart](https://www.scichart.com/demo/react/interactive-waterfall-chart), [React 3D waterfall spectral chart](https://www.scichart.com/demo/react/interactive-3d-waterfall-spectral-chart), [React heatmap chart](https://www.scichart.com/demo/react/heatmap-chart) and [React synchronised multi-chart](https://www.scichart.com/demo/react/sync-multi-chart).

**Go deeper:** [SciChart.js line chart documentation](/2d-charts/chart-types/fast-line-renderable-series/), the [mountain (area) chart](/2d-charts/chart-types/fast-mountain-area-renderable-series/), the [vertical line annotation](/2d-charts/annotations-api/vertical-line-annotation/), the [uniform heatmap for spectrograms](/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/), and the learning center guides to the [fast Fourier transform](/learn/signal-processing/fast-fourier-transform/), [window functions](/learn/signal-processing/window-functions/), [power spectral density](/learn/signal-processing/power-spectral-density/) and the [Hilbert transform](/learn/signal-processing/hilbert-transform/). For the industries, see SciChart for [instrumentation](https://www.scichart.com/best-instrumentation-engineering-software/), [aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/) and [HMI and SCADA](https://www.scichart.com/scada-big-data/).

## Frequently asked questions

### What is vibration analysis?

Vibration analysis is a way of checking a machine's health from the way it shakes. Sensors on the bearings record vibration, software turns it into a time waveform and a frequency spectrum, and analysts look for the patterns that faults leave, such as a high peak at the shaft speed for imbalance. It lets maintenance teams find faults early and plan repairs before a breakdown.

### What are the three types of vibration measurement?

Vibration is measured as displacement, velocity or acceleration. Displacement, in micrometres peak-to-peak, suits low frequencies and shaft movement in sleeve bearings. Velocity, in mm/s RMS, is used for overall machine condition and the ISO severity limits. Acceleration, in g, suits high frequencies, where bearing and gear faults show first.

### What is 1× and 2× in vibration analysis?

1× is the vibration at the shaft's running speed, once per revolution: 30 Hz for a shaft at 1,800 rpm. 2× is twice the running speed, 3× three times, and so on. A high 1× usually means imbalance, a high 2× often means misalignment, and a long row of harmonics suggests mechanical looseness.

### What are BPFO and BPFI?

BPFO and BPFI are the ball pass frequencies of the outer and inner race of a rolling-element bearing: the rate at which balls or rollers pass a defect on that race. They depend on the shaft speed and the bearing's geometry, and are not whole multiples of the shaft speed. For a 6205-size ball bearing, BPFO is about 3.59 times and BPFI about 5.42 times the shaft speed.

### What is an acceptable vibration level for a motor or pump?

ISO 20816-3 gives zone limits in mm/s RMS, measured on the bearing housings over 10 to 1,000 Hz. For a medium-sized machine of 15 to 300 kW on a rigid base, below 1.4 mm/s is as new, up to 2.8 mm/s is acceptable long term, 2.8 to 4.5 mm/s needs a planned repair, and above 4.5 mm/s risks damage. Larger machines and flexible mounts have higher limits.

### How do I plot a vibration spectrum in JavaScript?

Compute the spectrum with an FFT of a windowed block of samples, scale it to the units you need, such as velocity in mm/s RMS, and plot frequency against amplitude. With SciChart.js, put the result in an XyDataSeries, draw it with a FastMountainRenderableSeries, and add a VerticalLineAnnotation for each shaft order and bearing frequency. The same code works in React with scichart-react and in Angular with scichart-angular.

## Sources

- ISO (2022), [ISO 20816-3:2022 Mechanical vibration — Measurement and evaluation of machine vibration — Part 3: Industrial machines with a power rating above 15 kW and operating speeds between 120 r/min and 30 000 r/min](https://www.iso.org/standard/78311.html). Measurement bands, evaluation zones A to D, machine groups and support classes; replaces ISO 10816-3:2009.
- Randall, R. B. (2021), [Vibration-based Condition Monitoring: Industrial, Automotive and Aerospace Applications](https://doi.org/10.1002/9781119477631), 2nd edition. Wiley. Spectrum analysis, fault signatures, bearing and gear diagnostics, order tracking.
- Randall, R. B. and Antoni, J. (2011), [Rolling element bearing diagnostics: a tutorial](https://doi.org/10.1016/j.ymssp.2010.07.017). *Mechanical Systems and Signal Processing*, 25(2), 485–520. Bearing defect frequency formulas, slip, and envelope analysis.
- NASA (2008), [Reliability-Centered Maintenance Guide for Facilities and Collateral Equipment](https://www.nasa.gov/wp-content/uploads/2023/06/nasa-rcmguide.pdf). Vibration monitoring and analysis within predictive testing and inspection.
- Case Western Reserve University, [Bearing Data Center](https://engineering.case.edu/bearingdatacenter). Public vibration recordings from a motor with seeded faults in 6205-size bearings.

<LearnCta position="bottom" chart="vibration spectrum" demo="audio-analyzer-fft-example" demoLabel="audio analyzer" docs="/2d-charts/chart-types/fast-line-renderable-series/" docsLabel="SciChart.js line chart documentation" />
