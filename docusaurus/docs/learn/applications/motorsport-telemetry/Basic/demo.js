import * as SciChart from "scichart";

// Two real laps of the same circuit from a racing simulator, recorded at SciChart's racing telemetry demo
// in 2026 and anonymised: two different drivers, no names. Lap A is the faster lap (82.010 s), Lap B the
// slower one (84.738 s). Each lap is a cut-down copy of the logged telemetry: every second sample (about one
// every 4 m), and only the channels charted here, stored as whole numbers in the base64 strings at the end
// of this file. The simulator logged roughly 30 samples a second.
const TRACK_LENGTH = 5276.2; // m
const LAPS = [
    { name: "Lap A", lapTime: 82.01, colour: "#50C7E0" },
    { name: "Lap B", lapTime: 84.738, colour: "#F48420" }
];
// The slower corners, numbered in order for this guide (distance of Lap A's slowest point, in m)
const CORNERS = [356, 1110, 1265, 1884, 3309, 3454, 4148, 4409, 4675];

// The controls and the chart panes each need an element. This splits the page's div into a header, a column
// of five lap-trace panes, and a column with the track map and two polar charts. In your app, they can simply
// be elements in your HTML.
function createLayout(divElementId) {
    const root = document.getElementById(divElementId);
    root.style.cssText += "display:flex; flex-direction:column; background:#22365B;";
    const font = "font:14px system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
    const header = document.createElement("div");
    header.style.cssText = "padding:6px 12px 4px; color:#ffffff;" + font;
    const cornerOptions = CORNERS.map((d, i) => `<option value="${i}">Corner ${i + 1} (${d} m)</option>`).join("");
    header.innerHTML =
        `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px 16px">` +
        `<label>Zoom to <select data-id="corner" style="font:inherit"><option value="-1">Whole lap</option>${cornerOptions}</select></label>` +
        `<label>Colour the track map by <select data-id="colour" style="font:inherit">` +
        `<option value="delta">Where Lap B gains or loses time</option><option value="speed">Lap A speed</option></select></label>` +
        `<button data-id="replay" style="font:inherit; min-width:150px; padding:2px 10px; cursor:pointer">Replay both laps</button>` +
        `</div><div data-id="status" aria-live="off" style="margin-top:4px; min-height:1.3em; color:#c8d3e8"></div>`;
    const body = document.createElement("div");
    body.style.cssText = "flex:1; min-height:0; display:flex; gap:4px;";
    const left = document.createElement("div");
    left.style.cssText = "flex:2; min-width:0; display:flex; flex-direction:column;";
    const right = document.createElement("div");
    right.style.cssText = "flex:1; min-width:0; display:flex; flex-direction:column; gap:4px;";
    const makeDiv = (parent, id, flex) => {
        const div = document.createElement("div");
        div.id = `${divElementId}-${id}`;
        div.style.cssText = `flex:${flex}; min-height:0;`;
        parent.append(div);
        return div;
    };
    const traceDivs = ["speed", "throttle", "brake", "gear", "delta"].map((id, i) => makeDiv(left, id, [1.5, 1, 1, 0.8, 1.3][i]));
    const mapDiv = makeDiv(right, "map", 1.3);
    const ggDiv = makeDiv(right, "gg", 1);
    const gaugeDiv = makeDiv(right, "gauge", 1);
    body.append(left, right);
    root.append(header, body);
    const get = (selector) => header.querySelector(selector);
    return {
        traceDivs,
        mapDiv,
        ggDiv,
        gaugeDiv,
        cornerSelect: get('select[data-id="corner"]'),
        colourSelect: get('select[data-id="colour"]'),
        replayButton: get('button[data-id="replay"]'),
        status: get('div[data-id="status"]')
    };
}

async function motorsportTelemetry(divElementId) {
    const ui = createLayout(divElementId);

    // #region_A_start
    // Motorsport lap comparison with SciChart.js: lap traces against distance, a time-delta trace, a track map,
    // a polar g-g diagram and a polar speed gauge, all following one cursor, plus a replay of both laps
    const {
        SciChartSurface,
        SciChartPolarSurface,
        SciChartVerticalGroup,
        NumericAxis,
        PolarNumericAxis,
        NumberRange,
        EAutoRange,
        EAxisAlignment,
        EPolarAxisMode,
        EXyDirection,
        EStrokePaletteMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        EMultiLineAlignment,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        PolarXyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        DefaultPaletteProvider,
        parseColorToUIntArgb,
        VerticalLineAnnotation,
        HorizontalLineAnnotation,
        NativeTextAnnotation,
        PolarArcAnnotation,
        SciChartJsNavyTheme,
        CursorModifier,
        LegendModifier,
        ELegendOrientation,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        CustomChartModifier2D
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // --- 1. Decode each lap: base64 -> bytes -> typed columns (6 Int16 columns, then 3 Uint8 columns) ---
    function decodeLap(base64) {
        const bytes = Uint8Array.from(atob(base64), (ch) => ch.charCodeAt(0));
        const n = bytes.length / 15; // 15 bytes per sample
        const view = new DataView(bytes.buffer);
        const int16 = (block, scale, unsigned = false) =>
            Float64Array.from({ length: n }, (_, i) => {
                const offset = block * 2 * n + 2 * i;
                return (unsigned ? view.getUint16(offset, true) : view.getInt16(offset, true)) / scale;
            });
        const uint8 = (block) => Float64Array.from(bytes.subarray(12 * n + block * n, 12 * n + (block + 1) * n));
        return {
            distance: int16(0, 4, true), // m from the start line, stored in quarter metres
            speed: int16(1, 1), // km/h
            x: int16(2, 10), // track position (m), for the map
            z: int16(3, 10),
            gLat: int16(4, 100), // lateral g
            gLon: int16(5, 100), // longitudinal g: + accelerating, - braking
            throttle: uint8(0), // %
            brake: uint8(1), // %
            gear: uint8(2)
        };
    }

    // Linear interpolation of ys at x, over xs sorted ascending
    function interpolate(xs, ys, x) {
        let lo = 0;
        let hi = xs.length - 1;
        if (x <= xs[lo]) return ys[lo];
        if (x >= xs[hi]) return ys[hi];
        while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            if (xs[mid] <= x) lo = mid;
            else hi = mid;
        }
        return ys[lo] + ((x - xs[lo]) / (xs[hi] - xs[lo])) * (ys[hi] - ys[lo]);
    }

    // --- 2. Elapsed time at each sample: add up distance / speed, then scale to the lap's official time
    // (the logged speed is rounded to whole km/h, so the raw sum runs about 1.6% long) ---
    function addElapsedTime(lap, lapTime) {
        const { distance, speed } = lap;
        const n = distance.length;
        const time = new Float64Array(n);
        time[0] = distance[0] / (speed[0] / 3.6);
        for (let i = 1; i < n; i++) {
            const metresPerSecond = (speed[i] + speed[i - 1]) / 2 / 3.6;
            time[i] = time[i - 1] + (distance[i] - distance[i - 1]) / metresPerSecond;
        }
        const finish = time[n - 1] + (TRACK_LENGTH - distance[n - 1]) / (speed[n - 1] / 3.6);
        for (let i = 0; i < n; i++) time[i] *= lapTime / finish;
        return { ...lap, time };
    }

    const [lapA, lapB] = [LAP_A_DATA, LAP_B_DATA].map((data, i) => addElapsedTime(decodeLap(data), LAPS[i].lapTime));

    // --- 3. The time delta: at each of Lap A's distances, Lap B's time minus Lap A's time.
    // Positive = Lap B is behind; where the line rises, Lap B is losing time ---
    const delta = Float64Array.from(lapA.distance, (d, i) => interpolate(lapB.distance, lapB.time, d) - lapA.time[i]);

    // --- 4. Five lap-trace panes, stacked, sharing one distance axis ---
    const fullLap = () => new NumberRange(0, TRACK_LENGTH);
    const paneSpecs = [
        { title: "Speed (km/h)", range: new NumberRange(10, 340), channel: "speed", legend: true },
        { title: "Throttle", range: new NumberRange(-5, 108), channel: "throttle", postfix: "%" },
        { title: "Brake", range: new NumberRange(-5, 108), channel: "brake", postfix: "%" },
        { title: "Gear", range: new NumberRange(1.5, 8.7), channel: "gear" },
        { title: "Delta (s)", range: new NumberRange(-0.6, 3.1), channel: "delta", precision: 2 }
    ];
    const group = new SciChartVerticalGroup(); // lines up the panes' y-axes, so their x-axes match
    const panes = [];
    let onCursor = (distance) => {}; // set below, once the map and polar charts exist

    // Reports the distance under the mouse, so the map and polar charts can follow the cursor
    class DistanceCursorModifier extends CustomChartModifier2D {
        modifierMouseMove(args) {
            super.modifierMouseMove(args);
            const surface = this.parentSurface;
            const x = args.mousePoint.x - surface.seriesViewRect.x;
            if (x >= 0 && x <= surface.seriesViewRect.width) {
                onCursor(surface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(x));
            }
        }
    }

    for (const [index, spec] of paneSpecs.entries()) {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(ui.traceDivs[index], {
            theme: new SciChartJsNavyTheme()
        });
        const isLast = index === paneSpecs.length - 1;
        const xAxis = new NumericAxis(wasmContext, {
            axisTitle: isLast ? "Lap distance (m)" : undefined,
            drawLabels: isLast,
            autoRange: EAutoRange.Never,
            visibleRange: fullLap(),
            labelPrecision: 0,
            drawMinorGridLines: false
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: spec.title,
                axisTitleStyle: { fontSize: 13 },
                autoRange: EAutoRange.Never,
                visibleRange: spec.range,
                maxAutoTicks: 4,
                labelPrecision: spec.precision ?? 0,
                labelPostfix: spec.postfix ?? "",
                drawMinorGridLines: false
            })
        );

        if (spec.channel === "delta") {
            sciChartSurface.annotations.add(new HorizontalLineAnnotation({ y1: 0, stroke: "#FFFFFF66", strokeDashArray: [4, 4] }));
            sciChartSurface.renderableSeries.add(
                new FastLineRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        dataSeriesName: "Lap B − Lap A",
                        xValues: lapA.distance,
                        yValues: delta,
                        isSorted: true,
                        containsNaN: false
                    }),
                    stroke: "#F6E05E",
                    strokeThickness: 2
                })
            );
        } else {
            [lapA, lapB].forEach((lap, i) =>
                sciChartSurface.renderableSeries.add(
                    new FastLineRenderableSeries(wasmContext, {
                        dataSeries: new XyDataSeries(wasmContext, {
                            dataSeriesName: LAPS[i].name,
                            xValues: lap.distance,
                            yValues: lap[spec.channel],
                            isSorted: true,
                            containsNaN: false
                        }),
                        stroke: LAPS[i].colour,
                        strokeThickness: 2,
                        isDigitalLine: spec.channel === "gear" // gear changes are steps
                    })
                )
            );
        }
        if (spec.channel === "speed") {
            // Corner numbers along the bottom of the speed pane
            CORNERS.forEach((d, i) =>
                sciChartSurface.annotations.add(
                    new NativeTextAnnotation({
                        x1: d,
                        y1: 14,
                        text: String(i + 1),
                        fontSize: 12,
                        textColor: "#E8EDF5",
                        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                        verticalAnchorPoint: EVerticalAnchorPoint.Bottom
                    })
                )
            );
        }
        // Replay markers: where each car is at the same moment, one dashed line per lap
        const replayLines = LAPS.map(
            (lap) => new VerticalLineAnnotation({ x1: 0, stroke: lap.colour, strokeThickness: 2, strokeDashArray: [5, 3], isHidden: true })
        );
        sciChartSurface.annotations.add(...replayLines);

        sciChartSurface.chartModifiers.add(
            new CursorModifier({
                modifierGroup: "laps", // the crosshair follows on every pane
                showTooltip: true,
                showYLine: false,
                tooltipContainerBackground: "#14233CDD",
                tooltipDataTemplate: (seriesInfos) => seriesInfos.map((info) => `${info.seriesName}: ${info.formattedYValue}`)
            }),
            new DistanceCursorModifier(),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({
                xyDirection: EXyDirection.XDirection,
                onZoomExtents: () => {
                    panes.forEach((pane) => (pane.xAxis.visibleRange = fullLap()));
                    return false;
                }
            })
        );
        if (spec.legend) sciChartSurface.chartModifiers.add(new LegendModifier({ showCheckboxes: false, orientation: ELegendOrientation.Horizontal }));
        group.addSurfaceToGroup(sciChartSurface);
        panes.push({ sciChartSurface, xAxis, replayLines });
    }
    // Zooming or panning one pane moves the others
    for (const pane of panes) {
        pane.xAxis.visibleRangeChanged.subscribe(({ visibleRange }) => {
            for (const other of panes) {
                if (other !== pane && !other.xAxis.visibleRange.equals(visibleRange)) other.xAxis.visibleRange = visibleRange;
            }
        });
    }

    // --- 5. Track map: the racing line from the x and z positions, coloured point by point ---
    const map = await SciChartSurface.create(ui.mapDiv, { theme: new SciChartJsNavyTheme() });
    const mapX = new NumericAxis(map.wasmContext, { isVisible: false, autoRange: EAutoRange.Never });
    const mapY = new NumericAxis(map.wasmContext, { isVisible: false, autoRange: EAutoRange.Never });
    map.sciChartSurface.xAxes.add(mapX);
    map.sciChartSurface.yAxes.add(mapY);
    let mapColours = new Uint32Array(lapA.x.length);
    const trackPalette = new DefaultPaletteProvider();
    trackPalette.strokePaletteMode = EStrokePaletteMode.GRADIENT;
    trackPalette.overrideStrokeArgb = (x, y, index) => mapColours[index];
    map.sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(map.wasmContext, {
            dataSeries: new XyDataSeries(map.wasmContext, { xValues: lapA.x, yValues: lapA.z }),
            strokeThickness: 5,
            paletteProvider: trackPalette
        })
    );
    CORNERS.forEach((d, i) =>
        map.sciChartSurface.annotations.add(
            new NativeTextAnnotation({
                x1: interpolate(lapA.distance, lapA.x, d) + 45,
                y1: interpolate(lapA.distance, lapA.z, d),
                text: String(i + 1),
                fontSize: 13,
                textColor: "#FFFFFF",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Center
            })
        )
    );
    // One marker per lap, moved by the cursor or the replay
    const carMarkers = LAPS.map((lap) => {
        const dataSeries = new XyDataSeries(map.wasmContext, { xValues: [0], yValues: [0] });
        map.sciChartSurface.renderableSeries.add(
            new XyScatterRenderableSeries(map.wasmContext, {
                dataSeries,
                pointMarker: new EllipsePointMarker(map.wasmContext, { width: 14, height: 14, fill: lap.colour, stroke: "#FFFFFF", strokeThickness: 2 })
            })
        );
        return dataSeries;
    });

    // Keep the map's x and z scales equal, so the circuit isn't stretched, whatever the size of its div
    const fitTrack = () => {
        const { width, height } = ui.mapDiv.getBoundingClientRect();
        if (!width || !height) return;
        const [minX, maxX, minZ, maxZ] = [Math.min(...lapA.x), Math.max(...lapA.x), Math.min(...lapA.z), Math.max(...lapA.z)];
        const metresPerPixel = Math.max((maxX - minX) / width, (maxZ - minZ) / height) * 1.12;
        mapX.visibleRange = new NumberRange((minX + maxX) / 2 - (metresPerPixel * width) / 2, (minX + maxX) / 2 + (metresPerPixel * width) / 2);
        mapY.visibleRange = new NumberRange((minZ + maxZ) / 2 - (metresPerPixel * height) / 2, (minZ + maxZ) / 2 + (metresPerPixel * height) / 2);
    };
    const resizeObserver = new ResizeObserver(fitTrack);
    resizeObserver.observe(ui.mapDiv);

    // Colour ramps: speed from blue (slow) to red (fast); time from green (Lap B gaining) through grey to red (losing)
    const ramp = (t, stops) => {
        const p = Math.max(0, Math.min(1, t)) * (stops.length - 1);
        const i = Math.min(stops.length - 2, Math.floor(p));
        const mix = (a, b) => Math.round(a + (b - a) * (p - i));
        const [a, b] = [stops[i], stops[i + 1]];
        return parseColorToUIntArgb(`rgb(${mix(a[0], b[0])},${mix(a[1], b[1])},${mix(a[2], b[2])})`);
    };
    const SPEED_STOPS = [[59, 130, 246], [34, 211, 238], [34, 197, 94], [234, 179, 8], [239, 68, 68]];
    const DELTA_STOPS = [[46, 204, 113], [110, 120, 140], [255, 77, 77]];
    function colourTrack(mode) {
        mapColours = Uint32Array.from(lapA.distance, (d, i) => {
            if (mode === "speed") return ramp((lapA.speed[i] - 80) / 240, SPEED_STOPS);
            // How fast the delta changes here: seconds gained or lost per metre, over 40 m
            const rate = (interpolate(lapA.distance, delta, d + 20) - interpolate(lapA.distance, delta, d - 20)) / 40;
            return ramp(0.5 + rate / 0.004, DELTA_STOPS);
        });
        map.sciChartSurface.invalidateElement();
    }

    // --- 6. Polar g-g diagram: each sample's g-force as a direction (angle) and size (radius) ---
    const MAX_G = 5; // the plot's edge; Lap B's two kerb strikes (over 9 g for an instant) are clipped to it
    const toPolar = (gLat, gLon) => {
        const angle = (Math.atan2(gLon, gLat) * 180) / Math.PI;
        return [(angle + 360) % 360, Math.min(Math.hypot(gLat, gLon), MAX_G)];
    };
    const gg = await SciChartPolarSurface.create(ui.ggDiv, { theme: new SciChartJsNavyTheme(), title: "g-g diagram (rings every 1 g)", titleStyle: { fontSize: 13 } });
    gg.sciChartSurface.xAxes.add(
        new PolarNumericAxis(gg.wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            visibleRange: new NumberRange(0, 360),
            autoTicks: false,
            majorDelta: 45,
            drawLabels: false,
            drawMinorGridLines: false,
            drawMajorBands: false
        })
    );
    gg.sciChartSurface.yAxes.add(
        new PolarNumericAxis(gg.wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            axisAlignment: EAxisAlignment.Right,
            visibleRange: new NumberRange(0, MAX_G),
            autoTicks: false,
            majorDelta: 1,
            drawLabels: false, // rings every 1 g, out to 5 g
            drawMinorGridLines: false,
            drawMajorBands: false
        })
    );
    // Direction labels: 90° (top) is accelerating, 270° (bottom) is braking, the sides are cornering
    [
        { angle: 90, text: "Accel." },
        { angle: 270, text: "Braking" },
        { angle: 0, text: "Turn" },
        { angle: 180, text: "Turn" }
    ].forEach(({ angle, text }) =>
        gg.sciChartSurface.annotations.add(
            new NativeTextAnnotation({
                x1: angle,
                y1: MAX_G * 0.82,
                text,
                fontSize: 11,
                textColor: "#C8D2E0",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Center
            })
        )
    );
    const ggMarkers = [lapA, lapB].map((lap, i) => {
        const points = Array.from(lap.gLat, (gLat, k) => toPolar(gLat, lap.gLon[k]));
        gg.sciChartSurface.renderableSeries.add(
            new PolarXyScatterRenderableSeries(gg.wasmContext, {
                dataSeries: new XyDataSeries(gg.wasmContext, { xValues: points.map((p) => p[0]), yValues: points.map((p) => p[1]) }),
                pointMarker: new EllipsePointMarker(gg.wasmContext, { width: 3, height: 3, fill: LAPS[i].colour + "55", strokeThickness: 0 })
            })
        );
        const marker = new XyDataSeries(gg.wasmContext, { xValues: [0], yValues: [0] });
        gg.sciChartSurface.renderableSeries.add(
            new PolarXyScatterRenderableSeries(gg.wasmContext, {
                dataSeries: marker,
                pointMarker: new EllipsePointMarker(gg.wasmContext, { width: 12, height: 12, fill: LAPS[i].colour, stroke: "#FFFFFF", strokeThickness: 2 })
            })
        );
        return marker;
    });

    // --- 7. Polar speed gauge: Lap A on the outer arc, Lap B on the inner arc ---
    const GAUGE_MAX = 350;
    const sweep = (270 * Math.PI) / 180;
    const gauge = await SciChartPolarSurface.create(ui.gaugeDiv, { theme: new SciChartJsNavyTheme() });
    gauge.sciChartSurface.xAxes.add(
        new PolarNumericAxis(gauge.wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            visibleRange: new NumberRange(0, GAUGE_MAX),
            totalAngle: sweep,
            startAngle: (Math.PI - sweep) / 2,
            flippedCoordinates: true, // clockwise, with the gap at the bottom
            autoTicks: false,
            majorDelta: 50,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            labelStyle: { fontSize: 10 },
            labelPrecision: 0
        })
    );
    gauge.sciChartSurface.yAxes.add(
        new PolarNumericAxis(gauge.wasmContext, { polarAxisMode: EPolarAxisMode.Radial, visibleRange: new NumberRange(0, 10), isVisible: false })
    );
    const speedArcs = [
        { inner: 8, outer: 9.6 },
        { inner: 6, outer: 7.6 }
    ].map((ring, i) => {
        gauge.sciChartSurface.annotations.add(
            new PolarArcAnnotation({ x1: 0, x2: GAUGE_MAX, y1: ring.outer, y2: ring.inner, fill: "#FFFFFF14", stroke: "#00000000", strokeThickness: 0 })
        );
        const arc = new PolarArcAnnotation({ x1: 0, x2: 0, y1: ring.outer, y2: ring.inner, fill: LAPS[i].colour, stroke: "#00000000", strokeThickness: 0 });
        gauge.sciChartSurface.annotations.add(arc);
        return arc;
    });
    const readout = new NativeTextAnnotation({
        x1: 0,
        y1: 0, // the centre of the gauge
        text: "",
        fontSize: 13,
        lineSpacing: 3,
        multiLineAlignment: EMultiLineAlignment.Center,
        textColor: "#FFFFFF",
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center
    });
    gauge.sciChartSurface.annotations.add(readout);

    // --- 8. Show one moment on the map and the polar charts: sample index iA of Lap A and iB of Lap B ---
    const nearestIndex = (xs, x) => {
        let lo = 0;
        let hi = xs.length - 1;
        while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            if (xs[mid] <= x) lo = mid;
            else hi = mid;
        }
        return x - xs[lo] < xs[hi] - x ? lo : hi;
    };
    function showMoment(iA, iB) {
        [lapA, lapB].forEach((lap, i) => {
            const k = i === 0 ? iA : iB;
            carMarkers[i].updateXy(0, lap.x[k], lap.z[k]);
            const [angle, radius] = toPolar(lap.gLat[k], lap.gLon[k]);
            ggMarkers[i].updateXy(0, angle, radius);
            speedArcs[i].x2 = lap.speed[k];
        });
        readout.text = `A ${lapA.speed[iA]} km/h\nB ${lapB.speed[iB]} km/h`;
    }
    // The cursor: both laps at the same distance
    onCursor = (distance) => {
        if (replay.running) return;
        showMoment(nearestIndex(lapA.distance, distance), nearestIndex(lapB.distance, distance));
        const d = Math.max(0, Math.min(TRACK_LENGTH, distance));
        const gap = interpolate(lapA.distance, delta, d);
        ui.status.textContent = `${Math.round(d)} m: Lap B is ${Math.abs(gap).toFixed(2)} s ${gap >= 0 ? "behind" : "ahead"}`;
    };

    // --- 9. Replay: both laps at the same elapsed time, in real time ---
    const replay = { running: false, time: 0, last: 0 };
    const timer = setInterval(() => {
        if (!replay.running) return;
        const now = performance.now();
        replay.time += Math.min(now - replay.last, 250) / 1000;
        replay.last = now;
        const t = Math.min(replay.time, LAPS[1].lapTime);
        const distances = [lapA, lapB].map((lap) => (t >= lap.time[lap.time.length - 1] ? TRACK_LENGTH : interpolate(lap.time, lap.distance, t)));
        showMoment(nearestIndex(lapA.time, t), nearestIndex(lapB.time, t));
        panes.forEach((pane) => pane.replayLines.forEach((line, i) => (line.x1 = distances[i])));
        const metresBehind = distances[0] - distances[1];
        ui.status.textContent =
            t < LAPS[0].lapTime
                ? `${t.toFixed(1)} s: Lap B is ${Math.abs(Math.round(metresBehind))} m ${metresBehind >= 0 ? "behind" : "ahead"}`
                : `Lap A finished in ${LAPS[0].lapTime.toFixed(3)} s; Lap B ${Math.round(metresBehind)} m to go`;
        if (replay.time >= LAPS[1].lapTime) stopReplay(`Lap B finished ${(LAPS[1].lapTime - LAPS[0].lapTime).toFixed(3)} s behind`);
    }, 16);
    function stopReplay(message) {
        replay.running = false;
        ui.replayButton.textContent = "Replay both laps";
        ui.status.textContent = message;
        panes.forEach((pane) => pane.replayLines.forEach((line) => (line.isHidden = true)));
    }
    ui.replayButton.addEventListener("click", () => {
        if (replay.running) return stopReplay("");
        Object.assign(replay, { running: true, time: 0, last: performance.now() });
        ui.replayButton.textContent = "Stop replay";
        panes.forEach((pane) => pane.replayLines.forEach((line) => (line.isHidden = false)));
    });

    // --- 10. Controls: zoom to a corner, change the map colouring ---
    ui.cornerSelect.addEventListener("change", () => {
        const corner = CORNERS[Number(ui.cornerSelect.value)];
        panes[0].xAxis.visibleRange = corner === undefined ? fullLap() : new NumberRange(corner - 300, corner + 300);
        if (corner !== undefined) onCursor(corner);
    });
    ui.colourSelect.addEventListener("change", () => colourTrack(ui.colourSelect.value));

    panes[0].sciChartSurface.addDeletable({
        delete: () => {
            clearInterval(timer);
            resizeObserver.disconnect();
        }
    });
    colourTrack(ui.colourSelect.value);
    fitTrack();
    onCursor(CORNERS[8]);
    // #region_A_end
}

// Lap A: 1301 samples. Lap B: 1337 samples. Base64 of little-endian columns (see decodeLap).
const LAP_A_DATA = `
EwAoADwAUQBlAHoAjgCiALYAywDfAPMABwEbAS8BRAFYAWwBgAGVAakBvgHSAegB/QETAikCPgJSAmcCfQKSAqcCvALSAugC/gIU
AyoDQANWA2sDgQOXA60DwwPZA+8DBQQbBDAERgRbBG8EggSVBKYEuATIBNgE5wT2BAQFEgUfBSwFOQVFBVEFXAVnBXIFfAWHBZEF
mwWkBa4FtwXCBc8F3gXwBQQGFgYkBiwGNgY/BkkGUwZeBmgGdAZ/BosGlwajBq8GvAbJBtYG4wbwBv0GCwcYByYHNQdDB1IHYgdx
B38HjgedB6sHugfJB9cH5gf1BwQIEgghCDAIPwhOCF0IbAh8CIsImgiqCLkIyQjZCOkI+QgJCRoJKwk8CUwJXglvCYEJkwmlCbYJ
yQnbCe0JAAoSCiUKNwpKClwKbwqCCpYKqQq8Cs8K4wr2CgoLHgsyC0cLWwtvC4MLmAusC8AL1QvpC/0LEgwmDDsMTwxkDHkMjgyj
DLgMzgzkDPsMEQ0nDTwNUg1nDX0Nkg2nDbwN0Q3nDfwNEg4oDj0OUw5oDn4Okw6pDr4O0w7pDv8OFg8sD0IPWA9vD4UPmw+wD8QP
1w/qD/wPDhAfEDAQQBBPEF4QbRB7EIgQlRChEKwQtxDCEMwQ1hDgEOgQ8RD5EAARBxEOERYRHhEnETARORFDEU4RWhFkEW4RdxGA
EYkRkBGXEZ4RpRGsEbMRuhHCEckR0RHZEeAR6BHwEfgRABIIEhASGRIhEikSMRI6EkMSTBJVEl8SaBJyEnwShhKREpwSphKxEr0S
yBLTEt4S6RL1EgATCxMVEx8TKhM1E0ATSxNWE2ITbhN6E4YTkROdE6kTtBO/E8kT0xPeE+gT8RP6EwQUDhQYFCIULRQ4FEMUThRY
FGMUbhR5FIQUjxSbFKYUshS+FMoU1hTiFO8U/BQJFRcVJRU0FUIVURVgFW8VfhWNFZwVrBW7FcwV3BXtFf4VDhYeFi4WPhZOFl4W
bRZ9FowWmxaqFroWyhbcFu0W/hYQFyIXMxdEF1UXZRd0F4QXlBekF7UXxxfZF+sX/BcOGB8YMBhBGFMYZRh3GIkYnBiuGMAY0xjl
GPgYCxkeGTIZRRlZGWwZgBmTGaYZuhnNGeEZ9RkJGh0aMRpFGlkabRqBGpUaqRq+GtIa5xr8GhAbJRs5G04bZBt5G44boxu4G80b
4xv4Gw0cIxw5HE8cZBx4HIwcnxyxHMIc0xziHPIcAR0QHR4dKx04HUQdUB1cHWkddh2EHZMdox2zHcIdzx3cHegd8x3+HQkeFR4g
Hi0eOR5FHlIeXh5sHnkehx6UHqIesR6/Hs0e3B7rHvoeCR8YHycfNx9HH1cfZx92H4YflR+lH7QfxB/UH+Qf9B8FIBYgJyA4IEog
WyBsIH0gjiCfILAgwiDTIOQg9iAHIRkhLCE/IVIhZSF4IYshnSGvIcIh1CHmIfkhCyIdIjAiQiJUImYieCKKIp0iryLBItMi5iL4
IgojHSMwI0IjVSNoI3ojjSOgI7MjxSPYI+oj/SMPJCEkMyRFJFckaSR7JI0koCSyJMQk1yTpJPwkDiUhJTQlRyVaJW0lgCWTJaYl
uiXNJeEl9SUJJh0mMSZFJlombiaCJpYmqia/JtMm6Cb+JhMnKCc9J1InZyd7J5AnpCe5J80n4if2JwsoHygzKEgoXChwKIUomSiu
KMIo1yjsKAApFSkqKT4pUilnKXspkCmlKbkpziniKfcpCyogKjUqSSpeKnMqhyqcKrEqxircKvEqByscKzIrSCteK3MriCueK7Mr
ySvfK/UrCiwgLDYsSyxhLHcsjSyjLLgszizkLPosEC0mLTwtUi1oLX4tlS2rLcAt1y3tLQMuGC4uLkMuWS5vLoUumy6xLscu3S7z
LgovIC82L00vYy96L5EvqC+/L9Yv7S8DMBowMDBHMF0wczCJMJ8wtTDLMOEw9jAMMSIxODFOMWQxeTGPMaUxuzHRMeYx/DESMigy
PjJTMmkyfzKVMqsywTLWMuoy/jIRMyQzNjNHM1gzaDN4M4gzljOlM7MzwjPRM+Az8DP/Mw80HjQsNDo0SDRWNGQ0cjSANI40nTSr
NLk0xzTWNOQ08zQCNRI1ITUxNUA1TzVeNW01fDWLNZo1qjW7Nc014DXxNQE2ETYgNjA2PzZONl42bjZ+No02nTatNr42zjbeNu42
/zYPNyA3MTdCN1M3ZDd1N4Y3lzeoN7o3yzfdN+43ADgSOCQ4NjhIOFo4bDh+OJE4ozi2OMk43DjvOAI5FTkoOTs5TzliOXY5ijmd
ObE5xTnYOew5ADoUOik6PTpROmU6eTqNOqI6tjrLOt869DoIOxw7MDtEO1g7bDuAO5Q7qTu9O9I75jv7Ow88JDw4PE08YTx2PIs8
oDy2PMs84Tz2PAs9ID01PUo9Xz11PYo9nz21Pcs94T33PQw+Ij44Pk0+Yz55Po8+pT67PtE+5z79PhM/KT89P1E/ZD92P4g/mD+p
P7k/yT/YP+c/9T8CQA5AGkAmQDJAPUBIQFNAXUBnQHBAeUCCQItAk0CaQKJAqUCwQLdAvkDJQNZA5kDzQP5AB0EOQRVBG0EiQSlB
MEE3QT5BRUFNQVRBXEFkQWxBdEF8QYVBjkGYQaJBrEG2QcBBykHUQd5B6EHzQf1BCEIUQh9CK0I3QkNCT0JbQmhCdUKCQpBCnkKr
QrlCx0LVQuRC8kIAQw9DHkMtQzxDS0NaQ2lDeUOIQ5hDp0O3Q8dD10PnQ/hDCkQbRC1EPkRORF5EbUR9RIxEm0SqRLlEyETXROVE
9EQCRRFFH0UuRTxFSkVYRWZFdEWCRY9FnUWqRbhFxUXUReNF8UX/RQ1GHEYqRjlGR0ZWRmVGdEaDRpNGokaxRsFG0UbgRvBGAEcQ
RyBHMUdCR1NHZUd3R4hHmUeoR7dHxEfSR99H60f3RwNIDkgaSCVIMEg6SERITUhWSF9IaEhwSHhIgEiHSI9IlUicSKJIqEiwSLpI
xEjOSNpI5UjvSPhIAEkHSQ9JFEkZSR5JJEkqSTFJN0k+SUVJS0lSSVhJX0lmSW1JdEl7SYJJikmRSZlJoEmoSbBJuEnASchJ0EnZ
SeJJ60n0Sf1JB0oRShtKJUowSjtKRkpRSlxKZkpwSnpKhUqPSppKpUqxSrxKyErUSuBK7Er4SgVLEUseSypLN0tDS1BLXUtqS3ZL
g0uQS51Lqku2S8NL0EvcS+hL9UsCTA5MG0woTDVMQkxQTF5Ma0x6TIhMlkylTLNMw0zSTOJM8UwATRBNH00vTT9NUE1gTXBNgU2S
TaNNtE3FTdZN6E35TQtOHE4uTkBOUk5kTndOiU6cTq5OwU7UTudO+k4NTyFPNE9IT1tPb0+DT5hPrE/AT9RP6E/8TxBQJVA5UE1Q
YlB2UItQn1C0UMlQ3VDyUAdRHFEyUUdRXFFxUYZRnFGxUcZR21HwUQZSG1IwUkZSW1JxUiMBJAEkASQBJQElASYBJgEmAScBJwEn
ASgBKAEoASkBKQEpASoBKgEqASoBKwErASsBLAEsASwBLAEtAS0BLQEtAS4BLgEuAS4BLwEvAS8BLwEvATABMAEwATABMAExATEB
MAErASIBGAEPAQcB/gD1AOwA5ADcANMAywDEAL0AtgCxAKwAqACjAJ8AnQCdAJwAnACbAJsAmwCbAJwAnQCeAJ8AoQChAKEAoQCh
AKIAowCkAKUApQCmAKcAqQCrAK4AsACyALQAtgC4ALoAvAC9AL8AwADCAMQAxgDIAMoAywDNAM4A0ADRANMA1ADVANYA1gDXANgA
2ADZANoA3ADdAN4A4ADiAOMA5ADlAOUA5gDnAOgA6QDqAOsA7ADuAO8A8ADyAPMA9QD3APkA+gD8AP0A/wAAAQEBAwEEAQYBBwEI
AQkBCgEMAQ0BDgEPARABEQETARQBFQEWARcBGAEZARoBGgEbARsBGwEcARwBHQEeAR4BHwEfAR8BIAEgASEBIQEiASIBIwEjASQB
JAEkASUBJQEmASYBJwEnAScBKAEoASgBKAEpASkBKQEqASoBKgErASsBKgEjARkBEAEHAf4A9ADrAOMA2wDTAM0AxwDAALgAsACq
AKUAngCXAJIAjQCIAIUAgQB9AHgAdABxAG4AbQBtAGwAbABtAG0AbQBuAG0AbQBsAGwAbABsAGwAawBsAGwAbABtAG0AbQBuAG4A
bgBvAG8AcABwAHEAcgByAHQAdQB2AHkAfAB/AIIAhQCIAIsAjgCQAJMAlgCYAJsAnQCeAJ0AngCeAJ4AngCdAJwAmwCaAJkAmACX
AJUAlACTAJMAkgCSAJEAkACOAI4AjQCLAIsAjACMAI4AkQCTAJYAmACbAJ0AngCfAKEAogCiAKMApAClAKcAqQCsAK4AsACyALUA
twC5ALsAvQC/AMEAxADGAMgAygDMAM4A0ADSANQA1QDXANkA2gDcAN0A3QDdAN0A3QDdAN0A3gDeAN8A4QDiAOMA5ADkAOQA5ADk
AOQA5ADkAOQA5QDmAOcA6ADpAOoA6gDrAOwA7ADtAO4A7wDwAPEA8wD0APUA9gD3APgA+gD7APwA/AD9AP4A/wAAAQEBAgEDAQQB
BQEFAQYBBwEIAQkBCgELAQwBDQEOAQ4BDwEQAREBEQESARIBEwEUARQBFQEWARYBFwEXARgBGQEZARoBGwEYAQ8BBgH8APMA6gDi
ANoA0gDMAMcAwQC8ALcAsQCtAKsAqgCpAKgAqACpAKoAqwCsAKwArQCtAK0ArgCuAK8ArwCwALEAtAC2ALkAvAC+AMEAwwDFAMcA
yQDKAMwAzgDQANEA0gDUANYA1wDZANoA3ADdAN4A4ADiAOMA5QDmAOcA6QDqAOwA7QDuAPAA8QDyAPIA8wD0APUA9gD3APcA+AD5
APoA/AD9AP4A/wAAAQABAgECAQMBAwEDAQMBAwEEAQUBBQEGAQYBBwEIAQgBCQEJAQoBCgEKAQoBCgEKAQsBCwELAQsBDAEMAQ0B
DgEOAQ8BDwEQAREBEgETARQBFQEWARcBGAEZARoBGwEbARwBHQEeAR8BHwEgASEBIQEiASIBIwEkASQBJAElASUBJgEnAScBJwEo
ASgBKQEpASoBKgErASsBKwEsASwBLAEsASwBLAEtAS0BLQEtAS0BLgEuAS4BLgEuAS8BLwEvAS8BLwEwATABMAEwATABMQExATIB
MgEyATMBMwEzATMBMwEyATIBMgEyATIBMgEyATIBMgEyATMBMwEzATQBNAE0ATQBNAE1ATUBNQE1ATYBNgE2ATYBNgE2ATYBNgE2
ATUBNQE1ATUBNQE1ATUBNQE1ATQBNAE0ATUBNQE1ATUBNQE1ATUBNQE1ATYBNgE2ATcBNwE3ATcBNgE2ATYBNQE1ATUBNQE1ATUB
NQE1ATUBNQE1ATUBNQE1ATUBNQE1ATUBNQE1ATUBNQE1ATUBNQE1ATUBNQE1ATUBNQE1ATUBNgE2ATYBNgE0AS0BJQEcARMBCwEC
AfsA9ADuAOkA4wDdANYA0ADMAMwAzADNAM4AzwDPANAA0ADQANAA0ADRANEA0gDTANUA1gDYANoA2wDcAN4A3wDgAOEA4gDjAOMA
4wDkAOQA5QDlAOUA5QDlAOUA5ADjAOMA5ADkAOUA5QDmAOgA6QDqAOsA7ADtAO4A7wDwAPIA8wD1APcA+AD6APsA/AD+AP8AAAEC
AQMBBAEGAQcBCAEJAQoBDAENAQ4BDwEQAREBEgETARQBFQEWARcBGAEZARoBGwEcAR0BHQEeAR8BIAEgASEBIQEiASMBIwEkASQB
JAEkASQBJAEkASQBJAEkASQBJAElASUBJQEmASYBJgEnAScBJwEoASgBKAEoASkBKQEpASoBKgEqASoBKwErASsBLAEsASwBLAEt
AS0BLQEtAS4BLgEuAS4BLwEvAS8BLwEvATABMAEwATABLQEnAR8BFgEOAQUB/ADzAOsA4wDaANIAywDGAL8AugC1AK8ArACnAKEA
mwCWAJIAjQCJAIYAggB+AHoAdwB1AHQAcwByAHEAcQBwAHAAcABxAHIAcwB0AHQAdQB1AHYAdgB3AHcAeAB4AHkAegB7AHwAfgCA
AIIAhQCIAIsAjgCRAJMAlgCZAJsAngChAKMApgCoAKoArQCvALEAtAC2ALgAugC8AL8AwQDDAMUAxwDJAMsAzQDOANAA0gDUANYA
1wDZANsA3ADeAN8A4QDjAOQA5gDmAOYA5ADiAN8A3QDaANcA1ADSANAAzgDLAMkAyADHAMcAxwDHAMgAyADIAMgAyQDJAMkAygDK
AMsAywDMAM0AzQDOAM8AzwDQANEA0gDTANUA1wDYANoA3ADdAN8A4ADiAOMA5QDmAOgA6QDqAOwA7QDvAPAA6wDkANwA1QDOAMgA
wwC8ALcAsgCsAKgAogCcAJYAkQCNAIgAhgCCAH4AegB1AHEAbQBpAGYAYgBhAGAAYABfAF4AXgBdAFwAXABcAFsAWwBaAFoAWgBb
AFsAXQBeAGAAYgBkAGUAZwBpAGoAbABtAG4AcABxAHIAcwB1AHcAeQB6AHwAfwCCAIQAhwCKAIwAjwCRAJMAlACVAJcAmACZAJoA
mgCbAJ0AnQCeAJ8AoAChAKMApACmAKYApwCoAKgAqQCpAKkAqgCqAKsAqwCsAKwArACtAK4ArgCvALAAsgCzALUAtgC4ALoAuwC9
AL8AwQDDAMUAxwDJAMsAzADOANAA0QDTANUA1wDZANsA3QDfAOAA4wDlAOcA6ADqAOwA7gDwAPEA8wD1APYA+AD5APsA/AD+AP8A
AAECAQQBBQEGAQcBCQEKAQsBDAENAQ8BEAERARIBEwEUARUBFgEXARgBGQEaARsBHAEdAR4BHwEgASABIQEiASMBJAEkASUBJgEn
AScBKAEpASkBKgErASsBLAEsAS0BLgEuAS8BLwFX+zL7Dvvp+sX6ofp9+ln6NfoR+u35yvmm+YL5Xfk5+RX58PjL+Kb4gPha+DT4
Dfjm9773lvdv90n3Ivf79tT2rfaG9l72NvYN9uT1vPWU9Wz1RPUc9fT0zPSk9Hz0VPQt9AX03vO485PzcPNN8yzzDPPu8tDytPKY
8n7yZfJN8jXyH/IK8vbx4/HR8cHxs/Gl8ZjxjPGC8Xjxb/Fn8WDxWvFV8VHxTvFM8UrxSvFL8UzxTvFR8VXxWfFf8WXxa/Fy8Xnx
gPGG8Y3xk/GY8Zzxn/Gi8aTxpfGl8aXxo/Gh8Z7xm/GX8ZLxjPGF8X7xdfFr8WDxVPFH8TnxKvEZ8Qjx9vDj8M7wufCj8I3wdfBc
8ELwJ/AL8O3vz++w75DvcO9P7y3vCu/n7sTuoe5+7lruNu4T7u/tzO2p7YbtY+1A7Rzt+ezW7LPskOxu7EvsKOwF7OLrvuub63jr
Vesx6w7r6urH6qTqgepe6jvqGOr16dLpr+mM6WrpR+kj6QDp3Oi66Jjod+hW6DXoFej159XnteeW53XnVec05xPn8+bT5rPmk+Zz
5lTmNuYX5vjl2eW65ZzlfeVf5UDlIeUE5efky+Sw5JfkfuRn5FHkPeQq5BjkB+T34+fj2ePL477jsuOn45zjk+OL44Tjf+N643fj
deNz43Pjc+N143fjeuN+44PjieOQ45fjn+Op47PjvePJ49Xj4ePv4/3jDOQb5CzkPeRO5GDkc+SG5JrkreTB5NXk6uT+5BPlJ+U9
5VTla+WC5ZnlseXK5eLl/OUW5jHmS+Zn5oLmnea55tTm7+YK5yXnP+dZ53Hnieeg57fnzefi5/bnCugd6C7oP+hO6Fzoaeh16IDo
iuiT6Jvoouio6K7otOi56L7oxOjI6Mzoz+jR6NLo0ujS6NDozujL6Mfow+i+6Lroteix6KzoqOij6J/omuiV6JDoiuiF6H/oeehz
6G3oZ+hg6FroU+hM6EfoQug+6DzoO+g86D7oQehG6EzoU+hc6Gboceh86IromOio6LnozOjg6PboDekk6T3pV+ly6Y/prenN6e7p
EOoz6lXqeOqc6sHq5+oN6zTrWuuA66bry+vw6xXsO+xh7Insseza7ATtL+1Z7YPtru3Z7QXuMe5e7ovuuO7l7hLvQO9u75zvyu/4
7yfwVvCF8LXw5fAU8UPxc/Gk8dTxBfI08mPykvLA8u/yHvNO833zrPPb8wj0M/Rd9IX0rPTR9PX0GfU79V71f/Wf9b713fX89Rv2
OvZY9nf2lfaz9tL28PYO9yv3SPdl94H3nPe599T38PcL+CX4QPhb+Hf4k/iv+Mz46vgI+Sf5Rvlm+Yb5qPnJ+ez5EPo1+lr6f/qk
+sn67/oV+zz7YvuJ+7H72PsB/Cr8U/x9/Kb80Pz6/CP9TP11/Z79xv3v/Rf+QP5o/pD+t/7g/gn/Mv9b/4T/rP/S//j/HQBCAGYA
igCtAM8A8AARATEBUAFuAYwBqQHFAeAB+wEVAi0CRQJbAnEChgKZAqsCvALMAtsC6QL3AgMDDwMbAyYDMAM7A0UDTwNZA2MDbQN2
A38DiQOSA5wDpQOvA7gDwQPKA9MD3APkA+sD8gP4A/4DBAQIBAwEDwQSBBQEFQQWBBUEFAQTBBAEDQQJBAUE/wP5A/ID6wPiA9kD
zgPDA7cDqQObA4wDfANrA1oDSQM3AyYDFAMCA+8C3QLKArcCpAKRAn4CawJYAkUCMgIfAg0C+gHoAdYBxQG0AaMBlAGFAXgBawFf
AVQBSQE+ATMBKQEfARQBCgEBAfgA8ADpAOIA3QDYANMA0ADNAMoAyADGAMQAwwDCAMEAwgDEAMcAywDPANUA3ADjAOoA8wD8AAcB
EgEeASsBOgFIAVgBaQF7AY0BoQG1AcoB4AH2AQ0CJQI9AlYCcAKLAqcCxQLkAgMDIgNDA2MDhAOmA8cD6QMMBC4EUQR0BJcEuwTf
BAQFKQVOBXQFmQXABeYFDgY2Bl4GhwawBtoGAwcsB1YHfwepB9MH/QcmCE4IdQibCMEI5QgJCS0JUQl0CZcJugndCf8JIApBCmMK
hQqoCssK7goRCzQLVwt6C50LvwviCwQMJwxKDGwMjwyyDNUM+QwdDUMNaQ2RDbgN3g0EDioOUA51DpsOwg7oDhAPNw9dD4MPqA/M
D/APExA1EFcQeRCaELsQ2xD7EBsROxFaEXkRlxG2EdQR8hEQEi4STRJsEowSqxLLEusSDBMsE04TbxORE7IT1BP3ExkUPBReFIEU
pBTIFOwUDxU0FVgVfBWhFcUV6RUOFjIWVhZ6Fp4WwBbjFgUXKBdJF2sXjBetF80X7BcLGCkYRhhjGH8YmRizGMsY4Rj3GAsZHxkz
GUYZWRlsGX4ZkBmjGbUZxxnZGesZ/BkNGh8aMBpBGlMaZBp0GoUalRqkGrQawxrSGuEa8Br/Gg4bHRstGz0bTRtdG20bfRuOG54b
rxvAG9Eb4RvyGwMcFBwkHDQcQxxSHGAcbhx7HIcckxyeHKgcsRy4HL8cxBzJHM4c0RzUHNYc2BzaHNsc2xzbHNkc1xzUHNAczBzH
HMEcuxy0HKwcoxyaHI8chBx5HG0cYBxSHEQcNhwnHBccBxz3G+Yb1RvDG7AbnhuKG3YbYhtMGzQbGxsDG+oa0hq6GqIaiRpwGlYa
PBohGgUa6RnMGa8Zkhl1GVYZOBkYGfgY1xi1GJQYchhRGC8YDRjsF8kXpheDF2AXPBcYF/QW0BasFocWYhY9FhcW8RXLFaQVexVR
FSYV+hTQFKcUfxRYFDIUDBTnE8MTnxN8E1oTOBMXE/cS1xK3EpgSeRJbEj4SIRIFEuoR0BG3EZ4RhhFvEVgRQREtERoRBxH2EOUQ
1hDHELgQqRCaEIsQexBsEFwQTBA7ECoQGhAJEPcP5g/UD8IPrw+cD4kPdQ9iD1APPw8uDx0PDA/8DusO2g7JDrgOqA6XDoYOdg5m
DlYORg42DiYOFg4GDvYN5g3WDccNtw2oDZkNiQ16DWoNWg1LDTwNLQ0eDRANAg30DOcM2QzLDL0MrgygDJIMhAx3DGoMXQxRDEQM
OAwsDCAMFQwKDP8L9QvrC+EL2AvOC8ULuwuwC6ULmguOC4ELcwtlC1YLRws2CyQLEAv7CucK0Qq8CqcKkQp7CmQKTAo0ChsKAQrn
Cc0JsgmXCXsJYAlECScJCwnuCNEItAiXCHoIXQhACCMIBgjpB80HsQeUB3kHXQdCByYHCwfwBtUGuQaeBoMGZwZMBjAGFQb6Bd4F
wwWoBYwFcgVYBT4FJAUKBfAE1QS6BJ4EggRlBEgEKgQMBO4DzwOwA5IDcgNTAzMDEgPyAtICsQKQAm4CTQIrAgkC5wHEAaIBfwFc
ATgBFAHwAMwApwCDAF8AOgAWAPL/zf+o/4P/Xv85/xT/7/7K/qT+f/5a/jT+Dv7o/cH9m/10/U79KP0C/dz8tvyQ/Gn8Q/wc/Pb7
0Pup+4P77hHKEaURgRFdETkRFhHyEM8QqxCHEGQQQRAdEPoP1w+0D5EPbg9LDykPBg/jDr8Omg52DlEOLQ4KDucNww2fDXsNVw0y
DQ0N6AzCDJ0MeAxTDC4MCQzkC78LmQtzC00LKAsCC9sKtgqSCm8KTQosCg0K7gnRCbYJmwmBCWgJUAk4CSEJCgnyCNsIxAitCJYI
fwhnCE8INggdCAUI7AfSB7kHnweEB2kHTgcyBxgH/QbiBscGrAaRBnYGWgY/BiIGBgbqBc0FsAWSBXMFVAU1BRUF9QTVBLQEkgRu
BEoEJgQDBOADvQOaA3gDVQMyAw8D7ALKAqgChgJlAkMCIgICAuEBwQGgAYABYAFAASEBAgHkAMUAqACKAG4AUgA2ABsAAADk/8n/
rf+R/3X/Wf88/x//Af/k/sb+qP6K/mv+TP4s/gz+6/3K/an9h/1k/UH9Hf35/NX8sfyN/Gj8RPwf/Pr71vux+437aPtD+x77+PrS
+qv6hPpc+jP6Cfre+bP5iPld+TL5B/nc+LL4h/hd+DP4Cfje97L3h/db9zD3Bvfb9q/2hPZY9iz2APbT9aX1dvVI9Rn16vS79I30
YPQ09An04PO485Hza/NG8yLz//Ld8rvymvJ78l3yQPIl8gvy8vHZ8cHxqfGS8XzxZvFS8T7xKvEX8QTx8vDf8M3wu/Cp8JfwhvB1
8GXwVfBG8DfwKPAb8A7wAfD17+nv3u/U78rvwe+477Hvqu+k75/vm++Y75bvlO+T75PvlO+U75Xvlu+X75fvl++X75fvle+T75Hv
ju+K74XvgO9573Lvau9h71fvTO9A7zTvJ+8Y7wnv+e7o7tbuw+6w7pzuiO507l/uSu417iDuCu7z7d3txu2v7Zftf+1m7UvtL+0T
7fjs3ezC7Kfsi+xw7FXsOewd7ADs4+vG66jriutr60vrK+sK6+jqxeqh6n3qV+oy6g7q6enD6Z3pd+lQ6Sjp/ujU6Kvog+hb6DPo
Cuji57vnlOdt50bnIOf65tTmruaI5mLmPeYY5vPlz+Wt5Yvla+VL5SzlDeXv5NHksuST5HbkW+RC5CnkEuT74+TjzOOz45rjgONm
40vjMOMU4/ji3OLB4qbii+Jx4ljiQeIp4hPi/eHn4dLhvOGn4ZPhf+Fq4VbhQuEt4RnhBeHx4N3gyOC04J/gi+B24GHgS+A14B7g
B+Dw39jfwN+m343fc99a30DfKN8Q3/re5d7S3r/erd6c3ozefN5u3mLeV95O3kbeQN463jfeNN4z3jTeNt453j7eRN5L3lPeXN5m
3nHefd6K3pnep9633sbe1t7n3vfeCN8Y3yjfOd9I31jfZ99234Tfkt+g363fud/F39Df29/l3+7f998A4AjgEOAX4B7gJOAq4DDg
NuA84ELgSOBP4FfgX+Bp4HPgf+CM4JrgquC64M3g4OD14AvhIeE44VDhZ+F/4ZjhsuHN4ejhBeIj4kHiYOJ/4qDiwOLi4gTjJ+NL
43DjleO84+PjC+Q05F7kiOSz5N7kCeU15WLljuW65eflE+ZA5mzmmObE5u/mG+dH53PnoOfN5/rnJ+hU6IHor+jc6ArpOeln6Zbp
xen16STqVeqF6rbq5+oY60rrfOuu6+HrE+xF7Hfsqezb7A7tQu137avt4O0T7kbueO6q7tzuDe8/73Dvoe/R7wHwMfBh8JDwwPDw
8B/xT/F+8a7x3vEP8j/yb/Ke8s7y/fIt81zzjPO88+zzHPRM9Hz0rfTe9BD1QvV09ab12fUM9kD2c/an9tv2EPdF93r3r/fk9xn4
TfiB+Lb47Pgh+Vf5jfnC+ff5Lfpj+pn6z/oE+zr7cPum+9z7EvxI/H78tfzr/CH9V/2N/cL99/0s/mH+lP7H/vr+Lf9g/5P/xf/4
/yoAXACOAMAA8gAkAVQBhQG2AecBGAJIAncCpQLSAgADLANYA4MDrgPZAwMELQRWBH8EqATRBPoEIgVJBXAFlwW9BeMFCQYuBlIG
dgaaBr0G4QYEBycHSwdvB5IHtQfXB/gHFwg1CFIIbQiGCJ0IswjGCNgI6Aj2CAIJDQkXCSAJJwktCTIJNgk4CTkJOQk3CTQJMAkr
CSUJHgkWCQ4JBgn/CPcI8QjqCOUI4AjdCNsI2gjaCNsI3gjiCOcI7Qj1CP8ICgkXCSQJNAlECVUJaAl8CZEJpgm9CdQJ6wkECh0K
NwpSCm0KiAqlCsEK3wr8ChoLNwtUC3ELjgurC8gL5AsBDB4MOwxYDHUMkgywDM0M6gwIDSUNQw1hDX8Nng29DdwN+w0aDjoOWg56
DpwOvQ7fDgEPJA9HD2sPjw+0D9kP/w8mEE0QdBCcEMUQ7xAaEUYRchGfEcwR+REnElQSghKxEuASDxM+E24TnhPOE/8TLxRfFJAU
wBTwFCIVVBWIFbsV7hUgFlIWhBa2FukWHBdPF4IXtRfpFx0YUhiHGLsY7hgiGVUZiRm9GfIZJhpbGo8axBr5Gi0bYBuRG8Ab7RsZ
HEMcbByTHLoc4RwGHSsdTB1tHYwdqh3IHeUdAR4cHjceUR5qHoIemR6vHsUe2x7vHgIfFR8nHzkfSh9bH2sfex+LH5ofqB+2H8Qf
0R/eH+of9R8AIAsgFSAeICcgLyA2ID0gRCBJIE8gVCBaIGAgZSBqIG8gdCB6IH8ghCCKIJAgliCcIKIgqCCvILUgvCDDIMog0SDY
IOAg6CDxIPogAyENIRchIiEtITkhRSFQIVwhZyFyIX0hiCGTIZ8hqiG1IcEhzSHZIeUh8SH8IQUiDSISIhYiGCIZIhgiFiISIg0i
ByL/IfYh7CHgIdQhxiG3IachlSGDIW8hWyFFIS4hFyH+IOQgySCsII8gcSBTIDUgFSD1H9Qfsx+RH28fTB8pHwUf4R6+Hpsedx5U
HjAeDB7nHcIdnR13HU8dJx3+HNYcsRyPHG8cURw0HBkc/hvkG8wbtBudG4cbchtdG0obORsoGxgbChv8Gu8a4xrYGs8axhq/Grga
shquGqoapxqkGqMaohqjGqQapRqoGqsarxq0GrkavxrHGs8a2BrhGusa9Rr/GgobFRsiGy4bOxtJG1gbZht2G4YblhuoG7kbyxvd
G+8bAhwVHCgcOxxPHGMcdhyKHJ0csBzEHNgc6xz9HA8dHh0uHTwdSR1WHWIdbh15HYQdjR2VHZ0dpB2pHa4dsh20HbYdth21HbQd
sR2tHacdoR2aHZEdhx18HXEdZB1WHUcdOB0nHRYdAx3xHN0cyRy1HKAcixx0HF4cRhwuHBUc+xvfG8MbpxuKG20bUBszGxQb9hrY
GroanBp+GmAaQRojGgQa5RnHGagZiRlqGUoZKhkLGesYyxirGIoYahhJGCgYBxjmF8UXoxeCF2AXPRcaF/gW1RazFpAWbRZLFigW
BRbiFb8VmxV4FVUVMRUNFeoUxhSiFH4UWhQ1FBAU6xPHE6ITfhNZEzQTEBPrEsYSoRJ7ElYSMRILEvb//f8AAAEAAQABAAAAAAAA
AAAACgAXACgAMwA3ADIALgA1AD8AQAAsABYABgD+//3//v////7///8AAAAAAAAAAAAAAAD+//T/9f/5//7/AAD+/+//3P/W/9r/
3v/Z/8P/uP/O/+T/9f/+/wIAAgAJABMADQAGAO//4//U/8j/nP9L/yf/FP8C/+/+7/71/uv+6/7h/u7+7/7n/gz/6P7w/sz+Cv/v
/gb/Uf+G/gv/Rf8p/xr/Lf8i/1P/hv+r/9v/CwBHAIgAtQDYAOgA4QDhAOEA4QDLANUAyQC2AK8AswDGANkA3wDpAPwACgEhAToB
SQFLATsBNQEoAQ0B/ADtAOQA6ADmAPoACAESARcBGQEZARgBEgEAAd8AsgB9AFAAMQAWAAIA+f/3/+P/zP+4/73/zf/X/8n/r/+c
/5f/of+u/7L/pf+Y/53/sf/R/+b/6P/j/+f/8//9/wEAAgACAPb/5P/Y/8r/vP+1/67/qv+o/6X/nf+Y/5j/mP+e/63/uf/C/8b/
z//a/+j/9/8AAAMAAwACAAEAAQAAAOX/tv+P/4X/mP+7/8P/uv+u/7v/3f/2/w0ADQAHAPr/6f/O/8T/sf+Y/3j/Yv9O/23/pP+x
/7r/y//g//r/9f/A/2X/NP8q/xD/A/8V/yL/Fv8K/wr/Dv8D/w3/Cv8C/wj/C/8D//v+Af/1/vr+Cf8B/wv/Ef8I/yH/H/8e/yj/
Gf8l/xv/G/8n/xX/Kv8W/yL/NP8k/03/Sv+I/7f/3//3/xYAMgBOAGYAcwB/AIgAjgCdAK8AvADnAM8AyQDWAO8AAwEPARoBHQEe
ASIBJwEnAS0BLgEqARYBJwEHAQIBLgESAVABSQH5ABgBFAHlAKsAdQBKAE0AeACjAL8A5gDRAOEAEQH2AA0B6QDDAKQAdwA3AA4A
/P/y/+f/3f/e//H/+P8OACEAKwAhABEACAAOACUAMQAoABEA5f+q/2r/NP8E/+n+xv6c/qH+mP6d/qr+tv7C/t3+//72/tz+tv6l
/pD+eP5w/nb+ef56/pD+u/7b/vv+D//6/uH+y/7K/rf+rf7L/hD/kP8kAIoAogCZAIYAiAB7AEIACACW/z7/Jv80/07/Sf9D/1H/
Yf9z/4r/j/+Q/6P/wP/W/+X/6//k/9r/3P/n//f///8BAP//9v/3/wkAKABTAGsAcgBwAHkAhgCWAHAANQAIAPH/1//M/7f/kv+P
/6//0//t/+X/tf9s/zz//f7h/tL+0/68/rr+w/60/rT+qv6n/qD+wP7O/sD+3f7H/u7+4f7x/u3+D/8k/2P/sP/c/wgAEwAfADIA
WwCOAKMAnwCFAG4AiAC5ANoA3gDEAJoAjgCfAKkAoQCHAGoAYgBvAIcAlQCMAG4AQAATAP//7P/I/4P/Qf8U//X+3/7Q/rv+sv6w
/rb+z/77/iz/Sf9V/1H/SP9D/0D/Lv8C/9X+uP64/tL++P4S/wv/9v7o/uf+6f7o/tj+wf6q/qX+n/6o/rT+t/6y/rD+vf7Q/u/+
Ef81/03/V/9e/3P/lf+//+b/9//x/8r/of+m/8f/8/8dABoAEQDb/7z/w//Z/9j/ov9d/zP/PP9p/4T/bf84/xX/If9U/3j/b/8+
/xX/EP8w/1v/av9U/zb/Kf82/0T/Pf8X//H+3v7d/uj+7f7n/un+CP9H/4n/vP/K/7//tP+3/9H/6v/7//b/4P/L/9T/4//9/x4A
LQAmABcAFwA+AHQAowC9AMQA0wDvABEBHwEDAboAZgA7ADwASQBKADIAIwA7AIgA2QAHAfgAzQCjAJwArQC+AJkAWQAdABIAUgCi
ANkA+gACAf0ABwH7AOQAwgChAJgAtgDlAP8AAAH8AO8A9gD+AAQBAwH7APIA3wDAALAApACaAJEAoAC4ANUA9gALAQIB8gDfANcA
1gDOAL8ApACGAHkAgwCOAIgAdABkAF8AbAB7AIcAhQB4AHQAhACgAK4AsQCuAJwAkgCJAHkATwAjAAYA+v/6/wAACAAQAC8ASwBW
AFMAfwDwAGoBkwGiAZ0BkAGKAXoBeQF9AVwBVAFLAUgBUwFjAWgBaQFkAV0BYQFkAVoBOQEDAY4AJgD1/8j/nv9k/y//Cv/4/uT+
zf7K/sL+tP6s/qH+nP6d/pT+av4+/qT+Jv5j/rb+oP6c/sD+4/4A/xv/Of8w/yb/Kv86/1b/X/9h/2f/df+m/9z/OABpAG8ASQAy
ADcARQBLAEcALgAUAAQABAAOABkAIAAcAA8ABQD///3//f/+//3/6//T/8L/u/+2/6n/j/9k/0v/Wf9+/5j/kf9p/zn/KP88/1P/
VP8r//P+zv67/rL+r/6u/qb+q/65/uX+M/9z/5T/nP+T/5v/wf/j//v/7f/M/6z/qP+//97/7//a/7f/p/+w/87/4//U/7D/oP+4
/9r/9v8CAAQABAAkAEYATgA5ABoABQAFAA8AEQALAAMAAAD/////AAAKABIAFAAMAAQA7//g/8b/pf97/13/Tv9V/17/Sf9A/2P/
Xv96/6v/mf+e/27/Qv8y/xv/GP8U/xP/Dv8N/wr/GP8f/w3/Cf/y/s/+/v4b/yL/IP8q/yD/G/8p/xn/HP8f/xX/Jv8c/yb/KP8q
/0v/dv91/8D/1f/c/9v/5f/4/wMADQAOAA0ACgAMAAoACQAFAAEAAAACAAYACgANABEAHwA5AFQAawBrAHIAXwBSAEAALgAQAPj/
yP+5/8j/4f/1/wAAAgABAAgADgAHAAMAyv9w/w7/zf6r/pP+fv59/nj+gv6P/pL+gf6O/pf+nv6g/qn+rv6o/qf+qP6m/qL+pf6i
/qn+qv6l/qb+uP7D/sD+wf61/rD+xv7C/sf+6f4u/3L/zf///xQAIAA1ADwAPgA0ACEADgAEAAcADQASAAwABwACAAwARgCGAKoA
oACCAHoAfQCTALMArQCQAH8AYwBeAIoArQDAAMYAzgDQAMMA1QDkAN4A3wDWAN8A2wDqAOwA7QAsAegA8ADYAOwA5ADZAA8BAwHP
AOcA3wDSAL8AvACUAKcAgwCeAIkAogCNAKMAoQCjALoAqwC8ALwAqwCuAIoAcgBRAA4A2f+x/6D/l/+K/3v/dP9e/0v/Jv84/xj/
Hv8L/xb/A/8M/yD/7P4Q/wT/A/8W/wX/AP/n/ur+8v7J/t3+5P7N/uT+v/7Y/uP+uv7O/tb+xf7g/r3+1P7m/uT+6/77/vD++f4L
/yL/Ov9V/2v/gf+X/5v/nP+P/4P/ef9w/2j/V/8//y7/Lv9F/3//zP/3/woAFAAzAFYAawBiAEkAMgAkACEAIwAnACUAGgAOAAQA
AQAJABQAGgAXAA4ABgABAAUADwAWABMACwADAAAA/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPz/+f/5
//j//P/+/wAAAAD8//n/9P/1//n/+v/0/+z/5P/e/9z/4f8SABMAEQARABIA//8RABAAEAAQAA8ADwAPAA4ADgAOAA4ADQAOAA0A
DQANAA0ADQAMAAwADAALAAwACwAMAAsACwALAAoACwAKAAoACgAKAAkACQAJAAgABwAJAAgACAAIAM//q/5g/mb+mv5z/nX+ev6R
/oH+hv6N/pb+5/7T/tP+Pf9g/zf/Qv9y/+j/9P8JAAEA9P8GABwAEwA+ABUAUQBYAGMA4f8UAPH/DgBPAD8AHAAZADUAHQBOAGgA
dgBwAGoAZgBeAF8AVwBVAFMAUgBQAE0AdgBTAFMAVABQAE4ASwBHAEcARABCAD8ANAAtACsALQAyADYAOwA8AD4AQQBRACoAUAA4
ADMAMQAwADAAMAAxADIAMwA3ADoAPAA8ADoASgBMAEkASQBGAEMAQwBBAD8APgBJAD0AOQA4ADcANwA1ADQANAAzADMAMgAyADEA
MAAvAC8ALwAsACwAKwArABoADAALAAcAGQAYABcAFwAWABYAFgAUABUAFAAUABQAFAATABMAEwATABIAEgASABkAEQAQABAAEAAP
AA4ADQAOAA4ADgANAAwADAANAA4ADQANAF7/sP5q/p/+cv53/nj+ov6//rH+wv4m/8f+qv7Q/tv+MP8N/8f++f4s/z7/Ov9y/07/
T/9M/1P/g/+4/+D/+v8CAA4AEQAWABsAEQDy/wcA+P/1/woA+/8IABQACAAiABwAFAAgAA0AJwAVAA4AKQAPACkAIAAZAEIAIABO
AC8AaAB/AIwAhgCAAIMAgQB9AHkAdAB8AHMAbQBmAGMA9P8QABIACgD8/+z/3v/Z/+j/6v/l/9X/yP/P/+H/8//+/wQA0f/j/9H/
3//3/+X/BAAPACAAPwBwAIAAggB3AG0AZQBnABEATgBYAAwAOwAOAD4AWABiAHIAcQBsAGkAZgBnAGMAYQBfAFwAXABIAGEAVQBW
AFQAUwBTAFEAUABPAEwASQBFAD4ANAAwACMA8v8OABcAIAAlAC4AMgA5AF8AOAAyACQAHAAWABQAEQAUABYAHAAjACwAMgA4ADMA
MAArACQAKAAkACUALAAwADsAOwA0ADEANAA1ADUANAAzADIALwAmACMAKQApACkAKAA+ACAAKQAoACkAJwAoACcAJwAnACcAJgAl
ACQAJAAjACMAIgAiAAQABAAVAB8AHQAeAB4AHQAbABsAGgAaABwAHAAbABkA9v6E/m7+dv56/pz+0/6O/rH+DP/9/jH/N/8p/yL/
jf/J//H/8//v/x8AQwBAAEcARwACADEA//8xAAQAJwAYADQAHwBVAIAAfgB2AHUAcgBuAIcAVABUAFEAUwBUAE8ASgBGAEMARwBK
AEgARgBAAEEAQwBDAC4ATAA/AD4APgA/AEAAPwA+AD0APAA3ADEAKgA2ADYANAAwACwALAAwADUAPAA/AD8ALAArACkAKAAtACUA
HwAWABAAEQAYACAAIQAfABwAGQArACwALQApACIAHgAdAA8AEQATABQAEgARABMAFgAaAB4AHwAgAB8AHwAgACEAMgAwADAALwAu
AC0AKwAsACwAKwAqACoAKAAoACgAJwAmACQAIQAaABwAIgAiAB8AHAAVABcAHwATACgAGQATABMAGAAbABsAGQAXABUAFQAXABYA
FAANAAsADQARABAADwANABEAEgAKAAsACgAKAAoACgAKAAsACgAKAAoACQAKAAoACgAJABgAFwAXABIABgAEAAQAAwADAAIAAQD8
//j/+P8DAAYABwAHAAcABwAWABUAFAASAAwABQAIABAAEQAQABAADwAOABMABAAEAAIA8v/9//j/+//z//3//v8AAAIABAADAAEA
//8EAAEADQAHAA0ADAAKAAwABAANAA0ACgAQABAAEAAQAAAA///2//z/+v/8////AAAAAAAAAQACAAIABAAEAAMABAAEAAQABAAF
AAQAAAADAAMABAADAAMAAQABAAEAAgACAAMAAwAEAAQABQAEAAQABAAEAAQACP/C/n3+Z/5p/nb+fv4d//X+Gf8d/w3///4K/yX/
uf8WADIAOAA0ADIAKAAhAB0AGwAfACQALgA2AD8ATABOAEwATABJAEUAQQA8ADgAOQA5ACwAJgAfACAAIgAjACUAIwAlABYABAAG
AMz/CAAbACUAKAAuADIAOQA6ADoANwA3ADMANQA4ADgAPABJAEcASQBIAEUAQwBAAEMAQQA/AB4ASgA+ADkAOAA5ADcANwA1ADcA
NAA0ADIAMwAyADEAMQAwAC8ALQAsACwAKwAqACgAJgAjACMAJgAmACUAIgAeABoAHgAgAB8AGgATAA0ADQAPAA8ADgANAAwAAQAF
AA0ADwAPAP3/EAAOAA8ADwAPAA8ADwAOAA4ADwAOAA4ADQANAAwADgAMAAwADAAMAAwACwANAA0ADAAMAAwACwALAAoACwAKAAsA
CgAJAAoACgAJAAkACAAJAPr+/v6y/nT+uf5z/nf+fP6U/oP+h/67/tz+B//g/i//Tf/3/lP/LP/j/jz/+/4m/0T/Sv94/0T/Uv9b
/5L/sf/R/+v//P/e//T/9P8SADQAOwA8ABoANgAhABgAKgATACIAJAAZADgAHgAxADIALwBNAHEAOABxAIMAggCDAIMAgwB/AHsA
dwB0AJIAhQBwAG4AcABtAGwAbABpAGUAZgBjAGAAXABaAFgAggBXAFgAWABUAFQAVABRAE8ATQBOAEsASgBIAEcARgBGAGkARABC
AEAABQDj/7X/pv+i/57/oP+d/6D/tv/k/5r/qv/O/+z/8P8OABwAHwAjACEAIgAkACIAIQAnACQAKwAvADEAMQAuADAAKwA3ACgA
OABBAEAAQQBMAEsASgBKAEcARQBEAEsARABCAEAAQAA+AD4APQA9ADsAOwA7ABb/xv7S/sH+qf72/uX+xv4c//b+3v4b/+7+3/4o
/0b/Tf9T/3P/Uf9M/1H/U/9b/1L/Tv9h/1T/3v/w//3/2P/i/97/8v/y//n/BwDs/+z/CgACAA4AIwBAADUAXABFAGcARwBmAEYA
ZABHAFAARAA3AEcAPwA2AFEAQwBvAHgAPwB1AIEAggB/AH4AfQB3AHcAcgBnACMAUQAlAD0AHwA2ABcAOABdABAATAAmADMAWgBb
AFIAHQAoAEoACgAlAD4ACQA8AAEAMgBHAPv/LAAoABAAQgAGACsATQBPAE0ATwBPAFkAVQBYAFoAWABYAFcAfwBWAFUAVABTAE8A
TQBNAEwAWgBWAFMAUwBcAF0AWABNAGkAVABSAFEAUABRAFAATgBMAEsASQBJAEcARQBDAEIAQAA/ADIASgA7ADkAOAA2ADYANQA1
ADMANAAyADIAMQAwAC8AMAAtAC0ALAArACsAKQApACgAKAAmACYAJQAkACQAIwAiACIAIAAiACwAHgAfAB8AHgAeAB0AHQAaABsA
GwAaABkAGQAZABUAY2NjY2RkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRjZGRkZGRkZGRkZGNjY2NjZGRkZF4hAAAAAAAAAAAAAAAA
AAAAAAAAEkdhY2NjY2NjZGRkZGM7SmRjZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRk
ZGRkZGRkZGRkZGRkZGNkZGNjZGRkZGRkZGRkZGRjZGRkZGRkY2RkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRk
Y2NjZGRkZCUSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABECkxNjo9QEJFR0pNUlZcY2RkZGRkY2RkZGRkZGRkZGRkZGRkY2Nj
Y2NjY2NjY2NjY2Q1MzIvLCgoKCgoJyATHyYzOkFJUFdfYmRjZGRkZGRkZGRkZGRkZGRjY2NjY2NkY2NjZGRjZGNkZGNjY2NjZGRk
ZGRkZGRkZGQoZGRkY2NkZGNkZGRkZGRiZGRkZGRkZGRkZGRkY2NjY2NkZGRjZGRkZGNkZGRkY2RkY2NkZGRkZGRkZGRkZGRkZGRk
ZGRkY2NjZGRkY2RkZGRkZGMcAAAAAAAAAAAAAAAAAAAGNFhgY2RkZGRkZGRkZGRkZGRkZGRkZGRkY2RkZGRkZGRkZGRkZGNkY2Rk
ZGNjY2RkZGRkZGRkZGNjY2RkZGRkZGRkZGRkZGRkZGRkY2RjY2NjY2RkZGRkY2NjZGRkY2RkZGRkZGRkZGNjZGRkY2RkY2NjY2Rk
ZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRjY2RkZGRkZGNjY2RkZGRjZGRkZGRkZGRkZGRkZGRkZGRkY2RkY2RkZGNjY2Nk
ZGRkZGNkZGRkY2NjY2NjZGRkY2RkZGRjZGRkZGRkZGRkZGRkZGRkZGRkZGNkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRk
ZGRkZGRkZGRkZGRkZGRkZGQnCgAAAAAAAAAAAAAAAAA1X2NkZGRkZGRkZGNkY2NkY2RkZGRkZGRkZGRkZGRkZGRkZGNkZGNjZGRk
ZGRkZGRkZGNjY2RjY2RkZGRkY2RkY2RkZGNjY2NjY2RjZGNkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRjY2RkZGRkZGRkZGRkZGRk
ZGRkZGRkZGRkY2NjY2NkY2NjZGRjZGRkZGRkZGRkZGRkY2NkZGRkZCgnFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQUITA0
Nzs/REpQVlxiZGRkZGRkZGRkY2NjY2NjY2NjZGRkZGNjY2RjY2NjY2NkZGNkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGI/KwgA
AAAAAAAAAAAXNklUXGFjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NkZCMLAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAaKjA4RVFXWV1cXFhVWl9jY2NjY2NjY2NjZGNkZGNjY2NjY2NjZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRk
ZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRjY2NjZGRjY2NjY2NjY2Nj
Y2NkY2NjY2NjY2NkY2NjY2NjY2NjZGRjZGRkZGRkY2NkY2NjY2MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAADFRkZGRkZGRkZGRkZGRkZGRkZGI3AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO1BkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRiUhYBAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEFeZGRkZGRkZGRkZGRkXzIAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxAXGRkZGRkZGRkZGRjUAsAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOj1RYWRkZGRk
ZGRkZGRkZGRkZGRkZGRkZGRiVEQoEgUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAPVBgY2RkZGRkZGRkZGRkZGRkZGRkZGRkZGNXOAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcHBwcHCAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIBwcHBwYGBgYFBQUFBQQEBAQEBAQEBAQEBAQEBAQEBAQE
BAQEBAQEBAQEBAQEBAQEBAQEBAQEBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgcHBwcH
BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcICAgICAgICAgICAgICAgICAgICAgHBwcHBgYGBgUFBQUF
BAQEBAQEAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMEBAQEBAQEBAQEBAQE
BAQEBAQEBAQEBAQEAwMDAwMDAwMDAwQEBAQEBAQEBAQEBAQEBAQEBAQEBAUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUGBgYGBgYG
BgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcG
BgYGBQUFBQUFBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQFBQUFBQUFBQUFBQUFBQUFBQUGBgYGBgYGBgYGBgYGBgYGBgYGBgYG
BgYGBgYGBgcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAcH
BwcHBgYGBgYGBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYH
BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgIBwcHBwYGBgYFBQUFBQUEBAQEBAQEAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD
AwMDAwMDAwMDAwMEBAQEBAQEBAQEBAQEBAQEBQUFBQUFBQUFBQUFBQUFBQUGBgYGBgYGBgYGBgYGBgUFBQUFBQUFBQUFBQUFBQUF
BQUFBQUFBQUFBQUFBQUFBQUFBQUGBgYGBgYGBgYGBgYGBgYGBQUFBQUFBAQEBAQEBAMDAwMDAwMDAwMCAgICAgICAgICAgICAgIC
AgICAgICAgICAgICAgICAgICAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE
BAQEBQUFBQUFBQUFBQUFBQUFBQYGBgYGBgYGBgYGBgYGBgYGBgYHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcI
CAgICAgICAgICAgICAgI`;
const LAP_B_DATA = `
DgAjADcATABhAHYAiwCfALQAyQDeAPMABwEcATABRQFZAW0BggGXAawBwQHVAeoBAAIXAi0CQwJYAm0CggKYAq0CwwLZAu8CBgMd
AzMDSgNgA3YDjAOiA7gDzgPkA/oDEAQnBD0EUwRpBH4EkwSnBLsEzQTfBPEEAgUTBSMFMwVCBVEFXwVsBXkFhQWRBZwFpwWxBbsF
zQXjBfkFDwYjBi4GNwZABkkGUwZdBmcGcQZ8BocGkgaeBqoGtQbCBs4G2gbnBvMGAAcNBxoHKAc1B0IHUAdeB2wHegeIB5cHpQe0
B8IH0QffB+4H/QcLCBoIKQg4CEcIVghlCHQIgwiTCKIIsQjBCNEI4QjxCAEJEQkiCTIJQwlUCWUJdgmICZoJrAm+Cc8J4QnzCQUK
FwopCjsKTgpgCnIKhQqXCqoKvQrQCuMK9goKCx0LMQtFC1gLbAuBC5ULqQu9C9EL5Qv6Cw4MIgw2DEsMXwx0DIkMnQyyDMcM3Azy
DAgNHg01DUsNYQ13DY0Now24Dc4N4w35DQ4OJA45Dk8OZQ57DpEOpg68DtIO6A7+DhQPKg9AD1cPbg+ED5kPrQ/BD9QP5g/3DwgQ
GBAnEDYQRBBSEF8QaxB3EIIQjRCXEKEQqxC1EL8QyBDRENkQ4RDpEPEQ+BD/EAYRDBEUERwRJBEsETYRQBFLEVgRYxFuEXgRgxGL
EZIRmhGhEakRsRG5EcERyRHREdkR4RHpEfER+hEDEgwSFRIeEicSMRI6EkQSTRJXEmISbBJ2EoESjBKYEqMSrxK6EsUS0RLcEucS
8hL8EgcTERMcEyYTMRM7E0YTURNcE2gTcxN/E4oTlROhE6wTtxPBE8sT1RPfE+kT8hP7EwUUDhQYFCEUKxQ1FD8USRRTFF4UaBRz
FH4UiRSUFJ8UqhS2FMIUzRTaFOYU8hT/FAwVGRUnFTUVQxVSFWAVbxV9FYwVmxWpFbgVxxXWFeUV9RUEFhUWJhY4FkkWWhZqFnoW
ihaaFqoWuhbLFt4W8BYCFxUXJxc4F0gXWBdnF3YXhReVF6UXtRfFF9UX5Rf1FwQYFBgkGDQYQxhTGGMYcxiEGJQYpRi1GMYY1xjo
GPoYCxkcGS4ZQBlSGWQZdhmIGZoZrRm/GdIZ5Rn3GQoaHRowGkMaVhppGnwajxqjGrYayhreGvMaBxscGzAbRBtYG2wbgRuVG6kb
vRvQG+Ub+RsOHCMcORxNHGIcdRyIHJscrRy+HM4c3hzuHP0cCx0ZHScdMx1AHUwdWh1oHXYdhB2THaMdsh3AHcwd1x3iHesd9R3+
HQceER4bHiUeLx45HkQeTx5aHmUecR59Hooelh6iHq4eux7HHtQe4h7vHvweCB8VHyIfLx88H0ofWB9mH3Qfgh+PH50fqx+5H8cf
1R/jH/EfACAPIB4gLiA9IE0gXCBsIHwgiyCbIKsguyDMINwg7SD9IA4hHyEwIUEhUyFkIXUhhyGYIaohuyHNId4h7yEBIhMiJCI2
IkciWSJqInwijSKfIrAiwiLUIuYi+CIKIxwjLyNBI1MjZSN3I4ojnCOuI8Aj0yPlI/cjCiQcJC4kQCRSJGQkdiSJJJskrSTAJNIk
5CT3JAolHCUvJUIlVSVoJXsljiWhJbUlyCXcJe8lAyYXJismQCZUJmgmfSaRJqUmuibOJuMm+SYPJyUnPCdSJ2cnfCeRJ6YnuifP
J+Qn+ScNKCIoNyhLKGAodCiIKJ0osSjFKNoo7igCKRcpKyk/KVMpaCl8KZAppSm5Kc4p4in3KQwqICo1KkoqXipzKogqnSqyKsgq
3SryKgcrHSsyK0crXStyK4crnCuxK8cr3CvyKwcsHCwyLEgsXSxzLIgsniy0LMos3yz1LAstIS03LU0tYy14LY4tpC26LdAt5i38
LREuJy48LlIuaC5+LpQuqi7ALtYu7C4CLxgvLi9EL1svcS+HL50vtC/KL+Ev+C8OMCQwOjBQMGYwezCRMKYwvDDRMOYw/DASMSgx
PTFTMWgxfjGUMaoxvzHVMesxATIWMiwyQjJXMm0ygzKZMq4yxDLYMu0yADMTMyYzODNJM1ozajN6M4kzmDOoM7czxzPYM+gz+TMJ
NBk0KDQ2NEU0UzRhNG80fDSKNJg0pjS0NMI00DTeNOw0+jQKNRk1KTU4NUg1VzVmNXQ1gzWRNZ81rjW9Ncw13TXtNfw1CzYZNic2
NjZFNlU2ZjZ2NoY2lzaoNrg2yDbXNuc29zYHNxY3Jjc3N0c3WDdpN3o3izecN603vTfPN+A38TcDOBQ4Jjg4OEo4XThvOIE4lDin
OLk4zDjfOPE4BDkXOSo5PTlQOWM5djmJOZ05sDnDOdc56jn+ORI6Jjo6Ok46Yjp1Ook6nTqyOsY62jruOgI7FjsqOz47UjtmO3o7
jjuiO7Y7yzvfO/M7BzwbPDA8RDxYPGw8gTyVPKo8vzzUPOk8/jwTPSg9PT1SPWc9fT2SPag9vj3UPek9/z0VPio+QD5WPmw+gj6Y
Pq4+xD7bPvE+Bz8dPzI/Rj9aP20/fz+RP6I/sj/DP9M/4z/xP/8/DUAZQCZAMkA9QEhAU0BeQGhAckB8QIVAjkCWQJ5ApkCtQLRA
u0DDQMxA1UDfQOpA80D7QAJBCEENQRNBGEEdQSNBKEEuQTNBOUE/QUVBS0FRQVdBXkFkQWtBckF6QYJBikGSQZpBokGrQbNBvEHE
Qc1B10HgQepB9EH9QQhCEkIdQihCM0I+QklCVUJhQm1CeUKGQpNCoUKuQrtCyULWQuRC8kIAQw5DHUMrQzpDSENXQ2ZDdUODQ5ND
okOyQ8JD0kPiQ/NDBEQVRCZENkRGRFZEZkR2RIZElkSlRLVExUTURONE8kQBRRBFH0UtRTxFSkVXRWVFc0WBRY9FnEWqRbdFxEXS
Rd9F7UX7RQlGF0YlRjRGQkZRRl9GbkZ9RoxGm0apRrhGx0bVRuRG80YDRxJHIkcxR0JHUkdkR3ZHh0eXR6ZHtEfCR9BH3UfqR/ZH
A0gPSBpIJkgxSD1ISEhSSFxIZUhvSHhIgEiJSJFImEigSKdIrki3SL9IxkjOSNZI3UjkSOpI8Ej1SPlI/kgCSQZJC0kPSRNJF0kb
SR9JJEkoSS1JM0k4ST1JQklHSU1JUklYSV5JZElqSXBJd0l+SYRJi0mSSZlJoEmoSa9Jtkm+ScZJzknWSd5J50nvSfhJAUoKShNK
HEomSi9KOUpDSk1KVkpgSmlKc0p9SodKkkqcSqhKs0q/SstK10rkSvBK/UoJSxVLIEssSzhLREtPS1tLZktyS31LiUuUS6BLq0u3
S8JLzUvYS+NL7kv6SwVMEUwcTChMNExATE1MWUxmTHNMgEyOTJtMqUy3TMVM1EziTPFMAE0PTR5NLk09TU1NXE1sTXxNjE2dTa1N
vk3PTeBN8U0CThNOJU42TkhOWk5sTn5OkE6iTrROx07aTu1OAE8TTyZPOU9NT2FPdE+IT5xPsE/ET9dP60//TxNQJ1A7UE9QY1B3
UIxQoFC0UMlQ3VDyUAZRG1EwUUVRW1FwUYVRmlGvUcRR2VHvUQRSGlIvUkVSWlJvUh4BHwEfASABIAEhASEBIgEiASMBIwEjASQB
JAElASUBJQEmASYBJwEnAScBKAEoASgBKQEpASkBKgEqASoBKwErASsBLAEsASwBLQEtAS0BLQEuAS4BLgEuAS8BLwEvAS8BLwEv
ASkBIwEdARYBDgEFAfwA8wDrAOUA3wDaANQAzgDKAMQAvgC5ALQAsACuAKsAqACmAKQAogCgAJ8AngCcAJsAmwCcAJwAnQCeAJ8A
oACgAKIAowClAKgAqgCsAK4AsACxALMAtAC2ALcAuQC6ALwAvgDAAMIAxQDHAMoAzADOANAA0gDTANUA1gDXANkA2gDaANsA3ADd
AN4A3gDfAN8A4ADhAOEA4gDiAOMA5ADlAOYA6ADpAOkA6wDsAO0A7gDwAPIA8wD0APUA9gD3APcA+AD5APoA/AD9AP4AAAEBAQIB
AwEFAQYBBwEJAQoBCwENAQ4BDwEQAREBEgESARMBFAEUARUBFgEWARcBGAEYARkBGgEaARsBHAEcAR0BHQEeAR4BHwEfASABIAEh
ASEBIgEiASIBIwEjASQBJAElASUBJgEmASYBJwEmASABFwEOAQQB+gDxAOgA4ADXAM4AxwC+ALYArgCoAKEAmgCTAI4AiACFAIEA
fAB3AHQAcgBxAHAAbwBuAG0AbABqAGkAaQBpAGgAaABnAGcAZgBlAGUAZABjAGIAYgBiAGIAZABlAGcAaQBsAG4AcQBzAHUAeAB6
AHsAfQCAAIEAggCDAIUAhgCHAIgAiwCNAJAAkgCVAJgAmgCdAJ0AnQCcAJsAmwCaAJkAmACXAJcAlgCVAJUAlACUAJMAkwCSAJIA
kQCQAJAAjwCPAI4AjgCOAI4AjgCOAI4AjgCOAI4AjgCOAI8AjwCQAJEAkwCVAJgAmgCdAJ8AogCkAKYAqQCrAK4AsACyALUAtwC5
ALsAvQC/AMEAxADGAMgAygDMAM4A0ADSANMA1QDWANgA2QDbANwA3QDeAN8A4ADhAOIA4wDkAOUA5QDlAOIA4ADeANsA2gDaANsA
3ADdAN4A3gDfAN8A3gDdANYA1gDXANgA2ADZANsA3QDeAN8A4ADhAOIA4wDkAOYA5wDoAOgA6QDqAOsA7QDuAO8A8QDyAPQA9QD2
APcA+QD6APsA/AD9AP4A/wAAAQIBAwEEAQUBBgEHAQgBCQEJAQoBCwEMAQwBDQEOAQ4BDwEQAREBEQESAQ4BCAECAfwA9QDtAOgA
4gDcANcA0QDMAMgAwgC9ALgAswCrAKkAowChAJ4AnACbAJoAmQCZAJkAmQCZAJoAmwCbAJsAmwCcAJwAnACeAJ4AnwCfAKAAoQCi
AKMApAClAKUApgCmAKgAqQCpAKkAqwCtAK8AsgC0ALYAuAC7AL0AvwDBAMMAxQDHAMkAywDNAM4A0ADRANMA1QDXANkA2wDdAN4A
4ADiAOMA5QDnAOkA6gDsAO0A7wDwAPEA8gDzAPQA9QD1APYA9wD3APgA+QD5APoA+wD7APwA/QD+AP8AAAEBAQIBAwEEAQUBBQEG
AQYBBwEHAQgBCAEJAQkBCgEKAQsBCwEMAQwBDQEOAQ8BEAERARIBEwEUARUBFgEXARgBGQEaARsBGwEcAR0BHgEfASABIAEhASIB
IwEjASQBJAElASUBJgEmAScBJwEoASgBKQEqASoBKwErASwBLAEtAS0BLQEuAS4BLgEvAS8BLwEvAS8BLwEvAS8BLwEvATABMAEw
ATABMAEwATEBMQExATEBMgEyATMBMwEzATMBMwEzATQBNAEzATMBMwEzATMBMwEzATIBMgEyATMBMwEzATMBMwE0ATQBNAE1ATUB
NgE2ATYBNwE3ATcBNwE3ATcBNwE3ATcBNgE2ATUBNQE1ATUBNAE0ATQBNQE1ATUBNQE2ATYBNgE3ATcBNwE3ATgBOAE4ATgBOAE4
ATgBOAE4ATgBOAE3ATcBNwE3ATcBNwE2ATYBNgE2ATYBNgE2ATYBNgE2ATYBNgE2ATYBNgE2ATYBNgE2ATYBNgE3ATcBNwE3ATcB
NwE3ATcBNgExASoBIgEZARABCQEBAfwA9QDvAOsA5QDgANwA2QDXANYA1ADUANIA0gDRANAAzwDPAM8AzwDPAM8A0ADQANEA0QDS
ANMA1ADVANYA1gDXANcA1wDYANgA2QDZANoA2gDbANwA3ADdAN0A3gDeAN8A4ADhAOIA4wDkAOQA5QDmAOcA5wDoAOkA6gDrAOwA
7QDuAPAA8gDzAPUA9gD4APkA+gD8AP0A/wAAAQEBAwEEAQUBBwEIAQkBCgELAQ0BDgEPARABEQESARMBFAEVARYBFwEYARkBGgEb
ARwBHAEdAR4BHwEgASABIQEiASIBIwEjASMBJAEkASUBJQElASUBJQElASUBJQElASUBJgEmASYBJgEnAScBJwEoASgBKQEpASkB
KQEqASoBKgErASsBKwEsASwBLAEtAS0BLQEtAS4BLgEuAS4BLwEvAS8BMAEwATABMAEwATEBMQEwASoBJAEfARgBEAEHAf4A9QDs
AOQA2wDTAM0AyADBALsAtgCwAKwApwChAJwAlwCTAI8AigCHAIMAfwB8AHgAdABwAGwAaQBlAGMAYQBgAF4AXQBcAFsAWgBaAFoA
WQBZAFkAWQBZAFoAWwBcAF0AYABiAGQAZwBqAGwAbwBxAHQAdwB7AHwAfwCBAIQAhwCJAIwAjwCSAJQAlwCZAJwAnwCiAKQApgCp
AKsArgCwALIAtQC3ALkAuwC9AL8AwQDEAMYAyADKAMwAzgDPANEA0wDVANYA2ADaANsA3QDfAOAA4gDjAOMA4gDhAOAA3gDdANsA
2ADWANMA0QDQAM4AzADLAMkAyADHAMYAxgDGAMcAxwDHAMgAyADJAMkAygDKAMoAywDLAMwAzQDNAMwAzQDOAM4AzgDPANAA0gDT
ANUA1gDYANoA2wDdAN4A3wDhAOIA5ADlAOcA6ADpAOQA3wDaANQAzgDJAMMAvQC4ALMArwCrAKYAoQCcAJcAkwCOAIoAhgCDAH4A
egB2AHIAbQBpAGUAYABeAFoAVgBSAE8ASwBIAEUARABCAEEAQAA/AD4APgA+AD0APgA+AEAAQgBFAEcASgBMAE4AUQBUAFYAWQBb
AF4AYQBjAGUAZwBpAGoAbABuAG8AcQBzAHUAeAB6AHwAfgCBAIMAhQCFAIYAhwCIAIkAiQCKAIsAjACOAI8AkQCTAJUAlwCaAJwA
ngCgAKIApACjAKIAoACfAJ0AmwCZAJgAmACZAJkAmQCZAJoAmgCaAJoAmgCbAJsAnQCdAJ4AnwChAKMApgCoAKoArACvALEAswC1
ALcAuQC7AL4AwADDAMUAyADKAM0AzwDRANQA1gDYANoA3ADeAOAA4gDkAOYA6ADqAOwA7gDwAPEA8wD1APYA+AD6APsA/QD+AP8A
AQECAQQBBQEGAQgBCQEKAQsBDQEOAQ8BEAERARMBFAEVARYBFwEYARkBGgEbARwBHQEeAR8BHwEgASEBIgEjASQBJQElASYBJwEo
ASgBKQEqASoBKwEsASwBLQEuAS4BLwFg+zv7Ffvv+sn6pPp++ln6M/oO+uj5wvmd+Xj5U/ku+Qn55Pi++Jn4c/hN+Cf4Afja97L3
ifdi9zv3Fffu9sj2oPZ59lH2KfYA9tf1rvWF9Vz1NPUM9eT0vPSU9Gv0Q/Qa9PHzx/Oe83bzT/Mp8wPz4PK+8p7ygPJj8kjyLvIW
8v/x6/HZ8cjxufGr8Z7xk/GJ8YHxevF08W/xa/Fo8WXxY/Fi8WHxYvFj8WXxaPFr8W/xdPF58YDxhvGN8ZPxmvGf8aTxqPGr8a3x
r/Gv8a7xrfGq8afxpPGg8Zzxl/GS8YzxhvF/8Xfxb/Fl8VrxT/FC8TPxJPET8QHx7fDY8MLwq/CS8HnwXvBC8CTwBvDm78bvpe+D
72HvP+8c7/ru2e657pnue+5d7j/uIO4A7uDtvu2c7XrtVu0y7Q3t6OzE7J/se+xX7DPsD+zs68nrpuuC61/rO+sX6/Pqz+qr6ojq
ZOpB6h7q+unX6bXpkulw6U7pLOkK6ejoxeih6H3oWug26BPo8efP563njOdr50vnK+cL5+zmzeau5pDmcuZU5jbmGOb65dzlvuWf
5YHlYeVC5STlB+Xs5NLkuuSi5IzkduRi5E/kPeQr5BrkCuT64+zj3uPR48XjueOu46PjmuOS44rjheOA43zjeeN343bjduN343jj
e+N+44PjiOOO45XjneOl467jt+PB48zj2OPk4/HjAOQQ5CHkM+RF5FbkaOR75I7kouS25Mzk4eT35A3lJOU75VLlauWC5ZvltOXP
5erlBeYi5j/mXOZ55pbmsubN5unmBOce5zfnUOdp54HnmOev58Xn2+fw5wToF+gp6DroSuha6GjodeiB6I3ol+ig6KnosOi36L3o
wujG6Mnoy+jN6M3ozOjL6MjoxejC6L7ouui26LLoruiq6Kboouie6JroluiS6I7oiuiF6IHofOh36HLobeho6GPoX+ha6FboUuhP
6EzoSehI6EfoR+hI6EroTuhT6FroYehp6HPofeiJ6JbopOiy6MLo0uji6PToBekZ6S3pQulZ6XHpiuml6cDp3On66RrqO+pc6n7q
oOrE6ufqCust60/rcuuT67Tr1uv36xrsPexg7IXsq+zS7PvsJO1N7Xbtnu3H7fDtGu5E7m3ul+7B7uvuFu9A72vvlu/C7+7vG/BJ
8Hjwp/DW8AXxM/Fh8Y/xvfHq8RfyQ/Jv8pryxvLy8h/zTPN686bz0fP88yX0TvR39J70xfTs9BL1N/Vc9X/1ovXD9eT1BPYj9kH2
X/Z79pf2svbO9un2Bfcg9zv3Vvdx94z3pvfA99n38vcL+CT4PPhV+G34hfie+Lb4zvjm+P/4GPky+Uv5ZvmB+Z75uvnW+fP5EPot
+kz6avqK+qn6yfrq+gr7K/tN+277kfuz+9b7+vse/EP8aPyN/LP82Pz+/CP9Sf1v/ZT9uv3f/Qb+LP5S/nj+n/7F/uz+Ev84/17/
hf+r/9D/9P8ZADwAXwCCAKQAxgDmAAcBJgFFAWMBgAGcAbgB0wHtAQcCIAI4AlACZwJ9ApMCpwK6As0C3wLwAgADEAMeAywDOQNF
A1ADWwNlA24DdwN/A4gDjwOXA58DpgOuA7UDvAPDA8oD0QPYA98D5QPrA/ED9wP9AwIEBwQKBA4EEAQSBBMEFAQTBBIEEAQOBAsE
BwQDBP4D+QPzA+wD5QPdA9QDywPBA7YDqgOdA5ADgQNyA2MDUgNCAzADHgMMA/kC5gLSAr4CqgKVAoACbAJXAkICLQIYAgMC7wHb
AccBswGgAY0BegFpAVgBSAE4ASkBGwEOAQIB9wDtAOQA2wDUAM0AxwDCAL4AugC2ALMAsQCuAKwAqwCpAKkAqQCpAKsArQCwALQA
uQC/AMcAzwDYAOMA7gD6AAcBFQEjATIBQQFRAWEBcgGEAZYBqQG9AdEB5gH8ARMCKgJDAlwCdQKQAqsCxwLkAgIDIQNBA2EDgQOi
A8QD5gMIBCsETwRyBJcEvATiBAkFMAVXBX0FpAXLBfIFGgZCBmoGkga6BuIGCgczB1wHhgevB9kHAwgsCFQIewiiCMgI7ggTCTgJ
XQmBCaUJyQnsCQ8KMgpWCnkKnAq/CuIKBgspC0wLbwuRC7QL1gv4CxsMPQxfDIIMpAzFDOcMCg0uDVQNew2jDcoN8A0WDjsOYA6F
DqoOzg7xDhUPOQ9cD38Pog/FD+cPCRArEE0QcRCVELgQ2hD7EBoRORFYEXYRlRGyEdAR7RELEikSRxJlEoUSpRLGEucSBxMpE0oT
axONE68T0RP0ExYUORRcFH8UoRTFFOgUCxUuFVEVdBWXFboV3BX+FSEWQxZmFogWqhbLFu0WDxcwF1EXcheSF7IX0hfxFw8YLRhK
GGcYgxieGLgY0RjpGP8YFRkqGT4ZUhlkGXYZiBmZGakZuRnJGdkZ6Bn4GQgaFxonGjcaRxpWGmcadxqHGpcapxq3Gsca2BroGvga
CRsZGyobOxtLG1sbbBt8G40bnRuuG74bzxvfG/AbABwRHCEcMBw/HE4cXBxqHHccgxyPHJocpRyvHLgcwBzHHM0c0xzYHNwc3xzi
HOQc5RzlHOUc4xzhHN4c2hzWHNEczBzGHMAcuRyyHKscoxyaHJEchxx+HHMcaBxdHFIcRhw6HC0cIBwTHAUc9xvpG9obyxu7G6sb
mhuJG3cbZBtQGzwbKBsUGwEb7RrYGsMarRqXGoEaahpSGjoaIRoIGu8Z1Bm6GZ4ZgxlnGUoZLRkOGe8Y0BivGI8YbxhPGC4YDRjs
F8sXqReHF2UXQhcfF/wW2ha3FpMWbxZKFiQW/hXXFbAVhxVeFTMVCRXgFLgUkBRoFEEUGhT1E88TqxOGE2MTQRMfE/0S3RK9Ep4S
fxJhEkMSJhIKEu4R0xG4EZ0RhBFsEVURPxEpERQRABHsENkQxxC2EKYQlhCHEHgQahBdEFAQQxA2ECkQHBAOEAAQ8A/hD9APwA+u
D5sPiA91D2MPUw9DDzMPIw8TDwMP8g7iDtIOwQ6xDp8Ojg58DmoOWA5HDjUOIw4SDgAO7w3eDc0NvA2tDZ0Njg1/DXENYw1VDUgN
PA0wDSUNGg0QDQYN/AzzDOoM4QzZDNEMyQzADLgMrwymDJ0MlAyMDIMMeQxwDGYMWwxRDEYMOwwwDCUMGgwPDAUM+gvwC+YL3QvT
C8oLwQu3C60LowuYC4wLfwtyC2QLVQtGCzYLJAsRC/4K6grXCsMKrgqZCoMKbQpWCj4KJgoNCvQJ2Qm/CaUJiglwCVUJOwkgCQYJ
7AjRCLcInQiCCGgITggzCBkI/wflB8wHsweaB4EHaAdQBzcHHwcGB+0G1Qa8BqQGiwZzBloGQgYpBhAG+AXfBcUFrAWSBXgFXQVC
BSYFCwXvBNMEtwSbBH4EYQREBCYECATqA8wDrQOOA28DUAMxAxED8QLRArICkgJxAlECMAIPAu4BzAGrAYkBZwFEASEB/gDbALgA
lABxAE4AKgAHAOP/v/+b/3f/U/8u/wr/5f7A/pr+df5Q/ir+Bf7f/bj9kv1r/UT9Hv34/NH8q/yE/F38NvwP/Oj7wfub+3T7+BHT
Ea8RixFnEUMRIBH8ENgQtBCQEGwQSRAlEAIQ3w+8D5gPdQ9RDy0PCQ/lDsEOmw51Dk8OKQ4FDuANuw2WDXENTA0mDf8M2QyyDIsM
ZAw+DBgM8gvNC6cLggtcCzcLEQvsCscKogp9CloKNgoUCvIJ0QmxCZIJcwlTCTIJEgnyCNIIswiVCHcIWQg8CB8IAwjmB8oHrQeR
B3UHWQc+ByIHBwfsBtEGtwacBoEGZgZLBjAGFQb5Bd0FwQWlBYgFawVNBS8FEAXxBNEEsQSRBHEEUAQvBA4E7APKA6gDhQNiAz8D
HAP5AtYCswKQAm0CSgIoAgUC4wHBAaABfwFeAT4BHwEBAeMAxgCqAI8AdQBbAEIAKgARAPf/3P+//6H/g/9j/0P/Iv8B/+H+wf6h
/oL+ZP5G/in+Df7w/dT9tv2Y/Xn9Wf04/Rf99fzS/K/8jPxo/EX8Ifz++9r7t/uT+3D7S/sn+wH72/q1+o/6aPpA+hj67/nG+Zz5
cflF+Rr57/jE+Jr4cPhF+Bv48PfF95r3bvdC9xX35/a69o32X/Yy9gT21vWo9Xr1TPUd9e30vfSP9GL0N/QN9OXzvvOY83TzUvMx
8xHz8vLU8rjynfKD8mvyU/I88ibyEPL58ePxzvG58aTxj/F78WfxU/FA8S3xGvEI8fXw5PDS8MHwsPCg8JDwgfBy8GPwVfBI8Dvw
L/Aj8BjwDPAA8PXv6+/h79fvzu/F77zvtO+t76Xvn++Z75Pvj++L74jvhe+D74Lvge+B74Hvge+C74HvgO9973rvdu9w72rvYu9a
71DvRu867y7vIe8T7wPv9O7j7tHuv+6t7pnuhu5y7l3uSe4z7h7uCO7y7dvtxO2s7ZTtfO1k7UztNO0a7QHt6OzP7LbsnOyB7Gbs
S+wv7BTs+Ovb677roOuC62TrResl6wXr5OrB6p7qe+pX6jPqD+rr6cbpoul96VjpM+kO6ejowuia6HHoRuga6O7nw+ea53LnS+ck
5/3m1uaw5ormZOY/5hnm9eXR5a/ljOVr5UnlKeUI5ejkyOSq5IzkcuRb5EXkMOQb5Ajk9ePh487jueOj44zjdONb40HjJ+MN4/Ti
2+LE4q3il+KB4mziWOJF4jHiHuIK4vXh4eHN4bjhpOGP4XvhaOFU4UHhLuEa4Qfh9ODg4MzguOCj4I/geuBk4E7gOOAg4Ang8N/Y
377fpN+K32/fVN863yLfC9/13uHezt693q7eoN6U3onegN543nHebN5o3mPeX95Z3lPeTt5L3kjeR95H3kjeSd5M3lDeVN5a3mDe
Z95v3njegd6L3pbeot6u3rveyd7Y3ube9t4F3xTfI98y30DfTd9a32XfcN9634Tfjt+X36Hfqt+0377fyd/T393f6N/y3/vfBeAN
4BbgHuAl4CzgMuA44D/gRuBN4FXgXuBo4HLgfeCJ4JbgpOCy4MHg0eDh4PLgBeEY4SzhQOFW4Wzhg+Gc4bXhz+Hq4QXiIuJA4l7i
feKd4r3i3uIA4yPjRuNq44/jtePb4wPkK+RU5H3kpuTP5PnkJOVP5XrlpuXS5f/lK+ZX5oPmsObc5gjnNedi547nvOfp5xboROhy
6KDozuj86CvpWumJ6bjp5+kX6kjqeOqp6trqC+s9627roOvT6wXsOOxq7J3sz+wC7TXta+2h7djtD+5F7nruru7g7hPvRu9576vv
3e8P8EDwcvCj8NPwA/Ez8WPxkvHB8fDxH/JO8nzyq/LZ8gfzNvNk85PzwfPw8yD0T/R+9K703vQO9T/1cPWh9dP1BvY59mz2n/bT
9gj3PPdx96b32/cP+EP4ePit+OL4GPlN+YP5uPnt+SP6WPqO+sT6+fow+2b7nPvS+wj8Pvx0/Kr83/wV/Ur9f/2z/ej9Hf5R/oX+
uP7r/h7/Uf+E/7f/6v8dAFAAggC0AOYAFwFIAXkBqgHaAQkCOQJpApgCxwL1AiEDTQN4A6MDzQP1Ax0ERQRsBJIEuQTgBAYFLAVR
BXYFnAXCBecFDQYyBlcGewagBsQG6AYLBy8HUgd1B5gHuQfaB/kHGAg0CE8IaAiACJYIqQi8CMwI2wjoCPQI/ggHCQ8JFgkbCSAJ
IwkkCSUJJAkjCSAJHQkYCRMJDQkGCf8I+AjwCOkI4gjbCNYI0gjPCM4IzgjPCNEI1AjYCN0I4wjrCPMI/ggJCRUJIwkxCUEJUglj
CXcJjAmjCbkJ0AnoCQAKGAoyCk0KaAqECqAKvArYCvQKEQstC0kLZAt/C5oLtQvQC+sLBgwiDD4MWwx4DJUMsgzQDO4MDA0rDUoN
aA2HDaYNxg3lDQYOJg5HDmgOig6sDs4O8Q4VDzgPXA+AD6UPyw/xDxcQPhBlEI0QthDfEAoRNRFgEYwRuBHlERISPxJtEpsSyhL5
EikTWROIE7gT6RMZFEkUeRSqFNoUChU7FWwVnRXQFQIWNRZnFpgWyhb8Fi8XYheUF8gX/BcxGGUYmBjLGP8YMxloGZwZ0BkFGjoa
bxqlGtoaDxtCG3QbpBvUGwIcLhxYHIIcqhzSHPkcIB1EHWcdhx2nHcUd4x0AHhseNx5RHmsehR6dHrUezB7iHvceCx8eHzEfQh9S
H2EfcB9+H4wfmR+lH7Afux/GH9Af2R/iH+of8R/4H/8fBSAKIA8gEyAXIBsgHyAiICYgKiAvIDQgOSA/IEQgSiBQIFYgXSBjIGog
cCB3IH0ghCCKIJEgmCCeIKUgrCCzILogwSDIINAg2CDfIOgg8CD4IAEhCiETIRwhJiEwITshRiFRIVwhZyFyIX0hiCGTIZ4hqCGz
Ib4hyCHTId0h5yHwIfgh/yEEIggiCiILIgsiCSIFIgEi+yHzIesh4SHWIcohvSGvIaAhkCF/IW0hWSFFIS8hGCEAIecgziC1IJog
fyBjIEYgKSAKIOsfyx+qH4ofaB9FHyIf/x7cHrkelx50HlEeLR4JHuUdwh2eHXkdUh0qHQEd2hy2HJUcdRxVHDccGhz9G+Ibxxuu
G5UbfhtnG1EbOxsnGxUbBBv0GuUa2BrLGsAatRqsGqManBqWGpEajBqIGoUagxqCGoEaghqCGoQahhqIGowajxqUGpkanhqkGqsa
sxq7GsUazhrYGuEa6hr0Gv0aBxsRGxwbJhsxGz0bSRtVG2IbcBt+G4wbmxuqG7sbyxvcG+4bABwSHCQcNxxKHFwcbhx/HJEcohyy
HMMc1BzkHPMcAR0OHRwdKR01HUEdTR1ZHWQdbh14HYIdih2SHZkdnx2kHakdrB2uHbAdsB2wHa4drB2oHaQdnh2XHY8dhx19HXId
Zx1bHU4dQB0yHSIdEh0CHfAc3hzLHLgcpByPHHkcYxxNHDYcHhwGHO0b1Bu7G6EbhxttG1MbOBseGwMb6BrMGrEalRp5GlwaQBoj
GgYa6BnKGawZjRlvGVAZMRkRGfIY0hiyGJIYcRhQGC8YDRjsF8oXqBeGF2MXQRceF/sW2Ra2FpQWchZPFi0WChbnFcUVohV/FV0V
OhUXFfQU0RStFIoUZxRDFB4U+hPWE7ITjhNqE0YTIRP9EtgSsxKOEmkSRBIfEgEAAQAAAAAAAAAAAAAAAAABAAEAAAABAAIABAAD
AAEAAQAAAAAAAAABAAEAAQABAAEAAAAAAAAAAAAAAAAAAAAAAAUABgAFAAIAAQAAAAkAEQAXABcAFQARABkALQA8ACoAFgD5/+n/
6v/i/8D/jP9m/13/U/8d/9z+rv6r/qj+uP7J/tX+5P7m/tz+8f7m/tf+z/6W/rf+/f6g/2//y/9C/7X+IP9w/0v/Pv9B/0f/QP9X
/1H/lf/M/yYAdACxANoA6wDuAPwAAQH9APkA7QDRAJ4AZgBQAE0AZABxAHkAhgCiAMcA7gAMARoBHgEuAT8BSQFQAVMBXAFcAVoB
XAFaAVQBSgFaAU8BXQFHAUoBDwGnAPX/Tf8N//v+4v7Y/tb+8P5P/+X/mQC2ANwA/QDnANwA1gCtAIwABwCM/03/PP8+/0z/Xv93
/5n/xP/q/wAACAAIAAYABAACAPf/1/+p/4H/hf+h/6X/jf98/4j/rP/S/+H/3f/b/+r/+f////X/3v/G/7f/sP+l/4//dv9y/4D/
lf+k/6z/tP/L/+n//P8EAAUAAwACAAEAAAD1/9T/tv+t/77/x//D/7b/v//X/+v/9P/8//X/7f/r//r//P/t/8T/sv+L/3//cf9L
/zP/Kf8p/yf/Kf8p/yP/I/8U/xb/Ef8T/wb/Cv8O/zT/l/5h/5b/Xv88/zz+9P6L//v+Ov9C/1H/hv94/5T/gv92/43/Zf9W/2v/
dv9S/1D/Sf9J/z//Sv88/1b/Z/9p/3n/nP/c/xkAeACxAAABAAEIARIBFgEKARwBHQEeASEBFAEeAREBHQERASIBFQElARABIQEn
ARYBHgEcAREBGAEXAQwBGwH9AA8BBAH9AAIBAwEBAQgB7QDzAMIAogB5AEcAIQALAP3/8P/j/+T/7//4//3//P/4//v//P/+/w4A
FQAKAAQA///9//D/4P/M/7T/nf+R/4j/cv9S/zv/Mv8l/wr/6/7Z/tf+4/7n/un+5v7T/t/+Dv83/2D/dv87/+r+W/+X/rn+/P7r
/sz+xP66/r7++/6+/lX8O/8W/+L+8f5L/9v/dQDVAPwAGQEkARIBwgAoAGz/GP/7/uz+7P71/hH/OP96/8D/7P/3/wEACAAoACQA
FQDd/7P/s//D/8b/tv+r/7L/zv/t//7/BAAVADoAXQBwAG0AawB7AKAAwQC/AI8AUgAtACEAFQAJANT/ff9F/yr/J/8s/+X+wf7Y
/tz+6f7f/tr+6v74/hn/Tf+pA0oAlf+L/7D+0v5T/3f+5v4y/xH/Bv8Y/x7/GP8Y/x7/Mf8q/y//Of9+/0v/G/87/17/pP+8//r/
RQBkAJYA1ADQAOMA6QDUAMYAfgBLAD0ALgASAPD/3P/l//H/HABKAFgAYwBoAHgAkQCmAK4AlgBSABoA1f+1/6L/dP9C/yb/Jf9G
/1X/W/9Q/0j/S/9U/1n/Tf85/yz/Kv8n/xz/C//4/u3+7v7w/vH+8f7v/ur+5/7q/ur+6v7r/vL+8/74/vf+9f76/vv+//4A//7+
/P79/gL/CP8Q/w//FP8Y/xr/GP8h/zL/Q/9U/1//aP92/5D/tf/V/+D/2P/L/8f/1f/q//f/7f/P/7L/rv+//9D/z/+y/3z/UP9F
/07/Vv9J/yz/GP8a/zj/Yf98/37/cv9w/3f/fP90/17/Pv8r/yz/Mf82/zL/Hv8K/wb/Ef8p/0L/T/9T/1P/Uv9e/2v/eP+D/47/
ov+9/9P/4P/y//z/AwAcAEUAXABYAEgATABtAJsAyQDkAN8AyQC1AMwA+gAXARIB/QDmAOMA8wAAAfUA2AC0AJgAkwCWAIUAXwBA
AEMAYgCKAKEAoQCYAKIAxgD4AB4BIgEZAQEB/wAGAQgB+ADhAMAAsQC2ALoAqACHAHMAfQCfAL4AxQC2AKcAsQDOAOsA7QDdAMEA
tQC5ANQA7gDrANoAzgDNANsA4wDlAN8A2QDXAN8A5gDpANwAvACUAHcAagBOACsAFAAbADAAOwA4AC8ALQA6AFkAcQBvAFkARwBI
AFQAXgBUAD4ATACLANgAFAEuAUoBXQFrAXUBdQFsAWwBeQGTAdgBIAH2AKIBdgEzAY4BVQEuATMBJwEZAQoB+wDVAKoAhgBbACEA
2P9e/wf/4P7W/tH+1v7h/uP+2P7O/sf+xf7A/rn+lf5//or+sf7S/uH+8P7t/ur+7P7t/uT+4P4o/y//A//u/hH/Jv8x/0H/x/8g
ACYALgBaAI4AqwCmAIAASgAfAAsA/f/8//T/2v++/7b/z//p//n/5v/N/8n/2v/u//L/2P+r/4j/iP+k/8T/xv+r/4n/d/+J/6n/
uv+l/4P/Zf9a/1z/YP9R/y//Df/7/vf++/74/ur+1/7Q/tD+2v7s/gT/Ev8a/yr/Sf9s/4z/pP+z/8L/4f/0/wIABQAEAP3/9//4
//r//f///wAA/////////f/7//z//v/+//7/9//y//X/+v/9//z/9P/t/+//9f/8/wAAAQAAAAAAAQAAAAAA/f/q/9X/zP/N/8T/
sv+Q/3X/cv+N/3//hv96/2P/Yv9Z/0n/IP8b/xb/F/8W/wv/IP8s/yv/K/83/z3/N/8Z/yL/FP8L/x3/Jf8l/y//MP85/zX/Mv8w
/y7/Mf8r/zf/Sf9O/3n/qP+i/9j/+f8dADkATAA2AC8AKgAdACQACAACAAAAAAD5/97/yf/D/8n/2f/p//X/+f/3//j//v///wAA
AAAAAAAAAgAUACMAJgAjACUANwBRAFsARgAkAAsAAQAGAAIA+v/I/6f/qf/M/+z/6P/E/53/i/+D/3L/Lf/p/sP+s/6u/qf+mv6Y
/pb+kP6T/p3+nP6t/rv+wf69/r3+v/7D/r/+uv66/sP+wf67/rj+yv7X/tP+7v63/vX+Gf/7/v/+6/7b/mD/B/9d/wH/PP9f/7L/
AAAfAB8AGQBCAIAApwCSAF8AJQAZADYATwBJADQAIwAmAEgAdACnAJIAigCTAKgAtwDGALsAqwC9ANEA6QDtAPIA7QDyANAA2wDE
AM8AwwDSAMkAwwDHAMYAyADBANAAwgDKAMkAyQDHAMoAxwDJAMYAyADHAMoAtQCfAHwAUwAnAP3/8//3//X/6v/p/+7/+v8AABAA
MQBFAGEAdACGAIwAngCWAKIAhgCIAF0AOAAgAN3/rf93/1H/JP8r/x7/L/8a/x//G/8V/zH/K/9R/zv/Tv9U/07/V/9h/1j/Vv82
/yr/Ef8Y/0//N/8H/xX/Hf/2/vz+HP8D/wf/y/7v/gD/9v7k/v/++f7t/g3/Cv8g/xn/Mv9N/1P/Vv9Z/2T/aP9x/3X/d/90/3b/
hf+Y/6b/qv+3/8n/5//7/wQABgAFAAQACwAQAAkABQACAAAAAAAAAAAAAAAAAAAAAQDt/9f/2v/r//r/AQD7/+f/3v/s//b///8C
AAIA//8AAAAAAQAJAA4ACQAFAAEAAQAKABgAIgAdABIABgAJABcAIgAgABQACAAJAAsACwAHAAIAAAAAAAAAAAAAAAEAAAABAP//
/P/3/+7/6P/p//D/+P/u/9v/0v8XABcAFgAWABYAFgAUABQAFAAUABMAEwATABIAEgARACwAEAARABAAEAAPABAADwAPAA8ADgAO
AA4ADQANAA4ADQANAA0ADAANAAwADAAMAAsACwALAAoACwAKAAoACgAJAAkAcP8A/wP/Bf/I/rn+bP51/nf+2v7w/h7/K/8o/yL/
Rf8W/x7/Gf9R/0f/pP+W/4T/xf/O/5f/wf/N//f/vv/V/y4AHAAtACcALAA1AB0AQAAlAFMAcQBwAGYAYwBaAFUATwBNAEoASQBM
AFEAWQBgAFoAWQCDAHIAaABnAGcAYQBZAFEATQBJAEcAQwBAADoANwA2ADgAOgAoACkAJwAoAEkAJQAnADEAJgAyADEAOwA/ADIA
KgA+AEAAPAA4AD4ASQBOAEAAFwAgAC4AHwAmAC0AKQBEAFAAOwAyADQAKwBFADgAOQA5ADgAOAA3ADcANQA1ADMAMwAtABcADwAe
AB0AHgAeABwAHAAbABwAHAAcABsAGgAaABkAGAAZABcAFwAWABYAFQAUABMAEwATABMAEwATABMAEwASABIAEgASACoAEAAQAA4A
1/+2/mr+uf50/nb+ff7P/sT+jP6h/tr+ov64/r3+Bf/N/uD+4f44/x3/bf83/zj/af+U/8//1P/V/9X/0//O/8//0f/f//T/9//x
/+3/5//0/8n/zP/w/+n/4f/4/ykAGQAjAEcAPgBPAGgAXQB1AHUAXQB1AFsANgBSAHEAUwA6ADUAPwAnAEUALgBNAGwAcABvAHUA
dgBxAGEAaADk//P/5v/u/+P/9v/e//b/7//g/wAA4v8MAOH/AwDg/wwA5P/9//P/5f8MAO3/6f8MAPX/+v8VAPz/KgAKAAQAIgAJ
AA8AFwAFADYAFQBUAGsAcABxAHAAcABwAHAAcgBvAG4AbQBuAGgAagBkAGUAYABeAFwAXABIAGQAVwBXAFUAUwBRAFAATwBMAEkA
SABDAEAAPgA7ADIALAAuADgAOgA2ADMALgArADAAtv9a/6n/uP+t/+D/FgAsADAANQArACUAHAAbAO7/+P+i/wkAKgAtAD0APwBF
AEUANgAwADEAMAAxADcARAA5ACsAKwAwADMAMwA1ADgAOwA7ADsAOAA5ADgANgA2ADMAMwAxAC8ALwAvAC0ANAArACoAKgApACkA
KAAoACUAJgAjACMACQAgAB8AGwAgACIAIgAiACIAGQAV/wv/FP8H/9r+zv4o/wv/LP84/y//Y/84/xn/F/8l/zv/rP1Y/5D/vf99
/8z/1//Z//D/AQANABoAJwArABoADwALACAABwAdACMAUQADABAAMwAwACoAWABTAP//JgAMADUAGQBYABkAMAAaAE4AawBwAGAA
cQBjAHMAWwBcAFsAUwBzAFcAUwBSAFEAUABJAEkAUABOAEwAXwBbAFYAUQBIACwAYgBTAFAATQBMAEsATQBLADcAMwAwADAALwAv
ACwAJwAlACUAJwAnACYAJAAjACIANAAzADMAMwAyADIAPQA5AC8ALwAgAB4AHgAcABwAHAAdAB0AHgAeAB0AHgAfAB0AHgAfACUA
MQAxADAAMQAwADEALwAwAC4ALQAtAC0ALAArACoAKQAoACgAJwAnACYAJAAiAB4AHAAgACAAHgAPACEAFgAaAB0AHAAcABwAGwAa
ABkAGQAYABYAEwAUABYAFQAVABMADwAPAAMABQAGAAcABwAGAAgABwAJAAgACAAJAAkACgAKAAoACgAZABkAFwASAAYABwAHAAcA
BgAEAAIA//////3/BAABAP3/+P/7/wEAEQAQAA4ADAANABEAEwAUABMAEgATABQAFAATABIAEQABAAEAAgABAP//+v/2//f/+//0
//3//v/3//L/AAACABEAEQAQABIAEwATABEADwAOAAwADwAPAA8ADAAJAAkA/v///wAA8P/+//z//P///wAA//8AAP7///8AAAAA
AAAAAP////8AAAIAAQAEAAQABQAFAAUABAAEAAUABAAFAAUABAADAAIAAwAEAAQABAAEAIX/8v68/nT+bP6T/sr+uv7t/uH+Hf8x
/xH/Mv9t/6b/yf+s//j/3P+R/wYAGQDw//X/AQAIAAwADgASABgAHwAgACUAKgAtAC4AKAAgABkAHgAcAB8AHQAfACIAIwAnAC0A
KAAuACYAJAAjACoALQAyAEsAMwAyADIAMAAuADQAGwA5ACAALAAtAC0AKwA2AEMAKgBKAEUASwBGAD4APgBDAEUARABDAEAAPwBL
AEYAOQA6ADkAOQA3ADYANgA1ADUANAAzADMAMAAvACwALwAtAC4AKwArACkAKQAqACkAJwAmACQAIgAjACIAIQAdABgAFgAXABkA
GQAXABIAEAARAB4ABgAIAAoACgAKAA0ADgAPAA8AEAAQABAADwAQAA8ADwAPAA8ADwAOAA4ADgAOAA0ADQANAAwADQANAAwADAAM
AAwADAALAAsACwALAAsACgAKAAoACgAKAAoAbf8B/wP/A/+l/rr+b/52/nr+ef6M/or+zf44/zr/v/4f/+v+0P5k//f+Dv8g/0f/
TP9M/0z/nv9d/1D/Sv9R/1L/Vv9Q/1T/Zv92/9T/tf++/8r/z//W/97/+v/2/wIA+//+/xkAFwAiADoANgBdAHcAdQBwAIQAhgCH
AGoAgACHAIwAjAA8AHQAgQCDAIcAhQCCAHwAfQB9AHoAeABzAJgAewBvAHAAbwBtAGwAawBoAGYAYgBiAGAAXgBcAEgAbQBXAFYA
WABVAFYAUgBSAFAATgBMAEoASwBHAEYARQAwAEoAHADr/+T/2P/R/9D/zP+M/5//rP+o/7//yv/K/8P/x//F/87/3f/8/xAAHQAj
ACAAIQAmAB8AJQAlACEAIgAjACwAAwBSABAAAQARACkAJwAiAAwAQQBIAEEATABKAE0ASgBJAEgARQBBADoAXgBBAEIAQQBAAD4A
ov8i/yX/If/l/rn+Vv/S/tj+/f4a/zf/X/8j/w7/Ff8k/0r/Sf9R/5z/Tv9B/0f/Rf9C/0P/Rf85/yX/a/9B/1n/Vf9m/2b/cP+I
/7L/u/+9/8v/0v/f/+j/6//1/wcAKABQAGQAbQBqAGwAcQB5AHsAfwB9AHsAfwCDAHYAbwBsAFUAVgBTAEMAVQBDAG4AUwB6AIQA
cwBbAHsAdgBqACgANQAcAEMAHAAqAC8AHABKACkAYgA1AFIAbgBuAG0AcQBsAHwAaABcADoAx/+9/7n/s//C/7H/wv/l/ycAJgAi
AP//EwAaABQABAAlABcADwA6AB8ANwAoAEMAZwBoAGgAaABpAGgAaABkAGMAYQBhAGAAbQByAGgAgwB4AG4AawBqAGYAZwBmAGEA
YABeAF0AWgA4AGsAVgBUAFQAUgBSAFAATgBNAEsASwBIAEcARQBDAEIAQQA/ADMASQA6ADoAOQA4ADgANwA2ADUANAA0ADMAMgAx
ADAAMAAuAC4ALQAsACsAKwApACkAKQAnACcAJgAmACUAJAAkACMAIwAsACAAHwAfAB4AHgAdAB0AHQAcABwAHAAbABoAZGRkZGRk
ZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGQoKCgoJxEAAAAAAAAAAAAAAAAAAw8TFhoeISIkJicn
KGNjY2NjZGRkZGRkZGRjZGNkZGRkZGRkZGNkZGRkZGRkZGNkZGRkZGRkZGRkZGRkZGRkZGRkZGRkY2RkZGRkZGRkZGRkZGRkZGRk
ZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRjZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRjMgAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAECAwQDAgUIESEhIB8hKDQWODlCRUtQVFheX2FjYmNjY2NjY2NjY2BdXFxcXl5gYGBfX19fMzAuSVtVTC9HTU1N
TU9QUFJXWl1eX2JjY2NjY2RkZGNkZGRjZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGQo
KCgoKEZbZGRkZGRkZGRkZGRkY2RkZGRjZGRkY2RkZGNjY2RkZGRkZGRjZGRkZGNkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRk
KCgoKBwAAAAAAAAAAAAAAAAAAAIEBQ0ZJjA5PUNKUFRYWl1hYmJiYmJiY2NiY2NjY2RkZGRkZGRkZGRkZGRkZGRkZGRkZGRkY2Nk
Y2NjY2NkZGRkZGRjZGRkZGRkZGRkZGRkZGRkZGRkZGNjY2NkY2NjZGRkY2RkY2NkZGRkZGRkZGRkZGRkZGRkZGRjZGRkZGRkZGRk
ZGRkZGRkZGRkZGRkZGRkZGRkZGRkY2NjZGRkZGRjZGRjZGRkZGRkY2RkZGRjZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGNk
ZGRkZGRkZGRkZGRkZGRkZGRjZGRkZGRkZGRjY2RkY2RkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRk
ZGRkZGRjZGRkZCgoHgAAAAAAAAAAAAAHGCcqGTU7Ojw/QEFDRUZGR0lKSkxOUVNUVVZYWVtdXmBgYWJiZGNjY2NjZGRkZGRkZGRk
ZGRjY2RjZGRkZGRkZGRkZGRkZGRkZGRkZGRkY2NkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkY2Rk
ZGRjZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGQoKCgoHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEE
CxETFyQ3REVHSU1QVFZXWV1fX2FjY2RkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRjZGRkZGRkZGNkZGRkZGRkZGRkZGRjZGQo
KCgoKCYgFg8ODigtMTExMTVCUFxiYmJjY2RkZGRkZGRkY2NjY2NjZGRkZGRkZGRkZGRkZGRkZGRkZGQoKCgnIQMAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBQ0VHicuOEFITU9VWFxeYmJiYmNjY2NjY2NjY2NjY2NkZGRjY2NjY2NjY2NjZGRkZGRk
ZGRjY2RkZGRkZEMoJyckIyMjNT1HVFlbYGNjZGRkZGRkZGRkZGNkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRk
ZGRjZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkY2RkZGQAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADc8PDxPZGRkZGRkZGRkZGRkZFMqHRwbGwAQEBAQEBAQAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1WZGRkZGRkZGRiYmJkZGRgW1haVU5DNygTAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIRERESAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8PDw9XmRkZGRkZGRk
YmBeWEY1FRAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALTxG
YGJkZGRkZGFaU0c1CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAADg8PD1YZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGJZU1JPT01FMx8KAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOBAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg8PD5PXGNkZGRkZGRkZGRkZGRkZGRkZGRkZGRk
YVxaVVBLQC8UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAP
DxAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcHBwcHBwcHBwcHBwcHBwcICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgHBwcHBgYGBgYFBQUFBQUEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE
BAUFBQUFBQUFBQUFBQUFBQUFBQUFBQUGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBwcHBwcHBwcHBwcHBwcHBwcHBwcH
BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcICAgICAgIBwcHBwYGBgYFBQUFBAQEBAQDAwMDAwMDAwMDAwMDAwMDAwMDAwMD
AgICAgICAgICAgICAgICAgIDAwMDAwMDAwMDAwMDAwMDAwMDBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE
BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAUFBQUFBQUFBQUFBQUFBQUFBQUGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYG
BgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBgYGBgYGBQUFBQUFBAQEBAQEBAQE
BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAUFBQUFBQUFBQUFBQUFBQUGBgYGBgYGBgYGBgYGBgYGBgYG
BgYGBgYGBgYGBgYGBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAcHBwcHBgYGBgYG
BgYGBgUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgcHBwcH
BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgHBwcHBgYGBgUFBQUFBQQEBAQEBAQEAwMDAwMDAwMDAwICAgICAgICAgICAgICAgICAgICAgICAgICAgIC
AwMDAwMDAwMDAwMDAwMEBAQEBAQEBAQEBAQEBAQFBQUFBQUFBQUFBQUFBQUFBQYGBgYGBgYGBgYGBgYFBQUFBQUFBQUFBQUFBQUF
BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBgYGBgYGBgYGBgYFBQUFBQUEBAQEBAQEBAQDAwMDAwMDAwMCAgICAgICAgICAgIC
AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMEBAQEBAQEBAQEBAQEBAQEBAQE
BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBQUFBQUFBQUFBQUFBQYGBgYGBgYGBgYGBgYGBgYGBgYHBwcHBwcHBwcHBwcHBwcHBwcH
BwcHBwcHBwcHBwcHBwcHBwgICAgICAgICAgICAgI`;

motorsportTelemetry("scichart-root");
