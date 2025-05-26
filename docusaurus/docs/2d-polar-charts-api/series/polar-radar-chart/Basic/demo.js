import * as SciChart from "scichart";

async function simpleRadarChart (rootElement) {
    // #region_A_start
    const {
        SciChartPolarSurface,
        EThemeProviderType,
        PolarNumericAxis,
        PolarCategoryAxis,
        PolarMountainRenderableSeries,
        EPolarAxisMode,
        EPolarGridlineMode,
        EPolarLabelMode,
        XyDataSeries,
        ENumericFormat
    } = SciChart;
    // or for npm import { SciChartPolarSurface, ... } from "scichart"
    
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: { type: EThemeProviderType.Navy }
    });

    const LABELS = [ // labels to be set on the category axis
        "Offense",
        "Shooting",
        "Defense",
        "Rebounds",
        "Passing",
        "Depth"
    ];

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        gridlineMode: EPolarGridlineMode.Polygons, // this creates the radar chart look
        startAngle: Math.PI / 2, // start at 12 o'clock
        zoomExtentsToInitialRange: true,
        innerRadius: 0, // no donut hole
        drawLabels: true, // set to false if you want to hide numerical (radial) labels
        
        useNativeText: true,
        labelPrecision: 0,
        labelStyle: {
            color: "white",
            fontSize: 16,
        },
        majorGridLineStyle: {
            color: "#88888844",
            strokeThickness: 1,
        },
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
    });
    sciChartSurface.yAxes.add(radialYAxis); 

    const angularXAxis = new PolarCategoryAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        labels: LABELS,
        labelStyle: {
            fontSize: 16,
            color: "white",
        },
        majorGridLineStyle: {
            color: "#88888844",
            strokeThickness: 1,
        },
        flippedCoordinates: true, // go clockwise
        drawMinorGridLines: false,
        useNativeText: true,
        polarLabelMode: EPolarLabelMode.Horizontal,
        labelFormat: ENumericFormat.NoFormat,
        startAngle: Math.PI / 2, // start at 12 o'clock
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const xValues = [0, 1, 2, 3, 4, 5];
    const yValues = [9, 10, 7, 5, 8, 6] // values for:  "Offense", "Shooting", "Defense", "Rebounds", "Passing", "Depth"
    
    // Radar / Spider Charts may also work with `PolarLineRenderableSeries`
    const polarMountain = new PolarMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [...xValues, xValues[xValues.length] + 1], // + 1 to close the loop
            yValues: [...yValues, yValues[0]], // re-plot first point to close the loop
            dataSeriesName: "Golden State Warriors",
        }),
        stroke: "#FFC72C", // Golden State Warriors gold
        fill: "#1D428A" + "80", // Golden State Warriors blue with 50% opacity
        strokeThickness: 4,
    });
    sciChartSurface.renderableSeries.add(polarMountain);
};

simpleRadarChart("scichart-root");
// #region_A_end

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a Column chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"
    await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: [
            {
                polarAxisMode: EPolarAxisMode.Angular,
                axisAlignment: EAxisAlignment.Top,
                visibleRange: new NumberRange(0, 12),
                useNativeText: true,
                drawMajorGridLines: true,
                drawMajorTickLines: false,
                drawMinorTickLines: false,
                drawMinorGridLines: false,
                autoTicks: false,
                majorDelta: 1,
                polarLabelMode: EPolarLabelMode.Parallel
            }
        ],
        yAxes: [
            {
                axisAlignment: EAxisAlignment.Right,
                polarAxisMode: EPolarAxisMode.Radial,
                visibleRange: new NumberRange(0, 8),
                useNativeText: true,
                autoTicks: false,
                majorDelta: 1,
                drawMajorGridLines: true,
                drawMajorTickLines: false,
                drawMajorTickLines: false,
                labelPrecision: 0,
                majorGridLineStyle: { strokeThickness: 1, color: "#666666" }
            }
        ],
        series: [
            {
                type: ESeriesType.PolarMountainRenderableSeries,
                xyyData: {
                    xValues: [0, 1, 2, 3, 4, 5],
                    yValues: [9, 10, 7, 5, 8, 6]
                },
                options: {
                    stroke: "#FFC72C", // Golden State Warriors gold
                    fill: "#1D428A" + "80", // Golden State Warriors blue with 50% opacity
                    strokeThickness: 4,
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
