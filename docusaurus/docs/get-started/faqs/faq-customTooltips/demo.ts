import { 
    SciChartSurface,
    NumericAxis,
    XyDataSeries,
    StackedColumnRenderableSeries,
    RolloverModifier,
    SeriesInfo,
    RolloverTooltipSvgAnnotation,
    TRolloverTooltipSvgTemplate,
    NumberRange,
    StackedColumnCollection,
    SciChartJsNavyTheme
} from "scichart";

// #region_A_start
// assuming fontSize = 13px
const calcTooltipWidth = (textLength = 20) => { return textLength * 8 + 20 }; // 8 is the average character width for fontSize 13px
const calcTooltipHeight = (lines = 1) => { return 17 * lines + 14 }; // 17 is the line height

const customTooltipTemplate: TRolloverTooltipSvgTemplate = (
    id: string,
    seriesInfo: SeriesInfo,
    rolloverTooltip: RolloverTooltipSvgAnnotation
) => {
    const valuesWithLabels = [
        `${seriesInfo.seriesName}: ${seriesInfo.formattedYValue}`,
        // add multiple strings for multi-line tooltips
    ]

    const width = calcTooltipWidth(valuesWithLabels.reduce((prev, cur) => (cur.length > prev ? cur.length : prev), 0));
    const height = calcTooltipHeight(valuesWithLabels.length);

    rolloverTooltip.updateSize(width, height);

    let valuesBlock = "";
    valuesWithLabels.forEach((val) => {
        valuesBlock += `<tspan x="8" dy="1.2em">${val}</tspan>`;
    });

    const svgFillMarker = `<rect x="6" y="calc(20% + 1px)" width="6" height="50%" fill="${seriesInfo.renderableSeries.stroke}" />`

    // Tooltip #1
    const shadowedTooltip = `<svg class="scichart__rollover-tooltip" width="${width}" height="${height}">
        <defs>
            <filter id="shadow">
                <feDropShadow dx="3" dy="2" stdDeviation="2" flood-opacity="0.3"/>
            </filter>
        </defs>
        <rect rx="4" ry="4" width="90%" height="90%" fill="${"#FFFFFF"}" stroke-width="1" stroke="#00000000" filter="url(#shadow)" />
        <svg width="100%" height="100%">
            <text x="8" y="3" font-size="13" font-family="Verdana" dy="0" fill="#000000">${valuesBlock}</text>
        </svg>
    </svg>`;

    // Tooltip #2
    const boxyTooltip = `<svg class="scichart__rollover-tooltip" width="${width}" height="${height}">
        <rect y="1" x="1" width="90%" height="90%" fill="${"#FFFFFF"}" stroke-width="1" stroke="#CCCCCC" />
        ${svgFillMarker}
        <svg width="100%" height="100%" x="8" y="1">
            <text x="8" y="3" font-size="13" font-family="Verdana" fill="#000000">${valuesBlock}</text>
        </svg>
    </svg>`;

    // - Choose which one fits best
    // return shadowedTooltip;
    return boxyTooltip;
};

async function drawExample(rootElement) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme()
    }); 

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.2, 0.2),
        drawMinorGridLines: false,
        drawMajorBands: false,
        drawMajorGridLines: false,
    }));

    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0, 0.2),
        drawMinorGridLines: false,
        drawMajorBands: false,
        majorGridLineStyle: {
            strokeDashArray: [5, 5]
        }
    }));

    // Series 1
    const blueSeries = new StackedColumnRenderableSeries(wasmContext, {
        stroke: "rgba(59,130,246,1)",
        fill: "rgba(59,130,246,0.6)",
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: `Blue Series`,
            xValues: Array.from({ length: 8 }, (_, i) => i + 1),
            yValues: Array.from({ length: 8 }, () => Math.random() * 50 + 10),
        })
    })
    blueSeries.rolloverModifierProps.markerColor = "#CCCCCC"
    blueSeries.rolloverModifierProps.tooltipTemplate = (
        id: string, 
        seriesInfo: SeriesInfo,
        rolloverTooltip: RolloverTooltipSvgAnnotation
    ) => {
        return customTooltipTemplate(id, seriesInfo, rolloverTooltip);
    }

    // Series 2
    const mintSeries = new StackedColumnRenderableSeries(wasmContext, {
        stroke: "rgba(52,211,153,1)",
        fill: "rgba(52,211,153,0.6)",
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: `Mint Series`,
            xValues: Array.from({ length: 8 }, (_, i) => i + 1),
            yValues: Array.from({ length: 8 }, () => Math.random() * 50 + 30),
        })
    })
    mintSeries.rolloverModifierProps.markerColor = "#CCCCCC"
    mintSeries.rolloverModifierProps.tooltipTemplate = (
        id: string, 
        seriesInfo: SeriesInfo,
        rolloverTooltip: RolloverTooltipSvgAnnotation
    ) => {
        return customTooltipTemplate(id, seriesInfo, rolloverTooltip);
    }
    
    // add both series in a collection
    const collection = new StackedColumnCollection(wasmContext);
    collection.add(blueSeries, mintSeries);
    sciChartSurface.renderableSeries.add(collection);

    sciChartSurface.chartModifiers.add(
        new RolloverModifier({
            rolloverLineStroke: "#CCCCCC",
        })
    );
}
// #region_A_end
drawExample("scichart-root");