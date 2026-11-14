import * as SciChart from "scichart";

// Example data: 150 electric cars of three types, generated with a seeded random generator.
// Illustrative numbers with realistic shapes, not real models or measurements.
function getElectricCarData() {
    let seed = 7;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const noise = sd => (random() + random() + random() - 1.5) * sd * 2;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const types = [
        { name: "City car", color: "#50C7E0", sizeFrom: 0, sizeTo: 0.35 },
        { name: "Saloon", color: "#F48420", sizeFrom: 0.3, sizeTo: 0.85 },
        { name: "SUV", color: "#E8336D", sizeFrom: 0.45, sizeTo: 1 }
    ];
    const records = [];
    types.forEach((type, typeIndex) => {
        for (let i = 1; i <= 50; i++) {
            // "size" drives most values, so bigger cars cost more, carry bigger batteries and weigh more
            const size = type.sizeFrom + random() * (type.sizeTo - type.sizeFrom);
            const battery = clamp(32 + 68 * size + noise(3), 30, 100);
            const energyUse = clamp([135 + 20 * size, 145 + 25 * size, 175 + 45 * size][typeIndex] + noise(7), 120, 240);
            const weight = clamp([1150, 1650, 1950][typeIndex] + [600, 600, 800][typeIndex] * size + noise(50), 1000, 2800);
            const acceleration = clamp([11.5 - 6 * size, 7 - 4 * size, 8.5 - 4 * size][typeIndex] + noise(0.45), 3, 12);
            const price = clamp([24 + 30 * size, 38 + 60 * size, 45 + 55 * size][typeIndex] + noise(3), 20, 100);
            records.push({
                name: `${type.name} ${i}`,
                type: typeIndex,
                values: [
                    Math.round(price),
                    Math.round(battery),
                    clamp(Math.round((battery * 1000) / energyUse), 200, 600),
                    Math.round(acceleration * 10) / 10,
                    Math.round(weight / 10) * 10,
                    Math.round(energyUse)
                ]
            });
        }
    });
    return {
        // One entry per vertical axis: its title (with unit) and fixed range
        dimensions: [
            { title: "Price ($k)", min: 20, max: 100 },
            { title: "Battery (kWh)", min: 30, max: 100 },
            { title: "Range (km)", min: 200, max: 600 },
            { title: "0–100 km/h (s)", min: 3, max: 12 },
            { title: "Weight (kg)", min: 1000, max: 2800 },
            { title: "Energy use (Wh/km)", min: 120, max: 240 }
        ],
        types,
        records
    };
}

// #region_A_start
// Create a JavaScript parallel coordinates plot with SciChart.js: one vertical axis per dimension, one line per record
const {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    XyDataSeries,
    FastLineRenderableSeries,
    NativeTextAnnotation,
    BoxAnnotation,
    LineAnnotation,
    EAxisAlignment,
    EAutoRange,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EMultiLineAlignment,
    EXyDirection,
    Thickness,
    Rect,
    LeftAlignedInnerAxisLayoutStrategy,
    layoutAxisParts,
    layoutAxisPartsLeftStrategy,
    getCoordinateWithCoordinateMode,
    translateFromCanvasToSeriesViewRect,
    CustomChartModifier2D,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    ZoomExtentsModifier,
    SciChartJsNavyTheme
} = SciChart;

// Every value is drawn on one hidden 0 to 1 scale. The space below 0 holds the legend, above 1 the axis titles.
const HIDDEN_Y_AXIS_ID = "normalised";
const HIDDEN_Y_RANGE = new NumberRange(-0.16, 1.1);

// 1. ONE VERTICAL AXIS PER DIMENSION
// A layout strategy that places inner axis number i at x = i, and squeezes it to the 0 to 1 band of the
// hidden scale, so each axis's own range (e.g. 20 to 100) lines up exactly with the normalised lines.
class ParallelAxesLayoutStrategy extends LeftAlignedInnerAxisLayoutStrategy {
    constructor(options) {
        super(options);
        this.layoutAxisPartsStrategy = layoutAxisPartsLeftStrategy; // axis line on the left, labels to its right
    }

    measureAxes(sciChartSurface, chartLayoutState, axes) {
        this.sciChartSurface = sciChartSurface;
        axes.forEach(axis => {
            axis.measure();
            this.updateAxisLayoutState(axis);
        });
        return 0; // the axes sit inside the plot area, so they reserve no space round it
    }

    updateAreaSize(chartLayoutState, requiredSize) {
        chartLayoutState.leftInnerAreaSize = 0;
    }

    layoutAxes(left, top, right, bottom, axes) {
        const xAxis = this.sciChartSurface.getXAxisById(this.orthogonalAxisId);
        const xCalc = xAxis.getCurrentCoordinateCalculator();
        const height = bottom - top;
        const yToPixel = value => top + ((HIDDEN_Y_RANGE.max - value) / HIDDEN_Y_RANGE.diff) * height;
        const axisTop = yToPixel(1);
        const axisBottom = yToPixel(0);
        axes.forEach((axis, index) => {
            const x = getCoordinateWithCoordinateMode(index, xCalc, this.coordinateMode) + xAxis.parentSurface.seriesViewRect.left;
            axis.offset = axisTop - top;
            axis.axisLength = axisBottom - axisTop;
            axis.viewRect = Rect.createWithCoords(x, axisTop, x + axis.axisRenderer.desiredWidth, axisBottom);
            layoutAxisParts(axis, this.layoutAxisPartsStrategy);
        });
    }
}

// 2. HOVER AND BRUSHING
// Hover: finds the line nearest the mouse, draws it on top and shows all its values.
// Brushing: drag up or down along an axis to keep only the lines that pass through that range. Click the axis to clear.
class ParallelCoordinatesModifier extends CustomChartModifier2D {
    plot;
    hovered = -1;
    brushes = new Map(); // dimension index -> { from, to, box } on the 0 to 1 scale
    dragging = null;
    tooltip;
    highlightSeries;

    constructor(plot) {
        super();
        this.plot = plot;
    }

    onAttach() {
        super.onAttach();
        const surface = this.parentSurface;
        this.tooltip = new NativeTextAnnotation({
            yAxisId: HIDDEN_Y_AXIS_ID,
            text: "",
            isHidden: true,
            textColor: "#FFFFFF",
            fontSize: 14,
            background: "#0F1A2B",
            multiLineAlignment: EMultiLineAlignment.Left,
            padding: new Thickness(6, 10, 6, 10),
            lineSpacing: 3,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom
        });
        this.highlightSeries = new FastLineRenderableSeries(surface.webAssemblyContext2D, {
            yAxisId: HIDDEN_Y_AXIS_ID,
            dataSeries: new XyDataSeries(surface.webAssemblyContext2D),
            strokeThickness: 4,
            isVisible: false
        });
        surface.renderableSeries.add(this.highlightSeries);
        surface.annotations.add(this.tooltip);
    }

    // Mouse position as data values: x along the axes (0, 1, 2...), y on the hidden 0 to 1 scale
    toDataPoint(mousePoint) {
        const surface = this.parentSurface;
        const point = translateFromCanvasToSeriesViewRect(mousePoint, surface.seriesViewRect);
        if (!point) return null;
        return {
            px: point.x,
            py: point.y,
            x: surface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(point.x),
            y: surface.getYAxisById(HIDDEN_Y_AXIS_ID).getCurrentCoordinateCalculator().getDataValue(point.y)
        };
    }

    // Index of the axis within 12 pixels of the mouse, or -1
    axisUnderMouse(p) {
        const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        const index = Math.round(p.x);
        const inRange = index >= 0 && index < this.plot.dimensions.length;
        return inRange && Math.abs(xCalc.getCoordinate(index) - p.px) < 12 ? index : -1;
    }

    // Index of the visible record whose line passes closest to the mouse (within 8 pixels), or -1
    recordUnderMouse(p) {
        const yCalc = this.parentSurface.getYAxisById(HIDDEN_Y_AXIS_ID).getCurrentCoordinateCalculator();
        const left = Math.floor(p.x);
        const t = p.x - left;
        if (left < 0 || left >= this.plot.dimensions.length - 1) return -1;
        let best = -1;
        let bestDistance = 8;
        this.plot.normalised.forEach((values, index) => {
            if (!this.isKept(index)) return;
            const y = values[left] + (values[left + 1] - values[left]) * t; // the line's height at the mouse
            const distance = Math.abs(yCalc.getCoordinate(y) - p.py);
            if (distance < bestDistance) {
                bestDistance = distance;
                best = index;
            }
        });
        return best;
    }

    // A record is kept when it passes through every brushed range
    isKept(index) {
        const values = this.plot.normalised[index];
        for (const [dimension, brush] of this.brushes) {
            if (values[dimension] < brush.from || values[dimension] > brush.to) return false;
        }
        return true;
    }

    // Faint lines for filtered-out records, normal lines for the rest, a thick line on top for the hovered one
    updateStyles() {
        this.plot.series.forEach((series, index) => {
            series.opacity = this.isKept(index) ? (this.brushes.size ? 0.85 : 0.55) : 0.06;
        });
        const record = this.plot.records[this.hovered];
        this.highlightSeries.isVisible = !!record;
        this.tooltip.isHidden = !record;
        if (!record) return;
        const dataSeries = this.highlightSeries.dataSeries;
        dataSeries.clear();
        dataSeries.appendRange(this.plot.normalised[this.hovered].map((_, i) => i), this.plot.normalised[this.hovered]);
        this.highlightSeries.stroke = this.plot.types[record.type].color;
        this.tooltip.text = [record.name, ...this.plot.dimensions.map((d, i) => `${d.title}: ${record.values[i]}`)].join("\n");
    }

    setBrush(dimension, from, to) {
        let brush = this.brushes.get(dimension);
        if (!brush) {
            const box = new BoxAnnotation({
                yAxisId: HIDDEN_Y_AXIS_ID,
                fill: "#FFFFFF33",
                stroke: "#FFFFFF",
                strokeThickness: 1,
                x1: dimension - 0.05,
                x2: dimension + 0.05
            });
            this.parentSurface.annotations.add(box);
            brush = { from, to, box };
            this.brushes.set(dimension, brush);
        }
        brush.from = Math.max(0, Math.min(from, to));
        brush.to = Math.min(1, Math.max(from, to));
        brush.box.y1 = brush.from;
        brush.box.y2 = brush.to;
    }

    clearBrush(dimension) {
        const brush = this.brushes.get(dimension);
        if (!brush) return;
        this.parentSurface.annotations.remove(brush.box);
        brush.box.delete();
        this.brushes.delete(dimension);
    }

    modifierMouseDown(args) {
        super.modifierMouseDown(args);
        const p = this.toDataPoint(args.mousePoint);
        const dimension = p ? this.axisUnderMouse(p) : -1;
        if (dimension < 0) return; // not on an axis: let the pan modifier have the drag
        this.dragging = { dimension, startY: p.y, startPx: p.py, moved: false };
        args.handled = true;
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        const p = this.toDataPoint(args.mousePoint);
        if (!p) return;
        if (this.dragging) {
            if (Math.abs(p.py - this.dragging.startPx) > 4) this.dragging.moved = true;
            if (this.dragging.moved) this.setBrush(this.dragging.dimension, this.dragging.startY, p.y);
            this.hovered = -1;
            args.handled = true;
        } else {
            this.hovered = this.recordUnderMouse(p);
            if (this.hovered >= 0) {
                // Tooltip just above the mouse, flipped to the left in the right half of the chart
                const nearRight = p.x > (this.plot.dimensions.length - 1) / 2;
                this.tooltip.horizontalAnchorPoint = nearRight ? EHorizontalAnchorPoint.Right : EHorizontalAnchorPoint.Left;
                this.tooltip.x1 = p.x + (nearRight ? -0.08 : 0.08);
                this.tooltip.y1 = Math.min(p.y + 0.04, 0.95);
            }
        }
        this.parentSurface.domCanvas2D.style.cursor = this.dragging || (this.axisUnderMouse(p) >= 0) ? "ns-resize" : "default";
        this.updateStyles();
    }

    modifierMouseUp(args) {
        super.modifierMouseUp(args);
        if (!this.dragging) return;
        if (!this.dragging.moved) this.clearBrush(this.dragging.dimension); // a click on an axis clears its brush
        this.dragging = null;
        args.handled = true;
        this.updateStyles();
    }

    modifierMouseLeave(args) {
        super.modifierMouseLeave(args);
        this.hovered = -1;
        this.updateStyles();
    }
}

// 3. AXES, LINES AND LEGEND
// data: { dimensions: [{ title, min, max }], types: [{ name, color }], records: [{ name, type, values }] }
// Adds the hidden scales, one visible axis per dimension and one line per record. Returns what the modifier needs.
function addParallelCoordinates(sciChartSurface, wasmContext, data) {
    const { dimensions, types, records } = data;

    // Hidden X axis: axis number i sits at x = i. Extra room on the right for the last axis's labels.
    const xAxis = new NumericAxis(wasmContext, { isVisible: false, growBy: new NumberRange(0.05, 0.1) });
    sciChartSurface.xAxes.add(xAxis);

    // Hidden Y axis: every line is drawn on this 0 to 1 scale
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: HIDDEN_Y_AXIS_ID,
            isVisible: false,
            autoRange: EAutoRange.Never,
            visibleRange: HIDDEN_Y_RANGE
        })
    );

    // One visible axis per dimension, with its own range and labels, placed by the layout strategy
    sciChartSurface.layoutManager.leftInnerAxesLayoutStrategy = new ParallelAxesLayoutStrategy({ orthogonalAxisId: xAxis.id });
    dimensions.forEach((dimension, i) => {
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                id: `dimension-${i}`,
                isInnerAxis: true,
                axisAlignment: EAxisAlignment.Left,
                autoRange: EAutoRange.Never,
                visibleRange: new NumberRange(dimension.min, dimension.max),
                maxAutoTicks: 6,
                labelPrecision: 0,
                drawMajorGridLines: false,
                drawMinorGridLines: false,
                drawMajorBands: false,
                drawMinorTickLines: false,
                axisBorder: { borderLeft: 2, color: "#C8D2E0" },
                labelStyle: { fontSize: 13, color: "#C8D2E0" }
            })
        );
        // Axis title above the axis
        sciChartSurface.annotations.add(
            new NativeTextAnnotation({
                yAxisId: HIDDEN_Y_AXIS_ID,
                x1: i,
                y1: 1.03,
                text: dimension.title,
                fontSize: 15,
                textColor: "#FFFFFF",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Bottom
            })
        );
    });

    // Normalise every value to 0 to 1 on its own axis, then draw one line per record, coloured by type
    const normalised = records.map(record =>
        record.values.map((value, i) => (value - dimensions[i].min) / (dimensions[i].max - dimensions[i].min))
    );
    const series = normalised.map((values, index) => {
        const line = new FastLineRenderableSeries(wasmContext, {
            yAxisId: HIDDEN_Y_AXIS_ID,
            dataSeries: new XyDataSeries(wasmContext, { xValues: values.map((_, i) => i), yValues: values }),
            stroke: types[records[index].type].color,
            strokeThickness: 1.5,
            opacity: 0.55
        });
        sciChartSurface.renderableSeries.add(line);
        return line;
    });

    // Legend below the axes: a short line and a label for each type
    types.forEach((type, i) => {
        const x = (dimensions.length - 1) / 2 + 0.4 + (i - 1) * 1.1; // right of centre, clear of the logo
        sciChartSurface.annotations.add(
            new LineAnnotation({ yAxisId: HIDDEN_Y_AXIS_ID, x1: x - 0.3, x2: x - 0.12, y1: -0.09, y2: -0.09, stroke: type.color, strokeThickness: 4 }),
            new NativeTextAnnotation({
                yAxisId: HIDDEN_Y_AXIS_ID,
                x1: x - 0.08,
                y1: -0.09,
                text: type.name,
                fontSize: 15,
                textColor: "#FFFFFF",
                verticalAnchorPoint: EVerticalAnchorPoint.Center
            })
        );
    });

    return { dimensions, types, records, normalised, series };
}

// 4. THE CHART
async function parallelCoordinatesPlot(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const plot = addParallelCoordinates(sciChartSurface, wasmContext, getElectricCarData());

    // Hover a line for its values, drag along an axis to filter, scroll to zoom, drag elsewhere to pan,
    // double-click to reset. Zoom and pan act sideways only, so each axis keeps its scale.
    sciChartSurface.chartModifiers.add(
        new ParallelCoordinatesModifier(plot),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    );
}
// #region_A_end

parallelCoordinatesPlot("scichart-root");
