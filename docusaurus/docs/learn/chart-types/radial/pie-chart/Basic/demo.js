import * as SciChart from "scichart";

// An illustrative monthly household budget (£3,000 in total), so the chart needs no external data.
// Slices are ordered largest first, with "Other" last.
const budget = [
    { text: "Housing", value: 1200, color: "#50C7E0" },
    { text: "Food", value: 550, color: "#F48420" },
    { text: "Transport", value: 400, color: "#30BC9A" },
    { text: "Savings", value: 350, color: "#EC0F6C" },
    { text: "Other", value: 500, color: "#8E9BAE" }
];

async function pieChart(divElementId) {
    // #region_A_start
    // Create a JavaScript pie chart with SciChart.js
    const { SciChartPieSurface, EPieType, PieSegment, SciChartJsNavyTheme, ELegendPlacement, ELegendOrientation } =
        SciChart;
    // or, for npm, import { SciChartPieSurface, ... } from "scichart"

    const sciChartPieSurface = await SciChartPieSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        pieType: EPieType.Pie,
        animate: true,
        seriesSpacing: 2 // a small gap between slices
    });

    // Label each slice with its share of the total, rounded to a whole percentage
    sciChartPieSurface.labelStyle = { fontSize: 16, color: "#14233C" };
    sciChartPieSurface.labelProvider.getSegmentText = (segment, total) =>
        `${Math.round((100 * segment.value) / total)}%`;

    // A legend names each slice. Click a slice, or tick it in the legend, to pull it out
    sciChartPieSurface.legend.showLegend = true;
    sciChartPieSurface.legend.showCheckboxes = true;
    sciChartPieSurface.legend.placement = ELegendPlacement.TopRight;
    sciChartPieSurface.legend.orientation = ELegendOrientation.Vertical;

    // Your data: one PieSegment per slice, with a value, a name and a colour.
    // SciChart works out each slice's percentage from the values.
    for (const { text, value, color } of budget) {
        sciChartPieSurface.pieSegments.add(new PieSegment({ text, value, color }));
    }
    // #region_A_end
}

pieChart("scichart-root");
