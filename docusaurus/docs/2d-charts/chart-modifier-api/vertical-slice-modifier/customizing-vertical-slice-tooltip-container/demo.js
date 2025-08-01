import {
    LegendModifier,
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    CursorModifier,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
    EllipsePointMarker,
    adjustTooltipPosition,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    VerticalSliceModifier
} from "scichart";

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
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Custom Vertical Slice Modifier",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Move the chart or move the green line",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );

    // #region_A_start

    const customTooltipTemplate = (
        id, // : string
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

    lineSeries1.rolloverModifierProps.tooltipTemplate = (
        id, // : string
        seriesInfo, // : SeriesInfo
        rolloverTooltip // : RolloverTooltipSvgAnnotation
    ) => {
        return customTooltipTemplate(id, seriesInfo, rolloverTooltip);
    };

    lineSeries2.rolloverModifierProps.tooltipTemplate = (
        id, // : string
        seriesInfo, // : SeriesInfo
        rolloverTooltip // : RolloverTooltipSvgAnnotation
    ) => {
        return customTooltipTemplate(id, seriesInfo, rolloverTooltip);
    };

    const getTooltipLegendTemplate = (seriesInfos, svgAnnotation) => {
        let outputSvgString = "";

        // Foreach series there will be a seriesInfo supplied by SciChart. This contains info about the series under the house
        seriesInfos.forEach((seriesInfo, index) => {
            if (seriesInfo.isWithinDataBounds) {
                const lineHeight = 30;
                const y = 50 + index * lineHeight;
                // Use the series stroke for legend text colour
                const textColor = seriesInfo.stroke;
                // Use the seriesInfo formattedX/YValue for text on the
                outputSvgString += `<text x="8" y="${y}" font-size="16" font-family="Verdana" fill="${textColor}">
                                    ${seriesInfo.seriesName}: X=${seriesInfo.formattedXValue}, Y=${seriesInfo.formattedYValue}
                                </text>`;
            }
        });

        // Content here is returned for the custom legend placed in top-left of the chart
        return `<svg width="100%" height="100%">
                <text x="8" y="20" font-size="15" font-family="Verdana" fill="lightblue">Custom Rollover Legend</text>
                ${outputSvgString}
            </svg>`;
    };

    const vSlice1 = new VerticalSliceModifier({
        x1: 5.06,
        xCoordinateMode: ECoordinateMode.DataValue,
        isDraggable: true,
        // Defines if rollover vertical line is shown
        showRolloverLine: true,
        rolloverLineStrokeThickness: 1,
        rolloverLineStroke: "green",
        lineSelectionColor: "green",
        // Shows the default tooltip
        showTooltip: true,
        // Optional: Overrides the legend template to display additional info top-left of the chart
        tooltipLegendTemplate: getTooltipLegendTemplate
    });

    const vSlice2 = new VerticalSliceModifier({
        x1: 0.75,
        xCoordinateMode: ECoordinateMode.Relative,
        isDraggable: true,
        // Defines if rollover vertical line is shown
        showRolloverLine: true,
        rolloverLineStrokeThickness: 1,
        rolloverLineStroke: "orange",
        lineSelectionColor: "orange",
        // Shows the default tooltip
        showTooltip: true
    });

    sciChartSurface.chartModifiers.add(vSlice1, vSlice2);
    // #region_A_end

    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
}
cursorDataTemplates("scichart-root");
