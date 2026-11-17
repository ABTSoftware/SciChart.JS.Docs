import * as SciChart from "scichart";

// Illustrative annual sales by region for a fictional company (£4.2m in total), so the chart needs no external data.
// Segments are ordered largest first.
const salesByRegion = [
    { text: "Europe", value: 1680, color: "#50C7E0" },
    { text: "North America", value: 1260, color: "#F48420" },
    { text: "Asia-Pacific", value: 840, color: "#30BC9A" },
    { text: "Rest of world", value: 420, color: "#8E9BAE" }
];

async function donutChart(divElementId) {
    // #region_A_start
    // Create a JavaScript donut chart with SciChart.js
    const { SciChartPieSurface, EPieType, PieSegment, SciChartJsNavyTheme, ELegendPlacement, ELegendOrientation } =
        SciChart;
    // or, for npm, import { SciChartPieSurface, ... } from "scichart"

    // A donut chart is a pie chart with pieType Donut and a hole in the middle
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        pieType: EPieType.Donut,
        holeRadius: 0.6, // the hole's size, as a fraction of the outer radius
        animate: true,
        seriesSpacing: 2 // a small gap between segments
    });

    // Label each segment with its share of the total, rounded to a whole percentage
    sciChartPieSurface.labelStyle = { fontSize: 16, color: "#14233C" };
    sciChartPieSurface.labelProvider.getSegmentText = (segment, total) =>
        `${Math.round((100 * segment.value) / total)}%`;

    // A legend names each segment. Click a segment, or tick it in the legend, to pull it out
    sciChartPieSurface.legend.showLegend = true;
    sciChartPieSurface.legend.showCheckboxes = true;
    sciChartPieSurface.legend.placement = ELegendPlacement.TopRight;
    sciChartPieSurface.legend.orientation = ELegendOrientation.Vertical;

    // Your data: one PieSegment per segment, with a value, a name and a colour
    for (const { text, value, color } of salesByRegion) {
        sciChartPieSurface.pieSegments.add(new PieSegment({ text, value, color }));
    }

    // Show the total in the hole, with an HTML element centred over the chart
    const total = salesByRegion.reduce((sum, region) => sum + region.value, 0);
    const centreLabel = document.createElement("div");
    centreLabel.style.cssText =
        "position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;" +
        "pointer-events:none; color:#ffffff; font-family:Arial, sans-serif; text-align:center;";
    centreLabel.innerHTML = `<div style="font-size:32px; font-weight:bold">£${(total / 1000).toFixed(1)}m</div>
        <div style="font-size:15px; opacity:0.8">total sales</div>`;
    sciChartPieSurface.domChartRoot.appendChild(centreLabel);
    // #region_A_end
}

donutChart("scichart-root");
