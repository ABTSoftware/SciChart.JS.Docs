import * as SciChart from "scichart";

// Example data: one value per category, sorted from largest to smallest so the bars are easy to rank.
// These are illustrative numbers, not real statistics.
function getCategoryData() {
    const categories = ["Laptops", "Phones", "Monitors", "Tablets", "Headphones", "Keyboards", "Webcams", "Speakers"];
    const unitsSold = [482, 415, 338, 296, 241, 187, 132, 96];
    return { categories, unitsSold };
}

async function barChart(divElementId) {
    // #region_A_start
    // Create a JavaScript bar chart (horizontal bars) with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastColumnRenderableSeries,
        XyDataSeries,
        TextLabelProvider,
        EAxisAlignment,
        EColumnDataLabelPosition,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        GradientParams,
        Point,
        PaletteFactory,
        WaveAnimation
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Your data: one category name and one value per bar
    const { categories, unitsSold } = getCategoryData();

    // The category (X) axis goes on the left, which turns columns into horizontal bars.
    // A TextLabelProvider shows a category name at x = 0, 1, 2, ...
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            labelProvider: new TextLabelProvider({ labels: categories }),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            growBy: new NumberRange(0.05, 0.25) // extra space below the last bar keeps it clear of the chart's bottom corner
        })
    );
    // The value (Y) axis goes along the top. flippedCoordinates makes values grow left to right
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Top,
            flippedCoordinates: true,
            axisTitle: "Units sold",
            labelPrecision: 0,
            growBy: new NumberRange(0, 0.1)
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: categories.map((_, index) => index),
                yValues: unitsSold,
                dataSeriesName: "Units sold"
            }),
            fill: "#E4F5FC77",
            stroke: "#E4F5FC",
            strokeThickness: 2,
            dataPointWidth: 0.7,
            cornerRadius: 8,
            // Colour each bar by its position: orange, through sky blue, to teal
            paletteProvider: PaletteFactory.createGradient(
                wasmContext,
                new GradientParams(new Point(0, 0), new Point(1, 1), [
                    { offset: 0, color: "#F48420" },
                    { offset: 0.67, color: "#50C7E0" },
                    { offset: 1, color: "#30BC9A" }
                ]),
                { enableFill: true }
            ),
            // Bars grow in a wave when the chart first appears
            animation: new WaveAnimation({ duration: 1000 }),
            // Show each bar's value at its end
            dataLabels: {
                color: "#ffffff",
                style: { fontSize: 18, fontFamily: "Arial" },
                precision: 0,
                positionMode: EColumnDataLabelPosition.Outside
            }
        })
    );

    // Zoom with the mouse wheel, pan by dragging, double-click to reset, and hover for values
    sciChartSurface.chartModifiers.add(
        new CursorModifier({ showTooltip: true }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

barChart("scichart-root");
