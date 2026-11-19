---
sidebar_position: 1
sidebar_label: Signal Processing
title: "Signal Processing: A Visual Guide (With Interactive Examples)"
description: "Signal processing explained visually: sampling and aliasing, the Fourier transform and FFT, power spectral density, spectrum analysers, signal-to-noise ratio, low-pass, high-pass, band-pass and notch filters, FIR vs IIR, Bode plots, convolution and correlation, each with a live, interactive example you can change in your browser."
keywords: ["signal processing", "digital signal processing", "dsp", "fourier transform", "fft", "power spectral density", "low pass filter", "high pass filter", "bode plot", "convolution", "autocorrelation", "nyquist frequency", "aliasing", "signal to noise ratio", "band pass filter", "notch filter", "fir filter", "iir filter", "audio spectrum analyzer"]
---

# Signal Processing

**Signal processing** is how we analyse and change signals such as sound, vibration, sensor readings and radio, so we can see what frequencies they contain, remove noise or pick out a pattern. Each guide here explains one idea in plain language, with a live example you can change in your browser and the code to chart it in **JavaScript, React or Angular** with SciChart.js.

## Sampling

| Guide | What it covers |
| --- | --- |
| [Nyquist frequency and aliasing](/learn/signal-processing/nyquist-and-aliasing/) | How fast to sample, and why frequencies above half the sample rate turn into false, lower ones |

## Frequency analysis

| Guide | What it covers |
| --- | --- |
| [Fourier transform](/learn/signal-processing/fourier-transform/) | How any signal can be split into sine waves, and what its frequency spectrum shows |
| [FFT (fast Fourier transform)](/learn/signal-processing/fast-fourier-transform/) | The fast algorithm behind every spectrum analyser: bins, resolution, windowing and leakage |
| [Power spectral density](/learn/signal-processing/power-spectral-density/) | Noise and vibration power per hertz, Welch averaging and RMS from the spectrum |
| [Audio spectrum analyzer](/learn/signal-processing/audio-spectrum-analyzer/) | How a live spectrum analyser works and how to read one, with a real-time demo |
| [Spectrogram](/learn/chart-types/cartesian/spectrogram/) | How a signal's frequencies change over time, as a chart |
| [Signal-to-noise ratio](/learn/signal-processing/signal-to-noise-ratio/) | Measuring SNR in decibels, and improving it with filtering and averaging |

## Filters

| Guide | What it covers |
| --- | --- |
| [Low-pass filter](/learn/signal-processing/low-pass-filter/) | Keeps slow changes and removes high-frequency noise: cutoff, roll-off and filter types |
| [High-pass filter](/learn/signal-processing/high-pass-filter/) | Removes drift and slow changes and keeps the fast detail |
| [Band-pass filter](/learn/signal-processing/band-pass-filter/) | Keeps one band of frequencies: centre frequency, bandwidth and Q |
| [Notch filter](/learn/signal-processing/notch-filter/) | Removes one narrow frequency, such as 50 or 60 Hz mains hum |
| [FIR vs IIR filters](/learn/signal-processing/fir-vs-iir-filters/) | The two ways to build a digital filter: windowed-sinc and Butterworth design |
| [Bode plot and frequency response](/learn/signal-processing/bode-plot/) | How a filter or system changes each frequency's gain and phase, and how to read and sketch the plot |

## Combining and comparing signals

| Guide | What it covers |
| --- | --- |
| [Convolution](/learn/signal-processing/convolution/) | How filtering, smoothing and echoes all come from one operation, step by step |
| [Autocorrelation and cross-correlation](/learn/signal-processing/autocorrelation/) | Finding a repeating period, or the delay between two signals |

For charting the results fast, see [real-time charts](/learn/real-time/) and [big data and performance](/learn/big-data/).

<LearnCta position="bottom" />
