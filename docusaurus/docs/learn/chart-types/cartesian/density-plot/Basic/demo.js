import * as SciChart from "scichart";

// Seeded random numbers, so the chart looks the same every time it loads
function createRandom(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Example data: 200,000 simulated page loads for each of five connection types.
// Each has two peaks: pages served from a cache (fast) and pages that weren't (slower).
// These are illustrative numbers, not real measurements.
function getPageLoadData() {
    const random = createRandom(2026);
    const normal = (mean, sd) => {
        const u = 1 - random();
        const v = random();
        return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    const connections = [
        // name, share served from cache, cached mean and spread, uncached mean and spread (seconds)
        { name: "Fibre", cached: 0.65, fast: [0.6, 0.15], slow: [1.3, 0.3] },
        { name: "Cable", cached: 0.6, fast: [0.8, 0.2], slow: [1.8, 0.4] },
        { name: "DSL", cached: 0.6, fast: [1.1, 0.25], slow: [2.6, 0.6] },
        { name: "4G", cached: 0.55, fast: [1.4, 0.35], slow: [3.2, 0.8] },
        { name: "3G", cached: 0.5, fast: [2.4, 0.6], slow: [5.0, 1.2] }
    ];
    const samplesPerGroup = 200000;
    return connections.map((connection) => {
        const values = new Float64Array(samplesPerGroup);
        for (let i = 0; i < samplesPerGroup; i++) {
            const [mean, sd] = random() < connection.cached ? connection.fast : connection.slow;
            let value = normal(mean, sd);
            while (value < 0.1) value = normal(mean, sd); // a page can't load in less than 0.1 s
            values[i] = value;
        }
        return { name: connection.name, values };
    });
}

async function densityPlot(divElementId) {
    // #region_A_start
    // Create a JavaScript density plot (ridgeline) with SciChart.js: one smooth curve per group
    const {
        SciChartSurface,
        NumericAxis,
        FastMountainRenderableSeries,
        XyDataSeries,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EXyDirection,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        SweepAnimation
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Kernel density estimate on an evenly spaced grid of x values.
    // Fast for large data: count the values into a fine grid first, then spread each
    // grid count with a Gaussian (bell-shaped) kernel, instead of looping over every value
    // for every grid point.
    function kernelDensity(values, xMin, xMax, gridSize) {
        const n = values.length;
        const step = (xMax - xMin) / (gridSize - 1);

        // Bandwidth from Silverman's rule of thumb: 0.9 × min(SD, IQR / 1.34) × n^(-1/5)
        let sum = 0;
        let sumOfSquares = 0;
        for (let i = 0; i < n; i++) {
            sum += values[i];
            sumOfSquares += values[i] * values[i];
        }
        const mean = sum / n;
        const sd = Math.sqrt(Math.max(sumOfSquares / n - mean * mean, 0));
        const sorted = Float64Array.from(values).sort();
        const iqr = sorted[Math.floor(n * 0.75)] - sorted[Math.floor(n * 0.25)];
        const bandwidth = 0.9 * Math.min(sd, iqr / 1.34) * Math.pow(n, -0.2);

        // 1. Share each value between its two nearest grid points
        const counts = new Float64Array(gridSize);
        for (let i = 0; i < n; i++) {
            const position = (values[i] - xMin) / step;
            const left = Math.floor(position);
            if (left < 0 || left >= gridSize - 1) continue;
            const fraction = position - left;
            counts[left] += 1 - fraction;
            counts[left + 1] += fraction;
        }

        // 2. Spread each grid count with the kernel. Dividing by n × bandwidth makes the area under the curve 1
        const reach = Math.ceil((4 * bandwidth) / step);
        const kernel = new Float64Array(2 * reach + 1);
        for (let k = -reach; k <= reach; k++) {
            const u = (k * step) / bandwidth;
            kernel[k + reach] = Math.exp(-0.5 * u * u) / (Math.sqrt(2 * Math.PI) * n * bandwidth);
        }
        const xValues = new Float64Array(gridSize);
        const density = new Float64Array(gridSize);
        for (let g = 0; g < gridSize; g++) {
            xValues[g] = xMin + g * step;
            if (counts[g] === 0) continue;
            for (let k = -reach; k <= reach; k++) {
                const target = g + k;
                if (target >= 0 && target < gridSize) density[target] += counts[g] * kernel[k + reach];
            }
        }
        return { xValues, density, bandwidth };
    }

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Your data: many raw values per group. Here, 5 groups × 200,000 page load times (seconds)
    const groups = getPageLoadData();
    const estimates = groups.map((group) => ({ name: group.name, ...kernelDensity(group.values, 0, 10, 1000) }));

    // Ridgeline layout: each group sits on its own baseline (0, 1, 2, ...), top row first.
    // One shared scale keeps the heights comparable: the tallest peak is 1.8 rows high
    const maxDensity = Math.max(...estimates.map((e) => Math.max(...e.density)));
    const scale = 1.8 / maxDensity;
    const rowCount = estimates.length;
    const baselineOf = (index) => rowCount - 1 - index;

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Page load time (seconds)",
            visibleRange: new NumberRange(0, 9),
            labelPrecision: 0,
            drawMinorGridLines: false
        })
    );
    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        autoTicks: false,
        majorDelta: 1,
        minorDelta: 1,
        autoRange: EAutoRange.Never,
        visibleRange: new NumberRange(-0.7, rowCount - 1 + 2), // room below the bottom row keeps it clear of the logo
        drawMinorGridLines: false,
        drawMajorBands: false
    });
    // Show each group's name at its baseline instead of a number
    yAxis.labelProvider.formatLabel = (value) => {
        const index = rowCount - 1 - Math.round(value);
        return estimates[index] ? estimates[index].name : "";
    };
    sciChartSurface.yAxes.add(yAxis);

    // One filled curve per group, drawn top row first so lower rows overlap the rows behind them
    estimates.forEach((estimate, index) => {
        const baseline = baselineOf(index);
        const yValues = Array.from(estimate.density, (d) => baseline + d * scale);
        sciChartSurface.renderableSeries.add(
            new FastMountainRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: Array.from(estimate.xValues),
                    yValues,
                    dataSeriesName: estimate.name
                }),
                zeroLineY: baseline, // fill down to this group's own baseline
                fill: "#50C7E0B0", // one colour: the rows are already labelled, so colour carries no meaning
                stroke: "#FFFFFF",
                strokeThickness: 2,
                animation: new SweepAnimation({ duration: 800 }) // the curves draw from left to right on load
            })
        );
    });

    // Tooltip: the real density of every group at the cursor's load time
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            tooltipDataTemplate: (seriesInfos) => {
                if (!seriesInfos || seriesInfos.length === 0) return [];
                const lines = [`Load time: ${seriesInfos[0].xValue.toFixed(2)} s`];
                seriesInfos.forEach((info) => {
                    const index = estimates.findIndex((e) => e.name === info.seriesName);
                    if (index < 0) return;
                    const density = (info.yValue - baselineOf(index)) / scale;
                    lines.push(`${info.seriesName}: ${density.toFixed(2)} per second`);
                });
                return lines;
            }
        })
    );

    // Zoom and pan along the time axis only, so the rows stay lined up with their labels
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    );
    // #region_A_end
}

densityPlot("scichart-root");
