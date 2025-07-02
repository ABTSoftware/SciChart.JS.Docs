import {
    NumberRange,
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    FastLineSegmentRenderableSeries,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    XyxyDataSeries,
    CursorModifier
} from "scichart";

// Tooltip Data Template
const tooltipDataTemplate = seriesInfos => {
    const valuesWithLabels = [];
    seriesInfos.forEach(si => {
        const xySI = si;
        if (xySI.isWithinDataBounds) {
            if (!isNaN(xySI.yValue) && xySI.isHit) {
                valuesWithLabels.push(
                    `start (${xySI.xValue},${xySI.yValue}) end (${xySI.point2xValue},${xySI.point2yValue})`
                );
            }
        }
    });
    return valuesWithLabels;
};

async function xyxyExample(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    // region_A_start
    const lineSegmentPoints = [
        [4, 3, 2, 1], // [x,y,x1,y1]
        [4, 4, 2, 6],
        [7, 6, 5, 4],
        [7, 1, 5, 3]
    ];

    const xValues = lineSegmentPoints.map(d => d[0]); // [4,4,7,7,]
    const yValues = lineSegmentPoints.map(d => d[1]); // [3,4,6,1]
    const x1Values = lineSegmentPoints.map(d => d[2]); // [2,2,5,5]
    const y1Values = lineSegmentPoints.map(d => d[3]); // [1,6,4,3]

    const lineSegmentSeries = new FastLineSegmentRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            x1Values,
            y1Values
        }),
        strokeThickness: 4,
        stroke: "cornflowerblue"
    });
    // region_A_end

    sciChartSurface.renderableSeries.add(lineSegmentSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true, tooltipDataTemplate }));
}
xyxyExample("scichart-root");
