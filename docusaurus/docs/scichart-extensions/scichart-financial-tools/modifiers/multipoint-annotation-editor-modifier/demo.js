import * as SciChart from "scichart";
import * as SciChartFinancialTools from "scichart-financial-tools";
function createCandles(count) {
    const xValues = [];
    const openValues = [];
    const highValues = [];
    const lowValues = [];
    const closeValues = [];
    let close = 100;
    for (let i = 0; i < count; i++) {
        const open = close;
        const drift = Math.sin(i / 7) * 1.8 + Math.cos(i / 15) * 0.9;
        close = open + drift + Math.sin(i * 0.61) * 0.7;
        const high = Math.max(open, close) + 1.2 + Math.abs(Math.sin(i / 4));
        const low = Math.min(open, close) - 1.2 - Math.abs(Math.cos(i / 5));
        xValues.push(i);
        openValues.push(open);
        highValues.push(high);
        lowValues.push(low);
        closeValues.push(close);
    }
    return { xValues, openValues, highValues, lowValues, closeValues };
}
async function drawExample(divElementId) {
    // #region_A_start
    const { AnnotationHoverModifier, ECursorStyle, FastCandlestickRenderableSeries, MouseWheelZoomModifier, NumberRange, NumericAxis, OhlcDataSeries, SciChartSurface, ZoomExtentsModifier, ZoomPanModifier } = SciChart; // or import from "scichart"
    const { ChannelAnnotation, ETradingAnnotationType, ExtendedLineAnnotation, MultiPointAnnotationEditorModifier, SciTraderLightTheme } = SciChartFinancialTools; // if using npm, import from "scichart-financial-tools";
    const chartDivId = `${divElementId}-chart`;
    const editorDivId = `${divElementId}-editor`;
    const rootElement = document.getElementById(divElementId);
    rootElement.innerHTML = `
        <div style="display:flex;width:100%;height:100%;min-height:0;gap:12px;">
            <div id="${chartDivId}" style="flex:1 1 auto;min-width:0;height:100%;border-right:1px solid #ccc;"></div>
            <div id="${editorDivId}" style="flex:0 0 267px;height:100%;overflow:auto;"></div>
        </div>
    `;
    const channelEditorSchema = {
        fields: [
            { id: "stroke", label: "Stroke", type: "color", category: "Style" },
            { id: "fill", label: "Fill", type: "color", category: "Style" },
            { id: "strokeThickness", label: "Stroke width", type: "number", min: 1, max: 8, step: 1, category: "Style" },
            { id: "showMidLine", label: "Mid line", type: "boolean", category: "Channel" },
            { id: "showMidPointGrips", label: "Width grips", type: "boolean", category: "Channel" }
        ]
    };
    const definitionFromSchema = (annotationType, title, schema) => ({
        annotationType,
        title,
        fields: schema.fields.map(field => ({
            ...field,
            getValue: annotation => annotation[field.id],
            setValue: (annotation, value) => {
                annotation[field.id] = field.type === "number" ? Number(value) : value;
            },
            isVisible: annotation => field.id in annotation
        }))
    });
    const manualExtendedLineDefinition = {
        annotationType: ETradingAnnotationType.ExtendedLineAnnotation,
        title: "Trend Line Editor",
        fields: [
            {
                id: "stroke",
                label: "Stroke",
                type: "color",
                category: "Style",
                getValue: annotation => annotation.stroke,
                setValue: (annotation, value) => {
                    annotation.stroke = value;
                }
            },
            {
                id: "extendEnd",
                label: "Extend right",
                type: "boolean",
                category: "Line",
                getValue: annotation => annotation.extendEnd,
                setValue: (annotation, value) => {
                    annotation.extendEnd = !!value;
                }
            }
        ]
    };
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(chartDivId, {
        theme: new SciTraderLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(20, 95) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.12, 0.18) }));
    const candles = createCandles(120);
    const dataSeries = new OhlcDataSeries(wasmContext, {
        ...candles,
        dataSeriesName: "Price"
    });
    sciChartSurface.renderableSeries.add(new FastCandlestickRenderableSeries(wasmContext, {
        dataSeries,
        dataPointWidth: 0.72,
        strokeThickness: 1,
        brushUp: "#22C55E99",
        brushDown: "#EF444499",
        strokeUp: "#22C55E",
        strokeDown: "#EF4444"
    }));
    const channel = new ChannelAnnotation({
        isEditable: true,
        isSelected: true,
        stroke: "#A78BFA",
        fill: "#A78BFA33",
        strokeThickness: 2,
        showMidLine: true,
        showMidPointGrips: true,
        points: [
            { x: 34, y: candles.highValues[34] + 2 },
            { x: 74, y: candles.highValues[74] + 1 },
            { x: 34, y: candles.lowValues[34] - 5 }
        ]
    });
    const trendLine = new ExtendedLineAnnotation({
        isEditable: true,
        stroke: "#FACC15",
        strokeThickness: 2,
        extendStart: false,
        extendEnd: true,
        points: [
            { x: 52, y: candles.lowValues[52] - 1 },
            { x: 88, y: candles.highValues[88] + 2 }
        ]
    });
    sciChartSurface.annotations.add(channel, trendLine);
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier(), new ZoomExtentsModifier(), new AnnotationHoverModifier({ enableHover: true, enableCursor: true, idleCursor: ECursorStyle.Crosshair }), new MultiPointAnnotationEditorModifier({
        definitions: [
            definitionFromSchema(ETradingAnnotationType.ChannelAnnotation, "Channel Editor", channelEditorSchema),
            manualExtendedLineDefinition
        ],
        container: editorDivId,
        panelWidth: 260,
        panelOffsetX: 10,
        panelOffsetY: 0
    }));
    // #region_A_end
}
drawExample("scichart-root");
