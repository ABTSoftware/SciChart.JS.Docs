import * as SciChart from "scichart";

// Example data: who works with whom in an imaginary company of 60 people in four teams.
// Made up with a seeded random generator, so the network is the same every time.
// Each team has a lead who works with most of the team; a few people link the teams together.
function getTeamNetworkData() {
    let seed = 20261114;
    const random = () => {
        // mulberry32: a small seeded random number generator
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const groups = [
        { id: "eng", name: "Engineering", color: "#50C7E0" },
        { id: "sales", name: "Sales", color: "#F48420" },
        { id: "marketing", name: "Marketing", color: "#E8336D" },
        { id: "support", name: "Support", color: "#3DDC97" }
    ];
    const names = [
        "Priya", "Tom", "Wei", "Sara", "Omar", "Lena", "Jack", "Mia", "Raj", "Anna", "Luis", "Kate", "Ben", "Yuki", "Ivan",
        "Grace", "Sam", "Nina", "Paul", "Zara", "Leo", "Amy", "Hugo", "Ella", "Dan", "Rosa", "Max", "Ivy", "Joe", "Lily",
        "Chloe", "Adam", "Maya", "Finn", "Noor", "Eric", "Jade", "Owen", "Tara", "Alex", "Ruth", "Kai", "Dina", "Matt", "Eva",
        "Marco", "Beth", "Ali", "Hana", "Ryan", "Zoe", "Carl", "Ines", "Neil", "Lucy", "Theo", "Rita", "Will", "Fay", "Jon"
    ];
    const teamSize = 15;
    const nodes = names.map((name, index) => ({ id: name, name, group: groups[Math.floor(index / teamSize)].id }));
    const links = [];
    groups.forEach((group, g) => {
        const first = g * teamSize; // the first person in each team is its lead
        for (let i = first; i < first + teamSize; i++) {
            for (let j = i + 1; j < first + teamSize; j++) {
                const chance = i === first ? 0.75 : 0.17;
                if (random() < chance) links.push({ source: names[i], target: names[j] });
            }
        }
    });
    // People who work across teams: the bridges between the clusters
    const crossTeam = [
        ["Tom", "Grace"], ["Tom", "Finn"], ["Tom", "Marco"], ["Grace", "Chloe"], ["Leo", "Maya"],
        ["Ali", "Sara"], ["Marco", "Wei"], ["Rita", "Nina"]
    ];
    crossTeam.forEach(([source, target]) => links.push({ source, target }));
    // Jon has just joined Support and doesn't work with anyone yet
    const joined = links.filter((link) => link.source !== "Jon" && link.target !== "Jon");
    return { groups, nodes, links: joined };
}

// #region_A_start
// Create a JavaScript network graph with SciChart.js: edges as line segments, nodes as bubbles,
// laid out by a small force-directed simulation
const {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    XyxyDataSeries,
    XyzDataSeries,
    FastLineSegmentRenderableSeries,
    FastBubbleRenderableSeries,
    EllipsePointMarker,
    EStrokePaletteMode,
    parseColorToUIntArgb,
    NativeTextAnnotation,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EMultiLineAlignment,
    Thickness,
    CustomChartModifier2D,
    translateFromCanvasToSeriesViewRect,
    LegendModifier,
    ELegendPlacement,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    ZoomExtentsModifier,
    SciChartJsNavyTheme
} = SciChart;
// or, for npm, import { SciChartSurface, ... } from "scichart"

// 1. FORCE-DIRECTED LAYOUT (plain JavaScript, no SciChart code)
// Takes { nodes: [{ id, name, group }], links: [{ source, target }] } and gives every node an x and y.
// Every pair of nodes pushes apart, every link pulls its two ends together like a spring, and a weak pull
// towards the centre keeps separate pieces in view. Each step moves nodes less (cooling), until they settle.
function createForceLayout(data, options) {
    const { size = 1000, iterations = 300, gravity = 0.06, seed = 1 } = options || {};
    let state = seed;
    const random = () => {
        state = (state * 16807) % 2147483647; // seeded, so the layout is the same every time
        return state / 2147483647;
    };
    const nodes = data.nodes.map((node, index) => ({
        ...node,
        index,
        x: (random() - 0.5) * size,
        y: (random() - 0.5) * size,
        fixed: false, // true while a node is being dragged
        neighbours: [], // the nodes this one is linked to
        degree: 0 // number of connections
    }));
    const nodeById = new Map();
    nodes.forEach((node) => nodeById.set(node.id, node));
    const links = data.links.map((link) => {
        const source = nodeById.get(link.source);
        const target = nodeById.get(link.target);
        if (!source || !target) throw new Error(`Unknown node in link ${link.source} - ${link.target}`);
        source.neighbours.push(target);
        target.neighbours.push(source);
        return { source, target };
    });
    nodes.forEach((node) => (node.degree = node.neighbours.length));

    const k = Math.sqrt((size * size) / nodes.length) * 0.6; // the preferred distance between nodes

    // One step of the Fruchterman-Reingold method: no node moves further than `temperature`
    function step(temperature) {
        const moveX = new Float64Array(nodes.length);
        const moveY = new Float64Array(nodes.length);
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.max(Math.hypot(dx, dy), 0.01);
                const push = (k * k) / distance; // repulsion: strong when close
                moveX[i] += (dx / distance) * push;
                moveY[i] += (dy / distance) * push;
                moveX[j] -= (dx / distance) * push;
                moveY[j] -= (dy / distance) * push;
            }
        }
        links.forEach(({ source, target }) => {
            const dx = source.x - target.x;
            const dy = source.y - target.y;
            const distance = Math.max(Math.hypot(dx, dy), 0.01);
            const pull = (distance * distance) / k; // attraction: strong when far apart
            moveX[source.index] -= (dx / distance) * pull;
            moveY[source.index] -= (dy / distance) * pull;
            moveX[target.index] += (dx / distance) * pull;
            moveY[target.index] += (dy / distance) * pull;
        });
        nodes.forEach((node) => {
            if (node.fixed) return;
            const mx = moveX[node.index] - node.x * gravity * k * 0.05;
            const my = moveY[node.index] - node.y * gravity * k * 0.05;
            const length = Math.max(Math.hypot(mx, my), 0.01);
            const distance = Math.min(length, temperature);
            node.x += (mx / length) * distance;
            node.y += (my / length) * distance;
        });
    }

    // Settle the layout before the first draw: start hot, cool down step by step
    for (let i = 0; i < iterations; i++) step((size / 10) * (1 - i / iterations) + 0.5);

    return { nodes, links, step };
}

// 2. TURN THE LAYOUT INTO SCICHART SERIES
// All edges in one FastLineSegmentRenderableSeries (an XyxyDataSeries holds x1, y1, x2, y2 per segment),
// plus one for the highlighted edges. One FastBubbleRenderableSeries per group, so the legend names the colours.
function addNetworkSeries(sciChartSurface, wasmContext, layout, groups) {
    // Blend a colour towards the chart background, to fade a node without transparency
    const mixColors = (color, background, amount) => {
        const channel = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
        const mixed = [0, 1, 2].map((i) => Math.round(channel(color, i) * (1 - amount) + channel(background, i) * amount));
        return "#" + mixed.map((value) => value.toString(16).padStart(2, "0")).join("");
    };

    const edgeData = new XyxyDataSeries(wasmContext);
    const highlightData = new XyxyDataSeries(wasmContext);
    const edgeSeries = new FastLineSegmentRenderableSeries(wasmContext, {
        dataSeries: edgeData,
        stroke: "#A9B8D0",
        strokeThickness: 1.5,
        opacity: 0.45
    });
    const highlightSeries = new FastLineSegmentRenderableSeries(wasmContext, {
        dataSeries: highlightData,
        stroke: "#FFFFFF",
        strokeThickness: 2.5
    });
    sciChartSurface.renderableSeries.add(edgeSeries, highlightSeries);

    let focus = null; // the node under the mouse, or null
    const isActive = (node) => !focus || node === focus || focus.neighbours.includes(node);

    const nodeSeries = groups.map((group) => {
        const members = layout.nodes.filter((node) => node.group === group.id);
        const normal = { fill: parseColorToUIntArgb(group.color), stroke: parseColorToUIntArgb("#FFFFFF") };
        const faded = { fill: parseColorToUIntArgb(mixColors(group.color, "#1F2A44", 0.7)), stroke: 0 };
        // Fade every node that isn't the hovered node or one of its neighbours
        const paletteProvider = {
            strokePaletteMode: EStrokePaletteMode.SOLID,
            onAttached: () => {},
            onDetached: () => {},
            overridePointMarkerArgb: (x, y, index) => (isActive(members[index]) ? normal : faded)
        };
        const dataSeries = new XyzDataSeries(wasmContext, { dataSeriesName: group.name });
        sciChartSurface.renderableSeries.add(
            new FastBubbleRenderableSeries(wasmContext, {
                dataSeries,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 64, height: 64, fill: group.color, strokeThickness: 0 }),
                stroke: group.color, // the legend's colour swatch
                paletteProvider
            })
        );
        return { members, dataSeries };
    });

    // Copy the node positions into the series. Call it after the layout moves or the focus changes.
    function update() {
        const lines = { x1: [], y1: [], x2: [], y2: [] };
        const bright = { x1: [], y1: [], x2: [], y2: [] };
        layout.links.forEach(({ source, target }) => {
            const into = focus && (source === focus || target === focus) ? bright : lines;
            into.x1.push(source.x);
            into.y1.push(source.y);
            into.x2.push(target.x);
            into.y2.push(target.y);
        });
        edgeData.clear();
        edgeData.appendRange(lines.x1, lines.y1, lines.x2, lines.y2);
        edgeSeries.opacity = focus ? 0.15 : 0.45;
        highlightData.clear();
        highlightData.appendRange(bright.x1, bright.y1, bright.x2, bright.y2);
        nodeSeries.forEach(({ members, dataSeries }) => {
            dataSeries.clear();
            dataSeries.appendRange(
                members.map((node) => node.x),
                members.map((node) => node.y),
                members.map((node) => 12 + 2.2 * node.degree) // bubble size in pixels: bigger = more connections
            );
        });
    }

    function setFocus(node) {
        focus = node;
        update();
    }

    update();
    return { update, setFocus, edgeSeries, highlightSeries };
}

// 3. HOVER AND DRAG
// Hover over a node to highlight it, its links and its neighbours, with a tooltip. Drag a node to move it:
// the layout runs again while you drag, so its neighbours follow.
class NetworkModifier extends CustomChartModifier2D {
    layout;
    network;
    groups;
    tooltip;
    hovered = null;
    dragged = null;
    temperature = 0;
    animating = false;

    constructor(layout, network, groups) {
        super();
        this.layout = layout;
        this.network = network;
        this.groups = groups;
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

    // Mouse position in data units, or null outside the plot area
    toDataPoint(mousePoint) {
        const point = translateFromCanvasToSeriesViewRect(mousePoint, this.parentSurface.seriesViewRect);
        if (!point) return null;
        const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        const yCalc = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator();
        return { x: xCalc.getDataValue(point.x), y: yCalc.getDataValue(point.y), xCalc, yCalc };
    }

    // The nearest node within about 14 pixels of the mouse, or null
    findNode(mousePoint) {
        const point = this.toDataPoint(mousePoint);
        if (!point) return null;
        let best = null;
        let bestDistance = Infinity;
        this.layout.nodes.forEach((node) => {
            const dx = point.xCalc.getCoordinate(node.x) - point.xCalc.getCoordinate(point.x);
            const dy = point.yCalc.getCoordinate(node.y) - point.yCalc.getCoordinate(point.y);
            const distance = Math.hypot(dx, dy);
            if (distance < bestDistance) {
                best = node;
                bestDistance = distance;
            }
        });
        return bestDistance <= 14 * (window.devicePixelRatio || 1) ? best : null;
    }

    describe(node) {
        const groupName = (id) => this.groups.find((group) => group.id === id).name;
        const otherTeams = [...new Set(node.neighbours.map((n) => n.group).filter((g) => g !== node.group))];
        const lines = [`${node.name} (${groupName(node.group)})`, `${node.degree} connection${node.degree === 1 ? "" : "s"}`];
        if (otherTeams.length) lines.push(`Bridge to ${otherTeams.map(groupName).join(", ")}`);
        return lines.join("\n");
    }

    showTooltip(node) {
        this.tooltip.isHidden = !node;
        if (!node) return;
        const xRange = this.parentSurface.xAxes.get(0).visibleRange;
        const yRange = this.parentSurface.yAxes.get(0).visibleRange;
        const nearRightEdge = node.x > xRange.min + xRange.diff * 0.65;
        this.tooltip.text = this.describe(node);
        this.tooltip.horizontalAnchorPoint = nearRightEdge ? EHorizontalAnchorPoint.Right : EHorizontalAnchorPoint.Left;
        this.tooltip.x1 = node.x + xRange.diff * (nearRightEdge ? -0.015 : 0.015);
        this.tooltip.y1 = node.y + yRange.diff * 0.03;
    }

    // Run the layout a step per frame, cooling down, until it settles
    animate() {
        if (this.animating) return;
        this.animating = true;
        const frame = () => {
            if (!this.parentSurface || this.parentSurface.isDeleted) return;
            this.layout.step(this.temperature);
            this.temperature *= 0.94;
            if (this.dragged) this.temperature = Math.max(this.temperature, 6);
            this.network.update();
            this.showTooltip(this.dragged ?? this.hovered);
            if (this.temperature > 0.3) requestAnimationFrame(frame);
            else this.animating = false;
        };
        requestAnimationFrame(frame);
    }

    modifierMouseDown(args) {
        super.modifierMouseDown(args);
        const node = this.findNode(args.mousePoint);
        if (!node) return;
        this.dragged = node;
        node.fixed = true;
        args.handled = true; // stop ZoomPanModifier panning the chart
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        if (this.dragged) {
            const point = this.toDataPoint(args.mousePoint);
            if (point) {
                this.dragged.x = point.x;
                this.dragged.y = point.y;
                this.temperature = Math.max(this.temperature, 20);
                this.animate();
            }
            args.handled = true;
            return;
        }
        const node = this.findNode(args.mousePoint);
        if (node !== this.hovered) {
            this.hovered = node;
            this.network.setFocus(node);
        }
        this.showTooltip(node);
    }

    modifierMouseUp(args) {
        super.modifierMouseUp(args);
        if (!this.dragged) return;
        this.dragged.fixed = false;
        this.dragged = null;
        args.handled = true;
    }

    modifierMouseLeave(args) {
        super.modifierMouseLeave(args);
        if (this.dragged) this.dragged.fixed = false;
        this.dragged = null;
        this.hovered = null;
        this.network.setFocus(null);
        this.showTooltip(null);
    }
}

// 4. THE CHART
async function networkGraph(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Your data: nodes, links and the groups that colour the nodes
    const data = getTeamNetworkData();
    const layout = createForceLayout(data, { size: 1000, seed: 7 });

    // The axes only set the drawing area. They're hidden: a node's x and y have no meaning of their own.
    // Extra space at the bottom keeps the nodes clear of the chart's bottom-left corner.
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.06, 0.06) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.12, 0.06) }));

    const network = addNetworkSeries(sciChartSurface, wasmContext, layout, data.groups);

    // Hover to highlight a node's neighbours, drag a node to move it, scroll to zoom, drag the background to pan,
    // double-click to reset. The legend says what each colour means.
    const legend = new LegendModifier({ showCheckboxes: false, placement: ELegendPlacement.TopRight });
    sciChartSurface.chartModifiers.add(
        new NetworkModifier(layout, network, data.groups),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        legend
    );
    // The legend lists the groups only, not the two edge series
    legend.includeSeries(network.edgeSeries, false);
    legend.includeSeries(network.highlightSeries, false);
}
// #region_A_end

networkGraph("scichart-root");
