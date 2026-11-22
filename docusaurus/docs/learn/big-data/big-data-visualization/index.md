---
sidebar_position: 10
sidebar_label: Big Data Visualization
title: "Big Data Visualization: What It Is & How to Visualize Large Datasets"
description: "What big data visualization is, when a dataset is too big for a chart, SVG vs Canvas vs WebGL, and the techniques for charting millions of points. With live tests you can run."
keywords:
    [
        "big data visualization",
        "visualize large datasets",
        "large dataset visualization",
        "svg vs canvas",
        "canvas vs svg",
        "webgl vs canvas",
        "d3 performance",
        "how to visualize big data"
    ]
image: /img/learn/big-data-visualization-og.png
related: [downsampling, strip-chart, scatter-plot, heatmap]
---

<head>
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is big data visualization?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Big data visualization is turning datasets too large to read as tables, such as millions of sensor readings or years of tick-by-tick prices, into charts people can explore. It has two halves: reducing what has to be drawn (aggregation and downsampling) and drawing it with a renderer that can redraw the chart each time people zoom or pan." }
                },
                {
                    "@type": "Question",
                    "name": "How do you visualize big data?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Start from the question, then pick a chart that summarises well, such as a line chart for time series or a heatmap for dense scatter data. Reduce the data to what the screen can show, by downsampling, binning or aggregating, and keep the full detail available on zoom. Draw with a renderer that suits the size: SVG for small charts, Canvas for medium ones, WebGL or WebGPU for millions of points or real-time updates." }
                },
                {
                    "@type": "Question",
                    "name": "Is Canvas faster than SVG?",
                    "acceptedAnswer": { "@type": "Answer", "text": "For many points, usually yes. SVG creates an element in the page for every shape, and the browser has to style, lay out and paint each one, so the cost grows with the number of points. Canvas paints pixels into a single bitmap with no element per shape. For a few hundred shapes the difference rarely matters, and SVG is easier to style, make accessible and make interactive." }
                },
                {
                    "@type": "Question",
                    "name": "Is WebGL faster than Canvas?",
                    "acceptedAnswer": { "@type": "Answer", "text": "For large datasets, yes. With the Canvas 2D API, JavaScript issues drawing commands one shape at a time on the CPU. WebGL and its successor WebGPU copy the data to the graphics card once and draw all the points in parallel with shaders, so the work per point on the CPU is much smaller. WebGL code is low level, though, so most people use a chart library built on it." }
                },
                {
                    "@type": "Question",
                    "name": "Is D3.js good for large datasets?",
                    "acceptedAnswer": { "@type": "Answer", "text": "D3.js is the most flexible way to build a custom chart on the web, but it leaves rendering to you. When a D3 chart draws with SVG, every point is an element in the page, which gets slow as points reach the tens of thousands or update in real time. D3 can also draw to Canvas, which helps, but you then handle hit-testing and redraws yourself. For millions of points, a GPU-based chart library is the usual choice." }
                },
                {
                    "@type": "Question",
                    "name": "How do I plot millions of points in JavaScript?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Use a chart library that draws with WebGL or WebGPU, such as SciChart.js. Store the values in typed arrays such as Float64Array, add them in one batch with appendRange rather than point by point, and tell the chart if the data is sorted in x. SciChart.js resamples the data to the screen's pixels automatically, and the demo on this page shows how long each added million points takes to draw on your device. React apps use the same code through scichart-react, and Angular apps through scichart-angular." }
                }
            ]
        })}
    </script>
</head>

# Big Data Visualization

## What is big data visualization?

**Big data visualization** (also called large dataset visualization) is turning datasets too large to read as tables, from millions of sensor readings to years of tick-by-tick prices, into charts that people can explore. It combines reducing what has to be drawn, by aggregating or downsampling, with a renderer that can redraw the chart each time people zoom or pan.

![A dark navy line chart with five coloured signals, each a band of noisy readings, stacked one above the other across a million samples. A counter at the top reads 1,000,000 points, next to an Add 1 million points button](/img/learn/big-data-visualization-og.png)

*One million points in five signals, drawn in a browser. [Try the interactive version](#how-to-create-a-big-data-chart-in-javascript-react-or-angular): add millions more, then zoom and pan.*

:::tip Key takeaways
- For a chart, data is "big" when it has more points than the screen has pixels to show them, or when it changes faster than the chart can redraw.
- A chart can't show every point. A 1,920-pixel-wide chart of 10 million points has about 5,200 points per pixel column, so the work is choosing what to draw.
- SVG draws each point as an element in the page; Canvas paints a bitmap with the CPU; WebGL and WebGPU draw with the graphics card. Each step up handles more points and takes more work to program.
- Downsampling, aggregation, level of detail and progressive loading cut what has to be drawn without hiding peaks and outliers.
- Measure on your own data and devices. The [live test below](#try-it-svg-vs-webgl-in-your-browser) times SVG and WebGL in your browser.
:::

## What counts as big data for a chart?

In databases, "big data" means data too large or fast for one machine to store and process. For a chart, the bar is much lower. What matters is how many points you ask the browser to draw, and how often.

Two numbers decide it:

- **Points in the dataset:** everything you've loaded. This sets memory use and how long it takes to process the data. A pair of 64-bit numbers (one x, one y) takes 16 bytes, so 10 million points take about 160 MB before any copies.
- **Points on the screen:** what the chart has to draw in the current view. This sets how long each frame takes, and it's limited by pixels. A chart 1,920 pixels wide can only show 1,920 distinct x positions, however many points fall inside them.

![Diagram in three steps. First, a dense signal across a chart, with one pixel-wide column highlighted in orange. Second, that column zoomed in: thousands of points crowd into it, and only the highest and the lowest are marked. Third, what the screen shows: a single vertical stroke from the lowest to the highest point. Title: 10 million points on a 1,920-pixel-wide chart, about 5,200 per pixel column](./points-per-pixel.svg)

Past a few points per pixel, extra points add work but not detail. A line chart with 5,200 points in one pixel column draws a single vertical stroke from the lowest to the highest of them. Keep those two values (and the column's first and last) and you get the same picture from a fraction of the points, which is what downsampling does.

Datasets reach millions of points quickly. Some worked examples, simple arithmetic rather than benchmarks:

| Source | Rate | Points |
| --- | --- | --- |
| Vibration sensor | 1,000 samples a second for 24 hours | 86.4 million |
| ECG, 12 leads | 500 samples a second per lead for 1 hour | 21.6 million |
| One stock's price, 1-second bars | One bar a second for a 6.5-hour trading day, for a year (252 days) | 5.9 million |
| Server metrics | 200 hosts, one reading every 10 seconds for 30 days | 51.8 million |

## Types of charts for big data

Some chart types summarise large datasets well; others turn into an unreadable blob. The right one depends on the shape of the data:

| Data | Chart that scales | Why |
| --- | --- | --- |
| Values over time (signals, prices, metrics) | [Line chart](/learn/chart-types/cartesian/line-chart/) | A line shows the envelope of millions of samples, and downsampling keeps every peak |
| Many measurements of two variables | [Scatter plot](/learn/chart-types/cartesian/scatter-plot/) with small, transparent markers, or a [density plot](/learn/chart-types/cartesian/density-plot/) | Transparency and density show where points pile up instead of a solid block |
| A value on a grid (time × frequency, x × y) | [Heatmap](/learn/chart-types/cartesian/heatmap/) or [spectrogram](/learn/chart-types/cartesian/spectrogram/) | Colour encodes millions of cells in a fixed number of pixels |
| A value over two dimensions, as a shape | [3D surface plot](/learn/chart-types/3d/3d-surface-plot/) | One mesh shows a whole grid of readings |
| Prices at high frequency | [Candlestick chart](/learn/chart-types/cartesian/candlestick-chart/) | Each candle aggregates many trades into open, high, low and close |

Charts with one shape per category, such as pie charts and bar charts, don't scale to big data: aggregate first, then chart the totals.

## SVG vs Canvas vs WebGL: how browsers draw charts

Every web chart is drawn with one of three browser technologies. The choice matters little for a chart with 50 bars, and decides everything for a chart with 5 million points.

![Diagram of three rendering pipelines. SVG: data becomes one element per point, then the browser styles, lays out and paints each element on the CPU before the screen. Canvas: JavaScript issues a draw call per point on the CPU into a bitmap, then to the screen. WebGL or WebGPU: the data is copied to a GPU buffer and shaders draw the points in parallel on the graphics card. A meter on the right shows CPU work per point: high for SVG, medium for Canvas, low for WebGL or WebGPU](./rendering-pipelines.svg)

- **SVG (Scalable Vector Graphics)** describes a chart as shapes: each point, line and label is an element in the page's document (the DOM). The browser keeps every element, works out its style and position, and paints it. That makes SVG easy to style with CSS, crisp at any zoom, and readable by screen readers and search engines. It also means the cost grows with every point added.
- **Canvas** (the Canvas 2D API) gives you a bitmap and drawing commands. JavaScript paints the points, and the browser keeps only pixels, not shapes. There's no per-point element, so it handles far more points than SVG, but JavaScript still issues the drawing commands one shape at a time, and you have to work out which point is under the mouse yourself.
- **WebGL and WebGPU** give the page access to the graphics card (GPU). The data is copied into GPU memory, and small programs called shaders draw all the points in parallel. WebGPU is WebGL's successor, built around modern GPU interfaces, with less overhead per draw and support for general-purpose computing on the GPU. Writing WebGL or WebGPU by hand is hard, so most people use a library built on them.

### Where does D3.js fit?

D3.js is a toolkit for building custom charts rather than a chart library: you compose scales, shapes and data joins yourself, and render with web standards such as SVG or Canvas. That makes it very flexible. Its data joins bind each data point to an element in the page, so a D3 chart drawn with SVG has an element per mark and inherits SVG's costs. D3 can also draw to Canvas, which raises the limit, but you then write the drawing, hit-testing and redraws yourself. D3 has no GPU renderer of its own.

| | SVG | Canvas 2D | WebGL / WebGPU |
| --- | --- | --- | --- |
| How it draws | One page element per shape | JavaScript paints a bitmap | Shaders on the GPU |
| What grows with each point | Elements to style, lay out and paint | Draw commands on the CPU | Data copied to GPU memory |
| Styling with CSS | Yes, per element | No, set in code | No, set in code |
| Accessibility | Elements can have titles, roles and labels | A bitmap: add accessible text separately | A bitmap: add accessible text separately |
| Mouse interaction | Built in: events on each element | Write your own hit-testing | Write your own, or use a library's |
| Text quality | Crisp, selectable text | Painted text, can blur unless scaled for the screen | Painted text; libraries often overlay HTML text |
| Effort to build a chart by hand | Low | Moderate | High, so usually a library |
| Typical fit | Small to medium charts, infographics, highly custom designs | Medium datasets, simple animation | Millions of points, real-time data, many charts on one page, 3D |

The table is about each technology, not every product built on it: a well-built SVG chart can beat a poorly built WebGL one. The [Sources](#sources) list the specifications behind it.

## Try it: SVG vs WebGL in your browser

Claims about speed are easy to make, so test it. The panels below draw the same scatter points twice: on the left with plain SVG (one `<circle>` element per point, no library), and on the right with WebGL or WebGPU. Pick a size, and each panel reports how long it took to draw in your browser, on your device. Then scroll and drag on the right-hand chart to zoom and pan.

<LiveDocSnippet maxWidth={'100%'} height={480} name="./SvgVsWebgl/demo" />

What to look for:

- At 1,000 points both are quick. For small charts, SVG's convenience usually wins.
- At 10,000 and 100,000 points the SVG time grows with the point count, because every circle is a new element the browser must style, lay out and paint. The page may freeze while it works.
- At 1,000,000 points SVG has a million elements to create, and the page may freeze for several seconds; on a phone or a low-memory device the tab may even crash. The WebGL panel still draws quickly, and still zooms and pans.
- Times vary between devices and browsers, and the first run includes some one-off setup. Run each size twice.

For comparison, here are the times measured with this test on 18 November 2026, with SciChart.js 6.0.15, on two very different machines:

- Mac: MacBook Pro laptop, Apple M5.
- PC: Windows desktop, AMD Ryzen 7 7800X3D, AMD Radeon RX 7900 XTX, 32 GB RAM.

| Points | SVG, Mac | SVG, PC | WebGL / WebGPU, Mac | WebGL / WebGPU, PC |
|---|---|---|---|---|
| 1,000 | 6 ms | 9 ms | 4 ms | 3 ms |
| 10,000 | 51 ms | 57 ms | 1 ms | 3 ms |
| 100,000 | 162 ms | 356 ms | 3 ms | 11 ms |
| 1,000,000 | 1,434 ms | 3,495 ms | 8 ms | 13 ms |

The two timers stop at different points. The SVG time runs from creating the first `<circle>` element until the browser has styled, laid out and painted the next frame. The SciChart.js time runs from handing over the points until the chart fires its `rendered` event, once it has drawn the frame; the browser shows that frame on its next screen refresh. SciChart.js uses WebGPU where the browser supports it and WebGL otherwise, so the column covers both. Before each timed draw the test clears both panels and waits for the browser to go idle, so one run's clean-up isn't counted in the next.

At 1,000 points SVG and WebGL are close on both machines. From 10,000 points the SVG time climbs with every point added, and from 100,000 points it differs by more than two times between the machines. At a million points SVG takes 1.4 to 3.5 seconds, while the WebGL / WebGPU time stays under 16 ms on both. A frame at 60 frames per second has about 16 ms, so the SVG times of 51 ms and more mean visible stutter or a frozen page. Your numbers will differ on other hardware and browsers; the gap between SVG and WebGL is what to look for.

:::info A fair note
An SVG line chart can draw all its points as a single `<path>` element, which is much lighter than one circle per point. The path still has to be rebuilt and repainted whenever the data or the zoom changes, so the same limits appear with real-time data.
:::

## Techniques for visualising large datasets

The renderer sets how many points you can draw. These techniques cut how many you need to. Most big data charts use several together.

| Technique | What it does | Good for | Watch out for |
| --- | --- | --- | --- |
| Downsampling (resampling) | Keeps a few representative points per pixel column, such as the minimum and maximum | Long time series, signals | Simple decimation (every nth point) drops peaks; use a method that keeps them. See [downsampling](/learn/big-data/downsampling/) |
| Aggregation and binning | Replaces raw points with summaries: averages per minute, counts per grid cell, candles per period | Dashboards, scatter data, prices | Averages hide spikes; show the minimum and maximum too |
| Level of detail | Shows a coarse summary zoomed out and loads more detail as you zoom in | Very long histories, maps | Needs pre-computed summaries at several zoom levels |
| Progressive loading | Draws a first view quickly, then fills in or streams the rest | Slow networks, huge files | Show that the chart is still loading |
| Background processing | Parses and reduces data in a web worker, off the page's main thread | Parsing large files, heavy calculations | Transfer data as typed arrays (such as `Float64Array`) to avoid copying; see [time series data formats](/learn/big-data/time-series-data-formats/) |
| Server-side reduction | Queries return data already aggregated or downsampled for the current view | Data that lives in a database or data warehouse | A round trip to the server on every zoom |

Downsampling is the one that matters most for line charts. Algorithms such as min-max (keep each pixel column's lowest and highest point) and LTTB (Largest-Triangle-Three-Buckets, which picks the points that best keep the line's shape) reduce millions of points to a few thousand that look the same. The [downsampling guide](/learn/big-data/downsampling/) compares them in detail.

Use typed arrays (`Float64Array`, `Float32Array`) rather than arrays of objects such as `{ x, y }`. They take far less memory, can be handed to a worker or the GPU without conversion, and avoid pauses for garbage collection.

## How to choose a rendering approach

Start from the number of points on screen, how often they change, and what else the chart needs to do:

| Your situation | Good choice | Why |
| --- | --- | --- |
| A few hundred shapes, static, needs CSS styling or must be fully accessible | SVG | Simplest to build, style and make accessible |
| A highly custom, one-off visual design | SVG with a toolkit such as D3.js | Full control over every mark |
| Tens of thousands of points, simple interaction | Canvas | No per-point elements; still simple to code |
| Hundreds of thousands to millions of points, or zooming through long histories | WebGL / WebGPU chart library | GPU drawing plus built-in downsampling |
| Data streaming in many times a second | WebGL / WebGPU chart library | Redraws the whole chart on the GPU each frame, with no element per point |
| Many charts on one page (dashboards, multi-channel monitors) | WebGL / WebGPU chart library that shares the GPU between charts | Browsers limit how many WebGL contexts a page can open |
| Data too large for the browser's memory | Any renderer, after server-side reduction | Send only what the current view needs |

If you're not sure, prototype with your real data size on the slowest device your users have. The difference between approaches is small at 1,000 points and decisive at 1,000,000.

## Common mistakes in big data visualization

Most slow or misleading big data charts draw every point as it comes, or reduce the data in a way that hides its peaks.

- **Sending every point to the chart and hoping.** Without downsampling or a GPU renderer, the page freezes. Decide how many points the screen can show and design for that.
- **Decimating instead of downsampling.** Keeping every 100th point is fast but can drop the one spike you needed to see. Use min-max or LTTB, which keep peaks.
- **Averaging away outliers.** A per-minute average of a signal that spikes for one second shows nothing. Plot the minimum and maximum, or a band, alongside the average.
- **Overplotting.** A million opaque markers in a scatter plot make a solid block. Use small, semi-transparent markers, or switch to a density plot or heatmap.
- **Updating point by point.** Appending one value at a time triggers a recalculation or redraw each time. Batch updates and append arrays in one call.
- **Testing only on a fast development machine.** Laptops on battery, older phones and remote desktops can be many times slower. Test on the devices your users have.
- **One WebGL context per chart on a dashboard.** Browsers cap the number of WebGL contexts per page (16 in Chrome, Edge and Safari, and 8 in Chrome on Android, according to [our performance tips](/2d-charts/performance-tips/performance-tips-and-tricks/)), so a dashboard with dozens of charts can lose some of them. Use a library that shares one context across charts.

## How to create a big data chart in JavaScript, React or Angular

The demo starts with one million points in five signals and adds another million, up to ten, each time you click, showing how long each million took to draw on your device. It has no downsampling code of its own: SciChart.js resamples the data to the screen's pixels itself. Click **Add 1 million points** to keep adding and watch the counter and the time for each million, then zoom with the mouse wheel, drag to pan, double-click to zoom back out, and hover to read values.

<LiveDocSnippet maxWidth={'100%'} name="./Basic/demo" />

<LearnCta position="top" chart="big data chart" demo="chart-performance-load-one-million-points" demoLabel="1 million point chart" docs="/2d-charts/performance-tips/performance-tips-and-tricks/" docsLabel="SciChart.js performance tips" />

Here is the code for this chart:

<CodeSnippetBlock labels={["JavaScript", "React", "Angular"]}>
    ```ts showLineNumbers file=./Basic/demo.ts start=#region_A_start end=#region_A_end
    ```

    ```tsx
    import { useRef } from "react";
    import { SciChartReact } from "scichart-react";
    import {
        SciChartSurface,
        NumericAxis,
        XyDataSeries,
        FastLineRenderableSeries,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    // initChart builds the chart; SciChartReact creates it, sizes it and cleans it up
    const initChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            theme: new SciChartJsNavyTheme()
        });
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

        // The flags tell the chart what the data looks like, so it can skip checking
        const dataSeries = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });
        const { xValues, yValues } = getYourLargeDataset(); // e.g. two Float64Arrays with millions of values
        dataSeries.appendRange(xValues, yValues); // one call for the whole array, not one per point

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0", strokeThickness: 1 })
        );
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
        return { sciChartSurface, dataSeries };
    };

    export const BigDataChart = () => {
        const chart = useRef<{ sciChartSurface: SciChartSurface; dataSeries: XyDataSeries }>();

        // Append more points in one batch, then fit the chart to the new data
        const addMore = () => {
            if (!chart.current) return;
            const { xValues, yValues } = getYourNextPoints();
            chart.current.dataSeries.appendRange(xValues, yValues);
            chart.current.sciChartSurface.zoomExtents();
        };

        return (
            <>
                <button onClick={addMore}>Add more points</button>
                <SciChartReact
                    initChart={initChart}
                    onInit={(result) => (chart.current = result)}
                    style={{ width: "100%", height: 400 }}
                />
            </>
        );
    };
    ```

    ```ts
    import { Component } from "@angular/core";
    import { ScichartAngularComponent } from "scichart-angular";
    import {
        SciChartSurface,
        NumericAxis,
        XyDataSeries,
        FastLineRenderableSeries,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } from "scichart";

    @Component({
        selector: "app-big-data-chart",
        standalone: true,
        imports: [ScichartAngularComponent],
        template: `
            <button (click)="addMore()">Add more points</button>
            <scichart-angular [initChart]="initChart" style="display: block; width: 100%; height: 400px"></scichart-angular>
        `
    })
    export class BigDataChartComponent {
        private sciChartSurface?: SciChartSurface;
        private dataSeries?: XyDataSeries;

        // initChart builds the chart; scichart-angular creates it, sizes it and cleans it up
        initChart = async (rootElement: string | HTMLDivElement) => {
            const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
                theme: new SciChartJsNavyTheme()
            });
            sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

            // The flags tell the chart what the data looks like, so it can skip checking
            const dataSeries = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });
            const { xValues, yValues } = getYourLargeDataset(); // e.g. two Float64Arrays with millions of values
            dataSeries.appendRange(xValues, yValues); // one call for the whole array, not one per point

            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#50C7E0", strokeThickness: 1 })
            );
            sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
            this.sciChartSurface = sciChartSurface;
            this.dataSeries = dataSeries;
            return { sciChartSurface };
        };

        // Append more points in one batch, then fit the chart to the new data
        addMore() {
            if (!this.sciChartSurface || !this.dataSeries) return;
            const { xValues, yValues } = getYourNextPoints();
            this.dataSeries.appendRange(xValues, yValues);
            this.sciChartSurface.zoomExtents();
        }
    }
    ```
</CodeSnippetBlock>

Key points:

- Batch your data: `appendRange` adds a whole array in one call. Pass typed arrays (`Float64Array`) and tell the data series what it can assume with `dataIsSortedInX`, `dataEvenlySpacedInX` and `containsNaN`, so it skips checking millions of values.
- Resampling is on by default. SciChart.js reduces each series to what the pixels can show, keeping peaks and troughs, and recalculates as you zoom, so zooming in reveals the full detail. See [DataSeries resampling](/2d-charts/chart-types/data-series-api/resampling/) for `resamplingMode` and `resamplingPrecision`.
- From v6, SciChart.js draws with WebGPU where the browser supports it and falls back to WebGL 2 elsewhere, with no code change. See [WebGPU and WebGL renderers](/2d-charts/surface/webgpu-and-webgl-renderers/).
- For many charts on a page, `SciChartSurface.create()` shares one GPU context across all charts, so a dashboard isn't capped by the browser's context limit; `SciChartSurface.createSingle()` gives each chart its own, which can draw faster for a few large charts. For hundreds of millions of points, the optional [64-bit WebAssembly build](/2d-charts/surface/larger-datasets-with-wasm64/) raises the memory ceiling.

**See it in the demo app:** [JavaScript 1 million point chart](https://www.scichart.com/demo/javascript/chart-performance-load-one-million-points) · [React 1 million point chart](https://www.scichart.com/demo/react/chart-performance-load-one-million-points) · [Angular 1 million point chart](https://www.scichart.com/demo/angular/chart-performance-load-one-million-points)

**Go deeper:** [SciChart.js performance tips and tricks](/2d-charts/performance-tips/performance-tips-and-tricks/), and [Performance Comparison of JavaScript Chart Libraries](https://www.scichart.com/blog/chart-bench-compare-javascript-chart-libraries/) for measured benchmarks from 1,000 to 10 million points.

Further reading on the SciChart blog: [How to Visualize Millions of Data Points Efficiently](https://www.scichart.com/blog/how-to-visualize-millions-of-data-points-efficiently/) (aggregation techniques, client vs server, benchmarking) and [Which Rendering Engine Should You Use for React Charts?](https://www.scichart.com/blog/how-does-react-rendering-work/) (SVG, Canvas and WebGL in a React app).

## Frequently asked questions

### What is big data visualization?

Big data visualization is turning datasets too large to read as tables, such as millions of sensor readings or years of tick-by-tick prices, into charts people can explore. It has two halves: reducing what has to be drawn (aggregation and downsampling) and drawing it with a renderer that can redraw the chart each time people zoom or pan.

### How do you visualize big data?

Start from the question, then pick a chart that summarises well, such as a line chart for time series or a heatmap for dense scatter data. Reduce the data to what the screen can show, by downsampling, binning or aggregating, and keep the full detail available on zoom. Draw with a renderer that suits the size: SVG for small charts, Canvas for medium ones, WebGL or WebGPU for millions of points or real-time updates.

### Is Canvas faster than SVG?

For many points, usually yes. SVG creates an element in the page for every shape, and the browser has to style, lay out and paint each one, so the cost grows with the number of points. Canvas paints pixels into a single bitmap with no element per shape. For a few hundred shapes the difference rarely matters, and SVG is easier to style, make accessible and make interactive.

### Is WebGL faster than Canvas?

For large datasets, yes. With the Canvas 2D API, JavaScript issues drawing commands one shape at a time on the CPU. WebGL and its successor WebGPU copy the data to the graphics card once and draw all the points in parallel with shaders, so the work per point on the CPU is much smaller. WebGL code is low level, though, so most people use a chart library built on it.

### Is D3.js good for large datasets?

D3.js is the most flexible way to build a custom chart on the web, but it leaves rendering to you. When a D3 chart draws with SVG, every point is an element in the page, which gets slow as points reach the tens of thousands or update in real time. D3 can also draw to Canvas, which helps, but you then handle hit-testing and redraws yourself. For millions of points, a GPU-based chart library is the usual choice.

### How do I plot millions of points in JavaScript?

Use a chart library that draws with WebGL or WebGPU, such as SciChart.js. Store the values in typed arrays such as `Float64Array`, add them in one batch with `appendRange` rather than point by point, and tell the chart if the data is sorted in x. SciChart.js resamples the data to the screen's pixels automatically, and the demo on this page shows how long each added million points takes to draw on your device. React apps use the same code through `scichart-react`, and Angular apps through `scichart-angular`.

## Sources

- D3.js, [What is D3?](https://d3js.org/what-is-d3). D3 is a low-level toolbox used directly with web standards such as SVG and Canvas, with no chart abstraction of its own.
- MDN Web Docs, [SVG: Scalable Vector Graphics](https://developer.mozilla.org/en-US/docs/Web/SVG). SVG images are XML elements in the document, which can be styled, scripted and indexed.
- MDN Web Docs, [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). A canvas is a bitmap that keeps no information about the shapes drawn, and its content isn't exposed to accessibility tools.
- MDN Web Docs, [WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API). WebGPU is the successor to WebGL, with support for general-purpose GPU computation.
- MDN Web Docs, [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API). Running scripts in background threads, off the page's main thread.
- Steinarsson, S. (2013), [Downsampling Time Series for Visual Representation](https://hdl.handle.net/1946/15343). MSc thesis, University of Iceland: the Largest-Triangle-Three-Buckets (LTTB) algorithm.

<LearnCta position="bottom" chart="big data chart" demo="chart-performance-load-one-million-points" demoLabel="1 million point chart" docs="/2d-charts/performance-tips/performance-tips-and-tricks/" docsLabel="SciChart.js performance tips" />
