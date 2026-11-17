import * as SciChart from "scichart";

// #region_A_start
// Create a JavaScript choropleth map with SciChart.js: each US state is shaded by its population density
const {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    XyDataSeries,
    FastTriangleRenderableSeries,
    ETriangleSeriesDrawMode,
    FastLineRenderableSeries,
    BoxAnnotation,
    NativeTextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EMultiLineAlignment,
    Thickness,
    CustomChartModifier2D,
    translateFromCanvasToSeriesViewRect,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    ZoomExtentsModifier,
    SciChartJsNavyTheme
} = SciChart;
// or, for npm, import { SciChartSurface, ... } from "scichart"

// The classes: five quantile classes of about 10 states each, from the lowest density to the highest.
// The colours run from dark to bright, because on a dark background brighter reads as "more".
const DENSITY_CLASSES = [
    { label: "Under 38", max: 38, color: "#46327E" },
    { label: "38 to 70", max: 70, color: "#365C8D" },
    { label: "70 to 170", max: 170, color: "#1F9A8A" },
    { label: "170 to 290", max: 290, color: "#6CCE59" },
    { label: "290 and over", max: Infinity, color: "#FDE725" }
];

function getClassIndex(value) {
    return DENSITY_CLASSES.findIndex((densityClass) => value < densityClass.max);
}

// 1. TRIANGULATION (plain JavaScript, no SciChart code)
// The triangle series draws triangles, not polygons, so each polygon ring is cut into triangles by ear clipping:
// repeatedly cut off a corner ("ear") that has no other point inside it. Fine for a few thousand points;
// for large or complex maps (with holes), use a tested library such as earcut, or triangulate once offline.
function triangulateRing(ring) {
    const points = [];
    for (const point of ring) {
        const last = points[points.length - 1];
        if (!last || last[0] !== point[0] || last[1] !== point[1]) points.push(point);
    }
    const first = points[0];
    const end = points[points.length - 1];
    if (points.length > 1 && first[0] === end[0] && first[1] === end[1]) points.pop(); // GeoJSON rings repeat the first point

    // Make the ring counter-clockwise, so a convex corner has a positive cross product
    let signedArea = 0;
    points.forEach(([x1, y1], i) => {
        const [x2, y2] = points[(i + 1) % points.length];
        signedArea += x1 * y2 - x2 * y1;
    });
    if (signedArea < 0) points.reverse();

    const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const isInside = (p, a, b, c) => cross(a, b, p) >= 0 && cross(b, c, p) >= 0 && cross(c, a, p) >= 0;

    const remaining = points.slice();
    const triangles = []; // flat list: every three points make one triangle
    while (remaining.length > 3) {
        const n = remaining.length;
        let earIndex = -1;
        for (let i = 0; i < n && earIndex < 0; i++) {
            const a = remaining[(i + n - 1) % n];
            const b = remaining[i];
            const c = remaining[(i + 1) % n];
            if (cross(a, b, c) <= 0) continue; // not a convex corner
            const blocked = remaining.some(
                (p) => p !== a && p !== b && p !== c && !(p[0] === b[0] && p[1] === b[1]) && isInside(p, a, b, c)
            );
            if (!blocked) {
                triangles.push(a, b, c);
                earIndex = i;
            }
        }
        if (earIndex < 0) {
            // No ear found: drop a point that lies on a straight line, or stop
            earIndex = remaining.findIndex((b, i) => cross(remaining[(i + n - 1) % n], b, remaining[(i + 1) % n]) === 0);
            if (earIndex < 0) break;
        }
        remaining.splice(earIndex, 1);
    }
    if (remaining.length === 3) triangles.push(...remaining);
    return triangles;
}

// Is the point inside the ring? (ray casting: count how many edges a horizontal line from the point crosses)
function isPointInRing(x, y, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i];
        const [xj, yj] = ring[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
}

// Outer rings of a Polygon or MultiPolygon geometry (these states have no holes)
function getOuterRings(geometry) {
    return geometry.type === "Polygon" ? [geometry.coordinates[0]] : geometry.coordinates.map((polygon) => polygon[0]);
}

// Flatten rings into x and y arrays with NaN between rings, so one line series draws them all with gaps
function ringsToLine(rings) {
    const xValues = [];
    const yValues = [];
    rings.forEach((ring) => {
        ring.forEach(([x, y]) => {
            xValues.push(x);
            yValues.push(y);
        });
        xValues.push(NaN);
        yValues.push(NaN);
    });
    return { xValues, yValues };
}

// 2. HOVER TOOLTIP: finds the state under the mouse and shows its name and value
class StateTooltipModifier extends CustomChartModifier2D {
    states;
    highlight;
    tooltip;
    hoveredState;

    constructor(states, highlight) {
        super();
        this.states = states;
        this.highlight = highlight;
        this.tooltip = new NativeTextAnnotation({
            text: "",
            isHidden: true,
            textColor: "#FFFFFF",
            fontSize: 15,
            background: "#0F1A2B",
            multiLineAlignment: EMultiLineAlignment.Left,
            padding: new Thickness(6, 10, 6, 10),
            lineSpacing: 4,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom
        });
    }

    onAttach() {
        super.onAttach();
        this.parentSurface.annotations.add(this.tooltip);
    }

    onDetach() {
        this.parentSurface?.annotations.remove(this.tooltip);
        super.onDetach();
    }

    findState(x, y) {
        return this.states.find(
            (state) =>
                x >= state.bounds.minX &&
                x <= state.bounds.maxX &&
                y >= state.bounds.minY &&
                y <= state.bounds.maxY &&
                state.rings.some((ring) => isPointInRing(x, y, ring))
        );
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
        const xAxis = this.parentSurface.xAxes.get(0);
        const yAxis = this.parentSurface.yAxes.get(0);
        const state = point
            ? this.findState(
                  xAxis.getCurrentCoordinateCalculator().getDataValue(point.x),
                  yAxis.getCurrentCoordinateCalculator().getDataValue(point.y)
              )
            : undefined;

        if (state !== this.hoveredState) {
            this.hoveredState = state;
            this.highlight.clear();
            if (state) {
                const { xValues, yValues } = ringsToLine(state.rings);
                this.highlight.appendRange(xValues, yValues);
            }
        }
        if (state) {
            const x = xAxis.getCurrentCoordinateCalculator().getDataValue(point.x);
            const y = yAxis.getCurrentCoordinateCalculator().getDataValue(point.y);
            const nearRightEdge = x > xAxis.visibleRange.min + xAxis.visibleRange.diff * 0.6;
            this.tooltip.text = [
                state.name,
                `${state.density.toLocaleString("en-US")} people per sq mile`,
                `Rank ${state.rank} of ${this.states.length} (1 = densest)`,
                `Population ${state.population.toLocaleString("en-US")}`
            ].join("\n");
            this.tooltip.horizontalAnchorPoint = nearRightEdge ? EHorizontalAnchorPoint.Right : EHorizontalAnchorPoint.Left;
            this.tooltip.x1 = x + xAxis.visibleRange.diff * (nearRightEdge ? -0.012 : 0.012);
            this.tooltip.y1 = y + yAxis.visibleRange.diff * 0.03;
        }
        this.tooltip.isHidden = !state;
    }

    modifierMouseLeave(args) {
        super.modifierMouseLeave(args);
        this.tooltip.isHidden = true;
        this.hoveredState = undefined;
        this.highlight.clear();
    }
}

// 3. THE CHART
// geoJson: a FeatureCollection of Polygon or MultiPolygon features with name, population and density properties,
// in projected x/y coordinates (here kilometres), such as getUsStatesGeoJson() at the end of this file
async function choroplethMap(divElementId, geoJson) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // A map needs no axis labels, but the hidden axes still set the drawing area, so zoom and pan work as usual.
    // The extra space on the right leaves room for the legend; at the bottom, for the SciChart logo.
    const xAxis = new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.02, 0.24) });
    const yAxis = new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.12, 0.03) });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Prepare each state from its GeoJSON feature: rings, bounding box and rank
    const states = geoJson.features.map((feature) => {
        const rings = getOuterRings(feature.geometry);
        const xs = rings.flat().map((p) => p[0]);
        const ys = rings.flat().map((p) => p[1]);
        return {
            ...feature.properties,
            rank: 0, // set below: 1 is the densest
            rings,
            bounds: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
        };
    });
    [...states].sort((a, b) => b.density - a.density).forEach((state, i) => (state.rank = i + 1));

    // Fills: one triangle series per class, holding the triangles of every state in that class
    DENSITY_CLASSES.forEach((densityClass, classIndex) => {
        const triangles = states
            .filter((state) => getClassIndex(state.density) === classIndex)
            .flatMap((state) => state.rings.flatMap((ring) => triangulateRing(ring)));
        sciChartSurface.renderableSeries.add(
            new FastTriangleRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: triangles.map((p) => p[0]),
                    yValues: triangles.map((p) => p[1])
                }),
                drawMode: ETriangleSeriesDrawMode.List, // every three points are one triangle
                fill: densityClass.color
            })
        );
    });

    // Borders: one line series for every state outline
    const borders = ringsToLine(states.flatMap((state) => state.rings));
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { ...borders, isSorted: false, containsNaN: true }),
            stroke: "#0B1424",
            strokeThickness: 1.5
        })
    );

    // Highlight: the hovered state's outline, filled in by the tooltip modifier
    const highlight = new XyDataSeries(wasmContext, { isSorted: false, containsNaN: true });
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, { dataSeries: highlight, stroke: "#FFFFFF", strokeThickness: 3 })
    );

    // Legend: annotations in relative coordinates (0 to 1 across the chart), so it stays put when you zoom
    const relative = { xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative };
    sciChartSurface.annotations.add(
        new BoxAnnotation({ ...relative, x1: 0.795, x2: 0.995, y1: 0.55, y2: 0.97, fill: "#0F1A2BDD", strokeThickness: 0 }),
        new NativeTextAnnotation({
            ...relative,
            x1: 0.81,
            y1: 0.58,
            text: "People per sq mile\n(2020 Census)",
            textColor: "#FFFFFF",
            fontSize: 16,
            multiLineAlignment: EMultiLineAlignment.Left,
            lineSpacing: 3
        })
    );
    DENSITY_CLASSES.forEach((densityClass, i) => {
        const y = 0.68 + i * 0.055;
        sciChartSurface.annotations.add(
            new BoxAnnotation({ ...relative, x1: 0.81, x2: 0.835, y1: y, y2: y + 0.04, fill: densityClass.color, strokeThickness: 0 }),
            new NativeTextAnnotation({
                ...relative,
                x1: 0.845,
                y1: y + 0.02,
                text: densityClass.label,
                textColor: "#FFFFFF",
                fontSize: 15,
                verticalAnchorPoint: EVerticalAnchorPoint.Center
            })
        );
    });

    // Keep the map's shape: one kilometre on the x axis must take the same space as one on the y axis
    sciChartSurface.preRender.subscribe(() => {
        const rect = sciChartSurface.seriesViewRect;
        if (!rect || !rect.width || !rect.height) return; // not laid out yet
        const { width, height } = rect;
        const xRange = xAxis.visibleRange;
        const yRange = yAxis.visibleRange;
        const kmPerPixel = Math.max(xRange.diff / width, yRange.diff / height);
        const xCentre = (xRange.min + xRange.max) / 2;
        const yCentre = (yRange.min + yRange.max) / 2;
        const newX = new NumberRange(xCentre - (kmPerPixel * width) / 2, xCentre + (kmPerPixel * width) / 2);
        const newY = new NumberRange(yCentre - (kmPerPixel * height) / 2, yCentre + (kmPerPixel * height) / 2);
        if (Math.abs(newX.diff - xRange.diff) > 1e-6) xAxis.visibleRange = newX;
        if (Math.abs(newY.diff - yRange.diff) > 1e-6) yAxis.visibleRange = newY;
    });

    sciChartSurface.chartModifiers.add(
        new StateTooltipModifier(states, highlight),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    return { sciChartSurface };
}
// #region_A_end

choroplethMap("scichart-root", getUsStatesGeoJson());

// US states and the District of Columbia as a GeoJSON FeatureCollection.
// Boundaries: US Census Bureau, 2020 cartographic boundary file cb_2020_us_state_20m (public domain, a work of the US government).
// The longitude/latitude were projected to kilometres with an Albers equal-area projection, with Alaska (scaled to 35%)
// and Hawaii moved below the lower 48 as insets, then simplified to about 2,000 points to keep this file small.
// Values: 2020 Census resident population, and population density in people per square mile of land area
// (US Census Bureau, "Historical Population Density Data (1910-2020)").
function getUsStatesGeoJson() {
    return {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: { name: "Alabama", population: 5024279, density: 99.2 },
                geometry: { type: "MultiPolygon", coordinates: [[[[708,-260],[704,-252],[703,-251],[914,-233],[937,-231],[939,-238],[1002,-463],[1027,-507],[1025,-520],[1037,-526],[1023,-542],[1019,-576],[1032,-608],[1030,-648],[1041,-662],[1043,-668],[1040,-668],[797,-693],[795,-708],[820,-729],[817,-746],[825,-753],[812,-772],[799,-777],[777,-780],[785,-770],[761,-731],[753,-773],[730,-767],[727,-769],[707,-596],[708,-260]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Alaska", population: 733391, density: 1.3 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-1406,-1352],[-1404,-1334],[-1390,-1335],[-1363,-1357],[-1351,-1384],[-1369,-1390],[-1383,-1375],[-1392,-1376],[-1406,-1352]]],[[[-1426,-1320],[-1416,-1320],[-1419,-1308],[-1402,-1307],[-1387,-1318],[-1409,-1334],[-1413,-1359],[-1426,-1320]]],[[[-1455,-1266],[-1436,-1272],[-1423,-1289],[-1419,-1300],[-1431,-1315],[-1455,-1266]]],[[[-1482,-1289],[-1470,-1275],[-1450,-1280],[-1424,-1348],[-1450,-1328],[-1447,-1320],[-1457,-1324],[-1482,-1289]]],[[[-1853,-1361],[-1824,-1339],[-1807,-1312],[-1806,-1322],[-1792,-1326],[-1811,-1335],[-1799,-1344],[-1800,-1360],[-1837,-1388],[-1853,-1361]]],[[[-2093,-1225],[-2068,-1220],[-2059,-1241],[-2073,-1247],[-2093,-1225]]],[[[-2155,-1485],[-2139,-1480],[-2133,-1466],[-2112,-1469],[-2131,-1486],[-2155,-1485]]],[[[-2062,-1014],[-1997,-990],[-1985,-992],[-1989,-1011],[-1960,-1017],[-1946,-1010],[-1960,-1004],[-1966,-978],[-1983,-971],[-1989,-949],[-2021,-916],[-2009,-898],[-1970,-894],[-1941,-852],[-1904,-834],[-1885,-836],[-1869,-818],[-1857,-825],[-1862,-837],[-1850,-827],[-1844,-839],[-1816,-837],[-1816,-847],[-1799,-855],[-1776,-849],[-1713,-863],[-1693,-853],[-1659,-867],[-1588,-1222],[-1553,-1213],[-1553,-1223],[-1515,-1248],[-1510,-1261],[-1494,-1246],[-1494,-1229],[-1474,-1219],[-1424,-1256],[-1371,-1313],[-1330,-1318],[-1316,-1347],[-1322,-1372],[-1338,-1359],[-1337,-1373],[-1346,-1372],[-1367,-1341],[-1393,-1332],[-1383,-1319],[-1411,-1303],[-1437,-1269],[-1455,-1264],[-1455,-1274],[-1470,-1271],[-1487,-1283],[-1561,-1247],[-1558,-1235],[-1569,-1243],[-1614,-1237],[-1641,-1244],[-1683,-1234],[-1701,-1240],[-1717,-1262],[-1726,-1253],[-1748,-1260],[-1765,-1283],[-1790,-1293],[-1796,-1284],[-1782,-1272],[-1795,-1267],[-1787,-1230],[-1756,-1217],[-1775,-1208],[-1795,-1225],[-1818,-1271],[-1839,-1287],[-1822,-1303],[-1841,-1332],[-1886,-1359],[-1890,-1375],[-1930,-1394],[-1925,-1403],[-1933,-1412],[-1996,-1431],[-2003,-1420],[-2010,-1433],[-2004,-1442],[-2017,-1439],[-2023,-1448],[-2025,-1440],[-2036,-1441],[-2046,-1446],[-2039,-1454],[-2079,-1458],[-2072,-1439],[-2044,-1440],[-2006,-1409],[-1978,-1413],[-1974,-1397],[-1935,-1380],[-1913,-1352],[-1896,-1303],[-1920,-1310],[-1929,-1298],[-1936,-1318],[-1962,-1289],[-1993,-1306],[-2001,-1301],[-1988,-1270],[-1997,-1242],[-2029,-1252],[-2045,-1220],[-2052,-1220],[-2043,-1200],[-2053,-1195],[-2057,-1168],[-2048,-1168],[-2018,-1119],[-1995,-1128],[-1981,-1115],[-1984,-1108],[-1961,-1116],[-1952,-1103],[-1962,-1079],[-1949,-1069],[-1955,-1062],[-1984,-1080],[-1985,-1071],[-1989,-1077],[-2040,-1061],[-2046,-1038],[-2036,-1034],[-2062,-1014]]],[[[-2141,-1078],[-2137,-1071],[-2126,-1082],[-2115,-1080],[-2091,-1102],[-2110,-1112],[-2141,-1078]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Arizona", population: 7151502, density: 62.9 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-1735,-372],[-1730,-365],[-1704,-356],[-1704,-336],[-1718,-331],[-1718,-303],[-1715,-290],[-1694,-277],[-1687,-236],[-1644,-206],[-1661,-181],[-1673,-122],[-1672,-116],[-1670,-109],[-1657,7],[-1624,5],[-1608,-12],[-1595,5],[-1581,77],[-1578,94],[-1571,93],[-1183,28],[-1144,22],[-1146,9],[-1231,-606],[-1304,-596],[-1421,-578],[-1743,-388],[-1735,-372]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Arkansas", population: 3011524, density: 57.9 },
                geometry: { type: "MultiPolygon", coordinates: [[[[122,-111],[145,-111],[517,-97],[527,-118],[502,-154],[543,-151],[558,-150],[563,-156],[567,-161],[544,-178],[548,-193],[529,-218],[533,-251],[514,-262],[514,-266],[520,-272],[501,-285],[493,-332],[466,-355],[467,-377],[449,-385],[456,-407],[446,-410],[452,-413],[440,-434],[455,-467],[448,-492],[448,-493],[439,-493],[202,-500],[181,-501],[181,-485],[180,-441],[145,-439],[139,-432],[139,-415],[141,-238],[126,-134],[122,-111]]]] }
            },
            {
                type: "Feature",
                properties: { name: "California", population: 39538223, density: 253.7 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-2164,-112],[-2124,-123],[-2119,-131],[-2149,-128],[-2164,-112]]],[[[-2203,-100],[-2176,-112],[-2172,-124],[-2186,-125],[-2212,-103],[-2203,-100]]],[[[-2282,839],[-2281,846],[-1963,755],[-1948,752],[-1952,739],[-2032,426],[-1684,-98],[-1672,-116],[-1673,-122],[-1661,-181],[-1644,-206],[-1687,-236],[-1694,-277],[-1715,-290],[-1718,-303],[-1718,-331],[-1704,-336],[-1704,-356],[-1730,-365],[-1756,-362],[-1953,-339],[-1964,-252],[-2013,-185],[-2037,-181],[-2040,-147],[-2066,-143],[-2091,-127],[-2127,-80],[-2200,-58],[-2212,-42],[-2197,20],[-2216,39],[-2209,59],[-2236,93],[-2270,177],[-2268,209],[-2252,216],[-2249,244],[-2269,252],[-2286,284],[-2278,350],[-2267,351],[-2271,327],[-2252,315],[-2265,368],[-2248,375],[-2256,388],[-2266,386],[-2274,356],[-2299,385],[-2312,387],[-2302,419],[-2342,507],[-2323,605],[-2350,663],[-2348,683],[-2307,735],[-2287,782],[-2290,824],[-2282,839]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Colorado", population: 5773714, density: 55.7 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-1085,448],[-1083,467],[-1017,458],[-706,425],[-669,421],[-630,418],[-503,409],[-508,335],[-510,297],[-512,277],[-531,-35],[-531,-40],[-559,-38],[-601,-35],[-615,-33],[-623,-33],[-1107,17],[-1144,22],[-1136,76],[-1085,448]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Connecticut", population: 3605944, density: 744.7 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1833,703],[1829,728],[1849,732],[1963,759],[1964,757],[1970,736],[1979,681],[1976,683],[1894,653],[1847,613],[1843,609],[1834,620],[1851,637],[1833,703]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Delaware", population: 989948, density: 508.0 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1701,431],[1723,448],[1729,446],[1726,442],[1727,411],[1722,408],[1759,351],[1780,342],[1790,314],[1792,305],[1738,294],[1710,393],[1700,431],[1701,431]]]] }
            },
            {
                type: "Feature",
                properties: { name: "District of Columbia", population: 689545, density: 11280.0 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1607,321],[1612,329],[1625,320],[1621,313],[1617,307],[1616,312],[1610,318],[1607,321]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Florida", population: 21538187, density: 401.4 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1449,-1332],[1469,-1310],[1497,-1304],[1490,-1319],[1471,-1326],[1449,-1332]]],[[[1040,-668],[1043,-668],[1043,-670],[1059,-698],[1312,-681],[1322,-702],[1332,-700],[1326,-658],[1334,-649],[1383,-654],[1384,-655],[1416,-753],[1510,-888],[1509,-919],[1589,-1064],[1598,-1169],[1582,-1211],[1586,-1219],[1597,-1202],[1600,-1209],[1561,-1281],[1519,-1310],[1514,-1306],[1563,-1265],[1571,-1242],[1514,-1261],[1483,-1204],[1436,-1185],[1407,-1130],[1381,-1130],[1362,-1090],[1309,-1022],[1318,-1022],[1334,-987],[1323,-985],[1309,-1013],[1294,-988],[1288,-953],[1302,-916],[1293,-870],[1276,-845],[1255,-851],[1183,-772],[1150,-756],[1130,-760],[1116,-770],[1119,-782],[1101,-783],[1100,-794],[1057,-825],[1026,-820],[1020,-791],[935,-753],[895,-751],[821,-769],[812,-772],[825,-753],[817,-746],[820,-729],[795,-708],[797,-693],[1040,-668]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Georgia", population: 10711908, density: 185.6 },
                geometry: { type: "MultiPolygon", coordinates: [[[[937,-231],[949,-230],[1035,-219],[1052,-217],[1069,-215],[1142,-205],[1161,-202],[1160,-207],[1145,-240],[1190,-258],[1227,-312],[1292,-357],[1293,-370],[1313,-389],[1338,-401],[1355,-444],[1384,-471],[1389,-495],[1412,-500],[1416,-501],[1395,-538],[1380,-648],[1383,-654],[1334,-649],[1326,-658],[1332,-700],[1322,-702],[1312,-681],[1059,-698],[1043,-670],[1043,-668],[1041,-662],[1030,-648],[1032,-608],[1019,-576],[1023,-542],[1037,-526],[1025,-520],[1027,-507],[1002,-463],[939,-238],[937,-231]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Hawaii", population: 1455271, density: 226.6 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-868,-1409],[-845,-1387],[-848,-1355],[-776,-1391],[-767,-1414],[-759,-1413],[-738,-1439],[-760,-1458],[-811,-1480],[-828,-1505],[-854,-1485],[-851,-1457],[-868,-1409]]],[[[-937,-1283],[-928,-1271],[-914,-1286],[-889,-1281],[-862,-1302],[-903,-1321],[-913,-1297],[-937,-1283]]],[[[-974,-1284],[-955,-1286],[-951,-1300],[-965,-1304],[-974,-1284]]],[[[-997,-1257],[-995,-1249],[-938,-1257],[-955,-1269],[-1000,-1263],[-997,-1257]]],[[[-1096,-1210],[-1069,-1195],[-1056,-1223],[-1043,-1224],[-1036,-1240],[-1083,-1241],[-1096,-1210]]],[[[-1257,-1155],[-1236,-1138],[-1218,-1137],[-1206,-1149],[-1222,-1177],[-1255,-1165],[-1257,-1155]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Idaho", population: 1839106, density: 22.3 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-1604,1124],[-1605,1128],[-1605,1136],[-1607,1169],[-1541,1454],[-1521,1449],[-1497,1444],[-1470,1438],[-1493,1331],[-1476,1293],[-1481,1262],[-1457,1239],[-1426,1174],[-1395,1158],[-1420,1109],[-1416,1076],[-1431,1067],[-1432,1042],[-1416,1030],[-1388,1050],[-1378,1036],[-1378,1005],[-1361,972],[-1366,956],[-1343,935],[-1331,889],[-1315,900],[-1291,890],[-1281,902],[-1225,891],[-1207,911],[-1191,879],[-1186,875],[-1188,865],[-1223,641],[-1229,603],[-1256,607],[-1454,640],[-1472,644],[-1491,648],[-1710,695],[-1711,695],[-1702,736],[-1666,894],[-1648,928],[-1670,948],[-1669,959],[-1580,1079],[-1604,1124]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Illinois", population: 12812508, density: 230.8 },
                geometry: { type: "MultiPolygon", coordinates: [[[[381,326],[384,332],[388,335],[387,355],[408,367],[420,399],[419,416],[405,431],[411,451],[457,465],[478,498],[478,531],[436,570],[436,574],[453,575],[667,589],[668,581],[670,557],[697,505],[697,503],[720,240],[713,219],[729,174],[694,112],[689,69],[693,63],[691,56],[683,46],[693,28],[658,15],[660,-22],[613,-8],[604,-32],[604,-36],[598,-36],[583,-31],[568,-5],[575,9],[564,41],[534,63],[528,59],[487,97],[505,167],[480,178],[467,167],[458,172],[449,210],[392,260],[381,326]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Indiana", population: 6785528, density: 189.4 },
                geometry: { type: "MultiPolygon", coordinates: [[[[697,503],[702,500],[720,495],[748,510],[754,514],[919,532],[920,525],[923,507],[952,250],[953,236],[950,233],[958,201],[927,186],[905,187],[908,166],[890,138],[879,135],[864,98],[837,115],[821,101],[823,86],[815,80],[796,94],[780,84],[773,66],[744,84],[727,72],[701,76],[698,61],[693,63],[689,69],[694,112],[729,174],[713,219],[720,240],[697,503]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Iowa", population: 3190369, density: 57.1 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-48,673],[-36,673],[-16,673],[362,681],[384,682],[383,677],[398,656],[389,642],[400,602],[433,582],[436,574],[436,570],[478,531],[478,498],[457,465],[411,451],[405,431],[419,416],[420,399],[408,367],[387,355],[388,335],[384,332],[378,335],[357,358],[39,346],[20,346],[21,348],[9,363],[16,380],[6,444],[-7,452],[-5,482],[-28,524],[-31,557],[-36,560],[-39,562],[-51,586],[-35,630],[-48,673]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Kansas", population: 2937880, density: 35.9 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-510,297],[-492,296],[56,281],[58,281],[65,275],[95,262],[97,253],[75,231],[102,192],[120,187],[121,-49],[122,-55],[113,-56],[-530,-40],[-531,-40],[-531,-35],[-512,277],[-510,297]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Kentucky", population: 4505836, density: 114.1 },
                geometry: { type: "MultiPolygon", coordinates: [[[[607,-39],[604,-36],[604,-32],[613,-8],[660,-22],[658,15],[693,28],[683,46],[691,56],[693,63],[698,61],[701,76],[727,72],[744,84],[773,66],[780,84],[796,94],[815,80],[823,86],[821,101],[837,115],[864,98],[879,135],[890,138],[908,166],[905,187],[927,186],[958,201],[950,233],[953,236],[959,242],[972,235],[985,241],[1009,209],[1040,207],[1057,195],[1068,205],[1091,196],[1122,219],[1128,202],[1150,191],[1153,185],[1153,180],[1154,153],[1170,130],[1212,94],[1221,95],[1203,73],[1162,38],[1132,-8],[1092,-26],[1087,-30],[1086,-33],[700,-63],[703,-83],[582,-92],[572,-93],[568,-89],[585,-78],[599,-83],[607,-39]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Louisiana", population: 4657757, density: 107.8 },
                geometry: { type: "MultiPolygon", coordinates: [[[[182,-516],[181,-501],[202,-500],[439,-493],[448,-493],[451,-495],[462,-555],[474,-566],[469,-580],[458,-581],[461,-602],[437,-623],[441,-634],[423,-662],[425,-686],[413,-692],[421,-713],[414,-719],[596,-708],[589,-749],[621,-798],[614,-803],[592,-818],[612,-834],[625,-814],[654,-799],[649,-844],[636,-843],[636,-853],[618,-862],[626,-881],[659,-889],[678,-907],[667,-928],[655,-921],[643,-936],[645,-920],[632,-905],[597,-896],[561,-924],[499,-931],[491,-920],[458,-912],[459,-899],[421,-871],[418,-858],[400,-864],[399,-872],[415,-878],[404,-889],[380,-878],[332,-881],[272,-861],[212,-869],[209,-872],[200,-859],[221,-831],[217,-776],[235,-733],[234,-704],[184,-615],[182,-516]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Maine", population: 1362359, density: 44.2 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1925,1128],[1929,1129],[1945,1125],[1942,1143],[1957,1145],[1947,1157],[1970,1207],[1959,1238],[1969,1269],[1966,1299],[1999,1396],[2014,1396],[2019,1377],[2031,1373],[2072,1406],[2116,1386],[2160,1238],[2188,1238],[2197,1202],[2212,1190],[2224,1198],[2252,1166],[2233,1135],[2222,1132],[2217,1110],[2209,1119],[2185,1089],[2173,1090],[2179,1075],[2168,1073],[2171,1059],[2152,1042],[2146,1048],[2132,1038],[2126,1052],[2113,1056],[2118,1028],[2103,1010],[2094,1019],[2068,982],[2060,988],[2043,972],[2033,932],[2024,925],[2022,896],[2020,894],[1989,922],[1925,1128]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Maryland", population: 6177224, density: 636.1 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1396,350],[1393,371],[1400,372],[1671,425],[1700,431],[1710,393],[1738,294],[1792,305],[1792,291],[1789,263],[1786,255],[1752,239],[1747,240],[1734,231],[1726,267],[1713,265],[1720,246],[1712,250],[1683,286],[1692,309],[1672,314],[1687,326],[1684,336],[1671,325],[1670,335],[1688,397],[1651,358],[1666,342],[1658,311],[1694,236],[1668,251],[1643,252],[1626,269],[1611,259],[1605,275],[1613,286],[1613,288],[1617,306],[1617,307],[1621,313],[1625,320],[1612,329],[1607,321],[1575,331],[1572,347],[1552,354],[1548,354],[1545,357],[1533,381],[1510,387],[1486,376],[1482,365],[1461,364],[1454,372],[1442,347],[1430,349],[1402,314],[1396,350]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Massachusetts", population: 7029917, density: 901.2 },
                geometry: { type: "MultiPolygon", coordinates: [[[[2060,707],[2074,726],[2091,715],[2064,696],[2060,707]]],[[[1828,795],[1828,808],[1838,810],[1887,821],[1892,822],[1984,842],[2000,865],[2017,871],[2020,862],[2041,850],[2017,819],[2022,803],[2043,802],[2056,776],[2079,758],[2111,771],[2100,794],[2085,796],[2101,801],[2124,756],[2120,745],[2116,759],[2092,748],[2049,710],[2063,737],[2035,718],[2033,716],[1997,767],[1979,762],[1964,757],[1963,759],[1849,732],[1829,728],[1828,728],[1828,795]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Michigan", population: 10077331, density: 178.0 },
                geometry: { type: "MultiPolygon", coordinates: [[[[798,965],[811,977],[823,972],[811,948],[799,961],[798,965]]],[[[764,524],[793,606],[789,656],[757,727],[763,749],[754,773],[770,807],[768,846],[816,908],[822,882],[832,892],[829,917],[863,936],[847,947],[851,974],[869,979],[916,966],[925,953],[974,944],[997,910],[982,911],[1001,872],[1001,832],[988,823],[986,799],[965,786],[966,753],[985,747],[1002,786],[1037,808],[1064,785],[1095,696],[1093,654],[1081,639],[1082,655],[1070,650],[1074,643],[1051,609],[1051,586],[1033,544],[1030,543],[950,530],[920,525],[919,532],[754,514],[764,524]]],[[[509,1181],[566,1218],[533,1181],[514,1172],[509,1181]]],[[[428,1027],[434,1032],[536,1083],[574,1126],[610,1141],[635,1133],[610,1131],[574,1068],[598,1083],[627,1076],[662,1038],[691,1042],[705,1035],[713,1048],[724,1041],[754,1065],[842,1086],[845,1053],[882,1053],[910,1066],[915,1028],[934,1015],[955,1024],[963,1005],[889,1003],[871,993],[874,986],[837,1005],[806,1004],[780,984],[751,983],[728,936],[725,957],[715,965],[701,948],[693,953],[661,891],[659,880],[646,890],[651,910],[635,906],[638,943],[612,954],[610,968],[452,1003],[444,1020],[428,1027]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Minnesota", population: 5706494, density: 71.7 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-91,1283],[-69,1283],[63,1283],[62,1325],[77,1323],[87,1318],[97,1260],[160,1244],[163,1232],[226,1246],[250,1237],[271,1202],[279,1217],[294,1218],[334,1186],[385,1210],[397,1194],[488,1191],[397,1142],[301,1047],[305,1036],[284,1030],[286,965],[254,943],[243,924],[243,908],[262,893],[253,876],[252,818],[363,737],[380,713],[382,690],[384,682],[362,681],[-16,673],[-36,673],[-36,679],[-36,874],[-66,909],[-44,937],[-44,944],[-44,953],[-61,1022],[-64,1126],[-86,1192],[-82,1247],[-91,1283]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Mississippi", population: 2961279, density: 63.1 },
                geometry: { type: "MultiPolygon", coordinates: [[[[451,-495],[448,-493],[448,-492],[455,-467],[440,-434],[452,-413],[446,-410],[456,-407],[449,-385],[467,-377],[466,-355],[493,-332],[501,-285],[520,-272],[514,-266],[560,-263],[698,-253],[704,-252],[708,-260],[707,-596],[727,-769],[726,-772],[672,-771],[626,-797],[621,-798],[589,-749],[596,-708],[414,-719],[421,-713],[413,-692],[425,-686],[423,-662],[441,-634],[437,-623],[461,-602],[458,-581],[469,-580],[474,-566],[462,-555],[451,-495]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Missouri", population: 6154913, density: 89.5 },
                geometry: { type: "MultiPolygon", coordinates: [[[[20,346],[39,346],[357,358],[378,335],[384,332],[381,326],[392,260],[449,210],[458,172],[467,167],[480,178],[505,167],[487,97],[528,59],[534,63],[564,41],[575,9],[568,-5],[583,-31],[598,-36],[604,-36],[607,-39],[599,-83],[585,-78],[568,-89],[572,-93],[574,-97],[572,-118],[560,-125],[570,-134],[562,-147],[558,-150],[543,-151],[502,-154],[527,-118],[517,-97],[145,-111],[122,-111],[122,-99],[122,-81],[122,-55],[121,-49],[120,187],[102,192],[75,231],[97,253],[95,262],[65,275],[58,281],[55,284],[20,340],[20,346]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Montana", population: 1084225, density: 7.4 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-1470,1438],[-1430,1430],[-1069,1364],[-630,1311],[-594,1308],[-619,1008],[-622,971],[-623,964],[-631,867],[-632,867],[-708,874],[-1176,933],[-1184,892],[-1186,875],[-1191,879],[-1207,911],[-1225,891],[-1281,902],[-1291,890],[-1315,900],[-1331,889],[-1343,935],[-1366,956],[-1361,972],[-1378,1005],[-1378,1036],[-1388,1050],[-1416,1030],[-1432,1042],[-1431,1067],[-1416,1076],[-1420,1109],[-1395,1158],[-1426,1174],[-1457,1239],[-1481,1262],[-1476,1293],[-1493,1331],[-1470,1438]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Nebraska", population: 1961504, density: 25.5 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-668,434],[-654,603],[-650,644],[-606,641],[-202,619],[-165,592],[-151,603],[-100,601],[-57,579],[-41,559],[-36,560],[-31,557],[-28,524],[-5,482],[-7,452],[6,444],[16,380],[9,363],[21,348],[20,346],[20,340],[55,284],[58,281],[56,281],[-492,296],[-510,297],[-508,335],[-503,409],[-630,418],[-669,421],[-668,434]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Nevada", population: 3104614, density: 28.3 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-1952,739],[-1948,752],[-1927,746],[-1725,698],[-1711,695],[-1710,695],[-1491,648],[-1472,644],[-1476,618],[-1576,104],[-1578,94],[-1581,77],[-1595,5],[-1608,-12],[-1624,5],[-1657,7],[-1670,-109],[-1672,-116],[-1684,-98],[-2032,426],[-1952,739]]]] }
            },
            {
                type: "Feature",
                properties: { name: "New Hampshire", population: 1377529, density: 153.8 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1902,1088],[1901,1094],[1900,1114],[1924,1125],[1925,1128],[1989,922],[2020,894],[2019,888],[2017,873],[2017,871],[2000,865],[1984,842],[1892,822],[1889,825],[1880,835],[1885,852],[1875,915],[1886,961],[1881,999],[1911,1031],[1900,1057],[1902,1088]]]] }
            },
            {
                type: "Feature",
                properties: { name: "New Jersey", population: 9288994, density: 1263.0 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1726,442],[1729,446],[1729,447],[1777,498],[1727,542],[1731,571],[1723,581],[1745,627],[1749,630],[1771,622],[1823,606],[1806,545],[1807,540],[1826,539],[1828,547],[1832,540],[1838,466],[1796,362],[1787,360],[1786,387],[1767,384],[1727,407],[1727,411],[1726,442]]]] }
            },
            {
                type: "Feature",
                properties: { name: "New Mexico", population: 2117522, density: 17.5 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-1146,9],[-1144,22],[-1107,17],[-623,-33],[-615,-33],[-616,-44],[-619,-78],[-619,-89],[-623,-89],[-662,-592],[-994,-561],[-998,-575],[-989,-586],[-1146,-567],[-1152,-617],[-1213,-609],[-1231,-606],[-1146,9]]]] }
            },
            {
                type: "Feature",
                properties: { name: "New York", population: 20201249, density: 428.7 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1321,648],[1330,656],[1383,719],[1360,747],[1357,767],[1396,787],[1459,795],[1478,787],[1537,808],[1576,846],[1569,870],[1550,876],[1561,888],[1552,893],[1552,908],[1619,1002],[1648,1026],[1740,1046],[1762,1052],[1769,1009],[1781,991],[1780,946],[1794,918],[1793,898],[1800,902],[1809,894],[1824,814],[1828,808],[1828,795],[1828,728],[1829,728],[1833,703],[1851,637],[1834,620],[1843,609],[1841,603],[1841,595],[1929,631],[1956,661],[1958,644],[1963,654],[1972,645],[1986,654],[1889,579],[1831,555],[1820,559],[1811,547],[1806,545],[1823,606],[1771,622],[1749,630],[1745,637],[1723,640],[1708,672],[1682,688],[1326,618],[1321,648]]]] }
            },
            {
                type: "Feature",
                properties: { name: "North Carolina", population: 10439388, density: 214.7 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1052,-193],[1075,-180],[1073,-167],[1093,-147],[1118,-144],[1160,-113],[1164,-96],[1187,-78],[1195,-89],[1215,-66],[1239,-63],[1246,-42],[1264,-35],[1261,-13],[1262,-7],[1278,-6],[1452,19],[1768,81],[1773,69],[1826,-16],[1829,-58],[1781,-95],[1755,-146],[1746,-139],[1720,-143],[1675,-176],[1653,-206],[1644,-253],[1605,-255],[1591,-263],[1471,-176],[1370,-190],[1370,-178],[1353,-161],[1345,-170],[1343,-158],[1220,-171],[1161,-202],[1142,-205],[1069,-215],[1052,-217],[1052,-193]]]] }
            },
            {
                type: "Feature",
                properties: { name: "North Dakota", population: 779094, density: 11.3 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-594,1308],[-544,1304],[-131,1284],[-91,1283],[-82,1247],[-86,1192],[-64,1126],[-61,1022],[-44,953],[-44,944],[-84,945],[-592,969],[-622,971],[-619,1008],[-594,1308]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Ohio", population: 11799448, density: 288.8 },
                geometry: { type: "MultiPolygon", coordinates: [[[[952,250],[923,507],[920,525],[950,530],[1030,543],[1035,539],[1076,525],[1083,534],[1117,516],[1153,536],[1174,536],[1207,572],[1260,603],[1265,606],[1285,481],[1289,458],[1284,454],[1278,449],[1288,419],[1278,345],[1251,309],[1233,309],[1217,291],[1209,253],[1190,258],[1179,232],[1185,211],[1175,191],[1156,183],[1153,185],[1150,191],[1128,202],[1122,219],[1091,196],[1068,205],[1057,195],[1040,207],[1009,209],[985,241],[972,235],[959,242],[953,236],[952,250]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Oklahoma", population: 3959353, density: 57.7 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-616,-44],[-615,-33],[-601,-35],[-559,-38],[-531,-40],[-530,-40],[113,-56],[122,-55],[122,-81],[122,-99],[122,-111],[126,-134],[141,-238],[139,-415],[139,-432],[135,-434],[71,-397],[59,-407],[36,-401],[-14,-411],[-33,-427],[-60,-402],[-65,-411],[-87,-398],[-106,-423],[-110,-402],[-132,-411],[-153,-392],[-171,-408],[-178,-392],[-191,-390],[-194,-373],[-216,-372],[-226,-383],[-242,-371],[-291,-364],[-305,-338],[-336,-343],[-363,-322],[-354,-105],[-545,-95],[-619,-89],[-619,-78],[-616,-44]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Oregon", population: 4237256, density: 44.1 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-2097,1283],[-2093,1285],[-2084,1270],[-2063,1268],[-2051,1253],[-2052,1202],[-2020,1181],[-1981,1189],[-1945,1179],[-1937,1166],[-1892,1169],[-1876,1160],[-1761,1165],[-1638,1136],[-1605,1128],[-1604,1124],[-1580,1079],[-1669,959],[-1670,948],[-1648,928],[-1666,894],[-1702,736],[-1711,695],[-1725,698],[-1927,746],[-1948,752],[-1963,755],[-2281,846],[-2284,852],[-2280,944],[-2214,1049],[-2141,1231],[-2128,1271],[-2131,1290],[-2097,1283]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Pennsylvania", population: 13002700, density: 290.6 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1265,606],[1279,615],[1315,643],[1321,648],[1326,618],[1682,688],[1708,672],[1723,640],[1745,637],[1749,630],[1745,627],[1723,581],[1731,571],[1727,542],[1777,498],[1729,447],[1729,446],[1723,448],[1701,431],[1700,431],[1671,425],[1400,372],[1393,371],[1369,367],[1306,356],[1292,440],[1289,458],[1285,481],[1265,606]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Rhode Island", population: 1097379, density: 1061.4 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1979,681],[1970,736],[1964,757],[1979,762],[1997,767],[2033,716],[2031,714],[1979,680],[1979,681]]]] }
            },
            {
                type: "Feature",
                properties: { name: "South Carolina", population: 5118425, density: 170.2 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1160,-207],[1161,-202],[1220,-171],[1343,-158],[1345,-170],[1353,-161],[1370,-178],[1370,-190],[1471,-176],[1591,-263],[1580,-269],[1550,-312],[1547,-344],[1534,-369],[1514,-373],[1516,-381],[1483,-424],[1442,-443],[1446,-461],[1422,-465],[1429,-477],[1413,-495],[1412,-500],[1389,-495],[1384,-471],[1355,-444],[1338,-401],[1313,-389],[1293,-370],[1292,-357],[1227,-312],[1190,-258],[1145,-240],[1160,-207]]]] }
            },
            {
                type: "Feature",
                properties: { name: "South Dakota", population: 886667, density: 11.7 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-632,867],[-631,867],[-623,964],[-622,971],[-592,969],[-84,945],[-44,944],[-44,937],[-66,909],[-36,874],[-36,679],[-36,673],[-48,673],[-35,630],[-51,586],[-39,562],[-36,560],[-41,559],[-57,579],[-100,601],[-151,603],[-165,592],[-202,619],[-606,641],[-650,644],[-648,677],[-635,833],[-632,867]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Tennessee", population: 6910840, density: 167.6 },
                geometry: { type: "MultiPolygon", coordinates: [[[[514,-262],[533,-251],[529,-218],[548,-193],[544,-178],[567,-161],[563,-156],[558,-150],[562,-147],[570,-134],[560,-125],[572,-118],[574,-97],[572,-93],[582,-92],[703,-83],[700,-63],[1086,-33],[1087,-30],[1105,-28],[1264,-4],[1262,-7],[1261,-13],[1264,-35],[1246,-42],[1239,-63],[1215,-66],[1195,-89],[1187,-78],[1164,-96],[1160,-113],[1118,-144],[1093,-147],[1073,-167],[1075,-180],[1052,-193],[1052,-217],[1035,-219],[949,-230],[937,-231],[914,-233],[703,-251],[704,-252],[698,-253],[560,-263],[514,-266],[514,-262]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Texas", population: 29145505, density: 111.6 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-623,-89],[-619,-89],[-545,-95],[-354,-105],[-363,-322],[-336,-343],[-305,-338],[-291,-364],[-242,-371],[-226,-383],[-216,-372],[-194,-373],[-191,-390],[-178,-392],[-171,-408],[-153,-392],[-132,-411],[-110,-402],[-106,-423],[-87,-398],[-65,-411],[-60,-402],[-33,-427],[-14,-411],[36,-401],[59,-407],[71,-397],[135,-434],[139,-432],[145,-439],[180,-441],[181,-485],[181,-501],[182,-516],[184,-615],[234,-704],[235,-733],[217,-776],[221,-831],[200,-859],[209,-872],[207,-873],[129,-902],[60,-965],[-32,-1015],[-99,-1071],[-129,-1124],[-137,-1165],[-116,-1285],[-144,-1299],[-166,-1280],[-221,-1274],[-282,-1238],[-309,-1234],[-326,-1184],[-343,-1163],[-349,-1102],[-380,-1078],[-387,-1057],[-419,-1025],[-454,-928],[-490,-887],[-508,-879],[-521,-854],[-589,-844],[-607,-833],[-616,-845],[-644,-846],[-666,-900],[-693,-927],[-708,-926],[-780,-881],[-824,-839],[-851,-732],[-893,-700],[-985,-590],[-989,-586],[-998,-575],[-994,-561],[-662,-592],[-623,-89]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Utah", population: 3271616, density: 39.7 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-1476,618],[-1472,644],[-1454,640],[-1256,607],[-1229,603],[-1237,556],[-1247,492],[-1099,470],[-1083,467],[-1085,448],[-1136,76],[-1144,22],[-1183,28],[-1571,93],[-1578,94],[-1576,104],[-1476,618]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Vermont", population: 643077, density: 69.8 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1762,1052],[1773,1055],[1894,1086],[1902,1088],[1900,1057],[1911,1031],[1881,999],[1886,961],[1875,915],[1885,852],[1880,835],[1889,825],[1892,822],[1887,821],[1838,810],[1828,808],[1824,814],[1809,894],[1800,902],[1793,898],[1794,918],[1780,946],[1781,991],[1769,1009],[1762,1052]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Virginia", population: 8631393, density: 218.6 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1745,232],[1752,239],[1786,255],[1781,239],[1770,229],[1749,139],[1737,160],[1743,219],[1751,227],[1745,232]]],[[[1092,-26],[1132,-8],[1162,38],[1203,73],[1221,95],[1224,92],[1230,73],[1251,61],[1277,80],[1290,71],[1322,87],[1318,96],[1352,102],[1370,128],[1363,133],[1395,206],[1400,243],[1434,229],[1451,281],[1463,274],[1493,325],[1493,360],[1543,331],[1545,343],[1548,354],[1552,354],[1572,347],[1575,331],[1607,321],[1610,318],[1616,312],[1617,307],[1617,306],[1613,288],[1605,286],[1600,266],[1608,253],[1626,259],[1636,245],[1667,243],[1705,222],[1702,196],[1716,165],[1715,157],[1700,162],[1720,123],[1748,120],[1764,90],[1768,81],[1452,19],[1278,-6],[1262,-7],[1264,-4],[1105,-28],[1087,-30],[1092,-26]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Washington", population: 7705281, density: 115.9 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-1994,1536],[-1970,1541],[-1963,1533],[-1971,1500],[-1993,1515],[-1994,1536]]],[[[-1558,1458],[-1541,1454],[-1607,1169],[-1605,1136],[-1605,1128],[-1638,1136],[-1761,1165],[-1876,1160],[-1892,1169],[-1937,1166],[-1945,1179],[-1981,1189],[-2020,1181],[-2052,1202],[-2051,1253],[-2063,1268],[-2084,1270],[-2093,1285],[-2102,1289],[-2132,1298],[-2119,1336],[-2107,1338],[-2117,1348],[-2110,1456],[-2120,1491],[-2110,1536],[-2068,1500],[-2018,1477],[-2003,1480],[-1996,1468],[-1977,1468],[-1976,1443],[-1966,1448],[-1973,1481],[-1955,1513],[-1950,1559],[-1558,1458]]]] }
            },
            {
                type: "Feature",
                properties: { name: "West Virginia", population: 1793716, density: 74.6 },
                geometry: { type: "MultiPolygon", coordinates: [[[[1153,180],[1153,185],[1156,183],[1175,191],[1185,211],[1179,232],[1190,258],[1209,253],[1217,291],[1233,309],[1251,309],[1278,345],[1288,419],[1278,449],[1284,454],[1289,458],[1292,440],[1306,356],[1369,367],[1393,371],[1396,350],[1402,314],[1430,349],[1442,347],[1454,372],[1461,364],[1482,365],[1486,376],[1510,387],[1533,381],[1545,357],[1548,354],[1545,343],[1543,331],[1493,360],[1493,325],[1463,274],[1451,281],[1434,229],[1400,243],[1395,206],[1363,133],[1370,128],[1352,102],[1318,96],[1322,87],[1290,71],[1277,80],[1251,61],[1230,73],[1224,92],[1221,95],[1212,94],[1170,130],[1154,153],[1153,180]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Wisconsin", population: 5893718, density: 108.8 },
                geometry: { type: "MultiPolygon", coordinates: [[[[305,1036],[309,1033],[369,1054],[387,1073],[401,1061],[387,1027],[403,1039],[426,1026],[428,1027],[444,1020],[452,1003],[610,968],[612,954],[638,943],[635,906],[651,910],[646,890],[659,880],[656,874],[631,835],[628,819],[636,815],[672,858],[685,890],[698,905],[705,899],[675,824],[674,782],[659,743],[653,659],[667,622],[665,598],[667,589],[453,575],[436,574],[433,582],[400,602],[389,642],[398,656],[383,677],[384,682],[382,690],[380,713],[363,737],[252,818],[253,876],[262,893],[243,908],[243,924],[254,943],[286,965],[284,1030],[305,1036]]]] }
            },
            {
                type: "Feature",
                properties: { name: "Wyoming", population: 576851, density: 5.9 },
                geometry: { type: "MultiPolygon", coordinates: [[[[-708,874],[-632,867],[-635,833],[-648,677],[-650,644],[-654,603],[-668,434],[-669,421],[-706,425],[-1017,458],[-1083,467],[-1099,470],[-1247,492],[-1237,556],[-1229,603],[-1223,641],[-1188,865],[-1186,875],[-1184,892],[-1176,933],[-708,874]]]] }
            }
        ]
    };
}
