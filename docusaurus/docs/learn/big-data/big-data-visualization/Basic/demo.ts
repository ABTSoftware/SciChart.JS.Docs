import * as SciChart from "scichart";

// Example data: five sensor-like signals, generated in the browser with a seeded random
// generator, so the chart looks the same every time and needs no download.
function createSignalGenerator(seriesCount) {
    let seed = 42;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const lastNoise = new Array(seriesCount).fill(0);
    let nextX = 0;

    // Returns the next `count` points of every signal. Float64Array is the fastest way to pass numbers to a chart.
    return function nextPoints(count) {
        const xValues = new Float64Array(count);
        for (let i = 0; i < count; i++) {
            xValues[i] = nextX + i;
        }
        const yValuesPerSeries = [];
        for (let s = 0; s < seriesCount; s++) {
            const yValues = new Float64Array(count);
            let noise = lastNoise[s];
            for (let i = 0; i < count; i++) {
                // A slow wave plus wandering noise, each signal in its own band
                noise = noise * 0.998 + (random() - 0.5) * 1.5;
                yValues[i] = s * 50 + 12 * Math.sin((xValues[i] / 300000) * 2 * Math.PI + s) + noise;
            }
            lastNoise[s] = noise;
            yValuesPerSeries.push(yValues);
        }
        nextX += count;
        return { xValues, yValuesPerSeries };
    };
}

// Resolves when the chart has drawn its next frame and the browser has shown it
function waitForNextDraw(sciChartSurface) {
    return new Promise((resolve) => {
        const onRendered = () => {
            sciChartSurface.rendered.unsubscribe(onRendered);
            setTimeout(resolve, 0);
        };
        sciChartSurface.rendered.subscribe(onRendered);
        sciChartSurface.invalidateElement(); // ask for a redraw, in case nothing else did
    });
}

// The "Add 1 million points" and "Reset" buttons and the points counter, in the top-left corner of the chart.
// In your app these can be any buttons or text.
function addControls(chartRoot, { onAdd, onReset }) {
    const bar = document.createElement("div");
    bar.style.cssText =
        "position:absolute; top:10px; left:14px; right:14px; display:flex; flex-wrap:wrap; align-items:center;" +
        "gap:10px; z-index:10; font:14px Arial, sans-serif; color:#ffffff;";
    const makeButton = (text, onClick, filled) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.style.cssText =
            "font:bold 14px Arial, sans-serif; padding:5px 14px; border-radius:14px; cursor:pointer;" +
            "border:1px solid #50C7E0;" +
            (filled ? "background:#50C7E0; color:#14233C;" : "background:transparent; color:#ffffff;");
        button.onclick = onClick;
        return button;
    };
    const addButton = makeButton("Add 1 million points", onAdd, true);
    const resetButton = makeButton("Reset", onReset, false);
    const status = document.createElement("span");
    status.style.cssText = "background:#14233CCC; padding:4px 10px; border-radius:6px;";
    bar.append(addButton, resetButton, status);
    chartRoot.append(bar);
    return {
        setStatus: (text) => (status.textContent = text),
        setBusy: (busy) => {
            addButton.disabled = busy;
            resetButton.disabled = busy;
            addButton.style.opacity = busy ? "0.5" : "1";
        }
    };
}

async function bigDataChart(divElementId) {
    // #region_A_start
    // A JavaScript chart with millions of points: five line series, plus a button that adds a million more
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        FastLineRenderableSeries,
        ENumericFormat,
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
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { axisTitle: "Sample number", labelFormat: ENumericFormat.Engineering })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { axisTitle: "Value", growBy: new NumberRange(0.25, 0.05) })
    );

    // One data series per signal. The flags tell the chart what the data looks like, so it can skip checking.
    const colours = ["#50C7E0", "#F48420", "#AE418D", "#68BCAE", "#EC0F6C"];
    const dataSeries = colours.map((colour, index) => {
        const series = new XyDataSeries(wasmContext, {
            dataSeriesName: `Signal ${index + 1}`,
            dataIsSortedInX: true,
            dataEvenlySpacedInX: true,
            containsNaN: false
        });
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, { dataSeries: series, stroke: colour, strokeThickness: 1 })
        );
        return series;
    });

    const pointsPerClick = 1000000;
    const maxPoints = 10000000; // this demo stops at 10 million points
    let nextPoints = createSignalGenerator(dataSeries.length);
    let totalPoints = 0;

    const controls = addControls(sciChartSurface.domChartRoot, {
        onAdd: () => addPoints(),
        onReset: () => {
            dataSeries.forEach((series) => series.clear());
            nextPoints = createSignalGenerator(dataSeries.length);
            totalPoints = 0;
            addPoints();
        }
    });

    // Append a million points (200,000 per series) in one call per series, then time the next draw
    async function addPoints() {
        if (totalPoints >= maxPoints) {
            controls.setStatus(`${totalPoints.toLocaleString()} points: this demo stops here. Zoom in to explore.`);
            return;
        }
        controls.setBusy(true);
        const { xValues, yValuesPerSeries } = nextPoints(pointsPerClick / dataSeries.length);

        const start = performance.now();
        dataSeries.forEach((series, index) => series.appendRange(xValues, yValuesPerSeries[index]));
        sciChartSurface.zoomExtents();
        await waitForNextDraw(sciChartSurface);
        const milliseconds = Math.round(performance.now() - start);

        const isFirstLoad = totalPoints === 0;
        totalPoints += pointsPerClick;
        controls.setStatus(
            isFirstLoad
                ? `${totalPoints.toLocaleString()} points · click Add to time the next million`
                : `${totalPoints.toLocaleString()} points · last million added and drawn in ${milliseconds} ms`
        );
        controls.setBusy(false);
    }

    // Hover for values, scroll to zoom, drag to pan, double-click to zoom back out
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    await addPoints(); // start with 1 million points
    // #region_A_end
}

bigDataChart("scichart-root");
