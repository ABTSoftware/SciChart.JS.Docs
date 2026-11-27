import * as SciChart from "scichart";

// #region_A_start
// A live constellation diagram in JavaScript with SciChart.js: a simulated digitally modulated signal (BPSK to
// 64-QAM) passes through a model of a transmitter and receiver with adjustable impairments. The constellation keeps
// the last 30,000 symbols with fading persistence, next to the I and Q time traces and the spectrum.
// The signal processing below is plain JavaScript with no dependencies. All data is simulated.

const SAMPLES_PER_SYMBOL = 8; // the I and Q waveforms are sampled 8 times per symbol
const FILTER_SPAN = 8; // the pulse-shaping filter reaches 8 symbols either side of its centre
const ROLL_OFF = 0.35; // excess bandwidth of the root-raised-cosine filter (35%)
const SYMBOL_RATE = 1e6; // 1 million symbols per second (1 Mbaud), used to express the frequency offset in Hz
const PHASE_NOISE_SYMBOLS = 50; // how many symbols the phase noise stays roughly the same for

// Seeded random numbers, so the signal is the same every time the page loads
function makeRandom(seed) {
    let state = seed;
    const uniform = () => {
        state = (state * 16807) % 2147483647;
        return (state - 0.5) / 2147483647; // strictly between 0 and 1
    };
    // Box-Muller: two uniform numbers make one Gaussian number with mean 0 and standard deviation 1
    const gaussian = () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform());
    return { uniform, gaussian };
}

// The ideal symbol positions, scaled to an average power of 1, each with its Gray-coded bits.
// One common convention: the first half of the bits picks the column (I), the second half the row (Q).
function makeConstellation(name) {
    const gray = (k, bits) => (k ^ (k >> 1)).toString(2).padStart(bits, "0");
    const points = [];
    if (name === "BPSK") {
        points.push({ i: -1, q: 0, bits: "0" }, { i: 1, q: 0, bits: "1" });
    } else if (name === "8PSK") {
        for (let k = 0; k < 8; k++) points.push({ i: Math.cos((k * Math.PI) / 4), q: Math.sin((k * Math.PI) / 4), bits: gray(k, 3) });
    } else {
        // Square QAM: QPSK (4-QAM), 16-QAM and 64-QAM. Levels per axis are -L+1 ... L-1 in steps of 2
        const levelsPerAxis = { QPSK: 2, "16QAM": 4, "64QAM": 8 }[name];
        const bitsPerAxis = Math.log2(levelsPerAxis);
        let power = 0;
        for (let a = 0; a < levelsPerAxis; a++) {
            for (let b = 0; b < levelsPerAxis; b++) {
                const i = 2 * a - levelsPerAxis + 1;
                const q = 2 * b - levelsPerAxis + 1;
                points.push({ i, q, bits: gray(a, bitsPerAxis) + gray(b, bitsPerAxis) });
                power += i * i + q * q;
            }
        }
        const scale = 1 / Math.sqrt(power / points.length);
        for (const p of points) {
            p.i *= scale;
            p.q *= scale;
        }
    }
    return { name, points, bitsPerSymbol: Math.log2(points.length) };
}

// The index of the ideal point nearest to (i, q): what a receiver decides was sent
function nearestPoint(constellation, i, q) {
    let best = 0;
    let bestDistance = Infinity;
    const points = constellation.points;
    for (let k = 0; k < points.length; k++) {
        const di = i - points[k].i;
        const dq = q - points[k].q;
        const d = di * di + dq * dq;
        if (d < bestDistance) {
            bestDistance = d;
            best = k;
        }
    }
    return best;
}

// Root-raised-cosine pulse, sampled SAMPLES_PER_SYMBOL times per symbol and scaled to unit energy.
// Filtering with it at the transmitter and again at the receiver gives a raised-cosine pulse: zero
// interference between symbols at the symbol instants.
function rootRaisedCosine() {
    const half = FILTER_SPAN * SAMPLES_PER_SYMBOL;
    const taps = new Float64Array(2 * half + 1);
    const b = ROLL_OFF;
    let energy = 0;
    for (let n = -half; n <= half; n++) {
        const t = n / SAMPLES_PER_SYMBOL; // time in symbols
        let h;
        if (n === 0) h = 1 - b + (4 * b) / Math.PI;
        else if (Math.abs(Math.abs(t) - 1 / (4 * b)) < 1e-9)
            h = (b / Math.SQRT2) * ((1 + 2 / Math.PI) * Math.sin(Math.PI / (4 * b)) + (1 - 2 / Math.PI) * Math.cos(Math.PI / (4 * b)));
        else h = (Math.sin(Math.PI * t * (1 - b)) + 4 * b * t * Math.cos(Math.PI * t * (1 + b))) / (Math.PI * t * (1 - Math.pow(4 * b * t, 2)));
        taps[n + half] = h;
        energy += h * h;
    }
    for (let n = 0; n < taps.length; n++) taps[n] /= Math.sqrt(energy);
    return taps;
}

// A streaming simulator of a received, digitally modulated signal:
// random symbols -> root-raised-cosine pulse shaping -> amplifier compression -> noise
// -> phase noise and frequency offset -> IQ gain imbalance and quadrature skew -> matched filter.
// next(count, settings) returns the next `count` received symbols (I, Q) and the symbols that were sent.
function createIqSimulator(seed) {
    const random = makeRandom(seed);
    const taps = rootRaisedCosine();
    const half = FILTER_SPAN * SAMPLES_PER_SYMBOL;
    const SYMBOL_RING = 8192; // ring buffers, sized as powers of 2 so an index wraps with a bit mask
    const SAMPLE_RING = 65536;
    const txI = new Float64Array(SYMBOL_RING);
    const txQ = new Float64Array(SYMBOL_RING);
    const txIndex = new Int32Array(SYMBOL_RING);
    const rxI = new Float64Array(SAMPLE_RING);
    const rxQ = new Float64Array(SAMPLE_RING);
    let symbolsMade = 0; // symbols 0 ... symbolsMade - 1 exist
    let samplesMade = 0; // received samples 0 ... samplesMade - 1 exist
    let nextOut = FILTER_SPAN; // the next symbol to demodulate (skip the filter's start-up)
    let phaseNoise = 0; // radians, a slowly wandering random phase
    let carrierPhase = 0; // radians, grows steadily with a frequency offset
    let constellation = makeConstellation("16QAM");

    const makeSymbols = (upTo) => {
        for (; symbolsMade <= upTo; symbolsMade++) {
            const k = Math.min(constellation.points.length - 1, Math.floor(random.uniform() * constellation.points.length));
            const slot = symbolsMade & (SYMBOL_RING - 1);
            txI[slot] = constellation.points[k].i;
            txQ[slot] = constellation.points[k].q;
            txIndex[slot] = k;
        }
    };

    // Make received samples up to (not including) sample `end`
    const makeSamples = (end, s) => {
        makeSymbols(Math.floor((end - 1 + half) / SAMPLES_PER_SYMBOL));
        const noiseSd = Math.sqrt(1 / (2 * Math.pow(10, s.snrDb / 10))); // per I or Q: total noise power 1/SNR per sample
        const txRms = Math.sqrt(1 / SAMPLES_PER_SYMBOL); // the shaped signal's RMS amplitude
        const saturation = s.compression > 0 ? txRms * Math.pow(10, (12 - s.compression) / 20) : Infinity;
        const pnDecay = Math.exp(-1 / (PHASE_NOISE_SYMBOLS * SAMPLES_PER_SYMBOL));
        const pnStep = Math.sqrt(1 - pnDecay * pnDecay) * ((s.phaseNoiseDeg * Math.PI) / 180);
        const phaseStep = (2 * Math.PI * s.frequencyOffsetHz) / (SYMBOL_RATE * SAMPLES_PER_SYMBOL);
        const gainI = Math.pow(10, s.gainImbalanceDb / 40); // split the imbalance between I and Q
        const gainQ = Math.pow(10, -s.gainImbalanceDb / 40);
        const skew = ((s.quadratureSkewDeg / 2) * Math.PI) / 180; // split the skew between I and Q
        const cosSkew = Math.cos(skew);
        const sinSkew = Math.sin(skew);
        for (let n = samplesMade; n < end; n++) {
            // 1. Pulse shaping: each symbol is an impulse every SAMPLES_PER_SYMBOL samples, filtered by the RRC pulse
            let i = 0;
            let q = 0;
            const first = Math.max(0, Math.ceil((n - half) / SAMPLES_PER_SYMBOL));
            const last = Math.floor((n + half) / SAMPLES_PER_SYMBOL);
            for (let k = first; k <= last; k++) {
                const h = taps[n - k * SAMPLES_PER_SYMBOL + half];
                const slot = k & (SYMBOL_RING - 1);
                i += h * txI[slot];
                q += h * txQ[slot];
            }
            // 2. Amplifier compression (Rapp model, smoothness 2): the amplitude is squeezed near saturation, the phase kept
            if (saturation < Infinity) {
                const r = Math.sqrt(i * i + q * q) / saturation;
                const gain = 1 / Math.pow(1 + Math.pow(r, 4), 0.25);
                i *= gain;
                q *= gain;
            }
            // 3. White Gaussian noise
            i += noiseSd * random.gaussian();
            q += noiseSd * random.gaussian();
            // 4. Phase noise (a random phase that wanders slowly) plus a frequency offset (a phase that grows steadily)
            phaseNoise = pnDecay * phaseNoise + pnStep * random.gaussian();
            // With no offset, the phase returns to 0: a receiver locked to the carrier
            carrierPhase = phaseStep === 0 ? 0 : (carrierPhase + phaseStep) % (2 * Math.PI);
            const c = Math.cos(phaseNoise + carrierPhase);
            const sn = Math.sin(phaseNoise + carrierPhase);
            const ri = i * c - q * sn;
            const rq = i * sn + q * c;
            // 5. IQ imbalance in the receiver's mixer: unequal I and Q gains, and I and Q not exactly 90 degrees apart
            const slot = n & (SAMPLE_RING - 1);
            rxI[slot] = gainI * (ri * cosSkew - rq * sinSkew);
            rxQ[slot] = gainQ * (rq * cosSkew - ri * sinSkew);
        }
        samplesMade = end;
    };

    // The matched filter (the same RRC pulse) evaluated at sample n
    const matchedFilter = (n) => {
        let i = 0;
        let q = 0;
        for (let m = -half; m <= half; m++) {
            if (n + m < 0) continue;
            const slot = (n + m) & (SAMPLE_RING - 1);
            i += taps[m + half] * rxI[slot];
            q += taps[m + half] * rxQ[slot];
        }
        return [i, q];
    };

    const next = (count, settings) => {
        const end = nextOut + count;
        makeSamples((end - 1) * SAMPLES_PER_SYMBOL + half + 1, settings);
        const out = {
            i: new Float64Array(count),
            q: new Float64Array(count),
            refI: new Float64Array(count),
            refQ: new Float64Array(count),
            sent: new Int32Array(count)
        };
        for (let j = 0; j < count; j++) {
            const k = nextOut + j;
            const [i, q] = matchedFilter(k * SAMPLES_PER_SYMBOL);
            const slot = k & (SYMBOL_RING - 1);
            out.i[j] = i;
            out.q[j] = q;
            out.refI[j] = txI[slot];
            out.refQ[j] = txQ[slot];
            out.sent[j] = txIndex[slot];
        }
        nextOut = end;
        return out;
    };

    // The last `symbols` symbols of the matched-filter output at every sample: the I and Q time traces
    const recentWaveform = (symbols) => {
        const start = (nextOut - symbols) * SAMPLES_PER_SYMBOL;
        const length = (symbols - 1) * SAMPLES_PER_SYMBOL + 1;
        const t = new Float64Array(length);
        const i = new Float64Array(length);
        const q = new Float64Array(length);
        for (let j = 0; j < length; j++) {
            const [a, b] = matchedFilter(start + j);
            t[j] = j / SAMPLES_PER_SYMBOL;
            i[j] = a;
            q[j] = b;
        }
        return { t, i, q };
    };

    // The last `length` received samples before the matched filter, as a spectrum analyser would see them
    const recentSamples = (length) => {
        const i = new Float64Array(length);
        const q = new Float64Array(length);
        for (let j = 0; j < length; j++) {
            const slot = (samplesMade - length + j) & (SAMPLE_RING - 1);
            i[j] = rxI[slot];
            q[j] = rxQ[slot];
        }
        return { i, q };
    };

    const setConstellation = (name) => {
        constellation = makeConstellation(name);
        // Restart cleanly so old and new symbols don't mix in the filters
        symbolsMade = 0;
        samplesMade = 0;
        nextOut = FILTER_SPAN;
        phaseNoise = 0;
        carrierPhase = 0;
        rxI.fill(0);
        rxQ.fill(0);
    };

    return { next, recentWaveform, recentSamples, setConstellation, getConstellation: () => constellation };
}


// Iterative radix-2 FFT, in place, on complex samples (re, im). The length must be a power of 2.
function fft(re, im) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
        let bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) {
            [re[i], re[j]] = [re[j], re[i]];
            [im[i], im[j]] = [im[j], im[i]];
        }
    }
    for (let size = 2; size <= n; size *= 2) {
        const halfSize = size / 2;
        const step = (-2 * Math.PI) / size;
        for (let start = 0; start < n; start += size) {
            for (let k = 0; k < halfSize; k++) {
                const wr = Math.cos(step * k);
                const wi = Math.sin(step * k);
                const a = start + k;
                const b = a + halfSize;
                const tr = re[b] * wr - im[b] * wi;
                const ti = re[b] * wi + im[b] * wr;
                re[b] = re[a] - tr;
                im[b] = im[a] - ti;
                re[a] += tr;
                im[a] += ti;
            }
        }
    }
}

// Power spectral density of complex IQ samples with a Hann window, centred on 0 Hz, in dB.
// Scaled so white noise of power P per sample reads 10 log10(P): with this demo's signal, the flat top of the
// spectrum sits near 0 dB and the noise floor near -SNR dB.
function iqSpectrumDb(i, q) {
    const n = i.length;
    const re = new Float64Array(n);
    const im = new Float64Array(n);
    let windowPower = 0;
    for (let j = 0; j < n; j++) {
        const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * j) / n);
        re[j] = i[j] * w;
        im[j] = q[j] * w;
        windowPower += w * w;
    }
    fft(re, im);
    const psd = new Float64Array(n);
    for (let k = 0; k < n; k++) {
        const shifted = (k + n / 2) % n; // negative frequencies first, so 0 Hz is in the middle
        psd[k] = (re[shifted] * re[shifted] + im[shifted] * im[shifted]) / windowPower;
    }
    return psd;
}

async function createIqCharts(constellationDiv, tracesDiv, spectrumDiv) {
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        XyDataSeries,
        XyScatterRenderableSeries,
        FastLineRenderableSeries,
        EllipsePointMarker,
        LegendModifier,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        DpiHelper,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const BATCH = 500; // symbols added per animation frame, in one appendRange call per series
    const PERSISTENCE = 30000; // the constellation keeps the last 30,000 symbols
    const TRACE_SYMBOLS = 24; // the I and Q time traces show the last 24 symbols
    const SPECTRUM_SAMPLES = 2048; // samples per spectrum (256 symbols)
    const AXIS_LIMIT = 1.9; // the constellation's I and Q range: -1.9 to +1.9
    const titleStyle = { fontSize: 15, color: "#C8D3E6" };
    const axisTitleStyle = { fontSize: 14 };

    // --- Chart 1: the constellation. Three scatter layers with FIFO buffers make a fading persistence display:
    // every symbol goes into all three, so the newest symbols are drawn three times (brightest) and the oldest once.
    const constellation = await SciChartSurface.create(constellationDiv, {
        theme: new SciChartJsNavyTheme(),
        title: "Constellation (simulated signal)",
        titleStyle
    });
    const cs = constellation.sciChartSurface;
    const cw = constellation.wasmContext;
    const iAxis = new NumericAxis(cw, { axisTitleStyle, axisTitle: "I (in-phase)", autoRange: EAutoRange.Never, labelPrecision: 1 });
    const qAxis = new NumericAxis(cw, { axisTitleStyle, axisTitle: "Q (quadrature)", autoRange: EAutoRange.Never, labelPrecision: 1 });
    iAxis.visibleRange = new NumberRange(-AXIS_LIMIT, AXIS_LIMIT);
    qAxis.visibleRange = new NumberRange(-AXIS_LIMIT, AXIS_LIMIT);
    cs.xAxes.add(iAxis);
    cs.yAxes.add(qAxis);
    const layers = [
        { capacity: PERSISTENCE, color: "#50C7E038" },
        { capacity: PERSISTENCE / 5, color: "#50C7E088" },
        { capacity: 3 * BATCH, color: "#C9F1FA" }
    ].map(({ capacity, color }) => {
        const dataSeries = new XyDataSeries(cw, { fifoCapacity: capacity, containsNaN: false });
        cs.renderableSeries.add(
            new XyScatterRenderableSeries(cw, {
                dataSeries,
                pointMarker: new EllipsePointMarker(cw, { width: 3, height: 3, fill: color, stroke: color, strokeThickness: 0 })
            })
        );
        return dataSeries;
    });
    // Faint rings at the ideal symbol positions, and an orange ring on the symbol under the mouse
    const idealSeries = new XyDataSeries(cw, { containsNaN: false });
    const hoverSeries = new XyDataSeries(cw, { containsNaN: false });
    cs.renderableSeries.add(
        new XyScatterRenderableSeries(cw, {
            dataSeries: idealSeries,
            pointMarker: new EllipsePointMarker(cw, { width: 13, height: 13, fill: "#00000000", stroke: "#FFFFFFAA", strokeThickness: 1.5 })
        }),
        new XyScatterRenderableSeries(cw, {
            dataSeries: hoverSeries,
            pointMarker: new EllipsePointMarker(cw, { width: 24, height: 24, fill: "#00000000", stroke: "#F48420", strokeThickness: 2.5 })
        })
    );
    cs.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier());

    // --- Chart 2: I and Q against time, after the receiver's matched filter, with dots at the symbol instants ---
    const traces = await SciChartSurface.create(tracesDiv, {
        theme: new SciChartJsNavyTheme(),
        title: `I and Q against time (last ${TRACE_SYMBOLS} symbols)`,
        titleStyle
    });
    const ts = traces.sciChartSurface;
    const tw = traces.wasmContext;
    ts.xAxes.add(new NumericAxis(tw, { axisTitleStyle, axisTitle: "Time (symbols)", autoRange: EAutoRange.Never, visibleRange: new NumberRange(0, TRACE_SYMBOLS - 1) }));
    ts.yAxes.add(new NumericAxis(tw, { axisTitleStyle, axisTitle: "Amplitude", autoRange: EAutoRange.Never, visibleRange: new NumberRange(-1.9, 1.9), labelPrecision: 1 }));
    const iTrace = new XyDataSeries(tw, { dataSeriesName: "I", dataIsSortedInX: true, containsNaN: false });
    const qTrace = new XyDataSeries(tw, { dataSeriesName: "Q", dataIsSortedInX: true, containsNaN: false });
    const iInstants = new XyDataSeries(tw, { dataSeriesName: "I at symbol instants", dataIsSortedInX: true, containsNaN: false });
    const qInstants = new XyDataSeries(tw, { dataSeriesName: "Q at symbol instants", dataIsSortedInX: true, containsNaN: false });
    const instantMarkers = [
        new XyScatterRenderableSeries(tw, {
            dataSeries: iInstants,
            pointMarker: new EllipsePointMarker(tw, { width: 7, height: 7, fill: "#50C7E0", stroke: "#FFFFFF", strokeThickness: 1 })
        }),
        new XyScatterRenderableSeries(tw, {
            dataSeries: qInstants,
            pointMarker: new EllipsePointMarker(tw, { width: 7, height: 7, fill: "#F48420", stroke: "#FFFFFF", strokeThickness: 1 })
        })
    ];
    ts.renderableSeries.add(
        new FastLineRenderableSeries(tw, { dataSeries: iTrace, stroke: "#50C7E0", strokeThickness: 2 }),
        new FastLineRenderableSeries(tw, { dataSeries: qTrace, stroke: "#F48420", strokeThickness: 2 }),
        ...instantMarkers
    );
    const traceLegend = new LegendModifier({ showCheckboxes: true });
    const traceCursor = new CursorModifier({ showTooltip: true, showAxisLabels: false });
    ts.chartModifiers.add(traceLegend, traceCursor, new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
    for (const markers of instantMarkers) {
        traceLegend.includeSeries(markers, false); // the legend and tooltip list only the I and Q lines
        traceCursor.includeSeries(markers, false);
    }

    // --- Chart 3: the spectrum of the received IQ samples, from -4 to +4 times the symbol rate ---
    const spectrum = await SciChartSurface.create(spectrumDiv, {
        theme: new SciChartJsNavyTheme(),
        title: "Spectrum of the IQ samples",
        titleStyle
    });
    const ss = spectrum.sciChartSurface;
    const sw = spectrum.wasmContext;
    ss.xAxes.add(new NumericAxis(sw, { axisTitleStyle, axisTitle: "Frequency (× symbol rate)", autoRange: EAutoRange.Never, visibleRange: new NumberRange(-4, 4), labelPrecision: 0 }));
    ss.yAxes.add(new NumericAxis(sw, { axisTitleStyle, axisTitle: "Power (dB)", autoRange: EAutoRange.Never, visibleRange: new NumberRange(-55, 10), labelPrecision: 0 }));
    const spectrumSeries = new XyDataSeries(sw, { dataSeriesName: "Power spectral density", dataIsSortedInX: true, containsNaN: false });
    ss.renderableSeries.add(new FastLineRenderableSeries(sw, { dataSeries: spectrumSeries, stroke: "#68BCAE", strokeThickness: 1.5 }));
    ss.chartModifiers.add(
        new CursorModifier({ showTooltip: true, showAxisLabels: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    const frequencies = Array.from({ length: SPECTRUM_SAMPLES }, (_, k) => ((k - SPECTRUM_SAMPLES / 2) / SPECTRUM_SAMPLES) * SAMPLES_PER_SYMBOL);

    // --- The simulation, and an animation loop that feeds it to the charts ---
    const simulator = createIqSimulator(7);
    let settings = null;
    let running = true;
    let frame = 0;
    let averagedPsd = null;
    const errorWindow = []; // per-batch sums for EVM and symbol errors over the persistence window

    const setModulation = (name) => {
        simulator.setConstellation(name);
        const points = simulator.getConstellation().points;
        idealSeries.clear();
        idealSeries.appendRange(points.map((p) => p.i), points.map((p) => p.q));
        hoverSeries.clear();
        for (const layer of layers) layer.clear();
        errorWindow.length = 0;
        averagedPsd = null;
    };

    // EVM: the RMS length of the error vectors (received minus sent), relative to the RMS of the ideal symbols
    const measure = () => {
        let errorPower = 0;
        let referencePower = 0;
        let symbolErrors = 0;
        let count = 0;
        for (const b of errorWindow) {
            errorPower += b.errorPower;
            referencePower += b.referencePower;
            symbolErrors += b.symbolErrors;
            count += b.count;
        }
        const evm = Math.sqrt(errorPower / Math.max(referencePower, 1e-12));
        return { evm, merDb: -20 * Math.log10(Math.max(evm, 1e-6)), symbolErrors, count };
    };

    // Keep the constellation square, so a squashed or skewed grid is really squashed or skewed on screen
    const keepSquare = () => {
        const rect = cs.seriesViewRect;
        if (!rect || rect.width < 10 || rect.height < 10) return;
        const q = qAxis.visibleRange;
        const centre = (iAxis.visibleRange.min + iAxis.visibleRange.max) / 2;
        const halfWidth = ((q.max - q.min) / 2) * (rect.width / rect.height);
        const current = (iAxis.visibleRange.max - iAxis.visibleRange.min) / 2;
        if (Math.abs(current - halfWidth) > 0.002 * halfWidth) iAxis.visibleRange = new NumberRange(centre - halfWidth, centre + halfWidth);
    };

    const updateTracesAndSpectrum = () => {
        const wave = simulator.recentWaveform(TRACE_SYMBOLS);
        iTrace.clear();
        iTrace.appendRange(wave.t, wave.i);
        qTrace.clear();
        qTrace.appendRange(wave.t, wave.q);
        const instants = [];
        const iAtInstants = [];
        const qAtInstants = [];
        for (let j = 0; j < wave.t.length; j += SAMPLES_PER_SYMBOL) {
            instants.push(wave.t[j]);
            iAtInstants.push(wave.i[j]);
            qAtInstants.push(wave.q[j]);
        }
        iInstants.clear();
        iInstants.appendRange(instants, iAtInstants);
        qInstants.clear();
        qInstants.appendRange(instants, qAtInstants);

        const samples = simulator.recentSamples(SPECTRUM_SAMPLES);
        const psd = iqSpectrumDb(samples.i, samples.q);
        if (!averagedPsd) averagedPsd = psd;
        else for (let k = 0; k < psd.length; k++) averagedPsd[k] = 0.8 * averagedPsd[k] + 0.2 * psd[k]; // smooth the noise
        const powerDb = new Float64Array(psd.length);
        for (let k = 0; k < psd.length; k++) powerDb[k] = 10 * Math.log10(Math.max(averagedPsd[k], 1e-12));
        spectrumSeries.clear();
        spectrumSeries.appendRange(frequencies, powerDb);
    };

    let onMeasured = (measurement) => {};
    const animate = () => {
        if (cs.isDeleted) return; // stop when the chart is deleted
        if (running && settings) {
            const batch = simulator.next(BATCH, settings);
            // One appendRange per layer per frame; the FIFO buffers drop the oldest symbols by themselves
            for (const layer of layers) layer.appendRange(batch.i, batch.q);
            const constellationNow = simulator.getConstellation();
            let errorPower = 0;
            let referencePower = 0;
            let symbolErrors = 0;
            for (let j = 0; j < BATCH; j++) {
                const di = batch.i[j] - batch.refI[j];
                const dq = batch.q[j] - batch.refQ[j];
                errorPower += di * di + dq * dq;
                referencePower += batch.refI[j] * batch.refI[j] + batch.refQ[j] * batch.refQ[j];
                if (nearestPoint(constellationNow, batch.i[j], batch.q[j]) !== batch.sent[j]) symbolErrors++;
            }
            errorWindow.push({ errorPower, referencePower, symbolErrors, count: BATCH });
            if (errorWindow.length > PERSISTENCE / BATCH) errorWindow.shift();
            // The traces, spectrum and readout change every 6th frame: often enough to look live, slow enough to read
            if (frame % 6 === 0) {
                updateTracesAndSpectrum();
                onMeasured(measure());
            }
            frame++;
        }
        keepSquare();
        requestAnimationFrame(animate);
    };

    // Hover: find the ideal symbol nearest the mouse, ring it, and report its bits
    let onHover = (hovered) => {};
    constellationDiv.addEventListener("mousemove", (event) => {
        const rect = constellationDiv.getBoundingClientRect();
        const view = cs.seriesViewRect; // in canvas pixels, which are CSS pixels × DpiHelper.PIXEL_RATIO
        const x = (event.clientX - rect.left) * DpiHelper.PIXEL_RATIO - view.left;
        const y = (event.clientY - rect.top) * DpiHelper.PIXEL_RATIO - view.top;
        if (x < 0 || y < 0 || x > view.width || y > view.height) {
            hoverSeries.clear();
            onHover(null);
            return;
        }
        const i = iAxis.getCurrentCoordinateCalculator().getDataValue(x);
        const q = qAxis.getCurrentCoordinateCalculator().getDataValue(y);
        const c = simulator.getConstellation();
        const point = c.points[nearestPoint(c, i, q)];
        hoverSeries.clear();
        hoverSeries.append(point.i, point.q);
        onHover({ point, i, q, bitsPerSymbol: c.bitsPerSymbol });
    });
    constellationDiv.addEventListener("mouseleave", () => {
        hoverSeries.clear();
        onHover(null);
    });
    // Double-click resets the zoom
    constellationDiv.addEventListener("dblclick", () => {
        qAxis.visibleRange = new NumberRange(-AXIS_LIMIT, AXIS_LIMIT);
        iAxis.visibleRange = new NumberRange(-AXIS_LIMIT, AXIS_LIMIT);
    });

    requestAnimationFrame(animate);
    return {
        setModulation,
        setSettings: (s) => {
            settings = s;
            errorWindow.length = 0; // measure the EVM afresh for the new settings
        },
        setRunning: (r) => (running = r),
        onMeasured: (callback) => (onMeasured = callback),
        onHover: (callback) => (onHover = callback)
    };
}
// #region_A_end

// The page layout: controls, a readout line, the constellation on the left and the I/Q traces and spectrum on the
// right. In your app these can be ordinary HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText +=
        "display:flex; flex-direction:column; background:#17243d; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;";
    const controls = document.createElement("div");
    controls.style.cssText = "display:flex; flex-wrap:wrap; gap:6px 16px; align-items:center; padding:8px 12px 4px;";
    const readout = document.createElement("div");
    readout.style.cssText = "padding:0 12px 6px; color:#c8d3e6; min-height:2.6em;";
    readout.setAttribute("aria-live", "polite");
    const charts = document.createElement("div");
    charts.style.cssText = "flex:1; min-height:0; display:flex; flex-wrap:wrap; overflow-y:auto;"; // scrolls when stacked on a phone
    // The constellation sits in a wrapper, so the hover label can float over it
    const constellationWrap = document.createElement("div");
    constellationWrap.style.cssText = "position:relative; flex:5 1 380px; min-width:280px; min-height:340px;";
    const constellationDiv = document.createElement("div");
    constellationDiv.id = divElementId + "-constellation"; // SciChart tells its charts apart by their div's id
    constellationDiv.style.cssText = "position:absolute; inset:0;";
    const hoverLabel = document.createElement("div");
    hoverLabel.style.cssText =
        "position:absolute; top:34px; right:14px; padding:4px 8px; border-radius:6px; background:#0b1a33dd; border:1px solid #F48420; color:#ffffff; pointer-events:none; display:none;";
    constellationWrap.append(constellationDiv, hoverLabel);
    const rightColumn = document.createElement("div");
    rightColumn.style.cssText = "flex:4 1 300px; min-width:280px; min-height:440px; display:flex; flex-direction:column;";
    const tracesDiv = document.createElement("div");
    tracesDiv.id = divElementId + "-traces";
    tracesDiv.style.cssText = "flex:1; min-height:0;";
    const spectrumDiv = document.createElement("div");
    spectrumDiv.id = divElementId + "-spectrum";
    spectrumDiv.style.cssText = "flex:1; min-height:0;";
    rightColumn.append(tracesDiv, spectrumDiv);
    charts.append(constellationWrap, rightColumn);
    root.append(controls, readout, charts);
    return { controls, readout, hoverLabel, constellationDiv, tracesDiv, spectrumDiv };
}

// A labelled <select> or slider that calls onChange with its new value
function addControl(parent, id, labelText, element, onChange) {
    const wrap = document.createElement("span");
    wrap.style.cssText = "display:inline-flex; align-items:center; gap:6px;";
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;
    label.style.fontWeight = "600";
    element.id = id;
    element.style.cssText += "font:inherit; accent-color:#F48420;";
    element.addEventListener("input", () => onChange(element.value));
    wrap.append(label, element);
    parent.append(wrap);
    return { label, element };
}
function makeSelect(options, value) {
    const select = document.createElement("select");
    select.style.cssText = "background:#22365B; color:#ffffff; border:1px solid #50C7E0; border-radius:6px; padding:2px 6px;";
    for (const [optionValue, text] of options) {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = text;
        select.append(option);
    }
    select.value = value;
    return select;
}
function makeSlider(min, max, step, value) {
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = String(min);
    slider.max = String(max);
    slider.step = String(step);
    slider.value = String(value);
    slider.style.width = "110px";
    return slider;
}

async function iqConstellationDemo(divElementId) {
    const { controls, readout, hoverLabel, constellationDiv, tracesDiv, spectrumDiv } = createLayout(divElementId);
    const demo = await createIqCharts(constellationDiv, tracesDiv, spectrumDiv);
    const FREQUENCY_OFFSETS = [0, 2, 5, 10, 20, 50, 100, 200, 500, 1000]; // Hz, at 1 million symbols per second
    const settings = { snrDb: 25, phaseNoiseDeg: 0, frequencyOffsetHz: 0, gainImbalanceDb: 0, quadratureSkewDeg: 0, compression: 0 };
    let modulation = "16QAM";
    const names = { BPSK: "BPSK", QPSK: "QPSK", "8PSK": "8PSK", "16QAM": "16-QAM", "64QAM": "64-QAM" };

    const select = addControl(controls, divElementId + "-modulation", "Modulation", makeSelect(Object.entries(names), modulation), (v) => {
        modulation = v;
        demo.setModulation(v);
    });
    const snr = addControl(controls, divElementId + "-snr", "SNR", makeSlider(0, 40, 1, settings.snrDb), (v) => {
        settings.snrDb = Number(v);
        refreshLabels();
    });
    const phaseNoise = addControl(controls, divElementId + "-phase-noise", "Phase noise", makeSlider(0, 10, 0.5, 0), (v) => {
        settings.phaseNoiseDeg = Number(v);
        refreshLabels();
    });
    const offset = addControl(controls, divElementId + "-offset", "Frequency offset", makeSlider(0, FREQUENCY_OFFSETS.length - 1, 1, 0), (v) => {
        settings.frequencyOffsetHz = FREQUENCY_OFFSETS[Number(v)];
        refreshLabels();
    });
    const gain = addControl(controls, divElementId + "-gain", "IQ gain imbalance", makeSlider(0, 3, 0.1, 0), (v) => {
        settings.gainImbalanceDb = Number(v);
        refreshLabels();
    });
    const skew = addControl(controls, divElementId + "-skew", "Quadrature skew", makeSlider(0, 15, 0.5, 0), (v) => {
        settings.quadratureSkewDeg = Number(v);
        refreshLabels();
    });
    const compression = addControl(controls, divElementId + "-compression", "Compression", makeSlider(0, 10, 1, 0), (v) => {
        settings.compression = Number(v);
        refreshLabels();
    });
    const pause = document.createElement("button");
    pause.textContent = "Pause";
    pause.style.cssText = "font:inherit; background:#22365B; color:#ffffff; border:1px solid #50C7E0; border-radius:6px; padding:2px 10px; cursor:pointer;";
    let running = true;
    pause.addEventListener("click", () => {
        running = !running;
        pause.textContent = running ? "Pause" : "Resume";
        demo.setRunning(running);
    });
    controls.append(pause);

    const refreshLabels = () => {
        snr.label.textContent = `SNR: ${settings.snrDb} dB`;
        phaseNoise.label.textContent = `Phase noise: ${settings.phaseNoiseDeg.toFixed(1)}° RMS`;
        offset.label.textContent = `Frequency offset: ${settings.frequencyOffsetHz} Hz`;
        offset.element.setAttribute("aria-valuetext", `${settings.frequencyOffsetHz} hertz`);
        gain.label.textContent = `IQ gain imbalance: ${settings.gainImbalanceDb.toFixed(1)} dB`;
        skew.label.textContent = `Quadrature skew: ${settings.quadratureSkewDeg.toFixed(1)}°`;
        compression.label.textContent =
            settings.compression === 0 ? "Compression: off" : `Compression: saturates ${12 - settings.compression} dB above average`;
        demo.setSettings(settings);
    };

    demo.onMeasured(({ evm, merDb, symbolErrors, count }) => {
        const c = names[modulation];
        const bits = { BPSK: 1, QPSK: 2, "8PSK": 3, "16QAM": 4, "64QAM": 6 }[modulation];
        const spin = (360 * settings.frequencyOffsetHz) / 1e6; // degrees per symbol at 1 Mbaud
        readout.textContent =
            `Simulated ${c} at 1 Mbaud, ${bits} bit${bits > 1 ? "s" : ""} per symbol, last ${count.toLocaleString("en-US")} symbols. ` +
            `EVM ${(100 * evm).toFixed(1)}% RMS, MER ${merDb.toFixed(1)} dB, symbol errors ${((100 * symbolErrors) / Math.max(count, 1)).toFixed(2)}%` +
            (spin > 0 ? `. Rotation ${spin.toFixed(4)}° per symbol, not corrected.` : ".");
    });
    demo.onHover((hovered) => {
        if (!hovered) {
            hoverLabel.style.display = "none";
            return;
        }
        const { point } = hovered;
        hoverLabel.style.display = "block";
        hoverLabel.textContent = `Nearest symbol: bits ${point.bits}  (I ${point.i.toFixed(2)}, Q ${point.q.toFixed(2)})`;
    });
    select.element.dispatchEvent(new Event("input")); // draw the ideal positions for the starting modulation
    refreshLabels();
}

iqConstellationDemo("scichart-root");
