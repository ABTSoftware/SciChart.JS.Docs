import * as SciChart from "scichart";

// Generates page load times (ms) for four servers with a seeded random generator,
// so the chart looks the same every time.
function generateLoadTimes() {
    let seed = 11;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    // Normally distributed values (Box-Muller transform)
    const normal = (mean, sd) => mean + sd * Math.sqrt(-2 * Math.log(random() + 1e-9)) * Math.cos(2 * Math.PI * random());
    const n = 400;
    return [
        // Server A: one tight peak
        Array.from({ length: n }, () => normal(380, 45)),
        // Server B: right-skewed, with a long tail of slow requests
        Array.from({ length: n }, () => 230 + Math.exp(normal(Math.log(190), 0.45))),
        // Server C: two peaks, fast cache hits and slow cache misses
        Array.from({ length: n }, (_, i) => (i < n / 2 ? normal(300, 45) : normal(620, 50))),
        // Server D: spread evenly between about 140 and 780 ms
        Array.from({ length: n }, () => 140 + 640 * random())
    ];
}

// Quantile by linear interpolation (the method used by Excel's QUARTILE.INC and NumPy's default)
function quantile(sorted, p) {
    const pos = (sorted.length - 1) * p;
    const lower = Math.floor(pos);
    const upper = Math.ceil(pos);
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (pos - lower);
}

// Gaussian kernel density estimate, trimmed to the range of the data.
// Bandwidth: Silverman's rule of thumb, h = 0.9 * min(standard deviation, IQR / 1.34) * n^(-1/5),
// multiplied by bandwidthFactor (1 = the rule itself).
function kernelDensity(values, bandwidthFactor = 1, gridPoints = 150) {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = sorted.reduce((sum, v) => sum + v, 0) / n;
    const sd = Math.sqrt(sorted.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (n - 1));
    const iqr = quantile(sorted, 0.75) - quantile(sorted, 0.25);
    const bandwidth = bandwidthFactor * 0.9 * Math.min(sd, iqr / 1.34) * Math.pow(n, -0.2);
    const min = sorted[0];
    const max = sorted[n - 1];
    const xValues = [];
    const densities = [];
    for (let i = 0; i < gridPoints; i++) {
        const x = min + ((max - min) * i) / (gridPoints - 1);
        let sum = 0;
        for (const v of sorted) {
            const u = (x - v) / bandwidth;
            sum += Math.exp(-0.5 * u * u);
        }
        xValues.push(x);
        densities.push(sum / (n * bandwidth * Math.sqrt(2 * Math.PI)));
    }
    return { xValues, densities, bandwidth, sorted };
}

// Quartiles, median and whiskers (furthest values within 1.5 x IQR of the box, Tukey's rule)
function boxSummary(sorted) {
    const q1 = quantile(sorted, 0.25);
    const q3 = quantile(sorted, 0.75);
    const iqr = q3 - q1;
    const inside = sorted.filter((v) => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr);
    return { q1, median: quantile(sorted, 0.5), q3, low: inside[0], high: inside[inside.length - 1] };
}

async function violinPlot(divElementId) {
    // #region_A_start
    // Create a JavaScript violin plot with SciChart.js: each violin is a band series
    // (a filled area between an upper and a lower line), with a slim box plot inside.
    const {
        SciChartSurface,
        NumericAxis,
        TextLabelProvider,
        NumberRange,
        EAxisAlignment,
        FastBandRenderableSeries,
        XyyDataSeries,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // The chart is rotated: the X axis (the measured value) runs up the left-hand side,
    // and the Y axis (one position per group) runs along the bottom.
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            flippedCoordinates: true, // values grow upwards
            axisTitle: "Page load time (ms)",
            labelPrecision: 0,
            growBy: new NumberRange(0.12, 0.05) // extra space at the bottom for the watermark
        })
    );
    const groupNames = ["Server A", "Server B", "Server C", "Server D"];
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Bottom,
            flippedCoordinates: true, // groups run from left to right
            labelProvider: new TextLabelProvider({ labels: groupNames }),
            autoTicks: false,
            majorDelta: 1,
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            growBy: new NumberRange(0.08, 0.05)
        })
    );

    // Your data: one array of raw values per group
    const groups = generateLoadTimes();
    const halfWidth = 0.4; // the widest point of every violin, in group units

    groups.forEach((values, position) => {
        // The violin: the density estimate mirrored either side of the group's position
        const { xValues, densities, sorted } = kernelDensity(values);
        const scale = halfWidth / Math.max(...densities);
        sciChartSurface.renderableSeries.add(
            new FastBandRenderableSeries(wasmContext, {
                dataSeries: new XyyDataSeries(wasmContext, {
                    xValues,
                    yValues: densities.map((d) => position + d * scale),
                    y1Values: densities.map((d) => position - d * scale),
                    dataSeriesName: groupNames[position]
                }),
                fill: "#50C7E099",
                fillY1: "#50C7E099",
                stroke: "#50C7E0",
                strokeY1: "#50C7E0",
                strokeThickness: 2
            })
        );

        // The slim box plot inside: a whisker line, a box from Q1 to Q3, and the median as a dot
        const box = boxSummary(sorted);
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: [box.low, box.high], yValues: [position, position] }),
                stroke: "#E8EEF5",
                strokeThickness: 2
            }),
            new FastBandRenderableSeries(wasmContext, {
                dataSeries: new XyyDataSeries(wasmContext, {
                    xValues: [box.q1, box.q3],
                    yValues: [position + 0.04, position + 0.04],
                    y1Values: [position - 0.04, position - 0.04]
                }),
                fill: "#14233C",
                fillY1: "#14233C",
                stroke: "#E8EEF5",
                strokeY1: "#E8EEF5",
                strokeThickness: 1
            }),
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: [box.median], yValues: [position] }),
                pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "#FFFFFF", stroke: "#14233C" })
            })
        );
    });

    // Hover: for the load time under the cursor, show the share of each server's requests that were faster
    const sortedGroups = groups.map((values) => [...values].sort((a, b) => a - b));
    const tooltipDataTemplate = (seriesInfos) => {
        const info = (seriesInfos || []).find((si) => si.isWithinDataBounds && groupNames.includes(si.seriesName));
        if (!info) return [];
        const value = info.xValue;
        const lines = [`Load time: ${value.toFixed(0)} ms`, "Requests faster than this:"];
        sortedGroups.forEach((sorted, i) => {
            const faster = sorted.filter((v) => v < value).length;
            lines.push(`${groupNames[i]}: ${Math.round((100 * faster) / sorted.length)}%`);
        });
        return lines;
    };

    // Zoom with the mouse wheel, pan by dragging, double-click to reset, and hover for values
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            tooltipDataTemplate,
            tooltipContainerBackground: "#14233C",
            crosshairStroke: "#E8EEF5",
            axisLabelFill: "#14233C"
        }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

violinPlot("scichart-root");
