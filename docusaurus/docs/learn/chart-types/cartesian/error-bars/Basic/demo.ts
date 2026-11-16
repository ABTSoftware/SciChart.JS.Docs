import * as SciChart from "scichart";

// Example data: the height (cm) of 10 plants in each of four fertiliser groups, measured after four weeks.
// These are illustrative numbers, not results from a real experiment.
function getPlantHeights() {
    const groups = ["Control", "Low dose", "Medium dose", "High dose"];
    const heights = [
        [11.1, 11.9, 13.9, 11.4, 9.2, 10.2, 14.1, 13.3, 12.2, 13.0],
        [12.1, 15.2, 15.1, 12.3, 12.8, 13.8, 12.9, 14.1, 11.4, 13.1],
        [15.3, 15.2, 16.2, 13.1, 16.9, 16.2, 13.3, 15.0, 15.3, 12.6],
        [13.6, 15.4, 12.3, 14.2, 14.7, 14.3, 16.2, 15.1, 14.3, 17.3]
    ];
    return { groups, heights };
}

// A seeded random generator, so the small sideways spread of the dots is the same every time
function seededRandom(seed) {
    return () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
}

async function errorBarsChart(divElementId) {
    // #region_A_start
    // Create a JavaScript chart with error bars in SciChart.js: the mean of each group with SD, SE and 95% CI bars
    const {
        SciChartSurface,
        NumericAxis,
        FastErrorBarsRenderableSeries,
        XyScatterRenderableSeries,
        HlcDataSeries,
        XyDataSeries,
        EllipsePointMarker,
        TextLabelProvider,
        EErrorMode,
        EDataPointWidthMode,
        EAxisAlignment,
        NumberRange,
        SciChartJsNavyTheme,
        LegendModifier,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Your data: one list of measurements per group
    const { groups, heights } = getPlantHeights();

    // 1. Work out the mean, standard deviation (SD), standard error (SE) and 95% confidence interval (CI) of each group
    const T_95 = 2.262; // two-sided 95% t value for n - 1 = 9 degrees of freedom (10 plants per group)
    const stats = heights.map((values) => {
        const n = values.length;
        const mean = values.reduce((sum, v) => sum + v, 0) / n;
        const sd = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (n - 1));
        const se = sd / Math.sqrt(n);
        return { n, mean, sd, se, ci: T_95 * se };
    });
    const means = stats.map((s) => s.mean);

    // X axis: one group name at x = 0, 1, 2, 3
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            labelProvider: new TextLabelProvider({ labels: groups }),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            growBy: new NumberRange(0.12, 0.07) // extra space on the left keeps the first group clear of the chart's bottom corner
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            axisTitle: "Plant height (cm)",
            labelPrecision: 0,
            growBy: new NumberRange(0.2, 0.06) // extra space at the bottom keeps the lowest dot clear of the chart's bottom corner
        })
    );

    // 2. The raw data: every plant as a faint dot, spread a little sideways so dots with similar values don't hide each other
    const random = seededRandom(7);
    const dotX = [];
    const dotY = [];
    heights.forEach((values, group) => {
        values.forEach((value) => {
            dotX.push(group - 0.3 + (random() - 0.5) * 0.12);
            dotY.push(value);
        });
    });
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues: dotX, yValues: dotY, dataSeriesName: "Each plant" }),
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 8,
                height: 8,
                strokeThickness: 0,
                fill: "#FFFFFF88"
            })
        })
    );

    // 3. Three error bar series around the same means, side by side: SD, SE and 95% CI
    const errorBarTypes = [
        { name: "Mean ± SD", halfWidth: (s) => s.sd, offset: -0.1, color: "#F48420" },
        { name: "Mean ± SE", halfWidth: (s) => s.se, offset: 0.1, color: "#50C7E0" },
        { name: "Mean ± 95% CI", halfWidth: (s) => s.ci, offset: 0.3, color: "#E8336D" }
    ];
    errorBarTypes.forEach((type) => {
        sciChartSurface.renderableSeries.add(
            new FastErrorBarsRenderableSeries(wasmContext, {
                // HlcDataSeries: x, the value the bar is drawn around (y), and the top (high) and bottom (low) of each bar
                dataSeries: new HlcDataSeries(wasmContext, {
                    xValues: stats.map((_, group) => group + type.offset),
                    yValues: means,
                    highValues: stats.map((s) => s.mean + type.halfWidth(s)),
                    lowValues: stats.map((s) => s.mean - type.halfWidth(s)),
                    dataSeriesName: type.name
                }),
                stroke: type.color,
                strokeThickness: 3,
                errorMode: EErrorMode.Both, // draw both arms, up and down
                dataPointWidth: 0.12, // the width of the caps, in x-axis units
                dataPointWidthMode: EDataPointWidthMode.Range,
                // A marker at the mean of each group
                pointMarker: new EllipsePointMarker(wasmContext, {
                    width: 12,
                    height: 12,
                    strokeThickness: 2,
                    stroke: "#FFFFFF",
                    fill: type.color
                })
            })
        );
    });

    // Legend: tick a box to show or hide each kind of error bar
    sciChartSurface.chartModifiers.add(new LegendModifier({ showCheckboxes: true }));

    // Tooltip: the numbers behind each group's bars
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            tooltipDataTemplate: (seriesInfos) => {
                if (seriesInfos.length === 0) return [];
                const group = Math.round(seriesInfos[0].xValue);
                const s = stats[group];
                if (!s) return [];
                const low = (s.mean - s.ci).toFixed(2);
                const high = (s.mean + s.ci).toFixed(2);
                return [
                    `${groups[group]} (n = ${s.n})`,
                    `Mean: ${s.mean.toFixed(2)} cm`,
                    `SD: ± ${s.sd.toFixed(2)}`,
                    `SE: ± ${s.se.toFixed(2)}`,
                    `95% CI: ${low} to ${high}`
                ];
            }
        })
    );

    // Zoom with the mouse wheel, pan by dragging and double-click to reset
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
    // #region_A_end
}

errorBarsChart("scichart-root");
