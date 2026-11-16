import * as SciChart from "scichart";

// Generates the waiting times (minutes) of 120 patients at each of two clinics, with a seeded random
// generator so the chart looks the same every time. Clinic A's waits are spread evenly. Clinic B has two
// kinds of patient: those with appointments wait about 18 minutes, walk-ins about 48.
function generateWaits() {
    let seed = 323;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    // Normally distributed values (Box-Muller transform)
    const normal = (mean, sd) => mean + sd * Math.sqrt(-2 * Math.log(random() + 1e-9)) * Math.cos(2 * Math.PI * random());
    const clinicA = Array.from({ length: 120 }, () => 8 + random() * 50);
    const clinicB = Array.from({ length: 120 }, (_, i) => (i % 2 === 0 ? normal(18, 4) : normal(48, 4)));
    return [clinicA, clinicB];
}

// Quartile by linear interpolation
function quantile(sorted, p) {
    const pos = (sorted.length - 1) * p;
    const lower = Math.floor(pos);
    const upper = Math.ceil(pos);
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (pos - lower);
}

// Five-number summary for each group, with whiskers at 1.5 x IQR, plus every value with a small random
// sideways offset (jitter) so the dots don't sit on top of each other
function summariseWithPoints(groups) {
    let seed = 99;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const summary = { xValues: [], min: [], q1: [], median: [], q3: [], max: [], pointX: [], pointY: [] };
    groups.forEach((values, x) => {
        const sorted = [...values].sort((a, b) => a - b);
        const q1 = quantile(sorted, 0.25);
        const q3 = quantile(sorted, 0.75);
        const iqr = q3 - q1;
        const inside = sorted.filter((v) => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr);
        summary.xValues.push(x);
        summary.min.push(inside[0]);
        summary.q1.push(q1);
        summary.median.push(quantile(sorted, 0.5));
        summary.q3.push(q3);
        summary.max.push(inside[inside.length - 1]);
        values.forEach((v) => {
            summary.pointX.push(x + (random() - 0.5) * 0.3);
            summary.pointY.push(v);
        });
    });
    return summary;
}

async function boxPlotDistribution(divElementId) {
    // #region_A_start
    // Two box plots that look the same, drawn over the individual values they summarise
    const {
        SciChartSurface,
        NumericAxis,
        TextLabelProvider,
        NumberRange,
        FastBoxPlotRenderableSeries,
        BoxPlotDataSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        LegendModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            labelProvider: new TextLabelProvider({ labels: { 0: "Clinic A", 1: "Clinic B" } }),
            autoTicks: false,
            majorDelta: 1,
            drawMinorGridLines: false,
            growBy: new NumberRange(0.6, 0.6)
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { axisTitle: "Waiting time (minutes)", labelPrecision: 0, growBy: new NumberRange(0.05, 0.05) })
    );

    const s = summariseWithPoints(generateWaits());

    // The individual values first, so the boxes are drawn on top of them
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: s.pointX,
                yValues: s.pointY,
                dataSeriesName: "Individual patients"
            }),
            stroke: "#50C7E0", // the colour shown in the legend
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                strokeThickness: 0,
                fill: "#50C7E0AA"
            })
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastBoxPlotRenderableSeries(wasmContext, {
            dataSeries: new BoxPlotDataSeries(wasmContext, {
                xValues: s.xValues,
                minimumValues: s.min,
                lowerQuartileValues: s.q1,
                medianValues: s.median,
                upperQuartileValues: s.q3,
                maximumValues: s.max,
                dataSeriesName: "Box plot"
            }),
            dataPointWidth: 0.5,
            fill: "#4682b433", // nearly transparent, so the dots show through
            stroke: "#c6e2ff",
            strokeThickness: 2,
            whiskers: { stroke: "#c6e2ff", strokeThickness: 2 },
            cap: { stroke: "#c6e2ff", strokeThickness: 2, dataPointWidth: 0.25 },
            medianLine: { stroke: "#ffb000", strokeThickness: 3 }
        })
    );

    // Untick "Individual patients" to see the box plots on their own. Zoom with the mouse wheel,
    // pan by dragging, double-click to reset
    sciChartSurface.chartModifiers.add(
        new LegendModifier({ showCheckboxes: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

boxPlotDistribution("scichart-root");
