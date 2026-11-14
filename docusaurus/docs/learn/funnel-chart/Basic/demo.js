import * as SciChart from "scichart";

// Example data: one month of a free-trial sign-up funnel, from first visit to paying customer.
// These are illustrative numbers, not real statistics.
function getSignupFunnelData() {
    return [
        { stage: "Visited site", count: 12000 },
        { stage: "Viewed pricing", count: 5400 },
        { stage: "Started trial", count: 1620 },
        { stage: "Activated", count: 1140 },
        { stage: "Paying customer", count: 456 }
    ];
}

async function funnelChart(divElementId) {
    // #region_A_start
    // Create a JavaScript funnel chart with SciChart.js: centred bars, tapered connectors and conversion labels
    const {
        SciChartSurface,
        NumericAxis,
        FastRectangleRenderableSeries,
        FastTriangleRenderableSeries,
        XyxyDataSeries,
        XyDataSeries,
        EColumnMode,
        EColumnYMode,
        ETriangleSeriesDrawMode,
        TextLabelProvider,
        TextAnnotation,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        EAxisAlignment,
        NumberRange,
        SciChartJsNavyTheme,
        CursorModifier,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // A reusable helper: turns a list of { stage, count } into the shapes and numbers a funnel needs.
    // Stage i sits at row i (y = i). Its bar is centred on zero and spans x = -count/2 to +count/2, so its width is its count.
    function buildFunnel(stages, barHalfHeight = 0.32) {
        const first = stages[0].count;
        const rows = stages.map((s, i) => ({
            ...s,
            row: i,
            ofStart: (s.count / first) * 100, // overall conversion: share of the first stage
            ofPrevious: i === 0 ? 100 : (s.count / stages[i - 1].count) * 100 // step conversion: share of the stage before
        }));
        // The weakest step: the lowest step-to-step conversion (skipping the first stage, which has no step)
        const weakest = rows.slice(1).reduce((low, r) => (r.ofPrevious < low.ofPrevious ? r : low)).row;

        const bars = {
            xValues: rows.map((r) => -r.count / 2),
            x1Values: rows.map((r) => r.count / 2),
            yValues: rows.map((r) => r.row - barHalfHeight),
            y1Values: rows.map((r) => r.row + barHalfHeight)
        };

        // One trapezoid (two triangles) between each pair of bars, tapering from one bar's width to the next
        const connector = (r) => {
            const top = r.row - 1 + barHalfHeight;
            const bottom = r.row - barHalfHeight;
            const a = rows[r.row - 1].count / 2;
            const b = r.count / 2;
            return {
                xValues: [-a, a, -b, a, -b, b],
                yValues: [top, top, bottom, top, bottom, bottom]
            };
        };
        const merge = (list) => ({
            xValues: list.flatMap((c) => c.xValues),
            yValues: list.flatMap((c) => c.yValues)
        });
        const steps = rows.slice(1);
        return {
            rows,
            weakest,
            bars,
            connectors: merge(steps.filter((r) => r.row !== weakest).map(connector)),
            weakestConnector: merge(steps.filter((r) => r.row === weakest).map(connector))
        };
    }

    const BAR = "#50C7E0"; // one colour for every stage
    const HIGHLIGHT = "#E8336D"; // colour means one thing: the step with the lowest conversion rate

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const funnel = buildFunnel(getSignupFunnelData());
    const { rows } = funnel;

    // Value axis (X): centred on zero and hidden, because a funnel's bars have no common baseline to read against.
    // Extra room on the right holds the value labels.
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            isVisible: false,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            growBy: new NumberRange(0.05, 0.75)
        })
    );

    // Stage axis (Y) on the left: one stage name per row, flipped so the first stage is at the top
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            flippedCoordinates: true,
            labelProvider: new TextLabelProvider({ labels: rows.map((r) => r.stage), useNativeText: false }),
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            labelStyle: { fontSize: 15 },
            growBy: new NumberRange(0.06, 0.12) // a little more room at the bottom, clear of the logo
        })
    );

    // The connectors: faint trapezoids that show the drop from one stage to the next
    const connectorSeries = (shape, fill, name) =>
        new FastTriangleRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { ...shape, dataSeriesName: name }),
            drawMode: ETriangleSeriesDrawMode.List, // every three points make one triangle
            fill
        });
    sciChartSurface.renderableSeries.add(
        connectorSeries(funnel.connectors, BAR + "33", "Drop"),
        connectorSeries(funnel.weakestConnector, HIGHLIGHT + "88", "Weakest step")
    );

    // The bars: one centred rectangle per stage, as wide as its count
    sciChartSurface.renderableSeries.add(
        new FastRectangleRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, { ...funnel.bars, dataSeriesName: "Stages" }),
            columnXMode: EColumnMode.StartEnd, // x and x1 are the bar's left and right ends (-count/2 and +count/2)
            columnYMode: EColumnYMode.TopBottom, // y and y1 are its top and bottom edges
            fill: BAR + "CC",
            stroke: BAR,
            strokeThickness: 2,
            topCornerRadius: 6,
            bottomCornerRadius: 6
        })
    );

    const number = (value) => value.toLocaleString("en-US");
    const percent = (value) => `${value.toFixed(1)}%`;

    // Labels: each stage's count and share of the start, to the right of its bar,
    // and each step's conversion rate in the gap between two bars
    rows.forEach((r) => {
        sciChartSurface.annotations.add(
            new TextAnnotation({
                x1: r.count / 2 + rows[0].count * 0.03,
                y1: r.row,
                text: r.row === 0 ? number(r.count) : `${number(r.count)}  (${percent(r.ofStart)} of visitors)`,
                fontSize: 17,
                textColor: "#FFFFFF",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                verticalAnchorPoint: EVerticalAnchorPoint.Center
            })
        );
        if (r.row > 0) {
            sciChartSurface.annotations.add(
                new TextAnnotation({
                    x1: 0,
                    y1: r.row - 0.5,
                    text: `${percent(r.ofPrevious)} continue`,
                    fontSize: 15,
                    textColor: r.row === funnel.weakest ? "#FF8FB1" : "#C8E9F2",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center
                })
            );
        }
    });

    // Hover over a bar for its numbers, zoom with the mouse wheel, pan by dragging, double-click to reset
    sciChartSurface.chartModifiers.add(
        new CursorModifier({
            showTooltip: true,
            showAxisLabels: false,
            showXLine: false,
            showYLine: false,
            tooltipDataTemplate: (seriesInfos) => {
                const info = seriesInfos.find((s) => s.seriesName === "Stages" && s.isHit); // isHit: the mouse is inside this bar
                if (!info) return [];
                const r = rows[info.dataSeriesIndex];
                const lines = [r.stage, `People: ${number(r.count)}`, `Of visitors: ${percent(r.ofStart)}`];
                if (r.row > 0) {
                    const lost = rows[r.row - 1].count - r.count;
                    lines.push(`From previous stage: ${percent(r.ofPrevious)}`, `Lost at this step: ${number(lost)}`);
                }
                return lines;
            }
        }),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier()
    );
    // #region_A_end
}

funnelChart("scichart-root");
