import * as SciChart from "scichart";

// Example data: one year's sales for an imaginary online shop, in millions of dollars ($M).
// Illustrative numbers, not real statistics. The total is $100M, so every value is also a percentage.
function getShopSalesData() {
    return {
        name: "All sales",
        children: [
            {
                name: "Electronics",
                color: "#50C7E0",
                children: [
                    { name: "Phones", value: 14 },
                    { name: "Laptops", value: 10 },
                    { name: "TV and audio", value: 7 },
                    { name: "Accessories", value: 4 },
                    { name: "Cameras", value: 3 }
                ]
            },
            {
                name: "Home and garden",
                color: "#30BC9A",
                children: [
                    { name: "Furniture", value: 9 },
                    { name: "Kitchen", value: 6 },
                    { name: "Garden", value: 4 },
                    { name: "Lighting", value: 3 },
                    { name: "Bedding", value: 2 }
                ]
            },
            {
                name: "Fashion",
                color: "#C060A8",
                children: [
                    { name: "Women's clothing", value: 8 },
                    { name: "Men's clothing", value: 5 },
                    { name: "Shoes", value: 5 },
                    { name: "Bags", value: 2 },
                    { name: "Jewellery", value: 1 }
                ]
            },
            {
                name: "Sports",
                color: "#F48420",
                children: [
                    { name: "Fitness", value: 6 },
                    { name: "Bikes", value: 5 },
                    { name: "Camping", value: 3 },
                    { name: "Team sports", value: 2 },
                    { name: "Water sports", value: 1 }
                ]
            }
        ]
    };
}

// #region_A_start
// Create a JavaScript treemap with SciChart.js: nested rectangles sized by value and coloured by group
const {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    XyxyDataSeries,
    FastRectangleRenderableSeries,
    EColumnMode,
    EColumnYMode,
    NativeTextAnnotation,
    BoxAnnotation,
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
// Takes a hierarchy { name, children: [{ name, color?, value? , children? }] } and returns one rectangle per node
// in a box `width` x `height`, with y = 0 at the bottom. Leaves need a `value`; a group's value is the sum of its children.
// Uses the squarified layout (Bruls, Huizing and van Wijk, 2000), which keeps rectangles close to square.
function computeTreemapLayout(root, options) {
    const {
        width = 1000,
        height = 600,
        padding = 4, // gap inside each group, around its children
        headerHeight = 34 // room at the top of each group for its name
    } = options || {};

    // Work out every node's value, depth, colour and path, bottom up
    function prepare(node, parent, depth) {
        const prepared = {
            name: node.name,
            value: node.value || 0,
            depth,
            parent,
            color: node.color || parent?.color || "#50C7E0",
            children: [],
            x0: 0,
            x1: 0,
            y0: 0,
            y1: 0
        };
        (node.children || []).forEach((child) => prepared.children.push(prepare(child, prepared, depth + 1)));
        if (prepared.children.length) prepared.value = prepared.children.reduce((sum, child) => sum + child.value, 0);
        prepared.children.sort((a, b) => b.value - a.value); // the squarified layout needs largest first
        return prepared;
    }
    const tree = prepare(root, null, 0);

    // How "un-square" a row of rectangles is when laid along a side of length `side`: 1 is perfect, higher is worse
    function worstAspectRatio(rowValues, side, scale) {
        const areas = rowValues.map((value) => value * scale);
        const total = areas.reduce((sum, area) => sum + area, 0);
        const largest = Math.max(...areas);
        const smallest = Math.min(...areas);
        return Math.max((side * side * largest) / (total * total), (total * total) / (side * side * smallest));
    }

    // Squarify: fill the box with rows of rectangles, adding to the current row while that makes it more square.
    // Coordinates here run from the top-left corner, y downwards.
    function squarify(nodes, x, y, w, h) {
        const total = nodes.reduce((sum, node) => sum + node.value, 0);
        if (total <= 0 || w <= 0 || h <= 0) return;
        const scale = (w * h) / total; // area per unit of value
        let remaining = nodes.slice();
        while (remaining.length) {
            const side = Math.min(w, h);
            const row = [remaining[0]];
            let i = 1;
            while (
                i < remaining.length &&
                worstAspectRatio([...row, remaining[i]].map((n) => n.value), side, scale) <=
                    worstAspectRatio(row.map((n) => n.value), side, scale)
            ) {
                row.push(remaining[i]);
                i++;
            }
            remaining = remaining.slice(i);

            // Lay the row along the shorter side of the space that's left, then shrink that space
            const rowArea = row.reduce((sum, node) => sum + node.value * scale, 0);
            if (w >= h) {
                const rowWidth = rowArea / h; // a column on the left
                let top = y;
                row.forEach((node) => {
                    const nodeHeight = (node.value * scale) / rowWidth;
                    Object.assign(node, { x0: x, x1: x + rowWidth, y0: top, y1: top + nodeHeight });
                    top += nodeHeight;
                });
                x += rowWidth;
                w -= rowWidth;
            } else {
                const rowHeight = rowArea / w; // a row along the top
                let left = x;
                row.forEach((node) => {
                    const nodeWidth = (node.value * scale) / rowHeight;
                    Object.assign(node, { x0: left, x1: left + nodeWidth, y0: y, y1: y + rowHeight });
                    left += nodeWidth;
                });
                y += rowHeight;
                h -= rowHeight;
            }
        }
    }

    // Lay out each level inside its parent: the root fills the box, groups keep a header strip for their name
    function layoutChildren(node) {
        if (!node.children.length) return;
        const header = node.depth === 0 ? 0 : headerHeight;
        const inset = node.depth === 0 ? 0 : padding;
        squarify(
            node.children,
            node.x0 + inset,
            node.y0 + header,
            node.x1 - node.x0 - 2 * inset,
            node.y1 - node.y0 - header - inset
        );
        node.children.forEach((child) => {
            // Leave a small gap between neighbouring groups
            if (child.children.length) Object.assign(child, { x0: child.x0 + padding / 2, x1: child.x1 - padding / 2, y0: child.y0 + padding / 2, y1: child.y1 - padding / 2 });
            layoutChildren(child);
        });
    }
    Object.assign(tree, { x0: 0, x1: width, y0: 0, y1: height });
    layoutChildren(tree);

    // Flatten the tree and flip y so y = 0 is at the bottom, as on a chart axis
    const nodes = [];
    (function collect(node) {
        nodes.push(node);
        node.children.forEach(collect);
    })(tree);
    nodes.forEach((node) => {
        const top = height - node.y0;
        node.y0 = height - node.y1;
        node.y1 = top;
    });

    return {
        root: tree,
        groups: nodes.filter((node) => node.depth === 1),
        leaves: nodes.filter((node) => !node.children.length),
        width,
        height
    };
}

// 2. TURN THE LAYOUT INTO SCICHART SERIES
// One FastRectangleRenderableSeries for the group backgrounds, and one per group for its leaves,
// so each group has its own colour. Each rectangle is x0..x1 by y0..y1 (start/end in X, top/bottom in Y).
function addTreemapSeries(sciChartSurface, wasmContext, layout, options) {
    const { formatValue = (value) => `${value}` } = options || {};

    function rectangleSeries(nodes, fill, stroke) {
        return new FastRectangleRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, {
                xValues: nodes.map((node) => node.x0),
                x1Values: nodes.map((node) => node.x1),
                yValues: nodes.map((node) => node.y1),
                y1Values: nodes.map((node) => node.y0)
            }),
            columnXMode: EColumnMode.StartEnd,
            columnYMode: EColumnYMode.TopBottom,
            fill,
            stroke,
            strokeThickness: 1
        });
    }

    // Group backgrounds, with the group's name and total in the header strip
    sciChartSurface.renderableSeries.add(rectangleSeries(layout.groups, "#FFFFFF14", "#FFFFFF33"));
    layout.groups.forEach((group) => {
        sciChartSurface.annotations.add(
            new NativeTextAnnotation({
                x1: group.x0 + 6,
                y1: group.y1 - 6,
                text: `${group.name}  ${formatValue(group.value)}`,
                textColor: group.color,
                fontSize: 18,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                verticalAnchorPoint: EVerticalAnchorPoint.Top
            })
        );
    });

    // Leaves: one series per group, filled with the group's colour. Colour shows the group; area shows the value.
    const leafSeries = layout.groups.map((group) => {
        const series = rectangleSeries(group.children, group.color + "CC", "#14233C");
        sciChartSurface.renderableSeries.add(series);
        return { series, leaves: group.children };
    });

    // A label in each leaf: name and value. Hidden while the rectangle is too small to hold it.
    const labels = layout.leaves.map((leaf) => {
        const label = new NativeTextAnnotation({
            x1: (leaf.x0 + leaf.x1) / 2,
            y1: (leaf.y0 + leaf.y1) / 2,
            text: `${leaf.name}\n${formatValue(leaf.value)}`,
            textColor: "#FFFFFF",
            fontSize: 16,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            multiLineAlignment: EMultiLineAlignment.Center
        });
        sciChartSurface.annotations.add(label);
        return { label, leaf };
    });

    // Show or hide each label for the current zoom, from the rectangle's size in pixels
    function updateLabels() {
        const xCalc = sciChartSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        const yCalc = sciChartSurface.yAxes.get(0).getCurrentCoordinateCalculator();
        labels.forEach(({ label, leaf }) => {
            const widthPx = Math.abs(xCalc.getCoordinate(leaf.x1) - xCalc.getCoordinate(leaf.x0));
            const heightPx = Math.abs(yCalc.getCoordinate(leaf.y1) - yCalc.getCoordinate(leaf.y0));
            const longestLine = Math.max(leaf.name.length, formatValue(leaf.value).length);
            const tooSmall = widthPx < longestLine * 7.5 + 6 || heightPx < 44;
            if (label.isHidden !== tooSmall) label.isHidden = tooSmall; // only change it when needed, to avoid extra redraws
        });
    }
    sciChartSurface.rendered.subscribe(updateLabels);

    // Tooltip text for a leaf: its value, its share of its group and its share of the total
    function describe(leaf) {
        const group = leaf.parent;
        const percent = (part, whole) => `${Math.round((part / whole) * 100)}%`;
        return [
            `${group.name}: ${leaf.name}`,
            `${formatValue(leaf.value)}`,
            `${percent(leaf.value, group.value)} of ${group.name.toLowerCase()}`,
            `${percent(leaf.value, layout.root.value)} of the total`
        ].join("\n");
    }

    return { leafSeries, describe };
}

// 3. HOVER TOOLTIP WITH SCICHART'S HIT-TEST API
// series.hitTestProvider.hitTest(x, y) says whether the mouse is inside one of a rectangle series' rectangles,
// and which one (dataSeriesIndex). The modifier outlines that rectangle and shows its tooltip.
class TreemapTooltipModifier extends CustomChartModifier2D {
    treemap;
    tooltip;
    outline;

    constructor(treemap) {
        super();
        this.treemap = treemap;
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
        this.outline = new BoxAnnotation({ isHidden: true, fill: "#FFFFFF22", stroke: "#FFFFFF", strokeThickness: 2 });
    }

    onAttach() {
        super.onAttach();
        this.parentSurface.annotations.add(this.outline, this.tooltip);
    }

    onDetach() {
        this.parentSurface?.annotations.remove(this.outline);
        this.parentSurface?.annotations.remove(this.tooltip);
        super.onDetach();
    }

    // Returns the leaf under the mouse and the hit-test result, or null
    hitTestLeaf(mousePoint) {
        for (const { series, leaves } of this.treemap.leafSeries) {
            const hitTestInfo = series.hitTestProvider.hitTest(mousePoint.x, mousePoint.y);
            if (hitTestInfo.isHit) return { leaf: leaves[hitTestInfo.dataSeriesIndex], hitTestInfo };
        }
        return null;
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        const hit = this.hitTestLeaf(args.mousePoint);
        if (hit) {
            const { leaf } = hit;
            Object.assign(this.outline, { x1: leaf.x0, x2: leaf.x1, y1: leaf.y0, y2: leaf.y1 });

            // Place the tooltip just above the mouse, flipped to the left near the right-hand edge
            const { x, y } = hit.hitTestInfo.hitTestPointValues;
            const xRange = this.parentSurface.xAxes.get(0).visibleRange;
            const nearRightEdge = x > xRange.min + xRange.diff * 0.65;
            this.tooltip.text = this.treemap.describe(leaf);
            this.tooltip.horizontalAnchorPoint = nearRightEdge ? EHorizontalAnchorPoint.Right : EHorizontalAnchorPoint.Left;
            this.tooltip.x1 = x + xRange.diff * (nearRightEdge ? -0.012 : 0.012);
            this.tooltip.y1 = y + this.parentSurface.yAxes.get(0).visibleRange.diff * 0.03;
        }
        this.tooltip.isHidden = !hit;
        this.outline.isHidden = !hit;
    }

    modifierMouseLeave(args) {
        super.modifierMouseLeave(args);
        this.tooltip.isHidden = true;
        this.outline.isHidden = true;
    }
}

// 4. THE CHART
async function treemap(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Your data: a hierarchy as JSON. Leaves have values; groups add up their children.
    const layout = computeTreemapLayout(getShopSalesData(), { width: 1000, height: 600 });

    // The axes only set the drawing area. They're hidden: a treemap has no scales.
    // Extra space at the bottom keeps the lowest rectangles clear of the chart's bottom-left corner.
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.005, 0.005) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.07, 0.01) }));

    const treemapSeries = addTreemapSeries(sciChartSurface, wasmContext, layout, { formatValue: (value) => `$${value}M` });

    // Hover for values, scroll to zoom into small rectangles, drag to pan, double-click to reset
    sciChartSurface.chartModifiers.add(
        new TreemapTooltipModifier(treemapSeries),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
}
// #region_A_end

treemap("scichart-root");
