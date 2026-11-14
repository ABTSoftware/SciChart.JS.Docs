import * as SciChart from "scichart";

// Generates made-up temperatures (°C) across a 40 cm × 30 cm metal plate, every 2 mm, with a
// seeded random generator, so the chart looks the same every time and needs no data feed.
// Two heaters warm the plate, and its right-hand edge is cooled by water.
function generatePlateTemperatures() {
    let seed = 7;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    // A smooth bump of height 1 centred on (cx, cy)
    const bump = (x, y, cx, cy, sx, sy) =>
        Math.exp(-((x - cx) * (x - cx)) / (2 * sx * sx) - ((y - cy) * (y - cy)) / (2 * sy * sy));
    // A few small, random warm and cool patches, so the plate isn't perfectly smooth
    const patches = [];
    for (let i = 0; i < 4; i++) {
        patches.push({ x: 4 + random() * 32, y: 4 + random() * 22, size: (random() - 0.5) * 6 });
    }
    // zValues[y][x]: one row for every 2 mm up the plate, one column for every 2 mm across it
    const zValues = [];
    for (let row = 0; row <= 150; row++) {
        const y = row * 0.2;
        const values = [];
        for (let col = 0; col <= 200; col++) {
            const x = col * 0.2;
            let t = 24; // room temperature
            t += 56 * bump(x, y, 11, 19, 4.5, 4); // the hotter heater, upper left
            t += 40 * bump(x, y, 27, 11, 6, 5); // the cooler, wider heater, lower right
            t -= 14 * Math.exp(-(40 - x) / 2); // the water-cooled right-hand edge
            for (const p of patches) t += p.size * bump(x, y, p.x, p.y, 3, 3);
            values.push(t);
        }
        zValues.push(values);
    }
    return zValues;
}

// The chart and its colour legend each need a div. This splits the page's div in two;
// in your app, they can simply be two divs in your HTML.
function createChartAndLegendDivs(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.display = "flex";
    // Give each div an id: SciChart tells its charts apart by their div's id
    const chartDiv = document.createElement("div");
    chartDiv.id = divElementId + "-chart";
    chartDiv.style.flex = "1";
    chartDiv.style.height = "100%";
    const legendDiv = document.createElement("div");
    legendDiv.id = divElementId + "-legend";
    legendDiv.style.width = "90px";
    legendDiv.style.height = "100%";
    root.append(chartDiv, legendDiv);
    return { chartDiv, legendDiv };
}

async function contourPlot(divElementId) {
    const { chartDiv, legendDiv } = createChartAndLegendDivs(divElementId);

    // #region_A_start
    // Create a JavaScript contour plot with SciChart.js
    const {
        SciChartSurface,
        HeatmapLegend,
        NumericAxis,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        UniformContoursRenderableSeries,
        HeatmapColorMap,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(chartDiv, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { axisTitle: "Across the plate (cm)", drawMinorGridLines: false })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { axisTitle: "Up the plate (cm)", drawMinorGridLines: false })
    );

    // Your data: a 2D array of values on a regular grid, zValues[row][column]
    const zValues = generatePlateTemperatures();
    // One data series feeds both the coloured background and the contour lines
    const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
        zValues,
        xStart: 0, // the first column is at 0 cm
        xStep: 0.2, // each column is 2 mm to the right of the last
        yStart: 0,
        yStep: 0.2
    });

    // Colour shows the value: 10 °C is dark purple, 90 °C is pale yellow
    const colorMap = new HeatmapColorMap({
        minimum: 10,
        maximum: 90,
        gradientStops: [
            { offset: 0, color: "#000004" },
            { offset: 0.25, color: "#51127C" },
            { offset: 0.5, color: "#B63679" },
            { offset: 0.75, color: "#FB8861" },
            { offset: 1, color: "#FCFDBF" }
        ]
    });
    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, { dataSeries, colorMap });
    sciChartSurface.renderableSeries.add(heatmapSeries);

    // Contour lines join points of equal temperature: a labelled line every 10 °C,
    // and a fainter line halfway between, at every 5 °C
    sciChartSurface.renderableSeries.add(
        new UniformContoursRenderableSeries(wasmContext, {
            dataSeries,
            zMin: 10,
            zMax: 90,
            zStep: 10,
            minorsPerMajor: 1,
            majorLineStyle: { color: "#FFFFFF", strokeThickness: 2 },
            minorLineStyle: { color: "#FFFFFF88", strokeThickness: 1 },
            dataLabels: { style: { fontSize: 14 }, color: "#FFFFFF", labelRowCount: 3, precision: 0 }
        })
    );

    // A colour legend, so readers can turn a colour back into a value
    await HeatmapLegend.create(legendDiv, {
        theme: new SciChartJsNavyTheme(),
        colorMap,
        yAxisOptions: { axisTitle: "°C" }
    });

    // Zoom with the mouse wheel, pan by dragging, double-click to reset, and hover to read a value
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            includedSeriesIds: [heatmapSeries.id],
            // Show the hovered point as e.g. "x 12.4 cm, y 18.0 cm: 79.6 °C"
            tooltipDataTemplate: (seriesInfos) =>
                seriesInfos
                    .filter((info) => info.isHit)
                    .map((info) => {
                        // Look up the grid point nearest the mouse
                        const col = Math.round(info.xValue / 0.2);
                        const row = Math.round(info.yValue / 0.2);
                        return `x ${(col * 0.2).toFixed(1)} cm, y ${(row * 0.2).toFixed(1)} cm: ${zValues[row][col].toFixed(1)} °C`;
                    })
        }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

contourPlot("scichart-root");
