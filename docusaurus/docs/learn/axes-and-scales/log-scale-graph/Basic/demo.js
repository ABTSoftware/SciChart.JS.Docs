import * as SciChart from "scichart";

// Example data: two quantities measured over 100 time steps.
// These are illustrative curves, not real statistics.
function getGrowthData() {
    const xValues = [];
    const exponential = [];
    const powerLaw = [];
    for (let step = 1; step <= 100; step++) {
        xValues.push(step);
        exponential.push(10 * Math.pow(1.15, step)); // starts at 10 and grows by 15% every step
        powerLaw.push(Math.pow(step, 3)); // the step number cubed (to the power 3)
    }
    return { xValues, exponential, powerLaw };
}

// Linear / Log buttons in the top-left corner of the chart. In your app these can be any buttons or menus.
function addScaleButtons(chartRoot, groups) {
    const bar = document.createElement("div");
    bar.style.cssText =
        "position:absolute; top:10px; left:14px; display:flex; flex-wrap:wrap; gap:12px; z-index:10;" +
        "font:14px Arial, sans-serif; color:#ffffff;";
    for (const group of groups) {
        const box = document.createElement("div");
        box.style.cssText = "display:flex; align-items:center; gap:4px;";
        const label = document.createElement("span");
        label.textContent = group.label;
        label.style.marginRight = "4px";
        box.append(label);
        const buttons = [];
        for (const isLog of [false, true]) {
            const button = document.createElement("button");
            button.textContent = isLog ? "Log" : "Linear";
            button.style.cssText =
                "font:bold 14px Arial, sans-serif; padding:4px 12px; border-radius:14px; cursor:pointer;" +
                "border:1px solid #50C7E0;";
            button.onclick = () => {
                group.onChange(isLog);
                paint(isLog);
            };
            buttons.push(button);
            box.append(button);
        }
        const paint = (isLog) => {
            buttons.forEach((button, index) => {
                const active = (index === 1) === isLog;
                button.style.background = active ? "#50C7E0" : "transparent";
                button.style.color = active ? "#14233C" : "#ffffff";
            });
        };
        paint(group.isLog);
        bar.append(box);
    }
    chartRoot.append(bar);
}

async function logScaleGraph(divElementId) {
    // #region_A_start
    // Create a JavaScript log scale graph with SciChart.js, and switch each axis between linear and log
    const {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        ENumericFormat,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        ELegendPlacement,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // One function makes either kind of axis, so the chart can swap between them
    function makeAxis(isLog, { title, growBy }) {
        const options = {
            axisTitle: title,
            growBy,
            labelFormat: ENumericFormat.Engineering, // 1, 10, 100, 1K, 10K, 100K, 1M
            labelPrecision: isLog ? 0 : 1,
            cursorLabelPrecision: 2, // the tooltip shows a little more detail than the axis labels
            // Brighter gridlines than the theme's, so the uneven log spacing is easy to see
            majorGridLineStyle: { color: "#50C7E066" },
            minorGridLineStyle: { color: "#50C7E026" }
        };
        if (!isLog) {
            return new NumericAxis(wasmContext, options);
        }
        return new LogarithmicAxis(wasmContext, {
            ...options,
            logBase: 10, // one major gridline per power of ten
            // A major gridline and label at every power of ten (1, 10, 100 ...),
            // and minor gridlines at 2, 3, 4 ... 9 times each one
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1
        });
    }

    // Replace an axis with a linear or a logarithmic one. The series keep their data: only the scale changes.
    function setScale(axes, isLog, settings) {
        const oldAxis = axes.get(0);
        axes.remove(oldAxis, true);
        const newAxis = makeAxis(isLog, settings);
        axes.add(newAxis);
        sciChartSurface.zoomExtents(); // reset any zoom
        newAxis.visibleRange = newAxis.getMaximumRange(); // fit the new axis to the data
    }

    const ySettings = (isLog) => ({
        title: isLog ? "Value (log scale)" : "Value (linear scale)",
        // Extra space at the bottom keeps the lowest points clear of the SciChart logo
        growBy: isLog ? new NumberRange(0.13, 0.05) : new NumberRange(0.08, 0.05)
    });
    const xSettings = (isLog) => ({
        title: isLog ? "Time step (log scale)" : "Time step",
        growBy: isLog ? new NumberRange(0.01, 0.04) : new NumberRange(0.02, 0.02)
    });

    // Start as a semi-log graph: linear x-axis, logarithmic y-axis
    sciChartSurface.xAxes.add(makeAxis(false, xSettings(false)));
    sciChartSurface.yAxes.add(makeAxis(true, ySettings(true)));

    const { xValues, exponential, powerLaw } = getGrowthData();
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: exponential,
                dataSeriesName: "Exponential: +15% per step"
            }),
            stroke: "#50C7E0",
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, { width: 6, height: 6, fill: "#50C7E0", strokeThickness: 0 })
        }),
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: powerLaw,
                dataSeriesName: "Power law: step³"
            }),
            stroke: "#F48420",
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, { width: 6, height: 6, fill: "#F48420", strokeThickness: 0 })
        })
    );

    // Hover for values, scroll to zoom, drag to pan, double-click to reset
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true }),
        new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopLeft, margin: 48 }), // below the Linear / Log buttons
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );

    // Buttons that switch each axis between linear and log
    addScaleButtons(sciChartSurface.domChartRoot, [
        { label: "Y axis", isLog: true, onChange: (isLog) => setScale(sciChartSurface.yAxes, isLog, ySettings(isLog)) },
        { label: "X axis", isLog: false, onChange: (isLog) => setScale(sciChartSurface.xAxes, isLog, xSettings(isLog)) }
    ]);
    // #region_A_end
}

logScaleGraph("scichart-root");
