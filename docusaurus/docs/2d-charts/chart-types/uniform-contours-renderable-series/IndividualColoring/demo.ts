import * as SciChart from "scichart";

// Generates a radial bowl, z = distance from the centre, so the contour lines are concentric rings
function generateExampleData(width: number, height: number) {
    const { zeroArray2D } = SciChart;
    // or, import { zeroArray2D } from "scichart";

    const zValues = zeroArray2D([height, width]);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const dx = x - width / 2;
            const dy = y - height / 2;
            zValues[y][x] = Math.sqrt(dx * dx + dy * dy);
        }
    }
    return zValues;
}

async function individuallyColoredContours(divElementId: string) {
    // #region_A_start
    // Demonstrates how to colour each contour line by its own z-value
    const {
        SciChartSurface,
        NumericAxis,
        HeatmapColorMap,
        UniformHeatmapDataSeries,
        UniformContoursRenderableSeries,
        EContourColorMapMode,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create a Heatmap Data-series. zValues are heatValues as a 2D array (number[][])
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        zValues: generateExampleData(300, 200),
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1
    });

    const contourSeries = new UniformContoursRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        // Draw a contour line every 20 z-values, from 20 up to the data maximum
        zMin: 20,
        zStep: 20,
        strokeThickness: 3,
        // New in v6: colour every contour line individually, by its own z-value ...
        colorMapMode: EContourColorMapMode.GradientColors,
        // ... reading the colour out of this colorMap, exactly as a heatmap would
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 180,
            gradientStops: [
                { offset: 0, color: "#264B93" },
                { offset: 0.35, color: "#50C7E0" },
                { offset: 0.6, color: "#67BDAF" },
                { offset: 0.8, color: "#F48420" },
                { offset: 1, color: "#EC0F6C" }
            ]
        }),
        // Label each line with its z-value, so you can read which value each colour stands for
        dataLabels: {
            style: { fontSize: 12 },
            color: "#FFFFFF",
            labelRowCount: 2,
            precision: 0
        }
    });

    sciChartSurface.renderableSeries.add(contourSeries);
    // #region_A_end

    // Add zooming, panning for the example
    const { ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
}

individuallyColoredContours("scichart-root");
