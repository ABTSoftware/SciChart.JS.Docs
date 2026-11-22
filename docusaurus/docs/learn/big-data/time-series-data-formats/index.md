---
sidebar_position: 30
sidebar_label: Time Series Data Formats
title: "Time Series Data Formats: JSON vs Protobuf vs Arrow vs Parquet"
description: "How to send large and streaming time series to a browser chart fast: row vs column order, typed arrays, delta, varint and Gorilla compression, and JSON vs Protobuf vs Arrow vs Parquet."
keywords:
    [
        "time series data format",
        "columnar format",
        "column vs row order",
        "binary vs json",
        "protobuf vs json",
        "apache arrow",
        "parquet vs arrow",
        "delta encoding",
        "delta of delta encoding",
        "varint",
        "zigzag encoding",
        "gorilla compression",
        "time series compression",
        "questdb wire protocol",
        "websocket binary data"
    ]
image: /img/learn/time-series-data-formats-og.png
related: [big-data-visualization, downsampling, telemetry, motorsport-telemetry]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is the best data format for time series charts?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "For most charts, with thousands to tens of thousands of points, JSON is fine. For the highest performance, keep the data columnar from end to end: store it in a columnar time series database, Arrow or Parquet, send binary columns compressed with delta-of-delta timestamps and varint or Gorilla-style values, and decompress them on the client straight into one Float64Array per column for the chart."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Is Protobuf faster than JSON?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Usually, because Protocol Buffers is binary and schema-based: field names aren't repeated and numbers aren't parsed from text. The size gain depends on the data. Integers shrink as varints, but a double always takes 8 bytes, so a short decimal such as 12.5 can be smaller as JSON text. For time series, put the values in packed repeated fields, one per channel, rather than one message per sample."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is the difference between Apache Arrow and Parquet?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Both are columnar, but they do different jobs. Apache Arrow is an in-memory and streaming format: its buffers can be read in place without decoding, so it suits moving data between processes or to a browser. Parquet is a compressed storage file format with its metadata after the data, which suits files on disk and in data lakes. A common pattern is to store in Parquet and serve in Arrow."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is delta encoding?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Delta encoding stores the difference between each value and the one before it instead of the value itself. Neighbouring samples of a time series are usually close, so the differences are small numbers that need fewer bytes. Applying it twice (delta of delta) turns regular timestamps into a run of zeros. The receiver adds the differences back up to restore the original values exactly."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is Gorilla compression?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Gorilla compression is the time series encoding described by Facebook engineers in 2015 for their in-memory Gorilla database. It stores timestamps as deltas of deltas in variable-width bit buckets, so a regular timestamp costs one bit, and stores each floating-point value as the XOR with the previous one, keeping only the bits that changed. The paper reports an average of 1.37 bytes per data point."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I load binary data into a JavaScript chart?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Receive the data as an ArrayBuffer, for example from a WebSocket with binaryType set to arraybuffer or from fetch with arrayBuffer(). Decode it into one Float64Array per column, ideally in a Web Worker, then pass the arrays to the chart in one call per channel. With SciChart.js, XyDataSeries.appendRange accepts Float64Array x and y values directly, with no per-point objects."
                    }
                }
            ]
        })}
    </script>
</head>

# Time Series Data Formats

## What is a time series data format?

A **time series data format** is the way timestamped measurements are laid out as bytes for storage or for sending over a network. It decides whether samples travel as text or binary, row by row or column by column, and raw or compressed, which in turn sets how large the data is and how fast a chart can load it.

![A dark navy line chart of simulated motorsport telemetry at 1,000 samples per second: speed in km/h rising and falling through corners over several laps, with throttle and brake percentages along the bottom, decoded from a compact binary format](/img/learn/time-series-data-formats-og.png)

*Simulated car telemetry (speed, throttle and brake at 1,000 samples per second) decoded from a binary columnar format and drawn as a line chart (sample data). [Try the interactive version](#how-to-load-binary-time-series-into-a-chart-in-javascript-react-or-angular).*

:::tip Key takeaways
- JSON is fine for most charts: thousands to tens of thousands of points, updated a few times a second.
- Charts read data as columns, one array per channel, so data stored and sent in columns needs no reshaping in the browser.
- Time series compression (delta of delta for timestamps, deltas of scaled integers or Gorilla-style XOR for values, packed as varints or bits) cuts the size to a few bytes per sample without losing precision.
- The browser decompresses each column straight into a `Float64Array` buffer and hands it to the chart in one call, with no per-point objects.
:::

The same choices apply to telemetry from vehicles and machines, market ticks, sensor networks and lab instruments. This guide covers both paths, JSON for most charts and binary columns for large or fast data, and when to use each.

## When is JSON good enough for time series?

JSON is the default for web APIs, and for most charts it is the right choice. If a chart loads thousands or tens of thousands of points, or appends a handful of samples a few times a second, JSON's overhead is a few milliseconds and isn't worth engineering away. Use whatever your API already returns.

At hundreds of thousands or millions of points, or with high update rates, JSON costs time in four places.

- Size. A sample written as `{"t":3003,"speed":212.52,"throttle":87.5,"brake":0}` is 51 characters, and only the numbers carry information. The field names repeat in every object.
- Parsing. Every number is text that must be scanned and converted to a binary double, character by character.
- Allocation. `JSON.parse` builds one JavaScript object per sample. A million samples means a million objects for the garbage collector to track, before the chart has seen a value.
- Copying. Most charts then copy the values out of those objects into their own arrays, so the data is handled twice.

Converting rows to columns in the browser doesn't fix this: it adds a pass over every object after the parse. The sections below show the alternative, where the data is never in rows at all.

The interactive test further down measures both paths in your browser. On its simulated recording, JSON rows take about 56 bytes per sample against 4 bytes for a delta-varint encoding of the same values.

## Row order vs column order

The first decision is the shape of the data. In **row order**, each sample is one record holding all its fields. In **column order** (also called a columnar format), all the values of one field are stored together: every timestamp, then every speed, then every throttle position.

![The same four telemetry samples in row order and in column order. Row order shows four JSON objects with time, speed, throttle and brake interleaved and field names repeated. Column order shows one array of times, one of speeds, one of throttles and one of brakes, with the tiny differences between neighbours called out: time steps of 1000, 0 and 3 microseconds as deltas of deltas, and speed changes of 4, minus 1 and 12 hundredths. Each column maps onto one Float64Array for a single appendRange call](./row-vs-column-order.svg)

| | Row order | Column order |
| --- | --- | --- |
| Layout | One record per sample: `t, speed, throttle, brake, t, speed, …` | One array per field: `t, t, t, …, speed, speed, speed, …` |
| Field names | Repeated per record (JSON) or once in a schema | Once per column |
| Neighbouring values | Different fields, unrelated | The same field one sample apart, usually close |
| Compression | Poor: little repetition next to each other | Good: deltas are tiny and runs repeat |
| Reading one channel | Touches every record | Reads one contiguous block |
| Typical formats | JSON objects, CSV, one Protobuf message per sample | JSON arrays per field, Apache Arrow, Parquet, custom binary columns |
| Best for | Small payloads, APIs that return a few records | Large and streaming series, analytics, charts |

Charts draw one series at a time, so they want columns. A line series needs an array of x values and an array of y values. Time series databases built for analytics already store data this way, column by column, so when the data stays columnar from the database to the browser, each stored column maps onto one chart array with no reshaping on the way.

## Typed arrays: how the browser holds numbers

JavaScript has a binary side that suits columns exactly.

- An **`ArrayBuffer`** is a block of raw bytes, such as the body of a binary WebSocket message or an HTTP response read with `arrayBuffer()`.
- A **typed array** is a view that reads those bytes as numbers of one type: `Float64Array` (64-bit floats, the same as a JavaScript number), `Float32Array`, `Int32Array`, `Uint8Array` and so on.
- A view can start part-way into a buffer. `new Float64Array(buffer, 8, count)` reads `count` doubles starting at byte 8, without copying anything. That is a **zero-copy** view: decoding a binary column of doubles costs almost nothing.
- A `Float64Array` view's start offset must be a multiple of 8, or the browser throws a `RangeError`. Binary formats that are meant to be read in place pad their columns for this reason; Apache Arrow recommends 8- or 64-byte alignment.
- `DataView` reads values at any offset and lets you choose the byte order with its `littleEndian` argument, which defaults to big-endian. Typed arrays always use the computer's own byte order, which is little-endian on the processors browsers run on, so a server that writes little-endian doubles can be read with plain typed array views.

Charting libraries built for big data accept typed arrays directly. In SciChart.js, the data series API takes a `NumberArray`, defined as `number[] | Float64Array`, so one column becomes one `appendRange(xValues, yValues)` call.

## How time series compression works

Raw doubles take 8 bytes per value, and a sample with a timestamp and three channels takes 32. Column order makes four simple tricks possible, the same ones columnar time series databases use internally, and together they get most series down to a few bytes per sample without losing any precision.

### Delta and delta-of-delta encoding

**Delta encoding** stores each value as its difference from the previous one. The receiver adds the differences back up and gets the original values exactly.

Timestamps benefit most when encoded twice. A logger sampling every millisecond writes times of 0, 1000, 2000, 3003 and 4000 microseconds. The deltas are 1000, 1000, 1003 and 997. The **delta of delta** (each delta minus the previous delta) is 1000, then 0, 3 and −6. A perfectly regular clock produces nothing but zeros.

Values usually change by small steps too. Decimal readings need one more step first: if every speed is recorded to 0.01 km/h, multiply by 100 to get whole numbers (212.37 becomes 21237). Deltas of whole numbers are exact, while deltas of floating-point decimals pick up rounding errors.

### Zig-zag and varint encoding

A small number shouldn't take 8 bytes. A **varint** (variable-length integer) writes a whole number 7 bits at a time, lowest bits first, and sets the top bit of each byte when another byte follows. Numbers below 128 take one byte, below 16,384 two, and so on. Protocol Buffers uses this for its integer fields.

Deltas can be negative, and in two's complement a small negative number looks huge. **Zig-zag encoding** maps signed numbers to unsigned ones so that small magnitudes stay small: 0, −1, 1, −2, 2 become 0, 1, 2, 3, 4.

Here is the worked example, from the samples above:

| Column | Value | Delta (of delta for time) | Zig-zag | Varint bytes (hex) |
| --- | --- | --- | --- | --- |
| Time (µs) | 1000 | 1000 | 2000 | `D0 0F` |
| Time (µs) | 2000 | 0 | 0 | `00` |
| Time (µs) | 3003 | 3 | 6 | `06` |
| Time (µs) | 4000 | −6 | 11 | `0B` |
| Speed × 100 | 21237 (first value) | 21237 | 42474 | `EA CB 02` |
| Speed × 100 | 21241 | 4 | 8 | `08` |
| Speed × 100 | 21240 | −1 | 1 | `01` |
| Speed × 100 | 21252 | 12 | 24 | `18` |

After the first value, each sample costs one byte per column instead of eight.

### Gorilla compression: delta of delta and XOR

**Gorilla compression** comes from a 2015 paper by Facebook engineers describing Gorilla, an in-memory time series database. It packs data bit by bit rather than byte by byte.

- Timestamps are stored as deltas of deltas in buckets: a single `0` bit when the delta of delta is zero, `10` plus 7 bits for values from −63 to 64, `110` plus 9 bits, `1110` plus 12 bits, and `1111` plus 32 bits for anything larger. The authors found that about 96% of their timestamps compressed to a single bit.
- Values are 64-bit doubles. Each is XORed with the previous one. If the value hasn't changed, the XOR is zero and one `0` bit is stored. Otherwise only the meaningful bits between the leading and trailing zeros are kept, with a short header saying where they sit, or a single control bit to reuse the previous position.
- On their production data the paper reports an average of 1.37 bytes per data point, against 16 bytes for an uncompressed 64-bit timestamp and value.

XOR works best when values repeat or are whole numbers. In the demo's data, 212 and 213 differ by a single meaningful bit after XOR, but 212.37 and 212.41 differ in 43 bits, because decimal fractions have long binary expansions. For decimal sensor readings, scaled-integer deltas are usually smaller. The live test below shows both.

### Which encoding wins? Real telemetry, channel by channel

The best encoding depends on the channel. The table below uses one lap (2,601 samples) of real telemetry from a racing-simulator demo SciChart ran in 2026, anonymised, encoded with the same encoders as the live demo. Figures are bytes per value for each channel's column.

| Channel | Example values | JSON array | Raw Float64 | Delta + zig-zag varint | Gorilla-style XOR |
| --- | --- | --- | --- | --- | --- |
| Gear | 8, 8, 8, 8 | 2.00 | 8 | 1.00 | 0.14 |
| Tyre surface temperature (°C) | 57, 57, 57, 58 | 3.01 | 8 | 1.00 | 0.25 |
| Speed (km/h) | 299, 294, 290 | 3.98 | 8 | 1.00 | 0.69 |
| Brake temperature (°C) | 394, 426, 458 | 4.00 | 8 | 1.00 | 1.71 |
| Engine speed (rpm) | 10266, 10058, 9853 | 5.81 | 8 | 1.29 | 2.13 |
| Brake (%, two decimals) | 83.9, 92.71, 100 | 4.49 | 8 | 1.04 | 1.64 |
| Throttle (%, two decimals) | 32.93, 10.79, 0 | 5.23 | 8 | 1.16 | 2.09 |
| Lateral g-force (32-bit float) | −0.5049999952… | 19.32 | 8 | not exact | 8.13 |
| Lap distance (32-bit float) | 268.1181640625 | 15.03 | 8 | not exact | 2.71 |

- XOR compresses whole numbers that repeat or change slowly (gear, temperatures, speed) best, because a repeated value costs one bit and a byte-aligned varint can't go below one byte.
- Decimals (throttle and brake to two places) do better as deltas of scaled integers.
- Channels the logger recorded as 32-bit floats can't be scaled to exact whole numbers. Send them as a `Float32Array` column (4 bytes) if 32-bit precision is enough, or use XOR.
- JSON costs least on short whole numbers and most on long floats, where it spends 15 to 19 characters a value.

So a high-performance format usually picks an encoding per column, which is what columnar databases and formats such as Parquet do.

### General-purpose compression: gzip, Brotli and zstd

Web servers can compress any response with **gzip**, **Brotli** or **Zstandard (zstd)**, and browsers decode them for free. These compressors find repeated byte sequences, so they shrink JSON's repeated field names a long way. They help much less on data that is already packed, and they don't remove the cost of parsing text once it arrives. Use them on top of a compact format.

## Time series data formats compared

For most applications, use JSON. For the highest performance, keep the data in a columnar store (a columnar time series database, Arrow or Parquet), send binary columns with time series compression, and decompress them on the client into `Float64Array` buffers.

| Format | Text or binary | Layout | Schema | Numbers | Decode into typed arrays | Use it for |
| --- | --- | --- | --- | --- | --- | --- |
| JSON (array of objects) | Text | Rows | None, names in every record | Decimal text | Parse, allocate objects, copy | Small payloads, configuration, APIs |
| JSON (object of arrays) | Text | Columns | Names once | Decimal text | Parse, then copy each array | Medium payloads where JSON is required |
| CSV | Text | Rows | Header line | Decimal text | Split and parse every field | Exports and spreadsheets, not live feeds |
| MessagePack | Binary | Usually rows | None, names in every map | Fixed-size floats (9 bytes for a double) | Decode objects, then copy | A drop-in binary JSON |
| Protocol Buffers | Binary | Rows, or columns with packed repeated fields | Required (.proto) | Varint integers, 8-byte doubles | Decode messages; packed fields are close to columns | Typed APIs and gRPC services |
| FlatBuffers | Binary | Records with vectors | Required | Fixed-size | Read in place, no unpacking step | Low-latency messages and games |
| Apache Arrow (IPC stream) | Binary | Columns | In the stream | Fixed-size, aligned | Zero-copy views onto the buffers | Moving columnar data between systems and to the browser |
| Parquet | Binary | Columns in row groups | In the file | Encoded and compressed | Decode with a library | Storage, data lakes, offline analysis |
| QWP (QuestDB Wire Protocol) | Binary | Columns | Negotiated | Column blocks, delta-encoded timestamps | Query results as Arrow record batches | Ingesting into and querying QuestDB over WebSocket |
| Custom delta + varint or Gorilla | Binary | Columns | Agreed by both ends | Packed deltas | Short decode loop per column | The smallest live feeds you control end to end |

### Protobuf vs JSON

Protocol Buffers (Protobuf) is a binary, schema-based format. Field names never travel, integers become varints, and signed `sint` fields use zig-zag. A `double`, though, is always 8 bytes, so a short decimal such as 12.5 is smaller as JSON text. The layout matters more than the format. One message per sample is row order with a small header on every row. Packed repeated fields (one list per channel, the default for numeric fields in current versions) give you column order, and storing scaled integer deltas in `sint64` fields gives you most of the delta-varint saving.

### Apache Arrow vs Parquet

Both are columnar, and they're designed to work together. **Apache Arrow** is an in-memory format with a streaming wire form (IPC): its buffers are aligned and can be read in place, so a browser can wrap them in typed arrays without decoding. **Parquet** is a storage format: it encodes and compresses each column chunk, and writes its metadata after the data, so a file is written in one pass but read from the end. A common pattern is Parquet on disk or in a data lake, and Arrow on the wire.

### QuestDB and QWP

QuestDB, an open-source time series database, introduced QWP, the QuestDB Wire Protocol, in its 10.0 release. QWP moves data as binary column blocks over a WebSocket connection, and one client uses it both to write and to query. The blocks stay close to the way QuestDB stores columns on disk, repeated strings (symbols) travel once with an id, timestamps are delta-encoded, and a query can return its rows in Apache Arrow's record-batch form. QuestDB's own documentation lists separate ingress and egress variants and a version negotiated when the WebSocket opens. The older InfluxDB Line Protocol and PostgreSQL wire protocol remain supported.

## Getting binary data into the browser

On the fast path, the data is columnar from the moment it's stored. The remaining work is moving the bytes into the chart without blocking the page.

![The path from server to chart. On the server: data stored as columns in a columnar database, Arrow or Parquet, encode timestamps as deltas of deltas and values as deltas of scaled integers, pack them as zig-zag varints or Gorilla bits, and optionally compress with gzip, Brotli or zstd. Over the network: one binary WebSocket frame or HTTP response per batch. In the browser: a Web Worker decodes the bytes into one Float64Array per column, transfers the buffers to the main thread without copying, and the main thread calls appendRange once per channel](./server-to-chart-pipeline.svg)

- WebSockets carry binary frames. Set `socket.binaryType = "arraybuffer"` (the default is `"blob"`, which needs an extra asynchronous read), and each message arrives as an `ArrayBuffer`.
- For history, `fetch()` followed by `response.arrayBuffer()` returns the body as bytes. Let the server compress it with gzip, Brotli or zstd; the browser decompresses before your code sees it.
- Decode in a Web Worker when batches are large, so parsing never competes with drawing and input on the main thread.
- Post the decoded columns back with their buffers in the transfer list: `postMessage(columns, [columns.t.buffer, …])`. Transferring hands the memory over instead of copying it; the worker can no longer use those buffers afterwards.
- Append each batch with one call per channel. Batching samples into tens of milliseconds' worth keeps the number of calls, and redraws, low.

## Common mistakes when sending time series to a chart

Most slow data paths come from sending rows of text where columns of numbers would do, or from doing the decoding and appending on the main thread one point at a time.

- **Sending one JSON object per sample at high volume.** It multiplies size and parse time, and creates an object per point. Below tens of thousands of points it rarely matters; above that, send binary columns.
- **Turning rows into columns in the browser.** Parsing JSON rows and then copying them into arrays does the work twice. Send columns, so the data arrives in the shape the chart needs.
- **Appending points one at a time.** A call and a possible redraw per sample is far slower than one call per batch. Collect a batch, then append it.
- **Delta-encoding raw floating-point decimals.** Subtracting doubles such as 212.41 − 212.37 gives 0.03999… and rounding drifts over millions of samples. Scale decimals to whole numbers first, with one known scale per column.
- **Misaligned typed array views.** A `Float64Array` on a buffer at an offset that isn't a multiple of 8 throws. Pad the header, or copy with `slice()` when you can't control the layout.
- **Mixing byte orders.** Typed arrays use the machine's byte order and `DataView` defaults to big-endian. Agree on little-endian at both ends, and pass `true` as the `littleEndian` argument when you use `DataView`.
- **Losing timestamp precision.** A JavaScript number holds whole numbers exactly only up to 2^53. Nanosecond epoch timestamps (around 1.7 × 10^18) exceed that. Send microseconds, or an offset from a base time in each batch.
- **Decoding on the main thread.** Parsing a large batch on the main thread freezes zooming, panning and input while it runs. Move decoding to a Web Worker and transfer the results.
- **Downsampling on the server to save bandwidth.** Thinning to every nth point hides spikes. Send full resolution in a compact format and let the chart reduce it per pixel, or use a min-max method; see [downsampling](/learn/big-data/downsampling/).

## How to load binary time series into a chart in JavaScript, React or Angular

The demo generates a simulated car telemetry recording (speed, throttle and brake at 1,000 samples per second), encodes it in five formats, and times how long each takes to decode and draw in your browser, at up to a million samples; the decoded `Float64Array` columns go into the chart's WebAssembly memory in one call per channel. The two JSON options are the easy baseline most applications use; the three binary columnar options are the high-performance path.

Pick the number of **Samples**, choose a **Format** and press **Decode and draw** to decode that format into `Float64Array` columns and load them into the chart; the status line shows the decode time and the time until the chart is drawn. **Measure again** reruns the table: encoded size, bytes per sample, gzipped size, decode time (the faster of two runs) and whether the round trip was exact. To explore the result, zoom in time with the mouse wheel, drag to pan, double-click to see everything and hover for values.

<LiveDocSnippet maxWidth={'100%'} height={720} name="./Basic/demo" />

<LearnCta position="top" chart="million-point line chart" demo="chart-performance-load-one-million-points" docs="/2d-charts/chart-types/data-series-api/data-series-api-overview/" docsLabel="SciChart.js DataSeries documentation" />

Here is the code for the demo. The decoders and the chart are below; the data generator, the encoders and the bit-level Gorilla codec are in the full file.

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        EAutoRange,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Binary columns: an 8-byte header (sample count, column count), then each column as little-endian doubles.
    // Each column is a zero-copy view onto the received buffer.
    function decodeFloat64Columns(buffer: ArrayBuffer) {
        const [count, columns] = new Uint32Array(buffer, 0, 2);
        return Array.from({ length: columns }, (_, c) => new Float64Array(buffer, 8 + c * count * 8, count));
    }

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Always }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Value", autoRange: EAutoRange.Always }));
        const dataSeries = new XyDataSeries(wasmContext, { isSorted: true, containsNaN: false });
        sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0" }));
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );

        // Each binary WebSocket message is one batch: [times, values] as Float64 columns
        const socket = new WebSocket(getYourTelemetrySocketUrl());
        socket.binaryType = "arraybuffer";
        socket.onmessage = (event: MessageEvent<ArrayBuffer>) => {
            const [times, values] = decodeFloat64Columns(event.data);
            dataSeries.appendRange(times, values); // one call per batch, no per-point objects
        };
        sciChartSurface.addDeletable({ delete: () => socket.close() });
        return { sciChartSurface };
    };

    export const BinaryTelemetryChart = () => <SciChartReact initChart={initChart} style={{ width: "100%", height: 400 }} />;
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        EAutoRange,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // Binary columns: an 8-byte header (sample count, column count), then each column as little-endian doubles.
    // Each column is a zero-copy view onto the received buffer.
    function decodeFloat64Columns(buffer: ArrayBuffer) {
        const [count, columns] = new Uint32Array(buffer, 0, 2);
        return Array.from({ length: columns }, (_, c) => new Float64Array(buffer, 8 + c * count * 8, count));
    }

    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Always }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Value", autoRange: EAutoRange.Always }));
        const dataSeries = new XyDataSeries(wasmContext, { isSorted: true, containsNaN: false });
        sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0" }));
        sciChartSurface.chartModifiers.add(
            new CursorModifier({ showTooltip: true }),
            new MouseWheelZoomModifier(),
            new ZoomPanModifier(),
            new ZoomExtentsModifier()
        );

        // Each binary WebSocket message is one batch: [times, values] as Float64 columns
        const socket = new WebSocket(getYourTelemetrySocketUrl());
        socket.binaryType = "arraybuffer";
        socket.onmessage = (event: MessageEvent<ArrayBuffer>) => {
            const [times, values] = decodeFloat64Columns(event.data);
            dataSeries.appendRange(times, values); // one call per batch, no per-point objects
        };
        sciChartSurface.addDeletable({ delete: () => socket.close() });
        return { sciChartSurface };
    };

    @Component({
        selector: "app-binary-telemetry-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `<scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>`
    })
    export class BinaryTelemetryChartComponent {
        initChart = initChart;
    }
    ```
</CodeSnippetBlock>

Key points:

- `XyDataSeries.appendRange(xValues, yValues)` takes a `NumberArray`, which is `number[] | Float64Array`, so a decoded column goes in as it is. The values are copied into SciChart's WebAssembly memory, so the received buffer can be reused or released afterwards.
- `isSorted: true` and `containsNaN: false` tell the data series that times only increase and no values are missing, so it can use its fastest paths for zooming, ranging and drawing.
- For a live feed, set `fifoCapacity` on the data series to keep a fixed window of the newest samples, and append each decoded batch as it arrives.
- `sciChartSurface.nextStateRender()` returns a promise that resolves when the next frame has been drawn. The demo uses it to time "decode → chart drawn".

### How SciChart's own demos move data

The same approach runs in SciChart's own applications.

- SciChart's trading library, [SciTrader.js](https://www.scichart.com/javascript-stock-charts/), receives market data from its data server in a compact binary format (the details below describe the current design and may change). Each field travels as its own column, each value as a delta against a close predictor (an open against the previous close, for example), small numbers as zig-zag varints, and decimal prices as whole numbers with one shared decimal exponent per column in each batch. The browser decodes each batch into arrays for the charts.
- A [motorsport telemetry](/learn/applications/motorsport-telemetry/) dashboard demo receives its live stream as JSON, which is fine at a racing simulator's data rate. A Web Worker converts each message once into one `Float64Array` column per channel, and the chart gets zero-copy `subarray` views of the newest samples straight through `appendRange`. Saved laps are exported as Parquet files, which keeps them columnar on disk.

**See it in the demo app:** [JavaScript million-point line chart](https://www.scichart.com/demo/javascript/chart-performance-load-one-million-points) · [React million-point line chart](https://www.scichart.com/demo/react/chart-performance-load-one-million-points) · [Angular million-point line chart](https://www.scichart.com/demo/angular/chart-performance-load-one-million-points). Related techniques: the [React real-time chart performance](https://www.scichart.com/demo/react/chart-realtime-performance-demo), [React 500 series × 500 points](https://www.scichart.com/demo/react/load-500-series-x-500-points-performance-demo) and [React real-time zoom and pan](https://www.scichart.com/demo/react/zoom-pan-realtime-javascript-chart) examples.

**Go deeper:** [SciChart.js DataSeries documentation](/2d-charts/chart-types/data-series-api/data-series-api-overview/), [real-time updates](/2d-charts/chart-types/data-series-api/realtime-updates/), [performance tips, including Float64Array buffers](/2d-charts/performance-tips/performance-tips-and-tricks/), and the learning center guides to [big data visualization](/learn/big-data/big-data-visualization/), [downsampling](/learn/big-data/downsampling/) and [telemetry](/learn/applications/telemetry/). For the industries, see SciChart for [aerospace and defence](https://www.scichart.com/why-scichart-aerospace-defence/), [design, emulation and test](https://www.scichart.com/design-emulation-test/) and [HMI and SCADA](https://www.scichart.com/scada-big-data/).

## Frequently asked questions

### What is the best data format for time series charts?

For most charts, with thousands to tens of thousands of points, JSON is fine. For the highest performance, keep the data columnar from end to end: store it in a columnar time series database, Arrow or Parquet, send binary columns compressed with delta-of-delta timestamps and varint or Gorilla-style values, and decompress them on the client straight into one Float64Array per column for the chart.

### Is Protobuf faster than JSON?

Usually, because Protocol Buffers is binary and schema-based: field names aren't repeated and numbers aren't parsed from text. The size gain depends on the data. Integers shrink as varints, but a double always takes 8 bytes, so a short decimal such as 12.5 can be smaller as JSON text. For time series, put the values in packed repeated fields, one per channel, rather than one message per sample.

### What is the difference between Apache Arrow and Parquet?

Both are columnar, but they do different jobs. Apache Arrow is an in-memory and streaming format: its buffers can be read in place without decoding, so it suits moving data between processes or to a browser. Parquet is a compressed storage file format with its metadata after the data, which suits files on disk and in data lakes. A common pattern is to store in Parquet and serve in Arrow.

### What is delta encoding?

Delta encoding stores the difference between each value and the one before it instead of the value itself. Neighbouring samples of a time series are usually close, so the differences are small numbers that need fewer bytes. Applying it twice (delta of delta) turns regular timestamps into a run of zeros. The receiver adds the differences back up to restore the original values exactly.

### What is Gorilla compression?

Gorilla compression is the time series encoding described by Facebook engineers in 2015 for their in-memory Gorilla database. It stores timestamps as deltas of deltas in variable-width bit buckets, so a regular timestamp costs one bit, and stores each floating-point value as the XOR with the previous one, keeping only the bits that changed. The paper reports an average of 1.37 bytes per data point.

### How do I load binary data into a JavaScript chart?

Receive the data as an ArrayBuffer, for example from a WebSocket with binaryType set to arraybuffer or from fetch with arrayBuffer(). Decode it into one Float64Array per column, ideally in a Web Worker, then pass the arrays to the chart in one call per channel. With SciChart.js, XyDataSeries.appendRange accepts Float64Array x and y values directly, with no per-point objects.

## Sources

- Pelkonen, T., Franklin, S., Teller, J., Cavallaro, P., Huang, Q., Meza, J. and Veeraraghavan, K. (2015), [Gorilla: A Fast, Scalable, In-Memory Time Series Database](https://www.vldb.org/pvldb/vol8/p1816-teller.pdf). *Proceedings of the VLDB Endowment*, 8(12), 1816–1827. Delta-of-delta timestamps, XOR value compression, 96% of timestamps in one bit, 1.37 bytes per point.
- Google, [Protocol Buffers: Encoding](https://protobuf.dev/programming-guides/encoding/). Varints, ZigZag encoding of signed integers, 8-byte doubles and packed repeated fields.
- Apache Arrow, [Arrow Columnar Format](https://arrow.apache.org/docs/format/Columnar.html). Buffer alignment and padding, zero-copy access, and the IPC streaming and file formats.
- Apache Parquet, [File Format](https://parquet.apache.org/docs/file-format/). Row groups, column chunks and metadata written after the data.
- QuestDB, [Wire protocols overview](https://questdb.com/docs/connect/wire-protocols/overview/) and [QuestDB 10.0 release](https://questdb.com/blog/questdb-10-release/). QWP ingress and egress over WebSocket, column blocks and Arrow record batches.
- MDN Web Docs, [Float64Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array), [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [WebSocket.binaryType](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/binaryType) and [Transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects).
- IETF, [RFC 8259: The JSON Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259), [RFC 1952: GZIP](https://www.rfc-editor.org/rfc/rfc1952), [RFC 7932: Brotli](https://www.rfc-editor.org/rfc/rfc7932) and [RFC 8878: Zstandard](https://www.rfc-editor.org/rfc/rfc8878). [MessagePack specification](https://github.com/msgpack/msgpack/blob/master/spec.md) and [FlatBuffers](https://flatbuffers.dev/).

<LearnCta position="bottom" chart="million-point line chart" demo="chart-performance-load-one-million-points" docs="/2d-charts/chart-types/data-series-api/data-series-api-overview/" docsLabel="SciChart.js DataSeries documentation" />
