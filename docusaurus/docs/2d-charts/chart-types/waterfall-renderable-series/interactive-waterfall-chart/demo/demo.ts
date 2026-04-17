import * as SciChart from "scichart";

// Generate synthetic spectral data for one "slice" of the waterfall.
// Returns xValues and yValues that look like a frequency spectrum.
function generateSpectralData(sliceIndex: number, spectraSize: number) {
    const xValues: number[] = [];
    const yValues: number[] = [];
    for (let i = 0; i < spectraSize; i++) {
        xValues.push(i);
        // Combine several sine components with per-slice variation to simulate spectral peaks
        const val =
            2.0 * Math.sin((2 * Math.PI * i) / (20 + sliceIndex * 0.2)) +
            5 * Math.sin((2 * Math.PI * i) / (10 + sliceIndex * 0.01)) +
            10 * Math.sin((2 * Math.PI * i) / (5 + sliceIndex * -0.002)) +
            2.0 * Math.random();
        // Clamp to a realistic dBFS range
        yValues.push(Math.max(-30, Math.min(val, -5) > -5 ? Math.random() * 9 - 6 : val));
    }
    yValues[0] = -30;
    return { xValues, yValues };
}

async function interactiveWaterfallChart(divElementId: string) {
    // #region_A_start
    // Demonstrates how to create a Spectral Waterfall Chart using SciChart.js.
    // The waterfall effect is achieved by giving each series its own X and Y axis
    // and using overrideOffset to shift each axis so the series appear stacked in depth.
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        EAxisAlignment,
        EXyDirection,
        NumberRange,
        MouseWheelZoomModifier,
        ZoomExtentsModifier,
        ZoomPanModifier,
        SeriesSelectionModifier,
        SciChartJsNavyTheme,
    } = SciChart;
    // or, for npm: import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        disableAspect: true,
    });

    const seriesCount = 30;
    const spectraSize = 200;

    for (let i = 0; i < seriesCount; i++) {
        // Each series gets its own Y axis, offset upward to create the depth effect.
        // overrideOffset shifts the axis position, stacking series behind one another.
        const yAxis = new NumericAxis(wasmContext, {
            id: `Y${i}`,
            axisAlignment: EAxisAlignment.Left,
            visibleRange: new NumberRange(-50, 60),
            isVisible: i === seriesCount - 1, // only the last (frontmost) axis is visible
            overrideOffset: 3 * -i,           // each axis is offset 3px upward
        });
        sciChartSurface.yAxes.add(yAxis);

        // Each series also gets its own X axis, offset to the right for the depth effect.
        const xAxis = new NumericAxis(wasmContext, {
            id: `X${i}`,
            axisAlignment: EAxisAlignment.Bottom,
            growBy: new NumberRange(0, 0.2),
            isVisible: i === seriesCount - 1, // only the last (frontmost) axis is visible
            overrideOffset: 2 * i,            // each axis is offset 2px to the right
        });
        sciChartSurface.xAxes.add(xAxis);

        const { xValues, yValues } = generateSpectralData(i, spectraSize);
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                id: `S${i}`,
                xAxisId: `X${i}`,
                yAxisId: `Y${i}`,
                stroke: "#64BAE4",
                strokeThickness: 1,
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues,
                    yValues,
                    dataSeriesName: `Spectra ${i}`,
                }),
            })
        );
    }

    // Selection modifier highlights hovered / clicked series
    sciChartSurface.chartModifiers.add(
        new SeriesSelectionModifier({
            enableHover: true,
            enableSelection: true,
            onHoverChanged: (args) => {
                args.allSeries.forEach((s) => {
                    s.stroke = s.isHovered || s.isSelected ? "#FFBE93" : "#64BAE4";
                    s.strokeThickness = s.isHovered || s.isSelected ? 3 : 1;
                });
            },
            onSelectionChanged: (args) => {
                args.allSeries.forEach((s) => {
                    s.stroke = s.isSelected ? "White" : s.isHovered ? "#FFBE93" : "#64BAE4";
                    s.strokeThickness = s.isSelected || s.isHovered ? 3 : 1;
                });
            },
        }),
        new ZoomPanModifier({ enableZoom: true, xyDirection: EXyDirection.XDirection }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
    );
    // #region_A_end
}

interactiveWaterfallChart("scichart-root");
