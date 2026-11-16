import * as SciChart from "scichart";

const FREQUENCY_BINS = 256; // rows: 0 to 8,000 Hz in 256 bands
const MAX_FREQUENCY = 8000; // Hz
const TIME_COLUMNS = 200; // columns: the last 10 seconds
const SECONDS_PER_COLUMN = 0.05; // a new column every 50 ms

// Makes one column of a spectrogram: the level, in decibels (dB), of each frequency band at time t.
// A real app would get this from an FFT of the latest audio or sensor samples. Here we compute
// the levels directly, with a seeded random generator for the noise, so the chart needs no data feed:
// a quiet noise floor, two steady tones (1,000 Hz and 3,000 Hz), a tone that pulses on and off,
// and a chirp that sweeps from 500 Hz to 7,000 Hz every 4 seconds.
let seed = 42;
const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
};
function spectrumAt(t) {
    const binWidth = MAX_FREQUENCY / FREQUENCY_BINS;
    const sources = [
        { frequency: 1000, level: -25 },
        { frequency: 3000, level: -40 },
        { frequency: 5500, level: t % 2 < 1 ? -35 : -200 },
        { frequency: 500 + 6500 * ((t % 4) / 4), level: -20 }
    ];
    const column = [];
    for (let bin = 0; bin < FREQUENCY_BINS; bin++) {
        const frequency = (bin + 0.5) * binWidth;
        // Add up power (not dB): the noise floor plus each tone, spread over a few bands
        let power = Math.pow(10, (-85 + random() * 10) / 10);
        for (const { frequency: f, level } of sources) {
            const distance = (frequency - f) / (2 * binWidth);
            power += Math.pow(10, level / 10) * Math.exp(-distance * distance);
        }
        column.push(10 * Math.log10(power));
    }
    return column;
}

// The spectrogram and its colour legend each need a div. This splits the page's div in two;
// in your app, they can simply be two divs in your HTML.
function createChartAndLegendDivs(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.display = "flex";
    // Give each div an id: SciChart tells its charts apart by their div's id
    const chartDiv = document.createElement("div");
    chartDiv.id = divElementId + "-chart";
    chartDiv.style.flex = "1";
    chartDiv.style.height = "100%";
    const legendDiv = document.createElement("div");
    legendDiv.id = divElementId + "-legend";
    legendDiv.style.width = "110px";
    legendDiv.style.height = "100%";
    root.append(chartDiv, legendDiv);
    return { chartDiv, legendDiv };
}

async function spectrogramChart(divElementId) {
    const { chartDiv, legendDiv } = createChartAndLegendDivs(divElementId);

    // #region_A_start
    // Create a real-time JavaScript spectrogram with SciChart.js
    const {
        SciChartSurface,
        HeatmapLegend,
        NumericAxis,
        NumberRange,
        EAutoRange,
        EXyDirection,
        UniformHeatmapRenderableSeries,
        UniformHeatmapDataSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(chartDiv, {
        theme: new SciChartJsNavyTheme()
    });

    // x: time. AutoRange "Always" keeps the newest data in view as the chart scrolls
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { axisTitle: "Time (s)", autoRange: EAutoRange.Always, labelPrecision: 0 })
    );
    // y: frequency
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Frequency (Hz)",
            visibleRange: new NumberRange(0, MAX_FREQUENCY),
            labelPrecision: 0
        })
    );

    // The colour map: quiet (-90 dB) is black, loud (-10 dB) is pale yellow
    const colorMap = new HeatmapColorMap({
        minimum: -90,
        maximum: -10,
        gradientStops: [
            { offset: 0, color: "#000004" },
            { offset: 0.2, color: "#420A68" },
            { offset: 0.4, color: "#932667" },
            { offset: 0.6, color: "#DD513A" },
            { offset: 0.8, color: "#FCA50A" },
            { offset: 1, color: "#FCFFA4" }
        ]
    });

    // Your data: zValues[frequency band][time column], in dB. Fill the first 10 seconds
    const zValues = Array.from({ length: FREQUENCY_BINS }, () => []);
    let time = 0;
    for (let i = 0; i < TIME_COLUMNS; i++, time += SECONDS_PER_COLUMN) {
        spectrumAt(time).forEach((level, bin) => zValues[bin].push(level));
    }

    const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
        zValues,
        xStart: 0,
        xStep: SECONDS_PER_COLUMN, // each column is 50 ms of time
        yStart: 0,
        yStep: MAX_FREQUENCY / FREQUENCY_BINS // each row is one frequency band
    });
    sciChartSurface.renderableSeries.add(new UniformHeatmapRenderableSeries(wasmContext, { dataSeries, colorMap }));

    await HeatmapLegend.create(legendDiv, {
        theme: new SciChartJsNavyTheme(),
        colorMap,
        yAxisOptions: { axisTitle: "Level (dB)" }
    });

    // Every 50 ms: drop the oldest column, add the newest, and move the start time on
    const timer = setInterval(() => {
        spectrumAt(time).forEach((level, bin) => {
            zValues[bin].shift();
            zValues[bin].push(level);
        });
        time += SECONDS_PER_COLUMN;
        dataSeries.xStart = time - TIME_COLUMNS * SECONDS_PER_COLUMN;
        dataSeries.setZValues(zValues);
    }, SECONDS_PER_COLUMN * 1000);
    // Stop the timer when the chart is deleted
    sciChartSurface.addDeletable({ delete: () => clearInterval(timer) });

    // Zoom into a frequency band with the mouse wheel, drag up and down to pan,
    // double-click to reset, and hover to read the level
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos
                    .filter((info) => info.isHit)
                    .map((info) => {
                        const bin = Math.floor(info.yValue / dataSeries.yStep);
                        const column = Math.floor((info.xValue - dataSeries.xStart) / dataSeries.xStep);
                        const level = zValues[bin]?.[column];
                        return `${Math.round(info.yValue)} Hz: ${level === undefined ? "-" : level.toFixed(0)} dB`;
                    })
        }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.YDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.YDirection }),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

spectrogramChart("scichart-root");
