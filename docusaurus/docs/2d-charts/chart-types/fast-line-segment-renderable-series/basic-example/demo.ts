import {
    NumberRange,
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    FastLineSegmentRenderableSeries,
    EStrokePaletteMode,
    parseColorToUIntArgb,
    EPaletteProviderType,
    XyDataSeries,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    CursorModifier,
    IStrokePaletteProvider,
    IRenderableSeries,
    TPaletteProviderDefinition
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

class LineSegmentPaletteProvider implements IStrokePaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.GRADIENT;
    private readonly palettedStart = parseColorToUIntArgb("red");
    private readonly palettedEnd = parseColorToUIntArgb("blue");

    // tslint:disable-next-line:no-empty
    public onAttached(parentSeries: IRenderableSeries): void {}

    // tslint:disable-next-line:no-empty
    public onDetached(): void {}

    public overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return index % 2 === 0 ? this.palettedStart : this.palettedEnd;
    }

    public toJSON(): TPaletteProviderDefinition {
        return { type: EPaletteProviderType.Custom, customType: "MyPaletteProvider" };
    }
}

async function basicLineSegment(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    // region_A_start
    const lineSegmentPoints = [
        [
            [4, 3], // line start, on chart represented as red
            [2, 1]  // line end, on chart represented as blue
        ],
        [
            [4, 4],
            [2, 6]
        ],
        [
            [7, 6],
            [5, 4]
        ],
        [
            [7, 1],
            [5, 3]
        ]
    ];

    const xValues = lineSegmentPoints.flat().map(d => d[0]); // [4, 2, 4, 2, 7, 5, 7, 5]
    const yValues = lineSegmentPoints.flat().map(d => d[1]); // [3, 1, 4, 6, 6, 4, 1, 3]

    const lineSegmentSeries = new FastLineSegmentRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues
        }),
        strokeThickness: 4,
        paletteProvider: new LineSegmentPaletteProvider()
    });
    // region_A_end

    sciChartSurface.renderableSeries.add(lineSegmentSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true, tooltipDataTemplate }));
}
basicLineSegment("scichart-root");
