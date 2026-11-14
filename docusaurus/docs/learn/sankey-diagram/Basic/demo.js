import * as SciChart from "scichart";

// Example data: one year's energy flows for an imaginary country, in terawatt-hours (TWh).
// Illustrative numbers, not real statistics. 100 TWh goes in, and every node's inflow equals its outflow.
function getEnergyFlowData() {
    return {
        nodes: [
            { id: "renewables", name: "Wind and solar", color: "#30BC9A" },
            { id: "gas", name: "Natural gas", color: "#F48420" },
            { id: "biomass", name: "Biomass", color: "#A6CE39" },
            { id: "oil", name: "Oil", color: "#AE418D" },
            { id: "electricity", name: "Electricity", color: "#50C7E0" },
            { id: "fuels", name: "Fuels used directly", color: "#F2B134" },
            { id: "plantLosses", name: "Power station losses", color: "#8A94A6" },
            { id: "homes", name: "Homes", color: "#6C8EF5" },
            { id: "industry", name: "Industry", color: "#9B7BD4" },
            { id: "transport", name: "Transport", color: "#E8336D" },
            { id: "useful", name: "Useful energy", color: "#3DDC97" },
            { id: "wasted", name: "Wasted heat", color: "#8A94A6" }
        ],
        links: [
            { source: "gas", target: "electricity", value: 22 },
            { source: "gas", target: "fuels", value: 26 },
            { source: "oil", target: "electricity", value: 2 },
            { source: "oil", target: "fuels", value: 28 },
            { source: "renewables", target: "electricity", value: 14 },
            { source: "biomass", target: "electricity", value: 3 },
            { source: "biomass", target: "fuels", value: 5 },
            { source: "electricity", target: "plantLosses", value: 13 },
            { source: "electricity", target: "homes", value: 12 },
            { source: "electricity", target: "industry", value: 13 },
            { source: "electricity", target: "transport", value: 3 },
            { source: "fuels", target: "homes", value: 18 },
            { source: "fuels", target: "industry", value: 14 },
            { source: "fuels", target: "transport", value: 27 },
            { source: "homes", target: "useful", value: 21 },
            { source: "homes", target: "wasted", value: 9 },
            { source: "industry", target: "useful", value: 19 },
            { source: "industry", target: "wasted", value: 8 },
            { source: "transport", target: "useful", value: 9 },
            { source: "transport", target: "wasted", value: 21 }
        ]
    };
}

// #region_A_start
// Create a JavaScript Sankey diagram with SciChart.js: node bars and curved flow bands drawn as triangles
const {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    XyDataSeries,
    FastTriangleRenderableSeries,
    ETriangleSeriesDrawMode,
    NativeTextAnnotation,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EMultiLineAlignment,
    Thickness,
    CustomChartModifier2D,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    ZoomExtentsModifier,
    SciChartJsNavyTheme
} = SciChart;
// or, for npm, import { SciChartSurface, ... } from "scichart"

// 1. LAYOUT HELPER (plain JavaScript, no SciChart code)
// Takes { nodes: [{ id, name, color, column? }], links: [{ source, target, value }] } and works out where
// every node bar and flow band goes, in a box `width` x `height` with y = 0 at the bottom.
function computeSankeyLayout(data, options) {
    const {
        width = 1000,
        height = 600,
        nodeWidth = 24, // thickness of each node bar
        nodePadding = 24, // vertical gap between bars in a column
        curveSteps = 40 // how many slices each curved band is cut into
    } = options || {};

    const nodes = data.nodes.map((node, index) => ({
        ...node,
        index,
        column: 0,
        valueIn: 0,
        valueOut: 0,
        value: 0,
        x0: 0,
        x1: 0,
        y0: 0, // top of the bar (measured down from the top of the box while laying out)
        y1: 0, // bottom of the bar
        sourceLinks: [], // links leaving this node
        targetLinks: [] // links arriving at this node
    }));
    const nodeById = new Map();
    nodes.forEach((node) => nodeById.set(node.id, node));

    const links = data.links.map((link, index) => {
        const source = nodeById.get(link.source);
        const target = nodeById.get(link.target);
        if (!source || !target) throw new Error(`Unknown node in link ${link.source} -> ${link.target}`);
        const layoutLink = { index, source, target, value: link.value, width: 0, sourceY: 0, targetY: 0, xValues: [], yValues: [] };
        source.sourceLinks.push(layoutLink);
        target.targetLinks.push(layoutLink);
        source.valueOut += link.value;
        target.valueIn += link.value;
        return layoutLink;
    });

    // A node is as tall as the larger of what flows in and what flows out
    nodes.forEach((node) => (node.value = Math.max(node.valueIn, node.valueOut)));

    // Columns: each node goes one column to the right of its furthest-left source (longest path).
    // A node can also set its own `column`.
    for (let pass = 0; pass <= nodes.length; pass++) {
        let changed = false;
        links.forEach((link) => {
            if (link.target.column < link.source.column + 1) {
                link.target.column = link.source.column + 1;
                changed = true;
            }
        });
        if (!changed) break;
        if (pass === nodes.length) throw new Error("The links form a loop: a Sankey diagram needs flows that only go forwards");
    }
    nodes.forEach((node) => {
        const fixedColumn = data.nodes[node.index].column;
        if (Number.isInteger(fixedColumn)) node.column = fixedColumn;
    });
    const lastColumn = Math.max(...nodes.map((node) => node.column));
    const columns = Array.from({ length: lastColumn + 1 }, (_, column) => nodes.filter((node) => node.column === column));

    // One scale for every column (value units -> layout units), set by the column that needs the most room
    const scale = Math.min(
        ...columns.map((column) => {
            const total = column.reduce((sum, node) => sum + node.value, 0);
            return (height - (column.length - 1) * nodePadding) / total;
        })
    );

    // Place the bars: columns spread evenly across the width, each column centred vertically
    columns.forEach((column, columnIndex) => {
        const columnHeight = column.reduce((sum, node) => sum + node.value * scale, 0) + (column.length - 1) * nodePadding;
        let y = (height - columnHeight) / 2;
        column.forEach((node) => {
            node.x0 = lastColumn === 0 ? 0 : (columnIndex * (width - nodeWidth)) / lastColumn;
            node.x1 = node.x0 + nodeWidth;
            node.y0 = y;
            node.y1 = y + node.value * scale;
            y = node.y1 + nodePadding;
        });
    });

    // Stack the bands on each bar, ordered by the position of the node at their other end, so fewer bands cross
    nodes.forEach((node) => {
        node.sourceLinks.sort((a, b) => a.target.y0 - b.target.y0);
        node.targetLinks.sort((a, b) => a.source.y0 - b.source.y0);
        let y = node.y0;
        node.sourceLinks.forEach((link) => {
            link.sourceY = y;
            y += link.value * scale;
        });
        y = node.y0;
        node.targetLinks.forEach((link) => {
            link.targetY = y;
            y += link.value * scale;
        });
    });

    // Each band: an S-shaped curve from the source bar to the target bar, with a constant vertical thickness.
    // Cut it into thin slices and list the top and bottom point of each slice, in turn. Drawn as a triangle strip,
    // every three consecutive points make one triangle, so the points fill the band.
    links.forEach((link) => {
        link.width = link.value * scale;
        const x0 = link.source.x1;
        const x1 = link.target.x0;
        for (let step = 0; step <= curveSteps; step++) {
            const t = step / curveSteps;
            const ease = t * t * (3 - 2 * t); // smoothstep: flat at both ends, steepest in the middle
            const x = x0 + (x1 - x0) * t;
            const top = link.sourceY + (link.targetY - link.sourceY) * ease;
            link.xValues.push(x, x);
            link.yValues.push(height - top, height - (top + link.width)); // flip so y = 0 is at the bottom
        }
    });

    // Flip the bars too, so y = 0 is at the bottom, as on a chart axis
    nodes.forEach((node) => {
        const top = height - node.y0;
        node.y0 = height - node.y1;
        node.y1 = top;
    });

    return { nodes, links, width, height };
}

// 2. TURN THE LAYOUT INTO SCICHART SERIES
// One FastTriangleRenderableSeries per band and per bar, so each can be coloured, faded and hit-tested on its own.
function addSankeySeries(sciChartSurface, wasmContext, layout, options) {
    const { linkOpacity = 0.45, units = "" } = options || {};
    const items = [];

    layout.links.forEach((link) => {
        const series = new FastTriangleRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues: link.xValues, yValues: link.yValues }),
            drawMode: ETriangleSeriesDrawMode.Strip, // each point makes a triangle with the two before it
            fill: link.source.color, // colour each band like the node it comes from
            opacity: linkOpacity
        });
        sciChartSurface.renderableSeries.add(series);
        items.push({ kind: "link", data: link, series });
    });

    layout.nodes.forEach((node) => {
        // A bar is a rectangle: two triangles from four corner points
        const series = new FastTriangleRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [node.x0, node.x0, node.x1, node.x1],
                yValues: [node.y1, node.y0, node.y1, node.y0]
            }),
            drawMode: ETriangleSeriesDrawMode.Strip,
            fill: node.color
        });
        sciChartSurface.renderableSeries.add(series);
        items.push({ kind: "node", data: node, series });

        // Label: name and total, to the right of the bar (to the left in the last column)
        const isLastColumn = node.x1 >= layout.width - 1;
        sciChartSurface.annotations.add(
            new NativeTextAnnotation({
                x1: isLastColumn ? node.x0 - 8 : node.x1 + 8,
                y1: (node.y0 + node.y1) / 2,
                text: `${node.name}\n${node.value} ${units}`,
                textColor: "#FFFFFF",
                fontSize: 16,
                horizontalAnchorPoint: isLastColumn ? EHorizontalAnchorPoint.Right : EHorizontalAnchorPoint.Left,
                verticalAnchorPoint: EVerticalAnchorPoint.Center,
                multiLineAlignment: isLastColumn ? EMultiLineAlignment.Right : EMultiLineAlignment.Left
            })
        );
    });

    // Fade everything except the focused band or bar and what it connects to. Pass null to show everything.
    function highlight(focus) {
        const activeLinks = new Set();
        const activeNodes = new Set();
        if (focus?.kind === "link") {
            activeLinks.add(focus.data);
            activeNodes.add(focus.data.source).add(focus.data.target);
        } else if (focus?.kind === "node") {
            activeNodes.add(focus.data);
            [...focus.data.sourceLinks, ...focus.data.targetLinks].forEach((link) => {
                activeLinks.add(link);
                activeNodes.add(link.source).add(link.target);
            });
        }
        items.forEach((item) => {
            const isActive = item.kind === "link" ? activeLinks.has(item.data) : activeNodes.has(item.data);
            if (item.kind === "link") item.series.opacity = !focus ? linkOpacity : isActive ? 0.85 : 0.12;
            else item.series.opacity = !focus || isActive ? 1 : 0.35;
        });
    }

    // Tooltip text for a band or a bar
    function describe(item) {
        const percent = (part, whole) => `${Math.round((part / whole) * 100)}%`;
        if (item.kind === "link") {
            const { source, target, value } = item.data;
            return `${source.name} to ${target.name}\n${value} ${units} (${percent(value, source.value)} of ${source.name.toLowerCase()})`;
        }
        const node = item.data;
        if (!node.targetLinks.length) return `${node.name}\n${node.valueOut} ${units} in total`;
        if (!node.sourceLinks.length) return `${node.name}\n${node.valueIn} ${units} in total`;
        return `${node.name}\nIn: ${node.valueIn} ${units}   Out: ${node.valueOut} ${units}`;
    }

    // Bars are drawn on top of bands, so hit-test them first
    const hitTestOrder = [...items].reverse();
    return { items, hitTestOrder, highlight, describe };
}

// 3. HOVER, CLICK AND TOOLTIPS WITH SCICHART'S HIT-TEST API
// Each band and bar is its own triangle series, so series.hitTestProvider.hitTest(x, y) says whether the
// mouse is inside one of its triangles. Hover highlights and shows a tooltip; click keeps the highlight.
// CustomChartModifier2D is the base class for your own modifiers (ChartModifierBase2D with a ready-made type).
class SankeyHoverModifier extends CustomChartModifier2D {
    sankey;
    tooltip;
    hovered = null;
    selected = null;
    mouseDownPoint = null;

    constructor(sankey) {
        super();
        this.sankey = sankey;
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

    // Returns the topmost band or bar under the mouse, or null
    hitTestSankey(mousePoint) {
        for (const item of this.sankey.hitTestOrder) {
            const hitTestInfo = item.series.hitTestProvider.hitTest(mousePoint.x, mousePoint.y);
            if (hitTestInfo.isHit) return { item, hitTestInfo };
        }
        return null;
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        const hit = this.hitTestSankey(args.mousePoint);
        this.hovered = hit?.item ?? null;
        if (hit) {
            // Place the tooltip just above the mouse, flipped to the left near the right-hand edge
            const { x, y } = hit.hitTestInfo.hitTestPointValues;
            const xRange = this.parentSurface.xAxes.get(0).visibleRange;
            const nearRightEdge = x > xRange.min + xRange.diff * 0.65;
            this.tooltip.text = this.sankey.describe(hit.item);
            this.tooltip.horizontalAnchorPoint = nearRightEdge ? EHorizontalAnchorPoint.Right : EHorizontalAnchorPoint.Left;
            this.tooltip.x1 = x + xRange.diff * (nearRightEdge ? -0.012 : 0.012);
            this.tooltip.y1 = y + this.parentSurface.yAxes.get(0).visibleRange.diff * 0.04;
        }
        this.tooltip.isHidden = !hit;
        this.sankey.highlight(this.hovered ?? this.selected);
    }

    modifierMouseDown(args) {
        super.modifierMouseDown(args);
        this.mouseDownPoint = args.mousePoint;
    }

    modifierMouseUp(args) {
        super.modifierMouseUp(args);
        // A click, not the end of a drag to pan: select what was clicked, or clear the selection
        const start = this.mouseDownPoint;
        if (start && Math.hypot(args.mousePoint.x - start.x, args.mousePoint.y - start.y) < 5) {
            const hit = this.hitTestSankey(args.mousePoint);
            this.selected = hit && hit.item !== this.selected ? hit.item : null;
            this.sankey.highlight(this.hovered ?? this.selected);
        }
        this.mouseDownPoint = null;
    }

    modifierMouseLeave(args) {
        super.modifierMouseLeave(args);
        this.hovered = null;
        this.tooltip.isHidden = true;
        this.sankey.highlight(this.selected);
    }
}

// 4. THE CHART
async function sankeyDiagram(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Your data: nodes and links, as JSON
    const layout = computeSankeyLayout(getEnergyFlowData(), { width: 1000, height: 600 });

    // The axes only set the drawing area. They're hidden: a Sankey diagram has no scales.
    // Extra space at the bottom keeps the lowest bar clear of the chart's bottom-left corner.
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.02, 0.02) })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.1, 0.03) })
    );

    const sankey = addSankeySeries(sciChartSurface, wasmContext, layout, { units: "TWh" });

    // Hover for values, click to keep a flow highlighted, scroll to zoom, drag to pan, double-click to reset
    sciChartSurface.chartModifiers.add(
        new SankeyHoverModifier(sankey),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
}
// #region_A_end

sankeyDiagram("scichart-root");
