import { PolarColumnRenderableSeries, PolarNumericAxis, SciChartPolarSurface, EPolarAxisMode, NumberRange, EAxisAlignment, EPolarLabelMode, PolarDataPointSelectionModifier, EColumnMode, XyxDataSeries, EMultiLineAlignment, EColumnDataLabelPosition, EDataPointWidthMode, GenericAnimation, easing, DoubleAnimator, EFillPaletteMode, EStrokePaletteMode, parseColorToUIntArgb, SciChartJsNavyTheme, } from "scichart";
import { sunburstData } from "./data";
export class SunburstMetadata {
    static create(title, start, end, level, id, backgroundColor) {
        const md = new SunburstMetadata();
        md.title = title;
        md.start = start;
        md.end = end;
        md.colorArgb = parseColorToUIntArgb(backgroundColor);
        md.colorArgbWithOpacity = parseColorToUIntArgb(backgroundColor, 180);
        md.level = level;
        md.id = id;
        return md;
    }
    id;
    isSelected = false;
    title;
    start;
    end;
    colorArgb;
    colorArgbWithOpacity;
    level;
    get value() {
        return this.end - this.start;
    }
    constructor() { }
}
class SunburstPaletteProvider {
    strokePaletteMode = EStrokePaletteMode.SOLID;
    fillPaletteMode = EFillPaletteMode.SOLID;
    onAttached(parentSeries) { }
    onDetached() { }
    overrideFillArgb(xValue, yValue, index, opacity, metadata) {
        if (metadata.isSelected) {
            return metadata.colorArgbWithOpacity;
        }
        else {
            return metadata.colorArgb;
        }
    }
    overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
        return undefined;
    }
}
const getDataByLevelInternal = (curId, curLevel, curElement, startX, res) => {
    if (!res[curLevel]) {
        res.push([]);
    }
    res[curLevel].push({
        id: [...curId],
        start: startX,
        end: startX + curElement.value,
        name: curElement.name,
        backgroundColor: curElement.backgroundColor
    });
    let startChild = startX;
    for (let i = 0; i < curElement?.children?.length; i++) {
        const childElement = curElement?.children[i];
        getDataByLevelInternal([...curId, i], curLevel + 1, childElement, startChild, res);
        startChild += childElement.value;
    }
    return res;
};
const getElementById = (id) => {
    let el = {
        name: "root",
        value: -1,
        backgroundColor: "#000000",
        children: [sunburstData]
    };
    for (let i = 0; i < id.length; i++) {
        const levelIndex = id[i];
        el = el.children[levelIndex];
        if (!el)
            return undefined;
    }
    return el;
};
const getDataById = (id) => {
    const element = getElementById(id);
    if (!element) {
        return [];
    }
    const levelDataListList = getDataByLevelInternal(id, 0, element, 0, []);
    const res = [];
    for (let i = 0; i < levelDataListList.length; i++) {
        const levelDataList = levelDataListList[i];
        const xValues = [];
        const x1Values = [];
        const yValues = [];
        const metadata = [];
        levelDataList.forEach(v => {
            xValues.push(v.start);
            x1Values.push(v.end);
            yValues.push(i + 1);
            metadata.push(SunburstMetadata.create(v.name, v.start, v.end, i, v.id, v.backgroundColor));
        });
        res.push({
            data: [xValues, yValues, x1Values],
            metadata
        });
    }
    return res;
};
const drawSeriesFn = (wasmContext, xAxis, yAxis, sciChartSurface, polarLabelMode, dataPointSelectionModifier, nodeId, selectedElStartX, prevNodeId) => {
    const startAngleDefault = -Math.PI / 2;
    const clearSeriesFn = () => {
        dataPointSelectionModifier.selectionChanged.unsubscribeAll();
        sciChartSurface.renderableSeries.asArray().forEach(rs => rs.delete());
        sciChartSurface.renderableSeries.clear();
    };
    const level = nodeId.length - 1;
    const prevLevel = prevNodeId.length - 1;
    const prevXVisRangeDiff = xAxis.visibleRange.diff;
    const polarColumnMode = EColumnMode.StartEnd;
    const dataPointWidth = 0.5;
    const paletteProvider = new SunburstPaletteProvider();
    const createDataFn = (input$) => {
        const [xValues$, yValues$, x1Values$] = input$.data;
        return new XyxDataSeries(wasmContext, {
            xValues: xValues$,
            yValues: yValues$,
            x1Values: x1Values$,
            metadata: input$.metadata
        });
    };
    const levelData = getDataById(nodeId);
    const rootNode = getElementById(nodeId);
    const redrawSeriesFn = () => {
        clearSeriesFn();
        for (let i = 0; i < levelData.length; i++) {
            const rs$ = new PolarColumnRenderableSeries(wasmContext, {
                dataSeries: createDataFn(levelData[i]),
                stroke: "black",
                columnXMode: polarColumnMode,
                dataLabels: {
                    style: {
                        fontSize: 16,
                        multiLineAlignment: EMultiLineAlignment.Center,
                        lineSpacing: 8
                    },
                    color: "black",
                    precision: 2,
                    pointGapThreshold: 0,
                    skipNumber: 0,
                    polarLabelMode,
                    labelYPositionMode: EColumnDataLabelPosition.Position,
                    labelYPositionMultiplier: 0.5,
                    metaDataSelector: metadata => {
                        const md = metadata;
                        return `${md.title} \n ${md.value}`;
                    }
                },
                strokeThickness: 2,
                dataPointWidth,
                dataPointWidthMode: EDataPointWidthMode.Range,
                defaultY1: i,
                paletteProvider: paletteProvider
            });
            dataPointSelectionModifier.includeSeries(rs$, true);
            sciChartSurface.renderableSeries.add(rs$);
        }
    };
    const drillDownAnimationFn = (isReverse$, onCompleteFn$ = () => undefined) => {
        const xMin$ = 0; // always zero
        const xMax0$ = prevXVisRangeDiff;
        const xMax1$ = rootNode.value;
        const startAngle0$ = isReverse$
            ? startAngleDefault
            : startAngleDefault + (2 * Math.PI * selectedElStartX) / xAxis.visibleRange.diff;
        let startAngle1$;
        if (isReverse$) {
            const levelDiff$ = prevLevel - level;
            const element$ = levelData[levelDiff$].metadata.find(a => a.id.toString() === prevNodeId.toString());
            startAngle1$ = startAngleDefault + (2 * Math.PI * element$.start) / rootNode.value;
        }
        else {
            startAngle1$ = startAngleDefault;
        }
        const yMin0$ = isReverse$ ? 0 : prevLevel - level;
        const yMin1$ = isReverse$ ? level - prevLevel : 0;
        const from$ = { x1: xMax0$, x2: startAngle0$, y1: yMin0$, y2: 0 };
        const to$ = { x1: xMax1$, x2: startAngle1$, y1: yMin1$, y2: 0 };
        const sweepAnimation = new GenericAnimation({
            from: from$,
            to: to$,
            duration: 2000,
            ease: easing.inOutSine,
            onAnimate: (from, to, progress) => {
                const xMaxCur = DoubleAnimator.interpolate(from.x1, to.x1, progress);
                const startAngleCur = DoubleAnimator.interpolate(from.x2, to.x2, progress);
                const yMinCur = DoubleAnimator.interpolate(from.y1, to.y1, progress);
                const yMaxCur = yMinCur + 4;
                xAxis.visibleRange = new NumberRange(xMin$, xMaxCur);
                xAxis.startAngle = startAngleCur;
                yAxis.visibleRange = new NumberRange(yMinCur, yMaxCur);
            },
            onCompleted: () => {
                onCompleteFn$();
            }
        });
        sciChartSurface.addAnimation(sweepAnimation);
    };
    const subscribeFn = () => {
        dataPointSelectionModifier.selectionChanged.subscribe(args => {
            const selectedDataPoint = args.selectedDataPoints[0];
            if (selectedDataPoint) {
                const { yValue } = selectedDataPoint;
                const md = selectedDataPoint?.metadata;
                const { id } = md;
                const newId = [...id];
                if (yValue === 1 && id.length > 1) {
                    newId.pop();
                }
                drawSeriesFn(wasmContext, xAxis, yAxis, sciChartSurface, polarLabelMode, dataPointSelectionModifier, newId, md.start, nodeId);
            }
        });
    };
    if (level < prevLevel) {
        drillDownAnimationFn(true, () => {
            redrawSeriesFn();
            xAxis.startAngle = startAngleDefault;
            yAxis.visibleRange = new NumberRange(0, 4);
            subscribeFn();
        });
    }
    else if (level > prevLevel) {
        redrawSeriesFn();
        drillDownAnimationFn(false);
        subscribeFn();
    }
    else {
        xAxis.startAngle = startAngleDefault;
        xAxis.visibleRange = new NumberRange(0, rootNode.value);
        yAxis.visibleRange = new NumberRange(0, 4);
        redrawSeriesFn();
        subscribeFn();
    }
};
export const drawExample = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme()
    });
    const startAngle = -Math.PI / 2;
    const totalAngle = 2 * Math.PI;
    const xAxis = new PolarNumericAxis(wasmContext, {
        isVisible: false,
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 65),
        startAngle,
        totalAngle
    });
    xAxis.polarLabelMode = EPolarLabelMode.Parallel;
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new PolarNumericAxis(wasmContext, {
        isVisible: false,
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 6),
        flippedCoordinates: false,
        startAngle,
        totalAngle,
    });
    sciChartSurface.yAxes.add(yAxis);
    const dataPointSelectionModifier = new PolarDataPointSelectionModifier({
        allowClickSelect: true,
        allowDragSelect: true,
        selectionStroke: "red",
        selectionFill: "#ff879f33"
    });
    drawSeriesFn(wasmContext, xAxis, yAxis, sciChartSurface, EPolarLabelMode.Parallel, dataPointSelectionModifier, [0], 0, [0]);
    sciChartSurface.chartModifiers.add(dataPointSelectionModifier);
    return { sciChartSurface, wasmContext };
};
drawExample("scichart-root");
