import * as SciChart from "scichart";

// A simulated telemetry recording: a car lapping a circuit, logged at 1,000 samples per second.
// Each sample has a timestamp in microseconds and three channels: speed (km/h, to 0.01),
// throttle (%, to 0.1) and brake (%, to 0.1). The clock jitters by a few microseconds now and then,
// and the link drops a few short runs of samples, as real loggers do. A seeded random generator
// makes the recording the same every time. These are illustrative numbers, not data from a real car.
const SAMPLE_INTERVAL_US = 1000; // 1,000 samples per second
const LAP_SECONDS = 90;
const VALUE_SCALE = 100; // every value is recorded to 0.01 or coarser, so value × 100 is a whole number

function makeTelemetry(count) {
    let seed = 20261120;
    const random = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
    const t = new Float64Array(count);
    const speed = new Float64Array(count);
    const throttle = new Float64Array(count);
    const brake = new Float64Array(count);
    // The speed the driver aims for at each point of the lap: straights and corners
    const targetSpeed = (s) => {
        const x = (2 * Math.PI * s) / LAP_SECONDS;
        return 205 + 85 * Math.sin(3 * x) + 35 * Math.sin(7 * x + 1) + 15 * Math.sin(13 * x + 2);
    };
    let time = 0; // µs
    let v = 180; // km/h
    for (let i = 0; i < count; i++) {
        const s = time / 1e6;
        const gap = targetSpeed(s) - v;
        // Throttle eases in as the car falls below the target; the brake comes in only for big slow-downs
        const pedal = Math.max(0, Math.min(100, 30 + gap * 4));
        const brakeNow = gap < -5 ? Math.min(100, (-gap - 5) * 3) : 0;
        v += (gap > 0 ? Math.min(gap * 2, 28) : Math.max(gap * 4, -95)) * (SAMPLE_INTERVAL_US / 1e6);
        t[i] = time;
        speed[i] = Math.round((v + (random() - 0.5) * 0.6) * 100) / 100;
        throttle[i] = Math.round(pedal * 10) / 10;
        brake[i] = Math.round(brakeNow * 10) / 10;
        // Next timestamp: usually exactly 1 ms later, sometimes a few µs off, rarely after a dropout
        let step = SAMPLE_INTERVAL_US;
        if (random() < 0.02) step += Math.round((random() - 0.5) * 50);
        if (random() < 0.0003) step += SAMPLE_INTERVAL_US * Math.round(5 + random() * 35);
        time += step;
    }
    return { t, speed, throttle, brake };
}

const CHANNELS = ["speed", "throttle", "brake"];
const COLUMNS = ["t", ...CHANNELS];

// --- Encoders: what a server would do before sending the data. Each returns the bytes it would send. ---

// (a) JSON, one object per sample (row order)
function encodeJsonRows(data) {
    const rows = new Array(data.t.length);
    for (let i = 0; i < rows.length; i++) {
        rows[i] = { t: data.t[i], speed: data.speed[i], throttle: data.throttle[i], brake: data.brake[i] };
    }
    return new TextEncoder().encode(JSON.stringify(rows));
}

// (b) JSON, one array per channel (column order)
function encodeJsonColumns(data) {
    const columns = {};
    for (const name of COLUMNS) columns[name] = Array.from(data[name]);
    return new TextEncoder().encode(JSON.stringify(columns));
}

// (c) Binary: an 8-byte header (sample count, column count), then each column as raw 64-bit floats
function encodeFloat64Columns(data) {
    const count = data.t.length;
    const buffer = new ArrayBuffer(8 + COLUMNS.length * count * 8);
    new Uint32Array(buffer, 0, 2).set([count, COLUMNS.length]);
    COLUMNS.forEach((name, c) => new Float64Array(buffer, 8 + c * count * 8, count).set(data[name]));
    return new Uint8Array(buffer);
}

// (d) Delta + zig-zag varint: timestamps as delta-of-delta, values as deltas of scaled integers
function encodeDeltaVarint(data) {
    const count = data.t.length;
    const out = new Uint8Array(16 + COLUMNS.length * count * 10);
    let pos = 0;
    const writeVarint = (value) => {
        // 7 bits per byte, low bits first; the top bit says "another byte follows"
        while (value >= 128) {
            out[pos++] = (value % 128) | 128;
            value = Math.floor(value / 128);
        }
        out[pos++] = value;
    };
    const zigZag = (n) => (n >= 0 ? 2 * n : -2 * n - 1); // 0, -1, 1, -2, 2 … → 0, 1, 2, 3, 4 …
    writeVarint(count);
    writeVarint(VALUE_SCALE);
    let previous = 0;
    let previousDelta = 0;
    for (let i = 0; i < count; i++) {
        const delta = data.t[i] - previous;
        writeVarint(zigZag(delta - previousDelta));
        previous = data.t[i];
        previousDelta = delta;
    }
    for (const name of CHANNELS) {
        const column = data[name];
        let previousInt = 0;
        for (let i = 0; i < count; i++) {
            const asInt = Math.round(column[i] * VALUE_SCALE);
            writeVarint(zigZag(asInt - previousInt));
            previousInt = asInt;
        }
    }
    return out.slice(0, pos);
}

// --- (e) Gorilla-style bit packing (Pelkonen et al., 2015): delta-of-delta timestamps in variable-width
// buckets, and each value XORed with the previous one, keeping only the bits that changed.
// It works on the raw 64 bits of each double, split into two 32-bit halves (little-endian, as in every
// mainstream browser). Both the encoder and the decoder are here, outside the part to copy, as they're longer. ---
const bits64 = new Float64Array(1);
const halves = new Uint32Array(bits64.buffer); // [0] = low 32 bits, [1] = high 32 bits

function encodeGorilla(data) {
    const count = data.t.length;
    const words = new Uint32Array(8 + Math.ceil((count * (36 + CHANNELS.length * 77)) / 32));
    let bitPos = 0;
    const writeBits = (value, n) => {
        // write the n low bits of value (n from 0 to 32), most significant first
        if (n === 0) return;
        value = n === 32 ? value >>> 0 : (value & (2 ** n - 1)) >>> 0;
        const index = bitPos >>> 5;
        const free = 32 - (bitPos & 31);
        if (n <= free) {
            words[index] |= value << (free - n);
        } else {
            words[index] |= value >>> (n - free);
            words[index + 1] |= value << (32 - (n - free));
        }
        bitPos += n;
    };
    writeBits(count, 32);
    // Timestamps: the first in full, then the delta of deltas in buckets ('0', '10', '110', '1110', '1111')
    writeBits(Math.floor(data.t[0] / 4294967296), 32);
    writeBits(data.t[0] % 4294967296, 32);
    let previousDelta = 0;
    for (let i = 1; i < count; i++) {
        const delta = data.t[i] - data.t[i - 1];
        const d = delta - previousDelta;
        previousDelta = delta;
        if (d === 0) writeBits(0, 1);
        else if (d >= -63 && d <= 64) (writeBits(0b10, 2), writeBits(d + 63, 7));
        else if (d >= -255 && d <= 256) (writeBits(0b110, 3), writeBits(d + 255, 9));
        else if (d >= -2047 && d <= 2048) (writeBits(0b1110, 4), writeBits(d + 2047, 12));
        else (writeBits(0b1111, 4), writeBits(d >>> 0, 32));
    }
    // Values: XOR each double with the previous one
    for (const name of CHANNELS) {
        const column = data[name];
        bits64[0] = column[0];
        let prevHi = halves[1];
        let prevLo = halves[0];
        writeBits(prevHi, 32);
        writeBits(prevLo, 32);
        let prevLead = -1;
        let prevTrail = 0;
        for (let i = 1; i < count; i++) {
            bits64[0] = column[i];
            const hi = halves[1];
            const lo = halves[0];
            const xHi = (hi ^ prevHi) >>> 0;
            const xLo = (lo ^ prevLo) >>> 0;
            prevHi = hi;
            prevLo = lo;
            if (xHi === 0 && xLo === 0) {
                writeBits(0, 1); // same value as before: one bit
                continue;
            }
            let lead = xHi !== 0 ? Math.clz32(xHi) : 32 + Math.clz32(xLo);
            const trail = xLo !== 0 ? 31 - Math.clz32(xLo & -xLo) : 32 + 31 - Math.clz32(xHi & -xHi);
            let useTrail = trail;
            let length;
            if (prevLead >= 0 && lead >= prevLead && trail >= prevTrail) {
                writeBits(0b10, 2); // the changed bits fit inside the previous window
                useTrail = prevTrail;
                length = 64 - prevLead - prevTrail;
            } else {
                if (lead > 31) lead = 31; // 5 bits for the leading-zero count
                length = 64 - lead - trail;
                writeBits(0b11, 2);
                writeBits(lead, 5);
                writeBits(length & 63, 6); // 64 is written as 0
                prevLead = lead;
                prevTrail = trail;
            }
            // Shift the XOR right by useTrail and write its low `length` bits
            let sHi = xHi;
            let sLo = xLo;
            if (useTrail >= 32) {
                sLo = xHi >>> (useTrail - 32);
                sHi = 0;
            } else if (useTrail > 0) {
                sLo = ((xLo >>> useTrail) | (xHi << (32 - useTrail))) >>> 0;
                sHi = xHi >>> useTrail;
            }
            if (length > 32) {
                writeBits(sHi, length - 32);
                writeBits(sLo, 32);
            } else {
                writeBits(sLo, length);
            }
        }
    }
    return new Uint8Array(words.buffer, 0, Math.ceil(bitPos / 32) * 4).slice();
}

function decodeGorilla(bytes) {
    const words = new Uint32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4);
    let bitPos = 0;
    const readBits = (n) => {
        if (n === 0) return 0;
        const index = bitPos >>> 5;
        const offset = bitPos & 31;
        const available = 32 - offset;
        bitPos += n;
        if (n <= available) return ((words[index] << offset) >>> (32 - n)) >>> 0;
        const rest = n - available;
        const top = available === 32 ? words[index] : words[index] & (2 ** available - 1);
        return (top * 2 ** rest + (words[index + 1] >>> (32 - rest))) >>> 0;
    };
    const readBit = () => {
        const bit = (words[bitPos >>> 5] >>> (31 - (bitPos & 31))) & 1;
        bitPos++;
        return bit;
    };
    const count = readBits(32);
    const t = new Float64Array(count);
    t[0] = readBits(32) * 4294967296 + readBits(32);
    let delta = 0;
    for (let i = 1; i < count; i++) {
        let d = 0;
        if (readBit() === 1) {
            if (readBit() === 0) d = readBits(7) - 63;
            else if (readBit() === 0) d = readBits(9) - 255;
            else if (readBit() === 0) d = readBits(12) - 2047;
            else d = readBits(32) | 0;
        }
        delta += d;
        t[i] = t[i - 1] + delta;
    }
    const result = { t };
    for (const name of CHANNELS) {
        const column = new Float64Array(count);
        let hi = readBits(32);
        let lo = readBits(32);
        halves[1] = hi;
        halves[0] = lo;
        column[0] = bits64[0];
        let lead = 0;
        let trail = 0;
        for (let i = 1; i < count; i++) {
            if (readBit() === 1) {
                if (readBit() === 1) {
                    lead = readBits(5);
                    const length = readBits(6) || 64;
                    trail = 64 - lead - length;
                }
                const length = 64 - lead - trail;
                let mHi = 0;
                let mLo;
                if (length > 32) {
                    mHi = readBits(length - 32);
                    mLo = readBits(32);
                } else {
                    mLo = readBits(length);
                }
                // Shift the changed bits back into place and XOR them into the previous value
                if (trail >= 32) {
                    mHi = (mLo << (trail - 32)) >>> 0;
                    mLo = 0;
                } else if (trail > 0) {
                    mHi = ((mHi << trail) | (mLo >>> (32 - trail))) >>> 0;
                    mLo = (mLo << trail) >>> 0;
                }
                hi = (hi ^ mHi) >>> 0;
                lo = (lo ^ mLo) >>> 0;
                halves[1] = hi;
                halves[0] = lo;
            }
            column[i] = bits64[0];
        }
        result[name] = column;
    }
    return result;
}

// The demo's controls, results table and chart each need an element. This splits the page's div into a header
// and a chart pane; in your app, they can simply be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const header = document.createElement("div");
    header.style.cssText =
        "padding:8px 12px 4px; color:#ffffff; font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    header.innerHTML =
        `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px">` +
        `<label>Samples <select data-id="count" style="font:inherit">` +
        `<option value="100000">100,000</option><option value="250000" selected>250,000</option>` +
        `<option value="1000000">1,000,000</option></select></label>` +
        `<label>Format <select data-id="format" style="font:inherit"></select></label>` +
        `<button data-id="draw" style="font:inherit; padding:2px 10px; cursor:pointer">Decode and draw</button>` +
        `<button data-id="measure" style="font:inherit; padding:2px 10px; cursor:pointer">Measure again</button>` +
        `<span data-id="status" role="status" style="color:#c8d3e8"></span></div>` +
        `<div style="overflow-x:auto; margin-top:6px"><table data-id="table" style="border-collapse:collapse; width:100%; ` +
        `font-size:13px; font-variant-numeric:tabular-nums"></table></div>`;
    const pane = document.createElement("div");
    pane.id = `${divElementId}-chart`;
    pane.style.cssText = "flex:1; min-height:0;";
    root.append(header, pane);
    const get = (selector) => header.querySelector(selector);
    return {
        pane,
        countSelect: get('select[data-id="count"]'),
        formatSelect: get('select[data-id="format"]'),
        drawButton: get('button[data-id="draw"]'),
        measureButton: get('button[data-id="measure"]'),
        status: get('span[data-id="status"]'),
        table: get('table[data-id="table"]')
    };
}

async function timeSeriesFormatsDemo(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Decode time series sent in five formats into one Float64Array per column, and draw them with SciChart.js.
    // The decoders below are what runs in the browser; the encoders above are what a server would do.
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EXyDirection,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        LegendModifier,
        ELegendOrientation,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // (a) JSON rows: parse, then copy each field of each object into its column
    function decodeJsonRows(bytes) {
        const rows = JSON.parse(new TextDecoder().decode(bytes));
        const t = new Float64Array(rows.length);
        const speed = new Float64Array(rows.length);
        const throttle = new Float64Array(rows.length);
        const brake = new Float64Array(rows.length);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            t[i] = row.t;
            speed[i] = row.speed;
            throttle[i] = row.throttle;
            brake[i] = row.brake;
        }
        return { t, speed, throttle, brake };
    }

    // (b) JSON columns: parse, then copy each array into a Float64Array
    function decodeJsonColumns(bytes) {
        const columns = JSON.parse(new TextDecoder().decode(bytes));
        const result = {};
        for (const name of COLUMNS) result[name] = Float64Array.from(columns[name]);
        return result;
    }

    // (c) Binary Float64 columns: no parsing and no copying. Each column is a view onto the received buffer.
    function decodeFloat64Columns(bytes) {
        const [count] = new Uint32Array(bytes.buffer, bytes.byteOffset, 2);
        const result = {};
        COLUMNS.forEach((name, c) => {
            result[name] = new Float64Array(bytes.buffer, bytes.byteOffset + 8 + c * count * 8, count);
        });
        return result;
    }

    // (d) Delta + zig-zag varint: read each varint, undo the zig-zag, and add up the deltas
    function decodeDeltaVarint(bytes) {
        let pos = 0;
        const readVarint = () => {
            let byte = bytes[pos++];
            if (byte < 128) return byte; // most deltas fit in one byte
            let value = byte & 127;
            let multiplier = 128;
            do {
                byte = bytes[pos++];
                value += (byte & 127) * multiplier;
                multiplier *= 128;
            } while (byte >= 128);
            return value;
        };
        const unZigZag = (n) => (n % 2 === 0 ? n / 2 : -(n + 1) / 2);
        const count = readVarint();
        const scale = readVarint();
        const result = { t: new Float64Array(count) };
        let time = 0;
        let delta = 0;
        for (let i = 0; i < count; i++) {
            delta += unZigZag(readVarint());
            time += delta;
            result.t[i] = time;
        }
        for (const name of CHANNELS) {
            const column = new Float64Array(count);
            let asInt = 0;
            for (let i = 0; i < count; i++) {
                asInt += unZigZag(readVarint());
                column[i] = asInt / scale;
            }
            result[name] = column;
        }
        return result;
    }

    const FORMATS = [
        { name: "JSON rows (baseline)", encode: encodeJsonRows, decode: decodeJsonRows },
        { name: "JSON columns (baseline)", encode: encodeJsonColumns, decode: decodeJsonColumns },
        { name: "Binary Float64 columns", encode: encodeFloat64Columns, decode: decodeFloat64Columns },
        { name: "Delta + zig-zag varint", encode: encodeDeltaVarint, decode: decodeDeltaVarint },
        { name: "Gorilla-style XOR", encode: encodeGorilla, decode: decodeGorilla }
    ];
    FORMATS.forEach((format, i) => ui.formatSelect.add(new Option(format.name, String(i), i === 2, i === 2)));

    // --- The chart: speed on the left axis, throttle and brake (0 to 100 %) on the right ---
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.pane, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Once, drawMinorGridLines: false })
    );
    const pedalAxis = new NumericAxis(wasmContext, {
        id: "pedals",
        axisAlignment: EAxisAlignment.Right,
        axisTitle: "Throttle and brake (%)",
        autoRange: EAutoRange.Never,
        visibleRange: new NumberRange(0, 300), // pedals use the lower third of the chart
        drawMajorGridLines: false,
        drawMinorGridLines: false
    });
    pedalAxis.labelProvider.formatLabel = (value) => (value > 100 ? "" : value.toFixed(0)); // label 0 to 100 only
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Speed (km/h)",
            axisAlignment: EAxisAlignment.Left,
            autoRange: EAutoRange.Never,
            labelPrecision: 0,
            visibleRange: new NumberRange(0, 360),
            drawMinorGridLines: false
        }),
        pedalAxis
    );
    const lines = [
        { name: "speed", label: "Speed (km/h)", colour: "#50C7E0", yAxisId: undefined },
        { name: "throttle", label: "Throttle (%)", colour: "#3BD16F", yAxisId: "pedals" },
        { name: "brake", label: "Brake (%)", colour: "#FF6B6B", yAxisId: "pedals" }
    ].map((spec) => {
        // isSorted and containsNaN tell SciChart it can use its fastest paths for ranging and drawing
        const dataSeries = new XyDataSeries(wasmContext, { dataSeriesName: spec.label, isSorted: true, containsNaN: false });
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries,
                stroke: spec.colour,
                strokeThickness: spec.name === "speed" ? 2 : 1,
                yAxisId: spec.yAxisId
            })
        );
        return { ...spec, dataSeries };
    });
    sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true, orientation: ELegendOrientation.Horizontal }),
        new CursorModifier({ showTooltip: true, showYLine: false }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    );

    // Load decoded columns into the chart: one appendRange per channel, with typed arrays and no per-point objects
    async function draw(columns) {
        const seconds = new Float64Array(columns.t.length);
        for (let i = 0; i < seconds.length; i++) seconds[i] = columns.t[i] / 1e6; // µs → s for the time axis
        for (const line of lines) {
            line.dataSeries.clear();
            line.dataSeries.appendRange(seconds, columns[line.name]);
        }
        sciChartSurface.zoomExtentsX(); // the y-axes keep their fixed ranges
        await sciChartSurface.nextStateRender(); // resolves once the frame is on screen
    }

    // --- Measuring: encode the recording in every format, then time each decode and check it is exact ---
    let data = null;
    let encoded = [];
    const pause = () => new Promise((resolve) => setTimeout(resolve, 0)); // let the page repaint between steps
    const fmtBytes = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${(n / 1e3).toFixed(0)} kB`);
    const sameAs = (a, b) => COLUMNS.every((name) => a[name].length === b[name].length && a[name].every((v, i) => v === b[name][i]));
    const cell = "padding:3px 8px; border-bottom:1px solid #ffffff22; text-align:right;";
    function renderTable(results) {
        const head = ["Format", "Size", "Bytes per sample", "Gzipped", "Decode time", "Round trip"];
        ui.table.innerHTML =
            `<tr>${head.map((h, i) => `<th style="${cell}${i === 0 ? "text-align:left;" : ""} color:#c8d3e8; font-weight:600">${h}</th>`).join("")}</tr>` +
            results
                .map(
                    (r) =>
                        `<tr><td style="${cell} text-align:left">${r.name}</td><td style="${cell}">${r.size}</td>` +
                        `<td style="${cell}">${r.perSample}</td><td style="${cell}">${r.gzip}</td>` +
                        `<td style="${cell}">${r.decode}</td><td style="${cell}">${r.exact}</td></tr>`
                )
                .join("");
    }

    async function gzipSize(bytes) {
        if (typeof CompressionStream === "undefined") return "n/a";
        const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"));
        return fmtBytes((await new Response(stream).arrayBuffer()).byteLength);
    }

    let runId = 0;
    async function measure() {
        const id = ++runId;
        const count = Number(ui.countSelect.value);
        const results = FORMATS.map((f) => ({ name: f.name, size: "…", perSample: "…", gzip: "…", decode: "…", exact: "…" }));
        renderTable(results);
        ui.status.textContent = "Generating the recording…";
        await pause();
        data = makeTelemetry(count);
        encoded = [];
        for (const [i, format] of FORMATS.entries()) {
            if (id !== runId) return; // a newer run has started
            ui.status.textContent = `Encoding and decoding ${format.name}…`;
            await pause();
            const bytes = format.encode(data);
            encoded[i] = bytes;
            // Time two decodes and keep the faster, so a one-off pause doesn't skew the result
            let best = Infinity;
            let decoded = null;
            for (let run = 0; run < 2; run++) {
                const start = performance.now();
                decoded = format.decode(bytes);
                best = Math.min(best, performance.now() - start);
            }
            Object.assign(results[i], {
                size: fmtBytes(bytes.byteLength),
                perSample: (bytes.byteLength / count).toFixed(2),
                decode: `${best < 10 ? best.toFixed(1) : best.toFixed(0)} ms`,
                exact: sameAs(decoded, data) ? "exact" : "differs"
            });
            renderTable(results);
        }
        ui.status.textContent = "Compressing with gzip…";
        for (const [i, bytes] of encoded.entries()) {
            const size = await gzipSize(bytes);
            if (id !== runId) return;
            results[i].gzip = size;
            renderTable(results);
        }
        ui.status.textContent = `Measured in this browser: ${count.toLocaleString("en-GB")} samples × 4 columns.`;
    }

    async function decodeAndDraw() {
        const format = FORMATS[Number(ui.formatSelect.value)];
        const bytes = encoded[Number(ui.formatSelect.value)] ?? format.encode(data);
        const start = performance.now();
        const columns = format.decode(bytes);
        const decoded = performance.now();
        await draw(columns);
        const drawn = performance.now();
        ui.status.textContent =
            `${format.name}: decoded in ${(decoded - start).toFixed(0)} ms, appended and drawn in ` +
            `${(drawn - decoded).toFixed(0)} ms, ${(drawn - start).toFixed(0)} ms in total.`;
    }

    ui.drawButton.addEventListener("click", decodeAndDraw);
    ui.measureButton.addEventListener("click", measure);
    ui.countSelect.addEventListener("change", async () => {
        await measure();
        await decodeAndDraw();
    });

    // Draw straight away; measure when the demo first scrolls into view
    data = makeTelemetry(Number(ui.countSelect.value));
    await draw(data);
    renderTable(FORMATS.map((f) => ({ name: f.name, size: "", perSample: "", gzip: "", decode: "", exact: "" })));
    const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            measure();
        }
    });
    observer.observe(ui.pane);
    sciChartSurface.addDeletable({ delete: () => observer.disconnect() });
    // #region_A_end
}

timeSeriesFormatsDemo("scichart-root");
