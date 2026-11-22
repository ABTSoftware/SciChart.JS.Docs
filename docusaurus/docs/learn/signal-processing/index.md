---
sidebar_position: 1
sidebar_label: Signal Processing
title: "Signal Processing: A Visual Guide (Interactive Examples)"
description: "Signal processing guides with live examples: Fourier transform and FFT, filters, spectral analysis, sampling and correlation, with code to chart each one."
keywords: ["signal processing", "digital signal processing", "dsp", "fourier transform", "fft", "power spectral density", "low pass filter", "high pass filter", "bode plot", "convolution", "autocorrelation", "nyquist frequency", "aliasing", "signal to noise ratio", "band pass filter", "notch filter", "fir filter", "iir filter", "audio spectrum analyzer", "fourier series", "window function", "hann window", "hamming window", "spectral leakage", "hilbert transform", "envelope detection"]
datePublished: 2026-11-19
---

# Signal Processing

**Signal processing** is how we analyse and change signals such as sound, vibration, sensor readings and radio, so we can see what frequencies they contain, remove noise or pick out a pattern. Each guide here explains one idea in plain language, with a live example you can change in your browser and the code to chart it in JavaScript, React or Angular with SciChart.js.

## Sampling

Sampling turns a continuous signal into numbers, and the sample rate limits which frequencies survive.

| Guide | What it covers |
| --- | --- |
| [Nyquist frequency and aliasing](/learn/signal-processing/nyquist-and-aliasing/) | How fast to sample, and why frequencies above half the sample rate turn into false, lower ones |

## Frequency analysis

Frequency analysis shows which frequencies a signal contains, how strong each one is and how they change.

| Guide | What it covers |
| --- | --- |
| [Audio spectrum analyzer](/learn/signal-processing/audio-spectrum-analyzer/) | How a live spectrum analyser works and how to read one, with a real-time demo |
| [Envelope detector circuit](/learn/signal-processing/envelope-detector-circuit/) | How a diode detector recovers the envelope of an AM signal, and how to choose R and C |
| [FFT (fast Fourier transform)](/learn/signal-processing/fast-fourier-transform/) | The fast algorithm behind every spectrum analyser: bins, resolution, windowing and leakage |
| [Fourier series](/learn/signal-processing/fourier-series/) | How a repeating wave is built from harmonics |
| [Fourier transform](/learn/signal-processing/fourier-transform/) | How any signal can be split into sine waves, and what its frequency spectrum shows |
| [Hilbert transform and envelope detection](/learn/signal-processing/hilbert-transform/) | The analytic signal, a signal's envelope, and its instantaneous phase and frequency |
| [Power spectral density](/learn/signal-processing/power-spectral-density/) | Noise and vibration power per hertz, Welch averaging and RMS from the spectrum |
| [Signal-to-noise ratio](/learn/signal-processing/signal-to-noise-ratio/) | Measuring SNR in decibels, and improving it with filtering and averaging |
| [Spectrogram](/learn/chart-types/cartesian/spectrogram/) | How a signal's frequencies change over time, as a chart |
| [Window functions](/learn/signal-processing/window-functions/) | Hann, Hamming, Blackman and flat-top windows, and how they control spectral leakage |

## Filters

A filter keeps some frequencies and removes others; these guides cover the main types and how to read their response.

| Guide | What it covers |
| --- | --- |
| [Band-pass filter](/learn/signal-processing/band-pass-filter/) | Keeps one band of frequencies: centre frequency, bandwidth and Q |
| [Bode plot and frequency response](/learn/signal-processing/bode-plot/) | How a filter or system changes each frequency's gain and phase, and how to read and sketch the plot |
| [FIR vs IIR filters](/learn/signal-processing/fir-vs-iir-filters/) | The two ways to build a digital filter: windowed-sinc and Butterworth design |
| [High-pass filter](/learn/signal-processing/high-pass-filter/) | Removes drift and slow changes and keeps the fast detail |
| [Low-pass filter](/learn/signal-processing/low-pass-filter/) | Keeps slow changes and removes high-frequency noise: cutoff, roll-off and filter types |
| [Notch filter](/learn/signal-processing/notch-filter/) | Removes one narrow frequency, such as 50 or 60 Hz mains hum |

## Combining and comparing signals

Correlation compares a signal with a shifted copy of itself or another signal; convolution combines a signal with a kernel.

| Guide | What it covers |
| --- | --- |
| [Autocorrelation and cross-correlation](/learn/signal-processing/autocorrelation/) | Finding a repeating period, or the delay between two signals |
| [Convolution](/learn/signal-processing/convolution/) | How filtering, smoothing and echoes all come from one operation, step by step |

For charting signals as they stream in, or very large recordings, see [real-time charts](/learn/real-time/) and [big data and performance](/learn/big-data/).

<LearnCta position="bottom" />
