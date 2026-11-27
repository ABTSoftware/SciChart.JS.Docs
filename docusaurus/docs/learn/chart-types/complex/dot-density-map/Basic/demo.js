import * as SciChart from "scichart";

// #region_A_start
// Create a JavaScript dot density map with SciChart.js: cattle and hogs on US farms, one dot per 1,000, 10,000
// or 50,000 head, in two colours, placed at random inside each county (or each state, to compare)
const {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    XyDataSeries,
    FastLineRenderableSeries,
    XyScatterRenderableSeries,
    SquarePointMarker,
    EStrokePaletteMode,
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
    SciChartJsNavyTheme,
    parseColorToUIntArgb
} = SciChart;
// or, for npm, import { SciChartSurface, ... } from "scichart"

// The two things mapped, one colour each. Orange and blue stay distinct for most colour-blind readers.
const ANIMALS = [
    { key: "cattle", label: "Cattle and calves", color: "#F7A13B" },
    { key: "hogs", label: "Hogs and pigs", color: "#5CC8F5" }
];

// Dot values to choose from. Small dots for the low value, so the dense areas don't turn solid;
// bigger dots for the high values, so the few dots stay visible.
const DOT_STYLES = [
    { headPerDot: 1000, size: 1, alpha: "90" },
    { headPerDot: 10000, size: 2, alpha: "FF" },
    { headPerDot: 50000, size: 3, alpha: "FF" }
];

const WITHHELD = -1; // NASS withholds a county figure that would reveal one farm's numbers: "(D)"
const NO_FIGURE = -2; // no separate figure for this area (some independent cities)

// 1. DATA HELPERS (plain JavaScript, no SciChart code)

// Decode one outline from the encoded polyline format (the same idea as Google's polyline encoding):
// each number is the change from the previous point in whole kilometres, written in 5-bit chunks as characters.
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

// Cut an outline into triangles by ear clipping (repeatedly cut off a corner with no other point inside it).
// Random points are easy to place evenly inside a triangle, so the dots are placed triangle by triangle.
// For large or complex maps, use a tested library such as earcut, or triangulate once offline.
function triangulateRing(ring) {
    const points = ring.slice();
    let signedArea = 0;
    points.forEach(([x1, y1], i) => {
        const [x2, y2] = points[(i + 1) % points.length];
        signedArea += x1 * y2 - x2 * y1;
    });
    if (signedArea < 0) points.reverse(); // make the ring counter-clockwise

    const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const isInside = (p, a, b, c) => cross(a, b, p) >= 0 && cross(b, c, p) >= 0 && cross(c, a, p) >= 0;

    const remaining = points;
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

// Flatten rings into x and y arrays with NaN between rings, so one line series draws them all with gaps
function ringsToLine(rings, closeRings) {
    const xValues = [];
    const yValues = [];
    rings.forEach((ring) => {
        ring.forEach(([x, y]) => {
            xValues.push(x);
            yValues.push(y);
        });
        if (closeRings) {
            xValues.push(ring[0][0]);
            yValues.push(ring[0][1]);
        }
        xValues.push(NaN);
        yValues.push(NaN);
    });
    return { xValues, yValues };
}

// A seeded random number generator, so the dots land in the same places every time
function createRandom(seed) {
    return () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
}

// 2. WHERE THE DOTS GO
// An "area" is the land a count belongs to, with its triangles and their running total of area.
function makeArea(counties, count) {
    const triangles = counties.flatMap((county) => county.triangles);
    const cumulativeAreas = [];
    let area = 0;
    for (let t = 0; t < triangles.length; t += 3) {
        const [a, b, c] = [triangles[t], triangles[t + 1], triangles[t + 2]];
        area += Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2;
        cumulativeAreas.push(area);
    }
    return { triangles, cumulativeAreas, count };
}

// The areas for one animal. By county: each county with a figure is its own area, and a state's withheld counties
// share what is left of the state total. By state: each whole state is one area, to show what coarse data does.
function getDotAreas(states, animal, unit) {
    const areas = [];
    states.forEach((state) => {
        const known = state.counties.filter((county) => county[animal] > 0);
        const knownTotal = known.reduce((sum, county) => sum + county[animal], 0);
        const stateTotal = state.totals[animal] >= 0 ? state.totals[animal] : knownTotal; // a few state totals are withheld too
        if (unit === "state") {
            if (stateTotal > 0) areas.push(makeArea(state.counties, stateTotal));
            return;
        }
        known.forEach((county) => areas.push(makeArea([county], county[animal])));
        const withheld = state.counties.filter((county) => county[animal] === WITHHELD);
        if (withheld.length && stateTotal > knownTotal) areas.push(makeArea(withheld, stateTotal - knownTotal));
    });
    return areas;
}

// Round(count / dot value) dots per area, each at a random place inside it: pick a triangle with a chance
// in proportion to its area, then a random point inside that triangle, so the dots spread evenly over the area.
function placeDots(areas, headPerDot, random) {
    const xValues = [];
    const yValues = [];
    areas.forEach(({ triangles, cumulativeAreas, count }) => {
        const totalArea = cumulativeAreas[cumulativeAreas.length - 1];
        const dotCount = Math.round(count / headPerDot); // an area with under half a dot's worth gets none
        for (let d = 0; d < dotCount; d++) {
            const target = random() * totalArea;
            let low = 0;
            let high = cumulativeAreas.length - 1;
            while (low < high) {
                // binary search for the triangle that holds this share of the area
                const mid = (low + high) >> 1;
                if (cumulativeAreas[mid] < target) low = mid + 1;
                else high = mid;
            }
            const [a, b, c] = [triangles[low * 3], triangles[low * 3 + 1], triangles[low * 3 + 2]];
            let u = random();
            let v = random();
            if (u + v > 1) {
                // fold points from the far half of the parallelogram back into the triangle
                u = 1 - u;
                v = 1 - v;
            }
            xValues.push(a[0] + u * (b[0] - a[0]) + v * (c[0] - a[0]));
            yValues.push(a[1] + u * (b[1] - a[1]) + v * (c[1] - a[1]));
        }
    });
    return { xValues, yValues };
}

// 3. HOVER TOOLTIP: finds the county under the mouse and shows its figures
class CountyTooltipModifier extends CustomChartModifier2D {
    counties;
    highlight;
    tooltip;
    hoveredCounty;

    constructor(counties, highlight) {
        super();
        this.counties = counties;
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

    // The smallest county that contains the point (a few independent cities sit inside a county).
    // A bounding-box test rules most counties out cheaply; for far more areas, use a spatial index.
    findCounty(x, y) {
        let found;
        for (const county of this.counties) {
            const { minX, maxX, minY, maxY } = county.bounds;
            if (x < minX || x > maxX || y < minY || y > maxY) continue;
            if (!county.rings.some((ring) => isPointInRing(x, y, ring))) continue;
            if (!found || county.area < found.area) found = county;
        }
        return found;
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
        const xAxis = this.parentSurface.xAxes.get(0);
        const yAxis = this.parentSurface.yAxes.get(0);
        const x = point ? xAxis.getCurrentCoordinateCalculator().getDataValue(point.x) : NaN;
        const y = point ? yAxis.getCurrentCoordinateCalculator().getDataValue(point.y) : NaN;
        const county = point ? this.findCounty(x, y) : undefined;

        if (county !== this.hoveredCounty) {
            this.hoveredCounty = county;
            this.highlight.clear();
            if (county) {
                const { xValues, yValues } = ringsToLine(county.rings, true);
                this.highlight.appendRange(xValues, yValues);
            }
        }
        if (county) {
            const describe = (count) =>
                count === WITHHELD ? "withheld (D)" : count === NO_FIGURE ? "no separate figure" : count.toLocaleString("en-US");
            const nearRightEdge = x > xAxis.visibleRange.min + xAxis.visibleRange.diff * 0.6;
            this.tooltip.text = [
                `${county.name}, ${county.state}`,
                ...ANIMALS.map((animal) => `${animal.label}: ${describe(county[animal.key])}`)
            ].join("\n");
            this.tooltip.horizontalAnchorPoint = nearRightEdge ? EHorizontalAnchorPoint.Right : EHorizontalAnchorPoint.Left;
            // Offsets are a fraction of the visible range, so the gap from the cursor looks the same at every zoom level
            this.tooltip.x1 = x + xAxis.visibleRange.diff * (nearRightEdge ? -0.012 : 0.012);
            this.tooltip.y1 = y + yAxis.visibleRange.diff * 0.03;
        }
        this.tooltip.isHidden = !county;
    }

    modifierMouseLeave(args) {
        super.modifierMouseLeave(args);
        this.tooltip.isHidden = true;
        this.hoveredCounty = undefined;
        this.highlight.clear();
    }
}

// 4. THE CHART
// data: counties grouped by state, with cattle and hogs per county and outlines in kilometres
// (Albers equal-area projection), such as getUsLivestockData() at the end of this file
async function dotDensityMap(divElementId, data) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // A map needs no axis labels, but the hidden axes still set the drawing area, so zoom and pan work as usual.
    // The extra space leaves room for the buttons (top), the legend (right) and the SciChart logo (bottom).
    const xAxis = new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.02, 0.22) });
    const yAxis = new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.06, 0.3) });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Unpack the states and counties: outlines, triangles, bounds and figures
    const states = data.states.map(([state, cattleTotal, hogsTotal, names, cattle, hogs, outlines]) => {
        const nameList = names.split("|");
        const counties = outlines.split(",").map((encodedRings, i) => {
            const rings = encodedRings.split(" ").map(decodeOutline);
            const xs = rings.flat().map((p) => p[0]);
            const ys = rings.flat().map((p) => p[1]);
            const county = {
                name: nameList[i],
                state,
                cattle: cattle[i],
                hogs: hogs[i],
                rings,
                triangles: rings.flatMap((ring) => triangulateRing(ring)),
                bounds: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) },
                area: 0
            };
            county.area = (county.bounds.maxX - county.bounds.minX) * (county.bounds.maxY - county.bounds.minY);
            return county;
        });
        return { state, totals: { cattle: cattleTotal, hogs: hogsTotal }, counties };
    });
    const counties = states.flatMap((state) => state.counties);

    // All the dots of both colours are in one scatter series. A palette provider colours each dot by its animal,
    // so the two colours can be drawn mixed together rather than one colour on top of the other.
    const dotData = new XyDataSeries(wasmContext, { isSorted: false, containsNaN: false });
    const dotMarker = new SquarePointMarker(wasmContext, { width: 2, height: 2, strokeThickness: 0 });
    let dotAnimals = new Uint8Array(0); // the animal of each dot, by index: 0 = cattle, 1 = hogs
    let dotColors = ANIMALS.map((animal) => parseColorToUIntArgb(animal.color));
    const paletteProvider = {
        strokePaletteMode: EStrokePaletteMode.SOLID,
        onAttached: () => {},
        onDetached: () => {},
        overridePointMarkerArgb: (xValue, yValue, index) => {
            const color = dotColors[dotAnimals[index]];
            return { stroke: color, fill: color };
        }
    };
    const dotSeries = new XyScatterRenderableSeries(wasmContext, { dataSeries: dotData, pointMarker: dotMarker, paletteProvider });

    // State borders and the coast, and the hovered county's outline (filled in by the tooltip modifier)
    const stateBorders = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            ...ringsToLine(data.stateBorders.split(" ").map(decodeOutline), false),
            isSorted: false,
            containsNaN: true
        }),
        stroke: "#5D6F8F",
        strokeThickness: 1
    });
    const highlight = new XyDataSeries(wasmContext, { isSorted: false, containsNaN: true });
    sciChartSurface.renderableSeries.add(
        stateBorders,
        dotSeries,
        new FastLineRenderableSeries(wasmContext, { dataSeries: highlight, stroke: "#FFFFFF", strokeThickness: 2 })
    );

    // Legend: annotations in relative coordinates (0 to 1 across the chart), so it stays put when you zoom
    const relative = { xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative };
    const text = (x1, y1, value, fontSize) =>
        new NativeTextAnnotation({
            ...relative,
            x1,
            y1,
            text: value,
            textColor: "#FFFFFF",
            fontSize,
            multiLineAlignment: EMultiLineAlignment.Left,
            lineSpacing: 3,
            verticalAnchorPoint: EVerticalAnchorPoint.Center
        });
    const dotValueText = text(0.825, 0.62, "", 16);
    const countTexts = ANIMALS.map((animal, i) => text(0.85, 0.7 + i * 0.11, "", 15));
    sciChartSurface.annotations.add(
        new BoxAnnotation({ ...relative, x1: 0.81, x2: 0.995, y1: 0.56, y2: 0.97, fill: "#0F1A2BDD", strokeThickness: 0 }),
        dotValueText,
        ...ANIMALS.map((animal, i) => {
            const y = 0.7 + i * 0.11;
            return new BoxAnnotation({ ...relative, x1: 0.825, x2: 0.84, y1: y - 0.012, y2: y + 0.012, fill: animal.color, strokeThickness: 0 });
        }),
        ...countTexts,
        text(0.825, 0.92, "2022 Census of Agriculture", 13)
    );

    // Redraw the dots for the chosen dot value, unit ("county" or "state") and draw order ("mixed" or an animal on top)
    const settings = { headPerDot: 10000, unit: "county", onTop: "mixed" };
    const areaCache = {};
    const update = (changes) => {
        Object.assign(settings, changes);
        const style = DOT_STYLES.find((s) => s.headPerDot === settings.headPerDot);
        const random = createRandom(2022);
        const layers = ANIMALS.map((animal, animalIndex) => {
            const cacheKey = `${animal.key}-${settings.unit}`;
            if (!areaCache[cacheKey]) areaCache[cacheKey] = getDotAreas(states, animal.key, settings.unit);
            return { animalIndex, ...placeDots(areaCache[cacheKey], settings.headPerDot, random) };
        });
        countTexts.forEach((countText, i) => {
            countText.text = `${ANIMALS[i].label}\n${layers[i].xValues.length.toLocaleString("en-US")} dots`;
        });

        // Draw order: the series draws dots in data order, so later dots cover earlier ones
        if (settings.onTop === "cattle") layers.reverse(); // hogs first, cattle last (on top)
        const order = layers.flatMap(({ animalIndex, xValues }) => xValues.map((x, i) => [animalIndex, i]));
        if (settings.onTop === "mixed") {
            // shuffle (Fisher-Yates), so neither colour is systematically on top
            for (let i = order.length - 1; i > 0; i--) {
                const j = Math.floor(random() * (i + 1));
                [order[i], order[j]] = [order[j], order[i]];
            }
        }
        const byAnimal = [];
        layers.forEach((layer) => (byAnimal[layer.animalIndex] = layer));
        const xValues = new Float64Array(order.length);
        const yValues = new Float64Array(order.length);
        dotAnimals = new Uint8Array(order.length);
        order.forEach(([animalIndex, i], n) => {
            xValues[n] = byAnimal[animalIndex].xValues[i];
            yValues[n] = byAnimal[animalIndex].yValues[i];
            dotAnimals[n] = animalIndex;
        });
        dotColors = ANIMALS.map((animal) => parseColorToUIntArgb(animal.color + style.alpha));
        dotMarker.width = style.size;
        dotMarker.height = style.size;
        dotData.clear();
        dotData.appendRange(xValues, yValues);
        dotValueText.text = `1 dot = ${settings.headPerDot.toLocaleString("en-US")} head`;
    };
    update({});

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
        new CountyTooltipModifier(counties, highlight),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    return { sciChartSurface, update };
}
// #region_A_end

// The option buttons, in the top-left corner of the chart. In your app these can be any buttons.
function addButtonRow(chartRoot, top, label, options, selectedIndex, onSelect) {
    const row = document.createElement("div");
    row.style.cssText =
        `position:absolute; top:${top}px; left:14px; display:flex; flex-wrap:wrap; align-items:center; gap:8px;` +
        "z-index:10; font:14px Arial, sans-serif; color:#ffffff;";
    const caption = document.createElement("span");
    caption.textContent = label;
    caption.style.cssText = "min-width:64px;";
    row.append(caption);
    const buttons = options.map((option, i) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => select(i);
        row.append(button);
        return button;
    });
    const highlight = (index) =>
        buttons.forEach((button, i) => {
            button.style.cssText =
                "font:bold 14px Arial, sans-serif; padding:4px 12px; border-radius:14px; cursor:pointer; border:1px solid #50C7E0;" +
                (i === index ? "background:#50C7E0; color:#14233C;" : "background:#14233CCC; color:#ffffff;");
        });
    const select = (index) => {
        onSelect(index);
        highlight(index);
    };
    chartRoot.append(row);
    highlight(selectedIndex);
    return row;
}

dotDensityMap("scichart-root", getUsLivestockData()).then(({ sciChartSurface, update }) => {
    const chartRoot = sciChartSurface.domChartRoot;
    addButtonRow(chartRoot, 10, "1 dot =", ["1,000", "10,000", "50,000 head"], 1, (i) =>
        update({ headPerDot: DOT_STYLES[i].headPerDot })
    );
    addButtonRow(chartRoot, 44, "Dots in", ["Counties", "States"], 0, (i) => update({ unit: i === 0 ? "county" : "state" }));
    addButtonRow(chartRoot, 78, "On top", ["Mixed", "Cattle", "Hogs"], 0, (i) =>
        update({ onTop: ["mixed", "cattle", "hogs"][i] })
    );
});

// Cattle and calves, and hogs and pigs, on farms in every county of the 48 contiguous states (inventory at the end of 2022).
// Livestock: USDA National Agricultural Statistics Service, 2022 Census of Agriculture, county tables 11 and 12
// (public domain, a work of the US government).
// Boundaries: US Census Bureau, 2020 cartographic boundary file cb_2020_us_county_20m (public domain), projected to
// kilometres with an Albers equal-area conic projection (standard parallels 29.5°N and 45.5°N, centred on 96°W),
// simplified with shared borders kept shared, and rounded to whole kilometres.
function getUsLivestockData() {
    return {
        // Each row: state, state total of cattle and calves, state total of hogs and pigs (-1 = withheld),
        // county names separated by "|", cattle per county, hogs per county, outlines.
        // County figures: -1 = withheld by NASS to protect individual farms, -2 = no separate figure.
        // Outlines are in kilometres, encoded as polylines: counties separated by ",", rings by spaces.
        states: [
            [
                "AL",
                1214015,
                -1,
                "Autauga|Baldwin|Barbour|Bibb|Blount|Bullock|Butler|Calhoun|Chambers|Cherokee|Chilton|Choctaw|Clarke|Clay|Cleburne|Coffee|Colbert|Conecuh|Coosa|Covington|Crenshaw|Cullman|Dale|Dallas|DeKalb|Elmore|Escambia|Etowah|Fayette|Franklin|Geneva|Greene|Hale|Henry|Houston|Jackson|Jefferson|Lamar|Lauderdale|Lawrence|Lee|Limestone|Lowndes|Macon|Madison|Marengo|Marion|Marshall|Mobile|Monroe|Montgomery|Morgan|Perry|Pickens|Pike|Randolph|Russell|St. Clair|Shelby|Sumter|Talladega|Tallapoosa|Tuscaloosa|Walker|Washington|Wilcox|Winston",
                [14847,20092,27451,5285,31981,11649,9808,13844,39162,12140,14396,4334,6501,21064,12335,22928,11813,15578,2899,23782,25110,45273,12154,31558,55742,8666,8844,18593,5359,23291,29150,8444,25067,12223,20281,34444,4051,4809,21765,26753,7832,24248,36087,8334,13134,27945,13007,38476,17207,14203,38527,28032,15564,17284,22628,28776,12740,12590,4786,21549,15468,8367,6805,6414,8126,13779,8641],
                [-1,161,169,148,117,52,-1,328,107,-1,305,0,104,51,164,45,164,409,8,90,7,491,40,-1,1464,127,36,208,100,205,90,6,57,-1,81,695,293,65,273,75,-1,514,116,34,296,-1,-1,183,118,-1,-1,325,-1,-1,38,10,48,49,165,3678,64,61,129,155,143,408,42],
                "{s@cdA{ASG`ANNh@GNN,sn@ey@CE_@Y]FGt@B\\o@h@D`@QNXb@fANQSn@mAKw@,w{@m_AI[]G?[eAH@NHb@CJ?BLNd@@AR|@F,wp@gfAQAC[OA@MWME?AP]VEl@X@jA?,yr@mlAsAaB]`@Fb@G?JV\\P`@Kb@F,}y@_bAKFoAIER?Z\\FHZV@@Sh@MBk@,ut@i_AkAG?`Bd@BX@No@@QB[,sw@skAOSDQw@a@g@@NfAVPb@ALS,e{@_hAaAGOr@MXtAL,qz@{qAOr@Kj@EXTFf@AVq@,es@ieAYADm@q@IQHOj@OJDHzARR@?O,gk@_~@AiA?Q{AGNDB`APh@SVdAD,qm@{~@kAEKb@UCNfAIP`@`@^XAcA`@SBURW,my@qjAe@CGvA`AH\\?Ek@WAIm@,my@qjAGMWQOgAUGCLOt@Ib@|@B,}x@a|@Cg@cAGI|AjAF,uk@asAW@_@\\q@YQBLt@lBD,qt@y}@On@YAGhALMzBJi@}@C[,}u@yfAAS{@E]?GhAbAFNK,{u@k|@e@CSAANSQANO@Et@Ej@d@Bx@DDk@,aw@q_AESSAARSCOlABf@NA@ORP@OR@,uq@koA?C_BGWFrA`BVCLU,e{@q}@G?}@GGbAJN`@?FNL@,{p@kaAI?Bg@y@EKw@?NSAYdAFLIJP?Cf@p@Bz@i@,ow@gqAm@e@_@w@Mr@AFCLr@lAn@DDm@,}v@aeAcAGWACx@TP^?NKVTFaA,up@}y@c@E{BKMLEj@P?fAFpAD,kv@mnAa@Yo@EWp@v@`@Z]TLF?,cm@ilAy@C?HSACf@QAARd@@BR^@R@,sk@_pAA[mBEEz@R?`BD,cy@kz@kAGMAk@ECj@@@dBJZ@,kl@yeA{@g@A\\U?Vx@K?AZMFJNFAHKKCPCTH`@gA,_o@cfAw@CA\\Dn@H@Cd@t@CKOLG@[J?,k}@y}@@Se@AMOSr@?n@|@D,s}@u{@}@E@ZSTENzAHBk@j@DGOa@?,wu@stAoAGm@EGZ^v@l@d@PW^@FiAKA,iq@{iAq@gAc@Ga@JOn@vAjAD?v@k@,ok@_kAAeAg@AI\\GvAz@@,il@{sAcAEcACA?Bt@\\GPCp@X^]VARS,co@aqAMu@]F]LGpA?BjAD,o{@keAuAMK\\ORjA^BSp@O@W,sp@etAcAEI?G`Bz@W\\M,ut@}aAOOi@FSTCh@DRjAFJQBg@Q?HK,gy@_cAUQQA@SQCq@NCRCd@nAHJG,as@ktAsAGA?IHJ@GhA?RNFVKXEPH,en@caATY_@YG@u@BCf@IA?H\\~@jADCaA,qk@kmAAs@aBEEbAARx@BH]f@@,ut@mqAWJOG?S_@AQVFPEl@`@X\\a@VG,}k@sx@uAQMp@Jv@PrAp@GHoAFy@,_q@a~@oBIAPh@ZBZh@|@b@D\\Ga@a@HQ,ov@ebAOOWUOJ_@?U^LDCj@APb@BRB@SR@Bi@,mq@arA{@VQIYD?t@~AF,yp@ieAkA?AVJv@x@DCf@H?H@Bg@Be@IA,mk@wgAAw@{@ASAGpAz@f@\\B,qx@w_Ac@C@Qi@LARWAHz@F?bAF,sz@ujA}@CCJQ`A?B`AFH@,u|@gcAkA_@GZBHWLBFVVCNdAIDS,kv@imAUM[\\EPNRHC@l@HALZBWXGNo@]Q,yr@chAwAkAYFCVERV\\AN@RPIp@H\\W,kk@ybAAmA?M]CBNa@fAUIQBJBIJ^XUXzAF,ov@oiAM[I@Am@IBOAMRc@@FLH@Hl@V@Dj@z@D@OW],yx@sgAaAIIAIrAPFAVPBARP@By@V@,_n@siA_@ACSe@A_@NLJw@j@VLALN@BZP@v@BT?@],{n@amAwAEMTWBAHp@fA^O@SP@Bg@R@?I,mk@s|@eAECTa@R@bABDtAPHeA,}o@a_A]_A{@h@q@CKPH@CZnBHTB,un@eoAS?kAE@bAvAD"
            ],
            [
                "AR",
                1588074,
                145376,
                "Arkansas|Ashley|Baxter|Benton|Boone|Bradley|Calhoun|Carroll|Chicot|Clark|Clay|Cleburne|Cleveland|Columbia|Conway|Craighead|Crawford|Crittenden|Cross|Dallas|Desha|Drew|Faulkner|Franklin|Fulton|Garland|Grant|Greene|Hempstead|Hot Spring|Howard|Independence|Izard|Jackson|Jefferson|Johnson|Lafayette|Lawrence|Lee|Lincoln|Little River|Logan|Lonoke|Madison|Marion|Miller|Mississippi|Monroe|Montgomery|Nevada|Newton|Ouachita|Perry|Phillips|Pike|Poinsett|Polk|Pope|Prairie|Pulaski|Randolph|St. Francis|Saline|Scott|Searcy|Sebastian|Sevier|Sharp|Stone|Union|Van Buren|Washington|White|Woodruff|Yell",
                [1729,2779,17440,75474,58619,5042,3406,75392,3443,7852,7303,23767,4252,9033,25693,3325,29635,879,1762,1587,385,11308,32726,50470,49992,4416,13467,6323,64180,14785,29976,49636,33361,2258,6478,25438,26544,15494,932,5654,28901,59254,14267,57392,27618,18319,1627,521,16337,19804,14933,2093,10638,1875,19508,1781,25736,37793,5374,5687,33536,1292,6856,25991,29618,29973,35187,31502,21089,9008,18171,85208,51780,277,36893],
                [-1,11,32,-1,534,7,54,169,0,143,47,58,12,71,14010,124,187,0,-1,-1,65,16,329,181,129,85,264,64,9669,61,58549,39,-1,-1,14,335,90,34,-1,-1,18,289,192,184,101,0,-1,-1,-1,44,56,59,340,125,2878,-1,-1,5509,-1,513,145,-1,235,-1,116,29,4906,190,73,138,165,4699,497,-1,-1],
                "mW{nAE?M??Sg@?M?m@n@Fn@LPKXr@ODOP_@^?,kUqeA[_@BUcBAAtAnBB,gRw|AcAA?r@D\\?NP??RR??S?U`@i@IG,uFo|A_B?c@A@ZKNJNnADFX\\?@M,_Ns|AmAABtAF?~@?,cTiiA_AA?bACTZ^f@[,sR}iAm@?AR?zANDXSf@e@,yJq|Aq@?o@AC?ArA^?L?Re@Z?JO,gYigA@e@m@@@@]`AP\\KHFH?@P?^@D?,kMomAM?GJ{@F?P[??d@J@Md@f@FZIT]Xw@,}[e}Ac@A_ACK?OVAPTVT@@MtABIC,aTiwAgAAGAAf@Ff@n@?X@,_TwkAQAs@A@z@?R~@@@SZe@?Q,eNggAm@C?NY?AnAn@@l@@?u@,oPksAGA@_AcAA?RJx@tAH,wZyxA]AASuAIMAC`AdCD,mGiwA_BAG?JTN??RI?H\\JAALPF^SBJFu@,{]}uAg@?_@BF\\KDCZL?V\\KJJNNH@O?u@R@,}ZcuA@S_BECbA~AB,yPilAe@?a@?]PX@?P[d@l@?v@@Le@KA,gYskAs@NJYMQ_@?IPb@PMh@RDKDTf@l@A@o@R??k@,cVkiA?SkA?S?An@Ad@bB@,mRasAKy@g@?YAAbA?JR?ARb@?@RFWJ?HI,yIcuAI]H??SO?KUe@A?vAPK?XPA?RRB,kTy|ACAoAAg@A?b@R?ART?rA@,yMipAQGe@?SA?\\]HCRT?DXpA?,_RenAkASE??~AP@\\Q`@?,}[wzA@YuACALUAZn@tAHOg@,wJiiAU?Ay@aAH@hBj@?R[XM,yM}mAqA?EYU?WP?z@d@?Z??Qz@GFK,wJomACb@Q?Af@@x@T?Tg@By@Z?Bc@,eVoxAWQ_AF[?Vh@@f@d@@d@?@g@F@,kTe{AsAA@dAVPROXBGWXS,yWevAe@AAg@Wi@]?Ad@Az@ARd@@@SN@j@?,qTynAa@?y@AAv@_@?Q^p@S@Xf@@r@@,{KmwA_@?_ADTxAR?BUp@L,cLogAk@?UFRh@?t@D?r@?JQWMKe@,kYk{Aa@\\o@II?Nf@@R\\@\\?Z?@kA,wZuqA?I{BEANH?Pl@tA@,eV{kAg@AAYq@RENVF?j@jA?,wGqjAKASV_AP@NYLf@LXG\\FXQ,oIwrA?IS@?QSC?SQ@?YQJq@MCTS?CB?TjARAVbA?,}TyrAy@B?XSAAv@KXDND?x@@@]L?CuAH?,wJuzAKO[?Sd@M?DpA^?d@@F?,mPu|AM?k@A?VHFa@h@?TjA@HI,gJ}gAg@MSZK`@Jd@VLKP@?h@@@w@,{^{yAy@Cg@AQRLFAL`@LDLMLHNPBA\\J@^CB{@,gY}qAKA?OYCI\\Kn@Af@G?AZH@l@o@L?LWK?,wJuoAg@Sy@??jA?LL?rA?,oMogAAiBOAU\\[H?fAl@B,aM_zA_@?_A??vAd@?~@E,sOkgA?gAg@Gw@A`@z@g@d@jA?X?,wOwrAuAIDXIHd@HCL|@??Rd@?BU,e[_nAIA@[F?@g@uAAAV?VLRP?AHVNFV?@^?,wJomAsA?BZYv@N@`AI@g@P?,yZswAeCECz@f@?~AD,wGqnA?q@_BL?dAx@?Cb@h@@,{NgwAe@?Y?Dx@A~@F@\\Jf@i@BC,wVurAQGOHCOUAQFA^?t@J?MVf@??RL?EOJY@w@R@,qR}qAK?GVASc@?@SS?I?BtAM?A\\`@?D??Sd@GRM?OP??SN@BM,_Zc}A}@AGn@HBAXn@H`@]BYXY,mZsrAQA?_@_BCSA?t@zBD?H,oQeqAOA?RQ??NSLe@F?RjARVQBS\\I?]R@?S,yGqqAe@G?SOIKNcA??|@f@R~AM,aP_zAG?IHkAA?RAh@dAPX?,yGutA?ACK_@RQG@MK@Ip@?PRA?HNH?Rd@F,wGilAi@A[?Cx@Uf@~@QRWJ@,_Wg{AU?@SS??c@E?YXCXNDAjA~@G,aSywA@i@S??SQ??OYRFVYCSNCb@fA@^?,mP{fAkA?YROEg@ZM`@xBBn@?,{PgwAeAQ?N_@??lAf@??SbA@,aGuyA]?GYoAEHhB~A@,{T}tAo@?Gg@e@??Pk@?NNIXJb@T@BNNIPFx@C,sXesAKc@HYOOOAARe@AAl@?^P@XB?NJ@@_@,_LgrA@WkAS?Ug@h@]KVRn@n@CTPFx@?"
            ],
            [
                "AZ",
                997842,
                -1,
                "Apache|Cochise|Coconino|Gila|Graham|Greenlee|La Paz|Maricopa|Mohave|Navajo|Pima|Pinal|Santa Cruz|Yavapai|Yuma",
                [37055,162200,41999,15170,15201,2675,-1,211891,19503,20363,18114,273261,10409,35229,-1],
                [580,843,173,32,339,48,0,733,134,-1,-1,193,-1,159,192],
                "zkAqeBgDV^zE^fFJrAVpDt@G^Vt@^RWoAmM^C,zsAqaAUyCwFb@K@`@pFfGg@,tyAygBcE^sBP~A|QpAw@`@JH]HDKiAf@EEg@bBOEe@PCCWtAc@|@s@QoBmCw@,dwAmuAIEI\\a@KqAv@Fx@gCTLzABXrADDf@b@F^\\^qBJq@NLVi@Ju@I_@j@I,joA}mASDSVu@_@P|Bq@xCvFc@CSWuCEg@sAE,llA_nA_@Wu@FP|BJ|AJlAJAp@yC,ziBoqAWUOqAW]}@g@mAd@]Qe@DLbAVhCpBUCQv@KR~Aj@GZGBOIaA,xaB_tAkBRoAf@Y_@uB\\Kt@Wh@OMKp@`BOHx@zAOPY\\nDnEc@c@_E,`bBghBEa@gEb@}@Jd@`ClCv@PnBn@jGd@E\\PlAe@b@g@ZeBE[Q[KyEaABa@`@Wa@,|oAgfBaCTj@fH_@BnAlMREM{AfCUGy@,tcBuiAoEb@cIp@BRTxCdCSDj@d@EBTtIeE,luAanA_@pB_@]c@GVtCbIq@]oDQX{ANIy@,zsAqaANtApBQr@[CUe@DEk@,z_Bo~A}@r@uAb@BVQBDd@cBNDf@g@DJhAh@|@k@HH^tB]X^nAg@jBSMcA,hkBulAq@Q?i@k@FS_Bw@JBPqBTb@~DPdB|FwC"
            ],
            [
                "CA",
                5239070,
                82010,
                "Alameda|Alpine|Amador|Butte|Calaveras|Colusa|Contra Costa|Del Norte|El Dorado|Fresno|Glenn|Humboldt|Imperial|Inyo|Kern|Kings|Lake|Lassen|Los Angeles|Madera|Marin|Mariposa|Mendocino|Merced|Modoc|Mono|Monterey|Napa|Nevada|Orange|Placer|Plumas|Riverside|Sacramento|San Benito|San Bernardino|San Diego|San Francisco|San Joaquin|San Luis Obispo|San Mateo|Santa Barbara|Santa Clara|Santa Cruz|Shasta|Sierra|Siskiyou|Solano|Sonoma|Stanislaus|Sutter|Tehama|Trinity|Tulare|Tuolumne|Ventura|Yolo|Yuba",
                [12221,-1,12990,19927,22889,22909,29568,7047,7497,467508,52325,59575,412212,11374,326215,324887,2888,43348,6364,195378,22953,33288,14870,593108,56498,5931,50420,11989,4861,-1,12864,10235,25955,36760,25449,99021,14656,0,305344,38139,2565,26489,11090,1019,17975,6804,47198,50792,52370,406835,3510,41071,3791,1080665,15242,3453,52995,14851],
                [12,0,229,3481,486,474,21,-1,415,5923,344,151,228,-1,1704,76,-1,239,169,112,215,102,398,14,23,-1,210,13,516,61,534,220,558,1296,-1,587,-1,0,1437,548,-1,635,102,3,571,0,387,138,872,6428,549,812,422,-1,49,127,695,239],
                "nlC}yBq@v@iAANx@IPdB[DK,p_C{zBIi@i@[?Mg@z@JVEZV\\DU`@DPW,pdCe|Be@A[Ty@Bm@WHh@|@GzA`@PC?Q,rcC{gCEPRd@g@nANJXCZ`@d@?l@OGOM_@TEQg@JQESg@J,|dCezBQB{Aa@}@FCP\\FlB~A^aA,vkCqdCkCf@FNLXMl@JLrAWNa@IYf@k@,zkC}zBcAPQL_@GL|@hA@p@w@JQ,|mCixC}@Ro@Lf@ZT~APCEQn@MDmA,xdCu}Bo@m@c@AW\\[SiAHI`@?Lh@Zl@Vx@CZUd@@,rdCqqBM~@aBHy@o@e@AWi@w@a@c@b@AjAa@XBfAhBWDPt@ODRXGVLRJr@IJn@jAj@n@aAE[OIIa@f@eA,|kCsgCoCh@KPPf@UDL^jCg@Ki@VE,hnCotCo@LDPQBYH?l@Zt@TI?j@l@|ClAUd@gACi@qAeBCc@,`rBcsAeGr@PBH`ACN[F?h@p@P`G],nzBarB_Dd@yAdCsDnG[f@zIiA`AKK}BVaBCgA`@Y,~dCshBqB\\iG`AaAJv@rEvEk@|@U\\YDAA_Af@]Bi@\\[CQPE,leCqiBkAk@Ko@s@HSKKVj@`CpB]B?,blCafCWDJh@HLg@j@HXO`@JHT^Z?To@Zo@Ea@QIE{@,daCunCuEx@pAzHXASq@Fc@z@aAPG`@RPSKg@j@K,b`CsvAS?[d@HHTK@I baCssAGAa@v@N@Rc@ p_C_`BwEj@TrBh@dA`@Gb@d@r@IDcAhAWaAa@,xaC{qB}@e@SDmA_ACHWFIb@v@`@Vh@d@@x@n@`BIL_A,foCs}BOAy@`AJh@GPTAh@w@XCSa@,x|B{tBlA~@RE|@d@NULyAAIKF@Oq@Ii@Zu@U,`qCsjCmAT_Bb@Hd@Dp@`@FDz@PHD`@[n@zBQPq@I{AYcA,bhCesBw@a@?KsBWMxAOTxAHpAn@`@_@B],h`CitCyAVkCd@j@nDtEy@RC,r}BayBW]D[KWa@p@U`@_BlCmAtB~Ce@b@c@Hc@VGS]Lo@h@e@,vkCcrBUIGHcAbDUE[`@?YKLDZo@`AI\\bEu@|@eCAaAa@M,plCq_C[?U_@OHKnADh@VCF`@b@IKCV_B,|bCcbCcAMSVsATFZxBYfAl@`@MQs@,xzByxAORc@x@X\\TThAcBc@e@,teC_`CWAa@LgAm@yBXF^@JBHhAIZRV]b@@n@l@t@U,lcC}iC[Fk@JJf@QRa@SQF{@`AGb@Rp@vAQX]^VJDf@oASe@DQW]PM,hzBexA[Y_@BqOdBV\\NpAVTdGs@pEo@j@YY],zgCu{B]u@De@SDu@TGn@Jl@jAKZ\\^FPMY@,xjCcrBK?[Ke@NC\\a@^g@dAH`@NHJM?XZa@TD,xxBs~Aw@sE{IhAmCtEDZ[dBc@f@|@f@pOeB^CZXNSi@eA,tzBwtAUUk@XqEn@h@nD|DW@_@LAG_B,dmCwxBPEAMICI@?NA@,dhCezB[]kAJ?PC`@RhA\\IlAf@HQOy@,fkCijBcEt@C?Hd@QDBP]ZCh@g@\\@~@|AiAr@J?VPWd@GI_@d@e@Mg@t@cA,vmC}xBQD@Xa@XEJTD@^BN\\A?PLUIi@Fc@,`dCy{ADJv@GLE@S piCa}AQEe@TO?GVZBHO |hCwcBe@FQV?Ws@K}AhAE@b@lBnBq@v@GXe@,~kCwvBeBZDhA[JFd@d@OZJhAmBA_@,vlCquBiAlBJ?FITHH]`@ETi@?Q]@,`gCipCgDn@SBj@~CZGdGe@QWy@S@[iAiA,lbCycC_@WY\\wAPY@Nz@rAURWbAL,njCgwCk@JuCh@cCf@n@nDfDo@Ia@JGlAb@AZbA_A?m@XIU_B,llCy{Bc@HGa@WBEi@aAJHp@OB`@j@XAbAQNW,bqCsaC{BPUn@FRW~AJBABP@x@aAN@,xhC{uBmAg@]HSiA_@`Aa@t@rBV?Jv@`@ZK,rgCybCm@NLpA]GXr@REZq@KMLm@,rkCckCeGd@?TQLV\\jAh@f@KDRnCi@Ie@I{@,rkCsqCcA~@@[mAc@KFH`@ARhAhAAZx@RPVILHz@~Ac@m@}C?k@UH,nyBslBW`BJ|BhGaAk@aCJWWMYFESu@NEQ,l_CizBQVa@EETDZi@d@Mn@R\\BI^e@t@Th@[p@HANJG@H`@u@mB_B,pcCa~Ac@mB]X}@TOzB`A`@j@e@ `dCy{ASBBJTC ~eCwvAMAMJBFD@LG,rjC{`CsAV[p@Ed@\\t@NCIq@`AKJoANI,dfCibCe@?[a@YBOKKENt@l@LPr@V@\\F"
            ],
            [
                "CO",
                2658012,
                515878,
                "Adams|Alamosa|Arapahoe|Archuleta|Baca|Bent|Boulder|Broomfield|Chaffee|Cheyenne|Clear Creek|Conejos|Costilla|Crowley|Custer|Delta|Denver|Dolores|Douglas|Eagle|Elbert|El Paso|Fremont|Garfield|Gilpin|Grand|Gunnison|Hinsdale|Huerfano|Jackson|Jefferson|Kiowa|Kit Carson|Lake|La Plata|Larimer|Las Animas|Lincoln|Logan|Mesa|Mineral|Moffat|Montezuma|Montrose|Morgan|Otero|Ouray|Park|Phillips|Pitkin|Prowers|Pueblo|Rio Blanco|Rio Grande|Routt|Saguache|San Juan|San Miguel|Sedgwick|Summit|Teller|Washington|Weld|Yuma",
                [15103,10252,7767,7232,37007,25588,3425,-1,6387,24274,-1,19837,3939,79842,3244,30710,-1,4059,6144,5855,35783,16451,7706,19353,59,11389,16299,290,13855,25960,1524,17684,234841,745,16202,73026,40618,38046,224115,27155,264,32937,15646,35892,245516,52853,3188,7029,26885,4123,113535,22799,21157,10733,32693,27353,0,7190,12627,582,1634,70884,545480,255184],
                [-1,28,270,-1,44,-1,88,0,10,0,0,126,-1,14,48,1004,0,-1,88,97,575,552,44,72,0,45,209,0,50,-1,-1,-1,-1,0,287,271,22,120,-1,423,0,113,212,1090,2287,97,31,52,-1,21,-1,126,94,224,200,28,0,17,-1,-1,-1,-1,1613,-1],
                "zn@svBGMCBEGgCJkADDz@dEQYCBKW@CQT?JRj@A,|u@seBGmAeBHFd@p@j@r@C,`o@qtBGKOLKGFICGeEP@d@@?~CM`AE,v}@ufB}@FgAJE?Df@]v@bDSJA,re@{eBy@ByBFBx@BvAhDKLA,`g@kjBqBHHhCx@Cv@C,xq@iyBeBFDz@BHDAHFf@C?Cl@C,lo@uvBIGE@CIOI?HDFBCFLRB,pw@oqBaAFIZ]PHd@KTX`@f@?\\aA[k@l@W,je@soB_EHDlA?R`EM,fr@ovB]VOBBf@fAEIIVUGUY@,jy@afBmBL?Hs@BBpAr@EpAG\\w@,ht@eeBq@k@a@MQH@hAD`AJAtAG,lj@mlB}AH@v@BRPA@LjAM,~s@okBaCLFjAPWTVDIZF,h|@esBNxBtCQCc@k@K]]e@F,|n@wuBk@@KSU?BPVACJXBBFGHJFNMFJF?E?,xeA}jBgCLEPg@CSTBJP@?LdDSX\\,`o@etBaADH`B~@Ep@E,hy@wwBeAD_@BCb@_@`@NVC^b@?tBMO{B,~l@_tB_DLLzCx@EEw@fBI,ho@cqB_ADgBHDv@DlAvCKA]C_@TC,~t@{lBYa@JUmBJM??Jq@B@\\Dx@PA`CM,hdAevBEc@{DPC]uAHASQBEg@m@DBd@JANzBt@GpGa@,br@awBm@B?BBd@NC\\W,zv@e{BENSEENc@Fm@?S[[t@HfABPHHXAFTL?b@u@\\E^C,x}@{lBU@IqAOyBQEO^c@DW\\e@IMNm@VZj@]`A`COF|@`BI,v}@ojBKSFSaBHBj@V?JrB|@GEo@G_@,nr@wgB?_@[GEHUWQVwB`@bAlArAXAiAPI`@L,nw@e_CwAHUBk@vBRZl@?b@GDORDDOIyA^S,|p@ktBCg@Ce@g@B@DSC@ZDd@D?G??Jx@zAJ?,ng@clBy@@ASaELDjAvBEpBIN?,`e@isB{@B_CD?@D`B?P~DI,nv@osBc@?M?PfA`AGQs@,d`AohBsAHDn@J|AzCS,`t@w~BwCLw@DLnCR??PdBGZu@,dq@kdBsAYcAmAo@T?RqBHw@BJnC`DKhEQ,fj@{nBy@DM{CA?{AFHtBF|A@Rx@A|AI,lf@o}B_@@wBFBx@DbAR?pBI?QPA,ldAguBqG`@CXPDp@`@d@G\\\\j@JBb@Bd@tBO,tz@ajBS?]^L~AfAKKsB,dcAg~BIkA{DXcBJHvATJHdAlGa@,dfAehBY]eDRxAbCrBM,heAgoBuBNCe@uCPHpATAtAQEPWJDLvDY,vf@ezBQ@?PH`Bd@CjAEIsB,tj@yiBkALAMQ@CSO?HjCpBI?S,x}@{lBEb@GRJR^HT[AUJIEMVKDQ,|t@osBQDe@g@gADH`BK?F`BlBKIe@\\QH[,xa@k{BeBD@JBx@dBG,z{@etBu@FuBLNJPr@DLLOd@HV]b@EN_@,nc@ajBwBD?@DtB@RxBG,|o@akBQ@Ey@wCJFrAFzAn@UvBa@,rcAe{BmG`@cAFB\\l@EDf@PC@RtAIB\\zDQ,by@aiBQ@@R}AHFlAlBMD?,zy@m_CkAF@P_@RHxAFrBdAECe@C]bAGIeAUK,pz@mkBG}@aCNg@?_@j@o@vA?^dBI|AIASPA\\_@R?,n_AkiBWY_@IMh@F^rAI?MQA,neA{lBwDXKH@TUZVXRUf@BDQfCM,ta@e}BE@}AD@v@dBE,bv@mwB]Dc@t@M?WTHHd@f@PEL?B_@OW^a@,zp@iqBq@DJfAUBB^p@C?KL?,zg@wtBE{@e@BIaBqBHP`Ez@CzAG,pm@c~BsCJoAFHhB~AGHrBfCK?INHE{@?QS?,rb@gyBS?eBF?RDjAD~A~BE"
            ],
            [
                "CT",
                45837,
                3701,
                "Fairfield|Hartford|Litchfield|Middlesex|New Haven|New London|Tolland|Windham",
                [287,2419,9870,566,1100,12797,9505,9293],
                [94,661,487,131,286,1356,287,399],
                "mrBelCDc@D]U`@U?o@ZA\\nAz@PUa@a@,_tBmqCa@@m@SGb@_@t@FDHK^JBJ\\JHOLa@IC?e@TD,arBgnCNuAeAMGA?NUE?d@HBM`@j@p@T?,avBsnCCK_@KIJGHQAGNRFUZ\\LZc@LF,ytBwnCIN]KI`@MG[b@~@NTX@]n@[,owB_oCGEKGGWOF{@ICFGf@BVjAZT[SGFOP@,ovB_rC{@MEACNRBUh@JJFVJF^u@,qxBorCo@GQ|@CPz@HNGKKTi@SC"
            ],
            [
                "DC",
                0,
                0,
                "District of Columbia",
                [-2],
                [-2],
                "ucBowBIOGBQLNX@I@E"
            ],
            [
                "DE",
                10093,
                2935,
                "Kent|New Castle|Sussex",
                [5299,1379,3415],
                [1103,70,1762],
                "gjBo{B]GIOu@rAL?T`@ZFRcADU,ijBk_C_@@Nh@KZHDSTHN\\FBORkA,ekBixB[GUa@M?k@XWhAp@Hz@JDUBO"
            ],
            [
                "FL",
                1574057,
                14482,
                "Alachua|Baker|Bay|Bradford|Brevard|Broward|Calhoun|Charlotte|Citrus|Clay|Collier|Columbia|DeSoto|Dixie|Duval|Escambia|Flagler|Franklin|Gadsden|Gilchrist|Glades|Gulf|Hamilton|Hardee|Hendry|Hernando|Highlands|Hillsborough|Holmes|Indian River|Jackson|Jefferson|Lafayette|Lake|Lee|Leon|Levy|Liberty|Madison|Manatee|Marion|Martin|Miami-Dade|Monroe|Nassau|Okaloosa|Okeechobee|Orange|Osceola|Palm Beach|Pasco|Pinellas|Polk|Putnam|St. Johns|St. Lucie|Santa Rosa|Sarasota|Seminole|Sumter|Suwannee|Taylor|Union|Volusia|Wakulla|Walton|Washington",
                [44902,3684,735,7506,23448,-1,1724,12609,10361,6664,10033,29392,65480,3841,2904,9675,4917,327,4563,37733,64634,1390,7178,71991,64720,9372,74469,32943,12401,23234,34278,29064,17387,25550,9946,1936,46261,1220,26480,38973,40796,25376,7668,-1,4736,2741,157001,16382,99418,14545,34635,-1,109225,13437,801,32357,6955,14361,3943,32985,37145,3906,7438,9965,1118,7000,9212],
                [816,326,20,301,146,29,-1,122,218,137,37,169,144,72,66,72,0,0,32,154,36,0,-1,69,-1,256,122,1114,91,179,182,226,310,450,207,259,127,47,676,149,403,72,128,0,252,359,80,485,34,183,362,-1,675,157,20,184,172,-1,91,272,281,104,166,388,77,327,104],
                "goAqs@U[U@]JYASVGt@XNBMd@DZBTO,}oA}x@g@AKh@YAARCR?FNBz@HNaB,{z@}t@YMeAGB[IAI?GnAG|@|B_A,arAcv@OCM|ARWX@\\KSK,}{Aen@s@`AFl@k@pApATNsB`@u@@e@,u}Ai]_DWEjAvCVH{@,k~@qv@sAQV|Ar@B,{sAa`@UCBQg@EaBOGx@lCP,ooAym@g@Mm@Ja@^L\\nAD,qrAov@eAKAN[x@j@Fh@^L}A,uwAk\\e@AKm@y@IIx@mAMIz@Ed@pBPz@M,inAct@JyAUAEMRa@CIUAU?O`BP`@IHTZ,ouAcb@B]aBMI`A`BN,{jAyq@Mc@kAKCr@Nv@PNP]`@M,mrAcw@u@iASGMJGIMJSt@J@E^n@B@OdAJ,}p@gx@qAEXb@Op@[VNf@t@LYc@POEa@n@i@,gvAcs@y@S]p@HDE\\p@HF]RS,_aAur@yASg@BANd@@@TtAz@b@K_@],_aAcw@KY{AEQ?Pn@h@X,umAis@EMMK]PIx@v@@,wxAma@y@GMi@k@EMDEl@Dj@xBP,{~@cr@F}@s@CBV[VAh@^\\XB,sjAqx@a@AsAEBHS`@DLT@v@ONN,auAce@_BMK`A`BL,_yAs_@yBQEk@UfCCNlALHy@x@H,ipAwk@oAEm@b@xBZ,axAqe@sAKHX_A|@j@DLh@x@FHaA,}pAeh@iBOYpB`BLS]ZKR[,ez@ay@eBKNd@?Rf@E@Rd@B,c|Amg@qAUc@|@dAHRBBQP@,k}@my@AA{AIa@z@JXrAPH?Bo@`@E,kfAou@Ba@OUH_@s@CWACNVRELN^Xr@N?,sjA}u@WAG^u@PQTDLjAJJM,ktAen@w@IDcA_At@AVDTl@JMxAx@H,qtAa_@mCQGv@Jl@d@@XWj@@,}bAyu@i@YQo@e@CM?I^NTC`@xBH,wlAmo@QOOw@w@AUN[CGx@VBCd@f@LR_@h@JFW,g`Aet@W}A}@h@JRMb@YVxARZW,yhAmx@q@AGAa@r@H\\V@vA@O_@DMWS,_rAud@aBMI`AC\\d@BDe@lAHT[Q?,cqAkq@e@ECLYOe@Oe@d@IHEbAv@HdAHl@KBe@WC,_~Amc@mAM@KOAa@z@|CZc@i@,i~AwYDe@wCWCbAPKJ|@GNUa@Bh@ZHRZfAP,kaBaVS[[IbArBx@j@XLJGcBqAMU wzAeYqBQYfCj@RLKFq@ wyAiPGYy@k@]FMN mxAyOEQUCDR iwAcPGKKB?LN@,krAww@HuAUQyAHIl@LKFHLKRFt@hA,wu@ux@Q?y@EKfClAD,uzA}e@s@IQACPSCKlACPb@h@Dm@LE~@}@,ywAom@B`@{AIa@t@xCVLyA,yvAij@yCWOrBEd@r@HRe@v@i@ODCQRBXa@R@,_}Aqa@}C[WjC~CV,mpA}i@yB[Cb@B^hBNh@D,soA_h@i@EEh@SZXt@DYVW,ktAui@SIy@IARSAY`@SCBPNEw@h@Sd@rAJ~ALXqB,_sAis@i@_@k@GQl@EXSRl@Vd@e@d@N,ytAkv@o@CD_@KAq@xBx@RPm@,s}A{e@eAIa@z@N@AJlAL,os@mx@gAGIfCnATOg@ZWNq@,uqA{b@mAIEd@e@CEd@f@DCPTB,ywAom@EUe@NUIUf@zAH,erA{m@eAISdCRHBc@l@c@M],kkA_v@I]OOw@NKxALJPUt@Q,agAgt@Ys@wAAIpAKLLb@,epAyu@{@IXj@RJTAHI,suA}p@m@WG\\q@ID]IE}A~Bl@FAd@Tg@THd@O@W~@u@,qbAeu@yBIEf@f@LFRf@CXW,cx@{x@e@C[AE~@e@CJNM\\VXAXlAO,q{@ew@ASg@D?Sa@DCn@H@CZdAFXLWYL]"
            ],
            [
                "GA",
                1000560,
                41671,
                "Appling|Atkinson|Bacon|Baker|Baldwin|Banks|Barrow|Bartow|Ben Hill|Berrien|Bibb|Bleckley|Brantley|Brooks|Bryan|Bulloch|Burke|Butts|Calhoun|Camden|Candler|Carroll|Catoosa|Charlton|Chatham|Chattahoochee|Chattooga|Cherokee|Clarke|Clay|Clayton|Clinch|Cobb|Coffee|Colquitt|Columbia|Cook|Coweta|Crawford|Crisp|Dade|Dawson|Decatur|DeKalb|Dodge|Dooly|Dougherty|Douglas|Early|Echols|Effingham|Elbert|Emanuel|Evans|Fannin|Fayette|Floyd|Forsyth|Franklin|Fulton|Gilmer|Glascock|Glynn|Gordon|Grady|Greene|Gwinnett|Habersham|Hall|Hancock|Haralson|Harris|Hart|Heard|Henry|Houston|Irwin|Jackson|Jasper|Jeff Davis|Jefferson|Jenkins|Johnson|Jones|Lamar|Lanier|Laurens|Lee|Liberty|Lincoln|Long|Lowndes|Lumpkin|McDuffie|McIntosh|Macon|Madison|Marion|Meriwether|Miller|Mitchell|Monroe|Montgomery|Morgan|Murray|Muscogee|Newton|Oconee|Oglethorpe|Paulding|Peach|Pickens|Pierce|Pike|Polk|Pulaski|Putnam|Quitman|Rabun|Randolph|Richmond|Rockdale|Schley|Screven|Seminole|Spalding|Stephens|Stewart|Sumter|Talbot|Taliaferro|Tattnall|Taylor|Telfair|Terrell|Thomas|Tift|Toombs|Towns|Treutlen|Troup|Turner|Twiggs|Union|Upson|Walker|Walton|Ware|Warren|Washington|Wayne|Webster|Wheeler|White|Whitfield|Wilcox|Wilkes|Wilkinson|Worth",
                [7167,7838,7406,6479,2060,14264,6910,18065,1597,9419,1041,1384,1914,13163,992,5438,25810,4007,5273,368,3214,21507,4278,1289,254,0,9521,2769,702,3775,-1,3934,57,10939,10809,1129,6368,5745,2522,11534,2885,3946,17555,0,6905,2867,2386,2467,13654,8062,1230,9269,3735,3925,1537,743,9447,2996,19584,886,5027,1892,232,17140,22187,5577,801,9320,13094,3132,4798,3012,13200,5615,1986,5971,6612,18063,8951,4368,12360,5179,4515,2808,4242,418,9398,9825,553,5314,1242,2282,6054,8710,-1,29551,20457,3375,6904,13218,23907,6710,2308,19419,9369,-1,5708,9550,13876,1499,1249,3931,2130,3919,6362,765,18763,1596,1121,6451,420,1514,1658,7984,3630,1823,3433,1070,17060,1272,2085,11043,4906,3476,1614,14605,6188,7259,1141,1382,5550,5491,2430,6032,4870,15249,11780,1649,2736,6138,4474,5801,1448,6203,7011,8807,11740,1298,6944],
                [144,-1,0,-1,0,-1,30,78,-1,-1,15,12,261,-1,62,38,233,-1,-1,18,-1,102,-1,-1,0,0,96,49,14,-1,0,0,-1,-1,365,38,-1,43,41,-1,30,35,249,0,128,-1,64,-1,-1,86,113,59,64,0,36,100,89,66,143,7,51,-1,40,912,91,64,0,124,247,73,50,60,-1,10,-1,172,-1,109,124,33,-1,-1,12,14,20,29,509,23,-1,-1,0,33,-1,42,-1,-1,224,33,76,-1,79,-1,131,141,97,-1,129,50,-1,87,63,25,64,145,77,0,8,-1,43,-1,-1,0,-1,115,-1,10,-1,0,48,-1,-1,-1,9,-1,0,161,-1,76,-1,56,63,20,13,22,18,329,209,45,-1,42,114,0,90,54,31,26,6,39,17],
                "onAmbAg@DU?MLLLI`ARIz@_@B[OA,{jAc~@aB?CRL?GRv@FL@?S,umAg`AQA?I{@^PXLBJ@BIP@,cbAa}@e@Eu@EFRXLXt@D?Be@R?,qgAajA]C_@BCTGG?\\LKd@V,keAqrAKMO?I@Or@FFNKL@JGJM,odAipAKLe@@ELPNRDFGNM,q}@eoA?cA}@KGhAL@`@B,ohAw`Aw@Gc@HCVp@HJC@OV@,uiAi~@c@CAHY\\?RAFVB@ZP@Lo@TS,efAghAKL[DLVAPRCREPW,{gA}dAm@c@S`@DEZj@^W,cpAm}@Q@KQUEJQ{@?@d@Z\\VA@LF@,wgA_{@]A?ISFIVQJTV[Vp@@V@,crAgdA{@]M\\u@l@A^f@OL[b@?XU,kpAegA[M{@X[r@z@\\HQ\\CEa@XW,enAqkAOGOJk@IQF]ROFd@b@PGf@LFX^?,scAijAUUEOMNKf@f@?N@,{`Ag~@s@EQAGf@d@D\\@DK,esAo}@[FKEa@XA|@xAILq@,gpAwfAYVD`@H?f@CBEMg@II,g|@}kAq@S?UYBEl@OADLZVp@BBK,s{@guAq@EHd@LLH?@QJ@,gqAc|@GAAMW@Mp@TPItAX@Ji@Eq@r@DDo@,mtAgdAg@c@IVm@JGFj@dAB?@_@,i_AkcAe@MKUIECbAn@DCGVM,mz@irAkAGH`@XPDRL@Ns@,o_AuqAMA?F{@G?HC`@NBHVj@B,gfAkoAEGWKSD@HGHBLZKPA,}~@c_A_@AE`@WCCZf@FDGRs@,{aAqlAMAGJLt@D@@YNO@U,clAs|@w@Gi@j@WpAF@T?BUb@CPSVC,i_AioAMAk@CKPJd@RTHMP@,yjAm~@Uo@BW]KC^g@EKj@BV`B?,}eAy|@_AG[CCZF\\?H\\@p@D@G,{lAanASMQ?SPQFh@p@^g@,uhAk{@G]B[MEURMn@`@B,g~@qjA[Wm@A?RY^?F~@D@FLE,{cAegAk@EQVSDJ@d@h@V_@P?,qeAuaAaAGCf@?H`@BZEAM,uy@auAWASATrALs@,}aAmsAABALg@TGPv@D?I@QJ?FSOA,kaA}w@KSC}@a@EE?YCItA,abAwnAs@d@L`@JEP@L@FgA,}iA_eAc@v@QKDLj@x@\\i@EOLS[k@,aeAsbA]]i@CEb@CR`AF,acAo~@[Cs@KIj@ZDt@D,s~@cmA_@IQAILd@h@N@,q_A{{@?o@EFg@GEJ]AAd@p@FAf@P@RU,clAgz@IEWBQRc@BCTT@rADBc@EM,csAyfAY[SFc@h@?Vf@b@L],shAoqAQ?a@UIL_@h@GJNCVDd@IZY,umA}gASQ_@?O\\QJBLHAHHLf@CDTHJKASRG\\?MGFGUSDG,qpA}dAI?]BIPMJFHh@A,g_AuuAu@Ea@CFFS^Fb@BH@C^i@p@?,q`AkkAYMONAXDTJ@X_@,a{@gpAMAESYQIa@GA@h@Q??bAbAH,}aAkpABa@w@EEHFTLF@X^I,qfA}rAg@GKOIFBr@HFX?DF,i_AwkAe@i@SUKe@JQIWOCAN_@H\\XLAGfAP@ATXLl@@,k_AwtAq@?_@h@HLN@t@H@G,kkAakAa@UWHVXAJL?NGBM,gsAu~@O]]Ti@BRf@C\\`@YJDZG,a}@srAAGWEc@?KDAFA\\|@JP?,}cAyz@o@EQvAd@BP?,ggAsmASQu@FIFHPCXVZVY?I,_cAqoAAYa@HKGD\\OL\\b@DFr@e@,ydAguAK?KNa@?AFLn@N?JLJMGIHWCQJM,qcAsqAFQUU_@CKLFNKL^h@JF`@IMGGU,}hAmkAW[]?Wf@ABp@h@FFBU^C?OQM,w{@smA}@GCR?Tp@R,w}@sfA{@G]BGv@fABJ],ohAmsAKBUAUd@`@TP?FI,u|@mjAq@CSh@r@Z,ibAslAQAKPODWLDNTTHGd@?Mu@,yeAydAUM@e@SBYj@?JPZh@B,shA__ACe@WAANKBq@ITn@b@B,odAipA_@i@KFMAOJK`@VJDFDMd@A,yeAglA]PEx@n@NBKJg@COYM,ilAaaA_@[QKICI?CZN@CZ?HP@f@D,alAgjAM?@KWYGIEAQFC`BRPPIHk@,ioAohAGYg@MQFHt@EDZLPK,wjAogAYMEFk@QQHFPEFTRGFLFFUd@QPB,meAkiAo@OSEUv@FFPLZEJM,{bAoiAW?@EOAC|@J?@KXB,}jAi{@A[WC@GMAIdAHDDUXB,iiAafAm@a@QCe@PGTLh@EBZ\\PJb@w@,{eA{`A@LHJA`@r@JAm@NG@I,irAqcAGIYTc@?MZg@NC??d@JQh@BJKv@]?UNG,ykAapAo@VWXP?RLHBf@gA,_rAicAOF?Tw@\\H\\NJ`Ao@,iiAc{@a@CQAENYCETJ@DLCb@`@@F@ZWUWPK,_bAisACIUAMWO@Gn@TTf@U,skAsmAWMEBICAT_@f@HHD@\\E,msAc`AOKI]KJi@CKPHx@h@C\\U,qcAycAUa@QE_@FEf@\\\\^GD?FM,yfAaqAGGEGY?IGGHBJ[XJDNCTLRE,eaAudAa@IM^?v@?DN@XQ@?,i_AaiAAG_AEAF?n@EP`@L\\C,ebA{{@S?Cd@`@Dd@B@g@,_eAm}@[EAXEv@T@n@DXBYu@YM,ycAygAK?B}@g@?CJWb@\\Zj@D,gnAceA@tAHBJIR}@,weAulAYu@UV]`@?Hl@P\\Q,e~@quAE?[CC\\?z@JEb@?DGKG,q~@{dAgACEBBJJTd@LF[,wcA}kAQ_@?Sm@ZALAHXLBNLO,gfAkoAEDQ@[JDFEHRPTWZO,{gAwnACMFIAIUMOBKEe@H^l@GHFHt@GDI,g~@eoAa@CIz@^HXCBS@KM?,ydAaeAA?e@i@KAAd@TL,m_AsrAu@IGRK?APz@F?GL@,coAu~@MCQYSHM?ERKPTDJPPATK,maAgiAGGe@?Al@n@H,m{@{nAcAIU?D\\L?AJ|@FBM,igAucAQ[_@VMRDNr@B,wfAukAm@QWXCHPL?N\\BRD,c_As`AU@BDMBA^F@^@BK,geAmvAKAaAK`@bA`@?JOJ?@K,}_Ae_AGA@_@m@EK?Q~@r@DVB,smAykAIIi@q@ABSJAXQD?Lj@HNKNF,{bAulAKDMa@EGMF?RP^NE,ubA_dA[DANGLE?ANl@B,kqAoiAe@c@a@|@I^XZz@YDE,c`Aiz@QAe@CB|@JR`@{@,kaAwiAKAEUEAe@?IF@RADV?d@?FF@G,gfA_sAMo@o@XJNf@F,e_AcaABOWWo@EA?EbAl@DLCCETA,ubAabA?Em@C@O_@FO\\IXlAFAHTQ,q`AwfAa@Mm@XXj@`@HHDCKDC,qiA}mAGIOVKIYHHTLABP\\?BYIQ,ioAaeAg@BMh@i@@HFRt@NELMT??w@,gbA_eAYk@OHQ?W^@?PDT`@ZE,ajAkaAk@y@{@f@^Z\\Jb@I,}aAm`AYCAIUPOF@l@ZBP@,meA_{@UAAFq@EIrAr@BL?,wgAu~@?G[Aa@TL\\LDZB,gnAceAKJUIM`@?v@f@EH?,acAevAeAGNXAJBDPBFWRA,wlA_fA]?SF@Rj@PJ?DC,g}@khAs@[MDIdAz@FNs@,ufAg`Aa@C?IWAGPBd@Z@?FLKL@,mgAsgAQMi@~@l@b@Xk@@Q,_bA_vAUCKAELS@GVJPNALVT@Gc@R_@,maAwgAo@IYCAJARHb@NIl@Y,kz@qrAUsAQAA\\KAAPI?@HSACT@FF@jAF,{cAymA]c@GFSE[NXt@l@[,}mAc~@CWQACHKAIZUJc@h@t@FEn@s@EDp@f@@VqAh@k@FSM?,okAomACC[t@]DFHVI`@TVg@CQM@,{iAsiAq@i@CLOFWRIj@j@PDGXLZe@,{pAyaAODaAn@INN\\z@?DSL?HaA,kaAqbAYPOACd@@HXBJ?,mkAecAEM[]K?S|@KHPJ,wcAktAKQQCKLBPIVFH^B,m|@ysAMMIe@A?]CB~@JFEFVDBUR@,sgA}aABSs@C]h@EJv@FV@,qjA_pAWEg@fADCVLBBXIJHNWFI,ghAihAe@WMJ[d@?Jl@`@h@_A,yeAm`A[DEf@MAMJEr@~@F@YHk@@a@"
            ],
            [
                "IA",
                3517805,
                23808603,
                "Adair|Adams|Allamakee|Appanoose|Audubon|Benton|Black Hawk|Boone|Bremer|Buchanan|Buena Vista|Butler|Calhoun|Carroll|Cass|Cedar|Cerro Gordo|Cherokee|Chickasaw|Clarke|Clay|Clayton|Clinton|Crawford|Dallas|Davis|Decatur|Delaware|Des Moines|Dickinson|Dubuque|Emmet|Fayette|Floyd|Franklin|Fremont|Greene|Grundy|Guthrie|Hamilton|Hancock|Hardin|Harrison|Henry|Howard|Humboldt|Ida|Iowa|Jackson|Jasper|Jefferson|Johnson|Jones|Keokuk|Kossuth|Lee|Linn|Louisa|Lucas|Lyon|Madison|Mahaska|Marion|Marshall|Mills|Mitchell|Monona|Monroe|Montgomery|Muscatine|O'Brien|Osceola|Page|Palo Alto|Plymouth|Pocahontas|Polk|Pottawattamie|Poweshiek|Ringgold|Sac|Scott|Shelby|Sioux|Story|Tama|Taylor|Union|Van Buren|Wapello|Warren|Washington|Wayne|Webster|Winnebago|Winneshiek|Woodbury|Worth|Wright",
                [33911,41682,72317,29898,28496,25480,15968,12052,16877,23412,20289,16947,17467,65394,46101,17876,10420,55504,33446,25296,20694,69297,50056,48996,27413,28544,39170,104253,5113,23291,122012,9382,56930,19139,10572,11578,25724,9419,32814,3888,9371,16563,26011,17685,33433,7511,38968,31802,85562,27348,14189,20708,48192,22215,21456,14635,20467,4262,25697,176388,31279,24494,20237,26404,3049,58128,15646,23990,17433,17491,59079,69635,22984,24105,106095,25821,6089,48084,24584,42718,48084,13842,41088,381688,17170,31502,27268,28446,19164,13981,21710,15531,27097,10380,4277,80406,70835,3543,4867],
                [51672,49787,124408,5758,230067,117999,343932,131991,229788,340814,553052,316356,338355,687525,100919,265422,110359,248762,330652,96648,193903,322573,121226,462340,38395,113627,63701,470395,43782,55120,110695,183186,318638,222565,564205,-1,242588,216487,132776,680094,364309,860744,22706,73859,531959,113261,62982,115752,62925,168666,61147,162301,74885,172011,542697,66612,163492,330842,40247,966636,55247,335731,23549,146882,119,239896,10507,-1,26385,72124,472110,476361,10685,791666,919557,295020,-1,92276,87202,94973,345111,273337,200835,1460697,104732,150494,54827,93053,116157,65563,5628,1486642,-1,163062,194609,153725,39665,40699,429483],
                "wEo_CkAA?lAd@?d@@,qDa}Be@?e@AAx@jA@,aU}mC_AAAPYb@Nd@dAB,cNm{BmACAdAJ?~@B,uC_bCw@?InAx@?,}QkeCe@Ae@AE`BlA@,qPwgCkAAEjAd@@d@@Dy@,mHodCe@?e@AAlAR?x@@,oPqiCkACAz@jA@,}RygCmACElAf@?d@@,cBiiCkA?AlAlA?,cNoiCkAAAx@?RjA@,qD{fCkA?GlAd@?b@?,uCmdCe@?c@?AlAR?v@?,kCo_CQ?y@??lAd@?d@?,{VqbC@QmACAd@Af@lAB,sK{kCkAAAHAbAlA@,UiiCmA??lAx@?R?,kPwkCmAA?\\Ad@jAB,iIc}Be@Ae@AAz@jA@,aBukCmAA?lAjA?,gU_kCeACATQl@]Td@FlAB,gYgcC@SyBEATJ`@JJXGdAB,u@mdCw@?g@??lAlA?P?,{GabCQ?y@AEnAhA@,qPq{BkAAA`AZ@n@B,kIi{BkAAAdAb@@f@@,kU}gCmACClAd@@d@@,cWa}BeAA?XT\\@Zp@U,aBmmCkA?At@lA@,yWahCe@G_@FIX[X\\@ARd@@d@@,mDmmCI?aAAAv@jA?,{RuiC@e@mACC`BlAB,aNskCiACCdAjA@,uKmiCmAAAlAlA@,[mzBAYgA?CfA`AAT_@,_FmdCe@?g@A?lAP?x@@,eNagCkAAEx@d@??Rd@@,mE_bCS?y@AGnAjA@,kI}fCkAAGlAd@?d@@,gIykCkAAAlAjA@,wK_gCmAAElAd@?d@@,R_bCiA?Q?KnArA??GLBBa@GY,kUw{B@y@e@AQ?APBz@r@@,iPwmCQ?y@AC~@lA@,{FiiCmAA?x@jA@,i@{fCy@??RI??x@v@??y@J?,aRkbCmAAAlAP@x@@,cYueCe@A@S]A]f@YPAPxBD,uLebCQ?mAAClAR@jA@,{Ro}Be@Ag@?Ax@lAB,oTmbCkACAz@Ad@R@DSr@@,wVqeCe@Ae@AAx@ARlAB,qQ{_CS?y@AAjAd@@d@@,{FwkC@w@_@?k@?At@AlAlA@,kUc{Bs@Aq@THL^LDl@r@o@,iToeCg@?e@AAlAAPjAB,kVm_CSA?Rq@ADR]d@dA@@QP?,uKg}Be@?e@AAz@jA@,~AmmCW?_A?]??v@nBAE[,cHq_CiAAAlAd@@d@?,eOw_CSAw@AClAd@@d@@,yLu_CkAAClAf@?d@@@iA,eMsdCe@?e@AClAlA@,Ua}BoA??x@fA?Fa@,_NsmCiACA~@hAB@I,v@mdCmB??lAhA?@WTO,aNi}Bg@?e@AAx@lAB,eBa}Be@?e@?Ax@lA?,_Wo_C@e@mACQAA^f@HDRp@@,UukCkA?AjAlA?,UmmCaA?I??v@jA?,eBg{BmA?AfAn@?Z?,oDwkCkA??lAjA?,vAiiCmB??lAbB?Vc@,oDiiCkA?Ax@?RjA?,gJcbCS?y@ACnA?BjAA,?o_CsA?w@??lAd@?nA?FE@m@?M,uOgbCkACCnAR?v@@,_Gi{BkA?AfAd@@f@?,cB{fCmA?IlAd@?f@??y@H?,iYabCeACYFD`@bA^@_@P@,gA_bCmA?GnAP?v@?,xAwkCoB@?jAlB?Me@@],yJqdCe@?e@AAlAP?x@@,wPieCe@AC~AjABBmA?S,sDg{BkAA?hAX?n@?,}Fc}Be@?e@?Ax@jA?,}Rs{BmAC?RAl@d@@f@@,oPk}Be@Ae@AAz@jA@,mJs_CkA@AhAd@?d@@,_T}_CQAs@AERCx@d@@f@?,wKk{BkAACdAn@@\\?,}FogCkAAARGlAd@?f@@FmA,eIomCs@AW?At@jA@,yRykCB_Ay@AQAE|AlAB,lA{fCcB?S??RK??x@lB?@MFMC[HE,qKqmCiAAC??t@jA@,iIqgC?y@kAAAlAjA@"
            ],
            [
                "ID",
                2517987,
                21157,
                "Ada|Adams|Bannock|Bear Lake|Benewah|Bingham|Blaine|Boise|Bonner|Bonneville|Boundary|Butte|Camas|Canyon|Caribou|Cassia|Clark|Clearwater|Custer|Elmore|Franklin|Fremont|Gem|Gooding|Idaho|Jefferson|Jerome|Kootenai|Latah|Lemhi|Lewis|Lincoln|Madison|Minidoka|Nez Perce|Oneida|Owyhee|Payette|Power|Shoshone|Teton|Twin Falls|Valley|Washington",
                [58038,15491,17136,18118,1004,74940,11572,3212,3797,74787,4599,7525,5333,139467,23951,264897,11884,3102,22433,180088,35274,17675,16043,346237,25989,74255,269031,3692,4012,25991,4502,64302,8125,54709,9115,23256,190536,74969,31014,161,6471,253687,8486,29081],
                [-1,-1,372,8,-1,572,-1,0,344,303,63,-1,32,1206,49,-1,-1,20,696,29,165,79,102,24,730,139,115,268,-1,12,33,40,-1,83,586,34,71,13,0,14,158,823,0,26],
                "|dBszCc@Fe@x@VfBj@IPk@JA,jdBocDWg@u@JA^SH\\bCVF`@QAoAh@G,nsAaqCMKaBNTt@CNU?CbAHb@b@MFOT@G[NMK]NUCg@,jnAklCCe@s@NGI@Z]APnBhAKJo@Q],bbBgsDkBJPrAhAQX[E[,rtAkrCGe@Qa@QBYc@[BFj@aAJk@RBRe@DHx@jAM`BOLJLP^E,d}A{yCYG@Lc@XIIa@H_ArAO?Ap@i@F@Pw@HFd@b@ERhBb@O_@sBn@GfBSA[TEI_@T]Cq@h@Q,~bBs|COBEQyAPg@Ma@n@Bl@\\g@N`@d@Bf@h@l@Dd@y@QiA,`aB{wDg@kDc@FPjAkBTJ|@Hp@^WNb@XEEUnAM,pqAouCmCVc@FWBCPWLDf@H`AvAMIy@d@ECSj@S`AK,r_Bg~DoC^VhBjBUQkAb@G,vtAkzCs@HHx@m@FLjAXb@PCP`@v@IAQh@G@q@N?mAc@JSGi@Mc@,l}AkyCi@PBp@U\\H^UD@Zb@ElAO,bgBs{COVU@_@DVpB|@gB,~oA}pCkALwALRnB\\@A[FHr@OBd@j@GBcAT?BO,hzAioCK@c@Hi@Yc@Nc@NHv@JhAfD_@f@EQ}Aa@D,bsAazC[DCg@UQo@TUWgAX_@ED`@ZCPl@\\B@RRCrAOBRl@G,n`BumDSBMaAkEj@a@r@IRbDD^f@t@c@XYJG,f{Au_D[x@aAw@@\\Q@_@`Au@PKr@LALb@Fh@KRlAb@~@sA`@IHHb@YAMXFBCCm@`@o@M{@e@[QL,vdBsuCk@HWgBm@Eg@i@e@COa@]f@CBFNj@lCB~@F^`AMIc@jA_@DJ,dqA}kCc@LIc@k@FENP\\Kn@`BOOs@,foAcxCSBAS]CQm@[BEa@]YMIi@bAPlBx@BXB~@SXO,bdB{|CMBW}@WGXhAFAPhAb@G^EGe@UDIQM@,x~A}tCmANLjALh@\\GL[GQPO,fcByhDU[IEOJUg@c@PKKQ@Ne@u@b@_@g@cDEe@Dn@bBG`A^P@j@XRPKSr@PPbEk@^PRI@_@t@Ks@aAJg@,~qA_xCCSsAN@PYNFd@s@b@lCWZC,x|AarCeBd@Hr@JATBfAq@,daBkwDoALDTYDTdBjBK,lbBuqDYZiAPBRL`ARCTETNn@I,f{Au_Dc@qAQQRs@QJYSa@\\y@a@ST@|@a@`ABn@i@XEbAYPBf@ZEr@IJs@t@Q^aAPAA]`Av@,h`BolDYXOd@PAJJb@QTf@NKHDMgAs@F,j|AmtCc@DgBRLjAJPXEdBe@,nnAawC_ARYCH`Ab@Gr@c@,ryA{pCYDKQMkAo@F^rBh@Xb@I,ncB}lDCWo@HUOUDD\\KFDXr@GLfATZJa@,puA_mCw@HCQYBASM@OLFZUAGNGJNr@FAfCU,rgBizC}@fBK@Qj@g@n@EKkA^Hb@aAL`@fD|HcA@?,hfBk}CeANBPLAHPTEFd@TANWM]BM,rtAkrCHt@_@DMQc@NBf@OTJ\\LA@RXCBPv@IIw@b@OSiB,p|AmvDa@fAAp@LHq@n@g@pAjEk@CSQsAUeBOc@,tkAqvCy@CNhBVMBQVC,d_B}qCG_@QNFPMZ]FgAp@UCNT`@EP|AxBY,dbB}~C]cC_@QcEj@b@pAXLPMd@ZLz@f@LxAQDPNC,feB_bDi@F@nAa@PV|@LCdAOh@i@Gg@"
            ],
            [
                "IL",
                962040,
                5204135,
                "Adams|Alexander|Bond|Boone|Brown|Bureau|Calhoun|Carroll|Cass|Champaign|Christian|Clark|Clay|Clinton|Coles|Cook|Crawford|Cumberland|DeKalb|De Witt|Douglas|DuPage|Edgar|Edwards|Effingham|Fayette|Ford|Franklin|Fulton|Gallatin|Greene|Grundy|Hamilton|Hancock|Hardin|Henderson|Henry|Iroquois|Jackson|Jasper|Jefferson|Jersey|Jo Daviess|Johnson|Kane|Kankakee|Kendall|Knox|Lake|LaSalle|Lawrence|Lee|Livingston|Logan|McDonough|McHenry|McLean|Macon|Macoupin|Madison|Marion|Marshall|Mason|Massac|Menard|Mercer|Monroe|Montgomery|Morgan|Moultrie|Ogle|Peoria|Perry|Piatt|Pike|Pope|Pulaski|Putnam|Randolph|Richland|Rock Island|St. Clair|Saline|Sangamon|Schuyler|Scott|Shelby|Stark|Stephenson|Tazewell|Union|Vermilion|Wabash|Warren|Washington|Wayne|White|Whiteside|Will|Williamson|Winnebago|Woodford",
                [31426,1156,7752,4824,5288,7520,4785,22052,2826,5423,3809,2458,4313,44891,2209,-1,2031,7800,13480,3265,1994,16,5842,2755,27223,13867,4742,6964,22030,2472,9152,966,2810,20698,2176,14122,15392,14276,9455,10910,12125,5722,51203,11801,11478,1740,1465,24407,-1,11961,752,5849,10647,2307,10196,10285,16277,3036,24562,8160,8306,3450,4964,7243,2951,6209,6271,7189,7208,5107,33826,8874,6040,734,11718,7026,4171,-1,13893,5572,6764,10663,7411,6101,11027,2721,19194,3338,40482,7096,8382,4523,1279,16219,15156,9346,1795,20292,1117,10399,10269,6845],
                [181715,-1,2720,25729,33833,69875,-1,72327,70722,11760,60868,79930,97699,53013,16756,23,-1,89661,291168,85,412,11,-1,24276,147969,22959,51297,20929,70815,-1,-1,2717,35,183617,-1,27056,63284,97352,2993,157196,13771,-1,-1,49,-1,-1,56,102199,10,-1,63091,27512,193557,71002,89282,14918,141996,-1,91797,-1,31,151,-1,34,2819,323916,10151,161718,21489,4484,107055,12323,350,30,283635,-1,0,-1,-1,42301,35961,-1,41048,33885,52618,13515,37948,17349,115097,51691,329,9115,0,49041,133408,92239,-1,83395,15639,-1,-1,183119],
                "uV{vBcBCARAx@?RjA@Lg@,wb@ocBg@AAp@OFGP^GFAXo@DC,aa@aoBaAKC~@x@B,_c@wgCYAK?EjAd@B,{YkvBc@AOXOAHXAFx@@,w^aaCe@AkAEC|@ZB@NP?AR\\@?Sd@@,u[oqBE|@M`@M?NRRKLaAd@c@,c\\eeC_ACe@AEz@lAB@U@Q,_\\uuBY_@KLo@MCl@?DbBD,uf@oxB@YwAGItBxAD,}b@}tBK@C`@QAEbAR@`ABBe@@YQK?M,wi@csBiAEDp@DVt@?H@Bm@@U,gf@gnB@Qw@CAJQ?@p@GDlAB,{`@slBSA@Sy@CS?Cr@b@?z@Z,}f@atBuAOCl@F@ATlAF@O,wf@seCG?gAEm@~AEr@j@BDSN@@SREQIH{@r@D,_j@_qBu@?Wt@?J~@DD@,eg@aqB@a@mAGCl@z@DP?,ec@ieCe@CSAC`BARv@BBy@,ac@exB_BGVr@bAF,{f@auB?SyAE@h@tAN,wf@mdCs@EIz@PH@Id@B,ui@{uBcAGE|@AZhADBm@,ii@ulBa@AE|@FFX@,me@{pBw@EAHQ?Cx@v@BR@,cc@moB@i@Q?y@CCbASAAPjAD?RR?,of@yzBe@CHsASAKpB]AAPvAF,ad@}gBEe@iAECn@?HlAD,g\\wwBBmA@SmAC?RS??VDPj@x@h@@,mh@}gBi@EMHENR`@ENh@A,u[oqBC]o@AYACx@ZH?Jj@?BN,ie@s`Cy@EEx@?Rv@D,qf@iiB@]y@CClAv@B,wVgwBI]Em@_@Mm@ACnA?RbBB,mh@weBEAi@@MNb@LLJHA,qXozBA[U]?Y[AC`BR?l@@,{[a_C@]e@SAIu@CClA?RP?jAB,_h@s}BcBKE|@Ct@bAF\\@,ka@sfBMe@gACERCx@z@JD[,}g@}nBBy@{@EIAGhAt@BP?,cd@wiBBy@kAECn@A\\hAD,g^wpBCz@T??P\\EL?La@COk@??K,iZggCc@AqACCbA~@B\\g@,ce@scBB{@y@CCx@`@@BFRB,_e@oeCw@C?d@Cx@v@D,ig@k~B?Se@C@SoAGA\\C`@bBJR@,ce@mbCw@EGx@x@DBe@,}[g}B?SkACAf@Cx@lAB,wf@_hCaAE@j@O^fAD,mc@uaCw@CCd@GlAx@BCf@R@@g@R@Bm@B}@?I,mj@wnB_AEGTTj@l@B,w_@icCqBECx@b@@?HjAD,qe@e~Bw@EAXIrAd@BR@B_@v@DBg@Bg@,u`@ixBw@E?HS?Cr@AZJ@|@ID_@,uYczBS?y@AClAlAB,gf@_hCO?GjAF?v@BR@DkA,gb@kzBe@IG[I?w@EC^SACn@AXR@~AFR??I,{b@suBKA@[cAGCz@HJARd@@P@Ba@JA,c^qrBe@Ae@AGrBjADB{@,k^{nBkAEI?Kv@ARR@pABDMGKGG\\W?Q,_d@ykBBs@?SkAEAp@A\\jAD,a`@a~B]AUABH_@ASAAf@dADCK^@,y\\uvBWOk@y@a@AAXSAAj@DEv@DBFn@L,we@ocBCGa@Ai@b@ATnA],u^uvBCGw@EEDE^R@?LHBd@@,qX}~BiBCAd@?Rv@@Z@\\e@,q]qjBK]i@j@WBALV@?RZJFGTW,o`@urB[ACd@aACA\\P?Ah@`AJH?,w[stB@GcBEOlAd@@X@@YJE?Qf@E,me@}tBm@CA^Cl@P?JOJ@@MN@?O@S,i_@keCo@CkADCx@pBDFE,o^}zBBy@y@C_@ABJJf@Nj@`@J?WR?,ua@siBmACCRDd@fAB,ie@yvBWs@SAExA?Rl@B,qW{sBkAA?Sy@ABJDPKf@B\\t@@j@i@TS,yf@seBs@CAf@L\\Q\\HP?@@Uh@c@,_d@qcBc@A?FSCAPTHPZNG,mb@k_CCl@^@CIT@@SQ?AO,m^ohB[K?SWAa@AQ?Cx@Ld@\\ULDBS,qh@qnBu@CEAC~@D?`@@PCFE,_Z{_CcA_@Ea@KKKj@@Hd@RA\\hBBES,_^qkBIS?IqACCt@Ch@`@@@MVCh@k@,yf@seBB{@?Iw@CEbAD@,y^guBe@AIC?MSA}@HAT`@P?LPJAXZ@d@@NmA,yY_wB?SmAC?Ri@AVNX^N@NYb@@,s[gtBg@D?PKDAXn@@Jg@,qc@uqBSADcAe@A?NOAALKAKNQ?ANA`@v@Dx@B,i^_~BQ??Se@A?RCd@x@B,_^mgCMAgACCbAn@Bd@@,c_@qyBa@KOk@e@AAZIBEz@v@DR@@Y`@@,ob@aeB?A{@KS?Cz@b@@f@@GO,ki@qyB@QcAG?BEhAEx@bAF,ij@qjBGGD}@E?m@CL`@JXVP,eZe}Bw@AClAARx@@,_a@}jB{@[c@??FCx@lABP?,kf@wkB@]mACQBEdAd@Bx@B,ih@kjBe@CYACB?@INN\\@b@LIh@D,u\\ibCKa@mACGDEdAd@@t@B,{f@sbCe@CAHSDAROAERk@CAd@nAFARd@BDy@,gd@igBmAECz@x@BR?,u`@sgCC?eACElAjAE,aa@q|BeAESACf@H?FZd@HHC@[d@@"
            ],
            [
                "IN",
                770048,
                4372121,
                "Adams|Allen|Bartholomew|Benton|Blackford|Boone|Brown|Carroll|Cass|Clark|Clay|Clinton|Crawford|Daviess|Dearborn|Decatur|DeKalb|Delaware|Dubois|Elkhart|Fayette|Floyd|Fountain|Franklin|Fulton|Gibson|Grant|Greene|Hamilton|Hancock|Harrison|Hendricks|Henry|Howard|Huntington|Jackson|Jasper|Jay|Jefferson|Jennings|Johnson|Knox|Kosciusko|LaGrange|Lake|LaPorte|Lawrence|Madison|Marion|Marshall|Martin|Miami|Monroe|Montgomery|Morgan|Newton|Noble|Ohio|Orange|Owen|Parke|Perry|Pike|Porter|Posey|Pulaski|Putnam|Randolph|Ripley|Rush|St. Joseph|Scott|Shelby|Spencer|Starke|Steuben|Sullivan|Switzerland|Tippecanoe|Tipton|Union|Vanderburgh|Vermillion|Vigo|Wabash|Warren|Warrick|Washington|Wayne|Wells|White|Whitley",
                [24950,16490,2375,15694,1641,2144,714,12355,12117,5976,2490,1595,4342,7532,4223,16294,16035,2709,20220,47166,2004,1424,3336,9582,14204,7511,2008,10406,-1,2926,16417,1972,10051,1478,11839,8176,55021,16934,6297,4537,2460,3782,21426,49325,1230,9463,15296,2837,287,23878,3691,5698,5036,4123,3947,-1,13404,1605,8564,4550,8372,8407,-1,2043,1464,4506,5555,7718,8289,4912,4513,2004,3110,10641,-1,6882,2591,3839,3486,366,1612,-1,1991,1844,6884,9510,4429,16215,8626,6660,7466,5223],
                [174820,41592,57105,-1,27020,18077,18,266861,46400,34,329,105594,16245,28021,-1,172409,738,12092,35280,62450,128,64,-1,14062,31756,28460,25960,-1,655,94447,114,21905,26124,-1,68712,43795,176774,251476,672,8435,1105,41471,116917,40949,163,6129,69,1221,0,7270,54922,228750,449,-1,13643,55694,45182,-1,-1,208,309,17783,6868,383,6560,94403,77598,160087,24464,73280,34974,-1,-1,12113,-1,8443,851,-1,59526,68458,10084,535,-1,85,173352,-1,-1,13480,19165,256846,291881,106929],
                "}w@s~Bk@EEh@Cb@j@D,mv@}`CSA_AG?BEx@ANj@Dj@B@Q,ys@csBUAm@EEp@R@ALn@F,mk@kzBBu@i@C[AEd@ARhAD,gv@_|Bi@C?h@b@B,_p@qxBkAGEv@L@|@D,gr@}rBUA[CG`Af@BH@,gp@o|BIFWACZA\\t@B@[J??e@,cp@w}BQAq@CGjA`@BB[V@HG,uu@wmBGKe@CW@ALHLNBDPDRPDCQHI^?@OQE,wm@{qB?oA_@AA\\KAA\\P@Cd@^@,_p@yxBDq@u@CKAKJCb@?FjAF,iq@elB_AE?EG?B|@PNF[R@?KP@,wn@ooB_@CExAX?\\CD{@,ey@{pBAqAi@CEj@JLCBRHNN,}u@ksBI?@Ww@ECh@TPRNRB,yv@ybC_AGAVE`@~@F,uu@szBWAc@CANGr@|@D,co@ylBY?g@GCZC\\RD?Hd@BHE,er@}cCk@CUAEr@AP`AF@I,sw@svBMAGNYCCh@j@D,wt@ulBG?_@?IHBPNTH?@OLM,il@{wBDGu@q@A`@Ex@t@D,{w@ytBk@Ee@ACn@h@Bd@LBi@,op@s_C_AECPUF?Hb@BARp@B,mj@mjBWQKYm@]M`@MAC\\?HX@AFf@BRK\\@,_t@i|Be@C_@CAPEh@V@l@D@EBc@,ym@iqB_@A}@ECf@ARd@@^BX@,kr@ayB_AGE|@JBr@DDw@,et@gwBKCo@E?b@D?ARt@D,ms@sjBC}@e@CCRMLANI?Dd@DDDD^G,ep@yvB}@EE~@t@LJy@,av@qwBB]}@ECNAn@L@p@D,mq@m{Ba@Cq@ECb@|@F?DJKJ@,{t@{~Bs@EAPEz@P@^B,yr@}pBg@Co@GEx@LPb@G\\FLq@,il@q_CGEMIa@FALEx@H?ANR@AVZ@,qw@yzB?i@UAk@EEn@?HdAF,kv@soBUWOAg@EEn@JGH@RFEZVA@ORK,cv@yqBSCSOE~@N@TVRBDy@@M,wr@_uBq@GE`AT@ZB,_l@{lBUk@FU?Ko@CYAVTEz@FF\\Al@\\,or@y_C@{@aAGC^Av@j@DTG,gt@cdC{@GOAEr@jAH,{j@eaCDs@[LWAGtAFDPLV@@],wm@ecCOKq@CGfAR@LZ\\T,}p@uoB@S}@EMp@BP~@D,kt@iyBBc@m@EGbAC\\n@D,cr@_wBMAs@EAr@AJp@FL?,kr@_bCAHAz@~@DDy@?I,wo@soBe@AEn@Ab@f@F,is@u~BIjAK?APp@DFkA@S,}p@yrBi@CG`AIA?L|@DBg@Be@,{m@sxBcAE?FEv@ALt@BL@@S,sp@qtBu@MM?E~@T@h@B@UHC,_k@a_CWAQMIjBh@BD}@,mt@obCkAIGx@R@x@?B_@,ey@wpB?CE@OOSIGLBJl@F,cq@enB_AEEx@?D~@DB[,eo@qsBk@AIBATH@Cd@|@DBe@QA,kl@svBu@EARMAEx@^@^B?y@,{p@iiBEAFk@?ISEQA?JSAGZHH?^THLC,_m@wlB]@GG]BE~@h@?B]L@,il@mbCm@WIjB`@GLH,ej@ygBAc@O]HO]ASJA~@d@?EPTD,cn@k_CkAGEx@P@x@D,wn@mtBDy@u@CKx@@\\j@@J@,sw@izBeAGGbA`AFBO,kw@mrBUQe@M@pA?BJBf@D,av@mvBq@EGx@ANv@DFu@@S,yo@ucCo@E[AE|@`AF?HF?,iu@}nBMQSCANSJANd@BFJFC,it@guB@Ku@EGt@AVH?l@D,so@sjBe@CGj@D@ZPPd@\\U[w@IA,an@y_C]UM[SAG?Ex@jAF,sv@mdC{@EELCb@~@F,{k@wqB{@CAPCz@n@BVu@,yx@spBKC?Dm@GMD?B@N`@JRNH?,um@a{Bu@EK?AZEp@bAD@a@@W,et@szBADCb@~@FBc@?E,cy@ivBc@EC`@AJd@@,_l@ajBg@CEr@NBJPNE,yk@cvBDy@U@Af@KP?x@V@,al@isB@[WA_@C?nAz@B,is@__Ck@EEHIlAd@BJ?HkA,mk@gzBiAEAVt@p@EFTA,gm@ejB@GYA?Ii@?IDAPH@Zv@FCXE,gs@}nB]Gc@FC`@GBDJPDANF?d@BF?Dy@,_x@exBaAGARCh@b@DXBFO,ev@q|BQAD{@k@CIlAT@h@B,in@q}By@ECf@Z@?d@t@DDe@@WSA@O,st@}`Cy@?Az@r@DDI"
            ],
            [
                "KS",
                6126402,
                1907011,
                "Allen|Anderson|Atchison|Barber|Barton|Bourbon|Brown|Butler|Chase|Chautauqua|Cherokee|Cheyenne|Clark|Clay|Cloud|Coffey|Comanche|Cowley|Crawford|Decatur|Dickinson|Doniphan|Douglas|Edwards|Elk|Ellis|Ellsworth|Finney|Ford|Franklin|Geary|Gove|Graham|Grant|Gray|Greeley|Greenwood|Hamilton|Harper|Harvey|Haskell|Hodgeman|Jackson|Jefferson|Jewell|Johnson|Kearny|Kingman|Kiowa|Labette|Lane|Leavenworth|Lincoln|Linn|Logan|Lyon|McPherson|Marion|Marshall|Meade|Miami|Mitchell|Montgomery|Morris|Morton|Nemaha|Neosho|Ness|Norton|Osage|Osborne|Ottawa|Pawnee|Phillips|Pottawatomie|Pratt|Rawlins|Reno|Republic|Rice|Riley|Rooks|Rush|Russell|Saline|Scott|Sedgwick|Seward|Shawnee|Sheridan|Sherman|Smith|Stafford|Stanton|Stevens|Sumner|Thomas|Trego|Wabaunsee|Wallace|Washington|Wichita|Wilson|Woodson|Wyandotte",
                [27330,26898,18789,58448,103062,59357,22791,135567,65729,33647,24075,39080,68503,32710,20314,26008,40484,52769,47372,69146,51739,5517,17881,61957,42093,30180,25878,273767,177981,46674,13409,80312,17724,241105,288654,34843,99913,149477,51026,37693,413827,70268,49810,27709,30866,5526,72392,33822,23806,76391,88095,16912,36512,25715,29324,64027,52445,60033,41689,68990,34069,38105,32521,60981,12609,88229,42704,22950,41350,29631,25371,36502,70093,39639,66020,53279,21396,79572,47182,62271,23641,40100,22040,27266,18085,310251,33497,96950,10377,87557,22498,42326,41320,20786,46442,19293,51580,18686,38464,20614,76079,96894,23679,24908,534],
                [69,74,1897,0,10627,1789,10427,18568,0,1020,62,246,-1,55106,-1,16,-1,240,123,0,165,182,50,-1,-1,1026,0,456,-1,11480,13621,-1,95,-1,-1,-1,-1,-1,19,16480,32,0,2645,121,1056,173,-1,100,20,571,1435,1088,0,86,-1,33,36626,33285,7728,-1,661,-1,-1,0,-1,323333,650,-1,-1,56,-1,132,-1,28700,5357,7293,0,5064,0,-1,-1,25,-1,260,36,-1,259,0,264,0,31,-1,-1,-1,-1,52,284,0,-1,-1,107440,-1,195,36,-1],
                "sAegBkA??bAlA?,uAuiBkA?@nAjA?,iAorBe@?q@FFPUVb@@`A?,nOocB_BB?PS@@tA`@AnAA?uA,hOalB}A@?f@@x@hAAT?AS,_DaeB?cAoAAApApA?,c@}tBkA??lAd@?d@?,fEkfB?e@u@?w@?@jB?\\lBA,lCsjBoA@?lA?PZ?v@?,zAabBaB@?`AD?zA?,aDibBoAAA~@?JdA@H?,~^_vBkBFD~AjBE?A,nUwcBaBD?R@rApAALA,hFcpB?y@eA??lA?RdAA,fIsrB_B@@R?x@~AAAy@,GchB?y@mAA?H@nAjA?,lR}bB}A@?tApAALA,hEicBmB@?d@?bAf@?dA?,_DudBqA??B?`A?BnA@@I,`XquB{ABC?D`BzAE@?,jFumBAg@eA@@d@GCCVDx@jA?,oB}tBE?e@\\MGSPCNRDJVp@G,uA_mB?i@u@@?PUC?t@jA?,lRufBAe@e@??Rw@@?f@?R~AC,zAedBaB@?n@?R`BA?e@,fRgoB}ABA?B`B|AC@?,jLemB_B@?x@?R~AA?g@,rZoiBgABkABC?Bx@jAC?z@jAC,~UyfBqBB?f@?z@`BEP?,uA_jB?cAkA??lAjA?,bD{nB?SQ??\\{@H?f@bAABWFB,vXooBO?}ABC@D~AN?jACTA,bUkrByABC?B~AzAABA,b]}eBkABBlAjAC,~UmgB?R@`BjACAy@?{@,p_@{lBsADD`BrAE?AEkA,xAqgB[??QeA??\\@bA?\\`BA,v_@yiBsADC?BtBxAE,zKwbB_B?@vAt@Ah@?,fHghBy@@e@??R?d@~A?,vZyeBkAB@x@@RfACB?,zUgiBmBBAf@@d@pBC?S,D{qBi@??Se@??r@Bl@jA?,eAmoBCm@aA??rAt@ANA,fLcuBg@?y@@@lA?R~AA@?,aDymBYACOm@@Aj@?XlA?,~\\siBgABC?BtBjAC,nLkcBA{@qBB?x@?P~A?RA,lRmeB_BB@x@?R|AA?S,sAsbBkA?AHAjAz@?R?,fXmlBkABB`BjAC,kCgnB?sAc@AMFBLSZP??n@X@TB,hLsoB_B@@x@?R~AAA{@,aDuiBmA??hA?BnA@,h\\woBM@cBDD~At@Az@C,|@qjBAq@eA?@dA?x@dA?,jIikB_B@@`Bx@Ad@?AmA,jFgkBkA??RQ?B`Bt@??Sd@?,fC}tBy@?e@??`Bx@Af@?,lX{cBkABQ??hB~AC?uA,aDclBmA??x@?RlA?,fLarB_B@@x@?R~AA,EsbBmA??tAl@?^??aA,~CgkBEy@cA@YZ@p@nAAP?,b`@ucBuABDvApAC@?,f@}tBe@?e@??lA?Rh@?`@?,qAaeBmA??J?`AjA?,zUilBO?_BBA?@lA@RlBCB?,`UmuB{ABB`BxACB?,IclB?[kA??Z?bAlA@,dOerB{ABA?@lA?P|AA@?,hIepB_B@?d@@f@~AAAy@,jRwiB_BB@RU?@x@R?v@A?Sd@?@g@,dRiuBkA@S@B~AzAAB?,`B}qBy@@a@??lA?RFOr@D\\AZq@,lO}eB}A@AR@z@~ACAy@,r[wuBO?}ADC?B~AnBEB?,lLihB_B@e@??z@?f@R?pBC@S,dIauBQ?kA@?lA~AA,jLwjB_B@@lA~AA?S,bD}qBY?g@?Xd@[p@]@@ZP?z@I?]P?,dRgrB{A@C?B`B|AC@?,hRelB}ABA?@lA~AC,fOcoB}A@@z@?d@|AA@?,jIwmB_B@?lA~AA?y@,rZqlBu@@U@B`BfACB?,zHceBS??g@_B?@`BpB?,vZkcBgAB?tAv@AR?,DmoBkA??`@O@?h@jA??s@NE,bXqrB{ADC?D~A|AC,d_@}rBkBDC?D`BLA`BC,dOeuBw@?e@@@`BzACB?,lOegBS?Ay@iA@?R@lA|AA,|_@cfByADBlADAtACCy@,l]qcBE@kABC?BvAvAE,zHicBqB??jBv@Az@?AwA,t[wrBoBDA?B`BN?bBE,dUioB{A@A?B`B~AC,tA_mB?g@Q?A[s@EGNOD?r@?ZdA?,j_@{oBaBBD`BL?rAEEmA,fF_uBkA?S@@~AX?dA?AS,|\\ulBM?{@BB`BfACB?,EcdB?]kA?AlAlA?,GegBkA?@bAjA?,mEkoBIDIAMDA?BVl@ABN?o@"
            ],
            [
                "KY",
                1876383,
                454797,
                "Adair|Allen|Anderson|Ballard|Barren|Bath|Bell|Boone|Bourbon|Boyd|Boyle|Bracken|Breathitt|Breckinridge|Bullitt|Butler|Caldwell|Calloway|Campbell|Carlisle|Carroll|Carter|Casey|Christian|Clark|Clay|Clinton|Crittenden|Cumberland|Daviess|Edmonson|Elliott|Estill|Fayette|Fleming|Floyd|Franklin|Fulton|Gallatin|Garrard|Grant|Graves|Grayson|Green|Greenup|Hancock|Hardin|Harlan|Harrison|Hart|Henderson|Henry|Hickman|Hopkins|Jackson|Jefferson|Jessamine|Johnson|Kenton|Knott|Knox|Larue|Laurel|Lawrence|Lee|Leslie|Letcher|Lewis|Lincoln|Livingston|Logan|Lyon|McCracken|McCreary|McLean|Madison|Magoffin|Marion|Marshall|Martin|Mason|Meade|Menifee|Mercer|Metcalfe|Monroe|Montgomery|Morgan|Muhlenberg|Nelson|Nicholas|Ohio|Oldham|Owen|Owsley|Pendleton|Perry|Pike|Powell|Pulaski|Robertson|Rockcastle|Rowan|Russell|Scott|Shelby|Simpson|Spencer|Taylor|Todd|Trigg|Trimble|Union|Warren|Washington|Wayne|Webster|Whitley|Wolfe|Woodford",
                [40826,41027,11143,3710,80293,26239,701,8553,43023,1640,29459,12429,1026,29946,3436,15919,9865,7560,4811,1699,4459,7101,39365,21466,37837,1911,18353,9923,8628,13254,16832,3929,4794,12340,39548,288,11513,483,4389,33920,11955,15109,43200,25891,5858,5568,26532,117,29986,28383,5309,22766,991,9414,9685,1331,13587,1240,4325,859,3356,13517,18470,3036,950,82,149,9373,45445,13864,31027,3580,1919,2467,3837,55758,1972,43324,14523,233,25207,12982,3053,37607,30530,50615,19175,6436,12461,34082,17063,12230,3953,21438,1353,9285,138,2764,2434,63502,3540,15551,3042,30427,24723,25269,9122,8311,17631,19568,15654,6166,5995,41066,39818,20007,6639,7975,2527,14418],
                [584,3481,113,75,108,128,-1,74,83,23,9,356,42,1125,107,52,79,-1,32,-1,-1,161,346,314,114,-1,-1,43,46,-1,54,36,70,-1,137,0,102,-1,-1,52,128,29824,173,107,82,51,24176,0,279,67,5,395,23800,-1,62,24,29,27,65,0,18,158,673,31,24,-1,29,287,181,641,-1,0,84,18,732,173,-1,-1,-1,-1,190,248,11,86,106,-1,23,40,50011,441,47,53,181,34,29,91,4,22,22,280,31,21,326,44,105,159,-1,95,62,24564,724,24,354,24324,73,101,99,209,21,24],
                "ox@{cB[U]]SHCNX|@d@@,}s@_aBe@g@KLEGARQPARf@@b@@,az@qjBKUUBEEO^VDNNNCBDBO,ye@}bBWx@l@JBEDGFQQ[,iu@ecBG@?Yu@EBDM`Af@^PQ@SDFJM,_`AklBSYSASR_@RDFJ??HLANHX[NC,{aA_bBo@}@BCM@CFKr@b@Pj@HDM,wz@erBIIWJG|@DDXO?CLECKFMBC,m}@ulBQCUUSVUJNP`@NNGAOHC,wfAooBONEf@DC\\F?YFA,yz@ygB?Im@MQN\\V`@B,c_AkpBWAHf@N?JJF@?EHu@,ybA{gBE_@CBKQ]@UHEE[XVA@ZPGXZJGNJ?Q,{q@ohBUI?_@_An@Nn@TFRIJLHSH[,gx@}jBJXCBJVXRd@e@c@W,}p@ycBK[IDWWYLO`@f@?Bh@n@IGE,{k@odB@DDDIPWRD^VJ`@m@H?AI,oh@y_BaACGLEf@jAD,m}@}qBS^\\PDABe@LWICIL,_e@}`BCDm@K?@Cf@z@?,_y@coBI?SOQPTPNBF@V_@IA,icAwmBQEBSIQe@RY?G@?XRRT?VOHPHA,wz@gfBA]a@CAXWJCZZ\\HBPOBORI,ul@}bB]D]MOPD~Ar@DH@?iALG,m~@ikBa@OYf@HLEDJD@E^A@IJF,_aA{eBYYUCYPCDBb@K\\LAr@OTW,cz@s`BIs@DGUJIGUr@t@B,kj@geBGIOJANMCGHl@d@@HNHD[Z[MK,ay@ubBe@ADDKHHr@VBJMCIVQBKGB,gn@khBGB]TQe@?FO?O^ALb@ZbASUWFG,es@ydBu@GUV?J?XFAPGJDTO,}cAklBIKHEIQWNU?GJRX\\BLG,w_A}iBADKESNUAIFNLHZJETDFOEG@]FA,q|@mkBc@WIB@NOFBf@NJHS^I,_`AonBMDa@SMRWFDXRRRSR@?ILCJO,afAyiB]MUDMDFBIj@Nj@J]LB?KNAEK,mz@wlBMIEBUAG`@TRDDTCEo@,}c@q~AQHGQq@JKNxAD`@BDGCIW@CM,}y@soBa@KAOYNTBAHVN,k|@giBIB?CONGIc@l@@NLAf@[POIC,{{@_pBEEM?Qt@LJ@Dd@[BW@I,uf@y_BBg@y@ACh@Cv@D?r@B,kr@mfBKMSHUG[BOVEJVNt@FXMJa@,qw@}eBAKI?m@v@ZTP?JK,sdAupBUKSd@YJT^X?d@S,_p@whB[QQTMBBPIZ`@MN_@N?,qt@ihBYE@g@EECBe@d@KN\\l@?VX?NWZC,ycAwcBM?c@a@K@BJc@QKD?P^LFXt@X,a}@onBk@M?DGA@LODLTTTPBXm@,mu@}eBY?i@??t@HBt@D?KTWWO,al@ahBODKQOCYD?PGFTVLFf@DFYH?T[,qx@smBWWOCQPCNGEITDCLHp@@LU,yd@y_B{@?Cz@@?@?JOp@KDO,yk@idBiAw@Od@JZIX\\L\\EVSHQ,}_A}gBUEKDCDU`@XX`@IPk@,ou@}iBEe@OUQEES_@PI@?Z?Dn@Jb@V,k|@siBC_@_@HIRD?CHHHFHNO?BHC,qeAokBCI_ARHDI\\TE\\LN]EI,k|@krBMVCd@E@RDL?F}@,keAogBA[W@E@O@?JMCK\\@BN@VXBEVE,o`AwcBUEMSs@NCBn@|@d@_@,ew@chBOF@`@QCKPR@H?@Jh@??W,__AqcBGk@CSQSa@H@PUVLRTDb@F,ieAykBSYFKSS]GEBBV_@f@P?@P~@SBH,_aA}gBI[OMA?c@JD^JG^PHE,mcAafBOUORUFG`@b@`@L?BGJ],weAwdBICBWIQCDWYOA]JVT@RRLJEb@P,mcAyoBe@[Pp@HPCRPDLMDBVGLSBYQO,{{@igB]Wg@ZBb@HCX\\B[VK,oh@odBI@[ZEZDb@POVJ@KIQP],ep@ubBSAo@HMVFBLr@r@D,{i@ubBOII?a@l@n@XPY,ye@}bBoA\\?AAJ?Px@@?A,{}@wbBc@YK@D\\[l@D@zAF]o@,km@qfBMGcARNRGL`@FNe@RC,y}@uiBOKKGAH_@@DFG@A\\DFGNPJXAb@m@IIBI,qeAwjBO\\Od@DJDAZYDDTIBIBKYYBE,ex@}fBOi@KNw@A?R@\\HGRHPITB,kh@caB?QWKQNQXIX`AB,ugAekBAQQ?QRORNHCFZ@LEH],q_AeoBIg@e@VIACX`@RLE,{r@cjBQOUX_@FEEAf@XD~@o@,kaAekBOIM@?IK?GDCCBf@HHL@XQ,qz@siBOOWEBJKLIC?JEPHBl@L,gw@cdBICKJQ?Qd@PRFCCJXALaA,iv@{`Bg@_@Y@WPBHKL|@D`@@,_`AklBADOBYZ?PFBXAXg@,acAukB[U?LMF]CGHELDHTECDXXCJj@[,sn@{dBa@GBPIGa@^CZFDR@`@F@ENQHY,yv@shBYSKWQFg@ICNFJHCT`@Nh@PBAa@NG,c_AenBQDCCKNMB?HRXTKRW,uo@ceBFMOSc@[@Ma@LIRJBK`@VVHEJZ`@_@HF,}w@wmBSBBFMTDJVF^QEQOC,yy@onBUQWOCVe@ZX\\T@HUFDBO,caAwgBID_@QKFIP?PENXQTB,o|@epBSE]QAHIt@j@L,ccAwfBOKKFY[QFCb@WDHPCVHBJAFa@TGNSNTBE,ugA_gBOk@Hk@GC[ABGOIq@d@QAr@~@f@X@@\\K,i`AqjBY@GCYPHX@?HGT@RODE,}{@idB[]Y]IBi@b@Fj@b@XRWNFJGLI,u~@ynBKKO?MTDJBBPENE,a~@egBM@AOY@Qj@PRBRh@c@,ubAanBECMLIVI@IDHJZTBBFEEG^SSS,gz@wbBY}@QNIC?NMHb@b@HFTKEFJI,w{@_mBY]AEYl@GNb@VBKLC,}w@alBWGEKq@AE?Dn@JTx@Q?[,wr@uaBEJ_@@?FAZXBb@@Ms@,gx@}jB?Ey@PFNf@HPGBC,}w@ifBSAUCQHSIIFLV\\\\,ao@sbBADa@GG|AH?f@B,gj@w`Bo@YWKMF?hAbACFM,ix@ioBW^GAVVRC@MD[,kj@igBUEDQUZI?GX^d@NKFHLODO,us@wcBUNKEQFD\\d@f@?G^ADKLWCi@,ux@ghBUa@IBGKCEOBGn@?Hv@@,g{@kbBc@c@KFOGSVAL\\n@`@@,ck@eeB_@e@g@ECJSBhAv@AEFILB,k_AocBc@GEVe@^JHELH?h@BZm@,ebAajBMAIIk@ZCH\\AJPBCb@K,_|@}kBMBCJ@XB^HBJMCKN_@"
            ],
            [
                "LA",
                730491,
                5124,
                "Acadia|Allen|Ascension|Assumption|Avoyelles|Beauregard|Bienville|Bossier|Caddo|Calcasieu|Caldwell|Cameron|Catahoula|Claiborne|Concordia|De Soto|East Baton Rouge|East Carroll|East Feliciana|Evangeline|Franklin|Grant|Iberia|Iberville|Jackson|Jefferson|Jefferson Davis|Lafayette|Lafourche|LaSalle|Lincoln|Livingston|Madison|Morehouse|Natchitoches|Orleans|Ouachita|Plaquemines|Pointe Coupee|Rapides|Red River|Richland|Sabine|St. Bernard|St. Charles|St. Helena|St. James|St. John the Baptist|St. Landry|St. Martin|St. Mary|St. Tammany|Tangipahoa|Tensas|Terrebonne|Union|Vermilion|Vernon|Washington|Webster|West Baton Rouge|West Carroll|West Feliciana|Winn",
                [10726,7747,6029,391,27646,28414,2452,18540,30477,38788,4808,15735,4805,10721,2113,34199,14160,142,29173,15579,20435,5942,4833,6377,3138,111,18690,7442,15445,2975,14006,4298,2595,8550,25893,0,5027,1887,14175,17708,22920,15722,18378,1701,2398,9667,915,28,28452,3141,2632,8730,26389,322,1403,21205,23326,8163,25934,5400,1483,5156,10505,4349],
                [56,228,100,10,360,224,0,222,108,211,106,0,-1,-1,104,111,166,0,47,157,-1,94,-1,0,23,0,91,32,69,145,103,132,-1,10,9,0,196,195,64,37,0,-1,40,3,-1,-1,0,0,281,83,0,157,57,0,30,36,63,223,352,37,-1,-1,16,99],
                "eSyr@Y?o@ASf@X`@XVVMLD,_Qmu@]Ei@A@zA~AN?e@[?,{\\cr@WEg@b@KI@Jr@LFHZB,w[_p@UG[COb@Rj@LRBO?WPGN[,cUgv@M@FoA[CM?ETIOQD]ND^DDHf@jA@,qMku@mBAA|@Z??d@?Dn@??QR??Rn@?,kNa`Ai@KF[w@AA\\Q?BbAV?l@@DSf@@,uKgdAA?s@?M^CdBM?Hf@F?v@aA,kJ}aA?i@?]i@AKjBw@`AX?\\Wp@`@@i@,qLar@o@??SS??Po@?SBGp@SAANT@?HfC?@i@,sTm~@?[s@AIVO@ELJDIRBHP?x@B,}Kkn@[g@gC?q@AW?C`BlBc@~BTPY,oV_}@Q?CI]PWSEREZZD@RTJQ`@TKOVJ@AVPEHNDU,_OidAo@Ao@?Av@R@Fd@v@@,gY{{@_@@@RLDENLJCl@XLKFE^JHPGE_@\\O@WKANWUJPa@UKAS,oJo~@q@a@]Vq@`ANRpA@\\[,a[it@GKmAGJNJN?ZSVVDV@PEEa@N?EELK,qYuaAGEUyAQ?QLNZSPDHGVLHz@@,u[wv@UAk@A?|@lAFFJ@?,eSyr@A{AQ?UWSDMXC|@t@T,aWq~@UUAQUQ]AARNNMH@z@HJDSVR\\QHSKE,{Pg{@aAA?So@ACd@MZOBpATJ?DY,}Vsl@KK?{AAGYDOQYPk@G[DDJh@DZBx@~@M?]RHP,wXcs@g@Ac@d@_@AWALz@TFZERI@Y\\O,yQm`AcAKUn@?Z|AB,oa@gq@SGGD?v@MGIHJZg@fB`@\\O]D[VIHQCYLAIYVa@,ePir@_BOCvATJp@@?IUA@OR@Fq@RC,cVsq@QSKBIZFJODFP@FREDKd@C,y]go@SEWDY?c@f@W?M@BXIPWHEZN\\z@Z?cAvAuAb@N,mT_|@G[y@CCdCL?T_@NCL[,eQkaAGe@SA[@KNQ?AR?RbAJP?,k]mt@aAASpAJPLCJHf@c@RW?[,mYm`AA]{@AMIA?GJH@ANQ@BPK?BLDNT@DG`ALLIOO,yUodAoBCE?V`@Hh@RX\\L@c@ZK,aNc|@OSUD?OU?Le@m@AMj@Nt@o@h@n@d@n@A@e@P?@e@R?,kb@iq@g@Iy@Fj@^^NQDAHPCHILF,}Sy`A?Sa@C]][JAb@Rr@r@@,cc@oo@QBINiA^RDOd@aANQXQ?Rp@TKXZE]X]^Mr@@f@gB,gXwv@K?IB@^S?JMQFJ\\g@CITL^LBf@@J?Ck@P_@,kR}y@EXK?qAUU^ZBGnALARETVP?h@@BoA\\S,_My~@Y?G?g@AERMd@T??NTE,{V_aA]MSYE?AR[A@H@\\\\@TP@PTTNAHW,oKa|@qAA?\\S?Ad@Q?Ad@\\@\\f@F?XeARQCY,ad@kp@@Li@NYg@y@[HvAXAARPJhA_@HO@IPE,oa@gq@@j@W`@HXV?b@g@B[,w]}t@?}@q@AClA`A@,i]kp@GIs@MFZG^VERD,e_@cq@AKMBKQ_@G_@JAHRFr@b@CZX?F_@,qUmu@kAAQ^Bj@OTv@?@HJCPRRg@n@@u@U,gZmo@i@EOZQF?Vv@OAK kXcs@K?Oh@]NAXSHj@FXQNPXEGQNEGKH[AIw@?,gZmo@UX@Jw@NCNb@TKXFJjAw@DYd@RL?y@_A,ia@au@qABYl@Ur@ODLHx@Gf@HFE@IPY,i_@}v@C?e@CU~@ElAQX^K^FRqA,aYw|@IKA{@aAMEFMTb@v@RDERHB^A,w[kk@GKJYc@UMSc@OwAtA?bAxADNW`AMJK,_RkdAyBCC~@\\\\`@B@SP?JOZA,iSap@MEWLYWe@BEJSD?zAJJt@Jv@KBaBV?,oMow@]g@]Ao@@]RCnA\\DlB@,s`@aw@O?oAEU?LhApAC,kMgdAE?m@AM~AGZh@JL?BeB,{Zit@C?A?@LMJDDO?D`@QD^@b@e@MC,mXgbAIi@Wa@_@ATxAFDZ@@S,}Xsv@wACTlAB?HUf@BK]PGKLR? mX}v@QF@@HCJ?,}Pi~@W?}ACAp@FZn@@?R`A@Ou@"
            ],
            [
                "MA",
                33093,
                7271,
                "Barnstable|Berkshire|Bristol|Dukes|Essex|Franklin|Hampden|Hampshire|Middlesex|Nantucket|Norfolk|Plymouth|Suffolk|Worcester",
                [55,6700,4149,122,1835,4788,1490,3919,2513,0,398,773,42,6309],
                [328,199,998,27,28,573,152,1646,171,0,921,573,0,1655],
                "e`CoqCOs@o@Fc@WVm@ZCOK[L_@lAFTD[~A~@JC,oqBetCAw@q@IEf@Cf@H?MLE|@dAL,e|BcsCi@c@]l@BROG]b@j@b@Ja@LCJKHA,a`CsoCKEQ_@YFELd@JNX g`C_qCKBNPVN?IQO,o{BkxC[c@_@KO`@]AAH`@ZELRRLGBWd@E,csBgvCA?kAO[EMRA|@BHHWl@Lv@S,qsBisCQG?Tg@@EYCNc@AWSBNU?GZz@Ll@R`@AF@,isB_uCw@Rm@MIVCIQBALVRb@@BODXf@A?UPFLMI?,kxBkwCcB_@CPe@DCVMFJL?BLBCD@JVACXPLVQKQV?Ck@TF@Q^B,}bCapC_@K?OKBIRFF^D,k~BwuCI@?BBFDG m{BetCQMBYW@KFISECIDIXRRh@b@@GPD,o}BgtCSSHYQA?DEFCG?C_ApANr@LD\\c@NFCS,s|BkuCAKBEMC?CKMCVDBHR,mvB}vCw@KEAIN_@CAPUGBj@W?JPWPC^n@Ln@FD@F[T?CO@MPC@}@"
            ],
            [
                "MD",
                152394,
                20219,
                "Allegany|Anne Arundel|Baltimore|Calvert|Caroline|Carroll|Cecil|Charles|Dorchester|Frederick|Garrett|Harford|Howard|Kent|Montgomery|Prince George's|Queen Anne's|St. Mary's|Somerset|Talbot|Washington|Wicomico|Worcester|Baltimore city",
                [3512,862,4551,813,2389,17128,7230,1234,128,35336,12068,7318,2222,8017,2844,1387,3580,3276,334,982,36191,598,394,-2],
                [-1,72,728,101,-1,638,-1,333,40,3327,-1,528,273,-1,283,254,392,1151,0,-1,3497,59,546,-2],
                "cyAc{BSCgAKEAERFBHV^@VQTp@RC,}dB}xBQ]GIKFGCE@Yd@HLDn@GFN@DIFDBc@,idBg}Bc@GMd@[LSd@XTDAFa@\\FCPMBFHd@W,efBuvBGEEHOAGd@[ZANFBl@a@@G,{iBuxBIm@KISbAKh@XINHLIMU,abBy|Bc@Ec@G?rAn@HEa@f@S,egB{}BOCy@KSjAp@FGGDG,adBmuBCOIP]Oc@RAFN?J\\MZ\\MJS\\RHI@U,aiBovB[HIYOIYHCNPTBt@RBEb@n@k@Ra@C[,g`BqyBCeAKYA?g@GHXg@RD`@h@d@,ivAqzBMCkAMJz@Zd@^`@,meBo}Bw@Km@r@f@p@Re@ZM,ybBizBo@Ie@VP\\HEJ@b@W,qhBw{Bq@GCNCJh@HT|@JEG?BOHIC],oaBcyBi@e@INc@VKAJf@FCHNh@S`@G,idBqvB?AOYPMKg@IDc@b@Cb@Kl@b@S\\NHQ,_hBayBKDU}@i@IETJHHl@X??LLHBOF@PRCk@,sfB_uBm@`@GC[z@t@]h@AL[K],gkB_tBOQYCUf@PLGHDHR?NNBi@LABM wjB}qBBOECEDCL,shB}wBMI?MY?KTLTMHHXZILMPHHMOYIF,o}A}{BgBSJXBdAF?Vc@DQ`@AJGf@NDS,ukBovBET{@KIRDNh@JXBNPFCCu@,qlButBi@KEOHSq@IJbB~@TFIQM,kfBazBFBJGLCBQ]G"
            ],
            [
                "ME",
                72275,
                5016,
                "Androscoggin|Aroostook|Cumberland|Franklin|Hancock|Kennebec|Knox|Lincoln|Oxford|Penobscot|Piscataquis|Sagadahoc|Somerset|Waldo|Washington|York",
                [4861,7042,5134,2482,270,14140,685,1260,2334,11354,2601,2032,9627,5109,241,3103],
                [659,301,316,162,218,600,294,896,259,386,26,59,227,256,55,302],
                "g}BieDMIi@fAC`@FPd@SDJRCMk@,kfCypD`@Rt@\\r@iDx@LHe@dCd@j@JBYcAcE[?Kd@WFeAm@@MWCmAf@,{|BcbDSBEKe@RGQKHQKEf@d@^?XPJtAi@Aa@VUY[KZ,oyB_mDs@hBg@ESx@MG_@p@Vb@LHLUh@@Tc@RRf@qB@c@WBRW,cdCoeDPgBs@a@Tk@Yc@JWc@Q]z@PHy@hBHRVAK\\TBE\\\\JDGVJVO,u}BseDWc@s@EJYWEWZFp@?PP@I^P@NA@LP@,}cCkeDECIAWNWKEFFD?ND@DMZRNSCG sdC{bD?KEEGH@J iaCqeDO@GOm@PGx@NBL^NOI[R_@L@,c`CycDQAH_@QA?QKAGVMAS^HZJZXNLQ?YP?,uwB{iDGKWPGIg@pBSSUb@i@AMTAx@Lj@PBJ[XZWT@`@\\J^gB,g`CsjDgAc@FOMG\\y@NFF_@QKj@uCy@Ms@hDu@]g@hANFb@PKVXb@Uj@r@`@r@VPK,u{BctDeCe@Id@k@tCPJG^OG]x@LFGNfAb@b@Xv@kBEUXQSa@PS,__CkcDQAAMO@?XQ??XMPNZJKDg@PJJI,izBwsDk@Kc@~BQRR`@YPDTw@jBc@Yc@fARAHNVDKXr@D^q@LFRy@f@Dr@iB_@{@T}@,m`C}gDIOS@QJs@WQfBDBLAl@QFNNAJ@Gq@,afCsmDOGf@iAa@Sw@?QfA_@VEOQ?u@~@b@|@VFHh@NQd@f@x@iBQI,{zB{_D]KuAh@\\rBTGBSb@[Dc@"
            ],
            [
                "MI",
                1116557,
                1262145,
                "Alcona|Alger|Allegan|Alpena|Antrim|Arenac|Baraga|Barry|Bay|Benzie|Berrien|Branch|Calhoun|Cass|Charlevoix|Cheboygan|Chippewa|Clare|Clinton|Crawford|Delta|Dickinson|Eaton|Emmet|Genesee|Gladwin|Gogebic|Grand Traverse|Gratiot|Hillsdale|Houghton|Huron|Ingham|Ionia|Iosco|Iron|Isabella|Jackson|Kalamazoo|Kalkaska|Kent|Keweenaw|Lake|Lapeer|Leelanau|Lenawee|Livingston|Luce|Mackinac|Macomb|Manistee|Marquette|Mason|Mecosta|Menominee|Midland|Missaukee|Monroe|Montcalm|Montmorency|Muskegon|Newaygo|Oakland|Oceana|Ogemaw|Ontonagon|Osceola|Oscoda|Otsego|Ottawa|Presque Isle|Roscommon|Saginaw|St. Clair|St. Joseph|Sanilac|Schoolcraft|Shiawassee|Tuscola|Van Buren|Washtenaw|Wayne|Wexford",
                [1431,1364,50868,7233,3670,10508,1552,37045,3398,593,2077,11867,13899,3632,1902,1783,3757,8652,61964,86,5206,1571,7777,2258,4805,4143,235,2076,59950,47019,1046,118882,17858,46784,5888,578,26887,11819,14030,937,21803,0,1114,10151,1581,33584,7195,448,2199,4977,2608,673,5651,10856,16996,7723,58609,2994,21893,1620,9372,34607,1028,5392,12212,1441,22601,3143,952,38173,2655,104,6144,8269,11771,66576,1352,18566,22000,12036,14023,251,4184],
                [81,7,221437,169,198,182,-1,580,290,142,22805,79793,-1,111859,41,268,142,104,17263,-1,92,25,272,148,435,154,10,11217,41033,42381,98,49131,3520,49296,120,95,53,853,108243,158,20919,0,52,214,854,6308,167,20,-1,494,96,103,15237,132269,37,3355,34,296,31783,76,4544,974,481,49940,371,169,15186,62,130,70241,85,17,-1,243,26328,1641,36,1478,15985,-1,5668,327,277],
                "qz@uzCyAKIlAxAJ,ui@idDo@FOWUJ{@o@i@ECf@lADCf@d@@Cf@jAD,up@{jCeAEe@EGlAb@BpAH,qz@uzCFkAkAIWb@ZACXUL,{r@{zCCi@WCARy@EGv@jAJAFVG,yy@uuCk@Es@E?VND?HZH@JV@@QR@,cc@wfDDRq@]OHKr@P@Cv@tAFF_B,at@gkCe@Ce@CIlAd@Bf@B,cz@ksCDe@SAAPWACt@c@HCZlAI,{o@{xCi@CEx@`ADDg@,gp@cgCWACd@EbAn@Dp@Ba@e@,{u@ofCkAIGdAz@DN@,qu@}hCe@Cw@GKlAR@jAH,iq@{cCDcAkAGAdAj@B,gt@m}CQPg@GAPARP@x@D@SVBIY _q@u_DYWY?Pr@FDHA,av@c}CJkBm@Te@@E|AP@x@D,or@}fDg@IG`AiA?u@WIhAg@XGOa@?SPJRrAAh@Q@QpBJ@QR@,gu@euCe@Ae@EIlAlAF,kw@anCiAGIhAd@Dd@D,{u@czCiAGIlAjAF,yh@s`DS?Bg@SAkAESAMxAVn@JME[ROZ`@NGXf@J?,ge@{_DDeAkAGEx@Fz@T@b@KJEGM,mv@okCe@Ce@EIlAR@v@F,uu@o`DKjBf@FPQ[MTCJOQg@HO,_}@ooCe@CIhAd@FCRd@BJkA@S,sw@muCe@C_@CCb@Ed@dAJ,yYocDoAq@Cd@S?APw@CCd@y@CAr@rCa@\\ENc@,eq@_yC_@AAy@GJKK@b@WFE`AjAF,_w@mpCe@Ee@CIhA?BhAF,gx@yfCSAw@GIpAD@`AHDM,u`@egD{@}@_@AAPM?\\z@b@TG~An@BBy@QA,_bAmsCpALt@FHOKg@eAk@e@T,yx@ykCe@Ea@CKlAhAH,}t@ymCmAGGlAd@Bd@B,{z@gxCyAKAf@ZP@Vr@D,w`@}bDo@CuAGCf@EdAxAKf@IHE@s@,ou@wrCmAGGjAd@Dd@B,ox@iiCSAiAIA?IlAd@Bv@F,es@uhCc@Cg@CIlAjAF,qs@oyC@GkAKGlAjAF,mr@wnCc@Cg@CCd@IlAd@Bd@DJaB,ad@shDL?@Q^@i@e@oAIMD?Fr@BAJ w^}lDIKmBeATf@d@PDNd@R,op@stCc@Cg@CIjAjAF,w_AspCAHSACZIx@RBv@FHiAOE@Q,gr@{zC@x@^@h@B?]i@S_@u@ ko@kzCMc@G?ED@LLP,sz@cgCe@Cy@IKnARBlAJ,a{@clCe@Ee@CMlAjAH@?,uo@{dDBg@y@Ec@SKnB~AH,_v@caDCGQJYHBHL@ {o@ccD_BISAAPqBKAPi@PnALFVp@]z@IfAd@,g`AqmCSCe@EKn@JJGLNDAT`@B,io@_wCaAEGlAb@Bt@@,}d@icDBw@QAJs@w@Jw@dAe@CGjAR@Cf@R?d@BDy@jAF,yn@qtCu@AIjA~@DPs@,es@orCiAGIlAjAF,uf@q~CUAG{@e@CM~AK?j@fBVSGe@\\DGy@,}w@_sCeAKEx@AP^Fd@B,ws@mwCkAGIlAd@@f@D,s}@qgCe@Ei@EOJ`@fAp@F,ms@apCkAGe@CKjAlAFBe@f@B,}w@w|CQAy@GGjAjAH,}n@soCcAECd@g@CARR@ARx@D,aq@yoCFmAkAGGlACd@b@Bf@B,o~@imCw@GQ~AjALPBLmABS,yn@arC_AEGlAbADNc@,ox@}wCkAIIjAj@D^B,i\\aeDeAUeAm@OjAP@Cx@APx@BBe@v@B@QR?,{r@{tCc@Cg@EGlAhAF,ex@kzCkAIIlAjAH,su@{{CQA@Sy@EGjAhAF,cp@gmCy@E@SSAK`BdAD,ix@w_DUXaBPS^jAHx@F,cv@uwCkAGIjAd@Bd@D,ky@wpC_@G@QmAHGv@d@DARdAF,q`AooCmAMS`@BrAV\\A_@JAJo@d@D,os@gfCkAGGbAz@FT@,w_AspCHkAqAM_@nBlALB[R@,uo@{dDEv@E`A|@FVl@LyAR@Bg@e@ABg@,uy@mnCeAGKjAd@D`@BHiA,s|@crCYc@INu@GIjAb@FAPNDd@BFw@,sp@khCqAIIlAjAFBe@V@,o{@uiCkAIQCKjAd@Dx@H,m~@cjCkAMa@CDTXPFz@NKh@D,kq@ewCkAGGlAb@Bf@B"
            ],
            [
                "MN",
                2121625,
                8873776,
                "Aitkin|Anoka|Becker|Beltrami|Benton|Big Stone|Blue Earth|Brown|Carlton|Carver|Cass|Chippewa|Chisago|Clay|Clearwater|Cook|Cottonwood|Crow Wing|Dakota|Dodge|Douglas|Faribault|Fillmore|Freeborn|Goodhue|Grant|Hennepin|Houston|Hubbard|Isanti|Itasca|Jackson|Kanabec|Kandiyohi|Kittson|Koochiching|Lac qui Parle|Lake|Lake of the Woods|Le Sueur|Lincoln|Lyon|McLeod|Mahnomen|Marshall|Martin|Meeker|Mille Lacs|Morrison|Mower|Murray|Nicollet|Nobles|Norman|Olmsted|Otter Tail|Pennington|Pine|Pipestone|Polk|Pope|Ramsey|Red Lake|Redwood|Renville|Rice|Rock|Roseau|St. Louis|Scott|Sherburne|Sibley|Stearns|Steele|Stevens|Swift|Todd|Traverse|Wabasha|Wadena|Waseca|Washington|Watonwan|Wilkin|Winona|Wright|Yellow Medicine",
                [7879,886,30827,13648,44073,4375,5372,33601,7167,19459,15184,16299,5723,7952,16505,49,18565,6631,33205,23457,14600,6228,60869,9173,68383,12644,3300,46700,5981,7620,5421,15036,6258,41065,8448,3251,8186,62,1693,11800,17734,57000,17922,5169,10835,12977,34907,12633,70675,21245,53015,22187,74944,3536,45167,70204,7058,19294,62663,13468,19845,0,10937,49053,26887,16167,70805,16286,11243,10819,11468,28226,187176,6622,53804,31135,50660,12129,64958,9719,9649,2133,5979,3241,85123,27929,19424],
                [171,231,24991,209,34685,45114,669744,244365,60,25743,222,61623,484,13515,538,-1,341754,25,4808,243721,1179,278094,135192,224400,99919,-1,48,18419,16,20543,123,229617,-1,137155,-1,15,159369,-1,6,109236,131627,444988,7779,57,9,845233,1752,127,59596,237896,198432,405026,504733,-1,37041,599,-1,202,303763,1862,68364,0,-1,352676,253395,149572,400859,13262,266,-1,-1,79804,65897,116411,210165,26698,7175,12478,41069,153,216305,338,248970,22,55794,4681,214088],
                "sIodD?q@mBA?x@CjAAx@x@@?Sx@@,eK{zCkAAAX?d@^??RF?DW^U,\\wfDS?mAAy@?AlA?PxC@,{@kpDe@?S??d@uBAArBAvAd@FlA?FeCt@@@a@,{Iu}CAx@|@@Po@LI,`C}{CyA?Ad@S?At@v@U@K^S,cGyrCq@VESg@??HAlAlA?P@@{@,sDktCMFm@TSR?`@lA@d@?@Q?Se@?,aMidDuBCATAt@tBB,yHywCe@??Pg@??Pd@d@?ER??IR?,yDmdDS?BeCe@Go@G]f@SAAz@?p@tA@ArBn@MJC,D}xC{B??x@b@??^f@i@,}Lc}Cm@ADR?NS@QXL^h@@@Y@_@P?,|ByfD_B@C~A?PP?jA?@A,}@wlDu@AGdCAx@x@??kAD_B,iVqnDYKW\\sAGi@Vw@IvCnAfAv@,uAgrCw@?APe@??x@|A@@?,_Gy`D@sBuAA?zB@RtA@,eLqvCWWKGKFAXa@@IHFd@d@F?Fd@@@O,uMorCA?y@A?lAv@@,c@q_D_B?AhA?B~A?,wG}oCmA?QAAlAr@@j@?,wPapC{@Ew@AClAx@@x@@,wJ_pCg@?w@AClAhA@V?,uMmtC?Ge@GGe@]Ze@FKP\\@APR@Ad@R?x@@,h@q_DmA?AlAlA?@y@,_JywC?Wc@e@A?_@TEVG?I^VV\\C?Qf@?,kTipCeACEZIp@~@@P@,{BshDmA?CdCR?x@@@mA,cKc}Cy@??d@Q?A^jA@@_@,mFskDiEOI~DlB@@{@R@\\g@n@F,wAyoC}AAA??lAH?jA?H?,mKa`Dy@A?f@J?Av@x@?@u@K?,sBwzCS?y@??PA`BlA??y@,tDqsDyB@AbBpBAGY,iFoqDwALCTU@o@Ye@AE`DhEN@sB,fAwyCw@TIBo@n@PH?R~A??e@,uRonDg@^kAa@G~ClBxB,cBosDY?@uA]BSHSrBg@RAfAtB@?e@R??e@e@?@m@RH,gIetCCS{@?AjAd@@?If@?,fAiuCy@?A`Bz@??mA,LiuCkA?AR?lAhA?@?,qGywCg@??x@d@??Rd@@?S@g@?Q,HeiDmA??jAlA@,jDkpD?AqB@uB??pAfC?~AA?C,wD{oCmA?QAAlA^?`A@,aEezCmAFAbAd@@?Pf@@,sIs`Dy@A?R?f@J?At@?f@d@?@y@HiA,oEgaDo@LBZuAAIhAzA@MHx@?,wMapCA?w@Ae@@ChAP?hABB?,HgrCiA?U??lA|A?@?,aEctCW?mBAJn@DRp@WRS,FyoC}A?A??jA`A?\\?,`CeiDwB??lAR?~AA@Q,qOqrCS?c@AARe@AAx@z@Dd@A,j@ecDQ??QyCAAlAAx@~A?lA?,jAymDgC?A`@?PP?rBE,gMc`D@y@uBCAx@F^l@TZj@l@@@w@K?,fAgrC{@?A??lA|@A,jD{mD_B@Cl@?XQ??PmA??QS??SQ?E~AlA?vB?De@,e@c}C_B?AjAR?jA?,sM}xCE?Ar@D?JGJFH_@?S,fAklDsBD?RR??PlA??QP?,_AutCe@??a@mAj@?n@d@??Rv@?T?,uBcwCmA?g@AAf@T?Ax@V?LGlAk@RK?_@,gKytCe@AANe@AA|@@?v@@R?,fA{oC}@@A??jA~@?,z@osD_D?MXSIAl@d@??d@d@?tB?,qLeqDcAP@N]HMh@]_@w@^MvGf@^GRh@J@UtBB?y@H_E,aJouCe@e@]BGt@d@@z@??I,_Hy{C}@Ae@?A^?b@@?DK\\@l@Y,mF}uC?Re@A?Se@?S??HS??DTJ?HBRlB@@y@,eCg}CmAAy@?Qn@Q\\`@\\lAG?Qx@?@kA,}KmrCw@AClA@?v@@,f@c}CmA?AjAx@?R?@e@,PwzCy@?kA?Ax@zB?HC,aCkaDaA?KBC|BlA@@iA,vAk~C?Qm@?Ax@?d@xA?AOc@c@,sQmtCYHSHQ`@b@BAPd@@@Sb@@@e@SA@Q,_CkdDy@AI`B`A?@mA,cJkrCe@AS?AlAf@?P@,sMczCi@A@RAjABV`@A@YE?@s@D?,uDuqCmAAAz@lA?@?,vBecDkA?ArB?Rl@?BaA,sSwrCq@d@UFUZdABv@@@y@@Q,oG}yCa@]m@X]AEJb@d@?Vd@?f@?,fAovC_B??SQIg@h@SJ?`@d@?@SjA?x@?"
            ],
            [
                "MO",
                4004872,
                3290751,
                "Adair|Andrew|Atchison|Audrain|Barry|Barton|Bates|Benton|Bollinger|Boone|Buchanan|Butler|Caldwell|Callaway|Camden|Cape Girardeau|Carroll|Carter|Cass|Cedar|Chariton|Christian|Clark|Clay|Clinton|Cole|Cooper|Crawford|Dade|Dallas|Daviess|DeKalb|Dent|Douglas|Dunklin|Franklin|Gasconade|Gentry|Greene|Grundy|Harrison|Henry|Hickory|Holt|Howard|Howell|Iron|Jackson|Jasper|Jefferson|Johnson|Knox|Laclede|Lafayette|Lawrence|Lewis|Lincoln|Linn|Livingston|McDonald|Macon|Madison|Maries|Marion|Mercer|Miller|Mississippi|Moniteau|Monroe|Montgomery|Morgan|New Madrid|Newton|Nodaway|Oregon|Osage|Ozark|Pemiscot|Perry|Pettis|Phelps|Pike|Platte|Polk|Pulaski|Putnam|Ralls|Randolph|Ray|Reynolds|Ripley|St. Charles|St. Clair|Ste. Genevieve|St. Francois|St. Louis|Saline|Schuyler|Scotland|Scott|Shannon|Shelby|Stoddard|Stone|Sullivan|Taney|Texas|Vernon|Warren|Washington|Wayne|Webster|Worth|Wright|St. Louis city",
                [32947,11939,5280,29363,94412,61329,78509,42334,23232,16663,8226,5867,23718,31507,22982,34352,24360,5385,35225,67686,38898,47798,15654,17688,25850,32257,49333,29196,83715,54832,16180,27059,39002,74595,1294,45866,37564,39861,62493,17242,27015,73599,41150,5512,16423,94425,11685,9427,59853,11106,78059,36097,80548,30860,116862,15791,10866,48947,11043,46027,44945,19595,51504,14709,23873,63096,-1,55134,22947,13879,52076,-1,82027,37833,60271,74185,50469,-1,36968,49421,30589,29426,10596,110005,17078,44466,8332,21593,34845,9946,30965,4995,53874,17004,16366,370,20602,30817,30202,4060,26744,15485,7773,20295,36999,13220,101596,73020,7876,8551,13545,75742,10785,75793,-2],
                [261,-1,29,117374,837,165744,41531,9717,86,-1,331,15,-1,208868,37678,903,-1,14,30164,1592,46582,255,19512,59,-1,1569,-1,80,107,-1,130983,13,801,115,26,34983,164,128435,893,43147,-1,52183,-1,-1,163,260,15,59,525,720,6217,45453,-1,36236,630,-1,3760,-1,30031,270,28119,-1,29646,31200,165575,101720,0,1270,84240,-1,87438,0,226,1532,174,16369,66,-1,472,129588,766,42385,-1,978,30090,150020,14955,24580,448,22,287,27060,23,-1,200,50,162766,34241,139242,-1,55,166844,15,82,231284,187,173,178882,-1,65,53,1671,35388,142,-2],
                "qOswB[?w@CAHAz@rA@@?,aD{uBiA??RAn@n@@RQ,g@ayBaA@[?CdA|@?PKHm@,uRwpBeBAo@@Ef@d@??RpA@?g@b@?,uIg~A?i@oA?E~Ap@?b@@,qFqdB}A@?J?r@|A?,oFuiB?S}ABCr@?f@`BA,mLujBkAE?z@Cj@jA?B],u^acBMAB}@o@CEhBN?BRR@@IR?,aRapBS?c@??f@L~AVGFMAMRYJI,aDgrBKWSEBOo@A?N?p@rA?,i\\g`BiAAW~@H\\~@BReA,oHgsB?IkA?Ad@?RjA@,ySynBqAAAnAb@FXVX?HM,yN_iBKNu@Ia@j@Q?Ab@VLLSf@?d@??c@,o`@eeBm@CQFO`@FNDJEBVFVXP@,}JwqB?SqAA?`@]NNA`@f@JO@Nl@D,kYw_B@m@a@Ck@FG?IXCXnA@P?,oFclB?YsA@?z@I??X|AC,oIodB?y@m@??L_@?Cv@pA?,oMmrB?SeAA[??R?~@LCHXj@a@\\O,eLw`B}AA]B?x@dA?De@n@?,iTowB@cAe@As@n@H\\lA@,mFeqBcA??t@LEZZTG@?,mFgsBaA?Ap@?NbA??O,}QgjBMgAGLWFILY?BVT?ILLNb@??Q,yNumBS]MPq@?KHRv@d@?d@?,cX_iBm@AEfBHHZ@?Sd@@DqA?M,oIobB?s@qA?@`@?^hA?,}NofBe@?CzAf@@ANR?BuA?W,mH_vBkA??d@Af@jA?@u@,kFguBaA?At@?H`A??O,kW_fBe@A?R[AAXZ?Sd@lA@P?@e@H??k@,aPu`Be@?kAA[??x@rB@X?,i_@i{AUW@QNWJ?I]a@AAt@EtAx@BL@,}WmlBgA\\e@UAd@Bz@v@@l@@,qVoiBB{Ag@CG@ElB\\??LN?,kF{uB?y@_A?At@?V`A?,_LacBmA?S?AfA|A@Di@,yJ}vBaAAAr@?NbA@?e@,gH_yBe@Ag@ACdA?\\jA?@u@,mIejB?Y_B??H?bAzA?,qLsgBkA??b@R??V`AC,kAyvB}@?SBCXGr@LFd@]ROHe@,yOyoBIYMBo@LR~@p@?LQ,oT}~A?y@mAA?b@AvAnA@,mYoeBIImAAARQAAhA?H^@HiA`AF,mFinBCWUF[[MDQL?r@?PrAA,qFkbB?C}A?EL?t@`B?,m[_kBw@IKV@`@UVZRb@HBOVY,cI{lB?QiBE?rA~A?H?,gRmwBaAA?HCbAx@@H??Q,cPofBg@?MRWM?^]V?\\jA?Z?,cIaoBUM@Jg@Km@EAO@nA?@hBD,uIk`B?u@iA?Eh@?T?NnA?,iTewBmAA@JMv@bA@P?,kXqoBK??SmACM`Ap@NX@?MZK,}L{tB?OuACA??jAdA@N?,yJytBcAAAx@O??RpA@@e@,sFi~AaB@?v@~A?@c@,uOouBsAA?PI?AlAbA@?SZ?,y\\ieBcAAAHC|@L@x@@,sSkiB}ACC\\AVbAJZ?,_UauBcAAMf@KNdAHT@,uJcyBc@A]?Cj@?X`A@,gQgjBU?O??Pc@?AHC|@f@?P?`@k@,wb@g`Ba@e@_@FEFDb@FNENFPPI,_P_lBe@?Sw@SX@LLfAT?f@c@,uRqrBQ??My@?UACfAdB@,mVklB@oA?Se@?YA?`@A^X@A\\,yN{jB?c@e@??Rg@b@Jl@t@HJO,m`@k~Am@C@s@]Ce@t@H?BLVABHEFEXBF`@OBHd@@,sF_`B?KaB??X?h@`BA,eC_yBo@?o@?Eh@?x@hA?BYRC,}Vu_BmAA?JQ?AfAp@BD?f@@,qSuiBMOHMU?CWYWc@GCzA|AB,{P{~AsBA?`AB@bA@j@@,o`@u|Ae@ACIa@NH@@FIDFFJ?BBKFGJV^f@@,}^keBEG[o@ME]T]REZ?@PGl@Bn@B,mL_kB?sA?AkA??t@?b@jAD,sTmgBcAK@WO?EpAn@??j@d@?,sXwrBk@h@e@b@lAB?RJ?X@Dg@D],yCuqBsA??NAbALEH@HER[CMLG,}K{eBI?aABCtAlA?Aa@,qRifB@c@g@?[?AxAd@@\\W,wLeyBo@A_ACEv@Z??ItAB,{UypBBgAeAIURl@`@E\\,qPorBcAA?x@?TR?n@M,qHeqB?OkAAAfAf@JAKTLPM,oYudBaAGIhABp@j@Gb@eARe@,}Yk_BoAASdAb@@|@@,aZwmBq@OSJOS]D]Vb@Ob@n@^Jd@T,qIigB?g@{A?C\\Hv@H?^??Ml@?,i]chB[SGFm@VCRZn@N@n@k@WY,e\\{eBBmACNc@IQJVXo@j@OADFbA@P@,k[elB_@Kc@o@c@NFFLLHXKN@@J\\JWv@H,oLepBKNa@g@O@k@`@Jd@R\\jA?,sPkyBo@CAv@v@BDw@,cRoyB[Ag@AAbA`A@@I,ga@}aBWYWGYn@G@`@d@\\B,}Vy`BBsAmAAc@dA`@BAl@lA@,sR_uBy@AQ?A`Ax@??LP?,s^i`BY[SACSO?QAQx@Ar@l@B`@@,eLq_B?Oo@?Ed@?fAn@@,{LywBuAC?HAbAtAB@s@,{M{~AeA?Y??dAL?lA@B?,oSscB?]e@Ae@?I?Ad@Q?CrAlA@Z?,oFggB?CaB@@^?x@|AA?C,kXonB[J?LYACfAfA]FA@]YA,qYaiBw@AWXClAlA@,{[sbB_@A?Iy@AAp@S?AHXZhA@HYF?,aOacB@Og@A[?C|Ad@?\\C,eF_yBY?g@?Ch@~@?,cQscBkA?CzAjA@,k^imBFJEL?HHRJOIY"
            ],
            [
                "MS",
                832542,
                177541,
                "Adams|Alcorn|Amite|Attala|Benton|Bolivar|Calhoun|Carroll|Chickasaw|Choctaw|Claiborne|Clarke|Clay|Coahoma|Copiah|Covington|DeSoto|Forrest|Franklin|George|Greene|Grenada|Hancock|Harrison|Hinds|Holmes|Humphreys|Issaquena|Itawamba|Jackson|Jasper|Jefferson|Jefferson Davis|Jones|Kemper|Lafayette|Lamar|Lauderdale|Lawrence|Leake|Lee|Leflore|Lincoln|Lowndes|Madison|Marion|Marshall|Monroe|Montgomery|Neshoba|Newton|Noxubee|Oktibbeha|Panola|Pearl River|Perry|Pike|Pontotoc|Prentiss|Quitman|Rankin|Scott|Sharkey|Simpson|Smith|Stone|Sunflower|Tallahatchie|Tate|Tippah|Tishomingo|Tunica|Union|Walthall|Warren|Washington|Wayne|Webster|Wilkinson|Winston|Yalobusha|Yazoo",
                [2495,7237,13336,5115,5531,2375,9916,17887,23746,3945,5029,7747,16433,626,17749,32943,4501,4475,3817,9469,18081,5496,8376,4109,28107,9762,94,-1,5081,7515,11132,3922,7215,21774,11378,7832,10941,3672,10954,12287,7614,539,19236,8792,9645,12603,15251,8384,4571,17061,17823,17083,13081,11120,21850,6014,10794,12888,16594,-1,16929,27536,-1,25046,16990,8155,137,3106,22573,6915,2792,969,8121,20061,4804,731,11453,1861,11349,9946,8150,11588],
                [0,174,260,0,134,0,315,116,57135,-1,-1,46,68800,0,71,263,31,72,-1,374,78,9,68,197,197,76,60,0,21,64,-1,158,15,40,102,0,44,0,55,18,122,0,78,-1,105,17,92,13,-1,138,155,-1,7797,0,417,84,105,74,38,0,45,54,0,32,280,29,0,0,-1,41,46,0,99,68,184,46,42,-1,212,80,250,514],
                "gZy{@ICEP[JAx@x@HBRPFJGYMBm@MKDOME,qg@msAE?iAEC?Ct@~@BFUL?,y^ky@O?ClAB?p@@j@@HeA,cc@sfASQa@AYAAf@Af@jABAHj@B,qd@esA[Aa@AA\\JHAn@ZDH?,sZmhAUg@JESELi@c@QHQ?As@AA\\CpAR@APrAB,ad@imAq@C?RSACx@H@ANx@F@a@,w`@wiA_ACCx@Y@AXRPnAU?QKI,gf@{lAy@CQACx@d@BAJRDZ@@OIA,ee@ohAs@SCv@@PR@ARR@@g@X@@_@,c\\o~@QDe@c@Cf@?x@~AK,oh@c`AyAE@hAnAT,_g@qjASE@Ke@CC\\g@A@DIZb@D@K~@B,{]ooA_@TBlAARd@@@]r@@GWWO@IQ?MS,_^k|@?y@{AEW`ATFzAH,yc@s|@QAo@GEpAH?X@@Q^S,e_@{rAiBEAp@`@@RNXIBFB]RAKO,we@kz@I?o@CIrBf@@@UDiAR@,s[_{@mACSACx@vAJJE,ki@_w@G??SkAEGx@xAD,ii@sz@iAEIdAAXjAD,ya@ikAmA?A`@?Hp@@~@B@I?Qe@E,ud@os@]O@[e@CKjAf@\\NE,wf@_u@wAKA|@lAX,{]m_ACYKGM]QO?Rg@A?Pa@A^x@ETzAD,w_@agAIGFGYFoAT`@jAjAWLQQI,q]ufA]A@KSAGRMOAd@PHMPN@APf@@@e@F?,a[wdAm@ADlAm@A?H?HV??\\PF@c@N?@?FWEIRQO[PM,mi@{oAe@A_@A?^@r@|@B,oi@ku@@MyAEInALJpAI,cf@}_AkAEGxAF?bAH,_[w|@_BJAR?RlABZKDQDS,ob@m|@i@EAb@_@RAPJ?x@L,{e@}|@OAcAIGvAd@@n@B,ch@_eAQ?wAG@lA`BF,ub@_pAI?mAFAXCn@p@Bd@C,qd@iz@K?YA?RSAEhAx@D,ih@qbAaBG@|@?PxAD,}`@a|@UG[CGpAN?AJf@?,qc@sbABw@@IkACElAjAD,{g@_oAC]ICc@C?HErA^DP@,{^qjAo@ARX]GAHGp@JH?PXGGFHFLNFS,a^w{@{AICpA@?t@BN?By@R@,gi@ciAc@EH[m@Y?n@@v@`AD,k_@}aAgAg@Ma@k@CCv@HJp@j@`@@?Qf@@,wb@{y@y@ME~AL@T??ON@TUBc@@K,ob@asAM?s@COxAI?ARlAGLo@,wh@gkABy@_@E}@C?D@dAl@XAEf@@,wb@{iAq@ACn@WALFA^`@@@YXA,we@ydAkAEElAjAD,}e@kbAkAEElAjAD,oh@ogA[AaAE?`A?LvAF,yf@ciAKG_ACAJCp@Z@p@B,_`@yoAuAEEpAd@Fd@BNmA,id@gw@MAy@EATCx@d@BAZ\\NXm@,qg@oz@e@AQAI~A?RF?n@B,i_@ky@u@CClAN?d@B,oe@}nAkAAE~@x@BR@?S,gh@upAAc@_ACI~@d@@?Ib@B,{^ynAQA?QQAOlAAPx@B,ua@{`Aq@k@OnAAf@|ABDU,qc@sbA?LkAEElAjADNoA,o\\ydA@Sg@AG?Ad@PTM@FRMJHBl@@,{`@k~@}ACKAEz@P@h@DZB,wc@w_AkAEG|AN@n@FD{@J@,sf@yv@g@Ao@CAd@ALvAJ,e]ohA@QSABqAe@AAd@EjBR@AJ\\@H?,y^wkA@Sy@C@Qe@CCz@ANd@D?P\\FSYn@@,}_@_qACGYHSOa@AMn@H?tADFO,of@isAa@CA\\M?GT@b@~@B@o@KI,ej@ssA[ASR?dA@Z^@H_A,y]gpAQm@I?OIS@C\\DTGN?HP@?PP@^U,me@woA@S[E_ACARHBB\\jA@,_a@oy@A?g@?Cb@UTOA?NnAD,u[e_AUAEOCMJ?LS@OIAFKO?Ab@QG?]W??IMB?HSFL\\JFBXd@b@PE,qZkhAsACAx@I?Cd@f@@ARl@@GIJIQ],oh@i}@G?oAUEj@Ex@hADP@,id@gjAy@G[AEd@JFr@RV@Bo@,_Yuv@KID_@QGCSy@IKDIdAT@vAB,ue@afASA@SSAAQq@CEnAP?jAD,ua@emAe@Ge@BE~@lA?,_^idAg@A@QOAkAVL`@fAf@PNRG?ILC?IICLKGSLA"
            ],
            [
                "MT",
                2118284,
                230387,
                "Beaverhead|Big Horn|Blaine|Broadwater|Carbon|Carter|Cascade|Chouteau|Custer|Daniels|Dawson|Deer Lodge|Fallon|Fergus|Flathead|Gallatin|Garfield|Glacier|Golden Valley|Granite|Hill|Jefferson|Judith Basin|Lake|Lewis and Clark|Liberty|Lincoln|McCone|Madison|Meagher|Mineral|Missoula|Musselshell|Park|Petroleum|Phillips|Pondera|Powder River|Powell|Prairie|Ravalli|Richland|Roosevelt|Rosebud|Sanders|Sheridan|Silver Bow|Stillwater|Sweet Grass|Teton|Toole|Treasure|Valley|Wheatland|Wibaux|Yellowstone",
                [114774,89583,52508,16264,52213,72647,69727,33127,87693,7115,30283,5598,36184,103253,9695,33714,69989,35695,14448,16535,14834,27420,62999,30222,44064,7696,3490,24657,60482,38901,327,7919,37975,41838,32490,70562,20646,86569,39039,27846,19015,46182,18744,66397,12048,15631,5794,29337,35717,42779,11535,20803,56272,28888,14047,64074],
                [7,48,-1,101,126,-1,44758,-1,0,-1,0,57,-1,128,3152,221,-1,22354,-1,134,25224,17,-1,122,-1,16632,72,-1,-1,-1,0,124,58,148,-1,1207,25629,-1,40,0,169,37,41,414,33,-1,-1,-1,28,-1,14756,0,-1,10973,-1,-1],
                "|uAydDmAk@Mh@a@SMFm@^E\\D\\YLCTHx@e@X@d@y@R@Nq@J\\X^DfAYTVn@UTPXQDcAh@YCo@`@aAA}@,r|@e_DyA?OsAuAUK@@RiAZ@f@]DRjBkAH@f@~F_@t@E]m@|AI,f}@}wDwDXx@xEdABDf@HOtA@KuA,pjAaiDWBEc@UAYjA[LNXGRj@EPf@h@\\Go@RC,nbA}}CQ@_@k@u@IMYk@@IEDRUTNt@}AH\\l@x@GvDY,rj@k_DUkAy@DOd@e@B?PM@JrCFn@xCO,tjAuoDQDCWe@DCQe@DaAHNRw@p@XRBl@QBHx@|@u@EMLNx@GBRPCRAGo@b@S,~fAksDuAJMOS@AQsBPKf@[BJtAl@?Fb@x@R~@Iv@q@OS`AII_A,do@ggD?AeALSz@gALg@MB\\XABjATjAzDS,vm@_vD{CNC~AzBK^CEw@RA,nj@imD@Re@B@Py@DGx@M@KdARZ\\FvAU?KRAEm@L?SeC,nsAefDg@OEg@e@FAIgAJDR^BBPt@`@LG`@R,zh@_eDSMuAP@TDx@DhA?LLA?Qd@CNe@x@ECkAY@,dbAsmDy@SGc@m@?uAAINOTaATFz@|@@Fb@SBLjAx@Gx@G?Jv@GF[WoAt@[,buAa|D}ARIh@[DDj@e@TGt@K`@]LMd@N@NBTdAn@IVEE_AXg@\\?CL`AKDd@PCAQv@KA_@Gk@YBK}Ae@F,vjA{cDi@]Qg@k@Di@DTbCTJDd@PCLlAJfADh@h@cAc@cEZCb@g@,hw@klDc@c@e@DEMmALm@SSc@K@UTPnBS@Bd@K@FdA?@pG_@,drAm{DqGp@PpBx@KDd@pBUFu@d@UEk@ZE,v`AaeDe@DQgB?Ky@FQjCVAhAKBRZC,`tAkkDWBAK{@Mc@ZPdB@Hd@GDf@f@Nf@],~bAyxDwDZ`@zDZCJg@rBQ@PRA,pnAsgDk@Yo@Yc@DPpBSBFn@VBh@SRR\\Y?mAJ?,ddA}mD_AHG^u@ZVnAGZ^Ql@@\\BVe@Iy@PCCm@,dvAwsDQBEe@aAJBM]?Yf@D~@n@GA|Av@?Eo@RKKUL?MUd@G,nnAmsDEhAm@Bc@d@a@BJdAc@RFn@S@Sd@T@Db@VCb@En@XGs@^OE[f@EMkAf@GC{AUeA,zfA_tDQB]iDkAJZhDLNtAK,b{Ag}D_Ed@@lAd@GJ|AXCFj@RCVVb@KNqAb@PHQK}@,dm@coDs@Mm@JJz@RARdC~@E@Pb@UJACe@RAQoBTUEW,|oAicDa@Wm@HSSi@Rc@f@[Bb@bELHp@KAOx@SAe@d@YIy@BUXM,piAikDQBCSy@FMODL}@t@Wd@]CPjB@FjAMh@EFSOYZMXkA,l{AsrDy@Jy@z@e@r@VbAR?`@s@f@qAp@o@,xwAkpDuAl@w@?@}Ao@FWDNzAWBLjAz@L@JVClAMd@EHSS?WcA,d}@ghDy@FyBL?x@@TTARXx@ABVv@G,vhAu}CMmAQBEe@UKUcCkALV~EWBi@DDb@,by@qmDy@J?XLbCETxBMMkARCGc@}@A,nw@cwD{CPNjBNBAd@NAFRNpBDLd@Eb@b@?Yx@K`AUNUEg@eAC,voAevDqBTEe@y@JgAf@BZe@DBRD\\rAKVe@zBU\\M,np@_`D{DRXjDD?rCMd@CAg@,dqAmqDo@HBzAg@FLjAg@DDZ_@NFr@j@XfAKQeBb@[MkAVC,|n@oiDc@TAQ_ADM?Dl@S@?JwATBd@RLf@LfAMR{@dAM,nvAykDmALTfCg@\\lAj@x@`@`@]Ak@_@QFaA,nj@imDK{@]BQQyBl@HbCx@BLAFy@x@EAQd@C,rl@{rD{BJ_@BOf@uADFvAxBm@PP\\Cl@Kr@L,vw@ghDqG^h@fFZdCjAISkB\\EAg@@uBPA@StAIDC?y@,f|A_xDIPc@QOpAc@JWWSB@^w@J@PDh@e@FLTM?JTSJDn@tAm@x@{@x@K@q@`@gA,zh@ouDsCLDnABr@tAENg@^C,pqAgeDu@a@CQ_@CK??lA]Xl@I`@VD],x_AucDCSiAJ@rBj@ALXt@H^j@PAh@EEg@UBCe@{@KIw@,xcAgeDAG_BLAf@[BXb@Hv@z@JBd@TCDf@VC,lnAutD{BTWd@sAJH~@d@EBPd@EBVPE`@Cb@e@l@CDiAOA,riA{yDgCT\\hDPCd@EC[fAg@,jw@seDuAHARQ@AtBhA[ASJAI[,rr@qvD{CPHd@S@Dv@_@BPvBpASDVJARb@l@RlAMOqBGSO@@e@OC,dcA{hDm@A_@Pw@FPfBd@E~AM,bh@sfD]GS[JeAy@C@LJvCtAQ,j}@}cDW@w@FCWy@@SYU@AUEBa@fAHZtATNrAxA?TUESHD"
            ],
            [
                "NC",
                718743,
                8191751,
                "Alamance|Alexander|Alleghany|Anson|Ashe|Avery|Beaufort|Bertie|Bladen|Brunswick|Buncombe|Burke|Cabarrus|Caldwell|Camden|Carteret|Caswell|Catawba|Chatham|Cherokee|Chowan|Clay|Cleveland|Columbus|Craven|Cumberland|Currituck|Dare|Davidson|Davie|Duplin|Durham|Edgecombe|Forsyth|Franklin|Gaston|Gates|Graham|Granville|Greene|Guilford|Halifax|Harnett|Haywood|Henderson|Hertford|Hoke|Hyde|Iredell|Jackson|Johnston|Jones|Lee|Lenoir|Lincoln|McDowell|Macon|Madison|Martin|Mecklenburg|Mitchell|Montgomery|Moore|Nash|New Hanover|Northampton|Onslow|Orange|Pamlico|Pasquotank|Pender|Perquimans|Person|Pitt|Polk|Randolph|Richmond|Robeson|Rockingham|Rowan|Rutherford|Sampson|Scotland|Stanly|Stokes|Surry|Swain|Transylvania|Tyrrell|Union|Vance|Wake|Warren|Washington|Watauga|Wayne|Wilkes|Wilson|Yadkin|Yancey",
                [11760,20979,20054,9072,9152,783,637,239,4358,1676,14004,5475,10084,4929,184,392,8813,11312,30497,6440,826,4078,21062,5458,3332,2818,-1,-1,9343,8671,21940,3048,5453,2364,10008,7309,1469,299,7267,2406,9980,6344,4822,10934,2362,242,1535,251,40002,2035,9349,524,2166,4303,14398,1590,3876,5336,578,1529,1810,6156,12032,4944,-1,633,1901,6271,159,322,3047,318,6782,3373,2670,43848,3746,7818,10451,18196,11553,19010,749,12760,11083,17892,254,1039,142,17095,895,3661,6820,584,5103,7148,34494,3222,17264,3239],
                [170,93,95,54644,107,22,21214,-1,688866,55316,696,82,4500,168,0,-1,100,264,935,50,-1,14,180,219662,54095,86251,46,0,213,71,1884573,206,89435,96,12736,88,20140,104,985,345275,3027,37024,83539,136,78,41661,80751,0,292,20,143851,219878,430,243415,356,192,44,84,-1,44,87,-1,-1,53770,0,113103,146056,439,-1,-1,254535,-1,2313,258069,44,11882,45050,331520,519,-1,141,1854202,-1,359,89,21437,65,52,-1,-1,49,737,19548,-1,96,417151,170,-1,-1,45],
                "qzAe`BJkAo@GOnACFt@H,spAe_Bq@SGPJj@FI^J,yoAecBoAIDd@FFNMHBLP,iwAszASFIKGHOHKGKNIZHVfAH,anA_cBw@EYj@L?BRPLn@Y,_mAq`BAECNSRMFFXPEDHDJHELa@IE,ygBmaBc@FUQe@Cc@XTLU^L@?Zd@JHEz@Y@UOI,qfBidBISwAQ?TMVOFT^LAFPHQPJ?OZDDOVIOI,uaBazAu@z@QNJP^HnAGAo@T],edB}vAW?e@z@Dj@x@Al@TVQKo@o@W,ihAw{AoAi@GASV?VWJNNJE`@VXEJHHIAW,gmAm~AEIQDq@`@a@CTp@@?Z@JEHHL]TQIQ,ctAi|AI?mAMXlAFCVI,ymAs_Bm@Gk@TEj@DD`@Bp@a@GY,kjBygB_@Gi@b@KCSLQV?PT@Va@PCDOr@SHE,siBg{AaAYCQLE}@_Ay@RdAxBf@O`AZN_@,}yAsdBGAUAUCMCGbAP@n@F,spAs}AEE_@KGHe@ZBPdBJ,szAw_Bu@IBGi@CSCDz@O@FN\\QJPXJb@F,}`AmwAIOU@KIKLm@K@RRDVd@TB`@B,siBoeB?KUOGr@_@@AH`@PNGLW,ubAcvAWe@SEMAc@`@J@dAF,_oA_|A[AS\\]^ATF?fAF,c_BsuA]m@oAF_@ISDJ`@n@VJn@,cgBo~AYIEO{@XJXKZa@FIGMDBP`AXPw@fAU,{}As{A?Cs@Y_@?Cv@a@VfAP\\S,klBghBk@I_@`ADBO`@JHLI?QPWRMJBh@c@,unB_eBKINa@ECuA~BCrAb@Np@cBTDBeA,wuA{_B]Q_@?ARKzARBb@k@TAFQMC,atAc`Ba@EECMPC\\LBGPn@O,acBu|A{@GKBK\\KDIv@lALNA,k}AacBYCE^I@KJDTH?@LJ@RB,_dBuaBKcAy@VOd@n@h@T],cuAuaB?CiAKGv@^?\\PLQDBBKII,}_BccBM?OYw@BZ|Az@c@,opAc{AyAIGFHBBn@r@B@U,ahBigBaAMIDKZNHTNn@O,qbAmyAaAAJb@BFl@JJM@Y,e~AecBHcAIAo@IDTMz@@b@d@CHA,mdBw_BQQg@TIP^XDEPD,uwAm`BFw@wAKKjAxAJ,ybB_fBk@AQH?RWCa@\\MJNHHPx@W`@HTI,g}Am|A]u@GOe@Fe@f@HP^?r@XXK,efAu{Aq@YQVWR@VIHJVLFt@i@Ba@NE,}kAwzACNHl@d@NLa@XUKIYDa@W,{fB}dBEs@GGPGi@GA\\o@N?J,a|AkzA_@k@YBSn@T\\ZBDU,yjB{aBg@EWC?PM?GYUBUEq@bBh@d@x@Sj@YT_@UM,arA{}AKk@FQYEa@CCj@Bh@Kb@H?ZHBMCQ,yfAkzAu@h@Px@IBPFZq@FBLUD],s_Bk~AcAoAMN]ZDt@XR^JHI,ueB{{Aa@k@FMI?gATQv@NFVYhAB,a|Aw}AYKKQ]P\\t@PGRU,ydBg~AQEED_@YQPHXH?GL`@j@J]JC,}oAa|AeBKCLAPxAHR],ukAk|AKIGSYQ@EEKGNHPUPM\\z@RVK,cdAcxACG{@SMTGC[p@`AJb@a@L@,wgAo|AG_@M?CO]MALIBGGU`@nAh@,efBacBIQWHEN[E?NQKIPGQM@F`@TPb@Gb@M,csAqyACo@ICFG@Q[I]p@WHl@t@LMDGNP,okAq_BYFM`@IDADXPNi@X?BIJB,owAy|ASCs@IUt@SPpAPBs@,wyAg}Ae@Gc@G?JSTQFDHYJ?BXC^j@TAHQRQ,waB{`B[}AUHa@IJbAx@h@,}dB}vAa@SWPL^D\\,wbBgfBUCqAQWCQFFFDr@HR`@]VB?SPIj@@,afBu{AiACWXO^|@x@h@w@,u{AybBQAc@ECrAh@B,_jBo~AIDe@K?[MAk@X|@~@HF`@GJ[,mjBqgBs@RENQBW`@TJ`Ay@,qcBcwAKQPOQi@mAMi@v@\\d@VQ`@RV?,ijBkfBOIaAx@^NF?@I^A,_|A_eB{@IIbAXBb@D,eeBq`Bo@i@c@LWb@NHATDNXHPQHQf@U,alAgzAQEe@ZANj@BVB,wwAy_ByAKALIfAd@Fr@H,oxAmzAqAQIPU@PN@f@JBh@FIWH[JOJF,q|AowAQc@DM[CU]]RU\\@n@\\l@nAy@,cwAcdBu@Ic@EG`AvAJ,etAw~Ao@NU@c@j@R@lALJc@,}kAwzAOO{@SIIKD?xAP@P@@Od@[PD,o`Bq|AIQIH_@K]NKbBO@Ph@t@{@`@W,a{AoxAKCAg@QOURETELPb@,{vAw|ASA[VCr@FIHJRGf@H,{tAycBcAIC?I|@hAJ,irAocBKAg@C]CG~@?B^Cf@PBSRM,adAkzA]Ce@c@ODC`@ZLE\\z@RKc@`A@,ohAayAMGKWYTM`@^RVFPHHC,{kBkdB_@OUKUAMHRNCdATCFXL??QVB,ktAwxAm@u@GBg@IEtAh@Dj@D,u_BueBWCQp@BHNXL?L{@,c~Aq`BKAAMI?EUJKe@B{@b@bAnAd@GNA,m`ByeBo@IYCAFDdAv@CCI,siBwaBGa@U_@a@QG?EhAf@D,amAw`BKMWADIo@XEFLRl@FRS,cbBe}AYSEu@i@GKn@Ch@z@F,ooAw`BQMCSM?MQICOLGGSLCRCf@XDp@Rj@UMS,ebBk`By@i@ODU\\DFPPh@F,{rAgaBg@Q_@BETHHCJ`@D`@B,cjAc~AKUKCCHY?Oh@FRJHRWF@"
            ],
            [
                "ND",
                1699272,
                161489,
                "Adams|Barnes|Benson|Billings|Bottineau|Bowman|Burke|Burleigh|Cass|Cavalier|Dickey|Divide|Dunn|Eddy|Emmons|Foster|Golden Valley|Grand Forks|Grant|Griggs|Hettinger|Kidder|LaMoure|Logan|McHenry|McIntosh|McKenzie|McLean|Mercer|Morton|Mountrail|Nelson|Oliver|Pembina|Pierce|Ramsey|Ransom|Renville|Richland|Rolette|Sargent|Sheridan|Sioux|Slope|Stark|Steele|Stutsman|Towner|Traill|Walsh|Ward|Wells|Williams",
                [32584,17223,22906,25096,16109,38395,16327,68229,6118,786,41714,12137,73982,27130,72869,17596,30785,8130,82360,13991,13346,63718,28970,60537,77179,45187,69378,32661,36751,116822,46806,10913,41963,12011,23954,1789,46530,1891,21927,15754,23392,25677,57769,26717,37782,7396,61297,3578,5940,4862,14158,17404,20746],
                [0,25,45,116,24134,-1,-1,370,-1,-1,-1,-1,-1,-1,0,0,-1,30523,-1,20,0,0,-1,210,6,0,9,0,0,-1,1910,-1,-1,60,0,-1,16075,0,143,7,0,-1,-1,-1,130,0,11,36087,138,-1,63,14,-1],
                "v`@_bDK?kCZ@`@?V@?nCIHA,vJqgDmA@e@@AdCt@?|@A,hOooDk@@@n@QH?Rg@GAVQIUR?LtBCjAA@sB,jc@oiDuAFI?DlA\\CDlAx@C,lXgtDaEHAbBR?RAAQ`BE?Rz@C,xe@kbDaDJDhA`DK,b_@utDgCH@h@RA?RLA@d@~AE?Q,rVmgD_@@Ae@K?sAB?xCxACPMRaAGE,bGmgDg@?{A@APCpBhA@|@A,zLwsD{CB?dBx@A`BC,pMs~CAkAuCBC?@lAnBC,fd@auDcDJApAjDM,h^olDe@NSCCl@A|BfCAEmAH?EkAcAB,pN{kDuBBAd@?RrBC,jUwcDyABW@ClABhA~AC@?Nm@G}@Ea@,lNajDsBB@x@rBC,de@siDy@BBzC\\A@Rb@CAU,|GanDqB@?Bc@nBtAA|@?,d\\udDw@@?R_ABBx@g@@APtAx@bAMAa@F_B,xJqjDmA@A~AlAABQAy@,f`@kdD_CFG~AjC[,pRmhDK@sA@?xCfAAVA,pMkcD{A@}@@@jAtCCD?,xQqcDgA@_ABBjA~BC,pV_qD?SaBD@PS@CxCx@Cx@ADgC,tQcaD_CBE?@jAnBCVA,be@ajDIcCQHs@c@M\\g@IEOw@Fe@\\Nd@@^bACDjAtAGx@C,tZmlDgCFy@@PpBJ?@d@^AH]`@BJEH}@z@Jx@UBm@RBAS,j\\ujDy@T{@KI|@KDlA?@x@r@CDE,b\\qfDs@B}BDS`AQLMJD`@j@@VX@Qf@ACy@~@C?Sv@A,`_@qqD_BDg@BCxCjAE@Rd@OOe@d@],vIcnDy@@ArBNAlAA@e@?MO}@,~WghDa@CI\\I^FD|BEAy@,~GssDiB@QhAFX?@rBA,|RypDS?_BB?d@t@AArBf@AR?,|MmoDa@@?g@aBBAjAR?N|@TSPH@Wf@F?SPI,vHgcDu@?}@@@jAnBAB?,|ZasDAi@mAB?bB{@B@PrBECy@ZA,bEecDiAAA@[dAC`A?PdB?FmA,jR}sDaBB?bB~AC,tH{`DoB@GlAtBAB?,rTclDy@BS??rBJArAC,`\\a`DcALuAy@WYk@AF|@Ol@dFK,re@edDc@BAS]@y@Bm@BBjAJ?`DK,p`@yfDgC@ED@z@@P~BGl@CEmA,jHojDO@}@?A~Af@?d@A,pOihDa@@sBBCPAfCzAA~@C,hOysDmA@?bB?f@`@Aj@A?e@,|EmjDuA@Ed@Ax@zAA,xIopDy@@sB@?jApBAx@A,|ZasD@P[@Bx@sBDEfCfCGByCf@CAe@M@?S,dR_lDg@@kA@Cx@@x@`@ArAA,ld@qrDkDL?PA|Av@GDNf@HL]r@b@PIGwA"
            ],
            [
                "NE",
                6390191,
                3606923,
                "Adams|Antelope|Arthur|Banner|Blaine|Boone|Box Butte|Boyd|Brown|Buffalo|Burt|Butler|Cass|Cedar|Chase|Cherry|Cheyenne|Clay|Colfax|Cuming|Custer|Dakota|Dawes|Dawson|Deuel|Dixon|Dodge|Douglas|Dundy|Fillmore|Franklin|Frontier|Furnas|Gage|Garden|Garfield|Gosper|Grant|Greeley|Hall|Hamilton|Harlan|Hayes|Hitchcock|Holt|Hooker|Howard|Jefferson|Johnson|Kearney|Keith|Keya Paha|Kimball|Knox|Lancaster|Lincoln|Logan|Loup|McPherson|Madison|Merrick|Morrill|Nance|Nemaha|Nuckolls|Otoe|Pawnee|Perkins|Phelps|Pierce|Platte|Polk|Red Willow|Richardson|Rock|Saline|Sarpy|Saunders|Scotts Bluff|Seward|Sheridan|Sherman|Sioux|Stanton|Thayer|Thomas|Thurston|Valley|Washington|Wayne|Webster|Wheeler|York",
                [62608,131008,29610,57778,36191,104998,54930,45552,136229,103788,26858,48777,7730,99336,145431,337095,52669,50961,83930,346446,290855,5998,67843,221267,15465,37711,47195,719,62741,37944,29050,50877,35951,33769,84295,50631,25570,40774,39680,67025,25053,38709,56053,20565,190677,25610,76316,24761,9528,95439,33339,44184,18702,116640,24796,305622,27924,31620,53458,82112,49563,160127,18031,4662,42087,9149,15737,35653,207473,50120,125056,56770,53015,13256,105901,18653,1073,55262,83479,35622,105776,43369,91679,31763,44561,34915,37338,73652,15904,35095,88001,100403,38653],
                [51265,140495,16098,-1,0,-1,187,600,-1,3127,-1,59663,5016,99386,-1,26,25,185399,77934,202065,-1,19236,-1,111068,-1,48058,50665,-1,466,37184,390,-1,-1,37254,27,-1,-1,0,-1,7284,3071,3439,0,0,118022,-1,2553,-1,5058,-1,106,0,19,120220,9130,42,0,-1,31,43156,-1,0,57049,-1,224,54004,60,18601,-1,38764,573569,37958,27812,25538,-1,35444,-1,3774,57820,25607,123,98,0,70935,2989,35100,0,439,29022,29748,15229,-1,53542],
                "fM_zB?AiA@?@@jAhAA,vJcfCkA@@lA?d@jAA?e@,z]cbC{ADC?BlA~AE,ph@qbCqBFBx@BHlBGAe@,|T_dCQ?mAB@jA|AC@?,xJobCkA@?d@@p@jAF?y@,~d@ogCmBFC`BjBGD?,nOejCyBB_@X@Zj@E~@[l@R,hTiiCsA\\BnCB?lAC,zPq|Be@?kA@C@@jA?@lADd@C,zAacCo@EUNAVINFXv@A?KP?,bFw~BS@y@M@xAjA?,lAa|BWEQJYO_@@G`@@XhB?,pF}hC]AUNWF?xAx@??SP?,x^_yBCy@uBDBlAtBE,x]{jCiCFgDF@`@@hDP?|AE~AE|AE,fe@e`CCIwBHAn@Dp@DAvBG,|J}yBkA?@lAhAA@?,lEeaCe@?Q@?~@x@L,fDqcC_@?k@??N?|@x@?PA,|TsaC}ABkABA?@jA@lAd@?bCE@mA,dBsfC]FIDBZGL|@?Aw@,~d@mkCqADa@BDzBlBG,~Tw|BcCD?rAd@Ex@Cf@A,ha@u~B{ADBp@|AE,dDmeC?yAa@JQHK\\N?@v@L@^?,tCcaCy@?Q??JAj@QTV?fAM,lAu~BW?aA?Al@bA?,x^kxBuBDC?BlAN?jBG,pH}yBkA@?lAjAA@?,vOuwBkA@@lAv@?RA,~WmzB{ABg@@@x@PA@RN?~AC@?,`U{wBO?kABA?@lAzACB?,xCmwB?e@kA??z@?x@x@?RA,ha@edCcBDBz@M?BlAJ?@d@zAE@o@,pOycCkA@@lAhAA@?,zSgzBy@BBjAjACASQ@,d^_dCKQ}ADBlAzAEL?,dMiaCiA@?x@?RjAA,dMm|BgA@?d@?d@hAA,|Je{BmAaA?Z@lAjA??A,bRwwBkA@@lAjAA,~ZszBO@oABBlAzAEB?,~ZexB{ADA?BlA|AE,pOyhCm@S_AZk@D?fA@lAjAAjAA@?,zZkdC_BDBlAzAEB?,fM{~BkA@@lAfAABA,dFmwBkA?@lAjA?,lAsxBaA??z@`A?,tOyyBmAE@jA@?jAA,l^o~BAe@K?_BDU@@tAdCE,fTkjCiBBm@@@j@bALrA],th@m`CmBFDvA^AnAG,tJgiCWHQP]Uc@BW??zAx@?jAA?gA,xC{yBAmAiAF?r@?x@jA?,hZm_C{ABkABAlABlAzACnACCeA,hWuaCiA@A?BlAjAC,|Q{cCC?eA@A?@lAjAC,zZ}aC{ADU@BjAzACTA,lHscCmA?@lAjAA?e@,zJy~BAZ[@aAIAQO??Ld@`@lA`A?e@,~d@ibCEcAkBFC?@~BvBI,zJm_CkAGU??\\@P`AHZA@[,JsxB{@?Il@QJlA@H?,|JqwBiA@A?@lAP?x@A,lAmzBiB?HJU^GLz@?`A?,lAwvBaA?I??x@d@?d@?,p^}|BeCDBdANAtBEAK,`RczBe@De@B@bAjAA@?,jHafCy@?Q??R?x@lA?,lHgaCkA@S?@nARAd@L?MN??]T?,nHg}Be@a@e@M?lAjAA,`X_xB_BBBlAzACB?,@wvBmAAKDId@SND?jA?d@?,tQkhCcAM@~CdAA,dF{yBkA??f@?d@jA?,t@g}BcA?GD?V^AXNPK,tCc_CgALWl@?^VDhAG,jh@udCkBFE?DbApBG,bFi|BkA?@lAjA?,ja@ckCqBF?hEJPbBEB?BaB,rO__CkAB@jAjAA,vg@skCwAD?|B?`BjBGKgC,~EscCw@@?jAd@?R?,pHowBkA@@lAjAA,zWedC}AD@jAhAATA,dCydCMA}@?ALKd@n@D?Oj@?,pOkaCiA@A?@lAjAC,hAw`Cw@@C`@MC?FKJ?L`A?PU,~EmeCy@??R_@?@f@^?v@A,jMswBA?iA@A?@lAf@?d@A,dMwcCkA@?d@@f@hAA@?,nHk|BkA@@lAjAA"
            ],
            [
                "NH",
                29647,
                -1,
                "Belknap|Carroll|Cheshire|Coos|Grafton|Hillsborough|Merrimack|Rockingham|Strafford|Sullivan",
                [1749,1187,3583,5054,5208,1670,3685,1681,1599,4231],
                [186,168,385,158,669,-1,508,465,319,454],
                "ixB}~CeA^If@FPx@UDDZWE[QG,axBcbDSVAe@c@Q_@fBQt@DNBIR@dA_@LY]M,{tBwyCMB]S?JUCEf@a@l@v@JZDV[Ia@,avB_cDUm@T_@C}@@s@SSWFEOeAvEb@P@d@RW,_uBc~CAyAD][SIO_AZW|@\\LMXCLPFDZVADP`A?,}vB_zCAMMGMNYMIRi@ACh@a@JbB^D@`@m@,wvB{|CEQW@[VEEy@T?BF|@h@@HSXLLOLFTY,izBazCG}@i@RBL]GEKUFDl@^JZb@`@K,qzBc|CGQHg@SACHEOEb@c@ZCRDJ\\FCMh@S,ytBgzCBsAaA?Lr@UX@LTB?K\\RLC"
            ],
            [
                "NJ",
                25552,
                7276,
                "Atlantic|Bergen|Burlington|Camden|Cape May|Cumberland|Essex|Gloucester|Hudson|Hunterdon|Mercer|Middlesex|Monmouth|Morris|Ocean|Passaic|Salem|Somerset|Sussex|Union|Warren",
                [165,14,978,113,207,1127,0,2047,0,3417,632,45,287,352,532,16,6125,1556,4665,22,3252],
                [528,0,1006,30,800,-1,0,1009,0,357,355,656,84,57,324,19,289,-1,454,0,223],
                "knBs~BQ_@QRk@DGJOE^t@t@FBUXO,moByiCy@P?P@TDVBLLFAEKOHD?EH?AOF_@VE spBmgC?BEC?EA??A@?AAB?B@?D,gmBoaCc@_@?GUDIHi@|@En@j@EPSNIL@HQXS,{lBaaCYRIPMAOHP^LQZKLU@K,{nBs{BAa@u@Gb@zANBAo@,}kBo|BUk@]N@WOFYNCT@`@VCLH,ooBchCYJ@NI??DA@@Fh@E@e@,ikBk_C]SKGMT[JMPJVNGz@W,spBmgC?A?ECAC?@@A??@@??DDB qpBwfCIOJN,ikB_eCe@u@]HIZHPKPLTJBVKH[,_mBqcCKCMUEHQAAHYHPREHTE?F,qnBcdCS_@LOGGi@GBTGHPj@LFXI,moBocCMGQk@]?EOMrA`AAPXHIDI,}lBsgCSKMc@CHGEYDITH?Ad@JPFFJWXN\\I,koBgbCQYaA@ElAP|@NDFKDo@,_nBciCO_@YFC@BZWDG^XKHUXEFD,ikBi_C?AIN{@VAV\\OTj@VK?GJ[,mmBkfCYOKVGGI@DLFFMNR^P@DIJQIQ,slBwjC{@RN^Lb@RJj@c@,_oB{eCEMHAKQi@D@?@DDDAF,akBsgCM_@ACk@b@L\\d@t@@CDa@M]"
            ],
            [
                "NM",
                1330860,
                1747,
                "Bernalillo|Catron|Chaves|Cibola|Colfax|Curry|De Baca|Doña Ana|Eddy|Grant|Guadalupe|Harding|Hidalgo|Lea|Lincoln|Los Alamos|Luna|McKinley|Mora|Otero|Quay|Rio Arriba|Roosevelt|Sandoval|San Juan|San Miguel|Santa Fe|Sierra|Socorro|Taos|Torrance|Union|Valencia",
                [3672,35250,144617,15356,39316,243083,17719,41400,33286,27976,20575,23092,18935,100315,30556,-1,37589,16343,13647,20008,41764,17943,156761,12978,14934,32141,8111,14565,35328,-1,32755,60012,16228],
                [115,22,41,15,27,120,-1,43,151,76,0,0,-1,10,13,0,17,180,-1,28,24,34,25,82,132,130,109,13,26,112,96,-1,73],
                "~}@ewAiDRBf@Kf@l@ElBKDS,viAonAWqDoF^ZrFt@GF|@~DY,zt@ogAkADUsEQ@?RqBHAQe@@S@Dz@W?Bd@e@@@Rd@CZdC|DOJ`B|AI,rhAuvAgBLIkAoEVQTO|@VCHrA|AInF_@,vq@kbBK@iEPNlDjAG|CWC}AWE,|j@}pAESe@BASg@OASk@BBl@F~A?@|BI,tq@woAEw@qADUc@e@@Bf@a@@HrBd@A@PpBI?SPA,zz@qgA^fFl@ED\\QRnCOUuDCe@kAF,rr@_cAKaB}DN?vEp@CFAxCM,hjAqjA_EXYBG`CUFtBBNnCv@EOqCRAASd@CCe@`@E,ls@ytACe@oER?NFnAd@ATb@pAEDv@jAE,|m@q|AkAFe@J@RkADDlAFjAl@At@aBdA?Kg@,`kAeeAKmAa@DBd@e@B@RS@NpCw@D?PJbB~CS,hl@qeA[eCe@BsADBf@F~AD~AF`B@Pn@AhAE,pw@uoAmBHAQkADBx@TrEjAEAg@hAEASpBKBSEg@y@FCe@W@,bx@w{A?FBRMBNLZQE],pbAieAy@DTtDhDU?QOoC,rgA}}A{F`@w@DPxCnEWHjAfBM,du@q{Aa@Cg@s@}CVOz@Jf@rBGv@[`AG,zz@qgAGkAqBJ@RiAD@f@TdC}AHHpBJ?hESfAG,`m@krAGoAyAMAa@m@@GkAy@B@XD`BBr@j@C@Rf@N@Rd@CDRd@C`@A,v}@ucBcDRqAF?vBVb@uAfA`@B|@KAN`@A?GnBSCo@`CQQaC,bl@aqAe@BD`A}BHFjBDv@rAEASd@ACe@V?E{@RA,p_Am~AaCPBn@oBRZAD\\[PJvBhDSPUQyCv@E,rfAydBsBL{CRK@f@d@P`CDp@zFa@,fu@yzAaAFw@ZsBFeA?u@`B@`@xAL?OnESBd@jAE,hx@izAOMLCCSa@@@O}@J@VPxD~AICg@,jbAmkAsFZCRFjAjBn@jAGBd@x@ETGFaCXCG}@,naAasA}AHy@FoAf@Bf@yAHH~AVABd@x@GDf@rF[,`v@ybBs@DuAFF|@VDB|Af@r@tAgAWc@,zy@gtAm@DJg@_BHkADRzC@PlBIxAICg@,pk@i|AOmDaDJM@FlBLbBDdAx@CEmAjAEAS,n}@guAERmBJJ~AnAg@x@GIsA"
            ],
            [
                "NV",
                438511,
                -1,
                "Churchill|Clark|Douglas|Elko|Esmeralda|Eureka|Humboldt|Lander|Lincoln|Lyon|Mineral|Nye|Pershing|Storey|Washoe|White Pine|Carson City",
                [61993,2532,13072,128070,1126,19983,59243,16023,14031,40360,1820,23989,23826,0,12859,19159,425],
                [-1,-1,0,104,0,21,37,0,-1,-1,0,17,58,0,18,-1,0],
                "rxB{cCuG`ADtA|@j@Pz@N?rCc@j@qA]iAXL,`lBgjB_I~@ZlCV`@`@a@`ACJxEPZlCuEZg@,b~B{~BgAXg@H^d@?nA`@q@f@{@Ha@,djBynC}HbAyBXg@Dh@zEd@`EfH_AZC?{BOiAdAMfAO,bsBqwB_AzBp@~ExAeClAuB,niBogCeALNhA?zB[BTtBb@zArBW,vuBqqCsDj@{Dj@A?p@xENlAd@GLTEa@v@KIe@xDk@EWtAS,|oByaCaAiBMUe@FOmAgANzApKfE]Q{@}@k@,tdB{uBaD^BTP|AVvBXdCD`@~H_Aw@iGwC^,l|Bm_Ck@Go@u@QAYM\\hAk@pAZETVBRQDV|Ah@ITa@?oA_@e@f@ICWLC,|zB_yBi@HW}APECSUW[DsCb@x@BBP}@rBxC~A,bsB{{BO?gE\\sBVaChCZhCvC_@v@hG^`ErDoGq@_F~@{B|@sBCQ,lwBojCuARDVyDj@Hd@w@JD`@`AhBtGaAPC,l|Bm_CMMCk@KDOGm@An@t@,x}Bg`CG[O{@qA{Hk@oDeBXE?t@`Fv@nEQBJlAP@l@@NFJEBj@LL^JRE,|fBw`CgH~@Hl@NnAb@|D`D_@`CiCc@{A,`~Bg_CSD_@KGNMBBVfAY"
            ],
            [
                "NY",
                1380585,
                42889,
                "Albany|Allegany|Bronx|Broome|Cattaraugus|Cayuga|Chautauqua|Chemung|Chenango|Clinton|Columbia|Cortland|Delaware|Dutchess|Erie|Essex|Franklin|Fulton|Genesee|Greene|Hamilton|Herkimer|Jefferson|Kings|Lewis|Livingston|Madison|Monroe|Montgomery|Nassau|New York|Niagara|Oneida|Onondaga|Ontario|Orange|Orleans|Oswego|Otsego|Putnam|Queens|Rensselaer|Richmond|Rockland|St. Lawrence|Saratoga|Schenectady|Schoharie|Schuyler|Seneca|Steuben|Suffolk|Sullivan|Tioga|Tompkins|Ulster|Warren|Washington|Wayne|Westchester|Wyoming|Yates",
                [5764,16172,0,10644,35712,82794,45350,7472,30208,47039,14966,26055,19254,5552,24267,2684,32313,1908,62823,5109,-1,21431,48315,0,48525,55686,35174,2922,33222,0,0,20152,37804,45071,59265,4932,7689,12861,13385,122,6,9862,0,-1,66278,17508,771,17148,12995,14434,58696,255,3385,19446,26129,2962,113,61085,27938,285,93232,25381],
                [132,131,0,147,537,783,437,30,364,313,1053,96,862,464,1111,90,468,50,185,115,0,586,227,0,209,158,209,-1,473,-1,0,300,449,114,249,76,165,194,422,39,-1,619,0,0,363,63,30,295,1082,8853,7531,201,197,327,-1,185,48,1357,8827,45,262,119],
                "amBwtCw@WIKID?hAfA\\,wxA}nCk@Gs@?OhBhALN@,gqBuhC]B@LRFHC,ycBkpCi@IMb@cACSh@RBbBT,}tAknC[NcAa@Y?UpB`BPVB,a`B}sCNeAKSIb@U?UrA]HG^~@LLS,wqA}kCyAqAKBUtBvANXB,y_BsnCe@IAHM?AKKAI|@x@JF@,qdBwrC}AYA`BCXbABLc@,ejBidDgB[Ab@IHAh@EHCBpAl@,koB}pCKc@Hi@aAYAfB@PdAE,qbBurC{@QCNQ`Ah@HRBJm@,qgBopCeBeAq@XDd@MBj@j@p@p@h@WRi@,_pBgmCTiBeADAQOtAE\\~@VBJ,otAarC_@DMQi@GIn@KfAbA`@ZOJCc@y@,ijBa~C]ITy@a@KqAm@Sz@Fr@Un@HBzAb@t@]IK,ejBidDm@vB`@JUx@\\Hd@Lz@_E,qiB{wC]D}@SSv@dANd@E,ewA_sCiAMOCC^@\\nALHo@,ilB{qC[QgA]Ih@Jb@PGFRd@DXELC,sgBa}Co@Qe@MK^HJu@\\VFYjAIX|@R\\EZEGc@,agBuyC^gBq@Ci@zBFb@[DCr@Gh@fAJHe@Ok@NAIS,gbBg~CiAXBx@h@ZQf@`ANHYb@ISWPI?W,_qBggCIA?CMHCCMVPJPEHO,qdBm}Co@N_@fBv@v@d@ALo@Pg@i@[,azAsqCA]w@?Gz@QACRZBDXr@?,}cBwuCYE{@v@]I@\\|AXBO`@qA,gyAauCe@Ae@PYMIr@PBCRL@v@?B_@NB,uiBgvCe@DeAOADCJV\\ZJ`@ERA,crBchCAMAAc@S[~@r@P?c@,eqB_hCIBDL?BH@,{vAstCIr@AHh@FLP^EF?Fi@,cdB_xCe@@w@w@Sz@HRO@Nj@Id@B@\\Hz@w@XDFc@,}`BsuCk@EBKe@Ja@pAz@P\\I,{{AqrCMABSQCaAGIt@t@J?h@RBBSP@,}mBwlCMKs@CC`@GF@P^n@XGz@SLMBMm@K,{vAstCkAMGr@hAL,}_BwvCw@e@@a@aAOMn@Lb@Gb@PAd@KCJj@DT?,ogBqsCA]CAgAKS@Mj@FXdBdA,ipBkkCAQFGCK_AWEb@,iqBmgCEMSGOH?b@HDLWBB,moBuuC@c@y@MKh@@v@`AX,ipBcfC@GEEMGINBADLTN,ioB{iC_@o@Wb@E^x@Q,ggBscD{@~Dn@Pp@Bn@OhAYgAwBy@o@,clBcyCi@O[`@UWKnAAb@HEHJPKBKFBVG@ERw@,olBauCW]BKWFGCCJQJv@VLF,qjB{tCa@D[KCPMGChAZPp@YGY,y~A{oCc@ABQ_@GKx@KA@JL?@Id@HRD,y~AssCg@II`AMRQJPB^FTm@,w{AeoCEY[CSCa@GIRKl@SEK|@fBRTD,gzBemC?IMGCH gtBggCZ_AoCs@u@{@F^KBISQN[QdDbC,siBsmCq@q@{@RL^i@XLVl@JCLf@ELU,}aBaoCm@MDWSCWxAD?bAL,y`BwpCQCPK_AMKl@EVl@LJ@J@,qlBqpCYDe@EGSQF@JUhBr@BLJh@YM_@z@S,alBw{C{Ac@LhAOf@TVZa@h@NXkA,}nB{|CICEJ@b@MIQNGn@QpAx@LJoANg@,m|A_uCaAMa@UOdAf@H`AF,ipBkkCcAYQ\\`@`@QTFZ@@\\C?QD_@,qwAeqCoAMAlAj@FX?,c_B}qCUl@CPb@@HS`@F?i@"
            ],
            [
                "OH",
                1212468,
                2752063,
                "Adams|Allen|Ashland|Ashtabula|Athens|Auglaize|Belmont|Brown|Butler|Carroll|Champaign|Clark|Clermont|Clinton|Columbiana|Coshocton|Crawford|Cuyahoga|Darke|Defiance|Delaware|Erie|Fairfield|Fayette|Franklin|Fulton|Gallia|Geauga|Greene|Guernsey|Hamilton|Hancock|Hardin|Harrison|Henry|Highland|Hocking|Holmes|Huron|Jackson|Jefferson|Knox|Lake|Lawrence|Licking|Logan|Lorain|Lucas|Madison|Mahoning|Marion|Medina|Meigs|Mercer|Miami|Monroe|Montgomery|Morgan|Morrow|Muskingum|Noble|Ottawa|Paulding|Perry|Pickaway|Pike|Portage|Preble|Putnam|Richland|Ross|Sandusky|Scioto|Seneca|Shelby|Stark|Summit|Trumbull|Tuscarawas|Union|Van Wert|Vinton|Warren|Washington|Wayne|Williams|Wood|Wyandot",
                [23646,8576,25615,10743,7389,29091,22441,14328,9237,14076,9687,14487,3228,3328,25068,18712,8951,18,54582,8125,2157,3727,7524,6434,293,29766,15081,6722,4549,16292,1537,4575,12587,12133,6943,19913,2489,34280,14803,12562,8308,19481,232,4934,19018,15173,5476,364,14770,13072,5461,7159,6339,90442,5351,13002,8722,13630,6694,24669,19570,4066,19234,7414,10066,6468,6447,20425,21945,20903,12916,3862,6133,4385,30901,16919,782,10346,28672,10494,17749,2940,2602,21775,75190,10667,7960,3645],
                [2064,235800,16036,916,147,102949,219,181,14490,837,44279,43198,138,39250,5304,59807,107306,15,356183,2493,22126,-1,32269,6196,-1,16294,658,444,13695,2519,10,66517,86404,1512,23004,29001,-1,4384,27716,124,288,34726,41,87,53591,15236,5437,5547,8211,812,91877,329,155,242661,10426,227,-1,-1,21054,-1,234,10,51859,12245,-1,-1,455,100532,152256,44533,375,5010,188,59788,134455,535,133,489,5089,19654,113066,766,339,1616,33392,24515,10712,44016],
                "aaAuoBDuAo@MUDKxAn@MPN,w{@u~BkAWAVEd@vA@B],}eAoaC[CANE?KdANBCTRD\\_B@O,clAagCD[iAi@EZKlAnAJ,khAewBSAARc@AA\\WDALBFvAFHg@@SSA,i{@k}BIAwAAAVP@?Jv@FATNF,ylAszBDq@y@E]C@ZDh@dAF,c_AkpBBkBUACp@a@CEtAd@W,mz@auB@Kw@KSAI`AnAF,skAm_CMA@OWC[CMXFf@t@F,_~@ezB?SmA?IAAX?VvAB,c~@axB@c@wACBt@H?fAG,q}@usBk@AA?CjB^G@IR_@Bk@,}~@wsBBeAs@CM?Cd@^d@HCT@,qlAkaC}AMAHGn@PDDH^@LYZB,kgAk}BmAIANOAC`@JNnAHBO,_bAm`Co@GOAG~@RBh@D,mgAydCc@Ac@e@CLMCGp@`@BGNRB^B@OL@,az@mxBFcA?I{@GEb@Gz@H@t@F,{x@ibCmAIQAEx@P@@IP@@Iv@F?C,yaAq|Be@AQ@?J_@A?NC`@dAD@UL@,kbAwcCi@O]R[KE^pAHD_@,udAixBAa@u@EWz@R??LR@?HPBP@,k`AewBcACCf@L^d@DBe@L?,kbAgzBCGeAEAh@@`@fADFu@,wz@odCEAmAKEp@hAH,{fA}qBUABk@S?g@??FLd@Kh@DDHBL?@SR@DSN?,gjAweCOA@O_@C@OOCEn@E`@~@H,c~@{wBgAF?LAb@r@BV?,cjAu{BKOo@EAFQAEp@VBJLR@AJPB,qz@qsBoAGOBFJCj@LCHMHBPFVKHH,{}@caCkAIEf@LRARz@F@W,e~@u~B{@GGXK?Eh@N@|@?@W,_lAk|BCq@u@GMAEz@x@DP@,g{@acCiAIAPGt@x@FDy@P@,u_AysBIB_@e@e@EGf@@^n@L`@B,meAcvB@SQC?ISA?MS??Je@BARR@ARjAL,mgA}~BmAIADBj@lAHBYD@BU,ccAubCqAIGn@N@ANn@DN@Hw@,oeA_tBAI{@F?TCj@T@J@P?@SH?,anAm_C_@AOZ@JERFZ@F\\BD{@L@,qdAg|BOA@m@m@ESEEACXCn@|AB,uiAafC]a@i@YEZNBAN^BANN@LB,}eA{oBIEDQIACe@KAALO?ERSAARM?B\\\\JL?NO,udAuzBBa@}ACCN?v@d@@t@D,{}@i|B?KQA}@?A|@lA?,oeA_dC}@YC`@MAANL@APN@ALN@ANZBFo@,q}@kcCDq@SCq@Gq@Pf@DVBn@r@,k`AswBI?Cu@?Wq@EDLGt@AXbAB,olA}aCMAD_@oAM?@Gp@|AL,u`Ac~Bs@Ii@E?LNBE^HLd@@@KZB,yfAsaC@OOA@MOA@QMA_@CI~@hAHD?,ehAstBwAGANFDGTPLTQLN?Gf@?,sy@k|BBc@y@E?HKfAz@F,{{@_zBcAEA^Ab@P??Gl@D,}lAazBeAGDRGHLZLP?Gj@ALw@,y{@axBIAm@E?FQ??D@|@h@@R@,shAwxB_AEI?M`@TBEVR?@Hb@@@S@e@H?,scAs~BSCQAE`@Al@N@^@?KPAIMD_@OC,sgAk{BoAIMdAAP~@D@IN@@SJ?,qjAoyBQC@KSAKMWCCPL@Mv@^CALR@La@H?,sbAoeCEEGD?HFB {_AqdCg@Ei@PMQYNh@N|@FLG,ay@caCw@GAHQAAHCd@F@bAF,mfAqyBe@AK?AROAAH?HI?Ad@R@d@C?K,obAiwB@YgAECr@QAARxA@,mbAysBaBEAn@bAFJKTE,ojAedC_AIGn@E^L@r@F,gz@ovBBi@u@GIfAv@J,k{@q_CGABe@QAy@GGt@jAV,_dAw`Co@E]~Al@DDa@P@,ebAauBM_@yAAATAb@@H`BD,_`AwcCMF}@GQ@E^AF~AJ,acAsrBKJcAGI?ARQ?Bd@H@EPHDRe@TJd@Z,g`AmaC@S_BKIv@n@Fp@F,u{@c{BOG@Uw@GCn@?RbAD,{iAg_CDw@c@CAQs@GAPEf@VBANL@t@J,aiAmcCSCFOa@CKnA@Pb@BHM,olAodCDa@oAK?@MlAnAL,yiAu}BCk@u@KOn@Bp@n@DBa@N@,k`Aw|BOA[CAJEl@MAATBFp@D@YH@,gy@i_CcAGKZFHC\\H@?Ix@DDi@,oeAmuBkAMIf@Bf@R??Uz@G,w|@{uBi@AW?CdAj@@NC,ejAuvBAIS?DWUCSA@M_@Bk@@?FJRd@\\NKL`@P@DN@MVE,agAcaCiAIILEv@lAH,ux@edCaAIOl@ALlAH@W,s}@ybCo@s@WCCXEt@ARjAH,m`Ae`Cq@GI~@r@HJ?FY@S"
            ],
            [
                "OK",
                4512794,
                2157879,
                "Adair|Alfalfa|Atoka|Beaver|Beckham|Blaine|Bryan|Caddo|Canadian|Carter|Cherokee|Choctaw|Cimarron|Cleveland|Coal|Comanche|Cotton|Craig|Creek|Custer|Delaware|Dewey|Ellis|Garfield|Garvin|Grady|Grant|Greer|Harmon|Harper|Haskell|Hughes|Jackson|Jefferson|Johnston|Kay|Kingfisher|Kiowa|Latimer|Le Flore|Lincoln|Logan|Love|McClain|McCurtain|McIntosh|Major|Marshall|Mayes|Murray|Muskogee|Noble|Nowata|Okfuskee|Oklahoma|Okmulgee|Osage|Ottawa|Pawnee|Payne|Pittsburg|Pontotoc|Pottawatomie|Pushmataha|Roger Mills|Rogers|Seminole|Sequoyah|Stephens|Texas|Tillman|Tulsa|Wagoner|Washington|Washita|Woods|Woodward",
                [52205,53980,81756,72140,46870,74612,79360,105368,76721,48744,48123,63112,117812,16740,35636,68810,47741,115225,41318,64181,89857,42513,63017,65380,63985,128974,43465,30197,35874,81608,62314,56197,25554,78668,33071,35154,61067,57647,38124,71586,65604,38706,23023,37797,70134,46475,77271,30427,71377,26465,65129,48908,53563,36944,12500,55920,150658,45939,36234,46715,72369,46008,43367,27801,55348,68419,26879,39856,61635,196160,46581,12176,32996,26312,83569,97482,61341],
                [282,23,429,-1,385,33,419,104759,2552,315,351,194,0,645,-1,267,91,69,737,6903,455,88,114817,49,589,20890,131,119,-1,66367,2237,226042,233,104,149,163,-1,78,3271,17357,890,671,58,511,111,122,-1,144,1979,95,272,282,71,25031,546,473,273,915,176,497,154,296,2419,127,-1,411,15204,368,355,-1,333,171,372,75,126,44,-1],
                "uEczAi@?ALKjACZz@?,~Lc`Ba@@i@?@zA?ZjAA,hA{mAo@?Iy@kAR?PR??lAd@?jA?,fZs`Bw@@_BBM@BxA?T~ACfAC,nUkuAkABASe@@@H@lAF?bAC?RR?RAAa@,tMgzAkA@@`BP?@d@v@A?y@,jBwkAa@IkA?Kr@WJHBv@Dh@Xf@e@CQFIMK,vM_vAw@@?d@e@@@rB~AAAu@AqA,jKcwA_B@@lA?FjAId@A?e@Ae@,|G_mAAq@e@??\\w@@AFQ??b@FVjBA,mCmyAO??SQ?e@A?tBx@??e@V?Ba@,AalAe@?qB??p@JENRt@K`@JVK,pe@iaBiDJA?FlBVArCI,lHstA_B??dBb@GJg@n@m@,|AonA?e@S??Sy@??RHx@n@?R?,`OioAAy@c@?_B@?f@Hd@~ARAU\\A,dN_nA_BS?n@@`@f@CJN`@Q,gB}_B{@?I?ChA@b@v@??SR?,lBazAw@??Ro@??n@Z??p@lA?AcA,zQ}wAcCB?x@?RdCCAI,oDo|AAc@aA?Ab@IjAh@?d@@,xQmzAkABw@@@lAbCC?m@,dUq}AeAB?~Ae@?@`@j@d@^Q?Sb@XAe@CcB,tJe}AqB@?~Ad@?lAAAcA,lH_qAcC@?n@n@BIXd@Ad@??e@R?,xJutAkAH?jB@f@jAA?g@,rJa`Bu@@{@?@zApBA,~TqrAS??ScAB[`A\\@BPj@?Hq@ZA,rUsrAS@?P[@Ip@@n@^ANOJBAi@,`Uk`BqA@M@[f@@r@v@AdAC,aB_tAS?QFa@m@k@\\?ZR??^jA??UR?,nA}sAsA??\\RV?|@x@??e@LD,zT}nA_@@Ao@k@?CQ]AQE@`@Q?HLXl@AVTYVFf@@,dKcmAgBB?n@?d@RSb@\\NI?UVAH_@,hDimAI??e@I?w@??RS??x@`@HDIv@C,`G_`Bw@@eA?@n@t@T?RfA?,hKezAQ?mA@@`B~AA,~QasAeCF@t@b@?@x@p@KIMP?Aa@PDZaA,uBkrAkA??XVR?d@pA@AmA,aEkrA?_@S??[y@BIQ?bB@l@?p@tA@?g@V??e@WS,jE_wA?q@}A@@bA?d@|A?,hHczAe@?Q@?d@e@H?p@~AA,|GijA?e@kB@EZ@?d@n@Hi@\\RL?DS,lHktAo@l@Kf@c@FUBOK@VbCA,yCalAASQ??y@S?uAA?fA?v@@`Aj@QnAm@,C}sA?SQ?Ig@S?aA??x@R?|A^,lOw|A{@ZO??OkA@@bAP?jAAv@A,hDelAw@BEHGJLJGHBPJGFRXCNUD[,wBo|Aw@??lAP??RN?h@??aB,tFqnAe@@HYo@C?HS??RH??d@H?P?@Gv@A,i@}wAS?KRy@IW??d@?XML`@l@PG?y@`A?,bGc}AgA?]DTLBd@S@?Pf@??Rd@?PA,e@}_Bm@?S?BxA`A?,nBeuA?e@mA??PQ??f@S??RrA??g@NNNA,jHawA_B@@x@?P~A?,`@kvA?q@[?e@?I?IbAR?Hf@P?R??g@P?,bC}_Bg@?{A??`C?x@n@?AMb@WRBIMb@ODY^VLKUM\\E?Su@U,mD}_BeAA?t@?T`A?,rDo|AMJ_@WEXc@NHLSCc@V@LD?v@?b@??SP??QRA,pFazAe@??Sg@?Q??Rc@??p@|AAd@I,NipA?}@SW}A_@?\\S??TZF@lA?PZ@jAS,hD}pAAW[LGHCK_@HGIME?d@?RR??d@v@??SR??I,lEstA?Q}A??LZA?pBZMNJTC,{@aoA[A?QqAAW??f@R??x@P?@RpB??mAS?,jUqxAc@Y?R_@Pk@e@?l@?bAd@A@RjACAk@,a@{{A?g@aA?S??RR??`BV?FSX?H?,nBwtAO@OO?f@FrAFH^IBJFI?qB,{CmvAy@?{@?Gt@?@HPx@Cj@]LM,zJyoAkA@S??d@@p@fBC?o@,d`@}`BqABwADS?DnBVA~ACfAE,rPuoAq@J?P]@@TGv@VDd@Qj@CBW@W,t@azAE?o@??y@a@?@x@I??x@HHd@??o@n@?,_@}wAII?y@Y?GRW?i@?LVC`@x@HJSR?,?}_BE?_@?BxA?f@`@?,|QouAeCB@pAdCG,nOe`BoA@@vB?NN?z@[\\}@XIZg@,~Rm}Aw@@As@YH]|@?lAjACd@?"
            ],
            [
                "OR",
                1200296,
                9813,
                "Baker|Benton|Clackamas|Clatsop|Columbia|Coos|Crook|Curry|Deschutes|Douglas|Gilliam|Grant|Harney|Hood River|Jackson|Jefferson|Josephine|Klamath|Lake|Lane|Lincoln|Linn|Malheur|Marion|Morrow|Multnomah|Polk|Sherman|Tillamook|Umatilla|Union|Wallowa|Wasco|Washington|Wheeler|Yamhill",
                [67278,6645,13391,4102,6250,24272,47878,6258,12246,40215,10778,32019,81697,480,17896,18662,6161,54839,75145,22749,2592,23930,181486,27549,183667,1276,12349,2726,38457,65169,33358,25639,17134,5568,12206,18229],
                [24,183,1487,33,264,121,71,-1,493,644,0,60,105,35,716,171,139,46,-1,1133,72,433,328,694,77,105,272,0,30,129,432,175,-1,831,25,249],
                "pkBidDUOsA^EQk@HiAPZn@bA`AFf@h@IFc@z@Mp@^f@Im@_AXa@e@A,neCqiDcARGP`@JD|@xA[Q[QB,z`CqlDS@ESmC^KVDXDh@XDC\\dB[h@eAMYNC,dbCwsDI?I^TlAxA[Us@De@m@N,paCwrDW@O?W^Ct@BZXEJQn@M,tjCacDs@NEl@JhAVLJj@x@JC}@f@O,fzB_dDQDESWFESaAPDZw@LONBPc@FPjAPCNv@PEv@MHi@v@OCQb@IIe@PE,hmCa_Dg@NB|@y@KMDjAdA]j@Rp@|@SL}@YwAHm@,x}B_dDA_@oB^Lt@QDHd@c@HBPw@NIh@w@LBR~E{@fB]Sq@m@k@,ziCudDiAB[f@q@TJr@y@NDT}AXMl@\\`@\\EBNdADVPfACfAg@LEKk@WMKiADm@r@O,|tB_lDoAC^tB_@ZHTjB[?COeA_@U,hrBgfDmARaBVg@PNh@d@@Y`@l@~@g@HHn@zAWBP`C_@QkA,vuBe}CCSQDOw@QBaC^CQ{AVdBzLrDk@D?i@cDzAW,v{BomD_A?IH^zA^GEYJWHO,tgCq{CgABWQeAE|@rEtCi@,~|B{fDO]qEz@Pt@`AQDRVGDRPEnB_@,|iCy|CgAf@l@tCj@Kn@MSq@\\k@,ldCquC}@sECO]D]a@Lm@GWUGgB\\t@xDiARj@`DxAW,v|Ba_D_Fz@v@vD{AVh@bDdBYjCe@k@aDhAS,xhCkgDs@LyAZ@Pg@JIQeAd@{ANB`@l@j@Rp@TFFV|AYEUx@OKs@p@UZg@hAC,vfCilDi@JR`AQHPz@PCPZr@M,jcC}hDCEORaAEuBx@Vz@@^zAOdAe@HPf@KAQE}@a@K,rlBq_Dq@_@{@LGb@i@Hi@h@NJCLL\\Nh@rAnJzDk@eB{L,fbCekD[g@OHOBLXi@dAeBZDHN\\tBy@`ADNSKKJMYK,lrBclDSAeA@N`A[FDPOB\\nBlASPCCOIU^[,j`CioDYD@PKJw@\\w@GDZINlC_@EQRa@,leC}kDAEcB\\DZXJKLJJBDbASPI,`wBelDo@ISNIf@^TNdA`@Ib@g@m@w@,`eCeqDyAZBNREU\\b@\\Ll@n@MF\\G@@Dh@K,roBclDgAAuCb@A?D\\\\^Jn@p@C@Nh@G@`@OBDl@`BW]oBNCEQZG,xhBcjDa@FLb@AhAQp@_@FBPj@IDPrA_@TNf@QEm@NCAa@i@FAOq@BKo@,rhBakDy@LQBsARK`@[VKf@r@`AVf@hAQCQ^GPq@@iAMc@`@G,l{BqjD_@F_@{A_@LANi@@E^l@v@c@f@a@H?BEx@pE{@EIB]YE,fbCipDo@LKPBPS`@DPDRRA^c@p@Mc@]T]SD,bvBwgDkBZBNQBb@rCb@GCQNOv@ME[Qu@,lcCcnDq@L_@b@?LNIZf@bB]FAG]o@L"
            ],
            [
                "PA",
                1335451,
                1342066,
                "Adams|Allegheny|Armstrong|Beaver|Bedford|Berks|Blair|Bradford|Bucks|Butler|Cambria|Cameron|Carbon|Centre|Chester|Clarion|Clearfield|Clinton|Columbia|Crawford|Cumberland|Dauphin|Delaware|Elk|Erie|Fayette|Forest|Franklin|Fulton|Greene|Huntingdon|Indiana|Jefferson|Juniata|Lackawanna|Lancaster|Lawrence|Lebanon|Lehigh|Luzerne|Lycoming|McKean|Mercer|Mifflin|Monroe|Montgomery|Montour|Northampton|Northumberland|Perry|Philadelphia|Pike|Potter|Schuylkill|Snyder|Somerset|Sullivan|Susquehanna|Tioga|Union|Venango|Warren|Washington|Wayne|Westmoreland|Wyoming|York",
                [22905,1613,14689,5011,41483,62607,48058,43450,6638,13886,12285,262,1098,20375,26190,14262,4718,15031,6839,32368,52975,11141,0,1682,8883,15160,666,120078,15275,9670,36109,21971,8367,23738,2752,182218,14986,57001,3510,2322,10037,3075,18655,21070,461,1716,4939,3208,16172,33330,-1,-1,14569,9379,16199,34025,1806,16920,23965,19457,3877,7060,22969,9130,20792,4321,35783],
                [13120,197,340,1312,36245,73042,976,42341,899,652,339,0,66,3250,14103,710,-1,-1,22317,1278,37900,21939,0,26,302,670,32,74899,44468,287,17056,548,290,22975,95,322153,660,55631,4661,286,29871,130,447,69457,155,140,750,273,16938,102816,-1,-1,138,592,71285,16688,23,505,60945,70632,163,92,837,644,1280,159,61131],
                "m`Ba~Bq@g@a@VCp@b@Df@F,ypA__C]c@@MiAKHTQ^Pv@,msAkdCQf@_A[E\\E\\\\|@l@W,qoAoaCy@IIf@AL\\b@XBDc@,{yA}~BCS_@J?KYFCMWXThBfAJ,_eB}bCaA_@O[eAd@Pr@VZt@[,{zAqbC@Ag@GLNUf@Jj@BLXG?J^K,m`BwlCy@KcAMSjALBAV`BFH?,sjBmdCSUABSDIZWJk@`@b@^@OHAxAk@,mqAkcCMWq@GQlBhAJHg@D_@,axAu_COmAiAMZ~ABR`A@,kyAqhCa@I_@ZIACVHb@V@He@ZB,chBahC_@VJHWXRHTPn@]e@_@HO,}{AyeCQYCNo@HWVw@[Zp@l@b@h@N\\Cf@FUw@OALa@,mhBcaCW[OCo@\\\\p@AFX^x@J,msAkdCYu@MA@K]CCTI|@~@Z,ixAkcCHq@MQGMcAEWAKJJHM`@N@Tv@A@hAL,q{AefCIc@BW_AM{AjA?Dv@ZVWn@IBOPX,acBggCY_@SMa@jARj@\\Q?QTQ,mnAkhCqCWIp@b@DT`@tAL?A,ybBiaCMTf@h@p@f@`@s@c@a@DN,ebBicCg@M_@NRT_@x@TTZQLURC,ekBeaCQNIF@LG?\\R?@^A@G,svAehCwAKGj@[CId@bADFLp@]RHAYQ@,gnAgiCoBuAIz@YCC`@pCV,gsA}{BQOBQq@?SO_@PLj@IZLBn@FXBHk@,ysAugCyAOGh@PA@XPDBU\\BAJL@,o}A}{BWqAQq@CEMPa@r@Kn@@?,_|As{BUiBq@LVpAh@F,qpAi{Ba@Ss@?MJIj@rALP@,}{Aw_CKk@Tg@MO]Bi@OVnA[?KTPp@p@M,muAe`C]}@D]cAIGf@NlARH,_vA_dCH}@QESIq@\\LPIp@bAH,m~Aw`C_@}@]W{@@@@b@PbAnABD,_gBqkCi@IUrAHFJPTc@ZM,ydBw`C}@g@u@ZVbBNB~@}@`@G,goAkcC}@GGFFPE^x@H@I,mdBgcCQHw@\\|@f@^y@,ehBieCUQYXO??JMFP^HEdAe@,odBuhCAMeA[[LUb@DJPHINd@^b@A,s}A}hCsBc@I?Qd@w@RX^N?XJH??LXHzAkA,kvAyjCaBQOAOpA`@HvAJ,goAmcCLmAuAMKdALVFG|@F,i~AgcCm@c@CFCVKA\\V^|@Z?,ihBmhCKQWEc@KAV[DL^p@l@VYKI^W,eiB_bCQs@IDyAj@JTXBKFHHPOn@],qbBggCO?GRUP?PDKRARF,oiBefCq@m@MNL\\E`@RTLG?KN?XY,gbBkcCKy@NKJi@YK?p@SGS@EJ]Pn@d@f@L,}~Ag`CcAoAc@Q?z@SBnA`@EOb@`@,{lBabCI@ANJLHLAJJFF?AMHGIIJGYC,ojBalCMTg@DML`@~@@BZE@Wb@JB]KC,}yAmkCiAMUEUbBCL~@LH@^[,}dB}dCSk@c@@o@\\RNNZ`A^PI^O,{_BcdCwAa@Jx@z@AJ@,{vA}|B]}@aAABtBRBjALH[,qaBajCaBG@d@@LRLv@S,kdBqmCE?cBUSjAh@H~@J,}|AalCgBSGAYtArBb@,w_BkdC[q@?EYI?MI?Kh@OJvA`@,oqAifCUa@c@EOCMr@Xt@p@F,_sAciCBa@wAOWCGrAxANNB,opAu{BD_@Fu@@OYC{An@?NCPPNr@?`@R,ihB{kCRkASCi@V[p@Xx@JBC\\VDIG,usAo}BQw@P_@IUm@V_AXSIFX\\|@^QRNp@?,sdBijC@WMC_AKFp@dAZ,gcBs`C[Pa@F_A|@v@Jb@Fb@FBq@`@W"
            ],
            [
                "RI",
                3871,
                1213,
                "Bristol|Kent|Newport|Providence|Washington",
                [150,243,1573,1073,832],
                [-1,20,68,742,-1],
                "w|BoqCCII@KJBLLG,szBypCs@OGIGBGHDHLLn@LBG,y|B{pCEIMFCMMBK`@HJNA@FPB,azBwrCo@MQEAFUh@BHFCFHr@N,k|BgmCCQEAIPJB _{B_nCCWFg@o@MMMCj@BR"
            ],
            [
                "SC",
                305414,
                153888,
                "Abbeville|Aiken|Allendale|Anderson|Bamberg|Barnwell|Beaufort|Berkeley|Calhoun|Charleston|Cherokee|Chester|Chesterfield|Clarendon|Colleton|Darlington|Dillon|Dorchester|Edgefield|Fairfield|Florence|Georgetown|Greenville|Greenwood|Hampton|Horry|Jasper|Kershaw|Lancaster|Laurens|Lee|Lexington|McCormick|Marion|Marlboro|Newberry|Oconee|Orangeburg|Pickens|Richland|Saluda|Spartanburg|Sumter|Union|Williamsburg|York",
                [14112,9085,3976,32033,6891,2493,427,496,1468,1438,7210,13792,7591,3060,4668,2858,3380,1959,4823,3266,1422,414,4645,9345,616,4517,436,3999,9382,19579,2099,4921,2227,1614,1301,20360,11439,6110,6304,2493,25964,11881,6266,7125,1684,14245],
                [201,605,-1,545,181,107,-1,334,142,75,53,170,119,26174,665,104,63135,-1,100,-1,196,0,877,110,236,20065,208,44,191,116,230,596,-1,-1,2951,290,304,-1,541,299,132,401,558,118,-1,-1],
                "qjAwqAcAeAMNLNSXHb@b@BHL,ioAqmAy@iAKO_@Zm@JZf@|@jAPG?MPE@Y,arA{jAKQa@D]EWNVV@VVV`@}@,qiAmtAy@u@Sx@UJbAdAHMTe@T@,}sAsmAw@T_@VNLALHGVRVO,cqAokA}@kA[FOdA\\D`@EJP,yvAshAEI]@c@\\GDG`@VNVGFFUL^d@`@_@?O[U,ayAemAQK?a@SMWE}@`@k@L^Xd@hAp@c@\\O,utA{pAk@R_@AQRIPH?FVf@WV@TQSOPADF,ayA}gASAJkAo@?HGOGL[q@b@e@iA_@Yc@LJZf@FENbArApAh@,mnAcyAQAgAG@ZLBKh@n@G,_qA}vAgBOMz@`BH,owA}wAgAIa@d@FRb@Lf@b@\\s@`@g@,swAuoAKUmA}@UJZzARL\\DVU,euA}jAWSIF@MOM?Ac@Ri@AEh@KjAR@b@]\\A,exA{tAg@c@c@MO?Wj@`Az@PMEGPc@HJ,_|AauASkAoAx@FJn@AXR,uvAglAo@i@CJW?Q\\]NMZNFIFn@?Di@h@@,wnAopAEASEMTc@Dx@hA@CPGAIPOIYJS,sqAguAaBICPUNDX~@RCHZIZu@,wyAesAaA{@E?QJMr@i@b@`AHb@ITKMKTG,k~AyqAONICUZQC^jBb@Mj@M,qiAuwA_@Se@OWCIlAOJRdATKRy@Ni@HBAO\\H,cmAmsA}@b@OLRh@D@d@GHJFSIc@RY,ssAuhAWWAWWWy@~@DHBHXYh@t@RG,{~AguAGKyA~@WPd@X`@p@PBT[d@s@,qtAmgAi@u@YXCIOz@ZT?Na@^@Hl@KHW?W,ytA_uASUCLc@KDKWO]r@VT@XTRPH^SESEY,ktAwxAMd@k@Ea@f@VNEJb@JBMRTBQL{@Hw@,ulA}sASeA{@`@e@Fh@nA|@c@,kwAksAAYWUIFIKQb@DFQLMFZX\\W\\A,{qAyqAMAHIOQMRk@NKVB\\EGQ@RNVNl@K^[,qkAmpAIMc@CGRIKe@FRHKRHXQN@HRQVYn@W,q|AutAYSo@@ZdAe@r@HBNO@Ch@c@,wyAgxAi@Go@^A@RjAD?Vk@N?GS,aoAirAi@oAUNSM[t@@HNPIHL@r@QTD?H,ugA{vAQGQIDN]nATb@JCHGn@Y@G,asA{mA[g@WOUPWAg@VGWI?WT]E?`@PJV?BKn@h@?@^Wv@U,yhAmwAWGCD]I@NICOh@x@t@\\oA,qrAasA[HBI_ASDR_@RQIKlA^@j@SJWj@OLS,qoA{qA?IUEs@PJl@JNb@ELURD,olA}xAk@CQAe@v@LhAz@a@NK,uvAwrAUSAL]@]V[YUFLJlA|@JTPS,soAkwAo@FBDSt@ANRLTOd@G,c{A}qAc@HaAIABl@rB|@a@VD,gqAmyAG?s@CCTOQEFIv@fBNCEJi@MC"
            ],
            [
                "SD",
                3478908,
                2039066,
                "Aurora|Beadle|Bennett|Bon Homme|Brookings|Brown|Brule|Buffalo|Butte|Campbell|Charles Mix|Clark|Clay|Codington|Corson|Custer|Davison|Day|Deuel|Dewey|Douglas|Edmunds|Fall River|Faulk|Grant|Gregory|Haakon|Hamlin|Hand|Hanson|Harding|Hughes|Hutchinson|Hyde|Jackson|Jerauld|Jones|Kingsbury|Lake|Lawrence|Lincoln|Lyman|McCook|McPherson|Marshall|Meade|Mellette|Miner|Minnehaha|Moody|Oglala Lakota|Pennington|Perkins|Potter|Roberts|Sanborn|Spink|Stanley|Sully|Todd|Tripp|Turner|Union|Walworth|Yankton|Ziebach",
                [39817,79222,53176,43798,78535,41937,78576,31342,82012,28084,77246,49352,8438,39781,103283,27988,16720,23951,58355,71834,33117,43510,76659,51884,74602,75165,63364,41153,91822,20056,77072,22308,56463,57894,51292,37930,46663,41870,28139,23073,31311,62008,30338,68182,77507,132866,64598,36086,73035,43176,42001,62931,105283,17832,35068,34027,76093,22350,33608,57096,145705,49307,19046,31201,35951,44819],
                [-1,56997,-1,-1,119605,-1,25033,0,82,-1,174817,146975,-1,15382,-1,-1,119558,2024,-1,0,87020,51935,156,71228,24920,-1,-1,15777,-1,76816,0,-1,129286,-1,210,-1,-1,-1,92699,54,53788,-1,77207,48023,51078,161,-1,-1,32361,68508,69,52,75,-1,11516,-1,47063,0,-1,0,13775,79976,-1,-1,20190,0],
                "`MspCmA??R@lA|@AL?,jLouCqBBS??R@jAjAAx@?,v]smCmCFDvAhCG,|I}hCMgAgA?@fAb@C\\T,pDutCe@?cA??lAdA?d@A,fLq~CoBBC?@jA?lArBC@?AmA,vOwpCcA@Q@?~AnAAJc@NC[g@,xPqrCk@?{@@@x@bAAAI`@[,rf@oyCGo@gDL@d@F~A~AElA?,xT}~C_BBW@@lAnBESS,pOumCoA@M??\\}Af@EFLfAVI^Yx@e@,vH_yCmA?@lA?x@x@??SR?,zDqjCe@@S?@rA`@KVG,hF_yCi@@u@?@f@?d@~AA,b\\i_DA?eFJA?Yx@RRFJUNnDIrAC,fg@qqCyENTb@^N@ZhDM?C,rJ_pCw@@?lAV?`@A,tHsyC?mAuBH?x@?^h@AlA?,jCovC?e@cA??d@?d@?RbA?,tY}{CoDHIp@Dr@PC@\\TZTMFJ`A?Cu@x@C,rLsmC}@@a@@@`A|Ag@,`Qi|CwCB@lAbCCTA,ng@_oCiDLFhBpAEvAE,nP{yCcCBA?@lA|ACh@A,~D}yCuBEAJ?`AbA?Ag@t@?,vPwmCe@@aAlAy@d@xBCl@A,v\\kuCkAG_Ae@J`CS?Dd@tCG,jFqvC_B@?x@d@?x@A,hOmwC}AB?x@@`Bb@Az@A,zH}oCS?e@??lAx@?,~e@a`DaDJI@N`DfDMKsC,lUguCgCD@hAGXj@GFOGIhBu@,rIomCW?y@?_@@?hAd@AfA?DG,bQowCO?i@@BzCj@?LEAiA,v]yoCQ?E_AuCF?b@ZHBvAlCG,pMorCc@@y@??x@lA?PA,hXqqCEe@kBD?bBf@KVJp@_@,dHwtCy@?y@@@jAd@?jAA@?,xEirCe@?e@@?jAd@?f@?,zf@qvCmA?DjAQ@@X~AGAI,rCmmCs@?KXDZMHA\\v@?R?,rRurCGNk@FFYMDARa@Z@HEPZf@OBKb@d@AN?@{@\\N|@GPA?cB,`G}oCe@@g@?@lAj@?^A,`Qw~CoBBi@@@jAvCC@?,rHm~CuB@@rAtBI,ld@qvC_BDG_BuCHFtBPLXCTbAhDKAYPA,hXmpCq@^WKg@JQ@@fA`DGCwA,dHkrCkA@@lAd@Ad@?,rD{oCe@?eA??lAV?r@?`@?,lCgrCeA??jAdA?,ba@}oCkBB?dA@vApBG`@CGiBA[,bg@qsC_BFiDJUcAYBQMFpBD~@P?jBCUc@xEO,ba@qzCOaDoCHDfBD~AtCI,zSazCuABU@BjAN?pBCA]QB,|Dk~CeB?BXb@b@@NWd@_@RtBD?y@,rJmrCkA@A?@lAR?v@A?S,hLwyCsBB@R@rBpBC?y@,jXyvCaA?OL@^MBFPiBt@FHbABjBER?,tTswCqBB@lAfCELCA_@NMGKUL,hYkmCaDF?vAfDG,dTkoC}@F]OAz@O?DnBhBC?wA,`FmmCk@?a@?@|Ad@A?Qd@?,`CojCw@?Ld@Lh@Wb@EN\\GJ]PI,rTo|CoBDA?BjAtACHq@TO,fGekCe@@e@??P@`ATO\\@V?,n\\ayCE_BsABJhBy@BBt@~@d@jAF"
            ],
            [
                "TN",
                1636047,
                281105,
                "Anderson|Bedford|Benton|Bledsoe|Blount|Bradley|Campbell|Cannon|Carroll|Carter|Cheatham|Chester|Claiborne|Clay|Cocke|Coffee|Crockett|Cumberland|Davidson|Decatur|DeKalb|Dickson|Dyer|Fayette|Fentress|Franklin|Gibson|Giles|Grainger|Greene|Grundy|Hamblen|Hamilton|Hancock|Hardeman|Hardin|Hawkins|Haywood|Henderson|Henry|Hickman|Houston|Humphreys|Jackson|Jefferson|Johnson|Knox|Lake|Lauderdale|Lawrence|Lewis|Lincoln|Loudon|McMinn|McNairy|Macon|Madison|Marion|Marshall|Maury|Meigs|Monroe|Montgomery|Moore|Morgan|Obion|Overton|Perry|Pickett|Polk|Putnam|Rhea|Roane|Robertson|Rutherford|Scott|Sequatchie|Sevier|Shelby|Smith|Stewart|Sullivan|Sumner|Tipton|Trousdale|Unicoi|Union|Van Buren|Warren|Washington|Wayne|Weakley|White|Williamson|Wilson",
                [6438,51325,4252,21005,26823,20552,6741,11960,8345,10499,5856,6923,29322,12926,10985,27078,5921,24145,3911,8084,16551,16994,6348,15031,35972,14917,13393,55682,21415,61044,5185,13066,8569,12418,8461,10826,28323,-1,17529,13907,17856,13611,15801,11235,23159,5069,11623,-1,8168,42232,3855,69050,17111,25748,8537,24544,4693,6633,31166,38692,9219,31274,21537,20482,12591,12678,34160,2450,9704,6819,16089,10940,7164,32165,19867,2236,7423,9291,-1,21816,5742,24321,27025,7542,8863,472,10697,7639,31722,38648,26309,13219,31416,24064,26792],
                [75,153,187,63,89,66,49,149,-1,14,19,6,112,67,216,209,-1,1594,100,-1,36,261,-1,-1,164,101,96,208,179,289,24,179,50,12,322,205,339,7,561,116889,153,77,180,113,532,33,181,168,-1,1481,111,555,188,2059,290,89,57,135,337,331,45,44,27392,-1,83,20515,1970,148,26,96,48,-1,181,197,215,0,150,50,92,116,142,115,123,144,14,0,90,91,1478,149,-1,74395,97,250,157],
                "g_A_~AIKWDAO[?COEDMNV\\GDVLJRN],ks@iyAQCYLIIQDCn@ZVREL?L[,kj@q{AS_@BUQAA@GVGVNd@QDBT@Dd@CD?,gz@eyAYo@{@E\\l@?XLXb@[,aaAu{A[SYDIK]f@AZn@\\HQb@IGI,e}@qwAKO_@TDx@D?\\BL_@,{_AaaBEAi@CSb@Lb@DEBNZ?@NVE@w@MK,}u@m{AWCYVP\\CJPBTI,wg@}zAYUy@@C|@E?ADjAJP@,yjAeaBSC_@[F^YRJ`@HDXGLSH@,ep@m~AYPKCNlAV?C[HOEMV?,gg@mvA[OIUSLY@AP?Fp@FJXH@,kaAgaBI?k@Ic@COJCZl@TJ?NQND,mw@i`B}@EWCC?ARZJDTf@WRF,_fAi~ABGKA?Kw@n@F^p@XLg@,wu@swABo@EQUHQCUZ?t@l@KPFBK,ed@kyAKAM[IFETc@JN\\HCr@W,}z@{zACA@WDO?YYKa@Gm@p@NTTNz@D,kq@_~AQDIM_@^Q^N\\v@KRN@K,wj@myA@Ee@BHTOh@JPGDE@HB\\DFI,iv@m|Ac@CGI_@T@HGZFBb@@XW,}m@g|AEc@g@?W?DLINBZ@Rz@A,mb@m{AYA?Cy@C@l@LZJ@HMj@JPSW_@,yb@wuA[Gs@ACxAZ@r@B,i{@g_BGa@QGe@FQZFDZT@\\`@FB?,qu@suAEm@QGm@JGLGr@nAF@?,ae@w{Ac@Eq@^A|@d@?b@KDUHG,kp@gwAm@?Y^Cz@bAD@?,kcAw_Bm@US@GTL?R\\L?TNCHLQ,gfA__BMO}@m@KCEz@IH?L\\LBNL?,ww@}vA?u@o@EYVJTXHBNV@,ueAu_BMMQRLN?JJ@CFFGb@ES],mz@cuAQUDOWo@MYUF@FQPJb@M^@?p@DP@,edAuaBuAI[CRLJAh@j@RAB[,ie@avAQIk@AMf@Av@D?`@B`@@,}i@ivA?GUCGH]EOtAf@DZ@B?,meAk`Bi@k@K@SMe@EFd@@D|@l@PSLL,mc@gwAMu@I?s@VAx@PHr@@,kh@ayAkAKBvATB@QXARM,mh@a~AE?kAEM\\P@CTR^x@A,im@yyA?O[U{@@?XB`@LHRJVEJHNI,ok@g}A]@QIUA?DM?Db@j@KXB,wk@o|AYCk@JGf@ZT?NVHRECUPEOe@,kw@y~A?SSGg@VATHPf@@FC,scA}}ABIUOM?c@DGFFj@\\Ad@SFK,mlAebBW[_@CBD@l@EHV@JL@DXS,_bAo~Ae@?MPFAGJCHTXHJXEZRRQ@AKSWMFE,{b@q|ACGDYa@C?TRl@?BX@JGCCK?GGHEAG,ob@myAk@KIL?LH?Lt@TM\\DRTDCIOLMEMa@M@M,kn@yvAUE@I[@O?E`BbAB,wm@gxAKIWDSK?NOPBLZAAHTDLOL?,sr@gvAM?WYM?AHYLEVGAC^rAFH?,{~@gzAe@o@?MKASPI`@FHRGd@@@H,u~@gzAE?K@]~@NJb@L^U,ug@euAIAKYq@GCtAhAD,cu@e`Bg@Aa@A@Z?RX?`@AJG,ye@exAIBO]e@?QAAl@HTZNj@@,_x@ovAWACOYI]PENENPTV@l@D,yq@gwAOYGi@QAGB?j@MZVXL?,oo@wxAMICa@oAVFh@NXl@?N?CMNQ,u|@kxAEMKDGMBKMA@[IC@MSFALb@dAJNPQ,caAizAc@HIPHLAXJHTAHNf@KOK\\_AAIe@A,gm@m_Bs@Eg@CAh@X`@f@?L??E,gt@awASD[WBDCJDl@F@DWXM,s}@g_Bs@f@SVv@d@l@q@A],{c@w}AyAEA?CRV@Ah@b@Dx@BSm@,gy@}~AEU[K_@VEz@dA[,{k@oyAAESDWI@f@OHF\\p@PFEKQNi@,gz@s`Bu@Ca@AINd@GPFF`@^W,k~@quAEy@c@Mg@J?p@t@D,ww@s}Ag@AIQeAZC?XJ?XFId@GTP^U,}|@{zAUOKLALHBAZL@CJFLJEDLTG?Y,s}@k{AOUw@e@O\\A@J@?Ld@n@D?@MRG,cp@w_BI?s@Ec@APt@J@HLPEJBXQ,cs@myAKSDg@O]cAXBv@DPPEHHXMPB,_}@y`B{AGAPLJAv@HJr@g@GEP[,qy@{xAUIENc@ZVn@DO\\QKUXW,acAo|AUYBIe@R]@Mf@?@d@b@\\B@[,c`@yuAKAiABCtAL?hBDW]M?B[JE,wu@y}AY_@Y?C`@GB@VFHb@B,yj@o_BcABIAMz@T@PH\\A@AL],}hAibBw@GG?QCu@KVZ^ZRBTGl@H,es@_`BYCc@A?`@DF?V\\DJLDGDN^_@KA,_a@}vAEBSU]EULGf@ZFhAC@],cu@c_BKFa@@X^LIFHBI?W,oiAm~A?MIKQEKUIAMR^VJTFFHC,qaA__BMc@OEOPK?Df@d@?,cy@uzAM??EGAc@C?DCDXn@TH,ow@yzAc@AODMx@H@n@DT[BK,uhAcaBm@IUF@`@JTPDHJHID{@JB,yk@qvAICDAq@QM?MNAvAbAD,wf@}}AA?s@CClAXTp@_@@i@WA,sx@{zAGCF[AIUQe@FGHENAVB@?Eb@BF@?DL?,ap@}zAASW?AJSOw@JEf@JRP@nAW,gs@g}AEOEFKM]ECHGIMHQj@KZVBbAY"
            ],
            [
                "TX",
                12543300,
                1188820,
                "Anderson|Andrews|Angelina|Aransas|Archer|Armstrong|Atascosa|Austin|Bailey|Bandera|Bastrop|Baylor|Bee|Bell|Bexar|Blanco|Borden|Bosque|Bowie|Brazoria|Brazos|Brewster|Briscoe|Brooks|Brown|Burleson|Burnet|Caldwell|Calhoun|Callahan|Cameron|Camp|Carson|Cass|Castro|Chambers|Cherokee|Childress|Clay|Cochran|Coke|Coleman|Collin|Collingsworth|Colorado|Comal|Comanche|Concho|Cooke|Coryell|Cottle|Crane|Crockett|Crosby|Culberson|Dallam|Dallas|Dawson|Deaf Smith|Delta|Denton|DeWitt|Dickens|Dimmit|Donley|Duval|Eastland|Ector|Edwards|Ellis|El Paso|Erath|Falls|Fannin|Fayette|Fisher|Floyd|Foard|Fort Bend|Franklin|Freestone|Frio|Gaines|Galveston|Garza|Gillespie|Glasscock|Goliad|Gonzales|Gray|Grayson|Gregg|Grimes|Guadalupe|Hale|Hall|Hamilton|Hansford|Hardeman|Hardin|Harris|Harrison|Hartley|Haskell|Hays|Hemphill|Henderson|Hidalgo|Hill|Hockley|Hood|Hopkins|Houston|Howard|Hudspeth|Hunt|Hutchinson|Irion|Jack|Jackson|Jasper|Jeff Davis|Jefferson|Jim Hogg|Jim Wells|Johnson|Jones|Karnes|Kaufman|Kendall|Kenedy|Kent|Kerr|Kimble|King|Kinney|Kleberg|Knox|Lamar|Lamb|Lampasas|La Salle|Lavaca|Lee|Leon|Liberty|Limestone|Lipscomb|Live Oak|Llano|Loving|Lubbock|Lynn|McCulloch|McLennan|McMullen|Madison|Marion|Martin|Mason|Matagorda|Maverick|Medina|Menard|Midland|Milam|Mills|Mitchell|Montague|Montgomery|Moore|Morris|Motley|Nacogdoches|Navarro|Newton|Nolan|Nueces|Ochiltree|Oldham|Orange|Palo Pinto|Panola|Parker|Parmer|Pecos|Polk|Potter|Presidio|Rains|Randall|Reagan|Real|Red River|Reeves|Refugio|Roberts|Robertson|Rockwall|Runnels|Rusk|Sabine|San Augustine|San Jacinto|San Patricio|San Saba|Schleicher|Scurry|Shackelford|Shelby|Sherman|Smith|Somervell|Starr|Stephens|Sterling|Stonewall|Sutton|Swisher|Tarrant|Taylor|Terrell|Terry|Throckmorton|Titus|Tom Green|Travis|Trinity|Tyler|Upshur|Upton|Uvalde|Val Verde|Van Zandt|Victoria|Walker|Waller|Ward|Washington|Webb|Wharton|Wheeler|Wichita|Wilbarger|Willacy|Williamson|Wilson|Winkler|Wise|Wood|Yoakum|Young|Zapata|Zavala",
                [54772,11360,11778,2099,74444,38091,65442,61617,128705,5300,46801,44569,30262,51483,31702,15356,13175,47253,59834,59766,51794,23891,45616,19494,34968,61788,24265,35822,12737,33909,9645,22087,13539,20089,582951,26562,59225,12243,92997,2743,9461,40787,34815,19168,57206,7011,117228,17922,92296,63294,23792,3756,23971,9286,26107,383651,14533,3358,700069,14106,28204,67343,22739,9447,63103,33716,37464,4176,12599,47461,5163,171459,129740,63752,99412,18749,53490,19264,33343,37932,62639,52999,7672,5660,8286,31872,5716,44083,143254,116562,40648,3240,104709,44026,121898,13131,64695,285421,26392,5648,18651,21767,420346,19706,7610,57869,62098,33018,51427,7559,15773,110911,108126,7984,16235,57253,25693,10143,48900,48120,10724,31511,34491,20377,28174,39647,45271,53100,55746,13015,39360,11954,7949,8368,18191,7753,25092,21063,88004,156623,27057,11909,106235,91280,87738,41968,76331,40724,28697,35347,2786,38032,8592,18035,86476,13132,39479,4299,3238,34001,52774,18555,37161,16057,7025,99601,26402,24981,73289,17479,185142,8984,14678,37058,66651,3850,22865,6983,72429,104225,7563,47357,27630,44486,362742,25933,8850,38219,33956,18084,231146,10227,3680,78680,12515,24249,19573,96180,3519,36974,40965,4631,6827,12561,12462,40951,18108,13554,23795,43650,255969,43997,6787,50623,18280,11451,19415,12242,196293,11881,13457,5068,13296,44997,27565,30095,23331,14074,8766,43452,3960,37831,11537,94140,58674,34419,41576,4703,57182,45607,55612,60799,31475,31054,13909,44765,110390,5565,53333,38019,10656,41200,12345,38198],
                [-1,46,317,-1,42,25,474,161,247,439,290,20,67,1129,2361,156,69,898,196,2600,1188,-1,24,35,530,469,168,144,95,171,299,192,50,380,1167,74,264,0,34,-1,315,36,654,13,1239,138,95,0,390,722,-1,0,0,36,0,-1,88,490,-1,16,484,157,44,0,0,1032,398,50,122,524,55,1025,103,246,1199,33,-1,-1,36,158,180,11,126,76,-1,540,-1,96,404,-1,791,360,582,1258,521,0,149,-1,67,317,188,414,0,-1,243,713,680,887,556,96,339,582,2613,29,12,777,40,0,1182,16,127,0,288,-1,202,592,371,16,1061,360,0,46,592,12,0,12,90,60,309,79,1295,104,421,217,315,538,680,62480,493,371,0,2005,96,77,453,-1,-1,-1,-1,62,51,475,693,-1,82,669,157,157,319,2900,-1,516,-1,394,533,442,111,331,-1,0,208,147,214,536,7,6,75,568,0,241,2092,0,420,19,25,0,0,154,148,219,484,99,90,57,504,3156,-1,77,60,579,-1,437,20,166,26,6,218,-1,30,112,691,0,122,0,82,790,1147,182,362,165,-1,101,6,978,238,2973,369,74,903,300,506,-1,119,84,143,493,259,-1,757,301,56,720,20,-1],
                "H_}@uBQBt@a@t@vARCWL?b@e@,dh@ebA}CJD~AL?~AEp@C,{D_y@YWeAXa@f@e@Z|@NREt@QTu@,zCoc@Jx@d@p@H[FJVe@m@WRS,|OajA_BB@pA?N`BC,t^ctA_BDD~AdACZA,`Pcj@mA^g@r@QTn@d@xAKAaB,vBko@{AEKLFd@QVAZL?NGNGNc@L@\\],dg@qnA?AmADDjBnAC,vT{n@qADq@ZYLBD`@\\@OpACd@A,dGar@EBo@^Il@v@x@~@}@,|RcjA_B@B`B~ACAiA,fKcf@k@DOZ}@`@`@p@t@Cr@kB,hJsv@{Au@MNMEe@`Ab@RJ\\~Ac@N[,|Oem@CEYEy@BDNKNa@`@t@fAlA_@,nNwr@m@Bi@LHNVdAVT^m@,~_@udAW@gABD~A?@~AE,|Iu}@o@YQNEG@`@SHHH[RAT~@`@L[NFj@mA,iFaiAk@PYP]GYFA~@nB@PM,]_j@QMWFO_@O?G_@g@DBRc@x@JZjAv@p@_@Ty@,jB}s@}@}@M`@Bp@Sd@LTBMV@Hc@n@U,tm@{s@gAq@}CrCk@j@LTv@@l@jBt@r@\\A|AcA,`^aqAeABY@D~AN?lAC,tNk\\y@@a@?MJ@|A`AAT?C{@,vQ{}@M@c@?m@tA|@l@RBRA,vD_s@aAe@IFFJo@TIb@`APPC,pMuu@AWcB@OZj@|@Nj@h@M,hIio@KI_A|@?@|@ZXOR],|Bef@o@C@JO?H~@|AfAKy@EUVQFQ,dT_aAC?{ABB`BLApAA,tJ_VeAHYU_@?KdBt@Vj@e@j@K,}CadACEc@GURQPnA?,p^ewA?AaBD?@D`B~AE,yF{eAoBAAv@?\\pB@,~c@mqA_AB_@@D`BPAlAC,cEin@gBAO?AfA@@pA@TJTKSo@,eB}}@wAAI`AMdAXVp@e@`@u@Cu@,`XwpAkAB@h@@t@jAA,zLukAKOg@BI^W@?TF~ApAAAqA,rg@miAEw@oABB`BtAE,h[i~@]@oABBvAlBE,xT_~@O@qA@DfCTJt@STS,xCyfAqA@?LQC@rAf@Az@?,rXysAaBB@`@@~@jACT?,hDql@{@gA]\\MAOb@OF`@p@v@b@BCSO,~Nqm@m@g@WUq@h@ET|@`@JOEO,dPy}@gAe@g@fAMGGLIPz@^d@C,hWqz@iA@URBxA~AC,nGkjAERM?]SIh@e@o@?tBpACPA,zKky@mAm@OGMZa@z@zAt@,vXwmAQ@kA@?RHABvAtAA,|f@_|@uADD|BNARe@^QND,ld@{w@cBF_BDy@@BrABzAxCGSMLOS]TUP}@|Ai@,|^ujA_BBB`B~AC,hs@m_AK?yCL^dE`DrA,xe@{}AsCHDbBzCI,~D}cAc@@{@??d@@z@~A?,~b@{dAW@gABD`B~AE,xf@asACs@{CJD~A~@C|AE,YyfA?KQG]Bu@Tr@Dp@\\,~F_gAqABS@@|Ab@AbA?,xH_i@iA{@q@|@`At@RM^V`@k@,|[qjA_BDB~A~AC,dXgf@iCDA?@~AlCC,t[}sAaBBB`BhACXA,fP{a@{A@Q?@nDx@A?Qt@C,dQ{`AC?_BBS?@n@LFfAd@b@?,zf@__A_BDD~AD?tAED?,d[yq@oBDeA@Bn@f@ALbBP?pBE,jE{`AI@_B?Mh@KD~Ax@b@k@,z{@i`AgAFNfC^S\\{@ZSPSE],lMw`AkA@U|@M`@ZLd@TFMLFf@gAMG,pF_x@yAu@e@bAj@Vl@Z,fAwfAAeAi@Yw@E@vA?JnAJPB,|Fum@w@y@m@W[BCVIPz@fAr@?^a@,~YkdAW@eABB~A~AC,v^anAQ@mABDhB~AC,xU_mAg@^u@B@v@@TLOnAIHACwA,Pil@M?@[g@MmAl@F^N?N^VGPLh@m@,_CsfAa@A?lABDBJX?,|Aq{@sAo@?@Mn@c@d@rAl@,xSei@wBB@`BtBA@?,~g@eeAwADgABD`B@?|CK,wC_l@IJ[KUJUKqAAx@ZHTjAx@K[b@y@,`_@sgA_BBD~AV?fAC,vR{r@_A@gA@@nA~@AhAAAa@,z`@s~@M?qADD~A~AE,zI}e@g@_@_@WSL]R@n@h@b@|@a@,dJ{j@i@{@}@[_@`@Pt@hAz@TY,n[_wAaBBD`B`BC,lDqjAA?OTYBGSKFg@d@@dApAARA,qFqaA?p@WD@DhA??c@]KMQ,^yt@y@GEr@ErAv@D?SJCMURe@,~Lml@}@a@WUS\\YNh@z@r@@BQ,va@gnAQ@mABDjB~AC,`[{pAiABU?B`BPAnAC,pM_{@{@_@HQe@Uk@lAlAl@PH,d^i}A_BBDbB~AE,vUioAKCONY\\g@A@dAt@Cf@_@?S,qFqr@c@G{AAF~@?P|@J\\?,e@uo@o@Qq@\\e@]U|@MXRn@ZJHKf@ElAm@XsA,qFqbAc@Tq@MKJOGGFAbAv@LZMN?VE?q@,lf@qxAEeA{CHD~A|CI,`VegA_B@@bBZAdAC,`Luq@wAjA^b@VTDUp@i@,hX}yA_BD@d@@x@~AC,rAo_AeA?uB?@p@EJtBP?APk@j@[,hOkUy@uBaA@Ed@Hb@[B?P@~@bA?,tGg~@iASc@j@_@x@f@TRa@j@X@UZSIIRI,|d@akA_BFB~A~AE,`K_aAsA@?r@^?\\PT}@,YoeAq@]s@E?|A`A?b@C,q@qy@wASq@d@IFxAhAb@ZJKESTCSu@,d`@saA_BDF~AL?pAE,ry@a`AiERZfHLDhAw@dBaC,v@ycAAsAoAK?h@?t@N?FTIHX?h@A,j^gzA_BDB~A`BE,b^qz@kBDB`Br@Ax@A,~L{fA?OqA@KD@`BXAbAA,tDsh@u@k@CB_A|@B~@N?AKn@Bb@cA,eHiv@}@OOGWEGhEh@@G_AAWb@sA,dt@ev@aDsA{ArAYVfAp@|EcA,kH}o@}@KQ\\_@HATLNQXbB\\@gAN?,jQo\\]@ASu@B?PSl@Bz@hBC,xLya@eA@OLXVBt@T?@pA`@?,lH}`AK?uA@?~@hARDFPO?Y,`WedA[?eAB@`BB?~AE,jLog@{AiAUXZTa@j@f@^j@EPU,~AubAg@??Ei@@?hBdA?Li@,pPip@_A@_@l@l@f@XDXM,jK}[g@OwABDtAO|@dCCDe@,`\\ogA_BBD`BVAfAC,nUqq@uAB@`@iA@@nAp@[pAEN?Ac@LA,pWqt@wBD@l@c@@@l@tACdAA,|XkjAuA@I@B`B~AE,d\\oj@Ug@Am@qBDDtBjBC,`K{^SP{BAX`AvACf@NLKAqA,|UgjAoAHMN@hA~AA,[}iAICa@Ku@JAlBt@U\\CPF,vd@mnAQ@mABDlB~AG,dNyw@w@g@QIq@vA@FbBA,xSaf@uB@BbCrB@?g@,|Eql@s@?}@`ARNt@j@FIp@}@,~F}q@a@Ke@Ui@t@QBZ\\l@VHm@,z@ox@OKsAm@M?BVMd@Rt@f@?p@X,_Doq@{@a@U?[rA]??p@fB@T}@,nD_{@g@Ui@Bq@tANJt@\\d@cA,dX_}A_BBBbB~AE@?,hMse@o@e@QTPDs@jBPLCJdAAP?,rPwu@aB@O`Bl@CfAA,zm@}~@q@BiADDjAt@C`@[@[JB,|a@yjA_BBB`B~AE,`b@ygA_BDD~AVAfAC,lTaw@CyAu@RUKS@BrBhAAT?,nHez@_Aa@k@YS`@Wh@xAt@LDLO,bP_f@yAJ@xBzAA,l@{u@q@Yg@?UBDRKJl@Nx@F,oFecAI?qBA?h@FGNFJKp@Lb@U,fc@yaAA?_BDF~AL?pAE,vS_v@iA@YDB|A~@Ab@AAm@,hA}c@I_AC_AsAy@Ux@q@^,l[mi@kBBB`BB`BN?,rS{l@qABANa@]B`B?`@vBC,lWew@_BB?`@U?@r@vBE,zc@y~@M?qADD~A~AE,zFkt@K]c@Sm@[g@rA`Ad@d@T,tPuy@}@m@e@Bc@|@v@f@\\m@FJ,d]maA?A_BDD`B\\AbAC,lJigAG_BOHc@]SRMA@hBnAA,_@ms@k@Xm@?Yh@KEMf@d@\\p@]n@P?c@,ja@mzA_BDD~A?@~AE?A,{EqfAEHEAQL?tAH?@CPQ,v[{mAO?oABDjB~AE,gE}{@{AAIj@QL@nA`@g@dAY,fDo}@_By@k@ZQj@rAn@h@C,kKgw@{@GG?AbA^hBEb@b@?,dZiaA_BBD`BN?nAC,bJia@?Li@PaACKJKQGKIZb@v@zB@RQCu@,d[e}AW@gABD`B~AC,nf@wwA}CH?@F`BzCK,iJ{p@i@Ac@?Ah@Zf@@U^IP],|MycAY?AKcA@BbB?HjAAR?,yGy_A[Lw@MAh@Ap@xA@N?,|JcdAY@eA@B`BJ?rAA,|f@sqA}ADD`BPAlAE,fl@ev@wB}Ba@XKEOE_@PSd@}Ah@Q|@lBDDdAh@CBr@|CsC,wCyt@cAgAu@PPHUjBb@FT?CIx@a@?S,pa@kwA_BDB`BbBE,rt@_v@}EbAR~Fp@StAuATu@AaA,YycAc@BEt@h@KLMHIGU,xa@itAcBDF~A`AC^A,`a@s{@_BD@T?DDbB~AE,rUap@M@@b@O?@|@nAAMcB,}BajAOSKDoAl@@vAD@DIx@C`@@,bn@__AG@O\\KCAZa@ZMBIn@sARvB|BzAsA,nHmb@a@q@i@c@u@JWPDT`AHSRl@VJM,n[awAC_B_BBA?B`B`BC,|Cyv@k@Wu@]MrA|@|@HG,~A{cAg@@?\\?Df@?,zWc~@O?qABDnBhAATA?W,}Ds_AiA?AEO?P|AO?KZzA@HaA,}Jcz@[CSPYdAz@FVD,mHsz@oANH`BNFd@[AoA,_Cau@MIIPMF?Ry@`@BHz@`@JDXi@,dJqb@u@Bk@DKLWd@JPJK`ABh@Q?MNMBK,hQqy@SCi@XGK]l@Uj@@V`BAXE,n\\kw@s@@mBBBrA`DE,~\\odAW?gABD`B~AE,~SadA[@cA@@`BB?zAC,wG{|@yAA]ZM^BXZBnAOHk@,da@q}AW@gADD`B~AE,kAwaAWPy@D_@F?b@?r@vA@Aq@ZY,jJw~@]Q_@??Xn@X,|RwWm@m@iBBU?x@tBh@[v@G,~P}cA[?eABB`B~AC,`^m{@E_BM?cABBvAHZjAA,`YkgA_BDB~AZ?dAC,r\\wt@aDDB|AnBEp@A,~`@gqAaAB[@B`BPAlAC,|G_dAY@cA?@bBHAtAA,dWeaA_BDB`BNApAC,la@ut@UTR\\MNRLDnBdAEd@Sj@k@Cs@i@BEeA,`e@_hA_BDD~AVAfAC,`ScgA_BB@`BZ?bAA,aDufAy@B?tATSb@F,b^wz@kA@I[mBD?VU@BjBlBCCaBjBE,vKer@Ok@Q?a@j@a@Mk@Pv@lAJHvAkA,kBmv@yAiAUt@bAfAHQLHJ?,qGov@SDi@@c@rA@VzA@TkB,}CicAoA?ABAR?^FCLP\\J^G,fd@y{@E?_BDF~BbBG,zW_m@Q?oA@e@@DtBfCC,pa@cr@yCFq@@FrC@l@Tf@n@s@b@OXq@bAM,LybAY?MLi@JGF?l@[XtB?,~Fgg@aAu@GHSHc@bAv@ZGPt@KAo@,Yau@m@Oc@[Gj@K?DlAl@?j@Y,Psp@w@E?b@\\QYrAf@LPWGe@JMFO,zk@k|@u@BaBFE?BnAJD`@YrASHo@,zBeq@aAQWACLKB?RPPGNzADBWZC,xXec@O?mCB?f@sBABxC@R\\ApAMRJJIGUJm@t@e@Ni@,`@ql@OFEZi@l@DFrAx@~@}@w@c@,lX{vA_BB@j@@t@`BC,zOslAe@PWEa@P@v@~AC,zR{kAAeAWGUXCVk@B@pA~AA,fKyWeCBKh@^?XTdAI?QZC,zIou@_Bb@]`A`@JDCj@Q`@L`@k@P?,rMci@u@gACPs@AU`@zAhA,~i@s~@o@@AQq@BF~A`BG,`JcgAoA@Q@B`BXAdAA,}@ucAaA?Y?CK?V?hAx@EVQFG,vg@ehAuADD~AvAE,`P_gAaBB@tA@JX?dAC,pTq\\SKqALBhBl@l@N{@`@i@,`Xii@gCB@bBhCE"
            ],
            [
                "UT",
                726000,
                499804,
                "Beaver|Box Elder|Cache|Carbon|Daggett|Davis|Duchesne|Emery|Garfield|Grand|Iron|Juab|Kane|Millard|Morgan|Piute|Rich|Salt Lake|San Juan|Sanpete|Sevier|Summit|Tooele|Uintah|Utah|Wasatch|Washington|Wayne|Weber",
                [21998,80926,51836,9919,1695,3124,46281,18962,11087,4491,37436,17771,8998,51441,8234,18375,38508,1442,18070,52797,39346,22238,20122,32470,60188,8037,11148,12451,16609],
                [404045,145,-1,68,28,267,182,150,30,-1,-1,20,12,-1,48,0,-1,62,114,720,445,288,299,219,1352,22,68,71,166],
                "v_BetBcGn@BLWl@Vb@D?jGq@,d{AukCgD^gCTWdCJANP`@Er@p@t@FhEc@,lqA}iCaBNCnAXn@VEPHPOVeC,noAczBaAJqCVO@`@dApDYRy@,vgAiaC{CTHjAPG?g@^CRVBSx@DNMB?,bqAwcCG~@b@@DWn@ZXkAu@G,|gA_`CC?`@~EpCWBSYmDiBQ,fqAcqBSsB_@sCSx@qDXd@|AWTVIFNM|A,|wAuoBE?eBPgIr@x@p@^AVn@\\R~I{@Iy@i@K,liAwvBcDPB\\Z~DbDWL}AGOWHVU,h`BgqBkGp@Fv@h@JHx@d@B|@GAId@ECSbBO,~}Ai}B{Gr@_@SO\\HVq@[C^U@EPVDNbAn@FZGCq@rHu@,xyAwkB_Jz@Th@TEVn@rALbE_@|@KSmB,r_B{tBc@}DsHt@Bp@[FHz@h@^B^f@@NTbGo@,tnA}dCWPD`@x@VK`@HLPELOF_AKOQH_@C,vwAgrB_CVNNHz@dBQWc@,jnAmiCiAJL|AJfAf@PEa@VQJOYo@,tsAqaCo@[EVc@AMNGj@FDdAX\\Q,psAyfBsAMWo@UDUi@]SWo@_@@y@q@BoAcDVDjAH|@JvALjBfDW`CU,btAiwBo@GOcAWEDQaAHBV^rCxBU,rwAurBOUg@AC_@i@_@yBTRrBnAK~BW,lpAgaCQDIMJa@y@Wg@QFv@cDXG?Dh@n@KhBPl@Tb@e@ZL,t}Aw~Be@aEiEb@u@GYjACbAPbB^RzGs@,zhA_yBa@_FOLy@ECRSW_@B?f@QFL`BNzBDb@bDQa@eA,psAm_C]PeAYHZq@r@@l@Ud@_@DCR`AK`AITAB_@p@ZIWN],lpAu_CGE[Mc@d@m@UXlD^ETe@Am@p@s@,`aBomBcBNBRe@D@H}@FRlBfEc@,vsAoqBoAJyEb@CnAfIs@I{@,ntA}cCs@q@a@DOQK@QNQIWDKNNZ^BPIJNt@M"
            ],
            [
                "VA",
                1273665,
                282797,
                "Accomack|Albemarle|Alleghany|Amelia|Amherst|Appomattox|Arlington|Augusta|Bath|Bedford|Bland|Botetourt|Brunswick|Buchanan|Buckingham|Campbell|Caroline|Carroll|Charles City|Charlotte|Chesterfield|Clarke|Craig|Culpeper|Cumberland|Dickenson|Dinwiddie|Essex|Fairfax|Fauquier|Floyd|Fluvanna|Franklin|Frederick|Giles|Gloucester|Goochland|Grayson|Greene|Greensville|Halifax|Hanover|Henrico|Henry|Highland|Isle of Wight|James City|King and Queen|King George|King William|Lancaster|Lee|Loudoun|Louisa|Lunenburg|Madison|Mathews|Mecklenburg|Middlesex|Montgomery|Nelson|New Kent|Northampton|Northumberland|Nottoway|Orange|Page|Patrick|Pittsylvania|Powhatan|Prince Edward|Prince George|Prince William|Pulaski|Rappahannock|Richmond|Roanoke|Rockbridge|Rockingham|Russell|Scott|Shenandoah|Smyth|Southampton|Spotsylvania|Stafford|Surry|Sussex|Tazewell|Warren|Washington|Westmoreland|Wise|Wythe|York|Alexandria city|Bristol city|Buena Vista city|Charlottesville city|Chesapeake city|Colonial Heights city|Covington city|Danville city|Emporia city|Fairfax city|Falls Church city|Franklin city|Fredericksburg city|Galax city|Hampton city|Harrisonburg city|Hopewell city|Lexington city|Lynchburg city|Manassas city|Manassas Park city|Martinsville city|Newport News city|Norfolk city|Norton city|Petersburg city|Poquoson city|Portsmouth city|Radford city|Richmond city|Roanoke city|Salem city|Staunton city|Suffolk city|Virginia Beach city|Waynesboro city|Williamsburg city|Winchester city",
                [214,18134,2898,11419,11953,16600,0,86078,3493,38626,13465,18353,4517,536,12397,22830,2556,31568,130,13608,915,10686,8125,17970,7822,920,4121,1129,-1,31898,24407,4266,37731,10720,12434,371,6488,35047,7289,751,14433,7077,258,4194,11179,2967,732,848,1732,1821,-1,19088,12993,12932,6155,19127,42,11171,1000,19670,10825,172,-1,665,8272,18347,17449,10877,49850,4512,8732,398,1542,28358,11924,484,2842,29919,87565,37017,21773,31990,40588,2082,6698,1676,1012,457,26632,4885,64483,1823,1594,55265,87,-2,-2,-2,-2,1614,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,608,472,-2,-2,-2],
                [32,130,24,131,211,92,0,917,0,267,-1,72,-1,18,18880,278,27,37,-1,-1,-1,210,53,144,145,79,104,95,-1,823,223,241,182,281,-1,48,79,127,136,-1,16249,393,24,56,7,23179,-1,28,52,112,0,126,372,249,24,584,52,39,126,-1,14,-1,0,-1,20,289,220,53,3328,350,-1,220,62,40,159,-1,58,167,282,90,146,1229,411,37035,38,140,-1,-1,130,123,144,8,-1,853,-1,-2,-2,-2,-2,71,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,239,143,-2,-2,-2],
                "wlBkrBEI_AUNj@PFJtAPDDMZ?Iy@QOJI,_|AypBKSu@J]DJ^Vr@TPl@}@ o}AuoBIE?GBADB,ktAykB]aAUCIJa@DGGG@FVXC\\f@RLLC yuAulBCDCABEACBA,y_BqkBMUUMQ?IJ@JYPQCTTnAG,gzAsmBQ@k@l@T\\FFF@LMZERS[o@,e|AclBGCg@\\ECHb@TLPEXc@,mcBewBGIOJADFBBAFE,wxAwqBKO{Al@Fd@Tf@JENH|@a@CQLA czAcpBKDCK@EJB c{AqoBEBGC@KF@,uuAunBC[OUs@HM@BPRr@FF`@EHKTB,ewAsiBIIFKWUMDKUGSSR[DJDCRRfABJTCX[VC,yoA{gBg@SBD_@VJFCH^NRAVXJKDE_@OJI,{uAejBK]JS]g@YBATc@TJTLEVTGJHH,waBwgBDu@SBk@JGf@Jh@TBXB,okAkiBEDDL[`@UFXVPFBPPBb@s@,e}AumBUQo@LVtAVIDBf@]BQ]O,uyAghBSgAIBSQGGYb@QDDj@`@CPBDKT?,icBorBEAQACHQDDPUTN@APJAJ\\FBLWd@O,iqAaeBq@WOMe@j@FNL?ATf@BNOCK@?@@@??B@?,ceBulBGY]HSAADE@C^NADKJHd@C,u|AohBEk@UM?Ho@R?h@Rn@Z_AFJ,sdBskB@CAC?C@BF@ABADDBb@CPBXQAK[e@I?ABa@J[PCG@L?@D@B?,m~AyxBg@TP\\DHXG,ytAmkBMBSMKRJ\\\\VJCNLJW,u_B_uBm@v@QCCHLBb@@ZTBS\\YI@,s~AckBWuAKMQN@n@LTNP,shAqfBg@Yc@r@ZRXG,mbByjBUUc@BGJCCGf@`@^FAj@KFa@,wdBcrBICGLO?IPq@d@JLJKVD@IPEHQTU,saBovBWs@i@RFHB?A??@?@C?A?A?GDBFQ@BRBNNB ubByvB?BE@CA?E,}~A{vBEIu@DBVi@v@JVAJPBl@w@HA\\]IG,ysAwfB_@MYWGCEb@LT`@j@d@k@,{}AgnBWs@m@LHd@JL,{uAahBGIU@OUWBYZ?h@NLl@@DHDI\\AMU,e|AcwBKS@eAWLe@THt@XHFSPRLA w}AywBA@EMBAD?,aqAohBWKDQOFc@]MFKVZRf@\\^W,}gBsmBIMFYi@JARGDBBOXTD^W,a`BmoBs@\\]??RGDDDZCTOFNPCPO,enAecBEGIMm@Ue@OWX@?@BA@C??DAA?CONJ@nAHv@D,c}AqrBCMGVQNI?HTt@KOO,mcBkfBKi@Fg@G@[AA^I@HHO@MRIA kdBsgBABGC@GFB,q{A{dBAwBa@BSHGK[~@SLRKFb@H@z@H,}aBqpBG@e@NMVGCEHe@PNTZGLO^@\\?,sbBonB_@AMN[FMHFXBFZQASJKD@?DHCHJH?EEFE,wvA{eBEIm@AOM@fAt@HB?Nq@ swAgeBA@G@?@C??A@A?GF?,wvAsrBSBMR]BXx@r@I,ygBmhBIi@HWWQCWADi@`@~@pA@A@A?ABAAC@?,wgBymBEDKHNFGH@FM@@AOFCBHHBINHFGN@B_@DA?K,ydBgpB@QOAIPQDAHWEKJUVGXHLDEJIAG\\YTA,scBisBC@c@KKNFDATHBPEBIP@BS,adBkoBK]K@_@^U@]X@FL??KRFZGd@Q,ugBapBWQO?UXKRj@?LU,edAcbBu@YGY_@MWP^r@tAHb@B,u_BcxBIm@G?g@LDVa@FVr@XOt@E,__B{pBOG[BSA]NF`Ar@]l@M,a_BkiBa@O_@RMEEt@tAI,s}ActBUN]XCRRTJGH?POFW,iiBonBCESCKV?VXKFE,m~AqfBSo@uAHEr@n@HVBn@HGc@SJ,ugBapBODMTk@?AJRBBDh@KTW,esAohB[SOMKBUn@XV^LHUCA?CC?@ACC?A@?@B?OHD,ezAgnBOIKDUg@m@|@AJ\\NCPFBj@m@PA,}dBymBOU[FSG?JM?KHVJ?J@ER@\\I,{kBioB[?ELQEL`ATXPg@,chB_rBu@TFVAVTYN?JSLC,}_BakBoAFNLG`@RCLD^S,a~AaqBIUKFSU[Uc@A^|@ZCNF,a|AusBI_@G@OYSHB^Jb@BLd@M,qtA{dBa@k@]@EHFDOp@bAH\\B@UM?,{xAufB?i@UBCKOSU?EJQC@vBTBEIJEFE@HLABBKB?FF@b@D,i`BwmBQBGOUN[BZd@HKP?TL,q}AijBIc@WHUBOQCNEd@`@Nn@S,sdBckBIGHGCOCHIEACDA?Ae@BKIEJXb@b@`@,y`B_wBYN}@d@H^`@MDFh@w@ cbBavBA@ABAEB?DA?@DNIC,}qAqgBg@]ELIE?NBADB?@CDITLNNLd@e@BI,w}AcuBMEGU]\\I@`@l@HATO,yeByqBGKYTWBMBKRVPp@e@,{uAejBi@PCRNTTAFHFBTo@ gvAciBQFGQPGFFNFGB,swA{lBGWFASs@}@`@ARH?Zn@FRb@U wxAcmBEEB?@? eyA_mBC@?FCK?C,uyAktBEQYJk@ZBTe@LFRNNJRzAm@ yzAgrBAHMIHM,wiAmdBQGDM[SQCCQQG[d@HFnA|@,{gAscBWSc@EQb@KVv@Fd@DZB,a|A{vBM@QSGRCLH\\NXFAH^j@[,cmAoeBQBg@WKJYd@l@THLp@y@,aeB{gBgAcAOOIVHh@B@B@ABC?@@I@A@?Th@FVBH@LSNA,k`B_qB_@}@MCQHGDECODb@~@FA\\O,_bBotBEGa@LK^FBCRD@NEBGHDPIBI@K,yfBalBO@OAGFOICHBVVPNNDWb@E,ycB{hBa@_@c@a@c@DEVfAbAHA@_@,glAufBYW_@@]a@YPLVKH^NEDf@VPC,i}AyvBYIYFDRHFFTLDRII],ijAicBoA}@q@x@DF^Bt@JEG?CDECFJBHHF?,geBcsBGJWFe@EUTNRVCXUFJN?FM@U,cgAwdBSMASWUAAUd@YFELPFb@DVRVQ ihAodBCBCA?ECCB??A,ioAweBWYS@_@Oe@d@p@Vd@N,ihBimB_@VUE@DIDHHEHFBZWBBNG@EFAFI,{cB{vBC@GCAH?@PA,okAubBPBIIKCBGED?B,eyA_mBGE?BBJ?G,o}AuoB?KECC@?F,ijBajBE@?HG@KC@EIEGL[JHFEX^D^F,odBqkB@@@E@CGAAC?B@BAB,yuAulBAGC@@BCDB@,{zAwdBT@?GJCCCM@AIGDKD,kdBsgB?CGCAFFB,ubByvBIA?DB@DA,mcBewBEB@?@?B??A?A@?,ygBmhB?@A?@BC@?@A@HAAAB?@CCA,kbBwrBIECFDB,arAgdBA??CA?AAA?BJ?B@@?EB?@AAC,{iBskBGCOEED?RDPFCJM,yzAgrBEMILLH,aeBelBE@@BHDBIC?,wxAcmB?EA?C?,qzAikBMLGARPHCBS,_bBavBC??JHB,cbBavBB??AE@C?@D@C,swAgeBCEG??FA@?@B??AFA,uhBykBIIBCCC[VCNKL@BF?h@a@,sjBqjBEQWH?VDAHDHI,ihAodBGI?@C?BB?DB@,gdBkkBECAACAIFHFBB,gjBklBKLNDDI,ijBqjBACGBCHIHADJBFA?IDA,usAwgBACA??@BBA@B??BB@BE?AEC,_cBomBIKIB?EEAKJ@R`@K,gvAmiBGGQFFPPG,gvAmiB?HF@FC,czAcpBAGKCADBJ,ahB_hB_AqAG??NAfAF@`AL,kkBcjBE@?W]Cg@jAj@HDYIGZK,c{AqoBCIGAAJFB,ahBwlBG@ADA@LA,w}AywB@ME?C@DL"
            ],
            [
                "VT",
                214567,
                5602,
                "Addison|Bennington|Caledonia|Chittenden|Essex|Franklin|Grand Isle|Lamoille|Orange|Orleans|Rutland|Washington|Windham|Windsor",
                [62820,2425,12575,7822,1256,47401,5176,2813,17068,29246,8017,7102,4576,6270],
                [1074,64,1158,-1,-1,-1,0,100,185,245,897,156,123,574],
                "ynBc`Dq@SKZIP[@BNDXP?EHh@FENTFDKTo@,eqBgwCPqA}@IID?`@RB]nA@?p@H,yrBmcDQBKq@QFGQQDDPKDFNKFHNSNZRE\\p@@Iq@d@K,anBcbDMI@]s@FUNERDbAJ[p@RR{@,itB{fD{@OB|@U^Tl@HNROIOJGGOJEEQPE,cnBkeDaBUIp@X?BZFAFPr@GDEAa@HG,mmBeeDUEBNIF@`@EDA\\LHDI@i@HI,oqBodD[DDTSDDRBRRGBRXEDSTOGQG@C[,}qBg_DI@Gc@W@@UI@q@A@xAdBS,eqBafDcBYGt@FPPGJp@PCREEUZE,moBs|CUGDOi@GYEAXS@GhANAAP|@HFo@POLH,}pB_bDYDCSSFCSe@JHp@HAATVAFb@HAZAHQ,{rB}yC}@IANG`@H`@WZjAN\\oASC,yqBw~CeBRHf@CrA|@HHE@QO@FiARA@YXDDIQ?"
            ],
            [
                "WA",
                1123261,
                17707,
                "Adams|Asotin|Benton|Chelan|Clallam|Clark|Columbia|Cowlitz|Douglas|Ferry|Franklin|Garfield|Grant|Grays Harbor|Island|Jefferson|King|Kitsap|Kittitas|Klickitat|Lewis|Lincoln|Mason|Okanogan|Pacific|Pend Oreille|Pierce|San Juan|Skagit|Skamania|Snohomish|Spokane|Stevens|Thurston|Wahkiakum|Walla Walla|Whatcom|Whitman|Yakima",
                [53272,6478,60114,281,2197,8920,3903,3405,15364,2378,94294,7341,195818,6711,10715,843,13377,897,15848,24170,20014,19169,1837,40957,4475,3385,6743,2841,24595,553,28653,20021,14807,18594,-1,-1,63387,19509,236986],
                [216,0,289,25,378,304,13,39,12,19,122,26,-1,315,341,206,289,191,106,314,407,152,160,37,46,58,482,251,177,16,-1,618,471,452,25,68,532,54,332],
                "fkButDwCb@`@dB\\@lDi@Ie@y@N,jdBkmD[LB`BrAS[qA]?,lpBoqDe@DSMELSf@Jt@[X@j@fA@dAAKk@,trB_~DCi@s@B[zAa@r@[HZ^`@?^t@?P[RDNnAg@p@eAGg@Kw@i@Q,t{Be_ERp@nFiAQoBsAhAcBj@]C,l_C_pDMMg@AOJUO\\jBv@]JKAQ,xhBkoD?@y@DH^QBK`@LhAx@M@?Km@`@[,l`CctDqCh@TdATNNKf@@LLBu@V_@N?,bnBkzD?SUGKXoAKMDAf@d@F\\r@b@JDRp@M^h@HKEOZS?Q_@u@a@?,vgBe`E{AVZ~CVd@X@A\\FL~@k@,lnBiqDOImDh@H^?Ab@Gz@r@n@LZYKu@,~fBcoDSKg@FWz@@H\\?ZpAPCMiAJa@PC,`pBsuD_@i@q@LESc@K]s@e@G?Bd@pCPjAx@OHd@NHDMRLd@EHY,hcCi}DyBf@X|Ai@JJ~@\\IhB_@,~yB{`EKBK\\ENH`ARPL_@Ea@Le@,xcC}_EoFhASq@_@J@f@AHf@b@ZFnAWDPxBg@,h{B_zDUYMq@_Et@Ff@`Ab@Kr@NHv@c@T@Va@p@[,x|B{{D[Gg@c@@IICM^DHLp@TXd@IEY`@I,ltBmyDq@dAoAf@IJThBlAUHi@x@Oh@q@OIJs@,dyBsoDwF`AJj@R@nABROn@Hh@A@O^MHIHOMw@,h`CawD]HkCl@oBXIRXh@AXREhB[pCi@RE,`jBgyDQ@_Aj@GMSEMb@e@BZxBREvCc@,x|B{{DPLa@HDXNh@~@Fh@KY}AEQ,vpBobE_HhAv@~EPA?C@g@LEnAJJYTF?RZI`@s@Z{A?[QK,rcCaxDiB^VvAt@ODRt@KWkAYA,jaBu~Dw@LD^f@jDx@KSeCPCCQ,n|BizDe@H@Rq@ZW`@UAw@b@`@f@ERnBYb@a@ZsA,~{BkcEWBWMOLCTTl@j@],pyBkbEsGhA?Zr@CBh@pEy@J]JC,p|BspDUeAiBZRhALCLv@IN~@?v@F,fyBy_EqEx@E^h@PJv@~Du@EISQIaA,~dBewDg@NKu@OBy@JBN\\bCBTrBY,zdBm_EoBVh@p@BPQBRdCNCJt@f@Od@CLc@RD@]YAWe@,~~BwxD_AG[rAc@`@jCm@,`aCitDSDJl@VAH_@H?VMES,xhBkoDP~@a@ZJl@tCc@Ak@o@M{@s@,vpBobEK`APJrGiABeAMI,nhBipD]Aa@eBSDsBXDZ\\~BBVZMV{@f@GRJx@E,rvBkvDi@p@y@NIh@mATIX^|BvFaASiASD@YYi@HSDS"
            ],
            [
                "WI",
                3330920,
                335975,
                "Adams|Ashland|Barron|Bayfield|Brown|Buffalo|Burnett|Calumet|Chippewa|Clark|Columbia|Crawford|Dane|Dodge|Door|Douglas|Dunn|Eau Claire|Florence|Fond du Lac|Forest|Grant|Green|Green Lake|Iowa|Iron|Jackson|Jefferson|Juneau|Kenosha|Kewaunee|La Crosse|Lafayette|Langlade|Lincoln|Manitowoc|Marathon|Marinette|Marquette|Menominee|Milwaukee|Monroe|Oconto|Oneida|Outagamie|Ozaukee|Pepin|Pierce|Polk|Portage|Price|Racine|Richland|Rock|Rusk|St. Croix|Sauk|Sawyer|Shawano|Sheboygan|Taylor|Trempealeau|Vernon|Vilas|Walworth|Washburn|Washington|Waukesha|Waupaca|Waushara|Winnebago|Wood",
                [13761,8895,47044,6398,130566,63905,10805,73318,51039,148739,56789,28746,125194,96516,20826,6184,67781,28673,1221,125069,1448,167378,69849,23400,93830,2390,32541,37630,23824,7626,105220,18403,89618,14753,11157,109425,151139,38150,13920,0,-1,59114,47148,875,81617,17231,28619,40211,36396,42203,10777,11230,48631,45925,24174,39828,60840,6077,99191,75329,39963,56003,76485,-1,49018,6125,34572,5604,64740,14740,40879,44174],
                [100,195,303,-1,525,717,10,290,3552,1717,5709,-1,7194,10936,79,164,6501,1512,0,130,177,104263,2154,471,3129,23,8213,1079,280,378,4624,650,14610,37,1285,394,953,260,429,0,0,1313,139,187,796,15,25,1550,693,291,105,4070,-1,54086,196,1238,32301,594,847,291,104,-1,1939,0,12725,21,205,578,819,532,71,577],
                "i]ssC[?SACx@EjA\\@l@aB,}WqfDQGM@GN?DBDL@ kWocD[Y]TCjAg@PAd@x@Bd@@@g@,wQu|CQ?mACAlAAPR?jAB,iTqdDy@Uc@c@[TVdAE|A`BD,ie@ewCe@ABTOHY]EfAR@APV@V@DkAF?,oTquCS?ClAJNI`@p@e@Pa@RIGi@,kNe}C[k@m@UG_@e@AErBP?@Qx@?ARv@@,wd@ctCa@AWAElAP@@Id@@,gTyyCS?@QaBEAx@Ad@pBD,}WwxC_BEClACx@jABTe@By@,e^moC]Aw@Ce@?ElApBDQUBe@,cWmmCuAECv@lAl@@UOe@,c^klCQSqBEAPClAx@DjA@,gb@emCDmASAmAEARAlAP@jAB,ek@m|CAMOGCFJX qi@qwCv@DUi@YSSu@_@_@GLH`@,{PabD@u@i@KeAMEdCjA@d@@,{QuyCkACElAAf@jA@@e@,mTkwCqBECx@d@@x@BR??Q,ge@{_DEHFLKDANx@@d@BD_A,qb@oqCkAE?Ie@AAHElAd@@@SlAD,ea@q`Dg@HE~@e@CElAd@@f@B?SR@D_B,oWmjCmAm@e@GEtACbAb@@HY^G\\U,g^}iCkAAEjAB?fABBcA,ca@_rCk@CARCx@R@d@?@YKA,c[clCe@Dy@MClAAH~AD,eYscDSB_@JOb@]DEdAP@f@@@e@f@Q,}VuuCe@AUd@kACCd@?T|ABHRZ?,ib@slCkACElAf@Bd@?,i[yrC?U_ACPb@m@`BrAD@S,ef@yhCQ??M}@CCd@`ADN?,ug@ewCCEw@EPnAb@B,{UiqCOA?QYC[?I?CjAv@BD[,i[miC_BECbAL@pAB,c_@e|Cy@CSA?Rg@CIx@t@BARd@@@S^@,c\\m{C@e@_BEARCjA~AD,qf@gtCWA@QSAc@CGXT\\Fj@p@B,}Z}xCQ??SWA_BE_@AARElA`BDjAB,yc@k~Cy@A@Oc@JKVFx@]EFd@WRBZRBx@GJe@R?@e@R@,}^{qCeACAn@J@AXv@B,cc@azCWACx@d@@@Qd@@@Q@S,ag@}lCYACf@Ob@f@B,i[yrCE|A~ADBkAH?IS,yb@{{Ce@ASAAd@S?Kd@y@F^bAd@@Be@d@@By@V@,}[__DyCIE~Ax@B@S~AD,qc@mvCy@CG?EjA`@@r@BDkA,_g@koCg@CJnAX@,gQ_uC[A?_@kAA?Px@BFh@XI,}NewCcBAAd@?^Z@d@G\\[HI,eNq|Cw@A@Sy@?APC~A~ABASM_@PYRA,m]svCaBEE~Az@BR@B{@P@,}X_}CBkAy@Cg@AAPCjAAd@bBF,af@kjCe@Cg@CIJBZ|@B?LP?,q[snCSACvAd@Ed@FBw@@[,s`@_jCy@Ee@?EjAX@dAB,wTy|CeCEAx@d@?AR`BD,{NqyC_BCElAbB@,q[goCsAE]PCd@PTPRx@LBwAR@,oTk`DaBEAf@e@ACjAdCD,i`@gyCe@AAPe@AAPe@Ae@ACd@ARx@B@S~AF,ef@wqCQAq@CGl@H^f@BR@,_Ye{CcBGCx@V@?RP?~AD@y@@S,cUquCy@CGrBXB?PN@TGHa@KO,wVqoCw@C_BEAR?Rx@BAZtAD@Q,{[q_DQADeAsC`@IDLf@xCH,sc@ejCg@Ce@ACp@AX`ADJ?,cRi`DkAAGpBlAB,ee@goCe@ASAAlAx@B,ud@wlCQAy@CElAd@Bd@@,o`@yvC_BGARR@EjAV@t@B,y^usC{@Cu@CCx@j@BdAB,kb@}sCWAs@CEbA?HjAD@S,e[utCBy@kACAd@QACz@Z?~@B"
            ],
            [
                "WV",
                367634,
                5204,
                "Barbour|Berkeley|Boone|Braxton|Brooke|Cabell|Calhoun|Clay|Doddridge|Fayette|Gilmer|Grant|Greenbrier|Hampshire|Hancock|Hardy|Harrison|Jackson|Jefferson|Kanawha|Lewis|Lincoln|Logan|McDowell|Marion|Marshall|Mason|Mercer|Mineral|Mingo|Monongalia|Monroe|Morgan|Nicholas|Ohio|Pendleton|Pleasants|Pocahontas|Preston|Putnam|Raleigh|Randolph|Ritchie|Roane|Summers|Taylor|Tucker|Tyler|Upshur|Wayne|Webster|Wetzel|Wirt|Wood|Wyoming",
                [11271,7466,70,6530,1061,2607,3088,803,2738,2312,5934,12663,39559,16495,370,22083,11235,11190,9241,1151,8631,1972,85,145,3997,5558,11593,4732,6341,625,4462,24339,1645,4517,2681,18924,2042,11326,16327,4613,3534,6468,9225,8929,6165,5676,1785,3858,4802,1506,357,936,4547,7384,40],
                [62,285,-1,110,25,57,17,141,57,49,83,108,139,395,-1,265,87,199,183,101,57,-1,6,0,30,108,215,48,161,0,119,161,123,125,-1,140,102,38,268,128,119,59,43,49,106,22,-1,53,97,50,-1,16,36,200,0],
                "gsAuvBWCSOOLAVD`@^JCO`@O,g}AoyBEo@QIa@@EPXz@,ekAwlBFSQW_@Eg@l@PNOZNBTALYb@E,ooAirBy@s@WJERVr@VALL^_@,moAw|BG[DSQCGt@,whAipBIC_@TCTZPBRHGCKHB^S]K,enAitBW?Ib@DNMJDJFLLEZw@,qnAypBOUGM_@^IB|@x@Nk@,koAkvBWc@OEK@ELHPORHFRPL?,enAylBAo@MUm@BSTUVGXH?TN|@E,}nAitBa@[M?ERURx@r@LKEO,{vA_wB_@a@s@HHn@IVHZh@Y@A?u@\\F,wpAenB]@g@q@MFCVSJq@KJX\\`A`A?\\YI?FY,yzAczB_@AUFAdAJRtAS,yoA_`CEb@ANPBAKN[EI,eyAstBI[HWIo@uARBFj@hAXKDP,_qAswBGIs@FCZGBD^JBr@EIGNSIQ,mjAasBQMFUGE_@LG@GPGdANLLMNI,g_BuzBWb@Hl@f@U,ykAcqBMLOMIJo@AJLOj@LT@n@LAf@m@^D?UPA?O[SFY,mpAeuBSQs@D@tAJADSVKTS,eiA{mBCS[QAPIBKOQ@?TPVGRj@PPHOYPS,yiAelBk@QFHc@DMXU@XJKHNJTAHHPI,ukAeiBKIGF[G}@JBT\\`@^ATGZa@,qqAeyBi@?i@ZTPR@r@GBS,coAizBEi@e@AAJGr@r@HFI,iiAcsBMOUP[r@l@VE\\^UEEJi@,coAciBMSAOOEo@^EPVJf@RXQ,wxAgyBSBUq@WPh@jAr@I,giA{kBQI[x@QHIIU@DXJHDEP@p@e@NS,kqAwyBsAMYCJ`AFAh@[h@?,sqAmiBUkAaA?MJb@p@LGb@\\,k|Aa{Bg@OKFPHDn@VMTGIW,unA_oB}@y@HCMMW@Id@c@Lf@p@\\ARU,koAo|BAG[@E^d@@,wvAesBO[DWYSi@XOFPbAJN\\CLSRC,wlAkvBe@]OEGX`@N@FVG,ksAmoB@[OKy@o@Gk@[J?PLjANTBZp@JRK,ytAizBo@GQpB?@b@KRLNMD],ikAmqBOHFHGXZR?NJNHC@QBUD],wmA{lBM@QN}@DOZJET^ND@Nz@w@N[,_tAutB_@KEa@IPiA@A@XREVNZZKFj@x@n@E_@Va@EKQC,imAiuBGSAGa@OOGEPSd@`@ZV?L?PW,olAisBIEQFKE[v@MDNTn@@HK,upAclBUO]XTjAn@_@U_@KD,{rAuwBSAUQG@E\\RNVBFC,cuA{vBSMc@J]G?t@hAAHQ,inA}wBMQOAUTUDNDVb@DQNFFYND,urAquBKCa@NBN?l@PBDJRC,mgAwmBDg@M?_@RICBJIF?PQRNXJVPS^g@,oqAiqBWs@K@SBW`@D^NJAZLGb@M,eoAkyBs@IQAEPLRCRFHJATETUN@,_lA}sBi@k@BFQVM?LZJDPGHDFQ,akAcuBEOQAMa@OJADWFFRh@j@^M@O,alAoiBEYOKJIYKOC{@v@LR|@KZF"
            ],
            [
                "WY",
                1247971,
                106630,
                "Albany|Big Horn|Campbell|Carbon|Converse|Crook|Fremont|Goshen|Hot Springs|Johnson|Laramie|Lincoln|Natrona|Niobrara|Park|Platte|Sheridan|Sublette|Sweetwater|Teton|Uinta|Washakie|Weston",
                [52443,45956,67410,95021,58803,81242,85784,109449,17659,59071,81047,36829,53341,51320,36082,59355,63761,53423,17474,5229,37159,35968,44145],
                [209,108,183,-1,11,145,30,16,-1,-1,-1,-1,95,10,226,-1,200,18,25,0,56,23,54],
                "jr@uhCsAHJXMDW@Q]NjDLpCvCMTCIwAi@D,||@_|Cy@Fu@DO`Aw@h@[h@Bp@|E[,fp@mzCsCLPtDLvCtCMYmF,zy@ihCCg@kFZVfFh@EHvAvAIjAGbBKOsCeAH,rq@apCI@uCL]@PdE~@EBf@P\\VALEKYrAI,rk@_zCE?yCNF|ADtAbDM,|dAcvC]NEb@k@]_@d@Ol@w@HgAj@wBBI@ZjFBf@vFa@I_BbAoAPgBn@G,`k@eiCaBFJfCDbA@\\`BIAS,laAgtCaAKWc@e@D_@v@yAd@@PS@B^vBCfAk@v@I,dw@exCuEVXlFHAbDSIsCCq@,zn@{bCgBH@RaBH@d@FtArCKv@E,nkAqlCSoBIaAeA\\VpB@`BoALTxCbDYM}A,zx@}pCcAFcDRVjFjF[,tk@ooCeCJ?BFjBFtA`BGd@C,vhAu}CaEZwDXLxD@Rd@EVb@`AJ^e@j@\\Dc@\\OR{Bx@QCQz@I,fl@iiCe@BPrEfBIOkDCg@,ly@q{C_G^e@BF~AtEWv@i@,jhAeqCAKe@DCSk@DCQo@FQfBcAnAH~A`DWnAMAaB,tfAcjCaDVwF`@LdCdAINrCzDYzCUF?S_C,biAm{C{@HBPy@PSzBPvBBPj@EBRd@E@JdA]Eg@OiBQmB,zlA{cCKgAcDXR~BbDY,j}@evC}EZHrCbAGHAC_@RAAQxAe@^w@,dl@itCcDL@HB~@FlAdCK\\A"
            ]
        ],
        stateBorders: "k}@my@AA ez@ay@eBK iy@_y@[A x^kxB?S ~^_vBEkA ~^_vBD~A _^mgCMA m^ogCgAC gk@_~@Ej@ mk@s|@Ex@ akBsgCM_@ okBshCAC gkBceCAB gkBceCDa@M]LO hAczCAJ fAwyC?`A ucBowBOJAD yd@eaBEF qd@waBGP qd@waBQ[UI wfBagBi@G ktAykBMJ usA{iBc@q@ sqAmiBOFc@]MF qd@esA[A me@gsAa@A gm@m_Bs@E }l@k_BIA ovB_rC{@M kxBmrCEA a{@euAQA kz@qrAAF v_@yiBDtB {o@{xC?]i@S_@u@Af@ ko@kzCMc@G?ED@LLPJA ej@ssA[A ak@usASR uk@{pA?eA sk@_pAA[ dJijAOHc@]SR fKalAI^W@?T xRanAWGUX jQomACVk@B cu@e`Bg@A _t@c`Bc@A }`A{uA?q@ g_AuuAu@E k~@quA[C gH_yBe@A _G_yBg@? qxBorCo@G azBwrCQ|@ szBypCCP u~Ach@c@|@ aU}mC_AA aW_nCAP cWmmCYb@Nd@ y[waAA? gr@{zCGJKK kTy|ACA gRw|AcAA {Pu|Ak@A egB{}BOC d^i}A_BB gdB}vBAH idBqvB?A ly@q{C_G^ lq@qzCe@B b`@ucBCy@ f`@}`BCwA pe@iaBiDJ ~e@kaBM@ oz@sqBGLBJ a`Amp@c@JuA{@AUe@A@O mb@g`DyAJ ea@q`Dg@H {`@w`DID qFqdB?`A `XquB{AB dXquBC? sFs}AAb@ uFo|AIjA {c@w}AyAE uf@}}AA? ih@}qCGk@U]FY uqA{b@eAxA qg@msAE? wg@msAiAE aj@ssAC? _NsmCiAC rh@saC@d@ ph@qbC@\\ _OidAo@A qMgdAm@A v_@{iB?@ |_@cfB@R ix@ioBIAKF {w@enBD[SG mWckCAT oWmjCQl@]T meBo}Bw@K kgBuzBg@q@ zOslAe@PWE hUwyA@d@ dU{|ABbB {}AieBIA _|A_eB{@I q{A{dBMC }WksBUR kaAgaBI? uaAgaBk@I acAqaBc@C eUqqCUF {n@s_Bg@C yn@qtCOmA e_AcaABOWW c_As`AAO mj@mjBWQKY mj@kjB?A yFomC_@? yGomCk@? wDmmCaAA [mzBHJU^ g@ayBGL kJ}aAAbA geBcsBGJWFe@EUT ck@_~BE|@ _k@a_CC`@ qz@qsBBo@ }oA}x@g@A eqA_y@Kh@YA uoA{x@GA {c@}t@Yl@ {c@}t@MiA nuB{pByAdC |wBqtBmAtB mgAydCc@Ac@e@ mjAasBQMFUGE lEc`@e@q@ dBsfC]F fAkfCIDBZGL heAgoB[_E daBkwD\\bC eC_yBo@? iB_yB[? vBecD[dAC`A orBoiCPUa@a@P] grBshCG[ gqBuhC?Q e~@quAE? g}@muA]C dX_}A_BB yhAmx@q@A kjAox@GA wL}p@Ah@ }Kkn@[g@ whAipBIC ugA_oB]KC] dh@ebAF`B o@sxBIl@QJ wz@erBDk@ oz@sqBBCKM xe@{}AsCH ff@wzAMcB yh@mdBMKc@M tqA_jCG@ |uAujCgCT bgBs{CM]BMOK f`BulCyBX ivAqzBMC wvAuzBkAM {wAaxB[e@ {vA_wB_@a@ {vA_wBPqB ob@asAM? }b@asAs@C a`AcaBi@C mk@kzBBu@ mk@gzB?C rJa`Bu@@ |H_`B{@? fbBqrDDZ bbBgsDBT b_@utDgCH pF}hC]AUN hG}hCW? fAuwC?d@ fAovC?d@ fAiuC?R dg@snA?@ lg@ekAGkB _RkdAyBC vfAc`AiDT }yAmkCiAM g|A{kCUE sFk`B?J sFi~A?u@ mX_}Aq@C gX_}AE? _W}|Ag@A gcBitBK^ ng@coC?B fg@qqCFlA ikBk_C]S ikBi_C?A ijBk_C_@@ tDqsDyB@ tDqsDQhAFX wzBgpCCF nw@e_CwAH zy@m_CkAF ~|@y_CcBJ ||@_|Cy@F b{@w{Cu@D fp@mzCsCL yj@o_BcAB yj@o_BEf@ iPwmCQ? {MsmCC? m~AyxBg@T fAmmC_A? fAmmC?mA byBkrCeBX n}BqsCkCd@ sp@khCAoA _p@whB[Q {p@iiBQTMB tUspA@h@ mDmmCI? qKqmCiAA mp@w_Bs@E aBmmCkA? wAmmCI? }n@soCNc@Ki@ es@_`BYC ar@}_Bc@A gt@cdC{@G qs@adCUA a{AoxAo@^ mJy_AAh@ oJo~@Ap@ wfAooBON ggA_oBEf@ fLq~CoBB vHm~CC? }bCapCMH_@EGGHSJC?N^J fAutC?lA sh@a~AkAE ynA}eC?@ mnAkhCKlA nYsjCgDF cRoyB[A _SqyBg@A d{AukCgD^ n|AydCi@{E fDua@}AgA jD{mD?C jD{mDc@nB ~GssDiB@ jDkpD?A cv@kdCOA qjAixAe@O mnAcyAQA {mAayAQA gB}_B{@? sA}_BS? sv@mdC{@E ox@sdCEL ux@edCCb@ _YihC_@FIX iZggC[X g}@ghAOr@ w}@sfAMX `t@w~BwCL ho@i~Bw@D {PwmCy@A t^yzBAK x^_yBCy@ ta@e}BE@ na@c}B}AD p^}|B@v@ Ui|BG`@ Ui|B?W da@q}AW@ l`@o}AgAD goAmcCLmA ohAmsAKB {hAisAUAUd@ lUwvA@j@ nUkuA@t@ mz@auB@K qrAsjAa@|@ ssAuhAI^ vUioAKCON rUsrA@~@ |Ka`Bi@? al@ahBODKQOC e@}_Bm@? qqB}pC@gB ca@aw@oAE }sAeyAML csAqyACTOQEF _mAq`BAE ilAi_BIEKa@ onBcjCYF ioB{iCC@ `wBelDo@ISN i_@}v@C? m_@}v@e@C oYsdA_@A fLcuBg@? ~JcuBy@@ fCkjDEd@ koAo|BAG opAu{BD_@ ioAs{BA[ coAizBEi@ qpAi{B@K ypAuyBFs@ eoAkyBFIES cyAc{BSC wyAg{BgAK _|As{BEA y{AezBIWGC yzAczB_@A wxAgyBSBUq@WP kqAwyBsAM _tAezBYC vm@_vD{CN yoA{gBg@S e|AcwBKS@eA oT{|AoAA oFclB?Y oFijB?y@ sSwrCq@d@ {UiqCUZ ahBigBaAM _jBwlB@DID zm@}~@q@B hl@y~@iAD cjBwgBGA p_@glBDjA seAovAaAK geAmvAKA acAevAeAG ubAcvAKA as@ktAsAG wr@ktAI? ?}_BE? E}_B_@? t{Be_E_@J@f@ xcC}_EOrA ahAkx@WA e}@muAA? tJgiCWH |I}hCQP]Uc@B sjAqx@a@A ukAsx@sAE {_AmpBe@V c_AkpBWA wu@stAoAG uu@stAA? m}@gsCKg@eAk@e@TYv@ sqBs~BQ}@DmA wGqnA?q@ wGilA?gA u|@k}CWb@ZACXUL k{@ctCAK[I?IOE?W {aAujC@UOEFMKK mbAklCK@@^W]CsARa@ gt@m}C[MTCJOQg@HOk@G _c@wgCYA yc@ygCK? zLwsD{CB fA{oC?kA b\\i_DA? `\\i_DeFJ zT}~CA? x}Bg`CG[ _yAer@}A~B uiAafC]a@i@Y ye@}bBoA\\ yJq|Aq@? kLq|Ao@A {Ms|AC? `UmuB{AB dUmuBC? sp@etAcAE paCwrDW@ x`CurDO?W^Ct@ l_C_pDBZ w]{v@q@A k\\yv@k@A _l@yw@Gx@ cg@sr@mAY az@mxBFcA pyAi`As@ZqBP m^yyAMA qXozBA[U]?Y gXazBIM x@{dCAL v@mdCKd@ ~d@mkCqAD vg@skCwAD ng@_oCFjB inA}wBMQ }mAiwBKS mIayBg@A kz@muBBa@ }z@ct@}B~@ qFudB@qA io@_wCDg@WS g@ayBaA@ gqAmyAG? oqAmyAs@C siBumBBBOX aGuyAKjA eIomCs@A inAyx@UA {`Bid@a@z@ uu@ckBOU ~BkgDAP `CeiDAx@ r[wuBO? ~^_vBkBF vt@{~BUB ivAs`A?e@ _s@e|CIY]M _q@u_DO^I@GEQs@X?XV }|AalCgBS qz@{qAOr@ mz@irACL ok@oiA?o@ mk@wgAAw@ qZkhA]`AP\\KHFH cwAcdBu@I yxAmdBc@E dDghCa@J |DohCWF efAs{A?A adAkzA]Ce@c@ e^whBGF m^ohBm@VCR lrBclDSA |tB_lDoAC lyBemD_@LANi@@ vyBomDIH p_CcoD@PKJw@\\ cOcvC]Ze@F yNmvCIH yNmvCCW a{@gpAKj@ sfAwtAAF g}@khA?B cz@ywB@S gz@ovBBi@ kAyvBKDId@SN oB}tBE? c@}tBkA? @}tBe@? ja@ckCqBF lb@gkCa@B kvAyjCaBQ suAujCWC }[e}Ac@A _Zc}A}@A ukBovBET{@K _kBctBGB q]qjB@`@UV mh@a~AE? yf@}}As@C ugB_~By@K oiBk~BSjA qhBw{BGGDG of@isAa@C il@mbCm@W `Qw~CoBB xQy~CW@ {~@cr@Kx@YC }y@soBa@KAO ob@aeBO`@FN wb@_cBDCEK vq@kbBK@ jq@ibBiEP mn@atAcAC dh@ebAE_B d\\oj@W`@ ~e@a`DaDJ xe@kbDDhA yk@cvBE|@ _l@etBAZ uuAkeAIVm@J ivAyaAk@eAFG yd@y_BEc@ ud@os@Ur@OD me@kq@MI bC{gCQHK\\ jnAmiCiAJ `lAaiCL|A zlA{cCKgA sQmtCYH gQ_uCKP m`ByeBo@I u_BueBWC e~AkeBo@I uRymCy@A xe@kbDEy@ qk@kmAAs@ qk@emA?E zZktDmAB w{@smAOt@ chB_rBu@TFVAV xeA}jBI}@ _y@coBI?SO pUusA@`@ rHm~CuB@ }n@soCe@jA okAq_BYF yy@qzB?I cD}_BI? d_@_sB?@ jjAksCDf@ pjAcrCH`A d_@}rBD`B j_@{oB?P ufAotAo@X i_AkcABHWLBF jR}sDaBB ytAizBo@G zLukAKOg@B |MglAa@P jGi\\DtAO|@ _Ns|AmAA ojBalCMTg@D siBsmC[p@ oh@sjCIJBZ bg@qsCAI fg@qqCC_A y|@avCAW[Q@g@ j_@ioBDlA p_@{lB?R soA_h@KbAWVEXYu@ mfAgx@s@C _fAgx@M? lbBuqD\\~B ojAy~A_@W kJ}aA?i@ g_BuzBWb@ u_BcxBIm@ m[igCqAC wgAcbBe@E csBgvCA? esBgvCkAO quBwvC[E xBgcDA@ vA}~C?P |Dk~CeB? uJcyBc@A {e@uq@g@] s`@aw@O? iDgtBSP }hAibBw@G {fA_bB[C sk@_oA?_@ er@}cCk@C yx@acCAV {x@ibCE`@ emAacB_@C okAubBu@K ujAqbBG? ih@abBIQP]M] ih@_bB?A yc@maB_@F wb@_cBYn@G@ gn@khBGB on@ghB]TQe@ }i@weBMN oh@odBI@ uh@kiCCd@ wf@_hCaAE gf@_hCO? mRctCSHQ`@ u}@sxCHmA wbBgfBUC }aBcfBYC fF_uBkA? ay@gaC?B wlAkvBe@] ihBknCi@V }yAsdBGA ezAudBUA {zAwdBUC vgAiaC{CT zbAs`CHjA {g@_mCKoA }NewC@kA jmBelDuCb@ qFudB?B qFkbB?C t}Aw~Be@aE ~}Ai}BIm@ ucBowBIOGB idBsvBOYPM wGcpAAm@ u|@mjAQ`A dIauBQ? rHauBkA@ dOeuBw@? xOguBS@ `G_`Bw@@ hE}_BeA? }jAqbBQC hdAevBEc@ ldAguBC] h`CitCyAV nzB{lCk@oD wz@odCEA }z@qdCmAK ~i@s~@o@@AQ eqBgwCPqA qqB}uCq@I eqBgwCKh@ _Z{_CcA_@Ea@ cx@{x@e@C ox@st@mAN ydAcx@e@C gdAcx@Q? rcCaxDQ`@X@VjAu@J kaAwoBQOo@L aaAuoBIA jdBocDWg@ feB_bD[o@ {_AaaBEA _}@y`B{AG ~Lc`Ba@@ |ByfDCpB fTkjCiBB |PgjCm@@ olA}xAk@C wkAyxAWC ob@aeB?A trBulBsDnG x]{jCiCF cp@w_BI? lMeuBe@@ }w@wmB@M }v@slBEQOCIM ev@ykBQEES myAkkCOA ph@qbCEcA yhAmwAWG yUodAoBC iYsdAE? uGohAYP]GYF uGohAAaA lf@o}B_@@ le@m}BwBF os@mx@gAG qs@ws@oAU wqA_f@[JR\\ s[gnBSJOS e[ipBM`A _ZmqBe@b@ a~@}pBAH oyB_mD_@{@T}@O}A k}@}dCSC `C}{CWd@_@R mk@ueA?aA mk@geA?M v_BetBCU v_BetBP|A `aBomBWwB `aBomBXdC zaBiiBD`@ gyAauCe@Ae@PYM n}BgmDw@G qpAwkAQF ioAqmASJAXQD?L _`BqyBG? g`BqyBg@L oaBcyBDVa@F wxAwqBKO irAocBKA urAqcBg@C }sAucB]C fdCm{Av@GLE@SmAT piCa}AQEe@TO?GVZBHOh@[ |hCwcBTtAYd@w@FoBp@ `mBedB[f@ yh@ehC@j@O^ qX}~BESg@I mvB}vCw@K exBiwCEA azBwrCo@M vgBg|AQ[KyEaABa@`@Wa@[mC dlB}bBmCtE mpBceC]?EOMrA |f@sqACm@ dg@snAG_B wyAgxAi@G q|AowAA@ qjAwqA_@h@ ~{BkcEAh@k@\\Um@BUNMVLVC wz@erBIIWJ sz@ypBMD?B ed@ygCaAE ibAexA@YIM }`AmwAIOU@KI ldCquCcCf@ _[w|@c@w@ yoAecBoAI krAww@HuAUQ `Uk`BqA@ nRi`BM@ q}BkqCMBK`@ }|BooCQCAGO@IK `Rg`BqA@ {sAa`@U^ dRiuBkA@ wLeyBo@A yKeyB]? yJqmCW? {yBccD_@fB {zB{_DQt@ nUm`BM@ {PabD@u@ r`@s_DoCH fZs`Bw@@ zZs`BS? s{@anACL m{@{nAEX uk@_qBWt@ ml@}nB?K spB}|B_@u@ fdBofAuIdE `k@waBaDJ f}@}wDwDX drAm{DqGp@ gl@_v@InA qi@ms@qAHMK qJ}|@]Z oKa|@M^BX qbAmyAo@] okAkiBED kiAojBq@d@QA {hAckBOR saB_yCHYb@ISWPI?W_AiA }{Aen@s@`AFl@k@pA qLar@_@iB rgBu~Ci@h@ rgBizCOi@ fjBynCsAoJ bpBepC{Dj@ iq@{cC[A a]g}A_AC a_@k}AK?OVAPTV dmCwxB@Xa@X vmC}xBLf@Gb@Hh@MT aeAes@GSg@M ej@ygBAc@O]HO w\\onB]D _l@{lBUk@FU qk@ykBMa@ fC}tBy@? lA}tBe@? ou@}iBEe@ kJgcA?] kJedAi@A k~BwuCI@ o}B{uCID q{BesCQEAF o}B{uCBW m|A_uCaAMa@U cfBauAE]M_@ jUqxA@x@ ~AmmCKXDZ xAwkCMHA\\ de@siDAM pe@{dDKwC cWcuBMf@ qW{sBKN }a@azAQR }a@azAW_@FK gh@ooCI_@Fm@ pd@}pDFvA aa@qi@{@[ d`@}`BqAB r]y`BwAD d[e}AW@ `kAeeAKmA blAs}@_DRKcB blAs}@a@qF sk@yz@IdA uKgdAA? kJedA@w@ gJ}gAA~@ p}BcaCO{@ }`A{uAa@C lqA}iCaBN xxAudDa@\\y@a@ |uAydDST@|@a@`ABn@i@XEbAYP uB}tBe@\\MG aDgrBKWSEBO `v@ybBs@D rx@acBqAF nOe`BoA@ wGqjA?w@ iFaiAk@P yCojAoAl@ xe@{}AGmB lf@qxAEeA zkAqeBgDV rgA}}A_@{E rgA}}A^fF ~hAatAKsA viAonAWqD `qCsjCOlAXbAHzAQp@ qZ}{@DSSE gZy{@IC izBwsDBYcAcE[?Kd@WFeAm@@MWCmAf@wAdH _v@caDCGQJYHBHL@\\Y ap@aaDgAe@{@Hq@\\GWoAM oFggB?C riA{yDgCT qtAonCc@y@d@w@ sy@k|BBc@ yy@{zBDo@ {lBaaCKM slBg`C@KIM glB_`CKG nGkjAERM?]SIh@e@o@ mw@i`B}@E kv@g`Ba@A qiAuwA_@S t|Bs{Ba@p@ r{BazBU`@ |zB_yB_BlC akAcuBEOQAMa@OJ }jA{tBAN }jA{tBCG of@gwC_@cA _uBkkCUY_AO mgAwmBBV_@f@ yYocDoAq@ g\\yaDsC`@ yYocD_@JOb@]D qkB_wBCN aiBovBNHBZS`@o@j@Dc@SC {|Bq{CUF k}B{yCEm@ o{BkxC[c@_@K }_BwvCw@e@@a@ hmCa_DsA_C qp@etAA? gMow@G? qMku@@cA qLar@Eb@ o|A}yBWL g}AoyBe@T a|A{vBCG y]gpAAV }[qlAGWWO@IQ?MS?W }[olA?A `C}{CAOc@c@CY }~@__ASr@ }~@c_A?B yk@cvBDy@ {r@cjBQO y{@crBQG j@gcCUNAV sc@gw@U? s`C{pC_B_AEZGU^mAZMNJ[BWl@b@Vn@G g`C_qC@O yb@s}ADGCIW@CMI? {b@q|ACGDY moByiCy@P mwAgdAAI qtAmgAc@h@?V gcBitBI_@ moBs|C@b@MIQNGn@ amAmgB_@@]a@ _oAmhBYP ad@kp@k@_@ ~bAyxDwDZ rg@miAEw@ vg@ehACg@ ivAgpBMkA uuAunBC[OU {NqyCAS eNq|C?NS@QXL^ shAqfBg@Y iVqnDYKW\\sAGi@Vw@IvCnAfAv@ iu@wiBEE [mzBAY gp@cgCKg@ jtA{~@gGf@ b`CsvAMXAHUJIIZe@R? baCssAGAa@v@N@Rc@DS baCa{AiAVEbAs@H ykAapAo@VWX ms@sjBUX_@FEE a`CsoCGTOYe@KDMXGP^JD g`C_qCHJPN?HWOOQ qLeqDcAP@N]HMh@]_@w@^ cRcdDFSg@_@ yPwcDi@K mEkoBIDIAMD oD}pBMFBLSZ yCuqBUV uD_yBo@? `kA}{CMI ~g@eeAG_B sbAoeCELGC?IFEDD caAwdCi@PMQYN idBg}Bc@G ecB_}Bc@G bn@__AG@ pe@{dD@T ~e@a`D?L adBmuBCO adBmuBNXATIH]SKR]L qX}~BDR]d@ oT{mCQA w`Bq|BA? y`Bq|Bg@G tKajC_@X cjB_|BCN gjBo{BCJ _hBayBG?BOHIC]S] kbBcxBi@R }p@gx@qAE {q@is@u@M }p@gx@B\\o@h@D`@QNXb@ edB}uBCS qcBiuBOC }y@etAMr@ UmmCaA? ghAcwAQI coBe~Ai@e@ uy@auAWA mz@cuASA uy@auAGZ cp@gmCQjA ooAyaCAH ooAyaCFq@ goAkcC?A {Hal@AA owA}wAgAI wKgdAs@? nlC}yBJQ_@M qjBmzBSbA ekBixBKh@ v}@ucBcDR qfB_zBYU p|AmvDa@fAAp@ l{AsrDLHq@n@g@pA ky@o`BWC cz@s`BC? }WqfDUVMACE?EFOLAPF kWocD[Y]T ajBynB@K mrBelCDc@ sfAwtAa@cA ziAuvCNhB kdBqmCE? qdBqmCcBU gk@_~@AiA ik@i`A?Q wu@ux@Q? anAonASP unA}mAQF i^olBDMGK k^imBGG u]inB]V sPkyBo@C }cCkeDIFBFOR[SELEA?OGE sdC{bD?KEEGH@JJC ibC_cDONM_@OCFy@ eF_yBY? quBwvCV[Ia@Fa@ |mCixC}@R hmCa_DPRIl@XvAM|@ o}A}{BgBS il@{sAcAE lZc}AgAB nw@cwD{CP qtAa_@]~@k@AYV wlBkrBEI }lBurB_AU omBaoBKuAQGOk@ {kBioBIy@QOJIKM iTqdDy@Uc@c@[TVdA iiAcsBMOUP aiAmpBEEJi@Me@ qo@cfDy@Ec@S ad@kp@@Li@NYg@y@[HvAXAARPJ slBwjC{@R elBekCML pyBkbELn@ gz@s`Bu@C Mg}BGD jlCu{BOV cgAedB?Q edAcbBu@YGY_@M ui@idDo@FOWUJ{@o@i@E oqBetCAw@ qqB}pCeAM otAarCF?Fi@{Ag@ zlA{cCFv@cDX ~gAiaCG? }Xsv@wAC }Xsv@AA _fB}fBWC mPu|AM? ~}Ai}BNnA r_B{tBc@}D lXgtDaEH e_@{rAW]M?B[JEG] e_@_rAKOJK u^uqAOI uwAk\\e@vA{@L abBy|Bc@E _]adCAT u\\ibCKa@ i\\}aCKK q_A{{@?o@ mm@qhBYD {j@ahBe@? roBclDgAA thBakDA? hcCi}DHfD fd@auDcDJ fd@auDDnA _bAmsC_@nB goB_}CEJ _wAcdBC? q|@yjACJ f|A_xDHp@ dA}hAi@Yw@E amAw`BKMWADI nXq`B_BB kaBaV@VLTbBpAKFYMy@k@cAsB wzAeYiAjAGp@MJk@S wyAiPGYy@k@]FMNlBl@ mxAyOEQUCDRT@ iwAcPCFOA?MJCFJ cc@wfDDRq@]OH ~yB{`ET\\Md@D`@ iFoqDwALCTU@o@Ye@A m}@oy@{AI i`Ayy@a@z@ kMgdAE? moAw|BG[DS ipAu|BFu@ {j@eaCDs@ uj@ybC[LWA }j@_`CA\\ }j@_`C@e@ wqA}kCyAqA {rAejCwAO wqA}kCIz@YC {vAstCkAM qkBwhCa@_A gjBklBKL hs@m_AK? |r@m_AyCL qe@}~Cc@J ge@{_DEHFLKD qVmpCEZ wVqoCIp@ qkAmpAGJ siByoBKR _~Ai{Ba@@EP k|Aa{Bg@OKF e|Au{Bi@G acAqaBc@Q xqBelDeA@ ay@caCEx@ vhAu}CaEZ tbAy|CwDX biAm{CKgA ~kAc{C]Y brAc{CUQo@TUWgAX_@E |h@w}BGuA pm@c~BsCJ _mBqcCk@`@ _pA{~BDc@ qoAoaCGn@ _`@cgBME]T ka@sfB]REZ ovAqw@q@xB ugBexA}@y@ yn@arCPs@Q[ njCgwCk@J biC{vCuCh@ rgBu~CGg@cAaA m`BwlCy@K gbBcmCcAM {uAgy@St@ jDkpD?jA z{@i`AgAF ||@}~@[R]z@_@R ||@}~@PSE]m@D anA_cBCE _nAqaBAm@ gTsyBe@A _e@wfDw@Jw@dAe@C arA{jAOF q_A{{@@ZST c`Aiz@EN zC_uBS@ rr@qvD{CP ugBgnCSC kkBahB_@E kjBygB_@G yb@s}Aa@C mb@m{AJGCCK?GGHEAGIA gnAgiCoBuA gnAgiCEZ k|@krBICILMB Ku~BAl@ _^qkBIS?I _Xim@e@SEXkAv@ kaA}w@{AE uV{vBAK uV{vBMv@ }c@q~AQHGQ ~|B{wAiAbB hOkUmAj@cA? tzBwtAc@hAF~AM@A^}DV kxBkwCcB_@ vkCcrBHb@`@L@`A}@dC y_Bef@a@z@ oPkdAo@? arBgnCNuA wsBkqCGA oFijB?R b[wuB}AD sXwrBk@h@ bdAiwBO{B evAwwAi@E gPkyBK? gNgyB_AC goAumAAB sdAupBUKSd@ }eA{oBYJ rhBakDy@L |h@w}BoAF iy@y~BEh@ gy@i_CAN {bBu[DkA c~@spB_@F m}@}qBS^ hA}c@iD_B vJ_Tk@Jk@d@u@WJeB ry@a`AiER }]okBAA twA_lDe@D ~wAslDIR sk@}wBDiA vgBg|ADZ[dBc@f@ zgBuuA}@g@ {g@_mCCf@Ob@ ktAwxAMd@k@E aoAo_CEIQE {tBwyC@O hjAqjAQ}B hjAqjAJ|A wf@}}AA? wd@y~ADOGO oFaoBA? km@k_DWm@}@G {r@{zCCi@ nOejCyBB _vAy~@Iy@ oSsl@w@Ju@K ik@{`AA}@ e`BulCGA laAm_AoCN mFinBCW oF}lB@k@ ld@qrDBr@ xxAudDAk@_@QFaAo@cB fcByhD[VKf@r@`A cBosDY?@uA]BSHSrBg@R cRcdDeAM }Pg`D@y@ ukAeiBDL[`@UF {iAkgBs@_A wvAsrBSBMR]B uyAktBEQYJ cyAgrBQcA u`@sgCC? f@}tBe@? ~AmmCW? FmmC]? m^yyA[o@ vfCilDu@{C rk@_zCE? lk@_zCyCN rf@oyCF|A zf@qvCDtA siBumBYJ?WJW ~kCuwCo@L `yAgnDa@r@ lA{fCEN ypAuyBQA wnAoxBM[ }b@mj@a@] yjBckBWH eqB_hCAU _qBggCEW {pByfCCM mpBqfCMG `GuWKh@ tjCacDYs@ gi@yeCm@~A Pu`CC`@MC?F ?o_CKJ?L b~@wcBK@ zaBiiBgEb@ rfAydBsBL ~bAkdB{CR qr@yiBII {q@ohBUI?_@ xf@asACs@ k|BgmCG@KCHQD@BP _{B_nCCWFg@ _{B_nCy@[CS ipBcfC@GEE aWexBEm@_@M mUuyBs@n@ klBghBk@I wmBqhB_@`A iv@ux@y@E av@mt@mAE _B}f@kAw@ |}Bo}Bg@z@ pMs~Ci@@ grBshCc@S srBufCs@Q ziBoqAPBH`ACN[F hkBulAq@Q?i@ jsBsmAaG\\ `lAaiCQoB bC}_Bg@? uFo|A_B? uIo|Ac@A _GczAAL enB_bDSz@ goB_}CTo@Gs@ ugA{vAQG ehAusAIF }BajAOSKD e@ajAa@Ku@J rfAydBMkB gjAerAIL v{BomD_A? {jAyq@G^a@LQ\\ soA_h@Y}@ f~Bq~BI`@ _tBmqCa@@m@S cgBsvBFGEo@IMXe@ wVgwBI] {|ByqCI@KJ eqBafDcBY _uBc~CAyA _a@}vAIOLMEMa@M@MMG {bBgWCi@T`@FOK}@QJBcA c_BoUgAQ qb@ciDi@e@oAIMD?Fr@BAJd@`@ w^}lDIKmBeATf@d@PDNd@RNK {^{yAy@C ytBgzCBsA auB}`DD][S |`@u_DI@ ~e@s_DJrC w[kk@LLKJaALOVyAE |oAgfBaCT gx@{tAm@E mpA}i@By@ siB_zAaA[g@NeAyB xhCkgDaA}C s`AqgCG{@YQEU efAu{Aq@Y ouAs|@B]Sg@ mmBeeDUE anBcbDDI@i@HI@c@ mcBkfBqAQ kjBc{BET _hBayBDABj@QSGACN u[wv@UA _d@kk@s@A_@LY\\D\\Y[UJSq@P?PY`AONe@SE foCs}B?ZR`@YBi@v@U@FQKi@ nkAqlCSoB uk@_qBEW quAuz@@}@ wrA_{@yAH qhAofBAA caCsaDYOK[ epBmeCCU epBmeCGH f`@}`BA? oeA_dC}@Y _~@aeCq@G q_AieCq@P u`@_zAg@A o`@{uA@]QC c`@yuAKA vzBq}DIC s{@guAq@E r_Bg~DoC^ b{Ag}DVhB x_Bg}DE_@ ejBidDgB[ anBcbDCB zdBm_EoBV `~Bg_C@J uwBulC]M rt@_v@m@`B@`AUt@uAtAq@R iuA{mBKY ooAym@Y`A ocCmeDM@ cqAokA]R pTq\\Ar@a@h@Oz@ aLam@_CUmBb@ }Kkn@LNQX uRonDg@^kAa@ cSweDmByB mD}_BeAA sFi~A?T ncB}lDB`B ffBojDsAR xfBsjDQB itB{fD{@O avB_cDUm@T_@C}@ wuBobDIO y`@sgCeAC }xB_jD@c@WBRWOg@ s|AmwAoAx@ eNq|CES [}iAIC e[mfC]f@ c\\eeCYPAP heAgoBDjA ikB_eCSDIZWJ gmBoaCc@_@ zA}_B{A? ok@_kAAeA iZggCc@A eY_x@JGYMBm@MKDOMEAS _Yuv@KID_@ }Vsl@u@NIQ\\S oFkgB?iA grBimCD] |mCixCPj@ElA dbCwsDI?I^ `eCeqDUs@De@m@N]G axAws@]p@ qfAgt@O? aqAohBWKDQ |bCetDWL wm@ecCOK gn@qcCq@C lt@sbBuAF vAiiCMe@ vAiiCLh@Wb@ wgAo|AG_@ kNe}C[k@m@UG_@ cgAwdBSMASWU }kBo|Bw@`@MIWB biAm{CDh@ rjAg|Ci@bA tyAygBcE^ r{AehB}@J }{@w`Ba@A m{Be~CEb@c@ZCR iyAwgAqAi@cAsADOg@GK[ rf@oyCGo@ _oAeyAgAG _hAo}AM?CO]M xT}~C_BB }kA}gCiAi@ a_AgdAGZ yCuqBGQ be@ajDIcC epBmeCUOEMC@ hiAczCPlB vg@skCFtA zbAs`C{DX ziCudDa@uA edAuaBuAI b{Ag}D_Ed@ z{A}yDJ|@ k~BepCk@c@ e|BcsCUh@ xXec@q@t@Oh@u@d@Kl@FTKH sZmhAUg@JESELi@c@QHQ qZkhAAA ghCchDe@g@OPIi@WGc@}@t@_AP?DN^WPgAv@? anA_cBw@E ucAgdC]R[K eqBifCQDQK si@s}CYg@OF[a@SNDZKLWo@ evBkgD@s@SSWFEO uwB{iDeAvE zT}nAY\\g@A oiAm~AALIBGG nf@wwAAY ak@usAg@E `aB{wDg@kD daBkwDCO q]qjBK] e_@{rAiBE }k@sx@AX tf@utAEaB utB{|CIg@ jh@udCKgC ggA_oBM? wfB_wA]e@ kj@igBUEDQ ej@ygBEN dfAehBKwA bz@y{@eB`CiAv@ yjBckB?SDE orBoiCoA{@ gbBg~CgAwBy@o@]C buAa|D}AR pcCa~Aa@x@k@d@ fdCm{AUBCKRC ~eCwvACJMFEACGLKL@ }sAugASF owAqdA_@e@TMGGWFWOFa@ |GijAMA scBisBC@c@KKN gh@kzCk@gB uf@q~CKVFx@]EFd@WR irBofCIE oiBk~BY_@ yGwtA?@ yGqqA?cB xmCqtBUh@a@DI\\ {tAycBcAI yo@ucCo@E jGi\\YaA l|A{kCg@D sxBcmCkA[ q_BcvCKS m_BimA_@kB }Hcl@cB] {k@wqBEq@ uqA{b@T[Q?M] }aBmb@WjC vmC}xBAMICI@?NA@DB e~@yeAK\\ q~@{dAOR rcAe{BMaB mGiwACZ kk@ybAAmA emBsyBk@XWhA wmBevBq@I qGmvAGt@ oZudAQ? a[udAQLNZSPDHGV cjAc~AKU hn@{k@}AbA]@u@s@m@kBw@AMU g|@}kAIb@ `}B_cCqA{H ggBscD}AU y}BuuCQA u~BuuC_ApA w_CiqCME a[udA?A lBcjAg@d@ mcAyoBe@[ yKgz@SPYdA |RwWQf@w@Fi@Z l[mi@sAfE agAgt@yBlA xcC}_EQoBsAhAcBj@]C[T vgBe`E{AV jaBu~Dw@L pyBkbEBeAMIoGjA of@gwCBTOHY] _oA{x@U? ktAykB]aA og@kyCSCC[ apAk~B@O aoAo_COZ@J cnBkeDaBU jcBumDBV gn@qcCa@e@]kA vuBqqCsDj@ |uBqqCE? va@sn@cALYp@c@No@r@ }~@c_ABKIc@ djBynC}HbA fjBynCA? pFk^c@w@ okBg|Bu@rA x}Bg`CF^ nlC}yBIxA b~B{~BBH sFk`B@_A cgBsvBGd@[ZAN lDqjAA? gzBemC?IMGCHPF ksBgiCoCs@u@{@F^KBISQN[QdDbC~@\\ c_BsuAyA~@ ubBasAm@Uy@@Ek@ }aBssAWP ux@edCaAI gkB_tBHHCLM@Ch@OOS? wjB}qBBOECEDCLJ? jeAeyDkAJ hOysDmA@ m`BupAa@q@e@Y shB}wB@HHGNXILQIML }nBksBKcB g`CcaDKJO[ fkCijBE^u@bALf@e@d@H^ _bA_vAUC {nBs{BED@n@OCc@{A hnCotCb@~@Bb@pAdBBh@e@fA uu@o`Dm@Te@@ jDqjAOTYBGSKF ek@m|CAMOGCFJXHK yg@kwCUi@YSSu@_@_@GLH`@h@|A quAuz@Il@ u`@egD{@}@ cc@wfD]{@ ziBoqAWUOqAW] rcB{iDK`@ qkByjB]Cg@jA ql@os@q@FQsA k{@ctCCt@c@H q_AieCa@gA s|@crCYc@ |lCs{BQA bqCsaC{@~B ekBc}BJ[Oi@ ekBc}BHDST R_bCINFX ekBc}B?FWJ }i@weBDOSa@ efBesBi@@u@\\Z{@ or@}fDg@IG`AiA?u@WIhAg@XGOa@?SPJRrAA y]gpAQm@I? eYscDSB psAyfBsBP {kBioB@z@Qf@UYMaA vpBobE_HhA wnBofBuA~BCrAb@N cfCeeD]KD]UCJ]W@IS uwB{iDGKWPGI o~B}~CQK?Ye@_@ be@mo@e@ReAD kDuh@kAy@IUy@[ i\\aeDeAUeAm@ q}Bi{C]sB k}BsvCSSDMa@[@I\\@Na@ z@osD_D? ihAwkBQR wlAmo@QFGVi@KS^ ix@w_DUXaBPS^ un@{u@o@lAPRgAO hkBulAZl@}FvC ug@ewCCE _i@auCQoA uzAqtBk@iA zh@ouDsCL"
    };
}
