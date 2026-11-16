import * as SciChart from "scichart";

// Example data: the space used on a laptop's 1 TB drive, by folder, in gigabytes (GB).
// Illustrative numbers. Only the outermost items (the leaves) carry a value; each folder's size is the sum of its contents.
function getDiskUsageData() {
    return {
        name: "Used space",
        children: [
            {
                name: "Videos",
                children: [
                    { name: "Family", children: [{ name: "2024", value: 70 }, { name: "2025", value: 50 }] },
                    { name: "Projects", children: [{ name: "Drone", value: 60 }, { name: "Recordings", value: 40 }] }
                ]
            },
            {
                name: "Photos",
                children: [
                    { name: "Phone", children: [{ name: "2024", value: 40 }, { name: "2025", value: 50 }] },
                    { name: "RAW", children: [{ name: "Holiday", value: 35 }, { name: "Studio", value: 25 }] }
                ]
            },
            {
                name: "Apps",
                children: [
                    { name: "Games", value: 70 },
                    { name: "Creative", value: 25 },
                    { name: "Utilities", value: 15 }
                ]
            },
            {
                name: "System",
                children: [
                    { name: "OS", value: 45 },
                    { name: "Caches", value: 30 },
                    { name: "Swap", value: 25 }
                ]
            },
            {
                name: "Documents",
                children: [
                    { name: "Work", children: [{ name: "Reports", value: 20 }, { name: "Data", value: 15 }] },
                    { name: "Personal", value: 25 }
                ]
            }
        ]
    };
}

// #region_A_start
// Create a JavaScript sunburst chart with SciChart.js: one polar column series per ring (hierarchy level)
const {
    SciChartPolarSurface,
    PolarNumericAxis,
    PolarColumnRenderableSeries,
    XyxDataSeries,
    NumberRange,
    EPolarAxisMode,
    EAxisAlignment,
    EColumnMode,
    EDataPointWidthMode,
    EPolarLabelMode,
    EColumnDataLabelPosition,
    EFillPaletteMode,
    EStrokePaletteMode,
    EMultiLineAlignment,
    NativeTextAnnotation,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    CustomChartModifier2D,
    EModifierType,
    parseColorToUIntArgb,
    SciChartJsNavyTheme
} = SciChart;

// One colour per top-level branch. Deeper rings use lighter tints of their branch's colour.
const BRANCH_COLORS = ["#F48420", "#50C7E0", "#30BC9A", "#E8336D", "#9B7BD4"];

// Mixes a "#RRGGBB" colour with white: amount 0 keeps the colour, 1 gives white
function tint(hex, amount) {
    const channel = i => {
        const c = parseInt(hex.slice(i, i + 2), 16);
        return Math.round(c + (255 - c) * amount)
            .toString(16)
            .padStart(2, "0");
    };
    return `#${channel(1)}${channel(3)}${channel(5)}`;
}

// A node's value: its own value if it is a leaf, otherwise the sum of its children
function nodeValue(node) {
    return node.children?.length ? node.children.reduce((sum, child) => sum + nodeValue(child), 0) : node.value ?? 0;
}

// Plain JavaScript, no SciChart: turns a JSON tree ({ name, value?, children? }) into rings of segments.
// rings[0] holds the root's children, rings[1] their children, and so on. Each segment runs from
// start to end on a 0..total scale, so its angle is in proportion to its value.
// Optional: colors (a Map from node to colour, to keep colours when drilling down) and basePath (the root's own path).
function buildSunburstRings(root, { branchColors = BRANCH_COLORS, colors = null, basePath = [] } = {}) {
    const total = nodeValue(root);
    const rings = [];
    const visit = (node, depth, start, parentValue, branchIndex, path) => {
        const value = nodeValue(node);
        if (depth > 0) {
            if (!rings[depth - 1]) rings[depth - 1] = [];
            rings[depth - 1].push({
                name: node.name,
                path,
                node,
                depth,
                value,
                start,
                end: start + value,
                shareOfParent: value / parentValue,
                shareOfTotal: value / total,
                hasChildren: !!node.children?.length,
                color: colors?.get(node) ?? tint(branchColors[branchIndex % branchColors.length], (depth - 1) * 0.3)
            });
        }
        let childStart = start;
        (node.children ?? []).forEach((child, i) => {
            // The colour is set by the top-level branch, so a whole branch shares one hue
            visit(child, depth + 1, childStart, value, depth === 0 ? i : branchIndex, [...path, child.name]);
            childStart += nodeValue(child);
        });
    };
    visit(root, 0, 0, total, 0, basePath);
    return { total, rings };
}

// Colours each segment from its metadata, and fades the segments that aren't highlighted
class SunburstPaletteProvider {
    strokePaletteMode = EStrokePaletteMode.SOLID;
    fillPaletteMode = EFillPaletteMode.SOLID;
    onAttached() {}
    onDetached() {}
    overrideFillArgb(xValue, yValue, index, opacity, metadata) {
        return metadata.isDimmed ? metadata.dimArgb : metadata.argb;
    }
    overrideStrokeArgb() {
        return undefined;
    }
}

// Labels segments wide enough to hold text; hovering shows the rest
const segmentLabel = md => (md.shareOfTotal >= 0.04 ? md.name : "");

// Draws the rings: a centre disc for the current root, then one PolarColumnRenderableSeries per level
function drawSunburst(sciChartSurface, wasmContext, root, { units = "", centreColor = "#1C2A44", colors = null, basePath = [] } = {}) {
    const { total, rings } = buildSunburstRings(root, { colors, basePath });
    const segmentsByRing = [[{ name: root.name, path: basePath, node: root, depth: 0, value: total, start: 0, end: total, shareOfParent: 1, shareOfTotal: 1, hasChildren: true, color: centreColor, isCentre: true }], ...rings];

    // Remove the previous rings (when drilling down or back up)
    sciChartSurface.renderableSeries.asArray().forEach(rs => rs.delete());
    sciChartSurface.renderableSeries.clear();

    // Angle: 0..total all the way round. Radius: the centre disc is 0..1, ring n is n..n+1
    sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(0, total);
    sciChartSurface.yAxes.get(0).visibleRange = new NumberRange(0, segmentsByRing.length);

    const paletteProvider = new SunburstPaletteProvider();
    const series = segmentsByRing.map((segments, level) => {
        const metadata = segments.map(s => ({
            ...s,
            isSelected: false,
            isDimmed: false,
            argb: parseColorToUIntArgb(s.color),
            dimArgb: parseColorToUIntArgb(s.color, 70)
        }));
        const rs = new PolarColumnRenderableSeries(wasmContext, {
            dataSeries: new XyxDataSeries(wasmContext, {
                xValues: segments.map(s => s.start), // where the segment starts
                x1Values: segments.map(s => s.end), // where it ends
                yValues: segments.map(() => level + 1), // its outer radius
                metadata
            }),
            columnXMode: EColumnMode.StartEnd,
            dataPointWidthMode: EDataPointWidthMode.Range,
            defaultY1: level, // its inner radius
            stroke: "#0B1427",
            strokeThickness: level === 0 ? 0 : 2,
            paletteProvider,
            dataLabels:
                level === 0
                    ? undefined
                    : {
                          style: { fontSize: 15, multiLineAlignment: EMultiLineAlignment.Center },
                          color: "#0B1427",
                          polarLabelMode: EPolarLabelMode.Parallel,
                          labelYPositionMode: EColumnDataLabelPosition.Position,
                          labelYPositionMultiplier: 0.5,
                          metaDataSelector: segmentLabel
                      }
        });
        sciChartSurface.renderableSeries.add(rs);
        return rs;
    });
    return { root, total, units, series };
}

// Hover: highlights a segment, its parents and its children, and shows its value in the centre.
// Click: drills into a segment with children; click the centre to go back up.
class SunburstModifier extends CustomChartModifier2D {
    wasmContext;
    options;
    data;
    colors;
    label;
    sunburst;
    history = [];
    mouseDownPoint = null;

    constructor(wasmContext, data, options = {}) {
        super();
        this.wasmContext = wasmContext;
        this.options = options;
        this.data = data;
        // Work out every segment's colour once, from the full tree, so colours stay the same when drilling down
        this.colors = new Map(buildSunburstRings(data).rings.flat().map(s => [s.node, s.color]));
        this.label = new NativeTextAnnotation({
            x1: 0,
            y1: 0,
            text: "",
            textColor: "#FFFFFF",
            fontSize: 16,
            multiLineAlignment: EMultiLineAlignment.Center,
            lineSpacing: 4,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center
        });
    }

    // Lets this modifier attach to a polar surface
    get modifierType() {
        return EModifierType.Chart2DPolarModifier;
    }

    onAttach() {
        super.onAttach();
        this.parentSurface.annotations.add(this.label);
        this.show(this.data, []);
    }

    onDetach() {
        this.parentSurface?.annotations.remove(this.label);
        super.onDetach();
    }

    show(root, basePath) {
        this.sunburst = drawSunburst(this.parentSurface, this.wasmContext, root, { ...this.options, colors: this.colors, basePath });
        this.sunburst.basePath = basePath;
        this.describe(null);
    }

    // Returns the segment under the mouse, or null
    hitTestSegment(mousePoint) {
        for (const rs of this.sunburst.series) {
            const info = rs.hitTestProvider.hitTest(mousePoint.x, mousePoint.y);
            if (info.isHit) return rs.dataSeries.getMetadataAt(info.dataSeriesIndex);
        }
        return null;
    }

    describe(segment) {
        const { total, units, root } = this.sunburst;
        const fmt = v => `${v.toLocaleString()} ${units}`.trim();
        const back = this.history.length ? "\nClick to go back" : "";
        if (!segment || segment.isCentre) {
            this.label.text = `${root.name}\n${fmt(total)}${back}`;
        } else {
            const ofParent = segment.depth > 1 ? `\n${Math.round(segment.shareOfParent * 100)}% of ${segment.path[segment.path.length - 2]}` : "";
            this.label.text = `${segment.path.join(" › ")}\n${fmt(segment.value)}\n${Math.round(segment.shareOfTotal * 100)}% of ${root.name.toLowerCase()}${ofParent}`;
        }
        // Highlight the segment's own branch: its parents (a prefix of its path) and its children (paths it prefixes)
        const isRelated = md => {
            if (!segment || segment.isCentre || md.isCentre) return true;
            const n = Math.min(md.path.length, segment.path.length);
            return md.path.slice(0, n).join("/") === segment.path.slice(0, n).join("/");
        };
        this.sunburst.series.forEach(rs => {
            for (let i = 0; i < rs.dataSeries.count(); i++) {
                const md = rs.dataSeries.getMetadataAt(i);
                md.isDimmed = !isRelated(md);
            }
        });
        this.parentSurface.invalidateElement();
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        this.describe(this.hitTestSegment(args.mousePoint));
    }

    modifierMouseDown(args) {
        super.modifierMouseDown(args);
        this.mouseDownPoint = args.mousePoint;
    }

    modifierMouseUp(args) {
        super.modifierMouseUp(args);
        const start = this.mouseDownPoint;
        this.mouseDownPoint = null;
        if (!start || Math.hypot(args.mousePoint.x - start.x, args.mousePoint.y - start.y) > 5) return;
        const segment = this.hitTestSegment(args.mousePoint);
        if (segment?.isCentre && this.history.length) {
            const previous = this.history.pop();
            this.show(previous.root, previous.basePath); // back up one level
        } else if (segment && !segment.isCentre && segment.hasChildren) {
            this.history.push({ root: this.sunburst.root, basePath: this.sunburst.basePath });
            this.show(segment.node, segment.path); // drill into this branch
        }
    }

    modifierMouseLeave(args) {
        super.modifierMouseLeave(args);
        this.describe(null);
    }
}

async function sunburstChart(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Angular axis: the value scale round the circle, starting at 12 o'clock. Radial axis: the ring number.
    sciChartSurface.xAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            startAngle: Math.PI / 2,
            flippedCoordinates: true, // clockwise
            isVisible: false
        })
    );
    sciChartSurface.yAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            axisAlignment: EAxisAlignment.Right,
            startAngle: Math.PI / 2,
            isVisible: false
        })
    );

    // { name, children: [{ name, value }] }: only the leaves need a value
    sciChartSurface.chartModifiers.add(new SunburstModifier(wasmContext, getDiskUsageData(), { units: "GB" }));

    return { sciChartSurface, wasmContext };
}
// #region_A_end

sunburstChart("scichart-root");
