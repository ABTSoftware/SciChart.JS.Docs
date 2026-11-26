import * as SciChart from "scichart";

// #region_A_start
// A 3D population density map with SciChart.js: one column per 40 km square, as tall as its population density,
// standing on the state borders
const {
    SciChart3DSurface,
    NumericAxis3D,
    NumberRange,
    Vector3,
    XyzDataSeries3D,
    ColumnRenderableSeries3D,
    CubePointMarker3D,
    PointLineRenderableSeries3D,
    OrbitModifier3D,
    MouseWheelZoomModifier3D,
    ResetCamera3DModifier,
    TooltipModifier3D,
    parseColorToUIntArgb,
    SciChartJsNavyTheme
} = SciChart;
// or, for npm, import { SciChart3DSurface, ... } from "scichart"

// The same classes and colours as the 2D choropleth, so the colour repeats what the height shows
const DENSITY_CLASSES = [
    { label: "Under 10", max: 10, color: "#46327E" },
    { label: "10 to 50", max: 50, color: "#365C8D" },
    { label: "50 to 250", max: 250, color: "#1F9A8A" },
    { label: "250 to 1,000", max: 1000, color: "#6CCE59" },
    { label: "1,000 and over", max: Infinity, color: "#FDE725" }
];

// Decode one outline from the encoded polyline format: each number is the change from the previous point,
// in whole kilometres, written in 5-bit chunks as characters (the same idea as Google's polyline encoding)
function decodeOutline(encoded) {
    const points = [];
    let index = 0;
    let x = 0;
    let y = 0;
    const nextNumber = () => {
        let result = 0;
        let shift = 0;
        let chunk;
        do {
            chunk = encoded.charCodeAt(index++) - 63;
            result |= (chunk & 0x1f) << shift;
            shift += 5;
        } while (chunk >= 0x20);
        return result & 1 ? ~(result >> 1) : result >> 1;
    };
    while (index < encoded.length) {
        x += nextNumber();
        y += nextNumber();
        points.push([x, y]);
    }
    return points;
}

// grid: squares of people per sq mile, with state borders in kilometres, such as getUsDensityGrid() at the end of this file
async function populationDensity3D(divElementId, grid) {
    // The map is about 4,640 km east to west and 2,960 km south to north. worldDimensions keeps those proportions,
    // so the map isn't stretched; the height (y) is the population density.
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(464, 160, 296),
        cameraOptions: { position: new Vector3(-110, 250, -330), target: new Vector3(55, 15, 20) }
    });
    const hiddenAxis = { drawLabels: false, drawMajorGridLines: false, drawMinorGridLines: false, drawMajorBands: false };
    const xMin = grid.x0;
    const zMin = grid.y0;
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        ...hiddenAxis,
        visibleRange: new NumberRange(xMin, xMin + grid.columns * grid.cellSize)
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        ...hiddenAxis,
        visibleRange: new NumberRange(zMin, zMin + grid.rows * grid.cellSize)
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "People per sq mile",
        visibleRange: new NumberRange(0, 18000),
        labelPrecision: 0,
        drawMinorGridLines: false
    });
    sciChart3DSurface.isXYPlaneVisible = false; // hide the back wall; the side wall carries the density scale

    // Columns: x is east, z is north, y (height) is the density. Each square is coloured by its density class.
    const columns = new XyzDataSeries3D(wasmContext);
    grid.runs.forEach(([row, firstColumn, densities]) => {
        densities.forEach((density, i) => {
            const densityClass = DENSITY_CLASSES.find((c) => density < c.max);
            columns.append(
                grid.x0 + (firstColumn + i + 0.5) * grid.cellSize,
                density,
                grid.y0 + (row + 0.5) * grid.cellSize,
                { vertexColor: parseColorToUIntArgb(densityClass.color) }
            );
        });
    });
    sciChart3DSurface.renderableSeries.add(
        new ColumnRenderableSeries3D(wasmContext, {
            dataSeries: columns,
            pointMarker: new CubePointMarker3D(wasmContext),
            dataPointWidthX: grid.cellSize * 0.8, // in kilometres, so there is a small gap between columns
            dataPointWidthZ: grid.cellSize * 0.8,
            useMetadataColors: true
        })
    );

    // State borders on the floor: PointLineRenderableSeries3D with isLineStrip: false draws one line per pair of points
    const borders = new XyzDataSeries3D(wasmContext);
    grid.stateBorders.split(" ").forEach((encoded) => {
        const points = decodeOutline(encoded);
        for (let i = 1; i < points.length; i++) {
            borders.append(points[i - 1][0], 60, points[i - 1][1]); // a little above the floor, so the lines show
            borders.append(points[i][0], 60, points[i][1]);
        }
    });
    sciChart3DSurface.renderableSeries.add(
        new PointLineRenderableSeries3D(wasmContext, { dataSeries: borders, isLineStrip: false, stroke: "#C8D3E8", strokeThickness: 1.5 })
    );

    // Drag to rotate, scroll to zoom, double-click to reset, and hover a column to read its density
    const allDensities = grid.runs.flatMap(([, , densities]) => densities).sort((a, b) => b - a);
    sciChart3DSurface.chartModifiers.add(
        new OrbitModifier3D(),
        new MouseWheelZoomModifier3D(),
        new ResetCamera3DModifier(),
        new TooltipModifier3D({
            tooltipContainerBackground: "#0F1A2B",
            tooltipTextStroke: "#FFFFFF",
            tooltipDataTemplate: (seriesInfo) => {
                if (!seriesInfo || !seriesInfo.isHit || seriesInfo.renderableSeries !== sciChart3DSurface.renderableSeries.get(0)) return [];
                const density = seriesInfo.yValue;
                return [
                    `${density.toLocaleString("en-US")} people per sq mile`,
                    `Rank ${(allDensities.indexOf(density) + 1).toLocaleString("en-US")} of ${allDensities.length.toLocaleString("en-US")} squares (1 = densest)`
                ];
            }
        })
    );
    return { sciChart3DSurface };
}
// #region_A_end

// A colour key in the top-left corner. In your app this can be any HTML.
function addLegend(chartRoot) {
    const legend = document.createElement("div");
    legend.style.cssText =
        "position:absolute; top:10px; left:12px; z-index:10; padding:8px 12px; border-radius:6px;" +
        "background:#0F1A2BDD; color:#ffffff; font:14px Arial, sans-serif; line-height:22px;";
    legend.innerHTML =
        "People per sq mile<br>" +
        DENSITY_CLASSES.map(
            (c) => `<span style="display:inline-block; width:14px; height:14px; margin-right:8px; vertical-align:-2px; background:${c.color}"></span>${c.label}`
        ).join("<br>");
    chartRoot.append(legend);
}

populationDensity3D("scichart-root", getUsDensityGrid()).then(({ sciChart3DSurface }) => addLegend(sciChart3DSurface.domChartRoot));

// Population density of the contiguous United States in 40 km squares (an equal-area projection, so every square
// covers the same 1,600 km², about 618 sq miles of ground). Each value is the average density of the counties covering
// the square, weighted by how much of the square each covers: people are assumed to be spread evenly within each county.
// Squares less than 15% land are left out. Source: 2020 Census county populations and land areas (US Census Bureau),
// with county boundaries from the 2020 cartographic boundary file cb_2020_us_county_20m (public domain), projected to
// kilometres with an Albers equal-area conic projection (standard parallels 29.5°N and 45.5°N, centred on 96°W).
function getUsDensityGrid() {
    return {
        cellSize: 40, // km
        x0: -2360, // km, the west edge of column 0
        y0: 240, // km, the south edge of row 0
        columns: 116,
        rows: 74,
        // Runs of land squares, west to east: [row, first column, people per sq mi of each square in the run]
        runs: [
            [1, 95, [84,84,84]],
            [2, 53, [554,494,472]],
            [2, 97, [84,84]],
            [3, 51, [53,186,554,162,137]],
            [3, 96, [84,934,1074]],
            [4, 50, [14,24,26,206,11,0]],
            [4, 95, [176,126,1211,1422]],
            [5, 50, [21,21,5,13,10,11]],
            [5, 94, [426,185,195,1543,1535]],
            [6, 50, [79,79,13,25,179,243]],
            [6, 93, [852,960,134,173,957,1079]],
            [7, 49, [79,76,72,12,23,203,208,172]],
            [7, 92, [781,420,203,26,254,746,760]],
            [8, 48, [46,41,23,4,1,8,35,29,43,38]],
            [8, 92, [627,324,59,90,59,393,397]],
            [9, 48, [40,7,8,9,17,20,25,9,72,46,32,33]],
            [9, 91, [3369,1361,641,263,206,184,500]],
            [10, 47, [45,41,8,11,20,52,80,27,22,66,24,34,129,270]],
            [10, 91, [1788,1145,537,388,303,478,419]],
            [11, 40, [2,2]],
            [11, 47, [6,2,16,23,38,1193,972,108,19,21,24,82,686,399,901,925]],
            [11, 70, [89,89,90,360,30,30]],
            [11, 91, [469,524,378,1042,858,575]],
            [12, 39, [2,2,2,2]],
            [12, 46, [15,10,1,8,20,31,810,559,215,54,25,23,101,1401,2576,1425,85,293,42,4,4,41,71,96,85,88,100,542,42]],
            [12, 91, [225,247,371,1173,990,596]],
            [13, 38, [2,2,2,2,2,1,0,14,15,11,1,2,43,41,52,192,649,250,61,43,68,1406,1705,643,113,245,176,124,56,64,234,96,90,125,348,1236,148,116]],
            [13, 85, [23]],
            [13, 90, [35,74,237,278,471,503]],
            [14, 38, [2,2,2,2,2,2,0,5,7,5,2,3,12,19,23,133,1120,726,61,45,181,291,310,67,55,44,58,116,52,76,264,62,387,315,238,668,331,302]],
            [14, 84, [86,21,24]],
            [14, 88, [21,22,35,241,248,141,266]],
            [15, 37, [1,1,1,1,2,3,3,2,1,1,2,2,3,3,6,21,43,323,419,44,75,196,63,67,46,29,29,18,33,34,49,79,44,412,162,176,200,87,257,194,314,152,298,217,228,73,185,107,12,144,91,21,26,60,138,235,326,446]],
            [16, 36, [1,1,1,1,3,4,3,3,3,2,2,5,40,10,5,6,5,31,126,300,82,21,17,19,21,44,90,32,20,37,66,94,47,30,22,29,92,54,99,58,41,326,183,356,188,212,67,45,56,51,167,252,26,34,53,63,557,1062]],
            [17, 36, [1,1,1,1,6,6,8,5,3,3,6,19,79,21,5,18,11,13,60,172,210,29,21,27,32,62,73,20,24,29,50,58,25,37,33,27,57,37,117,61,19,66,89,32,37,55,53,58,119,42,51,77,62,166,12,30,138,644]],
            [18, 35, [254,1,1,1,1,5,7,11,118,132,54,2,8,19,9,7,23,26,17,16,25,80,44,36,58,50,55,47,30,29,28,20,22,18,18,17,31,41,36,56,66,22,15,19,18,16,31,68,92,66,20,35,61,85,47,19,32,63,104]],
            [19, 23, [39,36,20,20,20,5,1,1]],
            [19, 32, [41,58,819,410,1,2,4,5,8,10,12,112,98,49,21,7,12,95,70,17,18,35,66,154,157,148,91,89,181,167,65,79,104,24,20,52,51,22,25,132,168,107,24,24,20,16,17,15,20,27,58,35,24,17,117,79,79,51,53,50,78,120]],
            [20, 21, [114,106,64,60,24,20,20,8,3,8,9,32,58,157,36,10,10,14,15,15,17,15,13,11,13,22,14,11,61,43,9,13,31,131,1009,1842,1763,163,81,154,207,69,154,181,42,64,129,139,27,24,114,186,127,42,62,71,15,19,35,28,170,143,30,46,13,58,59,36,44,41,42,52,90]],
            [21, 20, [114,114,114,114,114,36,20,20,11,3,8,9,26,58,50,10,10,11,13,15,15,17,16,14,14,11,2,15,6,11,11,3,13,24,97,1024,2009,1892,383,65,57,65,30,119,113,36,25,27,29,26,13,21,45,83,42,33,19,13,20,19,80,145,103,156,349,176,28,171,55,45,44,57,97,365,492]],
            [22, 18, [87,114,114,114,114,114,111,45,13,11,6,5,7,6,11,29,44,10,10,11,11,12,12,17,14,11,13,6,6,3,1,2,6,2,14,13,32,220,821,913,298,52,38,52,76,72,32,29,34,25,20,18,47,29,22,22,25,24,16,26,100,53,110,25,55,104,114,36,43,310,35,54,33,64,109,100,271]],
            [23, 16, [37,37,78,209,275,173,88,82,79,42,8,8,6,7,7,5,3,3,3,9,9,6,8,11,11,15,12,8,22,313,67,3,1,1,4,4,8,9,16,31,65,135,49,51,38,18,52,39,26,20,22,12,20,18,42,40,34,22,26,98,85,45,169,417,332,125,35,47,143,120,109,136,82,29,30,27,22,36,149,338]],
            [24, 15, [37,37,37,103,480,480,284,79,79,64,34,8,8,5,1,1,1,3,3,3,4,4,4,7,11,11,8,7,8,17,126,31,3,1,1,2,13,156,72,8,26,40,41,44,23,18,17,22,24,21,25,14,22,31,19,27,33,27,37,26,41,50,25,62,335,437,140,110,99,471,1219,528,86,48,21,126,172,33,32,96,285,351]],
            [25, 10, [783,783,387,43,43,42,32,37,41,463,480,416,400,212,91,11,10,7,5,1,1,1,2,2,2,3,4,4,5,3,5,10,11,9,12,23,10,3,3,5,11,16,15,38,40,47,41,21,13,11,8,16,21,20,21,87,69,82,68,21,24,30,32,59,60,114,43,38,48,98,98,171,140,97,683,2247,1581,210,66,27,317,208,111,67,114,189,192,210]],
            [26, 10, [783,783,561,43,43,41,4,29,17,377,480,480,480,410,30,11,11,7,6,2,1,1,2,2,2,4,4,4,2,1,2,23,34,11,9,23,8,2,3,7,9,23,42,95,58,43,42,49,19,32,14,26,23,14,22,115,242,450,82,13,17,21,81,63,54,94,50,59,50,160,192,140,69,168,373,1151,1194,362,104,39,67,61,351,291,135,51,38,113]],
            [27, 10, [783,770,632,175,233,292,189,4,4,286,395,223,268,125,11,11,11,8,6,2,1,2,3,18,52,29,4,4,1,1,2,3,18,13,12,150,45,3,5,3,15,12,9,20,41,178,270,47,18,33,22,24,126,63,24,32,109,241,68,17,29,52,669,279,34,66,65,122,113,216,458,61,89,166,159,132,254,142,130,188,114,65,237,372,134,123,131,269,275]],
            [28, 7, [2467]],
            [28, 9, [2854,475,344,335,335,335,326,242,14,5,15,29,29,29,22,9,9,11,9,6,6,6,6,6,34,475,502,46,10,3,3,4,4,3,4,3,120,48,14,19,5,14,18,18,40,139,831,441,44,29,44,61,49,101,73,35,71,40,82,64,33,27,53,702,339,44,48,46,23,73,82,143,67,83,461,164,65,84,92,171,404,290,90,44,101,77,107,83,157,86,158,686]],
            [29, 8, [3034,3132,356,279,233,188,147,111,109,65,16,19,29,29,29,21,8,9,11,10,6,9,13,8,8,45,143,79,81,19,6,6,6,3,2,2,3,45,33,14,5,4,3,13,17,17,47,228,144,61,114,306,100,54,153,135,24,26,18,25,42,37,82,84,58,66,96,119,43,28,94,112,97,97,52,378,139,62,49,71,146,519,414,196,314,276,117,59,98,105,38,114,315]],
            [30, 7, [2367,2467,1995,109,109,109,109,109,109,109,30,16,17,29,29,16,9,8,8,11,11,6,8,13,13,13,22,40,53,86,26,4,3,2,1,1,3,4,12,14,10,7,3,3,9,8,9,30,47,76,62,219,596,85,55,256,215,29,40,27,44,25,28,58,89,43,64,77,58,43,38,161,388,484,79,55,76,121,156,133,71,183,298,107,257,989,1194,151,78,128,365,105,62,195,211,133]],
            [31, 4, [164,213,458,1101,2467,2467,415,109,109,109,109,109,127,65,16,16,25,15,8,8,8,8,11,10,6,7,14,15,16,28,35,17,13,14,4,3,2,1,1,3,4,4,6,8,7,3,3,15,11,7,32,37,26,22,20,147,53,52,149,126,55,76,32,35,24,22,23,37,35,43,58,57,49,84,157,1227,325,102,136,81,96,580,384,120,126,195,131,267,488,493,195,122,194,324,145,124,88,91,104,133]],
            [32, 4, [164,164,423,965,1548,1077,298,109,109,109,109,109,234,122,16,16,11,8,8,8,8,8,10,10,6,6,22,22,22,14,7,7,8,16,7,3,3,2,1,1,1,4,10,10,3,3,3,5,7,6,5,14,43,27,17,64,21,51,99,66,80,117,15,25,30,11,22,53,34,30,28,79,63,146,241,180,233,57,44,38,53,161,167,193,168,133,131,137,227,290,327,258,146,1040,356,176,195,85,36,29,53]],
            [33, 3, [164,164,159,163,112,112,112,111,109,109,109,109,175,287,127,19,16,13,8,8,8,8,8,10,11,6,6,19,22,22,13,7,7,7,14,10,3,3,2,2,2,1,2,5,10,28,4,2,2,3,4,7,19,25,25,5,38,31,43,158,76,331,208,36,22,16,8,11,16,57,58,84,117,43,79,55,107,139,58,33,44,47,79,64,60,192,308,96,73,105,361,648,546,521,853,327,154,144,50,23,23,94]],
            [34, 3, [113,102,97,108,112,112,112,108,86,64,41,18,264,287,236,238,30,16,16,10,8,8,8,9,11,7,5,15,19,28,25,9,9,6,6,3,3,3,3,3,2,1,2,4,11,9,9,23,8,8,12,13,446,260,39,5,12,27,53,21,24,45,40,47,49,20,13,18,35,87,66,40,20,31,77,57,60,74,51,54,71,106,93,46,60,65,71,75,47,77,65,141,157,92,141,90,83,44,37,44,61,96]],
            [35, 3, [86,86,98,111,108,104,101,20,2,2,2,3,244,287,287,287,84,16,16,12,7,6,5,4,3,2,2,8,13,24,30,4,6,12,22,7,4,8,17,11,4,6,7,3,8,24,12,17,8,7,24,49,156,121,35,5,8,22,21,22,19,22,42,63,76,46,30,72,70,48,92,136,40,42,85,145,43,106,81,70,74,77,45,44,55,67,44,68,40,124,85,90,62,41,49,40,54,39,80,103,88]],
            [36, 3, [98,110,120,109,99,98,98,28,2,2,2,3,167,192,135,78,38,54,66,5,2,2,2,2,2,2,2,3,6,6,7,1,3,3,2,5,39,70,41,12,3,5,6,2,6,20,13,2,6,14,18,20,36,15,5,31,17,22,29,33,29,28,38,55,41,26,80,233,153,117,46,68,23,50,407,89,51,208,231,81,167,251,54,31,63,74,55,39,111,64,310,235,100,62,38,39,45,39,283,1447,1103]],
            [37, 2, [134,134,137,169,134,109,99,101,10,2,2,3,3,2,0,0,0,27,74,50,13,1,1,1,1,1,2,2,3,8,10,9,4,2,2,10,23,51,106,78,5,1,1,1,2,3,6,2,3,10,18,16,20,63,19,8,23,23,121,551,155,63,59,41,92,98,30,151,972,1190,261,55,55,24,46,60,83,47,308,1251,143,381,295,72,48,52,60,63,83,82,30,52,62,214,45,41,254,573,123,1051,2167]],
            [38, 2, [134,109,61,169,164,169,165,164,2,2,1,3,3,2,0,0,0,6,22,17,17,5,1,1,1,1,1,2,5,24,22,19,8,5,10,20,21,134,343,239,4,2,1,1,2,2,3,3,3,22,18,6,9,28,24,96,29,292,167,921,1120,54,46,32,145,110,33,120,371,610,232,46,49,33,40,66,55,72,95,203,58,81,48,47,57,131,152,105,146,51,31,20,26,65,81,73,247,1000,119,140,60]],
            [39, 2, [134,73,119,134,78,103,156,104,2,2,0,3,3,3,0,1,0,1,12,9,6,3,3,4,2,2,2,3,4,47,38,28,13,7,13,12,31,253,284,139,8,3,3,3,5,6,7,3,3,5,5,5,9,11,23,84,28,22,64,230,382,33,16,17,61,39,28,40,30,44,46,36,44,33,35,66,77,192,110,77,111,536,208,61,84,118,116,132,96,30,18,11,25,148,224,101,212,61,48,69,74,74]],
            [40, 2, [738,1229,278,145,73,35,79,38,4,0,0,2,3,3,3,3,1,0,2,2,2,4,10,11,4,2,2,3,3,42,47,45,27,20,24,25,23,616,361,240,179,2,3,4,4,4,4,3,6,6,5,4,4,8,6,10,13,16,21,132,34,20,22,15,24,19,44,28,22,71,147,60,43,83,33,191,83,233,229,69,303,1449,339,75,79,76,54,72,25,24,41,24,11,200,78,93,373,269,254,185,86,98]],
            [41, 1, [1604,1488,1537,395,325,58,18,19,4,2,1,1,3,3,3,3,3,1,1,2,2,2,2,5,16,9,2,2,3,4,22,25,21,21,28,33,37,26,1031,1347,501,306,3,3,4,3,2,4,10,7,6,5,5,6,8,11,21,8,15,11,31,16,16,19,22,27,15,50,64,26,53,130,135,91,127,54,45,155,1220,693,74,151,733,440,108,116,72,99,145,73,39,91,31,19,33,104,107,1353,2130,855,79,201,189]],
            [42, 1, [3695,3379,1850,570,331,33,25,13,8,1,1,2,3,3,3,3,2,1,1,1,2,2,2,3,10,14,12,13,10,8,6,2,4,7,17,15,11,164,402,137,72,23,8,3,5,4,3,2,8,5,11,11,35,17,10,21,155,19,16,16,21,10,11,9,14,19,12,26,27,37,39,104,95,94,205,75,74,152,436,533,161,106,487,394,250,1203,235,80,55,52,49,187,82,46,47,179,390,1552,3182,1410,129,223,254]],
            [43, 1, [504,1001,972,1028,535,62,36,10,30,5,1,3,3,2,2,1,1,1,1,1,3,3,3,4,134,233,73,6,7,8,5,2,2,3,9,9,3,85,138,96,80,63,19,12,6,4,4,9,10,16,25,46,85,33,21,29,350,39,26,25,15,14,16,14,22,31,18,65,33,43,132,215,114,100,29,38,92,174,147,200,141,71,129,109,215,1233,247,118,74,94,116,117,146,59,109,173,349,566,1271,2048,137,355,355]],
            [44, 1, [405,245,379,885,754,113,106,71,46,12,4,5,1,1,1,0,1,1,1,1,7,9,10,10,319,269,24,6,7,8,6,3,3,3,8,8,8,133,131,92,72,59,18,10,5,5,6,13,14,11,10,14,27,18,14,16,53,992,325,56,17,22,39,48,34,60,35,47,39,45,79,91,59,43,68,46,49,51,89,94,85,90,154,105,149,153,138,83,125,79,250,509,263,121,54,48,216,262,728,609,638,537,409,469]],
            [45, 1, [310,169,175,166,209,229,248,171,29,12,5,5,4,1,1,0,1,2,2,3,9,10,10,10,1064,538,24,12,11,4,4,3,3,3,4,3,7,13,16,37,37,13,4,7,3,3,3,5,5,4,4,6,5,7,35,33,60,223,85,42,17,55,303,305,48,28,65,117,167,212,53,38,86,135,567,577,273,68,100,117,480,189,92,136,76,147,175,216,452,157,418,1500,315,180,164,78,202,413,523,579,797,2808,1178,785]],
            [46, 0, [67,61,53,20,110,126,79,37,45,72,23,5,4,2,1,1,0,3,3,3,3,8,10,10,47,1295,361,21,14,11,4,4,4,4,3,2,2,2,8,13,27,17,17,19,3,2,1,1,1,1,1,2,3,2,6,50,25,16,14,18,22,25,44,277,299,51,29,130,168,112,201,81,52,96,581,2538,3662,406,299,379,198,125,101,79,260,128,160,411,728,689,429,300,234,99,105,157,99,89,211,451,502,894,2389,1315,1063]],
            [47, 0, [26,27,43,21,76,124,19,8,25,77,20,1,1,1,1,1,1,3,3,3,3,6,10,10,63,487,329,22,10,9,4,4,4,4,4,2,2,2,7,8,4,5,16,19,8,3,2,1,1,1,1,2,3,4,6,12,18,33,71,60,20,23,35,52,74,38,75,139,149,49,39,44,118,187,1022,4548]],
            [47, 78, [291,199,138,97,84,119,707,252,234,606,2618,578,307,169,118,65,67,72,136,115,146,193,249,879,662,1440,2196]],
            [48, 0, [26,26,25,22,39,68,8,8,9,74,38,1,1,1,2,2,2,3,3,3,3,5,10,10,10,10,102,32,5,5,4,4,4,4,4,3,2,2,6,7,4,5,3,2,8,3,2,1,1,1,2,2,3,4,7,8,12,29,55,39,28,17,35,26,22,24,175,34,35,140,39,54,265,323,527,1459]],
            [48, 78, [218,140,392,162,167,269,686,1607]],
            [48, 89, [637,130,87,74,28,38,25,40,68,114,163,320,310,437,1617,17162,8266,1675]],
            [49, 0, [29,25,12,24,28,31,17,7,7,57,57,1,2,2,2,2,3,3,3,3,3,3,10,10,9,9,67,20,5,4,3,3,4,4,4,7,11,13,9,3,3,2,1,2,6,3,2,1,2,2,2,2,3,4,9,19,36,50,43,29,30,18,17,20,49,28,39,26,24,44,34,127,273,217,431,1092]],
            [49, 79, [149,160,175,359,416,1779,2631]],
            [49, 90, [249,321,169,53,41,27,21,58,55,80,315,242,180,1097,3259,2219,1675,1675]],
            [50, 0, [38,32,8,32,48,48,34,7,7,40,75,4,2,2,2,2,3,3,3,3,19,22,9,10,6,10,44,8,5,3,2,2,3,4,4,8,15,15,10,3,3,1,2,4,5,7,5,3,5,6,5,4,5,8,8,10,14,95,30,21,37,25,16,23,40,25,22,28,23,32,41,223,406,173,566,2924]],
            [50, 78, [497,597,499,138,262,378,1387,1686,222]],
            [50, 92, [133,91,58,42,46,55,77,52,95,96,125,395,801,1508,1447,1186,1675]],
            [51, 0, [38,38,7,6,37,42,27,4,3,19,77,18,2,2,2,2,2,2,2,2,35,43,21,13,7,28,43,4,4,3,2,2,4,4,4,7,15,15,11,4,4,2,2,5,5,6,8,2,1,1,2,3,6,5,33,8,74,221,41,29,16,24,24,27,45,53,27,28,53,43,47,69,70,102,226,357]],
            [51, 78, [307,302,327,93,150,406,267,277,217]],
            [51, 93, [605,317,58,66,80,162,183,193,46,100,162,352,305,1105,470,416,496]],
            [52, 1, [38,25,7,7,7,7,2,2,4,63,23,1,1,3,3,2,2,2,2,23,31,19,20,10,35,32,33,47,5,3,3,4,4,3,4,7,4,3,10,8,3,4,19,22,32,39,1,1,1,2,4,4,4,4,4,15,17,19,14,19,29,75,68,75,128,182,67,163,86,41,33,41,202,181,210]],
            [52, 78, [51,59,78,112,182,183,70,44]],
            [52, 93, [803,431,94,136,94,159,112,53,40,50,99,157,286,973,332,919,1084,748,449]],
            [53, 1, [37,22,7,7,7,7,6,4,1,1,1,1,1,3,3,2,2,2,6,14,12,6,12,7,23,44,64,48,6,6,4,4,2,3,3,3,2,2,9,9,3,4,35,20,15,29,3,1,2,11,16,2,7,15,9,14,40,18,32,18,34,60,103,211,76,41,26,34,25,57,65,58,277,251,153]],
            [53, 78, [52,27,47,66,118,131,42,39]],
            [53, 93, [407,175,890,534,135,391,277,95,57,75,502,162,239,367,587,1026,1294,793,581]],
            [54, 1, [28,23,18,41,45,12,12,8,1,1,1,1,1,2,3,3,10,312,9,8,2,9,4,1,10,33,68,34,6,6,4,4,4,4,4,3,2,2,9,10,3,3,21,7,8,9,2,1,2,4,2,2,4,6,4,22,10,11,15,20,21,75,473,996,332,65,80,129,28,78,89,73,145,352,175]],
            [54, 78, [48,69,33,44,40,44]],
            [54, 97, [130,261,192,166,65,138,434,185,88,117,671,1625,3554]],
            [55, 1, [18,27,55,79,78,14,12,7,1,1,1,1,1,2,3,3,186,446,34,9,5,5,1,1,3,9,5,7,6,6,4,4,4,4,4,9,11,12,10,10,3,2,4,5,6,6,2,2,2,3,3,2,3,6,5,26,16,10,17,37,45,139,1133,1977,347,94,59,66,25,65,84,52,28,39,53,62]],
            [55, 78, [59,162,41,25,20,26]],
            [55, 98, [111,74,107,22,82,198,65,58,98,453,840,1515]],
            [56, 1, [14,24,51,55,64,29,12,4,1,1,1,1,1,1,3,3,142,95,4,5,2,1,1,1,2,1,1,8,16,4,4,4,4,4,5,8,6,5,2,1,0,0,2,2,1,1,1,2,2,5,6,3,9,22,7,7,9,12,16,43,108,139,201,361,105,52,46,26,17,22,31,22,28,31,26,62]],
            [56, 79, [74,52,42,21,36]],
            [56, 98, [92,46,33,7,37,73,67,61,91,209,320,365]],
            [57, 2, [26,29,22,22,22,12,7,13,27,12,1,1,1,3,3,14,17,7,3,1,1,1,2,2,2,2,8,25,6,5,5,5,4,3,3,3,2,1,1,0,0,0,0,1,1,1,2,2,2,2,2,7,19,6,7,9,9,32,53,55,64,55,48,25,26,21,15,12,20,34,22,13,28,24,38]],
            [57, 80, [69,36,22,34]],
            [57, 98, [83,53,39,20,21,31,56,56,59,127,187,215]],
            [58, 2, [41,37,22,39,75,56,61,60,23,8,3,2,2,4,5,6,6,3,3,3,2,2,2,2,2,2,2,36,7,3,4,5,53,33,3,2,2,2,2,2,1,2,2,2,2,2,2,3,2,2,2,4,4,5,8,11,18,32,33,27,47,38,18,20,26,22,13,14,14,27,18,10,27,30,32,22,8,63,61,29]],
            [58, 99, [40,40,31,32,78,118,58,51,54,93,333,332]],
            [59, 3, [31,30,74,84,83,68,45,8,6,2,2,2,5,6,5,4,3,3,3,2,2,2,2,5,3,13,43,20,4,2,5,58,59,37,1,2,3,3,3,2,2,1,1,2,2,4,14,10,3,3,5,5,12,38,32,29,30,29,19,56,20,19,38,34,24,12,12,12,10,14,11,31,36,17,10,8,10,16,18,24]],
            [59, 99, [40,38,30,71,153,149,59,37,29,68,200,179,86]],
            [60, 3, [60,79,83,70,60,40,17,13,5,1,4,13,11,12,4,2,2,2,2,2,15,10,6,35,17,8,31,17,3,2,1,2,10,19,1,2,2,3,1,1,1,1,18,23,16,17,29,60,13,7,10,8,27,105,81,50,27,26,19,23,13,19,34,32,17,11]],
            [60, 70, [9,4,18,10,30,36]],
            [60, 77, [9,7,12,24,24]],
            [60, 102, [77,81,67,40,15,19,27,91,137,85,64,35]],
            [61, 4, [72,122,89,126,170,12,11,4,3,6,23,20,13,2,2,2,2,2,2,11,15,4,10,8,7,5,1,1,2,1,2,1,1,1,1,1,1,2,3,1,1,4,4,7,4,12,49,11,6,8,6,12,47,27,12,11,15,19,15,17,23,32,32,5]],
            [61, 72, [31,33]],
            [61, 106, [14,22,19,17,54,53,37,33]],
            [62, 4, [51,114,235,246,223,63,9,2,3,8,24,25,20,6,27,14,3,2,2,7,17,3,3,9,20,7,7,3,2,3,2,0,0,0,0,0,1,3,4,4,4,4,2,5,6,5,2,3,3,4,4,14,25,17,14,13,13,18,17,17,24,32,31,5,5]],
            [62, 73, [8,4]],
            [62, 107, [22,16,13,13,43,40,22,12]],
            [63, 4, [37,81,260,783,863,100,12,9,11,76,87,47,35,5,31,43,6,3,3,15,44,41,7,19,22,29,31,3,2,3,3,2,0,0,0,0,1,3,5,5,5,5,5,7,25,17,3,4,4,6,5,32,49,16,17,17,16,18,5,6,19,32,29,5,4,4,4]],
            [63, 72, [4]],
            [63, 108, [13,10,4,24,42,17,12,12]],
            [64, 5, [25,511,811,485,8,30,46,58,97,104,74,44,12,20,36,16,4,4,10,27,42,10,21,18,29,25,2,2,2,2,1,1,1,2,1,2,3,5,6,17,17,7,8,35,22,3,4,4,9,9,8,8,5,5,9,14,11,4,4,19,32,31]],
            [64, 68, [4]],
            [64, 72, [4]],
            [64, 108, [13,8,4,39,33,13]],
            [65, 5, [44,58,88,89,13,43,60,59,59,58,30,13,18,31,29,9,5,4,4,15,30,18,10,3,3,2,1,1,2,2,2,1,1,2,2,2,4,4,3,16,14,6,15,5,4,3,10,7,2,2,5,6,4,8,9,6,3,4]],
            [65, 64, [18]],
            [65, 108, [13,5,7,35,10]],
            [66, 5, [36,27,51,40,85,158,55,30,25,37,27,8,25,297,206,114,5,5,8,20,21,20,7,3,3,2,3,5,5,2,2,1,1,1,2,1,1,2,2,2,2,2,2,3,4,4,11,8,2,2,4,6,4,8,9,4,3]],
            [66, 108, [11,6,11,20,10]],
            [67, 5, [25,27,98,343,544,693,212,21,24,30,33,5,6,193,242,85,12,5,10,21,21,15,4,4,3,2,3,6,6,2,2,1,1,1,2,1]],
            [67, 108, [10,10,10,10,10]],
            [68, 6, [40,74,303,811,1073,778,57,26,24,26,8,10,24,21,27,20,5,5,18,20,7,5,5,3,2,2,6]],
            [68, 109, [10,10,10]],
            [69, 6, [39,45,157,731,755,566,130,25,11,9,6,4,18,12,18,9,6,5,12,18,5]],
            [70, 6, [20,27,34,222,389,313,187,20,8,8,8,3,16,13,10,10]],
            [71, 6, [44,44]],
            [71, 9, [254,92,83,92,58,8,8,8,4]],
            [72, 6, [44]],
            [72, 9, [102,107,108,108,73]]
        ],
        // State borders and the coast in kilometres, encoded as polylines, separated by spaces
        stateBorders: "k}@my@AA ez@ay@eBK iy@_y@[A x^kxB?S ~^_vBEkA ~^_vBD~A _^mgCMA m^ogCgAC gk@_~@Ej@ mk@s|@Ex@ akBsgCM_@ okBshCAC gkBceCAB gkBceCDa@M]LO hAczCAJ fAwyC?`A ucBowBOJAD yd@eaBEF qd@waBGP qd@waBQ[UI wfBagBi@G ktAykBMJ usA{iBc@q@ sqAmiBOFc@]MF qd@esA[A me@gsAa@A gm@m_Bs@E }l@k_BIA ovB_rC{@M kxBmrCEA a{@euAQA kz@qrAAF v_@yiBDtB {o@{xC?]i@S_@u@Af@ ko@kzCMc@G?ED@LLPJA ej@ssA[A ak@usASR uk@{pA?eA sk@_pAA[ dJijAOHc@]SR fKalAI^W@?T xRanAWGUX jQomACVk@B cu@e`Bg@A _t@c`Bc@A }`A{uA?q@ g_AuuAu@E k~@quA[C gH_yBe@A _G_yBg@? qxBorCo@G azBwrCQ|@ szBypCCP u~Ach@c@|@ aU}mC_AA aW_nCAP cWmmCYb@Nd@ y[waAA? gr@{zCGJKK kTy|ACA gRw|AcAA {Pu|Ak@A egB{}BOC d^i}A_BB gdB}vBAH idBqvB?A ly@q{C_G^ lq@qzCe@B b`@ucBCy@ f`@}`BCwA pe@iaBiDJ ~e@kaBM@ oz@sqBGLBJ a`Amp@c@JuA{@AUe@A@O mb@g`DyAJ ea@q`Dg@H {`@w`DID qFqdB?`A `XquB{AB dXquBC? sFs}AAb@ uFo|AIjA {c@w}AyAE uf@}}AA? ih@}qCGk@U]FY uqA{b@eAxA qg@msAE? wg@msAiAE aj@ssAC? _NsmCiAC rh@saC@d@ ph@qbC@\\ _OidAo@A qMgdAm@A v_@{iB?@ |_@cfB@R ix@ioBIAKF {w@enBD[SG mWckCAT oWmjCQl@]T meBo}Bw@K kgBuzBg@q@ zOslAe@PWE hUwyA@d@ dU{|ABbB {}AieBIA _|A_eB{@I q{A{dBMC }WksBUR kaAgaBI? uaAgaBk@I acAqaBc@C eUqqCUF {n@s_Bg@C yn@qtCOmA e_AcaABOWW c_As`AAO mj@mjBWQKY mj@kjB?A yFomC_@? yGomCk@? wDmmCaAA [mzBHJU^ g@ayBGL kJ}aAAbA geBcsBGJWFe@EUT ck@_~BE|@ _k@a_CC`@ qz@qsBBo@ }oA}x@g@A eqA_y@Kh@YA uoA{x@GA {c@}t@Yl@ {c@}t@MiA nuB{pByAdC |wBqtBmAtB mgAydCc@Ac@e@ mjAasBQMFUGE lEc`@e@q@ dBsfC]F fAkfCIDBZGL heAgoB[_E daBkwD\\bC eC_yBo@? iB_yB[? vBecD[dAC`A orBoiCPUa@a@P] grBshCG[ gqBuhC?Q e~@quAE? g}@muA]C dX_}A_BB yhAmx@q@A kjAox@GA wL}p@Ah@ }Kkn@[g@ whAipBIC ugA_oB]KC] dh@ebAF`B o@sxBIl@QJ wz@erBDk@ oz@sqBBCKM xe@{}AsCH ff@wzAMcB yh@mdBMKc@M tqA_jCG@ |uAujCgCT bgBs{CM]BMOK f`BulCyBX ivAqzBMC wvAuzBkAM {wAaxB[e@ {vA_wB_@a@ {vA_wBPqB ob@asAM? }b@asAs@C a`AcaBi@C mk@kzBBu@ mk@gzB?C rJa`Bu@@ |H_`B{@? fbBqrDDZ bbBgsDBT b_@utDgCH pF}hC]AUN hG}hCW? fAuwC?d@ fAovC?d@ fAiuC?R dg@snA?@ lg@ekAGkB _RkdAyBC vfAc`AiDT }yAmkCiAM g|A{kCUE sFk`B?J sFi~A?u@ mX_}Aq@C gX_}AE? _W}|Ag@A gcBitBK^ ng@coC?B fg@qqCFlA ikBk_C]S ikBi_C?A ijBk_C_@@ tDqsDyB@ tDqsDQhAFX wzBgpCCF nw@e_CwAH zy@m_CkAF ~|@y_CcBJ ||@_|Cy@F b{@w{Cu@D fp@mzCsCL yj@o_BcAB yj@o_BEf@ iPwmCQ? {MsmCC? m~AyxBg@T fAmmC_A? fAmmC?mA byBkrCeBX n}BqsCkCd@ sp@khCAoA _p@whB[Q {p@iiBQTMB tUspA@h@ mDmmCI? qKqmCiAA mp@w_Bs@E aBmmCkA? wAmmCI? }n@soCNc@Ki@ es@_`BYC ar@}_Bc@A gt@cdC{@G qs@adCUA a{AoxAo@^ mJy_AAh@ oJo~@Ap@ wfAooBON ggA_oBEf@ fLq~CoBB vHm~CC? }bCapCMH_@EGGHSJC?N^J fAutC?lA sh@a~AkAE ynA}eC?@ mnAkhCKlA nYsjCgDF cRoyB[A _SqyBg@A d{AukCgD^ n|AydCi@{E fDua@}AgA jD{mD?C jD{mDc@nB ~GssDiB@ jDkpD?A cv@kdCOA qjAixAe@O mnAcyAQA {mAayAQA gB}_B{@? sA}_BS? sv@mdC{@E ox@sdCEL ux@edCCb@ _YihC_@FIX iZggC[X g}@ghAOr@ w}@sfAMX `t@w~BwCL ho@i~Bw@D {PwmCy@A t^yzBAK x^_yBCy@ ta@e}BE@ na@c}B}AD p^}|B@v@ Ui|BG`@ Ui|B?W da@q}AW@ l`@o}AgAD goAmcCLmA ohAmsAKB {hAisAUAUd@ lUwvA@j@ nUkuA@t@ mz@auB@K qrAsjAa@|@ ssAuhAI^ vUioAKCON rUsrA@~@ |Ka`Bi@? al@ahBODKQOC e@}_Bm@? qqB}pC@gB ca@aw@oAE }sAeyAML csAqyACTOQEF _mAq`BAE ilAi_BIEKa@ onBcjCYF ioB{iCC@ `wBelDo@ISN i_@}v@C? m_@}v@e@C oYsdA_@A fLcuBg@? ~JcuBy@@ fCkjDEd@ koAo|BAG opAu{BD_@ ioAs{BA[ coAizBEi@ qpAi{B@K ypAuyBFs@ eoAkyBFIES cyAc{BSC wyAg{BgAK _|As{BEA y{AezBIWGC yzAczB_@A wxAgyBSBUq@WP kqAwyBsAM _tAezBYC vm@_vD{CN yoA{gBg@S e|AcwBKS@eA oT{|AoAA oFclB?Y oFijB?y@ sSwrCq@d@ {UiqCUZ ahBigBaAM _jBwlB@DID zm@}~@q@B hl@y~@iAD cjBwgBGA p_@glBDjA seAovAaAK geAmvAKA acAevAeAG ubAcvAKA as@ktAsAG wr@ktAI? ?}_BE? E}_B_@? t{Be_E_@J@f@ xcC}_EOrA ahAkx@WA e}@muAA? tJgiCWH |I}hCQP]Uc@B sjAqx@a@A ukAsx@sAE {_AmpBe@V c_AkpBWA wu@stAoAG uu@stAA? m}@gsCKg@eAk@e@TYv@ sqBs~BQ}@DmA wGqnA?q@ wGilA?gA u|@k}CWb@ZACXUL k{@ctCAK[I?IOE?W {aAujC@UOEFMKK mbAklCK@@^W]CsARa@ gt@m}C[MTCJOQg@HOk@G _c@wgCYA yc@ygCK? zLwsD{CB fA{oC?kA b\\i_DA? `\\i_DeFJ zT}~CA? x}Bg`CG[ _yAer@}A~B uiAafC]a@i@Y ye@}bBoA\\ yJq|Aq@? kLq|Ao@A {Ms|AC? `UmuB{AB dUmuBC? sp@etAcAE paCwrDW@ x`CurDO?W^Ct@ l_C_pDBZ w]{v@q@A k\\yv@k@A _l@yw@Gx@ cg@sr@mAY az@mxBFcA pyAi`As@ZqBP m^yyAMA qXozBA[U]?Y gXazBIM x@{dCAL v@mdCKd@ ~d@mkCqAD vg@skCwAD ng@_oCFjB inA}wBMQ }mAiwBKS mIayBg@A kz@muBBa@ }z@ct@}B~@ qFudB@qA io@_wCDg@WS g@ayBaA@ gqAmyAG? oqAmyAs@C siBumBBBOX aGuyAKjA eIomCs@A inAyx@UA {`Bid@a@z@ uu@ckBOU ~BkgDAP `CeiDAx@ r[wuBO? ~^_vBkBF vt@{~BUB ivAs`A?e@ _s@e|CIY]M _q@u_DO^I@GEQs@X?XV }|AalCgBS qz@{qAOr@ mz@irACL ok@oiA?o@ mk@wgAAw@ qZkhA]`AP\\KHFH cwAcdBu@I yxAmdBc@E dDghCa@J |DohCWF efAs{A?A adAkzA]Ce@c@ e^whBGF m^ohBm@VCR lrBclDSA |tB_lDoAC lyBemD_@LANi@@ vyBomDIH p_CcoD@PKJw@\\ cOcvC]Ze@F yNmvCIH yNmvCCW a{@gpAKj@ sfAwtAAF g}@khA?B cz@ywB@S gz@ovBBi@ kAyvBKDId@SN oB}tBE? c@}tBkA? @}tBe@? ja@ckCqBF lb@gkCa@B kvAyjCaBQ suAujCWC }[e}Ac@A _Zc}A}@A ukBovBET{@K _kBctBGB q]qjB@`@UV mh@a~AE? yf@}}As@C ugB_~By@K oiBk~BSjA qhBw{BGGDG of@isAa@C il@mbCm@W `Qw~CoBB xQy~CW@ {~@cr@Kx@YC }y@soBa@KAO ob@aeBO`@FN wb@_cBDCEK vq@kbBK@ jq@ibBiEP mn@atAcAC dh@ebAE_B d\\oj@W`@ ~e@a`DaDJ xe@kbDDhA yk@cvBE|@ _l@etBAZ uuAkeAIVm@J ivAyaAk@eAFG yd@y_BEc@ ud@os@Ur@OD me@kq@MI bC{gCQHK\\ jnAmiCiAJ `lAaiCL|A zlA{cCKgA sQmtCYH gQ_uCKP m`ByeBo@I u_BueBWC e~AkeBo@I uRymCy@A xe@kbDEy@ qk@kmAAs@ qk@emA?E zZktDmAB w{@smAOt@ chB_rBu@TFVAV xeA}jBI}@ _y@coBI?SO pUusA@`@ rHm~CuB@ }n@soCe@jA okAq_BYF yy@qzB?I cD}_BI? d_@_sB?@ jjAksCDf@ pjAcrCH`A d_@}rBD`B j_@{oB?P ufAotAo@X i_AkcABHWLBF jR}sDaBB ytAizBo@G zLukAKOg@B |MglAa@P jGi\\DtAO|@ _Ns|AmAA ojBalCMTg@D siBsmC[p@ oh@sjCIJBZ bg@qsCAI fg@qqCC_A y|@avCAW[Q@g@ j_@ioBDlA p_@{lB?R soA_h@KbAWVEXYu@ mfAgx@s@C _fAgx@M? lbBuqD\\~B ojAy~A_@W kJ}aA?i@ g_BuzBWb@ u_BcxBIm@ m[igCqAC wgAcbBe@E csBgvCA? esBgvCkAO quBwvC[E xBgcDA@ vA}~C?P |Dk~CeB? uJcyBc@A {e@uq@g@] s`@aw@O? iDgtBSP }hAibBw@G {fA_bB[C sk@_oA?_@ er@}cCk@C yx@acCAV {x@ibCE`@ emAacB_@C okAubBu@K ujAqbBG? ih@abBIQP]M] ih@_bB?A yc@maB_@F wb@_cBYn@G@ gn@khBGB on@ghB]TQe@ }i@weBMN oh@odBI@ uh@kiCCd@ wf@_hCaAE gf@_hCO? mRctCSHQ`@ u}@sxCHmA wbBgfBUC }aBcfBYC fF_uBkA? ay@gaC?B wlAkvBe@] ihBknCi@V }yAsdBGA ezAudBUA {zAwdBUC vgAiaC{CT zbAs`CHjA {g@_mCKoA }NewC@kA jmBelDuCb@ qFudB?B qFkbB?C t}Aw~Be@aE ~}Ai}BIm@ ucBowBIOGB idBsvBOYPM wGcpAAm@ u|@mjAQ`A dIauBQ? rHauBkA@ dOeuBw@? xOguBS@ `G_`Bw@@ hE}_BeA? }jAqbBQC hdAevBEc@ ldAguBC] h`CitCyAV nzB{lCk@oD wz@odCEA }z@qdCmAK ~i@s~@o@@AQ eqBgwCPqA qqB}uCq@I eqBgwCKh@ _Z{_CcA_@Ea@ cx@{x@e@C ox@st@mAN ydAcx@e@C gdAcx@Q? rcCaxDQ`@X@VjAu@J kaAwoBQOo@L aaAuoBIA jdBocDWg@ feB_bD[o@ {_AaaBEA _}@y`B{AG ~Lc`Ba@@ |ByfDCpB fTkjCiBB |PgjCm@@ olA}xAk@C wkAyxAWC ob@aeB?A trBulBsDnG x]{jCiCF cp@w_BI? lMeuBe@@ }w@wmB@M }v@slBEQOCIM ev@ykBQEES myAkkCOA ph@qbCEcA yhAmwAWG yUodAoBC iYsdAE? uGohAYP]GYF uGohAAaA lf@o}B_@@ le@m}BwBF os@mx@gAG qs@ws@oAU wqA_f@[JR\\ s[gnBSJOS e[ipBM`A _ZmqBe@b@ a~@}pBAH oyB_mD_@{@T}@O}A k}@}dCSC `C}{CWd@_@R mk@ueA?aA mk@geA?M v_BetBCU v_BetBP|A `aBomBWwB `aBomBXdC zaBiiBD`@ gyAauCe@Ae@PYM n}BgmDw@G qpAwkAQF ioAqmASJAXQD?L _`BqyBG? g`BqyBg@L oaBcyBDVa@F wxAwqBKO irAocBKA urAqcBg@C }sAucB]C fdCm{Av@GLE@SmAT piCa}AQEe@TO?GVZBHOh@[ |hCwcBTtAYd@w@FoBp@ `mBedB[f@ yh@ehC@j@O^ qX}~BESg@I mvB}vCw@K exBiwCEA azBwrCo@M vgBg|AQ[KyEaABa@`@Wa@[mC dlB}bBmCtE mpBceC]?EOMrA |f@sqACm@ dg@snAG_B wyAgxAi@G q|AowAA@ qjAwqA_@h@ ~{BkcEAh@k@\\Um@BUNMVLVC wz@erBIIWJ sz@ypBMD?B ed@ygCaAE ibAexA@YIM }`AmwAIOU@KI ldCquCcCf@ _[w|@c@w@ yoAecBoAI krAww@HuAUQ `Uk`BqA@ nRi`BM@ q}BkqCMBK`@ }|BooCQCAGO@IK `Rg`BqA@ {sAa`@U^ dRiuBkA@ wLeyBo@A yKeyB]? yJqmCW? {yBccD_@fB {zB{_DQt@ nUm`BM@ {PabD@u@ r`@s_DoCH fZs`Bw@@ zZs`BS? s{@anACL m{@{nAEX uk@_qBWt@ ml@}nB?K spB}|B_@u@ fdBofAuIdE `k@waBaDJ f}@}wDwDX drAm{DqGp@ gl@_v@InA qi@ms@qAHMK qJ}|@]Z oKa|@M^BX qbAmyAo@] okAkiBED kiAojBq@d@QA {hAckBOR saB_yCHYb@ISWPI?W_AiA }{Aen@s@`AFl@k@pA qLar@_@iB rgBu~Ci@h@ rgBizCOi@ fjBynCsAoJ bpBepC{Dj@ iq@{cC[A a]g}A_AC a_@k}AK?OVAPTV dmCwxB@Xa@X vmC}xBLf@Gb@Hh@MT aeAes@GSg@M ej@ygBAc@O]HO w\\onB]D _l@{lBUk@FU qk@ykBMa@ fC}tBy@? lA}tBe@? ou@}iBEe@ kJgcA?] kJedAi@A k~BwuCI@ o}B{uCID q{BesCQEAF o}B{uCBW m|A_uCaAMa@U cfBauAE]M_@ jUqxA@x@ ~AmmCKXDZ xAwkCMHA\\ de@siDAM pe@{dDKwC cWcuBMf@ qW{sBKN }a@azAQR }a@azAW_@FK gh@ooCI_@Fm@ pd@}pDFvA aa@qi@{@[ d`@}`BqAB r]y`BwAD d[e}AW@ `kAeeAKmA blAs}@_DRKcB blAs}@a@qF sk@yz@IdA uKgdAA? kJedA@w@ gJ}gAA~@ p}BcaCO{@ }`A{uAa@C lqA}iCaBN xxAudDa@\\y@a@ |uAydDST@|@a@`ABn@i@XEbAYP uB}tBe@\\MG aDgrBKWSEBO `v@ybBs@D rx@acBqAF nOe`BoA@ wGqjA?w@ iFaiAk@P yCojAoAl@ xe@{}AGmB lf@qxAEeA zkAqeBgDV rgA}}A_@{E rgA}}A^fF ~hAatAKsA viAonAWqD `qCsjCOlAXbAHzAQp@ qZ}{@DSSE gZy{@IC izBwsDBYcAcE[?Kd@WFeAm@@MWCmAf@wAdH _v@caDCGQJYHBHL@\\Y ap@aaDgAe@{@Hq@\\GWoAM oFggB?C riA{yDgCT qtAonCc@y@d@w@ sy@k|BBc@ yy@{zBDo@ {lBaaCKM slBg`C@KIM glB_`CKG nGkjAERM?]SIh@e@o@ mw@i`B}@E kv@g`Ba@A qiAuwA_@S t|Bs{Ba@p@ r{BazBU`@ |zB_yB_BlC akAcuBEOQAMa@OJ }jA{tBAN }jA{tBCG of@gwC_@cA _uBkkCUY_AO mgAwmBBV_@f@ yYocDoAq@ g\\yaDsC`@ yYocD_@JOb@]D qkB_wBCN aiBovBNHBZS`@o@j@Dc@SC {|Bq{CUF k}B{yCEm@ o{BkxC[c@_@K }_BwvCw@e@@a@ hmCa_DsA_C qp@etAA? gMow@G? qMku@@cA qLar@Eb@ o|A}yBWL g}AoyBe@T a|A{vBCG y]gpAAV }[qlAGWWO@IQ?MS?W }[olA?A `C}{CAOc@c@CY }~@__ASr@ }~@c_A?B yk@cvBDy@ {r@cjBQO y{@crBQG j@gcCUNAV sc@gw@U? s`C{pC_B_AEZGU^mAZMNJ[BWl@b@Vn@G g`C_qC@O yb@s}ADGCIW@CMI? {b@q|ACGDY moByiCy@P mwAgdAAI qtAmgAc@h@?V gcBitBI_@ moBs|C@b@MIQNGn@ amAmgB_@@]a@ _oAmhBYP ad@kp@k@_@ ~bAyxDwDZ rg@miAEw@ vg@ehACg@ ivAgpBMkA uuAunBC[OU {NqyCAS eNq|C?NS@QXL^ shAqfBg@Y iVqnDYKW\\sAGi@Vw@IvCnAfAv@ iu@wiBEE [mzBAY gp@cgCKg@ jtA{~@gGf@ b`CsvAMXAHUJIIZe@R? baCssAGAa@v@N@Rc@DS baCa{AiAVEbAs@H ykAapAo@VWX ms@sjBUX_@FEE a`CsoCGTOYe@KDMXGP^JD g`C_qCHJPN?HWOOQ qLeqDcAP@N]HMh@]_@w@^ cRcdDFSg@_@ yPwcDi@K mEkoBIDIAMD oD}pBMFBLSZ yCuqBUV uD_yBo@? `kA}{CMI ~g@eeAG_B sbAoeCELGC?IFEDD caAwdCi@PMQYN idBg}Bc@G ecB_}Bc@G bn@__AG@ pe@{dD@T ~e@a`D?L adBmuBCO adBmuBNXATIH]SKR]L qX}~BDR]d@ oT{mCQA w`Bq|BA? y`Bq|Bg@G tKajC_@X cjB_|BCN gjBo{BCJ _hBayBG?BOHIC]S] kbBcxBi@R }p@gx@qAE {q@is@u@M }p@gx@B\\o@h@D`@QNXb@ edB}uBCS qcBiuBOC }y@etAMr@ UmmCaA? ghAcwAQI coBe~Ai@e@ uy@auAWA mz@cuASA uy@auAGZ cp@gmCQjA ooAyaCAH ooAyaCFq@ goAkcC?A {Hal@AA owA}wAgAI wKgdAs@? nlC}yBJQ_@M qjBmzBSbA ekBixBKh@ v}@ucBcDR qfB_zBYU p|AmvDa@fAAp@ l{AsrDLHq@n@g@pA ky@o`BWC cz@s`BC? }WqfDUVMACE?EFOLAPF kWocD[Y]T ajBynB@K mrBelCDc@ sfAwtAa@cA ziAuvCNhB kdBqmCE? qdBqmCcBU gk@_~@AiA ik@i`A?Q wu@ux@Q? anAonASP unA}mAQF i^olBDMGK k^imBGG u]inB]V sPkyBo@C }cCkeDIFBFOR[SELEA?OGE sdC{bD?KEEGH@JJC ibC_cDONM_@OCFy@ eF_yBY? quBwvCV[Ia@Fa@ |mCixC}@R hmCa_DPRIl@XvAM|@ o}A}{BgBS il@{sAcAE lZc}AgAB nw@cwD{CP qtAa_@]~@k@AYV wlBkrBEI }lBurB_AU omBaoBKuAQGOk@ {kBioBIy@QOJIKM iTqdDy@Uc@c@[TVdA iiAcsBMOUP aiAmpBEEJi@Me@ qo@cfDy@Ec@S ad@kp@@Li@NYg@y@[HvAXAARPJ slBwjC{@R elBekCML pyBkbELn@ gz@s`Bu@C Mg}BGD jlCu{BOV cgAedB?Q edAcbBu@YGY_@M ui@idDo@FOWUJ{@o@i@E oqBetCAw@ qqB}pCeAM otAarCF?Fi@{Ag@ zlA{cCFv@cDX ~gAiaCG? }Xsv@wAC }Xsv@AA _fB}fBWC mPu|AM? ~}Ai}BNnA r_B{tBc@}D lXgtDaEH e_@{rAW]M?B[JEG] e_@_rAKOJK u^uqAOI uwAk\\e@vA{@L abBy|Bc@E _]adCAT u\\ibCKa@ i\\}aCKK q_A{{@?o@ mm@qhBYD {j@ahBe@? roBclDgAA thBakDA? hcCi}DHfD fd@auDcDJ fd@auDDnA _bAmsC_@nB goB_}CEJ _wAcdBC? q|@yjACJ f|A_xDHp@ dA}hAi@Yw@E amAw`BKMWADI nXq`B_BB kaBaV@VLTbBpAKFYMy@k@cAsB wzAeYiAjAGp@MJk@S wyAiPGYy@k@]FMNlBl@ mxAyOEQUCDRT@ iwAcPCFOA?MJCFJ cc@wfDDRq@]OH ~yB{`ET\\Md@D`@ iFoqDwALCTU@o@Ye@A m}@oy@{AI i`Ayy@a@z@ kMgdAE? moAw|BG[DS ipAu|BFu@ {j@eaCDs@ uj@ybC[LWA }j@_`CA\\ }j@_`C@e@ wqA}kCyAqA {rAejCwAO wqA}kCIz@YC {vAstCkAM qkBwhCa@_A gjBklBKL hs@m_AK? |r@m_AyCL qe@}~Cc@J ge@{_DEHFLKD qVmpCEZ wVqoCIp@ qkAmpAGJ siByoBKR _~Ai{Ba@@EP k|Aa{Bg@OKF e|Au{Bi@G acAqaBc@Q xqBelDeA@ ay@caCEx@ vhAu}CaEZ tbAy|CwDX biAm{CKgA ~kAc{C]Y brAc{CUQo@TUWgAX_@E |h@w}BGuA pm@c~BsCJ _mBqcCk@`@ _pA{~BDc@ qoAoaCGn@ _`@cgBME]T ka@sfB]REZ ovAqw@q@xB ugBexA}@y@ yn@arCPs@Q[ njCgwCk@J biC{vCuCh@ rgBu~CGg@cAaA m`BwlCy@K gbBcmCcAM {uAgy@St@ jDkpD?jA z{@i`AgAF ||@}~@[R]z@_@R ||@}~@PSE]m@D anA_cBCE _nAqaBAm@ gTsyBe@A _e@wfDw@Jw@dAe@C arA{jAOF q_A{{@@ZST c`Aiz@EN zC_uBS@ rr@qvD{CP ugBgnCSC kkBahB_@E kjBygB_@G yb@s}Aa@C mb@m{AJGCCK?GGHEAGIA gnAgiCoBuA gnAgiCEZ k|@krBICILMB Ku~BAl@ _^qkBIS?I _Xim@e@SEXkAv@ kaA}w@{AE uV{vBAK uV{vBMv@ }c@q~AQHGQ ~|B{wAiAbB hOkUmAj@cA? tzBwtAc@hAF~AM@A^}DV kxBkwCcB_@ vkCcrBHb@`@L@`A}@dC y_Bef@a@z@ oPkdAo@? arBgnCNuA wsBkqCGA oFijB?R b[wuB}AD sXwrBk@h@ bdAiwBO{B evAwwAi@E gPkyBK? gNgyB_AC goAumAAB sdAupBUKSd@ }eA{oBYJ rhBakDy@L |h@w}BoAF iy@y~BEh@ gy@i_CAN {bBu[DkA c~@spB_@F m}@}qBS^ hA}c@iD_B vJ_Tk@Jk@d@u@WJeB ry@a`AiER }]okBAA twA_lDe@D ~wAslDIR sk@}wBDiA vgBg|ADZ[dBc@f@ zgBuuA}@g@ {g@_mCCf@Ob@ ktAwxAMd@k@E aoAo_CEIQE {tBwyC@O hjAqjAQ}B hjAqjAJ|A wf@}}AA? wd@y~ADOGO oFaoBA? km@k_DWm@}@G {r@{zCCi@ nOejCyBB _vAy~@Iy@ oSsl@w@Ju@K ik@{`AA}@ e`BulCGA laAm_AoCN mFinBCW oF}lB@k@ ld@qrDBr@ xxAudDAk@_@QFaAo@cB fcByhD[VKf@r@`A cBosDY?@uA]BSHSrBg@R cRcdDeAM }Pg`D@y@ ukAeiBDL[`@UF {iAkgBs@_A wvAsrBSBMR]B uyAktBEQYJ cyAgrBQcA u`@sgCC? f@}tBe@? ~AmmCW? FmmC]? m^yyA[o@ vfCilDu@{C rk@_zCE? lk@_zCyCN rf@oyCF|A zf@qvCDtA siBumBYJ?WJW ~kCuwCo@L `yAgnDa@r@ lA{fCEN ypAuyBQA wnAoxBM[ }b@mj@a@] yjBckBWH eqB_hCAU _qBggCEW {pByfCCM mpBqfCMG `GuWKh@ tjCacDYs@ gi@yeCm@~A Pu`CC`@MC?F ?o_CKJ?L b~@wcBK@ zaBiiBgEb@ rfAydBsBL ~bAkdB{CR qr@yiBII {q@ohBUI?_@ xf@asACs@ k|BgmCG@KCHQD@BP _{B_nCCWFg@ _{B_nCy@[CS ipBcfC@GEE aWexBEm@_@M mUuyBs@n@ klBghBk@I wmBqhB_@`A iv@ux@y@E av@mt@mAE _B}f@kAw@ |}Bo}Bg@z@ pMs~Ci@@ grBshCc@S srBufCs@Q ziBoqAPBH`ACN[F hkBulAq@Q?i@ jsBsmAaG\\ `lAaiCQoB bC}_Bg@? uFo|A_B? uIo|Ac@A _GczAAL enB_bDSz@ goB_}CTo@Gs@ ugA{vAQG ehAusAIF }BajAOSKD e@ajAa@Ku@J rfAydBMkB gjAerAIL v{BomD_A? {jAyq@G^a@LQ\\ soA_h@Y}@ f~Bq~BI`@ _tBmqCa@@m@S cgBsvBFGEo@IMXe@ wVgwBI] {|ByqCI@KJ eqBafDcBY _uBc~CAyA _a@}vAIOLMEMa@M@MMG {bBgWCi@T`@FOK}@QJBcA c_BoUgAQ qb@ciDi@e@oAIMD?Fr@BAJd@`@ w^}lDIKmBeATf@d@PDNd@RNK {^{yAy@C ytBgzCBsA auB}`DD][S |`@u_DI@ ~e@s_DJrC w[kk@LLKJaALOVyAE |oAgfBaCT gx@{tAm@E mpA}i@By@ siB_zAaA[g@NeAyB xhCkgDaA}C s`AqgCG{@YQEU efAu{Aq@Y ouAs|@B]Sg@ mmBeeDUE anBcbDDI@i@HI@c@ mcBkfBqAQ kjBc{BET _hBayBDABj@QSGACN u[wv@UA _d@kk@s@A_@LY\\D\\Y[UJSq@P?PY`AONe@SE foCs}B?ZR`@YBi@v@U@FQKi@ nkAqlCSoB uk@_qBEW quAuz@@}@ wrA_{@yAH qhAofBAA caCsaDYOK[ epBmeCCU epBmeCGH f`@}`BA? oeA_dC}@Y _~@aeCq@G q_AieCq@P u`@_zAg@A o`@{uA@]QC c`@yuAKA vzBq}DIC s{@guAq@E r_Bg~DoC^ b{Ag}DVhB x_Bg}DE_@ ejBidDgB[ anBcbDCB zdBm_EoBV `~Bg_C@J uwBulC]M rt@_v@m@`B@`AUt@uAtAq@R iuA{mBKY ooAym@Y`A ocCmeDM@ cqAokA]R pTq\\Ar@a@h@Oz@ aLam@_CUmBb@ }Kkn@LNQX uRonDg@^kAa@ cSweDmByB mD}_BeAA sFi~A?T ncB}lDB`B ffBojDsAR xfBsjDQB itB{fD{@O avB_cDUm@T_@C}@ wuBobDIO y`@sgCeAC }xB_jD@c@WBRWOg@ s|AmwAoAx@ eNq|CES [}iAIC e[mfC]f@ c\\eeCYPAP heAgoBDjA ikB_eCSDIZWJ gmBoaCc@_@ zA}_B{A? ok@_kAAeA iZggCc@A eY_x@JGYMBm@MKDOMEAS _Yuv@KID_@ }Vsl@u@NIQ\\S oFkgB?iA grBimCD] |mCixCPj@ElA dbCwsDI?I^ `eCeqDUs@De@m@N]G axAws@]p@ qfAgt@O? aqAohBWKDQ |bCetDWL wm@ecCOK gn@qcCq@C lt@sbBuAF vAiiCMe@ vAiiCLh@Wb@ wgAo|AG_@ kNe}C[k@m@UG_@ cgAwdBSMASWU }kBo|Bw@`@MIWB biAm{CDh@ rjAg|Ci@bA tyAygBcE^ r{AehB}@J }{@w`Ba@A m{Be~CEb@c@ZCR iyAwgAqAi@cAsADOg@GK[ rf@oyCGo@ _oAeyAgAG _hAo}AM?CO]M xT}~C_BB }kA}gCiAi@ a_AgdAGZ yCuqBGQ be@ajDIcC epBmeCUOEMC@ hiAczCPlB vg@skCFtA zbAs`C{DX ziCudDa@uA edAuaBuAI b{Ag}D_Ed@ z{A}yDJ|@ k~BepCk@c@ e|BcsCUh@ xXec@q@t@Oh@u@d@Kl@FTKH sZmhAUg@JESELi@c@QHQ qZkhAAA ghCchDe@g@OPIi@WGc@}@t@_AP?DN^WPgAv@? anA_cBw@E ucAgdC]R[K eqBifCQDQK si@s}CYg@OF[a@SNDZKLWo@ evBkgD@s@SSWFEO uwB{iDeAvE zT}nAY\\g@A oiAm~AALIBGG nf@wwAAY ak@usAg@E `aB{wDg@kD daBkwDCO q]qjBK] e_@{rAiBE }k@sx@AX tf@utAEaB utB{|CIg@ jh@udCKgC ggA_oBM? wfB_wA]e@ kj@igBUEDQ ej@ygBEN dfAehBKwA bz@y{@eB`CiAv@ yjBckB?SDE orBoiCoA{@ gbBg~CgAwBy@o@]C buAa|D}AR pcCa~Aa@x@k@d@ fdCm{AUBCKRC ~eCwvACJMFEACGLKL@ }sAugASF owAqdA_@e@TMGGWFWOFa@ |GijAMA scBisBC@c@KKN gh@kzCk@gB uf@q~CKVFx@]EFd@WR irBofCIE oiBk~BY_@ yGwtA?@ yGqqA?cB xmCqtBUh@a@DI\\ {tAycBcAI yo@ucCo@E jGi\\YaA l|A{kCg@D sxBcmCkA[ q_BcvCKS m_BimA_@kB }Hcl@cB] {k@wqBEq@ uqA{b@T[Q?M] }aBmb@WjC vmC}xBAMICI@?NA@DB e~@yeAK\\ q~@{dAOR rcAe{BMaB mGiwACZ kk@ybAAmA emBsyBk@XWhA wmBevBq@I qGmvAGt@ oZudAQ? a[udAQLNZSPDHGV cjAc~AKU hn@{k@}AbA]@u@s@m@kBw@AMU g|@}kAIb@ `}B_cCqA{H ggBscD}AU y}BuuCQA u~BuuC_ApA w_CiqCME a[udA?A lBcjAg@d@ mcAyoBe@[ yKgz@SPYdA |RwWQf@w@Fi@Z l[mi@sAfE agAgt@yBlA xcC}_EQoBsAhAcBj@]C[T vgBe`E{AV jaBu~Dw@L pyBkbEBeAMIoGjA of@gwCBTOHY] _oA{x@U? ktAykB]aA og@kyCSCC[ apAk~B@O aoAo_COZ@J cnBkeDaBU jcBumDBV gn@qcCa@e@]kA vuBqqCsDj@ |uBqqCE? va@sn@cALYp@c@No@r@ }~@c_ABKIc@ djBynC}HbA fjBynCA? pFk^c@w@ okBg|Bu@rA x}Bg`CF^ nlC}yBIxA b~B{~BBH sFk`B@_A cgBsvBGd@[ZAN lDqjAA? gzBemC?IMGCHPF ksBgiCoCs@u@{@F^KBISQN[QdDbC~@\\ c_BsuAyA~@ ubBasAm@Uy@@Ek@ }aBssAWP ux@edCaAI gkB_tBHHCLM@Ch@OOS? wjB}qBBOECEDCLJ? jeAeyDkAJ hOysDmA@ m`BupAa@q@e@Y shB}wB@HHGNXILQIML }nBksBKcB g`CcaDKJO[ fkCijBE^u@bALf@e@d@H^ _bA_vAUC {nBs{BED@n@OCc@{A hnCotCb@~@Bb@pAdBBh@e@fA uu@o`Dm@Te@@ jDqjAOTYBGSKF ek@m|CAMOGCFJXHK yg@kwCUi@YSSu@_@_@GLH`@h@|A quAuz@Il@ u`@egD{@}@ cc@wfD]{@ ziBoqAWUOqAW] rcB{iDK`@ qkByjB]Cg@jA ql@os@q@FQsA k{@ctCCt@c@H q_AieCa@gA s|@crCYc@ |lCs{BQA bqCsaC{@~B ekBc}BJ[Oi@ ekBc}BHDST R_bCINFX ekBc}B?FWJ }i@weBDOSa@ efBesBi@@u@\\Z{@ or@}fDg@IG`AiA?u@WIhAg@XGOa@?SPJRrAA y]gpAQm@I? eYscDSB psAyfBsBP {kBioB@z@Qf@UYMaA vpBobE_HhA wnBofBuA~BCrAb@N cfCeeD]KD]UCJ]W@IS uwB{iDGKWPGI o~B}~CQK?Ye@_@ be@mo@e@ReAD kDuh@kAy@IUy@[ i\\aeDeAUeAm@ q}Bi{C]sB k}BsvCSSDMa@[@I\\@Na@ z@osD_D? ihAwkBQR wlAmo@QFGVi@KS^ ix@w_DUXaBPS^ un@{u@o@lAPRgAO hkBulAZl@}FvC ug@ewCCE _i@auCQoA uzAqtBk@iA zh@ouDsCL"
    };
}
