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

// Quantile by linear interpolation
function quantile(sorted, p) {
    const pos = (sorted.length - 1) * p;
    const lower = Math.floor(pos);
    const upper = Math.ceil(pos);
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (pos - lower);
}

// Gaussian kernel density estimate, trimmed to the range of the data.
// Bandwidth: Silverman's rule of thumb, h = 0.9 * min(standard deviation, IQR / 1.34) * n^(-1/5),
// multiplied by bandwidthFactor (1 = the rule itself).
function kernelDensity(values, bandwidthFactor = 1, gridPoints = 200) {
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
    return { xValues, densities, bandwidth };
}

async function violinBandwidth(divElementId) {
    // #region_A_start
    // The same data drawn as three violins, each with a different kernel bandwidth
    const {
        SciChartSurface,
        NumericAxis,
        TextLabelProvider,
        NumberRange,
        EAxisAlignment,
        FastBandRenderableSeries,
        XyyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const values = generateLoadTimes()[2]; // Server C: two peaks
    const settings = [
        { factor: 0.25, name: "Too narrow" },
        { factor: 1, name: "Silverman's rule" },
        { factor: 4, name: "Too wide" }
    ];
    const violins = settings.map((s) => ({ ...s, ...kernelDensity(values, s.factor) }));
    const labels = violins.map((v) => `${v.name}: h = ${v.bandwidth.toFixed(0)} ms`);

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            flippedCoordinates: true, // values grow upwards
            axisTitle: "Page load time (ms)",
            labelPrecision: 0,
            growBy: new NumberRange(0.12, 0.05) // extra space at the bottom for the watermark
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Bottom,
            flippedCoordinates: true, // violins run from left to right
            labelProvider: new TextLabelProvider({ labels }),
            autoTicks: false,
            majorDelta: 1,
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            growBy: new NumberRange(0.08, 0.05)
        })
    );

    violins.forEach((violin, position) => {
        const scale = 0.4 / Math.max(...violin.densities);
        sciChartSurface.renderableSeries.add(
            new FastBandRenderableSeries(wasmContext, {
                dataSeries: new XyyDataSeries(wasmContext, {
                    xValues: violin.xValues,
                    yValues: violin.densities.map((d) => position + d * scale),
                    y1Values: violin.densities.map((d) => position - d * scale),
                    dataSeriesName: labels[position]
                }),
                fill: "#50C7E099",
                fillY1: "#50C7E099",
                stroke: "#50C7E0",
                strokeY1: "#50C7E0",
                strokeThickness: 2
            })
        );
    });

    // Hover: the cursor shows the load time; the tooltip says how many requests fall within 25 ms of it
    const tooltipDataTemplate = (seriesInfos) => {
        const info = (seriesInfos || []).find((si) => si.isWithinDataBounds);
        if (!info) return [];
        const near = values.filter((v) => Math.abs(v - info.xValue) <= 25).length;
        return [`Load time: ${info.xValue.toFixed(0)} ms`, `Requests within 25 ms: ${near} of ${values.length}`];
    };

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

violinBandwidth("scichart-root");
