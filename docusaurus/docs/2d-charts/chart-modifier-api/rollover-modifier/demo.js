import { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries, SciChartJsNavyTheme, TextAnnotation, EHorizontalAnchorPoint, ECoordinateMode, EllipsePointMarker, RolloverModifier } from "scichart";
async function cursorDataTemplates(divElementId) {
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        titleStyle: { fontSize: 16 }
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    const xValues = [];
    const yValues = [];
    const yValues2 = [];
    for (let i = 0; i < 50; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.25) - Math.cos(i * 0.02));
        yValues2.push(0.5 * Math.cos(i * 0.18) - Math.sin(i * 0.025));
    }
    const pointMarker = new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "white", strokeThickness: 0 });
    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: "#FF6600",
        strokeThickness: 5,
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            dataSeriesName: "Sinewave 1"
        }),
        pointMarker
    });
    const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
        stroke: "#50C7E0",
        strokeThickness: 5,
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues2,
            dataSeriesName: "Sinewave 2"
        }),
        pointMarker
    });
    sciChartSurface.renderableSeries.add(lineSeries1);
    sciChartSurface.renderableSeries.add(lineSeries2);
    // Add some instructions to the user
    const options = {
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 0.0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White"
    };
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "Custom Rollover Modifier",
        fontSize: 36,
        yCoordShift: 25,
        ...options
    }));
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "Move the mouse over the chart",
        fontSize: 20,
        yCoordShift: 75,
        ...options
    }));
    // #region_A_start
    const customTooltipTemplate = (id, // : string
    seriesInfo, // : SeriesInfo,
    rolloverTooltip // : RolloverTooltipSvgAnnotation
    ) => {
        const width = 120;
        const height = 120;
        rolloverTooltip.updateSize(width, height);
        return `
        <svg width="${width}" height="${height}">
            <circle cx="50%" cy="50%" r="50%" fill="${seriesInfo.stroke}"/>
            <text y="40" font-size="13" font-family="Verdana" dy="0" fill="${"white"}">
                <tspan x="15" dy="1.2em">${seriesInfo.seriesName}</tspan>
                <tspan x="15" dy="1.2em">x: ${seriesInfo.formattedXValue} y: ${seriesInfo.formattedYValue}</tspan>
            </text>
        </svg>`;
    };
    lineSeries1.rolloverModifierProps.tooltipTemplate = (id, // : string
    seriesInfo, // : SeriesInfo
    rolloverTooltip // : RolloverTooltipSvgAnnotation
    ) => {
        return customTooltipTemplate(id, seriesInfo, rolloverTooltip);
    };
    lineSeries2.rolloverModifierProps.tooltipTemplate = (id, // : string
    seriesInfo, // : SeriesInfo
    rolloverTooltip // : RolloverTooltipSvgAnnotation
    ) => {
        return customTooltipTemplate(id, seriesInfo, rolloverTooltip);
    };
    // Add a CursorModifier to the chart
    const rolloverModifier = new RolloverModifier({});
    sciChartSurface.chartModifiers.add(rolloverModifier);
    // #region_A_end
}
cursorDataTemplates("scichart-root");
