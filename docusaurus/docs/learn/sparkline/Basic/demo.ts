import * as SciChart from "scichart";

// Example data: 40 simulated sensor channels in a plant, each with a normal operating range.
// The readings come from a seeded random generator, so the chart starts the same every time.
// These are illustrative numbers, not real measurements.
function createRandom(seed) {
    // mulberry32: a small, fast seeded random number generator
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const random = createRandom(2006);

function getChannels() {
    const kinds = [
        { prefix: "Temp", unit: "°C", low: 60, high: 75, step: 0.9, precision: 1 },
        { prefix: "Pressure", unit: "bar", low: 4, high: 5.5, step: 0.09, precision: 2 },
        { prefix: "Flow", unit: "L/min", low: 110, high: 140, step: 1.8, precision: 0 },
        { prefix: "Vibration", unit: "mm/s", low: 1.5, high: 4.5, step: 0.2, precision: 1 }
    ];
    const channels = [];
    for (let i = 0; i < 40; i++) {
        const kind = kinds[i % kinds.length];
        const number = String(Math.floor(i / kinds.length) + 1).padStart(2, "0");
        const mid = (kind.low + kind.high) / 2;
        channels.push({ ...kind, name: `${kind.prefix} ${number}`, value: mid, offset: 0 });
    }
    return channels;
}

// The next reading for a channel: a random walk that is pulled back towards a target.
// Now and then the target moves outside the normal range, so some channels drift out of it.
function nextReading(channel) {
    const mid = (channel.low + channel.high) / 2;
    if (random() < 0.004) channel.offset = (random() - 0.5) * 1.6 * (channel.high - channel.low);
    if (random() < 0.006) channel.offset = 0;
    const noise = Math.sqrt(-2 * Math.log(random() + 1e-9)) * Math.cos(2 * Math.PI * random());
    channel.value += 0.02 * (mid + channel.offset - channel.value) + channel.step * noise;
    channel.value = Math.max(channel.value, 0); // none of these readings can be negative
    return channel.value;
}

async function sparklineTable(divElementId) {
    // #region_A_start
    // Create a table of live JavaScript sparklines with SciChart.js: one chart, one WebGL context, 40 sub-charts
    const {
        SciChartSurface,
        SciChartSubSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        BoxAnnotation,
        NativeTextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        EAutoRange,
        NumberRange,
        Rect,
        Thickness,
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const POINTS = 300; // readings shown in each sparkline
    const ROWS = 20; // rows per column
    const HEADER = 0.06; // height of the header row, as a fraction of the chart

    // One parent chart holds the whole table. Its axes are hidden: it only positions the text.
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        padding: Thickness.fromNumber(0)
    });
    // Two side-by-side columns of rows (40 sparklines), or one column (20) on a narrow screen
    const COLUMNS = sciChartSurface.domChartRoot.clientWidth < 640 ? 1 : 2;
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false }));

    // Text drawn by the chart itself, positioned as a fraction (0 to 1) of its width and height
    const addText = (text, x, y, color, anchor, fontSize = 14) => {
        const annotation = new NativeTextAnnotation({
            text,
            x1: x,
            y1: y,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: anchor,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            textColor: color,
            fontSize
        });
        sciChartSurface.annotations.add(annotation);
        return annotation;
    };

    const columnWidth = 1 / COLUMNS;
    const rowHeight = (1 - HEADER) / ROWS;
    const channels = getChannels().slice(0, COLUMNS * ROWS);
    const rows = [];

    for (let column = 0; column < COLUMNS; column++) {
        const left = column * columnWidth;
        addText("Channel", left + 0.015, HEADER / 2, "#8FA3BF", EHorizontalAnchorPoint.Left, 13);
        addText(`Last ${POINTS} readings`, left + 0.46 * columnWidth, HEADER / 2, "#8FA3BF", EHorizontalAnchorPoint.Center, 13);
        addText("Now", left + 0.86 * columnWidth, HEADER / 2, "#8FA3BF", EHorizontalAnchorPoint.Right, 13);
    }

    channels.forEach((channel, index) => {
        const column = Math.floor(index / ROWS);
        const row = index % ROWS;
        const left = column * columnWidth;
        const top = HEADER + row * rowHeight;
        const middle = top + rowHeight / 2;

        // A faint stripe on every other row makes the table easier to follow across
        if (row % 2 === 0) {
            sciChartSurface.annotations.add(
                new BoxAnnotation({
                    x1: left,
                    x2: left + columnWidth,
                    y1: top,
                    y2: top + rowHeight,
                    xCoordinateMode: ECoordinateMode.Relative,
                    yCoordinateMode: ECoordinateMode.Relative,
                    fill: "#FFFFFF0A",
                    strokeThickness: 0
                })
            );
        }

        // The sparkline cell: a sub-chart that shares the parent's WebGL context
        const cell = SciChartSubSurface.createSubSurface(sciChartSurface, {
            position: new Rect(left + 0.22 * columnWidth, top, 0.48 * columnWidth, rowHeight),
            padding: new Thickness(4, 4, 4, 4),
            isTransparent: true
        });

        // Hidden axes: a sparkline has no ticks, labels or gridlines
        cell.xAxes.add(new NumericAxis(wasmContext, { isVisible: false, autoRange: EAutoRange.Always }));
        const yAxis = new NumericAxis(wasmContext, { isVisible: false, autoRange: EAutoRange.Never });
        cell.yAxes.add(yAxis);

        // The normal range: a grey band, so readings above or below it stand out
        cell.annotations.add(
            new BoxAnnotation({
                x1: 0,
                x2: 1,
                xCoordinateMode: ECoordinateMode.Relative,
                y1: channel.low,
                y2: channel.high,
                fill: "#FFFFFF1F",
                strokeThickness: 0
            })
        );

        // Fill the line with its first readings, oldest on the left
        const xValues = [];
        const yValues = [];
        for (let i = 0; i < POINTS; i++) {
            xValues.push(i);
            yValues.push(nextReading(channel));
        }
        const lineData = new XyDataSeries(wasmContext, { fifoCapacity: POINTS, xValues, yValues });
        const extremesData = new XyDataSeries(wasmContext); // lowest and highest reading
        const lastData = new XyDataSeries(wasmContext); // the latest reading

        cell.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: lineData,
                stroke: "#C8D3E0",
                strokeThickness: 1.5
            }),
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: extremesData,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 6, height: 6, fill: "#50C7E0", strokeThickness: 0 })
            }),
            new XyScatterRenderableSeries(wasmContext, {
                dataSeries: lastData,
                pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "#EF5350", strokeThickness: 0 })
            })
        );

        rows.push({
            channel,
            xValues,
            yValues,
            lineData,
            extremesData,
            lastData,
            yAxis,
            name: addText(channel.name, left + 0.015, middle, "#FFFFFF", EHorizontalAnchorPoint.Left),
            value: addText("", left + 0.86 * columnWidth, middle, "#FFFFFF", EHorizontalAnchorPoint.Right),
            flag: addText("", left + 0.88 * columnWidth, middle, "#FFB74D", EHorizontalAnchorPoint.Left, 12)
        });
    });

    // Redraw the markers, the value, the flag and the vertical scale of one row
    const updateRow = (row) => {
        const { channel, xValues, yValues } = row;
        let minIndex = 0;
        let maxIndex = 0;
        for (let i = 1; i < yValues.length; i++) {
            if (yValues[i] < yValues[minIndex]) minIndex = i;
            if (yValues[i] > yValues[maxIndex]) maxIndex = i;
        }
        const last = yValues.length - 1;
        row.extremesData.clear();
        row.extremesData.appendRange([xValues[minIndex], xValues[maxIndex]], [yValues[minIndex], yValues[maxIndex]]);
        row.lastData.clear();
        row.lastData.append(xValues[last], yValues[last]);

        // Each row has its own vertical scale, always wide enough to show the whole normal range
        const bottom = Math.min(yValues[minIndex], channel.low);
        const top = Math.max(yValues[maxIndex], channel.high);
        const margin = (top - bottom) * 0.12;
        row.yAxis.visibleRange = new NumberRange(bottom - margin, top + margin);

        // The number beside the line, flagged when it's outside the normal range
        const shown = yValues[last].toFixed(channel.precision);
        const outside = Number(shown) > channel.high ? "HIGH" : Number(shown) < channel.low ? "LOW" : "";
        row.value.text = `${shown} ${channel.unit}`;
        row.value.textColor = outside ? "#FFB74D" : "#FFFFFF";
        row.flag.text = outside;
    };
    rows.forEach(updateRow);

    // Live updates: every 50 ms each channel gets a new reading and the oldest one drops off
    let x = POINTS;
    const timer = setInterval(() => {
        if (sciChartSurface.isDeleted) {
            clearInterval(timer);
            return;
        }
        rows.forEach((row) => {
            const y = nextReading(row.channel);
            row.lineData.append(x, y);
            row.xValues.push(x);
            row.yValues.push(y);
            row.xValues.shift();
            row.yValues.shift();
            updateRow(row);
        });
        x++;
    }, 50);

    return { sciChartSurface };
    // #region_A_end
}

sparklineTable("scichart-root");
