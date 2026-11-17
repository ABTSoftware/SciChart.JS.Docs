import * as SciChart from "scichart";

// Generates made-up temperatures (°C) across a 40 cm × 30 cm metal plate, every 5 mm, with a
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
    // values[row][column]: one row for every 5 mm up the plate, one column for every 5 mm across it
    const values = [];
    for (let row = 0; row <= 60; row++) {
        const y = row * 0.5;
        const rowValues = [];
        for (let col = 0; col <= 80; col++) {
            const x = col * 0.5;
            let t = 24; // room temperature
            t += 56 * bump(x, y, 11, 19, 4.5, 4); // the hotter heater, upper left
            t += 40 * bump(x, y, 27, 11, 6, 5); // the cooler, wider heater, lower right
            t -= 14 * Math.exp(-(40 - x) / 2); // the water-cooled right-hand edge
            for (const p of patches) t += p.size * bump(x, y, p.x, p.y, 3, 3);
            rowValues.push(t);
        }
        values.push(rowValues);
    }
    return values;
}

async function surfacePlot(divElementId) {
    // #region_A_start
    // Create a JavaScript 3D surface plot with SciChart.js
    const {
        SciChart3DSurface,
        NumericAxis3D,
        NumberRange,
        Vector3,
        UniformGridDataSeries3D,
        SurfaceMeshRenderableSeries3D,
        GradientColorPalette,
        EDrawMeshAs,
        SciChartJsNavyTheme,
        OrbitModifier3D,
        MouseWheelZoomModifier3D,
        ResetCamera3DModifier,
        TooltipModifier3D
    } = SciChart;
    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        // The size of the 3D box (width, height, depth), in the chart's own units
        worldDimensions: new Vector3(400, 200, 300),
        // Where the camera stands, and the point it looks at
        cameraOptions: { position: new Vector3(-270, 290, -360), target: new Vector3(0, 30, 0) }
    });

    // In SciChart.js 3D, Y is the vertical axis: here, the temperature.
    // X and Z are the two directions across the plate.
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "Across (cm)", labelPrecision: 0 });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Temperature (°C)",
        labelPrecision: 0,
        visibleRange: new NumberRange(0, 90)
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Up the plate (cm)", labelPrecision: 0 });

    // Your data: a 2D array of heights on a regular grid, values[zIndex][xIndex]
    const values = generatePlateTemperatures();
    const dataSeries = new UniformGridDataSeries3D(wasmContext, {
        yValues: values,
        xStart: 0, // the first column is at 0 cm
        xStep: 0.5, // each column is 5 mm further across
        zStart: 0,
        zStep: 0.5, // each row is 5 mm further up the plate
        dataSeriesName: "Plate temperature"
    });

    // Colour repeats the height, so high and low stand out from any angle:
    // 10 °C is dark purple, 90 °C is pale yellow
    const colorPalette = new GradientColorPalette(wasmContext, {
        gradientStops: [
            { offset: 0, color: "#000004" },
            { offset: 0.25, color: "#51127C" },
            { offset: 0.5, color: "#B63679" },
            { offset: 0.75, color: "#FB8861" },
            { offset: 1, color: "#FCFDBF" }
        ]
    });

    sciChart3DSurface.renderableSeries.add(
        new SurfaceMeshRenderableSeries3D(wasmContext, {
            dataSeries,
            meshColorPalette: colorPalette,
            minimum: 10, // the value at the bottom of the colour scale
            maximum: 90, // the value at the top
            // Draw a solid surface with a contour line every 10 °C
            drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS,
            contourInterval: 10,
            contourOffset: 0,
            contourStroke: "#FFFFFF",
            contourStrokeThickness: 2,
            drawSkirt: false,
            // No lighting or shading, so each colour always means the same temperature;
            // the contour lines show the shape instead
            lightingFactor: 0
        })
    );

    // Drag to rotate, scroll to zoom, double-click to reset, and hover to read a value
    sciChart3DSurface.chartModifiers.add(
        new OrbitModifier3D(),
        new MouseWheelZoomModifier3D(),
        new ResetCamera3DModifier(),
        new TooltipModifier3D({
            // Show the point under the mouse as e.g. "Across 11.0 cm, up 19.0 cm" and "81.2 °C"
            tooltipDataTemplate: (seriesInfo) => {
                if (!seriesInfo || !seriesInfo.isHit) return [];
                return [
                    `Across ${seriesInfo.xValue.toFixed(1)} cm, up ${seriesInfo.zValue.toFixed(1)} cm`,
                    `${seriesInfo.yValue.toFixed(1)} °C`
                ];
            }
        })
    );
    // #region_A_end
}

surfacePlot("scichart-root");
