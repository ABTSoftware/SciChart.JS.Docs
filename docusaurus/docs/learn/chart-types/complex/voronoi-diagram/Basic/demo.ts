import * as SciChart from "scichart";

const SIZE = 100; // the map is SIZE x SIZE km
const GRID = 200; // heatmap resolution: GRID x GRID nearest-site tests

// The controls, the chart and the readout each need an element. This splits the page's div into a control bar,
// the chart and a status line; in your app, they can be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:6px 18px; padding:6px 12px; color:#ffffff;" + font;
    bar.innerHTML =
        `<label>Draw cells as <select data-id="mode" style="font:inherit">` +
        `<option value="polygons">Polygons (Euclidean)</option>` +
        `<option value="euclidean">Heatmap, Euclidean distance</option>` +
        `<option value="manhattan">Heatmap, Manhattan distance</option></select></label>` +
        `<label>Colour <select data-id="colour" style="font:inherit">` +
        `<option value="site">By site</option><option value="area">By area</option></select></label>` +
        `<label><input data-id="delaunay" type="checkbox"> Delaunay triangulation</label>` +
        `<label><input data-id="edges" type="checkbox" checked> Euclidean cell edges</label>` +
        `<label>Sites <select data-id="count" style="font:inherit">` +
        `<option value="12">12</option><option value="24" selected>24</option><option value="60">60</option>` +
        `<option value="200">200</option></select></label>` +
        `<button data-id="random" type="button" style="font:inherit">New random sites</button>` +
        `<button data-id="clear" type="button" style="font:inherit">Clear</button>`;
    const chartDiv = document.createElement("div");
    chartDiv.id = divElementId + "-chart"; // the chart's div needs its own id
    chartDiv.style.cssText = "flex:1; min-height:0;";
    const status = document.createElement("div");
    status.setAttribute("aria-live", "polite");
    status.style.cssText = "padding:6px 12px; color:#ffffff; min-height:42px; white-space:pre-line;" + font;
    root.append(bar, chartDiv, status);
    const get = (selector) => bar.querySelector(selector);
    return {
        chartDiv,
        status,
        modeSelect: get('[data-id="mode"]'),
        colourSelect: get('[data-id="colour"]'),
        delaunayCheckbox: get('[data-id="delaunay"]'),
        edgesCheckbox: get('[data-id="edges"]'),
        countSelect: get('[data-id="count"]'),
        randomButton: get('[data-id="random"]'),
        clearButton: get('[data-id="clear"]')
    };
}

async function voronoiDiagram(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // An interactive Voronoi diagram with SciChart.js: click to add a site, drag a site to move it, Shift+click to remove it
    const {
        SciChartSurface,
        NumericAxis,
        NumberRange,
        XyDataSeries,
        FastTriangleRenderableSeries,
        ETriangleSeriesDrawMode,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        HeatmapColorMap,
        CustomChartModifier2D,
        translateFromCanvasToSeriesViewRect,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EExecuteOn,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- Voronoi maths (plain JavaScript, no library needed) ---

    // Clip a convex polygon to the side of a line where side(x, y) <= 0 (Sutherland-Hodgman).
    // Each vertex carries `edge`: what made the edge from it to the next vertex (a site index, or -1 for the frame).
    function clipPolygon(polygon, side, newEdge) {
        const out = [];
        for (let i = 0; i < polygon.length; i++) {
            const p = polygon[i];
            const q = polygon[(i + 1) % polygon.length];
            const sp = side(p.x, p.y);
            const sq = side(q.x, q.y);
            const cut = () => {
                const t = sp / (sp - sq);
                return { x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) };
            };
            if (sp <= 0) {
                out.push(p);
                if (sq > 0) out.push({ ...cut(), edge: newEdge }); // leaving: the next edge runs along the cutting line
            } else if (sq <= 0) {
                out.push({ ...cut(), edge: p.edge }); // entering: the next edge is what is left of p -> q
            }
        }
        // Drop zero-length edges (a vertex lying exactly on the cutting line gives a duplicate point)
        return out.filter((v, i) => {
            const w = out[(i + 1) % out.length];
            return out.length < 2 || Math.hypot(v.x - w.x, v.y - w.y) > 1e-9;
        });
    }

    function polygonArea(polygon) {
        let sum = 0;
        for (let i = 0; i < polygon.length; i++) {
            const p = polygon[i];
            const q = polygon[(i + 1) % polygon.length];
            sum += p.x * q.y - q.x * p.y; // shoelace formula
        }
        return Math.abs(sum) / 2;
    }

    // Voronoi cells by half-plane intersection. Each cell starts as a huge square; for every other site, nearest
    // first, cut away the half beyond the perpendicular bisector of the two sites. O(n²): fine for a few hundred
    // sites. (For many thousands, use Fortune's sweep line or a Delaunay library and take the dual.)
    // Returns, per site: its cell cut to the map, the area, the neighbours (its Delaunay edges) and the full cell.
    function voronoiCells(sites) {
        const far = 1000 * SIZE; // big enough that every bisector crossing the map is seen
        return sites.map((a, i) => {
            let cell = [
                { x: -far, y: -far, edge: -1 },
                { x: far, y: -far, edge: -1 },
                { x: far, y: far, edge: -1 },
                { x: -far, y: far, edge: -1 }
            ];
            const others = sites
                .map((b, j) => ({ j, d: Math.hypot(b.x - a.x, b.y - a.y) }))
                .filter((o) => o.j !== i)
                .sort((u, v) => u.d - v.d);
            for (const { j, d } of others) {
                // A site more than twice as far as the cell's furthest corner can't cut the cell: stop
                const reach = Math.max(...cell.map((v) => Math.hypot(v.x - a.x, v.y - a.y)));
                if (d > 2 * reach) break;
                if (d === 0) continue; // two sites in the same place
                const b = sites[j];
                const nx = b.x - a.x;
                const ny = b.y - a.y;
                const c = (nx * (a.x + b.x) + ny * (a.y + b.y)) / 2; // the bisector: nx * x + ny * y = c
                cell = clipPolygon(cell, (x, y) => nx * x + ny * y - c, j);
            }
            let polygon = cell;
            polygon = clipPolygon(polygon, (x) => -x, -1);
            polygon = clipPolygon(polygon, (x) => x - SIZE, -1);
            polygon = clipPolygon(polygon, (x, y) => -y, -1);
            polygon = clipPolygon(polygon, (x, y) => y - SIZE, -1);
            const neighbours = [...new Set(cell.filter((v) => v.edge >= 0).map((v) => v.edge))];
            return { cell, polygon, area: polygonArea(polygon), neighbours };
        });
    }

    // The Delaunay triangulation is the dual of the Voronoi diagram: join two sites when their cells share an edge.
    // Each corner of a cell where two bisectors meet is a Voronoi vertex, the centre of one Delaunay triangle.
    function delaunayFromCells(cells) {
        const edges = [];
        const triangles = new Set();
        cells.forEach((c, i) => {
            for (const j of c.neighbours) if (i < j) edges.push([i, j]);
            const n = c.cell.length;
            for (let k = 0; k < n; k++) {
                const before = c.cell[(k + n - 1) % n].edge;
                const after = c.cell[k].edge;
                if (before >= 0 && after >= 0 && before !== after) triangles.add([i, before, after].sort((u, v) => u - v).join());
            }
        });
        return { edges, triangleCount: triangles.size };
    }

    const DISTANCE = {
        euclidean: (dx, dy) => Math.hypot(dx, dy),
        manhattan: (dx, dy) => Math.abs(dx) + Math.abs(dy) // city-block distance
    };

    // The index of the nearest site to (x, y); ties go to the lower index
    function nearestSite(sites, x, y, distance) {
        let best = -1;
        let bestDistance = Infinity;
        sites.forEach((s, i) => {
            const d = distance(s.x - x, s.y - y);
            if (d < bestDistance) {
                bestDistance = d;
                best = i;
            }
        });
        return { index: best, distance: bestDistance };
    }

    // Give neighbouring cells different colours (greedy colouring over the Delaunay neighbours)
    function colourBySite(cells, colourCount) {
        const colours = [];
        cells.forEach((c, i) => {
            const used = new Set(c.neighbours.map((j) => colours[j]));
            let k = 0;
            while (used.has(k) && k < colourCount - 1) k++;
            colours[i] = k;
        });
        return colours;
    }

    // Area classes relative to the average cell (SIZE² / number of sites)
    const AREA_CLASSES = [0.25, 0.5, 0.8, 1.25, 2, 4, Infinity];
    const areaClass = (area, mean) => AREA_CLASSES.findIndex((limit) => area / mean < limit);

    // --- The chart ---
    const SITE_COLOURS = ["#3D7DC4", "#D9772E", "#3BA56A", "#8E66C9", "#C9A227", "#2AA7A7", "#C9506E", "#6D7F9C"];
    const AREA_COLOURS = ["#440154", "#443A83", "#31688E", "#21918C", "#35B779", "#90D743", "#FDE725"];

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(ui.chartDiv, { theme: new SciChartJsNavyTheme() });
    const xAxis = new NumericAxis(wasmContext, { axisTitle: "x (km)", visibleRange: new NumberRange(0, SIZE) });
    const yAxis = new NumericAxis(wasmContext, { axisTitle: "y (km)", visibleRange: new NumberRange(0, SIZE) });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Heatmap mode: one value per grid cell, the colour index of the nearest site. A colour map with a sharp step
    // at each whole number turns the indexes into flat colours.
    const steppedColorMap = (colours) =>
        new HeatmapColorMap({
            minimum: 0,
            maximum: colours.length,
            gradientStops: colours.flatMap((color, i) => [
                { offset: i / colours.length, color },
                { offset: (i + 1) / colours.length - 1e-6, color }
            ])
        });
    const heatmapData = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: SIZE / GRID,
        yStart: 0,
        yStep: SIZE / GRID,
        zValues: Array.from({ length: GRID }, () => new Array(GRID).fill(0))
    });
    const heatmap = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: heatmapData,
        colorMap: steppedColorMap(SITE_COLOURS),
        opacity: 0.8
    });
    sciChartSurface.renderableSeries.add(heatmap);

    // Polygon mode: one triangle series per colour, each cell cut into a fan of triangles from its first corner
    const fills = SITE_COLOURS.map(() => {
        const dataSeries = new XyDataSeries(wasmContext, { isSorted: false });
        const series = new FastTriangleRenderableSeries(wasmContext, {
            dataSeries,
            drawMode: ETriangleSeriesDrawMode.List, // every three points are one triangle
            opacity: 0.8
        });
        sciChartSurface.renderableSeries.add(series);
        return { series, dataSeries };
    });

    // Lines with NaN gaps: one series draws every cell outline, another every Delaunay edge
    const lineSeries = (stroke, strokeThickness, strokeDashArray = undefined) => {
        const dataSeries = new XyDataSeries(wasmContext, { isSorted: false, containsNaN: true });
        const series = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke,
            strokeThickness,
            strokeDashArray
        });
        sciChartSurface.renderableSeries.add(series);
        return { series, dataSeries };
    };
    const cellEdges = lineSeries("#0B1424", 2);
    const delaunayEdges = lineSeries("#FFD166", 2);
    const frame = lineSeries("#C8D3E8", 1.5);
    frame.dataSeries.appendRange([0, SIZE, SIZE, 0, 0], [0, 0, SIZE, SIZE, 0]);

    const siteData = new XyDataSeries(wasmContext, { isSorted: false });
    const siteMarkers = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: siteData,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "#FFFFFF", stroke: "#0B1424", strokeThickness: 2 })
    });
    sciChartSurface.renderableSeries.add(siteMarkers);

    // --- Sites and redraw ---
    let seed = 1908; // seeded random numbers, so the first layout is the same every time
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const randomSites = (count) => Array.from({ length: count }, () => ({ x: 3 + (SIZE - 6) * random(), y: 3 + (SIZE - 6) * random() }));
    let sites = randomSites(24);
    let hover;

    function redraw() {
        const mode = ui.modeSelect.value;
        const byArea = ui.colourSelect.value === "area";
        const cells = voronoiCells(sites);
        const { edges, triangleCount } = delaunayFromCells(cells);
        const meanArea = (SIZE * SIZE) / Math.max(sites.length, 1);

        // Areas: exact polygons for Euclidean distance, counted grid squares for the heatmaps
        let areas = cells.map((c) => c.area);
        const owner = [];
        if (mode !== "polygons") {
            const distance = DISTANCE[mode];
            const counts = new Array(sites.length).fill(0);
            for (let row = 0; row < GRID; row++) {
                owner.push([]);
                for (let col = 0; col < GRID; col++) {
                    const { index } = nearestSite(sites, ((col + 0.5) * SIZE) / GRID, ((row + 0.5) * SIZE) / GRID, distance);
                    owner[row].push(index);
                    if (index >= 0) counts[index]++;
                }
            }
            areas = counts.map((n) => (n * SIZE * SIZE) / (GRID * GRID));
        }
        const siteColours = colourBySite(cells, SITE_COLOURS.length);
        const colourIndex = sites.map((_, i) => (byArea ? areaClass(areas[i], meanArea) : siteColours[i]));

        // Fills
        heatmap.isVisible = mode !== "polygons" && sites.length > 0;
        if (heatmap.isVisible) {
            heatmap.colorMap = steppedColorMap(byArea ? AREA_COLOURS : SITE_COLOURS);
            heatmapData.setZValues(owner.map((row) => row.map((i) => colourIndex[i] + 0.5)));
        }
        fills.forEach(({ series, dataSeries }, k) => {
            const xs = [];
            const ys = [];
            if (mode === "polygons") {
                cells.forEach((c, i) => {
                    if (colourIndex[i] !== k) return;
                    for (let v = 1; v + 1 < c.polygon.length; v++) {
                        for (const p of [c.polygon[0], c.polygon[v], c.polygon[v + 1]]) {
                            xs.push(p.x);
                            ys.push(p.y);
                        }
                    }
                });
            }
            dataSeries.clear();
            dataSeries.appendRange(xs, ys);
            series.fill = (byArea ? AREA_COLOURS : SITE_COLOURS)[k] ?? "#000000";
        });

        // Lines
        const outline = { x: [], y: [] };
        for (const c of cells) {
            for (const p of [...c.polygon, c.polygon[0]]) {
                outline.x.push(p ? p.x : NaN);
                outline.y.push(p ? p.y : NaN);
            }
            outline.x.push(NaN);
            outline.y.push(NaN);
        }
        cellEdges.dataSeries.clear();
        cellEdges.dataSeries.appendRange(outline.x, outline.y);
        cellEdges.series.isVisible = ui.edgesCheckbox.checked;
        const dual = { x: [], y: [] };
        for (const [i, j] of edges) {
            dual.x.push(sites[i].x, sites[j].x, NaN);
            dual.y.push(sites[i].y, sites[j].y, NaN);
        }
        delaunayEdges.dataSeries.clear();
        delaunayEdges.dataSeries.appendRange(dual.x, dual.y);
        delaunayEdges.series.isVisible = ui.delaunayCheckbox.checked;
        siteData.clear();
        siteData.appendRange(
            sites.map((s) => s.x),
            sites.map((s) => s.y)
        );

        summary = { areas, edgeCount: edges.length, triangleCount, byArea, mode };
        updateStatus();
    }

    // The readout under the chart: the cells, the Delaunay counts and the nearest site to the pointer
    let summary;
    function updateStatus() {
        if (sites.length === 0) {
            ui.status.textContent = "No sites. Click the chart to add one.";
            return;
        }
        const { areas, edgeCount, triangleCount, byArea, mode } = summary;
        const largest = areas.indexOf(Math.max(...areas));
        const smallest = areas.indexOf(Math.min(...areas));
        const km2 = (a) => `${Math.round(a).toLocaleString("en-GB")} km²`;
        const share = (a) => `${((100 * a) / (SIZE * SIZE)).toFixed(1)}% of the map`;
        let text =
            `${sites.length} cells · largest: site ${largest + 1}, ${km2(areas[largest])} (${share(areas[largest])}) · ` +
            `smallest: site ${smallest + 1}, ${km2(areas[smallest])} · Delaunay: ${edgeCount} edges, ${triangleCount} triangles, ` +
            `${((2 * edgeCount) / sites.length).toFixed(2)} neighbours per cell on average`;
        if (byArea) text += " · colour: cell area from under ¼ of the average (dark) to over 4× (bright)";
        if (hover) {
            const metric = mode === "manhattan" ? "manhattan" : "euclidean";
            const { index, distance } = nearestSite(sites, hover.x, hover.y, DISTANCE[metric]);
            text +=
                `\nPointer at (${hover.x.toFixed(1)}, ${hover.y.toFixed(1)}): nearest is site ${index + 1}, ` +
                `${distance.toFixed(1)} km away (${metric === "manhattan" ? "Manhattan" : "Euclidean"} distance)`;
        }
        ui.status.textContent = text;
    }

    // --- Editing sites with the mouse: a custom chart modifier ---
    class SiteEditorModifier extends CustomChartModifier2D {
        dragIndex = -1;
        pendingAdd;

        toData(args) {
            const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            if (!point) return undefined;
            return {
                x: xAxis.getCurrentCoordinateCalculator().getDataValue(point.x),
                y: yAxis.getCurrentCoordinateCalculator().getDataValue(point.y),
                pixelsPerKm: this.parentSurface.seriesViewRect.width / xAxis.visibleRange.diff
            };
        }

        // The site under the pointer, within 10 pixels
        siteAt(p) {
            const { index, distance } = nearestSite(sites, p.x, p.y, DISTANCE.euclidean);
            return index >= 0 && distance * p.pixelsPerKm < 10 ? index : -1;
        }

        modifierMouseDown(args) {
            super.modifierMouseDown(args);
            if (args.button !== EExecuteOn.MouseLeftButton) return;
            const p = this.toData(args);
            if (!p) return;
            const index = this.siteAt(p);
            if (this.pendingAdd) {
                // Second click of a double-click: let ZoomExtentsModifier reset the zoom instead of adding sites
                clearTimeout(this.pendingAdd);
                this.pendingAdd = undefined;
                return;
            }
            if (index >= 0 && args.shiftKey) {
                sites.splice(index, 1); // Shift+click removes a site
                redraw();
            } else if (index >= 0) {
                this.dragIndex = index;
            } else if (p.x >= 0 && p.x <= SIZE && p.y >= 0 && p.y <= SIZE && sites.length < 200) {
                this.pendingAdd = setTimeout(() => {
                    this.pendingAdd = undefined;
                    sites.push({ x: p.x, y: p.y });
                    redraw();
                }, 300);
            }
            args.handled = true;
        }

        modifierMouseMove(args) {
            super.modifierMouseMove(args);
            const p = this.toData(args);
            if (!p) return;
            hover = p;
            if (this.dragIndex >= 0) {
                sites[this.dragIndex] = { x: Math.min(SIZE, Math.max(0, p.x)), y: Math.min(SIZE, Math.max(0, p.y)) };
                args.handled = true;
                redraw();
            } else {
                updateStatus();
            }
        }

        modifierMouseUp(args) {
            super.modifierMouseUp(args);
            this.dragIndex = -1;
        }

        modifierMouseLeave(args) {
            super.modifierMouseLeave(args);
            this.dragIndex = -1;
            hover = undefined;
            updateStatus();
        }
    }

    // Keep one km the same length on both axes, so cells keep their true shape and bisectors stay at right angles
    // (checked before and after each draw: on the very first draw the layout isn't known until the end)
    const keepAspect = () => {
        const rect = sciChartSurface.seriesViewRect;
        if (!rect || !rect.width || !rect.height) return; // not laid out yet
        const kmPerPixel = Math.max(xAxis.visibleRange.diff / rect.width, yAxis.visibleRange.diff / rect.height);
        const fit = (range, pixels) => {
            const centre = (range.min + range.max) / 2;
            return new NumberRange(centre - (kmPerPixel * pixels) / 2, centre + (kmPerPixel * pixels) / 2);
        };
        const newX = fit(xAxis.visibleRange, rect.width);
        const newY = fit(yAxis.visibleRange, rect.height);
        if (Math.abs(newX.diff - xAxis.visibleRange.diff) > 1e-6) xAxis.visibleRange = newX;
        if (Math.abs(newY.diff - yAxis.visibleRange.diff) > 1e-6) yAxis.visibleRange = newY;
    };
    sciChartSurface.preRender.subscribe(keepAspect);
    sciChartSurface.rendered.subscribe(keepAspect);

    sciChartSurface.chartModifiers.add(
        new SiteEditorModifier(), // first, so it can claim left clicks on sites
        new MouseWheelZoomModifier(),
        new ZoomPanModifier({ executeCondition: { button: EExecuteOn.MouseRightButton } }), // right-drag to pan
        new ZoomExtentsModifier()
    );

    // --- The controls ---
    ui.modeSelect.addEventListener("change", redraw);
    ui.colourSelect.addEventListener("change", redraw);
    ui.delaunayCheckbox.addEventListener("change", redraw);
    ui.edgesCheckbox.addEventListener("change", redraw);
    ui.randomButton.addEventListener("click", () => {
        sites = randomSites(Number(ui.countSelect.value));
        redraw();
    });
    ui.countSelect.addEventListener("change", () => ui.randomButton.click());
    ui.clearButton.addEventListener("click", () => {
        sites = [];
        redraw();
    });
    redraw();
    // #region_A_end
    return { sciChartSurface };
}

voronoiDiagram("scichart-root");
