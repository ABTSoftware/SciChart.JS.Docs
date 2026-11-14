import * as SciChart from "scichart";

// Example data: a server's CPU load, in percent, read twice a second.
// A seeded random walk, so the gauge moves the same way every time the page loads.
function createCpuLoadFeed(seed = 7) {
    let state = seed;
    const random = () => {
        // mulberry32: a small seeded random number generator
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    // The load drifts towards a target that changes every few seconds: quiet, busy, then a spike
    const targets = [45, 62, 38, 78, 55, 93, 50, 84];
    let value = 45;
    let tick = 0;
    return () => {
        const target = targets[Math.floor(tick / 12) % targets.length];
        tick++;
        value += 0.25 * (target - value) + (random() - 0.5) * 6;
        value = Math.min(100, Math.max(0, value));
        return value;
    };
}

// #region_A_start
// Create a JavaScript gauge chart with SciChart.js: a partial-arc polar chart with coloured bands, a value arc and a needle
const {
    SciChartPolarSurface,
    PolarNumericAxis,
    PolarColumnRenderableSeries,
    XyxyDataSeries,
    PolarArcAnnotation,
    PolarPointerAnnotation,
    NativeTextAnnotation,
    NumberRange,
    EPolarAxisMode,
    EPolarLabelMode,
    EColumnMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EMultiLineAlignment,
    CustomChartModifier2D,
    EModifierType,
    translateFromCanvasToSeriesViewRect,
    SciChartJsNavyTheme
} = SciChart;

// The scale, and the bands that give a reading its meaning
const GAUGE = {
    title: "CPU load",
    units: "%",
    min: 0,
    max: 100,
    sweepDegrees: 240, // how far round the circle the scale runs; the gap is at the bottom
    bands: [
        { from: 0, to: 70, label: "Normal", color: "#3CBF7E" },
        { from: 70, to: 90, label: "High", color: "#F5B83D" },
        { from: 90, to: 100, label: "Critical", color: "#E8505B" }
    ]
};

// Radii, in radial-axis units (the radial axis runs from 0 at the centre to 10 at the edge)
const RING = { inner: 8.7, outer: 10 }; // the coloured bands
const VALUE_ARC = { inner: 6.6, outer: 8.1 }; // the arc that fills up to the current value
const RANGE_ARC = { inner: 8.25, outer: 8.55 }; // the lowest-to-highest reading in the last 30 seconds

const bandFor = value => GAUGE.bands.find(b => value <= b.to) ?? GAUGE.bands[GAUGE.bands.length - 1];

// Draws the gauge. Returns its value axis, and a function that moves the gauge to a new value
function drawGauge(sciChartSurface, wasmContext) {
    const { min, max } = GAUGE;
    const sweep = (GAUGE.sweepDegrees * Math.PI) / 180;

    // Angular axis: the value scale. Clockwise, with the gap centred at the bottom.
    const angularAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(min, max),
        totalAngle: sweep,
        startAngle: (Math.PI - sweep) / 2,
        flippedCoordinates: true,
        autoTicks: false,
        majorDelta: 10,
        minorDelta: 2,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorBands: false,
        drawMajorTickLines: true,
        drawMinorTickLines: true,
        majorTickLineStyle: { color: "#C8D2E0", tickSize: 8, strokeThickness: 2 },
        minorTickLineStyle: { color: "#C8D2E099", tickSize: 4, strokeThickness: 1 },
        polarLabelMode: EPolarLabelMode.Horizontal,
        labelStyle: { color: "#C8D2E0", fontSize: 14 },
        labelPrecision: 0
    });
    // Radial axis: only sets the radii used below, so it is hidden
    const radialAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 10),
        isVisible: false
    });
    sciChartSurface.xAxes.add(angularAxis);
    sciChartSurface.yAxes.add(radialAxis);

    // The bands: one polar column per band, from its start value to its end value
    GAUGE.bands.forEach(band => {
        sciChartSurface.renderableSeries.add(
            new PolarColumnRenderableSeries(wasmContext, {
                dataSeries: new XyxyDataSeries(wasmContext, {
                    xValues: [band.from],
                    x1Values: [band.to],
                    yValues: [RING.inner],
                    y1Values: [RING.outer]
                }),
                columnXMode: EColumnMode.StartEnd,
                fill: band.color,
                stroke: "#0E1525",
                strokeThickness: 2
            })
        );
        // Name each band in words, so the meaning doesn't rely on colour alone
        sciChartSurface.annotations.add(
            new NativeTextAnnotation({
                x1: (band.from + band.to) / 2,
                y1: (RING.inner + RING.outer) / 2,
                text: band.label,
                fontSize: 14,
                textColor: "#0E1525",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Center
            })
        );
    });

    // A faint track for the whole scale, then the value arc on top of it
    const track = new PolarArcAnnotation({ x1: min, x2: max, y1: VALUE_ARC.outer, y2: VALUE_ARC.inner, fill: "#FFFFFF14", stroke: "#00000000", strokeThickness: 0 });
    const valueArc = new PolarArcAnnotation({ x1: min, x2: min, y1: VALUE_ARC.outer, y2: VALUE_ARC.inner, stroke: "#00000000", strokeThickness: 0 });
    const rangeArc = new PolarArcAnnotation({ x1: min, x2: min, y1: RANGE_ARC.outer, y2: RANGE_ARC.inner, fill: "#FFFFFFAA", stroke: "#00000000", strokeThickness: 0 });

    // The needle: a PolarPointerAnnotation points from the centre to x1 (a value), y1 long
    const needle = new PolarPointerAnnotation({
        x1: min,
        y1: 8.4,
        pointerStyle: { baseSize: 0.04, fill: "#FFFFFF", stroke: "#FFFFFF", backExtensionSize: 0.15 },
        pointerCenterStyle: { size: 0.12, fill: "#1B2438", stroke: "#FFFFFF", strokeWidth: 2 },
        pointerArrowStyle: { width: 0, height: 0 }
    });

    // The readout sits in the gap at the bottom. Values past max carry on round the circle,
    // so this x-value points straight down.
    const straightDown = max + ((max - min) * (360 - GAUGE.sweepDegrees)) / 2 / GAUGE.sweepDegrees;
    const readout = new NativeTextAnnotation({
        x1: straightDown,
        y1: 2.4,
        fontSize: 40,
        textColor: "#FFFFFF",
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center
    });
    const caption = new NativeTextAnnotation({
        x1: straightDown,
        y1: 4.4,
        fontSize: 15,
        lineSpacing: 4,
        multiLineAlignment: EMultiLineAlignment.Center,
        textColor: "#C8D2E0",
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center
    });
    sciChartSurface.annotations.add(track, valueArc, rangeArc, needle, readout, caption);

    // Moves the needle, colours the value arc by its band, and updates the text
    const update = (value, recentLow, recentHigh, note) => {
        const band = bandFor(value);
        valueArc.x2 = value;
        valueArc.fill = band.color;
        needle.x1 = value;
        rangeArc.x1 = recentLow;
        rangeArc.x2 = Math.max(recentHigh, recentLow + 0.3);
        readout.text = `${Math.round(value)}${GAUGE.units}`;
        readout.textColor = band.color;
        caption.text = `${GAUGE.title}: ${band.label}\n30 s range ${Math.round(recentLow)}–${Math.round(recentHigh)}${GAUGE.units}${note}`;
    };
    return { angularAxis, update };
}

// Feeds the gauge a new reading twice a second. Click or drag on the gauge to set the value
// yourself; the live feed pauses while you do and resumes 5 seconds later.
class GaugeModifier extends CustomChartModifier2D {
    angularAxis;
    update;
    nextReading;
    history = [];
    value = 0;
    timer = undefined;
    pausedUntil = 0;
    isDragging = false;

    constructor({ angularAxis, update }, nextReading) {
        super();
        this.angularAxis = angularAxis;
        this.update = update;
        this.nextReading = nextReading;
    }

    // Lets this modifier attach to a polar surface
    get modifierType() {
        return EModifierType.Chart2DPolarModifier;
    }

    onAttach() {
        super.onAttach();
        this.show(this.nextReading());
        this.timer = setInterval(() => {
            if (this.isDragging || Date.now() < this.pausedUntil) return;
            this.show(this.nextReading());
        }, 500);
    }

    onDetach() {
        clearInterval(this.timer);
        super.onDetach();
    }

    show(value, note = "") {
        this.value = value;
        this.history.push(value);
        if (this.history.length > 60) this.history.shift(); // 60 readings = 30 seconds
        this.update(value, Math.min(...this.history), Math.max(...this.history), note);
        this.parentSurface.invalidateElement();
    }

    // Converts a mouse position to a value on the scale
    valueAt(mousePoint) {
        const xAxis = this.angularAxis;
        const point = translateFromCanvasToSeriesViewRect(mousePoint, this.parentSurface.seriesViewRect, true);
        if (!point) return undefined;
        const angle = xAxis.reverseTransform(point.x, point.y).x;
        const value = xAxis.getCurrentCoordinateCalculator().getDataValue(angle);
        // In the gap at the bottom, snap to the nearer end of the scale
        if (value < GAUGE.min || value > GAUGE.max) {
            const span = GAUGE.max - GAUGE.min;
            const wrapped = ((((value - GAUGE.min) % (span * 1.5)) + span * 1.5) % (span * 1.5)) + GAUGE.min;
            return wrapped > GAUGE.max + span / 4 ? GAUGE.min : GAUGE.max;
        }
        return value;
    }

    setFromMouse(args) {
        const value = this.valueAt(args.mousePoint);
        if (value === undefined) return;
        this.pausedUntil = Date.now() + 5000;
        this.show(value, "\nSet by you: live again in 5 s");
    }

    modifierMouseDown(args) {
        super.modifierMouseDown(args);
        this.isDragging = true;
        this.setFromMouse(args);
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        if (this.isDragging) this.setFromMouse(args);
    }

    modifierMouseUp(args) {
        super.modifierMouseUp(args);
        this.isDragging = false;
    }

    modifierMouseLeave(args) {
        super.modifierMouseLeave(args);
        this.isDragging = false;
    }
}

async function gaugeChart(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const gauge = drawGauge(sciChartSurface, wasmContext);

    // createCpuLoadFeed() returns the next reading each time it's called; use your own data source here
    sciChartSurface.chartModifiers.add(new GaugeModifier(gauge, createCpuLoadFeed()));

    return { sciChartSurface, wasmContext };
}
// #region_A_end

gaugeChart("scichart-root");
