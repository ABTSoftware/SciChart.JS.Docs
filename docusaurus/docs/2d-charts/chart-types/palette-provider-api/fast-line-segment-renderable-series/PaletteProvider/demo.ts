import * as SciChart from "scichart";
import { IStrokePaletteProvider , IRenderableSeries, TPaletteProviderDefinition } from "scichart"

// #region_A_start
const { DefaultPaletteProvider, EStrokePaletteMode, parseColorToUIntArgb, EPaletteProviderType } = SciChart;
// or, for npm, import { DefaultPaletteProvider, ... } from "scichart"

// Custom PaletteProvider for line segment series which colours datapoints differently on odd and even points (differently on both ends)
class LineSegmentPaletteProvider extends DefaultPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.GRADIENT;
    private readonly palettedStart = parseColorToUIntArgb("orange");
    private readonly palettedEnd = parseColorToUIntArgb("cyan");

    // tslint:disable-next-line:no-empty
    public onAttached(parentSeries: IRenderableSeries): void {}

    // tslint:disable-next-line:no-empty
    public onDetached(): void {}

    public overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return index % 2 === 0 ? this.palettedStart : this.palettedEnd;
    }
}
// #region_A_end

export async function lineSegmentPaletteProvider(divElementId) {
    const { 
        SciChartSurface, 
        NumericAxis, 
        SciChartJsNavyTheme,
        XyDataSeries,
        FastLineSegmentRenderableSeries,
        NumberRange
    } = SciChart;

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    const xAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1)
    });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1)
    });
    sciChartSurface.yAxes.add(yAxis);

    // #region_B_start
    function generateVectorFieldSegments(gridSize = 30) {
        const xValues = [];
        const yValues = [];

        const spacing = 10 / (gridSize - 1); // spacing between grid points
        const scale = 0.6; // scale for vector length

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = i * spacing;
                const y = j * spacing;

                // Vector field direction (can modify here)
                const angle = Math.sin(x) + Math.cos(y);
                const dx = Math.cos(angle) * scale;
                const dy = Math.sin(angle) * scale;

                const x1 = x;
                const y1 = y;
                const x2 = x + dx;
                const y2 = y + dy;

                // Ensure segments stay in [0, 10]
                if (x2 < 0 || x2 > 10 || y2 < 0 || y2 > 10) continue;

                xValues.push(x1, x2);
                yValues.push(y1, y2);
            }
        }

        return { xValues, yValues };
    }
    const { xValues, yValues } = generateVectorFieldSegments(30);
    
    const lineSegment1 = new FastLineSegmentRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: xValues,
            yValues: yValues,
        }),
        strokeThickness: 3,
        paletteProvider: new LineSegmentPaletteProvider(),
    });
    sciChartSurface.renderableSeries.add(lineSegment1);
    // #region_B_end

    return { sciChartSurface, wasmContext };
}

lineSegmentPaletteProvider("scichart-root");

export async function builderLineSegmentPaletteProvider(divElementId) {
    // #region_C_start
    const { 
        chartBuilder,
        EThemeProviderType,
    } = SciChart;

    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Navy } },
        series: [
            // {
            //     type: SciChart.ESeriesType.FastLineSegmentRenderableSeries, // TODO
            //     xyData: {
            //         xValues: [0.5, 1, 2, 3, 5, 4, 6, 7, 8, 9],
            //         yValues: [4.5, 3.2, 5.1, 2.8, 4.0, 3.5, 4.8, 3.0, 2.3, 7.1],
            //     },
            //     options: {
            //     }
            //}
        ]
    })
    // #region_C_end

    return { sciChartSurface, wasmContext };
}