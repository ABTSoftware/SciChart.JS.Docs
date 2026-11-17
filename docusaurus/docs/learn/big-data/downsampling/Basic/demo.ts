import * as SciChart from "scichart";

// Example data: 1,000,000 samples (1,000 a second for 1,000 seconds) of a slowly changing, noisy signal
// with 12 short spikes. Seeded, so the chart looks the same every time and needs no external data.
function getLargeSignal(count = 1000000, spikeCount = 12) {
    let seed = 7;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const xValues = new Float64Array(count);
    const yValues = new Float64Array(count);
    let drift = 0;
    for (let i = 0; i < count; i++) {
        const t = i / 1000;
        drift = drift * 0.9999 + (random() - 0.5) * 0.02;
        const noise = (random() + random() + random() - 1.5) * 0.8;
        xValues[i] = t;
        yValues[i] = 2 * Math.sin((2 * Math.PI * t) / 400) + 0.8 * Math.sin((2 * Math.PI * t) / 37) + drift + noise;
    }
    for (let s = 0; s < spikeCount; s++) {
        const index = Math.floor(((s + 0.2 + random() * 0.6) / spikeCount) * count);
        const height = (random() < 0.5 ? -1 : 1) * (5 + random() * 4);
        const width = 1 + Math.floor(random() * 3);
        for (let k = 0; k < width; k++) yValues[index + k] += height * (k === 0 ? 1 : 0.6);
    }
    return { xValues, yValues };
}

// Auto / None buttons in the top-left corner of the chart. In your app these can be any buttons or menus.
function addResamplingButtons(chartRoot, onChange) {
    const bar = document.createElement("div");
    bar.style.cssText =
        "position:absolute; top:10px; left:14px; display:flex; align-items:center; gap:6px; z-index:10;" +
        "font:14px Arial, sans-serif; color:#ffffff;";
    const label = document.createElement("span");
    label.textContent = "Resampling";
    label.style.cssText = "font-weight:bold; margin-right:4px;";
    bar.append(label);
    const buttons = ["Auto", "None"].map((mode) => {
        const button = document.createElement("button");
        button.textContent = mode;
        button.style.cssText =
            "font:bold 14px Arial, sans-serif; padding:4px 12px; border-radius:14px; cursor:pointer; border:1px solid #50C7E0;";
        button.onclick = () => {
            onChange(mode);
            paint(mode);
        };
        bar.append(button);
        return button;
    });
    const paint = (mode) =>
        buttons.forEach((button) => {
            const active = button.textContent === mode;
            button.style.background = active ? "#50C7E0" : "transparent";
            button.style.color = active ? "#14233C" : "#ffffff";
        });
    paint("Auto");
    chartRoot.append(bar);
}

async function millionPointChart(divElementId) {
    // #region_A_start
    // A line chart with 1,000,000 points. SciChart.js downsamples (resamples) it automatically for each view.
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        EResamplingMode,
        NumberRange,
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
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Time (s)", growBy: new NumberRange(0.02, 0.01) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Signal", growBy: new NumberRange(0.08, 0.2) }));

    // Pass all the raw data: no downsampling in your code
    const { xValues, yValues } = getLargeSignal();
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        // Telling SciChart how the data is laid out saves it checking, and lets it pick the fastest resampler
        dataIsSortedInX: true,
        dataEvenlySpacedInX: true,
        containsNaN: false
    });

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "#50C7E0",
        strokeThickness: 1,
        // Auto (the default) resamples to the pixels on screen, keeping every peak and trough.
        // None draws every point: the same picture, with more work for each frame.
        resamplingMode: EResamplingMode.Auto
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // Hover for values, scroll to zoom, drag to pan, double-click to reset
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // Switch resampling on and off to compare
    addResamplingButtons(sciChartSurface.domChartRoot, (mode) => {
        lineSeries.resamplingMode = mode === "Auto" ? EResamplingMode.Auto : EResamplingMode.None;
    });
    // #region_A_end
}

millionPointChart("scichart-root");
