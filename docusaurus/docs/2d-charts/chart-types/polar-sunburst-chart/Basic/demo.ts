import {
    PolarColumnRenderableSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    NumberRange, 
    EPolarLabelMode,
    PolarCursorModifier,
    TCursorTooltipDataTemplate,
    SeriesInfo,
    PolarDataPointSelectionModifier,
    TSciChart,
    EColumnMode,
    XyxDataSeries,
    EMultiLineAlignment,
    EColumnDataLabelPosition,
    EDataPointWidthMode,
    GenericAnimation,
    easing,
    DoubleAnimator,
    IRenderableSeries, 
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider,
    IPointMetadata, 
    parseColorToUIntArgb,
    SciChartJsNavyTheme,
    EPolarAxisMode,
    EAxisAlignment
} from "scichart";

class SunburstMetadata implements IPointMetadata {
    public static create(title: string, start: number, end: number, level: number, id: number[], colorHtml: string) {
        const md = new SunburstMetadata();
        md.title = title;
        md.start = start;
        md.end = end;
        md.colorArgb = parseColorToUIntArgb(colorHtml);
        md.colorArgbWithOpacity = parseColorToUIntArgb(colorHtml, 180);
        md.level = level;
        md.id = id;
        return md;
    }

    public id: number[];
    public isSelected: boolean = false;
    public title: string;
    public start: number;
    public end: number;
    public colorArgb: number;
    public colorArgbWithOpacity: number;
    public level: number;

    public get value(): number {
        return this.end - this.start;
    }

    private constructor() {}
}

export class SunburstPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;

    public onAttached(parentSeries: IRenderableSeries): void {}

    public onDetached(): void {}

    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity: number,
        metadata: SunburstMetadata
    ): number {
        if (metadata.isSelected) {
            return metadata.colorArgbWithOpacity;
        } else {
            return metadata.colorArgb;
        }
    }

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity: number,
        metadata: SunburstMetadata
    ): number {
        return undefined;
    }
}

type TElement = {
    name: string;
    value: number;
    colorHtml: string;
    children: TElement[];
};

export const sunburstData: TElement = {
    name: "Eve",
    value: 65,
    colorHtml: "pink",
    children: [
        {
            name: "Cain",
            value: 14,
            colorHtml: "red",
            children: []
        },
        {
            name: "Seth",
            value: 14,
            colorHtml: "skyblue",
            children: [
                {
                    name: "Enos",
                    value: 10,
                    children: [],
                    colorHtml: "lightblue"
                },
                {
                    name: "Noam",
                    value: 4,
                    children: [],
                    colorHtml: "blue"
                }
            ]
        },
        {
            name: "Abel",
            value: 6,
            colorHtml: "teal"   ,
            children: []
        },
        {
            name: "Awan",
            value: 6,
            colorHtml: "orange" ,
            children: [
                {
                    name: "Enoch",
                    value: 4,
                    colorHtml: "orange",
                    children: [
                        {
                            name: "Michael",
                            value: 3,
                            colorHtml: "lightorange",
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            name: "Azura",
            value: 8,
            colorHtml: "mutedpurple",
            children: []
        }
    ]
};

type TLevelDataEntry = {
    id: number[];
    start: number;
    end: number;
    name: string;
    colorHtml: string;
};

export type TLevelDataForChart = {
    data: number[][];
    metadata: SunburstMetadata[];
};

const getDataByLevelInternal = (
    curId: number[],
    curLevel: number,
    curElement: TElement,
    startX: number,
    res: TLevelDataEntry[][]
): TLevelDataEntry[][] => {
    if (!res[curLevel]) {
        res.push([]);
    }
    res[curLevel].push({
        id: [...curId],
        start: startX,
        end: startX + curElement.value,
        name: curElement.name,
        colorHtml: curElement.colorHtml
    });
    let startChild = startX;
    for (let i = 0; i < curElement.children.length; i++) {
        const childElement = curElement.children[i];
        getDataByLevelInternal([...curId, i], curLevel + 1, childElement, startChild, res);
        startChild += childElement.value;
    }
    return res;
};

export const getElementById = (id: number[]): TElement | undefined => {
    let el: TElement = {
        name: "root",
        value: -1,
        colorHtml: "#000000",
        children: [sunburstData]
    };
    for (let i = 0; i < id.length; i++) {
        const levelIndex = id[i];
        el = el.children[levelIndex];
        if (!el) return undefined;
    }
    return el;
};

export const getDataById = (id: number[]): TLevelDataForChart[] => {
    const element = getElementById(id);
    if (!element) {
        return [];
    }
    const levelDataListList = getDataByLevelInternal(id, 0, element, 0, []);
    const res: TLevelDataForChart[] = [];
    for (let i = 0; i < levelDataListList.length; i++) {
        const levelDataList = levelDataListList[i];
        const xValues: number[] = [];
        const x1Values: number[] = [];
        const yValues: number[] = [];
        const metadata: SunburstMetadata[] = [];
        levelDataList.forEach(v => {
            xValues.push(v.start);
            x1Values.push(v.end);
            yValues.push(i + 1);
            metadata.push(SunburstMetadata.create(v.name, v.start, v.end, i, v.id, v.colorHtml));
        });
        res.push({
            data: [xValues, yValues, x1Values],
            metadata
        });
    }

    return res;
};


const drawSeriesFn = (
    wasmContext: TSciChart,
    xAxis: PolarNumericAxis,
    yAxis: PolarNumericAxis,
    sciChartSurface: SciChartPolarSurface,
    polarLabelMode: EPolarLabelMode,
    dataPointSelectionModifier: PolarDataPointSelectionModifier,
    nodeId: number[],
    selectedElStartX: number,
    prevNodeId: number[]
) => {
    const startAngleDefault = - Math.PI / 2;

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

    const createDataFn = (input$: TLevelDataForChart) => {
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
                        const md = metadata as SunburstMetadata;
                        return `${md.title} \n ${md.value}`;
                    }
                },
                dataSeries: createDataFn(levelData[i]),
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

    const drillDownAnimationFn = (isReverse$: boolean, onCompleteFn$: () => void = () => undefined) => {
        const xMin$ = 0; // always zero
        const xMax0$ = prevXVisRangeDiff;
        const xMax1$ = rootNode.value;

        const startAngle0$ = isReverse$
            ? startAngleDefault
            : startAngleDefault + (2 * Math.PI * selectedElStartX) / xAxis.visibleRange.diff;
        let startAngle1$: number;
        if (isReverse$) {
            const levelDiff$ = prevLevel - level;
            const element$ = levelData[levelDiff$].metadata.find(a => a.id.toString() === prevNodeId.toString());
            startAngle1$ = startAngleDefault + (2 * Math.PI * element$.start) / rootNode.value;
        } else {
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
                const md = selectedDataPoint?.metadata as SunburstMetadata;
                const { id } = md;
                const newId = [...id];
                if (yValue === 1 && id.length > 1) {
                    newId.pop();
                }
                drawSeriesFn(
                    wasmContext,
                    xAxis,
                    yAxis,
                    sciChartSurface,
                    polarLabelMode,
                    dataPointSelectionModifier,
                    newId,
                    md.start,
                    nodeId
                );
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
    } else if (level > prevLevel) {
        redrawSeriesFn();
        drillDownAnimationFn(false);
        subscribeFn();
    } else {
        xAxis.startAngle = startAngleDefault;
        xAxis.visibleRange = new NumberRange(0, rootNode.value);
        yAxis.visibleRange = new NumberRange(0, 4);
        redrawSeriesFn();
        subscribeFn();
    }
};

export async function polarSunburstChart(divElementId) {
    // #region_A_start
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
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

    drawSeriesFn(
        wasmContext, 
        xAxis, 
        yAxis, 
        sciChartSurface, 
        EPolarLabelMode.Parallel, 
        dataPointSelectionModifier, 
        [0], 
        0, 
        [0]
    );

    const tooltipDataTemplate: TCursorTooltipDataTemplate = (seriesInfos: SeriesInfo[], tooltipTitle: string) => {
        const res: string[] = [];
        seriesInfos.forEach(si => {
            if (si.isHit) {
                const md = si.pointMetadata as SunburstMetadata;
                res.push(`Name: ${md.title}`);
                res.push(`Value: ${md.value}`);
            }
        });
        return res;
    };

    sciChartSurface.chartModifiers.add(
        dataPointSelectionModifier,
        new PolarCursorModifier({
            showTooltip: true,
            showCircularLine: false,
            showRadialLine: false,
            tooltipDataTemplate,
        })
    );

    return { sciChartSurface, wasmContext };
}

polarSunburstChart("scichart-root");