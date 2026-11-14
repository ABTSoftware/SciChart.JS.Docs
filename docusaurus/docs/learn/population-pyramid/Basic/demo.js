import * as SciChart from "scichart";

// Example data: the population of an imaginary country by five-year age group and sex, in thousands.
// These are illustrative numbers, not real statistics.
function getPopulationData() {
    const ageGroups = [
        "0–4", "5–9", "10–14", "15–19", "20–24", "25–29", "30–34", "35–39", "40–44",
        "45–49", "50–54", "55–59", "60–64", "65–69", "70–74", "75–79", "80–84", "85+"
    ];
    const male = [210, 225, 240, 250, 262, 275, 290, 300, 270, 312, 360, 372, 330, 280, 220, 150, 90, 50];
    const female = [200, 214, 228, 238, 252, 266, 284, 296, 268, 312, 362, 378, 342, 302, 252, 190, 135, 110];
    return { ageGroups, male, female };
}

async function populationPyramid(divElementId) {
    // #region_A_start
    // Create a JavaScript population pyramid with SciChart.js: two sets of horizontal bars, back to back
    const {
        SciChartSurface,
        NumericAxis,
        StackedColumnRenderableSeries,
        StackedColumnCollection,
        XyDataSeries,
        TextLabelProvider,
        BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy,
        EAxisAlignment,
        EAutoRange,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        ELegendPlacement,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        WaveAnimation
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Your data: one count per age group for each sex, youngest first
    const { ageGroups, male, female } = getPopulationData();
    const xValues = ageGroups.map((_, index) => index);

    // The age axis. On a vertical chart the X axis is drawn on the left, so the bars run sideways.
    // flippedCoordinates puts the youngest group at the bottom.
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            flippedCoordinates: true,
            axisTitle: "Age group",
            labelProvider: new TextLabelProvider({ labels: ageGroups }),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            growBy: new NumberRange(0.08, 0.02) // extra space at the bottom keeps the youngest bars clear of the chart's corner
        })
    );

    // Two value axes along the bottom: males on the left, females on the right.
    // On a vertical chart a value axis runs right to left, so the male bars grow leftwards from the centre;
    // the female axis is flipped so its bars grow to the right.
    // Both start at zero in the middle and are kept to the same scale, so equal bars mean equal numbers.
    const maleAxis = new NumericAxis(wasmContext, {
        id: "maleAxis",
        axisAlignment: EAxisAlignment.Bottom,
        axisTitle: "Male (thousands)",
        autoRange: EAutoRange.Never,
        labelPrecision: 0,
        drawMinorGridLines: false
    });
    const femaleAxis = new NumericAxis(wasmContext, {
        id: "femaleAxis",
        axisAlignment: EAxisAlignment.Bottom,
        flippedCoordinates: true,
        axisTitle: "Female (thousands)",
        autoRange: EAutoRange.Never,
        labelPrecision: 0,
        drawMinorGridLines: false
    });
    sciChartSurface.yAxes.add(maleAxis, femaleAxis);

    // Place the two value axes side by side instead of one under the other
    sciChartSurface.layoutManager.bottomOuterAxesLayoutStrategy =
        new BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy();

    // One shared scale for both sides: from 0 to just past the largest bar
    const largest = Math.max(...male, ...female);
    const fullRange = new NumberRange(0, largest * 1.1);
    maleAxis.visibleRange = fullRange;
    femaleAxis.visibleRange = fullRange;

    // When one side is zoomed, give the other side the same range, always starting at zero
    let syncing = false;
    const keepAxesInStep = (source, target) => {
        source.visibleRangeChanged.subscribe((args) => {
            if (syncing) return;
            syncing = true;
            const range = new NumberRange(0, args.visibleRange.max);
            source.visibleRange = range;
            target.visibleRange = range;
            syncing = false;
        });
    };
    keepAxesInStep(maleAxis, femaleAxis);
    keepAxesInStep(femaleAxis, maleAxis);

    // One bar series per sex. Colour carries meaning here: blue for males, orange for females.
    const maleBars = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: male, dataSeriesName: "Male" }),
        fill: "#50C7E0CC",
        stroke: "#50C7E0",
        strokeThickness: 1,
        stackedGroupId: "men"
    });
    const femaleBars = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: female, dataSeriesName: "Female" }),
        fill: "#F39C3FCC",
        stroke: "#F39C3F",
        strokeThickness: 1,
        stackedGroupId: "women"
    });

    // Each side is a StackedColumnCollection linked to its own value axis.
    // Add more series to a collection to split a side further, e.g. by region or nationality.
    const maleSide = new StackedColumnCollection(wasmContext, { yAxisId: "maleAxis", dataPointWidth: 0.9 });
    const femaleSide = new StackedColumnCollection(wasmContext, { yAxisId: "femaleAxis", dataPointWidth: 0.9 });
    maleSide.add(maleBars);
    femaleSide.add(femaleBars);
    maleSide.animation = new WaveAnimation({ duration: 1000 });
    femaleSide.animation = new WaveAnimation({ duration: 1000 });
    sciChartSurface.renderableSeries.add(maleSide, femaleSide);

    // Hover for values, a legend, zoom with the mouse wheel, pan by dragging, double-click to reset
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            // Tooltip: the age group, then the number of males and females in it
            tooltipDataTemplate: (seriesInfos) => {
                if (seriesInfos.length === 0) return [];
                const lines = [`Age ${ageGroups[Math.round(seriesInfos[0].xValue)]}`];
                seriesInfos.forEach((info) => lines.push(`${info.seriesName}: ${Math.round(info.yValue)} thousand`));
                return lines;
            }
        }),
        new LegendModifier({ placement: ELegendPlacement.TopLeft, showCheckboxes: false }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

populationPyramid("scichart-root");
