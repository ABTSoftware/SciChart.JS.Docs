import { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries, SciChartJsNavyTheme, CursorModifier, TextAnnotation, EHorizontalAnchorPoint, ECoordinateMode, EllipsePointMarker, adjustTooltipPosition } from "scichart";
async function cursorDataTemplates(divElementId) {
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        titleStyle: { fontSize: 16 }
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region_A_start
    const tooltipSvgTemplate = (seriesInfos, svgAnnotation) => {
        const width = 120;
        const height = 120;
        const seriesInfo = seriesInfos[0];
        if (!seriesInfo?.isWithinDataBounds) {
            return "<svg></svg>";
        }
        let seriesName;
        let xValue;
        let yValue;
        let index;
        let yValueFromDS;
        seriesInfos.forEach(si => {
            // If hit (within hitTestRadius of point)
            if (si.isHit) {
                // SeriesInfo.seriesName comes from dataSeries.dataSeriesName
                seriesName = si.seriesName;
                // seriesInfo.xValue, yValue
                xValue = si.xValue.toFixed(2);
                yValue = si.yValue.toFixed(2);
                // index to the dataseries is available
                index = si.dataSeriesIndex;
                // Which can be used to get anything from the dataseries
                yValueFromDS = si.renderableSeries.dataSeries.getNativeYValues().get(si.dataSeriesIndex).toFixed(4);
            }
        });
        if (!seriesName) {
            return "<svg></svg>";
        }
        const x = seriesInfo ? seriesInfo.formattedXValue : "";
        const y = seriesInfo ? seriesInfo.formattedYValue : "";
        // this calculates and sets svgAnnotation.xCoordShift and svgAnnotation.yCoordShift. Do not set x1 or y1 at this point.
        adjustTooltipPosition(width, height, svgAnnotation);
        return `
            <svg width="${width}" height="${height}">
                <rect x="0" y="0" rx="${seriesName === "Sinewave 1" ? "10" : "100"}" ry="${seriesName === "Sinewave 1" ? "10" : "100"}" width="${width}" height="${height}" fill="${seriesName === "Sinewave 1" ? "#FF6600" : "#50C7E0"}"/>
                <text y="35" font-family="Verdana" font-size="12" fill="white">
                    <tspan x="50%" text-anchor="middle" font-size="14">${seriesName}</tspan>
                    <tspan x="50%" text-anchor="middle" dy="2.4em">x: ${xValue}</tspan>
                    <tspan x="50%" text-anchor="middle" dy="1.2em">y: ${yValue}</tspan>
                    <tspan x="50%" text-anchor="middle" dy="1.2em">index: ${index}</tspan>
                </text>
            </svg>`;
    };
    // Add a CursorModifier to the chart
    const cursorModifier = new CursorModifier({
        showTooltip: true,
        showAxisLabels: true,
        hitTestRadius: 10,
        tooltipSvgTemplate
    });
    sciChartSurface.chartModifiers.add(cursorModifier);
    // #region_A_end
    const xValues = [];
    const yValues = [];
    const yValues2 = [];
    for (let i = 0; i < 50; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.25) - Math.cos(i * 0.02));
        yValues2.push(0.5 * Math.cos(i * 0.18) - Math.sin(i * 0.025));
    }
    const pointMarker = new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "white", strokeThickness: 0 });
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: "#FF6600",
        strokeThickness: 5,
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            dataSeriesName: "Sinewave 1"
        }),
        pointMarker
    }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: "#50C7E0",
        strokeThickness: 5,
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues2,
            dataSeriesName: "Sinewave 2"
        }),
        pointMarker
    }));
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
        text: "CursorModifier Custom DataTemplates",
        fontSize: 36,
        yCoordShift: 25,
        ...options
    }));
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "Move the mouse over the chart to see cursor & tooltip",
        fontSize: 20,
        yCoordShift: 75,
        ...options
    }));
    // sciChartSurface.chartModifiers.add(new LegendModifier());
}
cursorDataTemplates("scichart-root");
