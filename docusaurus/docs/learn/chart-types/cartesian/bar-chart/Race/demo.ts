import * as SciChart from "scichart";

// Population by country, in millions, for every year from 1960 to 2024: the 14 countries that were in the
// world's top 10 in at least one of those years.
// Source: World Bank, World Development Indicators, "Population, total" (SP.POP.TOTL), retrieved November 2026.
// Countries are shown within their present-day borders.
function getPopulationData() {
    const firstYear = 1960;
    const countries = [
        { name: "India", region: "Asia", values: [436, 446.6, 457.3, 468.1, 479.2, 490.1, 500.7, 511.6, 522.7, 533.9, 545.9, 558.1, 570.5, 583.5, 597, 611.3, 625.9, 640.8, 655.7, 671.2, 687.4, 703.7, 720.3, 737.4, 754.9, 772.6, 790.7, 808.9, 827.3, 846, 865, 883.9, 903, 922.1, 941.2, 960.3, 979.7, 999.1, 1018.7, 1038.2, 1057.9, 1077.9, 1097.6, 1116.8, 1136, 1154.7, 1172.9, 1190.7, 1207.9, 1225.5, 1243.5, 1261.2, 1278.7, 1295.8, 1312.3, 1328, 1343.9, 1359.7, 1374.7, 1389, 1402.6, 1414.2, 1425.4, 1438.1, 1450.9] },
        { name: "China", region: "Asia", values: [667.1, 660.3, 665.8, 682.3, 698.4, 715.2, 735.4, 754.5, 774.5, 796, 818.3, 841.1, 862, 881.9, 900.4, 916.4, 930.7, 943.5, 956.2, 969, 981.2, 993.9, 1008.6, 1023.3, 1036.8, 1051, 1066.8, 1084, 1101.6, 1118.7, 1135.2, 1150.8, 1165, 1178.4, 1191.8, 1204.9, 1217.5, 1230.1, 1241.9, 1252.7, 1262.6, 1271.8, 1280.4, 1288.4, 1296.1, 1303.7, 1311, 1317.9, 1324.7, 1331.3, 1337.7, 1345, 1354.2, 1363.2, 1371.9, 1379.9, 1387.8, 1396.2, 1402.8, 1407.7, 1411.1, 1412.4, 1412.2, 1410.7, 1409] },
        { name: "United States", region: "Americas", values: [180.7, 183.7, 186.5, 189.2, 191.9, 194.3, 196.6, 198.7, 200.7, 202.7, 205.1, 207.7, 209.9, 211.9, 213.9, 216, 218, 220.2, 222.6, 225.1, 227.2, 229.5, 231.7, 233.8, 235.8, 237.9, 240.1, 242.3, 244.5, 246.8, 249.6, 253, 256.5, 259.9, 263.1, 266.3, 269.4, 272.7, 275.9, 279, 282.2, 285, 287.6, 290.1, 292.8, 295.5, 298.4, 301.2, 304.1, 306.8, 309.4, 311.8, 314.3, 316.7, 319.3, 321.8, 324.4, 326.6, 328.5, 330.2, 331.6, 332.1, 334, 336.8, 340] },
        { name: "Indonesia", region: "Asia", values: [88.3, 90.8, 93.4, 96.1, 98.8, 101.4, 103.8, 106.5, 109.5, 112.5, 115.7, 118.8, 122, 125.3, 128.6, 131.8, 135.2, 138.5, 142, 145.4, 149, 152.5, 156.1, 159.7, 163.3, 166.8, 170.2, 173.5, 176.9, 180.2, 183.5, 186.8, 190, 193.3, 196.6, 199.9, 203.2, 206.5, 209.8, 213, 216.1, 219.1, 222.1, 225, 227.9, 230.9, 234, 237.1, 240.2, 243.2, 246.3, 249.5, 252.7, 255.9, 258.9, 261.8, 264.6, 267.3, 270, 272.5, 274.8, 276.8, 278.8, 281.2, 283.5] },
        { name: "Pakistan", region: "Asia", values: [45.7, 46.9, 48.2, 49.4, 50.8, 52.2, 53.7, 55.2, 56.8, 58.5, 60.2, 61.8, 63.6, 65.5, 67.4, 69.5, 71.6, 73.9, 76.3, 79, 82.3, 85.8, 89.1, 92.2, 95.2, 98.2, 101.6, 105.1, 108.7, 112.3, 116.2, 120.1, 123.5, 127, 130.7, 134.6, 138.6, 142.5, 146.5, 150.6, 154.9, 159.3, 163.2, 167.1, 171.3, 175.5, 179.7, 184.5, 189.5, 194.4, 199.2, 203.7, 207.7, 211.1, 214.3, 217.3, 220.1, 223.3, 226.9, 230.8, 235, 239.5, 243.7, 247.5, 251.3] },
        { name: "Nigeria", region: "Africa", values: [45.1, 46, 47, 48, 49, 50.1, 51.2, 52.3, 53.4, 54.6, 55.9, 57.2, 58.6, 60.1, 61.7, 63.4, 65.3, 67.2, 69.3, 71.5, 73.8, 76.1, 78.4, 80.4, 82.5, 84.9, 87.2, 89.6, 92, 94.5, 97.1, 99.7, 102.4, 105.1, 107.9, 110.8, 113.8, 116.8, 119.8, 123, 126.4, 129.9, 133.5, 137.2, 141.1, 145, 149.1, 153.3, 157.6, 162, 166.6, 171.4, 176.2, 181, 185.9, 190.7, 195.4, 200.3, 204.9, 209.5, 214, 218.5, 223.2, 227.9, 232.7] },
        { name: "Brazil", region: "Americas", values: [72.4, 74.6, 76.9, 79.2, 81.5, 83.8, 86.1, 88.4, 90.7, 93, 95.4, 97.7, 100.1, 102.6, 105.1, 107.6, 110.2, 112.9, 115.6, 118.4, 121.2, 124.1, 126.9, 129.8, 132.7, 135.5, 138.3, 141.1, 143.8, 146.5, 149.1, 151.7, 154.3, 156.8, 159.3, 161.7, 164.2, 166.7, 169.2, 171.6, 174, 176.3, 178.5, 180.6, 182.7, 184.7, 186.7, 188.6, 190.4, 192.1, 193.7, 195.3, 196.9, 198.5, 200.1, 201.7, 203.2, 204.7, 206.1, 207.5, 208.7, 209.6, 210.3, 211.1, 212] },
        { name: "Bangladesh", region: "Asia", values: [51.8, 53.3, 54.9, 56.5, 58.2, 59.9, 61.7, 63.5, 65.4, 67.3, 69.1, 70.3, 71.6, 73.7, 75.8, 77.9, 79.9, 81.9, 83.9, 85.9, 88, 90.3, 92.8, 95.3, 97.8, 100.3, 102.6, 105, 107.2, 109.4, 111.6, 113.8, 116, 118.1, 120.3, 122.6, 124.9, 127.2, 129.6, 132.1, 134.5, 136.8, 138.9, 141, 142.9, 144.7, 146.4, 148, 149.5, 150.9, 152.2, 153.6, 155.1, 156.5, 158, 159.4, 160.8, 162.2, 163.5, 164.9, 166.3, 167.7, 169.4, 171.5, 173.6] },
        { name: "Russia", region: "Europe", values: [119.9, 121.2, 122.6, 124, 125.3, 126.7, 127.5, 128.2, 128.9, 129.7, 130.4, 131.2, 131.9, 132.7, 133.4, 134.2, 135.1, 136.1, 137.1, 138, 139, 139.9, 140.8, 141.7, 142.7, 143.9, 144.9, 145.9, 146.9, 147.7, 148, 148.4, 148.5, 148.5, 148.4, 148.4, 148.2, 147.9, 147.7, 147.2, 146.6, 146, 145.3, 144.6, 144.1, 143.5, 143, 142.8, 142.7, 142.8, 142.8, 143, 143.4, 143.8, 144.2, 144.6, 145, 145.3, 145.4, 145.5, 145.2, 144.7, 144.2, 143.8, 143.7] },
        { name: "Ethiopia", region: "Africa", values: [21.4, 21.9, 22.5, 23.1, 23.7, 24.3, 25, 25.6, 26.3, 27.1, 27.8, 28.6, 29.4, 30.2, 31, 31.7, 32.5, 33.2, 33.7, 34.2, 34.4, 35.3, 36.7, 37.7, 38.7, 39.8, 41, 42.5, 44.2, 45.9, 47.6, 49.7, 51.9, 53.7, 55.6, 57.5, 59.5, 61.4, 63.4, 65.4, 67.4, 69.5, 71.6, 73.8, 76.1, 78.4, 80.7, 83.1, 85.5, 88, 90.5, 93.1, 95.8, 98.4, 101.1, 103.9, 106.7, 109.7, 112.7, 115.7, 118.9, 122.1, 125.4, 128.7, 132.1] },
        { name: "Mexico", region: "Americas", values: [36.7, 37.9, 39.1, 40.4, 41.8, 43.2, 44.6, 46.1, 47.7, 49.2, 50.8, 52.4, 54, 55.7, 57.3, 59, 60.6, 62.3, 64, 65.6, 67.3, 68.9, 70.4, 72, 73.5, 75, 76.6, 78.1, 79.7, 81.2, 82.8, 84.4, 86, 87.7, 89.3, 90.9, 92.5, 94, 95.6, 97.1, 98.6, 100.1, 101.5, 103, 104.4, 105.8, 107.3, 108.8, 110.4, 112, 113.6, 115.2, 116.8, 118.3, 119.8, 121.1, 122.3, 123.4, 124.6, 125.8, 126.8, 127.6, 128.6, 129.7, 130.9] },
        { name: "Japan", region: "Asia", values: [93.2, 94.1, 94.9, 95.9, 96.9, 98, 98.9, 99.9, 101, 102.2, 103.4, 105.7, 107.2, 108.7, 110.2, 111.6, 112.8, 113.9, 114.9, 115.9, 116.8, 117.7, 118.5, 119.3, 120.1, 120.8, 121.5, 122.1, 122.6, 123.1, 123.5, 124, 124.4, 124.8, 125.2, 125.5, 125.8, 126.1, 126.4, 126.6, 126.8, 127.1, 127.4, 127.7, 127.8, 127.8, 127.9, 128, 128.1, 128, 128.1, 127.8, 127.6, 127.4, 127.3, 127.1, 127.1, 127, 126.8, 126.6, 126.3, 125.7, 125.1, 124.5, 124] },
        { name: "Germany", region: "Europe", values: [72.8, 73.4, 74, 74.7, 75.3, 76, 76.6, 77, 77.3, 77.9, 78.2, 78.3, 78.7, 78.9, 79, 78.7, 78.3, 78.2, 78.1, 78.1, 78.3, 78.4, 78.3, 78.1, 77.9, 77.7, 77.7, 77.8, 78.1, 78.8, 79.4, 80, 80.6, 81.2, 81.4, 81.7, 81.9, 82, 82, 82.1, 82.2, 82.3, 82.5, 82.5, 82.5, 82.5, 82.4, 82.3, 82.1, 81.9, 81.8, 80.3, 80.4, 80.6, 81, 81.7, 82.3, 82.7, 82.9, 83.1, 83.2, 83.2, 83.2, 83.3, 83.5] },
        { name: "United Kingdom", region: "Europe", values: [52.4, 52.8, 53.2, 53.6, 54, 54.3, 54.6, 54.9, 55.2, 55.4, 55.7, 55.9, 56.1, 56.2, 56.2, 56.2, 56.2, 56.2, 56.2, 56.2, 56.3, 56.3, 56.3, 56.3, 56.4, 56.6, 56.7, 56.8, 56.9, 57.1, 57.2, 57.4, 57.6, 57.7, 57.9, 58, 58.2, 58.3, 58.5, 58.7, 58.9, 59.1, 59.4, 59.6, 60, 60.4, 60.8, 61.3, 61.8, 62.3, 62.8, 63.3, 63.7, 64.1, 64.6, 65.1, 65.6, 66, 66.3, 66.6, 66.7, 67, 67.6, 68.5, 69.3] },
    ];
    const years = countries[0].values.map((_, index) => firstYear + index);
    return { years, countries };
}

async function barChartRace(divElementId) {
    // #region_A_start
    // Create a JavaScript bar chart race with SciChart.js: horizontal bars that re-sort as the years go by
    const {
        SciChartSurface,
        NumericAxis,
        FastColumnRenderableSeries,
        XyDataSeries,
        EAxisAlignment,
        EAutoRange,
        EDataPointWidthMode,
        EColumnDataLabelPosition,
        NumberRange,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        LegendModifier,
        ELegendPlacement,
        CursorModifier,
        CustomChartModifier2D,
        translateFromCanvasToSeriesViewRect,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Your data: one list of values per item, one value per time step
    const { years, countries } = getPopulationData();
    const SHOWN = 10; // how many bars are on screen
    const SECONDS_PER_YEAR = 0.4;
    const regionColors = { Asia: "#50C7E0", Americas: "#F48420", Europe: "#AE418D", Africa: "#67BDAF" };

    // The rank axis goes on the left, which turns columns into horizontal bars. Rank 1 is at the top.
    // The range runs past rank 10, so the last bar sits clear of the chart's bottom corner
    const rankAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        axisTitle: "Rank",
        visibleRange: new NumberRange(0.4, SHOWN + 1.7),
        autoRange: EAutoRange.Never,
        autoTicks: false,
        majorDelta: 1,
        minorDelta: 1,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorBands: false
    });
    rankAxis.labelProvider.formatLabel = (rank) => (rank >= 1 && rank <= SHOWN ? rank.toFixed(0) : "");
    sciChartSurface.xAxes.add(rankAxis);

    // The value axis goes along the top and rescales every frame to fit the leader
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Top,
            flippedCoordinates: true,
            axisTitle: "Population (millions)",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0, 0.3), // room for the labels at the end of the bars
            labelPrecision: 0
        })
    );

    // One series per region, so each region has one colour and one legend entry
    const regions = Object.keys(regionColors).map((region) => {
        const dataSeries = new XyDataSeries(wasmContext, { dataSeriesName: region });
        sciChartSurface.renderableSeries.add(
            new FastColumnRenderableSeries(wasmContext, {
                dataSeries,
                fill: regionColors[region] + "CC",
                stroke: regionColors[region],
                strokeThickness: 2,
                cornerRadius: 8,
                // Bars move between ranks, so give them a fixed thickness in rank units
                dataPointWidthMode: EDataPointWidthMode.Range,
                dataPointWidth: 0.75,
                // The label at the end of each bar comes from the point's metadata
                dataLabels: {
                    metaDataSelector: (metadata) => metadata["label"],
                    color: "#ffffff",
                    style: { fontSize: 16, fontFamily: "Arial" },
                    positionMode: EColumnDataLabelPosition.Outside
                }
            })
        );
        return { region, dataSeries };
    });

    // The year, in large type at the right
    const yearLabel = new TextAnnotation({
        text: String(years[0]),
        fontSize: 64,
        fontWeight: "bold",
        textColor: "#FFFFFF66",
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0.97,
        y1: 0.7,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom
    });
    sciChartSurface.annotations.add(yearLabel);

    // Each bar's current value, and its position on the rank axis. The position eases towards
    // the bar's rank, so bars glide past each other instead of jumping
    const bars = countries.map((country, index) => ({ ...country, value: country.values[0], position: index + 1 }));

    // Draws one frame at time t, measured in years since the first year (t = 2.5 is halfway through year 3)
    const drawFrame = (t, ease) => {
        const index = Math.min(Math.floor(t), years.length - 1);
        const next = Math.min(index + 1, years.length - 1);
        const fraction = t - index;
        bars.forEach((bar) => {
            bar.value = bar.values[index] + (bar.values[next] - bar.values[index]) * fraction;
        });
        // Rank this frame's values; bars below the top 10 move off the bottom of the chart
        [...bars]
            .sort((a, b) => b.value - a.value)
            .forEach((bar, rank) => {
                const target = rank < SHOWN ? rank + 1 : SHOWN + 3;
                bar.position += (target - bar.position) * ease;
            });
        regions.forEach(({ region, dataSeries }) => {
            // Each series' x values must be in order, so sort its bars by position
            const shown = bars.filter((bar) => bar.region === region).sort((a, b) => a.position - b.position);
            dataSeries.clear();
            dataSeries.appendRange(
                shown.map((bar) => bar.position),
                shown.map((bar) => bar.value),
                shown.map((bar) => ({
                    isSelected: false,
                    label: `${bar.name}  ${Math.round(bar.value).toLocaleString("en-US")}m`
                }))
            );
        });
        yearLabel.text = String(years[index]);
    };

    // The animation loop: about 0.4 seconds per year, a pause at the end, then it starts again
    let t = 0;
    let paused = false;
    let lastTime = performance.now();
    const lastT = years.length - 1;
    const frame = (now) => {
        if (sciChartSurface.isDeleted) return; // stop when the chart is removed
        const seconds = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        if (!paused) {
            t += seconds / SECONDS_PER_YEAR;
            if (t > lastT + 3 / SECONDS_PER_YEAR) t = 0; // hold the last year for 3 seconds, then start again
            drawFrame(Math.min(t, lastT), Math.min(1, seconds * 8));
        }
        requestAnimationFrame(frame);
    };
    drawFrame(0, 1);
    requestAnimationFrame(frame);

    // Click the chart to pause or resume. It also tracks which rank the mouse is over, for the tooltip
    let hoveredRank = NaN;
    class RaceModifier extends CustomChartModifier2D {
        modifierMouseUp(args) {
            super.modifierMouseUp(args);
            paused = !paused;
            if (paused) {
                // Snap to the nearest whole year, so the bars and labels show real data, not in-between frames
                t = Math.round(Math.min(t, lastT));
                drawFrame(t, 1);
            }
        }
        modifierMouseMove(args) {
            super.modifierMouseMove(args);
            const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            hoveredRank = point ? rankAxis.getCurrentCoordinateCalculator().getDataValue(point.y) : NaN;
        }
        modifierMouseLeave(args) {
            super.modifierMouseLeave(args);
            hoveredRank = NaN;
        }
    }

    sciChartSurface.chartModifiers.add(
        new RaceModifier(),
        new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.BottomRight }),
        // Hover over a bar's row to see its exact value
        new CursorModifier({
            showTooltip: true,
            showXLine: false,
            showYLine: false,
            tooltipDataTemplate: () => {
                const bar = bars.find((b) => Math.abs(b.position - hoveredRank) < 0.4);
                return bar ? [bar.name, `${yearLabel.text}: ${bar.value.toFixed(1)} million`] : [];
            }
        })
    );
    // #region_A_end
}

barChartRace("scichart-root");
