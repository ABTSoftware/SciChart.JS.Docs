---
sidebar_position: 1
sidebar_label: Applications
title: "Charts in Science, Engineering, Medicine and Business, With Examples"
description: "How to read the charts used in science, engineering, medicine and business, from ECGs, spectra and telemetry to signal processing and machine learning, each with a live example."
keywords: ["telemetry", "scada", "hmi", "chromatogram", "ecg", "capnography", "spectroscopy", "mass spectrum", "hr diagram", "stress strain curve", "kpi dashboard", "oscilloscope", "vibration analysis", "scientific charts", "engineering charts", "signal processing", "fourier transform", "fft", "low pass filter", "machine learning visualization", "decision boundary", "roc curve", "k means clustering"]
datePublished: 2026-11-20
---

# Applications

Each guide here covers one application, from medicine and life sciences to engineering, energy, motorsport, astronomy, signal processing, machine learning and business. It explains how that field records its data, how people read the charts that come out of it, and how to build the same view with a live example you can change in your browser and the code to chart it in JavaScript, React or Angular with SciChart.js.

The guides are grouped by sector, in alphabetical order.

## Aerospace and defence

For more on how SciChart is used in this sector, see [SciChart for aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/).

| Guide | What it covers |
| --- | --- |
| [Antenna radiation pattern](/learn/applications/antenna-radiation-pattern/) | Reading polar and 3D antenna patterns: lobes, beamwidth, directivity and beam steering |
| [Telemetry](/learn/applications/telemetry/) | How telemetry measures, frames and sends data from aircraft, rockets, vehicles and remote sites, and how to read a live telemetry dashboard |

## Business

Business dashboards turn a handful of KPIs into charts that show at a glance whether targets are being met.

| Guide | What it covers |
| --- | --- |
| [KPI dashboard](/learn/applications/kpi-dashboard/) | Choosing KPIs, which chart suits each one, targets and comparisons, and dashboard layout |

## Finance and trading

Trading screens chart prices, volume and order flow as they change, and risk and performance over a strategy's history. For how SciChart is used in this sector, see [SciChart for financial and trading applications](https://www.scichart.com/why-scichart-best-for-financial-stock-trading-applications/). The price chart guides below are also listed under [types of charts](/learn/chart-types/#financial-charts).

| Guide | What it covers |
| --- | --- |
| [Candlestick chart](/learn/chart-types/cartesian/candlestick-chart/) | Open, high, low and close prices per period, with colour showing whether the price rose or fell |
| [Drawdown and equity curve](/learn/applications/drawdown-and-equity-curve/) | How a strategy's balance grows over time, how far it falls from each peak, and how long it takes to recover |
| [Footprint chart](/learn/chart-types/cartesian/footprint-chart/) | Bid and ask volume at each price inside each bar, with delta and imbalances |
| [Market depth](/learn/applications/market-depth/) | The buy and sell orders waiting at each price, as a cumulative depth chart and as an order book heatmap over time |
| [OHLC chart](/learn/chart-types/cartesian/ohlc-chart/) | Open, high, low and close prices per period as thin bars, with a left tick for the open and a right tick for the close |
| [Options payoff diagram](/learn/applications/options-payoff-diagram/) | Profit or loss of an option position against the price at expiry, for single options and multi-leg strategies |
| [Renko chart](/learn/chart-types/cartesian/renko-chart/) | Fixed-size price bricks that ignore time and show the trend |
| [Stochastic oscillator](/learn/applications/stochastic-oscillator/) | Where the close sits in its recent high–low range, as %K and %D lines between 0 and 100 |
| [Tick chart](/learn/chart-types/cartesian/tick-chart/) | Bars that close after a set number of trades instead of a set time |
| [Volatility surface](/learn/applications/volatility-surface/) | Implied volatility across strike and expiry as a 3D surface, with the smile, skew and term structure |
| [Volume profile](/learn/applications/volume-profile/) | Volume traded at each price over a range, with the point of control and value area |
| [VWAP](/learn/applications/vwap/) | The volume-weighted average price from an anchor, with standard deviation bands, as a fair-value line and execution benchmark |
| [Waterfall chart](/learn/chart-types/cartesian/waterfall-chart/) | How a starting total becomes an end total through a series of gains and losses, with subtotals along the way |

## Industrial and energy

For more on how SciChart is used in this sector, see [SciChart for industrial and energy](https://www.scichart.com/scada-big-data/).

| Guide | What it covers |
| --- | --- |
| [HMI and SCADA](/learn/applications/hmi-scada/) | What SCADA and HMI are, how the layers fit together, and how to read HMI trend charts, alarm limits and deadbands |
| [PID control](/learn/applications/pid-control/) | How a PID controller works and how to tune it from the step response |
| [Power quality](/learn/applications/power-quality/) | Harmonics and THD, sags and swells, power factor and the standards behind them |

## Life sciences

For more on how SciChart is used in this sector, see [SciChart for life sciences](https://www.scichart.com/why-scichart-diagnostics-lifesciences/).

| Guide | What it covers |
| --- | --- |
| [Chromatogram](/learn/applications/chromatogram/) | What a chromatogram shows and how to read retention time, peak area and resolution, with a chromatogram you can integrate |
| [Mass spectrum](/learn/applications/mass-spectrum/) | Reading a mass spectrometry graph: m/z, base peak, molecular ion, isotope patterns and charge states |
| [Spectroscopy](/learn/applications/spectroscopy/) | Reading IR, Raman and UV-Vis spectra, Beer–Lambert and baseline correction |

## Machine learning

These guides explain one machine learning idea each with a live chart: the model trains or recomputes as you move a slider, so you can see what it does rather than read about it.

| Guide | What it covers |
| --- | --- |
| [Activation functions](/learn/applications/machine-learning/activation-functions/) | Sigmoid, tanh, ReLU, GELU and softmax: formulas, derivatives and a network trained live |
| [Anomaly detection](/learn/applications/machine-learning/anomaly-detection/) | Z-scores, seasonal baselines and isolation forests on a live sensor stream |
| [Decision boundary](/learn/applications/machine-learning/decision-boundary/) | How k-NN, logistic regression, trees, forests, naive Bayes and SVMs divide data, trained live |
| [Dimensionality reduction](/learn/applications/machine-learning/dimensionality-reduction/) | PCA, t-SNE and UMAP compared, with a 2D and 3D embedding of digit images |
| [Hierarchical clustering](/learn/applications/machine-learning/hierarchical-clustering/) | How to read a dendrogram, linkage methods, and DBSCAN |
| [K-means clustering](/learn/applications/machine-learning/k-means-clustering/) | How k-means works, the elbow method and silhouette score, step by step |
| [Regularization](/learn/applications/machine-learning/regularization/) | Ridge and lasso regression, overfitting and the bias–variance trade-off |
| [ROC curve](/learn/applications/machine-learning/roc-curve/) | How ROC and precision-recall curves are built, what AUC means, and choosing a threshold |
| [Support vector machine](/learn/applications/machine-learning/support-vector-machine/) | Margins, support vectors and the kernel trick, in 2D and 3D |

For the statistics charts these guides use, see [correlation matrix](/learn/chart-types/cartesian/correlation-matrix/) and [residual plot and Q-Q plot](/learn/chart-types/cartesian/residual-plot/).

## Medical

For more on how SciChart is used in this sector, see [SciChart for medical](https://www.scichart.com/why-scichart-medical-charts-dashboarding-for-research-and-healthcare/).

| Guide | What it covers |
| --- | --- |
| [Capnography and pulse oximetry](/learn/applications/capnography-pulse-oximetry/) | How to read a capnogram and a pleth waveform, and how patient monitors draw them |
| [ECG](/learn/applications/ecg/) | The 12 ECG leads, the P, QRS and T waves, intervals, ECG paper and how to read an ECG strip |

## Motorsport

Race engineers and sim racers compare laps on distance-based traces to find where time is won and lost.

| Guide | What it covers |
| --- | --- |
| [Motorsport telemetry](/learn/applications/motorsport-telemetry/) | How to read lap traces, braking points and the time-delta trace, with two real laps from a racing-simulator demo |

## Science and mathematics

These guides chart data from astronomy and pure mathematics, where one well-chosen chart reveals the structure in the numbers.

| Guide | What it covers |
| --- | --- |
| [HR diagram](/learn/applications/hr-diagram/) | How to read the Hertzsprung–Russell diagram of stars: axes, regions, spectral classes and cluster ages |
| [Riemann Hypothesis](/learn/applications/riemann-hypothesis/) | What the hypothesis says, Hardy's Z function and the zeta zeros, and how the zeros rebuild the primes, computed live |

## Signal processing

**Signal processing** is how instruments and analysers see what frequencies a signal contains, remove noise or pick out a pattern, in sound, vibration, sensor readings and radio.

### Sampling

| Guide | What it covers |
| --- | --- |
| [Nyquist frequency and aliasing](/learn/applications/signal-processing/nyquist-and-aliasing/) | How fast to sample, and why frequencies above half the sample rate turn into false, lower ones |

### Frequency analysis

| Guide | What it covers |
| --- | --- |
| [Audio spectrum analyzer](/learn/applications/signal-processing/audio-spectrum-analyzer/) | How a live spectrum analyser works and how to read one, with a real-time demo |
| [Envelope detector circuit](/learn/applications/signal-processing/envelope-detector-circuit/) | How a diode detector recovers the envelope of an AM signal, and how to choose R and C |
| [FFT (fast Fourier transform)](/learn/applications/signal-processing/fast-fourier-transform/) | The fast algorithm behind every spectrum analyser: bins, resolution, windowing and leakage |
| [Fourier series](/learn/applications/signal-processing/fourier-series/) | How a repeating wave is built from harmonics |
| [Fourier transform](/learn/applications/signal-processing/fourier-transform/) | How any signal can be split into sine waves, and what its frequency spectrum shows |
| [Hilbert transform and envelope detection](/learn/applications/signal-processing/hilbert-transform/) | The analytic signal, a signal's envelope, and its instantaneous phase and frequency |
| [Power spectral density](/learn/applications/signal-processing/power-spectral-density/) | Noise and vibration power per hertz, Welch averaging and RMS from the spectrum |
| [Signal-to-noise ratio](/learn/applications/signal-processing/signal-to-noise-ratio/) | Measuring SNR in decibels, and improving it with filtering and averaging |
| [Spectrogram](/learn/chart-types/cartesian/spectrogram/) | How a signal's frequencies change over time, as a chart |
| [Window functions](/learn/applications/signal-processing/window-functions/) | Hann, Hamming, Blackman and flat-top windows, and how they control spectral leakage |

### Filters

| Guide | What it covers |
| --- | --- |
| [Band-pass filter](/learn/applications/signal-processing/band-pass-filter/) | Keeps one band of frequencies: centre frequency, bandwidth and Q |
| [Bode plot and frequency response](/learn/applications/signal-processing/bode-plot/) | How a filter or system changes each frequency's gain and phase, and how to read and sketch the plot |
| [FIR vs IIR filters](/learn/applications/signal-processing/fir-vs-iir-filters/) | The two ways to build a digital filter: windowed-sinc and Butterworth design |
| [High-pass filter](/learn/applications/signal-processing/high-pass-filter/) | Removes drift and slow changes and keeps the fast detail |
| [Low-pass filter](/learn/applications/signal-processing/low-pass-filter/) | Keeps slow changes and removes high-frequency noise: cutoff, roll-off and filter types |
| [Notch filter](/learn/applications/signal-processing/notch-filter/) | Removes one narrow frequency, such as 50 or 60 Hz mains hum |

### Combining and comparing signals

| Guide | What it covers |
| --- | --- |
| [Autocorrelation and cross-correlation](/learn/applications/signal-processing/autocorrelation/) | Finding a repeating period, or the delay between two signals |
| [Convolution](/learn/applications/signal-processing/convolution/) | How filtering, smoothing and echoes all come from one operation, step by step |

## Test and measurement

For more on how SciChart is used in this sector, see [SciChart for test and measurement](https://www.scichart.com/best-instrumentation-engineering-software/).

| Guide | What it covers |
| --- | --- |
| [Non-destructive testing](/learn/applications/non-destructive-testing/) | NDT methods compared, ultrasonic testing, thickness gauging, phased array and A-, B- and C-scans |
| [Oscilloscope](/learn/applications/oscilloscope/) | How to use and read an oscilloscope: volts and time per division, triggering, measurements and persistence, with a software oscilloscope |
| [Stress-strain curve](/learn/applications/stress-strain-curve/) | Reading a tensile test: Young's modulus, yield, UTS, ductile vs brittle, true vs engineering curves |
| [Vibration analysis](/learn/applications/vibration-analysis/) | Reading vibration spectra to find imbalance, misalignment, looseness and bearing faults, with ISO severity zones |


For the chart types these guides use, see [types of charts](/learn/chart-types/), [real-time charts](/learn/real-time/) and [big data and performance](/learn/big-data/).

<LearnCta position="bottom" />
